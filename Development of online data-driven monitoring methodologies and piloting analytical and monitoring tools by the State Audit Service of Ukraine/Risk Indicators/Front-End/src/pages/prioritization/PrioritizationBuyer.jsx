import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import moment from 'moment'
import { PERMISSIONS } from '../../components/secutiry/PermissionConstants'
import { hasPermission } from '../../utils/Permissions'
import {
  fetchPrioritizationBuyerTableData,
  exportBuyersToExcel,
  exportBuyersToPDF,
  setRequestParamsByFilter,
  fetchBuyerTopByRiskTendersCount,
  fetchBuyerTopByRiskTendersAmount,
  fetchBuyerTopByIndicatorsCount,
  fetchDashboardBuyerInfo,
  fetchAvailableIndicatorsForBuyerFilter,
} from '../../redux/action/prioritization/PrioritizationActions'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import { fetchTemplates } from '../../redux/action/templates/TemplatesActions'
import { Row, Col, ConfigProvider, Empty, Tabs, Icon } from 'antd'
import {
  PRIORITIZATION_BUYER_TABLE_COLUMNS,
  PRIORITIZATION_BUYER_TABLE_COLUMNS_FOR_EXPORT,
  BUYER_STATUS_CARD_OPTIONS,
} from './PrioritizationConstants'
import BuyersFilters from './components/BuyersFilters'
import PrioritizationBaseTable from './components/PrioritizationBaseTable'
import { getBuyersBySearch, clearBuyersBySearch } from '../../redux/action/buyer/BuyerActions'
import { getCpvBySearch, clearCpvBySearch } from '../../redux/action/tender/TenderActions'
import { toISOFormat } from '../../utils/DateUtils'
import ExportButton from './components/ExportButton'
import PrioritizationActionsComponent from './components/PrioritizationActionsComponent'
import PrioritizationTemplatesModal from './components/PrioritizationTemplatesModal'
import StatusCard from '../../components/statusCard/StatusCard'

import './PrioritizationPage.css'

class PrioritizationBuyer extends Component {
  constructor(props) {
    super(props)

    let filterRequestBody = {}
    if (!_.isEmpty(props.filterRequestBody)) {
      filterRequestBody = props.filterRequestBody
    } else {
      filterRequestBody = {
        contractStartDate: toISOFormat(moment().startOf('year').format('MM/DD/YYYY')),
        contractEndDate: toISOFormat(moment().format('MM/DD/YYYY')),
      }
    }

    this.state = {
      filterRequestBody: filterRequestBody,
      tableSortingOptions: [],
      filteredOKGZ: props.allMappings.okgz,
      selectedExportIds: [],
      showSelectTemplateModal: false,
      defaultBuyersTemplates: [],
      userBuyersTemplates: [],
      selectedBuyerData: null,
      resetSelectedRows: false,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
    this.handleSearchBuyers = _.debounce(this.handleSearchBuyers, 400)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadBuyerTableData()
    this.handleSearchBuyers('а')
  }

  componentWillUnmount() {
    // this.props.clearBuyersBySearch()
    this.props.clearCpvBySearch()
  }

  loadBuyerTableData = () => {
    this.props.fetchAvailableIndicatorsForBuyerFilter(this.state.filterRequestBody)
    this.props.fetchPrioritizationBuyerTableData(this.state.filterRequestBody)
    this.props.fetchBuyerTopByRiskTendersCount(this.state.filterRequestBody)
    this.props.fetchBuyerTopByRiskTendersAmount(this.state.filterRequestBody)
    this.props.fetchBuyerTopByIndicatorsCount(this.state.filterRequestBody)
    this.props.fetchDashboardBuyerInfo(this.state.filterRequestBody)
  }

  renderTableColumns = () => {
    const { translate } = this.props
    let tenderTableColumns = _.cloneDeep(PRIORITIZATION_BUYER_TABLE_COLUMNS)

    return _.map(tenderTableColumns, (column) => {
      column.title = translate(column.translateKey)
      return column
    })
  }

  reloadTableDataByFilter = (filterRequestBody, ifIndicatorChange = false) => {
    !ifIndicatorChange && (delete filterRequestBody.indicators)

    this.setState({
      filterRequestBody: filterRequestBody,
      selectedExportIds: [],
      resetSelectedRows: true,
    }, () => {
      this.props.fetchAvailableIndicatorsForBuyerFilter(filterRequestBody)
      this.props.setRequestParamsByFilter(filterRequestBody)
      this.props.fetchPrioritizationBuyerTableData(filterRequestBody)
      this.props.fetchBuyerTopByRiskTendersCount(filterRequestBody)
      this.props.fetchBuyerTopByRiskTendersAmount(filterRequestBody)
      this.props.fetchBuyerTopByIndicatorsCount(filterRequestBody)
      this.props.fetchDashboardBuyerInfo(filterRequestBody)
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

  handleSelectedBuyer = (value) => {
    // if (_.isEmpty(value)) {
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

  handleRegionSelected = (value) => {
    let { filterRequestBody } = this.state
    if (!filterRequestBody.hasOwnProperty('regions')) {
      filterRequestBody = _.merge({}, filterRequestBody, {
        regions: value,
      })
    } else {
      filterRequestBody.regions = value
    }

    this.reloadTableDataByFilter(filterRequestBody)
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
      selectedExportIds: [],
      resetSelectedRows: true,
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
        this.props.exportBuyersToExcel(requestParams, fileName)
        break
      case 'pdf':
        this.props.exportBuyersToPDF(requestParams, fileName)
        break

      default:
        this.props.exportBuyersToExcel(requestParams, fileName)
    }
  }

  handleSelectItemsToExport = (selectedIds) => {
    this.setState({
      selectedExportIds: selectedIds,
    })
  }

  handleStartAudit = (buyerData) => {
    const { templatesData } = this.props
    let defaultBuyersTemplates = []
    let userBuyersTemplates = []

    if (_.isEmpty(templatesData)) {
      this.props.fetchTemplates().then(() => {
        _.chain(_.cloneDeep(this.props.templatesData))
          .groupBy('base')
          .map((values, key) => {
            if (key === 'true') {
              defaultBuyersTemplates = _.filter(values, (value) => (value.type.id === 1))
            } else {
              userBuyersTemplates = _.filter(values, (value) => (value.type.id === 1))
            }
            return false
          })
          .value()

        this.setState({
          showSelectTemplateModal: true,
          defaultBuyersTemplates: defaultBuyersTemplates,
          userBuyersTemplates: userBuyersTemplates,
          selectedBuyerData: buyerData,
        })
      })
    } else {
      _.chain(_.cloneDeep(templatesData))
        .groupBy('base')
        .map((values, key) => {
          if (key === 'true') {
            defaultBuyersTemplates = _.filter(values, (value) => (value.type.id === 1))
          } else {
            userBuyersTemplates = _.filter(values, (value) => (value.type.id === 1))
          }
          return false
        })
        .value()

      this.setState({
        showSelectTemplateModal: true,
        defaultBuyersTemplates: defaultBuyersTemplates,
        userBuyersTemplates: userBuyersTemplates,
        selectedBuyerData: buyerData,
      })
    }
  }

  prepareBuyersTableColumns = () => {
    let defaultColumns = _.cloneDeep(PRIORITIZATION_BUYER_TABLE_COLUMNS)
    if (hasPermission(PERMISSIONS.auditorBase) || hasPermission(PERMISSIONS.supervisor)) {
      defaultColumns.push({
        title: '',
        dataIndex: 'startInspection',
        align: 'center',
        translateKey: 'template_actions',
        // width: '20%',
        sorter: false,
        customSort: false,
        className: 'header-text-align-center ant-table-column-has-actions ant-table-column-has-sorters',
      })
    }
    return defaultColumns
  }

  prepareBuyersTableData = () => {
    const { buyerTableData } = this.props

    return _.map(buyerTableData, (buyerData) => {
      return _.merge({}, buyerData, {
        startInspection: (<PrioritizationActionsComponent
          prioritizationData={buyerData}
          isTenderAction={false}
          userInfo={this.props.userInfo}
          handleStartAudit={this.handleStartAudit}
        />),
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
        templateType: 'buyer',
        selectedBuyerIdentifierId: this.state.selectedBuyerData.identifierId,
      },
    })
  }

  handleResetAllFilters = () => {
    this.setState({
      tableSortingOptions: [],
    }, () => {
      this.reloadTableDataByFilter({
        contractStartDate: toISOFormat(moment().startOf('year').format('MM/DD/YYYY')),
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

  render() {
    const { translate, allMappings, buyersBySearch, availableIndicatorsForBuyerFilter, buyerTableIsFetching } = this.props
    let tabsStyle = {
      fontSize: '28px',
      verticalAlign: 'bottom',
    }

    return (
      <Row className="PrioritizationPage">
        <PrioritizationTemplatesModal
          visible={this.state.showSelectTemplateModal}
          defaultTemplates={this.state.defaultBuyersTemplates}
          userTemplates={this.state.userBuyersTemplates}
          onClose={this.handleCloseSelectTemplateModal}
          handleGoToInspection={this.handleGoToInspection}
        />
        <Col span={24}>
          <BuyersFilters
            methodsData={allMappings.procurementMethodDetails}
            // indicatorsData={allMappings.indicators}
            indicatorsData={availableIndicatorsForBuyerFilter.map((indicatorId) => {
              return _.find(allMappings.indicators, { id: indicatorId })
            })}
            buyersData={buyersBySearch}
            // OKGZData={cpvBySearch}
            OKGZData={this.state.filteredOKGZ}
            riskLevels={allMappings.riskLevels}
            regions={allMappings.regions}
            allSelectedData={this.state.filterRequestBody}
            procurementMethodDetailsKey={this.props.procurementMethodDetailsKey}
            regionsKey={this.props.regionsKey}
            indicatorsKey={this.props.indicatorsKey}
            riskLevelsKey={this.props.riskLevelsKey}
            okgzKey={this.props.okgzKey}
            handleMethodSelected={this.handleMethodSelected}
            handleIndicatorSelected={this.handleIndicatorSelected}
            handleStartDateSelected={this.handleStartDateSelected}
            handleEndDateSelected={this.handleEndDateSelected}
            handleSearchBuyers={this.handleSearchBuyers}
            handleSelectedBuyer={this.handleSelectedBuyer}
            handleSearchOKGZ={this.handleSearchOKGZ}
            handleSelectedOKGZ={this.handleSelectedOKGZ}
            handleRiskLevelSelected={this.handleRiskLevelSelected}
            handleRegionSelected={this.handleRegionSelected}
            handleResetAllFilters={this.handleResetAllFilters}
          />
        </Col>
        {/*<Col span={24}>*/}
        {/*<BuyerCardPanel />*/}
        {/*</Col>*/}
        <Col span={24} className="mb-5">
          <StatusCard
            cardOptions={BUYER_STATUS_CARD_OPTIONS}
            dashboardInfoData={this.props.dashboardBuyerInfoData}
            dashboardInfoDataIsFetching={this.props.dashboardBuyerInfoDataIsFetching}
          />
        </Col>
        <Col span={24}>
          {/*<BuyerDashboard />*/}
          <Tabs onChange={this.callback} className="test-tab-class" tabPosition="top">
            <Tabs.TabPane
              tab={<span><Icon type="table" style={tabsStyle} />{translate('tenders_page_table_tab')}</span>} key="2"
              className="test-tabpane-class">
              <Row>
                {/*<Col span={24}>*/}
                {/*<Divider>{translate('tender_table_header')}</Divider>*/}
                {/*</Col>*/}
                <Col span={24} style={{ height: 40 }}>
                  <ExportButton
                    columnOptions={_.map(PRIORITIZATION_BUYER_TABLE_COLUMNS_FOR_EXPORT, (column) => {
                      return {
                        label: translate(column.translateKey),
                        value: column.dataIndex,
                      }
                    })}
                    filename={this.props.translate('buyer_export_table_filename').split(' ').join('_')}
                    downloadButtonClicked={this.handleDownloadButtonClicked}
                  />
                </Col>
                <Col span={24}>
                  <ConfigProvider renderEmpty={() => this.renderEmptyComponent()}>
                    <PrioritizationBaseTable
                      bordered
                      rowKey='id'
                      size="small"
                      pagination={{ pageSize: 5 }}
                      defaultScrollX={2500}
                      spinnerStatus={buyerTableIsFetching}
                      // indentSize={150}
                      columns={this.prepareBuyersTableColumns()}
                      dataSource={this.prepareBuyersTableData()}
                      sortOptions={this.state.tableSortingOptions}
                      handleHeaderCellClick={this.handleHeaderCellClick}
                      handleSelectIdToExport={this.handleSelectItemsToExport}
                      resetSelectedRows={this.state.resetSelectedRows}
                      handleAfterReset={this.handleAfterReset}
                    />
                  </ConfigProvider>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
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
                           localizationStore,
                         }) {
  return {
    userInfo: auth.userInfo,
    filterRequestBody: prioritizationStore.filterRequestBody,
    buyerTableData: prioritizationStore.buyerTableData,
    buyerTableIsFetching: prioritizationStore.buyerTableIsFetching,
    allMappings: mappingsStore.allMappings,
    buyersBySearch: buyerStore.buyersBySearch,
    cpvBySearch: tenderStore.cpvBySearch,
    templatesData: templatesStore.templatesData,
    dashboardBuyerInfoData: prioritizationStore.dashboardBuyerInfoData,
    dashboardBuyerInfoDataIsFetching: prioritizationStore.dashboardBuyerInfoDataIsFetching,
    availableIndicatorsForBuyerFilter: prioritizationStore.availableIndicatorsForBuyerFilter,
    procurementMethodDetailsKey: localizationStore.procurementMethodDetailsKey,
    regionsKey: localizationStore.regionsKey,
    indicatorsKey: localizationStore.indicatorsKey,
    riskLevelsKey: localizationStore.riskLevelsKey,
    okgzKey: localizationStore.okgzKey,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPrioritizationBuyerTableData: bindActionCreators(fetchPrioritizationBuyerTableData, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    getBuyersBySearch: bindActionCreators(getBuyersBySearch, dispatch),
    getCpvBySearch: bindActionCreators(getCpvBySearch, dispatch),
    clearBuyersBySearch: bindActionCreators(clearBuyersBySearch, dispatch),
    clearCpvBySearch: bindActionCreators(clearCpvBySearch, dispatch),
    exportBuyersToExcel: bindActionCreators(exportBuyersToExcel, dispatch),
    exportBuyersToPDF: bindActionCreators(exportBuyersToPDF, dispatch),
    fetchTemplates: bindActionCreators(fetchTemplates, dispatch),
    setRequestParamsByFilter: bindActionCreators(setRequestParamsByFilter, dispatch),
    fetchBuyerTopByRiskTendersCount: bindActionCreators(fetchBuyerTopByRiskTendersCount, dispatch),
    fetchBuyerTopByRiskTendersAmount: bindActionCreators(fetchBuyerTopByRiskTendersAmount, dispatch),
    fetchBuyerTopByIndicatorsCount: bindActionCreators(fetchBuyerTopByIndicatorsCount, dispatch),
    fetchDashboardBuyerInfo: bindActionCreators(fetchDashboardBuyerInfo, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
    fetchAvailableIndicatorsForBuyerFilter: bindActionCreators(fetchAvailableIndicatorsForBuyerFilter, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(PrioritizationBuyer))
