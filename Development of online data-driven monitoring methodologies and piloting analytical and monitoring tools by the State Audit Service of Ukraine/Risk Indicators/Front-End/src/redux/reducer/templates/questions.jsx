import * as TemplatesConstants from '../../action/templates/TemplatesConstants'

const initialState = {
  questionsByCategoryId: [],
  questionsByCategoryIdErrorMessage: '',
  questionsByCategoryIdIsFetching: false,
  saveQuestionData: {},
  saveQuestionIsFetching: false,
  saveQuestionErrorMessage: '',
  updateQuestionData: {},
  updateQuestionIsFetching: false,
  updateQuestionErrorMessage: '',
  deleteQuestionData: {},
  deleteQuestionIsFetching: false,
  deleteQuestionErrorMessage: '',
}

export default function questionsStore(state = initialState, action) {
  switch (action.type) {
    // GET QUESTIONS BY CATEGORY ID
    case TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_REQUEST:
      return {
        ...state,
        questionsByCategoryIdIsFetching: true,
      }

    case TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        questionsByCategoryId: action.data.questions,
        questionsByCategoryIdIsFetching: false,
      }

    case TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_FAILED:
      return {
        ...state,
        questionsByCategoryIdIsFetching: false,
        questionsByCategoryIdErrorMessage: action.errorMessage,
      }

    // SAVE NEW CATEGORY
    case TemplatesConstants.SAVE_QUESTION_REQUEST:
      return {
        ...state,
        saveQuestionIsFetching: true,
      }

    case TemplatesConstants.SAVE_QUESTION_SUCCESS:
      return {
        ...state,
        saveQuestionData: action.data,
        saveQuestionIsFetching: false,
      }

    case TemplatesConstants.SAVE_QUESTION_FAILED:
      return {
        ...state,
        saveQuestionIsFetching: false,
        saveQuestionErrorMessage: action.error.response.data.message,
      }

    case TemplatesConstants.SAVE_QUESTION_CLEAR:
      return {
        ...state,
        saveQuestionData: {},
        saveQuestionIsFetching: false,
        saveQuestionErrorMessage: '',
      }

    // UPDATE CATEGORY
    case TemplatesConstants.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        updateQuestionIsFetching: true,
      }

    case TemplatesConstants.UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        updateQuestionData: action.data,
        updateQuestionIsFetching: false,
      }

    case TemplatesConstants.UPDATE_QUESTION_FAILED:
      return {
        ...state,
        updateQuestionIsFetching: false,
        updateQuestionErrorMessage: action.errorMessage,
      }

    // UPDATE CATEGORY
    case TemplatesConstants.DELETE_QUESTION_REQUEST:
      return {
        ...state,
        deleteQuestionIsFetching: true,
      }

    case TemplatesConstants.DELETE_QUESTION_SUCCESS:
      return {
        ...state,
        deleteQuestionData: action.data,
        deleteQuestionIsFetching: false,
      }

    case TemplatesConstants.DELETE_QUESTION_FAILED:
      return {
        ...state,
        deleteQuestionIsFetching: false,
        deleteQuestionErrorMessage: action.errorMessage,
      }

    default:
      return state
  }
}