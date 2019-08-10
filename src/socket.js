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
        socket.chat = socket.io(process.env.NODE_ENV === 'development' ? 'localhost:3001' : '');

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

        if (!state.room.roomName || !state.user.gender) {
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
        const gender = store.getState().user.gender;

        if (!gender) {
            return socket
        }

        socket.chat.emit('join chat', gender);

        return socket
    },

    /**
     * Search new interlocutor in private chat
     *
     * @returns socket
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
        socket.updateUsersList();

        return socket
    },

    /**
     * Join public add user to public list
     */
    updateUsersList: () => {
        const state = store.getState(),
              userData = {
                  nick      : state.user.nick,
                  userId    : state.user.userId,
                  isVIP     : state.user.isVIP,
                  isBlocked : state.user.isBlocked,
                  color     : state.message.publicColor
              };

        if (state.user.nick && state.user.isNewInPublic) {
            socket.chat.emit('connect to public chat', userData);
            store.dispatch(userActions.setIsNew());
        } else {
            socket.chat.emit('reconnect to public chat', userData)
        }
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

            let date = new Date(),
                hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
                minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

            let messageData = {
                ...message,
                publicColor: type === 'public' && state.message.publicColor,
                messageId: messageId,
                key: messageId,
                date: hours + ':' + minutes,
                type: type,
                gender: state.user.gender,
                nick: state.user.nick,
                status: type === 'public' && state.user.status,
                userId: type === 'public' && state.user.userId,
                isNoAdmin: state.user.isNoAdmin,
                socketId: socket.chat.id,
                room: message.type === 'private' ? state.room.roomName : null
            };

            store.dispatch(messageActions.sendFakeMessage(messageData))

            document.getElementById(type + '_message').innerHTML = '';
            store.dispatch(messageActions.resetMessageData(type))

          if (state.user.isBlocked) {
            return
          }

          socket.chat.emit('send ' + type + ' message', {...messageData, success: true});
        }

        return socket
    }
};

export default socket;
