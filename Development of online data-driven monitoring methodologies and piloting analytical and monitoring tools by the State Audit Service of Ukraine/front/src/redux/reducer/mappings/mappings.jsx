import * as MappingsConstants from '../../action/mappings/MappingsConstants'

const initialState = {
  allMappings: {},
  allMappingsIsFetching: false,
  allMappingsErrorMessage: '',
}

export default function mappingsStore(state = initialState, action) {
  switch (action.type) {
    // GET ALL DICTIONARY
    case MappingsConstants.GET_ALL_DICTIONARY_REQUEST:
      return {
        ...state,
        allMappingsIsFetching: true,
      }
    case MappingsConstants.GET_ALL_DICTIONARY_SUCCESS:
      return {
        ...state,
        allMappingsIsFetching: false,
        allMappings: action.data,
      }
    case MappingsConstants.GET_ALL_DICTIONARY_FAILED:
      return {
        ...state,
        allMappingsIsFetching: false,
        allMappingsErrorMessage: action.errorMessage,
      }
    default:
      return state
  }
}