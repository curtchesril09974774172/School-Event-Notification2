// Login page functionality
const API_BASE_URL = 'http://localhost:5000/api';
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const pageType = window.location.pathname.includes('admin-login') ? 'admin' : 'student';
const redirectTarget = pageType === 'admin' ? '/admin.html' : '/events.html';
function clearMessages() {
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    if (successMessage) {
        successMessage.textContent = '';
        successMessage.style.display = 'none';
    }
}
function showError(message) {
    clearMessages();
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}
function showSuccess(message) {
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
        }
        else if (storedRole === 'student') {
            window.location.href = '/events.html';
        }
    }
    loginForm.addEventListener('submit', async (e) => {
        var _a;
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
            const userRole = (_a = data.user) === null || _a === void 0 ? void 0 : _a.role;
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
        }
        catch (error) {
            showError(error.message || 'Login failed. Please try again.');
        }
    });
}
