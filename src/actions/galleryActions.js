/**
 * @author Yuriy Matviyuk
 */
const galleryActions = {
    /**
     * Add new image to gallery
     *
     * @param data
     *
     * @returns {{payload: object, type: string}}
     */
    addImageToGallery: (data) => {
        return {
            type    : 'ADD_TO_GALLERY',
            payload : data
        }
    },

    /**
     * Show/hide image gallery
     *
     * @param isActive
     *
     * @returns {{payload: *, type: string}}
     */
    setGalleryVisibility: (isActive) => {
        return {
            type    : 'SET_GALLERY_VISIBILITY',
            payload : isActive
        }
    },

    setActiveGalleryType: (type) => {
        return {
            type    : 'SET_ACTIVE_GALLERY_TYPE',
            payload : type
        }
    },

    /**
     * Set active image index
     *
     * @param data
     *
     * @returns {{payload: *, type: string}}
     */
    setActiveIndex: (data) => {
        return {
            type: 'SET_ACTIVE_INDEX',
            payload: data
        }
    },

    /**
     * Remove image from gallery
     *
     * @param data
     * @returns {{payload: *, type: string}}
     */
    removeImageFromGallery: (data) => {
        return {
            type: 'REMOVE_FROM_GALLERY',
            payload: data
        }
    }
};

export default galleryActions;
