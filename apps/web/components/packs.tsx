import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { PackClient } from "./PackClient";
import { TPack } from "./PackCards";

async function getPacks() {
  const res = await axios.get(`${BACKEND_URL}/pack/bulk`);
  return res.data;
}

export async function Packs() {
  const packs: TPack[] = await getPacks();
  return <PackClient packs={packs} />;
}
