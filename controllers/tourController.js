// const fs = require('fs');
const { listen, request } = require('../app');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
// );

// param middleware -> practical usecase where we will check id is valid or not and we can remove the redundant code from other router handlers
// exports.checkId = (req, res, next, val) => {
//   const tourId = parseInt(req.params.id);
//   if (tourId > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid tour ID',
//     });
//   }
//   next();
// };

// exports.checkBody = function (req, res, next) {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price in request body',
//     });
//   }
//   next();
// };

// middleware to get top 5 best and cheap tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingAverage';
  next();
};

// Function to get all tours
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // getting all tours
    // const tours = await Tour.find();

    // we can use filter in the find to filter the tours
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // problem here is below one is verry simple implementation for filtering, we might need sorting, pagination
    // const tours = await Tour.find(req.query);
    // we can use other method like below
    // const tours=await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

    // So We will create shallow copy of query first, then we will remove the fields which are not there in documents like page, sort, limit etc

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1B) Advance Filtering
    // Now below is the correct query because it will be able to fetch even there are query field or not // Also remeber Tour.find() will return a query that why we are able to chain other query on this
    // So now we need to separate the query and store it in the some variable and then await the whole query
    // const tours = await Tour.find(queryObj);
    //sample mongo query should like this: {difficulty:'easy',duration:{$gte:5} if we request difficluty='easy'&duration[gte]=5 , we are getting duration{gte:5} so we are msising $ sign before gte
    let queryStr = JSON.stringify(queryObj);
    //using regex expression-> search on google :) becaus its tough
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);

      query = query.sort(sortBy);

      // to sort if first creteria is same
      //sort('price ratingAverage)
    } else {
      query = query.sort('-createdAt');
    }

    //3) Showing only fields like name,price,difficulty,duration
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1; // converting to number trick
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    // page=2&limit=10
    query = query.skip(skip).limit(limit);

    //handling if user request page that dont exist
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error getting tours: ${err.message}`,
    });
  }
};

// Function to get a single tour by ID
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error getting tour by ID: ${err.message}`,
    });
  }
};

// Function to add a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid data input ${err.message}`,
    });
  }
};

// Function to update a tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error updating tour: ${err.message}`,
    });
  }
};

// Function to delete a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error deleting tour: ${err.message}`,
    });
  }
};
