import * as BuyersConstants from '../../action/buyer/BuyersConstants'

const initialState = {
  buyersBySearch: [],
  buyersBySearchIsFetching: false,
  buyersBySearchErrorMessage: '',
}

export default function buyerStore(state = initialState, action) {
  switch (action.type) {
    // GET ALL DICTIONARY
    case BuyersConstants.GET_BUYERS_BY_SEARCH_REQUEST:
      return {
        ...state,
        buyersBySearchIsFetching: true,
      }
    case BuyersConstants.GET_BUYERS_BY_SEARCH_SUCCESS:
      return {
        ...state,
        buyersBySearchIsFetching: false,
        buyersBySearch: action.data.buyers,
      }
    case BuyersConstants.GET_BUYERS_BY_SEARCH_FAILED:
      return {
        ...state,
        buyersBySearchIsFetching: false,
        buyersBySearchErrorMessage: action.errorMessage,
      }

// CLEAR BUYERS BY SEARCH
    case BuyersConstants.BUYERS_BY_SEARCH_CLEAR:
      return {
        ...state,
        buyersBySearch: [],
      }
    default:
      return state
  }
}