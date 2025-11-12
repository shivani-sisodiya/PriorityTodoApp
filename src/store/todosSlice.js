import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid/non-secure";

const initialState = {
  items: [],
  completed: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({
        title,
        description = "",
        priority = "Medium",
        category = "Work",
      }) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            priority,
            category,
            completed: false,
            createdAt: Date.now(),
          },
        };
      },
    },
    updateTodo: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex((i) => i.id === updated.id);
      if (index >= 0)
        state.items[index] = { ...state.items[index], ...updated };
    },
    deleteTodo: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.completed = state.completed.filter((i) => i.id !== id);
    },
    markCompleted: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.completed = true;
        state.items = state.items.filter((i) => i.id !== id);
        state.completed.unshift(item);
      }
    },
    restoreTodo: (state, action) => {
      const id = action.payload;
      const item = state.completed.find((i) => i.id === id);
      if (item) {
        item.completed = false;
        state.completed = state.completed.filter((i) => i.id !== id);
        state.items.unshift(item);
      }
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, markCompleted, restoreTodo } =
  todosSlice.actions;
export default todosSlice.reducer;
