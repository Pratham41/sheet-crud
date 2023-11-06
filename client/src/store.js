import { configureStore, combineReducers } from "@reduxjs/toolkit";
import patientsReducer from "../src/slices/patientSlice";
import filesReducers from "../src/slices/fileSlice"

const rootReducer = combineReducers({
  items: patientsReducer,
  files:filesReducers
});

export const store = configureStore({
  reducer: rootReducer,
  devTools:true
});
