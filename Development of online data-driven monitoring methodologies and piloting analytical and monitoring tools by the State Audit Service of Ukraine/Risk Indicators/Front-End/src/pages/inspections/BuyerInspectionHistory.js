import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {Col, Row, Table} from 'antd'
import _ from 'lodash'
import {
    clearAuditNamesSearch,
    deleteChecklistById,
    exportChecklistToPdf,
    getAllChecklistsData,
    getAuditNamesSearch,
    getAuditorNamesSearch,
} from '../../redux/action/checklists/ChecklistActions'
import {changeNavigationItem, setBreadCrumbsOptions} from '../../redux/action/navigation/NavigationActions'
import BuyerInspectionHistoryFilters from './components/BuyerInspectionHistoryFilters'
import InspectionActionsComponent from './components/InspectionActionsComponent'
import {CHECKLISTS_TABLE_COLUMNS} from './InspectionConstants'
import {Modal} from 'antd/lib/index'
import {isAdmin, isSupervisor} from '../../utils/Permissions'

class BuyerInspectionHistory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inspections: [],
            isVisibleConfirm: false,
            deleteChecklistData: null,
            filterRequestBody: {},
        }

        props.changeNavigationItem(props.menuKey.key)
        props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
        this.handleAuditNamesSearch = _.debounce(this.handleAuditNamesSearch, 400)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.loadChecklistsData()
        this.props.getAuditorNamesSearch()
    }

    loadChecklistsData = () => {
        this.props.getAllChecklistsData(this.state.filterRequestBody).then(() => {
            this.setState({
                inspections: this.prepareChecklistData(this.props.allChecklistsData),
            })
        })
    }

    handleExportChecklist = (checklist) => {
        const fileName = `${checklist.name}_${checklist.startDate}_${checklist.endDate}`
        this.props.exportChecklistToPdf({}, checklist.id, fileName, this.props.localeLang)
    }

    handleDeleteChecklist = (checklist) => {
        this.setState({
            isVisibleConfirm: true,
            deleteChecklistData: checklist,
        }, () => {
            this.renderDeleteUserConfirm()
        })

    }

    renderDeleteUserConfirm = () => {
        const {translate} = this.props
        const {isVisibleConfirm, deleteChecklistData} = this.state

        return Modal.confirm({
            visible: isVisibleConfirm,
            title: translate('confirm_delete'),
            content: `${translate('confirm_delete_checklist_message')} "${deleteChecklistData.name}"`,
            keyboard: false,
            maskClosable: false,
            okText: translate('delete_button'),
            cancelText: translate('cancel_button'),
            onOk: () => this.props.deleteChecklistById(deleteChecklistData.id).then(() => {
                this.loadChecklistsData()
            }),
            onCancel: () => this.handleCancelDelete(),
        })
    }

    handleCancelDelete = () => {
        this.setState({
            isVisibleConfirm: false,
            deleteChecklistData: null,
        })
    }

    prepareChecklistData = (allChecklistsData) => {
        const {userInfo} = this.props
        return _.map(allChecklistsData, (checklist) => {
            if (_.isEqual(checklist.auditor.email, userInfo.sub) || isAdmin() || isSupervisor()) {
                return _.merge({}, checklist, {
                    editButton: (
                        <InspectionActionsComponent
                            checklistData={checklist}
                            userInfo={userInfo}
                            handlePreviewTemplate={this.handlePreviewTemplate}
                            handleEditTemplate={this.handleEditTemplate}
                            handleExportTemplate={this.handleExportChecklist}
                            handleDeleteChecklist={this.handleDeleteChecklist}
                        />
                    ),
                })
            } else {
                return _.merge({}, checklist, {
                    editButton: null,
                })
            }
        })
    }

    handlePreviewTemplate = (checklistData) => {
        this.props.history.push({
            pathname: '/inspections/buyer/add',
            search: `?id=${checklistData.id}`,
            state: {
                checklistId: checklistData.id,
                templateType: checklistData.templateTypeId,
                previewOnly: true,
            },
        })
    }

    handleEditTemplate = (checklistData) => {
        this.props.history.push({
            pathname: '/inspections/buyer/add',
            search: `?id=${checklistData.id}`,
            state: {
                checklistId: checklistData.id,
                templateType: checklistData.templateTypeId,
            },
        })
    }


    reloadTableDataByFilter = (filterRequestBody) => {
        this.setState({
            filterRequestBody: filterRequestBody,
        }, () => {
            this.props.getAllChecklistsData(this.state.filterRequestBody).then(() => {
                this.setState({
                    inspections: this.prepareChecklistData(this.props.allChecklistsData),
                })
            })
        })
    }

    handleAuditNamesSearch = (value) => {
        if (value) {
            this.props.getAuditNamesSearch(value)
        }
    }

    handleSearchAuditorByName = (value) => {
        if (value) {
            this.props.getAuditorNamesSearch(value)
        }
    }

    handleChecklistStatusSelected = (value) => {
        let {filterRequestBody} = this.state

        if (!value) {
            filterRequestBody.hasOwnProperty('status') && (delete filterRequestBody.status)
        } else {
            if (!filterRequestBody.hasOwnProperty('status')) {
                filterRequestBody = _.merge({}, filterRequestBody, {
                    status: parseInt(value, 10),
                })
            } else {
                filterRequestBody.status = parseInt(value, 10)
            }
        }
        this.reloadTableDataByFilter(filterRequestBody)
    }

    handleTemplateTypeSelected = (value) => {
        let {filterRequestBody} = this.state

        if (!value) {
            filterRequestBody.hasOwnProperty('templateType') && (delete filterRequestBody.templateType)
        } else {
            if (!filterRequestBody.hasOwnProperty('templateType')) {
                filterRequestBody = _.merge({}, filterRequestBody, {
                    templateType: parseInt(value, 10),
                })
            } else {
                filterRequestBody.templateType = parseInt(value, 10)
            }
        }
        this.reloadTableDataByFilter(filterRequestBody)
    }

    handleSelectedAuditorByName = (value) => {
        let {filterRequestBody} = this.state

        if (_.isEmpty(value)) {
            this.props.getAuditorNamesSearch()
            filterRequestBody.hasOwnProperty('auditorIds') && (delete filterRequestBody.auditorIds)
        } else {
            if (!filterRequestBody.hasOwnProperty('auditorIds')) {
                filterRequestBody = _.merge({}, filterRequestBody, {
                    auditorIds: value.map((auditorId) => (parseInt(auditorId, 10))),
                })
            } else {
                filterRequestBody.auditorIds = value.map((auditorId) => (parseInt(auditorId, 10)))
            }
        }

        this.reloadTableDataByFilter(filterRequestBody)
    }


    handleSelectedChecklistEvent = (value) => {
        let {filterRequestBody} = this.state

        if (!value) {
            filterRequestBody.hasOwnProperty('eventId') && (delete filterRequestBody.eventId)
        } else {
            if (!filterRequestBody.hasOwnProperty('eventId')) {
                filterRequestBody = _.merge({}, filterRequestBody, {
                    eventId: parseInt(value, 10),
                })
            } else {
                filterRequestBody.eventId = parseInt(value, 10)
            }
        }
        this.reloadTableDataByFilter(filterRequestBody)
    }


    handleSelectedOffice = (value) => {
        let {filterRequestBody} = this.state

        if (!value) {
            filterRequestBody.hasOwnProperty('officeId') && (delete filterRequestBody.officeId)
        } else {
            if (!filterRequestBody.hasOwnProperty('officeId')) {
                filterRequestBody = _.merge({}, filterRequestBody, {
                    officeId: parseInt(value, 10),
                })
            } else {
                filterRequestBody.officeId = parseInt(value, 10)
            }
        }
        this.reloadTableDataByFilter(filterRequestBody)
    }


    handleSelectedAuditByName = (value) => {
        if (_.isEmpty(value)) {
            this.props.clearAuditNamesSearch()
        }

        let {filterRequestBody} = this.state
        if (!filterRequestBody.hasOwnProperty('ids')) {
            filterRequestBody = _.merge({}, filterRequestBody, {
                ids: _.map(value, (vl) => (parseInt(vl, 10))),
            })
        } else {
            filterRequestBody.ids = _.map(value, (vl) => (parseInt(vl, 10)))
        }

        this.reloadTableDataByFilter(filterRequestBody)
    }

    render() {
        const {
            translate,
            searchedAuditNamesData,
            allMappings: {checklistStatuses, checklistEvents, offices, templateTypes},
            searchedAuditorNamesData,
            checklistStatusesKey,
            templateTypesKey
        } = this.props
        let newColumns = _.cloneDeep(CHECKLISTS_TABLE_COLUMNS)
        _.forEach(newColumns, (column) => {
            if (column.dataIndex === 'manualScore.name') {
                column.render = (text, record) => ((record.status.id === 2) && text)
            }
            column.title = translate(column.translate_key)
        })

        return (
            <Row>
                <BuyerInspectionHistoryFilters
                    checklistStatuses={checklistStatuses}
                    checklistEvents={checklistEvents}
                    offices={offices}
                    auditSearchedNames={searchedAuditNamesData}
                    auditorSearchedNames={searchedAuditorNamesData}
                    checklistStatusesKey={checklistStatusesKey}
                    templateTypes={templateTypes}
                    templateTypesKey={templateTypesKey}
                    handleChecklistStatusSelected={this.handleChecklistStatusSelected}
                    handleSearchAuditorByName={this.handleSearchAuditorByName}
                    handleSelectedAuditorByName={this.handleSelectedAuditorByName}
                    handleSelectedChecklistEvent={this.handleSelectedChecklistEvent}
                    handleSelectedOffice={this.handleSelectedOffice}
                    handleTemplateTypeSelected={this.handleTemplateTypeSelected}
                />
                <Row style={{marginBottom: 15}}>
                    <Col span={24}>
                        <Table
                            rowKey="id"
                            dataSource={this.state.inspections}
                            columns={newColumns}
                            pagination={{pageSize: 10}}
                            indentSize={150}
                        />
                    </Col>
                </Row>
            </Row>
        )
    }

}

function mapStateToProps({
                             checklistsStore,
                             mappingsStore,
                             auth,
                             localizationStore,
                         }) {
    return {
        allChecklistsData: checklistsStore.allChecklistsData,
        searchedAuditorNamesData: checklistsStore.searchedAuditorNamesData,
        userInfo: auth.userInfo,
        searchedAuditNamesData: checklistsStore.searchedAuditNamesData,
        allMappings: mappingsStore.allMappings,
        checklistStatusesKey: localizationStore.checklistStatusesKey,
        templateTypesKey: localizationStore.templateTypesKey,
        localeLang: localizationStore.localeLang,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllChecklistsData: bindActionCreators(getAllChecklistsData, dispatch),
        changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
        exportChecklistToPdf: bindActionCreators(exportChecklistToPdf, dispatch),
        getAuditNamesSearch: bindActionCreators(getAuditNamesSearch, dispatch),
        clearAuditNamesSearch: bindActionCreators(clearAuditNamesSearch, dispatch),
        deleteChecklistById: bindActionCreators(deleteChecklistById, dispatch),
        setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
        getAuditorNamesSearch: bindActionCreators(getAuditorNamesSearch, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslate(BuyerInspectionHistory))
