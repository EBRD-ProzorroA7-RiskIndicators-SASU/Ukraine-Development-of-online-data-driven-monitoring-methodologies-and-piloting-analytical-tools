import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { Row, Col } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import cx from 'classnames'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MONITORING_COVERAGE_LEGEND, MAX_MOBILE_WIDTH, MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import _ from 'lodash'
import 'moment/locale/uk'
import { getDataMonitoringCoveragePage } from '../../redux/actions/monitoringActions'
import { useDispatch, useSelector } from 'react-redux'
import SwitchCustom from '../../components/SwitchCustom/SwitchCustom'
import InfoBlockHeader from '../../components/InfoBlockHeader/InfoBlockHeader'
import PeriodComponent from '../../components/PeriodComponent/PeriodComponent'
import Instruction from '../../components/Instruction/Instruction'
import './styles.scss'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const MonitoringCoverage = () => {
  const dispatch = useDispatch()
  const monitoringCoverageData = useSelector(state => state.monitoringStore.monitoringCoverageData)
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const zoomableRef = useRef(null)
  const [regionIds, setRegion] = useState([])
  const [toggleSwitcher, setToggleSwitcher] = useState(true)
  const [currentWidth, setCurrentWidth] = useState(window.outerWidth - 40)
  const mobile = currentWidth <= MAX_MOBILE_WIDTH
  const [period, setPeriod] = useState([startDate, endDate])
  const w = useWidth()

  useEffect(() => {
    dispatch(getDataMonitoringCoveragePage(period[0], period[1], regionIds))
  }, [period, regionIds])

  useEffect(() => {
    if (currentWidth !== window.outerWidth) {
      setCurrentWidth(window.outerWidth - 40)
    }
  }, [w])

  const prepareLineTooltip = (tooltipData) => {
    return renderToString(
      <div className='tooltip-container'>
        <div className="tooltip-header">{tooltipData.groupName}</div>
        {tooltipData.dependentName ?
          <div className="tooltip-middle">{tooltipData.childName} -> {tooltipData.dependentName}</div> :
          <div className="tooltip-middle">{tooltipData.childName}</div>
        }
        <div className="tooltip-footer">
          <div className="tooltip-footer-title">
            {toggleSwitcher ? 'Кількість процедур:' : 'Процедур на суму:'}
          </div>
          <div className='tooltip-footer-value'>
            {toggleSwitcher ? numeral(tooltipData.value).format('0,0') : `${numeral(tooltipData.value).format('0.00 a')} грн`}
          </div>
        </div>
        <div className="tooltip-footer">
          <div className="tooltip-footer-title">
            Кількість замовників:
          </div>
          <div className='tooltip-footer-value'>
            {numeral(tooltipData.procuringEntity).format('0,0')}
          </div>
        </div>
        <div className="tooltip-footer">
          <div className="tooltip-footer-title">
            {toggleSwitcher ? 'Частка від загальної кількості:' : 'Частка від загальної суми:'}
          </div>
          <div className='tooltip-footer-value'>
            {tooltipData.percent}%
          </div>
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    if (mobile) {
      const firstChartData = prepareBarChartData(
        'cancelledTendersCount',
        'completeTendersCount',
        'cancelledTendersAmount',
        'completeTendersAmount',
        MONITORING_COVERAGE_LEGEND[0].children[2].name,
        MONITORING_COVERAGE_LEGEND[0].children[1].name,
      )

      const secondChartData = prepareBarChartData(
        'violationMonitoringTendersCount',
        'nonViolationMonitoringTendersCount',
        'violationMonitoringAmount',
        'nonViolationMonitoringAmount',
        MONITORING_COVERAGE_LEGEND[3].children[1].name,
        MONITORING_COVERAGE_LEGEND[3].children[2].name,
      )


      let chartFirst = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'first-bar-chart', 'XYChart')
      let chartSecond = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, 'second-bar-chart', 'XYChart')

      chartFirst.data = firstChartData
      chartSecond.data = secondChartData
    }

    return (chartFirst, chartSecond) => {
      chartFirst && chartFirst.dispose()
      chartSecond && chartSecond.dispose()
    }
  })

  useLayoutEffect(() => {
    if (!mobile) {

      const chartData = monitoringCoverageData.tendersDistribution
      let chart = am4core.create('zoomable-chart', am4charts.SankeyDiagram)
      chart.padding(0, 10, 10, 0)
      // chart.hiddenState.properties.opacity = 0
      chart.height = 380

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

      let groupATotal = toggleSwitcher ? chartData.othersTendersCount : chartData.othersTendersAmount
      groupATotal += toggleSwitcher ? chartData.completeTendersCount : chartData.completeTendersAmount
      groupATotal += toggleSwitcher ? chartData.cancelledTendersCount : chartData.cancelledTendersAmount

      let groupBTotal = toggleSwitcher ? chartData.monitoringTendersCount : chartData.monitoringTendersAmount
      groupBTotal += toggleSwitcher ? chartData.nonMonitoringTendersCount : chartData.nonMonitoringTendersAmount

      let groupCTotal = toggleSwitcher ? chartData.activeMonitoringTendersCount : chartData.activeMonitoringAmount
      groupCTotal += toggleSwitcher ? chartData.violationMonitoringTendersCount : chartData.violationMonitoringAmount
      groupCTotal += toggleSwitcher ? chartData.nonViolationMonitoringTendersCount : chartData.nonViolationMonitoringAmount
      groupCTotal += toggleSwitcher ? chartData.cancelledMonitoringTendersCount : chartData.cancelledMonitoringAmount

      chart.data = [
        { from: 'A', nodeColor: '#2B82BA' },
        { from: 'D', nodeColor: '#3DCAD4' },
        { from: 'E', nodeColor: '#FFB800' },
        { from: 'F', nodeColor: '#FFB800' },
        // { from: 'G', nodeColor: '#6A568B' },
        { from: 'H', nodeColor: '#6A568B' },
        { from: 'M', nodeColor: '#6A568B' },
        // { from: 'K', nodeColor: '#6A568B' },
        { from: 'J', nodeColor: '#fff', displayLabel: false },
        { from: 'Y', nodeColor: '#fff', displayLabel: false },
        {
          from: 'A',
          to: 'D',
          customValue: chartData.othersTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.othersTendersCount : chartData.othersTendersAmount,
          nodeColor: '#2B82BA',
          groupName: MONITORING_COVERAGE_LEGEND[0].groupName,
          childName: MONITORING_COVERAGE_LEGEND[0].children[0].name,
          procuringEntity: chartData.othersProcuringEntityCount,
          dependentName: null,
          percent: (Math.round((toggleSwitcher ? chartData.othersTendersCount : chartData.othersTendersAmount + Number.EPSILON) * 100) / groupATotal).toFixed(2),
        },
        {
          from: 'B',
          to: 'D',
          customValue: chartData.completeTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.completeTendersCount : chartData.completeTendersAmount,
          nodeColor: '#2B82BA',
          groupName: MONITORING_COVERAGE_LEGEND[0].groupName,
          childName: MONITORING_COVERAGE_LEGEND[0].children[1].name,
          procuringEntity: chartData.completeProcuringEntityCount,
          dependentName: null,
          percent: (Math.round((toggleSwitcher ? chartData.completeTendersCount : chartData.completeTendersAmount + Number.EPSILON) * 100) / groupATotal).toFixed(2),
        },
        {
          from: 'C',
          to: 'D',
          customValue: chartData.cancelledTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.cancelledTendersCount : chartData.cancelledTendersAmount,
          nodeColor: '#2B82BA',
          groupName: MONITORING_COVERAGE_LEGEND[0].groupName,
          childName: MONITORING_COVERAGE_LEGEND[0].children[2].name,
          procuringEntity: chartData.cancelledProcuringEntityCount,
          dependentName: null,
          percent: (Math.round((toggleSwitcher ? chartData.cancelledTendersCount : chartData.cancelledTendersAmount + Number.EPSILON) * 100) / groupATotal).toFixed(2),
        },
        {
          from: 'D',
          to: 'E',
          customValue: chartData.monitoringTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.monitoringTendersCount : chartData.monitoringTendersAmount,
          nodeColor: '#3DCAD4',
          groupName: MONITORING_COVERAGE_LEGEND[1].groupName,
          childName: MONITORING_COVERAGE_LEGEND[1].children[0].name,
          procuringEntity: chartData.monitoringProcuringEntityCount,
          dependentName: MONITORING_COVERAGE_LEGEND[2].children[0].name,
          percent: (Math.round((toggleSwitcher ? chartData.monitoringTendersCount : chartData.monitoringTendersAmount + Number.EPSILON) * 100) / groupBTotal).toFixed(2),
        },
        {
          from: 'D',
          to: 'F',
          customValue: chartData.nonMonitoringTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.nonMonitoringTendersCount : chartData.nonMonitoringTendersAmount,
          nodeColor: '#3DCAD4',
          groupName: MONITORING_COVERAGE_LEGEND[1].groupName,
          childName: MONITORING_COVERAGE_LEGEND[1].children[0].name,
          procuringEntity: chartData.nonMonitoringProcuringEntityCount,
          dependentName: MONITORING_COVERAGE_LEGEND[2].children[1].name,
          percent: (Math.round((toggleSwitcher ? chartData.nonMonitoringTendersCount : chartData.nonMonitoringTendersAmount + Number.EPSILON) * 100) / groupBTotal).toFixed(2),
        },
        // {
        //   from: 'E',
        //   to: 'G',
        //   customValue: chartData.activeMonitoringTendersCount ? 1 : 0,
        //   value: toggleSwitcher ? chartData.activeMonitoringTendersCount : chartData.activeMonitoringAmount,
        //   nodeColor: '#FFB800',
        //   groupName: MONITORING_COVERAGE_LEGEND[2].groupName,
        //   childName: MONITORING_COVERAGE_LEGEND[2].children[0].name,
        //   procuringEntity: chartData.activeMonitoringProcuringEntityCount,
        //   dependentName: MONITORING_COVERAGE_LEGEND[3].children[0].name,
        //   percent: (Math.round((toggleSwitcher ? chartData.activeMonitoringTendersCount : chartData.activeMonitoringAmount + Number.EPSILON) * 100) / groupCTotal).toFixed(2),
        // },
        {
          from: 'E',
          to: 'H',
          customValue: chartData.violationMonitoringTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.violationMonitoringTendersCount : chartData.violationMonitoringAmount,
          nodeColor: '#FFB800',
          groupName: MONITORING_COVERAGE_LEGEND[2].groupName,
          childName: MONITORING_COVERAGE_LEGEND[2].children[0].name,
          procuringEntity: chartData.violationMonitoringProcuringEntityCount,
          dependentName: MONITORING_COVERAGE_LEGEND[3].children[1].name,
          percent: (Math.round((toggleSwitcher ? chartData.violationMonitoringTendersCount : chartData.violationMonitoringAmount + Number.EPSILON) * 100) / groupCTotal).toFixed(2),
        },
        {
          from: 'E',
          to: 'M',
          customValue: chartData.nonViolationMonitoringTendersCount ? 1 : 0,
          value: toggleSwitcher ? chartData.nonViolationMonitoringTendersCount : chartData.nonViolationMonitoringAmount,
          nodeColor: '#FFB800',
          groupName: MONITORING_COVERAGE_LEGEND[2].groupName,
          childName: MONITORING_COVERAGE_LEGEND[2].children[0].name,
          procuringEntity: chartData.nonViolationMonitoringProcuringEntityCount,
          dependentName: MONITORING_COVERAGE_LEGEND[3].children[2].name,
          percent: (Math.round((toggleSwitcher ? chartData.nonViolationMonitoringTendersCount : chartData.nonViolationMonitoringAmount + Number.EPSILON) * 100) / groupCTotal).toFixed(2),
        },
        // {
        //   from: 'E',
        //   to: 'K',
        //   customValue: chartData.cancelledMonitoringTendersCount ? 1 : 0,
        //   value: toggleSwitcher ? chartData.cancelledMonitoringTendersCount : chartData.cancelledMonitoringAmount,
        //   nodeColor: '#FFB800',
        //   groupName: MONITORING_COVERAGE_LEGEND[2].groupName,
        //   childName: MONITORING_COVERAGE_LEGEND[2].children[0].name,
        //   procuringEntity: chartData.cancelledMonitoringProcuringEntityCount,
        //   dependentName: MONITORING_COVERAGE_LEGEND[3].children[3].name,
        //   percent: (Math.round((toggleSwitcher ? chartData.cancelledMonitoringTendersCount : chartData.cancelledMonitoringAmount + Number.EPSILON) * 100) / groupCTotal).toFixed(2),
        // },
      ]

      let hoverState = chart.links.template.states.create('hover')
      hoverState.properties.fillOpacity = 0.6

      chart.dataFields.fromName = 'from'
      chart.dataFields.toName = 'to'
      chart.dataFields.value = 'customValue'
      chart.dataFields.color = 'nodeColor'

      chart.tooltip.getFillFromObject = false
      chart.tooltip.background.fill = '#FFFFFF'
      chart.tooltip.background.cornerRadius = 10
      chart.tooltip.background.strokeOpacity = 0
      hoverState.sprite.adapter.add('tooltipHTML', function (text, target) {
        if (target.dataItem.dataContext.hasOwnProperty('value')) {
          return prepareLineTooltip(target.dataItem.dataContext)
        } else {
          return ''
        }
      })


      let nodeTemplate = chart.nodes.template
      nodeTemplate.clickable = false
      nodeTemplate.draggable = false
      nodeTemplate.width = 30
      nodeTemplate.nameLabel.locationX = 0.1
      nodeTemplate.nameLabel.label.fill = am4core.color('#fff')
      nodeTemplate.nameLabel.label.adapter.add('textOutput', (text, target) => {
        if (target.dataItem.dataContext.hasOwnProperty('displayLabel')) {
          if (target.dataItem.dataContext.displayLabel) {
            return ''
          } else {
            return text
          }
        }

        return text
      })

      nodeTemplate.minHeight = 30

    }
    return (chart) => {
      chart && chart.dispose()
    }

  }, [monitoringCoverageData, toggleSwitcher, mobile])

  const prepareBarChartData = (
    firstCountField,
    secondCountField,
    firstAmountField,
    secondAmountField,
    firstText,
    secondText,
  ) => {
    const totalValueCount = monitoringCoverageData.tendersDistribution[firstCountField] + monitoringCoverageData.tendersDistribution[secondCountField]
    const totalValueAmount = monitoringCoverageData.tendersDistribution[firstAmountField] + monitoringCoverageData.tendersDistribution[secondAmountField]
    const countFirstPercent = Math.round((monitoringCoverageData.tendersDistribution[firstCountField] + Number.EPSILON) * 100) / totalValueCount
    const countSecondPercent = 100 - countFirstPercent
    const amountFirstPercent = Math.round((monitoringCoverageData.tendersDistribution[firstAmountField] + Number.EPSILON) * 100) / totalValueAmount
    const amountSecondPercent = 100 - amountFirstPercent

    if (toggleSwitcher) {
      return [{
        category: 1,
        fixedValue: 100,
        leftText: firstText,
        value: countFirstPercent,
        rightText: numeral(monitoringCoverageData.tendersDistribution[firstCountField]).format('0,0'),
      }, {
        category: 2,
        fixedValue: 100,
        leftText: secondText,
        value: countSecondPercent,
        rightText: numeral(monitoringCoverageData.tendersDistribution[secondCountField]).format('0,0'),
      }]
    } else {
      return [{
        category: 1,
        fixedValue: 100,
        leftText: firstText,
        value: amountFirstPercent,
        rightText: numeral(monitoringCoverageData.tendersDistribution[firstAmountField]).format('0.00 a'),
      }, {
        category: 2,
        fixedValue: 100,
        leftText: secondText,
        value: amountSecondPercent,
        rightText: numeral(monitoringCoverageData.tendersDistribution[secondAmountField]).format('0.00 a'),
      }]
    }
  }

  const prepareLegend = () => {
    return MONITORING_COVERAGE_LEGEND.map((item, index) => (
      <Col xs={6} key={index} className="df-js-c">
        <div className="legend-block">
          <div className="legend-block-header">
            <div className={cx('legend-point', `legend-point__${item.colorClass}`)} />
            <div className="legend-block-title">{item.groupName}</div>
          </div>
          <div className="legend-block-content">
            {item.children.map((ch, ind) => {
              return !ch.hidden ? (
                <div className="legend-content-line" key={`${index}_${ind}`}>
                  <div className="legend-content-line-icon">{ch.letter}</div>
                  <div className="legend-content-line-text">{ch.name}</div>
                </div>
              ) : ''
            })}
          </div>
        </div>
      </Col>
    ))
  }

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
                mainText="Загальна вартість пропозицій переможців за період"
                infoText="Можете обрати період, категорію на діаграмі, спосіб відображення даних за кількістю чи сумою."
                countText=''
                value={monitoringCoverageData.awardsAmount}
                isCurrency={true}
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
                  <Row justify="flex">
                    {!mobile ? <Col className="monitoring-types-column" xs={24}>
                      <div className="chart-container">
                        <div id="zoomable-chart" style={{ width: '100%', height: '380px' }} />
                      </div>
                    </Col> : <Col xs={24}>
                      <Col xs={24}>
                        <div className="mobile-chart-container">
                          <div className="mobile-chart-container__title">
                            Статус закупівлі
                          </div>
                          <div className="" id="first-bar-chart" style={{ width: '100%', position: 'relative' }} />
                        </div>
                      </Col>
                      <Col xs={24}>
                        <div className="mobile-chart-container">
                          <div className="mobile-chart-container__title">
                            Результат моніторингу
                          </div>
                          <div className="" id="second-bar-chart" style={{ width: '100%', position: 'relative' }} />
                        </div>
                      </Col>
                    </Col>
                    }
                  </Row>
                </div>
                {!mobile && <div className="legend-container">
                  <Row justify="flex">
                    {prepareLegend()}
                  </Row>
                </div>}
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

export default MonitoringCoverage
