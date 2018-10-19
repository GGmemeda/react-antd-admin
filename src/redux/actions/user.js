import {user} from 'api';

export const USERLIST = 'USERLIST';


export const list = (data) => ({
  type: USERLIST,
  payload: {
    promise: user.userList(data)
  }
});
