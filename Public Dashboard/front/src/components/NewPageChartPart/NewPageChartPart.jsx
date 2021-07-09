import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Radio, Select } from 'antd'
import { QuestionIcon, XlsIcon, ShareIcon } from '../../assets/icons'
import Flippy, { FrontSide, BackSide } from 'react-flippy'
import * as numeral from 'numeral'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4plugins_timeline from '@amcharts/amcharts4/plugins/timeline'
import * as am4plugins_bullets from '@amcharts/amcharts4/plugins/bullets'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4lang_uk_UA from '@amcharts/amcharts4/lang/uk_UA'
import useWidth from '../../hooks/useWidth'
import moment from 'moment'
import bulletIcon from '../../assets/bullet.svg'
import 'moment/locale/uk'
import './styles.scss'

numeral.locale('ua')
moment.locale('ua')

am4core.useTheme(am4themes_animated)

const NewPageChartPart = () => {
  const flipRef = useRef(null)
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const mobile = currentWidth <= 576

  const { Option } = Select

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const renderPeriodButtons = () => {
    return !mobile ? (
      <div className="period-buttons">
        <Radio.Group defaultValue="a" optionType="button">
          <Radio.Button className="left-button group-button" value="a">2019</Radio.Button>
          <Radio.Button className="middle-button group-button" value="b">2020</Radio.Button>
          <Radio.Button className="right-button group-button" value="c">Останні повні 12 місяців</Radio.Button>
        </Radio.Group>
      </div>
    ) : (
      <Select
        className="period-select"
        dropdownClassName="period-drop-down"
        defaultValue="Останні повні 12 місяців"
        style={{
          width: 230,
        }}>
        <Option value="2019">2019</Option>
        <Option value="2020">2020</Option>
        <Option value="Останні повні 12 місяців">Останні повні 12 місяців</Option>
      </Select>
    )
  }

  useLayoutEffect(() => {
    const chart = am4core.create('timeline-chart', am4plugins_timeline.SerpentineChart)

    // chart.exporting.menu = new am4core.ExportMenu()
    // chart.exporting.formatOptions.getKey('csv').disabled = true
    // chart.exporting.menu.items = [{
    //   'label': '...',
    //   'menu': [
    //     { 'type': 'png', 'label': 'PNG' },
    //     { 'type': 'jpg', 'label': 'JPG' },
    //   ],
    // }]

    chart.curveContainer.padding(50, 20, 50, 20)
    chart.levelCount = 4
    chart.yAxisRadius = am4core.percent(50)
    chart.yAxisInnerRadius = am4core.percent(-50)
    chart.maskBullets = false

    const colorSet = new am4core.ColorSet()
    colorSet.saturation = 0.5
    chart.language.locale = am4lang_uk_UA

    chart.data = [{
      'category': '',
      'start': '2017-12-11',
      'end': '2020-04-18',
      'color': '#1F6592',
      'task': 'Закон України про публічні закупівлі',
      'year': '2021',
    },
      {
        'category': '',
        'start': '2018-07-26',
        'end': '2019-11-02',
        'color': '#1F6592',
        'task': 'Положення про Державну аудиторську службу України\n, затверджене постановою Кабінету Міністрів України\n від 03 лютого 2016 року № 43',
        'year': '2021',
      },
      {
        'category': '',
        'start': '2019-11-03',
        'end': '2020-09-08',
        'color': '#1F6592',
        'task': 'Положення про Державну аудиторську службу України\n, затверджене постановою Кабінету Міністрів України\n від 03 лютого 2016 року № 43',
        'year': '2021',
      },
      {
        'category': '',
        'start': '2020-09-09',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Положення про Державну аудиторську службу України\n, затверджене постановою Кабінету Міністрів України\n від 03 лютого 2016 року № 43',
      },
      {
        'category': '',
        'start': '2015-12-25',
        'end': '2020-09-18',
        'color': '#1F6592',
        'task': 'Стаття 164-14 Кодексу України\n про адміністративні правопорушення',
      },
      {
        'category': '',
        'start': '2019-09-19',
        'end': '2020-03-16',
        'color': '#1F6592',
        'task': 'Стаття 164-14 Кодексу України\n про адміністративні правопорушення',
      },
      {
        'category': '',
        'start': '2020-03-17',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Стаття 164-14 Кодексу України\n про адміністративні правопорушення',
        'year': '2021',
      },
      {
        'category': '',
        'start': '2017-12-21',
        'end': '2020-09-18',
        'color': '#1F6592',
        'task': 'Закон України «Про основні засади\n здійснення державного фінансового контролю в Україні',
      },
      {
        'category': '',
        'start': '2020-09-19',
        'end': '2020-06-16',
        'color': '#1F6592',
        'task': 'Закон України «Про основні засади\n здійснення державного фінансового контролю в Україні',
      },
      {
        'category': '',
        'start': '2020-06-17',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Закон України «Про основні засади\n здійснення державного фінансового контролю в Україні',
      },
      {
        'category': '',
        'start': '2013-08-01',
        'end': '2018-07-25',
        'color': '#1F6592',
        'task': 'Постанова Кабінету Міністрів України від 01 серпня\n 2013 року № 631 «Про затвердження Порядку проведення перевірок закупівель\n Державною аудиторською службою, її міжрегіональними територіальними органами\n і внесення змін до деяких актів Кабінету Міністрів України»',
      },
      {
        'category': '',
        'start': '2018-07-26',
        'end': '2020-12-15',
        'color': '#1F6592',
        'task': 'Постанова Кабінету Міністрів України від 01 серпня\n 2013 року № 631 «Про затвердження Порядку проведення перевірок закупівель\n Державною аудиторською службою, її міжрегіональними територіальними органами\n і внесення змін до деяких актів Кабінету Міністрів України»',
      },
      {
        'category': '',
        'start': '2020-12-16',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Постанова Кабінету Міністрів України від 01 серпня\n 2013 року № 631 «Про затвердження Порядку проведення перевірок закупівель\n Державною аудиторською службою, її міжрегіональними територіальними органами\n і внесення змін до деяких актів Кабінету Міністрів України»',
      },
      {
        'category': '',
        'start': '2018-04-23',
        'end': '2020-04-07',
        'color': '#1F6592',
        'task': 'Наказ Державної аудиторської служби України від 23.04.2018\n  № 86 (Про затвердження форми висновку про результати моніторингу\n закупівлі та порядку його заповнення)',
      },
      {
        'category': '',
        'start': '2020-09-08',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Наказ Міністерства фінансів України від 08.09.2020 № 552\n «Про затвердження форми висновку про результати\n моніторингу процедури закупівлі та порядку його заповнення»',
      },
      {
        'category': '',
        'start': '2018-09-11',
        'end': '2020-10-27',
        'color': '#1F6592',
        'task': 'Наказ Державної аудитроської служби України \n  «Про затвердження методики визначення\n автоматичних індикаторів ризику,\n їх переліку та порядку застосування»',
      },
      {
        'category': '',
        'start': '2020-10-28',
        'end': new Date(),
        'color': '#1F6592',
        'task': 'Наказ Державної аудитроської служби України \n  «Про затвердження методики визначення\n автоматичних індикаторів ризику,\n їх переліку та порядку застосування»',
      },
    ]

    // chart.dateFormatter.dateFormat = "d MMM YYYY";
    // chart.dateFormatter.inputDateFormat = "d MMM YYYY";
    chart.fontSize = 14

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
    categoryAxis.dataFields.category = 'category'
    categoryAxis.disabled = true
    categoryAxis.renderer.grid.template.disabled = true
    categoryAxis.renderer.labels.template.paddingRight = 25
    categoryAxis.renderer.minGridDistance = 10
    categoryAxis.renderer.innerRadius = -60
    categoryAxis.renderer.radius = 60

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.disabled = true
    dateAxis.renderer.minGridDistance = 70
    dateAxis.renderer.disabled = true
    dateAxis.baseInterval = { count: 1, timeUnit: 'day' }
    dateAxis.renderer.tooltipLocation = 0
    dateAxis.startLocation = -0.5
    dateAxis.renderer.line.strokeDasharray = '8,1,1,1,1'
    dateAxis.renderer.line.strokeOpacity = 1
    dateAxis.renderer.line.stroke = '#FFFFFF'
    dateAxis.renderer.line.cornerRadius = 4
    dateAxis.tooltip.background.fillOpacity = 1
    dateAxis.tooltip.background.cornerRadius = 5
    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground')
    dateAxis.tooltip.label.paddingTop = 7
    dateAxis.tooltip.label.maxWidth = 20

    const labelTemplate = dateAxis.renderer.labels.template
    labelTemplate.verticalCenter = 'middle'
    labelTemplate.fill = '#FFFFFF'
    labelTemplate.fillOpacity = 1
    labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor('background')
    labelTemplate.background.fillOpacity = 0
    // labelTemplate.padding(7, 7, 7, 7);

    const series = chart.series.push(new am4plugins_timeline.CurveColumnSeries())
    series.columns.template.height = am4core.percent(15)
    series.columns.template.fillOpacity = 1
    series.columns.template.tooltipText = `{task}: \n[bold]{openDateX}[/] - [bold]{dateX}[/]`

    series.dataFields.openDateX = 'start'
    series.dataFields.dateX = 'end'
    series.dataFields.categoryY = 'category'
    series.columns.template.propertyFields.fill = 'color'
    series.columns.template.propertyFields.stroke = 'color'
    series.columns.template.strokeOpacity = 0
    chart.seriesContainer.zIndex = -1

    const imageBullet = series.bullets.push(new am4charts.Bullet())
    const image = imageBullet.createChild(am4core.Image)
    image.href = bulletIcon
    // image.width = 160;
    // image.height = 30;
    image.horizontalCenter = 'middle'
    image.verticalCenter = 'bottom'

    var bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.label.text = '{year}year'
    bullet.label.dy = -37

    return () => {
      chart.dispose()
    }
  }, [])

  return (
    <div className="newpage-chart-container">
      <Row className="newpage-chart-wrapper" justify="center">
        <Col className="newpage-chart-column" xs={24} sm={18} md={18} lg={18} xl={21} xxl={18}>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={flipRef}
          >
            <FrontSide>
              <div className="newpage-chart-navigation">
                <div className="buttons-group">
                  {!mobile &&
                  <Button
                    className="instruction-button group-button"
                    icon={<QuestionIcon />}
                    onClick={() => flipRef.current.toggle()}
                  >
                    Інструкція
                  </Button>
                  }
                  {renderPeriodButtons()}
                  <div className="download-buttons">
                    {!mobile && <Button className="xls-button group-button" icon={<XlsIcon />}>
                      Завантажити
                    </Button>}
                    <Button className="share-button group-button" icon={<ShareIcon />} />
                  </div>
                </div>
              </div>
              <div className="newpage-chart">
                <div className="newpage-chart__left-side">
                  <h2 className="title">
                    Загальна кількість аудиторів
                  </h2>
                  <p className="description">
                    Натисніть на облась, щоб бачити кількість державних аудиторів з області за обраний період.
                  </p>
                </div>
                <div className="newpage-chart__right-side">
                  <span className="auditors">
                    Кількість аудиторів
              </span>
                  <p className="auditors-count">
                    {numeral(16728).format('0,0')}
                  </p>
                </div>
              </div>
              <div id="timeline-chart" style={{ width: '100%', height: '700px' }}></div>
            </FrontSide>
            <BackSide>
              <div className="buttons-group">
                {!mobile &&
                <Button
                  className="instruction-button group-button"
                  icon={<QuestionIcon />}
                  onClick={() => flipRef.current.toggle()}
                >
                  Повернутися
                </Button>
                }
              </div>
            </BackSide>
          </Flippy>
        </Col>
      </Row>
    </div>
  )
}

export default NewPageChartPart
