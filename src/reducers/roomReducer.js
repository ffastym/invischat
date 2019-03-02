/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    roomName : null,
    isFull   : false
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'JOIN_ROOM':
            state = {
                ...state,
                roomName: action.payload
            };
            break;
        case 'LEAVE_ROOM':
            state = {
                ...state,
                roomName : null,
                isFull   : false
            };
            break;
        case 'SET_IS_FULL':
            state = {
                ...state,
                isFull: action.payload
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
