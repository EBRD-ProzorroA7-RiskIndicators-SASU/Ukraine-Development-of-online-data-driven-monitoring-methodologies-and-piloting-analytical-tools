import {
  GET_DATA_FOR_MONITORING_COVERAGE_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_COVERAGE_PAGE_SUCCESS,
  GET_DATA_FOR_MONITORING_COVERAGE_PAGE_ERROR,
  GET_DATA_FOR_RESULTS_MONITORING_PAGE_REQUEST,
  GET_DATA_FOR_RESULTS_MONITORING_PAGE_SUCCESS,
  GET_DATA_FOR_RESULTS_MONITORING_PAGE_ERROR,
  GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_REQUEST,
  GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_SUCCESS,
  GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_ERROR,
  GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_REQUEST,
  GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_SUCCESS,
  GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_ERROR,
  GET_DATA_FOR_RESULT_SOURCES_PAGE_REQUEST,
  GET_DATA_FOR_RESULT_SOURCES_PAGE_SUCCESS,
  GET_DATA_FOR_RESULT_SOURCES_PAGE_ERROR,
  GET_DATA_FOR_PROCESS_DURATION_PAGE_REQUEST,
  GET_DATA_FOR_PROCESS_DURATION_PAGE_SUCCESS,
  GET_DATA_FOR_PROCESS_DURATION_PAGE_ERROR,
} from '../constants'

import { RSAA } from 'redux-api-middleware'
import {
  BASE_URL,
  MONITORING_COVERAGE_PAGE,
  RESULTS_MONITORING_PAGE,
  RESULTS_BY_OFFICES_PAGE,
  RESULTS_VIOLATION_PAGE,
  RESULTS_SOURCES_PAGE,
  PROCESS_DURATION_PAGE,
} from '../../api/constants'

export const getDataMonitoringCoveragePage = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_COVERAGE_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_MONITORING_COVERAGE_PAGE_REQUEST,
        GET_DATA_FOR_MONITORING_COVERAGE_PAGE_SUCCESS,
        GET_DATA_FOR_MONITORING_COVERAGE_PAGE_ERROR,
      ],
    },
  }
}

export const getDataResultsMonitoringPage = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${RESULTS_MONITORING_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_RESULTS_MONITORING_PAGE_REQUEST,
        GET_DATA_FOR_RESULTS_MONITORING_PAGE_SUCCESS,
        GET_DATA_FOR_RESULTS_MONITORING_PAGE_ERROR,
      ],
    },
  }
}

export const getResultsByOfficesData = (startDate, endDate, violationIds = [], selectedOffices = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${RESULTS_BY_OFFICES_PAGE}startDate=${startDate}&endDate=${endDate}&violationId=${violationIds}&offices=${selectedOffices}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_REQUEST,
        GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_SUCCESS,
        GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_ERROR,
      ],
    },
  }
}

export const getTypeOfViolationData = (startDate, endDate, violationIds = [], selectedOffices = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${RESULTS_VIOLATION_PAGE}startDate=${startDate}&endDate=${endDate}&violationId=${violationIds}&offices=${selectedOffices}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_REQUEST,
        GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_SUCCESS,
        GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_ERROR,
      ],
    },
  }
}

export const getResultSourcesData = (startDate, endDate, procuringEntityRegions = [], selectedOffices = [], reasons = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${RESULTS_SOURCES_PAGE}startDate=${startDate}&endDate=${endDate}&procuringEntityRegions=${procuringEntityRegions}&offices=${selectedOffices}&reasons=${reasons}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_RESULT_SOURCES_PAGE_REQUEST,
        GET_DATA_FOR_RESULT_SOURCES_PAGE_SUCCESS,
        GET_DATA_FOR_RESULT_SOURCES_PAGE_ERROR,
      ],
    },
  }
}

export const getProcessDurationData = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${PROCESS_DURATION_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_PROCESS_DURATION_PAGE_REQUEST,
        GET_DATA_FOR_PROCESS_DURATION_PAGE_SUCCESS,
        GET_DATA_FOR_PROCESS_DURATION_PAGE_ERROR,
      ],
    },
  }
}
