/**
 * @author Yuriy Matviyuk
 */
const appActions = {
    /**
     * Toggle menu
     *
     * @returns {{type: string}}
     */
    toggleMenu: () => {
        return {
            type: 'TOGGLE_MENU'
        }
    },

    /**
     * Set connection status
     *
     * @param isConnected
     * @returns {{payload: *, type: string}}
     */
    setConnectionStatus: (isConnected) => {
        return {
            type    : 'SET_CONNECTION_STATUS',
            payload : isConnected
        }
    },

    /**
     * Set redirection to chat status
     *
     * @param isNeedRedirect
     * @returns {{payload: *, type: string}}
     */
    setRedirectionStatus: (isNeedRedirect) => {
        return {
            type    : 'SET_REDIRECTION_STATUS',
            payload : isNeedRedirect
        }
    },

    /**
     * Set is in chat
     *
     * @param isInChat
     *
     * @returns {{payload: *, type: string}}
     */
    setIsInChat: (isInChat) => {
        return {
            type    : 'SET_IS_IN_CHAT',
            payload : isInChat
        }
    },

    /**
     * Set chat theme
     *
     * @param theme = null
     *
     * @returns {{type: string}}
     */
    setTheme: (theme = null) => {
        if (!theme) {
            theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
        }

        localStorage.setItem('theme', theme);

        return {
            type    : 'SET_THEME',
            payload : theme
        }
    },

    /**
     * On/off notifications
     *
     * @returns {{type: string}}
     */
    changeNotifications: () => {
        return {
            type: 'CHANGE_NOTIFICATIONS'
        }
    },

    /**
     * Set device type
     *
     * @param isMobile
     *
     * @returns {{payload: *, type: string}}
     */
    setDeviceType: (isMobile) => {
        return {
            type    : 'SET_DEVICE_TYPE',
            payload : isMobile
        }
    },

    /**
     * Set chat position
     *
     * @param position
     *
     * @returns {{payload: string, type: string}}
     */
    setChatPosition: (position = null) => {
        return {
            type    : 'SET_CHAT_POSITION',
            payload : position
        }
    },

    /**
     * Change online users count
     *
     * @param count
     * @returns {{payload: *, type: string}}
     */
    changeOnlineCount: (count) => {
        return {
            type    : 'CHANGE_ONLINE_COUNT',
            payload : count
        }
    }
};

export default appActions;
