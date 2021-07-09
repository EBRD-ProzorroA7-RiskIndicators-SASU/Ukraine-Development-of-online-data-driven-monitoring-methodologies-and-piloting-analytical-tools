import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
} from 'react-router-dom'

import classnames from 'classnames'
import _ from 'lodash'
import NotFound from '../../pages/error/404/NotFound'

import './PermissionCheck.css'

export const PERMISSION_CHECK_TYPE = {
  disabled: 'disabled',
  hidden: 'hidden',
}

export const PERMISSION_KEYS = {
  GRANTS: 'grants',
  PERMISSIONS: 'permissions',
}

class PermissionCheck extends Component {

  hasPermission = () => {
    const {
      userInfo,
      permission,
      permissions,
      permissionsKey,
      multiplePermissions,
    } = this.props

    if (multiplePermissions) {
      return _.some(permissions, (permission) => _.includes(userInfo.permissions[permissionsKey], permission))
    } else {
      return _.includes(userInfo[permissionsKey], permission)
    }
  }

  renderNoPermissionView = () => {
    if (this.props.type === PERMISSION_CHECK_TYPE.disabled) {
      return (
        <div className={classnames('permission-check disabled', this.props.className)}>
          {this.props.children}
        </div>
      )
    }

    return null
  }

  render() {
    if (this.hasPermission()) {
      return this.props.children
    } else {
      if (this.props.routing) {
        return (<Route component={NotFound} />)
      } else {
        return null
      }
    }
  }
}

PermissionCheck.propTypes = {
  permission: PropTypes.string,
  type: PropTypes.oneOf([PERMISSION_CHECK_TYPE.disabled, PERMISSION_CHECK_TYPE.hidden]),
  permissionsKey: PropTypes.oneOf([PERMISSION_KEYS.GRANTS, PERMISSION_KEYS.PERMISSIONS]),
  multiplePermissions: PropTypes.bool,
  permissions: PropTypes.array,
  className: PropTypes.string,
  routing: PropTypes.bool,
}

PermissionCheck.defaultProps = {
  type: PERMISSION_CHECK_TYPE.disabled,
  permissionsKey: PERMISSION_KEYS.PERMISSIONS,
  multiplePermissions: false,
  className: '',
  routing: false,
}

function mapStateToProps({
                           auth: {
                             userInfo,
                           },
                         }) {
  return {
    userInfo: userInfo,
  }
}

export default connect(
  mapStateToProps,
)(PermissionCheck)
