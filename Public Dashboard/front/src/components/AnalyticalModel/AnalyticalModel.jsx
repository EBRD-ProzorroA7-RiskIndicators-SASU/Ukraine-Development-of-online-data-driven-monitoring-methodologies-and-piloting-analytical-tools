import React, { useState, useEffect, useLayoutEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { Row, Col } from 'antd'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import './styles.scss'
import * as numeral from 'numeral'
import moment from 'moment'
import useWidth from '../../hooks/useWidth'
import 'moment/locale/uk'
import * as dayjs from 'dayjs'

moment.locale('ua')

const AnalyticalModel = ({ allMainInfo }) => {
  const tendersDynamic = allMainInfo && allMainInfo.tendersDynamic
  const violationsDynamic = allMainInfo && allMainInfo.violationsDynamic
  const tendersCount = allMainInfo && allMainInfo.tendersCount
  const violationsCount = allMainInfo && allMainInfo.violationsCount
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  // const changeChartSize = currentWidth <= 1024;

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const prepareTooltip = (tooltipData) => {
    return renderToString(
      <div className='line-tooltip-container'>
        <div className='line-tooltip-container-title'>
          {dayjs(tooltipData.date).format('MMMM, YYYY')}
        </div>
        <div className="line-tooltip-container-value">
          {numeral(tooltipData.value).format('0,0')}
        </div>
      </div>,
    )
  }

  useLayoutEffect(() => {
    // Create chart instance
    let chart = am4core.create('procedure-chart', am4charts.XYChart)

    // chart.exporting.menu = new am4core.ExportMenu()
    // chart.exporting.formatOptions.getKey('csv').disabled = true
    // chart.exporting.menu.items = [{
    //   'label': '...',
    //   'menu': [
    //     { 'type': 'png', 'label': 'PNG' },
    //     { 'type': 'jpg', 'label': 'JPG' },
    //   ],
    // }]

    chart.height = 130
    chart.maskBullets = false
    chart.padding(60, 0, 10, 0)

    // Add data
    chart.data = tendersDynamic

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.tooltip.disabled = true
    dateAxis.renderer.grid.template.strokeWidth = 0
    dateAxis.renderer.labels.template.disabled = true
    dateAxis.renderer.baseGrid.disabled = true

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.min = 0
    valueAxis.tooltip.disabled = true
    valueAxis.renderer.grid.template.strokeWidth = 0
    valueAxis.renderer.labels.template.disabled = true
    valueAxis.renderer.baseGrid.disabled = true

    // Create series
    let series = chart.series.push(new am4charts.LineSeries())
    series.dataFields.valueY = 'value'
    series.dataFields.dateX = 'date'
    series.tooltipText = '{value}'
    series.strokeWidth = 2
    series.minBulletDistance = 15
    series.stroke = am4core.color('#4AB8A4')

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 5
    series.tooltip.background.strokeOpacity = 0
    series.tooltip.pointerOrientation = 'vertical'
    series.tooltip.label.textAlign = 'middle'
    series.tooltip.label.textValign = 'middle'
    series.tooltip.getFillFromObject = false
    series.tooltip.getStrokeFromObject = true

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet())
    bullet.circle.strokeWidth = 2
    bullet.circle.radius = 4
    bullet.circle.fill = am4core.color('#fff')
    bullet.tooltipText = '${valueY}'
    bullet.pointerOrientation = 'vertical'
    bullet.adapter.add('tooltipHTML', function (text, target) {
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

    let bullethover = bullet.states.create('hover')
    bullethover.properties.scale = 1.3

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor()
    chart.cursor.lineY.disabled = true
    chart.cursor.lineX.disabled = true
    chart.cursor.behavior = 'none'

    let shadow = series.filters.push(new am4core.DropShadowFilter)
    shadow.dx = 10
    shadow.dy = 15
    shadow.blur = 2
    shadow.opacity = 0.05
  }, [tendersDynamic])

  useLayoutEffect(() => {
    // Create chart instance
    let chart = am4core.create('violation-chart', am4charts.XYChart)

    // chart.exporting.menu = new am4core.ExportMenu()
    // chart.exporting.formatOptions.getKey('csv').disabled = true
    // chart.exporting.menu.items = [{
    //   'label': '...',
    //   'menu': [
    //     { 'type': 'png', 'label': 'PNG' },
    //     { 'type': 'jpg', 'label': 'JPG' },
    //   ],
    // }]

    chart.height = 100
    chart.maskBullets = false
    chart.padding(10, 0, 10, 0)

    // Add data
    chart.data = violationsDynamic

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.tooltip.disabled = true
    dateAxis.renderer.grid.template.strokeWidth = 0
    dateAxis.renderer.labels.template.disabled = true
    dateAxis.renderer.baseGrid.disabled = true

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.min = 0
    valueAxis.tooltip.disabled = true
    valueAxis.renderer.grid.template.strokeWidth = 0
    valueAxis.renderer.labels.template.disabled = true
    valueAxis.renderer.baseGrid.disabled = true

    // Create series
    let series = chart.series.push(new am4charts.LineSeries())
    series.dataFields.valueY = 'value'
    series.dataFields.dateX = 'date'
    series.tooltipText = '{value}'
    series.strokeWidth = 2
    series.minBulletDistance = 15
    series.stroke = am4core.color('#FFB800')

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 5
    series.tooltip.background.strokeOpacity = 0
    series.tooltip.pointerOrientation = 'vertical'
    series.tooltip.label.textAlign = 'middle'
    series.tooltip.label.textValign = 'middle'
    series.tooltip.getFillFromObject = false
    series.tooltip.getStrokeFromObject = true

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet())
    bullet.circle.strokeWidth = 2
    bullet.circle.radius = 4
    bullet.circle.fill = am4core.color('#fff')
    bullet.tooltipText = '${valueY}'
    bullet.pointerOrientation = 'vertical'
    bullet.adapter.add('tooltipHTML', function (text, target) {
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

    let bullethover = bullet.states.create('hover')
    bullethover.properties.scale = 1.3

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor()
    chart.cursor.lineY.disabled = true
    chart.cursor.lineX.disabled = true
    chart.cursor.behavior = 'none'

    let shadow = series.filters.push(new am4core.DropShadowFilter)
    shadow.dx = 10
    shadow.dy = 10
    shadow.blur = 2
    shadow.opacity = 0.05
  }, [violationsDynamic])

  return (
    <div className="analytical-container">
      <Row className="analytical-model" justify="center">
        <Col className="analytical-model-content-wrapper" sm={11} md={11} lg={11} xl={10} xxl={9}>
          <div className="analytical-model-content">
            <h1 className="analytical-model-title">
              Результати
            </h1>
            <div className="analytical-model-description">
              <span className="title">
                {/*Моніторинг проводиться задля виявлення порушень законодавства на всіх стадіях закупівлі. А також сприяння зменшенню кількості порушень надалі.*/}
                Моніторинг проводиться задля забезпечення дотримання замовниками вимог законодавства на всіх стадіях закупівлі та, як наслідок, сприяння ефективності їх проведення.
              </span>
              <p className="description">
                Кожен з моніторингів сприяє запобіганню порушень у закупівлях. Поява дедалі більшої кількості
                моніторингів — сигнал замовнику про постійний контроль Держаудитслужби.
              </p>
            </div>
          </div>
        </Col>
        <Col className="analytical-model-grafics-wrapper" sm={12} md={12} lg={12} xl={11} xxl={9}>
          <div className="analytical-model-grafics">
            <div className="procedure-block">
              <div className="procedure-block-title">
                <div className="title__top-side">
                  <span className="title__color-indicator" />
                  <span className="title__counter">
                    {numeral(tendersCount).format('0,0')}
                </span>
                </div>
                <span className="title">
                  Процедур перевірено
              </span>
              </div>
              <div className="desktop">
                <div id="procedure-chart" style={{ height: '130px' }} />
              </div>
            </div>
            <div className="violation-block">
              <div className="violation-block-title">
                <div className="title__top-side">
                  <span className="title__color-indicator" />
                  <span className="title__counter">
                  {numeral(violationsCount).format('0,0')}
                </span>
                </div>
                <span className="title">
                  Процедур з порушеннями
              </span>
              </div>
              <div className="desktop">
                <div id="violation-chart" style={{ height: '100px' }} />
              </div>
              <div className="mobile">
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default AnalyticalModel
