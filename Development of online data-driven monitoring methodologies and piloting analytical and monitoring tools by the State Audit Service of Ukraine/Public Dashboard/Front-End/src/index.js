import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import 'antd/dist/antd.css';
import "./index.scss";
import App from "./App";
import store from "./redux/store";
import * as numeral from 'numeral';

numeral.register('locale', 'ua', {
  delimiters: {
    thousands: ' ',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'тис.',
    million: 'млн.',
    billion: 'млрд.',
    trillion: 'трлн.',
  },
})

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
