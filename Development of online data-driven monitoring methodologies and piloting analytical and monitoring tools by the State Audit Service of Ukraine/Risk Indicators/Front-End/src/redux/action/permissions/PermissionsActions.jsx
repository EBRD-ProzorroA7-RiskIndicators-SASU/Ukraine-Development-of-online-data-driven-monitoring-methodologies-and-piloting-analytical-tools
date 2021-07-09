import { CALL_API } from '../../../middleware/api'
import { apiEndpoints } from '../../../services/ApiEndpointsConstants'
import {
  PERMISSIONS,
} from '../../../services/ApiEndpointsConstants'
import * as PermissionsConstants from './PermissionsConstants'

export function getAllPermissions() {
  return {
    [CALL_API]: {
      endpoint: apiEndpoints().entity(PERMISSIONS),
      types: [
        PermissionsConstants.GET_ALL_PERMISSIONS_REQUEST,
        PermissionsConstants.GET_ALL_PERMISSIONS_SUCCESS,
        PermissionsConstants.GET_ALL_PERMISSIONS_FAILED,
      ],
    },
  }
}
