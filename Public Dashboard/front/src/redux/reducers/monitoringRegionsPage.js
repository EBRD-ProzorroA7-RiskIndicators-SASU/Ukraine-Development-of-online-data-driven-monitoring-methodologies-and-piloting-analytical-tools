import {
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_REQUEST,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_ERROR,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_SUCCESS
} from "../constants";

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  monitoringRegionsData: null,
  barChartData: null
};

export const monitoringRegionsPageData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringRegionsData: payload,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringRegionsData: payload,
      };

    case GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        barChartData: payload,
      };

    default:
      return state;
  }
};
