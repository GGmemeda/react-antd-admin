import React, { Component } from 'react'

function lookChange(param) {
  console.log(Reflect.ownKeys(this));
  let arr=Reflect.ownKeys(this)
  console.log(arr[param])
  return arr[param]
}

/**
 * 总结：Reflect的api类似Object用法的有：
 * getOwnPropertyDescriptor1，defineProperty，preventExtensions（阻止新增属性），isExtensible（查看对象是否可扩展）
 *setPrototypeOf:为现有对象设置原先，返回对象
 * getPrototypeOf:读取一个对象的原型
 * 其他属性有：
 *has:判断obj是否有某个属性
 * deleteProperty:删除实例对象属性，返回布尔值
 * get:获取属性值方法
 * set:设置属性值方法
 *Object.keys()返回属性key，但不包括方法属性
 *Reflect.ownKeys()返回所有属性key
 */
export default class ReflectStudy extends Component {
  constructor() {
    super()
    this.state = {
      screenNumber: 0
    }
    this.SCREEN_NUMBER = 'screenNumber'
    this.giveData = {
      aa: 11,
      bb: 12,
      cc: 13,
      get showSum() {
        return this.aa + this.bb
      },
      set changeCC(val) {
        this.cc = val
      }
    }
    this.receiveData = {
      aa: 31,
      bb: 32
    }
    this.addObj = {
      value: 0,
      get val() {
        console.log('取值', this.value)
        return this.value
      },
      set val(vals) {
        this.value = vals
        console.log('存过后的值', this.value)
      }
    }
  }

  getAttributeAA = () => {
    return Reflect.get(this.giveData, 'aa')
  }
  getAttributeShowSum = () => {
    return Reflect.get(this.giveData, 'showSum', this.receiveData)
  }
  /**
   * es6中obj支持属性名表达式
   */
  plus = () => {
    this.addObj.val = ++this.addObj.value
    this.setState({
      [this.SCREEN_NUMBER]: this.addObj.val
    })

  }
  useConstruct = (param) => {
    console.log('我是测试Reflect的construct %o', param)
    this.lookConstruct = param
  }

  render() {
    // console.log(Reflect)
    // console.log(this.giveData)
    // this.giveData.changeCC = 21312
    // console.log(`测试测试 ${this.giveData.cc}`)
    // console.log(Object.keys(this.giveData))
    // let a = Reflect.construct(lookChange, ['aa'])
    // console.log('看看结果 %o',a)
    // console.log(Reflect.getOwnPropertyDescriptor(this.giveData, 'aa'))
    // let test = {}
    // Reflect.setPrototypeOf(test, this.giveData)
    // console.log(test.aa)
    // console.log(Reflect.getPrototypeOf(this.giveData))
    // Reflect.apply(lookChange,this.giveData,[1])
    // console.log(Reflect.ownKeys(lookChange))
    // console.log(Object.keys(lookChange))
    return (<div>
      <h1>Reflect学习</h1>
      <div>Reflect-反射</div>
      <div>Reflect-giveData-aa:{this.getAttributeAA()}</div>
      <div>Reflect-receiveData-aa:{this.getAttributeShowSum()}</div>
      <div>
        <button onClick={this.plus}>+</button>
        {this.state.screenNumber}</div>
    </div>)
  }
}

