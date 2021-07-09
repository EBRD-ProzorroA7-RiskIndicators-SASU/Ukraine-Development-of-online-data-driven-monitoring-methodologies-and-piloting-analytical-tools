import axios from 'axios'
import { setDisabledUserMessage } from '../redux/action/navigation/NavigationActions'

export let BASE_URL

if (process.env.REACT_APP_BASE_API_URL && process.env.REACT_APP_BASE_API_URL.length) {
  BASE_URL = process.env.REACT_APP_BASE_API_URL
} else {
  console.error('Environment variable REACT_APP_BASE_API_URL is not defined. Please add it to the .env file and restart the app.')
}

const callApi = (endpoint, config) => {
  const token = localStorage.getItem('kg_risks_token') || null
  if (token) {
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.headers.common['Authorization'] = token
  }

  return axios.request(endpoint, config)
    .then(response => response)
}

export const CALL_API = 'Call API'

export default store => next => action => {
  const {
    auth: {
      token,
    },
  } = store.getState()
  // const token = null
  const callAPI = action[CALL_API]

  if (!callAPI) {
    return next(action)
  }

  const { endpoint, types, config, ...params } = callAPI
  const [requestType, successType, errorType] = types

  next({
    config: config,
    type: requestType,
    ...params,
  })

  function status(response, store) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      const message = response.data.message
      switch (response.data.error_definition) {
        case 'ACCESS_TOKEN_EXPIRED':
        case 'INVALID_ACCESS_TOKEN': {
          // if (store.getState().auth.token) {
          //   store.dispatch(logoutUser(message))
          // }
          return Promise.reject(message)
        }
        default: {
          // store.dispatch(showAlert(ALERT_TYPE.danger, '', message, 0, response.data))
          return Promise.reject(message)
        }
      }
    }
  }

  return callApi(endpoint, config, token)
    .then(status)
    .then(({ data, headers, status }) => {
      if (status < 200 || status > 300) {
        next({
          errorMessage: 'There was an error',
          type: errorType,
          ...params,
        })
      } else {
        next({
          data,
          headers,
          config,
          type: successType,
          ...params,
        })
      }
    }).catch(error => {
        if (error.response) {
          status(error.response, store)
          if (error.response.status === 403) {
            localStorage.clear();
            if (!(window.location.pathname === '/login')) {
              setDisabledUserMessage(true)
              window.location = '/login'
            }
          }
        } else {
          if (config) {
            if (!config.suppress_error_message) {
              // store.dispatch(showAlert(ALERT_TYPE.danger, '', error.message))
            }
          } else {
            // store.dispatch(showAlert(ALERT_TYPE.danger, '', error.message))
          }
        }

        next({
          type: errorType,
          config: config,
          ...params,
          error,
        })
      },
    )
}
