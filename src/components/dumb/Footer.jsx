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
            <span>&copy; 2019</span>
            <div className="fb-share-button"
                 data-href="http://www.invischat.com"
                 data-layout="button_count"
                 data-size="small"
                 data-mobile-iframe="true">
                <a target="_blank"
                   href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Finvischat.com%2F&amp;src=sdkpreparse"
                   className="fb-xfbml-parse-ignore">Поширити</a>
            </div>
        </footer>
    )
};

export default Footer
