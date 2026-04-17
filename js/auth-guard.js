const SUPABASE_URL = 'https://ozpfohheqvaxmzzrujuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cGZvaGhlcXZheG16enJ1anVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTU4NDIsImV4cCI6MjA5MTk3MTg0Mn0.77C7H8PLBXNuvad_AETmuwYra-9Na8msuazERSdkkMU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    
    if (!session && !isAuthPage) {
        window.location.href = 'index.html';
        return;
    } else if (session && isAuthPage) {
        window.location.href = 'dashboard.html';
        return;
    }

    if (session) {
        window.currentUser = session.user;
        displayUserProfile(session.user);
    }
}

function displayUserProfile(user) {
    // 1. Update Profile Page specifically
    const profName = document.getElementById('prof-name');
    const profEmail = document.getElementById('prof-email');
    const profAvatar = document.getElementById('prof-avatar');
    const profPhone = document.getElementById('prof-phone');
    
    // 2. Update Header (Dashboard, etc)
    const headerWelcome = document.getElementById('header-welcome');
    const headerAvatar = document.getElementById('header-avatar');

    // Extract name from email or metadata
    const userEmail = user.email || '';
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0] || 'User';
    const initials = displayName.substring(0, 2).toUpperCase();

    if (profName) profName.textContent = displayName;
    if (profEmail) profEmail.textContent = userEmail;
    if (profAvatar) profAvatar.textContent = initials;
    if (profPhone) profPhone.style.display = 'none'; // hide hardcoded phone

    if (headerWelcome) headerWelcome.textContent = `Hello, ${displayName.split(' ')[0]}`;
    if (headerAvatar) headerAvatar.textContent = initials;
}

// Expose globally so pages can manually trigger it
window.displayUserProfile = displayUserProfile;

// Redirect logout globally
window.logout = async function() {
    try {
        await supabase.auth.signOut();
    } catch(e) {
        // Ignore network errors — we still want to log out locally
        console.warn('signOut network error (ignored):', e);
    }
    // Always clear local state regardless
    window.currentUser = null;
    // Clear any Supabase session keys from localStorage
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
        }
    });
    window.location.href = 'index.html';
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Expose client globally to avoid strict scope issues
window.supabaseClient = supabase;
