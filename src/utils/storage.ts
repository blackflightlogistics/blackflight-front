const TOKEN_KEY = "authToken";
const ACCOUNT_ID_KEY = "accountId";

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveAccountId = (accountId: string) => {
  localStorage.setItem(ACCOUNT_ID_KEY, accountId);
};

export const getAccountId = () => {
  return localStorage.getItem(ACCOUNT_ID_KEY);
};

export const removeAccountId = () => {
  localStorage.removeItem(ACCOUNT_ID_KEY);
};


export const clearAuth = () => {
    removeToken();
    removeAccountId();
  };
