import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { Card, Row, Col } from 'antd'
import { PRIORITIZATION_TENDER_TABLE_COLUMNS } from '../../prioritization/PrioritizationConstants'

class TenderInformationComponent extends Component {
  render() {
    const { translate, templateData, selectedBuyerData, selectedTenderData } = this.props
let baseTemplate = null
    return (
      <Row style={{ marginBottom: 15 }}>
        <Col span={24}>
          <Card
            // title={translate('buyer_card_title')}
            title={translate('summary_information')}
            style={{ width: '100%', marginTop: '10px' }}
            className="summary-information-card"
          >
            {baseTemplate &&
            <Row>
              <Col span={10}>
                <strong>{translate('base_template_name')} :</strong>
              </Col>
              <Col span={14}>
                <p>{baseTemplate && baseTemplate.name}</p>
              </Col>
            </Row>}
            {!_.isEmpty(templateData) && <Row>
              <Col span={10}>
                <strong>{translate('template_name')} :</strong>
              </Col>
              <Col span={14}>
                <p>{templateData && templateData.name}</p>
              </Col>
            </Row>}
            {!_.isEmpty(templateData) &&  <Row>
              <Col span={10}>
                <strong>{translate('template_type')} :</strong>
              </Col>
              <Col span={14}>
                <p>{templateData && translate(templateData.type.name)}</p>
              </Col>
            </Row>}
            {selectedBuyerData &&
            <Row>
              <Col span={10}>
                <strong>{translate('buyer_identifier_name_for_export')} :</strong>
              </Col>
              <Col span={14}>
                <p>{selectedBuyerData.identifierId}</p>
              </Col>
            </Row>}
            {selectedTenderData && _.map(PRIORITIZATION_TENDER_TABLE_COLUMNS, (columnSetting) => (
              <Row>
                <Col span={10}>
                  <strong>{translate(`${columnSetting.translateKey}_name_for_export`)} :</strong>
                </Col>
                <Col span={14}>
                  <p>{columnSetting.hasOwnProperty('render') ? columnSetting.render(selectedTenderData[columnSetting.dataIndex]) : selectedTenderData[columnSetting.dataIndex]}</p>
                </Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
    )
  }
}

TenderInformationComponent.propTypes = {
  templateData: PropTypes.object,
  selectedBuyerData: PropTypes.object,
  selectedTenderData: PropTypes.object,
}

export default withTranslate(TenderInformationComponent)