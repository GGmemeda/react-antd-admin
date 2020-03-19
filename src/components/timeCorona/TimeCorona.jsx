import React from 'react';
import background from './assets/background.png'
import pointer from './assets/pointer.png'
import data from './assets/data.json'
import './TimeCorona.less';
import lottie from 'lottie-web';

const r = 131.5
const circleX = 146.5
const circleY = 146.5

class TimeCorona extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 6,
      scale: 1
    }
    this.canvas = React.createRef()
    this.isDraged = false
    this.activeIndex = 6
    this.currentPercent = 1
    this.coronaCount = 6
    this.dateStringArray = ['开工', '2019.1', '2019.2', '2019.3', '2019.4', '2019.5', '当前']
    this.percentArray = (() => {
      let percentArray = []
      let percentValue = 1 / this.coronaCount
      for (let i = 0; i < this.coronaCount; i++) {
        percentArray.push(percentValue * i)
      }
      return percentArray
    })()
    this.lottieContainer = React.createRef()
    this.timeCorona = React.createRef()
  }

  componentDidMount() {
    this.drawCorona(this.currentPercent)
    this.body = document.body
    this.body.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('resize', this._onResize)
    this._onResize()

    this.anim = lottie.loadAnimation({
      container: this.lottieContainer.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: data
    });
    lottie.setSpeed(1)
  }

  componentWillUnmount() {
    this.body && this.body.removeEventListener('mouseup', this._onMouseUp)
    window.removeEventListener('resize', this._onResize)
  }

  _onResize = () => {
    let clientWidth = document.body.clientWidth;

    const minWidth = 1280;
    const maxWidth = 2560;

    if (clientWidth < minWidth) {
      clientWidth = minWidth;
    }
    if (clientWidth > maxWidth) {
      clientWidth = maxWidth;
    }
    if (!clientWidth) return;

    const scale = clientWidth / 1920

    this.setState({scale: scale})
  }

  // MARK: - 核心图形绘制
  drawCorona = (percent = 0) => {
    this.currentPercent = percent;
    let canvas = this.canvas.current
    let cxt = canvas.getContext("2d");

    cxt.clearRect(0, 0, circleX * 2, circleY * 2);
    // 1. 画大圆
    cxt.beginPath();
    cxt.arc(circleX, circleY, r, -0.5 * Math.PI, -0.5 * Math.PI - 1.5 * percent * Math.PI, true);
    cxt.lineWidth = 3;
    cxt.strokeStyle = "#99FEFF";
    cxt.lineCap = 'round';
    cxt.shadowColor = "#02E9FF";
    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 17;
    cxt.stroke();
    cxt.closePath();

    // 2. 画刻度
    // 2.1 刻度几等分
    this.percentArray.forEach(item => {
      cxt.beginPath();
      let angle = item * 270
      let x = circleX - Math.sin(angle / 180 * Math.PI) * r
      let y = circleY - Math.sin((90 - angle) / 180 * Math.PI) * r
      cxt.moveTo(x, y);
      const x3 = circleX - ((circleX - x) * (r - 12) / r)
      const y3 = circleY - ((circleY - y) * (r - 12) / r)
      cxt.lineTo(x3, y3);
      cxt.lineWidth = 1;
      cxt.strokeStyle = "#CBCBCB";
      cxt.stroke();
      cxt.closePath()
    })

    // // 3. 小圆
    let angle = percent * 270
    let x = circleX - Math.sin(angle / 180 * Math.PI) * r
    let y = circleY - Math.sin((90 - angle) / 180 * Math.PI) * r
    // 背景
    cxt.beginPath();
    let grd1 = cxt.createRadialGradient(x, y, 0, x, y, 15);
    grd1.addColorStop(1, 'rgba(30,75,75,0.16)');
    grd1.addColorStop(0, 'rgba(180,185,185,0)');
    cxt.fillStyle = grd1;
    cxt.arc(x, y, 15, 0, 2 * Math.PI, false);
    cxt.fill()
    cxt.closePath()

    // cxt.beginPath()
    // let grd2 = cxt.createRadialGradient(x, y, 0, x, y, 23);
    // grd2.addColorStop(1, 'rgba(68,124,124,0.192)');
    // grd2.addColorStop(0, 'rgba(201,255,255,0.0576)');
    // cxt.fillStyle = grd2;
    // cxt.arc(x, y, 23, 0, 2 * Math.PI, false);
    // cxt.fill()
    // cxt.closePath()
    //
    // cxt.beginPath();
    // let grd3 = cxt.createRadialGradient(x, y, 0, x, y, 34);
    // grd3.addColorStop(1, 'rgba(153,254,255,0.02)');
    // grd3.addColorStop(0, 'rgba(201,255,255,0)');
    // cxt.fillStyle = grd3;
    // cxt.arc(x, y, 23, 0, Math.PI, false);
    // cxt.fill()
    // cxt.closePath()

    // 小圆
    cxt.beginPath();
    cxt.arc(x, y, 9, 0, 2 * Math.PI, false);
    cxt.fillStyle = "#ffffff";
    cxt.fill()
    cxt.closePath()

  }

  // MARK: - 鼠标移动
  _onMouseMove = (e) => {
    if (!this.isDraged) {
      return;
    }
    const moveX = e.nativeEvent.layerX
    const moveY = e.nativeEvent.layerY

    const rd = r - Math.sqrt(Math.pow(circleX - moveX, 2) + Math.pow(circleY - moveY, 2))
    const rdx = moveX - ((rd * circleX - r * moveX) / (rd - r))

    if (moveX < circleX && moveY < circleY) {
      let sinA = Math.asin((circleX - moveX + rdx) / r)
      let angle = sinA * 180 / Math.PI
      this.drawWithPercent(angle / 270)
    } else if (moveX < circleX && moveY > circleY) {
      const zy = (circleY * rd - moveY * r) / (rd - r)
      let sinA = Math.asin((zy - circleY) / r)
      let angle = sinA * (180 / Math.PI) + 90
      this.drawWithPercent(angle / 270)
    } else if (moveX > circleX && moveY > circleY) {
      let sinA = Math.asin((moveX - circleX - rdx) / r)
      let angle = sinA * (180 / Math.PI) + 180
      this.drawWithPercent(angle / 270)
    }
  }

  // MARK: - 鼠标按下
  _onMouseDown = () => {
    this.isDraged = true;
    this.anim.playSegments([0, 5], true)
  }

  // MARK: - 鼠标按起
  _onMouseUp = () => {
    if (this.isDraged) {
      this.anim.playSegments([5, 0], true)
    }
    this.isDraged = false;
    let activeIndex = this.calculateCurrentIndex(this.currentPercent)
    let startPercent = this.currentPercent
    let endPercent = activeIndex === this.percentArray.length ? 1 : this.percentArray[activeIndex];
    this.setState({activeIndex: activeIndex})
    let current = startPercent
    let timer = setInterval(() => {
      if (endPercent >= startPercent) {
        current = current + 0.01
        if (current <= endPercent) {
          this.drawCorona(current)
        } else {
          clearInterval(timer)
          timer = null
        }
      } else {
        current = current - 0.01
        if (current >= endPercent) {
          this.drawCorona(current)
        } else {
          clearInterval(timer)
          timer = null
        }
      }
    }, 20)
  }

  // MARK: - 根据percent计算activeIndex
  calculateCurrentIndex(percent) {
    let hasDraw = false
    let currentIndex = 0
    this.percentArray.forEach((item, index) => {
      if (index === 0 && percent < this.percentArray[index + 1]) {
        if (!hasDraw) {
          if (percent < this.percentArray[index + 1] / 2) {
            currentIndex = index
          } else {
            currentIndex = index + 1
          }
        }
        hasDraw = true
      } else if (index === this.percentArray.length - 1 && percent > item) {
        if (!hasDraw) {
          if (percent - item < (1 - item) / 2) {
            currentIndex = index
          } else {
            currentIndex = index + 1
          }

        }
        hasDraw = true
      } else if (percent < item) {
        if (!hasDraw) {
          if (percent - this.percentArray[index - 1] > (item - this.percentArray[index - 1]) / 2) {
            currentIndex = index
          } else {
            currentIndex = index - 1
          }
        }
        hasDraw = true
      }
    })
    return currentIndex
  }

  // MARK: - 根据percent绘制
  drawWithPercent(percent) {
    if (percent >= 0) {
      this.drawCorona(percent)
      this.setState({activeIndex: this.calculateCurrentIndex(this.currentPercent)})
    }
  }

  render() {
    const {activeIndex, scale} = this.state;
    let offsetX = 40 * scale - (circleX * (1 - scale));
    offsetX = offsetX >= 0 ? offsetX : 0
    let offsetY = 130 * scale - (circleY * (1 - scale));
    offsetY = offsetY >= 0 ? offsetY : 0
    return (
      <div className="time-corona"
           ref={this.timeCorona}
           onMouseDown={this._onMouseDown}
        // onMouseUp={this._onMouseUp}
           onMouseMove={this._onMouseMove}
           style={{
             right: offsetX,
             bottom: offsetY,
           }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${background})`,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}>
          <div className="lottie-container" ref={this.lottieContainer}/>
          <div className="container">
            <div className="title-container">
              {
                this.dateStringArray.map((item, index) => {
                  return (
                    <div className="title" key={index} style={{
                      marginTop: index * 30,
                      transform: `translateY(${-activeIndex * 30}px)`,
                      opacity: activeIndex === index ? 1 : 0
                    }}>{item}</div>
                  )
                })
              }
            </div>
          </div>
          <canvas className="canvas" width={293} height={293} ref={this.canvas}/>
        </div>
      </div>
    )
  }
}

export default TimeCorona
