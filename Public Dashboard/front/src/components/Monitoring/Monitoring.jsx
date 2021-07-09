import React, { useState, useCallback, memo, useRef } from 'react'
import { Row, Col, Carousel } from 'antd'
import { ArrowWrite, ArrowBottom } from '../../assets/icons'
import * as numeral from 'numeral'
import _ from 'lodash'
import Slide from './Slide'
import './styles.scss'
import dayjs from 'dayjs'

numeral.locale('ua')

const Monitoring = ({ allMainInfo }) => {
  const carouseRef = useRef()
  const tendersAmount = allMainInfo && allMainInfo.tendersAmount
  const updatedDate = allMainInfo && allMainInfo.updatedDate
  const slidesArray = allMainInfo && allMainInfo.top20ProcuringEntity
  const { procuringEntitiesCount, procuringEntitiesWithViolationsCount } = allMainInfo || {}
  const [currentSlide, setCurrentSlide] = useState(1)

  const scrolToNextBlock = () => {
    const nextBlock = document.querySelector('.analytical-model')
    nextBlock.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  const renderSlide = useCallback(
    () => {
      if (_.isEmpty(slidesArray)) {
        return
      }

      return _.map(slidesArray, (slide, index) => {
        return (
          <Slide key={index} slide={slide} />
        )
      })
    }, [slidesArray],
  )

  const sliderHandleChange = useCallback((slideNumber) => {
    setCurrentSlide(slideNumber + 1)
  }, [])

  const handleNext = () => {
    carouseRef && carouseRef.current.next()
  }

  return (
    <div className="container">
      <Row className="monitoring-wrapper" justify='center'>
        <Col className="monitoring-left-side" xs={24} sm={11} md={11} lg={11} xl={10} xxl={9}>
          <div className="monitoring-total">
            <div className="monitoring-date-wrapper">
              <span className="monitoring-date">
                Дані на {dayjs(updatedDate).format('DD MMMM, YYYY')}
              </span>
              <span className="date-border" />
            </div>
            <p className="monitoring-title">
              Вартість процедур закупівель, щодо яких Держаудитслужба провела моніторинг з січня 2019 року.
            </p>
            <div className="monitoring-currency">
              <span className="monitoring-currency-sum">
                {numeral(tendersAmount).format('0.0 a').split(' ')[0]}
              </span>
              <span className="monitoring-currency-title">
                {`${numeral(tendersAmount).format('0.00 a').split(' ')[1]} грн`}
              </span>
            </div>
            <p className="monitoring-description">
              Моніторинг процедур закупівель - аналіз дотримання замовником законодавства у сфері публічних закупівель
              на всіх стадіях закупівель, що проводиться Державною аудиторською службою з метою запобігання порушенням.
            </p>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={11} xxl={9}>
          <div className="monitoring-right-side">
            <div className="department-wrapper">
              <div className="department-top">
                <div className="slides-counter">
                  <span className="current-slide">
                    {currentSlide}
                  </span>
                  <span className="additional-border" />
                  <span className="total-slides">
                    {slidesArray && slidesArray.length}
                  </span>
                </div>
                <span className="additional-border" />
                <div className="monitoring-by-regions">
                  <span className="monitoring-by-regions-label">
                    Хто найбільше порушував
                  </span>
                  <div className="monitoring-by-regions-link" onClick={handleNext}>
                    <ArrowWrite />
                  </div>
                </div>
              </div>
              <Carousel
                initialSlide={0}
                // autoplay={true}
                dots={false}
                afterChange={sliderHandleChange}
                ref={carouseRef}
              >
                {renderSlide()}
              </ Carousel>
            </div>
            <div className="customers-wrapper">
              <div className="customers-checked">
                <span className="customers-checked-counter">
                  {numeral(procuringEntitiesCount).format('0,0')}
                </span>
                <span className="customers-checked-label">
                  Замовників перевірено
                </span>
              </div>
              <div className="mobile" />
              <div className="desktop">
                {/*{renderMonitoringChart}*/}
              </div>
              <div className="customers-violation">
                <span className="customers-violation-counter">
                  {numeral(procuringEntitiesWithViolationsCount).format('0,0')}
                </span>
                <span className="customers-violation-label">
                  Замовників з порушенням
                </span>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={22} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <div className="next-section-button" onClick={scrolToNextBlock}>
            <ArrowBottom />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default memo(Monitoring)
