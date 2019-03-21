/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import socket from "../../socket";
import popUpActions from "../../actions/popUpActions";
import {connect} from "react-redux";
import userActions from "../../actions/userActions";

/**
 * CreateNick component
 */
class CreateNick extends Component {
    /**
     * CreateNick Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            saveNick: false,
            isInUse: false,
            isValid : true
        };
    }

    componentDidMount() {
        socket.chat.on('checked nick', data => {
            if (data.isInUse) {
                return this.setState({
                    isInUse: data.isInUse
                })
            }

            if (this.state.saveNick) {
                localStorage.setItem('nickName', data.nick)
            } else if (localStorage.getItem('nickName')) {
                localStorage.removeItem('nickName')
            }

            socket.setNick(data.nick);
            this.setState({isValid: false});
            this.props.hidePopUp();
        })
    }

    /**
     * Change need to save nick in localStorage
     */
    changeSavingStatus = () => {
        this.setState({
            saveNick: !this.state.saveNick
        })
    };

    /**
     * Accept creating nick name
     *
     * @returns {boolean}
     */
    acceptAction = () => {
        let value = this.inputRef.value,
            modKey = value.match(new RegExp(/(%m%)/));

        if (modKey) {
            this.props.setAsModerator();
            value = value.replace(modKey[0], '')
        }

        if (value.length > 2 && value.length < 15) {
            socket.chat.emit('check is nick exist', value);
        } else {
            this.setState({isValid: false});
        }
    };

    /**
     * Chack pressed button
     *
     * @param e
     */
    checkKey = (e) => {
        this.setState({
            isInUse: false
        });

        if(e.key === 'Enter'){
            this.acceptAction();
        }
    };

    /**
     * Get input ref
     *
     * @param node
     */
    getInputRef = (node) => {
        this.inputRef = node
    };

    /**
     * Show login popup
     */
    showLoginForm = () => {
        this.props.hidePopUp();
        setTimeout(() => {this.props.showPopUp('LOGIN')}, 0);
    };

    componentWillUnmount() {
        socket.chat.off('checked nick')
    }

    /**
     * Render CreateNick component
     */
    render() {
        let additionalClassName = this.state.saveNick ? 'pop-up-additional save' : 'pop-up-additional';

        if (!this.state.isValid) {
            additionalClassName+= ' invalid'
        }

        return (
            <React.Fragment>
                <div className="pop-up-text">Щоб написати у загальний чат, придумайте нікнейм</div>
                <div className={additionalClassName}>
                    <input type='text'
                           className='nick-input'
                           autoFocus={true}
                           ref={this.getInputRef}
                           onKeyPress={this.checkKey}/>
                    <label className={this.state.saveNick ? 'checkbox-label active' : 'checkbox-label'}>
                        <input id='save_nick' type='checkbox' onChange={this.changeSavingStatus}/>
                        <span>Запам'ятати цей нік</span>
                    </label>
                    {!this.state.isValid &&
                        <p className="error">Нікнейм повинен містити від 3 до 15 символів</p>}
                    {this.state.isInUse
                        && <p className="error">
                                Нікнейм зарезервований зареєєстрованим користувачем. Якщо це
                                Ви, <button className='button ok-button authorise'
                                            onClick={this.showLoginForm}>авторизуйтесь</button>
                            </p>}
                </div>
                <div className="pop-up-actions">
                    <button className="button ok-button" onClick={this.acceptAction}>ок</button>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Hide popup
         */
        hidePopUp: () => {
            dispatch(popUpActions.hidePopUp())
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
         * Set user as Moderator
         */
        setAsModerator: () => {
            localStorage.setItem('status', 'moderator');
            dispatch(userActions.setAsModerator())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNick)
