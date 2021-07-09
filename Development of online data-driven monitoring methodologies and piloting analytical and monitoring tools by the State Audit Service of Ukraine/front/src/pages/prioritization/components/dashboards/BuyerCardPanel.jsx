import React, { Component } from 'react'
import { Card, Col, Row, Spin } from 'antd'
import { connect } from 'react-redux'
import { fetchDashboardBuyerInfo } from '../../../../redux/action/prioritization/PrioritizationActions'
import { bindActionCreators } from 'redux'
import { withTranslate } from 'react-redux-multilingual'
import { BUYER_CARDS_OPTIONS } from '../../PrioritizationConstants'
import {
  toCurrencyWithoutPostfix, toCurrencyWithPostfix, toNumberFormat,
  toPercentFormat,
} from '../../../../utils/NumberUtils'

class BuyerCardPanel extends Component {
  componentDidMount() {
    // this.props.fetchDashboardBuyerInfo()
  }

  render() {
    const { translate, dashboardBuyerInfoData, dashboardBuyerInfoDataIsFetching } = this.props

    return (
      <Spin spinning={dashboardBuyerInfoDataIsFetching} size="large">
        <Row style={{ marginBottom: 15 }}>
          {BUYER_CARDS_OPTIONS.map((optionItem, index) => {
            let classname = ''
            if(index === 0) {
              classname = 'first-element-buyer-dashboard-card-panel'
            } else if(index === (BUYER_CARDS_OPTIONS.length - 1)) {
              classname = 'last-element-buyer-dashboard-card-panel'
            } else {
              classname = 'buyer-dashboard-card-panel'
            }

            return (
            <Col span={6} key={`buyer_dashboard_panel_${index}`}>
              <Card title={translate(optionItem.titleKey)} className={classname}>
                {optionItem.cardData.map((cardOption, ind) => {
                  let value = dashboardBuyerInfoData[cardOption.valueKey]
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
    dashboardBuyerInfoData: prioritizationStore.dashboardBuyerInfoData,
    dashboardBuyerInfoDataIsFetching: prioritizationStore.dashboardBuyerInfoDataIsFetching,
    allMappings: mappingsStore.allMappings,
    buyersBySearch: buyerStore.buyersBySearch,
    cpvBySearch: tenderStore.cpvBySearch,
    templatesData: templatesStore.templatesData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboardBuyerInfo: bindActionCreators(fetchDashboardBuyerInfo, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(BuyerCardPanel))
