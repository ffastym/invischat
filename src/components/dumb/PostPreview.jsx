/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import {Image, Transformation} from 'cloudinary-react';
import {NavLink} from "react-router-dom";

/**
 * PostPreview component
 *
 * @param props

 * @returns {*}
 * @constructo
 */
const PostPreview = ({postId, postData}) => {

    /**
     * Crop post text
     *
     * @param text
     * @param length
     *
     * @returns {*}
     */
    const cropText = (text, length) => {
        if (text.length > length) {
            text = text.substr(0, length-1) + '...'
        }

        return text;
    };

    return (
        <NavLink exact to={'/ziznannya/' + postId} className='post' key={postId}>
            <h3 className='post-title'>{postData.title}</h3>
            {postData.image
                ? <div className="post-image-wrapper">
                    <Image cloudName='dfgkgr7ui' publicId={postData.image} alt=''>
                        <Transformation height="300" fetchFormat="auto" width="auto" crop="scale" />
                    </Image>
                </div> : false}
            <div className="post-text">{cropText(postData.text, 215)}</div>
            <div className="post-additional">
                <div className="post-publication-data">
                    <span className="post-author">{postData.author}</span>
                    <span className="post-date">{postData.date}</span>
                </div>
                <div className='post-popularity-data'>
                    <span className="post-views-qty">{postData.viewsQty}</span>
                    <span className="post-likes-qty">{postData.likesQty}</span>
                    <span className="post-comments-qty">{postData.comments.length || 0}</span>
                </div>
            </div>
        </NavLink>
    )
};

export default PostPreview
