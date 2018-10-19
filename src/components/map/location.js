import React from 'react';
import {Map, Marker} from "react-amap";
import Geolocation from 'react-amap-plugin-geolocation';
import {amapKey} from "../../utils/constant";


class Location extends React.Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.map = null;
    this.marker = null;
    this.geocoder = null;
    this.autocomplete = null;
    this.state = {
      mounted: false,
      isFirstGeo: true,
      position: this.props.position,
      currentLocation: this.props.location,

    };
    this.key = amapKey;
    this.mapPlugins = ['ToolBar'];
    this.markerEvents = {
      click: () => {
        // console.log('marker clicked!');

      },
      created: (ins) => {
        const p = this.props.position && this.props.position.longitude && this.props.position.latitude ? this.props.position : '';
        if (p) {
          _this.map.setCenter(new window.AMap.LngLat(p.longitude || p.lng, p.latitude || p.lat));
          this.setPosition(p);
        }

      },
    };
    this.autocompleteSearch = (location, callback) => {
      if (location) {
        _this.autocomplete.search(location, callback);
      }
    };
    this.mapEvents = {
      created: (mapInstance) => {
        _this.map = mapInstance;
        _this.map.setZoom(14);
        // console.log(mapInstance);
        window.AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder'], function () {
          _this.geocoder = new window.AMap.Geocoder({
            city: "010"//城市，默认：“全国”
          });
          _this.placeSearch = new window.AMap.PlaceSearch({
            city: "010",//城市，默认：“全国”
          });
          var autoOptions = {
            datatype: "poi"
          };
          _this.autocomplete = new window.AMap.Autocomplete(autoOptions);
          window.AMap.event.addListener(_this.autocomplete, "select", function (e) {
            mapInstance.setZoom(14);
            mapInstance.setCenter(e.poi.location);
            const location = e.poi.district ? (e.poi.district + e.poi.address + e.poi.name) : e.poi.name;
            _this.setState({
              position: e.poi.location,
              currentLocation: location,
            }, () => {
              _this.props.onChange(e.poi.location, location);
            });
            // console.log(e);
          });

        });
      },
      click: (e) => {
        if (_this.props.readOnly) return;
        const lnglat = e.lnglat;
        _this.setState({
          position: {
            longitude: lnglat.longitude || lnglat.lng,
            latitude: lnglat.latitude || lnglat.lat,
            lng: lnglat.longitude || lnglat.lng,
            lat: lnglat.latitude || lnglat.lat
          },
          currentLocation: '读取中...'
        });
        const useLngLat = [lnglat.lng, lnglat.lat];
        _this.geocoder && _this.geocoder.getAddress(useLngLat, (status, result) => {
          // console.log(result);
          // console.log(status);
          if (status === 'complete') {
            if (result.regeocode) {
              const formattedAddress = result.regeocode.formattedAddress || '未知地点';
              _this.setState({
                currentLocation: formattedAddress
              }, () => {
                _this.props.onChange(lnglat, formattedAddress);
              });
            } else {
              _this.setState({
                currentLocation: '未知地点'
              });
            }
          } else {
            _this.setState({
              currentLocation: '未知地点'
            });
          }

        });
      }
    };
    this.geolocationEvents = {
      created: (geolocation) => {
        window.AMap.event.addListener(geolocation, 'complete', (e) => {
          if (_this.state.position == null) {
            _this.setState({
              position: {
                longitude: e.position.longitude || e.position.lng,
                latitude: e.position.latitude || e.position.lat,
                lng: e.position.longitude || e.position.lng,
                lat: e.position.latitude || e.position.lat
              },
              currentLocation: e.formattedAddress
            }, () => {
              _this.map.setZoom(17);
              _this.map.setCenter(e.position);
              _this.props.onChange(e.position, e.formattedAddress);
            });
          }
          if (!_this.state.isFirstGeo) {
            _this.map.setCenter(e.position);
          }

          _this.setState({
            isFirstGeo: false
          });
        });
      }
    };

    this.geolocationPluginProps = {
      enableHighAccuracy: true,
      timeout: 10000,
      GeoLocationFirst: true,
      showButton: true,
      panToLocation: false,
    };

    this.setValue = (position, location, triggerChange = false) => {
      this.setState({
        position: position,
        currentLocation: location
      }, () => {
        if (triggerChange) {
          _this.map.setZoom(17);
          _this.map.setCenter(position);
          _this.props.onChange(position, location);
        }
      });
    };
    this.setPosition = (placePoint,location) => {
      const position = {
        longitude: placePoint.longitude,
        latitude: placePoint.latitude,
        lng: placePoint.longitude,
        lat: placePoint.latitude
      };
      this.setValue(position,location);
    };
  }


  componentDidMount() {
    // if (this.props.position.latitude && this.props.position.longitude && this.map) {
    //   this.setPosition(this.props.addressPoint);
    // }
    this.setState({
      mounted: true
    });
  }

  componentWillReceiveProps(nextProps) {
    // const position = nextProps.position || {};
    // if (this.map && position.longitude !== this.props.position.longitude && position.latitude !== this.props.position.latitude) {
    //   this.setPosition(position);
    // }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getStatus=()=>{
    return this.state.position && this.state.position.longitude && this.state.position.latitude
  };
  render() {
    // console.log("this.state.mounted: ", this.state.mounted, this.state.position, this.props);
    return this.state.mounted ?
      <Map className={`map-out ${this.props.styleName}`} amapkey={this.key} events={this.mapEvents}>
        {this.props.geolocation && <Geolocation {...this.geolocationPluginProps} events={this.geolocationEvents}/>}
        {this.getStatus()?<Marker
          events={this.markerEvents}
          position={this.getStatus() ? {
            longitude: this.state.position.longitude || this.state.position.lng,
            latitude: this.state.position.latitude || this.state.position.lat,
            lng: this.state.position.longitude || this.state.position.lng,
            lat: this.state.position.latitude || this.state.position.lat
          } : {}
          }
          visible={true}
          clickable={this.props.readOnly ? false : true}
          draggable={this.props.readOnly ? false : true}
        />:''}
      </Map> : null;


  }


}

Location.contextTypes = {};

Location.defaultProps = {
  geolocation: true,//是否开启定位
  location: "",
  position: {},
  addressChange: '',
  readOnly: false,
  styleName: '',
  onChange: (position, currentLocation) => {
    console.log(currentLocation);
  },
};

Location.propTypes = {};


export default Location;
