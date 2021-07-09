import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withTranslate} from 'react-redux-multilingual'

import './BuyerProcessedCountInfoCard.css'
import classnames from "classnames";
import {Col} from "antd";
import * as NumberUtils from "../../utils/NumberUtils";

class BuyerProcessedCountInfoCard extends Component {
    render() {
        const {translate, totalBuyerCount, processedBuyerCount, notProcessedBuyerCount} = this.props

        return (
            <Col span={24} className={classnames('pr-15')}>
                <div className="StatusCard">
                    <div className={classnames('tile-stats', 'tile-white')}>
                        <div className="num" data-start="0" data-end="83" data-postfix="" data-duration="1500" data-delay="0">
                            {NumberUtils['toNumberFormat'](totalBuyerCount)}
                        </div>
                        <h3>{translate('buyer_total_count')}</h3>
                        <p className="margin-top-first-block">
                            <span className="amount-text">{translate('buyer_processed_count')}</span>
                            <span
                                className="amount-num">{NumberUtils['toNumberFormat'](processedBuyerCount)}</span>
                        </p>
                        <p className="margin-top-first-block">
                            <span className="amount-text">{translate('buyer_not_processed_count')}</span>
                            <span
                                className="amount-num">{NumberUtils['toNumberFormat'](notProcessedBuyerCount)}</span>
                        </p>
                    </div>
                </div>
            </Col>
        )
    }
}

BuyerProcessedCountInfoCard.propTypes = {
    totalBuyerCount: PropTypes.number.isRequired,
    processedBuyerCount: PropTypes.number.isRequired,
    notProcessedBuyerCount: PropTypes.number.isRequired,
}

export default withTranslate(BuyerProcessedCountInfoCard)
