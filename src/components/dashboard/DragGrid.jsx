import { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";

const sameKeyOrder = (a, b) =>
  a.length === b.length && a.every((it, i) => String(it.id) === String(b[i].id));

/**
 * 2D drag-to-reorder grid.
 *
 * framer-motion's <Reorder> only supports a single axis, so a CSS grid with
 * axis="both" crashes inside registerItem (layout[axis] is undefined, then
 * compareMin reads .min of it). This component implements free x/y reordering
 * instead:
 *  - Items swap live while dragging using local state + framer "layout"
 *    animation (the dragged item is compared against the other cells' centers).
 *  - The final order is committed exactly once via onReorder on drop, so the
 *    parent (useDragOrder) persists a single batched update.
 *
 * Touch handling: framer-motion injects inline `touch-action: none` whenever
 * `drag` is set and `dragListener !== false`, which blocks native scrolling on
 * touch devices entirely (the dashboard tech/cert/project grids are inside a
 * vertically-scrolling <main>). To keep mobile scrolling working we disable the
 * drag listener (which suppresses that inline style) and start drags manually
 * via dragControls — but only for mouse/pen pointers. Touch gesture are left to
 * the browser thanks to the `touch-pan-y` class, so users can scroll the grid
 * on phones while desktop reorder (and the per-item arrow buttons) are intact.
 */

const DragItem = ({ item, index, containerRef, onDrag, onDragEnd, children }) => {
  const controls = useDragControls();
  return (
    <motion.div
      data-drag-item
      data-drag-key={item.id}
      layout
      drag
      dragListener={false}
      dragControls={controls}
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      dragSnapToOrigin
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      whileDrag={{ zIndex: 30, scale: 1.02 }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing touch-pan-y"
      draggable={false}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" || e.pointerType === "pen") {
          controls.start(e);
        }
      }}
    >
      {children(item, index)}
    </motion.div>
  );
};

export default function DragGrid({ items, onReorder, className = "", children }) {
  const containerRef = useRef(null);
  const [order, setOrder] = useState(items);
  const orderRef = useRef(order);
  orderRef.current = order;
  const latest = useRef({ items, onReorder });
  latest.current = { items, onReorder };

  useEffect(() => {
    setOrder((prev) => (sameKeyOrder(prev, items) ? prev : items));
  }, [items]);

  const handleDrag = (event, info) => {
    const container = containerRef.current;
    const dragKey = event.currentTarget.getAttribute("data-drag-key");
    if (!container || !dragKey) return;

    setOrder((prev) => {
      const from = prev.findIndex((it) => String(it.id) === dragKey);
      if (from < 0) return prev;

      const nodes = Array.from(container.querySelectorAll("[data-drag-item]"));
      let best = from;
      let bestDist = Infinity;
      for (let i = 0; i < nodes.length; i += 1) {
        if (i === from) continue;
        const rect = nodes[i].getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const d = (cx - info.point.x) ** 2 + (cy - info.point.y) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }

      if (best === from) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(best, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    requestAnimationFrame(() => {
      const { items: base, onReorder: commit } = latest.current;
      const final = orderRef.current;
      if (!final || sameKeyOrder(final, base)) return;
      commit(final, base);
    });
  };

  return (
    <div ref={containerRef} className={className}>
      {order.map((item, index) => (
        <DragItem
          key={item.id}
          item={item}
          index={index}
          containerRef={containerRef}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {children}
        </DragItem>
      ))}
    </div>
  );
}