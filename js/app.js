// Kink Atlas - js/app.js

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        currentView: 'welcome-view',
        kinks: [],
        userData: {
            kinkRatings: {},
            journalEntries: [],
            // lastView: 'welcome-view' // To remember where the user left off
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
        saveModalBtn: document.getElementById('save-modal-btn'),

        // Academy View
        academyView: document.getElementById('academy-view'),
        academyContentArea: document.getElementById('academy-content-area'),

        // Journal View
        journalView: document.getElementById('journal-view'),
        journalEntriesContainer: document.getElementById('journal-entries-container'),
        newJournalEntryBtn: document.getElementById('new-journal-entry-btn'),

        // Settings View
        settingsView: document.getElementById('settings-view'),
        appVersionSpan: document.getElementById('app-version'),
        exportDataSettingsBtn: document.getElementById('export-data-settings-btn'),
        importFileSettingsInput: document.getElementById('import-file-settings-input'),
        importFileSettingsLabel: document.querySelector('label[for="import-file-settings-input"]'),

        // Footer
        currentYearSpan: document.getElementById('current-year'),
    };

    // --- DATA INITIALIZATION & LOCALSTORAGE ---
    function initializeKinkData() {
        if (typeof KINK_DEFINITIONS === 'undefined') {
            console.error("KINK_DEFINITIONS not found. Make sure data.js is loaded before app.js and is correct.");
            alert("Critical error: Kink data not found. App cannot start.");
            return;
        }
        state.kinks = KINK_DEFINITIONS.map(kink => ({
            ...kink,
            userRating: null,
            userNotes: ''
        }));
    }

    function loadUserData() {
        const savedUserData = localStorage.getItem('kinkAtlasUserData');
        if (savedUserData) {
            state.userData = JSON.parse(savedUserData);
            if (!Array.isArray(state.userData.journalEntries)) {
                state.userData.journalEntries = [];
            }
            state.kinks.forEach(kink => {
                if (state.userData.kinkRatings && state.userData.kinkRatings[kink.id]) {
                    kink.userRating = state.userData.kinkRatings[kink.id].rating;
                    kink.userNotes = state.userData.kinkRatings[kink.id].notes || '';
                }
            });
        } else {
            state.userData = {
                kinkRatings: {},
                journalEntries: [],
            };
        }
    }

    function saveUserData() {
        state.userData.kinkRatings = {};
        state.kinks.forEach(kink => {
            if (kink.userRating || (kink.userNotes && kink.userNotes.trim() !== '')) {
                state.userData.kinkRatings[kink.id] = {
                    rating: kink.userRating,
                    notes: kink.userNotes
                };
            }
        });
        localStorage.setItem('kinkAtlasUserData', JSON.stringify(state.userData));
        console.log("User data saved.");
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

        DOMElements.startExploringBtn.addEventListener('click', () => switchView('galaxy-view'));
        DOMElements.mainHeader.querySelector('h1').addEventListener('click', () => {
            switchView(Object.keys(state.userData.kinkRatings).length > 0 ? 'galaxy-view' : 'welcome-view');
        });
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

        DOMElements.kinkGalaxyViz.querySelectorAll('.kink-star').forEach(star => {
            star.addEventListener('click', (e) => {
                console.log("Kink star clicked:", e.currentTarget); // DEBUG
                const kinkId = e.currentTarget.dataset.kinkId;
                console.log("Retrieved kinkId:", kinkId); // DEBUG
                if (kinkId) {
                    openKinkDetailModal(kinkId);
                } else {
                    console.error("kinkId is undefined for clicked star."); // DEBUG
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
        console.log("openKinkDetailModal called with kinkId:", kinkId); // DEBUG
        const kink = state.kinks.find(k => k.id === kinkId);
        console.log("Found kink object for modal:", kink); // DEBUG
        if (!kink) {
            console.error("Kink not found for modal:", kinkId);
            return;
        }
        state.currentOpenKinkId = kinkId;

        DOMElements.modalKinkName.textContent = kink.name;
        DOMElements.modalKinkCategory.textContent = `Category: ${KINK_CATEGORIES[kink.category_id]?.name || 'Unknown'}`;
        DOMElements.modalKinkNotes.value = kink.userNotes || '';

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
            if (kink.userRating === key) button.classList.add('active-rating');
            button.addEventListener('click', () => handleKinkRating(kinkId, key === 'clear_rating' ? null : key));
            DOMElements.modalKinkRating.appendChild(button);
        }

        DOMElements.modalKinkInfoLink.innerHTML = `<a href="#" data-academy-link="${kink.id}">Learn more about ${kink.name} in the Academy</a>`;
        const academyLink = DOMElements.modalKinkInfoLink.querySelector('a');
        if (academyLink) {
            academyLink.addEventListener('click', (e) => {
                e.preventDefault();
                closeKinkDetailModal(false);
                renderAcademyArticle(kink.id);
                switchView('academy-view');
            });
        }
        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'block';
            console.log("Modal display set to block."); // DEBUG
        } else {
            console.error("kinkDetailModal DOM element is null!"); // DEBUG
        }
    }

    function closeKinkDetailModal(saveAndRenderGalaxy = true) {
        if (state.currentOpenKinkId) {
            const kink = state.kinks.find(k => k.id === state.currentOpenKinkId);
            if (kink) {
                kink.userNotes = DOMElements.modalKinkNotes.value.trim();
            }
        }
        if (DOMElements.kinkDetailModal) {
            DOMElements.kinkDetailModal.style.display = 'none';
        }
        state.currentOpenKinkId = null;
        if (saveAndRenderGalaxy) {
            saveUserData();
            if (state.currentView === 'galaxy-view') {
                renderKinkGalaxy();
            }
        }
    }

    function handleKinkRating(kinkId, ratingKey) {
        const kink = state.kinks.find(k => k.id === kinkId);
        if (kink) {
            kink.userRating = ratingKey;
            DOMElements.modalKinkRating.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active-rating');
                if (btn.dataset.ratingKey === ratingKey) btn.classList.add('active-rating');
            });
        }
    }

    DOMElements.modalCloseBtn.addEventListener('click', () => closeKinkDetailModal());
    DOMElements.saveModalBtn.addEventListener('click', () => closeKinkDetailModal());
    window.addEventListener('click', (event) => {
        if (event.target === DOMElements.kinkDetailModal) {
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
        ACADEMY_MODULES.forEach(module => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#academy/module/${module.id}`;
            a.textContent = `${module.icon || ''} ${module.title}`;
            a.addEventListener('click', (e) => { e.preventDefault(); renderAcademyModule(module.id); });
            li.appendChild(a);
            indexList.appendChild(li);
        });

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
        kinkListUl.classList.add('academy-kink-list'); // For styling
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
        const sortedTerms = Object.keys(GLOSSARY_TERMS).sort((a, b) => GLOSSARY_TERMS[a].term.localeCompare(GLOSSARY_TERMS[b].term));
        sortedTerms.forEach(key => {
            const termObj = GLOSSARY_TERMS[key];
            glossaryHTML += `<dt>${termObj.term}</dt><dd>${termObj.definition}</dd>`;
        });
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
        if (!state.userData.journalEntries || state.userData.journalEntries.length === 0) {
            DOMElements.journalEntriesContainer.innerHTML = `<p>No journal entries yet. Use prompts or start fresh!</p>`;
        }

        const promptsContainer = document.createElement('div');
        promptsContainer.classList.add('journal-prompts-container');
        promptsContainer.innerHTML = '<h4>Need Inspiration? Try a Prompt:</h4>';
        const promptsList = document.createElement('ul');
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
        promptsContainer.appendChild(promptsList);
        DOMElements.journalEntriesContainer.appendChild(promptsContainer);

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
    DOMElements.newJournalEntryBtn.addEventListener('click', () => createNewJournalEntry());

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
                    if (importedData && typeof importedData.kinkRatings === 'object') {
                        if (confirm("This will overwrite your current Atlas data. Are you sure you want to import?")) {
                            state.userData = importedData;
                            if (!Array.isArray(state.userData.journalEntries)) state.userData.journalEntries = [];
                            initializeKinkData();
                            loadUserData();
                            saveUserData();
                            alert("Kink Atlas data imported successfully!");
                            switchView(state.userData.lastView || 'galaxy-view');
                        }
                    } else {
                        alert("Invalid file format. Could not import Kink Atlas data.");
                    }
                } catch (error) {
                    console.error("Error importing data:", error);
                    alert("Error importing data. The file may be corrupted or not a valid Kink Atlas backup.");
                }
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
        if (DOMElements.currentYearSpan) DOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }
    function updateAppVersion() {
        if (DOMElements.appVersionSpan) DOMElements.appVersionSpan.textContent = "v0.1.2"; // Updated version
    }

    // --- INITIALIZATION CALL ---
    function init() {
        console.log("Kink Atlas Initializing...");
        updateFooterYear();
        updateAppVersion();
        initializeKinkData();
        loadUserData();
        setupNavigation();
        switchView(state.currentView || 'welcome-view');
        console.log("Kink Atlas Ready.");
    }

    init();

}); // End DOMContentLoaded
