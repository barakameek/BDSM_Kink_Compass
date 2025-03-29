// === app.js === (Version 2.8.7 - Consolidated Structure - COMPLETE) ===

// --- Consolidated Imports ---
import {
    bdsmData,
    glossaryTerms,
    achievementList,
    synergyHints,
    goalKeywords,
    challenges,
    oracleReadings,
    journalPrompts,
    sfStyles,
    sfSubFinderTraits,
    sfSubTraitFootnotes,
    sfDomFinderTraits,
    sfDomTraitFootnotes,
    sfSliderDescriptions,
    sfTraitExplanations,
    sfStyleDescriptions,
    sfDynamicMatches,
    sfStyleKeyTraits,
    contextHelpTexts,
    sfStyleIcons // Moved from getStyleIcons method
} from './appData.js';

import {
    getSubStyleBreakdown,
    getDomStyleBreakdown,
    hasAchievement,
    grantAchievement,
    getAchievementDetails,
    findHintsForTraits,
    getRandomPrompt,
    escapeHTML,
    getFlairForScore
} from './utils.js';

// Chart.js and Confetti loaded via CDN

// --- Top Level Data Check (Less critical now, but good for sanity) ---
console.log("--- Data Sanity Checks (Consolidated) ---");
console.log("bdsmData keys:", Object.keys(bdsmData || {}));
console.log("glossaryTerms count:", Object.keys(glossaryTerms || {}).length);
console.log("achievementList count:", Object.keys(achievementList || {}).length);
console.log("sfStyles keys:", Object.keys(sfStyles || {}));
console.log("--- End Data Check ---");


class TrackerApp {
  constructor() {
    console.log("[CONSTRUCTOR] STARTING KinkCompass App (v2.8.7 - Consolidated)...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-traits-breakdown';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;

    // --- Style Finder State ---
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} };
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false;
    this.previousScores = null;
    this.styleFinderTraits = [];
    this.traitFootnotes = {};
    this.sliderDescriptions = {}; // Will be populated from sfSliderDescriptions
    this.sfSliderInteracted = false;

    console.log("[CONSTRUCTOR] Mapping elements...");
    this.elements = {
        formSection: document.getElementById('form-section'),
        name: document.getElementById('name'),
        avatarDisplay: document.getElementById('avatar-display'),
        avatarInput: document.getElementById('avatar-input'),
        avatarPicker: document.querySelector('.avatar-picker'),
        role: document.getElementById('role'),
        style: document.getElementById('style'),
        styleExploreLink: document.getElementById('style-explore-link'),
        formStyleFinderLink: document.getElementById('form-style-finder-link'),
        traitsContainer: document.getElementById('traits-container'),
        traitsMessage: document.getElementById('traits-message'),
        traitInfoPopup: document.getElementById('trait-info-popup'),
        traitInfoClose: document.getElementById('trait-info-close'),
        traitInfoTitle: document.getElementById('trait-info-title'),
        traitInfoBody: document.getElementById('trait-info-body'),
        contextHelpPopup: document.getElementById('context-help-popup'),
        contextHelpClose: document.getElementById('context-help-close'),
        contextHelpTitle: document.getElementById('context-help-title'),
        contextHelpBody: document.getElementById('context-help-body'),
        save: document.getElementById('save'),
        clearForm: document.getElementById('clear-form'),
        peopleList: document.getElementById('people-list'),
        livePreview: document.getElementById('live-preview'),
        modal: document.getElementById('detail-modal'),
        modalBody: document.getElementById('modal-body'),
        modalTabs: document.getElementById('modal-tabs'),
        modalClose: document.getElementById('modal-close'),
        resourcesBtn: document.getElementById('resources-btn'),
        resourcesModal: document.getElementById('resources-modal'),
        resourcesClose: document.getElementById('resources-close'),
        resourcesBody: document.getElementById('resources-body'),
        glossaryBtn: document.getElementById('glossary-btn'),
        glossaryModal: document.getElementById('glossary-modal'),
        glossaryClose: document.getElementById('glossary-close'),
        glossaryBody: document.getElementById('glossary-body'),
        styleDiscoveryBtn: document.getElementById('style-discovery-btn'),
        styleDiscoveryModal: document.getElementById('style-discovery-modal'),
        styleDiscoveryClose: document.getElementById('style-discovery-close'),
        styleDiscoveryRoleFilter: document.getElementById('style-discovery-role'),
        styleDiscoveryBody: document.getElementById('style-discovery-body'),
        themesBtn: document.getElementById('themes-btn'),
        themesModal: document.getElementById('themes-modal'),
        themesClose: document.getElementById('themes-close'),
        themesBody: document.getElementById('themes-body'),
        achievementsBtn: document.getElementById('achievements-btn'),
        achievementsModal: document.getElementById('achievements-modal'),
        achievementsClose: document.getElementById('achievements-close'),
        achievementsBody: document.getElementById('achievements-body'),
        welcomeModal: document.getElementById('welcome-modal'),
        welcomeClose: document.getElementById('welcome-close'),
        exportBtn: document.getElementById('export-btn'),
        importBtn: document.getElementById('import-btn'),
        importFileInput: document.getElementById('import-file-input'),
        themeToggle: document.getElementById('theme-toggle'),
        styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'),
        sfModal: document.getElementById('style-finder-modal'),
        sfCloseBtn: document.getElementById('sf-close-style-finder'),
        sfProgressTracker: document.getElementById('sf-progress-tracker'),
        sfStepContent: document.getElementById('sf-step-content'),
        sfFeedback: document.getElementById('sf-feedback'),
        sfDashboard: document.getElementById('sf-dashboard'),
        detailModalTitle: document.getElementById('detail-modal-title'),
        formTitle: document.getElementById('form-title'),
        // dailyChallengeArea: document.getElementById('daily-challenge-area') // This is created dynamically now
    };
    console.log(`[CONSTRUCTOR] Elements mapped.`);

    if (!this.elements.role || !this.elements.style) { console.error("[CONSTRUCTOR] CRITICAL ERROR: Role or Style dropdown missing!"); alert("App critical error: Missing core form elements. Please check index.html."); return; }
    if (!this.elements.sfStepContent || !this.elements.sfModal) { console.warn("[CONSTRUCTOR] Style Finder UI elements missing."); }

    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners();
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and initial render...");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value); // Initial render based on default role
    this.renderTraits(this.elements.role.value, ''); // Render initial traits (likely none until style selected)
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    // displayDailyChallenge now called within updateLivePreview
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() {
    console.log("[LOAD_STORAGE] Attempting load.");
    try {
        const data = localStorage.getItem('kinkCompassPeople');
        if (data) {
            this.people = JSON.parse(data);
            console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
            // Data sanitization/migration
            this.people.forEach(p => {
                if (!p.id) p.id = Date.now() + Math.random();
                if (!p.achievements) p.achievements = [];
                if (!p.goals) p.goals = [];
                if (!p.history) p.history = [];
                if (p.reflections === undefined) p.reflections = "";
                // Add any future migration logic here
            });
        } else {
            console.log("[LOAD_STORAGE] No data found in localStorage.");
            this.people = []; // Start with empty array if no data
        }
    } catch (error) {
        console.error("[LOAD_STORAGE] Error loading or parsing data:", error);
        this.showNotification("Error loading data. Starting fresh.", "error", 5000);
        this.people = []; // Reset to empty array on error
    }
}

  saveToLocalStorage() {
    console.log("[SAVE_STORAGE] Saving personas.");
    try {
        localStorage.setItem('kinkCompassPeople', JSON.stringify(this.people));
        console.log(`[SAVE_STORAGE] Saved ${this.people.length} personas.`);
    } catch (error) {
        console.error("[SAVE_STORAGE] Error saving data:", error);
        this.showNotification("Error saving data. Changes might be lost.", "error", 5000);
    }
  }

  // --- Onboarding ---
  checkAndShowWelcome() {
    console.log("[WELCOME] Checking for first visit.");
    if (!localStorage.getItem('kinkCompassWelcomed_v2_8')) { // Added version to flag name
        console.log("[WELCOME] First visit for this version. Showing welcome modal.");
        this.showWelcomeMessage();
    } else {
        console.log("[WELCOME] Not first visit for this version.");
    }
  }

  showWelcomeMessage() {
    console.log("[WELCOME] Opening welcome modal.");
    if (this.elements.welcomeModal) {
        this.openModal(this.elements.welcomeModal);
        localStorage.setItem('kinkCompassWelcomed_v2_8', 'true'); // Set version-specific flag
        console.log("[WELCOME] Welcome flag set for v2.8.");
    } else {
        console.warn("[WELCOME] Welcome modal element not found.");
    }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("[ADD_LISTENERS] Starting listener setup...");
    const safeAddListener = (element, event, handler, elementName) => {
        if (element) {
            // Use bind to ensure 'this' refers to the TrackerApp instance inside the handler
            element.addEventListener(event, handler.bind(this));
            // console.log(`  [LISTENER ADDED] 👍 ${elementName} - ${event}`); // Verbose logging
        } else {
            console.warn(`  [LISTENER FAILED] ❓ Element not found for: ${elementName}`);
        }
    };

    // Form Interactions
    safeAddListener(this.elements.role, 'change', (e) => {
        console.log("[EVENT] Role changed");
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, ''); // Clear style traits on role change
        if(this.elements.style) this.elements.style.value = ''; // Reset style dropdown
        this.updateLivePreview();
        this.updateStyleExploreLink(); // Update link based on new role (no style yet)
    }, 'role');

    safeAddListener(this.elements.style, 'change', (e) => {
        console.log("[EVENT] Style changed");
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink(); // Update link based on selected style
    }, 'style');

    safeAddListener(this.elements.name, 'input', this.updateLivePreview, 'name');
    safeAddListener(this.elements.save, 'click', this.savePerson, 'save');
    safeAddListener(this.elements.clearForm, 'click', () => this.resetForm(true), 'clearForm'); // Pass true for manual clear

    // Avatar Picker
    safeAddListener(this.elements.avatarPicker, 'click', (e) => {
        if (e.target.classList.contains('avatar-btn')) {
            console.log("[EVENT] Avatar clicked");
            const emoji = e.target.dataset.emoji;
            if (emoji && this.elements.avatarInput && this.elements.avatarDisplay) {
                this.elements.avatarInput.value = emoji;
                this.elements.avatarDisplay.textContent = emoji;
                // Update visual selection
                this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.updateLivePreview();
            }
        }
    }, 'avatarPicker');

    // Trait Interactions
    safeAddListener(this.elements.traitsContainer, 'input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e); // Pass the event object
            this.updateLivePreview();
        }
    }, 'traitsContainer input');

    safeAddListener(this.elements.traitsContainer, 'click', (e) => {
        if (e.target.closest('.trait-info-btn')) {
            console.log("[EVENT] Trait info clicked");
            this.handleTraitInfoClick(e); // Pass the event object
        }
    }, 'traitsContainer click');

    // Popups & Context Help
    safeAddListener(this.elements.formStyleFinderLink, 'click', this.sfStart, 'formStyleFinderLink');
    safeAddListener(document.body, 'click', (e) => { // Delegate from body for context help
        const helpButton = e.target.closest('.context-help-btn');
        if (helpButton) {
            console.log("[EVENT] Context help clicked");
            const key = helpButton.dataset.helpKey;
            if(key) this.showContextHelp(key, helpButton); // Pass button for ARIA handling
        }
    }, 'body context-help');
    safeAddListener(this.elements.traitInfoClose, 'click', this.hideTraitInfo, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', this.hideContextHelp, 'contextHelpClose');

    // Persona List Interactions
    safeAddListener(this.elements.peopleList, 'click', this.handleListClick, 'peopleList click');
    safeAddListener(this.elements.peopleList, 'keydown', this.handleListKeydown, 'peopleList keydown');

    // Modal Closing Logic (Centralized)
    const modalsToClose = [
        { modal: this.elements.modal, button: this.elements.modalClose, name: 'detailModal' },
        { modal: this.elements.resourcesModal, button: this.elements.resourcesClose, name: 'resourcesModal' },
        { modal: this.elements.glossaryModal, button: this.elements.glossaryClose, name: 'glossaryModal' },
        { modal: this.elements.styleDiscoveryModal, button: this.elements.styleDiscoveryClose, name: 'styleDiscoveryModal' },
        { modal: this.elements.themesModal, button: this.elements.themesClose, name: 'themesModal' },
        { modal: this.elements.welcomeModal, button: this.elements.welcomeClose, name: 'welcomeModal' },
        { modal: this.elements.achievementsModal, button: this.elements.achievementsClose, name: 'achievementsModal' },
        { modal: this.elements.sfModal, button: this.elements.sfCloseBtn, name: 'sfModal' }
    ];
    modalsToClose.forEach(item => {
        safeAddListener(item.button, 'click', () => {
            console.log(`[EVENT] Close clicked for ${item.name}`);
            this.closeModal(item.modal);
        }, `${item.name} Close`);
    });

    // Header Button Actions
    safeAddListener(this.elements.resourcesBtn, 'click', () => {
        console.log("[EVENT] Resources clicked");
        grantAchievement({}, 'resource_reader', this.showNotification.bind(this)); // Pass notification callback
        this.openModal(this.elements.resourcesModal);
    }, 'resourcesBtn');
    safeAddListener(this.elements.glossaryBtn, 'click', () => {
        console.log("[EVENT] Glossary clicked");
        grantAchievement({}, 'glossary_user', this.showNotification.bind(this));
        this.showGlossary();
    }, 'glossaryBtn');
    safeAddListener(this.elements.styleDiscoveryBtn, 'click', () => {
        console.log("[EVENT] Style Discovery clicked");
        grantAchievement({}, 'style_discovery', this.showNotification.bind(this));
        this.showStyleDiscovery();
    }, 'styleDiscoveryBtn');
    safeAddListener(this.elements.themesBtn, 'click', () => {
        console.log("[EVENT] Themes clicked");
        this.openModal(this.elements.themesModal);
    }, 'themesBtn');
    safeAddListener(this.elements.achievementsBtn, 'click', () => {
        console.log("[EVENT] Achievements clicked");
        this.showAchievements();
    }, 'achievementsBtn');
    safeAddListener(this.elements.themeToggle, 'click', this.toggleTheme, 'themeToggle');
    safeAddListener(this.elements.exportBtn, 'click', this.exportData, 'exportBtn');
    safeAddListener(this.elements.importBtn, 'click', () => {
        console.log("[EVENT] Import clicked");
        this.elements.importFileInput?.click(); // Trigger hidden file input
    }, 'importBtn');
    safeAddListener(this.elements.importFileInput, 'change', this.importData, 'importFileInput');
    safeAddListener(this.elements.styleFinderTriggerBtn, 'click', this.sfStart, 'styleFinderTriggerBtn');

    // Other Modal/Feature Specific Listeners
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', this.renderStyleDiscoveryContent, 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody'); // Detail modal interactions
    safeAddListener(this.elements.modalBody, 'keydown', this.handleModalBodyClick, 'modalBody'); // Capture Enter key in forms
    safeAddListener(this.elements.modalBody, 'submit', this.handleModalBodyClick, 'modalBody'); // Capture form submit
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs'); // Detail modal tab navigation

    // Glossary Link Handling (delegated from body and glossary modal)
    safeAddListener(this.elements.glossaryBody, 'click', this.handleGlossaryLinkClick, 'glossaryBody');
    safeAddListener(document.body, 'click', this.handleGlossaryLinkClick, 'body glossaryLink'); // For links outside glossary modal

    // Style Explore Link
    safeAddListener(this.elements.styleExploreLink, 'click', this.handleExploreStyleLinkClick, 'styleExploreLink');

    // Style Finder Interactions (delegated)
    safeAddListener(this.elements.sfStepContent, 'click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const action = button.dataset.action;
            if (action) {
                // console.log(`[EVENT] SF button action: ${action}`);
                // Pass dataset and the element that was clicked
                this.handleStyleFinderAction(action, button.dataset, button);
            } else if (button.classList.contains('sf-info-icon')) {
                // console.log("[EVENT] SF trait info clicked");
                const traitName = button.dataset.trait;
                if (traitName) this.sfShowTraitInfo(traitName, button); // Pass button as trigger
            }
        }
    }, 'sfStepContent click');
    safeAddListener(this.elements.sfStepContent, 'input', (e) => {
        if (e.target.classList.contains('sf-trait-slider')) {
            this.handleStyleFinderSliderInput(e.target); // Pass the slider element
        }
    }, 'sfStepContent input');

    // Window Level Listeners for Escape key and closing popups
    safeAddListener(window, 'keydown', this.handleWindowKeydown, 'window keydown');
    safeAddListener(window, 'click', this.handleWindowClick, 'window click');

    console.log("[ADD_LISTENERS] Listener setup COMPLETE.");
} // --- End addEventListeners ---


  // --- Event Handlers ---

  handleListClick(e) { /* ... Same as before ... */ }
  handleListKeydown(e) { /* ... Same as before ... */ }
  handleWindowClick(e) { /* ... Same as before ... */ }
  handleWindowKeydown(e) { /* ... Same as before ... */ }
  handleTraitSliderInput(e) { /* ... Same as before ... */ }
  handleTraitInfoClick(e) { /* ... Same as before ... */ }
  handleModalBodyClick(e) { /* ... Same as before ... */ }
  handleThemeSelection(e) { /* ... Same as before ... */ }
  handleStyleFinderAction(action, dataset = {}, triggerElement = null) { /* ... Same as before ... */ }
  handleStyleFinderSliderInput(sliderElement) { /* ... Same as before ... */ }
  handleDetailTabClick(e) { /* ... Same as before ... */ }
  handleGlossaryLinkClick(e) { /* ... Same as before ... */ }
  handleExploreStyleLinkClick(e) { /* ... Same as before ... */ }

  // --- Core Rendering ---

  renderStyles(roleKey) { /* ... Same as before ... */ }
  renderTraits(roleKey, styleName) { /* ... Same as before ... */ }
  createTraitHTML(trait, value = 3) { /* ... Same as before ... */ }
  updateTraitDescription(slider) { /* ... Same as before ... */ }
  renderList() { /* ... Same as before ... */ }
  createPersonListItemHTML(person) { /* ... Same as before ... */ }
  updateStyleExploreLink() { /* ... Same as before ... */ }

  // --- CRUD Operations ---

  savePerson() { /* ... Same as before ... */ }
  editPerson(personId) { /* ... Same as before ... */ }
  deletePerson(personId) { /* ... Same as before ... */ }
  resetForm(isManualClear = false) { /* ... Same as before ... */ }

  // --- Live Preview ---
  updateLivePreview() { /* ... Same as before ... */ }

  // --- Modal Display ---

  showPersonDetails(personId) { /* ... Same as before ... */ }
  renderDetailTabContent(person, tabId, contentElement) { /* ... Same as before ... */ }

  // --- Rendering Functions for Merged Tab Sections ---

  renderTraitsBreakdownTab(person) { /* ... Same as before ... */ }
  renderGoalsJournalTab(person) { /* ... Same as before ... */ }
  renderInsightsTab(person) { /* ... Same as before ... */ }

  // --- Individual Component Rendering Functions for Detail Modal ---

  renderTraitDetails(person) { /* ... Same as before ... */ }
  renderStyleBreakdownDetail(person) { /* ... Same as before ... */ }
  renderHistoryTabStructure(person) { /* ... Same as before ... */ }
  renderJournalTab(person) { /* ... Same as before ... */ }
  renderAchievementsList(person = null) { /* ... Same as before ... */ }
  renderGoalList(person, returnListOnly = false) { /* ... Same as before ... */ }

  // --- Feature Logic (Goals, Journal, History, etc.) ---

  addGoal(personId, formElement) { /* ... Same as before ... */ }
  toggleGoalStatus(personId, goalId, listItemElement = null) { /* ... Same as before ... */ }
  deleteGoal(personId, goalId) { /* ... Same as before ... */ }
  showJournalPrompt(personId) { /* ... Same as before ... */ }
  saveReflections(personId) { /* ... Same as before ... */ }
  addSnapshotToHistory(personId) { /* ... Same as before ... */ }
  renderHistoryChart(person, canvasId) { /* ... Same as before ... */ }

  toggleSnapshotInfo(button) {
    console.log("[TOGGLE_SNAPSHOT_INFO] Toggle button clicked.");
    const detailsDiv = button.nextElementSibling; // Assumes div is immediately after button

    if (detailsDiv?.classList.contains('snapshot-details')) {
        const isVisible = detailsDiv.style.display !== 'none';
        detailsDiv.style.display = isVisible ? 'none' : 'block'; // Toggle display
        button.textContent = isVisible ? 'View Traits' : 'Hide Traits'; // Update button text
        // Update ARIA attribute if detailsDiv has one
        if (detailsDiv.hasAttribute('aria-labelledby')) {
            // We can use aria-expanded on the button itself, controlled by the visibility state
            button.setAttribute('aria-expanded', !isVisible);
        }
        console.log(`[TOGGLE_SNAPSHOT_INFO] Details visibility set to: ${!isVisible}`);
    } else {
        console.warn("[TOGGLE_SNAPSHOT_INFO] Could not find the '.snapshot-details' div next to the button:", button);
    }
} // --- End toggleSnapshotInfo ---

  // --- Auxiliary Feature Modals ---

  showAchievements() {
    console.log("[SHOW_ACHIEVEMENTS] Opening achievements modal.");
    const modal = this.elements.achievementsModal;
    const body = this.elements.achievementsBody;

    if (!modal || !body) {
        console.error("[SHOW_ACHIEVEMENTS] Failed: Achievements modal or body element not found.");
        this.showNotification("UI Error: Cannot display achievements.", "error");
        return;
    }

    // Render the list of all achievements (passing null for person)
    body.innerHTML = `
        <p style="text-align: center; margin-bottom: 1.5em;">Track your milestones and discoveries within KinkCompass!</p>
        ${this.renderAchievementsList(null)}
    `;

    this.openModal(modal);
    console.log("[SHOW_ACHIEVEMENTS] Achievements modal opened.");
} // --- End showAchievements ---

  showKinkOracle(personId) {
    console.log(`[SHOW_KINK_ORACLE] Consulting Oracle for Person ID: ${personId}`);
    const outputElement = document.getElementById('oracle-reading-output'); // Assumes this ID exists within the Insights tab
    if (!outputElement) {
        console.error("[SHOW_KINK_ORACLE] Failed: Oracle output element not found.");
        this.showNotification("UI Error: Cannot display Oracle reading.", "error");
        return;
    }

    const person = this.people.find(p => p.id === personId);
    if (!person) {
        console.error(`[SHOW_KINK_ORACLE] Failed: Person with ID ${personId} not found.`);
        outputElement.innerHTML = `<p class="error-text">Persona data not found.</p>`;
        return;
    }

    outputElement.innerHTML = `<p><i>Consulting the ethereal energies...</i> ✨</p>`; // Loading state

    // Simulate Oracle thinking time
    setTimeout(() => {
        try {
            const readingData = this.getKinkOracleReading(person); // Use class method
            if (!readingData) {
                throw new Error("Oracle returned no reading.");
            }

            // Display the reading
            outputElement.innerHTML = `
                <p>${escapeHTML(readingData.opening)}</p>
                <p><strong>Focus:</strong> ${escapeHTML(readingData.focus)}</p>
                <p><em>${escapeHTML(readingData.encouragement)}</em></p>
                <p>${escapeHTML(readingData.closing)}</p>
            `;
            console.log("[SHOW_KINK_ORACLE] Oracle reading displayed:", readingData);

            // Grant achievement
            grantAchievement(person, 'kink_reading_oracle', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));

        } catch (error) {
            console.error("[SHOW_KINK_ORACLE] Error getting or displaying Oracle reading:", error);
            outputElement.innerHTML = `<p class="muted-text">The Oracle is quiet today. Perhaps try again later?</p>`;
        }
    }, 500); // 0.5 second delay
} // --- End showKinkOracle ---

  displayDailyChallenge() {
    // console.log("[DAILY_CHALLENGE] Displaying today's focus."); // Can be noisy
    const challengeArea = document.getElementById('daily-challenge-area'); // Target area within live preview or insights tab
    if (!challengeArea) {
        // console.warn("[DAILY_CHALLENGE] Challenge display area not found in the current view.");
        return; // Silently fail if the area isn't present
    }

    try {
        const challenge = this.getDailyChallenge(null); // Get a general challenge for now
        if (challenge) {
            challengeArea.innerHTML = `
                <h4 style="margin-bottom:0.5em;">🌟 Today's Focus 🌟</h4>
                <h5>${escapeHTML(challenge.title)}</h5>
                <p>${escapeHTML(challenge.desc)}</p>
                <p class="muted-text"><small>(Category: ${escapeHTML(challenge.category)})</small></p>`;
            challengeArea.style.display = 'block'; // Ensure it's visible
            // console.log("[DAILY_CHALLENGE] Displayed challenge:", challenge);
            // Grant conceptual achievement (doesn't require persona save)
            grantAchievement({}, 'challenge_accepted', this.showNotification.bind(this));
        } else {
            console.log("[DAILY_CHALLENGE] No challenge available today.");
            challengeArea.innerHTML = '<p class="muted-text">No specific focus challenge today. Explore freely!</p>';
            challengeArea.style.display = 'block';
        }
    } catch (error) {
        console.error("[DAILY_CHALLENGE] Error getting or displaying challenge:", error);
        challengeArea.innerHTML = `<p class="error-text">Error loading today's focus.</p>`;
        challengeArea.style.display = 'block';
    }
} // --- End displayDailyChallenge ---


  showGlossary(termKeyToHighlight = null) {
    console.log(`[SHOW_GLOSSARY] Opening glossary. Highlight term: ${termKeyToHighlight || 'None'}`);
    const modal = this.elements.glossaryModal;
    const body = this.elements.glossaryBody;

    if (!modal || !body) {
        console.error("[SHOW_GLOSSARY] Failed: Glossary modal or body element not found.");
        this.showNotification("UI Error: Cannot display glossary.", "error");
        return;
    }

    body.innerHTML = ''; // Clear previous content

    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) =>
        (glossaryTerms[a]?.term || '').localeCompare(glossaryTerms[b]?.term || '')
    );

    if (sortedKeys.length === 0) {
        body.innerHTML = '<p>Glossary is currently empty.</p>';
    } else {
        const dl = document.createElement('dl');
        sortedKeys.forEach(key => {
            const termData = glossaryTerms[key];
            if (!termData?.term || !termData.definition) return; // Skip incomplete entries

            const dt = document.createElement('dt');
            dt.id = `glossary-${key}`; // ID for linking/highlighting
            dt.textContent = termData.term;

            const dd = document.createElement('dd');
            dd.textContent = termData.definition;

            // Add related terms if they exist
            if (termData.related && Array.isArray(termData.related) && termData.related.length > 0) {
                const relatedP = document.createElement('p');
                relatedP.className = 'related-terms';
                relatedP.innerHTML = 'Related: ';
                termData.related.forEach((relatedKey, index) => {
                    if (glossaryTerms[relatedKey]) {
                        const link = document.createElement('a');
                        link.href = `#glossary-${relatedKey}`; // Link to the term ID
                        link.textContent = glossaryTerms[relatedKey].term;
                        link.classList.add('glossary-link'); // Class for click handling
                        link.dataset.termKey = relatedKey; // Store key for easy lookup
                        relatedP.appendChild(link);
                        if (index < termData.related.length - 1) {
                            relatedP.appendChild(document.createTextNode(', ')); // Add comma separator
                        }
                    }
                });
                dd.appendChild(relatedP);
            }
            dl.appendChild(dt);
            dl.appendChild(dd);
        });
        body.appendChild(dl);
    }

    this.openModal(modal);
    console.log("[SHOW_GLOSSARY] Glossary modal opened.");

    // Handle highlighting and scrolling if a term key was provided
    if (termKeyToHighlight) {
        console.log(`[SHOW_GLOSSARY] Attempting to highlight and scroll to: ${termKeyToHighlight}`);
        // Use requestAnimationFrame to ensure the element exists and layout is complete
        requestAnimationFrame(() => {
            const element = document.getElementById(`glossary-${termKeyToHighlight}`);
            if (element) {
                console.log("[SHOW_GLOSSARY] Highlight target element found:", element);
                element.classList.add('highlighted-term');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log("[SHOW_GLOSSARY] Scrolled to highlighted term.");
                // Remove highlight after a delay
                setTimeout(() => {
                    element.classList.remove('highlighted-term');
                    console.log(`[SHOW_GLOSSARY] Highlight removed from ${termKeyToHighlight}.`);
                }, 2500); // 2.5 seconds
            } else {
                console.warn(`[SHOW_GLOSSARY] Element ID not found for highlighting: glossary-${termKeyToHighlight}`);
            }
        });
    }
} // --- End showGlossary ---

  showStyleDiscovery(styleNameToHighlight = null) {
    console.log(`[STYLE_DISCOVERY] Opening style discovery. Highlight: ${styleNameToHighlight || 'None'}`);
    const modal = this.elements.styleDiscoveryModal;
    const body = this.elements.styleDiscoveryBody;
    const roleFilter = this.elements.styleDiscoveryRoleFilter;

    if (!modal || !body || !roleFilter) {
        console.error("[STYLE_DISCOVERY] Failed: Style Discovery modal elements missing.");
        this.showNotification("UI Error: Cannot display style discovery.", "error");
        return;
    }

    // Reset filter to 'all' when opening
    roleFilter.value = 'all';
    console.log("[STYLE_DISCOVERY] Filter reset to 'all'.");

    // Render the content based on the initial 'all' filter
    this.renderStyleDiscoveryContent(styleNameToHighlight); // Pass highlight name

    this.openModal(modal);
    console.log("[STYLE_DISCOVERY] Style Discovery modal opened.");
} // --- End showStyleDiscovery ---

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
    // If called by event listener, highlight is null. If called by showStyleDiscovery, it might have a value.
    const highlightName = typeof styleNameToHighlight === 'string' ? styleNameToHighlight : null;
    console.log(`[RENDER_STYLE_DISCOVERY] Rendering content. Highlight target: ${highlightName || 'None'}`);

    const body = this.elements.styleDiscoveryBody;
    const selectedRole = this.elements.styleDiscoveryRoleFilter.value;
    console.log(`[RENDER_STYLE_DISCOVERY] Filter set to: ${selectedRole}`);

    if (!body) {
        console.error("[RENDER_STYLE_DISCOVERY] Failed: Style Discovery body element missing.");
        return;
    }

    body.innerHTML = '<p class="loading-text">Loading styles...</p>'; // Loading indicator

    let stylesToDisplay = [];
    const rolesToInclude = selectedRole === 'all'
        ? ['submissive', 'dominant', 'switch'] // Include all defined roles
        : [selectedRole]; // Include only the selected role

    rolesToInclude.forEach(roleKey => {
        if (bdsmData[roleKey]?.styles) {
            // Add the role key to each style object for context
            stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({
                ...style,
                role: roleKey // Store the role the style belongs to
            })));
        }
    });

    // Sort all collected styles alphabetically by name
    stylesToDisplay.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    console.log(`[RENDER_STYLE_DISCOVERY] Found ${stylesToDisplay.length} styles matching filter.`);

    if (stylesToDisplay.length === 0) {
        body.innerHTML = '<p>No styles found matching the current filter.</p>';
        return;
    }

    // Generate HTML for each style
    let contentHTML = '';
    stylesToDisplay.forEach(style => {
        // Generate a unique ID for linking/highlighting
        const styleIdSafe = `style-discovery-${escapeHTML(style.role)}-${escapeHTML(style.name.replace(/[^a-zA-Z0-9]/g, '-'))}`;
        const summary = style.summary || "No summary available.";

        // Gather trait names (less critical here, maybe just show summary)
        // const coreTraitNames = bdsmData[style.role]?.coreTraits?.map(t => t.name) || [];
        // const styleTraitNames = style.traits?.map(t => t.name) || [];
        // const allTraitNames = [...new Set([...coreTraitNames, ...styleTraitNames])];
        // const traitsList = allTraitNames.length > 0 ? `<p><small>Traits: ${allTraitNames.map(t => escapeHTML(t)).join(', ')}</small></p>` : '';

        contentHTML += `
            <div class="style-discovery-item" id="${styleIdSafe}">
                <h4>${escapeHTML(style.name)} <small>(${escapeHTML(style.role)})</small></h4>
                <p>${escapeHTML(summary)}</p>
                 <!-- ${traitsList} --> {/* Optionally add traits list back if desired */}
            </div>`;
    });

    body.innerHTML = contentHTML;
    console.log("[RENDER_STYLE_DISCOVERY] Finished rendering style items.");

    // Handle highlighting if a name was provided
    if (highlightName) {
        console.log(`[RENDER_STYLE_DISCOVERY] Attempting to highlight style: ${highlightName}`);
        requestAnimationFrame(() => {
            let elementToHighlight = null;
            // Find the element whose h4 contains the highlight name (case-insensitive check might be better)
            const items = body.querySelectorAll('.style-discovery-item');
            items.forEach(item => {
                const h4 = item.querySelector('h4');
                // Check if h4 exists and its text content *includes* the name (flexible matching)
                if (h4 && h4.textContent.toLowerCase().includes(highlightName.toLowerCase())) {
                    elementToHighlight = item;
                 }
                 // Exact match if needed:
                 // if (h4 && h4.textContent.split('<')[0].trim() === highlightName) { elementToHighlight = item; }
            });

            if (elementToHighlight) {
                console.log("[RENDER_STYLE_DISCOVERY] Found highlight target element:", elementToHighlight);
                elementToHighlight.classList.add('highlighted-style');
                elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log("[RENDER_STYLE_DISCOVERY] Scrolled to highlighted style.");
                // Remove highlight after delay
                setTimeout(() => {
                    elementToHighlight.classList.remove('highlighted-style');
                    console.log(`[RENDER_STYLE_DISCOVERY] Highlight removed from ${highlightName}.`);
                }, 2500);
            } else {
                console.warn(`[RENDER_STYLE_DISCOVERY] Style element to highlight not found: ${highlightName}`);
            }
        });
    }
} // --- End renderStyleDiscoveryContent ---

  // --- Data Import/Export ---

  exportData() {
    console.log("[EXPORT_DATA] Starting data export.");
    try {
        // Create object with versioning and the persona data
        const exportObject = {
            version: "KinkCompass_v2.8.7", // Update version string
            exportedAt: new Date().toISOString(),
            people: this.people
        };

        const dataStr = JSON.stringify(exportObject, null, 2); // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        link.download = `kinkcompass_backup_${timestamp}.json`; // Filename with date
        console.log(`[EXPORT_DATA] Preparing download for file: ${link.download}`);

        // Trigger download and clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Free up memory

        this.showNotification("Persona data exported successfully!", "success");
        grantAchievement({}, 'data_exported', this.showNotification.bind(this)); // Grant global achievement
        console.log("[EXPORT_DATA] END - Export successful.");

    } catch (error) {
        console.error("[EXPORT_DATA] Error during data export:", error);
        this.showNotification("Data export failed. See console for details.", "error");
    }
} // --- End exportData ---

  importData(event) {
    console.log("[IMPORT_DATA] Import process started.");
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
        console.log("[IMPORT_DATA] No file selected.");
        return; // Exit if no file was chosen
    }

    console.log(`[IMPORT_DATA] File selected: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

    // Basic validation
    if (file.type !== 'application/json') {
        this.showNotification("Import failed: File must be a valid '.json' file.", "error", 5000);
        console.warn("[IMPORT_DATA] Invalid file type selected.");
        fileInput.value = null; // Reset file input
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // Limit size (e.g., 5MB) to prevent browser freeze
         this.showNotification("Import failed: File size is too large (max 5MB).", "error", 5000);
         console.warn("[IMPORT_DATA] File size exceeds limit.");
         fileInput.value = null;
         return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        console.log("[IMPORT_DATA] File read successfully.");
        try {
            const importedData = JSON.parse(e.target.result);
            console.log("[IMPORT_DATA] JSON parsed successfully.");

            // --- Data Validation ---
            if (!importedData?.people || !Array.isArray(importedData.people)) {
                throw new Error("Invalid file format: Missing 'people' array.");
            }
            console.log(`[IMPORT_DATA] Found ${importedData.people.length} personas in the file.`);
            // Add more specific validation if needed (e.g., check if people have IDs and names)

            // --- Confirmation ---
            if (!confirm(`Import ${importedData.people.length} personas? This will REPLACE all current persona data.`)) {
                console.log("[IMPORT_DATA] User cancelled import.");
                fileInput.value = null; // Reset file input
                return;
            }

            console.log("[IMPORT_DATA] User confirmed import. Replacing data...");
            this.people = importedData.people;

            // --- Post-Import Sanitization/Migration ---
            console.log("[IMPORT_DATA] Sanitizing imported data...");
             this.people.forEach(p => {
                 if (!p.id) p.id = Date.now() + Math.random();
                 if (!p.achievements) p.achievements = [];
                 if (!p.goals) p.goals = [];
                 if (!p.history) p.history = [];
                 if (p.reflections === undefined) p.reflections = "";
                 // Add checks for other potentially missing fields if necessary
             });
             console.log("[IMPORT_DATA] Sanitization complete.");

            // --- Save and Update UI ---
            this.saveToLocalStorage(); // Save the newly imported data
            this.renderList(); // Update the list display
            this.resetForm(); // Reset the form
            this.showNotification("Persona data imported successfully!", "success");
            grantAchievement({}, 'data_imported', this.showNotification.bind(this)); // Grant global achievement
            console.log("[IMPORT_DATA] END - Import successful.");

        } catch (error) {
            console.error("[IMPORT_DATA] Error processing imported file:", error);
            this.showNotification(`Import failed: ${error.message}. Check file format.`, "error", 6000);
        } finally {
            fileInput.value = null; // Reset file input regardless of success/failure
            console.log("[IMPORT_DATA] File input reset.");
        }
    }; // --- End reader.onload ---

    reader.onerror = (e) => {
        console.error("[IMPORT_DATA] Error reading file:", e);
        this.showNotification("Error reading the selected file.", "error");
        fileInput.value = null; // Reset file input
    };

    console.log("[IMPORT_DATA] Starting to read file as text...");
    reader.readAsText(file); // Read the file content
} // --- End importData ---

  // --- Popups ---

  showTraitInfo(traitName, triggerButton = null) {
    console.log(`[SHOW_TRAIT_INFO] Showing info for trait: ${traitName}`);
    const popup = this.elements.traitInfoPopup;
    const title = this.elements.traitInfoTitle;
    const body = this.elements.traitInfoBody;

    if (!popup || !title || !body) {
        console.error("[SHOW_TRAIT_INFO] Failed: Trait info popup elements missing.");
        return;
    }

    let explanation = `Details for '${escapeHTML(traitName)}' not found.`;
    let found = false;

    // Search for explanation within bdsmData
    for (const roleKey in bdsmData) {
        const roleData = bdsmData[roleKey];
        // Check core traits
        const coreTrait = roleData.coreTraits?.find(t => t.name === traitName);
        if (coreTrait?.explanation) {
            explanation = coreTrait.explanation;
            found = true;
            break;
        }
        // Check style-specific traits
        const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (styleTrait?.explanation) {
            explanation = styleTrait.explanation;
            found = true;
            break;
        }
    }

    if (!found) {
        console.warn(`[SHOW_TRAIT_INFO] Explanation not found in bdsmData for trait: ${traitName}`);
        // Optional: Check glossary as a fallback?
         if (glossaryTerms[traitName]?.definition) {
             explanation = glossaryTerms[traitName].definition;
             console.log(`[SHOW_TRAIT_INFO] Found definition in glossary for ${traitName}.`);
         }
    }

    title.textContent = `About: ${escapeHTML(traitName)}`;
    body.innerHTML = `<p>${escapeHTML(explanation)}</p>`; // Use innerHTML if explanation might contain basic HTML (though escaping is safer)

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    // Manage focus
    this.elementThatOpenedModal = triggerButton || document.activeElement; // Store focus return target
    this.elements.traitInfoClose?.focus(); // Focus on the close button within the popup

    console.log("[SHOW_TRAIT_INFO] Popup displayed.");

    // Grant achievement (only needs global tracking)
    grantAchievement({}, 'trait_info_viewed', this.showNotification.bind(this));
} // --- End showTraitInfo ---

  hideTraitInfo() {
    console.log("[HIDE_TRAIT_INFO] Hiding trait info popup.");
    const popup = this.elements.traitInfoPopup;
    if (!popup) return;

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Return focus to the element that opened the popup
    const triggerButton = document.querySelector('.trait-info-btn[aria-expanded="true"]');
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'false'); // Reset ARIA state
        try {
            triggerButton.focus();
            console.log("[HIDE_TRAIT_INFO] Focus returned to trigger button.");
        } catch (e) {
            console.warn("[HIDE_TRAIT_INFO] Error returning focus to trigger button:", e);
            document.body.focus(); // Fallback
        }
    } else if (this.elementThatOpenedModal) {
         try {
             this.elementThatOpenedModal.focus();
             console.log("[HIDE_TRAIT_INFO] Focus returned to stored element.");
         } catch (e) {
             console.warn("[HIDE_TRAIT_INFO] Error returning focus to stored element:", e);
             document.body.focus(); // Fallback
         }
         this.elementThatOpenedModal = null; // Clear stored element
    } else {
         console.log("[HIDE_TRAIT_INFO] No trigger button or stored element found to return focus to.");
         document.body.focus(); // Fallback focus
    }
} // --- End hideTraitInfo ---

  showContextHelp(helpKey, triggerButton = null) {
    console.log(`[SHOW_CONTEXT_HELP] Showing help for key: ${helpKey}`);
    const popup = this.elements.contextHelpPopup;
    const title = this.elements.contextHelpTitle;
    const body = this.elements.contextHelpBody;

    if (!popup || !title || !body) {
        console.error("[SHOW_CONTEXT_HELP] Failed: Context help popup elements missing.");
        return;
    }

    const helpText = contextHelpTexts[helpKey] || "No specific help available for this item.";
    console.log(`[SHOW_CONTEXT_HELP] Help text: "${helpText}"`);

    // Use trait name for title if it's a trait help key
    const displayTitle = glossaryTerms[helpKey]?.term || escapeHTML(helpKey);
    title.textContent = `Help: ${displayTitle}`;
    body.innerHTML = `<p>${escapeHTML(helpText)}</p>`;

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    // Manage focus and ARIA state
    this.elementThatOpenedModal = triggerButton || document.activeElement; // Store focus return
    // Close other open help popups and reset their triggers
    document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => {
        if (btn !== triggerButton) {
            btn.setAttribute('aria-expanded', 'false');
        }
    });
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'true'); // Mark active trigger
    }
    this.elements.contextHelpClose?.focus(); // Focus close button in popup

    console.log("[SHOW_CONTEXT_HELP] Context help popup displayed.");
} // --- End showContextHelp ---

  hideContextHelp() {
    console.log("[HIDE_CONTEXT_HELP] Hiding context help popup.");
    const popup = this.elements.contextHelpPopup;
    if (!popup) return;

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Return focus and reset ARIA state
    const triggerButton = document.querySelector('.context-help-btn[aria-expanded="true"]');
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'false');
        try {
            triggerButton.focus();
            console.log("[HIDE_CONTEXT_HELP] Focus returned to trigger button.");
        } catch (e) {
             console.warn("[HIDE_CONTEXT_HELP] Error returning focus to trigger button:", e);
             document.body.focus(); // Fallback
        }
    } else if (this.elementThatOpenedModal) {
         try {
             this.elementThatOpenedModal.focus();
             console.log("[HIDE_CONTEXT_HELP] Focus returned to stored element.");
         } catch (e) {
              console.warn("[HIDE_CONTEXT_HELP] Error returning focus to stored element:", e);
              document.body.focus(); // Fallback
         }
         this.elementThatOpenedModal = null;
    } else {
         console.log("[HIDE_CONTEXT_HELP] No trigger button or stored element found to return focus to.");
         document.body.focus(); // Fallback
    }
} // --- End hideContextHelp ---

  // --- Style Finder Methods ---

  sfStart() {
    console.log("[SF_START] Initiating Style Finder.");
    this.styleFinderActive = true;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} }; // Reset answers
    this.styleFinderScores = {};
    this.previousScores = null;
    this.hasRenderedDashboard = false;
    this.sfSliderInteracted = false; // Reset interaction flag

    // Reset UI elements
    if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = '';
    if(this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '<p>Loading quest...</p>';
    if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';
    if(this.elements.sfDashboard) {
        this.elements.sfDashboard.innerHTML = '';
        this.elements.sfDashboard.style.display = 'none';
    }

    this.sfRenderStep(); // Render the first step (usually role selection)
    this.openModal(this.elements.sfModal); // Open the modal
    console.log("[SF_START] Style Finder modal opened and initialized.");
}

  sfClose() {
    console.log("[SF_CLOSE] Closing Style Finder.");
    this.styleFinderActive = false;
    this.closeModal(this.elements.sfModal);
    // Optionally reset form state if needed upon closing SF
    // this.resetForm(false);
}

  sfCalculateSteps() {
    const steps = [{ type: 'role_selection', title: 'Choose Your Path', text: 'Which role resonates more with you right now?' }];
    if (this.styleFinderRole) {
        // Determine traits based on selected role
        this.styleFinderTraits = this.styleFinderRole === 'submissive' ? sfSubFinderTraits : sfDomFinderTraits;
        this.traitFootnotes = this.styleFinderRole === 'submissive' ? sfSubTraitFootnotes : sfDomTraitFootnotes;
        this.sliderDescriptions = sfSliderDescriptions; // Use combined descriptions

        // Randomize trait order (Fisher-Yates shuffle)
        const shuffledTraits = [...this.styleFinderTraits];
        for (let i = shuffledTraits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTraits[i], shuffledTraits[j]] = [shuffledTraits[j], shuffledTraits[i]];
        }

        // Add trait steps
        shuffledTraits.forEach(trait => {
            steps.push({ type: 'trait', trait: trait.name, desc: trait.desc });
        });
    }
    steps.push({ type: 'result', title: 'Your Style Compass Reading!' });
    return steps;
}

  sfRenderStep() {
    if (!this.styleFinderActive || !this.elements.sfStepContent || !this.elements.sfProgressTracker) {
         console.error("[SF_RENDER_STEP] Cannot render, SF not active or elements missing.");
         return;
    }

    this.elements.sfStepContent.classList.add('loading'); // Add loading state

    const steps = this.sfCalculateSteps();
    const currentStepIndex = this.styleFinderStep;
    const totalSteps = steps.length;
    const currentStepData = steps[currentStepIndex];

    // Update progress tracker
    this.elements.sfProgressTracker.textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;

    let html = '';

    switch (currentStepData.type) {
        case 'role_selection':
            html = `
                <h2>${escapeHTML(currentStepData.title)}</h2>
                <p>${escapeHTML(currentStepData.text)}</p>
                <div class="sf-button-container">
                    <button type="button" data-action="setRole" data-role="submissive">Submissive Path 🙇‍♀️</button>
                    <button type="button" data-action="setRole" data-role="dominant">Dominant Path 👑</button>
                </div>`;
            break;

        case 'trait':
            const traitName = currentStepData.trait;
            const traitDesc = currentStepData.desc;
            const currentValue = this.styleFinderAnswers.traits[traitName] || 5; // Default to 5 (middle)
            const footnote = this.traitFootnotes[traitName] || '';
            const sliderDescArray = this.sliderDescriptions[traitName] || [];
            const currentDescText = sliderDescArray[currentValue - 1] || 'Move the slider...';

            html = `
                <h2>${escapeHTML(traitName)}
                    <button type="button" class="sf-info-icon" data-trait="${traitName}" aria-label="Info about ${escapeHTML(traitName)}">?</button>
                </h2>
                <p>${escapeHTML(traitDesc)}</p>
                <input type="range" class="sf-trait-slider" data-trait="${traitName}" min="1" max="10" value="${currentValue}" aria-label="${escapeHTML(traitName)} rating">
                <div class="sf-slider-description" id="sf-desc-${traitName}">${escapeHTML(currentDescText)}</div>
                <div class="sf-slider-footnote">${escapeHTML(footnote)}</div>
                <div class="sf-button-container">
                    ${currentStepIndex > 0 ? '<button type="button" data-action="prev" class="small-btn">⬅️ Previous</button>' : ''}
                    <button type="button" data-action="next" data-currenttrait="${traitName}">Next ➡️</button>
                </div>`;
            this.sfSliderInteracted = false; // Reset interaction flag for the new step
             // Show dashboard only after first trait step is rendered
             if (!this.hasRenderedDashboard && this.styleFinderRole) {
                 this.sfUpdateDashboard(true); // Force dashboard visible
                 this.hasRenderedDashboard = true;
             }
            break;

        case 'result':
            const resultData = this.sfCalculateResult();
            html = `
                <h2>${escapeHTML(currentStepData.title)}</h2>
                <p>Based on your responses, here are styles that seem to resonate:</p>
                <div id="summary-dashboard">
                     ${this.sfGenerateSummaryDashboard(resultData.sortedScores)}
                </div>
                <hr>
                <div class="sf-result-section">
                    <h3>✨ Top Suggestion: ${escapeHTML(resultData.topStyle.name)} ${sfStyleIcons[resultData.topStyle.name] || ''}</h3>
                    <p>${escapeHTML(resultData.topStyleDetails?.long || 'Details loading...')}</p>
                    <h4>Possible Match: ${sfStyleIcons[resultData.topMatch?.match] || ''} ${escapeHTML(resultData.topMatch?.match || '?')}</h4>
                    <p><em>Dynamic: ${escapeHTML(resultData.topMatch?.dynamic || '?')}</em> - ${escapeHTML(resultData.topMatch?.longDesc || '?')}</p>
                    <h4>Tips:</h4>
                    <ul>${resultData.topStyleDetails?.tips?.map(tip => `<li>${escapeHTML(tip)}</li>`).join('') || '<li>Communicate!</li>'}</ul>
                </div>
                <div class="sf-button-container result-buttons">
                    <button type="button" data-action="confirmApply" data-role="${this.styleFinderRole}" data-style="${escapeHTML(resultData.topStyle.name)}">Apply '${escapeHTML(resultData.topStyle.name)}' to Form</button>
                    <button type="button" data-action="prev" class="small-btn">⬅️ Back to Traits</button>
                    <button type="button" data-action="startOver" class="clear-btn">Start Over 🔄</button>
                </div>`;
             // Trigger confetti celebration
             if (typeof confetti === 'function') {
                 confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
             }
            break;

        default:
            html = '<p class="error-text">Error: Unknown step type.</p>';
            console.error(`[SF_RENDER_STEP] Unknown step type: ${currentStepData.type}`);
    }

    // Use requestAnimationFrame to update content after loading state might be visible
    requestAnimationFrame(() => {
        this.elements.sfStepContent.innerHTML = html;
        this.elements.sfStepContent.classList.remove('loading');
        // Focus management - focus first interactive element?
        const firstButton = this.elements.sfStepContent.querySelector('button, input[type="range"]');
        if (firstButton) {
            // firstButton.focus(); // Be careful with auto-focus, might be annoying
        }
    });
} // --- End sfRenderStep ---

  sfSetRole(role) {
    if (role === 'submissive' || role === 'dominant') {
        console.log(`[SF_SET_ROLE] Role set to: ${role}`);
        this.styleFinderRole = role;
        this.styleFinderAnswers = { traits: {} }; // Reset traits when role changes
        this.styleFinderScores = {};
        this.previousScores = null;
        this.hasRenderedDashboard = false; // Reset dashboard flag
        this.sfNextStep(); // Move to the first trait step
    } else {
        console.warn(`[SF_SET_ROLE] Invalid role attempted: ${role}`);
        this.sfShowFeedback("Please select a valid role.", "error");
    }
}

  sfSetTrait(trait, value) {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
        this.styleFinderAnswers.traits[trait] = numericValue;
        // console.log(`[SF_SET_TRAIT] Set ${trait} to ${numericValue}`); // Can be noisy
    } else {
        console.warn(`[SF_SET_TRAIT] Invalid value '${value}' for trait '${trait}'`);
    }
}

  sfNextStep(currentTrait = null) {
    console.log(`[SF_NEXT_STEP] Moving from step ${this.styleFinderStep}. Current trait (if any): ${currentTrait}`);
    const steps = this.sfCalculateSteps();
    const currentStepData = steps[this.styleFinderStep];

    // --- Validation: Ensure slider was moved on trait steps ---
    if (currentStepData?.type === 'trait' && !this.sfSliderInteracted) {
        this.sfShowFeedback("Please adjust the slider before proceeding!", "warning");
        console.warn("[SF_NEXT_STEP] Blocked: Slider not interacted with for trait:", currentTrait);
        // Add visual feedback (shake animation)
        const slider = this.elements.sfStepContent?.querySelector(`input[data-trait="${currentTrait}"]`);
        if(slider) {
            slider.classList.add('shake-animation');
            // Remove animation after it finishes
            setTimeout(() => slider.classList.remove('shake-animation'), 500);
        }
        return; // Stop processing next step
    }

    const totalSteps = steps.length;
    if (this.styleFinderStep < totalSteps - 1) {
        this.styleFinderStep++;
        console.log(`[SF_NEXT_STEP] Advanced to step ${this.styleFinderStep}`);
        this.sfRenderStep(); // Render the new step
    } else {
        console.log("[SF_NEXT_STEP] Already on the last step (results).");
        // Maybe re-render results if needed, or do nothing
    }
}

  sfPrevStep() {
    if (this.styleFinderStep > 0) {
         // Check if going back from results step
         const currentStepType = this.sfCalculateSteps()[this.styleFinderStep].type;
         if (currentStepType === 'result') {
              // Hide dashboard when going back from results? Or keep it visible?
              // if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'block'; // Keep it visible
         }

        this.styleFinderStep--;
        console.log(`[SF_PREV_STEP] Moved back to step ${this.styleFinderStep}`);
        this.sfRenderStep();
         // Ensure dashboard is visible when back on a trait step
         if (this.sfCalculateSteps()[this.styleFinderStep].type === 'trait') {
             this.sfUpdateDashboard(true); // Force visible
         }
    } else {
        console.log("[SF_PREV_STEP] Already on the first step.");
    }
}

  sfStartOver() {
    console.log("[SF_START_OVER] Restarting Style Finder.");
    this.sfStart(); // Re-initialize everything
}

  // Calculates scores based on current answers
  sfComputeScores(temporary = false) {
    let scores = {};
    if (!this.styleFinderRole || !sfStyles[this.styleFinderRole]) {
        console.warn("[SF_COMPUTE_SCORES] Cannot compute scores: Role not set or invalid.");
        return scores;
    }

    const relevantStyles = sfStyles[this.styleFinderRole];
    // Initialize scores for all relevant styles to 0
    relevantStyles.forEach(style => {
        scores[style] = 0;
    });

    // Apply points based on trait answers and key traits
    Object.entries(this.styleFinderAnswers.traits).forEach(([trait, rating]) => {
        const scoreValue = parseInt(rating, 10);
        if (isNaN(scoreValue)) return; // Skip if rating is invalid

        relevantStyles.forEach(style => {
            const keyTraitsForStyle = sfStyleKeyTraits[style] || [];
            // Grant points if the answered trait is a key trait for the style
            if (keyTraitsForStyle.includes(trait)) {
                // Basic scoring: add the rating value
                scores[style] += scoreValue;

                // Bonus/Penalty for extremes (adjust weights as needed)
                if (scoreValue >= 9) scores[style] += 3; // Bonus for strong match
                else if (scoreValue >= 7) scores[style] += 1;
                else if (scoreValue <= 3) scores[style] -= 1; // Penalty for low match
                 else if (scoreValue <= 1) scores[style] -= 3;
            }
             // Optional: Add inverse scoring for opposing traits if defined
             // Example: If 'obedience' is high, maybe slightly penalize 'Brat' score
        });
    });

    // Normalize scores (0-100 scale) relative to the highest score achieved
    // Only normalize final results, not temporary dashboard updates? Or normalize always? Let's normalize always for consistency.
    let highestScore = 0;
     Object.values(scores).forEach(score => {
         // Ensure scores don't go below zero before finding max
         if (score < 0) score = 0;
         if (score > highestScore) highestScore = score;
     });


     // Avoid division by zero and handle cases where all scores are 0 or negative
     if (highestScore > 0) {
         Object.keys(scores).forEach(style => {
             scores[style] = Math.max(0, Math.round((scores[style] / highestScore) * 100)); // Normalize to 0-100
         });
     } else {
          // If highest score is 0, all scores remain 0 (or whatever they were clamped to)
          Object.keys(scores).forEach(style => {
             scores[style] = Math.max(0, scores[style]);
         });
     }

    // if (!temporary) console.log("[SF_COMPUTE_SCORES] Final Scores:", scores); // Log final scores
    return scores;
} // --- End sfComputeScores ---

  // Updates the live dashboard during trait steps
  sfUpdateDashboard(forceVisible = false) {
    if (!this.elements.sfDashboard || !this.styleFinderRole) return;

    const currentScores = this.sfComputeScores(true); // Compute temporary scores

    // Determine changes from previous scores for animation
    const scoreChanges = {};
    if (this.previousScores) {
        Object.keys(currentScores).forEach(style => {
            const diff = currentScores[style] - (this.previousScores[style] || 0);
            if (diff !== 0) {
                scoreChanges[style] = { diff, direction: diff > 0 ? 'up' : 'down' };
            }
        });
    }

    // Sort scores for display (highest first)
    const sortedScores = Object.entries(currentScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    // Generate HTML
    let dashboardHTML = `<h4 class="sf-dashboard-header">Style Resonance ✨</h4>`;
    sortedScores.forEach(([style, score]) => {
        const change = scoreChanges[style];
        const changeHTML = change
            ? `<span class="sf-score-delta ${change.direction === 'up' ? 'positive' : 'negative'}">${change.direction === 'up' ? '+' : ''}${change.diff}</span> <span class="sf-move-${change.direction}">${change.direction === 'up' ? '▲' : '▼'}</span>`
            : ''; // Show change indicator

         // Simple bar representation
         const barWidth = Math.max(0, Math.min(100, score)); // Use the 0-100 score directly
         const barHTML = `<div style="width: ${barWidth}%; height: 8px; background: var(--accent-color); border-radius: 4px; transition: width 0.3s ease;"></div>`;

        dashboardHTML += `
            <div class="sf-dashboard-item">
                <span class="sf-style-name">${escapeHTML(style)} ${sfStyleIcons[style] || ''}</span>
                 <div style="width: 60px; background: var(--border-color); border-radius: 4px; overflow: hidden;">${barHTML}</div> {/* Bar container */}
                <span class="sf-dashboard-score">${score}% ${changeHTML}</span>
            </div>`;
    });

    this.elements.sfDashboard.innerHTML = dashboardHTML;

    // Ensure dashboard is visible if forced or if it wasn't rendered before
    if (forceVisible || !this.hasRenderedDashboard) {
        this.elements.sfDashboard.style.display = 'block';
        this.elements.sfDashboard.style.animation = 'sfFadeIn 0.5s ease'; // Add fade-in effect
    }

    // Store current scores for next update comparison
    this.previousScores = currentScores;
} // --- End sfUpdateDashboard ---

  // Calculates the final result object
  sfCalculateResult() {
    console.log("[SF_CALCULATE_RESULT] Calculating final results...");
    const finalScores = this.sfComputeScores(false); // Compute non-temporary, normalized scores

    const sortedScores = Object.entries(finalScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    if (sortedScores.length === 0) {
        console.warn("[SF_CALCULATE_RESULT] No scores available to determine result.");
        return {
            topStyle: { name: "Undetermined", score: 0 },
            topStyleDetails: { short: "N/A", long: "Could not determine a top style.", tips: ["Try answering more questions!"] },
            topMatch: null,
            sortedScores: []
        };
    }

    const topStyleName = sortedScores[0][0];
    const topStyleScore = sortedScores[0][1];

    const topStyleDetails = sfStyleDescriptions[topStyleName] || null;
    const topMatch = sfDynamicMatches[topStyleName] || null;

    if (!topStyleDetails) console.warn(`[SF_CALCULATE_RESULT] Missing description for top style: ${topStyleName}`);
    if (!topMatch) console.warn(`[SF_CALCULATE_RESULT] Missing dynamic match for top style: ${topStyleName}`);

    const result = {
        topStyle: { name: topStyleName, score: topStyleScore },
        topStyleDetails: topStyleDetails || { short: "Details unavailable.", long: "No long description found.", tips: [] },
        topMatch: topMatch || { dynamic: "N/A", match: "N/A", desc: "N/A", longDesc: "No match data found." },
        sortedScores: sortedScores // Include all sorted scores
    };

    console.log("[SF_CALCULATE_RESULT] Final result determined:", result.topStyle.name);
    return result;
} // --- End sfCalculateResult ---

  // Generates HTML for the summary dashboard on the results step
  sfGenerateSummaryDashboard(sortedScores) {
    console.log("[SF_GEN_SUMMARY_DASH] Generating summary dashboard.");
    if (!sortedScores || sortedScores.length === 0) {
        return '<p>No results to display.</p>';
    }

    let dashboardHTML = `<h4 class="sf-dashboard-header">Overall Resonance</h4>`;
    // Show top 5-7 results? Or all? Let's show top 5 for clarity.
    sortedScores.slice(0, 5).forEach(([style, score]) => {
         const barWidth = Math.max(0, Math.min(100, score));
         const barHTML = `<div style="width: ${barWidth}%; height: 8px; background: var(--accent-color); border-radius: 4px;"></div>`;

        dashboardHTML += `
            <div class="sf-dashboard-item">
                <span class="sf-style-name">${escapeHTML(style)} ${sfStyleIcons[style] || ''}</span>
                 <div style="width: 80px; background: var(--border-color); border-radius: 4px; overflow: hidden;">${barHTML}</div> {/* Bar container */}
                <span class="sf-dashboard-score">${score}%</span>
            </div>`;
    });
     if (sortedScores.length > 5) {
         dashboardHTML += `<p class="muted-text" style="text-align: center; margin-top: 0.5em;">(Top 5 shown)</p>`;
     }

    return dashboardHTML;
} // --- End sfGenerateSummaryDashboard ---

  // Shows feedback messages within the Style Finder modal
  sfShowFeedback(message, type = 'info') {
    if (!this.elements.sfFeedback) return;
    console.log(`[SF_FEEDBACK] Type: ${type}, Message: ${message}`);
    this.elements.sfFeedback.textContent = message;
    this.elements.sfFeedback.className = `sf-feedback feedback-${type}`; // Add type class for styling
    // Add animation
    this.elements.sfFeedback.classList.remove('feedback-animation');
    void this.elements.sfFeedback.offsetWidth; // Trigger reflow
    this.elements.sfFeedback.classList.add('feedback-animation');
}

  // Shows trait info popup specifically within the Style Finder context
  sfShowTraitInfo(traitName, triggerElement = null) {
    console.log(`[SF_SHOW_TRAIT_INFO] Showing SF info for trait: ${traitName}`);
    const explanation = sfTraitExplanations[traitName] || "No specific explanation available for this trait in the Style Finder.";

    // Remove any existing popups first
    const existingPopup = document.querySelector('.sf-style-info-popup');
    if (existingPopup) existingPopup.remove();

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card'; // Use SF specific popup class
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-popup-title');

    popup.innerHTML = `
        <button class="sf-close-btn" onclick="this.parentElement.remove(); document.querySelector('.sf-info-icon.active')?.classList.remove('active');" aria-label="Close">×</button>
        <h3 id="sf-popup-title">About: ${escapeHTML(traitName)}</h3>
        <p>${escapeHTML(explanation)}</p>
    `;

    document.body.appendChild(popup);

    // Manage focus and active state
    popup.querySelector('.sf-close-btn')?.focus();
    if (triggerElement) {
        // Remove active class from previously active trigger, if any
        document.querySelector('.sf-info-icon.active')?.classList.remove('active');
        triggerElement.classList.add('active'); // Mark the current button as active
    }
    console.log("[SF_SHOW_TRAIT_INFO] SF Trait Info popup displayed.");
} // --- End sfShowTraitInfo ---

  // Shows the full details popup for a specific style from the results page
  sfShowFullDetails(styleNameWithEmoji, triggerElement = null) {
    // Clean the style name to remove emojis for lookup
    let styleName = styleNameWithEmoji.replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]+)/gu, '').trim();
    console.log(`[SF_SHOW_FULL_DETAILS] Showing full details for cleaned style: "${styleName}"`);

    const descData = sfStyleDescriptions[styleName];
    const matchData = sfDynamicMatches[styleName];

    if (!descData || !matchData) {
        console.error(`[SF_SHOW_FULL_DETAILS] Data missing for style: "${styleName}"`);
        this.sfShowFeedback("Cannot load full details for this style.", "error");
        return;
    }

    // Remove existing popups
    const existingPopup = document.querySelector('.sf-style-info-popup');
    if (existingPopup) existingPopup.remove();

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card wide-popup'; // Use SF specific class, make it wide
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-detail-popup-title');

    popup.innerHTML = `
        <button class="sf-close-btn" onclick="this.parentElement.remove(); document.querySelector('button[data-action=\"showDetails\"].active')?.classList.remove('active');" aria-label="Close">×</button>
        <h3 id="sf-detail-popup-title">${escapeHTML(styleNameWithEmoji)} Details</h3>

        <h4>Summary</h4>
        <p><strong>${escapeHTML(descData.short)}</strong></p>
        <p>${escapeHTML(descData.long)}</p>

        <h4>Potential Match: ${sfStyleIcons[matchData.match] || ''} ${escapeHTML(matchData.match)}</h4>
        <p><em>Dynamic: ${escapeHTML(matchData.dynamic)}</em></p>
        <p>${escapeHTML(matchData.longDesc)}</p>

        <h4>Tips:</h4>
        <ul>${descData.tips.map(tip => `<li>${escapeHTML(tip)}</li>`).join('')}</ul>
    `;

    document.body.appendChild(popup);

    // Manage focus and active state
    popup.querySelector('.sf-close-btn')?.focus();
    if (triggerElement) {
         // Remove active class from previously active trigger, if any
         document.querySelector('button[data-action="showDetails"].active')?.classList.remove('active');
        triggerElement.classList.add('active');
    }
    console.log("[SF_SHOW_FULL_DETAILS] SF Full Details popup displayed.");
} // --- End sfShowFullDetails ---

  confirmApplyStyleFinderResult(role, styleWithEmoji) {
    console.log(`[SF_CONFIRM_APPLY] Asking user to confirm application of Role: ${role}, Style: ${styleWithEmoji}`);
    if (confirm(`Apply Role '${escapeHTML(role)}' and Style '${escapeHTML(styleWithEmoji)}' to the main form? This will clear any unsaved changes in the form.`)) {
        console.log("[SF_CONFIRM_APPLY] User confirmed.");
        this.applyStyleFinderResult(role, styleWithEmoji);
    } else {
        console.log("[SF_CONFIRM_APPLY] User cancelled application.");
    }
}

  applyStyleFinderResult(role, styleWithEmoji) {
    console.log(`[SF_APPLY_RESULT] Applying SF result - Role: ${role}, Style: ${styleWithEmoji}`);

    if (!role || !styleWithEmoji || !this.elements.role || !this.elements.style || !this.elements.formSection) {
        console.error("[SF_APPLY_RESULT] Failed: Missing role/style data or form elements.");
        this.showNotification("Error applying style to form.", "error");
        return;
    }

    // Clear form BUT keep the name if one was entered? Or clear all? Let's clear all for now.
    this.resetForm(true); // Manual clear first

    // Set Role
    this.elements.role.value = role;

    // Render Styles for the Role
    this.renderStyles(role);

    // Set Style (wait briefly for options to populate)
     setTimeout(() => {
         if (this.elements.style) {
             this.elements.style.value = styleWithEmoji; // Set style including emoji
             console.log(`[SF_APPLY_RESULT] Set style dropdown to: ${styleWithEmoji}`);
             // Render Traits for Role and Style
             this.renderTraits(role, styleWithEmoji);
             // Update Preview and Links
             this.updateLivePreview();
             this.updateStyleExploreLink();
         } else {
              console.error("[SF_APPLY_RESULT] Style dropdown element not found after delay.");
         }
     }, 50); // Short delay

    // Close Style Finder
    this.sfClose();

    this.showNotification(`Style '${escapeHTML(styleWithEmoji)}' applied to form!`, "success");
    console.log("[SF_APPLY_RESULT] Applied result and closed Style Finder.");

    // Scroll to form and focus name field
    this.elements.formSection.scrollIntoView({ behavior: 'smooth' });
     setTimeout(() => this.elements.name.focus(), 300); // Delay focus after scroll
} // --- End applyStyleFinderResult ---


  // --- Theme Management ---

  applySavedTheme() {
    console.log("[APPLY_THEME] Applying saved theme from localStorage.");
    // Default to 'light' if no theme is saved
    const savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
    console.log(`[APPLY_THEME] Found saved theme: ${savedTheme}`);
    this.setTheme(savedTheme);
  }

  setTheme(themeName) {
    console.log(`[SET_THEME] Setting theme to: ${themeName}`);
    // Set attribute on the root element (html)
    document.documentElement.setAttribute('data-theme', themeName);
    // Save the preference to localStorage
    localStorage.setItem('kinkCompassTheme', themeName);

    // Update the theme toggle button appearance and label
    if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️';
        this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    // Grant achievement for changing theme (only needs global tracking)
     grantAchievement({}, 'theme_changer', this.showNotification.bind(this));

     // Update Chart colors if chart exists
      if (this.chartInstance) {
          this.updateChartTheme();
      }

    console.log(`[SET_THEME] Theme applied successfully: ${themeName}`);
  }

  toggleTheme() {
    console.log("[TOGGLE_THEME] Toggling theme.");
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    console.log(`[TOGGLE_THEME] Current: ${currentTheme}, New: ${newTheme}`);
    this.setTheme(newTheme);
}

  // Helper to update chart colors when theme changes
  updateChartTheme() {
     if (!this.chartInstance) return;
     console.log("[UPDATE_CHART_THEME] Updating chart colors for new theme.");

     const gridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid-color').trim() || 'rgba(0, 0, 0, 0.1)';
     const labelColor = getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666';
     const tooltipBg = getComputedStyle(document.body).getPropertyValue('--chart-tooltip-bg').trim() || 'rgba(0, 0, 0, 0.75)';
     const tooltipText = getComputedStyle(document.body).getPropertyValue('--chart-tooltip-text').trim() || '#fff';

     this.chartInstance.options.scales.y.ticks.color = labelColor;
     this.chartInstance.options.scales.y.title.color = labelColor;
     this.chartInstance.options.scales.y.grid.color = gridColor;
     this.chartInstance.options.scales.x.ticks.color = labelColor;
     this.chartInstance.options.scales.x.title.color = labelColor;
     this.chartInstance.options.plugins.legend.labels.color = labelColor;
     this.chartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
     this.chartInstance.options.plugins.tooltip.titleColor = tooltipText;
     this.chartInstance.options.plugins.tooltip.bodyColor = tooltipText;

     this.chartInstance.update(); // Redraw the chart with new colors
     console.log("[UPDATE_CHART_THEME] Chart theme updated.");
 }


  // --- Modal Management ---

  openModal(modalElement) {
    if (!modalElement) {
        console.error("[OPEN_MODAL] Failed: Attempted to open a null modal element.");
        return;
    }
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[OPEN_MODAL] Opening modal: #${modalId}`);

    // Close any other currently open modal first (optional, good UX)
    const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]');
    if (currentlyOpen && currentlyOpen !== modalElement) {
        console.log(`[OPEN_MODAL] Another modal (#${currentlyOpen.id}) is open. Closing it first.`);
        this.closeModal(currentlyOpen);
    }

    // Store the element that had focus before opening the modal
    this.elementThatOpenedModal = document.activeElement;
    // console.log(`[OPEN_MODAL] Stored element to return focus to:`, this.elementThatOpenedModal);

    // Make the modal visible and accessible
    modalElement.style.display = 'flex'; // Use flex for centering
    modalElement.setAttribute('aria-hidden', 'false');
    console.log(`[OPEN_MODAL] Modal #${modalId} display set to flex.`);

    // Focus management: Move focus inside the modal
    requestAnimationFrame(() => { // Wait for display change to potentially take effect
        // Find the first focusable element: close button, interactive elements
        let focusTarget = modalElement.querySelector('.modal-close, input:not([type="hidden"]), select, textarea, button, [href], [tabindex]:not([tabindex="-1"])');

        // If no specific element found, focus the modal content itself (make it focusable)
        if (!focusTarget) {
            const modalContent = modalElement.querySelector('.modal-content');
            if (modalContent) {
                 modalContent.setAttribute('tabindex', '-1'); // Make it programmatically focusable
                 focusTarget = modalContent;
            } else {
                 modalElement.setAttribute('tabindex', '-1'); // Fallback to modal container
                 focusTarget = modalElement;
            }
        }

        if (focusTarget) {
            try {
                focusTarget.focus();
                console.log(`[OPEN_MODAL] Focused element inside #${modalId}:`, focusTarget);
            } catch (focusError) {
                console.error(`[OPEN_MODAL] Error focusing element inside #${modalId}:`, focusError, focusTarget);
                 // Fallback focus to the modal container if specific element fails
                 try {
                     modalElement.setAttribute('tabindex', '-1');
                     modalElement.focus();
                     console.log(`[OPEN_MODAL] Fallback focus set to modal container #${modalId}.`);
                 } catch (fallbackError) {
                     console.error(`[OPEN_MODAL] Fallback focus to modal container failed:`, fallbackError);
                 }
            }
        } else {
            console.warn(`[OPEN_MODAL] No focusable element found inside #${modalId}.`);
        }
    });
} // --- End openModal ---

  closeModal(modalElement) {
    if (!modalElement) {
        console.error("[CLOSE_MODAL] Failed: Attempted to close a null modal element.");
        return;
    }
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[CLOSE_MODAL] Closing modal: #${modalId}`);

    // Hide the modal and make it inaccessible
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    console.log(`[CLOSE_MODAL] Modal #${modalId} display set to none.`);

    // Remove tabindex if it was added temporarily
    modalElement.removeAttribute('tabindex');
    modalElement.querySelector('.modal-content[tabindex="-1"]')?.removeAttribute('tabindex');

    // --- Return focus ---
    const elementToFocus = this.elementThatOpenedModal;
    this.elementThatOpenedModal = null; // Clear the stored element

    // Use requestAnimationFrame to allow modal hiding transition before focus shift
    requestAnimationFrame(() => {
        try {
            // Check if the element still exists and is focusable
            if (elementToFocus?.focus && document.body.contains(elementToFocus)) {
                elementToFocus.focus();
                console.log("[CLOSE_MODAL] Focus successfully restored to:", elementToFocus);
            } else {
                console.warn("[CLOSE_MODAL] Stored focus return element is invalid or gone. Focusing body.");
                document.body.focus(); // Fallback to body
            }
        } catch (e) {
            console.error("[CLOSE_MODAL] Error returning focus:", e);
            try {
                document.body.focus(); // Fallback focus attempt
            } catch (e2) {
                console.error("[CLOSE_MODAL] Fallback focus to body also failed:", e2);
            }
        }
    });

    console.log(`[CLOSE_MODAL] Finished closing process for #${modalId}.`);
} // --- End closeModal ---


   // --- Internal Helper Methods ---

   // Gets synergy hints based on current persona data
   getSynergyHints(person) {
       if (!person?.traits) {
           // console.log("[GET_SYNERGY_HINTS] No traits found for person.");
           return [];
       }
       // Call the utility function with the persona's traits
       return findHintsForTraits(person.traits);
   }

   // Gets goal alignment hints based on current persona data
   getGoalAlignmentHints(person) {
        const hints = [];
        if (!person?.goals || !person?.traits || typeof goalKeywords !== 'object') {
             // console.log("[GET_GOAL_HINTS] Missing goals, traits, or keyword data.");
            return hints;
        }

        const activeGoals = person.goals.filter(g => !g.done);

        // Limit processing to avoid overwhelming hints
        activeGoals.slice(0, 5).forEach(goal => {
            const goalTextLower = goal.text.toLowerCase();
            Object.entries(goalKeywords).forEach(([keyword, data]) => {
                if (goalTextLower.includes(keyword)) {
                    // Found a keyword match
                    data.relevantTraits?.forEach(traitName => {
                        if (person.traits.hasOwnProperty(traitName)) {
                            const score = person.traits[traitName];
                            // Select a random prompt template for this keyword/trait combo
                            const promptTemplate = data.promptTemplates?.[Math.floor(Math.random() * data.promptTemplates.length)];
                            if (promptTemplate) {
                                // Basic replacement
                                const hintText = promptTemplate.replace('{traitName}', traitName);
                                hints.push(`For goal "${goal.text}": ${hintText} (Your ${traitName} score: ${score})`);
                            }
                        }
                    });
                }
            });
        });

        // Return unique hints, limited to a maximum number (e.g., 3)
        const uniqueHints = [...new Set(hints)];
        return uniqueHints.slice(0, 3);
    } // --- End getGoalAlignmentHints ---

   // Gets a daily challenge, potentially tailored to the persona
   getDailyChallenge(persona = null) {
        if (typeof challenges !== 'object') {
            console.error("[GET_DAILY_CHALLENGE] Failed: Challenge data structure is missing.");
            return null;
        }

        let possibleCategories = ['communication', 'exploration']; // Base categories

        // Add role-specific challenges if applicable
        if (persona?.role) {
            const roleChallengeKey = `${persona.role.toLowerCase()}_challenges`;
            if (challenges[roleChallengeKey]) {
                possibleCategories.push(roleChallengeKey);
            }
        }

        if (possibleCategories.length === 0) {
            console.warn("[GET_DAILY_CHALLENGE] No possible challenge categories found.");
            return null; // No categories available
        }

        // --- Select Category ---
        // Simple random selection for now. Could add weighting later.
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
        const categoryChallenges = challenges[randomCategoryKey];

        if (!categoryChallenges || !Array.isArray(categoryChallenges) || categoryChallenges.length === 0) {
            console.warn(`[GET_DAILY_CHALLENGE] No challenges found in selected category: ${randomCategoryKey}. Falling back...`);
            // Fallback logic: try communication or exploration if primary fails
            const fallbackCategories = ['communication', 'exploration'].filter(cat => cat !== randomCategoryKey);
            for (const fallbackCatKey of fallbackCategories) {
                const fallbackChallenges = challenges[fallbackCatKey];
                if (fallbackChallenges?.length > 0) {
                     const fallbackChallenge = fallbackChallenges[Math.floor(Math.random() * fallbackChallenges.length)];
                     return { ...fallbackChallenge, category: fallbackCatKey }; // Return with fallback category
                }
            }
            console.error("[GET_DAILY_CHALLENGE] Fallback failed, no challenges found in any category.");
            return null; // No challenges found anywhere
        }

        // Select a random challenge from the chosen category
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];

        // Return challenge object with category info (cleaned up)
        return {
            ...randomChallenge,
            category: randomCategoryKey.replace('_challenges', '') // Make category name user-friendly
        };
    } // --- End getDailyChallenge ---

   // Gets an Oracle reading, potentially tailored to the persona
   getKinkOracleReading(person) {
        console.log(`[GET_ORACLE_READING] Generating reading for Person ID ${person?.id}`);
        if (typeof oracleReadings !== 'object' || !oracleReadings.openings || !oracleReadings.focusAreas || !oracleReadings.encouragements || !oracleReadings.closings) {
            console.error("[GET_ORACLE_READING] Failed: Oracle data structure is missing or incomplete.");
            return null;
        }

        const reading = {};

        try {
            // 1. Select Opening
            reading.opening = oracleReadings.openings[Math.floor(Math.random() * oracleReadings.openings.length)];

            // 2. Determine Focus (Prioritize traits -> style -> general)
            let focusText = "";
            const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score)) && score >= 1 && score <= 5) : [];

            // If traits exist and random chance allows trait focus
            if (traits.length > 0 && Math.random() > 0.3) {
                // Sort traits to find extremes (highest or lowest scores)
                traits.sort((a, b) => Math.abs(a[1] - 3) > Math.abs(b[1] - 3) ? -1 : 1); // Sort by distance from middle (3)
                // Pick one of the top 3 most extreme traits
                const focusTrait = traits[Math.floor(Math.random() * Math.min(traits.length, 3))];
                if (focusTrait) {
                    const traitName = focusTrait[0];
                    const template = oracleReadings.focusAreas.traitBased[Math.floor(Math.random() * oracleReadings.focusAreas.traitBased.length)];
                    focusText = template.replace('{traitName}', traitName);
                    console.log(` -> Oracle Focus determined by Trait: ${traitName}`);
                }
            }
            // If no trait focus or random chance allows style focus
            if (!focusText && person?.style && Math.random() > 0.5) {
                const template = oracleReadings.focusAreas.styleBased[Math.floor(Math.random() * oracleReadings.focusAreas.styleBased.length)];
                focusText = template.replace('{styleName}', person.style);
                console.log(` -> Oracle Focus determined by Style: ${person.style}`);
            }
            // Fallback to general focus
            if (!focusText) {
                focusText = oracleReadings.focusAreas.general[Math.floor(Math.random() * oracleReadings.focusAreas.general.length)];
                console.log(` -> Oracle Focus set to General.`);
            }
            reading.focus = focusText;

            // 3. Select Encouragement
            reading.encouragement = oracleReadings.encouragements[Math.floor(Math.random() * oracleReadings.encouragements.length)];

            // 4. Select Closing
            reading.closing = oracleReadings.closings[Math.floor(Math.random() * oracleReadings.closings.length)];

            console.log("[GET_ORACLE_READING] Successfully generated reading:", reading);
            return reading;

        } catch (error) {
            console.error("[GET_ORACLE_READING] Error during reading generation:", error);
            return null; // Return null on error
        }
    } // --- End getKinkOracleReading ---


   // --- Achievement Checkers --- (These call the grantAchievement util)

   checkGoalStreak(person) {
        if (!person?.goals) return; // Need goals array

        // Filter completed goals with valid timestamps and sort by date descending
        const completedGoals = person.goals
            .filter(g => g.done && g.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        if (completedGoals.length < 3) return; // Not enough completed goals for a streak

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Check if the 3 most recent completions fall within the last 7 days
        const recentCompletions = completedGoals.slice(0, 3)
            .filter(g => new Date(g.completedAt) >= sevenDaysAgo);

        if (recentCompletions.length >= 3) {
            console.log(` -> Goal Streak achievement condition met for ${person.name}!`);
            // Attempt to grant the achievement
            grantAchievement(person, 'goal_streak_3', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    } // --- End checkGoalStreak ---

   checkTraitTransformation(person, currentSnapshot) {
        if (!person?.history?.length || !currentSnapshot?.traits) {
            // console.log("[TRAIT_TRANSFORM_CHECK] Not enough history or no current traits.");
            return; // Need at least one previous snapshot and current traits
        }

        const previousSnapshot = person.history[person.history.length - 1]; // Get the most recent previous snapshot
        if (!previousSnapshot?.traits) {
            // console.log("[TRAIT_TRANSFORM_CHECK] Previous snapshot missing traits.");
            return;
        }

        let transformed = false;
        for (const traitName in currentSnapshot.traits) {
            if (previousSnapshot.traits.hasOwnProperty(traitName)) {
                const currentScore = parseInt(currentSnapshot.traits[traitName], 10);
                const previousScore = parseInt(previousSnapshot.traits[traitName], 10);

                // Check if both scores are valid numbers and if current is >= 2 points higher
                if (!isNaN(currentScore) && !isNaN(previousScore) && (currentScore - previousScore >= 2)) {
                    console.log(` -> Trait Transformer condition met for '${traitName}'! (${previousScore} -> ${currentScore})`);
                    transformed = true;
                    break; // Found one transformation, no need to check others
                }
            }
        }

        if (transformed) {
             grantAchievement(person, 'trait_transformer', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    } // --- End checkTraitTransformation ---

   checkConsistentSnapper(person, currentTimestamp) {
        if (!person?.history?.length) {
             // console.log("[CONSISTENT_SNAP_CHECK] No previous history.");
             return; // Need at least one snapshot in history
        }

        const previousSnapshot = person.history[person.history.length - 1]; // Get the most recent snapshot
        if (!previousSnapshot?.timestamp) {
             // console.log("[CONSISTENT_SNAP_CHECK] Previous snapshot missing timestamp.");
            return;
        }

        try {
            const prevTime = new Date(previousSnapshot.timestamp);
            const currentTime = new Date(currentTimestamp);
            const daysDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60 * 24); // Difference in days

            if (daysDiff >= 3) { // Check if 3 or more days have passed
                console.log(` -> Consistent Snapper condition met! (${daysDiff.toFixed(1)} days)`);
                 grantAchievement(person, 'consistent_snapper', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
            }
        } catch (dateError) {
             console.error("[CONSISTENT_SNAP_CHECK] Error parsing snapshot timestamps:", dateError);
        }
    } // --- End checkConsistentSnapper ---

    // --- Notification Helper ---
    showNotification(message, type = 'info', duration = 4000) {
        // Find or create the notification element
        const notificationElement = document.getElementById('app-notification') || this.createNotificationElement();
        if (!notificationElement) return; // Should not happen if create works

        // Apply type class for styling
        notificationElement.className = `notification-${type}`; // Resets previous types
        notificationElement.textContent = message;

        // Make visible and accessible
        notificationElement.style.opacity = '1';
        notificationElement.style.top = '70px'; // Position from top
        notificationElement.setAttribute('aria-hidden', 'false');
        notificationElement.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status'); // Use alert for errors/warnings

        // Clear existing timer if present
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Set timer to hide notification
        this.notificationTimer = setTimeout(() => {
            notificationElement.style.opacity = '0';
            notificationElement.style.top = '20px'; // Move up while fading out
            notificationElement.setAttribute('aria-hidden', 'true');
            this.notificationTimer = null; // Clear timer ID
        }, duration);
    } // --- End showNotification ---

    // Helper to create the notification div if it doesn't exist
    createNotificationElement() {
        console.log("[CREATE_NOTIFICATION_ELEMENT] Creating notification container.");
        try {
            const div = document.createElement('div');
            div.id = 'app-notification';
            div.setAttribute('aria-live', 'assertive'); // Announce changes immediately
            div.setAttribute('aria-hidden', 'true'); // Start hidden
            document.body.appendChild(div);
            return div;
        } catch (error) {
            console.error("[CREATE_NOTIFICATION_ELEMENT] Failed to create notification element:", error);
            return null;
        }
    } // --- End createNotificationElement ---


} // <<< --- END OF TrackerApp CLASS --- >>>

// --- Initialization ---
try {
    console.log("[INIT] SCRIPT END: Initializing KinkCompass App...");
    // Make the app instance globally accessible (if needed for inline event handlers like snapshot toggle)
    window.kinkCompassApp = new TrackerApp();
    console.log("[INIT] SCRIPT END: KinkCompass App Initialized Successfully on window.kinkCompassApp");
} catch (error) {
    console.error("[INIT] FATAL error during App initialization:", error);
    // Display a prominent error message to the user if initialization fails
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 80%; max-height: 50vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>This might be due to a coding error or missing data.<br><br>Message: ${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}<br><br>Please check the browser console (F12) for more details.`;
    document.body.prepend(errorDiv); // Prepend to be visible even if body content fails
}
