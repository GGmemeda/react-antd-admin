import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Spin,
  Icon
} from 'antd';

import Form from './form';
import './index.less'

export default class FormModal extends React.Component {

  render() {
    const {
      modalKey,
      visible,
      title,
      fields,
      onCancel,
      onOk,
      okText,
      modalData = '',
      className = '',
      loading,
      selectChange,
      styleName,
      col,
      formItemLayout
    } = this.props;
    return (
      <Modal
        wrapClassName="form-modal"
        key={modalKey}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        closable={false}
        className={`${styleName} ${className}`}
      >
        <div className='modal-title clearfix'>
          <span className='inner-title'>
            {modalKey === 'look' ? <i className='rvicon rvicon-chuli mr-s active-text'/> :
              <i className=' rvicon rvicon-bianji active-text mr-s' />}{title}</span>
          <span onClick={onCancel} className='right-close'>
            <Icon className='close-icon' type="close-circle-o"/></span>
        </div>
        <div className='modal-content'>
          <Spin spinning={loading} tip="Loading...">
            {visible ? <Form
              formData={visible ? modalData : ''}
              selectChange={selectChange}
              formKey={modalKey}
              modalVisible={visible}
              fields={fields}
              col={col || null}
              onOk={onOk}
              formItemLayout={formItemLayout || null}
              onCancel={onCancel}
              showCancel
              showRefresh
              okText={okText}
            /> : ''}
          </Spin>
        </div>
      </Modal>
    );
  }
}

FormModal.propTypes = {
  modalKey: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(Object).isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
};
