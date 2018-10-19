import React from 'react';
import {Link} from 'react-router-dom';
import {Layout} from 'antd';
import Top from './header';
import Footer from './bottom';
import './index.less';
import {Provider} from 'context';
import Nav from './menu';
import {connect} from 'react-redux';
import {actionEmums} from 'actions/basic';
import RouterPages from "../../routes/routesPages";


@connect(
  (state) => {
    return ({
      loginUser: state.loginUser.data,
      permissions: state.permission.data
    });
  }, {actionEmums}
)

export default class Container extends React.Component {
  state = {
    theme: 'light',
    current: 'index',
    collapsed: false,
    mode: 'horizontal',
    marginLeft: 200,
    test: '改变颜色',
    breadList: [],
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: this.state.collapsed ? 'inline' : 'vertical',
      marginLeft: this.state.collapsed ? 200 : 80
    });
  };


  render() {
    return (
      <Provider value={this.state}>
        <Layout className="containAll">
          <Top toggle={this.toggle} collapsed={this.state.collapsed}/>
          <Nav  permission={this.props.permissions}/>
          <RouterPages/>
          <Footer/>
        </Layout>
      </Provider>
    );
  }
};
