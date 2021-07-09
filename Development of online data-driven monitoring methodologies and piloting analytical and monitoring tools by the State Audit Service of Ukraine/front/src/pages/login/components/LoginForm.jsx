import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {clearLoginError, loginUser, registerUser, resetSendEmail, getOffices} from '../../../redux/action/auth/AuthActions'
import {Button, Form, Icon, Input, message} from 'antd'
import RegistrationForm from './RegistrationForm'

import './LoginForm.css'
import ResetSendEmailForm from './ResetSendEmailForm'

class LoginForm extends Component {
    constructor() {
        super()

        this.state = {
            showRegistrationModal: false,
            showResetSendEmailModal: false,
            showError: true,
        }
    }

    componentDidMount() {
        this.props.getOffices()
    }

    componentWillUnmount() {
        this.props.clearLoginError()
        message.destroy()
    }

    showRegistrationModal = () => {
        this.setState({
            showRegistrationModal: true,
        })
    }

    showRestoreSendEmailModal = () => {
        this.setState({
            showResetSendEmailModal: true,
        })
    }

    handleCloseRegistrationModal = () => {
        this.setState({
            showRegistrationModal: false,
        })
    }

    handleRegisterUser = (values) => {
        delete values.confirm
        Promise.resolve(this.props.registerUser(values).then(() => {
            this.setState({
                showRegistrationModal: false,
            });

        })).then(() => {
            console.log('-=resetSendEmailDataErrorMessage=-', this.props.resetSendEmailDataErrorMessage)
        })
    }

    handleCloseResetSendEmailModal = () => {
        this.setState({
            showResetSendEmailModal: false,
        })
    }

    handleResetSendEmailUser = (values) => {
        delete values.confirm

        let requestData = {
            email: values.email,
            path: window.location.origin,
        }

        this.props.resetSendEmail(requestData).then(() => {
            this.setState({
                showResetSendEmailModal: false,
            })
        })
    }

    renderRegistrationModal = () => {
        return (
            <RegistrationForm
                offices = { this.props.offices}
                isVisible={this.state.showRegistrationModal}
                onCancel={this.handleCloseRegistrationModal}
                onCreate={this.handleRegisterUser}
            />
        )
    }

    renderResetSendEmailModal = () => {
        return (
            <ResetSendEmailForm
                isVisible={this.state.showResetSendEmailModal}
                onCancel={this.handleCloseResetSendEmailModal}
                onCreate={this.handleResetSendEmailUser}
            />
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.loginUser(values)
            }
        })
    }

    changeShowErrorToFalse = () => {
        this.setState({
            showError: false,
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form

        return (
            <div>
                {this.renderRegistrationModal()}
                {this.renderResetSendEmailModal()}
                {(this.props.loginFailed && this.state.showError) && (message.error('"Неправильне ім\'я користувача або пароль"', 0) && this.changeShowErrorToFalse())}
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{required: true, message: 'Будь ласка введіть адресу електронної пошти'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Почтовый адрес"/>,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Будь ласка, введіть пароль'}],
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                   placeholder="Пароль"/>,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Вхiд
                        </Button>
                        <Button htmlType="button" className="login-form-button" onClick={this.showRegistrationModal}>
                            Реєстрація
                        </Button>
                        <Button htmlType="button" className="login-form-button"
                                onClick={this.showRestoreSendEmailModal}>
                            Забули пароль ?
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({
                             auth,
                         }) {
    return {
        loginFailed: auth.loginFailed,
        resetSendEmailDataErrorMessage: auth.resetSendEmailDataErrorMessage,
        offices : auth.offices
    }
}

function mapDispatchToProps(dispatch) {
    return {
        registerUser: bindActionCreators(registerUser, dispatch),
        loginUser: bindActionCreators(loginUser, dispatch),
        clearLoginError: bindActionCreators(clearLoginError, dispatch),
        resetSendEmail: bindActionCreators(resetSendEmail, dispatch),
        getOffices: bindActionCreators(getOffices, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form.create({name: 'LoginForm'})(LoginForm))
