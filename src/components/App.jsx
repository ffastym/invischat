/**
 * @author Yuriy Matviyuk
 */
import Aside from './dumb/Aside'
import Chat from './dumb/Chat'
import Footer from './dumb/Footer'
import Header from './dumb/Header'
import Home from './dumb/Home'
import Nav from './dumb/Nav'
import ContactUs from './smart/ContactUs'
import PopUp from './smart/PopUp';
import PrivacyPolicy from './dumb/PrivacyPolicy'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Switch, Route, withRouter} from 'react-router-dom'
import socket from "../socket"
import appActions from "../actions/appActions"
import userActions from "../actions/userActions";
import popUpActions from "../actions/popUpActions";
import roomActions from "../actions/roomActions";
import messageActions from "../actions/messageActions";

/**
 * App component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mobileBreakpoint: 768
        };
    }

    /**
     * ComponentDidMount
     */
    componentDidMount() {
        this.detectDeviceType();
        this.setTheme();

        socket.subscribeUsersCount();

        socket.chat.off('get private request').on('get private request', (data) => {
            this.props.setPrivateRequestData({
                senderNick: data.senderNick,
                senderId: data.senderId
            });

            this.props.showPopUp('PRIVATE_REQUEST')
        });

        socket.chat.off('private request accepted').on('private request accepted', (data) => {
            let interlocutor = data.interlocutor ? data.interlocutor : 'Загубленим співрозмовником';
            socket.leaveRoom();

            setTimeout(() => {
                socket.chat.emit('join room', data.roomName);
                this.props.joinRoom(data.roomName);
                this.props.setIsFull(true);

                if (this.props.isMobile && this.props.chatPosition !== 0) {
                    this.props.switchToPrivate();
                }

                this.props.setInterlocutorNick(interlocutor);
                this.props.showPopUp('PRIVATE_REQUEST_ACCEPTED');
            }, 1)
        });

        socket.chat.off('private request rejected').on('private request rejected', (receiverNick) => {
            this.props.setInterlocutorNick(receiverNick);
            this.props.showPopUp('PRIVATE_REQUEST_REJECTED')
        });

        socket.chat.off('like').on('like', (isLiked) => {
            this.props.setLikesCount(isLiked ? this.props.likesCount + 1 : this.props.likesCount - 1)
        });

        window.onunload = () => {
            !this.props.ssr && socket.chat.emit('all users update', {id: this.props.userId, isRemove: true});
        }
    }

    /**
     * Check is need to change default theme
     */
    setTheme = () => {
        if (localStorage.getItem('theme') === 'dark') {
            this.props.setTheme('dark')
        }
    };

    /**
     * Detect device viewport width and subscribe to it changes
     */
    detectDeviceType = () => {
        this.props.setDeviceType(window.innerWidth < this.state.mobileBreakpoint);

        window.addEventListener("resize", () => {
            this.props.setDeviceType(window.innerWidth < this.state.mobileBreakpoint)
        }, null);
    };

    /**
   * Render App component
   *
   * @returns {*}
   */
    render() {
        let wrapperClassName = this.props.theme === 'dark' ? 'page-wrapper dark' : 'page-wrapper';

        return (
            <div className={wrapperClassName}>
                <Header/>
                <div className='page-main-wrapper'>
                    <Aside/>
                    <Nav/>
                    <main className={this.props.isNavActive ? 'nav-active' : ''}>
                        <Switch>
                            <Route path="/chat" render={() => (<Chat ssr={this.props.ssr}/>)}/>
                            <Route path="/privacy_policy" component={PrivacyPolicy}/>
                            <Route path="/contact_us" component={ContactUs}/>
                            <Route path="/" render={() => (<Home ssr={this.props.ssr}/>)}/>
                        </Switch>
                    </main>
                </div>
                <Footer/>
                {this.props.isPopUpShow && <PopUp/>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isNavActive : state.app.isNavActive,
        theme       : state.app.theme,
        likesCount  : state.user.likesCount,
        userId      : state.user.userId,
        isMobile    : state.app.isMobile,
        chatPosition: state.app.chatPosition,
        isPopUpShow : state.popup.isPopUpShow
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Change online users count
         *
         * @param count
         */
        changeOnlineCount: (count) => {
            dispatch(appActions.changeOnlineCount(count))
        },

        /**
         * Change design theme
         *
         * @param theme
         */
        setTheme: (theme) => {
            dispatch(appActions.setTheme(theme))
        },

        /**
         * Set likes count
         *
         * @param qty
         */
        setLikesCount: (qty) => {
            dispatch(userActions.setLikesCount(qty))
        },

        /**
         * Join private room
         *
         * @param room
         */
        joinRoom: (room) => {
            dispatch(roomActions.joinRoom(room))
        },

        /**
         * Set current interlocutor nick
         *
         * @param nick
         */
        setInterlocutorNick: (nick) => {
            dispatch(userActions.setInterlocutorNick(nick))
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
         * Set sender request data
         *
         * @param data
         */
        setPrivateRequestData: (data) => {
            dispatch(userActions.setPrivateRequestData(data))
        },

        /**
         * Set device type
         *
         * @param isMobile
         */
        setDeviceType: (isMobile) => {
            dispatch(appActions.setDeviceType(isMobile))
        },

        /**
         * Switch to private window
         */
        switchToPrivate: () => {
            dispatch(appActions.setChatPosition());
            dispatch(messageActions.setNewMessagesQty(0))
        },

        /**
         * Set set room is full
         *
         * @param isFull
         */
        setIsFull: (isFull) => {
            dispatch(roomActions.setIsFull(isFull))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
