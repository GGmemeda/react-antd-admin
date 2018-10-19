import {
  PZSUMLIST} from 'actions/pzCustom/pzsum';
export const initialState = {
  isFetching: false,
  data: []
};
export const pzsumList = (state = initialState, action) => {
  switch (action.type) {
    case `${PZSUMLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${PZSUMLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

