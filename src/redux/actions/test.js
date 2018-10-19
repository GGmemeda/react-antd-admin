import {createAction} from 'redux-actions';
import {login} from 'api';
import {fetchAction} from 'utils/request';


export const FETCH_TEST= 'FETCH_TEST';



export const fetchTest = (data) => ({
  type: FETCH_TEST,
  payload: {
    promise: login.fetchDataTest(data)
  }
});
