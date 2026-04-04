document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate initial state
    const user = window.DB.getCurrentUser();
    const account = window.DB.getAccount();

    const holderName = document.getElementById('card-holder-name');
    if(holderName && user) {
        holderName.innerText = user.name;
    }

    const cardElem = document.getElementById('credit-card');
    const toggleBlock = document.getElementById('toggle-block');
    const toggleIntl = document.getElementById('toggle-intl');
    const limitInput = document.getElementById('limit-input');
    const btnSaveLimit = document.getElementById('btn-save-limit');

    if(account) {
        toggleBlock.checked = account.cardBlocked;
        toggleIntl.checked = account.intlUsage;
        if(limitInput) limitInput.value = account.spendLimit;

        if(account.cardBlocked) {
            cardElem.classList.add('blocked');
        }
    }

    // 2. Set up event listeners to update state

    toggleBlock.addEventListener('change', (e) => {
        const isBlocked = e.target.checked;
        if(isBlocked) {
            cardElem.classList.add('blocked');
            window.showToast("Card temporarily frozen.", "warning");
        } else {
            cardElem.classList.remove('blocked');
            window.showToast("Card un-frozen and ready to use.", "success");
        }
        
        const acc = window.DB.getAccount();
        acc.cardBlocked = isBlocked;
        window.DB.updateAccount(acc);
    });

    toggleIntl.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        window.showToast(`International usage is now ${isEnabled ? 'enabled' : 'disabled'}.`, isEnabled ? "info" : "warning");
        
        const acc = window.DB.getAccount();
        acc.intlUsage = isEnabled;
        window.DB.updateAccount(acc);
    });

    if(btnSaveLimit && limitInput) {
        btnSaveLimit.addEventListener('click', () => {
            const acc = window.DB.getAccount();
            const newLimit = parseInt(limitInput.value, 10);
            if(isNaN(newLimit) || newLimit <= 0) {
                window.showToast("Please enter a valid amount.", "error");
                return;
            }
            acc.spendLimit = newLimit;
            window.DB.updateAccount(acc);
            window.showToast(`Spending limit successfully updated to $${acc.spendLimit}`, "success");
        });
    }
});
