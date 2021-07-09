import React, { Component } from 'react'
import { resetCheckToken, resetSaveNewPass } from '../../../redux/action/auth/AuthActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import ResetNewPasswordForm from '../components/ResetNewPasswordForm'
import NotFound from '../../../pages/error/404/NotFound'
import { IntlActions } from 'react-redux-multilingual'
import { Alert, Row } from 'antd'
import { Link } from 'react-router-dom'

import './ResetPasswordPage.css'

class ResetPage extends Component {
  constructor(props) {
    super(props)

    IntlActions.setLocale(process.env.REACT_APP_DEFAULT_LOCALE)
    this.state = {
      showedComponent: null,
    }
  }

  componentWillMount() {
    if (!_.isEmpty(this.props.history.location.search)) {
      let token = this.props.history.location.search.split('=')[1]
      this.props.resetCheckToken(token).then((data) => {
        if (this.props.resetCheckTokenDataErrorStatus) {
          this.setState({
            showedComponent: this.prepareErrorMessage(this.props.resetCheckTokenDataErrorMessage),
          })
        } else {
          this.setState({
            showedComponent:
              <ResetNewPasswordForm
                token={token}
                onSave={this.handleSaveNewPassword}
              />,
          })
        }
      })
    } else {
      this.setState({
        showedComponent: <NotFound />,
      })
    }
  }

  handleSaveNewPassword = (postData) => {
    this.props.resetSaveNewPass(postData).then(() => {
      if (this.props.resetSavedPassDataErrorStatus) {
        this.setState({
          showedComponent: this.prepareErrorMessage(this.props.resetSavedPassDataErrorMessage),
        })
      } else {
        this.setState({
          showedComponent: this.prepareSuccessMessage(),
        }, () => {
          setTimeout(() => {
            this.props.history.push('/')
          }, 3000)

        })
      }
    })
  }

  prepareErrorMessage = (message) => {
    return (
      <Row>
        <Alert
          message="SERVER ERROR"
          description={message}
          type="error"
          closable
        />
        <h4 className="bold go-home-link">Go to <Link to="/">Home Page</Link></h4>
      </Row>
    )
  }

  prepareSuccessMessage = () => {
    return (
      <Row>
        <Alert
          message="SUCCESS"
          description="Пароль изменен успешно"
          type="success"
          closable
        />
      </Row>
    )
  }

  render() {
    return (
      <div className="ResetPasswordPage">
        {this.state.showedComponent}
      </div>
    )
  }
}

function mapStateToProps({
                           auth,
                         }) {
  return {
    resetCheckTokenDataErrorStatus: auth.resetCheckTokenDataErrorStatus,
    resetCheckTokenDataErrorMessage: auth.resetCheckTokenDataErrorMessage,
    resetSavedPassDataErrorStatus: auth.resetCheckTokenDataErrorMessage,
    resetSavedPassDataErrorMessage: auth.resetSavedPassDataErrorMessage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetCheckToken: bindActionCreators(resetCheckToken, dispatch),
    resetSaveNewPass: bindActionCreators(resetSaveNewPass, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPage)