import React from 'react';
import classnames from 'classnames';
import {omit, pick} from 'lodash';

export default class CIcon extends React.Component {
  render() {
    const propsClassName = pick(this.props, ["className"]);
    const htmlAttrs = omit(this.props, ["className"]);

    return (
      <i className={classnames('cIcon', this.props.type, propsClassName)}  {...htmlAttrs}/>
    );
  }
}
