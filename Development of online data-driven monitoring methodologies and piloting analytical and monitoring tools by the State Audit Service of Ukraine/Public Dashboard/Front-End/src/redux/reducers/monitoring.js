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

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  monitoringCoverageData: {
    awardsAmount: 0,
    awardsCount: 0,
    totalAwardsAmount: 0,
    tendersDistribution: {
      activeMonitoringAmount: 0,
      activeMonitoringProcuringEntityCount: 0,
      activeMonitoringTendersCount: 0,
      cancelledMonitoringAmount: 0,
      cancelledMonitoringProcuringEntityCount: 0,
      cancelledMonitoringTendersCount: 0,
      cancelledProcuringEntityCount: 0,
      cancelledTendersAmount: 0,
      cancelledTendersCount: 0,
      completeProcuringEntityCount: 0,
      completeTendersAmount: 0,
      completeTendersCount: 0,
      monitoringProcuringEntityCount: 0,
      monitoringTendersAmount: 0,
      monitoringTendersCount: 0,
      nonMonitoringProcuringEntityCount: 0,
      nonMonitoringTendersAmount: 0,
      nonMonitoringTendersCount: 0,
      nonViolationMonitoringAmount: 0,
      nonViolationMonitoringProcuringEntityCount: 0,
      nonViolationMonitoringTendersCount: 0,
      othersProcuringEntityCount: 0,
      othersTendersAmount: 0,
      othersTendersCount: 0,
      procuringEntityCount: 0,
      tendersAmount: 0,
      tendersCount: 0,
      violationMonitoringAmount: 0,
      violationMonitoringProcuringEntityCount: 0,
      violationMonitoringTendersCount: 0,
    },
  },
  resultsMonitoringData: {
    distributions: [],
    dynamics: [],
    regions: [],
    tendersAmount: 0,
    tendersCount: 0,
    totalTendersAmount: 0,
  },
  resultsByOffices: {
    avgOfficeViolations: 0,
    offices: [],
    tenderDynamics: [],
    tendersAmount: 0,
    violations: [],
  },
  typeOfViolationData: {
    totalProcuringEntitiesCount: 0,
    procuringEntitiesCount: 0,
    tendersByViolation: [],
    offices: [],
    regions: [],
  },
  resultSourcesData: {
    tendersAmount: 0,
    tendersCount: 0,
    reasonTenders: [],
    violations: [],
  },
  processDurationData: {
    competitiveDuration: 0,
    duration: 0,
    localMethods: [],
    nonCompetitiveDuration: 0,
    regions: [],
    totalDuration: 0,
  },
}

export const monitoringStore = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_DATA_FOR_MONITORING_COVERAGE_PAGE_REQUEST:
    case GET_DATA_FOR_RESULTS_MONITORING_PAGE_REQUEST:
    case GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_REQUEST:
    case GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_REQUEST:
    case GET_DATA_FOR_RESULT_SOURCES_PAGE_REQUEST:
    case GET_DATA_FOR_PROCESS_DURATION_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
        success: false,
      }

    case GET_DATA_FOR_MONITORING_COVERAGE_PAGE_ERROR:
    case GET_DATA_FOR_RESULTS_MONITORING_PAGE_ERROR:
    case GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_ERROR:
    case GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_ERROR:
    case GET_DATA_FOR_RESULT_SOURCES_PAGE_ERROR:
    case GET_DATA_FOR_PROCESS_DURATION_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      }


    case GET_DATA_FOR_MONITORING_COVERAGE_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringCoverageData: payload,
      }

    case GET_DATA_FOR_RESULTS_MONITORING_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        resultsMonitoringData: payload,
      }

    case GET_DATA_FOR_RESULTS_BY_OFFICES_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        resultsByOffices: payload,
      }

    case GET_DATA_FOR_TYPE_OF_VIOLATION_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        typeOfViolationData: payload,
      }

    case GET_DATA_FOR_RESULT_SOURCES_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        resultSourcesData: payload,
      }

    case GET_DATA_FOR_PROCESS_DURATION_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        processDurationData: payload,
      }

    default:
      return state
  }
}
