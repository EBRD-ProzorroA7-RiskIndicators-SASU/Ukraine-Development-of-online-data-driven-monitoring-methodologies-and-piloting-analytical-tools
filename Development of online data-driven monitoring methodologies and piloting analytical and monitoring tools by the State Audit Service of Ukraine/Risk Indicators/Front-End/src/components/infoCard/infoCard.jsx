import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import classnames from 'classnames'
import _ from 'lodash'
import { Col, Spin, Icon } from 'antd'
import Card from '../card/Card'

import './infoCard.css'

class InfoCard extends Component {
  render() {
    const { translate, cardOptions, dashboardInfoData, dashboardInfoDataIsFetching, allMappings } = this.props

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
          let value = dashboardInfoData[cardOption.key]

          if (cardOption.hasMappingSource && !_.isNil(dashboardInfoData[cardOption.key])) {
            let mappingData = allMappings[cardOption.mappingKey]
            value = _.find(mappingData, { [cardOption.mappingSearchKey]: dashboardInfoData[cardOption.key] })[cardOption.mappingValueKey]
          }

          return (
            <Card className={classnames(`ant-col-${spanSize}`, paddingStyle)} cardClass="card-border-style" key={`card_key_${index}`}>
              <div className="swith-card-content">
                {/*<Icon className="entypo-users" type={cardOption.iconType} fill="#8B94B9" />*/}
                <div className="icon">
                  {cardOption.hasOwnProperty('iconTypeComponent') ?
                    <Icon className="entypo-users" component={cardOption.iconTypeComponent} /> :
                    <Icon className="entypo-users" type={cardOption.iconType} />}
                </div>
                <div className="swith-card-content-title">{translate(cardOption.translateKey)}</div>
                <div className="swith-card-content-value">{value}
                  {/*<br />*/}
                  {/*<span className="currency-value">QWEQWE</span>*/}
                </div>
              </div>
            </Card>
          )
        })}
      </Spin>
    )
  }
}

InfoCard.propTypes = {
  allMappings: PropTypes.object.isRequired,
  cardOptions: PropTypes.array.isRequired,
  dashboardInfoData: PropTypes.object.isRequired,
  dashboardInfoDataIsFetching: PropTypes.bool,
}

InfoCard.defaultProps = {
  dashboardInfoDataIsFetching: false,
}

export default withTranslate(InfoCard)
