import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Placeholder from './placeholder'

import NotAvailablePlaceholder from './not-available-placeholder'
import WaitingPlaceholder from './waiting-placeholder'

export const defaultMaxSize = 120
export const notAvailableStatus = 'not-available'
export const waitingStatus = 'waiting'

class Thumbnail extends Component {
    static propTypes = {
        customResizer: PropTypes.func,
        fromServer: PropTypes.bool,
        id: PropTypes.number.isRequired,
        maxSize: PropTypes.number,
        notAvailablePlaceholder: PropTypes.element,
        uploader: PropTypes.object.isRequired,
        waitingPlaceholder: PropTypes.element,
        uploadSubmissions: PropTypes.array
    };

    static defaultProps = {
        maxSize: defaultMaxSize
    };

    constructor() {
        super()

        this.state = {
            drawComplete: false
        }
    }

    componentDidMount() {
        this.props.uploader.methods.drawThumbnail(
            this.props.id,
            this._canvas,
            this.props.maxSize,
            this.props.fromServer,
            this.props.customResizer
        )
            .then(
                () => {
                    this.setState({
                        drawComplete: true,
                        success: true
                    })
                },

                () => {
                    this.setState({
                        drawComplete: true,
                        success: false
                    })
                }
            )
    }


    render() {
        const customContainerClassName = this.props.className && this.props.className + '-container'

        return (
            <span className={ `react-fine-uploader-thumbnail-container ${customContainerClassName || ''}` }>
                <canvas className={ `react-fine-uploader-thumbnail ${this.props.className || ''}` }
                        hidden={ !this.state.drawComplete || this._failure }
                        ref={ component => this._canvas = component }
                />

                { this._maybePlaceholder }
            </span>
        )
    }

    get _failure() {
        return this.state.drawComplete && !this.state.success
    }

    get _maybePlaceholder() {
        if (this._failure){
            const notAvailableImage = (
                <NotAvailablePlaceholder maxSize={ this.props.maxSize } />
            )
            let thumbnail
            console.log('thumbnail for', this.props.id, 'heres submissions:', this.props.uploadSubmissions)
            let submission = this.props.uploadSubmissions.filter(({id}) => id === this.props.id)
            if(submission.length == 1) {
                submission = submission[0]
                if(submission.thumbnailComponent) {
                    thumbnail = submission.thumbnailComponent
                }
            }
            if(!thumbnail) {
                thumbnail = this.props.notAvailablePlaceholder || notAvailableImage
            }
            return (
                <Placeholder className={ `react-fine-uploader-thumbnail ${this.props.className || ''}` }
                             image={ thumbnail }
                             size={ this.props.maxSize }
                             status={ notAvailableStatus }
                />
            )
        }
        else if (!this.state.drawComplete) {
            const waitingImage = (
                <WaitingPlaceholder maxSize={ this.props.maxSize } />
            )

            return (
                <Placeholder className={ `react-fine-uploader-thumbnail ${this.props.className || ''}` }
                             image={ this.props.waitingPlaceholder || waitingImage }
                             size={ this.props.maxSize }
                             status={ waitingStatus }
                />
            )
        }

        return <span />
    }
}

export default Thumbnail
