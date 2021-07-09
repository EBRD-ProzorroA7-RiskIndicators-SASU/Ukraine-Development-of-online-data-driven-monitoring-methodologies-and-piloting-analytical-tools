import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { bindActionCreators } from 'redux'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import TenderInspection from './TenderInspection'
import BuyerInspection from './BuyerInspection'
import { getChecklistsDataById } from '../../redux/action/checklists/ChecklistActions'
import { message } from 'antd'

import './InspectionPage.css'

class InspectionPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inspectionOptions: props.history.location.state,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
  }


  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentWillMount() {
    const { translate } = this.props
    if (!this.props.history.location.state) {
      let query = new URLSearchParams(this.props.history.location.search).get('id')
      if (query) {
        Promise.resolve(this.props.getChecklistsDataById(query)).then(() => {
          if (!this.props.checklistDataByIdHasError) {
            this.setState({
              inspectionOptions: {
                checklistId: this.props.checklistDataById.id,
                templateType: this.props.checklistDataById.templateTypeId,
                previewOnly: true,
              },
            })
          } else {
            message.error(translate('no_recognized_error'))
            setTimeout(() => {
              message.destroy()
              this.props.history.push('/')
            }, 2000)
          }
        })
      }
    }
  }

  render() {
    if (this.state.inspectionOptions) {
      if (this.state.inspectionOptions.templateType === 2) {
        return <BuyerInspection sectionProps={this.state.inspectionOptions} />
      } else {
        return <TenderInspection sectionProps={this.state.inspectionOptions} />
      }
    } else {
      return null
    }
  }
}

function mapStateToProps({
                           checklistsStore,
                         }) {
  return {
    checklistDataById: checklistsStore.checklistDataById,
    checklistDataByIdHasError: checklistsStore.checklistDataByIdHasError,
    checklistDataByIdErrorMessage: checklistsStore.checklistDataByIdErrorMessage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
    getChecklistsDataById: bindActionCreators(getChecklistsDataById, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(InspectionPage))
