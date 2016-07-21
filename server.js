var Imap, getEmailBySubject, _getEmail;
Imap = require('imap');
_getEmail = function(flag, condition) {
  var fetchEmail, imap, maxLatency, res, start, sync;
  imap = new Imap({
    user: 'dezmandpalmusgermany@gmail.com',
    password: 'inokkoeayegveigm',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  });
  res = {
    error: null,
    data: ''
  };
  maxLatency = 15000;
  start = new Date();
  sync = true;
  fetchEmail = function() {
    return imap.search([flag, condition], function(err, results) {
      var f;
      if (err) {
        res.error = 'Not found';
        sync = false;
      }
      if (results.length) {
        f = imap.fetch(results, {
          bodies: ['TEXT']
        });
        f.on('message', function(msg, seqno) {
          return msg.on('body', function(stream, info) {
            return stream.on('data', function(chunk) {
              return res.data += chunk.toString('utf8');
            });
          });
        });
        f.once('error', function(err) {
          res.error = err;
          imap.end();
          return sync = false;
        });
        return f.once('end', function() {
          imap.end();
          return sync = false;
        });
      }
    });
  };
  imap.once('ready', function() {
    return imap.openBox('INBOX', true, function(err, box) {
      fetchEmail();
      return imap.on('mail', function() {
        return fetchEmail();
      });
    });
  });
  imap.once('error', function(err) {
    res.error = err;
    return imap.end();
  });
  imap.connect();
  while (sync) {
    if (new Date - start > maxLatency) {
      res.error = 'Not found';
      imap.end();
      sync = false;
    }
    require('deasync').sleep(100);
  }
  return res;
};
getEmailBySubject = function(subject) {
  return _getEmail('ALL', ['SUBJECT', subject]);
};
module.exports._getEmail = _getEmail;
module.exports.getEmailBySubject = getEmailBySubject;
