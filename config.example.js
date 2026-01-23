// ============================================
// Oscar Party Raffle - Configuration Example
// ============================================
//
// INSTRUCTIONS:
// 1. Copy this file to config.js
// 2. Replace the placeholder values with your actual Airtable credentials
//
// Get your Airtable API key from: https://airtable.com/create/tokens
//    - Create a "Personal access token"
//    - Give it read/write access to your base
//
// Get your Base ID:
//    - Open your Airtable base
//    - Look at the URL: https://airtable.com/appXXXXXXXXXXXXXX/...
//    - The part starting with "app" is your Base ID

const CONFIG = {
    // Your Airtable Personal Access Token
    AIRTABLE_API_KEY: 'patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',

    // Your Airtable Base ID (starts with "app")
    AIRTABLE_BASE_ID: 'appXXXXXXXXXXXXXX',

    // Table names (must match exactly what you named them in Airtable)
    TABLES: {
        SUBMISSIONS: 'Submissions',   // Guest picks
        CATEGORIES: 'Categories',     // Category list with prizes
        WINNERS: 'Winners',           // Actual Oscar winners
        NOMINEES: 'Nominees'          // Nominees per category (optional - uses fallback if not found)
    },

    // Field names in Submissions table
    FIELDS: {
        GUEST_NAME: 'Guest Name'      // The field for guest's name
    },

    // Spin animation settings
    SPIN: {
        DURATION_MS: 3000,            // How long the spin lasts
        INITIAL_SPEED_MS: 50,         // Starting speed (fast)
        FINAL_SPEED_MS: 300           // Ending speed (slow)
    }
};

// Export for Node.js scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
