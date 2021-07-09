import * as LocalizationConstants from '../../action/localization/LocalizationConstants'
import { registerLocale } from 'react-datepicker'
import en from 'date-fns/locale/en-US'
import ru from 'date-fns/locale/ru'
import ru_RU from 'antd/lib/locale-provider/ru_RU'
import en_US from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
import numeral from 'numeral'
import numeralRu from 'numeral/locales/ru'
import 'moment/locale/ru'

const initialState = {
  localeLang: 'ru',
  datePickerLocaleTitle: 'ru',
  datePickerLocaleObject: ru,
  defaultLocaleObject: ru_RU,
  HighchartsLangNumericSymbols: [],
  currencyType: ' сом.',
  piecesTitle: ' шт.',
  procurementMethodDetailsKey: 'nameRu',
  regionsKey: 'regionRu',
  indicatorsKey: 'description',
  checklistStatusesKey: 'name',
  dashboardTenderChecklistFilterKey: 'description',
  riskLevelsKey: 'name',
  okgzKey: 'name',
  checklistScoreKey: 'name',
  componentImpactsKey: 'name',
  indicatorAnswersKey: 'name',
  questionAnswersKey: 'name',
  templateTypesKey: 'name',
  permissionKey: 'description',
  indicatorStatusesKey: 'name',
}

export default function localizationStore(state = initialState, action) {
  switch (action.type) {
    // GET
    case LocalizationConstants.CHANGE_LOCALIZATION_DATA:
      let localeLang = state.localeLang
      let datePickerLocaleObject = state.datePickerLocaleObject
      let defaultLocaleObject = state.defaultLocaleObject
      let HighchartsLangNumericSymbols = state.HighchartsLangNumericSymbols
      let currencyType = state.currencyType
      let piecesTitle = state.piecesTitle
      let procurementMethodDetailsKey = state.piecesTitle
      let regionsKey = state.regionsKey
      let indicatorsKey = state.indicatorsKey
      let checklistStatusesKey = state.checklistStatusesKey
      let dashboardTenderChecklistFilterKey = state.dashboardTenderChecklistFilterKey
      let riskLevelsKey = state.riskLevelsKey
      let okgzKey = state.okgzKey
      let checklistScoreKey = state.checklistScoreKey
      let componentImpactsKey = state.componentImpactsKey
      let indicatorAnswersKey = state.indicatorAnswersKey
      let questionAnswersKey = state.questionAnswersKey
      let templateTypesKey = state.templateTypesKey
      let permissionKey = state.permissionKey
      let indicatorStatusesKey = state.indicatorStatusesKey

      switch (action.localeTitle) {
        case 'ru':
          localeLang = 'ru'
          registerLocale('ru', ru)
          moment.locale('ru_RU')
          numeral.locale('ru', numeralRu)
          datePickerLocaleObject = ru
          defaultLocaleObject = ru_RU
          HighchartsLangNumericSymbols = [' тыс.', ' млн.', ' млрд.', ' трлн.']
          currencyType = ' грн.'
          piecesTitle = ' шт.'
          procurementMethodDetailsKey = 'nameRu'
          regionsKey = 'regionRu'
          indicatorsKey = 'description'
          checklistStatusesKey = 'name'
          dashboardTenderChecklistFilterKey = 'description'
          riskLevelsKey = 'name'
          okgzKey = 'name'
          checklistScoreKey = 'name'
          componentImpactsKey = 'name'
          indicatorAnswersKey = 'name'
          questionAnswersKey = 'name'
          templateTypesKey = 'name'
          permissionKey = 'description'
          indicatorStatusesKey = 'name'
          break

        default:
          localeLang = 'en'
          registerLocale('en', en)
          datePickerLocaleObject = en
          defaultLocaleObject = en_US
          HighchartsLangNumericSymbols = ['k', 'M', 'G', 'T', 'P', 'E']
          currencyType = ' KGS'
          piecesTitle = ''
          procurementMethodDetailsKey = 'nameEnFull'
          regionsKey = 'regionEn'
          indicatorsKey = 'descriptionEn'
          checklistStatusesKey = 'nameEn'
          dashboardTenderChecklistFilterKey = 'descriptionEn'
          riskLevelsKey = 'nameEn'
          okgzKey = 'nameEn'
          checklistScoreKey = 'nameEn'
          componentImpactsKey = 'nameEn'
          indicatorAnswersKey = 'nameEn'
          questionAnswersKey = 'nameEn'
          templateTypesKey = 'nameEn'
          permissionKey = 'descriptionEn'
          indicatorStatusesKey = 'nameEn'
          break

      }

      return {
        ...state,
        localeLang: localeLang,
        datePickerLocaleTitle: action.localeTitle,
        datePickerLocaleObject: datePickerLocaleObject,
        defaultLocaleObject: defaultLocaleObject,
        HighchartsLangNumericSymbols: HighchartsLangNumericSymbols,
        currencyType: currencyType,
        piecesTitle: piecesTitle,
        procurementMethodDetailsKey: procurementMethodDetailsKey,
        regionsKey: regionsKey,
        indicatorsKey: indicatorsKey,
        checklistStatusesKey: checklistStatusesKey,
        dashboardTenderChecklistFilterKey: dashboardTenderChecklistFilterKey,
        riskLevelsKey: riskLevelsKey,
        okgzKey: okgzKey,
        checklistScoreKey: checklistScoreKey,
        componentImpactsKey: componentImpactsKey,
        indicatorAnswersKey: indicatorAnswersKey,
        questionAnswersKey: questionAnswersKey,
        templateTypesKey: templateTypesKey,
        permissionKey: permissionKey,
        indicatorStatusesKey: indicatorStatusesKey,
      }
    default:
      return state
  }
}
