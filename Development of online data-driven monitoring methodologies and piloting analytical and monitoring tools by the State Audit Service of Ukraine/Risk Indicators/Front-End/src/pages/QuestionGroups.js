import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import {Collapse, Card, Row, Col, Input, Button, Tooltip, Select, InputNumber} from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import RadioButton from 'antd/lib/radio/radioButton'
import QuestionEditForm from './templates/components/QuestionEditForm'
import _ from 'lodash'

const Panel = Collapse.Panel

class QuestionGroups extends Component {
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
          categories && categories.map((category) => {
              return (
                <Panel header={<div>
                  <span style={{ wordBreak: 'break-word', marginRight: 5 }}><strong>{category.number}</strong></span>
                  <span style={{ wordBreak: 'break-word' }}>{`${category.name}`}</span>
                </div>} key={category.id} style={customPanelStyle}>
                  {
                    category.questions.map((question, questionInd) => {
                      return this.createQuestion(question, _.find(questionsWithIndicators, { tempIndex: question.tempIndex }))
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
              <span style={{ float: 'left', marginRight: 5, }}><strong>{question.number}</strong></span>
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
          <span style={{ float: 'left', marginRight: 5, }}><strong>{question.number}</strong></span>
          <p style={{ wordBreak: 'break-word' }}>{question.description}</p>
        </div>
      )
    }

  }

  onChangeIndicatorAnswer = (value, option, question) => {
    this.props.handleIndicatorAnswerForQuestion(value, question)
  }

  createQuestion = (question, questionWithAnswer) => {
    const { translate, componentImpacts, answerMapping, componentImpactsKey, questionAnswersKey } = this.props
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
                    <RadioButton key={answerOption.id} value={answerOption.id}>{answerOption[questionAnswersKey]}</RadioButton>
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
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder={translate('option_comment')}
                              onChange={e => this.handleComment(e, question)}
                              defaultValue={question.hasOwnProperty('comment') ? question.comment : ''} />
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 15 }}>
              <InputNumber
                  style={{ width: '100%' }}
                  autoSize={{ minRows: 1, maxRows: 10 }}
                  placeholder={translate('amount')}
                  onChange={e => this.handleAmount(e, question)}
                  defaultValue={question.hasOwnProperty('amount') ? question.amount : ''}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
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

  handleAmount = (event, question) => {
    console.log('Handle quesion amount')
    console.log(event)
      question.amount = event
      this.props.handleQuestion(question)
  }
}

export default withTranslate(QuestionGroups)
