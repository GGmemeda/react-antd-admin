import React from 'react';
import {Cascader} from 'antd';
import {areaList, siblingsArea} from '../../../api';

export default class CascaderRegion extends React.Component {
  state = {
    options: [],
    regionValue: []
  };
  regionGet = false;
  regionValue = false;

  getList(data) {
    let useData = data || {};
    const instance = this;
    useData.pageSize = 10000;
    return new Promise((resolve, reject) => {
      areaList(useData).then(res => {
        if (res.code === 200) {
          let items = res.data;
          if (res.data.length > 0) {
            items.map(item => {
              item.value = item.id;
              item.label = item.name;
              item.isLeaf = false;
            });
          }
          if (instance.state.regionValue) {

          }
          if (data) {
            resolve(items);
          } else {
            this.setState({
              options: items,
            });
          }
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.regionValue = nextProps.regoinValue || [];
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  componentDidMount() {
    if (this.props.regoinValue) this.regionValue = this.props.regoinValue || [];
    else this.getList();
  }

  reset = () => {
    this.setState({regionValue: []});
    this.regionGet=false;
  };
  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
    this.setState({regionValue: value});
    if ('onChange' in this.props) {
      this.props.onChange(value);
    }
  };
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const upData = {parentId: targetOption.id};
    targetOption.loading = true;
    this.getList(upData).then(res => {
      targetOption.loading = false;
      targetOption.children = res;
      res.map(item => {
        if (item.level === "VILLAGE") {
          item.isLeaf = true;
        }
      });
      this.setState({
        options: [...this.state.options],
      });
    });
  };
  pushLeaf = (items) => {
    items.map(item => {
      if (item.level !== 'VILLAGE') {
        item.isLeaf = false;
      }
      if (item.children && item.children.length > 0) {
        this.pushLeaf(item.children);
      }
    });
  };
  areaSiblings = () => {
    let status = true;
    this.regionValue.map(ele => {
      if (!ele) {
        status = false;
      }
    });
    if (!status) return;
    const upId = this.regionValue[this.regionValue.length - 1];
    siblingsArea(upId).then(res => {
      if (res.code === 200) {
        this.pushLeaf(res.data);
        this.setState({
          options: res.data,
          regionValue: this.regionValue
        });
      }
    });
  };
  popupChange = (value) => {
    if ('onPopupChange' in this.props && !value) {
      setTimeout(() => {
        this.props.onPopupChange(this.state.regionValue);
      }, 0);
    }
  };
  filter = () => {
    return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
  };

  render() {
    if (this.regionValue.length > 0 && !this.regionGet) {
      this.regionGet = true;
      this.areaSiblings();
    }
    return (
      <Cascader
        fieldNames={{label: 'name', value: 'id'}}
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        onPopupVisibleChange={this.popupChange}
        value={this.state.regionValue}
        placeholder='请选择'
        // showSearch={this.filter}
        notFoundContent='没有数据'
        {...this.props.attrs || {}}
        changeOnSelect
      />
    );
  }
}
