import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { Button, Checkbox, Radio, Row, Col, Popover, Input, Alert } from 'antd'

import './ExportButton.css'

class ExportButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      defaultType: 'xls',
      selectedColumns: _.map(props.columnOptions, (option) => (option.value)),
      fileNameDefault: 'auto_name',
      customFileName: '',
      showReqExpoError: false,
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  changeExportType = (event) => {
    this.setState({
      defaultType: event.target.value,
    })
  }

  handleChangeCheckboxGroup = (selectedColumns) => {
    this.setState({
      selectedColumns: selectedColumns,
    })
  }

  downloadButtonClicked = () => {
    const { selectedColumns, defaultType, customFileName, fileNameDefault } = this.state
    let selectedColumnsFullOptions = _.filter(this.props.columnOptions, (option) => (_.includes(selectedColumns, option.value)))
    let fileName = ''


    switch (fileNameDefault) {
      case 'auto_name':
        fileName = this.props.filename
        break
      case 'custom_name':
        fileName = customFileName
        break

      default:
        fileName = this.props.filename
        break
    }

    this.setState({
      visible: false,
    }, () => {
      this.props.downloadButtonClicked(defaultType, selectedColumnsFullOptions, fileName)
    })
  }

  onChangeFilename = (e) => {
    let { showReqExpoError } = this.state
    this.setState({
      fileNameDefault: e.target.value,
      showReqExpoError: (showReqExpoError && e.target.value === 'auto_name') ? false : showReqExpoError,
    })
  }

  handleChangeFileName = (value) => {
    if(value.match(/(^[a-zA-Zа-яА-Я0-9]+([a-zA-Zа-яА-Я_\s0-9-]*))$/g)) {
      this.setState({
        customFileName: value,
        showReqExpoError: false,
      })
    } else {
      this.setState({
        customFileName: '',
        showReqExpoError: true,
      })
    }
  }

  renderPopoverContent = () => {
    const { columnOptions, translate } = this.props
    const { selectedColumns, defaultType, customFileName, fileNameDefault } = this.state
    const radioStyle = {
      display: 'block',
      height: '65px',
      lineHeight: '30px',
      marginRight: 0,
    }

    return (
      <div className="export-button-content">
        {/*<Row style={{ marginBottom: 15 }}>*/}
        {/*<Col span={24}>*/}
        {/*<strong>{translate('export_button_file_type_name')}</strong>*/}
        {/*</Col>*/}
        {/*<Col span={24}>*/}
        {/*<Radio.Group onChange={this.changeExportType} value={defaultType} buttonStyle="solid">*/}
        {/*<Radio.Button value="xls">XLS</Radio.Button>*/}
        {/*<Radio.Button value="pdf">PDF</Radio.Button>*/}
        {/*</Radio.Group>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        <Row style={{ marginBottom: 15 }}>
          <Col span={24}>
            <strong>{translate('export_button_selected_columns_name')}</strong>
          </Col>
          <Col span={24}>
            <Checkbox.Group
              options={columnOptions}
              defaultValue={selectedColumns}
              onChange={this.handleChangeCheckboxGroup}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 15 }}>
          <Col span={24}>
            <Radio.Group onChange={this.onChangeFilename} value={fileNameDefault} style={{ width: '100%' }}>
              <Radio value={'auto_name'} style={radioStyle}>
                <Row style={{ float: 'left', opacity: (fileNameDefault === 'auto_name') ? 1 : 0.5 }}>
                  <Col span={24}>
                    <strong>{translate('export_button_default_filename_name')}</strong>
                  </Col>
                  <Col span={24}>
                    <div className="export-generated-filename">{this.props.filename}.{defaultType}</div>
                  </Col>
                </Row>
              </Radio>
              <Radio value={'custom_name'} style={radioStyle}>
                <Row style={{ float: 'left', width: '90%', opacity: (fileNameDefault === 'custom_name') ? 1 : 0.5 }}>
                  <Col span={24}>
                    <strong>{translate('export_button_custom_filename_name')}</strong>
                  </Col>
                  <Col span={24}>
                    <Input
                      style={{ width: '100%' }}
                      pattern="([a-zA-Z0-9]| |/|\\|@|#|\$|%|&)+"
                      onChange={(e) => this.handleChangeFileName(e.target.value)}
                      suffix={`.${defaultType}`}
                      maxLength={100}
                    />
                  </Col>
                </Row>
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row style={{marginBottom: 10}}>
          <Col span={24}>
            {this.state.showReqExpoError && <Alert type="error" message={translate('export_button_custom_filename_error_message_name')} banner />}
          </Col>
        </Row>
        <Row>
          <Button
            type="primary"
            icon="download"
            size='large'
            style={{ width: '100%' }}
            disabled={_.isEmpty(selectedColumns) || (fileNameDefault === 'custom_name' && _.isEmpty(customFileName))}
            onClick={() => this.downloadButtonClicked()}
          >
            {translate('export_button_download_name')}
          </Button>
        </Row>
      </div>
    )
  }

  render() {
    const { translate } = this.props

    return (
      <div className="export-button">
        <Popover
          content={this.renderPopoverContent()}
          trigger="click"
          placement="bottomRight"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button icon="download">{translate('export_button_name')}</Button>
        </Popover>
      </div>
    )
  }
}

ExportButton.propTypes = {
  columnOptions: PropTypes.array,
  filename: PropTypes.string,
  downloadButtonClicked: PropTypes.func,
}

ExportButton.defaultProps = {
  useBaseTemplateData: false,
}


export default withTranslate(ExportButton)
