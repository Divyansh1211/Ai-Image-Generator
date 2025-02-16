import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function AppBar() {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="text-2xl font-bold">PhotoAI</div>
      <div>
        <SignedOut>
          <Button >
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
