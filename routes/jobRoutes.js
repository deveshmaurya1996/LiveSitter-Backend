const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

router.use(requestLogger);

router.get('/', jobController.getAllJobs);

router.get('/search', jobController.searchJobs);

router.get('/statistics', jobController.getStatusStatistics);

router.get('/activity', jobController.getRecentActivity);

router.get('/:id', jobController.getJobById);

router.post('/', jobController.createJob);

router.put('/:id/status', jobController.updateJobStatus);

router.put('/:id', jobController.updateJob);

router.delete('/:id', jobController.deleteJob);

module.exports = router; 