import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useLocation } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import ResourcesPage from './pages/ResourcesPage/ResourcesPage'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Spin } from 'antd'
import { Preloader } from './assets/icons'
import { MONITORING, RESOURCES, PROCEDURES, HOMEPAGE } from './constants/index'
import { getMappingsData } from './redux/actions/mappingsActions'
import _ from 'lodash'
import * as dayjs from 'dayjs'
import * as am4core from '@amcharts/amcharts4/core'
import uk from 'dayjs/locale/uk'

dayjs.locale('uk')


const App = () => {
  am4core.addLicense('CH270441821')
  am4core.addLicense('MP270441821')
  am4core.options.animationsEnabled = false
  const dispatch = useDispatch()
  const mappingsIsLoaded = useSelector(state => state.mappingsStore.mappingsIsLoaded)
  const isLoadingMainPage = useSelector(state => state.mainPageData.isLoading)
  const dataForResourcesPage = useSelector(state => state.resourcesPageData && state.resourcesPageData.resourcesData)
  const dataForComparativeDynamicsPage = useSelector(state => state.comparativeDynamicsPageData && state.comparativeDynamicsPageData.comparativeData)
  const dataForMonitoringMarketPage = useSelector(state => state.monitoringMarketPageData && state.monitoringMarketPageData.monitoringMarketData)
  const dataForMonitoringRegionsPage = useSelector(state => state.monitoringRegionsPageData && state.monitoringRegionsPageData.monitoringRegionsData)
  const dataForMonitoringTypesPage = useSelector(state => state.monitoringTypesPageStore && state.monitoringTypesPageStore.monitoringTypesData)
  const monitoringCoverageData = useSelector(state => state.monitoringStore.monitoringCoverageData)
  const resultMonitoringData = useSelector(state => state.monitoringStore.resultsMonitoringData)
  const resultsByOfficesData = useSelector(state => state.monitoringStore.resultsByOffices)
  const typeOfViolationData = useSelector(state => state.monitoringStore.typeOfViolationData)
  const resultSourcesData = useSelector(state => state.monitoringStore.resultSourcesData)
  const processDurationData = useSelector(state => state.monitoringStore.processDurationData)
  const isLoadingMonitoringTypesPage = useSelector(state => state.monitoringTypesPageStore && state.monitoringTypesPageStore.isLoading)
  const isLoadingMonitoringCoveragePage = useSelector(state => state.monitoringStore && state.monitoringStore.isLoading)
  const isLoadingResourcesPage = useSelector(state => state.resourcesPageData.isLoading)
  const isLoadingComparativeDynamicsPage = useSelector(state => state.comparativeDynamicsPageData.isLoading)
  const isLoadingMonitoringMarketPage = useSelector(state => state.monitoringMarketPageData.isLoading)
  const isLoadingMonitoringRegionsPage = useSelector(state => state.monitoringRegionsPageData.isLoading)
  const spinning =
    isLoadingMainPage ||
    isLoadingResourcesPage ||
    isLoadingComparativeDynamicsPage ||
    isLoadingMonitoringMarketPage ||
    isLoadingMonitoringRegionsPage ||
    isLoadingMonitoringTypesPage ||
    isLoadingMonitoringCoveragePage ||
    !mappingsIsLoaded
  const icon = <Preloader />

  const location = useLocation()
  const currentPath = location.pathname
  const [path, setPath] = useState(null)
  const allRoutes = _.concat(MONITORING, RESOURCES, PROCEDURES, HOMEPAGE)

  useEffect(
    () => {
      setPath(currentPath)
    }, [currentPath],
  )

  useEffect(
    () => {
      if (!mappingsIsLoaded) {
        dispatch(getMappingsData())
      }
    }, [mappingsIsLoaded],
  )

  const checkCurrentPath = _.filter(allRoutes, route => route.link === path)
  const pageIsNotFound = _.isEmpty(checkCurrentPath)

  useEffect(() => {
    const pageNotFoundDomElement = document.getElementById('root')
    if (pageIsNotFound) {
      pageNotFoundDomElement.classList.add('not-found')
    } else {
      pageNotFoundDomElement.classList.remove('not-found')
    }
  }, [pageIsNotFound])

  return (
    <Spin wrapperClassName={`${pageIsNotFound ? 'page-not-found' : ''}`} indicator={icon} spinning={spinning}
          style={{ position: 'fixed' }}>
      {!pageIsNotFound && <Header />}
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/resources' render={() => <ResourcesPage data={dataForResourcesPage} />} />
        <Route exact path='/new-page' component={ResourcesPage} />
        <Route exact path='/monitoring-market' render={() => <ResourcesPage data={dataForMonitoringMarketPage} />} />
        <Route exact path='/monitoring-regions' render={() => <ResourcesPage data={dataForMonitoringRegionsPage} />} />
        <Route exact path='/monitoring-duration' render={() => <ResourcesPage data={processDurationData} />} />
        <Route exact path='/monitoring-procurement-methods'
               render={() => <ResourcesPage data={dataForMonitoringTypesPage} />} />
        <Route exact path='/monitoring-coverage' render={() => <ResourcesPage data={monitoringCoverageData} />} />
        <Route exact path='/results-by-office' render={() => <ResourcesPage data={resultsByOfficesData} />} />
        <Route exact path='/type-of-violation' render={() => <ResourcesPage data={typeOfViolationData} />} />
        <Route exact path='/results-source' render={() => <ResourcesPage data={resultSourcesData} />} />
        <Route exact path='/comparative-dynamics'
               render={() => <ResourcesPage data={dataForComparativeDynamicsPage} />} />
        <Route exact path='/monitoring-results' render={() => <ResourcesPage data={resultMonitoringData} />} />
        <Route exact path='/calculation-methodology' render={() => <ResourcesPage data={resultMonitoringData} />} />
        <Route component={PageNotFound} />
      </Switch>
      {!pageIsNotFound && <Footer />}
    </Spin>
  )
}

export default App
