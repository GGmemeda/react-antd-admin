import React from 'react';
import propTypes from 'prop-types';
import {
  Table,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import styles from './index.less';

export default class CusTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.currentPage
    };
  }

  // componentWillReceiveProps(props) {
  //   this.getColumns(this.props.header);
  // }

  getColumns = (headers) => {
    const {
      action,
    } = this.props;
    const columns = this.props.noIndex ? [] : [{
      dataIndex: 'rowIndex',
      title: '序号',
      width: 70,
      fixed: this.props.rowIndexFixed,
    },];
    for (const header of headers) {
      columns.push({
        ...header,
        key: header.dataIndex
      });
    }
    if (action) {
      const maxActionCount = action() && action().length || 0;
      if (!action()||action()&&action().length<1) {
        // eslint-disable-next-line
        return columns;
      }
      columns.push({
        key: 'x',
        title: '操作',
        // className: 'no-padding text-center',
        className: 'table-no-padding text-center',
        width: maxActionCount * 45,
        fixed: this.props.fixed || null,
        render: (row) => {
          const actions = action(row);
          const colWidth=actions.length * 45 ;
          if (!actions) {
            return <div/>;
          }
          const buttons = actions.map(({color, name, key, customIcon, hidden, children, atdIcon}, index) => {
            if (children) {
              return this.getActionItem({color, name, key}, children, row);
            }
            const useStyle = index > 0 ? {
              color: color,
              display: hidden ? 'none' : 'inline-block',
            } : {color: color};
            const marginStyle = index > 0 ? {
              marginLeft: 12,
            } : {};
            return (<span key={index} style={marginStyle} className='operate-single-button' title={name}><a
              key={key}
              onClick={(e) => {
                e.preventDefault();
                if ('onCtrlClick' in this.props) {
                  this.props.onCtrlClick(key, row);
                }
              }}
              style={useStyle}
            >{name}
              { atdIcon ? <span className='hide-icon icon-margin'>
                  {atdIcon ? <Icon type={atdIcon}/> : ''}
                {customIcon}
              </span> : ''}
            </a>
            </span>);
          });
          return {
            children: (<span>{buttons}</span>),
            props: {width:colWidth ,}
          };
        },
      });
    }
    return columns;
  };
  refreshButton = () => {
    const refreshButton = (<i onClick={(e) => {
      e.preventDefault();
      if ('tableRefresh' in this.props) {
        this.props.tableRefresh(e);
      }
    }} className='iconfont icon-shuaxin table-shuaxin active-text'/>);
    return refreshButton;
  };
  /** 操作详情下拉选项 */
  getActionItem = (parent, children, row) => {
    const menu = (
      <Menu>
        {
          children.map(({color, name, key, hidden}, i) => (
            hidden ? null : <Menu.Item key={i}>
              <a key={key}
                 onClick={(e) => {
                   e.preventDefault();
                   if ('onCtrlClick' in this.props) {
                     this.props.onCtrlClick(key, row);
                   }
                 }}
              >{name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (<Dropdown overlay={menu}>
      <a className="ant-dropdown-link">
        <span
          key={parent.key}
          onClick={(e) => {
            e.preventDefault();
            if ('onCtrlClick' in this.props) {
              this.props.onCtrlClick(parent.key, row);
            }
          }}
          style={{
            color: parent.color,
            marginRight: 8,
            display: parent.hidden ? 'none' : 'inline-block',
          }}
        >{parent.name}</span>
        <Icon type="down"/>
      </a>
    </Dropdown>);
  };

  onPageChangeHandler = (currentPage) => {
    this.setState({
      currentPage,
    });
    if ('onChange' in this.props) {
      this.props.onChange(currentPage);
    }
  };
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize
    });
    if ('onChange' in this.props) {
      this.props.onChange(current, pageSize);
    }
  };
  defaultRowSelection = {
    type: 'checkbox',
    fixed: true
  };

  render() {
    const instance = this;
    const {currentPage, header} = this.props;
    const columns = this.getColumns(header);
    const tableData = this.props.data.map((row, i) => ({...row, rowIndex: i + 1, key: i + 1}));
    if (this.props.rowSelection) {
      this.defaultRowSelection = Object.assign({}, this.defaultRowSelection, this.props.rowSelection);
    } else {
      this.defaultRowSelection = null;
    }

    if (this.props.scroll && this.props.scroll.x) {
      let widNum = 0;
      columns.map(ele => {
        widNum += ele.width||0;
      });
      this.props.scroll.x = widNum + 50;
    }
    return (
      <Table
        rowSelection={this.defaultRowSelection || null}
        bordered
        className={`${this.props.tableType || "common-table"} clearfix table-normal`}
        locale={{emptyText: '暂无数据'}}
        scroll={this.props.scroll}
        size={this.props.size || 'default'}
        dataSource={tableData}
        columns={columns}
        rowClassName={this.props.getRowClassName}
        loading={this.props.loading}
        pagination={this.props.pagination !== false ? {
          total: this.props.total || 1,
          pageSize: this.state.pageSize,
          current: currentPage,
          size: this.props.size || 'small',
          onChange: this.onPageChangeHandler,
          onShowSizeChange: this.onShowSizeChange,
          showSizeChanger: this.props.sizeChange,
          pageSizeOptions: ['10', '20', '50'],
          showTotal(total, range) {
            return <span className={styles.pageTotal}>{instance.refreshButton()}<span
              className='table-total-show'>显示第{range[0]}至{range[1]}结果，共<span
              className={styles.count}>{total}</span>项</span>  </span>;
          },
        } : false}
        footer={this.props.footer}
      />
    );
  }
}
CusTable.propTypes = {
  scroll: propTypes.object,
  fixed: propTypes.string,
  pageSize: propTypes.number,
  getRowClassName: propTypes.func
};
CusTable.defaultProps = {
  pageSize: 20,
};
