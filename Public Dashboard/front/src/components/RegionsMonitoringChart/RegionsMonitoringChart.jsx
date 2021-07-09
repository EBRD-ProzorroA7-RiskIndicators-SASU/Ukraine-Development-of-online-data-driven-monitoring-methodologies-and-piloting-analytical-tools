import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Radio } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import ukraine from './ukraine.json'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  getDataMonitoringRegionsPage,
} from '../../redux/actions/monitoringRegionsActions'
import Instruction from '../Instruction/Instruction'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import _ from 'lodash'
import 'moment/locale/uk'
import './styles.scss'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import SwitchCustom from '../SwitchCustom/SwitchCustom'
import { renderToString } from 'react-dom/server'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)
dayjs.extend(relativeTime)

const RegionsMonitoringChart = () => {
  const dispatch = useDispatch()
  const dataForMapChart = useSelector(state => state.monitoringRegionsPageData.monitoringRegionsData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const mapTypeChart = useRef(null)
  const barTypeChart = useRef(null)
  const [region, setRegion] = useState([])
  const [mapChartData, setMapChartData] = useState(null)
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const mobile = currentWidth <= 768
  const [ukraineMap, setUkraineMap] = useState(null)
  const [newMapData, setNewMapData] = useState(null)
  const [selectedRegionsId, setSelectedRegionsId] = useState([])
  const [period, setPeriod] = useState([startDate, endDate])
  const [countSwitcher, setCountSwitcher] = useState('tendersCount')
  const [toggleExpandRegions, setToggleExpandRegions] = useState(false)
  const { procuringEntitiesCountByRegion } = !_.isEmpty(mapChartData) && mapChartData

  useEffect(() => {
    dispatch(getDataMonitoringRegionsPage(period[0], period[1], region, selectedRegionsId))
  }, [dispatch, period, region, selectedRegionsId])

  useEffect(() => {
    setMapChartData(dataForMapChart)
  }, [dataForMapChart])

  useEffect(() => {
    setUkraineMap(ukraine)
  }, [])

  useEffect(() => {
    if (procuringEntitiesCountByRegion && ukraineMap) {
      const newMapOfUkraine = _.map(ukraineMap.features, (item) => {
        procuringEntitiesCountByRegion && _.merge(_.keyBy(item, 'regionId'), _.keyBy(procuringEntitiesCountByRegion, 'regionId'))
        item.properties.value = item.properties.procuringEntitiesCount
        return item
      })

      setNewMapData(() => {
        return {
          type: 'FeatureCollection',
          features: newMapOfUkraine,
        }
      })

    }

  }, [procuringEntitiesCountByRegion, ukraineMap])

  useLayoutEffect(() => {
    if (mobile && (newMapData && newMapData.hasOwnProperty('features'))) {
      let totalCountMax = _.reduce(procuringEntitiesCountByRegion, function (memo, item) {
        memo = item.procuringEntitiesCount > memo ? item.procuringEntitiesCount : memo
        return memo
      }, 0)

      let clonedChartOptions = _.cloneDeep(MOBILE_BAR_CHART_OPTIONS)
      clonedChartOptions.xAxes[0].max = totalCountMax * 1.2

      let chart = am4core.createFromConfig(clonedChartOptions, 'bar-chart', 'XYChart')

      let prData = newMapData.features.map((item, index) => {
        return {
          category: index,
          fixedValue: totalCountMax * 1.2,
          leftText: item.properties.name,
          value: item.properties.value,
          rightText: item.properties.value,
        }
      })

      chart.height = 50 * prData.length

      chart.data = prData


      return (chart) => {
        chart && chart.dispose()
      }

    }
  }, [newMapData])


  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  useEffect(() => {
    if (!mobile) {
      let map = am4core.create('map-chart', am4maps.MapChart)

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
      mapTypeChart.current = map
      map.geodata = newMapData

      map.projection = new am4maps.projections.Miller()
      map.maxZoomLevel = 1
      map.chartContainer.wheelable = false

      map.events.on('hit', function (event) {
        map.maxZoomLevel = 32
        map.zoomToMapObject(event.target)
        map.maxZoomLevel = 1
      })

      const polygonSeries = map.series.push(new am4maps.MapPolygonSeries())

      polygonSeries.mapPolygons.template.strokeWidth = 0.5

      polygonSeries.useGeodata = true

      const polygonTemplate = polygonSeries.mapPolygons.template

      let labelSeries = map.series.push(new am4maps.MapImageSeries())
      let labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label)
      labelTemplate.horizontalCenter = 'middle'
      labelTemplate.verticalCenter = 'middle'
      labelTemplate.fontSize = 12
      labelTemplate.fill = '#FFFFFF'
      labelTemplate.nonScaling = true
      labelTemplate.interactionsEnabled = false

      polygonSeries.events.on('inited', () => {
        polygonSeries.mapPolygons.each(polygon => {
          polygon.isActive = _.includes(selectedRegionsId, polygon.dataItem.dataContext.regionId)
          let label = labelSeries.mapImages.create()
          const odesa = polygon.dataItem.dataContext.regionId === 15
          const sumi = polygon.dataItem.dataContext.regionId === 18
          const chernivci = polygon.dataItem.dataContext.regionId === 24
          const kiev = polygon.dataItem.dataContext.regionId === 26
          const kievska = polygon.dataItem.dataContext.regionId === 10
          let state = polygon.dataItem.dataContext.procuringEntitiesCount

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

      polygonTemplate.tooltipHTML = `<div 
      style='
        width: fit-content; 
        height: 40px; 
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: center;
        font-size:12px;
        font-weight: 600;
        color:#000000;'
        >
        {name}
        <span
          style='
            margin-top: 4px;
            font-weight: 700;
            font-size: 16px;
            line-height: 19,5px;
            margin-left: 4px;
          '
        >
        <span
            style='
              font-weight: 400;
              font-size: 12px;
              line-height: 14,63px;
            '
          >
            Кількість замовників:
          </span>
          {value}
        </span>
      </div>`

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
        // 'min': am4core.color('rgba(30, 101, 146, 1)'),
        // 'max': am4core.color('rgba(30, 101, 146, 0.6'),
      })

      const hs = polygonTemplate.states.create('hover')
      hs.properties.fill = `rgba(30, 101, 146, 0.7)`

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

  }, [dispatch, newMapData, mobile, period])

  const getAuditorsCount = () => {
    const actualAuditorsData = !_.isEmpty(selectedRegionsId) ? _.filter(procuringEntitiesCountByRegion, item => _.includes(selectedRegionsId, item.regionId)) : procuringEntitiesCountByRegion
    let auditorsCount = 0

    _.forEach(actualAuditorsData, item => auditorsCount += item.procuringEntitiesCount)

    return auditorsCount
  }

  const prepareLineTooltip = (tooltipData) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header-line-chart'>
            {tooltipData.name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Роздiл CPV:
          </div>
          <div className='monitoring-types-radar-tooltip-value__custom'>
            {tooltipData.code}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            {countSwitcher === 'tendersCount' ? 'Кількість:' : 'Сума:'}
          </div>
          <div className='monitoring-types-radar-tooltip-value__custom'>
            {countSwitcher === 'tendersCount' ? numeral(tooltipData.value).format('0,0') : `${numeral(tooltipData.value).format('0.00 a')} грн`}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Частка:
          </div>
          <div className='monitoring-types-radar-tooltip-value__custom'>
            {(Math.round(((tooltipData.value + Number.EPSILON) / tooltipData.total) * 100)).toFixed(0)}%
          </div>
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    if (dataForMapChart && !mobile) {
      let chart = am4core.create('bar-chart', am4charts.XYChart)

      // chart.exporting.menu = new am4core.ExportMenu()
      // chart.exporting.formatOptions.getKey('csv').disabled = true
      // chart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      chart.padding(40, 40, 40, 40)
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': ' тис.' },
        { 'number': 1e+6, 'suffix': ' млн.' },
        { 'number': 1e+9, 'suffix': ' млрд.' },
      ]

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.lineX.disabled = true
      chart.cursor.behavior = 'none'

      let selectedData = countSwitcher === 'tendersCount' ? dataForMapChart.topCpv2ByTendersCount : dataForMapChart.topCpv2ByAmount
      let totalData = _.reduce(selectedData, (memo, item, ind) => {
        return memo + (countSwitcher === 'tendersCount' ? item.tendersCount : item.amount)
      }, 0)

      let chartData = selectedData.map((item) => {
        let amountFormatted = countSwitcher === 'tendersCount' ? 0 : `${numeral(item.amount).format('0.00 a')} грн`
        let countFormatted = countSwitcher === 'tendersCount' ? numeral(item.tendersCount).format('0,0') : 0
        let valueFormatted = countSwitcher === 'tendersCount' ? numeral(item.tendersCount).format('0,0') : `${numeral(item.amount).format('0.00 a')} грн`
        let selectedValue = countSwitcher === 'tendersCount' ? item.tendersCount : item.amount
        return {
          ...item,
          value: selectedValue,
          total: totalData,
          percent: (Math.round(((selectedValue + Number.EPSILON) / totalData) * 100)).toFixed(0),
          amountFormatted: amountFormatted,
          countFormatted: countFormatted,
          valueFormatted: valueFormatted,
        }
      })

      chartData = _.sortBy(chartData, ['value'], ['desc'])
      chart.data = chartData

      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      // categoryAxis.renderer.grid.template.location = 0
      categoryAxis.dataFields.category = 'name'
      categoryAxis.cursorTooltipEnabled = false
      categoryAxis.renderer.minGridDistance = 1
      // categoryAxis.renderer.inversed = true
      categoryAxis.renderer.grid.template.disabled = true
      categoryAxis.renderer.labels.template.verticalCenter = 'middle'
      categoryAxis.renderer.labels.template.horizontalCenter = 'right'
      categoryAxis.renderer.labels.template.fontSize = 12
      categoryAxis.renderer.labels.template.adapter.add('textOutput', function (text, target) {
        if (text) {
          return `Роздiл CPV:\n${chartData[target.dataItem.index].code}`
        } else {
          return ''
        }
      })

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.cursorTooltipEnabled = false
      valueAxis.min = 0
      valueAxis.renderer.labels.template.fontSize = 9
      valueAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
        if (text) {
          return countSwitcher === 'tendersCount' ? numeral(Number(text.replaceAll(',', ''))).format('0,0') : numeral(Number(text.replaceAll(',', ''))).format('0.00 a')
        } else {
          return ''
        }
      })

      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.categoryY = 'name'
      series.dataFields.valueX = countSwitcher === 'tendersCount' ? 'tendersCount' : 'amount'
      // series.tooltipText = '{valueX.value}'
      series.columns.template.strokeOpacity = 0
      series.columns.template.column.cornerRadiusBottomRight = 5
      series.columns.template.column.cornerRadiusTopRight = 5
      series.tooltip.getFillFromObject = false
      series.tooltip.getStrokeFromObject = true
      series.tooltip.background.fill = am4core.color('#FFFFFF')
      series.adapter.add('tooltipHTML', function (text, target) {
        return prepareLineTooltip(target.tooltipDataItem.dataContext)
      })

      series.columns.template.adapter.add('fill', function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index)
      })

      let valueLabel = series.bullets.push(new am4charts.LabelBullet())
      valueLabel.label.text = '{percent}%'
      valueLabel.label.fontSize = 20
      valueLabel.label.horizontalCenter = 'right'

      return () => {
        chart && chart.dispose()
      }
    }

  }, [dataForMapChart, countSwitcher, mobile, period])

  const handleCounterSwitch = (e) => {
    const countType = e.target.value

    setCountSwitcher(countType)
  }

  const toggleRegionsListSize = () => {
    setToggleExpandRegions(prev => !prev)
  }

  return (
    <div className="market-regions-container">
      <Row className="market-regions-row" justify="center">
        <Col className="market-regions-column" xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="market-regions-navigation">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                  </div>
                  <InfoBlockHeader
                    // mainText="Кількість замовників, процедури яких моніторили аудитори"
                    mainText="Кількість замовників, процедури яких потрапили під моніторинг"
                    infoText="Оберіть період, територіальний підрозділ Держаудитслужби, замовників за регіоном, показник та подивіться динаміку моніторингів"
                    countText=''
                    value={numeral(getAuditorsCount()).format('0,0')}
                  />
                  {!mobile && <SwitchCustom
                    selectorText="Територіальний підрозділ Держаудитслужби:"
                    switchOff={true}
                    regionIds={region}
                    onChange={setRegion}
                  />}
                  {!mobile && <div className="market-regions-charts-wrapper">
                    <div className="map-chart-container" style={{ height: '700px' }}>
                      <div className="map-chart-container__chart-title">Регіон замовника</div>
                      <div id="map-chart" style={{ width: '100%', height: '500px' }} />
                    </div>
                    <div className="bar-chart-wrapper">
                      <div className="chart-buttons">
                        <Radio.Group defaultValue="tendersCount" optionType="button"
                                     onChange={e => handleCounterSwitch(e)}>
                          <Radio.Button className="left-button group-button" value="amount">Частка за
                            сумою</Radio.Button>
                          <Radio.Button className="right-button group-button" value="tendersCount">Частка за
                            кількістю</Radio.Button>
                        </Radio.Group>
                        <h5 className="chart-title">
                          Сума процедур з моніторингом
                        </h5>
                      </div>
                      <div ref={barTypeChart} id="bar-chart" />
                    </div>
                  </div>}
                  {mobile && <div className={`line-chart-mobile-wrapper ${!toggleExpandRegions ? 'small' : 'large'}`}>
                    <div className="bar-chart-container">
                      <div className="bar-chart" id="bar-chart" style={{
                        width: '100%',
                        height: toggleExpandRegions ? '1300px' : '150px',
                        position: 'relative',
                      }} />
                    </div>
                    <span className="change-size-button" onClick={toggleRegionsListSize}>
                        {!toggleExpandRegions ? 'Показати бiльше' : 'Згорнути'}
                      </span>
                  </div>}
                </Col>
              </Row>
            </FrontSide>
            <BackSide>
              <Instruction
                mobile={mobile}
                onClick={() => flipRef.current.toggle()}
              />
            </BackSide>
          </Flippy>
        </Col>
      </Row>
    </div>
  )
}

export default RegionsMonitoringChart
