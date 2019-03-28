/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    chatPosition           : 0, // 0 means active chat is private
    isConnected            : true,
    isMobile               : true,
    isNavActive            : false,
    isNeedRedirect         : true,
    isInChat               : false,
    isAcceptCookies        : false,
    isNotificationsEnabled : true,
    onlineCount            : null,
    theme                  : 'light'
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_MENU':
            state = {
                ...state,
                isNavActive: !state.isNavActive
            };
            break;
        case 'ACCEPT_COOKIES':
            state = {
                ...state,
                isAcceptCookies: true
            };
            break;
        case 'SET_CHAT_POSITION':
            state = {
                ...state,
                chatPosition: action.payload === null
                    ? state.chatPosition === 0
                        ? -window.innerWidth
                        : 0
                    : action.payload
            };
            break;
        case 'SET_IS_IN_CHAT':
            state = {
                ...state,
                isInChat: action.payload
            };
            break;
        case 'SET_CONNECTION_STATUS':
            state = {
                ...state,
                isConnected: action.payload
            };
            break;
        case 'SET_REDIRECTION_STATUS':
            state = {
                ...state,
                isNeedRedirect: action.payload
            };
            break;
        case 'SET_THEME':
            state = {
                ...state,
                theme: action.payload
            };
            break;
        case 'SET_DEVICE_TYPE':
            state = {
                ...state,
                isMobile: action.payload
            };
            break;
        case 'CHANGE_NOTIFICATIONS':
            state = {
                ...state,
                isNotificationsEnabled: !state.isNotificationsEnabled
            };
            break;
        case 'CHANGE_ONLINE_COUNT':
            state = {
                ...state,
                onlineCount: action.payload
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default appReducer
