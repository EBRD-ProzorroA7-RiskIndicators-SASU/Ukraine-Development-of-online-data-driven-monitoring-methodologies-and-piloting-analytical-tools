import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {Button, Card, Col, Collapse, List, Modal, Row, Tooltip} from 'antd'
import _ from 'lodash'

import CategoryEditForm from './components/CategoryEditForm'
import QuestionEditForm from './components/QuestionEditForm'
import TemplateEditForm from './components/TemplateEditForm'
import QuestionCategoryDialog from '../QuestionCategoryDialog'
import QuestionDialog from '../QuestionDialog'
import {
    clearCategoriesOfTemplateById,
    clearCategoryResponse,
    clearQuestionResponse,
    deleteCategoryName,
    deleteQuestion,
    fetchBaseTemplateById,
    fetchTemplateById,
    getCategoriesOfTemplateById,
    getQuestionsOfCategoryById,
    getTemplateTypesAll,
    saveNewCategory,
    saveNewQuestion,
    updateCategoryName,
    updateQuestion,
    updateTemplateName,
} from '../../redux/action/templates/TemplatesActions'

class TemplateConstructor extends Component {
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
            isVisibleConfirm: false,
            confirmData: null,
            confirmOkAction: null,
            contentType: null,
            onlyView: true,
            createCategoryError: false,
            createQuestionError: false,
            openedCollapse: [],
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

        if (!this.props.history.location.state) {
            this.props.history.push('/')
        } else {
            const {templateId, onlyView} = this.props.history.location.state

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

    closeTemplateDrawer = () => this.setState({showTemplateDrawer: false})

    showCategoryDrawer = () => this.setState({showCategoryDrawer: true})
    closeCategoryDrawer = () => this.setState({showCategoryDrawer: false})

    showQuestionDrawer = () => this.setState({showQuestionDrawer: true})
    closeQuestionDrawer = () => this.setState({showQuestionDrawer: false})

    saveTemplate = (template) => {
        this.setState({templates: [...this.state.templates, template]})
        this.closeTemplateDrawer()
    }

    renderDeleteConfirmDialog = () => {
        const {isVisibleConfirm, confirmData, confirmOkAction, contentType} = this.state
        const {translate} = this.props

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

    saveCategory = (category) => {
        this.setState({
            createCategoryError: false,
        }, () => {
            category.templateId = this.state.selectedTemplate.id
            this.props.saveNewCategory(category).then(() => {
                if (!_.isEmpty(this.props.saveCategoryErrorMessage)) {
                    this.setState({
                        createCategoryError: true,
                    }, () => {
                        this.props.clearCategoryResponse()
                    })
                } else {
                    this.loadTemplates()
                    this.closeCategoryDrawer()
                }
            })
        })
    }

    addQuestionCategory = (template) => {
        this.setState({selectedTemplate: template})
        this.showCategoryDrawer()
    }

    addQuestion = (template) => {
        this.setState({selectedTemplate: template})
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
        const {categoriesByTemplateId} = this.props
        const {editableQuestionId, editableQuestionCategoryId} = this.state

        this.setState({
            createQuestionError: false,
        }, () => {
            let categoryDataById = _.find(categoriesByTemplateId, {id: editableQuestionCategoryId})
            let categoryWithoutEditQuestion = _.cloneDeep(categoryDataById.questions)
            let elementQuestionIndex = _.findIndex(categoryWithoutEditQuestion, {id: editableQuestionId})
            categoryWithoutEditQuestion.splice(elementQuestionIndex, 1)

            if (_.find(categoryWithoutEditQuestion, {number: values.number})) {
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
        const {editQuestionMode, editableQuestionId} = this.state
        const {translate} = this.props
        return (
            <List>
                {categoryData.questions && categoryData.questions.map((question, index) =>
                    <List.Item
                        key={question.id}
                        actions={[
                            <div>
                                {(!this.state.onlyView && !(editQuestionMode && (editableQuestionId === question.id))) &&
                                <Tooltip placement="top" title={translate('edit_button_name')}><Button
                                    icon='edit'
                                    style={{marginRight: 10}}
                                    onClick={e => this.handleEditQuestion(e, question, categoryData.id)}/></Tooltip>}
                                {(!this.state.onlyView && !(editQuestionMode && (editableQuestionId === question.id))) &&
                                <Tooltip placement="top" title={translate('delete_button')}><Button
                                    icon='delete'
                                    onClick={e => this.handleDeleteQuestion(question)}/></Tooltip>}
                            </div>,
                        ]}
                    >
                        {(editQuestionMode && (editableQuestionId === question.id)) ? this.renderQuestionForm(question) :
                            (<div style={{width: '92%'}}>
                                <span style={{float: 'left'}}><strong>{question.number}</strong></span>
                                <p style={{
                                    paddingLeft: 30,
                                    marginBottom: 0,
                                    wordBreak: 'break-word'
                                }}>{question.description}</p>
                            </div>)}
                    </List.Item>,
                )}
            </List>
        )
    }

    handleSaveNewCategoryName = (values) => {
        const {template, editableCategoryId} = this.state
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
                editableQuestionCategoryId: null,
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
            editableQuestionCategoryId: null,
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
            editableQuestionCategoryId: null,
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
        const {editCategoryMode, editableCategoryId} = this.state
        const {translate} = this.props

        if (editCategoryMode && (editableCategoryId === categoryData.id)) {
            return (
                <CategoryEditForm
                    defaultInputData={categoryData}
                    onSave={this.handleSaveNewCategoryName}
                    onCancel={this.handleCancelEdit}
                />
            )
        } else {
            return (
                <div>
                    <Row>
                        <Col span={22}>
                            <div>
                                <span style={{
                                    wordBreak: 'break-word',
                                    marginRight: 5
                                }}><strong>{categoryData.number}</strong></span>
                                <span style={{wordBreak: 'break-word'}}>{`${categoryData.name}`}</span>
                            </div>
                        </Col>
                        <Col span={2}>
                            {!this.state.onlyView && <Tooltip placement="top" title={translate('delete_button')}>
                                <Button
                                    icon='delete'
                                    onClick={e => this.handleDeleteCategory(categoryData)}
                                    key={`delete_button_${categoryData.id}`}
                                    style={{float: 'right', top: '-5px', right: '10px', marginLeft: '10px'}}
                                /></Tooltip>}
                            {!this.state.onlyView && <Tooltip placement="top" title={translate('edit_button_name')}>
                                <Button
                                    icon='edit'
                                    onClick={(event) => this.handleEditCategoryName(event, categoryData)}
                                    key={`edit_button_${categoryData.id}`}
                                    style={{float: 'right', top: '-5px', right: '10px'}}
                                /></Tooltip>}
                        </Col>
                    </Row>
                </div>
            )
        }

    }

    handleChangeCollapse = (key) => {
        if (!this.state.editableCategoryId) {
            this.setState({
                openedCollapse: key,
            })
        }
    }

    renderCollapseCategory = (categoryData) => {
        return (
            <Collapse
                activeKey={this.state.openedCollapse}
                onChange={this.handleChangeCollapse}
            >
                <Collapse.Panel
                    header={this.renderCategoryEditableHeader(categoryData)}
                    key={categoryData.id}

                >
                    {/*<p>{categoryData.name}</p>*/}
                    {this.renderQuestionList(categoryData)}
                </Collapse.Panel>
            </Collapse>
        )
    }

    handleEditTemplateName = (template) => {
        this.setState({
            editTemplateMode: true,
            editableTemplateId: template.id,
            editQuestionMode: false,
            editableQuestionId: null,
            editableQuestionCategoryId: null,
            editCategoryMode: false,
            editableCategoryId: null,
        })
    }

    handleCancelTemplateEdit = () => {
        this.setState({
            editTemplateMode: false,
            editableTemplateId: null,
            editQuestionMode: false,
            editableQuestionId: null,
            editableQuestionCategoryId: null,
            editCategoryMode: false,
            editableCategoryId: null,
        })
    }

    handleUpdateTemplate = (values) => {
        const {template} = this.state
        const {allMappings} = this.props

        values = _.merge({}, values, {
            id: template.id,
            type: _.find(allMappings.templateTypes, {id: values.typeId}),
            base: template.base,
        })

        delete values.typeId
        this.props.updateTemplateName(values).then(() => {
            this.setState({
                editCategoryMode: false,
                editableCategoryId: null,
                editQuestionMode: false,
                editableTemplateId: null,
                editTemplateMode: false,
                editTemplateTypeMode: false,
                editableQuestionId: null,
                editableQuestionCategoryId: null,
            }, () => {
                this.loadTemplates()
            })
        })
    }

    renderTemplateCard = () => {
        const {template, editableTemplateId, editTemplateMode} = this.state
        const {categoriesByTemplateId, allMappings, translate, templateTypesKey} = this.props

        let cardTitle = (
            <div>
                <p style={{whiteSpace: 'normal'}}>
                    {template.name}
                    {!this.state.onlyView && <Tooltip placement="top" title={translate('edit_button_name')}>
                        <Button key='1' icon='edit' style={{marginLeft: '10px'}}
                                onClick={() => this.handleEditTemplateName(template)}>{translate('change_template_name')}</Button>
                    </Tooltip>}
                </p>
                <p style={{fontSize: '14px'}}>
                    {translate(template.type.name)}
                </p>
            </div>
        )

        if (editTemplateMode && (editableTemplateId === template.id)) {
            cardTitle = (
                <TemplateEditForm
                    defaultTemplateValues={template}
                    onCancel={this.handleCancelTemplateEdit}
                    onSave={this.handleUpdateTemplate}
                    templatesTypes={allMappings.templateTypes}
                    templateTypesKey={templateTypesKey}
                />
            )
        }

        return (
            <Card
                style={{marginTop: '15px'}}
                key={template.id}
                title={cardTitle}
                extra=
                    {
                        <div className="extra-buttons">
                            <Row>
                                {!this.state.onlyView &&
                                <Col span={24}>
                                    <Button key='2' type='primary' icon='plus' style={{marginBottom: 5, float: 'right'}}
                                            onClick={() => this.addQuestionCategory(template)}>{translate('add_category_button_name')}</Button>
                                </Col>}
                                {!this.state.onlyView &&
                                <Col span={24}>
                                    <Button key='3' type='primary' icon='question' style={{float: 'right'}}
                                            onClick={() => this.addQuestion(template)}
                                            disabled={_.isEmpty(categoriesByTemplateId)}
                                    >{translate('add_question_button_name')}</Button>
                                </Col>}
                            </Row>
                        </div>
                    }
            >
                {categoriesByTemplateId.map(
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
            showCategoryDrawer,
            showQuestionDrawer,
            selectedTemplate,
            createCategoryError,
            createQuestionError,
        } = this.state

        return (
            <div>
                <Button icon='left'
                        onClick={e => this.props.history.push('/templates')}>{this.props.translate('back_button')}</Button>
                {!this.state.onlyView && <QuestionCategoryDialog
                    visible={showCategoryDrawer}
                    onClose={this.closeCategoryDrawer}
                    handleSave={this.saveCategory}
                    saveErrorStatus={createCategoryError}
                />}

                {!this.state.onlyView && <QuestionDialog
                    visible={showQuestionDrawer}
                    onClose={this.closeQuestionDrawer}
                    handleSave={this.saveQuestion}
                    template={selectedTemplate}
                    questionBaseStatus={true}
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
                             mappingsStore,
                             questionsStore,
                             localizationStore,
                         }) {
    return {
        templateByIdData: templatesStore.templateByIdData,
        baseTemplateByIdData: templatesStore.baseTemplateByIdData,
        templateByIdIsFetching: templatesStore.templateByIdIsFetching,
        categoriesByTemplateId: categoriesStore.categoriesByTemplateId,
        categoriesByBaseTemplateId: categoriesStore.categoriesByBaseTemplateId,
        saveCategoryErrorMessage: categoriesStore.saveCategoryErrorMessage,
        saveQuestionErrorMessage: questionsStore.saveQuestionErrorMessage,
        allMappings: mappingsStore.allMappings,
        templateTypesKey: localizationStore.templateTypesKey,
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
        saveNewCategory: bindActionCreators(saveNewCategory, dispatch),
        clearCategoryResponse: bindActionCreators(clearCategoryResponse, dispatch),
        clearQuestionResponse: bindActionCreators(clearQuestionResponse, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslate(TemplateConstructor))
