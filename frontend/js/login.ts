// Login page functionality
const API_BASE_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement | null;
const successMessage = document.getElementById('successMessage') as HTMLDivElement | null;
const pageType = window.location.pathname.includes('admin-login') ? 'admin' : 'student';
const redirectTarget = pageType === 'admin' ? '/admin.html' : '/events.html';

function clearMessages(): void {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }

  if (successMessage) {
    successMessage.textContent = '';
    successMessage.style.display = 'none';
  }
}

function showError(message: string): void {
  clearMessages();
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
}

function showSuccess(message: string): void {
  clearMessages();
  if (successMessage) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
  }
}

if (loginForm) {
  if (localStorage.getItem('isLoggedIn')) {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole === 'admin') {
      window.location.href = '/admin.html';
    } else if (storedRole === 'student') {
      window.location.href = '/events.html';
    }
  }

  loginForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    clearMessages();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

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

      const userRole = data.user?.role;
      if (!userRole) {
        showError('Login succeeded but role information is missing');
        return;
      }

      if (userRole !== pageType) {
        showError(`This login page is for ${pageType} accounts only.`);
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('token', data.token || '');

      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 700);
    } catch (error: any) {
      showError(error.message || 'Login failed. Please try again.');
    }
  });
}
