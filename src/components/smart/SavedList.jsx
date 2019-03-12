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
class SavedList extends Component {
    /**
     * UsersList Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            clientsList: [],
            allUsersList: {},
            isToggled: false
        };
    }

    /**
     * ComponentDidMount method
     */
    componentDidMount() {
        let userId = localStorage.getItem('unique_id');

        if (!userId) {
            userId = Math.floor(Math.random() * Math.floor(999999999));
            localStorage.setItem('unique_id', userId)
        }

        this.props.setUserId(userId);
    };

    /**
     * Component did update
     *
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (Object.keys(prevProps.likedList).length !== Object.keys(this.props.likedList).length) {
            this.createList(this.props.likedList)
        }

        if (Object.keys(prevProps.allUsersList).length !== Object.keys(this.props.allUsersList).length) {
            this.createList(this.props.likedList)
        }
    }

    /**
     * Remove user from liked list
     *
     * @param userId
     */
    removeUser = (userId) => {
        let newList = {...this.props.likedList};

        delete newList[userId];

        this.props.changeLikedList(newList)
    };

    /**
     * Create list of clients
     *
     * @param data
     */
    createList = (data) => {
        let clientsData = [];

        for (let userId in data) {
            if (data.hasOwnProperty(userId)) {
                let userData = data[userId],
                    isOnline = this.props.allUsersList.hasOwnProperty(userId),
                    statusColor = isOnline ? '#9FD468' : '#808080';

                if (isOnline) {
                    data[userId].socketId = this.props.allUsersList[userId].socketId
                }

                clientsData.push(
                    <li key={userId}>
                        <span className="client-color" style={{backgroundColor: statusColor}}
                              title={isOnline ? 'online' : 'offline'}/>
                        <span className="name">{userData.nick}</span>
                        <span className='user-actions'>
                            {isOnline && <span className='start-chat client-action'
                                  title='розпочати приватний чат'
                                  onClick={() => {
                                      this.proposePrivateChat(userData.nick, userData.socketId)
                                  }}
                            />}
                            <span className='remove-user client-action'
                                  title='видалити користувача зі списку'
                                  onClick={() => {
                                      this.removeUser(userId)
                                  }}
                            />
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
                    {this.state.clientsList.length
                        ? this.state.clientsList :
                    <li>Тут буде відображатися список усіх збережених користувачів. Щоб зберегти користувача натисніть
                        на іконку серця у вікні приватного чату або поряд з ніком у списку загального чату. Колір поряд
                        з користувачем у цьому списку означає його статус online (зелений) і offline (сірий).
                    </li>}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        likedList    : state.user.likedList,
        allUsersList : state.user.allUsersList
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
         * Set unique user id
         *
         * @param id
         */
        setUserId: (id) => {
            dispatch(userActions.setUserId(id))
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedList)

