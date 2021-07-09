import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, } from 'antd'
import { ADD_NEW_TEMPLATE_FORM_NAME } from '../TemplatesConstants'
import { withTranslate } from 'react-redux-multilingual'

class AddNewTemplateFromDefaultForm extends Component {
  handleCreate = () => {
    this.props.onCreate(this.props.form)
  }

  render() {
    const {
      isVisible, onCancel, form, translate, defaultTemplateData
    } = this.props

    const { getFieldDecorator } = form

    return (
      <div>
        <Modal
          title={translate('create_new_template_modal')}
          okText={translate('create_button')}
          cancelText={translate('cancel_button')}
          visible={isVisible}
          onOk={this.handleCreate}
          onCancel={onCancel}
          keyboard={false}
          maskClosable={false}
        >
          <Form
            layout="vertical"
            prefixCls="add_new_template_from_default"

          >
            <p>{translate('default_template_info')}</p>
            <p>{translate('template_modal_name')}: <strong>{defaultTemplateData.name}</strong></p>
            <p>{translate('template_type')}: <strong>{defaultTemplateData.type.name}</strong></p>
            <Form.Item label={translate('template_modal_name')}>
              {getFieldDecorator('name', {
                initialValue: defaultTemplateData && defaultTemplateData.name,
                rules: [{ required: true, message: translate('not_empty_field') }],
              })(
                <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

AddNewTemplateFromDefaultForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  defaultTemplateData: PropTypes.object,
}

export default Form.create({ name: ADD_NEW_TEMPLATE_FORM_NAME })(withTranslate(AddNewTemplateFromDefaultForm))
