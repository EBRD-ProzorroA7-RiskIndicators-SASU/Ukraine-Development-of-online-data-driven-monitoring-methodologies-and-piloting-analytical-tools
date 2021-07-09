import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { Modal, Input, Select, Row, Col, Form } from 'antd'
import _ from 'lodash'

class QuestionDialog extends Component {
  constructor(props) {
    super(props)

    let preparedCategories = this.prepareCategories()

    this.state = {
      categoryId: !_.isEmpty(preparedCategories) ? preparedCategories[0].id : null,
      preparedCategories: preparedCategories,
    }

  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.categoriesByTemplateId, this.props.categoriesByTemplateId)
      || !_.isEqual(prevProps.usedDefaultCategories, this.props.usedDefaultCategories)
    ) {
      let preparedCategories = this.prepareCategories()
      this.setState({
        preparedCategories: preparedCategories,
        categoryId: !_.isEmpty(preparedCategories) ? preparedCategories[0].id : null,
      })
    }

    if (!_.isEqual(this.props.saveErrorStatus, prevProps.saveErrorStatus) && this.props.saveErrorStatus) {
      this.setQuestionNumberError()
    }
  }

  onDescriptionChange = (event) => {
    this.setState({ description: event.target.value })
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

  handleSave = (event) => {
    event.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.form.resetFields()
        // values.number = parseFloat(values.number)
        this.props.handleSave(values)
      }
    })
    // const { questionBaseStatus } = this.props
    // let questionData = {
    //   description: this.state.description,
    //   categoryId: this.state.categoryId,
    // }
    //
    // if (questionBaseStatus !== 'undefined') {
    //   questionData = _.merge({}, questionData, {
    //     base: questionBaseStatus,
    //   })
    // }
    //
    // this.setState({
    //   description: null,
    // }, () => {
    //   this.props.handleSave(questionData)
    // })
  }

  onClose = () => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  onChangeCategory = (categoryId) => {
    this.setState({ categoryId })
  }

  prepareCategories = () => {
    const { categoriesByTemplateId, usedDefaultCategories } = this.props
    let newCategoryList = []

    if (usedDefaultCategories) {
      _.forEach(usedDefaultCategories, (categoryData) => {
        newCategoryList.push({
          id: categoryData.id,
          name: categoryData.name,
        })
      })
    } else {
      newCategoryList = _.cloneDeep(categoriesByTemplateId)
    }

    return newCategoryList
  }

  validateQuestionNumber = (rule, value, callback) => {
    (!value.match(/^[0-9]+(\.[1-9]{1,2})?$/)) ? callback(true) : callback()
  }

  render() {
    const { translate } = this.props
    const { preparedCategories } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title={translate('add_new_question_title')}
        visible={this.props.visible}
        onOk={this.handleSave}
        onCancel={this.onClose}
        destroyOnClose={true}
        okText={translate('save_button')}
        cancelText={translate('cancel_button')}
        // okButtonProps={{ disabled: (!this.props.form.getFieldValue('description') }}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          prefixCls="add_new_user_"
        >
          <Row>
            <Col span={24} style={{ marginBottom: 5 }}>
              <Form.Item label={translate('category_title_name')}>
                {getFieldDecorator('categoryId', {
                  initialValue: this.state.categoryId,
                  rules: [
                    { required: true, message: 'Поштова адреса не може бути порожньою' },
                  ],
                })(
                  <Select
                    // value={categoryId ? categoryId : (!_.isEmpty(preparedCategories) ? preparedCategories[0].id : '')}
                    style={{ width: '100%' }}
                    onChange={this.onChangeCategory}
                  >
                    {
                      preparedCategories && preparedCategories.map(category => {
                        return <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                      })
                    }
                  </Select>,
                )}
              </Form.Item>

            </Col>
            {/*<InputNumber*/}
            {/*style={{ width: '100%' }}*/}
            {/*placeholder="#"*/}
            {/*formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
            {/*parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
            {/*// type="number"*/}
            {/*// onChange={(e) => this.props.handleChangeSumTo(e.target.value)}*/}
            {/*// onChange={this.props.handleChangeSumTo}*/}
            {/*/>,*/}
            <Col span={24} style={{ marginBottom: 5 }}>
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
                    pattern="/^[0-9]+(\.[1-9]{1,2})?$/"
                    style={{ width: '40%' }}
                    placeholder={translate('add_new_question_number_name')}
                    // onKeyDown={(e) => this.handleTenderCoefficientForBuyerKeyDown(e)}
                    // onKeyUp={(e) => this.handleTenderCoefficientForBuyerKeyUp(e)}
                    // onChange={(e) => this.handleTenderCoefficientForBuyerChange(parseFloat(e.target.value))}
                  />,
                )}
              </Form.Item>

            </Col>
            <Col span={24} style={{ marginBottom: 5 }}>
              <Form.Item label={translate('add_new_question_name')}>
                {getFieldDecorator('description', {
                  rules: [
                    { required: true, message: translate('not_empty_field'), },
                  ],
                })(
                  <Input.TextArea placeholder={translate('add_new_question_name')}
                                  onChange={this.onDescriptionChange} />,
                )}
              </Form.Item>

            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }

}

QuestionDialog.propTypes = {
  useBaseTemplateData: PropTypes.bool,
  saveErrorStatus: PropTypes.bool,
}

QuestionDialog.defaultProps = {
  useBaseTemplateData: false,
  saveErrorStatus: false,
}

function mapStateToProps({
                           templatesStore,
                           categoriesStore,
                         }) {
  return {
    templateByIdData: templatesStore.templateByIdData,
    templateByIdIsFetching: templatesStore.templateByIdIsFetching,
    categoriesByTemplateId: categoriesStore.categoriesByTemplateId,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(Form.create({ name: 'QuestionDialog' })(QuestionDialog)))
