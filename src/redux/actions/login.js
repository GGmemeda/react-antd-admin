import {login} from 'api';

export const LOGINBYUSER = 'LOGINBYUSER';


export const loginUser = (data) => ({
  type: LOGINBYUSER,
  payload: {
    promise: login.loginUser(data)
  }
});
export const refreshUser = (data) => ({
  type: LOGINBYUSER,
  payload: {
    promise: ()=>{
      return new Promise(resolve=>{
        resolve(data)
      })
    }
  }
});
