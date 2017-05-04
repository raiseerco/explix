//var request = require('browser-request')
var request = require('request')

function MCStoreConnector (url) {
  this.url = url
}

function responseHandler (resolve, reject, fn) {
  return function (err, response, body) {
    if (err) reject(err)
    else if (response.statusCode !== 200) {
      reject(new Error("got bad response from mcstore"))
    } else {
      resolve(fn(body))
    }
  }
}

MCStoreConnector.prototype.getMessages = function (chainID) {
  var self = this
  return new Promise(function (resolve, reject) {
    request({
      method: 'GET',
      url: self.url + '/getMessages?chainID=' + chainID,
      json: true
    }, responseHandler(
      resolve, reject, function (body) {
        return body.messages
      }))
  })
}

MCStoreConnector.prototype.createChain = function (initmsg) {
  var self = this
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      url: self.url + '/createChain',
      body: { message: initmsg },
      json: true
    }, responseHandler(resolve, reject, function (body) {
      return body.chainID
    }))           
  })
}

MCStoreConnector.prototype.postMessage = function (chainID, message) {
  var self = this
  return new Promise(function (resolve, reject) {
    request({
      method: 'POST',
      url: self.url + '/postMessage',
      body: { chainID: chainID, message: message },
      json: true
    }, responseHandler(resolve, reject, function (body) {
      return body.serial
    }))
  })
}

module.exports = MCStoreConnector
