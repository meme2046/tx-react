import { AVATAR_SRC } from "@/consts";
import { ProgressSpinner } from "@/components/progress-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { SidebarItems } from "@/components/layout/sidebar-items";
import { useSnapshot } from "valtio";
import { useEffect } from "react";
import { http } from "@/utils";
import { setUSDToCNY, store } from "@/lib/valtio";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { qiniuBaseURL } = useSnapshot(store);

  useEffect(() => {
    http<{ price: number; ratio: string; increase: string }>(
      `${qiniuBaseURL}/baidu/usdcnh.json`,
    ).then((res) => {
      setUSDToCNY(res.price);
    });
  }, [qiniuBaseURL]);

  return (
    <SidebarProvider className="w-full h-full p-0 m-0" defaultOpen={false}>
      <ProgressSpinner />
      <Sidebar className="z-50" variant="floating">
        <SidebarHeader>
          <div className="flex gap-2 items-center">
            <Avatar className="ring">
              <AvatarImage src={AVATAR_SRC.shadcn} alt="@shadcn_sidebar" />
              <AvatarFallback className="animate-pulse bg-linear-to-tr from-info to-primary"></AvatarFallback>
            </Avatar>
            <span className="font-[DeliusSwashCaps]">Meme</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar-thin">
          <SidebarItems />
        </SidebarContent>
      </Sidebar>
      <main className="grow overflow-auto scrollbar-thin">
        <Navbar />
        {/* <div className="px-1 min-h-[calc(100vh-64px)]"> */}
        <Outlet />
        {/* </div> */}
      </main>
    </SidebarProvider>
  );
}
