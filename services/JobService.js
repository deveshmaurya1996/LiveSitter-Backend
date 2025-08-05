const { ObjectId } = require('mongodb');
const database = require('../config/database');
const JobModel = require('../models/Job');

class JobService {
  constructor() {
    this.jobModel = JobModel;
    this.collection = this.jobModel.getCollectionName();
  }

  async getAllJobs(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') {
    try {
      const db = database.getDb();
      const { skip, limit: limitNum } = this.createPaginationOptions(page, limit);
      const sortOptions = this.createSortOptions(sortBy, sortOrder);

      const jobs = await db.collection(this.collection)
        .find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .toArray();

      const totalCount = await db.collection(this.collection).countDocuments();

      return {
        jobs: jobs.map(job => this.transformJobForResponse(job)),
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  async getJobById(id) {
    try {
      const db = database.getDb();
      
      if (!this.jobModel.validateObjectId(id)) {
        throw new Error('Invalid job ID format');
      }
      
      const job = await db.collection(this.collection).findOne({ _id: new ObjectId(id) });
      if (!job) {
        throw new Error('Job not found');
      }
      
      return this.transformJobForResponse(job);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  }

  async createJob(jobData) {
    try {
      const db = database.getDb();
      
      const validation = this.jobModel.validateJobData(jobData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const newJob = this.createJobDocument(jobData);
      const result = await db.collection(this.collection).insertOne(newJob);
      
      return this.transformJobForResponse({ ...newJob, _id: result.insertedId });
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJobStatus(id, status) {
    try {
      const db = database.getDb();
      
      if (!this.jobModel.validateObjectId(id)) {
        throw new Error('Invalid job ID format');
      }

      const validStatuses = this.jobModel.getValidStatuses();
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
      }

      const job = await this.getJobById(id);
      
      const updateData = {
        $set: { 
          status,
          updatedAt: new Date()
        },
        $push: { 
          history: { 
            status, 
            timestamp: new Date() 
          } 
        }
      };

      const result = await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        updateData
      );

      if (result.matchedCount === 0) {
        throw new Error('Job not found');
      }

      return await this.getJobById(id);
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  async updateJob(id, updateData) {
    try {
      const db = database.getDb();
      
      if (!this.jobModel.validateObjectId(id)) {
        throw new Error('Invalid job ID format');
      }

      const validation = this.jobModel.validateJobData(updateData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const existingJob = await this.getJobById(id);
      const updatedJob = this.updateJobDocument(existingJob, updateData);

      const result = await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedJob }
      );

      if (result.matchedCount === 0) {
        throw new Error('Job not found');
      }

      return await this.getJobById(id);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(id) {
    try {
      const db = database.getDb();
      
      if (!this.jobModel.validateObjectId(id)) {
        throw new Error('Invalid job ID format');
      }

      const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Job not found');
      }

      return { message: 'Job deleted successfully' };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  async searchJobs(query, page = 1, limit = 10) {
    try {
      const db = database.getDb();
      const filter = this.createSearchFilter(query);
      const { skip, limit: limitNum } = this.createPaginationOptions(page, limit);

      const jobs = await db.collection(this.collection)
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

      const totalCount = await db.collection(this.collection).countDocuments(filter);

      return {
        jobs: jobs.map(job => this.transformJobForResponse(job)),
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      };
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  async getStatusStatistics() {
    try {
      const db = database.getDb();
      const pipeline = [
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            status: '$_id',
            count: 1,
            _id: 0
          }
        }
      ];

      return await db.collection(this.collection).aggregate(pipeline).toArray();
    } catch (error) {
      console.error('Error getting status statistics:', error);
      throw new Error('Failed to get status statistics');
    }
  }

  async getRecentActivity(limit = 10) {
    try {
      const db = database.getDb();
      const pipeline = [
        {
          $unwind: '$history'
        },
        {
          $sort: { 'history.timestamp': -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            jobId: '$_id',
            role: 1,
            company: 1,
            status: '$history.status',
            timestamp: '$history.timestamp'
          }
        }
      ];

      return await db.collection(this.collection).aggregate(pipeline).toArray();
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw new Error('Failed to get recent activity');
    }
  }

  createJobDocument(jobData) {
    const now = new Date();
    
    return {
      role: jobData.role.trim(),
      company: jobData.company.trim(),
      status: jobData.status || null, 
      location: jobData.location ? jobData.location.trim() : null,
      salary: jobData.salary ? jobData.salary.trim() : null,
      description: jobData.description ? jobData.description.trim() : null,
      appliedDate: jobData.appliedDate || now,
      history: [], 
      createdAt: now,
      updatedAt: now
    };
  }

  updateJobDocument(existingJob, updateData) {
    const now = new Date();
    const updatedJob = { ...existingJob };

    if (updateData.role) updatedJob.role = updateData.role.trim();
    if (updateData.company) updatedJob.company = updateData.company.trim();
    if (updateData.location !== undefined) updatedJob.location = updateData.location ? updateData.location.trim() : null;
    if (updateData.salary !== undefined) updatedJob.salary = updateData.salary ? updateData.salary.trim() : null;
    if (updateData.description !== undefined) updatedJob.description = updateData.description ? updateData.description.trim() : null;

    if (updateData.status && updateData.status !== existingJob.status) {
      updatedJob.status = updateData.status;
      updatedJob.history.push({
        status: updateData.status,
        timestamp: now
      });
    }

    updatedJob.updatedAt = now;
    return updatedJob;
  }

  createSearchFilter(query) {
    const filter = {};
    const validStatuses = this.jobModel.getValidStatuses();

    if (query.role) {
      filter.role = { $regex: query.role, $options: 'i' };
    }

    if (query.company) {
      filter.company = { $regex: query.company, $options: 'i' };
    }

    if (query.status && validStatuses.includes(query.status)) {
      filter.status = query.status;
    }

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    return filter;
  }

  createSortOptions(sortBy = 'createdAt', sortOrder = 'desc') {
    const validSortFields = ['createdAt', 'updatedAt', 'appliedDate', 'role', 'company', 'status'];
    const validSortOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sortBy)) {
      sortBy = 'createdAt';
    }

    if (!validSortOrders.includes(sortOrder)) {
      sortOrder = 'desc';
    }

    return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  }

  createPaginationOptions(page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

    return {
      skip: (pageNum - 1) * limitNum,
      limit: limitNum
    };
  }

  transformJobForResponse(job) {
    return {
      _id: job._id,
      role: job.role,
      company: job.company,
      status: job.status,
      location: job.location,
      salary: job.salary,
      description: job.description,
      appliedDate: job.appliedDate,
      history: job.history || [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };
  }
}

module.exports = new JobService(); 