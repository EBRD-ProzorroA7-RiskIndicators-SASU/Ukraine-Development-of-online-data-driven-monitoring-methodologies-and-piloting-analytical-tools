import React, { memo, useCallback, useState } from 'react';
import { Row, Col, Menu, Dropdown, Button, Modal, Collapse } from 'antd';
import { Logo } from '../../assets/icons';
import { DownOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { MobileMenuIcon } from '../../assets/icons';
import { MONITORING, RESOURCES, PROCEDURES } from '../../constants';
import _ from "lodash";
import './styles.scss';

const Header = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { Panel } = Collapse;

  const resultsMonitoring = useCallback(
    () => {
      return (
        <Menu>
          {_.map(MONITORING.filter((it) => it.view), (item, index) => {
            const { value, link } = item;
            return (
              <Menu.Item key={index}>
                <Link to={link}>{value}</Link>
              </Menu.Item>
            )
          })}
        </Menu>
      )
    }, []);

  const resources = useCallback(
    () => {
      return (
        <Menu>
          {_.map(RESOURCES.filter((it) => it.view), (item, index) => {
            const { value, link } = item;
            return (
              <Menu.Item key={index}>
                <Link to={link}>{value}</Link>
              </Menu.Item>
            )
          })}
        </Menu>
      )
    }, []);

  const procedures = useCallback(
    () => {
      return (
        <Menu>
          {_.map(PROCEDURES.filter((it) => it.view), (item, index) => {
            const { value, link } = item;
            return (
              <Menu.Item key={index}>
                <Link to={link}>{value}</Link>
              </Menu.Item>
            )
          })}
        </Menu>
      )
    }, []);

  const handleActiveMobileMenu = () => {
    setModalIsVisible(true);
  }

  const handleCloseMobileMenu = () => {
    setModalIsVisible(false);
  }

  return (
    <>
      <Modal
        className="mobile-menu-modal"
        visible={modalIsVisible}
        onCancel={handleCloseMobileMenu}
        footer={false}
      >
        <>
          <div className="mobile-menu-wrapper">
            <div className="menu-header">
              <MobileMenuIcon className="header-icon" />
              <span className="header-title">
                Меню
              </span>
            </div>
            <div className="mobile-menu">
              <Collapse
                defaultActiveKey={['1']}
                accordion={true}
              >
                <Panel showArrow={true} header="Ресурси" key="1">
                  {_.map(RESOURCES.filter((it) => it.view), (item, index) => {
                    const { value, link } = item;
                    return (
                      <span className="link-wrapper" key={index}>
                        <Link
                          to={link}
                          onClick={handleCloseMobileMenu}
                        >
                          {value}
                        </Link>
                      </span>
                    )
                  })}
                </Panel>
                <Panel showArrow={true} header="Процес моніторингу" key="2">
                  {_.map(PROCEDURES.filter((it) => it.view), (item, index) => {
                    const { value, link } = item;
                    return (
                      <span className="link-wrapper" key={index}>
                        <Link
                          to={link}
                          onClick={handleCloseMobileMenu}
                        >
                          {value}
                        </Link>
                      </span>
                    )
                  })}
                </Panel>
                <Panel header="Результати моніторингу" key="3">
                  {_.map(MONITORING.filter((it) => it.view), (item, index) => {
                    const { value, link } = item;
                    return (
                      <span className="link-wrapper" key={index}>
                        <Link
                          to={link}
                          onClick={handleCloseMobileMenu}
                        >
                          {value}
                        </Link>
                      </span>
                    )
                  })}
                </Panel>
              </Collapse>
            </div>
          </div>
          <div className="menu-header-bottom">
            <a target="_blank" rel="noreferrer" href="https://prozorro.gov.ua">prozorro.gov.ua</a>
            <a target="_blank" rel="noreferrer" href="http://www.dkrs.gov.ua/">dkrs.gov.ua</a>
            <a target="_blank" rel="noreferrer" href="https://mof.gov.ua/uk">minfin.gov.ua</a>
          </div>
        </>
      </ Modal>
      <Row justify="center" className='header'>
        <Row justify="center" className="header-top">
          <Col xs={18} sm={23} md={23} lg={23} xl={21} xxl={18} className="header-top-container">
            <div className="header-top-nav">
              <a target="_blank" rel="noreferrer" href="https://prozorro.gov.ua">prozorro.gov.ua</a>
              <a target="_blank" rel="noreferrer" href="http://www.dkrs.gov.ua/">dkrs.gov.ua</a>
              <a target="_blank" rel="noreferrer" href="https://mof.gov.ua/uk">minfin.gov.ua</a>
            </div>
            <div className="header-top-nav">
              <a href="/calculation-methodology">Методологія розрахунків</a>
            </div>
          </Col>
        </Row>
        <Row justify="center" className="header-main-wrapper">
          <Col className='header-main' xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
            <Link to="/" className="header-main__logo">
              <div className="logo">
                <Logo />
              </div>
              <div className="color-border">
                <span className="blue" />
                <span className="yellow" />
              </div>
              <div className="logo-title">
                <span className="logo-title__top">
                  monitoring
                </span>
                {/*<div className="logo-title__bottom">*/}
                {/*  site.gov.ua*/}
                {/*</div>*/}
              </div>
            </Link>
            <div className="header-right-side">
              <Dropdown
                trigger={['click']}
                className="resources"
                overlay={resources}
                placement="bottomCenter"
                overlayClassName="monitoring-resources-overlay"
              >
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Ресурси <DownOutlined />
                </a>
              </Dropdown>
              <Dropdown
                trigger={['click']}
                className="procedures"
                overlay={procedures}
                placement="bottomCenter"
                overlayClassName="monitoring-procedures-overlay"
              >
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Процес моніторингу <DownOutlined />
                </a>
              </Dropdown>
              <Dropdown
                trigger={['click']}
                className="monitoring-results"
                overlay={resultsMonitoring}
                placement="bottomCenter"
                overlayClassName="monitoring-results-overlay"
              >
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Результати моніторингу <DownOutlined />
                </a>
              </Dropdown>
            </div>
            <Button
              className="mobile-menu-button"
              icon={<MobileMenuIcon />}
              onClick={handleActiveMobileMenu}
            />
          </Col>
        </Row>
      </Row>
    </>
  )
}

export default memo(Header);
