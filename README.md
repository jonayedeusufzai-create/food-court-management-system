# Food Court Management System

A comprehensive management system for food courts that enables customers to browse stalls, order food, and track orders in real-time, while providing administrators with tools to manage stalls, orders, payments, and generate insightful reports.

## Table of Contents

- [System Overview](#system-overview)
- [Project Breakdown](#project-breakdown)
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [Workflows](#workflows)
  - [1. User Registration and Authentication](#1-user-registration-and-authentication)
  - [2. Home Page and Dashboard](#2-home-page-and-dashboard)
  - [3. Order Placement and Management](#3-order-placement-and-management)
  - [4. Cart Functionality](#4-cart-functionality)
  - [5. Payment Processing](#5-payment-processing)
  - [6. Profile Management](#6-profile-management)
  - [7. Reporting and Analytics](#7-reporting-and-analytics)
  - [8. Notifications](#8-notifications)
  - [9. Admin Dashboard](#9-admin-dashboard)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## System Overview

The Food Court Management System streamlines operations in food courts by providing a digital platform for customers to order food from multiple stalls and for administrators to manage their businesses efficiently. The system supports real-time order tracking, multi-stall ordering, payment processing, inventory management, and detailed analytics.

For a detailed breakdown of how this project is structured and will be developed, see [PROJECT_PLAN.md](PROJECT_PLAN.md).

## Project Breakdown

### Part 1: User Authentication and Management System ✅ (Completed)
- User registration with email verification
- User login with JWT authentication
- Role-based access control (Customer, Stall Owner, Food Court Owner)
- Profile management
- Admin user registration (Food Court Owner only)

### Part 2: Stall and Menu Management System
- Stall creation, editing, and deletion
- Menu item management
- Stall categorization and organization
- Stall owner assignment

### Part 3: Order Processing and Cart System
- Multi-stall shopping cart
- Order placement and tracking
- Payment processing integration
- Real-time order status updates

### Part 4: Reporting, Analytics, and Admin Dashboard
- Sales and performance reporting
- Stall ranking system
- Analytics dashboard
- Advanced admin features

## User Roles

1. **Customer** - End users who browse stalls, place orders, and track deliveries
2. **Stall Owner** - Manages individual stall menus, orders, and inventory
3. **Food Court Owner** - Oversees all stalls, manages rent/bills, and generates reports

## Core Features

- User registration and authentication with email verification
- Multi-stall browsing and menu viewing
- Real-time order placement and tracking
- Multi-stall cart functionality
- Integrated payment processing (Bikash, Nagad, Rocket, Cash on Delivery)
- Inventory and stock management
- Real-time notifications
- Performance reporting and analytics
- Stall ranking based on sales and customer feedback
- Admin dashboard with pre-built components

## Workflows

### 1. User Registration and Authentication

#### 1.1 Customer Registration
1. Customer accesses the Registration Page
2. Customer enters personal details (Name, Email, Password, Phone Number, Delivery Address)
3. System sends verification email
4. Customer clicks verification link to confirm account
5. Customer is redirected to Login Page after verification

#### 1.2 Customer Login
1. Customer enters email and password on Login Page
2. System authenticates using JWT tokens
3. Customer is redirected to Home Page/Dashboard upon successful login

#### 1.3 Admin (Stall Owner and Food Court Owner) Registration
1. Food Court Owner adds Stall Owners through Admin Dashboard
2. Food Court Owner fills in Stall Owner details and stall information
3. Stall Owners receive account verification email
4. Upon verification, Stall Owners can access Stall Dashboard

### 2. Home Page and Dashboard

#### 2.1 For Customers
- Browse available stalls
- View menu items by clicking on stalls
- Add multiple items from different stalls to cart
- Proceed to checkout with delivery address selection and payment method
- Complete payment process

#### 2.2 For Food Court Owners
- View all active stalls with rent status and performance metrics
- Manage stalls (add, edit, delete)
- Generate sales and performance reports
- Rank stalls based on orders, revenue, and ratings

#### 2.3 For Stall Owners
- Manage menu items (add, edit, remove)
- Track incoming orders in real-time
- Update order statuses (preparing, ready for pickup)
- Manage stock levels based on orders

### 3. Order Placement and Management

#### 3.1 Order Placement (For Customers)
1. Browse food items from multiple stalls and add to cart
2. Modify quantities or remove items from cart
3. Proceed to checkout with delivery address and payment method
4. System generates invoice upon payment processing
5. Order marked as "pending" and assigned to respective stall

#### 3.2 Real-Time Order Updates
1. Stall Owner receives the order
2. Stall Owner updates order status (Pending → Preparing → Ready for Pickup → Completed)
3. Customers receive real-time notifications for each status change
4. Customer receives pickup notification when order is ready

### 4. Cart Functionality

#### 4.1 Customer Cart
- Browse items from multiple stalls and add to cart
- Modify quantities or remove items
- View updated total price with taxes and discounts
- Generate separate orders for each stall during checkout with unified payment

#### 4.2 Admin Cart (Stock Management)
- Monitor stock levels in stalls
- Update stock quantities to prevent out-of-stock situations
- System notifies customers of out-of-stock items

### 5. Payment Processing

#### 5.1 Payment Integration
1. Customer chooses payment method (Bikash, Nagad, Rocket, Cash on Delivery)
2. System processes payment:
   - API call to payment gateway for online payments
   - Mark as pending for Cash on Delivery
3. System generates invoice and confirms order upon successful payment
4. Stall Owner is notified to prepare order

#### 5.2 Rent and Bill Management (For Food Court Owners)
1. Track rent payments and utility bills for each stall
2. Update payment status (paid/unpaid)
3. Send reminders to Stall Owners for outstanding payments

### 6. Profile Management

#### 6.1 Customer Profile
- Access profile page after login
- Update personal details (name, email, address, phone number)
- View order history and reorder past items
- Manage payment methods

#### 6.2 Admin Profile
- Access profile to view/edit personal details
- Food Court Owners: Manage stall data, rent payments, generate sales reports
- Stall Owners: Access sales data, manage menus, track orders

### 7. Reporting and Analytics

#### 7.1 Sales & Performance Reports (For Food Court Owners)
1. Generate reports based on:
   - Sales by Stall
   - Sales by Item
   - Revenue (daily, weekly, monthly)
2. Predict future sales trends using basic forecasting models
3. Export reports as PDFs or Excel sheets

#### 7.2 Stall Ranking (For Food Court Owners)
1. Rank stalls based on sales volume, order count, and customer feedback
2. Identify underperforming and high-performing stalls

### 8. Notifications

#### 8.1 Customer Notifications
- Order status updates (Placed, Preparing, Ready for Pickup, Completed)
- Payment confirmation messages
- Abandoned cart email reminders

#### 8.2 Stall Owner Notifications
- Real-time new order notifications
- Order status change notifications

### 9. Admin Dashboard

The system integrates with an Admin Dashboard Template using:

- **Sidebar**: Navigation to Stall Management, Reports, Orders, Payments
- **Tables**: Filtered, sorted, paginated lists of Stalls, Orders, Payments, Users
- **Charts**: Bar, pie, line charts for sales data, order trends, performance metrics
- **Forms**: Components for registration, menu updates, order status updates, profile management

## Technology Stack

- **Frontend**: React.js with Redux for state management
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) for secure user authentication
- **Real-time Communication**: Socket.IO for real-time order updates and notifications
- **Payment Integration**: APIs for Bikash, Nagad, Rocket
- **Admin Dashboard**: Pre-built admin template with responsive components
- **Architecture**: MVC (Model-View-Controller) design pattern
- **Build Tool**: Webpack/Vite for bundling
- **Package Manager**: npm/yarn

## Architecture Overview

This application follows the Model-View-Controller (MVC) architectural pattern, which separates the application into three interconnected components:

### Models
Responsible for handling data logic and database interactions:
- User models (Customer, Stall Owner, Food Court Owner)
- Stall and menu item models
- Order and payment models
- Reporting and analytics models

### Views
Handle the presentation layer and user interface:
- React components for customer-facing pages
- Admin dashboard components for stall owners
- Management interface for food court owners
- Responsive design for all device types

### Controllers
Manage the application logic and act as intermediaries between Models and Views:
- Authentication controllers for user registration and login
- Stall management controllers
- Order processing controllers
- Payment processing controllers
- Reporting controllers

## Project Structure

```
food-court-management/
├── backend/
│   ├── controllers/     # Request handlers (MVC Controllers)
│   ├── models/          # Database models (MVC Models)
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── views/           # Server-side views (if any)
│   ├── server.js        # Entry point
│   └── README.md        # Backend documentation
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components (MVC Views)
│   │   ├── pages/       # Page components (MVC Views)
│   │   ├── redux/       # State management
│   │   ├── services/    # API service files
│   │   ├── styles/      # CSS/SCSS files
│   │   └── App.js       # Main App component
│   └── package.json
├── .env                 # Environment variables
├── README.md            # Project documentation
└── package.json         # Root package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/jonayedeusufzai/mern-stack.git
   cd food-court-management
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create environment files:
   ```bash
   # Backend .env file
   cp .env.example .env
   # Update the .env file with your configuration
   ```

5. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend development server
   cd ../frontend
   npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_for_verification
EMAIL_PASS=your_email_password
PAYMENT_API_KEYS=your_payment_gateway_api_keys
```

## Usage

### For Customers
1. Register for a new account or login with existing credentials
2. Browse available stalls and their menus
3. Add items from multiple stalls to your cart
4. Proceed to checkout and select delivery options
5. Choose a payment method and complete the transaction
6. Track order status in real-time through notifications

### For Stall Owners
1. Login to the Stall Owner Dashboard
2. Manage menu items (add, edit, remove)
3. Monitor incoming orders in real-time
4. Update order statuses as they progress
5. Manage inventory and stock levels
6. View sales reports and performance metrics

### For Food Court Owners
1. Login to the Admin Dashboard
2. Manage all stalls (add, edit, delete)
3. Track rent payments and utility bills
4. Generate sales and performance reports
5. Rank stalls based on performance metrics
6. Send payment reminders to stall owners

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

Copyright (c) 2025 Food Court Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.