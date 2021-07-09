import React, { useLayoutEffect, useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Radio, Select, Space } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MAX_MOBILE_WIDTH, REGIONS_LIST, VIOLATIONS } from '../../constants'
import { getResultsByOfficesData } from '../../redux/actions/monitoringActions'
import *  as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4lang_uk_UA from '@amcharts/amcharts4/lang/uk_UA'
import _ from 'lodash'
import 'moment/locale/uk'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import Instruction from '../Instruction/Instruction'
import * as dayjs from 'dayjs'
import './styles.scss'
import { Animated } from 'react-animated-css'
import { renderToString } from 'react-dom/server'

am4core.useTheme(am4themes_animated)
numeral.locale('ua')
moment.locale('ua')

const ResultsByOffice = () => {
  const dispatch = useDispatch()
  const resultsByOffices = useSelector(state => state.monitoringStore.resultsByOffices)
  const mappingsData = useSelector(state => state.mappingsStore.mappingsData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const [period, setPeriod] = useState([startDate, endDate])
  const [regionIds, setRegion] = useState([])
  const [fakeDate, setFakeDate] = useState([])
  const [preparedLineData, setPreparedLineData] = useState([])
  const [barChartData, setBarChartData] = useState({})
  const [waterFallChartData, setWaterFallChartData] = useState([])
  const [selectedOfficeId, setSelectedOfficeId] = useState(null)
  const [waterFallStatus, changeWaterFallStatus] = useState('count')
  const [options, setOptions] = useState([])
  const marketChartRef = useRef(null)
  const flipRef = useRef(null)
  const resultsOfficeRef = useRef(null)
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(window.outerWidth)
  const mobile = currentWidth <= MAX_MOBILE_WIDTH

  useEffect(() => {
    if (!_.isEmpty(mappingsData.violations)) {
      let preparedViolations = mappingsData.violations.map((violation) => {
        let elementIndex = _.findIndex(VIOLATIONS, { id: violation.id })
        if (elementIndex === -1) {
          return {
            label: violation.name,
            value: violation.id,
          }
        } else {
          return {
            label: VIOLATIONS[elementIndex].realName,
            value: violation.id,
          }
        }
      })

      setOptions(preparedViolations)
    }
  }, [resultsByOffices])

  const renderLeftSideInfo = useCallback(() => {
    if (!_.isEmpty(preparedLineData)) {
      return preparedLineData.map((office, index) => {
        return office.id === selectedOfficeId ? (
          <Animated
            key={index}
            animationIn="slideInDown"
            animationOut="slideOutUp"
            animationInDuration={1000}
            animationOutDuration={1000}
            isVisible={true}
          >
            <div
              className="office-info-wrapper"
              onClick={() => setSelectedOfficeId(office.id !== selectedOfficeId ? office.id : null)}
            >
              <div className="office-title">{office.name}</div>
              <div className="office-data">
                <div className="office-data__value">{office.totalCountByOffice}</div>
                <div className="office-data__text">процедур з порушеннями</div>
              </div>
              <div id="market-line-chart" style={{ width: '100%', height: '100px' }} />
            </div>
          </Animated>
        ) : (
          <div className="office-info-container">
            <div
              className="office-info-wrapper"
              onClick={() => setSelectedOfficeId(office.id)}
            >
              <div className="office-title">{office.name}</div>
              <div className="office-data">
                <div className="office-data__value">{office.totalCountByOffice}</div>
                <div className="office-data__text">процедур з порушеннями</div>
              </div>
            </div>
          </div>
        )
      })
    } else {
      return null
    }
  }, [preparedLineData, selectedOfficeId])

  const renderLeftSideMobileInfo = useCallback(() => {
    if (!_.isEmpty(preparedLineData)) {
      return preparedLineData.map((office) => {
        return (
          <div className="office-info-container">
            <div
              className="office-info-wrapper"
              onClick={() => setSelectedOfficeId(office.id)}
            >
              <div className="office-title">{office.name}</div>
              <div className="office-data">
                <div className="office-data__value">{office.totalCountByOffice}</div>
                <div className="office-data__text">процедур з порушеннями</div>
              </div>
              <div id={`market-line-chart_${office.id}`} style={{ width: '100%', height: '100px' }} />
            </div>
          </div>
        )
      })
    } else {
      return null
    }
  }, [preparedLineData])

  useLayoutEffect(() => {
    if (!mobile && selectedOfficeId) {
      const marketLineChart = am4core.create('market-line-chart', am4core.Container)

      // marketLineChart.exporting.menu = new am4core.ExportMenu()
      // marketLineChart.exporting.formatOptions.getKey('csv').disabled = true
      // marketLineChart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      marketChartRef.current = marketLineChart
      marketLineChart.layout = 'grid'
      marketLineChart.fixedWidthGrid = false
      marketLineChart.width = am4core.percent(100)

      const chart = marketLineChart.createChild(am4charts.XYChart)
      chart.language.locale = am4lang_uk_UA
      chart.numberFormatter.language = new am4core.Language()
      chart.numberFormatter.language.locale = am4lang_uk_UA
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': 'тис.' },
        { 'number': 1e+6, 'suffix': 'млн.' },
        { 'number': 1e+9, 'suffix': 'млрд.' },
      ]

      // chart.width = 400
      chart.height = 120
      chart.padding(10, 0, 40, 0)

      chart.data = _.find(preparedLineData, { id: selectedOfficeId }).chartData

      chart.titles.template.fontSize = 10
      chart.titles.template.textAlign = 'left'
      chart.titles.template.isMeasured = false

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      // dateAxis.renderer.minGridDistance = 30;
      dateAxis.renderer.grid.template.disabled = true
      dateAxis.renderer.labels.template.disabled = true
      dateAxis.startLocation = 0.2
      dateAxis.endLocation = 1.3
      dateAxis.cursorTooltipEnabled = false
      dateAxis.dateFormats.setKey('month', 'MM.YYYY')
      dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
      dateAxis.fontSize = 11
      dateAxis.renderer.labels.template.fill = '#666666'

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      valueAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.baseGrid.disabled = true
      valueAxis.renderer.labels.template.disabled = true
      valueAxis.cursorTooltipEnabled = false

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.behavior = 'none'

      const series = chart.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'date'
      series.dataFields.valueY = 'value'
      series.tensionX = 0.8
      series.strokeWidth = 2
      series.stroke = '#3DCAD4'
      series.tooltipHTML = `<div 
      style='
        width: fit-content;  
        height: 40px; 
        display: flex; 
        flex-direction: column; 
        align-items: flex-start;
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
            line-height: 19,5px;
            margin-left: 4px;
          '
        >
        <span
            style='
              font-weight: 400;
              font-size: 12px;
              line-height: 14,63px;
              margin-right: 4px;
            '
          >
          </span>
          {valueY.formatNumber('#.## a')}
        </span>
        <span
          style='
            display: flex;
            align-items: center;
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
              margin-right: 4px;
            '
          >
            Дата:
          </span>
          {date}
        </span>
      </div>`

      series.tooltip.getFillFromObject = false
      series.tooltip.background.fill = am4core.color('#FFFFFF')

      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color('#3DCAD4')
      bullet.fill = am4core.color('#FFFFFF')
      bullet.circle.strokeWidth = 2
      bullet.fillOpacity = 0
      bullet.strokeOpacity = 0

      let shadow = series.filters.push(new am4core.DropShadowFilter())
      shadow.dx = 15
      shadow.dy = 10
      shadow.blur = 5

      const bulletState = bullet.states.create('hover')
      bulletState.properties.fillOpacity = 1
      bulletState.properties.strokeOpacity = 1


      return () => {
        marketLineChart.dispose()
      }
    }
  }, [mobile, selectedOfficeId])

  useLayoutEffect(() => {
    if (mobile && !_.isEmpty(preparedLineData)) {
      preparedLineData.map((office) => {
        const marketLineChart = am4core.create(`market-line-chart_${office.id}`, am4core.Container)

        // marketLineChart.exporting.menu = new am4core.ExportMenu()
        // marketLineChart.exporting.formatOptions.getKey('csv').disabled = true
        // marketLineChart.exporting.menu.items = [{
        //   'label': '...',
        //   'menu': [
        //     { 'type': 'png', 'label': 'PNG' },
        //     { 'type': 'jpg', 'label': 'JPG' },
        //   ],
        // }]

        marketChartRef.current = marketLineChart
        marketLineChart.layout = 'grid'
        marketLineChart.fixedWidthGrid = false
        marketLineChart.width = am4core.percent(100)

        const chart = marketLineChart.createChild(am4charts.XYChart)
        chart.language.locale = am4lang_uk_UA
        chart.numberFormatter.language = new am4core.Language()
        chart.numberFormatter.language.locale = am4lang_uk_UA
        chart.numberFormatter.bigNumberPrefixes = [
          { 'number': 1e+3, 'suffix': 'тис.' },
          { 'number': 1e+6, 'suffix': 'млн.' },
          { 'number': 1e+9, 'suffix': 'млрд.' },
        ]

        // chart.width = 400
        chart.height = 120
        chart.padding(10, 0, 40, 0)

        chart.data = _.find(preparedLineData, { id: office.id }).chartData

        chart.titles.template.fontSize = 10
        chart.titles.template.textAlign = 'left'
        chart.titles.template.isMeasured = false

        const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
        // dateAxis.renderer.minGridDistance = 30;
        dateAxis.renderer.grid.template.disabled = true
        dateAxis.renderer.labels.template.disabled = true
        dateAxis.startLocation = 0.2
        dateAxis.endLocation = 1.3
        dateAxis.cursorTooltipEnabled = false
        dateAxis.dateFormats.setKey('month', 'MM.YYYY')
        dateAxis.periodChangeDateFormats.setKey('month', 'MM.YYYY')
        dateAxis.fontSize = 11
        dateAxis.renderer.labels.template.fill = '#666666'

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.renderer.baseGrid.disabled = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.cursorTooltipEnabled = false

        chart.cursor = new am4charts.XYCursor()
        chart.cursor.lineY.disabled = true
        chart.cursor.behavior = 'none'

        const series = chart.series.push(new am4charts.LineSeries())
        series.dataFields.dateX = 'date'
        series.dataFields.valueY = 'value'
        series.tensionX = 0.8
        series.strokeWidth = 2
        series.stroke = '#3DCAD4'
        series.tooltipHTML = `<div 
      style='
        width: fit-content;  
        height: 40px; 
        display: flex; 
        flex-direction: column; 
        align-items: flex-start;
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
            line-height: 19,5px;
            margin-left: 4px;
          '
        >
        <span
            style='
              font-weight: 400;
              font-size: 12px;
              line-height: 14,63px;
              margin-right: 4px;
            '
          >
          </span>
          {valueY.formatNumber('#.## a')}
        </span>
        <span
          style='
            display: flex;
            align-items: center;
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
              margin-right: 4px;
            '
          >
            Дата:
          </span>
          {date}
        </span>
      </div>`

        series.tooltip.getFillFromObject = false
        series.tooltip.background.fill = am4core.color('#FFFFFF')

        const bullet = series.bullets.push(new am4charts.CircleBullet())
        bullet.circle.stroke = am4core.color('#3DCAD4')
        bullet.fill = am4core.color('#FFFFFF')
        bullet.circle.strokeWidth = 2
        bullet.fillOpacity = 0
        bullet.strokeOpacity = 0

        let shadow = series.filters.push(new am4core.DropShadowFilter())
        shadow.dx = 15
        shadow.dy = 10
        shadow.blur = 5

        const bulletState = bullet.states.create('hover')
        bulletState.properties.fillOpacity = 1
        bulletState.properties.strokeOpacity = 1


        return () => {
          marketLineChart.dispose()
        }
      })
    }
  }, [mobile, preparedLineData])

  useEffect(() => {
    let groupedByOffices = _.groupBy(resultsByOffices.offices, 'id')
    let preparedValues = Object.keys(groupedByOffices).map((key) => {
      return {
        id: key,
        name: _.isArray(groupedByOffices[key]) ? groupedByOffices[key][0].name : '',
        chartData: fakeDate.map((item) => {
          let elementIndex = _.findIndex(groupedByOffices[key], { date: item })
          return {
            date: item,
            value: elementIndex !== -1 ? groupedByOffices[key][elementIndex].tendersCount : 0,
          }
        }),
        totalCountByOffice: _.reduce(groupedByOffices[key], function (memo, item) {
          return memo + item.tendersCount
        }, 0),
      }
    })

    setPreparedLineData(preparedValues)
  }, [resultsByOffices])

  useEffect(() => {
    let groupedByDate = _.groupBy(resultsByOffices.tenderDynamics, 'date')

    const result = fakeDate.map((date) => {
      let data = groupedByDate[date] ? groupedByDate[date] : []

      return {
        date: date,
        totalValue: _.reduce(data, function (memo, it) {
          let value = 0

          switch (waterFallStatus) {
            case 'count':
              value = it.tendersCount
              break

            case 'sum':
              value = it.amount
              break

            case 'entity':
              value = it.procuringEntityCount
              break

            default:
              value = 0
          }

          return memo + value
        }, 0),
      }
    })

    const preparedChartData = result.map((item, index) => {
      let value = 0

      switch (waterFallStatus) {
        case 'count':
          value = numeral(item.totalValue).format('0,0')
          break

        case 'sum':
          value = numeral(item.totalValue).format('0.0 a').split(' ')[0]
          break

        case 'entity':
          value = numeral(item.totalValue).format('0,0')
          break

        default:
          value = numeral(item.totalValue).format('0,0')
      }

      return {
        category: dayjs(item.date).format('MM.YYYY'),
        open: index === 0 ? 0 : _.reduce(result, (memo, item, ind) => {
          let value = ind < index ? item.totalValue : 0
          return memo + value
        }, 0),
        value: _.reduce(result, (memo, item, ind) => {
          let value = ind <= index ? item.totalValue : 0
          return memo + value
        }, 0),
        stepValue: 0,
        color: '#CEF1F4',
        displayValue: item.totalValue,
        formattedValue: value,
        numeral: item.totalValue,
      }
    })

    let totalValue = _.reduce(preparedChartData, (memo, item) => {
      return memo + item.displayValue
    }, 0)

    let barChartData = {
      category: 'Загальна\nкількість',
      open: 0,
      value: totalValue,
      stepValue: 0,
      color: null,
      displayValue: totalValue,
      formattedValue: waterFallStatus === 'sum' ? numeral(totalValue).format('0.0 a').split(' ')[0] : numeral(totalValue).format('0,0'),
      formattedSuffix: waterFallStatus === 'sum' ? numeral(totalValue).format('0.0 a').split(' ')[1] : '',

    }

    setWaterFallChartData(preparedChartData)
    setBarChartData(barChartData)
  }, [resultsByOffices, waterFallStatus])

  useEffect(() => {
    const selectedOffices = selectedOfficeId ? [selectedOfficeId] : []
    dispatch(getResultsByOfficesData(period[0], period[1], regionIds, selectedOffices))
    generateDateByPeriod(period[0])
  }, [period, regionIds, selectedOfficeId])

  useEffect(() => {
    if (currentWidth !== window.outerWidth) {
      setCurrentWidth(window.outerWidth)
    }
  }, [w])

  const generateDateByPeriod = (startDate) => {
    let datePeriods = []

    for (let i = 0; i <= 11; i++) {
      datePeriods.push(dayjs(startDate).add(i, 'month').startOf().format('YYYY-MM'))
    }

    setFakeDate(datePeriods)
  }

  useLayoutEffect(() => {
    if (!mobile && !_.isEmpty(waterFallChartData)) {
      //BAR CHART
      let charBar = am4core.create('results-office-bar-chart', am4charts.XYChart)

      // charBar.exporting.menu = new am4core.ExportMenu()
      // charBar.exporting.formatOptions.getKey('csv').disabled = true
      // charBar.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      charBar.hiddenState.properties.opacity = 0 // this makes initial fade in effect
      charBar.padding(15, 0, 0, 0)
      charBar.data = [barChartData]

      let categoryAxisBar = charBar.xAxes.push(new am4charts.CategoryAxis())
      categoryAxisBar.dataFields.category = 'category'
      categoryAxisBar.renderer.grid.template.location = 0
      categoryAxisBar.fontSize = 10
      categoryAxisBar.fillOpacity = 0.5
      categoryAxisBar.fontFamily = 'Montserrat'
      categoryAxisBar.renderer.labels.template.wrap = true
      categoryAxisBar.renderer.grid.template.disabled = true

      categoryAxisBar.renderer.labels.template.adapter.add('dy', function (dy, target) {
        if (target.dataItem && target.dataItem.index & 2 == 2) {
          return dy + 25
        }
        return dy
      })

      let valueAxisBar = charBar.yAxes.push(new am4charts.ValueAxis())
      valueAxisBar.min = 0
      // valueAxisBar.max = Math.ceil(charBar.data[0].displayValue / 1000) * 1000
      valueAxisBar.renderer.minGridDistance = 50
      valueAxisBar.renderer.labels.template.disabled = true
      valueAxisBar.cursorTooltipEnabled = false
      valueAxisBar.renderer.grid.template.disabled = true

      let series = charBar.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'displayValue'
      series.dataFields.categoryX = 'category'
      series.name = 'Visits'
      series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'
      series.columns.template.fillOpacity = .8
      series.columns.template.column.cornerRadiusTopLeft = 5
      series.columns.template.column.cornerRadiusTopRight = 5
      series.tooltip.disabled = true
      series.columns.template.adapter.add('fill', (fill, target) => {
        let columnGradient = new am4core.LinearGradient()
        columnGradient.rotation = 270
        columnGradient.addColor('#1E6592', 1, 0)
        columnGradient.addColor('#48A4B0', 1, 1)
        return columnGradient
      })

      let columnTemplateBar = series.columns.template
      columnTemplateBar.strokeWidth = 2
      columnTemplateBar.strokeOpacity = 1

      let bulletLabelBar = series.bullets.push(new am4charts.LabelBullet())
      bulletLabelBar.fontFamily = 'Montserrat'
      bulletLabelBar.fontWeight = '600'
      bulletLabelBar.fontSize = 14
      bulletLabelBar.locationY = 0.5
      bulletLabelBar.label.fill = am4core.color('#ffffff')
      bulletLabelBar.label.text = '{formattedValue}\n{formattedSuffix}'
    }

    return (charBar) => {
      charBar && charBar.dispose()
    }

  }, [barChartData])

  useLayoutEffect(() => {
    if (!mobile && !_.isEmpty(waterFallChartData)) {
      //WATER FALL CHART
      let chart = am4core.create('results-office-chart', am4charts.XYChart)

      // chart.exporting.menu = new am4core.ExportMenu()
      // chart.exporting.formatOptions.getKey('csv').disabled = true
      // chart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      resultsOfficeRef.current = chart
      chart.padding(15, 5, 0, 0)
      chart.hiddenState.properties.opacity = 0 // this makes initial fade in effect
      chart.language.locale = am4lang_uk_UA
      chart.numberFormatter.language = new am4core.Language()
      chart.numberFormatter.language.locale = am4lang_uk_UA
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': 'тис.' },
        { 'number': 1e+6, 'suffix': 'млн.' },
        { 'number': 1e+9, 'suffix': 'млрд.' },
      ]

      chart.data = waterFallChartData


      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'category'
      categoryAxis.renderer.minGridDistance = 40
      categoryAxis.fontSize = 10
      categoryAxis.fillOpacity = 0.5
      categoryAxis.fontFamily = 'Montserrat'
      categoryAxis.renderer.labels.template.wrap = true
      categoryAxis.paddingBottom = 8
      categoryAxis.paddingTop = 5
      categoryAxis.cursorTooltipEnabled = false
      categoryAxis.renderer.labels.template.wrap = true
      categoryAxis.events.on('sizechanged', function (ev) {
        let axis = ev.target
        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45
          axis.renderer.labels.template.horizontalCenter = 'right'
          axis.renderer.labels.template.verticalCenter = 'middle'
        } else {
          axis.renderer.labels.template.rotation = 0
          axis.renderer.labels.template.horizontalCenter = 'middle'
          axis.renderer.labels.template.verticalCenter = 'top'
        }
      })

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      // valueAxisBar.max = Math.ceil(barChartData.displayValue / 1000) * 1000
      valueAxis.renderer.minGridDistance = 50
      valueAxis.fontSize = 12
      valueAxis.fillOpacity = .5
      valueAxis.fontFamily = 'Montserrat'
      valueAxis.cursorTooltipEnabled = false
      valueAxis.renderer.labels.template.wrap = true
      valueAxis.numberFormatter.numberFormat = waterFallStatus === 'sum' ? '#,# a' : '#.#'

      let columnSeries = chart.series.push(new am4charts.ColumnSeries())
      columnSeries.dataFields.categoryX = 'category'
      columnSeries.dataFields.valueY = 'value'
      columnSeries.dataFields.openValueY = 'open'
      columnSeries.fillOpacity = 1
      columnSeries.sequencedInterpolation = true
      columnSeries.interpolationDuration = 1500
      columnSeries.columns.template.column.cornerRadiusTopLeft = 5
      columnSeries.columns.template.column.cornerRadiusTopRight = 5
      columnSeries.columns.template.column.cornerRadiusBottomLeft = 5
      columnSeries.columns.template.column.cornerRadiusBottomRight = 5
      columnSeries.columns.template.tooltipText = '{value}'
      columnSeries.tooltip.label.padding(0, 0, 0, 0)
      columnSeries.tooltip.getStrokeFromObject = false
      columnSeries.tooltip.getFillFromObject = false
      columnSeries.tooltip.background.fill = am4core.color('#FFFFFF')
      columnSeries.adapter.add('tooltipHTML', function (text, target) {
        let mainText = ''
        let value = 0
        let displayValue = target.tooltipDataItem.dataContext ? target.tooltipDataItem.dataContext.displayValue : 0
        let period = target.tooltipDataItem.dataContext ? target.tooltipDataItem.dataContext.category : ''

        switch (waterFallStatus) {
          case 'count':
            mainText = <div>Кількість процедур з<br />виявленим порушенням:</div>
            value = numeral(displayValue).format('0,0')
            break

          case 'sum':
            mainText = <div>Сума процедур з<br />виявленим порушенням:</div>
            value = `${numeral(displayValue).format('0.0 a')} грн`
            break

          case 'entity':
            mainText = 'Кількість замовників:'
            value = numeral(displayValue).format('0,0')
            break

          default:
            mainText = ''
            value = numeral(displayValue).format('0,0')
        }

        return renderToString(
          <div className="water-fall-tooltip-container">
            <div className="water-fall-tooltip-container__part">
              <div className="water-fall-tooltip-container__text">{mainText}</div>
              <div className="water-fall-tooltip-container__value">{value}</div>
            </div>
            <div className="water-fall-tooltip-container__part">
              <div className="water-fall-tooltip-container__text">Період:</div>
              <div
                // className="water-fall-tooltip-container__value">{dayjs(fakeDate[0]).format('MM.YYYY')} - {dayjs(fakeDate[fakeDate.length - 1]).format('MM.YYYY')}</div>
                className="water-fall-tooltip-container__value">{period}</div>
            </div>
          </div>,
        )
      })

      columnSeries.columns.template.adapter.add('fill', (fill, target) => {
        if (target.dataItem.dataContext.color) {
          return target.dataItem.dataContext.color
        } else {
          let columnGradient = new am4core.LinearGradient()
          columnGradient.rotation = 270
          columnGradient.addColor('#1E6592', 1, 0)
          columnGradient.addColor('#48A4B0', 1, 1)
          return columnGradient
        }

      })

      let bulletLabel = columnSeries.bullets.push(new am4charts.LabelBullet())
      bulletLabel.fontFamily = 'Montserrat'
      bulletLabel.fontWeight = '500'
      bulletLabel.fontSize = 12
      bulletLabel.locationY = 0.5
      bulletLabel.label.fillOpacity = .75
      // bulletLabel.label.text = '{displayValue.formatNumber("#.")}'
      bulletLabel.label.text = '{formattedValue}'
      bulletLabel.label.adapter.add('verticalCenter', function (center, target) {
        if (target.dataItem.dataContext.displayValue < barChartData.displayValue / 20) {
          return 'bottom'
        } else {
          return 'middle'
        }
      })
      bulletLabel.label.adapter.add('dy', function (position, target) {
        if (waterFallStatus === 'sum') {
          if (target.dataItem.dataContext.displayValue < barChartData.displayValue / 20) {
            return -15
          } else {
            return 0
          }
        } else {
          if (target.dataItem.dataContext.displayValue < barChartData.displayValue / 20) {
            return -10
          } else {
            return 0
          }
        }
      })

      let columnTemplate = columnSeries.columns.template
      columnTemplate.strokeOpacity = 0
      columnTemplate.propertyFields.fill = 'color'


      chart.cursor = new am4charts.XYCursor()
      chart.cursor.lineY.disabled = true
      chart.cursor.lineX.disabled = true
      chart.cursor.behavior = 'none'
    }

    return (chart) => {
      chart && chart.dispose()
    }

  }, [waterFallChartData])

  return (
    <div className="results-office-container">
      <Row className="results-office-row" justify="center">
        <Col className="results-office-column" xs={24} sm={18} md={18} lg={18} xl={21} xxl={18}>
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
                mainText="Вартість процедур з виявленими порушеннями"
                infoText="Можете обрати період, тип порушення, підрозділ Держаудитслужби, та переглянути інформацію за сумою чи кількістю"
                countText=''
                value={resultsByOffices.tendersAmount}
                isCurrency={true}
              />
              <div className="results-office-regions">
                {!mobile ? <div className="results-office-regions-select">
                  <div className="left-side">
                    <span className="select-label">
                      Тип порушення:
                    </span>
                    <Space
                      id="wrapper"
                      style={{
                        width: 465,
                        position: 'relative',
                      }}
                    >
                      <Select
                        allowClear
                        getPopupContainer={() => document.getElementById('wrapper')}
                        className="regions-select"
                        dropdownClassName="violations-drop-down"
                        placeholder="Порушення строків"
                        // mode='multiple'
                        options={options}
                        onChange={(newValue) => {
                          setRegion(newValue)
                        }}
                        maxTagCount='responsive'
                        style={{
                          width: 465,
                        }}
                      />
                    </Space>
                  </div>
                  <div className="change-type-buttons">
                    <Radio.Group defaultValue="count" optionType="button"
                                 onChange={(event) => changeWaterFallStatus(event.target.value)}>
                      <Radio.Button className="left-button group-button" value="sum">Сума</Radio.Button>
                      <Radio.Button className="middle-button group-button" value="entity">Замовники</Radio.Button>
                      <Radio.Button className="right-button group-button" value="count">Кількість</Radio.Button>
                    </Radio.Group>
                  </div>
                </div> : null}
              </div>
              <div className="results-office-chart-wrapper">
                <div className="left-side">
                  <div>
                    <span className="title">Перелік підрозділів Держаудитслужби:</span>
                  </div>
                  <div className="left-side__wrapper">
                    <div>{mobile ? renderLeftSideMobileInfo() : renderLeftSideInfo()}</div>
                  </div>
                </div>
                {!mobile ? <div className="right-side">
                  <div className="right-side__title">Накопичувальна динаміка проведення моніторингів</div>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div id="results-office-chart" style={{ width: '85%', height: '500px' }}></div>
                    <div id="results-office-bar-chart" style={{ width: '15%', height: '500px' }}></div>
                  </div>
                </div> : null}
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

export default ResultsByOffice