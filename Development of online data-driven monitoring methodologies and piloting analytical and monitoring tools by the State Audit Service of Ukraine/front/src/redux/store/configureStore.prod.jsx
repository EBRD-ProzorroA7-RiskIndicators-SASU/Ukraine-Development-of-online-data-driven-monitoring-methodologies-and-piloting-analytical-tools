import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducer/index'
import thunk from 'redux-thunk'
import api from '../../middleware/api'

const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunk,
      api,
    )
  )
}

export default configureStore
