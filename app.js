var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
const teacherRouter = require('./routes/teacher')
const studentRouter = require('./routes/student')
const adminRouter = require('./routes/admin')
const headRouter = require('./routes/Head')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
var app = express();

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const dburl = 'mongodb+srv://gmd:gmd@cluster0.gutv6.mongodb.net/lms?retryWrites=true&w=majority';
mongoose.connect(dburl, (err) => {
  if (err) throw err;
  console.log('connected');
})
app.use('/', indexRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter)
app.use('/admin', adminRouter)
app.use('/head', headRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
module.exports = app;
