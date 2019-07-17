//基础配置
import {combineReducers} from 'redux';
import localForage from 'localforage';
import {persistReducer} from 'redux-persist';
import {connectRouter} from 'connected-react-router';
//业务配置
import {layoutLoading, emums, permission} from './basic';
import * as login from './login';
import * as user from './user';

const emumsConfig = {
  key: 'emums',
  storage: localForage,
};
const permissionConfig = {
  key: 'permission',
  storage: localForage,
};
export default (history) => combineReducers({
  layoutLoading,
  router: connectRouter(history),
  permission: persistReducer(permissionConfig, permission),
  ...login,
  ...user,
});
