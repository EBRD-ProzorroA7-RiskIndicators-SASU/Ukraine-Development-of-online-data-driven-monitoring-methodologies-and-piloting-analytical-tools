import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ResourcesTopInfo from '../../components/ResourcesTopInfo/ResourcesTopInfo'
import ResourcesChartPart from '../../components/ResourcesChartPart/ResourcesChartPart'
import CarouselForResourses from '../../components/CarouselForResourses/CarouselForResourses'
import NewPageChartPart from '../../components/NewPageChartPart/NewPageChartPart'
import MarketMonitoringChart from '../../components/MarketMonitoringChart/MarketMonitoringChart'
import RegionsMonitoringChart from '../../components/RegionsMonitoringChart/RegionsMonitoringChart'
import DurationMonitoring from '../../components/DurationMonitoring/DurationMonitoring'
import TypesMonitoring from '../../components/TypesMonitoring/TypesMonitoring'
import ResultsSource from '../../components/ResultsSource/ResultsSource'
import ResultsByOffice from '../../components/ResultsByOffice/ResultsByOffice'
import TypeOfViolation from '../../components/TypeOfViolation/TypeOfViolation'
import ComparativeDynamics from '../../components/ComparativeDynamics/ComparativeDynamics'
import ResultsMonitoring from '../../components/ResultsMonitoring/ResultsMonitoring'
import MonitoringCoverage from '../../pages/MonitoringCoverage/MonitoringCoverage'
import CalculationMethodology from '../CalculationMethodology/CalculationMethodologyPage'
import { CHANGE_AMCHARTS, CHANGE_TOP_SECTION } from '../../constants'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import './styles.scss'

const ResourcesPage = ({ data }) => {
  const mappingsIsLoaded = useSelector(state => state.mappingsStore.mappingsIsLoaded)
  const location = useLocation()
  const currentPath = location.pathname
  const [path, setPath] = useState(location.pathname)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [path])

  useEffect(
    () => {
      setPath(currentPath)
    }, [currentPath],
  )

  const Components = {
    ResourcesChartPart,
    NewPageChartPart,
    MarketMonitoringChart,
    RegionsMonitoringChart,
    DurationMonitoring,
    TypesMonitoring,
    ResultsSource,
    ResultsByOffice,
    TypeOfViolation,
    ComparativeDynamics,
    ResultsMonitoring,
    MonitoringCoverage,
    CalculationMethodology,
  }

  const renderChart = () => {
    let CurrentComponent

    _.map(CHANGE_AMCHARTS, chart => {
      if (chart.path === path) {
        CurrentComponent = chart.component
      }
    })

    const RenderingComponent = Components[CurrentComponent]

    return (
      CurrentComponent && <RenderingComponent />
    )
  }

  const renderTopSection = () => {
    let propsForComponent

    _.map(CHANGE_TOP_SECTION, section => {
      if (section.path === path) {
        propsForComponent = section
      }
    })

    return <ResourcesTopInfo propsForComponent={propsForComponent} propsForTopSection={data} />
  }


  return mappingsIsLoaded ? <>
    {renderTopSection()}
    {renderChart()}
    <CarouselForResourses />
  </> : ''

}

export default ResourcesPage
