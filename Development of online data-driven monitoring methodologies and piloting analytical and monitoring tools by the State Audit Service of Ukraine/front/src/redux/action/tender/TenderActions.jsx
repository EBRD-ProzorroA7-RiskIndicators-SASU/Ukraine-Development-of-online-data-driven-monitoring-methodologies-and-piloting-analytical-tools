import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  TENDER_CPV_SEARCH,
} from '../../../services/ApiEndpointsConstants'
import * as TenderConstants from './TenderConstants'

export function getCpvBySearch(cpv) {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(TENDER_CPV_SEARCH)}${cpv}`,
      types: [
        TenderConstants.TENDER_CPV_SEARCH_REQUEST,
        TenderConstants.TENDER_CPV_SEARCH_SUCCESS,
        TenderConstants.TENDER_CPV_SEARCH_FAILED,
      ],
    },
  }
}

export function clearCpvBySearch() {
  return (dispatch) => dispatch({
    type: TenderConstants.TENDER_CPV_SEARCH_CLEAR,
  })
}