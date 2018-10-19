import {
  PZPLANLISTLIST} from 'actions/pzCustom/pzplanlist';
export const initialState = {
  isFetching: false,
  data: []
};
export const pzplanlistList = (state = initialState, action) => {
  switch (action.type) {
    case `${PZPLANLISTLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${PZPLANLISTLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

