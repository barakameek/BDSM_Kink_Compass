// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [],
        filteredKinksForDisplay: [],
        userData: {
            kinkMasterData: {}, // Stores { kinkId: { rating: '...', notes: '...' } }
            profiles: {
                // 'personal': { name: 'My Personal Atlas', kink_ids: [], isDefault: true } // Example
            },
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false,
                summaryNoteStyle: 'icon', // 'icon', 'tooltip', 'inline' (future)
                currentTheme: 'dark', // 'light' or 'dark'
                summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false },
                lastView: 'welcome-view' // To remember last view across sessions
            },
            journalEntries: [], // Array of { timestamp: Date.now(), text: '...' }
        },
        currentOpenKinkId: null,
    };

    // --- DOM ELEMENTS CACHING ---
    const DOMElements = {
        body: document.body,
        appContainer: document.getElementById('app-container'),
        mainHeader: document.getElementById('main-header'),
        mainNav: document.getElementById('main-nav'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        mainContent: document.getElementById('main-content'),
        views: document.querySelectorAll('.view'),

        welcomeView: document.getElementById('welcome-view'),
        startExploringBtn: document.getElementById('start-exploring-btn'),
        exportDataBtn: document.getElementById('export-data-btn'), // Welcome page export
        importFileInput: document.getElementById('import-file-input'), // Welcome page import
        inlineNavToSettingsBtn: document.querySelector('.inline-nav-btn[data-view-target="settings-view"]'),


        galaxyView: document.getElementById('galaxy-view'),
        kinkGalaxyViz: document.getElementById('kink-galaxy-visualization'),
        profileSelectGalaxy: document.getElementById('profile-select-galaxy'),

        kinkDetailModal: document.getElementById('kink-detail-modal'),
        modalCloseBtn: document.querySelector('#kink-detail-modal .close-modal-btn'),
        modalKinkName: document.getElementById('modal-kink-name'),
        modalKinkCategory: document.getElementById('modal-kink-category'),
        modalKinkDescriptionSummary: document.getElementById('modal-kink-description-summary'),
        modalKinkDescriptionDetailsToggle: document.getElementById('modal-kink-description-details'), // The <details> element
        modalKinkDescriptionFullContent: document.getElementById('modal-kink-description-full-content'),
        modalKinkRating: document.getElementById('modal-kink-rating'),
        modalKinkNotes: document.getElementById('modal-kink-notes'),
        saveModalBtn: document.getElementById('save-modal-btn'),
        modalProfileAssignment: document.getElementById('modal-profile-assignment'), // Container for checkboxes
        modalProfileCheckboxesContainer: document.getElementById('modal-profile-checkboxes-container'),
        modalNoProfilesNote: document.querySelector('#modal-profile-checkboxes-container .no-profiles-note'),


        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'),
        profileSelectSummary: document.getElementById('profile-select-summary'),
        toggleSummaryFiltersBtn: document.getElementById('toggle-summary-filters-btn'),
        summaryFiltersContainer: document.getElementById('summary-filters-container'),
        summaryFilterCategoryCheckboxes: document.getElementById('summary-filter-category-checkboxes'),
        summaryFilterRatingCheckboxes: document.getElementById('summary-filter-rating-checkboxes'),
        summaryFilterHasNotesCheckbox: document.getElementById('summary-filter-has-notes'),
        applySummaryFiltersBtn: document.getElementById('apply-summary-filters-btn'),
        resetSummaryFiltersBtn: document.getElementById('reset-summary-filters-btn'),

        notesPopoverModal: document.getElementById('notes-popover-modal'),
        notesPopoverKinkName: document.getElementById('notes-popover-kink-name'),
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
        deleteAllDataBtn: document.getElementById('delete-all-data-btn'), // For Application Reset
        exportDataFromDangerZoneBtn: document.getElementById('export-data-from-danger-zone'), // Inline export in reset section

        currentYearSpan: document.getElementById('current-year'),
    };

    // --- THEME MANAGEMENT ---
    function applyTheme(theme) {
        if (!DOMElements.body) return;
        DOMElements.body.classList.remove('light-theme', 'dark-theme');
        DOMElements.body.classList.add(theme + '-theme');
        if (DOMElements.themeToggleBtn) {
            DOMElements.themeToggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            DOMElements.themeToggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            DOMElements.themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
        }
        state.userData.settings.currentTheme = theme;
    }

    function toggleTheme() {
        const newTheme = state.userData.settings.currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveUserData();
    }

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found. Ensure kink-data.js is loaded before app.js.");
            alert("Critical error: Kink data not found. The application cannot start.");
            return false;
        }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink })); // Shallow copy
        return true;
    }

    function loadUserData() {
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        const defaultUserDataStructure = {
            kinkMasterData: {},
            profiles: { 'personal': { name: 'My Personal Atlas', kink_ids: [], isDefault: true } },
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false,
                summaryNoteStyle: 'icon',
                summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false },
                currentTheme: 'dark',
                lastView: 'welcome-view'
            },
            journalEntries: [],
        };

        if (savedUserData) {
            try {
                const loadedData = JSON.parse(savedUserData);
                state.userData.kinkMasterData = loadedData.kinkMasterData || defaultUserDataStructure.kinkMasterData;
                state.userData.profiles = loadedData.profiles || defaultUserDataStructure.profiles;
                state.userData.activeProfileId = loadedData.activeProfileId || defaultUserDataStructure.activeProfileId;
                state.userData.settings = { ...defaultUserDataStructure.settings, ...(loadedData.settings || {}) };
                state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : defaultUserDataStructure.journalEntries;
            } catch (e) {
                console.error("Error parsing saved user data. Reverting to defaults.", e);
                state.userData = JSON.parse(JSON.stringify(defaultUserDataStructure)); // Deep clone default
            }
        } else {
            state.userData = JSON.parse(JSON.stringify(defaultUserDataStructure)); // Deep clone default
        }

        if (!state.userData.profiles.personal || typeof state.userData.profiles.personal.kink_ids === 'undefined') {
            state.userData.profiles.personal = { name: 'My Personal Atlas', kink_ids: [], isDefault: true };
        }
        if (!state.userData.profiles[state.userData.activeProfileId]) {
            state.userData.activeProfileId = 'personal';
        }

        applyTheme(state.userData.settings.currentTheme);
        if (DOMElements.settingShowTabooKinksCheckbox) {
            DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        }
        populateProfileSelectors();
        renderExistingProfilesList();
        populateSummaryFilterControls();
    }

    function saveUserData() {
        state.userData.settings.lastView = state.currentView;
        try {
            localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
            console.log("User data saved.");
        } catch (error) {
            console.error("Error saving user data to localStorage:", error);
            if (error.name === 'QuotaExceededError') {
                alert("Could not save data: Storage quota exceeded. Please try exporting your data and clearing some space, or delete some journal entries.");
            }
        }
    }

    function getKinkUserData(kinkId) {
        return state.userData.kinkMasterData[kinkId] || { rating: null, notes: '' };
    }

    function setKinkUserData(kinkId, rating, notes) {
        if (!state.userData.kinkMasterData[kinkId]) {
            state.userData.kinkMasterData[kinkId] = { rating: null, notes: '' };
        }
        let changed = false;
        if (state.userData.kinkMasterData[kinkId].rating !== rating) {
            state.userData.kinkMasterData[kinkId].rating = rating;
            changed = true;
        }
        if (state.userData.kinkMasterData[kinkId].notes !== notes) {
            state.userData.kinkMasterData[kinkId].notes = notes;
            changed = true;
        }
        return changed;
    }

    function deleteAllUserData() {
        console.log("deleteAllUserData function called!"); // DEBUG LINE

        if (confirm("ARE YOU ABSOLUTELY SURE?\n\nThis will permanently delete ALL your Kink Atlas data from this browser (ratings, notes, profiles, journal entries, and settings).\n\nThis action CANNOT BE UNDONE.")) {
            if (confirm("SECOND CONFIRMATION (Last Chance!):\n\nReally delete everything? There is no going back from this.")) {
                try {
                    localStorage.removeItem('kinkAtlasUserData');
                    alert("All Kink Atlas data has been deleted from this browser. The application will now reload to its initial state.");
                    window.location.reload();
                } catch (error) {
                    console.error("Error deleting data from localStorage:", error);
                    alert("An error occurred while trying to delete your data. Please check the console for details.");
                }
            } else {
                alert("Data deletion cancelled (second confirmation).");
            }
        } else {
            alert("Data deletion cancelled (first confirmation).");
        }
    }


    // --- KINK FILTERING & PROFILE LOGIC ---
    function applyGlobalKinkFilters() {
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) {
            baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        }
        state.filteredKinksForDisplay = baseKinks;
    }

    function getKinksForActiveProfileView() {
        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId] || state.userData.profiles[activeProfileId]?.isDefault) {
            return state.filteredKinksForDisplay;
        } else {
            const profileKinkIds = state.userData.profiles[activeProfileId].kink_ids || [];
            return state.filteredKinksForDisplay.filter(kink => profileKinkIds.includes(kink.id));
        }
    }

    // --- PROFILE MANAGEMENT ---
    function populateProfileSelectors() {
        const selectors = [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary];
        selectors.forEach(select => {
            if (!select) return;
            const currentVal = state.userData.activeProfileId;
            select.innerHTML = '';

            const personalOption = document.createElement('option');
            personalOption.value = 'personal';
            personalOption.textContent = state.userData.profiles.personal?.name || 'My Personal Atlas';
            select.appendChild(personalOption);

            for (const profileId in state.userData.profiles) {
                if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) continue;
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    const option = document.createElement('option');
                    option.value = profileId;
                    option.textContent = profile.name;
                    select.appendChild(option);
                }
            }
            if (select.querySelector(`option[value="${currentVal}"]`)) {
                select.value = currentVal;
            } else {
                select.value = 'personal';
                state.userData.activeProfileId = 'personal';
            }
        });
    }

    function renderExistingProfilesList() {
        if (!DOMElements.existingProfilesList || !DOMElements.noCustomProfilesNoteSettings) return;
        DOMElements.existingProfilesList.innerHTML = '';
        let hasCustomProfiles = false;
        for (const profileId in state.userData.profiles) {
            if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) continue;
            const profile = state.userData.profiles[profileId];
            if (profile && profile.name) {
                hasCustomProfiles = true;
                const li = document.createElement('li'); li.dataset.profileId = profileId;
                const nameSpan = document.createElement('span'); nameSpan.textContent = profile.name; li.appendChild(nameSpan);
                const deleteBtn = document.createElement('button'); deleteBtn.classList.add('delete-profile-btn');
                deleteBtn.textContent = 'Delete'; deleteBtn.addEventListener('click', () => deleteProfile(profileId));
                li.appendChild(deleteBtn); DOMElements.existingProfilesList.appendChild(li);
            }
        }
        DOMElements.noCustomProfilesNoteSettings.style.display = hasCustomProfiles ? 'none' : 'block';
    }

    function createNewProfile() {
        if (!DOMElements.newProfileNameInput) return;
        const profileName = DOMElements.newProfileNameInput.value.trim();
        if (!profileName) { alert("Please enter a name for the new profile."); return; }
        const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (state.userData.profiles[profileId]) { alert("Profile ID error or name conflict. Try again."); return; }
        for (const pid in state.userData.profiles) {
            if (state.userData.profiles[pid].name === profileName && pid !== 'personal') {
                alert(`A profile named "${profileName}" already exists.`); return;
            }
        }
        state.userData.profiles[profileId] = { name: profileName, kink_ids: [] };
        DOMElements.newProfileNameInput.value = ''; saveUserData(); populateProfileSelectors(); renderExistingProfilesList();
        alert(`Profile "${profileName}" created!`);
    }

    function deleteProfile(profileId) {
        if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) { alert("Personal Atlas cannot be deleted."); return; }
        const profileName = state.userData.profiles[profileId]?.name || "this profile";
        if (confirm(`Delete profile "${profileName}"? This cannot be undone.`)) {
            delete state.userData.profiles[profileId];
            if (state.userData.activeProfileId === profileId) state.userData.activeProfileId = 'personal';
            saveUserData(); populateProfileSelectors(); renderExistingProfilesList();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryPage();
        }
    }
    function handleProfileSelectionChange(event) {
        state.userData.activeProfileId = event.target.value;
        if(DOMElements.profileSelectGalaxy && DOMElements.profileSelectGalaxy !== event.target) DOMElements.profileSelectGalaxy.value = state.userData.activeProfileId;
        if(DOMElements.profileSelectSummary && DOMElements.profileSelectSummary !== event.target) DOMElements.profileSelectSummary.value = state.userData.activeProfileId;
        saveUserData();
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryPage();
    }

    // --- VIEW MANAGEMENT ---
    function updateNavButtons() {
        if (!DOMElements.mainNav) return;
        const navButtons = DOMElements.mainNav.querySelectorAll('button');
        navButtons.forEach(btn => btn.classList.toggle('active-nav-btn', btn.dataset.view === state.currentView));
    }
    function switchView(viewId) {
        if (!document.getElementById(viewId)) {
            console.error(`View ID "${viewId}" not found in DOM.`);
            viewId = 'welcome-view'; // Fallback
        }
        state.currentView = viewId;
        DOMElements.views.forEach(view => view.classList.toggle('active-view', view.id === viewId));
        updateNavButtons();
        applyGlobalKinkFilters();
        if (viewId === 'galaxy-view') renderKinkGalaxy();
        else if (viewId === 'academy-view') renderAcademyIndex();
        else if (viewId === 'journal-view') renderJournalEntries();
        else if (viewId === 'summary-view') renderSummaryPage();
        else if (viewId === 'settings-view') renderExistingProfilesList();
        console.log(`Switched to view: ${viewId}`);
        window.scrollTo(0,0);
        saveUserData(); // Save current view to settings.lastView
    }

    // --- NAVIGATION (Top Nav) ---
    function setupNavigation() {
        const navItems = [
            { id: 'nav-galaxy', text: 'Galaxy', viewId: 'galaxy-view' }, { id: 'nav-summary', text: 'Summary', viewId: 'summary-view' },
            { id: 'nav-academy', text: 'Academy', viewId: 'academy-view' }, { id: 'nav-journal', text: 'Journal', viewId: 'journal-view' },
            { id: 'nav-settings', text: 'Settings', viewId: 'settings-view' },
        ];
        if (!DOMElements.mainNav) return;
        DOMElements.mainNav.innerHTML = '';
        navItems.forEach(item => {
            const button = document.createElement('button'); button.id = item.id; button.textContent = item.text; button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId)); DOMElements.mainNav.appendChild(button);
        });
    }

    // --- KINK GALAXY RENDERING (Pill Based) ---
    function renderKinkGalaxy() {
        if (!DOMElements.kinkGalaxyViz) return; DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = (typeof KINK_CATEGORIES !== 'undefined') ? KINK_CATEGORIES : {}; let galaxyHTML = '';
        const kinksToList = getKinksForActiveProfileView();
        if (kinksToList.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? (state.userData.profiles.personal?.name || "Personal Atlas") : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.kinkGalaxyViz.innerHTML = `<p class="empty-state-message">No kinks to display for "${profileName}". Try adjusting Content Preferences in Settings, rating some kinks, or adding kinks to this profile via the kink detail pop-up.</p>`; return;
        }
        const kinksByCat = {}; kinksToList.forEach(kink => { if (!kinksByCat[kink.category_id]) kinksByCat[kink.category_id] = []; kinksByCat[kink.category_id].push(kink); });
        const categoryOrder = Object.keys(categories);
        categoryOrder.forEach(categoryId => {
            const category = categories[categoryId]; const kinksInCategory = kinksByCat[categoryId];
            if (category && kinksInCategory && kinksInCategory.length > 0) {
                galaxyHTML += `<div class="galaxy-category"><h3><span class="category-icon">${category.icon || ''}</span> ${category.name}</h3><div class="kink-list">`;
                kinksInCategory.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                    const kinkUserData = getKinkUserData(kink.id); let ratingKey = kinkUserData.rating || 'none';
                    let ratingClass = `rating-${ratingKey.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`;
                    galaxyHTML += `<div class="kink-star ${ratingClass}" data-kink-id="${kink.id}">
                                    ${kink.name}
                                    ${kink.isHighRisk ? ' <span class="risk-indicator-high" title="High Risk">🔥</span>':''}
                                    ${kink.isTaboo && state.userData.settings.showTabooKinks ? ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>':''}
                                    ${kinkUserData.rating && ratingKey !== 'none' ? `<span class="kink-star-rating-badge">${formatRating(kinkUserData.rating)}</span>` : ''}
                                   </div>`;
                });
                galaxyHTML += `</div></div>`;
            }
        });
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML || `<p class="empty-state-message">No kinks match the current filters for this profile.</p>`;
        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => star.addEventListener('click', (e) => { const kinkId = e.currentTarget.dataset.kinkId; if (kinkId) openKinkDetailModal(kinkId); }));
    }
    function formatRating(ratingKey) { if (!ratingKey) return ''; return ratingKey.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');}


    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) {
        const kink = state.kinks.find(k => k.id === kinkId); if (!kink) {console.error(`Kink ${kinkId} not found`); return;}
        const kinkUserData = getKinkUserData(kinkId); state.currentOpenKinkId = kinkId;
        if(DOMElements.modalKinkName) DOMElements.modalKinkName.textContent = kink.name;
        if(DOMElements.modalKinkCategory) DOMElements.modalKinkCategory.textContent = `Category: ${(typeof KINK_CATEGORIES !== 'undefined' && KINK_CATEGORIES[kink.category_id]?.name) || 'Unknown'}`;
        if (DOMElements.modalKinkDescriptionSummary) DOMElements.modalKinkDescriptionSummary.innerHTML = kink.description_summary ? kink.description_summary.replace(/\n/g, '<br>') : (kink.description.substring(0,200) + (kink.description.length > 200 ? "..." : "")).replace(/\n/g, '<br>');
        if (DOMElements.modalKinkDescriptionFullContent) {
            let fullHTML = `<p>${kink.description.replace(/\n/g, '<br>')}</p>`;
            if(kink.safety_notes?.length) fullHTML += `<h4>⚠️ Safety Considerations:</h4><ul>${kink.safety_notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
            if(kink.common_terms?.length) fullHTML += `<h4>Common Terms:</h4><ul>${kink.common_terms.map(t=>`<li>${t}</li>`).join('')}</ul>`;
            if(kink.common_misconceptions?.length) fullHTML += `<h4>Common Misconceptions:</h4><ul>${kink.common_misconceptions.map(m=>`<li>${m}</li>`).join('')}</ul>`;
            DOMElements.modalKinkDescriptionFullContent.innerHTML = fullHTML;
        }
        if(DOMElements.modalKinkDescriptionDetailsToggle) DOMElements.modalKinkDescriptionDetailsToggle.open = false;
        if(DOMElements.modalKinkNotes) DOMElements.modalKinkNotes.value = kinkUserData.notes || '';
        const ratingOptions = { 'want_to_try': 'Want to Try', 'favorite': 'Favorite', 'like_it': 'Like It', 'curious_about': 'Curious', 'soft_limit': 'Soft Limit', 'hard_limit': 'Hard Limit', 'not_for_me': 'Not For Me', 'clear_rating': 'Clear Rating' };
        if(DOMElements.modalKinkRating) DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) {
            const btn = document.createElement('button'); btn.textContent = ratingOptions[key]; btn.dataset.ratingKey = key;
            btn.classList.add('rating-btn', `rating-btn-${key.replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`);
            if(kinkUserData.rating === key) btn.classList.add('rating-btn-active');
            btn.addEventListener('click', ()=>handleKinkRating(kinkId, key==='clear_rating'?null:key));
            if(DOMElements.modalKinkRating) DOMElements.modalKinkRating.appendChild(btn);
        }
        if (DOMElements.modalProfileCheckboxesContainer && DOMElements.modalNoProfilesNote && DOMElements.modalProfileAssignment) {
            DOMElements.modalProfileCheckboxesContainer.innerHTML = ''; let customProfileCount = 0;
            for (const profileId in state.userData.profiles) {
                if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) continue;
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    customProfileCount++; const div = document.createElement('div'); div.classList.add('profile-checkbox-item');
                    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.classList.add('visually-hidden-checkbox');
                    checkbox.id = `modal-profile-${profileId}-${kinkId}`; checkbox.dataset.profileId = profileId;
                    checkbox.checked = profile.kink_ids?.includes(kinkId);
                    const label = document.createElement('label'); label.htmlFor = checkbox.id;
                    label.classList.add('checkbox-label'); label.textContent = profile.name;
                    div.appendChild(checkbox); div.appendChild(label); DOMElements.modalProfileCheckboxesContainer.appendChild(div);
                }
            }
            DOMElements.modalNoProfilesNote.style.display = customProfileCount === 0 ? 'block' : 'none';
            DOMElements.modalProfileAssignment.style.display = customProfileCount > 0 ? 'block' : 'none';
        }
        if (DOMElements.kinkDetailModal) { DOMElements.kinkDetailModal.style.display = 'block'; DOMElements.body.classList.add('modal-open'); DOMElements.modalKinkNotes?.focus(); }
    }
    function closeKinkDetailModal(saveAndRefresh = true) {
        let dataChangedByNotesOrRating = false; let profilesChanged = false;
        if (state.currentOpenKinkId) {
            const currentKinkData = getKinkUserData(state.currentOpenKinkId); let newNotes = currentKinkData.notes;
            if (DOMElements.modalKinkNotes) newNotes = DOMElements.modalKinkNotes.value.trim();
            if (setKinkUserData(state.currentOpenKinkId, currentKinkData.rating, newNotes)) dataChangedByNotesOrRating = true;
            if (DOMElements.modalProfileCheckboxesContainer) {
                DOMElements.modalProfileCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    const profileId = cb.dataset.profileId;
                    if (state.userData.profiles[profileId]) {
                        state.userData.profiles[profileId].kink_ids = state.userData.profiles[profileId].kink_ids || [];
                        const kinkIdx = state.userData.profiles[profileId].kink_ids.indexOf(state.currentOpenKinkId);
                        if (cb.checked && kinkIdx === -1) { state.userData.profiles[profileId].kink_ids.push(state.currentOpenKinkId); profilesChanged = true; }
                        else if (!cb.checked && kinkIdx !== -1) { state.userData.profiles[profileId].kink_ids.splice(kinkIdx, 1); profilesChanged = true; }
                    }
                });
            }
        }
        if (DOMElements.kinkDetailModal) DOMElements.kinkDetailModal.style.display = 'none';
        DOMElements.body.classList.remove('modal-open'); state.currentOpenKinkId = null;
        if (saveAndRefresh && (dataChangedByNotesOrRating || profilesChanged)) saveUserData();
        if (saveAndRefresh) {
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryPage();
        }
    }
    function handleKinkRating(kinkId, ratingKey) {
        const currentKinkData = getKinkUserData(kinkId); const notes = currentKinkData.notes;
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) {
            saveUserData();
            if (state.currentView === 'galaxy-view' && DOMElements.kinkGalaxyViz) {
                const galaxyPill = DOMElements.kinkGalaxyViz.querySelector(`.kink-star[data-kink-id="${kinkId}"]`);
                if (galaxyPill) {
                    // console.log(`Updating pill for ${kinkId}. RatingKey: ${ratingKey}. Original classes:`, galaxyPill.className); // Keep for debug if needed
                    const existingRatingClasses = Array.from(galaxyPill.classList).filter(cls => cls.startsWith('rating-'));
                    existingRatingClasses.forEach(cls => galaxyPill.classList.remove(cls));
                    // console.log('Classes after removal:', galaxyPill.className); // Keep for debug if needed
                    const newRatingSlug = ratingKey ? ratingKey.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-') : 'none';
                    galaxyPill.classList.add(`rating-${newRatingSlug}`);
                    // console.log(`Trying to add: rating-${newRatingSlug}. Final classes:`, galaxyPill.className); // Keep for debug if needed
                    let badge = galaxyPill.querySelector('.kink-star-rating-badge');
                    if (ratingKey && ratingKey !== 'none') {
                        if (!badge) {
                            badge = document.createElement('span'); badge.className = 'kink-star-rating-badge';
                            const riskIndicator = galaxyPill.querySelector('.risk-indicator-high, .risk-indicator-taboo');
                            if (riskIndicator) galaxyPill.insertBefore(badge, riskIndicator.nextSibling); else galaxyPill.appendChild(badge);
                        }
                        badge.textContent = formatRating(ratingKey); badge.style.display = '';
                    } else { if (badge) badge.remove(); }
                } else { console.warn(`Galaxy pill for kinkId ${kinkId} not found for live update.`); }
            }
        }
        if (DOMElements.modalKinkRating) {
            DOMElements.modalKinkRating.querySelectorAll('button.rating-btn').forEach(btn => {
                btn.classList.remove('rating-btn-active');
                if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) btn.classList.add('rating-btn-active');
            });
        }
    }


    // --- SUMMARY PAGE ---
    function populateSummaryFilterControls() {
        if (!DOMElements.summaryFilterCategoryCheckboxes || !DOMElements.summaryFilterRatingCheckboxes || !DOMElements.summaryFilterHasNotesCheckbox) return;
        DOMElements.summaryFilterCategoryCheckboxes.innerHTML = '';
        if (typeof KINK_CATEGORIES !== 'undefined') {
            const visibleKinkCategories = new Set(state.filteredKinksForDisplay.map(k => k.category_id));
            for (const catId in KINK_CATEGORIES) {
                if (visibleKinkCategories.has(catId)) {
                    const cat = KINK_CATEGORIES[catId]; const div = document.createElement('div'); div.classList.add('filter-checkbox-item');
                    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `sum-cat-${catId}`; cb.value = catId; cb.classList.add('visually-hidden-checkbox');
                    cb.checked = state.userData.settings.summaryFilters.categories.includes(catId);
                    const lbl = document.createElement('label'); lbl.htmlFor = cb.id; lbl.classList.add('checkbox-label'); lbl.textContent = cat.name;
                    div.appendChild(cb); div.appendChild(lbl); DOMElements.summaryFilterCategoryCheckboxes.appendChild(div);
                }
            }
        }
        DOMElements.summaryFilterRatingCheckboxes.innerHTML = '';
        const ratingTypes = { 'favorite': 'Favorites', 'want_to_try': 'Want to Try',  'like_it': 'Likes', 'curious_about': 'Curiosities', 'soft_limit': 'Soft Limits', 'hard_limit': 'Hard Limits', 'not_for_me': 'Not For Me' };
        for (const rtKey in ratingTypes) {
            const div = document.createElement('div'); div.classList.add('filter-checkbox-item');
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `sum-rate-${rtKey}`; cb.value = rtKey; cb.classList.add('visually-hidden-checkbox');
            cb.checked = state.userData.settings.summaryFilters.ratingTypes.includes(rtKey);
            const lbl = document.createElement('label'); lbl.htmlFor = cb.id; lbl.classList.add('checkbox-label'); lbl.textContent = ratingTypes[rtKey];
            div.appendChild(cb); div.appendChild(lbl); DOMElements.summaryFilterRatingCheckboxes.appendChild(div);
        }
        DOMElements.summaryFilterHasNotesCheckbox.checked = state.userData.settings.summaryFilters.hasNotesOnly;
    }
    function applySummaryFiltersFromUI() {
        const selectedCategories = []; if(DOMElements.summaryFilterCategoryCheckboxes) DOMElements.summaryFilterCategoryCheckboxes.querySelectorAll('input:checked').forEach(cb => selectedCategories.push(cb.value)); state.userData.settings.summaryFilters.categories = selectedCategories;
        const selectedRatings = []; if(DOMElements.summaryFilterRatingCheckboxes) DOMElements.summaryFilterRatingCheckboxes.querySelectorAll('input:checked').forEach(cb => selectedRatings.push(cb.value)); state.userData.settings.summaryFilters.ratingTypes = selectedRatings;
        if(DOMElements.summaryFilterHasNotesCheckbox) state.userData.settings.summaryFilters.hasNotesOnly = DOMElements.summaryFilterHasNotesCheckbox.checked;
        saveUserData(); renderSummaryForActiveProfile();
    }
    function resetSummaryFilters() { state.userData.settings.summaryFilters = { categories: [], ratingTypes: [], hasNotesOnly: false }; saveUserData(); populateSummaryFilterControls(); renderSummaryForActiveProfile(); }
    function renderSummaryPage() { applyGlobalKinkFilters(); populateSummaryFilterControls(); renderSummaryForActiveProfile(); }
    function renderSummaryForActiveProfile() {
        if (!DOMElements.summaryContentArea) return; DOMElements.summaryContentArea.innerHTML = '';
        let kinksToConsider = getKinksForActiveProfileView();
        let ratedKinksForDisplay = kinksToConsider.filter(kink => getKinkUserData(kink.id).rating && getKinkUserData(kink.id).rating !== 'none');
        const filters = state.userData.settings.summaryFilters;
        if (filters.categories.length > 0) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.categories.includes(kink.category_id));
        if (filters.ratingTypes.length > 0) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.ratingTypes.includes(getKinkUserData(kink.id).rating));
        if (filters.hasNotesOnly) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => getKinkUserData(kink.id).notes?.trim() !== '');
        if (ratedKinksForDisplay.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? (state.userData.profiles.personal?.name || "Personal Atlas") : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.summaryContentArea.innerHTML = `<p class="empty-state-message">No rated kinks match filters for "${profileName}".</p>`; return;
        }
        const summaryByRating = {}; const ratingOrder = ['favorite', 'want_to_try',  'like_it', 'curious_about', 'soft_limit', 'hard_limit', 'not_for_me'];
        ratedKinksForDisplay.forEach(kinkBaseData => { const kinkUserData = getKinkUserData(kinkBaseData.id); const rating = kinkUserData.rating; if (!rating) return; if (!summaryByRating[rating]) summaryByRating[rating] = []; summaryByRating[rating].push({ ...kinkBaseData, ...kinkUserData }); });
        ratingOrder.forEach(ratingKey => {
            if (summaryByRating[ratingKey] && summaryByRating[ratingKey].length > 0) {
                const rgDetails = document.createElement('details'); rgDetails.classList.add('summary-rating-group'); rgDetails.open = true;
                const rgSummary = document.createElement('summary'); const titleText = document.createElement('span'); titleText.classList.add('accordion-title-text'); titleText.textContent = formatRating(ratingKey); rgSummary.appendChild(titleText);
                const kinkCount = document.createElement('span'); kinkCount.classList.add('accordion-kink-count'); kinkCount.textContent = `(${summaryByRating[ratingKey].length})`; rgSummary.appendChild(kinkCount);
                const arrow = document.createElement('span'); arrow.classList.add('accordion-arrow'); arrow.innerHTML = '▼'; rgSummary.appendChild(arrow); rgDetails.appendChild(rgSummary);
                rgSummary.addEventListener('click', (e) => { e.preventDefault(); rgDetails.open = !rgDetails.open; arrow.innerHTML = rgDetails.open ? '▼' : '►'; });
                const pillsList = document.createElement('div'); pillsList.classList.add('summary-kink-pills-list', 'summary-kink-list-accordion-content');
                summaryByRating[ratingKey].sort((a,b)=>a.name.localeCompare(b.name)).forEach(kink => {
                    const pill = document.createElement('div'); pill.classList.add('summary-kink-pill'); pill.dataset.kinkId = kink.id;
                    const dot = document.createElement('span'); const categoryClass = kink.category_id ? kink.category_id.replace(/[^a-z0-9_]/g, '-') : 'default'; dot.classList.add('category-dot', `category-dot-${categoryClass}`); pill.appendChild(dot);
                    const name = document.createElement('span'); name.classList.add('summary-kink-pill-name'); name.textContent = kink.name; pill.appendChild(name);
                    if (kink.notes) { const icon = document.createElement('span'); icon.classList.add('notes-indicator'); icon.innerHTML = '📝'; icon.title = "View Notes"; icon.addEventListener('click', (e) => { e.stopPropagation(); showNotesPopover(kink.id, kink.name); }); pill.appendChild(icon); }
                    pillsList.appendChild(pill);
                });
                rgDetails.appendChild(pillsList); DOMElements.summaryContentArea.appendChild(rgDetails);
            }
        });
         if(DOMElements.summaryContentArea.innerHTML === '') DOMElements.summaryContentArea.innerHTML = `<p class="empty-state-message">No kinks match the current filters.</p>`;
    }
    function showNotesPopover(kinkId, kinkName) {
        if (!DOMElements.notesPopoverModal || !DOMElements.notesPopoverContent || !DOMElements.notesPopoverKinkName) return;
        const kinkUserData = getKinkUserData(kinkId);
        DOMElements.notesPopoverKinkName.textContent = kinkName;
        DOMElements.notesPopoverContent.innerHTML = kinkUserData.notes ? kinkUserData.notes.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, '<br>') : '<em>No notes for this kink.</em>';
        DOMElements.notesPopoverModal.style.display = 'block'; DOMElements.body.classList.add('modal-open');
    }
    function closeNotesPopover() { if (DOMElements.notesPopoverModal) DOMElements.notesPopoverModal.style.display = 'none'; DOMElements.body.classList.remove('modal-open'); }


    // --- ACADEMY FUNCTIONS ---
    function renderAcademyIndex() {
        if (!DOMElements.academyContentArea) return; DOMElements.academyContentArea.innerHTML = '<h2>Knowledge Base</h2>';
        const indexList = document.createElement('ul'); indexList.classList.add('academy-index-list');
        const catHeader = document.createElement('h3'); catHeader.textContent = "Kink Categories"; indexList.appendChild(catHeader);
        if (typeof KINK_CATEGORIES !== 'undefined') {
            const categoryOrder = Object.keys(KINK_CATEGORIES);
            categoryOrder.forEach(catId => {
                const category = KINK_CATEGORIES[catId]; const kinksInCat = state.kinks.filter(k => k.category_id === catId && (state.userData.settings.showTabooKinks || !k.isTaboo));
                if (kinksInCat.length > 0) { const li = document.createElement('li'); const a = document.createElement('a'); a.href = `#academy/category/${catId}`; a.textContent = `${category.icon || ''} ${category.name}`; a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyCategory(catId); }); li.appendChild(a); indexList.appendChild(li); }
            });
        } else { indexList.appendChild(document.createElement('li')).textContent = "No categories defined."; }
        if (typeof ACADEMY_MODULES !== 'undefined' && ACADEMY_MODULES.length > 0) {
            const modHeader = document.createElement('h3'); modHeader.style.marginTop = '20px'; modHeader.textContent = "Learning Modules"; indexList.appendChild(modHeader);
            ACADEMY_MODULES.forEach(module => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = `#academy/module/${module.id}`; a.textContent = `${module.icon || ''} ${module.title}`; a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyModule(module.id); }); li.appendChild(a); indexList.appendChild(li); });
        }
        if (typeof GLOSSARY_TERMS !== 'undefined' && Object.keys(GLOSSARY_TERMS).length > 0) {
            const glossHeader = document.createElement('h3'); glossHeader.style.marginTop = '20px'; glossHeader.textContent = "Glossary"; indexList.appendChild(glossHeader);
            const glossLi = document.createElement('li'); const glossA = document.createElement('a'); glossA.href = '#academy/glossary'; glossA.textContent = "View All Terms"; glossA.addEventListener('click', (e) => { e.preventDefault(); renderGlossary(); }); glossLi.appendChild(glossA); indexList.appendChild(glossLi);
        }
        DOMElements.academyContentArea.appendChild(indexList);
    }
    function createBackButton(targetFunction, text = 'Back to Index') { const button = document.createElement('button'); button.classList.add('back-button'); button.innerHTML = `« ${text}`; button.addEventListener('click', (e) => { e.preventDefault(); if (targetFunction) targetFunction(); else renderAcademyIndex(); }); return button; }
    function renderAcademyCategory(categoryId) {
        if (!DOMElements.academyContentArea || typeof KINK_CATEGORIES === 'undefined') return; const category = KINK_CATEGORIES[categoryId]; if (!category) { DOMElements.academyContentArea.innerHTML = "<p>Category not found.</p>"; DOMElements.academyContentArea.prepend(createBackButton()); return; }
        DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        const title = document.createElement('h2'); title.innerHTML = `${category.icon || ''} ${category.name}`; DOMElements.academyContentArea.appendChild(title);
        const description = document.createElement('p'); description.innerHTML = category.description ? category.description.replace(/\n/g, "<br>") : "No description."; DOMElements.academyContentArea.appendChild(description);
        const subTitle = document.createElement('h3'); subTitle.textContent = "Kinks in this category:"; DOMElements.academyContentArea.appendChild(subTitle);
        const kinkListUl = document.createElement('ul'); kinkListUl.classList.add('academy-kink-list');
        const kinksToList = state.kinks.filter(k => k.category_id === categoryId && (state.userData.settings.showTabooKinks || !k.isTaboo)).sort((a,b) => a.name.localeCompare(b.name));
        if (kinksToList.length > 0) { kinksToList.forEach(kink => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = `#academy/kink/${kink.id}`; a.textContent = kink.name; if (kink.isHighRisk) a.innerHTML += ' <span class="risk-indicator-high" title="High Risk">🔥</span>'; if (kink.isTaboo && state.userData.settings.showTabooKinks) a.innerHTML += ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>'; a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyArticle(kink.id); }); li.appendChild(a); kinkListUl.appendChild(li); });
        } else { kinkListUl.innerHTML = "<li>No kinks to display in this category with current content settings.</li>"; } DOMElements.academyContentArea.appendChild(kinkListUl);
    }
    function renderAcademyModule(moduleId) {
        if (!DOMElements.academyContentArea || typeof ACADEMY_MODULES === 'undefined') return; const module = ACADEMY_MODULES.find(m => m.id === moduleId); if (!module) { DOMElements.academyContentArea.innerHTML = "<p>Module not found.</p>"; DOMElements.academyContentArea.prepend(createBackButton()); return; }
        DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        let contentHTML = `<h2>${module.icon || ''} ${module.title}</h2>`; module.content.forEach(item => { const textContent = item.text ? item.text.replace(/\n/g, "<br>") : ''; switch (item.type) { case 'heading': contentHTML += `<h${item.level || 3}>${textContent}</h${item.level || 3}>`; break; case 'paragraph': contentHTML += `<p>${textContent}</p>`; break; case 'list': contentHTML += `<ul>${item.items.map(liText => `<li>${liText.replace(/\n/g, "<br>")}</li>`).join('')}</ul>`; break; default: contentHTML += `<p>${textContent}</p>`; } }); DOMElements.academyContentArea.innerHTML += contentHTML;
    }
    function renderAcademyArticle(kinkId) {
        if (!DOMElements.academyContentArea) return; const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink || (!state.userData.settings.showTabooKinks && kink.isTaboo)) { DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex)); DOMElements.academyContentArea.innerHTML += `<p>Kink information not found or content preference restricts viewing.</p>`; return; }
        DOMElements.academyContentArea.innerHTML = ''; const previousCategory = (typeof KINK_CATEGORIES !== 'undefined' && KINK_CATEGORIES[kink.category_id]) ? KINK_CATEGORIES[kink.category_id] : null; DOMElements.academyContentArea.appendChild(createBackButton(previousCategory ? () => renderAcademyCategory(kink.category_id) : renderAcademyIndex, previousCategory ? `Back to ${previousCategory.name}` : 'Back to Academy Index'));
        let articleHTML = `<h2>${kink.name} ${kink.isHighRisk ? ' <span class="risk-indicator-high" title="High Risk">🔥</span>':''} ${kink.isTaboo && state.userData.settings.showTabooKinks ? ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>':''}</h2><p><strong>Category:</strong> ${previousCategory?.name || 'N/A'}</p><p>${kink.description.replace(/\n/g, "<br>")}</p>`;
        if (kink.common_terms?.length) articleHTML += `<h3>Common Terms:</h3><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
        if (kink.safety_notes?.length) articleHTML += `<h3>⚠️ Safety Considerations:</h3><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
        if (kink.common_misconceptions?.length) articleHTML += `<h3>Common Misconceptions:</h3><ul>${kink.common_misconceptions.map(con => `<li>${con}</li>`).join('')}</ul>`;
        if (kink.related_kinks_ids?.length) { articleHTML += `<h3>Related Kinks:</h3><ul>`; kink.related_kinks_ids.forEach(relId => { const relatedKink = state.kinks.find(rk => rk.id === relId); if(relatedKink && (state.userData.settings.showTabooKinks || !relatedKink.isTaboo)) articleHTML += `<li><a href="#" data-academy-link="${relatedKink.id}">${relatedKink.name}</a></li>`; }); articleHTML += `</ul>`; }
        DOMElements.academyContentArea.innerHTML += articleHTML; DOMElements.academyContentArea.querySelectorAll('a[data-academy-link]').forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); renderAcademyArticle(e.currentTarget.dataset.academyLink); }); });
    }
    function renderGlossary() {
        if (!DOMElements.academyContentArea || typeof GLOSSARY_TERMS === 'undefined') return; DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        let glossaryHTML = `<h2>Glossary of Terms</h2><dl>`; const sortedTerms = Object.keys(GLOSSARY_TERMS).sort((a, b) => GLOSSARY_TERMS[a].term.localeCompare(GLOSSARY_TERMS[b].term)); sortedTerms.forEach(key => { const termObj = GLOSSARY_TERMS[key]; glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition.replace(/\n/g, "<br>")}</dd>`; }); glossaryHTML += `</dl>`; DOMElements.academyContentArea.innerHTML += glossaryHTML;
    }

    // --- JOURNAL FUNCTIONS ---
    function renderJournalEntries() {
        if (!DOMElements.journalEntriesContainer) { console.error("Journal entries container not found."); return; } DOMElements.journalEntriesContainer.innerHTML = '';
        const promptsContainer = document.createElement('div'); promptsContainer.classList.add('journal-prompts-container'); promptsContainer.innerHTML = '<h4>Need Inspiration? Try a Prompt:</h4>'; const promptsList = document.createElement('ul');
        if (typeof JOURNAL_PROMPTS !== 'undefined' && JOURNAL_PROMPTS.length > 0) { const shuffledPrompts = [...JOURNAL_PROMPTS].sort(() => 0.5 - Math.random()); shuffledPrompts.slice(0, Math.min(5, JOURNAL_PROMPTS.length)).forEach(promptText => { const li = document.createElement('li'); const btn = document.createElement('button'); btn.classList.add('prompt-button'); btn.textContent = promptText.length > 60 ? promptText.substring(0, 57) + "..." : promptText; btn.title = promptText; btn.addEventListener('click', ()=>createNewJournalEntry(promptText)); li.appendChild(btn); promptsList.appendChild(li); });
        } else { promptsList.innerHTML = '<li>No prompts available.</li>'; } promptsContainer.appendChild(promptsList); DOMElements.journalEntriesContainer.appendChild(promptsContainer);
        if (!state.userData.journalEntries || state.userData.journalEntries.length === 0) { const noEntriesP = document.createElement('p'); noEntriesP.classList.add('empty-state-message'); noEntriesP.textContent = "No journal entries yet. Click 'New Entry' or a prompt to start!"; DOMElements.journalEntriesContainer.appendChild(noEntriesP);
        } else { state.userData.journalEntries.slice().reverse().forEach((entry, reversedArrayIndex) => { const originalIndex = state.userData.journalEntries.length - 1 - reversedArrayIndex; const entryDiv = document.createElement('div'); entryDiv.classList.add('journal-entry-item'); const safeText = entry.text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, '<br>'); entryDiv.innerHTML = `<h5>${new Date(entry.timestamp).toLocaleString()}</h5><div class="journal-entry-content">${safeText}</div><div class="journal-item-actions"><button class="btn-secondary edit-journal-entry" data-index="${originalIndex}">Edit</button><button class="btn-secondary delete-journal-entry" data-index="${originalIndex}">Delete</button></div>`; DOMElements.journalEntriesContainer.appendChild(entryDiv); }); }
        DOMElements.journalEntriesContainer.querySelectorAll('.edit-journal-entry').forEach(btn => btn.addEventListener('click', (e) => editJournalEntry(parseInt(e.target.dataset.index))));
        DOMElements.journalEntriesContainer.querySelectorAll('.delete-journal-entry').forEach(btn => btn.addEventListener('click', (e) => deleteJournalEntry(parseInt(e.target.dataset.index))));
    }
    function createNewJournalEntry(promptText = '') { const entryText = prompt("Enter your journal thoughts:", promptText); if (entryText !== null && entryText.trim() !== '') { if (!Array.isArray(state.userData.journalEntries)) state.userData.journalEntries = []; state.userData.journalEntries.push({ text: entryText.trim(), timestamp: Date.now() }); saveUserData(); renderJournalEntries(); } else if (entryText !== null) { alert("Journal entry cannot be empty."); } }
    function editJournalEntry(index) { const entry = state.userData.journalEntries[index]; if (!entry) { console.error("Attempted to edit non-existent journal entry at index:", index); return;} const newText = prompt("Edit your journal entry:", entry.text); if (newText !== null) { if (newText.trim() !== '') {state.userData.journalEntries[index].text = newText.trim(); state.userData.journalEntries[index].timestamp = Date.now(); saveUserData(); renderJournalEntries(); } else { alert("Journal entry cannot be empty. To remove it, use the Delete button.");}} }
    function deleteJournalEntry(index) { if (confirm("Are you sure you want to delete this journal entry? This action cannot be undone.")) { state.userData.journalEntries.splice(index, 1); saveUserData(); renderJournalEntries(); } }


    // --- IMPORT / EXPORT DATA ---
    function exportData() {
        try {
            const exportObject = { appVersion: DOMElements.appVersionSpan ? DOMElements.appVersionSpan.textContent : 'unknown', exportDate: new Date().toISOString(), kinkAtlasUserData: state.userData };
            const dataStr = JSON.stringify(exportObject, null, 2); const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `kink-atlas-backup-${new Date().toISOString().slice(0,10)}.json`;
            const linkElement = document.createElement('a'); linkElement.setAttribute('href', dataUri); linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement); linkElement.click(); document.body.removeChild(linkElement); alert("Your Kink Atlas data has been prepared for download.");
        } catch (error) { console.error("Error exporting data:", error); alert("Failed to export data. Check console for details."); }
    }
    function importData(event) {
        const file = event.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const fileContent = JSON.parse(e.target.result); let importedUserData;
                if (fileContent.kinkAtlasUserData && typeof fileContent.kinkAtlasUserData === 'object') { importedUserData = fileContent.kinkAtlasUserData; console.log(`Importing from backup: ${fileContent.appVersion || 'unknown'}, created: ${fileContent.exportDate || 'unknown'}`); }
                else if (fileContent.kinkMasterData && typeof fileContent.kinkMasterData === 'object') { importedUserData = fileContent; console.log("Importing older backup format."); }
                else { alert("Invalid file format. The file does not appear to be a valid Kink Atlas backup."); return; }
                if (confirm("This will overwrite your current Kink Atlas data with the contents of this file. This action cannot be undone. Are you sure you want to proceed?")) {
                    state.userData = { kinkMasterData: importedUserData.kinkMasterData || {}, profiles: importedUserData.profiles || { 'personal': { name: 'My Personal Atlas', kink_ids: [], isDefault: true } }, activeProfileId: importedUserData.activeProfileId || 'personal', settings: { showTabooKinks: importedUserData.settings?.showTabooKinks || false, summaryNoteStyle: importedUserData.settings?.summaryNoteStyle || 'icon', summaryFilters: importedUserData.settings?.summaryFilters || { categories: [], ratingTypes: [], hasNotesOnly: false }, currentTheme: importedUserData.settings?.currentTheme || 'dark', lastView: importedUserData.settings?.lastView || 'welcome-view' }, journalEntries: Array.isArray(importedUserData.journalEntries) ? importedUserData.journalEntries : [] };
                    if (!state.userData.profiles.personal) state.userData.profiles.personal = { name: 'My Personal Atlas', kink_ids: [], isDefault: true };
                    if (!state.userData.profiles[state.userData.activeProfileId]) state.userData.activeProfileId = 'personal';
                    applyTheme(state.userData.settings.currentTheme); if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
                    applyGlobalKinkFilters(); populateProfileSelectors(); renderExistingProfilesList(); populateSummaryFilterControls(); saveUserData();
                    alert("Kink Atlas data imported successfully!"); switchView(state.userData.settings.lastView || 'galaxy-view');
                }
            } catch (error) { console.error("Error importing data:", error); alert("Error processing the import file. It might be corrupted or not a valid JSON backup."); }
            finally { if(event.target) event.target.value = null; }
        };
        reader.readAsText(file);
    }


    // --- UTILITIES ---
    function updateFooterYear() { if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear(); }
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.2.2"; } // Increment as needed

    // --- SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => { e.preventDefault(); switchView(e.currentTarget.dataset.viewTarget); });
        if(DOMElements.themeToggleBtn) DOMElements.themeToggleBtn.addEventListener('click', toggleTheme);
        if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal(true));
        if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal(true));
        window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && DOMElements.kinkDetailModal.style.display === 'block' && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(true); if (DOMElements.notesPopoverModal && DOMElements.notesPopoverModal.style.display === 'block' && event.target === DOMElements.notesPopoverModal) closeNotesPopover(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape') { if (DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(true); if (DOMElements.notesPopoverModal?.style.display === 'block') closeNotesPopover(); } });
        if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => { state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyGlobalKinkFilters(); if (state.currentView === 'galaxy-view') renderKinkGalaxy(); if (state.currentView === 'summary-view') renderSummaryPage(); if (state.currentView === 'academy-view') renderAcademyIndex(); });
        if(DOMElements.createNewProfileBtn) DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
        if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.printSummaryBtn) DOMElements.printSummaryBtn.addEventListener('click', () => {
            if(DOMElements.summaryView) {
                let profileNameForCert = "Personal Exploration"; const activeProfileId = state.userData.activeProfileId;
                if (activeProfileId && activeProfileId !== 'personal' && state.userData.profiles[activeProfileId]) profileNameForCert = state.userData.profiles[activeProfileId].name;
                else if (activeProfileId === 'personal' && state.userData.profiles.personal) profileNameForCert = state.userData.profiles.personal.name;
                let nameEl = DOMElements.summaryView.querySelector('.view-header .certificate-profile-name');
                if (!nameEl) { nameEl = document.createElement('span'); nameEl.className = 'certificate-profile-name'; const titleH2 = DOMElements.summaryView.querySelector('.view-header h2.view-title-main'); if (titleH2 && titleH2.parentNode) titleH2.parentNode.insertBefore(nameEl, titleH2); else if (DOMElements.summaryView.querySelector('.view-header')) DOMElements.summaryView.querySelector('.view-header').prepend(nameEl); } nameEl.textContent = profileNameForCert;
                let footerEl = DOMElements.summaryView.querySelector('.certificate-footer');
                if (!footerEl) { footerEl = document.createElement('div'); footerEl.className = 'certificate-footer'; DOMElements.summaryView.appendChild(footerEl); }
                footerEl.innerHTML = `<span class="issued-by">Presented by Kink Atlas</span><span class="date-issued">Date of Record: ${new Date().toLocaleDateString()}</span><div class="signature-line"></div><span class="signature-title">Record of Self-Discovery</span>`;
            } window.print();
        });
        if(DOMElements.toggleSummaryFiltersBtn) DOMElements.toggleSummaryFiltersBtn.addEventListener('click', () => { if(DOMElements.summaryFiltersContainer) { const isHidden = DOMElements.summaryFiltersContainer.style.display === 'none' || !DOMElements.summaryFiltersContainer.style.display ; DOMElements.summaryFiltersContainer.style.display = isHidden ? 'block' : 'none'; DOMElements.toggleSummaryFiltersBtn.textContent = isHidden ? 'Hide Filters [-]' : 'Show Filters [+]'; DOMElements.toggleSummaryFiltersBtn.setAttribute('aria-expanded', isHidden); } });
        if(DOMElements.applySummaryFiltersBtn) DOMElements.applySummaryFiltersBtn.addEventListener('click', applySummaryFiltersFromUI);
        if(DOMElements.resetSummaryFiltersBtn) DOMElements.resetSummaryFiltersBtn.addEventListener('click', resetSummaryFilters);
        if(DOMElements.notesPopoverCloseBtn) DOMElements.notesPopoverCloseBtn.addEventListener('click', closeNotesPopover);
        if(DOMElements.exportDataBtn) DOMElements.exportDataBtn.addEventListener('click', exportData);
        if(DOMElements.importFileInput) DOMElements.importFileInput.addEventListener('change', importData);
        if(DOMElements.exportDataSettingsBtn) DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
        if(DOMElements.importFileSettingsInput) DOMElements.importFileSettingsInput.addEventListener('change', importData);
        if(DOMElements.newJournalEntryBtn) DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());

        // Listener for Application Reset Button
        if (DOMElements.deleteAllDataBtn) {
            DOMElements.deleteAllDataBtn.addEventListener('click', deleteAllUserData);
            console.log("Event listener for 'deleteAllDataBtn' attached."); // DEBUG LINE
        } else {
            console.error("'deleteAllDataBtn' not found in DOM Elements cache."); // DEBUG LINE
        }
        // Listener for inline export button in reset section
        if (DOMElements.exportDataFromDangerZoneBtn) {
            DOMElements.exportDataFromDangerZoneBtn.addEventListener('click', exportData);
            console.log("Event listener for 'exportDataFromDangerZoneBtn' attached.");
        }

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
        switchView(state.userData.settings.lastView || 'welcome-view'); // Use saved lastView

        if (DOMElements.summaryFiltersContainer) DOMElements.summaryFiltersContainer.style.display = 'none';
        if (DOMElements.toggleSummaryFiltersBtn) {
            DOMElements.toggleSummaryFiltersBtn.textContent = 'Show Filters [+]';
            DOMElements.toggleSummaryFiltersBtn.setAttribute('aria-expanded', 'false');
        }
        console.log("Kink Atlas Ready.");
    }

    init();

});
