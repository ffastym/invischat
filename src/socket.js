import io from 'socket.io-client'
import store from './store'
import appActions from "./actions/appActions"
import userActions from "./actions/userActions"
import roomActions from "./actions/roomActions";
import messageActions from "./actions/messageActions";

const socket = {
    /**
     * Socket.io
     */
    io: io,

    /**
     * Chat namespace
     */
    chat: null,

    /**
     * Connect to socket
     */
    connect: () => {
        socket.chat = socket.io(/*'localhost:3001'*/);

        return socket
    },

    /**
     * Subscribe to joining private room
     *
     * @returns socket object
     */
    subscribeJoinRoom: () => {
        socket.chat.off('joined room').on('joined room', (room) => {
            store.dispatch(roomActions.joinRoom(room))
        });

        return socket
    },

    /**
     * Subscribe changing clients count
     *
     * @returns {{io: lookup, chat: null, subscribeJoinRoom: (function()), sendMessage: socket.sendMessage, subscribeUsersCount: (function()), connectToServer: socket.connectToServer}}
     */
    subscribeUsersCount: () => {
        socket.chat.off('change clients count').on('change clients count', (count) => {
            store.dispatch(appActions.changeOnlineCount(count))
        });

        return socket
    },

    /**
     * Leave chat (after destroy chat component)
     */
    leaveChat: () => {
        socket.chat.emit('leave chat');
        socket.leaveRoom();
    },

    /**
     * Leave private room
     */
    leaveRoom: () => {
        const state = store.getState();

        if (state.room.roomName || state.user.gender) {
            return socket;
        }
        const data = {
            room    : state.room.roomName,
            gender  : state.user.gender,
            destroy : !state.room.isFull
        };

        socket.chat.emit('leave room', data);
        store.dispatch(roomActions.leaveRoom());

        return socket
    },

    /**
     * Try to rejoin private room
     */
    reJoinRoom: () => {
        const state = store.getState();

        if (state.room.roomName) {
            socket.chat.emit('rejoin room', {
                room   : state.room.roomName,
                gender : state.user.gender,
                isFull : state.room.isFull
            })
        }

        return socket;
    },

    /**
     * Join to chat
     */
    joinChat: () => {
        socket.chat.emit('join chat', store.getState().user.gender);

        return socket
    },

    /**
     * Search new interlocutor in private chat
     *
     * @returns {{refreshChat: (function()), io: lookup, chat: null, leaveRoom: (function()), subscribeJoinRoom: (function()), reJoinRoom: socket.reJoinRoom, joinChat: (function()), sendMessage: (function(*)), subscribeUsersCount: (function()), connect: (function())}}
     */
    searchNew: () => {
        if (store.getState().room.roomName) {
            socket.leaveRoom();
        }

        if (store.getState().user.gender) {
            socket.joinChat();
        }

        return socket;
    },

    /**
     * Set user nick name
     *
     * @param nick
     */
    setNick: (nick) => {
        store.dispatch(userActions.setNick(nick));
        socket.addToPublicList();

        return socket
    },

    /**
     * Join public add user to public list
     *
     * @returns {{refreshChat: (function()), io: lookup, chat: null, leaveRoom: (function()), subscribeJoinRoom: (function()), reJoinRoom: socket.reJoinRoom, setNick: (function(*=)), joinChat: (function()), addToPublicList: (function()), sendMessage: (function(*)), subscribeUsersCount: (function()), connect: (function())}}
     */
    addToPublicList: () => {
        const state = store.getState(),
              userData = {
                  nick      : state.user.nick,
                  userId    : state.user.userId,
                  isVIP     : state.user.isVIP,
                  isBlocked : state.user.isBlocked,
                  color     : state.message.publicColor
              };

        if (state.user.isNewInPublic) {
            socket.chat.emit('connect to public chat', userData);
            store.dispatch(userActions.setIsNew());
        } else {
            socket.chat.emit('reconnect to public chat', userData)
        }

        return socket
    },

    /**
     * Subscribe for changes users in public chat
     */
    subscribeChangeClients: () => {
        socket.chat.off('change clients').on('change clients', (list) => {
            store.dispatch(userActions.setAllUsersList(list))
        })
    },

    /**
     * Send message
     *
     * @param message
     */
    sendMessage: (message) => {
        if (message.text || message.imageUrl || message.quotedImage || message.quotedMessage) {
            const messageId = Math.round(100000 + Math.random() * (999999 - 100000)),
                state = store.getState(),
                type = message.type;

            socket.chat.emit('send ' + type + ' message', {
                ...message,
                publicColor: type === 'public' && state.message.publicColor,
                messageId: messageId,
                key: messageId,
                gender: state.user.gender,
                nick: state.user.nick,
                socketId: socket.chat.id,
                room: message.type === 'private' ? state.room.roomName : null
            });

            document.getElementById(type + '_message').innerHTML = '';
            store.dispatch(messageActions.resetMessageData(type))
        }

        return socket
    }
};

export default socket;
