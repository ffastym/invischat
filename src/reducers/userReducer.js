/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    gender           : null,
    nick             : null,
    userId           : null,
    isNewInPublic    : true,
    mutedList        : [],
    likedList        : {},
    allUsersList     : {},
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
        case 'SET_ALL_USERS_LIST':
            state = {
                ...state,
                allUsersList: action.payload
            };
            break;
        case 'SET_USER_ID':
            state = {
                ...state,
                userId: action.payload
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
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default userReducer
