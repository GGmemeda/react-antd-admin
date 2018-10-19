import React from 'react';
// import {connect} from 'react-redux';
import {Input, Icon, Modal, Button, AutoComplete, Tooltip, Popover, InputNumber} from 'antd';
import Location from 'components/map/location';
import debounce from 'lodash/debounce';
import './index.less';

const Search = Input.Search;
const InputGroup = Input.Group;
const Option = AutoComplete.Option;

export default class AddressChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchValue: '',
      inputValueChange: '',
      inputValue: '',
      addressAutoCompleteDataSource: []
    };
    this.prevAddressPoint = {};
    this.addressPoint = {};
  }

  openMap = () => {
    this.setState({
      visible: true
    });
  };
  onCancel = () => {
    this.setState({
      visible: false
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.locationValue && this.locationValue !== nextProps.locationValue) {
      this.setState({
        inputShowValue: nextProps.locationValue
      });
      this.locationValue = nextProps.locationValue;
      this.place = nextProps.locationValue;
    }
    if (nextProps.locationPoint && nextProps.locationPoint.latitude !== this.prevAddressPoint.latitude && nextProps.locationPoint.longitude !== this.prevAddressPoint.longitude) {
      this.addressPoint = this.props.locationPoint;
      this.prevAddressPoint = this.props.locationPoint;
    }
  }

  locationChane = (position, currentLocation) => {
    this.place = currentLocation;
    this.addressPoint = {
      latitude: position.lat,
      longitude: position.lng,
      coordSystem: 'GCJ02'
    };
    this.setState({
      searchValue: currentLocation
    });
  };
  mapButton = () => {
    return (<Button className=' enter-button' onClick={this.openMap}> <i className='rvicon rvicon-dingwei2 active-text mr-s'/>地图选址</Button>);
  };
  onSearch = (e) => {
    this.setState({
      inputValue: this.state.searchValue
    });
  };
  onOk = () => {
    this.setState({
      visible: false,
      inputShowValue: this.place,
    });
    if ('onChange' in this.props) {
      this.props.onChange(this.place, this.addressPoint);
    }
  };
  outInputValue = (e) => {
    this.setState({
      inputShowValue: e.target.value
    });
    this.place = e.target.value;
    if ('onChange' in this.props) {
      this.props.onChange(e.target.value, this.addressPoint || '');
    }
  };
  changeLat = (e) => {
    this.addressPoint = {
      latitude: e,
      longitude: this.addressPoint && this.addressPoint.longitude,
      coordSystem: 'GCJ02'
    };
    if ('onChange' in this.props) {
      this.props.onChange(this.place, this.addressPoint || '');
    }
  };
  changeLon = (e) => {
    this.addressPoint = {
      latitude: this.addressPoint && this.addressPoint.latitude,
      longitude: e,
      coordSystem: 'GCJ02'
    };
    if ('onChange' in this.props) {
      this.props.onChange(this.place, this.addressPoint || '');
    }
  };
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  render() {
    const title = (
      <span>
        {this.state.inputShowValue}
      </span>
    );
    return (
      <div ref={node => this.wrapper = node} className={`addressChoose ${this.props.className} `}>
        {this.props.readonly ?
          <Popover content={title}>
            <Input readOnly={this.props.readonly || false} value={this.state.inputShowValue}
                   onChange={this.outInputValue}
                   addonAfter={this.mapButton()}/>
          </Popover>
          : <span><Tooltip
            trigger={['focus']}
            title={title}
            getPopupContainer={() => this.wrapper}
            placement="topLeft">
            <Input placeholder="选择地址" readOnly={this.props.readonly || false} value={this.state.inputShowValue}
                   onChange={this.outInputValue}
                   addonAfter={this.mapButton()}/>
          </Tooltip></span>}
        {this.props.showLatLon && this.state.inputShowValue ?
          <span>
        <span className='mr-s'><InputNumber style={{width: '48%'}} placeholder='输入经度'
                                            value={this.addressPoint.longitude} max={180}
                                            onChange={this.changeLon}/></span>
        <span><InputNumber style={{width: '48%'}} placeholder='输入纬度' value={this.addressPoint.latitude} max={90}
                           onChange={this.changeLat}/></span>
        </span> : ''
        }
        <Modal
          closable={false}
          className='modal-map'
          onCancel={this.onCancel}
          onOk={this.onOk}
          okText='确认'
          cancelText='取消'
          title={'位置选择'}
          visible={this.state.visible}>
          <div className='inner-map'>
            <div className='search-input'>
              <AutoComplete
                backfill={true}
                dataSource={this.state.addressAutoCompleteDataSource}
                className="global-search"
                style={{width: '100%'}}
                placeholder="请输入地址"
                optionLabelProp="text"
                value={this.state.searchValue}
                onSelect={(val, option) => {
                  const location = option.props.district ? (option.props.district + option.props.address + option.props.name) : option.props.name;
                  this.addressMap.setValue(option.props.location, location, true);
                  this.setState({
                    searchValue: location
                  });
                }}
                onChange={(value) => {
                  this.setState({
                    searchValue: value
                  });
                }}
                onSearch={(searchText) => {
                  if (this.addressMap) {
                    this.addressMap.autocompleteSearch(searchText, (status, result) => {
                      console.log("autocompleteSearch", searchText, status, result);
                      this.setState({
                        addressAutoCompleteDataSource: status == "complete" ? result.tips.map(t => <Option
                          key={`${t.name}${t.adcode}${t.id}`} {...t}>{t.district ? (t.district + t.address + t.name) : t.name}</Option>) : [],
                      });
                    });
                  }
                }}
              >
                <Search
                  // onSearch={value => console.log(value)}

                  enterButton
                />
              </AutoComplete>
            </div>
            <Location
              ref={(node) => this.addressMap = node}
              addressChange={this.state.inputValue}
              styleName='map-out'
              position={this.addressPoint}
              location={this.locationValue}
              onChange={this.locationChane}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
