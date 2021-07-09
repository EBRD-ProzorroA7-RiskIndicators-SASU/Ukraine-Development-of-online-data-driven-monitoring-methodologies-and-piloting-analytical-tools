import * as TemplatesConstants from '../../action/templates/TemplatesConstants'

const initialState = {
  categoriesByTemplateId: [],
  categoriesByTemplateIdErrorMessage: '',
  categoriesByTemplateIdIsFetching: false,
  categoriesByBaseTemplateId: [],
  categoriesByBaseTemplateIdErrorMessage: '',
  categoriesByBaseTemplateIdIsFetching: false,
  saveCategoryData: {},
  saveCategoryErrorMessage: '',
  saveCategoryIsFetching: false,
  updateCategoryData: {},
  updateCategoryErrorMessage: '',
  updateCategoryIsFetching: false,
  deleteCategoryData: {},
  deleteCategoryErrorMessage: '',
  deleteCategoryIsFetching: false,
}

export default function categoriesStore(state = initialState, action) {
  switch (action.type) {
    // GET CATEGORIES BY TEMPLATE ID
    case TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_REQUEST:
      return {
        ...state,
        categoriesByTemplateIdIsFetching: true,
      }

    case TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_SUCCESS:
      return {
        ...state,
        categoriesByTemplateId: action.data.categories,
        categoriesByTemplateIdIsFetching: false,
      }

    case TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_FAILED:
      return {
        ...state,
        categoriesByTemplateIdIsFetching: false,
        categoriesByTemplateIdErrorMessage: action.errorMessage,
      }
    case TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_CLEAR:
      return {
        ...state,
        categoriesByTemplateIdIsFetching: false,
        categoriesByTemplateId: [],
        categoriesByTemplateIdErrorMessage: '',
      }

    // GET CATEGORIES BY BASE TEMPLATE ID
    case TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_REQUEST:
      return {
        ...state,
        categoriesByBaseTemplateIdIsFetching: true,
      }

    case TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_SUCCESS:
      return {
        ...state,
        categoriesByBaseTemplateId: action.data.categories,
        categoriesByBaseTemplateIdIsFetching: false,
      }

    case TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_FAILED:
      return {
        ...state,
        categoriesByBaseTemplateIdIsFetching: false,
        categoriesByBaseTemplateIdErrorMessage: action.errorMessage,
      }

    case TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_CLEAR:
      return {
        ...state,
        categoriesByBaseTemplateId: [],
        categoriesByBaseTemplateIdIsFetching: false,
        categoriesByBaseTemplateIdErrorMessage: '',
      }

    // SAVE NEW CATEGORY
    case TemplatesConstants.SAVE_CATEGORY_REQUEST:
      return {
        ...state,
        saveCategoryIsFetching: true,
      }

    case TemplatesConstants.SAVE_CATEGORY_SUCCESS:
      return {
        ...state,
        saveCategoryData: action.data,
        saveCategoryIsFetching: false,
      }

    case TemplatesConstants.SAVE_CATEGORY_FAILED:
      return {
        ...state,
        saveCategoryIsFetching: false,
        saveCategoryErrorMessage: action.error.response.data.message,
      }

    case TemplatesConstants.SAVE_CATEGORY_CLEAR:
      return {
        ...state,
        saveCategoryData: {},
        saveCategoryIsFetching: false,
        saveCategoryErrorMessage: '',
      }

    // SAVE NEW CATEGORY
    case TemplatesConstants.UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        updateCategoryIsFetching: true,
      }

    case TemplatesConstants.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        updateCategoryData: action.data,
        updateCategoryIsFetching: false,
      }

    case TemplatesConstants.UPDATE_CATEGORY_FAILED:
      return {
        ...state,
        updateCategoryIsFetching: false,
        updateCategoryErrorMessage: action.errorMessage,
      }

// SAVE NEW CATEGORY
    case TemplatesConstants.DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        deleteCategoryIsFetching: true,
      }

    case TemplatesConstants.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        deleteCategoryData: action.data,
        deleteCategoryIsFetching: false,
      }

    case TemplatesConstants.DELETE_CATEGORY_FAILED:
      return {
        ...state,
        deleteCategoryIsFetching: false,
        deleteCategoryErrorMessage: action.errorMessage,
      }

    default:
      return state
  }
}