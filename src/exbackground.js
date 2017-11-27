
const messageListener = (message, sender, sendResponse) => {
  if (message === 'getInformation') {
    chrome.storage.local.get(null, (result) => {
      sendResponse(result)
    })
  }
}

chrome.extension.onRequest.addListener(messageListener)
