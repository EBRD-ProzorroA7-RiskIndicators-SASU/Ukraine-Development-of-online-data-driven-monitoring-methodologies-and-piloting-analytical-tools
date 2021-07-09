import {
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
  GET_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
  GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_REQUEST,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_SUCCESS,
  GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_ERROR,
} from "../constants";

import { RSAA } from "redux-api-middleware";
import { BASE_URL, MONITORING_REGIONS_PAGE } from "../../api/constants";

export const getDataMonitoringRegionsPage = (startDate, endDate, sasuRegionsIds = [], peIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_REGIONS_PAGE}startDate=${startDate}&endDate=${endDate}&sasuRegions=${sasuRegionsIds}&procuringEntityRegions=${peIds}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
        GET_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
        GET_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
      ],
    },
  };
};

export const getRegionsDataMonitoringRegionsPage = (startDate, endDate, id) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_REGIONS_PAGE}startDate=${startDate}&endDate=${endDate}&sasuRegions=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_REQUEST,
        GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_SUCCESS,
        GET_REGIONS_DATA_FOR_MONITORING_REGIONS_PAGE_ERROR,
      ],
    },
  };
};

export const getBarChartInfo = (startDate, endDate, id, mapId) => {
  const region = id && id.length > 0 ? `&sasuRegions=${id}` : '';
  const regionFromMap = mapId && mapId.length > 0 ? `&procuringEntityRegions=${mapId}` : '';

  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_REGIONS_PAGE.replace('?', '/')}top-cpv2?startDate=${startDate}&endDate=${endDate}${region}${regionFromMap}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_REQUEST,
        GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_SUCCESS,
        GET_BAR_CHART_DATA_MONITORING_REGIONS_PAGE_ERROR,
      ],
    },
  };
};