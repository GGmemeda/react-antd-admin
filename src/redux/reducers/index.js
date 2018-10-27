//基础配置
import {combineReducers} from 'redux';
import  localForage from 'localforage';
import {persistReducer} from 'redux-persist';
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
const rootReducer = combineReducers({
  layoutLoading,
  emums: persistReducer(emumsConfig, emums),
  permission: persistReducer(permissionConfig, permission),
  ...login,
  ...user,
});


export default rootReducer;
