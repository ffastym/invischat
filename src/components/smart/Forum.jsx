/**
 * @author Yuriy Matviyuk
 */
import React, {Component} from 'react'
import {Switch, Route, withRouter} from "react-router-dom";
import CreatePost from './CreatePost';
import socket from "../../socket";
import Posts from "./Posts";
import NewPosts from "./NewPosts";
import Post from "./Post";
import {connect} from "react-redux";
import Loader from "../dumb/Loader";
import forumActions from "../../actions/forumActions";
import {Helmet} from "react-helmet";

/**
 * Forum component
 */
class Forum extends Component {
    /**
     * Forum Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {};
    }

    componentDidMount() {
        if (!this.props.postsData) {
            socket.chat.emit('fetch posts')
        }

        socket.chat.on('get posts', (posts) => {
            let postsData = {};

            posts.forEach((post) => {
                postsData[post.post_id] = post.post
            });

            this.props.setAllPostsData(postsData)
        });

        socket.chat.off('update post data').on('update post data', data => {
            let newPostsData = {...this.props.postsData};

            newPostsData[data.postId].comments.push(data);

            this.props.setAllPostsData(newPostsData)
        });
    }

    /**
     * Render Forum component
     */
    render() {
        let title = 'Анонімний Форум Зізнання',
        description = 'Думки, історії, зізнання... Invischat - Відкрий душу, не втративши гідності',
        keywords = 'форум, анонімний форум, зізнання, історії, зізнання ТЗ, зізнання ІФ, шукаю тебе, знакомства, некто, штт, зізнання, форум Львів, форум Тернопіль, Invischat';


        return (
            <div className='page-content forum'>
                <Switch>
                    <Route exact path='/ziznannya' render = {() => (
                        this.props.postsData
                            ? <Posts posts={this.props.postsData}/>
                            : <div className='loader-wrapper'>
                                <Loader text='Пости завантажуються, будь ласка, зачекайте...'/>
                            </div>
                        )}
                    />
                    <Route exact path='/ziznannya/new_post' component={CreatePost}/>
                    <Route exact path='/ziznannya/new_posts_list' component={NewPosts}/>
                    <Route path='/ziznannya/:post_id' component={Post}/>
                </Switch>
                <Helmet
                    title={title}
                    meta={[
                        {
                            name: 'description',
                            content: description,
                        },
                        {
                            name: 'keywords',
                            content: keywords,
                        }
                    ]}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        postsData  : state.forum.postsData
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
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forum))
