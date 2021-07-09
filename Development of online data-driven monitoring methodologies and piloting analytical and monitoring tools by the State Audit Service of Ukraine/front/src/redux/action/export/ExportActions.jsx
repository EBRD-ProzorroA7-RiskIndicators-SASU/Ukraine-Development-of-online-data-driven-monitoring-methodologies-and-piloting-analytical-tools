import { CALL_API } from '../../../middleware/api'
import * as FileSaver from 'file-saver'

import {
  EXPORT_FILE_REQUEST,
  EXPORT_FILE_SUCCESS,
  EXPORT_FILE_FAILED,
  EXPORT_FILE_CLEAR,
} from './ExportConstants'

function fetchFileData(endpoint, requestParams, methodType = 'post') {
  return {
    [CALL_API]: {
      config: {
        responseType: 'arraybuffer',
        data: requestParams,
        method: methodType,
      },
      endpoint: endpoint,
      types: [
        EXPORT_FILE_REQUEST,
        EXPORT_FILE_SUCCESS,
        EXPORT_FILE_FAILED,
      ],
    },
  }
}

export function exportToExcel(endpoint, requestParams, filename, methodType, fetchFileDataFunc) {
  // const fileNameWithExtension = filename.match(/\.xls$|\.xlsx$/gi) ? filename : `${filename}.xlsx`
  const fileNameWithExtension = filename.match(/\.xls$/gi) ? filename : `${filename}.xls`

  return (dispatch, getState) => {
    return dispatch((fetchFileDataFunc && fetchFileDataFunc(endpoint, requestParams)) || fetchFileData(endpoint, requestParams, methodType))
      .then(() => {
        const {
          downloadData,
          downloadHeaders,
        } = getState().exportStore
        const suggestedFilename = downloadHeaders['x-suggested-filename']
        const blob = new Blob([downloadData], { type: 'application/vnd.ms-excel' })

        FileSaver.default(blob, suggestedFilename ? suggestedFilename : fileNameWithExtension)
      })
      .then(() => dispatch({
        type: EXPORT_FILE_CLEAR,
      }))
  }
}

export function exportToPdf(endpoint, requestParams, filename, methodType) {
  return (dispatch, getState) => {
    return dispatch(fetchFileData(endpoint, requestParams, methodType))
      .then(() => {
        const blob = new Blob([getState().exportStore.downloadData], { type: 'application/pdf' })
        FileSaver.default(blob, `${filename}.pdf`)
      })
      .then(() => dispatch({
        type: EXPORT_FILE_CLEAR,
      }))
  }
}