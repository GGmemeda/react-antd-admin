import config from '../utils/apiconfig';
import request from '../utils/request';

const { api } = config;
const { user } = api;

/**
 * 获取用户列表
 * @param params
 * @returns {Promise<*>}
 */
export async function userList (params) {
  return request({ url: user, method: 'get', data: params, });
}
