/**
 * @author Yuriy Matviyuk
 */
const forumActions = {
    /**
     * Set all posts data
     *
     * @param posts
     *
     * @returns {{payload: *, type: string}}
     */
    setAllPostsData: (posts) => {
        return {
            type: 'SET_POSTS',
            payload: posts
        }
    }
};

export default forumActions;
