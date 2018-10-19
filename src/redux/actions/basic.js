import {getEmums} from 'api/basic';
import {LOGINBYUSER} from "./login";

export const CONTENTLOADING = 'CONTENTLOADING';
export const EMUMS = 'EMUMS';
export const PERMISSION='PERMISSION';


export const actionLoading = (status) =>{
  return status?({
    type: `${CONTENTLOADING}`,
    payload: {
      promise: ()=>{
        return new Promise(resolve=>{
          resolve({data:true})
        })
      }
  }}):({
    type: `${CONTENTLOADING}`,
    payload: {
      promise: ()=>{
        return new Promise(resolve=>{
          resolve({data:false})
        })
      }
    }
  });
};

export const actionEmums = (data) => ({
  type: EMUMS,
  payload: {
    promise: getEmums(data)
  }
});


export const actionPermissions = (data) => ({
  type: PERMISSION,
  payload: {
    promise: ()=>{
      return new Promise(resolve=>{
        resolve({data:data})
      })
    }
  }
});
