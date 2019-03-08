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
        average = parseFloat(i).toFixed(1),
        starsClassAdditional;

    if (i > 1 && i < 2) {
        starsClassAdditional = 1.5
    } else if (i > 2 && i < 3) {
        starsClassAdditional = 2.5
    } else if (i > 3 && i < 4) {
        starsClassAdditional = 3.5
    } else if (i > 4 && i < 5) {
        starsClassAdditional = 4.5
    } else {
        starsClassAdditional = Math.ceil(i);
        average = starsClassAdditional
    }

    let ratingStarsClassName = rating
            ? "rating-stars stars-" + starsClassAdditional.toString(10).replace('.', '-')
            : 'rating-stars';

    return (
        <div>
            <div itemScope itemType="http://schema.org/WebSite">
                <div style={{display: "none"}} itemProp="aggregateRating" itemScope
                     itemType="http://schema.org/AggregateRating">
                    <meta itemProp="bestRating" content="5"/>
                    <meta itemProp="worstRating" content="1"/>
                    <meta itemProp="ratingValue" content={average}/>
                    <meta itemProp="ratingCount" content={rating.ratesQty}/>
                </div>
                <div className='app=rating'>
                    <div className="rating-summary">
                        {average + '/5 (' + rating.ratesQty + ')'}
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
