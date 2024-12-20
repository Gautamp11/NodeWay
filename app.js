const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//middleware -> parsing incoming json data to http request format
app.use(express.json());

// now we are separatiing everything to different files, so we have to create router and middlewares

//mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
