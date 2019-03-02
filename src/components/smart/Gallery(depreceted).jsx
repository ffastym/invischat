import React, {Component} from 'react'

/**
 * Image component
 */
class Gallery extends Component {
    state = {
        activeImageIndex: null
    };

    /**
     * ComponentDidMount method
     */
    componentDidMount() {
        let imageIndex = this.props.gallery.name === 'privateGallery' ?
            this.props.privateImageIndex :
            this.props.publicImageIndex;

        this.props.gallery.data.forEach((value, index) => {
            if (index === imageIndex) {
                this.setState({
                    activeImageIndex: index
                })
            }
        });
    }

    /**
     * Click on prev button handler
     */
    showPrevImage = () => {
        this.state.activeImageIndex > 0 &&
            this.setState({
                activeImageIndex: this.state.activeImageIndex -1
            })
    };

    /**
     * Click on next button handler
     */
    showNextImage = () => {
        this.state.activeImageIndex < this.props.gallery.data.length -1 &&
            this.setState({
                activeImageIndex: this.state.activeImageIndex +1
            })
    };

    /**
     * Render component
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="image-wrapper">
                {(this.props.gallery.data.length > 1 && this.state.activeImageIndex !== 0) &&
                    <span
                        title="попереднє зображення"
                        className="slider-arrow prev"
                        onClick={this.showPrevImage}/>}
                {this.state.activeImageIndex !== null ?
                    <img src={this.props.gallery.data[this.state.activeImageIndex]} alt=""/> :
                    <span className="loader"/>}
                {(this.props.gallery.data.length > 1 && this.state.activeImageIndex < this.props.gallery.data.length - 1) &&
                    <span
                        title="наступне зображення"
                        className="slider-arrow next"
                        onClick={this.showNextImage}/>}
            </div>
        )
    }
}

export default Gallery
