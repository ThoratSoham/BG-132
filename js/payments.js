document.addEventListener('DOMContentLoaded', () => {

    // Tab Switching logic
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    // Handle deep linking from dashboard quick actions
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    
    if (initialTab) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        const targetTab = document.querySelector(`.tab[data-target="${initialTab}"]`);
        const targetContent = document.getElementById(initialTab);
        if(targetTab && targetContent) {
            targetTab.classList.add('active');
            targetContent.classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // Form Submission Logic
    const forms = document.querySelectorAll('.payment-form');
    let pendingPaymentData = null;
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const amountInput = form.querySelector('input[name="amount"]');
            const amount = parseFloat(amountInput.value);
            
            // Generate basic info
            const formId = form.id;
            let category = "Transfer";
            let title = "Sent Money";
            
            if(formId === 'form-recharge') { category = "Mobile Recharge"; title = "Prepaid Recharge"; }
            else if(formId === 'form-bills') {
                const catInput = form.querySelector('select[name="category"]');
                category = "Bills";
                title = `${catInput.value} Bill`;
            } else if (formId === 'form-upi') {
                category = "UPI Transfer"; title = "UPI Payment";
            } else {
                const titleInput = form.querySelector('input[name="title"]');
                if(titleInput && titleInput.value) title = titleInput.value;
            }

            pendingPaymentData = { amount, category, title };
            
            // Show Confirmation
            document.getElementById('forms-container').style.display = 'none';
            document.querySelector('.tabs').style.display = 'none';
            
            document.getElementById('confirm-category').innerText = category;
            document.getElementById('confirm-amount').innerText = `$${amount.toFixed(2)}`;
            document.getElementById('confirm-details').innerText = title;
            document.getElementById('confirmation-screen').style.display = 'block';
        });
    });

    const btnConfirm = document.getElementById('btn-confirm-pay');
    if(btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            document.getElementById('confirmation-screen').style.display = 'none';
            if(pendingPaymentData) {
                processPayment(pendingPaymentData.amount, pendingPaymentData.category, pendingPaymentData.title);
            }
        });
    }

    window.cancelPayment = function() {
        document.getElementById('confirmation-screen').style.display = 'none';
        document.getElementById('forms-container').style.display = 'block';
        document.querySelector('.tabs').style.display = 'flex';
        pendingPaymentData = null;
    };
});

function processPayment(amount, category, title) {
    const acc = window.DB.getAccount();
    
    // UI states
    const formContainer = document.getElementById('forms-container');
    const processingScreen = document.getElementById('processing-screen');
    const statusScreen = document.getElementById('status-screen');
    const tabNav = document.querySelector('.tabs');
    
    // Switch to Processing
    formContainer.style.display = 'none';
    tabNav.style.display = 'none';
    processingScreen.style.display = 'block';
    
    // Simulate Network Delay (2 seconds)
    setTimeout(() => {
        processingScreen.style.display = 'none';
        
        // 80% Success rate simulation
        const isSuccess = Math.random() > 0.2;
        
        if(isSuccess) {
            // Check Balance
            if(acc.balance >= amount) {
               acc.balance -= amount;
               window.DB.updateAccount(acc);
               
               // Create Transaction
               const txId = 'TXT' + Math.floor(Math.random() * 1000000);
               window.DB.addTransaction({
                   id: txId,
                   type: 'debit',
                   category: category,
                   amount: amount,
                   date: new Date().toISOString(),
                   title: title,
                   status: 'success'
               });

               window.DB.addNotification({
                   id: 'N' + Math.floor(Math.random() * 1000000),
                   title: "Payment Successful",
                   message: `Sent $${amount.toFixed(2)} for ${title}`,
                   date: new Date().toISOString()
               });
               
               showStatus(true, txId, amount);
            } else {
                window.DB.addNotification({
                   id: 'N' + Math.floor(Math.random() * 1000000),
                   title: "Payment Failed",
                   message: `Failed to send $${amount.toFixed(2)}. Insufficient funds.`,
                   date: new Date().toISOString()
               });
                showStatus(false, "Insufficient Funds", amount);
            }
        } else {
            window.DB.addNotification({
               id: 'N' + Math.floor(Math.random() * 1000000),
               title: "Payment Failed",
               message: `Failed to send $${amount.toFixed(2)}. Bank Server Timeout.`,
               date: new Date().toISOString()
            });
            showStatus(false, "Bank Server Timeout", amount);
        }
        
    }, 2000);
}

function showStatus(success, extraInfo, amount) {
    const statusScreen = document.getElementById('status-screen');
    const sIcon = document.getElementById('status-icon');
    const sTitle = document.getElementById('status-title');
    const sDesc = document.getElementById('status-desc');
    
    statusScreen.classList.add('active');
    
    if(success) {
        sIcon.className = 'status-icon success';
        sIcon.innerHTML = '<i data-lucide="check" style="width:40px; height:40px;"></i>';
        sTitle.innerText = `Payment Successful`;
        sDesc.innerText = `Transaction ID: #${extraInfo}\nAmount: $${amount.toFixed(2)}`;
    } else {
        sIcon.className = 'status-icon error';
        sIcon.innerHTML = '<i data-lucide="x" style="width:40px; height:40px;"></i>';
        sTitle.innerText = `Payment Failed`;
        sDesc.innerText = `Reason: ${extraInfo}`;
    }
    
    if(window.lucide) window.lucide.createIcons();
}

window.resetPayments = function() {
    window.location.href = 'payments.html';
};
