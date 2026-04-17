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

async function logout(e) {
    if (e && e.preventDefault) e.preventDefault();
    console.log("Logout initiated...");

    // Show visual processing state if clicked via button
    const btn = e && e.currentTarget ? e.currentTarget : null;
    if (btn && btn.tagName === 'BUTTON') btn.innerHTML = 'Logging out...';

    // 1. Wipe local state aggressively FIRST
    window.currentUser = null;
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') || key.includes('supabase') || key.includes('neobank')) {
                localStorage.removeItem(key);
            }
        });
    } catch (err) {
        console.warn("Storage wipe error:", err);
    }

    // 2. Race the network response so we never hang the UI
    if (window.supabase) {
        try {
            await Promise.race([
                window.supabaseClient.auth.signOut(),
                new Promise(res => setTimeout(res, 800)) // Max wait 800ms
            ]);
        } catch (err) {
            console.warn("Signout disconnect:", err);
        }
    }

    console.log("State destroyed. Redirection triggering.");

    // 3. Navigate strictly relative to prevent local-to-prod redirect hijacking
    window.location.replace('index.html');
}

// Map globally and on window for maximum compatibility with onclick handlers
window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Expose client globally to avoid strict scope issues
window.supabaseClient = supabase;
