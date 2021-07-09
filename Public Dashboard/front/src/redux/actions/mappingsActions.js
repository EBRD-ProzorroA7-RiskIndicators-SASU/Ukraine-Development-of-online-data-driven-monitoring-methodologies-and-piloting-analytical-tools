import {
  GET_MAPPINGS_REQUEST,
  GET_MAPPINGS_SUCCESS,
  GET_MAPPINGS_ERROR,
} from '../constants'

import { RSAA } from 'redux-api-middleware'
import {
  BASE_URL,
  MAPPINGS,
} from '../../api/constants'

export const getMappingsData = () => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MAPPINGS}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_MAPPINGS_REQUEST,
        GET_MAPPINGS_SUCCESS,
        GET_MAPPINGS_ERROR,
      ],
    },
  }
}
