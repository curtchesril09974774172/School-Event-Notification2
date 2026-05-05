// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
// Utility functions for API calls
export async function apiCall(endpoint, method = 'GET', data) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const options = {
        method,
        headers,
    };
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || `Error: ${response.status}`);
        }
        return responseData;
    }
    catch (error) {
        throw error;
    }
}
// Authentication Functions
export async function register(email, password, firstName, lastName) {
    return apiCall('/auth/register', 'POST', {
        email,
        password,
        firstName,
        lastName,
    });
}
export async function login(email, password) {
    return apiCall('/auth/login', 'POST', {
        email,
        password,
    });
}
export async function getProfile() {
    return apiCall('/auth/profile', 'GET');
}
// Event Functions
export async function getEvents() {
    return apiCall('/events', 'GET');
}
export async function getEvent(id) {
    return apiCall(`/events/${id}`, 'GET');
}
export async function createEvent(title, description, date, location) {
    return apiCall('/events', 'POST', {
        title,
        description,
        date,
        location,
    });
}
export async function updateEvent(id, title, description, date, location) {
    return apiCall(`/events/${id}`, 'PUT', {
        title,
        description,
        date,
        location,
    });
}
export async function deleteEvent(id) {
    return apiCall(`/events/${id}`, 'DELETE');
}
// Push Notification Functions
export async function subscribeToPush(subscription) {
    return apiCall('/push/subscribe', 'POST', { subscription });
}
export async function unsubscribeFromPush(endpoint) {
    return apiCall('/push/unsubscribe', 'POST', { endpoint });
}
// Token Management
export function saveToken(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}
export function getToken() {
    return localStorage.getItem('token');
}
export function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
// Check if user is authenticated
export function isAuthenticated() {
    return !!getToken();
}
// Check if user is admin
export function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}
