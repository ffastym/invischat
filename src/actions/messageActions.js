/**
 * @author Yuriy Matviyuk
 */
const messageActions = {
    /**
     * Set message text
     *
     * @param text
     *
     * @returns {{payload: *, type: string}}
     */
    setMessageText: (text) => {
        return {
            type    : 'SET_MESSAGE_TEXT',
            payload : text
        }
    },

    /**
     * Set quantity on new messages in not active chat
     *
     * @param qty
     *
     * @returns {{payload: *, type: string}}
     */
    setNewMessagesQty: (qty) => {
        return {
            type    : 'SET_NEW_MESSAGES_QTY',
            payload : qty
        }
    },

    /**
     * Set Quote
     *
     * @param quoteData
     *
     * @returns {{payload: *, type: string}}
     */
    setQuote: (quoteData) => {
        return {
            type: 'SET_QUOTE',
            payload: quoteData
        }
    },

    /**
     * Set uploaded image url
     *
     * @param url
     *
     * @returns {{payload: *, type: string}}
     */
    setImageUrl: (url) => {
        return {
            type: 'SET_IMAGE_URL',
            payload: url
        }
    },

    /**
     * Set uploaded image public id
     *
     * @param id
     *
     * @returns {{payload: *, type: string}}
     */
    setImagePublicId: (id) => {
        return {
            type: 'SET_IMAGE_PUBLIC_ID',
            payload: id
        }
    },

    /**
     * Reset message data
     *
     * @param type
     *
     * @returns {{payload: *, type: string}}
     */
    resetMessageData: (type) => {
        return {
            type    : 'RESET_MESSAGE_DATA',
            payload : type
        }
    },

    /**
     * Set is uploaded image
     *
     * @param isUploaded
     *
     * @returns {{payload: *, type: string}}
     */
    setIsUploadedImage: (isUploaded) => {
        return {
            type    : 'SET_IS_UPLOADED_IMAGE',
            payload : isUploaded
        }
    },

    /**
     * Set public messages color
     *
     * @returns {{payload: string, type: string}}
     */
    setPublicColor: () => {
        let letters = '0123456789',
            color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }

        return {
            type    : 'SET_PUBLIC_COLOR',
            payload : color
        }
    }
};

export default messageActions;
