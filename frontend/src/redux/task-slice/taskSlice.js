import { createSlice } from "@reduxjs/toolkit";

export const TaskSlice = createSlice({
  name: "tasks",
  initialState: {
    new: [],
    inprogress: [],
    completed: [],
    canceled: [],
  },
  reducers: {
    setNewTasks: (state, action) => {
      state.new = action.payload;
    },
    setInProgressTasks: (state, action) => {
      state.inprogress = action.payload;
    },
    setCompletedTasks: (state, action) => {
      state.completed = action.payload;
    },
    setCanceledTasks: (state, action) => {
      state.canceled = action.payload;
    },
  },
});

export const {
  setNewTasks,
  setInProgressTasks,
  setCompletedTasks,
  setCanceledTasks,
} = TaskSlice.actions;

export default TaskSlice.reducer;
