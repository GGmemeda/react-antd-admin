import React from 'react';
import { Form, Input, Button, notification, Icon, message } from 'antd';
import './index.less';
import { setToken, auth } from 'utils/auth';
import history from '../../utils/history';
import { login } from 'api';
import { connect } from 'react-redux';
import { loginUser } from 'actions/login';
import { actionEmums } from 'actions/basic';
import { chiefManage, user } from '../../api';
import { refreshUser } from '../../redux/actions/login';

const FormItem = Form.Item;

@connect(
  (state) => {
    return ({
      emums: state.emums,
      loginUserData: state.loginUser.allData,
    });
  }, { loginUser, actionEmums, refreshUser }
)
@Form.create()
export default class LoginPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        history.push('');
        this.enterLoading(true);
        setToken('aaaa');
        setTimeout(() => {
          this.enterLoading(false);
        }, 100);
      }
    });

  };
  enterLoading = (status) => {
    this.setState({ loading: status });
  };

  onChangeUserName = (e) => {
    this.props.form.setFieldsValue({ 'userName': e.target.value });
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.props.form.setFieldsValue({ 'userName': '' });
  };

  render () {
    const { getFieldDecorator } = this.props.form;
    const suffix = this.props.form.getFieldsValue().userName ?
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
                <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('userName', {
                      rules: [{ required: true, message: '请输入用户名' }],
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
                      rules: [{ required: true, message: '请输入密码' }],
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


