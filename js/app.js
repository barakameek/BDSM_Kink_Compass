// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
// Ensures the script runs after the full HTML document is loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    // Basic state for the application
    const state = {
        currentView: 'welcome-view', // or load from localStorage if previously set
        kinks: [], // Will be populated with KINK_DEFINITIONS and user data
        userData: {
            // Structure for user's ratings, notes, journal, etc.
            // Example: 'kink_id': { rating: 'want_to_try', notes: 'Some thoughts...' }
            kinkRatings: {},
            journalEntries: [],
            // lastView: 'welcome-view' // To remember where the user left off
        },
        // Add more state variables as needed (e.g., filters for galaxy)
    };

    // --- DOM ELEMENTS CACHING ---
    // Cache frequently accessed DOM elements
    const DOMElements = {
        appContainer: document.getElementById('app-container'),
        mainHeader: document.getElementById('main-header'),
        mainNav: document.getElementById('main-nav'),
        mainContent: document.getElementById('main-content'),
        views: document.querySelectorAll('.view'), // All sections with class 'view'

        // Welcome View
        welcomeView: document.getElementById('welcome-view'),
        startExploringBtn: document.getElementById('start-exploring-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        importFileInput: document.getElementById('import-file-input'),
        importFileLabel: document.querySelector('label[for="import-file-input"]'),


        // Galaxy View
        galaxyView: document.getElementById('galaxy-view'),
        kinkGalaxyViz: document.getElementById('kink-galaxy-visualization'),
        kinkFilters: document.getElementById('kink-filters'),

        // Kink Detail Modal
        kinkDetailModal: document.getElementById('kink-detail-modal'),
        modalCloseBtn: document.querySelector('.close-modal-btn'),
        modalKinkName: document.getElementById('modal-kink-name'),
        modalKinkCategory: document.getElementById('modal-kink-category'),
        modalKinkRating: document.getElementById('modal-kink-rating'),
        modalKinkNotes: document.getElementById('modal-kink-notes'),
        modalKinkInfoLink: document.getElementById('modal-kink-info-link'),
        currentOpenKinkId: null, // To track which kink is open in the modal

        // Academy View
        academyView: document.getElementById('academy-view'),
        academyContentArea: document.getElementById('academy-content-area'),

        // Journal View
        journalView: document.getElementById('journal-view'),
        journalEntriesContainer: document.getElementById('journal-entries'),
        newJournalEntryBtn: document.getElementById('new-journal-entry-btn'),

        // Settings View
        settingsView: document.getElementById('settings-view'),
        exportDataSettingsBtn: document.getElementById('export-data-settings-btn'),
        importFileSettingsInput: document.getElementById('import-file-settings-input'),
        importFileSettingsLabel: document.querySelector('label[for="import-file-settings-input"]'),


        // Footer
        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---

    // Load data from data.js (assuming KINK_DEFINITIONS, etc., are global or use APP_DATA)
    // If you structured data.js with window.APP_DATA, use that.
    // For this example, assuming global constants from data.js
    function initializeKinkData() {
        state.kinks = KINK_DEFINITIONS.map(kink => ({
            ...kink, // Spread the original kink definition
            // Add placeholders for user-specific data, to be loaded or set
            userRating: null, // e.g., 'want_to_try', 'hard_limit', etc.
            userNotes: ''
        }));
    }

    function loadUserData() {
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            state.userData = JSON.parse(savedUserData);
            // Apply saved ratings and notes to the main kinks array
            state.kinks.forEach(kink => {
                if (state.userData.kinkRatings && state.userData.kinkRatings[kink.id]) {
                    kink.userRating = state.userData.kinkRatings[kink.id].rating;
                    kink.userNotes = state.userData.kinkRatings[kink.id].notes || '';
                }
            });
        } else {
            // Initialize with empty defaults if no saved data
            state.userData = {
                kinkRatings: {},
                journalEntries: [],
                // lastView: 'welcome-view'
            };
        }
        // Load last view if available
        // if (state.userData.lastView) {
        //     state.currentView = state.userData.lastView;
        // }
    }

    function saveUserData() {
        // Before saving, update userData.kinkRatings from the main state.kinks array
        state.userData.kinkRatings = {};
        state.kinks.forEach(kink => {
            if (kink.userRating || kink.userNotes) {
                state.userData.kinkRatings[kink.id] = {
                    rating: kink.userRating,
                    notes: kink.userNotes
                };
            }
        });
        // state.userData.lastView = state.currentView;
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
    }

    // --- VIEW MANAGEMENT ---
    function switchView(viewId) {
        state.currentView = viewId;
        DOMElements.views.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === viewId) {
                view.classList.add('active-view');
            }
        });
        updateNavButtons();
        // Render content for the new view if needed
        if (viewId === 'galaxy-view') renderKinkGalaxy();
        if (viewId === 'academy-view') renderAcademyIndex();
        if (viewId === 'journal-view') renderJournalEntries();

        // Save current view to userData so it can be restored on next visit
        // saveUserData(); // Might be too frequent, consider saving on window unload or specific actions
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
        // Define navigation items
        const navItems = [
            { id: 'nav-galaxy', text: 'Galaxy', viewId: 'galaxy-view' },
            { id: 'nav-academy', text: 'Academy', viewId: 'academy-view' },
            { id: 'nav-journal', text: 'Journal', viewId: 'journal-view' },
            { id: 'nav-settings', text: 'Settings', viewId: 'settings-view' },
        ];

        DOMElements.mainNav.innerHTML = ''; // Clear existing nav
        navItems.forEach(item => {
            const button = document.createElement('button');
            button.id = item.id;
            button.textContent = item.text;
            button.dataset.view = item.viewId;
            button.addEventListener('click', () => switchView(item.viewId));
            DOMElements.mainNav.appendChild(button);
        });

        // Welcome screen button
        DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));

        // Logo click to go to welcome/galaxy
        DOMElements.mainHeader.querySelector('h1').addEventListener('click', () => {
            // Or perhaps to 'galaxy-view' if data exists
            switchView(Object.keys(state.userData.kinkRatings).length > 0 ? 'galaxy-view' : 'welcome-view');
        });
    }


    // --- KINK GALAXY RENDERING (Simplified) ---
    function renderKinkGalaxy() {
        DOMElements.kinkGalaxyViz.innerHTML = ''; // Clear previous content
        DOMElements.kinkGalaxyViz.textContent = 'Loading Kink Galaxy...'; // Placeholder

        // Group kinks by category for a basic layout
        const categories = KINK_CATEGORIES; // from data.js
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
                    // Add classes based on userRating for styling
                    let ratingClass = kink.userRating ? `rating-${kink.userRating.toLowerCase().replace(/\s+/g, '-')}` : '';
                    galaxyHTML += `<div class="kink-star ${ratingClass}" data-kink-id="${kink.id}">
                                    ${kink.name}
                                    ${kink.userRating ? `<span class="kink-star-rating-badge">${formatRating(kink.userRating)}</span>` : ''}
                                   </div>`;
                });
            }
            galaxyHTML += `</div></div>`;
        }
        DOMElements.kinkGalaxyViz.innerHTML = galaxyHTML;

        // Add event listeners to kink stars
        document.querySelectorAll('.kink-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const kinkId = e.currentTarget.dataset.kinkId;
                openKinkDetailModal(kinkId);
            });
        });
    }
    // Helper to format rating text for display
    function formatRating(ratingKey) {
        if (!ratingKey) return '';
        return ratingKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }


    // --- KINK DETAIL MODAL ---
    function openKinkDetailModal(kinkId) {
        const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink) {
            console.error("Kink not found:", kinkId);
            return;
        }
        state.currentOpenKinkId = kinkId;

        DOMElements.modalKinkName.textContent = kink.name;
        DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        DOMElements.modalKinkNotes.value = kink.userNotes || '';

        // Populate rating options (example)
        const ratingOptions = {
            'want_to_try': 'Want to Try',
            'favorite': 'Favorite',
            'like_it': 'Like It',
            'curious_about': 'Curious',
            'soft_limit': 'Soft Limit',
            'hard_limit': 'Hard Limit',
            'not_for_me': 'Not For Me',
            'clear_rating': 'Clear Rating'
        };
        DOMElements.modalKinkRating.innerHTML = '';
        for (const key in ratingOptions) {
            const button = document.createElement('button');
            button.textContent = ratingOptions[key];
            button.dataset.ratingKey = key;
            if (kink.userRating === key) {
                button.classList.add('active-rating');
            }
            button.addEventListener('click', () => handleKinkRating(kinkId, key === 'clear_rating' ? null : key));
            DOMElements.modalKinkRating.appendChild(button);
        }

        // Link to academy
        DOMElements.modalKinkInfoLink.innerHTML = `<a href="#" data-academy-link="${kink.id}">Learn more about ${kink.name} in the Academy</a>`;
        DOMElements.modalKinkInfoLink.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            // Implement navigation to specific academy page or show info
            closeKinkDetailModal();
            renderAcademyArticle(kink.id); // A function to find and display the kink in academy
            switchView('academy-view');
        });


        DOMElements.kinkDetailModal.style.display = 'block';
    }

    function closeKinkDetailModal() {
        if (state.currentOpenKinkId) {
            const kink = state.kinks.find(k => k.id === state.currentOpenKinkId);
            if (kink) {
                kink.userNotes = DOMElements.modalKinkNotes.value.trim();
            }
        }
        DOMElements.kinkDetailModal.style.display = 'none';
        state.currentOpenKinkId = null;
        saveUserData(); // Save notes and ratings when modal closes
        renderKinkGalaxy(); // Re-render to reflect changes
    }

    function handleKinkRating(kinkId, ratingKey) {
        const kink = state.kinks.find(k => k.id === kinkId);
        if (kink) {
            kink.userRating = ratingKey;
            console.log(`Kink ${kinkId} rated as ${ratingKey}`);
            // Update modal button styles
            DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active-rating');
                if (btn.dataset.ratingKey === ratingKey) {
                    btn.classList.add('active-rating');
                }
            });
            // No need to save here, will save on modal close or app exit
        }
    }

    DOMElements.modalCloseBtn.addEventListener('click', closeKinkDetailModal);
    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === DOMElements.kinkDetailModal) {
            closeKinkDetailModal();
        }
    });


    // --- ACADEMY RENDERING ---
    function renderAcademyIndex() {
        DOMElements.academyContentArea.innerHTML = '<h2>Knowledge Base</h2>';
        const indexList = document.createElement('ul');
        indexList.classList.add('academy-index-list');

        // List Kink Categories
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

        // List Academy Modules
        const modHeader = document.createElement('h3');
        modHeader.style.marginTop = '20px';
        modHeader.textContent = "Learning Modules";
        indexList.appendChild(modHeader);
        ACADEMY_MODULES.forEach(module => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#academy/module/${module.id}`;
            a.textContent = `${module.icon || ''} ${module.title}`;
            a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyModule(module.id); });
            li.appendChild(a);
            indexList.appendChild(li);
        });

        // List Glossary
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

    function renderAcademyCategory(categoryId) {
        const category = KINK_CATEGORIES[categoryId];
        if (!category) return;
        DOMElements.academyContentArea.innerHTML = `
            <button class="back-to-academy-index">« Back to Academy Index</button>
            <h2>${category.icon || ''} ${category.name}</h2>
            <p>${category.description}</p>
            <h3>Kinks in this category:</h3>`;
        const kinkListUl = document.createElement('ul');
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
        DOMElements.academyContentArea.querySelector('.back-to-academy-index').addEventListener('click', renderAcademyIndex);
    }


    function renderAcademyModule(moduleId) {
        const module = ACADEMY_MODULES.find(m => m.id === moduleId);
        if (!module) return;

        let contentHTML = `<button class="back-to-academy-index">« Back to Academy Index</button>
                           <h2>${module.icon || ''} ${module.title}</h2>`;
        module.content.forEach(item => {
            switch (item.type) {
                case 'heading':
                    contentHTML += `<h${item.level || 3}>${item.text}</h${item.level || 3}>`;
                    break;
                case 'paragraph':
                    contentHTML += `<p>${item.text}</p>`;
                    break;
                case 'list':
                    contentHTML += `<ul>${item.items.map(li => `<li>${li}</li>`).join('')}</ul>`;
                    break;
            }
        });
        DOMElements.academyContentArea.innerHTML = contentHTML;
        DOMElements.academyContentArea.querySelector('.back-to-academy-index').addEventListener('click', renderAcademyIndex);
    }

    function renderAcademyArticle(kinkId) { // For individual kinks
        const kink = state.kinks.find(k => k.id === kinkId);
        if (!kink) {
            DOMElements.academyContentArea.innerHTML = `<button class="back-to-academy-index">« Back to Academy Index</button><p>Kink information not found.</p>`;
            DOMElements.academyContentArea.querySelector('.back-to-academy-index').addEventListener('click', renderAcademyIndex);
            return;
        }

        let articleHTML = `<button class="back-to-academy-index">« Back to Academy Index</button>
            <h2>${kink.name}</h2>
            <p><strong>Category:</strong> ${KINK_CATEGORIES[kink.category_id]?.name || 'N/A'}</p>
            <p>${kink.description}</p>`;

        if (kink.common_terms && kink.common_terms.length > 0) {
            articleHTML += `<h3>Common Terms:</h3><ul>${kink.common_terms.map(term => `<li>${term}</li>`).join('')}</ul>`;
        }
        if (kink.safety_notes && kink.safety_notes.length > 0) {
            articleHTML += `<h3>⚠️ Safety Considerations:</h3><ul>${kink.safety_notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
        }
        if (kink.common_misconceptions && kink.common_misconceptions.length > 0) {
            articleHTML += `<h3>Common Misconceptions:</h3><ul>${kink.common_misconceptions.map(con => `<li>${con}</li>`).join('')}</ul>`;
        }
        if (kink.related_kinks_ids && kink.related_kinks_ids.length > 0) {
            articleHTML += `<h3>Related Kinks:</h3><ul>`;
            kink.related_kinks_ids.forEach(relId => {
                const relatedKink = state.kinks.find(rk => rk.id === relId);
                if(relatedKink) {
                     articleHTML += `<li><a href="#" data-academy-link="${relatedKink.id}">${relatedKink.name}</a></li>`;
                }
            });
            articleHTML += `</ul>`;
        }

        DOMElements.academyContentArea.innerHTML = articleHTML;
        DOMElements.academyContentArea.querySelector('.back-to-academy-index').addEventListener('click', renderAcademyIndex);
        // Add event listeners for related kink links
        DOMElements.academyContentArea.querySelectorAll('a[data-academy-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                renderAcademyArticle(e.target.dataset.academyLink);
            });
        });
    }

    function renderGlossary() {
        let glossaryHTML = `<button class="back-to-academy-index">« Back to Academy Index</button>
                            <h2>Glossary of Terms</h2><dl>`;
        // Sort terms alphabetically for easier navigation
        const sortedTerms = Object.keys(GLOSSARY_TERMS).sort((a, b) => GLOSSARY_TERMS[a].term.localeCompare(GLOSSARY_TERMS[b].term));

        sortedTerms.forEach(key => {
            const termObj = GLOSSARY_TERMS[key];
            glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition}</dd>`;
        });
        glossaryHTML += `</dl>`;
        DOMElements.academyContentArea.innerHTML = glossaryHTML;
        DOMElements.academyContentArea.querySelector('.back-to-academy-index').addEventListener('click', renderAcademyIndex);
    }


    // --- JOURNAL ---
    function renderJournalEntries() {
        DOMElements.journalEntriesContainer.innerHTML = '';
        if (state.userData.journalEntries.length === 0) {
            DOMElements.journalEntriesContainer.innerHTML = `<p>No journal entries yet. Use prompts or start fresh!</p>`;
        }

        // Add prompts section
        const promptsContainer = document.createElement('div');
        promptsContainer.classList.add('journal-prompts-container');
        promptsContainer.innerHTML = '<h4>Need Inspiration? Try a Prompt:</h4>';
        const promptsList = document.createElement('ul');
        JOURNAL_PROMPTS.slice(0, 5).forEach(promptText => { // Show a few prompts
            const li = document.createElement('li');
            const promptBtn = document.createElement('button');
            promptBtn.classList.add('prompt-button');
            promptBtn.textContent = promptText.substring(0, 50) + "..."; // Truncate for button
            promptBtn.title = promptText;
            promptBtn.addEventListener('click', () => createNewJournalEntry(promptText));
            li.appendChild(promptBtn);
            promptsList.appendChild(li);
        });
        promptsContainer.appendChild(promptsList);
        DOMElements.journalEntriesContainer.appendChild(promptsContainer);


        state.userData.journalEntries.slice().reverse().forEach((entry, index) => { // Show newest first
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('journal-entry-item'); // Use class from CSS
            entryDiv.innerHTML = `
                <h5>${new Date(entry.timestamp).toLocaleString()}</h5>
                <div class="journal-entry-content">${entry.text.replace(/\n/g, '<br>')}</div>
                <button class="edit-journal-entry" data-index="${state.userData.journalEntries.length - 1 - index}">Edit</button>
                <button class="delete-journal-entry" data-index="${state.userData.journalEntries.length - 1 - index}">Delete</button>
            `;
            DOMElements.journalEntriesContainer.appendChild(entryDiv);
        });

        // Add event listeners for edit/delete
        DOMElements.journalEntriesContainer.querySelectorAll('.edit-journal-entry').forEach(btn => {
            btn.addEventListener('click', (e) => editJournalEntry(parseInt(e.target.dataset.index)));
        });
        DOMElements.journalEntriesContainer.querySelectorAll('.delete-journal-entry').forEach(btn => {
            btn.addEventListener('click', (e) => deleteJournalEntry(parseInt(e.target.dataset.index)));
        });
    }

    function createNewJournalEntry(promptText = '') {
        // For a "AAA" feel, use a modal or an inline editor instead of prompt()
        const entryText = prompt("Enter your journal thoughts:", promptText);
        if (entryText !== null && entryText.trim() !== '') {
            state.userData.journalEntries.push({
                text: entryText.trim(),
                timestamp: Date.now()
            });
            saveUserData();
            renderJournalEntries();
        }
    }
    DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());

    function editJournalEntry(index) {
        const entry = state.userData.journalEntries[index];
        if (!entry) return;
        const newText = prompt("Edit your journal entry:", entry.text);
        if (newText !== null) { // Allow saving empty if they want to clear it, or handle that differently
            state.userData.journalEntries[index].text = newText.trim();
            state.userData.journalEntries[index].timestamp = Date.now(); // Update timestamp on edit
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


    // --- IMPORT / EXPORT DATA ---
    function exportData() {
        const dataStr = JSON.stringify(state.userData);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `kink-atlas-backup-${new Date().toISOString().slice(0,10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        linkElement.remove();
        alert("Your Kink Atlas data has been prepared for download.");
    }

    function importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    // Basic validation (can be more thorough)
                    if (importedData && typeof importedData.kinkRatings === 'object') {
                        if (confirm("This will overwrite your current Atlas data. Are you sure you want to import?")) {
                            state.userData = importedData;
                            // Re-apply imported ratings/notes to the main kinks array
                            initializeKinkData(); // Reset kink data to defaults first
                            state.kinks.forEach(kink => {
                                if (state.userData.kinkRatings && state.userData.kinkRatings[kink.id]) {
                                    kink.userRating = state.userData.kinkRatings[kink.id].rating;
                                    kink.userNotes = state.userData.kinkRatings[kink.id].notes || '';
                                }
                            });
                            saveUserData(); // Save the newly imported data
                            alert("Kink Atlas data imported successfully!");
                            // Refresh current view or switch to a default one
                            switchView(state.userData.lastView || 'galaxy-view');
                        }
                    } else {
                        alert("Invalid file format. Could not import Kink Atlas data.");
                    }
                } catch (error) {
                    console.error("Error importing data:", error);
                    alert("Error importing data. The file may be corrupted or not a valid Kink Atlas backup.");
                }
                // Reset file input to allow importing the same file again if needed
                event.target.value = null;
            };
            reader.readAsText(file);
        }
    }
    DOMElements.exportDataBtn.addEventListener('click', exportData);
    DOMElements.importFileInput.addEventListener('change', importData);
    DOMElements.exportDataSettingsBtn.addEventListener('click', exportData);
    DOMElements.importFileSettingsInput.addEventListener('change', importData);


    // --- UTILITIES ---
    function updateFooterYear() {
        DOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear();
        initializeKinkData(); // Prepare kink definitions
        loadUserData();       // Load user's saved data
        setupNavigation();    // Create nav buttons
        switchView(state.currentView); // Show the initial or last saved view

        // Auto-save on window close/before unload (optional, can be aggressive)
        // window.addEventListener('beforeunload', saveUserData);

        console.log("Kink Atlas Ready.");
    }

    init(); // Start the application

}); // End DOMContentLoaded
