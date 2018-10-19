import {CONTENTLOADING, EMUMS, PERMISSION} from 'actions/basic';
import {reducerPackage} from "../../utils";


export const layoutLoading = (state = {loading: false}, action) => {
  switch (action.type) {
    case `${CONTENTLOADING}_PENDING`:
      return Object.assign({}, {
        loading: true,
      });
    case `${CONTENTLOADING}_SUCCESS`:
      return Object.assign({}, {
        loading: action.payload.data,
      });
    default:
      return state;
  }
};
export const emums = reducerPackage(EMUMS,(action)=>{
  let result = {};
  if (action.payload.data && action.payload.data.indexOf(Array)) {
    action.payload.data.forEach((item, index) => {
      let mappingResult = {};
      item["enums"].forEach((e, i) => {
        mappingResult[e.enumName] = e;
      });
      result[item["enumType"]] = mappingResult;
    });
  }
  return {
    data:result,
    allData:{},
    success:true
  }
});

export const permission = reducerPackage(PERMISSION,(action)=>({
  isFetching: false,
  data: action.payload.data,
  allData:{}
}));
