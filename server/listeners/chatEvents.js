/**
 * @author Yuriy Matviyuk
 */
import io from '../io'
import chatRooms from '../chatRooms'
import Cloudinary from '../cloudinary';
import MailSender from '../email'
import mongodb from '../mongodb'

let clientsCount = 0,
    users = {},
    rating = null,
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

    mongodb.getData('rating').then((result) => {
        if (result.length && result[0].hasOwnProperty('rating')) {
            rating = result[0].rating;
            socket.emit('get rating', rating);
        }
    }).catch((err) => console.log('Get data form DB err', err));

    socket.on('disconnect', (reason) => {
        console.log('reason ---> ', reason);
        console.log('rooms before ---> ', rooms);
        console.log('gender ---> ', socket.gender);
        console.log('current room ---> ', socket.currentRoom);
        console.log('socket.adapter.rooms ---> ', socket.adapter.rooms);

        if (reason === 'transport close') {
            chatRooms.leaveRoom(rooms, {gender: socket.gender, room: socket.currentRoom, destroy: true});
            console.log('on transport close');
        } else if (socket.adapter.rooms.hasOwnProperty(socket.currentRoom)) {
            io.sockets.to(socket.currentRoom).emit('get private message', {botMessage: 'USER_DISCONNECTED'});
            console.log('on emit to room and wait');
        } else if (socket.gender && rooms[socket.gender].indexOf(socket.currentRoom) !== -1) {
            console.log('disconnect with splice');
            rooms[socket.gender].splice(rooms[socket.gender].indexOf(socket.currentRoom), 1);
        }

        console.log('rooms after ---> ', rooms);

        // Decrement clients count after new user connection
        for (let userId in users) {
            if (users.hasOwnProperty(userId) && users[userId].socketId === socket.id) {
                delete users[userId];
            }
        }

        io.emit('change clients', users);
        io.emit('change clients count', --clientsCount)
    });

    socket.on('chat rate', (rate) => {
        let ratesQty = parseInt(rating.ratesQty),
            average = parseFloat(rating.average),
            newRating = {};

        let newAverage = ((ratesQty * average + rate) / (ratesQty + 1)),
            newRatesQty = ratesQty + 1;

        newRating = {"average" : newAverage, "ratesQty" : newRatesQty.toString(10)};

        const filter = {"ratingDocument" : "true"},
              newData = {"rating": newRating};

        mongodb.updateOne(filter, newData).then(() => {
            socket.emit('get rating', newRating);
        }).catch((err) => {console.log('Document update error ---> ', err);})
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

    //ban chosen user
    socket.on('block user', (id) => {
        io.to(id).emit('block');
    });

    socket.on('join chat', (gender) => {
        let room = chatRooms.getRoom(rooms, gender);

        socket.join(room, () => {
            socket.currentRoom = room;
            socket.gender = gender;
        });

        socket.emit('joined room', room);
    });

    socket.on('leave room', (data) => {
        socket.leave(data.room, () => {
            chatRooms.leaveRoom(rooms, data)
        })
    });

    socket.on('leave chat', () => {
        for (let userId in users) {
            if (users.hasOwnProperty(userId) && users[userId].socketId === socket.id) {
                delete users[userId];
                io.emit('change clients', users);
            }
        }
    });

    socket.on('send public message', (message) => {
        io.emit('get public message', message)
    });

    socket.on('send private message', (message) => {
        io.sockets.to(message.room).emit('get private message', message);
    });

    socket.on('set interlocutor id', (data) => {
        socket.broadcast.to(data.room).emit('get interlocutor id', data.id)
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
        socket.join(data.room, () => {
            socket.currentRoom = data.room;
            socket.gender = data.gender;

            if (socket.adapter.rooms[data.room].length > 1) {
                socket.broadcast.to(data.room).emit('get private message', {botMessage: 'CONNECTION_RESTORED'});
            }
        });

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

    socket.on('changed nick', (data) => {
        users[data.userId].nick = data.nick;
        io.emit('list update force', users);
    });

    socket.on('connect to public chat', (data) => {
        if (!data.userId) {
            return
        }

        data.socketId = socket.id;
        users[data.userId] = data;
        io.emit('change clients', users);
        socket.broadcast.emit('new user connected', data.nick);
        io.to(socket.id).emit('get public chat info');
    });

    socket.on('reconnect to public chat', (data) => {
        if (!data.userId) {
            return
        }

        data.socketId = socket.id;
        users[data.userId] = data;
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
        let nick = data.receiverNick !== null ? data.receiverNick : 'користувач';

        io.to(data.senderId).emit('private request rejected', nick)
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
