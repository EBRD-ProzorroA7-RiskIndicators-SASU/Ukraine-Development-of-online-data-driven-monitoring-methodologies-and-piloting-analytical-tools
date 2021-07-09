import * as ChecklistConstants from '../../action/checklists/ChecklistConstants'

const initialState = {
  allChecklistsData: [],
  allChecklistsDataIsFetching: false,
  allChecklistsDataErrorMessage: '',
  savedBuyerChecklistData: {},
  savedBuyerChecklistDataIsFetching: false,
  savedBuyerChecklistDataErrorMessage: '',
  calculatedChecklistScoreData: {},
  calculatedChecklistScoreDataIsFetching: false,
  calculatedChecklistScoreDataErrorMessage: '',
  checklistQuestionsData: {},
  checklistDataById: {},
  checklistDataByIdIsFetching: false,
  checklistDataByIdErrorMessage: '',
  checklistDataByIdHasError: false,
  searchedAuditNamesDataB: [],
  searchedAuditNamesDataIsFetching: false,
  searchedAuditNamesDataErrorMessage: '',
  searchedAuditorNamesData: [],
  searchedAuditorNamesDataIsFetching: false,
  searchedAuditorNamesDataErrorMessage: '',
  tenderDataForChecklist: [],
  tenderDataForChecklistIsFetching: false,
  tenderDataForChecklistErrorMessage: '',
  tenderChecklistScoreData: {},
  tenderChecklistScoreDataIsFetching: false,
  tenderChecklistScoreDataErrorMessage: '',
}

export default function checklistsStore(state = initialState, action) {
  switch (action.type) {
    case ChecklistConstants.CHANGE_CHECKLIST_QUESTIONS_DATA:
      return {
        ...state,
        checklistQuestionsData: action.data,
      }

    // SAVE BUYER CHECKLIST
    case ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_REQUEST:
      return {
        ...state,
        savedBuyerChecklistDataIsFetching: true,
      }
    case ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_SUCCESS:
      return {
        ...state,
        savedBuyerChecklistDataIsFetching: false,
        savedBuyerChecklistData: action.data,
      }
    case ChecklistConstants.SAVE_NEW_BUYER_CHECKLIST_FAILED:
      return {
        ...state,
        savedBuyerChecklistDataIsFetching: false,
        savedBuyerChecklistDataErrorMessage: action.errorMessage,
      }

    // CALCULATE CHECKLIST SCORE
    case ChecklistConstants.CALCULATE_CHECKLIST_SCORE_REQUEST:
      return {
        ...state,
        calculatedChecklistScoreDataIsFetching: true,
      }
    case ChecklistConstants.CALCULATE_CHECKLIST_SCORE_SUCCESS:
      return {
        ...state,
        calculatedChecklistScoreDataIsFetching: false,
        calculatedChecklistScoreData: action.data,
      }
    case ChecklistConstants.CALCULATE_CHECKLIST_SCORE_FAILED:
      return {
        ...state,
        calculatedChecklistScoreDataIsFetching: false,
        calculatedChecklistScoreDataErrorMessage: action.errorMessage,
      }
    case ChecklistConstants.CALCULATE_CHECKLIST_SCORE_CLEAR:
      return {
        ...state,
        calculatedChecklistScoreData: {},
        calculatedChecklistScoreDataErrorMessage: '',
      }

    // GET ALL CHECKLISTS
    case ChecklistConstants.GET_ALL_CHECKLISTS_REQUEST:
      return {
        ...state,
        allChecklistsDataIsFetching: true,
      }
    case ChecklistConstants.GET_ALL_CHECKLISTS_SUCCESS:
      return {
        ...state,
        allChecklistsDataIsFetching: false,
        allChecklistsData: action.data.checklists,
      }
    case ChecklistConstants.GET_ALL_CHECKLISTS_FAILED:
      return {
        ...state,
        allChecklistsDataIsFetching: false,
        allChecklistsDataErrorMessage: action.errorMessage,
      }

    // GET CHECKLIST BY ID
    case ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_REQUEST:
      return {
        ...state,
        checklistDataByIdHasError: false,
        checklistDataByIdIsFetching: true,
      }
    case ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_SUCCESS:
      return {
        ...state,
        checklistDataByIdHasError: false,
        checklistDataByIdIsFetching: false,
        checklistDataById: action.data,
      }
    case ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_FAILED:
      return {
        ...state,
        checklistDataByIdIsFetching: false,
        checklistDataByIdHasError: true,
        checklistDataByIdErrorMessage: action.error.response.data.error,
      }

    case ChecklistConstants.GET_CHECKLIST_DATA_BY_ID_CLEAR:
      return {
        ...state,
        checklistDataById: {},
        checklistDataByIdIsFetching: false,
        checklistDataByIdHasError: false,
        checklistDataByIdErrorMessage: '',
      }

// SEARCH AUDIT NAMES
    case ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_REQUEST:
      return {
        ...state,
        searchedAuditNamesDataIsFetching: true,
      }
    case ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_SUCCESS:
      return {
        ...state,
        searchedAuditNamesDataIsFetching: false,
        searchedAuditNamesData: action.data.auditNameDetails,
      }
    case ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_FAILED:
      return {
        ...state,
        searchedAuditNamesDataIsFetching: false,
        searchedAuditNamesDataErrorMessage: action.errorMessage,
      }
    case ChecklistConstants.GET_SEARCHED_AUDIT_NAMES_CLEAR:
      return {
        ...state,
        searchedAuditNamesData: [],
      }

// SEARCH AUDITOR NAMES
    case ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_REQUEST:
      return {
        ...state,
        searchedAuditorNamesDataIsFetching: true,
      }
    case ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_SUCCESS:
      return {
        ...state,
        searchedAuditorNamesDataIsFetching: false,
        searchedAuditorNamesData: action.data.auditorNameDetails,
      }
    case ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_FAILED:
      return {
        ...state,
        searchedAuditorNamesDataIsFetching: false,
        searchedAuditorNamesDataErrorMessage: action.errorMessage,
      }
    case ChecklistConstants.GET_SEARCHED_AUDITOR_NAMES_CLEAR:
      return {
        ...state,
        searchedAuditorNamesData: [],
      }

// GET TENDER CHECKLIST SCORE
    case ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_REQUEST:
      return {
        ...state,
        tenderChecklistScoreDataIsFetching: true,
      }
    case ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_SUCCESS:
      return {
        ...state,
        tenderChecklistScoreDataIsFetching: false,
        tenderChecklistScoreData: action.data,
      }
    case ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_FAILED:
      return {
        ...state,
        tenderChecklistScoreDataIsFetching: false,
        tenderChecklistScoreDataErrorMessage: action.errorMessage,
      }
    case ChecklistConstants.GET_CHECKLISTS_TENDER_CHECKLIST_SCORE_CLEAR:
      return {
        ...state,
        tenderChecklistScoreData: {},
      }

// SEARCH AUDIT NAMES
    case ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_REQUEST:
      return {
        ...state,
        tenderDataForChecklistIsFetching: true,
      }
    case ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_SUCCESS:
      return {
        ...state,
        tenderDataForChecklistIsFetching: false,
        tenderDataForChecklist: action.data.tenders,
      }
    case ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_FAILED:
      return {
        ...state,
        tenderDataForChecklistIsFetching: false,
        tenderDataForChecklistErrorMessage: action.errorMessage,
      }
    case ChecklistConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_CLEAR:
      return {
        ...state,
        tenderDataForChecklist: [],
      }


    default:
      return state
  }
}