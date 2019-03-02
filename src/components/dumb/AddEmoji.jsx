/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

/**
 * AddEmoji component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const AddEmoji = (props) => {
    return (
        <span className="action add-emoji" onClick={props.showEmojiPicker}/>
    )
};

export default AddEmoji
