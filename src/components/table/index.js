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

  getColumns = (headers) => {
    const {
      action,
      hideOperate
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
      if (!action()&&!hideOperate || action() && action().length < 1&&!hideOperate) {
        // eslint-disable-next-line
        return columns;
      }
      columns.push({
        key: 'x',
        title: '操作',
        // className: 'no-padding text-center',
        className: 'table-no-padding text-center',
        width: maxActionCount * 60,
        fixed: this.props.fixed || null,
        render: (row) => {
          const actions = action(row);
          const colWidth = actions.length * 60;
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
              {atdIcon ? <span className='hide-icon icon-margin'>
                  {atdIcon ? <Icon type={atdIcon}/> : ''}
                {customIcon}
              </span> : ''}
            </a>
            </span>);
          });
          return {
            children: (<span>{buttons}</span>),
            props: {width: colWidth,}
          };
        },
      });
    }
    return columns;
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

  // 集合所有table props
  constructorProps = () => {
    const {className = '', size = 'default', rowClassName = '', loading=false, header, options, footer,pagination} = this.props;
    const columns = this.getColumns(header);
    const tableData = this.props.data.map((row, i) => {
      return {...row, rowIndex: i + 1, key: row.key || i + 1};
    });
    let defaultProps = {
      bordered: true,
      className: ` common-table clearfix table-normal ${className}`,
      size: size,
      locale: {emptyText: '暂无数据'},
      dataSource: tableData,
      columns: columns,
      rowClassName: rowClassName,
      loading: loading
    };
    if (this.props.rowSelection) {
      defaultProps.rowSelection = Object.assign({}, {
        type: 'checkbox',
        fixed: true
      }, this.props.rowSelection);
    }
    if (this.props.scroll && this.props.scroll.x) {
      let scrollData = this.props.scroll;
      let widNum = 0;
      columns.map(ele => {
        widNum += ele.width || 0;
      });
      scrollData.x = widNum + 50;
      defaultProps.scroll = scrollData;
    }
    if (pagination!==false){
      defaultProps.pagination = {
        total: this.props.total || 1,
        pageSize: this.state.pageSize,
        current: this.props.currentPage,
        size: this.props.size || 'small',
        onChange: this.onPageChangeHandler,
        onShowSizeChange: this.onShowSizeChange,
        showSizeChanger: this.props.sizeChange,
        pageSizeOptions: ['10', '20', '50'],
        showTotal(total, range) {
          return <span className={styles.pageTotal}><span
            className='table-total-show'>共<span
            className={styles.count}>{total}</span>项</span>  </span>;
        },
      };
    }
    else{
      defaultProps.pagination=false;
    }
    if (footer) {
      defaultProps.footer = footer;
    }
    if (options) {
      defaultProps = Object.assign(defaultProps,options);
    }
    return defaultProps;
  };
  render() {
    const props = this.constructorProps();
    return (
      <Table
        {...props}
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
