import React, {Component} from 'react'
import {hasPermission} from './utils/Permissions'
import {PERMISSIONS} from './components/secutiry/PermissionConstants'
import {withRouter} from 'react-router-dom'

class HomePageSwitcher extends Component {
    componentDidMount() {
        if (hasPermission(PERMISSIONS.adminBase)) {
            this.props.history.push('templates')
        } else {
            this.props.history.push('home')
        }
    }

    render() {
        return (
            <div/>
        )
    }
}

export default withRouter(HomePageSwitcher)
