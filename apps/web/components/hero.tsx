import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function Hero() {
  return (
    <div className="flex justify-center">
      <div className="max-w-3xl">
        <h1 className=" text-8xl p-2 text-center">Generate Images for yourself</h1>
        <Carousel>
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
      </div>
    </div>
  );
}
