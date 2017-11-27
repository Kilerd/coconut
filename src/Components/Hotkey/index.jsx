import React from 'react'
import './style.css'

export default class Hotkey extends React.Component {
  constructor (props) {
    super(props)
    this.handleFirstKeyChanged = this.handleFirstKeyChanged.bind(this)
    this.handleSecondKeyChanged = this.handleSecondKeyChanged.bind(this)
    this.state = {first: 'CTRL', second: 'k'}
    chrome.storage.local.get({'first': 'CTRL', 'second': 'k'}, (result) => {
      this.setState({'first': result['first'], 'second': result['second']})
      console.log(result)
    })
  }
  handleFirstKeyChanged (event) {
    let first = event.target.value
    this.setState({'first': first})
    console.log(first, this.state.first)
    chrome.storage.local.set({'first': first}, () => {})
  }
  handleSecondKeyChanged (event) {
    let second = event.target.value
    this.setState({'second': second})
    chrome.storage.local.set({'second': second}, () => {})
  }
  render () {
    const first = this.state.first
    const second = this.state.second
    const isOSX = ~navigator.userAgent.indexOf('Mac OS X')
    const command = isOSX ? 'COMMAND' : 'WIN'
    return (
      <div className="dropdown">
        <select size="4" value={first} onChange={this.handleFirstKeyChanged} >
          <option value="SHIFT">SHIFT</option>
          <option value="CTRL">CTRL</option>
          <option value="ALT">ALT</option>
          <option value="COMMAND">{command}</option>
        </select>
        <p>+</p>
        <select className="second" size="4" value={second} onChange={this.handleSecondKeyChanged} >
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
          <option value="e">E</option>
          <option value="f">F</option>
          <option value="g">G</option>
          <option value="h">H</option>
          <option value="i">I</option>
          <option value="j">J</option>
          <option value="k">K</option>
          <option value="l">L</option>
          <option value="m">M</option>
          <option value="n">N</option>
          <option value="o">O</option>
          <option value="p">P</option>
          <option value="q">Q</option>
          <option value="r">R</option>
          <option value="s">S</option>
          <option value="t">T</option>
          <option value="u">U</option>
          <option value="v">V</option>
          <option value="w">W</option>
          <option value="s">S</option>
          <option value="y">Y</option>
          <option value="z">Z</option>
        </select>
      </div>
    )
  }
}
