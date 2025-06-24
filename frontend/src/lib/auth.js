// frontend/src/lib/auth.js

export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken(); // Returns true if token exists, false otherwise
};

export const signOut = () => {
  removeAuthToken(); // Clears the stored auth token
  window.location.href = "/login"; // Redirects user to login page
};
