import Intl from 'intl'
import en_US from 'intl/locale-data/jsonp/en-US'
import _ from 'lodash'
import numeral from 'numeral'

import store from '../redux/store/store'

export const parseNumber = (value) => {
  if (_.isString(value)) {
    const number = value.replace(/[^\d-\\.]/g, '')
    return _.isEmpty(number) ? null : _.toNumber(number)
  } else if (_.isNumber(value)) {
    return value
  }

  return null
}

export const parseCurrency = (value) => {
  return parseNumber(value)
}

export const prepareToFormat = (value) => {
  return _.isNumber(value) ? value : parseNumber(value)
}

export const toCurrencyFormat = (value, minFractionDigits = 0, maxFractionDigits = 2) => {
  let preparedValue = prepareToFormat(value)

  return Intl.NumberFormat(en_US, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  }).format(preparedValue)
}

export const toCurrencyWithPostfix = (value) => {
  const state = store.getState()

  return numeral(value).format('0.[00] a').replace(/\d+,?\d*/, '$&') + state.localizationStore.currencyType
}

export const toCurrencyWithoutPostfix = (value) => {
  return numeral(value).format('0.[00] a').replace(/\d+,?\d*/, '$&')
}

export const toPercentFormat = (value, digitsAfterDotString = '0') => {
  return numeral(value).format(`0.${digitsAfterDotString}`) + '%'
}

export const toNumberFormat = (value) => {
  return numeral(value).format('0,0')
}

export const toNumberFormatWithPC = (value) => {
  const state = store.getState()

  return numeral(value).format('0,0') + state.localizationStore.piecesTitle
}