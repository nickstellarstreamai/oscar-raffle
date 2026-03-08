// ============================================
// Oscar Party Raffle - Main Logic
// Sequential Category Flow with Next Button
// ============================================

// Default emojis (used as fallback if not in Airtable)
const DEFAULT_EMOJIS = {
    "Sinners": "😈",
    "One Battle After Another": "⚔️",
    "Hamnet": "🎭",
    "Frankenstein": "🧟",
    "Marty Supreme": "🏓",
    "Sentimental Value": "💝",
    "Train Dreams": "🚂",
    "Avatar: Fire and Ash": "🔥",
    "The Secret Agent": "🕵️",
    "Bugonia": "🦟",
    "F1": "🏎️",
    "Elio": "👽",
    "Arco": "🌈",
    "KPop Demon Hunters": "👹",
    "Little Amélie or the Character of Rain": "🌧️",
    "Zootopia 2": "🐾",
    "The Perfect Neighbor": "🏠",
    "The Alabama Solution": "📜",
    "Come See Me in the Good Light": "💡",
    "Cutting Through Rocks": "🪨",
    "Mr. Nobody Against Putin": "✊",
    "The Secret Agent (Brazil)": "🇧🇷",
    "It Was Just an Accident (France)": "🇫🇷",
    "Sentimental Value (Norway)": "🇳🇴",
    "Sirât (Spain)": "🇪🇸",
    "The Voice of Hind Rajab (Tunisia)": "🇹🇳",
    "Sirāt": "🌍",
    "Blue Moon": "🌙",
    "It Was Just an Accident": "💥",
    "Weapons": "🔫",
    "The Smashing Machine": "💪",
    "Kokuho": "🍚",
    "The Ugly Stepsister": "👠",
    "Jurassic World Rebirth": "🦖",
    "The Lost Bus": "🚌",
    "Song Sung Blue": "🎵",
    "Diane Warren: Relentless": "🎹",
    "Viva Verdi!": "🎶"
};

// Fallback nominee list (used if Nominees table doesn't exist in Airtable)
const FALLBACK_NOMINEES = {
    "Best Picture": [
        "Bugonia",
        "F1",
        "Frankenstein",
        "Hamnet",
        "Marty Supreme",
        "One Battle After Another",
        "The Secret Agent",
        "Sentimental Value",
        "Sinners",
        "Train Dreams"
    ],
    "Directing": [
        "Ryan Coogler (Sinners)",
        "Paul Thomas Anderson (One Battle After Another)",
        "Chloé Zhao (Hamnet)",
        "Josh Safdie (Marty Supreme)",
        "Joachim Trier (Sentimental Value)"
    ],
    "Actor in a Leading Role": [
        "Michael B. Jordan (Sinners)",
        "Leonardo DiCaprio (One Battle After Another)",
        "Timothée Chalamet (Marty Supreme)",
        "Ethan Hawke (Blue Moon)",
        "Wagner Moura (The Secret Agent)"
    ],
    "Actress in a Leading Role": [
        "Jessie Buckley (Hamnet)",
        "Rose Byrne (If I Had Legs I'd Kick You)",
        "Renate Reinsve (Sentimental Value)",
        "Emma Stone (Bugonia)",
        "Kate Hudson (Song Sung Blue)"
    ],
    "Actress in a Supporting Role": [
        "Elle Fanning (Sentimental Value)",
        "Wunmi Mosaku (Sinners)",
        "Teyana Taylor (One Battle After Another)",
        "Inga Ibsdotter Lilleaas (Sentimental Value)",
        "Amy Madigan (Weapons)"
    ],
    "Actor in a Supporting Role": [
        "Benicio del Toro (One Battle After Another)",
        "Jacob Elordi (Frankenstein)",
        "Sean Penn (One Battle After Another)",
        "Stellan Skarsgård (Sentimental Value)",
        "Delroy Lindo (Sinners)"
    ],
    "Writing (Adapted Screenplay)": [
        "One Battle After Another",
        "Hamnet",
        "Frankenstein",
        "Train Dreams",
        "Bugonia"
    ],
    "Writing (Original Screenplay)": [
        "Sinners",
        "Marty Supreme",
        "Sentimental Value",
        "It Was Just an Accident",
        "Blue Moon"
    ],
    "Casting": [
        "Hamnet",
        "Marty Supreme",
        "One Battle After Another",
        "The Secret Agent",
        "Sinners"
    ],
    "Animated Feature Film": [
        "Arco",
        "Elio",
        "KPop Demon Hunters",
        "Little Amélie or the Character of Rain",
        "Zootopia 2"
    ],
    "Documentary Feature Film": [
        "The Perfect Neighbor",
        "The Alabama Solution",
        "Come See Me in the Good Light",
        "Cutting Through Rocks",
        "Mr. Nobody Against Putin"
    ],
    "International Feature Film": [
        "The Secret Agent (Brazil)",
        "It Was Just an Accident (France)",
        "Sentimental Value (Norway)",
        "Sirât (Spain)",
        "The Voice of Hind Rajab (Tunisia)"
    ],
    "Sound": [
        "F1",
        "Frankenstein",
        "One Battle After Another",
        "Sinners",
        "Sirāt"
    ],
    "Cinematography": [
        "Frankenstein",
        "Marty Supreme",
        "One Battle After Another",
        "Sinners",
        "Train Dreams"
    ],
    "Film Editing": [
        "F1",
        "Marty Supreme",
        "One Battle After Another",
        "Sentimental Value",
        "Sinners"
    ],
    "Music (Original Song)": [
        "\"Golden\" from KPop Demon Hunters",
        "\"Train Dreams\" from Train Dreams",
        "\"Dear Me\" from Diane Warren: Relentless",
        "\"I Lied To You\" from Sinners",
        "\"Sweet Dreams Of Joy\" from Viva Verdi!"
    ],
    "Music (Original Score)": [
        "Sinners",
        "One Battle After Another",
        "Hamnet",
        "Frankenstein",
        "Bugonia"
    ],
    "Visual Effects": [
        "Avatar: Fire and Ash",
        "F1",
        "Jurassic World Rebirth",
        "The Lost Bus",
        "Sinners"
    ],
    "Makeup and Hairstyling": [
        "Frankenstein",
        "Kokuho",
        "Sinners",
        "The Smashing Machine",
        "The Ugly Stepsister"
    ],
    "Production Design": [
        "Frankenstein",
        "Hamnet",
        "Marty Supreme",
        "One Battle After Another",
        "Sinners"
    ],
    "Costume Design": [
        "Avatar: Fire and Ash",
        "Frankenstein",
        "Hamnet",
        "Marty Supreme",
        "Sinners"
    ]
};

// Helper to get emoji for a nominee (will use Airtable data if available)
function getEmojiForNominee(nominee, nomineeEmojis = {}) {
    // Check Airtable data first
    if (nomineeEmojis[nominee]) return nomineeEmojis[nominee];

    // Check default emojis
    if (DEFAULT_EMOJIS[nominee]) return DEFAULT_EMOJIS[nominee];

    // Check if movie name is in parentheses (for actors/directors)
    const match = nominee.match(/\(([^)]+)\)/);
    if (match) {
        if (nomineeEmojis[match[1]]) return nomineeEmojis[match[1]];
        if (DEFAULT_EMOJIS[match[1]]) return DEFAULT_EMOJIS[match[1]];
    }

    // Default emoji
    return "🎬";
}

// Helper to get the Submissions field name for a category
// All tables use official Oscar category names
function getSubmissionFieldName(categoryName) {
    return categoryName;
}

// Helper to strip emoji prefix from a pick value (e.g., "😈 Sinners" -> "Sinners")
function stripEmojiPrefix(value) {
    if (!value) return value;
    // Remove leading emoji(s) and space - emojis are typically 1-4 chars followed by optional variation selector + space
    return value.replace(/^[\p{Emoji}\p{Emoji_Component}\u200d\ufe0f]+\s*/u, '').trim();
}

// Fallback category order (used if Presentation Order not in Airtable)
const FALLBACK_CATEGORY_ORDER = [
    "Casting",
    "Documentary Feature Film",
    "Animated Feature Film",
    "International Feature Film",
    "Music (Original Song)",
    "Music (Original Score)",
    "Sound",
    "Visual Effects",
    "Makeup and Hairstyling",
    "Costume Design",
    "Production Design",
    "Cinematography",
    "Film Editing",
    "Writing (Adapted Screenplay)",
    "Writing (Original Screenplay)",
    "Actor in a Supporting Role",
    "Actress in a Supporting Role",
    "Directing",
    "Actor in a Leading Role",
    "Actress in a Leading Role",
    "Best Picture"
];

class OscarRaffle {
    constructor() {
        this.categories = [];
        this.submissions = [];
        // Nominees from Airtable: { categoryName: [{ name: string, emoji: string }] }
        this.nominees = {};
        // Emoji lookup from Airtable: { nomineeName: emoji }
        this.nomineeEmojis = {};
        // Winners data: { name: string, category: string, excluded: boolean }[]
        this.winnersData = [];
        // Completed categories: { categoryName: { oscarWinner: string, raffleWinner: string } }
        this.completedCategories = {};
        this.currentCategoryIndex = 0;
        this.currentCategory = null;
        this.currentOscarWinner = null;
        // Dynamic category order from Airtable (falls back to FALLBACK_CATEGORY_ORDER)
        this.categoryOrder = [...FALLBACK_CATEGORY_ORDER];
        // Winners table records from Airtable (for wrap-up)
        this.winnersTableRecords = [];

        // Load persisted state
        this.loadWinnersData();
        this.loadCurrentCategoryIndex();
        this.loadCompletedCategories();

        // DOM elements
        this.elements = {
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            errorMessage: document.getElementById('error-message'),
            mainContent: document.getElementById('main-content'),
            setupRequired: document.getElementById('setup-required'),
            // Progress
            progressBar: document.getElementById('progress-bar'),
            progressFill: document.getElementById('progress-fill'),
            progressSegments: document.getElementById('progress-segments'),
            progressCount: document.getElementById('progress-count'),
            progressCategoryName: document.getElementById('progress-category-name'),
            // Step 1: Category & nominees
            categoryName: document.getElementById('category-name'),
            nomineeButtons: document.getElementById('nominee-buttons'),
            // Step 2: Raffle
            raffleSection: document.getElementById('raffle-section'),
            oscarWinner: document.getElementById('oscar-winner'),
            correctCount: document.getElementById('correct-count'),
            eligibleCount: document.getElementById('eligible-count'),
            eligibleList: document.getElementById('eligible-list'),
            noGuessesMessage: document.getElementById('no-guesses-message'),
            spinSection: document.getElementById('spin-section'),
            spinButton: document.getElementById('spin-button'),
            spinAgainButton: document.getElementById('spin-again-button'),
            spinnerDisplay: document.getElementById('spinner-display'),
            spinnerNames: document.getElementById('spinner-names'),
            winnerAnnouncement: document.getElementById('winner-announcement'),
            raffleWinner: document.getElementById('raffle-winner'),
            confetti: document.getElementById('confetti'),
            // Navigation
            prevCategoryButton: document.getElementById('prev-category-button'),
            nextCategoryButton: document.getElementById('next-category-button'),
            // Sidebar
            sidebarToggle: document.getElementById('sidebar-toggle'),
            sidebar: document.getElementById('winners-sidebar'),
            sidebarClose: document.getElementById('sidebar-close'),
            sidebarOverlay: document.getElementById('sidebar-overlay'),
            sidebarWinnersList: document.getElementById('sidebar-winners-list'),
            // Voters sidebar
            votersToggle: document.getElementById('voters-toggle'),
            votersSidebar: document.getElementById('voters-sidebar'),
            votersClose: document.getElementById('voters-close'),
            votersOverlay: document.getElementById('voters-overlay'),
            votersList: document.getElementById('voters-list'),
            votersCountNumber: document.getElementById('voters-count-number'),
            // Controls
            refreshButton: document.getElementById('refresh-data'),
            resetButton: document.getElementById('reset-winners'),
            // Reset Category
            resetCategorySection: document.getElementById('reset-category-section'),
            resetCategoryButton: document.getElementById('reset-category-button'),
            // Randomness Proof
            randomnessProof: document.getElementById('randomness-proof'),
            proofCryptoValue: document.getElementById('proof-crypto-value'),
            proofPoolSize: document.getElementById('proof-pool-size'),
            proofIndex: document.getElementById('proof-index')
        };

        this.init();
    }

    async init() {
        if (CONFIG.AIRTABLE_API_KEY === 'YOUR_API_KEY_HERE' ||
            CONFIG.AIRTABLE_BASE_ID === 'YOUR_BASE_ID_HERE') {
            this.showSetupRequired();
            return;
        }

        try {
            await this.loadData();
            this.setupEventListeners();
            this.showMainContent();
            this.renderSidebar();
            this.showCurrentCategory();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // ============================================
    // Airtable API
    // ============================================

    async fetchTable(tableName) {
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

    async updateCategoryInAirtable(categoryName, oscarWinner, raffleWinner) {
        // Find the category record ID
        const category = this.categories.find(c => c.name === categoryName);
        if (!category || !category.id) {
            console.warn(`[AIRTABLE] Could not find category record for: ${categoryName}`);
            return;
        }

        const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(CONFIG.TABLES.CATEGORIES)}/${category.id}`;

        const fields = {};
        if (oscarWinner) fields['Oscar Winner'] = oscarWinner;
        if (raffleWinner) fields['Raffle Winner'] = raffleWinner;

        try {
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
                throw new Error(errorData.error?.message || response.statusText);
            }

            console.log(`[AIRTABLE] Updated ${categoryName}: Oscar Winner="${oscarWinner}", Raffle Winner="${raffleWinner}"`);
        } catch (error) {
            console.error(`[AIRTABLE] Failed to update ${categoryName}:`, error);
        }
    }

    async clearCategoryInAirtable(categoryName) {
        // Find the category record ID
        const category = this.categories.find(c => c.name === categoryName);
        if (!category || !category.id) {
            console.warn(`[AIRTABLE] Could not find category record for: ${categoryName}`);
            return;
        }

        const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(CONFIG.TABLES.CATEGORIES)}/${category.id}`;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        'Oscar Winner': null,
                        'Raffle Winner': null
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || response.statusText);
            }

            console.log(`[AIRTABLE] Cleared winners for ${categoryName}`);
        } catch (error) {
            console.error(`[AIRTABLE] Failed to clear ${categoryName}:`, error);
        }
    }

    async loadData() {
        // Try to fetch nominees table (optional - will use fallback if not found)
        let nomineesData = [];
        try {
            if (CONFIG.TABLES.NOMINEES) {
                nomineesData = await this.fetchTable(CONFIG.TABLES.NOMINEES);
            }
        } catch (e) {
            console.log('Nominees table not found, using fallback data');
        }

        const [categoriesData, submissionsData] = await Promise.all([
            this.fetchTable(CONFIG.TABLES.CATEGORIES),
            this.fetchTable(CONFIG.TABLES.SUBMISSIONS)
        ]);

        // Process nominees from Airtable (if available)
        if (nomineesData.length > 0) {
            this.nominees = {};
            this.nomineeEmojis = {};
            nomineesData.forEach(record => {
                const category = record.fields['Category'];
                const nominee = record.fields['Nominee'];
                const emoji = record.fields['Emoji'] || '🎬';

                if (category && nominee) {
                    if (!this.nominees[category]) {
                        this.nominees[category] = [];
                    }
                    this.nominees[category].push({ name: nominee, emoji });
                    this.nomineeEmojis[nominee] = emoji;
                }
            });
            console.log('Loaded nominees from Airtable:', Object.keys(this.nominees).length, 'categories');
        } else {
            // Use fallback
            this.nominees = {};
            Object.keys(FALLBACK_NOMINEES).forEach(cat => {
                this.nominees[cat] = FALLBACK_NOMINEES[cat].map(name => ({
                    name,
                    emoji: DEFAULT_EMOJIS[name] || '🎬'
                }));
            });
            console.log('Using fallback nominees data');
        }

        // Process categories (for prize lookup and presentation order)
        this.categories = categoriesData.map(record => ({
            id: record.id,
            name: record.fields['Category Name'],
            prize: record.fields['Prize'] || 'TBD',
            presentationOrder: record.fields['Presentation Order'] || 999
        })).filter(c => c.name);

        // Build category order from Presentation Order field
        const categoriesWithOrder = this.categories.filter(c => c.presentationOrder !== 999);
        if (categoriesWithOrder.length > 0) {
            // Sort by presentation order and extract names
            this.categoryOrder = [...this.categories]
                .sort((a, b) => a.presentationOrder - b.presentationOrder)
                .map(c => c.name);
            console.log('Loaded category order from Airtable:', this.categoryOrder);
        } else {
            // Use fallback order
            this.categoryOrder = [...FALLBACK_CATEGORY_ORDER];
            console.log('Using fallback category order');
        }

        // Process submissions
        this.submissions = submissionsData.map(record => ({
            id: record.id,
            guestName: record.fields[CONFIG.FIELDS.GUEST_NAME],
            picks: record.fields
        })).filter(s => s.guestName);

        // Load Winners table records (for wrap-up functionality)
        try {
            const winnersTableData = await this.fetchTable(CONFIG.TABLES.WINNERS);
            this.winnersTableRecords = winnersTableData.map(record => ({
                id: record.id,
                categoryName: record.fields['Category Name'],
                winner: record.fields['Winner'] || ''
            }));
            console.log('Loaded Winners table:', this.winnersTableRecords.length, 'records');
        } catch (e) {
            console.log('Winners table not found, wrap-up will not save to Airtable');
            this.winnersTableRecords = [];
        }
    }

    // ============================================
    // UI Updates
    // ============================================

    showSetupRequired() {
        this.elements.loading.classList.add('hidden');
        this.elements.setupRequired.classList.remove('hidden');
    }

    showError(message) {
        this.elements.loading.classList.add('hidden');
        this.elements.errorMessage.textContent = message;
        this.elements.error.classList.remove('hidden');
    }

    showMainContent() {
        this.elements.loading.classList.add('hidden');
        this.elements.mainContent.classList.remove('hidden');
        this.buildProgressBar();
    }

    buildProgressBar() {
        // Build progress segments
        this.elements.progressSegments.innerHTML = '';
        this.categoryOrder.forEach((cat, index) => {
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            segment.dataset.index = index;
            segment.title = cat;
            segment.addEventListener('click', () => {
                this.currentCategoryIndex = index;
                this.saveCurrentCategoryIndex();
                this.showCurrentCategory();
            });
            this.elements.progressSegments.appendChild(segment);
        });
        this.updateProgressBar();
    }

    updateProgressBar() {
        const segments = this.elements.progressSegments.querySelectorAll('.progress-segment');
        segments.forEach((seg, index) => {
            const categoryName = this.categoryOrder[index];
            seg.classList.remove('completed', 'current');
            if (this.completedCategories[categoryName]) {
                seg.classList.add('completed');
            }
            if (index === this.currentCategoryIndex) {
                seg.classList.add('current');
            }
        });

        // Note: gold coloring is now segment-based via CSS .completed class

        // Update progress label
        const currentCat = this.categoryOrder[this.currentCategoryIndex];
        this.elements.progressCount.textContent = `${this.currentCategoryIndex + 1}/${this.categoryOrder.length}`;
        this.elements.progressCategoryName.textContent = currentCat;
    }

    showCurrentCategory() {
        const categoryName = this.categoryOrder[this.currentCategoryIndex];
        this.currentCategory = this.categories.find(c => c.name === categoryName) || { name: categoryName, prize: 'TBD' };

        // Update progress bar
        this.updateProgressBar();

        // Update category display
        this.elements.categoryName.textContent = this.currentCategory.name;

        // Hide randomness proof when switching categories
        this.elements.randomnessProof.classList.add('hidden');

        // Check if this category was already completed
        const completed = this.completedCategories[categoryName];
        if (completed) {
            // Restore completed state
            this.currentOscarWinner = completed.oscarWinner;

            // Show nominee buttons with winner selected (frozen)
            const nominees = this.getNomineesForCategory(categoryName);
            this.renderNomineeButtons(nominees, true, completed.oscarWinner);

            // Show raffle section with winner
            this.elements.raffleSection.classList.remove('hidden');
            this.elements.oscarWinner.textContent = completed.oscarWinner;

            // Show eligible guests
            this.showEligibleGuests();

            // Show the winner announcement
            this.elements.spinnerDisplay.classList.add('hidden');
            this.elements.spinButton.classList.add('hidden');
            this.elements.spinAgainButton.classList.remove('hidden');
            this.elements.raffleWinner.textContent = completed.raffleWinner;
            this.elements.winnerAnnouncement.classList.remove('hidden');

            // Show reset category button for completed categories
            this.elements.resetCategorySection.classList.remove('hidden');
        } else {
            // Fresh category
            this.currentOscarWinner = null;

            // Hide raffle section until winner selected
            this.elements.raffleSection.classList.add('hidden');

            // Show nominee buttons
            const nominees = this.getNomineesForCategory(categoryName);
            this.renderNomineeButtons(nominees, false, null);

            // Hide reset category button for fresh categories
            this.elements.resetCategorySection.classList.add('hidden');
        }

        // Update navigation button states
        this.updateNavButtons();
    }

    getNomineesForCategory(categoryName) {
        // Get from loaded nominees (either Airtable or fallback)
        const nominees = this.nominees[categoryName] || [];
        // Sort alphabetically by name
        return [...nominees].sort((a, b) => {
            const nameA = typeof a === 'string' ? a : a.name;
            const nameB = typeof b === 'string' ? b : b.name;
            return nameA.localeCompare(nameB);
        });
    }

    renderNomineeButtons(nominees, frozen = false, selectedWinner = null) {
        this.elements.nomineeButtons.innerHTML = '';

        if (nominees.length === 0) {
            this.elements.nomineeButtons.innerHTML = '<p class="no-nominees">No nominees for this category</p>';
            return;
        }

        nominees.forEach(nomineeObj => {
            // Support both object format { name, emoji } and string format
            const nomineeName = typeof nomineeObj === 'string' ? nomineeObj : nomineeObj.name;
            const nomineeEmoji = typeof nomineeObj === 'string'
                ? getEmojiForNominee(nomineeObj, this.nomineeEmojis)
                : (nomineeObj.emoji || getEmojiForNominee(nomineeName, this.nomineeEmojis));

            const button = document.createElement('button');
            button.className = 'nominee-button';

            // Add emoji
            button.innerHTML = `<span class="nominee-emoji">${nomineeEmoji}</span><span class="nominee-text">${nomineeName}</span>`;

            // If frozen (completed category), disable buttons and highlight winner
            if (frozen) {
                button.disabled = true;
                if (nomineeName === selectedWinner) {
                    button.classList.add('selected');
                }
            } else {
                button.addEventListener('click', () => this.selectWinner(nomineeName));
            }

            this.elements.nomineeButtons.appendChild(button);
        });
    }

    selectWinner(winnerName) {
        this.currentOscarWinner = winnerName;

        // Highlight selected button
        const buttons = this.elements.nomineeButtons.querySelectorAll('.nominee-button');
        buttons.forEach(btn => {
            const btnText = btn.querySelector('.nominee-text')?.textContent || btn.textContent;
            btn.classList.toggle('selected', btnText === winnerName);
        });

        // Show raffle section
        this.elements.raffleSection.classList.remove('hidden');
        this.elements.oscarWinner.textContent = winnerName;

        // Reset spin state
        this.elements.spinnerDisplay.classList.add('hidden');
        this.elements.winnerAnnouncement.classList.add('hidden');
        this.elements.spinButton.classList.remove('hidden');
        this.elements.spinButton.disabled = false;
        this.elements.spinAgainButton.classList.add('hidden');

        // Show eligible guests
        this.showEligibleGuests();
    }

    showEligibleGuests(freezeAfterSpin = false) {
        const categoryName = this.currentCategory.name;
        const oscarWinner = this.currentOscarWinner;
        const isBestPicture = categoryName === 'Best Picture';
        const completed = this.completedCategories[categoryName];

        // Get excluded names (winners who are still checked/excluded)
        // But if this category is completed, use a snapshot that EXCLUDES the current category's winner
        // This prevents the UI from showing everyone after the winner is selected
        let excludedNames;
        if (freezeAfterSpin && completed) {
            // Don't count this category's winner as excluded for display purposes
            excludedNames = new Set(
                this.winnersData
                    .filter(w => w.excluded && !(w.name === completed.raffleWinner && w.category === categoryName))
                    .map(w => w.name)
            );
        } else {
            excludedNames = new Set(
                this.winnersData
                    .filter(w => w.excluded)
                    .map(w => w.name)
            );
        }

        // Find guests who guessed correctly
        const submissionField = getSubmissionFieldName(categoryName);
        const correctGuests = this.submissions.filter(sub => {
            const pick = stripEmojiPrefix(sub.picks[submissionField]);
            return pick && pick.toLowerCase().trim() === oscarWinner.toLowerCase().trim();
        });

        // Filter correct guessers to only those who haven't won yet (unless Best Picture)
        const eligibleCorrectGuests = correctGuests.filter(g =>
            isBestPicture || !excludedNames.has(g.guestName)
        );

        this.elements.eligibleList.innerHTML = '';

        // Always show correct count accurately
        this.elements.correctCount.textContent = correctGuests.length;

        // Determine what to show:
        // - If nobody guessed correctly: everyone is eligible
        // - If correct guessers exist but ALL have already won: everyone (who hasn't won) is eligible
        // - Otherwise: only correct guessers
        let guestsToShow;
        let eligibleForRaffle;

        if (correctGuests.length === 0) {
            // Nobody guessed correctly
            guestsToShow = this.submissions;
            eligibleForRaffle = guestsToShow.filter(g =>
                isBestPicture || !excludedNames.has(g.guestName)
            );
            this.elements.noGuessesMessage.textContent = 'Nobody guessed correctly! Everyone is in the running!';
            this.elements.noGuessesMessage.classList.remove('hidden');
        } else if (eligibleCorrectGuests.length === 0 && !freezeAfterSpin) {
            // All correct guessers have already won - open to everyone
            guestsToShow = this.submissions;
            eligibleForRaffle = guestsToShow.filter(g =>
                isBestPicture || !excludedNames.has(g.guestName)
            );
            this.elements.noGuessesMessage.textContent = `All ${correctGuests.length} correct guesser(s) already won! Opening to everyone.`;
            this.elements.noGuessesMessage.classList.remove('hidden');
        } else {
            // Normal case: show correct guessers
            guestsToShow = correctGuests;
            eligibleForRaffle = eligibleCorrectGuests;
            this.elements.noGuessesMessage.classList.add('hidden');
        }

        // Show eligible count (people who can actually win)
        this.elements.eligibleCount.textContent = eligibleForRaffle.length;

        guestsToShow.forEach(guest => {
            const span = document.createElement('span');
            span.className = 'eligible-name';
            span.textContent = guest.guestName;

            // For Best Picture, nobody is excluded
            // For other categories, show excluded winners as crossed out
            if (!isBestPicture && excludedNames.has(guest.guestName)) {
                span.classList.add('excluded');
                span.title = 'Already won a prize (excluded)';
            }

            this.elements.eligibleList.appendChild(span);
        });

        if (eligibleForRaffle.length > 0) {
            this.elements.spinSection.classList.remove('hidden');
        } else {
            this.elements.spinSection.classList.add('hidden');
        }
    }

    updateNavButtons() {
        const isFirstCategory = this.currentCategoryIndex === 0;
        const isLastCategory = this.currentCategoryIndex >= this.categoryOrder.length - 1;

        this.elements.prevCategoryButton.disabled = isFirstCategory;

        if (isLastCategory) {
            const allCompleted = this.categoryOrder.every(cat => this.completedCategories[cat]);
            this.elements.nextCategoryButton.textContent = '🎬 Wrap!';
            this.elements.nextCategoryButton.disabled = !allCompleted;
        } else {
            this.elements.nextCategoryButton.textContent = 'Next →';
            this.elements.nextCategoryButton.disabled = false;
        }
    }

    // ============================================
    // Navigation
    // ============================================

    prevCategory() {
        if (this.currentCategoryIndex > 0) {
            this.currentCategoryIndex--;
            this.saveCurrentCategoryIndex();
            this.showCurrentCategory();
        }
    }

    nextCategory() {
        const isLastCategory = this.currentCategoryIndex >= this.categoryOrder.length - 1;

        if (isLastCategory) {
            // Wrap! - save all winners to Airtable Winners table
            const allCompleted = this.categoryOrder.every(cat => this.completedCategories[cat]);
            if (allCompleted) {
                this.wrapUp();
            }
            return;
        }

        this.currentCategoryIndex++;
        this.saveCurrentCategoryIndex();
        this.showCurrentCategory();
    }

    // ============================================
    // Raffle Logic
    // ============================================

    // Cryptographically secure random number generator
    // Returns both the index AND the raw crypto value for transparency
    getSecureRandomIndex(max) {
        // Use crypto.getRandomValues for true randomness
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const rawValue = array[0];
        const index = rawValue % max;

        // Return both for transparency/proof
        return {
            index,
            rawValue,
            max
        };
    }

    async spin(isRespin = false) {
        if (!this.currentCategory || !this.currentOscarWinner) return;

        const categoryName = this.currentCategory.name;
        const oscarWinner = this.currentOscarWinner;
        const isBestPicture = categoryName === 'Best Picture';

        // Get excluded names
        const excludedNames = new Set(
            this.winnersData
                .filter(w => w.excluded)
                .map(w => w.name)
        );

        // Find guests who guessed correctly
        const submissionField = getSubmissionFieldName(categoryName);
        const correctGuests = this.submissions.filter(sub => {
            const pick = stripEmojiPrefix(sub.picks[submissionField]);
            return pick && pick.toLowerCase().trim() === oscarWinner.toLowerCase().trim();
        });

        // Filter correct guessers to only those who haven't won yet (unless Best Picture)
        const eligibleCorrectGuests = correctGuests.filter(g =>
            isBestPicture || !excludedNames.has(g.guestName)
        );

        // Determine the guest pool:
        // - If nobody guessed correctly: everyone (who hasn't won) is eligible
        // - If correct guessers exist but ALL have already won: everyone (who hasn't won) is eligible
        // - Otherwise: only correct guessers who haven't won
        let guestsPool;
        if (correctGuests.length === 0) {
            // Nobody guessed correctly - everyone who hasn't won is eligible
            guestsPool = this.submissions;
        } else if (eligibleCorrectGuests.length === 0) {
            // All correct guessers have already won - everyone who hasn't won is eligible
            guestsPool = this.submissions;
            console.log(`[RAFFLE] All ${correctGuests.length} correct guessers have already won - opening to everyone`);
        } else {
            // Normal case: only eligible correct guessers
            guestsPool = correctGuests;
        }

        // Filter out excluded winners (unless Best Picture - previous winners CAN win Best Picture)
        const eligibleGuests = guestsPool.filter(g =>
            isBestPicture || !excludedNames.has(g.guestName)
        );

        if (eligibleGuests.length === 0) return;

        this.elements.spinButton.disabled = true;
        this.elements.spinAgainButton.disabled = true;
        this.elements.spinnerDisplay.classList.remove('hidden');
        this.elements.winnerAnnouncement.classList.add('hidden');
        this.elements.randomnessProof.classList.add('hidden');

        // Use cryptographically secure random selection
        const randomResult = this.getSecureRandomIndex(eligibleGuests.length);
        const winnerIndex = randomResult.index;
        const winner = eligibleGuests[winnerIndex];

        // Log for debugging/verification
        console.log(`[RAFFLE] Category: ${categoryName}`);
        console.log(`[RAFFLE] Eligible guests (${eligibleGuests.length}):`, eligibleGuests.map(g => g.guestName));
        console.log(`[RAFFLE] Crypto raw value: ${randomResult.rawValue}`);
        console.log(`[RAFFLE] Pool size: ${randomResult.max}`);
        console.log(`[RAFFLE] Selected index: ${winnerIndex} (${randomResult.rawValue} % ${randomResult.max} = ${winnerIndex})`);
        console.log(`[RAFFLE] Winner: ${winner.guestName}`);

        // Store proof for display
        this.lastRandomProof = {
            rawValue: randomResult.rawValue,
            poolSize: randomResult.max,
            index: winnerIndex,
            eligibleNames: eligibleGuests.map(g => g.guestName)
        };

        await this.animateSpin(eligibleGuests.map(g => g.guestName), winner.guestName);

        // Show winner announcement first
        this.showWinner(winner.guestName);

        // Show spin again button, hide spin button
        this.elements.spinButton.classList.add('hidden');
        this.elements.spinAgainButton.classList.remove('hidden');
        this.elements.spinAgainButton.disabled = false;

        // Handle winner in sidebar
        if (isRespin) {
            // RESPIN: Remove the old winner for this category, add the new one
            const previousRaffleWinner = this.completedCategories[categoryName]?.raffleWinner;

            // Remove previous winner from this category (if they only won this category)
            if (previousRaffleWinner && previousRaffleWinner !== winner.guestName) {
                const prevWinnerIndex = this.winnersData.findIndex(w =>
                    w.name === previousRaffleWinner && w.category === categoryName
                );
                if (prevWinnerIndex !== -1) {
                    this.winnersData.splice(prevWinnerIndex, 1);
                    console.log(`[RESPIN] Removed previous winner: ${previousRaffleWinner}`);
                }
            }

            // Add new winner if not already a winner
            const existingWinner = this.winnersData.find(w => w.name === winner.guestName);
            if (!existingWinner) {
                this.winnersData.push({
                    name: winner.guestName,
                    category: categoryName,
                    excluded: !isBestPicture
                });
                this.saveWinnersData();
                await this.animateFlyingName(winner.guestName);
            }
        } else {
            // FIRST SPIN: Add winner normally
            const existingWinner = this.winnersData.find(w => w.name === winner.guestName);
            if (!existingWinner) {
                // New winner - add them (excluded by default, unless Best Picture)
                this.winnersData.push({
                    name: winner.guestName,
                    category: categoryName,
                    excluded: !isBestPicture // Best Picture winners are NOT excluded by default
                });
                this.saveWinnersData();

                // Animate name flying to sidebar
                await this.animateFlyingName(winner.guestName);
            } else if (isBestPicture) {
                // Already a winner but won Best Picture too - update their category display
                existingWinner.category += ', ' + categoryName;
                this.saveWinnersData();
            }
        }

        // Update completed categories AFTER handling winners
        this.completedCategories[categoryName] = {
            oscarWinner: oscarWinner,
            raffleWinner: winner.guestName
        };
        this.saveCompletedCategories();
        this.updateProgressBar();

        // Save to Airtable (async, don't wait)
        this.updateCategoryInAirtable(categoryName, oscarWinner, winner.guestName);

        this.renderSidebar();
        // Pass true to freeze the display state so it doesn't re-calculate after adding winner
        this.showEligibleGuests(true);
    }

    async animateSpin(names, finalName) {
        const duration = CONFIG.SPIN.DURATION_MS;
        const startSpeed = CONFIG.SPIN.INITIAL_SPEED_MS;
        const endSpeed = CONFIG.SPIN.FINAL_SPEED_MS;

        // Build the visual spinner with all names
        this.elements.spinnerNames.innerHTML = '';
        const nameElements = names.map(name => {
            const el = document.createElement('span');
            el.className = 'spinner-name-item';
            el.textContent = name;
            el.dataset.name = name;
            this.elements.spinnerNames.appendChild(el);
            return el;
        });

        const startTime = Date.now();
        let currentIndex = 0;

        return new Promise(resolve => {
            const tick = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const speed = startSpeed + (endSpeed - startSpeed) * Math.pow(progress, 2);

                // Remove active class from all
                nameElements.forEach(el => el.classList.remove('active'));

                // Add active class to current
                const activeIndex = currentIndex % names.length;
                nameElements[activeIndex].classList.add('active');
                currentIndex++;

                if (progress < 1) {
                    setTimeout(tick, speed);
                } else {
                    // Final selection - find and highlight winner
                    nameElements.forEach(el => {
                        el.classList.remove('active');
                        if (el.dataset.name === finalName) {
                            el.classList.add('winner');
                        }
                    });
                    setTimeout(resolve, 800);
                }
            };

            tick();
        });
    }

    showWinner(winnerName) {
        this.elements.spinnerDisplay.classList.add('hidden');
        this.elements.raffleWinner.textContent = winnerName;
        this.elements.winnerAnnouncement.classList.remove('hidden');
        this.createConfetti();

        // Show randomness proof
        if (this.lastRandomProof) {
            this.elements.proofCryptoValue.textContent = this.lastRandomProof.rawValue.toLocaleString();
            this.elements.proofPoolSize.textContent = `${this.lastRandomProof.poolSize} people`;
            this.elements.proofIndex.textContent = `#${this.lastRandomProof.index + 1} of ${this.lastRandomProof.poolSize}`;
            this.elements.randomnessProof.classList.remove('hidden');
        }
    }

    createConfetti() {
        this.elements.confetti.innerHTML = '';
        const colors = ['#D4AF37', '#F4E4B5', '#ffffff', '#B8960C', '#FFD700'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            this.elements.confetti.appendChild(confetti);
        }
    }

    async animateFlyingName(winnerName) {
        // Get the position of the winner announcement
        const winnerCard = this.elements.winnerAnnouncement.querySelector('.winner-card');
        const winnerRect = winnerCard.getBoundingClientRect();

        // Get the position of the sidebar toggle button
        const toggleRect = this.elements.sidebarToggle.getBoundingClientRect();

        // Create flying element
        const flyingEl = document.createElement('div');
        flyingEl.className = 'flying-name';
        flyingEl.textContent = winnerName;
        document.body.appendChild(flyingEl);

        // Start position (at winner card)
        flyingEl.style.left = (winnerRect.left + winnerRect.width / 2) + 'px';
        flyingEl.style.top = (winnerRect.top + winnerRect.height / 2) + 'px';
        flyingEl.style.transform = 'translate(-50%, -50%) scale(1)';
        flyingEl.style.opacity = '1';

        // Force reflow
        flyingEl.offsetHeight;

        // Animate to sidebar toggle
        await new Promise(resolve => {
            flyingEl.style.left = (toggleRect.left + toggleRect.width / 2) + 'px';
            flyingEl.style.top = (toggleRect.top + toggleRect.height / 2) + 'px';
            flyingEl.style.transform = 'translate(-50%, -50%) scale(0.5)';
            flyingEl.style.opacity = '0';

            setTimeout(() => {
                flyingEl.remove();
                // Flash the sidebar toggle
                this.elements.sidebarToggle.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.elements.sidebarToggle.style.transform = '';
                }, 200);
                resolve();
            }, 800);
        });
    }

    // ============================================
    // Sidebars
    // ============================================

    // Winners sidebar
    openSidebar() {
        this.elements.sidebar.classList.add('open');
        this.elements.sidebarOverlay.classList.add('visible');
    }

    closeSidebar() {
        this.elements.sidebar.classList.remove('open');
        this.elements.sidebarOverlay.classList.remove('visible');
    }

    // Voters sidebar
    openVotersSidebar() {
        this.elements.votersSidebar.classList.add('open');
        this.elements.votersOverlay.classList.add('visible');
        this.renderVotersList();
    }

    closeVotersSidebar() {
        this.elements.votersSidebar.classList.remove('open');
        this.elements.votersOverlay.classList.remove('visible');
    }

    renderVotersList() {
        const list = this.elements.votersList;
        this.elements.votersCountNumber.textContent = this.submissions.length;

        if (this.submissions.length === 0) {
            list.innerHTML = '<p class="no-voters-yet">No submissions yet</p>';
            return;
        }

        list.innerHTML = '';

        // Sort alphabetically
        const sorted = [...this.submissions].sort((a, b) =>
            a.guestName.localeCompare(b.guestName)
        );

        sorted.forEach(sub => {
            const item = document.createElement('div');
            item.className = 'voter-item';
            item.textContent = sub.guestName;
            list.appendChild(item);
        });
    }

    renderSidebar() {
        const list = this.elements.sidebarWinnersList;

        if (this.winnersData.length === 0) {
            list.innerHTML = '<p class="no-winners-yet">No winners yet</p>';
            return;
        }

        list.innerHTML = '';

        this.winnersData.forEach((winner, index) => {
            const item = document.createElement('div');
            item.className = 'sidebar-winner-item' + (winner.excluded ? '' : ' excluded');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'winner-checkbox';
            checkbox.checked = winner.excluded; // Checked = excluded from future raffles
            checkbox.id = `winner-${index}`;
            checkbox.addEventListener('change', () => this.toggleWinnerExclusion(index));

            const label = document.createElement('label');
            label.className = 'winner-name';
            label.htmlFor = `winner-${index}`;
            label.textContent = winner.name;

            const category = document.createElement('span');
            category.className = 'winner-category';
            category.textContent = winner.category;

            item.appendChild(checkbox);
            item.appendChild(label);
            item.appendChild(category);
            list.appendChild(item);
        });
    }

    toggleWinnerExclusion(index) {
        this.winnersData[index].excluded = !this.winnersData[index].excluded;
        this.saveWinnersData();
        this.renderSidebar();
        // Refresh eligible list if we're viewing a category
        if (this.currentOscarWinner) {
            this.showEligibleGuests();
        }
    }

    // ============================================
    // Persistence (localStorage)
    // ============================================

    loadWinnersData() {
        try {
            const saved = localStorage.getItem('oscar-raffle-winners-data');
            if (saved) {
                this.winnersData = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load saved winners:', e);
        }
    }

    saveWinnersData() {
        try {
            localStorage.setItem('oscar-raffle-winners-data', JSON.stringify(this.winnersData));
        } catch (e) {
            console.warn('Could not save winners:', e);
        }
    }

    loadCurrentCategoryIndex() {
        try {
            const saved = localStorage.getItem('oscar-raffle-category-index');
            if (saved) {
                this.currentCategoryIndex = parseInt(saved, 10) || 0;
            }
        } catch (e) {
            console.warn('Could not load category index:', e);
        }
    }

    saveCurrentCategoryIndex() {
        try {
            localStorage.setItem('oscar-raffle-category-index', this.currentCategoryIndex.toString());
        } catch (e) {
            console.warn('Could not save category index:', e);
        }
    }

    loadCompletedCategories() {
        try {
            const saved = localStorage.getItem('oscar-raffle-completed-categories');
            if (saved) {
                this.completedCategories = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load completed categories:', e);
        }
    }

    saveCompletedCategories() {
        try {
            localStorage.setItem('oscar-raffle-completed-categories', JSON.stringify(this.completedCategories));
        } catch (e) {
            console.warn('Could not save completed categories:', e);
        }
    }

    resetWinners() {
        if (confirm('Reset all raffle winners AND go back to first category?')) {
            // Clear all categories from Airtable
            this.categoryOrder.forEach(categoryName => {
                this.clearCategoryInAirtable(categoryName);
            });

            this.winnersData = [];
            this.completedCategories = {};
            this.currentCategoryIndex = 0;
            this.saveWinnersData();
            this.saveCompletedCategories();
            this.saveCurrentCategoryIndex();
            this.renderSidebar();
            this.buildProgressBar();
            this.showCurrentCategory();
        }
    }

    resetCurrentCategory() {
        const categoryName = this.categoryOrder[this.currentCategoryIndex];
        const completed = this.completedCategories[categoryName];

        if (!completed) return; // Nothing to reset

        if (confirm(`Reset "${categoryName}"? This will clear the Oscar winner selection and raffle winner for this category.`)) {
            // Remove raffle winner from winnersData
            const raffleWinner = completed.raffleWinner;
            if (raffleWinner) {
                const winnerIndex = this.winnersData.findIndex(w =>
                    w.name === raffleWinner && w.category === categoryName
                );
                if (winnerIndex !== -1) {
                    this.winnersData.splice(winnerIndex, 1);
                    this.saveWinnersData();
                }
            }

            // Remove from completed categories
            delete this.completedCategories[categoryName];
            this.saveCompletedCategories();

            // Clear from Airtable (async, don't wait)
            this.clearCategoryInAirtable(categoryName);

            // Reset current state
            this.currentOscarWinner = null;
            this.lastRandomProof = null;

            // Re-render
            this.renderSidebar();
            this.updateProgressBar();
            this.showCurrentCategory();

            console.log(`[RESET] Category "${categoryName}" has been reset`);
        }
    }

    async wrapUp() {
        const allCompleted = this.categoryOrder.every(cat => this.completedCategories[cat]);
        if (!allCompleted) return;

        if (!confirm('All categories complete! Save all raffle winners to Airtable?')) return;

        this.showRefreshStatus('Saving winners to Airtable...', 'pending');

        try {
            // Build updates: match each completed category to its Winners table record
            // All tables now use official Oscar category names (e.g., "Best Picture")
            const updates = [];

            for (const categoryName of this.categoryOrder) {
                const completed = this.completedCategories[categoryName];
                if (!completed) continue;

                // Map from Categories table name to Submissions field name (which is what Winners table uses)
                const submissionFieldName = getSubmissionFieldName(categoryName);

                // Find the matching Winners table record
                const winnersRecord = this.winnersTableRecords.find(
                    r => r.categoryName === submissionFieldName
                );

                if (winnersRecord) {
                    updates.push({
                        id: winnersRecord.id,
                        fields: { 'Winner': completed.raffleWinner }
                    });
                } else {
                    console.warn(`[WRAP] No Winners table record found for: ${categoryName} (looked for "${submissionFieldName}")`);
                }
            }

            // Batch update Winners table (max 10 per request)
            for (let i = 0; i < updates.length; i += 10) {
                const batch = updates.slice(i, i + 10);
                const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE_BASE_ID}/${encodeURIComponent(CONFIG.TABLES.WINNERS)}`;

                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${CONFIG.AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ records: batch })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message || response.statusText);
                }

                const result = await response.json();
                console.log(`[WRAP] Updated batch ${Math.floor(i/10) + 1}:`, result.records.map(r => r.fields['Category Name']));
            }

            console.log(`[WRAP] All ${updates.length} winners saved to Airtable!`);
            this.showRefreshStatus(`All ${updates.length} raffle winners saved to Airtable!`, 'success');
        } catch (error) {
            console.error('[WRAP] Failed to save winners:', error);
            this.showRefreshStatus('Failed to save winners: ' + error.message, 'error');
        }
    }

    async refreshData() {
        // Show spinning animation on button
        this.elements.refreshButton.classList.add('spinning');
        this.elements.refreshButton.disabled = true;

        // Show updating message
        this.showRefreshStatus('Updating...', 'pending');

        try {
            await this.loadData();
            // Rebuild progress bar with potentially new category order
            this.buildProgressBar();
            // Re-render current view with fresh data
            this.showCurrentCategory();
            console.log('Data refreshed successfully');
            this.showRefreshStatus('Data updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            this.showRefreshStatus('Update failed: ' + error.message, 'error');
        } finally {
            this.elements.refreshButton.classList.remove('spinning');
            this.elements.refreshButton.disabled = false;
        }
    }

    showRefreshStatus(message, type) {
        // Remove any existing status message
        const existing = document.querySelector('.refresh-status');
        if (existing) existing.remove();

        // Create status element
        const status = document.createElement('div');
        status.className = `refresh-status refresh-status-${type}`;
        status.textContent = message;

        // Insert into body (positioned via CSS)
        document.body.appendChild(status);

        // Auto-remove success/error messages after a delay
        if (type !== 'pending') {
            setTimeout(() => {
                status.classList.add('fade-out');
                setTimeout(() => status.remove(), 300);
            }, 3000);
        }
    }

    // ============================================
    // Event Listeners
    // ============================================

    setupEventListeners() {
        this.elements.spinButton.addEventListener('click', () => {
            this.spin(false);
        });

        this.elements.spinAgainButton.addEventListener('click', () => {
            this.spin(true);
        });

        this.elements.prevCategoryButton.addEventListener('click', () => {
            this.prevCategory();
        });

        this.elements.nextCategoryButton.addEventListener('click', () => {
            this.nextCategory();
        });

        this.elements.resetButton.addEventListener('click', () => {
            this.resetWinners();
        });

        // Reset current category
        this.elements.resetCategoryButton.addEventListener('click', () => {
            this.resetCurrentCategory();
        });

        // Refresh data
        this.elements.refreshButton.addEventListener('click', () => {
            this.refreshData();
        });

        // Winners sidebar toggle
        this.elements.sidebarToggle.addEventListener('click', () => {
            this.openSidebar();
        });

        this.elements.sidebarClose.addEventListener('click', () => {
            this.closeSidebar();
        });

        this.elements.sidebarOverlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Voters sidebar toggle
        this.elements.votersToggle.addEventListener('click', () => {
            this.openVotersSidebar();
        });

        this.elements.votersClose.addEventListener('click', () => {
            this.closeVotersSidebar();
        });

        this.elements.votersOverlay.addEventListener('click', () => {
            this.closeVotersSidebar();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.raffle = new OscarRaffle();
});
