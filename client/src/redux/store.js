import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { login, register, user, years, tenants } from "./reducers";

const reducer = combineReducers({ login, register, user, years, tenants });

const store = createStore(reducer, composeWithDevTools(applyMiddleware()));

export default store;
