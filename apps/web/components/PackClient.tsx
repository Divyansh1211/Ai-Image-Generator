"use client";

import { useState } from "react";
import { SelectModel } from "./Models";
import { PackCards, TPack } from "./PackCards";

export function PackClient({ packs }: { packs: TPack[] }) {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  return (
    <>
      <SelectModel
        setSelectedModel={setSelectedModelId}
        selectedModel={selectedModelId}
      />
      <div className="grid md:grid-cols-3 gap-4 p-4 grid-cols-1">
        {packs.map((pack) => {
          return <PackCards selectedModelId={selectedModelId} {...pack} />;
        })}
      </div>
    </>
  );
}
