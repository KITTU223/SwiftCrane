import { Button } from "@/components/ui/button";
import LogOut from "@/modules/auth/components/log-out";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import Image from "next/image";

export default async function Home() {
  await requireAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LogOut>
        <Button>Log out</Button>
      </LogOut>
    </div>
  );
}
