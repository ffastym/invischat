/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    isActive: false,
    activeType: null,
    private : {
        images : [],
        index  : 0,
        activeIndex: null
    },
    public : {
        images : [],
        index  : 0,
        activeIndex: null
    }
};

const galleryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GALLERY_VISIBILITY' :
            state = {
                ...state,
                isActive: action.payload
            };
            break;
        case 'SET_ACTIVE_GALLERY_TYPE' :
            state = {
                ...state,
                activeType: action.payload
            };
            break;
        case 'ADD_TO_GALLERY':
            const type = action.payload.type;

            state = {
                ...state,
            };

            state[type].images.push(action.payload.url);
            state[type].index++;
            break;
        case 'REMOVE_FROM_GALLERY':
            state = {
                ...state
            };

            state[action.payload.type].images = action.payload.updatedGallery;
            break;
        case 'SET_ACTIVE_INDEX':
            state = {
                ...state
            };

            state[action.payload.type].activeIndex = action.payload.activeIndex;
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default galleryReducer
