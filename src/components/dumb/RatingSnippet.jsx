import React, { useState, useEffect } from 'react'
import socket from "../../socket";

/**
 * Rich snippet component
 *
 * @param props
 *
 * @returns {*}
 * @constructor
 */
function RatingSnippet(props) {
    const [rating, setRating] = useState(props.rating);

    useEffect(() => {
        socket.chat.off('get rating').on('get rating', (rating) => {
            setRating(rating)
        })
    });

    if (!rating) {
        return <div/>
    }

    let i = rating.average,
        averageRating;

    if (i > 1 && i < 2) {
        averageRating = 1.5
    } else if (i > 2 && i < 3) {
        averageRating = 2.5
    } else if (i > 3 && i < 4) {
        averageRating = 3.5
    } else if (i > 4 && i < 5) {
        averageRating = 4.5
    } else {
        averageRating = Math.ceil(i)
    }

    let ratingStarsClassName = rating
            ? "rating-stars stars-" + averageRating.toString(10).replace('.', '-')
            : 'rating-stars';

    return (
        <div>
            <div itemScope itemType="http://schema.org/WebSite">
                <div style={{display: "none"}} itemProp="aggregateRating" itemScope
                     itemType="http://schema.org/AggregateRating">
                    <meta itemProp="bestRating" content="5"/>
                    <meta itemProp="worstRating" content="1"/>
                    <meta itemProp="ratingValue" content={averageRating}/>
                    <meta itemProp="ratingCount" content={rating.ratesQty}/>
                </div>
                <div className='app=rating'>
                    <div className="rating-summary">
                        {averageRating + '/5 (' + rating.ratesQty + ')'}
                    </div>
                    <ul className={ratingStarsClassName}>
                        <li className='rating-star'/>
                        <li className='rating-star'/>
                        <li className='rating-star'/>
                        <li className='rating-star'/>
                        <li className='rating-star'/>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default RatingSnippet
