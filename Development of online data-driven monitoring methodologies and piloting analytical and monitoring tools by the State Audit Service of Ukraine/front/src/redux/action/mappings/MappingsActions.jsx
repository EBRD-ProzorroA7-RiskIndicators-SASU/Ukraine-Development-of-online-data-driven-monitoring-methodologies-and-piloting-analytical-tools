import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import { MAPPINGS } from '../../../services/ApiEndpointsConstants'
import * as MappingsActions from './MappingsConstants'

export function getAllDictionary() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(MAPPINGS),
      types: [
        MappingsActions.GET_ALL_DICTIONARY_REQUEST,
        MappingsActions.GET_ALL_DICTIONARY_SUCCESS,
        MappingsActions.GET_ALL_DICTIONARY_FAILED,
      ],
    },
  }
}