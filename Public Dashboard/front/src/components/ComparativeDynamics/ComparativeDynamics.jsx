import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4lang_uk_UA from '@amcharts/amcharts4/lang/uk_UA'
import { MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import {
  getDataForComparativeDynamicsPage,
} from '../../redux/actions/сomparativeDynamicsActions'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Instruction from '../Instruction/Instruction'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import _ from 'lodash'
import 'moment/locale/uk'
import SwitchCustom from '../SwitchCustom/SwitchCustom'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import './styles.scss'

numeral.locale('ua')
moment.locale('ua')
dayjs.extend(relativeTime)

const ComparativeDynamics = () => {
  const dispatch = useDispatch()
  const dataForLineCharts = useSelector(state => state.comparativeDynamicsPageData.comparativeData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const { monitoringTenderPercent, dynamicAuditors, dynamicTenders } = !_.isEmpty(dataForLineCharts) && dataForLineCharts
  const flipRef = useRef(null)
  const [region, setRegion] = useState([])
  const [period, setPeriod] = useState([startDate, endDate])
  const [lindeChartsData, setLindeChartsData] = useState(null)
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const [toggleSwitcher, setToggleSwitcher] = useState(true)
  const [fakeDate, setFakeDate] = useState([])
  const [toggleExpandRegions, setToggleExpandRegions] = useState(true)
  const mobile = currentWidth <= 768

  const dateObj = _.map(fakeDate, date => {
    return {
      date,
    }
  })

  const dynamicAuditorsWithFullDate = _.map(_.merge(dateObj, dynamicAuditors), item => {
    return {
      date: item.date,
      count: item.count ? item.count : 0,
    }
  })

  const dynamicTendersWithFullDate = _.map(_.merge(dateObj, dynamicTenders), item => {
    return {
      date: item.date,
      tendersCount: item.tendersCount ? item.tendersCount : 0,
      amount: item.amount ? item.amount : 0,
    }
  })

  const mergingFullDateData = _.merge(_.keyBy(dynamicAuditorsWithFullDate, 'date'), _.keyBy(dynamicTendersWithFullDate, 'date'))

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
    setLindeChartsData(dataForLineCharts)
  }, [dataForLineCharts])

  useEffect(() => {
    dispatch(getDataForComparativeDynamicsPage(period[0], period[1], region))
    // dispatch(setCurrentDate(`${previousYear}-01-01`, `${nextYear}-01-01`))
  }, [dispatch, period, region])

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const renderMobileChart = useCallback(() => {
    return Object.keys(mergingFullDateData).map((key, index) => {
      return (
        <div
          key={index}
          className='section-item'
        >
          <div>{key}</div>
          <div className="bar-chart" id={`bar-chart-${index}`}
               style={{ width: '100%', height: '100px', position: 'relative' }} />
        </div>
      )
    })

  }, [mergingFullDateData])

  useLayoutEffect(() => {
    if (mobile) {

      const totalAmount = _.reduce(Object.keys(mergingFullDateData), (memo, key, ind) => {
        return memo + mergingFullDateData[key].amount
      }, 0)
      const totalCount = _.reduce(Object.keys(mergingFullDateData), (memo, key, ind) => {
        return memo + mergingFullDateData[key].count
      }, 0)
      const totalTendersCount = _.reduce(Object.keys(mergingFullDateData), (memo, key, ind) => {
        return memo + mergingFullDateData[key].tendersCount
      }, 0)

      Object.keys(mergingFullDateData).map((key, index) => {
        let chart = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, `bar-chart-${index}`, 'XYChart')

        let prData = [{
          category: 0,
          fixedValue: 100,
          leftText: 'Кількість аудиторів',
          // value: mergingFullDateData[key].count,
          value: Math.round((mergingFullDateData[key].count + Number.EPSILON) * 100) / totalCount,
          rightText: mergingFullDateData[key].count,
        },
          {
            category: 1,
            fixedValue: 100,
            leftText: toggleSwitcher ? 'Кількість процедур' : 'Сума процедур',
            // value: mergingFullDateData[key].tendersCount,
            value: Math.round((mergingFullDateData[key][toggleSwitcher ? 'tendersCount' : 'amount'] + Number.EPSILON) * 100) / (toggleSwitcher ? totalTendersCount : totalAmount),
            // rightText: toggleSwitcher ? mergingFullDateData[key].tendersCount : mergingFullDateData[key].amount,
            rightText: toggleSwitcher ? numeral(mergingFullDateData[key].tendersCount).format('0,0') : numeral(mergingFullDateData[key].amount).format('0.0 a'),
          }]

        chart.height = 50 * prData.length
        chart.data = prData
      })
    }

    return (chart) => {
      chart && chart.dispose()
    }

  }, [mergingFullDateData, toggleSwitcher])

  useLayoutEffect(() => {
    if (dataForLineCharts) {
      var chart = am4core.create('chartdiv1', am4charts.XYChart)

      // chart.exporting.menu = new am4core.ExportMenu()
      // chart.exporting.formatOptions.getKey('csv').disabled = true
      // chart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      chart.padding(0, 0, 0, 0)
      chart.leftAxesContainer.layout = 'vertical'
      // chart.leftAxesContainer.pixelPerfect = true

      chart.language.locale = am4lang_uk_UA
      chart.numberFormatter.language = new am4core.Language()
      chart.numberFormatter.language.locale = am4lang_uk_UA
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': 'тис.' },
        { 'number': 1e+6, 'suffix': 'млн.' },
        { 'number': 1e+9, 'suffix': 'млрд.' },
      ]

      chart.data = dataForLineCharts['dynamicTenders'].map((item, index) => {
        return {
          date: new Date(item.date),
          dynamicTenders: toggleSwitcher ? item.tendersCount : item.amount,
          dynamicAuditors: dataForLineCharts['dynamicAuditors'][index].count,
          dynamicProductivity: toggleSwitcher ? dataForLineCharts['dynamicProductivity'][index].tendersCount : dataForLineCharts['dynamicProductivity'][index].amount,
          dynamicTendersFormattedValue: toggleSwitcher ? numeral(item.tendersCount).format('0,0') : `${numeral(item.amount).format('0.0 a')} грн`,
          dynamicAuditorsFormattedValue: dataForLineCharts['dynamicAuditors'][index].count,
          dynamicProductivityFormattedValue: toggleSwitcher ? numeral(dataForLineCharts['dynamicProductivity'][index].tendersCount).format('0,0') : `${numeral(dataForLineCharts['dynamicProductivity'][index].amount).format('0.0 a')} грн`,
        }
      })

      var interfaceColors = new am4core.InterfaceColorSet()
// uncomment this line if you want to change order of axes
//chart.bottomAxesContainer.reverseOrder = true;

      let label = chart.createChild(am4core.Label)
      label.text = toggleSwitcher ? 'Кількість процедур' : 'Сума процедур'
      label.fontSize = 18
      label.fontWeight = 'bold'
      label.fill = '#000000'
      label.align = 'left'
      label.isMeasured = false
      label.x = 50
      label.y = 30

      let label2 = chart.createChild(am4core.Label)
      label2.text = ''
      label2.fontSize = 18
      label2.fontWeight = 'bold'
      label2.fill = '#000000'
      label2.isMeasured = false
      label2.horizontalCenter = 'right'
      label2.x = am4core.percent(100)
      label2.y = 30

      let label3 = chart.createChild(am4core.Label)
      label3.text = 'Кількість аудиторів'
      label3.fontSize = 18
      label3.fontWeight = 'bold'
      label3.fill = '#000000'
      label3.align = 'left'
      label3.isMeasured = false
      label3.x = 50
      label3.y = 220

      let label4 = chart.createChild(am4core.Label)
      label4.text = ''
      label4.fontSize = 18
      label4.fontWeight = 'bold'
      label4.fill = '#000000'
      label4.isMeasured = false
      label4.horizontalCenter = 'right'
      label4.x = am4core.percent(100)
      label4.y = 220

      let label5 = chart.createChild(am4core.Label)
      label5.text = 'Продуктивність аудиторів'
      label5.fontSize = 18
      label5.fontWeight = 'bold'
      label5.fill = '#000000'
      label5.align = 'left'
      label5.isMeasured = false
      label5.x = 50
      label5.y = 410

      let label6 = chart.createChild(am4core.Label)
      label6.text = ''
      label6.fontSize = 18
      label6.fontWeight = 'bold'
      label6.fill = '#000000'
      label6.isMeasured = false
      label6.horizontalCenter = 'right'
      label6.x = am4core.percent(100)
      label6.y = 410

      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.dateFormats.setKey('month', 'MM.YYYY')
      dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
      dateAxis.fontSize = 11
      dateAxis.renderer.labels.template.fill = '#666666'
      dateAxis.renderer.grid.template.location = 0
      dateAxis.renderer.ticks.template.length = 8
      dateAxis.renderer.ticks.template.strokeOpacity = 0.1
//dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.ticks.template.disabled = false
      dateAxis.renderer.ticks.template.strokeOpacity = 0.2
      dateAxis.renderer.grid.template.strokeWidth = 0
      dateAxis.renderer.baseGrid.disabled = true
      dateAxis.tooltip.disabled = true

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.renderer.minGridDistance = 20
      valueAxis.align = 'left'
      valueAxis.tooltip.disabled = true
      valueAxis.zIndex = 1
      valueAxis.renderer.baseGrid.disabled = true
      valueAxis.marginTop = 60
// height of axis
      valueAxis.height = am4core.percent(33)
      // valueAxis.renderer.inside = true
      valueAxis.renderer.labels.template.verticalCenter = 'middle'
      valueAxis.renderer.fontSize = 11
      valueAxis.renderer.labels.template.fill = '#666666'
      valueAxis.renderer.grid.template.opacity = 0.5
      valueAxis.numberFormatter.numberFormat = toggleSwitcher ? '#.#' : '#,# a'

      var series = chart.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'date'
      series.dataFields.valueY = 'dynamicTenders'
      series.tooltipText = '{valueY.value}'
      series.name = 'Series 1'
      series.strokeWidth = 2
      series.minBulletDistance = 15
      series.stroke = am4core.color('#FFB800')
      series.tooltip.disabled = true
      series.tensionX = 0.77

      let shadow = series.filters.push(new am4core.DropShadowFilter)
      shadow.dx = 10
      shadow.dy = 15
      shadow.blur = 2
      shadow.opacity = 0.1

      var bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.radius = 5
      bullet.circle.stroke = am4core.color('#FFB80080')
      bullet.fill = '#FFB800'
      bullet.stroke = bullet.fill
      bullet.circle.strokeWidth = 10
      bullet.fillOpacity = 0
      bullet.strokeOpacity = 0
      bullet.events.on('over', function (ev) {
        label2.text = ev.target.dataItem.dataContext.dynamicTendersFormattedValue
        label4.text = ev.target.dataItem.dataContext.dynamicAuditorsFormattedValue
        label6.text = ev.target.dataItem.dataContext.dynamicProductivityFormattedValue
      })

      bullet.events.on('out', function (ev) {
        label2.text = ''
        label4.text = ''
        label6.text = ''
      })

      var bulletState = bullet.states.create('hover')
      bulletState.properties.fillOpacity = 1
      bulletState.properties.strokeOpacity = 1

      var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis2.renderer.minGridDistance = 30
      valueAxis2.align = 'left'
      valueAxis2.tooltip.disabled = true
      valueAxis2.height = am4core.percent(33)
      valueAxis2.zIndex = 2
      valueAxis2.marginTop = 60
      valueAxis2.renderer.baseGrid.disabled = true
      valueAxis2.renderer.labels.template.verticalCenter = 'middle'
      valueAxis2.renderer.fontSize = 11
      valueAxis2.renderer.labels.template.fill = '#666666'
      valueAxis2.renderer.grid.template.opacity = 0.5
      valueAxis2.numberFormatter.numberFormat = '#.#'

      var series2 = chart.series.push(new am4charts.LineSeries())
      series2.strokeWidth = 2
      series2.dataFields.dateX = 'date'
      series2.dataFields.valueY = 'dynamicAuditors'
      series2.yAxis = valueAxis2
      series2.tooltipText = '{valueY.value}'
      series2.name = 'Series 2'
      series2.strokeWidth = 2
      series2.minBulletDistance = 15
      series2.stroke = am4core.color('#3DCAD4')
      series2.tooltip.disabled = true
      series2.tensionX = 0.77

      let shadow2 = series2.filters.push(new am4core.DropShadowFilter)
      shadow2.dx = 10
      shadow2.dy = 15
      shadow2.blur = 2
      shadow2.opacity = 0.1

      var bullet2 = series2.bullets.push(new am4charts.CircleBullet())
      bullet2.circle.radius = 5
      bullet2.circle.stroke = am4core.color('#3DCAD480')
      bullet2.fill = '#3DCAD4'
      bullet2.stroke = bullet.fill
      bullet2.circle.strokeWidth = 10
      bullet2.fillOpacity = 0
      bullet2.strokeOpacity = 0

      var bulletState2 = bullet2.states.create('hover')
      bulletState2.properties.fillOpacity = 1
      bulletState2.properties.strokeOpacity = 1

      var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis3.renderer.minGridDistance = 30
      valueAxis3.align = 'left'
      valueAxis3.tooltip.disabled = true
      valueAxis3.height = am4core.percent(33)
      valueAxis3.zIndex = 3
      valueAxis3.marginTop = 60
      valueAxis3.renderer.baseGrid.disabled = true
      valueAxis3.renderer.labels.template.verticalCenter = 'middle'
      valueAxis3.renderer.fontSize = 11
      valueAxis3.renderer.labels.template.fill = '#666666'
      valueAxis3.renderer.grid.template.opacity = 0.5
      valueAxis3.numberFormatter.numberFormat = toggleSwitcher ? '#.#' : '#,# a'

      var series3 = chart.series.push(new am4charts.LineSeries())
      series3.dataFields.dateX = 'date'
      series3.dataFields.valueY = 'dynamicProductivity'
      series3.yAxis = valueAxis3
      series3.tooltipText = '{valueY.value}'
      series3.name = 'Series 2'
      series3.strokeWidth = 2
      series3.minBulletDistance = 15
      series3.stroke = am4core.color('#1E6592')
      series3.tooltip.disabled = true
      series3.tensionX = 0.77

      let shadow3 = series3.filters.push(new am4core.DropShadowFilter)
      shadow3.dx = 10
      shadow3.dy = 15
      shadow3.blur = 2
      shadow3.opacity = 0.1

      var bullet3 = series3.bullets.push(new am4charts.CircleBullet())
      bullet3.circle.radius = 5
      bullet3.circle.stroke = am4core.color('#1E659280')
      bullet3.fill = '#1E6592'
      bullet3.stroke = bullet.fill
      bullet3.circle.strokeWidth = 10
      bullet3.fillOpacity = 0
      bullet3.strokeOpacity = 0

      var bulletState3 = bullet3.states.create('hover')
      bulletState3.properties.fillOpacity = 1
      bulletState3.properties.strokeOpacity = 1

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.lineX.disabled = true
      chart.cursor.behavior = 'none'
      chart.cursor.xAxis = dateAxis

      // var scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(series);
      // scrollbarX.marginBottom = 20;
      // chart.scrollbarX = scrollbarX;

      let rectangle = chart.plotContainer.createChild(am4core.Rectangle)
      rectangle.fillOpacity = 1
      rectangle.width = am4core.percent(100)
      rectangle.fill = am4core.color('#ffffff')
      rectangle.isMeasured = false
      rectangle.height = 29
      rectangle.zIndex = 1000

      valueAxis2.events.on('positionchanged', function () {
        rectangle.y = valueAxis2.pixelY - rectangle.pixelHeight - 1
      })
    }
  }, [dataForLineCharts, toggleSwitcher])

  const toggleRegionsListSize = () => {
    setToggleExpandRegions(prev => !prev)
  }

  return (
    <div className="compare-dynamics-container">
      <Row className="compare-dynamics-row" justify="center">
        <Col className="compare-dynamics-column" xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="compare-dynamics-navigation">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                  </div>
                  <InfoBlockHeader
                    mainText="Покриття процедур закупівель моніторингами за обраний період за вартістю"
                    infoText="Оберіть період чи область замовника та перегляньте інформацію за сумою/кількістю моніторингів"
                    countText=''
                    value={`${numeral(monitoringTenderPercent).format('0,0')}%`}
                  />
                  <SwitchCustom
                    regionIds={region}
                    onChange={setRegion}
                    defaultValue={toggleSwitcher}
                    handleSwitch={setToggleSwitcher}
                    selectorText='Регіон замовника:'
                  />
                  <div className="compare-dynamics-chart-wrapper">
                    {!mobile && <>
                      <div id="chartdiv1" className="chart" style={{ height: 600 }} />
                    </>}
                    {/*{mobile && renderMobileVioletionChart()}*/}
                    {/*{mobile && <span className="change-size-button" onClick={toggleRegionsListSize}>*/}
                    {/*  {toggleExpandRegions ? 'Показати бiльше' : 'Згорнути'}*/}
                    {/*</span>}*/}
                  </div>
                  {mobile && <>
                    <div style={{
                      width: '100%',
                      height: !toggleExpandRegions ? '1380px' : '220px',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '0 20px',
                    }}>
                      {renderMobileChart()}
                    </div>
                    <span className="change-size-button" onClick={toggleRegionsListSize}>
                      {toggleExpandRegions ? 'Показати бiльше' : 'Згорнути'}
                    </span>
                  </>}
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

export default ComparativeDynamics
