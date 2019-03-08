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
    if (!props.ssr) {
        const gender = localStorage && localStorage.getItem('gender');

        if (gender && props.isNeedRedirect) {
            props.setGender(gender);
            return <Redirect to='/chat'/>
        }
    }

    return (
        <div className='page-content home'>
            <Helmet>
                <link rel="preload" href="/images/logo.png" as="image"/>
                <link rel="preload" href="/images/female.png" as="image"/>
                <link rel="preload" href="/images/male.png" as="image"/>
            </Helmet>
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
