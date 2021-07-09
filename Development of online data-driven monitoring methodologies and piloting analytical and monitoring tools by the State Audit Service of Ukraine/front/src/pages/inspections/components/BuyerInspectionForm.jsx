import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import {
  fetchTemplateById,
  fetchBaseTemplateById,
  getCategoriesOfTemplateById,
  clearCategoriesOfBaseTemplateById,
  clearCategoriesOfTemplateById,
} from '../../../redux/action/templates/TemplatesActions'
import { changeChecklistQuestionsData } from '../../../redux/action/checklists/ChecklistActions'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { Card, Row, Col, Modal } from 'antd'
import QuestionGroups from '../../QuestionGroups'
import QuestionGroupsOthers from '../../QuestionGroupsOthers'
import QuestionDialog from '../../QuestionDialog'

import './BuyerInspectionForm.css'

class BuyerInspectionForm extends Component {
  constructor() {
    super()

    this.state = {
      template: null,
      baseTemplate: null,
      checklist: {},
      showQuestionDrawer: false,
      selectedTemplate: null,
      useBaseTemplateData: false,
      amountOfQuestions: 0,
      amountOfAnsweredQuestions: 0,
      answers: [],
      deleteQuestionData: {},
      isVisibleConfirm: false,
      createQuestionError: false,
    }

    this.handleQuestion = _.debounce(this.handleQuestion, 400)
  }

  componentDidMount() {
    this.loadTemplateData()
  }

  componentWillUnmount() {
    this.props.clearCategoriesOfBaseTemplateById()
    this.props.clearCategoriesOfTemplateById()
  }

  loadTemplateData = () => {
    const { defaultAnswered } = this.props

    if (!_.isEmpty(defaultAnswered)) {
      let checklist = {
        categories: this.prepareCategoriesAndQuestion(defaultAnswered),
      }

      this.setState({
        checklist: checklist,
      }, () => {
        Promise.resolve(this.props.changeChecklistQuestionsData(checklist)).then(() => {
          this.prepareQuestionIndicatorAnswer(checklist, true)
        })
      })

    } else {
      this.props.fetchTemplateById(this.props.selectedTemplateId).then(() => {
        if (_.isEmpty(this.props.templateByIdData)) {
          this.props.history.push({
            pathname: '/',
            state: {},
          })
        } else {
          const { templateByIdData } = this.props
          let templateId

          if (templateByIdData.hasOwnProperty('baseTemplateId')) {
            if (templateByIdData.baseTemplateId) {
              templateId = templateByIdData.baseTemplateId
            } else {
              templateId = templateByIdData.id
            }
          } else {
            templateId = templateByIdData.id
          }

          let useBaseTemplateData = (templateByIdData.hasOwnProperty('baseTemplateId') && !_.isNull(templateByIdData.baseTemplateId))

          this.props.getCategoriesOfTemplateById(templateId).then(() => {
            let checklist = {
              categories: this.prepareCategoriesAndQuestion(),
            }

            this.props.changeChecklistQuestionsData(checklist)

            if (useBaseTemplateData) {
              this.props.fetchBaseTemplateById(this.props.templateByIdData.baseTemplateId).then(() => {
                this.setState({
                  template: this.props.templateByIdData,
                  baseTemplate: this.props.baseTemplateByIdData,
                  selectedTemplate: this.props.templateByIdData,
                  checklist: checklist,
                  useBaseTemplateData: true,
                }, () => {
                  this.prepareQuestionIndicatorAnswer(checklist)
                })
              })
            } else {
              this.setState({
                template: this.props.templateByIdData,
                selectedTemplate: this.props.templateByIdData,
                checklist: checklist,
              }, () => {
                this.prepareQuestionIndicatorAnswer(checklist)
              })
            }
          })
        }
      })
    }
  }

  prepareCategoriesAndQuestion = (defaultAnswered) => {
    const {
      categoriesByTemplateId,
    } = this.props

    if (!_.isEmpty(defaultAnswered)) {
      let categoryPreparedData = []
      let categoryIndex = -1
      let questionIndex = -1

      _.forEach(defaultAnswered, (answerData, index) => {
        let existIndex = _.findIndex(categoryPreparedData, { number: answerData.categoryNumber })
        if (existIndex === -1) {
          categoryIndex++
          questionIndex = 0
          categoryPreparedData.push({
            id: categoryIndex,
            name: answerData.categoryName,
            number: answerData.categoryNumber,
            questions: [{
              ...answerData,
              base: answerData.baseQuestion,
              answerTypeId: answerData.answerType ? answerData.answerType.id : answerData.answerType,
              componentImpactId: answerData.componentImpact ? answerData.componentImpact.id : answerData.componentImpact,
              category: {
                id: categoryIndex,
                name: answerData.categoryName,
              },
              description: answerData.questionDescription,
              tempIndex: `${categoryIndex}_${questionIndex}`,
              comment: answerData.comment,
              npa: answerData.npa,
              amount: answerData.amount,
              questionNumber: answerData.questionNumber,
              categoryNumber: answerData.categoryNumber,
              number: answerData.questionNumber,
            }],
          })
        } else {
          questionIndex++
          categoryPreparedData[existIndex].questions.push({
            ...answerData,
            base: answerData.baseQuestion,
            answerTypeId: answerData.answerType ? answerData.answerType.id : answerData.answerType,
            componentImpactId: answerData.componentImpact ? answerData.componentImpact.id : answerData.componentImpact,
            category: {
              id: categoryIndex,
              name: answerData.categoryName,
            },
            description: answerData.questionDescription,
            tempIndex: `${categoryIndex}_${questionIndex}`,
            comment: answerData.comment,
            npa: answerData.npa,
            amount: answerData.amount,
            questionNumber: answerData.questionNumber,
            categoryNumber: answerData.categoryNumber,
            number: answerData.questionNumber,
          })
        }
      })

      return categoryPreparedData
    } else {
      let tempArray = []

      _.forEach(categoriesByTemplateId, (categoryData) => {
        let preparedQuestions = []
        _.forEach(categoryData.questions, (question, index) => {
          preparedQuestions.push(_.merge({}, question, {
            base: question.base,
            tempIndex: `${categoryData.id}_${index}`,
          }))
        })
        tempArray.push({
          id: categoryData.id,
          name: categoryData.name,
          number: categoryData.number,
          questions: preparedQuestions,
        })
      })

      return tempArray
    }
  }

  getIndicatorByQuestionAnswer = (questionData) => {
    let questionAnswerId = questionData.hasOwnProperty('answerTypeId') && questionData.answerTypeId
    let componentImpactId = questionData.hasOwnProperty('componentImpactId') ? questionData.componentImpactId : 2
    if (questionAnswerId && componentImpactId) {
      if (questionAnswerId === 2 && componentImpactId === 1) {
        componentImpactId = 2
      }
    }

    switch (questionData.answerTypeId) {
      case 1:
        return {
          componentImpactId: 2,
          disabled: true,
        }
      case 2:
        return {
          componentImpactId: componentImpactId ? componentImpactId : 2,
          disabled: false,
        }
      case 3:
        return {
          componentImpactId: 1,
          disabled: true,
        }

      default:
        return {
          componentImpactId: componentImpactId,
          disabled: !componentImpactId,
        }
    }
  }

  prepareQuestionIndicatorAnswer = (checklist, onInit = false) => {
    let { answers, amountOfAnsweredQuestions } = this.state
    const answersPrev = _.cloneDeep(answers)

    amountOfAnsweredQuestions = 0
    _.forEach(checklist.categories, (category) => {
      _.forEach(category.questions, (question) => {
        if (question.hasOwnProperty('answerTypeId')) {
          amountOfAnsweredQuestions++
          let indicatorOptions = this.getIndicatorByQuestionAnswer(question)
          let existElement = _.findIndex(answers, { tempIndex: question.tempIndex })
          if (existElement !== -1) {
            if (!_.isEqual(answers[existElement].answerTypeId, question.answerTypeId)) {
              answers[existElement] = {
                tempIndex: question.tempIndex,
                answerTypeId: question.answerTypeId,
                comment: question.hasOwnProperty('comment') ? question.comment : '',
                npa: question.hasOwnProperty('npa') ? question.npa : '',
                amount: question.hasOwnProperty('amount') ? question.amount : '',
                componentImpactId: indicatorOptions.componentImpactId,
                selectDisabled: indicatorOptions.disabled,
                question: {
                  categoryId: category.id,
                  description: question.description,
                  id: question.hasOwnProperty('id') ? question.id : null,
                  base: question.base,
                },
              }
            }
          } else {
            answers.push({
              tempIndex: question.tempIndex,
              answerTypeId: question.hasOwnProperty('answerTypeId') ? question.answerTypeId : null,
              comment: question.hasOwnProperty('comment') ? question.comment : '',
              npa: question.hasOwnProperty('npa') ? question.npa : '',
              amount: question.hasOwnProperty('amount') ? question.amount : '',
              componentImpactId: indicatorOptions.componentImpactId,
              selectDisabled: indicatorOptions.disabled,
              question: {
                categoryId: category.id,
                description: question.description,
                id: question.hasOwnProperty('id') ? question.id : null,
                base: question.base,
              },
            })
          }
        }
      })
    })

    let answersChangeStatus = false

    if (!onInit) {
      if ((!_.isEmpty(answersPrev) && !_.isEmpty(answers)) && (answersPrev.length === answers.length)) {
        _.forEach(answers, (answer, index) => {
          if ((answer.answerTypeId !== answersPrev[index].answerTypeId) || (answer.componentImpactId !== answersPrev[index].componentImpactId)) {
            answersChangeStatus = true
          }
        })
      } else if (_.isEmpty(answersPrev) && !_.isEmpty(answers)) {
        answersChangeStatus = true
      } else if (answersPrev.length !== answers.length) {
        answersChangeStatus = true
      }
    }

    this.setState({
      answers: answers,
      amountOfAnsweredQuestions: amountOfAnsweredQuestions,
    }, this.props.handleChangeChecklistQuestionIndicators(answers, answersChangeStatus))
  }

  handleQuestion = (question) => {
    let { checklist, amountOfQuestions } = this.state

    checklist.categories && checklist.categories.forEach(group => {
      group.questions.forEach((groupQuestion, index) => {
        amountOfQuestions++
        if (groupQuestion.tempIndex === question.tempIndex) {
          group.questions[index] = question
          let ind = this.getIndicatorByQuestionAnswer(question)
          group.questions[index].componentImpactId = ind.componentImpactId
        }
      })
    })

    this.props.changeChecklistQuestionsData(checklist)
    this.setState(
      {
        checklist,
        amountOfQuestions: amountOfQuestions,
      }, () => {
        this.props.handleChangeChecklistQuestion(checklist)
        this.prepareQuestionIndicatorAnswer(checklist)
      })
  }

  renderDeleteConfirmDialog = () => {
    const { isVisibleConfirm, deleteQuestionData } = this.state
    const { translate } = this.props

    return Modal.confirm({
      visible: isVisibleConfirm,
      title: translate('confirm_delete'),
      content: translate('confirm_delete_question_message'),
      keyboard: false,
      maskClosable: false,
      okText: translate('delete_button'),
      cancelText: translate('cancel_button'),
      onOk: () => this.deleteQuestion(deleteQuestionData),
      onCancel: () => this.handleCancelDelete(),
    })
  }

  handleCancelDelete = () => {
    this.setState({
      isVisibleConfirm: false,
      deleteQuestionData: {},
    }, () => {
      Modal.destroyAll()
    })
  }

  handleDeleteQuestion = (question) => {
    this.setState({
      isVisibleConfirm: true,
      deleteQuestionData: question,
    }, () => {
      this.renderDeleteConfirmDialog()
    })
  }

  deleteQuestion = (questionData) => {
    let { checklist } = this.state

    checklist.categories && checklist.categories.forEach(group => {
      group.questions.forEach((groupQuestion, index) => {
        if (groupQuestion.tempIndex === questionData.tempIndex) {
          group.questions.splice(index, 1)
        }
      })
    })

    this.props.changeChecklistQuestionsData(checklist)

    this.setState({
      deleteQuestionData: {},
      isVisibleConfirm: false,
    }, () => {
      this.props.handleChangeChecklistQuestion(checklist)
    })
  }

  addQuestion = (template) => {
    this.setState({
      showQuestionDrawer: true,
    })
  }

  closeQuestionDrawer = () => this.setState({ showQuestionDrawer: false })

  saveQuestion = (question) => {
    this.setState({
      createQuestionError: false,
    }, () => {
      let { checklist: { categories } } = this.state
      let categoryIndex = _.findIndex(categories, { id: question.categoryId })
      let lastQuestionElement = categories[categoryIndex].questions[categories[categoryIndex].questions.length - 1]
      let newElementTempInd = parseInt(lastQuestionElement.tempIndex.split('_')[1], 10) + 1

      if (_.find(categories[categoryIndex].questions, { number: question.number })) {
        this.setState({
          createQuestionError: true,
        })
      } else {
        categories[categoryIndex].questions.push({
          id: null,
          description: question.description,
          number: question.number,
          base: false,
          tempIndex: `${categories[categoryIndex].id}_${newElementTempInd}`,
        })

        this.closeQuestionDrawer()

        this.props.changeChecklistQuestionsData({ categories: categories })

        this.setState({
          checklist: {
            categories: categories,
          },
        }, () => {
          this.props.handleChangeChecklistQuestion({ categories: categories })
        })
      }
    })
  }

  handleIndicatorAnswerForQuestion = (value, question) => {
    let { answers } = this.state
    let existsQuestionIndex = _.findIndex(answers, { tempIndex: question.tempIndex })
    answers[existsQuestionIndex].componentImpactId = value.key

    let { checklist } = this.state

    checklist.categories && checklist.categories.forEach(group => {
      group.questions.forEach((groupQuestion, index) => {
        if (groupQuestion.tempIndex === question.tempIndex) {
          groupQuestion.componentImpactId = value.key
        }
      })
    })

    this.props.changeChecklistQuestionsData(checklist)

    this.setState({
      answers: answers,
      checklist: checklist,
    }, () => {
      this.props.handleChangeChecklistQuestionIndicators(answers)
    })
  }

  render() {
    const { translate, getFieldDecorator, componentImpactsKey, allMappings, questionAnswersKey } = this.props
    const { showQuestionDrawer, selectedTemplate, useBaseTemplateData, createQuestionError } = this.state

    return (
      <div className="BuyerInspectionForm">
        <QuestionDialog
          visible={showQuestionDrawer}
          onClose={this.closeQuestionDrawer}
          handleSave={this.saveQuestion}
          template={selectedTemplate}
          useBaseTemplateData={useBaseTemplateData}
          usedDefaultCategories={this.state.checklist.categories}
          saveErrorStatus={createQuestionError}
        />
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Card
              // title={translate('buyer_card_title')}
              title={translate('questions_group_container_title')}
              style={{ width: '100%', marginTop: '10px' }}
              className="summary-information-card"
            >
              {/*{!onlyView && <Button className="add-custom-question-button" key='3' type='primary' icon='plus'*/}
              {/*                      style={{ float: 'right' }}*/}
              {/*                      onClick={() => this.addQuestion(template)}>{translate('add_new_question_button_title')}</Button>}*/}
              <Row
                // style={{ marginBottom: 10, padding: '5px 0 5px 0' }}
              >{
                this.props.templateByIdData.type.id === 2 ? <QuestionGroupsOthers
                  checklist={this.state.checklist}
                  componentImpacts={allMappings.componentImpacts}
                  questionsWithIndicators={this.state.answers}
                  componentImpactsKey={componentImpactsKey}
                  questionAnswersKey={questionAnswersKey}
                  getFieldDecorator={getFieldDecorator}
                  answerMapping={allMappings.questionAnswers}
                  handleQuestion={this.handleQuestion}
                  handleIndicatorAnswerForQuestion={this.handleIndicatorAnswerForQuestion}
                  onDeleteQuestion={this.handleDeleteQuestion}
                  handleValidateField={this.props.handleValidateField}
                  answerErrors={this.props.answerErrors}
                /> : <QuestionGroups
                  checklist={this.state.checklist}
                  componentImpacts={allMappings.componentImpacts}
                  questionsWithIndicators={this.state.answers}
                  componentImpactsKey={componentImpactsKey}
                  questionAnswersKey={questionAnswersKey}
                  getFieldDecorator={getFieldDecorator}
                  answerMapping={allMappings.questionAnswers}
                  handleQuestion={this.handleQuestion}
                  handleIndicatorAnswerForQuestion={this.handleIndicatorAnswerForQuestion}
                  onDeleteQuestion={this.handleDeleteQuestion}
                />
              }
              </Row>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}

BuyerInspectionForm.propTypes = {
  selectedTemplateId: PropTypes.number,
  templateByIdData: PropTypes.object,
  selectedBuyer: PropTypes.object,
  selectedTender: PropTypes.object,
  defaultAnswered: PropTypes.array,
  onlyView: PropTypes.bool,
  handleChangeChecklistQuestion: PropTypes.func,
  handleChangeChecklistQuestionIndicators: PropTypes.func,
  getFieldDecorator: PropTypes.func,
  handleValidateField: PropTypes.func,
  answerErrors: PropTypes.object,
}

BuyerInspectionForm.defaultProps = {
  answerErrors: {},
}

function mapStateToProps({
                           templatesStore,
                           categoriesStore,
                           mappingsStore,
                           checklistsStore,
                           localizationStore,
                         }) {
  return {
    // templateByIdData: templatesStore.templateByIdData,
    baseTemplateByIdData: templatesStore.baseTemplateByIdData,
    categoriesByTemplateId: categoriesStore.categoriesByTemplateId,
    saveTemplatesData: templatesStore.saveTemplatesData,
    templatesIsFetching: templatesStore.templatesIsFetching,
    templatesTypesData: templatesStore.templatesTypesData,
    saveAuditorTemplateData: templatesStore.saveAuditorTemplateData,
    checklistQuestionsData: checklistsStore.checklistQuestionsData,
    allMappings: mappingsStore.allMappings,
    componentImpactsKey: localizationStore.componentImpactsKey,
    questionAnswersKey: localizationStore.questionAnswersKey,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplateById: bindActionCreators(fetchTemplateById, dispatch),
    fetchBaseTemplateById: bindActionCreators(fetchBaseTemplateById, dispatch),
    getCategoriesOfTemplateById: bindActionCreators(getCategoriesOfTemplateById, dispatch),
    clearCategoriesOfBaseTemplateById: bindActionCreators(clearCategoriesOfBaseTemplateById, dispatch),
    clearCategoriesOfTemplateById: bindActionCreators(clearCategoriesOfTemplateById, dispatch),
    changeChecklistQuestionsData: bindActionCreators(changeChecklistQuestionsData, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(BuyerInspectionForm))
