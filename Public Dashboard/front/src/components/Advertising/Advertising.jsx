import React, { useRef, useState, useEffect } from 'react'
import { Row, Col, Carousel, Button } from 'antd'
import laptop from '../../assets/laptop_3_mini.png'
import useWidth from '../../hooks/useWidth'
import CarouselForResourses from '../CarouselForResourses/CarouselForResourses'
import './styles.scss'


const Advertising = () => {
  const carouseRef = useRef()
  const w = useWidth()
  const [currentWidth, setCurrentWidth] = useState(null)
  const mobile = currentWidth <= 768

  useEffect(() => {
    setCurrentWidth(w)
  }, [w])

  const handlePrev = () => {
    carouseRef && carouseRef.current.prev()
  }

  const handleNext = () => {
    carouseRef && carouseRef.current.next()
  }

  return (
    <div className="advertising-container">
      <Row className="advertising">
        <Row className="advertising-top-wrapper" justify="center">
          <Col className="advertising-top__image" sm={24} md={11} lg={11} xl={9} xxl={9}>
            <div className="laptop-image">
              <img src={laptop} alt="laptop" />
            </div>
          </Col>
          <Col sm={1} md={1} lg={1} xl={2} xxl={2}></Col>
          <Col className="advertising-top__content" sm={24} md={11} lg={11} xl={10} xxl={9}>
            <div className="conten__wrapper">
              <h2 className="title">
                Моніторинг за галузями
              </h2>
              <p className="description">
                Ознайомтесь з розподілом моніторингів за галузями та перегляньте, яку увагу приділяє Держаудитслужба
                кожній з них.
              </p>
              <a href="/monitoring-market" className="read-next-link">
                Читати далі
              </a>
            </div>
          </Col>
        </Row>
        <CarouselForResourses />
      </Row>
    </div>
  )
}

export default Advertising
