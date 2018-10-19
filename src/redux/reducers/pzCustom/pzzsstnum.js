import {
  PZZSSTNUMLIST} from 'actions/pzCustom/pzzsstnum';
export const initialState = {
  isFetching: false,
  data: []
};
export const pzzsstnumList = (state = initialState, action) => {
  switch (action.type) {
    case `${PZZSSTNUMLIST}_PENDING`:
      return Object.assign({}, initialState,{
        isFetching:true
      });
    case `${PZZSSTNUMLIST}_SUCCESS`:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData:action.payload
      });
    default:
      return state;
  }
};

