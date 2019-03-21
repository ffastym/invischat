/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import socket from "../../socket";
import popUpActions from "../../actions/popUpActions";
import {connect} from "react-redux";
import userActions from "../../actions/userActions";

/**
 * Login component
 */
class Login extends Component {
    /**
     * Login Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            nick: null,
            password: null,
            repeatedPass: null,
            nickError: false,
            passError: false,
            repeatPassError: false,
            isSave: true,
            type: null
        };
    }

    /**
     * Component was mounted in DOM
     */
    componentDidMount() {
        socket.chat.off('login response').on('login response', (data) => {
            if (data.nickExist) {
                this.setState({nickError: 'Користувач з таким логіном уже зареєстрований'})
            } else if (data.invalid) {
                this.setState({passError: 'Невірний логін або пароль'})
            } else {
                this.props.setAsLoggedIn(data);

                if (this.state.isSave) {
                    localStorage.setItem('credentials', JSON.stringify({nick: data.nick, password: data.password}))
                }
            }
        })
    }

    /**
     * Check nick
     *
     * @param e
     *
     * @returns {*}
     */
    checkNick = (e) => {
        if (this.state.type === 'logIn') {
            return this.setState({
                nick: e.target.value,
                nickError: false
            });
        }

        let nick = e.target.value;

        if (nick.length >= 3 && nick.length <= 15) {
            return this.setState({
                nick,
                nickError: false
            });
        }

        this.setState({
            nickError: 'Логін повинен містити від 3 до 15 символів',
            isInvalidNick: true
        })
    };

    /**
     * Check is password correct
     *
     * @param e
     */
    checkPassword = (e) => {
        const password = e.target.value;
        let passError;

        if (this.state.type === 'logIn') {
            passError = false
        } else if (password.length < 6) {
            passError = 'Пароль повинен складатися мінімум з 6 символів'
        } else if (password.match(new RegExp(/([А-я])/))) {
            passError = 'Пароль не повинен містити кириличних символів'
        } else if (password.match(new RegExp(/(\s)/))) {
            passError = 'Пароль не повинен містити пробілів'
        } else if (!password.match(new RegExp(/([0-9])/))) {
            passError = 'Пароль повинен містити хоча б одну цифру'
        } else if (!password.match(new RegExp(/([A-Z])/))) {
            passError = 'Пароль повинен містити хоча б одну велику літеру'
        }

        this.setState({passError, password})
    };

    /**
     * Check is a repeated password is a same as password
     *
     * @param e
     */
    checkPasswordIsSame = (e) => {
        const repeatedPass = e.target.value;
        let repeatPassError = repeatedPass === this.state.password
            ? false : 'Паролі не співпадають';

        this.setState({repeatedPass, repeatPassError})
    };

    /**
     * Submit log in
     */
    logIn = () => {
        const nick = this.state.nick,
              password = this.state.password;

        if (!nick) {
            return this.setState({nickError: 'Введіть логін'})
        }

        if (!password) {
            return this.setState({passError: 'Введіть пароль'})
        }

        socket.chat.emit(
            'login',
            {
                nick: this.state.nick,
                password: this.state.password,
                isNew: this.state.type === 'signIn'
            }
        );
    };

    /**
     * Check is need auto login
     */
    changeIsSave = () => {
        this.setState({
            isSave: !this.state.isSave
        })
    };

    componentWillUnmount() {
        socket.chat.off('login response')
    }

    /**
     * Render Login component
     */
    render() {
        let type = this.state.type,
            isValidForm = this.state.nickError || this.state.passError || this.state.repeatPassError;

        if (this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <div className="pop-up-text">Ви успішно увійшли в аккаунт</div>
                    <div className="pop-up-actions">
                        <button className="button ok-button"
                                onClick={this.props.hidePopUp}
                                children={"ок"}/>
                    </div>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                {!type
                    ? <React.Fragment>
                        <div className="pop-up-text">
                            {this.props.isInChat
                                ? 'Увійдіть у свій обліковий запис або створіть новий'
                                : 'Коментувати та оцінювати пости можуть лише авторизовані користувачі.'}
                        </div>
                        <div className="pop-up-actions">
                            <button className="button button-accept"
                                    onClick={() => {this.setState({type: 'logIn'})}}
                                    children={"вхід"}/>
                            <button className="button button-accept"
                                    onClick={() => {this.setState({type: 'signIn'})}}
                                    children={"реєстрація"}/>
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className='pop-up-additional'>
                            <div className='login-credentials'>
                                <div className="field">
                                    <label className='label login' htmlFor='set_nick'/>
                                    <input className='set-nick'
                                           id='set_nick'
                                           type='text'
                                           placeholder='Логін'
                                           autoFocus={true}
                                           onChange={this.checkNick}/>
                                    {this.state.nickError
                                        ? <p className="error">{this.state.nickError}</p>
                                        : false}
                                </div>
                                <div className="field">
                                    <label className='label password' htmlFor='set_password'/>
                                    <input className='set-password'
                                           id='set_password'
                                           placeholder='Пароль'
                                           type='password'
                                           onChange={this.checkPassword}/>
                                    {this.state.passError
                                        ? <p className="error">{this.state.passError}</p>
                                        : false}
                                </div>
                                {type === 'signIn'
                                    && <div className="field">
                                        <label className='label password' htmlFor='repeat_password'/>
                                        <input className='repeat-password'
                                                  id='repeat_password'
                                                  placeholder='Повторіть пароль'
                                                  type='password'
                                                  onChange={this.checkPasswordIsSame}/>
                                    {this.state.repeatPassError
                                        ? <p className="error">{this.state.repeatPassError}</p>
                                        : false}
                                </div>}
                            </div>
                            <label className={this.state.isSave ? 'checkbox-label active' : 'checkbox-label'}>
                                <input id='save_nick' type='checkbox' onChange={this.changeIsSave}/>
                                <span>Запам'ятати мене</span>
                            </label>
                        </div>
                        <div className="pop-up-actions">
                            <button className="button ok-button"
                                    onClick={this.logIn}
                                    disabled={isValidForm}
                                    children={"увійти"}/>
                        </div>
                    </React.Fragment>}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn : state.user.isLoggedIn,
        isInChat   : state.app.isInChat
    }
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
         * Set user as logged in
         *
         * @param data
         */
        setAsLoggedIn: (data) => {
            dispatch(userActions.setAsLoggedIn(data))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
