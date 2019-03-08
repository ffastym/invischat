import popUpActions from "../../actions/popUpActions"
import React, {Component} from 'react'
import socket from "../../socket"
import {connect} from "react-redux"

/**
 * Rating component
 */
class Rating extends Component {
    state = {
        disabled: false,
        tempRating: null,
        rating: 5
    };

    /**
     * Rate
     * 
     * @param rating
     */
    rate = (rating) => {
        this.setState({
            rating: rating,
            tempRating: rating
        });
    };

    /**
     * Star over method
     *
     * @param rating
     */
    starOver = (rating) => {
        this.setState({
            tempRating: this.state.rating,
            rating: rating
        });
    };

    /**
     * Star out method
     */
    starOut = () => {
        this.setState({
            rating: this.state.rating
        });
    };

    /**
     * Send rate method
     */
    sendRate = () => {
        socket.chat.emit('chat rate', this.state.rating);
        localStorage.setItem('rating', this.state.rating);
        return this.props.hidePopUp();
    };

    /**
     * Render component method
     *
     * @returns {*}
     */
    render() {
        var stars = [];

        for(var i = 1; i < 6; i++) {
            var className = 'star-rating__star';

            if (this.state.rating >= i && this.state.rating != null) {
                className += ' is-selected';
            }

            stars.push(
                <label  className={className}
                        key={i}
                        onClick={this.rate.bind(this, i)}
                        onMouseOver={this.starOver.bind(this, i)}
                        onMouseOut={this.starOut}>
                    ★
                </label>
            );
        }

        return (
            <React.Fragment>
                <div className="pop-up-text">
                    Ви уже провели тривалиий час у нашому чаті. Пропонуємо оцінити на скільки він Вам сподобався
                    або не сподобався. Ваша думка важлива для нас!
                </div>
                <p className='pop-up-stars'>{stars}</p>
                <div className="pop-up-actions">
                    <button className="button ok-button" onClick={this.sendRate}>Оцінити</button>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Hide popup
         */
        hidePopUp: () => {
            dispatch(popUpActions.hidePopUp())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rating)
