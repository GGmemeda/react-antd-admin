import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import {
  Button,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Form,
  Radio,
  Switch,
  Icon,
  Col,
} from 'antd';

const {RangePicker} = DatePicker;

import CommonSelect from '../../views/components/CommonSelect';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const selfLookField = ['RiverReachChoose', 'ReservoirChoose', 'LakesChoose', 'ChiefSelect', 'uploads'];

@Form.create()
export default class ModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      notRequireShow: true
    };
    this.initialData = {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formKey === 'add') {
      const {getFieldsValue, setFieldsValue} = this.props.form;
      const {fields} = this.props;
      const allValues = getFieldsValue();
      for (const field in fields) {
        let innerField = fields[field];
        const initialValue = innerField.defaultValue || '';
        const status = innerField.hasOwnProperty('defaultValue');
        if (this.initialData[innerField.name] !== initialValue && initialValue !== allValues[innerField.name] && status) {
          this.initialData[innerField.name] = initialValue;
          setFieldsValue(this.initialData);
        }
      }
    }

    if (!this.state.loaded && nextProps.formData) {
      this.setState({
        loaded: true
      }, () => {
        this.setFormValue();
      });
    }
  }

  setFormValue = () => {
    if (this.props.formKey === 'addEdit' && this.props.formData || this.props.formKey === 'edit' && this.props.formData) {
      const changValue = {};
      for (const field of this.props.fields) {
        const useName = field.editName || field.lookName || field.name;
        let attrArray = field.lookRegisterAttr || field.registerAttr;
        if (field.editDataType === 'Array') {
          if (this.props.formData[useName] instanceof Array) {
            changValue[field.name] = this.props.formData[useName].map(item => {
              return item.id;
            });
          }
        } else {
          changValue[field.name] = this.props.formData[useName];
          if (attrArray instanceof Array && attrArray) {
            attrArray.map(ele => {
              changValue[ele] = this.props.formData[ele];
            });
          }
          const isArray = changValue[field.name] instanceof Array;
          if (changValue[field.name] && typeof changValue[field.name] === 'object' &&!field.ignoreId&& !isArray) {
            if (changValue[field.name][field.editId || 'id']) {
              changValue[field.name] = changValue[field.name][field.editId || 'id'];
            }
          }
        }
      }
      this.props.form.setFieldsValue(changValue);
    }
  };
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  componentDidMount() {
    this.setFormValue();
    for (const component of this.needToEmptyStyleComponents) {
      // eslint-disable-next-line
      const dom = ReactDOM.findDOMNode(component);
      dom.setAttribute('style', '');
    }
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {onOk} = this.props;
        // if (this.upData) {
        //   values = Object.assign({}, values, this.upData);
        // }
        onOk && onOk(values, this.props.formData);
        // this.props.form.resetFields();
      }

    });
  };
  doCancel = () => {
    const {onCancel} = this.props;
    onCancel && onCancel();
    this.props.form.resetFields();
  };
  refresh = () => {
    this.props.form.resetFields();
  };
  getValue = (field) => {
    const useName = field.editName || field.lookName || field.name;
    let value = '';
    if (field.editDataType === 'Array') {
      if (this.props.formData[useName] instanceof Array) {
        value = this.props.formData[useName].map(item => {
          return item.id;
        });
      }
    } else {
      value = this.props.formData[useName];
      if (value && field.editId && value[field.name][field.editId]) {
        value = value[field.name][field.editId];
      }
    }
    return value;
  };

  generateFormItem = ({formItemLayout, label, hasFeedBack, name, options, component, field}) => {
    const {getFieldDecorator} = this.props.form;
    let formItem;
    let attrArray = field.lookRegisterAttr || field.registerAttr || [];
    if (attrArray.length > 0) {
      attrArray.map((ele, index) => {
        if (index > 0) {
          getFieldDecorator(ele, {...options});
        }
      });
    }

    formItem = <FormItem
      {...formItemLayout}
      key={name}
      label={label}
      hasFeedBack={hasFeedBack}
    >
      {getFieldDecorator(name, options)(component)}
    </FormItem>;
    if (this.props.col && typeof this.props.col === 'number') {
      formItem = <Col key={name} span={this.props.col}>
        {formItem}
      </Col>;
    }
    if (field.oneline) {
      formItem = <div key={name + '1'} className='clearfix'>
        {formItem}
      </div>;
    }
    return (formItem);
  };
  getTextField = (field, formData) => {
    if (!formData) return;
    let useName = field.lookName || field.name;
    let string = '';
    if (useName.split('.').length > 1) {
      const arrayFieldName = useName.split('.');
      const firstField = arrayFieldName.shift();
      string = formData[firstField];
      if (string) {
        arrayFieldName.map(item => {
          if (typeof string === 'object') {
            string = string[item];
          }
        });
      }
    }
    if (field.name && formData[useName]) {
      if (formData[useName] instanceof Array) {
        formData[useName].map((item, index) => {
          string += index > 0 ? `，${item[field.lookField]}` : item[field.lookField];
        });
      } else {
        string = field.name && formData[useName];
      }
    }
    return <span
      className={` ${this.props.formKey === 'look' ? 'look-span' : 'ant-form-text'}`}>{field.options && field.options.initialValue || string}</span>;
  };
  getLookImgField = (field, formData) => {
    const imageArray = formData[field.name];
    if (field.name && formData) {
      if (imageArray instanceof Array && imageArray.length > 0) {
        return (<span>{imageArray.map((item, index) => (
          <img style={{marginLeft: '10px'}} key={index} src={item} width='100' height='100'/>
        ))}</span>);
      }
      if (formData[field.name]) {
        return <span><img src={formData[field.name]} width='100' height='100'/><input type="text"
                                                                                      style={{visibility: 'hidden'}}/></span>;
      }

    }
    return <span/>;
  };
  getInputField = (field) => {
    let status = (this.props.formKey === 'edit' ? !field.edit : false);

    return (<Input type={field.downType || 'text'}
                   disabled={status || field.options && field.options.disabled} {...field.eleOptions || {}} />);
  };
  getAddressPointField = (field, formData) => {
    const {getFieldDecorator} = this.props.form;
    return (
      <Col>
        <InputGroup compact>
          <FormItem key={field.attr[0]} style={{width: '50%'}}>
            {getFieldDecorator(field.attr[0], field.options)(
              <InputNumber max={90}/>)}
          </FormItem>
          <FormItem key={field.attr[1]} style={{width: '50%'}}>
            {getFieldDecorator(field.attr[1], field.options)(
              <InputNumber max={360}/>)}
          </FormItem>
        </InputGroup>
      </Col>
    );
  };
  getInputNumberField = field => <InputNumber
    step={field.options && field.options.step}
    formatter={field.options && field.options.formatter}
    style={{width: '100%'}}
    {...field.eleOptions || {}}
  />;


  getTextAreaField = field => (
    <Input.TextArea rows={field.options && field.options.rows || 4}
                    disabled={field.options && field.options.disabled}/>);



  getSelectField = field => {
    let items = field.items || [];
    const _this = this;
    const {getFieldsValue, setFieldsValue} = this.props.form;
    if (typeof field.items === 'function') {
      items = field.items();
    }
    const itemsArray = [];
    items.map(({name, value}) => {
      itemsArray.push((<Select.Option key={value} value={value}>{name}</Select.Option>));
    });
    return (<Select
      placeholder="请选择"
      style={{
        width: '100%',
      }}

      onChange={(value) => {
        this.changeProps(value, field);
        this.resetComponents(field.clearField);
      }}
      showSearch={field.showSearch || false}
      allowClear
      notFoundContent={field.notFoundContent || '没有数据'}
      optionFilterProp="children"
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      getPopupContainer={() => this.formWrapper}
      disabled={field.disabled}
      mode={field.multiple || null}
    >
      {itemsArray}
    </Select>);
  };
  resetComponents = (items) => {
    if (items && items instanceof Array) {
      let changeObj = {};
      items.map(ele => {
        changeObj[ele] = '';
      });
      this.reset = true;
      this.props.form.setFieldsValue(changeObj);
    }
  };
  getRadioGroupField = field => <RadioGroup>
    {field.items().map(({key, value}) =>
      <Radio key={key.toString()} value={key.toString()}>{value}</Radio>
    )}
  </RadioGroup>;

  getDateField = field => (<DatePicker
    showToday={false}
    format="YYYY-MM-DD"
    style={{
      width: '100%',
    }}
    placeholder="请选择日期"
  />);
  getDateRangeField = field => (<RangePicker
    onChange={(date, dateString) => {
    }}
    {...field.eleOptions || {}}

  />);

  getDateTimeField = field =>
    (<DatePicker
      showTime
      format="YYYY-MM-DD"
      placeholder="请选择时间"
      showToday={false}
      ref={item => this.needToEmptyStyleComponents.push(item)}
    />);

  getSwitchField = (field, formData) => {
    const useName = field.editName || field.name;
    let useValue = false;
    if (this.props.formKey === 'edit') {
      useValue = formData[useName];
    }

    return (<Switch
      checkedChildren={field.options && field.options.checkedText || '开'}
      unCheckedChildren={field.options && field.options.unCheckedText || '关'}
      onChange={(value => {
        this.changeProps(value, field);
      })}
      disabled={field.options && field.options.disabled || null}
      defaultChecked={field.options && field.options.initialValue || useValue}
    />);
  };

  changeProps = (value, field) => {
    if ('selectChange' in this.props && this.props.selectChange) {
      const allData = this.props.form.getFieldsValue();
      this.props.selectChange(value, field, allData);
    }
  };
  generateFormFields = (fields, formKey, formData) => {
    let lookStatus = false;
    if (formKey === 'look') {
      lookStatus = true;
    }
    const formItemLayout = this.props && this.props.formItemLayout || {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    const components = [];
    this.needToEmptyStyleComponents = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const field of fields) {
      let component = null;
      if (lookStatus) {
        if (selfLookField.indexOf(field.type) === -1) {
          field.type = '';
        }
        field.options = [];
        if (field.notLook) {
          continue;
        }
        if (field.lookImg) {
          field.type = 'lookImg';
        }

      }
      if (formKey === 'edit') {
        if (field.notEdit) {
          continue;
        }
      }
      switch (field.type) {
        case 'input':
          component = this.getInputField(field, formData);
          break;
        case 'inputNumber':
          component = this.getInputNumberField(field, lookStatus);
          break;
        case 'select':
          component = this.getSelectField(field, lookStatus);
          break;
        case 'RiverReachChoose':
          component = this.getRiverReachChooseField(field, formData);
          break;
        case 'ReservoirChoose':
          component = this.getReservoirChooseField(field, formData);
          break;
        case 'LakesChoose':
          component = this.getLakesChooseField(field, formData);
          break;
        case 'radioGroup':
          component = this.getRadioGroupField(field, lookStatus);
          break;
        case 'addressPoint':
          component = this.getAddressPointField(field, formData);
          break;
        case 'date':
          component = this.getDateField(field, lookStatus);
          break;
        case 'dateRange':
          component = this.getDateRangeField(field, formData);
          break;
        case 'cascaderRegion':
          component = this.getCascaderRegion(field, formData);
          break;
        case 'OrganizationSelect':
          component = this.getOrganizationSelect(field, formData);
          break;
        case 'CompanySelect':
          component = this.getCompanySelect(field, formData);
          break;
          case 'CommonSelect':
          component = this.getCommonSelect(field, formData);
          break;
        case 'ChiefSelect':
          component = this.getChiefSelect(field, formData);
          break;
        case 'datetime':
          component = this.getDateTimeField(field, lookStatus);
          break;
        case 'switch':
          component = this.getSwitchField(field, formData);
          break;
        case 'upload':
          component = this.getUploadField(field, formData);
          break;
        case 'uploads':
          component = this.getUploadsField(field, formData);
          break;
        case 'textarea':
          component = this.getTextAreaField(field, lookStatus);
          break;
        case 'location':
          component = this.getLocationField(field, formData);
          break;
        case 'lookImg':
          component = this.getLookImgField(field, formData);
          break;
        default:
          component = this.getTextField(field, formData);
          break;
      }
      component = this.generateFormItem({
        formItemLayout,
        component,
        field,
        label: field.label,
        name: field.name,
        options: field.options,
        hasFeedBack: field.type === 'input',
      });
      components.push(component);
    }
    return components;
  };
  buttons = () => {
    const buttons = (<FormItem
      key="control-buttons"
    >
      <div className="buttons">
        {this.props.showRefresh && this.props.formKey === 'add' &&
        <Button className='modal-button' onClick={this.refresh}>重置</Button>}
        {this.props.showCancel && <Button className='modal-button' onClick={this.doCancel}>取消</Button>}
        {!this.props.noBtn && this.props.formKey !== 'look' &&
        <Button className='modal-button save-button' type="primary"
                htmlType="submit">{this.props.okText || '确定'}</Button>}
      </div>

    </FormItem>);
    return buttons;
  };
  changeNotRequire = () => {
    this.setState({
      notRequireShow: !this.state.notRequireShow
    });
  };

  render() {
    const {
      fields,
      formKey,
      formData
    } = this.props;
    const requireField = [];
    const requireNot = [];
    if (fields.length > 0) {
      fields.map((item, index) => {
        if (item.requireShow === true) {
          requireField.push(item);
        } else {
          requireNot.push(item);
        }
      });
    }
    return (
      <div className="formWrapper" ref={node => this.formWrapper = node}>
        <Form onSubmit={this.handleSubmit} ref={(c) => {
          this.form = c;
          this.props.cb && this.props.cb(this.handleSubmit);
        }}
        >
          <div className='form-require clearfix'>
            {this.generateFormFields(requireField, formKey, formData)}
          </div>
          {requireNot.length > 0 ?
            <div onClick={this.changeNotRequire} className='form-more active-text'>{this.state.notRequireShow ?
              <span>点击展开<Icon type="down"/></span> : <span>点击收起<Icon type="up"/></span>}</div> : ''}
          <div
            className={` clearfix form-notRequire ${this.state.notRequireShow ? 'hidden-ele' : ''}`}>
            {this.generateFormFields(requireNot, formKey, formData)}
          </div>

          {this.buttons()}
        </Form>
      </div>
    );
  }
}


