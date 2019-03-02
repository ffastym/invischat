/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    gender           : null,
    nick             : null,
    isNewInPublic    : true,
    isLongInChat     : false,
    mutedList        : [],
    likedList        : [],
    likesCount       : 0,
    senderId         : null,
    senderNick       : null,
    interlocutorNick : null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GENDER':
            state = {
                ...state,
                gender: action.payload
            };
            break;
        case 'SET_NICK':
            state = {
                ...state,
                nick: action.payload
            };
            break;
        case 'SET_LIKES_COUNT':
            state = {
                ...state,
                likesCount: action.payload
            };
            break;
        case 'CHANGE_MUTED_LIST':
            state = {
                ...state,
                mutedList: action.payload
            };
            break;
        case 'CHANGE_LIKED_LIST':
            state = {
                ...state,
                likedList: action.payload
            };
            break;
        case 'SET_IS_NEW':
            state = {
                ...state,
                isNewInPublic: !state.isNewInPublic
            };
            break;
        case 'SET_PRIVATE_REQUEST_DATA':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'SET_INTERLOCUTOR_NICK':
            state = {
                ...state,
                interlocutorNick: action.payload
            };
            break;
        case 'SET_IS_LONG_IN_CHAT':
            state = {
                ...state,
                isLongInChat: true
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default userReducer
