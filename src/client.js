"use strict"
// REACT
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// REACT-ROUTER
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index'
// IMPORT ACTIONS
import { addToCart } from './actions/cartActions';
import { postBooks, deleteBooks, updateBooks } from './actions/booksActions';

// STEP 1 create the store
const middleware = applyMiddleware(thunk);

const initialState= window.INITIAL_STATE;
const store = createStore(reducers, initialState, middleware);


import routes from './routes';
const Routes = (
	<Provider store={store}>
		{routes}
	</Provider>
)

render(
	Routes, document.getElementById('app')
);
