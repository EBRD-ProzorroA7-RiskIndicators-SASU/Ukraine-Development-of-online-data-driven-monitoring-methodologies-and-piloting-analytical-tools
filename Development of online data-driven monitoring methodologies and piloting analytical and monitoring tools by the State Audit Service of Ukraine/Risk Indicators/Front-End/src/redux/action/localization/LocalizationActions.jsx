import * as LocalizationConstants from '../localization/LocalizationConstants'

export function changeLocalizationData(localizationTitle) {
  return (dispatch) => dispatch({
    type: LocalizationConstants.CHANGE_LOCALIZATION_DATA,
    localeTitle: localizationTitle,
  })
}