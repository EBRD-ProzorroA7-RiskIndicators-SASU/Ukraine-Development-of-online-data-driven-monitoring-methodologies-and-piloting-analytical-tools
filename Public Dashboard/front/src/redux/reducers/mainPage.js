import {
  GET_DATA_FOR_MAIN_PAGE_REQUEST,
  GET_DATA_FOR_MAIN_PAGE_ERROR,
  GET_DATA_FOR_MAIN_PAGE_SUCCESS,
  SEND_FEEDBACK_QUESTION_REQUEST,
  SEND_FEEDBACK_QUESTION_SUCCESS,
  SEND_FEEDBACK_QUESTION_ERROR,
} from '../constants'

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  sendFeedbackQuestionSuccess: false,
  sendFeedbackQuestionHasErrors: false,
  data: null,
}

export const mainPageData = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_DATA_FOR_MAIN_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      }

    case GET_DATA_FOR_MAIN_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      }

    case GET_DATA_FOR_MAIN_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        data: payload,
      }

    case SEND_FEEDBACK_QUESTION_REQUEST:
      return {
        ...state,
        isLoading: true,
        sendFeedbackQuestionSuccess: false,
        sendFeedbackQuestionHasErrors: false,
      }

    case SEND_FEEDBACK_QUESTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        sendFeedbackQuestionSuccess: true,
        sendFeedbackQuestionHasErrors: false,
      }

    case SEND_FEEDBACK_QUESTION_ERROR:
      return {
        ...state,
        isLoading: false,
        sendFeedbackQuestionSuccess: false,
        sendFeedbackQuestionHasErrors: true,
      }

    default:
      return state
  }
}