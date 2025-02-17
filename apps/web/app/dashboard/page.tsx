import { Camera } from "@/components/camera";
import { GenerateImage } from "@/components/GenerateImage";
import { Packs } from "@/components/packs";
import Train from "@/components/Train";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="flex justify-center mt-2">
      <div className="w-4xl">
        <Tabs defaultValue="camera">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="generate">Generate Image</TabsTrigger>
              <TabsTrigger value="train">Train a Modal</TabsTrigger>
              <TabsTrigger value="packs">Packs</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="generate">
            <GenerateImage />
          </TabsContent>
          <TabsContent value="train">
            <Train />
          </TabsContent>
          <TabsContent value="packs">
            <Packs />
          </TabsContent>
          <TabsContent value="camera">
            <Camera />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
