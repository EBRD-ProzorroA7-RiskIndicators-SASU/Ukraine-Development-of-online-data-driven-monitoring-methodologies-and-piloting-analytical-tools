import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withTranslate } from 'react-redux-multilingual'
import { Button, Popover, Row, Col } from 'antd'
import { hasPermission } from '../../../utils/Permissions'
import { PERMISSIONS } from '../../../components/secutiry/PermissionConstants'

class InspectionActionsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  renderPopoverContent = () => {
    const { checklistData, translate, userInfo } = this.props
    return (
      <Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24} key={`col_preview_button_${checklistData.id}`}>
            <Button
              icon='read'
              style={{ width: '100%' }}
              onClick={() => this.props.handlePreviewTemplate(checklistData)}
              key={`edit_button_${checklistData.id}`}
            >
              {translate('preview_button_name')}
            </Button>
          </Col>
        </Row>

        {((hasPermission(PERMISSIONS.auditorBase) || hasPermission(PERMISSIONS.supervisor)) && _.isEqual(checklistData.auditor.email, userInfo.sub)) &&
        <Row style={{ marginBottom: 10 }}>
          <Col span={24} key={`col_edit_button_${checklistData.id}`}>
            <Button
              icon='edit'
              style={{ width: '100%' }}
              onClick={() => this.props.handleEditTemplate(checklistData)}
              key={`edit_button_${checklistData.id}`}
            >
              {translate('edit_button_name')}
            </Button>
          </Col>
        </Row>}
        {(_.isEqual(checklistData.auditor.email, userInfo.sub) || hasPermission(PERMISSIONS.adminBase)) && <Row>
          <Col span={24} key={`col_delete_button__${checklistData.id}`}>
            <Button
              icon="delete"
              style={{ width: '100%' }}
              onClick={() => this.props.handleDeleteChecklist(checklistData)}
              key={`delete_button_${checklistData.id}`}
            >
              {translate('delete_button')}
            </Button>
          </Col>
        </Row>}
      </Row>
    )
  }

  render() {
    return (
      <div className="checklist-action-button">
        <Popover
          content={this.renderPopoverContent()}
          trigger="click"
          placement="bottomRight"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button icon="setting" />
        </Popover>
      </div>
    )
  }
}

InspectionActionsComponent.propTypes = {
  checklistData: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  handlePreviewTemplate: PropTypes.func,
  handleEditTemplate: PropTypes.func,
  handleExportTemplate: PropTypes.func,
  handleDeleteChecklist: PropTypes.func,
}

export default withTranslate(InspectionActionsComponent)
