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
        if(localStorage.getItem('status') === 'moderator') {
            this.props.setAsModerator();
            this.createList(this.state.prevData, true)
        }

        const likedList = localStorage.getItem('liked_list');

        if (likedList) {
            this.props.changeLikedList(JSON.parse(likedList))
        }

        socket.subscribeChangeClients();

        socket.chat.off('list update force').on('list update force', (data) => {
            this.createList(data)
        })
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
        const prevData = this.state.prevData;

        if (prevProps.mutedList.length !== this.props.mutedList.length) {
            this.createList(prevData, true)
        }

        if (prevProps.nick !== this.props.nick && prevData[this.props.userId]) {
            socket.chat.emit('changed nick', {
                nick: this.props.nick,
                userId: this.props.userId
            });
        }

        if (Object.keys(prevProps.likedList).length !== Object.keys(this.props.likedList).length) {
            this.createList(prevData, true)
        }

        if (prevProps.likesCount !== this.props.likesCount) {
            this.createList(prevData, true)
        }

        if (Object.keys(prevProps.allUsersList).length !== Object.keys(this.props.allUsersList).length) {
            this.createList(this.props.allUsersList)
        }
    }

    /**
     * Like user Handler
     *
     * @param data
     */
    likeUser = (data) => {
        const userId = data.userId;

        let newList = {...this.props.likedList};

        if (newList[userId]) {
            newList = delete newList[userId];
        } else {
            newList[userId] = data;
        }

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

        for (let userId in data) {
            if (data.hasOwnProperty(userId)) {
                let isMuted = this.props.mutedList.indexOf(data[userId].socketId) !== -1,
                    likeButtonClassName = this.props.likedList[userId]
                        ? 'liked like-user client-action' : 'like-user client-action',
                    userData = data[userId];

                if (!userData.nick) {
                    return
                }

                clientsData.push(
                    <li key={userId}>
                        <span className="client-color" style={{backgroundColor: userData.color}}/>
                        <span className="name">{userData.nick}</span>
                        <span className='user-actions'>
                            {userData.socketId !== socket.chat.id &&
                            <span className={likeButtonClassName}
                                  onClick={() => {this.likeUser(userData)}}>
                                {this.props.likesCount !== 0
                                && <span className='likes-count' children={this.props.likesCount}/>}
                            </span>}
                            {/*{this.props.isModerator &&
                            <span
                                className={userData.isVIP ? 'set-vip-status client-action vip' : 'set-vip-status client-action'}
                                title='Надати VIP статус'
                                onClick={(e) => {
                                    e.target.classList.toggle('vip');
                                    this.setVIPStatus(userData.id)
                                }}
                            />}*/}
                            {userData.socketId === socket.chat.id &&
                            <span className='client-action change-nick' onClick={this.props.changeNick}/>}
                            {this.props.isModerator &&
                            userData.socketId !== socket.chat.id &&
                            <span
                                className={userData.isBlocked ? 'ban-client client-action blocked' : 'ban-client client-action'}
                                title='Заблокувати'
                                onClick={(e) => {
                                    e.target.classList.toggle('blocked');
                                    this.blockClient(userData.socketId)
                                }}
                            />}
                            {userData.socketId !== socket.chat.id &&
                            <React.Fragment>
                            <span className='start-chat client-action'
                                  title='розпочати приватний чат'
                                  onClick={() => {
                                      this.proposePrivateChat(userData.nick, userData.socketId)
                                  }}
                            />
                                <span className={isMuted ? 'mute-user client-action muted' : 'mute-user client-action'}
                                      title='ігнорувати користувача'
                                      onClick={() => {
                                          this.muteUser(userData.socketId)
                                      }}
                                />
                            </React.Fragment>}
                        </span>
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
            <div className="users-list-wrapper">
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
        mutedList    : state.user.mutedList,
        allUsersList : state.user.allUsersList,
        isModerator  : state.user.isModerator,
        userId       : state.user.userId,
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

        setAsModerator: () => {
            dispatch(userActions.setAsModerator())
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

