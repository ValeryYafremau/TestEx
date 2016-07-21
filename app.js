var res = require('./server').getEmailBySubject('staging: 21-autotest-1469096130466 Redirect Alert')
if (res.error) {
	console.log(res.error)
} else {
	console.log(res.data)
}
