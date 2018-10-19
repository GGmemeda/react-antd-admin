import React from 'react';
import {Layout} from 'antd';
import './index.less';

const {Footer} = Layout;

export default class Bottom extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Footer className="bottom">
        <div className="text">
          <div>
          </div>
        </div>
      </Footer>
    );
  }
};
