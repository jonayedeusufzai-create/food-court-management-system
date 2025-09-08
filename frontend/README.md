# Food Court Management System - Frontend

This is the frontend application for the Food Court Management System, built with React.js and Redux.

## Technology Stack

- **React.js** - Frontend library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── auth.css
│   │   ├── dashboard/
│   │   │   ├── CustomerDashboard.js
│   │   │   ├── StallOwnerDashboard.js
│   │   │   ├── FoodCourtOwnerDashboard.js
│   │   │   ├── DashboardLayout.js
│   │   │   └── dashboard.css
│   │   └── profile/
│   │       ├── Profile.js
│   │       └── profile.css
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       └── authSlice.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Authentication Flow

1. **Registration**: Users can register as Customers or Stall Owners
2. **Login**: Users can login with their credentials
3. **Email Verification**: After registration, users receive an email verification link
4. **Role-based Dashboard**: Users are redirected to their respective dashboards based on their role

## Components

### Authentication Components
- **Register**: User registration form
- **Login**: User login form

### Dashboard Components
- **CustomerDashboard**: Dashboard for customers to browse stalls and place orders
- **StallOwnerDashboard**: Dashboard for stall owners to manage their menus and orders
- **FoodCourtOwnerDashboard**: Dashboard for food court owners to manage stalls and generate reports
- **DashboardLayout**: Common layout for all dashboards with navigation

### Profile Component
- **Profile**: User profile management form

## Redux State Management

The application uses Redux Toolkit for state management with the following slices:

### Auth Slice
- Manages user authentication state
- Handles registration and login operations
- Stores user information and authentication token

## API Integration

The frontend communicates with the backend API through the `api.js` service, which includes:

- **Auth API**: Registration, login, email verification
- **User API**: Profile management

## Styling

The application uses CSS modules for component styling with a consistent design system:

- Responsive design for all device sizes
- Consistent color scheme and typography
- Reusable CSS classes for common UI elements

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

The application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

1. Run `npm run build` to create a production build
2. Deploy the `build` folder to your hosting service

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).