"use client";

import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRef } from "react";

export default function Hero() {
  const plugin = useRef(Autoplay({ delay: 1000, stopOnInteraction: true }));
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <div className="max-w-3xl">
        <h1 className=" text-8xl p-2 text-center mb-7">
          Generate Images for yourself
        </h1>
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem className="basis-1/4">
              <img src="https://fal.media/files/rabbit/0FiW23RmTuPYSqUv6RSCc.png" />
            </CarouselItem>
            <CarouselItem className="basis-1/4">
              <img src="https://fal.media/files/tiger/9usTIEiR_6dbJNhfeR_ZW.png" />
            </CarouselItem>
            <CarouselItem className="basis-1/4">
              <img src="https://storage.googleapis.com/falserverless/gallery/yue.webp" />
            </CarouselItem>
            <CarouselItem className="basis-1/4">
              <img src="https://storage.googleapis.com/falserverless/gallery/Ben2/Vi9PBzFF8BfuKGsLCvoH-_773fe2c0efc744af900eaac2047b9b5f.webp" />
            </CarouselItem>
            <CarouselItem className="basis-1/4">
              <img src="https://storage.googleapis.com/falserverless/gallery/Ben2/Vi9PBzFF8BfuKGsLCvoH-_773fe2c0efc744af900eaac2047b9b5f.webp" />
            </CarouselItem>
            <CarouselItem className="basis-1/4">
              <img src="https://storage.googleapis.com/falserverless/gallery/Ben2/Vi9PBzFF8BfuKGsLCvoH-_773fe2c0efc744af900eaac2047b9b5f.webp" />
            </CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
        <div className="flex justify-center">
          <SignedIn>
            <Button
              variant={"secondary"}
              className="mt-4 px-16 py-6"
              size={"lg"}
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Dashboard
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button
                variant={"secondary"}
                className="mt-4 px-16 py-6"
                size={"lg"}
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
