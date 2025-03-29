// === app.js === (Version 2.7 - EXTENSIVE Logging) ===

// --- Core Imports ---
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement, getAchievementDetails } from './achievements.js';

// --- New Feature Imports ---
import { synergyHints } from './synergyHints.js';
import { goalKeywords } from './goalPrompts.js';
import { challenges } from './challenges.js';
import { oracleReadings } from './oracle.js';

// Chart.js and Confetti loaded via CDN

// --- Top Level Data Check ---
console.log("--- Data Sanity Checks ---");
try {
    console.log("  bdsmData exists:", !!bdsmData);
    console.log("  bdsmData.submissive exists:", !!bdsmData.submissive);
    console.log("  bdsmData.submissive.styles is array:", Array.isArray(bdsmData.submissive?.styles));
    console.log("  glossaryTerms exists:", !!glossaryTerms);
    console.log("  journalPrompts exists:", typeof getRandomPrompt === 'function');
    console.log("  achievementList exists:", !!achievementList);
    console.log("  synergyHints exists:", !!synergyHints);
    console.log("  goalKeywords exists:", !!goalKeywords);
    console.log("  challenges exists:", !!challenges);
    console.log("  oracleReadings exists:", !!oracleReadings);
} catch (e) {
    console.error("  Error during data sanity check:", e);
}
console.log("--- End Data Check ---");


const contextHelpTexts = {
    role: "Your primary role (Dominant, Submissive, Switch) sets the main context for traits and styles.",
    style: "Your primary style adds specific flavor within your role. Select a role first to see relevant styles.",
    traits: "Rate how much each trait applies to this persona (1=Not at all, 5=Very Much). These define the persona's core characteristics.",
    goals: "What does this persona want to achieve or explore? Goals help track progress.",
    history: "Track how this persona's traits change over time by taking snapshots.",
    journal: "Reflect on experiences, feelings, or scene ideas related to this persona.",
    // Add more keys corresponding to data-help-key attributes in HTML
};

class TrackerApp {
  constructor() {
    console.log("[CONSTRUCTOR] STARTING KinkCompass App (v2.7 - EXTENSIVE Logging)...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;

    // --- Style Finder State ---
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} }; // Initialize traits object
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false;
    this.previousScores = null; // For dashboard diffing
    this.styleFinderTraits = []; // Will be populated based on role
    this.traitFootnotes = {}; // Will be populated based on role
    this.sliderDescriptions = {}; // Will be populated based on role

    // --- Element Mapping ---
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
      // Add other modal titles if needed for logging/debugging
      formTitle: document.getElementById('form-title'),
      dailyChallengeArea: document.getElementById('daily-challenge-area'),
      dailyChallengeSection: document.getElementById('daily-challenge-section')
    };
    console.log(`[CONSTRUCTOR] Elements mapped. Basic check: peopleList found = ${!!this.elements.peopleList}, role dropdown found = ${!!this.elements.role}`);

    // CRITICAL CHECK: Ensure core form elements exist
    if (!this.elements.role || !this.elements.style) {
        console.error("[CONSTRUCTOR] CRITICAL ERROR: Role or Style dropdown element missing in DOM!");
        alert("App critical error: Core form elements missing. Please refresh or check console."); // User alert
        return; // Prevent further execution if critical elements are missing
    }

    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners(); // Add event listeners
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and performing initial render...");
    this.loadFromLocalStorage();
    this.applySavedTheme(); // Apply theme early
    // Initial rendering calls
    this.renderStyles(this.elements.role.value); // Render initial styles based on default role
    this.renderTraits(this.elements.role.value, this.elements.style.value); // Render initial traits
    this.renderList(); // Render the persona list
    this.updateLivePreview(); // Update preview based on default form state
    this.checkAndShowWelcome(); // Show welcome message if first visit
    this.displayDailyChallenge(); // Display daily challenge
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() {
      console.log("[LOAD_STORAGE] Attempting to load 'kinkCompassPeople'.");
      try {
          const data = localStorage.getItem('kinkCompassPeople');
          if (data) {
              this.people = JSON.parse(data);
              console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
              // Basic data validation/migration could happen here
              this.people.forEach(p => {
                  if (!p.id) p.id = Date.now() + Math.random(); // Ensure IDs exist
                  if (!p.achievements) p.achievements = []; // Initialize achievements if missing
                  if (!p.goals) p.goals = []; // Initialize goals if missing
                  if (!p.history) p.history = []; // Initialize history if missing
              });
          } else {
              console.log("[LOAD_STORAGE] No data found in localStorage.");
          }
      } catch (error) {
          console.error("[LOAD_STORAGE] Error loading or parsing data:", error);
          this.showNotification("Error loading saved data. Check console.", "error", 5000);
          this.people = []; // Reset to empty state on error
      }
  }

  saveToLocalStorage() {
      console.log("[SAVE_STORAGE] Attempting to save personas.");
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
      console.log("[WELCOME] Checking if welcome message needed.");
      if (!localStorage.getItem('kinkCompassWelcomed')) {
          console.log("[WELCOME] First visit detected. Showing welcome modal.");
          this.showWelcomeMessage();
      } else {
          console.log("[WELCOME] Not first visit.");
      }
  }

  showWelcomeMessage() {
      console.log("[WELCOME] Opening welcome modal.");
      if (this.elements.welcomeModal) {
          this.openModal(this.elements.welcomeModal);
          localStorage.setItem('kinkCompassWelcomed', 'true');
          console.log("[WELCOME] 'kinkCompassWelcomed' flag set in localStorage.");
      } else {
          console.warn("[WELCOME] Welcome modal element not found.");
      }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("[ADD_LISTENERS] Starting setup...");

    // Helper to safely add listener and log outcome
    const safeAddListener = (element, event, handler, elementName) => {
        if (element) {
            element.addEventListener(event, handler.bind(this)); // Ensure 'this' context is correct
            console.log(`  [LISTENER ADDED] 👍 ${elementName} - ${event}`);
        } else {
            console.warn(`  [LISTENER FAILED] ❓ Element not found for: ${elementName}`);
        }
    };

    // Form Elements
    safeAddListener(this.elements.role, 'change', (e) => { console.log("[EVENT] Role changed"); this.renderStyles(e.target.value); this.renderTraits(e.target.value, ''); this.elements.style.value = ''; this.updateLivePreview(); }, 'role');
    safeAddListener(this.elements.style, 'change', (e) => { console.log("[EVENT] Style changed"); this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); }, 'style');
    safeAddListener(this.elements.name, 'input', () => { console.log("[EVENT] Name input"); this.updateLivePreview(); }, 'name');
    safeAddListener(this.elements.save, 'click', () => { console.log("[EVENT] Save button clicked"); this.savePerson(); }, 'save');
    safeAddListener(this.elements.clearForm, 'click', () => { console.log("[EVENT] Clear Form button clicked"); this.resetForm(true); }, 'clearForm');
    safeAddListener(this.elements.avatarPicker, 'click', (e) => { if (e.target.classList.contains('avatar-btn')) { console.log("[EVENT] Avatar button clicked"); const emoji = e.target.dataset.emoji; this.elements.avatarInput.value = emoji; this.elements.avatarDisplay.textContent = emoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b=>b.classList.remove('selected')); e.target.classList.add('selected'); this.updateLivePreview();} }, 'avatarPicker');
    safeAddListener(this.elements.traitsContainer, 'input', (e) => { if (e.target.classList.contains('trait-slider')) { /* console.log("[EVENT] Trait slider input"); // Can be very noisy */ this.handleTraitSliderInput(e); this.updateLivePreview(); } }, 'traitsContainer input');
    safeAddListener(this.elements.traitsContainer, 'click', (e) => { if (e.target.classList.contains('trait-info-btn')) { console.log("[EVENT] Trait info button clicked"); this.handleTraitInfoClick(e); } }, 'traitsContainer click');
    safeAddListener(this.elements.formStyleFinderLink, 'click', () => { console.log("[EVENT] Form Style Finder link clicked"); this.sfStart(); }, 'formStyleFinderLink');

    // Popups & Context Help
    safeAddListener(document.body, 'click', (e) => { if (e.target.classList.contains('context-help-btn')) { console.log("[EVENT] Context help button clicked"); const key = e.target.dataset.helpKey; if(key) this.showContextHelp(key); } }, 'body context-help');
    safeAddListener(this.elements.traitInfoClose, 'click', () => { console.log("[EVENT] Trait info popup close clicked"); this.hideTraitInfo(); }, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', () => { console.log("[EVENT] Context help popup close clicked"); this.hideContextHelp(); }, 'contextHelpClose');

    // Persona List Interaction
    safeAddListener(this.elements.peopleList, 'click', this.handleListClick, 'peopleList click');
    safeAddListener(this.elements.peopleList, 'keydown', this.handleListKeydown, 'peopleList keydown');

    // Modal Close Buttons (Using a more generic approach for modals with standard close buttons)
    const modalsToClose = [
        { modal: this.elements.modal, button: this.elements.modalClose, name: 'detailModal' },
        { modal: this.elements.resourcesModal, button: this.elements.resourcesClose, name: 'resourcesModal' },
        { modal: this.elements.glossaryModal, button: this.elements.glossaryClose, name: 'glossaryModal' },
        { modal: this.elements.styleDiscoveryModal, button: this.elements.styleDiscoveryClose, name: 'styleDiscoveryModal' },
        { modal: this.elements.themesModal, button: this.elements.themesClose, name: 'themesModal' },
        { modal: this.elements.welcomeModal, button: this.elements.welcomeClose, name: 'welcomeModal' },
        { modal: this.elements.achievementsModal, button: this.elements.achievementsClose, name: 'achievementsModal' },
        { modal: this.elements.sfModal, button: this.elements.sfCloseBtn, name: 'sfModal' } // Style Finder uses sfClose, handle separately? No, sfClose just calls closeModal
    ];

    modalsToClose.forEach(item => {
        safeAddListener(item.button, 'click', () => {
            console.log(`[EVENT] Close button clicked for ${item.name}`);
            this.closeModal(item.modal);
        }, `${item.name} Close Button`);
    });
    // Keep SF specific close logic if needed, though closeModal should handle it.
    // safeAddListener(this.elements.sfCloseBtn, 'click', () => { console.log("[EVENT] SF Close button clicked"); this.sfClose(); }, 'sfCloseBtn');


    // Header/Feature Buttons
    safeAddListener(this.elements.resourcesBtn, 'click', () => { console.log("[EVENT] Resources button clicked"); grantAchievement({}, 'resource_reader'); localStorage.setItem('kinkCompass_resource_reader', 'true'); this.openModal(this.elements.resourcesModal); }, 'resourcesBtn');
    safeAddListener(this.elements.glossaryBtn, 'click', () => { console.log("[EVENT] Glossary button clicked"); grantAchievement({}, 'glossary_user'); localStorage.setItem('kinkCompass_glossary_used', 'true'); this.showGlossary(); }, 'glossaryBtn');
    safeAddListener(this.elements.styleDiscoveryBtn, 'click', () => { console.log("[EVENT] Style Discovery button clicked"); grantAchievement({}, 'style_discovery'); localStorage.setItem('kinkCompass_style_discovery_viewed', 'true'); this.showStyleDiscovery(); }, 'styleDiscoveryBtn');
    safeAddListener(this.elements.themesBtn, 'click', () => { console.log("[EVENT] Themes button clicked"); this.openModal(this.elements.themesModal); }, 'themesBtn');
    safeAddListener(this.elements.achievementsBtn, 'click', () => { console.log("[EVENT] Achievements button clicked"); this.showAchievements(); }, 'achievementsBtn');
    safeAddListener(this.elements.themeToggle, 'click', () => { console.log("[EVENT] Theme toggle button clicked"); this.toggleTheme(); }, 'themeToggle');
    safeAddListener(this.elements.exportBtn, 'click', () => { console.log("[EVENT] Export button clicked"); this.exportData(); }, 'exportBtn');
    safeAddListener(this.elements.importBtn, 'click', () => { console.log("[EVENT] Import button clicked"); this.elements.importFileInput?.click(); }, 'importBtn');
    safeAddListener(this.elements.importFileInput, 'change', (e) => { console.log("[EVENT] Import file selected"); this.importData(e); }, 'importFileInput');
    safeAddListener(this.elements.styleFinderTriggerBtn, 'click', () => { console.log("[EVENT] Header Style Finder trigger clicked"); this.sfStart(); }, 'styleFinderTriggerBtn');

    // Other UI Listeners
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => { console.log("[EVENT] Style Discovery filter changed"); this.renderStyleDiscoveryContent(); }, 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody'); // Handles clicks inside the detail modal
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs');
    safeAddListener(this.elements.glossaryBody, 'click', this.handleGlossaryLinkClick, 'glossaryBody');
    safeAddListener(document.body, 'click', this.handleGlossaryLinkClick, 'body glossaryLink'); // Delegate glossary link clicks
    safeAddListener(this.elements.styleExploreLink, 'click', this.handleExploreStyleLinkClick, 'styleExploreLink');

    // Style Finder Modal Internal Listeners
    safeAddListener(this.elements.sfStepContent, 'click', (e) => { const button = e.target.closest('button'); if (button) { const action = button.dataset.action; if (action) { console.log(`[EVENT] SF button action: ${action}`); this.handleStyleFinderAction(action, button.dataset); } else if (button.classList.contains('sf-info-icon')) { console.log("[EVENT] SF trait info icon clicked"); const traitName = button.dataset.trait; if (traitName) this.sfShowTraitInfo(traitName); } } }, 'sfStepContent click');
    safeAddListener(this.elements.sfStepContent, 'input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { /* console.log("[EVENT] SF slider input"); // Noisy */ this.handleStyleFinderSliderInput(e.target); } }, 'sfStepContent input');

    // Window Listeners
    safeAddListener(window, 'keydown', this.handleWindowKeydown, 'window keydown');
    safeAddListener(window, 'click', this.handleWindowClick, 'window click'); // For closing popups on outside click

    console.log("[ADD_LISTENERS] Setup COMPLETE.");
  } // End addEventListeners

  // --- Event Handlers ---
  handleListClick(e) {
      console.log("[HANDLE_LIST_CLICK] START - Click detected.");
      console.log("  Target Element:", e.target);
      const target = e.target;
      const listItem = target.closest('li[data-id]');

      if (!listItem) {
          console.log("[HANDLE_LIST_CLICK] Click outside valid LI. Ignoring.");
          return;
      }

      const personIdStr = listItem.dataset.id;
      const personId = parseInt(personIdStr, 10);

      if (isNaN(personId)) {
          console.warn("[HANDLE_LIST_CLICK] Invalid personId:", personIdStr);
          return;
      }

      console.log(`[HANDLE_LIST_CLICK] Processing click for personId: ${personId}`);

      if (target.closest('.edit-btn')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Edit");
          this.editPerson(personId);
      } else if (target.closest('.delete-btn')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Delete");
          const person = this.people.find(p => p.id === personId);
          const name = person?.name || 'persona';
          if (confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
              console.log("[HANDLE_LIST_CLICK] Delete confirmed.");
              this.deletePerson(personId);
          } else {
              console.log("[HANDLE_LIST_CLICK] Delete cancelled.");
          }
      } else if (target.closest('.person-info')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Info -> Calling showPersonDetails");
          this.showPersonDetails(personId);
      } else {
          console.log("[HANDLE_LIST_CLICK] Click inside LI but not on known actionable element.");
      }
      console.log("[HANDLE_LIST_CLICK] END");
  } // End handleListClick

  handleListKeydown(e) {
      console.log(`[HANDLE_LIST_KEYDOWN] Key pressed: ${e.key}`);
      if (e.key !== 'Enter' && e.key !== ' ') {
           console.log("[HANDLE_LIST_KEYDOWN] Irrelevant key. Ignoring.");
           return;
      }

      const target = e.target;
      const listItem = target.closest('li[data-id]');
      if (!listItem) {
           console.log("[HANDLE_LIST_KEYDOWN] Not focused within a list item. Ignoring.");
           return;
      }

      console.log(`[HANDLE_LIST_KEYDOWN] Target element:`, target);
      const personIdStr = listItem.dataset.id;
      const personId = parseInt(personIdStr, 10);

      if (isNaN(personId)) {
          console.warn("[HANDLE_LIST_KEYDOWN] Invalid personId:", personIdStr);
          return;
      }

      // If key pressed on an action button (Edit/Delete)
      if (target.closest('.person-actions') && (target.classList.contains('edit-btn') || target.classList.contains('delete-btn'))) {
          console.log("[HANDLE_LIST_KEYDOWN] Activating action button via keypress.");
          e.preventDefault(); // Prevent default spacebar scroll or Enter form submission
          target.click(); // Simulate click
      }
      // If Enter key pressed on the main info part or the list item itself
      else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) {
          console.log("[HANDLE_LIST_KEYDOWN] Activating details view via Enter key.");
          e.preventDefault();
          this.showPersonDetails(personId);
      } else {
           console.log("[HANDLE_LIST_KEYDOWN] Keypress on list item, but not actionable target/key combination.");
      }
  } // End handleListKeydown

  handleWindowClick(e) {
      // Close trait info popup if click is outside
      if (this.elements.traitInfoPopup?.getAttribute('aria-hidden') === 'false') {
          const popupContent = this.elements.traitInfoPopup; //.querySelector('.card'); // Assuming popup itself is the boundary
          const triggeringButton = document.querySelector('.trait-info-btn[aria-expanded="true"]');
          if (popupContent && !popupContent.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
              console.log("[WINDOW_CLICK] Click outside trait info popup. Closing.");
              this.hideTraitInfo();
          }
      }
      // Close context help popup if click is outside
      if (this.elements.contextHelpPopup?.getAttribute('aria-hidden') === 'false') {
          const popupContent = this.elements.contextHelpPopup; //.querySelector('.card');
          const triggeringButton = document.querySelector('.context-help-btn[aria-expanded="true"]');
          if (popupContent && !popupContent.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
              console.log("[WINDOW_CLICK] Click outside context help popup. Closing.");
              this.hideContextHelp();
          }
      }
      // Close Style Finder info popup if click is outside
      const sfInfoPopup = document.querySelector('.sf-style-info-popup'); // Needs to be queried dynamically
      if (sfInfoPopup) {
          const triggeringButton = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active'); // Identify trigger
          if (!sfInfoPopup.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
               console.log("[WINDOW_CLICK] Click outside SF info popup. Removing.");
               sfInfoPopup.remove();
               triggeringButton?.classList.remove('active'); // Deactivate trigger button state
           }
      }
  }

  handleWindowKeydown(e) {
      // console.log(`[WINDOW_KEYDOWN] Key pressed: ${e.key}`); // Can be noisy
      if (e.key === 'Escape') {
          console.log("[WINDOW_KEYDOWN] Escape key detected.");
          // Priority: Close specific popups first
          if (this.elements.traitInfoPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[WINDOW_KEYDOWN] Closing trait info popup via Escape.");
              this.hideTraitInfo();
              return;
          }
          if (this.elements.contextHelpPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[WINDOW_KEYDOWN] Closing context help popup via Escape.");
              this.hideContextHelp();
              return;
          }
          const sfInfoPopup = document.querySelector('.sf-style-info-popup');
          if (sfInfoPopup) {
               console.log("[WINDOW_KEYDOWN] Removing SF info popup via Escape.");
               sfInfoPopup.remove();
               document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active'); // Deactivate trigger
               return;
           }

          // Then, close any active modal
          const openModal = document.querySelector('.modal[aria-hidden="false"]');
          if (openModal) {
              console.log(`[WINDOW_KEYDOWN] Closing active modal #${openModal.id} via Escape.`);
              this.closeModal(openModal);
          } else {
              console.log("[WINDOW_KEYDOWN] Escape pressed, but no active modal or known popup found.");
          }
      }
  }

  handleTraitSliderInput(e) {
      const slider = e.target;
      const traitElement = slider.closest('.trait');
      const valueDisplay = traitElement?.querySelector('.trait-value');
      if (valueDisplay) {
          valueDisplay.textContent = slider.value;
          // console.log(`[TRAIT_SLIDER] Value updated for ${traitElement.dataset.traitName || 'unknown trait'} to ${slider.value}`); // Noisy
      } else {
           console.warn("[TRAIT_SLIDER] Could not find value display element for slider:", slider);
      }
      this.updateTraitDescription(slider);
  }

  handleTraitInfoClick(e) {
      const button = e.target.closest('.trait-info-btn');
      if (!button) {
           console.warn("[TRAIT_INFO_CLICK] Click registered, but not on a .trait-info-btn.");
           return;
      }
      const traitName = button.dataset.trait;
      if (!traitName) {
          console.warn("[TRAIT_INFO_CLICK] .trait-info-btn clicked, but missing data-trait attribute.");
          return;
      }
      console.log(`[TRAIT_INFO_CLICK] Showing info for trait: ${traitName}`);
      this.showTraitInfo(traitName);

      // Manage aria-expanded for accessibility
      document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
          if (btn !== button) {
              btn.setAttribute('aria-expanded', 'false');
          }
      });
      button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  }

  handleModalBodyClick(e) {
      console.log("[MODAL_BODY_CLICK] Click detected inside modal body.");
      const detailModal = this.elements.modal;
      const personIdStr = detailModal?.dataset.personId;

      if (!personIdStr) {
          console.log("[MODAL_BODY_CLICK] No personId found on detail modal. Ignoring click.");
          return; // Click likely not relevant to persona actions
      }

      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) {
          console.warn("[MODAL_BODY_CLICK] Invalid personId on detail modal:", personIdStr);
          return;
      }

      const target = e.target;
      const button = target.closest('button'); // Find nearest button ancestor

      if (button) {
          console.log(`[MODAL_BODY_CLICK] Button clicked with ID: ${button.id}, Classes: ${button.className}`);

          // Goal Actions
          if (button.classList.contains('toggle-goal-btn')) {
              const goalIdStr = button.dataset.goalId;
              const goalId = parseInt(goalIdStr, 10);
              if (!isNaN(goalId)) {
                  console.log(`[MODAL_BODY_CLICK] Toggling goal ${goalId} for person ${personId}`);
                  this.toggleGoalStatus(personId, goalId, button.closest('li'));
              } else { console.warn("[MODAL_BODY_CLICK] Invalid goalId on toggle button:", goalIdStr); }
              return; // Handled
          }
          if (button.classList.contains('delete-goal-btn')) {
              const goalIdStr = button.dataset.goalId;
              const goalId = parseInt(goalIdStr, 10);
              if (!isNaN(goalId)) {
                  if (confirm("Are you sure you want to delete this goal?")) {
                       console.log(`[MODAL_BODY_CLICK] Deleting goal ${goalId} for person ${personId}`);
                       this.deleteGoal(personId, goalId);
                  } else { console.log("[MODAL_BODY_CLICK] Goal deletion cancelled."); }
              } else { console.warn("[MODAL_BODY_CLICK] Invalid goalId on delete button:", goalIdStr); }
              return; // Handled
          }
          // Add Goal (if form is submitted via button click)
          if (button.id === 'add-goal-btn') { // Assuming your add goal button has this ID
              const form = button.closest('form'); // Find the form
              if (form) {
                  console.log(`[MODAL_BODY_CLICK] Adding goal for person ${personId}`);
                  this.addGoal(personId, form);
              } else { console.warn("[MODAL_BODY_CLICK] Add goal button clicked, but no parent form found."); }
              return; // Handled
          }

          // Other Modal Actions
          switch (button.id) {
              case 'snapshot-btn':
                  console.log(`[MODAL_BODY_CLICK] Adding snapshot for person ${personId}`);
                  this.addSnapshotToHistory(personId);
                  return;
              case 'journal-prompt-btn':
                  console.log(`[MODAL_BODY_CLICK] Getting journal prompt for person ${personId}`);
                  this.showJournalPrompt(personId);
                  return;
              case 'save-reflections-btn':
                  console.log(`[MODAL_BODY_CLICK] Saving reflections for person ${personId}`);
                  this.saveReflections(personId);
                  return;
              case 'oracle-btn':
                  console.log(`[MODAL_BODY_CLICK] Getting oracle reading for person ${personId}`);
                  this.showKinkOracle(personId);
                  return;
          }

          // Glossary Links within Modal
          if (button.classList.contains('glossary-link')) {
              const termKey = button.dataset.termKey;
              if (termKey) {
                   console.log(`[MODAL_BODY_CLICK] Glossary link clicked for term: ${termKey}`);
                   e.preventDefault();
                   this.closeModal(detailModal);
                   this.showGlossary(termKey);
              } else { console.warn("[MODAL_BODY_CLICK] Glossary link button clicked, but missing data-term-key."); }
              return; // Handled
          }
      }

        // Handle Add Goal Form Submission (if using form submit event)
        if (target.closest('form') && target.tagName === 'FORM') {
            const form = target;
            if(form.id === 'add-goal-form') { // Assuming your form has this ID
                e.preventDefault(); // Prevent default form submission
                console.log(`[MODAL_BODY_CLICK] Add goal form submitted for person ${personId}`);
                this.addGoal(personId, form);
                return; // Handled
            }
        }


      console.log("[MODAL_BODY_CLICK] Click inside modal body did not match known actions.");
  }

  handleThemeSelection(e) {
      console.log("[HANDLE_THEME_SELECTION] Click detected in themes body.");
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) {
          const themeName = button.dataset.theme;
          console.log(`[HANDLE_THEME_SELECTION] Theme button clicked: ${themeName}`);
          this.setTheme(themeName);
          this.closeModal(this.elements.themesModal); // Close the modal after selection
      } else {
          console.log("[HANDLE_THEME_SELECTION] Click was not on a theme button.");
      }
  }

  handleStyleFinderAction(action, dataset = {}) {
       console.log(`[SF_ACTION] Handling action: ${action}`, dataset);
       switch (action) {
           case 'start':
               this.sfNextStep();
               break;
           case 'setRole':
               if (dataset.role) {
                   this.sfSetRole(dataset.role);
               } else { console.warn("[SF_ACTION] setRole action missing role data."); }
               break;
           case 'next':
               this.sfNextStep(dataset.currenttrait || null);
               break;
           case 'prev':
               this.sfPrevStep();
               break;
           case 'startOver':
               this.sfStartOver();
               break;
           case 'showDetails':
                if (dataset.style) {
                    this.sfShowFullDetails(dataset.style); // Pass the style name with emoji
                    const button = event?.target.closest('button');
                    button?.classList.add('active'); // Mark button as active for popup closing logic
                } else { console.warn("[SF_ACTION] showDetails action missing style data."); }
               break;
           case 'confirmApply':
                if(dataset.role && dataset.style) {
                    this.confirmApplyStyleFinderResult(dataset.role, dataset.style);
                } else { console.warn("[SF_ACTION] confirmApply action missing role or style data.");}
                break;
           default:
               console.warn(`[SF_ACTION] Unknown action: ${action}`);
       }
   }

   handleStyleFinderSliderInput(sliderElement) {
        const traitName = sliderElement.dataset.trait;
        const value = sliderElement.value;
        const descriptionElement = document.getElementById(`sf-desc-${traitName}`); // Use specific ID for SF descriptions

        if (!traitName) {
            console.warn("[SF_SLIDER] Slider input missing data-trait attribute.");
            return;
        }

        // Update internal state
        this.sfSetTrait(traitName, value);

        // Update description text based on value
        const roleDescriptions = this.sliderDescriptions; // Get descriptions for the current SF role
        if (descriptionElement && roleDescriptions && roleDescriptions[traitName]) {
            const descArray = roleDescriptions[traitName];
            const index = parseInt(value, 10) - 1; // Value is 1-10, index is 0-9
            if (index >= 0 && index < descArray.length) {
                descriptionElement.textContent = descArray[index];
                // console.log(`[SF_SLIDER] Updated description for ${traitName} to: ${descArray[index]}`); // Noisy
            } else { console.warn(`[SF_SLIDER] Invalid index ${index} for description array of ${traitName}`); }
        } else {
            // console.warn(`[SF_SLIDER] Could not find description element or data for ${traitName}`); // Can be noisy if descriptions aren't set yet
        }

        // Update the live dashboard
        this.sfUpdateDashboard();
    }

  handleDetailTabClick(e) {
      const target = e.target.closest('.tab-link');
      if (!target) {
          console.log("[DETAIL_TAB_CLICK] Click not on a tab link.");
          return;
      }

      e.preventDefault(); // Prevent any default link behavior
      const tabId = target.dataset.tabId;
      console.log(`[DETAIL_TAB_CLICK] Clicked tab: ${tabId}`);

      if (!tabId) {
          console.warn("[DETAIL_TAB_CLICK] Tab link clicked, but missing data-tab-id.");
          return;
      }

      const personIdStr = this.elements.modal?.dataset.personId;
      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) {
          console.warn("[DETAIL_TAB_CLICK] Could not get valid personId from modal.");
          return;
      }

      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[DETAIL_TAB_CLICK] Person not found for ID: ${personId}`);
          return;
      }

      // Deactivate other tabs and content panes
      this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
      this.elements.modalBody.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));

      // Activate clicked tab and corresponding content pane
      target.classList.add('active');
      const activePane = this.elements.modalBody.querySelector(`.tab-content[data-tab-id="${tabId}"]`);
      if (activePane) {
          activePane.classList.add('active');
          this.activeDetailModalTab = tabId; // Store the active tab
          console.log(`[DETAIL_TAB_CLICK] Rendering content for active tab: ${tabId}`);
          // Render content *only if it hasn't been rendered yet* or needs refresh
          // For simplicity now, we might re-render each time, but check if content already exists
          if (!activePane.innerHTML.trim() || tabId === 'tab-history') { // Re-render history chart always for now
                this.renderDetailTabContent(person, tabId, activePane);
            } else {
                console.log(`[DETAIL_TAB_CLICK] Content for ${tabId} already exists, skipping re-render.`);
            }

      } else {
          console.warn(`[DETAIL_TAB_CLICK] Could not find content pane for tabId: ${tabId}`);
      }
  }

  handleGlossaryLinkClick(e) {
      // This handles links *anywhere* with class 'glossary-link'
      const link = e.target.closest('.glossary-link');
      if (link) {
          const termKey = link.dataset.termKey;
          if (termKey) {
                console.log(`[GLOSSARY_LINK_CLICK] Link clicked for term: ${termKey}`);
                e.preventDefault(); // Prevent default link behavior

                // If currently inside another modal, close it first
                const openModal = document.querySelector('.modal[aria-hidden="false"]:not(#glossary-modal)');
                if(openModal) {
                    console.log(`[GLOSSARY_LINK_CLICK] Closing currently open modal: #${openModal.id}`);
                    this.closeModal(openModal);
                }

                this.showGlossary(termKey); // Open glossary and highlight
            } else { console.warn("[GLOSSARY_LINK_CLICK] Glossary link clicked, but missing data-term-key."); }
      }
  }

  handleExploreStyleLinkClick(e) {
        e.preventDefault(); // Prevent default link behavior
        const styleName = e.target.dataset.styleName;
        if (styleName) {
            console.log(`[EXPLORE_STYLE_LINK] Clicked for style: ${styleName}`);
            this.showStyleDiscovery(styleName); // Open Style Discovery and highlight
        } else {
            console.warn("[EXPLORE_STYLE_LINK] Explore link clicked, but missing data-style-name.");
        }
    }


  // --- Core Rendering ---
  renderStyles(roleKey) {
      console.log(`[RENDERSTYLES] START - Rendering styles for roleKey: ${roleKey}`);
      const styleSelect = this.elements.style;

      if (!styleSelect) {
          console.error("[RENDERSTYLES] CRITICAL - Style select element not found!");
          return;
      }

      if (!roleKey) {
          console.warn("[RENDERSTYLES] No role key provided. Clearing options.");
          styleSelect.innerHTML = '<option value="">-- Select Role First --</option>';
          console.log("[RENDERSTYLES] END - No role key.");
          return;
      }

      console.log(`[RENDERSTYLES] Accessing bdsmData[${roleKey}].styles`);
      const stylesData = bdsmData[roleKey]?.styles;
      console.log(`[RENDERSTYLES] Data retrieved:`, stylesData);


      if (!stylesData || !Array.isArray(stylesData)) {
          console.warn(`[RENDERSTYLES] No styles array found for role ${roleKey}.`);
          styleSelect.innerHTML = '<option value="">-- No Styles Available --</option>';
          console.log("[RENDERSTYLES] END - No styles data.");
          return;
      }

      console.log(`[RENDERSTYLES] Found ${stylesData.length} styles for role ${roleKey}. Clearing existing options.`);
      styleSelect.innerHTML = '<option value="">-- Select a Style --</option>'; // Reset dropdown

      console.log("[RENDERSTYLES] Starting loop to add options...");
      stylesData.forEach((style, index) => {
          if (!style || typeof style.name !== 'string') {
              console.warn(`[RENDERSTYLES] Invalid style object at index ${index} for role ${roleKey}:`, style);
              return; // Skip invalid style objects
          }
          const option = document.createElement('option');
          option.value = style.name; // Use the full name with emoji as value
          option.textContent = style.name; // Display name with emoji

          // console.log(`  [RENDERSTYLES LOOP ${index+1}] Creating option - value: ${option.value}, text: ${option.textContent}`);
          // console.log(`  [RENDERSTYLES LOOP ${index+1}] styleSelect element:`, styleSelect);
          styleSelect.appendChild(option);
      });
      console.log("[RENDERSTYLES] Finished adding options.");

      // Force browser reflow - might help with rendering updates
      styleSelect.offsetHeight;
      console.log("[RENDERSTYLES] Forced offsetHeight read.");

      console.log("[RENDERSTYLES] END");
  } // End renderStyles

  renderTraits(roleKey, styleName) {
      console.log(`[RENDERTRAITS] START - Rendering traits for role: ${roleKey}, style: ${styleName}`);
      const container = this.elements.traitsContainer;
      const messageEl = this.elements.traitsMessage;

      if (!container || !messageEl) {
          console.error("[RENDERTRAITS] CRITICAL - Traits container or message element not found!");
          return;
      }

      // Clear previous traits and hide message initially
      container.innerHTML = '';
      container.style.display = 'block'; // Ensure container is visible
      messageEl.style.display = 'none'; // Hide message

      if (!roleKey) {
          console.log("[RENDERTRAITS] No role selected. Displaying message.");
          messageEl.textContent = 'Select a Role above to see core traits.';
          messageEl.style.display = 'block';
          container.style.display = 'none'; // Hide container
          console.log("[RENDERTRAITS] END - No role.");
          return;
      }

      console.log(`[RENDERTRAITS] Accessing data for role: ${roleKey}`);
      const roleData = bdsmData[roleKey];
      if (!roleData) {
          console.warn(`[RENDERTRAITS] No data found for role: ${roleKey}`);
          messageEl.textContent = `Error: Data not found for role '${roleKey}'.`;
          messageEl.style.display = 'block';
          container.style.display = 'none';
          console.log("[RENDERTRAITS] END - Role data not found.");
          return;
      }

      let traitsToRender = [];
      // Add core traits for the role
      if (roleData.coreTraits && Array.isArray(roleData.coreTraits)) {
          console.log(`[RENDERTRAITS] Found ${roleData.coreTraits.length} core traits for ${roleKey}.`);
          traitsToRender.push(...roleData.coreTraits);
      } else {
           console.warn(`[RENDERTRAITS] No core traits found or invalid format for role ${roleKey}.`);
      }

      // Find the specific style object if a style is selected
      let selectedStyleObj = null;
      if (styleName && roleData.styles && Array.isArray(roleData.styles)) {
          selectedStyleObj = roleData.styles.find(s => s.name === styleName);
          if (selectedStyleObj) {
              console.log(`[RENDERTRAITS] Found style object for: ${styleName}`);
              if (selectedStyleObj.traits && Array.isArray(selectedStyleObj.traits)) {
                  console.log(`[RENDERTRAITS] Found ${selectedStyleObj.traits.length} style-specific traits for ${styleName}.`);
                  traitsToRender.push(...selectedStyleObj.traits);
              } else {
                   console.log(`[RENDERTRAITS] No specific traits listed for style ${styleName}.`);
              }
          } else {
              console.warn(`[RENDERTRAITS] Style object not found for selected style: ${styleName}`);
          }
      } else if (styleName) {
           console.warn(`[RENDERTRAITS] Style name '${styleName}' provided, but no styles array found for role ${roleKey}.`);
      } else {
           console.log("[RENDERTRAITS] No style selected. Rendering core traits only (if any).");
      }

      // Remove duplicate traits (preferring style-specific ones if names clash, though data structure should ideally prevent this)
      const uniqueTraitNames = new Set();
      const finalTraits = traitsToRender.filter(trait => {
          if (!trait || typeof trait.name !== 'string') {
                console.warn("[RENDERTRAITS] Filtering out invalid trait object:", trait);
                return false;
          }
          if (!uniqueTraitNames.has(trait.name)) {
              uniqueTraitNames.add(trait.name);
              return true;
          }
          console.log(`[RENDERTRAITS] Duplicate trait name found and removed: ${trait.name}`);
          return false;
      });

      console.log(`[RENDERTRAITS] Total unique traits to render: ${finalTraits.length}`);

      if (finalTraits.length === 0) {
           if (styleName) {
                messageEl.textContent = `No specific traits defined for '${styleName}'. Explore freely!`;
            } else if (roleKey) {
                messageEl.textContent = `No core traits defined for role '${roleKey}'. Explore general concepts!`;
            } else { // Should not happen based on checks above, but as a failsafe
                messageEl.textContent = 'Select Role & Style to see relevant traits...';
            }
           messageEl.style.display = 'block';
           container.style.display = 'none';
           console.log("[RENDERTRAITS] END - No traits to render.");
           return;
      }

       // Get current values if editing
        let currentValues = {};
        if (this.currentEditId !== null) {
            const person = this.people.find(p => p.id === this.currentEditId);
            currentValues = person?.traits || {};
            console.log(`[RENDERTRAITS] Loading current trait values for editing person ID ${this.currentEditId}:`, currentValues);
        } else {
            console.log(`[RENDERTRAITS] Not in edit mode, using default trait values.`);
        }


      console.log("[RENDERTRAITS] Starting loop to create trait HTML...");
      finalTraits.forEach((trait, index) => {
          const currentValue = currentValues[trait.name] !== undefined ? currentValues[trait.name] : 3; // Default to 3 if not editing or trait missing
          // console.log(`  [RENDERTRAITS LOOP ${index+1}] Rendering trait: ${trait.name}, Current value: ${currentValue}`); // Noisy
          const traitHTML = this.createTraitHTML(trait, currentValue);
          container.insertAdjacentHTML('beforeend', traitHTML);
          // Update description for the initially rendered slider value
          const slider = container.querySelector(`input[name="${trait.name}"]`);
          if(slider) {
              this.updateTraitDescription(slider);
          } else {
               console.warn(`[RENDERTRAITS LOOP ${index+1}] Could not find slider element immediately after inserting HTML for trait: ${trait.name}`);
          }
      });
      console.log("[RENDERTRAITS] Finished creating trait HTML.");

      // Add context help button if needed
      // Example: Add a general help button for the traits section
      // if (!container.querySelector('.context-help-btn')) {
      //     container.insertAdjacentHTML('beforeend', `<button type="button" class="context-help-btn" data-help-key="traits" aria-label="Help with traits">?</button>`);
      // }


      console.log("[RENDERTRAITS] END");
  } // End renderTraits

  createTraitHTML(trait, value = 3) {
      // console.log(`[CREATE_TRAIT_HTML] Creating HTML for trait: ${trait.name}, value: ${value}`); // Noisy
      if (!trait || !trait.name || !trait.desc) {
           console.error("[CREATE_TRAIT_HTML] Invalid trait object provided:", trait);
           return '<p class="error-text">Error rendering trait.</p>';
      }

       // Ensure value is within 1-5 range
       const validValue = Math.max(1, Math.min(5, parseInt(value, 10) || 3));

       return `
        <div class="trait" data-trait-name="${this.escapeHTML(trait.name)}">
            <label class="trait-label" for="trait-${this.escapeHTML(trait.name)}">
                ${this.escapeHTML(trait.name)}
                <button type="button" class="trait-info-btn small-btn context-help-btn" data-trait="${this.escapeHTML(trait.name)}" aria-label="Info about ${this.escapeHTML(trait.name)}" aria-expanded="false">?</button>
            </label>
            <input type="range" id="trait-${this.escapeHTML(trait.name)}" name="${this.escapeHTML(trait.name)}" class="trait-slider" min="1" max="5" value="${validValue}" aria-describedby="desc-${this.escapeHTML(trait.name)}">
            <span class="trait-value" aria-live="polite">${validValue}</span>
            <div id="desc-${this.escapeHTML(trait.name)}" class="trait-desc muted-text" aria-live="polite">
                ${this.escapeHTML(trait.desc[validValue] || 'Loading description...')}
            </div>
        </div>
    `;
  }

  updateTraitDescription(slider) {
      if (!slider) {
            console.warn("[UPDATE_TRAIT_DESC] Called with null slider.");
            return;
      }
      const traitName = slider.name;
      const value = slider.value;
      const descElement = document.getElementById(`desc-${traitName}`);

      if (!descElement) {
            // console.warn(`[UPDATE_TRAIT_DESC] Description element not found for trait: ${traitName}`); // Can be noisy
            return;
      }

      // Find the trait definition in bdsmData to get the descriptions
      let traitDefinition = null;
      for (const roleKey in bdsmData) {
          const roleData = bdsmData[roleKey];
          const coreTrait = roleData.coreTraits?.find(t => t.name === traitName);
          if (coreTrait) {
              traitDefinition = coreTrait;
              break;
          }
          const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
          if (styleTrait) {
              traitDefinition = styleTrait;
              break;
          }
      }

      if (traitDefinition && traitDefinition.desc && traitDefinition.desc[value]) {
            descElement.textContent = this.escapeHTML(traitDefinition.desc[value]);
            // console.log(`[UPDATE_TRAIT_DESC] Updated description for ${traitName} to: ${traitDefinition.desc[value]}`); // Noisy
      } else {
            descElement.textContent = '...'; // Fallback
            console.warn(`[UPDATE_TRAIT_DESC] Could not find description for trait '${traitName}' at value ${value}.`);
      }
  }

  renderList() {
    console.log("[RENDERLIST] START - Rendering persona list.");
    const listElement = this.elements.peopleList;
    if (!listElement) {
        console.error("[RENDERLIST] CRITICAL - People list element not found!");
        return;
    }

    console.log(`[RENDERLIST] Number of personas to render: ${this.people.length}`);
    listElement.innerHTML = ''; // Clear existing list

    if (this.people.length === 0) {
        listElement.innerHTML = '<li class="muted-text">No personas created yet. Use the form to add one!</li>';
        console.log("[RENDERLIST] List is empty. Displaying message.");
    } else {
        console.log("[RENDERLIST] Starting loop to create list items...");
        this.people.forEach((person, index) => {
            // console.log(`  [RENDERLIST LOOP ${index+1}] Creating item for person ID ${person.id}, Name: ${person.name}`); // Noisy
            const listItemHTML = this.createPersonListItemHTML(person);
            listElement.insertAdjacentHTML('beforeend', listItemHTML);
        });

        // Highlight the last saved/edited item briefly
        if (this.lastSavedId !== null) {
            const newlySavedItem = listElement.querySelector(`li[data-id="${this.lastSavedId}"]`);
            if (newlySavedItem) {
                console.log(`[RENDERLIST] Highlighting newly saved item ID: ${this.lastSavedId}`);
                newlySavedItem.classList.add('item-just-saved');
                setTimeout(() => {
                    newlySavedItem.classList.remove('item-just-saved');
                    console.log(`[RENDERLIST] Removing highlight from item ID: ${this.lastSavedId}`);
                }, 1500); // Match animation duration
            }
            this.lastSavedId = null; // Reset after highlighting
        }
        console.log("[RENDERLIST] Finished creating list items.");
    }
    console.log("[RENDERLIST] END");
  } // End renderList

  createPersonListItemHTML(person) {
       // console.log(`[CREATE_PERSON_HTML] Generating HTML for person ID ${person.id}`); // Noisy
       if (!person || person.id === undefined) {
            console.error("[CREATE_PERSON_HTML] Invalid person object received:", person);
            return '<li>Error rendering persona.</li>';
       }

        // Basic achievement count for preview
        const achievementCount = person.achievements?.length || 0;
        const achievementPreview = achievementCount > 0 ? `<span class="person-achievements-preview">🏆 ${achievementCount}</span>` : '';
        const truncatedName = person.name.length > 30 ? person.name.substring(0, 27) + "..." : person.name;

        return `
            <li data-id="${person.id}" tabindex="-1">
                <div class="person-info" tabindex="0" role="button" aria-label="View details for ${this.escapeHTML(person.name)}">
                    <span class="person-avatar" aria-hidden="true">${this.escapeHTML(person.avatar || '❓')}</span>
                    <div class="person-name-details">
                        <span class="person-name">${this.escapeHTML(truncatedName)}</span>
                        <span class="person-details muted-text">${this.escapeHTML(person.role || '')} / ${this.escapeHTML(person.style || 'N/A')} ${achievementPreview}</span>
                    </div>
                </div>
                <div class="person-actions">
                    <button class="small-btn edit-btn" aria-label="Edit ${this.escapeHTML(person.name)}">Edit</button>
                    <button class="small-btn delete-btn" aria-label="Delete ${this.escapeHTML(person.name)}">Delete</button>
                </div>
            </li>
        `;
    }

   updateStyleExploreLink() {
        const styleSelect = this.elements.style;
        const link = this.elements.styleExploreLink;
        if (!link || !styleSelect) return;

        const selectedStyleName = styleSelect.value;

        if (selectedStyleName) {
            console.log(`[UPDATE_STYLE_LINK] Updating explore link for style: ${selectedStyleName}`);
            link.dataset.styleName = selectedStyleName; // Store the name for the handler
            link.style.display = 'inline'; // Show the link
            link.setAttribute('aria-label', `Explore details for ${this.escapeHTML(selectedStyleName)}`);
        } else {
            console.log("[UPDATE_STYLE_LINK] No style selected. Hiding explore link.");
            link.style.display = 'none'; // Hide the link
            link.removeAttribute('data-style-name');
            link.setAttribute('aria-label', `Explore style details`);
        }
    }


  // --- CRUD ---
  savePerson() {
      console.log("[SAVE_PERSON] START");
      const name = this.elements.name.value.trim();
      const role = this.elements.role.value;
      const style = this.elements.style.value;
      const avatar = this.elements.avatarInput.value || '❓';

      console.log(`[SAVE_PERSON] Collected - Name: ${name}, Role: ${role}, Style: ${style}, Avatar: ${avatar}, Edit ID: ${this.currentEditId}`);

      // Basic Validation
      if (!name) {
          this.showNotification("Please enter a name for the persona.", "error");
          console.warn("[SAVE_PERSON] Validation failed: Name is missing.");
          this.elements.name.focus();
          return;
      }
      // Style validation might be needed if it's truly required
      if (!style && bdsmData[role]?.styles?.length > 0) { // Only require style if styles exist for the role
            this.showNotification("Please select a style for the persona.", "error");
            console.warn("[SAVE_PERSON] Validation failed: Style is missing.");
            this.elements.style.focus();
            return;
      }


      // Collect Trait Scores
      const traits = {};
      const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
      sliders.forEach(slider => {
          traits[slider.name] = parseInt(slider.value, 10);
      });
      console.log("[SAVE_PERSON] Collected traits:", traits);

      let personData;
      let isNewPerson = false;

      if (this.currentEditId !== null) {
          // --- Editing Existing Person ---
          console.log(`[SAVE_PERSON] Editing existing person ID: ${this.currentEditId}`);
          const personIndex = this.people.findIndex(p => p.id === this.currentEditId);
          if (personIndex === -1) {
              console.error(`[SAVE_PERSON] Edit failed: Person with ID ${this.currentEditId} not found!`);
              this.showNotification("Error: Could not find persona to update.", "error");
              this.resetForm(); // Reset form as edit failed
              return;
          }
          personData = this.people[personIndex];
          personData.name = name;
          personData.role = role;
          personData.style = style;
          personData.avatar = avatar;
          personData.traits = traits;
          personData.lastUpdated = new Date().toISOString();

          // Grant edit achievement
          grantAchievement(personData, 'profile_edited');
          console.log(`[SAVE_PERSON] Updated person data:`, personData);

      } else {
          // --- Creating New Person ---
          console.log("[SAVE_PERSON] Creating new person.");
          isNewPerson = true;
          const newId = Date.now(); // Simple ID generation
          personData = {
              id: newId,
              name,
              role,
              style,
              avatar,
              traits,
              goals: [],
              history: [],
              reflections: "",
              achievements: [],
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
          };
          // Grant creation achievement
          grantAchievement(personData, 'profile_created');
          // Grant avatar achievement if not default
          if (avatar !== '❓') grantAchievement(personData, 'avatar_chosen');

          this.people.push(personData);
          console.log(`[SAVE_PERSON] Created new person data with ID ${newId}:`, personData);
      }

      // Grant trait achievements
      Object.values(traits).forEach(score => {
         if(score === 5) grantAchievement(personData, 'max_trait');
         if(score === 1) grantAchievement(personData, 'min_trait');
      });

      // Check crew size achievement after adding new person
      if(isNewPerson && this.people.length >= 5) {
          // Grant achievement globally (using placeholder object) or find a relevant person
          grantAchievement({}, 'five_profiles');
          localStorage.setItem('kinkCompass_five_profiles', 'true'); // Store globally if needed elsewhere
      }


      this.lastSavedId = personData.id; // Store ID for highlighting
      this.saveToLocalStorage();
      this.showNotification(`Persona '${name}' saved successfully!`, 'success');
      this.renderList();
      this.resetForm(); // Resets edit ID and clears form
      console.log("[SAVE_PERSON] END - Save successful.");
  } // End savePerson

  editPerson(personId) {
      console.log(`[EDIT_PERSON] START - Editing person ID: ${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[EDIT_PERSON] Person with ID ${personId} not found.`);
          this.showNotification(`Error: Persona with ID ${personId} not found.`, "error");
          return;
      }

      console.log("[EDIT_PERSON] Found person:", person);

      this.elements.name.value = person.name;
      this.elements.role.value = person.role;
      this.elements.avatarInput.value = person.avatar || '❓';
      this.elements.avatarDisplay.textContent = person.avatar || '❓';

      // Select correct avatar button
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b=>b.classList.remove('selected'));
      const avatarBtn = this.elements.avatarPicker.querySelector(`.avatar-btn[data-emoji="${person.avatar}"]`);
      if(avatarBtn) avatarBtn.classList.add('selected');


      // Render styles *then* set value
      console.log("[EDIT_PERSON] Rendering styles for role:", person.role);
      this.renderStyles(person.role);
      this.elements.style.value = person.style;
      console.log("[EDIT_PERSON] Set style dropdown value to:", person.style);

      // Render traits *then* set values (renderTraits handles this internally now)
       console.log("[EDIT_PERSON] Rendering traits for role/style:", person.role, person.style);
       this.currentEditId = personId; // Set edit ID *before* rendering traits
       this.renderTraits(person.role, person.style);
       // Values are set inside renderTraits when currentEditId is not null


      // Update UI for editing state
      if (this.elements.formTitle) this.elements.formTitle.textContent = `✨ Editing: ${this.escapeHTML(person.name)} ✨`;
      this.elements.save.textContent = 'Update Persona!💾';
      this.elements.clearForm.textContent = 'Cancel Edit ❌'; // Change clear button text/functionality

      this.updateLivePreview(); // Update preview with loaded data
      this.updateStyleExploreLink(); // Update link based on loaded style

      // Scroll form into view (optional)
      this.elements.formSection.scrollIntoView({ behavior: 'smooth' });
      this.elements.name.focus(); // Focus on name field

      console.log("[EDIT_PERSON] END - Form populated for editing.");
  } // End editPerson

  deletePerson(personId) {
      console.log(`[DELETE_PERSON] START - Deleting person ID: ${personId}`);
      const initialLength = this.people.length;
      this.people = this.people.filter(p => p.id !== personId);

      if (this.people.length < initialLength) {
          this.saveToLocalStorage();
          this.renderList();
          this.showNotification("Persona deleted.", "info");
          console.log(`[DELETE_PERSON] END - Person ID ${personId} deleted successfully.`);
          // If the deleted person was being edited, reset the form
          if (this.currentEditId === personId) {
               console.log("[DELETE_PERSON] Deleted persona was being edited. Resetting form.");
               this.resetForm();
          }
      } else {
          console.error(`[DELETE_PERSON] END - Person ID ${personId} not found for deletion.`);
          this.showNotification("Error: Could not find persona to delete.", "error");
      }
  } // End deletePerson

  resetForm(isManualClear = false) {
      console.log(`[RESET_FORM] START - Manual clear: ${isManualClear}, Current Edit ID: ${this.currentEditId}`);

      // If canceling an edit, don't show notification, just reset state
      if (!isManualClear && this.currentEditId !== null) {
           console.log("[RESET_FORM] Canceling edit mode.");
      } else if (isManualClear) {
           console.log("[RESET_FORM] Manual form clear initiated.");
           // Optionally show notification for manual clear
           // this.showNotification("Form cleared.", "info");
      }


      this.elements.formSection.reset(); // Reset native form elements
      this.currentEditId = null; // Always reset edit ID

      // Manually reset elements not covered by form.reset()
      this.elements.avatarInput.value = '❓';
      this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));

      // Re-render styles/traits for the default role
      const defaultRole = this.elements.role.value; // Get the reset value
      console.log("[RESET_FORM] Rendering styles/traits for default role:", defaultRole);
      this.renderStyles(defaultRole);
      this.renderTraits(defaultRole, ''); // Pass empty style
      this.elements.style.value = ''; // Ensure style is reset

      // Reset button text and form title
      if (this.elements.formTitle) this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.save.textContent = 'Save Persona! 💖';
      this.elements.clearForm.textContent = 'Clear Form 🧹';

      this.updateLivePreview(); // Update preview to reflect cleared state
      this.updateStyleExploreLink(); // Update style link

      console.log("[RESET_FORM] END - Form reset complete.");
  } // End resetForm


  // --- Live Preview ---
  updateLivePreview() {
      // console.log("[LIVE_PREVIEW] Updating..."); // Can be very noisy
      const name = this.elements.name.value.trim() || "[Persona Name]";
      const role = this.elements.role.value;
      const style = this.elements.style.value || "[Select Style]";
      const avatar = this.elements.avatarInput.value || '❓';

      const traits = {};
      this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
          traits[slider.name] = parseInt(slider.value, 10);
      });

      // Generate basic preview text
       let previewHTML = `
            <h3 class="preview-title">${this.escapeHTML(avatar)} ${this.escapeHTML(name)}</h3>
            <p style="text-align:center;">(${this.escapeHTML(role)} / ${this.escapeHTML(style)})</p>
        `;

       // Generate breakdown using paraphrasing functions
        if (role && style && Object.keys(traits).length > 0) {
             console.log(`[LIVE_PREVIEW] Generating breakdown for role ${role}, style ${style}`);
             let breakdown;
             try {
                 if (role === 'submissive') {
                     breakdown = getSubBreakdown(style, traits);
                 } else if (role === 'dominant') {
                     breakdown = getDomBreakdown(style, traits);
                 } else { // Handle Switch or other roles if added
                    // For now, just show traits for Switch
                     breakdown = { strengths: "Traits define your flexible approach!", improvements: "Consider which role feels stronger now."};
                 }

                if(breakdown) {
                     previewHTML += `
                        <div class="preview-breakdown">
                            <h4>Vibe Check:</h4>
                            <p class="strengths">${breakdown.strengths || 'Analyzing...'}</p>
                            <h4>Growth Edge:</h4>
                            <p class="improvements">${breakdown.improvements || 'Reflecting...'}</p>
                        </div>
                    `;
                } else {
                    console.warn(`[LIVE_PREVIEW] Breakdown function for role ${role} returned undefined.`);
                    previewHTML += `<p class="muted-text">Could not generate breakdown for this style.</p>`;
                }

             } catch (error) {
                  console.error(`[LIVE_PREVIEW] Error generating style breakdown:`, error);
                  previewHTML += `<p class="error-text">Error generating style breakdown.</p>`;
             }

        } else if (role && Object.keys(traits).length > 0) {
             previewHTML += `<p class="muted-text" style="text-align:center; margin-top: 1em;">Select a Style to see breakdown...</p>`;
        }
         else {
             previewHTML += `<p class="muted-text" style="text-align:center; margin-top: 1em;">Adjust traits to see more...</p>`;
         }

      this.elements.livePreview.innerHTML = previewHTML;
       // console.log("[LIVE_PREVIEW] Update complete."); // Noisy
  } // End updateLivePreview


  // --- Modal Display ---
 showPersonDetails(personId) {
      console.log(`[SHOW_PERSON_DETAILS] START - Called for ID: ${personId}`);
      const person = this.people.find(p => p.id === personId);

      if (!person) {
          console.error(`[SHOW_PERSON_DETAILS] Person with ID ${personId} not found.`);
          this.showNotification("Could not load persona details.", "error");
          return;
      }
      console.log(`[SHOW_PERSON_DETAILS] Found person: ${person.name}`);

      const detailModal = this.elements.modal;
      const modalBody = this.elements.modalBody;
      const modalTabsContainer = this.elements.modalTabs;
      const modalTitle = this.elements.detailModalTitle;

      if (!detailModal || !modalBody || !modalTabsContainer || !modalTitle) {
          console.error("[SHOW_PERSON_DETAILS] Detail modal elements (modal, body, tabs, title) missing in DOM.");
          this.showNotification("UI Error: Cannot display details.", "error");
          return;
      }
      console.log("[SHOW_PERSON_DETAILS] Required modal elements found.");

      // --- Prepare Modal ---
      detailModal.dataset.personId = personId; // Store ID on the modal
      modalTitle.textContent = `${person.avatar || '❓'} ${this.escapeHTML(person.name)} - Details`;
      modalBody.innerHTML = ''; // Clear previous content
      modalTabsContainer.innerHTML = ''; // Clear previous tabs

      // --- Define Tabs ---
      const tabs = [
          { id: 'tab-goals', label: 'Goals', icon: '🎯', renderFunc: this.renderGoalList },
          { id: 'tab-traits', label: 'Traits', icon: '🎨', renderFunc: this.renderTraitDetails }, // Assuming a new render function
          { id: 'tab-breakdown', label: 'Breakdown', icon: '📊', renderFunc: this.renderStyleBreakdownDetail }, // Assuming a new render function
          { id: 'tab-history', label: 'History', icon: '📈', renderFunc: this.renderHistoryTab }, // Assuming a new render function
          { id: 'tab-journal', label: 'Journal', icon: '📝', renderFunc: this.renderJournalTab }, // Assuming a new render function
          { id: 'tab-achievements', label: 'Achievements', icon: '🏆', renderFunc: this.renderAchievementsList },
          { id: 'tab-oracle', label: 'Oracle', icon: '🔮', renderFunc: this.renderOracleTab } // Assuming a new render function
      ];

      // --- Render Tabs and Content Panes ---
      console.log(`[SHOW_PERSON_DETAILS] Rendering ${tabs.length} tabs and content panes...`);
      tabs.forEach((tab, index) => {
           // Create Tab Button
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-link';
            tabButton.textContent = `${tab.icon} ${tab.label}`;
            tabButton.dataset.tabId = tab.id;
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', `${tab.id}-content`);
            tabButton.id = `${tab.id}-tab`; // ID for aria-labelledby
            const isActive = tab.id === this.activeDetailModalTab;
            if (isActive) {
                tabButton.classList.add('active');
                tabButton.setAttribute('aria-selected', 'true');
            } else {
                 tabButton.setAttribute('aria-selected', 'false');
            }
            modalTabsContainer.appendChild(tabButton);

             // Create Content Pane
            const contentPane = document.createElement('div');
            contentPane.className = 'tab-content';
            contentPane.dataset.tabId = tab.id;
            contentPane.id = `${tab.id}-content`; // ID for aria-controls
            contentPane.setAttribute('role', 'tabpanel');
            contentPane.setAttribute('aria-labelledby', `${tab.id}-tab`);
            if (isActive) {
                contentPane.classList.add('active');
                console.log(`[SHOW_PERSON_DETAILS] Rendering initial active tab content for: ${tab.id}`);
                // Use try-catch around render function call for robustness
                 try {
                     // Pass the element where content should be rendered
                     if (typeof tab.renderFunc === 'function') {
                         contentPane.innerHTML = tab.renderFunc.call(this, person); // Call render function in context, get HTML string
                     } else {
                          console.warn(`[SHOW_PERSON_DETAILS] No render function defined for tab: ${tab.id}`);
                          contentPane.innerHTML = `<p class="muted-text">Content loading for ${tab.label}...</p>`;
                     }
                      // Special case for chart rendering which needs a canvas element
                     if (tab.id === 'tab-history') {
                        this.renderHistoryChart(person, 'history-chart'); // Render chart after pane is added
                     }
                 } catch (error) {
                     console.error(`[SHOW_PERSON_DETAILS] Error rendering content for tab ${tab.id}:`, error);
                     contentPane.innerHTML = `<p class="error-text">Error loading content for ${tab.label}.</p>`;
                 }

            } else {
                // Content will be loaded when tab is clicked (see handleDetailTabClick)
                 contentPane.innerHTML = ''; // Start empty
            }
            modalBody.appendChild(contentPane);
      });

      console.log("[SHOW_PERSON_DETAILS] Finished rendering tabs and panes. Calling openModal...");
      this.openModal(detailModal);
      console.log("[SHOW_PERSON_DETAILS] END - Modal should be open.");
  } // End showPersonDetails

  // Renders the *content* for a specific tab in the detail modal
  // Assumes contentElement is the '.tab-content' div for that tab
  renderDetailTabContent(person, tabId, contentElement) {
        console.log(`[RENDER_DETAIL_TAB] Rendering content for person ${person.id}, tab ${tabId}`);
        if (!contentElement) {
            console.error(`[RENDER_DETAIL_TAB] No content element provided for tab ${tabId}.`);
            return;
        }

         // Clear existing content before rendering (important if re-rendering)
        contentElement.innerHTML = '';

        try {
            let htmlContent = '';
            switch (tabId) {
                case 'tab-goals':
                    htmlContent = this.renderGoalList(person);
                    break;
                 case 'tab-traits':
                    htmlContent = this.renderTraitDetails(person);
                    break;
                case 'tab-breakdown':
                    htmlContent = this.renderStyleBreakdownDetail(person);
                    break;
                case 'tab-history':
                    htmlContent = this.renderHistoryTab(person);
                    // Chart needs to be rendered *after* HTML is in DOM
                     requestAnimationFrame(() => this.renderHistoryChart(person, 'history-chart'));
                    break;
                case 'tab-journal':
                    htmlContent = this.renderJournalTab(person);
                    break;
                case 'tab-achievements':
                    // Re-use existing function, assuming it returns HTML string or populates element
                     htmlContent = this.renderAchievementsList(person); // Modify if needed
                    break;
                 case 'tab-oracle':
                    htmlContent = this.renderOracleTab(person);
                    break;
                default:
                    console.warn(`[RENDER_DETAIL_TAB] Unknown tabId: ${tabId}`);
                    htmlContent = `<p class="muted-text">No content definition for this tab.</p>`;
            }
             contentElement.innerHTML = htmlContent;
             console.log(`[RENDER_DETAIL_TAB] Successfully rendered content for ${tabId}`);

        } catch (error) {
            console.error(`[RENDER_DETAIL_TAB] Error rendering content for tab ${tabId}:`, error);
            contentElement.innerHTML = `<p class="error-text">Error loading content. Please try again.</p>`;
        }
    }

    // --- Placeholder Render Functions for Detail Tabs (Replace with actual logic) ---

    renderTraitDetails(person) {
        console.log(`[RENDER_TRAIT_DETAILS] Rendering for person ${person.id}`);
        let content = '<section><h3>Core Traits</h3>';
        const roleData = bdsmData[person.role];
        if (!roleData) return '<p class="error-text">Role data not found.</p>';

        const allTraits = [
            ...(roleData.coreTraits || []),
            ...(roleData.styles?.find(s => s.name === person.style)?.traits || [])
        ];
        const uniqueTraits = [...new Map(allTraits.map(item => [item.name, item])).values()]; // Ensure unique

        if (uniqueTraits.length === 0) {
             content += '<p class="muted-text">No traits defined for this role/style combination.</p>';
        } else {
            content += '<div class="trait-details-grid">';
            uniqueTraits.forEach(trait => {
                const score = person.traits?.[trait.name] || 'N/A';
                 const description = trait.desc?.[score] || trait.explanation || 'No description available.';
                 const flair = this.getFlairForScore(score); // Get flair based on score

                content += `
                    <div class="trait-detail-item">
                        <h4>
                             <a href="#" class="glossary-link" data-term-key="${this.escapeHTML(trait.name)}">${this.escapeHTML(trait.name)} ${flair}</a>
                             <span class="trait-score-badge">Score: ${score}</span>
                         </h4>
                        <p>${this.escapeHTML(description)}</p>
                    </div>
                `;
            });
             content += '</div>'; // Close grid
        }
        content += '</section>';

        // Synergy Hints Section
        const hints = this.getSynergyHints(person);
        if (hints.length > 0) {
            content += '<section><h3>✨ Trait Synergies ✨</h3><ul>';
            hints.forEach(hint => {
                content += `<li>${hint.type === 'positive' ? '➕' : '🤔'} ${this.escapeHTML(hint.text)}</li>`;
            });
            content += '</ul></section>';
        }

        console.log(`[RENDER_TRAIT_DETAILS] Finished rendering.`);
        return content;
    }

    renderStyleBreakdownDetail(person) {
         console.log(`[RENDER_STYLE_BREAKDOWN] Rendering for person ${person.id}, style ${person.style}`);
         let content = '<section>';
         if (person.role && person.style && person.traits) {
             let breakdown;
             try {
                 if (person.role === 'submissive') {
                     breakdown = getSubBreakdown(person.style, person.traits);
                 } else if (person.role === 'dominant') {
                     breakdown = getDomBreakdown(person.style, person.traits);
                 } else {
                     breakdown = { strengths: "Style breakdown varies greatly for Switches.", improvements: "Focus on communicating your current leaning." };
                 }

                 if (breakdown) {
                     content += `
                        <h3>📊 ${this.escapeHTML(person.style)} Breakdown</h3>
                         <div class="style-breakdown">
                             <h4>Strengths / Expressions:</h4>
                             <p class="strengths">${breakdown.strengths}</p>
                             <h4>Areas for Growth / Exploration:</h4>
                             <p class="improvements">${breakdown.improvements}</p>
                        </div>
                    `;
                 } else {
                      content += '<p class="muted-text">Could not generate breakdown for this style.</p>';
                 }
             } catch (error) {
                  console.error(`[RENDER_STYLE_BREAKDOWN] Error generating breakdown:`, error);
                  content += `<p class="error-text">Error generating style breakdown.</p>`;
             }
         } else {
              content += '<p class="muted-text">Select a Role, Style, and define Traits to see a breakdown.</p>';
         }
         content += '</section>';
         console.log(`[RENDER_STYLE_BREAKDOWN] Finished rendering.`);
         return content;
    }

    renderHistoryTab(person) {
         console.log(`[RENDER_HISTORY_TAB] Rendering for person ${person.id}`);
         const snapshots = person.history || [];
         let content = `<section><h3>📈 Trait History</h3>`;
         content += `<div class="modal-actions"><button id="snapshot-btn" class="save-btn small-btn">Take Snapshot Now 📸</button></div>`;

          if (snapshots.length === 0) {
              content += `<p class="muted-text">No history snapshots taken yet. Use the button above to start tracking changes!</p>`;
          } else if (snapshots.length < 2) {
              content += `<p class="muted-text">Take at least one more snapshot to see a trend chart.</p>`;
          } else {
              content += `<div class="history-chart-container"><canvas id="history-chart"></canvas></div>`;
          }

           // Display Snapshots List (Optional, can get long)
           if(snapshots.length > 0) {
                content += '<h4>Recent Snapshots:</h4><ul class="snapshot-list">'; // Add a class for styling
                snapshots.slice(-5).reverse().forEach((snapshot, index) => { // Show last 5, newest first
                    const date = new Date(snapshot.timestamp).toLocaleString();
                    content += `<li>${date} - <button type="button" class="link-button snapshot-toggle" onclick="window.kinkCompassApp.toggleSnapshotInfo(this)">View Traits</button>`;
                    content += '<div class="snapshot-details" style="display:none;"><ul>';
                    for(const trait in snapshot.traits) {
                        content += `<li>${this.escapeHTML(trait)}: ${snapshot.traits[trait]}</li>`;
                    }
                    content += '</ul></div></li>';
                });
                content += '</ul>';
                if(snapshots.length > 5) content += '<p class="muted-text">(Showing last 5 snapshots)</p>';
           }


         content += '</section>';
          console.log(`[RENDER_HISTORY_TAB] Finished rendering HTML structure.`);
         return content;
     }

     renderJournalTab(person) {
        console.log(`[RENDER_JOURNAL_TAB] Rendering for person ${person.id}`);
        let content = `<section>
                            <h3>📝 Journal & Reflections</h3>
                            <div class="modal-actions">
                                 <button id="journal-prompt-btn" class="small-btn">Get Prompt 🤔</button>
                            </div>
                            <div id="journal-prompt-area" class="journal-prompt" style="display:none;"></div>
                            <textarea id="reflections-textarea" class="reflections-textarea" placeholder="Reflect on experiences, goals, feelings..." aria-label="Journal Entry">${this.escapeHTML(person.reflections || '')}</textarea>
                            <div class="modal-actions">
                                <button id="save-reflections-btn" class="save-btn">Save Reflections💾</button>
                            </div>
                       </section>`;

        // Add Goal Alignment Hints
        const goalHints = this.getGoalAlignmentHints(person);
        if(goalHints.length > 0) {
            content += `<section>
                            <h3>🎯 Goal Alignment Insights</h3>
                            <ul>`;
            goalHints.forEach(hint => {
                content += `<li>${this.escapeHTML(hint)}</li>`;
            });
            content += `</ul></section>`;
        }

         console.log(`[RENDER_JOURNAL_TAB] Finished rendering.`);
        return content;
    }

     renderOracleTab(person) {
         console.log(`[RENDER_ORACLE_TAB] Rendering for person ${person.id}`);
         let content = `<section>
                            <h3>🔮 Kink Compass Oracle</h3>
                            <div id="oracle-reading-output" class="kink-reading-output">
                                <p class="muted-text">Consult the Oracle for today's guidance...</p>
                            </div>
                            <div class="modal-actions" style="margin-top: 1em;">
                                <button id="oracle-btn" class="small-btn accent-btn">Consult Oracle ✨</button>
                            </div>
                       </section>`;
         console.log(`[RENDER_ORACLE_TAB] Finished rendering.`);
         return content;
     }

  // --- New Feature Logic ---
  addGoal(personId, formElement) {
    console.log(`[ADD_GOAL] START - Adding goal for person ${personId}`);
    if (!formElement) {
        console.error("[ADD_GOAL] Form element not provided.");
        return;
    }
    const input = formElement.querySelector('input[type="text"]');
    if (!input) {
        console.error("[ADD_GOAL] Goal input field not found in form.");
        return;
    }
    const goalText = input.value.trim();

    if (!goalText) {
        this.showNotification("Please enter goal text.", "warning");
        console.warn("[ADD_GOAL] Goal text is empty.");
        input.focus();
        return;
    }

    const person = this.people.find(p => p.id === personId);
    if (!person) {
        console.error(`[ADD_GOAL] Person not found for ID: ${personId}`);
        this.showNotification("Error adding goal: Persona not found.", "error");
        return;
    }

    if (!person.goals) person.goals = []; // Initialize if needed

    const newGoal = {
        id: Date.now(),
        text: goalText,
        done: false,
        createdAt: new Date().toISOString()
    };

    person.goals.push(newGoal);
    this.saveToLocalStorage();
    this.showNotification("Goal added!", "success");
    grantAchievement(person, 'goal_added'); // Grant achievement

    console.log("[ADD_GOAL] Goal added successfully:", newGoal);

    // Re-render the goal list within the modal if it's open and active
    const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container'); // Assuming container ID
    if (goalListContainer && this.activeDetailModalTab === 'tab-goals') {
        console.log("[ADD_GOAL] Re-rendering goal list in modal.");
        goalListContainer.innerHTML = this.renderGoalList(person, true); // Pass true to get only list part
    } else {
         console.log("[ADD_GOAL] Goal list container not found or tab not active. Full refresh needed if modal open.");
         // If modal is open but tab isn't goals, need to handle refresh potentially
    }

    input.value = ''; // Clear input field
    console.log("[ADD_GOAL] END");
  } // End addGoal


   toggleGoalStatus(personId, goalId, listItemElement = null) {
        console.log(`[TOGGLE_GOAL] START - Toggling goal ${goalId} for person ${personId}`);
        const person = this.people.find(p => p.id === personId);
        if (!person || !person.goals) {
            console.error(`[TOGGLE_GOAL] Person or goals not found for ID: ${personId}`);
            this.showNotification("Error updating goal status.", "error");
            return;
        }

        const goalIndex = person.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) {
            console.error(`[TOGGLE_GOAL] Goal ID ${goalId} not found for person ${personId}`);
            this.showNotification("Error: Goal not found.", "error");
            return;
        }

        person.goals[goalIndex].done = !person.goals[goalIndex].done; // Toggle status
        const isDone = person.goals[goalIndex].done;
        person.goals[goalIndex].completedAt = isDone ? new Date().toISOString() : null; // Set/clear completion timestamp

        this.saveToLocalStorage();

        if (isDone) {
            this.showNotification("Goal marked complete! 🎉", "success");
            grantAchievement(person, 'goal_completed'); // Grant single goal achievement
            // Check multi-goal achievement
             const completedCount = person.goals.filter(g => g.done).length;
             if (completedCount >= 5) grantAchievement(person, 'five_goals_completed');
             // Check goal streak
             this.checkGoalStreak(person);

        } else {
            this.showNotification("Goal marked incomplete.", "info");
        }

        console.log(`[TOGGLE_GOAL] Goal ${goalId} status set to ${isDone}`);

        // Update UI directly if listItemElement is provided
        if (listItemElement) {
            console.log("[TOGGLE_GOAL] Updating list item UI directly.");
            listItemElement.classList.toggle('done', isDone);
            const button = listItemElement.querySelector('.toggle-goal-btn');
            if (button) button.textContent = isDone ? 'Undo' : 'Done';
            if (isDone) {
                 // Add brief animation
                 const goalTextSpan = listItemElement.querySelector('span:first-child'); // Target the text span
                 if(goalTextSpan) {
                     goalTextSpan.classList.add('goal-completed-animation');
                     setTimeout(() => goalTextSpan.classList.remove('goal-completed-animation'), 600); // Match animation duration
                 }
            }
        } else {
             console.log("[TOGGLE_GOAL] List item element not provided. UI update requires full re-render if visible.");
             // If the modal is open and showing goals, we might need to re-render the list
             const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container');
             if (goalListContainer && this.activeDetailModalTab === 'tab-goals') {
                 console.log("[TOGGLE_GOAL] Re-rendering goal list after toggle.");
                 goalListContainer.innerHTML = this.renderGoalList(person, true); // Render just list part
             }
        }


        console.log("[TOGGLE_GOAL] END");
    } // End toggleGoalStatus


   deleteGoal(personId, goalId) {
        console.log(`[DELETE_GOAL] START - Deleting goal ${goalId} for person ${personId}`);
        const person = this.people.find(p => p.id === personId);
        if (!person || !person.goals) {
            console.error(`[DELETE_GOAL] Person or goals not found for ID: ${personId}`);
            this.showNotification("Error deleting goal.", "error");
            return;
        }

        const initialLength = person.goals.length;
        person.goals = person.goals.filter(g => g.id !== goalId);

        if (person.goals.length < initialLength) {
            this.saveToLocalStorage();
            this.showNotification("Goal deleted.", "info");
            console.log(`[DELETE_GOAL] Goal ${goalId} deleted.`);

            // Re-render the goal list within the modal if it's open and active
            const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container');
             if (goalListContainer && this.activeDetailModalTab === 'tab-goals') {
                console.log("[DELETE_GOAL] Re-rendering goal list in modal.");
                 goalListContainer.innerHTML = this.renderGoalList(person, true); // Render just list part
             } else {
                 console.log("[DELETE_GOAL] Goal list container not found or tab not active. Full refresh needed if modal open.");
             }

        } else {
            console.error(`[DELETE_GOAL] Goal ID ${goalId} not found for deletion.`);
            this.showNotification("Error: Goal not found.", "error");
        }
        console.log("[DELETE_GOAL] END");
    } // End deleteGoal

    // Renders the Goal List HTML for the detail modal
    // If returnListOnly is true, returns only the <ul> part for dynamic updates
    renderGoalList(person, returnListOnly = false) {
        console.log(`[RENDER_GOAL_LIST] Rendering for person ${person.id}. List only: ${returnListOnly}`);
        const goals = person.goals || [];
        let listHTML = '<ul id="goal-list">'; // Add ID for easier targeting

        if (goals.length === 0) {
            listHTML += '<li class="muted-text">No goals set yet. Add one below!</li>';
        } else {
            goals.forEach(goal => {
                const isDone = goal.done;
                listHTML += `
                    <li class="${isDone ? 'done' : ''}" data-goal-id="${goal.id}">
                        <span>${this.escapeHTML(goal.text)}</span>
                        <div class="goal-actions">
                            <button class="small-btn toggle-goal-btn" data-goal-id="${goal.id}">${isDone ? 'Undo' : 'Done'}</button>
                            <button class="small-btn delete-btn delete-goal-btn" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button>
                        </div>
                    </li>
                `;
            });
        }
        listHTML += '</ul>';

        if (returnListOnly) {
            console.log(`[RENDER_GOAL_LIST] Returning list HTML only.`);
            return listHTML;
        }

        // Full tab content including form
        const fullContent = `
            <section id="tab-goals-content">
                <h3>🎯 Goals & Aspirations</h3>
                 <div id="goal-list-container">
                    ${listHTML}
                 </div>
                 <hr>
                <h4>Add New Goal:</h4>
                <form id="add-goal-form" class="add-goal-form" action="#">
                    <input type="text" placeholder="e.g., Practice communication" required aria-label="New goal text">
                    <button type="submit" id="add-goal-btn" class="small-btn save-btn">Add</button>
                </form>
            </section>
        `;
        console.log(`[RENDER_GOAL_LIST] Finished rendering full tab content.`);
        return fullContent;
    }


  showJournalPrompt(personId) {
        console.log(`[JOURNAL_PROMPT] Getting prompt for person ${personId}`);
        const promptArea = document.getElementById('journal-prompt-area');
        if (!promptArea) {
            console.warn("[JOURNAL_PROMPT] Prompt area element not found.");
            return;
        }
        try {
            const prompt = getRandomPrompt();
            promptArea.textContent = prompt;
            promptArea.style.display = 'block';
            console.log(`[JOURNAL_PROMPT] Displayed prompt: ${prompt}`);
             // Grant achievement for using a prompt (find person object first)
            const person = this.people.find(p => p.id === personId);
             if(person) grantAchievement(person, 'prompt_used');
             else console.warn("[JOURNAL_PROMPT] Could not find person to grant achievement.");

        } catch (error) {
            console.error("[JOURNAL_PROMPT] Error getting or displaying prompt:", error);
            promptArea.textContent = "Error loading prompt.";
            promptArea.style.display = 'block';
        }
  }

  saveReflections(personId) {
      console.log(`[SAVE_REFLECTIONS] START - Saving for person ${personId}`);
      const textarea = document.getElementById('reflections-textarea');
      if (!textarea) {
          console.error("[SAVE_REFLECTIONS] Textarea element not found.");
          this.showNotification("Error saving reflections: UI element missing.", "error");
          return;
      }

      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[SAVE_REFLECTIONS] Person not found for ID: ${personId}`);
          this.showNotification("Error saving reflections: Persona not found.", "error");
          return;
      }

      const reflectionsText = textarea.value;
      person.reflections = reflectionsText; // Save the text
      person.lastUpdated = new Date().toISOString();

      this.saveToLocalStorage();
      this.showNotification("Reflections saved!", "success");

      // Grant achievements
       grantAchievement(person, 'reflection_saved');
       // Count entries roughly (e.g., by non-empty saves or date markers if implemented)
       // This is a placeholder - real entry counting needs better logic
       const entryCount = (person.history?.filter(h => h.type === 'reflection').length || 0) + 1; // Simplistic count
        if (entryCount >= 5) grantAchievement(person, 'five_reflections');
        if (entryCount >= 10) grantAchievement(person, 'journal_journeyman');


      // Optionally, give visual feedback on the save button or textarea
       textarea.classList.add('input-just-saved');
       setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);

      console.log("[SAVE_REFLECTIONS] END - Reflections saved successfully.");
  } // End saveReflections

  addSnapshotToHistory(personId) {
      console.log(`[ADD_SNAPSHOT] START - Adding snapshot for person ${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!person || !person.traits) {
          console.error(`[ADD_SNAPSHOT] Person or traits not found for ID: ${personId}`);
          this.showNotification("Error taking snapshot: Persona data missing.", "error");
          return;
      }

      if (!person.history) person.history = []; // Initialize if needed

      const newSnapshot = {
          timestamp: new Date().toISOString(),
          traits: { ...person.traits } // Create a copy of current traits
      };

      // Check for trait transformation achievement BEFORE adding the new snapshot
      this.checkTraitTransformation(person, newSnapshot);
      // Check for consistency achievement
      this.checkConsistentSnapper(person, newSnapshot.timestamp);


      person.history.push(newSnapshot);
      person.lastUpdated = newSnapshot.timestamp;

      this.saveToLocalStorage();
      this.showNotification("Snapshot saved! 📸", "success");
      grantAchievement(person, 'history_snapshot'); // Grant first snapshot achievement
      if (person.history.length >= 10) grantAchievement(person, 'ten_snapshots');

      console.log("[ADD_SNAPSHOT] Snapshot added:", newSnapshot);

      // Re-render the history tab if it's currently active
      const historyTabContent = document.querySelector('#tab-history-content'); // Assuming this ID
      if (historyTabContent && this.activeDetailModalTab === 'tab-history') {
           console.log("[ADD_SNAPSHOT] Re-rendering history tab content.");
           this.renderDetailTabContent(person, 'tab-history', historyTabContent);
           // Note: renderHistoryChart is called within renderDetailTabContent for history
      } else {
            console.log("[ADD_SNAPSHOT] History tab not active. Full re-render needed if modal is open.");
      }
      console.log("[ADD_SNAPSHOT] END");
  } // End addSnapshotToHistory


  renderHistoryChart(person, canvasId) {
      console.log(`[RENDER_HISTORY_CHART] START - Rendering chart for person ${person.id} on canvas #${canvasId}`);
      const canvasElement = document.getElementById(canvasId);
      const container = canvasElement?.parentElement; // Get container for loading state

       if (!canvasElement) {
            console.warn(`[RENDER_HISTORY_CHART] Canvas element #${canvasId} not found.`);
            if(container) container.innerHTML = '<p class="muted-text">Chart canvas not found.</p>';
            return;
       }
        if (!container) {
             console.warn(`[RENDER_HISTORY_CHART] Chart container not found for canvas #${canvasId}.`);
             // Continue trying to render, but loading state won't work
        }


      if (!person || !person.history || person.history.length < 2) {
          console.log("[RENDER_HISTORY_CHART] Not enough data points (<2) to render chart.");
           if(container) container.innerHTML = '<p class="muted-text">Need at least two snapshots to draw a chart.</p>';
           else canvasElement.style.display = 'none'; // Hide canvas if no container
          return;
      }

      // Add loading state
       if(container) container.classList.add('chart-loading');
       canvasElement.style.visibility = 'hidden'; // Hide canvas while loading


       // --- Chart.js Logic ---
       // Ensure Chart.js is loaded
       if (typeof Chart === 'undefined') {
           console.error("[RENDER_HISTORY_CHART] Chart.js library is not loaded!");
            if(container) {
                 container.classList.remove('chart-loading');
                 container.innerHTML = '<p class="error-text">Charting library failed to load.</p>';
            }
           return;
       }

      console.log(`[RENDER_HISTORY_CHART] Preparing data from ${person.history.length} snapshots.`);
      const historyData = person.history;
      const labels = historyData.map(snap => new Date(snap.timestamp).toLocaleDateString());

      // Dynamically find all unique trait names across history
       const allTraitNames = [...new Set(historyData.flatMap(snap => Object.keys(snap.traits)))];
       console.log("[RENDER_HISTORY_CHART] Unique traits found in history:", allTraitNames);


      const datasets = allTraitNames.map((traitName, index) => {
            const dataPoints = historyData.map(snap => snap.traits[traitName] !== undefined ? snap.traits[traitName] : null); // Use null for missing data points
            // Basic color generation - replace with a better palette if needed
             const hue = (index * (360 / Math.max(1, allTraitNames.length))) % 360;
             const color = `hsl(${hue}, 70%, 60%)`;
            return {
                label: traitName,
                data: dataPoints,
                borderColor: color,
                backgroundColor: color + '80', // Semi-transparent fill
                tension: 0.1, // Slight curve
                spanGaps: true, // Connect lines across null points
                 pointRadius: 3,
                 pointHoverRadius: 6
            };
      });

      console.log("[RENDER_HISTORY_CHART] Datasets prepared:", datasets);

       // Destroy previous chart instance if it exists
       if (this.chartInstance) {
           console.log("[RENDER_HISTORY_CHART] Destroying previous chart instance.");
           this.chartInstance.destroy();
           this.chartInstance = null;
       }

       // Use requestAnimationFrame to ensure canvas is ready after potential DOM updates
       requestAnimationFrame(() => {
            try {
                const ctx = canvasElement.getContext('2d');
                 console.log("[RENDER_HISTORY_CHART] Creating new Chart instance.");
                this.chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false, // Allow chart to fill container height
                        scales: {
                             y: {
                                beginAtZero: true,
                                suggestedMax: 5.5, // Go slightly above max trait score
                                title: { display: true, text: 'Trait Score (1-5)' },
                                grid: { color: getComputedStyle(document.body).getPropertyValue('--chart-grid-color') || 'rgba(0,0,0,0.1)' }
                            },
                            x: {
                                title: { display: true, text: 'Snapshot Date' },
                                grid: { display: false } // Hide vertical grid lines usually
                            }
                        },
                        plugins: {
                             legend: { position: 'bottom', labels: { boxWidth: 12 } },
                             tooltip: { mode: 'index', intersect: false }
                        },
                        interaction: {
                           mode: 'nearest',
                           axis: 'x',
                           intersect: false
                       }
                    }
                });
                 console.log("[RENDER_HISTORY_CHART] Chart created successfully.");
            } catch (error) {
                 console.error("[RENDER_HISTORY_CHART] Error creating Chart instance:", error);
                  if(container) container.innerHTML = '<p class="error-text">Error rendering chart.</p>';
            } finally {
                // Remove loading state regardless of success/error
                 if(container) container.classList.remove('chart-loading');
                 canvasElement.style.visibility = 'visible';
            }
        }); // End requestAnimationFrame

        console.log("[RENDER_HISTORY_CHART] END");
   } // End renderHistoryChart

    toggleSnapshotInfo(button) {
         console.log("[TOGGLE_SNAPSHOT_INFO] Toggle button clicked.");
         const detailsDiv = button.nextElementSibling; // Assuming details div is immediately after
         if (detailsDiv && detailsDiv.classList.contains('snapshot-details')) {
             const isVisible = detailsDiv.style.display !== 'none';
             detailsDiv.style.display = isVisible ? 'none' : 'block';
             button.textContent = isVisible ? 'View Traits' : 'Hide Traits';
             console.log(`[TOGGLE_SNAPSHOT_INFO] Details visibility set to: ${!isVisible}`);
         } else {
              console.warn("[TOGGLE_SNAPSHOT_INFO] Could not find details div next to button:", button);
         }
     }


  // Renders the list of achievements for a specific person or all achievements
   // If person is provided, renders their unlocked status
   // Returns HTML string for the list
  renderAchievementsList(person = null) {
      const targetId = person ? `achievements-list-${person.id}` : 'all-achievements-list'; // Use different ID if rendering all
      console.log(`[RENDER_ACHIEVEMENTS] Rendering list for ${person ? `person ${person.id}` : 'all achievements'} into container expected ID: ${targetId}`);

      let listHTML = '';
      const achievementKeys = Object.keys(achievementList);

      if (achievementKeys.length === 0) {
          console.log("[RENDER_ACHIEVEMENTS] No achievements defined in achievementList.");
          return '<p class="muted-text">No achievements defined yet.</p>';
      }

      achievementKeys.forEach(key => {
            const achievement = achievementList[key];
            if (!achievement) {
                 console.warn(`[RENDER_ACHIEVEMENTS] Missing achievement data for key: ${key}`);
                 return;
            }

            const isUnlocked = person ? hasAchievement(person, key) : false; // Only check unlock status if person is provided
            const statusClass = person ? (isUnlocked ? 'unlocked' : 'locked') : ''; // Class only if rendering for a person
            const icon = isUnlocked ? '🏆' : (person ? '🔒' : '🏅'); // Different icon for global list vs locked
             const name = achievement.name || 'Unnamed Achievement';
             const desc = person ? (isUnlocked ? achievement.desc : 'Keep exploring to unlock!') : achievement.desc; // Show hint if locked for person


            listHTML += `
                <li class="${statusClass}">
                    <span class="achievement-icon" aria-hidden="true">${icon}</span>
                    <div class="achievement-details">
                        <span class="achievement-name">${this.escapeHTML(name)}</span>
                        <span class="achievement-desc">${this.escapeHTML(desc)}</span>
                    </div>
                </li>
            `;
      });

      console.log(`[RENDER_ACHIEVEMENTS] Finished generating HTML for ${achievementKeys.length} achievements.`);
       // If called for a specific person's tab, wrap in section
        if(person) {
            return `<section><h3>🏆 Achievements Unlocked</h3><ul class="achievements-section-list">${listHTML}</ul></section>`; // Use a more specific class if needed
        } else {
            // If called for the global achievements modal, return just the list for the target container
             return `<ul id="${targetId}" class="all-achievements-list">${listHTML}</ul>`; // Target specific ID for global list
        }

  } // End renderAchievementsList

  // Shows the dedicated Achievements Modal with all achievements
  showAchievements() {
      console.log("[SHOW_ACHIEVEMENTS] Opening All Achievements modal.");
      const modal = this.elements.achievementsModal;
      const body = this.elements.achievementsBody;

      if (!modal || !body) {
          console.error("[SHOW_ACHIEVEMENTS] Achievements modal or body element not found.");
          this.showNotification("UI Error: Cannot display achievements.", "error");
          return;
      }

      // Render the list of *all* achievements (without unlock status)
      body.innerHTML = `
           <p>Explore all the possible milestones on your KinkCompass journey!</p>
           ${this.renderAchievementsList(null)} // Pass null to render all achievements
      `;

      this.openModal(modal);
      console.log("[SHOW_ACHIEVEMENTS] Modal opened.");
  }


  showKinkOracle(personId) {
       console.log(`[SHOW_KINK_ORACLE] Consulting Oracle for person ${personId}`);
       const outputElement = document.getElementById('oracle-reading-output'); // Assumes this ID exists in the Oracle tab content
       if (!outputElement) {
           console.error("[SHOW_KINK_ORACLE] Oracle output element not found.");
           this.showNotification("UI Error: Cannot display Oracle reading.", "error");
           return;
       }

       const person = this.people.find(p => p.id === personId);
       if (!person) {
           console.error(`[SHOW_KINK_ORACLE] Person not found for ID: ${personId}`);
           outputElement.innerHTML = `<p class="error-text">Error: Persona data not found.</p>`;
           return;
       }

       outputElement.innerHTML = `<p class="muted-text"><i>The compass spins...</i> ✨</p>`; // Loading state

       // Simulate slight delay for effect
       setTimeout(() => {
            try {
                const readingData = this.getKinkOracleReading(person); // Call helper function
                if(!readingData) throw new Error("getKinkOracleReading returned undefined.");

                outputElement.innerHTML = `
                    <p>${this.escapeHTML(readingData.opening)}</p>
                    <p><strong>Focus:</strong> ${this.escapeHTML(readingData.focus)}</p>
                    <p><em>${this.escapeHTML(readingData.encouragement)}</em></p>
                    <p>${this.escapeHTML(readingData.closing)}</p>
                `;
                console.log("[SHOW_KINK_ORACLE] Oracle reading displayed:", readingData);
                grantAchievement(person, 'kink_reading_oracle'); // Grant achievement
                this.saveToLocalStorage(); // Save achievement grant

            } catch (error) {
                console.error("[SHOW_KINK_ORACLE] Error generating or displaying Oracle reading:", error);
                outputElement.innerHTML = `<p class="error-text">The Oracle is quiet today. Please try again later.</p>`;
            }
        }, 500); // 0.5 second delay

  }

  displayDailyChallenge() {
       console.log("[DAILY_CHALLENGE] Displaying challenge.");
       const area = this.elements.dailyChallengeArea;
       const section = this.elements.dailyChallengeSection;

       if (!area || !section) {
            console.warn("[DAILY_CHALLENGE] Challenge area or section element not found. Skipping.");
            return;
       }

        try {
             // Optionally, get challenge based on a recently viewed persona
             // const lastViewedPersona = this.people.find(p => p.id === someWayToTrackLastViewedId);
            const challenge = this.getDailyChallenge(null); // Pass persona if needed

            if (challenge) {
                 area.innerHTML = `
                      <h4>${this.escapeHTML(challenge.title)}</h4>
                      <p>${this.escapeHTML(challenge.desc)}</p>
                      <p class="muted-text"><small>(Category: ${this.escapeHTML(challenge.category)})</small></p>
                 `;
                 section.style.display = 'block'; // Show the section
                 console.log("[DAILY_CHALLENGE] Displayed challenge:", challenge);
                 // Grant achievement for seeing a challenge (can be noisy if granted daily)
                 // grantAchievement({}, 'challenge_accepted'); // Use global achievement potentially
                 localStorage.setItem('kinkCompass_challenge_accepted', 'true'); // Or just flag it
             } else {
                  console.log("[DAILY_CHALLENGE] No challenge generated. Hiding section.");
                  section.style.display = 'none';
             }

        } catch (error) {
             console.error("[DAILY_CHALLENGE] Error getting or displaying challenge:", error);
             area.innerHTML = `<p class="muted-text">Could not load today's focus.</p>`;
             section.style.display = 'block'; // Show section even with error
        }

  }


  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) {
      console.log(`[SHOW_GLOSSARY] Opening glossary. Highlight term: ${termKeyToHighlight}`);
      const modal = this.elements.glossaryModal;
      const body = this.elements.glossaryBody;

      if (!modal || !body) {
          console.error("[SHOW_GLOSSARY] Glossary modal or body element not found.");
          this.showNotification("UI Error: Cannot display glossary.", "error");
          return;
      }

      body.innerHTML = ''; // Clear previous content

      const sortedKeys = Object.keys(glossaryTerms).sort((a, b) => glossaryTerms[a].term.localeCompare(glossaryTerms[b].term));

      if (sortedKeys.length === 0) {
          body.innerHTML = '<p class="muted-text">Glossary is empty.</p>';
      } else {
          const dl = document.createElement('dl');
          sortedKeys.forEach(key => {
              const termData = glossaryTerms[key];
              if (!termData) return;

              const dt = document.createElement('dt');
              dt.id = `glossary-${key}`; // Add ID for potential linking
              dt.textContent = termData.term;

              const dd = document.createElement('dd');
              dd.textContent = termData.definition;

              // Add related terms if they exist
              if (termData.related && termData.related.length > 0) {
                    const relatedP = document.createElement('p');
                    relatedP.className = 'related-terms';
                    relatedP.innerHTML = 'Related: ';
                    termData.related.forEach((relatedKey, index) => {
                       if (glossaryTerms[relatedKey]) {
                           const link = document.createElement('a');
                           link.href = `#glossary-${relatedKey}`;
                            link.textContent = glossaryTerms[relatedKey].term;
                            link.classList.add('glossary-link'); // Add class for internal glossary navigation
                            link.dataset.termKey = relatedKey; // Store key for handling click
                            relatedP.appendChild(link);
                           if (index < termData.related.length - 1) {
                               relatedP.appendChild(document.createTextNode(', '));
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
      console.log("[SHOW_GLOSSARY] Modal opened.");

      // Scroll to and highlight term if provided
      if (termKeyToHighlight) {
           console.log(`[SHOW_GLOSSARY] Attempting to highlight and scroll to term: ${termKeyToHighlight}`);
           // Needs slight delay for modal to be fully rendered and scrollable
           requestAnimationFrame(() => {
                const element = document.getElementById(`glossary-${termKeyToHighlight}`);
                if (element) {
                    console.log("[SHOW_GLOSSARY] Found element to highlight:", element);
                    element.classList.add('highlighted-term'); // Add highlight class
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                     console.log("[SHOW_GLOSSARY] Scrolled to element.");
                    // Remove highlight after a delay
                    setTimeout(() => {
                        element.classList.remove('highlighted-term');
                        console.log(`[SHOW_GLOSSARY] Removed highlight from ${termKeyToHighlight}`);
                    }, 2500); // 2.5 seconds highlight
                } else {
                     console.warn(`[SHOW_GLOSSARY] Could not find element with ID: glossary-${termKeyToHighlight}`);
                }
           });
      }
  } // End showGlossary

  showStyleDiscovery(styleNameToHighlight = null) {
       console.log(`[STYLE_DISCOVERY] Opening modal. Highlight style: ${styleNameToHighlight}`);
       const modal = this.elements.styleDiscoveryModal;
       const body = this.elements.styleDiscoveryBody;
       const roleFilter = this.elements.styleDiscoveryRoleFilter;

       if (!modal || !body || !roleFilter) {
           console.error("[STYLE_DISCOVERY] Modal, body, or filter element not found.");
           this.showNotification("UI Error: Cannot display Style Discovery.", "error");
           return;
       }

        // Reset filter to 'all' when opening
        roleFilter.value = 'all';
        console.log("[STYLE_DISCOVERY] Resetting role filter to 'all'.");

       // Initial render with filter set to 'all'
       this.renderStyleDiscoveryContent(styleNameToHighlight); // Pass highlight name

       this.openModal(modal);
       console.log("[STYLE_DISCOVERY] Modal opened.");

        // Scrolling/highlighting happens inside renderStyleDiscoveryContent now
   }

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
      console.log(`[RENDER_STYLE_DISCOVERY] Rendering content. Highlight: ${styleNameToHighlight}`);
      const body = this.elements.styleDiscoveryBody;
      const roleFilter = this.elements.styleDiscoveryRoleFilter.value;
       console.log(`[RENDER_STYLE_DISCOVERY] Current role filter: ${roleFilter}`);

       if (!body) {
            console.error("[RENDER_STYLE_DISCOVERY] Body element not found.");
            return; // Should not happen if called after check in showStyleDiscovery
       }

       body.innerHTML = '<p class="loading-text">Loading styles...</p>'; // Loading state

       let stylesToDisplay = [];
       const rolesToInclude = roleFilter === 'all' ? ['submissive', 'dominant', 'switch'] : [roleFilter];

       rolesToInclude.forEach(roleKey => {
            if (bdsmData[roleKey] && bdsmData[roleKey].styles) {
                 stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({ ...style, role: roleKey }))); // Add role info
            }
       });

        // Sort alphabetically by style name
        stylesToDisplay.sort((a, b) => a.name.localeCompare(b.name));

       console.log(`[RENDER_STYLE_DISCOVERY] Found ${stylesToDisplay.length} styles to display.`);

       if (stylesToDisplay.length === 0) {
            body.innerHTML = '<p class="muted-text">No styles found for this filter.</p>';
            return;
       }

       let contentHTML = '';
       stylesToDisplay.forEach(style => {
            const styleKey = `style-discovery-${this.escapeHTML(style.role)}-${this.escapeHTML(style.name.replace(/[^a-zA-Z0-9]/g, '-'))}`; // Create unique ID
             const breakdown = style.summary || "No summary available."; // Use summary for brevity
             const coreTraits = bdsmData[style.role]?.coreTraits?.map(t => t.name) || [];
             const styleTraits = style.traits?.map(t => t.name) || [];
             const allTraitNames = [...new Set([...coreTraits, ...styleTraits])];

            contentHTML += `
                <div class="style-discovery-item" id="${styleKey}">
                     <h4>${this.escapeHTML(style.name)} <small>(${this.escapeHTML(style.role)})</small></h4>
                     <p>${this.escapeHTML(breakdown)}</p>
                     ${allTraitNames.length > 0 ? `<p><small>Key Traits: ${allTraitNames.map(t => this.escapeHTML(t)).join(', ')}</small></p>` : ''}
                 </div>
            `;
       });

       body.innerHTML = contentHTML;
        console.log("[RENDER_STYLE_DISCOVERY] Finished rendering style items.");


        // Scroll to and highlight style if provided
        if (styleNameToHighlight) {
             console.log(`[RENDER_STYLE_DISCOVERY] Attempting to highlight and scroll to style: ${styleNameToHighlight}`);
             // Needs slight delay for content to be in DOM
             requestAnimationFrame(() => {
                 // Find the element based on the name (more complex as ID includes role)
                 let elementToHighlight = null;
                 const items = body.querySelectorAll('.style-discovery-item');
                 items.forEach(item => {
                     const h4 = item.querySelector('h4');
                     if (h4 && h4.textContent.includes(styleNameToHighlight)) { // Find based on text content
                         elementToHighlight = item;
                     }
                 });


                 if (elementToHighlight) {
                     console.log("[RENDER_STYLE_DISCOVERY] Found element to highlight:", elementToHighlight);
                     elementToHighlight.classList.add('highlighted-style'); // Add highlight class
                     elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      console.log("[RENDER_STYLE_DISCOVERY] Scrolled to element.");
                     // Remove highlight after a delay
                     setTimeout(() => {
                          elementToHighlight.classList.remove('highlighted-style');
                          console.log(`[RENDER_STYLE_DISCOVERY] Removed highlight from ${styleNameToHighlight}`);
                     }, 2500);
                 } else {
                      console.warn(`[RENDER_STYLE_DISCOVERY] Could not find element containing style name: ${styleNameToHighlight}`);
                 }
             });
        }

   } // End renderStyleDiscoveryContent


  // --- Data Import/Export ---
  exportData() {
      console.log("[EXPORT_DATA] Starting data export.");
      try {
          const dataStr = JSON.stringify({ people: this.people, version: "KinkCompass_v2.7" }, null, 2); // Pretty print JSON
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
          link.download = `kinkcompass_backup_${timestamp}.json`;
          console.log(`[EXPORT_DATA] Creating download link for file: ${link.download}`);

          document.body.appendChild(link); // Required for Firefox
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url); // Clean up

          this.showNotification("Data exported successfully!", "success");
           grantAchievement({}, 'data_exported');
           localStorage.setItem('kinkCompass_data_exported', 'true');
           console.log("[EXPORT_DATA] END - Export successful.");

      } catch (error) {
          console.error("[EXPORT_DATA] Error during export:", error);
          this.showNotification("Error exporting data. Check console.", "error");
      }
  } // End exportData

  importData(event) {
      console.log("[IMPORT_DATA] START - File input change detected.");
      const file = event.target.files[0];

      if (!file) {
          console.log("[IMPORT_DATA] No file selected.");
          return;
      }

      console.log(`[IMPORT_DATA] Selected file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

      if (file.type !== 'application/json') {
          this.showNotification("Import failed: File must be a .json file.", "error");
          console.warn("[IMPORT_DATA] Invalid file type:", file.type);
           event.target.value = null; // Reset file input
          return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
          console.log("[IMPORT_DATA] FileReader onload event fired.");
          try {
              const importedData = JSON.parse(e.target.result);
              console.log("[IMPORT_DATA] JSON parsed successfully.");

              // --- Basic Validation ---
              if (!importedData || !Array.isArray(importedData.people)) {
                    throw new Error("Invalid file format: Missing 'people' array.");
              }

              // --- Confirmation ---
               if (!confirm(`Import ${importedData.people.length} personas? This will REPLACE your current data.`)) {
                    console.log("[IMPORT_DATA] Import cancelled by user.");
                    event.target.value = null; // Reset file input
                    return;
               }
               console.log("[IMPORT_DATA] User confirmed import.");

              // --- Replace Data ---
              this.people = importedData.people;
               console.log(`[IMPORT_DATA] Replaced current data with ${this.people.length} imported personas.`);
              // Optional: Perform more in-depth validation or migration on imported data here
               this.people.forEach(p => {
                    if (!p.id) p.id = Date.now() + Math.random(); // Ensure IDs exist
                    // Add other missing fields if necessary from newer versions
                    if (!p.achievements) p.achievements = [];
                    if (!p.goals) p.goals = [];
                    if (!p.history) p.history = [];
                    if (p.reflections === undefined) p.reflections = "";
                });

              this.saveToLocalStorage(); // Save the newly imported data
              this.renderList(); // Re-render the list
              this.resetForm(); // Reset the form
              this.showNotification("Data imported successfully! Your personas have been updated.", "success");
               grantAchievement({}, 'data_imported');
               localStorage.setItem('kinkCompass_data_imported', 'true');
               console.log("[IMPORT_DATA] END - Import successful.");


          } catch (error) {
              console.error("[IMPORT_DATA] Error reading or processing file:", error);
              this.showNotification(`Import failed: ${error.message}. Check console.`, "error", 6000);
          } finally {
               event.target.value = null; // Reset file input regardless of success/failure
               console.log("[IMPORT_DATA] File input reset.");
          }
      };

      reader.onerror = (e) => {
          console.error("[IMPORT_DATA] FileReader error:", e);
          this.showNotification("Error reading file.", "error");
           event.target.value = null; // Reset file input
      };

      console.log("[IMPORT_DATA] Reading file as text...");
      reader.readAsText(file);
  } // End importData


  // --- Popups ---
  showTraitInfo(traitName) {
       console.log(`[SHOW_TRAIT_INFO] Showing info for: ${traitName}`);
       const popup = this.elements.traitInfoPopup;
       const title = this.elements.traitInfoTitle;
       const body = this.elements.traitInfoBody;

       if (!popup || !title || !body) {
            console.error("[SHOW_TRAIT_INFO] Trait info popup elements not found.");
            return;
       }

        // Find trait explanation (search across all roles/styles)
        let explanation = `Details for '${traitName}' not found.`;
        let found = false;
         for (const roleKey in bdsmData) {
             const roleData = bdsmData[roleKey];
             const coreTrait = roleData.coreTraits?.find(t => t.name === traitName);
             if (coreTrait && coreTrait.explanation) {
                 explanation = coreTrait.explanation;
                 found = true;
                 break;
             }
             const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
             if (styleTrait && styleTrait.explanation) {
                 explanation = styleTrait.explanation;
                 found = true;
                 break;
             }
         }
        if (!found) console.warn(`[SHOW_TRAIT_INFO] Explanation not found for trait: ${traitName}`);


       title.textContent = `About: ${this.escapeHTML(traitName)}`;
       body.innerHTML = `<p>${this.escapeHTML(explanation)}</p>`; // Use innerHTML if explanation might contain simple HTML later

       popup.style.display = 'block'; // Use block or flex depending on CSS
       popup.setAttribute('aria-hidden', 'false');
       this.elements.traitInfoClose?.focus(); // Focus the close button
       console.log("[SHOW_TRAIT_INFO] Popup displayed.");
       grantAchievement({}, 'trait_info_viewed'); // Grant achievement (global for now)
       localStorage.setItem('kinkCompass_trait_info_viewed', 'true');
   }

   hideTraitInfo() {
        console.log("[HIDE_TRAIT_INFO] Hiding trait info popup.");
        const popup = this.elements.traitInfoPopup;
        if (popup) {
            popup.style.display = 'none';
            popup.setAttribute('aria-hidden', 'true');
            // Restore focus to the button that opened it (if possible)
            const triggerButton = document.querySelector('.trait-info-btn[aria-expanded="true"]');
            if(triggerButton) {
                triggerButton.setAttribute('aria-expanded', 'false');
                triggerButton.focus();
                 console.log("[HIDE_TRAIT_INFO] Focus returned to trigger button.");
            } else {
                 console.log("[HIDE_TRAIT_INFO] Trigger button not found to return focus.");
            }
        } else {
             console.warn("[HIDE_TRAIT_INFO] Popup element not found.");
        }
    }

   showContextHelp(helpKey) {
        console.log(`[SHOW_CONTEXT_HELP] Showing help for key: ${helpKey}`);
        const popup = this.elements.contextHelpPopup;
        const title = this.elements.contextHelpTitle;
        const body = this.elements.contextHelpBody;
        const triggerButton = document.querySelector(`.context-help-btn[data-help-key="${helpKey}"]`);


        if (!popup || !title || !body) {
            console.error("[SHOW_CONTEXT_HELP] Context help popup elements not found.");
            return;
        }

        const helpText = contextHelpTexts[helpKey] || "No help available for this topic.";
        console.log(`[SHOW_CONTEXT_HELP] Help text: ${helpText}`);

        title.textContent = `Help: ${this.escapeHTML(helpKey)}`; // Or use a more descriptive title
        body.innerHTML = `<p>${this.escapeHTML(helpText)}</p>`;

        popup.style.display = 'block'; // Or 'flex'
        popup.setAttribute('aria-hidden', 'false');
        this.elements.contextHelpClose?.focus();

        // Manage aria-expanded for accessibility
       document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => {
            if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
        });
       if(triggerButton) triggerButton.setAttribute('aria-expanded', 'true');

        console.log("[SHOW_CONTEXT_HELP] Popup displayed.");
    }

    hideContextHelp() {
        console.log("[HIDE_CONTEXT_HELP] Hiding context help popup.");
        const popup = this.elements.contextHelpPopup;
        if (popup) {
            popup.style.display = 'none';
            popup.setAttribute('aria-hidden', 'true');
            const triggerButton = document.querySelector('.context-help-btn[aria-expanded="true"]');
             if(triggerButton) {
                triggerButton.setAttribute('aria-expanded', 'false');
                triggerButton.focus();
                 console.log("[HIDE_CONTEXT_HELP] Focus returned to trigger button.");
            } else {
                  console.log("[HIDE_CONTEXT_HELP] Trigger button not found to return focus.");
            }
        } else {
             console.warn("[HIDE_CONTEXT_HELP] Popup element not found.");
        }
    }

  // --- Style Finder Methods ---
  sfStart() { /* ... Add logging within SF methods as needed ... */ }
  sfClose() { /* ... Add logging ... */ this.closeModal(this.elements.sfModal); }
  sfCalculateSteps() { /* ... Add logging ... */ }
  sfRenderStep() { /* ... Add logging ... */ }
  sfSetRole(role) { /* ... Add logging ... */ }
  sfSetTrait(trait, value) { /* ... Add logging ... */ }
  sfNextStep(currentTrait = null) { /* ... Add logging ... */ }
  sfPrevStep() { /* ... Add logging ... */ }
  sfStartOver() { /* ... Add logging ... */ }
  sfComputeScores() { /* ... Add logging ... */ }
  sfUpdateDashboard(forceVisible = false) { /* ... Add logging ... */ }
  toggleStyleFinderDashboard() { /* ... Add logging ... */ }
  sfCalculateResult() { /* ... Add logging ... */ }
  sfGenerateSummaryDashboard() { /* ... Add logging ... */ }
  sfShowFeedback(message) { /* ... Add logging ... */ }
  sfShowTraitInfo(traitName) { /* ... Add logging ... */ }
  sfShowFullDetails(styleNameWithEmoji) { /* ... Add logging ... */ }
  getStyleIcons() { /* ... Add logging ... */ } // This might need to be implemented if not already
  confirmApplyStyleFinderResult(role, styleWithEmoji) { /* ... Add logging ... */ }
  applyStyleFinderResult(role, styleWithEmoji) { /* ... Add logging ... */ }

  // --- Other Helper Functions ---
  getFlairForScore(s) { /* Returns emoji based on score 1-5 */ const score = parseInt(s); if(isNaN(score)) return ''; if(score === 5) return '🌟'; if(score === 4) return '✨'; if(score === 3) return '👍'; if(score === 2) return '🌱'; if(score === 1) return '💧'; return ''; }
  getEmojiForScore(s) { /* ... Deprecated? Use getFlairForScore ... */ return this.getFlairForScore(s); }
  escapeHTML(str) { if (typeof str !== 'string') return ''; return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  getIntroForStyle(styleName){ /* ... Add logging ... */ }
  showNotification(message, type = 'info', duration = 4000) {
        // console.log(`[NOTIFICATION] Type: ${type}, Message: ${message}`); // Can be noisy
        const notificationElement = document.getElementById('app-notification') || this.createNotificationElement();
        if (!notificationElement) return; // Should not happen

        notificationElement.className = `notification-${type}`; // Set class for styling
        notificationElement.textContent = message;
        notificationElement.style.opacity = '1';
        notificationElement.style.top = '70px'; // Position below header
        notificationElement.setAttribute('aria-hidden', 'false');
        notificationElement.setAttribute('role', 'alert');


        // Clear existing timer if any
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Set timer to hide notification
        this.notificationTimer = setTimeout(() => {
            notificationElement.style.opacity = '0';
             notificationElement.style.top = '20px'; // Move up as it fades
             notificationElement.setAttribute('aria-hidden', 'true');
             this.notificationTimer = null;
              // console.log("[NOTIFICATION] Hidden."); // Noisy
        }, duration);
   }

   createNotificationElement() {
        console.log("[CREATE_NOTIFICATION_ELEMENT] Creating notification div.");
        try {
            const div = document.createElement('div');
            div.id = 'app-notification';
            div.setAttribute('aria-live', 'assertive');
            div.setAttribute('aria-hidden', 'true');
            document.body.appendChild(div);
            return div;
        } catch (error) {
            console.error("[CREATE_NOTIFICATION_ELEMENT] Failed to create notification element:", error);
            return null;
        }
    }

  // --- Theme Management ---
  applySavedTheme() {
      console.log("[APPLY_THEME] Applying saved theme.");
      const savedTheme = localStorage.getItem('kinkCompassTheme') || 'light'; // Default to light
      console.log(`[APPLY_THEME] Found saved theme: ${savedTheme}`);
      this.setTheme(savedTheme);
  }

  setTheme(themeName) {
      console.log(`[SET_THEME] Setting theme to: ${themeName}`);
      document.documentElement.setAttribute('data-theme', themeName); // Set on <html> for global access
      localStorage.setItem('kinkCompassTheme', themeName);
      // Update toggle button text/icon if needed
      if (this.elements.themeToggle) {
            // Basic toggle example - adjust if you have more themes
            this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️';
            this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      }
      grantAchievement({}, 'theme_changer'); // Grant achievement (global)
      localStorage.setItem('kinkCompass_theme_changer', 'true');
      console.log(`[SET_THEME] Theme '${themeName}' applied and saved.`);
  }

  toggleTheme() {
      console.log("[TOGGLE_THEME] Toggling theme.");
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light'; // Simple toggle example
      console.log(`[TOGGLE_THEME] Current: ${currentTheme}, New: ${newTheme}`);
      this.setTheme(newTheme);
  }

   // --- Modal Management ---
   openModal(modalElement) {
       if (!modalElement) {
           console.error("[OPEN_MODAL] Failed: Called with null or undefined modalElement.");
           return;
       }
       const modalId = modalElement.id || 'unknown_modal';
       console.log(`[OPEN_MODAL] Attempting to open: #${modalId}`);

       // Close any other currently open modals first? (Optional, depends on desired behavior)
        const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]');
        if (currentlyOpen && currentlyOpen !== modalElement) {
            console.log(`[OPEN_MODAL] Closing currently open modal #${currentlyOpen.id} before opening #${modalId}`);
            this.closeModal(currentlyOpen);
        }


       this.elementThatOpenedModal = document.activeElement; // Store focus
       console.log(`[OPEN_MODAL] Stored focus return element:`, this.elementThatOpenedModal);

       modalElement.setAttribute('aria-hidden', 'false');
       modalElement.style.display = 'flex'; // Use flex as per original CSS
       console.log(`[OPEN_MODAL] Set display:flex and aria-hidden:false for #${modalId}`);

       // Defer focus slightly to ensure modal is fully visible and interactive
       requestAnimationFrame(() => {
           // Try focusing specific elements first (e.g., close button, first input)
            let focusTarget = modalElement.querySelector('.modal-close, input:not([type="hidden"]), select, textarea, button, [href]');
             // If no specific element found, focus the modal container itself
            if (!focusTarget) {
                 modalElement.setAttribute('tabindex', '-1'); // Make modal container focusable
                 focusTarget = modalElement;
            }


           if (focusTarget) {
                try {
                    focusTarget.focus();
                    console.log(`[OPEN_MODAL] Focused element in #${modalId}:`, focusTarget);
                } catch (focusError) {
                     console.error(`[OPEN_MODAL] Error focusing element in #${modalId}:`, focusError, focusTarget);
                     // Fallback to focusing modal container if specific element fails
                     try {
                          modalElement.setAttribute('tabindex', '-1');
                          modalElement.focus();
                          console.log(`[OPEN_MODAL] Fallback focus to modal container #${modalId}`);
                     } catch (fallbackError) {
                          console.error(`[OPEN_MODAL] Error focusing modal container #${modalId}:`, fallbackError);
                     }

                }

           } else {
                 console.warn(`[OPEN_MODAL] No focusable element found or could be determined for #${modalId}`);
           }
       });
   } // End openModal

   closeModal(modalElement) {
       if (!modalElement) {
           console.error("[CLOSE_MODAL] Failed: Called with null or undefined modalElement.");
           return;
        }
       const modalId = modalElement.id || 'unknown_modal';
       console.log(`[CLOSE_MODAL] Attempting to close: #${modalId}`);

       modalElement.setAttribute('aria-hidden', 'true');
       modalElement.style.display = 'none';
       console.log(`[CLOSE_MODAL] Set display:none and aria-hidden:true for #${modalId}`);
       modalElement.removeAttribute('tabindex'); // Remove tabindex if added


       // --- Restore focus carefully ---
       console.log("[CLOSE_MODAL] Attempting to restore focus to:", this.elementThatOpenedModal);
       const elementToFocus = this.elementThatOpenedModal; // Store in local var before clearing
       this.elementThatOpenedModal = null; // Clear stored element immediately

       // Defer focus restoration slightly
       requestAnimationFrame(() => {
            try {
                 // Check if the element still exists and is focusable
                 if (elementToFocus && typeof elementToFocus.focus === 'function' && document.body.contains(elementToFocus)) {
                     elementToFocus.focus();
                     console.log("[CLOSE_MODAL] Focus restored to original element:", elementToFocus);
                 } else {
                     console.warn("[CLOSE_MODAL] Original focus element lost, invalid, or not focusable. Focusing body as fallback.");
                     document.body.focus(); // Fallback focus
                 }
            } catch (e) {
                 console.error("[CLOSE_MODAL] Error during focus restoration:", e);
                 try { document.body.focus(); } catch (e2) { console.error("[CLOSE_MODAL] Fallback body focus also failed:", e2); }
            }
       });


       console.log(`[CLOSE_MODAL] Finished closing #${modalId}.`);
   } // End closeModal

   // <<< --- NEW HELPER FUNCTIONS --- >>>
    getSynergyHints(person) {
        console.log(`[GET_SYNERGY_HINTS] Checking hints for person ${person.id}`);
        if (!person?.traits || typeof synergyHints !== 'object') {
             console.warn("[GET_SYNERGY_HINTS] Missing person traits or synergyHints data.");
             return [];
        }

        const hints = [];
        const traitScores = person.traits;
        const highTraits = Object.entries(traitScores).filter(([, score]) => score >= 4).map(([name]) => name);
        const lowTraits = Object.entries(traitScores).filter(([, score]) => score <= 2).map(([name]) => name);

        // Check positive synergies
        synergyHints.highPositive?.forEach((synergy) => {
            if (synergy.traits?.every((trait) => highTraits.includes(trait))) {
                console.log(`  [GET_SYNERGY_HINTS] Found positive synergy: ${synergy.traits.join(', ')}`);
                hints.push({ type: 'positive', text: synergy.hint });
            }
        });

        // Check interesting dynamics
        synergyHints.interestingDynamics?.forEach((dynamic) => {
            if (dynamic.traits?.high && dynamic.traits?.low &&
                highTraits.includes(dynamic.traits.high) &&
                lowTraits.includes(dynamic.traits.low))
            {
                 console.log(`  [GET_SYNERGY_HINTS] Found dynamic: High ${dynamic.traits.high}, Low ${dynamic.traits.low}`);
                 hints.push({ type: 'dynamic', text: dynamic.hint });
            }
            // Optional: Check reverse dynamic if symmetrical hints aren't provided
        });

         console.log(`[GET_SYNERGY_HINTS] Found ${hints.length} hints.`);
        return hints; // Return array of { type: 'positive'/'dynamic', text: '...' }
    }

     getGoalAlignmentHints(person) {
        console.log(`[GET_GOAL_HINTS] Checking hints for person ${person.id}`);
        const hints = [];
        if (!person?.goals || !person?.traits || typeof goalKeywords !== 'object') {
            console.warn("[GET_GOAL_HINTS] Missing goals, traits, or goalKeywords data.");
            return hints;
        }

        const activeGoals = person.goals.filter(g => !g.done);
         console.log(`[GET_GOAL_HINTS] Found ${activeGoals.length} active goals.`);

        activeGoals.slice(0, 5).forEach(goal => { // Limit hints to avoid overwhelming user
            const goalTextLower = goal.text.toLowerCase();
            Object.entries(goalKeywords).forEach(([keyword, data]) => {
                if (goalTextLower.includes(keyword)) {
                     console.log(`  [GET_GOAL_HINTS] Goal "${goal.text}" matches keyword "${keyword}".`);
                    data.relevantTraits?.forEach(traitName => {
                        if (person.traits.hasOwnProperty(traitName)) {
                            const score = person.traits[traitName];
                            const promptTemplate = data.promptTemplates?.[Math.floor(Math.random() * data.promptTemplates.length)];
                            if(promptTemplate) {
                                const hintText = promptTemplate.replace('{traitName}', traitName);
                                hints.push(`For goal "${goal.text}": ${hintText} (Your ${traitName} score: ${score})`);
                                 console.log(`    [GET_GOAL_HINTS] Generated hint: ${hintText}`);
                            }
                        }
                    });
                }
            });
        });

        // Deduplicate and limit hints
        const uniqueHints = [...new Set(hints)];
         console.log(`[GET_GOAL_HINTS] Found ${uniqueHints.length} unique hints.`);
        return uniqueHints.slice(0, 3); // Return max 3 unique hints
    }

    getDailyChallenge(persona = null) {
        console.log("[GET_DAILY_CHALLENGE] Generating challenge.");
        if (typeof challenges !== 'object') {
            console.error("[GET_DAILY_CHALLENGE] Challenges data structure not found or invalid.");
            return null;
        }

        let possibleCategories = ['communication', 'exploration']; // Base categories

        // Add role-specific categories if persona provided
        if (persona?.role) {
            const roleKey = persona.role.toLowerCase(); // e.g., "dominant"
             if (challenges[`${roleKey}_challenges`]) {
                possibleCategories.push(`${roleKey}_challenges`);
                 console.log(`[GET_DAILY_CHALLENGE] Added role category: ${roleKey}_challenges`);
             }
        }
        // Could add switch logic if needed

         console.log("[GET_DAILY_CHALLENGE] Possible categories:", possibleCategories);
        if (possibleCategories.length === 0) {
            console.warn("[GET_DAILY_CHALLENGE] No challenge categories available.");
            return null;
        }

        // Select a random category
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
        const categoryChallenges = challenges[randomCategoryKey];

        if (!categoryChallenges || categoryChallenges.length === 0) {
             console.warn(`[GET_DAILY_CHALLENGE] No challenges found in selected category: ${randomCategoryKey}`);
             // Fallback to general if specific fails?
             const generalChallenges = challenges['communication'] || challenges['exploration'];
             if(generalChallenges && generalChallenges.length > 0) {
                 const fallbackChallenge = generalChallenges[Math.floor(Math.random() * generalChallenges.length)];
                 return { ...fallbackChallenge, category: 'General Fallback' }; // Add category info
             }
             return null; // No challenges found at all
        }

        // Select a random challenge from the category
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];
         console.log(`[GET_DAILY_CHALLENGE] Selected challenge from category ${randomCategoryKey}:`, randomChallenge);

        return { ...randomChallenge, category: randomCategoryKey.replace('_challenges', '') }; // Return challenge with category info
    }

    getKinkOracleReading(person) {
        console.log(`[GET_ORACLE_READING] Generating reading for person ${person.id}`);
        if (typeof oracleReadings !== 'object' || !oracleReadings.openings || !oracleReadings.focusAreas || !oracleReadings.encouragements || !oracleReadings.closings) {
            console.error("[GET_ORACLE_READING] Oracle readings data structure is invalid or missing parts.");
            return null;
        }

        const reading = {};

        try {
             reading.opening = oracleReadings.openings[Math.floor(Math.random() * oracleReadings.openings.length)];

             // Determine focus
             let focusText = "";
             const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score)) && score >= 1 && score <= 5) : [];

             if (traits.length > 0 && Math.random() > 0.3) { // Prioritize traits 70% of the time
                  traits.sort((a, b) => Math.abs(a[1] - 3) > Math.abs(b[1] - 3) ? -1 : 1); // Sort by extremity
                  const focusTrait = traits[Math.floor(Math.random() * Math.min(traits.length, 3))]; // Pick one of top/bottom 3
                   if (focusTrait) {
                      const traitName = focusTrait[0];
                      const template = oracleReadings.focusAreas.traitBased[Math.floor(Math.random() * oracleReadings.focusAreas.traitBased.length)];
                      focusText = template.replace('{traitName}', traitName);
                       console.log(`[GET_ORACLE_READING] Focus based on trait: ${traitName}`);
                  }
             }

              // Fallback to style or general if no trait focus chosen or possible
             if (!focusText && person?.style && Math.random() > 0.5) { // Use style 50% of remaining time
                 const template = oracleReadings.focusAreas.styleBased[Math.floor(Math.random() * oracleReadings.focusAreas.styleBased.length)];
                 focusText = template.replace('{styleName}', person.style);
                  console.log(`[GET_ORACLE_READING] Focus based on style: ${person.style}`);
             }

              // Final fallback to general
             if (!focusText) {
                 focusText = oracleReadings.focusAreas.general[Math.floor(Math.random() * oracleReadings.focusAreas.general.length)];
                  console.log(`[GET_ORACLE_READING] Focus based on general theme.`);
             }
             reading.focus = focusText;


             reading.encouragement = oracleReadings.encouragements[Math.floor(Math.random() * oracleReadings.encouragements.length)];
             reading.closing = oracleReadings.closings[Math.floor(Math.random() * oracleReadings.closings.length)];

              console.log("[GET_ORACLE_READING] Reading generated successfully:", reading);
             return reading;

        } catch (error) {
             console.error("[GET_ORACLE_READING] Error during generation:", error);
             return null;
        }
   }


   // --- Achievement Checkers ---
    checkGoalStreak(person) {
         console.log(`[ACHIEVEMENT_CHECK] Checking goal streak for person ${person.id}`);
         if (!person?.goals) return;

         const completedGoals = person.goals.filter(g => g.done && g.completedAt)
                                      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)); // Sort by completion date, newest first

         if (completedGoals.length < 3) return; // Need at least 3 completed

         const now = new Date();
         const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

         // Check if the 3 most recent completions are within the last 7 days
         const recentCompletions = completedGoals.slice(0, 3).filter(g => new Date(g.completedAt) >= sevenDaysAgo);

         if (recentCompletions.length >= 3) {
              console.log(`[ACHIEVEMENT_CHECK] Goal streak criteria met!`);
              if(grantAchievement(person, 'goal_streak_3')) {
                  this.showNotification("Achievement Unlocked: Goal Streak! 🔥", "achievement");
                  this.saveToLocalStorage(); // Save achievement grant
              }
         } else {
              console.log(`[ACHIEVEMENT_CHECK] Goal streak criteria not met (Found ${recentCompletions.length} recent completions).`);
         }
     }

     checkTraitTransformation(person, currentSnapshot) {
         console.log(`[ACHIEVEMENT_CHECK] Checking trait transformation for person ${person.id}`);
         if (!person?.history || person.history.length < 1 || !currentSnapshot?.traits) {
              console.log(`[ACHIEVEMENT_CHECK] Not enough history or current snapshot data.`);
              return; // Need at least one previous snapshot
         }

         const previousSnapshot = person.history[person.history.length - 1]; // Get the most recent snapshot *before* the current one
         if (!previousSnapshot?.traits) {
              console.log(`[ACHIEVEMENT_CHECK] Previous snapshot data invalid.`);
              return;
         }


         let transformed = false;
         for (const traitName in currentSnapshot.traits) {
             if (previousSnapshot.traits.hasOwnProperty(traitName)) {
                 const currentScore = parseInt(currentSnapshot.traits[traitName], 10);
                 const previousScore = parseInt(previousSnapshot.traits[traitName], 10);

                 if (!isNaN(currentScore) && !isNaN(previousScore) && currentScore - previousScore >= 2) {
                     console.log(`[ACHIEVEMENT_CHECK] Trait '${traitName}' transformed (${previousScore} -> ${currentScore})!`);
                     transformed = true;
                     break; // Found one transformation, no need to check further
                 }
             }
         }

         if (transformed) {
              if(grantAchievement(person, 'trait_transformer')) {
                   this.showNotification("Achievement Unlocked: Trait Transformer! ✨", "achievement");
                   // Save occurs when snapshot is saved
              }
         } else {
              console.log(`[ACHIEVEMENT_CHECK] No significant trait transformation detected.`);
         }
     }

    checkConsistentSnapper(person, currentTimestamp) {
         console.log(`[ACHIEVEMENT_CHECK] Checking consistent snapper for person ${person.id}`);
         if (!person?.history || person.history.length < 1) {
              console.log(`[ACHIEVEMENT_CHECK] Not enough history data.`);
              return; // Need at least one previous snapshot
         }

         const previousSnapshot = person.history[person.history.length - 1]; // Get the most recent snapshot
         if (!previousSnapshot?.timestamp) {
               console.log(`[ACHIEVEMENT_CHECK] Previous snapshot timestamp invalid.`);
               return;
         }

         const prevTime = new Date(previousSnapshot.timestamp);
         const currentTime = new Date(currentTimestamp);
         const timeDiff = currentTime.getTime() - prevTime.getTime();
         const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

         console.log(`[ACHIEVEMENT_CHECK] Days since last snapshot: ${daysDiff.toFixed(2)}`);

         if (daysDiff >= 3) { // Example: 3 days apart
              console.log(`[ACHIEVEMENT_CHECK] Consistent snapper criteria met!`);
              if(grantAchievement(person, 'consistent_snapper')) {
                  this.showNotification("Achievement Unlocked: Consistent Chronicler! 📅", "achievement");
                   // Save occurs when snapshot is saved
              }
         } else {
              console.log(`[ACHIEVEMENT_CHECK] Consistent snapper criteria not met.`);
         }
    }


} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS

// --- Initialization ---
try {
    console.log("[INIT] SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp(); // Make instance globally accessible
    console.log("[INIT] SCRIPT END: KinkCompass App Initialized Successfully on window.kinkCompassApp");
} catch (error) {
    console.error("[INIT] FATAL error during App initialization:", error);
    // Display error to user more prominently
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 80%; max-height: 50vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>Message: ${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}`;
    document.body.prepend(errorDiv);
}
