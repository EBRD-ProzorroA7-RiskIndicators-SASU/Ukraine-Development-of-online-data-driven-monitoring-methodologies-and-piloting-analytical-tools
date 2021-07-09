import {
  SET_CURRENT_DATE,
} from '../constants'
import * as dayjs from 'dayjs'

let previousMonth = dayjs().startOf('M').format('YYYY-MM-DD')

const initialState = {
  startDate: dayjs(previousMonth).subtract(1, 'year').format('YYYY-MM-DD'),
  endDate: previousMonth,
  defaultPeriod: 'Останні повні 12 місяців',
}

export const currentDate = (state = initialState, action) => {
  const { type, startDate, endDate } = action

  switch (type) {
    case SET_CURRENT_DATE:
      return {
        ...state,
        startDate,
        endDate,
      }

    default:
      return state
  }
}