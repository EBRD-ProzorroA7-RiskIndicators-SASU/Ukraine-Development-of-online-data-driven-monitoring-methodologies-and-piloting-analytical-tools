import {CALL_API} from '../../../middleware/api'
import {apiEndpoints, BUYER_MANAGE_ADMINISTRATION} from '../../../services/ApiEndpointsConstants'
import * as BuyerManageConstants from './BuyerManageConstants'

export function updateBuyers(requestParams) {
    return {
        [CALL_API]: {
            config: {data: requestParams, method: 'put'},
            endpoint: apiEndpoints().entity(BUYER_MANAGE_ADMINISTRATION),
            types: [
                BuyerManageConstants.UPDATE_BUYERS_REQUEST,
                BuyerManageConstants.UPDATE_BUYERS_SUCCESS,
                BuyerManageConstants.UPDATE_BUYERS_FAILED,
            ],
        },
    }
}

export function searchBuyers(requestParams) {
    return {
        [CALL_API]: {
            config: {data: requestParams, method: 'post'},
            endpoint: apiEndpoints().entity(BUYER_MANAGE_ADMINISTRATION),
            types: [
                BuyerManageConstants.SEARCH_BUYERS_REQUEST,
                BuyerManageConstants.SEARCH_BUYERS_SUCCESS,
                BuyerManageConstants.SEARCH_BUYERS_FAILED,
            ],
        },
    }
}