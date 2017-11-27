import React from 'react'
import './style.css'

export default class ColorSelector extends React.Component {
  constructor (props) {
    super(props)
    this.handlerColorChanged = this.handlerColorChanged.bind(this)
    this.state = {color: '#dd4a68'}
    chrome.storage.local.get({'color': '#dd4a68'}, (result) => {
      this.setState({'color': result['color']})
      console.log(result['color'])
    })
  }

  handlerColorChanged (event) {
    let color = event.target.value
    this.setState({'color': color})
    chrome.storage.local.set({'color': color}, () => {})
  }

  render () {
    const color = this.state.color
    return (
      <div className="color-selector">
        <p style={{color: color}}>[ Translator color ]</p>
        <input type="text" placeholder="#000000" value={color} onChange={this.handlerColorChanged} />
      </div>
    )
  }
}
