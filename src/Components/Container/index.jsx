import React from 'react'
import Footer from '../Footer'
import Hotkey from '../Hotkey'
import ColorSelctor from '../ColorSelector'
import './style.css'

export default class Container extends React.Component {
  render () {
    return (
      <div className="container">
        <h1>Coconut Translator</h1>
        <Hotkey />
        <ColorSelctor />
        <Footer version="0.0.2" />
      </div>
    )
  }
}
