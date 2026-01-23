# Oscar Party Raffle - Complete Documentation

## Overview

This is an Oscar party raffle system built for an annual viewing party. Guests submit their Oscar predictions via an Airtable form before the ceremony, and during the show, those who guessed correctly for each category are entered into a raffle to win a prize.

**Party Context**: ~30-40 guests, ~21 Oscar categories, hosted annually.

---

## How It Works (User Flow)

### Before the Party
1. Host creates/updates the Airtable form with nominees for each category
2. Guests fill out the form with their predictions
3. Host opens the raffle app on a TV/projector

### During the Party
1. App displays the current Oscar category
2. Host announces the actual Oscar winner and clicks the corresponding nominee button
3. App shows who guessed correctly (eligible for raffle)
4. Host clicks "SPIN TO WIN" - names cycle with visual animation
5. Winner is announced with confetti
6. Winner's name flies to the sidebar (excluded from future raffles)
7. Host clicks "Next" to move to the next category
8. Repeat for all 21 categories

---

## Project Structure

```
oscar-raffle/
├── index.html           # Main HTML structure
├── style.css            # All styling (gold/black Oscar theme)
├── raffle.js            # Core application logic (OscarRaffle class)
├── config.js            # Airtable credentials (DO NOT commit to git)
├── CLAUDE.md            # Claude Code instructions for AI assistance
├── DOCUMENTATION.md     # This file
├── README.md            # Basic readme
└── airtable-import/     # CSV templates for Airtable setup
    ├── Categories.csv
    ├── Submissions.csv
    ├── Winners.csv
    └── NOMINEE_OPTIONS.md
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla HTML/CSS/JavaScript (no frameworks) |
| Data | Airtable REST API |
| Persistence | localStorage |
| Hosting | GitHub Pages |
| Fonts | Google Fonts (Playfair Display, Inter) |

---

## Airtable Structure

### Tables Required

1. **Submissions** - Guest predictions from form
   - `Guest Name` (text) - Who submitted
   - One column per category (single select) - Their pick for each

2. **Categories** - Master list of categories
   - `Category Name` (text)
   - `Prize` (text) - What they win

3. **Winners** (optional) - For tracking Oscar winners

### Important Notes
- Column names in Submissions MUST match category names exactly
- Single select options MUST match the `NOMINEE_OPTIONS` in raffle.js exactly
- Airtable Personal Access Token needs read access to the base

---

## Key Business Rules

### Raffle Eligibility

| Scenario | Who's Eligible |
|----------|----------------|
| Correct guessers exist | Only those who guessed correctly |
| Nobody guessed correctly | EVERYONE (except excluded winners) |
| Best Picture category | ANYONE (even previous winners) |

### Winner Exclusion
- When someone wins a raffle, they're auto-added to the "Winners" sidebar
- By default, winners are **excluded** from future raffles (checkbox checked)
- Host can **uncheck** a winner in the sidebar to let them back in
- Best Picture winners are NOT auto-excluded (it's the final category)

### State Persistence
The app saves to localStorage:
- `oscar-raffle-winners-data` - Array of winner objects
- `oscar-raffle-category-index` - Current category position

This means:
- Closing/refreshing the browser preserves state
- Can continue the raffle after a break
- Must click "Reset All" to start fresh next year

---

## Configuration (config.js)

```javascript
const CONFIG = {
    AIRTABLE_API_KEY: 'your_personal_access_token',
    AIRTABLE_BASE_ID: 'appXXXXXXXXXXXXXX',

    TABLES: {
        SUBMISSIONS: 'Submissions',
        CATEGORIES: 'Categories',
        WINNERS: 'Winners'
    },

    FIELDS: {
        GUEST_NAME: 'Guest Name'
    },

    SPIN: {
        DURATION_MS: 3000,        // Spin animation length
        INITIAL_SPEED_MS: 50,     // Starting speed (fast)
        FINAL_SPEED_MS: 300       // Ending speed (slow)
    }
};
```

---

## Data Structures (raffle.js)

### NOMINEE_OPTIONS
Object mapping category names to arrays of nominee names:
```javascript
const NOMINEE_OPTIONS = {
    "Best Picture": ["Movie 1", "Movie 2", ...],
    "Best Director": ["Director 1 (Film)", ...],
    // ... all 21 categories
};
```

### CATEGORY_ORDER
Array defining the Oscar ceremony order (technical awards first, building to Best Picture):
```javascript
const CATEGORY_ORDER = [
    "Casting",
    "Documentary",
    // ... technical categories ...
    "Best Director",
    "Best Actor",
    "Best Actress",
    "Best Picture"  // Always last
];
```

### Winners Data Structure
```javascript
winnersData = [
    {
        name: "Guest Name",      // Who won
        category: "Best Actor",  // Which category
        excluded: true           // Whether excluded from future raffles
    }
];
```

---

## UI Components

### Layout
- **Single page** - No scrolling on desktop (100vh)
- **Two columns** - Step 1 (nominee selection) left, Step 2 (raffle) right
- **Responsive** - Stacks vertically on mobile

### Key Elements
| Element | Purpose |
|---------|---------|
| Refresh button (top-left) | Pull latest data from Airtable |
| Winners button (top-right) | Toggle sidebar with previous winners |
| Progress bar | Shows "Category X of 21" |
| Nominee buttons | Click to select Oscar winner |
| Eligible list | Shows who guessed correctly |
| Spin button | Triggers raffle animation |
| Navigation buttons | Previous/Next category |
| Reset button | Clear all data and restart |

### Sidebar (Winners)
- Slide-in panel from right
- Shows all raffle winners with checkboxes
- Checked = excluded from future raffles
- Unchecked = back in the running
- Shows which category they won

---

## Animations

1. **Spinner** - Names in a grid, cycles through highlighting each
   - Starts fast (50ms), slows down (300ms)
   - Winner pulses when selected

2. **Confetti** - Gold particles on winner announcement

3. **Flying Name** - Winner's name animates from announcement to sidebar toggle

---

## Annual Update Checklist

### Before Oscar Season

1. **Update Nominees** (`raffle.js`)
   - Update `NOMINEE_OPTIONS` with official nominees
   - Format: exact match to Airtable single select options

2. **Update Category Order** (`raffle.js`)
   - Check if Academy changed the ceremony order
   - Update `CATEGORY_ORDER` if needed

3. **Update Airtable**
   - Add new single select options to each category column
   - Options must match `NOMINEE_OPTIONS` exactly

4. **Update Prizes** (Airtable Categories table)
   - Update prize descriptions for each category

### Day of Party

1. Open app early to verify Airtable connection
2. Click "Reset All" to clear previous year's data
3. Verify nominees load correctly for first category
4. Test the refresh button

### After Party

1. Screenshot final winners list (sidebar)
2. Data persists in localStorage until cleared

---

## Troubleshooting

### "Setup Required" Message
- Check config.js has valid API key and Base ID
- Verify API key has read access to the base

### Nominees Don't Match
- Airtable single select options must EXACTLY match `NOMINEE_OPTIONS`
- Check for extra spaces, different punctuation

### Data Not Updating
- Click the refresh button (top-left)
- Data only updates on page load or manual refresh
- Not real-time (by design - prevents disruption during show)

### Wrong Category Order
- Update `CATEGORY_ORDER` in raffle.js
- Must match Academy's broadcast order

### Winners Not Persisting
- Check browser localStorage isn't full/blocked
- Private/incognito mode may not persist

---

## Deployment (GitHub Pages)

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Set source to main branch
4. Site will be at: `https://username.github.io/repo-name/`

**Security Note**: config.js contains API credentials. For public repos:
- Use environment variables or
- Keep config.js in .gitignore and add manually to deployment

---

## Design Decisions

### Why Vanilla JS?
- No build process needed
- Easy to understand/modify
- Deploys anywhere (just HTML/CSS/JS files)
- No framework updates to maintain

### Why Airtable?
- Easy form creation for guests
- No backend needed
- Free tier sufficient for party size
- Simple REST API

### Why localStorage?
- No database needed
- Persists across browser sessions
- Works offline (after initial load)

### Why Manual Refresh?
- Prevents data changes during dramatic moments
- Host controls when updates happen
- More predictable for live event

---

## Future Enhancement Ideas

- Sound effects for winner announcement
- Multiple theme options (Academy, Golden Globes, etc.)
- Score tracking across categories
- Export final results to CSV
- Real-time updates option
- Mobile host controls separate from display view

---

## Contact / Support

This project was built with assistance from Claude (Anthropic's AI). For future modifications, reference this documentation and CLAUDE.md for context.

Last updated: 2026 Oscar season
