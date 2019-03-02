/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import CreateNick from './CreateNick'
import socket from '../../socket'
import {connect} from "react-redux"
import popUpActions from "../../actions/popUpActions"
import {Redirect} from 'react-router-dom'

/**
 * PopUp component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
class PopUp extends Component {
    /**
     * PopUp Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            title         : '',
            isModal       : false,
            text          : '',
            customContent : null
        };
    }

    /**
     * Component was mounted in DOM
     */
    componentDidMount() {
        let state;

        switch (this.props.type) {
            case 'CREATE_NICK' :
                state = {
                    title         : 'Придумайте нікнейм',
                    customContent : <CreateNick/>
                };
                break;
            case 'PRIVATE_REQUEST' :
                let sender = this.props.senderNick
                    ? this.props.senderNick
                    : 'Хтось із Ваших попередніх співрозмовників';

                state = {
                    title : 'Запит на приватний чат',
                    text   : sender + ' пропонує перейти у приватний чат. Поточний приватний чат буде втрачено. Бажаєте перейти?',
                    isModal: true
                };
                break;
            case 'PRIVATE_REQUEST_REJECTED' :
                state = {
                    title : 'Запит відхилено',
                    text  : this.props.interlocutor + ' відмовився(-лась) переходти в приватний чат'
                };
                break;
            case 'CAN_NOT_REFRESH' :
                state = {
                    title : 'Повторний пошук',
                    text  : 'Неможливо розпочати новий пошук, оскільки ще триває попередній'
                };
                break;
            case 'PRIVATE_REQUEST_ACCEPTED' :
                state = {
                    title : 'Запит прийнято',
                    text  : 'Вас з\'єднано з ' + this.props.interlocutor + '. Приємного спілкування!'
                };
                break;
            case 'IMAGE_UPLOADING_ERROR' :
                state = {
                    title : 'Помилка завантаження',
                    text  : 'На жаль, не вдалося завантажити зображення. Спробуйте, будь ласка пізніще'
                };
                break;
            default:
                state = {};
        }

        this.setState(state)
    };

    /**
     * Accept modal action
     */
    accept = () => {
        switch (this.props.type) {
            case 'PRIVATE_REQUEST' :
                this.acceptPrivateRequest();
                break;
            default:
                return this.props.hidePopUp()
        }

        this.props.hidePopUp()
    };

    /**
     * Reject modal action
     *
     * @returns {*|void|{type: string}}
     */
    reject = () => {
        switch (this.props.type) {
            case 'PRIVATE_REQUEST' :
                this.rejectPrivateRequest();
                break;
            default:
                return this.props.hidePopUp()
        }

        this.props.hidePopUp()
    };

    /**
     * Accept request to private chat
     *
     * @returns {*}
     */
    acceptPrivateRequest = () => {
        socket.chat.emit('accept private request', {
            receiverNick : this.props.nick,
            receiverId   : socket.chat.id,
            senderId     : this.props.senderId,
            senderNick   : this.props.senderNick,
        });

        if (!this.props.isInChat) {
            return <Redirect to='/chat'/>
        }
    };

    /**
     * Reject private chat request
     */
    rejectPrivateRequest = () => {
        socket.chat.emit('reject private request', {
            senderId: this.props.senderId,
            receiverNick: this.props.nick
        })
    };

    /**
     * Render component
     *
     * @returns {*}
     */
    render()
    {
        return (
            <div className='pop-up-overlay'>
                <div className="pop-up">
                    <div className="pop-up-title-wrapper">
                        <span className="pop-up-title" children={this.state.title}/>
                        <span className="pop-up-close" onClick={this.props.hidePopUp}/>
                    </div>
                    {this.state.customContent
                        ? this.state.customContent
                        : <React.Fragment>
                            <div className="pop-up-text" children={this.state.text}/>
                            <div className="pop-up-actions">
                                {this.state.isModal
                                    ? <React.Fragment>
                                        <button className="button button-reject" onClick={this.reject}>ні</button>
                                        <button className="button button-accept" onClick={this.accept}>так</button>
                                    </React.Fragment>
                                    : <button className="button ok-button" onClick={this.props.hidePopUp}>ок</button>}
                            </div>
                        </React.Fragment>}
                </div>
            </div>
        )
    }
}

/**
 * Add redux states to props
 *
 * @param state
 * @returns {{isInChat: boolean, nick: (popUpData.nick|{hasReject, additional, text, title, validation}|null), senderId: null, interlocutor: null, senderNick: null, type: *}}
 */
const mapStateToProps = (state) => {
    return {
        type         : state.popup.type,
        isInChat     : state.app.isInChat,
        senderNick   : state.user.senderNick,
        interlocutor : state.user.interlocutorNick,
        senderId     : state.user.senderId,
        nick         : state.user.nick
    }
};

/**
 * Add redux actions to props
 *
 * @param dispatch
 *
 * @returns {{hidePopUp: hidePopUp}}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Hide popup
         */
        hidePopUp: () => {
            dispatch(popUpActions.hidePopUp())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopUp)
