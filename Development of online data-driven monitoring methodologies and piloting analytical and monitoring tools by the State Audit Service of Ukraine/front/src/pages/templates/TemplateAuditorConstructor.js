import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Button, List, Card, Collapse, Tooltip, Modal } from 'antd'
import _ from 'lodash'

import CategoryEditForm from './components/CategoryEditForm'
import QuestionEditForm from './components/QuestionEditForm'
import QuestionDialog from '../QuestionDialog'
import {
  fetchTemplateById,
  getCategoriesOfTemplateById,
  updateCategoryName,
  getQuestionsOfCategoryById,
  saveNewQuestion,
  updateQuestion,
  updateTemplateName,
  deleteCategoryName,
  deleteQuestion,
  getTemplateTypesAll,
  fetchBaseTemplateById,
  clearCategoriesOfTemplateById,
  clearQuestionResponse,
} from '../../redux/action/templates/TemplatesActions'

class TemplateAuditorConstructor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showTemplateDrawer: false,
      showCategoryDrawer: false,
      showQuestionDrawer: false,
      template: {},
      selectedTemplate: null,
      editCategoryMode: false,
      editableCategoryId: null,
      editQuestionMode: false,
      editableTemplateId: null,
      editTemplateMode: false,
      editableQuestionId: null,
      editableQuestionCategoryId: null,
      isVisibleConfirm: false,
      confirmData: null,
      confirmOkAction: null,
      contentType: null,
      onlyView: true,
      createQuestionError: false,

    }
  }

  componentDidMount() {
    this.loadTemplates()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.templateByIdData, this.props.templateByIdData)) {
      this.setState({
        template: this.props.templateByIdData,
      })
    }
  }

  componentWillUnmount() {
    this.props.clearCategoriesOfTemplateById()
  }

  loadTemplates = () => {
    // axios.get(`/templates`)
    //   .then(response => {
    //     this.setState({
    //       templates: response.data.templates,
    //     })
    //   })
    if (!this.props.history.location.state) {
      this.props.history.push('/')
    } else {
      const { templateId, onlyView } = this.props.history.location.state
      this.props.fetchTemplateById(templateId).then(() => {
        if (_.isEmpty(this.props.templateByIdData)) {
          this.props.history.push({
            pathname: '/',
            state: {},
          })
        } else {
          this.props.getTemplateTypesAll()

          this.props.getCategoriesOfTemplateById(this.props.templateByIdData.id).then(() => {
            this.setState({
              template: this.props.templateByIdData,
              onlyView: onlyView,
            })
          })
        }
      })
    }
  }

  showTemplateDrawer = () => this.setState({ showTemplateDrawer: true })
  closeTemplateDrawer = () => this.setState({ showTemplateDrawer: false })

  showCategoryDrawer = () => this.setState({ showCategoryDrawer: true })
  closeCategoryDrawer = () => this.setState({ showCategoryDrawer: false })

  showQuestionDrawer = () => this.setState({ showQuestionDrawer: true })
  closeQuestionDrawer = () => this.setState({ showQuestionDrawer: false })

  saveTemplate = (template) => {
    this.setState({ templates: [...this.state.templates, template] })
    this.closeTemplateDrawer()
  }

  renderDeleteConfirmDialog = () => {
    const { isVisibleConfirm, confirmData, confirmOkAction, contentType } = this.state
    const { translate } = this.props

    let content = ''

    switch (contentType) {
      case 'question':
        content = `${translate('confirm_delete_question_message')} "${confirmData.description}"`
        break
      case 'category':
        content = `${translate('confirm_delete_category_message')} "${confirmData.name}"`
        break

      default:
        break
    }

    return Modal.confirm({
      visible: isVisibleConfirm,
      title: translate('confirm_delete'),
      content: content,
      keyboard: false,
      maskClosable: false,
      okText: translate('delete_button'),
      cancelText: translate('cancel_button'),
      onOk: () => confirmOkAction(confirmData.id).then(() => {
        this.loadTemplates()
      }),
      onCancel: () => this.handleCancelDelete(),
    })
  }

  handleCancelDelete = () => {
    this.setState({
      isVisibleConfirm: false,
    }, () => {
      Modal.destroyAll()
    })
  }

  addQuestion = (template) => {
    this.setState({ selectedTemplate: template })
    this.showQuestionDrawer()
  }

  saveQuestion = (question) => {
    this.setState({
      createQuestionError: false,
    }, () => {
      question = _.merge({}, question, {
        base: true,
      })

      this.props.saveNewQuestion(question).then(() => {
        if (!_.isEmpty(this.props.saveQuestionErrorMessage)) {
          this.setState({
            createQuestionError: true,
          }, () => {
            this.props.clearQuestionResponse()
          })
        } else {
          this.loadTemplates()
          this.closeQuestionDrawer()
        }
      })
    })
  }

  handleDeleteQuestion = (question) => {
    this.setState({
      isVisibleConfirm: true,
      confirmData: question,
      confirmOkAction: this.props.deleteQuestion,
      contentType: 'question',
    }, () => {
      this.renderDeleteConfirmDialog()
    })
  }

  // deleteQuestion = (questionId) => {
  //   axios.delete(`/templates/categories/questions/` + questionId)
  //     .then(() => {
  //       this.loadTemplates()
  //     })
  // }

  handleEditQuestion = (event, question, categoryId) => {
    event.stopPropagation()
    this.setState({
      editQuestionMode: true,
      editableQuestionId: question.id,
      editableQuestionCategoryId: categoryId,
      editCategoryMode: false,
      editableCategoryId: null,
      editableTemplateId: null,
      editTemplateMode: false,
    })
  }

  handleCancelQuestionEdit = (event) => {
    event.stopPropagation()
    this.setState({
      editQuestionMode: false,
      editableQuestionId: null,
      editableQuestionCategoryId: null,
      editCategoryMode: false,
      editableCategoryId: null,
      editableTemplateId: null,
      editTemplateMode: false,
    })
  }

  handleUpdateQuestion = (values) => {
    const { categoriesByTemplateId } = this.props
    const { editableQuestionId, editableQuestionCategoryId } = this.state

    this.setState({
      createQuestionError: false,
    }, () => {
      let categoryDataById = _.find(categoriesByTemplateId, { id: editableQuestionCategoryId })
      let categoryWithoutEditQuestion = _.cloneDeep(categoryDataById.questions)
      let elementQuestionIndex = _.findIndex(categoryWithoutEditQuestion, { id: editableQuestionId })
      categoryWithoutEditQuestion.splice(elementQuestionIndex, 1)

      if (_.find(categoryWithoutEditQuestion, { number: values.number })) {
        this.setState({
          createQuestionError: true,
        })
      } else {
        values = _.merge({}, values, {
          id: editableQuestionId,
        })

        this.props.updateQuestion(values).then(() => {
          this.setState({
            editQuestionMode: false,
            editableQuestionId: null,
            editableQuestionCategoryId: null,
            editCategoryMode: false,
            editableCategoryId: null,
            editableTemplateId: null,
            editTemplateMode: false,
          }, () => {
            this.loadTemplates()
          })
        })
      }
    })


  }

  renderQuestionForm = (question) => {
    return (
      <QuestionEditForm
        defaultInputValues={question}
        onSave={this.handleUpdateQuestion}
        onCancel={this.handleCancelQuestionEdit}
        saveErrorStatus={this.state.createQuestionError}
      />
    )
  }

  renderQuestionList = (categoryData) => {
    const { editQuestionMode, editableQuestionId } = this.state
    const { translate } = this.props
    return (
      <List>
        {categoryData.questions && categoryData.questions.map((question, index) =>
          <List.Item
            key={question.id}
            actions={[
              <div>
                {(!this.state.onlyView && !question.base && !(editQuestionMode && (editableQuestionId === question.id)))
                &&
                (<Tooltip placement="top" title={translate('edit_button_name')}>
                  <Button icon='edit'
                          style={{ marginRight: 10 }}
                          onClick={e => this.handleEditQuestion(e, question, categoryData.id)} />
                </Tooltip>)}
                {(!this.state.onlyView && !question.base && !(editQuestionMode && (editableQuestionId === question.id)))
                &&
                (<Tooltip placement="top" title={translate('delete_button')}>
                  <Button icon='delete'
                          onClick={e => this.handleDeleteQuestion(question)} />
                </Tooltip>)}
              </div>,
            ]}
          >
            {(editQuestionMode && (editableQuestionId === question.id)) ? this.renderQuestionForm(question) :
              (<div style={{ width: '92%' }}>
                <span style={{ float: 'left' }}><strong>{question.number}</strong></span>
                <p style={{ paddingLeft: 30, wordBreak: 'break-word' }}>{question.description}</p>
              </div>)}
          </List.Item>,
        )}
      </List>
    )
  }

  handleSaveNewCategoryName = (values) => {
    const { template, editableCategoryId } = this.state
    values = _.merge({}, values, {
      id: editableCategoryId,
      templateId: template.id,
    })

    this.props.updateCategoryName(values).then(() => {
      this.setState({
        editCategoryMode: false,
        editableCategoryId: null,
        editQuestionMode: false,
        editableTemplateId: null,
        editTemplateMode: false,
        editableQuestionId: null,
      }, () => {
        this.loadTemplates()
      })
    })
  }

  handleCancelEdit = (event) => {
    event.stopPropagation()
    this.setState({
      editCategoryMode: false,
      editableCategoryId: null,
      editQuestionMode: false,
      editableTemplateId: null,
      editTemplateMode: false,
      editableQuestionId: null,
    })
  }

  handleEditCategoryName = (event, categoryData) => {
    event.stopPropagation()
    this.setState({
      editCategoryMode: true,
      editableCategoryId: categoryData.id,
      editQuestionMode: false,
      editableTemplateId: null,
      editTemplateMode: false,
      editableQuestionId: null,
    })
  }

  handleDeleteCategory = (categoryData) => {
    this.setState({
      isVisibleConfirm: true,
      confirmData: categoryData,
      confirmOkAction: this.props.deleteCategoryName,
      contentType: 'category',
    }, () => {
      this.renderDeleteConfirmDialog()
    })
  }

  renderCategoryEditableHeader = (categoryData) => {
    const { editCategoryMode, editableCategoryId } = this.state

    if (editCategoryMode && (editableCategoryId === categoryData.id)) {
      return (
        <CategoryEditForm
          defaultInputValue={categoryData.name}
          onSave={this.handleSaveNewCategoryName}
          onCancel={this.handleCancelEdit}
        />
      )
    } else {
      return (
        <div>
          <span style={{ wordBreak: 'break-word', marginRight: 5 }}><strong>{categoryData.number}</strong></span>
          <span style={{ wordBreak: 'break-word' }}>{`${categoryData.name}`}</span>
        </div>
      )
    }

  }

  renderCollapseCategory = (categoryData) => {
    return (
      <Collapse accordion>
        <Collapse.Panel header={this.renderCategoryEditableHeader(categoryData)} key={categoryData.id}>
          {/*<p>{categoryData.name}</p>*/}
          {this.renderQuestionList(categoryData)}
        </Collapse.Panel>
      </Collapse>
    )
  }

  prepareCategoriesAndQuestion = () => {
    const {
      categoriesByTemplateId,
      categoriesByBaseTemplateId,
    } = this.props

    let baseCategories = _.chain(_.cloneDeep(categoriesByBaseTemplateId))
      .groupBy('id')
      .map((values, key) => {
        values[0].questions = _.map(values[0].questions, (question) => {
          return question
          // return _.merge({}, question, {
          //   base: true,
          // })
        })

        return values[0]
      })
      .value()

    let categories = _.chain(_.cloneDeep(categoriesByTemplateId))
      .groupBy('id')
      .map((values, key) => {
        values[0].questions = _.map(values[0].questions, (question) => {
          return _.merge({}, question, {
            base: false,
          })
        })
        return values[0]
      })
      .value()

    return _.concat([], baseCategories, categories)
  }

  renderTemplateCard = () => {
    const { template } = this.state
    const { translate, categoriesByTemplateId } = this.props

    let cardTitle = (
      <div>
        <p>
          {template.name}
        </p>
        <p style={{ fontSize: '14px' }}>
          {translate(template.type.name)}
        </p>
      </div>
    )

    let preparedCategories = this.prepareCategoriesAndQuestion()

    return (
      <Card
        style={{ marginTop: '15px' }}
        key={template.id}
        title={cardTitle}
        extra=
          {
            <div>
              {!this.state.onlyView &&
              <Button key='3' type='primary' icon='question'
                      onClick={() => this.addQuestion(template)}
                      disabled={_.isEmpty(categoriesByTemplateId)}
              >
                {translate('add_question_button_name')}
              </Button>}
            </div>
          }
      >
        {preparedCategories.map(
          category => {
            return (
              <div key={category.id}>
                {this.renderCollapseCategory(category)}

              </div>
            )
          },
        )
        }
      </Card>
    )
  }

  render() {
    if (_.isEmpty(this.state.template)) {
      return null
    }

    const {
      showQuestionDrawer,
      selectedTemplate,
      createQuestionError,
    } = this.state

    return (
      <div>
        <Button icon='left' onClick={e => this.props.history.push('/templates')}>{this.props.translate('back_button')}</Button>
        {!this.state.onlyView && <QuestionDialog
          visible={showQuestionDrawer}
          onClose={this.closeQuestionDrawer}
          handleSave={this.saveQuestion}
          template={selectedTemplate}
          useBaseTemplateData={true}
          questionBaseStatus={false}
          saveErrorStatus={createQuestionError}
        />}
        {this.renderTemplateCard()}
      </div>
    )
  }
}


function mapStateToProps({
                           templatesStore,
                           categoriesStore,
                           questionsStore,
                         }) {
  return {
    templateByIdData: templatesStore.templateByIdData,
    baseTemplateByIdData: templatesStore.baseTemplateByIdData,
    templateByIdIsFetching: templatesStore.templateByIdIsFetching,
    categoriesByTemplateId: categoriesStore.categoriesByTemplateId,
    categoriesByBaseTemplateId: categoriesStore.categoriesByBaseTemplateId,
    saveQuestionErrorMessage: questionsStore.saveQuestionErrorMessage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplateById: bindActionCreators(fetchTemplateById, dispatch),
    fetchBaseTemplateById: bindActionCreators(fetchBaseTemplateById, dispatch),
    getCategoriesOfTemplateById: bindActionCreators(getCategoriesOfTemplateById, dispatch),
    clearCategoriesOfTemplateById: bindActionCreators(clearCategoriesOfTemplateById, dispatch),
    getQuestionsOfCategoryById: bindActionCreators(getQuestionsOfCategoryById, dispatch),
    updateCategoryName: bindActionCreators(updateCategoryName, dispatch),
    saveNewQuestion: bindActionCreators(saveNewQuestion, dispatch),
    updateQuestion: bindActionCreators(updateQuestion, dispatch),
    updateTemplateName: bindActionCreators(updateTemplateName, dispatch),
    deleteCategoryName: bindActionCreators(deleteCategoryName, dispatch),
    deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
    getTemplateTypesAll: bindActionCreators(getTemplateTypesAll, dispatch),
    clearQuestionResponse: bindActionCreators(clearQuestionResponse, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(TemplateAuditorConstructor))
