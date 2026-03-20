// Login page functionality
import { login, saveToken, isAdmin } from './api';

const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const successMessage = document.getElementById('successMessage') as HTMLDivElement;

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

loginForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  clearMessages();

  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  try {
    const response = await login(email, password);
    showSuccess('Login successful! Redirecting...');
    saveToken(response.token, response.user);

    setTimeout(() => {
      if (isAdmin()) {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/events.html';
      }
    }, 1000);
  } catch (error: any) {
    showError(error.message || 'Login failed. Please try again.');
  }
});
