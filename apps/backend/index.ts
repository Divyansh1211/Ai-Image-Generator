import express, {
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import {
  GenerateImage,
  GenerateImagesFromPack,
  TrainModel,
} from "common/types";
import { prismaClient } from "db";
import { S3Client } from "bun";
import { FalAIModel } from "./models/FalAIModel";
import cors from "cors";
import { authMiddleware } from "./middleware";
import crypto from "crypto";
import { Webhook } from "svix";

const app = express();
app.use(cors());
app.use(express.json());

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  bucket: process.env.S3_BUCKET_NAME,
  endpoint: process.env.ENDPOINT,
};

const PORT = process.env.PORT || 8080;

const falAiModel = new FalAIModel();

app.get("/pre-signed-url", authMiddleware, async (req, res) => {
  const key = `models/${Date.now()}_${Math.random()}.zip`;
  const url = S3Client.presign(key, {
    ...credentials,
    method: "PUT",
    expiresIn: 3600,
    type: "image/jpeg",
    acl: "public-read",
  });
  res.json({
    url,
    key,
  });
});

app.post(
  "/ai/training",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsedBody = TrainModel.safeParse(req.body);
    const images = req.body.images;

    if (!parsedBody.success) {
      res.status(411).json(parsedBody.error);
      return;
    }

    const { request_id, response_url } = await falAiModel.trainModel(
      parsedBody.data.zipUrl,
      parsedBody.data.name
    );

    const data = await prismaClient.model.create({
      data: {
        name: parsedBody.data.name,
        type: parsedBody.data.type,
        age: parsedBody.data.age,
        ethnicity: parsedBody.data.ethnicity,
        eyeColor: parsedBody.data.eyeColor,
        bald: parsedBody.data.bald,
        userId: req.userId.toString(),
        zipUrl: parsedBody.data.zipUrl,
        falAiRequestId: request_id,
      },
    });

    res.json({
      modelId: data.id,
    });
  }
);

app.post("/ai/generate", authMiddleware, async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json(parsedBody.error);
    return;
  }

  const model = await prismaClient.model.findUnique({
    where: {
      id: parsedBody.data.modelId,
    },
  });

  if (!model || !model?.tensorPath) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  const { request_id, response_url } = await falAiModel.generateImage(
    parsedBody.data.prompt,
    model?.tensorPath
  );

  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: req.userId.toString(),
      imageUrl: "",
      falAiRequestId: request_id,
    },
  });
  res.json({
    imageId: data.id,
  });
});

app.post("/pack/generate", authMiddleware, async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json(parsedBody.error);
    return;
  }

  const prompts = await prismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId,
    },
  });

  let requestIds: { request_id: string }[] = await Promise.all(
    prompts.map((prompt) => {
      return falAiModel.generateImage(prompt.prompt, parsedBody.data.modelId);
    })
  );

  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt, index) => ({
      prompt: prompt.prompt,
      modelId: parsedBody.data.modelId,
      userId: req.userId.toString(),
      imageUrl: "",
      falAiRequestId: requestIds[index].request_id,
    })),
  });
  res.json({
    images: images.map((image) => image.id),
  });
});

app.get("/pack/bulk", async (req, res) => {
  const packs = await prismaClient.packs.findMany();
  res.json(packs);
});

app.get("/image/bulk", authMiddleware, async (req, res) => {
  const imageIds = req.query.images as string[];
  const limit = (req.query.limit as string) ?? "10";
  const offset = (req.query.offset as string) ?? "0";

  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: {
        in: imageIds,
      },
      userId: req.userId.toString(),
    },
    take: parseInt(limit),
    skip: parseInt(offset),
  });

  res.json({
    images: imagesData,
  });
});

app.get("/models", authMiddleware, async (req, res) => {
  const models = await prismaClient.model.findMany({
    where: {
      OR: [{ userId: req.userId.toString() }, { open: true }],
    },
  });
  res.status(200).json({ models });
});

app.post("/fal-ai/webhook/train", async (req, res) => {
  const requestId = req.body.request_id;

  const { imageUrl } = await falAiModel.generateImageSync(req.body.tensor_path);

  await prismaClient.model.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      trainingStatus: "Generated",
      tensorPath: req.body.tensor_path,
      thumbnail: imageUrl,
    },
  });
  res.status(200).send("OK");
});

app.post("/fal-ai/webhook/image", async (req, res) => {
  const requestId = req.body.request_id;

  await prismaClient.outputImages.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      imageUrl: req.body.image_url,
      status: "Generated",
    },
  });
  res.status(200).send("OK");
});

app.post("/webhook/create-user", async (req, res) => {
  try {
    if (!WEBHOOK_SECRET) return;
    const wh = new Webhook(WEBHOOK_SECRET);

    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing svix headers",
      });
    }

    let evt: any;
    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": svix_id as string,
        "svix-timestamp": svix_timestamp as string,
        "svix-signature": svix_signature as string,
      });
    } catch (err: any) {
      console.log("Error: Could not verify webhook:", err.message);
      return void res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    try {
      const user = await prismaClient.user.create({
        data: {
          username: evt.data.first_name,
          profilePicture: evt.data.profile_image_url,
          id: evt.data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      res.status(200).send(`User ${user.username} created`);
    } catch (err: any) {
      console.log("Error: Could not create user:", err.message);
      return void res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
