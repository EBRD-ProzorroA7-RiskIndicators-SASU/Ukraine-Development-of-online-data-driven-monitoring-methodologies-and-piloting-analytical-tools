import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Spin, Icon } from 'antd'
import classnames from 'classnames'
import { withTranslate } from 'react-redux-multilingual'
import * as NumberUtils from '../../utils/NumberUtils'

import './StatusCard.css'

class StatusCard extends Component {
  render() {
    const { translate, cardOptions, dashboardInfoData, dashboardInfoDataIsFetching } = this.props

    return (
      <Spin spinning={dashboardInfoDataIsFetching} size="large">
        {cardOptions.map((cardOption, index) => {
          let spanSize = 24 / cardOptions.length
          let paddingStyle = ''
          if (index === 0) {
            paddingStyle = 'pr-15'
          } else if (index === (cardOptions.length - 1)) {
            paddingStyle = 'pl-15'
          } else {
            paddingStyle = 'pl-pr-15'
          }

          return (
            <Col span={spanSize} key={`status_card_${index}`} className={classnames(paddingStyle)}>
              <div className="StatusCard">
                <div className={classnames('tile-stats', cardOption.colorStyle)}>
                  <div className="icon">
                    {cardOption.hasOwnProperty('iconTypeComponent') ?
                      <Icon className="entypo-users" component={cardOption.iconTypeComponent} /> :
                      <Icon className="entypo-users" type={cardOption.iconType} />}
                  </div>
                  <div className="num" data-start="0" data-end="83" data-postfix="" data-duration="1500" data-delay="0">
                    {NumberUtils[cardOption.valueCountFormatFunction](dashboardInfoData[cardOption.valueCountKey])}
                  </div>
                  <h3>{translate(cardOption.titleKey)}</h3>
                  <p className={cardOption.pClass}>
                    <span className="amount-text">{translate(cardOption.valueAmountTranslateKey)}</span>
                    <span
                      className="amount-num">{NumberUtils[cardOption.valueAmountFormatFunction](dashboardInfoData[cardOption.valueAmountKey])}</span>
                  </p>
                </div>
              </div>
            </Col>
          )
        })}
      </Spin>
    )
  }
}

StatusCard.propTypes = {
  cardOptions: PropTypes.array.isRequired,
  dashboardInfoData: PropTypes.object.isRequired,
  dashboardInfoDataIsFetching: PropTypes.bool,
}

StatusCard.defaultProps = {
  dashboardInfoDataIsFetching: false,
}

export default withTranslate(StatusCard)
