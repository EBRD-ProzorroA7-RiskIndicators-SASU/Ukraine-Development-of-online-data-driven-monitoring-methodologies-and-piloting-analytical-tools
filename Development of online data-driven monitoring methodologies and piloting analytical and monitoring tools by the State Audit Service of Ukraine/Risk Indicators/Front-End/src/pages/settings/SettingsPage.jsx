import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Row, Col, Card, Form, Input, Button, message } from 'antd'
import { withTranslate } from 'react-redux-multilingual'
import { getAuditorSettings, saveAuditorSettings } from '../../redux/action/administration/AdministrationActions'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'

import './SettingsPage.css'


class SettingsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      saveSuccessfullyMessageShow: false,
      saveErrorMessageShow: false,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    Promise.resolve(this.props.getAuditorSettings()).then(() => {
      this.setInitialValues()
    })
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.saveAuditorSuccessfully, this.props.saveAuditorSuccessfully) && this.props.saveAuditorSuccessfully) {
      this.setState({
        saveSuccessfullyMessageShow: true,
        saveErrorMessageShow: false,
      })
    }

    if (!_.isEqual(prevProps.saveAuditorSettingsDataErrorMessage, this.props.saveAuditorSettingsDataErrorMessage) && !_.isEmpty(this.props.saveAuditorSettingsDataErrorMessage)) {
      this.setState({
        saveSuccessfullyMessageShow: false,
        saveErrorMessageShow: true,
      })
    }
  }

  componentWillUnmount() {
    message.destroy()
  }

  setInitialValues = () => {
    const { form, auditorSettingsData } = this.props
    form.setFieldsValue({
      buyerRiskLevelRank: auditorSettingsData.buyerRiskLevelRank,
      buyerValueRank: auditorSettingsData.buyerValueRank,
      tenderRiskLevelRank: auditorSettingsData.tenderRiskLevelRank,
      tenderValueRank: auditorSettingsData.tenderValueRank,
    })
  }

  handleSaveSettings = (event) => {
    event.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Promise.resolve(this.props.saveAuditorSettings(values)).then(() => {
          Promise.resolve(this.props.getAuditorSettings()).then(() => {
            this.setInitialValues()
          })
        })
      }
    })
  }

  setValueByFiledName = (fieldName, value) => {
    this.props.form.setFieldsValue({
      [fieldName]: parseFloat(value),
    })
  }

  handleTenderCoefficientForTenderChange = (value) => {
    let valueToSet = (1 - value).toFixed(2)
    this.setValueByFiledName('buyerValueRank', parseFloat(valueToSet))
  }

  handleTenderCoefficientForBuyerChange = (value) => {
    let valueToSet = (1 - value).toFixed(2)
    this.setValueByFiledName('tenderValueRank', parseFloat(valueToSet))
  }

  handleBuyerCoefficientForTenderChange = (value) => {
    let valueToSet = (1 - value).toFixed(2)
    this.setValueByFiledName('buyerRiskLevelRank', parseFloat(valueToSet))
  }

  handleBuyerCoefficientForBuyerChange = (value) => {
    let valueToSet = (1 - value).toFixed(2)
    this.setValueByFiledName('tenderRiskLevelRank', parseFloat(valueToSet))
  }

  handleTenderCoefficientForTenderKeyDown = (e) => {
    this.setState({
      buyerRiskLevelRank: parseFloat(e.target.value),
    })
    this.setValueByFiledName('buyerRiskLevelRank', parseFloat(e.target.value))
  }

  handleTenderCoefficientForBuyerKeyDown = (e) => {
    this.setState({
      tenderRiskLevelRank: parseFloat(e.target.value),
    })
    this.setValueByFiledName('tenderRiskLevelRank', parseFloat(e.target.value))
  }

  handleTenderCoefficientForTenderKeyUp = (e) => {
    e.preventDefault()
    const valueToNumber = parseFloat(e.target.value)
    if (!(valueToNumber >= 0 && valueToNumber <= 1 && e.target.value.length <= 4)) {
      let valueToSet = (1 - this.state.buyerRiskLevelRank).toFixed(2)
      this.setValueByFiledName('buyerRiskLevelRank', this.state.buyerRiskLevelRank)
      this.setValueByFiledName('buyerValueRank', parseFloat(valueToSet))
    } else if (_.isEmpty(e.target.value)) {
      this.setValueByFiledName('buyerRiskLevelRank', 0)
      this.setValueByFiledName('buyerValueRank', 1)
    }
  }

  handleTenderCoefficientForBuyerKeyUp = (e) => {
    e.preventDefault()
    const valueToNumber = parseFloat(e.target.value)
    if (!(valueToNumber >= 0 && valueToNumber <= 1 && e.target.value.length <= 4)) {
      let valueToSet = (1 - this.state.tenderRiskLevelRank).toFixed(2)
      this.setValueByFiledName('tenderRiskLevelRank', this.state.tenderRiskLevelRank)
      this.setValueByFiledName('tenderValueRank', parseFloat(valueToSet))
    } else if (_.isEmpty(e.target.value)) {
      this.setValueByFiledName('tenderRiskLevelRank', 0)
      this.setValueByFiledName('tenderValueRank', 1)
    }
  }

  handleBuyerCoefficientForTenderKeyDown = (e) => {
    this.setState({
      buyerRiskLevelRank: parseFloat(e.target.value),
    })
    this.setValueByFiledName('buyerValueRank', parseFloat(e.target.value))
  }

  handleBuyerCoefficientForBuyerKeyDown = (e) => {
    this.setState({
      tenderRiskLevelRank: parseFloat(e.target.value),
    })
    this.setValueByFiledName('tenderValueRank', parseFloat(e.target.value))
  }

  handleBuyerCoefficientForTenderKeyUp = (e) => {
    const valueToNumber = parseFloat(e.target.value)
    if (!(valueToNumber >= 0 && valueToNumber <= 1)) {
      let valueToSet = (1 - this.state.buyerValueRank).toFixed(2)
      this.setValueByFiledName('buyerValueRank', this.state.buyerValueRank)
      this.setValueByFiledName('buyerRiskLevelRank', parseFloat(valueToSet))
    } else if (_.isEmpty(e.target.value)) {
      this.setValueByFiledName('buyerValueRank', 0)
      this.setValueByFiledName('buyerRiskLevelRank', 1)
    }
  }

  handleBuyerCoefficientForBuyerKeyUp = (e) => {
    const valueToNumber = parseFloat(e.target.value)
    if (!(valueToNumber >= 0 && valueToNumber <= 1)) {
      let valueToSet = (1 - this.state.tenderValueRank).toFixed(2)
      this.setValueByFiledName('tenderValueRank', this.state.tenderValueRank)
      this.setValueByFiledName('tenderRiskLevelRank', parseFloat(valueToSet))
    } else if (_.isEmpty(e.target.value)) {
      this.setValueByFiledName('tenderValueRank', 0)
      this.setValueByFiledName('tenderRiskLevelRank', 1)
    }
  }

  onCloseErrorMessage = () => {
    this.setState({
      saveErrorMessageShow: false,
    })
  }

  onCloseSuccessMessage = () => {
    this.setState({
      saveSuccessfullyMessageShow: false,
    })
  }

  render() {
    const { translate } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSaveSettings}
      >
        {this.state.saveSuccessfullyMessageShow && (message.success(translate('settings_save_successfully'), 2) && this.onCloseSuccessMessage())}
        {this.state.saveErrorMessageShow && (message.error(translate('settings_save_error'), 5) && this.onCloseErrorMessage())}
        <Row gutter={24} style={{ marginBottom: 15 }}>
          <Col span={24} style={{ background: '#ECECEC', padding: '30px' }}>
            <Card title={translate('tender_setting_header_name')} bordered={false}>
              <Col span={12}>
                <Form.Item
                  label={translate('tender_weight_of_total_risk_purchases')}
                  className='align-label-text-left'
                >
                  {getFieldDecorator('tenderRiskLevelRank', {
                    // rules: [{ required: true, message: 'Please input your note!' },],
                  })(
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      pattern="/^[0-1]+(\.[0-9]{1,2})?$/"
                      style={{ width: '15%' }}
                      onKeyDown={(e) => this.handleTenderCoefficientForBuyerKeyDown(e)}
                      onKeyUp={(e) => this.handleTenderCoefficientForBuyerKeyUp(e)}
                      onChange={(e) => this.handleTenderCoefficientForBuyerChange(parseFloat(e.target.value))
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={translate('tender_weight_the_cash_component_purchases')}
                  className='align-label-text-left'
                >
                  {getFieldDecorator('tenderValueRank', {
                    // rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      style={{ width: '15%' }}
                      onKeyDown={(e) => this.handleBuyerCoefficientForBuyerKeyDown(e)}
                      onKeyUp={(e) => this.handleBuyerCoefficientForBuyerKeyUp(e)}
                      onChange={(e) => this.handleBuyerCoefficientForBuyerChange(parseFloat(e.target.value))}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Card>
          </Col>
          <Col span={24} style={{ background: '#ECECEC', padding: '30px' }}>
            <Card title={translate('buyer_setting_header_name')} bordered={false}>
              <Col span={12}>
                <Form.Item
                  label={translate('buyer_weight_of_weighted_average_risk_procuring')}
                  className='align-label-text-left'
                >
                  {getFieldDecorator('buyerRiskLevelRank', {
                    // rules: [{ required: true, message: 'Please input your note!' },],
                  })(
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      style={{ width: '15%' }}
                      pattern="/^[0-1]+(\.[0-9]{1,2})?$/"
                      onKeyDown={(e) => this.handleTenderCoefficientForTenderKeyDown(e)}
                      onKeyUp={(e) => this.handleTenderCoefficientForTenderKeyUp(e)}
                      onChange={(e) => this.handleTenderCoefficientForTenderChange(parseFloat(e.target.value))}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={translate('buyer_weight_of_organizations_total_purchases')}
                  className='align-label-text-left'
                >
                  {getFieldDecorator('buyerValueRank', {
                    // rules: [{ required: true, message: 'Please input your note!' }],
                  })(
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      style={{ width: '15%' }}
                      onKeyDown={(e) => this.handleBuyerCoefficientForTenderKeyDown(e)}
                      onKeyUp={(e) => this.handleBuyerCoefficientForTenderKeyUp(e)}
                      onChange={(e) => this.handleBuyerCoefficientForTenderChange(parseFloat(e.target.value))}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <Button type="primary" htmlType='submit'>{translate('save_button')}</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

function mapStateToProps({
                           administrationStore,
                         }) {
  return {
    auditorSettingsData: administrationStore.auditorSettingsData,
    saveAuditorSettingsData: administrationStore.saveAuditorSettingsData,
    saveAuditorSuccessfully: administrationStore.saveAuditorSuccessfully,
    saveAuditorSettingsDataErrorMessage: administrationStore.saveAuditorSettingsDataErrorMessage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAuditorSettings: bindActionCreators(getAuditorSettings, dispatch),
    saveAuditorSettings: bindActionCreators(saveAuditorSettings, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create({ name: 'SettingsForm' })(withTranslate(SettingsPage)))
