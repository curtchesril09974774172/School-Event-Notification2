// Admin dashboard functionality
const API_BASE_URL = 'http://localhost:5000/api';

// Check authentication
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = '/login.html';
}

const createEventForm = document.getElementById('createEventForm');
const logoutBtn = document.getElementById('logoutBtn');
const manageEventsList = document.getElementById('manageEventsList');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const createMessage = document.getElementById('createMessage');

// Navigation items
const navItems = document.querySelectorAll('.nav-item');
const adminSections = document.querySelectorAll('.admin-section');

function clearMessages() {
  errorMessage.textContent = '';
  successMessage.textContent = '';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
  createMessage.textContent = '';
  createMessage.className = 'message';
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

function showCreateMessage(message, type) {
  createMessage.textContent = message;
  createMessage.className = `message ${type}`;
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

// Section navigation
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');

    adminSections.forEach((section) => {
      section.classList.remove('active');
    });

    const sectionId = item.getAttribute('data-section');
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
      }

      if (sectionId === 'manage-events') {
        loadManageEvents();
      }
    }
  });
});

// Create event handler
createEventForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  try {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, date })
    });

    const data = await response.json();

    if (!response.ok) {
      showCreateMessage(data.message || 'Failed to create event', 'error');
      return;
    }

    showCreateMessage('Event created successfully!', 'success');
    createEventForm.reset();

    // Reload manage events if visible
    if (document.getElementById('manage-events').classList.contains('active')) {
      loadManageEvents();
    }
  } catch (error) {
    showCreateMessage(error.message || 'Failed to create event', 'error');
  }
});

async function loadManageEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events/`);
    const events = await response.json();

    if (events.length === 0) {
      manageEventsList.innerHTML = '<p class="no-events">No events created yet.</p>';
      return;
    }

    manageEventsList.innerHTML = events
      .map(
        (event) => `
        <div class="event-card">
          <div class="event-header">
            <h3>${event.title}</h3>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <p class="event-description">${event.description}</p>
          <div class="event-actions">
            <button class="btn btn-danger btn-delete" data-id="${event.id}">Delete</button>
          </div>
        </div>
      `
      )
      .join('');

    // Attach event listeners to buttons
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const eventId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this event?')) {
          try {
            const deleteResponse = await fetch(`${API_BASE_URL}/events/${eventId}`, {
              method: 'DELETE'
            });

            if (!deleteResponse.ok) {
              throw new Error('Failed to delete event');
            }

            showSuccess('Event deleted successfully!');
            loadManageEvents();
          } catch (error) {
            showError(error.message || 'Failed to delete event');
          }
        }
      });
    });
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
