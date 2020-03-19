/**
 *页面菜单配置项，可更具习惯把权限放于其中
 */
import {HomeOutlined} from '@ant-design/icons';
export default () => {
  return [
    {
      name: '首页',
      url: 'index',
      icon: HomeOutlined,
    },
    {
      name: '框架进阶',
      url: 'Advanced',
      icon: HomeOutlined,
      children: [
        { name: 'pure组件', url: 'pureComponent' },
        { name: '普通组件', url: 'compareComponent' },
      ]
    },
    {
      name: 'es6',
      url: 'AdvancedEs6',
      icon: HomeOutlined,
      children: [
        //反射
        { name: 'Reflect', url: 'Reflect' },
      ]
    },
    {
      name: 'boxReflect',
      url: 'boxReflect',
      icon: HomeOutlined,
    },
    {
      name: 'Hook',
      url: 'Simple',
      icon: HomeOutlined,
    }
  ]
}
