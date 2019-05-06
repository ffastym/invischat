/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import {NavLink} from "react-router-dom";
import appActions from "../../actions/appActions";
import {connect} from "react-redux";

/**
 * Nav component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Nav = (props) => {
    return (
        <nav className="menu">
            <NavLink className="nav-link" exact onClick={props.toggleMenu} to='/'>Головна</NavLink>
            <NavLink className="nav-link" onClick={props.toggleMenu} to='/contact_us'>Написати Нам</NavLink>
            <NavLink className="nav-link" onClick={props.toggleMenu} to='/privacy_policy'>Політика <br/> Конфіденційності</NavLink>
        </nav>
    )
};

const mapStateToProps = (state) => {
    return {
        isNavActive: state.app.isNavActive
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Toggle menu
         */
        toggleMenu: () => {
            dispatch(appActions.toggleMenu())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
