import { CALL_API } from '../../../middleware/api'
import {apiEndpoints, CHECKLISTS_UPDATE, PRIORITIZATION_TENDERS} from '../../../services/ApiEndpointsConstants'
import { exportToPdf } from '../export/ExportActions'
import {
  CHECKLISTS,
  CHECKLISTS_AUTO_SCORE,
  CHECKLISTS_SAVE,
  CHECKLISTS_BY_ID,
  CHECKLIST_EXPORT,
  SEARCH_AUDIT_BY_NAME,
  SEARCH_AUDITOR_BY_NAME,
  CHECKLISTS_AUTO_TENDERS_SCORE,
} from '../../../services/ApiEndpointsConstants'
import * as ChecklistConstants from './ChecklistConstants'

export function getAllChecklistsData(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CHECKLISTS),
      types: [
        ChecklistConstants.GET_ALL_CHECKLISTS_REQUEST,
        ChecklistConstants.GET_ALL_CHECKLISTS_SUCCESS,
        ChecklistConstants.GET_ALL_CHECKLISTS_FAILED,
      ],
    },
  }
}

export function deleteChecklistById(checklistId) {
  return {
    [CALL_API]: {
      config: { method: 'delete' },
      endpoint: apiEndpoints().entity(CHECKLISTS_BY_ID).replace('{id}', checklistId),
      types: [
        ChecklistConstants.DELETE_CHECKLIST_BY_ID_REQUEST,
        ChecklistConstants.DELETE_CHECKLIST_BY_ID_SUCCESS,
        ChecklistConstants.DELETE_CHECKLIST_BY_ID_FAILED,
      ],
    },
  }
}

export function getChecklistsDataById(checklistId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(CHECKLISTS_BY_ID).replace('{id}', checklistId),
      types: [
        ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_REQUEST,
        ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_SUCCESS,
        ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_FAILED,
      ],
    },
  }
}

export function clearChecklistsDataById() {
  return (dispatch) => dispatch({
    type: ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_CLEAR
  })
}

export function exportChecklistToPdf(requestParams = {}, checklistId, fileName, locale) {
  return dispatch => dispatch(
    exportToPdf(
      `${apiEndpoints().entity(CHECKLIST_EXPORT).replace('{id}', checklistId)}?locale=${locale.toUpperCase()}`,
      requestParams,
      fileName,
      'get',
    ),
  )
}

export function saveNewBuyerChecklist(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CHECKLISTS_SAVE),
      types: [
        ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_REQUEST,
        ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_SUCCESS,
        ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_FAILED,
      ],
    },
  }
}

export function updateChecklist(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CHECKLISTS_UPDATE),
      types: [
        ChecklistConstants.UPDATE_CHECKLIST_REQUEST,
        ChecklistConstants.UPDATE_CHECKLIST_SUCCESS,
        ChecklistConstants.UPDATE_CHECKLIST_FAILED,
      ],
    },
  }
}

export function calculateChecklistScore(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CHECKLISTS_AUTO_SCORE),
      types: [
        ChecklistConstants.CALCULATE_CHECKLIST_SCORE_REQUEST,
        ChecklistConstants.CALCULATE_CHECKLIST_SCORE_SUCCESS,
        ChecklistConstants.CALCULATE_CHECKLIST_SCORE_FAILED,
      ],
    },
  }
}

export function getAuditNamesSearch(auditName) {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(SEARCH_AUDIT_BY_NAME)}${auditName}`,
      types: [
        ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_REQUEST,
        ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_SUCCESS,
        ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_FAILED,
      ],
    },
  }
}

export function getAuditorNamesSearch(auditName = '') {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(SEARCH_AUDITOR_BY_NAME)}${auditName}`,
      types: [
        ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_REQUEST,
        ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_SUCCESS,
        ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_FAILED,
      ],
    },
  }
}

export function getChecklistTenderChecklistScore(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CHECKLISTS_AUTO_TENDERS_SCORE),
      types: [
        ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_REQUEST,
        ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_SUCCESS,
        ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_FAILED,
      ],
    },
  }
}

export function fetchPrioritizationTenderTableForChecklistData(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(PRIORITIZATION_TENDERS),
      types: [
        ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_REQUEST,
        ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_SUCCESS,
        ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_FAILED,
      ],
    },
  }
}

export function clearAuditNamesSearch() {
  return (dispatch) => dispatch({
    type: ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_CLEAR,
  })
}

export function changeChecklistQuestionsData(checklistQuestionsData) {
  return (dispatch) => dispatch({
    type: ChecklistConstants.CHANGE_CHECKLIST_QUESTIONS_DATA,
    data: checklistQuestionsData,
  })
}

export function ClearCalculatedChecklistScore() {
  return (dispatch) => dispatch({
    type: ChecklistConstants.CALCULATE_CHECKLIST_SCORE_CLEAR,
  })
}
