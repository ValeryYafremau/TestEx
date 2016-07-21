Imap = require 'imap'
imap = new Imap
  user: 'user'
  password: 'pas'
  host: 'imap.gmail.com'
  port: 993
  tls: true

_getEmail = (flag, condition) ->
  sync = true
  data = ''

  fetchEmail = ->
    imap.search [
      flag
      condition
    ], (err, results) ->

      if err
        throw err

      if results.length
        f = imap.fetch results, bodies: [ 'TEXT' ]

        f.on 'message', (msg, seqno) ->
          msg.on 'body', (stream, info) ->
            stream.on 'data', (chunk) ->
              data += chunk.toString 'utf8'

        f.once 'error', (err) ->
          console.log err

        f.once 'end', ->
          imap.end()
          sync = false


  imap.once 'ready', ->
    imap.openBox 'INBOX', true, (err, box) ->
      fetchEmail()
      imap.on 'mail', ->
        fetchEmail()

  imap.once 'error', (err) ->
    console.log err

  imap.connect()
  while sync
    require('deasync').sleep 100
  data

getEmailBySubject = (subject) ->
  _getEmail 'ALL', [
    'SUBJECT'
    subject
  ]

console.log getEmailBySubject 'AAA1'
