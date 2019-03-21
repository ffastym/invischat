/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    postsData: null
};

const forumReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            state = {
                ...state,
                postsData: action.payload
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default forumReducer
