'use strict'

const React = require('react')

const SIZER_STYLES = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre'
}

const STYLE_PROPS = [
  'fontSize',
  'fontFamily',
  'fontWeight',
  'fontStyle',
  'letterSpacing'
]

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputWidth: null }
  }

  componentDidMount () {
    if (this.props.autoresize) {
      this.copyInputStyles()
      this.updateInputWidth()
    }

    if (this.props.autofocus) {
      this.input.focus()
    }
  }

  componentDidUpdate (prevProps) {
    this.updateInputWidth()
  }

  componentWillReceiveProps (newProps) {
    if (this.input.value !== newProps.query) {
      this.input.value = newProps.query
    }
  }

  copyInputStyles () {
    const inputStyle = window.getComputedStyle(this.input)

    STYLE_PROPS.forEach((prop) => {
      this.sizer.style[prop] = inputStyle[prop]
    })
  }

  updateInputWidth () {
    let inputWidth

    if (this.props.autoresize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      inputWidth = Math.ceil(this.sizer.scrollWidth) + 2
    }

    if (inputWidth !== this.state.inputWidth && isNaN(inputWidth) === false) {
      this.setState({ inputWidth })
    }
  }

  render () {
    const sizerText = this.props.query || this.props.placeholder

    const { expandable, placeholder, listboxId, selectedIndex } = this.props

    const selectedId = `${listboxId}-${selectedIndex}`

    return (
      React.createElement( 'div', { className: this.props.classNames.searchInput },
        React.createElement( 'input', {
          ref: (c) => { this.input = c }, role: 'combobox', 'aria-autocomplete': 'list', 'aria-label': placeholder, 'aria-owns': listboxId, 'aria-activedescendant': selectedIndex > -1 ? selectedId : null, 'aria-expanded': expandable, placeholder: placeholder, style: { width: this.state.inputWidth } }),
        React.createElement( 'div', { ref: (c) => { this.sizer = c }, style: SIZER_STYLES }, sizerText)
      )
    )
  }
}

module.exports = Input
