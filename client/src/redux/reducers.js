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
     user: {},
     years: {},
     tenants: {},
};

export const login = (state = initialState.login, action) => {
     switch (action.type) {
          case ACTIONS.LOGIN.EMAIL_UPDATED:
               return { ...state, email: action.payload.email };
          case ACTIONS.LOGIN.PASSWORD_UPDATED:
               return { ...state, password: action.payload.password };
          default:
               return state;
     }
};

export const register = (state = initialState.register, action) => {
     switch (action.type) {
          case ACTIONS.REGISTER.ROLE_UPDATED:
               return { ...state, role: action.payload.role };
          case ACTIONS.REGISTER.NAME_UPDATED:
               return { ...state, name: action.payload.name };
          case ACTIONS.REGISTER.EMAIL_UPDATED:
               return { ...state, email: action.payload.email };
          case ACTIONS.REGISTER.PASSWORD_UPDATED:
               return { ...state, password: action.payload.password };
          case ACTIONS.REGISTER.PHONE_NUMBER_UPDATED:
               return { ...state, phoneNumber: action.payload.phoneNumber };
          default:
               return state;
     }
};

export const user = (state = initialState.user, { type, payload }) => {
     switch (type) {
          case ACTIONS.USER.LOGGED_IN:
               const { user } = payload;
               return { ...user };
          case ACTIONS.USER.LOGGED_OUT:
               return {};
          default:
               return state;
     }
};

export const years = (state = initialState.years, { type, payload }) => {
     switch (type) {
          case ACTIONS.YEAR.UPDATED_ALL:
               return { ...payload };
          case ACTIONS.YEAR.ADDED:
               return { ...state, [payload.year]: { ...payload[payload.year] } };
          case ACTIONS.YEAR.DELETED:
               delete state[payload];
               return { ...state };
          case ACTIONS.YEAR.UPDATED:
               return state;
          case ACTIONS.YEAR.SPACE_ADDED: {
               const { year } = payload;
               return { ...state, [year]: payload[year] };
          }
          case ACTIONS.YEAR.SPACE_REMOVED: {
               const { year } = payload;
               return { ...state, [year]: payload[year] };
          }
          default:
               return state;
     }
};

export const tenants = (state = initialState.tenants, { type, payload }) => {
     switch (type) {
          case ACTIONS.TENANT.ADDED:
               return state;
          case ACTIONS.TENANT.UPDATED:
               return state;
          case ACTIONS.TENANT.DELETED:
               return state;
          default:
               return state;
     }
};
