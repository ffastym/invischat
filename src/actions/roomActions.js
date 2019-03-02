/**
 * @author Yuriy Matviyuk
 */
const roomActions = {
    /**
     * Join private chat roomName
     *
     * @param room
     *
     * @returns {{type: string}}
     */
    joinRoom: (room) => {
        return {
            type: 'JOIN_ROOM',
            payload: room
        }
    },

    /**
     * Set is full room
     *
     * @param isFull
     *
     * @returns {{type: string}}
     */
    setIsFull: (isFull) => {
        return {
            type    : 'SET_IS_FULL',
            payload : isFull
        }
    },

    /**
     * Leave private chat roomName
     *
     * @returns {{type: string}}
     */
    leaveRoom: () => {
        return {
            type: 'LEAVE_ROOM'
        }
    }
};

export default roomActions;
