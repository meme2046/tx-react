import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICON_SRC, SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
import GoldSVG from "@/assets/gold.svg";
import SilverSVG from "@/assets/silver.svg";

export const Route = createFileRoute("/_layout/tests")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Tests",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <p>Hello "/_layout/test"!</p>
      <Checkbox id="terms-2" />
      <Combobox
        list={[
          { name: "item1", value: "1" },
          { name: "item2", value: "2" },
        ]}
      />

      <div className="flex gap-1">
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["refresh"]}
            className={`animate-spin text-indigo-500`}
          />
        </Button>
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["refresh1"]}
            className={`animate-spin w-6 text-violet-500`}
          />
        </Button>
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["loading1"]}
            className={`animate-spin text-fuchsia-500`}
          />
        </Button>
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["loading2"]}
            className={`animate-spin text-pink-500`}
          />
        </Button>
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["loading3"]}
            className={`animate-spin text-rose-500`}
          />
        </Button>
        <Button variant="ghost" size="icon">
          <ReactSVG
            src={ICON_SRC["loading4"]}
            className={`animate-spin text-blue-500`}
          />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ReactSVG
            src={ICON_SRC["processing"]}
            className="text-sky-500 animate-spin w-6"
          />
        </Button>
        <Button variant="outline" className="gap-1">
          <ReactSVG
            src={ICON_SRC["processing"]}
            className="text-purple-500 animate-spin w-6"
          />
          <span className="text-xs">processing</span>
        </Button>
      </div>
      <div>
        <ReactSVG src={SVG_SRC["line"]} className="text-rose-500 w-64" />
        <ReactSVG src={SVG_SRC["line"]} className="text-primary w-64" />
        <div className="flex gap-1 items-center">
          <ReactSVG src={SVG_SRC["btc"]} className="w-12" />
          <ReactSVG src={SVG_SRC["btc1"]} className="text-orange-400 w-12" />
          <Button variant="outline" size="icon-lg" className="rounded-full">
            <ReactSVG src={SVG_SRC["btc"]} />
          </Button>
          <Button variant="outline" className="gap-1">
            <ReactSVG src={SVG_SRC["btc1"]} className="text-orange-400 w-8" />
            <span className="text-xs">btc</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <ReactSVG src={SVG_SRC["okx"]} className="w-8 bg-lime-400" />
            <span className="text-xs">okx</span>
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="size-50 border bg-[repeating-linear-gradient(45deg,var(--background)_0px,var(--background)_13px,var(--muted)_13px,var(--muted)_14px)]">
          斜线背景
        </div>
        <div className="size-50 border bg-size-[5px_5px] bg-radial-[at_50%_50%] from-foreground/50 from-0% to-transparent to-10%">
          dot背景
        </div>
        <div className="size-50 border bg-slash">斜线背景</div>
        <div className="size-50 border bg-dot">dot背景</div>
      </div>
      <div>
        <ReactSVG src={GoldSVG} className="w-12" />
        <ReactSVG src={SilverSVG} className="w-12" />
      </div>
    </div>
  );
}
