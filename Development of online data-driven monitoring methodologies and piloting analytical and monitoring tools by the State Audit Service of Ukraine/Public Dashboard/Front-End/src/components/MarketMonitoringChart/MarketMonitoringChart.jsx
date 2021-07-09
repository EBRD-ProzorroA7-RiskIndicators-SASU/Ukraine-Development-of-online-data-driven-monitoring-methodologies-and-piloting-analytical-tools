import React, { useLayoutEffect, useState, useEffect, useRef, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { MOBILE_BAR_CHART_OPTIONS } from '../../constants'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as dayjs from 'dayjs'
import {
  getDataMonitoringMarketPage,
  getProcedureRequest,
  setClearProcerudeState,
} from '../../redux/actions/monitoringMarketActions'
import { Animated } from 'react-animated-css'
import relativeTime from 'dayjs/plugin/relativeTime'
import am4lang_uk_UA from '@amcharts/amcharts4/lang/uk_UA'
import Instruction from '../Instruction/Instruction'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import _ from 'lodash'
import 'moment/locale/uk'
import SwitchCustom from '../SwitchCustom/SwitchCustom'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import './styles.scss'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)
dayjs.extend(relativeTime)

const MarketMonitoringChart = () => {
  const dispatch = useDispatch()
  const dataForForceChart = useSelector(state => state.monitoringMarketPageData.monitoringMarketData)
  const actualDate = useSelector(state => state.currentDate)
  const procedureInfo = useSelector(state => state.monitoringMarketPageData.procedure)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const flipRef = useRef(null)
  const marketChartRef = useRef(null)
  const [region, setRegion] = useState([])
  const [forceChartData, setForceChartData] = useState(null)
  const [toggleSwitcher, setToggleSwitcher] = useState(true)
  const [activeTenderId, setActiveTenderId] = useState(null)
  const [dataForLineChart, setDataForLineChart] = useState(null)
  const [updateCategories, setUpdateCategories] = useState(null)
  const [procedure, setProcedure] = useState(null)
  const [fakeDate, setFakeDate] = useState([])
  const { cpv2Count, cpvTenders, cpvDynamics, categories } = !_.isEmpty(forceChartData) && forceChartData
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const [period, setPeriod] = useState([startDate, endDate])
  const mobile = currentWidth <= 768

  useEffect(() => {
    setForceChartData(dataForForceChart)
  }, [dataForForceChart])

  useEffect(() => {
    dispatch(getDataMonitoringMarketPage(period[0], period[1], region))
    // dispatch(setCurrentDate(`${previousYear}-01-01`, `${nextYear}-01-01`))
  }, [dispatch, period, region])

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const renderMobileChart = useCallback(() => {
    if (categories) {
      return categories.map((item, index) => {
        return (
          <div
            key={index}
            className='section-item'
          >
            <div className="section-item__title" style={{ marginBottom: '10px' }}>{item.name}</div>
            <div
              className="bar-chart"
              id={`bar-chart-${index}`}
              style={{ width: '100%', height: '50px', position: 'relative', marginBottom: '10px' }}
            />
          </div>
        )
      })
    }
  })

  useLayoutEffect(() => {
    if (mobile) {
      if (categories) {
        const totalAmount = _.reduce(categories, (memo, item) => {
          return memo + item.amount
        }, 0)
        const totalCount = _.reduce(categories, (memo, item) => {
          return memo + item.tendersCount
        }, 0)

        categories.map((item, index) => {
          let chart = am4core.createFromConfig(MOBILE_BAR_CHART_OPTIONS, `bar-chart-${index}`, 'XYChart')

          let prData = [{
            category: 0,
            fixedValue: 100,
            leftText: toggleSwitcher ? 'Кількість процедур' : 'Сума процедур',
            // value: mergingFullDateData[key].count,
            value: Math.round((item[toggleSwitcher ? 'tendersCount' : 'amount'] + Number.EPSILON) * 100) / (toggleSwitcher ? totalCount : totalAmount),
            // rightText: item[toggleSwitcher ? 'tendersCount' : 'amount'],
            rightText: toggleSwitcher ? numeral(item.tendersCount).format('0,0') : numeral(item.amount).format('0.0 a'),
          }]

          chart.height = 50 * prData.length
          chart.data = prData
        })
      }
    }

    return (chart) => {
      chart && chart.dispose()
    }

  }, [categories, toggleSwitcher])

  const generateDateByPeriod = (startDate) => {
    let datePeriods = []

    for (let i = 0; i <= 11; i++) {
      datePeriods.push(dayjs(startDate).add(i, 'month').startOf().format('YYYY-MM'))
    }

    setFakeDate(datePeriods)
  }

  useEffect(() => {
    const totalTendersCount = !_.isEmpty(categories) && _.sumBy(categories, 'tendersCount')
    const totalAmount = !_.isEmpty(categories) && _.sumBy(categories, 'amount')

    const changeDataStructure = !_.isEmpty(categories) && _.map(categories, category => {
      const { name, tendersCount, amount, topCpv2ByAmount, topCpv2ByTendersCount } = category
      const children = toggleSwitcher ? topCpv2ByTendersCount : topCpv2ByAmount

      switch (name) {
        case 'Послуги':
          const tendersCountServices = calculatePercent(tendersCount, totalTendersCount)
          const amountServices = calculatePercent(amount, totalAmount)
          const valueServices = toggleSwitcher ? tendersCountServices : amountServices
          category.color = '#FFB800'
          category.valueForSize = valueServices
          category.value = parseFloat(valueServices) + 40
          category.children = children

          break

        case 'Роботи':
          const tendersCountWork = calculatePercent(tendersCount, totalTendersCount)
          const amountWork = calculatePercent(amount, totalAmount)
          const valueWork = toggleSwitcher ? tendersCountWork : amountWork
          category.color = '#1E6592'
          category.valueForSize = valueWork
          category.value = parseFloat(valueWork) + 40
          category.children = children

          break

        case 'Товари':
          const tendersCountGoods = calculatePercent(tendersCount, totalTendersCount)
          const amountGoods = calculatePercent(amount, totalAmount)
          const valueGoods = toggleSwitcher ? tendersCountGoods : amountGoods
          category.color = '#3DCAD4'
          category.valueForSize = valueGoods
          category.value = parseFloat(valueGoods) + 40
          category.children = children

          break

        default:
          console.log()
      }

      !_.isEmpty(children) && _.map(children, child => {
        const { amount, tendersCount, topChildCpvByAmount, topChildCpvByTendersCount } = child
        const childrenForSecondLevel = !_.isEmpty(child) && toggleSwitcher ? topChildCpvByTendersCount : topChildCpvByAmount
        const percentForEachChild = toggleSwitcher ? tendersCount : amount
        const valueForEachCategory = toggleSwitcher ? category.tendersCount : category.amount

        const tendersValue = calculatePercent(percentForEachChild, valueForEachCategory)
        child.value = 30
        child.valueForSize = tendersValue
        child.children = childrenForSecondLevel

        !_.isEmpty(childrenForSecondLevel) && _.map(childrenForSecondLevel, child => {
          const { amount, tendersCount } = child
          const percentForEachChild = toggleSwitcher ? tendersCount : amount
          const tendersValue = calculatePercent(percentForEachChild, valueForEachCategory)
          child.value = 10
          child.valueForSize = tendersValue

          return child
        })

        return child
      })

      return category
    })

    const actualData = procedure ? procedure : changeDataStructure

    setUpdateCategories(actualData)

  }, [categories, procedure, toggleSwitcher])

  useEffect(() => {
    generateDateByPeriod(period[0])
  }, [period])

  useEffect(() => {
    const actualData = !_.isEmpty(activeTenderId) ? _.filter(cpvDynamics, item => activeTenderId === item.cpv2) : null

    const dateObj = _.map(fakeDate, date => {
      return {
        date,
      }
    })

    let dataSourse = {
      date: _.map(fakeDate, date => ({ date })),
      value: [],
    }

    dataSourse.value = _.map(_.merge(dateObj, actualData), item => {
      const tendersCount = item.tendersCount ? item.tendersCount : 0
      const amount = item.amount ? item.amount : 0
      const newData = toggleSwitcher ? tendersCount : amount

      return {
        value: newData,
      }
    })

    const mergingDataSourse = _.merge(dataSourse.date, dataSourse.value)

    !_.isEmpty(mergingDataSourse) ? setDataForLineChart(mergingDataSourse) : setDataForLineChart(null)

  }, [activeTenderId, cpvDynamics, fakeDate, toggleSwitcher])

  useEffect(() => {
    setProcedure(() => {
      const goods = !_.isEmpty(procedureInfo) && _.filter(procedureInfo.cpv2Tree, category => category.categoryId === 1)
      const goodsInfo = toggleSwitcher && goods.length > 0 ? goods[0].tendersCount : goods.length > 0 && goods[0].amount
      const services = !_.isEmpty(procedureInfo) && _.filter(procedureInfo.cpv2Tree, category => category.categoryId === 2)
      const servicesInfo = toggleSwitcher && services.length > 0 ? services[0].tendersCount : services.length > 0 && services[0].amount
      const works = !_.isEmpty(procedureInfo) && _.filter(procedureInfo.cpv2Tree, category => category.categoryId === 3)
      const worksInfo = toggleSwitcher && works.length > 0 ? works[0].tendersCount : works.length > 0 && works[0].amount
      const totalSum = goodsInfo + servicesInfo + worksInfo

      const changeDataStructure = !_.isEmpty(procedureInfo && procedureInfo.cpv2Tree) && _.map(procedureInfo.cpv2Tree, category => {
        const { topChildCpvByAmount, topChildCpvByTendersCount, categoryId } = category
        const children = toggleSwitcher ? topChildCpvByTendersCount : topChildCpvByAmount

        switch (categoryId) {
          case 2:
            const servicesWorks = calculatePercent(servicesInfo, totalSum)
            category.color = '#FFB800'
            category.valueForSize = servicesWorks
            category.value = parseFloat(servicesWorks) + 40
            category.children = children

            break

          case 3:
            const valueWorks = calculatePercent(worksInfo, totalSum)
            category.color = '#1E6592'
            category.valueForSize = valueWorks
            category.value = parseFloat(valueWorks) + 40
            category.children = children

            break

          case 1:
            const valueGoods = calculatePercent(goodsInfo, totalSum)

            category.color = '#3DCAD4'
            category.valueForSize = valueGoods
            category.value = parseFloat(valueGoods) + 40
            category.children = children

            break

          default:
            console.log()
        }

        !_.isEmpty(children) && _.map(children, child => {
          const { amount, tendersCount, topChildCpvByTendersAmount, topChildCpvByTendersCount } = child
          const childrenForSecondLevel = !_.isEmpty(child) && toggleSwitcher ? topChildCpvByTendersCount : topChildCpvByTendersAmount
          const percentForEachChild = toggleSwitcher ? tendersCount : amount
          const valueForEachCategory = toggleSwitcher ? category.tendersCount : category.amount
          const tendersValue = calculatePercent(percentForEachChild, valueForEachCategory)

          child.valueForSize = tendersValue
          child.value = 30
          child.children = childrenForSecondLevel
          child.color = category.color

          !_.isEmpty(childrenForSecondLevel) && _.map(childrenForSecondLevel, child => {
            const { amount, tendersCount } = child
            const counterForEachChild = toggleSwitcher ? tendersCount : amount
            const valueForRendering = calculatePercent(counterForEachChild, percentForEachChild)

            child.valueForSize = valueForRendering
            child.value = 10

            return child
          })

          return child
        })

        return category
      })

      return changeDataStructure
    })
  }, [categories, procedureInfo, toggleSwitcher])

  useLayoutEffect(() => {
    if (!mobile) {
      const chart = am4core.create('force-directed-tree', am4plugins_forceDirected.ForceDirectedTree)

      // chart.exporting.menu = new am4core.ExportMenu()
      // chart.exporting.formatOptions.getKey('csv').disabled = true
      // chart.exporting.menu.items = [{
      //   'label': '...',
      //   'menu': [
      //     { 'type': 'png', 'label': 'PNG' },
      //     { 'type': 'jpg', 'label': 'JPG' },
      //   ],
      // }]

      const networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
      networkSeries.data = updateCategories
      chart.language.locale = am4lang_uk_UA
      chart.numberFormatter.language = new am4core.Language()
      chart.numberFormatter.language.locale = am4lang_uk_UA
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': 'тис.' },
        { 'number': 1e+6, 'suffix': 'млн.' },
        { 'number': 1e+9, 'suffix': 'млрд.' },
      ]
      chart.height = 756
      chart.width = 800

      networkSeries.dataFields.linkWith = 'linkWith'
      networkSeries.dataFields.name = 'name'
      networkSeries.dataFields.id = 'name'
      networkSeries.dataFields.value = 'value'
      networkSeries.dataFields.children = 'children'
      networkSeries.dataFields.color = 'color'
      networkSeries.nodes.template.expandAll = false
      networkSeries.maxLevels = 1
      // networkSeries.nodes.template.events.on("hit", (ev) => {
      //   const targetNode = ev.target;
      //   if (targetNode.isActive) {
      //     networkSeries.nodes.each((node) => {
      //       if (targetNode !== node && node.isActive && targetNode.dataItem.level === node.dataItem.level) {
      //         node.isActive = false;
      //       }
      //     });
      //   }
      // });

      networkSeries.tooltip.getFillFromObject = false
      networkSeries.tooltip.background.fill = am4core.color('#FFFFFF')

      networkSeries.nodes.template.tooltipHTML = `<div 
      style='
        width: fit-content;
        height: fit-content; 
        display: flex; 
        flex-direction: column; 
        align-items: flex-start;
        justify-content: center;
        font-size: 14px;
        color:#000000;
        margin: 0;
        padding: 0;
        '
        >
        <span
          style='
            display: flex;
            max-width: 350px;
            width: 100%;
            font-weight: 600;
            white-space: pre-line;
            margin-top: -10px;
          '
        >
          {name}
        </span>
        <div
          style='
            width: 100%;
            display: flex;
            align-items: center;
          '
        >
          <span
            style='
              display: flex;
              margin: 8px 12px 8px 0;
            '
          >
            ${toggleSwitcher ? 'Кількість процедур:' : 'Сума процедур:'}
          </span>
          ${!toggleSwitcher ? `
          <span
            style='
              font-weight: 600;
            '
          >
            {amount.formatNumber('#.## a')} грн
          </span>
          ` :
        `<span
            style='
              font-weight: 600;
            '
          >
            {tendersCount}
          </span>`
      }
        </div>
      </div>`
      networkSeries.nodes.template.fillOpacity = 1
      networkSeries.label = '{valueForSize}%'
      networkSeries.nodes.template.label.text = '{valueForSize}%'
      networkSeries.fontSize = 13
      networkSeries.minRadius = 20
      networkSeries.maxRadius = 100
      networkSeries.manyBodyStrength = -26
      networkSeries.nodes.template.label.hideOversized = false
      networkSeries.nodes.template.label.truncate = true

      return () => {
        chart.dispose()
      }

    }

  }, [toggleSwitcher, updateCategories, mobile])

  const setActiveTender = useCallback(
    (id) => {
      setActiveTenderId(id)
      activeTenderId !== id && dispatch(getProcedureRequest(period[0], period[1], id))

      if (activeTenderId === id) {
        Promise.resolve(dispatch(setClearProcerudeState())).then(() => {
          setActiveTenderId(null)
        })
      }

    }, [activeTenderId, dispatch, period],
  )

  useLayoutEffect(() => {
    if (!mobile && activeTenderId) {
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

      const chart = marketLineChart.createChild(am4charts.XYChart)
      chart.language.locale = am4lang_uk_UA
      chart.numberFormatter.language = new am4core.Language()
      chart.numberFormatter.language.locale = am4lang_uk_UA
      chart.numberFormatter.bigNumberPrefixes = [
        { 'number': 1e+3, 'suffix': 'тис.' },
        { 'number': 1e+6, 'suffix': 'млн.' },
        { 'number': 1e+9, 'suffix': 'млрд.' },
      ]

      chart.width = 400
      chart.height = 120
      chart.padding(0, 0, 50, 0)

      chart.data = dataForLineChart

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
          ${toggleSwitcher ? 'Кількість процедур' : 'Сума процедур'}
          </span>
          {valueY.formatNumber('#.## a')} грн
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
  }, [dataForLineChart, mobile, toggleSwitcher, activeTenderId])

  const renderLeftSideInfo = useCallback(() => {
    if (_.isEmpty(cpvTenders)) {
      return null
    }
    const sortingByNumber = toggleSwitcher ? _.orderBy(cpvTenders, 'tendersCount', 'desc') : _.orderBy(cpvTenders, 'amount', 'desc')

    const tendersList = _.map(sortingByNumber, (tender, index) => {
      const { cpv2, amount, tendersCount, cpvName, categories } = tender
      const changeDataType = toggleSwitcher ? numeral(tendersCount).format('0,0') : `${numeral(amount).format('0.0 a')} грн`
      let indicator = _.map(categories, category => {
        let categoryType

        switch (category) {
          case 1:
            categoryType = 'goods'
            break
          case 2:
            categoryType = 'services'
            break
          case 3:
            categoryType = 'work'
            break
          default:
            console.log()
        }

        return categoryType
      }).join('-')

      return cpv2 === activeTenderId ? (
        <Animated key={index} animationIn="slideInDown" animationOut="slideOutUp" animationInDuration={1000}
                  animationOutDuration={1000} isVisible={true}>
          <div
            className={`section-item ${cpv2 === activeTenderId ? 'active' : ''}`}
            onClick={() => setActiveTender(cpv2)}
          >
            <div className="item__top">
              <div className={`left-side ${indicator}`}>
                <span className="title">
                  {toggleSwitcher ? 'Кількість процедур:' : 'Сума процедур:'}
                </span>
                <span className="counter">
                  {changeDataType}
                </span>
              </div>
              <div className="right-side">
                <span className="code">
                  Код:
                </span>
                <span className="code-number">
                  {cpv2.slice(0, 2)}
                </span>
              </div>
            </div>
            <p className="item-description">
              {cpvName}
            </p>
            <div id="market-line-chart" style={{ width: '100%', height: '100px' }}></div>
          </div>
        </Animated>
      ) : (
        <div
          key={index}
          className='section-item'
          onClick={() => setActiveTender(cpv2)}
        >
          <div className="item__top">
            <div className={`left-side ${indicator}`}>
                <span className="title">
                  {toggleSwitcher ? 'Кількість процедур:' : 'Сума процедур:'}
                </span>
              <span className="counter">
                  {changeDataType}
                </span>
            </div>
            <div className="right-side">
                <span className="code">
                  Код:
              </span>
              <span className="code-number">
                  {cpv2.slice(0, 2)}
                </span>
            </div>
          </div>
          <p className="item-description">
            {cpvName}
          </p>
        </div>
      )
    })

    return tendersList
  }, [activeTenderId, cpvTenders, setActiveTender, toggleSwitcher])

  const calculatePercent = (value, valueType) => {
    return ((value * 100) / valueType).toFixed(1)
  }

  return (
    <div className="market-monitoring-container">
      <Row className="market-monitoring-row" justify="center">
        <Col className="market-monitoring-column" xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <Row justify="flex">
                <Col xs={24}>
                  <div className="market-monitoring-navigation">
                    <PeriodComponent
                      mobile={mobile}
                      handleClickInstruction={() => flipRef.current.toggle()}
                      handleSelectPeriod={setPeriod}
                      selectedPeriod={period}
                    />
                  </div>
                  <InfoBlockHeader
                    // mainText="Кількість категорій, що потрапляли під моніторинг"
                    // mainText="Розділи, що потрапляли під моніторинг"
                    mainText="Розділи єдиного закупівельного словника, що потрапляли під моніторинг"
                    infoText="Ви можете обрати період, область замовника, категорію, показник чи тип предмета закупівлі"
                    countText=''
                    value={numeral(cpv2Count).format('0,0')}
                  />
                  <SwitchCustom
                    defaultValue={toggleSwitcher}
                    regionIds={region}
                    onChange={setRegion}
                    handleSwitch={setToggleSwitcher}
                    selectorText="Замовники за регіонами:"
                  />
                  {!mobile && <div className="market-monitoring-chart-wrapper">
                    <div className="chart-left-section">
                      <div className="section-list">
                        {renderLeftSideInfo()}
                      </div>
                    </div>
                    <div className="force-directed-tree-wrapper"
                         style={{ width: '60%', height: '800px', overflow: 'hidden' }}>
                      <div className="force-directed-tree-legend">
                        <div className="goods">
                          <span className="indicator" />
                          <span className="title">
                        Товари
                      </span>
                        </div>
                        <div className="services">
                          <span className="indicator" />
                          <span className="title">
                        Послуги
                      </span>
                        </div>
                        <div className="works">
                          <span className="indicator" />
                          <span className="title">
                        Роботи
                      </span>
                        </div>
                      </div>
                      <div id="force-directed-tree" style={{ width: '100%', height: '100%' }}></div>
                    </div>
                  </div>
                  }
                  {mobile && <div style={{
                    width: '100%',
                    padding: '0 20px',
                    marginTop: '20px',
                  }}>{renderMobileChart()}</div>}
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

export default memo(MarketMonitoringChart)
