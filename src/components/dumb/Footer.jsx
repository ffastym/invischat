/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import RatingSnippet from './RatingSnippet'

/**
 * Footer component
 *
 * @returns {*}
 * @constructor
 */
const Footer = ({rating}) => {
    return (
        <footer>
            <RatingSnippet rating={rating}/>
            <div className="fb-like" data-href="https://www.invischat.com" data-layout="button_count" data-action="like"
                 data-size="small" data-show-faces="false" data-share="false">Like</div>
        </footer>
    )
};

export default Footer
