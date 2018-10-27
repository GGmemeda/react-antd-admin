import React from 'react';
import CusTable from 'components/table';
import { connect } from 'react-redux';
import { list } from 'actions/user';
import { actionLoading } from 'actions/basic';
import { Input, message, Divider, Modal, Icon } from 'antd';
import SearchBar from '../../../components/searchbar';
import { FormModal } from '../../../components/modalForm';
import { FormField } from './formModalAdd';
import { Consumer } from 'context';

const confirm = Modal.confirm;
@connect(
  { list, actionLoading }
)
export default class UserManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      searchData: '',
      modalShow: false,
      modalKey: '',
      modalTitle: '',
      modalData: '',
      modalLoading: false,
      chiefType: [],
      emums: {}
    };
    this.listData = {
      page: 1,
      pageSize: 10
    };
  }

  componentDidMount () {
    this.loginUserDomain = this.props.loginUser.principal && this.props.loginUser.principal.domain && this.props.loginUser.principal.domain.area && this.props.loginUser.principal.domain.area.level;
    this.list(this.listData);
  }

  getSearchData = () => {
    return this.search.handleData();
  };
  tableAction = (actionKey, item) => {

  };
  tableHeader = () => {
    return [{
      dataIndex: 'nickname',
      title: '用户名',
      width: 100,
      render: (text, record) => {
        return <a onClick={() => this.getDetail(record, 'look', '查看')}>{text}</a>;
      }
    }, {
      dataIndex: 'loginName',
      title: '登陆账号',
      width: 100,
    }, {
      dataIndex: 'mobile',
      title: '手机号码',
      width: 100,
    }, {
      dataIndex: 'area.name',
      title: '行政区',
      className: 'text-center',
    }, {
      dataIndex: 'structure',
      title: '所属组织机构',
    }, {
      dataIndex: 'administrative',
      title: '行政职务',
    }, {
      dataIndex: 'role',
      title: '用户角色',
      width: 200,
    }];
  };
  searchFields = () => {
    return [{
      title: '行政区',
      key: 'areaId',
      type: 'cascaderRegion',
    }, {
      title: '检索',
      type: 'input',
      placeholder: '用户名/登录账号/手机/邮箱',
      key: 'searchText',
    }, {
      title: '用户角色',
      type: 'select',
      placeholder: '用户角色',
      items: () => this.state.roelsData.map(ele => ({
        name: ele.name,
        value: ele.id
      })),
      key: 'roleIds',
    }];
  };

  onSearch = (data) => {
    data.areaId = data.areaId && data.areaId[data.areaId.length - 1];
    this.listData = Object.assign({}, data, { page: 1, pageSize: 10 });
    this.list(this.listData);
  };

  list = (data) => {
    this.props.list(data);
  };

  tableChange = (current, pageSize) => {
    const data = this.getSearchData();
    if (current)
      this.listData.page = current;
    if (pageSize) {
      this.listData.page = 1;
      this.listData.pageSize = pageSize;
    }
    let upData = Object.assign({}, data, this.listData);
    this.list(upData);
  };

  formFields = () => {
    return FormField;
  };
  addUser = () => {
    this.setState({
      modalKey: 'add',
      modalShow: true,
      modalTitle: '添加',
      modalData: {}
    });

  };
  onOk = (data, formData) => {
    this.setState({
      modalLoading: true
    });
    data.gender = 'MALE';
    if (this.state.modalKey == 'add') {
      this.add(data);
    }
    if (this.state.modalKey == 'edit') {
      this.edit(data, formData);
    }

  };
  onCancel = () => {
    this.setState({
      modalShow: false
    });
  };
  tableRefresh = () => {
    this.list(this.listData);
  };
  selectChange = (value, field) => {
    if (field.name === 'chiefType') {
      const chiefType = value.split('_AND_');
      this.setState({ chiefType });
    }
    if (field.name === 'ifChief') {
      this.setState({ isChief: value });
    }
  };

  tableRowSelection = () => {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        const idArray = selectedRows.map((item) => item.id);
        this.setState({ selectedRowKeys, idArray });
      }
    };
  };
  deleteMulti = () => {
    if (this.state.idArray && this.state.idArray.length > 0) {
      this.deleteItem(this.state.idArray);
    } else {
      message.info('请先选择删除项!');
    }
  };
  reSetTableSelections = () => {
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        idArray: [],
      });
    }, 0);
  };

  render () {
    const { userList } = this.props;
    const total = userList.allData && userList.allData.total || 1;
    let userData = userList.data || [];
    const { permissions } = this.props;
    return (
      <div className="user-manage">
        <div className='section'>
          <SearchBar
            ref={node => this.search = node}
            onSubmit={this.onSearch}
            fields={this.searchFields()}
          />
          <div className='common-block'>
            <div className='operate-buttons'>
              {permissions.includes('PERMS_USER_DELETE') ?
                <span onClick={this.deleteMulti} className='inactive-text delete-multi'>
                <i className='rvicon rvicon-shanchu'/>
                 批量删除
              </span> : ''}
              {permissions.includes('PERMS_USER_CREATE') ?
                <span onClick={this.addUser} className='active-text'><Icon type="plus"/>新增</span>
                : ''}
            </div>
            <CusTable
              onCtrlClick={this.tableAction}
              pagination={true}
              sizeChange={true}
              total={total}
              currentPage={this.listData.page}
              noIndex={true}
              header={this.tableHeader()}
              onChange={this.tableChange}
              tableRefresh={this.tableRefresh}
              data={userData}
              rowSelection={this.tableRowSelection()}
              loading={userList.isFetching}
              action={row => {
                const operateButtons = [];
                if (permissions.includes(`PERMS_USER_MODIFY`)) {
                  operateButtons.push({
                    key: 'edit',
                    name: '编辑',
                    color: 'active-text',
                    customIcon: <i className={'rvicon rvicon-bianji'}/>,
                  });
                }
                if (permissions.includes('PERMS_USER_RESETPWD')) {
                  operateButtons.push({
                    key: 'reset',
                    name: '重置密码',
                    color: 'red',
                  });
                }
                if (permissions.includes(`PERMS_USER_DELETE`)) {
                  operateButtons.push({
                    key: 'delete',
                    name: '删除',
                    color: 'red',
                    customIcon: <i className={'rvicon rvicon-shanchu'}/>
                  });
                }

                return operateButtons;
              }}
            />
          </div>
        </div>

        {
          this.state.modalShow ?
            <FormModal
              modalData={this.state.modalData}
              modalKey={this.state.modalKey}
              visible={this.state.modalShow}
              title={this.state.modalTitle}
              loading={this.state.modalLoading}
              styleName={'modal-middle'}
              fields={FormField(this.state.roelsData, this.state.chiefType, this.state.isChief, this.state.emums)}
              selectChange={this.selectChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              okText="确定"
            /> :
            null
        }

      </div>
    );
  }
}
