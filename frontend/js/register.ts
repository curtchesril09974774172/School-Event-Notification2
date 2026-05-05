// Register page functionality
const API_BASE_URL = 'http://localhost:5000/api';

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
  const role = (document.getElementById('role') as HTMLSelectElement).value as 'student' | 'admin';

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || 'Registration failed');
      return;
    }

    showSuccess('Registration successful! Redirecting to login...');
    
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
  } catch (error: any) {
    showError(error.message || 'Registration failed. Please try again.');
  }
});
