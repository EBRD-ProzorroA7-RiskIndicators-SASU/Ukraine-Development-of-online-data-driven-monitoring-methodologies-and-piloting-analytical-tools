import {
  GET_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_MARKET_PAGE_ERROR,
  GET_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS,
  GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST,
  GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_ERROR,
  GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS,
  GET_PROCEDURE_DRILL_DATA_REQUEST,
  GET_PROCEDURE_DRILL_DATA_ERROR,
  GET_PROCEDURE_DRILL_DATA_SUCCESS,
  CLEAR_PROCEDURE_REDUCER
} from "../constants";

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  monitoringMarketData: null,
  procedure: null
};

export const monitoringMarketPageData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_DATA_FOR_MONITORING_MARKET_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringMarketData: payload,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringMarketData: payload,
      };

    case GET_PROCEDURE_DRILL_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_PROCEDURE_DRILL_DATA_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_PROCEDURE_DRILL_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        procedure: payload,
      };

    case CLEAR_PROCEDURE_REDUCER:
      return {
        ...state,
        procedure: null
      }

    default:
      return state;
  }
};
