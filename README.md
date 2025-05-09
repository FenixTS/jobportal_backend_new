# Job Portal Backend

A Node.js backend for a job portal application built with Express.js and MongoDB.

## Features

- Job posting and management
- Draft job saving
- Company logo upload
- RESTful API endpoints
- MongoDB integration

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs/:id` - Get a specific job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

### Drafts
- `GET /api/drafts` - Get all drafts
- `POST /api/drafts` - Create a new draft
- `GET /api/drafts/:id` - Get a specific draft
- `PUT /api/drafts/:id` - Update a draft
- `DELETE /api/drafts/:id` - Delete a draft

### File Upload
- `POST /api/upload` - Upload company logo

## Setup

1. Clone the repository:
```bash
git clone https://github.com/FenixTS/jobportal_backend_new.git
cd jobportal_backend_new
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Start the server:
```bash
npm run dev
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (for file uploads)
- CORS
- Dotenv

## License

MIT 