import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EditableStuff from '../components/editableStuff.js'
class Filename extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        uploader: PropTypes.object.isRequired,
        editable: PropTypes.bool,
        onFilenameChange: PropTypes.func
    };

    constructor(props) {
        super(props)

        this.state = {
            filename: props.uploader.methods.getName(props.id)
        }

        this._interceptSetName()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.filename !== this.state.filename
    }

    render() {
      //console.log(".... editable?", "filename:", this.state.filename, this.state.filename.indexOf('(thumbnail).') === -1);
        return (
          <React.Fragment>
            {
              this.props.editable ?
              <EditableStuff
                key={this.props.id}
                textToEdit={this.state.filename}
                labelClassName="editable"
                inputPlaceHolder={this.state.filename}
                editable={true/*this.state.filename.indexOf('(thumbnail).') === -1*/ /* don't allow to edit thumbail name */ }
                action = {
                  (editedText) => {
                      console.log('setting new filename:', editedText)
                      this.props.uploader.methods.setName(this.props.id, editedText)
                  }
                }/>
              : <span className={ `react-fine-uploader-filename ${this.props.className || ''}` }>
                  { this.state.filename }
              </span>
            }
          </React.Fragment>
        )
    }

    _interceptSetName() {
        const oldSetName = this.props.uploader.methods.setName

        this.props.uploader.methods.setName = (id, newName) => {
            oldSetName.call(this.props.uploader.methods, id, newName)

            if (id === this.props.id) {
                this.setState({
                    filename: newName
                })
            }
        }
    }
}

export default Filename
