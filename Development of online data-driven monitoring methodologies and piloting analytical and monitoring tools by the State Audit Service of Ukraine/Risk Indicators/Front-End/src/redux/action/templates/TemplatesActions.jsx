import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  TEMPLATES,
  TEMPLATE_BY_ID,
  TEMPLATE_BY_ID_AND_CATEGORIES,
  CATEGORIES,
  QUESTIONS_OF_CATEGORY,
  QUESTIONS,
  DELETE_CATEGORY,
  DELETE_QUESTION,
  TEMPLATES_TYPES,
  TEMPLATES_BASE,
  TEMPLATES_AUDITOR,
} from '../../../services/ApiEndpointsConstants'
import * as TemplatesConstants from './TemplatesConstants'

export function fetchTemplates() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATES),
      types: [
        TemplatesConstants.GET_TEMPLATES_REQUEST,
        TemplatesConstants.GET_TEMPLATES_SUCCESS,
        TemplatesConstants.GET_TEMPLATES_FAILED,
      ],
    },
  }
}

export function fetchTemplateById(templateId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATE_BY_ID).replace('{id}', templateId),
      types: [
        TemplatesConstants.GET_TEMPLATE_BY_ID_REQUEST,
        TemplatesConstants.GET_TEMPLATE_BY_ID_SUCCESS,
        TemplatesConstants.GET_TEMPLATE_BY_ID_FAILED,
      ],
    },
  }
}

export function fetchBaseTemplateById(templateId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATE_BY_ID).replace('{id}', templateId),
      types: [
        TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_REQUEST,
        TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_SUCCESS,
        TemplatesConstants.GET_BASE_TEMPLATE_BY_ID_FAILED,
      ],
    },
  }
}

export function deleteTemplateById(templateId) {
  return {
    [CALL_API]: {
      config: { method: 'delete' },
      endpoint: apiEndpoints().entity(TEMPLATE_BY_ID).replace('{id}', templateId),
      types: [
        TemplatesConstants.DELETE_TEMPLATE_BY_ID_REQUEST,
        TemplatesConstants.DELETE_TEMPLATE_BY_ID_SUCCESS,
        TemplatesConstants.DELETE_TEMPLATE_BY_ID_FAILED,
      ],
    },
  }
}

export function saveNewTemplate(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(TEMPLATES_BASE),
      types: [
        TemplatesConstants.SAVE_TEMPLATES_REQUEST,
        TemplatesConstants.SAVE_TEMPLATES_SUCCESS,
        TemplatesConstants.SAVE_TEMPLATES_FAILED,
      ],
    },
  }
}

export function saveNewTemplateFromDefault(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(TEMPLATES_AUDITOR),
      types: [
        TemplatesConstants.SAVE_TEMPLATE_AUDITOR_REQUEST,
        TemplatesConstants.SAVE_TEMPLATE_AUDITOR_SUCCESS,
        TemplatesConstants.SAVE_TEMPLATE_AUDITOR_FAILED,
      ],
    },
  }
}

export function updateTemplateName(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'put' },
      endpoint: apiEndpoints().entity(TEMPLATES),
      types: [
        TemplatesConstants.UPDATE_TEMPLATE_REQUEST,
        TemplatesConstants.UPDATE_TEMPLATE_SUCCESS,
        TemplatesConstants.UPDATE_TEMPLATE_FAILED,
      ],
    },
  }
}

export function updateTemplatesStore(templates) {
  return {
    type: TemplatesConstants.UPDATE_TEMPLATES_STORE_DATA,
    data: templates,
  }
}


export function getCategoriesOfTemplateById(templateId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATE_BY_ID_AND_CATEGORIES).replace('{id}', templateId),
      types: [
        TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_REQUEST,
        TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_SUCCESS,
        TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_FAILED,
      ],
    },
  }
}

export function clearCategoriesOfTemplateById() {
  return {
    type: TemplatesConstants.GET_CATEGORIES_OF_TEMPLATES_BY_ID_CLEAR,
  }
}

export function getCategoriesOfBaseTemplateById(templateId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATE_BY_ID_AND_CATEGORIES).replace('{id}', templateId),
      types: [
        TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_REQUEST,
        TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_SUCCESS,
        TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_FAILED,
      ],
    },
  }
}

export function clearCategoriesOfBaseTemplateById() {
  return {
    type: TemplatesConstants.GET_CATEGORIES_OF_BASE_TEMPLATES_BY_ID_CLEAR,
  }
}


export function saveNewCategory(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(CATEGORIES),
      types: [
        TemplatesConstants.SAVE_CATEGORY_REQUEST,
        TemplatesConstants.SAVE_CATEGORY_SUCCESS,
        TemplatesConstants.SAVE_CATEGORY_FAILED,
      ],
    },
  }
}

export function clearCategoryResponse() {
  return {
    type: TemplatesConstants.SAVE_CATEGORY_CLEAR,
  }
}

export function updateCategoryName(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'put' },
      endpoint: apiEndpoints().entity(CATEGORIES),
      types: [
        TemplatesConstants.UPDATE_CATEGORY_REQUEST,
        TemplatesConstants.UPDATE_CATEGORY_SUCCESS,
        TemplatesConstants.UPDATE_CATEGORY_FAILED,
      ],
    },
  }
}

export function deleteCategoryName(categoryId) {
  return {
    [CALL_API]: {
      config: { method: 'delete' },
      endpoint: apiEndpoints().entity(DELETE_CATEGORY).replace('{id}', categoryId),
      types: [
        TemplatesConstants.DELETE_CATEGORY_REQUEST,
        TemplatesConstants.DELETE_CATEGORY_SUCCESS,
        TemplatesConstants.DELETE_CATEGORY_FAILED,
      ],
    },
  }
}

export function getQuestionsOfCategoryById(categoryId) {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(QUESTIONS_OF_CATEGORY).replace('{id}', categoryId),
      types: [
        TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_REQUEST,
        TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_SUCCESS,
        TemplatesConstants.GET_QUESTIONS_OF_CATEGORY_BY_ID_FAILED,
      ],
    },
  }
}

export function saveNewQuestion(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'post' },
      endpoint: apiEndpoints().entity(QUESTIONS),
      types: [
        TemplatesConstants.SAVE_QUESTION_REQUEST,
        TemplatesConstants.SAVE_QUESTION_SUCCESS,
        TemplatesConstants.SAVE_QUESTION_FAILED,
      ],
    },
  }
}


export function clearQuestionResponse() {
  return {
    type: TemplatesConstants.SAVE_QUESTION_CLEAR,
  }
}

export function updateQuestion(requestParams) {
  return {
    [CALL_API]: {
      config: { data: requestParams, method: 'put' },
      endpoint: apiEndpoints().entity(QUESTIONS),
      types: [
        TemplatesConstants.UPDATE_QUESTION_REQUEST,
        TemplatesConstants.UPDATE_QUESTION_SUCCESS,
        TemplatesConstants.UPDATE_QUESTION_FAILED,
      ],
    },
  }
}

export function deleteQuestion(questionId) {
  return {
    [CALL_API]: {
      config: { method: 'delete' },
      endpoint: apiEndpoints().entity(DELETE_QUESTION).replace('{id}', questionId),
      types: [
        TemplatesConstants.DELETE_QUESTION_REQUEST,
        TemplatesConstants.DELETE_QUESTION_SUCCESS,
        TemplatesConstants.DELETE_QUESTION_FAILED,
      ],
    },
  }
}

export function getTemplateTypesAll() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(TEMPLATES_TYPES),
      types: [
        TemplatesConstants.GET_TEMPLATES_TYPES_REQUEST,
        TemplatesConstants.GET_TEMPLATES_TYPES_SUCCESS,
        TemplatesConstants.GET_TEMPLATES_TYPES_FAILED,
      ],
    },
  }
}


