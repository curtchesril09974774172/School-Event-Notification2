// Admin dashboard functionality
const API_BASE_URL = 'http://localhost:5000/api';
// Check authentication
const userRole = localStorage.getItem('userRole');
if (!localStorage.getItem('isLoggedIn') || userRole !== 'admin') {
    if (userRole === 'student') {
        window.location.href = '/events.html';
    }
    else {
        window.location.href = '/login.html';
    }
}
const createEventForm = document.getElementById('createEventForm');
const logoutBtn = document.getElementById('logoutBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const manageEventsList = document.getElementById('manageEventsList');
const viewEventsList = document.getElementById('viewEventsList');
const eventSelect = document.getElementById('eventSelect');
const attendanceList = document.getElementById('attendanceList');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const createMessage = document.getElementById('createMessage');
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalClose = document.getElementById('imageModalClose');
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
function openImageModal(src) {
    if (!imageModal || !imageModalImg)
        return;
    imageModalImg.src = src;
    imageModal.style.display = 'block';
}
function closeImageModal() {
    if (!imageModal)
        return;
    imageModal.style.display = 'none';
    if (imageModalImg)
        imageModalImg.src = '';
}
if (imageModalClose) {
    imageModalClose.addEventListener('click', closeImageModal);
}
if (imageModal) {
    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            closeImageModal();
        }
    });
}
if (attendanceList) {
    attendanceList.addEventListener('click', (event) => {
        var _a;
        if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.classList.contains('view-photo-btn'))) {
            const imageSrc = event.target.getAttribute('data-image');
            if (imageSrc) {
                openImageModal(imageSrc);
            }
        }
    });
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
// Dark mode functionality
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = '☀️ Light Mode';
    }
    else {
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
}
darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
    else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.textContent = '☀️ Light Mode';
    }
});
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
            else if (sectionId === 'view-events') {
                loadViewEvents();
            }
            else if (sectionId === 'view-attendance') {
                loadEventSelect();
            }
        }
    });
});
// Create event handler
createEventForm.addEventListener('submit', async (e) => {
    var _a;
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
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
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
        if ((_a = document.getElementById('manage-events')) === null || _a === void 0 ? void 0 : _a.classList.contains('active')) {
            loadManageEvents();
        }
    }
    catch (error) {
        showCreateMessage(error.message || 'Failed to create event', 'error');
    }
});
async function loadManageEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const events = await response.json();
        if (events.length === 0) {
            manageEventsList.innerHTML = '<p class="no-events">No events created yet.</p>';
            return;
        }
        manageEventsList.innerHTML = events
            .map((event) => `
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
      `)
            .join('');
        // Attach event listeners to buttons
        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const eventId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this event?')) {
                    try {
                        const deleteResponse = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                            }
                        });
                        if (!deleteResponse.ok) {
                            throw new Error('Failed to delete event');
                        }
                        showSuccess('Event deleted successfully!');
                        loadManageEvents();
                    }
                    catch (error) {
                        showError(error.message || 'Failed to delete event');
                    }
                }
            });
        });
    }
    catch (error) {
        showError(error.message || 'Failed to load events');
    }
}
async function loadViewEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const events = await response.json();
        if (events.length === 0) {
            viewEventsList.innerHTML = '<p class="no-events">No events scheduled yet.</p>';
            return;
        }
        viewEventsList.innerHTML = events
            .map((event) => `
        <div class="event-card">
          <div class="event-header">
            <h3>${event.title}</h3>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <p class="event-description">${event.description}</p>
        </div>
      `)
            .join('');
    }
    catch (error) {
        showError(error.message || 'Failed to load events');
    }
}
async function loadEventSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/events/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const events = await response.json();
        eventSelect.innerHTML = '<option value="">Choose an event...</option>';
        events.forEach((event) => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = event.title;
            eventSelect.appendChild(option);
        });
    }
    catch (error) {
        showError(error.message || 'Failed to load events');
    }
}
eventSelect.addEventListener('change', async (e) => {
    const eventId = e.target.value;
    if (!eventId) {
        attendanceList.innerHTML = '<p class="loading">Select an event to view attendance</p>';
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        const attendance = await response.json();
        if (attendance.length === 0) {
            attendanceList.innerHTML = '<p class="no-events">No attendance records for this event.</p>';
            return;
        }
        attendanceList.innerHTML = attendance
            .map((record) => `
        <div class="attendance-item">
          <h4>${record.student_name}</h4>
          <p><strong>Section:</strong> ${record.section}</p>
          <p><strong>Year Level:</strong> ${record.year_level}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Submitted:</strong> ${new Date(record.timestamp).toLocaleString()}</p>
          <button type="button" class="btn btn-secondary view-photo-btn" data-image="/uploads/${record.image_path}">View Photo</button>
        </div>
      `)
            .join('');
    }
    catch (error) {
        showError(error.message || 'Failed to load attendance');
    }
});
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});
// Initialize dark mode
initDarkMode();
