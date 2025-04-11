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
    subStyleSuggestions,
    domStyleSuggestions
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
    this.activeDetailModalTab = 'tab-traits-breakdown';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;
    this.isSaving = false;

    // Style Finder State
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} };
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false;
    this.previousScores = null;
    this.styleFinderTraits = [];
    this.traitFootnotes = {};
    this.sliderDescriptions = {};
    this.sfSliderInteracted = false;

    // Debounced search handlers
    this.debouncedGlossarySearch = debounce(this.filterGlossary, 300);
    this.debouncedStyleDiscoverySearch = debounce(this.filterStyleDiscovery, 300);

    console.log("[CONSTRUCTOR] Mapping elements...");
    this.elements = this.mapElements();
    console.log(`[CONSTRUCTOR] Elements mapped.`);

    if (!this.elements.role || !this.elements.style || !this.elements.traitsContainer || !this.elements.peopleList || !this.elements.formSection) {
        console.error("[CONSTRUCTOR] CRITICAL ERROR: Missing core UI elements. App cannot function.");
        alert("App critical error: Missing core UI elements (role, style, traits, list, form). Please check index.html or reload.");
        return;
    }
    if (!this.elements.sfModal || !this.elements.sfStepContent) {
        console.warn("[CONSTRUCTOR] Style Finder UI elements missing. Style Finder feature may be disabled.");
    }

    sfRenderStep() {
        if (!this.styleFinderActive || !this.elements.sfStepContent) return;
        this.elements.sfStepContent.classList.add('sf-step-transition');

        const steps = this.sfCalculateSteps();
        const currentStepIndex = this.styleFinderStep;
        const totalSteps = steps.length;

        if (currentStepIndex >= totalSteps || currentStepIndex < 0) {
            console.error(`[SF_RENDER_STEP] Invalid step index: ${currentStepIndex}. Total steps: ${totalSteps}. Resetting.`);
            this.sfStartOver(); return;
        }
        const currentStepData = steps[currentStepIndex];
        console.log(`[SF_RENDER_STEP] Rendering step ${currentStepIndex + 1} (${currentStepData.type}). Trait (if any): ${currentStepData.name || 'N/A'}`); // Debug log

        // Progress Bar Update
        const progressPercent = totalSteps > 1 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;
        if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = `Step ${currentStepIndex + 1} / ${totalSteps}`;
        if(this.elements.sfProgressBar) {
             this.elements.sfProgressBar.style.width = `${progressPercent}%`;
             this.elements.sfProgressBar.setAttribute('aria-valuenow', progressPercent);
        }

        let html = '';
        let showDashboard = false;

        switch (currentStepData.type) {
            case 'role_selection':
                html = `
                    <div class="sf-step-inner">
                        <h2>${escapeHTML(currentStepData.title)}</h2>
                        <p>${escapeHTML(currentStepData.text)}</p>
                        <div class="sf-button-container">
                            <button type="button" data-action="setRole" data-role="submissive" class="sf-role-btn sub-btn">Submissive Path 🙇‍♀️</button>
                            <button type="button" data-action="setRole" data-role="dominant" class="sf-role-btn dom-btn">Dominant Path 👑</button>
                        </div>
                    </div>`;
                 if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
                 this.hasRenderedDashboard = false;
                 showDashboard = false;
                break;

            case 'trait':
                const traitName = currentStepData.name;
                const traitDesc = currentStepData.desc;
                const currentValue = this.styleFinderAnswers.traits[traitName] ?? 5;
                const footnote = this.traitFootnotes[traitName] || '';
                const sliderDescArray = this.sliderDescriptions[traitName] || [];
                const currentDescText = sliderDescArray[Math.max(0, Math.min(9, currentValue - 1))] || `Value: ${currentValue}`;
                const escapedTraitName = escapeHTML(traitName);

                html = `
                    <div class="sf-step-inner">
                        <div class="sf-trait-content">
                             <h2>
                                ${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}
                                <button type="button" class="sf-info-icon" data-trait="${escapedTraitName}" aria-label="Info about ${escapedTraitName}" title="Show info for ${escapedTraitName}">?</button>
                             </h2>
                             <p class="sf-trait-desc">${escapeHTML(traitDesc)}</p>
                             <input type="range" class="sf-trait-slider" data-trait="${escapedTraitName}" min="1" max="10" value="${currentValue}" aria-label="${escapedTraitName} rating" step="1">
                             <div class="sf-slider-description" id="sf-desc-${escapedTraitName}">${escapeHTML(currentDescText)}</div>
                             <div class="sf-slider-footnote">${escapeHTML(footnote)}</div>
                        </div>
                        <div class="sf-button-container trait-buttons">
                             ${currentStepIndex > 1 ? '<button type="button" data-action="prev" class="sf-nav-btn prev-btn">⬅️ Back</button>' : '<span class="sf-nav-placeholder"></span>'}
                             <button type="button" data-action="next" data-currenttrait="${escapedTraitName}" class="sf-nav-btn next-btn">Next ➡️</button>
                        </div>
                    </div>
                    `;
                this.sfSliderInteracted = this.styleFinderAnswers.traits[traitName] !== undefined;
                showDashboard = true;
                break;

            case 'result':
                const resultData = this.sfCalculateResult();
                 if (!resultData?.topStyle) {
                     html = '<div class="sf-step-inner error-text"><p>Could not calculate results. Please try again.</p><button type="button" data-action="startOver" class="sf-nav-btn">Restart</button></div>';
                     break;
                 }
                const escapedTopStyleName = escapeHTML(resultData.topStyle.name);

                html = `
                     <div class="sf-step-inner sf-result-step">
                         <h2>${escapeHTML(currentStepData.title)}</h2>
                         <p class="sf-result-intro">Based on your responses, here are styles that seem to resonate:</p>

                         <div class="sf-result-summary">
                            <h3>✨ Top Suggestion ✨</h3>
                            <div class="sf-result-card top-suggestion">
                                 <h4>${escapedTopStyleName}</h4>
                                 <p><strong>${escapeHTML(resultData.topStyleDetails?.short || '')}</strong> ${escapeHTML(resultData.topStyleDetails?.long || 'Details loading...')}</p>
                                 <button type="button" class="link-button sf-details-link" data-action="showDetails" data-style="${escapedTopStyleName}">(Show Full Details)</button>
                             </div>

                             <h4>Possible Dynamic</h4>
                              <div class="sf-result-card dynamic-match">
                                 <p>Match: <strong>${escapeHTML(resultData.topMatch?.match || '?')}</strong></p>
                                 <p><em>Dynamic: ${escapeHTML(resultData.topMatch?.dynamic || '?')}</em></p>
                                 <p class="match-desc">${escapeHTML(resultData.topMatch?.longDesc || '?')}</p>
                             </div>

                             <h4>Other Resonating Styles</h4>
                              <div id="summary-dashboard">
                                ${this.sfGenerateSummaryDashboard(resultData.sortedScores.slice(1))}
                             </div>
                         </div>


                         <div class="sf-button-container result-buttons">
                             <button type="button" data-action="confirmApply" data-role="${this.styleFinderRole}" data-style="${escapedTopStyleName}" class="sf-action-btn apply-btn">Apply '${escapedTopStyleName}' to Form</button>
                             <button type="button" data-action="prev" class="sf-nav-btn prev-btn">⬅️ Back to Traits</button>
                             <button type="button" data-action="startOver" class="sf-nav-btn clear-btn">Start Over 🔄</button>
                         </div>
                     </div>`;
                showDashboard = false;

                 if (typeof confetti === 'function') {
                     try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, angle: 90 }); } catch (e) { console.warn("Confetti error:", e); }
                 }
                 grantAchievement({}, 'style_finder_complete', this.showNotification.bind(this));
                break;

            default:
                html = '<div class="sf-step-inner error-text"><p>Error: Unknown step type.</p></div>';
                showDashboard = false;
        }

        // Update dashboard visibility
        if (this.elements.sfDashboard) {
             if (showDashboard) {
                  if (!this.hasRenderedDashboard) { this.sfUpdateDashboard(true); this.hasRenderedDashboard = true; }
                  else { this.sfUpdateDashboard(); }
                  this.elements.sfDashboard.style.display = 'block';
             } else { this.elements.sfDashboard.style.display = 'none'; }
        }

        // Render HTML with transition handling
        requestAnimationFrame(() => {
             this.elements.sfStepContent.innerHTML = html;
             setTimeout(() => { this.elements.sfStepContent.classList.remove('sf-step-transition'); }, 50);
        });
    } // End sfRenderStep
    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners();
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and initial render...");
    try {
        this.loadFromLocalStorage();
        this.applySavedTheme();
    } catch (error) {
        console.error("[CONSTRUCTOR] Error during initial load/theme:", error);
        this.showNotification("Error loading initial data or theme. Check console.", "error", 5000);
    }
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Element Mapping ---
  mapElements() {
    const get = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn(`[MAP_ELEMENTS] Element with ID '${id}' not found.`);
        return el;
    };
    const query = (selector) => {
        const el = document.querySelector(selector);
        if (!el) console.warn(`[MAP_ELEMENTS] Element with selector '${selector}' not found.`);
        return el;
    };

    return {
        // Core Form
        formSection: get('form-section'),
        mainForm: query('#form-section form'),
        formTitle: get('form-title'),
        name: get('name'),
        avatarDisplay: get('avatar-display'),
        avatarInput: get('avatar-input'),
        avatarPicker: query('.avatar-picker'),
        role: get('role'),
        style: get('style'),
        styleExploreLink: get('style-explore-link'),
        formStyleFinderLink: get('form-style-finder-link'),
        traitsContainer: get('traits-container'),
        traitsMessage: get('traits-message'),
        save: get('save'),
        saveButtonText: query('#save .button-text'),
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
            if (Array.isArray(parsedData)) {
                this.people = parsedData;
                 console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
                 this.people.forEach((p, index) => {
                     if (!p.id) p.id = generateSimpleId() + `_${index}`;
                     if (!p.name) p.name = `Persona ${p.id.substring(0, 4)}`;
                     if (!p.role) p.role = 'submissive';
                     if (!p.style) p.style = '';
                     if (!p.avatar) p.avatar = '❓';
                     if (typeof p.traits !== 'object' || p.traits === null) p.traits = {};
                     if (!Array.isArray(p.achievements)) p.achievements = [];
                     if (!Array.isArray(p.goals)) p.goals = [];
                     if (!Array.isArray(p.history)) p.history = [];
                     if (p.reflections === undefined) p.reflections = "";
                 });
            } else {
                 console.warn("[LOAD_STORAGE] Invalid data format found in localStorage. Starting fresh.");
                 this.people = [];
            }
        } else {
            console.log("[LOAD_STORAGE] No data found in localStorage.");
            this.people = [];
        }
    } catch (error) {
        console.error("[LOAD_STORAGE] Error loading or parsing data:", error);
        this.showNotification("Error loading data. Starting fresh.", "error", 5000);
        this.people = [];
    }
}

  saveToLocalStorage() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
        console.log("[SAVE_STORAGE] Saving personas.");
        try {
            localStorage.setItem('kinkCompassPeople_v2', JSON.stringify(this.people));
            console.log(`[SAVE_STORAGE] Saved ${this.people.length} personas.`);
        } catch (error) {
            console.error("[SAVE_STORAGE] Error saving data:", error);
             if (error.name === 'QuotaExceededError' || (error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                 this.showNotification("Save failed: Storage limit exceeded. Export data & remove personas.", "error", 10000);
             } else {
                 this.showNotification("Error saving data. Changes might be lost.", "error", 5000);
             }
        }
        this.saveTimeout = null;
    }, 100);
  }

  // --- Onboarding ---
  checkAndShowWelcome() {
    console.log("[WELCOME] Checking for first visit.");
    let welcomed = false;
    try {
         welcomed = localStorage.getItem('kinkCompassWelcomed_v2_8_8');
    } catch (e) {
        console.error("[WELCOME] Error reading welcome flag:", e);
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
            localStorage.setItem('kinkCompassWelcomed_v2_8_8', 'true');
            console.log("[WELCOME] Welcome flag set for v2.8.8.");
        } catch (e) {
             console.error("[WELCOME] Failed to set welcome flag in localStorage:", e);
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
        // *** ADD THIS LOG ***
        console.log(`Adding listener for: ${elementName}, Handler type: ${typeof handler}, Handler:`, handler);
        if (typeof handler !== 'function') {
            console.error(`HANDLER IS NOT A FUNCTION for ${elementName}`);
            // Optionally throw an error here to stop execution immediately
            // throw new Error(`Invalid handler provided for ${elementName}`);
            return; // Stop trying to add listener if handler is invalid
        }
        element.addEventListener(event, handler.bind(this), options);
    } else {
        // ... (warning for missing element) ...
    }
};

    // Form Interactions
    safeAddListener(this.elements.mainForm, 'submit', (e) => e.preventDefault(), 'mainForm submit');
    safeAddListener(this.elements.role, 'change', (e) => {
        console.log("[EVENT] Role changed");
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, '');
        if(this.elements.style) this.elements.style.value = '';
        this.updateLivePreview();
        this.updateStyleExploreLink();
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
            this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
            this.updateLivePreview();
        }
    }, 'avatarPicker');

    // Trait Interactions (Delegated)
    safeAddListener(this.elements.traitsContainer, 'input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e);
            this.updateLivePreview();
        }
    }, 'traitsContainer input');
    safeAddListener(this.elements.traitsContainer, 'click', (e) => {
         const infoButton = e.target.closest('.trait-info-btn');
        if (infoButton) {
            console.log("[EVENT] Trait info clicked");
            this.handleTraitInfoClick(e, infoButton);
        }
    }, 'traitsContainer click');

    // Popups & Context Help (Delegated)
    safeAddListener(this.elements.formStyleFinderLink, 'click', this.sfStart, 'formStyleFinderLink');
    safeAddListener(document.body, 'click', (e) => {
        const helpButton = e.target.closest('.context-help-btn');
        if (helpButton && helpButton.dataset.helpKey) {
            console.log("[EVENT] Context help clicked");
            this.showContextHelp(helpButton.dataset.helpKey, helpButton);
        }
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
        if(item.button){
             safeAddListener(item.button, 'click', () => {
                console.log(`[EVENT] Close clicked for ${item.name}`);
                this.closeModal(item.modal);
            }, `${item.name} Close`);
        } else if (item.modal) {
             console.warn(`[LISTENER SETUP] Close button for modal '${item.name}' not found, but modal element exists.`);
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
        this.elements.importFileInput?.click();
    }, 'importBtn');
    safeAddListener(this.elements.importFileInput, 'change', this.importData, 'importFileInput');
    safeAddListener(this.elements.styleFinderTriggerBtn, 'click', this.sfStart, 'styleFinderTriggerBtn');

    // Other Modal/Feature Specific Listeners
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => this.renderStyleDiscoveryContent(), 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.styleDiscoverySearchInput, 'input', (e) => this.debouncedStyleDiscoverySearch(e.target.value), 'styleDiscoverySearchInput');
    safeAddListener(this.elements.glossarySearchInput, 'input', (e) => this.debouncedGlossarySearch(e.target.value), 'glossarySearchInput');
    safeAddListener(this.elements.glossarySearchClear, 'click', this.clearGlossarySearch, 'glossarySearchClear');
    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody click');
    safeAddListener(this.elements.modalBody, 'submit', this.handleModalBodyClick, 'modalBody submit');
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs');
    safeAddListener(this.elements.glossaryBody, 'click', this.handleGlossaryLinkClick, 'glossaryBody link');
    safeAddListener(document.body, 'click', this.handleGlossaryLinkClick, 'body glossaryLink');
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
    if (!listItem) return;

    const personId = listItem.dataset.id;

    if (target.closest('.edit-btn')) {
        console.log(`[EVENT] Edit clicked for ID: ${personId}`);
        e.stopPropagation();
        this.editPerson(personId);
    } else if (target.closest('.delete-btn')) {
        console.log(`[EVENT] Delete clicked for ID: ${personId}`);
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete this persona? This cannot be undone.`)) {
            this.deletePerson(personId);
        }
    } else if (target.closest('.person-info')) {
        console.log(`[EVENT] View details clicked for ID: ${personId}`);
        this.showPersonDetails(personId);
    }
}

  handleListKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target.closest('.person-info, .edit-btn, .delete-btn');
          const listItem = target?.closest('li[data-id]');
          if (!target || !listItem) return;

          e.preventDefault();

          const personId = listItem.dataset.id;

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
      if (e.key === 'Escape') {
          console.log("[EVENT] Escape key pressed");
          const openModal = document.querySelector('.modal[aria-hidden="false"]:not([id="trait-info-popup"]):not([id="context-help-popup"])');
          if (openModal) {
              console.log(`[ESC] Closing modal: #${openModal.id}`);
              this.closeModal(openModal);
              return;
          }
          if (this.sfCloseAllPopups()) return;
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

  handleTraitSliderInput(e) {
    const slider = e.target;
    const valueDisplay = slider.nextElementSibling;
    if (valueDisplay?.classList.contains('trait-value')) {
      valueDisplay.textContent = slider.value;
      this.updateTraitDescription(slider);
    }
  }

  handleTraitInfoClick(e, button) {
      e.preventDefault();
      if (!button || !button.dataset.traitName) return;
      this.showTraitInfo(button.dataset.traitName, button);
  }

  handleModalBodyClick(e) {
    const target = e.target;
    const personId = this.elements.modal?.dataset.personId;
    if (!personId) return;

    const goalToggleButton = target.closest('.goal-toggle-btn');
    const goalDeleteButton = target.closest('.goal-delete-btn');
    const addGoalForm = target.closest('#add-goal-form');
    const journalPromptButton = target.closest('#journal-prompt-btn');
    const saveReflectionsButton = target.closest('#save-reflections-btn');
    const snapshotButton = target.closest('#snapshot-btn');
    const snapshotToggleButton = target.closest('.snapshot-toggle');
    const oracleButton = target.closest('#oracle-btn');

    if (goalToggleButton) {
        e.preventDefault();
        const goalId = goalToggleButton.dataset.goalId;
        const listItem = goalToggleButton.closest('li');
        if (goalId) this.toggleGoalStatus(personId, goalId, listItem);
    } else if (goalDeleteButton) {
        e.preventDefault();
        const goalId = goalDeleteButton.dataset.goalId;
        if (goalId && confirm(`Are you sure you want to delete this goal?`)) {
            this.deleteGoal(personId, goalId);
        }
    } else if (e.type === 'submit' && addGoalForm) {
        e.preventDefault();
        this.addGoal(personId, addGoalForm);
    } else if (journalPromptButton) {
        e.preventDefault();
        this.showJournalPrompt(personId);
    } else if (saveReflectionsButton) {
        e.preventDefault();
        this.saveReflections(personId);
    } else if (snapshotButton) {
        e.preventDefault();
        this.addSnapshotToHistory(personId);
    } else if (snapshotToggleButton) {
        e.preventDefault();
        this.toggleSnapshotInfo(snapshotToggleButton);
    } else if (oracleButton) {
        e.preventDefault();
        this.showKinkOracle(personId);
    }
}


  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) {
          console.log(`[EVENT] Theme selected: ${button.dataset.theme}`);
          this.setTheme(button.dataset.theme);
      }
  }

  handleStyleFinderAction(action, dataset = {}, triggerElement = null) {
        switch (action) {
            case 'setRole':
                if (dataset.role) this.sfSetRole(dataset.role);
                break;
            case 'next':
                const currentTrait = dataset.currenttrait;
                this.sfNextStep(currentTrait);
                break;
            case 'prev':
                this.sfPrevStep();
                break;
            case 'startOver':
                this.sfStartOver();
                break;
            case 'confirmApply':
                 if (dataset.role && dataset.style) {
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
        this.sfSetTrait(traitName, value);
        const descElement = document.getElementById(`sf-desc-${traitName}`);
        if (descElement && this.sliderDescriptions[traitName]) {
             const descArray = this.sliderDescriptions[traitName];
             const descText = descArray[Math.max(0, Math.min(9, value - 1))] || `Value: ${value}`;
             descElement.textContent = escapeHTML(descText);
        }
         this.sfUpdateDashboard();
         this.sfSliderInteracted = true;
    }

  handleDetailTabClick(e) {
        const link = e.target.closest('.tab-link[data-tab-id]');
        if (!link) return;

        e.preventDefault();
        const newTabId = link.dataset.tabId;
        const personId = this.elements.modal?.dataset.personId;
        const person = this.people.find(p => p.id === personId);
        if (!person) return;
        console.log(`[EVENT] Detail tab clicked: ${newTabId}`);

        const activeTab = this.elements.modalTabs.querySelector('.tab-link.active');
        const activeContent = this.elements.modalBody.querySelector('.tab-content.active');
        activeTab?.classList.remove('active');
        activeTab?.setAttribute('aria-selected', 'false');
        activeContent?.classList.remove('active');

        link.classList.add('active');
        link.setAttribute('aria-selected', 'true');
        const contentPane = document.getElementById(newTabId);
        if (contentPane) {
            contentPane.classList.add('active');
            this.activeDetailModalTab = newTabId;

             if (newTabId === 'tab-history' && this.chartInstance) {
                requestAnimationFrame(() => this.chartInstance?.resize());
            }
            if (newTabId === 'tab-insights') {
                this.displayDailyChallenge(person);
            }
             if (contentPane.querySelector('.loading-text')) {
                 this.renderDetailTabContent(person, newTabId, contentPane);
             }
            contentPane.focus();

        } else {
            console.warn(`Content pane not found for tab ID: ${newTabId}`);
        }
    }

   handleGlossaryLinkClick(e) {
        const link = e.target.closest('a.glossary-link[data-term-key]');
        if (link) {
             e.preventDefault();
             const termKey = link.dataset.termKey;
             console.log(`[EVENT] Glossary link clicked for key: ${termKey}`);
             if (!this.elements.glossaryModal || this.elements.glossaryModal.getAttribute('aria-hidden') === 'true') {
                 this.showGlossary(termKey);
             } else {
                 this.highlightGlossaryTerm(termKey);
             }
        }
    }

   handleExploreStyleLinkClick(e) {
       e.preventDefault();
       const styleName = this.elements.style?.value;
       if (styleName) {
           console.log(`[EVENT] Explore style link clicked for: ${styleName}`);
           this.showStyleDiscovery(styleName);
       } else {
           console.warn("[EVENT] Explore style link clicked, but no style selected.");
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
    const roleData = bdsmData[roleKey];
    const styles = roleData?.styles || [];
    this.elements.style.innerHTML = `<option value="">-- Select Style --</option>`;

    if (!roleData) {
        console.warn(`[RENDER_STYLES] No style data found for role: ${roleKey}`);
        this.elements.style.disabled = true;
    } else {
        this.elements.style.disabled = false;
        styles.forEach(style => {
             this.elements.style.innerHTML += `<option value="${escapeHTML(style.name)}">${escapeHTML(style.name)}</option>`;
        });
    }
    console.log(`[RENDER] Rendered ${styles.length} styles.`);
    this.updateStyleExploreLink();
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
        const addedTraitNames = new Set();

        (roleData.coreTraits || []).forEach(trait => {
            if (!addedTraitNames.has(trait.name)) {
                traitsToRender.push(trait);
                addedTraitNames.add(trait.name);
            }
        });

        // Use the already imported normalizeStyleKey function
        const normalizedStyle = normalizeStyleKey(styleName);
        if (normalizedStyle && roleData.styles) {
            const styleData = roleData.styles.find(s => normalizeStyleKey(s.name) === normalizedStyle);
            (styleData?.traits || []).forEach(trait => {
                if (!addedTraitNames.has(trait.name)) {
                    traitsToRender.push(trait);
                    addedTraitNames.add(trait.name);
                }
            });
        }

        traitsToRender.sort((a, b) => a.name.localeCompare(b.name));

        if (traitsToRender.length > 0) {
            const currentTraits = this.currentEditId
                ? this.people.find(p => p.id === this.currentEditId)?.traits
                : (this.previewPerson?.traits || {});

            let traitsHTML = traitsToRender.map(trait => {
                 const currentValue = currentTraits?.[trait.name] ?? 3;
                 return this.createTraitHTML(trait, currentValue);
            }).join('');

            this.elements.traitsContainer.innerHTML = traitsHTML;
            this.elements.traitsContainer.style.display = 'block';
            this.elements.traitsMessage.style.display = 'none';
            this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                 this.updateTraitDescription(slider);
            });
        } else {
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
      if (!trait || !trait.name || !trait.desc || !trait.explanation) {
           console.warn("[CREATE_TRAIT_HTML] Invalid trait data received:", trait);
           return '';
      }
      const escapedName = escapeHTML(trait.name);
      const uniqueId = `trait-${escapedName.replace(/[^a-zA-Z0-9]/g, '-')}-${generateSimpleId()}`;
      const escapedExplanation = escapeHTML(trait.explanation);
      const currentValue = Math.max(1, Math.min(5, parseInt(value, 10) || 3));
      const descriptionText = trait.desc[currentValue] || trait.desc[3] || `Current value: ${currentValue}`;

      // REMOVED: {/* Add explanation to title */}
      return `
        <div class="trait">
            <label for="${uniqueId}" class="trait-label">
                <span>${escapedName.charAt(0).toUpperCase() + escapedName.slice(1)} ${getFlairForScore(currentValue)}</span>
                <button type="button" class="small-btn context-help-btn trait-info-btn"
                        data-trait-name="${escapedName}"
                        aria-label="Info about ${escapedName}" aria-expanded="false"
                        title="${escapedExplanation}">?</button>
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
    if (!slider?.dataset.traitName) return;

    const traitName = slider.dataset.traitName;
    const value = slider.value;
    const descElement = document.getElementById(`desc-${slider.id}`);
    const labelSpan = slider.closest('.trait')?.querySelector('.trait-label span');
    if (!descElement || !labelSpan) return;

    let traitData = null;
    for (const roleKey in bdsmData) {
        const roleData = bdsmData[roleKey];
        traitData = roleData.coreTraits?.find(t => t.name === traitName) ||
                    roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (traitData) break;
    }

    if (traitData?.desc?.[value]) {
        descElement.textContent = escapeHTML(traitData.desc[value]);
        labelSpan.textContent = `${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))} ${getFlairForScore(value)}`;
    } else {
         console.warn(`[UPDATE_TRAIT_DESC] Could not find description for trait '${traitName}' at value ${value}.`);
         descElement.textContent = `Value: ${value}`;
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
      this.elements.peopleList.innerHTML = this.people
        .map(person => this.createPersonListItemHTML(person))
        .join('');

      if (this.lastSavedId) {
          const listItem = this.elements.peopleList.querySelector(`li[data-id="${this.lastSavedId}"]`);
          if (listItem) {
               listItem.classList.add('item-just-saved');
               setTimeout(() => listItem?.classList.remove('item-just-saved'), 1500);
          }
          this.lastSavedId = null;
      }
    }
    console.log(`[RENDER] Rendered ${this.people.length} personas in list.`);
}


  createPersonListItemHTML(person) {
        if (!person?.id || !person.name) {
            console.warn("[CREATE_PERSON_ITEM] Invalid person data received:", person);
            return '';
        }
        const escapedName = escapeHTML(person.name);
        const escapedRole = escapeHTML(person.role || 'N/A');
        const escapedStyle = escapeHTML(person.style || 'N/A');
        const avatar = escapeHTML(person.avatar || '❓');
        const achievementCount = person.achievements?.length || 0;
        const achievementPreview = achievementCount > 0 ? `<span class="person-achievements-preview" title="${achievementCount} Achievements">🏆${achievementCount}</span>` : '';

        // REMOVED: {/* Make li focusable for keyboard nav if needed... */}
        return `
            <li data-id="${person.id}" tabindex="-1">
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
          this.elements.styleExploreLink.style.display = 'inline';
      } else {
           this.elements.styleExploreLink.style.display = 'none';
      }
  }


  // --- CRUD Operations ---

  savePerson() {
      console.log(`[SAVE_PERSON] Attempting save. Editing ID: ${this.currentEditId}`);
      if (this.isSaving) return;
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
          id: this.currentEditId || generateSimpleId(),
          name: this.elements.name.value.trim(),
          avatar: this.elements.avatarInput.value || '❓',
          role: this.elements.role.value,
          style: this.elements.style.value,
          traits: {},
          achievements: [],
          goals: [],
          history: [],
          reflections: ""
      };

      this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
          personData.traits[slider.name] = parseInt(slider.value, 10);
      });

       Object.values(personData.traits).forEach(score => {
           if (score === 5) grantAchievement(personData, 'max_trait', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
           if (score === 1) grantAchievement(personData, 'min_trait', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       });

      setTimeout(() => {
        try {
            if (this.currentEditId) {
                const index = this.people.findIndex(p => p.id === this.currentEditId);
                if (index !== -1) {
                    personData.goals = this.people[index].goals || [];
                    personData.history = this.people[index].history || [];
                    personData.achievements = this.people[index].achievements || [];
                    personData.reflections = this.people[index].reflections || "";
                    this.people[index] = personData;
                    console.log(`[SAVE_PERSON] Updated persona ID: ${this.currentEditId}`);
                    grantAchievement(personData, 'profile_edited', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                } else { /* Error Handling */ }
            } else {
                this.people.push(personData);
                console.log(`[SAVE_PERSON] Added new persona ID: ${personData.id}`);
                grantAchievement(personData, 'profile_created', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                if (this.people.length >= 5) {
                    grantAchievement(personData, 'five_profiles', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
                }
            }
            this.lastSavedId = personData.id;
            this.saveToLocalStorage();
            this.renderList();
            this.resetForm();
            this.showNotification("Persona saved successfully!", "success");
        } catch (error) { /* Error Handling */ }
        finally {
             this.isSaving = false;
             this.showLoadingOnSaveButton(false);
        }
      }, 300);
  }


  editPerson(personId) {
      console.log(`[EDIT_PERSON] Loading persona ID: ${personId} into form.`);
      const person = this.people.find(p => p.id === personId);
      if (!person) return this.showNotification("Could not find persona to edit.", "error");

      this.elements.name.value = person.name;
      this.elements.avatarInput.value = person.avatar;
      this.elements.avatarDisplay.textContent = person.avatar;
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
      const avatarButton = this.elements.avatarPicker.querySelector(`.avatar-btn[data-emoji="${person.avatar}"]`);
      if (avatarButton) avatarButton.classList.add('selected');
      this.elements.role.value = person.role;
      this.renderStyles(person.role);

      setTimeout(() => {
         if (!this.elements.style) return console.error("[EDIT_PERSON] Style select element not found after delay.");
         this.elements.style.value = person.style;
         this.renderTraits(person.role, person.style);
         if (person.traits) {
             this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
                 if (person.traits.hasOwnProperty(slider.name)) {
                     slider.value = person.traits[slider.name];
                     const valueDisplay = slider.closest('.trait')?.querySelector('.trait-value');
                     if (valueDisplay) valueDisplay.textContent = slider.value;
                     this.updateTraitDescription(slider);
                 }
             });
         }
          this.updateLivePreview();
          this.updateStyleExploreLink();
      }, 50);

      this.currentEditId = personId;
      if(this.elements.formTitle) this.elements.formTitle.textContent = `✏️ Edit: ${escapeHTML(person.name)} ✨`;
      if(this.elements.saveButtonText) this.elements.saveButtonText.textContent = 'Update Persona!💾 ';
      else if (this.elements.save) this.elements.save.textContent = 'Update Persona!💾';

      this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
       setTimeout(() => this.elements.name?.focus(), 350);
      console.log(`[EDIT_PERSON] Form populated for ${person.name}.`);
  }


  deletePerson(personId) {
      console.log(`[DELETE_PERSON] Attempting to delete persona ID: ${personId}`);
      const personIndex = this.people.findIndex(p => p.id === personId);
      if (personIndex === -1) return this.showNotification("Could not find persona to delete.", "error");

      const personName = this.people[personIndex].name || `Persona ${personId.substring(0,4)}`;
      // Confirmation handled by caller
      console.log(`[DELETE_PERSON] Deleting ${personName}.`);
      this.people.splice(personIndex, 1);
      this.saveToLocalStorage();
      this.renderList();
      if (this.currentEditId === personId) this.resetForm();
       this.updateLivePreview();
       this.showNotification(`Persona "${escapeHTML(personName)}" deleted.`, "info");
  }


  resetForm(isManualClear = false) {
      console.log(`[RESET_FORM] Resetting form. Manual clear: ${isManualClear}`);
      if(this.elements.mainForm) this.elements.mainForm.reset();

      this.currentEditId = null;
      if(this.elements.avatarInput) this.elements.avatarInput.value = '❓';
      if(this.elements.avatarDisplay) this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker?.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
      this.elements.avatarPicker?.querySelector('.avatar-btn[data-emoji="❓"]')?.classList.add('selected');
      if(this.elements.role) this.elements.role.value = 'submissive';
      this.renderStyles('submissive');
      if(this.elements.style) this.elements.style.value = '';
      this.renderTraits('submissive', '');
      if(this.elements.formTitle) this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      if(this.elements.saveButtonText) this.elements.saveButtonText.textContent = 'Save Persona! 💖 ';
      else if (this.elements.save) this.elements.save.textContent = 'Save Persona! 💖';

      this.previewPerson = null;
      this.updateLivePreview();
       this.updateStyleExploreLink();

      if (isManualClear) {
          this.showNotification("Form cleared.", "info", 2000);
           this.elements.name?.focus();
      }
      console.log("[RESET_FORM] Form reset complete.");
  }

  showLoadingOnSaveButton(isLoading) {
      if (!this.elements.save || !this.elements.saveSpinner) return;
      this.elements.save.disabled = isLoading;
      this.elements.saveSpinner.style.display = isLoading ? 'inline-block' : 'none';

      const buttonTextElement = this.elements.saveButtonText;
      if (buttonTextElement) {
          buttonTextElement.textContent = isLoading
              ? 'Saving... '
              : (this.currentEditId ? 'Update Persona!💾 ' : 'Save Persona! 💖 ');
      } else { /* Fallback */ }
  }

  // --- Live Preview ---
  updateLivePreview() {
    if (!this.elements.livePreview) return;

    const name = this.elements.name?.value.trim() || "Unnamed Persona";
    const role = this.elements.role?.value || "";
    const style = this.elements.style?.value || "";
    const avatar = this.elements.avatarInput?.value || '❓';
    const traits = {};
    this.elements.traitsContainer?.querySelectorAll('.trait-slider').forEach(slider => {
        traits[slider.name] = parseInt(slider.value, 10);
    });
    this.previewPerson = { name, role, style, avatar, traits };

    let breakdownHTML = '<p class="muted-text">Select Role & Style for breakdown.</p>';
    let synergyHTML = '';

    if (role && style) {
        const breakdownData = getStyleBreakdown(style, traits, role);
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
        if (Object.keys(traits).length > 0) {
            const hints = findHintsForTraits(traits);
            if (hints.length > 0) {
                 synergyHTML = `
                     <div class="preview-synergy-hint">
                         <strong>Synergy Hint:</strong> ${escapeHTML(hints[0].text)}
                         ${hints.length > 1 ? ` <small>(${hints.length - 1} more...)</small>` : ''}
                     </div>
                 `;
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
             <!-- Daily challenge content injected -->
        </div>
    `;
    this.displayDailyChallenge();
}


  // --- Modal Display ---

  showPersonDetails(personId) {
    console.log(`[DETAILS] Showing details for persona ID: ${personId}`);
    const person = this.people.find(p => p.id === personId);
    if (!person) return this.showNotification("Could not find persona details.", "error");
    if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs || !this.elements.detailModalTitle) return this.showNotification("UI Error: Cannot display details.", "error");

    this.elements.modal.dataset.personId = personId;
    this.elements.detailModalTitle.innerHTML = `
        <span class="person-avatar" aria-hidden="true">${escapeHTML(person.avatar || '❓')}</span>
        ${escapeHTML(person.name)}
        <span class="modal-subtitle">${escapeHTML(person.role)} / ${escapeHTML(person.style)}</span>
    `;

    const tabs = [
        { id: 'tab-traits-breakdown', label: '🌟 Traits & Style' },
        { id: 'tab-goals-journal', label: '🎯 Goals & Journal' },
        { id: 'tab-history', label: '📊 History' },
        { id: 'tab-insights', label: '💡 Insights' }
    ];

    this.elements.modalTabs.innerHTML = tabs.map(tab => `
        <button type="button" class="tab-link ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
                role="tab" aria-selected="${tab.id === this.activeDetailModalTab}"
                aria-controls="${tab.id}" data-tab-id="${tab.id}" id="tab-label-${tab.id}">
            ${escapeHTML(tab.label)}
        </button>
    `).join('');

    this.elements.modalBody.innerHTML = tabs.map(tab => `
        <div class="tab-content ${tab.id === this.activeDetailModalTab ? 'active' : ''}"
             id="${tab.id}" role="tabpanel" aria-labelledby="tab-label-${tab.id}" tabindex="0">
             <p class="loading-text">Loading ${escapeHTML(tab.label)}...</p>
        </div>
    `).join('');

    const activeContentPane = document.getElementById(this.activeDetailModalTab);
    if (activeContentPane) {
        this.renderDetailTabContent(person, this.activeDetailModalTab, activeContentPane);
    }
     tabs.forEach(tab => {
         if (tab.id !== this.activeDetailModalTab) {
              const contentPane = document.getElementById(tab.id);
              if (contentPane) {
                   requestAnimationFrame(() => {
                      if (contentPane.querySelector('.loading-text')) {
                         this.renderDetailTabContent(person, tab.id, contentPane);
                      }
                   });
              }
         }
     });
    this.openModal(this.elements.modal);
    console.log(`[DETAILS] Modal opened for ${person.name}.`);
}

renderDetailTabContent(person, tabId, contentElement) {
    if (!person || !tabId || !contentElement) {
        if(contentElement) contentElement.innerHTML = '<p class="error-text">Error loading content.</p>';
        return;
    }
    console.log(`[RENDER_TAB] Rendering content for Tab ID: ${tabId}`);
    let contentHTML = '';
    try {
        switch (tabId) {
            case 'tab-traits-breakdown': contentHTML = this.renderTraitsBreakdownTab(person); break;
            case 'tab-goals-journal': contentHTML = this.renderGoalsJournalTab(person); break;
            case 'tab-history': contentHTML = this.renderHistoryTabStructure(person); break;
            case 'tab-insights': contentHTML = this.renderInsightsTab(person); break;
            default: contentHTML = `<p class="error-text">Unknown tab content: ${escapeHTML(tabId)}</p>`;
        }
        contentElement.innerHTML = contentHTML;
        if (tabId === 'tab-history') this.renderHistoryChart(person, `history-chart-${person.id}`);
        if (tabId === 'tab-insights') this.displayDailyChallenge(person);
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
            ${this.renderGoalList(person)}
        </section>
        <section class="reflections-section" aria-labelledby="journal-heading">
            <h3 id="journal-heading">📝 Journal & Reflections</h3>
            ${this.renderJournalTab(person)}
        </section>
    `;
  }

  renderHistoryTabStructure(person) {
      // REMOVED: Inline onclick handler
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
                                     aria-expanded="false" aria-controls="snapshot-details-${person.id}-${index}">
                                 View Traits
                             </button>
                             <div id="snapshot-details-${person.id}-${index}" class="snapshot-details" style="display: none;">
                                 <ul>
                                     ${Object.entries(snapshot.traits || {}).map(([key, value]) =>
                                         `<li><strong>${escapeHTML(key)}:</strong> ${escapeHTML(String(value))} ${getFlairForScore(value)}</li>`
                                     ).join('')}
                                 </ul>
                             </div>
                         </li>
                     `).reverse().join('')
                     : '<li><p class="muted-text">No snapshots saved yet. Click "Take Snapshot" to start tracking!</p></li>'
                 }
             </ul>
        </section>
    `;
  }


  renderInsightsTab(person) {
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
                 <p class="muted-text">Loading today's focus...</p>
             </div>
        </section>
        <section class="achievements-section" aria-labelledby="achievements-insights-heading">
            <h3 id="achievements-insights-heading">🏆 Recent Achievements</h3>
            ${this.renderAchievementsList(person, true)}
        </section>
    `;
   }


  // --- Individual Component Rendering Functions for Detail Modal ---

  renderTraitDetails(person) {
    if (!person?.traits || Object.keys(person.traits).length === 0) {
      return '<p class="muted-text">No traits defined for this persona yet.</p>';
    }
     const sortedTraitEntries = Object.entries(person.traits).sort((a, b) => a[0].localeCompare(b[0]));
    let html = '<div class="trait-details-grid">';
    sortedTraitEntries.forEach(([name, score]) => {
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
        if (!traitData?.explanation && glossaryTerms[name]?.definition) {
             explanation = glossaryTerms[name].definition;
        }
        const escapedName = escapeHTML(name);
        const escapedTerm = escapeHTML(glossaryTerms[name]?.term || name);
        const escapedExplanation = escapeHTML(explanation);
        const value = parseInt(score, 10);
        const flair = getFlairForScore(value);
        const traitDesc = escapeHTML(traitData?.desc?.[value] || '');
        html += `
        <div class="trait-detail-item">
            <h4>
                 <a href="#" class="glossary-link" data-term-key="${escapedName}" title="View '${escapedTerm}' in Glossary">${escapedName.charAt(0).toUpperCase() + escapedName.slice(1)}</a>
                <span class="trait-score-badge">${value} ${flair}</span>
            </h4>
            <p>${escapedExplanation}</p>
            ${traitDesc ? `<p><em>(${traitDesc})</em></p>` : ''}
        </div>
        `;
    });
    html += '</div>';
    return html;
}


  renderStyleBreakdownDetail(person) {
      let breakdown;
      if (person.role && person.style) {
            breakdown = getStyleBreakdown(person.style, person.traits, person.role);
      } else {
           return '<p class="muted-text">Select a Role and Style to see the breakdown.</p>';
      }
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
    const isGlobalView = person === null;
    const achievementKeys = Object.keys(achievementList);
    const maxToShow = limit ? 6 : Infinity;

    let achievementsHTML = `<ul class="${isGlobalView ? 'all-achievements-list' : 'persona-achievements-list'}">`;
    let count = 0;

    if (isGlobalView) {
        const sortedKeys = achievementKeys.sort((a, b) => (achievementList[a]?.name || '').localeCompare(achievementList[b]?.name || ''));
        sortedKeys.forEach(id => {
            const details = achievementList[id];
            if (!details) return;
            let globallyUnlocked = false;
            try { globallyUnlocked = localStorage.getItem(`kinkCompass_global_achievement_${id}`) === 'true'; }
            catch (e) { console.error("Error reading global achievement status:", e); }
            const unlockedByAnyPersona = this.people.some(p => p.achievements?.includes(id));
            const isUnlocked = globallyUnlocked || unlockedByAnyPersona;
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
         if (!person || !Array.isArray(person.achievements) || person.achievements.length === 0) {
            return '<p class="muted-text">No achievements unlocked yet for this persona.</p>';
         }
         const sortedAchievements = [...person.achievements].sort((aId, bId) => (achievementList[aId]?.name || '').localeCompare(achievementList[bId]?.name || ''));
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
              achievementsHTML += '<li class="muted-text no-border">No achievements yet!</li>';
         } else if (limit && person.achievements.length > maxToShow) {
              // REMOVED: Inline onclick - Button should be handled via delegation if needed
              achievementsHTML += `<li class="no-border view-all-link"><button type="button" class="link-button view-all-achievements-btn">View All (${person.achievements.length})...</button></li>`;
         }
    }
    achievementsHTML += '</ul>';
    return achievementsHTML;
}


  renderGoalList(person, returnListOnly = false) {
      const goals = person.goals || [];
      const listHTML = goals.length > 0 ? `
        <ul class="goal-list">
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

       if (returnListOnly) return listHTML;

      const formHTML = `
        <form id="add-goal-form" class="add-goal-form" action="#">
            <label for="new-goal-text-${person.id}" class="sr-only">New Goal:</label>
            <input type="text" id="new-goal-text-${person.id}" placeholder="Enter a new goal..." required>
            <button type="submit" class="small-btn save-btn">Add Goal</button>
        </form>
      `;
      return listHTML + formHTML;
  }


  // --- Feature Logic --- (Goal, Journal, History, etc. - assumed correct, no changes unless specified)
  addGoal(personId, formElement) {
      const input = formElement.querySelector('input[type="text"]');
      const goalText = input?.value.trim();
      if (!input || !goalText) return this.showNotification("Please enter text for the goal.", "warning");
      const person = this.people.find(p => p.id === personId);
      if (!person) return this.showNotification("Error: Persona not found.", "error");
      if (!Array.isArray(person.goals)) person.goals = [];
      const newGoal = { id: generateSimpleId(), text: goalText, done: false, addedAt: new Date().toISOString(), completedAt: null };
      person.goals.push(newGoal);
      grantAchievement(person, 'goal_added', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
      const listContainer = formElement.closest('.goals-section')?.querySelector('.goal-list');
      if (listContainer) listContainer.outerHTML = this.renderGoalList(person, true);
      else { const tabContent = formElement.closest('.tab-content'); if(tabContent) this.renderDetailTabContent(person, 'tab-goals-journal', tabContent); }
      input.value = '';
      this.showNotification("Goal added!", "success", 2000);
      input.focus();
  }

  toggleGoalStatus(personId, goalId, listItemElement = null) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return;
      const goal = person.goals.find(g => g.id === goalId);
      if (!goal) return this.showNotification("Error: Goal not found.", "error");
      goal.done = !goal.done;
      goal.completedAt = goal.done ? new Date().toISOString() : null;
      if (listItemElement) {
          listItemElement.classList.toggle('done', goal.done);
          const toggleButton = listItemElement.querySelector('.goal-toggle-btn');
          if (toggleButton) { toggleButton.innerHTML = goal.done ? '↩️ Undo' : '✔️ Done'; toggleButton.setAttribute('aria-label', goal.done ? 'Mark as not done' : 'Mark as done'); }
          if (goal.done) {
              listItemElement.classList.add('goal-completed-animation');
              setTimeout(() => listItemElement?.classList.remove('goal-completed-animation'), 600);
              grantAchievement(person, 'goal_completed', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
              this.checkGoalStreak(person);
              const completedCount = person.goals.filter(g => g.done).length;
              if (completedCount >= 5) grantAchievement(person, 'five_goals_completed', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
          }
      } else { const listContainer = document.querySelector(`#detail-modal[data-person-id="${personId}"] .goals-section .goal-list`); if (listContainer) listContainer.outerHTML = this.renderGoalList(person, true); }
      this.saveToLocalStorage();
  }

  deleteGoal(personId, goalId) {
      const person = this.people.find(p => p.id === personId);
      if (!person?.goals) return;
      const goalIndex = person.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) return this.showNotification("Error: Goal not found.", "error");
      person.goals.splice(goalIndex, 1);
      this.saveToLocalStorage();
      const listContainer = document.querySelector(`#detail-modal[data-person-id="${personId}"] .goals-section .goal-list`);
      if (listContainer) { listContainer.outerHTML = this.renderGoalList(person, true); this.showNotification("Goal deleted.", "info", 2000); }
  }

  showJournalPrompt(personId) {
       const promptArea = document.getElementById('journal-prompt-area');
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!promptArea || !textarea) return;
       const prompt = getRandomPrompt();
       promptArea.innerHTML = `💡 Prompt: ${escapeHTML(prompt)}`;
       promptArea.style.display = 'block';
       if (textarea.value.trim() === '') textarea.value = `Prompt: ${escapeHTML(prompt)}\n\n`;
       textarea.focus();
       grantAchievement({}, 'prompt_used', this.showNotification.bind(this));
   }

  saveReflections(personId) {
       const textarea = document.getElementById(`reflections-textarea-${personId}`);
       if (!textarea) return this.showNotification("Error: Could not find journal text area.", "error");
       const person = this.people.find(p => p.id === personId);
       if (!person) return this.showNotification("Error: Persona not found.", "error");
       person.reflections = textarea.value;
       textarea.classList.add('input-just-saved');
       setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);
       grantAchievement(person, 'reflection_saved', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       const reflectionCount = (person.history?.filter(snap => snap.reflections).length || 0) + (person.reflections ? 1 : 0);
       if (reflectionCount >= 5) grantAchievement(person, 'five_reflections', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       if (reflectionCount >= 10) grantAchievement(person, 'journal_journeyman', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
       this.saveToLocalStorage();
       this.showNotification("Reflections saved!", "success", 2000);
   }

   addSnapshotToHistory(personId) {
        const person = this.people.find(p => p.id === personId);
        if (!person) return this.showNotification("Error: Persona not found.", "error");
        const currentTimestamp = new Date().toISOString();
        const newSnapshot = { timestamp: currentTimestamp, role: person.role, style: person.style, traits: { ...person.traits } };
        if (!Array.isArray(person.history)) person.history = [];
        grantAchievement(person, 'history_snapshot', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        this.checkConsistentSnapper(person, currentTimestamp);
        this.checkTraitTransformation(person, newSnapshot);
        if(person.history.length >= 9) grantAchievement(person, 'ten_snapshots', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        person.history.push(newSnapshot);
        this.saveToLocalStorage();
        const historyTabContent = document.getElementById('tab-history');
        if (historyTabContent?.classList.contains('active')) this.renderDetailTabContent(person, 'tab-history', historyTabContent);
        else if (historyTabContent) requestAnimationFrame(() => this.renderDetailTabContent(person, 'tab-history', historyTabContent));
        this.showNotification("Persona snapshot saved to history!", "success");
    }

    renderHistoryChart(person, canvasId) {
        // Logic assumed correct, omitted for brevity
        const canvas = document.getElementById(canvasId);
        const container = canvas?.parentElement;
        if (!canvas || !container) return;
        if (!person.history || person.history.length < 2) {
            container.innerHTML = '<p class="muted-text">Need at least two snapshots to show trait history.</p>';
            container.classList.add('chart-loading');
            return;
        }
        container.classList.remove('chart-loading');
        if (this.chartInstance && this.chartInstance.canvas === canvas) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
        const history = person.history;
        const labels = history.map(snap => new Date(snap.timestamp).toLocaleDateString());
        const allTraits = new Set(history.flatMap(snap => Object.keys(snap.traits || {})));
        const datasets = [];
        const colors = ['#ff69b4', '#a0d8ef', '#f7dc6f', '#81c784', '#ffb74d', '#dcc1ff', '#ef5350', '#64b5f6'];
        let colorIndex = 0;
        allTraits.forEach(traitName => { /* ... dataset creation ... */ });
        if (datasets.length === 0) return container.innerHTML = '<p class="muted-text">No valid trait data found.</p>';
        const config = { type: 'line', data: { labels, datasets }, options: { /* ... options ... */ } };
        try { this.chartInstance = new Chart(canvas, config); } catch (error) { /* ... error handling ... */ }
    }

  toggleSnapshotInfo(button) {
    console.log("[TOGGLE_SNAPSHOT_INFO] Toggle button clicked.");
    const detailsDiv = document.getElementById(button.getAttribute('aria-controls'));
    if (detailsDiv) {
        const isVisible = detailsDiv.style.display !== 'none';
        detailsDiv.style.display = isVisible ? 'none' : 'block';
        button.textContent = isVisible ? 'View Traits' : 'Hide Traits';
        button.setAttribute('aria-expanded', !isVisible);
    } else {
        console.warn("[TOGGLE_SNAPSHOT_INFO] Could not find details div:", button.getAttribute('aria-controls'));
    }
}

  // --- Auxiliary Feature Modals ---

  showAchievements() {
    console.log("[SHOW_ACHIEVEMENTS] Opening achievements modal.");
    const modal = this.elements.achievementsModal;
    const body = this.elements.achievementsBody;
    if (!modal || !body) return this.showNotification("UI Error: Cannot display achievements.", "error");

    body.innerHTML = `
        <p style="text-align: center; margin-bottom: 1.5em;">Track your milestones and discoveries!</p>
        ${this.renderAchievementsList(null)} {/* Render global list */}
    `;
    this.openModal(modal);
}

  showKinkOracle(personId) {
    console.log(`[SHOW_KINK_ORACLE] Consulting Oracle for Person ID: ${personId}`);
    const outputElement = this.elements.modalBody?.querySelector('#oracle-reading-output'); // Query within active modal body
    const button = this.elements.modalBody?.querySelector('#oracle-btn');

    if (!outputElement) return this.showNotification("UI Error: Cannot display Oracle reading.", "error");

    const person = this.people.find(p => p.id === personId);
    if (!person) {
        outputElement.innerHTML = `<p class="error-text">Persona data not found.</p>`;
        return;
    }

    outputElement.innerHTML = `<p><i>Consulting the ethereal energies... <span class="spinner"></span></i></p>`;
    if (button) button.disabled = true;

    setTimeout(() => {
        try {
            const readingData = this.getKinkOracleReading(person);
            if (!readingData) throw new Error("Oracle returned no reading.");
            // FIX: Use corrected escapeHTML
            outputElement.innerHTML = `
                <p>${escapeHTML(readingData.opening)}</p>
                <p><strong>Focus:</strong> ${escapeHTML(readingData.focus)}</p>
                <p><em>${escapeHTML(readingData.encouragement)}</em></p>
                <p>${escapeHTML(readingData.closing)}</p>
            `;
            grantAchievement(person, 'kink_reading_oracle', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        } catch (error) {
            console.error("[SHOW_KINK_ORACLE] Error getting or displaying Oracle reading:", error);
            outputElement.innerHTML = `<p class="muted-text">The Oracle is quiet today. Try again later?</p>`;
        } finally {
             if (button) button.disabled = false;
        }
    }, 600);
}

  displayDailyChallenge(personaForContext = null) {
    // Find the correct area (either preview or insights tab)
    let challengeArea = null;
    if (this.elements.livePreview?.style.display !== 'none') { // Check if preview is potentially visible
         challengeArea = this.elements.livePreview.querySelector('#daily-challenge-area');
    }
    if (!challengeArea && this.elements.modal?.getAttribute('aria-hidden') === 'false' && this.activeDetailModalTab === 'tab-insights') {
         challengeArea = this.elements.modalBody?.querySelector('#daily-challenge-area');
    }
    if (!challengeArea) return; // Silently fail if area isn't present/visible

    try {
        const challenge = this.getDailyChallenge(personaForContext);
        if (challenge) {
            // FIX: Use corrected escapeHTML
            challengeArea.innerHTML = `
                <h4 id="daily-challenge-title" style="margin-bottom:0.5em;">🌟 Today's Focus 🌟</h4>
                <h5>${escapeHTML(challenge.title)}</h5>
                <p>${escapeHTML(challenge.desc)}</p>
                <p class="muted-text"><small>(Category: ${escapeHTML(challenge.category)})</small></p>`;
            challengeArea.style.display = 'block';
            grantAchievement({}, 'challenge_accepted', this.showNotification.bind(this));
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
    if (!modal || !body) return this.showNotification("UI Error: Cannot display glossary.", "error");

    if (searchInput) searchInput.value = '';
    body.innerHTML = '';

    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) =>
        (glossaryTerms[a]?.term || '').localeCompare(glossaryTerms[b]?.term || '')
    );

    if (sortedKeys.length === 0) {
        body.innerHTML = '<p>Glossary is currently empty.</p>';
    } else {
        const dl = document.createElement('dl');
        dl.id = 'glossary-term-list';
        sortedKeys.forEach(key => {
            const termData = glossaryTerms[key];
            if (!termData?.term || !termData.definition) return;

            const dt = document.createElement('dt');
            dt.id = `glossary-${key}`;
            // FIX: Use corrected escapeHTML
            dt.textContent = escapeHTML(termData.term);

            const dd = document.createElement('dd');
            // FIX: Use corrected escapeHTML on definition before linking
            dd.innerHTML = this.linkGlossaryTerms(escapeHTML(termData.definition));

            if (termData.related && Array.isArray(termData.related) && termData.related.length > 0) {
                const relatedP = document.createElement('p');
                relatedP.className = 'related-terms';
                relatedP.innerHTML = 'Related: ';
                termData.related.forEach((relatedKey, index) => {
                    if (glossaryTerms[relatedKey]) {
                        const link = document.createElement('a');
                        link.href = `#glossary-${relatedKey}`;
                         // FIX: Use corrected escapeHTML
                        link.textContent = escapeHTML(glossaryTerms[relatedKey].term);
                        link.classList.add('glossary-link');
                        link.dataset.termKey = relatedKey;
                        relatedP.appendChild(link);
                        if (index < termData.related.length - 1) {
                            relatedP.appendChild(document.createTextNode(', '));
                        }
                    }
                });
                dd.appendChild(relatedP);
            }
             const itemWrapper = document.createElement('div');
             itemWrapper.classList.add('glossary-item');
             itemWrapper.dataset.term = termData.term.toLowerCase();
             itemWrapper.dataset.definition = termData.definition.toLowerCase();
             itemWrapper.appendChild(dt);
             itemWrapper.appendChild(dd);
             dl.appendChild(itemWrapper);
        });
        body.appendChild(dl);
    }

    this.openModal(modal);
    if (termKeyToHighlight) {
         this.highlightGlossaryTerm(termKeyToHighlight);
    }
}

highlightGlossaryTerm(termKeyToHighlight) {
     console.log(`[HIGHLIGHT_TERM] Attempting to highlight and scroll to: ${termKeyToHighlight}`);
     requestAnimationFrame(() => {
         // FIX: Use querySelector for potentially non-unique IDs if escaping isn't perfect
         const element = document.getElementById(`glossary-${termKeyToHighlight}`);
         if (element) {
             this.elements.glossaryBody?.querySelector('.highlighted-term')?.classList.remove('highlighted-term');
             element.classList.add('highlighted-term');
             element.scrollIntoView({ behavior: 'smooth', block: 'center' });
             setTimeout(() => element?.classList.remove('highlighted-term'), 2500);
         } else {
             console.warn(`[HIGHLIGHT_TERM] Element ID not found for highlighting: glossary-${termKeyToHighlight}`);
         }
     });
}

linkGlossaryTerms(text) {
    // FIX: Ensure the text passed in is already HTML-escaped to prevent XSS via glossary terms
    // (The caller showGlossary now handles this)
    const sortedKeys = Object.keys(glossaryTerms).sort((a, b) => (glossaryTerms[b]?.term?.length || 0) - (glossaryTerms[a]?.term?.length || 0)); // Sort by length descending
    let linkedText = text;

    sortedKeys.forEach(key => {
        const termData = glossaryTerms[key];
        if (termData?.term) {
             // FIX: Use corrected escapeHTML for the term itself within the regex
             const escapedTerm = escapeHTML(termData.term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
             // Ensure we don't link inside existing links or tags
             const regex = new RegExp(`\\b(${escapedTerm})\\b(?![^<]*?>|[^<>]*<\\/a>)`, 'gi');
             linkedText = linkedText.replace(regex, (match) =>
                 // FIX: Use corrected escapeHTML for the matched text being displayed
                 `<a href="#glossary-${key}" class="glossary-link" data-term-key="${key}">${escapeHTML(match)}</a>`
             );
        }
    });
    return linkedText;
}


filterGlossary(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const list = document.getElementById('glossary-term-list');
    if (!list) return;

    const items = list.querySelectorAll('.glossary-item');
    let itemsFound = 0;
    let noResultsMsg = list.querySelector('.no-results-message'); // Find existing message first

    items.forEach(item => {
        const term = item.dataset.term || '';
        const definition = item.dataset.definition || '';
        const isMatch = term.includes(lowerSearchTerm) || definition.includes(lowerSearchTerm);
        item.style.display = isMatch ? '' : 'none';
        if (isMatch) itemsFound++;
    });

     if (itemsFound === 0 && lowerSearchTerm !== '') {
         if (!noResultsMsg) { // Create message if it doesn't exist
             noResultsMsg = document.createElement('p');
             noResultsMsg.className = 'muted-text no-results-message';
             noResultsMsg.textContent = 'No terms found matching your search.';
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
         this.filterGlossary('');
         this.elements.glossarySearchInput.focus();
     }
 }

  showStyleDiscovery(styleNameToHighlight = null) {
    console.log(`[STYLE_DISCOVERY] Opening style discovery. Highlight: ${styleNameToHighlight || 'None'}`);
    const modal = this.elements.styleDiscoveryModal;
    const body = this.elements.styleDiscoveryBody;
    const roleFilter = this.elements.styleDiscoveryRoleFilter;
    const searchInput = this.elements.styleDiscoverySearchInput;
    if (!modal || !body || !roleFilter) return this.showNotification("UI Error: Cannot display style discovery.", "error");

    roleFilter.value = 'all';
    if(searchInput) searchInput.value = '';
    this.renderStyleDiscoveryContent(styleNameToHighlight);
    this.openModal(modal);
}

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
    const highlightName = typeof styleNameToHighlight === 'string' ? styleNameToHighlight : null;
    const body = this.elements.styleDiscoveryBody;
    const selectedRole = this.elements.styleDiscoveryRoleFilter?.value || 'all';
    const searchTerm = this.elements.styleDiscoverySearchInput?.value.toLowerCase().trim() || '';
    if (!body) return;

    body.innerHTML = '<p class="loading-text" role="status">Loading styles...</p>';

    let stylesToDisplay = [];
    const rolesToInclude = selectedRole === 'all' ? Object.keys(bdsmData) : [selectedRole];

    rolesToInclude.forEach(roleKey => {
        if (bdsmData[roleKey]?.styles) {
            stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({ ...style, role: roleKey })));
        }
    });

    if (searchTerm) {
        stylesToDisplay = stylesToDisplay.filter(style =>
            style.name.toLowerCase().includes(searchTerm) ||
            (style.summary || '').toLowerCase().includes(searchTerm)
        );
    }
    stylesToDisplay.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    if (stylesToDisplay.length === 0) {
        body.innerHTML = '<p class="muted-text">No styles found matching the current filters.</p>';
        return;
    }
    // FIX: Use corrected escapeHTML
    let contentHTML = stylesToDisplay.map(style => {
        const styleIdSafe = `style-discovery-${escapeHTML(style.role)}-${escapeHTML(style.name.replace(/[^a-zA-Z0-9]/g, '-'))}`;
        const summary = style.summary || "No summary available.";
        // Use sfStyleIcons, fallback gracefully
        const icon = sfStyleIcons[style.name] || ''; // Get icon safely
        return `
            <div class="style-discovery-item" id="${styleIdSafe}">
                <h4>${icon ? escapeHTML(icon) + ' ' : ''}${escapeHTML(style.name)} <small>(${escapeHTML(style.role)})</small></h4>
                <p>${escapeHTML(summary)}</p>
                 ${this.renderStyleTraitList(style)}
            </div>`;
    }).join('');

    body.innerHTML = contentHTML;

    if (highlightName) {
        requestAnimationFrame(() => {
            let elementToHighlight = null;
            const items = body.querySelectorAll('.style-discovery-item');
            items.forEach(item => {
                const h4 = item.querySelector('h4');
                if (h4) {
                    // Match against the text content excluding icon/role for robustness
                    const namePart = h4.textContent.replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]+)/gu, '').split('<small>')[0].trim();
                    if (namePart.toLowerCase() === highlightName.toLowerCase()) {
                         elementToHighlight = item;
                    }
                }
            });

            if (elementToHighlight) {
                elementToHighlight.classList.add('highlighted-style');
                elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => elementToHighlight?.classList.remove('highlighted-style'), 2500);
            } else {
                console.warn(`[RENDER_STYLE_DISCOVERY] Style element to highlight not found: ${highlightName}`);
            }
        });
    }
}

renderStyleTraitList(style) {
    if (!style?.role || !bdsmData[style.role]) return '';
    const coreTraitNames = bdsmData[style.role].coreTraits?.map(t => t.name) || [];
    const styleTraitNames = style.traits?.map(t => t.name) || [];
    const allTraitNames = [...new Set([...coreTraitNames, ...styleTraitNames])].sort();
    if (allTraitNames.length === 0) return '';
    // FIX: Use corrected escapeHTML
    return `<p class="traits-list"><small>Key Traits: ${allTraitNames.map(t => {
        const escapedTrait = escapeHTML(t);
        const escapedTerm = escapeHTML(glossaryTerms[t]?.term || t);
        return `<a href="#" class="glossary-link" data-term-key="${escapedTrait}" title="View '${escapedTerm}' in Glossary">${escapedTrait}</a>`;
    }).join(', ')}</small></p>`;
}

filterStyleDiscovery(searchTerm) {
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
        const exportObject = {
            version: "KinkCompass_v2.8.8", // Updated version
            exportedAt: new Date().toISOString(),
            people: this.people
        };
        const dataStr = JSON.stringify(exportObject, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        link.download = `kinkcompass_backup_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.showNotification("Persona data exported successfully!", "success");
        grantAchievement({}, 'data_exported', this.showNotification.bind(this));
    } catch (error) {
        console.error("[EXPORT_DATA] Error during data export:", error);
        this.showNotification("Data export failed. See console.", "error");
    }
}

  importData(event) {
    console.log("[IMPORT_DATA] Import process started.");
    const fileInput = event.target;
    if (!fileInput?.files?.length) return;
    const file = fileInput.files[0];
    if (!file.type.match('application/json')) {
        this.showNotification("Import failed: File must be a valid '.json' file.", "error", 5000);
        fileInput.value = null;
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
         this.showNotification("Import failed: File size too large (max 10MB).", "error", 5000);
         fileInput.value = null;
         return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData || typeof importedData !== 'object' || !Array.isArray(importedData.people)) {
                throw new Error("Invalid file format: Missing or invalid 'people' array.");
            }
            const numPersonas = importedData.people.length;
            // IMPROVEMENT: Replace confirm with custom modal
            if (!confirm(`Import ${numPersonas} personas? This will REPLACE all current persona data.`)) {
                console.log("[IMPORT_DATA] User cancelled import.");
                fileInput.value = null;
                return;
            }
            this.people = importedData.people;
            // Sanitize imported data
             this.people.forEach((p, index) => {
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
             });
            this.saveToLocalStorage();
            this.renderList();
            this.resetForm();
            this.showNotification(`Successfully imported ${numPersonas} personas!`, "success");
            grantAchievement({}, 'data_imported', this.showNotification.bind(this));
        } catch (error) {
            console.error("[IMPORT_DATA] Error processing imported file:", error);
            this.showNotification(`Import failed: ${error.message}.`, "error", 6000);
        } finally {
            fileInput.value = null;
        }
    };
    reader.onerror = (readError) => {
        console.error("[IMPORT_DATA] Error reading file:", readError);
        this.showNotification("Error reading the selected file.", "error");
        fileInput.value = null;
    };
    reader.readAsText(file);
}


  // --- Popups ---

  showTraitInfo(traitName, triggerButton = null) {
    console.log(`[SHOW_TRAIT_INFO] Showing info for trait: ${traitName}`);
    const popup = this.elements.traitInfoPopup;
    const title = this.elements.traitInfoTitle;
    const body = this.elements.traitInfoBody;
    const closeButton = this.elements.traitInfoClose;
    if (!popup || !title || !body || !closeButton) return;

    let explanation = `Details for '${escapeHTML(traitName)}' not found.`;
    let found = false;
    for (const roleKey in bdsmData) {
        const roleData = bdsmData[roleKey];
        const coreTrait = roleData.coreTraits?.find(t => t.name === traitName);
        if (coreTrait?.explanation) { explanation = coreTrait.explanation; found = true; break; }
        const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
        if (styleTrait?.explanation) { explanation = styleTrait.explanation; found = true; break; }
    }
    if (!found && glossaryTerms[traitName]?.definition) {
        explanation = glossaryTerms[traitName].definition;
        found = true;
    }
    // FIX: Use corrected escapeHTML
    title.textContent = `About: ${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}`;
    body.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(explanation))}</p>`;

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');
    this.elementThatOpenedModal = triggerButton || document.activeElement;
    document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
         if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if(triggerButton) triggerButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
    grantAchievement({}, 'trait_info_viewed', this.showNotification.bind(this));
}

  hideTraitInfo() {
    console.log("[HIDE_TRAIT_INFO] Hiding trait info popup.");
    const popup = this.elements.traitInfoPopup;
    if (!popup || popup.getAttribute('aria-hidden') === 'true') return;

    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    const triggerButton = this.elementThatOpenedModal?.closest('.trait-info-btn') || document.querySelector('.trait-info-btn[aria-expanded="true"]');
    if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', 'false');
        if (document.body.contains(triggerButton)) {
            try { triggerButton.focus(); } catch (e) { document.body.focus(); }
        } else { document.body.focus(); }
    } else if (this.elementThatOpenedModal && document.body.contains(this.elementThatOpenedModal)) {
         try { this.elementThatOpenedModal.focus(); } catch (e) { document.body.focus(); }
    } else { document.body.focus(); }
    this.elementThatOpenedModal = null;
}

  showContextHelp(helpKey, triggerButton = null) {
    console.log(`[SHOW_CONTEXT_HELP] Showing help for key: ${helpKey}`);
    const popup = this.elements.contextHelpPopup;
    const titleEl = this.elements.contextHelpTitle;
    const bodyEl = this.elements.contextHelpBody;
    const closeButton = this.elements.contextHelpClose;
    if (!popup || !titleEl || !bodyEl || !closeButton) return;

    const helpText = contextHelpTexts[helpKey] || `No help available for '${escapeHTML(helpKey)}'.`;
    const displayTitle = glossaryTerms[helpKey]?.term || (helpKey.charAt(0).toUpperCase() + helpKey.slice(1).replace(/([A-Z])/g, ' $1'));
    // FIX: Use corrected escapeHTML
    titleEl.textContent = `Help: ${escapeHTML(displayTitle)}`;
    bodyEl.innerHTML = `<p>${this.linkGlossaryTerms(escapeHTML(helpText))}</p>`;

    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');
    this.elementThatOpenedModal = triggerButton || document.activeElement;
    document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => {
        if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false');
    });
    if (triggerButton) triggerButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
}

  hideContextHelp() {
    console.log("[HIDE_CONTEXT_HELP] Hiding context help popup.");
    const popup = this.elements.contextHelpPopup;
     if (!popup || popup.getAttribute('aria-hidden') === 'true') return;
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    const elementToFocus = this.elementThatOpenedModal || document.querySelector('.context-help-btn[aria-expanded="true"]');
    if (elementToFocus && document.body.contains(elementToFocus)) {
         if (elementToFocus.classList.contains('context-help-btn')) {
             elementToFocus.setAttribute('aria-expanded', 'false');
         }
         try { elementToFocus.focus(); } catch (e) { document.body.focus(); }
    } else { document.body.focus(); }
    this.elementThatOpenedModal = null;
}


  // --- Style Finder Methods ---



    // Inside class TrackerApp

    sfStart() {
        console.log("[SF_START] Initiating Style Finder (Redesigned)."); // Check if this logs
        this.styleFinderActive = true;
        this.styleFinderStep = 0;
        this.styleFinderRole = null;
        this.styleFinderAnswers = { traits: {} };
        this.styleFinderScores = {};
        this.previousScores = null;
        this.hasRenderedDashboard = false;
        this.sfSliderInteracted = false;
        this.styleFinderTraits = []; // Reset traits list
        this.traitOrder = [];

        // --- Reset UI ---
        try { // Wrap UI resets in try...catch
            if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.textContent = 'Starting...';
            if(this.elements.sfProgressBar) this.elements.sfProgressBar.style.width = '0%';
            if(this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '<p class="loading-text">Loading quest...</p>';
            if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';
            if(this.elements.sfDashboard) {
                this.elements.sfDashboard.innerHTML = '';
                this.elements.sfDashboard.style.display = 'none'; // Ensure hidden
            }
        } catch (uiError) {
            console.error("[SF_START] Error resetting UI elements:", uiError);
            // Potentially show user notification, but proceed if possible
        }

        // --- Render First Step ---
        try {
            this.sfRenderStep(); // Render the first step (role selection)
        } catch (renderError) {
             console.error("[SF_START] Error during initial sfRenderStep:", renderError);
             this.showNotification("Error preparing Style Finder. Please try again.", "error");
             this.styleFinderActive = false; // Deactivate if render fails
             return; // Stop if initial render fails
        }

        // --- Open Modal ---
        // Check if the modal element exists before trying to open
        if (!this.elements.sfModal) {
            console.error("[SF_START] Cannot open modal: this.elements.sfModal is not valid!");
            this.showNotification("UI Error: Style Finder window not found.", "error");
            this.styleFinderActive = false; // Deactivate
            return;
        }
        try {
            this.openModal(this.elements.sfModal); // <<< THE KEY LINE
            console.log("[SF_START] Style Finder modal open command issued.");
        } catch (openModalError) {
             console.error("[SF_START] Error calling openModal:", openModalError);
             this.showNotification("Error opening Style Finder window.", "error");
             this.styleFinderActive = false; // Deactivate
        }
    }
sfCloseAllPopups() {
         let popupsClosed = false;
         document.querySelectorAll('.sf-style-info-popup').forEach(popup => {
             popup.remove();
             popupsClosed = true;
         });
         document.querySelectorAll('.sf-info-icon.active').forEach(icon => {
              icon.classList.remove('active');
         });
         if(popupsClosed) console.log("[SF_CLOSE_POPUPS] Closed open SF popups.");
         return popupsClosed;
    }

 sfComputeScores(temporary = false) {
    let stylePoints = {};
    if (!this.styleFinderRole || !sfStyles[this.styleFinderRole]) {
        console.warn("[SF_COMPUTE_SCORES] Cannot compute scores: Role not set or invalid.");
        return {}; // Return empty object if role/styles invalid
    }

    const relevantStyles = sfStyles[this.styleFinderRole];
    const answeredTraits = Object.keys(this.styleFinderAnswers.traits);

    // 1. Initialize points
    relevantStyles.forEach(styleName => { // Start forEach #1
        stylePoints[styleName] = 0;
    }); // End forEach #1

    // 2. Calculate Raw Points
    relevantStyles.forEach(styleName => { // Start forEach #2
        let pointsForThisStyle = 0;
        let traitsConsideredCount = 0;

        const styleKeyTraitKey = Object.keys(sfStyleKeyTraits).find(key =>
            normalizeStyleKey(key) === normalizeStyleKey(styleName)
        );
        const keyTraitsForStyle = styleKeyTraitKey ? sfStyleKeyTraits[styleKeyTraitKey] : {};

        answeredTraits.forEach(traitName => { // Start forEach #3 (nested)
            if (keyTraitsForStyle.hasOwnProperty(traitName)) {
                traitsConsideredCount++;
                const userScore = this.styleFinderAnswers.traits[traitName];
                const weight = keyTraitsForStyle[traitName] || 1;
                let scoreContribution = 0;

                if (userScore >= 9) { scoreContribution = 3; }
                else if (userScore >= 7) { scoreContribution = 1; }
                else if (userScore >= 4) { scoreContribution = 0.25; }
                else if (userScore >= 2) { scoreContribution = -1; }
                else { scoreContribution = -2; }

                pointsForThisStyle += scoreContribution * weight;
            } // End if hasOwnProperty
        }); // End forEach #3 (nested)

        stylePoints[styleName] = Math.max(0, pointsForThisStyle); // Clamp raw score at 0

    }); // End forEach #2

    // 3. Normalization
    let finalScores = {};
    let maxAchievedPoints = 0;

    Object.values(stylePoints).forEach(points => { // Start forEach #4
        if (points > maxAchievedPoints) {
            maxAchievedPoints = points;
        }
    }); // End forEach #4

    // --- CAREFUL CHECK OF THIS if/else BLOCK ---
    if (maxAchievedPoints <= 0) { // Start IF block
        relevantStyles.forEach(styleName => { // Start forEach #5 (nested)
             finalScores[styleName] = 0;
        }); // End forEach #5 (nested)
    } else { // Start ELSE block
        relevantStyles.forEach(styleName => { // Start forEach #6 (nested)
            // *** Line ~2293 was here ***
            finalScores[styleName] = Math.round((stylePoints[styleName] / maxAchievedPoints) * 100);
        }); // End forEach #6 (nested)
    } // <<< --- THIS IS THE CORRECT CLOSING BRACE for the IF/ELSE

    // *** Line ~2298 IS HERE ***
    if (!temporary) { // Added brace for clarity, though optional for single statement
        console.log("[SF_COMPUTE_SCORES] Final Normalized Scores:", finalScores);
    } // End 'if (!temporary)'

    return finalScores; // Final return statement

}
  sfGenerateSummaryDashboard(sortedScores) {
    console.log("[SF_GEN_SUMMARY_DASH] Generating summary dashboard.");
    if (!sortedScores || sortedScores.length === 0) return '<p>No results to display.</p>';

    let dashboardHTML = `<h4 class="sf-dashboard-header">Overall Resonance</h4>`;
    // FIX: Use corrected escapeHTML
    sortedScores.slice(0, 5).forEach(([styleName, score]) => {
         const barWidth = Math.max(0, Math.min(100, score));
         const barHTML = `<div class="sf-score-bar" style="width: ${barWidth}%;"></div>`;
        dashboardHTML += `
            <div class="sf-dashboard-item">
                <span class="sf-style-name">${escapeHTML(styleName)}</span>
                 <div class="sf-score-bar-container">${barHTML}</div>
                <span class="sf-dashboard-score">${score}%</span>
            </div>`;
    });
     if (sortedScores.length > 5) {
         dashboardHTML += `<p class="muted-text" style="text-align: center; margin-top: 0.5em;">(Top 5 shown)</p>`;
     }
    return dashboardHTML;
}

  sfShowFeedback(message, type = 'info') {
    if (!this.elements.sfFeedback) return;
    this.elements.sfFeedback.textContent = message;
    this.elements.sfFeedback.className = `sf-feedback feedback-${type}`;
    this.elements.sfFeedback.classList.remove('feedback-animation');
    void this.elements.sfFeedback.offsetWidth; // Trigger reflow
    this.elements.sfFeedback.classList.add('feedback-animation');
}

  sfShowTraitInfo(traitName, triggerElement = null) {
    console.log(`[SF_SHOW_TRAIT_INFO] Showing SF info for trait: ${traitName}`);
    // Use findTraitExplanation helper which checks core data too
    const explanation = sfTraitExplanations[traitName] || findTraitExplanation(traitName) || "No specific explanation available.";
    this.sfCloseAllPopups();
    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-popup-title');
    popup.style.display = 'none';
    const titleId = `sf-popup-title-${generateSimpleId()}`;
    // FIX: Use corrected escapeHTML
    popup.innerHTML = `
        <button type="button" class="sf-close-btn" aria-label="Close">×</button>
        <h3 id="${titleId}">${escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}</h3>
        <p>${escapeHTML(explanation)}</p>
    `;
    const closeButton = popup.querySelector('.sf-close-btn');
    closeButton?.addEventListener('click', () => {
        popup.remove();
        triggerElement?.classList.remove('active');
        if(triggerElement && document.body.contains(triggerElement)) {
             try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
        }
    });
    document.body.appendChild(popup);
    popup.style.display = 'block';
    closeButton?.focus();
    if (triggerElement) triggerElement.classList.add('active');
}

  sfShowFullDetails(styleNameWithEmoji, triggerElement = null) {
    console.log(`[SF_SHOW_FULL_DETAILS] Showing full details for style: "${styleNameWithEmoji}"`);
    const descData = sfStyleDescriptions[styleNameWithEmoji];
    const matchData = sfDynamicMatches[styleNameWithEmoji];
    if (!descData || !matchData) {
        this.sfShowFeedback("Cannot load full details for this style.", "error");
        return;
    }
    this.sfCloseAllPopups();
    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup card wide-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-detail-popup-title');
    popup.style.display = 'none';
    const titleId = `sf-detail-popup-title-${generateSimpleId()}`;
    // FIX: Use corrected escapeHTML
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
     const closeButton = popup.querySelector('.sf-close-btn');
     closeButton?.addEventListener('click', () => {
         popup.remove();
         triggerElement?.classList.remove('active');
         if (triggerElement && document.body.contains(triggerElement)) {
              try { triggerElement.focus(); } catch(e) { console.warn("Focus return failed", e); }
         }
     });
    document.body.appendChild(popup);
    popup.style.display = 'block';
    closeButton?.focus();
    if (triggerElement) triggerElement.classList.add('active');
}

// Removed confirmation from here, moved to handler
// confirmApplyStyleFinderResult(role, styleWithEmoji) { ... }

  applyStyleFinderResult(role, styleWithEmoji) {
    console.log(`[SF_APPLY_RESULT] Applying SF result - Role: ${role}, Style: ${styleWithEmoji}`);
    if (!role || !styleWithEmoji || !this.elements.role || !this.elements.style || !this.elements.formSection) {
        this.showNotification("Error applying style to form.", "error");
        return;
    }
    this.resetForm(true); // Clear form first
    this.elements.role.value = role;
    this.renderStyles(role);

    // FIX: Enhanced timeout check
    setTimeout(() => {
         if (!this.elements.style) {
              console.error("[SF_APPLY_RESULT] Style dropdown element not found after delay.");
              return;
         }
         const styleOption = Array.from(this.elements.style.options).find(opt => opt.value === styleWithEmoji);
         if (styleOption) {
             this.elements.style.value = styleWithEmoji;
             console.log(`[SF_APPLY_RESULT] Set style dropdown to: ${styleWithEmoji}`);
             this.renderTraits(role, styleWithEmoji);
             this.updateLivePreview();
             this.updateStyleExploreLink();
         } else {
              console.error(`[SF_APPLY_RESULT] Style option '${styleWithEmoji}' not found in dropdown for role '${role}'. Cannot apply.`);
              this.showNotification(`Error: Style '${escapeHTML(styleWithEmoji)}' could not be applied.`, "error");
         }
     }, 150); // Slightly increased delay + added check

    this.sfClose();
    // FIX: Use corrected escapeHTML
    this.showNotification(`Style '${escapeHTML(styleWithEmoji)}' applied! Add a name & Save.`, "success");
    this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => this.elements.name?.focus(), 400);
}


  // --- Theme Management ---

  applySavedTheme() {
    console.log("[APPLY_THEME] Applying saved theme.");
    let savedTheme = 'light';
    // FIX: Wrap localStorage access
    try { savedTheme = localStorage.getItem('kinkCompassTheme') || 'light'; }
    catch (e) { console.error("[APPLY_THEME] Error reading theme:", e); }
    this.setTheme(savedTheme);
  }

  setTheme(themeName) {
    console.log(`[SET_THEME] Setting theme to: ${themeName}`);
    document.documentElement.setAttribute('data-theme', themeName);
    // FIX: Wrap localStorage access
    try { localStorage.setItem('kinkCompassTheme', themeName); }
    catch (e) {
        console.error(`[SET_THEME] Error saving theme '${themeName}':`, e);
        this.showNotification("Could not save theme preference.", "warning");
    }

    if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️';
        this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }
     if (!this.themeChangeTimeout) {
         this.themeChangeTimeout = setTimeout(() => {
             grantAchievement({}, 'theme_changer', this.showNotification.bind(this));
             this.themeChangeTimeout = null;
         }, 1000);
     }
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
     if (!this.chartInstance) return;
     console.log("[UPDATE_CHART_THEME] Updating chart colors.");
     requestAnimationFrame(() => {
         try {
             const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();
             const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label-color').trim();
             const tooltipBg = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-bg').trim();
             const tooltipText = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-text').trim();

             // Update scales
             if (this.chartInstance.options.scales.y) {
                  this.chartInstance.options.scales.y.ticks.color = labelColor;
                  this.chartInstance.options.scales.y.title.color = labelColor;
                  this.chartInstance.options.scales.y.grid.color = gridColor;
             }
            if (this.chartInstance.options.scales.x) {
                  this.chartInstance.options.scales.x.ticks.color = labelColor;
                  this.chartInstance.options.scales.x.title.color = labelColor;
                  this.chartInstance.options.scales.x.grid.color = gridColor;
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
             this.chartInstance.update('none');
         } catch (error) { console.error("[UPDATE_CHART_THEME] Error applying theme:", error); }
     });
 }


  // --- Modal Management ---

  openModal(modalElement) {
    if (!modalElement) return;
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[OPEN_MODAL] Opening modal: #${modalId}`);

    const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]:not(.trait-info-popup):not(.context-help-popup)');
    if (currentlyOpen && currentlyOpen !== modalElement) {
        this.closeModal(currentlyOpen);
    }
    this.elementThatOpenedModal = document.activeElement;
    modalElement.style.display = 'flex';
    modalElement.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
        let focusTarget = modalElement.querySelector('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusTarget) focusTarget = modalElement.querySelector('.modal-close, .sf-close-btn, .popup-close');
        if (!focusTarget) focusTarget = modalElement.querySelector('.modal-content');
        if (!focusTarget) focusTarget = modalElement;
        if (focusTarget) {
            if (focusTarget.hasAttribute('tabindex') && focusTarget.getAttribute('tabindex') === '-1') {
                // Already focusable or made focusable, good.
            } else if (!focusTarget.hasAttribute('tabindex') && (focusTarget === modalElement || focusTarget.classList.contains('modal-content'))) {
                 focusTarget.setAttribute('tabindex', '-1'); // Make container focusable
            }
            try { focusTarget.focus(); }
            catch (focusError) { console.error(`[OPEN_MODAL] Error focusing element:`, focusError); }
        }
    });
}

  closeModal(modalElement) {
    if (!modalElement || modalElement.getAttribute('aria-hidden') === 'true') return;
    const modalId = modalElement.id || 'unknown_modal';
    console.log(`[CLOSE_MODAL] Closing modal: #${modalId}`);
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('tabindex');
    modalElement.querySelector('.modal-content[tabindex="-1"]')?.removeAttribute('tabindex');

    const elementToFocus = this.elementThatOpenedModal;
    this.elementThatOpenedModal = null;

    requestAnimationFrame(() => { // Use RAF for focus return
        try {
            if (elementToFocus && document.body.contains(elementToFocus) && elementToFocus.offsetParent !== null) {
                elementToFocus.focus();
            } else { document.body.focus(); }
        } catch (e) { document.body.focus(); }
    });
    console.log(`[CLOSE_MODAL] Finished closing process for #${modalId}.`);
}


   // --- Internal Helper Methods ---

   getSynergyHints(person) {
       if (!person?.traits) return [];
       return findHintsForTraits(person.traits);
   }

   getGoalAlignmentHints(person) {
        const hints = [];
        if (!person?.goals || !person?.traits || typeof goalKeywords !== 'object') return hints;
        const activeGoals = person.goals.filter(g => !g.done);
        if (activeGoals.length === 0) return hints;
        const maxHints = 3;
        let hintsFound = 0;

        for (const goal of activeGoals) {
             if (hintsFound >= maxHints) break;
             const goalTextLower = goal.text.toLowerCase();
             const uniqueTraitsMentioned = new Set();

             for (const [keyword, data] of Object.entries(goalKeywords)) {
                  if (hintsFound >= maxHints) break;
                  if (goalTextLower.includes(keyword) && Array.isArray(data.relevantTraits)) {
                      for (const traitName of data.relevantTraits) {
                          if (hintsFound >= maxHints) break;
                          if (person.traits.hasOwnProperty(traitName) && !uniqueTraitsMentioned.has(traitName)) {
                               const score = person.traits[traitName];
                               const templates = data.promptTemplates || [];
                               if (templates.length > 0) {
                                    const promptTemplate = templates[Math.floor(Math.random() * templates.length)];
                                    // FIX: Use corrected escapeHTML
                                    const hintText = promptTemplate.replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`);
                                    hints.push(`For goal "<em>${escapeHTML(goal.text)}</em>": ${hintText} (Your score: ${score}${getFlairForScore(score)})`);
                                    hintsFound++;
                                    uniqueTraitsMentioned.add(traitName);
                               }
                          }
                      }
                  }
             }
        }
        return [...new Set(hints)];
    }

   getDailyChallenge(persona = null) {
        if (typeof challenges !== 'object') return null;
        let possibleCategories = ['communication', 'exploration'];
        if (persona?.role) {
            const roleKey = persona.role.toLowerCase();
            if (challenges[`${roleKey}_challenges`]) possibleCategories.push(`${roleKey}_challenges`);
            else if (roleKey === 'switch' && challenges['switch_challenges']) possibleCategories.push('switch_challenges');
        }
         possibleCategories = possibleCategories.filter(catKey =>
             challenges[catKey] && Array.isArray(challenges[catKey]) && challenges[catKey].length > 0
         );
        if (possibleCategories.length === 0) return null;
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
        const categoryChallenges = challenges[randomCategoryKey];
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];
        return { ...randomChallenge, category: randomCategoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
    }

   getKinkOracleReading(person) {
        console.log(`[GET_ORACLE_READING] Generating reading for Person ID ${person?.id}`);
        if (typeof oracleReadings !== 'object' || !oracleReadings.openings || !oracleReadings.focusAreas || !oracleReadings.encouragements || !oracleReadings.closings) return null;

        const reading = {};
        try {
            const getRandom = (arr, fallback = "") => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : fallback;
            reading.opening = getRandom(oracleReadings.openings, "The energies swirl...");
            let focusText = "";
            const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score))) : [];

            if (traits.length > 0 && Math.random() > 0.3 && Array.isArray(oracleReadings.focusAreas?.traitBased)) {
                traits.sort((a, b) => Math.abs(a[1] - 3) - Math.abs(b[1] - 3));
                const focusTrait = getRandom(traits.slice(-3));
                if (focusTrait) {
                    const traitName = focusTrait[0];
                    const template = getRandom(oracleReadings.focusAreas.traitBased);
                    // FIX: Use corrected escapeHTML
                    focusText = template.replace('{traitName}', `<strong>${escapeHTML(traitName)}</strong>`);
                }
            }
            if (!focusText && person?.style && Math.random() > 0.5 && Array.isArray(oracleReadings.focusAreas?.styleBased)) {
                const template = getRandom(oracleReadings.focusAreas.styleBased);
                // FIX: Use corrected escapeHTML
                focusText = template.replace('{styleName}', `<em>${escapeHTML(person.style)}</em>`);
            }
            if (!focusText && Array.isArray(oracleReadings.focusAreas?.general)) {
                focusText = getRandom(oracleReadings.focusAreas.general);
            }
            reading.focus = focusText || "Inner reflection.";
            reading.encouragement = getRandom(oracleReadings.encouragements, "Keep exploring!");
            reading.closing = getRandom(oracleReadings.closings, "Go well.");
            return reading;
        } catch (error) {
            console.error("[GET_ORACLE_READING] Error during generation:", error);
            return null;
        }
    }


   // --- Achievement Checkers ---

   checkGoalStreak(person) {
        if (!person?.goals) return;
        const completedGoals = person.goals.filter(g => g.done && g.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        if (completedGoals.length < 3) return;
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentCompletions = completedGoals.slice(0, 3).filter(g => {
             try { return new Date(g.completedAt) >= sevenDaysAgo; } catch(e) { return false; }
        });
        if (recentCompletions.length >= 3) {
            grantAchievement(person, 'goal_streak_3', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    }

   checkTraitTransformation(person, currentSnapshot) {
        if (!Array.isArray(person?.history) || person.history.length === 0 || !currentSnapshot?.traits) return;
        const previousSnapshot = person.history[person.history.length - 1];
        if (!previousSnapshot?.traits) return;
        let transformed = false;
        for (const traitName in currentSnapshot.traits) {
            if (previousSnapshot.traits.hasOwnProperty(traitName)) {
                const currentScore = parseInt(currentSnapshot.traits[traitName], 10);
                const previousScore = parseInt(previousSnapshot.traits[traitName], 10);
                if (!isNaN(currentScore) && !isNaN(previousScore) && (currentScore - previousScore >= 2)) {
                    transformed = true; break;
                }
            }
        }
        if (transformed) {
             grantAchievement(person, 'trait_transformer', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
        }
    }

   checkConsistentSnapper(person, currentTimestamp) {
        if (!Array.isArray(person?.history) || person.history.length === 0) return;
        const previousSnapshot = person.history[person.history.length - 1];
        if (!previousSnapshot?.timestamp) return;
        try {
            const prevTime = new Date(previousSnapshot.timestamp);
            const currentTime = new Date(currentTimestamp);
            if (isNaN(prevTime.getTime()) || isNaN(currentTime.getTime())) return;
            const daysDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff >= 3) {
                 grantAchievement(person, 'consistent_snapper', this.showNotification.bind(this), this.saveToLocalStorage.bind(this));
            }
        } catch (dateError) { console.error("[CONSISTENT_SNAP_CHECK] Error processing timestamps:", dateError); }
    }

    // --- Notification Helper ---
    showNotification(message, type = 'info', duration = 4000, details = null) {
        const notificationElement = this.elements.notificationArea || this.createNotificationElement();
        if (!notificationElement) return;
        console.log(`[NOTIFICATION] Type: ${type}, Msg: ${message}`, details || '');
        notificationElement.className = `notification-${type}`;
        // FIX: Use corrected escapeHTML (though primarily for internal messages here, better safe)
        notificationElement.textContent = escapeHTML(message);
        notificationElement.style.opacity = '1';
        notificationElement.style.transform = 'translate(-50%, 0)';
        notificationElement.style.top = '70px';
        notificationElement.setAttribute('aria-hidden', 'false');
        notificationElement.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');

        if (this.notificationTimer) clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => {
            notificationElement.style.opacity = '0';
            notificationElement.style.transform = 'translate(-50%, -20px)';
            notificationElement.style.top = '20px';
            notificationElement.setAttribute('aria-hidden', 'true');
            this.notificationTimer = null;
        }, duration);
    }

    createNotificationElement() {
        let notificationArea = document.getElementById('app-notification');
        if (notificationArea) return notificationArea;
        try {
            const div = document.createElement('div');
            div.id = 'app-notification';
            div.setAttribute('role', 'status');
            div.setAttribute('aria-live', 'assertive');
            div.setAttribute('aria-hidden', 'true');
            document.body.appendChild(div);
            this.elements.notificationArea = div;
            return div;
        } catch (error) {
            console.error("[CREATE_NOTIFICATION_ELEMENT] Failed:", error);
            return null;
        }
    }

} // <<< --- END OF TrackerApp CLASS --- >>>

// --- Initialization ---
try {
    const initializeApp = () => {
        console.log("[INIT] Initializing KinkCompass App...");
        window.kinkCompassApp = new TrackerApp();
        console.log("[INIT] KinkCompass App Initialized on window.kinkCompassApp");
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
} catch (error) {
    console.error("[INIT] FATAL error during App initialization:", error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>Message: ${escapeHTML(error.message)}<br><br>Stack Trace:<br>${escapeHTML(error.stack || 'Not available')}<br><br>Check console (F12). Clear localStorage or import backup if needed.`;
    // Ensure body exists before prepending
    const prependError = () => document.body ? document.body.prepend(errorDiv) : setTimeout(prependError, 50);
    prependError();
}
