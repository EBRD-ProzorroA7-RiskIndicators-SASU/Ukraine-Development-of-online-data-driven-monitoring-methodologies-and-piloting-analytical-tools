import { BASE_URL } from '../middleware/api'

function addBaseUrl(url) {
  return `${BASE_URL}${url}`
}

const entity = (path) => {
  return addBaseUrl(path)
}

export const apiEndpoints = () => {
  return {
    entity,
  }
}


// PATH

export const OFFICES = '/offices'
export const LOGIN_USER = '/login'
export const REGISTER_USER = '/auditors/register'
// export const RESET_SEND_EMAIL = '/auditors/password/reset/mail?email='
export const RESET_SEND_EMAIL = '/auditors/password/reset/mail'
export const RESET_CHECK_TOKEN = '/auditors/password/reset/check?token='
export const RESET_SAVE_NEW_PASSWORD = '/auditors/password/reset/save'
export const AUDITOR_UPDATE_PASSWORD = '/auditors/update-password'
export const TEMPLATES = '/templates'
export const TEMPLATES_BASE = '/templates/base'
export const TEMPLATES_AUDITOR = '/templates/auditor'
export const TEMPLATES_TYPES = '/templates/types'
export const TEMPLATE_BY_ID = '/templates/{id}'
export const TEMPLATE_BY_ID_AND_CATEGORIES = '/templates/{id}/categories'
export const CATEGORIES = '/templates/categories'
export const DELETE_CATEGORY = '/templates/categories/{id}'
export const QUESTIONS_OF_CATEGORY = '/templates/categories/{id}/questions'
export const QUESTIONS = '/templates/categories/questions'
export const DELETE_QUESTION = '/templates/categories/questions/{id}'
export const GET_AUDITORS = '/auditors'
export const DELETE_AUDITOR = '/auditors/{id}'
export const PERMISSIONS = '/auditors/permissions'
export const PRIORITIZATION_TENDERS = '/prioritization/tenders'
export const PRIORITIZATION_BUYERS = '/prioritization/buyers'
export const CALENDAR = '/calendar'
export const CHECKLISTS = '/checklists'
export const CHECKLISTS_BY_ID = '/checklists/{id}'
export const CHECKLIST_EXPORT = '/checklists/{id}/export'
export const CHECKLISTS_SAVE = '/checklists/save'
export const CHECKLISTS_UPDATE = '/checklists/update'
export const CHECKLISTS_AUTO_SCORE = '/checklists/auto-score'

// Filters controller
export const FILTER_INDICATOR_BUYER = '/filter/indicator/buyer'
export const FILTER_INDICATOR_TENDER = '/filter/indicator/tender'


// export const CHECKLISTS_TENDER_CHECKLIST_SCORE = '/checklists/tenders-checklists-score'
export const CHECKLISTS_AUTO_TENDERS_SCORE = '/checklists/auto-tenders-score'
export const SEARCH_AUDIT_BY_NAME = '/search/audit-name?value='
export const SEARCH_AUDITOR_BY_NAME = '/search/auditor-name?value='
export const INDICATOR_BY_TENDER_ID = '/tenders/{tenderId}/indicators'
export const MAPPINGS = '/mappings'
export const TENDER_CPV_SEARCH = '/search/cpv?value='
export const SEARCH_BUYERS = '/search/buyer?value='
export const AUDITOR_SETTINGS = '/auditors/settings'
export const EXPORT_BUYERS = '/prioritization/buyers/export'
export const EXPORT_TENDERS = '/prioritization/tenders/export'

//Dashboards endpoints
export const DASHBOARD_BUYER_INFO = '/dashboard/buyer/info'
export const DASHBOARD_BUYER_TOP_BY_INDICATORS_COUNT = '/dashboard/buyer/top-by-indicators-count'
export const DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_AMOUNT = '/dashboard/buyer/top-by-risk-tenders-amount'
export const DASHBOARD_BUYER_TOP_BY_RISK_TENDERS_COUNT = '/dashboard/buyer/top-by-risk-tenders-count'
export const DASHBOARD_TENDER_INFO = '/dashboard/tender/info'
export const DASHBOARD_TENDER_METOD_INDICATOR_AMOUNT = '/dashboard/tender/method-indicator-amount'
export const DASHBOARD_TENDER_METOD_INDICATOR_COUNT = '/dashboard/tender/method-indicator-count'
export const DASHBOARD_TENDER_RISK_TENDERS_AMOUNT_BY_METHOD = '/dashboard/tender/risk-tenders-amount-info-by-method'
export const DASHBOARD_TENDER_RISK_TENDERS_COUNT_INFO_BY_METHOD = '/dashboard/tender/risk-tenders-count-info-by-method'
export const DASHBOARD_TENDER_TENDERS_AMOUNT_INFO_BY_MONTH = '/dashboard/tender/tenders-amount-info-by-month'
export const DASHBOARD_TENDER_TENDERS_COUNT_INFO_BY_MONTH = '/dashboard/tender/tenders-count-info-by-month'
export const DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_AMOUNT = '/dashboard/tender/top-okgz-by-risk-tenders-amount'
export const DASHBOARD_TENDER_TOP_OKGZ_RISK_TENDERS_COUNT = '/dashboard/tender/top-okgz-by-risk-tenders-count'
export const DASHBOARD_TENDER_TOP_RISK_TENDERS_BY_AMOUNT = '/dashboard/tender/top-risk-tenders-by-amount'
export const DASHBOARD_TENDER_TOP_TENDERS_BY_INDICATOR_COUNT = '/dashboard/tender/top-tenders-by-indicator-count'
export const DASHBOARD_BASE_INFO = '/dashboard/base/info'
export const DASHBOARD_BASE_TOP_INFO = '/dashboard/base/top-info'
export const DASHBOARD_BASE_COUNT_BY_MONTH = '/dashboard/base/count-by-month'
export const DASHBOARD_BASE_AMOUNT_BY_MONTH = '/dashboard/base/amount-by-month'
export const DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_COUNT = '/dashboard/base/top-methods-by-risk-tenders-count'
export const DASHBOARD_BASE_TOP_METHODS_BY_RISK_TENDERS_AMOUNT = '/dashboard/base/top-methods-by-risk-tenders-amount'
export const DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_COUNT = '/dashboard/base/top-regions-by-risk-tenders-count'
export const DASHBOARD_BASE_TOP_REGIONS_BY_RISK_TENDERS_AMOUNT = '/dashboard/base/top-regions-by-risk-tenders-amount'
export const DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_COUNT = '/dashboard/base/top-okgz-by-risk-tenders-count'
export const DASHBOARD_BASE_TOP_OKGZ_BY_RISK_TENDERS_AMOUNT = '/dashboard/base/top-okgz-by-risk-tenders-amount'
export const DASHBOARD_BASE_REGION_INDICATOR_COUNT = '/dashboard/base/region-indicator-count'
export const DASHBOARD_BASE_REGION_INDICATOR_AMOUNT = '/dashboard/base/region-indicator-amount'
export const DASHBOARD_BASE_REGION_INDICATOR_COUNT_PERCENT = '/dashboard/base/region-indicator-count-percent'
export const DASHBOARD_BASE_REGION_INDICATOR_AMOUNT_PERCENT = '/dashboard/base/region-indicator-amount-percent'

export const BUYER_MANAGE_ADMINISTRATION = '/buyer'
