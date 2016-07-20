var Imap = require('imap');

var imap = new Imap({
  user: 'user',
  password: 'password',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function _getEmail (flag, condition) {

  return new Promise(function (fulfill, reject) {
    
    var buffer = '';

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    function fetchEmail () {

        imap.search([flag, condition], function (err, results) {
      
          if (err) throw err;

          if (results.length) {

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
          }

        });
    }

    imap.once('ready', function() {

      openInbox(function (err, box) {
        fetchEmail();
        imap.on('mail', function (){
          fetchEmail();
        });
      });
    });

    imap.once('error', function (err) {
      reject(err);
    });

    imap.connect();

  });
}

_getEmail('ALL', ['SUBJECT', 'AAA']).then(
  function (fulfill){
    console.log (fulfill)
  }
);
