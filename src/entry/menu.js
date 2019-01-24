/**
 *页面菜单配置项，可更具习惯把权限放于其中
 */
export default () => {
  return [
    {
      name: '首页',
      url: 'index',
      icon: 'home',
    },
    {
      name: '基础信息',
      url: 'basicMessage',
      icon: 'user',
      children: [
        {
          name: '用户配置',
          url: 'userManage',
          children: [
            { name: '图片懒加载', url: 'lazyload' },
          ]
        }
      ]
    },
    {
      name: '框架进阶',
      url: 'Advanced',
      icon: 'rise',
      children: [
        { name: 'pure组件', url: 'pureComponent' },
        { name: '普通组件', url: 'compareComponent' },
      ]
    },
    {
      name: 'es6',
      url: 'AdvancedEs6',
      icon: 'book',
      children: [
        //反射
        { name: 'Reflect', url: 'Reflect' },
      ]
    },
    {
      name: 'boxReflect',
      url: 'boxReflect',
      icon: 'solution',
    }
  ]
}
