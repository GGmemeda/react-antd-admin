import React from 'react';
import {Icon, message, Modal, Progress, Upload} from 'antd';
import config from 'utils/apiconfig';
import {findFile} from "api/basic";
import {getExtension, isImgFile, sha1File} from "utils/sha1file";
import styled from 'styled-components';
import {getToken} from "../../utils/auth";
import uploadFileImg from 'images/upload_file_img.png';

const _Upload = styled(Upload)`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    display: block;
   
    .ant-upload.ant-upload-select{
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        background-color: #fbfbfb;
        transition: border-color 0.3s ease;
        cursor: pointer;
        height: 100%;
        width: 100%;
        position: relative;
        display: block;
        padding:8px;
        &:hover{
             border-color: #108ee9;
             .rv-upload-mask{
                display: block;
             }
             .rv-upload-tools{
                display: flex;
             }
        }
        
    }
    .ant-progress{
        position: absolute;
        line-height: 10px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 3px 8px;
    }
     .rv-upload-mask{
        display: none;
        position:absolute;;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
        background-color: rgba(55, 55, 55, .6);
        cursor: auto;
    }
    .rv-upload-tools{
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      transition: all .3s;
      cursor: auto;
      i{
        color: hsla(0,0%,100%,.91);
        font-size: 16px;
        margin: 0 5px;
        cursor: pointer;
      }
    }
   
`;

const _RVUploadImg = styled.img`
   
`;

const _UploadTrigger = styled.div`
    font-size: ${props => props.triggerFontSize}px;
    color: #999;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    >div{
      text-align: center;
      padding-top:  ${props => props.triggerFontSize}px;
    }
 
`;

const _UploadToolsWrap = styled.div`
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
`;


class RvUpload extends React.Component {
  state = {
    loading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      percent: 0,
      uploadFileUrl: this.props.value,
    };
    this.imgStatus = this.props.value&&isImgFile(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imgValue) {
      this.setState({
        uploadFileUrl: nextProps.value || nextProps.imgValue,
      });
    }
  }

  reset=()=>{
    this.setState({
      uploadFileUrl:'',
    });
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };


  percentChange = (percent) => {
    this.setState({
      percent: percent
    });
  };

  uploadFileUrlChange = (fileUrlObj) => {
    const _fileUrlObj = Object.assign({thumbUrl: null, url: null, name: this.currentFileName}, fileUrlObj);
    this.setState({
      uploadFileUrl: _fileUrlObj.thumbUrl || _fileUrlObj.url,
      percent: 0,
    });
    this.props.onChange(_fileUrlObj);
    this.props.onUploadFinish(_fileUrlObj);
  };
  clearFile = () => {
    const _fileUrlObj = Object.assign({thumbUrl: null, url: null});
    this.setState({
      uploadFileUrl: _fileUrlObj.thumbUrl || _fileUrlObj.url,
      percent: 0
    });

    if ('clear' in this.props) {
      this.props.clear();
    }
  };


  onChange = (action) => {
    console.log(action);
    if (action.file && action.file.status) {
      if (action.file.status == "uploading") {
        this.setState({loading: true});
        console.log("action.file.percent", action.file.percent);
        this.percentChange(action.file.percent);
        this.props.onUploading(action.file.percent);
      } else if (action.file.status == "done") {
        this.setState({loading: false});
        if (action.file.response.code === 500) {
          message.error(action.file.response.msg);
        }
        if (isImgFile(action.file.name)) {
          this.getBase64(action.file.originFileObj, thumbUrl => {
            const fileUrlObj = {
              url: action.file.response.data,
              thumbUrl: thumbUrl
            };
            this.uploadFileUrlChange(fileUrlObj);


          });
        } else {
          const fileUrlObj = {
            url: action.file.response.data
          };
          this.uploadFileUrlChange(fileUrlObj);
        }
      } else if (action.file.status == "error") {
        this.props.onUploadError(action);
        this.percentChange(0);
      }
    }

  };


  beforUpload = (file, fileList) => {
    const that = this;
    this.imgStatus = isImgFile(file.name);
    this.currentFileName = file.name;
    this.uploadFileUrlChange();
    return new Promise(function (resolve, reject) {
      sha1File(file, (fileSha1) => {
        const fileExtension = getExtension(file.name);
        const uploadFilename = fileExtension ? `${fileSha1}.${fileExtension}` : fileSha1;
        findFile(uploadFilename).then(res => {
          if (res.code == 200 && res.data) {
            that.onChange({
              file: {
                originFileObj: file,
                name: file.name,
                status: "done",
                response: {
                  data: res.data
                }
              }
            });
          } else {
            resolve();
          }
        }).catch(err => {
          err._statusCode == 600 ? message.warn("上传异常,网络似乎不正常!") : message.warn("上传异常");

        });
      });
    });
  };


  render() {

    return (
      <div className={this.props.wrapClassName}>
        <_Upload
          headers={{
            'Authorization': `Bearer ${getToken()}`,
          }}
          name="uploadfile"
          width={this.props.width}
          height={this.props.height}
          triggerText={this.props.triggerText}
          triggerFontSize={this.props.triggerFontSize}
          accept={this.props.accept}
          multiple={false}
          showUploadList={false}
          withCredentials={false}
          action={this.props.action}
          onChange={this.onChange}
          beforeUpload={this.props.action == config.api.uploadFile ? this.beforUpload : null}

          className={this.props.className}>


          {
            this.state.uploadFileUrl ?
              (this.imgStatus ?
                <img height='100%' width='100%' src={this.state.uploadFileUrl} alt=""/> :
                <img width='50' src={uploadFileImg} alt=""/>)
              :
              <_UploadTrigger>
                <div>
                  <div>{this.props.icon}</div>
                  <div>{this.props.triggerText}</div>
                </div>
              </_UploadTrigger>
          }
          {
            this.state.percent > 0 ?
              <Progress
                percent={this.state.percent}
                showInfo={false}/>
              :
              null
          }


          {
            this.state.uploadFileUrl ?
              <_UploadToolsWrap>
                <div className="rv-upload-mask"></div>
                < div className="rv-upload-tools" onClick={(e) => {
                  e.stopPropagation();
                }}>
                  {this.imgStatus&&!this.props.hideLook ?
                    <Icon type="eye-o" onClick={(e) => {
                    e.stopPropagation();
                    this.setState({
                      previewVisible: true,
                    });
                  }}/> : ''}
                  <Icon type="delete" onClick={(e) => {
                    e.stopPropagation();
                    this.clearFile();
                  }}/>
                </div>
              </_UploadToolsWrap>
              : null
          }
        </_Upload>
        <Modal
          width="70%"
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              previewVisible: false,
            });
          }}
        >
          <img alt="example" style={{width: '100%'}} src={this.state.uploadFileUrl}/>
        </Modal>
      </div>


    );
  }
}

RvUpload.contextTypes = {};

RvUpload.defaultProps = {
  width: 100,
  height: 100,
  triggerFontSize: 14,
  triggerText: "上传",
  className: "",
  hideLook:false,
  action: config.api.uploadFile,
  icon: <Icon type='upload'/>,
  accept: "image/jpeg,image/png,image/jpg,image/gif",
  onUploadFinish: (fileUrlObj) => null,
  onUploading: (percent) => null,
  onUploadError: (action) => null,
  onChange: (fileUrlObj) => null,
};

RvUpload.propTypes = {};

export default RvUpload;
