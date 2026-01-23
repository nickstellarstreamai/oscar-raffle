// ============================================
// Oscar Party Raffle - Configuration
// ============================================
//
// INSTRUCTIONS:
// 1. Get your Airtable API key from: https://airtable.com/create/tokens
//    - Create a "Personal access token"
//    - Give it read access to your base
//
// 2. Get your Base ID:
//    - Open your Airtable base
//    - Look at the URL: https://airtable.com/appXXXXXXXXXXXXXX/...
//    - The part starting with "app" is your Base ID
//
// 3. Replace the placeholder values below with your actual values
//

const CONFIG = {
    // Your Airtable Personal Access Token
    AIRTABLE_API_KEY: 'patdlCl4NZFb7jnb8.888b4a1fc3b5abf37c65cfdb11ad52d883d22b50eb50d0818567ab1df182b325',

    // Your Airtable Base ID (starts with "app")
    AIRTABLE_BASE_ID: 'appcbRAVS8Q1QWc7O',

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
