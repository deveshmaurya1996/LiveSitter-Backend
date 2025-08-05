const { ObjectId } = require('mongodb');

class Job {
  constructor() {
    this.collection = 'jobs';
    this.validStatuses = ['Applied', 'Reviewed', 'Interviewed', 'Offered', 'Rejected'];
  }

  getSchema() {
    return {
      role: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 100
      },
      company: {
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 100
      },
      status: {
        type: 'string',
        required: false,
        default: null,
        enum: this.validStatuses
      },
      location: {
        type: 'string',
        required: false,
        maxLength: 100
      },
      salary: {
        type: 'string',
        required: false,
        maxLength: 50
      },
      description: {
        type: 'string',
        required: false,
        maxLength: 500
      },
      appliedDate: {
        type: 'date',
        required: false,
        default: () => new Date()
      },
      history: {
        type: 'array',
        required: false,
        default: []
      },
      createdAt: {
        type: 'date',
        required: false,
        default: () => new Date()
      },
      updatedAt: {
        type: 'date',
        required: false,
        default: () => new Date()
      }
    };
  }

  validateJobData(jobData) {
    const errors = [];
    const schema = this.getSchema();

    if (!jobData.role || typeof jobData.role !== 'string' || jobData.role.trim().length === 0) {
      errors.push('Role is required and must be a non-empty string');
    } else if (jobData.role.length > schema.role.maxLength) {
      errors.push(`Role must be less than ${schema.role.maxLength} characters`);
    }

    if (!jobData.company || typeof jobData.company !== 'string' || jobData.company.trim().length === 0) {
      errors.push('Company is required and must be a non-empty string');
    } else if (jobData.company.length > schema.company.maxLength) {
      errors.push(`Company must be less than ${schema.company.maxLength} characters`);
    }

    if (jobData.location && typeof jobData.location !== 'string') {
      errors.push('Location must be a string');
    } else if (jobData.location && jobData.location.length > schema.location.maxLength) {
      errors.push(`Location must be less than ${schema.location.maxLength} characters`);
    }

    if (jobData.salary && typeof jobData.salary !== 'string') {
      errors.push('Salary must be a string');
    } else if (jobData.salary && jobData.salary.length > schema.salary.maxLength) {
      errors.push(`Salary must be less than ${schema.salary.maxLength} characters`);
    }

    if (jobData.description && typeof jobData.description !== 'string') {
      errors.push('Description must be a string');
    } else if (jobData.description && jobData.description.length > schema.description.maxLength) {
      errors.push(`Description must be less than ${schema.description.maxLength} characters`);
    }

    if (jobData.status && !this.validStatuses.includes(jobData.status)) {
      errors.push(`Status must be one of: ${this.validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateObjectId(id) {
    return ObjectId.isValid(id);
  }

  getValidStatuses() {
    return this.validStatuses;
  }

  getCollectionName() {
    return this.collection;
  }
}

module.exports = new Job(); 