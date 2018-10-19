const defaultPages = {
  '/index': {
    hideBread: true,
    loader: () => import('../views/index/index.js')
  },
  '/userManage': {
    breadName: ['基础信息 ', '用户管理'],
    loader: () => import('../views/systemManage/userManage')
  },
  '/404': {
    hideBread: true,
    loader: () => import('../views/404Pages/404'),
  },
};
//页面入口，可分module
const pageConfig = Object.assign({}, defaultPages);
export default pageConfig;
