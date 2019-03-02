/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    private: {
        text            : '',
        imageUrl        : null,
        imagePublicId   : null,
        IsUploadedImage : false,
        quotedMessage   : null,
        quotedImage     : null
    },
    public: {
        text            : '',
        imageUrl        : null,
        imagePublicId   : null,
        IsUploadedImage : false,
        quotedMessage   : null,
        quotedImage     : null
    },
    publicColor : null,
    newMessagesQty: 0
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MESSAGE_TEXT':
            state = {
                ...state
            };

            state[action.payload.type] = {
                ...state[action.payload.type],
                text: action.payload.text
            };
            break;
        case 'SET_IS_UPLOADED_IMAGE':
            state = {
                ...state
            };

            state[action.payload.type] = {
                ...state[action.payload.type],
                isUploadedImage: action.payload.isUploaded
            };
            break;
        case 'SET_PUBLIC_COLOR':
            state = {
                ...state,
                publicColor: action.payload
            };
            break;
        case 'SET_NEW_MESSAGES_QTY':
            state = {
                ...state,
                newMessagesQty: action.payload
            };
            break;
        case 'RESET_MESSAGE_DATA':
            const type = action.payload;

            state = {
                ...state
            };

            state[type] = initialState[type];
            break;
        case 'SET_IMAGE_URL':
            state = {
                ...state
            };

            state[action.payload.type] = {
                ...state[action.payload.type],
                imageUrl: action.payload.imageUrl
            };
            break;
        case 'SET_QUOTE':
            state = {
                ...state
            };

            state[action.payload.type] = {
                ...state[action.payload.type],
                quotedMessage: action.payload.message,
                quotedImage: action.payload.image,
            };
            break;
        case 'SET_IMAGE_PUBLIC_ID':
            state = {
                ...state
            };

            state[action.payload.type] = {
                ...state[action.payload.type],
                imagePublicId: action.payload.id
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default messageReducer
