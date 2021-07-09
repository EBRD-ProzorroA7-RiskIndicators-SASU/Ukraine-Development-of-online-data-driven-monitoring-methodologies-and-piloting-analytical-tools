import { combineReducers } from 'redux'
import { IntlReducer as Intl } from 'react-redux-multilingual'

import auth from './auth/auth'
import templatesStore from './templates/templates'
import categoriesStore from './templates/categories'
import questionsStore from './templates/questions'
import navigationStore from './navigation/navigation'
import administrationStore from './administration/administration'
import permissionsStore from './permissions/permissions'
import prioritizationStore from './prioritization/prioritization'
import localizationStore from './localization/localization'
import checklistsStore from './checklists/checklists'
import mappingsStore from './mappings/mappings'
import tenderStore from './tender/tender'
import buyerStore from './buyer/buyer'
import exportStore from './export/export'
import homeStore from './home/home'

export default combineReducers({
  Intl,
  auth,
  templatesStore,
  categoriesStore,
  questionsStore,
  navigationStore,
  administrationStore,
  permissionsStore,
  prioritizationStore,
  localizationStore,
  checklistsStore,
  mappingsStore,
  tenderStore,
  buyerStore,
  exportStore,
  homeStore,
})