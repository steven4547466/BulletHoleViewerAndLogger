// Dependencies
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

// express and view engine setup
const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middleware setup
app.use(logger('common'))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
  extended: true
}))

// routers requiring user
app.use('/', require('./routes/main.js'))
app.use('/bullets', require('./routes/bullets.js'))

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message

  // render the error page
  res.status(err.status)
  res.render('error', { message: err.message, status: err.status })
})


module.exports = app
