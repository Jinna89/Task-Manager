import { configureStore } from "@reduxjs/toolkit";
import SettingsReducer from "../stage-slice/SettingsSlice";
import taskReducer from '../task-slice/taskSlice.js';
import summaryReducer from '../stage-slice/summary-slice.js';

export default configureStore({
    reducer: {
        settings: SettingsReducer,
        task: taskReducer,
        summary : summaryReducer,
    }
});