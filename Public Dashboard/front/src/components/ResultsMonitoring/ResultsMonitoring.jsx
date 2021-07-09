import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import * as dayjs from 'dayjs'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MOBILE_BAR_CHART_OPTIONS, RESULT_MONITORING_TYPES } from '../../constants'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import ukraine from '../../helpers/ukraine.json'
import _ from 'lodash'
import { getDataResultsMonitoringPage } from '../../redux/actions/monitoringActions'
import 'moment/locale/uk'
import './styles.scss'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import SwitchCustom from '../SwitchCustom/SwitchCustom'
import Instruction from '../Instruction/Instruction'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const ResultsMonitoring = () => {
  const dispatch = useDispatch()
  const resultsMonitoringData = useSelector(state => state.monitoringStore.resultsMonitoringData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const resultsMapRef = useRef(null)
  const resultsPieRef = useRef(null)
  const resultsLineRef = useRef(null)
  const [region, setRegion] = useState([])
  const [period, setPeriod] = useState([startDate, endDate])
  const [toggleSwitcher, setToggleSwitcher] = useState(true)
  const [selectedRegionsId, setSelectedRegionsId] = useState([])
  const [mapChartData, setMapChartData] = useState([])
  const [regionsIdFromSelect, setRegionsIdFromSelect] = useState([])
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const mobile = currentWidth <= 768

  useEffect(() => {
    dispatch(getDataResultsMonitoringPage(period[0], period[1], selectedRegionsId))
  }, [period, selectedRegionsId])

  useEffect(() => {
    if (!_.isEqual(mapChartData, resultsMonitoringData.regions)) {
      setMapChartData(resultsMonitoringData.regions)
    }
  }, [resultsMonitoringData])

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const prepareTooltip = (tooltipData, fieldName) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            {tooltipData.name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            {toggleSwitcher ? (fieldName === 'size' ? 'Кількість моніторингів:' : 'Кількість процедур:') : 'Сума процедур:'}
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {toggleSwitcher ? numeral(tooltipData[fieldName]).format('0,0') : `${numeral(tooltipData[fieldName]).format('0.00 a')} грн`}
          </div>
        </div>
      </div>,
    )
  }

  const prepareLineTooltip = (tooltipData, dataKey) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container' style={{ minWidth: '200px' }}>
        <div className='monitoring-types-radar-tooltip-line__stacked_chart'>
          <div className='monitoring-types-radar-tooltip-header'>
            {RESULT_MONITORING_TYPES[dataKey].name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line__stacked_chart'>
          <div className="monitoring-types-radar-tooltip-title__stacked_chart">
            {toggleSwitcher ? 'Кількість процедур:' : 'Сума процедур:'}
          </div>
          <div className='monitoring-types-radar-tooltip-value__stacked_chart'>
            {toggleSwitcher ? numeral(tooltipData[dataKey]).format('0,0') : `${numeral(tooltipData[dataKey]).format('0.00 a')} грн`}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line__stacked_chart'>
          <div className="monitoring-types-radar-tooltip-title__stacked_chart">
            Доля процедур:
          </div>
          <div className='monitoring-types-radar-tooltip-value__stacked_chart'>
            {numeral(tooltipData[`${dataKey}_percent`]).format('0[.]00')}%
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line__stacked_chart'>
          <div className="monitoring-types-radar-tooltip-title__stacked_chart">
            Період:
          </div>
          <div className='monitoring-types-radar-tooltip-value__stacked_chart'>
            {dayjs(tooltipData.date).format('MM.YYYY')}
          </div>
        </div>
      </div>,
    )
  }

  const preparedPieChartData = () => {
    let composedData = []
    let totalCount = _.reduce(resultsMonitoringData.distributions, function (memo, item) {
      return memo + (toggleSwitcher ? item.tendersCount : item.amount)
    }, 0)

    _.forEach(resultsMonitoringData.distributions, (item) => {
      let type = ''
      let elementIndex = -1
      if (item.monitoringResult === 'addressed') {
        elementIndex = _.findIndex(composedData, { type: 'completed' })
        type = 'completed'
      } else if (item.monitoringResult === 'declined') {
        elementIndex = _.findIndex(composedData, { type: 'closed' })
        type = 'closed'
      } else if (item.monitoringResult === 'stopped') {
        elementIndex = _.findIndex(composedData, { type: 'cancelled' })
        type = 'cancelled'
      } else {
        elementIndex = _.findIndex(composedData, { type: item.monitoringResult })
        type = item.monitoringResult
      }

      if (elementIndex === -1) {
        composedData.push({
          // ...item,
          name: RESULT_MONITORING_TYPES[type].name,
          type: type,
          sector: RESULT_MONITORING_TYPES[type].name,
          size: toggleSwitcher ? item.tendersCount : item.amount,
          amount: toggleSwitcher ? item.tendersCount : `${numeral(item.amount).format('0.00 a')} грн`,
          percent: Math.round((toggleSwitcher ? item.tendersCount : item.amount + Number.EPSILON) * 100) / totalCount,
          // color: MONITORING_TYPES[item.name].color,
        })
      } else {
        composedData[elementIndex].size += toggleSwitcher ? item.tendersCount : item.amount
        composedData[elementIndex].amount = toggleSwitcher ? composedData[elementIndex].size : `${numeral(composedData[elementIndex].size).format('0.00 a')} грн`
        composedData[elementIndex].percent += Math.round((toggleSwitcher ? item.tendersCount : item.amount + Number.EPSILON) * 100) / totalCount
      }
    })

    return composedData
  }

  useLayoutEffect(() => {
    if (mobile) {
      let chart = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'bar-chart', 'XYChart')
      const data = preparedPieChartData()
      chart.height = 50 * data.length

      let prData = data.map((item, index) => {
        return {
          category: index,
          fixedValue: 100,
          leftText: item.name,
          value: item.percent,
          rightText: item.amount,
        }
      })

      chart.data = prData

    }

    return (chart) => {
      chart && chart.dispose()
    }

  })

  useLayoutEffect(() => {
    if (!mobile) {
      let map = am4core.create('results-map-chart', am4maps.MapChart)

      // map.exporting.menu = new am4core.ExportMenu()
      // map.exporting.formatOptions.getKey('csv').disabled = true
      // map.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      map.seriesContainer.draggable = false
      map.seriesContainer.resizable = false
      resultsMapRef.current = map
      // map.geodata = newMapData
      map.geodata = ukraine

      map.projection = new am4maps.projections.Miller()
      map.maxZoomLevel = 1
      map.chartContainer.wheelable = false

      map.events.on('hit', function (event) {
        map.maxZoomLevel = 32
        map.zoomToMapObject(event.target)
        map.maxZoomLevel = 1
      })

      const polygonSeries = map.series.push(new am4maps.MapPolygonSeries())
      polygonSeries.data = mapChartData.map((item) => {
        return {
          id: item.regionId,
          name: _.find(ukraine.features, { 'regionId': item.regionId }).properties.name,
          value: toggleSwitcher ? item.tendersCount : item.amount,
          formattedRegionValue: toggleSwitcher ? numeral(item.tendersCount).format('0,0') : numeral(item.amount).format('0.00 a').split(' ')[0],
        }
      })

      polygonSeries.events.on('inited', () => {
        polygonSeries.mapPolygons.each(polygon => {
          polygon.isActive = _.includes(selectedRegionsId, polygon.dataItem.dataContext.regionId)
          let label = labelSeries.mapImages.create()
          const odesa = polygon.dataItem.dataContext.regionId === 15
          const sumi = polygon.dataItem.dataContext.regionId === 18
          const chernivci = polygon.dataItem.dataContext.regionId === 24
          const kiev = polygon.dataItem.dataContext.regionId === 26
          const kievska = polygon.dataItem.dataContext.regionId === 10
          let state = polygon.dataItem.dataContext.formattedRegionValue

          label.latitude = polygon.visualLatitude
          label.longitude = polygon.visualLongitude
          if (!kiev) {
            label.children.getIndex(0).text = state
          }
          if (odesa) {
            label.dx = 30
          }
          if (sumi) {
            label.dx = -20
            label.dy = 20
          }
          if (chernivci) {
            label.dx = -20
          }
          if (kievska) {
            label.dx = -20
            label.dy = 20
          }
        })
      })

      polygonSeries.mapPolygons.template.strokeWidth = 0.5

      polygonSeries.useGeodata = true

      let polygonTemplate = polygonSeries.mapPolygons.template
      polygonTemplate.tooltipHTML = ''
      polygonSeries.mapPolygons.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTooltip(target.tooltipDataItem.dataContext, 'value')
      })

      let labelSeries = map.series.push(new am4maps.MapImageSeries())
      let labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label)
      labelTemplate.horizontalCenter = 'middle'
      labelTemplate.verticalCenter = 'middle'
      labelTemplate.fontSize = 12
      labelTemplate.fill = '#FFFFFF'
      labelTemplate.nonScaling = true
      labelTemplate.interactionsEnabled = false

      polygonSeries.tooltip.getFillFromObject = false
      polygonSeries.tooltip.background.fill = am4core.color('#FFFFFF')

      let shadow = polygonSeries.filters.push(new am4core.DropShadowFilter())
      shadow.dx = 1
      shadow.dy = 1
      shadow.blur = 1

      polygonSeries.heatRules.push({
        property: 'fill',
        target: polygonSeries.mapPolygons.template,
        'min': am4core.color('#4D7C9F'),
        'max': am4core.color('#003f5f'),
      })

      // const hs = polygonTemplate.states.create('hover')
      // hs.properties.fill = `rgba(30, 101, 146, 0.7)`

      const activeState = polygonTemplate.states.create('active')
      activeState.properties.fill = `#FFB800`

      polygonTemplate.events.on('hit', (ev) => {
        ev.target.isActive = !ev.target.isActive
        let itemsId = []
        _.map(polygonSeries.dataItems.values, item => {
          if (item.mapObject.isActive) {
            const id = item.dataContext.regionId
            itemsId.push(id)
          }
        })

        setSelectedRegionsId(itemsId)
      })

      return () => {
        map.dispose()
      }
    }
  }, [mapChartData, toggleSwitcher])

  useLayoutEffect(() => {
    if (!mobile) {
      const resultsPieChart = am4core.create('results-pie-chart', am4charts.PieChart)

      // resultsPieChart.exporting.menu = new am4core.ExportMenu()
      // resultsPieChart.exporting.formatOptions.getKey('csv').disabled = true
      // resultsPieChart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      resultsPieRef.current = resultsPieChart
      resultsPieChart.numberFormatter.numberFormat = '#.##'
      // resultsPieChart.startAngle = -100
      // resultsPieChart.endAngle = 260

      let totalCount = _.reduce(resultsMonitoringData.distributions, function (memo, item) {
        return memo + (toggleSwitcher ? item.tendersCount : item.amount)
      }, 0)


      // Add data
      resultsPieChart.data = preparedPieChartData()

      // Add label
      resultsPieChart.innerRadius = 50
      const label = resultsPieChart.seriesContainer.createChild(am4core.Label)
      label.text = toggleSwitcher ? numeral(totalCount).format('0,0') : `${numeral(totalCount).format('0.00 a').split(' ')[0]}\n${numeral(totalCount).format('0.00 a').split(' ')[1]}`
      label.horizontalCenter = 'middle'
      label.verticalCenter = 'middle'
      label.fontWeight = 'bold'
      label.fill = '#000000'
      label.fontSize = 18

      const pieSeries = resultsPieChart.series.push(new am4charts.PieSeries())
      pieSeries.calculatePercent = true
      pieSeries.dataFields.value = 'size'
      pieSeries.dataFields.category = 'sector'
      pieSeries.colors.list = [
        am4core.color('#1E6592'),
        am4core.color('#3DCAD4'),
        am4core.color('#CEF1F4'),
      ]

      pieSeries.labels.template.text = '[bold]{value.percent}%[/]\n{sector}'
      pieSeries.fontSize = 14
      pieSeries.labels.template.maxWidth = 130
      pieSeries.labels.template.wrap = true
      pieSeries.labels.template.paddingTop = 0
      pieSeries.labels.template.paddingBottom = 0

      pieSeries.slices.template.tooltipHTML = '<div style=\'font-size:14px; color:#000000; width: 200px; height: 100px\'><b>{sector}</b></div>'
      pieSeries.tooltip.getFillFromObject = false
      pieSeries.tooltip.background.fill = am4core.color('#FFF')

      pieSeries.tooltip.getStrokeFromObject = true
      pieSeries.tooltip.background.strokeWidth = 3
      pieSeries.slices.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTooltip(target.dataItem.dataContext, 'size')
      })
    }

    return (resultsPieChart) => {
      resultsPieChart && resultsPieChart.dispose()
    }
  }, [resultsMonitoringData, toggleSwitcher])

  useLayoutEffect(() => {
    if (!mobile) {
      const resultsLineChart = am4core.create('results-line-chart', am4charts.XYChart)
      resultsLineRef.current = resultsLineChart
      // resultsLineChart.exporting.menu = new am4core.ExportMenu();

      // resultsLineChart.exporting.menu = new am4core.ExportMenu()
      // resultsLineChart.exporting.formatOptions.getKey('csv').disabled = true
      // resultsLineChart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      resultsLineChart.colors.step = 2

      let isLegendVisible = {}

      let templateObject = _.reduce(Object.keys(RESULT_MONITORING_TYPES), function (memo, item) {
        memo = _.merge({}, memo, {
          [item]: 0,
          [`${item}_percent`]: 0,
          [`${item}_color`]: RESULT_MONITORING_TYPES[item].color,
        })

        isLegendVisible = _.merge({}, isLegendVisible, {
          [item]: false,
        })
        return memo
      }, 0)
      let groupData = _.groupBy(resultsMonitoringData.dynamics, 'date')

      resultsLineChart.data = Object.keys(groupData).map((key) => {
        let totalCount = _.reduce(groupData[key], function (memo, item) {
          return memo + (toggleSwitcher ? item.tendersCount : item.amount)
        }, 0)

        let composeData = _.merge({}, templateObject, {
          date: key,
        })
        _.forEach(groupData[key], (item) => {
          let type = item.monitoringResult

          if (item.monitoringResult === 'addressed') {
            type = 'completed'
          } else if (item.monitoringResult === 'declined') {
            type = 'closed'
          } else if (item.monitoringResult === 'stopped') {
            type = 'cancelled'
          }

          composeData[type] += toggleSwitcher ? item.tendersCount : item.amount
          composeData[`${type}_percent`] += Math.round(((toggleSwitcher ? item.tendersCount : item.amount) + Number.EPSILON) * 100) / totalCount
          isLegendVisible[type] = composeData[type] > 0
        })

        return composeData
      })

      const dateAxis = resultsLineChart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.cursorTooltipEnabled = false
      dateAxis.dateFormats.setKey('month', 'MM.YYYY')
      dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
      dateAxis.fontSize = 11
      dateAxis.renderer.labels.template.fill = '#666666'
      dateAxis.renderer.grid.template.disabled = true

      const valueAxis = resultsLineChart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Відсоток'
      valueAxis.title.fontSize = 16
      valueAxis.title.fill = '#666666'
      valueAxis.title.fontWeight = 'bold'
      valueAxis.calculateTotals = true
      valueAxis.min = 0
      valueAxis.max = 100
      valueAxis.strictMinMax = true
      valueAxis.fontSize = 11
      valueAxis.renderer.labels.template.fill = '#666666'
      valueAxis.cursorTooltipEnabled = false
      valueAxis.renderer.grid.template.disabled = true

      resultsLineChart.cursor = new am4charts.XYCursor()
      resultsLineChart.cursor.lineY.disabled = true
      resultsLineChart.cursor.lineX.disabled = true
      resultsLineChart.cursor.behavior = 'none'

      function addSeries(dataKey) {
        let series = new am4charts.LineSeries()
        series.dataFields.dateX = 'date'
        series.dataFields.valueY = `${dataKey}_percent`
        series.name = RESULT_MONITORING_TYPES[dataKey].name
        series.propertyFields.fill = `${dataKey}_color`
        series.propertyFields.stroke = `${dataKey}_color`
        series.fillOpacity = 0.85
        series.strokeOpacity = 0
        series.stacked = true
        series.tooltip.getFillFromObject = false
        series.tooltip.background.fill = am4core.color('#FFF')
        series.tooltip.getStrokeFromObject = true
        series.tooltip.background.strokeWidth = 3
        series.adapter.add('tooltipHTML', function (text, target) {
          if (target.tooltipDataItem.dataContext[dataKey]) {
            return prepareLineTooltip(target.tooltipDataItem.dataContext, dataKey)
          } else {
            return ''
          }
        })

        series.dummyData = {
          fillColor: RESULT_MONITORING_TYPES[dataKey].color,
        }
        // static
        // series.legendSettings.labelText = `asd
        // series.legendDataItem && (series.legendDataItem.fill = RESULT_MONITORING_TYPES[dataKey].color)
        // series.legendDataItem.setProperty('fill', `${dataKey}_color`)
        // series.legendSettings.labelText = `${RESULT_MONITORING_TYPES[dataKey].name}`
        // series.legendSettings.valueText = '123'

        resultsLineChart.series.push(series)
      }

      _.forEach(Object.keys(RESULT_MONITORING_TYPES), (key) => {
        if (isLegendVisible[key]) {
          addSeries(key)
        }
      })

      resultsLineChart.legend = new am4charts.Legend()
      resultsLineChart.legend.events.on('ready', function (ev) {
        ev.target.itemContainers.each(function (item) {
          item.fillOpacity = 1
          item.dataItem.dataContext.legendDataItem.marker.dataItem.marker.dataItem.dataContext.fill = item.dataItem.dataContext.dummyData.fillColor
        })
      })
    }

    return (resultsLineChart) => {
      resultsLineChart && resultsLineChart.dispose()
    }

  }, [resultsMonitoringData, toggleSwitcher])

  return (
    <div className="monitoring-results-container">
      <Row className="monitoring-results-row" justify="center">
        <Col className="monitoring-results-column" xs={24} sm={18} md={18} lg={18} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="period-block-wrapper">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                  </div>
                </Col>
              </Row>
              <InfoBlockHeader
                mainText="Кількість процедур з моніторингами за період"
                infoText="Ви можете обрати період, замовника за місцем реєстрації та відобразити дані за сумою чи кількістю"
                countText=''
                value={numeral(resultsMonitoringData.tendersCount).format('0,0')}
              />
              <SwitchCustom
                regionsOff={true}
                defaultValue={toggleSwitcher}
                handleSwitch={setToggleSwitcher}
              />
              <div className="monitoring-results-chart-wrapper">
                {!mobile && <div className="top-charts-wrapper">
                  <div style={{
                    width: '55%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                    <div className="top-charts-wrapper__chart-title">Регіон замовника</div>
                    <div id="results-map-chart" style={{ width: '100%', height: '500px' }}></div>
                  </div>
                  <div style={{ width: '45%', height: '500px', display: 'flex', alignItems: 'center' }}>
                    <div id="results-pie-chart" style={{ width: '100%' }}></div>
                  </div>
                </div>}
                {!mobile && <div id="results-line-chart" style={{ width: '100%', height: '500px' }}></div>}
                {!mobile && <div id="legend" style={{ width: '100%' }}></div>}
              </div>
              {mobile && <div className="bar-chart-container">
                <div className="bar-chart" id="bar-chart"
                     style={{ width: '100%', height: '200px', position: 'relative' }} />
              </div>}
            </FrontSide>
            <BackSide>
              {!mobile && <Instruction
                mobile={mobile}
                onClick={() => flipRef.current.toggle()}
              />}
            </BackSide>
          </Flippy>
        </Col>
      </Row>
    </div>
  )
}

export default ResultsMonitoring
