var Imap = require('imap');

var imap = new Imap({
  user: 'user',
  password: 'pas',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function getEmailBySubject (subject) {

  return new Promise(function (fulfill, reject){

    var buffer = '';

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {

      openInbox(function (err, box) {

        if (err) throw err;

        imap.search([ 'ALL', ['SUBJECT', subject] ], function (err, results) {

          if (err) throw err;    
          var f = imap.fetch(results, { bodies: ['TEXT'] });

          f.on('message', function (msg, seqno) {

            msg.on('body', function (stream, info) {

              stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
              });

            });

          });

          f.once('error', function (err) {
            reject(err);
          });

          f.once('end', function () {
            imap.end();
            fulfill(buffer);
          });

        });

      });
    });

    imap.once('error', function (err) {
      reject(err);
    });

    imap.connect();

  });
}

getEmailBySubject('A').then(
  function (fulfill){
    console.log (fulfill)
  }
);
