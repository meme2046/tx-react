export function getPanel({
  container,
  id = "data-panel",
  width = "auto",
  pos = "right",
}: {
  container: HTMLElement;
  id?: string;
  width?: string;
  pos?: "left" | "right";
}) {
  if (!(container && container.parentElement)) {
    throw new Error("✘ container or parent element not found");
  }

  const panel = document.getElementById(id);
  if (panel) {
    return panel;
  }

  container.parentElement.style.position = "relative";
  const div = document.createElement("div") as any;
  div.id = id;
  div.style.position = "absolute";
  pos === "left" ? (div.style.left = `8px`) : (div.style.right = `8px`);
  div.style.padding = "4px";
  div.classList.add("text-primary");
  div.classList.add("bg-accent/80");
  div.classList.add("transition-[transform,opacity]");
  div.classList.add("duration-[100ms,400ms]");
  div.classList.add("ease-[ease-out,ease-in-out]");
  div.style.borderRadius = "8px";
  div.style.zIndex = "100";
  div.style.width = width;

  container.insertBefore(div, container.firstChild);
  // // 添加平滑更新方法
  div.updateY = (y: number) => {
    if (!div.isAnimating) {
      (div as any).isAnimating = true;

      requestAnimationFrame(() => {
        div.style.transform = `translateY(calc(-50% + ${y}px))`;
        div.isAnimating = false;
      });
    }
  };

  return div;
}
