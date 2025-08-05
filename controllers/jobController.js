const JobService = require('../services/JobService');

class JobController {
  async getAllJobs(req, res) {
    try {
      const { page, limit, sortBy, sortOrder } = req.query;
      const result = await JobService.getAllJobs(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        sortBy || 'createdAt',
        sortOrder || 'desc'
      );
      
      res.status(200).json({
        success: true,
        data: result.jobs,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Controller error - getAllJobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  }

  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Controller error - getJobById:', error);
      
      if (error.message === 'Invalid job ID format') {
        return res.status(400).json({
          success: false,
          message: 'Invalid job ID format'
        });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job',
        error: error.message
      });
    }
  }


  async createJob(req, res) {
    try {
      const jobData = req.body;
      const newJob = await JobService.createJob(jobData);
      
      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: newJob
      });
    } catch (error) {
      console.error('Controller error - createJob:', error);
      
      if (error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create job',
        error: error.message
      });
    }
  }


  async updateJobStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }
      
      const updatedJob = await JobService.updateJobStatus(id, status);
      
      res.status(200).json({
        success: true,
        message: 'Job status updated successfully',
        data: updatedJob
      });
    } catch (error) {
      console.error('Controller error - updateJobStatus:', error);
      
      if (error.message === 'Invalid job ID format') {
        return res.status(400).json({
          success: false,
          message: 'Invalid job ID format'
        });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      if (error.message.includes('Invalid status')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update job status',
        error: error.message
      });
    }
  }


  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedJob = await JobService.updateJob(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: updatedJob
      });
    } catch (error) {
      console.error('Controller error - updateJob:', error);
      
      if (error.message === 'Invalid job ID format') {
        return res.status(400).json({
          success: false,
          message: 'Invalid job ID format'
        });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      if (error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update job',
        error: error.message
      });
    }
  }


  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      const result = await JobService.deleteJob(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Controller error - deleteJob:', error);
      
      if (error.message === 'Invalid job ID format') {
        return res.status(400).json({
          success: false,
          message: 'Invalid job ID format'
        });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete job',
        error: error.message
      });
    }
  }


  async searchJobs(req, res) {
    try {
      const query = req.query;
      const { page, limit } = req.query;
      
      const result = await JobService.searchJobs(
        query,
        parseInt(page) || 1,
        parseInt(limit) || 10
      );
      
      res.status(200).json({
        success: true,
        data: result.jobs,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Controller error - searchJobs:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to search jobs',
        error: error.message
      });
    }
  }


  async getStatusStatistics(req, res) {
    try {
      const statistics = await JobService.getStatusStatistics();
      
      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Controller error - getStatusStatistics:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get status statistics',
        error: error.message
      });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const { limit } = req.query;
      const activity = await JobService.getRecentActivity(parseInt(limit) || 10);
      
      res.status(200).json({
        success: true,
        data: activity
      });
    } catch (error) {
      console.error('Controller error - getRecentActivity:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get recent activity',
        error: error.message
      });
    }
  }
}

module.exports = new JobController(); 