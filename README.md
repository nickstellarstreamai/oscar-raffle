# Oscar Party Raffle

A web-based raffle system for Oscar party prediction games. Guests submit their picks via Airtable form, and during the party you run dramatic raffles to select prize winners!

## How It Works

1. **Before the party:** Guests fill out an Airtable form with their Oscar predictions
2. **During the show:** You update the "Winners" table with actual Oscar winners
3. **After the show:** Open this raffle page, select each category, and spin to pick a prize winner from those who guessed correctly

## Quick Setup (20 minutes)

### Step 1: Create Your Airtable Base

1. Go to [airtable.com](https://airtable.com) and sign in (or create free account)
2. Click **"Create a base"** → **"Start from scratch"**
3. Name it "Oscar Party 2025" (or whatever year)

### Step 2: Create the Tables

You need **3 tables**. Here's exactly how to set them up:

#### Table 1: Categories

Rename "Table 1" to `Categories` and add these columns:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Category Name | Single line text | e.g., "Best Picture", "Best Actor" |
| Prize | Single line text | e.g., "$25 Amazon Gift Card" |

**Add your categories** (example):
```
Best Picture          | Grand Prize - $100 Gift Card
Best Director         | $25 Amazon Gift Card
Best Actor            | $25 Amazon Gift Card
Best Actress          | $25 Amazon Gift Card
Best Supporting Actor | $15 Starbucks Card
Best Supporting Actress | $15 Starbucks Card
Best Original Screenplay | Bottle of Wine
Best Adapted Screenplay | Bottle of Wine
Best Animated Feature | Movie Theater Gift Card
Best International Feature | Chocolate Box
Best Cinematography   | Fancy Candle
Best Original Score   | Spotify Gift Card
```

#### Table 2: Submissions

Create a new table called `Submissions` with these columns:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Guest Name | Single line text | Required |
| Best Picture | Single select | Add all nominees as options |
| Best Director | Single select | Add all nominees as options |
| Best Actor | Single select | Add all nominees as options |
| ... | ... | One column per category |

**Important:** For each category column, add the **nominees** as the select options. For example, for "Best Actor" you'd add options like "Timothée Chalamet", "Colman Domingo", etc.

#### Table 3: Winners

Create a new table called `Winners` with these columns:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Category Name | Single line text | Must match Categories table exactly |
| Winner | Single line text | The actual Oscar winner |

Leave this table empty until Oscar night - you'll fill it in as winners are announced.

### Step 3: Create the Form

1. In the `Submissions` table, click **"Views"** (left sidebar)
2. Click **"+ Create a view"** → **"Form"**
3. Customize the form:
   - Add a title like "Oscar Party 2025 Predictions"
   - Add instructions
   - Make sure all category fields are visible
4. Click **"Share form"** to get the link for your guests

### Step 4: Get Your Airtable API Credentials

#### Get your Personal Access Token:
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name it "Oscar Raffle"
4. Under **Scopes**, add: `data.records:read`
5. Under **Access**, add your Oscar Party base
6. Click **"Create token"**
7. **Copy the token** (you won't see it again!)

#### Get your Base ID:
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The part starting with `app` is your Base ID

### Step 5: Configure the Raffle App

1. Open `config.js` in a text editor
2. Replace the placeholder values:

```javascript
const CONFIG = {
    AIRTABLE_API_KEY: 'patXXXXXXXXXXXXXX',  // Your token
    AIRTABLE_BASE_ID: 'appXXXXXXXXXXXXXX',  // Your base ID
    // ... rest stays the same
};
```

3. Save the file

### Step 6: Deploy to GitHub Pages

1. Create a GitHub account at [github.com](https://github.com) (if you don't have one)
2. Click **"+"** → **"New repository"**
3. Name it `oscar-raffle`
4. Make it **Public**
5. Click **"Create repository"**
6. Click **"uploading an existing file"**
7. Drag all 4 files from the `oscar-raffle` folder:
   - `index.html`
   - `style.css`
   - `config.js`
   - `raffle.js`
8. Click **"Commit changes"**
9. Go to **Settings** → **Pages**
10. Under "Source", select **"main"** branch
11. Click **Save**
12. Wait 1-2 minutes, then visit: `https://YOUR_USERNAME.github.io/oscar-raffle`

## Using the Raffle on Oscar Night

### Before guests arrive:
- Send the Airtable form link to all guests
- Make sure everyone submits their picks

### During the show:
- As each Oscar winner is announced, update the `Winners` table in Airtable
- Just add a row with the category name and winner name

### After the show (Raffle Time!):
1. Open your raffle page URL on the party computer
2. Share your screen so everyone can see
3. Select a category from the dropdown
4. The page shows:
   - The actual Oscar winner
   - All guests who guessed correctly
   - Who's already won a prize (crossed out)
5. Click **"SPIN TO WIN"**
6. Names cycle dramatically, then land on the winner
7. Award the prize!
8. Move to the next category
9. **Best Picture is special:** Previous winners CAN win again for Best Picture

### If something goes wrong:
- **Page won't load:** Check your API key and Base ID in config.js
- **No categories showing:** Make sure your Categories table has data
- **Wrong people showing as eligible:** Check that the category names match exactly between tables
- **Need to redo a raffle:** Click "Reset All Winners" at the bottom

## Files

```
oscar-raffle/
├── index.html    # The main page
├── style.css     # Styling (Oscar gold theme)
├── config.js     # Your Airtable credentials (edit this!)
├── raffle.js     # All the raffle logic
└── README.md     # This file
```

## Tips

- **Test before the party!** Add some fake submissions and run through a few raffles
- **Big screen:** This looks best on a TV or projector
- **Backup plan:** Keep Airtable open in another tab - you can always manually pick winners if the raffle app has issues
- **API key security:** Your API key is in the code, which is fine for a personal project. Don't share your repo publicly if you're concerned.

## Troubleshooting

**"Setup Required" message:**
- Open `config.js` and add your real API key and Base ID

**"Connection Error":**
- Check that your API token has read access to the base
- Verify the Base ID is correct
- Make sure table names in config.js match exactly

**Categories not loading:**
- Table must be named exactly `Categories`
- Must have a column named exactly `Category Name`

**Submissions not showing:**
- Table must be named exactly `Submissions`
- Must have a column named exactly `Guest Name`
- Category columns must match category names exactly

---

Enjoy your Oscar party! 🏆
