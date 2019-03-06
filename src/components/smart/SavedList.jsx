/**
 * @author Yuriy Matviyuk
 */
import appActions from "../../actions/appActions";
import popUpActions from "../../actions/popUpActions";
import React, {Component} from 'react'
import socket from '../../socket'
import userActions from "../../actions/userActions";
import {connect} from "react-redux";

/**
 * UsersList component
 */
class UsersList extends Component {
    /**
     * UsersList Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            clientsList: [],
            isToggled: false,
            prevData: []
        };
    }

    /**
     * ComponentDidMount method
     */
    componentDidMount() {
        socket.chat.off('change clients').on('change clients', (data) => {
            this.createList(data);
        });
    };

    /**
     * Unsubscribe from events
     */
    componentWillUnmount() {
        socket.chat.off('change clients')
    }

    /**
     * Block client in public chat
     *
     * @param id
     */
    blockClient = (id) => {
        socket.chat.emit('block user', id)
    };

    /**
     * Set VIP status
     *
     * @param id
     */
    setVIPStatus = (id) => {
        socket.chat.emit('set vip status', id)
    };

    /**
     * Component did update
     *
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.mutedList.length !== this.props.mutedList.length) {
            this.createList(this.state.prevData, true)
        }

        if (prevProps.likedList.length !== this.props.likedList.length) {
            this.createList(this.state.prevData, true)
        }

        if (prevProps.likesCount !== this.props.likesCount) {
            this.createList(this.state.prevData, true)
        }
    }

    /**
     * Like user Handler
     *
     * @param id
     */
    likeUser = (id) => {
        const prevList = this.props.likedList;
        let newList,
            isLiked;

        if (prevList.indexOf(id) !== -1) {
            newList = prevList.filter((existId) => existId !== id);
            isLiked = false
        } else {
            newList = prevList.concat(id);
            isLiked = true
        }

        socket.chat.emit('like user', {id, isLiked, userId: this.props.userId});
        this.props.changeLikedList(newList)
    };

    /**
     * Mute user in public chat
     *
     * @param id
     */
    muteUser = (id) => {
        const prevList = this.props.mutedList;

        this.props.changeMutedList(prevList.indexOf(id) !== -1
            ? prevList.filter((existId) => existId !== id)
            : prevList.concat(id))
    };

    /**
     * Create list of clients
     *
     * @param data
     * @param usePrevData
     */
    createList = (data, usePrevData = false) => {
        let clientsData = [];

        if (!usePrevData) {
            this.setState({
                prevData: data
            });
        }

        for (let socketId in data) {
            if (data.hasOwnProperty(socketId)) {
                let isMuted = this.props.mutedList.indexOf(socketId) !== -1,
                    isLiked = this.props.likedList.indexOf(socketId) !== -1,
                    userData = data[socketId];

                clientsData.push(
                    <li key={socketId}>
                        {socketId !== socket.chat.id &&
                            <span className={isLiked ? 'liked like-user client-action' : 'like-user client-action'}
                                  onClick={() => {this.likeUser(socketId)}}>
                                {this.props.likesCount !== 0
                                && <span className='likes-count' children={this.props.likesCount}/>}
                            </span>}
                        <span className="client-color" style={{backgroundColor: userData.color}}/>
                        {userData.nick}
                        {this.props.isModerator &&
                        <span
                            className={userData.isVIP ? 'set-vip-status client-action vip' : 'set-vip-status client-action'}
                            title='Надати VIP статус'
                            onClick={(e) => {
                                e.target.classList.toggle('vip');
                                this.setVIPStatus(userData.id)
                            }}
                        />}
                        {socketId === socket.chat.id &&
                        <span className='client-action change-nick' onClick={this.props.changeNick}/>}
                        {this.props.isModerator &&
                        socketId !== socket.chat.id &&
                        <span
                            className={userData.isBlocked ? 'ban-client client-action blocked' : 'ban-client client-action'}
                            title='Заблокувати'
                            onClick={(e) => {
                                e.target.classList.toggle('blocked');
                                this.blockClient(socketId)
                            }}
                        />}
                        {socketId !== socket.chat.id &&
                        <React.Fragment>
                            <span className='start-chat client-action'
                                  title='розпочати приватний чат'
                                  onClick={() => {
                                      this.proposePrivateChat(userData.nick, socketId)
                                  }}
                            />
                            <span className={isMuted ? 'mute-user client-action muted' : 'mute-user client-action'}
                                  title='ігнорувати користувача'
                                  onClick={() => {
                                      this.muteUser(socketId)
                                  }}
                            />
                        </React.Fragment>}
                    </li>
                )
            }
        }

        this.setState({
            clientsList: clientsData
        })
    };

    /**
     * Start private chat
     *
     * @param receiverNick
     * @param receiverId
     */
    proposePrivateChat = (receiverNick, receiverId) => {
        socket.chat.emit('private request', {
            receiverNick,
            receiverId,
            senderNick: this.props.nick,
            senderId: socket.chat.id
        })
    };

    /**
     * Render UsersList component
     */
    render() {
        return (
            <div className="users-list-wrapper" onClick={this.props.toggleUsersList}>
                <ul className='users-list'>
                    {this.state.clientsList}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        nick         : state.user.nick,
        isLongInChat : state.user.isLongInChat,
        mutedList    : state.user.mutedList,
        likesCount   : state.user.likesCount,
        likedList    : state.user.likedList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Show popup
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(appActions.showPopUp(type))
        },

        /**
         * Change nick name
         */
        changeNick: () => {
            localStorage.removeItem('nick');
            dispatch(popUpActions.showPopUp('CREATE_NICK'))
        },

        /**
         * Mute/unmute user
         *
         * @param list
         */
        changeMutedList: (list) => {
            dispatch(userActions.changeMutedList(list))
        },

        /**
         * Like/dislike user
         *
         * @param list
         */
        changeLikedList: (list) => {
            dispatch(userActions.changeLikedList(list))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)

