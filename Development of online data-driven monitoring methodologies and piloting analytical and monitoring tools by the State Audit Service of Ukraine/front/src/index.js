import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import translations from './translations'
import {IntlProvider} from 'react-redux-multilingual'
import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './redux/store/store'

import 'antd/dist/antd.css'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// const storeData = store.getState()

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider translations={translations}>
            <BrowserRouter basename="/">
                <Route path="/" component={App}/>
            </BrowserRouter>
        </IntlProvider>
    </Provider>,
    document.getElementById('root'))

// ReactDOM.render(<App />, document.getElementById('root'));nt={App} />
//  ant your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
