import {
  GET_MAPPINGS_REQUEST,
  GET_MAPPINGS_SUCCESS,
  GET_MAPPINGS_ERROR,
} from '../constants'

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  mappingsIsLoaded: false,
  mappingsData: {
    offices: [],
    violations: [],
    reasons: [],
  },
}

export const mappingsStore = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_MAPPINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
        success: false,
        mappingsIsLoaded: false,
      }

    case GET_MAPPINGS_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
        mappingsIsLoaded: false,
      }


    case GET_MAPPINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        mappingsData: payload,
        mappingsIsLoaded: true,
      }

    default:
      return state
  }
}
