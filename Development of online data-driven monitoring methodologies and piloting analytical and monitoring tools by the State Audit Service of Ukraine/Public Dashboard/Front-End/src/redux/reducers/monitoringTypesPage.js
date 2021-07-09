import {
  GET_DATA_FOR_MONITORING_TYPES_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_TYPES_PAGE_SUCCESS,
  GET_DATA_FOR_MONITORING_TYPES_PAGE_ERROR,
} from '../constants'

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  monitoringTypesData: {
    localMethods: [],
    monitoringDynamics: [],
    procedureMonitoringCoverage: 0,
    procuringEntityCount: 0,
    tendersAmount: 0,
    tendersCount: 0,
  },
}

export const monitoringTypesPageStore = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_DATA_FOR_MONITORING_TYPES_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
        success: false,
      }

    case GET_DATA_FOR_MONITORING_TYPES_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        monitoringTypesData: payload,
      }

    case GET_DATA_FOR_MONITORING_TYPES_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
        monitoringTypesData: {
          localMethods: [],
          monitoringDynamics: [],
          procedureMonitoringCoverage: 0,
          procuringEntityCount: 0,
          tendersAmount: 0,
          tendersCount: 0,
        },
      }

    default:
      return state
  }
}
