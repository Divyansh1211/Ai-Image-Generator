"use client";

import { BACKEND_URL } from "@/app/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
interface TModel {
  id: string;
  thumbnail: string;
  name: string;
}

export function SelectModel({
  setSelectedModel,
  selectedModel,
}: {
  selectedModel: string | null;
  setSelectedModel: (modelId: string) => void;
}) {
  const [models, setModels] = useState<TModel[]>([]);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
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
      setModelLoading(false);
    })();
  }, []);

  return (
    <div className="text-2xl font-semibold pb-2">
      Select Model
      <div>
        {modelLoading && (
          <div className="grid grid-cols-6 gap-2 pt-2">
            <Skeleton className="h-20 w-20 rounded" />
            <Skeleton className="h-20 w-20 rounded" />
            <Skeleton className="h-20 w-20 rounded" />
          </div>
        )}
        <div className="grid grid-cols-6 gap-2">
          {models.map((model) => {
            return (
              <div
                onClick={() => {
                  setSelectedModel(model.id);
                }}
              >
                <div>
                  <img
                    className={` ${selectedModel === model.id ? "border border-red-300" : ""} cursor-pointer p-1 rounded-md`}
                    src={model.thumbnail}
                    alt="model"
                  />
                  <div className="text-[16px] font-semibold">{model.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
