import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { login, register } from "./reducers";

const reducer = combineReducers({ login, register });

const store = createStore(reducer, composeWithDevTools(applyMiddleware()));

export default store;

/*
{
     login : {
          email : email,
          password : password
     },
     register : {
          email : email,
          password : password,
          phoneNumber : phoneNumber,
          name : name
     },
     user : {
          token : token,
          role : role,
          email : email,
          id : id
     },
     years : [
          year1 : {...},
          year2 : {...},
          year3 : {...},
          yearN : {...}
     ]
}
*/
