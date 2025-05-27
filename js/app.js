// Main JavaScript file for the Developer Club Platform

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Developer Club Platform Initialized');
  initThemeToggle();
  checkAuthentication();
  
  // Initialize toast container
  if (!document.querySelector('.toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container');
    document.body.appendChild(toastContainer);
  }
  
  // Add mobile navigation toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      document.querySelector('.navbar-links').classList.toggle('show');
    });
  }
});

// Theme toggle functionality
function initThemeToggle() {
  const themeToggleBtn = document.querySelector('.theme-toggle');
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      if (isDarkMode) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        showToast('Dark mode enabled', 'success');
      } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        showToast('Light mode enabled', 'success');
      }
    });
  }
}

// User authentication check
function checkAuthentication() {
  const currentUser = getCurrentUser();
  const publicPages = ['login.html', 'register.html', '404.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // If not on a public page and not logged in, redirect to login
  if (!publicPages.includes(currentPage) && !currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // If logged in and on a login or register page, redirect to dashboard
  if (currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
    redirectToDashboard(currentUser.role);
    return;
  }
  
  // If admin page but user is not admin
  if (currentPage === 'admin-dashboard.html' && currentUser && currentUser.role !== 'Admin') {
    redirectToDashboard(currentUser.role);
    return;
  }
  
  // Update user info in navbar if available
  updateUserInfo();
}

// Get current user from local storage
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Redirect based on user role
function redirectToDashboard(role) {
  if (role === 'Admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'user-dashboard.html';
  }
}

// Update user info in the navbar
function updateUserInfo() {
  const userInfoElement = document.querySelector('.user-info');
  const currentUser = getCurrentUser();
  
  if (userInfoElement && currentUser) {
    userInfoElement.innerHTML = `
      <span class="user-name">${currentUser.name}</span>
      <span class="user-role badge ${currentUser.role === 'Admin' ? 'badge-warning' : 'badge-primary'}">${currentUser.role}</span>
    `;
  }
}

// Toast notification system
function showToast(message, type = 'success', duration = 3000) {
  const toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
  
  // Close button functionality
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  });
}

// Logout functionality
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
  showToast('Logged out successfully', 'success');
}

// Helper function to generate random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Initialize data in local storage if not present
function initializeData() {
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: generateId(),
        name: 'Admin User',
        email: 'admin@devclub.com',
        password: 'admin123',
        domain: 'Web Development',
        role: 'Admin',
        points: 500
      },
      {
        id: generateId(),
        name: 'John Doe',
        email: 'john@devclub.com',
        password: 'john123',
        domain: 'Machine Learning',
        role: 'Member',
        points: 350
      },
      {
        id: generateId(),
        name: 'Jane Smith',
        email: 'jane@devclub.com',
        password: 'jane123',
        domain: 'App Development',
        role: 'Member',
        points: 425
      },
      {
        id: generateId(),
        name: 'Bob Johnson',
        email: 'bob@devclub.com',
        password: 'bob123',
        domain: 'Cybersecurity',
        role: 'Member',
        points: 300
      },
      {
        id: generateId(),
        name: 'Alice Brown',
        email: 'alice@devclub.com',
        password: 'alice123',
        domain: 'Web Development',
        role: 'Member',
        points: 375
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem('messages')) {
    const defaultMessages = [
      {
        id: generateId(),
        userId: '1',
        userName: 'Admin User',
        content: 'Welcome to the Developer Club chat!',
        timestamp: new Date('2025-01-05T09:00:00').toISOString()
      },
      {
        id: generateId(),
        userId: '2',
        userName: 'John Doe',
        content: 'Thanks! Excited to be here.',
        timestamp: new Date('2025-01-05T09:05:00').toISOString()
      },
      {
        id: generateId(),
        userId: '3',
        userName: 'Jane Smith',
        content: 'Looking forward to collaborating with everyone!',
        timestamp: new Date('2025-01-05T09:10:00').toISOString()
      }
    ];
    
    localStorage.setItem('messages', JSON.stringify(defaultMessages));
  }
  
  if (!localStorage.getItem('domains')) {
    const defaultDomains = [
      'Web Development',
      'Machine Learning',
      'App Development',
      'Cybersecurity',
      'Data Science',
      'Game Development',
      'DevOps',
      'Blockchain'
    ];
    
    localStorage.setItem('domains', JSON.stringify(defaultDomains));
  }
}

// Call the initialization function
initializeData();

// Add keyframe for slideOut animation
if (!document.querySelector('style#custom-keyframes')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'custom-keyframes';
  styleElement.textContent = `
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(styleElement);
}