/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import socket from "../../socket";
import messageActions from "../../actions/messageActions";
import {connect} from "react-redux";

/**
 * WriteMessage component
 */
class WriteMessage extends Component {
    /**
     * WriteMessage Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            isTyping: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.refactoredMessage !== prevProps.refactoredMessage) {
            this.inputRef.innerHTML = this.props.refactoredMessage
        }
    }

    checkKeyType = (e) => {
        if (e.key !== 'Enter') {
            return
        }

        const type = this.props.type,
              data = type === 'public' ? this.props.publicMessageData : this.props.privateMessageData;

        e.preventDefault();
        socket.sendMessage({...data, type});
    };

    typingHandler = (e) => {
        let text = e.target.innerHTML;

        if (this.props.type === 'private' && !this.state.isTyping) {
            socket.chat.emit('typing', this.props.room);
            this.setState({
                isTyping: true
            });

            setTimeout(() => {
                this.setState({
                    isTyping: false
                });
            }, 2500);
        }

        if (text.toString() >= 1000) {
            alert('Ваше повідомлення надто довге. Будь ласка, зменшіть кількість символів');
            return false
        }

        this.props.setMessageText({type: this.props.type, text})
    };

    /**
     * Get message input ref
     *
     * @param node
     */
    getInputRef = (node) => {
        this.inputRef = node
    };
    /**
     * Format clipboard data before paste
     *
     * @param e
     */
    formatClipboardData = (e) => {
        e.preventDefault();
        let html = e.clipboardData.getData("text/html"),
            imgRegExp = new RegExp(/(<img src=")(.*?)(?=\s*")/),
            imgSrc = html.match(imgRegExp);
        if (imgSrc) {
            //get image url
            this.props.setPreviewImgUrl(imgSrc[0].replace('<img src="', ''));
        }

        let text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    };

    /**
     * Render WriteMessage component
     */
    render() {
        const type = this.props.type,
            roomIsFull = this.props.isFull,
            isConnected = this.props.isConnected,
            isEditable = (roomIsFull && isConnected) || (type === 'public' && isConnected && typeof this.props.nick === "string");

        return (
            <span className="action write-message">
            <div className="message-area">
                <p  className="message-input"
                    ref={this.getInputRef}
                    contentEditable={isEditable}
                    id={this.props.type + '_message'}
                    suppressContentEditableWarning={true}
                    onInput={this.typingHandler}
                    onPaste={this.formatClipboardData}
                    onKeyPress={this.checkKeyType}/>
            </div>
        </span>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        privateMessageData : state.message.private,
        publicMessageData  : state.message.public,
        isFull             : state.room.isFull,
        nick               : state.user.nick,
        room               : state.room.roomName,
        isConnected        : state.app.isConnected
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set message text
         *
         * @param text
         */
        setMessageText: (text) => {
            dispatch(messageActions.setMessageText(text))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteMessage)
