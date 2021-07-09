import * as HomeConstants from '../../action/home/HomeConstants'

const initialState = {
  dashboardBaseInfoData: {},
  dashboardBaseInfoDataIsFetching: false,
  dashboardBaseInfoDataErrorMessage: '',
  dashboardBaseTopInfoData: {},
  dashboardBaseTopInfoDataIsFetching: false,
  dashboardBaseTopInfoDataErrorMessage: '',
  dashboardBaseCountByMonth: {},
  dashboardBaseCountByMonthIsFetching: false,
  dashboardBaseCountByMonthErrorMessage: '',
  dashboardBaseAmountByMonth: {},
  dashboardBaseAmountByMonthIsFetching: false,
  dashboardBaseAmountByMonthErrorMessage: '',
  dashboardBaseTopMethodsByRiskTendersCount: {},
  dashboardBaseTopMethodsByRiskTendersCountIsFetching: false,
  dashboardBaseTopMethodsByRiskTendersCountErrorMessage: '',
  dashboardBaseTopMethodsByRiskTendersAmount: {},
  dashboardBaseTopMethodsByRiskTendersAmountIsFetching: false,
  dashboardBaseTopMethodsByRiskTendersAmountErrorMessage: '',
  dashboardBaseTopRegionsByRiskTendersCount: {},
  dashboardBaseTopRegionsByRiskTendersCountIsFetching: false,
  dashboardBaseTopRegionsByRiskTendersCountErrorMessage: '',
  dashboardBaseTopRegionsByRiskTendersAmount: {},
  dashboardBaseTopRegionsByRiskTendersAmountIsFetching: false,
  dashboardBaseTopRegionsByRiskTendersAmountErrorMessage: '',
  dashboardBaseTopOkgzByRiskTendersCount: {},
  dashboardBaseTopOkgzByRiskTendersCountIsFetching: false,
  dashboardBaseTopOkgzByRiskTendersCountErrorMessage: '',
  dashboardBaseTopOkgzByRiskTendersAmount: {},
  dashboardBaseTopOkgzByRiskTendersAmountIsFetching: false,
  dashboardBaseTopOkgzByRiskTendersAmountErrorMessage: '',
  dashboardBaseRegionIndicatorCount: {},
  dashboardBaseRegionIndicatorCountIsFetching: false,
  dashboardBaseRegionIndicatorCountErrorMessage: '',
  dashboardBaseRegionIndicatorAmount: {},
  dashboardBaseRegionIndicatorAmountIsFetching: false,
  dashboardBaseRegionIndicatorAmountErrorMessage: '',
  dashboardBaseRegionIndicatorCountPercent: {},
  dashboardBaseRegionIndicatorCountPercentIsFetching: false,
  dashboardBaseRegionIndicatorCountPercentErrorMessage: '',
  dashboardBaseRegionIndicatorAmountPercent: {},
  dashboardBaseRegionIndicatorAmountPercentIsFetching: false,
  dashboardBaseRegionIndicatorAmountPercentErrorMessage: '',

}

export default function homeStore(state = initialState, action) {
  switch (action.type) {
    case HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_REQUEST:
      return {
        ...state,
        dashboardBaseInfoDataIsFetching: true,
      }

    case HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_SUCCESS:
      return {
        ...state,
        dashboardBaseInfoData: action.data,
        dashboardBaseInfoDataIsFetching: false,
      }

    case HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_FAILED:
      return {
        ...state,
        dashboardBaseInfoDataIsFetching: false,
        dashboardBaseInfoDataErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_HOME_DASHBOARD_INFO_DATA_CLEAR:
      return {
        ...state,
        dashboardBaseInfoDataIsFetching: false,
        dashboardBaseInfoData: {},
        dashboardBaseInfoDataErrorMessage: '',
      }

    case HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_REQUEST:
      return {
        ...state,
        dashboardBaseTopInfoDataIsFetching: true,
      }

    case HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_SUCCESS:
      return {
        ...state,
        dashboardBaseTopInfoData: action.data,
        dashboardBaseTopInfoDataIsFetching: false,
      }

    case HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_FAILED:
      return {
        ...state,
        dashboardBaseTopInfoDataIsFetching: false,
        dashboardBaseTopInfoDataErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_HOME_DASHBOARD_TOP_INFO_DATA_CLEAR:
      return {
        ...state,
        dashboardBaseTopInfoDataIsFetching: false,
        dashboardBaseTopInfoData: {},
        dashboardBaseTopInfoDataErrorMessage: '',
      }

    case HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_REQUEST:
      return {
        ...state,
        dashboardBaseCountByMonthIsFetching: true,
      }

    case HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_SUCCESS:
      return {
        ...state,
        dashboardBaseCountByMonth: action.data.data,
        dashboardBaseCountByMonthIsFetching: false,
      }

    case HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_FAILED:
      return {
        ...state,
        dashboardBaseCountByMonthIsFetching: false,
        dashboardBaseCountByMonthErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_HOME_DASHBOARD_COUNT_BY_MONTH_CLEAR:
      return {
        ...state,
        dashboardBaseCountByMonthIsFetching: false,
        dashboardBaseCountByMonth: {},
        dashboardBaseCountByMonthErrorMessage: '',
      }

    case HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_REQUEST:
      return {
        ...state,
        dashboardBaseAmountByMonthIsFetching: true,
      }

    case HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_SUCCESS:
      return {
        ...state,
        dashboardBaseAmountByMonth: action.data.data,
        dashboardBaseAmountByMonthIsFetching: false,
      }

    case HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_FAILED:
      return {
        ...state,
        dashboardBaseAmountByMonthIsFetching: false,
        dashboardBaseAmountByMonthErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_HOME_DASHBOARD_AMOUNT_BY_MONTH_CLEAR:
      return {
        ...state,
        dashboardBaseAmountByMonthIsFetching: false,
        dashboardBaseAmountByMonth: {},
        dashboardBaseAmountByMonthErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersCountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersCount: action.data.data,
        dashboardBaseTopMethodsByRiskTendersCountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersCountIsFetching: false,
        dashboardBaseTopMethodsByRiskTendersCountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersCountIsFetching: false,
        dashboardBaseTopMethodsByRiskTendersCount: {},
        dashboardBaseTopMethodsByRiskTendersCountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersAmountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersAmount: action.data.data,
        dashboardBaseTopMethodsByRiskTendersAmountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersAmountIsFetching: false,
        dashboardBaseTopMethodsByRiskTendersAmountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopMethodsByRiskTendersAmountIsFetching: false,
        dashboardBaseTopMethodsByRiskTendersAmount: {},
        dashboardBaseTopMethodsByRiskTendersAmountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersCountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersCount: action.data.data,
        dashboardBaseTopRegionsByRiskTendersCountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersCountIsFetching: false,
        dashboardBaseTopRegionsByRiskTendersCountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersCountIsFetching: false,
        dashboardBaseTopRegionsByRiskTendersCount: {},
        dashboardBaseTopRegionsByRiskTendersCountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersAmountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersAmount: action.data.data,
        dashboardBaseTopRegionsByRiskTendersAmountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersAmountIsFetching: false,
        dashboardBaseTopRegionsByRiskTendersAmountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopRegionsByRiskTendersAmountIsFetching: false,
        dashboardBaseTopRegionsByRiskTendersAmount: {},
        dashboardBaseTopRegionsByRiskTendersAmountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersCountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersCount: action.data.data,
        dashboardBaseTopOkgzByRiskTendersCountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersCountIsFetching: false,
        dashboardBaseTopOkgzByRiskTendersCountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersCountIsFetching: false,
        dashboardBaseTopOkgzByRiskTendersCount: {},
        dashboardBaseTopOkgzByRiskTendersCountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersAmountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersAmount: action.data.data,
        dashboardBaseTopOkgzByRiskTendersAmountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_FAILED:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersAmountIsFetching: false,
        dashboardBaseTopOkgzByRiskTendersAmountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardBaseTopOkgzByRiskTendersAmountIsFetching: false,
        dashboardBaseTopOkgzByRiskTendersAmount: {},
        dashboardBaseTopOkgzByRiskTendersAmountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_REQUEST:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseRegionIndicatorCount: action.data.data,
        dashboardBaseRegionIndicatorCountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_FAILED:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountIsFetching: false,
        dashboardBaseRegionIndicatorCountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_CLEAR:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountIsFetching: false,
        dashboardBaseRegionIndicatorCount: {},
        dashboardBaseRegionIndicatorCountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmount: action.data.data,
        dashboardBaseRegionIndicatorAmountIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_FAILED:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountIsFetching: false,
        dashboardBaseRegionIndicatorAmountErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountIsFetching: false,
        dashboardBaseRegionIndicatorAmount: {},
        dashboardBaseRegionIndicatorAmountErrorMessage: '',
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_REQUEST:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountPercentIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_SUCCESS:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountPercent: action.data.data,
        dashboardBaseRegionIndicatorCountPercentIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_FAILED:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountPercentIsFetching: false,
        dashboardBaseRegionIndicatorCountPercentErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT_CLEAR:
      return {
        ...state,
        dashboardBaseRegionIndicatorCountPercentIsFetching: false,
        dashboardBaseRegionIndicatorCountPercent: {},
        dashboardBaseRegionIndicatorCountPercentErrorMessage: '',
      }
    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_REQUEST:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountPercentIsFetching: true,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_SUCCESS:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountPercent: action.data.data,
        dashboardBaseRegionIndicatorAmountPercentIsFetching: false,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_FAILED:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountPercentIsFetching: false,
        dashboardBaseRegionIndicatorAmountPercentErrorMessage: action.errorMessage,
      }

    case HomeConstants.GET_DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT_CLEAR:
      return {
        ...state,
        dashboardBaseRegionIndicatorAmountPercentIsFetching: false,
        dashboardBaseRegionIndicatorAmountPercent: {},
        dashboardBaseRegionIndicatorAmountPercentErrorMessage: '',
      }

    default:
      return state
  }
}