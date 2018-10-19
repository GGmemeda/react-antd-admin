import {
  CLEARRIVERLIST} from 'actions/pzCustom/clearRiver';
export const initialState = {
  isFetching: false,
  data: []
};
export const clearRiverList = (state = initialState, action) => {
  switch (action.type) {
    case `${CLEARRIVERLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${CLEARRIVERLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

