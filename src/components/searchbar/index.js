import React from 'react';
import ReactDOM from 'react-dom';
import {
  Input,
  Button,
  Select,
  DatePicker,
  Cascader,
  Icon,
  InputNumber
} from 'antd';
import './index.less';
import CascaderRegion from '../../views/components/CascaderRegion';
import OrganizationSelect from 'views/components/OrganizationSelect';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const {MonthPicker, WeekPicker} = DatePicker;

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      autoComplete: {},
      disabled: {},
      warnings: {},
      collapsed: false
    };
  }

  buttonSet(actions) {
    const buttons = [];
    let buttonActions = actions();
    if (buttonActions) {
      buttonActions.map(item => {
        buttons.push((
          <Button key={item.key} onClick={(e) => {
            e.preventDefault();
            if ('buttonClick' in this.props) {
              const backData = this.handleData();
              this.props.buttonClick(item.key, backData);
            }
          }} className="search">{item.name}</Button>
        ));
      });
    }
    return buttons;

  }

  setDefaultValue = (items) => {
    const data = Object.assign({}, this.state.fields, items);
    this.setState({fields: items});
  };
  setFieldsValue = (data) => {
    this.setState({fields: data});
  };

  setField(field, value) {
    const {
      fields,
      warnings
    } = this.state;
    let newValue = value;
    if (Array.isArray(newValue) && newValue.length === 0) {
      newValue = undefined;
    }
    if (field.validator) {
      try {
        newValue = field.validator(value);
        warnings[field.key] = '';
      } catch (e) {
        warnings[field.key] = e.message;
      }
    }
    if (typeof field.key !== 'string') {
      fields[field.key[0]] = newValue && newValue[0];
      fields[field.key[1]] = newValue && newValue[1];
    } else {
      fields[field.key] = newValue;
    }
    this.setState({
      fields,
      warnings
    });
  }


  componentDidMount() {
    // eslint-disable-next-line no-restricted-syntax
    for (const component of this.needToEmptyStyleComponents) {
      // eslint-disable-next-line react/no-find-dom-node
      const dom = ReactDOM.findDOMNode(component);
      dom.setAttribute('style', '');
    }
  }

  generateComponents = (field) => {
    let component = null;
    let items = [];
    if (field.items) {
      items = field.items();
    }
    switch (field.type) {
      case 'input':
      default:
        if ('autoComplete' in field) {  // 自动补全
          component = (<Select
            combobox
            value={this.state.fields[field.key]}
            showArrow={false}
            filterOption={false}
            disabled={this.state.disabled[field.key]}
            style={{
              width: '100%',
            }}
            notFoundContent="未找到"
            onChange={(value) => {
              this.setField(field, value);
              field
                .autoComplete(value)
                .then((result) => {
                  const {autoComplete} = this.state;
                  autoComplete[field.key] = result;
                  this.setState({autoComplete});
                });
            }}
          >
            {(this.state.autoComplete[field.key] || []).map((value, key) =>
              <Select.Option key={key} value={value}>{value}</Select.Option>)}
          </Select>);
        } else {
          component = (<Input
            style={{width: '100%'}}
            placeholder={field.placeholder}
            value={this.state.fields[field.key] === undefined ? (field.defaultValue && field.defaultValue.toString()) : this.state.fields[field.key]}
            onChange={e => {
              return this.setField(field, e.target.value);
            }}
          />);
        }
        break;

      case 'cascader':  // 级联
        component = (<Cascader
          options={items}
          placeholder="请选择"
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          showSearch
        />);
        break;
      case 'cascaderRegion':  // 区域级联
        component = (<CascaderRegion
          ref={node => this.cascaderRegion = node}
          onChange={value => {
            this.setField(field, value);
            this.resetComponent(field.clearKeys);
          }}
          regoinValue={!this.state.fields[field.key] ? field.defaultValue : this.state.fields[field.key]}
          onPopupChange={(value) => {
            if ('selectChange' in this.props && this.props.selectChange) {
              this.props.selectChange(value, field, this.state.fields);
            }

          }} options={field.options || []}/>);
        break;
      case 'OrganizationSelect':  // 组织机构选择
        component = (<OrganizationSelect
          areaId={field.areaId || ''}
          placeholder={field.placeholder}
          ref={node => this.OrganizationSelect = node}
          onChange={value => {
            this.setField(field, value);
          }} options={field.options || []}/>);
        break;
      case 'Number':
        component = (<InputNumber
          {...field.options}
          style={{width: 'auto'}}
          value={this.state.fields[field.key]}
          onChange={value => this.setField(field, value)}
        />);
        break;
      case 'select':
        component = (<Select
          showSearch={field.showSearch || false}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder="请选择"
          notFoundContent={field.notFoundContent || '请等待'}
          value={this.state.fields[field.key] === undefined ? (field.defaultValue && field.defaultValue.toString()) : this.state.fields[field.key]}
          mode={field.multiple}
          allowClear={true}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            field.onChange && field.onChange(value);
            if ('selectChange' in this.props) {
              this.props.selectChange(value, field, this.state.fields);
            }
            this.setField(field, value || '');
            this.resetComponent(field.clearKeys);
          }}
          style={{
            width: '100%',
          }}
        >
          {items && items.map(({name, value}) =>
            <Select.Option key={value.toString()} value={value.toString()}>{name}</Select.Option>)}
        </Select>);
        break;
      case 'date':
        component = (<DatePicker
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          placeholder="请选择日期"
          mode={field.mode}
          showToday={false}
        />);
        break;
      case 'yearPicker':
        component = (<DatePicker
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            if ('selectChange' in this.props) {
              this.props.selectChange(value, field, this.state.fields);
            }
            this.setField(field, value);
          }}
          placeholder="请选择年份"
          format="YYYY"
          mode='year'
        />);
        break;
      case 'monthPicker':
        component = (<MonthPicker
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            if ('selectChange' in this.props) {
              this.props.selectChange(value, field, this.state.fields);
            }
            this.setField(field, value);
          }}
          placeholder="请选择月份"
          showToday={false}
        />);
        break;
      case 'weekPicker':
        component = (<WeekPicker
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          placeholder="请选择周数"
          showToday={false}
        />);
        break;
      case 'rangePicker':
        component = (<DatePicker.RangePicker
          format="YYYY-MM-DD"
          locale={locale}
          value={[this.state.fields[field.key[0]], this.state.fields[field.key[1]]]}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            if ('selectChange' in this.props) {
              this.props.selectChange(value, field, this.state.fields);
            }
            this.setField(field, value);
          }}
          showToday={false}
        />);
        break;
      case 'rangeTimePicker':
        component = (<DatePicker.RangePicker
          showTime
          format="YYYY-MM-DD  HH:mm:ss"
          placeholder={['开始时间', '结束时间']}
          locale={locale}
          value={[this.state.fields[field.key[0]], this.state.fields[field.key[1]]]}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            if ('selectChange' in this.props) {
              this.props.selectChange(value, field, this.state.fields);
            }
            this.setField(field, value);
          }}
          showToday={false}
        />);
        break;
      case 'datetime':
        component = (<DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          placeholder="请选择时间"

          ref={item => this.needToEmptyStyleComponents.push(item)}
          showToday={false}
        />);
        break;
    }
    return component;
  };

  generateInputs(fields) {
    const components = [];
    this.needToEmptyStyleComponents = [];
    let i = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const field of fields) {
      let componentEle;
      if (field.rangeComponents) {
        componentEle = <div className="input clearfix">
          <span className="input clearfix"
                style={{width: field.rangeComponents[0].width || 160}}>{this.generateComponents(field.rangeComponents[0])}{field.rangeComponents[0].insertAfter}</span>
          <span className='search-middle'>-</span>
          <span className="input clearfix"
                style={{width: field.rangeComponents[0].width || 160}}>{this.generateComponents(field.rangeComponents[1])}{field.rangeComponents[1].insertAfter}</span>
        </div>;
      } else {
        componentEle = <div style={{width: field.width || 160}}
                            className="input clearfix">{this.generateComponents(field)}{field.insertAfter}</div>;

      }
      components.push(<div key={i++} className="field clearfix">
        <div className="input clearfix">
          <div className="title " style={{width: field.labelWidth}}>{field.title}：</div>
          {componentEle}
        </div>
        <div className="warning">{this.state.warnings[field.key]}</div>
      </div>);
    }
    return components;
  }

  resetComponent = (field) => {
    if (field) {
      let useObj = this.state.fields;
      if (field.key instanceof Array) {
        field.key.map((item, index) => {
          if (this.state.fields[field.key[index]]) {
            useObj[field.key[index]] = undefined;
          }

        });
      } else {
        if (this.state.fields[field.key]) {
          useObj[field.key] = undefined;
        }
      }
      if (Object.keys(useObj).length > 0) {
        this.setState({
          fields: useObj
        });
      }
    }
  };
  handleReset = () => {
    if ('onReset' in this.props) {
      this.props.onReset();
    }
    if (this.OrganizationSelect) {
      this.OrganizationSelect.reset();
    }
    if (this.cascaderRegion) {
      this.cascaderRegion.reset();
    }
    this.setState({
      fields: {},
    });
  };
  defaultValue = () => {
    const {fields} = this.props;
    const fieldsData = {};
    for (const field of fields) {
      const defaultValue = field.defaultValue;
      let status = field.hasOwnProperty('defaultValue');
      if (status) {
        if (typeof field.key !== 'string') {
          field.key.map((item, index) => {
            fieldsData[field.key[index]] = defaultValue && defaultValue[index];
          });
        } else {
          fieldsData[field.key] = defaultValue;
        }
      }

    }
    return fieldsData;
  };
  handleData = () => {
    const fields = {};
    const defaultData = this.defaultValue();
    // eslint-disable-next-line
    for (const key in this.state.fields) {
      let value = this.state.fields[key];
      if (value === undefined && this.props.filterVoidValue || value === null && this.props.filterVoidValue) {
        // eslint-disable-next-line
        continue;
      }
      if (Array.isArray(value)) {
        fields[key] = value;
        // eslint-disable-next-line
        continue;
      }
      if (typeof value === 'string') {
        value = value.trim();
      }
      fields[key] = value || null;
    }
    const upData = Object.assign({}, defaultData, fields);
    return upData;
  };
  handleSubmit = () => {
    let {warnings} = this.state;
    warnings = {};
    for (const field of this.props.fields) {
      if (field.validator) {
        try {
          field.validator(this.state.fields[field.key]);
        } catch (e) {
          warnings[field.key] = e.message;
        }
      }
    }
    if (Object.keys(warnings).length) {
      this.setState({
        warnings
      });
      return;
    }
    this.setState({warnings: {}});
    if ('onSubmit' in this.props) {
      const fields = this.handleData();
      this.props.onSubmit(fields);
    }
  };

  show = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <div className='search-block'>
        <div className='top-title'>
          <div className='search-line'/>
          查询条件设置
          <div className={`search-bar-open active-text `}
               onClick={this.show}> {!this.state.collapsed ? <span><Icon type="up" className='mr-s'/>收起</span> :
            <span><Icon type="down" className='mr-s'/>展开</span>} </div>
        </div>
        <div className={`search-bar ${this.state.collapsed ? 'close-collapsed' : 'open-collapsed'}`}>
          {'insertBefore' in this.props ? this.props.insertBefore : null}
          <div className="buttonGroup">
            {/*<Button onClick={this.handleReset} className="reset">重置</Button>*/}
            <Button onClick={this.handleSubmit} className="search">查询</Button>
            {this.props.buttons ? this.buttonSet(this.props.buttons) : ''}
            {/*<div className='active-text search-bar-close' onClick={this.show}>收起 <Icon type="up"/></div>*/}
          </div>
          {this.generateInputs(this.props.fields)}
        </div>
      </div>
    );
  }
}

SearchBar.defaultProps = {
  hasReset: true,
};
