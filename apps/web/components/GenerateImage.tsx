"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

interface TModel {
  id: string;
  thumbnail: string;
  name: string;
}

export const GenerateImage = () => {
  const [models, setModels] = useState<TModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { getToken } = useAuth();
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const res = await axios.get(`${BACKEND_URL}/models`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModels(res.data.models);
      setSelectedModel(res.data.models[0].id);
    })();
  }, []);
  return (
    <div className="h-[80vh] items-center justify-center flex">
      <div className="text-2xl font-semibold pb-2">
        Select Model
        <div className="max-w-2xl">
          {models.map((model) => {
            return (
              <div
                className={`${selectedModel === model.id ? " border-red-300" : ""} cursor-pointer`}
                onClick={() => {
                  setSelectedModel(model.id);
                }}
              >
                <div className="grid grid-cols-6 gap-2">
                  <img src={model.thumbnail} alt="model" />
                </div>
                <div className="text-[16px] font-semibold">{model.name}</div>
              </div>
            );
          })}
          <div className="flex justify-center mt-4">
            <Textarea className="py-8 px-4 w-2xl border border-blue-100 hover:border-blue-300 focus:border-blue-300 outline-none"></Textarea>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="button" variant={"secondary"}>
              Generate Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
