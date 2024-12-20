const express = require('express');
const tourController = require('./../controllers/tourController');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
} = tourController;

const router = express.Router();

// Making aliaases for some route like 5 best and cheap tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

//mounting param middleware
// router.param('id', checkId);

//create a checkbody middleware
//check if body contains tour name price property
// send 400 if not (bad request)
// Add it to the post handler stack
//Created in controller file

// Defining routes with their respective controller functions
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);
module.exports = router;
