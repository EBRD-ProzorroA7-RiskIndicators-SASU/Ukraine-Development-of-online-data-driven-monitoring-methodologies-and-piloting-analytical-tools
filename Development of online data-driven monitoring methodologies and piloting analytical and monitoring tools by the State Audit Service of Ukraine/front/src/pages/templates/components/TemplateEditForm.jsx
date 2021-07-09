import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { Form, Input, Button, Radio } from 'antd'
import { EDIT_CATEGORY_FORM_NAME } from '../TemplatesConstants'

class TemplateEditForm extends Component {
  componentDidMount() {
    this.setInitialValues()
  }

  setInitialValues = () => {
    const { form, defaultTemplateValues } = this.props
    form.setFieldsValue({
      name: defaultTemplateValues.name,
      typeId: defaultTemplateValues.type.id,
    })
  }

  handleSaveNewCategoryName = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSave(values)
      }
    })
  }

  renderTemplateTypesRadioButtons = (getFieldDecorator) => {
    const { templatesTypes, translate, templateTypesKey } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Form.Item label={translate('template_type')} className="collection-create-form_last-form-item">
        {getFieldDecorator('typeId')(
          <Radio.Group>
            {templatesTypes.map((option, index) => (
              <Radio style={radioStyle} value={option.id} key={index}>{option[templateTypesKey]}</Radio>))}
          </Radio.Group>,
        )}
      </Form.Item>
    )
  }

  render() {
    const { form: { getFieldDecorator }, translate } = this.props

    return (
      <div>
        <Form layout="vertical" onSubmit={this.handleSaveNewCategoryName}>
          <Form.Item
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: translate('not_empty_field') }],
            })(
              <Input.TextArea id="name" autosize={{ minRows: 2, maxRows: 6 }} />,
            )}
          </Form.Item>
          {this.renderTemplateTypesRadioButtons(getFieldDecorator)}
          <Form.Item
          >
            <Button type="primary" htmlType="submit">{translate('save_button')}</Button>
            <Button type="default" htmlType="button"
                    onClick={(event) => this.props.onCancel(event)}>{translate('cancel_button')}</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

TemplateEditForm.propTypes = {
  defaultTemplateValues: PropTypes.object.isRequired,
  templateTypesKey: PropTypes.string,
  templatesTypes: PropTypes.array,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
}

export default Form.create({ name: EDIT_CATEGORY_FORM_NAME })(withTranslate(TemplateEditForm))