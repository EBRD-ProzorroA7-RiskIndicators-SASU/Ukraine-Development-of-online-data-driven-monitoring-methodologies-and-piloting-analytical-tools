import {
  GET_DATA_FOR_MONITORING_TYPES_PAGE_REQUEST,
  GET_DATA_FOR_MONITORING_TYPES_PAGE_SUCCESS,
  GET_DATA_FOR_MONITORING_TYPES_PAGE_ERROR,

} from '../constants'

import { RSAA } from 'redux-api-middleware'
import { BASE_URL, MONITORING_TYPES_PAGE } from '../../api/constants'

export const getDataMonitoringTypesPage = (startDate, endDate, regionIds = []) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${MONITORING_TYPES_PAGE}startDate=${startDate}&endDate=${endDate}&regions=${regionIds}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      types: [
        GET_DATA_FOR_MONITORING_TYPES_PAGE_REQUEST,
        GET_DATA_FOR_MONITORING_TYPES_PAGE_SUCCESS,
        GET_DATA_FOR_MONITORING_TYPES_PAGE_ERROR,
      ],
    },
  }
}
