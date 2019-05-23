/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './Auth/auth-reducer'

export default function (initialState = {}) {

    const enhancers = [
        applyMiddleware(thunk),
    ]

    if (process.env.NODE_ENV !== 'production') {

        window.devToolsExtension && enhancers.push(window.devToolsExtension())
    }

    const store = createStore(rootReducer, initialState, compose(...enhancers))

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./Auth/auth-reducer').default
            store.replaceReducer(nextReducer)
        })
    }

    return store
}