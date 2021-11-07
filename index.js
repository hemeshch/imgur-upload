const express = require('express')
const imgur = require('imgur')
const fs = require('fs')
const fileUpload = require('express-fileupload')

const app = express()
app.use(fileUpload())

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
	res.render('index.ejs')
})

app.post('/upload', (req, res) => {
	if (!req.files) {
		return res.status(400).send('No files were uploaded.')
	}

	let sampleFile = req.files.sampleFile
	let uploadPath = __dirname + '/uploads/' + sampleFile.name

	sampleFile.mv(uploadPath, function (err) {
		if (err) {
			return res.status(500).send(err)
		}

		imgur.uploadFile(uploadPath).then((urlObject) => {
			fs.unlinkSync(uploadPath)
			res.render('uploaded.ejs', { link: urlObject.link })
		})
	})
})

app.listen(3000, () => {
	console.log('Server started on port 3000')
})
