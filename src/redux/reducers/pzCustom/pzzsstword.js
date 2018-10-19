import {
  PZZSSTWORDLIST} from 'actions/pzCustom/pzzsstword';
export const initialState = {
  isFetching: false,
  data: []
};
export const pzzsstwordList = (state = initialState, action) => {
  switch (action.type) {
    case `${PZZSSTWORDLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${PZZSSTWORDLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

