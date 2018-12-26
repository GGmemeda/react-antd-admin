import React, { Component } from 'react';
import LazyLoad, { forceCheck } from 'react-LazyLoad';
import './index.less';
export default class LazyLoadPage extends Component {
  constructor (){
    super();
    this.array=['http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg','http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg','http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg','http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg','http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg'];
  }

  // componentDidMount () {
  //   forceCheck();
  // }

  render () {
    return (
      <div className="widget-list image-container overflow">
        {this.array.map((item,index)=>{
       return  (
         <LazyLoad key={index} overflow throttle={100} height={200}>
            <img src={item} />
          </LazyLoad>)
        })}
    </div>);
  }
}
