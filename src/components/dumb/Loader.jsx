/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

/**
 * Loader component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Loader = ({text}) => {
    return (
            <div className='loading'>
                <span className="loader"/>
                <p className="className">{text}</p>
            </div>
    )
};

export default Loader
