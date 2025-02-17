"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Upload from "@/components/ui/upload";
import { useState } from "react";
import { TrainModelInput } from "common/inferred";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/app/config";

export default function Train() {
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [type, setType] = useState<"Man" | "Woman" | "Others" | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [ethnicity, setEthnicity] = useState<
    | "White"
    | "Black"
    | "Asian_American"
    | "East_Asian"
    | "South_East_Asian"
    | "South_Asian"
    | "Middle_Eastern"
    | "Hispanic"
    | "Pacific"
    | null
  >(null);
  const [eyeColor, setEyeColor] = useState<
    "Brown" | "Blue" | "Hazel" | "Gray" | null
  >(null);
  const [bald, setBald] = useState<boolean | null>(null);
  const router = useRouter();
  const { getToken } = useAuth();

  async function trainModel() {
    const input: TrainModelInput = {
      zipUrl: zipUrl!,
      type: type!,
      age: parseInt(age!),
      name: name!,
      eyeColor: eyeColor!,
      ethnicity: ethnicity!,
      bald: bald!,
    };
    const token = await getToken();
    console.log(token);
    const res = await axios.post(`${BACKEND_URL}/ai/training`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex">
                <div className="flex flex-col space-y-1.5 flex-1 mr-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of the Model"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 flex-1">
                  <Label htmlFor="name">Type</Label>
                  <Select onValueChange={(value) => setType(value as any)}>
                    <SelectTrigger id="name">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col space-y-1.5 flex-1 mr-2">
                  <Label htmlFor="name">Age</Label>
                  <Input
                    id="name"
                    placeholder="Age of the Model"
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 flex-1">
                  <Label htmlFor="name">Ethnicity</Label>
                  <Select onValueChange={(value) => setEthnicity(value as any)}>
                    <SelectTrigger id="name">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Asian_American">
                        Asian American
                      </SelectItem>
                      <SelectItem value="East_Asian">East Asian</SelectItem>
                      <SelectItem value="South_East_Asian">
                        South East Asian
                      </SelectItem>
                      <SelectItem value="South_Asian">South Asian</SelectItem>
                      <SelectItem value="Middle_Eastern">
                        Middle Eastern
                      </SelectItem>
                      <SelectItem value="Pacific">Pacific</SelectItem>
                      <SelectItem value="Hispanic">Hispanic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Eye Color</Label>
                <Select onValueChange={(value) => setEyeColor(value as any)}>
                  <SelectTrigger id="name">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Hazel">Hazel</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Bald</Label>
                <Select onValueChange={(value) => setBald(value === "true")}>
                  <SelectTrigger id="name">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Upload
                onUploadDone={(zipUrl) => {
                  setZipUrl(zipUrl);
                }}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={
              !zipUrl ||
              !name ||
              !type ||
              !age ||
              !ethnicity ||
              !eyeColor ||
              !bald
            }
            onClick={trainModel}
          >
            Create Model
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
