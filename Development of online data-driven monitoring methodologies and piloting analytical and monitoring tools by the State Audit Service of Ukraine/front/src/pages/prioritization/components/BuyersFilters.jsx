import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { Row, Col, DatePicker, Select, Button } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import './Filters.css'

class BuyersFilters extends Component {
  componentDidMount() {
//    this.disableInput()
  }

  disableInput = () => {
    const selects = document.getElementsByClassName('select_search_okgz_filter')[0].getElementsByClassName('ant-select-search__field')
    for (let el of selects) {
      el.setAttribute(`maxlength`, 2)
    }
  }

  render() {
    const {
      translate,
      methodsData,
      indicatorsData,
      buyersData,
      OKGZData,
      riskLevels,
      regions,
      allSelectedData,
      procurementMethodDetailsKey,
      regionsKey,
      indicatorsKey,
      riskLevelsKey,
      okgzKey,
    } = this.props

    return (
      <Row style={{ marginBottom: 15 }}>
        <Col span={24}>
          <Row>
            <Col span={4}></Col>
            <Col span={4}></Col>
            <Col span={4}></Col>
            <Col span={4}></Col>
            <Col span={4}>
              {translate('tender_filter_start_date_period')}:
            </Col>
            <Col span={4}>
              <span style={{ marginLeft: '5%' }}>{translate('tender_filter_end_date_period')}:</span>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Button
                type="primary"
                onClick={this.props.handleResetAllFilters}
              >
                {translate('reset_filters_button_name')}
              </Button>
            </Col>
            <Col span={4}></Col>
            <Col span={4}></Col>
            <Col span={4}></Col>
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
        </Col>
        <Col span={24}>
          <Row style={{ marginTop: 15 }}>
            <Col span={8}>
              {translate('tender_filter_select_organization')}:
            </Col>
            <Col span={8}>
              {translate('tender_filter_region_name')}:
            </Col>
            <Col span={8}>
              {translate('tender_filter_method_name')}:
            </Col>
          </Row>
          <Row>
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
              <Select
                showArrow
                mode="multiple"
                placeholder={translate('tender_filter_region_name')}
                style={{ width: '95%' }}
                onChange={this.props.handleRegionSelected}
                value={allSelectedData.hasOwnProperty('regions') ? allSelectedData.regions : []}
              >
                {_.map(regions, (region) => (
                  <Select.Option key={region.key}>{region[regionsKey]}</Select.Option>
                ))}
              </Select>
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
        </Col>
        <Col span={24}>
          <Row style={{ marginTop: 15 }}>
            <Col span={8}>
              {translate('tender_filter_risk_level_name')}:
            </Col>
            <Col span={8}>
              {translate('tender_filter_OKGZ_section_name')}:
            </Col>
            <Col span={8}>
              {translate('tender_filter_indicator_name')}:
            </Col>
          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Col span={8}>
              <Select
                showArrow
                mode="multiple"
                placeholder={translate('tender_filter_risk_level_name')}
                style={{ width: '95%' }}
                onChange={this.props.handleRiskLevelSelected}
                value={allSelectedData.hasOwnProperty('riskLevel') ? allSelectedData.riskLevel : []}
              >
                {_.map(riskLevels, (risk) => (
                  <Select.Option
                    key={risk.id}
                    value={risk.id}
                  >
                    {risk[riskLevelsKey]}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Select
                showArrow
                mode="multiple"
                optionLabelProp='title'
                placeholder={translate('tender_filter_indicator_name')}
                style={{ width: '100%' }}
                onChange={this.props.handleIndicatorSelected}
                value={allSelectedData.hasOwnProperty('indicators') ? allSelectedData.indicators : []}
              >
                {_.map(indicatorsData, (indicator) => (
                  <Select.Option
                    key={indicator.id}
                    title={indicator.name}
                    value={indicator.id}
                  >
                    {`${indicator.name} - ${indicator[indicatorsKey]}`}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

BuyersFilters.propTypes = {
  methodsData: PropTypes.array,
  indicatorsData: PropTypes.array,
  buyersData: PropTypes.array,
  OKGZData: PropTypes.array,
  riskLevels: PropTypes.array,
  regions: PropTypes.array,
  allSelectedData: PropTypes.object,
  procurementMethodDetailsKey: PropTypes.string.isRequired,
  regionsKey: PropTypes.string.isRequired,
  indicatorsKey: PropTypes.string.isRequired,
  riskLevelsKey: PropTypes.string.isRequired,
  okgzKey: PropTypes.string.isRequired,

  handleStartDateSelected: PropTypes.func,
  handleEndDateSelected: PropTypes.func,
  handleMethodSelected: PropTypes.func,
  handleIndicatorSelected: PropTypes.func,
  handleSearchBuyers: PropTypes.func,
  handleSelectedBuyer: PropTypes.func,
  handleSearchOKGZ: PropTypes.func,
  handleSelectedOKGZ: PropTypes.func,
  handleRiskLevelSelected: PropTypes.func,
  handleRegionSelected: PropTypes.func,
  handleResetAllFilters: PropTypes.func,
}


export default withTranslate(BuyersFilters)