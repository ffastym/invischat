import socket from "../socket";

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
     * Set user as logged in
     *
     * @param data
     *
     * @returns {{payload: *, type: string}}
     */
    setAsLoggedIn(data) {
        let userId = data._id,
            nick = data.nick,
            login = data.nick,
            userData = {...data, userId, nick, login};

        setTimeout(socket.updateUsersList, 1000);

        delete userData.password;
        delete userData._id;

        localStorage.setItem('nick', nick);
        localStorage.setItem('unique_id', userId);

        return {
            type: 'SET_AS_LOGGED_IN',
            payload: userData
        }
    },

    /**
     * Logout
     *
     * @returns {{type: string}}
     */
    logOut: () => {
        let userData = {
                nick: null,
                login: null
            };

        localStorage.removeItem('credentials');
        localStorage.removeItem('nick');

        setTimeout(socket.updateUsersList, 1000);

        return {
            type: "LOGOUT",
            payload: userData
        }
    },

    /**
     * Change liked posts list
     *
     * @param list
     *
     * @returns {{payload: *, type: string}}
     */
    likeDislikePost: (list) => {
        return {
            type    : "LIKE_DISLIKE_POST",
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
        localStorage.setItem('liked_list', JSON.stringify(list));

        return {
            type    : 'CHANGE_LIKED_LIST',
            payload : list
        }
    },

    /**
     * Set User As moderator
     *
     * @returns {{type: string}}
     */
    setAsModerator: () => {
        return {
            type: 'SET_AS_MODERATOR'
        }
    },

    setAsNoAdmin: () => {
        return {
            type: 'SET_AS_NOADMIN'
        }
    },

    /**
     * Set ban status
     *
     * @param isBlockForce
     * @returns {{payload: boolean, type: string}}
     */
    setBanStatus: (isBlockForce = false) => {
        let isBlocked;

        if (isBlockForce) {
            isBlocked = true
        } else if (localStorage.getItem('block')) {
            isBlocked = false;
            localStorage.removeItem('block');
        } else {
            isBlocked = true;
            localStorage.setItem('block', 'blocked');
        }

        return {
            type    : 'SET_BAN_STATUS',
            payload : isBlocked
        }
    },

    /**
     * set all connected users list
     *
     * @param list
     *
     * @returns {{payload: *, type: string}}
     */
    setAllUsersList: (list) => {
        return {
            type    : 'SET_ALL_USERS_LIST',
            payload : list
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
