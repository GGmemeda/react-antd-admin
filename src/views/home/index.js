import React, { Component } from 'react';
import './index.less';

export default class App extends Component {
  render () {
    return (
      <div className="App">
        <div className="home-container">
          我是首页哦
          看看hook的表现形式
          <React.Fragment>
            <div>
              fragement测试一下
            </div>
          </React.Fragment>
        </div>
      </div>
    );
  }
}