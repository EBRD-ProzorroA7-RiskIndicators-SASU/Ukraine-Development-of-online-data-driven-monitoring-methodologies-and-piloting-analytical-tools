import React, { Component } from 'react'
import { bindActionCreators } from 'redux/index'
import {
  fetchTemplates,
} from '../../../redux/action/templates/TemplatesActions'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'

class TenderInspectionForm extends Component {
  render(){
    return (
      <div>asdasd</div>
    )
  }
}

function mapStateToProps({
                           templatesStore,
                         }) {
  return {
    templatesData: templatesStore.templatesData,
    saveTemplatesData: templatesStore.saveTemplatesData,
    templatesIsFetching: templatesStore.templatesIsFetching,
    templatesTypesData: templatesStore.templatesTypesData,
    saveAuditorTemplateData: templatesStore.saveAuditorTemplateData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplates: bindActionCreators(fetchTemplates, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(TenderInspectionForm))