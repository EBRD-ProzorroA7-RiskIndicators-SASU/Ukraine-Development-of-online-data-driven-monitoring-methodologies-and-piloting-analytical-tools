import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  GET_AUDITORS,
  DELETE_AUDITOR,
  CALENDAR,
  AUDITOR_SETTINGS,
} from '../../../services/ApiEndpointsConstants'
import * as AdministrationConstants from './AdministrationConstants'

export function getAuditors() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(GET_AUDITORS),
      types: [
        AdministrationConstants.GET_AUDITORS_REQUEST,
        AdministrationConstants.GET_AUDITORS_SUCCESS,
        AdministrationConstants.GET_AUDITORS_FAILED,
      ],
    },
  }
}

export function updateAuditor(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'put' },
      endpoint: apiEndpoints().entity(GET_AUDITORS),
      types: [
        AdministrationConstants.UPDATE_AUDITOR_REQUEST,
        AdministrationConstants.UPDATE_AUDITOR_SUCCESS,
        AdministrationConstants.UPDATE_AUDITOR_FAILED,
      ],
    },
  }
}

export function deleteAuditor(auditorId) {
  return {
    [CALL_API]: {
      config: { method: 'delete' },
      endpoint: apiEndpoints().entity(DELETE_AUDITOR).replace('{id}', auditorId),
      types: [
        AdministrationConstants.DELETE_AUDITOR_REQUEST,
        AdministrationConstants.DELETE_AUDITOR_SUCCESS,
        AdministrationConstants.DELETE_AUDITOR_FAILED,
      ],
    },
  }
}

export function getCalendarDataByYear(year) {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(CALENDAR)}?year=${year}`,
      types: [
        AdministrationConstants.GET_CALENDAR_DATA_REQUEST,
        AdministrationConstants.GET_CALENDAR_DATA_SUCCESS,
        AdministrationConstants.GET_CALENDAR_DATA_FAILED,
      ],
    },
  }
}

export function saveCalendarData(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CALENDAR),
      types: [
        AdministrationConstants.SAVE_CALENDAR_DATA_REQUEST,
        AdministrationConstants.SAVE_CALENDAR_DATA_SUCCESS,
        AdministrationConstants.SAVE_CALENDAR_DATA_FAILED,
      ],
    },
  }
}

export function getAuditorSettings() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(AUDITOR_SETTINGS),
      types: [
        AdministrationConstants.GET_AUDITOR_SETTINGS_REQUEST,
        AdministrationConstants.GET_AUDITOR_SETTINGS_SUCCESS,
        AdministrationConstants.GET_AUDITOR_SETTINGS_FAILED,
      ],
    },
  }
}


export function saveAuditorSettings(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'put' },
      endpoint: apiEndpoints().entity(AUDITOR_SETTINGS),
      types: [
        AdministrationConstants.SAVE_AUDITOR_SETTINGS_REQUEST,
        AdministrationConstants.SAVE_AUDITOR_SETTINGS_SUCCESS,
        AdministrationConstants.SAVE_AUDITOR_SETTINGS_FAILED,
      ],
    },
  }
}

