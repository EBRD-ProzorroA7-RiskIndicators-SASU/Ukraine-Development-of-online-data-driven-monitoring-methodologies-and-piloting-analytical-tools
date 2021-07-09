import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio, } from 'antd'
import { ADD_NEW_TEMPLATE_FORM_NAME } from '../TemplatesConstants'
import { withTranslate } from 'react-redux-multilingual'
import { hasPermission } from '../../../utils/Permissions'
import { PERMISSIONS } from '../../../components/secutiry/PermissionConstants'
import _ from 'lodash'

class AddNewTemplateForm extends Component {
  componentDidMount() {
    this.setInitialValues()
  }

  setInitialValues = () => {
    const { templatesTypes } = this.props
    this.props.form.setFieldsValue({
      name: '',
      typeId: !_.isEmpty(templatesTypes) ? templatesTypes[0].id : null,
    })
  }

  handleCreate = () => {
    this.props.onCreate(this.props.form)
  }

  renderRadioButtonsComponent = (getFieldDecorator) => {
    const { radioButtonsOptions, translate } = this.props

    return (
      <Form.Item label={translate('template_type')} className="collection-create-form_last-form-item">
        {getFieldDecorator('default')(
          <Radio.Group>
            {/*<Radio value={true}>Публичный</Radio>*/}
            {/*<Radio value={false}>Приватный</Radio>*/}
            {radioButtonsOptions.map((option, index) => (
              <Radio value={option.id} key={index}>{option.name}</Radio>))}
          </Radio.Group>,
        )}
      </Form.Item>
    )
  }

  renderTemplateTypesRadioButtons = (getFieldDecorator) => {
    const { templatesTypes, translate, templateTypesKey } = this.props

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }

    return (
      <Form.Item label={translate('template_type')} className="collection-create-form_last-form-item">
        {getFieldDecorator('typeId', {
          rules: [{ required: true, message: translate('not_empty_field') }],
        })(
          <Radio.Group>
            {templatesTypes.map((option) => (
              <Radio style={radioStyle} value={option.id} key={option.id}>{option[templateTypesKey]}</Radio>))}
          </Radio.Group>,
        )}
      </Form.Item>
    )
  }

  render() {
    const {
      isVisible, onCancel, form, translate,
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
            prefixCls="add_new_template_"
          >
            <Form.Item label={translate('template_modal_name')}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: translate('not_empty_field') }],
              })(
                <Input />,
              )}
            </Form.Item>
            {/*{hasPermission(PERMISSIONS.adminBase) && this.renderRadioButtonsComponent(getFieldDecorator)}*/}
            {hasPermission(PERMISSIONS.adminBase) && this.renderTemplateTypesRadioButtons(getFieldDecorator)}
          </Form>
        </Modal>
      </div>
    )
  }
}

AddNewTemplateForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  radioButtonsOptions: PropTypes.array,
  templatesTypes: PropTypes.array,
  templateTypesKey: PropTypes.string,
}

export default Form.create({ name: ADD_NEW_TEMPLATE_FORM_NAME })(withTranslate(AddNewTemplateForm))