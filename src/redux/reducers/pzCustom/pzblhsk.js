import {
  PZBLHSKLIST} from 'actions/pzCustom/pzblhsk';
export const initialState = {
  isFetching: false,
  data: []
};
export const pzblhskList = (state = initialState, action) => {
  switch (action.type) {
    case `${PZBLHSKLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${PZBLHSKLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

