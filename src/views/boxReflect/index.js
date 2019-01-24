import React, { PureComponent } from 'react'
import './index.less'

/**
 * 兼容性，ie,firefox不兼容
 */
export default class BoxReflect extends PureComponent {
  render() {
    return (<div className='box-reflect-page'>一个倒影哦</div>)
  }
}
