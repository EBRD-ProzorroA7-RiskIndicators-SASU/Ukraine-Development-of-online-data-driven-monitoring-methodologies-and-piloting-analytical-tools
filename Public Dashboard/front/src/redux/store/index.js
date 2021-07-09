import { createStore, applyMiddleware, compose } from "redux";
import { apiMiddleware } from 'redux-api-middleware';
import reducers from "../reducers";
import thunk from "redux-thunk";

const middleware = [thunk, apiMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middleware))
);

window.store = store;

// store.subscribe(() => console.log(store.getState()));

export default store;
