// Events page functionality
const API_BASE_URL = 'http://localhost:5000/api';

const eventsList = document.getElementById('eventsList');
const logoutBtn = document.getElementById('logoutBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Check authentication
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = '/login.html';
}

function clearMessages() {
  errorMessage.textContent = '';
  successMessage.textContent = '';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}

function showError(message) {
  clearMessages();
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function showSuccess(message) {
  clearMessages();
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function loadEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events/`);
    const events = await response.json();

    if (events.length === 0) {
      eventsList.innerHTML = '<p class="no-events">No events scheduled yet.</p>';
      return;
    }

    eventsList.innerHTML = events
      .map(
        (event) => `
        <div class="event-card">
          <div class="event-header">
            <h3>${event.title}</h3>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <p class="event-description">${event.description}</p>
        </div>
      `
      )
      .join('');
  } catch (error) {
    showError(error.message || 'Failed to load events');
  }
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  window.location.href = '/login.html';
});

// Load events on page load
loadEvents();
