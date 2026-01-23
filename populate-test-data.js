// ============================================
// Populate Submissions with Realistic Test Data
// Run with: node populate-test-data.js
// ============================================

// Import config - you must have config.js in the same directory
// config.js should export: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, TABLES
let CONFIG;
try {
    CONFIG = require('./config.js');
} catch (e) {
    console.error('ERROR: config.js not found!');
    console.error('Create config.js with your Airtable credentials. See config.example.js');
    process.exit(1);
}

// Weighted picks - frontrunners have higher probability
// Using EXACT values from Airtable (including special chars)
const WEIGHTED_NOMINEES = {
    "Best Picture": {
        "One Battle After Another": 30,
        "Sinners": 25,
        "Hamnet": 15,
        "Frankenstein": 10,
        "Wicked: For Good": 8,
        "Marty Supreme": 5,
        "Sentimental Value": 3,
        "Train Dreams": 2,
        "Avatar: Fire and Ash": 1,
        "The Secret Agent": 1
    },
    "Best Director": {
        "Paul Thomas Anderson (One Battle After Another)": 35,
        "Ryan Coogler (Sinners)": 30,
        "Chloé Zhao (Hamnet)": 20,
        "Guillermo del Toro (Frankenstein)": 10,
        "Josh Safdie (Marty Supreme)": 5
    },
    "Best Actor": {
        "Leonardo DiCaprio (One Battle After Another)": 35,
        "Michael B. Jordan (Sinners)": 30,
        "Timothée Chalamet (Marty Supreme)": 20,
        "Ethan Hawke (Blue Moon)": 10,
        "Jesse Plemons (Bugonia)": 5
    },
    "Best Actress": {
        "Mikey Madison (Hamnet)": 30,
        "Cate Blanchett (The Secret Agent)": 25,
        "Zendaya (The Drama)": 20,
        "Nicole Kidman (Wicked: For Good)": 15,
        "Saoirse Ronan (The Outrun)": 10
    },
    "Best Supporting Actress": {
        "Ariana Grande (Wicked: For Good)": 35,
        "Wunmi Mosaku (Sinners)": 25,
        "Teyana Taylor (One Battle After Another)": 20,
        "Inga Ibsdotter Lilleaas (Sentimental Value)": 12,
        "Amy Madigan (Weapons)": 8
    },
    "Best Supporting Actor": {
        "Benicio Del Toro (One Battle After Another)": 30,
        "Sean Penn (One Battle After Another)": 25,
        "Paul Mescal (Hamnet)": 20,
        "Jacob Elordi (Frankenstein)": 15,
        "Stellan Skarsgård (Sentimental Value)": 10
    },
    "Adapted Screenplay": {
        "One Battle After Another": 35,
        "Hamnet": 25,
        "Frankenstein": 20,
        "Train Dreams": 12,
        "Bugonia": 8
    },
    "Original Screenplay": {
        "Sinners": 35,
        "Marty Supreme": 25,
        "Sentimental Value": 20,
        "It Was Just an Accident": 12,
        "Weapons": 8
    },
    "Casting": {
        "Sinners": 30,
        "One Battle After Another": 30,
        "Hamnet": 20,
        "Frankenstein": 12,
        "Marty Supreme": 8
    },
    "Animated Feature": {
        "Elio": 30,
        "How to Train Your Dragon": 25,
        "Mufasa: The Lion King": 20,
        "Dog Man": 15,
        "The Day the Earth Blew Up: A Looney Tunes Movie": 10
    },
    "Documentary": {
        "Super/Man: The Christopher Reeve Story": 35,
        "Porcelain War": 25,
        "Soundtrack to a Coup d'Etat": 20,
        "Salme": 12,
        "The Cats of Malta": 8
    },
    "International Feature": {
        "Sentimental Value (Norway)": 30,
        "I'm Still Here (Brazil)": 25,
        "Emilia Pérez (France)": 20,
        "Flow (Latvia)": 15,
        "The Secret Agent (South Korea)": 10
    },
    "Sound": {
        "One Battle After Another": 30,
        "Sinners": 25,
        "F1": 20,
        "Frankenstein": 15,
        "Sirāt": 10
    },
    "Cinematography": {
        "One Battle After Another": 35,
        "Sinners": 25,
        "Hamnet": 20,
        "Frankenstein": 12,
        "The Secret Agent": 8
    },
    "Film Editing": {
        "One Battle After Another": 30,
        "Sinners": 30,
        "Hamnet": 20,
        "Marty Supreme": 12,
        "Frankenstein": 8
    },
    "Original Song": {
        "Wicked: For Good": 40,
        "Sinners": 25,
        "Mufasa: The Lion King": 15,
        "F1": 12,
        "Better Man": 8
    },
    "Score": {
        "One Battle After Another": 30,
        "Sinners": 25,
        "Frankenstein": 20,
        "Hamnet": 15,
        "Marty Supreme": 10
    },
    "Visual Effects": {
        "Avatar: Fire and Ash": 35,
        "Wicked: For Good": 25,
        "Frankenstein": 20,
        "F1": 12,
        "Sirāt": 8
    },
    "Makeup & Hair": {
        "Frankenstein": 40,
        "Wicked: For Good": 25,
        "Sinners": 20,
        "One Battle After Another": 10,
        "The Smashing Machine": 5
    },
    "Production Design": {
        "Wicked: For Good": 35,
        "Frankenstein": 30,
        "One Battle After Another": 20,
        "Hamnet": 10,
        "Sinners": 5
    },
    "Costume Design": {
        "Wicked: For Good": 40,
        "Frankenstein": 25,
        "One Battle After Another": 15,
        "Hamnet": 12,
        "The Secret Agent": 8
    }
};

function getWeightedRandomPick(category) {
    const weights = WEIGHTED_NOMINEES[category];
    if (!weights) {
        console.error(`No weights for category: ${category}`);
        return null;
    }

    const nominees = Object.keys(weights);
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    let random = Math.random() * totalWeight;

    for (const nominee of nominees) {
        random -= weights[nominee];
        if (random <= 0) {
            return nominee;
        }
    }

    return nominees[0]; // Fallback
}

async function fetchTable(tableName) {
    const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Airtable error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.records;
}

async function updateRecord(tableName, recordId, fields) {
    const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Airtable error for ${recordId}: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
}

// Guest names for test data (30 realistic names)
const GUEST_NAMES = [
    "Mom", "Dad", "Nick", "Sarah", "Mike", "Emma", "James", "Olivia",
    "David", "Sophia", "Chris", "Isabella", "Matt", "Mia", "Daniel",
    "Charlotte", "Andrew", "Amelia", "Josh", "Harper", "Ryan", "Evelyn",
    "Tyler", "Abigail", "Brandon", "Emily", "Kevin", "Elizabeth", "Jason", "Grace"
];

async function createRecord(tableName, fields) {
    const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Airtable error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
}

async function deleteRecord(tableName, recordId) {
    const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Airtable error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
}

async function main() {
    const categories = Object.keys(WEIGHTED_NOMINEES);

    // First, fetch and delete all existing submissions
    console.log('Fetching existing submissions to clear...');
    const existingSubmissions = await fetchTable(CONFIG.TABLES.SUBMISSIONS);
    console.log(`Found ${existingSubmissions.length} existing submissions\n`);

    if (existingSubmissions.length > 0) {
        console.log('Deleting existing submissions...');
        for (const submission of existingSubmissions) {
            try {
                await deleteRecord(CONFIG.TABLES.SUBMISSIONS, submission.id);
                console.log(`  ✓ Deleted: ${submission.fields['Guest Name']}`);
            } catch (err) {
                console.error(`  ✗ Error deleting: ${err.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        console.log('');
    }

    // Track pick distribution for logging
    const pickCounts = {};
    categories.forEach(cat => pickCounts[cat] = {});

    // Create 30 new submissions with weighted picks
    console.log(`Creating ${GUEST_NAMES.length} new submissions...\n`);

    for (const guestName of GUEST_NAMES) {
        console.log(`Creating submission for: ${guestName}`);

        const newFields = {
            'Guest Name': guestName
        };

        // Generate weighted random pick for each category
        for (const category of categories) {
            const pick = getWeightedRandomPick(category);
            newFields[category] = pick;

            // Track for distribution logging
            pickCounts[category][pick] = (pickCounts[category][pick] || 0) + 1;
        }

        // Create the record
        try {
            await createRecord(CONFIG.TABLES.SUBMISSIONS, newFields);
            console.log(`  ✓ Created successfully`);
        } catch (err) {
            console.error(`  ✗ Error: ${err.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Created ${GUEST_NAMES.length} submissions with weighted picks!\n`);

    // Show distribution summary for key categories
    console.log('=== Pick Distribution Summary ===\n');
    const keyCats = ['Best Picture', 'Best Director', 'Best Actor', 'Best Actress'];
    for (const cat of keyCats) {
        console.log(`${cat}:`);
        const sorted = Object.entries(pickCounts[cat]).sort((a, b) => b[1] - a[1]);
        for (const [nominee, count] of sorted) {
            console.log(`  ${nominee}: ${count} picks`);
        }
        console.log('');
    }
}

main().catch(console.error);
