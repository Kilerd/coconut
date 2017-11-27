import keymage from 'keymage'
import { ticket } from './google-utils'

const FIRST_KEY = {
  'SHIFT': 'shift',
  'CTRL': 'ctrl',
  'ALT': 'alt',
  'COMMAND': 'win'
}

const SPLIT_CHAR = '(<.*>)?'

const isEmpty = (str) => { return str !== '' } // determine whether str is empty
const escapeChar = (str) => { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') } // escape char for safty regex
const randomInt = (min, max) => { return parseInt(Math.random() * (max - min + 1) + min, 10) }

let translationColor = '#dd4a68'

// send request to google for getting translation
// after getting translation, put it to element <inline class="inline-{id}">
let sendTranslateRequest = (id, str) => {
  let strEncoded = encodeURIComponent(str)

  let url = 'https://translate.google.cn/translate_a/single?client=t&sl=en&tl=zh-CN&hl=zh-CN&' +
    'dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&sou' +
    'rce=sel&tk=' + ticket(str) + '&q=' + strEncoded

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById('inline-' + id).innerText = ' [ ' + data[0][0][0] + ' ] '
    })
}

// get selected html
let getSelectedContents = () => {
  if (window.getSelection) {
    let range = window.getSelection().getRangeAt(0)
    let container = document.createElement('div')
    container.appendChild(range.cloneContents())
    return container.innerHTML
  }
}

// split string into sentence
// rule 1: split by lines
// rule 2: try to split each line into sentence by key char : . ! ?
let stringSplitIntoSentence = (str) => {
  return str
    .replace(/\r|\n|\r\n/gm, '')
    .replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, '$1$2|||||||')
    .split('|||||||')
    .filter(isEmpty)
}

// the entrance for translate
let getTranslation = (str) => {
  let id = randomInt(10000000, 99999999)
  sendTranslateRequest(id, str)
  return "<inline style='color: " + translationColor + "' id='inline-" + id + "'> [ ... ] </inline>"
}

let strToRegExp = (str) => {
  return '(' + SPLIT_CHAR + (str
    .split('')
    .map(escapeChar)
    .map((char) => { if (char === ' ') { return '( |\r|\n|\r\n)?' } return char })
    .join(SPLIT_CHAR)) + SPLIT_CHAR + ')'
}

// start translation process
let startTranslate = (text, html, parent) => {
  let htmlCopy = html
  let sentences = stringSplitIntoSentence(text)

  for (let sentence of sentences) {
    let translation = getTranslation(sentence)

    // repalce orginal html
    htmlCopy = htmlCopy.replace(RegExp(strToRegExp(sentence), 'm'), '$&' + translation)
  }

  parent.innerHTML = parent.innerHTML.replace(html, htmlCopy)
}

let translateProcess = () => {
  // get what text and html selected
  let userSelection = window.getSelection ? window.getSelection() : document.selection.createRange()
  let textSelected = userSelection.toString()

  let range = userSelection.getRangeAt(0)
  let minimalParent = range.commonAncestorContainer

  if (!minimalParent.insertAdjacentHTML) {
    minimalParent = minimalParent.parentNode
  }
  let HTMLSelected = getSelectedContents().toString()

  startTranslate(textSelected, HTMLSelected, minimalParent)
}

// set the hotkey
let keyListener = (result) => {
  let hotkey = `${FIRST_KEY[result['first']]}-${result['second']}`
  translationColor = result['color']

  keymage(hotkey, translateProcess)
}

// get information from background
chrome.extension.sendRequest('getInformation', keyListener)
