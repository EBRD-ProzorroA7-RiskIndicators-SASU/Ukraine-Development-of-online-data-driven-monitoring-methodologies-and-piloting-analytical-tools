import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  SEARCH_BUYERS,
} from '../../../services/ApiEndpointsConstants'
import * as BuyersConstants from './BuyersConstants'

export function getBuyersBySearch(cpv) {
  return {
    [CALL_API]: {
      endpoint: `${apiEndpoints().entity(SEARCH_BUYERS)}${cpv}`,
      types: [
        BuyersConstants.GET_BUYERS_BY_SEARCH_REQUEST,
        BuyersConstants.GET_BUYERS_BY_SEARCH_SUCCESS,
        BuyersConstants.GET_BUYERS_BY_SEARCH_FAILED,
      ],
    },
  }
}

export function clearBuyersBySearch() {
  return (dispatch) => dispatch({
    type: BuyersConstants.BUYERS_BY_SEARCH_CLEAR,
  })
}

