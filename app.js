const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//middleware -> parsing incoming json data to http request format
app.use(express.json());
//serve static files
app.use(express.static(`${__dirname}/public`));

// now we are separatiing everything to different files, so we have to create router and middlewares

//mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handing error of url if wrog URL request is sent as we know middleware runs in sequence, if no above route is matched definately it will check below
app.all('*', (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on this server`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// central error middleware to handle opeartional erros, so we can remove the try catch block from all the controllers
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

module.exports = app;
