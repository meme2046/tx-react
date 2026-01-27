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
  const div = document.createElement("div");
  div.id = id;
  div.style.position = "absolute";
  pos === "left" ? (div.style.left = `10px`) : (div.style.right = `10px`);
  div.style.top = `10px`;
  div.style.padding = "4px";
  div.classList.add("text-primary");
  div.classList.add("bg-accent/80");
  div.classList.add("-translate-y-1/2");
  div.style.borderRadius = "8px";
  div.style.zIndex = "100";
  div.style.width = width;
  container.insertBefore(div, container.firstChild);
  return div;
}
