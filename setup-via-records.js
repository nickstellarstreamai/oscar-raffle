/**
 * Oscar Raffle - Add options by creating/deleting records
 *
 * This workaround creates temporary records with each option value,
 * which forces Airtable to add those options to the single-select fields.
 * Then it deletes the records, leaving the options in place.
 */

// Import config - you must have config.js in the same directory
let CONFIG;
try {
    CONFIG = require('./config.js');
} catch (e) {
    console.error('ERROR: config.js not found!');
    console.error('Create config.js with your Airtable credentials. See config.example.js');
    process.exit(1);
}

const API_KEY = CONFIG.AIRTABLE_API_KEY;
const BASE_ID = CONFIG.AIRTABLE_BASE_ID;
const TABLE_NAME = CONFIG.TABLES.SUBMISSIONS;

const NOMINEE_OPTIONS = {
  "Best Picture": [
    "Sinners",
    "One Battle After Another",
    "Hamnet",
    "Frankenstein",
    "Marty Supreme",
    "Wicked: For Good",
    "Sentimental Value",
    "Train Dreams",
    "Avatar: Fire and Ash",
    "The Secret Agent"
  ],
  "Best Director": [
    "Ryan Coogler (Sinners)",
    "Paul Thomas Anderson (One Battle After Another)",
    "Chloé Zhao (Hamnet)",
    "Guillermo del Toro (Frankenstein)",
    "Josh Safdie (Marty Supreme)"
  ],
  "Best Actor": [
    "Michael B. Jordan (Sinners)",
    "Leonardo DiCaprio (One Battle After Another)",
    "Timothée Chalamet (Marty Supreme)",
    "Ethan Hawke (Blue Moon)",
    "Jesse Plemons (Bugonia)"
  ],
  "Best Actress": [
    "Mikey Madison (Hamnet)",
    "Zendaya (The Drama)",
    "Cate Blanchett (The Secret Agent)",
    "Nicole Kidman (Wicked: For Good)",
    "Saoirse Ronan (The Outrun)"
  ],
  "Best Supporting Actress": [
    "Ariana Grande (Wicked: For Good)",
    "Wunmi Mosaku (Sinners)",
    "Teyana Taylor (One Battle After Another)",
    "Inga Ibsdotter Lilleaas (Sentimental Value)",
    "Amy Madigan (Weapons)"
  ],
  "Best Supporting Actor": [
    "Benicio Del Toro (One Battle After Another)",
    "Jacob Elordi (Frankenstein)",
    "Paul Mescal (Hamnet)",
    "Sean Penn (One Battle After Another)",
    "Stellan Skarsgård (Sentimental Value)"
  ],
  "Adapted Screenplay": [
    "One Battle After Another",
    "Hamnet",
    "Frankenstein",
    "Train Dreams",
    "Bugonia"
  ],
  "Original Screenplay": [
    "Sinners",
    "Marty Supreme",
    "Sentimental Value",
    "It Was Just an Accident",
    "Weapons"
  ],
  "Casting": [
    "Sinners",
    "One Battle After Another",
    "Hamnet",
    "Frankenstein",
    "Marty Supreme"
  ],
  "Animated Feature": [
    "Elio",
    "The Day the Earth Blew Up: A Looney Tunes Movie",
    "Mufasa: The Lion King",
    "Dog Man",
    "How to Train Your Dragon"
  ],
  "Documentary": [
    "Salme",
    "The Cats of Malta",
    "Super/Man: The Christopher Reeve Story",
    "Porcelain War",
    "Soundtrack to a Coup d'Etat"
  ],
  "International Feature": [
    "Sentimental Value (Norway)",
    "The Secret Agent (South Korea)",
    "Emilia Pérez (France)",
    "I'm Still Here (Brazil)",
    "Flow (Latvia)"
  ],
  "Sound": [
    "F1",
    "Frankenstein",
    "One Battle After Another",
    "Sinners",
    "Sirāt"
  ],
  "Cinematography": [
    "One Battle After Another",
    "Sinners",
    "Hamnet",
    "Frankenstein",
    "The Secret Agent"
  ],
  "Film Editing": [
    "Sinners",
    "One Battle After Another",
    "Hamnet",
    "Marty Supreme",
    "Frankenstein"
  ],
  "Original Song": [
    "Wicked: For Good",
    "F1",
    "Sinners",
    "Better Man",
    "Mufasa: The Lion King"
  ],
  "Score": [
    "Sinners",
    "One Battle After Another",
    "Hamnet",
    "Frankenstein",
    "Marty Supreme"
  ],
  "Visual Effects": [
    "Avatar: Fire and Ash",
    "F1",
    "Frankenstein",
    "Wicked: For Good",
    "Sirāt"
  ],
  "Makeup & Hair": [
    "Frankenstein",
    "Sinners",
    "Wicked: For Good",
    "The Smashing Machine",
    "One Battle After Another"
  ],
  "Production Design": [
    "Frankenstein",
    "Wicked: For Good",
    "One Battle After Another",
    "Hamnet",
    "Sinners"
  ],
  "Costume Design": [
    "Wicked: For Good",
    "Frankenstein",
    "One Battle After Another",
    "Hamnet",
    "The Secret Agent"
  ]
};

async function createRecord(fields) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });

  return response.json();
}

async function deleteRecord(recordId) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  return response.json();
}

async function main() {
  console.log('Adding options by creating temporary records...\n');

  // Get all unique options we need to create
  const categories = Object.keys(NOMINEE_OPTIONS);

  // Find max number of options in any category
  const maxOptions = Math.max(...Object.values(NOMINEE_OPTIONS).map(arr => arr.length));

  const recordsToDelete = [];

  // Create records for each option index
  for (let i = 0; i < maxOptions; i++) {
    const fields = {
      "Guest Name": `_TEMP_SETUP_${i}_DELETE_ME`
    };

    // Add each category's option at this index (if it exists)
    for (const [category, options] of Object.entries(NOMINEE_OPTIONS)) {
      if (options[i]) {
        fields[category] = options[i];
      }
    }

    console.log(`Creating record ${i + 1}/${maxOptions}...`);

    const result = await createRecord(fields);

    if (result.id) {
      recordsToDelete.push(result.id);
      console.log(`  ✅ Created record ${result.id}`);
    } else {
      console.log(`  ❌ Error:`, JSON.stringify(result));
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`\nCreated ${recordsToDelete.length} temporary records.`);
  console.log('Now deleting them (options will remain)...\n');

  // Delete all the temporary records
  for (const recordId of recordsToDelete) {
    console.log(`Deleting ${recordId}...`);
    await deleteRecord(recordId);
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log('\n✨ Done! All options should now be available in your Submissions table.');
  console.log('Check Airtable to verify the dropdowns have all the nominees.');
}

main().catch(console.error);
