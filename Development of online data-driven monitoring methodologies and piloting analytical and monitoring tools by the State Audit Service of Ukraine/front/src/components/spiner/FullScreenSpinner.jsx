import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import './FullScreenSpinner.css'

class FullScreenSpinner extends Component {
  getStatus = () => {
    const {
      // tenderTableIsFetching,
      // buyerTableIsFetching,
      // tenderDataForChecklistIsFetching,
      templateByIdIsFetching,
      calendarDataByYearIsFetching,
      saveCalendarDataIsFetching,
      // tenderTableByBuyerIdIsFetching,
      calculatedChecklistScoreDataIsFetching,
      checklistDataByIdIsFetching,
      allChecklistsDataIsFetching,
    } = this.props

    return saveCalendarDataIsFetching
      || templateByIdIsFetching
      || calendarDataByYearIsFetching
      // || buyerTableIsFetching
      // || tenderTableIsFetching
      // || tenderDataForChecklistIsFetching
      // || tenderTableByBuyerIdIsFetching
      || calculatedChecklistScoreDataIsFetching
      || checklistDataByIdIsFetching
      || allChecklistsDataIsFetching
  }

  render() {
    return (
      <Spin className="FullScreenSpinner" spinning={this.getStatus()} size="large">
        {this.props.children}
      </Spin>
    )
  }
}

function mapStateToProps({
                           templatesStore,
                           categoriesStore,
                           questionsStore,
                           navigationStore,
                           administrationStore,
                           permissionsStore,
                           prioritizationStore,
                           checklistsStore,
                         }) {
  return {
    tenderTableIsFetching: prioritizationStore.tenderTableIsFetching,
    buyerTableIsFetching: prioritizationStore.buyerTableIsFetching,
    tenderTableByBuyerIdIsFetching: prioritizationStore.tenderTableByBuyerIdIsFetching,
    templateByIdIsFetching: templatesStore.templateByIdIsFetching,
    calendarDataByYearIsFetching: administrationStore.calendarDataByYearIsFetching,
    saveCalendarDataIsFetching: administrationStore.saveCalendarDataIsFetching,
    calculatedChecklistScoreDataIsFetching: checklistsStore.calculatedChecklistScoreDataIsFetching,
    checklistDataByIdIsFetching: checklistsStore.checklistDataByIdIsFetching,
    allChecklistsDataIsFetching: checklistsStore.allChecklistsDataIsFetching,
    tenderDataForChecklistIsFetching: checklistsStore.tenderDataForChecklistIsFetching,
  }
}

export default connect(
  mapStateToProps,
)(FullScreenSpinner)