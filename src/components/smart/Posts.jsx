/**
 * @author Yuriy Matviyuk
 */
import React, { Component, Suspense, lazy } from 'react';
import {NavLink, withRouter} from "react-router-dom";
import Loader from "../dumb/Loader";
import {connect} from "react-redux";

const LazyPostPreview = lazy(() => import('../dumb/PostPreview'));

/**
 * Posts component
 */
class Posts extends Component {
    /**
     * Posts Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {
            posts: [],
            lastPostIndex: 0,
            hasMore: true
        };
    }

    componentDidMount() {
        this.loadPosts();
    }

    scrollList = (e) => {
        const listWrapper = e.target;

        if (listWrapper.scrollHeight <= Math.ceil(listWrapper.scrollTop + listWrapper.clientHeight + 1) && this.state.hasMore) {
            this.loadPosts()
        }
    };

    loadPosts = () => {
        let posts = this.props.posts,
            postIds = Object.keys(posts).reverse(),
            lastId = 0,
            list = [];

        if (posts && postIds.length) {
            let counter = 0;

            postIds.forEach((postId, index) => {
                if (!posts.hasOwnProperty(postId) || postIds.indexOf(postId) <= this.state.lastPostId) {
                    return
                }

                if (counter <= 4) {
                    let postData = posts[postId];

                    list.push(
                        <Suspense key={postId} fallback={<Loader text='Пост завантажується...'/>}>
                            <LazyPostPreview postId={postId} postData={postData}/>
                        </Suspense>
                    );

                    counter++;
                    lastId = postId;
                } else {
                    return false
                }
            });

            let lastPostId = postIds.indexOf(lastId);

            this.setState({
                lastPostId,
                posts: [...this.state.posts, ...list],
                hasMore: lastPostId !== postIds.length - 1
            })
        }
    };

    /**
     * Render Posts component
     */
    render() {
        return (
            <div className='posts-list'
                 ref={node => this.listRef = node}
                 onScroll={this.scrollList}>
                <NavLink className='post-add' to='/ziznannya/new_post'/>
                {this.state.posts}
                {this.state.hasMore
                    ? <Loader/>
                    : <button className='button ok-button'
                              onClick={() => this.listRef.scrollTo(0,0)}>
                        На початок
                </button>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn
    }
};

export default withRouter(connect(mapStateToProps)(Posts))
