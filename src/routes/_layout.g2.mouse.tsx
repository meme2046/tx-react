import { Base, type CommonConfig } from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/g2/mouse")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Mouse",
      },
    ],
  }),
});

function RouteComponent() {
  const config: CommonConfig = {
    type: "view",
    data: [
      { genre: "Sports", sold: 100 },
      { genre: "Strategy", sold: 115 },
      { genre: "Action", sold: 120 },
      { genre: "Shooter", sold: 350 },
      { genre: "Other", sold: 150 },
    ],
    encode: { x: "genre" },
    children: [
      {
        type: "interval",
        encode: { y: "sold", color: "genre" },
        viewStyle: {
          viewFill: "blue",
          viewFillOpacity: 0.3,
        },
      },
    ],
    onReady: ({ chart }) => {
      let containerMouseEntered = false;
      chart.on("afterrender", (e) => {
        const container = chart.getContainer();

        // 创建状态显示面板
        const statusPanel = document.createElement("div");
        statusPanel.id = "mouse-status-panel";
        statusPanel.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        z-index: 1000;
        min-width: 220px;
      `;

        // 更新状态显示
        const updateStatus = (isInside, eventInfo = {}) => {
          const status = isInside ? "✅ 鼠标在容器内" : "❌ 鼠标在容器外";
          const containerRect = container.getBoundingClientRect();

          statusPanel.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px;">${status}</div>
          <div>容器尺寸: ${container.offsetWidth} × ${container.offsetHeight}</div>
          <div>容器位置: (${Math.round(containerRect.left)}, ${Math.round(
            containerRect.top,
          )})</div>
          ${
            eventInfo.clientX !== undefined
              ? `<div>鼠标坐标: (${eventInfo.clientX}, ${eventInfo.clientY})</div>`
              : ""
          }
          ${eventInfo.type ? `<div>事件类型: ${eventInfo.type}</div>` : ""}
          <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
            移动鼠标到图表上试试看！
          </div>
        `;
        };

        if (container) {
          // 将状态面板添加到容器的父元素
          container.parentElement.style.position = "relative";
          container.parentElement.appendChild(statusPanel);

          // 初始化显示
          updateStatus(false);

          // 监听鼠标进入容器
          container.addEventListener("mouseenter", (e) => {
            containerMouseEntered = true;
            updateStatus(true, {
              type: e.type,
              clientX: e.clientX,
              clientY: e.clientY,
            });
          });

          // 监听鼠标在容器内移动
          container.addEventListener("mousemove", (e) => {
            if (containerMouseEntered) {
              updateStatus(true, {
                type: e.type,
                clientX: e.clientX,
                clientY: e.clientY,
              });
            }
          });

          // 监听鼠标离开容器
          container.addEventListener("mouseleave", (e) => {
            if (containerMouseEntered) {
              containerMouseEntered = false;
              updateStatus(false, {
                type: e.type,
                clientX: e.clientX,
                clientY: e.clientY,
              });
            }
          });
        }
      });
    },
  };
  return (
    <>
      <Base {...config} className="px-10" />
    </>
  );
}
