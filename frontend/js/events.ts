// Events page functionality
const API_BASE_URL = 'http://localhost:5000/api';

const eventsList = document.getElementById('eventsList') as HTMLDivElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const darkModeToggle = document.getElementById('darkModeToggle') as HTMLButtonElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

// Modal elements
const attendanceModal = document.getElementById('attendanceModal') as HTMLDivElement;
const attendanceForm = document.getElementById('attendanceForm') as HTMLFormElement;
const closeModal = document.querySelector('.close') as HTMLSpanElement;

const userRole = localStorage.getItem('userRole');
if (!localStorage.getItem('isLoggedIn') || userRole !== 'student') {
  if (userRole === 'admin') {
    window.location.href = '/admin.html';
  } else {
    window.location.href = '/login.html';
  }
}

function clearMessages(): void {
  errorMessage.textContent = '';
  successMessage.textContent = '';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}

function showError(message: string): void {
  clearMessages();
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function showSuccess(message: string): void {
  clearMessages();
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Dark mode functionality
function initDarkMode(): void {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
}

darkModeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    darkModeToggle.textContent = '🌙 Dark Mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
});

async function loadEvents(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/`);
    const events = await response.json();

    if (events.length === 0) {
      eventsList.innerHTML = '<p class="no-events">No events scheduled yet.</p>';
      return;
    }

    eventsList.innerHTML = events
      .map(
        (event: any) => `
        <div class="event-card">
          <div class="event-header">
            <h3>${event.title}</h3>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <p class="event-description">${event.description}</p>
          <button class="btn btn-primary attend-btn" data-event-id="${event.id}">Mark Attendance</button>
        </div>
      `
      )
      .join('');

    // Attach event listeners to attendance buttons
    document.querySelectorAll('.attend-btn').forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        const eventId = (e.target as HTMLElement).getAttribute('data-event-id');
        openAttendanceModal(eventId);
      });
    });
  } catch (error: any) {
    showError(error.message || 'Failed to load events');
  }
}

function openAttendanceModal(eventId: string): void {
  (document.getElementById('attendanceEventId') as HTMLInputElement).value = eventId;
  attendanceModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
  attendanceModal.style.display = 'none';
});

window.addEventListener('click', (e: Event) => {
  if (e.target === attendanceModal) {
    attendanceModal.style.display = 'none';
  }
});

attendanceForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  clearMessages();

  const formData = new FormData(attendanceForm);
  const token = localStorage.getItem('token');
  formData.append('token', token);

  // Show loading state
  const submitBtn = attendanceForm.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    console.log('Submitting attendance...');
    const response = await fetch(`${API_BASE_URL}/attendance/`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Response:', response.status, data);

    if (!response.ok) {
      showError(data.message || 'Failed to submit attendance');
      return;
    }

    showSuccess('Attendance recorded successfully!');
    attendanceModal.style.display = 'none';
    attendanceForm.reset();
  } catch (error: any) {
    console.error('Attendance submission error:', error);
    showError(error.message || 'Failed to submit attendance');
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
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

// Initialize dark mode and load events
initDarkMode();
loadEvents();
