// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], 
        filteredKinks: [], 
        userData: {
            kinkMasterData: {},
            profiles: {},
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false,
                summaryNoteStyle: 'icon' // 'icon', 'brief', 'full' - for on-screen summary
            },
            journalEntries: [],
        },
        currentOpenKinkId: null,
    };

    // --- DOM ELEMENTS CACHING ---
    const DOMElements = {
        // ... (Ensure all IDs from your HTML are correctly mapped here)
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
        modalCloseBtn: document.querySelector('.close-modal-btn'), // Corrected selector
        modalKinkName: document.getElementById('modal-kink-name'),
        modalKinkCategory: document.getElementById('modal-kink-category'),
        modalKinkDescriptionSummary: document.getElementById('modal-kink-description-summary'),
        modalKinkDescriptionDetailsToggle: document.getElementById('modal-kink-description-details'),
        modalKinkDescriptionFullContent: document.getElementById('modal-kink-description-full-content'),
        modalKinkRating: document.getElementById('modal-kink-rating'),
        modalKinkNotes: document.getElementById('modal-kink-notes'),
        saveModalBtn: document.getElementById('save-modal-btn'), // Corrected ID
        modalProfileCheckboxesContainer: document.getElementById('modal-profile-checkboxes-container'),
        modalNoProfilesNote: document.querySelector('#modal-profile-checkboxes-container .no-profiles-note'),

        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'), // Corrected ID
        profileSelectSummary: document.getElementById('profile-select-summary'),
        // summaryNoteStyleToggle: document.getElementById('summary-note-style-toggle'), // For future on-screen toggle

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
        noCustomProfilesNoteSettings: document.querySelector('#existing-profiles-list .no-custom-profiles-note'),

        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found.");
            alert("Critical error: Kink data not found.");
            return false;
        }
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
                summaryNoteStyle: loadedData.settings?.summaryNoteStyle || 'icon'
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else { // Initialize fresh state
            state.userData = {
                kinkMasterData: {}, profiles: {}, activeProfileId: 'personal',
                settings: { showTabooKinks: false, summaryNoteStyle: 'icon' },
                journalEntries: [],
            };
        }
        if (DOMElements.settingShowTabooKinksCheckbox) {
            DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        }
        // populateSummaryNoteStyleToggle(); // For future UI
        populateProfileSelectors();
        renderExistingProfilesList();
    }

    function saveUserData() {
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
    }

    function getKinkUserData(kinkId) {
        return state.userData.kinkMasterData[kinkId] || { rating: null, notes: '' };
    }

    function setKinkUserData(kinkId, rating, notes) {
        // ... (same as before)
        if (!state.userData.kinkMasterData[kinkId]) state.userData.kinkMasterData[kinkId] = {};
        let changed = false;
        if (state.userData.kinkMasterData[kinkId].rating !== rating) { state.userData.kinkMasterData[kinkId].rating = rating; changed = true; }
        if (state.userData.kinkMasterData[kinkId].notes !== notes) { state.userData.kinkMasterData[kinkId].notes = notes; changed = true; }
        return changed;
    }

    // --- KINK FILTERING & PROFILE LOGIC ---
    function applyKinkFilters() {
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) {
            baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        }
        state.filteredKinks = baseKinks;
        console.log(`Applied global filters. ${state.filteredKinks.length} kinks available for profiles.`);
    }

    function getKinksForActiveProfile() {
        // applyKinkFilters() should be called before this, typically on settings change or init
        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId]) {
            return state.filteredKinks; 
        } else {
            const profileKinkIds = state.userData.profiles[activeProfileId].kink_ids || [];
            return state.filteredKinks.filter(kink => profileKinkIds.includes(kink.id));
        }
    }

    // --- PROFILE MANAGEMENT ---
    function populateProfileSelectors() {
        // ... (same as before)
        const selectors = [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary];
        selectors.forEach(select => {
            if (!select) return;
            const currentVal = state.userData.activeProfileId; // Use state's active profile
            select.innerHTML = `<option value="personal">My Personal Atlas</option>`;
            for (const profileId in state.userData.profiles) {
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name && !profile.isDefault) { // Check isDefault to avoid double personal
                     const option = document.createElement('option');
                     option.value = profileId;
                     option.textContent = profile.name;
                     select.appendChild(option);
                }
            }
            select.value = currentVal; // Set to current active profile
        });
    }

    function renderExistingProfilesList() {
        // ... (same as before)
        if (!DOMElements.existingProfilesList || !DOMElements.noCustomProfilesNoteSettings) return;
        DOMElements.existingProfilesList.innerHTML = '';
        let hasCustomProfiles = false;
        for (const profileId in state.userData.profiles) {
            if (state.userData.profiles[profileId]?.isDefault) continue;
            const profile = state.userData.profiles[profileId];
            if (profile && profile.name) {
                hasCustomProfiles = true;
                const li = document.createElement('li');
                li.dataset.profileId = profileId;
                const nameSpan = document.createElement('span');
                nameSpan.textContent = profile.name;
                li.appendChild(nameSpan);
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-profile-btn');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteProfile(profileId));
                li.appendChild(deleteBtn);
                DOMElements.existingProfilesList.appendChild(li);
            }
        }
        DOMElements.noCustomProfilesNoteSettings.style.display = hasCustomProfiles ? 'none' : 'list-item';
    }

    function createNewProfile() {
        // ... (same as before)
        if (!DOMElements.newProfileNameInput) return;
        const profileName = DOMElements.newProfileNameInput.value.trim();
        if (!profileName) { alert("Please enter a name for the new profile."); return; }
        const profileId = `profile_${Date.now()}`;
        if (state.userData.profiles[profileId] || profileId === 'personal') { alert("Profile ID error. Try again."); return; }
        state.userData.profiles[profileId] = { name: profileName, kink_ids: [] };
        DOMElements.newProfileNameInput.value = '';
        saveUserData();
        populateProfileSelectors();
        renderExistingProfilesList();
        alert(`Profile "${profileName}" created!`);
    }

    function deleteProfile(profileId) {
        // ... (same as before)
        if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) { alert("Personal Atlas cannot be deleted."); return; }
        const profileName = state.userData.profiles[profileId]?.name || "this profile";
        if (confirm(`Delete profile "${profileName}"? This cannot be undone.`)) {
            delete state.userData.profiles[profileId];
            if (state.userData.activeProfileId === profileId) state.userData.activeProfileId = 'personal';
            saveUserData();
            populateProfileSelectors(); // Update dropdowns
            renderExistingProfilesList();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }

    function handleProfileSelectionChange(event) {
        // ... (same as before)
        state.userData.activeProfileId = event.target.value;
        [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary].forEach(sel => {
            if (sel && sel.value !== state.userData.activeProfileId) sel.value = state.userData.activeProfileId;
        });
        // saveUserData(); // Not strictly needed here as activeProfileId isn't persisted, but rather used for current session filtering
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
    }
    

    // --- VIEW MANAGEMENT ---
    function updateNavButtons() { /* ... (same as before, ensure it's defined before switchView) ... */ 
        if (!DOMElements.mainNav) return;
        const navButtons = DOMElements.mainNav.querySelectorAll('button');
        navButtons.forEach(btn => {
            btn.classList.toggle('active-nav-btn', btn.dataset.view === state.currentView);
        });
    }

    function switchView(viewId) {
        // ... (applyKinkFilters call moved to ensure it's up to date before rendering)
        if (!document.getElementById(viewId)) { console.error(`View ID "${viewId}" not found.`); return; }
        state.currentView = viewId;
        DOMElements.views.forEach(view => view.classList.toggle('active-view', view.id === viewId));
        updateNavButtons();
        applyKinkFilters(); // Crucial: apply filters before rendering views that depend on filteredKinks

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryForActiveProfile();
        if (viewId === 'settings-view') renderExistingProfilesList();

        console.log(`Switched to view: ${viewId}`);
    }

    // --- NAVIGATION ---
    function setupNavigation() { /* ... (same as before) ... */ 
        const navItems = [
            { id: 'nav-galaxy', text: 'Galaxy', viewId: 'galaxy-view' },
            { id: 'nav-summary', text: 'Summary', viewId: 'summary-view' },
            { id: 'nav-academy', text: 'Academy', viewId: 'academy-view' },
            { id: 'nav-journal', text: 'Journal', viewId: 'journal-view' },
            { id: 'nav-settings', text: 'Settings', viewId: 'settings-view' },
        ];
        DOMElements.mainNav.innerHTML = '';
        navItems.forEach(item => {
            const button = document.createElement('button');
            button.id = item.id; button.textContent = item.text; button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId));
            DOMElements.mainNav.appendChild(button);
        });
        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => { e.preventDefault(); switchView(e.target.dataset.viewTarget); });
        const h1Title = DOMElements.mainHeader?.querySelector('h1');
        if (h1Title) h1Title.addEventListener('click', () => {
            const hasRatedKinks = Object.keys(state.userData.kinkMasterData).some(id => state.userData.kinkMasterData[id]?.rating);
            switchView(hasRatedKinks ? 'galaxy-view' : 'welcome-view');
        });
    }

    // --- KINK GALAXY RENDERING ---
    function renderKinkGalaxy() { /* ... (ensure it uses getKinksForActiveProfile() and sorts kinks alphabetically within category) ... */ 
        if (!DOMElements.kinkGalaxyViz) return;
        DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = KINK_CATEGORIES;
        let galaxyHTML = '';
        const kinksToList = getKinksForActiveProfile(); // This now respects taboo AND profile selection
        
        if (kinksToList.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "the selected profile");
            DOMElements.kinkGalaxyViz.innerHTML = `<p>No kinks to display for "${profileName}". Try adjusting Content Preferences in Settings, rating kinks, or adding kinks to this profile.</p>`;
            return;
        }

        for (const categoryId in categories) {
            const category = categories[categoryId];
            const kinksInCategory = kinksToList.filter(kink => kink.category_id === categoryId);
            if (kinksInCategory.length > 0) {
                galaxyHTML += `<div class="galaxy-category"><h3>${category.icon || ''} ${category.name}</h3><div class="kink-list">`;
                kinksInCategory.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                    const kinkUserData = getKinkUserData(kink.id);
                    let ratingClass = kinkUserData.rating ? `rating-${kinkUserData.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : 'rating-none';
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
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML || `<p>No kinks match the current profile or filters.</p>`;
        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => star.addEventListener('click', (e) => {
            const kinkId = e.currentTarget.dataset.kinkId;
            if (kinkId) openKinkDetailModal(kinkId);
        }));
    }
    function formatRating(ratingKey) { /* ... (same as before) ... */ return !ratingKey ? '' : ratingKey.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');}

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) { /* ... (ensure profile checkboxes are populated correctly) ... */ 
        const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink) return;
        const kinkUserData = getKinkUserData(kinkId);
        state.currentOpenKinkId = kinkId;
        DOMElements.modalKinkName.textContent = kink.name;
        DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        if (DOMElements.modalKinkDescriptionSummary) { /* ... (populate summary) ... */ DOMElements.modalKinkDescriptionSummary.textContent = kink.description.length > 200 ? kink.description.substring(0,200) + "..." : kink.description;}
        if (DOMElements.modalKinkDescriptionFullContent) { /* ... (populate full content) ... */ 
            let fullHTML = `<p>${kink.description}</p>`;
            if(kink.safety_notes?.length) fullHTML += `<h4>⚠️ Safety Considerations:</h4><ul>${kink.safety_notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
            if(kink.common_terms?.length) fullHTML += `<h4>Common Terms:</h4><ul>${kink.common_terms.map(t=>`<li>${t}</li>`).join('')}</ul>`;
            if(kink.common_misconceptions?.length) fullHTML += `<h4>Common Misconceptions:</h4><ul>${kink.common_misconceptions.map(m=>`<li>${m}</li>`).join('')}</ul>`;
            DOMElements.modalKinkDescriptionFullContent.innerHTML = fullHTML;
        }
        if(DOMElements.modalKinkDescriptionDetailsToggle) DOMElements.modalKinkDescriptionDetailsToggle.open = false;
        DOMElements.modalKinkNotes.value = kinkUserData.notes || '';
        const ratingOptions = { /* ... as before ... */
            'want_to_try': 'Want to Try', 'favorite': 'Favorite', 'like_it': 'Like It',
            'curious_about': 'Curious', 'soft_limit': 'Soft Limit', 'hard_limit': 'Hard Limit',
            'not_for_me': 'Not For Me', 'clear_rating': 'Clear Rating'
        };
        DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) { /* ... (create rating buttons as before) ... */ 
            const btn = document.createElement('button'); btn.textContent = ratingOptions[key]; btn.dataset.ratingKey = key;
            btn.classList.add('rating-btn', `rating-btn-${key.replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`);
            if(kinkUserData.rating === key) btn.classList.add('active-rating');
            btn.addEventListener('click', ()=>handleKinkRating(kinkId, key==='clear_rating'?null:key));
            DOMElements.modalKinkRating.appendChild(btn);
        }
        // Populate Profile Assignment Checkboxes
        if (DOMElements.modalProfileCheckboxesContainer && DOMElements.modalNoProfilesNote) {
            DOMElements.modalProfileCheckboxesContainer.innerHTML = '';
            let customProfileCount = 0;
            for (const profileId in state.userData.profiles) {
                if (state.userData.profiles[profileId]?.isDefault) continue;
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    customProfileCount++;
                    const div = document.createElement('div'); div.classList.add('profile-checkbox-item');
                    const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
                    checkbox.id = `modal-profile-${profileId}-${kinkId}`; checkbox.dataset.profileId = profileId;
                    checkbox.checked = profile.kink_ids.includes(kinkId);
                    const label = document.createElement('label'); label.htmlFor = checkbox.id;
                    label.classList.add('checkbox-label'); label.textContent = profile.name;
                    div.appendChild(checkbox); div.appendChild(label);
                    DOMElements.modalProfileCheckboxesContainer.appendChild(div);
                }
            }
            DOMElements.modalNoProfilesNote.style.display = customProfileCount === 0 ? 'block' : 'none';
            DOMElements.modalProfileAssignment.style.display = customProfileCount > 0 || Object.keys(state.userData.profiles).filter(p => !state.userData.profiles[p]?.isDefault).length > 0 ? 'block' : 'none';

        }
        if (DOMElements.kinkDetailModal) { DOMElements.kinkDetailModal.style.display = 'block'; DOMElements.modalKinkNotes.focus(); }
    }

    function closeKinkDetailModal(saveAndRefresh = true) { /* ... (ensure profile assignments are saved from checkboxes) ... */ 
        let dataChangedByNotes = false; let profilesChanged = false;
        if (state.currentOpenKinkId) {
            const kinkMasterEntry = state.userData.kinkMasterData[state.currentOpenKinkId] || {};
            const newNotes = DOMElements.modalKinkNotes.value.trim();
            if (newNotes !== (kinkMasterEntry.notes || '')) {
                kinkMasterEntry.notes = newNotes; dataChangedByNotes = true;
            }
            state.userData.kinkMasterData[state.currentOpenKinkId] = kinkMasterEntry; // Ensure entry exists

            if (DOMElements.modalProfileCheckboxesContainer) {
                DOMElements.modalProfileCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    const profileId = cb.dataset.profileId;
                    if (state.userData.profiles[profileId]) {
                        const kinkIdx = state.userData.profiles[profileId].kink_ids.indexOf(state.currentOpenKinkId);
                        if (cb.checked && kinkIdx === -1) { state.userData.profiles[profileId].kink_ids.push(state.currentOpenKinkId); profilesChanged = true; }
                        else if (!cb.checked && kinkIdx !== -1) { state.userData.profiles[profileId].kink_ids.splice(kinkIdx, 1); profilesChanged = true; }
                    }
                });
            }
        }
        if (DOMElements.kinkDetailModal) DOMElements.kinkDetailModal.style.display = 'none';
        state.currentOpenKinkId = null;
        if (saveAndRefresh && (dataChangedByNotes || profilesChanged)) saveUserData(); // Only save if actual data changed
        if (saveAndRefresh) { // Always refresh relevant views if modal was open
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }
    function handleKinkRating(kinkId, ratingKey) { /* ... (same as before, ensuring saveUserData is called on change) ... */ 
        const currentKinkData = getKinkUserData(kinkId);
        const notes = currentKinkData.notes;
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) saveUserData();
        DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) btn.classList.add('active-rating');
        });
    }
    
    // --- SUMMARY PAGE ---
    function renderSummaryForActiveProfile() { /* ... (condense notes display significantly, use getKinksForActiveProfile()) ... */ 
        if (!DOMElements.summaryContentArea) return;
        DOMElements.summaryContentArea.innerHTML = '';
        const kinksForSummaryList = getKinksForActiveProfile();
        const ratedKinksForSummary = kinksForSummaryList.filter(kink => getKinkUserData(kink.id).rating);

        if (ratedKinksForSummary.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.summaryContentArea.innerHTML = `<p>No rated kinks to display for "${profileName}". Adjust Content Preferences, rate kinks, or add kinks to this profile.</p>`;
            return;
        }
        const summaryByCat = {};
        ratedKinksForSummary.forEach(kinkBaseData => {
            const kinkUserData = getKinkUserData(kinkBaseData.id); const catId = kinkBaseData.category_id;
            if (!KINK_CATEGORIES[catId]) return;
            if (!summaryByCat[catId]) summaryByCat[catId] = { name: KINK_CATEGORIES[catId].name, icon: KINK_CATEGORIES[catId].icon || "", kinks: [] };
            summaryByCat[catId].kinks.push({ ...kinkBaseData, ...kinkUserData });
        });
        for (const catId in summaryByCat) {
            const catData = summaryByCat[catId]; if(catData.kinks.length === 0) continue;
            const catBlock = document.createElement('div'); catBlock.classList.add('summary-category-block');
            const catTitle = document.createElement('h3'); catTitle.innerHTML = `${catData.icon} ${catData.name}`; catBlock.appendChild(catTitle);
            catData.kinks.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                const itemDiv = document.createElement('div'); itemDiv.classList.add('summary-kink-item');
                const nameSpan = document.createElement('span'); nameSpan.classList.add('summary-kink-name');
                nameSpan.textContent = kink.name;
                if (kink.isHighRisk) nameSpan.innerHTML += ' <span class="risk-indicator-high" title="High Risk">🔥</span>';
                const ratingSpan = document.createElement('span'); ratingSpan.classList.add('summary-kink-rating', kink.rating ? `summary-rating-${kink.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : '');
                ratingSpan.textContent = formatRating(kink.rating);
                const notesSpan = document.createElement('span'); notesSpan.classList.add('summary-kink-notes');
                if (kink.notes) {
                    if (state.userData.settings.summaryNoteStyle === 'icon') {
                        notesSpan.innerHTML = '📝 <span class="note-tooltip-text">(Hover to see notes)</span>'; // Simple icon, full notes on hover
                        notesSpan.title = kink.notes; // Full notes in tooltip
                        notesSpan.style.cursor = 'help';
                    } else if (state.userData.settings.summaryNoteStyle === 'brief' && kink.notes.length > 50) {
                        notesSpan.innerHTML = kink.notes.substring(0, 50).replace(/\n/g, '<br>') + "...";
                        notesSpan.title = kink.notes;
                    } else {
                        notesSpan.innerHTML = kink.notes.replace(/\n/g, '<br>');
                    }
                } else {
                    notesSpan.innerHTML = '<em>-</em>'; // More compact than "No notes"
                }
                itemDiv.appendChild(nameSpan); itemDiv.appendChild(ratingSpan); itemDiv.appendChild(notesSpan);
                catBlock.appendChild(itemDiv);
            });
            DOMElements.summaryContentArea.appendChild(catBlock);
        }
    }

    // --- EVENT LISTENERS (Ensure all are attached correctly) ---
    // Modal Listeners
    if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
    if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
    window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(); });
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(); });
    // Settings Listeners
    if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => {
        state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyKinkFilters();
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        if (state.currentView === 'academy-view') renderAcademyIndex(); // Re-render to show/hide taboo in potential listings
    });
    if(DOMElements.createNewProfileBtn) DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
    // Profile Selectors
    if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
    if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);
    // Print Button
    if(DOMElements.printSummaryBtn) DOMElements.printSummaryBtn.addEventListener('click', () => window.print());
    // Import/Export Buttons
    if(DOMElements.exportDataBtn) DOMElements.exportDataBtn.addEventListener('click', exportData);
    if(DOMElements.importFileInput) DOMElements.importFileInput.addEventListener('change', importData);
    if(DOMElements.exportDataSettingsBtn) DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
    if(DOMElements.importFileSettingsInput) DOMElements.importFileSettingsInput.addEventListener('change', importData);
    // Journal Button
    if(DOMElements.newJournalEntryBtn) DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());


    // --- ACADEMY & JOURNAL & IMPORT/EXPORT & UTILITIES (Full functions as in previous full app.js) ---
    // These functions are long and largely unchanged by profile/taboo logic,
    // ensure you have their complete, working versions from the last *full* app.js I provided.
    // For brevity in this diff, I'm only listing them.
    // renderAcademyIndex, createBackButton, renderAcademyCategory, renderAcademyModule, renderAcademyArticle, renderGlossary
    // renderJournalEntries, createNewJournalEntry, editJournalEntry, deleteJournalEntry
    // exportData, importData
    // updateFooterYear, updateAppVersion

    // --- INITIALIZATION ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear(); updateAppVersion();
        if (!initializeKinkData()) return;
        loadUserData();     // Loads user data and settings, populates profile selectors & taboo checkbox
        applyKinkFilters(); // Apply initial filters
        setupNavigation();
        // renderExistingProfilesList(); // Already called in loadUserData after profiles are loaded
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

});
