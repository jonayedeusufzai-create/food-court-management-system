# Network Error Troubleshooting Guide

## Common Network Error Causes and Solutions

### 1. Server Not Running
**Symptom**: "Network error. Please try again."
**Solution**: 
- Check if both frontend and backend servers are running
- Start backend server: `cd backend && npm start`
- Start frontend server: `cd frontend && npm start`

### 2. Port Conflicts
**Symptom**: "Something is already running on port X"
**Solution**:
- Kill existing processes: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
- Or let the system run on a different port

### 3. API URL Configuration Issues
**Symptom**: Network errors when making API calls
**Solution**:
- Check frontend .env file for correct API URL
- Ensure backend server is running on the specified port
- Verify CORS configuration in backend

### 4. Authentication Token Issues
**Symptom**: Unauthorized access or redirect loops
**Solution**:
- Clear localStorage: `localStorage.clear()` in browser console
- Log out and log back in
- Check token expiration

### 5. Database Connection Problems
**Symptom**: Server starts but API calls fail
**Solution**:
- Check MongoDB is running
- Verify database connection string in backend .env
- Check MongoDB logs for errors

## Diagnostic Commands

### Check Running Servers
```bash
# Check frontend server (port 3000)
lsof -i :3000 | grep LISTEN

# Check backend server (port 5001)
lsof -i :5001 | grep LISTEN
```

### Test Backend API Directly
```bash
# Test if backend API is accessible
curl -X GET http://localhost:5001/api/stalls
```

### Kill Port Processes
```bash
# Kill frontend server
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill backend server
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## Configuration Files to Check

### Frontend .env
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:5001
```

### Backend .env
```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/foodcourt
JWT_SECRET=foodcourtexpresssupersecretkey
FRONTEND_URL=http://localhost:3000
```

## Browser Troubleshooting

### Clear Cache and Cookies
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to reproduce the error
4. Check failed requests for details

### Console Errors
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages

## Common Fixes

### 1. Restart Both Servers
```bash
# In backend directory
npm start

# In frontend directory (new terminal)
npm start
```

### 2. Clear Application Data
1. Open browser Developer Tools
2. Go to Application tab
3. Clear Storage → Clear site data

### 3. Check API Response Format
Ensure frontend code matches backend response format:
- Check property names in response objects
- Verify data types
- Handle null/undefined values properly

### 4. Update Dependencies
```bash
# In both frontend and backend directories
npm install
```

## When to Contact Support

If you've tried all the above steps and still experience network errors:

1. Take a screenshot of the error message
2. Note the exact steps to reproduce the issue
3. Check browser console for detailed error messages
4. Verify all servers are running on correct ports
5. Contact support with this information