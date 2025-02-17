"use client";

import { BACKEND_URL } from "@/app/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { ImageCard, TImage } from "./ImageCard";
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
  const [images, setImages] = useState<TImage[]>([]);
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const images = await getImages(token);
      setImages(images);
    })();
  }, []);
  return (
    <div>
      {!images.length && <NoImage />}
      {images.map((image) => {
        return <ImageCard {...image} />;
      })}
    </div>
  );
}

function NoImage() {
  return <div>No Image</div>;
}
