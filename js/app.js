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
                currentTheme: 'dark' // 'dark' or 'light'
            },
            journalEntries: [],
        },
        currentOpenKinkId: null,
    };

    // --- DOM ELEMENTS CACHING ---
    const DOMElements = {
        body: document.body, // For theme toggling
        appContainer: document.getElementById('app-container'),
        mainHeader: document.getElementById('main-header'),
        mainNav: document.getElementById('main-nav'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'), // Theme toggle
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
        // settingSummaryNoteStyleSelect: document.getElementById('setting-summary-note-style'),
        newProfileNameInput: document.getElementById('new-profile-name'),
        createNewProfileBtn: document.getElementById('create-new-profile-btn'),
        existingProfilesList: document.getElementById('existing-profiles-list'),
        noCustomProfilesNoteSettings: document.querySelector('#settings-view .no-custom-profiles-note'),
        currentYearSpan: document.getElementById('current-year'),
    };

    // --- THEME MANAGEMENT ---
    function applyTheme(theme) {
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
        saveUserData(); // Save theme preference
    }


    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() { /* ... (same as before) ... */ 
        if (typeof KINK_DEFINITIONS === 'undefined') { console.error("KINK_DEFINITIONS not found."); alert("Critical error: Kink data not found."); return false; }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink }));
        return true;
    }
    function loadUserData() { /* ... (ensure settings.currentTheme and summaryFilters are initialized) ... */ 
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
                currentTheme: loadedData.settings?.currentTheme || 'dark' // Load theme
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else {
            state.userData = {
                kinkMasterData: {}, profiles: {}, activeProfileId: 'personal',
                settings: { showTabooKinks: false, summaryNoteStyle: 'icon', summaryFilters: { categories: [], ratingTypes: [], hasNotesOnly: false }, currentTheme: 'dark' },
                journalEntries: [],
            };
        }
        applyTheme(state.userData.settings.currentTheme); // Apply loaded or default theme
        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        populateProfileSelectors();
        renderExistingProfilesList();
        populateSummaryFilterControls();
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
    function applyGlobalKinkFilters() { /* ... (same as before) ... */ 
        let baseKinks = [...state.kinks];
        if (!state.userData.settings.showTabooKinks) baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        state.filteredKinksForDisplay = baseKinks;
        console.log(`Applied global filters. ${state.filteredKinksForDisplay.length} kinks available after global filtering.`);
    }
    function getKinksForActiveProfileView() { /* ... (same as before) ... */ 
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
    // These functions are pasted in full from the previous complete app.js, with minor logging.
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
            if (select.querySelector(`option[value="${currentVal}"]`)) {
                select.value = currentVal;
            } else { // Fallback if activeProfileId is somehow invalid
                select.value = 'personal';
                state.userData.activeProfileId = 'personal';
            }
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
        // Sync other profile selectors if they exist
        if(DOMElements.profileSelectGalaxy && DOMElements.profileSelectGalaxy !== event.target) DOMElements.profileSelectGalaxy.value = state.userData.activeProfileId;
        if(DOMElements.profileSelectSummary && DOMElements.profileSelectSummary !== event.target) DOMElements.profileSelectSummary.value = state.userData.activeProfileId;
        // saveUserData(); // Only save if you want the *selected profile* to persist across sessions
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryPage();
    }
    
    // --- VIEW MANAGEMENT ---
    function updateNavButtons() { /* ... (Full function from previous complete app.js) ... */ }
    function switchView(viewId) { /* ... (Full function from previous complete app.js, ensures applyGlobalKinkFilters is called) ... */ }

    // --- NAVIGATION ---
    function setupNavigation() { /* ... (Full function from previous complete app.js) ... */ }

    // --- KINK GALAXY RENDERING ---
    function renderKinkGalaxy() { /* ... (Full function from previous complete app.js, ensuring correct ratingClass for pill colors) ... */ }
    function formatRating(ratingKey) { /* ... (Full function from previous complete app.js) ... */ }

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) { /* ... (Full function from previous complete app.js, ensuring profile checkboxes are populated) ... */ }
    function closeKinkDetailModal(saveAndRefresh = true) { /* ... (Full function from previous complete app.js, ensuring profile assignments saved) ... */ }
    function handleKinkRating(kinkId, ratingKey) { /* ... (Full function from previous complete app.js, ensures saveUserData on change) ... */ }
    
    // --- SUMMARY PAGE (With Filters and Compact Notes) ---
    function populateSummaryFilterControls() { /* ... (Full function from previous complete app.js) ... */ }
    function applySummaryFiltersFromUI() { /* ... (Full function from previous complete app.js) ... */ }
    function resetSummaryFilters() { /* ... (Full function from previous complete app.js) ... */ }
    function renderSummaryPage() { populateSummaryFilterControls(); renderSummaryForActiveProfile(); } // Combined call
    function renderSummaryForActiveProfile() { /* ... (Full function from previous complete app.js, using summaryNoteStyle) ... */ }
    function showNotesPopover(kinkId, kinkName) { /* ... (Full function from previous complete app.js) ... */ }
    function closeNotesPopover() { /* ... (Full function from previous complete app.js) ... */ }

    // --- ACADEMY FUNCTIONS (Pasted In Full) ---
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
        const entryText = prompt("Enter your journal thoughts:", promptText); // Consider replacing with modal
        if (entryText !== null && entryText.trim() !== '') {
            if (!Array.isArray(state.userData.journalEntries)) state.userData.journalEntries = [];
            state.userData.journalEntries.push({ text: entryText.trim(), timestamp: Date.now() });
            saveUserData(); renderJournalEntries();
        }
    }
    function editJournalEntry(index) {
        const entry = state.userData.journalEntries[index]; if (!entry) return;
        const newText = prompt("Edit your journal entry:", entry.text); // Consider replacing with modal
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
                                currentTheme: importedData.settings?.currentTheme || 'dark' // Import theme
                            },
                            journalEntries: Array.isArray(importedData.journalEntries) ? importedData.journalEntries : []
                        };
                        if (state.kinks.length === 0) initializeKinkData();
                        applyTheme(state.userData.settings.currentTheme); // Apply imported theme
                        if (DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
                        // if (DOMElements.settingSummaryNoteStyleSelect) DOMElements.settingSummaryNoteStyleSelect.value = state.userData.settings.summaryNoteStyle;
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
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.8"; }

    // --- SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => { e.preventDefault(); switchView(e.target.dataset.viewTarget); });
        if(DOMElements.themeToggleBtn) DOMElements.themeToggleBtn.addEventListener('click', toggleTheme);
        if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
        if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
        window.addEventListener('click', (event) => { if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) closeKinkDetailModal(); });
        window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && DOMElements.kinkDetailModal?.style.display === 'block') closeKinkDetailModal(); });
        if(DOMElements.settingShowTabooKinksCheckbox) DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (e) => {
            state.userData.settings.showTabooKinks = e.target.checked; saveUserData(); applyGlobalKinkFilters();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryPage();
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
        if (!initializeKinkData()) return; // Stop if base data fails to load
        loadUserData(); // Loads all user data including settings, applies theme
        applyGlobalKinkFilters(); // Apply initial filters based on loaded settings
        setupEventListeners(); // Sets up all event listeners
        switchView(state.currentView || 'welcome-view'); // Show initial view
        console.log("Kink Atlas Ready.");
    }

    init();

});
