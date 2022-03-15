const express = require('express');
const tourController = require('./../controller/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

// const checkBody = router.use(tourController.checkBody);

// route for top 5 cheapest tours, creating alias for route
router
  .route('/top-five-tours')
  .get(tourController.getTopFiveTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-stats/:year').get(tourController.getMonthlyStats);

//Tours
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
