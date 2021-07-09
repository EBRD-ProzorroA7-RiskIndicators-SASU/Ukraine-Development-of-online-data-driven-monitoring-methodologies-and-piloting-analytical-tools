import React, { Component } from 'react'
import { fetchTemplateById } from '../../redux/action/templates/TemplatesActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LoginForm from './components/LoginForm'

import './LoginPage.css'
import { IntlActions } from 'react-redux-multilingual'

class LoginPage extends Component {
  constructor(props){
    super(props)

    IntlActions.setLocale(process.env.REACT_APP_DEFAULT_LOCALE)
  }

  render(){
    return (
      <div className="LoginPage">
        <LoginForm />
      </div>
    )
  }
}

function mapStateToProps({
                           templatesStore,
                         }) {
  return {
    templateByIdData: templatesStore.templateByIdData,
    templateByIdIsFetching: templatesStore.templateByIdIsFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemplateById: bindActionCreators(fetchTemplateById, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage)