import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

export default class TableTagNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ||props.typeList[0]&&props.typeList[0].value || ''
    };
  }

  changeList = (e) => {
    const ele = e.target || e.srcElement;
    const type = ele.getAttribute('data-type');
    if(!('value' in this.props)){
      this.setState({
        value: type
      });
    }
    if ('onChange' in this.props) {
      this.props.onChange(type, e);
    }
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      return {value: props.value || ''};
    }else{
      return {}
    }
  }

  render() {
    return (
      <div className={`clearfix ${this.props.className}`}>
        {this.props.children}
        <ul className='table-tag-operates clearfix' onClick={this.changeList}>
          {this.props.typeList.map((ele, index) => (
            <li key={index} data-type={ele.value}
                className={`${this.state.value === ele.value ? 'li-active' : ''}`}>{ele.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  static defaultProps = {
    typeList: [],
    className: '',
  };
  static propTypes = {
    typeList: PropTypes.arrayOf(Object).isRequired,
    children: PropTypes.node
  };
}

