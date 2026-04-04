document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const subtitle = document.getElementById('form-subtitle');
    const signupPrompt = document.getElementById('signup-prompt');
    const cancelOtpBtn = document.getElementById('btn-cancel-otp');
    
    // OTP Inputs logic
    const otpInputs = [
        document.getElementById('otp-1'),
        document.getElementById('otp-2'),
        document.getElementById('otp-3'),
        document.getElementById('otp-4')
    ];

    let generatedOtp = '';

    // Handle OTP Input Focus
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length > 0 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Step 1: Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Generate simulated OTP
                generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
                
                // Switch UI
                loginForm.style.display = 'none';
                signupPrompt.style.display = 'none';
                otpForm.style.display = 'flex';
                subtitle.innerText = "Two-Factor Authentication";
                
                // Give user a toast notification
                window.showToast(`Your OTP is: ${generatedOtp}`, 'info');
                
                setTimeout(() => otpInputs[0].focus(), 100);
            } else {
                window.showToast("Invalid email or password", "error");
            }
        });
    }

    // Step 2: Verify OTP
    if (otpForm) {
        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredOtp = otpInputs.map(i => i.value).join('');
            
            if (enteredOtp === generatedOtp) {
                window.showToast("Login successful!", "success");
                localStorage.setItem('isLoggedIn', 'true');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            } else {
                window.showToast("Incorrect OTP. Try again.", "error");
                otpInputs.forEach(i => i.value = '');
                otpInputs[0].focus();
            }
        });
    }

    // Cancel OTP
    if (cancelOtpBtn) {
        cancelOtpBtn.addEventListener('click', () => {
            otpForm.style.display = 'none';
            loginForm.style.display = 'block';
            signupPrompt.style.display = 'block';
            subtitle.innerText = "Secure access to your finances";
            otpInputs.forEach(i => i.value = '');
            generatedOtp = '';
        });
    }

    // Mock Signup toggle
    if (signupPrompt) {
        signupPrompt.addEventListener('click', () => {
            window.showToast("Signup is disabled in this mockup. Please use user@demo.com to login.", "warning");
        });
    }
});
