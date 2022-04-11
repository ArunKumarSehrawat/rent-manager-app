import * as ACTIONS from "./actionTypes";

const initialState = {
     login: {
          email: "",
          password: "",
     },
     register: {
          role: "owner",
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
     },
};

export function login(state = initialState.login, action) {
     switch (action.type) {
          case ACTIONS.LOGIN_EMAIL_UPDATED:
               return { ...state, email: action.payload.email };
          case ACTIONS.LOGIN_PASSWORD_UPDATED:
               return { ...state, password: action.payload.password };
          default:
               return state;
     }
}

export function register(state = initialState.register, action) {
     switch (action.type) {
          case ACTIONS.REGISTER_ROLE_UPDATED:
               return { ...state, role: action.payload.role };
          case ACTIONS.REGISTER_NAME_UPDATED:
               return { ...state, name: action.payload.name };
          case ACTIONS.REGISTER_EMAIL_UPDATED:
               return { ...state, email: action.payload.email };
          case ACTIONS.REGISTER_PASSWORD_UPDATED:
               return { ...state, password: action.payload.password };
          case ACTIONS.REGISTER_PHONE_NUMBER_UPDATED:
               return { ...state, phoneNumber: action.payload.phoneNumber };
          default:
               return state;
     }
}
