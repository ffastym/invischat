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
            fromCache: true,
            posts: [],
            lastPostIndex: 0,
            hasMore: true
        };

        if (props.posts) {
            this.loadPosts()
        }
    }

    componentDidMount() {
        this.loadPosts();
    }

    componentDidUpdate(prevProps) {debugger;
        if (!prevProps.posts && this.props.posts) {
            this.loadPosts();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.fromCache && nextProps.posts) {
            return {
                posts: [],
                fromCache: false,
                lastPostIndex: 0
            };
        }
        
        return null
    }

    scrollList = (e) => {
        const listWrapper = e.target;

        if (listWrapper.scrollHeight <= Math.ceil(listWrapper.scrollTop + listWrapper.clientHeight + 1) && this.state.hasMore) {
            this.loadPosts()
        }
    };

    loadPosts = () => {
        console.log(this.props.cachedPosts);
        let posts = this.props.posts ? this.props.posts : this.props.cachedPosts,
            postIds = Object.keys(posts).reverse(),
            lastId = 0,
            list = [];

        if (posts && postIds.length) {
            let counter = 0;

            postIds.forEach((postId) => {
                if (!posts.hasOwnProperty(postId) || postIds.indexOf(postId) <= this.state.lastPostId) {
                    return
                }

                if (counter <= 5) {
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
