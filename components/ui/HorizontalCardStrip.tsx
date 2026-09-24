"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from "react";

export type HorizontalCardStripProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  ariaLabel: string;
  itemMinWidth?: number;
  gap?: number;
  autoLoopCount?: number;
  direction?: "left-to-right" | "right-to-left";
  scale?: number;
  speed?: number;
  outerPadding?: string;
  cardsPerView?: number;
  mobileCardsPerView?: number;
  pauseOnHover?: boolean;
};

export default function HorizontalCardStrip<T>({
  items,
  renderItem,
  ariaLabel,
  itemMinWidth = 280,
  gap = 16,
  autoLoopCount = 1,
  direction = "right-to-left",
  scale = 1,
  speed = 0.8,
  outerPadding,
  cardsPerView = 4,
  mobileCardsPerView = 1.2,
  pauseOnHover = true,
}: HorizontalCardStripProps<T>) {
  const outerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    velocity: 0,
  });

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const autoLoop = items.length >= autoLoopCount;

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const updateWidth = () => {
      if (outer.clientWidth > 0) {
        setContainerWidth(outer.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  const effectiveGap = useMemo(() => {
    if (containerWidth > 0 && containerWidth < 640) return Math.min(gap, 12);
    if (containerWidth >= 640 && containerWidth < 960) return Math.min(gap, 14);
    return gap;
  }, [containerWidth, gap]);

  const computedCardWidth = useMemo(() => {
    if (!cardsPerView) return undefined;
    if (containerWidth > 0) {
      let cols = cardsPerView;
      if (containerWidth < 480) {
        cols = mobileCardsPerView || 1.15;
      } else if (containerWidth < 768) {
        cols = 2.15;
      } else if (containerWidth < 1024) {
        cols = 3.1;
      } else if (containerWidth < 1280) {
        cols = Math.min(cardsPerView, 3.8);
      } else {
        cols = cardsPerView;
      }
      const calculated = Math.floor(
        (containerWidth - (Math.floor(cols) - 1) * effectiveGap) / cols
      );
      return `${Math.max(220, calculated)}px`;
    }
    return `${itemMinWidth}px`;
  }, [cardsPerView, containerWidth, effectiveGap, mobileCardsPerView, itemMinWidth]);

  const renderedItems = useMemo(() => {
    if (!autoLoop || items.length === 0) return items;
    let base = [...items];
    while (base.length < 8) {
      base = [...base, ...items];
    }
    return [...base, ...base, ...base];
  }, [autoLoop, items]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer || !autoLoop || items.length === 0) return;

    let initialized = false;
    let scrollPos = 0;
    let frameId: number;

    const step = () => {
      if (!dragState.current.active && (!pauseOnHover || !isHovered.current) && outer) {
        const singleLoopWidth = outer.scrollWidth / 3;

        if (singleLoopWidth > 20) {
          if (!initialized) {
            scrollPos = direction === "left-to-right" ? singleLoopWidth * 1.5 : singleLoopWidth;
            outer.scrollLeft = scrollPos;
            initialized = true;
          }

          if (direction === "left-to-right") {
            scrollPos -= speed;
            if (scrollPos <= singleLoopWidth * 0.25) {
              scrollPos += singleLoopWidth;
            }
          } else {
            scrollPos += speed;
            if (scrollPos >= singleLoopWidth * 2.25) {
              scrollPos -= singleLoopWidth;
            }
          }

          outer.scrollLeft = scrollPos;
        }
      } else if (dragState.current.active && outer) {
        scrollPos = outer.scrollLeft;
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [autoLoop, items.length, direction, speed, pauseOnHover]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const outer = outerRef.current;
    if (!outer) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: outer.scrollLeft,
      lastX: event.clientX,
      velocity: 0,
    };
    try {
      outer.setPointerCapture(event.pointerId);
    } catch (_) {}
    outer.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const outer = outerRef.current;
    if (!outer || !dragState.current.active) return;

    const deltaX = event.clientX - dragState.current.startX;
    outer.scrollLeft = dragState.current.startScrollLeft - deltaX;

    const singleLoopWidth = outer.scrollWidth / 3;
    if (outer.scrollLeft >= singleLoopWidth * 2) {
      outer.scrollLeft -= singleLoopWidth;
      dragState.current.startX += singleLoopWidth;
    } else if (outer.scrollLeft <= singleLoopWidth * 0.5) {
      outer.scrollLeft += singleLoopWidth;
      dragState.current.startX -= singleLoopWidth;
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const outer = outerRef.current;
    dragState.current.active = false;
    if (!outer) return;
    try {
      if (outer.hasPointerCapture(event.pointerId)) {
        outer.releasePointerCapture(event.pointerId);
      }
    } catch (_) {}
    outer.style.cursor = "grab";
  };

  return (
    <div
      ref={outerRef}
      className="landing-card-strip horizontal-card-strip-wrap"
      style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        cursor: "grab",
        touchAction: "pan-y",
        scrollBehavior: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        userSelect: "none",
        padding: outerPadding || "12px 0 20px",
        boxSizing: "border-box",
      }}
      role="region"
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseEnter={() => {
        isHovered.current = true;
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "max-content",
          minHeight: "100%",
          gap: `${effectiveGap * scale}px`,
          boxSizing: "border-box",
        }}
      >
        {renderedItems.map((item, index) => (
          <div
            key={`${index}-${index % items.length}`}
            style={{
              width: computedCardWidth,
              minWidth: computedCardWidth,
              maxWidth: computedCardWidth,
              flexShrink: 0,
              boxSizing: "border-box",
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.25s ease",
            }}
          >
            {renderItem(item, index % items.length)}
          </div>
        ))}
      </div>
      <style>{`
        .horizontal-card-strip-wrap::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
