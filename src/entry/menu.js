/**
 *页面菜单配置项，可更具习惯把权限放于其中
 */
export default () => {
  return [
    {
      name: '首页',
      url: 'index',
      icon: 'rvicon rvicon-shouye',
    }, {
      name: '一张图',
      url: 'onemap',
      icon: 'rvicon  rvicon-map',
    },
    {
      name: '基础信息',
      url: 'basicMessage',
      icon: 'rvicon rvicon-jichuxinxi-copy',
      children: [
        {
          name: '用户配置',
          url: 'userManage',
          children: [
            {name: '用户管理', url: 'userManage', permission: ['USER_LIST']},
          ]
        }
      ]
    },
  ];
}
