import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { Collapse, Card, Row, Col, Input, Button, Tooltip, Select, InputNumber, Form, Icon } from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import RadioButton from 'antd/lib/radio/radioButton'
import QuestionEditForm from './templates/components/QuestionEditForm'
import _ from 'lodash'
import { MAX_VALUE } from './inspections/InspectionConstants'

const Panel = Collapse.Panel

class QuestionGroupsOthers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editableQuestionIndex: null,
      showEditForm: false,
      createQuestionError: false,
    }
    props.handleQuestion(props.checklist)
  }

  render() {
    const { checklist: { categories }, questionsWithIndicators } = this.props
    let openedItems = []
    for (let i = 0; i < 100; i++) {
      openedItems.push(i.toString())
    }

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
    }

    return (
      <Collapse defaultActiveKey={openedItems && openedItems} className="questions-for-checklist">
        {/*<Collapse defaultActiveKey={["2", "3"]}>*/}
        {
          categories && categories.map((category, categoryIndex) => {
              return (
                <Panel header={<div>
                  <span style={{ wordBreak: 'break-word', marginRight: 5 }}><strong>{category.number}</strong></span>
                  <span style={{ wordBreak: 'break-word' }}>{`${category.name}`}</span>
                </div>} key={category.id} style={customPanelStyle}>
                  {
                    category.questions.map((question, questionInd) => {
                      return this.createQuestion(question, _.find(questionsWithIndicators, { tempIndex: question.tempIndex }), `${categoryIndex}_${questionInd}`)
                    })
                  }
                </Panel>
              )
            },
          )
        }
      </Collapse>
    )
  }

  handleEditQuestion = (question) => {
    this.setState({
      editableQuestionIndex: question.tempIndex,
    })
  }

  handleDeleteQuestion = (question) => {
    this.props.onDeleteQuestion(question)
  }

  handleUpdateQuestion = (values) => {
    const { checklist: { categories } } = this.props
    const { editableQuestionIndex } = this.state

    this.setState({
      createQuestionError: false,
    }, () => {
      let categoryIndex = 0
      _.forEach(categories, (categoryData) => {
        let elementIndex = _.findIndex(categoryData, { tempIndex: editableQuestionIndex })
        if (elementIndex !== -1) {
          categoryIndex = elementIndex
        }
      })

      let categoryWithoutEditQuestion = _.cloneDeep(categories[categoryIndex].questions)
      let elementQuestionIndex = _.findIndex(categoryWithoutEditQuestion, { tempIndex: editableQuestionIndex })
      categoryWithoutEditQuestion.splice(elementQuestionIndex, 1)

      if (_.find(categoryWithoutEditQuestion, { number: values.number })) {
        this.setState({
          createQuestionError: true,
        })
      } else {
        let categoryInd = editableQuestionIndex.split('_')[0]
        let categoryPosition = _.findIndex(categories, { id: parseInt(categoryInd, 10) })
        let questionPosition = _.findIndex(categories[categoryPosition].questions, { tempIndex: editableQuestionIndex })
        let question = categories[categoryPosition].questions[questionPosition]
        question.description = values.description
        question.number = values.number


        this.setState({
          editableQuestionIndex: null,
        }, () => {
          this.props.handleQuestion(question)
        })
      }
    })
  }

  handleCancelQuestionEdit = () => {
    this.setState({
      editableQuestionIndex: null,
    })
  }

  renderEditableHeader = (question) => {
    const { editableQuestionIndex, createQuestionError } = this.state
    const { translate } = this.props

    if (!question.base && (editableQuestionIndex === question.tempIndex)) {
      return (
        <QuestionEditForm
          defaultInputValues={question}
          onSave={this.handleUpdateQuestion}
          onCancel={this.handleCancelQuestionEdit}
          saveErrorStatus={createQuestionError}
        />
      )
    } else if (!question.base) {
      return (
        <Col span={24}>
          <Col span={22}
            // style={{ lineHeight: '32px' }}
          >
            {/*<span style={{ wordBreak: 'break-word' }}>{question.description}</span>*/}
            <div style={{ width: '92%' }}>
              <span style={{ float: 'left', marginRight: 5 }}><strong>{question.number}</strong></span>
              <p style={{ wordBreak: 'break-word' }}>{question.description}</p>
            </div>
          </Col>
          <Col span={2}>
            <Tooltip placement="top" title={translate('delete_button')}>
              <Button style={{ float: 'right', marginLeft: 5 }} icon='delete'
                      onClick={() => this.handleDeleteQuestion(question)} />
            </Tooltip>
            <Tooltip placement="top" title={translate('edit_button_name')}>
              <Button style={{ float: 'right' }} icon='edit' onClick={() => this.handleEditQuestion(question)} />
            </Tooltip>
          </Col>
        </Col>

      )
    } else {
      // return question.description
      return (
        <div style={{ width: '92%' }}>
          <span style={{ float: 'left', marginRight: 5 }}><strong>{question.number}</strong></span>
          <p style={{ wordBreak: 'break-word' }}>{question.description}</p>
        </div>
      )
    }

  }

  onChangeIndicatorAnswer = (value, option, question) => {
    this.props.handleIndicatorAnswerForQuestion(value, question)
  }

  checkDisabled = (currentField, prevField) => {

  }

  createQuestion = (question, questionWithAnswer, position) => {
    const { translate, componentImpacts, answerMapping, componentImpactsKey, questionAnswersKey, getFieldDecorator } = this.props
    let defaultSelected = questionWithAnswer ? { key: questionWithAnswer.componentImpactId ? questionWithAnswer.componentImpactId : '' } : { key: '' }
    let removeFirstComponentImpact = question.hasOwnProperty('answerTypeId') ? (question.answerTypeId === 2) : false

    let componentImpactsCloned = _.filter(_.cloneDeep(componentImpacts), (componentImpact, index) => {
      if (removeFirstComponentImpact) {
        return index !== 0
      } else {
        return true
      }
    })

    return (
      <Card bordered key={question.tempIndex}>
        <Row>
          {/*<Col span={1}>*/}
          {/*<div className='question-number-container'>*/}
          {/*<span>*/}
          {/*<strong>{questionNumber})</strong>*/}
          {/*</span>*/}
          {/*</div>*/}
          {/*</Col>*/}
          <Col span={24}>
            <Row style={{ marginLeft: 15 }}>
              {this.renderEditableHeader(question)}
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              {/*{this.renderRadioGroup(question)}*/}
              <Col span={6}>
                <RadioGroup defaultValue={question.hasOwnProperty('answerTypeId') && question.answerTypeId}
                            onChange={e => this.handleAnswer(e, question)}>
                  {_.map(answerMapping, (answerOption) => (
                    <RadioButton key={answerOption.id}
                                 value={answerOption.id}>{answerOption[questionAnswersKey]}</RadioButton>
                  ))}
                  {/*<RadioButton value='yes'>{translate('option_yes')}</RadioButton>*/}
                  {/*<RadioButton value='no'>{translate('option_no')}</RadioButton>*/}
                  {/*<RadioButton value='n/a'>{translate('option_applicable')}</RadioButton>*/}
                </RadioGroup>
              </Col>
              <Col span={4}>
                <Select
                  labelInValue
                  value={defaultSelected}
                  disabled={questionWithAnswer ? questionWithAnswer.selectDisabled : true}
                  style={{ width: '100%' }}
                  onChange={(value, option) => this.onChangeIndicatorAnswer(value, option, question)}
                >
                  {_.map(componentImpactsCloned, (componentImpact) => (
                    <Select.Option key={componentImpact.id}
                                   value={componentImpact.id}>{componentImpact[componentImpactsKey]}</Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              <Col span={12}>
                {/*<div style={{ width: '100%' }}>*/}
                <Form.Item className="table-amount-fields">
                  {getFieldDecorator(`violationAmount_${position}`, {
                    initialValue: question.hasOwnProperty('violationAmount') ? question.violationAmount : '',
                    rules: [{
                      // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                      required: false,
                      //   validator: (rule, value, callback) => this.props.handleValidateField(
                      //     rule,
                      //     value,
                      //     callback,
                      //     true,
                      //     null,
                      //     `violationAmount_${position}`,
                      //     `violationAmountCovidFund_${position}`,
                      //   ),
                      validator: (rule, value, callback) => this.props.handleValidateField(
                        value,
                        callback,
                        0,
                        `violationAmount_${position}`,
                        `violationAmountCovidFund_${position}`,
                        `violationAmountCovidFund_${position}`,
                        null,
                      ),
                    },
                    //   {
                    //   type: 'number',
                    //   max: MAX_VALUE,
                    // }
                    ],
                  })
                  (<InputNumber
                    style={{ width: '98%' }}
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    placeholder={translate('violation_amount')}
                    onChange={e => this.handleAmount(e, question, 'violationAmount')}
                    // defaultValue={question.hasOwnProperty('violationAmount') ? question.violationAmount : ''}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />)}
                </Form.Item>
                {/*</div>*/}
                {/*<div style={{ marginLeft: 12 }}>*/}
                {/*  {(this.props.answerErrors.hasOwnProperty(`violationAmount_${position}_max`) && this.props.answerErrors[`violationAmount_${position}_max`]) ? (*/}
                {/*    <Tooltip*/}
                {/*      overlayClassName="amount-error-tooltip"*/}
                {/*      placement="topRight"*/}
                {/*      title={translate('max_input_number') + `${MAX_VALUE}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*      key={`violationAmountCovidFund_${position}`}*/}
                {/*    >*/}
                {/*      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />*/}
                {/*    </Tooltip>) : null}*/}
                {/*</div>*/}
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <Form.Item className="table-amount-fields">
                    {getFieldDecorator(`violationAmountCovidFund_${position}`, {
                      initialValue: question.hasOwnProperty('violationAmountCovidFund') ? question.violationAmountCovidFund : '',
                      rules: [{
                        required: false,
                        // validator: (rule, value, callback) => this.props.handleValidateField(
                        //   rule,
                        //   value,
                        //   callback,
                        //   false,
                        //   null,
                        //   `violationAmountCovidFund_${position}`,
                        //   `violationAmount_${position}`,
                        // ),
                        validator: (rule, value, callback) => this.props.handleValidateField(
                          value,
                          callback,
                          1,
                          `violationAmountCovidFund_${position}`,
                          `violationAmount_${position}`,
                          `violationAmountCovidFund_${position}`,
                          null,
                        ),
                      }],
                    })
                    (<InputNumber
                      style={{ width: '100%' }}
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      placeholder={translate('violation_amount_covid')}
                      onChange={e => this.handleAmount(e, question, 'violationAmountCovidFund')}
                      // defaultValue={question.hasOwnProperty('violationAmountCovidFund') ? question.violationAmountCovidFund : ''}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled={!_.isNumber(this.props.answerErrors[`violationAmount_${position}_value`]) && !_.isNumber(this.props.answerErrors[`violationAmountCovidFund_${position}_value`])}
                    />)}
                  </Form.Item>
                </div>
                <div style={{ marginLeft: 12 }}>
                  {(this.props.answerErrors.hasOwnProperty(`violationAmountCovidFund_${position}`) && this.props.answerErrors[`violationAmountCovidFund_${position}`]) ? (
                    <Tooltip
                      overlayClassName="amount-error-tooltip"
                      placement="topRight"
                      title={translate('amount_question_field_error_1')}
                      key={`violationAmountCovidFund_${position}`}
                    >
                      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                    </Tooltip>) : null}
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              <Col span={12}>
                <Form.Item className="table-amount-fields">
                  {getFieldDecorator(`lossAmount_${position}`, {
                    initialValue: question.hasOwnProperty('lossAmount') ? question.lossAmount : '',
                    rules: [{
                      // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                      required: false,
                      // validator: (rule, value, callback) => this.props.handleValidateField(
                      //   rule,
                      //   value,
                      //   callback,
                      //   true,
                      //   null,
                      //   `lossAmount_${position}`,
                      //   `lossAmountCovidFund_${position}`,
                      // ),
                      validator: (rule, value, callback) => this.props.handleValidateField(
                        value,
                        callback,
                        0,
                        `lossAmount_${position}`,
                        `lossAmountCovidFund_${position}`,
                        `lossAmountCovidFund_${position}`,
                        null,
                      ),
                    }],
                  })
                  (<InputNumber
                    style={{ width: '98%' }}
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    placeholder={translate('loss_amount')}
                    onChange={e => this.handleAmount(e, question, 'lossAmount')}
                    // defaultValue={question.hasOwnProperty('lossAmount') ? question.lossAmount : ''}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    disabled={!_.isNumber(this.props.answerErrors[`violationAmountCovidFund_${position}_value`]) && !_.isNumber(this.props.answerErrors[`lossAmount_${position}_value`])}
                  />)}
                </Form.Item>
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <Form.Item className="table-amount-fields">
                    {getFieldDecorator(`lossAmountCovidFund_${position}`, {
                      initialValue: question.hasOwnProperty('lossAmountCovidFund') ? question.lossAmountCovidFund : '',
                      rules: [{
                        // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                        required: false,
                        // validator: (rule, value, callback) => this.props.handleValidateField(
                        //   rule,
                        //   value,
                        //   callback,
                        //   false,
                        //   null,
                        //   `lossAmountCovidFund_${position}`,
                        //   `lossAmount_${position}`,
                        // ),
                        validator: (rule, value, callback) => this.props.handleValidateField(
                          value,
                          callback,
                          1,
                          `lossAmountCovidFund_${position}`,
                          `lossAmount_${position}`,
                          `lossAmountCovidFund_${position}`,
                          null,
                        ),
                      }],
                    })
                    (<InputNumber
                      style={{ width: '100%' }}
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      placeholder={translate('loss_amount_covid')}
                      onChange={e => this.handleAmount(e, question, 'lossAmountCovidFund')}
                      // defaultValue={question.hasOwnProperty('lossAmountCovidFund') ? question.lossAmountCovidFund : ''}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled={!_.isNumber(this.props.answerErrors[`lossAmount_${position}_value`]) && !_.isNumber(this.props.answerErrors[`lossAmountCovidFund_${position}_value`])}
                    />)}
                  </Form.Item>
                </div>
                <div style={{ marginLeft: 12 }}>
                  {(this.props.answerErrors.hasOwnProperty(`lossAmountCovidFund_${position}`) && this.props.answerErrors[`lossAmountCovidFund_${position}`]) ? (
                    <Tooltip
                      overlayClassName="amount-error-tooltip"
                      placement="top"
                      title={translate('amount_question_field_error_2')}
                      key={`lossAmountCovidFund_${position}`}
                    >
                      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                    </Tooltip>) : null}
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <Form.Item className="table-amount-fields">
                    {getFieldDecorator(`eliminatedAmount_${position}`, {
                      initialValue: question.hasOwnProperty('eliminatedAmount') ? question.eliminatedAmount : '',
                      rules: [{
                        // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                        required: false,
                        // validator: (rule, value, callback) => this.props.handleValidateField(
                        //   rule,
                        //   value,
                        //   callback,
                        //   true,
                        //   `violationAmount_${position}`,
                        //   `eliminatedAmount_${position}`,
                        //   `eliminatedAmountCovidFund_${position}`,
                        // ),
                        validator: (rule, value, callback) => this.props.handleValidateField(
                          value,
                          callback,
                          0,
                          `eliminatedAmount_${position}`,
                          `eliminatedAmountCovidFund_${position}`,
                          `eliminatedAmountCovidFund_${position}`,
                          `violationAmount_${position}`,
                        ),
                      }],
                    })
                    (<InputNumber
                      style={{ width: '100%' }}
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      placeholder={translate('eliminated_amount')}
                      onChange={e => this.handleAmount(e, question, 'eliminatedAmount')}
                      // defaultValue={question.hasOwnProperty('eliminatedAmount') ? question.eliminatedAmount : ''}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      // disabled={this.checkDisabled()}
                      disabled={!_.isNumber(this.props.answerErrors[`lossAmountCovidFund_${position}_value`]) && !_.isNumber(this.props.answerErrors[`eliminatedAmount_${position}_value`])}
                    />)}
                  </Form.Item>
                </div>
                <div style={{ marginLeft: 12 }}>
                  {(this.props.answerErrors.hasOwnProperty(`eliminatedAmount_${position}`) && this.props.answerErrors[`eliminatedAmount_${position}`]) ? (
                    <Tooltip
                      overlayClassName="amount-error-tooltip"
                      placement="top"
                      title={translate('amount_question_field_error_4')}
                      key={`eliminatedAmount_${position}`}
                    >
                      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                    </Tooltip>) : null}
                </div>
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <Form.Item className="table-amount-fields">
                    {getFieldDecorator(`eliminatedAmountCovidFund_${position}`, {
                      initialValue: question.hasOwnProperty('eliminatedAmountCovidFund') ? question.eliminatedAmountCovidFund : '',
                      rules: [{
                        // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                        required: false,
                        // validator: (rule, value, callback) => this.props.handleValidateField(
                        //   rule,
                        //   value,
                        //   callback,
                        //   false,
                        //   `eliminatedAmount_${position}`,
                        //   `eliminatedAmountCovidFund_${position}`,
                        //   `eliminatedAmount_${position}`,
                        // ),
                        validator: (rule, value, callback) => this.props.handleValidateField(
                          value,
                          callback,
                          1,
                          `eliminatedAmountCovidFund_${position}`,
                          `eliminatedAmount_${position}`,
                          `eliminatedAmountCovidFund_${position}`,
                          null,
                        ),
                      }],
                    })
                    (<InputNumber
                      style={{ width: '100%' }}
                      autoSize={{ minRows: 1, maxRows: 10 }}
                      placeholder={translate('eliminated_amount_covid')}
                      onChange={e => this.handleAmount(e, question, 'eliminatedAmountCovidFund')}
                      // defaultValue={question.hasOwnProperty('eliminatedAmountCovidFund') ? question.eliminatedAmountCovidFund : ''}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled={!_.isNumber(this.props.answerErrors[`eliminatedAmount_${position}_value`]) && !_.isNumber(this.props.answerErrors[`eliminatedAmountCovidFund_${position}_value`])}
                    />)}
                  </Form.Item>
                </div>
                <div style={{ marginLeft: 12 }}>
                  {(this.props.answerErrors.hasOwnProperty(`eliminatedAmountCovidFund_${position}`) && this.props.answerErrors[`eliminatedAmountCovidFund_${position}`]) ? (
                    <Tooltip
                      overlayClassName="amount-error-tooltip"
                      placement="top"
                      title={translate('amount_question_field_error_3')}
                      key={`eliminatedAmountCovidFund_${position}`}
                    >
                      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                    </Tooltip>) : null}
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder={translate('option_comment')}
                              onChange={e => this.handleComment(e, question)}
                              defaultValue={question.hasOwnProperty('comment') ? question.comment : ''} />
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }

  handleAnswer = (event, question) => {
    question.answerTypeId = event.target.value
    this.props.handleQuestion(question)
  }

  handleComment = (event, question) => {
    question.comment = event.target.value
    this.props.handleQuestion(question)
  }

  handleAmount = (value, question, fieldName) => {
    question[fieldName] = value
    this.props.handleQuestion(question)
  }
}

export default withTranslate(QuestionGroupsOthers)
