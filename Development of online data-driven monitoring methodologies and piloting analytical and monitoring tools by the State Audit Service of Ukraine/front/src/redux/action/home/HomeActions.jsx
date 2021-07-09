import { CALL_API } from '../../../middleware/api'
import {
  apiEndpoints,
  DASHBOARD_BASE_INFO,
  DASHBOARD_BASE_TOP_INFO,
  DASHBOARD_BASE_COUNT_BY_MONTH,
  DASHBOARD_BASE_AMOUNT_BY_MONTH,
  DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT,
  DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT,
  DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT,
  DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT,
  DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT,
  DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT,
  DASHBOARD_BASE_REGION_INDICATOR_COUNT,
  DASHBOARD_BASE_REGION_INDICATOR_AMOUNT,
  DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT,
  DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT,
} from '../../../services/ApiEndpointsConstants'
import * as HomeConstants from '../home/HomeConstants'

export function fetchDashboardBaseInfo(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_INFO),
      types: [
        HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_REQUEST,
        HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_SUCCESS,
        HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_FAILED,
      ],
    },
  }
}

export function fetchDashboardBaseTopInfo(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_INFO),
      types: [
        HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_REQUEST,
        HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_SUCCESS,
        HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_FAILED,
      ],
    },
  }
}

export function fetchDashboardCountByMonth(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_COUNT_BY_MONTH),
      types: [
        HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_REQUEST,
        HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_SUCCESS,
        HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_FAILED,
      ],
    },
  }
}

export function fetchDashboardAmountByMonth(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_AMOUNT_BY_MONTH),
      types: [
        HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_REQUEST,
        HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_SUCCESS,
        HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopMethodsByRiskTendersCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopMethodsByRiskTendersAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopRegionsByRiskTendersCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopRegionsByRiskTendersAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopOkgzByRiskTendersCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardTopOkgzByRiskTendersAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardRegionIndicatorCount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_REGION_INDICATOR_COUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardRegionIndicatorAmount(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_REGION_INDICATOR_AMOUNT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_FAILED,
      ],
    },
  }
}

export function fetchDashboardRegionIndicatorCountPercent(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_FAILED,
      ],
    },
  }
}

export function fetchDashboardRegionIndicatorAmountPercent(requestParams = {}) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT),
      types: [
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_REQUEST,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_SUCCESS,
        HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_FAILED,
      ],
    },
  }
}
