import { Skeleton } from "./ui/skeleton";

export interface TImage {
  id: string;
  imageUrl: string;
  status: string;
}

export function ImageCard(props: TImage) {
  return (
    <div className="rounded-lg  border-2 max-w-[300px] items-center p-2 cursor-pointer">
      <div className="flex">
        {props.status === "Generated" ? (
          <img src={props.imageUrl} alt="pack" />
        ) : (
          
          <Skeleton className="rounded h-40 w-300">
          </Skeleton>
        )}
      </div>
    </div>
  );
}

export function ImageCardSkeleton() {
  return (
    <Skeleton className="rounded-lg hover:border-red-300 border-2 max-w-[300px] items-center p-2 h-40" />
  );
}
