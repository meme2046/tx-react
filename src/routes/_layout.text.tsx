import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ICON_SRC, SVG_SRC } from "@/consts";
import { createFileRoute } from "@tanstack/react-router";
import { ReactSVG } from "react-svg";
export const Route = createFileRoute("/_layout/text")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Text",
      },
    ],
  }),
});

function RouteComponent() {
  const alertData: { type: string; label: string }[] = [
    { type: "primary", label: "default" },
    { type: "secondary", label: "secondary" },
    { type: "destructive", label: "destructive" },
    { type: "muted", label: "outline" },
    { type: "accent", label: "outline" },
  ];
  const renderAlert = (type: string, label: string) => (
    <Alert key={type}>
      <AlertTitle className="flex">
        <Button variant={label as "default"}>
          <ReactSVG src={ICON_SRC["rocket"]} className="w-6" />
          {type}
        </Button>
      </AlertTitle>
      <AlertDescription>
        <p className={`text-${type}`}>text-{type}</p>
        <p className={`bg-${type} text-${type}-foreground`}>
          bg-{type} | text-{type}-foreground
        </p>
        <p className={`bg-${type}-foreground text-${type}`}>
          bg-{type}-foreground | text-{type}
        </p>
      </AlertDescription>
    </Alert>
  );

  const fontData: { name: string; desc: string }[] = [
    { name: "", desc: "default" },
    { name: "font-sans", desc: "font-sans" },
    { name: "font-[Inter]", desc: "Inter" },
    { name: "font-serif", desc: "font-serif" },
    { name: "font-[Gabriela]", desc: "Gabriela" },
    { name: "font-mono", desc: "font-mono" },
    { name: "font-[DeliusSwashCaps]", desc: "DeliusSwashCaps" },
    { name: "font-[Sniglet]", desc: "Sniglet" },
    // { name: "font-[JetBrainsMono]", desc: "JetBrainsMono" },
    // { name: "font-[Nunito]", desc: "Nunito" },
    // { name: "font-[Outfit]", desc: "Outfit" },
  ];
  const demoText =
    "Design Stunning UIs Faster with Shadcn Theme Generator | 中文 | English | 0123456789";
  return (
    <div className="flex flex-col gap-4 bg-dot">
      <Alert>
        <AlertTitle>字体</AlertTitle>
        <AlertDescription className="text-lg">
          {fontData.map(({ name, desc }, index) => (
            <div key={index} className="relative">
              <p className={name}>
                <span>{demoText}&nbsp;</span>
                <Badge variant="outline" className="shadow">
                  &nbsp;&lt;-&nbsp;{desc}
                </Badge>
              </p>
              <ReactSVG
                src={SVG_SRC["line"]}
                className="absolute left-0 bottom-0 text-primary w-full"
              />
            </div>
          ))}
        </AlertDescription>
      </Alert>
      {alertData.map(({ type, label }) => renderAlert(type, label))}
      <div className="bg-foreground">
        ['『', '』', '✔', '✘', '❗', '⭕', '❓', '❌', '⤴︎', '⤵︎', '⇡', '⇣', '⤶',
        '↩', '↖', '↙', '↗', '↘', '╰›']
        {/* <div className="size-50 border bg-size-[5px_5px] bg-radial-[at_50%_50%] from-foreground/50 from-0% to-transparent to-10%"></div> */}
      </div>
    </div>
  );
}
