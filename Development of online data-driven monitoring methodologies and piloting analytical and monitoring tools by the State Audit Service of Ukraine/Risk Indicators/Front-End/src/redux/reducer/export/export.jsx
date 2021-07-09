import * as ExportConstants from '../../action/export/ExportConstants'

const initialState = {
  downloadData: '',
  downloadHeaders: '',
  downloadIsFetching: false,
  downloadErrorMessage: '',
}

export default function exportStore(state = initialState, action) {
  switch (action.type) {
    // GET ALL DICTIONARY
    case ExportConstants.EXPORT_FILE_REQUEST:
      return {
        ...state,
        downloadIsFetching: true,
      }
    case ExportConstants.EXPORT_FILE_SUCCESS:
      return {
        ...state,
        downloadIsFetching: false,
        downloadData: action.data,
        downloadHeaders: action.headers,
      }
    case ExportConstants.EXPORT_FILE_FAILED:
      return {
        ...state,
        downloadIsFetching: false,
        downloadErrorMessage: action.errorMessage,
      }
    case ExportConstants.EXPORT_FILE_CLEAR:
      return {
        ...state,
        downloadIsFetching: false,
        downloadErrorMessage: '',
      }

    default:
      return state
  }
}