import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from '../../middleware/api'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducer/index'

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        api,
        createLogger(),
      ),
    ),
  )

  if (module.hot) {
    module.hot.accept('../reducer/index', () => {
      const nextRootReducer = require('../reducer/index')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
