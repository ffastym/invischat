/**
 * @author Yuriy Matviyuk
 */
import app from './reducers/appReducer'
import gallery from './reducers/galleryReducer'
import logger from 'redux-logger'
import message from './reducers/messageReducer'
import popup from './reducers/popUpReducer'
import room from './reducers/roomReducer'
import thunk from 'redux-thunk'
import user from './reducers/userReducer'
import {createStore, combineReducers, applyMiddleware} from 'redux'

let middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
    middleware = [...middleware, logger]
}

export default createStore(
    combineReducers({
        app, user, room, message, popup, gallery
    }),
    {},
    applyMiddleware(...middleware)
);
