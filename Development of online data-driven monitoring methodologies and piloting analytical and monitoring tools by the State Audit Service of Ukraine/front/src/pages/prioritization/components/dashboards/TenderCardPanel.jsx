import React, { Component } from 'react'
import { Card, Col, Row, Spin } from 'antd'
import { connect } from 'react-redux'
import { fetchDashboardTenderInfo } from '../../../../redux/action/prioritization/PrioritizationActions'
import { bindActionCreators } from 'redux'
import { withTranslate } from 'react-redux-multilingual'
import { TENDER_CARDS_OPTIONS } from '../../PrioritizationConstants'
import {
  toCurrencyWithoutPostfix, toCurrencyWithPostfix, toNumberFormat,
  toPercentFormat,
} from '../../../../utils/NumberUtils'

class TenderCardPanel extends Component {
  componentDidMount() {
    // this.props.fetchDashboardBuyerInfo()
  }

  render() {
    const { translate, dashboardTenderInfoData, dashboardTenderInfoDataIsFetching } = this.props

    return (
      <Spin spinning={dashboardTenderInfoDataIsFetching} size="large">
        <Row style={{ marginBottom: 15 }}>
          {TENDER_CARDS_OPTIONS.map((optionItem, index) => {
            let classname = ''
            if(index === 0) {
              classname = 'first-element-buyer-dashboard-card-panel'
            } else if(index === (TENDER_CARDS_OPTIONS.length - 1)) {
              classname = 'last-element-buyer-dashboard-card-panel'
            } else {
              classname = 'buyer-dashboard-card-panel'
            }

            return (
            <Col span={8} key={`buyer_dashboard_panel_${index}`}>
              <Card title={translate(optionItem.titleKey)} className={classname}>
                {optionItem.cardData.map((cardOption, ind) => {
                  let value = dashboardTenderInfoData[cardOption.valueKey]
                  switch (cardOption.numberFormat){
                    case 'number':
                      value = toNumberFormat(value)
                      break
                    case 'currency_without_postfix':
                      value = toCurrencyWithoutPostfix(value)
                      break
                    case 'currency_with_postfix':
                      value = toCurrencyWithPostfix(value)
                      break
                    case 'percent':
                      value = toPercentFormat(value)
                      break

                    default:
                      value = toNumberFormat(value)
                  }
                  return (
                    <div key={`buyer_dashboard_content_${ind}`}>
                      <Card.Grid style={cardOption.textGridStyle}>{translate(cardOption.translateKey)}</Card.Grid>
                      <Card.Grid style={cardOption.valueGridStyle}><b>{value}</b></Card.Grid>
                    </div>
                  )
                })}
              </Card>
            </Col>
          )})}
        </Row>
      </Spin>
    )
  }
}

function mapStateToProps({
                           prioritizationStore,
                           mappingsStore,
                           buyerStore,
                           tenderStore,
                           templatesStore,
                         }) {
  return {
    filterRequestBody: prioritizationStore.filterRequestBody,
    dashboardTenderInfoData: prioritizationStore.dashboardTenderInfoData,
    dashboardTenderInfoDataIsFetching: prioritizationStore.dashboardTenderInfoDataIsFetching,
    allMappings: mappingsStore.allMappings,
    buyersBySearch: buyerStore.buyersBySearch,
    cpvBySearch: tenderStore.cpvBySearch,
    templatesData: templatesStore.templatesData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboardTenderInfo: bindActionCreators(fetchDashboardTenderInfo, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(TenderCardPanel))
