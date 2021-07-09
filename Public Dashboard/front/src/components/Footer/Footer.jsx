import React, { memo, useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { Logo, BankIcon } from '../../assets/icons';
import { MONITORING, RESOURCES, PROCEDURES } from '../../constants';
import { Link } from "react-router-dom";
import _ from 'lodash';
import useWidth from "../../hooks/useWidth";
import './styles.scss';

const Footer = () => {
  const w = useWidth();
  const [currentWidth, setCurrentWidth] = useState(null);
  const mobile = currentWidth <= 768;

  useEffect(() => {
    setCurrentWidth(w);
  }, [w])

  const resultsMonitoring = useCallback(
    () => {
      return (
        _.map(MONITORING.filter((it) => it.view), (item, index) => {
          const { value, link } = item;
          return (
            <Link key={index} to={link}>{value}</Link>
          )
        })
      )
    }, []);

  const resources = useCallback(
    () => {
      return (
        _.map(RESOURCES.filter((it) => it.view), (item, index) => {
          const { value, link } = item;
          return (
            <Link key={index} to={link}>{value}</Link>
          )
        })
      )
    }, []);

  const procedures = useCallback(
    () => {
      return (
        _.map(PROCEDURES.filter((it) => it.view), (item, index) => {
          const { value, link } = item;
          return (
            <Link key={index} to={link}>{value}</Link>
          )
        })
      )
    }, []);

  return (
    <div className="footer-container">
      <Row className="footer" justify="center">
        <Col xs={24} sm={18} md={18} lg={6} xl={6} xxl={6}>
          <div className="foter-content">
            <div className="logo-text">
              <div className="logo">
                <Logo />
                <div className="additional-borders">
                  <span className="top-border" />
                  <span className="bottom-border" />
                </div>
                <div className="logo-text-wrapper">
                  <span className="logo-text-top">
                    monitoring
                  </span>
                  {/*<span className="logo-text-bottom">*/}
                  {/*  prozorro.gov.ua*/}
                  {/*</span>*/}
                </div>
              </div>
              <a href="mailto:admin@monitoring.gov.ua" className="mail-to-admin">
                admin@monitoring.gov.ua
              </a>
              <div className="copyright-section">
                © monitoring 2021. Всі права захищені
              </div>
            </div>
          </div>
        </Col>
        {!mobile && <Col xs={24} sm={18} md={18} lg={4} xl={4} xxl={4}>
          <div className="resources-nav">
            <span className="title">
              Ресурси
            </span>
            {resources()}
          </div>
        </Col>}
        {!mobile && <Col xs={24} sm={18} md={18} lg={4} xl={4} xxl={4}>
          <div className="procedures-nav">
            <span className="title">
              Процес моніторингу
            </span>
            {procedures()}
          </div>
        </Col>}
        {!mobile && <Col xs={24} sm={18} md={18} lg={4} xl={4} xxl={4}>
          <div className="monitoring-nav">
            <span className="title">
              Результати моніторингу
            </span>
            {resultsMonitoring()}
          </div>
        </Col>}
        {<Col xs={24} sm={18} md={18} lg={4} xl={4} xxl={4}>
          <div className="bank-logo">
            <BankIcon />
            <p className="bank-description">
              Pilot Project Funded by the European Bank for Reconstruction and Development
            </p>
          </div>
        </Col>}
      </Row>
    </div>
  )
}

export default memo(Footer);
