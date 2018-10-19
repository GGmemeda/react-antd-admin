/**
 * url参数获取
 * @param url
 * @returns {*}
 */
export const urlParam = function (url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
};
/**
 * reducer默认state参数配置
 * @type {{isFetching: boolean, data: Array}}
 */
export const initialState = {
  isFetching: false,
  data: []
};
/**
 * reducer可使用
 * @param mutations  模块名称
 * @param success  成功回调，根据返回更改参数
 * @param error 错误回调
 * @returns {Function}
 */

export const reducerPackage = (mutations, success, error) => (state = initialState, action) => {
  switch (action.type) {
    case `${mutations}_PENDING`:
      return Object.assign({}, initialState, {
        isFetching: true
      });
    case `${mutations}_ERROR`:
      const errorDefaultObj = {
        isFetching: false,
        data: [],
        allData: {}
      };
      if (typeof  error === 'function') {
        const errorObj = error(action) || {};
        return Object.assign({}, errorDefaultObj, errorObj);
      }
      return errorDefaultObj;
    case `${mutations}_SUCCESS`:
      let defaultObj = Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data,
        allData: action.payload
      });
      if (typeof  success === 'function') {
        const successObj = success(action) || {};
        return Object.assign({}, defaultObj, successObj);
      }
      return defaultObj;
    default:
      return state;
  }
};
