// === app.js === (Version 2.8.8 - Consolidated Structure - Revised & Enhanced) ===

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
    sfStyleIcons,
    // Import the new suggestion structures
    subStyleSuggestions,
    domStyleSuggestions
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
    getFlairForScore,
    // Import new utils
    generateSimpleId,
    debounce
} from './utils.js';

// Ensure Chart.js and Confetti are loaded (via CDN in HTML)
// Add checks for their existence if needed
if (typeof Chart === 'undefined') console.error("Chart.js not loaded!");
if (typeof confetti === 'undefined') console.warn("Confetti library not loaded.");


class TrackerApp {
  constructor() {
    console.log("[CONSTRUCTOR] STARTING KinkCompass App (v2.8.8 - Revised)...");
    this.people = [];
    this.previewPerson = null; // Holds data for live preview rendering
    this.currentEditId = null; // ID of the persona being edited
    this.chartInstance = null; // Holds the Chart.js instance for history
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-traits-breakdown'; // Default tab
    this.elementThatOpenedModal = null; // For focus management
    this.lastSavedId = null; // ID of the last saved/edited persona for highlighting
    this.isSaving = false; // Flag to prevent double-saves

    // --- Style Finder State ---
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} };
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false;
    this.previousScores = null;
    this.styleFinderTraits = []; // Current set of traits for the SF quiz
    this.traitFootnotes = {}; // Footnotes for current SF traits
    this.sliderDescriptions = {}; // Descriptions for current SF traits
    this.sfSliderInteracted = false; // Track if user moved the slider on a step

    // Debounced search handlers
    this.debouncedGlossarySearch = debounce(this.filterGlossary, 300);
    this.debouncedStyleDiscoverySearch = debounce(this.filterStyleDiscovery, 300);

    console.log("[CONSTRUCTOR] Mapping elements...");
    this.elements = this.mapElements();
    console.log(`[CONSTRUCTOR] Elements mapped.`);

    // Critical element checks
    if (!this.elements.role || !this.elements.style || !this.elements.traitsContainer || !this.elements.peopleList || !this.elements.formSection) {
        console.error("[CONSTRUCTOR] CRITICAL ERROR: Missing core UI elements. App cannot function.");
        alert("App critical error: Missing core UI elements (role, style, traits, list, form). Please check index.html or reload.");
        // Optionally disable UI or show a permanent error message
        return; // Stop initialization
    }
    if (!this.elements.sfModal || !this.elements.sfStepContent) {
        console.warn("[CONSTRUCTOR] Style Finder UI elements missing. Style Finder feature may be disabled.");
        // Optionally disable SF trigger buttons
    }

    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners();
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and initial render...");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value); // Initial render based on default role
    this.renderTraits(this.elements.role.value, ''); // Render initial traits
    this.renderList();
    this.updateLivePreview(); // Includes daily challenge display
    this.checkAndShowWelcome();
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Element Mapping ---
  mapElements() {
    // Helper to get element by ID, warns if not found
    const get = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn(`[MAP_ELEMENTS] Element with ID '${id}' not found.`);
        return el;
    };
    // Helper for querySelector, warns if not found
    const query = (selector) => {
        const el = document.querySelector(selector);
        if (!el) console.warn(`[MAP_ELEMENTS] Element with selector '${selector}' not found.`);
        return el;
    };

    return {
        // Core Form
        formSection: get('form-section'),
        mainForm: query('#form-section form'), // Specific form element
        formTitle: get('form-title'),
        name: get('name'),
        avatarDisplay: get('avatar-display'),
        avatarInput: get('avatar-input'),
        avatarPicker: query('.avatar-picker'), // Use querySelector for class
        role: get('role'),
        style: get('style'),
        styleExploreLink: get('style-explore-link'),
        formStyleFinderLink: get('form-style-finder-link'),
        traitsContainer: get('traits-container'),
        traitsMessage: get('traits-message'),
        save: get('save'),
        saveSpinner: query('#save .spinner'), // Spinner inside save button
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
        styleDiscoverySearchInput: get('style-discovery-search-input'), // Search input

        achievementsBtn: get('achievements-btn'),
        achievementsModal: get('achievements-modal'),
        achievementsClose: get('achievements-close'),
        achievementsBody: get('achievements-body'),

        glossaryBtn: get('glossary-btn'),
        glossaryModal: get('glossary-modal'),
        glossaryClose: get('glossary-close'),
        glossaryBody: get('glossary-body'),
        glossarySearchInput: get('glossary-search-input'), // Search input
        glossarySearchClear: get('glossary-search-clear'), // Clear button

        resourcesBtn: get('resources-btn'),
        resourcesModal: get('resources-modal'),
        resourcesClose: get('resources-close'),
        resourcesBody: get('resources-body'),

        themesBtn: get('themes-btn'),
        themesModal: get('themes-modal'),
        themesClose: get('themes-close'),
        themesBody: get('themes-body'),

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
        sfProgressBarContainer: get('sf-progress-bar-container'), // Progress bar container
        sfProgressBar: get('sf-progress-bar'), // Progress bar itself
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
        const data = localStorage.getItem('kinkCompassPeople_v2'); // Added version suffix
        if (data) {
            const parsedData = JSON.parse(data);
            // Basic validation of loaded data
            if (Array.isArray(parsedData)) {
                this.people = parsedData;
                 console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
                 // Data sanitization/migration
                 this.people.forEach((p, index) => {
                     // Ensure required fields exist
                     if (!p.id) p.id = generateSimpleId() + `_${index}`; // Generate ID if missing
                     if (!p.name) p.name = `Persona ${p.id.substring(0, 4)}`; // Default name if missing
                     if (!p.role) p.role = 'submissive'; // Default role
                     if (!p.style) p.style = ''; // Default style
                     if (!p.avatar) p.avatar = '❓'; // Default avatar
                     if (typeof p.traits !== 'object' || p.traits === null) p.traits = {};
                     if (!Array.isArray(p.achievements)) p.achievements = [];
                     if (!Array.isArray(p.goals)) p.goals = [];
                     if (!Array.isArray(p.history)) p.history = [];
                     if (p.reflections === undefined) p.reflections = "";
                     // Add any future migration logic here
                 });
            } else {
                 console.warn("[LOAD_STORAGE] Invalid data format found in localStorage. Starting fresh.");
                 this.people = [];
            }
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
    // Debounce saving slightly to prevent rapid writes during multiple updates
    // (e.g., granting achievement + goal completion at once)
    if (this.saveTimeout) clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
        console.log("[SAVE_STORAGE] Saving personas.");
        try {
            localStorage.setItem('kinkCompassPeople_v2', JSON.stringify(this.people));
            console.log(`[SAVE_STORAGE] Saved ${this.people.length} personas.`);
        } catch (error) {
            console.error("[SAVE_STORAGE] Error saving data:", error);
            // Consider more robust error handling, maybe retry or notify user persistently
             if (error.name === 'QuotaExceededError') {
                 this.showNotification("Save failed: Storage limit exceeded. Please export data and remove some personas.", "error", 10000);
             } else {
                 this.showNotification("Error saving data. Changes might be lost.", "error", 5000);
             }
        }
        this.saveTimeout = null;
    }, 100); // 100ms debounce delay
  }

  // --- Onboarding ---
  checkAndShowWelcome() {
    console.log("[WELCOME] Checking for first visit.");
    // Updated version flag
    if (!localStorage.getItem('kinkCompassWelcomed_v2_8_8')) {
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
        // Use try-catch for localStorage operations
        try {
            localStorage.setItem('kinkCompassWelcomed_v2_8_8', 'true'); // Set version-specific flag
            console.log("[WELCOME] Welcome flag set for v2.8.8.");
        } catch (e) {
             console.error("[WELCOME] Failed to set welcome flag in localStorage:", e);
             // Non-critical error, app can continue
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
            // Use bind to ensure 'this' refers to the TrackerApp instance inside the handler
            element.addEventListener(event, handler.bind(this), options);
            // console.log(`  [LISTENER ADDED] 👍 ${elementName} - ${event}`); // Verbose logging
        } else {
            // Log missing elements that are expected to exist
            if (!['glossarySearchInput', 'glossarySearchClear', 'styleDiscoverySearchInput'].includes(elementName)) { // Don't warn for optional elements yet
                 console.warn(`  [LISTENER FAILED] ❓ Expected element not found for: ${elementName}`);
            }
        }
    };

    // Form Interactions
    safeAddListener(this.elements.mainForm, 'submit', (e) => e.preventDefault(), 'mainForm submit'); // Prevent default form submission

    safeAddListener(this.elements.role, 'change', (e) => {
        console.log("[EVENT] Role changed");
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, ''); // Clear style traits on role change
        if(this.elements.style) this.elements.style.value = ''; // Reset style dropdown
        this.updateLivePreview();
        this.updateStyleExploreLink(); // Update link based on new role
    }, 'role');

    safeAddListener(this.elements.style, 'change', (e) => {
        console.log("[EVENT] Style changed");
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink(); // Update link based on selected style
    }, 'style');

    safeAddListener(this.elements.name, 'input', this.updateLivePreview, 'name');
    safeAddListener(this.elements.save, 'click', this.savePerson, 'save'); // Save button triggers savePerson
    safeAddListener(this.elements.clearForm, 'click', () => this.resetForm(true), 'clearForm'); // Pass true for manual clear

    // Avatar Picker (Delegated)
    safeAddListener(this.elements.avatarPicker, 'click', (e) => {
        const button = e.target.closest('.avatar-btn');
        if (button) {
            console.log("[EVENT] Avatar clicked");
            const emoji = button.dataset.emoji;
            if (emoji && this.elements.avatarInput && this.elements.avatarDisplay) {
                this.elements.avatarInput.value = emoji;
                this.elements.avatarDisplay.textContent = emoji;
                // Update visual selection
                this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
                this.updateLivePreview();
            }
        }
    }, 'avatarPicker');

    // Trait Interactions (Delegated)
    safeAddListener(this.elements.traitsContainer, 'input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e); // Pass the event object
            this.updateLivePreview();
        }
    }, 'traitsContainer input');

    safeAddListener(this.elements.traitsContainer, 'click', (e) => {
         const infoButton = e.target.closest('.trait-info-btn');
        if (infoButton) {
            console.log("[EVENT] Trait info clicked");
            this.handleTraitInfoClick(e, infoButton); // Pass event and the button itself
        }
    }, 'traitsContainer click');

    // Popups & Context Help (Delegated)
    safeAddListener(this.elements.formStyleFinderLink, 'click', this.sfStart, 'formStyleFinderLink');
    safeAddListener(document.body, 'click', (e) => { // Delegate from body
        const helpButton = e.target.closest('.context-help-btn');
        if (helpButton) {
            console.log("[EVENT] Context help clicked");
            const key = helpButton.dataset.helpKey;
            if(key) this.showContextHelp(key, helpButton); // Pass button for ARIA handling
        }
        // Close SF popups if clicking outside them
        if (!e.target.closest('.sf-style-info-popup') && !e.target.closest('.sf-info-icon')) {
             this.sfCloseAllPopups();
        }
    }, 'body context-help / popup close');
    safeAddListener(this.elements.traitInfoClose, 'click', this.hideTraitInfo, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', this.hideContextHelp, 'contextHelpClose');

    // Persona List Interactions (Delegated)
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
        // Ensure button exists before adding listener
        if(item.button){
             safeAddListener(item.button, 'click', () => {
                console.log(`[EVENT] Close clicked for ${item.name}`);
                this.closeModal(item.modal);
            }, `${item.name} Close`);
        } else {
            console.warn(`[LISTENER SETUP] Close button for modal '${item.name}' not found.`);
        }
    });

    // Header Button Actions
    safeAddListener(this.elements.resourcesBtn, 'click', () => {
        console.log("[EVENT] Resources clicked");
        grantAchievement({}, 'resource_reader', this.showNotification.bind(this));
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
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => this.renderStyleDiscoveryContent(), 'styleDiscoveryRoleFilter'); // No arg needed
    safeAddListener(this.elements.styleDiscoverySearchInput, 'input', (e) => this.debouncedStyleDiscoverySearch(e.target.value), 'styleDiscoverySearchInput');
    safeAddListener(this.elements.glossarySearchInput, 'input', (e) => this.debouncedGlossarySearch(e.target.value), 'glossarySearchInput');
    safeAddListener(this.elements.glossarySearchClear, 'click', this.clearGlossarySearch, 'glossarySearchClear');

    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody click'); // Detail modal interactions (clicks only now)
    // Removed keydown listener for modal body
    safeAddListener(this.elements.modalBody, 'submit', this.handleModalBodyClick, 'modalBody submit'); // Capture form submit within modal
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs'); // Detail modal tab navigation

    // Glossary Link Handling (delegated from body and glossary modal)
    safeAddListener(this.elements.glossaryBody, 'click', this.handleGlossaryLinkClick, 'glossaryBody link');
    safeAddListener(document.body, 'click', this.handleGlossaryLinkClick, 'body glossaryLink'); // For links outside glossary modal

    // Style Explore Link
    safeAddListener(this.elements.styleExploreLink, 'click', this.handleExploreStyleLinkClick, 'styleExploreLink');

    // Style Finder Interactions (delegated)
    safeAddListener(this.elements.sfStepContent, 'click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const action = button.dataset.action;
            if (action) {
                console.log(`[EVENT] SF button action: ${action}`);
                // Pass dataset and the element that was clicked
                this.handleStyleFinderAction(action, button.dataset, button);
            } else if (button.classList.contains('sf-info-icon')) {
                console.log("[EVENT] SF trait info clicked");
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
    // Window click listener handled by body delegation above

    console.log("[ADD_LISTENERS] Listener setup COMPLETE.");
} // --- End addEventListeners ---


  // --- Event Handlers ---

  handleListClick(e) {
    const target = e.target;
    const listItem = target.closest('li'); // Find the parent list item
    if (!listItem || !listItem.dataset.id) return; // Exit if click wasn't on a valid item part

    const personId = listItem.dataset.id;

    if (target.closest('.person-info')) { // Clicked on the main info area
      console.log(`[EVENT] View details clicked for ID: ${personId}`);
      this.showPersonDetails(personId);
    } else if (target.closest('.edit-btn')) { // Clicked Edit button
      console.log(`[EVENT] Edit clicked for ID: ${personId}`);
      e.stopPropagation(); // Prevent triggering view details too
      this.editPerson(personId);
    } else if (target.closest('.delete-btn')) { // Clicked Delete button
      console.log(`[EVENT] Delete clicked for ID: ${personId}`);
      e.stopPropagation(); // Prevent triggering view details too
      this.deletePerson(personId);
    }
}

  handleListKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target;
          const listItem = target.closest('li');
          if (!listItem || !listItem.dataset.id) return;

          e.preventDefault(); // Prevent default space bar scroll or enter submit

          const personId = listItem.dataset.id;

          if (target.closest('.person-info')) {
               this.showPersonDetails(personId);
          } else if (target.closest('.edit-btn')) {
               this.editPerson(personId);
          } else if (target.closest('.delete-btn')) {
               this.deletePerson(personId);
          }
      }
  }

  // Close popups with Escape key
  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log("[EVENT] Escape key pressed");
          // Close open modals first (highest priority)
          const openModal = document.querySelector('.modal[aria-hidden="false"]');
          if (openModal && openModal.id !== 'sf-modal') { // Don't close SF modal with Esc easily? Or allow? Let's allow for now.
              console.log(`[ESC] Closing modal: #${openModal.id}`);
              this.closeModal(openModal);
              return; // Only close one thing per Escape press
          }
          // Close SF popups if any are open
          if (this.sfCloseAllPopups()) return;

          // Close trait/context popups
          if (this.elements.traitInfoPopup?.style.display !== 'none') {
              console.log("[ESC] Closing trait info popup");
              this.hideTraitInfo();
              return;
          }
          if (this.elements.contextHelpPopup?.style.display !== 'none') {
              console.log("[ESC] Closing context help popup");
              this.hideContextHelp();
              return;
          }
      }
  }

  // Handle clicks potentially outside of interactive elements (e.g., to close popups - handled by body delegate now)
  // handleWindowClick(e) { } // No longer needed directly

  handleTraitSliderInput(e) {
    const slider = e.target;
    const valueDisplay = slider.nextElementSibling; // Assumes value span is next sibling
    if (valueDisplay && valueDisplay.classList.contains('trait-value')) {
      valueDisplay.textContent = slider.value;
      this.updateTraitDescription(slider); // Update text description
    }
  }

  handleTraitInfoClick(e, button) {
      e.preventDefault();
      // const button = e.target.closest('.trait-info-btn'); // Already passed in
      if (!button) return;
      const traitName = button.dataset.traitName;
      if (traitName) {
           this.showTraitInfo(traitName, button); // Pass button as trigger element
      }
  }

  // Consolidated handler for clicks/submits within the detail modal body
  handleModalBodyClick(e) {
      const target = e.target;
      const personId = this.elements.modal?.dataset.personId; // Get person ID from modal data attribute

      if (!personId) {
          console.warn("[handleModalBodyClick] No person ID found on modal.");
          return;
      }

      // --- Goal Actions ---
      if (target.closest('.goal-toggle-btn')) {
          e.preventDefault();
          const button = target.closest('.goal-toggle-btn');
          const goalId = button.dataset.goalId;
          const listItem = button.closest('li'); // Get the li for animation
          if (goalId) {
              console.log(`[EVENT] Toggle goal clicked: Person ${personId}, Goal ${goalId}`);
              this.toggleGoalStatus(personId, goalId, listItem);
          }
      } else if (target.closest('.goal-delete-btn')) {
           e.preventDefault();
           const button = target.closest('.goal-delete-btn');
           const goalId = button.dataset.goalId;
           if (goalId && confirm(`Are you sure you want to delete this goal?`)) {
               console.log(`[EVENT] Delete goal clicked: Person ${personId}, Goal ${goalId}`);
               this.deleteGoal(personId, goalId);
           }
      } else if (e.type === 'submit' && target.closest('#add-goal-form')) {
           e.preventDefault();
           console.log(`[EVENT] Add goal form submitted for Person ${personId}`);
           this.addGoal(personId, target.closest('#add-goal-form'));
      }
      // --- Journal Actions ---
      else if (target.closest('#journal-prompt-btn')) {
           e.preventDefault();
           console.log(`[EVENT] Journal prompt requested for Person ${personId}`);
           this.showJournalPrompt(personId);
      } else if (target.closest('#save-reflections-btn')) {
           e.preventDefault();
           console.log(`[EVENT] Save reflections clicked for Person ${personId}`);
           this.saveReflections(personId);
      }
      // --- History Actions ---
      else if (target.closest('#snapshot-btn')) {
           e.preventDefault();
           console.log(`[EVENT] Take snapshot clicked for Person ${personId}`);
           this.addSnapshotToHistory(personId);
      }
      // --- Insights Actions ---
       else if (target.closest('#oracle-btn')) {
           e.preventDefault();
           console.log(`[EVENT] Oracle consult clicked for Person ${personId}`);
           this.showKinkOracle(personId);
      }
      // Add other modal body interactions here (e.g., snapshot toggle is handled by inline onclick for now)
  }

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button && button.dataset.theme) {
          const themeName = button.dataset.theme;
          console.log(`[EVENT] Theme selected: ${themeName}`);
          this.setTheme(themeName);
          // Optionally close the modal after selection
          // this.closeModal(this.elements.themesModal);
      }
  }

  // Central handler for Style Finder button actions
  handleStyleFinderAction(action, dataset = {}, triggerElement = null) {
        switch (action) {
            case 'setRole':
                if (dataset.role) this.sfSetRole(dataset.role);
                break;
            case 'next':
                const currentTrait = dataset.currenttrait; // Get trait name from button data
                this.sfNextStep(currentTrait); // Pass trait name for validation
                break;
            case 'prev':
                this.sfPrevStep();
                break;
            case 'startOver':
                this.sfStartOver();
                break;
            case 'confirmApply': // Renamed from applyResult for clarity
                 if (dataset.role && dataset.style) {
                     this.confirmApplyStyleFinderResult(dataset.role, dataset.style);
                 } else {
                      console.warn("[SF ACTION] Missing role/style data for confirmApply action.");
                      this.sfShowFeedback("Error: Could not apply result.", "error");
                 }
                 break;
             case 'showDetails': // Action for showing details popup from results
                 if (dataset.style) {
                     this.sfShowFullDetails(dataset.style, triggerElement); // Pass trigger
                 }
                 break;
            default:
                console.warn(`[SF ACTION] Unknown action: ${action}`);
        }
    }

  // Handler for Style Finder slider input
  handleStyleFinderSliderInput(sliderElement) {
        if (!sliderElement || !sliderElement.dataset.trait) return;
        const traitName = sliderElement.dataset.trait;
        const value = sliderElement.value;
        this.sfSetTrait(traitName, value);

        // Update slider description text
        const descElement = document.getElementById(`sf-desc-${traitName}`);
        if (descElement && this.sliderDescriptions[traitName]) {
             const descArray = this.sliderDescriptions[traitName];
             const descText = descArray[value - 1] || `Value: ${value}`; // Fallback
             descElement.textContent = escapeHTML(descText);
        }

        // Update the live dashboard
         this.sfUpdateDashboard();

         // Mark that the slider has been interacted with for this step
         this.sfSliderInteracted = true;
    }

  // Handler for Detail Modal Tab clicks
  handleDetailTabClick(e) {
        const link = e.target.closest('.tab-link');
        if (link && link.dataset.tabId) {
             e.preventDefault();
             const newTabId = link.dataset.tabId;
             const personId = this.elements.modal?.dataset.personId;

             if (!personId) return;
             const person = this.people.find(p => p.id === personId);
             if (!person) return;

             console.log(`[EVENT] Detail tab clicked: ${newTabId}`);

             // Remove active class from all tabs and content panes
             this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
             this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

             // Add active class to the clicked tab and corresponding content pane
             link.classList.add('active');
             const contentPane = document.getElementById(newTabId);
             if (contentPane) {
                 contentPane.classList.add('active');
                 this.activeDetailModalTab = newTabId; // Store active tab

                 // Special rendering/actions needed when a tab becomes active
                  if (newTabId === 'tab-history' && this.chartInstance) {
                     // Ensure chart resizes correctly if modal was hidden/resized
                     this.chartInstance.resize();
                 }
                 // If Insights tab is clicked, maybe refresh Oracle/Challenge?
                 if (newTabId === 'tab-insights') {
                     this.displayDailyChallenge(person); // Display challenge relevant to person
                     // Oracle is usually triggered by button, but could auto-refresh here if desired
                 }

             } else {
                 console.warn(`Content pane not found for tab ID: ${newTabId}`);
             }
        }
    }

   // Handle clicks on glossary links within content or glossary modal
   handleGlossaryLinkClick(e) {
        const link = e.target.closest('a.glossary-link');
        if (link && link.dataset.termKey) {
             e.preventDefault();
             const termKey = link.dataset.termKey;
             console.log(`[EVENT] Glossary link clicked for key: ${termKey}`);
             // Ensure glossary modal is open, then highlight
             if (!this.elements.glossaryModal || this.elements.glossaryModal.style.display === 'none') {
                 this.showGlossary(termKey); // Open modal and highlight
             } else {
                 // Modal already open, just scroll and highlight
                 const element = document.getElementById(`glossary-${termKey}`);
                 if (element) {
                     element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                     element.classList.add('highlighted-term');
                     setTimeout(() => element.classList.remove('highlighted-term'), 2500);
                 } else {
                     console.warn(`[handleGlossaryLinkClick] Element ID not found for highlighting: glossary-${termKey}`);
                 }
             }
        }
    }

   // Handle click on the "Explore Details" link in the form
   handleExploreStyleLinkClick(e) {
       e.preventDefault();
       const styleName = this.elements.style?.value; // Get selected style name
       if (styleName) {
           console.log(`[EVENT] Explore style link clicked for: ${styleName}`);
           // Open Style Discovery modal and highlight the style
           this.showStyleDiscovery(styleName);
       } else {
           console.warn("[EVENT] Explore style link clicked, but no style selected.");
           // Optionally open Style Discovery without highlighting
           this.showStyleDiscovery();
       }
   }


  // --- Core Rendering ---

  renderStyles(roleKey) {
    console.log(`[RENDER] Rendering styles for role: ${roleKey}`);
    if (!this.elements.style) {
        console.error("[RENDER_STYLES] Style select element not found.");
        return;
    }
    const styles = bdsmData[roleKey]?.styles || [];
    // Keep the first option "-- Select --" or similar
    this.elements.style.innerHTML = `<option value="">-- Select Style --</option>`; // Default empty option

    styles.forEach(style => {
      // Add normalized key as data attribute if needed later
      // const normalized = normalizeStyleKey(style.name);
      this.elements.style.innerHTML += `<option value="${escapeHTML(style.name)}">${escapeHTML(style.name)}</option>`;
    });
    console.log(`[RENDER] Rendered ${styles.length} styles.`);
    this.updateStyleExploreLink(); // Update link initially (no style selected yet)
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
        const addedTraitNames = new Set(); // Prevent duplicates

        // 1. Add Core Traits for the Role
        if (roleData.coreTraits) {
            roleData.coreTraits.forEach(trait => {
                if (!addedTraitNames.has(trait.name)) {
                    traitsToRender.push(trait);
                    addedTraitNames.add(trait.name);
                }
            });
        }

        // 2. Add Style-Specific Traits (if a style is selected)
        const normalizedStyle = normalizeStyleKey(styleName);
        if (normalizedStyle && roleData.styles) {
            const styleData = roleData.styles.find(s => normalizeStyleKey(s.name) === normalizedStyle);
            if (styleData?.traits) {
                styleData.traits.forEach(trait => {
                    if (!addedTraitNames.has(trait.name)) {
                        traitsToRender.push(trait);
                        addedTraitNames.add(trait.name);
                    }
                });
            }
        }

        // Sort traits alphabetically by name for consistent order
        traitsToRender.sort((a, b) => a.name.localeCompare(b.name));

        // Render HTML
        if (traitsToRender.length > 0) {
            // Get current values if editing, otherwise default to 3
            const currentTraits = this.currentEditId
                ? this.people.find(p => p.id === this.currentEditId)?.traits
                : (this.previewPerson?.traits || {}); // Use preview if creating new

            let traitsHTML = '';
            traitsToRender.forEach(trait => {
                const currentValue = currentTraits?.[trait.name] ?? 3; // Default to 3 if not found
                traitsHTML += this.createTraitHTML(trait, currentValue);
            });
            this.elements.traitsContainer.innerHTML = traitsHTML;
            this.elements.traitsContainer.style.display = 'block';
            this.elements.traitsMessage.style.display = 'none';
             // Add initial descriptions for sliders
             this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                 this.updateTraitDescription(slider);
             });
        } else {
            // No traits for this combo, or only role selected
             const message = styleName
                 ? `<p class="muted-text">No specific traits defined for the '${escapeHTML(styleName)}' style. Focus on the core role traits!</p>`
                 : `<p class="muted-text">Select a Style above to see style-specific traits, or focus on core role traits.</p>`;
             this.elements.traitsContainer.innerHTML = message; // Show message in container
             this.elements.traitsContainer.style.display = 'block';
             this.elements.traitsMessage.style.display = 'none'; // Keep message hidden
        }
        console.log(`[RENDER] Rendered ${traitsToRender.length} traits.`);
    }

  // Generates HTML for a single trait slider and description
  createTraitHTML(trait, value = 3) {
      if (!trait || !trait.name || !trait.desc || !trait.explanation) {
           console.warn("[CREATE_TRAIT_HTML] Invalid trait data received:", trait);
           return ''; // Return empty string for invalid data
      }
      const escapedName = escapeHTML(trait.name);
      const uniqueId = `trait-${escapedName}-${generateSimpleId()}`; // Ensure unique ID for label/input linking

      // Get description for the current value, fallback if needed
      const descriptionText = trait.desc[value] || trait.desc[3] || `Current value: ${value}`;

      return `
        <div class="trait">
            <label for="${uniqueId}" class="trait-label">
                <span>${escapedName.charAt(0).toUpperCase() + escapedName.slice(1)} ${getFlairForScore(value)}</span>
                <button type="button" class="small-btn context-help-btn trait-info-btn" data-trait-name="${escapedName}" aria-label="Info about ${escapedName}" aria-expanded="false">?</button>
            </label>
            <div class="slider-container">
                <input type="range" id="${uniqueId}" class="trait-slider" name="${escapedName}"
                       min="1" max="5" value="${value}" data-trait-name="${escapedName}"
                       aria-describedby="desc-${uniqueId}">
                <span class="trait-value" aria-hidden="true">${value}</span>
            </div>
            <div class="trait-desc" id="desc-${uniqueId}">${escapeHTML(descriptionText)}</div>
        </div>
      `;
  }

  // Updates the descriptive text below a trait slider based on its value
  updateTraitDescription(slider) {
    if (!slider || !slider.dataset.traitName) return;

    const traitName = slider.dataset.traitName;
    const value = slider.value;
    const descElement = document.getElementById(`desc-${slider.id}`); // Use slider's unique ID to find desc
    const labelSpan = slider.closest('.trait')?.querySelector('.trait-label span'); // Find label span

    if (!descElement || !labelSpan) return;

    let traitData = null;
    // Find trait definition in bdsmData (more robust search)
    for (const roleKey in bdsmData) {
        const roleData = bdsmData[roleKey];
        traitData = roleData.coreTraits?.find(t => t.name === traitName) ||
                    roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (traitData) break;
    }

    if (traitData && traitData.desc && traitData.desc[value]) {
        descElement.textContent = escapeHTML(traitData.desc[value]);
        // Update label flair
        labelSpan.textContent = `${traitName.charAt(0).toUpperCase() + traitName.slice(1)} ${getFlairForScore(value)}`;
    } else {
         console.warn(`[UPDATE_TRAIT_DESC] Could not find description for trait '${traitName}' at value ${value}.`);
         descElement.textContent = `Value: ${value}`; // Fallback
         labelSpan.textContent = `${traitName.charAt(0).toUpperCase() + traitName.slice(1)} ${getFlairForScore(value)}`; // Still update flair
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
      this.elements.peopleList.innerHTML = this.people
        .map(person => this.createPersonListItemHTML(person))
        .join('');

      // Highlight the last saved/edited item briefly
      if (this.lastSavedId) {
          const listItem = this.elements.peopleList.querySelector(`li[data-id="${this.lastSavedId}"]`);
          if (listItem) {
               listItem.classList.add('item-just-saved');
               // Remove class after animation finishes
               setTimeout(() => listItem.classList.remove('item-just-saved'), 1500);
          }
          this.lastSavedId = null; // Clear the flag
      }
    }
    console.log(`[RENDER] Rendered ${this.people.length} personas in list.`);
}


  createPersonListItemHTML(person) {
        // Basic check for essential person data
        if (!person || !person.id || !person.name) {
            console.warn("[CREATE_PERSON_ITEM] Invalid person data received:", person);
            return ''; // Return empty string for invalid data
        }

        const escapedName = escapeHTML(person.name);
        const escapedRole = escapeHTML(person.role || 'N/A');
        const escapedStyle = escapeHTML(person.style || 'N/A');
        const avatar = escapeHTML(person.avatar || '❓');
        const achievementCount = person.achievements?.length || 0;
        const achievementPreview = achievementCount > 0 ? `<span class="person-achievements-preview" title="${achievementCount} Achievements">🏆${achievementCount}</span>` : '';

        // Use data-id on the <li> for easier event delegation targeting
        return `
            <li data-id="${person.id}" tabindex="-1"> {/* Make li focusable for keyboard nav if needed, but buttons are primary */}
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
      if (!this.elements.styleExploreLink || !this.elements.style) return;

      const selectedStyleName = this.elements.style.value;
      if (selectedStyleName) {
          this.elements.styleExploreLink.textContent = `(Explore '${escapeHTML(selectedStyleName)}' Details)`;
          this.elements.styleExploreLink.setAttribute('aria-label', `Explore details for the ${escapeHTML(selectedStyleName)} style`);
          this.elements.styleExploreLink.style.display = 'inline'; // Show link
      } else {
           this.elements.styleExploreLink.style.display = 'none'; // Hide link if no style selected
      }
  }


  // --- CRUD Operations ---

  savePerson() {
      console.log(`[SAVE_PERSON] Attempting save. Editing ID: ${this.currentEditId}`);
      if (this.isSaving) {
           console.warn("[SAVE_PERSON] Already saving, preventing double save.");
           return;
      }

      // Basic form validation (HTML5 'required' handles some)
      if (!this.elements.name?.value) {
          this.showNotification("Please enter a name for the persona.", "warning");
          this.elements.name.focus();
          return;
      }
      if (!this.elements.style?.value) {
           this.showNotification("Please select a style for the persona.", "warning");
           this.elements.style.focus();
           return;
      }

      this.isSaving = true;
      this.showLoadingOnSaveButton(true);

      const personData = {
          id: this.currentEditId || generateSimpleId(), // Use existing ID or generate new
          name: this.elements.name.value.trim(),
          avatar: this.elements.avatarInput.value || '❓',
          role: this.elements.role.value,
          style: this.elements.style.value,
          traits: {},
          // Initialize arrays if creating new, otherwise keep existing
          achievements: [],
          goals: [],
          history: [],
          reflections: ""
      };

      // Gather trait scores
      this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
          personData.traits[slider.name] = parseInt(slider.value, 10);
      });

      // Check for max/min trait achievements
      Object.values(personData.traits).forEach(score => {
            if (score === 5) grantAchievement(personData, 'max_trait'); // Grant checks internally if already present
            if (score === 1) grantAchievement(personData, 'min_trait');
      });

      // Simulate save delay for visual feedback (remove in production)
      setTimeout(() => {
        try {
            if (this.currentEditId) {
                // Update existing person
                const index = this.people.findIndex(p => p.id === this.currentEditId);
                if (index !== -1) {
                    // Preserve existing goals, history, achievements, reflections
                    personData.goals = this.people[index].goals || [];
                    personData.history = this.people[index].history || [];
                    personData.achievements = this.people[index].achievements || [];
                    personData.reflections = this.people[index].reflections || "";

                    this.people[index] = personData;
                    console.log(`[SAVE_PERSON] Updated persona ID: ${this.currentEditId}`);
                    grantAchievement(personData, 'profile_edited'); // Grant handles save internally now
                } else {
                    console.error(`[SAVE_PERSON] Edit failed: Persona ID ${this.currentEditId} not found.`);
                    this.showNotification("Error saving: Persona not found.", "error");
                    this.isSaving = false;
                    this.showLoadingOnSaveButton(false);
                    return; // Stop execution
                }
            } else {
                // Add new person
                this.people.push(personData);
                console.log(`[SAVE_PERSON] Added new persona ID: ${personData.id}`);
                grantAchievement(personData, 'profile_created'); // Grant handles save internally now
                if (this.people.length >= 5) {
                    grantAchievement(personData, 'five_profiles');
                }
            }

            this.lastSavedId = personData.id; // Set flag for highlighting
            this.saveToLocalStorage(); // Save the whole array
            this.renderList(); // Update the list display
            this.resetForm(); // Clear the form for the next entry
            this.showNotification("Persona saved successfully!", "success");

        } catch (error) {
             console.error("[SAVE_PERSON] Error during save operation:", error);
             this.showNotification("An error occurred while saving.", "error");
        } finally {
             this.isSaving = false; // Ensure flag is reset
             this.showLoadingOnSaveButton(false);
             console.log("[SAVE_PERSON] Save process finished.");
        }
      }, 300); // End simulated delay
  }


  editPerson(personId) {
      console.log(`[EDIT_PERSON] Loading persona ID: ${personId} into form.`);
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[EDIT_PERSON] Person with ID ${personId} not found.`);
          this.showNotification("Could not find persona to edit.", "error");
          return;
      }

      // --- Populate Form Fields ---
      this.elements.name.value = person.name;
      this.elements.avatarInput.value = person.avatar;
      this.elements.avatarDisplay.textContent = person.avatar;

      // Update avatar picker selection
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
      const avatarButton = this.elements.avatarPicker.querySelector(`.avatar-btn[data-emoji="${person.avatar}"]`);
      if (avatarButton) avatarButton.classList.add('selected');

      this.elements.role.value = person.role;
      this.renderStyles(person.role); // Re-render styles for the role

      // Need a slight delay for style options to populate before setting value
      setTimeout(() => {
         if (this.elements.style) {
             this.elements.style.value = person.style;
             // Now render traits AFTER style is set
             this.renderTraits(person.role, person.style);
             // Update trait sliders with saved values
             if (person.traits) {
                 this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                     if (person.traits.hasOwnProperty(slider.name)) {
                         slider.value = person.traits[slider.name];
                         // Update value display and description
                         const valueDisplay = slider.closest('.trait')?.querySelector('.trait-value');
                         if (valueDisplay) valueDisplay.textContent = slider.value;
                         this.updateTraitDescription(slider);
                     }
                 });
             }
         }
          this.updateLivePreview(); // Update preview with loaded data
          this.updateStyleExploreLink();
      }, 50); // 50ms delay should be sufficient

      // Set current edit ID and update form title
      this.currentEditId = personId;
      if(this.elements.formTitle) this.elements.formTitle.textContent = `✏️ Edit: ${escapeHTML(person.name)} ✨`;
      if(this.elements.save) this.elements.save.textContent = 'Update Persona!💾'; // Change save button text

      // Scroll to form and focus name field
      this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
       setTimeout(() => this.elements.name.focus(), 350); // Delay focus slightly more after scroll

      console.log(`[EDIT_PERSON] Form populated for ${person.name}.`);
  }


  deletePerson(personId) {
      console.log(`[DELETE_PERSON] Attempting to delete persona ID: ${personId}`);
      const personIndex = this.people.findIndex(p => p.id === personId);
      if (personIndex === -1) {
          console.error(`[DELETE_PERSON] Person with ID ${personId} not found.`);
          this.showNotification("Could not find persona to delete.", "error");
          return;
      }

      const personName = this.people[personIndex].name || `Persona ${personId.substring(0,4)}`;

      // Use confirm for simplicity, replace with custom modal ideally
      if (confirm(`Are you sure you want to delete the persona "${escapeHTML(personName)}"? This cannot be undone.`)) {
          console.log(`[DELETE_PERSON] User confirmed deletion for ${personName}.`);
          this.people.splice(personIndex, 1); // Remove the person
          this.saveToLocalStorage(); // Save the updated array
          this.renderList(); // Re-render the list

          // If the deleted persona was being edited, reset the form
          if (this.currentEditId === personId) {
              this.resetForm();
          }
           this.updateLivePreview(); // Clear preview if needed
           this.showNotification(`Persona "${escapeHTML(personName)}" deleted.`, "info");
           console.log(`[DELETE_PERSON] Persona ${personId} deleted successfully.`);
      } else {
          console.log("[DELETE_PERSON] User cancelled deletion.");
      }
  }


  resetForm(isManualClear = false) {
      console.log(`[RESET_FORM] Resetting form. Manual clear: ${isManualClear}`);
      if(this.elements.mainForm) this.elements.mainForm.reset(); // Use form's reset method

      // Reset specific elements not handled by form.reset()
      this.currentEditId = null;
      if(this.elements.avatarInput) this.elements.avatarInput.value = '❓';
      if(this.elements.avatarDisplay) this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker?.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
      this.elements.avatarPicker?.querySelector('.avatar-btn[data-emoji="❓"]')?.classList.add('selected'); // Reselect default

      // Reset role/style dropdowns and re-render traits
      if(this.elements.role) this.elements.role.value = 'submissive'; // Reset to default role
      this.renderStyles('submissive'); // Re-render styles for default role
      if(this.elements.style) this.elements.style.value = ''; // Clear selected style
      this.renderTraits('submissive', ''); // Re-render traits for default role/no style

      // Reset form title and save button text
      if(this.elements.formTitle) this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      if(this.elements.save) {
          // Only change text, don't query for spinner here
          const saveButtonText = this.elements.save.firstChild;
          if (saveButtonText && saveButtonText.nodeType === Node.TEXT_NODE) {
             saveButtonText.textContent = 'Save Persona! 💖 '; // Keep space for spinner
          }
      }
      this.previewPerson = null; // Clear preview data
      this.updateLivePreview(); // Update preview to show default state
       this.updateStyleExploreLink();

      if (isManualClear) {
          this.showNotification("Form cleared.", "info", 2000);
           this.elements.name?.focus(); // Focus name field after manual clear
      }
      console.log("[RESET_FORM] Form reset complete.");
  }

  // Helper to show/hide loading spinner on save button
  showLoadingOnSaveButton(isLoading) {
      if (!this.elements.save || !this.elements.saveSpinner) return;
      this.elements.save.disabled = isLoading;
      this.elements.saveSpinner.style.display = isLoading ? 'inline-block' : 'none';
      // Adjust button text slightly - assumes text node is first child
       const saveButtonText = this.elements.save.firstChild;
       if (saveButtonText && saveButtonText.nodeType === Node.TEXT_NODE) {
           if(isLoading) {
               saveButtonText.textContent = 'Saving... ';
           } else {
                // Reset text based on whether we were editing
                if(this.currentEditId) {
                   saveButtonText.textContent = 'Update Persona!💾 ';
                } else {
                   saveButtonText.textContent = 'Save Persona! 💖 ';
                }
           }
       }
  }

  // --- Live Preview ---
  updateLivePreview() {
    // console.log("[PREVIEW] Updating live preview."); // Can be noisy
    if (!this.elements.livePreview) return;

    const name = this.elements.name?.value.trim() || "Unnamed Persona";
    const role = this.elements.role?.value || "";
    const style = this.elements.style?.value || "";
    const avatar = this.elements.avatarInput?.value || '❓';
    const traits = {};

    this.elements.traitsContainer?.querySelectorAll('.trait-slider').forEach(slider => {
        traits[slider.name] = parseInt(slider.value, 10);
    });

    // Store preview data (useful if saving fails or for immediate use)
    this.previewPerson = { name, role, style, avatar, traits };

    let breakdownHTML = '<p class="muted-text">Select Role & Style for breakdown.</p>';
    let synergyHTML = '';

    if (role && style) {
        let breakdownData;
        if (role === 'submissive' || (role === 'switch' && subStyleSuggestions[normalizeStyleKey(style)])) { // Handle switch if style is submissive
            breakdownData = getSubStyleBreakdown(style, traits);
        } else if (role === 'dominant' || (role === 'switch' && domStyleSuggestions[normalizeStyleKey(style)])) { // Handle switch if style is dominant
            breakdownData = getDomStyleBreakdown(style, traits);
        } else {
             // Generic Switch breakdown or fallback
             breakdownData = { strengths: "Versatile approach developing.", improvements: "Explore both Dominant and Submissive aspects." };
        }

        if (breakdownData) {
             breakdownHTML = `
                 <div class="preview-breakdown">
                     <h4>Strengths:</h4>
                     <p>${breakdownData.strengths}</p>
                     <h4>Growth Areas:</h4>
                     <p>${breakdownData.improvements}</p>
                 </div>
             `;
        }

        // Generate Synergy Hints only if traits are available
        if (Object.keys(traits).length > 0) {
            const hints = findHintsForTraits(traits);
            if (hints.length > 0) {
                 synergyHTML = `
                     <div class="preview-synergy-hint">
                         <strong>Synergy Hint:</strong> ${escapeHTML(hints[0].text)}
                         ${hints.length > 1 ? ` <small>(${hints.length - 1} more...)</small>` : ''}
                     </div>
                 `;
                 // Could cycle through hints or show more in modal
            }
        }
    }

    this.elements.livePreview.innerHTML = `
        <div class="preview-avatar-name">
            <span class="person-avatar">${escapeHTML(avatar)}</span>
            <h3 class="preview-title">${escapeHTML(name)}</h3>
        </div>
        <p class="preview-role-style">${escapeHTML(role)} / ${escapeHTML(style) || 'No Style Selected'}</p>
        ${breakdownHTML}
        ${synergyHTML}
        <div id="daily-challenge-area" role="region" aria-live="polite" aria-labelledby="daily-challenge-title">
             <!-- Daily challenge content injected by displayDailyChallenge -->
        </div>
    `;
    this.displayDailyChallenge(); // Call to display challenge after updating preview structure
}


  // --- Modal Display ---

  showPersonDetails(personId) {
    console.log(`[DETAILS] Showing details for persona ID: ${personId}`);
    const person = this.people.find(p => p.id === personId);
    if (!person) {
      console.error(`[DETAILS] Person with ID ${personId} not found.`);
      this.showNotification("Could not find persona details.", "error");
      return;
    }

    if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs || !this.elements.detailModalTitle) {
        console.error("[DETAILS] Detail modal elements missing.");
        this.showNotification("UI Error: Cannot display details.", "error");
        return;
    }

    // Store person ID on the modal element for easy access in handlers
    this.elements.modal.dataset.personId = personId;

    // --- Set Modal Title ---
    this.elements.detailModalTitle.innerHTML = `
        <span class="person-avatar" aria-hidden="true">${escapeHTML(person.avatar || '❓')}</span>
        ${escapeHTML(person.name)}
        <span class="modal-subtitle">${escapeHTML(person.role)} / ${escapeHTML(person.style)}</span>
    `;

    // --- Define Tabs ---
    const tabs = [
        { id: 'tab-traits-breakdown', label: '🌟 Traits & Style' },
        { id: 'tab-goals-journal', label: '🎯 Goals & Journal' },
        { id: 'tab-history', label: '📊 History' },
        { id: 'tab-insights', label: '💡 Insights' }
    ];

    // --- Render Tabs ---
    this.elements.modalTabs.innerHTML = tabs.map(tab => `
        <button type="button" class="tab-link ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
                role="tab" aria-selected="${tab.id === this.activeDetailModalTab}"
                aria-controls="${tab.id}" data-tab-id="${tab.id}">
            ${escapeHTML(tab.label)}
        </button>
    `).join('');

    // --- Prepare Tab Content Panes ---
    this.elements.modalBody.innerHTML = tabs.map(tab => `
        <div class="tab-content ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
             id="${tab.id}" role="tabpanel" aria-labelledby="tab-label-${tab.id}" tabindex="0">
             <p class="loading-text">Loading ${escapeHTML(tab.label)}...</p>
        </div>
    `).join('');

    // --- Render Content for Active Tab Immediately ---
    this.renderDetailTabContent(person, this.activeDetailModalTab, document.getElementById(this.activeDetailModalTab));

     // --- Pre-render other tabs in background (optional performance boost) ---
     tabs.forEach(tab => {
         if (tab.id !== this.activeDetailModalTab) {
              const contentPane = document.getElementById(tab.id);
              if (contentPane) {
                  // Use requestIdleCallback or setTimeout to avoid blocking UI thread
                   requestAnimationFrame(() => { // Or setTimeout(..., 0)
                      this.renderDetailTabContent(person, tab.id, contentPane);
                   });
              }
         }
     });

    // --- Open Modal ---
    this.openModal(this.elements.modal);
    console.log(`[DETAILS] Modal opened for ${person.name}.`);
}

// Renders content for a specific tab inside the detail modal
renderDetailTabContent(person, tabId, contentElement) {
    if (!person || !tabId || !contentElement) {
        console.warn("[RENDER_TAB] Missing person, tabId, or contentElement for rendering.");
        if(contentElement) contentElement.innerHTML = '<p class="error-text">Error loading content.</p>';
        return;
    }
    console.log(`[RENDER_TAB] Rendering content for Tab ID: ${tabId}`);

    let contentHTML = '';
    try {
        switch (tabId) {
            case 'tab-traits-breakdown':
                contentHTML = this.renderTraitsBreakdownTab(person);
                break;
            case 'tab-goals-journal':
                contentHTML = this.renderGoalsJournalTab(person);
                break;
            case 'tab-history':
                contentHTML = this.renderHistoryTabStructure(person); // Renders container
                break;
            case 'tab-insights':
                contentHTML = this.renderInsightsTab(person);
                break;
            default:
                contentHTML = `<p class="error-text">Unknown tab content: ${escapeHTML(tabId)}</p>`;
        }
        contentElement.innerHTML = contentHTML;

        // Post-render actions for specific tabs
        if (tabId === 'tab-history') {
             this.renderHistoryChart(person, `history-chart-${person.id}`); // Render chart into container
        }
         if (tabId === 'tab-insights') {
              this.displayDailyChallenge(person); // Display challenge relevant to person
         }

    } catch (error) {
         console.error(`[RENDER_TAB] Error rendering content for ${tabId}:`, error);
         contentElement.innerHTML = `<p class="error-text">Error loading content for ${escapeHTML(tabId)}. Check console.</p>`;
    }
}

  // --- Rendering Functions for Merged Tab Sections ---

  renderTraitsBreakdownTab(person) {
    return `
        <section aria-labelledby="trait-details-heading">
             <h3 id="trait-details-heading">Trait Constellation ${getFlairForScore(4)}</h3>
             ${this.renderTraitDetails(person)}
        </section>
        <section aria-labelledby="style-breakdown-heading">
            <h3 id="style-breakdown-heading">Style Spotlight ✨</h3>
            ${this.renderStyleBreakdownDetail(person)}
        </section>
    `;
}

  renderGoalsJournalTab(person) {
      return `
        <section class="goals-section" aria-labelledby="goals-heading">
            <h3 id="goals-heading">🎯 Goals & Aspirations</h3>
            ${this.renderGoalList(person)} {/* Includes add form */}
        </section>
        <section class="reflections-section" aria-labelledby="journal-heading">
            <h3 id="journal-heading">📝 Journal & Reflections</h3>
            ${this.renderJournalTab(person)}
        </section>
    `;
  }

  renderHistoryTabStructure(person) {
      // Renders the container and snapshot list structure. Chart is rendered separately.
      return `
        <section class="history-section" aria-labelledby="history-heading">
             <h3 id="history-heading">📊 Progress Over Time</h3>
             <p class="muted-text">Track changes in traits, style, and role over time.</p>
             <div class="modal-actions">
                 <button type="button" id="snapshot-btn" class="small-btn accent-btn">📸 Take Snapshot</button>
             </div>
             <div class="history-chart-container ${!person.history || person.history.length < 2 ? 'chart-loading' : ''}">
                 <canvas id="history-chart-${person.id}"></canvas>
             </div>
             <h4>Saved Snapshots:</h4>
             <ul class="snapshot-list">
                 ${person.history && person.history.length > 0 ?
                     person.history.map((snapshot, index) => `
                         <li class="snapshot-item">
                             <span>${new Date(snapshot.timestamp).toLocaleString()} - ${escapeHTML(snapshot.role)} / ${escapeHTML(snapshot.style)}</span>
                             <button type="button" class="small-btn snapshot-toggle"
                                     onclick="window.kinkCompassApp.toggleSnapshotInfo(this)"
                                     aria-expanded="false" aria-controls="snapshot-details-${person.id}-${index}">
                                 View Traits
                             </button>
                             <div id="snapshot-details-${person.id}-${index}" class="snapshot-details" style="display: none;">
                                 <ul>
                                     ${Object.entries(snapshot.traits || {}).map(([key, value]) =>
                                         `<li><strong>${escapeHTML(key)}:</strong> ${escapeHTML(value)} ${getFlairForScore(value)}</li>`
                                     ).join('')}
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
       // Get hints based on the *current* persona state
       const synergyHints = this.getSynergyHints(person);
       const goalHints = this.getGoalAlignmentHints(person);

       return `
        <section class="oracle-tab-content" aria-labelledby="oracle-heading">
            <h3 id="oracle-heading">🔮 Kink Oracle</h3>
            <div id="oracle-reading-output">
                <p class="muted-text">Consult the Oracle for guidance based on your current persona...</p>
            </div>
            <div class="modal-actions">
                <button type="button" id="oracle-btn" class="small-btn accent-btn">Consult Oracle ✨</button>
            </div>
        </section>
        <section aria-labelledby="synergy-heading">
             <h3 id="synergy-heading">🤝 Synergy & Dynamics</h3>
             ${synergyHints.length > 0
                 ? `<ul>${synergyHints.map(h => `<li style="margin-bottom: 0.5em;">${h.type === 'positive' ? '✨' : '🤔'} ${escapeHTML(h.text)}</li>`).join('')}</ul>`
                 : '<p class="muted-text">No specific trait synergies detected currently. Keep exploring!</p>'
             }
        </section>
        <section aria-labelledby="goal-align-heading">
             <h3 id="goal-align-heading">🌱 Goal Alignment</h3>
             ${goalHints.length > 0
                 ? `<ul>${goalHints.map(h => `<li style="margin-bottom: 0.5em;">${escapeHTML(h)}</li>`).join('')}</ul>`
                 : '<p class="muted-text">Add some goals to see alignment hints based on your traits!</p>'
             }
        </section>
        <section aria-labelledby="daily-challenge-insights-heading">
             <h3 id="daily-challenge-insights-heading">🌟 Today's Focus 🌟</h3>
             <div id="daily-challenge-area" role="region" aria-live="polite">
                 <!-- Content injected by displayDailyChallenge -->
                 <p class="muted-text">Loading today's focus...</p>
             </div>
        </section>
        <section class="achievements-section" aria-labelledby="achievements-insights-heading">
            <h3 id="achievements-insights-heading">🏆 Recent Achievements</h3>
            ${this.renderAchievementsList(person, true)} {/* Pass true to limit */}
        </section>
    `;
   }


  // --- Individual Component Rendering Functions for Detail Modal ---

  renderTraitDetails(person) {
    if (!person?.traits || Object.keys(person.traits).length === 0) {
      return '<p class="muted-text">No traits defined for this persona yet.</p>';
    }
     // Sort traits alphabetically for consistent display
     const sortedTraitEntries = Object.entries(person.traits).sort((a, b) => a[0].localeCompare(b[0]));

    let html = '<div class="trait-details-grid">';
    sortedTraitEntries.forEach(([name, score]) => {
        // Find trait explanation (more robust search)
        let explanation = `Details for '${escapeHTML(name)}' not found.`;
        let traitData = null;
        for (const roleKey in bdsmData) {
            const roleData = bdsmData[roleKey];
            traitData = roleData.coreTraits?.find(t => t.name === name) ||
                        roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === name);
            if (traitData?.explanation) {
                explanation = traitData.explanation;
                break;
            }
        }
        // Fallback to glossary if not found in bdsmData
        if (!traitData?.explanation && glossaryTerms[name]?.definition) {
             explanation = glossaryTerms[name].definition;
        }

        html += `
        <div class="trait-detail-item">
            <h4>
                 <a href="#" class="glossary-link" data-term-key="${escapeHTML(name)}" title="View '${escapeHTML(name)}' in Glossary">${escapeHTML(name.charAt(0).toUpperCase() + name.slice(1))}</a>
                <span class="trait-score-badge">${escapeHTML(score)} ${getFlairForScore(score)}</span>
            </h4>
            <p>${escapeHTML(explanation)}</p>
            ${traitData?.desc?.[score] ? `<p><em>(${escapeHTML(traitData.desc[score])})</em></p>` : ''}
        </div>
        `;
    });
    html += '</div>';
    return html;
}


  renderStyleBreakdownDetail(person) {
      let breakdown = { strengths: "N/A", improvements: "N/A" };
      if (person.role && person.style) {
          if (person.role === 'submissive' || (person.role === 'switch' && subStyleSuggestions[normalizeStyleKey(person.style)])) {
              breakdown = getSubStyleBreakdown(person.style, person.traits);
          } else if (person.role === 'dominant' || (person.role === 'switch' && domStyleSuggestions[normalizeStyleKey(person.style)])) {
              breakdown = getDomStyleBreakdown(person.style, person.traits);
          } else if (person.role === 'switch') {
               // Generic switch breakdown
               breakdown = { strengths: "Embracing versatility and adaptability.", improvements: "Explore communication around role shifts and energy reading." };
          }
      } else {
           return '<p class="muted-text">Select a Role and Style to see the breakdown.</p>';
      }

      return `
        <div class="style-breakdown">
          <div class="strengths">
            <h4>Strengths & Expressions</h4>
            <p>${breakdown.strengths}</p> {/* Already HTML/Markdown formatted */}
          </div>
          <div class="improvements">
            <h4>Potential Growth Areas</h4>
            <p>${breakdown.improvements}</p> {/* Already HTML/Markdown formatted */}
          </div>
        </div>
      `;
  }


  renderJournalTab(person) {
      const reflections = person.reflections || "";
      return `
        <div class="modal-actions">
            <button type="button" id="journal-prompt-btn" class="small-btn">💡 Get Prompt</button>
        </div>
        <div id="journal-prompt-area" class="journal-prompt" style="display: none;">
             <!-- Prompt injected here -->
        </div>
        <form action="#">
            <label for="reflections-textarea-${person.id}" class="sr-only">Journal Entry</label>
            <textarea id="reflections-textarea-${person.id}" class="reflections-textarea" placeholder="Reflect on your experiences, feelings, goals...">${escapeHTML(reflections)}</textarea>
            <div class="modal-actions">
                 <button type="button" id="save-reflections-btn" class="small-btn save-btn">Save Reflections 💾</button>
            </div>
        </form>
      `;
  }


  renderAchievementsList(person = null, limit = false) {
    const isGlobalView = person === null; // Check if rendering for global modal or persona insights
    const targetAchievements = isGlobalView ? Object.entries(achievementList) : person.achievements || [];
    const maxToShow = limit ? 6 : Infinity; // Limit if requested (for insights tab)

    if (targetAchievements.length === 0 && !isGlobalView) {
      return '<p class="muted-text">No achievements unlocked yet for this persona.</p>';
    }
     if (targetAchievements.length === 0 && isGlobalView) {
      return '<p class="muted-text">Achievement data not loaded.</p>'; // Should not happen if appData is correct
    }

    let achievementsHTML = `<ul class="${isGlobalView ? 'all-achievements-list' : ''}">`;
    let count = 0;

    if (isGlobalView) {
        // Sort all possible achievements alphabetically for the global view
        targetAchievements.sort(([, a], [, b]) => a.name.localeCompare(b.name));

        targetAchievements.forEach(([id, details]) => {
             // Check if globally unlocked
             const globallyUnlocked = localStorage.getItem(`kinkCompass_global_achievement_${id}`) === 'true';
             // Check if unlocked by *any* persona (more complex, could be slow - skip for now or optimize later)
             // const unlockedByAnyPersona = this.people.some(p => p.achievements?.includes(id));
             // Simple approach: Show based on global storage only for the main modal
             const isUnlocked = globallyUnlocked; // Modify if checking personas too

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
    } else {
         // Show only achievements unlocked by the specific person, sorted, potentially limited
         const sortedAchievements = [...person.achievements].sort((aId, bId) => {
             const aName = achievementList[aId]?.name || '';
             const bName = achievementList[bId]?.name || '';
             return aName.localeCompare(bName);
         });

         for (const achievementId of sortedAchievements) {
              if (count >= maxToShow) break;
              const details = achievementList[achievementId];
              if (details) {
                   achievementsHTML += `
                       <li class="unlocked" title="${escapeHTML(details.desc)}">
                           <span class="achievement-icon" aria-hidden="true">🏆</span>
                           <span class="achievement-name">${escapeHTML(details.name)}</span>
                       </li>
                   `;
                   count++;
              }
         }
         if (count === 0) {
              achievementsHTML += '<li class="muted-text" style="border: none; background: none; width: 100%; text-align: center;">No achievements yet!</li>';
         } else if (limit && person.achievements.length > maxToShow) {
              achievementsHTML += `<li style="border: none; background: none; width: 100%; text-align: center;"><button type="button" class="link-button" onclick="window.kinkCompassApp.showAchievements()">View All (${person.achievements.length})...</button></li>`;
         }
    }

    achievementsHTML += '</ul>';
    return achievementsHTML;
}


  renderGoalList(person, returnListOnly = false) {
      const goals = person.goals || [];
      const listHTML = goals.length > 0 ? `
        <ul>
            ${goals.map(goal => `
                <li data-goal-id="${goal.id}" class="${goal.done ? 'done' : ''}">
                    <span class="goal-text">${escapeHTML(goal.text)}</span>
                    <div class="goal-actions">
                        <button type="button" class="small-btn goal-toggle-btn" data-goal-id="${goal.id}" aria-label="${goal.done ? 'Mark as not done' : 'Mark as done'}">
                            ${goal.done ? '↩️ Undo' : '✔️ Done'}
                        </button>
                        <button type="button" class="small-btn delete-btn goal-delete-btn" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button>
                    </div>
                </li>
            `).join('')}
        </ul>
      ` : '<p class="muted-text">No goals added yet.</p>';

       if (returnListOnly) {
           return listHTML;
       }

      // Include the "Add Goal" form only when rendering the full section
      const formHTML = `
        <form id="add-goal-form" action="#">
            <label for="new-goal-text-${person.id}" class="sr-only">New Goal:</label>
            <input type="text" id="new-goal-text-${person.id}" placeholder="Enter a new goal..." required>
            <button type="submit" class="small-btn save-btn">Add Goal</button>
        </form>
      `;

      return listHTML + formHTML;
  }


  // --- Feature Logic (Goals, Journal, History, etc.) ---

  addGoal(personId, formElement) {
      const input = formElement.querySelector('input[type="text"]');
      const goalText = input.value.trim();

      if (!goalText) {
          this.showNotification("Please enter text for the goal.", "warning");
          input.focus();
          return;
      }

      const person = this.people.find(p => p.id === personId);
      if (!person) {
           this.showNotification("Error: Persona not found to add goal.", "error");
           return;
      }

      if (!Array.isArray(person.goals)) { // Ensure goals array exists
           person.goals = [];
      }

      const newGoal = {
          id: generateSimpleId(), // Use utility function
          text: goalText,
          done: false,
          addedAt: new Date().toISOString(),
          completedAt: null
      };

      person.goals.push(newGoal);
      grantAchievement(person, 'goal_added'); // Grant handles save internally now
      this.saveToLocalStorage(); // Save immediately (grantAchievement might have already)

      // Re-render only the goal list part of the tab
      const goalsSection = formElement.closest('.goals-section');
      if (goalsSection) {
           const listContainer = goalsSection.querySelector('ul'); // Assuming list is direct child or identifiable
           if (listContainer) {
               listContainer.outerHTML = this.renderGoalList(person, true); // Render only list
           } else {
               // Fallback: re-render whole tab if structure unknown
               this.renderDetailTabContent(person, 'tab-goals-journal', formElement.closest('.tab-content'));
           }
      }

      input.value = ''; // Clear input field
      this.showNotification("Goal added!", "success", 2000);
      input.focus(); // Keep focus in input for adding another
  }

  toggleGoalStatus(personId, goalId, listItemElement = null) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return;

      const goal = person.goals.find(g => g.id === goalId);
      if (!goal) {
          this.showNotification("Error: Goal not found.", "error");
          return;
      }

      goal.done = !goal.done;
      goal.completedAt = goal.done ? new Date().toISOString() : null;

      // Animate and update UI
      if (listItemElement) {
          listItemElement.classList.toggle('done', goal.done);
          const toggleButton = listItemElement.querySelector('.goal-toggle-btn');
           if (toggleButton) {
                toggleButton.innerHTML = goal.done ? '↩️ Undo' : '✔️ Done';
                toggleButton.setAttribute('aria-label', goal.done ? 'Mark as not done' : 'Mark as done');
           }
          // Add animation class if completing
          if (goal.done) {
              listItemElement.classList.add('goal-completed-animation');
              // Remove animation class after it finishes
               setTimeout(() => {
                   listItemElement?.classList.remove('goal-completed-animation');
               }, 600); // Match CSS animation duration
               grantAchievement(person, 'goal_completed');
               this.checkGoalStreak(person); // Check streak achievement
          }
      } else {
           // Fallback to re-rendering list if element not passed
           const goalsSection = document.querySelector(`#detail-modal[data-person-id="${personId}"] .goals-section`);
           if (goalsSection) {
               const listContainer = goalsSection.querySelector('ul');
               if (listContainer) listContainer.outerHTML = this.renderGoalList(person, true);
           }
      }

       // Grant achievement for completing 5 goals
       const completedCount = person.goals.filter(g => g.done).length;
       if (completedCount >= 5) {
           grantAchievement(person, 'five_goals_completed');
       }

      this.saveToLocalStorage(); // Save changes
  }

  deleteGoal(personId, goalId) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return;

      const goalIndex = person.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) {
          this.showNotification("Error: Goal not found.", "error");
          return;
      }

      person.goals.splice(goalIndex, 1);
      this.saveToLocalStorage(); // Save changes

      // Re-render goal list
      const goalsSection = document.querySelector(`#detail-modal[data-person-id="${personId}"] .goals-section`);
      if (goalsSection) {
            const listContainer = goalsSection.querySelector('ul');
            if (listContainer) {
                listContainer.outerHTML = this.renderGoalList(person, true); // Render list only
                 this.showNotification("Goal deleted.", "info", 2000);
            }
      }
  }

  showJournalPrompt(personId) {
       const promptArea = document.getElementById('journal-prompt-area');
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!promptArea || !textarea) return;

       const prompt = getRandomPrompt();
       promptArea.textContent = `💡 Prompt: ${prompt}`;
       promptArea.style.display = 'block';

       // Optional: Prepend prompt to textarea if empty
       if (textarea.value.trim() === '') {
           textarea.value = `Prompt: ${prompt}\n\n`;
       }
       textarea.focus(); // Focus textarea after showing prompt

       // Grant achievement (global, doesn't need person save)
       grantAchievement({}, 'prompt_used', this.showNotification.bind(this));
   }

  saveReflections(personId) {
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!textarea) {
           this.showNotification("Error: Could not find journal text area.", "error");
           return;
       }

       const person = this.people.find(p => p.id === personId);
       if (!person) {
            this.showNotification("Error: Persona not found.", "error");
            return;
       }

       const reflectionsText = textarea.value; // No need to trim, preserve user formatting
       person.reflections = reflectionsText;

        // Highlight textarea briefly on save
        textarea.classList.add('input-just-saved');
        setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);


        grantAchievement(person, 'reflection_saved');
        // Check multi-reflection achievements
        // Note: This simple check assumes reflections always have text.
        // A more robust check might count non-empty reflections saved over time.
        const reflectionCount = person.history.filter(snap => snap.reflections !== undefined && snap.reflections !== "").length + (reflectionsText ? 1 : 0); // Approximate count
        if (reflectionCount >= 5) grantAchievement(person, 'five_reflections');
        if (reflectionCount >= 10) grantAchievement(person, 'journal_journeyman');

       this.saveToLocalStorage(); // Save changes
       this.showNotification("Reflections saved!", "success", 2000);
   }

   addSnapshotToHistory(personId) {
        const person = this.people.find(p => p.id === personId);
        if (!person) {
            this.showNotification("Error: Persona not found.", "error");
            return;
        }

        const currentTimestamp = new Date().toISOString();

        const newSnapshot = {
            timestamp: currentTimestamp,
            role: person.role,
            style: person.style,
            traits: { ...person.traits }, // Create a copy of traits
            // Optionally add goals/reflections state at time of snapshot?
            // goals: JSON.parse(JSON.stringify(person.goals)), // Deep copy if complex
            // reflections: person.reflections
        };

         // Check achievements related to snapshots *before* adding the new one
         grantAchievement(person, 'history_snapshot');
         this.checkConsistentSnapper(person, currentTimestamp);
         this.checkTraitTransformation(person, newSnapshot); // Check against *new* snapshot data

        if (!Array.isArray(person.history)) {
            person.history = [];
        }
        person.history.push(newSnapshot);

        // Optional: Limit history size?
        // const maxHistory = 50;
        // if(person.history.length > maxHistory) {
        //     person.history.shift(); // Remove oldest entry
        // }

        this.saveToLocalStorage(); // Save updated history

        // Re-render the history tab content
        const historyTabContent = document.getElementById('tab-history');
        if (historyTabContent && historyTabContent.classList.contains('active')) {
            this.renderDetailTabContent(person, 'tab-history', historyTabContent);
        }
        this.showNotification("Persona snapshot saved to history!", "success");
    }

    renderHistoryChart(person, canvasId) {
        const canvas = document.getElementById(canvasId);
        const container = canvas?.parentElement;

        if (!canvas || !container) {
             console.warn(`[HISTORY_CHART] Canvas or container not found for ID: ${canvasId}`);
             return;
        }
        if (!person.history || person.history.length < 2) {
            console.log("[HISTORY_CHART] Not enough history data to render chart.");
            container.classList.add('chart-loading'); // Keep loading message
            container.innerHTML = '<p class="muted-text">Need at least two snapshots to show trait history.</p>';
            return;
        }
        container.classList.remove('chart-loading'); // Remove loading state

        // Destroy previous chart instance if it exists
        if (this.chartInstance && this.chartInstance.canvas?.id === canvasId) {
            console.log("[HISTORY_CHART] Destroying previous chart instance.");
            this.chartInstance.destroy();
            this.chartInstance = null;
        }


        const history = person.history;
        const labels = history.map(snap => new Date(snap.timestamp).toLocaleDateString()); // X-axis labels (dates)

        // Identify all unique traits present across the history
        const allTraits = new Set();
        history.forEach(snap => {
            if (snap.traits) Object.keys(snap.traits).forEach(trait => allTraits.add(trait));
        });

        // Prepare datasets for Chart.js
        const datasets = [];
        const colors = ['#ff69b4', '#a0d8ef', '#f7dc6f', '#81c784', '#ffb74d', '#dcc1ff', '#ef5350', '#64b5f6']; // Use theme colors? Or fixed palette?
        let colorIndex = 0;

        allTraits.forEach(traitName => {
            const data = history.map(snap => snap.traits?.[traitName] ?? null); // Use null for missing data points
            // Only include trait if it has at least one data point
            if (data.some(d => d !== null)) {
                 datasets.push({
                     label: traitName.charAt(0).toUpperCase() + traitName.slice(1),
                     data: data,
                     borderColor: colors[colorIndex % colors.length],
                     backgroundColor: colors[colorIndex % colors.length] + '33', // Add transparency for points/fill
                     tension: 0.1, // Slight curve to lines
                     fill: false,
                     spanGaps: true, // Connect lines across null points
                     pointRadius: 4,
                     pointHoverRadius: 6,
                 });
                 colorIndex++;
            }
        });

        if (datasets.length === 0) {
             console.log("[HISTORY_CHART] No valid trait data found in history.");
             container.innerHTML = '<p class="muted-text">No trait data recorded in snapshots.</p>';
             return;
        }

        // Chart.js configuration
        const config = {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                         beginAtZero: true,
                         max: 5, // Traits are 1-5
                         min: 1,
                         ticks: { stepSize: 1, color: getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666' },
                         title: { display: true, text: 'Trait Score', color: getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666' },
                         grid: { color: getComputedStyle(document.body).getPropertyValue('--chart-grid-color').trim() || 'rgba(0,0,0,0.1)' }
                    },
                    x: {
                         ticks: { color: getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666' },
                         title: { display: true, text: 'Snapshot Date', color: getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666' },
                         grid: { display: false } // Hide vertical grid lines usually
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: getComputedStyle(document.body).getPropertyValue('--chart-label-color').trim() || '#666' }
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.body).getPropertyValue('--chart-tooltip-bg').trim() || 'rgba(0,0,0,0.75)',
                        titleColor: getComputedStyle(document.body).getPropertyValue('--chart-tooltip-text').trim() || '#fff',
                        bodyColor: getComputedStyle(document.body).getPropertyValue('--chart-tooltip-text').trim() || '#fff',
                        intersect: false,
                        mode: 'index',
                    }
                },
                 // interaction: { // Consider performance impact on many points
                 //      mode: 'nearest',
                 //      axis: 'x',
                 //      intersect: false
                 // }
            }
        };

        try {
           // Create the chart
           this.chartInstance = new Chart(canvas, config);
           console.log(`[HISTORY_CHART] Chart rendered successfully for canvas: ${canvasId}`);
        } catch (error) {
            console.error(`[HISTORY_CHART] Error creating chart for ${canvasId}:`, error);
            container.innerHTML = `<p class="error-text">Error rendering chart.</p>`;
        }
    }

  toggleSnapshotInfo(button) {
    console.log("[TOGGLE_SNAPSHOT_INFO] Toggle button clicked.");
    // Use safer DOM traversal
    const parentItem = button.closest('.snapshot-item');
    if (!parentItem) {
        console.warn("[TOGGLE_SNAPSHOT_INFO] Could not find parent '.snapshot-item' for button:", button);
        return;
    }
    const detailsDiv = parentItem.querySelector('.snapshot-details');

    if (detailsDiv) {
        const isVisible = detailsDiv.style.display !== 'none';
        detailsDiv.style.display = isVisible ? 'none' : 'block'; // Toggle display
        button.textContent = isVisible ? 'View Traits' : 'Hide Traits'; // Update button text
        button.setAttribute('aria-expanded', !isVisible); // Set ARIA on the button
        console.log(`[TOGGLE_SNAPSHOT_INFO] Details visibility set to: ${!isVisible}`);
    } else {
        console.warn("[TOGGLE_SNAPSHOT_INFO] Could not find the '.snapshot-details' div within the parent item:", parentItem);
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
    // Find the output element within the currently open modal
    const modalContent = document.querySelector('#detail-modal .modal-content');
    if (!modalContent) {
         console.error("[SHOW_KINK_ORACLE] Failed: Detail modal content not found.");
         return;
    }
    const outputElement = modalContent.querySelector('#oracle-reading-output');
    const button = modalContent.querySelector('#oracle-btn');

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

    // Show loading state
    outputElement.innerHTML = `<p><i>Consulting the ethereal energies... <span class="spinner"></span></i></p>`;
    if (button) button.disabled = true;

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

            // Grant achievement (pass callbacks)
            grantAchievement(person, 'kink_reading_oracle', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));

        } catch (error) {
            console.error("[SHOW_KINK_ORACLE] Error getting or displaying Oracle reading:", error);
            outputElement.innerHTML = `<p class="muted-text">The Oracle is quiet today. Perhaps try again later?</p>`;
        } finally {
             if (button) button.disabled = false; // Re-enable button
        }
    }, 600); // Slightly longer delay
} // --- End showKinkOracle ---

  displayDailyChallenge(personaForContext = null) {
    // Determine target area: could be live preview or insights tab
    let challengeArea = this.elements.livePreview?.querySelector('#daily-challenge-area');
     // If not in live preview, check if detail modal is open and insights tab is active
    if (!challengeArea && this.elements.modal?.style.display !== 'none' && this.activeDetailModalTab === 'tab-insights') {
         challengeArea = this.elements.modalBody?.querySelector('#daily-challenge-area');
    }

    if (!challengeArea) {
        // console.warn("[DAILY_CHALLENGE] Challenge display area not found in the current view.");
        return; // Silently fail if the area isn't present
    }

    try {
        const challenge = this.getDailyChallenge(personaForContext); // Pass persona for potential context
        if (challenge) {
            challengeArea.innerHTML = `
                <h4 id="daily-challenge-title" style="margin-bottom:0.5em;">🌟 Today's Focus 🌟</h4>
                <h5>${escapeHTML(challenge.title)}</h5>
                <p>${escapeHTML(challenge.desc)}</p>
                <p class="muted-text"><small>(Category: ${escapeHTML(challenge.category)})</small></p>`;
            challengeArea.style.display = 'block'; // Ensure it's visible
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
    const searchInput = this.elements.glossarySearchInput;

    if (!modal || !body) {
        console.error("[SHOW_GLOSSARY] Failed: Glossary modal or body element not found.");
        this.showNotification("UI Error: Cannot display glossary.", "error");
        return;
    }

    // Clear previous search and content
    if (searchInput) searchInput.value = '';
    body.innerHTML = ''; // Clear previous content

    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) =>
        (glossaryTerms[a]?.term || '').localeCompare(glossaryTerms[b]?.term || '')
    );

    if (sortedKeys.length === 0) {
        body.innerHTML = '<p>Glossary is currently empty.</p>';
    } else {
        const dl = document.createElement('dl');
        dl.id = 'glossary-term-list'; // ID for filtering
        sortedKeys.forEach(key => {
            const termData = glossaryTerms[key];
            if (!termData?.term || !termData.definition) return; // Skip incomplete entries

            const dt = document.createElement('dt');
            dt.id = `glossary-${key}`; // ID for linking/highlighting
            dt.textContent = termData.term;

            const dd = document.createElement('dd');
            // Use innerHTML carefully if definition might contain safe HTML, otherwise textContent
            dd.innerHTML = this.linkGlossaryTerms(escapeHTML(termData.definition)); // Link terms within definitions

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
            // Add wrapper for filtering
             const itemWrapper = document.createElement('div');
             itemWrapper.classList.add('glossary-item');
             itemWrapper.dataset.term = termData.term.toLowerCase(); // Store term for searching
             itemWrapper.dataset.definition = termData.definition.toLowerCase(); // Store definition
             itemWrapper.appendChild(dt);
             itemWrapper.appendChild(dd);
             dl.appendChild(itemWrapper);
        });
        body.appendChild(dl);
    }

    this.openModal(modal);
    console.log("[SHOW_GLOSSARY] Glossary modal opened.");

    // Handle highlighting and scrolling if a term key was provided
    if (termKeyToHighlight) {
         this.highlightGlossaryTerm(termKeyToHighlight);
    }
} // --- End showGlossary ---

// Helper to highlight a specific term in the already open glossary
highlightGlossaryTerm(termKeyToHighlight) {
     console.log(`[HIGHLIGHT_TERM] Attempting to highlight and scroll to: ${termKeyToHighlight}`);
     // Use requestAnimationFrame to ensure the element exists and layout is complete
     requestAnimationFrame(() => {
         const element = document.getElementById(`glossary-${termKeyToHighlight}`);
         if (element) {
             console.log("[HIGHLIGHT_TERM] Highlight target element found:", element);
             // Remove highlight from any previously highlighted term
             this.elements.glossaryBody?.querySelector('.highlighted-term')?.classList.remove('highlighted-term');

             element.classList.add('highlighted-term');
             element.scrollIntoView({ behavior: 'smooth', block: 'center' });
             console.log("[HIGHLIGHT_TERM] Scrolled to highlighted term.");
             // Remove highlight after a delay
             setTimeout(() => {
                 element?.classList.remove('highlighted-term'); // Check element still exists
                 console.log(`[HIGHLIGHT_TERM] Highlight removed from ${termKeyToHighlight}.`);
             }, 2500); // 2.5 seconds
         } else {
             console.warn(`[HIGHLIGHT_TERM] Element ID not found for highlighting: glossary-${termKeyToHighlight}`);
         }
     });
}

// Helper to link glossary terms within text content
linkGlossaryTerms(text) {
    // Sort keys by length descending to match longer terms first
    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);
    let linkedText = text;

    sortedKeys.forEach(key => {
        const termData = glossaryTerms[key];
        if (termData?.term) {
             // Use regex to find the term (case-insensitive, word boundary)
             // Avoid creating links inside existing links
             const regex = new RegExp(`\\b(${escapeHTML(termData.term)})\\b(?![^<]*?>|[^<>]*</)`, 'gi');
             linkedText = linkedText.replace(regex, (match) =>
                 `<a href="#glossary-${key}" class="glossary-link" data-term-key="${key}">${match}</a>`
             );
        }
    });
    return linkedText;
}


// Filter glossary based on search input
filterGlossary(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const list = document.getElementById('glossary-term-list');
    if (!list) return;

    const items = list.querySelectorAll('.glossary-item');
    let itemsFound = 0;
    items.forEach(item => {
        const term = item.dataset.term || '';
        const definition = item.dataset.definition || '';
        const isMatch = term.includes(lowerSearchTerm) || definition.includes(lowerSearchTerm);
        item.style.display = isMatch ? '' : 'none';
        if (isMatch) itemsFound++;
    });
     // Optional: Show a "no results" message
     let noResultsMsg = list.querySelector('.no-results-message');
     if (itemsFound === 0 && lowerSearchTerm !== '') {
         if (!noResultsMsg) {
             noResultsMsg = document.createElement('p');
             noResultsMsg.className = 'muted-text no-results-message';
             noResultsMsg.textContent = 'No terms found matching your search.';
             list.appendChild(noResultsMsg); // Append message to the list
         }
         noResultsMsg.style.display = '';
     } else if (noResultsMsg) {
         noResultsMsg.style.display = 'none';
     }
}

clearGlossarySearch() {
     if (this.elements.glossarySearchInput) {
         this.elements.glossarySearchInput.value = '';
         this.filterGlossary(''); // Trigger filter with empty string
         this.elements.glossarySearchInput.focus();
     }
 }

  showStyleDiscovery(styleNameToHighlight = null) {
    console.log(`[STYLE_DISCOVERY] Opening style discovery. Highlight: ${styleNameToHighlight || 'None'}`);
    const modal = this.elements.styleDiscoveryModal;
    const body = this.elements.styleDiscoveryBody;
    const roleFilter = this.elements.styleDiscoveryRoleFilter;
    const searchInput = this.elements.styleDiscoverySearchInput;

    if (!modal || !body || !roleFilter) {
        console.error("[STYLE_DISCOVERY] Failed: Style Discovery modal elements missing.");
        this.showNotification("UI Error: Cannot display style discovery.", "error");
        return;
    }

    // Reset filters when opening
    roleFilter.value = 'all';
    if(searchInput) searchInput.value = '';
    console.log("[STYLE_DISCOVERY] Filters reset.");

    // Render the content based on the initial filters
    this.renderStyleDiscoveryContent(styleNameToHighlight); // Pass highlight name

    this.openModal(modal);
    console.log("[STYLE_DISCOVERY] Style Discovery modal opened.");
} // --- End showStyleDiscovery ---

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
    const highlightName = typeof styleNameToHighlight === 'string' ? styleNameToHighlight : null;
    console.log(`[RENDER_STYLE_DISCOVERY] Rendering content. Highlight target: ${highlightName || 'None'}`);

    const body = this.elements.styleDiscoveryBody;
    const selectedRole = this.elements.styleDiscoveryRoleFilter?.value || 'all';
    const searchTerm = this.elements.styleDiscoverySearchInput?.value.toLowerCase().trim() || '';
    console.log(`[RENDER_STYLE_DISCOVERY] Filter Role: ${selectedRole}, Search: "${searchTerm}"`);

    if (!body) {
        console.error("[RENDER_STYLE_DISCOVERY] Failed: Style Discovery body element missing.");
        return;
    }

    body.innerHTML = '<p class="loading-text" role="status">Loading styles...</p>'; // Loading indicator

    let stylesToDisplay = [];
    const rolesToInclude = selectedRole === 'all'
        ? ['submissive', 'dominant', 'switch'] // Include all defined roles
        : [selectedRole];

    rolesToInclude.forEach(roleKey => {
        if (bdsmData[roleKey]?.styles) {
            stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({
                ...style,
                role: roleKey // Store the role
            })));
        }
    });

    // Filter by search term (on name or summary)
    if (searchTerm) {
        stylesToDisplay = stylesToDisplay.filter(style =>
            style.name.toLowerCase().includes(searchTerm) ||
            (style.summary || '').toLowerCase().includes(searchTerm)
        );
    }

    // Sort remaining styles alphabetically by name
    stylesToDisplay.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    console.log(`[RENDER_STYLE_DISCOVERY] Found ${stylesToDisplay.length} styles matching filters.`);

    if (stylesToDisplay.length === 0) {
        body.innerHTML = '<p class="muted-text">No styles found matching the current filters.</p>';
        return;
    }

    // Generate HTML for each style
    let contentHTML = '';
    stylesToDisplay.forEach(style => {
        const styleIdSafe = `style-discovery-${escapeHTML(style.role)}-${escapeHTML(style.name.replace(/[^a-zA-Z0-9]/g, '-'))}`;
        const summary = style.summary || "No summary available.";
        const icon = sfStyleIcons[style.name] || ''; // Get icon

        contentHTML += `
            <div class="style-discovery-item" id="${styleIdSafe}">
                <h4>${icon} ${escapeHTML(style.name)} <small>(${escapeHTML(style.role)})</small></h4>
                <p>${escapeHTML(summary)}</p>
                 ${this.renderStyleTraitList(style)} {/* Added trait list helper */}
            </div>`;
    });

    body.innerHTML = contentHTML;
    console.log("[RENDER_STYLE_DISCOVERY] Finished rendering style items.");

    // Handle highlighting
    if (highlightName) {
        console.log(`[RENDER_STYLE_DISCOVERY] Attempting to highlight style: ${highlightName}`);
        requestAnimationFrame(() => {
            let elementToHighlight = null;
            const items = body.querySelectorAll('.style-discovery-item');
            items.forEach(item => {
                const h4 = item.querySelector('h4');
                 // More robust check: ignore icon/role, trim whitespace, case-insensitive
                if (h4) {
                    const namePart = h4.textContent.split('<small>')[0].replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]+)/gu, '').trim();
                    if (namePart.toLowerCase() === highlightName.toLowerCase()) {
                         elementToHighlight = item;
                    }
                }
            });

            if (elementToHighlight) {
                console.log("[RENDER_STYLE_DISCOVERY] Found highlight target element:", elementToHighlight);
                elementToHighlight.classList.add('highlighted-style');
                elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log("[RENDER_STYLE_DISCOVERY] Scrolled to highlighted style.");
                setTimeout(() => elementToHighlight?.classList.remove('highlighted-style'), 2500); // Use optional chaining
            } else {
                console.warn(`[RENDER_STYLE_DISCOVERY] Style element to highlight not found: ${highlightName}`);
            }
        });
    }
} // --- End renderStyleDiscoveryContent ---

// Helper to render trait list for Style Discovery item
renderStyleTraitList(style) {
    if (!style?.role || !bdsmData[style.role]) return '';

    const coreTraitNames = bdsmData[style.role].coreTraits?.map(t => t.name) || [];
    const styleTraitNames = style.traits?.map(t => t.name) || [];
    const allTraitNames = [...new Set([...coreTraitNames, ...styleTraitNames])].sort();

    if (allTraitNames.length === 0) return '';

    return `<p class="traits-list"><small>Key Traits: ${allTraitNames.map(t => `<a href="#" class="glossary-link" data-term-key="${escapeHTML(t)}" title="View '${escapeHTML(t)}' in Glossary">${escapeHTML(t)}</a>`).join(', ')}</small></p>`;
}

// Filter Style Discovery based on search input
filterStyleDiscovery(searchTerm) {
    // This just re-renders the content with the new search term
    this.renderStyleDiscoveryContent();
}


  // --- Data Import/Export ---

  exportData() {
    console.log("[EXPORT_DATA] Starting data export.");
    if (this.people.length === 0) {
         this.showNotification("No persona data to export.", "info");
         console.log("[EXPORT_DATA] Aborted: No data.");
         return;
    }

    try {
        const exportObject = {
            version: "KinkCompass_v2.8.8", // Update version string
            exportedAt: new Date().toISOString(),
            people: this.people
        };

        const dataStr = JSON.stringify(exportObject, null, 2); // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' }); // Specify charset
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        link.download = `kinkcompass_backup_${timestamp}.json`; // Filename with date
        console.log(`[EXPORT_DATA] Preparing download for file: ${link.download}`);

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
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        console.log("[IMPORT_DATA] No file selected or input invalid.");
        return; // Exit if no file was chosen
    }
    const file = fileInput.files[0];

    console.log(`[IMPORT_DATA] File selected: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

    // Basic validation
    if (!file.type.match('application/json')) { // More robust type check
        this.showNotification("Import failed: File must be a valid '.json' file.", "error", 5000);
        console.warn("[IMPORT_DATA] Invalid file type selected.");
        fileInput.value = null; // Reset file input
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // Limit size (e.g., 10MB)
         this.showNotification("Import failed: File size is too large (max 10MB).", "error", 5000);
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
            // Check for presence and type of 'people' array
            if (!importedData || typeof importedData !== 'object' || !Array.isArray(importedData.people)) {
                throw new Error("Invalid file format: Missing or invalid 'people' array.");
            }
            // Optional: Check version compatibility if needed
            // if (!importedData.version || !importedData.version.startsWith("KinkCompass_")) {
            //     console.warn("[IMPORT_DATA] Importing data from potentially incompatible version:", importedData.version);
            // }

            const numPersonas = importedData.people.length;
            console.log(`[IMPORT_DATA] Found ${numPersonas} personas in the file.`);

            // --- Confirmation (Replace with custom modal ideally) ---
            if (!confirm(`Import ${numPersonas} personas? This will REPLACE all current persona data.`)) {
                console.log("[IMPORT_DATA] User cancelled import.");
                fileInput.value = null; // Reset file input
                return;
            }

            console.log("[IMPORT_DATA] User confirmed import. Replacing data...");
            this.people = importedData.people;

            // --- Post-Import Sanitization/Migration ---
            console.log("[IMPORT_DATA] Sanitizing imported data...");
             this.people.forEach((p, index) => {
                 // Ensure required fields exist and have basic types
                 if (!p.id || typeof p.id !== 'string') p.id = generateSimpleId() + `_import_${index}`;
                 if (!p.name || typeof p.name !== 'string') p.name = `Imported Persona ${p.id.substring(0, 4)}`;
                 if (!p.role || typeof p.role !== 'string') p.role = 'submissive';
                 if (!p.style || typeof p.style !== 'string') p.style = '';
                 if (!p.avatar || typeof p.avatar !== 'string') p.avatar = '❓';
                 if (typeof p.traits !== 'object' || p.traits === null) p.traits = {};
                 if (!Array.isArray(p.achievements)) p.achievements = [];
                 if (!Array.isArray(p.goals)) p.goals = [];
                 if (!Array.isArray(p.history)) p.history = [];
                 if (typeof p.reflections !== 'string') p.reflections = "";
                 // Add more checks as needed
             });
             console.log("[IMPORT_DATA] Sanitization complete.");

            // --- Save and Update UI ---
            this.saveToLocalStorage(); // Save the newly imported data
            this.renderList(); // Update the list display
            this.resetForm(); // Reset the form
            this.showNotification(`Successfully imported ${numPersonas} personas!`, "success");
            grantAchievement({}, 'data_imported', this.showNotification.bind(this)); // Grant global achievement
            console.log("[IMPORT_DATA] END - Import successful.");

        } catch (error) {
            console.error("[IMPORT_DATA] Error processing imported file:", error);
            this.showNotification(`Import failed: ${error.message}. Check file format and integrity.`, "error", 6000);
        } finally {
            fileInput.value = null; // Reset file input regardless of success/failure
            console.log("[IMPORT_DATA] File input reset.");
        }
    }; // --- End reader.onload ---

    reader.onerror = (readError) => {
        console.error("[IMPORT_DATA] Error reading file:", readError);
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
    const closeButton = this.elements.traitInfoClose;

    if (!popup || !title || !body || !closeButton) {
        console.error("[SHOW_TRAIT_INFO] Failed: Trait info popup elements missing.");
        return;
    }

    let explanation = `Details for '${escapeHTML(traitName)}' not found.`;
    let found = false;

    // Search for explanation within bdsmData (more robust)
    for (const roleKey in bdsmData) {
        const roleData = bdsmData[roleKey];
        const coreTrait = roleData.coreTraits?.find(t => t.name === traitName);
        if (coreTrait?.explanation) { explanation = coreTrait.explanation; found = true; break; }
        const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (styleTrait?.explanation) { explanation = styleTrait.explanation; found = true; break; }
    }

    // Fallback to glossary
    if (!found && glossaryTerms[traitName]?.definition) {
        explanation = glossaryTerms[traitName].definition;
        console.log(`[SHOW_TRAIT_INFO] Found definition in glossary for ${traitName}.`);
        found = true;
    }

    title.textContent = `About: ${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}`;
    // Use innerHTML to allow potential linking of terms within explanation
    body.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(explanation))}</p>`;

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    // Manage focus & ARIA state
    this.elementThatOpenedModal = triggerButton || document.activeElement;
    // Reset previous trigger's state if it exists and is different
    document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
         if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if(triggerButton) triggerButton.setAttribute('aria-expanded', 'true');

    closeButton.focus();
    console.log("[SHOW_TRAIT_INFO] Popup displayed.");

    // Grant achievement (global, doesn't need persona save)
    grantAchievement({}, 'trait_info_viewed', this.showNotification.bind(this));
} // --- End showTraitInfo ---


  hideTraitInfo() {
    console.log("[HIDE_TRAIT_INFO] Hiding trait info popup.");
    const popup = this.elements.traitInfoPopup;
    if (!popup || popup.style.display === 'none') return; // Already hidden

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Find the button that triggered this specific popup instance (if stored)
     const triggerButton = this.elementThatOpenedModal?.closest('.trait-info-btn') || document.querySelector('.trait-info-btn[aria-expanded="true"]');

     // Return focus logic
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'false'); // Reset ARIA state
        try {
            // Only focus if it's still in the DOM
            if(document.body.contains(triggerButton)) {
                 triggerButton.focus();
                 console.log("[HIDE_TRAIT_INFO] Focus returned to trigger button.");
            } else {
                console.warn("[HIDE_TRAIT_INFO] Trigger button no longer in DOM.");
                document.body.focus(); // Fallback
            }
        } catch (e) {
            console.warn("[HIDE_TRAIT_INFO] Error returning focus to trigger button:", e);
            document.body.focus(); // Fallback
        }
    } else if (this.elementThatOpenedModal && document.body.contains(this.elementThatOpenedModal)) {
         // Fallback to the originally stored element if it wasn't the button itself
         try {
             this.elementThatOpenedModal.focus();
             console.log("[HIDE_TRAIT_INFO] Focus returned to stored element.");
         } catch (e) {
             console.warn("[HIDE_TRAIT_INFO] Error returning focus to stored element:", e);
             document.body.focus(); // Fallback
         }
    } else {
         console.log("[HIDE_TRAIT_INFO] No trigger button or stored element found/valid to return focus to.");
         document.body.focus(); // Fallback focus
    }
     this.elementThatOpenedModal = null; // Clear stored element regardless
} // --- End hideTraitInfo ---


  showContextHelp(helpKey, triggerButton = null) {
    console.log(`[SHOW_CONTEXT_HELP] Showing help for key: ${helpKey}`);
    const popup = this.elements.contextHelpPopup;
    const titleEl = this.elements.contextHelpTitle;
    const bodyEl = this.elements.contextHelpBody;
    const closeButton = this.elements.contextHelpClose;

    if (!popup || !titleEl || !bodyEl || !closeButton) {
        console.error("[SHOW_CONTEXT_HELP] Failed: Context help popup elements missing.");
        return;
    }

    const helpText = contextHelpTexts[helpKey] || `No specific help available for '${escapeHTML(helpKey)}'.`;
    console.log(`[SHOW_CONTEXT_HELP] Help text found.`);

    // Determine title (use glossary term if available, else formatted key)
    const displayTitle = glossaryTerms[helpKey]?.term ||
        (helpKey.charAt(0).toUpperCase() + helpKey.slice(1).replace(/([A-Z])/g, ' $1')); // Format key nicely

    titleEl.textContent = `Help: ${escapeHTML(displayTitle)}`;
    bodyEl.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(helpText))}</p>`; // Link terms within help text

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    // Manage focus and ARIA state
    this.elementThatOpenedModal = triggerButton || document.activeElement;
    document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => {
        if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if (triggerButton) triggerButton.setAttribute('aria-expanded', 'true'); // Mark active trigger

    closeButton.focus();
    console.log("[SHOW_CONTEXT_HELP] Context help popup displayed.");
} // --- End showContextHelp ---

  hideContextHelp() {
    console.log("[HIDE_CONTEXT_HELP] Hiding context help popup.");
    const popup = this.elements.contextHelpPopup;
     if (!popup || popup.style.display === 'none') return; // Already hidden

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');

    // Return focus and reset ARIA state
    // Prefer focusing the stored element (which should be the trigger button)
    const elementToFocus = this.elementThatOpenedModal || document.querySelector('.context-help-btn[aria-expanded="true"]');

    if (elementToFocus && document.body.contains(elementToFocus)) {
         if (elementToFocus.classList.contains('context-help-btn')) {
             elementToFocus.setAttribute('aria-expanded', 'false');
         }
         try {
             elementToFocus.focus();
             console.log("[HIDE_CONTEXT_HELP] Focus returned to trigger/stored element.");
         } catch (e) {
              console.warn("[HIDE_CONTEXT_HELP] Error returning focus:", e);
              document.body.focus(); // Fallback
         }
    } else {
         console.log("[HIDE_CONTEXT_HELP] No trigger button or stored element found/valid to return focus to.");
         document.body.focus(); // Fallback
    }
     this.elementThatOpenedModal = null; // Clear stored element
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
    this.styleFinderTraits = []; // Reset traits list

    // Reset UI elements
    if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = 'Starting...';
    if(this.elements.sfProgressBar) this.elements.sfProgressBar.style.width = '0%';
    if(this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '<p class="loading-text">Loading quest...</p>';
    if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';
    if(this.elements.sfDashboard) {
        this.elements.sfDashboard.innerHTML = '';
        this.elements.sfDashboard.style.display = 'none';
    }

    this.sfRenderStep(); // Render the first step (role selection)
    this.openModal(this.elements.sfModal); // Open the modal
    console.log("[SF_START] Style Finder modal opened and initialized.");
}

  sfClose() {
    console.log("[SF_CLOSE] Closing Style Finder.");
    this.styleFinderActive = false;
    this.sfCloseAllPopups(); // Close any info popups opened by SF
    this.closeModal(this.elements.sfModal);
}

// Close any open SF info/detail popups
sfCloseAllPopups() {
     let popupsClosed = false;
     document.querySelectorAll('.sf-style-info-popup').forEach(popup => {
         popup.remove();
         popupsClosed = true;
     });
     // Deactivate any active info icons
     document.querySelectorAll('.sf-info-icon.active').forEach(icon => {
          icon.classList.remove('active');
          // Optionally try to return focus if needed, though closing the modal handles it
     });
     if(popupsClosed) console.log("[SF_CLOSE_POPUPS] Closed open SF popups.");
     return popupsClosed; // Indicate if any were closed
}

  sfCalculateSteps() {
    const steps = [{ type: 'role_selection', title: 'Choose Your Path', text: 'Which role resonates more with you right now?' }];
    if (this.styleFinderRole) {
        // Determine traits based on selected role
        // Use the dedicated SF trait lists from appData
        this.styleFinderTraits = this.styleFinderRole === 'submissive' ? sfSubFinderTraits : sfDomFinderTraits;
        this.traitFootnotes = this.styleFinderRole === 'submissive' ? sfSubTraitFootnotes : sfDomTraitFootnotes;
        this.sliderDescriptions = sfSliderDescriptions; // Use combined descriptions

        // Randomize trait order (Fisher-Yates shuffle) for variety each time
        const shuffledTraits = [...this.styleFinderTraits];
        for (let i = shuffledTraits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTraits[i], shuffledTraits[j]] = [shuffledTraits[j], shuffledTraits[i]];
        }
        this.styleFinderTraits = shuffledTraits; // Use the shuffled order

        // Add trait steps
        this.styleFinderTraits.forEach(trait => {
            // Include essential data needed for rendering
            steps.push({ type: 'trait', name: trait.name, desc: trait.desc });
        });
    }
    steps.push({ type: 'result', title: 'Your Style Compass Reading!' });
    return steps;
}

  sfRenderStep() {
    if (!this.styleFinderActive || !this.elements.sfStepContent || !this.elements.sfProgressTracker || !this.elements.sfProgressBar) {
         console.error("[SF_RENDER_STEP] Cannot render, SF not active or essential elements missing.");
         return;
    }

    this.elements.sfStepContent.classList.add('loading'); // Add loading state visually

    const steps = this.sfCalculateSteps();
    const currentStepIndex = this.styleFinderStep; // 0-based index
    const totalSteps = steps.length;
    const currentStepData = steps[currentStepIndex];

    // Update progress tracker text and bar
    const progressPercent = totalSteps > 1 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;
    this.elements.sfProgressTracker.textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;
    this.elements.sfProgressBar.style.width = `${progressPercent}%`;
    this.elements.sfProgressBar.setAttribute('aria-valuenow', progressPercent); // Accessibility


    let html = '';

    switch (currentStepData.type) {
        case 'role_selection':
            html = `
                <h2>${escapeHTML(currentStepData.title)}</h2>
                <p>${escapeHTML(currentStepData.text)}</p>
                <div class="sf-button-container">
                    <button type="button" data-action="setRole" data-role="submissive" class="save-btn">Submissive Path 🙇‍♀️</button>
                    <button type="button" data-action="setRole" data-role="dominant" class="save-btn">Dominant Path 👑</button>
                </div>`;
             // Ensure dashboard hidden on role selection
             if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
             this.hasRenderedDashboard = false;
            break;

        case 'trait':
            const traitName = currentStepData.name; // Use name from calculated steps
            const traitDesc = currentStepData.desc; // Use desc from calculated steps
            // Default slider value to 5 (middle) if not previously answered
            const currentValue = this.styleFinderAnswers.traits[traitName] !== undefined
                                  ? this.styleFinderAnswers.traits[traitName]
                                  : 5;
            const footnote = this.traitFootnotes[traitName] || '';
            const sliderDescArray = this.sliderDescriptions[traitName] || [];
            // Ensure value is within array bounds
            const currentDescText = sliderDescArray[Math.max(0, Math.min(9, currentValue - 1))] || `Value: ${currentValue}`;

            html = `
                <h2>
                    ${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}
                    <button type="button" class="sf-info-icon" data-trait="${traitName}" aria-label="Info about ${escapeHTML(traitName)}">?</button>
                </h2>
                <p>${escapeHTML(traitDesc)}</p>
                <input type="range" class="sf-trait-slider" data-trait="${traitName}" min="1" max="10" value="${currentValue}" aria-label="${escapeHTML(traitName)} rating" step="1">
                <div class="sf-slider-description" id="sf-desc-${traitName}">${escapeHTML(currentDescText)}</div>
                <div class="sf-slider-footnote">${escapeHTML(footnote)}</div>
                <div class="sf-button-container">
                    ${currentStepIndex > 1 ? '<button type="button" data-action="prev" class="small-btn">⬅️ Previous</button>' : ''} {/* Only show Previous after first trait */}
                    <button type="button" data-action="next" data-currenttrait="${traitName}" class="save-btn">Next ➡️</button>
                </div>`;
            this.sfSliderInteracted = this.styleFinderAnswers.traits[traitName] !== undefined; // Mark interacted if already answered

             // Update dashboard inside animation frame to ensure it's visible AFTER content render
            requestAnimationFrame(() => {
                 if (!this.hasRenderedDashboard && this.styleFinderRole) {
                     this.sfUpdateDashboard(true); // Force dashboard visible on first trait step
                     this.hasRenderedDashboard = true;
                 } else if (this.hasRenderedDashboard) {
                     this.sfUpdateDashboard(); // Update normally on subsequent trait steps
                 }
             });
            break;

        case 'result':
            const resultData = this.sfCalculateResult();
             if (!resultData || !resultData.topStyle) {
                 html = '<p class="error-text">Could not calculate results. Please try again.</p>';
                 break; // Prevent further rendering if result calculation failed
             }

            html = `
                <h2>${escapeHTML(currentStepData.title)}</h2>
                <p>Based on your responses, here are styles that seem to resonate:</p>
                <div id="summary-dashboard">
                     ${this.sfGenerateSummaryDashboard(resultData.sortedScores)}
                </div>
                <hr>
                <div class="sf-result-section">
                     <h3>✨ Top Suggestion: ${escapeHTML(resultData.topStyle.name)}</h3>
                     <p><strong>${escapeHTML(resultData.topStyleDetails?.short || '')}</strong> ${escapeHTML(resultData.topStyleDetails?.long || 'Details loading...')}</p>
                     <h4>Possible Match: ${escapeHTML(resultData.topMatch?.match || '?')}</h4>
                     <p><em>Dynamic: ${escapeHTML(resultData.topMatch?.dynamic || '?')}</em> - ${escapeHTML(resultData.topMatch?.longDesc || '?')}</p>
                     <h4>Tips for Exploration:</h4>
                     <ul>${resultData.topStyleDetails?.tips?.map(tip => `<li>${escapeHTML(tip)}</li>`).join('') || '<li>Communicate openly!</li>'}</ul>
                     <p style="margin-top: 1em;"><button type="button" class="link-button" data-action="showDetails" data-style="${escapeHTML(resultData.topStyle.name)}">(Show Full Details for ${escapeHTML(resultData.topStyle.name)})</button></p>
                 </div>

                <div class="sf-button-container result-buttons">
                    <button type="button" data-action="confirmApply" data-role="${this.styleFinderRole}" data-style="${escapeHTML(resultData.topStyle.name)}" class="save-btn">Apply '${escapeHTML(resultData.topStyle.name)}' to Form</button>
                    <button type="button" data-action="prev" class="small-btn">⬅️ Back to Traits</button>
                    <button type="button" data-action="startOver" class="clear-btn">Start Over 🔄</button>
                </div>`;
            // Ensure dashboard is hidden on results page
             if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';

             // Trigger confetti celebration
             if (typeof confetti === 'function') {
                 confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
             } else {
                 console.log("Confetti not available, skipping celebration.");
             }
             grantAchievement({}, 'style_finder_complete', this.showNotification.bind(this)); // Grant achievement
            break;

        default:
            html = '<p class="error-text">Error: Unknown step type.</p>';
            console.error(`[SF_RENDER_STEP] Unknown step type: ${currentStepData.type}`);
    }

    // Use requestAnimationFrame to ensure smooth content update after loading state
    requestAnimationFrame(() => {
        this.elements.sfStepContent.innerHTML = html;
        this.elements.sfStepContent.classList.remove('loading');
        // Focus management - focus first interactive element?
        const firstInteractive = this.elements.sfStepContent.querySelector('button, input[type="range"]');
        if (firstInteractive && currentStepData.type !== 'result') { // Avoid auto-focus on results page
             // firstInteractive.focus(); // Re-evaluate if this focus is desired
        }
        console.log(`[SF_RENDER_STEP] Rendered step ${currentStepIndex + 1} (${currentStepData.type})`);
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
        // Check if this trait actually *has* been answered before (allowing going back and forth)
        if (this.styleFinderAnswers.traits[currentTrait] === undefined) {
            this.sfShowFeedback("Please adjust the slider before proceeding!", "warning");
            console.warn("[SF_NEXT_STEP] Blocked: Slider not interacted with for trait:", currentTrait);
            // Add visual feedback (shake animation)
            const slider = this.elements.sfStepContent?.querySelector(`input[data-trait="${currentTrait}"]`);
            if(slider) {
                slider.classList.add('shake-animation');
                setTimeout(() => slider.classList.remove('shake-animation'), 500); // Remove animation class
            }
            return; // Stop processing next step
        }
    }

    const totalSteps = steps.length;
    if (this.styleFinderStep < totalSteps - 1) {
        this.styleFinderStep++;
        console.log(`[SF_NEXT_STEP] Advanced to step ${this.styleFinderStep}`);
        this.sfRenderStep(); // Render the new step
    } else {
        console.log("[SF_NEXT_STEP] Already on the last step (results).");
        // Re-render results if needed (e.g., if data could change)
        this.sfRenderStep();
    }
}

  sfPrevStep() {
      // Allow going back from results to last trait, or from trait to previous trait/role selection
    if (this.styleFinderStep > 0) {
         // Check if going back from results step
         const currentStepType = this.sfCalculateSteps()[this.styleFinderStep].type;

        this.styleFinderStep--;
        console.log(`[SF_PREV_STEP] Moved back to step ${this.styleFinderStep}`);
        this.sfRenderStep();
         // Ensure dashboard is visible if back on a trait step
         const newStepType = this.sfCalculateSteps()[this.styleFinderStep].type;
         if (newStepType === 'trait' && this.hasRenderedDashboard) {
             this.sfUpdateDashboard(true); // Force visible
         } else if (newStepType === 'role_selection' && this.elements.sfDashboard) {
             this.elements.sfDashboard.style.display = 'none'; // Hide dashboard on role screen
             this.hasRenderedDashboard = false; // Reset flag
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
    relevantStyles.forEach(styleName => {
        // Use the style name (which includes emoji) as the key consistently
        scores[styleName] = 0;
    });

    // Apply points based on trait answers and key traits
    Object.entries(this.styleFinderAnswers.traits).forEach(([trait, rating]) => {
        const scoreValue = parseInt(rating, 10);
        if (isNaN(scoreValue)) return; // Skip if rating is invalid

        relevantStyles.forEach(styleName => {
             // We need to match sfStyleKeyTraits keys which might be normalized/different
             // Let's find the corresponding key in sfStyleKeyTraits based on the styleName
             const styleKeyTraitKey = Object.keys(sfStyleKeyTraits).find(key =>
                 normalizeStyleKey(key) === normalizeStyleKey(styleName)
             );

             if (styleKeyTraitKey) {
                 const keyTraitsForStyle = sfStyleKeyTraits[styleKeyTraitKey] || {}; // Use the matched key
                 // Grant points based on weight if the answered trait is a key trait
                 if (keyTraitsForStyle.hasOwnProperty(trait)) {
                      const weight = keyTraitsForStyle[trait] || 1; // Default weight is 1
                      scores[styleName] += scoreValue * weight; // Basic weighted score

                      // Bonus/Penalty for extremes (can adjust weights/thresholds)
                      if (scoreValue >= 9) scores[styleName] += (3 * weight); // Higher bonus for key traits
                      else if (scoreValue >= 7) scores[styleName] += (1 * weight);
                      else if (scoreValue <= 3) scores[styleName] -= (1 * weight); // Penalties too
                      else if (scoreValue <= 1) scores[styleName] -= (3 * weight);
                 }
             } else {
                  // console.warn(`[SF_COMPUTE] No key traits found for style: ${styleName}`);
             }
        });
    });

    // Normalize scores (0-100 scale) relative to the highest score achieved
    let highestScore = 0;
    Object.values(scores).forEach(score => {
         // Clamp scores to avoid negative before finding max
         const clampedScore = Math.max(0, score);
         if (clampedScore > highestScore) highestScore = clampedScore;
     });

     // Avoid division by zero and handle cases where all scores are 0
     if (highestScore > 0) {
         Object.keys(scores).forEach(styleName => {
             scores[styleName] = Math.max(0, Math.round((scores[styleName] / highestScore) * 100)); // Normalize to 0-100
         });
     } else {
          // If highest score is 0, all scores remain 0
          Object.keys(scores).forEach(styleName => {
             scores[styleName] = 0;
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
        Object.keys(currentScores).forEach(styleName => {
            const diff = currentScores[styleName] - (this.previousScores[styleName] || 0);
            if (diff !== 0) {
                scoreChanges[styleName] = { diff, direction: diff > 0 ? 'up' : 'down' };
            }
        });
    }

    // Sort scores for display (highest first)
    const sortedScores = Object.entries(currentScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    // Generate HTML using the new bar structure
    let dashboardHTML = `<h4 class="sf-dashboard-header">Style Resonance ✨</h4>`;
    sortedScores.forEach(([styleName, score]) => {
        const change = scoreChanges[styleName];
        const changeHTML = change
            ? `<span class="sf-score-delta ${change.direction === 'up' ? 'positive' : 'negative'}">${change.direction === 'up' ? '+' : ''}${change.diff}</span> <span class="sf-move-${change.direction}">${change.direction === 'up' ? '▲' : '▼'}</span>`
            : ''; // Show change indicator

         const barWidth = Math.max(0, Math.min(100, score)); // Use the 0-100 score directly
         const barHTML = `<div class="sf-score-bar" style="width: ${barWidth}%;"></div>`; // Inner bar

        dashboardHTML += `
            <div class="sf-dashboard-item">
                <span class="sf-style-name">${escapeHTML(styleName)}</span> {/* Style name now includes emoji */}
                <div class="sf-score-bar-container">${barHTML}</div> {/* Bar container */}
                <span class="sf-dashboard-score">${score}% ${changeHTML}</span>
            </div>`;
    });

    this.elements.sfDashboard.innerHTML = dashboardHTML;

    // Ensure dashboard is visible if forced or if it wasn't rendered before
    if (forceVisible || this.hasRenderedDashboard) { // Show if forced OR if already shown before
        this.elements.sfDashboard.style.display = 'block';
        // Re-apply animation only if forced visible for the first time?
        // if (forceVisible && !this.hasRenderedDashboard) {
        //     this.elements.sfDashboard.style.animation = 'sfFadeIn 0.5s ease';
        // }
    }

    // Store current scores for next update comparison
    this.previousScores = currentScores;
} // --- End sfUpdateDashboard ---


  // Calculates the final result object
  sfCalculateResult() {
    console.log("[SF_CALCULATE_RESULT] Calculating final results...");
    const finalScores = this.sfComputeScores(false); // Compute non-temporary, normalized scores

    if (Object.keys(finalScores).length === 0) {
        console.warn("[SF_CALCULATE_RESULT] No scores computed.");
        return null; // Return null or a default error object
    }

    const sortedScores = Object.entries(finalScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    if (sortedScores.length === 0) {
        console.warn("[SF_CALCULATE_RESULT] No scores available after sorting.");
        return { // Return a default object
            topStyle: { name: "Undetermined", score: 0 },
            topStyleDetails: { short: "N/A", long: "Could not determine a top style.", tips: ["Try answering more questions!"] },
            topMatch: null,
            sortedScores: []
        };
    }

    const topStyleName = sortedScores[0][0]; // Name includes emoji
    const topStyleScore = sortedScores[0][1];

    // Find details using the name (which includes emoji now)
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
    // Show top 5 results for clarity
    sortedScores.slice(0, 5).forEach(([styleName, score]) => {
         const barWidth = Math.max(0, Math.min(100, score));
         const barHTML = `<div class="sf-score-bar" style="width: ${barWidth}%;"></div>`; // Inner bar

        dashboardHTML += `
            <div class="sf-dashboard-item">
                <span class="sf-style-name">${escapeHTML(styleName)}</span> {/* Style name includes emoji */}
                 <div class="sf-score-bar-container">${barHTML}</div> {/* Bar container */}
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
    // Add animation for attention
    this.elements.sfFeedback.classList.remove('feedback-animation');
    void this.elements.sfFeedback.offsetWidth; // Trigger reflow
    this.elements.sfFeedback.classList.add('feedback-animation');
}

  // Shows trait info popup specifically within the Style Finder context
  sfShowTraitInfo(traitName, triggerElement = null) {
    console.log(`[SF_SHOW_TRAIT_INFO] Showing SF info for trait: ${traitName}`);
    // Use dedicated SF explanations first, fallback to general trait explanations
    const explanation = sfTraitExplanations[traitName] || findTraitExplanation(traitName) || "No specific explanation available.";

    this.sfCloseAllPopups(); // Close any existing popups first

    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card'; // Use SF specific popup class
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-popup-title');
    popup.style.display = 'none'; // Start hidden for animation

    const titleId = `sf-popup-title-${generateSimpleId()}`; // Unique ID for title

    popup.innerHTML = `
        <button type="button" class="sf-close-btn" aria-label="Close">×</button>
        <h3 id="${titleId}">${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}</h3>
        <p>${escapeHTML(explanation)}</p>
    `;

    // Attach listener programmatically
    const closeButton = popup.querySelector('.sf-close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.remove();
            triggerElement?.classList.remove('active'); // Deactivate trigger
            // Return focus to the trigger element if possible
            if(triggerElement && document.body.contains(triggerElement)) {
                 try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
            }
        });
    }

    document.body.appendChild(popup);
    popup.style.display = 'block'; // Make visible
    // Animate if desired: popup.style.animation = 'modalFadeIn 0.3s ease';

    // Manage focus and active state
    closeButton?.focus(); // Focus close button first
    if (triggerElement) {
        triggerElement.classList.add('active'); // Mark the current button as active
    }
    console.log("[SF_SHOW_TRAIT_INFO] SF Trait Info popup displayed.");
} // --- End sfShowTraitInfo ---


  // Shows the full details popup for a specific style from the results page
  sfShowFullDetails(styleNameWithEmoji, triggerElement = null) {
    console.log(`[SF_SHOW_FULL_DETAILS] Showing full details for style: "${styleNameWithEmoji}"`);

    // Details lookup now uses the full name including emoji
    const descData = sfStyleDescriptions[styleNameWithEmoji];
    const matchData = sfDynamicMatches[styleNameWithEmoji];

    if (!descData || !matchData) {
        console.error(`[SF_SHOW_FULL_DETAILS] Data missing for style: "${styleNameWithEmoji}"`);
        this.sfShowFeedback("Cannot load full details for this style.", "error");
        return;
    }

    this.sfCloseAllPopups(); // Close existing popups

    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card wide-popup'; // Use SF specific class, make it wide
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-detail-popup-title');
    popup.style.display = 'none'; // Start hidden

    const titleId = `sf-detail-popup-title-${generateSimpleId()}`;

    popup.innerHTML = `
        <button type="button" class="sf-close-btn" aria-label="Close">×</button>
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

     // Attach listener programmatically
     const closeButton = popup.querySelector('.sf-close-btn');
     if (closeButton) {
         closeButton.addEventListener('click', () => {
             popup.remove();
             triggerElement?.classList.remove('active'); // Deactivate trigger
             // Return focus to the trigger element
             if (triggerElement && document.body.contains(triggerElement)) {
                  try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
             }
         });
     }

    document.body.appendChild(popup);
    popup.style.display = 'block';
    // Animate if desired: popup.style.animation = 'modalFadeIn 0.3s ease';

    // Manage focus and active state
    closeButton?.focus();
    if (triggerElement) {
        triggerElement.classList.add('active');
    }
    console.log("[SF_SHOW_FULL_DETAILS] SF Full Details popup displayed.");
} // --- End sfShowFullDetails ---


  confirmApplyStyleFinderResult(role, styleWithEmoji) {
    console.log(`[SF_CONFIRM_APPLY] Asking user to confirm application of Role: ${role}, Style: ${styleWithEmoji}`);
    // TODO: Replace confirm() with a custom, non-blocking modal for better UX
    if (confirm(`Apply Role '${escapeHTML(role)}' and Style '${escapeHTML(styleWithEmoji)}' to the main form?\n\nThis will clear any unsaved changes in the form.`)) {
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

    // Clear form BUT keep the name if one was entered? Or clear all? Let's clear all.
    this.resetForm(true); // Manual clear first

    // Set Role
    this.elements.role.value = role;

    // Render Styles for the Role
    this.renderStyles(role);

    // Set Style (wait briefly for options to populate)
     setTimeout(() => {
         if (this.elements.style) {
             // Check if the style option actually exists before setting
             const styleOption = Array.from(this.elements.style.options).find(opt => opt.value === styleWithEmoji);
             if (styleOption) {
                 this.elements.style.value = styleWithEmoji; // Set style including emoji
                 console.log(`[SF_APPLY_RESULT] Set style dropdown to: ${styleWithEmoji}`);
                 // Render Traits for Role and Style
                 this.renderTraits(role, styleWithEmoji);
                 // Update Preview and Links
                 this.updateLivePreview();
                 this.updateStyleExploreLink();
             } else {
                  console.error(`[SF_APPLY_RESULT] Style option '${styleWithEmoji}' not found in dropdown after rendering for role '${role}'. Cannot apply.`);
                  this.showNotification(`Error: Style '${escapeHTML(styleWithEmoji)}' could not be applied.`, "error");
             }
         } else {
              console.error("[SF_APPLY_RESULT] Style dropdown element not found after delay.");
         }
     }, 100); // Increased delay slightly

    // Close Style Finder
    this.sfClose();

    this.showNotification(`Style '${escapeHTML(styleWithEmoji)}' applied to form! Remember to add a name and Save.`, "success");
    console.log("[SF_APPLY_RESULT] Applied result and closed Style Finder.");

    // Scroll to form and focus name field
    this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
     setTimeout(() => this.elements.name?.focus(), 400); // Delay focus after scroll
} // --- End applyStyleFinderResult ---


  // --- Theme Management ---

  applySavedTheme() {
    console.log("[APPLY_THEME] Applying saved theme from localStorage.");
    let savedTheme = 'light'; // Default theme
    try {
        savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
    } catch (e) {
        console.error("[APPLY_THEME] Error reading theme from localStorage:", e);
        // Use default theme
    }
    console.log(`[APPLY_THEME] Using theme: ${savedTheme}`);
    this.setTheme(savedTheme);
  }

  setTheme(themeName) {
    console.log(`[SET_THEME] Setting theme to: ${themeName}`);
    // Set attribute on the root element (html)
    document.documentElement.setAttribute('data-theme', themeName);

    // Save the preference to localStorage
    try {
        localStorage.setItem('kinkCompassTheme', themeName);
    } catch (e) {
        console.error(`[SET_THEME] Error saving theme '${themeName}' to localStorage:`, e);
        this.showNotification("Could not save theme preference.", "warning");
    }

    // Update the theme toggle button appearance and label
    if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️';
        this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    // Grant achievement for changing theme (only needs global tracking)
    // Debounce this slightly so quick toggles don't spam notifications
     if (!this.themeChangeTimeout) {
         this.themeChangeTimeout = setTimeout(() => {
             grantAchievement({}, 'theme_changer', this.showNotification.bind(this));
             this.themeChangeTimeout = null;
         }, 1000); // Grant only after 1 second of stability
     }

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

     // Use requestAnimationFrame to ensure CSS variables are updated
     requestAnimationFrame(() => {
         try {
             const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim() || 'rgba(0, 0, 0, 0.1)';
             const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label-color').trim() || '#666';
             const tooltipBg = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-bg').trim() || 'rgba(0, 0, 0, 0.75)';
             const tooltipText = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-text').trim() || '#fff';

             // Update scales
             if (this.chartInstance.options.scales.y) {
                  this.chartInstance.options.scales.y.ticks.color = labelColor;
                  if(this.chartInstance.options.scales.y.title) this.chartInstance.options.scales.y.title.color = labelColor;
                  if(this.chartInstance.options.scales.y.grid) this.chartInstance.options.scales.y.grid.color = gridColor;
             }
            if (this.chartInstance.options.scales.x) {
                  this.chartInstance.options.scales.x.ticks.color = labelColor;
                  if(this.chartInstance.options.scales.x.title) this.chartInstance.options.scales.x.title.color = labelColor;
                  if(this.chartInstance.options.scales.x.grid) this.chartInstance.options.scales.x.grid.color = gridColor; // Often display: false anyway
             }

             // Update plugins
             if (this.chartInstance.options.plugins.legend?.labels) {
                  this.chartInstance.options.plugins.legend.labels.color = labelColor;
             }
              if (this.chartInstance.options.plugins.tooltip) {
                  this.chartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
                  this.chartInstance.options.plugins.tooltip.titleColor = tooltipText;
                  this.chartInstance.options.plugins.tooltip.bodyColor = tooltipText;
             }

             this.chartInstance.update('none'); // Redraw the chart without animation
             console.log("[UPDATE_CHART_THEME] Chart theme updated.");
         } catch (error) {
              console.error("[UPDATE_CHART_THEME] Error applying theme to chart:", error);
         }
     });
 }


  // --- Modal Management ---

  openModal(modalElement) {
    if (!modalElement || typeof modalElement.setAttribute !== 'function') {
        console.error("[OPEN_MODAL] Failed: Attempted to open an invalid modal element.", modalElement);
        return;
    }
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[OPEN_MODAL] Opening modal: #${modalId}`);

    // Close any other currently open non-popup modal first
    const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]:not(.trait-info-popup):not(.context-help-popup)');
    if (currentlyOpen && currentlyOpen !== modalElement) {
        console.log(`[OPEN_MODAL] Another modal (#${currentlyOpen.id}) is open. Closing it first.`);
        this.closeModal(currentlyOpen);
    }

    // Store the element that had focus before opening the modal
    this.elementThatOpenedModal = document.activeElement;

    // Make the modal visible and accessible
    modalElement.style.display = 'flex'; // Use flex for centering
    modalElement.setAttribute('aria-hidden', 'false');
    console.log(`[OPEN_MODAL] Modal #${modalId} display set to flex.`);

    // Focus management: Move focus inside the modal
    requestAnimationFrame(() => {
        let focusTarget = modalElement.querySelector(
            // Try to find interactive elements first
            'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
        );
        // If no interactive elements, find the close button
        if (!focusTarget) {
             focusTarget = modalElement.querySelector('.modal-close, .sf-close-btn, .popup-close');
        }
        // Fallback to the modal content itself
        if (!focusTarget) {
             focusTarget = modalElement.querySelector('.modal-content');
             if (focusTarget) focusTarget.setAttribute('tabindex', '-1'); // Make it focusable
        }
        // Final fallback to the modal container
         if (!focusTarget) {
             focusTarget = modalElement;
             focusTarget.setAttribute('tabindex', '-1');
        }

        if (focusTarget) {
            try {
                focusTarget.focus();
                console.log(`[OPEN_MODAL] Focused element inside #${modalId}:`, focusTarget);
            } catch (focusError) {
                console.error(`[OPEN_MODAL] Error focusing element inside #${modalId}:`, focusError, focusTarget);
            }
        } else {
            console.warn(`[OPEN_MODAL] No focusable element found inside #${modalId}.`);
        }
    });
} // --- End openModal ---


  closeModal(modalElement) {
    if (!modalElement || typeof modalElement.setAttribute !== 'function') {
        console.error("[CLOSE_MODAL] Failed: Attempted to close an invalid modal element.", modalElement);
        return;
    }
     if (modalElement.style.display === 'none') {
        // console.log("[CLOSE_MODAL] Modal already closed."); // Can be noisy
        return; // Already closed
    }

    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[CLOSE_MODAL] Closing modal: #${modalId}`);

    // Hide the modal and make it inaccessible
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    console.log(`[CLOSE_MODAL] Modal #${modalId} display set to none.`);

    // Remove temporary tabindex if added
    modalElement.removeAttribute('tabindex');
    modalElement.querySelector('.modal-content[tabindex="-1"]')?.removeAttribute('tabindex');

    // --- Return focus ---
    const elementToFocus = this.elementThatOpenedModal;
    this.elementThatOpenedModal = null; // Clear the stored element

    // Delay focus return slightly
    requestAnimationFrame(() => {
        try {
            // Check if the element still exists, is visible, and is focusable
            if (elementToFocus && typeof elementToFocus.focus === 'function' && document.body.contains(elementToFocus) && elementToFocus.offsetParent !== null) {
                elementToFocus.focus();
                console.log("[CLOSE_MODAL] Focus successfully restored to:", elementToFocus);
            } else {
                console.warn("[CLOSE_MODAL] Stored focus return element is invalid, gone, or not visible. Focusing body.");
                document.body.focus(); // Fallback to body
            }
        } catch (e) {
            console.error("[CLOSE_MODAL] Error returning focus:", e);
            try { document.body.focus(); } catch (e2) { /* Ignore fallback error */ }
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
        if (activeGoals.length === 0) return hints; // No active goals

        // Limit processing to avoid overwhelming hints
        const maxHints = 3;
        let hintsFound = 0;

        for (const goal of activeGoals) {
             if (hintsFound >= maxHints) break; // Stop if we have enough hints

             const goalTextLower = goal.text.toLowerCase();
             const uniqueTraitsMentioned = new Set(); // Track traits mentioned for *this* goal

             for (const [keyword, data] of Object.entries(goalKeywords)) {
                  if (hintsFound >= maxHints) break;
                  if (goalTextLower.includes(keyword)) {
                      // Found a keyword match
                      for (const traitName of (data.relevantTraits || [])) {
                          if (hintsFound >= maxHints) break;
                          if (person.traits.hasOwnProperty(traitName) && !uniqueTraitsMentioned.has(traitName)) {
                               const score = person.traits[traitName];
                               const templates = data.promptTemplates || [];
                               if (templates.length > 0) {
                                    // Select a random prompt template
                                    const promptTemplate = templates[Math.floor(Math.random() * templates.length)];
                                    const hintText = promptTemplate.replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`); // Highlight trait name
                                    hints.push(`For goal "<em>${escapeHTML(goal.text)}</em>": ${hintText} (Your score: ${score}${getFlairForScore(score)})`);
                                    hintsFound++;
                                    uniqueTraitsMentioned.add(traitName); // Don't hint same trait for same goal
                               }
                          }
                      }
                  }
             }
        }

        // Return unique hints (though logic above tries to prevent duplicates per goal)
        return [...new Set(hints)]; // Ensure overall uniqueness just in case
    } // --- End getGoalAlignmentHints ---


   // Gets a daily challenge, potentially tailored to the persona
   getDailyChallenge(persona = null) {
        if (typeof challenges !== 'object') {
            console.error("[GET_DAILY_CHALLENGE] Failed: Challenge data structure is missing.");
            return null;
        }

        let possibleCategories = ['communication', 'exploration']; // Base categories

        // Add role-specific challenges if applicable and category exists
        if (persona?.role) {
            const roleKey = persona.role.toLowerCase();
            if (challenges[`${roleKey}_challenges`]) {
                 possibleCategories.push(`${roleKey}_challenges`);
            } else if (roleKey === 'switch' && challenges['switch_challenges']) { // Specific check for switch key
                 possibleCategories.push('switch_challenges');
            }
        }

        // Filter out categories that don't exist or are empty in the challenges data
         possibleCategories = possibleCategories.filter(catKey =>
             challenges[catKey] && Array.isArray(challenges[catKey]) && challenges[catKey].length > 0
         );

        if (possibleCategories.length === 0) {
            console.warn("[GET_DAILY_CHALLENGE] No valid challenge categories found.");
            return null; // No categories available
        }

        // --- Select Category ---
        // Simple random selection for now. Could add weighting later.
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
        const categoryChallenges = challenges[randomCategoryKey];

        // Select a random challenge from the chosen category
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];

        // Return challenge object with category info (cleaned up)
        return {
            ...randomChallenge,
            category: randomCategoryKey.replace('_challenges', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) // Make category name user-friendly
        };
    } // --- End getDailyChallenge ---


   // Gets an Oracle reading, potentially tailored to the persona
   getKinkOracleReading(person) {
        console.log(`[GET_ORACLE_READING] Generating reading for Person ID ${person?.id}`);
        if (typeof oracleReadings !== 'object' || !Array.isArray(oracleReadings.openings) || !oracleReadings.focusAreas || !Array.isArray(oracleReadings.encouragements) || !Array.isArray(oracleReadings.closings)) {
            console.error("[GET_ORACLE_READING] Failed: Oracle data structure is missing or incomplete.");
            return null;
        }

        const reading = {};

        try {
            // Helper to get random element or default
            const getRandom = (arr, fallback = "") => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : fallback;

            // 1. Select Opening
            reading.opening = getRandom(oracleReadings.openings, "The energies are swirling...");

            // 2. Determine Focus (Prioritize traits -> style -> general)
            let focusText = "";
            const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score)) && score >= 1 && score <= 5) : [];

            // If traits exist and random chance allows trait focus
            if (traits.length > 0 && Math.random() > 0.3 && Array.isArray(oracleReadings.focusAreas?.traitBased)) {
                // Sort traits to find extremes (highest or lowest scores)
                traits.sort((a, b) => Math.abs(a[1] - 3) - Math.abs(b[1] - 3)); // Sort by distance from middle (3), ascending
                const mostExtremeTraits = traits.slice(-3); // Get up to 3 most extreme
                if (mostExtremeTraits.length > 0) {
                    const focusTrait = getRandom(mostExtremeTraits); // Pick one randomly
                    if (focusTrait) {
                        const traitName = focusTrait[0];
                        const template = getRandom(oracleReadings.focusAreas.traitBased);
                        focusText = template.replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`);
                        console.log(` -> Oracle Focus determined by Trait: ${traitName}`);
                    }
                }
            }
            // If no trait focus or random chance allows style focus
            if (!focusText && person?.style && Math.random() > 0.5 && Array.isArray(oracleReadings.focusAreas?.styleBased)) {
                const template = getRandom(oracleReadings.focusAreas.styleBased);
                focusText = template.replace('{styleName}', `<em>${escapeHTML(person.style)}</em>`);
                console.log(` -> Oracle Focus determined by Style: ${person.style}`);
            }
            // Fallback to general focus
            if (!focusText && Array.isArray(oracleReadings.focusAreas?.general)) {
                focusText = getRandom(oracleReadings.focusAreas.general);
                console.log(` -> Oracle Focus set to General.`);
            }
            reading.focus = focusText || "Inner reflection."; // Absolute fallback

            // 3. Select Encouragement
            reading.encouragement = getRandom(oracleReadings.encouragements, "Keep exploring!");

            // 4. Select Closing
            reading.closing = getRandom(oracleReadings.closings, "Go well.");

            console.log("[GET_ORACLE_READING] Successfully generated reading:", reading);
            return reading;

        } catch (error) {
            console.error("[GET_ORACLE_READING] Error during reading generation:", error);
            return null; // Return null on error
        }
    } // --- End getKinkOracleReading ---


   // --- Achievement Checkers ---

   checkGoalStreak(person) {
        if (!person?.goals) return; // Need goals array

        const completedGoals = person.goals
            .filter(g => g.done && g.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        if (completedGoals.length < 3) return; // Not enough completed goals

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Check if the 3 most recent completions fall within the last 7 days
        const recentCompletions = completedGoals.slice(0, 3)
            .filter(g => {
                 try { return new Date(g.completedAt) >= sevenDaysAgo; }
                 catch(e) { return false; } // Ignore invalid dates
            });

        if (recentCompletions.length >= 3) {
            console.log(` -> Goal Streak achievement condition met for ${person.name}!`);
            grantAchievement(person, 'goal_streak_3', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    } // --- End checkGoalStreak ---

   checkTraitTransformation(person, currentSnapshot) {
        if (!Array.isArray(person?.history) || person.history.length === 0 || !currentSnapshot?.traits) {
            // console.log("[TRAIT_TRANSFORM_CHECK] Not enough history or no current traits.");
            return; // Need at least one previous snapshot and current traits
        }

        // Get the *most recent* previous snapshot
        const previousSnapshot = person.history[person.history.length - 1];
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
        if (!Array.isArray(person?.history) || person.history.length === 0) {
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
            // Ensure dates are valid before calculating difference
            if (isNaN(prevTime.getTime()) || isNaN(currentTime.getTime())) {
                 console.warn("[CONSISTENT_SNAP_CHECK] Invalid date found in snapshots.");
                 return;
            }
            const daysDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60 * 24); // Difference in days

            // Check if 3 or more full days have passed (e.g., >= 3.0)
            if (daysDiff >= 3) {
                console.log(` -> Consistent Snapper condition met! (${daysDiff.toFixed(1)} days)`);
                 grantAchievement(person, 'consistent_snapper', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
            }
        } catch (dateError) {
             console.error("[CONSISTENT_SNAP_CHECK] Error processing snapshot timestamps:", dateError);
        }
    } // --- End checkConsistentSnapper ---

    // --- Notification Helper ---
    showNotification(message, type = 'info', duration = 4000, details = null) {
        const notificationElement = this.elements.notificationArea || this.createNotificationElement();
        if (!notificationElement) return; // Stop if element creation failed

        console.log(`[NOTIFICATION] Type: ${type}, Msg: ${message}`, details || '');

        // Apply type class for styling
        notificationElement.className = `notification-${type}`; // Resets previous types
        notificationElement.textContent = message; // Set main message text

        // Add details if provided (e.g., for achievements) - could be a tooltip or appended text
        // For simplicity, just logging details for now
        // if (details) { notificationElement.title = JSON.stringify(details); }

        // Make visible and accessible
        notificationElement.style.opacity = '1';
        notificationElement.style.transform = 'translate(-50%, 0)'; // Slide down effect with top adjustment
        notificationElement.style.top = '70px'; // Position from top
        notificationElement.setAttribute('aria-hidden', 'false');
        notificationElement.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');

        // Clear existing timer if present
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Set timer to hide notification
        this.notificationTimer = setTimeout(() => {
            notificationElement.style.opacity = '0';
            notificationElement.style.transform = 'translate(-50%, -20px)'; // Slide up effect
            notificationElement.style.top = '20px'; // Reset top position
            notificationElement.setAttribute('aria-hidden', 'true');
            this.notificationTimer = null; // Clear timer ID
        }, duration);
    } // --- End showNotification ---

    // Helper to create the notification div if it doesn't exist
    createNotificationElement() {
        // Check if already exists just in case
        let notificationArea = document.getElementById('app-notification');
        if (notificationArea) return notificationArea;

        console.log("[CREATE_NOTIFICATION_ELEMENT] Creating notification container.");
        try {
            const div = document.createElement('div');
            div.id = 'app-notification';
            div.setAttribute('role', 'status'); // Start as status, change role based on type
            div.setAttribute('aria-live', 'assertive'); // Announce changes assertively
            div.setAttribute('aria-hidden', 'true'); // Start hidden
            document.body.appendChild(div);
            this.elements.notificationArea = div; // Update mapped elements
            return div;
        } catch (error) {
            console.error("[CREATE_NOTIFICATION_ELEMENT] Failed to create notification element:", error);
            return null;
        }
    } // --- End createNotificationElement ---


} // <<< --- END OF TrackerApp CLASS --- >>>

// --- Initialization ---
// Wrap in a try-catch block for robust startup
try {
    // Ensure the DOM is fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
             console.log("[INIT] DOM Loaded. Initializing KinkCompass App...");
             window.kinkCompassApp = new TrackerApp();
             console.log("[INIT] KinkCompass App Initialized Successfully on window.kinkCompassApp");
        });
    } else {
        // DOM already loaded
        console.log("[INIT] DOM Ready. Initializing KinkCompass App...");
        window.kinkCompassApp = new TrackerApp();
        console.log("[INIT] KinkCompass App Initialized Successfully on window.kinkCompassApp");
    }
} catch (error) {
    console.error("[INIT] FATAL error during App initialization:", error);
    // Display a prominent error message to the user if initialization fails
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>This might be due to a coding error or missing data.<br><br>Message: ${escapeHTML(error.message)}<br><br>Stack Trace:<br>${escapeHTML(error.stack || 'Not available')}<br><br>Please check the browser console (F12) for more details. You may need to clear localStorage or import a valid backup if data is corrupted.`;
    // Prepend to body, or append if body not ready (though unlikely with DOM check)
    if (document.body) {
        document.body.prepend(errorDiv);
    } else {
         document.addEventListener('DOMContentLoaded', () => document.body.prepend(errorDiv));
    }
}
