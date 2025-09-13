# Admin Login Credentials

## Default Admin User

The Food Court Management System comes with a default admin user that has the role of "FoodCourtOwner". This user can access the admin dashboard and manage all aspects of the food court.

### Credentials

- **Email**: admin@example.com
- **Password**: admin123
- **Role**: FoodCourtOwner

### How to Access Admin Dashboard

1. Navigate to the admin login page: `http://localhost:3000/admin/login`
2. Enter the credentials above
3. Upon successful authentication, you will be redirected to the admin dashboard at `http://localhost:3000/admin/dashboard`

### Admin Dashboard Features

Once logged in, the admin can access:

- 📊 Dashboard with statistics
- 🏬 Manage Stalls (Add, Edit, Delete)
- 🍽 Manage Menu Items (Add, Edit, Delete)
- 👤 Manage Users
- 📦 Manage Orders
- ⚙ Settings

### Security Notes

1. For production use, it is highly recommended to:
   - Change the default password immediately after first login
   - Use a strong, unique password
   - Enable two-factor authentication if available

2. The admin user has full access to all system features and should be protected accordingly.

### Creating Additional Admin Users

To create additional admin users, you can use the API endpoint:
`POST /api/auth/admin/register`

This endpoint requires:
- name (string)
- email (string, valid email format)
- password (string, minimum 6 characters)
- role (must be 'StallOwner' or 'FoodCourtOwner')

Note: This endpoint may require existing admin authentication depending on system configuration.

### Troubleshooting

If you cannot log in with these credentials:

1. Ensure the backend server is running
2. Verify MongoDB is accessible
3. Check that the user exists in the database
4. Reset the password if needed through the database directly