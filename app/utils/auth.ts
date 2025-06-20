// Authentication utility functions

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  role: 'admin' | 'staff';
  base64Image?: string;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    // Check if token is expired
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (tokenData.exp <= currentTime) {
      // Token expired, remove it
      logout();
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token, remove it
    logout();
    return false;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("authToken");
};

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem("userData");
  if (!userData) return null;

  try {
    return JSON.parse(userData) as UserData;
  } catch (error) {
    return null;
  }
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
};

export const redirectToLogin = (): void => {
  if (typeof window === 'undefined') return;
  
  logout();
  window.location.href = "/login";
}; 