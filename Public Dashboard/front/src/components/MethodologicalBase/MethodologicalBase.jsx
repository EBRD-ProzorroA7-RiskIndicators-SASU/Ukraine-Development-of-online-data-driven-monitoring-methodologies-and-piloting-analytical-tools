import React from 'react';
import { Row, Col } from 'antd';
import ImageLeft from '../../assets/image_1_1.png'
import ImageRight from '../../assets/image_2_1.png'
import './styles.scss';

const MethodologicalBase = () => {
  return (
    <div className="methodological-container">
      <Row className="methodological-base" justify="center">
        <Col className="methodological-base-left-side" xs={24} sm={11} md={11} lg={11} xl={9} xxl={7}>
          <div className="left-side__wrapper">
            <div className="left-side__logo-block">
              <div className="logo">
                <img src={ImageLeft} alt="Logo" style={{ width: '100%'}}/>
              </div>
            </div>
            <h3 className="left-side__title">
              Територіальні підрозділи та кількість аудиторів
            </h3>
            <p className="left-side__description">
              Ознайомтесь з інформацією про кількість аудиторів та їхнє розташування по територіальних підрозділах.
            </p>
            <a className="left-side__link" href="/resources">
              Читати далі
          </a>
          </div>
        </Col>
        <Col xs={0} sm={1} md={0} lg={0} xl={2} xxl={2} />
        <Col className="methodological-base-right-side" xs={24} sm={9} md={11} lg={11} xl={9} xxl={7}>
          <div className="right-side__wrapper">
            <div className="right-side__logo-block">
              <div className="logo">
                <img src={ImageRight} alt="Logo" style={{ width: '100%'}}/>
              </div>
            </div>
            <h3 className="right-side__title">
              Моніторинг за типами процедур закупівель
            </h3>
            <p className="right-side__description">
              Подивіться, які типи процедур закупівель частіше потрапляють у поле зору Держаудитслужби
            </p>
            <a className="right-side__link" href="/monitoring-procurement-methods">
              Читати далі
          </a>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MethodologicalBase
