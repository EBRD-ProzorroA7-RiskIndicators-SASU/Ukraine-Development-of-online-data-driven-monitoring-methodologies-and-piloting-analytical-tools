import * as PermissionsConstants from '../../action/permissions/PermissionsConstants'

const initialState = {
  allPermissions: [],
  allPermissionsIsFetching: false,
  allPermissionsErrorMessage: '',
}

export default function permissionsStore(state = initialState, action) {
  switch (action.type) {
    // GET
    case PermissionsConstants.GET_ALL_PERMISSIONS_REQUEST:
      return {
        ...state,
        allPermissionsIsFetching: true,
      }
    case PermissionsConstants.GET_ALL_PERMISSIONS_SUCCESS:
      return {
        ...state,
        allPermissionsIsFetching: false,
        allPermissions: action.data.permissions,
      }
    case PermissionsConstants.GET_ALL_PERMISSIONS_FAILED:
      return {
        ...state,
        allPermissionsIsFetching: false,
        allPermissionsErrorMessage: action.errorMessage,
      }

    default:
      return state
  }
}