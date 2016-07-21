var Imap, getEmailBySubject, imap, _getEmail;
Imap = require('imap');
imap = new Imap({
  user: 'user',
  password: 'pas',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});
_getEmail = function(flag, condition) {
  var data, fetchEmail, sync;
  sync = true;
  data = '';
  fetchEmail = function() {
    return imap.search([flag, condition], function(err, results) {
      var f;
      if (err) {
        throw err;
      }
      if (results.length) {
        f = imap.fetch(results, {
          bodies: ['TEXT']
        });
        f.on('message', function(msg, seqno) {
          return msg.on('body', function(stream, info) {
            return stream.on('data', function(chunk) {
              return data += chunk.toString('utf8');
            });
          });
        });
        f.once('error', function(err) {
          return console.log(err);
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
    return console.log(err);
  });
  imap.connect();
  while (sync) {
    require('deasync').sleep(100);
  }
  return data;
};
getEmailBySubject = function(subject) {
  return _getEmail('ALL', ['SUBJECT', subject]);
};
console.log(getEmailBySubject('AAA1'));