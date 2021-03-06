import React, {Component} from 'react'
import socket from "../../socket";
import {connect} from "react-redux";
import deleted from '../../images/deleted.jpg'
import messageActions from "../../actions/messageActions";
import galleryActions from "../../actions/galleryActions";

/**
 * Message output component
 */
class ChatMessage extends Component {
    /**
     * ChatMessage Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            isSameGender: false,
            messageText: null,
            deletedImageUrl: '/images/deleted.jpg',
            isYourMessage: (props.socketId === socket.chat.id) || (props.sockId === props.socketId),
            isShowActions: false,
            isLiked: false
        };

        if (props.image) {
            this.state.imageIndex = props.gallery[props.type].images.length
        }
    }

    /**
     * ComponentDidMount method
     */
    componentDidMount() {
        this.detectURL(this.props.message);

        setTimeout(() => {
          if (!this.messageRef.dataset.sent) {
            this.messageRef.dataset.sent = "false"
          }
        }, 60000)

        let name;

        if (this.props.type === 'public') {
            name = this.props.nickName
        } else if (this.props.label === 'bot') {
            name = 'Бот'
        } else if (this.props.label === 'anon') {
            name = 'Анонім'
        } else {
            name = 'Ви'
        }

        this.setState({name})
    }

    /**
     * Delete message action
     */
    deleteMessage = () => {
        if (this.props.image) {
            this.removeFromGallery();
        }

        socket.chat.emit('delete message', this.props.messageId)
    };

    /**
     * Remove image from gallery
     */
    removeFromGallery = () => {
        let type = this.props.type,
            gallery,
            updatedGallery;

        gallery = this.props.gallery[type].images;
        updatedGallery = gallery.map((value, index) => {
            return index === this.state.imageIndex ? deleted : value
        });

        this.props.removeImageFromGallery({type, updatedGallery});
    };

    /**
     * Quote message action
     */
    quoteMessage = () => {
        this.props.setQuote({message: this.props.message, image: this.props.image, type: this.props.type})
    };

    /**
     * Hide message actions
     */
    collapseActions = () => {
        this.setState({
            isShowActions: false
        });

        document.removeEventListener('click', this.collapseActions);
        document.removeEventListener('tap', this.collapseActions);
    };

    /**
     * Toggle actions
     */
    toggleActions = () => {
        document.addEventListener('click', this.collapseActions);
        document.addEventListener('tap', this.collapseActions);
        this.setState({
            isShowActions: true
        })
    };

    /**
     * Url usage detection
     *
     * @param text
     * @returns {*}
     */
    detectURL = (text) => {
        let urlRegex = /((([^;"]https?:\/\/)|(^https?:\/\/)|(www\.))[^\s]+)/g;
        this.setState({
            messageText: text.replace(urlRegex, (url,b,c) => {
                let url2 = (c === 'www.') ?  'http://' +url : url;
                return '<a href="' +url2+ '" target="_blank">' + url + '</a>';
            })
        })
    };

    /**
     * Likes handler
     */
    likeMessage = () => {
        this.setState({
            isLiked: !this.state.isLiked
        }, () => {
            socket.chat.emit('like message', {
                id: this.props.messageId,
                isLiked: this.state.isLiked
            })
        });
    };

    /**
     * Show images gallery
     *
     * @param e
     */
    showGallery = (e) => {
        let type = this.props.type;

        this.props.setActiveIndex({type, activeIndex: parseInt(e.target.dataset.index, 10)});
        this.props.showGallery(type);
    };

    /**
     * Render component method
     *
     * @returns {*}
     */
    render() {
        let activeClass = this.state.isShowActions ? " active" : "",
            isYourMessage = this.state.isYourMessage,
            genderClass = this.props.gender === this.props.userGender ? ' same' : ' anon',
            label = isYourMessage ? 'you' : '',
            hasQuote = this.props.quotedMessage || this.props.quotedImage,
            containerClassName = "message-container " + this.props.gender + " " + label + activeClass + genderClass,
            likeActionClassName = this.state.isLiked
                ? "message-action like-message liked"
                : "message-action like-message";

        return (
            <p className={containerClassName} data-sent={this.props.isBlocked} id={this.props.messageId} ref={node => {this.messageRef = node}}>
                {isYourMessage || this.props.isModerator
                    ? <span className="message-action delete-message"
                            onClick={this.deleteMessage}
                            title="видалити повідомлення"
                    />
                    : <span className={likeActionClassName}
                            onClick={this.likeMessage}
                            title={this.state.isLiked ? 'мені не подобається' : 'мені подобається'}
                    />}
                {
                    <span className="message-action quote-message"
                          onClick={this.quoteMessage}
                          title="переслати повідомлення"
                    />
                }
                <span onClick={this.props.label !== 'bot' ? this.toggleActions : () => {}}
                      className={this.props.type === 'public' && this.props.isNoAdmin ? "message vip" : "message"}
                      style={this.props.publicColor ? {background: this.props.publicColor} : {}}>
                    {this.state.messageText &&
                        <span className="message-text"
                            dangerouslySetInnerHTML={{__html: this.state.messageText}}
                        />
                    }
                    {this.props.status
                        && <span className="status">{this.props.status}</span>}
                    {this.props.image &&
                        <span className="message-image">
                            <img src={this.props.image}
                                 onClick={this.showGallery}
                                 data-index={this.state.imageIndex}
                                 alt=""/>
                        </span>}
                    {hasQuote &&
                        <span className="quote">
                            {this.props.quotedMessage &&
                                <span className="text"
                                      dangerouslySetInnerHTML={{__html: this.props.quotedMessage}}
                                />}
                            {this.props.quotedImage && <img src={this.props.quotedImage} alt=""/>}
                        </span>}
                </span>
                <span className="time">{this.state.name + ", " + this.props.date}</span>
            </p>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        nick       : state.user.nick,
        userGender : state.user.gender,
        sockId   : state.user.socketId,
        isBlocked: state.user.isBlocked,
        isModerator: state.user.isModerator,
        gallery    : state.gallery
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set quote
         *
         * @param quote
         */
        setQuote: (quote) => {
            dispatch(messageActions.setQuote(quote))
        },

        /**
         * Set active image index
         *
         * @param data
         */
        setActiveIndex: (data) => {
            dispatch(galleryActions.setActiveIndex(data))
        },

        /**
         * Show image gallery
         *
         * @param type
         */
        showGallery: (type) => {
            dispatch(galleryActions.setGalleryVisibility(true));
            dispatch(galleryActions.setActiveGalleryType(type))
        },

        /**
         * Remove image from gallery
         *
         * @param data
         */
        removeImageFromGallery: (data) => {
            dispatch(galleryActions.removeImageFromGallery(data))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessage)
