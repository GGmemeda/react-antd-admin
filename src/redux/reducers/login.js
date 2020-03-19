import {
  LOGINBYUSER,
} from '../actions/login';
import {reducerPackage} from "../../utils";

export const loginUser = reducerPackage(LOGINBYUSER,{data: '我是初始化参数 '});
