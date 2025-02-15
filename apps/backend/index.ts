import express from "express";
import {
  GenerateImage,
  GenerateImagesFromPack,
  TrainModel,
} from "common/types";
import { prismaClient } from "db";

const app = express();
app.use(express.json());

const USER_ID = "1";

const PORT = process.env.PORT || 8080;

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json(parsedBody.error);
    return;
  }
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethnicity: parsedBody.data.ethnicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
    },
  });

  res.json({
    modelId: data.id,
  });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json(parsedBody.error);
    return;
  }
  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      imageUrl: "",
    },
  });
  res.json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
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
  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt) => ({
      prompt: prompt.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      imageUrl: "",
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

app.get("/image/bulk", async (req, res) => {
  const imageIds = req.query.images as string[];
  const limit = (req.query.limit as string) ?? "10";
  const offset = (req.query.offset as string) ?? "0";

  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: {
        in: imageIds,
      },
      userId: USER_ID,
    },
    take: parseInt(limit),
    skip: parseInt(offset),
  });

  res.json({
    images: imagesData,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
