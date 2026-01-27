import Crosshair from "@/components/Crosshair";
import ElectricBorder from "@/components/ElectricBorder";
import SplitText from "@/components/SplitText";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, type RefObject } from "react";

export const Route = createFileRoute("/_layout/reactbits/crosshair")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Crosshair",
      },
    ],
  }),
});

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 overflow-hidden">
      <ElectricBorder className="">
        <div ref={containerRef} className="relative">
          <Crosshair containerRef={containerRef as RefObject<HTMLElement>} />
          <div className="flex justify-center items-center h-160">
            <a>
              <SplitText
                text={`containerRef defaults to "window" if not provided`}
                className="text-4xl font-semibold"
              />
            </a>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}
