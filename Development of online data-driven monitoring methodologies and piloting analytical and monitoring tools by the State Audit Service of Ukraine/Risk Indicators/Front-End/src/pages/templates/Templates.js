import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { Button, Icon, Row, Col, Table, Divider, Modal, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import { hasPermission } from '../../utils/Permissions'
import { PERMISSIONS } from '../../components/secutiry/PermissionConstants'
import _ from 'lodash'

import {
  fetchTemplates,
  saveNewTemplate,
  updateTemplatesStore,
  deleteTemplateById,
  getTemplateTypesAll,
  saveNewTemplateFromDefault,
} from '../../redux/action/templates/TemplatesActions'

import AddNewTemplateForm from './components/AddNewTemplateForm'
import {
  TEMPLATE_RADIO_BUTTONS_OPTIONS,
  TEMPLATES_TABLE_COLUMNS,
} from './TemplatesConstants'

import './Templates.css'
import AddNewTemplateFromDefaultForm from './components/AddNewTemplateFromDefaultForm'

class Templates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      templates: [],
      showAddNewTemplateForm: false,
      showAddNewTemplateFromDefaultForm: false,
      selectedDefaultTemplateData: null,
      templateRadioButtonsOptions: TEMPLATE_RADIO_BUTTONS_OPTIONS,
      selectedTemplateId: null,
      isVisibleConfirm: false,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadTemplates()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.templatesData, this.props.templatesData)) {
      this.setState({
        templates: this.props.templatesData,
      })
    }
  }

  loadTemplates = () => {
    this.props.fetchTemplates().then(() => {
      // let filteredTemplateRadioButtonsOptions = TEMPLATE_RADIO_BUTTONS_OPTIONS.filter(option => (!option.isDefault))
      this.props.getTemplateTypesAll()
      this.setState({
        templates: this.props.templatesData,
        // templateRadioButtonsOptions: filteredTemplateRadioButtonsOptions,
      })
    })
  }

  handleAgree = (templateId) => {
    this.props.deleteTemplateById(templateId).then(() => {
      this.setState({
        isVisibleConfirm: false,
      }, () => {
        this.loadTemplates()
        Modal.destroyAll()
      })
    })
  }

  handleCancelDelete = () => {
    this.setState({
      isVisibleConfirm: false,
    }, () => {
      Modal.destroyAll()
    })
  }

  renderConfirmModal = (templateId) => {
    const { isVisibleConfirm } = this.state
    const { translate } = this.props
    const selectedTemplateData = _.find(this.state.templates, { id: templateId })

    return Modal.confirm({
      visible: isVisibleConfirm,
      title: translate('confirm_delete'),
      content: `${translate('confirm_delete_template_message')} "${selectedTemplateData.name}"`,
      keyboard: false,
      maskClosable: false,
      okText: translate('delete_button'),
      cancelText: translate('cancel_button'),
      onOk: () => this.handleAgree(templateId),
      onCancel: () => this.handleCancelDelete(),
    })

  }

  handleDeleteTemplate = (templateId) => {
    this.setState({
      isVisibleConfirm: true,
    }, () => {
      this.renderConfirmModal(templateId)
    })
  }

  handleEditTemplate = (templateId, isDefault) => {
    if (isDefault) {
      this.props.history.push({
        pathname: '/templates/constructor',
        state: {
          templateId: templateId,
          onlyView: false,
        },
      })
    } else {
      this.props.history.push({
        pathname: '/templates/constructor/custom',
        state: {
          templateId: templateId,
          onlyView: false,
        },
      })
    }
  }

  handleAddNewTemplate = () => {
    this.setState({
      showAddNewTemplateForm: true,
    })
  }

  handleFormClickCancel = () => {
    this.setState({
      showAddNewTemplateForm: false,
    })
  }

  handleFormClickCancelCreateFromDefaultTemplate = () => {
    this.setState({
      showAddNewTemplateFromDefaultForm: false,
    })
  }

  handleFormClickCreate = (formInstance) => {
    formInstance.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.saveNewTemplate(values).then(() => {
        let oldTemplatesData = _.cloneDeep(this.props.templatesData)
        oldTemplatesData.push(this.props.saveTemplatesData)

        this.props.updateTemplatesStore(oldTemplatesData)

        formInstance.resetFields()
        this.setState({ showAddNewTemplateForm: false })
      })
    })
  }

  handleFormClickCreateFromDefaultTemplate = (formInstance) => {
    formInstance.validateFields((err, values) => {
      if (err) {
        return
      }

      values = _.merge({}, values, {
        baseTemplateId: this.state.selectedDefaultTemplateData.id,
      })

      this.props.saveNewTemplateFromDefault(values).then(() => {
        let oldTemplatesData = _.cloneDeep(this.props.templatesData)
        oldTemplatesData.push(this.props.saveAuditorTemplateData)
        this.props.updateTemplatesStore(oldTemplatesData)

        formInstance.resetFields()
        this.setState({ showAddNewTemplateFromDefaultForm: false })
      })
    })
  }

  renderTemplateActions = (templateId, isDefault) => {
    let permissionForDefaultTemplate = true
    if (isDefault) {
      permissionForDefaultTemplate = hasPermission(PERMISSIONS.adminBase)
    }

    return [
      permissionForDefaultTemplate && this.renderEditButton(templateId, isDefault),
      permissionForDefaultTemplate && this.renderDeleteButton(templateId),
    ]
  }

  // renderPreviewButton = () => {
  //   return (
  //     <Button icon='edit' onClick={() => this.handleEditTemplate(templateId)} key={`edit_button_${templateId}`} />
  //   )
  // }

  renderEditButton = (templateId, isDefault) => {
    const { translate } = this.props

    return (
      <Tooltip placement="top" title={translate('edit_button_name')} key={`edit_button_${templateId}`}>
        <Button icon='edit' onClick={() => this.handleEditTemplate(templateId, isDefault)}
        />
      </Tooltip>
    )
  }

  renderDeleteButton = (templateId) => {
    const { translate } = this.props

    return (
      <Tooltip placement="top" title={translate('delete_button')} key={`delete_button_${templateId}`}>
        <Button icon='delete' onClick={() => this.handleDeleteTemplate(templateId)}
        />
      </Tooltip>
    )
  }

  handleRowSelection = (record, index) => {
    // console.log('index', index)
    // console.log('record', record)
  }

  handleSelectCell = (templateId, isDefault) => {
    if (isDefault) {
      this.props.history.push({
        pathname: '/templates/constructor',
        state: {
          templateId: templateId,
          onlyView: true,
        },
      })
    } else {
      this.props.history.push({
        pathname: '/templates/constructor/custom',
        state: {
          templateId: templateId,
          onlyView: true,
        },
      })
    }
  }

  handleCreateChecklist = (templateId) => {
    const { templatesData } = this.props
    let selectedDefaultTemplateData = _.find(templatesData, { id: templateId })
    selectedDefaultTemplateData = _.merge({}, selectedDefaultTemplateData, {
      // typeName: _.find(templatesTypesData, { id: selectedDefaultTemplateData.typeId }).name,
      typeName: selectedDefaultTemplateData.type.name,
    })

    this.setState({
      showAddNewTemplateFromDefaultForm: true,
      selectedDefaultTemplateData: selectedDefaultTemplateData,
    })
  }

  handleStartInspection = (templateId, templateTypeId) => {
    this.props.history.push({
      pathname: '/inspections/buyer/add',
      state: {
        templateId: templateId,
        templateType: (templateTypeId === 1) ? 'buyer' : 'tender',
      },
    })
  }

  renderTableColumns = (isDefault) => {
    const { translate } = this.props

    let permissionForDefaultTemplate = true
    if (isDefault) {
      permissionForDefaultTemplate = hasPermission(PERMISSIONS.adminBase)
    }
    let templatesTableColumns = _.cloneDeep(TEMPLATES_TABLE_COLUMNS)
    return _.map(_.filter(templatesTableColumns, (column) => {
      if (column.dataIndex === 'createChecklist') {
        return !hasPermission(PERMISSIONS.adminBase)
      } else return !(!permissionForDefaultTemplate && (column.dataIndex === 'editButton'))

    }), (col) => {
      col.dataIndex === 'name' && (col.title = isDefault ? translate('template_default_checklist_name') : translate('template_auditor_checklist_name'))
      col.dataIndex === 'modifiedDate' && (col.title = translate('modified_date'))
      col.dataIndex === 'name' && (col.render = (text, record) => (
        <span><a onClick={() => this.handleSelectCell(record.id, isDefault)}>{record.name}</a></span>))
      col.dataIndex === 'typeName' && (col.title = translate('template_type'))
      if (isDefault && permissionForDefaultTemplate) {
        col.dataIndex === 'editButton' && (col.colSpan = 1)
        col.dataIndex === 'editButton' && (col.title = translate('template_actions'))
      } else {
        col.dataIndex === 'createChecklist' && (col.title = translate('template_actions'))
      }
      col.dataIndex === 'createChecklist' && (col.render = (text, record) => (
        <div className="template-action-button" key={`template_actions_${record.id}`}>
          <Button type="button" onClick={() => {
            this.handleSelectCell(record.id, isDefault)
          }}>{translate('preview_button_name')}</Button>
          {(hasPermission(PERMISSIONS.auditorBase) || hasPermission(PERMISSIONS.auditorInitiator)) &&
          <Button type="button" onClick={() => {
            this.handleStartInspection(record.id, record.type.id)
          }}>{translate('start_inspection')}</Button>}
        </div>
      ))
      return col
    })
  }

  renderTemplateTable = (isDefault = true) => {
    const { templatesData, translate } = this.props
    let tableData = []
    let counter = 1

    _.forEach(templatesData, (template) => {
      if (template.base === isDefault) {
        tableData.push(_.merge({}, template, {
          positionNumber: counter,
          editButton: this.renderTemplateActions(template.id, isDefault),
          typeName: template.type ? translate(template.type.name) : '',
        }))
        counter++
      }
    })

    return (
      <Row>
        <Col span={24}>
          <Divider>{isDefault ? translate('default_templates_table_header') : translate('user_templates_table_header')}</Divider>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey='id'
            size="small"
            pagination={{ pageSize: 5 }}
            indentSize={150}
            columns={this.renderTableColumns(isDefault)}
            dataSource={tableData}
            onRow={(record, index) => this.handleRowSelection(record, index)}
            // onChange={this.onChangeTable}
          />
        </Col>
      </Row>
    )
  }

  renderAddNewTemplateButton = () => {
    return (
      <Row>
        <Col span={24}>
          <Button
            shape="round"
            size="default"
            onClick={this.handleAddNewTemplate}
            style={{ float: 'right' }}
          >
            <Icon
              type="plus-circle"
              theme="outlined"
              style={{ fontSize: '14px', color: '#00d500' }}
            />
            {this.props.translate('create_new_template')}
          </Button>
        </Col>
      </Row>
    )
  }

  isAuditorPermission = () => {
    return hasPermission(PERMISSIONS.auditorBase) || hasPermission(PERMISSIONS.auditorInitiator)
  }

  render() {
    const { showAddNewTemplateForm } = this.state
    const { allMappings, templateTypesKey } = this.props
    return (
      <div className="TemplatesPage">
        <AddNewTemplateForm
          isVisible={showAddNewTemplateForm}
          onCancel={this.handleFormClickCancel}
          onCreate={this.handleFormClickCreate}
          // radioButtonsOptions={allMappings.templateTypes}
          templatesTypes={allMappings.templateTypes}
          templateTypesKey={templateTypesKey}
        />
        {this.state.selectedDefaultTemplateData && <AddNewTemplateFromDefaultForm
          isVisible={this.state.showAddNewTemplateFromDefaultForm}
          onCreate={this.handleFormClickCreateFromDefaultTemplate}
          onCancel={this.handleFormClickCancelCreateFromDefaultTemplate}
          defaultTemplateData={this.state.selectedDefaultTemplateData}
        />}
        {hasPermission(PERMISSIONS.adminBase) && this.renderAddNewTemplateButton()}
        {/*{!_.isEmpty(this.props.templatesData) && this.renderTemplateTable()}*/}
        {/*{!_.isEmpty(this.props.templatesData) && this.renderTemplateTable(false)}*/}
        {this.renderTemplateTable()}
        {this.isAuditorPermission() && this.renderTemplateTable(false)}
      </div>
    )
  }
}

function mapStateToProps({
                           templatesStore,
                           mappingsStore,
                           localizationStore,
                         }) {
  return {
    templatesData: templatesStore.templatesData,
    saveTemplatesData: templatesStore.saveTemplatesData,
    templatesIsFetching: templatesStore.templatesIsFetching,
    templatesTypesData: templatesStore.templatesTypesData,
    saveAuditorTemplateData: templatesStore.saveAuditorTemplateData,
    allMappings: mappingsStore.allMappings,
    templateTypesKey: localizationStore.templateTypesKey,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplates: bindActionCreators(fetchTemplates, dispatch),
    saveNewTemplate: bindActionCreators(saveNewTemplate, dispatch),
    deleteTemplateById: bindActionCreators(deleteTemplateById, dispatch),
    getTemplateTypesAll: bindActionCreators(getTemplateTypesAll, dispatch),
    updateTemplatesStore: bindActionCreators(updateTemplatesStore, dispatch),
    saveNewTemplateFromDefault: bindActionCreators(saveNewTemplateFromDefault, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(Templates))
