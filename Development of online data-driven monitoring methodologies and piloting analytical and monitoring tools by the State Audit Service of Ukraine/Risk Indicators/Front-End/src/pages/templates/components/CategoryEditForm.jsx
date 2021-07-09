import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { Form, Input, Button, Row, Col } from 'antd'
import { EDIT_CATEGORY_FORM_NAME } from '../TemplatesConstants'

class CategoryEditForm extends Component {
  componentDidMount() {
    this.setInitialValues()
  }

  setInitialValues = () => {
    const { form, defaultInputData } = this.props
    form.setFieldsValue({
      name: defaultInputData.name,
      number: defaultInputData.number,
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

  render() {
    const { form: { getFieldDecorator }, translate } = this.props

    return (
      <div style={{ width: '100%' }}>
        <Form layout="horizontal" onSubmit={this.handleSaveNewCategoryName}>
          <Row>
            <Col span={24} style={{marginBottom: 5}}>
              <Form.Item label={translate('add_new_category_number_name')}>
                {getFieldDecorator('number', {
                  rules: [
                    { required: true, message: translate('not_empty_field'), },
                  ],
                })(
                  <Input
                    type="number"
                    min={1}
                    step={0.1}
                    pattern="/^[0-1]+(\.[0-9]{1,2})?$/"
                    style={{ width: '10%' }}
                    placeholder={translate('add_new_category_number_name')}
                    // onKeyDown={(e) => this.handleTenderCoefficientForBuyerKeyDown(e)}
                    // onKeyUp={(e) => this.handleTenderCoefficientForBuyerKeyUp(e)}
                    // onChange={(e) => this.handleTenderCoefficientForBuyerChange(parseFloat(e.target.value))}
                  />,
                )}
              </Form.Item>

            </Col>
            <Col span={24}>
              <Form.Item label={translate('add_new_question_name')}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: translate('not_empty_field') }],
                })(
                  <Input.TextArea id="note" />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">{translate('save_button')}</Button>
                <Button type="default" htmlType="button"
                        onClick={(event) => this.props.onCancel(event)}>{translate('cancel_button')}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

CategoryEditForm.propTypes = {
  defaultInputData: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
}

export default Form.create({ name: EDIT_CATEGORY_FORM_NAME })(withTranslate(CategoryEditForm))