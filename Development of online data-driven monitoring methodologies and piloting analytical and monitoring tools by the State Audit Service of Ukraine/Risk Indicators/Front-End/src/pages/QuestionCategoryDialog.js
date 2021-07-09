import React, { Component } from 'react'
import { Input, Modal, Form, Row, Col } from 'antd'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'

class QuestionCategoryDialog extends Component {
  constructor() {
    super()

    this.state = {
      name: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.saveErrorStatus, prevProps.saveErrorStatus) && this.props.saveErrorStatus) {
      this.setCategoryNumberError()
    }
  }

  handleSave = (e) => {

    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // values.number = parseFloat(values.number).toFixed(values.number.split('.')[1].length)
        // this.props.onSave(values)
        this.props.handleSave(values)
      }
    })
  }

  setCategoryNumberError = () => {
    const categoryNumber = this.props.form.getFieldValue('number')
    const { translate } = this.props
    this.props.form.setFields({
      number: {
        value: categoryNumber,
        errors: [new Error(translate('add_new_category_number_error_name'))],
      },
    })
  }


  validateQuestionNumber = (rule, value, callback) => {
    (!value.match(/^[0-9]+(\.[1-9]{1,2})?$/)) ? callback(true) : callback()
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  render() {
    const { form: { getFieldDecorator }, translate } = this.props

    return (
      <Modal
        title={translate('add_new_category_title')}
        visible={this.props.visible}
        onOk={this.handleSave}
        onCancel={this.props.onClose}
        destroyOnClose={true}
        okText={translate('save_button')}
        cancelText={translate('cancel_button')}
        // okButtonProps={{ disabled: !this.state.name }}
        maskClosable={false}
      >
        <Form layout="horizontal" onSubmit={this.handleSaveNewCategoryName}>
          <Row>
            <Col span={24} style={{ marginBottom: 5 }}>
              <Form.Item label={translate('add_new_category_number_name')}>
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
                    step={0.1}
                    pattern="/^[0-1]+(\.[0-9]{1})?$/"
                    style={{ width: '40%' }}
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
        </Form>
        {/*<Input placeholder={translate('add_new_category_name')} onChange={this.onNameChange} />*/}
      </Modal>
    )
  }
}

export default Form.create({ name: 'QuestionCategoryDialogForm' })(withTranslate(QuestionCategoryDialog))