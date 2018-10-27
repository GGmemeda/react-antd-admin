import React from 'react';
import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import {userList as user} from '../../../api/user';

const Option = Select.Option;

export default class CommonSelect extends React.Component {
  constructor(props) {
    super(props);
    this.fetch = debounce(this.fetch, 800);
    this.keyArray = [];
    this.state = {
      data: [],
      value: this.props.mode === 'multiple' ? [] : '',
      fetching: false,
    };
    this.fechList = {
      user,
    };
  }


  fetch = (value) => {
    this.setState({data: [], fetching: true});
    const upData = {
      searchText: value,
      areaId: this.props.areaId,
      pageSize: 10000
    };
    if (!value) return;
    this.fechList[this.props.typeMode](upData).then(res => {
      if (res.code === 200) {
        const data = res.data;
        this.setState({data, fetching: false});
      }
    });

  };
  handleChange = (value, option) => {
    if (!this.props.mode && 'onChange' in this.props) {
      const backData={...value, id: value.key, name: value.label};
      this.props.onChange(option && option.key?backData:undefined, option.key||undefined);
    }
    if (this && this.setState) {
      this.setState({
        value: value || undefined,
        data: [],
        fetching: false,
      });
    }
  };
  deleteItem = (value, options) => {
    const num = this.keyArray.indexOf(value);
    this.keyArray.splice(num, 1);
    let idArrays = [];
    this.keyArray.map(ele => {
      idArrays.push(ele.key);
    });
    if ('onChange' in this.props) {
      this.props.onChange(this.keyArray, options || [], idArrays);
    }
  };
  selectItem = (value, options) => {
    if ('onChange' in this.props) {
      if (this.props.mode) {
        if (this.keyArray.indexOf(value) === -1) {
          this.keyArray.push({...value, id: value.key, name: value.label});
        }
        let idArrays = [];
        this.keyArray.map(ele => {
          idArrays.push(ele.key);
        });
        this.props.onChange(this.keyArray, options || [], idArrays);
      } else {
        this.props.onChange(options && options.key || '', value || '');
      }
    }
  };
  constructorData = (nextProps) => {
    let data = this.props.mode === 'multiple' ? [] : {};
    if (this.props.mode && nextProps.value instanceof Array && nextProps.value.length > 0) {
      nextProps.value.map(ele => {
        data.push({
          ...ele, key: ele.id || ele.key, label: ele.name || ele.label,
          id: ele.id || ele.key,
          name: ele.name || ele.label,
        });
      });
    }
    if (!this.props.mode && nextProps.value) {
      data = {
        ...nextProps.value,
        id: nextProps.value.id || nextProps.value.key,
        name: nextProps.value.name || nextProps.value.label,
        key: nextProps.value.id || nextProps.value.key,
        label: nextProps.value.name || nextProps.value.label
      };
    }
    this.organizationValue = data;
    this.keyArray = data;
    return data;
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps&&nextProps.value) {
      const backData = this.constructorData(nextProps);
      this.setValue(backData);
    }
  }
  componentWillMount() {
    if ('value' in this.props&&this.props.value) {
      const backData = this.constructorData(this.props);
      this.setValue(backData);
    }
  }

  setValue = (values) => {
    this.setState({
      value: values,
      data: this.props.mode ? values : [values],
      fetching: false,
    });
  };



  reset = () => {
    this.setState({
      value: this.props.mode === 'multiple' ? [] : '',
    });
  };

  render() {
    const {fetching, data, value} = this.state;
    return (
      <Select
        allowClear={true}
        showSearch
        labelInValue
        value={value || undefined}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.fetch}
        onChange={this.handleChange}
        notFoundContent={fetching || data.length < 1 ? <Spin size="small"/> : null}
        style={{width: '100%'}}
        onSelect={this.selectItem}
        placeholder={this.props.placeholder || "请输入查找"}
        mode={this.props.mode || null}
        onDeselect={this.deleteItem}
        {...this.props.attr || {}}
      >
        {data.map(d => <Option key={d.id}>{d.name}</Option>)}
      </Select>
    );
  }
}
