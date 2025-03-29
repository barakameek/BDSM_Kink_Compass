// === app.js === (Version 2.7 - Diagnostic Logging) ===

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
// ...(kept same checks)...
// --- End Data Check ---


const contextHelpTexts = { /* ... Keep as is ... */ };

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: STARTING KinkCompass App (v2.7)..."); // <<< LOG 1
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;

    // Style Finder State
    // ... (keep SF state variables) ...
    // Style Finder Data Structures
    // ... (keep SF data structures) ...

    // Element Mapping
    console.log("CONSTRUCTOR: Mapping elements..."); // <<< LOG 2
    this.elements = {
      formSection: document.getElementById('form-section'), name: document.getElementById('name'), avatarDisplay: document.getElementById('avatar-display'), avatarInput: document.getElementById('avatar-input'), avatarPicker: document.querySelector('.avatar-picker'), role: document.getElementById('role'), style: document.getElementById('style'), styleExploreLink: document.getElementById('style-explore-link'), formStyleFinderLink: document.getElementById('form-style-finder-link'), traitsContainer: document.getElementById('traits-container'), traitsMessage: document.getElementById('traits-message'), traitInfoPopup: document.getElementById('trait-info-popup'), traitInfoClose: document.getElementById('trait-info-close'), traitInfoTitle: document.getElementById('trait-info-title'), traitInfoBody: document.getElementById('trait-info-body'), contextHelpPopup: document.getElementById('context-help-popup'), contextHelpClose: document.getElementById('context-help-close'), contextHelpTitle: document.getElementById('context-help-title'), contextHelpBody: document.getElementById('context-help-body'), save: document.getElementById('save'), clearForm: document.getElementById('clear-form'), peopleList: document.getElementById('people-list'), livePreview: document.getElementById('live-preview'), modal: document.getElementById('detail-modal'), modalBody: document.getElementById('modal-body'), modalTabs: document.getElementById('modal-tabs'), modalClose: document.getElementById('modal-close'), resourcesBtn: document.getElementById('resources-btn'), resourcesModal: document.getElementById('resources-modal'), resourcesClose: document.getElementById('resources-close'), resourcesBody: document.getElementById('resources-body'), glossaryBtn: document.getElementById('glossary-btn'), glossaryModal: document.getElementById('glossary-modal'), glossaryClose: document.getElementById('glossary-close'), glossaryBody: document.getElementById('glossary-body'), styleDiscoveryBtn: document.getElementById('style-discovery-btn'), styleDiscoveryModal: document.getElementById('style-discovery-modal'), styleDiscoveryClose: document.getElementById('style-discovery-close'), styleDiscoveryRoleFilter: document.getElementById('style-discovery-role'), styleDiscoveryBody: document.getElementById('style-discovery-body'), themesBtn: document.getElementById('themes-btn'), themesModal: document.getElementById('themes-modal'), themesClose: document.getElementById('themes-close'), themesBody: document.getElementById('themes-body'), achievementsBtn: document.getElementById('achievements-btn'), achievementsModal: document.getElementById('achievements-modal'), achievementsClose: document.getElementById('achievements-close'), achievementsBody: document.getElementById('achievements-body'), welcomeModal: document.getElementById('welcome-modal'), welcomeClose: document.getElementById('welcome-close'), exportBtn: document.getElementById('export-btn'), importBtn: document.getElementById('import-btn'), importFileInput: document.getElementById('import-file-input'), themeToggle: document.getElementById('theme-toggle'), styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'), sfModal: document.getElementById('style-finder-modal'), sfCloseBtn: document.getElementById('sf-close-style-finder'), sfProgressTracker: document.getElementById('sf-progress-tracker'), sfStepContent: document.getElementById('sf-step-content'), sfFeedback: document.getElementById('sf-feedback'), sfDashboard: document.getElementById('sf-dashboard'), detailModalTitle: document.getElementById('detail-modal-title'), resourcesModalTitle: document.getElementById('resources-modal-title'), glossaryModalTitle: document.getElementById('glossary-modal-title'), styleDiscoveryTitle: document.getElementById('style-discovery-title'), themesModalTitle: document.getElementById('themes-modal-title'), achievementsModalTitle: document.getElementById('achievements-modal-title'), welcomeModalTitle: document.getElementById('welcome-modal-title'), sfModalTitle: document.getElementById('sf-modal-title'), formTitle: document.getElementById('form-title'), dailyChallengeArea: document.getElementById('daily-challenge-area'), dailyChallengeSection: document.getElementById('daily-challenge-section')
    };
    console.log("CONSTRUCTOR: Elements mapped. PeopleList found:", !!this.elements.peopleList); // <<< LOG 3

    if (!this.elements.role || !this.elements.style) {
        console.error("CRITICAL ERROR: Role or Style dropdown missing!");
        alert("App critical error: Core form elements missing. Please refresh or check console."); // User alert
        return;
    }

    console.log("CONSTRUCTOR: Calling addEventListeners..."); // <<< LOG 4
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added."); // <<< LOG 5 (Should appear after addEventListeners finishes)

    console.log("CONSTRUCTOR: Loading data and initial render..."); // <<< LOG 6
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, this.elements.style.value);
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    this.displayDailyChallenge();
    console.log("CONSTRUCTOR: Initial render complete."); // <<< LOG 7
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() { /* ... Keep verified logic ... */ }
  saveToLocalStorage() { /* ... Keep verified logic ... */ }

  // --- Onboarding ---
  checkAndShowWelcome() { /* ... Keep verified logic ... */ }
  showWelcomeMessage() { /* ... Keep verified logic ... */ }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("ADD_LISTENERS: Starting setup..."); // <<< LOG 8

    // Helper to safely add listener
    const safeAddListener = (element, event, handler, elementName) => {
        if (element) {
            element.addEventListener(event, handler);
            console.log(`  LISTENER ADDED: ${elementName} - ${event}`);
        } else {
            console.warn(`  ELEMENT NOT FOUND for listener: ${elementName}`);
        }
    };

    // Form Elements
    safeAddListener(this.elements.role, 'change', (e) => { this.renderStyles(e.target.value); this.renderTraits(e.target.value, ''); this.elements.style.value = ''; this.updateLivePreview(); }, 'role');
    safeAddListener(this.elements.style, 'change', (e) => { this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); }, 'style');
    safeAddListener(this.elements.name, 'input', () => { this.updateLivePreview(); }, 'name');
    safeAddListener(this.elements.save, 'click', () => { this.savePerson(); }, 'save');
    safeAddListener(this.elements.clearForm, 'click', () => { this.resetForm(true); }, 'clearForm');
    safeAddListener(this.elements.avatarPicker, 'click', (e) => { if (e.target.classList.contains('avatar-btn')) { const emoji = e.target.dataset.emoji; this.elements.avatarInput.value = emoji; this.elements.avatarDisplay.textContent = emoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b=>b.classList.remove('selected')); e.target.classList.add('selected'); this.updateLivePreview();} }, 'avatarPicker');
    safeAddListener(this.elements.traitsContainer, 'input', (e) => { if (e.target.classList.contains('trait-slider')) { this.handleTraitSliderInput(e); this.updateLivePreview(); } }, 'traitsContainer input');
    safeAddListener(this.elements.traitsContainer, 'click', (e) => { if (e.target.classList.contains('trait-info-btn')) { this.handleTraitInfoClick(e); } }, 'traitsContainer click');
    safeAddListener(this.elements.formStyleFinderLink, 'click', () => { this.sfStart(); }, 'formStyleFinderLink');

    // Popups & Context Help
    safeAddListener(document.body, 'click', (e) => { if (e.target.classList.contains('context-help-btn')) { const key = e.target.dataset.helpKey; if(key) this.showContextHelp(key); } }, 'body context-help');
    safeAddListener(this.elements.traitInfoClose, 'click', () => { this.hideTraitInfo(); }, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', () => { this.hideContextHelp(); }, 'contextHelpClose');

    // Persona List Interaction
    safeAddListener(this.elements.peopleList, 'click', (e) => this.handleListClick(e), 'peopleList click');
    safeAddListener(this.elements.peopleList, 'keydown', (e) => this.handleListKeydown(e), 'peopleList keydown');

    // Modal Close Buttons
    safeAddListener(this.elements.modalClose, 'click', () => { this.closeModal(this.elements.modal); }, 'modalClose');
    safeAddListener(this.elements.resourcesClose, 'click', () => { this.closeModal(this.elements.resourcesModal); }, 'resourcesClose');
    safeAddListener(this.elements.glossaryClose, 'click', () => { this.closeModal(this.elements.glossaryModal); }, 'glossaryClose');
    safeAddListener(this.elements.styleDiscoveryClose, 'click', () => { this.closeModal(this.elements.styleDiscoveryModal); }, 'styleDiscoveryClose');
    safeAddListener(this.elements.themesClose, 'click', () => { this.closeModal(this.elements.themesModal); }, 'themesClose');
    safeAddListener(this.elements.welcomeClose, 'click', () => { this.closeModal(this.elements.welcomeModal); }, 'welcomeClose');
    safeAddListener(this.elements.achievementsClose, 'click', () => { this.closeModal(this.elements.achievementsModal); }, 'achievementsClose');
    safeAddListener(this.elements.sfCloseBtn, 'click', () => { this.sfClose(); }, 'sfCloseBtn');

    // Header/Feature Buttons
    safeAddListener(this.elements.resourcesBtn, 'click', () => { grantAchievement({}, 'resource_reader'); localStorage.setItem('kinkCompass_resource_reader', 'true'); this.openModal(this.elements.resourcesModal); console.log("Resources btn handler executed."); }, 'resourcesBtn');
    safeAddListener(this.elements.glossaryBtn, 'click', () => { grantAchievement({}, 'glossary_user'); localStorage.setItem('kinkCompass_glossary_used', 'true'); this.showGlossary(); console.log("Glossary btn handler executed."); }, 'glossaryBtn');
    safeAddListener(this.elements.styleDiscoveryBtn, 'click', () => { grantAchievement({}, 'style_discovery'); this.showStyleDiscovery(); console.log("Style Discovery btn handler executed."); }, 'styleDiscoveryBtn');
    safeAddListener(this.elements.themesBtn, 'click', () => { this.openModal(this.elements.themesModal); console.log("Themes btn handler executed."); }, 'themesBtn');
    safeAddListener(this.elements.achievementsBtn, 'click', () => { this.showAchievements(); console.log("Achievements btn handler executed."); }, 'achievementsBtn');
    safeAddListener(this.elements.themeToggle, 'click', () => { this.toggleTheme(); console.log("Theme toggle handler executed."); }, 'themeToggle');
    safeAddListener(this.elements.exportBtn, 'click', () => { this.exportData(); console.log("Export btn handler executed."); }, 'exportBtn');
    safeAddListener(this.elements.importBtn, 'click', () => { this.elements.importFileInput?.click(); console.log("Import btn handler executed."); }, 'importBtn');
    safeAddListener(this.elements.importFileInput, 'change', (e) => { this.importData(e); }, 'importFileInput');
    safeAddListener(this.elements.styleFinderTriggerBtn, 'click', () => { this.sfStart(); console.log("SF Trigger btn handler executed."); }, 'styleFinderTriggerBtn');

    // Other UI Listeners
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => { this.renderStyleDiscoveryContent(); }, 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.themesBody, 'click', (e) => this.handleThemeSelection(e), 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', (e) => this.handleModalBodyClick(e), 'modalBody');
    safeAddListener(this.elements.modalTabs, 'click', (e) => this.handleDetailTabClick(e), 'modalTabs');
    safeAddListener(this.elements.glossaryBody, 'click', (e) => this.handleGlossaryLinkClick(e), 'glossaryBody');
    safeAddListener(document.body, 'click', (e) => this.handleGlossaryLinkClick(e), 'body glossaryLink'); // Generic fallback for glossary links
    safeAddListener(this.elements.styleExploreLink, 'click', (e) => this.handleExploreStyleLinkClick(e), 'styleExploreLink');

    // Style Finder Modal Internal Listeners
    safeAddListener(this.elements.sfStepContent, 'click', (e) => { const button = e.target.closest('button'); if (button) { if (button.classList.contains('sf-info-icon')) { const traitName = button.dataset.trait; if (traitName) this.sfShowTraitInfo(traitName); } else { const action = button.dataset.action; if(action) this.handleStyleFinderAction(action, button.dataset); } } }, 'sfStepContent click');
    safeAddListener(this.elements.sfStepContent, 'input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { this.handleStyleFinderSliderInput(e.target); } }, 'sfStepContent input');

    // Window Listeners
    safeAddListener(window, 'keydown', (e) => this.handleWindowKeydown(e), 'window keydown');
    safeAddListener(window, 'click', (e) => this.handleWindowClick(e), 'window click');

    console.log("ADD_LISTENERS: Setup COMPLETE."); // <<< LOG 9
  } // End addEventListeners

  // --- Event Handlers ---
  handleListClick(e) {
    console.log("[handleListClick] Event Target:", e.target);
    const target = e.target;
    const listItem = target.closest('li[data-id]');
    if (!listItem) { console.log("[handleListClick] Click outside valid LI."); return; }
    const personIdStr = listItem.dataset.id; const personId = parseInt(personIdStr, 10);
    if (isNaN(personId)) { console.warn("[handleListClick] Invalid personId:", personIdStr); return; }
    console.log(`[handleListClick] Processing click for personId: ${personId}`);
    if (target.closest('.edit-btn')) { console.log("[handleListClick] Edit branch"); this.editPerson(personId); }
    else if (target.closest('.delete-btn')) { console.log("[handleListClick] Delete branch"); const name = listItem.querySelector('.person-name')?.textContent || 'persona'; if (confirm(`Delete ${name}?`)) { this.deletePerson(personId); } }
    else if (target.closest('.person-info')) { console.log("[handleListClick] Info branch -> showPersonDetails"); this.showPersonDetails(personId); }
    else { console.log("[handleListClick] Unhandled click within LI."); }
  } // End handleListClick

  handleListKeydown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target; const listItem = target.closest('li[data-id]'); if (!listItem) return;
      console.log(`[handleListKeydown] Key: ${e.key} on target:`, target);
      if (target.closest('.person-actions') && (target.classList.contains('edit-btn') || target.classList.contains('delete-btn'))) { console.log("[handleListKeydown] Activating button"); e.preventDefault(); target.click(); }
      else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) { console.log("[handleListKeydown] Activating details"); e.preventDefault(); const personId = parseInt(listItem.dataset.id, 10); if (!isNaN(personId)) this.showPersonDetails(personId); }
  } // End handleListKeydown

  handleWindowClick(e) { /* ... Verified logic ... */ if (this.elements.traitInfoPopup?.style.display !== 'none') { const c = this.elements.traitInfoPopup.querySelector('.card'); const t = document.querySelector('.trait-info-btn[aria-expanded="true"]'); if (c && !c.contains(e.target) && e.target !== t && !t?.contains(e.target)) this.hideTraitInfo(); } if (this.elements.contextHelpPopup?.style.display !== 'none') { const c = this.elements.contextHelpPopup.querySelector('.card'); const t = document.querySelector('.context-help-btn[aria-expanded="true"]'); if (c && !c.contains(e.target) && e.target !== t && !t?.contains(e.target)) this.hideContextHelp(); } const sf = document.querySelector('.sf-style-info-popup'); if (sf) { const t = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active'); if (!sf.contains(e.target) && e.target !== t && !t?.contains(e.target)) { sf.remove(); t?.classList.remove('active'); } } }
  handleWindowKeydown(e) { /* ... Verified logic ... */ if (e.key === 'Escape') { console.log("Esc pressed..."); if (this.elements.traitInfoPopup?.style.display !== 'none') { this.hideTraitInfo(); return; } if (this.elements.contextHelpPopup?.style.display !== 'none') { this.hideContextHelp(); return; } const sf = document.querySelector('.sf-style-info-popup'); if (sf) { sf.remove(); document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active'); return; } const openModal = document.querySelector('.modal[aria-hidden="false"]'); if (openModal) this.closeModal(openModal); else console.log("No active modal/popup found."); } }
  handleTraitSliderInput(e) { /* ... Verified logic ... */ const s = e.target; const d = s.closest('.trait')?.querySelector('.trait-value'); if (d) d.textContent = s.value; this.updateTraitDescription(s); }
  handleTraitInfoClick(e) { /* ... Verified logic ... */ const b = e.target.closest('.trait-info-btn'); if (!b) return; const t = b.dataset.trait; if (!t) return; this.showTraitInfo(t); document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => { if (btn !== b) btn.setAttribute('aria-expanded', 'false'); }); b.setAttribute('aria-expanded', 'true'); }
  handleModalBodyClick(e) { /* ... Verified logic ... */ const pIdS = this.elements.modal?.dataset.personId; if (!pIdS) return; const pId = parseInt(pIdS, 10); if (isNaN(pId)) return; const t = e.target; const b = t.closest('button'); if (b) { if (b.classList.contains('toggle-goal-btn')) { const gId = parseInt(b.dataset.goalId, 10); if (!isNaN(gId)) this.toggleGoalStatus(pId, gId, b.closest('li')); return; } if (b.classList.contains('delete-goal-btn')) { const gId = parseInt(b.dataset.goalId, 10); if (!isNaN(gId) && confirm("Delete goal?")) this.deleteGoal(pId, gId); return; } switch (b.id) { case 'snapshot-btn': this.addSnapshotToHistory(pId); return; case 'journal-prompt-btn': this.showJournalPrompt(pId); return; case 'save-reflections-btn': this.saveReflections(pId); return; case 'oracle-btn': this.showKinkOracle(pId); return; } if (b.classList.contains('glossary-link')) { e.preventDefault(); const k = b.dataset.termKey; if (k) { this.closeModal(this.elements.modal); this.showGlossary(k); } return; } } }
  handleThemeSelection(e) { /* ... Verified logic ... */ const b = e.target.closest('.theme-option-btn'); if (b?.dataset.theme) { this.setTheme(b.dataset.theme); this.closeModal(this.elements.themesModal); } }
  handleStyleFinderAction(action, dataset = {}) { /* ... Verified logic ... */ }
  handleStyleFinderSliderInput(sliderElement) { /* ... Verified logic ... */ }
  handleDetailTabClick(e) { /* ... Verified logic ... */ }
  handleGlossaryLinkClick(e) { /* ... Verified logic ... */ }
  handleExploreStyleLinkClick(e) { /* ... Verified logic ... */ }

  // --- Core Rendering ---
  renderStyles(roleKey) { /* ... Verified logic ... */ }
  renderTraits(roleKey, styleName) { /* ... Verified logic ... */ }
  createTraitHTML(trait) { /* ... Verified logic ... */ }
  updateTraitDescription(slider) { /* ... Verified logic ... */ }
  renderList() { /* ... Verified logic ... */ }
  createPersonListItemHTML(person) { /* ... Verified logic ... */ }
  updateStyleExploreLink() { /* ... Verified logic ... */ }

  // --- CRUD ---
  savePerson() { /* ... Verified logic ... */ }
  editPerson(personId) { /* ... Verified logic ... */ }
  deletePerson(personId) { /* ... Verified logic ... */ }
  resetForm(isManualClear = false) { /* ... Verified logic ... */ }

  // --- Live Preview ---
  updateLivePreview() { /* ... Verified logic ... */ }

  // --- Modal Display ---
  showPersonDetails(personId) {
      console.log(`>>> showPersonDetails called for ID: ${personId}`); // <<< ADD THIS LOG
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`showPersonDetails: Person with ID ${personId} not found.`);
          this.showNotification("Could not load persona details.", "error");
          return;
      }
      console.log(`showPersonDetails: Found person: ${person.name}`);

      if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs) {
          console.error("showPersonDetails: Detail modal elements missing.");
          this.showNotification("UI Error: Cannot display details.", "error");
          return;
      }
      console.log("showPersonDetails: Modal elements found.");

      this.elements.modal.dataset.personId = personId;
      if (this.elements.detailModalTitle) {
          this.elements.detailModalTitle.textContent = `${person.avatar || '❓'} ${this.escapeHTML(person.name)} - Details`;
      }

      this.elements.modalBody.innerHTML = ''; // Clear previous content
      this.elements.modalTabs.innerHTML = ''; // Clear previous tabs

      const tabs = [ { id: 'tab-goals', label: 'Goals', icon: '🎯' }, { id: 'tab-traits', label: 'Traits', icon: '🎨' }, { id: 'tab-breakdown', label: 'Breakdown', icon: '📊' }, { id: 'tab-history', label: 'History', icon: '📈' }, { id: 'tab-journal', label: 'Journal', icon: '📝' }, { id: 'tab-achievements', label: 'Achievements', icon: '🏆' }, { id: 'tab-oracle', label: 'Oracle', icon: '🔮' } ];

      console.log(`showPersonDetails: Rendering ${tabs.length} tabs...`);
      tabs.forEach((tab) => {
          const isActive = tab.id === this.activeDetailModalTab;
          const tabButton = document.createElement('button');
          // ...(button setup)...
          this.elements.modalTabs.appendChild(tabButton);
          const contentPane = document.createElement('div');
          // ...(content pane setup)...
          this.elements.modalBody.appendChild(contentPane);
          if (isActive) {
              console.log(`showPersonDetails: Rendering active tab content for ${tab.id}`);
              this.renderDetailTabContent(person, tab.id, contentPane);
          }
      });

      console.log("showPersonDetails: Calling openModal..."); // <<< ADD THIS LOG
      this.openModal(this.elements.modal);
      console.log("showPersonDetails: Finished."); // <<< ADD THIS LOG
  } // End showPersonDetails

  renderDetailTabContent(person, tabId, contentElement) { /* ... Keep verified logic ... */ }

  // --- New Feature Logic ---
  addGoal(personId, formElement) { /* ... Keep verified logic ... */ }
  toggleGoalStatus(personId, goalId, listItemElement = null) { /* ... Keep verified logic ... */ }
  deleteGoal(personId, goalId) { /* ... Keep verified logic ... */ }
  renderGoalList(person) { /* ... Keep verified logic ... */ }
  showJournalPrompt(personId) { /* ... Keep verified logic ... */ }
  saveReflections(personId) { /* ... Keep verified logic ... */ }
  addSnapshotToHistory(personId) { /* ... Keep verified logic ... */ }
  renderHistoryChart(person, canvasId) { /* ... Keep verified logic ... */ }
  toggleSnapshotInfo(button) { /* ... Keep verified logic ... */ }
  renderAchievementsList(person, listElementId) { /* ... Keep verified logic ... */ }
  showAchievements() { /* ... Keep verified logic ... */ }
  showKinkOracle(personId) { /* ... Keep verified logic ... */ }
  displayDailyChallenge() { /* ... Keep verified logic ... */ }

  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) { /* ... Keep verified logic ... */ }
  showStyleDiscovery(styleNameToHighlight = null) { /* ... Keep verified logic ... */ }
  renderStyleDiscoveryContent(styleNameToHighlight = null) { /* ... Keep verified logic ... */ }

  // --- Data Import/Export ---
  exportData() { /* ... Keep verified logic ... */ }
  importData(event) { /* ... Keep verified logic ... */ }

  // --- Popups ---
  showTraitInfo(traitName){ /* ... Keep verified logic ... */ }
  hideTraitInfo(){ /* ... Keep verified logic ... */ }
  showContextHelp(helpKey) { /* ... Keep verified logic ... */ }
  hideContextHelp() { /* ... Keep verified logic ... */ }

  // --- Style Finder Methods ---
  sfStart() { /* ... Keep verified logic ... */ }
  sfClose() { /* ... Keep verified logic ... */ }
  sfCalculateSteps() { /* ... Keep verified logic ... */ }
  sfRenderStep() { /* ... Keep verified logic ... */ }
  sfSetRole(role) { /* ... Keep verified logic ... */ }
  sfSetTrait(trait, value) { /* ... Keep verified logic ... */ }
  sfNextStep(currentTrait = null) { /* ... Keep verified logic ... */ }
  sfPrevStep() { /* ... Keep verified logic ... */ }
  sfStartOver() { /* ... Keep verified logic ... */ }
  sfComputeScores() { /* ... Keep verified logic ... */ }
  sfUpdateDashboard(forceVisible = false) { /* ... Keep verified logic ... */ }
  toggleStyleFinderDashboard() { /* ... Keep verified logic ... */ }
  sfCalculateResult() { /* ... Keep verified logic ... */ }
  sfGenerateSummaryDashboard() { /* ... Keep verified logic ... */ }
  sfShowFeedback(message) { /* ... Keep verified logic ... */ }
  sfShowTraitInfo(traitName) { /* ... Keep verified logic ... */ }
  sfShowFullDetails(styleNameWithEmoji) { /* ... Keep verified logic ... */ }
  getStyleIcons() { /* ... Keep verified logic ... */ }
  confirmApplyStyleFinderResult(role, styleWithEmoji) { /* ... Keep verified logic ... */ }
  applyStyleFinderResult(role, styleWithEmoji) { /* ... Keep verified logic ... */ }

  // --- Other Helper Functions ---
  getFlairForScore(s) { /* ... Keep verified logic ... */ }
  getEmojiForScore(s) { /* ... Keep verified logic ... */ }
  escapeHTML(str){ /* ... Keep verified logic ... */ }
  getIntroForStyle(styleName){ /* ... Keep verified logic ... */ }
  showNotification(message, type = 'info', duration = 4000) { /* ... Keep verified logic ... */ }

  // --- Theme Management ---
  applySavedTheme() { /* ... Keep verified logic ... */ }
  setTheme(themeName){ /* ... Keep verified logic ... */ }
  toggleTheme(){ /* ... Keep verified logic ... */ }

   // --- Modal Management ---
   openModal(modalElement) {
       if (!modalElement) {
           console.error("openModal: Called with null or undefined modalElement.");
           return;
       }
       console.log(`[openModal] Attempting to open: #${modalElement.id}`); // <<< LOG
       this.elementThatOpenedModal = document.activeElement; // Store focus
       console.log(`[openModal] Stored focus return element:`, this.elementThatOpenedModal);

       modalElement.setAttribute('aria-hidden', 'false');
       modalElement.style.display = 'flex'; // Use flex as per original CSS
       console.log(`[openModal] Set display:flex and aria-hidden:false for #${modalElement.id}`);

       // Defer focus slightly to ensure modal is fully visible and interactive
       requestAnimationFrame(() => {
           const focusable = modalElement.querySelector('.modal-close, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
           if (focusable) {
               focusable.focus();
               console.log(`[openModal] Focused first focusable element in #${modalElement.id}:`, focusable);
           } else {
               modalElement.setAttribute('tabindex', '-1'); // Make modal container focusable if nothing else is
               modalElement.focus();
               console.log(`[openModal] No specific focusable element found, focused modal container #${modalElement.id}`);
           }
       });
   } // End openModal

   closeModal(modalElement) {
       if (!modalElement) {
           console.error("closeModal: Called with null or undefined modalElement.");
           return;
        }
       console.log(`[closeModal] Attempting to close: #${modalElement.id}`);

       modalElement.setAttribute('aria-hidden', 'true');
       modalElement.style.display = 'none';
       console.log(`[closeModal] Set display:none and aria-hidden:true for #${modalElement.id}`);


       // Restore focus carefully
       console.log("[closeModal] Attempting to restore focus to:", this.elementThatOpenedModal);
       try {
           if (this.elementThatOpenedModal && typeof this.elementThatOpenedModal.focus === 'function' && document.body.contains(this.elementThatOpenedModal)) {
               this.elementThatOpenedModal.focus();
               console.log("[closeModal] Focus restored to original element.");
           } else {
               console.warn("[closeModal] Original focus element lost or invalid, focusing body.");
               document.body.focus(); // Fallback focus
           }
       } catch (e) {
           console.error("[closeModal] Error restoring focus:", e);
           try { document.body.focus(); } catch (e2) { /* Failsafe */ }
       } finally {
           this.elementThatOpenedModal = null; // Clear stored element
       }
   } // End closeModal

   // <<< --- NEW HELPER FUNCTIONS --- >>>
   getSynergyHints(person) { /* ... Keep verified logic ... */ }
   getGoalAlignmentHints(person) { /* ... Keep verified logic ... */ }
   getDailyChallenge(persona = null) { /* ... Keep verified logic ... */ }
   getKinkOracleReading(person) { /* ... Keep verified logic ... */ }
   // --- Achievement Checkers ---
   checkGoalStreak(person) { /* ... Keep verified logic ... */ }
   checkTraitTransformation(person, currentSnapshot) { /* ... Keep verified logic ... */ }
   checkConsistentSnapper(person, currentTimestamp) { /* ... Keep verified logic ... */ }

} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    // Display error to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: red; padding: 20px; border: 2px solid red; margin: 20px; background: white; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px;';
    errorDiv.innerHTML = `<strong>Fatal Error: KinkCompass could not start.</strong><br>${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}`;
    document.body.prepend(errorDiv);
}
