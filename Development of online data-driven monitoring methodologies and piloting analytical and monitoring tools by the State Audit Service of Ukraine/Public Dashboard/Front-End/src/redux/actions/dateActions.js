import {
  SET_CURRENT_DATE
} from '../constants';

export const setCurrentDate = (startDate, endDate) => {
  return {
    type: SET_CURRENT_DATE,
    startDate,
    endDate
  }
}