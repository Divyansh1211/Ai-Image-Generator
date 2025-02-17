"use client";

import { Button } from "./ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { SelectModel } from "./Models";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";

export const GenerateImage = () => {
  const { getToken } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  return (
    <>
      <SelectModel
        setSelectedModel={setSelectedModel}
        selectedModel={selectedModel}
      />
      <div className="items-center justify-center flex">
        <div className="flex justify-center mt-4">
          <Textarea
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            placeholder="Describe the Image you'd like to create"
            className="p-3 w-2xl border border-blue-100 hover:border-blue-300 focus:border-blue-300 outline-none"
          ></Textarea>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant={"secondary"}
            onClick={async () => {
              const token = await getToken();
              await axios.post(
                `${BACKEND_URL}/ai/generate`,
                {
                  prompt,
                  modelId: selectedModel,
                  num: 1,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }}
          >
            Generate Image
          </Button>
        </div>
      </div>
    </>
  );
};
