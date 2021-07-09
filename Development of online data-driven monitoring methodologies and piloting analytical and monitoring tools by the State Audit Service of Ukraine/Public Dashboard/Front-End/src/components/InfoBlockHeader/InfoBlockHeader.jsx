import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './styles.scss'
import * as numeral from 'numeral'

const InfoBlockHeader = (props) => {
  const {
    mainText,
    infoText,
    countText,
    value,
    noMainPadding,
    isCurrency,
  } = props

  return (
    <div className={cx('info-block-count', noMainPadding && 'no-main-padding')}>
      <div className="info-block-count__left-side">
        <h2 className="title">
          {mainText}
        </h2>
        <p className="description">
          {infoText}
        </p>
      </div>
      <div className="info-block-count__right-side">
        <span className="auditors">
          {countText}
        </span>
        <div className="auditors-count">
          {!isCurrency ? value : <div className="info-block-value-wrapper">
            {numeral(value).format('0.00 a').split(' ')[0]}
            <div className="info-block-value-container">
              <div
                className="info-block-value-pref">{numeral(value).format('0.00 a').split(' ')[1]}</div>
              <div className="info-block-value-suf"> грн</div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}

InfoBlockHeader.propTypes = {
  mainText: PropTypes.string,
  infoText: PropTypes.string,
  countText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  noMainPadding: PropTypes.bool,
  isCurrency: PropTypes.bool,
}

// Set default props
InfoBlockHeader.defaultProps = {
  mainText: 'mainText',
  infoText: 'infoText',
  countText: 'countText',
  value: 0,
  noMainPadding: false,
  isCurrency: false,
}

export default InfoBlockHeader

