/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import ChatWindow from "../smart/ChatWindow";
import socket from "../../socket";
import  { Redirect } from 'react-router-dom'
import {connect} from "react-redux";
import appActions from "../../actions/appActions";
import userActions from "../../actions/userActions";
import messageActions from "../../actions/messageActions";
import Gallery from "./Gallery";

/**
 * Chat page component
 */
class Chat extends Component {
    constructor(props) {
        super(props);

        if (!props.ssr) {
            const gender = localStorage.getItem('gender');

            if (!props.gender && gender) {
                props.setGender(gender)
            }
        }

        this.state = {
            minSwipeLength : 60,// Minimal length needed for swipe (px)
            touchPosition  : 0,
            prevPosition   : 0,
            swipeDistance  : 0
        };
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        let nick = localStorage.getItem('nickName');

        this.props.setIsInChat(true);
        this.props.setRedirectionStatus(false);

        if (!this.props.publicColor) {
            this.props.setPublicColor()
        }

        if (nick && !this.props.nick) {
            socket.setNick(nick);
        }

        if (!this.props.room) {
            socket.joinChat()
        }

        socket.updateUsersList();

        window.addEventListener('beforeunload', this.onBeforeUnload, false);
        socket.subscribeJoinRoom()
    }

    onBeforeUnload = () => {
        return "Усю переписку буде втрачено. Ви справді бажаєте покинути чат?";
    };

    /**
     * Detect first touch on chat screen
     *
     * @param e
     */
    handleTouchStart = (e) => {
        this.setState({
            prevPosition: this.props.chatPosition,
            touchStartPosition: e.nativeEvent.touches[0].clientX,
            swipeDistance: 0
        })
    };

    /**
     * Detect swipe on chat screen
     *
     * @param e
     */
    handleSwipe = (e) => {
        let position,
            prevPosition   = this.state.prevPosition,
            minSwipeLength = this.state.minSwipeLength,
            swipeDistance  = -(this.state.touchStartPosition - e.nativeEvent.touches[0].clientX);

        if (prevPosition === 0 && swipeDistance < -minSwipeLength) {
            position = swipeDistance
        } else if (prevPosition === -window.innerWidth && swipeDistance > minSwipeLength) {
            position = prevPosition + swipeDistance
        } else {
            return
        }

        this.setState({
            swipeDistance: swipeDistance
        });

        this.props.setChatPosition(position)
    };

    /**
     * Detect end of swipe
     */
    handleTouchStop = () => {
        if (!this.state.swipeDistance) {
            return
        }

        let position;

        if (this.state.prevPosition !== -window.innerWidth &&  this.props.chatPosition < -this.state.minSwipeLength) {
            position = -window.innerWidth;
            this.props.clearNewMessagesQty()
        } else if (this.props.chatPosition > -window.innerWidth + this.state.minSwipeLength) {
            position = 0;
            this.props.clearNewMessagesQty()
        } else {
            position = this.state.prevPosition
        }

        this.props.setChatPosition(position);
    };

    /**
     * ComponentWillUnmount
     */
    componentWillUnmount() {
        this.props.setIsInChat(false);

        window.removeEventListener('beforeunload', this.onBeforeUnload);

        if (this.props.room) {
            socket.leaveChat()
        }

        socket.chat.off('joined room');
        this.props.clearAllUsersList()
    }

    /**
     * Render component
     *
     * @returns {*}
     */
    render() {
        if (!this.props.ssr) {
            if (!localStorage.getItem('gender')) {
                return <Redirect to='/'/>
            }
        }

        return (
        <div id='chat' className='chat-content'>
            <div className='chat-wrapper'>
                <div className='chat-windows'
                     onTouchMove={!this.props.isMobile ? this.handleSwipe : () => {}}
                     onTouchStart={!this.props.isMobile ? this.handleTouchStart : () => {}}
                     onTouchEnd={!this.props.isMobile ? this.handleTouchStop : () => {}}
                     style={!this.props.isMobile ? {left: this.props.chatPosition + "px", transition: "linear .1s"} : {}}>
                    <ChatWindow type='private' ssr={this.props.ssr}/>
                    <ChatWindow type='public' ssr={this.props.ssr}/>
                    {this.props.isGalleryActive && <Gallery/>}
                </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        chatPosition    : state.app.chatPosition,
        publicColor     : state.message.publicColor,
        isGalleryActive : state.gallery.isActive,
        gender          : state.user.gender,
        allUsersList    : state.user.allUsersList,
        userId          : state.user.userId,
        newMessagesQty  : state.message.newMessagesQty,
        room            : state.room.roomName,
        nick            : state.user.nick
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set active chat position
         *
         * @param position
         */
        setChatPosition: (position) => {
            dispatch(appActions.setChatPosition(position));
        },

        /**
         * Clear all users List
         */
        clearAllUsersList: () => {
            dispatch(userActions.setAllUsersList({}));
        },

        /**
         * Clear new messages qty
         */
        clearNewMessagesQty: () => {
            dispatch(messageActions.setNewMessagesQty(0))
        },

        /**
         * Set public messages color
         */
        setPublicColor: () => {
            dispatch(messageActions.setPublicColor())
        },

        /**
         * Set is user in chat
         *
         * @param isInChat
         */
        setIsInChat: (isInChat) => {
            dispatch(appActions.setIsInChat(isInChat))
        },

        /**
         * Set user nickName
         *
         * @param nick
         */
        setNick: (nick) => {
            dispatch(userActions.setNick(nick))
        },

        /**
         * Set user gender
         *
         * @param gender
         */
        setGender: (gender) => {
            dispatch(userActions.setGender(gender))
        },

        /**
         *
         * Set redirection status
         *
         * @param isNeedRedirect
         */
        setRedirectionStatus: (isNeedRedirect) => {
            dispatch(appActions.setRedirectionStatus(isNeedRedirect))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
