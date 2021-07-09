import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { fetchTemplates } from '../../redux/action/templates/TemplatesActions'
import { hasPermission } from '../../utils/Permissions'
import { PERMISSIONS } from '../../components/secutiry/PermissionConstants'
import {
  fetchPrioritizationTenderTableData,
  exportTendersToExcel,
  exportTendersToPDF,
  fetchDashboardTenderInfo,
  fetchTenderRiskTendersAmountInfoByMethod,
  fetchTenderRiskTendersCountInfoByMethod,
  fetchTenderTopRiskTendersByAmount,
  fetchTenderTopOkgzByRiskTendersCount,
  fetchTenderTopTendersByIndicatorCount,
  fetchTenderMethodIndicatorAmount,
  fetchTenderMethodIndicatorCount,
  fetchAvailableIndicatorsForTenderFilter,
  setRequestParamsByFilter,
} from '../../redux/action/prioritization/PrioritizationActions'
import { getChecklistsDataById } from '../../redux/action/checklists/ChecklistActions'
import { getAuditorNamesSearch } from '../../redux/action/checklists/ChecklistActions'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import { getBuyersBySearch, clearBuyersBySearch } from '../../redux/action/buyer/BuyerActions'
import { getCpvBySearch, clearCpvBySearch } from '../../redux/action/tender/TenderActions'
import { Row, Col, Divider, Empty, ConfigProvider } from 'antd'
import PrioritizationBaseTable from './components/PrioritizationBaseTable'
import TendersFilters from './components/TendersFilters'
import ExportButton from './components/ExportButton'
import PrioritizationActionsComponent from './components/PrioritizationActionsComponent'
import PrioritizationTemplatesModal from './components/PrioritizationTemplatesModal'
import { toISOFormat } from '../../utils/DateUtils'
import {
  PRIORITIZATION_TENDER_TABLE_COLUMNS,
  PRIORITIZATION_TENDER_TABLE_COLUMNS_FOR_EXPORT,
  TENDER_STATUS_CARD_OPTIONS,
} from './PrioritizationConstants'

import './PrioritizationPage.css'
import moment from 'moment/moment'
import StatusCard from '../../components/statusCard/StatusCard'

const MAX_POSTGRE_INT_VALUE = 2147483647

class PrioritizationTender extends Component {
  constructor(props) {
    super(props)

    let filterRequestBody = {}
    if (!_.isEmpty(props.filterRequestBody)) {
      filterRequestBody = props.filterRequestBody
    } else {
      filterRequestBody = {
        contractStartDate: toISOFormat(moment().subtract(2, 'year').format('MM/DD/YYYY')),
        contractEndDate: toISOFormat(moment().format('MM/DD/YYYY')),
      }
    }

    this.state = {
      filterRequestBody: filterRequestBody,
      tableSortingOptions: [],
      filteredOKGZ: props.allMappings.okgz,
      selectedExportIds: [],
      showSelectTemplateModal: false,
      defaultTendersTemplates: [],
      userTendersTemplates: [],
      selectedTenderData: null,
      resetSelectedRows: false,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
    this.handleSearchBuyers = _.debounce(this.handleSearchBuyers, 400)
    this.handleSearchOKGZ = _.debounce(this.handleSearchOKGZ, 200)
    this.handleChangeSumFrom = _.debounce(this.handleChangeSumFrom, 800)
    this.handleChangeSumTo = _.debounce(this.handleChangeSumTo, 800)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadTenderTableData()
    this.handleSearchBuyers('а')
    this.props.getAuditorNamesSearch()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.tenderTableData, this.props.tenderTableData)) {
      this.setState({
        tenderTableData: this.props.tenderTableData,
      })
    }
  }

  componentWillUnmount() {
    this.props.clearBuyersBySearch()
    this.props.clearCpvBySearch()
  }

  loadTenderTableData = () => {
    // this.props.fetchAvailableIndicatorsForTenderFilter(this.state.filterRequestBody)
    this.props.fetchPrioritizationTenderTableData(this.state.filterRequestBody)
    this.props.fetchDashboardTenderInfo(this.state.filterRequestBody)
    // this.props.fetchBuyerTopByRiskTendersCount(this.state.filterRequestBody)
    // this.props.fetchTenderRiskTendersCountInfoByMethod(this.state.filterRequestBody)
    // this.props.fetchTenderTopRiskTendersByAmount(this.state.filterRequestBody)
    // this.props.fetchTenderTopOkgzByRiskTendersCount(this.state.filterRequestBody)
    // this.props.fetchTenderTopTendersByIndicatorCount(this.state.filterRequestBody)
    // this.props.fetchTenderMethodIndicatorAmount(this.state.filterRequestBody)
    // this.props.fetchTenderMethodIndicatorCount(this.state.filterRequestBody)
  }

  reloadTableDataByFilter = (filterRequestBody, ifIndicatorChange = false) => {
    !ifIndicatorChange && (delete filterRequestBody.indicators)

    this.setState({
      filterRequestBody: filterRequestBody,
      selectedExportIds: [],
      resetSelectedRows: true,
    }, () => {
      // this.props.fetchAvailableIndicatorsForTenderFilter(filterRequestBody)
      this.props.setRequestParamsByFilter(filterRequestBody)
      // this.props.fetchAvailableIndicatorsForTenderFilter(filterRequestBody)
      this.props.fetchPrioritizationTenderTableData(filterRequestBody)
      this.props.fetchDashboardTenderInfo(filterRequestBody)
      // this.props.fetchBuyerTopByRiskTendersCount(filterRequestBody)
      // this.props.fetchTenderRiskTendersCountInfoByMethod(filterRequestBody)
      // this.props.fetchTenderTopRiskTendersByAmount(filterRequestBody)
      // this.props.fetchTenderTopOkgzByRiskTendersCount(filterRequestBody)
      // this.props.fetchTenderTopTendersByIndicatorCount(filterRequestBody)
      // this.props.fetchTenderMethodIndicatorAmount(filterRequestBody)
      // this.props.fetchTenderMethodIndicatorCount(filterRequestBody)
    })
  }


  handleSearchBuyers = (value) => {
    if (value) {
      this.props.getBuyersBySearch(value)
    }
  }

  handleSearchOKGZ = (value) => {
    const { allMappings: { okgz }, okgzKey } = this.props
    let reqExpValue = new RegExp(value, 'i')
    let filteredOKGZ = _.filter(okgz, (okgzItem) => (reqExpValue.test(okgzItem.code) || reqExpValue.test(okgzItem.originalCode) || reqExpValue.test(okgzItem[okgzKey])))

    this.setState({
      filteredOKGZ: filteredOKGZ,
    })
  }

  handleMethodSelected = (value) => {
    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('procurementMethodDetails')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        procurementMethodDetails: value,
      })
    } else {
      filterRequestBody.procurementMethodDetails = value
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleStartDateSelected = (date, dateString) => {
    let { filterRequestBody } = this.state
    if (dateString) {
      if (!filterRequestBody.hasOwnProperty('contractStartDate')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          contractStartDate: toISOFormat(dateString),
        })
      } else {
        filterRequestBody.contractStartDate = toISOFormat(dateString)
      }
    } else {
      filterRequestBody.hasOwnProperty('contractStartDate') && (delete filterRequestBody.contractStartDate)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleEndDateSelected = (date, dateString) => {
    let { filterRequestBody } = this.state
    if (dateString) {
      if (!filterRequestBody.hasOwnProperty('contractEndDate')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          contractEndDate: toISOFormat(dateString),
        })
      } else {
        filterRequestBody.contractEndDate = toISOFormat(dateString)
      }
    } else {
      filterRequestBody.hasOwnProperty('contractEndDate') && (delete filterRequestBody.contractEndDate)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleIndicatorSelected = (value) => {
    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('indicators')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        indicators: _.map(value, (vl) => (parseInt(vl, 10))),
      })
    } else {
      filterRequestBody.indicators = _.map(value, (vl) => (parseInt(vl, 10)))
    }

    this.reloadTableDataByFilter(filterRequestBody, true)
  }


  handleSelectedBuyer = (value) => {
    // if (!value) {
    //   this.props.clearBuyersBySearch()
    // }

    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('buyerIds')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        buyerIds: _.map(value, (vl) => (parseInt(vl, 10))),
      })
    } else {
      filterRequestBody.buyerIds = _.map(value, (vl) => (parseInt(vl, 10)))
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleSelectedOKGZ = (value) => {
    const { okgz } = this.props.allMappings
    if (_.isEmpty(value)) {
      this.props.clearCpvBySearch()
    }

    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('cpv')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        cpv: value,
      })
    } else {
      filterRequestBody.cpv = value
    }

    this.setState({
      filteredOKGZ: okgz,
    }, () => {
      this.reloadTableDataByFilter(filterRequestBody)
    })
  }

  handleChangeSumFrom = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('completedLotValueMin')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          completedLotValueMin: _.toNumber(value),
        })
      } else {
        filterRequestBody.completedLotValueMin = _.toNumber(value)
      }
    } else {
      filterRequestBody.hasOwnProperty('completedLotValueMin') && (delete filterRequestBody.completedLotValueMin)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleChangeSumTo = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('completedLotValueMax')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          completedLotValueMax: _.toNumber(value),
        })
      } else {
        filterRequestBody.completedLotValueMax = _.toNumber(value)
      }
    } else {
      filterRequestBody.hasOwnProperty('completedLotValueMax') && (delete filterRequestBody.completedLotValueMax)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleRiskLevelSelected = (value) => {
    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('riskLevel')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        riskLevel: _.map(value, (vl) => (parseInt(vl, 10))),
      })
    } else {
      filterRequestBody.riskLevel = _.map(value, (vl) => (parseInt(vl, 10)))
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleChecklistStatusSelected = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('checklistStatus')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          checklistStatus: parseInt(value, 10),
        })
      } else {
        filterRequestBody.checklistStatus = parseInt(value, 10)
      }
    } else {
      filterRequestBody.hasOwnProperty('checklistStatus') && (delete filterRequestBody.checklistStatus)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleChecklistTemplateTypeSelected = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('templateType')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          templateType: parseInt(value, 10),
        })
      } else {
        filterRequestBody.templateType = parseInt(value, 10)
      }
    } else {
      filterRequestBody.hasOwnProperty('templateType') && (delete filterRequestBody.templateType)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleChecklistFilterStatusSelected = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('checklistType')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          checklistType: parseInt(value, 10),
        })
      } else {
        filterRequestBody.checklistType = parseInt(value, 10)
      }
    } else {
      filterRequestBody.hasOwnProperty('checklistType') && (delete filterRequestBody.checklistType)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleIndicatorStatusesSelected = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('indicatorStatus')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          indicatorStatus: parseInt(value, 10),
        })
      } else {
        filterRequestBody.indicatorStatus = parseInt(value, 10)
      }
    } else {
      filterRequestBody.hasOwnProperty('indicatorStatus') && (delete filterRequestBody.indicatorStatus)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleChecklistAuthorSelected = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('myChecklist')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          myChecklist: Boolean(value),
        })
      } else {
        filterRequestBody.myChecklist = Boolean(value)
      }
    } else {
      filterRequestBody.hasOwnProperty('myChecklist') && (delete filterRequestBody.myChecklist)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleSearchBuCompetitionId = (value) => {
    let { filterRequestBody } = this.state
    if (value) {
      if (!filterRequestBody.hasOwnProperty('tenderNumber')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          // tenderNumber: _.toNumber(value),
          tenderNumber: value,
        })
      } else {
        // filterRequestBody.tenderNumber = _.toNumber(value)
        filterRequestBody.tenderNumber = value
      }
    } else {
      filterRequestBody.hasOwnProperty('tenderNumber') && (delete filterRequestBody.tenderNumber)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleSelectedAuditorByName = (value) => {
    let { filterRequestBody } = this.state

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

  prepareTenderIdNumber = (value, currentTenderId) => {
    if (!_.isNaN(_.toNumber(value))) {
      if (_.toNumber(value) <= MAX_POSTGRE_INT_VALUE) {
        return _.toNumber(value)
      } else {
        return _.toNumber(value.slice(0, value.length - 1))
      }
    } else {
      if (currentTenderId) {
        return currentTenderId
      } else {
        return ''
      }
    }
  }

  handleChangeTenderId = (event) => {
    let { filterRequestBody } = this.state

    if (event.target.value) {
      if (!filterRequestBody.hasOwnProperty('tenderNumber')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          // tenderId: _.toNumber(event.target.value),
          // tenderNumber: this.prepareTenderIdNumber(event.target.value),
          tenderNumber: event.target.value,
        })
      } else {
        // filterRequestBody.tenderId = _.toNumber(event.target.value)
        // filterRequestBody.tenderNumber = this.prepareTenderIdNumber(event.target.value, filterRequestBody.tenderNumber)
        filterRequestBody.tenderNumber = event.target.value
      }
    } else {
      if (filterRequestBody.hasOwnProperty('tenderNumber')) {
        delete filterRequestBody.tenderNumber
      }
    }

    this.setState({
      filterRequestBody: filterRequestBody,
    })

  }

  handleHeaderCellClick = (columnData) => {
    let { tableSortingOptions, filterRequestBody } = this.state
    let existObjectIndex = _.findIndex(tableSortingOptions, { field: columnData.dataIndex })
    if (existObjectIndex === -1) {
      tableSortingOptions.push({
        field: columnData.dataIndex,
        type: 'ASC',
      })
    } else {
      if (tableSortingOptions[existObjectIndex].type === 'ASC') {
        tableSortingOptions[existObjectIndex].type = 'DESC'
      } else if (tableSortingOptions[existObjectIndex].type === 'DESC') {
        tableSortingOptions.splice(existObjectIndex, 1)
      }
    }

    if (filterRequestBody.hasOwnProperty('sortingOptions')) {
      filterRequestBody.sortingOptions = tableSortingOptions
    } else {
      filterRequestBody = _.merge({}, filterRequestBody, {
        sortingOptions: tableSortingOptions,
      })
    }

    this.setState({
      tableSortingOptions: tableSortingOptions,
    }, () => {
      this.reloadTableDataByFilter(filterRequestBody)
    })
  }

  handleDownloadButtonClicked = (type, selectedFields, fileName) => {
    const { filterRequestBody, selectedExportIds } = this.state

    let selectedColumns = _.map(selectedFields, (field) => ({
      name: field.value,
      translate: field.label,
    }))

    let requestParams = _.merge({}, filterRequestBody, {
      columns: selectedColumns,
      // documentType: type,
      selectedExportIds: selectedExportIds,
    })

    switch (type) {
      case 'xls':
        this.props.exportTendersToExcel(requestParams, fileName)
        break
      case 'pdf':
        this.props.exportTendersToPDF(requestParams, fileName)
        break

      default:
        this.props.exportTendersToExcel(requestParams, fileName)
    }
  }

  handleSelectItemsToExport = (selectedIds) => {
    this.setState({
      selectedExportIds: selectedIds,
    })
  }

  handleStartAudit = (tenderData) => {
    const { templatesData, userInfo } = this.props
    let defaultTendersTemplates = []
    let userTendersTemplates = []

    if (_.isEmpty(templatesData)) {
      if (tenderData.checklistId && (parseInt(userInfo.jti, 10) === parseInt(tenderData.auditorId, 10))) {
        Promise.resolve(this.props.getChecklistsDataById(tenderData.checklistId)).then(() => {
          if (tenderData.checklistStatus === 1) {
            this.props.history.push({
              pathname: '/inspections/buyer/add',
              state: {
                templateType: this.props.checklistDataById.templateTypeId,
                checklistId: tenderData.checklistId,
              },
            })
          } else {
            this.props.history.push({
              pathname: '/inspections/buyer/add',
              state: {
                templateType: this.props.checklistDataById.templateTypeId,
                previewOnly: true,
                checklistId: tenderData.checklistId,
              },
            })
          }
        })
      } else {
        this.props.fetchTemplates().then(() => {

          console.log('Filtered tempaltes')
          console.log(this.props.templatesData)

          console.log('Tender data ')
          console.log(tenderData)

          _.chain(_.cloneDeep(this.props.templatesData))
            .groupBy('base')
            .map((values, key) => {
              if (key === 'true') {

                defaultTendersTemplates = _.filter(values, (value) => ((_.includes(value.type.procurementMethods, tenderData.procurementMethodType))))
              } else {
                userTendersTemplates = _.filter(values, (value) => ((value.type.id !== 1) && (_.includes(value.type.procurementMethods, tenderData.procurementMethodDetails))))
              }
              return false
            })
            .value()

          this.setState({
            showSelectTemplateModal: true,
            defaultTendersTemplates: defaultTendersTemplates,
            userTendersTemplates: userTendersTemplates,
            selectedTenderData: tenderData,
          })
        })
      }
    } else {
      if (tenderData.checklistId && (parseInt(userInfo.jti, 10) === parseInt(tenderData.auditorId, 10))) {
        if (tenderData.checklistStatus === 1) {
          this.props.history.push({
            pathname: '/inspections/buyer/add',
            state: {
              templateType: 'tender',
              checklistId: tenderData.checklistId,
            },
          })
        } else {
          this.props.history.push({
            pathname: '/inspections/buyer/add',
            state: {
              templateType: 'tender',
              previewOnly: true,
              checklistId: tenderData.checklistId,
            },
          })
        }
      } else {
        _.chain(_.cloneDeep(templatesData))
          .groupBy('base')
          .map((values, key) => {
            if (key === 'true') {

              defaultTendersTemplates = _.filter(values, (value) => ((_.includes(value.type.procurementMethods, tenderData.procurementMethodType))))
            } else {
              userTendersTemplates = _.filter(values, (value) => ((value.type.id !== 1) && (_.includes(value.type.procurementMethods, tenderData.procurementMethodDetails))))
            }
            return false
          })
          .value()

        this.setState({
          showSelectTemplateModal: true,
          defaultTendersTemplates: defaultTendersTemplates,
          userTendersTemplates: userTendersTemplates,
          selectedTenderData: tenderData,
        })
      }
    }
  }

  prepareTendersTableColumns = () => {
    let defaultColumns = _.cloneDeep(PRIORITIZATION_TENDER_TABLE_COLUMNS)
    if (hasPermission(PERMISSIONS.auditorBase) || hasPermission(PERMISSIONS.supervisor)) {
      defaultColumns.push({
        dataIndex: 'startInspection',
        align: 'center',
        translateKey: 'template_actions',
        width: 150,
        sorter: false,
        customSort: false,
        className: 'header-text-align-center ant-table-column-has-actions ant-table-column-has-sorters',
      })
    }
    return defaultColumns
  }

  prepareTendersTableData = () => {
    const { tenderTableData } = this.props

    return _.map(tenderTableData, (tenderData) => {
      return _.merge({}, tenderData, {
        startInspection: (
          <PrioritizationActionsComponent
            prioritizationData={tenderData}
            isTenderAction={true}
            userInfo={this.props.userInfo}
            handleStartAudit={this.handleStartAudit}
          />
        ),
      })
    })
  }

  handleCloseSelectTemplateModal = () => {
    this.setState({
      showSelectTemplateModal: false,
    })
  }

  handleGoToInspection = (selectedTemplate) => {
    this.props.history.push({
      pathname: '/inspections/buyer/add',
      state: {
        templateId: selectedTemplate ? selectedTemplate.id : null,
        templateType: selectedTemplate.type.id,
        selectedBuyerIdentifierId: this.state.selectedTenderData.identifierId,
        selectedTenderData: this.state.selectedTenderData,
      },
    })
  }

  handleResetAllFilters = () => {
    this.setState({
      tableSortingOptions: [],
    }, () => {
      this.reloadTableDataByFilter({
        contractStartDate: toISOFormat(moment().subtract(2, 'year').format('MM/DD/YYYY')),
        contractEndDate: toISOFormat(moment().format('MM/DD/YYYY')),
      })
    })
  }

  renderEmptyComponent = () => {
    const { translate } = this.props
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('empty_table_data_name')} />
    )
  }

  handleAfterReset = () => {
    this.setState({
      resetSelectedRows: false,
    })
  }

  callback = (key) => {
    console.log(key)
  }

  handleSearchAuditorByName = (value) => {
    if (value) {
      this.props.getAuditorNamesSearch(value)
    }
  }

  render() {
    const {
      translate,
      allMappings,
      buyersBySearch,
      availableIndicatorsForTenderFilter,
      tenderTableIsFetching,
      searchedAuditorNamesData,
    } = this.props

    return (
      <Row className="PrioritizationPage">
        <PrioritizationTemplatesModal
          visible={this.state.showSelectTemplateModal}
          defaultTemplates={this.state.defaultTendersTemplates}
          userTemplates={this.state.userTendersTemplates}
          onClose={this.handleCloseSelectTemplateModal}
          handleGoToInspection={this.handleGoToInspection}
        />
        <Col span={24}>
          <TendersFilters
            methodsData={allMappings.procurementMethodDetails}
            // indicatorsData={allMappings.indicators}
            indicatorsData={availableIndicatorsForTenderFilter.map((indicatorId) => {
              return _.find(allMappings.indicators, { id: indicatorId })
            })}
            buyersData={buyersBySearch}
            // OKGZData={cpvBySearch}
            OKGZData={this.state.filteredOKGZ}
            checklistStatuses={allMappings.checklistStatuses}
            dashboardTenderChecklistFilter={allMappings.dashboardTenderChecklistFilter}
            // riskLevels={allMappings.riskLevels}
            indicatorStatuses={allMappings.indicatorStatuses}
            auditorSearchedNames={searchedAuditorNamesData}
            allSelectedData={this.state.filterRequestBody}
            procurementMethodDetailsKey={this.props.procurementMethodDetailsKey}
            // indicatorsKey={this.props.indicatorsKey}
            checklistStatusesKey={this.props.checklistStatusesKey}
            dashboardTenderChecklistFilterKey={this.props.dashboardTenderChecklistFilterKey}
            // riskLevelsKey={this.props.riskLevelsKey}
            okgzKey={this.props.okgzKey}
            checklistTemplateTypes={allMappings.templateTypes}
            checklistTemplateTypesKey={this.props.checklistTemplateTypesKey}
            // indicatorStatusesKey={this.props.indicatorStatusesKey}
            handleMethodSelected={this.handleMethodSelected}
            handleIndicatorSelected={this.handleIndicatorSelected}
            handleStartDateSelected={this.handleStartDateSelected}
            handleEndDateSelected={this.handleEndDateSelected}
            handleSearchBuyers={this.handleSearchBuyers}
            handleSelectedBuyer={this.handleSelectedBuyer}
            handleSearchOKGZ={this.handleSearchOKGZ}
            handleSelectedOKGZ={this.handleSelectedOKGZ}
            handleChangeSumFrom={this.handleChangeSumFrom}
            handleChangeSumTo={this.handleChangeSumTo}
            handleRiskLevelSelected={this.handleRiskLevelSelected}
            handleChecklistStatusSelected={this.handleChecklistStatusSelected}
            handleChecklistFilterStatusSelected={this.handleChecklistFilterStatusSelected}
            handleChecklistAuthorSelected={this.handleChecklistAuthorSelected}
            handleSearchBuCompetitionId={this.handleSearchBuCompetitionId}
            handleChangeTenderId={this.handleChangeTenderId}
            handleResetAllFilters={this.handleResetAllFilters}
            handleSearchAuditorByName={this.handleSearchAuditorByName}
            handleSelectedAuditorByName={this.handleSelectedAuditorByName}
            handleIndicatorStatusesSelected={this.handleIndicatorStatusesSelected}
            handleChecklistTemplateTypeSelected={this.handleChecklistTemplateTypeSelected}
          />
        </Col>
        <Col span={24} className="mb-5">
          <StatusCard
            cardOptions={TENDER_STATUS_CARD_OPTIONS}
            dashboardInfoData={this.props.dashboardTenderInfoData}
            dashboardInfoDataIsFetching={this.props.dashboardTenderInfoDataIsFetching}
          />
        </Col>
        <Col span={24}>

          <Row>
            <Col span={24}>
              <Divider>{translate('tender_table_header')}</Divider>
            </Col>

            <Col span={24}>
              <ConfigProvider renderEmpty={() => this.renderEmptyComponent()}>
                <PrioritizationBaseTable
                  allowCheckboxes={false}
                  bordered
                  rowKey='id'
                  size="small"
                  pagination={{ pageSize: 10 }}
                  defaultScrollX={3400}
                  spinnerStatus={tenderTableIsFetching}
                  columns={this.prepareTendersTableColumns()}
                  dataSource={this.prepareTendersTableData()}
                  sortOptions={this.state.tableSortingOptions}
                  handleSelectIdToExport={this.handleSelectItemsToExport}

                  handleHeaderCellClick={this.handleHeaderCellClick}
                  resetSelectedRows={this.state.resetSelectedRows}
                  handleAfterReset={this.handleAfterReset}
                />
              </ConfigProvider>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}


function mapStateToProps({
                           auth,
                           prioritizationStore,
                           mappingsStore,
                           buyerStore,
                           tenderStore,
                           templatesStore,
                           checklistsStore,
                           localizationStore,
                         }) {
  return {
    userInfo: auth.userInfo,
    filterRequestBody: prioritizationStore.filterRequestBody,
    tenderTableData: prioritizationStore.tenderTableData,
    tenderTableIsFetching: prioritizationStore.tenderTableIsFetching,
    allMappings: mappingsStore.allMappings,
    buyersBySearch: buyerStore.buyersBySearch,
    cpvBySearch: tenderStore.cpvBySearch,
    templatesData: templatesStore.templatesData,
    dashboardTenderInfoData: prioritizationStore.dashboardTenderInfoData,
    dashboardTenderInfoDataIsFetching: prioritizationStore.dashboardTenderInfoDataIsFetching,
    availableIndicatorsForTenderFilter: prioritizationStore.availableIndicatorsForTenderFilter,
    searchedAuditorNamesData: checklistsStore.searchedAuditorNamesData,
    procurementMethodDetailsKey: localizationStore.procurementMethodDetailsKey,
    indicatorsKey: localizationStore.indicatorsKey,
    checklistStatusesKey: localizationStore.checklistStatusesKey,
    dashboardTenderChecklistFilterKey: localizationStore.dashboardTenderChecklistFilterKey,
    riskLevelsKey: localizationStore.riskLevelsKey,
    okgzKey: localizationStore.okgzKey,
    indicatorStatusesKey: localizationStore.indicatorStatusesKey,
    checklistTemplateTypesKey: localizationStore.templateTypesKey,
    checklistDataById: checklistsStore.checklistDataById,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPrioritizationTenderTableData: bindActionCreators(fetchPrioritizationTenderTableData, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    getBuyersBySearch: bindActionCreators(getBuyersBySearch, dispatch),
    getCpvBySearch: bindActionCreators(getCpvBySearch, dispatch),
    clearBuyersBySearch: bindActionCreators(clearBuyersBySearch, dispatch),
    clearCpvBySearch: bindActionCreators(clearCpvBySearch, dispatch),
    exportTendersToExcel: bindActionCreators(exportTendersToExcel, dispatch),
    exportTendersToPDF: bindActionCreators(exportTendersToPDF, dispatch),
    fetchTemplates: bindActionCreators(fetchTemplates, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
    fetchDashboardTenderInfo: bindActionCreators(fetchDashboardTenderInfo, dispatch),
    fetchBuyerTopByRiskTendersCount: bindActionCreators(fetchTenderRiskTendersAmountInfoByMethod, dispatch),
    fetchTenderRiskTendersCountInfoByMethod: bindActionCreators(fetchTenderRiskTendersCountInfoByMethod, dispatch),
    fetchTenderTopRiskTendersByAmount: bindActionCreators(fetchTenderTopRiskTendersByAmount, dispatch),
    fetchTenderTopOkgzByRiskTendersCount: bindActionCreators(fetchTenderTopOkgzByRiskTendersCount, dispatch),
    fetchTenderTopTendersByIndicatorCount: bindActionCreators(fetchTenderTopTendersByIndicatorCount, dispatch),
    fetchTenderMethodIndicatorAmount: bindActionCreators(fetchTenderMethodIndicatorAmount, dispatch),
    fetchTenderMethodIndicatorCount: bindActionCreators(fetchTenderMethodIndicatorCount, dispatch),
    getAuditorNamesSearch: bindActionCreators(getAuditorNamesSearch, dispatch),
    fetchAvailableIndicatorsForTenderFilter: bindActionCreators(fetchAvailableIndicatorsForTenderFilter, dispatch),
    setRequestParamsByFilter: bindActionCreators(setRequestParamsByFilter, dispatch),
    getChecklistsDataById: bindActionCreators(getChecklistsDataById, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(PrioritizationTender))
