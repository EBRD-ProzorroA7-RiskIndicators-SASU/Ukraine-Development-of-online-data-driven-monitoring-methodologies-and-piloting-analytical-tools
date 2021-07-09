import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { Button, Icon, Row, Col, Table, Divider, Modal, Tooltip } from 'antd'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import { getAuditors, updateAuditor, deleteAuditor } from '../../redux/action/administration/AdministrationActions'
import { getAllPermissions } from '../../redux/action/permissions/PermissionsActions'
import { setAuditorNewPassword } from '../../redux/action/auth/AuthActions'
import EditAuditorForm from './components/EditAuditorForm'
import EditAuditorPasswordForm from './components/EditAuditorPasswordForm'
import { AUDITORS_TABLE_COLUMNS } from './AdministrationPageConstats'

import './AdministrationPage.css'

class AdministrationPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      auditors: props.auditors,
      showEditAuditorModal: false,
      selectedAuditor: null,
      isVisibleConfirm: false,
      deleteUserData: null,
      showChangePasswordModal: false,
      isSpin: false,
      messageObject: {},
      showMessage: false,
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadAuditorsData()
    this.props.getAllPermissions()
  }

  loadAuditorsData = () => {
    this.props.getAuditors().then(() => {
      this.setState({
        auditors: this.props.auditors,
      })
    })
  }

  refreshListOfAuditors = () => {
    this.loadAuditorsData()
  }


  handleEditAuditor = (auditor) => {
    this.setState({
      showEditAuditorModal: true,
      selectedAuditor: auditor,
    })
  }

  handleDeleteAuditor = (auditor) => {
    this.setState({
      isVisibleConfirm: true,
      deleteUserData: auditor,
    }, () => {
      this.renderDeleteUserConfirm()
    })
  }

  renderEditButton = (auditor) => {
    const { translate } = this.props
    return (
      <Tooltip placement="top" title={translate('edit_button_name')} key={`edit_button_${auditor.id}`}>
        <Button
          icon='edit'
          onClick={() => this.handleEditAuditor(auditor)}
        />
      </Tooltip>
    )
  }

  renderDeleteButton = (auditor) => {
    const { translate } = this.props
    return (
      <Tooltip placement="top" title={translate('delete_button')} key={`delete_button_${auditor.id}`}>
        <Button
          icon='delete'
          onClick={() => this.handleDeleteAuditor(auditor)}
        />
      </Tooltip>
    )
  }

  renderAuditorsActions = (auditor) => {
    const { userInfo } = this.props
    return [
      this.renderEditButton(auditor),
      !_.isEqual(auditor.email, userInfo.sub) && this.renderDeleteButton(auditor),
    ]
  }

  prepareTableColumns = () => {
    const { translate } = this.props
    return AUDITORS_TABLE_COLUMNS.map((column) => {
      column.hasOwnProperty('translate_key') && (column.title = translate(column.translate_key))
      return column
    })
  }

  prepareTableData = () => {
    return this.state.auditors.map((auditor) => {
      return _.merge({}, auditor, {
        statusIcon: <Icon type="user" style={{ color: auditor.disabled ? '#E93C3C' : '#00AF00' }} />,
        editButton: this.renderAuditorsActions(auditor),
      })
    })
  }

  handleCloseEditAuditorForm = () => {
    this.setState({
      showEditAuditorModal: false,
      selectedAuditor: null,
    })
  }


  handleCloseEditAuditorPasswordForm = () => {
    this.setState({
      showChangePasswordModal: false,
    })
  }

  handleSaveEditAuditorForm = (formInstance) => {
    formInstance.validateFields((err, values) => {
      if (err) {
        return
      }

      values.disabled = !values.disabled
      values.permissions = [parseInt(values.permissions, 10)]

      if (this.state.showEditAuditorModal && !values.hasOwnProperty('id')) {
        values = _.merge({}, values, { id: this.state.selectedAuditor.id })
      }

      this.props.updateAuditor(values).then(() => {
        this.setState({
          showEditAuditorModal: false,
          selectedAuditor: null,
        }, () => {
          this.loadAuditorsData()
        })
      })
    })
  }

  handleSaveEditAuditorPasswordForm = (formInstance) => {
    this.setState({
      isSpin: true,
    }, () => {
      formInstance.validateFields((err, values) => {
        if (err) {
          return
        }

        let responseData = {
          email: this.state.selectedAuditor.email,
          password: values.password,
        }

        this.props.setAuditorNewPassword(responseData).then(() => {
          let messageObject = {
            type: 'success',
            message: 'SUCCESS',
            description: 'Password change successful',
          }

          if (this.props.updateUserPasswordErrorStatus) {
            messageObject = {
              type: 'error',
              message: 'SERVER ERROR',
              description: this.props.updateUserPasswordErrorMessage,
            }
          }

          this.setState({
            messageObject: messageObject,
            showMessage: true,
            isSpin: false,
          }, () => {
            setTimeout(() => {
              this.setState({
                showChangePasswordModal: false,
                messageObject: {},
                showMessage: false,
              })
            }, 5000)
          })
        })
      })
    })
  }

  handleCancelDelete = () => {
    this.setState({
      isVisibleConfirm: false,
      deleteUserData: null,
    })
  }

  renderDeleteUserConfirm = () => {
    const { translate } = this.props
    const { isVisibleConfirm, deleteUserData } = this.state

    return Modal.confirm({
      visible: isVisibleConfirm,
      title: translate('confirm_delete'),
      content: `${translate('confirm_delete_message_prefix')} "${deleteUserData.email}"`,
      keyboard: false,
      maskClosable: false,
      okText: translate('delete_button'),
      cancelText: translate('cancel_button'),
      onOk: () => this.props.deleteAuditor(deleteUserData.id).then(() => {
        this.loadAuditorsData()
      }),
      onCancel: () => this.handleCancelDelete(),
    })
  }


  handleChangePasswordClick = () => {
    this.setState({
      showChangePasswordModal: true,
    })
  }

  renderEditAuditorModal = () => {
    if (!this.state.selectedAuditor) {
      return null
    }
    return (
      <EditAuditorForm
        isVisible={this.state.showEditAuditorModal}
        onCancel={this.handleCloseEditAuditorForm}
        onCreate={this.handleSaveEditAuditorForm}
        auditorData={this.state.selectedAuditor}
        permissions={this.props.allPermissions}
        permissionKey={this.props.permissionKey}
        onChangePassword={this.handleChangePasswordClick}
      />
    )
  }

  renderEditAuditorPasswordModal = () => {
    if (!this.state.selectedAuditor) {
      return null
    }
    return (
      <EditAuditorPasswordForm
        isVisible={this.state.showChangePasswordModal}
        isSpin={this.state.isSpin}
        onCancel={this.handleCloseEditAuditorPasswordForm}
        onCreate={this.handleSaveEditAuditorPasswordForm}
        messageOptions={this.state.messageObject}
        messageOptionsIsVisible={this.state.showMessage}
      />
    )
  }

  render() {
    const { translate } = this.props

    return (
      <div className="components-grid-auditors">
        {this.renderEditAuditorModal()}
        {this.renderEditAuditorPasswordModal()}
        <Row>
          <Row>
            <Col span={24}>
              <Divider>{translate('auditors_list')}</Divider>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button onClick={() => this.refreshListOfAuditors()}>
                <Icon type="sync" style={{ color: '#3BA4E6' }} onClick={() => this.refreshListOfAuditors()} />
                <span>{translate('refresh_list_of_auditors')}</span>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                bordered
                rowKey='email'
                size="small"
                pagination={{ pageSize: 20 }}
                indentSize={150}
                columns={this.prepareTableColumns()}
                dataSource={this.prepareTableData()}
                // onChange={this.onChangeTable}
              />
            </Col>
          </Row>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({
                           navigationStore,
                           administrationStore,
                           permissionsStore,
                           localizationStore,
                           auth,
                         }) {
  return {
    defaultSelectedKey: navigationStore.defaultSelectedKey,
    auditors: administrationStore.auditors,
    allPermissions: permissionsStore.allPermissions,
    userInfo: auth.userInfo,
    permissionKey: localizationStore.permissionKey,
    updateUserPasswordErrorStatus: auth.updateUserPasswordErrorStatus,
    updateUserPasswordErrorMessage: auth.updateUserPasswordErrorMessage,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    getAuditors: bindActionCreators(getAuditors, dispatch),
    updateAuditor: bindActionCreators(updateAuditor, dispatch),
    deleteAuditor: bindActionCreators(deleteAuditor, dispatch),
    getAllPermissions: bindActionCreators(getAllPermissions, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
    setAuditorNewPassword: bindActionCreators(setAuditorNewPassword, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(AdministrationPage))
