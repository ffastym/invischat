/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import socket from "../../socket";
import forumActions from "../../actions/forumActions";
import popUpActions from "../../actions/popUpActions";
import Loader from "../dumb/Loader";
import {Image, Transformation} from 'cloudinary-react';
import userActions from "../../actions/userActions";

/**
 * Post component
 */
class Post extends Component {
    /**
     * Post Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            comment: null
        };
    }

    /**
     * Component was mounted in DOM
     */
    componentDidMount() {
        const postId = this.props.match.params.post_id.toString();

        if (!this.props.postsData) {
            socket.chat.emit('fetch posts')
        } else {
            socket.chat.emit('see post', postId);
        }

        socket.chat.on('get posts', (posts) => {
            let postsData = {};

            posts.forEach((post) => {
                postsData[post.post_id] = post.post
            });

            this.props.setAllPostsData(postsData);
            socket.chat.emit('see post', postId);
        });

        socket.chat.off('seen post').on('seen post', () => {
            let postsData = {...this.props.postsData};
            postsData[postId].viewsQty += 1;
            this.props.setAllPostsData(postsData)
        })
    }

    getTextareaRef = (node) => {
        this.textarea = node;
    };

    setTextareaFocus = () => {
        if (!this.props.isLoggedIn) {
            return this.props.showPopUp('LOGIN')
        }

        this.textarea.focus()
    };

    /**
     * Like post
     */
    likePost = () => {
        if (!this.props.isLoggedIn) {
            return this.props.showPopUp('LOGIN')
        }

        const postId = this.props.match.params.post_id;

        let prevLikedList = this.props.likedPosts,
            newLikedPostsList = {...prevLikedList},
            postsData = {...this.props.postsData},
            userId = this.props.userId,
            isLike;

        if (prevLikedList[postId]) {
            isLike = false;
            postsData[postId].likesQty -= 1;
            delete newLikedPostsList[postId]
        } else {
            isLike = true;
            postsData[postId].likesQty += 1;
            newLikedPostsList[postId] = true
        }

        socket.chat.emit('like post', {userId, isLike, postId});

        this.props.setAllPostsData(postsData);
        this.props.likeDislikePost(newLikedPostsList)
    };

    addComment = () => {
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

        let data = {
            text: this.state.comment,
            author: this.props.login,
            postId: this.props.match.params.post_id,
            date: fullDate
        };

        socket.chat.emit('comment post', data);

        this.textarea.value = ''
    };

    setCommentText = (e) => {
        this.setState({
            comment: e.target.value
        })
    };

    componentWillUnmount() {
        socket.chat.off('seen post')
    }

    /**
     * Render Post component
     */
    render() {
        if (!this.props.postsData) {
            return (
                <div className='loader-wrapper'>
                    <Loader text='Пост завантажується, будь ласка, зачекайте...'/>
                </div>
            )
        }

        const postId = this.props.match.params.post_id,
            postData = this.props.postsData[postId];

        if (!postData) {
            return (
                <div className='post-not-found'>
                    <h5>Пост не знайдено</h5>
                    <p>Нажаль неможливо відобразити даний пост. Можливо його не існує або він був видалений</p>
                    <NavLink exact to='/ziznannya'>Повернутися до стрічки</NavLink>
                </div>
            )
        }

        const postsIds = Object.keys(this.props.postsData),
            commentsData = postData.comments,
            likeBtnClassName = this.props.likedPosts[postId]
                ? 'post-view-like liked' : 'post-view-like',
            commentsQty = commentsData && (commentsData.length || 0),
            comments = [];

        if (commentsQty) {
            commentsData.forEach((comment, id) => {
                comments.push(
                    <div className="post-comment" key={id}>
                        <div className="post-comment-text">{comment.text}</div>
                        <div className='post-comment-data'>
                            <span className="post-comment-author">{comment.author}</span>
                            <span className="post-comment-date">{comment.date}</span>
                        </div>
                    </div>
                )
            })
        }

        let prevPostId = parseInt(postId) + 1,
            nextPostId = parseInt(postId) - 1,
            hasPrevPost = postsIds.indexOf(prevPostId.toString(10)) !== -1,
            hasNextPost = postsIds.indexOf(nextPostId.toString(10)) !== -1;
        return (
            <div className='post-view'>
                <div className="post-toolbar">
                    <NavLink exact className="post-nav-link back" to={'/ziznannya'}/>
                    {hasPrevPost && <NavLink className='post-nav-link prev' to={'/ziznannya/' + prevPostId}/>}
                    <span className={likeBtnClassName} onClick={this.likePost}/>
                    {postData.isAllowComments && <span className="post-view-comment" onClick={this.setTextareaFocus}/>}
                    {hasNextPost && <NavLink className='post-nav-link next' to={'/ziznannya/' + nextPostId}/>}
                </div>
                <div className='post'>
                    <h3 className='post-title'>{postData.title}</h3>
                    {postData.image
                        ? <div className="post-image-wrapper">
                            <Image cloudName='dfgkgr7ui' publicId={postData.image} alt=''>
                                <Transformation height="400" fetchFormat="auto" width="auto" crop="scale" />
                            </Image>
                        </div> : false}
                    <div className="post-text">{postData.text}</div>
                    <div className="post-additional">
                        <div className="post-publication-data">
                            <span className="post-author">{postData.author}</span>
                            <span className="post-date">{postData.date}</span>
                        </div>
                        <div className='post-popularity-data'>
                            <span className="post-views-qty">{postData.viewsQty}</span>
                            <span className="post-likes-qty">{postData.likesQty}</span>
                            <span className="post-comments-qty">{commentsQty}</span>
                        </div>
                    </div>
                </div>
                <div className="post-comments">
                    <span className="post-comments-title">{'Коментарі (' + commentsQty + ') :'}</span>
                    <div className="post-comments-wrapper">
                        {comments.length
                            ? comments
                            : postData.isAllowComments
                                && <p className='comments-message'>До даного поста ще немає коментарів</p>}
                    </div>
                </div>
                {this.props.isLoggedIn && postData.isAllowComments
                    && <div className="post-write-comment">
                        <span className="post-comments-title">Написати коментар</span>
                        <textarea ref={this.getTextareaRef} onChange={this.setCommentText}/>
                        <div className="actions buttons">
                            <button className='button ok-button'
                                    disabled={!this.state.comment}
                                    onClick={this.addComment}>
                                Відправити
                            </button>
                        </div>
                    </div>}
                {!postData.isAllowComments
                    && <p className='comments-message'>Автор заборонив коментування запису</p>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        postsData  : state.forum.postsData,
        isLoggedIn : state.user.isLoggedIn,
        likedPosts : state.user.likedPosts,
        login      : state.user.login,
        userId     : state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Set all posts data
         *
         * @param posts
         */
        setAllPostsData: (posts) => {
            dispatch(forumActions.setAllPostsData(posts))
        },

        /**
         * Change liked posts list
         *
         * @param list
         */
        likeDislikePost: (list) => {
            dispatch(userActions.likeDislikePost(list))
        },

        /**
         * Show popUp
         *
         * @param type
         */
        showPopUp: (type) => {
            dispatch(popUpActions.showPopUp(type))
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post))
