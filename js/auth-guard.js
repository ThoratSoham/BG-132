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

// Define logout globally so it can be called from onclick="logout()"
async function logout() {
    console.log("Logout initiated...");
    try {
        // 1. Attempt Supabase sign out (may fail if offline/invalid session)
        if (window.supabase) {
            await window.supabaseClient.auth.signOut();
        }
    } catch (e) {
        console.warn('Supabase signOut error (ignoring):', e);
    }

    // 2. FORCE clear local state regardless of Supabase response
    window.currentUser = null;
    
    // Clear all Supabase-related keys from localStorage
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
                localStorage.removeItem(key);
            }
        });
    } catch (e) {
        console.error("Local storage clear error:", e);
    }

    // 3. Clear our app-specific keys just in case
    localStorage.removeItem('neobank_logged_in'); 

    console.log("Local state cleared. Redirecting...");
    
    // 4. Redirect to login page
    window.location.href = 'index.html';
}

// Map both for compatibility
window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Expose client globally to avoid strict scope issues
window.supabaseClient = supabase;
