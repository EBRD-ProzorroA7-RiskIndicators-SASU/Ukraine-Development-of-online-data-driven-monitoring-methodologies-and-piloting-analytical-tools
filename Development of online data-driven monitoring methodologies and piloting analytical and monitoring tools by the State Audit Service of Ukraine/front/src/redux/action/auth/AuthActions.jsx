import { CALL_API } from '../../../middleware/api'
import {apiEndpoints, OFFICES} from '../../../services/ApiEndpointsConstants'
import {
  LOGIN_USER,
  REGISTER_USER,
  RESET_SEND_EMAIL,
  RESET_CHECK_TOKEN,
  RESET_SAVE_NEW_PASSWORD,
  AUDITOR_UPDATE_PASSWORD,
} from '../../../services/ApiEndpointsConstants'
import * as Auth from './AuthConstants'
import {OFFICES_FAILED, OFFICES_SUCCESS, OFFICES_REQUEST} from "./AuthConstants";

export function loginUser(requestParams) {
  return {
    [CALL_API]: {
      config: {
        data: requestParams,
        method: 'post',
      },
      endpoint: apiEndpoints().entity(LOGIN_USER),
      types: [
        Auth.LOGIN_REQUEST,
        Auth.LOGIN_SUCCESS,
        Auth.LOGIN_FAILED,
      ],
    },
  }
}

export function clearLoginError() {
  return {
    type: Auth.LOGIN_CLEAR,
  }
}

export function registerUser(requestParams) {
  return {
    [CALL_API]: {
      config: {
        data: requestParams,
        method: 'post',
      },
      endpoint: apiEndpoints().entity(REGISTER_USER),
      types: [
        Auth.REGISTER_REQUEST,
        Auth.REGISTER_SUCCESS,
        Auth.REGISTER_FAILED,
      ],
    },
  }
}

export function logOutUser() {
  return {
    type: Auth.LOGOUT_USER,
  }
}
//
// export function resetSendEmail(email) {
//   return {
//     [CALL_API]: {
//       endpoint: `${apiEndpoints().entity(RESET_SEND_EMAIL)}${email}`,
//       types: [
//         Auth.RESET_SEND_EMAIL_REQUEST,
//         Auth.RESET_SEND_EMAIL_SUCCESS,
//         Auth.RESET_SEND_EMAIL_FAILED,
//       ],
//     },
//   }
// }

export function resetSendEmail(requestParams) {
  return {
    [CALL_API]: {
      config: {
        data: requestParams,
        method: 'post',
      },
      endpoint: apiEndpoints().entity(RESET_SEND_EMAIL),
      types: [
        Auth.RESET_SEND_EMAIL_REQUEST,
        Auth.RESET_SEND_EMAIL_SUCCESS,
        Auth.RESET_SEND_EMAIL_FAILED,
      ],
    },
  }
}

export function resetCheckToken(token) {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(RESET_CHECK_TOKEN)}${token}`,
      types: [
        Auth.RESET_CHECK_TOKEN_REQUEST,
        Auth.RESET_CHECK_TOKEN_SUCCESS,
        Auth.RESET_CHECK_TOKEN_FAILED,
      ],
    },
  }
}

export function resetSaveNewPass(requestParams) {
  return {
    [CALL_API]: {
      config: {
        data: requestParams,
        method: 'post',
      },
      endpoint: apiEndpoints().entity(RESET_SAVE_NEW_PASSWORD),
      types: [
        Auth.RESET_SAVE_NEW_PASSWORD_REQUEST,
        Auth.RESET_SAVE_NEW_PASSWORD_SUCCESS,
        Auth.RESET_SAVE_NEW_PASSWORD_FAILED,
      ],
    },
  }
}

export function setAuditorNewPassword(requestParams) {
  return {
    [CALL_API]: {
      config: {
        data: requestParams,
        method: 'post',
      },
      endpoint: apiEndpoints().entity(AUDITOR_UPDATE_PASSWORD),
      types: [
        Auth.AUDITOR_UPDATE_PASSWORD_REQUEST,
        Auth.AUDITOR_UPDATE_PASSWORD_SUCCESS,
        Auth.AUDITOR_UPDATE_PASSWORD_FAILED,
      ],
    },
  }
}

export function getOffices() {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(OFFICES)}`,
      types: [
        OFFICES_REQUEST,
        OFFICES_SUCCESS,
        OFFICES_FAILED,
      ],
    },
  }
}
