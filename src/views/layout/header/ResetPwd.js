import React from 'react';
import {connect} from 'react-redux';
import {actionLoading} from 'actions/basic';
import {
  Button,
  Input,
  Form,
  message,
  Avatar
} from 'antd';
import {modifyPwd} from 'api/user';
import UiModal from "../../../components/modalForm/UiModal";
import UploadImg from '../../../components/upload/Upload';
import {editUserDefault} from "../../../api/user";
import {refreshUser} from '../../../redux/actions/login';
import './index.less';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 14},
  },
};
const FormItem = Form.Item;
@Form.create()
@connect(
  (state) => {
    return ({
      loginUser: state.loginUser.data,
      loginUserData: state.loginUser.allData,
    });
  }, {actionLoading, refreshUser}
)
export default class ResetPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      showRwd: false
    };
  }

  componentWillMount() {
    this.loginUser = this.props.loginUser && this.props.loginUser.principal || {};
    this.avatarUrl = this.props.loginUser && this.props.loginUser.principal && this.props.loginUser.principal.avatarUrl || "";
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPasswd')) {
      callback('密码输入要相同!');
    } else {
      callback();
    }
  };

  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actionLoading(true);
        modifyPwd(values).then(res => {
          if (res.code === 200) {
            message.info('修改成功');
            this.props.onCancel();
          } else {
            message.error(res.msg);
          }
        }).finally(err => {
          this.props.actionLoading(false);
        });
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };
  refresh = () => {
    this.props.form.resetFields();
  };
  imgClear = () => {
    this.changeAvator('', '');
  };
  changeImg = (file) => {
    this.changeAvator(file.url, '上传成功');
  };
  changeAvator = (imgUrl, msg) => {
    const data = {
      "avatarUrl": imgUrl,
      "gender": this.props.loginUser.principal.gender,
      "nickname": this.props.loginUser.principal.nickname
    };
    editUserDefault(data).then(res => {
      if (res.code === 200) {
        const userAllData = this.props.loginUserData;
        const currentUrl = userAllData.data.principal.avatarUrl || '';
        const changeUrl = imgUrl || '';
        if (currentUrl !== changeUrl) {
          userAllData.data.principal.avatarUrl = imgUrl;
          this.props.refreshUser(userAllData);
        }
      }
    });
  };
  showForm = () => {
    this.setState({
      showRwd: !this.state.showRwd
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <UiModal
        visible={this.props.visible}
        title='个人中心'
        modalKey='look'
        onCancel={this.props.onCancel}
        footer={null}
        className={'form-modal reset-self-modal'}
      >
        <div>
          <div className='left-part'>
            <UploadImg
              wrapClassName={'change-person-upload-img-wrap'}
              className='change-person-upload-img'
              value={this.avatarUrl}
              hideLook={true}
              onChange={this.changeImg}
              clear={this.imgClear}
              icon={<i className='rvicon rvicon-xiangji'/>}
            />
            <div className='change-button'>
              <Button onClick={this.showForm} className='modal-button save-button' type="primary"
                      htmlType="submit">修改密码</Button>
            </div>
          </div>

          <div className='text-message'>
            <div className='text-message-line'><span className='active-text mr-s'>登录账号:</span>{this.loginUser.loginName}
            </div>
            <div className='text-message-line'><span className='active-text mr-s'>用户名:</span>{this.loginUser.nickname}
            </div>
            <div className='text-message-line'><span className='active-text mr-s'>河长级别:</span>{this.loginUser.nickname}
            </div>
            <div className='text-message-line'><span className='active-text mr-s'>电话号码:</span>{this.loginUser.phone}
            </div>
            <div className='text-message-line'><span
              className='active-text mr-s'>组织机构:</span>{this.loginUser.orgPosts && this.loginUser.orgPosts.map((ele, index) => {
              return index > 0 ? `,${ele.org && ele.org.name}` : ele.org && ele.org.name;
            })}</div>
            <div className='text-message-line'><span
              className='active-text'>行政职务:</span>{this.loginUser.orgPosts && this.loginUser.orgPosts.map((ele, index) => {
              return index > 0 ? `,${ele.post}` : ele.post;
            })}</div>

          </div>

        </div>

        {this.state.showRwd ? <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="旧密码"
          >
            {getFieldDecorator('oldPasswd', {
              rules: [{
                min: 6,
                max: 20,
                required: true,
                message: '密码必须为6到20位!',
              }]
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码"
          >
            {getFieldDecorator('newPasswd', {
              rules: [{
                min: 6,
                max: 20,
                required: true,
                message: '密码必须为6到20位!',
              }]
            })(
              <Input type="password"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur}/>
            )}
          </FormItem>
          <FormItem
            key="control-buttons"
          >
            <div className="buttons">
              <Button className='modal-button' onClick={this.refresh}>重置</Button>
              <Button className='modal-button' onClick={this.props.onCancel}>取消</Button>
              <Button className='modal-button save-button' type="primary"
                      htmlType="submit">确定</Button>
            </div>

          </FormItem>
        </Form> : ''}
      </UiModal>

    );
  }

  static  defaultProps = {
    visible: false,
    onCancel: () => null,
    styleName: ''
  };
}



