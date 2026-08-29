import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
 */
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
        <motion.div
          key={item.id}
          data-drag-item
          data-drag-key={item.id}
          layout
          drag
          dragConstraints={containerRef}
          dragElastic={0.05}
          dragMomentum={false}
          dragSnapToOrigin
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          whileDrag={{ zIndex: 30, scale: 1.02 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          {children(item, index)}
        </motion.div>
      ))}
    </div>
  );
}