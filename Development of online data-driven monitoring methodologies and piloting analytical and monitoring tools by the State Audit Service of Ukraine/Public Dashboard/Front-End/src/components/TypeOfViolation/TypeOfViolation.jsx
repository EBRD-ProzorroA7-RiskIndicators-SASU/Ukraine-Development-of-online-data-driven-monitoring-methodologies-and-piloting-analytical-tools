import React, { useLayoutEffect, useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Radio, Select, Space } from 'antd'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import * as numeral from 'numeral'
import cx from 'classnames'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import { VIOLATIONS, VIOLATION_BAR_CHART_OPTIONS, MAX_MOBILE_WIDTH } from '../../constants'
import { getTypeOfViolationData } from '../../redux/actions/monitoringActions'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import ukraine from '../../helpers/ukraine.json'
import PeriodComponent from '../PeriodComponent/PeriodComponent'
import InfoBlockHeader from '../InfoBlockHeader/InfoBlockHeader'
import _ from 'lodash'
import 'moment/locale/uk'
import Instruction from '../Instruction/Instruction'
import './styles.scss'
import { renderToString } from 'react-dom/server'

numeral.locale('ua')
moment.locale('ua')
am4core.useTheme(am4themes_animated)

const TypeOfViolation = () => {
  const dispatch = useDispatch()
  const typeOfViolationData = useSelector(state => state.monitoringStore.typeOfViolationData)
  const mappingsData = useSelector(state => state.mappingsStore.mappingsData)
  const [selectedViolationId, setSelectedViolationId] = useState([])
  const actualDate = useSelector(state => state.currentDate)
  const { startDate, endDate } = !_.isEmpty(actualDate) && actualDate
  const [period, setPeriod] = useState([startDate, endDate])
  const flipRef = useRef(null)
  const typeOfViolationRef = useRef(null)
  const [selectedOffices, setSelectedOffices] = useState([])
  const [newMapData, setNewMapData] = useState(null)
  const [offices, setOffices] = useState([])
  const w = useWidth()
  const [countSwitcher, setCountSwitcher] = useState('tendersCount')
  const [currentWidth, setCurrentWidth] = useState(window.outerWidth)
  const mobile = currentWidth <= MAX_MOBILE_WIDTH

  useEffect(() => {
    setCurrentWidth(w)
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
    dispatch(getTypeOfViolationData(period[0], period[1], selectedViolationId, selectedOffices))
  }, [period, selectedOffices, selectedViolationId])

  useEffect(() => {
    if (typeOfViolationData.regions && ukraine) {
      const newMapOfUkraine = _.map(ukraine.features, (item) => {
        typeOfViolationData.regions && _.merge(_.keyBy(item, 'regionId'), _.keyBy(typeOfViolationData.regions, 'regionId'))
        item.properties.value = item.properties[countSwitcher]
        return item
      })

      setNewMapData(() => {
        return {
          type: 'FeatureCollection',
          features: newMapOfUkraine,
        }
      })

    }

  }, [typeOfViolationData, countSwitcher])

  const handleChangeViolationId = (violationId) => {
    let selectId = []

    if (selectedViolationId) {
      if (selectedViolationId[0] === violationId) {
        selectId = []
      } else {
        selectId.push(violationId)
      }
    } else {
      selectId.push(violationId)
    }

    setSelectedViolationId(selectId)
  }

  const renderLeftSideInfo = useCallback(() => {
    if (!_.isEmpty(typeOfViolationData.tendersByViolation)) {
      return typeOfViolationData.tendersByViolation.map((violation) => {
        const elementIndex = _.findIndex(VIOLATIONS, { id: violation.violationId })
        let violationName = ''
        if (elementIndex !== -1) {
          violationName = VIOLATIONS[elementIndex].realName
        } else {
          violationName = violation.violationId
        }

        return (
          <div className={cx(violation.violationId === selectedViolationId[0] ? 'slideInDown' : 'slideInUp')}
               key={`violation_${violation.violationId}`}>
            <div
              className="office-info-wrapper"
              onClick={() => !mobile ? handleChangeViolationId(violation.violationId) : () => {
              }}
            >
              <div className="office-title">{violationName}</div>
              <div className="office-data">
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <div className="office-data__value">{violation.tendersCount}</div>
                  <div className="office-data__text">процедур</div>
                </div>
                <div className="office-data__percent">
                  {violation.percent}%
                </div>
              </div>
              <div id={`bar-chart_${violation.violationId}`} style={{ width: '100%', height: '50px' }} />
            </div>
          </div>
        )
      })
    } else {
      return null
    }
  }, [typeOfViolationData, selectedViolationId])

  const prepareTooltip = (tooltipData) => {
    let countText = ''

    switch (countSwitcher) {
      case 'tendersCount':
        countText = 'Кількість процедур з порушеннями:'
        break
      case 'amount':
        countText = 'Сума процедур з порушеннями:'
        break
      case 'procuringEntitiesCount':
        countText = 'Кількість замовників з порушеннями:'
        break

      default:
        countText = ''
    }

    return renderToString(
      <div className='monitoring-types-radar-tooltip-container'>
        <div className='monitoring-types-radar-tooltip-line'>
          <div className='monitoring-types-radar-tooltip-header'>
            {tooltipData.name}
          </div>
        </div>
        <div className='monitoring-types-radar-tooltip-line'
             style={{ width: countSwitcher === 'amount' ? '370px' : '310px' }}>
          <div className="monitoring-types-radar-tooltip-title">
            {countText}
          </div>
          <div className='monitoring-types-radar-tooltip-value'>
            {countSwitcher === 'amount' ? `${numeral(tooltipData.value).format('0.00 a')} грн.` : numeral(tooltipData.value).format('0,0')}
          </div>
        </div>
      </div>,
    )
  }

  useEffect(() => {
    if (!mobile) {
      let map = am4core.create('type-of-violation-chart', am4maps.MapChart)
      typeOfViolationRef.current = map
      map.geodata = newMapData
      map.seriesContainer.draggable = false
      map.seriesContainer.resizable = false

      map.projection = new am4maps.projections.Miller()
      map.maxZoomLevel = 1
      // map.seriesContainer.resizable = false
      // map.chartContainer.wheelable = false

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
          let state = countSwitcher === 'amount' ? numeral(polygon.dataItem.dataContext.value).format('0.00 a').split(' ')[0] : numeral(polygon.dataItem.dataContext.value).format('0,0')

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

      polygonTemplate.tooltipHTML = ''
      polygonSeries.mapPolygons.template.adapter.add('tooltipHTML', function (text, target) {
        return prepareTooltip(target.tooltipDataItem.dataContext)
      })

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

      return () => {
        map.dispose()
      }
    }

  }, [dispatch, newMapData, mobile, period, countSwitcher])

  useLayoutEffect(() => {
    // if (!mobile) {
      typeOfViolationData.tendersByViolation.map((item) => {
        let chart = am4core.createFromConfig(VIOLATION_BAR_CHART_OPTIONS, `bar-chart_${item.violationId}`, 'XYChart')
        chart.data = [{
          category: 0,
          fixedValue: 100,
          leftText: `${item.tendersCount} процедур`,
          value: item.percent,
          rightText: `${item.percent}%`,
        }]
      })
    // }

    return (chart) => {
      chart && chart.dispose()
    }
  }, [typeOfViolationData])

  // useLayoutEffect(() => {
  //   if (mobile && selectedViolationId) {
  //     const chartId = _.isEmpty(selectedViolationId) ? selectedViolationId[0] : ''
  //     let chart = am4core.createFromConfig(VIOLATION_BAR_CHART_OPTIONS, `bar-chart_${chartId}`, 'XYChart')
  //     chart.data = typeOfViolationData.tendersByViolation.filter((it) => it.violationId === chartId).map((item) => {
  //       return {
  //         category: 0,
  //         fixedValue: 100,
  //         leftText: `${item.tendersCount} процедур`,
  //         value: item.percent,
  //         rightText: `${item.percent}%`,
  //       }
  //     })
  //   }
  //
  //   return (chart) => {
  //     chart && chart.dispose()
  //   }
  // }, [typeOfViolationData, selectedViolationId])

  const handleCounterSwitch = (e) => {
    const countType = e.target.value

    setCountSwitcher(countType)
  }

  return (
    <div className="type-of-violation-container">
      <Row className="type-of-violation-row" justify="center">
        <Col className="type-of-violation-column" xs={24} sm={18} md={18} lg={18} xl={21} xxl={18}>
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
                // mainText="Кількість процедур з порушенням за обраний період"
                mainText="Кількість замовників, що порушували, у періоді"
                infoText="Можете обрати період, підрозділ Держаудитслужби, замовників за місцем реєстрації, тип порушення та показник"
                countText=''
                // value={resultsByOffices.tendersAmount}
                value={numeral(typeOfViolationData.procuringEntitiesCount).format('0,0')}
              />
              {!mobile && <div className="type-of-violation-regions">
                <div className="type-of-violation-regions-select">
                  <div className="left-side">
                    <span className="select-label">
                      Підрозділи Держаудитслужби:
                    </span>
                    <Space
                      id="wrapper"
                      style={{
                        width: mobile ? 265 : 465,
                        position: 'relative',
                      }}
                    >
                      <Select
                        getPopupContainer={() => document.getElementById('wrapper')}
                        mode='multiple'
                        className="offices-selector"
                        dropdownClassName="offices-drop-down"
                        placeholder="Вибрані регіони"
                        options={offices}
                        onChange={(newValue) => {
                          setSelectedOffices(newValue)
                        }}
                        maxTagCount='responsive'
                        style={{
                          width: mobile ? 265 : 465,
                        }}
                        // style={{
                        //   width: 265,
                        // }}
                      />
                    </Space>
                  </div>
                </div>
              </div>}
              <div className="type-of-violation-chart-wrapper">
                {!mobile ? <>
                  <div className="left-side">
                    <div>
                      <span className="title">Кількість процедур з порушенням за обраний період</span>
                    </div>
                    <div className="left-side__wrapper">
                      <div>{renderLeftSideInfo()}</div>
                    </div>
                  </div>
                  {/*<div className="left-side">*/}
                  {/*  <span className="title">*/}
                  {/*    Частка суми процедур з порушеннями від загальної суми процедур з моніторингом*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                  <div className="right-side">
                    <div className="change-type-buttons">
                      <Radio.Group
                        defaultValue="tendersCount"
                        optionType="button"
                        onChange={e => handleCounterSwitch(e)}
                      >
                        <Radio.Button className="left-button group-button" value="amount">Сума</Radio.Button>
                        <Radio.Button className="middle-button group-button"
                                      value="procuringEntitiesCount">Замовники</Radio.Button>
                        <Radio.Button className="right-button group-button"
                                      value="tendersCount">Кількість</Radio.Button>
                      </Radio.Group>
                    </div>
                    <div id="type-of-violation-chart" style={{ width: '100%', height: '500px' }} />
                  </div>
                </> : <div className="left-side">
                  <div className="left-side__wrapper">
                    <div>{renderLeftSideInfo()}</div>
                  </div>
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

export default TypeOfViolation