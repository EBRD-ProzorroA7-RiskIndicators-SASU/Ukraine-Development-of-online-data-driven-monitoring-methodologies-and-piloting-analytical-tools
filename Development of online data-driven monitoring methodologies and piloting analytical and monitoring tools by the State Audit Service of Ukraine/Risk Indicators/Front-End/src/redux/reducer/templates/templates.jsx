import * as TemplatesConstants from '../../action/templates/TemplatesConstants'

const initialState = {
  templatesData: [],
  templatesErrorMessage: '',
  templatesIsFetching: false,
  templateByIdData: {},
  templateByIdErrorMessage: '',
  templateByIdIsFetching: false,
  baseTemplateByIdData: {},
  baseTemplateByIdErrorMessage: '',
  baseTemplateByIdIsFetching: false,
  templatesTypesData: [],
  templatesTypesErrorMessage: '',
  templatesTypesIsFetching: false,
  saveTemplatesData: {},
  saveTemplatesErrorMessage: '',
  saveTemplatesIsFetching: false,
  deleteTemplateByIdData: {},
  deleteTemplateByIdErrorMessage: '',
  deleteTemplateByIdIsFetching: false,
  updateTemplateByIdData: {},
  updateTemplateByIdErrorMessage: '',
  updateTemplateByIdIsFetching: false,
  saveAuditorTemplateData: {},
  saveAuditorTemplateErrorMessage: '',
  saveAuditorTemplateErrorStatus: false,
  saveAuditorTemplateIsFetching: false,
  updateTemplatesIsFetching: false,
  updateTemplatesData: {},
  updateTemplatesErrorMessage: '',
}

export default function templatesStore(state = initialState, action) {
  switch (action.type) {
    // GET
    case TemplatesConstants.GET_TEMPLATES_REQUEST:
      return {
        ...state,
        templatesIsFetching: true,
      }

    case TemplatesConstants.GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        templatesData: action.data.templates,
        templatesIsFetching: false,
      }

    case TemplatesConstants.GET_TEMPLATES_FAILED:
      return {
        ...state,
        templatesIsFetching: false,
        templatesErrorMessage: action.errorMessage,
      }

    // GET BY ID
    case TemplatesConstants.GET_TEMPLATE_BY_ID_REQUEST:
      return {
        ...state,
        templateByIdIsFetching: true,
      }

    case TemplatesConstants.GET_TEMPLATE_BY_ID_SUCCESS:
      return {
        ...state,
        templateByIdData: action.data,
        templateByIdIsFetching: false,
      }

    case TemplatesConstants.GET_TEMPLATE_BY_ID_FAILED:
      return {
        ...state,
        templateByIdIFetching: false,
        templateByIdErrorMessage: action.errorMessage,
      }

    // GET BASE BY ID
    case TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_REQUEST:
      return {
        ...state,
        baseTemplateByIdIsFetching: true,
      }

    case TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_SUCCESS:
      return {
        ...state,
        baseTemplateByIdData: action.data,
        baseTemplateByIdIsFetching: false,
      }

    case TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_FAILED:
      return {
        ...state,
        baseTemplateByIdIFetching: false,
        baseTemplateByIdErrorMessage: action.errorMessage,
      }

    // GET TEMPLATES TYPES
    case TemplatesConstants.GET_TEMPLATES_TYPES_REQUEST:
      return {
        ...state,
        templatesTypesIsFetching: true,
      }

    case TemplatesConstants.GET_TEMPLATES_TYPES_SUCCESS:
      return {
        ...state,
        templatesTypesData: action.data.types,
        templatesTypesIsFetching: false,
      }

    case TemplatesConstants.GET_TEMPLATES_TYPES_FAILED:
      return {
        ...state,
        templatesTypesIsFetching: false,
        templatesTypesErrorMessage: action.errorMessage,
      }

    // DELETE BY ID
    case TemplatesConstants.DELETE_TEMPLATE_BY_ID_REQUEST:
      return {
        ...state,
        deleteTemplateByIdIsFetching: true,
      }

    case TemplatesConstants.DELETE_TEMPLATE_BY_ID_SUCCESS:
      return {
        ...state,
        deleteTemplateByIdData: action.data,
        deleteTemplateByIdIsFetching: false,
      }

    case TemplatesConstants.DELETE_TEMPLATE_BY_ID_FAILED:
      return {
        ...state,
        deleteTemplateByIdIFetching: false,
        deleteTemplateByIdErrorMessage: action.errorMessage,
      }

    //POST
    case TemplatesConstants.SAVE_TEMPLATES_REQUEST:
      return {
        ...state,
        saveTemplatesIsFetching: true,
      }

    case TemplatesConstants.SAVE_TEMPLATES_SUCCESS:
      return {
        ...state,
        saveTemplatesData: action.data,
        saveTemplatesIsFetching: false,
      }

    case TemplatesConstants.SAVE_TEMPLATES_FAILED:
      return {
        ...state,
        saveTemplatesIsFetching: false,
        saveTemplatesErrorMessage: action.errorMessage,
      }

    //POST SAVE AUDITOR TEMPLATE
    case TemplatesConstants.SAVE_TEMPLATE_AUDITOR_REQUEST:
      return {
        ...state,
        saveAuditorTemplateIsFetching: true,
        saveAuditorTemplateErrorStatus: false,
      }

    case TemplatesConstants.SAVE_TEMPLATE_AUDITOR_SUCCESS:
      return {
        ...state,
        saveAuditorTemplateData: action.data,
        saveAuditorTemplateIsFetching: false,
        saveAuditorTemplateErrorStatus: false,
      }

    case TemplatesConstants.SAVE_TEMPLATE_AUDITOR_FAILED:
      return {
        ...state,
        saveAuditorTemplateIsFetching: false,
        saveAuditorTemplateErrorMessage: action.errorMessage,
        saveAuditorTemplateErrorStatus: true,
      }

    //POST
    case TemplatesConstants.UPDATE_TEMPLATE_REQUEST:
      return {
        ...state,
        updateTemplatesIsFetching: true,
      }

    case TemplatesConstants.UPDATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        updateTemplatesData: action.data,
        updateTemplatesIsFetching: false,
      }

    case TemplatesConstants.UPDATE_TEMPLATE_FAILED:
      return {
        ...state,
        updateTemplatesIsFetching: false,
        updateTemplatesErrorMessage: action.errorMessage,
      }

    //UPDATE TEMPLATES STORE DATA
    case TemplatesConstants.UPDATE_TEMPLATES_STORE_DATA:
      return {
        ...state,
        templatesData: action.data,
      }
    default:
      return state
  }
}