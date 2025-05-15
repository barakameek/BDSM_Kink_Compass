// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], // Master list of all kink definitions from data.js
        filteredKinks: [], // Kinks filtered by settings (e.g., taboo) for display
        userData: {
            kinkMasterData: {}, // Stores { kink_id: { rating: '...', notes: '...' } }
            profiles: {
                personal: { name: "My Personal Atlas", isDefault: true, kink_ids: [] }, // Personal now can also be curated or show all
                shareable: { name: "My Shareable Profile", kink_ids: [] }
            },
            activeProfileId: 'personal',
            settings: {
                showTabooKinks: false // Default to false
            },
            journalEntries: [],
            // lastView: 'welcome-view'
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
        // profileSelectGalaxy: document.getElementById('profile-select-galaxy'),

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
        // modalProfileManagement: document.getElementById('modal-profile-management'),

        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'),
        // profileSelectSummary: document.getElementById('profile-select-summary'),

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
        settingShowTabooKinksCheckbox: document.getElementById('setting-show-taboo-kinks'), // New setting checkbox
        // profileManagementArea: document.getElementById('profile-management-area'),
        // createNewProfileBtn: document.getElementById('create-new-profile-btn'),
        // existingProfilesList: document.getElementById('existing-profiles-list'),

        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found. Make sure data.js is loaded before app.js and is correct.");
            alert("Critical error: Kink data not found. App cannot start.");
            return false;
        }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink }));
        applyKinkFilters(); // Apply initial filters (like taboo)
        return true;
    }

    function loadUserData() {
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            const loadedData = JSON.parse(savedUserData);
            state.userData.kinkMasterData = loadedData.kinkMasterData || {};
            state.userData.profiles = loadedData.profiles || {
                personal: { name: "My Personal Atlas", isDefault: true, kink_ids: [] }, // Ensure 'personal' can store kink_ids if we allow it to be curated
                shareable: { name: "My Shareable Profile", kink_ids: [] }
            };
            if (!state.userData.profiles.personal) state.userData.profiles.personal = { name: "My Personal Atlas", isDefault: true, kink_ids: [] };
            if (!state.userData.profiles.shareable) state.userData.profiles.shareable = { name: "My Shareable Profile", kink_ids: [] };
            
            state.userData.activeProfileId = loadedData.activeProfileId || 'personal';
            state.userData.settings = { // Load settings, with defaults
                showTabooKinks: loadedData.settings?.showTabooKinks || false
            };
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
            // state.currentView = loadedData.lastView || 'welcome-view';
        } else {
            state.userData = {
                kinkMasterData: {},
                profiles: {
                    personal: { name: "My Personal Atlas", isDefault: true, kink_ids: [] },
                    shareable: { name: "My Shareable Profile", kink_ids: [] }
                },
                activeProfileId: 'personal',
                settings: { showTabooKinks: false },
                journalEntries: [],
            };
        }
        // Update UI elements based on loaded settings
        if (DOMElements.settingShowTabooKinksCheckbox) {
            DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
        }
    }

    function saveUserData() {
        // state.userData.lastView = state.currentView;
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

    // --- KINK FILTERING ---
    function applyKinkFilters() {
        // Start with all kinks from the master list
        let kinksToDisplay = [...state.kinks];

        // Filter based on taboo setting
        if (!state.userData.settings.showTabooKinks) {
            kinksToDisplay = kinksToDisplay.filter(kink => !kink.isTaboo);
        }

        // Filter based on active profile (if not 'personal' which shows all based on above filters)
        // For now, 'personal' profile logic in render functions will handle showing all *rated* kinks.
        // This section will be more elaborate when profile selection UI is active.
        // Example for future:
        // if (state.userData.activeProfileId !== 'personal' && state.userData.profiles[state.userData.activeProfileId]) {
        //     const profileKinkIds = state.userData.profiles[state.userData.activeProfileId].kink_ids;
        //     kinksToDisplay = kinksToDisplay.filter(kink => profileKinkIds.includes(kink.id));
        // }

        state.filteredKinks = kinksToDisplay;
        console.log(`Applied filters. Displaying ${state.filteredKinks.length} kinks.`);
    }


    // --- VIEW MANAGEMENT ---
    function switchView(viewId) {
        if (!document.getElementById(viewId)) {
            console.error(`View with ID "${viewId}" not found in HTML.`);
            return;
        }
        state.currentView = viewId;
        DOMElements.views.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === viewId) {
                view.classList.add('active-view');
            }
        });
        updateNavButtons();
        applyKinkFilters(); // Re-apply filters whenever view might change context

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex(); // Academy might also need filtering later
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderPersonalSummary(); // For now, personal summary

        console.log(`Switched to view: ${viewId}`);
    }

    function updateNavButtons() {
        const navButtons = DOMElements.mainNav.querySelectorAll('button');
        navButtons.forEach(btn => {
            if (btn.dataset.view === state.currentView) {
                btn.classList.add('active-nav-btn');
            } else {
                btn.classList.remove('active-nav-btn');
            }
        });
    }

    // --- NAVIGATION ---
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

    // --- KINK GALAXY RENDERING ---
    function renderKinkGalaxy() {
        if (!DOMElements.kinkGalaxyViz) {
            console.error("kinkGalaxyViz element not found for rendering.");
            return;
        }
        DOMElements.kinkGalaxyViz.innerHTML = '';
        const categories = KINK_CATEGORIES;
        let galaxyHTML = '';
        const kinksToDisplay = state.filteredKinks; // Use pre-filtered kinks

        for (const categoryId in categories) {
            const category = categories[categoryId];
            const kinksInCategory = kinksToDisplay.filter(kink => kink.category_id === categoryId);
            
            // Only render category if it has kinks to show after filtering
            if (kinksInCategory.length > 0) {
                galaxyHTML += `<div class="galaxy-category">
                                <h3>${category.icon || ''} ${category.name}</h3>
                                <div class="kink-list">`;
                kinksInCategory.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => { // Sort kinks alphabetically
                    const kinkUserData = getKinkUserData(kink.id);
                    let ratingClass = kinkUserData.rating ? `rating-${kinkUserData.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : 'rating-none';
                    galaxyHTML += `<div class="kink-star ${ratingClass}" data-kink-id="${kink.id}">
                                    ${kink.name}
                                    ${kinkUserData.rating ? `<span class="kink-star-rating-badge">${formatRating(kinkUserData.rating)}</span>` : ''}
                                   </div>`;
                });
                galaxyHTML += `</div></div>`;
            }
        }
        if (galaxyHTML === '') {
            galaxyHTML = `<p>No kinks to display with current filters. Try adjusting settings or adding ratings.</p>`;
        }
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML;

        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const kinkId = e.currentTarget.dataset.kinkId;
                if (kinkId) openKinkDetailModal(kinkId);
                else console.error("kinkId is undefined for clicked star.");
            });
        });
    }

    function formatRating(ratingKey) {
        if (!ratingKey) return '';
        return ratingKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) {
        const kink = state.kinks.find(k => k.id === kinkId); // Find from master list
        if (!kink) {
            console.error("Kink not found for modal:", kinkId);
            return;
        }
        const kinkUserData = getKinkUserData(kinkId);
        state.currentOpenKinkId = kinkId;

        DOMElements.modalKinkName.textContent = kink.name;
        DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        
        if (DOMElements.modalKinkDescriptionSummary) {
            let summaryText = kink.description;
            if (summaryText.length > 200) summaryText = summaryText.substring(0, 200) + "...";
            DOMElements.modalKinkDescriptionSummary.textContent = summaryText;
        }
        if (DOMElements.modalKinkDescriptionFullContent) {
            let fullContentHTML = `<p>${kink.description}</p>`;
            if (kink.safety_notes && kink.safety_notes.length > 0) {
                fullContentHTML += `<h4>⚠️ Safety Considerations:</h4><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
            }
            if (kink.common_terms && kink.common_terms.length > 0) {
                fullContentHTML += `<h4>Common Terms:</h4><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
            }
            if (kink.common_misconceptions && kink.common_misconceptions.length > 0) {
                fullContentHTML += `<h4>Common Misconceptions:</h4><ul>${kink.common_misconceptions.map(mc => `<li>${mc}</li>`).join('')}</ul>`;
            }
            DOMElements.modalKinkDescriptionFullContent.innerHTML = fullContentHTML;
        }
        if(DOMElements.modalKinkDescriptionDetailsToggle) {
            DOMElements.modalKinkDescriptionDetailsToggle.open = false;
        }

        DOMElements.modalKinkNotes.value = kinkUserData.notes || '';

        const ratingOptions = {
            'want_to_try': 'Want to Try', 'favorite': 'Favorite', 'like_it': 'Like It',
            'curious_about': 'Curious', 'soft_limit': 'Soft Limit', 'hard_limit': 'Hard Limit',
            'not_for_me': 'Not For Me', 'clear_rating': 'Clear Rating'
        };
        DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) {
            const button = document.createElement('button');
            button.textContent = ratingOptions[key];
            button.dataset.ratingKey = key;
            button.classList.add('rating-btn');
            button.classList.add(`rating-btn-${key.replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}`);
            if (kinkUserData.rating === key) button.classList.add('active-rating');
            button.addEventListener('click', () => handleKinkRating(kinkId, key === 'clear_rating' ? null : key));
            DOMElements.modalKinkRating.appendChild(button);
        }

        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'block';
            DOMElements.modalKinkNotes.focus(); // Focus on notes field
        } else {
            console.error("kinkDetailModal DOM element is null!");
        }
    }

    function closeKinkDetailModal(saveAndRefresh = true) {
        let dataChangedByNotes = false;
        if (state.currentOpenKinkId) {
            const currentKinkData = getKinkUserData(state.currentOpenKinkId);
            const newNotes = DOMElements.modalKinkNotes.value.trim();
            if (newNotes !== currentKinkData.notes) {
                // Rating is set directly by handleKinkRating, notes are set here.
                state.userData.kinkMasterData[state.currentOpenKinkId].notes = newNotes;
                dataChangedByNotes = true;
            }
        }
        
        if (DOMElements.kinkDetailModal) DOMElements.kinkDetailModal.style.display = 'none';
        state.currentOpenKinkId = null;

        if (saveAndRefresh) {
            if (dataChangedByNotes) saveUserData(); // Save if notes changed. Rating changes save immediately.
            // Always refresh views if active, as rating might have changed even if notes didn't.
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderPersonalSummary();
        }
    }

    function handleKinkRating(kinkId, ratingKey) {
        const currentKinkData = getKinkUserData(kinkId);
        const notes = currentKinkData.notes; 
        
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) saveUserData();

        DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) {
                btn.classList.add('active-rating');
            }
        });
    }

    // Event listeners for modal (moved null checks to be safer)
    if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
    if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
    window.addEventListener('click', (event) => {
        if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) {
            closeKinkDetailModal();
        }
    });
    window.addEventListener('keydown', (event) => { // Allow Esc to close modal
        if (event.key === 'Escape' && DOMElements.kinkDetailModal && DOMElements.kinkDetailModal.style.display === 'block') {
            closeKinkDetailModal();
        }
    });


    // --- ACADEMY RENDERING (Functions remain the same as last full version) ---
    // (renderAcademyIndex, createBackButton, renderAcademyCategory, renderAcademyModule, renderAcademyArticle, renderGlossary)
    // Ensuring checks for data.js variables like ACADEMY_MODULES
    function renderAcademyIndex() {
        if (!DOMElements.academyContentArea) return;
        DOMElements.academyContentArea.innerHTML = '<h2>Knowledge Base</h2>';
        const indexList = document.createElement('ul');
        indexList.classList.add('academy-index-list');

        const catHeader = document.createElement('h3');
        catHeader.textContent = "Kink Categories";
        indexList.appendChild(catHeader);
        if (typeof KINK_CATEGORIES !== 'undefined') {
            for (const catId in KINK_CATEGORIES) {
                const category = KINK_CATEGORIES[catId];
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#academy/category/${catId}`;
                a.textContent = `${category.icon || ''} ${category.name}`;
                a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyCategory(catId); });
                li.appendChild(a);
                indexList.appendChild(li);
            }
        }

        const modHeader = document.createElement('h3');
        modHeader.style.marginTop = '20px';
        modHeader.textContent = "Learning Modules";
        indexList.appendChild(modHeader);
        if (typeof ACADEMY_MODULES !== 'undefined') {
            ACADEMY_MODULES.forEach(module => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#academy/module/${module.id}`;
                a.textContent = `${module.icon || ''} ${module.title}`;
                a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyModule(module.id); });
                li.appendChild(a);
                indexList.appendChild(li);
            });
        }


        const glossHeader = document.createElement('h3');
        glossHeader.style.marginTop = '20px';
        glossHeader.textContent = "Glossary";
        indexList.appendChild(glossHeader);
        const glossLi = document.createElement('li');
        const glossA = document.createElement('a');
        glossA.href = '#academy/glossary';
        glossA.textContent = "View All Terms";
        glossA.addEventListener('click', (e) => { e.preventDefault(); renderGlossary(); });
        glossLi.appendChild(glossA);
        indexList.appendChild(glossLi);

        DOMElements.academyContentArea.appendChild(indexList);
    }
    
    function createBackButton(targetFunction, text = 'Back') {
        const button = document.createElement('button');
        button.classList.add('back-button'); 
        button.innerHTML = `« ${text}`;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (targetFunction) targetFunction();
            else renderAcademyIndex(); 
        });
        return button;
    }
    
    function renderAcademyCategory(categoryId) {
        if (!DOMElements.academyContentArea || typeof KINK_CATEGORIES === 'undefined') return;
        const category = KINK_CATEGORIES[categoryId];
        if (!category) return;
        DOMElements.academyContentArea.innerHTML = ''; 
        DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        const title = document.createElement('h2');
        title.innerHTML = `${category.icon || ''} ${category.name}`;
        DOMElements.academyContentArea.appendChild(title);
        const description = document.createElement('p');
        description.textContent = category.description;
        DOMElements.academyContentArea.appendChild(description);
        const subTitle = document.createElement('h3');
        subTitle.textContent = "Kinks in this category:";
        DOMElements.academyContentArea.appendChild(subTitle);
        
        const kinkListUl = document.createElement('ul');
        kinkListUl.classList.add('academy-kink-list');
        // Use state.kinks (all kinks) for academy listing, not filteredKinks
        state.kinks.filter(k => k.category_id === categoryId).sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#academy/kink/${kink.id}`;
            a.textContent = kink.name;
            a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyArticle(kink.id); });
            li.appendChild(a);
            kinkListUl.appendChild(li);
        });
        DOMElements.academyContentArea.appendChild(kinkListUl);
    }

    function renderAcademyModule(moduleId) {
        if (!DOMElements.academyContentArea || typeof ACADEMY_MODULES === 'undefined') return;
        const module = ACADEMY_MODULES.find(m => m.id === moduleId);
        if (!module) return;

        DOMElements.academyContentArea.innerHTML = ''; 
        DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
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

    function renderAcademyArticle(kinkId) { // For individual kinks from master list
        if (!DOMElements.academyContentArea) return;
        const kink = state.kinks.find(k => k.id === kinkId); // Find from master list
        
        DOMElements.academyContentArea.innerHTML = ''; 
        const previousCategory = kink ? KINK_CATEGORIES[kink.category_id] : null;
        DOMElements.academyContentArea.appendChild(createBackButton(previousCategory ? () => renderAcademyCategory(kink.category_id) : renderAcademyIndex, previousCategory ? `Back to ${previousCategory.name}` : 'Back to Academy Index'));

        if (!kink) {
            DOMElements.academyContentArea.innerHTML += `<p>Kink information not found.</p>`;
            return;
        }

        let articleHTML = `<h2>${kink.name} ${kink.isHighRisk ? ' <span class="risk-indicator-high" title="High Risk">🔥</span>':''} ${kink.isTaboo ? ' <span class="risk-indicator-taboo" title="Advanced/Taboo Content">🚫</span>':''}</h2>
            <p><strong>Category:</strong> ${KINK_CATEGORIES[kink.category_id]?.name || 'N/A'}</p>
            <p>${kink.description}</p>`;
        if (kink.common_terms?.length > 0) articleHTML += `<h3>Common Terms:</h3><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
        if (kink.safety_notes?.length > 0) articleHTML += `<h3>⚠️ Safety Considerations:</h3><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
        if (kink.common_misconceptions?.length > 0) articleHTML += `<h3>Common Misconceptions:</h3><ul>${kink.common_misconceptions.map(con => `<li>${con}</li>`).join('')}</ul>`;
        if (kink.related_kinks_ids?.length > 0) {
            articleHTML += `<h3>Related Kinks:</h3><ul>`;
            kink.related_kinks_ids.forEach(relId => {
                const relatedKink = state.kinks.find(rk => rk.id === relId);
                if(relatedKink) articleHTML += `<li><a href="#" data-academy-link="${relatedKink.id}">${relatedKink.name}</a></li>`;
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
        sortedTerms.forEach(key => {
            const termObj = GLOSSARY_TERMS[key];
            glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition}</dd>`;
        });
        glossaryHTML += `</dl>`;
        DOMElements.academyContentArea.innerHTML += glossaryHTML;
    }


    // --- JOURNAL (Functions remain the same as last full version) ---
    // (renderJournalEntries, createNewJournalEntry, editJournalEntry, deleteJournalEntry)
    function renderJournalEntries() {
        if (!DOMElements.journalEntriesContainer) {
            console.error("Journal entries container not found in DOM.");
            return;
        }
        DOMElements.journalEntriesContainer.innerHTML = ''; 
        
        const promptsContainer = document.createElement('div');
        promptsContainer.classList.add('journal-prompts-container');
        promptsContainer.innerHTML = '<h4>Need Inspiration? Try a Prompt:</h4>';
        const promptsList = document.createElement('ul');
        if (typeof JOURNAL_PROMPTS !== 'undefined' && JOURNAL_PROMPTS.length > 0) {
            JOURNAL_PROMPTS.slice(0, 5).forEach(promptText => {
                const li = document.createElement('li');
                const promptBtn = document.createElement('button');
                promptBtn.classList.add('prompt-button');
                promptBtn.textContent = promptText.substring(0, 50) + "...";
                promptBtn.title = promptText;
                promptBtn.addEventListener('click', () => createNewJournalEntry(promptText));
                li.appendChild(promptBtn);
                promptsList.appendChild(li);
            });
        } else {
            promptsList.innerHTML = '<li>No prompts available.</li>';
        }
        promptsContainer.appendChild(promptsList);
        DOMElements.journalEntriesContainer.appendChild(promptsContainer);

        if (!state.userData.journalEntries || state.userData.journalEntries.length === 0) {
            const noEntriesP = document.createElement('p');
            noEntriesP.textContent = "No journal entries yet. Use prompts or start fresh!";
            DOMElements.journalEntriesContainer.appendChild(noEntriesP);
        } else {
            state.userData.journalEntries.slice().reverse().forEach((entry, arrayIndex) => {
                const originalIndex = state.userData.journalEntries.length - 1 - arrayIndex;
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('journal-entry-item');
                entryDiv.innerHTML = `
                    <h5>${new Date(entry.timestamp).toLocaleString()}</h5>
                    <div class="journal-entry-content">${entry.text.replace(/\n/g, '<br>')}</div>
                    <div class="journal-item-actions">
                        <button class="edit-journal-entry" data-index="${originalIndex}">Edit</button>
                        <button class="delete-journal-entry" data-index="${originalIndex}">Delete</button>
                    </div>
                `;
                DOMElements.journalEntriesContainer.appendChild(entryDiv);
            });
        }


        DOMElements.journalEntriesContainer.querySelectorAll('.edit-journal-entry').forEach(btn => {
            btn.addEventListener('click', (e) => editJournalEntry(parseInt(e.target.dataset.index)));
        });
        DOMElements.journalEntriesContainer.querySelectorAll('.delete-journal-entry').forEach(btn => {
            btn.addEventListener('click', (e) => deleteJournalEntry(parseInt(e.target.dataset.index)));
        });
    }

    function createNewJournalEntry(promptText = '') {
        const entryText = prompt("Enter your journal thoughts:", promptText); // Consider replacing prompt with a modal later
        if (entryText !== null && entryText.trim() !== '') {
            if (!Array.isArray(state.userData.journalEntries)) state.userData.journalEntries = [];
            state.userData.journalEntries.push({ text: entryText.trim(), timestamp: Date.now() });
            saveUserData();
            renderJournalEntries();
        }
    }
    if(DOMElements.newJournalEntryBtn) DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());

    function editJournalEntry(index) {
        const entry = state.userData.journalEntries[index];
        if (!entry) return;
        const newText = prompt("Edit your journal entry:", entry.text); // Consider replacing prompt
        if (newText !== null) {
            state.userData.journalEntries[index].text = newText.trim();
            state.userData.journalEntries[index].timestamp = Date.now();
            saveUserData();
            renderJournalEntries();
        }
    }

    function deleteJournalEntry(index) {
        if (confirm("Are you sure you want to delete this journal entry?")) {
            state.userData.journalEntries.splice(index, 1);
            saveUserData();
            renderJournalEntries();
        }
    }

    // --- SUMMARY PAGE FUNCTIONS ---
    function renderPersonalSummary() { // Based on activeProfileId, for now 'personal' uses filteredKinks
        if (!DOMElements.summaryContentArea) {
            console.error("Summary content area not found!");
            return;
        }
        DOMElements.summaryContentArea.innerHTML = '';
        
        // For 'personal' profile, we show all *rated* kinks from the filtered list.
        // For other profiles (once UI exists), we'd use state.userData.profiles[activeProfileId].kink_ids
        // and then filter *those* against state.filteredKinks.
        
        let kinksForSummary;
        if (state.userData.activeProfileId === 'personal' || !state.userData.profiles[state.userData.activeProfileId]) {
            // 'Personal' profile shows all RATED kinks respecting taboo filter
            kinksForSummary = state.filteredKinks.filter(kink => getKinkUserData(kink.id).rating);
        } else {
            // Logic for custom profiles (using state.userData.profiles[state.userData.activeProfileId].kink_ids)
            // This part will be built out when profile management UI is added.
            // For now, this else block won't be hit effectively.
            const profileKinkIds = state.userData.profiles[state.userData.activeProfileId].kink_ids;
            kinksForSummary = state.filteredKinks.filter(kink => profileKinkIds.includes(kink.id) && getKinkUserData(kink.id).rating);
        }


        if (kinksForSummary.length === 0) {
            DOMElements.summaryContentArea.innerHTML = `<p>No rated kinks to display for this profile/filter. Visit the Galaxy view to add ratings or adjust content settings.</p>`;
            return;
        }

        const summaryByCat = {};
        kinksForSummary.forEach(kinkBaseData => { // kinkBaseData is from state.filteredKinks
            const kinkUserData = getKinkUserData(kinkBaseData.id);
            const catId = kinkBaseData.category_id;

            if (!summaryByCat[catId]) {
                summaryByCat[catId] = {
                    name: KINK_CATEGORIES[catId]?.name || "Uncategorized",
                    icon: KINK_CATEGORIES[catId]?.icon || "",
                    kinks: []
                };
            }
            summaryByCat[catId].kinks.push({ ...kinkBaseData, ...kinkUserData });
        });

        for (const catId in summaryByCat) {
            const categoryData = summaryByCat[catId];
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
                // We don't show taboo indicator here as summary respects the filter already

                const ratingSpan = document.createElement('span');
                ratingSpan.classList.add('summary-kink-rating');
                let ratingClass = kink.rating ? `summary-rating-${kink.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : '';
                ratingSpan.classList.add(ratingClass);
                ratingSpan.textContent = formatRating(kink.rating);

                const notesSpan = document.createElement('span');
                notesSpan.classList.add('summary-kink-notes');
                notesSpan.innerHTML = kink.notes ? kink.notes.replace(/\n/g, '<br>') : '<em>No notes.</em>';

                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(ratingSpan);
                itemDiv.appendChild(notesSpan);
                categoryBlock.appendChild(itemDiv);
            });
            DOMElements.summaryContentArea.appendChild(categoryBlock);
        }
    }

    if(DOMElements.printSummaryBtn) {
        DOMElements.printSummaryBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // --- SETTINGS ---
    if(DOMElements.settingShowTabooKinksCheckbox) {
        DOMElements.settingShowTabooKinksCheckbox.addEventListener('change', (event) => {
            state.userData.settings.showTabooKinks = event.target.checked;
            saveUserData();
            applyKinkFilters(); // Re-filter the displayable kinks
            // Re-render active view if it's Galaxy or Summary, as content might change
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderPersonalSummary(); // Or renderActiveProfileSummary()
            if (state.currentView === 'academy-view') renderAcademyIndex(); // Academy might also show/hide based on this
        });
    }

    // --- IMPORT / EXPORT DATA (Functions remain the same as last full version) ---
    function exportData() {
        try {
            const dataStr = JSON.stringify(state.userData);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `kink-atlas-backup-${new Date().toISOString().slice(0,10)}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
            alert("Your Kink Atlas data has been prepared for download.");
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data. See console for details.");
        }
    }

    function importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData && importedData.kinkMasterData && typeof importedData.kinkMasterData === 'object') {
                        if (confirm("This will overwrite your current Atlas data. Are you sure you want to import?")) {
                            state.userData = { 
                                kinkMasterData: importedData.kinkMasterData || {},
                                profiles: importedData.profiles || {
                                    personal: { name: "My Personal Atlas", isDefault: true, kink_ids: [] },
                                    shareable: { name: "My Shareable Profile", kink_ids: [] }
                                },
                                activeProfileId: importedData.activeProfileId || 'personal',
                                settings: { 
                                    showTabooKinks: importedData.settings?.showTabooKinks || false 
                                },
                                journalEntries: Array.isArray(importedData.journalEntries) ? importedData.journalEntries : []
                            };
                            if (state.kinks.length === 0) initializeKinkData(); // Ensure base kinks are loaded
                            
                            // Update UI from newly imported settings
                            if (DOMElements.settingShowTabooKinksCheckbox) {
                                DOMElements.settingShowTabooKinksCheckbox.checked = state.userData.settings.showTabooKinks;
                            }
                            applyKinkFilters(); // Apply filters based on new settings
                            saveUserData();
                            alert("Kink Atlas data imported successfully!");
                            switchView(state.currentView || 'galaxy-view');
                        }
                    } else {
                        alert("Invalid file format. Could not import Kink Atlas data.");
                    }
                } catch (error) {
                    console.error("Error importing data:", error);
                    alert("Error importing data. The file may be corrupted or not a valid Kink Atlas backup.");
                }
                if(event.target) event.target.value = null;
            };
            reader.readAsText(file);
        }
    }
    if(DOMElements.exportDataBtn) DOMElements.exportDataBtn.addEventListener('click', exportData);
    if(DOMElements.importFileInput) DOMElements.importFileInput.addEventListener('change', importData);
    if(DOMElements.exportDataSettingsBtn) DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
    if(DOMElements.importFileSettingsInput) DOMElements.importFileSettingsInput.addEventListener('change', importData);


    // --- UTILITIES ---
    function updateFooterYear() {
        if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }
    function updateAppVersion() {
        if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.5";
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear();
        updateAppVersion();
        if (!initializeKinkData()) return;

        loadUserData(); // Loads user data and settings, updates taboo checkbox
        applyKinkFilters(); // Apply initial filters based on loaded settings
        setupNavigation();
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

}); // End DOMContentLoaded
