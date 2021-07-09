import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Input, Button, notification } from 'antd'
import { Email, Message, Letter, BackgroundLetter } from '../../assets/icons'
import { sendFeedbackQuestion } from '../../redux/actions/mainPageActions'
import './styles.scss'

const Questions = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const sendFeedbackQuestionSuccess = useSelector(state => state.mainPageData.sendFeedbackQuestionSuccess)
  const isLoading = useSelector(state => state.mainPageData.isLoading)
  const [showMessageStatus, setShowMessageStatus] = useState(false)

  useEffect(() => {
    if (showMessageStatus) {
      if (sendFeedbackQuestionSuccess) {
        notification.success({ message: 'Ваше повідомлення було успішно надіслано', duration: 5 })
        form.resetFields()
      } else {
        notification.error({ message: 'Виникла помилка. Спробуйте пізніше.', duration: 5 })
      }
      setShowMessageStatus(false)
    }
  }, [sendFeedbackQuestionSuccess, isLoading, showMessageStatus])

  const handleSubmitForm = (values) => {
    Promise.resolve(dispatch(sendFeedbackQuestion(values))).then(() => {
      setShowMessageStatus(true)
    })
  }

  const validatePhone = (rule, value, callback) => {
    if (value) {
      if (value.length > 2000) {
        callback('Повідомлення не може перевищувати 2000 символів')
      } else {
        callback()
      }
    } else {
      callback('Будь ласка введіть питання')
    }
  }

  return (
    <div className="questions-contaoner">
      <Row
        className='questions'
        justify="center"
      >
        <BackgroundLetter />
        <Col className="questions-content" xs={24} sm={11} md={11} lg={11} xl={10} xxl={11}>
          <div className="content">
            <h1 className="title">
              У разі виникнення запитань — напишіть нам
            </h1>
            <p className="description">
              Ми прагнемо покращувати нашу роботу і завжди раді зворотньому зв'язку. Тому, якщо ви бажаєте залишити
              відгук про інструмент — напишіть нам, заповнивши форму.
            </p>
          </div>
        </Col>
        <Col className="questions-form-wrapper" xs={24} sm={11} md={11} lg={11} xl={11} xxl={11}>
          <Form
            form={form}
            className="questions-form"
            name="questions-form"
            onFinish={handleSubmitForm}
          >
            <h4 className="form-title">
              Форма для відгуку
            </h4>
            <Form.Item
              name="from"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Будь ласка введіть електронну пошту',
                  whitespace: true,
                },
              ]}
            >
              <Input prefix={<Email className="email-icon" />} placeholder="Ваш e-mail:" />
            </Form.Item>

            <div className="questions-form-wrapper-group">
              <div className="questions-form-textarea">
                <Message className="message-icon" />
              </div>
              <div style={{ width: '100%' }}>
                <Form.Item
                  name="text"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      validator: validatePhone,
                    },
                  ]}
                >
                  {/*<Input prefix={<Message className="message-icon" />} placeholder="Вашe повідомлення:" />*/}
                  <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="Вашe повідомлення:" />
                </Form.Item>
              </div>
            </div>
            {/*<Form.Item*/}
            {/*  name="message"*/}
            {/*  rules={[*/}
            {/*    {*/}
            {/*      required: true,*/}
            {/*      message: 'Будь ласка введіть питання',*/}
            {/*      whitespace: true,*/}
            {/*    },*/}
            {/*    {*/}
            {/*      message: 'asdasd',*/}
            {/*      maxLength: 2000*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*>*/}
            {/*  /!*<Input prefix={<Message className="message-icon" />} placeholder="Вашe повідомлення:" />*!/*/}
            {/*  <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="Вашe повідомлення:" />*/}
            {/*</Form.Item>*/}
            <div className="button-wrapper">
              <Button htmlType="submit" className="send-message-button" icon={<Letter />}>
                Відправити
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Questions
