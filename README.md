# NGO Connect Backend

A Node.js/Express backend API for handling volunteer registrations with PostgreSQL database.

## Features

- ✅ Volunteer registration API
- ✅ PostgreSQL database integration
- ✅ Input validation with Joi
- ✅ Rate limiting for security
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Database migrations
- ✅ RESTful API design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd ngo-connect-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ngo_connect
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE ngo_connect;
   ```

5. **Run database migrations:**
   ```bash
   npm run migrate
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Volunteers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/volunteers` | Create new volunteer application |
| GET | `/api/volunteers` | Get all volunteers (paginated) |
| GET | `/api/volunteers/:id` | Get volunteer by ID |
| PATCH | `/api/volunteers/:id/status` | Update volunteer status |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## Request Examples

### Create Volunteer Application

```bash
curl -X POST http://localhost:3001/api/volunteers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "interest": "healthcare",
    "message": "I want to help with medical programs"
  }'
```

### Get All Volunteers

```bash
curl http://localhost:3001/api/volunteers?page=1&limit=10
```

### Update Volunteer Status

```bash
curl -X PATCH http://localhost:3001/api/volunteers/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

## Database Schema

### Volunteers Table

```sql
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  interest VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

- **Name**: Required, 2-255 characters
- **Email**: Required, valid email format, unique
- **Phone**: Required, valid phone number format
- **Interest**: Required, must be one of: healthcare, education, environment, community, admin, events
- **Message**: Optional, max 1000 characters
- **Status**: pending, approved, rejected, contacted

## Rate Limiting

- Volunteer applications: 3 per 15 minutes per IP
- General API requests: 100 per 15 minutes per IP

## Error Responses

All errors return JSON in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper database connection pooling
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure proper logging

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations