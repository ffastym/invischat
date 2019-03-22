/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import  { Redirect } from 'react-router-dom'
import {Helmet} from "react-helmet"
import userActions from '../../actions/userActions'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'

/**
 * Home component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
const Home = (props) => {
    let title = 'Invischat - Анонімний Чат | Анонімний Форум',
        description = 'Анонімний чат з випадковим співрозмовником і форум "Зізнання". Знайомства та спілкування. Відкрий душу, не втративши гідності',
        keywords = 'чат, анонімний чат, форум, lfyou, знайомства, чат знайомства в україні, знакомства, некто, чат онлайн, chat, шукаю тебе, анонімний чат тз, тз, шт, анонімний чат іф, зізнання, анонімний форум, anonumous chat, чат невидимки, Invischat, анонімний чат, типове зізнання, шукаю тебе';

    if (!props.ssr) {
        const gender = localStorage && localStorage.getItem('gender');

        if (gender && props.isNeedRedirect) {
            props.setGender(gender);
            return <Redirect to='/chat'/>
        }
    }

    return (
        <div className='page-content home'>
            <Helmet
                title={title}
                meta={[
                    {
                        name: 'description',
                        content: description,
                    },
                    {
                        name: 'keywords',
                        content: keywords,
                    }
                ]}
            />
            <div className='main-logo'>
                <img src='/images/logo.png' alt='Invischat'/>
            </div>
            <div className='gender-hint'>Обери свою стать:</div>
            <div className='gender-fieldset'>
                <NavLink className='gender female'
                         aria-label="Invischat дівчина"
                         onClick={() => {props.setGender('female')}}
                         to='/chat'>
                    <img src='../../images/female.png' alt=''/>
                </NavLink>
                <NavLink className='gender male'
                         aria-label="Invischat хлопець"
                         onClick={() => {props.setGender('male')}}
                         to='/chat'>
                    <img src='../../images/male.png' alt=''/>
                </NavLink>
            </div>
        </div>
    )
};

/**
 * Add redux states to component props
 *
 * @param state
 * @returns {{gender: null}}
 */
const mapStateToProps = (state) => {
    return {
        gender         : state.user.gender,
        isNeedRedirect : state.app.isNeedRedirect
    }
};

/**
 * Add redux actions to component props
 *
 * @param dispatch
 * @returns {{setGender: setGender}}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set user gender and connect to chat namespace
         *
         * @param gender
         */
        setGender: (gender) => {
            dispatch(userActions.setGender(gender))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
