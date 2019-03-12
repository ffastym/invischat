import io from './io'

/**
 * Chat rooms
 *
 * @type {{getRoom: (function(*, *): (*|number)), createRoom: (function(): number)}}
 */
const chatRooms = {
    /**
     * Get chat roomName name
     *
     * @param rooms
     * @param gender
     *
     * @returns {*}
     */
    getRoom: (rooms, gender) => {
        let room,
            same    = rooms[gender],
            another = rooms[gender === 'male' ? 'female' : 'male'];

        if (Object.keys(another).length) {
            room = another[Object.keys(another)[0]];

            setTimeout(() => {
                io.sockets.to(room).emit('get private message', {botMessage: 'ROOM_IS_FULL'})
            }, 0);

            delete another[Object.keys(another)[0]]
        } else {
            room = chatRooms.createRoom();
            same[room] = room
        }

        return room
    },

    /**
     * Leave private room
     *
     * @param rooms
     * @param data
     */
    leaveRoom: (rooms, data) => {
        io.sockets.to(data.room).emit('get private message', {botMessage: 'INTERLOCUTOR_LEAVE'});

        if (data.destroy) { // Destroy room if it is not full and exist in rooms list
            let genderRooms = rooms[data.gender];

            if (genderRooms && Object.keys(genderRooms).length) {
                delete genderRooms[data.room]
            }
        }
    },

    /**
     * Generate roomName id
     *
     * @returns {number}
     */
    createRoom: () => {
        return Math.round(100000 + Math.random() * (999999 - 100000));
    }
};

export default chatRooms
