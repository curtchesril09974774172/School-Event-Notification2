// Login page functionality
const API_BASE_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
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

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || 'Login failed');
      return;
    }

    // Save user info to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userEmail', data.user.email);

    showSuccess('Login successful! Redirecting...');
    
    setTimeout(() => {
      window.location.href = '/events.html';
    }, 1000);
  } catch (error) {
    showError(error.message || 'Login failed. Please try again.');
  }
});
