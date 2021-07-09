import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import SwitchCustom from '../SwitchCustom/SwitchCustom'
import { Row, Col } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MONITORING_TYPES, MAX_MOBILE_WIDTH, MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import _ from 'lodash'
import 'moment/locale/uk'
import * as dayjs from 'dayjs'
import { getDataMonitoringTypesPage } from '../../redux/actions/monitoringTypesActions'
import { useDispatch, useSelector } from 'react-redux'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import './styles.scss'
import Instruction from '../Instruction/Instruction'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const TypesMonitoring = () => {
  const dispatch = useDispatch()
  const monitoringTypesData = useSelector(state => state.monitoringTypesPageStore.monitoringTypesData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const zoomableRef = useRef(null)
  const lineChartRef = useRef(null)
  const [regionIds, setRegion] = useState([])
  const [toggleSwitcher, setToggleSwitcher] = useState(true)
  const [currentWidth, setCurrentWidth] = useState(window.outerWidth)
  const mobile = currentWidth <= MAX_MOBILE_WIDTH
  const previousYear = dayjs().subtract(1, 'year').format('YYYY')
  const nextYear = dayjs(previousYear).add(1, 'year').format('YYYY')
  const [period, setPeriod] = useState([startDate, endDate])
  const w = useWidth()

  useEffect(() => {
    dispatch(getDataMonitoringTypesPage(period[0], period[1], regionIds))
  }, [previousYear, nextYear, period, regionIds])

  useEffect(() => {
    if (currentWidth !== window.outerWidth) {
      setCurrentWidth(window.outerWidth)
    }
  }, [w])

  useLayoutEffect(() => {
    if (mobile && monitoringTypesData) {
      let clonedChartOptions = _.cloneDeep(MOBILE_BAR_CHART_OPTIONS)
      clonedChartOptions.series[0].bullets[0].label.dy = 0

      let chart = am4core.createFromConfig(clonedChartOptions, 'bar-chart', 'XYChart')
      chart.height = 50 * monitoringTypesData.localMethods.length

      chart.data = monitoringTypesData.localMethods.map((item, index) => {
        return {
          category: index,
          fixedValue: 100,
          leftText: MONITORING_TYPES.hasOwnProperty(item.name) ? MONITORING_TYPES[item.name].name : item.name,
          value: toggleSwitcher ? item.tendersCountPercent : item.amountPercent,
          rightText: toggleSwitcher ? numeral(item.tendersCount).format('0,0') : numeral(item.amount).format('0.00 a'),
        }
      })
    }

    return (chart) => {
      chart && chart.dispose()
    }

  }, [monitoringTypesData, toggleSwitcher])

  const prepareRadarData = () => {
    let sortedData = _.sortBy(monitoringTypesData.localMethods, [toggleSwitcher ? 'tendersCount' : 'amount'], ['desc'])

    return sortedData.map((item) => {
      return {
        ...item,
        name: MONITORING_TYPES.hasOwnProperty(item.name) ? MONITORING_TYPES[item.name].name : item.name,
        percent: toggleSwitcher ? (item.tendersCountPercent !== 0 ? item.tendersCountPercent : 0.5) : (item.amountPercent !== 0 ? item.amountPercent : 0.5),
        // percent: toggleSwitcher ? item.tendersCountPercent : item.amountPercent,
        amount: toggleSwitcher ? item.tendersCount : `${numeral(item.amount).format('0.00 a')} грн`,
        color: MONITORING_TYPES.hasOwnProperty(item.name) ? MONITORING_TYPES[item.name].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
      }
    })
  }

  const prepareLineData = () => {
    return monitoringTypesData.monitoringDynamics.map((item) => {
      let monthName = dayjs(item.date).format('MMMM').charAt(0).toUpperCase() + dayjs(item.date).format('MMMM').slice(1)
      return {
        ...item,
        name: `${monthName} ${dayjs(item.date).format('YYYY')}`,
        date: new Date(item.date),
        value: toggleSwitcher ? item.tendersCount : item.amount,
        color: '#ff0000',
      }
    })
  }

  const prepareRadarTooltip = (tooltipData) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            {tooltipData.name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Процедур з моніторингом:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.amount}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Доля закупівель:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.percent}%
          </div>
        </div>
      </div>,
    )
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
            Процедур з моніторингом:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {toggleSwitcher ? numeral(tooltipData.value).format('0,0') : `${numeral(tooltipData.value).format('0.00 a')} грн`}
          </div>
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    if (!mobile) {
      const chart = am4core.create('zoomable-chart', am4charts.PieChart)
      zoomableRef.current = chart

      // chart.exporting.menu = new am4core.ExportMenu()
      // chart.exporting.formatOptions.getKey('csv').disabled = true
      // chart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      chart.hiddenState.properties.opacity = 0
      chart.innerRadius = am4core.percent(40)
      chart.padding(20, 20, 20, 20)
      chart.data = prepareRadarData()

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries())
      pieSeries.dataFields.value = 'percent'
      pieSeries.dataFields.category = 'name'
      pieSeries.labels.template.text = '{name}'
      pieSeries.labels.template.wrap = true
      pieSeries.labels.template.maxWidth = 130
      pieSeries.slices.template.propertyFields.fill = 'color'
      pieSeries.slices.template.stroke = am4core.color('#fff')
      pieSeries.slices.template.strokeOpacity = 1
      pieSeries.slices.template.strokeWidth = 1
      pieSeries.labels.template.paddingTop = 0
      pieSeries.labels.template.paddingBottom = 0
      pieSeries.labels.template.fontSize = 10

// This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1
      pieSeries.hiddenState.properties.endAngle = -90
      pieSeries.hiddenState.properties.startAngle = -90
      pieSeries.tooltip.getFillFromObject = false
      pieSeries.tooltip.background.fill = '#FFFFFF'
      pieSeries.tooltip.background.fill = '#FFFFFF'
      pieSeries.tooltip.background.cornerRadius = 10
      pieSeries.tooltip.background.strokeOpacity = 0
      // pieSeries.tooltip.pointerOrientation = 'left'
      pieSeries.slices.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareRadarTooltip(target.dataItem.dataContext)
      })

      chart.hiddenState.properties.radius = am4core.percent(0)
    }
    return (chart) => {
      chart && chart.dispose()
    }

  }, [monitoringTypesData, toggleSwitcher, mobile])

  useLayoutEffect(() => {
    if (!mobile) {
      const monitoringDynamics = am4core.create('monitoring-dynamics-chart', am4core.Container)
      lineChartRef.current = monitoringDynamics

      // monitoringDynamics.exporting.menu = new am4core.ExportMenu()
      // monitoringDynamics.exporting.formatOptions.getKey('csv').disabled = true
      // monitoringDynamics.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      monitoringDynamics.layout = 'grid'
      monitoringDynamics.fixedWidthGrid = false
      monitoringDynamics.width = am4core.percent(100)
      monitoringDynamics.height = am4core.percent(100)

      const chart = monitoringDynamics.createChild(am4charts.XYChart)
      // chart.width = am4core.percent(45)
      chart.height = 170
      chart.minWidth = 1000
      chart.data = prepareLineData()
      chart.titles.template.fontSize = 10
      chart.titles.template.textAlign = 'left'
      chart.titles.template.isMeasured = false

      chart.padding(20, 5, 2, 5)

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.cursorTooltipEnabled = false
      dateAxis.dateFormats.setKey('month', 'MM.YYYY')
      dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
      dateAxis.fontSize = 11
      dateAxis.renderer.labels.template.fill = '#666666'

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      valueAxis.renderer.grid.template.disabled = false
      valueAxis.renderer.baseGrid.disabled = true
      valueAxis.renderer.labels.template.disabled = true
      valueAxis.cursorTooltipEnabled = false

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.lineX.disabled = true
      chart.cursor.behavior = 'none'

      const series = chart.series.push(new am4charts.LineSeries())
      series.tooltipText = '{date}: [bold]{value}'
      series.dataFields.dateX = 'date'
      series.dataFields.valueY = 'value'
      series.tensionX = 0.8
      series.strokeWidth = 2
      series.stroke = '#FFB800'
      series.tooltip.getFillFromObject = false
      series.tooltip.background.fill = '#FFFFFF'
      series.tooltip.background.cornerRadius = 10
      series.tooltip.background.strokeOpacity = 0
      series.tooltip.pointerOrientation = 'top'
      series.adapter.add('tooltipHTML', function (text, target) {
        return prepareLineTooltip(target.tooltipDataItem.dataContext)
      })

      let shadow = series.filters.push(new am4core.DropShadowFilter())
      shadow.dx = 15
      shadow.dy = 25
      shadow.blur = 10

      var bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color('#FFB800')
      bullet.circle.fill = '#FFB800'
      bullet.circle.strokeWidth = 2
      bullet.fillOpacity = 0
      bullet.strokeOpacity = 0

      var bulletState = bullet.states.create('hover')
      bulletState.properties.fillOpacity = 1
      bulletState.properties.strokeOpacity = 1
    }

    return (monitoringDynamics) => {
      monitoringDynamics && monitoringDynamics.dispose()
    }
  }, [monitoringTypesData, toggleSwitcher, mobile])

  return (
    <div className="monitoring-types-container">
      <Row className="monitoring-types-row" justify="center">
        <Col className="monitoring-types-column" xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
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
                // mainText="Кількість процедур, в яких моніторинги завершені"
                // mainText="Процедури закупівель, по яких проведений моніторинг"
                // mainText="Процедури закупівель, по яких розпочато моніторинг"
                mainText="Процедури закупівель, які потрапили під моніторинг"
                // infoText="Можете обрати період, область реєстрації замовника, необхідні методи закупівлі та переглянути інформацію за сумою/кількістю"
                infoText="Можете обрати період, область реєстрації замовника, вид закупівлі та переглянути інформацію за сумою/кількістю"
                // countText='Кількість процедур з моніторингами'
                countText=''
                value={numeral(monitoringTypesData.tendersCount).format('0,0')}
              />
              <SwitchCustom
                defaultValue={toggleSwitcher}
                regionIds={regionIds}
                onChange={setRegion}
                handleSwitch={setToggleSwitcher}
                selectorText="Регіон замовника:"
              />
              <div className="monitoring-types-chart-wrapper">
                <div className="zoomable-chart-wrapper">
                  {!mobile && <Row justify="flex">
                    <Col className="monitoring-types-column" xs={24} sm={15} md={15} lg={15} xl={15} xxl={15}>
                      <div id="zoomable-chart" style={{ width: '100%', height: '600px' }} />
                    </Col>
                    <Col className="monitoring-types-column" xs={24} sm={9} md={9} lg={9} xl={9} xxl={9}
                         style={{ justifyContent: 'center' }}>
                      <div className="chart-right-side">
                        <div className="top-info">
                          <span className="info__title">Охоплено моніторингом</span>
                          {toggleSwitcher ? <div className="info__subtitle-wrapper">
                              <span className="number">
                                {numeral(monitoringTypesData.tendersCount).format('0,0')}
                              </span>
                            </div> :
                            <div className="info__subtitle-wrapper">
                              <span className="number">
                                {numeral(monitoringTypesData.tendersAmount).format('0.00 a').split(' ')[0]}
                              </span>
                              <span className="info__subtitle">
                                {`${numeral(monitoringTypesData.tendersAmount).format('0.00 a').split(' ')[1]} ${toggleSwitcher ? '' : 'грн'}`}
                              </span>
                            </div>}
                        </div>
                        <div className="bottom-info">
                          <span className="info__title">Охоплено замовників</span>
                          <span className="label">
                            {numeral(monitoringTypesData.procuringEntityCount).format('0,0')}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>}
                </div>
                <div className="line-chart-wrapper">
                  <Row justify="flex">
                    <Col xs={24} md={4}>
                      <div className='line-chart-title'>
                        {toggleSwitcher ? 'Динаміка кількості моніторингів' : ' Динаміка вартості закупівель з моніторингом'}
                      </div>
                    </Col>
                    {!mobile ?
                      <Col xs={24} md={20}>
                        <div id="monitoring-dynamics-chart" style={{ width: '100%', height: '170px' }} />
                      </Col> :
                      <Col xs={24} md={20}>
                        <div className="bar-chart-container">
                          <div className="bar-chart" id="bar-chart"
                               style={{ width: '100%', height: 200, position: 'relative' }} />
                        </div>
                      </Col>}
                  </Row>
                </div>
              </div>
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

export default TypesMonitoring
