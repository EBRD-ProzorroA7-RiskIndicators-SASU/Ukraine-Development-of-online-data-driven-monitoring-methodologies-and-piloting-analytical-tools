import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withTranslate } from 'react-redux-multilingual'
import { Form, Input, Button, Row, Col } from 'antd'
import { EDIT_CATEGORY_FORM_NAME } from '../TemplatesConstants'

class QuestionEditForm extends Component {
  componentDidMount() {
    this.setInitialValues()
  }

  componentDidUpdate(prevProps){
    if (!_.isEqual(this.props.saveErrorStatus, prevProps.saveErrorStatus) && this.props.saveErrorStatus) {
      this.setQuestionNumberError()
    }
  }

  setQuestionNumberError = () => {
    let questionNumber = this.props.form.getFieldValue('number')
    const { translate } = this.props
    this.props.form.setFields({
      number: {
        value: questionNumber,
        errors: [new Error(translate('add_new_question_number_error_name'))],
      },
    })
  }

  setInitialValues = () => {
    const { form, defaultInputValues } = this.props
    form.setFieldsValue({
      description: defaultInputValues.description,
      number: defaultInputValues.number,
    })
  }

  handleSaveNewCategoryName = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // values.number = parseFloat(values.number)
        this.props.onSave(values)
      }
    })
  }

  validateQuestionNumber = (rule, value, callback) => {
    (!value.match(/^[0-9]+(\.[1-9]{1,2})?$/)) ? callback(true) : callback()
  }

  render() {
    const { form: { getFieldDecorator }, translate } = this.props

    return (
      <div style={{ width: '100%' }}>
        <Form layout="vertical" onSubmit={this.handleSaveNewCategoryName} style={{ paddingLeft: 24 }}>
          <Row>
            <Col span={24} style={{marginBottom: 5}}>
              <Form.Item label={translate('add_new_question_number_name')}>
                {getFieldDecorator('number', {
                  rules: [
                    {
                      required: true,
                      message: translate('not_empty_field_or_wrong_type'),
                      validator: this.validateQuestionNumber,
                    },
                  ],
                })(
                  <Input
                    type="number"
                    min={1}
                    step={0.01}
                    pattern="/^[0-1]+(\.[0-9]{1,2})?$/"
                    style={{ width: '10%' }}
                    placeholder={translate('add_new_question_number_name')}
                    // onKeyDown={(e) => this.handleTenderCoefficientForBuyerKeyDown(e)}
                    // onKeyUp={(e) => this.handleTenderCoefficientForBuyerKeyUp(e)}
                    // onChange={(e) => this.handleTenderCoefficientForBuyerChange(parseFloat(e.target.value))}
                  />,
                )}
              </Form.Item>

            </Col>
            <Col span={24}>
              <Form.Item label={translate('add_new_question_name')}>
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: translate('not_empty_field') }],
                })(
                  <Input.TextArea id="description" style={{ width: '100%' }} />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
              >
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

QuestionEditForm.propTypes = {
  defaultInputValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  saveErrorStatus: PropTypes.bool,
}

export default Form.create({ name: EDIT_CATEGORY_FORM_NAME })(withTranslate(QuestionEditForm))