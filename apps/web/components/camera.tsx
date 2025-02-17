"use client";

import { BACKEND_URL } from "@/app/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { ImageCard, ImageCardSkeleton, TImage } from "./ImageCard";
import { useEffect, useState } from "react";

async function getImages(token: string): Promise<TImage[]> {
  const res = await axios.get(`${BACKEND_URL}/image/bulk`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.images;
}

export function Camera() {
  const { getToken } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [images, setImages] = useState<TImage[]>([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const images = await getImages(token);
      setImages(images);
      setImageLoading(false);
    })();
  }, []);
  return (
    <div className="grid md:grid-cols-4 grid-cols-1 gap-2">
      {images.map((image) => {
        {
          !images.length && <NoImage />;
        }
        return <ImageCard {...image} />;
      })}
      {imageLoading && <ImageCardSkeleton />}
    </div>
  );
}

function NoImage() {
  return <div>No Image</div>;
}
