const SUPABASE_URL = 'https://ozpfohheqvaxmzzrujuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cGZvaGhlcXZheG16enJ1anVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTU4NDIsImV4cCI6MjA5MTk3MTg0Mn0.77C7H8PLBXNuvad_AETmuwYra-9Na8msuazERSdkkMU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    
    if (!session && !isAuthPage) {
        // User is not logged in and trying to access a protected page
        window.location.href = 'index.html';
    } else if (session && isAuthPage) {
        // User is already logged in, skip login page
        window.location.href = 'dashboard.html';
    }
}

// Redirect logout globally
window.logout = async function(event) {
    if (event) {
        event.preventDefault();
    }
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error during logout:", error);
    }
    
    // Clear local storage but keep theme preference
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) {
        localStorage.setItem('theme', theme);
    }
    
    window.location.href = 'https://thoratsoham.github.io/BG-132';
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Expose client globally to avoid strict scope issues
window.supabaseClient = supabase;
