import React, { Component } from 'react'

export default class ReflectStudy extends Component {
  constructor() {
    super()
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
    this.addObj={
      value: 0,
      get val() {
        console.log('取值', this.value);
        return this.value;
      },
      set val(vals) {
        this.value = vals;
        console.log('存过后的值', this.value);
      }
    }
  }

  getAttributeAA = () => {
    return Reflect.get(this.giveData, 'aa')
  }
  getAttributeShowSum = () => {
    return Reflect.get(this.giveData, 'showSum', this.receiveData)
  }
  plus(){
    this.addObj.val = ++this.addObj.value;
    this.setState({})

  }
  render() {
    console.log(Reflect)
    console.log(this.giveData)
    this.giveData.changeCC = 21312
    console.log(`测试测试 ${this.giveData.cc}`)
    console.log(Object.keys(this.giveData))
    return (<div>
      <h1>Reflect学习</h1>
      <div>Reflect-反射</div>
      <div>Reflect-giveData-aa:{this.getAttributeAA()}</div>
      <div>Reflect-receiveData-aa:{this.getAttributeShowSum()}</div>
      <div><button onClick={this.plus()}>+</button></div>
    </div>)
  }
}
