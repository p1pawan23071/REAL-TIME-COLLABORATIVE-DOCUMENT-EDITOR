let userCount = 0;
const colors = ['#FF6633', '#FF33FF', '#00B3E6', '#E6B333', '#3366E6'];

socket.on('user-connected', count => {
  userCount = count;
  updateUserCount();
});

socket.on('user-disconnected', count => {
  userCount = count;
  updateUserCount();
});

function updateUserCount() {
  document.querySelector('.user-count').textContent = 
    `${userCount} user${userCount !== 1 ? 's' : ''} online`;
}

// Add user cursor indicators
function addUserCursor(userId, color) {
  // Implementation for showing remote cursors
}
