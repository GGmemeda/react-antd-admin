import React from 'react';
import './index.less';

import {Icon, message, Modal, Upload} from 'antd';
import config from 'utils/apiconfig';
import {findFile} from "api/basic";
import {getExtension, isImgFile, sha1File} from "utils/sha1file";
import {getToken} from "../../utils/auth";
import playDefault from 'images/play_img.png';
import uploadFileImg from 'images/upload_file_img.png';
import UiModal from '../modalForm/UiModal';

class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: null,
      previewVisible: false,
      fileList: this.props.value || [],
    };
  }

  componentWillMount() {
    if (this.props.imageValues) {
      this.props.imageValues.map(ele => {
        if (this.isVideo(ele.name)) {
          ele.thumbUrl = playDefault;
        }
      });
      this.setState({
        fileList: this.props.imageValues
      });

    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imageValues) {
      nextProps.imageValues.map(ele => {
        if (this.isVideo(ele.name)) {
          ele.thumbUrl = playDefault;
        }
      });
      this.setState({
        fileList: nextProps.imageValues
      });
    }
  }

  reset = () => {
    this.setState({
      fileList: []
    });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  onChange = (action) => {
    if (action.file.status === "done" && action.file.response.code === 500) {
      message.error(action.file.response.msg);
      action.fileList.pop();
    }
    action.fileList.map(ele => {
      if (this.isVideo(ele.name)) {
        ele.thumbUrl = playDefault;
        ele.otherType = 'video';
      }
      if (isImgFile(ele.name)) {
        ele.otherType = 'img';
      } else {
        ele.otherType = 'file';
      }
    });
    if (!this.props.imageValues) {
      this.setState({
        fileList: action.fileList.slice(-9)
      });
    }
    const cval = action.fileList.map((f, index) => {
      return {
        url: f.url || (f.response && f.response.data),
        raw: f,
        uid: index
      };
    });

    this.props.onChange(cval);
  };
  isVideo = (url) => {
    const reg = /\.(avi|3gp|flv|mp4|ogg)$/;
    return reg.test(url);
  };

  handlePreview = (file) => {
    if (this.isVideo(file.url || file.thumbUrl)) {
      this.setState({
        previewUrl: file.url || file.thumbUrl,
        previewVisible: true,
        previewType: 'video'
      });
    } else if (isImgFile(file.url || file.thumbUrl)) {
      this.setState({
        previewUrl: file.url || file.thumbUrl,
        previewVisible: true,
        previewType: 'image'
      });
    } else {
      const elink = document.createElement('a');
      elink.style.display = 'none';
      elink.download = file.url;
      elink.href = file.url;
      elink.target = '_blank';
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
    }

  };

  beforUpload = (file, fileList) => {
    var that = this;
    return new Promise(function (resolve, reject) {
      sha1File(file, (fileSha1) => {
        const fileExtension = getExtension(file.name);
        const uploadFilename = fileExtension ? `${fileSha1}.${fileExtension}` : fileSha1;
        findFile(uploadFilename).then(res => {
          if (res.code == 200 && res.data) {
            if (isImgFile(res.data)) {
              that.getBase64(file, thumbUrl => {
                Object.assign(file, {
                  status: "done",
                  response: {
                    data: res.data
                  },
                  thumbUrl: thumbUrl,
                  url: res.data
                });
                that.onChange({
                  file,
                  fileList: [...that.state.fileList, file]
                });
              });
            } else {
              Object.assign(file, {
                status: "done",
                response: {
                  data: res.data
                },
                url: res.data
              });
              that.onChange({
                file,
                fileList: [...that.state.fileList, file]
              });
            }
          } else {
            resolve();
          }
        }).catch(err => {
          console.log(err);
          err._statusCode == 600 ? message.warn("上传异常,网络似乎不正常!") : message.warn("上传异常");

        });
      });
    });
  };
  _handleContextMenu = (e) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    return false;
  };
  previewShow = (type) => {
    switch (type) {
      case 'video':
        return (<video onContextMenu={(e) => this._handleContextMenu(e)}
                       controlsList="nodownload" autoPlay controls="controls" width='800' className='preview-video '>
            <source src={this.state.previewUrl} type="video/mp4"/>
            您的浏览器不支持!</video>
        );
      default :
        return (<img alt="智慧河长" src={this.state.previewUrl}/>);
    }
  };

  render() {
    return (
      <div className="clearfix">
        <Upload
          headers={{Authorization: `Bearer ${getToken()}`}}
          action={config.api.uploadFile}
          listType={this.props.listType || "picture-card"}
          name="uploadfile"
          accept={this.props.accept}
          multiple={true}
          disabled={this.props.disabled}
          className={this.props.className || ''}
          fileList={this.state.fileList}
          withCredentials={false}
          beforeUpload={this.beforUpload}
          onPreview={this.handlePreview}
          onChange={this.onChange}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: !this.props.lookKey
          }}
        >
          {
            this.state.fileList.length >= 9 || this.props.lookKey ? null :
              <div className='dlEkAm'>
                {this.props.icon ? this.props.icon : <Icon type="upload"/>}
                <div className="ant-upload-text">上传</div>
              </div>
          }
        </Upload>
        <UiModal
          visible={this.state.previewVisible}
          footer={null}
          modalKey={'look'}
          title={'图片'}
          className='text-center preview-modal'
          onCancel={() => {
            this.setState({
              previewVisible: false,
            });
          }}
        >
          {this.previewShow(this.state.previewType)}
        </UiModal>

      </div>
    );
  }
}

Uploads.contextTypes = {};

Uploads.defaultProps = {
  accept: "image/jpeg,image/png,image/jpg,image/gif",
  onChange: (fileUrls) => null,
  lookKey: false,
  disabled: false
};

Uploads.propTypes = {};

export default Uploads;
