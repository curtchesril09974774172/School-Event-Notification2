// Admin dashboard functionality
import { createEvent, getEvents, updateEvent, deleteEvent, logout, isAuthenticated, isAdmin } from './api';

// Check authentication and role
if (!isAuthenticated()) {
  window.location.href = '/login.html';
}

if (!isAdmin()) {
  window.location.href = '/events.html';
}

const createEventForm = document.getElementById('createEventForm') as HTMLFormElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const manageEventsList = document.getElementById('manageEventsList') as HTMLDivElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const createMessage = document.getElementById('createMessage') as HTMLDivElement;

// Navigation items
const navItems = document.querySelectorAll('.nav-item') as NodeListOf<HTMLButtonElement>;
const adminSections = document.querySelectorAll('.admin-section') as NodeListOf<HTMLElement>;

function clearMessages(): void {
  errorMessage.textContent = '';
  successMessage.textContent = '';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
  createMessage.textContent = '';
  createMessage.className = 'message';
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

function showCreateMessage(message: string, type: 'success' | 'error'): void {
  createMessage.textContent = message;
  createMessage.className = `message ${type}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
      const section = document.getElementById(sectionId) as HTMLElement;
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
createEventForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  clearMessages();

  const title = (document.getElementById('title') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLTextAreaElement).value;
  const date = (document.getElementById('date') as HTMLInputElement).value;
  const location = (document.getElementById('location') as HTMLInputElement).value;

  try {
    await createEvent(title, description, date, location);
    showCreateMessage('Event created successfully!', 'success');
    createEventForm.reset();

    // Reload manage events if visible
    if (document.getElementById('manage-events')?.classList.contains('active')) {
      loadManageEvents();
    }
  } catch (error: any) {
    showCreateMessage(error.message || 'Failed to create event', 'error');
  }
});

async function loadManageEvents(): Promise<void> {
  try {
    const response = await getEvents();
    const events = response;

    if (events.length === 0) {
      manageEventsList.innerHTML = '<p class="no-events">No events created yet.</p>';
      return;
    }

    manageEventsList.innerHTML = events
      .map(
        (event: any) => `
        <div class="event-card">
          <div class="event-header">
            <h3>${event.title}</h3>
            <span class="event-date">${formatDate(event.date)}</span>
          </div>
          <p class="event-description">${event.description}</p>
          <div class="event-location">
            <strong>Location:</strong> ${event.location}
          </div>
          <div class="event-actions">
            <button class="btn btn-secondary btn-edit" data-id="${event._id}">Edit</button>
            <button class="btn btn-danger btn-delete" data-id="${event._id}">Delete</button>
          </div>
        </div>
      `
      )
      .join('');

    // Attach event listeners to buttons
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', async (e: Event) => {
        const eventId = (e.target as HTMLElement).getAttribute('data-id');
        if (confirm('Are you sure you want to delete this event?')) {
          try {
            await deleteEvent(eventId!);
            showSuccess('Event deleted successfully!');
            loadManageEvents();
          } catch (error: any) {
            showError(error.message || 'Failed to delete event');
          }
        }
      });
    });

    document.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        const eventId = (e.target as HTMLElement).getAttribute('data-id');
        // TODO: Implement edit functionality in modal
        alert('Edit functionality can be implemented with a modal dialog');
      });
    });
  } catch (error: any) {
    manageEventsList.innerHTML = `<p class="error">Error loading events: ${error.message}</p>`;
  }
}

logoutBtn.addEventListener('click', () => {
  logout();
});
