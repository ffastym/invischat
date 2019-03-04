/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import galleryActions from "../../actions/galleryActions";
import {connect} from "react-redux";

/**
 * Gallery component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const Gallery = (props) => {
    const type = props.gallery.activeType,
          gallery = props.gallery[type].images,
          activeImageIndex = props.gallery[type].activeIndex;

    const showPrevImage = () => {
        if (activeImageIndex > 0) {
            props.setActiveIndex({type, activeIndex: activeImageIndex - 1});
        }
    };

    const showNextImage = () => {
        if (activeImageIndex < gallery.length -1) {
            props.setActiveIndex({type, activeIndex: activeImageIndex + 1});
        }
    };

    return (
        <div className="image-gallery">
            <span className="close close-gallery" onClick={props.hideGallery}/>
            {(gallery.length > 1 && activeImageIndex !== 0) &&
            <span
                title="попереднє зображення"
                className="gallery-link prev"
                onClick={showPrevImage}/>}
            {activeImageIndex !== null ?
                <img src={gallery[activeImageIndex]} alt=""/> :
                <span className="loader"/>}
            {(gallery.length > 1 && activeImageIndex < gallery.length - 1) &&
            <span
                title="наступне зображення"
                className="gallery-link next"
                onClick={showNextImage}/>}
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        gallery: state.gallery
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Hide image gallery
         */
        hideGallery: () => {
            dispatch(galleryActions.setGalleryVisibility(false))
        },

        setActiveIndex: (data) => {
            dispatch(galleryActions.setActiveIndex(data))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)

