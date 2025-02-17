export interface TPack {
  name: string;
  imageUrl1: string;
  imageUrl2: string;
  description: string;
}

export function PackCards(props: TPack) {
  return (
<div className="rounded-lg hover:border-red-300 border-2 items-center p-2 cursor-pointer">
      <div className="flex">
        <img src={props.imageUrl1} alt="pack" width="50%" />
        <img src={props.imageUrl2} alt="pack" width="50%" />
      </div>
      <div className="text-2xl font-semibold">
        <h1>{props.name}</h1>
      </div>
      <div className="text-sm">
        <p>{props.description}</p>
      </div>
    </div>
  );
}
