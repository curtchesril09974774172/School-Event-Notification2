// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility functions for API calls
export async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
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
  } catch (error) {
    throw error;
  }
}

// Authentication Functions
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<any> {
  return apiCall('/auth/register', 'POST', {
    email,
    password,
    firstName,
    lastName,
  });
}

export async function login(email: string, password: string): Promise<any> {
  return apiCall('/auth/login', 'POST', {
    email,
    password,
  });
}

export async function getProfile(): Promise<any> {
  return apiCall('/auth/profile', 'GET');
}

// Event Functions
export async function getEvents(): Promise<any> {
  return apiCall('/events', 'GET');
}

export async function getEvent(id: string): Promise<any> {
  return apiCall(`/events/${id}`, 'GET');
}

export async function createEvent(
  title: string,
  description: string,
  date: string,
  location: string
): Promise<any> {
  return apiCall('/events', 'POST', {
    title,
    description,
    date,
    location,
  });
}

export async function updateEvent(
  id: string,
  title: string,
  description: string,
  date: string,
  location: string
): Promise<any> {
  return apiCall(`/events/${id}`, 'PUT', {
    title,
    description,
    date,
    location,
  });
}

export async function deleteEvent(id: string): Promise<any> {
  return apiCall(`/events/${id}`, 'DELETE');
}

// Push Notification Functions
export async function subscribeToPush(subscription: PushSubscription): Promise<any> {
  return apiCall('/push/subscribe', 'POST', { subscription });
}

export async function unsubscribeFromPush(endpoint: string): Promise<any> {
  return apiCall('/push/unsubscribe', 'POST', { endpoint });
}

// Token Management
export function saveToken(token: string, user: any): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUser(): any {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}

// Check if user is admin
export function isAdmin(): boolean {
  const user = getUser();
  return user && user.role === 'admin';
}
