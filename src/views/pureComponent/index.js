import React,{ PureComponent} from 'react'

/**
 * PureComponent
 * 没有shouldComponentUpdate()
 * 自生会做state和props的浅比较
 * 数据未发生改变不会更新组件
 * -------shouldComponent是优化性能的最好手段-------
 */
export default class PuStudy extends PureComponent {
  constructor() {
    super()
    this.state = {
      text: 'test test',
      todo: {
        id: 1,
        message: '学习 React'
      }
    }
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
    console.log('render pureComponent')
    return (
      <div className='pureComponent-page'>
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

