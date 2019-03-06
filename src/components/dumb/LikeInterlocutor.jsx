/**
 * @author Yuriy Matviyuk
 */
import React, {useState} from 'react'
import appActions from "../../actions/appActions";
import popUpActions from "../../actions/popUpActions";
import userActions from "../../actions/userActions";
import {connect} from "react-redux";

/**
 * LikeInterlocutor component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const LikeInterlocutor = (props) => {
    const [isValid, setIsValid] = useState(true);

    let inputRef;
    /**
     * Accept creating nick name
     *
     * @returns {boolean}
     */
    const acceptAction = () => {
        let value = inputRef.value.toString();

        if (value.length && value.length <= 15) {
            let newList = {...props.likedList},
                userId = props.interlocutorId;

            newList[userId] = {
                nick: value,
                userId,
                socketId: props.allUsersList[userId].socketId
            };

            props.changeLikedList(newList);
            props.hidePopUp();
        } else {
            setIsValid(false);
        }
    };

    /**
     * Chack pressed button
     *
     * @param e
     */
    const checkKey = (e) => {
        if(e.key === 'Enter'){
            acceptAction();
        }
    };

    /**
     * Get input ref
     *
     * @param node
     */
    const getInputRef = (node) => {
        inputRef = node
    };

    let additionalClassName = isValid ? 'pop-up-additional ' : 'pop-up-additional invalid';

    return (
        <React.Fragment>
            <div className="pop-up-text">Введіть ім'я поточного співрозмовника під яким бажаєте зберегти
                його до списку улюблених</div>
            <div className={additionalClassName}>
                <input type='text' autoFocus={true} ref={getInputRef} onKeyPress={checkKey}/>
                {!isValid &&
                <p className="error">Ім'я не може бути пустим та довшим ніж 15 символів</p>}
            </div>
            <div className="pop-up-actions">
                <button className="button ok-button" onClick={acceptAction}>ок</button>
            </div>
        </React.Fragment>
    )
};

const mapStateToProps = (state) => {
    return {
        interlocutorId : state.room.interlocutorId,
        allUsersList   : state.user.allUsersList,
        likedList      : state.user.likedList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Like/dislike user
         *
         * @param list
         */
        changeLikedList: (list) => {
            dispatch(userActions.changeLikedList(list))
        },

        /**
         * Hide popup
         */
        hidePopUp: () => {
            dispatch(popUpActions.hidePopUp())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LikeInterlocutor)
