import { combineReducers } from "@reduxjs/toolkit";
import dummyReducer from "./dummyReducer";
import { workoutService } from "../../services/querier";

const rootReducer = combineReducers({
  dummy: dummyReducer,
  [workoutService.reducerPath]: workoutService.reducer,
});

export default rootReducer;
