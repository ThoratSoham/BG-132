// Global Utilities and Shell Logic

// 1. Toast Notification System
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon based on type
  let icon = '';
  switch(type) {
    case 'success': icon = '✓'; break;
    case 'error': icon = '✕'; break;
    case 'warning': icon = '⚠'; break;
    case 'info': icon = 'ℹ'; break;
  }

  toast.innerHTML = `
    <div style="font-weight:bold; font-size: 1.2rem;">${icon}</div>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// 2. Auth Guard
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop();

  if (currentPage !== 'index.html' && currentPage !== '') {
    if (!isLoggedIn || isLoggedIn !== 'true') {
      window.location.href = 'index.html';
    }
  } else if ((currentPage === 'index.html' || currentPage === '') && isLoggedIn === 'true') {
      window.location.href = 'dashboard.html';
  }
}

// 3. Sidebar toggle (Mobile)
function initShell() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Populate Header User Data
  const avatarElem = document.getElementById('header-avatar');
  const welcomeElem = document.getElementById('header-welcome');
  if (avatarElem && window.DB) {
    const user = window.DB.getCurrentUser();
    avatarElem.innerText = user.avatarLetters;
    if(welcomeElem) {
      welcomeElem.innerText = `Hello, ${user.name.split(' ')[0]}`;
    }
  }
}

// Run auth check on load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initShell();
  initTheme();
});

function initTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// Ensure theme applies instantly to avoid flash
(function() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

// Format Currency Utility
window.formatCurrency = function(amount) {
  const acc = window.DB.getAccount();
  return `${acc.currency}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format Date Utility
window.formatDate = function(dateStr) {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
};
