import React from 'react';
import {Form, Input, Button, notification, Icon, message} from 'antd';
import './index.less';
import {setToken, auth} from 'utils/auth';
import history from '../../utils/history';
import {connect} from 'react-redux';
import {loginUser} from 'actions/login';
import {actionEmums} from 'actions/basic';
import {refreshUser} from '../../redux/actions/login';
import {CloseOutlined, UserOutlined, LockOutlined} from '@ant-design/icons';

const FormItem = Form.Item;
@connect(
  (state) => {
    return ({
      emums: state.emums,
      loginUserData: state.loginUser.allData,
    });
  }, {loginUser, actionEmums, refreshUser}
)
export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  // form组件使用
  formRef = React.createRef();
  handleSubmit = (values) => {
    this.formRef.current.validateFields().then(values=>{
      history.push('');
      this.enterLoading(true);
      setToken('aaaa');
      setTimeout(() => {
        this.enterLoading(false);
      }, 100);
    })
  };
  enterLoading = (status) => {
    this.setState({loading: status});
  };

  onChangeUserName = (e) => {
    this.formRef.current.setFieldsValue({'userName': e.target.value});
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.formRef.current.setFieldsValue({'userName': ''});
  };

  render() {
    console.log(this.formRef.current && this.formRef.current.getFieldValue());
    const suffix = this.formRef.current && this.formRef.current.getFieldValue().userName ?
      <Icon type="close-circle" onClick={this.emitEmpty}/> : null;
    return (
      <div className="login-page-wrap">
        <div className="box-out">
          <div className="box clearfix">
            <div className="login-wrap">
              <div className="login-inner">
                <div className='box-title'>
                  登 陆
                </div>
                <Form ref={this.formRef} onFinish={this.handleSubmit}>
                  <FormItem
                    noStyle
                    shouldUpdate
                  >
                    {({getFieldValue}) => {
                      const suffix = getFieldValue('userName') ?
                        <CloseOutlined onClick={this.emitEmpty}/> : null;
                      return (
                        <FormItem name={'userName'} rules={[{required: true, message: '请输入用户名'}]}>
                          <Input
                            placeholder="请输入用户名"
                            prefix={<UserOutlined className="icon-change"/>}
                            suffix={suffix}
                            onChange={this.onChangeUserName}
                            ref={node => this.userNameInput = node}
                          />
                        </FormItem>
                      )
                    }}
                  </FormItem>
                  <FormItem name={'password'} rules={[{required: true, message: '请输入密码'}]}>
                    <Input type="password"
                           placeholder="请输入密码"
                           prefix={<LockOutlined  className="icon-change"/>}
                    />
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


