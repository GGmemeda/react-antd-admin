import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Button, Icon} from 'antd';
import Top from './header';
import Footer from './bottom';
import './index.less';
import {Provider} from '../../context.js';
import Nav from './menu';
import {connect} from 'react-redux';
import {actionEmums} from 'actions/basic';
import RouterPages from '../../routes/routesPages';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';

const {Sider} = Layout;

@connect()
export default class Container extends React.Component {
  state = {
    theme: 'dark',
    current: 'index',
    collapsed: true,
    mode: 'vertical',
    test: '改变颜色',
    breadList: [],
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: this.state.collapsed ? 'inline' : 'vertical',
    });
  };

  render() {
    return (
      <Provider value={this.state}>
        <Layout className="containAll">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.toggle}
            theme={this.state.theme}
          >
            <div className='collapse-icon'>
              {this.state.collapsed ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
            </div>
            <Nav mode={this.state.mode} theme={this.state.theme}/>
          </Sider>
          <Layout>
            <Top toggle={this.toggle}/>
            <RouterPages/>
            <Footer/>
          </Layout>
        </Layout>
      </Provider>
    );
  }
};
