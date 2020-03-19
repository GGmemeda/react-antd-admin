const defaultPages = {
  '/index': {
    hideBread: true,
    loader: () => import('../views/home')
  },
  '/lazyload': {
    breadName: ['基础信息 ', '图片懒加载'],
    loader: () => import('../views/lazyload')
  },
  '/pureComponent': {
    breadName: ['react组件 ', 'pure组件'],
    loader: () => import('../views/pureComponent')
  },
  '/compareComponent': {
    breadName: ['react组件 ', 'pure组件'],
    loader: () => import('../views/pureComponent/compareComponent.js')
  },
  '/Reflect': {
    breadName: ['es6', 'Reflect组件'],
    loader: () => import('../views/es6/Reflect.js')
  },
  '/boxReflect': {
    breadName: ['倒影'],
    loader: () => import('../views/boxReflect')
  },
  '/Simple': {
    breadName: ['Hook'],
    loader: () => import('../Hook/simple')
  },
  '/404': {
    hideBread: true,
    loader: () => import('../views/404Pages/404'),
  },
};
//页面入口，可分module
const pageConfig = Object.assign({}, defaultPages);
export default pageConfig;
