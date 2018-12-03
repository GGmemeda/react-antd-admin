import React, { Component } from 'react';
import './index.less';
import LazyLoad,{ forceCheck } from 'react-LazyLoad';

export default class App extends Component {

  componentDidMount(){
    forceCheck();
  }
  render () {
    return (
      <div className="App">
        <div className="home-container">
          我是首页哦
          <React.Fragment>
            <div>
              fragement测试一下
            </div>
          </React.Fragment>
          <div className='test-lazy-load'/>
          {/*<Operation type="image" noExtra/>*/}
          <div className="widget-list image-container">
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvyo52qj20u01hcqeq.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxvz2cj6j20u01hck1o.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvzfjv6j20u01hc496.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxw0e1mlj20u01hcgvs.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww4.sinaimg.cn/mw690/62aad664jw1f2nxw0p95dj20u01hc7d8.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxw134xqj20u01hcqjg.jpg"/>
            </LazyLoad>
            <LazyLoad throttle={200} height={300}>
              <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxw1kcykj20u01hcn9p.jpg"/>
            </LazyLoad>
          </div>

        </div>
      </div>
    );
  }
}
