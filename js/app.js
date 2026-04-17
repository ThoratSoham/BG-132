// Global Utilities and Shell Logic

// 1. Toast Notification System
window.showToast = function (message, type = 'info') {
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
  switch (type) {
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

// 2. Sidebar toggle (Mobile)
function initShell() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  initShell();
  initTheme();
});

function initTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// Ensure theme applies instantly to avoid flash
(function () {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

// Format Date Utility
window.formatDate = function (dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

// State Management
window.getTransactions = function () {
  const defaultTxns = [
    { id: 't1', title: 'Amazon Purchase', date: new Date(new Date().getTime() - 86400000).toISOString(), amount: 120.50, type: 'debit', icon: 'shopping-bag' },
    { id: 't2', title: 'Tech Corp Inc.', date: new Date(new Date().getTime() - 172800000).toISOString(), amount: 4500.00, type: 'credit', icon: 'arrow-down-left' },
    { id: 't3', title: 'Starbucks', date: new Date(new Date().getTime() - 259200000).toISOString(), amount: 35.00, type: 'debit', icon: 'coffee' }
  ];
  let txns = JSON.parse(localStorage.getItem('transactions'));
  if (!txns) {
    txns = defaultTxns;
    localStorage.setItem('transactions', JSON.stringify(txns));
  }
  return txns;
};

window.addTransaction = function (txn) {
  const txns = window.getTransactions();
  txns.unshift(txn);
  localStorage.setItem('transactions', JSON.stringify(txns));
};

window.getBalance = function () {
  let bal = localStorage.getItem('balance');
  if (!bal) {
    bal = 14502.50;
    localStorage.setItem('balance', bal.toString());
  }
  return parseFloat(bal);
};

window.updateBalance = function (amount, type) {
  let bal = window.getBalance();
  if (type === 'credit') bal += parseFloat(amount);
  else if (type === 'debit') bal -= parseFloat(amount);
  localStorage.setItem('balance', bal.toString());
  return bal;
};

window.renderTransactions = function (containerId, maxItems = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const txns = window.getTransactions();
  if (txns.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align:center; padding: 1rem;">No recent transactions.</p>';
    return;
  }
  container.innerHTML = txns.slice(0, maxItems).map(t => `
      <div class="txn-item">
          <div class="txn-info">
              <div class="txn-icon ${t.type}"><i data-lucide="${t.icon || 'shopping-bag'}"></i></div>
              <div class="txn-details">
                  <h4>${t.title}</h4>
                  <p>${window.formatDate(t.date)}</p>
              </div>
          </div>
          <div class="txn-amount" style="color: var(--${t.type === 'credit' ? 'success' : 'danger'}); font-weight: 600;">
              ${t.type === 'credit' ? '+' : '-'}$${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
      </div>
  `).join('');
  if (window.lucide) {
    window.lucide.createIcons();
  }
};
