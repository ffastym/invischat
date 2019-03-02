/**
 * @author Yuriy Matviyuk
 */
import appActions from '../../actions/appActions'
import React from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import messageActions from "../../actions/messageActions";

/**
 * Header component
 * @param props
 * @returns {*}
 * @constructor
 */
const Header = (props) => {
    let burgerClassName = props.isNavActive
            ? 'action menu-burger active'
            : 'action menu-burger',
        chatSwitchClassName = props.unreadMessagesCount
            ? 'action chat-switch unread'
            : 'action chat-switch',
        themeSwitchClassName = props.theme === 'dark'
            ? 'action theme-switch dark'
            : 'action theme-switch',
        notificationsSwitchClassName = props.isNotificationsEnabled
            ? 'action notifications-switch'
            : 'action notifications-switch active';

    return (
        <header>
            <NavLink exact={true} to='/' className='logo'>
                <h1>Invischat</h1>
            </NavLink>
            <div className='actions'>
                <span className="action now-online"
                      title="now online">{props.onlineCount}
                </span>
                <span className={notificationsSwitchClassName}
                      onClick={props.changeNotifications}
                      title='on/off notifications'
                />
                <span className={themeSwitchClassName}
                      onClick={props.setTheme}
                      title='change theme'
                />
                {props.isInChat && props.isMobile && <span className={chatSwitchClassName}
                      onClick={props.changeChatPosition}
                      title='switch chat'
                      children={props.newMessagesQty ?
                          <span className='new-qty'>{props.newMessagesQty}</span> : false}
                />}
                <span className={burgerClassName}
                      onClick={props.toggleMenu}
                      title='show menu'>
                </span>
            </div>
        </header>
    )
};

const mapStateToProps = (state) => {
    return {
        chatPosition           : state.app.chatPosition,
        isMobile               : state.app.isMobile,
        isInChat               : state.app.isInChat,
        isNavActive            : state.app.isNavActive,
        isNotificationsEnabled : state.app.isNotificationsEnabled,
        newMessagesQty         : state.message.newMessagesQty,
        onlineCount            : state.app.onlineCount,
        theme                  : state.app.theme,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Toggle menu
         */
        toggleMenu: () => {
            dispatch(appActions.toggleMenu())
        },

        /**
         * Set Chat Theme
         */
        setTheme: () => {
            dispatch(appActions.setTheme())
        },

        /**
         * Switch between chat windows
         */
        changeChatPosition: () => {
            dispatch(appActions.setChatPosition());
            dispatch(messageActions.setNewMessagesQty(0))
        },

        /**
         * On/off notifications
         */
        changeNotifications: () => {
            dispatch(appActions.changeNotifications())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
