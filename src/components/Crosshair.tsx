import React, { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

const getMousePos = (
  e: Event,
  container?: HTMLElement | null,
): { x: number; y: number } => {
  const mouseEvent = e as MouseEvent;
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - bounds.left,
      y: mouseEvent.clientY - bounds.top,
    };
  }
  return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

interface CrosshairProps {
  color?: string;
  containerRef?: RefObject<HTMLElement>;
}

const Crosshair: React.FC<CrosshairProps> = ({
  color = "white",
  containerRef = null,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  let mouse = { x: 0, y: 0 };

  useEffect(() => {
    const handleMouseMove = (ev: Event) => {
      const mouseEvent = ev as MouseEvent;
      mouse = getMousePos(mouseEvent, containerRef?.current);
      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        if (
          mouseEvent.clientX < bounds.left ||
          mouseEvent.clientX > bounds.right ||
          mouseEvent.clientY < bounds.top ||
          mouseEvent.clientY > bounds.bottom
        ) {
          gsap.to(
            [lineHorizontalRef.current, lineVerticalRef.current].filter(
              Boolean,
            ),
            { opacity: 0 },
          );
        } else {
          gsap.to(
            [lineHorizontalRef.current, lineVerticalRef.current].filter(
              Boolean,
            ),
            { opacity: 1 },
          );
        }
      }
    };

    const handleMouseLeave = () => {
      gsap.to(
        [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
        { opacity: 0 },
      );
    };

    const target: HTMLElement | Window = containerRef?.current || window;
    target.addEventListener("mousemove", handleMouseMove);
    target.addEventListener("mouseleave", handleMouseLeave);

    const renderedStyles: {
      [key: string]: { previous: number; current: number; amt: number };
    } = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    };

    gsap.set(
      [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
      { opacity: 0 },
    );

    const onMouseMove = (ev: Event) => {
      const mouseEvent = ev as MouseEvent;
      mouse = getMousePos(mouseEvent, containerRef?.current);
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y;

      // 只有当鼠标在容器范围内时才显示十字线
      let shouldShowCrosshair = !containerRef?.current;
      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        shouldShowCrosshair =
          mouseEvent.clientX >= bounds.left &&
          mouseEvent.clientX <= bounds.right &&
          mouseEvent.clientY >= bounds.top &&
          mouseEvent.clientY <= bounds.bottom;
      }

      if (shouldShowCrosshair) {
        gsap.to(
          [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean),
          {
            duration: 0.9,
            ease: "Power3.easeOut",
            opacity: 1,
          },
        );
      }

      requestAnimationFrame(render);

      target.removeEventListener("mousemove", onMouseMove);
    };

    target.addEventListener("mousemove", onMouseMove);

    const primitiveValues = { turbulence: 0 };

    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          if (lineHorizontalRef.current) {
            lineHorizontalRef.current.style.filter = "url(#filter-noise-x)";
          }
          if (lineVerticalRef.current) {
            lineVerticalRef.current.style.filter = "url(#filter-noise-y)";
          }
        },
        onUpdate: () => {
          if (filterXRef.current && filterYRef.current) {
            filterXRef.current.setAttribute(
              "baseFrequency",
              primitiveValues.turbulence.toString(),
            );
            filterYRef.current.setAttribute(
              "baseFrequency",
              primitiveValues.turbulence.toString(),
            );
          }
        },
        onComplete: () => {
          if (lineHorizontalRef.current && lineVerticalRef.current) {
            lineHorizontalRef.current.style.filter = "none";
            lineVerticalRef.current.style.filter = "none";
          }
        },
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: "power1",
        startAt: { turbulence: 1 },
        turbulence: 0,
      });

    const enter = () => tl.restart();
    const leave = () => {
      tl.progress(1).kill();
    };

    const render = () => {
      renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.current = mouse.y;

      for (const key in renderedStyles) {
        const style = renderedStyles[key];
        style.previous = lerp(style.previous, style.current, style.amt);
      }

      if (lineHorizontalRef.current && lineVerticalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }

      requestAnimationFrame(render);
    };

    const links: NodeListOf<HTMLAnchorElement> = containerRef?.current
      ? containerRef.current.querySelectorAll("a")
      : document.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
    });

    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      target.removeEventListener("mousemove", onMouseMove);
      target.removeEventListener("mouseleave", handleMouseLeave);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      className={`${containerRef ? "absolute" : "fixed"} top-0 left-0 w-full h-full pointer-events-none z-100`}
    >
      <svg className="absolute top-0 left-0 w-full h-full">
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves="1"
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        // className={`absolute w-full h-px pointer-events-none opacity-0 transform translate-y-1/2`}
        className="absolute w-full h-px pointer-events-none opacity-0 transform translate-y-1/2 x-line"
        // style={{ background: color }}
        // className={`absolute w-full h-0 pointer-events-none opacity-0 transform translate-y-1/2`}
        // style={{ borderTop: `1px solid ${color}` }}
      ></div>
      <div
        ref={lineVerticalRef}
        className={`absolute h-full w-px pointer-events-none opacity-0 transform translate-x-1/2 y-line`}
        // className={`absolute h-full w-px pointer-events-none opacity-0 transform translate-x-1/2`}
        // style={{ background: color }}
        // className={`absolute h-full w-0 pointer-events-none opacity-0 transform translate-x-1/2`}
        // style={{ borderLeft: `1px solid ${color}` }}
      ></div>
    </div>
  );
};

export default Crosshair;
