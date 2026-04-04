document.addEventListener('DOMContentLoaded', () => {
    const balanceElem = document.getElementById('db-balance');
    const toggleBtn = document.getElementById('toggle-balance');
    const account = window.DB.getAccount();
    let isBalanceVisible = true;

    if(balanceElem && account) {
        balanceElem.dataset.amount = account.balance;
        balanceElem.innerText = window.formatCurrency(account.balance);
    }

    if(toggleBtn && balanceElem) {
        toggleBtn.addEventListener('click', () => {
            isBalanceVisible = !isBalanceVisible;
            if(isBalanceVisible) {
                balanceElem.innerText = window.formatCurrency(parseFloat(balanceElem.dataset.amount));
                toggleBtn.innerHTML = '<i data-lucide="eye"></i>';
            } else {
                balanceElem.innerText = '••••••••';
                toggleBtn.innerHTML = '<i data-lucide="eye-off"></i>';
            }
            if(window.lucide) window.lucide.createIcons();
        });
    }

    // Inject Transactions (latest 5)
    const txnsContainer = document.getElementById('db-txns');
    const txns = window.DB.getTransactions().slice(0, 5);
    
    if(txnsContainer) {
        txnsContainer.innerHTML = '';
        txns.forEach(tx => {
            const isCredit = tx.type === 'credit';
            const html = `
                <div class="txn-item">
                    <div class="txn-info">
                        <div class="txn-icon ${tx.type}">
                            <i data-lucide="${isCredit ? 'arrow-down-left' : 'arrow-up-right'}"></i>
                        </div>
                        <div class="txn-details">
                            <h4>${tx.title}</h4>
                            <p>${window.formatDate(tx.date)}</p>
                        </div>
                    </div>
                    <div style="font-weight: 600; color: ${isCredit ? 'var(--success)' : 'var(--text-main)'}">
                        ${isCredit ? '+' : '-'}${window.formatCurrency(tx.amount)}
                    </div>
                </div>
            `;
            txnsContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    // Inject Notifications
    const notifsContainer = document.getElementById('db-notifications');
    const notifs = window.DB.getNotifications().slice(0, 3);
    
    if(notifsContainer) {
        notifsContainer.innerHTML = '';
        notifs.forEach(n => {
            const html = `
                <div style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--surface-border);">
                    <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">${n.title}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${n.message}</div>
                </div>
            `;
            notifsContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    // Render Spending Chart
    const ctx = document.getElementById('spendChart');
    if(ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Shopping', 'Food', 'Bills', 'Transfers'],
                datasets: [{
                    data: [120.50, 35.00, 89.99, 200.00],
                    backgroundColor: [
                        '#6366f1', // Primary
                        '#8b5cf6', // Secondary
                        '#10b981', // Success
                        '#f59e0b'  // Warning
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
                    }
                }
            }
        });
    }

    // Trigger icon render for newly injected HTML
    if(window.lucide) {
        window.lucide.createIcons();
    }
});
