// Register page functionality
import { register, saveToken } from './api';

const registerForm = document.getElementById('registerForm') as HTMLFormElement;
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

registerForm.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  clearMessages();

  const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
  const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  if (password.length < 6) {
    showError('Password must be at least 6 characters long.');
    return;
  }

  try {
    const response = await register(email, password, firstName, lastName);
    showSuccess('Registration successful! Redirecting to login...');
    saveToken(response.token, response.user);

    setTimeout(() => {
      window.location.href = '/events.html';
    }, 1000);
  } catch (error: any) {
    showError(error.message || 'Registration failed. Please try again.');
  }
});
