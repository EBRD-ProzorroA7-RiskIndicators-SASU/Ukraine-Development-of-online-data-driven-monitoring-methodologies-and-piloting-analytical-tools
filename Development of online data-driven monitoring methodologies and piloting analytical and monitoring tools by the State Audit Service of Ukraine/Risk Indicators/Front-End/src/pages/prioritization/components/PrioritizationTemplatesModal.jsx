import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { Row, Col, Modal, Table } from 'antd'

import './PrioritizationBaseTable.css'

const templateTableColumns = [
  {
    title: '',
    dataIndex: 'positionNumber',
    sorter: false,
    width: '2%',
    align: 'center',
    render: null,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    width: '55%',
    render: null,
  },
  // {
  //   title: '',
  //   dataIndex: 'type.name',
  //   align: 'left',
  //   width: '20%',
  // },
]

class PrioritizationTemplatesModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      selectedRow: null,
    }
  }

  handleNextStep = () => {
    this.props.handleGoToInspection(this.state.selectedRow)
  }

  handleRowSelection = (record) => {
    this.setState({
      selectedRow: record,
    })
  }

  addTemplatePosition = (templatesData) => {
    let tableData = []
    let counter = 1

    _.forEach(templatesData, (template) => {
        tableData.push(_.merge({}, template, {
          positionNumber: counter,
        }))
        counter++
    })

    return tableData
  }

  render() {
    const { translate, defaultTemplates } = this.props
    const { selectedRow } = this.state
    return (
      <Modal
        title={translate('select_template_modal_title_from_prioritization_page')}
        visible={this.props.visible}
        onOk={this.handleNextStep}
        okButtonProps={{ disabled: !selectedRow }}
        onCancel={this.props.onClose}
        destroyOnClose={true}
        okText={translate('continue_button_name')}
        cancelText={translate('cancel_button')}
        maskClosable={false}
        width={1000}
      >
        <Row>
          <Col span={24}>
            <Table
              title={() =>  (<strong>{translate('default_templates_table_header')}</strong>)}
              showHeader={false}
              bordered
              rowKey='id'
              size="small"
              pagination={{ pageSize: 3 }}
              indentSize={15}
              columns={templateTableColumns}
              dataSource={this.addTemplatePosition(defaultTemplates)}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    this.handleRowSelection(record, rowIndex)
                  },
                }
              }}
              rowClassName={(record, index) => {
                if (selectedRow) {
                  if (!_.isEmpty(this.state.selectedRow)) {
                    return (record.id === this.state.selectedRow.id) ? 'selected-row cursor-pointer' : 'cursor-pointer'
                  } else {
                    return 'cursor-pointer'
                  }
                } else {
                  return 'cursor-pointer'
                }
              }}
              // onChange={this.onChangeTable}
            />
          </Col>
        </Row>
      </Modal>
    )
  }
}

PrioritizationTemplatesModal.propTypes = {
  defaultTemplates: PropTypes.array.isRequired,
  userTemplates: PropTypes.array.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  handleGoToInspection: PropTypes.func,
}

export default withTranslate(PrioritizationTemplatesModal)
