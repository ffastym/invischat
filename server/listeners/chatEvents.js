/**
 * @author Yuriy Matviyuk
 */
import io from '../io'
import chatRooms from '../chatRooms'
import Cloudinary from '../cloudinary';
import MailSender from '../email'

let clientsCount = 0,
    users = {},
    allUsers = [],
    rooms = {
        male   : [],
        female : []
    };

/**
 * Listening events from chat
 */
io.on('connection', (socket) => {
    // Increment clients count after new user connection
    io.emit('change clients count', ++clientsCount);

    socket.on('disconnect', () => {
        // Decrement clients count after new user connection
        delete users[socket.id];
        io.emit('change clients', users);
        io.emit('change clients count', --clientsCount)
    });

    socket.on('all users update', (data) => {
        if (data.isRemove && allUsers.indexOf(data.id) !== -1) {
            allUsers.splice(allUsers.indexOf(data.id), 1)
        } else if(allUsers.indexOf(data.id) === -1) {
            allUsers.push(data.id)
        }

        io.emit('all users updated', allUsers)
    });

    //remove image from server after uploading
    socket.on('remove uploaded image', (img) => {
        setTimeout(() => {
            Cloudinary.removeImage(img)
        }, 60000)
    });

    socket.on('send mail', (message) => {
        MailSender.sendEmail(io, message)
    });

    socket.on('join chat', (gender) => {
        let room = chatRooms.getRoom(rooms, gender);

        socket.join(room);

        socket.on('disconnect', () => {
            socket.leave(room, () => {
                io.sockets.to(room).emit('get private message', {botMessage: 'USER_DISCONNECTED'});
            })
        });

        socket.emit('joined room', room);
    });

    socket.on('leave room', (data) => {
        socket.leave(data.room, () => {
            chatRooms.leaveRoom(rooms, data)
        })
    });

    socket.on('leave chat', () => {
        delete users[socket.id];
        io.emit('change clients', users);
    });

    socket.on('send public message', (message) => {
        io.emit('get public message', message)
    });

    socket.on('send private message', (message) => {
        io.sockets.to(message.room).emit('get private message', message);
    });

    /**
     * When user typing message
     */
    socket.on('typing', (room) => {
        socket.broadcast.to(room).emit('show typing')
    });

    socket.on('join room', (room) => {
        socket.join((room))
    });

    socket.on('rejoin room', (data) => {
        socket.join(data.room);

        if (!data.isFull) {
            return rooms[data.gender].push(data.room)
        }

        const checkRoom = new Promise((resolve) => {
            setTimeout(() => {
                const prevRoom = io.sockets.adapter.rooms[data.room];

                resolve(prevRoom && prevRoom.length <= 1)
            }, 5000)
        });

        checkRoom.then((isEmpty) => {
            if (isEmpty) {
                io.to(socket.id).emit('get private message', {botMessage: 'ROOM_IS_EMPTY'});
            }
        })
    });

    socket.on('connect to public chat', (data) => {
        data.id = socket.id;
        users[socket.id] = data;
        io.emit('change clients', users);
        socket.broadcast.emit('new user connected', data.nick);
        io.to(socket.id).emit('get public chat info');
    });

    socket.on('reconnect to public chat', (data) => {
        data.id = socket.id;
        users[socket.id] = data;
        io.emit('change clients', users);
    });

    socket.on('private request', (data) => {
        io.to(data.receiverId).emit('get private request', data)
    });

    socket.on('accept private request', (data) => {
        data.roomName = Math.round(100000 + Math.random() * (999999 - 100000));

        let receiverData = {
                interlocutor: data.senderNick ? data.senderNick : null,
                roomName: data.roomName
            },
            senderData = {
                interlocutor: data.receiverNick ? data.receiverNick : null,
                roomName: data.roomName
            };

        io.to(data.receiverId).emit('private request accepted', receiverData);
        io.to(data.senderId).emit('private request accepted', senderData)
    });

    socket.on('reject private request', (data) => {
        io.to(data.senderId).emit('private request rejected', data.receiverNick)
    });

    socket.on('delete message', (id) => {
        io.emit('deleted message', id)
    });

    socket.on('like user', (data) => {
        io.to(data.id).emit('like', data.isLiked)
    });

    socket.on('like message', (data) => {
        io.emit('liked message', data)
    })
});
