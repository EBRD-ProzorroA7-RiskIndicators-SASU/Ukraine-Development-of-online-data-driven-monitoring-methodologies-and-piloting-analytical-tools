import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { Row, Col, DatePicker, Select, Button, Input, InputNumber } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import './Filters.css'

class TendersFilters extends Component {
  componentDidMount() {
//    this.disableInput()
  }

  disableInput = () => {
    const selects = document.getElementsByClassName('select_search_okgz_filter')[0].getElementsByClassName('ant-select-search__field')
    for (let el of selects) {
      el.setAttribute(`maxlength`, 2)
    }
  }

  getChecklistStatusName = (checklistStatus) => {
    const { checklistStatuses, checklistStatusesKey } = this.props
    return _.find(checklistStatuses, { id: checklistStatus })[checklistStatusesKey]
  }

  getChecklistTemplateTypeName = (checklistTemplateType) => {
    const { checklistTemplateTypes, checklistTemplateTypesKey } = this.props
    return _.find(checklistTemplateTypes, { id: checklistTemplateType })[checklistTemplateTypesKey]
  }

  getChecklistTypeDescription = (checklistType) => {
    const { dashboardTenderChecklistFilter, dashboardTenderChecklistFilterKey } = this.props
    return _.find(dashboardTenderChecklistFilter, { id: checklistType })[dashboardTenderChecklistFilterKey]
  }

  getIndicatorStatusDescription = (indicatorStatus) => {
    const { indicatorStatuses, indicatorStatusesKey } = this.props
    return _.find(indicatorStatuses, { id: indicatorStatus })[indicatorStatusesKey]
  }

  render() {
    const {
      translate,
      methodsData,
      buyersData,
      OKGZData,
      allSelectedData,
      checklistStatuses,
      auditorSearchedNames,
      procurementMethodDetailsKey,
      checklistStatusesKey,
      okgzKey,
      checklistTemplateTypes,
      checklistTemplateTypesKey
    } = this.props

    return (
      <Row style={{ marginBottom: 15 }}>
        <Col span={24}>
          <Row>
            <Col span={8}>
              {translate('tender_filter_select_organization')}:
            </Col>
            <Col span={8}>
              {translate('tender_filter_sum_from_to_name')}:
            </Col>
            <Col span={4}>
              {translate('tender_filter_start_date_period')}:
            </Col>
            <Col span={4}>
              <span style={{ marginLeft: '5%' }}>{translate('tender_filter_end_date_period')}:</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Col span={8}>
              <Select
                showArrow
                mode="multiple"
                optionLabelProp='title'
                maxTagCount={30}
                placeholder={translate('tender_filter_select_organization')}
                style={{ width: '95%' }}
                filterOption={false}
                onSearch={this.props.handleSearchBuyers}
                onChange={this.props.handleSelectedBuyer}
                value={allSelectedData.hasOwnProperty('buyerIds') ? allSelectedData.buyerIds : []}
              >
                {_.map(buyersData, (buyer) => (
                  <Select.Option
                    key={buyer.id}
                    title={buyer.identifierId}
                    value={buyer.id}
                  >
                    {`${buyer.identifierId} - ${buyer.identifierLegalName}`}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <InputNumber
                  style={{ width: '45%' }}
                  placeholder={translate('tender_filter_sum_from_name')}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  parser={value => value.replace(/\D/g, '')}
                  // type="number"
                  // onChange={(e) => this.props.handleChangeSumFrom(e.target.value)}
                  onChange={this.props.handleChangeSumFrom}
                  value={allSelectedData.hasOwnProperty('completedLotValueMin') ? allSelectedData.completedLotValueMin : ''}
              />
              <span style={{ position: 'relative', left: '2%' }}>-</span>
              <InputNumber
                  style={{ width: '45%', float: 'right', marginRight: '5%' }}
                  placeholder={translate('tender_filter_sum_to_name')}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  parser={value => value.replace(/\D/g, '')}
                  // type="number"
                  // onChange={(e) => this.props.handleChangeSumTo(e.target.value)}
                  onChange={this.props.handleChangeSumTo}
                  value={allSelectedData.hasOwnProperty('completedLotValueMax') ? allSelectedData.completedLotValueMax : ''}
              />
            </Col>
            <Col span={4}>
              <DatePicker
                style={{ width: '95%' }}
                placeholder={translate('start_data')}
                onChange={this.props.handleStartDateSelected}
                value={allSelectedData.hasOwnProperty('contractStartDate') ? moment(allSelectedData.contractStartDate) : null}
              />
            </Col>
            <Col span={4}>
              <DatePicker
                style={{ width: '95%', marginLeft: '5%' }}
                placeholder={translate('end_date')}
                onChange={this.props.handleEndDateSelected}
                value={allSelectedData.hasOwnProperty('contractEndDate') ? moment(allSelectedData.contractEndDate) : null}
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              {translate('tender_filter_concurs_number_name')}:
            </Col>
            <Col span={4}>
              {translate('tender_filter_method_name')}:
            </Col>

          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Col span={8}>
              <Input.Search
                style={{ width: '95%' }}
                placeholder={translate('tender_filter_concurs_number_name')}
                onSearch={this.props.handleSearchBuCompetitionId}
                onChange={this.props.handleChangeTenderId}
                  value={allSelectedData.hasOwnProperty('tenderNumber') ? allSelectedData.tenderNumber : ''}
                enterButton
              />
            </Col>
            <Col span={8}>
              <Select
                showArrow
                mode="multiple"
                placeholder={translate('tender_filter_method_name')}
                style={{ width: '100%' }}
                onChange={this.props.handleMethodSelected}
                value={allSelectedData.hasOwnProperty('procurementMethodDetails') ? allSelectedData.procurementMethodDetails : []}
              >
                {_.map(methodsData, (method) => (
                  <Select.Option key={method.nameEn}>{method[procurementMethodDetailsKey]}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {translate('tender_filter_OKGZ_section_name')}:
            </Col>
            <Col span={6}>
              {translate('checklist_status_name')}
            </Col>
            <Col span={6}>
              {translate('checklist_author_name')}
            </Col>
            <Col span={6}>
              {translate('checklist_template_type_name')}
            </Col>
          </Row>
          <Row style={{ marginBottom: 15 }}>

            <Col span={6}>
              <div className="select_search_okgz_filter">
                <Select
                  showArrow
                  mode="multiple"
                  optionLabelProp='title'
                  maxTagCount={30}
                  placeholder={translate('tender_filter_OKGZ_section_name')}
                  style={{ width: '95%' }}
                  filterOption={false}
                  onSearch={this.props.handleSearchOKGZ}
                  onChange={this.props.handleSelectedOKGZ}
                  value={allSelectedData.hasOwnProperty('cpv') ? allSelectedData.cpv : []}
                >
                  {_.map(OKGZData, (okgz) => (
                    <Select.Option
                      key={okgz.code}
                      title={okgz.originalCode}
                      value={okgz.code}
                    >
                      {`"${okgz.originalCode}" -- ${okgz[okgzKey]}`}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={6}>
              <Select
                  showArrow
                  allowClear={true}
                  placeholder={translate('checklist_status_placeholder_name')}
                  style={{ width: '95%' }}
                  onChange={this.props.handleChecklistStatusSelected}
                  value={allSelectedData.hasOwnProperty('checklistStatus') ? this.getChecklistStatusName(allSelectedData.checklistStatus) : []}
              >
                {_.map(checklistStatuses, (checklistStatus) => (
                    <Select.Option key={checklistStatus.id}>{checklistStatus[checklistStatusesKey]}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>

              <Select
                  showArrow
                  allowClear={true}
                  showSearch
                  mode="multiple"
                  optionLabelProp='title'
                  maxTagCount={30}
                  placeholder={translate('checklist_author_name')}
                  style={{ width: '95%' }}
                  filterOption={false}
                  onSearch={this.props.handleSearchAuditorByName}
                  onChange={this.props.handleSelectedAuditorByName}
              >
                {_.map(auditorSearchedNames, (auditorName) => (
                    <Select.Option
                        key={auditorName.id}
                        title={auditorName.name}
                    >
                      {auditorName.name}
                    </Select.Option>
                ))}
              </Select>
            </Col>

            <Col span={6}>
              <Select
                  showArrow
                  allowClear={true}
                  placeholder={translate('checklist_template_type_name')}
                  style={{ width: '95%' }}
                  onChange={this.props.handleChecklistTemplateTypeSelected}
                  value={allSelectedData.hasOwnProperty('templateType') ? this.getChecklistTemplateTypeName(allSelectedData.templateType) : []}
              >
                {_.map(checklistTemplateTypes, (checklistTemplateType) => (
                    <Select.Option key={checklistTemplateType.id}>{checklistTemplateType[checklistTemplateTypesKey]}</Select.Option>
                ))}
              </Select>
            </Col>

          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Col span={4}>
              <Button
                type="primary"
                onClick={this.props.handleResetAllFilters}
              >
                {translate('reset_filters_button_name')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

TendersFilters.propTypes = {
  allSelectedData: PropTypes.object,
  methodsData: PropTypes.array,
  indicatorsData: PropTypes.array,
  buyersData: PropTypes.array,
  OKGZData: PropTypes.array,
  riskLevels: PropTypes.array,
  checklistStatuses: PropTypes.array,
  dashboardTenderChecklistFilter: PropTypes.array,
  auditorSearchedNames: PropTypes.array,
  indicatorStatuses: PropTypes.array,
  procurementMethodDetailsKey: PropTypes.string.isRequired,
  checklistStatusesKey: PropTypes.string.isRequired,
  dashboardTenderChecklistFilterKey: PropTypes.string.isRequired,
  okgzKey: PropTypes.string.isRequired,
  checklistTemplateTypes: PropTypes.array,
  checklistTemplateTypesKey: PropTypes.string.isRequired,
  handleStartDateSelected: PropTypes.func,
  handleEndDateSelected: PropTypes.func,
  handleMethodSelected: PropTypes.func,
  handleIndicatorSelected: PropTypes.func,
  handleSearchBuyers: PropTypes.func,
  handleSelectedBuyer: PropTypes.func,
  handleSearchOKGZ: PropTypes.func,
  handleSelectedOKGZ: PropTypes.func,
  handleChangeSumFrom: PropTypes.func,
  handleChangeSumTo: PropTypes.func,
  handleRiskLevelSelected: PropTypes.func,
  handleChangeTenderId: PropTypes.func,
  handleSearchBuCompetitionId: PropTypes.func,
  handleChecklistStatusSelected: PropTypes.func,
  handleChecklistFilterStatusSelected: PropTypes.func,
  handleChecklistAuthorSelected: PropTypes.func,
  handleResetAllFilters: PropTypes.func,
  handleSearchAuditorByName: PropTypes.func,
  handleSelectedAuditorByName: PropTypes.func,
  handleIndicatorStatusesSelected: PropTypes.func,
  handleChecklistTemplateTypeSelected: PropTypes.func,
}


export default withTranslate(TendersFilters)
