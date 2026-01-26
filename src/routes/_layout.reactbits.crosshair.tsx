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
    <ElectricBorder className="mx-10">
      <div ref={containerRef} className="relative h-160">
        <Crosshair
          containerRef={containerRef as RefObject<HTMLElement>}
          color="var(--color-primary)"
        />
        <div className="w-full h-full flex justify-center items-center">
          <a>
            <SplitText
              text={`containerRef defaults to "window" if not provided`}
              className="text-4xl font-semibold"
            />
          </a>
        </div>
      </div>
    </ElectricBorder>
  );
}
