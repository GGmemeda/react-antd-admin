import React,{  Component } from 'react'
import { shallowEqualImmutable } from 'react-immutable-render-mixin';

/**
 * 使用immutable多组件进行优化
 * 防止多次渲染
 */
export default class PuStudy extends Component {
  constructor(props) {
    super()
    this.state = {
      text: 'test test',
      todo: {
        id: 1,
        message: '学习 React'
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqualImmutable(this.props, nextProps)
      || !shallowEqualImmutable(this.state, nextState);
  }

  handleChangeText = () => {
    this.setState({
      text: 'look look'
    })
  }

  handleChangeData = () => {
    this.setState({
      id: 1,
      message: '更行一次'
    })
  }
  render() {
    console.log(' render normalComponent')
    return (
      <div className='compareComponent-page'>
        <div>
          <span>文字：{this.state.text}</span>
          <button onClick={this.handleChangeText}>更改文字</button>
        </div>
        <br/>
        <div>
          <span>数据：{this.state.todo.message}</span>
          <button onClick={this.handleChangeData}>更改数据</button>
        </div>
      </div>
    )
  }
}
