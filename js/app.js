// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], 
        filteredKinksForDisplay: [], // Kinks after all filters (taboo, profile) for current view
        userData: {
            kinkMasterData: {},
            profiles: { /* Filled from localStorage or initialized */ },
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false,
                summaryNoteStyle: 'icon', // 'icon', 'brief', 'full' - for on-screen summary (future UI)
                summaryFilters: { // To store current filter selections for summary
                    categories: [], // Array of category_id strings
                    ratingTypes: [], // Array of rating_key strings
                    hasNotesOnly: false
                }
            },
            journalEntries: [],
        },
        currentOpenKinkId: null,
    };

    // --- DOM ELEMENTS CACHING ---
    const DOMElements = {
        appContainer: document.getElementById('app-container'),
        mainHeader: document.getElementById('main-header'),
        mainNav: document.getElementById('main-nav'),
        mainContent: document.getElementById('main-content'),
        views: document.querySelectorAll('.view'),
        welcomeView: document.getElementById('welcome-view'),
        startExploringBtn: document.getElementById('start-exploring-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        importFileInput: document.getElementById('import-file-input'),
        inlineNavToSettingsBtn: document.querySelector('.inline-nav-btn[data-view-target="settings-view"]'),
        galaxyView: document.getElementById('galaxy-view'),
        kinkGalaxyViz: document.getElementById('kink-galaxy-visualization'),
        profileSelectGalaxy: document.getElementById('profile-select-galaxy'),
        kinkDetailModal: document.getElementById('kink-detail-modal'),
        modalCloseBtn: document.querySelector('#kink-detail-modal .close-modal-btn'),
        modalKinkName: document.getElementById('modal-kink-name'),
        modalKinkCategory: document.getElementById('modal-kink-category'),
        modalKinkDescriptionSummary: document.getElementById('modal-kink-description-summary'),
        modalKinkDescriptionDetailsToggle: document.getElementById('modal-kink-description-details'),
        modalKinkDescriptionFullContent: document.getElementById('modal-kink-description-full-content'),
        modalKinkRating: document.getElementById('modal-kink-rating'),
        modalKinkNotes: document.getElementById('modal-kink-notes'),
        saveModalBtn: document.getElementById('save-modal-btn'),
        modalProfileAssignment: document.getElementById('modal-profile-assignment'),
        modalProfileCheckboxesContainer: document.getElementById('modal-profile-checkboxes-container'),
        modalNoProfilesNote: document.querySelector('#modal-profile-checkboxes-container .no-profiles-note'),
        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'),
        profileSelectSummary: document.getElementById('profile-select-summary'),
        summaryFiltersContainer: document.getElementById('summary-filters-container'), // For filter UI
        summaryFilterCategoryCheckboxes: document.getElementById('summary-filter-category-checkboxes'),
        summaryFilterRatingCheckboxes: document.getElementById('summary-filter-rating-checkboxes'),
        summaryFilterHasNotesCheckbox: document.getElementById('summary-filter-has-notes'),
        applySummaryFiltersBtn: document.getElementById('apply-summary-filters-btn'),
        resetSummaryFiltersBtn: document.getElementById('reset-summary-filters-btn'),
        notesPopoverModal: document.getElementById('notes-popover-modal'), // Notes popover
        notesPopoverContent: document.getElementById('notes-popover-content'),
        notesPopoverCloseBtn: document.getElementById('notes-popover-close-btn'),
        academyView: document.getElementById('academy-view'),
        academyContentArea: document.getElementById('academy-content-area'),
        journalView: document.getElementById('journal-view'),
        journalEntriesContainer: document.getElementById('journal-entries-container'),
        newJournalEntryBtn: document.getElementById('new-journal-entry-btn'),
        settingsView: document.getElementById('settings-view'),
        appVersionSpan: document.getElementById('app-version'),
        exportDataSettingsBtn: document.getElementById('export-data-settings-btn'),
        importFileSettingsInput: document.getElementById('import-file-settings-input'),
        settingShowTabooKinksCheckbox: document.getElementById('setting-show-taboo-kinks'),
        newProfileNameInput: document.getElementById('new-profile-name'),
        createNewProfileBtn: document.getElementById('create-new-profile-btn'),
        existingProfilesList: document.getElementById('existing-profiles-list'),
        noCustomProfilesNoteSettings: document.querySelector('#settings-view .no-custom-profiles-note'),
        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() { /* ... (same as previous full app.js) ... */ 
        if (typeof KINK_DEFINITIONS === 'undefined') { console.error("KINK_DEFINITIONS not found."); alert("Critical error: Kink data not found."); return false; }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink }));
        return true;
    }
    function loadUserData() { /* ... (ensure settings.summaryFilters is initialized) ... */ 
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            const loadedData = JSON.parse(savedUserData);
            state.userData.kinkMasterData = loadedData.kinkMasterData || {};
            state.userData.profiles = loadedData.profiles || {};
            state.userData.activeProfileId = loadedData.activeProfileId || 'personal';
            state.userData.settings = { 
                showTabooKinks: loadedData.settings?.showTabooKinks || false,
                summaryNoteStyle: loadedData.settings?.summaryNoteStyle || 'icon',
                summaryFilters: loadedData.settings?.summaryFilters || { categories: [], ratingTypes: [], hasNotesOnly: false }
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else {
            state.userData = {
                kinkMasterData: {}, profiles: {}, activeProfileId: 'personal',
                settings: { showTabooKinks: false, summaryNoteStyle: 'icon', summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false } },
                journalEntries: [],
            };
        }
        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        populateProfileSelectors();
        renderExistingProfilesList();
        populateSummaryFilterControls(); // Populate filter UI based on loaded settings
    }
    function saveUserData() { /* ... (same as before) ... */ 
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
    }
    function getKinkUserData(kinkId) { /* ... (same as before) ... */ return state.userData.kinkMasterData[kinkId] || { rating: null, notes: '' }; }
    function setKinkUserData(kinkId, rating, notes) { /* ... (same as before) ... */ 
        if (!state.userData.kinkMasterData[kinkId]) state.userData.kinkMasterData[kinkId] = {};
        let changed = false;
        if (state.userData.kinkMasterData[kinkId].rating !== rating) { state.userData.kinkMasterData[kinkId].rating = rating; changed = true; }
        if (state.userData.kinkMasterData[kinkId].notes !== notes) { state.userData.kinkMasterData[kinkId].notes = notes; changed = true; }
        return changed;
    }

    // --- KINK FILTERING & PROFILE LOGIC ---
    function applyGlobalKinkFilters() { // Renamed to avoid confusion
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        state.filteredKinksForDisplay = baseKinks; // This list respects taboo setting globally
        console.log(`Applied global filters. ${state.filteredKinksForDisplay.length} kinks available after global filtering.`);
    }

    function getKinksForActiveProfileView() { // Used by Galaxy and initial Summary render
        applyGlobalKinkFilters(); // Always start with globally filtered kinks
        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId]) {
            return state.filteredKinksForDisplay; 
        } else {
            const profileKinkIds = state.userData.profiles[activeProfileId].kink_ids || [];
            return state.filteredKinksForDisplay.filter(kink => profileKinkIds.includes(kink.id));
        }
    }
    
    // --- PROFILE MANAGEMENT ---
    // (populateProfileSelectors, renderExistingProfilesList, createNewProfile, deleteProfile, handleProfileSelectionChange)
    // These functions remain largely the same as the last full app.js, ensure they are complete.
    // Minor adjustment to handleProfileSelectionChange to save activeProfileId if you want it to persist sessions.
    function populateProfileSelectors() { /* ... (Full function from last complete app.js) ... */ }
    function renderExistingProfilesList() { /* ... (Full function from last complete app.js) ... */ }
    function createNewProfile() { /* ... (Full function from last complete app.js) ... */ }
    function deleteProfile(profileId) { /* ... (Full function from last complete app.js) ... */ }
    function handleProfileSelectionChange(event) { 
        state.userData.activeProfileId = event.target.value;
        // To make active profile persistent across sessions:
        // saveUserData(); // Uncomment this if desired
        [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary].forEach(sel => {
            if (sel && sel.value !== state.userData.activeProfileId) sel.value = state.userData.activeProfileId;
        });
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryPage(); // Updated call
    }

    // --- VIEW MANAGEMENT ---
    function updateNavButtons() { /* ... (Full function from last complete app.js) ... */ }
    function switchView(viewId) { /* ... (ApplyGlobalKinkFilters call is important here) ... */ 
        if (!document.getElementById(viewId)) { console.error(`View ID "${viewId}" not found.`); return; }
        state.currentView = viewId;
        DOMElements.views.forEach(view => view.classList.toggle('active-view', view.id === viewId));
        updateNavButtons(); 
        applyGlobalKinkFilters(); // Apply global filters (like taboo) before rendering any view

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryPage(); // Updated call
        if (viewId === 'settings-view') renderExistingProfilesList();
        console.log(`Switched to view: ${viewId}`);
    }

    // --- NAVIGATION ---
    function setupNavigation() { /* ... (Full function from last complete app.js) ... */ }

    // --- KINK GALAXY RENDERING ---
    function renderKinkGalaxy() { /* ... (Ensure it uses getKinksForActiveProfileView()) ... */ 
        if (!DOMElements.kinkGalaxyViz) return; 
        DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = KINK_CATEGORIES; let galaxyHTML = ''; 
        const kinksToList = getKinksForActiveProfileView(); // Uses active profile & global taboo filter
        
        if (kinksToList.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.kinkGalaxyViz.innerHTML = `<p>No kinks to display for "${profileName}". Adjust Content Preferences, rate kinks, or add kinks to this profile.</p>`; return;
        }
        // ... (Rest of the rendering logic for galaxy as in previous full app.js, ensuring correct class for rating)
        // Make sure this line correctly assigns the class for pill background color:
        // let ratingClass = kinkUserData.rating ? `rating-${kinkUserData.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : 'rating-none';
    }
    function formatRating(ratingKey) { /* ... (Full function from last complete app.js) ... */ }

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) { /* ... (Ensure profile assignment checkboxes are populated and work) ... */ }
    function closeKinkDetailModal(saveAndRefresh = true) { /* ... (Ensure profile assignments are saved from checkboxes) ... */ }
    function handleKinkRating(kinkId, ratingKey) { /* ... (Full function from last complete app.js) ... */ }
    
    // --- SUMMARY PAGE (Significant Rework) ---
    function populateSummaryFilterControls() {
        if (!DOMElements.summaryFilterCategoryCheckboxes || !DOMElements.summaryFilterRatingCheckboxes || !DOMElements.summaryFilterHasNotesCheckbox) return;
        
        // Categories
        DOMElements.summaryFilterCategoryCheckboxes.innerHTML = '';
        for (const catId in KINK_CATEGORIES) {
            if (state.filteredKinksForDisplay.some(k => k.category_id === catId)) { // Only show cats with available kinks
                const cat = KINK_CATEGORIES[catId];
                const div = document.createElement('div'); div.classList.add('filter-checkbox-item');
                const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `sum-cat-${catId}`; cb.value = catId;
                cb.checked = state.userData.settings.summaryFilters.categories.includes(catId);
                const lbl = document.createElement('label'); lbl.htmlFor = cb.id; lbl.classList.add('checkbox-label'); lbl.textContent = cat.name;
                div.appendChild(cb); div.appendChild(lbl); DOMElements.summaryFilterCategoryCheckboxes.appendChild(div);
            }
        }

        // Rating Types
        DOMElements.summaryFilterRatingCheckboxes.innerHTML = '';
        const ratingTypes = { 'want_to_try': 'Want to Try', 'favorite': 'Favorites', 'like_it': 'Likes', 'curious_about': 'Curiosities', 'soft_limit': 'Soft Limits', 'hard_limit': 'Hard Limits', 'not_for_me': 'Not For Me' };
        for (const rtKey in ratingTypes) {
            const div = document.createElement('div'); div.classList.add('filter-checkbox-item');
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `sum-rate-${rtKey}`; cb.value = rtKey;
            cb.checked = state.userData.settings.summaryFilters.ratingTypes.includes(rtKey);
            const lbl = document.createElement('label'); lbl.htmlFor = cb.id; lbl.classList.add('checkbox-label'); lbl.textContent = ratingTypes[rtKey];
            div.appendChild(cb); div.appendChild(lbl); DOMElements.summaryFilterRatingCheckboxes.appendChild(div);
        }
        DOMElements.summaryFilterHasNotesCheckbox.checked = state.userData.settings.summaryFilters.hasNotesOnly;
    }

    function applySummaryFiltersFromUI() {
        const selectedCategories = [];
        if(DOMElements.summaryFilterCategoryCheckboxes) DOMElements.summaryFilterCategoryCheckboxes.querySelectorAll('input:checked').forEach(cb => selectedCategories.push(cb.value));
        state.userData.settings.summaryFilters.categories = selectedCategories;

        const selectedRatings = [];
        if(DOMElements.summaryFilterRatingCheckboxes) DOMElements.summaryFilterRatingCheckboxes.querySelectorAll('input:checked').forEach(cb => selectedRatings.push(cb.value));
        state.userData.settings.summaryFilters.ratingTypes = selectedRatings;
        
        if(DOMElements.summaryFilterHasNotesCheckbox) state.userData.settings.summaryFilters.hasNotesOnly = DOMElements.summaryFilterHasNotesCheckbox.checked;
        
        saveUserData(); // Save filter preferences
        renderSummaryForActiveProfile(); // Re-render summary with new filters
    }
    
    function resetSummaryFilters() {
        state.userData.settings.summaryFilters = { categories: [], ratingTypes: [], hasNotesOnly: false };
        saveUserData();
        populateSummaryFilterControls(); // Update UI of filters
        renderSummaryForActiveProfile();
    }

    function renderSummaryPage() { // Main function to call for summary
        populateSummaryFilterControls();
        renderSummaryForActiveProfile();
    }

    function renderSummaryForActiveProfile() {
        if (!DOMElements.summaryContentArea) return;
        DOMElements.summaryContentArea.innerHTML = '';
        
        let kinksToConsider = getKinksForActiveProfileView(); // Kinks for active profile, respecting global taboo filter
        let ratedKinksForDisplay = kinksToConsider.filter(kink => getKinkUserData(kink.id).rating);

        // Apply summary-specific filters
        const filters = state.userData.settings.summaryFilters;
        if (filters.categories.length > 0) {
            ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.categories.includes(kink.category_id));
        }
        if (filters.ratingTypes.length > 0) {
            ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.ratingTypes.includes(getKinkUserData(kink.id).rating));
        }
        if (filters.hasNotesOnly) {
            ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => getKinkUserData(kink.id).notes?.trim() !== '');
        }

        if (ratedKinksForDisplay.length === 0) {
            DOMElements.summaryContentArea.innerHTML = `<p>No rated kinks match the current filters for this profile. Try adjusting filters or adding ratings.</p>`;
            return;
        }

        // Group by Rating Type for display
        const summaryByRating = {};
        const ratingOrder = ['favorite', 'love_it', 'want_to_try', 'like_it', 'curious_about', 'soft_limit', 'hard_limit', 'not_for_me', 'neutral']; // Define display order

        ratedKinksForDisplay.forEach(kinkBaseData => {
            const kinkUserData = getKinkUserData(kinkBaseData.id);
            const rating = kinkUserData.rating;
            if (!rating) return;

            if (!summaryByRating[rating]) {
                summaryByRating[rating] = [];
            }
            summaryByRating[rating].push({ ...kinkBaseData, ...kinkUserData });
        });

        ratingOrder.forEach(ratingKey => {
            if (summaryByRating[ratingKey] && summaryByRating[ratingKey].length > 0) {
                const ratingGroupDiv = document.createElement('div');
                ratingGroupDiv.classList.add('summary-rating-group');
                
                const groupTitle = document.createElement('h3');
                groupTitle.textContent = formatRating(ratingKey); // e.g., "Want To Try"
                ratingGroupDiv.appendChild(groupTitle);

                const pillsListDiv = document.createElement('div');
                pillsListDiv.classList.add('summary-kink-pills-list');

                summaryByRating[ratingKey].sort((a,b)=>a.name.localeCompare(b.name)).forEach(kink => {
                    const pillDiv = document.createElement('div');
                    pillDiv.classList.add('summary-kink-pill');
                    pillDiv.dataset.kinkId = kink.id; // For notes popover

                    const catDot = document.createElement('span');
                    catDot.classList.add('category-dot', `category-dot-${kink.category_id.replace(/[^a-z0-9_]/g, '-')}`);
                    pillDiv.appendChild(catDot);

                    const nameSpan = document.createElement('span');
                    nameSpan.classList.add('summary-kink-pill-name');
                    nameSpan.textContent = kink.name;
                    pillDiv.appendChild(nameSpan);

                    if (kink.notes) {
                        const notesIcon = document.createElement('span');
                        notesIcon.classList.add('notes-indicator');
                        notesIcon.innerHTML = '📝';
                        notesIcon.title = "View Notes";
                        notesIcon.addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent pill click if different
                            showNotesPopover(kink.id, kink.name);
                        });
                        pillDiv.appendChild(notesIcon);
                    }
                    pillsListDiv.appendChild(pillDiv);
                });
                ratingGroupDiv.appendChild(pillsListDiv);
                DOMElements.summaryContentArea.appendChild(ratingGroupDiv);
            }
        });
         if(DOMElements.summaryContentArea.innerHTML === '') { // If after all grouping, still empty
            DOMElements.summaryContentArea.innerHTML = `<p>No kinks match the current filters.</p>`;
        }
    }

    function showNotesPopover(kinkId, kinkName) {
        if (!DOMElements.notesPopoverModal || !DOMElements.notesPopoverContent) return;
        const kinkUserData = getKinkUserData(kinkId);
        const popoverTitle = DOMElements.notesPopoverModal.querySelector('h4');
        if(popoverTitle) popoverTitle.textContent = `Notes for: ${kinkName}`;
        DOMElements.notesPopoverContent.innerHTML = kinkUserData.notes ? kinkUserData.notes.replace(/\n/g, '<br>') : '<em>No notes for this kink.</em>';
        DOMElements.notesPopoverModal.style.display = 'block';
    }

    function closeNotesPopover() {
        if (DOMElements.notesPopoverModal) DOMElements.notesPopoverModal.style.display = 'none';
    }


    // --- ACADEMY & JOURNAL & IMPORT/EXPORT & UTILITIES (Paste FULL working functions here) ---
    function renderAcademyIndex() { /* ... PASTE FULL FUNCTION ... */ }
    function createBackButton(targetFunction, text = 'Back') { /* ... PASTE FULL FUNCTION ... */ }
    function renderAcademyCategory(categoryId) { /* ... PASTE FULL FUNCTION ... */ }
    function renderAcademyModule(moduleId) { /* ... PASTE FULL FUNCTION ... */ }
    function renderAcademyArticle(kinkId) { /* ... PASTE FULL FUNCTION ... */ }
    function renderGlossary() { /* ... PASTE FULL FUNCTION ... */ }
    function renderJournalEntries() { /* ... PASTE FULL FUNCTION ... */ }
    function createNewJournalEntry(promptText = '') { /* ... PASTE FULL FUNCTION ... */ }
    function editJournalEntry(index) { /* ... PASTE FULL FUNCTION ... */ }
    function deleteJournalEntry(index) { /* ... PASTE FULL FUNCTION ... */ }
    function exportData() { /* ... PASTE FULL FUNCTION ... */ }
    function importData(event) { /* ... PASTE FULL FUNCTION ... */ }
    function updateFooterYear() { if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear(); }
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.7"; } // Incremented

    // --- SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => { e.preventDefault(); switchView(e.target.dataset.viewTarget); });
        if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
        if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
        window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(); });
        
        if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => {
            state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyGlobalKinkFilters();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
            if (state.currentView === 'academy-view') renderAcademyIndex();
        });
        // if(DOMElements.settingSummaryNoteStyleSelect) DOMElements.settingSummaryNoteStyleSelect.addEventListener('change', (e) => { /* ... update setting ... */ });

        if(DOMElements.createNewProfileBtn) DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
        if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.printSummaryBtn) DOMElements.printSummaryBtn.addEventListener('click', () => window.print());
        
        if(DOMElements.applySummaryFiltersBtn) DOMElements.applySummaryFiltersBtn.addEventListener('click', applySummaryFiltersFromUI);
        if(DOMElements.resetSummaryFiltersBtn) DOMElements.resetSummaryFiltersBtn.addEventListener('click', resetSummaryFilters);
        if(DOMElements.notesPopoverCloseBtn) DOMElements.notesPopoverCloseBtn.addEventListener('click', closeNotesPopover);

        if(DOMElements.exportDataBtn) DOMElements.exportDataBtn.addEventListener('click', exportData);
        if(DOMElements.importFileInput) DOMElements.importFileInput.addEventListener('change', importData);
        if(DOMElements.exportDataSettingsBtn) DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
        if(DOMElements.importFileSettingsInput) DOMElements.importFileSettingsInput.addEventListener('change', importData);
        if(DOMElements.newJournalEntryBtn) DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());
        setupNavigation(); 
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear(); updateAppVersion();
        if (!initializeKinkData()) return;
        loadUserData();     
        applyGlobalKinkFilters(); 
        setupEventListeners(); 
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

});
