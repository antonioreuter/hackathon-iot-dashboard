const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const dashboardRouter = require('./routes/dashboardRouter');
const devicesRouter = require('./routes/devicesRouter');
const viewsRouter = require('./routes/viewsRouter');

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'scripts')));

// Make our db accessible to our router
app.use((req,res,next) => {
    next();
});

app.use('/', dashboardRouter);
app.use('/', viewsRouter);
app.use('/devices', devicesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: err.message, stackTrace: JSON.stringify(err)});
});

module.exports = app;
