import { IntlActions } from 'react-redux-multilingual'
import configureStore from './configureStore'
import { changeLocalizationData } from '../action/localization/LocalizationActions'

const store = configureStore()
store.dispatch(IntlActions.setLocale(process.env.REACT_APP_DEFAULT_LOCALE))
store.dispatch(changeLocalizationData(process.env.REACT_APP_DEFAULT_LOCALE))

export default store