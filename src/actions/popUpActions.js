/**
 * @author Yuriy Matviyuk
 */
const popUpActions = {
    /**
     * Show popup
     *
     * @param type
     *
     * @returns {{payload: *, type: string}}
     */
    showPopUp: (type) => {
        return {
            type    : 'SHOW_POPUP',
            payload : type
        }
    },

    /**
     * Hide popup
     *
     * @returns {{type: string}}
     */
    hidePopUp: () => {
        return {
            type: 'HIDE_POPUP'
        }
    }
};

export default popUpActions;
