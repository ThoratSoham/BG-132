// Central Mock Data Initialization for LocalStorage
const INIT_DATA = {
  users: [
    {
      email: "user@demo.com",
      password: "password123", // Mock unhashed password for simulation
      name: "John Doe",
      phone: "+1 555-0198",
      avatarLetters: "JD",
      linkedAccounts: ["SBI - ****1234", "HDFC - ****9876"]
    }
  ],
  account: {
    balance: 14502.50,
    currency: "$",
    spendLimit: 5000,
    intlUsage: false,
    cardBlocked: false,
    cardPin: "1234"
  },
  transactions: [
    { id: "T1001", type: "debit", category: "Shopping", amount: 120.50, date: "2026-04-01T10:30:00Z", title: "Amazon Purchase", status: "success" },
    { id: "T1002", type: "credit", category: "Salary", amount: 4500.00, date: "2026-03-31T09:00:00Z", title: "Tech Corp Inc.", status: "success" },
    { id: "T1003", type: "debit", category: "Food", amount: 35.00, date: "2026-03-30T19:45:00Z", title: "Starbucks", status: "success" },
    { id: "T1004", type: "debit", category: "Bills", amount: 89.99, date: "2026-03-28T14:20:00Z", title: "Netflix Subscription", status: "success" },
    { id: "T1005", type: "credit", category: "Transfer", amount: 200.00, date: "2026-03-25T11:15:00Z", title: "Alex received", status: "success" }
  ],
  notifications: [
    { id: "N1", title: "Security Alert", message: "New login from Windows device.", date: "2026-04-03T14:00:00Z", read: false },
    { id: "N2", title: "Payment Reminder", message: "Credit card bill due in 3 days.", date: "2026-04-02T10:00:00Z", read: false }
  ]
};

// Seed LocalStorage if not completely set
function seedDatabase() {
  if (!localStorage.getItem("banking_data_initialized")) {
    localStorage.setItem("users", JSON.stringify(INIT_DATA.users));
    localStorage.setItem("account", JSON.stringify(INIT_DATA.account));
    localStorage.setItem("transactions", JSON.stringify(INIT_DATA.transactions));
    localStorage.setItem("notifications", JSON.stringify(INIT_DATA.notifications));
    localStorage.setItem("banking_data_initialized", "true");
  }
}

// Global data helpers
window.DB = {
  getAccount: () => JSON.parse(localStorage.getItem("account")),
  updateAccount: (data) => localStorage.setItem("account", JSON.stringify(data)),
  
  getTransactions: () => JSON.parse(localStorage.getItem("transactions")),
  addTransaction: (tx) => {
    const txs = window.DB.getTransactions();
    txs.unshift(tx);
    localStorage.setItem("transactions", JSON.stringify(txs));
  },
  
  getNotifications: () => JSON.parse(localStorage.getItem("notifications")),
  addNotification: (notif) => {
    const notifs = window.DB.getNotifications();
    notifs.unshift(notif);
    localStorage.setItem("notifications", JSON.stringify(notifs));
  },
  
  getCurrentUser: () => {
    // Basic mock user retrieval
    const users = JSON.parse(localStorage.getItem("users"));
    return users[0];
  }
};

// Run seed immediately on inclusion
seedDatabase();
