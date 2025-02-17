export interface TImage {
  id: string;
  imageUrl: string;
  status: string;
}

export function ImageCard(props: TImage) {
  return (
    <div className="rounded-lg hover:border-red-300 border-2 max-w-[300px] items-center p-2 cursor-pointer">
      <div className="flex">
        <img src={props.imageUrl} alt="pack" />
      </div>
      
    </div>
  );
}
