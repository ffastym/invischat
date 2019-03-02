/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    isPopUpShow : false,
    type        : null
};

const popUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_POPUP' :
            state = {
                ...state,
                type        : action.payload,
                isPopUpShow : true
            };
            break;
        case 'HIDE_POPUP' :
            state = {
                ...state,
                isPopUpShow : false
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default popUpReducer
