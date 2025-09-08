# Food Court Management System - Backend

This is the backend API for the Food Court Management System, built with Node.js, Express, and MongoDB.

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Dotenv** - Environment variable management
- **Cors** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── config/
├── utils/
├── server.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication Routes

#### `POST /api/auth/register`
Register a new user

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "Customer|StallOwner|FoodCourtOwner",
  "phone": "string (optional)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "isVerified": "boolean",
  "token": "string"
}
```

#### `POST /api/auth/login`
Login user

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "isVerified": "boolean",
  "token": "string"
}
```

#### `GET /api/auth/verify/:token`
Verify user email

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

#### `POST /api/auth/admin/register`
Register admin user (Food Court Owner) - Requires authentication and admin privileges

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "FoodCourtOwner|StallOwner"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "isVerified": "boolean"
}
```

### User Routes

#### `GET /api/users/profile`
Get user profile - Requires authentication

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "isVerified": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### `PUT /api/users/profile`
Update user profile - Requires authentication

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "isVerified": "boolean"
}
```

#### `GET /api/users`
Get all users - Requires authentication and admin privileges

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "isVerified": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### `DELETE /api/users/:id`
Delete user - Requires authentication and admin privileges

**Response:**
```json
{
  "message": "User removed"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: When a user registers, a JWT token is generated and returned
2. **Login**: When a user logs in, a JWT token is generated and returned
3. **Protected Routes**: Routes that require authentication must include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <token>
   ```

## Middleware

### Auth Middleware
- **protect**: Verifies JWT token and attaches user to request
- **admin**: Verifies user has admin privileges (StallOwner or FoodCourtOwner)

## Models

### User Model

**Fields:**
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: Customer, StallOwner, FoodCourtOwner, default: Customer)
- `phone`: String (optional)
- `address`: Object (optional)
  - `street`: String
  - `city`: String
  - `state`: String
  - `zipCode`: String
  - `country`: String
- `isVerified`: Boolean (default: false)
- `verificationToken`: String
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date
- `timestamps`: CreatedAt and UpdatedAt

**Methods:**
- `comparePassword`: Compares plain text password with hashed password

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_for_verification
EMAIL_PASS=your_email_password
```

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with the required environment variables
5. Start the server: `npm run dev` (development) or `npm start` (production)

## Development

- **Nodemon**: The development server automatically restarts when code changes are detected
- **Morgan**: HTTP request logging in development mode

## Production

- Set `NODE_ENV=production` for production environments
- Use a process manager like PM2 for production deployment

## Database

The application uses MongoDB with Mongoose ODM. The database schema is defined in the models directory.

## Error Handling

The API includes comprehensive error handling for:

- Validation errors
- Authentication errors
- Database errors
- Server errors

All errors are returned in a consistent format:
```json
{
  "message": "Error description"
}
```

## Security

- Passwords are hashed using bcrypt.js
- JWT tokens are used for authentication
- CORS is configured for security
- Environment variables are used for sensitive configuration