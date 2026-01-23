# Oscar Party Raffle - Claude Code Instructions

## Project Overview
This is an Oscar party raffle system for an annual viewing party. Guests submit predictions via Airtable form, and during the show, correct guessers are entered into raffles for prizes.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (no frameworks)
- **Data**: Airtable REST API (Categories, Submissions tables)
- **Storage**: localStorage for raffle state persistence
- **Hosting**: GitHub Pages (static site)

## Key Files
- `index.html` - Main app structure
- `style.css` - All styling (Oscar gold theme)
- `raffle.js` - Core application logic
- `config.js` - Airtable credentials (not committed to git)

## Architecture Notes
- Single-page app, no scrolling on desktop
- Two-column layout: nominee selection (left) and raffle (right)
- Sidebar for winners management (toggle via button)
- Sequential category flow with Previous/Next navigation

## Important Business Logic
1. **Correct guessers** are eligible for each category's raffle
2. **Nobody correct?** Everyone becomes eligible
3. **Previous winners** are excluded from future raffles (checkbox controlled)
4. **Best Picture exception**: Anyone can win regardless of previous wins
5. Winners list persists in localStorage across sessions

## Airtable Structure
- **Submissions table**: Guest Name + one column per category (single select)
- **Categories table**: Category Name + Prize
- Category column names must match exactly between tables

## Annual Updates Needed
1. Update `NOMINEE_OPTIONS` in raffle.js with new nominees
2. Update `CATEGORY_ORDER` if Oscar order changes
3. Verify Airtable form fields match category names
4. Clear localStorage before party (`Reset All` button)

## Commands
- Refresh data: Click the refresh button (top-left) to pull latest Airtable data
- Reset: `Reset All & Start Over` clears winners and returns to category 1
