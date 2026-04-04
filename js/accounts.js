let allTxns = [];

document.addEventListener('DOMContentLoaded', () => {
    // Inject Balance
    const balanceElem = document.getElementById('acc-balance');
    const account = window.DB.getAccount();
    if(balanceElem) {
        balanceElem.innerText = window.formatCurrency(account.balance);
    }

    allTxns = window.DB.getTransactions();
    renderTransactions(allTxns);
});

function renderTransactions(txnsToRender) {
    const txnsContainer = document.getElementById('acc-txns');
    if(!txnsContainer) return;
    
    txnsContainer.innerHTML = '';
    
    if (txnsToRender.length === 0) {
        txnsContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No transactions found.</div>';
        return;
    }

    txnsToRender.forEach(tx => {
        const isCredit = tx.type === 'credit';
        const html = `
            <div class="txn-item">
                <div class="txn-info">
                    <div class="txn-icon ${tx.type}" style="width:48px; height:48px;">
                        <i data-lucide="${isCredit ? 'arrow-down-left' : 'arrow-up-right'}"></i>
                    </div>
                    <div class="txn-details">
                        <h4>${tx.title}</h4>
                        <p>${window.formatDate(tx.date)} &bull; ${tx.category}</p>
                    </div>
                </div>
                <div style="font-weight: 600; font-size: 1.1rem; color: ${isCredit ? 'var(--success)' : 'var(--text-main)'}">
                    ${isCredit ? '+' : '-'}${window.formatCurrency(tx.amount)}
                </div>
            </div>
        `;
        txnsContainer.insertAdjacentHTML('beforeend', html);
    });

    if(window.lucide) { window.lucide.createIcons(); }
}

window.filterTxs = function(type, btnElem) {
    // Update active class
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElem.classList.add('active');

    if (type === 'all') {
        renderTransactions(allTxns);
    } else {
        const filtered = allTxns.filter(tx => tx.type === type);
        renderTransactions(filtered);
    }
};

window.downloadStatement = function() {
    window.showToast("Statement PDF generated successfully! (Mock)", "success");
};
