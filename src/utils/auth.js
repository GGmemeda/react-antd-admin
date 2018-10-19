import localForage from "localforage";
import {actionPermissions} from 'actions/basic';
import {store} from '../redux';
import Cookies from 'js-cookie';

const TokenKey = 'userToken';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: 3});
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export const auth = (data) => {
  setToken(data.token);
  const permissions = [];
  // data.principal.authorities.map(ele => {
  // 权限存储更新
  // });
  // store.dispatch(actionPermissions(permissions));
  localStorage.setItem('roles', data.roles);
};

export const clearAuth = () => {
  removeToken();
  localStorage.removeItem('roles');
  sessionStorage.removeItem('activeItem');
  localForage.removeItem("persist:permission");
  // localForage.removeItem('persist:emums');
  localForage.removeItem("persist:root");
};
