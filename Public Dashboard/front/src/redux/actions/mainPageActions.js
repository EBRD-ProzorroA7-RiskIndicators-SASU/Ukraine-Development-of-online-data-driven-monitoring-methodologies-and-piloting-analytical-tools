import {
  GET_DATA_FOR_MAIN_PAGE_REQUEST,
  GET_DATA_FOR_MAIN_PAGE_SUCCESS,
  GET_DATA_FOR_MAIN_PAGE_ERROR,
  SEND_FEEDBACK_QUESTION_REQUEST,
  SEND_FEEDBACK_QUESTION_SUCCESS,
  SEND_FEEDBACK_QUESTION_ERROR,
} from '../constants'

import { RSAA } from 'redux-api-middleware'
import { BASE_URL, HOME, SEND_FEEDBACK_QUESTION } from '../../api/constants'

export const getDataForMainPage = () => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${HOME}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_MAIN_PAGE_REQUEST,
        GET_DATA_FOR_MAIN_PAGE_SUCCESS,
        GET_DATA_FOR_MAIN_PAGE_ERROR,
      ],
    },
  }
}

export const sendFeedbackQuestion = (questionData) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${SEND_FEEDBACK_QUESTION}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
      types: [
        SEND_FEEDBACK_QUESTION_REQUEST,
        SEND_FEEDBACK_QUESTION_SUCCESS,
        SEND_FEEDBACK_QUESTION_ERROR,
      ],
    },
  }
}
