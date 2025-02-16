"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/app/config";
import JSZip from "jszip";

export default function Upload() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
        <CloudUploadIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400" />
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.onchange = async () => {
              const files = input.files;
              const zip = new JSZip();
              if (!files) return;
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file) return;
                zip.file(file?.name, file);
              }
              const blob = await zip.generateAsync({ type: "blob" });
              const formData = new FormData();
              const response = await axios.get(`${BACKEND_URL}/pre-signed-url`);
              const { url, key } = response.data;
              formData.append("file", blob);
              formData.append("key", url);
              const res = await axios.put(url, formData);
              console.log(res);
            };
            input.click();
          }}
        >
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
