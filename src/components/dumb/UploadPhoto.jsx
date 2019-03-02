/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

/**
 * UploadPhoto component
 *
 * @param props

 * @returns {*}
 * @constructor
 */
const UploadPhoto = (props) => {
    let inputId = 'upload_' + props.type + '_photo';

    return (
        <label className='action upload-photo' htmlFor={inputId} title='завантажити зображення'>
            <input type='file'
                   className='upload-photo'
                   name={inputId}
                   id={inputId}
                   accept='image/*'
                   onChange={props.imageSelect}
            />
        </label>
    )
};

export default UploadPhoto
