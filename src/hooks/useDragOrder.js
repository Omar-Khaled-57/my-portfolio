import { useCallback, useMemo } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";
import { useI18n } from "../i18n";

/**
 * Drag-to-reorder persistence for the dashboard grids.
 *
 * The whole grid list is sorted by an integer `orderField` (ASC, first = 1).
 * Reordering happens on the VISIBLE (possibly filtered) subset; the invisible
 * items keep their original relative order and gaps, so the drag position maps
 * cleanly back onto the full list. Every drop renumbers the affected rows.
 *
 * @param {Array}   items      full fetched items
 * @param {Function} setItems  state setter (optimistic reorder)
 * @param {string}  table      supabase table name ("projects" | "certificates" | "tech_tools")
 * @param {string}  orderField "order_index" | "sort_order"
 * @param {Function} [onSaved] callback to refetch after a successful persist
 */
export const useDragOrder = ({ items, setItems, table, orderField, onSaved }) => {
  const { t } = useI18n();

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) => (a[orderField] ?? 0) - (b[orderField] ?? 0) || a.created_at?.localeCompare?.(b.created_at ?? "") || 0,
      ),
    [items, orderField],
  );

  const applyAndPersist = useCallback(
    async (newFull) => {
      const idSet = new Set(items.map((it) => it.id));
      if (newFull.length !== items.length || newFull.some((it) => !idSet.has(it.id))) return;

      const prev = new Map(items.map((it, i) => [it.id, i]));
      const changes = [];
      newFull.forEach((it, idx) => {
        const before = prev.get(it.id);
        if (before !== idx) changes.push({ id: it.id, order: idx + 1 });
      });
      if (changes.length === 0) return;

      setItems(newFull.map((it, idx) => ({ ...it, [orderField]: idx + 1 })));

      try {
        const byId = new Map(changes.map((c) => [c.id, c.order]));
        await Promise.all(
          [...byId].map(([id, order]) =>
            supabase.from(table).update({ [orderField]: order }).eq("id", id),
          ),
        );
        onSaved?.();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("common.errorTitle"),
          text: error.message,
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        });
        onSaved?.();
      }
    },
    [items, setItems, table, orderField, onSaved, t],
  );

  const reorder = useCallback(
    (newVisible, visibleItems) => {
      if (newVisible.length !== visibleItems.length) return;
      if (newVisible.every((it, i) => it.id === visibleItems[i].id)) return;

      const visibleIds = new Set(visibleItems.map((it) => it.id));
      const gaps = [];
      let acc = 0;
      sortedItems.forEach((it) => {
        if (visibleIds.has(it.id)) {
          gaps.push(acc);
          acc = 0;
        } else {
          acc += 1;
        }
      });
      const trailing = acc;

      const invSeq = sortedItems.filter((it) => !visibleIds.has(it.id));
      const result = [];
      let invIdx = 0;
      for (let k = 0; k < newVisible.length; k += 1) {
        const gap = gaps[k] ?? 0;
        for (let g = 0; g < gap; g += 1) result.push(invSeq[invIdx++]);
        result.push(newVisible[k]);
      }
      for (let g = 0; g < trailing && invIdx < invSeq.length; g += 1) result.push(invSeq[invIdx++]);

      applyAndPersist(result);
    },
    [sortedItems, applyAndPersist],
  );

  const moveOne = useCallback(
    (id, direction, visibleItems) => {
      const visible = visibleItems || sortedItems;
      const idx = visible.findIndex((it) => it.id === id);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= visible.length) return false;
      const next = [...visible];
      [next[idx], next[target]] = [next[target], next[idx]];
      reorder(next, visible);
      return true;
    },
    [sortedItems, reorder],
  );

  return { sortedItems, reorder, moveOne };
};