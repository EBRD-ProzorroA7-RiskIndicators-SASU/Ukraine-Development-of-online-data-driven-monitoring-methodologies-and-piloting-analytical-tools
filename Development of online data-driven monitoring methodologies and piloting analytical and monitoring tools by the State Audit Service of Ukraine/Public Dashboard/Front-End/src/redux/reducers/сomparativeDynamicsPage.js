import {
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_ERROR,
  GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE__SUCCESS,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_REQUEST,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_ERROR,
  GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_SUCCESS,
} from "../constants";

const initialState = {
  isLoading: false,
  hasErrors: false,
  success: false,
  comparativeData: null,
};

export const comparativeDynamicsPageData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_DATA_FOR_COMPARATIVE_DYNAMICS_PAGE__SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        comparativeData: payload,
      };

    case GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasErrors: false,
      };

    case GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_ERROR:
      return {
        ...state,
        isLoading: false,
        hasErrors: true,
        success: false,
      };

    case GET_REGIONS_DATA_COMPARATIVE_DYNAMICS_PAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasErrors: false,
        success: true,
        comparativeData: payload,
      };

    default:
      return state;
  }
};
