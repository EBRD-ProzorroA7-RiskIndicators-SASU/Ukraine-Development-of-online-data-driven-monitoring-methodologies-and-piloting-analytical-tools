import React, { Component } from 'react'
import { Form, Input, Modal, Spin, Alert } from 'antd'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'

class EditAuditorPasswordForm extends Component {
  constructor() {
    super()
    this.state = {
      confirmDirty: false,
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Два пароля, которые вы ввели, несовместимы!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  handleCreate = () => {
    this.props.onCreate(this.props.form)
  }

  render() {
    const { translate, isVisible, onCancel, messageOptions } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title={translate('edit_user_account_modal_title')}
        okText={translate('save_button')}
        cancelText={translate('cancel_button')}
        visible={isVisible}
        onOk={this.handleCreate}
        onCancel={onCancel}
        keyboard={false}
        maskClosable={false}
        width={620}
        confirmLoading={this.props.isSpin}
      >
        <Spin spinning={this.props.isSpin}>
          <Form
            layout="vertical"
            prefixCls="reset_user_password_"
          >
            <Form.Item label="Пароль">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Пароль не може бути порожнім', },
                  { validator: this.validateToNextPassword, },
                ],
              })(
                <Input type="password" autoComplete="off" />,
              )}
            </Form.Item>
            <Form.Item label="Підтвердження пароля">
              {getFieldDecorator('confirm', {
                rules: [
                  { required: true, message: 'Підтвердження пароля не може бути порожнім' },
                  { validator: this.compareToFirstPassword, },
                ],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} autoComplete="off" />,
              )}
            </Form.Item>
          </Form>
          {this.props.messageOptionsIsVisible && <Alert
            message={messageOptions.message}
            description={messageOptions.description}
            type={messageOptions.type}
            closable
          />}
        </Spin>
      </Modal>
    )
  }
}

EditAuditorPasswordForm.propTypes = {
  isVisible: PropTypes.bool,
  isSpin: PropTypes.bool,
  messageOptionsIsVisible: PropTypes.bool,
  messageOptions: PropTypes.object,
  onSave: PropTypes.func,
}

export default Form.create({ name: 'EditAuditorPasswordForm' })(withTranslate(EditAuditorPasswordForm))
