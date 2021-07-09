import * as AdministrationConstants from '../../action/administration/AdministrationConstants'
import * as BuyerManageConstants from '../../action/administration/BuyerManageConstants'

const initialState = {
    auditors: [],
    auditorsIsFetching: false,
    auditorsErrorMessage: '',
    updateAuditor: {},
    updateAuditorIsFetching: false,
    updateAuditorErrorMessage: '',
    deleteAuditor: {},
    deleteAuditorIsFetching: false,
    deleteAuditorErrorMessage: '',
    calendarDataByYear: [],
    calendarDataByYearIsFetching: false,
    calendarDataByYearErrorMessage: '',
    saveCalendarData: {},
    saveCalendarDataIsFetching: false,
    saveCalendarDataErrorMessage: '',
    auditorSettingsData: {},
    auditorSettingsDataIsFetching: false,
    auditorSettingsDataErrorMessage: '',
    saveAuditorSettingsData: {},
    saveAuditorSettingsDataIsFetching: false,
    saveAuditorSettingsDataErrorMessage: '',
    saveAuditorSuccessfully: false,

    buyersPage: {
        buyers: [],
        currentPage: 0,
        totalElements: 0,
        totalBuyerCount: 0,
        processedBuyerCount: 0,
        notProcessedBuyerCount: 0
    },
    buyersPageIsFetching: false,
    buyersPageErrorMessage: '',
    buyersUpdatesIsFetching: false,
    buyersUpdatesErrorMessage: '',
    buyersUpdatesHasError: false
}

export default function administrationStore(state = initialState, action) {
    switch (action.type) {
// GET ALL AUDITORS
        case AdministrationConstants.GET_AUDITORS_REQUEST:
            return {
                ...state,
                auditorsIsFetching: true,
            }
        case AdministrationConstants.GET_AUDITORS_SUCCESS:
            return {
                ...state,
                auditorsIsFetching: false,
                auditors: action.data.auditors,
            }
        case AdministrationConstants.GET_AUDITORS_FAILED:
            return {
                ...state,
                auditorsIsFetching: false,
                auditorsErrorMessage: action.errorMessage,
            }

// UPDATE AUDITOR DATA
        case AdministrationConstants.UPDATE_AUDITOR_REQUEST:
            return {
                ...state,
                updateAuditorIsFetching: true,
            }
        case AdministrationConstants.UPDATE_AUDITOR_SUCCESS:
            return {
                ...state,
                updateAuditorIsFetching: false,
                updateAuditor: action.data,
            }
        case AdministrationConstants.UPDATE_AUDITOR_FAILED:
            return {
                ...state,
                updateAuditorIsFetching: false,
                updateAuditorErrorMessage: action.errorMessage,
            }

//DELETE AUDITOR
        case AdministrationConstants.DELETE_AUDITOR_REQUEST:
            return {
                ...state,
                deleteAuditorIsFetching: true,
            }
        case AdministrationConstants.DELETE_AUDITOR_SUCCESS:
            return {
                ...state,
                deleteAuditorIsFetching: false,
                deleteAuditor: action.data,
            }
        case AdministrationConstants.DELETE_AUDITOR_FAILED:
            return {
                ...state,
                deleteAuditorIsFetching: false,
                deleteAuditorErrorMessage: action.errorMessage,
            }

// GET CALENDAR DATA
        case AdministrationConstants.GET_CALENDAR_DATA_REQUEST:
            return {
                ...state,
                calendarDataByYearIsFetching: true,
            }
        case AdministrationConstants.GET_CALENDAR_DATA_SUCCESS:
            return {
                ...state,
                calendarDataByYearIsFetching: false,
                calendarDataByYear: action.data,
            }
        case AdministrationConstants.GET_CALENDAR_DATA_FAILED:
            return {
                ...state,
                calendarDataByYearIsFetching: false,
                calendarDataByYearErrorMessage: action.errorMessage,
            }

// SAVE CALENDAR DATA
        case AdministrationConstants.SAVE_CALENDAR_DATA_REQUEST:
            return {
                ...state,
                saveCalendarDataIsFetching: true,
            }
        case AdministrationConstants.SAVE_CALENDAR_DATA_SUCCESS:
            return {
                ...state,
                saveCalendarDataIsFetching: false,
                saveCalendarData: action.data,
            }
        case AdministrationConstants.SAVE_CALENDAR_DATA_FAILED:
            return {
                ...state,
                saveCalendarDataIsFetching: false,
                saveCalendarDataErrorMessage: action.errorMessage,
            }

// GET AUDITOR SETTINGS DATA
        case AdministrationConstants.GET_AUDITOR_SETTINGS_REQUEST:
            return {
                ...state,
                auditorSettingsDataIsFetching: true,
            }
        case AdministrationConstants.GET_AUDITOR_SETTINGS_SUCCESS:
            return {
                ...state,
                auditorSettingsDataIsFetching: false,
                auditorSettingsData: action.data,
            }
        case AdministrationConstants.GET_AUDITOR_SETTINGS_FAILED:
            return {
                ...state,
                auditorSettingsDataIsFetching: false,
                auditorSettingsDataErrorMessage: action.errorMessage,
            }

// SAVE AUDITOR SETTINGS DATA
        case AdministrationConstants.SAVE_AUDITOR_SETTINGS_REQUEST:
            return {
                ...state,
                saveAuditorSettingsDataIsFetching: true,
                saveAuditorSuccessfully: false,
            }
        case AdministrationConstants.SAVE_AUDITOR_SETTINGS_SUCCESS:
            return {
                ...state,
                saveAuditorSettingsDataIsFetching: false,
                saveAuditorSuccessfully: true,
                saveAuditorSettingsData: action.data,
            }
        case AdministrationConstants.SAVE_AUDITOR_SETTINGS_FAILED:
            return {
                ...state,
                saveAuditorSettingsDataIsFetching: false,
                saveAuditorSuccessfully: false,
                saveAuditorSettingsDataErrorMessage: action.error.response.data.message,
            }

        // SEARCH_BUYERS
        case BuyerManageConstants.SEARCH_BUYERS_REQUEST:
            return {
                ...state,
                buyersPageIsFetching: true
            }
        case BuyerManageConstants.SEARCH_BUYERS_SUCCESS:
            return {
                ...state,
                buyersPageIsFetching: false,
                buyersPage: action.data,
            }
        case BuyerManageConstants.SEARCH_BUYERS_FAILED:
            return {
                ...state,
                buyersPageIsFetching: false,
                buyersPageErrorMessage: action.errorMessage
            }
        // UPDATE_BUYERS
        case BuyerManageConstants.UPDATE_BUYERS_REQUEST:
            return {
                ...state,
                buyersUpdatesIsFetching: true,
                buyersUpdatesHasError: false
            }
        case BuyerManageConstants.UPDATE_BUYERS_SUCCESS:
            return {
                ...state,
                buyersUpdatesIsFetching: false,
                buyersUpdatesHasError: false
            }
        case BuyerManageConstants.UPDATE_BUYERS_FAILED:
            return {
                ...state,
                buyersUpdatesIsFetching: false,
                buyersUpdatesErrorMessage: action.errorMessage,
                buyersUpdatesHasError: true
            }

        default:
            return state
    }
}