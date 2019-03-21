/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import request from "superagent";
import {Image, Transformation} from 'cloudinary-react';
import socket from "../../socket";
import popUpActions from "../../actions/popUpActions";

const CLOUDINARY_UPLOAD_PRESET = 'oddbpaek';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dfgkgr7ui/image/upload';

/**
 * CreatePost component
 */
class CreatePost extends Component {
    /**
     * CreatePost Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            uploadedFile: null,
            isAllowComments: true,
            validationError: null,
            imgPubId : null,
            isAdded: false
        };
    }
    
    componentDidMount() {
        socket.chat.off('post added').on('post added', () => {
            this.setState({
                isAdded: true
            });

            this.props.showPopUp('POST_ADDED');
        });
    }

    /**
     * Try to upload image
     *
     * @param file
     */
    handleImageUpload = (file) => {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
                .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                .field('tags', 'post')
                .field('folder', 'forum')
                .field('file', file);

        upload.end((err, response) => {
            if (err) {
                this.removePreview();
                this.props.showPopUp('IMAGE_UPLOADING_ERROR');
            } else if (response.body.secure_url !== '') {
                this.setState({
                    imgPubId: response.body.public_id
                });
            }
        });
    };

    /**
     * UChose image to upload
     *
     * @param e
     */
    uploadImage = (e) => {
        const files = e.target.files;

        if (files.length) {
            this.setState({
                uploadedFile: files[0],
            });

            this.handleImageUpload(files[0]);
        }
    };

    /**
     * Remove image
     */
    removePreview = () => {
        this.setState({
            uploadedFile: null,
            imgPubId : null
        })
    };

    /**
     * Get textarea element
     *
     * @param node
     */
    getTextareaRef = (node) => {
        this.textarea = node
    };

    /**
     * Get input element
     *
     * @param node
     */
    getInputRef = (node) => {
        this.input = node
    };

    /**
     * Create post
     */
    addPost = () => {
        let date = new Date(),
            dd = date.getDate(),
            mm = date.getMonth() + 1,
            yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        let fullDate = dd + '.' + mm + '.' + yyyy;

        let postData = {
            "author": this.props.isLoggedIn ? this.props.login : 'Гість',
            "authorId": this.props.isLoggedIn ? this.props.userId : '23742386234',
            "isAllowComments": this.state.isAllowComments,
            "title": this.input.value,
            "text": this.textarea.value,
            "image": this.state.imgPubId,
            "date": fullDate,
            "likesQty": 0,
            "viewsQty": 0,
            "comments": []
        };

        socket.chat.emit('create post', postData);
    };

    /**
     * Post title validation
     *
     * @param e
     */
    checkTitleLength = (e) => {
        let soLong = e.target.value.length > 50;

        this.setState({
            validationError: soLong ? 'Заголовок не може бути довшим ніж 50 символів' : false
        })
    };

    /**
     * Allow/disallow comments
     */
    manageComments = () => {
        this.setState({
            isAllowComments: !this.state.isAllowComments
        })
    };

    componentWillUnmount() {
        socket.chat.off('post added');
    }

    /**
     * Render CreatePost component
     */
    render() {
        if (this.state.isAdded) {
            return (<Redirect to='/ziznannya'/>)
        }

        return (
            <div>
                <h3>Створення нового поста</h3>
                <div className='post-create-form'>
                    <span className='post-create-label'>Заголовок:</span>
                    <input className='post-create-title'
                           type='text'
                           onChange={this.checkTitleLength}
                           ref={this.getInputRef}
                    />
                    <p className="error">{this.state.validationError}</p>
                    <span className='post-create-label'>Зображення:</span>
                    <div className="post-image">
                        {this.state.uploadedFile
                               ? this.state.imgPubId
                                    ? <React.Fragment>
                                        <span className='remove-preview' onClick={this.removePreview}/>
                                        <Image cloudName='dfgkgr7ui' publicId={this.state.imgPubId}>
                                            <Transformation height="120" fetchFormat="auto" width="120" crop="fill" />
                                        </Image>
                                    </React.Fragment>
                                    : <span className="loader"/>
                            : <label className='action upload-post-image'
                                   htmlFor='post_image'
                                   title='завантажити зображення'>
                                <input type='file'
                                       className='upload-photo'
                                       name='post_image'
                                       id='post_image'
                                       accept='image/*'
                                       onChange={this.uploadImage}
                                />
                            </label>}
                    </div>
                    <span className='post-create-label'>Текст поста:</span>
                    <textarea ref={this.getTextareaRef}/>
                    <label className={this.state.isAllowComments ? 'checkbox-label' : 'checkbox-label active'}>
                        <input type='checkbox' onChange={this.manageComments}/>
                        <span>Заборонити коментування</span>
                    </label>
                    <div className="actions buttons">
                        <button className='button ok-button'
                                disabled={this.state.validationError}
                                onClick={this.addPost}>Опублікувати</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn : state.user.isLoggedIn,
        nick       : state.user.nick,
        login      : state.user.login,
        userId     : state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Show popup
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePost))

