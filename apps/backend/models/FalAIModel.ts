import type { FluxLoraOutput } from "@fal-ai/client/endpoints";
import { BaseModel } from "./BaseModel";
import { fal } from "@fal-ai/client";

export class FalAIModel {
  constructor() {}

  public async generateImage(prompt: string, tensorPath: string) {
    // const { request_id, response_url } = await fal.queue.submit(
    //   "fal-ai/flux-lora",
    //   {
    //     input: {
    //       prompt: prompt,
    //       loras: [
    //         {
    //           path: tensorPath,
    //           scale: 1,
    //         },
    //       ],
    //     },
    //     webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`,
    //   }
    // );
    // return { request_id, response_url };
    return { request_id: "123", response_url: "https://google.com" };
  }

  public async trainModel(zippedURl: string, triggerWord: string) {
    // const { request_id, response_url } = await fal.queue.submit(
    //   "fal-ai/flux-lora-fast-training",
    //   {
    //     input: {
    //       images_data_url: zippedURl,
    //       trigger_word: triggerWord,
    //     },
    //     webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`,
    //   }
    // );
    // return { request_id, response_url };
    return { request_id: "123", response_url: "https://google.com" };
  }

  public async generateImageSync( tensorPath: string) {
    const res = await fal.subscribe("fal-ai/flux-lora", {
      input: {
        prompt:
          "Generate a headShot for this user in front of a white background",
        loras: [
          {
            path: tensorPath,
            scale: 1,
          },
        ],
      },
    });
    return {
      imageUrl: res.data.images[0].url
    }
  }
}
