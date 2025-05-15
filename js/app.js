// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [], // Master list of all kink definitions from data.js
        userData: {
            kinkMasterData: {}, // Stores { kink_id: { rating: '...', notes: '...' } }
            profiles: {
                personal: { name: "My Personal Atlas", isDefault: true }, // Default, shows all from kinkMasterData
                shareable: { name: "My Shareable Profile", kink_ids: [] }
                // Example: partner_john: { name: "For John", kink_ids: [] }
            },
            activeProfileId: 'personal', // ID of the currently viewed/edited profile
            journalEntries: [],
            // lastView: 'welcome-view' // Optional: to remember user's last view
        },
        currentOpenKinkId: null, // Tracks the kink ID open in the modal
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

        galaxyView: document.getElementById('galaxy-view'),
        kinkGalaxyViz: document.getElementById('kink-galaxy-visualization'),
        kinkFilters: document.getElementById('kink-filters'),
        // profileSelectGalaxy: document.getElementById('profile-select-galaxy'), // For future profile selection in Galaxy

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
        // modalProfileManagement: document.getElementById('modal-profile-management'), // For future profile checkboxes in modal

        summaryView: document.getElementById('summary-view'),
        summaryContentArea: document.getElementById('summary-content-area'),
        printSummaryBtn: document.getElementById('print-summary-btn'),
        // profileSelectSummary: document.getElementById('profile-select-summary'), // For future profile selection in Summary

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
        // profileManagementArea: document.getElementById('profile-management-area'), // For future profile UI in settings
        // createNewProfileBtn: document.getElementById('create-new-profile-btn'),
        // existingProfilesList: document.getElementById('existing-profiles-list'),

        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found. Make sure data.js is loaded before app.js and is correct.");
            alert("Critical error: Kink data not found. App cannot start.");
            return false; // Indicate failure
        }
        state.kinks = KINK_DEFINITIONS.map(kink => ({ ...kink })); // Store base definitions
        return true; // Indicate success
    }

    function loadUserData() {
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            const loadedData = JSON.parse(savedUserData);
            state.userData.kinkMasterData = loadedData.kinkMasterData || {};
            state.userData.profiles = loadedData.profiles || {
                personal: { name: "My Personal Atlas", isDefault: true },
                shareable: { name: "My Shareable Profile", kink_ids: [] }
            };
            // Ensure default profiles always exist if loaded data is older/malformed
            if (!state.userData.profiles.personal) {
                state.userData.profiles.personal = { name: "My Personal Atlas", isDefault: true };
            }
            if (!state.userData.profiles.shareable) {
                state.userData.profiles.shareable = { name: "My Shareable Profile", kink_ids: [] };
            }

            state.userData.activeProfileId = loadedData.activeProfileId || 'personal';
            state.userData.journalEntries = Array.isArray(loadedData.journalEntries) ? loadedData.journalEntries : [];
            // state.currentView = loadedData.lastView || 'welcome-view'; // Restore last view
        } else {
            // Initialize with empty defaults
            state.userData = {
                kinkMasterData: {},
                profiles: {
                    personal: { name: "My Personal Atlas", isDefault: true },
                    shareable: { name: "My Shareable Profile", kink_ids: [] }
                },
                activeProfileId: 'personal',
                journalEntries: [],
            };
        }
    }

    function saveUserData() {
        // No explicit iteration needed here as kinkMasterData is updated directly
        // state.userData.lastView = state.currentView; // Save last view
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
        // Only update if changed to avoid unnecessary writes if notes are huge
        let changed = false;
        if (state.userData.kinkMasterData[kinkId].rating !== rating) {
            state.userData.kinkMasterData[kinkId].rating = rating;
            changed = true;
        }
        if (state.userData.kinkMasterData[kinkId].notes !== notes) {
            state.userData.kinkMasterData[kinkId].notes = notes;
            changed = true;
        }
        return changed; // Return true if data was actually modified
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

        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();
        if (viewId === 'summary-view') renderPersonalSummary(); // Or renderActiveProfileSummary() later

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
        
        const h1Title = DOMElements.mainHeader ? DOMElements.mainHeader.querySelector('h1') : null;
        if (h1Title) {
            h1Title.addEventListener('click', () => {
                switchView(Object.keys(state.userData.kinkMasterData).length > 0 ? 'galaxy-view' : 'welcome-view');
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

        for (const categoryId in categories) {
            const category = categories[categoryId];
            galaxyHTML += `<div class="galaxy-category">
                            <h3>${category.icon || ''} ${category.name}</h3>
                            <div class="kink-list">`;
            const kinksInCategory = state.kinks.filter(kink => kink.category_id === categoryId);
            if (kinksInCategory.length === 0) {
                galaxyHTML += `<p class="no-kinks-in-category">No kinks defined for this category yet.</p>`;
            } else {
                kinksInCategory.forEach(kink => {
                    const kinkUserData = getKinkUserData(kink.id);
                    let ratingClass = kinkUserData.rating ? `rating-${kinkUserData.rating.toLowerCase().replace(/[^a-z0-9_]/g, '-').replace(/\s+/g, '-')}` : 'rating-none';
                    galaxyHTML += `<div class="kink-star ${ratingClass}" data-kink-id="${kink.id}">
                                    ${kink.name}
                                    ${kinkUserData.rating ? `<span class="kink-star-rating-badge">${formatRating(kinkUserData.rating)}</span>` : ''}
                                   </div>`;
                });
            }
            galaxyHTML += `</div></div>`;
        }
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML;

        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const kinkId = e.currentTarget.dataset.kinkId;
                if (kinkId) {
                    openKinkDetailModal(kinkId);
                } else {
                    console.error("kinkId is undefined for clicked star.");
                }
            });
        });
    }

    function formatRating(ratingKey) {
        if (!ratingKey) return '';
        return ratingKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) {
        const kink = state.kinks.find(k => k.id === kinkId);
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
        // The academy link is now implicitly part of the description / details.
        // If you still want a direct link, you can re-add logic for DOMElements.modalKinkInfoLink here.

        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'block';
        } else {
            console.error("kinkDetailModal DOM element is null!");
        }
    }

    function closeKinkDetailModal(saveAndRefresh = true) {
        let dataChanged = false;
        if (state.currentOpenKinkId) {
            const currentKinkData = getKinkUserData(state.currentOpenKinkId);
            const newNotes = DOMElements.modalKinkNotes.value.trim();
            // The rating is already set by handleKinkRating, so we only check notes here for changes.
            if (newNotes !== currentKinkData.notes) {
                // setKinkUserData now only sets rating and notes, rating is handled by handleKinkRating
                state.userData.kinkMasterData[state.currentOpenKinkId].notes = newNotes;
                dataChanged = true;
            }
        }
        
        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'none';
        }
        state.currentOpenKinkId = null;

        if (saveAndRefresh) {
            // Only save if data actually changed (rating change is handled in handleKinkRating, notes here)
            if(dataChanged) saveUserData(); // Save if notes changed
            // Always refresh views if they are active, as rating might have changed
            if (state.currentView === 'galaxy-view') renderKinkGalaxy();
            if (state.currentView === 'summary-view') renderPersonalSummary();
        }
    }

    function handleKinkRating(kinkId, ratingKey) {
        const currentKinkData = getKinkUserData(kinkId);
        const notes = currentKinkData.notes; // Preserve existing notes
        
        // setKinkUserData returns true if data actually changed
        const ratingChanged = setKinkUserData(kinkId, ratingKey, notes);
        if (ratingChanged) {
            saveUserData(); // Save immediately if rating changed
        }

        DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active-rating');
            if (btn.dataset.ratingKey === ratingKey && ratingKey !== null) {
                btn.classList.add('active-rating');
            }
        });
    }

    if(DOMElements.modalCloseBtn) DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
    if(DOMElements.saveModalBtn) DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
    window.addEventListener('click', (event) => {
        if (DOMElements.kinkDetailModal && event.target === DOMElements.kinkDetailModal) {
            closeKinkDetailModal();
        }
    });

    // --- ACADEMY RENDERING ---
    function renderAcademyIndex() {
        if (!DOMElements.academyContentArea) return;
        DOMElements.academyContentArea.innerHTML = '<h2>Knowledge Base</h2>';
        const indexList = document.createElement('ul');
        indexList.classList.add('academy-index-list');

        const catHeader = document.createElement('h3');
        catHeader.textContent = "Kink Categories";
        indexList.appendChild(catHeader);
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
        if (!DOMElements.academyContentArea) return;
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
        state.kinks.filter(k => k.category_id === categoryId).forEach(kink => {
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
        if (!DOMElements.academyContentArea) return;
        const module = (typeof ACADEMY_MODULES !== 'undefined') ? ACADEMY_MODULES.find(m => m.id === moduleId) : null;
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

    function renderAcademyArticle(kinkId) {
        if (!DOMElements.academyContentArea) return;
        const kink = state.kinks.find(k => k.id === kinkId);
        
        DOMElements.academyContentArea.innerHTML = ''; 
        const previousCategory = kink ? KINK_CATEGORIES[kink.category_id] : null;
        DOMElements.academyContentArea.appendChild(createBackButton(previousCategory ? () => renderAcademyCategory(kink.category_id) : renderAcademyIndex, previousCategory ? `Back to ${previousCategory.name}` : 'Back to Academy Index'));

        if (!kink) {
            DOMElements.academyContentArea.innerHTML += `<p>Kink information not found.</p>`;
            return;
        }

        let articleHTML = `<h2>${kink.name}</h2>
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
        if (!DOMElements.academyContentArea) return;
        DOMElements.academyContentArea.innerHTML = ''; 
        DOMElements.academyContentArea.appendChild(createBackButton(renderAcademyIndex, 'Back to Academy Index'));
        let glossaryHTML = `<h2>Glossary of Terms</h2><dl>`;
        if (typeof GLOSSARY_TERMS !== 'undefined') {
            const sortedTerms = Object.keys(GLOSSARY_TERMS).sort((a, b) => GLOSSARY_TERMS[a].term.localeCompare(GLOSSARY_TERMS[b].term));
            sortedTerms.forEach(key => {
                const termObj = GLOSSARY_TERMS[key];
                glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition}</dd>`;
            });
        }
        glossaryHTML += `</dl>`;
        DOMElements.academyContentArea.innerHTML += glossaryHTML;
    }

    // --- JOURNAL ---
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
                    <button class="edit-journal-entry" data-index="${originalIndex}">Edit</button>
                    <button class="delete-journal-entry" data-index="${originalIndex}">Delete</button>
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
        const entryText = prompt("Enter your journal thoughts:", promptText);
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
        const newText = prompt("Edit your journal entry:", entry.text);
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
    function renderPersonalSummary() { // This effectively shows the 'personal' profile (all rated kinks from kinkMasterData)
        if (!DOMElements.summaryContentArea) {
            console.error("Summary content area not found!");
            return;
        }
        DOMElements.summaryContentArea.innerHTML = '';

        const ratedKinkIds = Object.keys(state.userData.kinkMasterData).filter(
            id => state.userData.kinkMasterData[id] && state.userData.kinkMasterData[id].rating
        );

        if (ratedKinkIds.length === 0) {
            DOMElements.summaryContentArea.innerHTML = "<p>You haven't rated any kinks yet. Go to the Galaxy view to start!</p>";
            return;
        }

        const summaryByCat = {};
        ratedKinkIds.forEach(kinkId => {
            const kinkBaseData = state.kinks.find(k => k.id === kinkId);
            if (!kinkBaseData) return;

            const kinkUserData = getKinkUserData(kinkId);
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

            categoryData.kinks.sort((a,b) => a.name.localeCompare(b.name)).forEach(kink => { // Sort kinks alphabetically
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('summary-kink-item');

                const nameSpan = document.createElement('span');
                nameSpan.classList.add('summary-kink-name');
                nameSpan.textContent = kink.name;

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

    // --- IMPORT / EXPORT DATA ---
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
                    if (importedData && importedData.kinkMasterData && typeof importedData.kinkMasterData === 'object') { // Check for kinkMasterData
                        if (confirm("This will overwrite your current Atlas data. Are you sure you want to import?")) {
                            state.userData = { // Reconstruct userData to ensure all keys are present
                                kinkMasterData: importedData.kinkMasterData || {},
                                profiles: importedData.profiles || {
                                    personal: { name: "My Personal Atlas", isDefault: true },
                                    shareable: { name: "My Shareable Profile", kink_ids: [] }
                                },
                                activeProfileId: importedData.activeProfileId || 'personal',
                                journalEntries: Array.isArray(importedData.journalEntries) ? importedData.journalEntries : []
                            };
                            // No need to call initializeKinkData() or loadUserData() again here,
                            // as we've directly set state.userData.
                            // We do need to ensure the base state.kinks is populated if it wasn't.
                            if (state.kinks.length === 0) initializeKinkData();
                            
                            saveUserData();
                            alert("Kink Atlas data imported successfully!");
                            switchView(state.currentView || 'galaxy-view'); // Refresh current or go to galaxy
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
        if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.4";
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear();
        updateAppVersion();
        if (!initializeKinkData()) return; // Stop if base data fails to load

        loadUserData();
        setupNavigation();
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

}); // End DOMContentLoaded
