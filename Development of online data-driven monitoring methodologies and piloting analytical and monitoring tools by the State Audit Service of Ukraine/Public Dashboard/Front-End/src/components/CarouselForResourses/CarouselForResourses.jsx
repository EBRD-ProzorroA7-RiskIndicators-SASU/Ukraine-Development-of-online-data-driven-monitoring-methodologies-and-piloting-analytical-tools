import React, { useRef, useEffect, useState } from 'react'
import { Row, Col, Carousel, Button, Divider } from 'antd'
import useWidth from '../../hooks/useWidth'
import { LeftArrow, RightArrow } from '../../assets/icons'
import { MORE_INFO_CAROUSEL_OPTIONS } from '../../constants/index'
import './styles.scss'


const CarouselForResourses = () => {
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
    <div className="carousel-wrapper">
      <Row className="carousel-row" justify="center">
        <Col className="carousel-col" md={22} lg={21} xl={20} xxl={18}>
          <h4 className="carousel-title">
            Більше аналітики
          </h4>
          {!mobile && <div className="carousel-divider"><Divider /></div>}
          {!mobile && <Button className="prev-button" onClick={handlePrev} icon={<LeftArrow />} />}
          <Carousel
            ref={carouseRef}
            className="advertising-carousel"
            slidesToShow={!mobile ? 3 : 1}
            dots={true}
            arrows={false}
            autoplay={mobile}
          >
            {MORE_INFO_CAROUSEL_OPTIONS.map((item, index) => (
              <div className="advertising-slide" key={`carousel_item_${index}`}>
                <div className="slide">
                  <div className="carousel-slide-logo">
                    <img src={item.logo} alt="Logo" style={{ width: '100%' }} />
                  </div>
                  <div className="carousel-slide-title">
                    <h3 className="slide-title">
                      {item.title}
                    </h3>
                  </div>
                  <div className="carousel-slide-content">
                    <p className="slide-description">
                      {item.content}
                    </p>
                  </div>
                  <div className="carousel-slide-button">
                    <a href={item.buttonLink} className="slide-link">Читати далі</a>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          {!mobile && <Button className="next-button" onClick={handleNext} icon={<RightArrow />} />}
        </Col>
      </Row>
    </div>
  )
}

export default CarouselForResourses
