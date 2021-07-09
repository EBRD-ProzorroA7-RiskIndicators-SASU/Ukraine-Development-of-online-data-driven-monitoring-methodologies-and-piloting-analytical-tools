import {
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE__SUCCESS,
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_ERROR,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_SUCCESS,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_ERROR,
} from '../constants'

import { RSAA } from 'redux-api-middleware'
import { BASE_URL, COMPARATIVE_PAGE } from '../../api/constants'

export const getDataForComparativeDynamicsPage = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${COMPARATIVE_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
        GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE__SUCCESS,
        GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_ERROR,
      ],
    },
  }
}

export const getRegionsDataComparativeDynamicsPage = (startDate, endDate, id) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${COMPARATIVE_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
        GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_SUCCESS,
        GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_ERROR,
      ],
    },
  }
}
