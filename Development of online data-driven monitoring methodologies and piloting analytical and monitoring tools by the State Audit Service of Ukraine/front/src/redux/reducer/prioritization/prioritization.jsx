import * as PrioritizationConstants from '../../action/prioritization/PrioritizationConstants'

const initialState = {
  filterRequestBody: {},
  tenderTableData: [],
  tenderTableIsFetching: false,
  tenderTableErrorMessage: '',
  tenderTableDataByBuyerId: [],
  tenderTableByBuyerIdIsFetching: false,
  tenderTableByBuyerIdErrorMessage: '',
  buyerTableData: [],
  buyerTableIsFetching: false,
  buyerTableErrorMessage: '',
  indicatorsByTenderIdData: [],
  indicatorsByTenderIdIsFetching: false,
  indicatorsByTenderIdErrorMessage: '',
  //Info and Chart data
  //Buyer Info
  dashboardBuyerInfoData: {},
  dashboardBuyerInfoDataIsFetching: false,
  dashboardBuyerInfoDataErrorMessage: '',
  dashboardBuyerTopByIndicatorsCount: {},
  dashboardBuyerTopByIndicatorsCountIsFetching: false,
  dashboardBuyerTopByIndicatorsCountErrorMessage: '',
  dashboardBuyerTopByRiskTendersAmount: {},
  dashboardBuyerTopByRiskTendersAmountIsFetching: false,
  dashboardBuyerTopByRiskTendersAmountErrorMessage: '',
  dashboardBuyerTopByRiskTendersCount: {},
  dashboardBuyerTopByRiskTendersCountIsFetching: false,
  dashboardBuyerTopByRiskTendersCountErrorMessage: '',
  //Tender Info
  dashboardTenderInfoData: {},
  dashboardTenderInfoDataIsFetching: false,
  dashboardTenderInfoDataErrorMessage: '',
  dashboardTenderMethodIndicatorAmount: {},
  dashboardTenderMethodIndicatorAmountIsFetching: false,
  dashboardTenderMethodIndicatorAmountErrorMessage: '',
  dashboardTenderMethodIndicatorCount: {},
  dashboardTenderMethodIndicatorCountIsFetching: false,
  dashboardTenderMethodIndicatorCountErrorMessage: '',
  dashboardTenderRiskTendersAmountInfoByMethod: {},
  dashboardTenderRiskTendersAmountInfoByMethodIsFetching: false,
  dashboardTenderRiskTendersAmountInfoByMethodErrorMessage: '',
  dashboardTenderRiskTendersCountInfoByMethod: {},
  dashboardTenderRiskTendersCountInfoByMethodIsFetching: false,
  dashboardTenderRiskTendersCountInfoByMethodErrorMessage: '',
  dashboardTenderTendersAmountInfoByMonth: {},
  dashboardTenderTendersAmountInfoByMonthIsFetching: false,
  dashboardTenderTendersAmountInfoByMonthErrorMessage: '',
  dashboardTenderTendersCountInfoByMonth: {},
  dashboardTenderTendersCountInfoByMonthIsFetching: false,
  dashboardTenderTendersCountInfoByMonthErrorMessage: '',
  dashboardTenderTopOkgzByRiskTendersAmount: {},
  dashboardTenderTopOkgzByRiskTendersAmountIsFetching: false,
  dashboardTenderTopOkgzByRiskTendersAmountErrorMessage: '',
  dashboardTenderTopOkgzByRiskTendersCount: {},
  dashboardTenderTopOkgzByRiskTendersCountIsFetching: false,
  dashboardTenderTopOkgzByRiskTendersCountErrorMessage: '',
  dashboardTenderTopRiskTendersByAmount: {},
  dashboardTenderTopRiskTendersByAmountIsFetching: false,
  dashboardTenderTopRiskTendersByAmountErrorMessage: '',
  dashboardTenderTopTendersByIndicatorCount: {},
  dashboardTenderTopTendersByIndicatorCountIsFetching: false,
  dashboardTenderTopTendersByIndicatorCountErrorMessage: '',
  availableIndicatorsForBuyerFilter: [],
  availableIndicatorsForBuyerFilterIsFetching: false,
  availableIndicatorsForBuyerFilterErrorMessage: '',
  availableIndicatorsForTenderFilter: [],
  availableIndicatorsForTenderFilterIsFetching: false,
  availableIndicatorsForTenderFilterErrorMessage: '',

}

export default function prioritizationStore(state = initialState, action) {
  switch (action.type) {
    // GET TENDERS
    case PrioritizationConstants.SET_REQUEST_PARAMS_BY_FILTER:
      return {
        ...state,
        filterRequestBody: action.data,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_REQUEST:
      return {
        ...state,
        tenderTableIsFetching: true,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_SUCCESS:
      return {
        ...state,
        tenderTableData: action.data.tenders,
        tenderTableIsFetching: false,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_FAILED:
      return {
        ...state,
        tenderTableIsFetching: false,
        tenderTableErrorMessage: action.errorMessage,
      }

    // GET TENDERS
    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_REQUEST:
      return {
        ...state,
        tenderTableByBuyerIdIsFetching: true,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_SUCCESS:
      return {
        ...state,
        tenderTableDataByBuyerId: action.data.tenders,
        tenderTableByBuyerIdIsFetching: false,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_TENDER_TABLE_DATA_BY_BUYER_ID_FAILED:
      return {
        ...state,
        tenderTableByBuyerIdIsFetching: false,
        tenderTableByBuyerIdErrorMessage: action.errorMessage,
      }

    // GET BUYERS
    case PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_REQUEST:
      return {
        ...state,
        buyerTableIsFetching: true,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_SUCCESS:
      return {
        ...state,
        buyerTableData: action.data.buyers,
        buyerTableIsFetching: false,
      }

    case PrioritizationConstants.GET_PRIORITIZATION_BUYER_TABLE_DATA_FAILED:
      return {
        ...state,
        buyerTableIsFetching: false,
        buyerTableErrorMessage: action.errorMessage,
      }

    // GET INDICATORS BY TENDER ID
    case PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_REQUEST:
      return {
        ...state,
        indicatorsByTenderIdIsFetching: true,
      }

    case PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_SUCCESS:
      return {
        ...state,
        indicatorsByTenderIdData: action.data.indicators,
        indicatorsByTenderIdIsFetching: false,
      }

    case PrioritizationConstants.GET_INDICATORS_DATA_BY_TENDER_ID_FAILED:
      return {
        ...state,
        indicatorsByTenderIdIsFetching: false,
        indicatorsByTenderIdErrorMessage: action.errorMessage,
      }

//DASHBOARD BUYER DATA

    case PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_REQUEST:
      return {
        ...state,
        dashboardBuyerInfoDataIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_SUCCESS:
      return {
        ...state,
        dashboardBuyerInfoData: action.data,
        dashboardBuyerInfoDataIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_FAILED:
      return {
        ...state,
        dashboardBuyerInfoDataIsFetching: false,
        dashboardBuyerInfoDataErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_INFO_CLEAR:
      return {
        ...state,
        dashboardBuyerInfoDataIsFetching: false,
        dashboardBuyerInfoData: {},
        dashboardBuyerInfoDataErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_REQUEST:
      return {
        ...state,
        dashboardBuyerTopByIndicatorsCountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBuyerTopByIndicatorsCount: action.data.data,
        dashboardBuyerTopByIndicatorsCountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_FAILED:
      return {
        ...state,
        dashboardBuyerTopByIndicatorsCountIsFetching: false,
        dashboardBuyerTopByIndicatorsCountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT_CLEAR:
      return {
        ...state,
        dashboardBuyerTopByIndicatorsCountIsFetching: false,
        dashboardBuyerTopByIndicatorsCount: {},
        dashboardBuyerTopByIndicatorsCountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersAmountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersAmount: action.data.data,
        dashboardBuyerTopByRiskTendersAmountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_FAILED:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersAmountIsFetching: false,
        dashboardBuyerTopByRiskTendersAmountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersAmountIsFetching: false,
        dashboardBuyerTopByRiskTendersAmount: {},
        dashboardBuyerTopByRiskTendersAmountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_REQUEST:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersCountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersCount: action.data.data,
        dashboardBuyerTopByRiskTendersCountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_FAILED:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersCountIsFetching: false,
        dashboardBuyerTopByRiskTendersCountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT_CLEAR:
      return {
        ...state,
        dashboardBuyerTopByRiskTendersCountIsFetching: false,
        dashboardBuyerTopByRiskTendersCount: {},
        dashboardBuyerTopByRiskTendersCountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_REQUEST:
      return {
        ...state,
        dashboardTenderInfoDataIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_SUCCESS:
      return {
        ...state,
        dashboardTenderInfoData: action.data,
        dashboardTenderInfoDataIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_FAILED:
      return {
        ...state,
        dashboardTenderInfoDataIsFetching: false,
        dashboardTenderInfoDataErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_INFO_CLEAR:
      return {
        ...state,
        dashboardTenderInfoDataIsFetching: false,
        dashboardTenderInfoData: {},
        dashboardTenderInfoDataErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardTenderMethodIndicatorAmountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderMethodIndicatorAmount: action.data.data,
        dashboardTenderMethodIndicatorAmountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_FAILED:
      return {
        ...state,
        dashboardTenderMethodIndicatorAmountIsFetching: false,
        dashboardTenderMethodIndicatorAmountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardTenderMethodIndicatorAmountIsFetching: false,
        dashboardTenderMethodIndicatorAmount: {},
        dashboardTenderMethodIndicatorAmountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_REQUEST:
      return {
        ...state,
        dashboardTenderMethodIndicatorCountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderMethodIndicatorCount: action.data.data,
        dashboardTenderMethodIndicatorCountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_FAILED:
      return {
        ...state,
        dashboardTenderMethodIndicatorCountIsFetching: false,
        dashboardTenderMethodIndicatorCountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_METHOD_INDICATOR_COUNT_CLEAR:
      return {
        ...state,
        dashboardTenderMethodIndicatorCountIsFetching: false,
        dashboardTenderMethodIndicatorCount: {},
        dashboardTenderMethodIndicatorCountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_REQUEST:
      return {
        ...state,
        dashboardTenderRiskTendersAmountInfoByMethodIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_SUCCESS:
      return {
        ...state,
        dashboardTenderRiskTendersAmountInfoByMethod: action.data.data,
        dashboardTenderRiskTendersAmountInfoByMethodIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_FAILED:
      return {
        ...state,
        dashboardTenderRiskTendersAmountInfoByMethodIsFetching: false,
        dashboardTenderRiskTendersAmountInfoByMethodErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_INFO_BY_METHOD_CLEAR:
      return {
        ...state,
        dashboardTenderRiskTendersAmountInfoByMethodIsFetching: false,
        dashboardTenderRiskTendersAmountInfoByMethod: {},
        dashboardTenderRiskTendersAmountInfoByMethodErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_REQUEST:
      return {
        ...state,
        dashboardTenderRiskTendersCountInfoByMethodIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_SUCCESS:
      return {
        ...state,
        dashboardTenderRiskTendersCountInfoByMethod: action.data.data,
        dashboardTenderRiskTendersCountInfoByMethodIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_FAILED:
      return {
        ...state,
        dashboardTenderRiskTendersCountInfoByMethodIsFetching: false,
        dashboardTenderRiskTendersCountInfoByMethodErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD_CLEAR:
      return {
        ...state,
        dashboardTenderRiskTendersCountInfoByMethodIsFetching: false,
        dashboardTenderRiskTendersCountInfoByMethod: {},
        dashboardTenderRiskTendersCountInfoByMethodErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_REQUEST:
      return {
        ...state,
        dashboardTenderTendersAmountInfoByMonthIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_SUCCESS:
      return {
        ...state,
        dashboardTenderTendersAmountInfoByMonth: action.data.data,
        dashboardTenderTendersAmountInfoByMonthIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_FAILED:
      return {
        ...state,
        dashboardTenderTendersAmountInfoByMonthIsFetching: false,
        dashboardTenderTendersAmountInfoByMonthErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH_CLEAR:
      return {
        ...state,
        dashboardTenderTendersAmountInfoByMonthIsFetching: false,
        dashboardTenderTendersAmountInfoByMonth: {},
        dashboardTenderTendersAmountInfoByMonthErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_REQUEST:
      return {
        ...state,
        dashboardTenderTendersCountInfoByMonthIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_SUCCESS:
      return {
        ...state,
        dashboardTenderTendersCountInfoByMonth: action.data.data,
        dashboardTenderTendersCountInfoByMonthIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_FAILED:
      return {
        ...state,
        dashboardTenderTendersCountInfoByMonthIsFetching: false,
        dashboardTenderTendersCountInfoByMonthErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH_CLEAR:
      return {
        ...state,
        dashboardTenderTendersCountInfoByMonthIsFetching: false,
        dashboardTenderTendersCountInfoByMonth: {},
        dashboardTenderTendersCountInfoByMonthErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersAmountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersAmount: action.data.data,
        dashboardTenderTopOkgzByRiskTendersAmountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_FAILED:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersAmountIsFetching: false,
        dashboardTenderTopOkgzByRiskTendersAmountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersAmountIsFetching: false,
        dashboardTenderTopOkgzByRiskTendersAmount: {},
        dashboardTenderTopOkgzByRiskTendersAmountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_REQUEST:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersCountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersCount: action.data.data,
        dashboardTenderTopOkgzByRiskTendersCountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_FAILED:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersCountIsFetching: false,
        dashboardTenderTopOkgzByRiskTendersCountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_OKGZ_BY_RISK_TENDERS_COUNT_CLEAR:
      return {
        ...state,
        dashboardTenderTopOkgzByRiskTendersCountIsFetching: false,
        dashboardTenderTopOkgzByRiskTendersCount: {},
        dashboardTenderTopOkgzByRiskTendersCountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_REQUEST:
      return {
        ...state,
        dashboardTenderTopRiskTendersByAmountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderTopRiskTendersByAmount: action.data.data,
        dashboardTenderTopRiskTendersByAmountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_FAILED:
      return {
        ...state,
        dashboardTenderTopRiskTendersByAmountIsFetching: false,
        dashboardTenderTopRiskTendersByAmountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT_CLEAR:
      return {
        ...state,
        dashboardTenderTopRiskTendersByAmountIsFetching: false,
        dashboardTenderTopRiskTendersByAmount: {},
        dashboardTenderTopRiskTendersByAmountErrorMessage: '',
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_REQUEST:
      return {
        ...state,
        dashboardTenderTopTendersByIndicatorCountIsFetching: true,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_SUCCESS:
      return {
        ...state,
        dashboardTenderTopTendersByIndicatorCount: action.data.data,
        dashboardTenderTopTendersByIndicatorCountIsFetching: false,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_FAILED:
      return {
        ...state,
        dashboardTenderTopTendersByIndicatorCountIsFetching: false,
        dashboardTenderTopTendersByIndicatorCountErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT_CLEAR:
      return {
        ...state,
        dashboardTenderTopTendersByIndicatorCountIsFetching: false,
        dashboardTenderTopTendersByIndicatorCount: {},
        dashboardTenderTopTendersByIndicatorCountErrorMessage: '',
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_REQUEST:
      return {
        ...state,
        availableIndicatorsForBuyerFilterIsFetching: true,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_SUCCESS:
      return {
        ...state,
        availableIndicatorsForBuyerFilter: action.data,
        availableIndicatorsForBuyerFilterIsFetching: false,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_FAILED:
      return {
        ...state,
        availableIndicatorsForBuyerFilterIsFetching: false,
        availableIndicatorsForBuyerFilterErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_BUYER_FILTER_CLEAR:
      return {
        ...state,
        availableIndicatorsForBuyerFilterIsFetching: false,
        availableIndicatorsForBuyerFilter: [],
        availableIndicatorsForBuyerFilterErrorMessage: '',
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_REQUEST:
      return {
        ...state,
        availableIndicatorsForTenderFilterIsFetching: true,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_SUCCESS:
      return {
        ...state,
        availableIndicatorsForTenderFilter: action.data,
        availableIndicatorsForTenderFilterIsFetching: false,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_FAILED:
      return {
        ...state,
        availableIndicatorsForTenderFilterIsFetching: false,
        availableIndicatorsForTenderFilterErrorMessage: action.errorMessage,
      }

    case PrioritizationConstants.GET_AVAILABLE_INDICATORS_FOR_TENDER_FILTER_CLEAR:
      return {
        ...state,
        availableIndicatorsForTenderFilterIsFetching: false,
        availableIndicatorsForTenderFilter: [],
        availableIndicatorsForTenderFilterErrorMessage: '',
      }

    default:
      return state
  }
}