import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  PRIORITIZATION_TENDERS,
  PRIORITIZATION_BUYERS,
  INDICATOR_BY_TENDER_ID,
  EXPORT_BUYERS,
  EXPORT_TENDERS,
  DASHBOARD_BUYER_INFO,
  DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT,
  DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT,
  DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT,
  DASHBOARD_TENDER_INFO,
  DASHBOARD_TENDER_METOD_INDICATOR_AMOUNT,
  DASHBOARD_TENDER_METOD_INDICATOR_COUNT,
  DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_BY_METHOD,
  DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD,
  DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH,
  DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH,
  DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_AMOUNT,
  DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_COUNT,
  DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT,
  DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT,
  FILTER_INDICATOR_BUYER,
  FILTER_INDICATOR_TENDER,
} from '../../../services/ApiEndpointsConstants'
import { exportToExcel, exportToPdf } from '../export/ExportActions'
import * as PrioritizationConstants from './PrioritizationConstants'

export function setRequestParamsByFilter(filterParams) {
  return (dispatch) => dispatch({
    type: PrioritizationConstants.SET_REQUEST_PARAMS_BY_FILTER,
    data: filterParams,
  })
}

export function fetchPrioritizationTenderTableData(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(PRIORITIZATION_TENDERS),
      types: [
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_REQUEST,
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_SUCCESS,
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_FAILED,
      ],
    },
  }
}

export function fetchPrioritizationTenderTableDataByBuyerId(buyerId) {
  return {
    [CALL_API]: {
      config: { data: { buyerId: buyerId }, method: 'post' },
      endpoint: apiEndpoints().entity(PRIORITIZATION_TENDERS),
      types: [
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_REQUEST,
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_SUCCESS,
        PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_FAILED,
      ],
    },
  }
}

export function fetchPrioritizationBuyerTableData(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(PRIORITIZATION_BUYERS),
      types: [
        PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_REQUEST,
        PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_SUCCESS,
        PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_FAILED,
      ],
    },
  }
}

export function fetchIndicatorsDataByTenderId(tenderId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(INDICATOR_BY_TENDER_ID).replace('{tenderId}', tenderId),
      types: [
        PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_REQUEST,
        PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_SUCCESS,
        PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_FAILED,
      ],
    },
  }
}

export function exportTendersToExcel(requestParams, fileName) {
  return dispatch => dispatch(
    exportToExcel(
      apiEndpoints().entity(EXPORT_TENDERS),
      requestParams,
      fileName,
    ),
  )
}

export function exportBuyersToExcel(requestParams, fileName) {
  return dispatch => dispatch(
    exportToExcel(
      apiEndpoints().entity(EXPORT_BUYERS),
      requestParams,
      fileName,
    ),
  )
}

export function exportTendersToPDF(requestParams, fileName) {
  return dispatch => dispatch(
    exportToPdf(
      apiEndpoints().entity(EXPORT_TENDERS),
      requestParams,
      fileName,
    ),
  )
}

export function exportBuyersToPDF(requestParams, fileName) {
  return dispatch => dispatch(
    exportToPdf(
      apiEndpoints().entity(EXPORT_BUYERS),
      requestParams,
      fileName,
    ),
  )
}

//DASHBOARD ACTIONS
export function fetchDashboardBuyerInfo(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BUYER_INFO),
      types: [
        PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_FAILED,
        PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_CLEAR,
      ],
    },
  }
}

export function fetchBuyerTopByIndicatorsCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_CLEAR,
      ],
    },
  }
}

export function fetchBuyerTopByRiskTendersAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_CLEAR,
      ],
    },
  }
}

export function fetchBuyerTopByRiskTendersCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_CLEAR,
      ],
    },
  }
}

export function fetchDashboardTenderInfo(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_INFO),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_CLEAR,
      ],
    },
  }
}


export function fetchTenderMethodIndicatorAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_METOD_INDICATOR_AMOUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_CLEAR,
      ],
    },
  }
}

export function fetchTenderMethodIndicatorCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_METOD_INDICATOR_COUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_CLEAR,
      ],
    },
  }
}

export function fetchTenderRiskTendersAmountInfoByMethod(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_BY_METHOD),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_CLEAR,
      ],
    },
  }
}

export function fetchTenderRiskTendersCountInfoByMethod(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_CLEAR,
      ],
    },
  }
}

export function fetchTenderTendersAmountInfoByMonth(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_CLEAR,
      ],
    },
  }
}

export function fetchTenderTendersCountInfoByMonth(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_CLEAR,
      ],
    },
  }
}

export function fetchTenderTopOkgzByRiskTendersAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_AMOUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_CLEAR,
      ],
    },
  }
}

export function fetchTenderTopOkgzByRiskTendersCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_COUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_CLEAR,
      ],
    },
  }
}

export function fetchTenderTopRiskTendersByAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_CLEAR,
      ],
    },
  }
}

export function fetchTenderTopTendersByIndicatorCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT),
      types: [
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_REQUEST,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_SUCCESS,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_FAILED,
        PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_CLEAR,
      ],
    },
  }
}

export function fetchAvailableIndicatorsForBuyerFilter(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(FILTER_INDICATOR_BUYER),
      types: [
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_REQUEST,
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_SUCCESS,
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_FAILED,
      ],
    },
  }
}

export function fetchAvailableIndicatorsForTenderFilter(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(FILTER_INDICATOR_TENDER),
      types: [
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_REQUEST,
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_SUCCESS,
        PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_FAILED,
      ],
    },
  }
}
