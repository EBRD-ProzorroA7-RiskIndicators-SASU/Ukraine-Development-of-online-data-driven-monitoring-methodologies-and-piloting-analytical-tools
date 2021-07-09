import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Spin, Col, Row } from 'antd'

import _ from 'lodash'
import { fetchDashboardBuyerInfo } from '../../../redux/action/prioritization/PrioritizationActions'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import classnames from 'classnames'

import './BuyerDashboard.css'
import Divider from '../../../components/divider/Divider'
import Card from '../../../components/card/Card'

class BuyerDashboard extends Component {
  componentWillMount() {
    this.props.fetchDashboardBuyerInfo()
  }

  prepareCountInfo = () => {
    return (
      <div className="col-md-6">
        <Card className="col-md-6" cardClass="d-flex flex-row mini-kpi h-100">
          <div className={classnames('mini-kpi-value', 'color-perano')}>
            {
              _.isEmpty(this.props.dashboardBuyerInfoData) ?
                <Spin isActive={this.props.dashboardBuyerInfoDataIsFetching} /> :
                123
            }
          </div>
          <Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />
          <span className="margin-left-15">qweqweqweqwe</span>
        </Card>
      </div>
    )
  }

  prepareAmountInfo = () => {
    return (
      <div className="col-md-6">
        <Card className="col-md-6" cardClass="d-flex flex-row mini-kpi h-100">
          <div className={classnames('mini-kpi-value', 'color-madang')}>
            {
              _.isEmpty(this.props.dashboardBuyerInfoData) ?
                <Spin isActive={this.props.dashboardBuyerInfoDataIsFetching} /> :
                123
            }
          </div>
          <Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />
          <span className="margin-left-15">qweqweqweqwe</span>
        </Card>
      </div>
    )
  }

  render() {
    const { dashboardBuyerInfoData } = this.props

    return (
      <Row>
        <Col span={24}>
          <Row>
            {this.prepareAmountInfo()}
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            {this.prepareCountInfo()}
          </Row>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({
                           prioritizationStore,
                           mappingsStore,
                         }) {
  return {
    dashboardBuyerInfoData: prioritizationStore.dashboardBuyerInfoData,
    dashboardBuyerInfoDataIsFetching: prioritizationStore.dashboardBuyerInfoDataIsFetching,
    allMappings: mappingsStore.allMappings,
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
)(withTranslate(BuyerDashboard))
