import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import * as numeral from 'numeral'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import ukraine from '../../helpers/ukraine.json'
import useWidth from '../../hooks/useWidth'
import { getDataForResourcesPage } from '../../redux/actions/resourcesPageActions'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Instruction from '../Instruction/Instruction'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import { MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import _ from 'lodash'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import './styles.scss'

numeral.locale('ua')
dayjs.extend(relativeTime)

am4core.useTheme(am4themes_animated)

const ResourcesChartPart = () => {
  const dispatch = useDispatch()
  const dataForMap = useSelector(state => state.resourcesPageData.resourcesData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const lineChartRef = useRef(null)
  const mapChartRef = useRef(null)
  const w = useWidth()
  const [ukraineMap, setUkraineMap] = useState(null)
  const [currentWidth, setCurrentWidth] = useState(null)
  const [period, setPeriod] = useState([startDate, endDate])
  const [newMapData, setNewMapData] = useState(null)
  const [toggleExpandRegions, setToggleExpandRegions] = useState(false)
  const [auditorsForRegions, setAuditorsForRegions] = useState([])
  const [fakeDate, setFakeDate] = useState([])
  const [selectedRegionsId, setSelectedRegionsId] = useState([])
  const mobile = currentWidth <= 768

  const { auditorsCountByMonth, auditorsCountByRegion } = !_.isEmpty(dataForMap) && dataForMap

  const generateDateByPeriod = (startDate) => {
    let datePeriods = []

    for (let i = 0; i <= 11; i++) {
      datePeriods.push(dayjs(startDate).add(i, 'month').startOf().format('YYYY-MM'))
    }

    setFakeDate(datePeriods)
  }

  useEffect(() => {
    generateDateByPeriod(period[0])
  }, [period])

  useEffect(() => {
    setUkraineMap(ukraine)
  }, [])

  useEffect(() => {
    if (auditorsCountByMonth) {
      filteredRegionsById()
    }

  }, [auditorsCountByMonth])

  useEffect(() => {
    dispatch(getDataForResourcesPage(period[0], period[1]))
    // dispatch(setCurrentDate(`${previousYear}-01-01`, `${nextYear}-01-01`))
  }, [dispatch, period])

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  useEffect(() => {
    if (auditorsCountByRegion && ukraineMap) {
      const newMapOfUkraine = _.map(ukraineMap.features, (item) => {
        auditorsCountByRegion && _.merge(_.keyBy(item, 'regionId'), _.keyBy(auditorsCountByRegion, 'regionId'))
        const auditors = item.properties.auditorsCount
        item.properties.value = auditors
        return item
      })

      setNewMapData(() => {
        return {
          type: 'FeatureCollection',
          features: newMapOfUkraine,
        }
      })

    }

  }, [auditorsCountByRegion, ukraineMap, mobile, toggleExpandRegions])

  useEffect(() => {
    if (!mobile) {
      let map = am4core.create('chartdiv', am4maps.MapChart)

      // map.exporting.menu = new am4core.ExportMenu()
      // map.exporting.formatOptions.getKey('csv').disabled = true
      // map.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      // map.exporting.menu = new am4core.ExportMenu()
      // map.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]
      // map.exporting.adapter.add('data', (data => {
      //   data.data = [];
      //   data.data = [{
      //     asd: 'dsa'
      //   }];
      //   return data;
      // }));
      map.seriesContainer.draggable = false
      map.seriesContainer.resizable = false
      mapChartRef.current = map
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
          let label = labelSeries.mapImages.create()
          const odesa = polygon.dataItem.dataContext.regionId === 15
          const sumi = polygon.dataItem.dataContext.regionId === 18
          const chernivci = polygon.dataItem.dataContext.regionId === 24
          const kiev = polygon.dataItem.dataContext.regionId === 26
          const kievska = polygon.dataItem.dataContext.regionId === 10
          let state = polygon.dataItem.dataContext.auditorsCount

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
          >
            Кількість аудиторів:
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
        'min': am4core.color('rgba(30, 101, 146, 1)'),
        'max': am4core.color('rgba(30, 101, 146, 0.6'),
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

        filteredRegionsById(itemsId)

        setSelectedRegionsId(itemsId)

      })

      return () => {
        map.dispose()
      }
    }

  }, [period, dispatch, newMapData, mobile])

  useLayoutEffect(() => {
    if (!mobile) {
      const container = am4core.create('line-chart', am4core.Container)
      // container.exporting.menu = new am4core.ExportMenu()
      // container.exporting.formatOptions.getKey('csv').disabled = true
      // container.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]
      // container.exporting.adapter.add('data', (data => {
      //   data.data = auditorsForRegions.map((item) => {
      //     return {
      //       // 'Дата': dayjs(item.date).format('MM.YYYY'),
      //       'Дата': item.date,
      //       'Кількість аудиторів': item.auditorsCount,
      //     }
      //   })
      //   return data
      // }))

      lineChartRef.current = container
      container.layout = 'grid'
      container.fixedWidthGrid = false
      container.width = am4core.percent(100)
      container.height = am4core.percent(100)

      const chart = container.createChild(am4charts.XYChart)
      chart.width = am4core.percent(100)
      chart.height = 200
      // chart.width = 910

      chart.data = auditorsForRegions

      chart.titles.template.fontSize = 10
      chart.titles.template.textAlign = 'left'
      chart.titles.template.isMeasured = false

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.renderer.grid.template.disabled = true
      // dateAxis.renderer.labels.template.disabled = false
      dateAxis.startLocation = 0.2
      dateAxis.endLocation = 1.3
      dateAxis.cursorTooltipEnabled = false
      dateAxis.dateFormats.setKey('month', 'MM.YYYY')
      dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
      dateAxis.fontSize = 11
      dateAxis.renderer.labels.template.fill = '#666666'

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      // valueAxis.min = 0
      valueAxis.renderer.grid.template.disabled = false
      valueAxis.renderer.baseGrid.disabled = true
      valueAxis.renderer.labels.template.disabled = true
      valueAxis.cursorTooltipEnabled = false

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.lineX.disabled = true
      chart.cursor.behavior = 'none'

      const series = chart.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'date'
      series.dataFields.valueY = 'auditorsCount'
      series.tensionX = 0.8
      series.strokeWidth = 2
      series.stroke = '#FFB800'
      series.tooltipHTML = `<div 
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
        <span
          style='
            display: flex;
            align-items: center;
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
              margin-right: 4px;
            '
          >
            Кількість аудиторів:
          </span>
          {auditorsCount}
        </span>
      </div>`

      series.tooltip.getFillFromObject = false
      series.tooltip.background.fill = am4core.color('#FFFFFF')

      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color('#FFB800')
      bullet.fill = am4core.color('#FFFFFF')
      bullet.circle.strokeWidth = 2
      bullet.fillOpacity = 0
      bullet.strokeOpacity = 0

      let shadow = series.filters.push(new am4core.DropShadowFilter())
      shadow.dx = 15
      shadow.dy = 10
      shadow.blur = 6

      const bulletState = bullet.states.create('hover')
      bulletState.properties.fillOpacity = 1
      bulletState.properties.strokeOpacity = 1


      return (container) => {
        container && container.dispose()
      }
    }
  }, [auditorsForRegions, mobile])

  useLayoutEffect(() => {
    if (mobile && (newMapData && newMapData.hasOwnProperty('features'))) {
      let chart = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'bar-chart', 'XYChart')

      let prData = newMapData.features.map((item, index) => {
        return {
          category: index,
          fixedValue: 100,
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

  const toggleRegionsListSize = () => {
    setToggleExpandRegions(prev => !prev)
  }

  const filteredRegionsById = (itemsId = []) => {
    const actualData = !_.isEmpty(itemsId) ? _.filter(auditorsCountByMonth, item => _.includes(itemsId, item.regionId)) : auditorsCountByMonth
    let selectedRegions = _.groupBy(actualData, 'date')

    let dataSourse = []

    _.forEach(fakeDate, date => {
      if (_.includes(Object.keys(selectedRegions), date)) {
        let auditorsCount = 0

        _.forEach(selectedRegions[date], item => auditorsCount += item.auditorsCount)

        dataSourse.push({
          date: new Date(date),
          auditorsCount,
        })
      } else {
        dataSourse.push({
          date: new Date(date),
          auditorsCount: 0,
        })
      }

    })

    setAuditorsForRegions(dataSourse)
  }

  return (
    <div className="resourses-chart-container">
      <Row className="resourses-chart-wrapper" justify="center">
        <Col className="resourses-chart-column" xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="middle-block-container">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                    <div>
                      <InfoBlockHeader
                        // mainText="Кількість аудиторів у конкретний період"
                        mainText="Кількість аудиторів, які здійснювали моніторинг у відповідному періоді"
                        infoText="Можете обирати різні області та періоди для перегляду потрібної інформації"
                        countText='Кількість аудиторів'
                        value={numeral(dataForMap.auditorsCount).format('0,0')}
                        noMainPadding={true}
                      />
                    </div>
                    {/*<div className="resourses-chart" />*/}
                    {!mobile && <div className="map-chart-container">
                      <div className="map-chart-container__chart-title" />
                      <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
                    </div>}
                    {!mobile && <div className="line-chart-wrapper">
                    <span className="chart-title">
                      Кількість аудиторів що проводили моніторинги
                    </span>
                      <div id="line-chart" style={{ width: '1040px', height: '200px' }}></div>
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
                  </div>
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

export default ResourcesChartPart
