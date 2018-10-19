import React from 'react';
import {Menu, Icon, Layout, Avatar, Dropdown, Badge, message} from 'antd';
import {Link} from 'react-router-dom';
import {mineMessageList} from 'api/messageNotification';
import './index.less';
import {removeToken, clearAuth} from 'utils/auth';
import {connect} from 'react-redux';
import ResetPwd from './ResetPwd';
import FeedbackAdd from '../../systemManage/feedback/FeedbackAdd';
import {createItem as feedbackCreate} from "../../../api/feedback";

const {Header} = Layout;
@connect(
  (state) => {
    return ({
      loginUser: state.loginUser.data,
      loginUserAllData: state.loginUser,
      permissions: state.permission.data
    });
  }
)

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      visible: false,
      messageTotal: 0,
      modalShow: false
    };
    this.messageUnradData = {
      status: 'UNREAD',
      pageSize: 10,
      page: 1
    };
  }

  getMineMessageList = () => {
    return new Promise((resolve, reject) => {
      mineMessageList(this.messageUnradData).then(res => {
        if (res.code === 200) {
          resolve(res);
        } else {
          reject('消息列表获取失败');
        }
      });
    });
  };

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  componentDidMount() {
    if (this.props.permissions.includes("PERMS_MESSAGE_LIST")) {
      this.getMineMessageList().then(res => {
        this.setState({messageTotal: res.total});
      });
    }
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
    if (item.key === 'feedback') {
      this.setState({modalShow: true});
    }
  };
  goMessagePage = () => {
    sessionStorage.setItem('activeItem', 'messageNotification');
    location.href = "/messageNotification";
  };
  menu = (
    <Menu className="logOut" onClick={this.dropDownEvents}>
      <Menu.Item key="resetPwd">个人中心</Menu.Item>
      <Menu.Item key="feedback">意见反馈</Menu.Item>
      <Menu.Item key="logOut">退出</Menu.Item>
    </Menu>
  );
  onOk = (data) => {
    if (data.files) {
      data.files = data.files.map(ele => {
        return ele.url;
      });
    }
    feedbackCreate(data).then(res => {
      this.setState({
        modalLoading: false
      });
      if (res.code === 200) {
        message.info("反馈成功!");
        this.setState({
          modalShow: false,
        });
      }
    });
  };

  render() {
    const loginUser = this.props.loginUser && this.props.loginUser.principal || {};
    console.log(loginUser);
    return (
      <Header className='header-top' style={{background: '#fff'}}>
        <img className='logo' src={require("images/layout/logo.png")} alt=""/>
        <div className='header-right'>
          {this.props.permissions && this.props.permissions instanceof Array && this.props.permissions.includes("PERMS_MESSAGE_LIST") ?
            <span className='message-out' onClick={this.goMessagePage}>
            <Badge count={this.state.messageTotal}>
              <i className='rvicon rvicon-xiaoxi'/>
            </Badge>
          </span> : ''}
          <Avatar src={loginUser.avatarUrl} className='user-img' icon="user"/>
          <Dropdown overlay={this.menu}>
            <a className="ant-dropdown-link">
              {loginUser.nickname} <Icon type="down"/>
            </a>
          </Dropdown>
        </div>
        <ResetPwd onCancel={this.onCancel} visible={this.state.visible}/>
        <FeedbackAdd
          onOk={this.onOk}
          modalShow={this.state.modalShow}
          onCancel={() => {
            this.setState({modalShow: false});
          }}
          modalData={{source: 'WEB'}}
          modalKey={'add'}
          title={'添加'}
          hasDefault={true}
        />
      </Header>
    );
  }
};
