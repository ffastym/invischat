/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import socket from "../../socket";
import {connect} from "react-redux";

/**
 * SendMessage component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const SendMessage = (props) => {
    /**
     * Send message
     */
    const sendMessage = () => {
        let type = props.type,
            data = props.messageData[type];

        socket.sendMessage({...data, type})
    };

    return (
        <span className="action send-message" onClick={sendMessage}/>
    )
};

const mapStateToProps = (state) => {
    return {
        messageData : state.message
    }
};

export default connect(mapStateToProps)(SendMessage)
