/**
 * @author Yuriy Matviyuk
 */
//import logger from 'redux-logger'
import app from './reducers/appReducer'
import room from './reducers/roomReducer'
import user from './reducers/userReducer'
import gallery from './reducers/galleryReducer'
import popup from './reducers/popUpReducer'
import message from './reducers/messageReducer'
//import thunkMiddleware from 'redux-thunk'
import {createStore, combineReducers, applyMiddleware} from 'redux'

export default createStore(
    combineReducers({
        app, user, room, message, popup, gallery
    }),
    {},
    //applyMiddleware(thunkMiddleware, logger)
);
