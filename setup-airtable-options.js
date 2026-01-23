/**
 * Oscar Raffle - Airtable Single Select Options Setup
 *
 * This script adds all the nominee options to your Submissions table.
 * Run with: node setup-airtable-options.js
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

// All nominee options by category
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

async function getTableSchema() {
  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get schema: ${response.statusText}`);
  }

  return response.json();
}

async function updateField(tableId, fieldId, fieldName, options) {
  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${tableId}/fields/${fieldId}`;

  // Airtable requires just the options object for singleSelect updates
  const body = {
    options: {
      choices: options.map(name => ({ name }))
    }
  };

  console.log(`  Request to: ${url}`);
  console.log(`  Body: ${JSON.stringify(body, null, 2)}`);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to update ${fieldName}: ${JSON.stringify(result)}`);
  }

  return result;
}

async function main() {
  console.log('Fetching Airtable schema...\n');

  const schema = await getTableSchema();
  const submissionsTable = schema.tables.find(t => t.name === TABLE_NAME);

  if (!submissionsTable) {
    console.error(`Table "${TABLE_NAME}" not found!`);
    console.log('Available tables:', schema.tables.map(t => t.name).join(', '));
    return;
  }

  console.log(`Found table: ${submissionsTable.name} (${submissionsTable.id})\n`);
  console.log('Fields found:');
  submissionsTable.fields.forEach(f => {
    console.log(`  - ${f.name} (${f.type})`);
  });
  console.log('\n');

  // Update each category field
  for (const [categoryName, options] of Object.entries(NOMINEE_OPTIONS)) {
    const field = submissionsTable.fields.find(f => f.name === categoryName);

    if (!field) {
      console.log(`⚠️  Field "${categoryName}" not found, skipping...`);
      continue;
    }

    console.log(`Updating "${categoryName}" with ${options.length} options...`);

    try {
      await updateField(submissionsTable.id, field.id, categoryName, options);
      console.log(`✅ ${categoryName} updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating ${categoryName}:`, error.message);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n✨ Done! Check your Airtable Submissions table.');
}

main().catch(console.error);
