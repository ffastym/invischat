/**
 * @author Yuriy Matviyuk
 */
import io from '../io'
import chatRooms from '../chatRooms'
import Cloudinary from '../cloudinary';
import {ObjectId} from 'mongodb'
import MailSender from '../email'
import mongodb from '../mongodb'

let clientsCount = 0,
    users = {},
    rating = null,
    lastMessages = [],
    rooms = {
        male   : {},
        female : {}
    };

/**
 * Listening events from chat
 */
io.on('connection', (socket) => {
    // Increment clients count after new user connection
    io.emit('change clients count', ++clientsCount);

    mongodb.getData('app', {ratingDocument: true}).then((result) => {
        if (result.length && result[0].hasOwnProperty('rating')) {
            rating = result[0].rating;
            socket.emit('get rating', rating);
        }
    }).catch((err) => console.log('Get data form DB err', err));

    socket.on('disconnect', (reason) => {
        if (reason === 'transport close') {
            chatRooms.leaveRoom(rooms, {gender: socket.gender, room: socket.currentRoom, destroy: true});
        } else if (socket.adapter.rooms.hasOwnProperty(socket.currentRoom)) {
            io.sockets.to(socket.currentRoom).emit('get private message', {botMessage: 'USER_DISCONNECTED'});
        } else if (socket.gender && rooms[socket.gender][socket.currentRoom]) {
            delete rooms[socket.gender][socket.currentRoom];
        }

        // Decrement clients count after new user connection
        for (let userId in users) {
            if (users.hasOwnProperty(userId) && users[userId].socketId === socket.id) {
                delete users[userId];
            }
        }

        io.emit('change clients', users);
        io.emit('change clients count', --clientsCount)
    });

    socket.on('fetch posts', () => {
        mongodb.getData("posts").then((result) => {
                socket.emit('get posts', result);
        }).catch((err) => console.log(err));
    });

    socket.on('check is nick exist', nick => {
        mongodb.getData('users', {nick}).then(result => {
            socket.emit('checked nick', {isInUse: result.length, nick})
        })
    });

    socket.on('create post', post => {
        mongodb.insertOne("newPosts", post).then(() => {
            MailSender.sendEmail(io, JSON.stringify(post));
            socket.emit('post added');
        }).catch((err) => console.log(err));
    });

    socket.on('fetch new posts', () => {
        mongodb.getData('newPosts').then((posts) => {
            socket.emit('get new posts', posts)
        }).catch(err => console.log(err))
    });

    socket.on('add/delete post', (newPost) => {
        let post = {...newPost};

        if (!post.publish) {
            delete post.publish;
            return mongodb.deleteOne('newPosts', {_id: ObjectId(post._id)})
        }

        delete post.publish;

        mongodb.getData("app", {forum: true}).then((result) => {
            let post_id = result[0].lastPostId + 1;

            mongodb.insertOne("posts", {post_id, post}).then(() => {
                mongodb.updateOne(
                    'app',
                    {forum: true},
                    {$inc: {lastPostId: 1}}
                ).then(() => {
                    mongodb.deleteOne('newPosts', {_id: ObjectId(post._id)})
                })
            }).catch((err) => {
                console.log('post adding err ---> ', err);
                socket.emit('post adding error')
            });
        }).catch((err) => console.log(err));
    });
    
    socket.on('see post', (id) => {
        const post_id = parseInt(id);

        mongodb.updateOne(
            'posts',
            {post_id},
            {$inc: {"post.viewsQty" : 1}}
        ).then(() => {
            socket.emit('seen post')
        }).catch(err => console.log(err))
    });

    socket.on('login', (data) => {
        let nick = data.nick,
            userData;

        if (data.isNew) {
            mongodb.getData("users", {nick}).then((users) => {
                if (!users.length) {
                    userData = {
                        nick: data.nick,
                        password: data.password,
                        likesQty: 0,
                        likedPosts: {}
                    };

                    mongodb.insertOne('users', {...userData}).then(() => {
                        mongodb.getData(
                            "users",
                            {nick: data.nick}
                        ).then((result) => {
                            socket.emit('login response', result[0]);
                        })
                    })
                } else {
                    socket.emit('login response', {nickExist: true})
                }
            });
        } else {
            mongodb.getData(
                "users",
                {nick: data.nick, password: data.password}
            ).then((result) => {
                socket.emit('login response', result.length ? result[0] : {invalid: true});
            })
        }
    });

    socket.on('like post', data => {
        const postId = parseInt(data.postId);
        
        mongodb.updateOne(
            'posts',
            {post_id: postId},
            {$inc : {'post.likesQty': data.isLike ? 1 : -1}}
        );

        let likedPosts = {},
            post = 'likedPosts.' + postId;
        likedPosts[post] = data.isLike;

        mongodb.updateOne(
            'users',
            {_id: ObjectId(data.userId)},
            {$set: likedPosts}
        )
    });

    socket.on('comment post', comment => {
        mongodb.updateOne(
            'posts',
            {post_id: parseInt(comment.postId, 10)},
            {$push: {'post.comments': comment}}
        ).then(() => {
            socket.emit('update post data', comment)
        }).catch(err => console.log(err))
    });

    socket.on('chat rate', (rate) => {
        let ratesQty = rating.ratesQty,
            average = parseFloat(rating.average),
            newRating = {};

        let newAverage = ((ratesQty * average + rate) / (ratesQty + 1));

        newRating = {"average" : newAverage, "ratesQty" : ratesQty + 1};

        mongodb.updateOne(
            "app",
            {ratingDocument : true},
            {
                $set: {"rating.average": newAverage},
                $inc: {"rating.ratesQty": 1}
            }
        ).then(() => {
            socket.emit('get rating', newRating);
        }).catch((err) => {console.log('Document update error ---> ', err);})
    });

    //remove image from server after uploading
    socket.on('remove uploaded image', (img) => {
        Cloudinary.removeImage(img)
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
        lastMessages.push(message);

        if (!users.userId) {
            socket.emit('need users update')
        }

        if (lastMessages.length >= 50) {
            lastMessages.splice(0,1)
        }

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
            return rooms[data.gender][data.room] = data.room
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
        const user = users[data.userId],
              id = data.userId,
              prevId = data.prevUserId;

        if (!user && users[prevId]) {
            users[id] = {...users[prevId]};
            delete users[prevId];
            delete users[id][prevId]
        } else {
            user.nick = data.nick;
        }

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

    socket.on('fetch last messages', () => {
        socket.emit('get last messages', lastMessages)
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
        lastMessages = lastMessages.filter((message) => {
            return message.messageId !== id
        });

        io.emit('deleted message', id)
    });

    socket.on('like user', (data) => {
        io.to(data.id).emit('like', data.isLiked)
    });

    socket.on('like message', (data) => {
        io.emit('liked message', data)
    })
});
