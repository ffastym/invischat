/**
 * @author Yuriy Matviyuk
 */
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './components/App'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import socket from "./socket";

/**
 * Connect to socket
 */
socket.connect();

ReactDOM.hydrate((
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
), document.getElementById('root'));
serviceWorker.register();

