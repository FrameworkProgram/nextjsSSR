import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'


import reducer from './reducers';

export function initializeStore(initialState) {
    const store = createStore(
        reducer, 
        initialState, 
        composeWithDevTools(
            applyMiddleware(thunkMiddleware)
        )
    )
    return store;
}