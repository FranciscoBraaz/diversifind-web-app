import { combineReducers } from "redux"
import appReducer from "./app"

const reducers = combineReducers({
  app: appReducer,
})

export default reducers
