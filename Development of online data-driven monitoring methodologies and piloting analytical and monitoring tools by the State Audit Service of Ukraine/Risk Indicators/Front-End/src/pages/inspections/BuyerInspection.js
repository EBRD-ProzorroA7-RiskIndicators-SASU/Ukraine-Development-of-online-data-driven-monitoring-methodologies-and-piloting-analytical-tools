import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import { withTranslate } from 'react-redux-multilingual'
import {
  Alert,
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Table,
  ConfigProvider,
  DatePicker,
  Tooltip,
} from 'antd'
import locale from 'antd/es/locale/uk_UA'
import { connect } from 'react-redux'
import BuyerInspectionForm from './components/BuyerInspectionForm'
import {
  fetchTemplateById,
  getCategoriesOfTemplateById,
  saveNewTemplateFromDefault,
} from '../../redux/action/templates/TemplatesActions'
import {
  calculateChecklistScore,
  changeChecklistQuestionsData,
  ClearCalculatedChecklistScore,
  fetchPrioritizationTenderTableForChecklistData,
  getChecklistsDataById,
  saveNewBuyerChecklist,
  updateChecklist,
  clearChecklistsDataById,
} from '../../redux/action/checklists/ChecklistActions'
import {
  fetchIndicatorsDataByTenderId,
  fetchPrioritizationTenderTableData,
  fetchPrioritizationTenderTableDataByBuyerId,
} from '../../redux/action/prioritization/PrioritizationActions'
import { getBuyersBySearch } from '../../redux/action/buyer/BuyerActions'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import {
  INDICATORS_BY_TENDER_TABLE,
  TENDER_INSPECTION_FORM_NAME,
  CONTROL_TABLE,
  AMOUNT_TABLE_FIELDS,
  MAX_VALUE,
} from './InspectionConstants'
import { toISOFormat } from '../../utils/DateUtils'
import { getLocalizationPropByKey } from '../../utils/MappingUtils'
import { isSupervisor } from '../../utils/Permissions'

class TenderInspection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventId: null,
      auditName: '',
      summary: '',
      contractNumber: '',
      contractAmount: null,
      covidAmount: null,
      usedAmount: null,
      dfkOrganization: null,
      contractDescription: '',
      modifiedDate: moment().format('YYYY-MM-DD'),
      startValue: null,
      endValue: null,
      checklist: {},
      checklistChanged: false,
      startDate: null,
      endDate: null,
      checklistName: null,
      selectedTemplateId: null,
      showTendersTable: false,
      tenderTableData: [],
      selectedTender: null,
      indicatorsByTenderId: [],
      indicatorAnswers: [],
      editableChecklistId: null,
      responseBody: {
        answers: [],
        indicators: [],
        statusId: 1,
      },
      selectedChecklistScore: {},
      calculateAlertOptions: {
        showMessage: false,
        message: '',
      },
      templateTypeId: null,
      calculatedScore: {},
      needToRecalculateScore: false,
      noAnswersToCalculateScore: false,
      editableMode: false,
      previewOnly: false,
      waitLoadData: true,
      defaultAnswered: [],
      defaultIndicators: [],
      templateByIdData: props.templateByIdData,
      templateName: '',
      notFoundTenderById: false,
      disableSearchTenderById: false,
      answerErrors: {},
    }

    this._buyerElementRef = React.createRef()
    this._tenderElementRef = React.createRef()
    this._indicatorsElementRef = React.createRef()
    this._answersElementRef = React.createRef()
    this._manualCommentElementRef = React.createRef()
    this._manualScoreElementRef = React.createRef()
    this._amountTableRef = React.createRef()

    this.handleUnload = this.handleUnload.bind(this)
    this.handleChangeAmount = _.debounce(this.handleChangeAmount, 100)
    this.handleValidateField = _.debounce(this.handleValidateField, 300)
  }

  componentDidMount() {
    const { templateId, checklistId, previewOnly, selectedTenderData } = this.props.sectionProps

    if (!previewOnly) {
      window.addEventListener('beforeunload', (event) => this.handleUnload(event))
      document.addEventListener('mousedown', this.handleClickOutside, false)
    }

    if (checklistId) {
      let { defaultAnswered, indicatorAnswers, responseBody, templateByIdData } = this.state
      this.props.getChecklistsDataById(checklistId).then(() => {
        const { apiChecklist, allMappings } = this.props
        defaultAnswered = apiChecklist.answers

        this.props.fetchPrioritizationTenderTableForChecklistData({
          tenderId: _.toNumber(apiChecklist.tender.id),
          contractId: _.toNumber(apiChecklist.contractId),
        }).then(() => {

          responseBody.statusId = apiChecklist.status.id
          this.setState({
            disableSearchTenderById: true,
          }, () => {
            _.forEach(apiChecklist.indicators, (indicatorAnswer) => {
              indicatorAnswers.push({
                id: indicatorAnswer.id,
                answerTypeId: indicatorAnswer.answerType ? indicatorAnswer.answerType.id : indicatorAnswer.answerType,
                comment: indicatorAnswer.comment,
                indicatorData: indicatorAnswer.indicator,
                componentImpactId: indicatorAnswer.componentImpact ? indicatorAnswer.componentImpact.id : indicatorAnswer.componentImpact,
              })
            })

            if (!_.isEmpty(indicatorAnswers)) {
              responseBody.indicators = _.map(_.cloneDeep(indicatorAnswers), (indicatorAnswer) => {
                return {
                  id: indicatorAnswer.id,
                  answerTypeId: indicatorAnswer.answerTypeId,
                  comment: indicatorAnswer.comment,
                  componentImpactId: indicatorAnswer.componentImpactId,
                  indicatorId: indicatorAnswer.indicatorData.id,
                }
              })
            }

            const { indicators } = this.props.allMappings
            let indicatorsByTenderId = _.map(indicatorAnswers, (indicatorData) => {
              return _.find(indicators, { id: indicatorData.indicatorData.id })
            })

            templateByIdData = {
              name: apiChecklist.templateName,
              type: _.find(allMappings.templateTypes, { id: apiChecklist.templateTypeId }),
            }

            this.setState({
              eventId: apiChecklist.event.id,
              checklistName: apiChecklist.name,
              startDate: apiChecklist.startDate,
              endDate: apiChecklist.endDate,
              selectedBuyer: apiChecklist.buyer,
              templateTypeId: apiChecklist.templateTypeId,
              templateName: apiChecklist.templateName,
              editableChecklistId: apiChecklist.id,
              calculatedScore: apiChecklist.autoScore ? apiChecklist.autoScore : {},
              selectedChecklistScore: apiChecklist.manualScore ? apiChecklist.manualScore : {},
              auditName: apiChecklist.auditName,
              summary: apiChecklist.summary,
              modifiedDate: apiChecklist.modifiedDate,
              contractNumber: apiChecklist.contractNumber,
              contractAmount: apiChecklist.contractAmount,
              covidAmount: apiChecklist.covidAmount,
              usedAmount: apiChecklist.usedAmount,
              dfkOrganization: apiChecklist.office.name,
              contractDescription: apiChecklist.contractDescription,
              indicatorsByTenderId: indicatorsByTenderId,
              tenderTableData: this.props.tenderTableDataByBuyerId,
              showTendersTable: true,
              editableMode: true,
              waitLoadData: false,
              previewOnly: previewOnly ? previewOnly : false,
              indicatorAnswers: indicatorAnswers,
              defaultAnswered: defaultAnswered,
              responseBody: responseBody,
              templateByIdData: templateByIdData,
              selectedTender: _.merge({}, this.props.tenderDataForChecklist[0], {
                amountInfo: apiChecklist.amountInfo ? apiChecklist.amountInfo : {},
              }),
            })
          })
        })
      })
    } else {
      this.props.fetchTemplateById(templateId).then(() => {
        if (selectedTenderData) {
          this.props.fetchPrioritizationTenderTableForChecklistData({
            tenderNumber: selectedTenderData.tenderNumber,
            contractNumber: selectedTenderData.contractNumber,
          }).then(() => {
            let tenderData = this.props.tenderDataForChecklist[0]

            this.setState({
              // selectedTender: tenderData,
              selectedTender: _.merge({}, tenderData, {
                amountInfo: {},
              }),
              selectedTemplateId: templateId,
              showTendersTable: true,
              templateTypeId: this.props.templateByIdData.type.id,
              templateName: this.props.templateByIdData.name,
              waitLoadData: false,
              templateByIdData: this.props.templateByIdData,
              eventId: null,
            }, () => {

              this.props.fetchIndicatorsDataByTenderId(tenderData.id).then(() => {
                let { responseBody } = this.state
                let { indicators } = this.props.allMappings
                let indicatorAnswers = []

                _.forEach(this.props.indicatorsByTenderIdData, (indicatorByTender) => {
                  indicatorAnswers.push({
                    id: null,
                    answerTypeId: null,
                    comment: '',
                    indicatorData: _.find(indicators, { id: indicatorByTender.id }),
                    componentImpactId: null,
                  })
                })

                responseBody.indicators = _.map(_.cloneDeep(this.props.indicatorsByTenderIdData), (indicatorByTenderId) => {
                  return {
                    id: null,
                    answerTypeId: null,
                    comment: '',
                    componentImpactId: null,
                    indicatorId: indicatorByTenderId.id,
                  }
                })

                this.setState({
                  indicatorsByTenderId: this.props.indicatorsByTenderIdData,
                  responseBody: responseBody,
                  indicatorAnswers: indicatorAnswers,
                })
              })
            })

          })
        } else {
          this.setState({
            selectedTemplateId: templateId,
            showTendersTable: true,
            templateTypeId: this.props.templateByIdData.type.id,
            templateName: this.props.templateByIdData.name,
            waitLoadData: false,
            templateByIdData: this.props.templateByIdData,
          })
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState, this.state) && this.state.calculateAlertOptions.showMessage) {
      message.destroy()
      this.setState({
        calculateAlertOptions: {
          showMessage: false,
          message: '',
        },
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload)
    document.removeEventListener('mousedown', this.handleClickOutside, false)
    this.props.clearChecklistsDataById()
  }

  handleUnload = (event) => {
    window.removeEventListener('beforeunload', this.handleUnload)
    document.removeEventListener('mousedown', this.handleClickOutside, false)
    event.returnValue = '\0/'
  }

  handleClickOutside = (event) => {
    const { translate } = this.props

    if ((_.some(event.path, { className: 'ant-menu-item ant-menu-item-active' }) || _.some(event.path, { className: 'ant-menu-item ant-menu-item-active ant-menu-item-selected' })) && !this.state.previewOnly) {
      if (window.confirm(translate('changes_you_made_may_not_be_saved'))) {
        window.removeEventListener('beforeunload', this.handleUnload)
        document.removeEventListener('mousedown', this.handleClickOutside, false)
        this.props.history.push({
          pathname: event.target.pathname,
          state: {},
        })
      }
    }
  }

  handleQuestionChange = (checklist) => {
    let { responseBody } = this.state
    responseBody.answers = this.prepareAnswersArray()

    this.setState({
      responseBody: responseBody,
      checklist: checklist,
      checklistChanged: true,
    })
  }

  prepareAnswersArray = () => {
    let temp = []

    _.forEach(this.props.checklistQuestionsData.categories, (category) => {
      _.forEach(category.questions, (question) => {
        temp.push({
          answerTypeId: question.answerTypeId,
          comment: question.comment,
          npa: question.npa,
          amount: question.amount,
          componentImpactId: question.componentImpactId,
          baseQuestion: question.base,
          categoryName: category.name,
          questionDescription: question.description,
          questionNumber: question.number,
          categoryNumber: category.number,
          violationAmount: question.violationAmount,
          violationAmountCovidFund: question.violationAmountCovidFund,
          lossAmount: question.lossAmount,
          lossAmountCovidFund: question.lossAmountCovidFund,
          eliminatedAmount: question.eliminatedAmount,
          eliminatedAmountCovidFund: question.eliminatedAmountCovidFund,
        })
      })
    })

    return temp
  }

  handleSaveInspection = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.form.validateFieldsAndScroll([
      'tenderNumber',
      'eventId',
      'revisionPeriodStartDate',
      'revisionPeriodEndDate',
      'dfkPeriodStartDate',
      'dfkPeriodEndDate'], (err, values) => {

      if (!err) {
        const {
          selectedTender,
          selectedChecklistScore,
          templateTypeId,
          templateName,
          eventId,
        } = this.state

        const { translate } = this.props

        values.startDate = moment(values.startDate).format('YYYY-MM-DD')
        values.endDate = moment(values.endDate).format('YYYY-MM-DD')
        let checklistName = this.props.allMappings.checklistEvents
            .find(e => e.id === eventId).name
          + ' ' + selectedTender.buyerIdentifier
          + ' ' + selectedTender.contractNumber

        values = _.merge({}, values, {
          buyerId: selectedTender.buyerId,
          templateName: templateName,
          templateTypeId: templateTypeId,
          name: checklistName,
          answers: this.prepareAnswersArray(),
          indicators: this.state.responseBody.indicators,
          tenderId: selectedTender ? selectedTender.tenderId : null,
          contractId: selectedTender ? selectedTender.contractId : null,
          statusId: 1,
          id: this.state.editableChecklistId,
          manualScoreId: selectedChecklistScore.hasOwnProperty('id') ? selectedChecklistScore.id : null,
          startDate: toISOFormat(new Date()),
          endDate: toISOFormat(new Date()),
          revisionPeriodStartDate: values.revisionPeriodStartDate ? values.revisionPeriodStartDate.format('YYYY-MM-DD') : values.revisionPeriodStartDate,
          revisionPeriodEndDate: values.revisionPeriodEndDate ? values.revisionPeriodEndDate.format('YYYY-MM-DD') : values.revisionPeriodEndDate,
          dfkPeriodStartDate: values.dfkPeriodStartDate ? values.dfkPeriodStartDate.format('YYYY-MM-DD') : values.dfkPeriodStartDate,
          dfkPeriodEndDate: values.dfkPeriodEndDate ? values.dfkPeriodEndDate.format('YYYY-MM-DD') : values.dfkPeriodEndDate,
        })

        if (selectedTender.hasOwnProperty('amountInfo')) {
          values = _.merge({}, values, {
            amountInfo: selectedTender.amountInfo,
          })
        }

        let noErrors = true
        let errorsText = translate('page_error')
        _.forEach(Object.keys(this.state.answerErrors), (key) => {
          if (this.state.answerErrors[key] === true) {
            noErrors = false
          }
        })

        _.forEach(Object.keys(this.state), (key) => {
          if (key.match('amount_sum')) {
            if (this.state[key] === true) {
              noErrors = false
            }
          }
        })


        if (noErrors) {
          Promise.resolve(this.props.saveNewBuyerChecklist(values)).then(() => {
            this.props.history.push({
              pathname: '/inspections/buyer',
              state: {},
            })
          })
        } else {
          message.error(errorsText)
        }
      }
    })
  }

  handleSaveAndCompleteInspection = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.form.validateFieldsAndScroll([
      'tenderNumber',
      'eventId',
      'revisionPeriodStartDate',
      'revisionPeriodEndDate',
      'dfkPeriodStartDate',
      'dfkPeriodEndDate',
      'summary'], (err, values) => {
      if (!err) {
        const {
          noAnswersToCalculateScore,
          selectedChecklistScore,
          responseBody,
          indicatorAnswers,
          templateTypeId,
          templateName,
          selectedTender,
          eventId,
        } = this.state
        const { translate } = this.props

        let amountOfQuestions = 0
        let amountOfIndicatorsAnswers = 0
        let preparedAnswers = this.prepareAnswersArray()

        _.forEach(preparedAnswers, (answer) => {
          answer.answerTypeId && amountOfQuestions++
        })

        _.forEach(indicatorAnswers, (indicatorData) => {
          indicatorData.answerTypeId && amountOfIndicatorsAnswers++
        })

        if (!_.isEqual(responseBody.indicators.length, amountOfIndicatorsAnswers) && !_.isEmpty(responseBody.indicators)) {
          this.setState({
            calculateAlertOptions: {
              showMessage: true,
              message: translate('not_complete_checklist_indicator_message'),
            },
          }, () => {
            this.scrollToMyRef('_indicatorsElementRef')
          })
        } else if (_.isEmpty(preparedAnswers) || (!_.isEqual(preparedAnswers.length, amountOfQuestions))) {
          this.setState({
            calculateAlertOptions: {
              showMessage: true,
              message: translate('not_complete_checklist_questions_message'),
            },
          }, () => {
            this.scrollToMyRef('_answersElementRef')
          })
        } else if (noAnswersToCalculateScore) {
          this.setState({
            calculateAlertOptions: {
              showMessage: true,
              message: translate('not_complete_checklist_questions_message'),
            },
          }, () => {
            this.scrollToMyRef('_answersElementRef')
          })
        } else if (_.isEmpty(selectedChecklistScore)) {
          this.setState({
            calculateAlertOptions: {
              showMessage: true,
              message: translate('not_complete_checklist_manual_score_message'),
            },
          }, () => {
            this.scrollToMyRef('_manualScoreElementRef')
          })
        } else if (_.isEmpty(values.summary)) {
          this.setState({
            calculateAlertOptions: {
              showMessage: true,
              message: translate('not_complete_checklist_summary_comment_message'),
            },
          }, () => {
            this.scrollToMyRef('_manualCommentElementRef')
          })
        } else {

          values.startDate = moment(values.startDate).format('YYYY-MM-DD')
          values.endDate = moment(values.endDate).format('YYYY-MM-DD')

          let checklistName = this.props.allMappings.checklistEvents
              .find(e => e.id === eventId).name
            + ' ' + selectedTender.buyerIdentifier
            + ' ' + selectedTender.contractNumber

          values = _.merge({}, values, {
            name: checklistName,
            buyerId: selectedTender.buyerId,
            templateName: templateName,
            templateTypeId: templateTypeId,
            answers: preparedAnswers,
            indicators: this.state.responseBody.indicators,
            tenderId: selectedTender.tenderId,
            contractId: selectedTender.contractId,
            statusId: 2,
            id: this.state.editableChecklistId,
            manualScoreId: selectedChecklistScore.hasOwnProperty('id') ? selectedChecklistScore.id : null,
            startDate: toISOFormat(new Date()),
            endDate: toISOFormat(new Date()),
            revisionPeriodStartDate: values.revisionPeriodStartDate ? values.revisionPeriodStartDate.format('YYYY-MM-DD') : values.revisionPeriodStartDate,
            revisionPeriodEndDate: values.revisionPeriodEndDate ? values.revisionPeriodEndDate.format('YYYY-MM-DD') : values.revisionPeriodEndDate,
            dfkPeriodStartDate: values.dfkPeriodStartDate ? values.dfkPeriodStartDate.format('YYYY-MM-DD') : values.dfkPeriodStartDate,
            dfkPeriodEndDate: values.dfkPeriodEndDate ? values.dfkPeriodEndDate.format('YYYY-MM-DD') : values.dfkPeriodEndDate,
          })

          if (selectedTender.hasOwnProperty('amountInfo')) {
            values = _.merge({}, values, {
              amountInfo: selectedTender.amountInfo,
            })
          }

          let noErrors = true
          let errorsText = translate('page_error')
          _.forEach(Object.keys(this.state.answerErrors), (key) => {
            if (this.state.answerErrors[key] === true) {
              noErrors = false
            }
          })

          _.forEach(Object.keys(this.state), (key) => {
            if (key.match('amount_sum')) {
              if (this.state[key] === true) {
                noErrors = false
              }
            }
          })

          const checkWorkAmount = this.getAmountValueSimple(4)
          let violationSum = 0
          _.forEach(preparedAnswers, (item) => {
            violationSum += item.violationAmount
          })

          if (violationSum > checkWorkAmount) {
            noErrors = false
            errorsText = translate('amount_check_work_error')
          }

          if (noErrors) {
            Promise.resolve(this.props.saveNewBuyerChecklist(values)).then(() => {
              this.props.history.push({
                pathname: '/inspections/buyer',
                state: {},
              })
            })
          } else {
            message.error(errorsText)
          }
        }
      }
    })
  }

  handleApproveChecklist = (e) => {
    e.preventDefault()

    let request = {
      id: this.props.apiChecklist.id,
      statusId: 3,
    }

    Promise.resolve(this.props.updateChecklist(request)).then(() => {
      this.props.history.push({
        pathname: '/inspections/buyer',
        state: {},
      })
    })
  }

  handleCancelChecklist = (e) => {
    e.preventDefault()

    let request = {
      id: this.props.apiChecklist.id,
      statusId: 1,
    }

    Promise.resolve(this.props.updateChecklist(request)).then(() => {
      this.props.history.push({
        pathname: '/inspections/buyer',
        state: {},
      })
    })

  }

  getComponentImpactByAnswer = (indicatorHasAnswer, componentImpactsForKPI) => {
    if (_.isEmpty(indicatorHasAnswer)) {
      return {
        disabled: true,
        value: null,
      }
    } else {
      if (indicatorHasAnswer.answerTypeId) {
        if (indicatorHasAnswer.answerTypeId === 2) {
          return {
            disabled: true,
            value: componentImpactsForKPI[0].id,
          }
        } else {
          return {
            disabled: false,
            value: indicatorHasAnswer.componentImpactId,
          }
        }
      } else {
        return {
          disabled: true,
          value: null,
        }
      }
    }
  }

  onChangeIndicatorAnswer = (value, option, indicatorData) => {
    let { indicatorAnswers, responseBody } = this.state
    const responseBodyIndicators = _.cloneDeep(responseBody.indicators)

    _.forEach(indicatorAnswers, (indicatorAnswer) => {
      if (indicatorAnswer.indicatorData.id === indicatorData.id) {
        indicatorAnswer.answerTypeId = value.key
        if (indicatorAnswer.answerTypeId === 2) {
          indicatorAnswer.componentImpactId = 2
        }

        if (!indicatorAnswer.componentImpactId) {
          indicatorAnswer.componentImpactId = 2
        }
      }

      return indicatorAnswer
    })

    responseBody.indicators = _.map(_.cloneDeep(indicatorAnswers), (indicatorAnswer) => {
      return {
        id: indicatorAnswer.id,
        answerTypeId: indicatorAnswer.answerTypeId,
        comment: indicatorAnswer.comment,
        componentImpactId: indicatorAnswer.componentImpactId,
        indicatorId: indicatorAnswer.indicatorData.id,
      }
    })

    this.setState({
      indicatorAnswers: indicatorAnswers,
      responseBody: responseBody,
      needToRecalculateScore: !_.isEqual(responseBodyIndicators, responseBody.indicators),
    })
  }

  onChangeComponentImpacts = (value, option, indicatorData) => {
    let { indicatorAnswers, responseBody } = this.state
    const responseBodyIndicators = _.cloneDeep(responseBody.indicators)
    let indicatorHasAnswer = _.map(indicatorAnswers, (indicatorAnswer) => {
      if (indicatorAnswer.indicatorData.id === indicatorData.id) {
        indicatorAnswer.componentImpactId = value.key
      }

      return indicatorAnswer
    })

    responseBody.indicators = _.map(_.cloneDeep(indicatorHasAnswer), (indicatorAnswer) => {
      return {
        id: indicatorAnswer.id,
        answerTypeId: indicatorAnswer.answerTypeId,
        comment: indicatorAnswer.comment,
        componentImpactId: indicatorAnswer.componentImpactId,
        indicatorId: indicatorAnswer.indicatorData.id,
      }
    })

    this.setState({
      indicatorAnswers: indicatorHasAnswer,
      responseBody: responseBody,
      needToRecalculateScore: !_.isEqual(responseBodyIndicators, responseBody.indicators),
    })
  }

  onChangeImpactComment = (event, indicatorData) => {

    let { indicatorAnswers, responseBody } = this.state
    const responseBodyIndicators = _.cloneDeep(responseBody.indicators)

    let indicatorHasAnswer = _.map(indicatorAnswers, (indicatorAnswer) => {
      if (indicatorAnswer.indicatorData.id === indicatorData.id) {
        indicatorAnswer.comment = event.target.value
      }

      return indicatorAnswer
    })

    responseBody.indicators = _.map(_.cloneDeep(indicatorHasAnswer), (indicatorAnswer) => {
      return {
        id: indicatorAnswer.id,
        answerTypeId: indicatorAnswer.answerTypeId,
        componentImpactId: indicatorAnswer.componentImpactId,
        comment: indicatorAnswer.comment,
        indicatorId: indicatorAnswer.indicatorData.id,
      }
    })

    this.setState({
      indicatorAnswers: indicatorHasAnswer,
      responseBody: responseBody,
      needToRecalculateScore: !_.isEqual(responseBodyIndicators, responseBody.indicators),
    })
  }

  renderComponentImpacts = (indicatorData) => {
    const { allMappings, componentImpactsKey } = this.props
    const { indicatorAnswers } = this.state
    let componentImpactsForKPI = _.cloneDeep(allMappings.componentImpacts)
    componentImpactsForKPI.splice(0, 1)
    let indicatorHasAnswer = _.filter(indicatorAnswers, (indicatorAnswer) => (indicatorAnswer.indicatorData.id === indicatorData.id)).pop()
    let compactDataByIndicatorAnswer = this.getComponentImpactByAnswer(indicatorHasAnswer, componentImpactsForKPI)
    let defaultSelected = compactDataByIndicatorAnswer.value ? { key: compactDataByIndicatorAnswer.value } : { key: '' }
    return (
      <Select
        style={{ width: '100%' }}
        labelInValue
        value={defaultSelected}
        onChange={(value, option) => this.onChangeComponentImpacts(value, option, indicatorData)}
        disabled={compactDataByIndicatorAnswer.disabled}
      >
        {_.map(componentImpactsForKPI, (componentImpact) => (
          (
            <Select.Option
              key={componentImpact.id}
              value={componentImpact.id}
              // disabled={compactDataByIndicatorAnswer.disabled}
            >
              {componentImpact[componentImpactsKey]}
            </Select.Option>
          )
        ))}

      </Select>
    )
  }

  renderImpactCommentComponent = (indicatorData) => {
    const { translate } = this.props
    const { indicatorAnswers } = this.state

    let defaultIndicatorComment = null
    _.forEach(indicatorAnswers, (indicatorAnswer) => {
      if (indicatorAnswer.indicatorData.id === indicatorData.id) {
        defaultIndicatorComment = indicatorAnswer.comment
      }
    })

    return (
      <Input.TextArea
        placeholder={translate('option_comment')}
        autoSize={{ minRows: 1, maxRows: 10 }}
        onChange={(event) => this.onChangeImpactComment(event, indicatorData)}
        value={defaultIndicatorComment ? defaultIndicatorComment : ''}
      />
    )
  }

  renderIndicatorAnswers = (indicatorData) => {
    const { allMappings, indicatorAnswersKey } = this.props
    const { indicatorAnswers } = this.state
    let existIndicatorAnswer = null

    if (!_.isEmpty(indicatorAnswers)) {
      existIndicatorAnswer = _.filter(indicatorAnswers, (haveAnswer) => (haveAnswer.indicatorData.id === indicatorData.id)).pop()
    }

    let defaultSelected = existIndicatorAnswer.answerTypeId ? { key: existIndicatorAnswer.answerTypeId } : { key: '' }

    return (
      <Select
        labelInValue
        value={defaultSelected}
        style={{ width: '100%' }}
        onChange={(value, option) => this.onChangeIndicatorAnswer(value, option, indicatorData)}
      >
        {_.map(allMappings.indicatorAnswers, (indicatorAnswer) => (
          <Select.Option key={indicatorAnswer.id}
                         value={indicatorAnswer.id}>{indicatorAnswer[indicatorAnswersKey]}</Select.Option>
        ))}

      </Select>
    )
  }

  prepareIndicatorsTableData = () => {
    const { indicatorsByTenderId } = this.state
    const { indicators } = this.props.allMappings
    return _.map(indicatorsByTenderId, (indicatorData) => {
      let findIndicatorData = _.find(indicators, { id: indicatorData.id })
      indicatorData = _.merge({}, indicatorData, {
        indicatorAnswers: this.renderIndicatorAnswers(indicatorData),
        componentImpacts: this.renderComponentImpacts(indicatorData),
        indicatorComment: this.renderImpactCommentComponent(indicatorData),
        ...findIndicatorData,
      })

      return indicatorData
    })
  }

  renderIndicatorsWorked = () => {
    const { translate } = this.props
    let preparedColumns = _.map(INDICATORS_BY_TENDER_TABLE, (column) => {
      column.title = translate(column.translateKey)
      if (column.dataIndex === 'description') {
        column.dataIndex = getLocalizationPropByKey('indicatorsKey')
      }
      return column
    })

    return (
      <Row>
        <Col span={24}>
          <Divider>{translate('triggered_indicators')}</Divider>
        </Col>
        <Col span={24} ref={this._indicatorsElementRef} className="indicatorsHighlightTenderTable">
          <Table
            key={this.state.kpiTableKey}
            bordered
            rowKey='id'
            size="small"
            pagination={{ pageSize: 5 }}
            columns={preparedColumns}
            // indentSize={150}
            dataSource={this.prepareIndicatorsTableData()}
          />
        </Col>
      </Row>
    )
  }

  handleChangeChecklistQuestionIndicators = (answers, changeAnswerStatus) => {
    let { responseBody, noAnswersToCalculateScore } = this.state
    const { checklistQuestionsData } = this.props
    responseBody.answers = _.map(_.cloneDeep(answers), (answer) => {
      // delete answer.tempIndex
      delete answer.selectDisabled
      return answer
    })

    let amountOfQuestions = 0
    let amountOfAnsweredMissing = 0

    _.forEach(checklistQuestionsData.categories, (category) => {
      _.forEach(category.questions, (question) => {
        let findAnswer = _.find(responseBody.answers, { tempIndex: question.tempIndex })
        if (!_.isEmpty(findAnswer)) {
          amountOfQuestions++
          if (findAnswer.componentImpactId === 1) {
            amountOfAnsweredMissing++
          }
        } else {
          amountOfQuestions++
        }
      })
    })

    noAnswersToCalculateScore = (amountOfQuestions !== 0) && (amountOfQuestions === amountOfAnsweredMissing)

    this.setState({
      responseBody: responseBody,
      noAnswersToCalculateScore: noAnswersToCalculateScore,
      needToRecalculateScore: changeAnswerStatus,
    })
  }

  onChangeChecklistScore = (value) => {
    this.setState({
      selectedChecklistScore: {
        id: value.key,
        name: value.label,
      },
    })
  }

  onChangeEvent = (value) => {
    this.setState({
      eventId: value,
    })
  }

  closeCalculateAlert = (e) => {
    e.preventDefault()
    this.setState({
      calculateAlertOptions: {
        showMessage: false,
        message: '',
      },
    }, () => {
      message.destroy()
    })
  }

  prepareCustomClosableMessage = (message) => {
    return (
      <div style={{ display: 'inline', position: 'relative' }}>
        <span style={{ paddingRight: '10px' }}>{message}</span>
        <div style={{ position: 'absolute', top: '-12px', right: '-22px' }}
             onClick={(e) => this.closeCalculateAlert(e)}>
          <Icon type="close-circle" style={{ color: '#8c8c8c', cursor: 'pointer' }} />
        </div>
      </div>
    )
  }

  handleCalculatedScore = () => {
    message.destroy()
    const { responseBody, selectedTender, selectedTemplateId, indicatorAnswers } = this.state
    const { translate } = this.props

    let amountOfQuestions = 0
    let amountOfIndicatorsAnswers = 0
    let preparedAnswers = this.prepareAnswersArray()

    _.forEach(preparedAnswers, (answer) => {
      answer.answerTypeId && amountOfQuestions++
    })

    _.forEach(indicatorAnswers, (indicatorData) => {
      indicatorData.answerTypeId && amountOfIndicatorsAnswers++
    })

    if (!selectedTender) {
      this.setState({
        calculateAlertOptions: {
          showMessage: true,
          message: translate('calculate_no_selected_tender_message'),
        },
      }, () => {
        this.scrollToMyRef('_tenderElementRef')
      })
    } else if (!_.isEqual(responseBody.indicators.length, amountOfIndicatorsAnswers) && !_.isEmpty(responseBody.indicators)) {
      this.setState({
        calculateAlertOptions: {
          showMessage: true,
          message: translate('calculate_no_kpi_indicators_answer_message'),
        },
      }, () => {
        this.scrollToMyRef('_indicatorsElementRef')
      })
    } else if (_.isEmpty(preparedAnswers) || (!_.isEqual(preparedAnswers.length, amountOfQuestions))) {
      this.setState({
        calculateAlertOptions: {
          showMessage: true,
          message: translate('calculate_no_questions_answers_message'),
        },
      }, () => {
        this.scrollToMyRef('_answersElementRef')
      })
    } else {
      let responseData = _.merge({}, responseBody, {
        templateId: selectedTemplateId,
      })

      selectedTender && (responseData = _.merge({}, responseData, {
        tenderId: selectedTender.id,
      }))

      this.props.calculateChecklistScore(responseData).then(() => {
        this.setState({
          calculatedScore: this.props.calculatedChecklistScoreData,
          needToRecalculateScore: false,
          checklistChanged: false,
        })
      })
    }
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  handleSearchByCompetitionId = (value) => {
    if (value) {
      this.props.fetchPrioritizationTenderTableForChecklistData({
        tenderNumber: value,
      }).then(() => {
        if (!_.isEmpty(this.props.tenderDataForChecklist)) {
          let tenderData = this.props.tenderDataForChecklist[0]

          this.setState({
            selectedTender: tenderData,
            notFoundTenderById: false,
          }, () => {

            this.props.fetchIndicatorsDataByTenderId(tenderData.id).then(() => {
              let { responseBody } = this.state
              let { indicators } = this.props.allMappings
              let indicatorAnswers = []

              _.forEach(this.props.indicatorsByTenderIdData, (indicatorByTender) => {
                indicatorAnswers.push({
                  id: null,
                  answerTypeId: null,
                  comment: '',
                  indicatorData: _.find(indicators, { id: indicatorByTender.id }),
                  componentImpactId: null,
                })
              })

              responseBody.indicators = _.map(_.cloneDeep(this.props.indicatorsByTenderIdData), (indicatorByTenderId) => {
                return {
                  id: null,
                  answerTypeId: null,
                  comment: '',
                  componentImpactId: null,
                  indicatorId: indicatorByTenderId.id,
                }
              })

              let eraseQuestionData = _.cloneDeep(this.props.checklistQuestionsData)

              _.forEach(eraseQuestionData.categories, (category) => {
                _.forEach(category.questions, (question) => {
                  question.answerTypeId = null
                  question.componentImpactId = null
                  question.comment = ''
                  question.npa = ''
                })
              })

              responseBody.answers = _.map(responseBody.answers, (answer) => {
                answer.answerTypeId = null
                answer.componentImpactId = null
                answer.comment = ''
                answer.npa = ''

                return answer
              })

              this.props.changeChecklistQuestionsData(eraseQuestionData)
              this.setState({
                indicatorsByTenderId: this.props.indicatorsByTenderIdData,
                responseBody: responseBody,
                indicatorAnswers: indicatorAnswers,
              })
            })

          })
        } else {
          this.setState({
            selectedTender: null,
            indicatorsByTenderId: null,
            notFoundTenderById: true,
          })
        }
      })
    }
  }

  validateCompetitionId = (rule, value, callback) => {
    (!value) ? callback(true) : callback()
  }

  scrollToMyRef = (refName) => {
    let headerOffset = 70
    let elementPosition = ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].offsetParent.offsetTop
    let offsetPosition = elementPosition - headerOffset

    switch (refName) {
      case '_buyerElementRef':
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   block: 'center',
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-buyer')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-buyer')
        }, 2000)
        break
      case '_tenderElementRef':
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   // block: 'start',
        //   top: offsetPosition,
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-tender')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-tender')
        }, 2000)
        break
      case '_indicatorsElementRef':
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   block: 'center',
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-tender')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-tender')
        }, 2000)
        break
      case '_answersElementRef':
        // let questionElement = ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].offsetParent.offsetTop
        // let cardHeaderHeight = ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].children[0].children[0].clientHeight
        // offsetPosition = questionElement - headerOffset + cardHeaderHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   block: 'start',
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-answers')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-answers')
        }, 2000)
        break
      case '_manualCommentElementRef':
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   block: 'center',
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollTop += 10
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-manual-impact')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-manual-impact')
        }, 2000)
        break
      case '_manualScoreElementRef':
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        // ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollIntoView({
        //   block: 'center',
        //   behavior: 'smooth',
        // })
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].scrollTop += 10
        ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.add('scroll-highlight-col-manual-impact')
        setTimeout(() => {
          ReactDOM.findDOMNode(this).getElementsByClassName(this[refName].current.props.className)[0].classList.remove('scroll-highlight-col-manual-impact')
        }, 2000)
        break

      default:
        break
    }
  }

  renderChecklistStatusLabel = () => {
    const { translate, apiChecklist } = this.props
    const { responseBody: { statusId } } = this.state
    if (statusId !== 1) {
      return (
        <Badge
          count={apiChecklist.status.name}
          style={{ backgroundColor: '#52c41a', fontSize: '14px' }}
        />
      )
    } else {
      return (
        <Badge
          count={translate('checklist_status_not_complete_name')}
          style={{ fontSize: '14px' }}
        />
      )
    }
  }

  onCloseAlert = () => {
    message.destroy()
  }

  handleClickBackButton = () => {
    this.props.history.push('/inspections/buyer')
  }

  handleChangeDatepicker = (value, fieldName) => {
    this.setState({
      [fieldName]: value,
    })
  }

  prepareAmountTableColumn = () => {
    const { translate } = this.props
    return _.map(CONTROL_TABLE, (column) => {
      column.title = translate(column.translateKey)
      if (column.dataIndex === 'totalAmount') {
        column = _.merge({}, column, {
          title: <div>
            <span>{translate(column.translateKey)}</span>
            <Tooltip
              placement="top"
              title={`${translate('formula_text')} ${translate('state_budget')} + ${translate('local_budget')} + ${translate('others')}`}
            >
              <Icon type="info-circle" style={{ marginLeft: 8 }} />
            </Tooltip>
          </div>,
        })
      }
      return column
    })
  }

  getDisabledStatus = (dependenceField, previousDependence, currentField, position) => {
    const { selectedTender } = this.state
    if (selectedTender.hasOwnProperty('amountInfo')) {
      if (_.isNumber(selectedTender.amountInfo[currentField])) {
        return false
      } else {
        if (previousDependence) {
          let disabled = false
          _.forEach(AMOUNT_TABLE_FIELDS[position - 1].keys, (item) => {
            if (!_.isNumber(selectedTender.amountInfo[item.name])) {
              disabled = true
            }
          })

          if (dependenceField) {
            return !_.isNumber(selectedTender.amountInfo[dependenceField])
          } else {
            return disabled
          }
        } else {
          if (dependenceField) {
            return !_.isNumber(selectedTender.amountInfo[dependenceField])
          } else {
            return false
          }
        }
      }
    } else {
      if (previousDependence) {
        return true
      } else {
        return !!dependenceField
      }
    }
  }

  handleChangeAmount = (value, fieldName, groupIndex) => {
    let selectedTenderCloned = _.cloneDeep(this.state.selectedTender)
    if (selectedTenderCloned.hasOwnProperty('amountInfo')) {
      selectedTenderCloned.amountInfo = _.merge({}, selectedTenderCloned.amountInfo, {
        [fieldName]: value,
      })
    } else {
      selectedTenderCloned = _.merge({}, selectedTenderCloned, {
        amountInfo: {
          [fieldName]: value,
        },
      })
    }

    Promise.resolve(this.setState({
      selectedTender: selectedTenderCloned,
    })).then(() => {
      this.getAmountValue(groupIndex)
    })
  }

  getAmountValueSimple = (position) => {
    const { selectedTender } = this.state
    let amount = 0
    if (selectedTender.hasOwnProperty('amountInfo')) {
      _.forEach(AMOUNT_TABLE_FIELDS[position].keys, (item) => {
        if (item.name.match('StateBudget|LocalBudget|AmountOthers')) {
          if (_.isNumber(selectedTender.amountInfo[item.name])) {
            amount += selectedTender.amountInfo[item.name]
          }
        }
      })
      return amount
    } else {
      return ''
    }
  }

  getAmountValue = (position) => {
    const { selectedTender } = this.state
    let amount = 0
    if (selectedTender.hasOwnProperty('amountInfo')) {
      _.forEach(AMOUNT_TABLE_FIELDS[position].keys, (item) => {
        if (item.name.match('StateBudget|LocalBudget|AmountOthers')) {
          if (_.isNumber(selectedTender.amountInfo[item.name])) {
            amount += selectedTender.amountInfo[item.name]
          }
        }
      })
      this.props.form.setFieldsValue({
        [`amount_sum_${position}`]: amount,
      })
      return amount
    } else {
      return ''
    }
  }

  handleValidateFieldSum = (rule, value, callback, groupIndex, sumField) => {
    if (groupIndex > 0 && groupIndex < 4) {
      const prevAmount = this.getAmountValueSimple(0)
      const currAmount = this.getAmountValueSimple(groupIndex)

      if (currAmount > prevAmount) {
        this.setState({
          [sumField]: true,
        })
        callback(true)
      } else {
        this.setState({
          [sumField]: false,
        })
        callback()
      }
    } else {
      if (groupIndex === 4) {
        const prevAmount = this.getAmountValueSimple(groupIndex - 1)
        const currAmount = this.getAmountValueSimple(groupIndex)
        if (currAmount > prevAmount) {
          this.setState({
            [sumField]: true,
          })
          callback(true)
        } else {
          this.setState({
            [sumField]: false,
          })
          callback()
        }
      } else {
        this.setState({
          [sumField]: false,
        })
        callback()
      }
    }
  }

  handleValidateMainFields = (value, callback, prevField, partErrorField, groupIndex, elementIndex, sumField) => {
    this.props.form.validateFields([sumField + 1], { force: true })
    this.props.form.validateFields([sumField + 2], { force: true })
    this.props.form.validateFields([sumField + 3], { force: true })
    this.props.form.validateFields([sumField + 4], { force: true })
    if (!_.isNumber(value)) {
      this.props.form.validateFields([prevField], { force: true })
    } else {
      const dependAmount = this.props.form.getFieldValue(partErrorField + 1)
      if (value < dependAmount) {
        this.setState({
          [partErrorField + 1]: true,
        }, () => {
          this.props.form.validateFields([partErrorField + 1], { force: true })
        })
        return callback()
      } else {
        this.setState({
          [partErrorField + 1]: false,
        }, () => {
          this.props.form.validateFields([partErrorField + 1], { force: true })
        })
        return callback()
      }
    }
  }

  handleValidateDependsFields = (value, callback, prevField, partErrorField, groupIndex, elementIndex, sumField) => {
    this.props.form.validateFields([sumField + 1], { force: true })
    this.props.form.validateFields([sumField + 2], { force: true })
    this.props.form.validateFields([sumField + 3], { force: true })
    this.props.form.validateFields([sumField + 4], { force: true })
    if (!_.isNumber(value)) {
      this.setState({
        [partErrorField + 1]: false,
      })
      return callback()
    } else {
      const dependAmount = this.props.form.getFieldValue(partErrorField + 0)
      if (value > dependAmount) {
        this.setState({
          [partErrorField + 1]: true,
        })
        return callback(true)
      } else {
        this.setState({
          [partErrorField + 1]: false,
        })
        return callback()
      }
    }
  }

  // handleValidateField = (rule, value, callback, groupIndex, index, needCheck, prevField, partErrorField, sumField) => {
  handleValidateField = (value, callback, groupIndex, elementIndex, prevField, partErrorField, sumField) => {
    if (elementIndex === 0) {
      this.handleValidateMainFields(value, callback, prevField, partErrorField, groupIndex, elementIndex, sumField)
    } else if (elementIndex === 1) {
      this.handleValidateDependsFields(value, callback, prevField, partErrorField, groupIndex, elementIndex, sumField)
    } else {
      this.props.form.validateFields([sumField + 1], { force: true })
      this.props.form.validateFields([sumField + 2], { force: true })
      this.props.form.validateFields([sumField + 3], { force: true })
      this.props.form.validateFields([sumField + 4], { force: true })
    }

    // this.props.form.validateFields([sumField + '1'], { force: true })
    // this.props.form.validateFields([sumField + '2'], { force: true })
    // this.props.form.validateFields([sumField + '3'], { force: true })
    // this.props.form.validateFields([sumField + '4'], { force: true })
    // // this.getAmountValue(groupIndex)
    // if (!_.isNumber(value)) {
    //   if (index === 0) {
    //     this.props.form.validateFields([partErrorField + '1'], { force: true })
    //   } else {
    //     this.setState({
    //       [partErrorField + '1']: false,
    //     })
    //     return callback()
    //   }
    // } else {
    //   if (needCheck) {
    //     const prevValue = this.state.selectedTender.amountInfo.hasOwnProperty(prevField) ? this.state.selectedTender.amountInfo[prevField] : 0
    //     if (index === 0) {
    //       this.props.form.validateFields([partErrorField + '1'], { force: true })
    //     } else {
    //       if (value > prevValue) {
    //         this.setState({
    //           [partErrorField + '1']: true,
    //         })
    //         return callback(true)
    //       } else {
    //         this.setState({
    //           [partErrorField + '1']: false,
    //         })
    //         return callback()
    //       }
    //     }
    //   } else {
    //     return callback()
    //   }
    // }
  }

  // handleValidateMainAnswersFields = (value, callback, prevField, partErrorField, groupIndex, elementIndex, sumField) => {
  handleValidateMainAnswersFields = (value, callback, elementIndex, mainField, checkField, errorField) => {
    let answerErrors = _.cloneDeep(this.state.answerErrors)
    if (!_.isNumber(value)) {
      this.props.form.validateFields([checkField], { force: true })
    } else {
      const dependAmount = this.props.form.getFieldValue(checkField)
      if (value < dependAmount) {
        answerErrors = _.merge({}, answerErrors, {
          [errorField]: true,
          [`${mainField}_value`]: value,
        })
        this.setState({
          answerErrors: answerErrors,
        }, () => {
          this.props.form.validateFields([errorField], { force: true })
        })
        return callback()
      } else {
        answerErrors = _.merge({}, answerErrors, {
          [errorField]: false,
          [`${mainField}_value`]: value,
        })
        this.setState({
          answerErrors: answerErrors,
        }, () => {
          this.props.form.validateFields([errorField], { force: true })
        })
        return callback()
      }
    }
  }

  handleValidateSecondAnswersFields = (value, callback, elementIndex, mainField, checkField, errorField) => {
    let answerErrors = _.cloneDeep(this.state.answerErrors)
    if (!_.isNumber(value)) {
      // return callback()
      answerErrors = _.merge({}, answerErrors, {
        [`${mainField}_value`]: value,
      })
      this.setState({
        answerErrors: answerErrors,
      })
      return callback()
    } else {
      const dependAmount = this.props.form.getFieldValue(checkField)
      if (value > dependAmount) {
        answerErrors = _.merge({}, answerErrors, {
          [errorField]: true,
          [`${mainField}_value`]: value,
        })
        this.setState({
          answerErrors: answerErrors,
        })
        return callback(true)
      } else {
        answerErrors = _.merge({}, answerErrors, {
          [errorField]: false,
          [`${mainField}_value`]: value,
        })
        this.setState({
          answerErrors: answerErrors,
        })
        return callback()
      }
    }
  }

  handleValidateDependsAnswersFields = (value, callback, elementIndex, mainField, checkField, errorField, dependsField) => {
    let answerErrors = _.cloneDeep(this.state.answerErrors)
    if (!_.isNumber(value)) {
      answerErrors = _.merge({}, answerErrors, {
        [mainField]: false,
        [`${mainField}_value`]: value,
      })
      this.setState({
        answerErrors: answerErrors,
      }, () => {
        this.props.form.validateFields([checkField], { force: true })
      })
      return callback()
    } else {
      const checkAmount = this.props.form.getFieldValue(checkField)
      const dependAmount = this.props.form.getFieldValue(dependsField)

      if (value > dependAmount) {
        if (value < checkAmount) {
          answerErrors = _.merge({}, answerErrors, {
            [mainField]: true,
            [errorField]: true,
            [`${mainField}_value`]: value,
          })
          this.setState({
            answerErrors: answerErrors,
          }, () => {
            this.props.form.validateFields([checkField], { force: true })
          })
          return callback(true)
        } else {
          answerErrors = _.merge({}, answerErrors, {
            [mainField]: true,
            [errorField]: false,
            [`${mainField}_value`]: value,
          })
          this.setState({
            answerErrors: answerErrors,
          }, () => {
            this.props.form.validateFields([checkField], { force: true })
          })
          return callback(true)
        }
      } else {
        if (value < checkAmount) {
          answerErrors = _.merge({}, answerErrors, {
            [mainField]: false,
            [errorField]: true,
            [`${mainField}_value`]: value,
          })
          this.setState({
            answerErrors: answerErrors,
          }, () => {
            this.props.form.validateFields([checkField], { force: true })
          })
          return callback()
        } else {
          answerErrors = _.merge({}, answerErrors, {
            [mainField]: false,
            [errorField]: false,
            [`${mainField}_value`]: value,
          })
          this.setState({
            answerErrors: answerErrors,
          }, () => {
            this.props.form.validateFields([checkField], { force: true })
          })
          return callback()
        }
      }
      // if (value > dependAmount) {
      //   answerErrors = _.merge({}, answerErrors, {
      //     [errorField]: true,
      //   })
      //   this.setState({
      //     answerErrors: answerErrors,
      //   })
      //   return callback(true)
      // } else {
      //   answerErrors = _.merge({}, answerErrors, {
      //     [errorField]: false,
      //   })
      //   this.setState({
      //     answerErrors: answerErrors,
      //   })
      //   return callback()
      // }
    }
  }
  // handleValidateFieldAnswers = (rule, value, callback, needForce, dependField, currentField, checkField) => {
  handleValidateFieldAnswers = (value, callback, elementIndex, mainField, checkField, errorField, dependsField) => {
    callback()
    if (dependsField) {
      this.handleValidateDependsAnswersFields(value, callback, elementIndex, mainField, checkField, errorField, dependsField)
    } else {
      if (elementIndex === 0) {
        this.handleValidateMainAnswersFields(value, callback, elementIndex, mainField, checkField, errorField)
      } else {
        this.handleValidateSecondAnswersFields(value, callback, elementIndex, mainField, checkField, errorField)
      }
    }
    // let answerErrors = _.cloneDeep(this.state.answerErrors)
    // if (!_.isNumber(value)) {
    //   // if (dependField) {
    //   //   answerErrors = _.merge({}, answerErrors, {
    //   //     [currentField]: false,
    //   //     [checkField]: false,
    //   //     [`${currentField}_amount`]: 0,
    //   //   })
    //   //   this.setState({
    //   //     answerErrors: answerErrors,
    //   //   }, () => {
    //   //     this.props.form.validateFields([checkField], { force: true })
    //   //   })
    //   //   return callback()
    //   // } else {
    //   //   answerErrors = _.merge({}, answerErrors, {
    //   //     [currentField]: false,
    //   //     [checkField]: false,
    //   //     [`${currentField}_amount`]: 0,
    //   //   })
    //   //   this.setState({
    //   //     answerErrors: answerErrors,
    //   //   })
    //   //   return callback()
    //   // }
    // }
    //
    // if (needForce) {
    //   if (dependField) {
    //     const dependAmount = this.props.form.getFieldValue(dependField)
    //     const nextAmount = this.props.form.getFieldValue(checkField)
    //     if (value > dependAmount) {
    //       answerErrors = _.merge({}, answerErrors, {
    //         [currentField]: true,
    //         [checkField]: value < nextAmount,
    //         [`${currentField}_amount`]: value,
    //       }, () => {
    //         (value <= nextAmount) && this.props.form.validateFields([checkField], { force: true })
    //       })
    //       this.setState({
    //         answerErrors: answerErrors,
    //       })
    //       return callback(true)
    //     } else {
    //       if (value <= nextAmount) {
    //         answerErrors = _.merge({}, answerErrors, {
    //           [currentField]: false,
    //           [checkField]: false,
    //           [`${currentField}_amount`]: value,
    //         })
    //         this.setState({
    //           answerErrors: answerErrors,
    //         }, () => {
    //           this.props.form.validateFields([checkField], { force: true })
    //         })
    //         return callback()
    //       } else {
    //         answerErrors = _.merge({}, answerErrors, {
    //           [currentField]: false,
    //           [checkField]: false,
    //           [`${currentField}_amount`]: value,
    //         })
    //         this.setState({
    //           answerErrors: answerErrors,
    //         })
    //         return callback()
    //       }
    //     }
    //   } else {
    //     const nextAmount = this.props.form.getFieldValue(checkField)
    //     if (value < nextAmount) {
    //       answerErrors = _.merge({}, answerErrors, {
    //         [checkField]: true,
    //         [`${currentField}_amount`]: value,
    //       })
    //       this.setState({
    //         answerErrors: answerErrors,
    //       }, () => {
    //         this.props.form.validateFields([checkField], { force: true })
    //       })
    //       return callback()
    //     } else {
    //       answerErrors = _.merge({}, answerErrors, {
    //         [currentField]: false,
    //         [checkField]: false,
    //         [`${currentField}_amount`]: value,
    //       })
    //       this.setState({
    //         answerErrors: answerErrors,
    //       })
    //       return callback()
    //     }
    //   }
    // } else {
    //   const amount = this.props.form.getFieldValue(checkField)
    //   if (value > amount) {
    //     answerErrors = _.merge({}, answerErrors, {
    //       [currentField]: true,
    //       [`${currentField}_amount`]: value,
    //     })
    //     this.setState({
    //       answerErrors: answerErrors,
    //     })
    //     return callback(true)
    //   } else {
    //     answerErrors = _.merge({}, answerErrors, {
    //       [currentField]: false,
    //       [checkField]: false,
    //       [`${currentField}_amount`]: value,
    //     })
    //     this.setState({
    //       answerErrors: answerErrors,
    //     })
    //     return callback()
    //   }
    // }
  }

  handleOnKeyUp = (event, fieldName, stateKey = null) => {
    const value = event.target.value.replace(/\$\s?|(,*)/g, '')
    let answerErrors = this.state.answerErrors
    if (value > MAX_VALUE) {
      if (stateKey) {
        answerErrors = _.merge({}, answerErrors, {
          [`${fieldName}_max`]: true,
        })
        this.setState({
          answerErrors: answerErrors,
        })
      } else {
        this.props.form.validateFields([fieldName], { force: true })
        this.setState({
          [`${fieldName}_max`]: true,
        })
      }
    } else {
      if (stateKey) {
        answerErrors = _.merge({}, answerErrors, {
          [`${fieldName}_max`]: false,
        })
        this.setState({
          answerErrors: answerErrors,
        })
      } else {
        this.setState({
          [`${fieldName}_max`]: false,
        })
      }
    }
  }

  prepareAmountTableData = () => {
    const { translate, form } = this.props
    const { getFieldDecorator } = form
    const { selectedTender } = this.state

    return AMOUNT_TABLE_FIELDS.map((item, index) => {
      let tableOption = {
        amount_category_title: <b>{translate(item.translateKey)}</b>,
      }
      _.forEach(item.keys, (keyData, ind) => {
        tableOption = _.merge({}, tableOption, {
          id: `index_${index}_${ind}`,
          [CONTROL_TABLE[ind + 1]['dataIndex']]:
            <div style={{ display: 'flex', alignItems: 'center' }} key={`index_${index}_${ind}`}>
              <div style={{ width: '100%' }}>
                <Form.Item className="table-amount-fields">
                  {getFieldDecorator(`amount_${index}_${ind}`, {
                    initialValue: selectedTender.amountInfo.hasOwnProperty(keyData.name) ? selectedTender.amountInfo[keyData.name] : '',
                    rules: [{
                      // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                      required: !!(ind === 1 || keyData.previousSumDependence),
                      //   validator: (rule, value, callback) => this.handleValidateField(
                      //     rule,
                      //     value,
                      //     callback,
                      //     index,
                      //     ind,
                      //     ind < 2,
                      //     keyData.dependenceOn,
                      //     `amount_${index}_`,
                      //     `amount_sum_`),
                      // }],
                      validator: (rule, value, callback) => this.handleValidateField(
                        value,
                        callback,
                        index,
                        ind,
                        keyData.dependenceOn,
                        `amount_${index}_`,
                        `amount_sum_`),
                    }, {
                      type: 'number',
                      max: MAX_VALUE,
                    }],
                  })
                  (<InputNumber
                    style={{ width: '100%' }}
                    onKeyUp={(event) => this.handleOnKeyUp(event, `amount_${index}_${ind}`)}
                    // defaultValue={selectedTender.amountInfo.hasOwnProperty(keyData.name) ? selectedTender.amountInfo[keyData.name] : ''}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value) => this.handleChangeAmount(value, keyData.name, index)}
                    disabled={this.getDisabledStatus(keyData.dependence, item.previousDependence, keyData.name, index)}
                  />)}
                </Form.Item>
              </div>
              <div style={{ marginLeft: 12 }}>
                {(this.state.hasOwnProperty(`amount_${index}_${ind}`) && this.state[`amount_${index}_${ind}`]) ? (
                  <Tooltip
                    overlayClassName="amount-error-tooltip"
                    placement="topRight"
                    title={translate('amount_table_field_error')}
                    // visible={this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false}
                    key={`amount_${index}_${ind}`}
                  >
                    {!(this.state.hasOwnProperty(`amount_${index}_${ind}_max`) && this.state[`amount_${index}_${ind}_max`]) ?
                      <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} /> : null}
                  </Tooltip>) : null}
                {(this.state.hasOwnProperty(`amount_${index}_${ind}_max`) && this.state[`amount_${index}_${ind}_max`]) ? (
                  <Tooltip
                    overlayClassName="amount-error-tooltip"
                    placement="topRight"
                    // title={translate('amount_table_field_error')}
                    title={translate('max_input_number') + `${MAX_VALUE}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    // visible={true}
                    key={`amount_${index}_${ind}`}
                  >
                    <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                  </Tooltip>) : null}
              </div>
            </div>,
        })
      })

      let simpleTranslate = translate('amount_sum_error')

      tableOption = _.merge({}, tableOption, {
        totalAmount:
          <div style={{ display: 'flex', alignItems: 'center' }} key={`index_${index}_custom`}>
            <div style={{ width: '100%' }}>
              <Form.Item className="table-amount-fields">
                {getFieldDecorator(`amount_sum_${index}`, {
                  initialValue: this.getAmountValueSimple(index),
                  rules: [{
                    // required: this.state.hasOwnProperty(`amount_${index}_${ind}`) ? this.state[`amount_${index}_${ind}`] : false,
                    required: false,
                    validator: (rule, value, callback) => this.handleValidateFieldSum(
                      rule,
                      value,
                      callback,
                      index,
                      `amount_sum_${index}`),
                  }],
                })
                (<InputNumber
                  key={`amount_sum_${index}`}
                  style={{ width: '100%' }}
                  // value={this.getAmountValue(index)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  disabled={true}
                />)}
              </Form.Item>
            </div>
            <div style={{ marginLeft: 12 }}>
              {(this.state.hasOwnProperty(`amount_sum_${index}`) && this.state[`amount_sum_${index}`]) ? (
                <Tooltip
                  overlayClassName="amount-error-tooltip"
                  placement="topRight"
                  title={simpleTranslate.replace('%from%', translate(AMOUNT_TABLE_FIELDS[index].translateFrom)).replace('%to%', translate(AMOUNT_TABLE_FIELDS[index].translateTo))}
                  // visible={this.state.hasOwnProperty(`amount_sum_${index}`) ? this.state[`amount_sum_${index}`] : false}
                  key={`amount_sum_${index}`}
                >
                  <Icon type="info-circle" style={{ color: '#ff0000', fontSize: 18 }} />
                </Tooltip>) : null}
            </div>
          </div>,
      })
      return tableOption
    })
  }

  render() {
    const {
      eventId,
      waitLoadData,
      calculateAlertOptions,
      calculatedScore,
      selectedChecklistScore,
      summary,
      modifiedDate,
      selectedTender,
      covidAmount,
      usedAmount,
      startDate,
    } = this.state
    const { allMappings, translate, form, checklistScoreKey, apiChecklist, userInfo } = this.props
    const { getFieldDecorator } = form

    if (waitLoadData) {
      return null
    }

    calculateAlertOptions.showMessage && message.warning(this.prepareCustomClosableMessage(calculateAlertOptions.message), 4, this.onCloseAlert)

    return (
      <div className="InspectionPage">

        {/*{}*/}

        <Row style={{ marginBottom: 15 }}>
          <Col span={4}>
            <div>
              <Button size='large' onClick={() => this.handleClickBackButton()}>
                <Icon type="left" />
                {translate('back_button')}
              </Button>
            </div>
          </Col>
          <Col span={4} offset={16}>
            <div style={{ float: 'right' }}>
              {this.renderChecklistStatusLabel()}
            </div>
          </Col>
        </Row>

        <Form
          layout="horizontal"
          prefixCls="buyer_inspection_form"
        >
          <Row style={{ marginBottom: 15 }}>
            <Col span={6} ref={this._tenderElementRef} className="checklistTenderTable">
              <Form.Item>
                {getFieldDecorator('tenderNumber', {
                  initialValue: selectedTender && selectedTender.tenderNumber,
                  rules: [{
                    required: true,
                    message: translate('not_empty_field'),
                    validator: this.validateCompetitionId,
                  }],
                })(
                  <Input.Search
                    placeholder={translate('tender_filter_concurs_number_name')}
                    onSearch={this.handleSearchByCompetitionId}
                    enterButton
                    disabled={this.state.disableSearchTenderById}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {this.state.notFoundTenderById && <Row style={{ marginBottom: 5 }}>
            <Col span={24}>
              <Alert
                description={translate('no_found_tender_by_id')}
                type="warning"
                showIcon
              />
              {/*needToRecalculateScore*/}
            </Col>
          </Row>}
          <Row>
            <Col span={6}>
              {translate('inspection_checklist_name')}
            </Col>
            <Col span={16}>
              <Form.Item>
                {getFieldDecorator('eventId', {
                  initialValue: eventId,
                  rules: [
                    { required: true, message: 'Захід не може бути порожнім' },
                  ],
                })(
                  <Select
                    disabled={this.state.previewOnly}
                    onChange={this.onChangeEvent}
                  >
                    {_.map(allMappings.checklistEvents, (event) => (
                      <Select.Option key={event.id} value={event.id}>
                        {
                          event.name
                          + ' '
                          + selectedTender.buyerIdentifier
                          + ' '
                          + selectedTender.contractNumber
                        }
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_control_object')}
            </Col>
            <Col span={16}>
              <Input value={selectedTender.buyerIdentifier + ' ' + selectedTender.buyerName}
                     disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_date_of_completion_name')}
            </Col>
            <Col span={16}>
              <Input value={startDate} disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_modified_date')}
            </Col>
            <Col span={16}>
              <Input value={modifiedDate}
                     disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_dfk_organization')}
            </Col>
            <Col span={16}>
              <Input value={(this.state.dfkOrganization) ? this.state.dfkOrganization : userInfo.office.name} disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_revision_period')}
            </Col>
            <Col span={16}>
              <Col span={5}>
                <ConfigProvider locale={locale}>
                  <Form.Item>
                    {getFieldDecorator('revisionPeriodStartDate', {
                      initialValue: !_.isEmpty(apiChecklist.revisionPeriodStartDate) ? moment(apiChecklist.revisionPeriodStartDate) : null,
                      rules: [
                        {
                          type: 'object',
                          required: true,
                          message: translate('datepicker_start_period_error'),
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder={translate('datepicker_start_period')}
                        onChange={(value) => this.handleChangeDatepicker(value, 'revisionPeriodStartDate')}
                        disabledDate={(value) => value > this.state.revisionPeriodEndDate}
                      />,
                    )}
                  </Form.Item>
                </ConfigProvider>
              </Col>
              <Col span={5}>
                <ConfigProvider locale={locale}>
                  <Form.Item>
                    {getFieldDecorator('revisionPeriodEndDate', {
                      initialValue: !_.isEmpty(apiChecklist.revisionPeriodEndDate) && moment(apiChecklist.revisionPeriodEndDate),
                      rules: [
                        {
                          type: 'object',
                          required: true,
                          message: translate('datepicker_end_period_error'),
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder={translate('datepicker_end_period')}
                        onChange={(value) => this.handleChangeDatepicker(value, 'revisionPeriodEndDate')}
                        disabledDate={(value) => value < this.state.revisionPeriodStartDate}
                      />,
                    )}
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_dfk_period')}
            </Col>
            <Col span={16}>
              <Col span={5}>
                <ConfigProvider locale={locale}>
                  <Form.Item>
                    {getFieldDecorator('dfkPeriodStartDate', {
                      initialValue: !_.isEmpty(apiChecklist.dfkPeriodStartDate) && moment(apiChecklist.dfkPeriodStartDate),
                      rules: [
                        {
                          type: 'object',
                          required: true,
                          message: translate('datepicker_start_period_error'),
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder={translate('datepicker_start_period')}
                        onChange={(value) => this.handleChangeDatepicker(value, 'dfkPeriodStartDate')}
                        disabledDate={(value) => value > this.state.dfkPeriodEndDate}
                      />,
                    )}
                  </Form.Item>
                </ConfigProvider>
              </Col>
              <Col span={5}>
                <ConfigProvider locale={locale}>
                  <Form.Item>
                    {getFieldDecorator('dfkPeriodEndDate', {
                      initialValue: !_.isEmpty(apiChecklist.dfkPeriodEndDate) && moment(apiChecklist.dfkPeriodEndDate),
                      rules: [
                        {
                          type: 'object',
                          required: true,
                          message: translate('datepicker_end_period_error'),
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder={translate('datepicker_end_period')}
                        onChange={(value) => this.handleChangeDatepicker(value, 'dfkPeriodEndDate')}
                        disabledDate={(value) => value < this.state.dfkPeriodStartDate}
                      />,
                    )}
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_subject')}
            </Col>
            <Col span={16}>
              <Input value={selectedTender ? selectedTender.cpvNames : ''} disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_contract_id')}
            </Col>
            <Col span={16}>
              <Input value={selectedTender ? selectedTender.contractNumber : ''} disabled={true} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('inspection_expected_amount')}
            </Col>
            <Col span={16}>
              <InputNumber
                style={{ width: '100%' }}
                value={selectedTender ? selectedTender.contractAmount : ''}
                disabled={true}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('contract_term')}
            </Col>
            <Col span={16}>
              <Input
                value={`${translate('contract_start_period')}: ${moment(selectedTender.contractStartDate).format('YYYY-MM-DD')} \t ${translate('contract_end_period')}: ${moment(selectedTender.contractEndDate).format('YYYY-MM-DD')}`}
                disabled={true} />
            </Col>
          </Row>

          {apiChecklist.id && <Row>
            <Col span={6}>
              {translate('checklist_author_name')}
            </Col>
            <Col span={16}>
              <Input value={apiChecklist.auditor.name} disabled={true} />
            </Col>
          </Row>}

          {apiChecklist.supervisor && <Row>
            <Col span={6}>
              {translate('checklist_supervisor_name')}
            </Col>
            <Col span={16}>
              <Input value={apiChecklist.supervisor.name} disabled={true} />
            </Col>
          </Row>}

          {!_.isEmpty(this.state.indicatorsByTenderId) && this.renderIndicatorsWorked()}
        </Form>
        <Row style={{ marginTop: 10 }}>
          <Col span={24} ref={this._amountTableRef} className="indicatorsHighlightTenderTable">
            <Table
              className={'amountTable'}
              key={this.state.kpiTableKey}
              bordered
              rowKey='id'
              size="small"
              pagination={false}
              columns={this.prepareAmountTableColumn()}
              // indentSize={150}
              dataSource={this.prepareAmountTableData()}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} ref={this._answersElementRef} className="answersHighlightCards">
            <BuyerInspectionForm
              selectedTemplateId={this.state.selectedTemplateId}
              templateByIdData={this.state.templateByIdData}
              selectedBuyer={this.state.selectedBuyer}
              selectedTender={this.state.selectedTender}
              defaultAnswered={this.state.defaultAnswered}
              getFieldDecorator={getFieldDecorator}
              onlyView={this.state.previewOnly}
              handleChangeChecklistQuestion={this.handleQuestionChange}
              handleChangeChecklistQuestionIndicators={this.handleChangeChecklistQuestionIndicators}
              handleValidateField={this.handleValidateFieldAnswers}
              answerErrors={this.state.answerErrors}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Col span={24}>
            {this.state.needToRecalculateScore && <Alert
              description={translate('checklist_buyer_or_question_change_message')}
              type="warning"
              showIcon
            />}

          </Col>
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Col span={24}>
            {this.state.noAnswersToCalculateScore && <Alert
              description={translate('checklist_question_selected_as_missing_message')}
              type="warning"
              showIcon
            />}

          </Col>
        </Row>
        <Row style={{ marginBottom: 15 }}>
          <Col span={12}>
            {translate('result_evaluation_automatic_scoring_without_critical_information')}
          </Col>
          <Col span={8}>
            <Select
              className={`risk-indicator-background-${calculatedScore.hasOwnProperty('id') && calculatedScore.id}`}
              labelInValue
              style={{ width: '100%' }}
              // onChange={(value, option) => this.onChangeChecklistScore(value, option)}
              // disabled={_.isEmpty(calculatedScore)}
              disabled={true}
              value={calculatedScore.hasOwnProperty('id') ? { key: calculatedScore.id } : { key: '' }}

            >
              {_.map(allMappings.checklistScores, (checklistScore) => (
                <Select.Option key={checklistScore.id}
                               value={checklistScore.id}>{checklistScore[checklistScoreKey]}</Select.Option>
              ))}

            </Select>
          </Col>
          <Col span={4}>
            {!this.state.previewOnly && <Button
              type="primary"
              htmlType="button"
              style={{ marginLeft: '15px' }}
              onClick={(e) => this.handleCalculatedScore(e)}
              disabled={this.state.noAnswersToCalculateScore}
            >{translate('checklist_calculate_score_button_name')}
            </Button>}
          </Col>
        </Row>
        <Row style={{ marginBottom: 15 }}>
          <Col span={24} ref={this._manualScoreElementRef} className="manualScoreElementRef">
            <Col span={12}>
              {translate('final_assessment_representative_SP_KP')}
            </Col>
            <Col span={8}>
              <Select
                disabled={this.state.previewOnly}
                className={`risk-indicator-background-${selectedChecklistScore.hasOwnProperty('id') && selectedChecklistScore.id}`}
                labelInValue
                style={{ width: '100%' }}
                value={selectedChecklistScore.hasOwnProperty('id') ? { key: selectedChecklistScore.id } : { key: '' }}
                onChange={(value, option) => this.onChangeChecklistScore(value, option)}
              >
                {_.map(allMappings.checklistScores, (checklistScore) => (
                  <Select.Option key={checklistScore.id}
                                 value={checklistScore.id}>{checklistScore[checklistScoreKey]}</Select.Option>
                ))}
              </Select>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>{translate('inspection_auditor_comment_name')}</strong>
          </Col>
        </Row>
        <Row>
          <Col span={24} ref={this._manualCommentElementRef} className="manualCommentEmentRef">
            <Form.Item>
              {getFieldDecorator('summary', {
                initialValue: summary && summary,
                // rules: [{ required: true, message: translate('not_empty_field') }],
              })(
                <Input.TextArea
                  disabled={this.state.previewOnly}
                  autoSize={{ minRows: 2, maxRows: 10 }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {!this.state.previewOnly &&
          <Col span={2}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleSaveInspection}
                disabled={this.state.notFoundTenderById}
              >
                {translate('save_button')}
              </Button>
            </Form.Item>
          </Col>
          }
          {!this.state.previewOnly && <Col span={2}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleSaveAndCompleteInspection}
                disabled={this.state.notFoundTenderById}
              >
                {translate('complete_and_calculate_button_name')}
              </Button>
            </Form.Item>
          </Col>}
          {this.state.previewOnly && isSupervisor() && apiChecklist.status.id === 2 && <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleApproveChecklist}
                disabled={this.state.notFoundTenderById}
              >
                {translate('approve_checklist')}
              </Button>
            </Form.Item>
          </Col>}
          {this.state.previewOnly && isSupervisor() && apiChecklist.status.id !== 1 && <Col span={3}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleCancelChecklist}
                disabled={this.state.notFoundTenderById}
              >
                {translate('cancel_checklist')}
              </Button>
            </Form.Item>
          </Col>}
        </Row>
      </div>
    )
  }

}

function mapStateToProps({
                           templatesStore,
                           checklistsStore,
                           prioritizationStore,
                           mappingsStore,
                           localizationStore,
                           auth: {
                             userInfo,
                           },
                         }) {
  return {
    templateByIdData: templatesStore.templateByIdData,
    saveAuditorTemplateErrorStatus: templatesStore.saveAuditorTemplateErrorStatus,
    checklistQuestionsData: checklistsStore.checklistQuestionsData,
    calculatedChecklistScoreData: checklistsStore.calculatedChecklistScoreData,
    apiChecklist: checklistsStore.checklistDataById,
    tenderDataForChecklist: checklistsStore.tenderDataForChecklist,
    tenderTableData: prioritizationStore.tenderTableData,
    tenderTableDataByBuyerId: prioritizationStore.tenderTableDataByBuyerId,
    indicatorsByTenderIdData: prioritizationStore.indicatorsByTenderIdData,
    saveTemplatesData: templatesStore.saveTemplatesData,
    templatesIsFetching: templatesStore.templatesIsFetching,
    templatesTypesData: templatesStore.templatesTypesData,
    saveAuditorTemplateData: templatesStore.saveAuditorTemplateData,
    allMappings: mappingsStore.allMappings,
    indicatorAnswersKey: localizationStore.indicatorAnswersKey,
    componentImpactsKey: localizationStore.componentImpactsKey,
    checklistScoreKey: localizationStore.checklistScoreKey,
    userInfo: userInfo,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplateById: bindActionCreators(fetchTemplateById, dispatch),
    getCategoriesOfTemplateById: bindActionCreators(getCategoriesOfTemplateById, dispatch),
    saveNewBuyerChecklist: bindActionCreators(saveNewBuyerChecklist, dispatch),
    updateChecklist: bindActionCreators(updateChecklist, dispatch),
    fetchPrioritizationTenderTableData: bindActionCreators(fetchPrioritizationTenderTableData, dispatch),
    fetchPrioritizationTenderTableDataByBuyerId: bindActionCreators(fetchPrioritizationTenderTableDataByBuyerId, dispatch),
    fetchIndicatorsDataByTenderId: bindActionCreators(fetchIndicatorsDataByTenderId, dispatch),
    getBuyersBySearch: bindActionCreators(getBuyersBySearch, dispatch),
    calculateChecklistScore: bindActionCreators(calculateChecklistScore, dispatch),
    ClearCalculatedChecklistScore: bindActionCreators(ClearCalculatedChecklistScore, dispatch),
    getChecklistsDataById: bindActionCreators(getChecklistsDataById, dispatch),
    saveNewTemplateFromDefault: bindActionCreators(saveNewTemplateFromDefault, dispatch),
    fetchPrioritizationTenderTableForChecklistData: bindActionCreators(fetchPrioritizationTenderTableForChecklistData, dispatch),
    changeChecklistQuestionsData: bindActionCreators(changeChecklistQuestionsData, dispatch),
    clearChecklistsDataById: bindActionCreators(clearChecklistsDataById, dispatch),
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create({ name: TENDER_INSPECTION_FORM_NAME })(withTranslate(TenderInspection))))
