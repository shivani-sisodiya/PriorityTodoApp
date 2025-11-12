import { createSelector } from "@reduxjs/toolkit";

const selectTodosState = (state) => state.todos || { items: [], completed: [] };

// direct lists with safe defaults
export const selectActiveTodos = createSelector(selectTodosState, (s) =>
  Array.isArray(s.items) ? s.items : []
);
export const selectCompletedTodos = createSelector(selectTodosState, (s) =>
  Array.isArray(s.completed) ? s.completed : []
);

// priority order map: lower number = higher priority
const priorityOrder = { High: 1, Medium: 2, Low: 3 };

// helper to get normalized priority value
const getPriorityValue = (p) =>
  priorityOrder[p] !== undefined ? priorityOrder[p] : 999;

// grouped (unsorted) — always returns consistent structure
export const selectGroupedTodos = createSelector(selectActiveTodos, (items) => {
  const categories = ["Work", "Personal", "Urgent"];
  return categories.map((category) => ({
    category,
    tasks: items.filter((t) => t && t.category === category),
  }));
});

// grouped + sorted (High -> Low) — non-mutating: copy with slice()
export const selectGroupedAndSortedTodos = createSelector(
  selectActiveTodos,
  (items) => {
    const categories = ["Work", "Personal", "Urgent"];
    const safeItems = Array.isArray(items) ? items : [];

    return categories.map((category) => {
      const tasksForCategory = safeItems.filter(
        (t) => t && t.category === category
      );
      // make a copy then sort
      const sorted = tasksForCategory.slice().sort((a, b) => {
        const va = getPriorityValue(a.priority);
        const vb = getPriorityValue(b.priority);
        if (va !== vb) return va - vb; // smaller value => higher priority first
        // fallback: compare createdAt (newest first)
        const ca = a.createdAt || 0;
        const cb = b.createdAt || 0;
        return cb - ca;
      });
      return { category, tasks: sorted };
    });
  }
);

// selector factory: returns selector that applies search + sort toggle
export const makeSelectFilteredGroups = (search = "", sortEnabled = true) =>
  createSelector(
    sortEnabled ? selectGroupedAndSortedTodos : selectGroupedTodos,
    (groups) => {
      if (!search) return groups;
      const q = String(search).toLowerCase();
      return groups.map((g) => ({
        category: g.category,
        tasks: (Array.isArray(g.tasks) ? g.tasks : []).filter((t) => {
          const title = String(t.title || "").toLowerCase();
          const desc = String(t.description || "").toLowerCase();
          return title.includes(q) || desc.includes(q);
        }),
      }));
    }
  );
