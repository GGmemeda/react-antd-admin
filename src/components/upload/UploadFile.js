import React from 'react';
import {Icon, message, Modal, Progress, Upload} from 'antd';
import config from 'utils/apiconfig';
import {findFile} from "api/basic";
import {getExtension, isImgFile, sha1File} from "utils/sha1file";
import styled from 'styled-components';
import {getToken} from "../../utils/auth";


const _Upload = styled(Upload)`

`;


class UploadFile extends React.Component {

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      previewVisible: false,
      percent: 0,
      uploadFileUrl: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      uploadFileUrl: nextProps.value,
    });

  }


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
    const _fileUrlObj = Object.assign({thumbUrl: null, url: null}, fileUrlObj);
    this.setState({
      uploadFileUrl: _fileUrlObj.thumbUrl || _fileUrlObj.url,
      percent: 0
    });
    this.props.onChange(_fileUrlObj);
    this.props.onUploadFinish(_fileUrlObj);
  };


  onChange = (action) => {
    if (action.file && action.file.status) {
      if (action.file.status == "uploading") {
        console.log("action.file.percent", action.file.percent);
        this.percentChange(action.file.percent);
        this.props.onUploading(action.file.percent);
      } else if (action.file.status == "done") {
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
    var that = this;
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
      <div>
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
          action={config.api.uploadFile}
          onChange={this.onChange}
          beforeUpload={this.beforUpload}
          className={this.props.className}>

          {this.props.customIcon}
          {
            this.state.percent > 0 ?
              <Progress
                percent={this.state.percent}
                showInfo={false}/>
              :
              null
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

UploadFile.contextTypes = {};

UploadFile.defaultProps = {
  width: 100,
  height: 100,
  triggerFontSize: 14,
  triggerText: "上传",
  className: "",
  icon: <Icon type='upload'/>,
  accept: "",
  customIcon: <div></div>,
  onUploadFinish: (fileUrlObj) => null,
  onUploading: (percent) => null,
  onUploadError: (action) => null,
  onChange: (fileUrlObj) => null,
};

UploadFile.propTypes = {};

export default UploadFile;
