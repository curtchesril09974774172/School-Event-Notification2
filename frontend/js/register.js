// Register page functionality
const API_BASE_URL = 'http://localhost:5000/api';

const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

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

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
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
  } catch (error) {
    showError(error.message || 'Registration failed. Please try again.');
  }
});
