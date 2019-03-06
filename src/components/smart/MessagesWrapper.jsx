/**
 * @author Yuriy Matviyuk
 */
import React, {PureComponent} from 'react'
import socket from "../../socket";
import ChatMessage from '../smart/ChatMessage'
import {connect} from "react-redux";
import roomActions from "../../actions/roomActions";
import appActions from "../../actions/appActions";
import UsersList from "./UsersList";
import SavedList from "./SavedList";
import popUpActions from "../../actions/popUpActions";
import galleryActions from "../../actions/galleryActions";
import messageActions from "../../actions/messageActions";
import userActions from "../../actions/userActions";

/**
 * MessagesWrapper component
 */
class MessagesWrapper extends PureComponent {
    /**
     * MessagesWrapper Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            notify          : !props.ssr && new Audio('/audio/magic.mp3'),
            notify2         : !props.ssr && new Audio('/audio/pop.mp3'),
            newMessagesQty  : 0,
            messages        : []
        };
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        if (!this.state.notify && !this.state.notify2) {
            this.setState({
                notify  : new Audio('/audio/magic.mp3'),
                notify2 : new Audio('/audio/pop.mp3')
            })
        }

        const type = this.props.type,
            getMessageEvent = 'get ' + type + ' message';

        if (type === 'private') {
            let message = 'Очікуємо співрозмовника... </br> Поки йде пошук, можете поспілкуватися' +
                ' в загальному чаті.';

            if (this.props.isMobile) {
                message += '</br> Щоб перейти в загальний чат зробіть свайп вліво ' +
                '<img width="50px" src="/images/swipe.gif" alt="swipe invischat"/>'
            }

            this.setState({
                messages: this.state.messages.concat(<ChatMessage
                    key={Math.round(100000 + Math.random() * (999999 - 100000))}
                    gender="bot"
                    message={message}
                    socketId={null}
                    label='bot'
                />)
            });

            socket.chat.off('get interlocutor id').on('get interlocutor id', (id) => {
                this.props.setInterlocutorId(id)
            })
        } else {
            socket.chat.off('get public chat info').on('get public chat info', () => {
                this.sendBotMessage('PUBLIC_WELCOME')
            });

            socket.chat.off('new user connected').on('new user connected', (nick) => {
                if (nick) {
                    this.sendBotMessage('NEW_USER_IN_PUBLIC', nick);
                }
            });

            socket.chat.off('liked message').on('liked message', (data) => {
                this.likesHandler(data)
            })
        }

        socket.chat.off('disconnect').on('disconnect', () => {
            setTimeout(() => {
                this.sendBotMessage('CONNECTION_PROBLEM');
            }, 100)
        });

        socket.chat.off('reconnect').on('reconnect', () => {
            socket.reJoinRoom()
                .addToPublicList();
            this.sendBotMessage('CONNECTION_RESTORED');
        });

        socket.chat.off(getMessageEvent).on(getMessageEvent, (message) => {
            //Ignore message if client is muted
            if (this.props.mutedList.indexOf(message.socketId) !== -1) {
                return false
            }

            const isAlien = message.socketId !== socket.chat.id;

            if (message.botMessage) {
                return this.sendBotMessage(message.botMessage)
            }

            if (this.props.isMobile) {
                if (type === 'private' && this.props.chatPosition !== 0) {
                    this.props.setNewMessagesQty(this.props.newMessagesQty + 1)
                }

                if (type === 'public' && this.props.chatPosition === 0) {
                    this.props.setNewMessagesQty(this.props.newMessagesQty + 1)
                }
            }

            if (isAlien) {
                this.scrollToLastMessage();

                if (this.props.isNotificationsEnabled && type === 'private' && this.state.notify) {
                    this.state.notify.play();
                }
            } else {
                this.scrollToLastMessage(true);
            }

            this.setState({
                messages: this.state.messages.concat(
                    <ChatMessage key={message.messageId}
                                 message={message.text}
                                 type={this.props.type}
                                 label={socket.chat.id !== message.socketId ? 'anon' : 'you'}
                                 messageId={message.messageId}
                                 quotedMessage={message.quotedMessage}
                                 quotedImage={message.quotedImage}
                                 publicColor={message.publicColor}
                                 socketId={message.socketId}
                                 gender={message.gender}
                                 nickName={message.nick}
                                 image={message.imageUrl}
                    />
                )
            });

            if (message.imageUrl) {
                this.props.addImageToGallery({url: message.imageUrl, type: this.props.type})
            }
        });

        socket.chat.off('deleted message').on('deleted message', (id) => {
            let message = document.getElementById(id);

            if (message) {
                message.innerHTML = '<span class="message-text removed">Повідомлення видалено</span>'
            }
        });

        this.props.isMobile && window.addEventListener("resize", this.resizeHandler)
    };

    resizeHandler = () => {
        this.scrollToLastMessage(true)
    };

    /**
     * Likes Handler
     *
     * @param data
     *
     * @returns {*}
     */
    likesHandler = (data) => {
        let messageWrapper = document.getElementById(data.id);

        if (!(messageWrapper && messageWrapper.querySelector('.message'))) {
            return
        }

        let message = messageWrapper.querySelector('.likes-count');

        if (!message) {
            return messageWrapper.querySelector('.message').appendChild(
                document.createRange().createContextualFragment(
                    '<span class="likes-count">1</span>'
                )
            );
        }

        let prevLikesCount = parseInt(message.textContent),
            likesCount = data.isLiked ? prevLikesCount + 1 : prevLikesCount - 1;

        if (likesCount === 0) {
            return messageWrapper.querySelector('.likes-count').remove()
        }

        messageWrapper.querySelector('.likes-count').innerHTML = likesCount.toString()
    };

    /**
     * Scroll to the last message
     *
     * @param force
     */
    scrollToLastMessage = (force = false) => {
        const chat = this.chatTextRef;

        if (!force && chat && Math.ceil(chat.scrollTop + chat.clientHeight) < chat.scrollHeight) {
            return this.setState({
                newMessagesQty: this.state.newMessagesQty + 1
            })
        }

        let top = chat.scrollTop < chat.clientHeight ? chat.clientHeight : chat.scrollTop,
            scr = setInterval(() => {
                if (chat) {
                    top += 300;
                    chat.scrollTo(0, top);
                }

                if (!chat || top > chat.scrollHeight) {
                    clearInterval(scr);
                }
            }, 1);

        this.setState({
            newMessagesQty: 0
        })
    };

    /**
     * Search new interlocutor in private chat
     */
    refreshChat = () => {
        const isPrivate = this.props.type === 'private';

        if (isPrivate && this.props.room && !this.props.isFull) {
            return this.props.showPopUp('CAN_NOT_REFRESH')
        }

        this.setState({
            messages: []
        }, () => {
            if (isPrivate) {
                this.sendBotMessage('SEARCH_NEW');
                socket.searchNew()
            }
        });
    };

    /**
     * Show/hide list of active users in public chat
     */
    toggleList = (e, open = false) => {
        if (this.props.type === 'public' && !this.props.nick) {
            return this.props.showPopUp('CREATE_NICK')
        }

        let classList = this.chatTextWrapperRef.classList;

        if (open) {
            classList.toggle('with-users-list')
        } else if (classList.contains('with-users-list') && !e.target.classList.contains('users-list')) {
            classList.remove('with-users-list')
        }
    };

    /**
     * Send bot message
     *
     * @param message
     * @param data
     */
    sendBotMessage = (message, data = null) => {
        let text;

        switch (message) {
            case 'ROOM_IS_FULL' :
                this.props.setIsFull(true);
                this.state.notify2.play();
                socket.chat.emit('set interlocutor id', {room: this.props.room, id: this.props.userId});
                text = 'Співрозмовника знайдено! Розпочніть Ваш діалог';
                break;
            case 'INTERLOCUTOR_LEAVE' :
                socket.leaveRoom();
                this.state.notify2.play();
                text = 'Співрозмовник покинув чат';
                break;
            case 'USER_DISCONNECTED' :
                this.props.setConnectionStatus(false);
                text = 'У співрозмовника виникли проблеми зі з\'єднанням. Очікуємо відновлення зв\'язку';
                break;
            case 'ROOM_IS_EMPTY' :
                if (this.props.isFull) {
                    socket.leaveRoom();
                    this.state.notify2.play();
                    text = 'Співрозмовник покинув чат';
                } else {
                    text = null
                }
                break;
            case 'CONNECTION_PROBLEM' :
                this.props.setConnectionStatus(false);
                text = 'Спостерігаються проблеми зі з\'єднанням. Очікуємо відновлення зв\'язку';
                break;
            case 'SEARCH_NEW' :
                text = 'Йде пошук нового співрозмовника';
                break;
            case 'NEW_USER_IN_PUBLIC' :
                text = 'Користувач <b>' + data + '</b> приєднується до чату.';
                break;
            case 'PUBLIC_WELCOME' :
                text = 'Вітаємо у загальному чаті! Ваші повідомлення та повідомлення осіб вашої' +
                    ' статі відображаються справа, а від анонімів протилежної статі - зліва.' +
                    ' Приємного спілкування!';
                break;
            case 'CONNECTION_RESTORED' :
                if (!this.props.isConnected) {
                    this.props.setConnectionStatus(true);
                    text = 'З\'єднання відновлено';
                } else {
                    text = null
                }
                break;
            default:
                text = 'default'
        }

        if (!text) {
            return
        }

        this.setState({
            messages: this.state.messages.concat(
                <ChatMessage key={Math.round(100000 + Math.random() * (999999 - 100000))}
                             gender="bot"
                             socketId={null}
                             message={text}
                             label='bot'
                />
            )
        });
    };

    /**
     * Get height of chat text scroll
     */
    getScrollHeight = () => {
        const chat = this.chatTextRef;

        if (chat.scrollHeight === Math.ceil(chat.scrollTop + chat.clientHeight)) {
            this.setState({
                newMessagesQty: 0
            })
        }
    };

    /**
     * Get messages wrapper component's ref
     *
     * @param node
     */
    getRef = (node) => {
        this.chatTextRef = node
    };

    getChatTextWrapperRef = (node) => {
        this.chatTextWrapperRef = node
    };

    /**
     * Add user from private chat to the favorite list
     */
    saveUser = () => {
        let newList = {...this.props.likedList},
            userId = this.props.interlocutorId;

        if (newList[userId]) {
            delete newList[userId];
            this.props.changeLikedList(newList)
        } else {
            this.props.showPopUp('LIKE_INTERLOCUTOR')
        }
    };

    /**
     * Component unmounted from DOM
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    /**
     * Render MessagesWrapper component
     */
    render() {
        const saveUserClassName = this.props.likedList[this.props.interlocutorId] ?
            'action-secondary save-user saved' : 'action-secondary save-user';

        return (
            <div className='chat-text-wrapper'
                 onScroll={this.getScrollHeight}
                 onClick={this.toggleList}
                 ref={this.getChatTextWrapperRef}>
                <div className="actions-secondary">
                    <span className="action-secondary refresh"
                          title="шукати нового співрозмовника"
                          onClick={this.refreshChat}
                    />
                    {this.props.type === 'private' &&
                    <React.Fragment>
                        <span className='action-secondary saved-list users-list'
                              title="зберегти співрозмовника"
                              onClick={(e) => {this.toggleList(e, true)}}
                        />
                        {this.props.isFull &&
                        <span className={saveUserClassName}
                              title="зберегти співрозмовника"
                              onClick={this.saveUser}
                        />}
                    </React.Fragment>}
                    {this.props.type === 'public' &&
                    <span className="action-secondary show-users users-list"
                          title="показати хто у чаті"
                          onClick={(e) => {this.toggleList(e, true)}}
                    />}
                </div>
                <div className='chat-text' ref={this.getRef}>{this.state.messages}</div>
                {this.props.type === 'public'
                    ? <UsersList/>
                    : <SavedList/>}
                {this.state.newMessagesQty ?
                    <span className="unread-messages-count"
                          onClick={() => {this.scrollToLastMessage(true)}}
                          children={"У вас " + this.state.newMessagesQty + " нових повідомлень"}/> : false}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isFull                 : state.room.isFull,
        isMobile               : state.app.isMobile,
        newMessagesQty         : state.message.newMessagesQty,
        chatPosition           : state.app.chatPosition,
        userId                 : state.user.userId,
        interlocutorId         : state.room.interlocutorId,
        nick                   : state.user.nick,
        isConnected            : state.app.isConnected,
        room                   : state.room.roomName,
        likedList              : state.user.likedList,
        mutedList              : state.user.mutedList,
        isNotificationsEnabled : state.app.isNotificationsEnabled
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set set room is full
         *
         * @param isFull
         */
        setIsFull: (isFull) => {
            dispatch(roomActions.setIsFull(isFull))
        },

        /**
         * Add new image to gallery
         *
         * @param data
         */
        addImageToGallery: (data) => {
            dispatch(galleryActions.addImageToGallery(data))
        },

        /**
         * Show popup
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        },

        /**
         * Set new messages qty in not active chat
         *
         * @param qty
         */
        setNewMessagesQty: (qty) => {
            dispatch(messageActions.setNewMessagesQty(qty))
        },

        /**
         * Like/dislike user
         *
         * @param list
         */
        changeLikedList: (list) => {
            dispatch(userActions.changeLikedList(list))
        },

        /**
         * Set interlocutor Public Id
         *
         * @param id
         */
        setInterlocutorId: (id) => {
            dispatch(roomActions.setInterlocutorId(id))
        },

        /**
         * Set connection status
         *
         * @param isConnected
         */
        setConnectionStatus: (isConnected) => {
            dispatch(appActions.setConnectionStatus(isConnected))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesWrapper)
