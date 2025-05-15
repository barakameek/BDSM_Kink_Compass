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
                summaryNoteStyle: 'icon' 
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
        modalCloseBtn: document.querySelector('.close-modal-btn'),
        modalKinkName: document.getElementById('modal-kink-name'),
        modalKinkCategory: document.getElementById('modal-kink-category'),
        modalKinkDescriptionSummary: document.getElementById('modal-kink-description-summary'),
        modalKinkDescriptionDetailsToggle: document.getElementById('modal-kink-description-details'),
        modalKinkDescriptionFullContent: document.getElementById('modal-kink-description-full-content'),
        modalKinkRating: document.getElementById('modal-kink-rating'),
        modalKinkNotes: document.getElementById('modal-kink-notes'),
        saveModalBtn: document.getElementById('save-modal-btn'),
        modalProfileCheckboxesContainer: document.getElementById('modal-profile-checkboxes-container'),
        modalNoProfilesNote: document.querySelector('#modal-profile-checkboxes-container .no-profiles-note'),
        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'),
        profileSelectSummary: document.getElementById('profile-select-summary'),
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

    // --- ALL FUNCTION DEFINITIONS ---
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
                summaryNoteStyle: loadedData.settings?.summaryNoteStyle || 'icon'
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else {
            state.userData = {
                kinkMasterData: {}, profiles: {}, activeProfileId: 'personal',
                settings: { showTabooKinks: false, summaryNoteStyle: 'icon' },
                journalEntries: [],
            };
        }
        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        populateProfileSelectors();
        renderExistingProfilesList();
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

    function applyKinkFilters() {
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        state.filteredKinks = baseKinks;
        console.log(`Applied global filters. ${state.filteredKinks.length} kinks available for profiles.`);
    }

    function getKinksForActiveProfile() {
        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId]) {
            return state.filteredKinks; 
        } else {
            const profileKinkIds = state.userData.profiles[activeProfileId].kink_ids || [];
            return state.filteredKinks.filter(kink => profileKinkIds.includes(kink.id));
        }
    }

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
            select.value = currentVal;
        });
    }

    function renderExistingProfilesList() {
        if (!DOMElements.existingProfilesList || !DOMElements.noCustomProfilesNoteSettings) return;
        DOMElements.existingProfilesList.innerHTML = '';
        let hasCustomProfiles = false;
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
        if (state.userData.profiles[profileId] || profileId === 'personal') { alert("Profile ID error. Try again."); return; }
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
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }

    function handleProfileSelectionChange(event) {
        state.userData.activeProfileId = event.target.value;
        [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary].forEach(sel => {
            if (sel && sel.value !== state.userData.activeProfileId) sel.value = state.userData.activeProfileId;
        });
        // No need to saveUserData() for activeProfileId as it's session-specific display, not persistent data change
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
    }
    
    function updateNavButtons() { 
        if (!DOMElements.mainNav) return;
        const navButtons = DOMElements.mainNav.querySelectorAll('button');
        navButtons.forEach(btn => btn.classList.toggle('active-nav-btn', btn.dataset.view === state.currentView));
    }

    function switchView(viewId) {
        if (!document.getElementById(viewId)) { console.error(`View ID "${viewId}" not found.`); return; }
        state.currentView = viewId;
        DOMElements.views.forEach(view => view.classList.toggle('active-view', view.id === viewId));
        updateNavButtons(); // This call is now safe
        applyKinkFilters(); // Apply filters before rendering

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryForActiveProfile();
        if (viewId === 'settings-view') renderExistingProfilesList();
        console.log(`Switched to view: ${viewId}`);
    }

    function setupNavigation() { 
        const navItems = [ /* ... as before ... */ 
            { id: 'nav-galaxy', text: 'Galaxy', viewId: 'galaxy-view' },
            { id: 'nav-summary', text: 'Summary', viewId: 'summary-view' },
            { id: 'nav-academy', text: 'Academy', viewId: 'academy-view' },
            { id: 'nav-journal', text: 'Journal', viewId: 'journal-view' },
            { id: 'nav-settings', text: 'Settings', viewId: 'settings-view' },
        ];
        DOMElements.mainNav.innerHTML = '';
        navItems.forEach(item => {
            const button = document.createElement('button'); button.id = item.id; button.textContent = item.text; button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId)); DOMElements.mainNav.appendChild(button);
        });
    }

    function renderKinkGalaxy() { 
        if (!DOMElements.kinkGalaxyViz) return;
        DOMElements.kinkGalaxyViz.innerHTML = ''; const categories = KINK_CATEGORIES; let galaxyHTML = '';
        const kinksToList = getKinksForActiveProfile();
        if (kinksToList.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.kinkGalaxyViz.innerHTML = `<p>No kinks to display for "${profileName}". Adjust Content Preferences, rate kinks, or add kinks to this profile via the Kink Detail pop-up when viewing your Personal Atlas.</p>`; return;
        }
        for (const categoryId in categories) {
            const category = categories[categoryId]; const kinksInCategory = kinksToList.filter(kink => kink.category_id === categoryId);
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
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML || `<p>No kinks match filters.</p>`;
        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => star.addEventListener('click', (e) => {
            const kinkId = e.currentTarget.dataset.kinkId; if (kinkId) openKinkDetailModal(kinkId);
        }));
    }
    function formatRating(ratingKey) { return !ratingKey ? '' : ratingKey.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');}

    function openKinkDetailModal(kinkId) { 
        const kink = state.kinks.find(k => k.id === kinkId); if (!kink) return;
        const kinkUserData = getKinkUserData(kinkId); state.currentOpenKinkId = kinkId;
        DOMElements.modalKinkName.textContent = kink.name; DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        if (DOMElements.modalKinkDescriptionSummary) DOMElements.modalKinkDescriptionSummary.textContent = kink.description.length > 200 ? kink.description.substring(0,200) + "..." : kink.description;
        if (DOMElements.modalKinkDescriptionFullContent) { 
            let fullHTML = `<p>${kink.description}</p>`;
            if(kink.safety_notes?.length) fullHTML += `<h4>⚠️ Safety Considerations:</h4><ul>${kink.safety_notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
            if(kink.common_terms?.length) fullHTML += `<h4>Common Terms:</h4><ul>${kink.common_terms.map(t=>`<li>${t}</li>`).join('')}</ul>`;
            if(kink.common_misconceptions?.length) fullHTML += `<h4>Common Misconceptions:</h4><ul>${kink.common_misconceptions.map(m=>`<li>${m}</li>`).join('')}</ul>`;
            DOMElements.modalKinkDescriptionFullContent.innerHTML = fullHTML;
        }
        if(DOMElements.modalKinkDescriptionDetailsToggle) DOMElements.modalKinkDescriptionDetailsToggle.open = false;
        DOMElements.modalKinkNotes.value = kinkUserData.notes || '';
        const ratingOptions = { 'want_to_try': 'Want to Try', 'favorite': 'Favorite', 'like_it': 'Like It', 'curious_about': 'Curious', 'soft_limit': 'Soft Limit', 'hard_limit': 'Hard Limit', 'not_for_me': 'Not For Me', 'clear_rating': 'Clear Rating' };
        DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) { 
            const btn = document.createElement('button'); btn.textContent = ratingOptions[key]; btn.dataset.ratingKey = key;
            btn.classList.add('rating-btn', `rating-btn-${key.replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`);
            if(kinkUserData.rating === key) btn.classList.add('active-rating');
            btn.addEventListener('click', ()=>handleKinkRating(kinkId, key==='clear_rating'?null:key));
            DOMElements.modalKinkRating.appendChild(btn);
        }
        if (DOMElements.modalProfileCheckboxesContainer && DOMElements.modalNoProfilesNote) {
            DOMElements.modalProfileCheckboxesContainer.innerHTML = ''; let customProfileCount = 0;
            for (const profileId in state.userData.profiles) {
                if (state.userData.profiles[profileId]?.isDefault) continue;
                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    customProfileCount++; const div = document.createElement('div'); div.classList.add('profile-checkbox-item');
                    const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
                    checkbox.id = `modal-profile-${profileId}-${kinkId}`; checkbox.dataset.profileId = profileId;
                    checkbox.checked = profile.kink_ids.includes(kinkId);
                    const label = document.createElement('label'); label.htmlFor = checkbox.id;
                    label.classList.add('checkbox-label'); label.textContent = profile.name;
                    div.appendChild(checkbox); div.appendChild(label); DOMElements.modalProfileCheckboxesContainer.appendChild(div);
                }
            }
            DOMElements.modalNoProfilesNote.style.display = customProfileCount === 0 ? 'block' : 'none';
            DOMElements.modalProfileAssignment.style.display = Object.keys(state.userData.profiles).filter(pId => !state.userData.profiles[pId]?.isDefault).length > 0 ? 'block' : 'none';
        }
        if (DOMElements.kinkDetailModal) { DOMElements.kinkDetailModal.style.display = 'block'; DOMElements.modalKinkNotes.focus(); }
    }

    function closeKinkDetailModal(saveAndRefresh = true) { 
        let dataChangedByNotes = false; let profilesChanged = false;
        if (state.currentOpenKinkId) {
            const kinkMasterEntry = state.userData.kinkMasterData[state.currentOpenKinkId] || {};
            const newNotes = DOMElements.modalKinkNotes.value.trim();
            if (newNotes !== (kinkMasterEntry.notes || '')) { kinkMasterEntry.notes = newNotes; dataChangedByNotes = true; }
            state.userData.kinkMasterData[state.currentOpenKinkId] = kinkMasterEntry;
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
        if (saveAndRefresh && (dataChangedByNotes || profilesChanged)) saveUserData();
        if (saveAndRefresh) {
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }
    function handleKinkRating(kinkId, ratingKey) { 
        const currentKinkData = getKinkUserData(kinkId); const notes = currentKinkData.notes;
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) saveUserData();
        DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) btn.classList.add('active-rating');
        });
    }
    
    function renderSummaryForActiveProfile() { 
        if (!DOMElements.summaryContentArea) return; DOMElements.summaryContentArea.innerHTML = '';
        const kinksForSummaryList = getKinksForActiveProfile();
        const ratedKinksForSummary = kinksForSummaryList.filter(kink => getKinkUserData(kink.id).rating);
        if (ratedKinksForSummary.length === 0) {
            const profileName = state.userData.activeProfileId === 'personal' ? "Personal Atlas" : (state.userData.profiles[state.userData.activeProfileId]?.name || "selected profile");
            DOMElements.summaryContentArea.innerHTML = `<p>No rated kinks to display for "${profileName}".</p>`; return;
        }
        const summaryByCat = {};
        ratedKinksForSummary.forEach(kinkBaseData => { /* ... (group by category as before) ... */ 
            const kinkUserData = getKinkUserData(kinkBaseData.id); const catId = kinkBaseData.category_id;
            if (!KINK_CATEGORIES[catId]) return;
            if (!summaryByCat[catId]) summaryByCat[catId] = { name: KINK_CATEGORIES[catId].name, icon: KINK_CATEGORIES[catId].icon || "", kinks: [] };
            summaryByCat[catId].kinks.push({ ...kinkBaseData, ...kinkUserData });
        });
        for (const catId in summaryByCat) { /* ... (render category blocks and kink items as before, using more condensed notes) ... */ 
            const catData = summaryByCat[catId]; if(catData.kinks.length === 0) continue;
            const catBlock = document.createElement('div'); catBlock.classList.add('summary-category-block');
            const catTitle = document.createElement('h3'); catTitle.innerHTML = `${catData.icon} ${catData.name}`; catBlock.appendChild(catTitle);
            catData.kinks.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                const itemDiv = document.createElement('div'); itemDiv.classList.add('summary-kink-item');
                const nameSpan = document.createElement('span'); nameSpan.classList.add('summary-kink-name'); nameSpan.textContent = kink.name;
                if (kink.isHighRisk) nameSpan.innerHTML += ' <span class="risk-indicator-high" title="High Risk">🔥</span>';
                const ratingSpan = document.createElement('span'); ratingSpan.classList.add('summary-kink-rating', kink.rating ? `summary-rating-${kink.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : '');
                ratingSpan.textContent = formatRating(kink.rating);
                const notesSpan = document.createElement('span'); notesSpan.classList.add('summary-kink-notes');
                if (kink.notes) {
                    if (state.userData.settings.summaryNoteStyle === 'icon') {
                        notesSpan.innerHTML = '<span class="notes-indicator-icon" title="Has Notes">📝</span>'; notesSpan.title = kink.notes; notesSpan.style.cursor = 'help';
                    } else if (state.userData.settings.summaryNoteStyle === 'brief' && kink.notes.length > 50) {
                        notesSpan.innerHTML = kink.notes.substring(0, 50).replace(/\n/g, '<br>') + "..."; notesSpan.title = kink.notes;
                    } else { notesSpan.innerHTML = kink.notes.replace(/\n/g, '<br>'); }
                } else { notesSpan.innerHTML = '<em>-</em>'; }
                itemDiv.appendChild(nameSpan); itemDiv.appendChild(ratingSpan); itemDiv.appendChild(notesSpan);
                catBlock.appendChild(itemDiv);
            });
            DOMElements.summaryContentArea.appendChild(catBlock);
        }
    }

    // --- ACADEMY & JOURNAL FUNCTIONS (Paste your full working versions here) ---
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

    // --- IMPORT / EXPORT DATA ---
    function exportData() { /* ... PASTE FULL FUNCTION ... */ }
    function importData(event) { /* ... PASTE FULL FUNCTION ... */ }

    // --- UTILITIES ---
    function updateFooterYear() { if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear(); }
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.6"; } // Incremented

    // --- SETUP EVENT LISTENERS (Called from init) ---
    function setupEventListeners() {
        if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
        if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
        window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(); });
        if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => {
            state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyKinkFilters();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
            if (state.currentView === 'academy-view') renderAcademyIndex();
        });
        if(DOMElements.createNewProfileBtn) DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
        if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);
        if(DOMElements.printSummaryBtn) DOMElements.printSummaryBtn.addEventListener('click', () => window.print());
        if(DOMElements.exportDataBtn) DOMElements.exportDataBtn.addEventListener('click', exportData);
        if(DOMElements.importFileInput) DOMElements.importFileInput.addEventListener('change', importData);
        if(DOMElements.exportDataSettingsBtn) DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
        if(DOMElements.importFileSettingsInput) DOMElements.importFileSettingsInput.addEventListener('change', importData);
        if(DOMElements.newJournalEntryBtn) DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());
        setupNavigation(); // Navigation setup which attaches its own listeners
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear(); updateAppVersion();
        if (!initializeKinkData()) return;
        loadUserData(); // Loads settings, populates profile selectors, sets taboo checkbox
        applyKinkFilters(); // Apply initial filters based on loaded settings
        setupEventListeners(); // Sets up all event listeners AFTER functions are defined
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

});
