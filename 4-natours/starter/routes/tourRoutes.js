const express = require('express');
const tourController = require('./../controller/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

// const checkBody = router.use(tourController.checkBody);

// route for top 5 cheapest tours, creating alias for route
router
  .route('/top-five-tours')
  .get(tourController.getTopFiveTours, tourController.getAllTours);

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
