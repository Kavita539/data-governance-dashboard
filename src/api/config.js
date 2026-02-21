export const BASE_URL = "/api/v1";

let AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

export const setToken = (token) => {
  AUTH_TOKEN = token;
};
export const hasToken = () => AUTH_TOKEN !== "";
export const getToken = () => AUTH_TOKEN;
