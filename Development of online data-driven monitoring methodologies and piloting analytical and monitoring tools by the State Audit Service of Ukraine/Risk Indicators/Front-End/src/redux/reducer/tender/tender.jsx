import * as TenderConstants from '../../action/tender/TenderConstants'

const initialState = {
  cpvBySearch: [],
  cpvBySearchIsFetching: false,
  cpvBySearchErrorMessage: '',
}

export default function tenderStore(state = initialState, action) {
  switch (action.type) {
    // GET ALL DICTIONARY
    case TenderConstants.TENDER_CPV_SEARCH_REQUEST:
      return {
        ...state,
        cpvBySearchIsFetching: true,
      }
    case TenderConstants.TENDER_CPV_SEARCH_SUCCESS:
      return {
        ...state,
        cpvBySearchIsFetching: false,
        cpvBySearch: action.data.okgz,
      }
    case TenderConstants.TENDER_CPV_SEARCH_FAILED:
      return {
        ...state,
        cpvBySearchIsFetching: false,
        cpvBySearchErrorMessage: action.errorMessage,
      }

// CLEAR TENDER CPV BY SEARCH
    case TenderConstants.TENDER_CPV_SEARCH_CLEAR:
      return {
        ...state,
        cpvBySearch: [],
      }
    default:
      return state
  }
}