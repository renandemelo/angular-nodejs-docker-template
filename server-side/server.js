const express = require('express')
const csv = require('express-csv');
const bodyParser = require("body-parser")
const session = require('express-session')
const initRoutes = require('./src/initRoutes')
const app = express()
app.use(session({ secret: 'secret12345', cookie: { maxAge: 60000 }}))
app.use('/pages', express.static(__dirname + '/pages'))
app.use('/static/', express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

initRoutes(app)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})