import { BACKEND_URL } from "@/app/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export interface TPack {
  id: string;
  name: string;
  imageUrl1: string;
  imageUrl2: string;
  description: string;
}

export function PackCards(props: TPack & {selectedModelId: string | null}) {
  const {getToken} = useAuth();
  return (
    <div className="rounded-lg hover:border-red-300 border-2 items-center p-2 cursor-pointer" onClick={async ()=>{
      const token = await getToken();
      await axios.post(`${BACKEND_URL}/pack/generate`,{
        packId: props.id,
        modelId: props.selectedModelId,

      },{
        headers: {
          Authorization: `Bearer ${token}`}
      })
    }}>
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
