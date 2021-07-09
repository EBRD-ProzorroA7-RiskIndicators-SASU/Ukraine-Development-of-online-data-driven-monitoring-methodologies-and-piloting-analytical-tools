import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Layout, Button, Row, Col, Icon, Empty, ConfigProvider } from 'antd'
import { PublicRoutes, AuthenticatedRoutes } from './routes'
import { withTranslate, IntlActions } from 'react-redux-multilingual'
import Highcharts from 'highcharts'
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'
import NavigationBar from './components/navigationBar/NavigationBar'
import FullScreenSpinner from './components/spiner/FullScreenSpinner'
import { logOutUser } from './redux/action/auth/AuthActions'
import { getAllDictionary } from './redux/action/mappings/MappingsActions'
import { changeLocalizationData } from './redux/action/localization/LocalizationActions'
import BreadcrumbsComponent from './components/navigationBar/BreadcrumbsComponent'
import ResetPage from './pages/login/reset/ResetPage'

const { Header, Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)

    if (typeof Highcharts === 'object') {
      NoDataToDisplay(Highcharts)
    }

    Highcharts.setOptions({
      lang: {
        numericSymbols: props.HighchartsLangNumericSymbols,
        noData: renderToString(<Empty image={Empty.PRESENTED_IMAGE_DEFAULT}
                                      description={props.translate('empty_table_data_name')} />),
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030',
        },
        useHTML: true,
      },
    })

    this.state = {
      mappingLoaded: false,
    }
    // this.changeLocalization(process.env.REACT_APP_DEFAULT_LOCALE)
    // props.changeLocalizationData(process.env.REACT_APP_DEFAULT_LOCALE)
  }

  logoutUser = () => {
    Promise.resolve(this.props.logOutUser()).then(() => {
      this.props.history.push({
        pathname: '/',
        state: {},
      })
    })
  }

  changeLocalization = (localeTitle) => {
    const { IntlActions } = this.props
    IntlActions.setLocale(localeTitle)
    this.props.changeLocalizationData(localeTitle)
  }

  renderEmptyComponent = () => {
    const { translate } = this.props
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('empty_data_name')} />
    )
  }

  renderAuthenticatedPage = () => {
    const { translate, defaultMenuSize, userInfo, defaultLocaleObject } = this.props

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <ConfigProvider renderEmpty={() => this.renderEmptyComponent()} locale={defaultLocaleObject}>
          <FullScreenSpinner>
            <NavigationBar />
            <Layout style={{ marginLeft: defaultMenuSize }}>
              <Header style={{ background: '#fff', padding: '0 15px' }}>
                <Row type="flex">
                  <Col span={12}>
                    <BreadcrumbsComponent />
                  </Col>
                  <Col span={8}>
                    <div style={{ float: 'right' }}>
                      <Icon type="user" />
                      <span style={{ marginLeft: 5 }}>{userInfo.sub}</span>
                      <Button type='button' style={{ marginLeft: 5 }}
                              onClick={e => this.logoutUser()}>{translate('logout_title')}
                        <Icon type="export" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Header>
              <Content className="App" style={{
                margin: '24px 16px', padding: 24, background: '#fff', minHeight: 'calc(85vh)',
              }}>
                {AuthenticatedRoutes()}
              </Content>
            </Layout>
          </FullScreenSpinner>
        </ConfigProvider>
      </Layout>
    )
  }

  render() {
    if(this.props.history.location.pathname === '/reset-password') {
      return (
        <ResetPage {...this.props}/>
      )
    } else {
      if (this.props.token) {
        if (this.state.mappingLoaded) {
          return this.renderAuthenticatedPage()
        } else {
          Promise.resolve(this.props.getAllDictionary()).then(() => {
            this.setState({
              mappingLoaded: true,
            })
          })
        }
      } else {
        return <PublicRoutes />
      }
    }

    return null
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logOutUser: bindActionCreators(logOutUser, dispatch),
    IntlActions: bindActionCreators(IntlActions, dispatch),
    changeLocalizationData: bindActionCreators(changeLocalizationData, dispatch),
    getAllDictionary: bindActionCreators(getAllDictionary, dispatch),
  }
}

function mapStateToProps({
                           auth: {
                             token,
                             userInfo,
                           },
                           localizationStore,
                           navigationStore,
                         }) {
  return {
    token,
    userInfo,
    datePickerLocaleTitle: localizationStore.datePickerLocaleTitle,
    HighchartsLangNumericSymbols: localizationStore.HighchartsLangNumericSymbols,
    defaultLocaleObject: localizationStore.defaultLocaleObject,
    defaultMenuSize: navigationStore.defaultMenuSize,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(App))
