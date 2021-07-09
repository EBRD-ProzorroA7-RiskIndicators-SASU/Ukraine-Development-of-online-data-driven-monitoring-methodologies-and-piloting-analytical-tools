import * as AuthConstants from '../../action/auth/AuthConstants'
import jwt_decode from 'jwt-decode'

const initialState = {
  tokenIsFetching: false,
  token: localStorage.getItem('kg_risks_token') || null,
  userInfo: JSON.parse(localStorage.getItem('kg_risks_user_info')) || {},
  loginFailed: false,
  registrationUserData: {},
  registrationUserIsFetching: false,
  registrationUserErrorMessage: '',
  resetSendEmailData: {},
  resetSendEmailDataIsFetching: false,
  resetSendEmailDataErrorMessage: false,
  resetCheckTokenData: {},
  resetCheckTokenDataIsFetching: false,
  resetCheckTokenDataErrorStatus: false,
  resetCheckTokenDataErrorMessage: '',
  resetSavedPassData: {},
  resetSavedPassDataIsFetching: false,
  resetSavedPassDataErrorStatus: false,
  resetSavedPassDataErrorMessage: '',
  updateUserPasswordData: {},
  updateUserPasswordIsFetching: false,
  updateUserPasswordErrorStatus: false,
  updateUserPasswordErrorMessage: '',
  offices : []
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    // LOGIN
    case AuthConstants.LOGIN_REQUEST:
      return {
        ...state,
        tokenIsFetching: true,
      }

    case AuthConstants.LOGIN_SUCCESS:
      localStorage.setItem('kg_risks_token', action.headers.authorization)
      localStorage.setItem('kg_risks_user_info', JSON.stringify(jwt_decode(action.headers.authorization)))
      return {
        ...state,
        token: action.headers.authorization,
        userInfo: jwt_decode(action.headers.authorization),
        tokenIsFetching: false,
      }

    case AuthConstants.LOGIN_FAILED:
      return {
        ...state,
        tokenIsFetching: false,
        loginFailed: true,
      }

    case AuthConstants.LOGIN_CLEAR:
      return {
        ...state,
        tokenIsFetching: false,
        loginFailed: false,
      }

    // REGISTRATION
    case AuthConstants.REGISTER_REQUEST:
      return {
        ...state,
        registrationUserIsFetching: true,
      }

    case AuthConstants.REGISTER_SUCCESS:
      return {
        ...state,
        registrationUserData: action.data,
        registrationUserIsFetching: false,
      }

    case AuthConstants.REGISTER_FAILED:
      return {
        ...state,
        registrationUserIsFetching: false,
        registrationUserErrorMessage: true,
      }

    case AuthConstants.LOGOUT_USER:
      localStorage.removeItem('kg_risks_token')
      localStorage.removeItem('kg_risks_user_info')
      return {
        ...state,
        token: null,
        userInfo: {},
      }

    case AuthConstants.RESET_SEND_EMAIL_REQUEST:
      return {
        ...state,
        resetSendEmailDataIsFetching: true,
      }

    case AuthConstants.RESET_SEND_EMAIL_SUCCESS:
      return {
        ...state,
        resetSendEmailData: action.data,
        resetSendEmailDataIsFetching: false,
      }

    case AuthConstants.RESET_SEND_EMAIL_FAILED:
      return {
        ...state,
        resetSendEmailDataIsFetching: false,
        resetSendEmailDataErrorMessage: true,
      }

    case AuthConstants.RESET_SEND_EMAIL_CLEAR:
      return {
        ...state,
        resetSendEmailData: {},
        resetSendEmailDataIsFetching: false,
        resetSendEmailDataErrorMessage: false,
      }

    case AuthConstants.RESET_SAVE_NEW_PASSWORD_REQUEST:
      return {
        ...state,
        resetSavedPassDataIsFetching: true,
      }

    case AuthConstants.RESET_SAVE_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        resetSavedPassData: action.data,
        resetSavedPassDataIsFetching: false,
      }

    case AuthConstants.RESET_SAVE_NEW_PASSWORD_FAILED:
      return {
        ...state,
        resetSavedPassDataIsFetching: false,
        resetSavedPassDataErrorStatus: true,
        resetSavedPassDataErrorMessage: action.error.response.data.message,
      }

    case AuthConstants.RESET_SAVE_NEW_PASSWORD_CLEAR:
      return {
        ...state,
        resetSavedPassData: {},
        resetSavedPassDataIsFetching: false,
        resetSavedPassDataErrorStatus: false,
        resetSavedPassDataErrorMessage: '',
      }

    case AuthConstants.AUDITOR_UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        updateUserPasswordIsFetching: true,
      }

    case AuthConstants.AUDITOR_UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        updateUserPassword: action.data,
        updateUserPasswordIsFetching: false,
      }

    case AuthConstants.AUDITOR_UPDATE_PASSWORD_FAILED:
      return {
        ...state,
        updateUserPasswordIsFetching: false,
        updateUserPasswordErrorStatus: true,
        updateUserPasswordErrorMessage: action.error.response.data.message,
      }

    case AuthConstants.AUDITOR_UPDATE_PASSWORD_CLEAR:
      return {
        ...state,
        updateUserPassword: {},
        updateUserPasswordIsFetching: false,
        updateUserPasswordErrorStatus: false,
        updateUserPasswordErrorMessage: '',
      }

    case AuthConstants.RESET_CHECK_TOKEN_REQUEST:
      return {
        ...state,
        resetCheckTokenDataIsFetching: true,
      }

    case AuthConstants.RESET_CHECK_TOKEN_SUCCESS:
      return {
        ...state,
        resetCheckTokenData: action.data,
        resetCheckTokenDataIsFetching: false,
      }

    case AuthConstants.RESET_CHECK_TOKEN_FAILED:
      return {
        ...state,
        resetCheckTokenDataIsFetching: false,
        resetCheckTokenDataErrorStatus: true,
        resetCheckTokenDataErrorMessage: action.error.response.data.message,
      }

    case AuthConstants.RESET_CHECK_TOKEN_CLEAR:
      return {
        ...state,
        resetCheckTokenData: {},
        resetCheckTokenDataIsFetching: false,
        resetCheckTokenDataErrorStatus: false,
        resetCheckTokenDataErrorMessage: '',
      }

    case AuthConstants.OFFICES_SUCCESS:
      return {
        ...state,
        offices: action.data.offices
      }

    default:
      return state
  }
}
