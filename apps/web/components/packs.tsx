import axios from "axios";
import { PackCards, TPack } from "./PackCards";
import { BACKEND_URL } from "@/app/config";

async function getPacks() {
  const res = await axios.get(`${BACKEND_URL}/pack/bulk`);
  return res.data;
}

export async function Packs() {
  const packs: TPack[] = await getPacks();
  return (
    <div className="grid md:grid-cols-3 gap-4 p-4 grid-cols-1">
      {packs.map((pack) => {
        return <PackCards {...pack} />;
      })}
    </div>
  );
}
