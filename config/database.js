const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const dbName = process.env.DB_NAME || 'jobtracker';
      
      this.client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true;
      
      console.log('✅ MongoDB connected successfully');
      
      await this.initializeSampleData();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 MongoDB disconnected');
    }
  }

  getDb() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  async initializeSampleData() {
    try {
      const jobsCollection = this.db.collection('jobs');
      const count = await jobsCollection.countDocuments();
      
      if (count === 0) {
        const sampleJobs = [
          {
            role: "Frontend Developer",
            company: "Tech Corp",
            status: null,
            location: "San Francisco, CA",
            salary: "8LPA - 12LPA",
            description: "Building modern web applications with React",
            appliedDate: new Date(),
            history: [] 
          },
          {
            role: "Backend Developer",
            company: "Startup Inc",
            status: "Reviewed",
            location: "New York, NY",
            salary: "9LPA - 13LPA",
            description: "Developing scalable backend services",
            appliedDate: new Date(Date.now() - 86400000),
            history: [
              { status: "Applied", timestamp: new Date(Date.now() - 86400000) },
              { status: "Reviewed", timestamp: new Date() }
            ]
          },
          {
            role: "Full Stack Developer",
            company: "Enterprise Ltd",
            status: "Interviewed",
            location: "Austin, TX",
            salary: "10LPA - 15LPA",
            description: "Full-stack development with modern technologies",
            appliedDate: new Date(Date.now() - 172800000),
            history: [
              { status: "Applied", timestamp: new Date(Date.now() - 172800000) },
              { status: "Reviewed", timestamp: new Date(Date.now() - 86400000) },
              { status: "Interviewed", timestamp: new Date() }
            ]
          }
        ];
        
        await jobsCollection.insertMany(sampleJobs);
        console.log('📊 Sample data initialized');
      }
    } catch (error) {
      console.error('❌ Error initializing sample data:', error);
    }
  }
}

module.exports = new Database(); 