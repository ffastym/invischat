/**
 * @author Yuriy Matviyuk
 */
import AddEmoji from '../dumb/AddEmoji'
import UploadPhoto from '../dumb/UploadPhoto'
import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Emoji } from 'emoji-mart'
import SendMessage from '../dumb/SendMessage'
import WriteMessage from './WriteMessage'
import {connect} from "react-redux";
import popUpActions from "../../actions/popUpActions";
import socket from "../../socket";
import messageActions from "../../actions/messageActions";
const emojiTranslates = {
    search: 'Пошук',
    notfound: 'Смайл не знайдено',
    skintext: 'Виберіть тон шкіри за замовчуванням',
    categories: {
        search: 'Результати пошуку',
        recent: 'Нещодавні',
        people: 'Емоції та люди',
        nature: 'Тварини та природа',
        foods: 'Їжа та напої',
        activity: 'Діяльність',
        places: 'Подорожі та місця',
        objects: 'Предмети',
        symbols: 'Символи',
        flags: 'Прапори',
        custom: 'Користувацькі',
    }
};

/**
 * ChatToolbar component
 */
class ChatToolbar extends Component {
    /**
     * ChatToolbar Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            isTyping          : false,
            isShowEmojiPicker : false,
            refactoredMessage : null
        };
    }

    /**
     * Component mounted in DOM
     */
    componentDidMount() {
        socket.chat.on('show typing', () => {
            this.setState({
                isTyping: true
            });

            setTimeout(() => {
                this.setState({
                    isTyping: false
                });
            }, 2500);
        });
    }

    checkNick = (e) => {
        if (this.props.type === 'private') {
            return
        } else if (!this.props.nick) {
            e.preventDefault();
            this.props.showPopUp('CREATE_NICK')
        }
    };

    /**
     * Display Emoji picker block after click on emoji button
     */
    showEmojiPicker = () => {
        document.addEventListener('click', this.hideEmojiPicker);
        document.addEventListener('tap', this.hideEmojiPicker);

        this.setState({
            isShowEmojiPicker: true
        })
    };

    /**
     * Hide emoji picker
     *
     * @param e
     */
    hideEmojiPicker = (e) => {
        if (this.pickerRef && !this.pickerRef.contains(e.target)) {
            this.setState({
                isShowEmojiPicker: false
            });

            document.removeEventListener('click', this.hideEmojiPicker);
            document.removeEventListener('tap', this.hideEmojiPicker);
        }
    };

    /**
     * Get Emoji picker wrapper ref
     *
     * @param node
     */
    getPickerRef = (node) => {
        this.pickerRef = node
    };

    /**
     * Add emoji to the message input
     *
     * @param emoji
     */
    addEmoji = (emoji) => {
        const addedEmoji =
            <span className="emoji-wrapper"
                  contentEditable={false}
                  dangerouslySetInnerHTML={{
                      __html: Emoji({
                        html: true,
                        set: 'apple',
                        skin: JSON.parse(localStorage.getItem('emoji-mart.skin')),
                        emoji: emoji.id,
                        size: 20
                      })
                }}
            />;
        let message = this.props.type === 'public' ? this.props.publicMessage : this.props.privateMessage,
            refactoredMessage = message + ReactDOMServer.renderToStaticMarkup(addedEmoji) + '&nbsp;';

        this.setState({refactoredMessage});
        this.props.setMessageText(this.props.type, refactoredMessage)
    };

    /**
     * Remove quote
     */
    removeQuote = () => {
        this.props.setQuote({type: this.props.type})
    };

    /**
     * ComponentWillUnmount method
     */
    componentWillUnmount() {
        document.removeEventListener('click', this.hideEmojiPicker);
        document.removeEventListener('tap', this.hideEmojiPicker);
        socket.chat.off('show typing')
    }

    /**
     * Render ChatToolbar component
     */
    render() {
        const type = this.props.type,
              roomIsFull = this.props.isFull,
              isConnected = this.props.isConnected,
              imagePreviewUrl = type === 'public' ? this.props.publicImageUrl : this.props.privateImageUrl,
              isUploadedImage = type === 'public' ? this.props.publicIsUploadedImg : this.props.privateIsUploadedImg,
              quotedImage = type === 'public' ? this.props.publicQuotedImage : this.props.privateQuotedImage,
              quotedMessage = type === 'public' ? this.props.publicQuotedMessage : this.props.privateQuotedMessage,
              isActive = (roomIsFull && isConnected) || (type === 'public'),
              toolbarClassName = isActive ? 'chat-actions-toolbar' : 'chat-actions-toolbar disabled',
              hasQuote = quotedMessage || quotedImage;

        return (
            <div className={toolbarClassName}
                 onClick={this.checkNick}
                 title={isActive ? '' : 'дії з чатом тимчасово заблоковані'}>
                {this.state.isTyping && type === 'private' &&
                    <span className="write-animation">анонім друкує повідомлення</span>}
                {this.state.isShowEmojiPicker &&
                <div ref={this.getPickerRef}>
                    <Picker set='apple'
                            i18n={emojiTranslates}
                            showPreview={false}
                            color={this.props.theme === 'light' ? '#2F2F2F' : '#E3E3E3'}
                            emojiTooltip={true}
                            onSelect={this.addEmoji}
                            title='Оберіть смайл' emoji='point_up'
                            style={{position: 'absolute', top: '-295px', width: 'calc(100% - 10px)', left: '5px', display: 'block'}}
                    />
                </div>}
                {isUploadedImage &&
                    <div className="image-preview">
                        <div className="preview-wrapper">
                        {imagePreviewUrl ?
                            <React.Fragment>
                                <span className="remove-preview" onClick={this.props.removeImagePreview}/>
                                <img src={imagePreviewUrl} alt="preview"/>
                            </React.Fragment> :
                            <div className="image-preview-loader">
                                <span className="loader"/>
                            </div>}
                        </div>
                     </div>}
                {hasQuote &&
                <span className="quoted-message">
                        <span className="quote-wrapper">
                            <span className="remove-quote" onClick={this.removeQuote}/>
                            {quotedMessage && <span className="text" dangerouslySetInnerHTML={{__html: quotedMessage}}/>}
                            {quotedImage && <img src={quotedImage} alt=""/>}
                        </span>
                    </span>}
                <div className='actions-wrapper'>
                    <UploadPhoto type={type} imageSelect={this.props.imageSelect}/>
                    <AddEmoji type={type} showEmojiPicker={this.showEmojiPicker}/>
                    <WriteMessage type={type} refactoredMessage={this.state.refactoredMessage}/>
                    <SendMessage type={type}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isFull               : state.room.isFull,
        isConnected          : state.app.isConnected,
        publicMessage        : state.message.public.text,
        privateMessage       : state.message.private.text,
        privateQuotedMessage : state.message.private.quotedMessage,
        publicQuotedMessage  : state.message.public.quotedMessage,
        privateQuotedImage   : state.message.private.quotedImage,
        publicQuotedImage    : state.message.public.quotedImage,
        privateImageUrl      : state.message.private.imageUrl,
        publicIsUploadedImg  : state.message.public.isUploadedImage,
        privateIsUploadedImg : state.message.private.isUploadedImage,
        publicImageUrl       : state.message.public.imageUrl,
        theme                : state.app.theme,
        nick                 : state.user.nick
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
            dispatch(popUpActions.showPopUp(type))
        },

        /**
         * Set message text
         *
         * @param type
         * @param text
         */
        setMessageText: (type, text) => {
            dispatch(messageActions.setMessageText({type, text}))
        },

        /**
         * Set quote
         *
         * @param quote
         */
        setQuote: (quote) => {
            dispatch(messageActions.setQuote(quote))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatToolbar)
