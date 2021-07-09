import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Icon, Layout, Menu} from 'antd'
import {withTranslate} from 'react-redux-multilingual'
import _ from 'lodash'
import {changeNavigationItem, changeNavigationMenuSize} from '../../redux/action/navigation/NavigationActions'
import {NAVIGATION_BAR_ITEMS} from './NavigationBarConstants'

const {Sider} = Layout
const SubMenu = Menu.SubMenu

class NavigationBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            defaultSelectedKey: props.defaultSelectedKey,
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.defaultSelectedKey, prevProps.defaultSelectedKey)) {
            this.setState({
                defaultSelectedKey: this.props.defaultSelectedKey,
            })
        }
    }

    onCollapse = (collapsed) => {
        if (!collapsed) {
            this.props.changeNavigationMenuSize(300, false)
        } else {
            this.props.changeNavigationMenuSize(80, true)
        }

        this.setState({collapsed})
    }

    handleMenuClick = ({item, key, keyPath}) => {
        this.props.changeNavigationItem(key.toString())
    }

    renderMenuItem = (menuItem) => {
        const {translate, userInfo} = this.props

        if (menuItem.additionalCheck) {
            if (!userInfo[menuItem.additionalCheck[0]]) return null;
        }

        return userInfo.permissions.some(perm => menuItem.permissions.includes(perm)) ? (
            <Menu.Item key={menuItem.key}>
                <Link to={menuItem.path}>
                    <Icon type={menuItem.iconType}/>
                    <span>{translate(menuItem.translationKey)}</span>
                </Link>
            </Menu.Item>
        ) : null
    }

    renderSubMenuItem = (menuItem) => {
        const {translate} = this.props
        return (
            <SubMenu key={menuItem.key}
                     title={<span><Icon
                         type={menuItem.iconType}/><span>{translate(menuItem.translationKey)}</span></span>}>
                {_.map(menuItem.subMenu, (subItemMenu) => {
                    return this.renderMenuItem(subItemMenu)
                })}
            </SubMenu>
        )
    }

    prepareMenu = () => {

        return _.map(NAVIGATION_BAR_ITEMS, (menuItem) => {
                if (!_.isEmpty(menuItem.subMenu)) {
                    return _.includes(menuItem.permissions, this.props.userInfo.permissions[0]) ? this.renderSubMenuItem(menuItem) : null
                } else {
                    return this.renderMenuItem(menuItem)
                }
            },
        )
    }

    render() {
        let defaultSelectedKeys = []
        defaultSelectedKeys.push(this.state.defaultSelectedKey)
        return (
            <Sider
                collapsible
                collapsed={this.props.collapsed}
                onCollapse={this.onCollapse}
                width={this.props.defaultMenuSize}
                style={{
                    overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
                }}
            >
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={defaultSelectedKeys}
                    onClick={this.handleMenuClick}
                >
                    {this.prepareMenu()}
                </Menu>
            </Sider>
        )
    }
}

function mapStateToProps({
                             navigationStore,
                             auth,
                         }) {
    return {
        defaultSelectedKey: navigationStore.defaultSelectedKey,
        defaultMenuSize: navigationStore.defaultMenuSize,
        collapsed: navigationStore.collapsed,
        userInfo: auth.userInfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
        changeNavigationMenuSize: bindActionCreators(changeNavigationMenuSize, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslate(NavigationBar))

