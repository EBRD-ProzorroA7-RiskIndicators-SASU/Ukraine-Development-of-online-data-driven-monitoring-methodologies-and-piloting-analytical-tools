import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Radio, Select, Space } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MAX_MOBILE_WIDTH, MOBILE_BAR_CHART_OPTIONS, REGIONS_LIST } from '../../constants'
import { getResultSourcesData } from '../../redux/actions/monitoringActions'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import _ from 'lodash'
import 'moment/locale/uk'
import './styles.scss'
import Instruction from '../Instruction/Instruction'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import { renderToString } from 'react-dom/server'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const ResultsSource = () => {
  const dispatch = useDispatch()
  const resultSourcesData = useSelector(state => state.monitoringStore.resultSourcesData)
  const mappingsData = useSelector(state => state.mappingsStore.mappingsData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const [period, setPeriod] = useState([startDate, endDate])
  const [offices, setOffices] = useState([])
  const [selectedOffices, setSelectedOffices] = useState([])
  const flipRef = useRef(null)
  const monitoringSourceRef = useRef(null)
  const dynamicChartRef = useRef(null)
  const [region, setRegion] = useState([])
  const [selectedViolationIds, setSelectedViolationIds] = useState([])
  const [treeMapStatus, changeTreeMapStatus] = useState('tendersCount')
  const [mobileChartHeight, setMobileChartHeight] = useState(0)
  const [currentWidth, setCurrentWidth] = useState(window.outerWidth)
  const mobile = currentWidth <= MAX_MOBILE_WIDTH
  const w = useWidth()
  const options = REGIONS_LIST

  const selectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    region,
    options,
    onChange: (newValue) => {
      setRegion(newValue)
    },
    placeholder: 'Вибрані регіони',
    maxTagCount: 'responsive',
  }

  useEffect(() => {
    if (currentWidth !== window.outerWidth) {
      setCurrentWidth(window.outerWidth)
    }
  }, [w])

  useEffect(() => {
    setOffices(mappingsData.offices.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    }))
  }, [mappingsData])

  useEffect(() => {
    dispatch(getResultSourcesData(period[0], period[1], region, selectedOffices, selectedViolationIds))
    // dispatch(setCurrentDate(period[0], period[1]))
  }, [period, region, selectedOffices, selectedViolationIds])

  useLayoutEffect(() => {
    if (mobile) {
      const firstChartData = resultSourcesData.reasonTenders.map((item, index) => {
        const reasonsData = _.find(mappingsData.reasons, { id: item.reasonId })
        const totalReason = item.violationTendersCount + item.nonViolationTendersCount
        return {
          category: index,
          fixedValue: 100,
          leftText: reasonsData.nameUa,
          value: Math.round((item.violationTendersCount + Number.EPSILON) * 100) / totalReason,
          rightText: numeral(item.violationTendersCount).format('0,0'),
        }
      })

      const secondChartData = resultSourcesData.reasonTenders.map((item, index) => {
        const reasonsData = _.find(mappingsData.reasons, { id: item.reasonId })
        const totalReason = item.violationTendersCount + item.nonViolationTendersCount
        return {
          category: index,
          fixedValue: 100,
          leftText: reasonsData.nameUa,
          value: Math.round((item.nonViolationTendersCount + Number.EPSILON) * 100) / totalReason,
          rightText: numeral(item.nonViolationTendersCount).format('0,0'),
        }
      })


      let chartFirst = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'first-bar-chart', 'XYChart')
      let chartSecond = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'second-bar-chart', 'XYChart')

      chartFirst.height = 50 * firstChartData.length
      chartSecond.height = 50 * secondChartData.length
      chartFirst.data = firstChartData
      chartSecond.data = secondChartData

      setMobileChartHeight(50 * firstChartData.length)
    }

    return (chartFirst, chartSecond) => {
      chartFirst && chartFirst.dispose()
      chartSecond && chartSecond.dispose()
    }
  }, [resultSourcesData])

  useLayoutEffect(() => {
    if (!mobile) {
      const monitoringSourceChart = am4core.create('monitoring-source-chart', am4core.Container)
      const monitoringSourceChartValueAxis = am4core.create('monitoring-source-chart-value-axis', am4core.Container)
      monitoringSourceRef.current = monitoringSourceChart

      // monitoringSourceChart.exporting.menu = new am4core.ExportMenu()
      // monitoringSourceChart.exporting.formatOptions.getKey('csv').disabled = true
      // monitoringSourceChart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      monitoringSourceChart.width = am4core.percent(100)
      monitoringSourceChart.padding(0, 10, 8, 10)
      monitoringSourceChartValueAxis.width = am4core.percent(100)
      monitoringSourceChartValueAxis.padding(0, 0, 50, 0)
      monitoringSourceChart.height = am4core.percent(100)
      monitoringSourceChartValueAxis.height = am4core.percent(100)
      monitoringSourceChart.layout = 'horizontal'
      monitoringSourceChartValueAxis.layout = 'horizontal'

      // const totalViolation = _.reduce(resultSourcesData.reasonTenders, (memo, item) => {
      //   return memo + item.violationTendersCount + item.nonViolationTendersCount
      // }, 0)
      // const totalNonViolation = _.reduce(resultSourcesData.reasonTenders, (memo, item) => {
      //   return memo + item.nonViolationTendersCount
      // }, 0)

      const usData = resultSourcesData.reasonTenders.map((item) => {
        const reasonsData = _.find(mappingsData.reasons, { id: item.reasonId })
        const totalReason = item.violationTendersCount + item.nonViolationTendersCount
        return {
          violationId: reasonsData.id,
          source: reasonsData.nameUa,
          sourceLite: reasonsData.nameUa.length > 55 ? reasonsData.nameUa.substring(0, 55) + ' ...' : reasonsData.nameUa,
          violation: Math.round((item.violationTendersCount + Number.EPSILON) * 100) / totalReason,
          // violation: Math.round((item.violationTendersCount + Number.EPSILON) * 100) / totalViolation,
          nonViolation: Math.round((item.nonViolationTendersCount + Number.EPSILON) * 100) / totalReason,
          // nonViolation: Math.round((item.nonViolationTendersCount + Number.EPSILON) * 100) / totalViolation,
          violationValue: item.violationTendersCount,
          nonViolationValue: item.nonViolationTendersCount,
        }
      })

      const maleChart = monitoringSourceChart.createChild(am4charts.XYChart)
      const maleChartValueAxis = monitoringSourceChartValueAxis.createChild(am4charts.XYChart)
      maleChart.paddingRight = 0
      maleChartValueAxis.paddingRight = 0
      maleChart.data = JSON.parse(JSON.stringify(usData))
      maleChartValueAxis.data = JSON.parse(JSON.stringify(usData))

      // Create axes
      const maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis())
      maleCategoryAxis.dataFields.category = 'source'
      maleCategoryAxis.renderer.grid.template.location = 0
      //maleCategoryAxis.renderer.inversed = true;
      maleCategoryAxis.renderer.minGridDistance = 15
      maleCategoryAxis.renderer.labels.template.disabled = true

// Create axes
      const maleCategoryAxisValue = maleChartValueAxis.yAxes.push(new am4charts.CategoryAxis())
      maleCategoryAxisValue.dataFields.category = 'sourceLite'
      maleCategoryAxisValue.renderer.grid.template.location = 0
      //maleCategoryAxis.renderer.inversed = true;
      maleCategoryAxisValue.renderer.minGridDistance = 15
      // maleCategoryAxisValue.padding(0,0,0,0)
      maleCategoryAxisValue.renderer.labels.template.verticalCenter = 'middle'
      maleCategoryAxisValue.renderer.labels.template.horizontalCenter = 'right'
      // maleCategoryAxisValue.maxWidth = 120


      let label = maleCategoryAxisValue.renderer.labels.template
      label.wrap = true
      label.fontSize = 12
      label.fill = '#666666'
      label.width = 84 * (currentWidth / 1000)
      label.dx = 0
      label.dy = -10
      // label.height = 60

      const maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis())
      maleValueAxis.renderer.inversed = true
      maleValueAxis.min = 0
      maleValueAxis.max = 100
      maleValueAxis.strictMinMax = true
      maleValueAxis.renderer.minGridDistance = 20
      maleValueAxis.fontSize = 10
      maleValueAxis.renderer.labels.template.fill = '#666666'
      maleValueAxis.title.text = 'Без виявлених\nпорушень'
      maleValueAxis.title.rotation = 0
      maleValueAxis.title.fontSize = 12
      maleValueAxis.title.fill = '#666666'
      maleValueAxis.title.align = 'center'
      maleValueAxis.title.valign = 'top'
      maleValueAxis.numberFormatter = new am4core.NumberFormatter()
      maleValueAxis.numberFormatter.numberFormat = '#.#\'%\''

      // Create series
      const maleSeries = maleChart.series.push(new am4charts.ColumnSeries())
      maleSeries.dataFields.valueX = 'nonViolation'
      // maleSeries.dataFields.valueXShow = 'percent'
      // maleSeries.calculatePercent = true
      maleSeries.dataFields.categoryY = 'source'
      // maleSeries.interpolationDuration = 1000
      maleSeries.fill = '#3DCAD4'
      maleSeries.stroke = maleSeries.fill
      maleSeries.columns.template.tooltipText = 'Males, age{categoryY}: {valueX} ({valueX.percent.formatNumber(\'#.0\')}%)'
      maleSeries.columns.template.column.cornerRadiusTopLeft = 10
      maleSeries.columns.template.column.cornerRadiusBottomLeft = 10
      maleSeries.tooltip.getFillFromObject = false
      maleSeries.tooltip.background.fill = am4core.color('#FFF')
      maleSeries.tooltip.getStrokeFromObject = true
      maleSeries.tooltip.label.padding(0, 0, 0, 0)
      maleSeries.tooltip.pointerOrientation = 'vertical'
      maleSeries.columns.template.strokeOpacity = 0
      // femaleSeries.tooltip.background.strokeWidth = 3
      maleSeries.columns.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTooltip(target.dataItem.dataContext, false)
      })
      //maleSeries.sequencedInterpolation = true;


      const femaleChart = monitoringSourceChart.createChild(am4charts.XYChart)
      femaleChart.paddingLeft = 0
      femaleChart.data = JSON.parse(JSON.stringify(usData))

      // Create axes
      const femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis())
      femaleCategoryAxis.renderer.opposite = true
      femaleCategoryAxis.dataFields.category = 'source'
      femaleCategoryAxis.renderer.grid.template.location = 0
      femaleCategoryAxis.renderer.minGridDistance = 15
      femaleCategoryAxis.renderer.labels.template.disabled = true

      const femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis())
      femaleValueAxis.min = 0
      femaleValueAxis.max = 100
      femaleValueAxis.strictMinMax = true
      femaleValueAxis.renderer.minGridDistance = 20
      femaleValueAxis.fontSize = 10
      femaleValueAxis.renderer.labels.template.fill = '#666666'
      femaleValueAxis.title.text = 'З виявленими\nпорушеннями'
      femaleValueAxis.title.rotation = 0
      femaleValueAxis.title.fontSize = 12
      femaleValueAxis.title.fill = '#666666'
      femaleValueAxis.title.align = 'center'
      femaleValueAxis.title.valign = 'top'
      femaleValueAxis.numberFormatter = new am4core.NumberFormatter()
      femaleValueAxis.numberFormatter.numberFormat = '#.#\'%\''

      // Create series
      const femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries())
      femaleSeries.dataFields.valueX = 'violation'
      // femaleSeries.dataFields.valueXShow = 'percent'
      // femaleSeries.calculatePercent = true
      femaleSeries.fill = '#CEF1F4'
      femaleSeries.stroke = femaleSeries.fill
      //femaleSeries.sequencedInterpolation = true;
      femaleSeries.columns.template.tooltipText = 'Females, age{categoryY}: {valueX} ({valueX.percent.formatNumber(\'#.0\')}%)'
      femaleSeries.dataFields.categoryY = 'source'
      femaleSeries.interpolationDuration = 1000
      femaleSeries.columns.template.column.cornerRadiusTopRight = 10
      femaleSeries.columns.template.column.cornerRadiusBottomRight = 10
      femaleSeries.tooltip.getFillFromObject = false
      femaleSeries.tooltip.background.fill = am4core.color('#FFF')
      femaleSeries.tooltip.getStrokeFromObject = true
      femaleSeries.tooltip.label.padding(0, 0, 0, 0)
      femaleSeries.tooltip.pointerOrientation = 'vertical'
      femaleSeries.columns.template.strokeOpacity = 0
      // femaleSeries.tooltip.background.strokeWidth = 3
      femaleSeries.columns.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTooltip(target.dataItem.dataContext, true)
      })
      femaleSeries.columns.template.events.on('inited', function (ev) {
        ev.target.isActive = _.isEqual([ev.target.dataItem.dataContext.violationId], selectedViolationIds)
      })

      femaleSeries.columns.template.events.on('hit', (ev) => {
        if (_.isEqual([ev.target.dataItem.dataContext.violationId], selectedViolationIds)) {
          setSelectedViolationIds([])
        } else {
          setSelectedViolationIds([ev.target.dataItem.dataContext.violationId])
        }
      })

      const activeState = femaleSeries.columns.template.states.create('active')
      activeState.properties.fill = `#FFB800`

      return (monitoringSourceChart) => {
        monitoringSourceChart && monitoringSourceChart.dispose()
      }
    }
  }, [resultSourcesData])

  const prepareTooltip = (tooltipData) => {
    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            Джерело: {tooltipData.source}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Кількість процедур з<br />виявленим порушенням:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.violationValue}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Частка процедур з<br />виявленим порушенням:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.violation.toFixed(2)}%
          </div>
        </div>
        <br />
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Кількість процедур без<br />виявлених порушень:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.nonViolationValue}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            Частка процедур без<br />виявлених порушень:
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {tooltipData.nonViolation.toFixed(2)}%
          </div>
        </div>
      </div>,
    )
  }

  const prepareTreeMapTooltip = (tooltipData) => {
    let countName = ''

    switch (treeMapStatus) {
      case 'tendersCount':
        countName = 'Кількість процедур:'
        break
      case 'tendersAmount':
        countName = 'Сума процедур:'
        break
      case 'procuringEntitiesCount':
        countName = 'Кількість замовників:'
        break

      default:
        countName = 'Кількість процедур:'
        break
    }

    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            {tooltipData.name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className="monitoring-types-radar-tooltip-title">
            {countName}
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {treeMapStatus === 'tendersAmount' ? `${numeral(tooltipData.value).format('0.00 a')} грн` : numeral(tooltipData.value).format('0,0')}
          </div>
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    if (!mobile) {
      const dynamicDataChart = am4core.create('dynamic-data-chart', am4charts.TreeMap)
      dynamicChartRef.current = dynamicDataChart
      dynamicDataChart.hiddenState.properties.opacity = 0
      dynamicDataChart.padding(10, 0, 10, 0)

      // dynamicDataChart.exporting.menu = new am4core.ExportMenu()
      // dynamicDataChart.exporting.formatOptions.getKey('csv').disabled = true
      // dynamicDataChart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]


      let chartData = resultSourcesData.violations.map((item, index) => {
        const violationData = _.find(mappingsData.violations, { id: item.violationId })
        let countName = ''

        switch (treeMapStatus) {
          case 'tendersCount':
            countName = 'процедур'
            break
          case 'tendersAmount':
            countName = 'сума процедур'
            break
          case 'procuringEntitiesCount':
            countName = 'замовників'
            break

          default:
            countName = 'процедур'
            break
        }

        return {
          name: `name_${index}`,
          count: item[treeMapStatus],
          countFormatted: treeMapStatus === 'tendersAmount' ? `${numeral(item[treeMapStatus]).format('0.00 a')} грн` : numeral(item[treeMapStatus]).format('0,0'),
          countFormattedLite: treeMapStatus === 'tendersAmount' ? numeral(item[treeMapStatus]).format('0.00 a').split(' ')[0] : numeral(item[treeMapStatus]).format('0,0'),
          countName: countName,
          children: [
            {
              name: violationData.nameUa,
              nameLite: violationData.nameUa.length > 55 ? violationData.nameUa.substring(0, 55) + ' ...' : violationData.nameUa,
              nameSuperLite: violationData.nameUa.length > 30 ? violationData.nameUa.substring(0, 30) + ' ...' : violationData.nameUa,
              value: item[treeMapStatus],
            },
          ],
        }
      })

      dynamicDataChart.data = chartData.slice(0, 6)

      dynamicDataChart.colors.step = 2

      // define data fields
      dynamicDataChart.dataFields.value = 'value'
      dynamicDataChart.dataFields.name = 'name'
      dynamicDataChart.dataFields.children = 'children'
      dynamicDataChart.layoutAlgorithm = dynamicDataChart.binaryTree

      dynamicDataChart.zoomable = false

      // level 0 series template
      const level0SeriesTemplate = dynamicDataChart.seriesTemplates.create('0')
      const level0ColumnTemplate = level0SeriesTemplate.columns.template

      level0ColumnTemplate.column.cornerRadius(10, 10, 10, 10)
      level0ColumnTemplate.fillOpacity = 0
      level0ColumnTemplate.strokeWidth = 4
      level0ColumnTemplate.strokeOpacity = 0

      // level 1 series template
      const level1SeriesTemplate = dynamicDataChart.seriesTemplates.create('1')
      level1SeriesTemplate.tooltip.dy = -15
      level1SeriesTemplate.tooltip.pointerOrientation = 'vertical'
      level1SeriesTemplate.columns.template.column.cornerRadiusTopLeft = 10
      level1SeriesTemplate.columns.template.column.cornerRadiusBottomLeft = 10
      level1SeriesTemplate.tooltip.getFillFromObject = false
      level1SeriesTemplate.tooltip.background.fill = am4core.color('#FFF')
      level1SeriesTemplate.tooltip.getStrokeFromObject = true
      level1SeriesTemplate.tooltip.label.padding(0, 0, 0, 0)
      level1SeriesTemplate.columns.template.strokeOpacity = 0
      level1SeriesTemplate.columns.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTreeMapTooltip(target.dataItem.dataContext)
      })

      const level1ColumnTemplate = level1SeriesTemplate.columns.template

      level1SeriesTemplate.tooltip.animationDuration = 0
      level1SeriesTemplate.strokeOpacity = 1

      level1ColumnTemplate.column.cornerRadius(10, 10, 10, 10)
      level1ColumnTemplate.fillOpacity = 1
      level1ColumnTemplate.strokeWidth = 4
      level1ColumnTemplate.stroke = am4core.color('#ffffff')

      const bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet())
      bullet1.locationY = 0.9
      bullet1.locationX = 0.6
      bullet1.label.text = '[bold]{countFormatted}[/] {countName}\n\n{name}'
      bullet1.label.fontSize = 12
      bullet1.label.fill = am4core.color('#404040')
      bullet1.label.wrap = true
      bullet1.label.truncate = false
      bullet1.label.verticalCenter = 'top'
      bullet1.label.padding(0, 50, 0, 0)
      bullet1.label.adapter.add('text', (text, target) => {
        if (target.properties.maxHeight > 150 && target.properties.maxWidth > 150) {
          return text
        } else {
          if (((target.properties.maxHeight + target.properties.maxWidth) / 2) > 150) {
            return '[bold]{countFormatted}[/] {countName}\n\n{nameLite}'
          } else {
            if (((target.properties.maxHeight + target.properties.maxWidth) / 2) > 130) {
              return '[bold]{countFormatted}[/]\n\n{nameSuperLite}'
            } else if (target.properties.maxWidth > 40) {
              target.wrap = false
              target.paddingRight = 0
              target.paddingLeft = 0
              return '[bold]{countFormattedLite}[/]'
            } else {
              return ''
            }
          }
        }
      })

      return (dynamicDataChart) => {
        dynamicDataChart && dynamicDataChart.dispose()
      }
    }
  }, [resultSourcesData, treeMapStatus])

  return (
    <div className="results-source-container">
      <Row className="results-source-row" justify="center">
        <Col className="results-source-column" xs={24} sm={18} md={18} lg={18} xl={21} xxl={18}>
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
                // mainText="Загальна вартість контрактів переможців торгів, що охоплені моніторингом за період"
                mainText="Сума переможних тендерних пропозицій у процедурах, охоплених моніторингом за період"
                infoText="Можете обрати період, категорію на діаграмі, спосіб відображення даних за кількістю чи сумою."
                countText=''
                value={resultSourcesData.tendersAmount}
                isCurrency={true}
                noMainPadding={mobile}
              />
              {!mobile && <div className="results-source-regions">
                <div className="results-source-regions-select">
                  <span className="select-label">
                    Регіон:
                  </span>
                  <Space
                    id="wrapper"
                    style={{
                      width: 265,
                      position: 'relative',
                    }}
                  >
                    <Select
                      mode='multiple'
                      getPopupContainer={() => document.getElementById('wrapper')}
                      className="regions-select"
                      dropdownClassName="regions-drop-down"
                      placeholder="Вибрані регіони"
                      {...selectProps}
                      style={{
                        width: 265,
                      }}
                    />
                  </Space>
                </div>
                <div className="results-source-regions-select">
                  <span className="select-label">
                    Підрозділи Держаудитслужби:
                  </span>
                  <Space
                    id="wrapper"
                    style={{
                      width: 465,
                      position: 'relative',
                    }}
                  >
                    <Select
                      mode='multiple'
                      getPopupContainer={() => document.getElementById('wrapper')}
                      className="regions-select"
                      dropdownClassName="offices-drop-down"
                      placeholder=""
                      options={offices}
                      onChange={(newValue) => {
                        setSelectedOffices(newValue)
                      }}
                      maxTagCount='responsive'
                      style={{
                        width: mobile ? 265 : 465,
                      }}
                    />
                  </Space>
                </div>
              </div>}
              <div className="results-source-chart-wrapper">
                {!mobile && <div className="left-side">
                  <span className="title">
                    Кількість процедур з моніторингом
                  </span>
                  <div style={{ display: 'flex' }}>
                    <div id="monitoring-source-chart-value-axis" style={{ width: '30%', height: '500px' }} />
                    <div id="monitoring-source-chart" style={{ width: '70%', height: '500px' }} />
                  </div>
                </div>}
                {!mobile && <div className="right-side">
                  <div className="top-section">
                    <span className="top-section__title">
                      Типи порушень
                    </span>
                    <div className="change-type-buttons">
                      <Radio.Group defaultValue={treeMapStatus} optionType="button"
                                   onChange={(event) => changeTreeMapStatus(event.target.value)}>
                        <Radio.Button className="left-button group-button" value="tendersAmount">Сума</Radio.Button>
                        <Radio.Button className="middle-button group-button"
                                      value="procuringEntitiesCount">Замовники</Radio.Button>
                        <Radio.Button className="right-button group-button"
                                      value="tendersCount">Кількість</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div id="dynamic-data-chart" style={{ width: '100%', height: '500px' }} />
                </div>}
                <Row justify="flex">
                  {mobile && <Col xs={24}>
                    <Col xs={24}>
                      <div className="mobile-chart-container">
                        <div className="mobile-chart-container__title">
                          Кількість процедур з виявленим порушенням:
                        </div>
                        <div className="" id="first-bar-chart"
                             style={{ width: '100%', position: 'relative', height: mobileChartHeight }} />
                      </div>
                    </Col>
                    <Col xs={24}>
                      <div className="mobile-chart-container">
                        <div className="mobile-chart-container__title">
                          Кількість процедур без виявлених порушень:
                        </div>
                        <div className="" id="second-bar-chart"
                             style={{ width: '100%', position: 'relative', height: mobileChartHeight }} />
                      </div>
                    </Col>
                  </Col>
                  }
                </Row>
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

export default ResultsSource