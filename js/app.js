// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], 
        filteredKinksForDisplay: [], 
        userData: {
            kinkMasterData: {},
            profiles: {},
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false,
                summaryNoteStyle: 'icon',
                currentTheme: 'dark',
                sidebarCollapsed: true, // Should be false if not using sidebar, or handled by CSS only
                summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false }
            },
            journalEntries: [],
        },
        currentOpenKinkId: null,
    };

    // --- DOM ELEMENTS CACHING ---
    const DOMElements = {
        body: document.body,
        appContainer: document.getElementById('app-container'),
        // Sidebar elements are removed as we reverted to top-nav
        // sidebar: document.getElementById('sidebar'), 
        // pageContentWrapper: document.getElementById('page-content-wrapper'),
        // sidebarToggleBtnHeader: document.getElementById('sidebar-toggle-btn-header'),
        // sidebarToggleBtnFooter: document.getElementById('sidebar-toggle-btn-footer'),
        // appTitleSidebar: document.getElementById('app-title-sidebar'),
        mainHeader: document.getElementById('main-header'),
        // currentViewTitleHeader: document.getElementById('current-view-title'), // No longer used with top-nav only
        mainNav: document.getElementById('main-nav'), // Back in main-header
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
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
        }
        state.userData.settings.currentTheme = theme;
    }

    function toggleTheme() {
        const newTheme = state.userData.settings.currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveUserData();
    }

    // --- SIDEBAR MANAGEMENT (No longer used with top-nav, kept for reference if re-added) ---
    // function applySidebarState(collapsed) { /* ... */ }
    // function toggleSidebar() { /* ... */ }

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() { 
        if (typeof KINK_DEFINITIONS === 'undefined') { console.error("KINK_DEFINITIONS not found."); alert("Critical error: Kink data not found."); return false; }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink }));
        return true;
    }
    function loadUserData() { 
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            const loadedData = JSON.parse(savedUserData);
            state.userData.kinkMasterData = loadedData.kinkMasterData || {};
            state.userData.profiles = loadedData.profiles || {};
            state.userData.activeProfileId = loadedData.activeProfileId || 'personal';
            state.userData.settings = { 
                showTabooKinks: loadedData.settings?.showTabooKinks || false,
                summaryNoteStyle: loadedData.settings?.summaryNoteStyle || 'icon',
                summaryFilters: loadedData.settings?.summaryFilters || { categories: [], ratingTypes: [], hasNotesOnly: false },
                currentTheme: loadedData.settings?.currentTheme || 'dark',
                sidebarCollapsed: loadedData.settings?.sidebarCollapsed || false 
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else {
            state.userData = {
                kinkMasterData: {}, profiles: {}, activeProfileId: 'personal',
                settings: { 
                    showTabooKinks: false, summaryNoteStyle: 'icon', 
                    summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false }, 
                    currentTheme: 'dark', sidebarCollapsed: false 
                },
                journalEntries: [],
            };
        }
        applyTheme(state.userData.settings.currentTheme); 
        // applySidebarState(state.userData.settings.sidebarCollapsed); // No sidebar
        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        populateProfileSelectors();
        renderExistingProfilesList();
        populateSummaryFilterControls();
    }
    function saveUserData() { 
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
    }
    function getKinkUserData(kinkId) { return state.userData.kinkMasterData[kinkId] || { rating: null, notes: '' }; }
    function setKinkUserData(kinkId, rating, notes) { 
        if (!state.userData.kinkMasterData[kinkId]) state.userData.kinkMasterData[kinkId] = {};
        let changed = false;
        if (state.userData.kinkMasterData[kinkId].rating !== rating) { state.userData.kinkMasterData[kinkId].rating = rating; changed = true; }
        if (state.userData.kinkMasterData[kinkId].notes !== notes) { state.userData.kinkMasterData[kinkId].notes = notes; changed = true; }
        return changed;
    }

    // --- KINK FILTERING & PROFILE LOGIC ---
    function applyGlobalKinkFilters() { 
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        state.filteredKinksForDisplay = baseKinks;
        console.log(`Applied global filters. ${state.filteredKinksForDisplay.length} kinks available after global filtering.`);
    }
    function getKinksForActiveProfileView() { 
        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId]) {
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
            select.innerHTML = `<option value="personal">My Personal Atlas</option>`;
            for (const profileId in state.userData.profiles) {
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name && !profile.isDefault) {
                     const option = document.createElement('option');
                     option.value = profileId; option.textContent = profile.name;
                     select.appendChild(option);
                }
            }
            if (select.querySelector(`option[value="${currentVal}"]`)) select.value = currentVal;
            else { select.value = 'personal'; state.userData.activeProfileId = 'personal';}
        });
    }
    function renderExistingProfilesList() {
        if (!DOMElements.existingProfilesList || !DOMElements.noCustomProfilesNoteSettings) return;
        DOMElements.existingProfilesList.innerHTML = ''; let hasCustomProfiles = false;
        for (const profileId in state.userData.profiles) {
            if (state.userData.profiles[profileId]?.isDefault) continue;
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
        DOMElements.noCustomProfilesNoteSettings.style.display = hasCustomProfiles ? 'none' : 'list-item';
    }
    function createNewProfile() {
        if (!DOMElements.newProfileNameInput) return;
        const profileName = DOMElements.newProfileNameInput.value.trim();
        if (!profileName) { alert("Please enter a name for the new profile."); return; }
        const profileId = `profile_${Date.now()}`;
        if (state.userData.profiles[profileId] || profileId === 'personal') { alert("Profile ID error or name conflict. Try again."); return; }
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
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryPage();
    }
    
    // --- VIEW MANAGEMENT ---
    function updateNavButtons() { 
        if (!DOMElements.mainNav) return;
        const navButtons = DOMElements.mainNav.querySelectorAll('button'); // Nav items are now buttons in top-nav
        navButtons.forEach(btn => {
            btn.classList.toggle('active-nav-btn', btn.dataset.view === state.currentView);
        });
    }
    function switchView(viewId) { 
        if (!document.getElementById(viewId)) { console.error(`View ID "${viewId}" not found.`); return; }
        state.currentView = viewId;
        DOMElements.views.forEach(view => view.classList.toggle('active-view', view.id === viewId));
        updateNavButtons(); 
        applyGlobalKinkFilters(); 

        // Removed currentViewTitleHeader logic as it's not in top-nav structure
        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryPage();
        if (viewId === 'settings-view') renderExistingProfilesList();
        console.log(`Switched to view: ${viewId}`);
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
            const button = document.createElement('button'); // Using buttons for top nav
            button.id = item.id; button.textContent = item.text; button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId)); 
            DOMElements.mainNav.appendChild(button);
        });
    }

    // --- KINK GALAXY RENDERING (Pill Based) ---
    function renderKinkGalaxy() { 
        if (!DOMElements.kinkGalaxyViz) return; 
        DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = KINK_CATEGORIES; let galaxyHTML = ''; 
        const kinksToList = getKinksForActiveProfileView();
        
        if (kinksToList.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.kinkGalaxyViz.innerHTML = `<p class="empty-state-message">No kinks to display for "${profileName}". Adjust Content Preferences, rate kinks, or add kinks to this profile.</p>`; return;
        }
        for (const categoryId in categories) {
            const category = categories[categoryId]; 
            const kinksInCategory = kinksToList.filter(kink => kink.category_id === categoryId);
            if (kinksInCategory.length > 0) {
                galaxyHTML += `<div class="galaxy-category"><h3><span class="category-icon">${category.icon || ''}</span> ${category.name}</h3><div class="kink-list">`;
                kinksInCategory.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                    const kinkUserData = getKinkUserData(kink.id);
                    let ratingClass = kinkUserData.rating ? `rating-${kinkUserData.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : 'rating-none';
                    // This is for pill display
                    galaxyHTML += `<div class="kink-star ${ratingClass}" data-kink-id="${kink.id}">
                                    ${kink.name}
                                    ${kink.isHighRisk ? ' <span class="risk-indicator-high" title="High Risk">🔥</span>':''}
                                    ${kink.isTaboo && state.userData.settings.showTabooKinks ? ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>':''}
                                    ${kinkUserData.rating ? `<span class="kink-star-rating-badge">${formatRating(kinkUserData.rating)}</span>` : ''}
                                   </div>`;
                });
                galaxyHTML += `</div></div>`;
            }
        }
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML || `<p class="empty-state-message">No kinks match filters.</p>`;
        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => star.addEventListener('click', (e) => {
            const kinkId = e.currentTarget.dataset.kinkId; if (kinkId) openKinkDetailModal(kinkId);
        }));
    }
    function formatRating(ratingKey) { return !ratingKey ? '' : ratingKey.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');}

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) { 
        const kink = state.kinks.find(k => k.id === kinkId); if (!kink) return;
        const kinkUserData = getKinkUserData(kinkId); state.currentOpenKinkId = kinkId;
        if(DOMElements.modalKinkName) DOMElements.modalKinkName.textContent = kink.name; 
        if(DOMElements.modalKinkCategory) DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        if (DOMElements.modalKinkDescriptionSummary) DOMElements.modalKinkDescriptionSummary.textContent = kink.description.length > 200 ? kink.description.substring(0,200) + "..." : kink.description;
        if (DOMElements.modalKinkDescriptionFullContent) { 
            let fullHTML = `<p>${kink.description}</p>`;
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
            if(kinkUserData.rating === key) btn.classList.add('active-rating');
            btn.addEventListener('click', ()=>handleKinkRating(kinkId, key==='clear_rating'?null:key));
            if(DOMElements.modalKinkRating) DOMElements.modalKinkRating.appendChild(btn);
        }
        if (DOMElements.modalProfileCheckboxesContainer && DOMElements.modalNoProfilesNote && DOMElements.modalProfileAssignment) {
            DOMElements.modalProfileCheckboxesContainer.innerHTML = ''; let customProfileCount = 0;
            for (const profileId in state.userData.profiles) {
                if (state.userData.profiles[profileId]?.isDefault) continue;
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    customProfileCount++; const div = document.createElement('div'); div.classList.add('profile-checkbox-item');
                    const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
                    checkbox.id = `modal-profile-${profileId}-${kinkId}`; checkbox.dataset.profileId = profileId;
                    checkbox.checked = profile.kink_ids?.includes(kinkId);
                    const label = document.createElement('label'); label.htmlFor = checkbox.id;
                    label.classList.add('checkbox-label'); label.textContent = profile.name;
                    div.appendChild(checkbox); div.appendChild(label); DOMElements.modalProfileCheckboxesContainer.appendChild(div);
                }
            }
            DOMElements.modalNoProfilesNote.style.display = customProfileCount === 0 ? 'block' : 'none';
            DOMElements.modalProfileAssignment.style.display = Object.keys(state.userData.profiles).filter(pId => !state.userData.profiles[pId]?.isDefault).length > 0 ? 'block' : 'none';
        }
        if (DOMElements.kinkDetailModal) { DOMElements.kinkDetailModal.style.display = 'block'; DOMElements.modalKinkNotes?.focus(); }
    }
    function closeKinkDetailModal(saveAndRefresh = true) { 
        let dataChangedByNotes = false; let profilesChanged = false;
        if (state.currentOpenKinkId) {
            const kinkMasterEntry = state.userData.kinkMasterData[state.currentOpenKinkId] || {rating: null, notes: ''};
            if(DOMElements.modalKinkNotes) {
                const newNotes = DOMElements.modalKinkNotes.value.trim();
                if (newNotes !== (kinkMasterEntry.notes || '')) { kinkMasterEntry.notes = newNotes; dataChangedByNotes = true; }
            }
            state.userData.kinkMasterData[state.currentOpenKinkId] = kinkMasterEntry;
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
        state.currentOpenKinkId = null;
        if (saveAndRefresh && (dataChangedByNotes || profilesChanged)) saveUserData();
        if (saveAndRefresh) {
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryPage();
        }
    }
    function handleKinkRating(kinkId, ratingKey) { 
        const currentKinkData = getKinkUserData(kinkId); const notes = currentKinkData.notes;
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) saveUserData();
        if(DOMElements.modalKinkRating) DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) btn.classList.add('active-rating');
        });
    }
    
    // --- SUMMARY PAGE ---
    function populateSummaryFilterControls() {
        if (!DOMElements.summaryFilterCategoryCheckboxes || !DOMElements.summaryFilterRatingCheckboxes || !DOMElements.summaryFilterHasNotesCheckbox) return;
        DOMElements.summaryFilterCategoryCheckboxes.innerHTML = '';
        if (typeof KINK_CATEGORIES !== 'undefined') {
            for (const catId in KINK_CATEGORIES) {
                if (state.filteredKinksForDisplay.some(k => k.category_id === catId)) {
                    const cat = KINK_CATEGORIES[catId]; const div = document.createElement('div'); div.classList.add('filter-checkbox-item');
                    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = `sum-cat-${catId}`; cb.value = catId;
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
        saveUserData(); renderSummaryForActiveProfile();
    }
    function resetSummaryFilters() {
        state.userData.settings.summaryFilters = { categories: [], ratingTypes: [], hasNotesOnly: false };
        saveUserData(); populateSummaryFilterControls(); renderSummaryForActiveProfile();
    }
    function renderSummaryPage() { populateSummaryFilterControls(); renderSummaryForActiveProfile(); }
    function renderSummaryForActiveProfile() { 
        if (!DOMElements.summaryContentArea) return; DOMElements.summaryContentArea.innerHTML = '';
        applyGlobalKinkFilters(); 
        let kinksToConsider = getKinksForActiveProfileView();
        let ratedKinksForDisplay = kinksToConsider.filter(kink => getKinkUserData(kink.id).rating);
        const filters = state.userData.settings.summaryFilters;
        if (filters.categories.length > 0) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.categories.includes(kink.category_id));
        if (filters.ratingTypes.length > 0) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => filters.ratingTypes.includes(getKinkUserData(kink.id).rating));
        if (filters.hasNotesOnly) ratedKinksForDisplay = ratedKinksForDisplay.filter(kink => getKinkUserData(kink.id).notes?.trim() !== '');

        if (ratedKinksForDisplay.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.summaryContentArea.innerHTML = `<p class="empty-state-message">No rated kinks match filters for "${profileName}".</p>`; return;
        }
        const summaryByRating = {};
        const ratingOrder = ['favorite', 'want_to_try',  'like_it', 'curious_about', 'soft_limit', 'hard_limit', 'not_for_me'];
        ratedKinksForDisplay.forEach(kinkBaseData => { 
            const kinkUserData = getKinkUserData(kinkBaseData.id); const rating = kinkUserData.rating; if (!rating) return;
            if (!summaryByRating[rating]) summaryByRating[rating] = [];
            summaryByRating[rating].push({ ...kinkBaseData, ...kinkUserData });
        });
        ratingOrder.forEach(ratingKey => {
            if (summaryByRating[ratingKey] && summaryByRating[ratingKey].length > 0) {
                const rgDetails = document.createElement('details'); 
                rgDetails.classList.add('summary-rating-group');
                rgDetails.open = true; 

                const rgSummary = document.createElement('summary');
                const titleText = document.createElement('span'); titleText.classList.add('accordion-title-text'); titleText.textContent = formatRating(ratingKey); rgSummary.appendChild(titleText);
                const kinkCount = document.createElement('span'); kinkCount.classList.add('accordion-kink-count'); kinkCount.textContent = `(${summaryByRating[ratingKey].length})`; rgSummary.appendChild(kinkCount);
                const arrow = document.createElement('span'); arrow.classList.add('accordion-arrow'); arrow.innerHTML = '▼'; rgSummary.appendChild(arrow);
                rgDetails.appendChild(rgSummary);
                rgSummary.addEventListener('click', (e) => { 
                    e.preventDefault(); // Prevent default details toggle to manage it smoothly
                    rgDetails.open = !rgDetails.open;
                    arrow.innerHTML = rgDetails.open ? '▼' : '▸';
                });

                const pillsList = document.createElement('div'); 
                pillsList.classList.add('summary-kink-pills-list', 'summary-kink-list-accordion-content');
                summaryByRating[ratingKey].sort((a,b)=>a.name.localeCompare(b.name)).forEach(kink => {
                    const pill = document.createElement('div'); pill.classList.add('summary-kink-pill'); pill.dataset.kinkId = kink.id;
                    const dot = document.createElement('span'); dot.classList.add('category-dot', `category-dot-${kink.category_id.replace(/[^a-z0-9_]/g, '-')}`); pill.appendChild(dot);
                    const name = document.createElement('span'); name.classList.add('summary-kink-pill-name'); name.textContent = kink.name; pill.appendChild(name);
                    if (kink.notes) {
                        const icon = document.createElement('span'); icon.classList.add('notes-indicator'); icon.innerHTML = '📝';
                        icon.title = "View Notes"; icon.addEventListener('click', (e) => { e.stopPropagation(); showNotesPopover(kink.id, kink.name); });
                        pill.appendChild(icon);
                    }
                    pillsList.appendChild(pill);
                });
                rgDetails.appendChild(pillsList); 
                DOMElements.summaryContentArea.appendChild(rgDetails);
            }
        });
         if(DOMElements.summaryContentArea.innerHTML === '') DOMElements.summaryContentArea.innerHTML = `<p class="empty-state-message">No kinks match the current filters.</p>`;
    }
    function showNotesPopover(kinkId, kinkName) {
        if (!DOMElements.notesPopoverModal || !DOMElements.notesPopoverContent || !DOMElements.notesPopoverKinkName) return;
        const kinkUserData = getKinkUserData(kinkId);
        DOMElements.notesPopoverKinkName.textContent = kinkName;
        DOMElements.notesPopoverContent.innerHTML = kinkUserData.notes ? kinkUserData.notes.replace(/\n/g, '<br>') : '<em>No notes for this kink.</em>';
        DOMElements.notesPopoverModal.style.display = 'block';
    }
    function closeNotesPopover() { if (DOMElements.notesPopoverModal) DOMElements.notesPopoverModal.style.display = 'none'; }

    // --- ACADEMY FUNCTIONS ---
    function renderAcademyIndex() {
        if (!DOMElements.academyContentArea) return;
        DOMElements.academyContentArea.innerHTML = '<h2>Knowledge Base</h2>';
        const indexList = document.createElement('ul'); indexList.classList.add('academy-index-list');
        const catHeader = document.createElement('h3'); catHeader.textContent = "Kink Categories"; indexList.appendChild(catHeader);
        if (typeof KINK_CATEGORIES !== 'undefined') {
            for (const catId in KINK_CATEGORIES) {
                const category = KINK_CATEGORIES[catId];
                const kinksInCat = state.kinks.filter(k => k.category_id === catId && (state.userData.settings.showTabooKinks || !k.isTaboo));
                if (kinksInCat.length > 0) {
                    const li = document.createElement('li'); const a = document.createElement('a');
                    a.href = `#academy/category/${catId}`; a.textContent = `${category.icon || ''} ${category.name}`;
                    a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyCategory(catId); });
                    li.appendChild(a); indexList.appendChild(li);
                }
            }
        }
        const modHeader = document.createElement('h3'); modHeader.style.marginTop = '20px'; modHeader.textContent = "Learning Modules"; indexList.appendChild(modHeader);
        if (typeof ACADEMY_MODULES !== 'undefined') {
            ACADEMY_MODULES.forEach(module => { 
                const li = document.createElement('li'); const a = document.createElement('a');
                a.href = `#academy/module/${module.id}`; a.textContent = `${module.icon || ''} ${module.title}`;
                a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyModule(module.id); });
                li.appendChild(a); indexList.appendChild(li);
            });
        }
        const glossHeader = document.createElement('h3'); glossHeader.style.marginTop = '20px'; glossHeader.textContent = "Glossary"; indexList.appendChild(glossHeader);
        const glossLi = document.createElement('li'); const glossA = document.createElement('a');
        glossA.href = '#academy/glossary'; glossA.textContent = "View All Terms";
        glossA.addEventListener('click', (e) => { e.preventDefault(); renderGlossary(); });
        glossLi.appendChild(glossA); indexList.appendChild(glossLi);
        DOMElements.academyContentArea.appendChild(indexList);
    }
    function createBackButton(targetFunction, text = 'Back') { const button = document.createElement('button'); button.classList.add('back-button'); button.innerHTML = `« ${text}`; button.addEventListener('click', (e) => { e.preventDefault(); if (targetFunction) targetFunction(); else renderAcademyIndex(); }); return button; }
    function renderAcademyCategory(categoryId) {
        if (!DOMElements.academyContentArea || typeof KINK_CATEGORIES === 'undefined') return;
        const category = KINK_CATEGORIES[categoryId]; if (!category) return;
        DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        const title = document.createElement('h2'); title.innerHTML = `${category.icon || ''} ${category.name}`; DOMElements.academyContentArea.appendChild(title);
        const description = document.createElement('p'); description.textContent = category.description; DOMElements.academyContentArea.appendChild(description);
        const subTitle = document.createElement('h3'); subTitle.textContent = "Kinks in this category:"; DOMElements.academyContentArea.appendChild(subTitle);
        const kinkListUl = document.createElement('ul'); kinkListUl.classList.add('academy-kink-list');
        state.kinks.filter(k => k.category_id === categoryId && (state.userData.settings.showTabooKinks || !k.isTaboo)).sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
            const li = document.createElement('li'); const a = document.createElement('a');
            a.href = `#academy/kink/${kink.id}`; a.textContent = kink.name;
            if (kink.isHighRisk) a.innerHTML += ' <span class="risk-indicator-high" title="High Risk">🔥</span>';
            if (kink.isTaboo) a.innerHTML += ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>';
            a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyArticle(kink.id); });
            li.appendChild(a); kinkListUl.appendChild(li);
        });
        if(kinkListUl.children.length === 0) kinkListUl.innerHTML = "<li>No kinks to display in this category with current content settings.</li>";
        DOMElements.academyContentArea.appendChild(kinkListUl);
    }
    function renderAcademyModule(moduleId) {
        if (!DOMElements.academyContentArea || typeof ACADEMY_MODULES === 'undefined') return;
        const module = ACADEMY_MODULES.find(m => m.id === moduleId); if (!module) return;
        DOMElements.academyContentArea.innerHTML = ''; DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        let contentHTML = `<h2>${module.icon || ''} ${module.title}</h2>`;
        module.content.forEach(item => {
            switch (item.type) {
                case 'heading': contentHTML += `<h${item.level || 3}>${item.text}</h${item.level || 3}>`; break;
                case 'paragraph': contentHTML += `<p>${item.text}</p>`; break;
                case 'list': contentHTML += `<ul>${item.items.map(liText => `<li>${liText}</li>`).join('')}</ul>`; break;
            }
        });
        DOMElements.academyContentArea.innerHTML += contentHTML; 
    }
    function renderAcademyArticle(kinkId) {
        if (!DOMElements.academyContentArea) return;
        const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink || (!state.userData.settings.showTabooKinks && kink.isTaboo)) {
            DOMElements.academyContentArea.innerHTML = ''; 
            DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex));
            DOMElements.academyContentArea.innerHTML += `<p>Kink information not found or content preference restricts viewing.</p>`; return;
        }
        DOMElements.academyContentArea.innerHTML = ''; 
        const previousCategory = KINK_CATEGORIES[kink.category_id];
        DOMElements.academyContentArea.appendChild(createBackButton(previousCategory ? () => renderAcademyCategory(kink.category_id) : renderAcademyIndex, previousCategory ? `Back to ${previousCategory.name}` : 'Back to Academy Index'));
        let articleHTML = `<h2>${kink.name} ${kink.isHighRisk ? ' <span class="risk-indicator-high" title="High Risk">🔥</span>':''} ${kink.isTaboo ? ' <span class="risk-indicator-taboo" title="Advanced/Taboo">🚫</span>':''}</h2>
            <p><strong>Category:</strong> ${KINK_CATEGORIES[kink.category_id]?.name || 'N/A'}</p>
            <p>${kink.description}</p>`;
        if (kink.common_terms?.length) articleHTML += `<h3>Common Terms:</h3><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
        if (kink.safety_notes?.length) articleHTML += `<h3>⚠️ Safety Considerations:</h3><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
        if (kink.common_misconceptions?.length) articleHTML += `<h3>Common Misconceptions:</h3><ul>${kink.common_misconceptions.map(con => `<li>${con}</li>`).join('')}</ul>`;
        if (kink.related_kinks_ids?.length) {
            articleHTML += `<h3>Related Kinks:</h3><ul>`;
            kink.related_kinks_ids.forEach(relId => {
                const relatedKink = state.kinks.find(rk => rk.id === relId);
                if(relatedKink && (state.userData.settings.showTabooKinks || !relatedKink.isTaboo)) articleHTML += `<li><a href="#" data-academy-link="${relatedKink.id}">${relatedKink.name}</a></li>`;
            });
            articleHTML += `</ul>`;
        }
        DOMElements.academyContentArea.innerHTML += articleHTML;
        DOMElements.academyContentArea.querySelectorAll('a[data-academy-link]').forEach(link => {
            link.addEventListener('click', (e) => { e.preventDefault(); renderAcademyArticle(e.target.dataset.academyLink); });
        });
    }
    function renderGlossary() {
        if (!DOMElements.academyContentArea || typeof GLOSSARY_TERMS === 'undefined') return;
        DOMElements.academyContentArea.innerHTML = ''; 
        DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        let glossaryHTML = `<h2>Glossary of Terms</h2><dl>`;
        const sortedTerms = Object.keys(GLOSSARY_TERMS).sort((a, b) => GLOSSARY_TERMS[a].term.localeCompare(GLOSSARY_TERMS[b].term));
        sortedTerms.forEach(key => { const termObj = GLOSSARY_TERMS[key]; glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition}</dd>`; });
        glossaryHTML += `</dl>`; DOMElements.academyContentArea.innerHTML += glossaryHTML;
    }

    // --- JOURNAL FUNCTIONS ---
    function renderJournalEntries() {
        if (!DOMElements.journalEntriesContainer) { console.error("Journal entries container not found."); return; }
        DOMElements.journalEntriesContainer.innerHTML = ''; 
        const promptsContainer = document.createElement('div'); promptsContainer.classList.add('journal-prompts-container');
        promptsContainer.innerHTML = '<h4>Need Inspiration? Try a Prompt:</h4>'; const promptsList = document.createElement('ul');
        if (typeof JOURNAL_PROMPTS !== 'undefined' && JOURNAL_PROMPTS.length > 0) {
            JOURNAL_PROMPTS.slice(0, 5).forEach(promptText => { 
                const li = document.createElement('li'); const btn = document.createElement('button'); btn.classList.add('prompt-button');
                btn.textContent = promptText.substring(0,50)+"..."; btn.title = promptText; btn.addEventListener('click', ()=>createNewJournalEntry(promptText));
                li.appendChild(btn); promptsList.appendChild(li);
            });
        } else { promptsList.innerHTML = '<li>No prompts available.</li>'; }
        promptsContainer.appendChild(promptsList); DOMElements.journalEntriesContainer.appendChild(promptsContainer);
        if (!state.userData.journalEntries || state.userData.journalEntries.length === 0) {
            const noEntriesP = document.createElement('p'); noEntriesP.textContent = "No journal entries yet."; DOMElements.journalEntriesContainer.appendChild(noEntriesP);
        } else {
            state.userData.journalEntries.slice().reverse().forEach((entry, arrayIndex) => { 
                const originalIndex = state.userData.journalEntries.length - 1 - arrayIndex;
                const entryDiv = document.createElement('div'); entryDiv.classList.add('journal-entry-item');
                entryDiv.innerHTML = `<h5>${new Date(entry.timestamp).toLocaleString()}</h5><div class="journal-entry-content">${entry.text.replace(/\n/g, '<br>')}</div>
                                    <div class="journal-item-actions"><button class="edit-journal-entry" data-index="${originalIndex}">Edit</button><button class="delete-journal-entry" data-index="${originalIndex}">Delete</button></div>`;
                DOMElements.journalEntriesContainer.appendChild(entryDiv);
            });
        }
        DOMElements.journalEntriesContainer.querySelectorAll('.edit-journal-entry').forEach(btn => btn.addEventListener('click', (e) => editJournalEntry(parseInt(e.target.dataset.index))));
        DOMElements.journalEntriesContainer.querySelectorAll('.delete-journal-entry').forEach(btn => btn.addEventListener('click', (e) => deleteJournalEntry(parseInt(e.target.dataset.index))));
    }
    function createNewJournalEntry(promptText = '') {
        const entryText = prompt("Enter your journal thoughts:", promptText);
        if (entryText !== null && entryText.trim() !== '') {
            if (!Array.isArray(state.userData.journalEntries)) state.userData.journalEntries = [];
            state.userData.journalEntries.push({ text: entryText.trim(), timestamp: Date.now() });
            saveUserData(); renderJournalEntries();
        }
    }
    function editJournalEntry(index) {
        const entry = state.userData.journalEntries[index]; if (!entry) return;
        const newText = prompt("Edit your journal entry:", entry.text);
        if (newText !== null) { state.userData.journalEntries[index].text = newText.trim(); state.userData.journalEntries[index].timestamp = Date.now(); saveUserData(); renderJournalEntries(); }
    }
    function deleteJournalEntry(index) {
        if (confirm("Delete this journal entry?")) { state.userData.journalEntries.splice(index, 1); saveUserData(); renderJournalEntries(); }
    }

    // --- IMPORT / EXPORT DATA ---
    function exportData() {
        try {
            const dataStr = JSON.stringify(state.userData); const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `kink-atlas-backup-${new Date().toISOString().slice(0,10)}.json`;
            const linkElement = document.createElement('a'); linkElement.setAttribute('href', dataUri); linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click(); linkElement.remove(); alert("Your Kink Atlas data has been prepared for download.");
        } catch (error) { console.error("Error exporting data:", error); alert("Failed to export data."); }
    }
    function importData(event) {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData && importedData.kinkMasterData && typeof importedData.kinkMasterData === 'object') {
                    if (confirm("Overwrite current Atlas data? This cannot be undone.")) {
                        state.userData = { 
                            kinkMasterData: importedData.kinkMasterData || {},
                            profiles: importedData.profiles || {},
                            activeProfileId: importedData.activeProfileId || 'personal',
                            settings: { 
                                showTabooKinks: importedData.settings?.showTabooKinks || false, 
                                summaryNoteStyle: importedData.settings?.summaryNoteStyle || 'icon',
                                summaryFilters: importedData.settings?.summaryFilters || { categories: [], ratingTypes: [], hasNotesOnly: false },
                                currentTheme: importedData.settings?.currentTheme || 'dark',
                                sidebarCollapsed: importedData.settings?.sidebarCollapsed || false,
                            },
                            journalEntries: Array.isArray(importedData.journalEntries) ? importedData.journalEntries : []
                        };
                        if (state.kinks.length === 0) initializeKinkData();
                        applyTheme(state.userData.settings.currentTheme); 
                        // applySidebarState(state.userData.settings.sidebarCollapsed); // No sidebar
                        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
                        applyGlobalKinkFilters(); populateProfileSelectors(); renderExistingProfilesList(); populateSummaryFilterControls(); saveUserData();
                        alert("Kink Atlas data imported successfully!"); switchView(state.currentView || 'galaxy-view');
                    }
                } else { alert("Invalid file format."); }
            } catch (error) { console.error("Error importing data:", error); alert("Error importing data file."); }
            if(event.target) event.target.value = null;
        };
        reader.readAsText(file);
    }

    // --- UTILITIES ---
    function updateFooterYear() { if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear(); }
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.9"; }

    // --- SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => { e.preventDefault(); switchView(e.target.dataset.viewTarget); });
        if(DOMElements.themeToggleBtn) DOMElements.themeToggleBtn.addEventListener('click', toggleTheme);
        // if(DOMElements.sidebarToggleBtnHeader) DOMElements.sidebarToggleBtnHeader.addEventListener('click', toggleSidebar); // No sidebar
        // if(DOMElements.sidebarToggleBtnFooter) DOMElements.sidebarToggleBtnFooter.addEventListener('click', toggleSidebar); // No sidebar
        if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
        if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
        window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && DOMElements.kinkDetailModal.style.display === 'block' && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(); });
        if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => {
            state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyGlobalKinkFilters();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryPage();
            if (state.currentView === 'academy-view') renderAcademyIndex();
        });
        if(DOMElements.createNewProfileBtn) DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
        if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.printSummaryBtn) DOMElements.printSummaryBtn.addEventListener('click', () => {
            if(DOMElements.summaryView) DOMElements.summaryView.dataset.printDate = new Date().toLocaleDateString();
            window.print();
        });
        if(DOMElements.toggleSummaryFiltersBtn) DOMElements.toggleSummaryFiltersBtn.addEventListener('click', () => {
            if(DOMElements.summaryFiltersContainer) {
                const isHidden = DOMElements.summaryFiltersContainer.style.display === 'none' || !DOMElements.summaryFiltersContainer.style.display ;
                DOMElements.summaryFiltersContainer.style.display = isHidden ? 'block' : 'none';
                DOMElements.toggleSummaryFiltersBtn.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
            }
        });
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
