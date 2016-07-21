
Imap = require 'imap'

_getEmail = (flag, condition) ->

  imap = new Imap
    user: 'user'
    password: 'pas'
    host: 'imap.gmail.com'
    port: 993
    tls: true

  res = 
    error: null
    data: ''

  maxLatency = 15000
  start = new Date()
  sync = true

  fetchEmail = ->
    imap.search [
      flag
      condition
    ], (err, results) ->

      if err
        res.error = 'Not found'
        sync = false

      if results.length
        f = imap.fetch(results, bodies: [ 'TEXT' ])

        f.on 'message', (msg, seqno) ->
          msg.on 'body', (stream, info) ->
            stream.on 'data', (chunk) ->
              res.data += chunk.toString 'utf8'

        f.once 'error', (err) ->
          res.error = err
          imap.end()
          sync = false

        f.once 'end', ->
          imap.end()
          sync = false

  imap.once 'ready', ->
    imap.openBox 'INBOX', true, (err, box) ->
      fetchEmail()
      imap.on 'mail', ->
        fetchEmail()

  imap.once 'error', (err) ->
    res.error = err
    imap.end()

  imap.connect()

  while sync
    if new Date - start > maxLatency
      res.error = 'Not found'
      imap.end()
      sync = false

    require('deasync').sleep 100
  res

getEmailBySubject = (subject) ->
  _getEmail 'ALL', [
    'SUBJECT'
    subject
  ]

module.exports._getEmail = _getEmail
module.exports.getEmailBySubject = getEmailBySubject
