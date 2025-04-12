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
    sfStyleIcons,
    subStyleSuggestions, // Needed for getStyleBreakdown
    domStyleSuggestions   // Needed for getStyleBreakdown
} from './appData.js';

import {
    getStyleBreakdown,
    hasAchievement,
    grantAchievement,
    getAchievementDetails,
    findHintsForTraits,
    getRandomPrompt,
    escapeHTML,
    getFlairForScore,
    generateSimpleId,
    debounce,
    normalizeStyleKey
} from './utils.js';

// Ensure Chart.js and Confetti are loaded
if (typeof Chart === 'undefined') console.error("Chart.js not loaded!");
if (typeof confetti === 'undefined') console.warn("Confetti library not loaded.");


class TrackerApp {
  constructor() {
    console.log("[CONSTRUCTOR] STARTING KinkCompass App (v2.8.8 - Corrected & Cleaned HTML)...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-traits-breakdown'; // Default tab
    this.elementThatOpenedModal = null; // Track focus return element
    this.lastSavedId = null; // For highlighting saved item
    this.isSaving = false; // Prevent double-clicks on save

    // Style Finder State
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} }; // Reset answers
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false; // Flag to prevent dashboard re-render animation
    this.previousScores = null; // Track score changes for animation
    this.styleFinderTraits = []; // Holds the traits for the current SF run
    this.traitFootnotes = {}; // Holds footnotes for current SF run
    this.sliderDescriptions = {}; // Holds slider descriptions for current SF run
    this.sfSliderInteracted = false; // Track if user interacted with slider before 'next'
    this.traitOrder = []; // Store the order traits are presented

    // Debounced search handlers
    this.debouncedGlossarySearch = debounce(this.filterGlossary, 300);
    this.debouncedStyleDiscoverySearch = debounce(this.filterStyleDiscovery, 300);

    console.log("[CONSTRUCTOR] Mapping elements...");
    this.elements = this.mapElements();
    console.log(`[CONSTRUCTOR] Elements mapped.`);

    // Essential element check
    if (!this.elements.role || !this.elements.style || !this.elements.traitsContainer || !this.elements.peopleList || !this.elements.formSection) {
        console.error("[CONSTRUCTOR] CRITICAL ERROR: Missing core UI elements. App cannot function.");
        alert("App critical error: Missing core UI elements (role, style, traits, list, form). Please check index.html or reload.");
        return; // Prevent further execution if core elements are missing
    }
    if (!this.elements.sfModal || !this.elements.sfStepContent) {
        console.warn("[CONSTRUCTOR] Style Finder UI elements missing. Style Finder feature may be disabled.");
    }

    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners();
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and initial render...");
    try {
        this.loadFromLocalStorage();
        this.applySavedTheme(); // Apply theme early
    } catch (error) {
        console.error("[CONSTRUCTOR] Error during initial load/theme:", error);
        this.showNotification("Error loading initial data or theme. Check console.", "error", 5000);
    }
    this.renderStyles(this.elements.role.value); // Render initial styles based on default role
    this.renderTraits(this.elements.role.value, ''); // Render initial (core) traits
    this.renderList(); // Render the persona list
    this.updateLivePreview(); // Show initial preview state
    this.checkAndShowWelcome(); // Show welcome message if needed
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Element Mapping ---
  mapElements() {
    // Helper to get elements and log warnings if missing
    const get = (id) => {
        const el = document.getElementById(id);
        // Only log warning once per missing element during setup
        if (!el && (!this.missingElementsLogged || !this.missingElementsLogged.has(id))) {
            console.warn(`[MAP_ELEMENTS] Element with ID '${id}' not found.`);
            if (!this.missingElementsLogged) this.missingElementsLogged = new Set();
            this.missingElementsLogged.add(id);
        }
        return el;
    };
    const query = (selector) => {
        const el = document.querySelector(selector);
         if (!el && (!this.missingElementsLogged || !this.missingElementsLogged.has(selector))) {
            console.warn(`[MAP_ELEMENTS] Element with selector '${selector}' not found.`);
             if (!this.missingElementsLogged) this.missingElementsLogged = new Set();
             this.missingElementsLogged.add(selector);
        }
        return el;
    };
    const queryAll = (selector) => { // Added helper for multiple elements
        const els = document.querySelectorAll(selector);
         if (els.length === 0 && (!this.missingElementsLogged || !this.missingElementsLogged.has(selector))) {
            console.warn(`[MAP_ELEMENTS] No elements found with selector '${selector}'.`);
             if (!this.missingElementsLogged) this.missingElementsLogged = new Set();
             this.missingElementsLogged.add(selector);
        }
        return els;
    };


    return {
        // Core Form
        formSection: get('form-section'),
        mainForm: query('#form-section form'),
        formTitle: get('form-title'),
        name: get('name'),
        avatarDisplay: get('avatar-display'),
        avatarInput: get('avatar-input'),
        avatarPicker: query('.avatar-picker'), // Specific picker area
        avatarButtons: queryAll('.avatar-picker .avatar-btn'), // All avatar buttons
        role: get('role'),
        style: get('style'),
        styleExploreLink: get('style-explore-link'), // FIX: ID matches button in HTML
        formStyleFinderLink: get('form-style-finder-link'),
        traitsContainer: get('traits-container'),
        traitsMessage: get('traits-message'),
        save: get('save'),
        saveButtonText: query('#save .button-text'), // Span inside save button
        saveSpinner: query('#save .spinner'),
        clearForm: get('clear-form'),

        // Persona List
        peopleList: get('people-list'),

        // Live Preview
        livePreview: get('live-preview'),

        // Popups (Trait/Context Help)
        traitInfoPopup: get('trait-info-popup'),
        traitInfoClose: get('trait-info-close'),
        traitInfoTitle: get('trait-info-title'),
        traitInfoBody: get('trait-info-body'),
        contextHelpPopup: get('context-help-popup'),
        contextHelpClose: get('context-help-close'),
        contextHelpTitle: get('context-help-title'),
        contextHelpBody: get('context-help-body'),

        // Main Detail Modal
        modal: get('detail-modal'),
        modalBody: get('modal-body'),
        modalTabs: get('modal-tabs'),
        modalClose: get('modal-close'),
        detailModalTitle: get('detail-modal-title'),

        // Header Buttons & Related Modals
        styleFinderTriggerBtn: get('style-finder-trigger-btn'),
        styleDiscoveryBtn: get('style-discovery-btn'),
        styleDiscoveryModal: get('style-discovery-modal'),
        styleDiscoveryClose: get('style-discovery-close'),
        styleDiscoveryRoleFilter: get('style-discovery-role'),
        styleDiscoveryBody: get('style-discovery-body'),
        styleDiscoverySearchInput: get('style-discovery-search-input'),

        achievementsBtn: get('achievements-btn'),
        achievementsModal: get('achievements-modal'),
        achievementsClose: get('achievements-close'),
        achievementsBody: get('achievements-body'),

        glossaryBtn: get('glossary-btn'),
        glossaryModal: get('glossary-modal'),
        glossaryClose: get('glossary-close'),
        glossaryBody: get('glossary-body'),
        glossarySearchInput: get('glossary-search-input'),
        glossarySearchClear: get('glossary-search-clear'),

        resourcesBtn: get('resources-btn'),
        resourcesModal: get('resources-modal'),
        resourcesClose: get('resources-close'),
        resourcesBody: get('resources-body'),

        themesBtn: get('themes-btn'),
        themesModal: get('themes-modal'),
        themesClose: get('themes-close'),
        themesBody: get('themes-body'), // Container for theme buttons

        exportBtn: get('export-btn'),
        importBtn: get('import-btn'),
        importFileInput: get('import-file-input'),
        themeToggle: get('theme-toggle'),

        // Welcome Modal
        welcomeModal: get('welcome-modal'),
        welcomeClose: get('welcome-close'),

        // Style Finder Modal
        sfModal: get('style-finder-modal'),
        sfCloseBtn: get('sf-close-style-finder'),
        sfProgressTracker: get('sf-progress-tracker'),
        sfProgressBarContainer: get('sf-progress-bar-container'),
        sfProgressBar: get('sf-progress-bar'),
        sfStepContent: get('sf-step-content'),
        sfFeedback: get('sf-feedback'),
        sfDashboard: get('sf-dashboard'),

        // Notification Area
        notificationArea: get('app-notification')
    };
}


  // --- Local Storage ---
  loadFromLocalStorage() {
    console.log("[LOAD_STORAGE] Attempting load.");
    try {
        const data = localStorage.getItem('kinkCompassPeople_v2');
        if (data) {
            const parsedData = JSON.parse(data);
            // Basic validation: ensure it's an array
            if (Array.isArray(parsedData)) {
                this.people = parsedData;
                 console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
                 // Sanitize loaded data to ensure required fields exist
                 this.people.forEach((p, index) => {
                     if (!p.id || typeof p.id !== 'string') p.id = generateSimpleId() + `_load_${index}`;
                     if (!p.name || typeof p.name !== 'string') p.name = `Persona ${p.id.substring(0, 4)}`;
                     if (!p.role || !bdsmData[p.role]) p.role = 'submissive'; // Validate role key
                     if (!p.style || typeof p.style !== 'string') p.style = '';
                     if (!p.avatar || typeof p.avatar !== 'string') p.avatar = '❓';
                     if (typeof p.traits !== 'object' || p.traits === null) p.traits = {};
                     if (!Array.isArray(p.achievements)) p.achievements = [];
                     if (!Array.isArray(p.goals)) p.goals = [];
                     if (!Array.isArray(p.history)) p.history = [];
                     if (typeof p.reflections !== 'string') p.reflections = ""; // Ensure reflections is string
                 });
            } else {
                 console.warn("[LOAD_STORAGE] Invalid data format found in localStorage (not an array). Starting fresh.");
                 this.people = [];
            }
        } else {
            console.log("[LOAD_STORAGE] No data found in localStorage.");
            this.people = []; // Initialize as empty array if no data
        }
    } catch (error) {
        console.error("[LOAD_STORAGE] Error loading or parsing data:", error);
        this.showNotification("Error loading data. Starting fresh.", "error", 5000);
        this.people = []; // Reset to empty array on error
    }
}

  saveToLocalStorage() {
    // Debounce saving to prevent rapid writes
    if (this.saveTimeout) clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
        console.log("[SAVE_STORAGE] Saving personas.");
        try {
            // Only save the 'people' array
            localStorage.setItem('kinkCompassPeople_v2', JSON.stringify(this.people));
            console.log(`[SAVE_STORAGE] Saved ${this.people.length} personas.`);
        } catch (error) {
            console.error("[SAVE_STORAGE] Error saving data:", error);
             // Handle potential quota errors specifically
             if (error.name === 'QuotaExceededError' || (error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                 this.showNotification("Save failed: Storage limit exceeded. Export data & remove personas.", "error", 10000);
             } else {
                 this.showNotification("Error saving data. Changes might be lost.", "error", 5000);
             }
        }
        this.saveTimeout = null; // Clear timeout reference
    }, 100); // Short delay (100ms)
  }

  // --- Onboarding ---
  checkAndShowWelcome() {
    console.log("[WELCOME] Checking for first visit.");
    let welcomed = false;
    try {
         // Use a version-specific key to show welcome on updates
         welcomed = localStorage.getItem('kinkCompassWelcomed_v2_8_8');
    } catch (e) {
        console.error("[WELCOME] Error reading welcome flag from localStorage:", e);
        // Proceed as if not welcomed if there's an error reading
    }
    if (!welcomed) {
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
        try {
            // Set the flag so it doesn't show again for this version
            localStorage.setItem('kinkCompassWelcomed_v2_8_8', 'true');
            console.log("[WELCOME] Welcome flag set for v2.8.8.");
        } catch (e) {
             console.error("[WELCOME] Failed to set welcome flag in localStorage:", e);
             // Non-critical error, welcome might show again next time
        }
    } else {
        console.warn("[WELCOME] Welcome modal element not found.");
    }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("[ADD_LISTENERS] Starting listener setup...");
    const safeAddListener = (element, event, handler, elementName, options = {}) => {
        if (element) {
             // FIX: Added check for handler type
             if (typeof handler !== 'function') {
                 console.error(`[SAFE_ADD_LISTENER] Invalid handler provided for element '${elementName}', event '${event}'. Handler:`, handler);
                 return; // Stop trying to add listener if handler is invalid
             }
            element.addEventListener(event, handler.bind(this), options);
        } else {
            // Log only once if element is missing during setup
             if (!this.missingElementsLogged) this.missingElementsLogged = new Set();
             if (!this.missingElementsLogged.has(elementName)) {
                 console.warn(`[SAFE_ADD_LISTENER] Element '${elementName}' not found. Listener for '${event}' not added.`);
                 this.missingElementsLogged.add(elementName);
             }
        }
    };

    // Form Interactions
    safeAddListener(this.elements.mainForm, 'submit', (e) => e.preventDefault(), 'mainForm submit');
    safeAddListener(this.elements.role, 'change', (e) => {
        console.log("[EVENT] Role changed");
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, ''); // Reset style traits
        if(this.elements.style) this.elements.style.value = ''; // Clear style dropdown
        this.updateLivePreview();
        this.updateStyleExploreLink(); // Update link text/visibility
    }, 'role');
    safeAddListener(this.elements.style, 'change', (e) => {
        console.log("[EVENT] Style changed");
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink();
    }, 'style');
    safeAddListener(this.elements.name, 'input', this.updateLivePreview, 'name');
    safeAddListener(this.elements.save, 'click', this.savePerson, 'save');
    safeAddListener(this.elements.clearForm, 'click', () => this.resetForm(true), 'clearForm');

    // Avatar Picker (Delegated)
    safeAddListener(this.elements.avatarPicker, 'click', (e) => {
        const button = e.target.closest('.avatar-btn');
        if (button && button.dataset.emoji && this.elements.avatarInput && this.elements.avatarDisplay) {
            console.log("[EVENT] Avatar clicked");
            const emoji = button.dataset.emoji;
            this.elements.avatarInput.value = emoji;
            this.elements.avatarDisplay.textContent = emoji;
            // Update selected state visually
            this.elements.avatarButtons.forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
            this.updateLivePreview();
        }
    }, 'avatarPicker');

    // Trait Interactions (Delegated to container)
    safeAddListener(this.elements.traitsContainer, 'input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e); // Use named handler
            this.updateLivePreview(); // Update preview on slider change
        }
    }, 'traitsContainer input');
    safeAddListener(this.elements.traitsContainer, 'click', (e) => {
        const infoButton = e.target.closest('.trait-info-btn');
        if (infoButton) {
            console.log("[EVENT] Trait info clicked");
            this.handleTraitInfoClick(e, infoButton); // Use named handler
        }
    }, 'traitsContainer click');

    // Popups & Context Help (Delegated and specific)
    safeAddListener(this.elements.formStyleFinderLink, 'click', this.sfStart, 'formStyleFinderLink');
    safeAddListener(document.body, 'click', (e) => {
        // Context Help buttons anywhere on the page
        const helpButton = e.target.closest('.context-help-btn');
        if (helpButton && helpButton.dataset.helpKey) {
            console.log("[EVENT] Context help clicked");
            this.showContextHelp(helpButton.dataset.helpKey, helpButton);
        }
        // Close SF popups if clicking outside them
        if (!e.target.closest('.sf-style-info-popup') && !e.target.closest('.sf-info-icon')) {
             this.sfCloseAllPopups();
        }
        // Handle glossary links anywhere
        const glossaryLink = e.target.closest('a.glossary-link[data-term-key]');
        if (glossaryLink) {
            this.handleGlossaryLinkClick(e); // Delegate handling
        }
    }, 'body context-help / popup close / glossary link');
    safeAddListener(this.elements.traitInfoClose, 'click', this.hideTraitInfo, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', this.hideContextHelp, 'contextHelpClose');

    // Persona List Interactions (Delegated)
    safeAddListener(this.elements.peopleList, 'click', this.handleListClick, 'peopleList click');
    safeAddListener(this.elements.peopleList, 'keydown', this.handleListKeydown, 'peopleList keydown'); // For accessibility

    // Modal Closing Logic (Centralized for standard modals)
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
        if(item.button){
             safeAddListener(item.button, 'click', () => {
                console.log(`[EVENT] Close clicked for ${item.name}`);
                this.closeModal(item.modal);
                 // Special case for SF modal to ensure state reset
                if (item.modal === this.elements.sfModal) {
                     this.sfClose();
                }
            }, `${item.name} Close`);
        } else if (item.modal) {
             console.warn(`[LISTENER SETUP] Close button for modal '${item.name}' not found, but modal element exists.`);
        }
        // Add listener to close modal on background click
        if (item.modal) {
             safeAddListener(item.modal, 'click', (e) => {
                if (e.target === item.modal) { // Only close if background itself is clicked
                    console.log(`[EVENT] Background click closing ${item.name}`);
                    this.closeModal(item.modal);
                     if (item.modal === this.elements.sfModal) {
                         this.sfClose();
                     }
                }
            }, `${item.name} Background Click`);
        }
    });

    // Header Button Actions
    safeAddListener(this.elements.resourcesBtn, 'click', () => {
        console.log("[EVENT] Resources clicked");
        grantAchievement({}, 'resource_reader', this.showNotification.bind(this)); // Global achievement
        this.openModal(this.elements.resourcesModal);
    }, 'resourcesBtn');
    safeAddListener(this.elements.glossaryBtn, 'click', () => {
        console.log("[EVENT] Glossary clicked");
        grantAchievement({}, 'glossary_user', this.showNotification.bind(this)); // Global achievement
        this.showGlossary();
    }, 'glossaryBtn');
    safeAddListener(this.elements.styleDiscoveryBtn, 'click', () => {
        console.log("[EVENT] Style Discovery clicked");
        grantAchievement({}, 'style_discovery', this.showNotification.bind(this)); // Global achievement
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
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => this.renderStyleDiscoveryContent(), 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.styleDiscoverySearchInput, 'input', (e) => this.debouncedStyleDiscoverySearch(e.target.value), 'styleDiscoverySearchInput');
    safeAddListener(this.elements.glossarySearchInput, 'input', (e) => this.debouncedGlossarySearch(e.target.value), 'glossarySearchInput');
    safeAddListener(this.elements.glossarySearchClear, 'click', this.clearGlossarySearch, 'glossarySearchClear');
    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');

    // Detail Modal Body Delegation (Goals, Journal, History, Insights actions)
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody click');
    safeAddListener(this.elements.modalBody, 'submit', this.handleModalBodyClick, 'modalBody submit'); // For Add Goal form
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs');

    // Explore Style Link in Form
    safeAddListener(this.elements.styleExploreLink, 'click', this.handleExploreStyleLinkClick, 'styleExploreLink');

    // Style Finder Interactions (delegated)
    safeAddListener(this.elements.sfStepContent, 'click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const action = button.dataset.action;
            if (action) {
                console.log(`[EVENT] SF button action: ${action}`);
                this.handleStyleFinderAction(action, button.dataset, button);
            } else if (button.classList.contains('sf-info-icon') && button.dataset.trait) {
                console.log("[EVENT] SF trait info clicked");
                this.sfShowTraitInfo(button.dataset.trait, button);
            }
        }
    }, 'sfStepContent click');
    safeAddListener(this.elements.sfStepContent, 'input', (e) => {
        if (e.target.classList.contains('sf-trait-slider')) {
            this.handleStyleFinderSliderInput(e.target);
        }
    }, 'sfStepContent input');

    // Window Level Listeners
    safeAddListener(window, 'keydown', this.handleWindowKeydown, 'window keydown');

    console.log("[ADD_LISTENERS] Listener setup COMPLETE.");
} // --- End addEventListeners ---


  // --- Event Handlers ---

  handleListClick(e) {
    const target = e.target;
    const listItem = target.closest('li[data-id]');
    if (!listItem) return; // Clicked outside a list item

    const personId = listItem.dataset.id;

    // Check if the click was on the Edit button
    if (target.closest('.edit-btn')) {
        console.log(`[EVENT] Edit clicked for ID: ${personId}`);
        e.stopPropagation(); // Prevent triggering view details
        this.editPerson(personId);
    }
    // Check if the click was on the Delete button
    else if (target.closest('.delete-btn')) {
        console.log(`[EVENT] Delete clicked for ID: ${personId}`);
        e.stopPropagation(); // Prevent triggering view details
        // Replace confirm with a custom modal in future improvement
        if (confirm(`Are you sure you want to delete this persona? This cannot be undone.`)) {
            this.deletePerson(personId);
        }
    }
    // Check if the click was on the main info area
    else if (target.closest('.person-info')) {
        console.log(`[EVENT] View details clicked for ID: ${personId}`);
        this.showPersonDetails(personId);
    }
}

  handleListKeydown(e) {
      // Handle Enter or Space key presses for accessibility on list items/buttons
      if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target.closest('.person-info, .edit-btn, .delete-btn');
          const listItem = target?.closest('li[data-id]'); // Ensure we are within a list item
          if (!target || !listItem) return; // Ignore if not on an interactive element within a list item

          e.preventDefault(); // Prevent default spacebar scroll or enter submit

          const personId = listItem.dataset.id;

          // Determine action based on the focused element
          if (target.classList.contains('person-info')) {
              this.showPersonDetails(personId);
          } else if (target.classList.contains('edit-btn')) {
              this.editPerson(personId);
          } else if (target.classList.contains('delete-btn')) {
              if (confirm(`Are you sure you want to delete this persona? This cannot be undone.`)) {
                   this.deletePerson(personId);
              }
          }
      }
  }

  handleWindowKeydown(e) {
      // Handle Escape key to close modals/popups
      if (e.key === 'Escape') {
          console.log("[EVENT] Escape key pressed");
          // Prioritize closing context/trait popups first
          if (this.elements.contextHelpPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[ESC] Closing context help popup");
              this.hideContextHelp();
              return; // Stop further processing
          }
          if (this.elements.traitInfoPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[ESC] Closing trait info popup");
              this.hideTraitInfo();
              return; // Stop further processing
          }
           if (this.sfCloseAllPopups()) { // Close SF popups if any are open
                return;
           }
          // Then close the topmost standard modal
          // Select the last modal in DOM order that is currently visible
          const openModals = document.querySelectorAll('.modal[aria-hidden="false"]');
          if (openModals.length > 0) {
                const topModal = openModals[openModals.length - 1];
                console.log(`[ESC] Closing modal: #${topModal.id}`);
                this.closeModal(topModal);
                if (topModal.id === 'style-finder-modal') {
                     this.sfClose(); // Ensure SF state is reset if its modal is closed
                }
          }
      }
  }

  handleTraitSliderInput(e) {
    const slider = e.target; // e.target is the slider itself
    if (!slider || !slider.closest) return; // Basic check

    const traitContainer = slider.closest('.trait');
    const valueDisplay = traitContainer?.querySelector('.trait-value');

    if (valueDisplay) {
      valueDisplay.textContent = slider.value; // Update number display
      this.updateTraitDescription(slider); // Update text description
    } else {
        console.warn("[TRAIT_SLIDER_INPUT] Could not find value display for slider:", slider.id);
    }
  }

  handleTraitInfoClick(e, button) {
      e.preventDefault();
      const traitName = button?.dataset.traitName;
      if (!traitName) {
          console.warn("[TRAIT_INFO_CLICK] Button missing trait name dataset.");
          return;
      }
      this.showTraitInfo(traitName, button); // Pass button for focus return
  }

  // Delegated handler for clicks within the detail modal body
  handleModalBodyClick(e) {
    const target = e.target;
    const personId = this.elements.modal?.dataset.personId; // Get person ID from modal data attribute
    if (!personId) {
         console.warn("[MODAL_CLICK] No person ID found on modal.");
         return;
    }

    // --- Goal Actions ---
    const goalToggleButton = target.closest('.goal-toggle-btn');
    const goalDeleteButton = target.closest('.goal-delete-btn');
    const addGoalForm = target.closest('#add-goal-form'); // Check if submit happened within the form

    if (goalToggleButton) {
        e.preventDefault();
        const goalId = goalToggleButton.dataset.goalId;
        const listItem = goalToggleButton.closest('li');
        if (goalId) {
            console.log(`[MODAL_CLICK] Toggling goal ${goalId} for person ${personId}`);
            this.toggleGoalStatus(personId, goalId, listItem);
        }
    } else if (goalDeleteButton) {
        e.preventDefault();
        const goalId = goalDeleteButton.dataset.goalId;
        if (goalId && confirm(`Are you sure you want to delete this goal?`)) {
            console.log(`[MODAL_CLICK] Deleting goal ${goalId} for person ${personId}`);
            this.deleteGoal(personId, goalId);
        }
    } else if (e.type === 'submit' && addGoalForm) { // Check type for form submission
        e.preventDefault();
        console.log(`[MODAL_CLICK] Adding goal for person ${personId}`);
        this.addGoal(personId, addGoalForm);
    }

    // --- Journal Actions ---
    const journalPromptButton = target.closest('#journal-prompt-btn');
    const saveReflectionsButton = target.closest('#save-reflections-btn');

    if (journalPromptButton) {
        e.preventDefault();
        console.log(`[MODAL_CLICK] Getting journal prompt for person ${personId}`);
        this.showJournalPrompt(personId);
    } else if (saveReflectionsButton) {
        e.preventDefault();
        console.log(`[MODAL_CLICK] Saving reflections for person ${personId}`);
        this.saveReflections(personId);
    }

    // --- History Actions ---
    const snapshotButton = target.closest('#snapshot-btn');
    const snapshotToggleButton = target.closest('.snapshot-toggle');

    if (snapshotButton) {
        e.preventDefault();
        console.log(`[MODAL_CLICK] Taking snapshot for person ${personId}`);
        this.addSnapshotToHistory(personId);
    } else if (snapshotToggleButton) {
        e.preventDefault();
        console.log(`[MODAL_CLICK] Toggling snapshot details`);
        this.toggleSnapshotInfo(snapshotToggleButton);
    }

    // --- Insights Actions ---
    const oracleButton = target.closest('#oracle-btn');
    if (oracleButton) {
        e.preventDefault();
        console.log(`[MODAL_CLICK] Consulting oracle for person ${personId}`);
        this.showKinkOracle(personId);
    }
    const viewAllAchievementsButton = target.closest('.view-all-achievements-btn');
    if (viewAllAchievementsButton) {
         e.preventDefault();
         console.log(`[MODAL_CLICK] Viewing all achievements`);
         this.showAchievements(); // Opens the global achievements modal
    }
}

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) {
          const themeName = button.dataset.theme;
          console.log(`[EVENT] Theme selected: ${themeName}`);
          this.setTheme(themeName);
          // Maybe close the themes modal automatically?
          // this.closeModal(this.elements.themesModal);
      }
  }

  handleStyleFinderAction(action, dataset = {}, triggerElement = null) {
        // Central handler for all SF button clicks
        switch (action) {
            case 'setRole':
                if (dataset.role) this.sfSetRole(dataset.role);
                break;
            case 'next':
                const currentTrait = dataset.currenttrait;
                // Only proceed if the slider was interacted with or it's the first trait
                if(this.sfSliderInteracted || this.styleFinderStep === 1){
                    this.sfNextStep(currentTrait);
                } else {
                    this.sfShowFeedback("Please rate this trait before proceeding.", "warning");
                     // Add a visual cue to the slider (optional)
                    const slider = this.elements.sfStepContent?.querySelector('.sf-trait-slider');
                    if(slider) {
                         slider.classList.add('shake-animation');
                         setTimeout(() => slider.classList.remove('shake-animation'), 500);
                    }
                }
                break;
            case 'prev':
                this.sfPrevStep();
                break;
            case 'startOver':
                this.sfStartOver();
                break;
            case 'confirmApply':
                 if (dataset.role && dataset.style) {
                     // Confirmation moved here from the utils function
                     if (confirm(`Apply Role '${escapeHTML(dataset.role)}' and Style '${escapeHTML(dataset.style)}' to the main form?\n\nThis will clear any unsaved changes in the form.`)) {
                         console.log("[SF_CONFIRM_APPLY] User confirmed.");
                         this.applyStyleFinderResult(dataset.role, dataset.style);
                     } else {
                          console.log("[SF_CONFIRM_APPLY] User cancelled application.");
                     }
                 } else {
                      console.warn("[SF ACTION] Missing role/style data for confirmApply action.");
                      this.sfShowFeedback("Error: Could not apply result.", "error");
                 }
                 break;
             case 'showDetails':
                 if (dataset.style) {
                     this.sfShowFullDetails(dataset.style, triggerElement);
                 }
                 break;
            default:
                console.warn(`[SF ACTION] Unknown action: ${action}`);
        }
    }

  handleStyleFinderSliderInput(sliderElement) {
        if (!sliderElement?.dataset.trait) return;
        const traitName = sliderElement.dataset.trait;
        const value = sliderElement.value;

        // Update the answer state
        this.sfSetTrait(traitName, value);

        // Update the description text
        const descElement = document.getElementById(`sf-desc-${traitName}`);
        if (descElement && this.sliderDescriptions[traitName]) {
             const descArray = this.sliderDescriptions[traitName];
             // Clamp index safely for description array
             const index = Math.max(0, Math.min(descArray.length - 1, value - 1));
             const descText = descArray[index] || `Value: ${value}`;
             descElement.textContent = escapeHTML(descText);
        }

        // Update the live dashboard scores
         this.sfUpdateDashboard();
         this.sfSliderInteracted = true; // Mark interaction
    }

  handleDetailTabClick(e) {
        const link = e.target.closest('.tab-link[data-tab-id]');
        if (!link) return; // Ignore clicks that aren't on a tab link

        e.preventDefault();
        const newTabId = link.dataset.tabId;
        const personId = this.elements.modal?.dataset.personId;
        const person = this.people.find(p => p.id === personId);
        if (!person) {
            console.error(`[TAB_CLICK] Could not find person with ID ${personId} for tab switch.`);
            return;
        }
        console.log(`[EVENT] Detail tab clicked: ${newTabId}`);

        // Deactivate previous tab and content
        const activeTab = this.elements.modalTabs?.querySelector('.tab-link.active');
        const activeContent = this.elements.modalBody?.querySelector('.tab-content.active');
        activeTab?.classList.remove('active');
        activeTab?.setAttribute('aria-selected', 'false');
        activeContent?.classList.remove('active');

        // Activate new tab and content
        link.classList.add('active');
        link.setAttribute('aria-selected', 'true');
        const contentPane = document.getElementById(newTabId);
        if (contentPane) {
            contentPane.classList.add('active');
            this.activeDetailModalTab = newTabId; // Store the active tab ID

            // Actions specific to the activated tab
            if (newTabId === 'tab-history') {
                // Ensure chart resizes correctly if already rendered
                requestAnimationFrame(() => this.chartInstance?.resize());
            }
            if (newTabId === 'tab-insights') {
                // Display the challenge when insights tab becomes active
                 const challengeArea = contentPane.querySelector('#daily-challenge-area');
                 if (challengeArea) this.displayDailyChallenge(person, challengeArea);
            }
            // If content wasn't pre-rendered (e.g., still shows loading text), render it now
             if (contentPane.querySelector('.loading-text')) {
                 this.renderDetailTabContent(person, newTabId, contentPane);
             }
            // Set focus to the content pane for accessibility
            contentPane.focus({ preventScroll: true });

        } else {
            console.warn(`[TAB_CLICK] Content pane not found for tab ID: ${newTabId}`);
        }
    }

   handleGlossaryLinkClick(e) {
        // This handles clicks on <a class="glossary-link" data-term-key="...">
        const link = e.target.closest('a.glossary-link[data-term-key]');
        if (link) {
             e.preventDefault(); // Prevent default anchor link behavior
             const termKey = link.dataset.termKey;
             console.log(`[EVENT] Glossary link clicked for key: ${termKey}`);
             // Check if glossary modal is already open
             if (this.elements.glossaryModal && this.elements.glossaryModal.getAttribute('aria-hidden') === 'false') {
                 // If open, just highlight the term
                 this.highlightGlossaryTerm(termKey);
             } else {
                 // If closed, open it and then highlight
                 this.showGlossary(termKey);
             }
        }
    }

   handleExploreStyleLinkClick(e) {
       e.preventDefault(); // Prevent default button behavior (though it's type="button")
       const selectedStyleName = this.elements.style?.value;
       if (selectedStyleName) {
           console.log(`[EVENT] Explore style link clicked for: ${selectedStyleName}`);
           this.showStyleDiscovery(selectedStyleName); // Pass name to highlight
       } else {
           console.warn("[EVENT] Explore style link clicked, but no style selected.");
           this.showStyleDiscovery(); // Open without highlight
       }
   }


  // --- Core Rendering ---

  renderStyles(roleKey) {
    console.log(`[RENDER] Rendering styles for role: ${roleKey}`);
    if (!this.elements.style) {
        console.error("[RENDER_STYLES] Style select element not found.");
        return;
    }
    const roleData = bdsmData[roleKey];
    // Get styles directly from bdsmData, filtering out any potentially invalid entries
    const styles = (roleData?.styles || []).filter(style => style && style.name);

    // Reset options
    this.elements.style.innerHTML = `<option value="">-- Select Style --</option>`;

    if (!roleData || styles.length === 0) {
        console.warn(`[RENDER_STYLES] No valid style data found for role: ${roleKey}`);
        this.elements.style.disabled = true;
    } else {
        this.elements.style.disabled = false;
        styles.forEach(style => {
             // Ensure name is escaped before inserting
             this.elements.style.innerHTML += `<option value="${escapeHTML(style.name)}">${escapeHTML(style.name)}</option>`;
        });
    }
    console.log(`[RENDER] Rendered ${styles.length} styles.`);
    this.updateStyleExploreLink(); // Ensure link visibility/text is correct
}


  renderTraits(roleKey, styleName) {
        console.log(`[RENDER] Rendering traits for role: ${roleKey}, style: ${styleName}`);
        if (!this.elements.traitsContainer || !this.elements.traitsMessage) {
             console.error("[RENDER_TRAITS] Traits container or message element not found.");
             return;
        }

        const roleData = bdsmData[roleKey];
        if (!roleData) {
            console.warn(`[RENDER_TRAITS] No data found for role key: ${roleKey}`);
            this.elements.traitsContainer.innerHTML = '<p class="muted-text">Invalid role selected.</p>';
            this.elements.traitsContainer.style.display = 'block';
            this.elements.traitsMessage.style.display = 'none';
            return;
        }

        let traitsToRender = [];
        const addedTraitNames = new Set(); // Track added traits to avoid duplicates

        // Add Core Traits first
        (roleData.coreTraits || []).forEach(trait => {
            if (trait && trait.name && !addedTraitNames.has(trait.name)) {
                traitsToRender.push(trait);
                addedTraitNames.add(trait.name);
            }
        });

        // Add Style-Specific Traits if a style is selected
        const normalizedStyle = normalizeStyleKey(styleName);
        if (normalizedStyle && roleData.styles) {
            const styleData = roleData.styles.find(s => normalizeStyleKey(s.name) === normalizedStyle);
            (styleData?.traits || []).forEach(trait => {
                if (trait && trait.name && !addedTraitNames.has(trait.name)) {
                    traitsToRender.push(trait);
                    addedTraitNames.add(trait.name);
                }
            });
        }

        // Sort traits alphabetically for consistent order
        traitsToRender.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        if (traitsToRender.length > 0) {
            // Get current trait values from the person being edited or the preview buffer
            const currentTraits = this.currentEditId
                ? this.people.find(p => p.id === this.currentEditId)?.traits
                : (this.previewPerson?.traits || {});

            // Generate HTML for each trait
            let traitsHTML = traitsToRender.map(trait => {
                 const currentValue = currentTraits?.[trait.name] ?? 3; // Default to 3 if not set
                 return this.createTraitHTML(trait, currentValue);
            }).join('');

            this.elements.traitsContainer.innerHTML = traitsHTML;
            this.elements.traitsContainer.style.display = 'block';
            this.elements.traitsMessage.style.display = 'none';

            // Initialize descriptions for sliders
            this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                 this.updateTraitDescription(slider);
            });
        } else {
             // Show appropriate message if no traits are available
             const message = styleName
                 ? `<p class="muted-text">No specific traits defined for the '${escapeHTML(styleName)}' style. Focus on the core role traits!</p>`
                 : `<p class="muted-text">Select a Style above to see style-specific traits, or focus on core role traits.</p>`;
             this.elements.traitsContainer.innerHTML = message;
             this.elements.traitsContainer.style.display = 'block';
             this.elements.traitsMessage.style.display = 'none';
        }
        console.log(`[RENDER] Rendered ${traitsToRender.length} traits.`);
    }

  createTraitHTML(trait, value = 3) {
      // Validate trait data
      if (!trait || !trait.name || !trait.desc || !trait.explanation) {
           console.warn("[CREATE_TRAIT_HTML] Invalid trait data received:", trait);
           return ''; // Return empty string for invalid data
      }

      const escapedName = escapeHTML(trait.name);
      // Create a more robust unique ID
      const uniqueId = `trait-${escapedName.replace(/[^a-zA-Z0-9]/g, '-')}-${generateSimpleId()}`;
      const escapedExplanation = escapeHTML(trait.explanation);
      // Ensure value is within range 1-5
      const currentValue = Math.max(1, Math.min(5, parseInt(value, 10) || 3));
      // Get description text, fall back gracefully
      const descriptionText = trait.desc[currentValue] || trait.desc[3] || `Current value: ${currentValue}`;
      const flair = getFlairForScore(currentValue);
      const title = `${escapedName.charAt(0).toUpperCase() + escapedName.slice(1)}`;

      return `
        <div class="trait">
            <label for="${uniqueId}" class="trait-label">
                <span>${title} ${flair}</span>
                 {/* Use context help button styling but specific dataset */}
                 <button type="button" class="small-btn context-help-btn trait-info-btn"
                         data-trait-name="${escapedName}"
                         aria-label="Info about ${title}" aria-expanded="false"
                         title="Click for details on the ${title} trait">?</button>
            </label>
            <div class="slider-container">
                <input type="range" id="${uniqueId}" class="trait-slider" name="${escapedName}"
                       min="1" max="5" value="${currentValue}" data-trait-name="${escapedName}"
                       aria-describedby="desc-${uniqueId}">
                <span class="trait-value" aria-hidden="true">${currentValue}</span>
            </div>
            <div class="trait-desc" id="desc-${uniqueId}">${escapeHTML(descriptionText)}</div>
        </div>
      `;
  }

  updateTraitDescription(slider) {
    // Updates the text description below a trait slider based on its value
    if (!slider?.dataset.traitName) return;

    const traitName = slider.dataset.traitName;
    const value = slider.value;
    const traitContainer = slider.closest('.trait'); // Find the parent .trait container
    const descElement = traitContainer?.querySelector('.trait-desc');
    const labelSpan = traitContainer?.querySelector('.trait-label span'); // Find the span within the label

    if (!descElement || !labelSpan) {
        console.warn(`[UPDATE_TRAIT_DESC] Could not find description or label span elements for trait '${traitName}'.`);
        return;
    }

    // Find the trait data (explanation & descriptions)
    let traitData = null;
    for (const roleKey in bdsmData) { // Search across all roles
        const roleData = bdsmData[roleKey];
        traitData = roleData.coreTraits?.find(t => t.name === traitName) ||
                    roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (traitData) break; // Stop searching once found
    }

    if (traitData?.desc?.[value]) {
        descElement.textContent = escapeHTML(traitData.desc[value]);
        // Update the label with flair
        labelSpan.textContent = `${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))} ${getFlairForScore(value)}`;
    } else {
         console.warn(`[UPDATE_TRAIT_DESC] Could not find description for trait '${traitName}' at value ${value}.`);
         descElement.textContent = `Value: ${value}`; // Fallback description
         labelSpan.textContent = `${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))} ${getFlairForScore(value)}`;
    }
}

  renderList() {
    console.log("[RENDER] Rendering persona list.");
    if (!this.elements.peopleList) {
         console.error("[RENDER_LIST] People list element not found.");
         return;
    }
    if (this.people.length === 0) {
      this.elements.peopleList.innerHTML = '<li><p class="muted-text">No personas created yet. Use the form to add one!</p></li>';
    } else {
      // Generate HTML for each person and join
      this.elements.peopleList.innerHTML = this.people
        .map(person => this.createPersonListItemHTML(person))
        .join('');

      // Apply highlight animation to the last saved item
      if (this.lastSavedId) {
          const listItem = this.elements.peopleList.querySelector(`li[data-id="${this.lastSavedId}"]`);
          if (listItem) {
               listItem.classList.add('item-just-saved');
               // Remove the class after the animation duration (defined in CSS)
               setTimeout(() => listItem?.classList.remove('item-just-saved'), 1500);
          }
          this.lastSavedId = null; // Clear the ID after highlighting
      }
    }
    console.log(`[RENDER] Rendered ${this.people.length} personas in list.`);
}

  createPersonListItemHTML(person) {
        // Basic validation of input data
        if (!person?.id || !person.name) {
            console.warn("[CREATE_PERSON_ITEM] Invalid person data received:", person);
            return ''; // Return empty string if data is invalid
        }
        // Escape all dynamic content
        const escapedName = escapeHTML(person.name);
        const escapedRole = escapeHTML(person.role || 'N/A');
        const escapedStyle = escapeHTML(person.style || 'N/A');
        const avatar = escapeHTML(person.avatar || '❓');
        const achievementCount = person.achievements?.length || 0;
        const achievementPreview = achievementCount > 0 ? `<span class="person-achievements-preview" title="${achievementCount} Achievements">🏆${achievementCount}</span>` : '';

        // Use button for the main info area for better accessibility
        return `
            <li data-id="${person.id}">
                <button type="button" class="person-info" aria-label="View details for ${escapedName}">
                    <span class="person-avatar" aria-hidden="true">${avatar}</span>
                    <div class="person-name-details">
                        <span class="person-name">${escapedName} ${achievementPreview}</span>
                        <span class="person-details">${escapedRole} / ${escapedStyle}</span>
                    </div>
                </button>
                <div class="person-actions">
                    <button type="button" class="small-btn edit-btn" aria-label="Edit ${escapedName}">Edit ✏️</button>
                    <button type="button" class="small-btn delete-btn" aria-label="Delete ${escapedName}">Delete 🗑️</button>
                </div>
            </li>
        `;
    }

  updateStyleExploreLink() {
      // Updates the text and visibility of the "(Explore Details)" link near the style dropdown
      if (!this.elements.styleExploreLink || !this.elements.style) return;

      const selectedStyleName = this.elements.style.value;
      if (selectedStyleName) {
          // Escape style name for display
          const escapedStyleName = escapeHTML(selectedStyleName);
          this.elements.styleExploreLink.textContent = `(Explore '${escapedStyleName}' Details)`;
          this.elements.styleExploreLink.setAttribute('aria-label', `Explore details for the ${escapedStyleName} style`);
          this.elements.styleExploreLink.style.display = 'inline'; // Show the link
      } else {
           this.elements.styleExploreLink.style.display = 'none'; // Hide the link if no style selected
      }
  }


  // --- CRUD Operations ---

  savePerson() {
      console.log(`[SAVE_PERSON] Attempting save. Editing ID: ${this.currentEditId || 'New'}`);
      if (this.isSaving) {
          console.warn("[SAVE_PERSON] Save already in progress. Aborting.");
          return; // Prevent saving if already in progress
      }

      // Basic form validation
      if (!this.elements.name?.value?.trim()) {
          this.showNotification("Please enter a name for the persona.", "warning");
          this.elements.name?.focus();
          return;
      }
      if (!this.elements.style?.value) {
           this.showNotification("Please select a style for the persona.", "warning");
           this.elements.style?.focus();
           return;
      }

      this.isSaving = true;
      this.showLoadingOnSaveButton(true);

      // Gather data from form elements
      const personData = {
          id: this.currentEditId || generateSimpleId(), // Use existing ID or generate new
          name: this.elements.name.value.trim(),
          avatar: this.elements.avatarInput.value || '❓',
          role: this.elements.role.value,
          style: this.elements.style.value,
          traits: {},
          // Initialize or preserve existing complex fields
          achievements: [],
          goals: [],
          history: [],
          reflections: ""
      };

      // Gather trait scores
      this.elements.traitsContainer?.querySelectorAll('.trait-slider').forEach(slider => {
          if (slider.name) { // Ensure slider has a name (trait name)
            personData.traits[slider.name] = parseInt(slider.value, 10);
          }
      });

       // Grant trait-based achievements immediately (before saving)
       Object.values(personData.traits).forEach(score => {
           if (score === 5) grantAchievement(personData, 'max_trait', this.showNotification.bind(this)); // No save needed here, happens below
           if (score === 1) grantAchievement(personData, 'min_trait', this.showNotification.bind(this));
       });

      // Use setTimeout to allow UI update (spinner) before potentially blocking save operation
      setTimeout(() => {
        try {
            if (this.currentEditId) {
                // Update existing persona
                const index = this.people.findIndex(p => p.id === this.currentEditId);
                if (index !== -1) {
                    // Preserve existing goals, history, achievements, reflections
                    personData.goals = this.people[index].goals || [];
                    personData.history = this.people[index].history || [];
                    personData.achievements = this.people[index].achievements || []; // Keep existing achievements
                    personData.reflections = this.people[index].reflections || "";
                    this.people[index] = personData; // Replace data at index
                    console.log(`[SAVE_PERSON] Updated persona ID: ${this.currentEditId}`);
                    // Grant achievement for editing (pass save function)
                    grantAchievement(personData, 'profile_edited', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                } else {
                    console.error(`[SAVE_PERSON] Error: Could not find persona with ID ${this.currentEditId} to update.`);
                    this.showNotification("Error updating persona.", "error");
                    this.isSaving = false; this.showLoadingOnSaveButton(false); return; // Exit if index not found
                }
            } else {
                // Add new persona
                this.people.push(personData);
                console.log(`[SAVE_PERSON] Added new persona ID: ${personData.id}`);
                // Grant achievement for creation (pass save function)
                grantAchievement(personData, 'profile_created', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                // Check for crew size achievement
                if (this.people.length >= 5) {
                    grantAchievement({}, 'five_profiles', this.showNotification.bind(this)); // Global achievement doesn't need person data or save
                }
            }

            this.lastSavedId = personData.id; // Set for highlight animation
            this.saveToLocalStorage(); // Persist changes
            this.renderList(); // Update the displayed list
            this.resetForm(); // Clear the form
            this.showNotification("Persona saved successfully!", "success");

        } catch (error) {
            console.error("[SAVE_PERSON] Error during save operation:", error);
            this.showNotification("An error occurred while saving.", "error");
        } finally {
             this.isSaving = false; // Reset saving flag
             this.showLoadingOnSaveButton(false); // Hide spinner
        }
      }, 10); // Minimal delay for UI responsiveness
  }


  editPerson(personId) {
      console.log(`[EDIT_PERSON] Loading persona ID: ${personId} into form.`);
      const person = this.people.find(p => p.id === personId);
      if (!person) {
            console.error(`[EDIT_PERSON] Persona with ID ${personId} not found.`);
            return this.showNotification("Could not find persona to edit.", "error");
      }

      // Populate basic fields
      this.elements.name.value = person.name;
      this.elements.avatarInput.value = person.avatar;
      this.elements.avatarDisplay.textContent = person.avatar;
      // Update avatar button selection
      this.elements.avatarButtons.forEach(b => b.classList.toggle('selected', b.dataset.emoji === person.avatar));
      this.elements.role.value = person.role;

      // Render styles based on role, THEN set the style value
      this.renderStyles(person.role);

      // Delay setting style and rendering traits to allow dropdown population
      setTimeout(() => {
         if (!this.elements.style) {
              console.error("[EDIT_PERSON] Style select element not found after delay. Cannot set style value.");
              return; // Abort if style element vanished
         }
         this.elements.style.value = person.style;
         // Check if the style value actually exists in the dropdown
         if (this.elements.style.value !== person.style) {
              console.warn(`[EDIT_PERSON] Style "${person.style}" not found in dropdown for role "${person.role}". Style field cleared.`);
              this.elements.style.value = ''; // Clear if invalid
         }

         // Render traits based on selected role and style
         this.renderTraits(person.role, this.elements.style.value);

         // Populate trait sliders AFTER traits are rendered
         if (person.traits) {
             this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                 if (person.traits.hasOwnProperty(slider.name)) {
                     slider.value = person.traits[slider.name];
                     // Update the numerical display next to the slider
                     const traitContainer = slider.closest('.trait');
                     const valueDisplay = traitContainer?.querySelector('.trait-value');
                     if (valueDisplay) valueDisplay.textContent = slider.value;
                     // Update the text description below the slider
                     this.updateTraitDescription(slider);
                 }
             });
         }
          this.updateLivePreview(); // Update preview with loaded data
          this.updateStyleExploreLink(); // Update link text
      }, 100); // Increased delay slightly for robustness

      // Update form state
      this.currentEditId = personId;
      if(this.elements.formTitle) this.elements.formTitle.textContent = `✏️ Edit: ${escapeHTML(person.name)} ✨`;
      // IMPROVEMENT: Use saveButtonText span for consistency
      const updateText = 'Update Persona! 💾 ';
      if(this.elements.saveButtonText) this.elements.saveButtonText.textContent = updateText;
      else if (this.elements.save) this.elements.save.textContent = updateText; // Fallback

      // Scroll to form and focus name field
      this.elements.formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       setTimeout(() => this.elements.name?.focus(), 350); // Focus after scroll animation
      console.log(`[EDIT_PERSON] Form populated for ${person.name}.`);
  }


  deletePerson(personId) {
      console.log(`[DELETE_PERSON] Attempting to delete persona ID: ${personId}`);
      const personIndex = this.people.findIndex(p => p.id === personId);
      if (personIndex === -1) {
            console.error(`[DELETE_PERSON] Persona with ID ${personId} not found.`);
            return this.showNotification("Could not find persona to delete.", "error");
      }

      const personName = this.people[personIndex].name || `Persona ${personId.substring(0,4)}`;
      // Confirmation is handled by the caller (handleListClick)
      console.log(`[DELETE_PERSON] Deleting ${personName}.`);

      // Remove the person from the array
      this.people.splice(personIndex, 1);
      this.saveToLocalStorage(); // Save the updated array
      this.renderList(); // Re-render the list display

      // If the deleted person was being edited, reset the form
      if (this.currentEditId === personId) {
          this.resetForm();
      }
       this.updateLivePreview(); // Update preview in case it showed the deleted persona
       this.showNotification(`Persona "${escapeHTML(personName)}" deleted.`, "info");
  }


  resetForm(isManualClear = false) {
      console.log(`[RESET_FORM] Resetting form. Manual clear: ${isManualClear}`);
      if(this.elements.mainForm) this.elements.mainForm.reset(); // Resets native form controls

      // Reset state variables
      this.currentEditId = null;
      this.previewPerson = null; // Clear preview buffer

      // Reset custom elements/state
      if(this.elements.avatarInput) this.elements.avatarInput.value = '❓';
      if(this.elements.avatarDisplay) this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarButtons?.forEach(b => b.classList.toggle('selected', b.dataset.emoji === '❓'));

      if(this.elements.role) this.elements.role.value = 'submissive'; // Default role
      this.renderStyles('submissive'); // Render styles for default role
      if(this.elements.style) this.elements.style.value = ''; // Clear style selection
      this.renderTraits('submissive', ''); // Render core traits for default role

      // Reset button text and form title
      if(this.elements.formTitle) this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      const saveText = 'Save Persona! 💖 ';
      if(this.elements.saveButtonText) this.elements.saveButtonText.textContent = saveText;
      else if (this.elements.save) this.elements.save.textContent = saveText; // Fallback

      // Update dependent UI
      this.updateLivePreview();
       this.updateStyleExploreLink();

      // Provide feedback if cleared manually
      if (isManualClear) {
          this.showNotification("Form cleared.", "info", 2000);
           this.elements.name?.focus(); // Focus name field after manual clear
      }
      console.log("[RESET_FORM] Form reset complete.");
  }

  showLoadingOnSaveButton(isLoading) {
      if (!this.elements.save || !this.elements.saveSpinner) return;
      this.elements.save.disabled = isLoading;
      this.elements.saveSpinner.style.display = isLoading ? 'inline-block' : 'none';

      // Update button text based on loading state and edit mode
      const defaultSaveText = 'Save Persona! 💖';
      const updateText = 'Update Persona! 💾';
      const loadingText = 'Saving... ';

      let targetText = '';
      if (isLoading) {
          targetText = loadingText;
      } else {
          targetText = this.currentEditId ? updateText : defaultSaveText;
      }

      // Use the inner span if available, otherwise update the button directly
      const buttonTextElement = this.elements.saveButtonText;
      if (buttonTextElement) {
          // Clear existing content before setting new text
          let baseText = targetText;
          let emoji = '';
          if (!isLoading) {
              emoji = this.currentEditId ? '' : '💖'; // Only add emoji for initial save
              if(emoji) baseText = baseText.replace(emoji,'').trim(); // Remove emoji if present in base text
          }
          buttonTextElement.textContent = baseText + ' '; // Add space for potential emoji

          // Re-add emoji span if needed
          const existingEmojiSpan = buttonTextElement.querySelector('span[role="img"]');
          if (existingEmojiSpan) existingEmojiSpan.remove(); // Remove old one first

          if (emoji) {
              const span = document.createElement('span');
              span.setAttribute('role', 'img');
              span.setAttribute('aria-label', 'Sparkles'); // Or appropriate label
              span.textContent = emoji;
              buttonTextElement.appendChild(span);
          }
      } else if (this.elements.save) {
          this.elements.save.textContent = targetText; // Fallback if structure changed
      }
  }

  // --- Live Preview ---
  updateLivePreview() {
    if (!this.elements.livePreview) return;

    // Gather current form data safely using optional chaining
    const name = this.elements.name?.value?.trim() || "Unnamed Persona";
    const role = this.elements.role?.value || "";
    const style = this.elements.style?.value || "";
    const avatar = this.elements.avatarInput?.value || '❓';
    const traits = {};
    this.elements.traitsContainer?.querySelectorAll('.trait-slider').forEach(slider => {
        if (slider.name) { // Ensure slider has a name
            traits[slider.name] = parseInt(slider.value, 10);
        }
    });

    // Update internal preview state
    this.previewPerson = { name, role, style, avatar, traits };

    let breakdownHTML = '<p class="muted-text">Select Role & Style for breakdown.</p>';
    let synergyHTML = '';

    // Generate breakdown and hints only if role and style are selected
    if (role && style) {
        const breakdownData = getStyleBreakdown(style, traits, role); // Use consolidated function
        if (breakdownData) {
             // Breakdown text is already escaped by getStyleBreakdown
             breakdownHTML = `
                 <div class="preview-breakdown">
                     <h4>Strengths:</h4>
                     <p>${breakdownData.strengths}</p>
                     <h4>Growth Areas:</h4>
                     <p>${breakdownData.improvements}</p>
                 </div>
             `;
        }
        // Find synergy hints if traits exist
        if (Object.keys(traits).length > 0) {
            const hints = findHintsForTraits(traits);
            if (hints.length > 0) {
                 // Escape the first hint's text
                 synergyHTML = `
                     <div class="preview-synergy-hint">
                         <strong>Synergy Hint:</strong> ${escapeHTML(hints[0].text)}
                         ${hints.length > 1 ? ` <small>(${hints.length - 1} more...)</small>` : ''}
                     </div>
                 `;
            }
        }
    }
    // Use escapeHTML for all user-provided data in the main structure
    this.elements.livePreview.innerHTML = `
        <div class="preview-avatar-name">
            <span class="person-avatar" aria-hidden="true">${escapeHTML(avatar)}</span>
            <h3 class="preview-title">${escapeHTML(name)}</h3>
        </div>
        <p class="preview-role-style">${escapeHTML(role) || 'No Role'} / ${escapeHTML(style) || 'No Style Selected'}</p>
        ${breakdownHTML} {/* Breakdown HTML already escaped */}
        ${synergyHTML} {/* Synergy HTML already escaped */}
        <div id="daily-challenge-area" role="region" aria-live="polite" aria-labelledby="daily-challenge-title">
             <!-- Daily challenge content injected separately -->
        </div>
    `;
    // Display the daily challenge relevant to the preview context
    this.displayDailyChallenge(null, this.elements.livePreview.querySelector('#daily-challenge-area')); // Pass target explicitly
}


  // --- Modal Display ---

  showPersonDetails(personId) {
    console.log(`[DETAILS] Showing details for persona ID: ${personId}`);
    const person = this.people.find(p => p.id === personId);
    if (!person) {
        console.error(`[DETAILS] Persona with ID ${personId} not found.`);
        return this.showNotification("Could not find persona details.", "error");
    }
    if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs || !this.elements.detailModalTitle) {
        console.error("[DETAILS] UI Error: Detail modal elements missing.");
        return this.showNotification("UI Error: Cannot display details.", "error");
    }

    // Set person ID on modal for context
    this.elements.modal.dataset.personId = personId;

    // Update modal title and subtitle (Escape HTML)
    this.elements.detailModalTitle.innerHTML = `
        <span class="person-avatar" aria-hidden="true">${escapeHTML(person.avatar || '❓')}</span>
        ${escapeHTML(person.name)}
        <span class="modal-subtitle">${escapeHTML(person.role)} / ${escapeHTML(person.style)}</span>
    `;

    // Define tabs
    const tabs = [
        { id: 'tab-traits-breakdown', label: '🌟 Traits & Style' },
        { id: 'tab-goals-journal', label: '🎯 Goals & Journal' },
        { id: 'tab-history', label: '📊 History' },
        { id: 'tab-insights', label: '💡 Insights' }
    ];

    // Render tabs (Escape labels)
    this.elements.modalTabs.innerHTML = tabs.map(tab => `
        <button type="button" class="tab-link ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
                role="tab" aria-selected="${tab.id === this.activeDetailModalTab ? 'true' : 'false'}"
                aria-controls="${tab.id}" data-tab-id="${tab.id}" id="tab-label-${tab.id}">
            ${escapeHTML(tab.label)}
        </button>
    `).join('');

    // Render tab content skeletons (Escape labels)
    this.elements.modalBody.innerHTML = tabs.map(tab => `
        <div class="tab-content ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
             id="${tab.id}" role="tabpanel" aria-labelledby="tab-label-${tab.id}" tabindex="-1">
             <p class="loading-text" role="status">Loading ${escapeHTML(tab.label)}...</p>
        </div>
    `).join('');

    // Immediately render content for the currently active tab
    const activeContentPane = this.elements.modalBody.querySelector(`#${this.activeDetailModalTab}`);
    if (activeContentPane) {
        this.renderDetailTabContent(person, this.activeDetailModalTab, activeContentPane);
    } else {
        console.error(`[DETAILS] Active content pane not found: ${this.activeDetailModalTab}`);
    }

    this.openModal(this.elements.modal); // Open the modal
    console.log(`[DETAILS] Modal opened for ${person.name}.`);
}

renderDetailTabContent(person, tabId, contentElement) {
    if (!person || !tabId || !contentElement) {
        console.error(`[RENDER_TAB] Invalid arguments for rendering tab content. Person: ${!!person}, TabID: ${tabId}, Element: ${!!contentElement}`);
        if(contentElement) contentElement.innerHTML = '<p class="error-text">Error: Could not load tab content.</p>';
        return;
    }
    console.log(`[RENDER_TAB] Rendering content for Tab ID: ${tabId}`);
    let contentHTML = '';
    try {
        // Generate HTML based on the tab ID
        switch (tabId) {
            case 'tab-traits-breakdown':
                contentHTML = this.renderTraitsBreakdownTab(person);
                break;
            case 'tab-goals-journal':
                contentHTML = this.renderGoalsJournalTab(person);
                break;
            case 'tab-history':
                contentHTML = this.renderHistoryTabStructure(person);
                break;
            case 'tab-insights':
                contentHTML = this.renderInsightsTab(person);
                break;
            default:
                console.warn(`[RENDER_TAB] Unknown tab ID: ${tabId}`);
                contentHTML = `<p class="error-text">Unknown tab content: ${escapeHTML(tabId)}</p>`;
        }
        // Set the generated HTML
        contentElement.innerHTML = contentHTML;

        // Post-render actions specific to tabs
        if (tabId === 'tab-history') {
            // Render the chart after the canvas element is in the DOM
            this.renderHistoryChart(person, `history-chart-${person.id}`);
        }
        if (tabId === 'tab-insights') {
            // Display daily challenge specific to this tab's content area
             const challengeArea = contentElement.querySelector('#daily-challenge-area');
             if (challengeArea) {
                 this.displayDailyChallenge(person, challengeArea); // Pass the specific element
             }
        }
    } catch (error) {
         console.error(`[RENDER_TAB] Error rendering content for ${tabId}:`, error);
         contentElement.innerHTML = `<p class="error-text">Error loading content for ${escapeHTML(tabId)}. Check console.</p>`;
    }
}

  // --- Rendering Functions for Merged Tab Sections ---

  renderTraitsBreakdownTab(person) {
    // Renders content for the "Traits & Style" tab
    return `
        <section aria-labelledby="trait-details-heading">
             <h3 id="trait-details-heading">Trait Constellation ${getFlairForScore(4)}</h3>
             ${this.renderTraitDetails(person)} {/* Renders the grid of traits */}
        </section>
        <section aria-labelledby="style-breakdown-heading">
            <h3 id="style-breakdown-heading">Style Spotlight ✨</h3>
            ${this.renderStyleBreakdownDetail(person)} {/* Renders strengths/growth */}
        </section>
    `;
}

  renderGoalsJournalTab(person) {
      // Renders content for the "Goals & Journal" tab
      return `
        <section class="goals-section" aria-labelledby="goals-heading">
            <h3 id="goals-heading">🎯 Goals & Aspirations</h3>
            ${this.renderGoalList(person)} {/* Renders goals list and add form */}
        </section>
        <section class="reflections-section" aria-labelledby="journal-heading">
            <h3 id="journal-heading">📝 Journal & Reflections</h3>
            ${this.renderJournalTab(person)} {/* Renders journal area */}
        </section>
    `;
  }

  renderHistoryTabStructure(person) {
      // Renders the structure for the "History" tab, including canvas and snapshot list
      // Chart rendering is called separately after this structure is in the DOM
      return `
        <section class="history-section" aria-labelledby="history-heading">
             <h3 id="history-heading">📊 Progress Over Time</h3>
             <p class="muted-text">Track changes in traits, style, and role over time.</p>
             <div class="modal-actions">
                  {/* Snapshot button now handled by delegation */}
                 <button type="button" id="snapshot-btn" class="small-btn accent-btn">📸 Take Snapshot</button>
             </div>
             {/* Container for the chart - initial state shows loading/message */}
             <div class="history-chart-container ${!person.history || person.history.length < 2 ? 'chart-loading' : ''}">
                 <canvas id="history-chart-${person.id}"></canvas>
                 ${!person.history || person.history.length < 2 ? '<p class="muted-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Need at least two snapshots to show trait history.</p>' : ''}
             </div>
             <h4>Saved Snapshots:</h4>
             <ul class="snapshot-list">
                 ${person.history && person.history.length > 0 ?
                     person.history.map((snapshot, index) => `
                         <li class="snapshot-item">
                             <span>${new Date(snapshot.timestamp).toLocaleString()} - ${escapeHTML(snapshot.role)} / ${escapeHTML(snapshot.style)}</span>
                              {/* Toggle button handled by delegation */}
                             <button type="button" class="small-btn snapshot-toggle"
                                     aria-expanded="false" aria-controls="snapshot-details-${person.id}-${index}">
                                 View Traits
                             </button>
                             {/* Collapsible details area */}
                             <div id="snapshot-details-${person.id}-${index}" class="snapshot-details" style="display: none;">
                                 <ul>
                                     ${Object.entries(snapshot.traits || {}).map(([key, value]) =>
                                         // Escape trait names and values
                                         `<li><strong>${escapeHTML(key)}:</strong> ${escapeHTML(String(value))} ${getFlairForScore(value)}</li>`
                                     ).join('')}
                                     ${Object.keys(snapshot.traits || {}).length === 0 ? '<li><small>(No trait data)</small></li>' : ''}
                                 </ul>
                             </div>
                         </li>
                     `).reverse().join('') // Show newest first
                     : '<li><p class="muted-text">No snapshots saved yet. Click "Take Snapshot" to start tracking!</p></li>'
                 }
             </ul>
        </section>
    `;
  }


  renderInsightsTab(person) {
       // Renders content for the "Insights" tab
       const synergyHints = this.getSynergyHints(person);
       const goalHints = this.getGoalAlignmentHints(person);
       return `
        <section class="oracle-tab-content" aria-labelledby="oracle-heading">
            <h3 id="oracle-heading">🔮 Kink Oracle</h3>
            <div id="oracle-reading-output">
                <p class="muted-text">Consult the Oracle for guidance based on your current persona...</p>
            </div>
            <div class="modal-actions">
                 {/* Oracle button handled by delegation */}
                <button type="button" id="oracle-btn" class="small-btn accent-btn">Consult Oracle ✨</button>
            </div>
        </section>
        <section aria-labelledby="synergy-heading">
             <h3 id="synergy-heading">🤝 Synergy & Dynamics</h3>
             ${synergyHints.length > 0
                 // Escape hint text before inserting
                 ? `<ul>${synergyHints.map(h => `<li style="margin-bottom: 0.5em;">${h.type === 'positive' ? '✨' : '🤔'} ${escapeHTML(h.text)}</li>`).join('')}</ul>`
                 : '<p class="muted-text">No specific trait synergies detected currently. Keep exploring!</p>'
             }
        </section>
        <section aria-labelledby="goal-align-heading">
             <h3 id="goal-align-heading">🌱 Goal Alignment</h3>
             ${goalHints.length > 0
                 // Goal alignment hints are pre-escaped where needed by getGoalAlignmentHints
                 ? `<ul>${goalHints.map(h => `<li style="margin-bottom: 0.5em;">${h}</li>`).join('')}</ul>`
                 : '<p class="muted-text">Add some goals to see alignment hints based on your traits!</p>'
             }
        </section>
        <section aria-labelledby="daily-challenge-insights-heading">
             <h3 id="daily-challenge-insights-heading">🌟 Today's Focus 🌟</h3>
             {/* Challenge area - content injected by displayDailyChallenge */}
             <div id="daily-challenge-area" role="region" aria-live="polite">
                 <p class="muted-text">Loading today's focus...</p>
             </div>
        </section>
        <section class="achievements-section" aria-labelledby="achievements-insights-heading">
            <h3 id="achievements-insights-heading">🏆 Recent Achievements</h3>
             {/* Renders a limited list of achievements */}
            ${this.renderAchievementsList(person, true)}
        </section>
    `;
   }


  // --- Individual Component Rendering Functions for Detail Modal ---

  renderTraitDetails(person) {
    // Renders the grid of trait details within the Traits & Style tab
    if (!person?.traits || Object.keys(person.traits).length === 0) {
      return '<p class="muted-text">No traits defined for this persona yet.</p>';
    }
     // Sort traits alphabetically by name for consistent display
     const sortedTraitEntries = Object.entries(person.traits).sort((a, b) => a[0].localeCompare(b[0]));

    let html = '<div class="trait-details-grid">';
    sortedTraitEntries.forEach(([name, score]) => {
        // Use the helper function to find the explanation robustly
        const explanation = findTraitExplanation(name); // Already handles fallbacks

        const escapedName = escapeHTML(name);
        const displayTitle = escapedName.charAt(0).toUpperCase() + escapedName.slice(1);
        // Use the glossary term if available for the link title, otherwise use the name
        const escapedTermForTitle = escapeHTML(glossaryTerms[name]?.term || displayTitle);
        const escapedExplanation = escapeHTML(explanation);
        const value = parseInt(score, 10);
        const flair = getFlairForScore(value);

        // Get the specific description for the score, escape it
        let traitDesc = '';
        // Find trait data again specifically for descriptions (could optimize this)
        let traitData = null;
        for (const roleKey in bdsmData) { // Search all roles
            const roleData = bdsmData[roleKey];
            traitData = roleData.coreTraits?.find(t => t.name === name) ||
                        roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === name);
            if (traitData?.desc) break;
        }
        if (traitData?.desc?.[value]) {
            traitDesc = escapeHTML(traitData.desc[value]);
        }

        html += `
        <div class="trait-detail-item">
            <h4>
                 {/* Link to glossary term */}
                 <a href="#glossary-${escapedName}" class="glossary-link" data-term-key="${escapedName}" title="View '${escapedTermForTitle}' in Glossary">${displayTitle}</a>
                <span class="trait-score-badge">${value} ${flair}</span>
            </h4>
            <p>${this.linkGlossaryTerms(escapedExplanation)}</p> {/* Link terms within explanation */}
            ${traitDesc ? `<p><em>(${traitDesc})</em></p>` : ''} {/* Show score description */}
        </div>
        `;
    });
    html += '</div>';
    return html;
}


  renderStyleBreakdownDetail(person) {
      // Renders the style breakdown (strengths/improvements)
      let breakdown;
      if (person.role && person.style && person.traits) {
            // Uses the utility function which now handles HTML escaping internally
            breakdown = getStyleBreakdown(person.style, person.traits, person.role);
      } else {
           return '<p class="muted-text">Select a Role and Style, and define traits to see the breakdown.</p>';
      }
      // The breakdown object properties are assumed to be safe HTML from getStyleBreakdown
      return `
        <div class="style-breakdown">
          <div class="strengths">
            <h4>Strengths & Expressions</h4>
            <p>${breakdown.strengths}</p>
          </div>
          <div class="improvements">
            <h4>Potential Growth Areas</h4>
            <p>${breakdown.improvements}</p>
          </div>
        </div>
      `;
  }


  renderJournalTab(person) {
      // Renders the journal textarea and buttons
      const reflections = person.reflections || "";
      // Escape existing reflections before putting them in the textarea value
      const escapedReflections = escapeHTML(reflections);
      return `
        <div class="modal-actions">
             {/* Prompt button handled by delegation */}
            <button type="button" id="journal-prompt-btn" class="small-btn">💡 Get Prompt</button>
        </div>
        {/* Area to display the selected prompt */}
        <div id="journal-prompt-area" class="journal-prompt" style="display: none;">
             <!-- Prompt injected here by showJournalPrompt -->
        </div>
        <form action="#"> {/* Form prevents accidental submission */}
            <label for="reflections-textarea-${person.id}" class="sr-only">Journal Entry</label>
            <textarea id="reflections-textarea-${person.id}" class="reflections-textarea" placeholder="Reflect on your experiences, feelings, goals...">${escapedReflections}</textarea>
            <div class="modal-actions">
                  {/* Save button handled by delegation */}
                 <button type="button" id="save-reflections-btn" class="small-btn save-btn">Save Reflections 💾</button>
            </div>
        </form>
      `;
  }


  renderAchievementsList(person = null, limit = false) {
    // Renders the list of achievements, either globally or for a specific persona
    const isGlobalView = person === null;
    const achievementKeys = Object.keys(achievementList);
    const maxToShow = limit ? 6 : Infinity; // Limit displayed items if requested

    let achievementsHTML = `<ul class="${isGlobalView ? 'all-achievements-list' : 'persona-achievements-list'}">`;
    let count = 0;

    if (isGlobalView) {
        // Sort all achievements alphabetically for the global view
        const sortedKeys = achievementKeys.sort((a, b) =>
            (achievementList[a]?.name || '').localeCompare(achievementList[b]?.name || '')
        );
        sortedKeys.forEach(id => {
            const details = achievementList[id];
            if (!details) return; // Skip if details missing

            // Check if unlocked globally (via localStorage) or by any persona
            let globallyUnlocked = false;
            try { globallyUnlocked = localStorage.getItem(`kinkCompass_global_achievement_${id}`) === 'true'; }
            catch (e) { console.error("Error reading global achievement status:", e); }
            const unlockedByAnyPersona = this.people.some(p => p.achievements?.includes(id));
            const isUnlocked = globallyUnlocked || unlockedByAnyPersona;

            // Escape achievement details before displaying
            achievementsHTML += `
                <li class="${isUnlocked ? 'unlocked' : 'locked'}" title="${isUnlocked ? 'Unlocked!' : 'Locked'} - ${escapeHTML(details.desc)}">
                    <span class="achievement-icon" aria-hidden="true">${isUnlocked ? '🏆' : '🔒'}</span>
                    <div class="achievement-details">
                         <span class="achievement-name">${escapeHTML(details.name)}</span>
                         <span class="achievement-desc">${escapeHTML(details.desc)}</span>
                    </div>
                </li>
            `;
        });
        if (sortedKeys.length === 0) {
             achievementsHTML += '<li class="muted-text no-border">No achievements defined.</li>';
        }
    } else { // Rendering for a specific persona
         if (!person || !Array.isArray(person.achievements) || person.achievements.length === 0) {
            return '<p class="muted-text">No achievements unlocked yet for this persona.</p>';
         }
         // Sort the persona's unlocked achievements alphabetically
         const sortedAchievements = [...person.achievements].sort((aId, bId) =>
             (achievementList[aId]?.name || '').localeCompare(achievementList[bId]?.name || '')
         );

         for (const achievementId of sortedAchievements) {
              if (count >= maxToShow) break; // Stop if limit reached
              const details = achievementList[achievementId];
              if (details) {
                   // Only show unlocked achievements for persona view
                   achievementsHTML += `
                       <li class="unlocked" title="${escapeHTML(details.desc)}">
                           <span class="achievement-icon" aria-hidden="true">🏆</span>
                           <span class="achievement-name">${escapeHTML(details.name)}</span>
                       </li>
                   `;
                   count++;
              }
         }

         if (count === 0) { // Should not happen if array wasn't empty, but safety check
              achievementsHTML += '<li class="muted-text no-border">No achievements yet!</li>';
         } else if (limit && person.achievements.length > maxToShow) {
              // Add a button to view all if list is truncated
              achievementsHTML += `<li class="no-border view-all-link"><button type="button" class="link-button view-all-achievements-btn">View All (${person.achievements.length})...</button></li>`;
         }
    }
    achievementsHTML += '</ul>';
    return achievementsHTML;
}


  renderGoalList(person, returnListOnly = false) {
      // Renders the list of goals and optionally the "Add Goal" form
      const goals = person.goals || [];
      const listHTML = goals.length > 0 ? `
        <ul class="goal-list">
            ${goals.map(goal => `
                <li data-goal-id="${goal.id}" class="${goal.done ? 'done' : ''}">
                     {/* Escape goal text */}
                    <span class="goal-text">${escapeHTML(goal.text)}</span>
                    <div class="goal-actions">
                         {/* Buttons handled by delegation */}
                        <button type="button" class="small-btn goal-toggle-btn" data-goal-id="${goal.id}" aria-label="${goal.done ? 'Mark as not done' : 'Mark as done'}">
                            ${goal.done ? '↩️&nbsp;Undo' : '✔️&nbsp;Done'}
                        </button>
                        <button type="button" class="small-btn delete-btn goal-delete-btn" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button>
                    </div>
                </li>
            `).join('')}
        </ul>
      ` : '<p class="muted-text">No goals added yet.</p>';

       if (returnListOnly) return listHTML; // Only return the list if requested

      // Add the form to add new goals
      const formHTML = `
        <form id="add-goal-form" class="add-goal-form" action="#">
            <label for="new-goal-text-${person.id}" class="sr-only">New Goal:</label>
            <input type="text" id="new-goal-text-${person.id}" placeholder="Enter a new goal..." required>
            <button type="submit" class="small-btn save-btn">Add Goal</button>
        </form>
      `;
      return listHTML + formHTML; // Return list + form
  }


  // --- Feature Logic --- (Goal, Journal, History, etc.)

  addGoal(personId, formElement) {
      const input = formElement.querySelector('input[type="text"]');
      const goalText = input?.value.trim();
      if (!input || !goalText) {
          this.showNotification("Please enter text for the goal.", "warning");
          input?.focus(); // Focus the input if empty
          return;
      }
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[ADD_GOAL] Persona ${personId} not found.`);
          return this.showNotification("Error: Persona not found.", "error");
      }
      if (!Array.isArray(person.goals)) person.goals = []; // Ensure goals array exists

      // Create new goal object
      const newGoal = {
          id: generateSimpleId(),
          text: goalText,
          done: false,
          addedAt: new Date().toISOString(),
          completedAt: null
      };
      person.goals.push(newGoal);

      // Grant achievement (passing save function)
      grantAchievement(person, 'goal_added', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));

      // Re-render the goal list dynamically
      const goalsSection = formElement.closest('.goals-section');
      const listContainer = goalsSection?.querySelector('.goal-list');
      const noGoalsMessage = goalsSection?.querySelector('p.muted-text'); // Find the 'no goals' message if it exists

      if (goalsSection) { // Ensure the parent section exists
           if (listContainer) { // If list exists, append new item
                const tempLi = document.createElement('li');
                // Use map logic from renderGoalList to create the item HTML
                tempLi.dataset.goalId = newGoal.id;
                tempLi.innerHTML = `
                    <span class="goal-text">${escapeHTML(newGoal.text)}</span>
                    <div class="goal-actions">
                        <button type="button" class="small-btn goal-toggle-btn" data-goal-id="${newGoal.id}" aria-label="Mark as done">✔️&nbsp;Done</button>
                        <button type="button" class="small-btn delete-btn goal-delete-btn" data-goal-id="${newGoal.id}" aria-label="Delete goal">🗑️</button>
                    </div>`;
                listContainer.appendChild(tempLi);
                if (noGoalsMessage) noGoalsMessage.remove(); // Remove 'no goals' message if it was there
           } else { // If no list existed, create it and add item
                const newListHTML = this.renderGoalList(person, true); // Get HTML for the whole list
                if (noGoalsMessage) noGoalsMessage.remove(); // Remove 'no goals' message
                // Insert the new list before the form
                formElement.insertAdjacentHTML('beforebegin', newListHTML);
           }
      } else {
          // Fallback: Re-render the whole tab if specific container not found
          console.warn("[ADD_GOAL] Goal section not found, re-rendering tab.");
          const tabContent = formElement.closest('.tab-content');
          if(tabContent) this.renderDetailTabContent(person, 'tab-goals-journal', tabContent);
      }

      input.value = ''; // Clear input field
      this.showNotification("Goal added!", "success", 2000);
      input.focus(); // Focus input for next goal
  }

  toggleGoalStatus(personId, goalId, listItemElement = null) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return; // Exit if person or goals array missing

      const goal = person.goals.find(g => g.id === goalId);
      if (!goal) {
          console.error(`[TOGGLE_GOAL] Goal ${goalId} not found for person ${personId}.`);
          return this.showNotification("Error: Goal not found.", "error");
      }

      // Toggle status and timestamp
      goal.done = !goal.done;
      goal.completedAt = goal.done ? new Date().toISOString() : null;

      // Update UI dynamically if list item is provided
      if (listItemElement) {
          listItemElement.classList.toggle('done', goal.done);
          const toggleButton = listItemElement.querySelector('.goal-toggle-btn');
          if (toggleButton) {
                // Escape text content just in case
                toggleButton.innerHTML = goal.done ? '↩️&nbsp;Undo' : '✔️&nbsp;Done'; // Added non-breaking space
                toggleButton.setAttribute('aria-label', goal.done ? 'Mark as not done' : 'Mark as done');
            }
          // Add animation and grant achievements only when marking as done
          if (goal.done) {
              listItemElement.classList.add('goal-completed-animation');
              setTimeout(() => listItemElement?.classList.remove('goal-completed-animation'), 600); // Match animation duration
              // Grant achievements (pass save function)
              grantAchievement(person, 'goal_completed', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
              this.checkGoalStreak(person); // Check streak after completion
              const completedCount = person.goals.filter(g => g.done).length;
              if (completedCount >= 5) {
                    grantAchievement(person, 'five_goals_completed', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                }
          }
      } else {
          // Fallback: If element not passed, re-render the list (less efficient)
          console.warn("[TOGGLE_GOAL] List item element not provided, re-rendering list.");
          const listContainer = document.querySelector(`#detail-modal[data-person-id="${personId}"] .goals-section .goal-list`);
          const listParent = listContainer?.parentElement;
          if (listParent) {
               listParent.innerHTML = this.renderGoalList(person, false); // Re-render list and form
          }
      }

      this.saveToLocalStorage(); // Save changes
  }

  deleteGoal(personId, goalId) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return; // Exit if person or goals array missing

      const goalIndex = person.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) {
          console.error(`[DELETE_GOAL] Goal ${goalId} not found for person ${personId}.`);
          return this.showNotification("Error: Goal not found.", "error");
      }

      // Remove goal from array
      person.goals.splice(goalIndex, 1);
      this.saveToLocalStorage(); // Save changes

      // Update UI dynamically
      const listItem = document.querySelector(`#detail-modal[data-person-id="${personId}"] li[data-goal-id="${goalId}"]`);
      const goalsSection = listItem?.closest('.goals-section');
      const listContainer = goalsSection?.querySelector('.goal-list');

      if (listItem) {
            listItem.remove(); // Remove the specific list item
            // Check if list is now empty and show message if needed
            if (listContainer && listContainer.children.length === 0) {
                const noGoalsMessage = document.createElement('p');
                noGoalsMessage.className = 'muted-text';
                noGoalsMessage.textContent = 'No goals added yet.';
                listContainer.replaceWith(noGoalsMessage); // Replace empty list with message
            }
            this.showNotification("Goal deleted.", "info", 2000);
      } else {
          // Fallback: Re-render the whole list if specific item not found
          console.warn("[DELETE_GOAL] List item element not found, re-rendering list.");
          if (goalsSection) {
             // Replace list content, keeping the form
             goalsSection.innerHTML = `
                 <h3 id="goals-heading">🎯 Goals & Aspirations</h3>
                 ${this.renderGoalList(person, false)}
             `;
          }
      }
  }

  showJournalPrompt(personId) {
       // Display a random journal prompt
       const promptArea = document.getElementById('journal-prompt-area');
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!promptArea || !textarea) {
            console.error("[JOURNAL_PROMPT] UI elements for prompt/textarea not found.");
            return;
        }
       const prompt = getRandomPrompt();
       promptArea.innerHTML = `💡 Prompt: ${escapeHTML(prompt)}`; // Escape prompt
       promptArea.style.display = 'block'; // Show the prompt area
       // Pre-fill textarea if empty, adding prompt text
       if (textarea.value.trim() === '') {
            textarea.value = `Prompt: ${escapeHTML(prompt)}\n\n`;
        } else {
            // Optionally add prompt if textarea already has content
            // textarea.value = `Prompt: ${escapeHTML(prompt)}\n\n---\n\n${textarea.value}`;
        }
       textarea.focus(); // Focus the textarea for writing
       textarea.scrollTop = 0; // Scroll to top
       grantAchievement({}, 'prompt_used', this.showNotification.bind(this)); // Grant global achievement
   }

  saveReflections(personId) {
       // Save the content of the journal textarea
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!textarea) {
           console.error(`[SAVE_REFLECTIONS] Textarea not found for person ${personId}.`);
           return this.showNotification("Error: Could not find journal text area.", "error");
        }
       const person = this.people.find(p => p.id === personId);
       if (!person) {
            console.error(`[SAVE_REFLECTIONS] Persona ${personId} not found.`);
           return this.showNotification("Error: Persona not found.", "error");
        }

       person.reflections = textarea.value; // Save the raw value (escaping happens on render)
       // Add visual feedback
       textarea.classList.add('input-just-saved');
       setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);

       // Grant achievements (pass save function)
       grantAchievement(person, 'reflection_saved', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       // Count non-empty reflections (simplified count)
       const reflectionCount = (person.reflections && person.reflections.trim() !== "") ? 1 : 0;
       // In a real scenario, you'd likely store reflections as an array of entries to count properly
       if (reflectionCount >= 5) grantAchievement(person, 'five_reflections', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       if (reflectionCount >= 10) grantAchievement(person, 'journal_journeyman', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));

       this.saveToLocalStorage(); // Persist changes
       this.showNotification("Reflections saved!", "success", 2000);
   }

   addSnapshotToHistory(personId) {
        const person = this.people.find(p => p.id === personId);
        if (!person) {
            console.error(`[SNAPSHOT] Persona ${personId} not found.`);
            return this.showNotification("Error: Persona not found.", "error");
        }
        const currentTimestamp = new Date().toISOString();
        // Create a deep copy of traits for the snapshot
        const newSnapshot = {
            timestamp: currentTimestamp,
            role: person.role,
            style: person.style,
            traits: JSON.parse(JSON.stringify(person.traits || {})) // Deep copy essential
        };

        if (!Array.isArray(person.history)) person.history = []; // Initialize history array

        // Grant achievements *before* adding the new snapshot to history
        // This allows comparing the new state to the *previous* state (if history exists)
        grantAchievement(person, 'history_snapshot', this.showNotification.bind(this));
        this.checkConsistentSnapper(person, currentTimestamp); // Checks against last item in history
        this.checkTraitTransformation(person, newSnapshot); // Compares newSnapshot to last item in history

        // Grant achievement for reaching 10 snapshots *after* this one is added
        if(person.history.length === 9) { // Check if this snapshot makes it 10
             grantAchievement(person, 'ten_snapshots', this.showNotification.bind(this));
        }

        // Add the new snapshot and save
        person.history.push(newSnapshot);
        this.saveToLocalStorage();

        // Re-render the history tab content if it's currently active
        const historyTabContent = document.getElementById('tab-history');
        if (historyTabContent?.classList.contains('active')) {
            this.renderDetailTabContent(person, 'tab-history', historyTabContent);
        } else if (historyTabContent) {
            // Optionally mark for re-render if tab becomes active later
             historyTabContent.innerHTML = `<p class="loading-text" role="status">Loading History...</p>`; // Mark as needing refresh
        }
        this.showNotification("Persona snapshot saved to history!", "success");
    }

    renderHistoryChart(person, canvasId) {
        const canvas = document.getElementById(canvasId);
        const container = canvas?.parentElement;
        if (!canvas || !container) {
            console.error(`[HISTORY_CHART] Canvas or container not found for ID: ${canvasId}`);
            return;
        }

        // Clear previous chart instance if it exists for this canvas
        if (this.chartInstance && this.chartInstance.canvas === canvas) {
            this.chartInstance.destroy();
            this.chartInstance = null;
             console.log("[HISTORY_CHART] Destroyed previous chart instance.");
        }

        if (!person.history || person.history.length < 2) {
            // Update container message instead of innerHTML directly to preserve canvas
            container.classList.add('chart-loading'); // Ensure class is present
            let msgElement = container.querySelector('.muted-text');
            if (!msgElement) {
                 msgElement = document.createElement('p');
                 msgElement.className = 'muted-text';
                 msgElement.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;'; // Center message
                 container.appendChild(msgElement); // Append message if not present
            }
            msgElement.textContent = 'Need at least two snapshots to show trait history.';
            canvas.style.display = 'none'; // Hide canvas
            console.log("[HISTORY_CHART] Not enough data for chart.");
            return;
        }

        // Prepare data for Chart.js
        const history = person.history;
        const labels = history.map(snap => new Date(snap.timestamp).toLocaleDateString());
        // Find all unique traits across all snapshots
        const allTraits = [...new Set(history.flatMap(snap => Object.keys(snap.traits || {})))].sort();
        const datasets = [];
        // Define a more diverse color palette
        const colors = ['#ff69b4', '#a0d8ef', '#f7dc6f', '#81c784', '#ffb74d', '#dcc1ff', '#ef5350', '#64b5f6', '#66bb6a', '#ff8a65', '#9575cd', '#4db6ac'];
        let colorIndex = 0;

        allTraits.forEach(traitName => {
            // Get data points, using null for missing values in older snapshots
            const dataPoints = history.map(snap => snap.traits?.[traitName] ?? null);
             // Only include trait if it has at least one data point
             if (dataPoints.some(p => p !== null)) {
                 datasets.push({
                     label: traitName.charAt(0).toUpperCase() + traitName.slice(1), // Capitalize label
                     data: dataPoints,
                     borderColor: colors[colorIndex % colors.length],
                     backgroundColor: colors[colorIndex % colors.length] + '33', // Add some transparency
                     tension: 0.1, // Slight curve
                     fill: false,
                     pointRadius: 4,
                     pointHoverRadius: 6,
                     spanGaps: true, // Connect lines across null points
                 });
                 colorIndex++;
             }
        });

        if (datasets.length === 0) {
            container.classList.add('chart-loading');
            container.innerHTML = '<p class="muted-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">No valid trait data found in snapshots.</p>';
            canvas.style.display = 'none';
            console.log("[HISTORY_CHART] No datasets to display.");
            return;
        }

        // Get current theme colors for chart styling
        const computedStyle = getComputedStyle(document.documentElement);
        const gridColor = computedStyle.getPropertyValue('--chart-grid-color').trim();
        const labelColor = computedStyle.getPropertyValue('--chart-label-color').trim();
        const tooltipBg = computedStyle.getPropertyValue('--chart-tooltip-bg').trim();
        const tooltipText = computedStyle.getPropertyValue('--chart-tooltip-text').trim();

        // Chart Configuration
        const config = {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5.5, // Ensure scale goes up to 5 clearly
                        ticks: { stepSize: 1, color: labelColor },
                        title: { display: true, text: 'Score', color: labelColor },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { color: labelColor },
                        title: { display: true, text: 'Date', color: labelColor },
                        grid: { display: false } // Hide vertical grid lines
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: labelColor }
                    },
                    tooltip: {
                        backgroundColor: tooltipBg,
                        titleColor: tooltipText,
                        bodyColor: tooltipText,
                        boxPadding: 4,
                        intersect: false, // Show tooltip on hover near point
                        mode: 'index', // Show tooltips for all datasets at that index
                    }
                },
                interaction: { // Improve hover interaction
                     mode: 'index',
                     intersect: false,
                 },
            }
        };

        // Create the chart
        try {
            container.classList.remove('chart-loading'); // Remove loading state
            const existingMessage = container.querySelector('.muted-text');
            if(existingMessage) existingMessage.remove(); // Remove message if chart is rendering
            canvas.style.display = 'block'; // Ensure canvas is visible
            this.chartInstance = new Chart(canvas, config);
            console.log("[HISTORY_CHART] Chart rendered successfully.");
        } catch (error) {
            console.error("[HISTORY_CHART] Error creating chart:", error);
            container.innerHTML = `<p class="error-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">Failed to render history chart.</p>`;
             container.classList.add('chart-loading'); // Indicate error state
        }
    }


  toggleSnapshotInfo(button) {
    // Toggles the visibility of trait details for a specific snapshot
    console.log("[TOGGLE_SNAPSHOT_INFO] Toggle button clicked.");
    const detailsDivId = button.getAttribute('aria-controls');
    const detailsDiv = document.getElementById(detailsDivId);

    if (detailsDiv) {
        const isVisible = detailsDiv.style.display !== 'none';
        detailsDiv.style.display = isVisible ? 'none' : 'block'; // Toggle display
        button.textContent = isVisible ? 'View Traits' : 'Hide Traits'; // Update button text
        button.setAttribute('aria-expanded', String(!isVisible)); // Update ARIA state
    } else {
        console.warn(`[TOGGLE_SNAPSHOT_INFO] Could not find details div with ID: ${detailsDivId}`);
    }
}

  // --- Auxiliary Feature Modals ---

  showAchievements() {
    console.log("[SHOW_ACHIEVEMENTS] Opening achievements modal.");
    const modal = this.elements.achievementsModal;
    const body = this.elements.achievementsBody;
    if (!modal || !body) {
        console.error("[ACHIEVEMENTS] UI Error: Achievements modal elements missing.");
        return this.showNotification("UI Error: Cannot display achievements.", "error");
    }

    // Render the global list of all achievements
    body.innerHTML = `
        <p style="text-align: center; margin-bottom: 1.5em;">Track your milestones and discoveries!</p>
        ${this.renderAchievementsList(null)} {/* Pass null for global view */}
    `;
    this.openModal(modal);
}

  showKinkOracle(personId) {
    console.log(`[SHOW_KINK_ORACLE] Consulting Oracle for Person ID: ${personId}`);
    const outputElement = this.elements.modalBody?.querySelector('#oracle-reading-output');
    const button = this.elements.modalBody?.querySelector('#oracle-btn');

    if (!outputElement) {
        console.error("[ORACLE] UI Error: Oracle output element not found in modal body.");
        return this.showNotification("UI Error: Cannot display Oracle reading.", "error");
    }
    if (!personId) {
         outputElement.innerHTML = `<p class="error-text">Error: No persona context for Oracle.</p>`;
         return;
    }

    const person = this.people.find(p => p.id === personId);
    if (!person) {
        console.error(`[ORACLE] Persona ${personId} not found.`);
        outputElement.innerHTML = `<p class="error-text">Persona data not found.</p>`;
        return;
    }

    // Show loading state
    outputElement.innerHTML = `<p><i>Consulting the ethereal energies... <span class="spinner" style="border-top-color: var(--accent-color);"></span></i></p>`; // Styled spinner
    if (button) button.disabled = true; // Disable button during loading

    // Simulate Oracle consultation delay
    setTimeout(() => {
        try {
            const readingData = this.getKinkOracleReading(person);
            if (!readingData) throw new Error("Oracle returned no reading data.");

            // Escape all parts of the reading before inserting
            // Note: readingData.focus might contain <strong> or <em> tags, which are safe here
            outputElement.innerHTML = `
                <p>${escapeHTML(readingData.opening)}</p>
                <p><strong>Focus:</strong> ${readingData.focus}</p> {/* Trust pre-escaped content */}
                <p><em>${escapeHTML(readingData.encouragement)}</em></p>
                <p>${escapeHTML(readingData.closing)}</p>
            `;
            // Grant achievement (pass save function)
            grantAchievement(person, 'kink_reading_oracle', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        } catch (error) {
            console.error("[SHOW_KINK_ORACLE] Error getting or displaying Oracle reading:", error);
            outputElement.innerHTML = `<p class="muted-text">The Oracle is quiet today. Perhaps try again later?</p>`;
        } finally {
             if (button) button.disabled = false; // Re-enable button
        }
    }, 600); // Delay for effect
}

  displayDailyChallenge(personaForContext = null, targetElement = null) {
    // Determine target area: either live preview or insights tab, whichever is active/passed
    let challengeArea = targetElement; // Use passed element if provided
    if (!challengeArea) { // Otherwise, try to find the active one
        if (this.elements.livePreview && this.elements.livePreview.offsetParent !== null) { // Check if preview is visible
            challengeArea = this.elements.livePreview.querySelector('#daily-challenge-area');
        }
        // Check if detail modal is open and insights tab is active
        if (!challengeArea && this.elements.modal?.getAttribute('aria-hidden') === 'false' && this.activeDetailModalTab === 'tab-insights') {
             challengeArea = this.elements.modalBody?.querySelector('#daily-challenge-area');
        }
    }

    if (!challengeArea) {
        // console.log("[DAILY_CHALLENGE] Target area not found or not visible.");
        return; // Silently fail if area isn't present/visible
    }

    try {
        // Get challenge, potentially tailored to the persona context
        const challenge = this.getDailyChallenge(personaForContext || this.previewPerson); // Use preview if no specific persona passed

        if (challenge) {
            // Escape challenge text before inserting
            challengeArea.innerHTML = `
                <h4 id="daily-challenge-title" style="margin-bottom:0.5em;">🌟 Today's Focus 🌟</h4>
                <h5>${escapeHTML(challenge.title)}</h5>
                <p>${escapeHTML(challenge.desc)}</p>
                <p class="muted-text"><small>(Category: ${escapeHTML(challenge.category)})</small></p>`;
            challengeArea.style.display = 'block';
            // Grant achievement (global, no save needed) - grant only if interaction planned
            // grantAchievement({}, 'challenge_accepted', this.showNotification.bind(this));
        } else {
            challengeArea.innerHTML = '<p class="muted-text">No specific focus challenge today. Explore freely!</p>';
            challengeArea.style.display = 'block';
        }
    } catch (error) {
        console.error("[DAILY_CHALLENGE] Error getting or displaying challenge:", error);
        challengeArea.innerHTML = `<p class="error-text">Error loading today's focus.</p>`;
        challengeArea.style.display = 'block';
    }
}


  showGlossary(termKeyToHighlight = null) {
    console.log(`[SHOW_GLOSSARY] Opening glossary. Highlight term: ${termKeyToHighlight || 'None'}`);
    const modal = this.elements.glossaryModal;
    const body = this.elements.glossaryBody;
    const searchInput = this.elements.glossarySearchInput;
    if (!modal || !body) {
        console.error("[GLOSSARY] UI Error: Glossary modal elements missing.");
        return this.showNotification("UI Error: Cannot display glossary.", "error");
    }

    if (searchInput) searchInput.value = ''; // Clear search on open
    body.innerHTML = ''; // Clear previous content

    // Sort terms alphabetically by the display term
    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) =>
        (glossaryTerms[a]?.term || '').localeCompare(glossaryTerms[b]?.term || '')
    );

    if (sortedKeys.length === 0) {
        body.innerHTML = '<p class="muted-text">Glossary is currently empty.</p>';
    } else {
        const dl = document.createElement('dl');
        dl.id = 'glossary-term-list'; // ID for filtering
        sortedKeys.forEach(key => {
            const termData = glossaryTerms[key];
            // Skip invalid entries
            if (!termData?.term || !termData.definition) return;

             // Create a wrapper div for each term+definition for easier filtering/styling
             const itemWrapper = document.createElement('div');
             itemWrapper.classList.add('glossary-item');
             // Store lower-case data for case-insensitive search
             itemWrapper.dataset.term = termData.term.toLowerCase();
             itemWrapper.dataset.definition = termData.definition.toLowerCase();


            const dt = document.createElement('dt');
             // FIX: Create a safe ID for linking, handling potential special chars in keys
            const safeId = `glossary-${key.replace(/[^a-zA-Z0-9_-]/g, '')}`;
            dt.id = safeId;
            dt.textContent = escapeHTML(termData.term); // Escape term name

            const dd = document.createElement('dd');
            // Escape the definition, *then* link terms within it
            dd.innerHTML = this.linkGlossaryTerms(escapeHTML(termData.definition));

            // Add related terms links if available
            if (termData.related && Array.isArray(termData.related) && termData.related.length > 0) {
                const relatedP = document.createElement('p');
                relatedP.className = 'related-terms';
                relatedP.appendChild(document.createTextNode('Related: ')); // Add label text

                termData.related.forEach((relatedKey, index) => {
                     const relatedTermData = glossaryTerms[relatedKey];
                     if (relatedTermData) {
                         const relatedSafeId = `glossary-${relatedKey.replace(/[^a-zA-Z0-9_-]/g, '')}`;
                         const link = document.createElement('a');
                         link.href = `#${relatedSafeId}`; // Link to the related term's ID
                         link.textContent = escapeHTML(relatedTermData.term); // Escape related term name
                         link.classList.add('glossary-link');
                         link.dataset.termKey = relatedKey; // Add key for JS handling
                         relatedP.appendChild(link);
                         // Add comma separator
                         if (index < termData.related.length - 1) {
                             relatedP.appendChild(document.createTextNode(', '));
                         }
                     }
                });
                dd.appendChild(relatedP); // Append related terms paragraph to definition
            }
             itemWrapper.appendChild(dt);
             itemWrapper.appendChild(dd);
             dl.appendChild(itemWrapper); // Add item to the definition list
        });
        body.appendChild(dl); // Add the full list to the modal body
    }

    this.openModal(modal); // Open the modal

    // Highlight term if requested, after modal is open and content is rendered
    if (termKeyToHighlight) {
         this.highlightGlossaryTerm(termKeyToHighlight);
    }
}

highlightGlossaryTerm(termKeyToHighlight) {
     console.log(`[HIGHLIGHT_TERM] Attempting to highlight and scroll to: ${termKeyToHighlight}`);
     if (!this.elements.glossaryBody) return;

     requestAnimationFrame(() => { // Ensure DOM is ready
         // Remove highlight from any previously highlighted term
         const previouslyHighlighted = this.elements.glossaryBody.querySelector('.highlighted-term');
         previouslyHighlighted?.classList.remove('highlighted-term');

         // Find the new term element by ID
         const safeId = `glossary-${termKeyToHighlight.replace(/[^a-zA-Z0-9_-]/g, '')}`; // Use the same safe ID generation
         const element = document.getElementById(safeId);

         if (element) {
             element.classList.add('highlighted-term');
             // Scroll into view with centering
             element.scrollIntoView({ behavior: 'smooth', block: 'center' });
             // Remove highlight after animation (match CSS duration)
             setTimeout(() => element?.classList.remove('highlighted-term'), 2500);
         } else {
             console.warn(`[HIGHLIGHT_TERM] Element ID not found for highlighting: ${safeId}`);
             // Optionally, try searching by data-term-key if ID fails?
             // const elementByData = this.elements.glossaryBody.querySelector(`a[data-term-key="${termKeyToHighlight}"]`);
             // if(elementByData) { /* highlight parent dt? */ }
         }
     });
}

linkGlossaryTerms(escapedText) {
    // Input text MUST be already HTML-escaped to prevent XSS
    if (typeof escapedText !== 'string' || !escapedText) return escapedText;

    // Sort keys by term length descending to match longer terms first (e.g., "Sub Drop" before "Sub")
    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) =>
        (glossaryTerms[b]?.term?.length || 0) - (glossaryTerms[a]?.term?.length || 0)
    );

    let linkedText = escapedText;

    sortedKeys.forEach(key => {
        const termData = glossaryTerms[key];
        if (termData?.term) {
             // Escape the term itself for use in regex (handles special chars like parentheses)
             const escapedTermForRegex = termData.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             // Create regex to match the term as a whole word, case-insensitive
             // Ensure it doesn't match inside existing HTML tags or links
             const regex = new RegExp(`\\b(${escapedTermForRegex})\\b(?![^<]*?>|[^<>]*<\\/a>)`, 'gi');

             // Replace matches with links
             linkedText = linkedText.replace(regex, (match) => {
                 // The matched text is already escaped (since input was escaped), so use it directly
                 const safeKey = escapeHTML(key); // Escape key just in case for data attribute
                  // FIX: Create safe ID for href
                  const safeId = `glossary-${key.replace(/[^a-zA-Z0-9_-]/g, '')}`;
                 return `<a href="#${safeId}" class="glossary-link" data-term-key="${safeKey}">${match}</a>`;
                }
             );
        }
    });
    return linkedText;
}


filterGlossary(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const list = document.getElementById('glossary-term-list');
    if (!list) return;

    const items = list.querySelectorAll('.glossary-item'); // Select the wrappers
    let itemsFound = 0;
    let noResultsMsg = list.querySelector('.no-results-message'); // Find existing message first

    items.forEach(item => {
        // Check search term against stored lower-case data attributes
        const term = item.dataset.term || '';
        const definition = item.dataset.definition || '';
        const isMatch = term.includes(lowerSearchTerm) || definition.includes(lowerSearchTerm);
        item.style.display = isMatch ? '' : 'none'; // Show/hide the whole item
        if (isMatch) itemsFound++;
    });

     // Handle "no results" message display
     if (itemsFound === 0 && lowerSearchTerm !== '') {
         if (!noResultsMsg) { // Create message if it doesn't exist
             noResultsMsg = document.createElement('p');
             noResultsMsg.className = 'muted-text no-results-message'; // Added class for specific styling if needed
             noResultsMsg.textContent = 'No terms found matching your search.';
             // Append after the last item or at the end of the list
             list.appendChild(noResultsMsg);
         }
         noResultsMsg.style.display = ''; // Show message
     } else if (noResultsMsg) {
         noResultsMsg.style.display = 'none'; // Hide message if results found or search cleared
     }
}

clearGlossarySearch() {
     if (this.elements.glossarySearchInput) {
         this.elements.glossarySearchInput.value = '';
         this.filterGlossary(''); // Trigger filter with empty term
         this.elements.glossarySearchInput.focus(); // Return focus
     }
 }

  showStyleDiscovery(styleNameToHighlight = null) {
    console.log(`[STYLE_DISCOVERY] Opening style discovery. Highlight: ${styleNameToHighlight || 'None'}`);
    const modal = this.elements.styleDiscoveryModal;
    const body = this.elements.styleDiscoveryBody;
    const roleFilter = this.elements.styleDiscoveryRoleFilter;
    const searchInput = this.elements.styleDiscoverySearchInput;

    if (!modal || !body || !roleFilter) {
        console.error("[STYLE_DISCOVERY] UI Error: Style discovery modal elements missing.");
        return this.showNotification("UI Error: Cannot display style discovery.", "error");
    }

    // Reset filters on open
    roleFilter.value = 'all';
    if(searchInput) searchInput.value = '';

    // Render initial content (all styles) and highlight if needed
    this.renderStyleDiscoveryContent(styleNameToHighlight);
    this.openModal(modal);
}

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
    // Normalize highlight name if provided (using original utils function)
    const highlightKey = typeof styleNameToHighlight === 'string' ? normalizeStyleKey(styleNameToHighlight) : null;
    const body = this.elements.styleDiscoveryBody;
    const selectedRole = this.elements.styleDiscoveryRoleFilter?.value || 'all';
    const searchTerm = this.elements.styleDiscoverySearchInput?.value.toLowerCase().trim() || '';
    if (!body) return; // Exit if body element not found

    body.innerHTML = '<p class="loading-text" role="status">Loading styles...</p>'; // Show loading state

    let stylesToDisplay = [];
    // Determine which roles to include based on filter
    const rolesToInclude = selectedRole === 'all' ? Object.keys(bdsmData) : [selectedRole];

    // Gather styles from bdsmData
    rolesToInclude.forEach(roleKey => {
        if (bdsmData[roleKey]?.styles) {
            // Add role key to each style object for context
            stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({ ...style, role: roleKey })));
        }
    });

    // Apply search filter
    if (searchTerm) {
        stylesToDisplay = stylesToDisplay.filter(style =>
            (style.name || '').toLowerCase().includes(searchTerm) ||
            (style.summary || '').toLowerCase().includes(searchTerm) ||
            (style.role || '').toLowerCase().includes(searchTerm) // Search role name too
        );
    }

    // Sort styles alphabetically by name
    stylesToDisplay.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    if (stylesToDisplay.length === 0) {
        body.innerHTML = '<p class="muted-text">No styles found matching the current filters.</p>';
        return;
    }

    // Generate HTML for each style item
    let contentHTML = stylesToDisplay.map(style => {
        // Create a safe ID based on role and normalized name
        const currentNormalizedKey = normalizeStyleKey(style.name); // Normalize current style name
        const styleIdSafe = `style-discovery-${escapeHTML(style.role)}-${currentNormalizedKey.replace(/[^a-zA-Z0-9]/g, '-')}`;
        const summary = style.summary || "No summary available.";
        const icon = sfStyleIcons[style.name] || ''; // Get icon safely using original name
        const escapedName = escapeHTML(style.name);
        const escapedRole = escapeHTML(style.role);
        const escapedSummary = escapeHTML(summary);
        const shouldHighlight = highlightKey === currentNormalizedKey; // Compare normalized keys

        return `
            <div class="style-discovery-item ${shouldHighlight ? 'highlighted-style' : ''}" id="${styleIdSafe}" data-normalized-key="${currentNormalizedKey}">
                <h4>${icon ? escapeHTML(icon) + ' ' : ''}${escapedName} <small>(${escapedRole})</small></h4>
                <p>${escapedSummary}</p>
                 ${this.renderStyleTraitList(style)} {/* Render trait list with links */}
            </div>`;
    }).join('');

    body.innerHTML = contentHTML;

    // Scroll to highlighted item if requested
    if (highlightKey) {
        requestAnimationFrame(() => {
            // Find element using the data attribute which uses normalized key
            const elementToHighlight = body.querySelector(`.style-discovery-item[data-normalized-key="${highlightKey}"]`);
            if (elementToHighlight) {
                // Highlight class already added during render if match found
                elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Remove highlight after animation
                setTimeout(() => elementToHighlight?.classList.remove('highlighted-style'), 2500);
            } else {
                console.warn(`[RENDER_STYLE_DISCOVERY] Style element to highlight not found for key: ${highlightKey}`);
            }
        });
    }
}

renderStyleTraitList(style) {
    // Renders the list of traits for a style, linking them to the glossary
    if (!style?.role || !bdsmData[style.role]) return '';

    // Get core traits for the style's role
    const coreTraitNames = bdsmData[style.role].coreTraits?.map(t => t.name) || [];
    // Get style-specific traits
    const styleTraitNames = style.traits?.map(t => t.name) || [];
    // Combine, remove duplicates, and sort
    const allTraitNames = [...new Set([...coreTraitNames, ...styleTraitNames])].sort();

    if (allTraitNames.length === 0) return ''; // No traits to list

    // Generate links for each trait
    const traitLinks = allTraitNames.map(t => {
        const escapedTrait = escapeHTML(t);
        // Get the display term from glossary, fallback to the trait name
        const displayTerm = escapeHTML(glossaryTerms[t]?.term || t.charAt(0).toUpperCase() + t.slice(1));
        // FIX: Create safe ID for href
        const safeId = `glossary-${t.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        return `<a href="#${safeId}" class="glossary-link" data-term-key="${escapedTrait}" title="View '${displayTerm}' in Glossary">${escapedTrait}</a>`;
    }).join(', '); // Join with commas

    return `<p class="traits-list"><small>Key Traits: ${traitLinks}</small></p>`;
}

filterStyleDiscovery(searchTerm) {
    // Called by debounced handler, simply re-renders the content with the current filter/search state
    this.renderStyleDiscoveryContent();
}


  // --- Data Import/Export ---

  exportData() {
    console.log("[EXPORT_DATA] Starting data export.");
    if (this.people.length === 0) {
         this.showNotification("No persona data to export.", "info");
         return;
    }
    try {
        // Create export object with version and timestamp
        const exportObject = {
            version: "KinkCompass_v2.8.8", // Match current version
            exportedAt: new Date().toISOString(),
            people: this.people // Include the current persona data
        };
        // Convert to formatted JSON string
        const dataStr = JSON.stringify(exportObject, null, 2); // Pretty print JSON
        // Create a Blob for download
        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        link.download = `kinkcompass_backup_${timestamp}.json`; // Filename with timestamp
        document.body.appendChild(link); // Append link to body
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Remove the link
        URL.revokeObjectURL(url); // Release the object URL

        this.showNotification("Persona data exported successfully!", "success");
        // Grant global achievement (no save needed)
        grantAchievement({}, 'data_exported', this.showNotification.bind(this));
    } catch (error) {
        console.error("[EXPORT_DATA] Error during data export:", error);
        this.showNotification("Data export failed. See console.", "error");
    }
}

  importData(event) {
    console.log("[IMPORT_DATA] Import process started.");
    const fileInput = event.target;
    if (!fileInput?.files?.length) {
        console.log("[IMPORT_DATA] No file selected.");
        return; // Exit if no file selected
    }
    const file = fileInput.files[0];

    // Basic file validation
    if (!file.type.match('application/json')) {
        this.showNotification("Import failed: File must be a valid '.json' file.", "error", 5000);
        fileInput.value = null; // Clear the file input
        return;
    }
    // Basic size validation (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
         this.showNotification("Import failed: File size too large (max 10MB).", "error", 5000);
         fileInput.value = null;
         return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate imported data structure
            if (!importedData || typeof importedData !== 'object' || !Array.isArray(importedData.people)) {
                throw new Error("Invalid file format: Missing or invalid 'people' array.");
            }

            const numPersonas = importedData.people.length;
            // Confirm overwrite with user
            if (!confirm(`Import ${numPersonas} personas? This will REPLACE all current persona data.`)) {
                console.log("[IMPORT_DATA] User cancelled import.");
                fileInput.value = null; // Clear input if cancelled
                return;
            }

            // Replace current data with imported data
            this.people = importedData.people;

            // Sanitize imported data (ensure required fields and types)
             this.people.forEach((p, index) => {
                 p.id = p.id && typeof p.id === 'string' ? p.id : generateSimpleId() + `_import_${index}`;
                 p.name = p.name && typeof p.name === 'string' ? p.name : `Imported Persona ${p.id.substring(0, 4)}`;
                 p.role = p.role && bdsmData[p.role] ? p.role : 'submissive';
                 p.style = p.style && typeof p.style === 'string' ? p.style : '';
                 p.avatar = p.avatar && typeof p.avatar === 'string' ? p.avatar : '❓';
                 p.traits = (typeof p.traits === 'object' && p.traits !== null) ? p.traits : {};
                 p.achievements = Array.isArray(p.achievements) ? p.achievements : [];
                 p.goals = Array.isArray(p.goals) ? p.goals : [];
                 p.history = Array.isArray(p.history) ? p.history : [];
                 p.reflections = typeof p.reflections === 'string' ? p.reflections : "";
             });

            this.saveToLocalStorage(); // Save the newly imported data
            this.renderList(); // Update the displayed list
            this.resetForm(); // Clear the form
            this.showNotification(`Successfully imported ${numPersonas} personas!`, "success");
            // Grant global achievement (no save needed)
            grantAchievement({}, 'data_imported', this.showNotification.bind(this));

        } catch (error) {
            console.error("[IMPORT_DATA] Error processing imported file:", error);
            // Provide specific error message to user
            this.showNotification(`Import failed: ${escapeHTML(error.message)}. Check file format.`, "error", 6000);
        } finally {
            // Always clear the file input after attempt
            fileInput.value = null;
        }
    };

    reader.onerror = (readError) => {
        console.error("[IMPORT_DATA] Error reading file:", readError);
        this.showNotification("Error reading the selected file.", "error");
        fileInput.value = null; // Clear input on read error
    };

    reader.readAsText(file); // Start reading the file
}


  // --- Popups ---

  showTraitInfo(traitName, triggerButton = null) {
    console.log(`[SHOW_TRAIT_INFO] Showing info for trait: ${traitName}`);
    const popup = this.elements.traitInfoPopup;
    const titleEl = this.elements.traitInfoTitle;
    const bodyEl = this.elements.traitInfoBody;
    const closeButton = this.elements.traitInfoClose;
    if (!popup || !titleEl || !bodyEl || !closeButton) {
        console.error("[TRAIT_INFO] UI Error: Trait info popup elements missing.");
        return;
    }

    // Use the helper function to find the explanation robustly
    const explanation = findTraitExplanation(traitName); // Already handles fallbacks

    // Escape content before inserting
    const displayTitle = traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1');
    titleEl.textContent = `About: ${escapeHTML(displayTitle)}`;
    // Link terms within the explanation AFTER escaping the base explanation
    bodyEl.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(explanation))}</p>`;

    // Display the popup and manage focus/ARIA states
    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');
    this.elementThatOpenedModal = triggerButton || document.activeElement; // Store trigger for focus return

    // Ensure only the current trigger button shows expanded state
    document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
         if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if(triggerButton) triggerButton.setAttribute('aria-expanded', 'true');

    closeButton.focus(); // Set focus to the close button

    // Grant achievement (global, no save needed)
    grantAchievement({}, 'trait_info_viewed', this.showNotification.bind(this));
}

  hideTraitInfo() {
    console.log("[HIDE_TRAIT_INFO] Hiding trait info popup.");
    const popup = this.elements.traitInfoPopup;
     if (!popup || popup.getAttribute('aria-hidden') === 'true') return; // Already hidden

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Find the button that triggered this popup, either stored or by ARIA state
    const triggerButton = this.elementThatOpenedModal?.closest('.trait-info-btn') || document.querySelector('.trait-info-btn[aria-expanded="true"]');
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'false'); // Reset ARIA state
        // Try to return focus safely
        if (document.body.contains(triggerButton)) {
            try { triggerButton.focus(); } catch (e) { document.body.focus(); }
        } else { document.body.focus(); } // Fallback if button removed
    } else if (this.elementThatOpenedModal && document.body.contains(this.elementThatOpenedModal)) {
        // Fallback to stored element if it wasn't the button itself
         try { this.elementThatOpenedModal.focus(); } catch (e) { document.body.focus(); }
    } else {
        document.body.focus(); // Ultimate fallback
    }
    this.elementThatOpenedModal = null; // Clear stored element
}

  showContextHelp(helpKey, triggerButton = null) {
    console.log(`[SHOW_CONTEXT_HELP] Showing help for key: ${helpKey}`);
    const popup = this.elements.contextHelpPopup;
    const titleEl = this.elements.contextHelpTitle;
    const bodyEl = this.elements.contextHelpBody;
    const closeButton = this.elements.contextHelpClose;
    if (!popup || !titleEl || !bodyEl || !closeButton) {
        console.error("[CONTEXT_HELP] UI Error: Context help popup elements missing.");
        return;
    }

    // Get help text, provide fallback
    const helpText = contextHelpTexts[helpKey] || `No help available for '${escapeHTML(helpKey)}'.`;
    // Determine title, fallback to formatted key
    const displayTitle = glossaryTerms[helpKey]?.term || (helpKey.charAt(0).toUpperCase() + helpKey.slice(1).replace(/([A-Z])/g, ' $1'));

    // Escape content and link terms
    titleEl.textContent = `Help: ${escapeHTML(displayTitle)}`;
    bodyEl.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(helpText))}</p>`;

    // Display popup, manage focus/ARIA
    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');
    this.elementThatOpenedModal = triggerButton || document.activeElement;

    // Manage ARIA expanded state for trigger buttons
    document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => {
        if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if (triggerButton) triggerButton.setAttribute('aria-expanded', 'true');

    closeButton.focus(); // Focus close button
}

  hideContextHelp() {
    console.log("[HIDE_CONTEXT_HELP] Hiding context help popup.");
    const popup = this.elements.contextHelpPopup;
     if (!popup || popup.getAttribute('aria-hidden') === 'true') return; // Already hidden

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Find the element to return focus to
    const elementToFocus = this.elementThatOpenedModal || document.querySelector('.context-help-btn[aria-expanded="true"]');
    if (elementToFocus && document.body.contains(elementToFocus)) {
         // Reset ARIA state if it was the trigger button
         if (elementToFocus.classList.contains('context-help-btn')) {
             elementToFocus.setAttribute('aria-expanded', 'false');
         }
         try { elementToFocus.focus(); } catch (e) { document.body.focus(); } // Return focus safely
    } else {
        document.body.focus(); // Fallback focus
    }
    this.elementThatOpenedModal = null; // Clear stored element
}


  // --- Style Finder Methods ---

    sfStart() {
        console.log("[SF_START] Initiating Style Finder.");
        // Ensure Style Finder is not already active
        if (this.styleFinderActive) {
            console.warn("[SF_START] Style Finder already active. Restarting.");
            // Optionally, just bring the existing modal to the front instead of full reset
        }

        // Reset State
        this.styleFinderActive = true;
        this.styleFinderStep = 0; // Start at role selection
        this.styleFinderRole = null;
        this.styleFinderAnswers = { traits: {} }; // Reset answers
        this.styleFinderScores = {};
        this.previousScores = null;
        this.hasRenderedDashboard = false;
        this.sfSliderInteracted = false;
        this.styleFinderTraits = []; // Reset dynamic trait list
        this.traitOrder = []; // Reset trait order
        console.log("[SF_START] State reset.");

        // Reset UI Elements safely
        try {
            if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = 'Starting...';
            if(this.elements.sfProgressBar) {
                this.elements.sfProgressBar.style.width = '0%';
                this.elements.sfProgressBar.setAttribute('aria-valuenow', '0');
            }
            if(this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '<p class="loading-text">Loading your quest...</p>'; // Clear previous content
            if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = ''; // Clear feedback
            if(this.elements.sfDashboard) {
                this.elements.sfDashboard.innerHTML = ''; // Clear dashboard
                this.elements.sfDashboard.style.display = 'none'; // Ensure hidden
            }
        } catch (uiError) {
            console.error("[SF_START] Error resetting UI elements:", uiError);
            // Non-fatal, but log it
        }

        // Render the first step (role selection)
        try {
            this.sfRenderStep();
        } catch (renderError) {
             console.error("[SF_START] Error during initial sfRenderStep:", renderError);
             this.showNotification("Error preparing Style Finder. Please try again.", "error");
             this.styleFinderActive = false; // Deactivate on error
             return;
        }

        // Open the modal
        if (!this.elements.sfModal) {
            console.error("[SF_START] Cannot open modal: Style Finder modal element not found!");
            this.showNotification("UI Error: Style Finder window not found.", "error");
            this.styleFinderActive = false; // Deactivate
            return;
        }
        try {
            this.openModal(this.elements.sfModal);
            console.log("[SF_START] Style Finder modal should be open.");
        } catch (openModalError) {
             console.error("[SF_START] Error calling openModal:", openModalError);
             this.showNotification("Error opening Style Finder window.", "error");
             this.styleFinderActive = false; // Deactivate
        }
    }

    sfClose() {
         // Close the modal and reset state, called by close button or Escape key
         console.log("[SF_CLOSE] Closing Style Finder and resetting state.");
         this.closeModal(this.elements.sfModal); // Ensure modal visually closes
         this.styleFinderActive = false;
         this.styleFinderStep = 0;
         this.styleFinderRole = null;
         this.styleFinderAnswers = { traits: {} };
         this.styleFinderScores = {};
         this.previousScores = null;
         this.hasRenderedDashboard = false;
         this.sfSliderInteracted = false;
         this.styleFinderTraits = [];
         this.traitOrder = [];
         // Optionally clear UI elements again here if needed
         if (this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '';
         if (this.elements.sfDashboard) this.elements.sfDashboard.innerHTML = '';
    }

    sfSetRole(role) {
        if (role !== 'submissive' && role !== 'dominant') {
            console.error(`[SF_SET_ROLE] Invalid role: ${role}`);
            this.sfShowFeedback("Invalid role selected.", "error");
            return;
        }
        console.log(`[SF_SET_ROLE] Role set to: ${role}`);
        this.styleFinderRole = role;
        this.styleFinderAnswers = { traits: {} }; // Reset traits when role changes
        this.styleFinderScores = {};
        this.previousScores = null;
        this.hasRenderedDashboard = false;
        // Select and shuffle traits for this role
        this.styleFinderTraits = (role === 'submissive' ? sfSubFinderTraits : sfDomFinderTraits);
        this.traitFootnotes = (role === 'submissive' ? sfSubTraitFootnotes : sfDomTraitFootnotes);
        this.sliderDescriptions = sfSliderDescriptions; // Descriptions are shared for now
        // Shuffle the order traits are presented (simple shuffle using sort)
        this.traitOrder = [...this.styleFinderTraits].sort(() => 0.5 - Math.random());
        console.log(`[SF_SET_ROLE] Selected ${this.traitOrder.length} traits for role ${role}.`);

        this.sfNextStep(); // Move to the first trait question
    }

    sfSetTrait(traitName, value) {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || numericValue < 1 || numericValue > 10) {
            console.warn(`[SF_SET_TRAIT] Invalid value '${value}' for trait '${traitName}'. Setting to 5.`);
            this.styleFinderAnswers.traits[traitName] = 5; // Default to neutral if invalid
        } else {
            this.styleFinderAnswers.traits[traitName] = numericValue;
            // console.log(`[SF_SET_TRAIT] Set ${traitName} to ${numericValue}`); // Can be noisy, commented out
        }
    }

    sfCalculateSteps() {
        // Dynamically calculates the steps based on selected role and traits
        let steps = [{ type: 'role_selection', title: 'Choose Your Path', text: 'Which primary energy resonates most with you right now?' }];
        if (this.styleFinderRole && this.traitOrder.length > 0) {
            // Add steps for each trait in the shuffled order
            steps.push(...this.traitOrder.map(trait => ({ type: 'trait', name: trait.name, desc: trait.desc })));
        }
        // Add the final result step
        steps.push({ type: 'result', title: '🌟 Your Style Insights 🌟' });
        return steps;
    }

    sfNextStep(currentTraitName = null) {
        if (!this.styleFinderActive) return;
        const steps = this.sfCalculateSteps();

        // Optional: Store current trait value if coming from a trait step
        if (currentTraitName && this.elements.sfStepContent) {
             const slider = this.elements.sfStepContent.querySelector(`.sf-trait-slider[data-trait="${currentTraitName}"]`);
             if (slider) {
                 this.sfSetTrait(currentTraitName, slider.value);
             }
        }

        if (this.styleFinderStep < steps.length - 1) {
            this.styleFinderStep++;
            this.previousScores = { ...this.styleFinderScores }; // Store scores before potential update
            this.styleFinderScores = this.sfComputeScores(true); // Compute scores temporarily for dashboard update
            this.sfSliderInteracted = false; // Reset interaction flag for the new slider
            this.sfRenderStep();
            this.sfShowFeedback(''); // Clear previous feedback
        } else {
            console.log("[SF_NEXT_STEP] Already at the last step (results).");
            // Optionally re-render results if needed, but usually not necessary
             // this.sfRenderStep();
        }
    }

    sfPrevStep() {
        if (!this.styleFinderActive || this.styleFinderStep <= 0) return;
        // If currently on the results step, go back to the last trait
        if (this.sfCalculateSteps()[this.styleFinderStep]?.type === 'result') {
             this.styleFinderStep = this.sfCalculateSteps().length - 2; // Index of last trait
        } else {
             this.styleFinderStep--; // Otherwise just go back one step
        }

        this.previousScores = { ...this.styleFinderScores }; // Store scores before potential update
        this.styleFinderScores = this.sfComputeScores(true); // Recompute scores temporarily for dashboard update
        this.sfRenderStep();
        this.sfShowFeedback(''); // Clear feedback
    }

    sfStartOver() {
        console.log("[SF_START_OVER] Restarting Style Finder.");
        // Fully reset state and render the first step
        this.styleFinderActive = true; // Ensure it stays active
        this.styleFinderStep = 0;
        this.styleFinderRole = null;
        this.styleFinderAnswers = { traits: {} };
        this.styleFinderScores = {};
        this.previousScores = null;
        this.hasRenderedDashboard = false;
        this.sfSliderInteracted = false;
        this.styleFinderTraits = [];
        this.traitOrder = [];
        // Reset UI elements as well
        if(this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
        if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';
        // Render the first step (role selection)
        this.sfRenderStep();
    }

    sfCalculateResult() {
        console.log("[SF_CALC_RESULT] Calculating final results.");
        this.styleFinderScores = this.sfComputeScores(); // Compute final scores

        if (Object.keys(this.styleFinderScores).length === 0) {
            console.error("[SF_CALC_RESULT] No scores computed. Role likely invalid.");
            return null; // Indicate error
        }

        const sortedScores = Object.entries(this.styleFinderScores).sort((a, b) => b[1] - a[1]);

        if (sortedScores.length === 0 || sortedScores[0][1] <= 5) { // Use a threshold slightly above 0
            console.warn("[SF_CALC_RESULT] No style resonated significantly.");
            // Provide a default or "needs more info" result
             return {
                topStyle: { name: "Explorer 🌱", score: sortedScores[0]?.[1] || 0 }, // Show top score even if low
                topStyleDetails: { short: "Your responses were quite balanced or neutral.", long: "Try adjusting sliders more decisively or exploring different trait combinations to find a stronger resonance!", tips: ["Revisit the trait ratings.", "Consider core role traits strongly.", "Explore Style Discovery."] },
                topMatch: { match: "Open Field", dynamic: "Self-Discovery", longDesc: "A great time to explore basic concepts and desires without strong labels." },
                sortedScores: sortedScores
             };
        }

        const topStyleName = sortedScores[0][0];
        const topScore = sortedScores[0][1];

        // Fetch details for the top style
        const topStyleDetails = sfStyleDescriptions[topStyleName] || { short: "Details unavailable.", long: "No description found.", tips: [] };
        const topMatch = sfDynamicMatches[topStyleName] || { match: "?", dynamic: "Unique", longDesc: "No specific dynamic match found." };

        console.log(`[SF_CALC_RESULT] Top Style: ${topStyleName} (${topScore}%)`);
        return {
            topStyle: { name: topStyleName, score: topScore },
            topStyleDetails: topStyleDetails,
            topMatch: topMatch,
            sortedScores: sortedScores
        };
    }

    sfUpdateDashboard(isInitialRender = false) {
        if (!this.elements.sfDashboard) return;

        const currentScores = this.styleFinderScores; // Use temporarily computed scores
        // Filter out styles with 0 score before sorting and displaying? Optional.
        // const sortedEntries = Object.entries(currentScores).filter(([,score]) => score > 0).sort((a, b) => b[1] - a[1]);
        const sortedEntries = Object.entries(currentScores).sort((a, b) => b[1] - a[1]);


        let dashboardHTML = `<h4 class="sf-dashboard-header">Style Resonance</h4>`;
        if (sortedEntries.length === 0 || sortedEntries.every(([,score]) => score === 0)) {
             dashboardHTML += '<p class="muted-text">Answer questions to see scores...</p>';
        } else {
            sortedEntries.forEach(([styleName, score]) => {
                const prevScore = this.previousScores ? (this.previousScores[styleName] ?? 0) : 0;
                const scoreChange = isInitialRender ? 0 : score - prevScore;
                let changeIndicator = '';
                let deltaClass = '';

                // Generate change indicator HTML if change is not 0
                if (scoreChange > 0) {
                    changeIndicator = `<span class="sf-move-up">▲</span><span class="sf-score-delta positive">+${scoreChange}%</span>`;
                    deltaClass = 'positive';
                } else if (scoreChange < 0) {
                    changeIndicator = `<span class="sf-move-down">▼</span><span class="sf-score-delta negative">${scoreChange}%</span>`; // Negative sign included
                    deltaClass = 'negative';
                }

                const barWidth = Math.max(0, Math.min(100, score)); // Ensure width is between 0 and 100
                const barHTML = `<div class="sf-score-bar" style="width: ${barWidth}%;"></div>`;
                 const escapedStyleName = escapeHTML(styleName); // Escape style name

                // Build the dashboard item HTML
                dashboardHTML += `
                    <div class="sf-dashboard-item ${deltaClass}">
                        <span class="sf-style-name" title="${escapedStyleName}">${escapedStyleName}</span>
                        <div class="sf-score-bar-container" title="${score}%">${barHTML}</div>
                        <span class="sf-dashboard-score">
                            ${score}% ${changeIndicator}
                        </span>
                    </div>`;
            });
        }

        this.elements.sfDashboard.innerHTML = dashboardHTML;
        // Scroll dashboard to top only on updates, not initial render
        if(!isInitialRender) {
             this.elements.sfDashboard.scrollTop = 0;
        }
    }

    // FIX: Corrected sfRenderStep logic based on second error report
    sfRenderStep() {
        if (!this.styleFinderActive || !this.elements.sfStepContent) return;

        this.elements.sfStepContent.classList.add('sf-step-transition'); // Start fade out

        const steps = this.sfCalculateSteps();
        const currentStepIndex = this.styleFinderStep;
        const totalSteps = steps.length;

        // Basic validation for step index
        if (currentStepIndex >= totalSteps || currentStepIndex < 0) {
            console.error(`[SF_RENDER_STEP] Invalid step index: ${currentStepIndex}. Total steps: ${totalSteps}. Attempting reset.`);
            this.sfStartOver();
            return; // Stop this invalid render attempt
        }

        const currentStepData = steps[currentStepIndex];
        console.log(`[SF_RENDER_STEP] Rendering step ${currentStepIndex + 1} (${currentStepData.type}). Trait (if any): ${currentStepData.name || 'N/A'}`);

        // --- Progress Bar Update ---
        const progressPercent = totalSteps > 1 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;
        if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = `Step ${currentStepIndex + 1} / ${totalSteps}`;
        if(this.elements.sfProgressBar) {
             this.elements.sfProgressBar.style.width = `${progressPercent}%`;
             this.elements.sfProgressBar.setAttribute('aria-valuenow', progressPercent);
        }

        let html = '';
        let showDashboard = false; // Control dashboard visibility per step

        // --- Generate HTML based on Step Type ---
        switch (currentStepData.type) {
            case 'role_selection':
                 // Ensure state is clean for role selection
                 this.styleFinderRole = null;
                 this.styleFinderAnswers = { traits: {} };
                 this.styleFinderScores = {};
                 this.previousScores = null;
                 this.hasRenderedDashboard = false;
                 // Render role buttons
                html = `
                    <div class="sf-step-inner">
                        <h2>${escapeHTML(currentStepData.title)}</h2>
                        <p>${escapeHTML(currentStepData.text)}</p>
                        <div class="sf-button-container">
                            <button type="button" data-action="setRole" data-role="submissive" class="sf-role-btn sub-btn">Submissive Path 🙇‍♀️</button>
                            <button type="button" data-action="setRole" data-role="dominant" class="sf-role-btn dom-btn">Dominant Path 👑</button>
                        </div>
                    </div>`;
                 if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none'; // Hide dashboard
                 showDashboard = false;
                break;

            case 'trait':
                if (!this.styleFinderRole) { // Safety check
                     console.error("[SF_RENDER_STEP] Cannot render trait step: Role not set.");
                     this.sfStartOver(); return;
                }
                const traitName = currentStepData.name;
                const traitDesc = currentStepData.desc;
                // Default to 5 if not answered yet
                const currentValue = this.styleFinderAnswers.traits[traitName] ?? 5;
                const footnote = this.traitFootnotes[traitName] || '';
                const sliderDescArray = this.sliderDescriptions[traitName] || [];

                // FIX: Correctly calculate the description index
                // Ensure length is checked correctly and index is clamped
                const maxDescIndex = sliderDescArray.length > 0 ? sliderDescArray.length - 1 : 0;
                const desiredDescIndex = currentValue - 1; // Convert 1-10 value to 0-9 index
                const descIndex = Math.max(0, Math.min(desiredDescIndex, maxDescIndex)); // Clamp index

                const currentDescText = sliderDescArray[descIndex] || `Value: ${currentValue}`; // Get text using corrected index
                const escapedTraitName = escapeHTML(traitName);
                const displayTitle = escapedTraitName.charAt(0).toUpperCase() + escapedTraitName.slice(1); // This line is OK

                html = `
                    <div class="sf-step-inner">
                        <div class="sf-trait-content">
                             <h2>
                                ${displayTitle}
                                <button type="button" class="sf-info-icon" data-trait="${escapedTraitName}" aria-label="Info about ${displayTitle}" title="Show info for ${displayTitle}">?</button>
                             </h2>
                             <p class="sf-trait-desc">${escapeHTML(traitDesc)}</p>
                             <input type="range" class="sf-trait-slider" data-trait="${escapedTraitName}" min="1" max="10" value="${currentValue}" aria-label="${displayTitle} rating" step="1">
                             <div class="sf-slider-description" id="sf-desc-${escapedTraitName}">${escapeHTML(currentDescText)}</div>
                             <div class="sf-slider-footnote">${escapeHTML(footnote)}</div>
                        </div>
                        <div class="sf-button-container trait-buttons">
                             {/* Show Back button only after the first trait */}
                             ${currentStepIndex > 1 ? '<button type="button" data-action="prev" class="sf-nav-btn prev-btn">⬅️ Back</button>' : '<span class="sf-nav-placeholder"></span>'}
                             {/* Pass current trait for potential saving on next */}
                             <button type="button" data-action="next" data-currenttrait="${escapedTraitName}" class="sf-nav-btn next-btn">Next ➡️</button>
                        </div>
                    </div>
                    `;
                // Determine if slider was already interacted with for this trait
                this.sfSliderInteracted = this.styleFinderAnswers.traits[traitName] !== undefined;
                showDashboard = true; // Show dashboard during trait steps
                break;

            case 'result':
                if (!this.styleFinderRole) { // Safety check
                     console.error("[SF_RENDER_STEP] Cannot render result step: Role not set.");
                     this.sfStartOver(); return;
                }
                const resultData = this.sfCalculateResult(); // Calculate final results
                 if (!resultData?.topStyle) {
                     console.error("[SF_RENDER_STEP] Failed to calculate results.");
                     html = '<div class="sf-step-inner error-text"><p>Could not calculate results. Please try again.</p><button type="button" data-action="startOver" class="sf-nav-btn">Restart</button></div>';
                     break; // Stop rendering if results failed
                 }
                const escapedTopStyleName = escapeHTML(resultData.topStyle.name);
                const escapedRole = escapeHTML(this.styleFinderRole);

                html = `
                     <div class="sf-step-inner sf-result-step">
                         <h2>${escapeHTML(currentStepData.title)}</h2>
                         <p class="sf-result-intro">Based on your responses, here are styles that seem to resonate:</p>

                         <div class="sf-result-summary">
                            <h3>✨ Top Suggestion ✨</h3>
                            <div class="sf-result-card top-suggestion">
                                 <h4>${escapedTopStyleName}</h4>
                                 {/* Escape details from result data */}
                                 <p><strong>${escapeHTML(resultData.topStyleDetails?.short || '')}</strong> ${escapeHTML(resultData.topStyleDetails?.long || 'Details loading...')}</p>
                                 {/* Button to show full details popup */}
                                 <button type="button" class="link-button sf-details-link" data-action="showDetails" data-style="${escapedTopStyleName}">(Show Full Details)</button>
                             </div>

                             <h4>Possible Dynamic</h4>
                              <div class="sf-result-card dynamic-match">
                                 {/* Escape match data */}
                                 <p>Match: <strong>${escapeHTML(resultData.topMatch?.match || '?')}</strong></p>
                                 <p><em>Dynamic: ${escapeHTML(resultData.topMatch?.dynamic || '?')}</em></p>
                                 <p class="match-desc">${escapeHTML(resultData.topMatch?.longDesc || 'No specific dynamic info.')}</p>
                             </div>

                             <h4>Other Resonating Styles</h4>
                              {/* Render the summary dashboard with other scores */}
                              <div id="summary-dashboard">
                                ${this.sfGenerateSummaryDashboard(resultData.sortedScores.slice(1))}
                             </div>
                         </div>

                         {/* Action buttons for results page */}
                         <div class="sf-button-container result-buttons">
                             <button type="button" data-action="confirmApply" data-role="${escapedRole}" data-style="${escapedTopStyleName}" class="sf-action-btn apply-btn">Apply '${escapedTopStyleName}' to Form</button>
                             <button type="button" data-action="prev" class="sf-nav-btn prev-btn">⬅️ Back to Traits</button>
                             <button type="button" data-action="startOver" class="sf-nav-btn clear-btn">Start Over 🔄</button>
                         </div>
                     </div>`;
                showDashboard = false; // Hide live dashboard on results page

                 // Confetti celebration!
                 if (typeof confetti === 'function') {
                     try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, angle: 90 }); } catch (e) { console.warn("Confetti error:", e); }
                 }
                 // Grant achievement for completing the finder
                 grantAchievement({}, 'style_finder_complete', this.showNotification.bind(this));
                break;

            default:
                console.error(`[SF_RENDER_STEP] Unknown step type: ${currentStepData.type}`);
                html = '<div class="sf-step-inner error-text"><p>Error: Unknown step type encountered.</p><button type="button" data-action="startOver" class="sf-nav-btn">Restart</button></div>';
                showDashboard = false;
        }

        // --- Update Dashboard Visibility ---
        if (this.elements.sfDashboard) {
             if (showDashboard) {
                  // Only render full dashboard content once per role selection
                  if (!this.hasRenderedDashboard) {
                       this.sfUpdateDashboard(true); // Initial render
                       this.hasRenderedDashboard = true;
                    }
                  else { this.sfUpdateDashboard(); } // Subsequent updates
                  this.elements.sfDashboard.style.display = 'block';
             } else {
                 this.elements.sfDashboard.style.display = 'none'; // Hide dashboard
                 this.hasRenderedDashboard = false; // Reset flag when dashboard hides
             }
        }

        // --- Render HTML with Transition ---
        requestAnimationFrame(() => { // Ensure transition class is removed after render
             // Ensure element still exists before updating
             if (this.elements.sfStepContent) {
                 this.elements.sfStepContent.innerHTML = html;
                 // Allow short delay for CSS transition before removing class
                 setTimeout(() => { this.elements.sfStepContent?.classList.remove('sf-step-transition'); }, 50);
             } else {
                 console.error("[SF_RENDER_STEP] sfStepContent element disappeared before rendering HTML.");
             }
        });
    } // End sfRenderStep


   sfCloseAllPopups() {
         // Closes any open SF info popups
         let popupsClosed = false;
         document.querySelectorAll('.sf-style-info-popup').forEach(popup => {
             popup.remove();
             popupsClosed = true;
         });
         // Reset active state on trigger icons
         document.querySelectorAll('.sf-info-icon.active').forEach(icon => {
              icon.classList.remove('active');
         });
         if(popupsClosed) console.log("[SF_CLOSE_POPUPS] Closed open SF popups.");
         return popupsClosed; // Return true if any popups were closed
    }

    sfComputeScores(temporary = false) {
        // Computes style scores based on current answers
        let stylePoints = {};
        if (!this.styleFinderRole || !sfStyles[this.styleFinderRole]) {
            console.warn("[SF_COMPUTE_SCORES] Cannot compute scores: Role not set or invalid.");
            return {}; // Return empty object if role/styles invalid
        }

        const relevantStyles = sfStyles[this.styleFinderRole];
        const answeredTraits = this.styleFinderAnswers.traits; // Direct reference

        if (Object.keys(answeredTraits).length === 0 && !temporary) {
             console.warn("[SF_COMPUTE_SCORES] No traits answered yet.");
             // Return initial zero scores if no traits answered
             relevantStyles.forEach(styleName => { stylePoints[styleName] = 0; });
             return stylePoints;
        }

        // 1. Calculate Raw Points based on weights
        relevantStyles.forEach(styleName => {
            let pointsForThisStyle = 0;
            // Find the corresponding key traits for this style name (case-insensitive)
            const styleKeyTraitKey = Object.keys(sfStyleKeyTraits).find(key =>
                normalizeStyleKey(key) === normalizeStyleKey(styleName)
            );
            const keyTraitsForStyle = styleKeyTraitKey ? sfStyleKeyTraits[styleKeyTraitKey] : {};

            // Iterate through answered traits
            for (const traitName in answeredTraits) {
                if (keyTraitsForStyle.hasOwnProperty(traitName)) {
                    const userScore = answeredTraits[traitName]; // Already a number
                    const weight = keyTraitsForStyle[traitName] || 1;
                    let scoreContribution = 0;

                    // Simplified scoring logic (adjust as needed)
                    if (userScore >= 9) { scoreContribution = 3; }       // Strong positive
                    else if (userScore >= 7) { scoreContribution = 1; }    // Mild positive
                    else if (userScore >= 4) { scoreContribution = 0.25; } // Neutral/Slight positive
                    else if (userScore >= 2) { scoreContribution = -1; }   // Mild negative
                    else { scoreContribution = -2; }                       // Strong negative

                    pointsForThisStyle += scoreContribution * weight;
                }
            }
            // Store raw points, clamped at 0 minimum
            stylePoints[styleName] = Math.max(0, pointsForThisStyle);
        });

        // 2. Normalization (Scale scores to 0-100 based on max achieved score)
        let finalScores = {};
        const achievedScores = Object.values(stylePoints);
        // Find the maximum score achieved among all styles
        const maxAchievedPoints = achievedScores.length > 0 ? Math.max(...achievedScores) : 0;

        // Corrected logic for normalization
        if (maxAchievedPoints <= 0) {
             // If max score is 0 or less, all normalized scores are 0
            relevantStyles.forEach(styleName => {
                finalScores[styleName] = 0;
            });
        } else {
             // Normalize each style's score relative to the max achieved score
            relevantStyles.forEach(styleName => {
                finalScores[styleName] = Math.round((stylePoints[styleName] / maxAchievedPoints) * 100);
            });
        } // Correct closing brace for the if/else

        if (!temporary) { // Log final scores only when not temporary calculation
            console.log("[SF_COMPUTE_SCORES] Final Normalized Scores:", finalScores);
        }
        return finalScores;
    }

    sfGenerateSummaryDashboard(sortedScores) {
        // Generates the HTML for the dashboard shown on the results page
        console.log("[SF_GEN_SUMMARY_DASH] Generating summary dashboard.");
        if (!sortedScores || sortedScores.length === 0) return '<p class="muted-text">No other styles resonated strongly.</p>';

        let dashboardHTML = `<h4 class="sf-dashboard-header">Other Resonating Styles</h4>`;
        // Show top 5 other styles
        sortedScores.slice(0, 5).forEach(([styleName, score]) => {
             const barWidth = Math.max(0, Math.min(100, score)); // Clamp width
             const barHTML = `<div class="sf-score-bar" style="width: ${barWidth}%;"></div>`;
             const escapedStyleName = escapeHTML(styleName);
             dashboardHTML += `
                <div class="sf-dashboard-item summary-item"> {/* Added summary-item class */}
                    <span class="sf-style-name" title="${escapedStyleName}">${escapedStyleName}</span>
                    <div class="sf-score-bar-container" title="${score}%">${barHTML}</div>
                    <span class="sf-dashboard-score">${score}%</span>
                </div>`;
        });
         if (sortedScores.length > 5) {
             dashboardHTML += `<p class="muted-text" style="text-align: center; margin-top: 0.5em;">(Top 5 shown)</p>`;
         }
        return dashboardHTML;
    }

    sfShowFeedback(message, type = 'info') {
        // Displays feedback messages within the SF modal
        if (!this.elements.sfFeedback) return;
        this.elements.sfFeedback.textContent = message;
        this.elements.sfFeedback.className = `sf-feedback feedback-${type}`; // Apply class for styling
        // Trigger animation
        this.elements.sfFeedback.classList.remove('feedback-animation');
        void this.elements.sfFeedback.offsetWidth; // Force reflow to restart animation
        this.elements.sfFeedback.classList.add('feedback-animation');
    }

    sfShowTraitInfo(traitName, triggerElement = null) {
        // Shows a popup with the trait explanation within the SF context
        console.log(`[SF_SHOW_TRAIT_INFO] Showing SF info for trait: ${traitName}`);
        // Use findTraitExplanation which checks core data and SF data
        const explanation = findTraitExplanation(traitName); // Already handles fallbacks
        const displayTitle = traitName.charAt(0).toUpperCase() + traitName.slice(1);

        this.sfCloseAllPopups(); // Close any other open SF popups

        // Create popup element dynamically
        const popup = document.createElement('div');
        popup.className = 'sf-style-info-popup card'; // Use existing styling
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-labelledby', 'sf-popup-title');
        popup.style.display = 'none'; // Hide initially
        const titleId = `sf-popup-title-${generateSimpleId()}`;

        // Escape content and add close button
        popup.innerHTML = `
            <button type="button" class="sf-close-btn popup-close" aria-label="Close">×</button>
            <h3 id="${titleId}">${escapeHTML(displayTitle)}</h3>
            <p>${this.linkGlossaryTerms(escapeHTML(explanation))}</p> {/* Link terms */}
        `;

        // Add close functionality
        const closeButton = popup.querySelector('.sf-close-btn');
        closeButton?.addEventListener('click', () => {
            popup.remove(); // Remove popup from DOM
            triggerElement?.classList.remove('active'); // Deactivate trigger icon
            // Try to return focus safely
            if(triggerElement && document.body.contains(triggerElement)) {
                 try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
            }
        });

        document.body.appendChild(popup); // Add to page
        popup.style.display = 'block'; // Show it
        closeButton?.focus(); // Focus close button
        if (triggerElement) triggerElement.classList.add('active'); // Mark trigger icon as active
    }

    sfShowFullDetails(styleNameWithEmoji, triggerElement = null) {
        // Shows a wider popup with full style details, match, and tips
        console.log(`[SF_SHOW_FULL_DETAILS] Showing full details for style: "${styleNameWithEmoji}"`);
        const descData = sfStyleDescriptions[styleNameWithEmoji];
        const matchData = sfDynamicMatches[styleNameWithEmoji];

        if (!descData || !matchData) {
            console.warn(`[SF_SHOW_FULL_DETAILS] Data missing for style: ${styleNameWithEmoji}`);
            this.sfShowFeedback("Cannot load full details for this style.", "error");
            return;
        }

        this.sfCloseAllPopups(); // Close other popups

        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'sf-style-info-popup card wide-popup'; // Wider popup style
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-labelledby', 'sf-detail-popup-title');
        popup.style.display = 'none';
        const titleId = `sf-detail-popup-title-${generateSimpleId()}`;

        // Populate with escaped data
        popup.innerHTML = `
            <button type="button" class="sf-close-btn popup-close" aria-label="Close">×</button>
            <h3 id="${titleId}">${escapeHTML(styleNameWithEmoji)} Details</h3>
            <h4>Summary</h4>
            <p><strong>${escapeHTML(descData.short)}</strong></p>
            <p>${escapeHTML(descData.long)}</p>
            <h4>Potential Match: ${escapeHTML(matchData.match)}</h4>
            <p><em>Dynamic: ${escapeHTML(matchData.dynamic)}</em></p>
            <p>${escapeHTML(matchData.longDesc)}</p>
            <h4>Tips for Exploration:</h4>
            <ul>${descData.tips.map(tip => `<li>${escapeHTML(tip)}</li>`).join('')}</ul>
        `;

         // Add close functionality
         const closeButton = popup.querySelector('.sf-close-btn');
         closeButton?.addEventListener('click', () => {
             popup.remove();
             triggerElement?.classList.remove('active');
             // Return focus safely
             if (triggerElement && document.body.contains(triggerElement)) {
                  try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
             }
         });

        document.body.appendChild(popup);
        popup.style.display = 'block';
        closeButton?.focus();
        if (triggerElement) triggerElement.classList.add('active'); // Mark trigger as active
    }

    applyStyleFinderResult(role, styleWithEmoji) {
        // Applies the selected role and style from SF results to the main form
        console.log(`[SF_APPLY_RESULT] Applying SF result - Role: ${role}, Style: ${styleWithEmoji}`);
        if (!role || !styleWithEmoji || !this.elements.role || !this.elements.style || !this.elements.formSection) {
            console.error("[SF_APPLY_RESULT] Missing required elements or data to apply result.");
            this.showNotification("Error applying style to form.", "error");
            return;
        }

        this.resetForm(true); // Clear the main form completely first

        // Set the role dropdown
        this.elements.role.value = role;
        this.renderStyles(role); // Re-render styles for the selected role

        // Use setTimeout to ensure the style dropdown is populated before setting its value
        setTimeout(() => {
             if (!this.elements.style) {
                  console.error("[SF_APPLY_RESULT] Style dropdown element not found after delay. Cannot apply style.");
                   this.showNotification("Error: Could not find style dropdown to apply selection.", "error");
                  return;
             }
             // Find the specific option matching the result style name
             const styleOption = Array.from(this.elements.style.options).find(opt => opt.value === styleWithEmoji);
             if (styleOption) {
                 this.elements.style.value = styleWithEmoji; // Set the style dropdown value
                 console.log(`[SF_APPLY_RESULT] Set style dropdown to: ${styleWithEmoji}`);
                 // Render traits based on the applied role and style
                 this.renderTraits(role, styleWithEmoji);
                 // Update the live preview to reflect the applied settings
                 this.updateLivePreview();
                 this.updateStyleExploreLink(); // Update the explore link
             } else {
                  // Log error if the style option wasn't found (shouldn't happen if data is consistent)
                  console.error(`[SF_APPLY_RESULT] Style option '${styleWithEmoji}' not found in dropdown for role '${role}'. Cannot apply.`);
                  this.showNotification(`Error: Style '${escapeHTML(styleWithEmoji)}' could not be applied.`, "error");
             }
         }, 150); // Delay allows DOM updates

        this.sfClose(); // Close the Style Finder modal
        this.showNotification(`Style '${escapeHTML(styleWithEmoji)}' applied! Add a name & Save.`, "success");
        // Scroll to the form and focus the name field
        this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => this.elements.name?.focus(), 400); // Focus after scroll
    }

  // --- Theme Management ---

  applySavedTheme() {
    console.log("[APPLY_THEME] Applying saved theme.");
    let savedTheme = 'light'; // Default theme
    try {
        // FIX: Added try...catch for localStorage access
        savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
    } catch (e) {
        console.error("[APPLY_THEME] Error reading theme from localStorage:", e);
        // Continue with default theme if read fails
    }
    this.setTheme(savedTheme); // Apply the loaded or default theme
  }

  setTheme(themeName) {
    console.log(`[SET_THEME] Setting theme to: ${themeName}`);
    // Validate theme name against known themes (optional but recommended)
    const validThemes = ['light', 'dark', 'pastel', 'velvet'];
    if (!validThemes.includes(themeName)) {
        console.warn(`[SET_THEME] Invalid theme name '${themeName}'. Defaulting to 'light'.`);
        themeName = 'light';
    }

    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', themeName);

    // Save theme preference to localStorage
    try {
        // FIX: Added try...catch for localStorage access
        localStorage.setItem('kinkCompassTheme', themeName);
    }
    catch (e) {
        console.error(`[SET_THEME] Error saving theme '${themeName}' to localStorage:`, e);
        this.showNotification("Could not save theme preference.", "warning");
    }

    // Update theme toggle button text/icon
    if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️';
        this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

     // Grant achievement only once per session/reasonable interval using timeout
     if (!this.themeChangeTimeout) {
         this.themeChangeTimeout = setTimeout(() => {
             grantAchievement({}, 'theme_changer', this.showNotification.bind(this)); // Global achievement
             this.themeChangeTimeout = null; // Reset timeout flag
         }, 1000); // Grant after 1 second to avoid spamming
     }

      // Update chart theme if chart exists
      if (this.chartInstance) {
          this.updateChartTheme();
      }
  }

  toggleTheme() {
    console.log("[TOGGLE_THEME] Toggling theme.");
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
}

  updateChartTheme() {
     // Updates chart colors based on current CSS variables
     if (!this.chartInstance) return;
     console.log("[UPDATE_CHART_THEME] Updating chart colors.");

     // Use requestAnimationFrame to ensure styles are computed after theme change
     requestAnimationFrame(() => {
         try {
             const computedStyle = getComputedStyle(document.documentElement);
             // Get color values from CSS variables
             const gridColor = computedStyle.getPropertyValue('--chart-grid-color').trim();
             const labelColor = computedStyle.getPropertyValue('--chart-label-color').trim();
             const tooltipBg = computedStyle.getPropertyValue('--chart-tooltip-bg').trim();
             const tooltipText = computedStyle.getPropertyValue('--chart-tooltip-text').trim();

             // Update chart options - Use optional chaining for safety
             this.chartInstance.options.scales?.y?.ticks?.color = labelColor;
             this.chartInstance.options.scales?.y?.title?.color = labelColor;
             this.chartInstance.options.scales?.y?.grid?.color = gridColor;

             this.chartInstance.options.scales?.x?.ticks?.color = labelColor;
             this.chartInstance.options.scales?.x?.title?.color = labelColor;
             this.chartInstance.options.scales?.x?.grid?.color = gridColor; // Though grid is often hidden for x

             this.chartInstance.options.plugins?.legend?.labels?.color = labelColor;

             if (this.chartInstance.options.plugins?.tooltip) {
                 this.chartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
                 this.chartInstance.options.plugins.tooltip.titleColor = tooltipText;
                 this.chartInstance.options.plugins.tooltip.bodyColor = tooltipText;
             }

             // Apply updates without animation
             this.chartInstance.update('none');
             console.log("[UPDATE_CHART_THEME] Chart theme updated.");
         } catch (error) {
            console.error("[UPDATE_CHART_THEME] Error applying theme to chart:", error);
         }
     });
 }


  // --- Modal Management ---

  openModal(modalElement) {
    if (!modalElement) {
        console.warn("[OPEN_MODAL] Attempted to open a null modal element.");
        return;
    }
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[OPEN_MODAL] Opening modal: #${modalId}`);

    // Close any other *standard* modals first (ignore popups like trait info)
    const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]:not(.trait-info-popup):not(.context-help-popup):not(.sf-style-info-popup)');
    if (currentlyOpen && currentlyOpen !== modalElement) {
        console.log(`[OPEN_MODAL] Closing currently open modal: #${currentlyOpen.id}`);
        this.closeModal(currentlyOpen);
    }

    // Store the element that had focus before opening the modal
    this.elementThatOpenedModal = document.activeElement;

    // Show the modal
    modalElement.style.display = 'flex'; // Use flex for centering defined in CSS
    modalElement.setAttribute('aria-hidden', 'false');

    // Focus management for accessibility
    requestAnimationFrame(() => { // Wait for display change to take effect
        // Try to find the first focusable element within the modal
        let focusTarget = modalElement.querySelector('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
        // Fallback: Focus the close button
        if (!focusTarget) focusTarget = modalElement.querySelector('.modal-close, .sf-close-btn, .popup-close');
        // Fallback: Focus the modal content area itself
        if (!focusTarget) focusTarget = modalElement.querySelector('.modal-content');
        // Ultimate fallback: Focus the modal container
        if (!focusTarget) focusTarget = modalElement;

        if (focusTarget) {
            // Ensure the target is focusable (add tabindex=-1 if needed)
            if (focusTarget.hasAttribute('tabindex') && focusTarget.getAttribute('tabindex') === '-1') {
                // Already focusable, good.
            } else if (!focusTarget.hasAttribute('tabindex') && (focusTarget === modalElement || focusTarget.classList.contains('modal-content'))) {
                 // Make container focusable only if no interactive elements found
                 focusTarget.setAttribute('tabindex', '-1');
            }
            // Attempt to focus
            try {
                 focusTarget.focus({ preventScroll: true }); // preventScroll might help in some cases
                 console.log(`[OPEN_MODAL] Focused element:`, focusTarget);
            } catch (focusError) {
                 console.error(`[OPEN_MODAL] Error focusing element in modal #${modalId}:`, focusError);
                 // Attempt to focus the modal itself as a last resort
                 try { modalElement.focus({ preventScroll: true }); } catch (e) {}
            }
        }
    });
}

  closeModal(modalElement) {
    if (!modalElement || modalElement.getAttribute('aria-hidden') === 'true') {
        // console.log("[CLOSE_MODAL] Modal already closed or invalid element.");
        return; // Already closed or invalid
    }
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[CLOSE_MODAL] Closing modal: #${modalId}`);

    // Hide the modal
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');

    // Remove tabindex if it was added to make the container focusable
    modalElement.removeAttribute('tabindex');
    modalElement.querySelector('.modal-content[tabindex="-1"]')?.removeAttribute('tabindex');

    // Restore focus to the element that opened the modal
    const elementToFocus = this.elementThatOpenedModal;
    this.elementThatOpenedModal = null; // Clear stored element

    requestAnimationFrame(() => { // Use RAF for smoother focus return
        try {
            // Check if the element still exists and is visible
            if (elementToFocus && document.body.contains(elementToFocus) && elementToFocus.offsetParent !== null) {
                elementToFocus.focus({ preventScroll: true });
                console.log(`[CLOSE_MODAL] Returned focus to:`, elementToFocus);
            } else {
                 console.log("[CLOSE_MODAL] Original focus element not available, focusing body.");
                 document.body.focus(); // Fallback
            }
        } catch (e) {
            console.error("[CLOSE_MODAL] Error returning focus:", e);
            document.body.focus(); // Ultimate fallback
        }
    });
    console.log(`[CLOSE_MODAL] Finished closing process for #${modalId}.`);
}


   // --- Internal Helper Methods ---

   getSynergyHints(person) {
       // Finds trait synergy hints based on persona's trait scores
       if (!person?.traits) return []; // Return empty array if no traits
       return findHintsForTraits(person.traits); // Use utility function
   }

   getGoalAlignmentHints(person) {
       // Generates hints based on keywords in active goals and relevant trait scores
        const hints = [];
        if (!person?.goals || !person?.traits || typeof goalKeywords !== 'object') return hints;

        const activeGoals = person.goals.filter(g => !g.done); // Consider only active goals
        if (activeGoals.length === 0) return hints;

        const maxHints = 3; // Limit number of hints shown
        let hintsFound = 0;

        // Iterate through active goals
        for (const goal of activeGoals) {
             if (hintsFound >= maxHints) break; // Stop if max hints reached
             const goalTextLower = goal.text.toLowerCase();
             const uniqueTraitsMentioned = new Set(); // Avoid multiple hints for same trait per goal

             // Iterate through keywords defined in goalKeywords
             for (const [keyword, data] of Object.entries(goalKeywords)) {
                  if (hintsFound >= maxHints) break;
                  // Check if goal text includes the keyword
                  if (goalTextLower.includes(keyword) && Array.isArray(data.relevantTraits)) {
                      // Check relevant traits for this keyword
                      for (const traitName of data.relevantTraits) {
                          if (hintsFound >= maxHints) break;
                          // Check if persona has this trait and it hasn't been mentioned for this goal yet
                          if (person.traits.hasOwnProperty(traitName) && !uniqueTraitsMentioned.has(traitName)) {
                               const score = person.traits[traitName];
                               const templates = data.promptTemplates || [];
                               if (templates.length > 0) {
                                    // Select a random prompt template
                                    const promptTemplate = templates[Math.floor(Math.random() * templates.length)];
                                    // Format the hint text, escaping trait name and goal text
                                    const hintText = promptTemplate
                                        .replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`);
                                    hints.push(`For goal "<em>${escapeHTML(goal.text)}</em>": ${hintText} (Your score: ${score}${getFlairForScore(score)})`);
                                    hintsFound++;
                                    uniqueTraitsMentioned.add(traitName); // Mark trait as mentioned for this goal
                               }
                          }
                      }
                  }
             }
        }
        // Return unique hints (Set might reorder, so just return the array)
        return hints; // Return the collected hints (might have duplicates if keywords overlap significantly)
    }

   getDailyChallenge(persona = null) {
       // Selects a random daily challenge, potentially tailored to the persona's role
        if (typeof challenges !== 'object' || Object.keys(challenges).length === 0) {
            console.warn("[DAILY_CHALLENGE] Challenges data missing or empty.");
            return null;
        }

        let possibleCategories = ['communication', 'exploration']; // Base categories

        // Add role-specific categories if persona provided
        if (persona?.role) {
            const roleKey = persona.role.toLowerCase();
            const roleChallengeKey = `${roleKey}_challenges`;
            if (challenges[roleChallengeKey]) {
                possibleCategories.push(roleChallengeKey);
            } else if (roleKey === 'switch' && challenges['switch_challenges']) {
                 // Explicitly handle switch role if specific key exists
                possibleCategories.push('switch_challenges');
            }
        }

        // Filter out categories that don't exist or are empty
         possibleCategories = possibleCategories.filter(catKey =>
             challenges[catKey] && Array.isArray(challenges[catKey]) && challenges[catKey].length > 0
         );

        if (possibleCategories.length === 0) {
            console.log("[DAILY_CHALLENGE] No suitable challenge categories found.");
            return null; // No challenges available
        }

        // Select a random category and a random challenge from it
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
        const categoryChallenges = challenges[randomCategoryKey];
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];

        // Format category name for display
        const displayCategory = randomCategoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Return challenge object with category info
        return { ...randomChallenge, category: displayCategory };
    }

   getKinkOracleReading(person) {
       // Generates a randomized Oracle reading based on persona data
        console.log(`[GET_ORACLE_READING] Generating reading for Person ID ${person?.id}`);
        if (typeof oracleReadings !== 'object' || !oracleReadings.openings || !oracleReadings.focusAreas || !oracleReadings.encouragements || !oracleReadings.closings) {
            console.error("[ORACLE] Oracle readings data structure is invalid in appData.js.");
            return null;
        }

        const reading = {};
        try {
            // Helper to get random element from an array
            const getRandom = (arr, fallback = "") => (arr && Array.isArray(arr) && arr.length > 0) ? arr[Math.floor(Math.random() * arr.length)] : fallback;

            // Select random opening, encouragement, closing
            reading.opening = getRandom(oracleReadings.openings, "The energies swirl...");
            reading.encouragement = getRandom(oracleReadings.encouragements, "Keep exploring!");
            reading.closing = getRandom(oracleReadings.closings, "Go well.");

            // Determine focus area (prioritize trait/style if possible)
            let focusText = "";
            const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score))) : [];
            const hasTraits = traits.length > 0;
            const hasStyle = person?.style;

            // Weighted random chance to pick focus type
            const focusTypeRoll = Math.random();

            if (hasTraits && focusTypeRoll < 0.5 && Array.isArray(oracleReadings.focusAreas?.traitBased)) { // 50% chance if traits exist
                // Sort traits by how far they are from neutral (3) to focus on extremes
                traits.sort((a, b) => Math.abs(b[1] - 3) - Math.abs(a[1] - 3));
                // Pick one of the top 3 most extreme traits randomly
                const focusTrait = getRandom(traits.slice(0, 3)); // Get random from top 3 extremes
                if (focusTrait) {
                    const traitName = focusTrait[0];
                    const template = getRandom(oracleReadings.focusAreas.traitBased);
                    // Escape trait name before inserting into template
                    focusText = template.replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`);
                }
            }
            // Fallback to style-based or general if trait focus wasn't selected/possible
            if (!focusText && hasStyle && focusTypeRoll < 0.8 && Array.isArray(oracleReadings.focusAreas?.styleBased)) { // 30% chance if style exists
                const template = getRandom(oracleReadings.focusAreas.styleBased);
                 // Escape style name before inserting
                focusText = template.replace('{styleName}', `<em>${escapeHTML(person.style)}</em>`);
            }
            // Final fallback to general focus area
            if (!focusText && Array.isArray(oracleReadings.focusAreas?.general)) {
                focusText = getRandom(oracleReadings.focusAreas.general);
            }

            // Escape the final focus text (unless it was already structured with HTML)
            reading.focus = focusText.includes('<strong>') || focusText.includes('<em>')
                ? focusText
                : (focusText || "Inner reflection and presence."); // Default focus if none selected

            return reading;
        } catch (error) {
            console.error("[GET_ORACLE_READING] Error during generation:", error);
            return null; // Return null on error
        }
    }


   // --- Achievement Checkers ---

   checkGoalStreak(person) {
        // Checks if the last 3 completed goals were within 7 days
        if (!person?.goals) return;

        // Filter completed goals with valid dates and sort descending by completion date
        const completedGoals = person.goals
            .filter(g => g.done && g.completedAt && !isNaN(new Date(g.completedAt).getTime()))
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        if (completedGoals.length < 3) return; // Need at least 3 completed goals

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Check if the 3 most recent completions are within the last 7 days
        const recentCompletions = completedGoals.slice(0, 3).filter(g => new Date(g.completedAt) >= sevenDaysAgo);

        if (recentCompletions.length >= 3) {
            console.log(`[ACHIEVEMENT_CHECK] Goal streak condition met for ${person.name}`);
            // Grant achievement (pass save function)
            grantAchievement(person, 'goal_streak_3', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    }

   checkTraitTransformation(person, currentSnapshot) {
        // Checks if any trait increased by 2+ points since the last snapshot
        if (!Array.isArray(person?.history) || person.history.length === 0 || !currentSnapshot?.traits) return;

        // Get the most recent snapshot from history (before the current one was added)
        const previousSnapshot = person.history[person.history.length - 1];
        if (!previousSnapshot?.traits) return; // No previous traits to compare against

        let transformed = false;
        // Compare current traits to previous snapshot
        for (const traitName in currentSnapshot.traits) {
            if (previousSnapshot.traits.hasOwnProperty(traitName)) {
                const currentScore = parseInt(currentSnapshot.traits[traitName], 10);
                const previousScore = parseInt(previousSnapshot.traits[traitName], 10);
                // Check if score increased by 2 or more
                if (!isNaN(currentScore) && !isNaN(previousScore) && (currentScore - previousScore >= 2)) {
                    transformed = true;
                    break; // Found one transformation, no need to check others
                }
            }
        }

        if (transformed) {
             console.log(`[ACHIEVEMENT_CHECK] Trait transformation condition met for ${person.name}`);
             // Grant achievement (pass save function)
             grantAchievement(person, 'trait_transformer', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    }

   checkConsistentSnapper(person, currentTimestamp) {
       // Checks if the time since the last snapshot is >= 3 days
        if (!Array.isArray(person?.history) || person.history.length === 0) return; // Needs previous history

        // Get the timestamp of the *previous* snapshot
        const previousSnapshot = person.history[person.history.length - 1];
        if (!previousSnapshot?.timestamp) return; // Needs previous timestamp

        try {
            const prevTime = new Date(previousSnapshot.timestamp);
            const currentTime = new Date(currentTimestamp);
            // Validate dates
            if (isNaN(prevTime.getTime()) || isNaN(currentTime.getTime())) return;

            // Calculate difference in days
            const daysDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60 * 24);

            if (daysDiff >= 3) {
                 console.log(`[ACHIEVEMENT_CHECK] Consistent snapper condition met for ${person.name}`);
                 // Grant achievement (pass save function)
                 grantAchievement(person, 'consistent_snapper', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
            }
        } catch (dateError) {
            console.error("[CONSISTENT_SNAP_CHECK] Error processing timestamps:", dateError);
        }
    }

    // --- Notification Helper ---
    showNotification(message, type = 'info', duration = 4000, details = null) {
        // Ensure notification area exists
        const notificationElement = this.elements.notificationArea || this.createNotificationElement();
        if (!notificationElement) {
             console.error("[NOTIFICATION] Notification area element is missing, cannot show message:", message);
             return; // Cannot show notification if element doesn't exist
        }

        console.log(`[NOTIFICATION] Type: ${type}, Msg: ${message}`, details || '');

        // Set class for styling based on type
        notificationElement.className = `notification-${type}`;
        // Set message content securely using textContent
        notificationElement.textContent = message; // Avoid escapeHTML here as it's for internal messages
        notificationElement.style.opacity = '1'; // Fade in
        notificationElement.style.transform = 'translate(-50%, 0)'; // Move into view
        notificationElement.style.top = '70px'; // Position from top
        notificationElement.setAttribute('aria-hidden', 'false'); // Make visible to screen readers
        // Set appropriate ARIA role for live region based on severity
        notificationElement.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');

        // Clear any existing timer
        if (this.notificationTimer) clearTimeout(this.notificationTimer);

        // Set timer to hide notification
        this.notificationTimer = setTimeout(() => {
            if (notificationElement) { // Check if element still exists
                notificationElement.style.opacity = '0';
                notificationElement.style.transform = 'translate(-50%, -20px)'; // Move up slightly
                notificationElement.style.top = '20px'; // Reset top position
                notificationElement.setAttribute('aria-hidden', 'true'); // Hide from screen readers
            }
            this.notificationTimer = null; // Clear timer reference
        }, duration);
    }

    createNotificationElement() {
        // Creates the notification div if it doesn't exist
        let notificationArea = document.getElementById('app-notification');
        if (notificationArea) return notificationArea; // Already exists

        try {
            console.log("[CREATE_NOTIFICATION_ELEMENT] Creating notification area.");
            const div = document.createElement('div');
            div.id = 'app-notification';
            div.setAttribute('role', 'status'); // Default role
            div.setAttribute('aria-live', 'assertive'); // Announce changes immediately
            div.setAttribute('aria-hidden', 'true'); // Start hidden
            // Apply initial styles (match CSS)
            div.style.opacity = '0';
            div.style.top = '20px';
            // Explicitly set required styles from CSS in case CSS hasn't loaded/applied yet
            div.style.position = 'fixed';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.padding = '12px 25px';
            div.style.borderRadius = '8px';
            div.style.zIndex = '2000';
            div.style.transition = 'opacity 0.5s ease, top 0.5s ease, transform 0.5s ease, background-color 0.3s ease, color 0.3s ease';
            div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            div.style.fontSize = '0.95em';
            div.style.textAlign = 'center';
            div.style.pointerEvents = 'none';
            div.style.maxWidth = '80%';

            document.body.appendChild(div);
            this.elements.notificationArea = div; // Store reference
            return div;
        } catch (error) {
            console.error("[CREATE_NOTIFICATION_ELEMENT] Failed:", error);
            return null; // Return null if creation failed
        }
    }

} // <<< --- END OF TrackerApp CLASS --- >>>

// --- Initialization ---
try {
    const initializeApp = () => {
        console.log("[INIT] Initializing KinkCompass App...");
        // Ensure the class is attached to window for potential debugging/access
        window.kinkCompassApp = new TrackerApp();
        console.log("[INIT] KinkCompass App Initialized on window.kinkCompassApp");
    };

    // Wait for DOM content to be loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM already loaded
        initializeApp();
    }
} catch (error) {
    // Catch fatal errors during initialization phase
    console.error("[INIT] FATAL error during App initialization:", error);
    // Display a visible error message to the user as a fallback
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    // Use escapeHTML safely on error properties
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>Message: ${escapeHTML(error.message)}<br><br>Stack Trace:<br>${escapeHTML(error.stack || 'Not available')}<br><br>Check console (F12). Clear localStorage or import backup if needed.`;
    // Ensure body exists before prepending
    const prependError = () => document.body ? document.body.prepend(errorDiv) : setTimeout(prependError, 50);
    prependError();
}
