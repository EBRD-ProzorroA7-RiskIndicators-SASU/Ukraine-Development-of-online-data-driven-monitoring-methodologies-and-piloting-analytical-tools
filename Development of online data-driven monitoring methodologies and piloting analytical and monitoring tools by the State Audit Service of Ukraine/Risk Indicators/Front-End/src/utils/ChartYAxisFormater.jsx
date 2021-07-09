import Highcharts from 'highcharts'
import store from '../redux/store/store'

export const yAxisFormatter = (value, yType = '') => {
  const state = store.getState()
  let counter = 0

  if (value > 0) {
    if (value >= 1000) {
      do {
        value = value / 1000
        counter++
      } while (value >= 1000)
    }
  }

  if (counter !== 0) {
    let formattedValue = Highcharts.numberFormat(value, -1) + state.localizationStore.HighchartsLangNumericSymbols[counter - 1]
    switch (yType) {
      case 'count':
        formattedValue += state.localizationStore.piecesTitle
        break
      case 'amount':
        formattedValue += state.localizationStore.currencyType
        break

      default:
        break
    }

    return formattedValue
  } else {
    switch (yType) {
      case 'count':
        value += state.localizationStore.piecesTitle
        break
      case 'amount':
        value += state.localizationStore.currencyType
        break

      default:
        break
    }

    return value
  }
}