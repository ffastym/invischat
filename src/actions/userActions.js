/**
 * @author Yuriy Matviyuk
 */
const userActions = {
    /**
     * Set user gender
     *
     * @param gender
     *
     * @returns {{payload: *, type: string}}
     */
    setGender: (gender) => {
        localStorage.setItem('gender', gender);
        
        return {
            type    : 'SET_GENDER',
            payload : gender
        }
    },

    /**
     * Set unique user id
     *
     * @param id
     *
     * @returns {{payload: *, type: string}}
     */
    setUserId: (id) => {
        return {
            type    : 'SET_USER_ID',
            payload : id
        }
    },

    /**
     * Mute/unmute list
     *
     * @param list
     *
     * @returns {{payload: *, type: string}}
     */
    changeMutedList: (list) => {
        return {
            type    : 'CHANGE_MUTED_LIST',
            payload : list
        }
    },

    /**
     * Set likes count
     *
     * @param qty
     *
     * @returns {{payload: *, type: string}}
     */
    setLikesCount: (qty) => {
        return {
            type    : 'SET_LIKES_COUNT',
            payload : qty
        }
    },

    /**
     * Like/dislike user
     *
     * @param list
     *
     * @returns {{payload: *, type: string}}
     */
    changeLikedList: (list) => {
        return {
            type    : 'CHANGE_LIKED_LIST',
            payload : list
        }
    },

    /**
     * Set user as long in chat
     *
     * @returns {{type: string}}
     */
    setIsLongInChat: () => {
        return {
            type: 'SET_IS_LONG_IN_CHAT'
        }
    },

    /**
     * Set interlocutor nick name
     *
     * @param nick
     * @returns {{payload: *, type: string}}
     */
    setInterlocutorNick: (nick) => {
        return {
            type    : 'SET_INTERLOCUTOR_NICK',
            payload : nick
        }
    },

    /**
     * Set private request senders data
     *
     * @param data: object
     *
     * @returns {{payload: object, type: string}}
     */
    setPrivateRequestData: (data) => {
        return {
            type: 'SET_PRIVATE_REQUEST_DATA',
            payload: data
        }
    },

    /**
     * Set is new in public
     *
     * @returns {{type: string}}
     */
    setIsNew: () => {
        return {
            type: 'SET_IS_NEW'
        }
    },

    /**
     * Set user nickName
     *
     * @param nick
     *
     * @returns {{payload: *, type: string}}
     */
    setNick: (nick) => {
        return {
            type: 'SET_NICK',
            payload: nick
        }
    }
};

export default userActions;
