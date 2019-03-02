/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import ChatToolbar from './ChatToolbar'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import MessagesWrapper from '../smart/MessagesWrapper'
import socket from "../../socket";
import roomActions from "../../actions/roomActions";
import {connect} from "react-redux";
import messageActions from "../../actions/messageActions";
import popUpActions from "../../actions/popUpActions";

const CLOUDINARY_UPLOAD_PRESET = 'oddbpaek';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dfgkgr7ui/image/upload';

/**
 * ChatWindow component
 */
class ChatWindow extends Component {
    /**
     * ChatWindow Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isTyping     : false,
            uploadedFile : null,
        };
    }

    /**
     * Drop image in dropzone handler
     *
     * @param files
     */
    onImageDrop = (files) => {
        if (files.length) {
            this.setState({
                uploadedFile: files[0],
            });
            this.props.setIsUploadedImage({type: this.props.type, isUploaded: true});
            this.handleImageUpload(files[0]);
        }
    };

    /**
     * Select image to upload
     *
     * @param e
     */
    imageSelect = (e) => {
        this.onImageDrop(e.target.files);
        e.target.value = null
    };

    /**
     * Image upload handler
     *
     * @param file
     */
    handleImageUpload = (file) => {
        let type = this.props.type,
            upload = request.post(CLOUDINARY_UPLOAD_URL)
            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                this.removeImagePreview();
                this.props.showPopUp('IMAGE_UPLOADING_ERROR');
            } else if (response.body.secure_url !== '') {
                this.props.setImageUrl({type, imageUrl: response.body.secure_url});
                this.props.setImagePublicId({type, id: response.body.public_id});
            }
        });
    };

    /**
     * Remove image preview
     */
    removeImagePreview = () => {
        this.props.setIsUploadedImage({type: this.props.type, isUploaded: false});
        this.deleteImage()
    };

    /**
     * Delete image from cloud
     */
    deleteImage = () => {
        this.props.setImageUrl({type: this.props.type, imageUrl: null});

        socket.chat.emit(
            'remove uploaded image',
            this.props.type === 'public' ? this.props.publicImageId : this.props.privateImageId
        )
    };

    /**
     * Set preview image url from clipboard
     *
     * @param src
     */
    setPreviewImgUrl = (src) => {
        this.props.setIsUploadedImage({type: this.props.type, isUploaded: true});
        this.props.setImageUrl({type: this.props.type, imageUrl: src})
    };

    /**
     * Render ChatWindow component
     */
    render() {
        let chatClassName = 'chat-window ' + this.props.type;

        return (
            <Dropzone multiple={false}
                      accept="image/*"
                      className={'chat-window ' + chatClassName}
                      activeClassName="active"
                      style={{position: "absolute"}}
                      disableClick={true}
                      onDrop={this.onImageDrop.bind(this)}>
                <MessagesWrapper type={this.props.type}/>
                <ChatToolbar type={this.props.type}
                             removeImagePreview={this.removeImagePreview}
                             imageSelect={this.imageSelect}
                />
            </Dropzone>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        publicImageId  : state.message.public.imagePublicId,
        privateImageId : state.message.private.imagePublicId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set set room is full
         *
         * @param isFull
         */
        setIsFull: (isFull) => {
            dispatch(roomActions.setIsFull(isFull))
        },

        /**
         * Set uploaded image url
         *
         * @param url
         */
        setImageUrl: (url) => {
            dispatch(messageActions.setImageUrl(url))
        },

        /**
         * Show popup
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        },

        /**
         * Set image public id
         *
         * @param id
         */
        setImagePublicId: (id) => {
            dispatch(messageActions.setImagePublicId(id))
        },

        /**
         * Set is uploaded image
         *
         * @param isUploaded
         */
        setIsUploadedImage: (isUploaded) => {
            dispatch(messageActions.setIsUploadedImage(isUploaded))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
