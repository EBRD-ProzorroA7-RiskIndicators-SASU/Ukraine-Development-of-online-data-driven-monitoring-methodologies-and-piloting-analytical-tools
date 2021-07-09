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

import { RSAA } from "redux-api-middleware";
import { BASE_URL, MONITORING_MARKET_PAGE } from "../../api/constants";

export const getDataMonitoringMarketPage = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_MARKET_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST,
        GET_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS,
        GET_DATA_FOR_MONITORING_MARKET_PAGE_ERROR,
      ],
    },
  };
};

export const getRegionsDataMonitoringMarketPage = (startDate, endDate, id) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_MARKET_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_REQUEST,
        GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_SUCCESS,
        GET_REGIONS_DATA_FOR_MONITORING_MARKET_PAGE_ERROR
      ],
    },
  };
};

export const getProcedureRequest = (startDate, endDate, id) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_MARKET_PAGE.replace("?", "/")}cpv2?startDate=${startDate}&endDate=${endDate}&cpv2=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_PROCEDURE_DRILL_DATA_REQUEST,
        GET_PROCEDURE_DRILL_DATA_SUCCESS,
        GET_PROCEDURE_DRILL_DATA_ERROR
      ],
    },
  };
}

export const setClearProcerudeState = () => ({ type: CLEAR_PROCEDURE_REDUCER });