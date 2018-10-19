import React from 'react';
import PropTypes from 'prop-types';
import './index.less';
import {
  Modal,
  Spin,
  Icon
} from 'antd';

export default class UiModal extends React.Component {

  render() {
    const {
      modalKey,
      visible,
      title,
      onCancel,
      className = '',
      loading,
      styleName,
    } = this.props;
    return (
      <Modal
        wrapClassName="form-modal"
        key={modalKey}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        closable={false}
        width={this.props.width}
        className={`${styleName} ${className}`}
        {...this.props.attr || {}}
      >
        <div className='modal-title clearfix'>
          <span className='inner-title'>
            {modalKey === 'look' ? <i className='rvicon rvicon-chuli mr-s active-text'/> :
              <i className=' rvicon rvicon-bianji active-text mr-s'/>}{title}</span>
          <span onClick={onCancel} className='right-close'>
            <Icon className='close-icon' type="close-circle-o"/></span>
        </div>
        <Spin spinning={loading} tip="Loading...">
          <div className='modal-content'>
            {this.props.children}
          </div>
        </Spin>
      </Modal>
    );
  }
}

UiModal.defaultProps = {
  loading: false,
  modalKey:'add'
};
UiModal.propTypes = {
  modalKey: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  children: PropTypes.node
};
