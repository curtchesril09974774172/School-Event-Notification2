// Events page functionality
import { getEvents, logout, isAuthenticated } from './api';
import { initializeServiceWorker, requestNotificationPermission, subscribeToPushNotifications } from './notifications';

const eventsList = document.getElementById('eventsList') as HTMLDivElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const enableNotificationsBtn = document.getElementById('enableNotifications') as HTMLButtonElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

// Check authentication
if (!isAuthenticated()) {
  window.location.href = '/login.html';
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function loadEvents(): Promise<void> {
  try {
    const response = await getEvents();
    const events = response;

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
          <div class="event-location">
            <strong>Location:</strong> ${event.location}
          </div>
          <div class="event-organizer">
            <strong>Organized by:</strong> ${event.createdBy.firstName} ${event.createdBy.lastName}
          </div>
        </div>
      `
      )
      .join('');
  } catch (error: any) {
    showError(error.message || 'Failed to load events');
  }
}

logoutBtn.addEventListener('click', () => {
  logout();
});

enableNotificationsBtn.addEventListener('click', async () => {
  try {
    await initializeServiceWorker();
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
      await subscribeToPushNotifications();
      showSuccess('Push notifications enabled successfully!');
      enableNotificationsBtn.disabled = true;
      enableNotificationsBtn.textContent = 'Notifications Enabled';
    } else {
      showError('Notification permission denied. Please enable it in your browser settings.');
    }
  } catch (error: any) {
    showError(error.message || 'Failed to enable notifications');
  }
});

// Load events on page load
loadEvents();
