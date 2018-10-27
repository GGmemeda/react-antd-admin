import React from 'react';
import { Menu, Icon, Layout, Avatar, Dropdown, Badge, message } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import { removeToken, clearAuth } from 'utils/auth';
import { connect } from 'react-redux';
import ResetPwd from './ResetPwd';

const { Header } = Layout;
@connect(
)

export default class Top extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      visible: false,
      messageTotal: 0,
      modalShow: false
    };
  }

  componentWillUnmount () {
    this.setState = () => {
      return;
    };
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  };
  dropDownEvents = (item) => {
    if (item.key === 'logOut') {
      location.href = '/login';
      clearAuth();
    }
    if (item.key === 'resetPwd') {
      this.setState({
        visible: true
      });
    }
  };
  goMessagePage = () => {

  };
  menu = (
    <Menu className="logOut" onClick={this.dropDownEvents}>
      <Menu.Item key="logOut">退出</Menu.Item>
    </Menu>
  );
  onOk = (data) => {
    if (data.files) {
      data.files = data.files.map(ele => {
        return ele.url;
      });
    }
  };

  render () {
    const loginUser = this.props.loginUser && this.props.loginUser.principal || {};
    console.log(loginUser);
    return (
      <Header className='header-top' style={{ background: '#fff' }}>
        <img className='logo' height='50px' src={require('../../../images/logo.jpg')} alt=""/>
        <div className='header-right'>
            <span className='message-out' onClick={this.goMessagePage}>
            <Badge count={this.state.messageTotal || 0}>
              <i className='rvicon rvicon-xiaoxi'/>
            </Badge>
          </span>
          <Avatar src={loginUser.avatarUrl} className='user-img' icon="user"/>
          <Dropdown overlay={this.menu}>
            <a className="ant-dropdown-link">
              {loginUser.nickname} <Icon type="down"/>
            </a>
          </Dropdown>
        </div>
        <ResetPwd onCancel={this.onCancel} visible={this.state.visible}/>
      </Header>
    );
  }
};
