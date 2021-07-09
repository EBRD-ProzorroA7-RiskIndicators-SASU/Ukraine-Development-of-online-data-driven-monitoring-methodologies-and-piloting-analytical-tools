import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { getProcessDurationData } from '../../redux/actions/monitoringActions'
import { MOBILE_BAR_CHART_OPTIONS, MONITORING_TYPES } from '../../constants/index'
import ukraine from '../../helpers/ukraine.json'
import _ from 'lodash'
import 'moment/locale/uk'
import './styles.scss'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import Instruction from '../Instruction/Instruction'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const DurationMonitoring = () => {
  const dispatch = useDispatch()
  const processDurationData = useSelector(state => state.monitoringStore.processDurationData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const dumbbellRef = useRef(null)
  const mapTypeChart = useRef(null)
  const [period, setPeriod] = useState([startDate, endDate])
  const [newMapData, setNewMapData] = useState(null)
  const [ukraineMap, setUkraineMap] = useState(null)
  const [selectedRegionsId, setSelectedRegionsId] = useState([])
  const [currentWidth, setCurrentWidth] = useState(null)
  const [toggleExpandRegions, setToggleExpandRegions] = useState(false)
  const w = useWidth()
  const mobile = currentWidth <= 576

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  useEffect(() => {
    dispatch(getProcessDurationData(period[0], period[1], selectedRegionsId))
  }, [period, selectedRegionsId])

  useEffect(() => {
    setUkraineMap(ukraine)
  }, [])

  useEffect(() => {
    if (processDurationData.regions && ukraineMap) {
      const newMapOfUkraine = _.map(ukraineMap.features, (item) => {
        processDurationData.regions && _.merge(_.keyBy(item, 'regionId'), _.keyBy(processDurationData.regions, 'regionId'))
        item.properties.value = item.properties.duration
        return item
      })

      setNewMapData(() => {
        return {
          type: 'FeatureCollection',
          features: newMapOfUkraine,
        }
      })

    }

  }, [processDurationData, ukraineMap, mobile])

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
          let state = polygon.dataItem.dataContext.duration

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
            line-height: 19.5px;
            margin-left: 4px;
          '
        >
        <span
            style='
              font-weight: 400;
              font-size: 12px;
              line-height: 14.63px;
            '
          >Середня тривалість моніторингу - </span>
        <span>
            {value}
          </span>
          <span
            style='
              font-weight: 400;
              font-size: 12px;
              line-height: 14.63px;
            '
          > днів</span>
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

  }, [period, dispatch, newMapData, mobile])

  const prepareDumbbellData = () => {
    return processDurationData.localMethods.map((item) => {
      return {
        category: MONITORING_TYPES.hasOwnProperty(item.name) ? MONITORING_TYPES[item.name].name : item.name,
        open: item.minDuration,
        close: item.maxDuration,
      }
    })
  }

  const prepareTooltip = (tooltipData) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            {tooltipData.category}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Мінімальна тривалість моніторингу:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.open}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Максимальна тривалість моніторингу:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.close}
          </div>
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    if (!mobile) {
      let dumbbellPlot = am4core.create('dumbbell-chart', am4charts.XYChart)

      // dumbbellPlot.exporting.menu = new am4core.ExportMenu()
      // dumbbellPlot.exporting.formatOptions.getKey('csv').disabled = true
      // dumbbellPlot.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      dumbbellRef.current = dumbbellPlot
      dumbbellPlot.maskBullets = false

      // dumbbellPlot.data = data;
      dumbbellPlot.data = prepareDumbbellData()

      const categoryAxis = dumbbellPlot.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.min = 0
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.ticks.template.disabled = true
      categoryAxis.renderer.axisFills.template.disabled = true
      categoryAxis.dataFields.category = 'category'
      categoryAxis.renderer.minGridDistance = 15
      // categoryAxis.renderer.inversed = true
      // categoryAxis.renderer.inside = true
      categoryAxis.renderer.grid.template.strokeDasharray = '1,3'
      categoryAxis.tooltip.disabled = true


      let label = categoryAxis.renderer.labels.template
      label.truncate = true
      label.maxWidth = 180
      label.fontSize = 11
      label.fill = '#666666'

      const valueAxis = dumbbellPlot.xAxes.push(new am4charts.ValueAxis())
      valueAxis.tooltip.disabled = true
      valueAxis.renderer.ticks.template.disabled = true
      valueAxis.renderer.axisFills.template.disabled = true
      valueAxis.renderer.labels.template.fontSize = 11
      valueAxis.renderer.labels.template.fill = '#666666'

      const series = dumbbellPlot.series.push(new am4charts.ColumnSeries())
      series.dataFields.categoryY = 'category'
      series.dataFields.openValueX = 'open'
      series.dataFields.valueX = 'close'
      series.sequencedInterpolation = true
      series.fillOpacity = 0
      series.strokeOpacity = 1
      series.columns.template.height = 2
      series.columns.template.fill = am4core.color('#FFFFFF')
      // series.columns.template.strokeOpacity = 0
      series.tooltip.getFillFromObject = false
      series.tooltip.getStrokeFromObject = true
      series.tooltip.pointerOrientation = 'vertical'
      series.tooltip.label.interactionsEnabled = true
      series.tooltip.keepTargetHover = true
      series.tooltipText = '${valueY}'
      series.adapter.add('tooltipHTML', function (text, target) {
        if (target) {
          if (target.tooltipDataItem) {
            if (target.tooltipDataItem.dataContext) {
              return prepareTooltip(target.tooltipDataItem.dataContext)
            } else {
              return ''
            }
          } else {
            return ''
          }
        } else {
          return ''
        }
      })


      const openBullet = series.bullets.create(am4charts.CircleBullet)
      openBullet.locationX = 1
      openBullet.fill = '#1E6592'
      openBullet.stroke = openBullet.fill
      // openBullet.tooltipText = '${valueY}'
      // openBullet.pointerOrientation = 'vertical'
      // openBullet.adapter.add('tooltipHTML', function (text, target) {
      //   if (target) {
      //     if (target.tooltipDataItem) {
      //       if (target.tooltipDataItem.dataContext) {
      //         return prepareTooltip(target.tooltipDataItem.dataContext)
      //       } else {
      //         return ''
      //       }
      //     } else {
      //       return ''
      //     }
      //   } else {
      //     return ''
      //   }
      // })

      const closeBullet = series.bullets.create(am4charts.CircleBullet)
      closeBullet.fill = '#3DCAD4'
      closeBullet.stroke = closeBullet.fill
      // closeBullet.tooltipText = '${valueY}'
      // closeBullet.pointerOrientation = 'vertical'
      // closeBullet.adapter.add('tooltipHTML', function (text, target) {
      //   if (target) {
      //     if (target.tooltipDataItem) {
      //       if (target.tooltipDataItem.dataContext) {
      //         return prepareTooltip(target.tooltipDataItem.dataContext)
      //       } else {
      //         return ''
      //       }
      //     } else {
      //       return ''
      //     }
      //   } else {
      //     return ''
      //   }
      // })

      // dumbbellPlot.cursor = new am4charts.XYCursor()
      // dumbbellPlot.cursor.behavior = 'zoomY'
      dumbbellPlot.cursor = new am4charts.XYCursor()
      dumbbellPlot.cursor.lineY.disabled = true
      dumbbellPlot.cursor.lineX.disabled = true
      dumbbellPlot.cursor.behavior = 'none'
    }

    return (dumbbellPlot) => {
      dumbbellPlot && dumbbellPlot.dispose()
    }

  }, [processDurationData])

  useLayoutEffect(() => {
    if (mobile && (newMapData && newMapData.hasOwnProperty('features'))) {
      let chart = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'bar-chart', 'XYChart')

      const totalAmount = _.reduce(newMapData.features, (memo, item, ind) => {
        return memo + item.properties.value
      }, 0)

      let prData = newMapData.features.map((item, index) => {
        return {
          category: index,
          fixedValue: 100,
          leftText: item.properties.name,
          // value: item.properties.value,
          value: Math.round((item.properties.value + Number.EPSILON) * 100) / totalAmount,
          rightText: item.properties.value,
        }
      })

      chart.height = 50 * prData.length

      chart.data = prData

    }

    return (chart) => {
      chart && chart.dispose()
    }

  }, [newMapData])

  const toggleRegionsListSize = () => {
    setToggleExpandRegions(prev => !prev)
  }

  return (
    <div className="market-duration-container">
      <Row className="market-duration-row" justify="center">
        <Col className="market-duration-column" xs={24} sm={18} md={18} lg={24} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="market-duration-navigation">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                  </div>
                  <InfoBlockHeader
                    mainText="Час, затрачений на моніторинги за обраний період"
                    infoText="Можете обрати період, і, натискаючи на графіки, підрозділ Держаудитслужби та метод закупівель"
                    countText=''
                    value={numeral(processDurationData.duration).format('0,0')}
                  />
                  <div className="market-duration-charts-wrapper">
                    {!mobile && <div id="map-chart" style={{ width: '50%', height: '700px' }}></div>}
                    {!mobile && <div className="dumbbell-wrapper">
                      <div className="dumbbell-chart-title">
                        Середня тривалість моніторингу по видах процедур
                      </div>
                      <div className="dumbbell-top-side">
                        <div className="left-side">
                          <span className="title">Конкурентні</span>
                          <span className="subtitle">
                            {processDurationData.competitiveDuration} днів
                          </span>
                        </div>
                        <div className="right-side">
                          <span className="title">Не конкурентні</span>
                          <span className="subtitle">
                            {processDurationData.nonCompetitiveDuration} днів
                          </span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center' }}>
                        <div id="dumbbell-chart" style={{ width: '100%', height: '400px' }}></div>
                      </div>
                    </div>}
                  </div>
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

export default DurationMonitoring
