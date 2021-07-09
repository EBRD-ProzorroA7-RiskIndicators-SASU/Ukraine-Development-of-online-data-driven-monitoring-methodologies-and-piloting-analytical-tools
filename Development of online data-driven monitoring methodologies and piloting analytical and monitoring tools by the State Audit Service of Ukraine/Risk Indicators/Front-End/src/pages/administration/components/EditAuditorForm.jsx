import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Modal, Form, Input, Switch, Tree, Radio, Button } from 'antd'
import { EDIT_AUDITOR_FORM_NAME } from '../AdministrationPageConstats'
import { withTranslate } from 'react-redux-multilingual'

import './EditAuditorForm.css'

const { TreeNode } = Tree

class EditAuditorForm extends Component {
  constructor(props) {
    super(props)

    const { permissions, auditorData } = props
    let checkedKeys = []
    let accountStatus = !auditorData.disabled

    if (_.isEqual(permissions.length, auditorData.permissions.length)) {
      let checkedAll = _.cloneDeep(auditorData.permissions)
      checkedAll.push('permissions')
      checkedKeys = checkedAll
    } else if (!_.isEmpty(auditorData.permissions)) {
      checkedKeys = auditorData.permissions
    }

    this.state = {
      checkedKeys: checkedKeys,
      renderTree: false,
      accountStatus: accountStatus,
    }
  }

  componentDidMount() {
    this.setInitialValues()
  }

  setInitialValues = () => {
    const { form, auditorData } = this.props
    form.setFieldsValue({
      id: auditorData.id,
      name: auditorData.name,
      email: auditorData.email,
      disabled: !auditorData.disabled,
      permissions: auditorData.permissions[0],
    })
  }

  handleCreate = () => {
    this.props.onCreate(this.props.form)
  }

  preparePermissionTreeData = () => {
    const { translate, permissionKey } = this.props
    let permissionData = [
      {
        title: translate('user_type_name'),
        key: 'permissions',
        children: [],
      },
    ]

    _.forEach(this.props.permissions, (permission) => {
      permissionData[0].children.push({
        title: permission[permissionKey],
        key: permission.id,
      })
    })

    return permissionData

  }

  onCheck = (checkedKeys) => {
    const { form } = this.props
    form.setFieldsValue({ permissions: _.map(checkedKeys.filter((key) => (_.isInteger(parseInt(key, 10)))), (filteredKey) => (parseInt(filteredKey, 10))) })
    this.setState({ checkedKeys })
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item} selectable={false}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode {...item} selectable={false} />
  })

  preparePermissionsRadio = (permissionData) => {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      marginLeft: '30px',
    }

    let permissionComponent = []
    _.forEach(this.props.permissions, (permission) => {
      permissionComponent.push(<Radio style={radioStyle} value={permission.id}
                                      key={`radio_index_${permission.id}`}>{permission[this.props.permissionKey]}</Radio>)
      // permissionData[0].children.push({
      //   title: permission.description,
      //   key: permission.id,
      // })
    })

    return permissionComponent
  }

  handleChangeAccountStatus = (status) => {
    this.setState({
      accountStatus: status,
    })
  }

  render() {
    const {
      isVisible, onCancel, form, translate, auditorData,
    } = this.props

    const permissionData = this.preparePermissionTreeData()
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 10, className: 'label-container' },
      wrapperCol: { span: 14 },
    }

    return (
      <div>
        <Modal
          title={translate('edit_user_account_modal_title')}
          okText={translate('save_button')}
          cancelText={translate('cancel_button')}
          visible={isVisible}
          onOk={this.handleCreate}
          onCancel={onCancel}
          keyboard={false}
          maskClosable={false}
          width={620}
        >
          <Form
            layout="horizontal"
            prefixCls="add_new_template_"
          >
            <Form.Item label={translate('table_field_name')}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: translate('not_empty_field') }],
              })(
                <Input />,
              )}
            </Form.Item>
            <Form.Item label={translate('email')}>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: translate('not_empty_field') },
                  { type: 'email', message: translate('email_validate_error'), },
                ],
              })(
                <Input />,
              )}
            </Form.Item>
            <Form.Item
              label={this.state.accountStatus ? translate('user_active_status') : translate('user_not_active_status')} {...formItemLayout}
              className='switch-field-container'>
              {getFieldDecorator('disabled', {
                initialValue: auditorData.disabled,
                valuePropName: 'checked',
              })(
                <Switch onChange={this.handleChangeAccountStatus} />,
              )}
            </Form.Item>
            {/*{getFieldDecorator('permissions', { valuePropName: 'key' })(*/}
            {/*<Tree*/}
            {/*checkable*/}
            {/*defaultExpandAll*/}
            {/*onCheck={(chKeys) => this.onCheck(chKeys)}*/}
            {/*checkedKeys={this.state.checkedKeys}*/}
            {/*>*/}
            {/*{this.renderTreeNodes(permissionData)}*/}
            {/*</Tree>,*/}
            {/*)}*/}
            <Form.Item label={translate('user_type_name')}>
              {getFieldDecorator('permissions', {
                rules: [
                  { required: true, message: translate('not_empty_field') },
                ],
              })(
                <Radio.Group>
                  {this.preparePermissionsRadio(permissionData)}
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                onClick={((event) => this.props.onChangePassword(event))}
              >
                Змінити пароль
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

EditAuditorForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  auditorData: PropTypes.object,
  permissions: PropTypes.array,
  permissionKey: PropTypes.string,
  onChangePassword: PropTypes.func,
}

export default Form.create({ name: EDIT_AUDITOR_FORM_NAME })(withTranslate(EditAuditorForm))
