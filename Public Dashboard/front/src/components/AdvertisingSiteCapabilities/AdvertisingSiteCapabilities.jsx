import React from 'react';
import { Row, Col } from 'antd';
import DiagramIcon from '../../assets/icons/diagram 1.svg'
import AnalyticsIcon from '../../assets/icons/analytics 1.svg'
import AnalysisIcon from '../../assets/icons/analysis 1.svg'
import TimeIcon from '../../assets/icons/time 1.svg'
import DownloadIcon from '../../assets/icons/download 1.svg'
import './styles.scss';

const AdvertisingSiteCapabilities = () => {
  return (
    <div className="container-advertising">
      <Row className="advertising-site-capabilities" justify="center">
        <Col className="capabilities__left-side" xs={24} sm={11} md={11} lg={11} xl={9} xxl={10}>
          <h1 className="left-side__title">
            Чим зацікавить ресурс
          </h1>
          <p className="left-side__description">
            Тут ви знайдете багато аналітичної інформації щодо моніторингу процедур закупівель, зможете її порівнювати та зберігати собі для подальшого аналізу.
          </p>
        </Col>
        <Col md={1} lg={0} xl={1} xxl={2} />
        <Col className="capabilities__right-side" xs={24} sm={11} md={11} lg={11} xl={9} xxl={10}>
          <div className="right-side__list">
            <div className="right-side__list-item">
              <div className="icon cloud-icon">
                <img src={DiagramIcon} alt=''/>
              </div>
              <span className="cloud-label">
                Систематизація інформації про моніторинги та процедури
            </span>
            </div>
            <div className="right-side__list-item">
              <div className="icon count-icon">
                <img src={AnalyticsIcon} alt=''/>
              </div>
              <span className="count-label">
                Використання інтерактивних аналітичних інструментів
            </span>
            </div>
            <div className="right-side__list-item">
              <div className="icon exel-icon">
                <img src={AnalysisIcon} alt=''/>
              </div>
              <span className="exel-label">
                Аналітика процесу під багатьма кутами
            </span>
            </div>
            <div className="right-side__list-item">
              <div className="icon exel-icon">
                <img src={TimeIcon} alt=''/>
              </div>
              <span className="exel-label">
                Щоденне оновлення статистики
            </span>
            </div>
            {/*<div className="right-side__list-item">*/}
            {/*  <div className="icon exel-icon">*/}
            {/*    <img src={DownloadIcon} alt=''/>*/}
            {/*  </div>*/}
            {/*  <span className="exel-label">*/}
            {/*    Можливість зберігання аналітичної інформації*/}
            {/*</span>*/}
            {/*</div>*/}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default AdvertisingSiteCapabilities;
