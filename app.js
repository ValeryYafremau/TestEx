var res = require('./server').getEmailBySubject('LOL')
if (res.error) {
	console.log(res.error)
} else {
	console.log(res.data)
}
