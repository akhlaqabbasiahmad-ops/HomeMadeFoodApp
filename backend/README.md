# HomeMadeFood Backend API

A NestJS backend API with clean architecture for the HomeMadeFood React Native application.

## 🏗️ Architecture Overview

The backend follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/                 # Business Logic Layer
│   ├── entities/          # Core business entities
│   └── repositories/      # Repository interfaces (contracts)
├── application/           # Application Layer
│   ├── dto/              # Data Transfer Objects
│   └── use-cases/        # Business use cases (services)
├── infrastructure/        # Infrastructure Layer
│   ├── database/         # Database entities & configuration
│   └── repositories/     # Repository implementations
└── presentation/          # Presentation Layer
    ├── controllers/      # REST API controllers
    ├── guards/           # Authentication guards
    └── modules/          # NestJS modules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=homemadefood_db
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Setup PostgreSQL database:**
   ```sql
   CREATE DATABASE homemadefood_db;
   ```

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The API will be available at:
- **REST API:** http://localhost:3000/api/v1
- **API Documentation:** http://localhost:3000/api/docs

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Users
- `GET /api/v1/users/profile` - Get user profile (authenticated)
- `PATCH /api/v1/users/:id` - Update user profile
- `POST /api/v1/users` - Create new user

### Food Items
- `GET /api/v1/food` - Search food items with filters
- `GET /api/v1/food/categories` - Get all categories
- `GET /api/v1/food/featured` - Get featured items
- `GET /api/v1/food/popular` - Get popular items
- `GET /api/v1/food/:id` - Get food item by ID
- `POST /api/v1/food` - Create food item (restaurant owner)

### Restaurants
- `GET /api/v1/restaurants` - Get restaurants with filters
- `GET /api/v1/restaurants/:id` - Get restaurant by ID

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id/status` - Update order status

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | localhost |
| `DATABASE_PORT` | PostgreSQL port | 5432 |
| `DATABASE_USERNAME` | Database username | postgres |
| `DATABASE_PASSWORD` | Database password | - |
| `DATABASE_NAME` | Database name | homemadefood_db |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |

## 🏛️ Database Schema

### Core Entities

- **Users:** User accounts with profiles and addresses
- **Restaurants:** Restaurant information and metadata
- **Food Items:** Menu items with categories and details
- **Categories:** Food categories for organization
- **Orders:** Customer orders with items and status
- **Addresses:** User delivery addresses

### Relationships

- User → Addresses (One-to-Many)
- Restaurant → Food Items (One-to-Many)
- Order → Order Items (One-to-Many)
- Order → User (Many-to-One)
- Order → Restaurant (Many-to-One)

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Login/Register** to receive a JWT token
2. **Include token** in the Authorization header: `Bearer <token>`
3. **Protected routes** require valid JWT tokens

Example:
```javascript
const response = await fetch('/api/v1/users/profile', {
  headers: {
    'Authorization': 'Bearer <your-jwt-token>',
    'Content-Type': 'application/json'
  }
});
```

## 📚 API Documentation

Interactive API documentation is available at:
**http://localhost:3000/api/docs**

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

```bash
# Build image
docker build -t homemadefood-backend .

# Run container
docker run -p 3000:3000 --env-file .env homemadefood-backend
```

### Environment Setup

1. **Production Database:** Configure PostgreSQL for production
2. **Environment Variables:** Set all required environment variables
3. **Security:** Use strong JWT secrets and enable HTTPS
4. **Monitoring:** Set up logging and monitoring tools

## 🔧 Integration with React Native

The frontend React Native app connects to this backend via the `apiService`:

```typescript
// Frontend usage example
import { apiService } from '../services/apiService';

// Search food items
const searchFood = async () => {
  const response = await apiService.getFoodItems({
    query: 'pizza',
    category: 'Italian',
    isVegetarian: true
  });
  
  if (response.success) {
    setFoodItems(response.data.items);
  }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.