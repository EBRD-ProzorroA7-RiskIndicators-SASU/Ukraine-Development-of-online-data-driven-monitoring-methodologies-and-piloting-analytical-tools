import {
  GET_DATA_FOR_RESOURCES_PAGE_REQUEST,
  GET_DATA_FOR_RESOURCES_PAGE_ERROR,
  GET_DATA_FOR_RESOURCES_PAGE_SUCCESS,
} from '../constants'

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  resourcesData: {
    auditorsCount: 0,
    auditorsCountByMonth: [],
    auditorsCountByRegion: [],
    totalAuditorsCount: 0,
  },
}

export const resourcesPageData = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_DATA_FOR_RESOURCES_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      }

    case GET_DATA_FOR_RESOURCES_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      }

    case GET_DATA_FOR_RESOURCES_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        resourcesData: payload,
      }

    default:
      return state
  }
}
