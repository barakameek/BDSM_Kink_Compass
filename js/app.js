// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], // Master list of all kink definitions from data.js
        filteredKinks: [], // Kinks filtered by settings (e.g., taboo) for display in Galaxy/Academy
        userData: {
            kinkMasterData: {}, // Stores { kink_id: { rating: '...', notes: '...' } }
            profiles: {
                // 'personal' is a conceptual profile representing all rated kinks based on content settings.
                // It doesn't store kink_ids itself here; its content is derived.
                // Custom profiles will be added here, e.g.:
                // shareable: { name: "My Shareable Profile", kink_ids: ["spanking_01", "rope_bondage_01"] }
            },
            activeProfileId: 'personal', // Default to 'personal' conceptual profile
            settings: {
                showTabooKinks: false 
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
        importFileLabel: document.querySelector('label[for="import-file-input"]'),
        inlineNavToSettingsBtn: document.querySelector('.inline-nav-btn[data-view-target="settings-view"]'),

        galaxyView: document.getElementById('galaxy-view'),
        kinkGalaxyViz: document.getElementById('kink-galaxy-visualization'),
        kinkFilters: document.getElementById('kink-filters'),
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
        modalProfileAssignment: document.getElementById('modal-profile-assignment'),
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
        importFileSettingsLabel: document.querySelector('label[for="import-file-settings-input"]'),
        settingShowTabooKinksCheckbox: document.getElementById('setting-show-taboo-kinks'),
        
        profileManagementArea: document.getElementById('profile-management-area'),
        newProfileNameInput: document.getElementById('new-profile-name'),
        createNewProfileBtn: document.getElementById('create-new-profile-btn'),
        existingProfilesList: document.getElementById('existing-profiles-list'),
        noCustomProfilesNoteSettings: document.querySelector('#existing-profiles-list .no-custom-profiles-note'),


        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found. Make sure data.js is loaded.");
            alert("Critical error: Kink data not found. App cannot start.");
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
            state.userData.profiles = loadedData.profiles || {}; // Custom profiles loaded here
            state.userData.activeProfileId = loadedData.activeProfileId || 'personal';
            state.userData.settings = { 
                showTabooKinks: loadedData.settings?.showTabooKinks || false
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
        } else { // Initialize fresh state
            state.userData = {
                kinkMasterData: {},
                profiles: {}, // No custom profiles initially
                activeProfileId: 'personal',
                settings: { showTabooKinks: false },
                journalEntries: [],
            };
        }
        if (DOMElements.settingShowTabooKinksCheckbox) {
            DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        }
        populateProfileSelectors(); // Populate dropdowns with loaded profiles
        renderExistingProfilesList(); // Render profiles in settings
    }

    function saveUserData() {
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
    }

    function getKinkUserData(kinkId) {
        return state.userData.kinkMasterData[kinkId] || { rating: null, notes: '' };
    }

    function setKinkUserData(kinkId, rating, notes) {
        if (!state.userData.kinkMasterData[kinkId]) {
            state.userData.kinkMasterData[kinkId] = {};
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

    // --- KINK FILTERING & PROFILE LOGIC ---
    function applyKinkFilters() {
        let baseKinks = [...state.kinks]; // Start with all defined kinks
        if (!state.userData.settings.showTabooKinks) {
            baseKinks = baseKinks.filter(kink => !kink.isTaboo);
        }
        state.filteredKinks = baseKinks; // This list respects taboo setting
        console.log(`Applied global filters. Displaying ${state.filteredKinks.length} potential kinks.`);
    }

    function getKinksForActiveProfile() {
        applyKinkFilters(); // Ensure base list is filtered by taboo settings

        const activeProfileId = state.userData.activeProfileId;
        if (activeProfileId === 'personal' || !state.userData.profiles[activeProfileId]) {
            // 'Personal' profile shows all from state.filteredKinks (Galaxy)
            // or all RATED kinks from state.filteredKinks (Summary)
            return state.filteredKinks; 
        } else {
            // Custom profile: filter state.filteredKinks by the profile's kink_ids list
            const profileKinkIds = state.userData.profiles[activeProfileId].kink_ids || [];
            return state.filteredKinks.filter(kink => profileKinkIds.includes(kink.id));
        }
    }


    // --- PROFILE MANAGEMENT ---
    function populateProfileSelectors() {
        const selectors = [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary];
        selectors.forEach(select => {
            if (!select) return;
            const currentVal = select.value; // Preserve selection if possible
            select.innerHTML = `<option value="personal">My Personal Atlas</option>`; // Always have Personal
            for (const profileId in state.userData.profiles) {
                if (profileId !== 'personal') { // 'personal' is conceptual, not in profiles object this way
                    const profile = state.userData.profiles[profileId];
                    if (profile && profile.name) { // Ensure profile exists and has a name
                         const option = document.createElement('option');
                         option.value = profileId;
                         option.textContent = profile.name;
                         select.appendChild(option);
                    }
                }
            }
            // Try to restore previous selection, or default to activeProfileId
            const targetValue = currentVal && select.querySelector(`option[value="${currentVal}"]`) ? currentVal : state.userData.activeProfileId;
            select.value = targetValue;
        });
    }

    function renderExistingProfilesList() {
        if (!DOMElements.existingProfilesList || !DOMElements.noCustomProfilesNoteSettings) return;
        DOMElements.existingProfilesList.innerHTML = '';
        let hasCustomProfiles = false;
        for (const profileId in state.userData.profiles) {
             // Skip the conceptual 'personal' profile if it was ever added to the object by mistake
            if (state.userData.profiles[profileId]?.isDefault) continue;

            const profile = state.userData.profiles[profileId];
            if (profile && profile.name) { // Check if profile is valid
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
        if (!DOMElements.newProfileNameInput) return;
        const profileName = DOMElements.newProfileNameInput.value.trim();
        if (!profileName) {
            alert("Please enter a name for the new profile.");
            return;
        }
        // Generate a unique ID (simple timestamp-based for now)
        const profileId = `profile_${Date.now()}`;
        if (state.userData.profiles[profileId] || profileId === 'personal') {
            alert("A profile with this ID already exists or is reserved. Please try again.");
            return;
        }
        state.userData.profiles[profileId] = {
            name: profileName,
            kink_ids: [] // Starts empty
        };
        DOMElements.newProfileNameInput.value = ''; // Clear input
        saveUserData();
        populateProfileSelectors();
        renderExistingProfilesList();
        alert(`Profile "${profileName}" created!`);
    }

    function deleteProfile(profileId) {
        if (profileId === 'personal' || state.userData.profiles[profileId]?.isDefault) {
            alert("The Personal Atlas profile cannot be deleted.");
            return;
        }
        const profileName = state.userData.profiles[profileId]?.name || "this profile";
        if (confirm(`Are you sure you want to delete the profile "${profileName}"? This cannot be undone.`)) {
            delete state.userData.profiles[profileId];
            // If the deleted profile was the active one, switch to personal
            if (state.userData.activeProfileId === profileId) {
                state.userData.activeProfileId = 'personal';
            }
            saveUserData();
            populateProfileSelectors();
            renderExistingProfilesList();
            // Refresh current view if it was showing the deleted profile's content
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }

    function handleProfileSelectionChange(event) {
        state.userData.activeProfileId = event.target.value;
        // Ensure other selectors are synced
        [DOMElements.profileSelectGalaxy, DOMElements.profileSelectSummary].forEach(sel => {
            if (sel && sel !== event.target) sel.value = state.userData.activeProfileId;
        });
        saveUserData(); // Save the new active profile
        // Re-render the current view based on the new active profile
        if (state.currentView === 'galaxy-view') renderKinkGalaxy();
        if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
    }
    

    // --- VIEW MANAGEMENT (switchView updated) ---
    function switchView(viewId) {
        if (!document.getElementById(viewId)) {
            console.error(`View with ID "${viewId}" not found in HTML.`);
            return;
        }
        state.currentView = viewId;
        DOMElements.views.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === viewId) view.classList.add('active-view');
        });
        updateNavButtons();
        // applyKinkFilters(); // Filters are applied within render functions now or globally on setting change

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryForActiveProfile();
        if (viewId === 'settings-view') renderExistingProfilesList(); // Ensure profiles list is up-to-date when going to settings

        console.log(`Switched to view: ${viewId}`);
    }

    // (updateNavButtons, setupNavigation remain largely the same - navigation items are consistent)
    function setupNavigation() {
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
            button.id = item.id;
            button.textContent = item.text;
            button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId));
            DOMElements.mainNav.appendChild(button);
        });

        if(DOMElements.startExploringBtn) DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        if(DOMElements.inlineNavToSettingsBtn) {
            DOMElements.inlineNavToSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                switchView(e.target.dataset.viewTarget);
            });
        }
        
        const h1Title = DOMElements.mainHeader ? DOMElements.mainHeader.querySelector('h1') : null;
        if (h1Title) {
            h1Title.addEventListener('click', () => {
                const hasRatedKinks = Object.keys(state.userData.kinkMasterData).some(id => state.userData.kinkMasterData[id]?.rating);
                switchView(hasRatedKinks ? 'galaxy-view' : 'welcome-view');
            });
        }
    }


    // --- KINK GALAXY RENDERING (Updated for profiles) ---
    function renderKinkGalaxy() {
        if (!DOMElements.kinkGalaxyViz) return;
        DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = KINK_CATEGORIES;
        let galaxyHTML = '';
        
        const kinksToList = getKinksForActiveProfile(); // Gets kinks based on taboo filter AND active profile

        if (kinksToList.length === 0 && state.userData.activeProfileId !== 'personal') {
            DOMElements.kinkGalaxyViz.innerHTML = `<p>This profile is currently empty. Add kinks to it via the Kink Detail pop-up when viewing your Personal Atlas.</p>`;
            return;
        }
        if (kinksToList.length === 0 && state.userData.activeProfileId === 'personal') {
             DOMElements.kinkGalaxyViz.innerHTML = `<p>No kinks to display. Check your Content Preferences in Settings or start rating kinks!</p>`;
            return;
        }


        for (const categoryId in categories) {
            const category = categories[categoryId];
            // Filter kinksToList further by current category
            const kinksInCategory = kinksToList.filter(kink => kink.category_id === categoryId);
            
            if (kinksInCategory.length > 0) {
                galaxyHTML += `<div class="galaxy-category">
                                <h3>${category.icon || ''} ${category.name}</h3>
                                <div class="kink-list">`;
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

        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const kinkId = e.currentTarget.dataset.kinkId;
                if (kinkId) openKinkDetailModal(kinkId);
                else console.error("kinkId is undefined for clicked star.");
            });
        });
    }

    // (formatRating remains the same)
    function formatRating(ratingKey) {
        if (!ratingKey) return '';
        return ratingKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // --- KINK DETAIL MODAL (Updated for profile assignment) ---
    function openKinkDetailModal(kinkId) {
        const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink) return;
        const kinkUserData = getKinkUserData(kinkId);
        state.currentOpenKinkId = kinkId;

        // ... (Populate name, category, description, notes, ratings as before) ...
        DOMElements.modalKinkName.textContent = kink.name;
        DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        if (DOMElements.modalKinkDescriptionSummary) {
            let summaryText = kink.description;
            if (summaryText.length > 200) summaryText = summaryText.substring(0, 200) + "...";
            DOMElements.modalKinkDescriptionSummary.textContent = summaryText;
        }
        if (DOMElements.modalKinkDescriptionFullContent) {
            let fullContentHTML = `<p>${kink.description}</p>`;
            if (kink.safety_notes && kink.safety_notes.length > 0) fullContentHTML += `<h4>⚠️ Safety Considerations:</h4><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
            if (kink.common_terms && kink.common_terms.length > 0) fullContentHTML += `<h4>Common Terms:</h4><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
            if (kink.common_misconceptions && kink.common_misconceptions.length > 0) fullContentHTML += `<h4>Common Misconceptions:</h4><ul>${kink.common_misconceptions.map(mc => `<li>${mc}</li>`).join('')}</ul>`;
            DOMElements.modalKinkDescriptionFullContent.innerHTML = fullContentHTML;
        }
        if(DOMElements.modalKinkDescriptionDetailsToggle) DOMElements.modalKinkDescriptionDetailsToggle.open = false;
        DOMElements.modalKinkNotes.value = kinkUserData.notes || '';

        const ratingOptions = { /* ... ratings ... */
            'want_to_try': 'Want to Try', 'favorite': 'Favorite', 'like_it': 'Like It',
            'curious_about': 'Curious', 'soft_limit': 'Soft Limit', 'hard_limit': 'Hard Limit',
            'not_for_me': 'Not For Me', 'clear_rating': 'Clear Rating'
        };
        DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) {
            const button = document.createElement('button');
            button.textContent = ratingOptions[key];
            button.dataset.ratingKey = key;
            button.classList.add('rating-btn', `rating-btn-${key.replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`);
            if (kinkUserData.rating === key) button.classList.add('active-rating');
            button.addEventListener('click', () => handleKinkRating(kinkId, key === 'clear_rating' ? null : key));
            DOMElements.modalKinkRating.appendChild(button);
        }
        
        // Populate Profile Assignment Checkboxes
        if (DOMElements.modalProfileCheckboxesContainer && DOMElements.modalNoProfilesNote) {
            DOMElements.modalProfileCheckboxesContainer.innerHTML = ''; // Clear old ones
            let customProfileCount = 0;
            for (const profileId in state.userData.profiles) {
                if (state.userData.profiles[profileId]?.isDefault) continue; // Skip 'personal' conceptual profile

                const profile = state.userData.profiles[profileId];
                if (profile && profile.name) {
                    customProfileCount++;
                    const div = document.createElement('div');
                    div.classList.add('profile-checkbox-item');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `modal-profile-${profileId}-${kinkId}`; // Unique ID
                    checkbox.dataset.profileId = profileId;
                    checkbox.checked = profile.kink_ids.includes(kinkId);
                    
                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.classList.add('checkbox-label');
                    label.textContent = profile.name;

                    div.appendChild(checkbox);
                    div.appendChild(label);
                    DOMElements.modalProfileCheckboxesContainer.appendChild(div);
                }
            }
            DOMElements.modalNoProfilesNote.style.display = customProfileCount === 0 ? 'block' : 'none';
        }

        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'block';
            DOMElements.modalKinkNotes.focus();
        }
    }

    function closeKinkDetailModal(saveAndRefresh = true) {
        let dataChangedByNotes = false;
        let profilesChanged = false;
        if (state.currentOpenKinkId) {
            const currentKinkData = getKinkUserData(state.currentOpenKinkId);
            const newNotes = DOMElements.modalKinkNotes.value.trim();
            if (newNotes !== currentKinkData.notes) {
                state.userData.kinkMasterData[state.currentOpenKinkId].notes = newNotes; // Rating is set by handleKinkRating
                dataChangedByNotes = true;
            }

            // Save profile assignments
            if (DOMElements.modalProfileCheckboxesContainer) {
                const checkboxes = DOMElements.modalProfileCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    const profileId = cb.dataset.profileId;
                    if (state.userData.profiles[profileId]) {
                        const kinkIdx = state.userData.profiles[profileId].kink_ids.indexOf(state.currentOpenKinkId);
                        if (cb.checked && kinkIdx === -1) {
                            state.userData.profiles[profileId].kink_ids.push(state.currentOpenKinkId);
                            profilesChanged = true;
                        } else if (!cb.checked && kinkIdx !== -1) {
                            state.userData.profiles[profileId].kink_ids.splice(kinkIdx, 1);
                            profilesChanged = true;
                        }
                    }
                });
            }
        }
        
        if (DOMElements.kinkDetailModal) DOMElements.kinkDetailModal.style.display = 'none';
        const closedKinkId = state.currentOpenKinkId; // Store before nulling
        state.currentOpenKinkId = null;

        if (saveAndRefresh) {
            if (dataChangedByNotes || profilesChanged) saveUserData();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
        }
    }

    // (handleKinkRating remains the same: updates kinkMasterData, saves, updates modal buttons)
    function handleKinkRating(kinkId, ratingKey) {
        const currentKinkData = getKinkUserData(kinkId);
        const notes = currentKinkData.notes; 
        
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes); // This updates state.userData.kinkMasterData
        if (ratingChanged) {
            saveUserData(); // Save data if rating changed
        }

        DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) {
                btn.classList.add('active-rating');
            }
        });
    }
    

    // --- SUMMARY PAGE (Renamed and updated for profiles) ---
    function renderSummaryForActiveProfile() {
        if (!DOMElements.summaryContentArea) return;
        DOMElements.summaryContentArea.innerHTML = '';
        
        const kinksForSummaryList = getKinksForActiveProfile(); // Gets kinks based on active profile & taboo filter
        const ratedKinksForSummary = kinksForSummaryList.filter(kink => getKinkUserData(kink.id).rating);

        if (ratedKinksForSummary.length === 0) {
            DOMElements.summaryContentArea.innerHTML = `<p>No rated kinks to display for the selected profile ("${state.userData.profiles[state.userData.activeProfileId]?.name || 'Personal Atlas'}") with current content settings. Visit the Galaxy view to add ratings or adjust preferences.</p>`;
            return;
        }

        const summaryByCat = {};
        ratedKinksForSummary.forEach(kinkBaseData => {
            const kinkUserData = getKinkUserData(kinkBaseData.id);
            const catId = kinkBaseData.category_id;
            if (!KINK_CATEGORIES[catId]) return; // Skip if category doesn't exist (data integrity)

            if (!summaryByCat[catId]) {
                summaryByCat[catId] = {
                    name: KINK_CATEGORIES[catId].name,
                    icon: KINK_CATEGORIES[catId].icon || "",
                    kinks: []
                };
            }
            summaryByCat[catId].kinks.push({ ...kinkBaseData, ...kinkUserData });
        });

        for (const catId in summaryByCat) {
            const categoryData = summaryByCat[catId];
            if(categoryData.kinks.length === 0) continue; // Skip empty categories after filtering

            const categoryBlock = document.createElement('div');
            categoryBlock.classList.add('summary-category-block');
            const categoryTitle = document.createElement('h3');
            categoryTitle.innerHTML = `${categoryData.icon} ${categoryData.name}`;
            categoryBlock.appendChild(categoryTitle);

            categoryData.kinks.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('summary-kink-item');
                const nameSpan = document.createElement('span');
                nameSpan.classList.add('summary-kink-name');
                nameSpan.textContent = kink.name;
                if (kink.isHighRisk) nameSpan.innerHTML += ' <span class="risk-indicator-high" title="High Risk">🔥</span>';
                // No taboo indicator here as summary respects global filter

                const ratingSpan = document.createElement('span');
                ratingSpan.classList.add('summary-kink-rating', kink.rating ? `summary-rating-${kink.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : '');
                ratingSpan.textContent = formatRating(kink.rating);

                const notesSpan = document.createElement('span');
                notesSpan.classList.add('summary-kink-notes');
                // Condense notes for summary display (e.g., first line or character limit)
                let displayNotes = kink.notes || '<em>No notes.</em>';
                if (kink.notes && kink.notes.length > 100) { // Example: show first 100 chars
                    displayNotes = kink.notes.substring(0, 100).replace(/\n/g, '<br>') + "...";
                } else if (kink.notes) {
                    displayNotes = kink.notes.replace(/\n/g, '<br>');
                }
                notesSpan.innerHTML = displayNotes;
                // Add a title attribute for full notes on hover
                if (kink.notes) notesSpan.title = kink.notes;


                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(ratingSpan);
                itemDiv.appendChild(notesSpan);
                categoryBlock.appendChild(itemDiv);
            });
            DOMElements.summaryContentArea.appendChild(categoryBlock);
        }
    }


    // --- SETTINGS ---
    if(DOMElements.settingShowTabooKinksCheckbox) {
        DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (event) => {
            state.userData.settings.showTabooKinks = event.target.checked;
            saveUserData();
            applyKinkFilters();
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderSummaryForActiveProfile();
            if (state.currentView === 'academy-view') renderAcademyIndex(); 
        });
    }
    if(DOMElements.createNewProfileBtn) {
        DOMElements.createNewProfileBtn.addEventListener('click', createNewProfile);
    }

    // Attach event listeners for profile selectors
    if(DOMElements.profileSelectGalaxy) DOMElements.profileSelectGalaxy.addEventListener('change', handleProfileSelectionChange);
    if(DOMElements.profileSelectSummary) DOMElements.profileSelectSummary.addEventListener('change', handleProfileSelectionChange);


    // --- ACADEMY, JOURNAL, IMPORT/EXPORT, UTILITIES (Full functions as in previous complete app.js) ---
    // (These functions are long and largely unchanged from the previous *full* app.js. 
    //  Ensure you have the complete versions of these from that response.)
    // For brevity here, I will list them by name, assuming you have their full code:
    // renderAcademyIndex, createBackButton, renderAcademyCategory, renderAcademyModule, renderAcademyArticle, renderGlossary
    // renderJournalEntries, createNewJournalEntry, editJournalEntry, deleteJournalEntry
    // exportData, importData
    // updateFooterYear, updateAppVersion
    function updateFooterYear() { if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear(); }
    function updateAppVersion() { if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.6"; }
    // (The full Academy and Journal functions are required here from the previous response where I gave a full app.js)


    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear();
        updateAppVersion();
        if (!initializeKinkData()) return;

        loadUserData();     // Loads user data and settings, updates taboo checkbox & profile selectors
        applyKinkFilters(); // Apply initial filters
        setupNavigation();
        renderExistingProfilesList(); // Render profiles in settings page initially
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

}); // End DOMContentLoaded
 function updateNavButtons() {
        if (!DOMElements.mainNav) return; // Guard clause
        const navButtons = DOMElements.mainNav.querySelectorAll('button');
        navButtons.forEach(btn => {
            if (btn.dataset.view === state.currentView) {
                btn.classList.add('active-nav-btn');
            } else {
                btn.classList.remove('active-nav-btn');
            }
        });
    }
    // ***** END OF FUNCTION TO ADD *****

    function switchView(viewId) {
        if (!document.getElementById(viewId)) {
            console.error(`View with ID "${viewId}" not found in HTML.`);
            return;
        }
        state.currentView = viewId;
        DOMElements.views.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === viewId) view.classList.add('active-view');
        });
        updateNavButtons(); // THIS LINE (AROUND 304) WAS CAUSING THE ERROR
        applyKinkFilters(); 

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex(); 
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderSummaryForActiveProfile(); 
        if (viewId === 'settings-view') renderExistingProfilesList(); 

        console.log(`Switched to view: ${viewId}`);
    }
