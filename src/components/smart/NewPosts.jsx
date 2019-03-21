/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import socket from "../../socket";
import {Image, Transformation} from "cloudinary-react";

/**
 * NewPosts component
 */
class NewPosts extends Component {
    /**
     * NewPosts Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            newPosts: null
        };
    }

    componentDidMount() {
        socket.chat.emit('fetch new posts');
        socket.chat.on('get new posts', posts => {
            let newPosts = {};

            posts.forEach((post) => {
                newPosts[post._id] = post
            });

            this.setState({newPosts})
        })
    }

    /**
     * Add or delete post
     *
     * @param e
     * @param publish
     */
    managePost = (e, publish = true) => {
        let newPosts = {...this.state.newPosts},
            postId = e.target.dataset.postId,
            post = newPosts[postId],
            newPost = {...post, publish};

        socket.chat.emit('add/delete post', newPost);

        delete newPosts[postId];

        this.setState({newPosts});
    };

    /**
     * Render NewPosts component
     */
    render() {
        let posts = this.state.newPosts,
            list = [];

        if (!posts) {
            return 'Нових постів немає'
        }

        for (let id in posts) {
            if (!posts.hasOwnProperty(id)) {
                continue
            }

            let post = posts[id];

            list.push(
                <div className='new-post' key={id}>
                    <h4>{posts.title}</h4>
                    <Image cloudName='dfgkgr7ui' publicId={post.image} alt=''>
                        <Transformation height="200" fetchFormat="auto" width="auto" crop="scale" />
                    </Image>
                    <p>{post.text}</p>
                    <div className='new-post-actions'>
                        <button type='button'
                                onClick={(e) => this.managePost(e,false)}
                                data-post-id={post._id}
                                className='button button-reject'>Delete</button>
                        <button type='button'
                                onClick={(e) => this.managePost(e)}
                                data-post-id={post._id}
                                className='button button-accept'>Add</button>
                    </div>
                </div>
            )
        }

        return (
            <div className='new-posts-list'>
                {list}
            </div>
        )
    }
}

export default NewPosts
