import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import * as numeral from 'numeral'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import _ from 'lodash'
import cx from 'classnames'
import './styles.scss'

numeral.locale('ua')

const ResourcesTopInfo = ({ propsForComponent, propsForTopSection }) => {
  const location = useLocation()
  const currentPath = location.pathname
  const [path, setPath] = useState(null)
  const { description, subTitle, title } = !_.isEmpty(propsForComponent) && propsForComponent
  // const resultsMonitoringPage = path === '/monitoring-results'
  const {
    totalAuditorsCount,
    totalMonitoringTenders,
    cpvCount,
    totalProcuringEntitiesCount,
    monitoringProcuringEntities,
    totalAwardsAmount,
    tendersAmount,
    avgOfficeViolations,
    totalDuration,
    totalTendersAmount,
  } = !_.isEmpty(propsForTopSection) && propsForTopSection

  let fistNumber
  let currencyFormat = false
  let percentage = false

  switch (path) {
    case '/resources':
      fistNumber = totalAuditorsCount
      break

    case '/comparative-dynamics':
      fistNumber = totalMonitoringTenders
      break

    case '/monitoring-market':
      fistNumber = cpvCount
      break

    case '/monitoring-regions':
      fistNumber = totalProcuringEntitiesCount
      break

    case '/monitoring-procurement-methods':
      fistNumber = monitoringProcuringEntities
      break

    case '/monitoring-coverage':
      currencyFormat = true
      fistNumber = numeral(totalAwardsAmount).format('0.00 a')
      break

    case '/monitoring-results':
      currencyFormat = true
      fistNumber = numeral(totalTendersAmount).format('0.0 a')
      break

    case '/results-by-office':
      fistNumber = avgOfficeViolations
      break

    case '/type-of-violation':
      fistNumber = totalProcuringEntitiesCount
      break

    case '/results-source':
      currencyFormat = true
      fistNumber = numeral(totalTendersAmount).format('0.0 a')
      break

    case '/monitoring-duration':
      fistNumber = totalDuration
      break

    default:
      console.log()
  }

  useEffect(
    () => {
      setPath(currentPath)
    }, [currentPath],
  )

  const getPreparedNumber = () => {
    const suffix = percentage ? '%' : ''
    if (fistNumber) {
      if (_.isNumber(fistNumber)) {
        return numeral(fistNumber).format('0,0') + suffix
      } else {
        if (currencyFormat) {
          return fistNumber.split(' ')[0] + suffix
        } else {
          return fistNumber + suffix
        }
      }
    } else {
      return ''
    }
  }

  return (
    <>
      <div className="top-info-container">
        <Helmet>
          <title>{subTitle}</title>
        </Helmet>
        <Row className="top-info-content-wrapper" justify="center">
          <Col className={cx("top-info-content", propsForComponent.display ? 'top-info-content-bottom-radius' : '')} xs={24} sm={23} md={23} lg={23} xl={21} xxl={18}>
            <h6 className="top-info-title">
              {subTitle}
            </h6>
            {propsForComponent.display && <div className="content">
              <div className="content__right-side">
                <h1 className="title">
                  {/*{currencyFormat ? `${title} (грн)` : title}*/}
                  {title}
                </h1>
                <p className="description">
                  {description}
                </p>
              </div>
              <div className={`left-side-wrapper ${currencyFormat ? 'currency-format' : ''}`}>
              <span className="content__left-side">
              {getPreparedNumber()}
              </span>
                {currencyFormat && <span className="currency-type">
                  {fistNumber.split(' ')[1]} грн
                </span>}
              </div>
            </div>}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ResourcesTopInfo