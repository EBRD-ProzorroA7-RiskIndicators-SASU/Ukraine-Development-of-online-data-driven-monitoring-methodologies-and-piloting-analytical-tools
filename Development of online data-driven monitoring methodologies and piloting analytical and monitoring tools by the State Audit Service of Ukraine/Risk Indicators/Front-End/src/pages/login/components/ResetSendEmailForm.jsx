import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'
import PropTypes from 'prop-types'

class ResetSendEmailForm extends Component {
  constructor() {
    super()
    this.state = {
      confirmDirty: false,
    }
  }

  handleRegister = (event) => {
    event.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.form.resetFields()
        this.props.onCreate(values)
      }
    })
  }

  onCancel = () => {
    const form = this.props.form
    form.resetFields()
    this.props.onCancel()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title="Відновлення паролю"
        okText="Відправити лист"
        cancelText="Вiдмiнити"
        visible={this.props.isVisible}
        onOk={this.handleRegister}
        onCancel={this.onCancel}
        keyboard={false}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          prefixCls="add_new_user_"
        >
          <Form.Item label="Введіть адресу електронної пошти">
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Электронный адрес не може бути пустим' },
                { type: 'email', message: 'Введено неправильну адресу електронної пошти', },
              ],
            })(
              <Input autoComplete="off"/>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

ResetSendEmailForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
}

export default Form.create({ name: 'ResetSendEmailForm' })(ResetSendEmailForm)
