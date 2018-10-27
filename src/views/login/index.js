import React from 'react';
import {Form, Input, Button, notification, Icon, message} from 'antd';
import './index.less';
import {setToken, auth} from 'utils/auth';
import history from "../../utils/history";
import {login} from 'api';
import {connect} from 'react-redux';
import {loginUser} from 'actions/login';
import {actionEmums} from 'actions/basic';
import {chiefManage, user} from "../../api";
import {refreshUser} from '../../redux/actions/login';

const FormItem = Form.Item;

@connect(
  (state) => {
    return ({
      emums: state.emums,
      loginUserData: state.loginUser.allData,
    });
  }, {loginUser, actionEmums, refreshUser}
)
@Form.create()
export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  //获取用户详情
  getUserDetail = async (paramId) => {
    return new Promise((resolve, reject) => {
      user.getUserDetail(paramId).then(res => {
        if (res.code === 200) {
          resolve(res.data);
        } else {
          resolve({});
          message.error('用户信息获取失败');
        }
      });
    });
  };
  //获取河长详情
  getChiefDetail = async (paramId) => {
    return new Promise((resolve, reject) => {
      chiefManage.getDetail(paramId).then(res => {
        if (res.code === 200) {
          resolve(res.data);
        } else {
          resolve({});
        }
      });
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let n = this.props.form.getFieldsValue().userName;
    let p = this.props.form.getFieldsValue().password;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          "channel": "BROWSER",
          "loginUniqueKey": values.userName.trim(),
          "password": values.password
        };
        history.push('/index');
        // this.enterLoading(false);
        // this.props.loginUser(data).then(response => {
        //   let res = response.value;
        //   if (res.code === 200) {
        //     message.info("登录成功!");
        //     auth(res.data);
        //     let activeItems = sessionStorage.getItem('activeItem');
        //     if (activeItems) {
        //       let nowPath = activeItems.split(',');
        //       nowPath = '/' + nowPath[nowPath.length - 1];
        //       history.push(nowPath);
        //     } else {
        //       history.push('/index');
        //     }
        //   }else {
        //     this.enterLoading(false);
        //   }
        // }).catch(err => {
        //   console.log(err);
        //   message.warn("访问异常");
        // }).finally(err => {
        //   this.enterLoading(false);
        // });
      }
    });

  };
  enterLoading = (status) => {
    this.setState({loading: status});
  };


  onChangeUserName = (e) => {
    this.props.form.setFieldsValue({'userName': e.target.value});
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.props.form.setFieldsValue({'userName': ''});
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const suffix = this.props.form.getFieldsValue().userName ?
      <Icon type="close-circle" onClick={this.emitEmpty}/> : null;
    return (
      <div className="login-page-wrap">
        <div className="top-login clearfix">
          <img  src='' alt="react后台管理系统"/>
        </div>
        <div className="box-out">
          <div className="box clearfix">
            <div className="login-wrap">
              <div className="login-inner">
                <div className='box-title'>
                  账户登陆
                  <div className='box-title-line'/>
                </div>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('userName', {
                      rules: [{required: true, message: '请输入用户名'}],
                    })(
                      <Input
                        placeholder="请输入用户名"
                        prefix={<Icon type="user" className="icon-change"/>}
                        suffix={suffix}
                        onChange={this.onChangeUserName}
                        ref={node => this.userNameInput = node}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{required: true, message: '请输入密码'}],
                    })(
                      <Input type="password"
                             placeholder="请输入密码"
                             prefix={<Icon type="lock" className="icon-change"/>}
                      />
                    )}
                  </FormItem>
                  <Button type="primary" htmlType="submit" className="loginBtn"
                          loading={this.state.loading}>立即登录</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


