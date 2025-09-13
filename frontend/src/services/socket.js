import { io } from 'socket.io-client';

// Initialize socket connection
// Connect directly to the server, not to a specific namespace
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to Socket.IO server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

// Export socket instance and utility functions
export const joinUserRoom = (userId) => {
  if (userId) {
    socket.emit('join_user', userId);
  }
};

export const subscribeToOrderUpdates = (callback) => {
  socket.on('order_status_updated', callback);
  return () => {
    socket.off('order_status_updated', callback);
  };
};

export default socket;