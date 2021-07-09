import {
  GET_DATA_FOR_RESOURCES_PAGE_REQUEST,
  GET_DATA_FOR_RESOURCES_PAGE_ERROR,
  GET_DATA_FOR_RESOURCES_PAGE_SUCCESS
} from "../constants";

import { RSAA } from "redux-api-middleware";
import { BASE_URL, RESOURCES_PAGE } from "../../api/constants";

export const getDataForResourcesPage = (startDate, endDate) => {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}${RESOURCES_PAGE}startDate=${startDate}&endDate=${endDate}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      types: [
        GET_DATA_FOR_RESOURCES_PAGE_REQUEST,
        GET_DATA_FOR_RESOURCES_PAGE_SUCCESS,
        GET_DATA_FOR_RESOURCES_PAGE_ERROR,
      ],
    },
  };
};
