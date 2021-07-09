import React, {Component} from 'react'
import {Form, Input, Modal, Select} from 'antd'

import PropTypes from 'prop-types'
import _ from "lodash";

class RegistrationForm extends Component {

    constructor() {
        super()
        this.state = {
            confirmDirty: false
        }
    }

    handleRegister = (event) => {
        event.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.form.resetFields()
                console.log(values)
                this.props.onCreate(values)
            }
        })
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('Два пароля які ви ввели, несумісні')
        } else {
            callback()
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true})
        }
        callback()
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({confirmDirty: this.state.confirmDirty || !!value})
    }

    onCancel = () => {
        const form = this.props.form
        form.resetFields()
        this.props.onCancel()
    }

    render() {
        const {Option} = Select;
        const {getFieldDecorator} = this.props.form

        return (
            <Modal
                title="Створення нового користувача"
                okText="Створити"
                cancelText="Вiдмiнити"
                visible={this.props.isVisible}
                onOk={this.handleRegister}
                onCancel={this.onCancel}
                keyboard={false}
                maskClosable={false}
            >
                <Form
                    layout="vertical"
                    prefixCls="add_new_user_"
                >
                    <Form.Item label="Найменування органу Держфінконтролю">
                        {getFieldDecorator('officeId', {
                            rules: [
                                {required: true, message: 'Офіс не може бути порожнім',},
                            ],
                        })(
                            <Select>
                                {_.map(this.props.offices, (office) => (
                                    <Option key={office.id}  value={office.id}>{office.name} </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Поштова адреса">
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    pattern : '^[A-Za-z0-9._%+-]+@dasu.gov.ua$',
                                    message: 'Вкажіть корпоративну пошту @dasu.gov.ua'},
                                {required: true, message: 'Поштова адреса не може бути порожньою'},
                                {type: 'email', message: ' ',},
                            ],
                        })(
                            <Input autoComplete="off"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="Пароль">
                        {getFieldDecorator('password', {
                            rules: [
                                {required: true, message: 'Пароль не може бути порожнім',},
                                {validator: this.validateToNextPassword,},
                            ],
                        })(
                            <Input type="password" autoComplete="off"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="Підтвердження пароля">
                        {getFieldDecorator('confirm', {
                            rules: [
                                {required: true, message: 'Підтвердження пароля не може бути порожнім'},
                                {validator: this.compareToFirstPassword,},
                            ],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} autoComplete="off"/>,
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

RegistrationForm.propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
}

export default Form.create({name: 'LoginForm'})(RegistrationForm)
