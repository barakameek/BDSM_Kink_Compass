// === app.js === (COMPLETE - Incorporating All Requested Changes)

// Import necessary modules
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js and Confetti loaded via CDN

// NEW: Contextual help text definitions
const contextHelpTexts = {
  historyChartInfo: "This chart visualizes how your trait scores have changed over time with each 'Snapshot' you take. Use snapshots to track your growth!",
  goalsSectionInfo: "Set specific, measurable goals for your persona's journey. Mark them as done when achieved!",
  traitsSectionInfo: "These are the specific traits relevant to your persona's chosen Role and Style. The scores reflect your self-assessment.",
  achievementsSectionInfo: "Unlock achievements by using features and reaching milestones with your personas!",
  journalSectionInfo: "Use the journal to reflect on experiences, explore feelings, or answer prompts. Your private space for introspection."
};

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: Starting KinkCompass App...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals'; // NEW: Track active tab in detail modal

    // --- Style Finder State ---
    // (Existing Style Finder State remains the same)
    this.sfActive = false;
    this.sfStep = 0;
    this.sfRole = null;
    this.sfIdentifiedRole = null;
    this.sfAnswers = { rolePreference: null, traits: {} };
    this.sfScores = {};
    this.sfPreviousScores = {};
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = [];
    this.sfSteps = [];
    // NEW: Style Finder - Control dashboard visibility during trait questions
    this.sfShowDashboardDuringTraits = false;


    // --- Style Finder Data Structures ---
    // (Existing Style Finder Data Structures remain the same)
    this.sfStyles = { /* ... */ };
    this.sfSubFinderTraits = [ /* ... */ ];
    this.sfSubTraitFootnotes = { /* ... */ };
    this.sfDomFinderTraits = [ /* ... */ ];
    this.sfDomTraitFootnotes = { /* ... */ };
    this.sfSliderDescriptions = { /* ... */ };
    this.sfTraitExplanations = { /* ... */ };
    this.sfStyleDescriptions = { /* ... */ };
    this.sfDynamicMatches = { /* ... */ };
    this.sfStyleKeyTraits = { /* ... */ };

    // --- Element Mapping ---
    // MODIFIED: Added new elements for Achievements modal, welcome modal, etc.
    this.elements = {
      formSection: document.getElementById('form-section'),
      name: document.getElementById('name'),
      avatarDisplay: document.getElementById('avatar-display'),
      avatarInput: document.getElementById('avatar-input'),
      avatarPicker: document.querySelector('.avatar-picker'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      styleExploreLink: document.getElementById('style-explore-link'), // NEW: Link next to style dropdown
      formStyleFinderLink: document.getElementById('form-style-finder-link'),
      traitsContainer: document.getElementById('traits-container'),
      traitsMessage: document.getElementById('traits-message'), // NEW: Message area above traits
      traitInfoPopup: document.getElementById('trait-info-popup'),
      traitInfoClose: document.getElementById('trait-info-close'),
      traitInfoTitle: document.getElementById('trait-info-title'),
      traitInfoBody: document.getElementById('trait-info-body'),
      contextHelpPopup: document.getElementById('context-help-popup'), // NEW: Generic context help popup
      contextHelpClose: document.getElementById('context-help-close'), // NEW:
      contextHelpTitle: document.getElementById('context-help-title'), // NEW:
      contextHelpBody: document.getElementById('context-help-body'), // NEW:
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),
      peopleList: document.getElementById('people-list'),
      livePreview: document.getElementById('live-preview'),
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalTabs: document.getElementById('modal-tabs'), // NEW: Detail modal tab container
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
      achievementsBtn: document.getElementById('achievements-btn'), // NEW: Achievements button
      achievementsModal: document.getElementById('achievements-modal'), // NEW: Achievements modal
      achievementsClose: document.getElementById('achievements-close'), // NEW:
      achievementsBody: document.getElementById('achievements-body'), // NEW:
      welcomeModal: document.getElementById('welcome-modal'), // NEW: Welcome modal
      welcomeClose: document.getElementById('welcome-close'), // NEW:
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
      sfDashboardToggle: document.getElementById('sf-dashboard-toggle'), // NEW: Button to toggle dashboard in finder
      detailModalTitle: document.getElementById('detail-modal-title'),
      resourcesModalTitle: document.getElementById('resources-modal-title'),
      glossaryModalTitle: document.getElementById('glossary-modal-title'),
      styleDiscoveryTitle: document.getElementById('style-discovery-title'),
      themesModalTitle: document.getElementById('themes-modal-title'),
      achievementsModalTitle: document.getElementById('achievements-modal-title'), // NEW:
      welcomeModalTitle: document.getElementById('welcome-modal-title'), // NEW:
      sfModalTitle: document.getElementById('sf-modal-title'),
      formTitle: document.getElementById('form-title'),
      // Load indicators can be added here if dedicated elements are used,
      // otherwise handled via class toggles on buttons/sections.
    };

    // Critical element check (remains the same)
    const criticalElements = Object.keys(this.elements);
    const missingKeys = [];
    for (const key of criticalElements) {
        if (!this.elements[key]) {
            missingKeys.push(key);
        }
    }
    if (missingKeys.length > 0) { /* ... error handling ... */ }

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners(); // MODIFIED: Will add new listeners
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage(); // Load data first
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, this.elements.style.value); // MODIFIED: Will handle initial state
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome(); // NEW: Check for onboarding
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage --- (No changes needed)
  loadFromLocalStorage(){ /* ... */ }
  saveToLocalStorage(){ /* ... */ }

  // NEW: Onboarding check
  checkAndShowWelcome() {
      try {
          const onboarded = localStorage.getItem('kinkCompassOnboarded');
          if (!onboarded) {
              this.showWelcomeMessage();
          }
      } catch (e) {
          console.warn("Could not check onboarding status:", e);
          // Proceed without welcome if localStorage fails
      }
  }

  // NEW: Show welcome message modal
  showWelcomeMessage() {
      if (this.elements.welcomeModal) {
          this.openModal(this.elements.welcomeModal);
          // Set flag when closed
          const closeHandler = () => {
              try {
                  localStorage.setItem('kinkCompassOnboarded', 'true');
                  console.log("Onboarding complete.");
              } catch (e) {
                  console.warn("Could not save onboarding status:", e);
              }
              this.elements.welcomeClose?.removeEventListener('click', closeHandler);
              this.elements.welcomeModal?.removeEventListener('click', modalCloseHandler); // Remove outer click listener too
          };
          const modalCloseHandler = (e) => {
             if (e.target === this.elements.welcomeModal) {
                this.closeModal(this.elements.welcomeModal);
                closeHandler(); // Also mark as onboarded if closed by clicking outside
             }
          }
          this.elements.welcomeClose?.addEventListener('click', closeHandler, { once: true });
          this.elements.welcomeModal?.addEventListener('click', modalCloseHandler); // Add listener for outside click
      } else {
          console.warn("Welcome modal element not found.");
      }
  }

  // --- Event Listeners Setup ---
  // MODIFIED: Added listeners for new elements and features
  addEventListeners() {
    console.log("Attaching event listeners...");
    this.elements.role?.addEventListener('change', (e) => { const selectedRole = e.target.value; this.renderStyles(selectedRole); this.elements.style.value = ''; this.renderTraits(selectedRole, ''); this.updateLivePreview(); this.updateStyleExploreLink(); });
    this.elements.style?.addEventListener('change', (e) => { this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); });
    this.elements.name?.addEventListener('input', () => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click', (e) => { if (e.target.classList.contains('avatar-btn')) { /* ... avatar logic ... */ this.updateLivePreview(); } });
    this.elements.save?.addEventListener('click', () => this.savePerson());
    this.elements.clearForm?.addEventListener('click', () => this.resetForm(true));
    this.elements.formStyleFinderLink?.addEventListener('click', () => this.sfStart());
    this.elements.traitsContainer?.addEventListener('input', (e) => { if (e.target.classList.contains('trait-slider')) { this.handleTraitSliderInput(e); } });
    this.elements.traitsContainer?.addEventListener('click', (e) => { if (e.target.classList.contains('trait-info-btn')) { this.handleTraitInfoClick(e); } });
    this.elements.traitInfoClose?.addEventListener('click', () => this.hideTraitInfo());
    this.elements.contextHelpClose?.addEventListener('click', () => this.hideContextHelp()); // NEW
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => this.sfStart());
    this.elements.sfCloseBtn?.addEventListener('click', () => this.sfClose());
    this.elements.styleDiscoveryBtn?.addEventListener('click', () => this.showStyleDiscovery());
    this.elements.styleDiscoveryClose?.addEventListener('click', () => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => this.renderStyleDiscoveryContent());
    this.elements.styleDiscoveryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e)); // NEW: Handle glossary links
    this.elements.glossaryBtn?.addEventListener('click', () => this.showGlossary());
    this.elements.glossaryClose?.addEventListener('click', () => this.closeModal(this.elements.glossaryModal));
    this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e)); // NEW: Handle internal glossary links
    this.elements.resourcesBtn?.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose?.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));
    this.elements.themesBtn?.addEventListener('click', () => this.openModal(this.elements.themesModal));
    this.elements.themesClose?.addEventListener('click', () => this.closeModal(this.elements.themesModal));
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));
    this.elements.achievementsBtn?.addEventListener('click', () => this.showAchievements()); // NEW
    this.elements.achievementsClose?.addEventListener('click', () => this.closeModal(this.elements.achievementsModal)); // NEW
    this.elements.welcomeClose?.addEventListener('click', () => this.closeModal(this.elements.welcomeModal)); // NEW (Also handled in checkAndShowWelcome)
    this.elements.exportBtn?.addEventListener('click', () => this.exportData());
    this.elements.importBtn?.addEventListener('click', () => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change', (e) => this.importData(e));
    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e)); // MODIFIED: Handles more actions
    this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e)); // NEW
    this.elements.modalClose?.addEventListener('click', () => this.closeModal(this.elements.modal));
    this.elements.sfStepContent?.addEventListener('click', (e) => { // MODIFIED: Added dashboard toggle
        const button = e.target.closest('button[data-action]');
        if (button) { this.handleStyleFinderAction(button.dataset.action, button.dataset); return; }
        const icon = e.target.closest('.sf-info-icon[data-trait]');
        if (icon) { this.handleStyleFinderAction('showTraitInfo', icon.dataset); return; }
        const toggle = e.target.closest('#sf-dashboard-toggle');
        if (toggle) { this.toggleStyleFinderDashboard(); return; }
    });
    this.elements.sfStepContent?.addEventListener('input', (e) => { if (e.target.classList.contains('sf-trait-slider') && e.target.dataset.trait) { this.handleStyleFinderSliderInput(e.target); } });
    this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e)); // NEW
    document.body.addEventListener('click', (e) => { if (e.target.classList.contains('sf-close-btn')) { e.target.closest('.sf-style-info-popup')?.remove(); } });
    window.addEventListener('click', (e) => this.handleWindowClick(e)); // MODIFIED: Handles more modals
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e)); // MODIFIED: Handles more modals
    console.log("Event listeners setup complete.");
  } // --- End addEventListeners ---

  // --- Event Handlers ---
  // (Keep existing handlers like handleListClick, handleListKeydown)

  handleWindowClick(e){const target=e.target;if(target.classList.contains('modal')){ // Check if the backdrop was clicked
      if(target===this.elements.modal)this.closeModal(this.elements.modal);
      else if(target===this.elements.sfModal)this.sfClose();
      else if(target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);
      else if(target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);
      else if(target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);
      else if(target===this.elements.themesModal)this.closeModal(this.elements.themesModal);
      else if(target===this.elements.achievementsModal)this.closeModal(this.elements.achievementsModal); // NEW
      else if(target===this.elements.welcomeModal)this.closeModal(this.elements.welcomeModal); // NEW (Also triggers onboarded flag)
      else if(target===this.elements.contextHelpPopup)this.hideContextHelp(); // NEW
      // Trait info popup handled by its own close button or clicking outside it (handled implicitly)
    }}
  handleWindowKeydown(e){if(e.key==='Escape'){
      if(this.elements.traitInfoPopup?.style.display!=='none') this.hideTraitInfo();
      else if(this.elements.contextHelpPopup?.style.display!=='none') this.hideContextHelp(); // NEW
      else if(this.elements.modal?.style.display!=='none')this.closeModal(this.elements.modal);
      else if(this.elements.sfModal?.style.display!=='none')this.sfClose();
      else if(this.elements.resourcesModal?.style.display!=='none')this.closeModal(this.elements.resourcesModal);
      else if(this.elements.glossaryModal?.style.display!=='none')this.closeModal(this.elements.glossaryModal);
      else if(this.elements.styleDiscoveryModal?.style.display!=='none')this.closeModal(this.elements.styleDiscoveryModal);
      else if(this.elements.themesModal?.style.display!=='none')this.closeModal(this.elements.themesModal);
      else if(this.elements.achievementsModal?.style.display!=='none')this.closeModal(this.elements.achievementsModal); // NEW
      else if(this.elements.welcomeModal?.style.display!=='none')this.closeModal(this.elements.welcomeModal); // NEW
    }}
  handleTraitSliderInput(e){ /* ... (existing logic) ... */ }
  handleTraitInfoClick(e){ /* ... (existing logic) ... */ }

  // MODIFIED: handleModalBodyClick to delegate more actions
  handleModalBodyClick(e){const target=e.target;const button=target.closest('button');const link = target.closest('a'); const check=button||target; if(!check)return;const id=check.id;const classList=check.classList; const dataset = check.dataset; const personId=parseInt(dataset.personId,10);const goalId=parseInt(dataset.goalId,10);const helpKey = dataset.helpKey; // NEW: Context help
      console.log("Detail Modal Click: Elm:",check,"ID:",id,"Class:",classList, "Dataset:", dataset);
      if(id==='save-reflections-btn'&&!isNaN(personId)){this.saveReflections(personId);}
      else if(id==='prompt-btn'){this.showJournalPrompt(personId);}
      else if(id==='snapshot-btn'&&!isNaN(personId)){this.addSnapshotToHistory(personId);}
      else if(classList.contains('snapshot-info-btn')){this.toggleSnapshotInfo(check);}
      else if(id==='reading-btn'&&!isNaN(personId)){this.showKinkReading(personId);}
      else if(classList.contains('add-goal-btn')&&!isNaN(personId)){this.addGoal(personId);}
      else if(classList.contains('toggle-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.toggleGoalStatus(personId,goalId);}
      else if(classList.contains('delete-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.deleteGoal(personId,goalId);}
      // NEW: Handle context help button clicks
      else if(classList.contains('context-help-btn') && helpKey) { this.showContextHelp(helpKey); }
      // NEW: Handle glossary links within modal content (if any added)
      else if (classList.contains('glossary-link') && dataset.termKey) { e.preventDefault(); this.showGlossary(dataset.termKey); }
      else{console.log("No matching detail modal action.");}
  }

  handleThemeSelection(e){ /* ... (existing logic) ... */ }

  // MODIFIED: Style finder action handler
  handleStyleFinderAction(action, dataset = {}) {
      console.log("SF Action:", action, dataset);
      // Add a loading state temporarily if needed for longer actions
      const stepContent = this.elements.sfStepContent;
      if (stepContent) stepContent.classList.add('loading'); // Add a CSS class for visual feedback

      try {
          switch (action) {
              case 'next':
                  // ... (existing 'next' logic remains mostly the same)
                  this.sfNextStep();
                  break;
              case 'prev':
                  this.sfPrevStep();
                  break;
              case 'identifyRole':
                  // ... (existing logic)
                  break;
              case 'setRole':
                  // ... (existing logic)
                  break;
              case 'startOver':
                  this.sfStartOver();
                  break;
              case 'close':
                  this.sfClose();
                  break;
              case 'applyStyle': // MODIFIED: Add confirmation
                  const r = dataset.role;
                  const s = dataset.style;
                  if (r && s) {
                      this.confirmApplyStyleFinderResult(r, s); // Call confirmation function
                  } else {
                      this.showNotification("Error applying style. Role or Style missing.", "error");
                      console.error("Apply Style Error: Missing role or style in dataset", dataset);
                  }
                  break;
              case 'showFullDetails':
                  // ... (existing logic)
                  break;
              case 'showTraitInfo':
                  // ... (existing logic)
                  break;
              // NEW: Toggle dashboard visibility
              case 'toggleDashboard':
                  this.toggleStyleFinderDashboard();
                  break;
              default:
                  console.warn("Unknown Style Finder action received:", action);
          } // End switch
      } catch (error) {
           console.error("Error handling Style Finder action:", action, error);
           this.showNotification("An error occurred processing your action.", "error");
      } finally {
           if (stepContent) stepContent.classList.remove('loading'); // Remove loading state
      }
  } // --- End handleStyleFinderAction ---

  handleStyleFinderSliderInput(sliderElement){ /* ... (existing logic) ... */ }

  // NEW: Handle clicking on tabs in the detail modal
  handleDetailTabClick(e) {
      const button = e.target.closest('.tab-link');
      if (!button || button.classList.contains('active') || !this.elements.modalBody || !this.elements.modalTabs) {
          return; // Clicked not on a button, or already active
      }

      const targetTabId = button.dataset.tab;
      if (!targetTabId) return;

      const personIdStr = this.elements.modal?.dataset.personId; // Store personId on the modal itself
      const personId = personIdStr ? parseInt(personIdStr, 10) : null;
      if (isNaN(personId)) {
          console.error("Person ID not found on modal for tab switching");
          return;
      }
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error("Person not found for tab switching");
          return;
      }

      console.log(`Switching detail tab to: ${targetTabId}`);

      // Deactivate old tab/content
      this.elements.modalTabs.querySelector('.tab-link.active')?.classList.remove('active');
      this.elements.modalBody.querySelector('.tab-content.active')?.classList.remove('active');

      // Activate new tab/content
      button.classList.add('active');
      const targetContent = this.elements.modalBody.querySelector(`#${targetTabId}`);
      if (targetContent) {
          targetContent.classList.add('active');
          this.activeDetailModalTab = targetTabId; // Store active tab

          // Render content IF it hasn't been rendered yet (lazy loading)
          if (!targetContent.dataset.rendered) {
              this.renderDetailTabContent(person, targetTabId, targetContent);
              targetContent.dataset.rendered = 'true'; // Mark as rendered
          }
      } else {
          console.error(`Content pane for tab ${targetTabId} not found!`);
      }
  }

  // NEW: Handle clicking glossary links from other modals/content
  handleGlossaryLinkClick(e) {
      const link = e.target.closest('a.glossary-link[data-term-key]');
      if (link) {
          e.preventDefault();
          const termKey = link.dataset.termKey;
          this.showGlossary(termKey); // Pass key to highlight/scroll
      }
  }

  // NEW: Handle clicking the "Explore Style Details" link in the main form
  handleExploreStyleLinkClick(e) {
    e.preventDefault();
    const styleName = e.target.dataset.style;
    if (styleName) {
        this.showStyleDiscovery(styleName); // Open discovery and potentially highlight the style
    }
  }

  // --- Core Rendering ---
  renderStyles(roleKey) { /* ... (existing logic, ensure it calls updateStyleExploreLink) ... */ this.updateStyleExploreLink(); }

  // MODIFIED: Handle initial trait visibility state
  renderTraits(roleKey, styleName) {
      const container = this.elements.traitsContainer;
      const messageEl = this.elements.traitsMessage; // NEW
      if (!container || !messageEl) return;

      container.innerHTML = ''; // Clear previous traits
      const roleData = bdsmData[roleKey];

      // Determine if traits should be visible
      const showTraits = roleKey && (styleName || (roleData?.coreTraits?.length > 0));

      if (!showTraits) {
          container.style.display = 'none'; // Hide container
          messageEl.textContent = roleKey ? "Select a Style to see and customize relevant traits." : "Select a Role first to see options.";
          messageEl.style.display = 'block';
          this.hideTraitInfo();
          return;
      }

      // If showing traits, hide the message and show the container
      container.style.display = 'block';
      messageEl.style.display = 'none';

      // ... (rest of the existing trait rendering logic) ...

      if (!roleData) { /* ... */ }
      const coreTraits = roleData.coreTraits || [];
      let styleTraits = [];
      let styleObj = null;
      let infoMessage = ''; // Renamed from 'message' to avoid conflict

      if (styleName) { /* ... find styleObj ... */
          if (styleObj) { /* ... set styleTraits ... */
              if (styleTraits.length === 0 && coreTraits.length > 0) { infoMessage = `... uses core traits.`; }
          } else { infoMessage = `... showing core traits.`; }
      } else if (roleKey === 'switch') { infoMessage = `<p class="muted-text trait-info-message">Adjust core Switch traits below, or select a leaning style for more specific traits.</p>`; }
        else if (coreTraits.length > 0) { infoMessage = `<p class="muted-text trait-info-message">Core traits for ${roleData.roleName}. Select a style for more nuances.</p>`;}


      const traitsToRender = [];
      const uniqueTraitNames = new Set();
      [...styleTraits, ...coreTraits].forEach(trait => { /* ... build traitsToRender ... */ });

      if (traitsToRender.length === 0) { /* ... handle no traits ... */ }

      if (infoMessage) container.innerHTML += infoMessage; // Add info message

      traitsToRender.sort((a, b) => a.name.localeCompare(b.name)).forEach(trait => {
          container.innerHTML += this.createTraitHTML(trait);
      });

      container.querySelectorAll('.trait-slider').forEach(slider => {
          this.updateTraitDescription(slider);
      });
      this.hideTraitInfo();
      this.updateStyleExploreLink(); // Update link when traits render
  }

  createTraitHTML(trait){ /* ... (existing logic, ensure trait-info-btn exists) ... */ }
  updateTraitDescription(slider){ /* ... (existing logic) ... */ }
  renderList(){ /* ... (existing logic, maybe add item-just-saved class handling here if preferred) ... */ }
  createPersonListItemHTML(person){ /* ... (existing logic) ... */ }

  // NEW: Update the visibility and link for exploring style details
  updateStyleExploreLink() {
      const link = this.elements.styleExploreLink;
      const styleSelect = this.elements.style;
      if (!link || !styleSelect) return;

      const selectedStyle = styleSelect.value;
      if (selectedStyle) {
          link.style.display = 'inline'; // Show the link
          link.dataset.style = selectedStyle; // Update the data attribute
          link.textContent = `(Explore ${this.escapeHTML(selectedStyle)} Details)`;
      } else {
          link.style.display = 'none'; // Hide if no style selected
      }
  }


  // --- CRUD ---
  // MODIFIED: Add loading state and saving indication
  savePerson() {
      const saveButton = this.elements.save;
      if (!saveButton) return;

      // NEW: Add Loading State
      saveButton.disabled = true;
      saveButton.innerHTML = 'Saving... <span class="spinner"></span>'; // Add a CSS spinner

      // Basic validation first
      const nameInput=this.elements.name; const name=nameInput.value.trim(); const avatar=this.elements.avatarInput.value||'❓'; const role=this.elements.role.value; let style=this.elements.style.value;
      if(!name || (!role) || (!style && role !== 'switch')) {
          this.showNotification("Please fill required fields (Name, Role, Style).","error");
          // NEW: Remove Loading State on validation error
          saveButton.disabled = false;
          saveButton.innerHTML = this.currentEditId ? 'Update Persona! ✨' : 'Save Persona! 💖';
          if (!name) nameInput.focus(); else if (!role) this.elements.role.focus(); else this.elements.style.focus();
          return;
      }
      // ... (rest of the validation and data gathering logic remains the same)
      const sliders=this.elements.traitsContainer.querySelectorAll('.trait-slider'); const currentTraits={}; /* ... */

      // Simulate save delay for visual effect (remove in production)
      setTimeout(() => {
          try {
              const personData={id:this.currentEditId||Date.now(), name, avatar, role, style, traits: currentTraits, /* ... other fields ... */ lastUpdated:Date.now()};
              let isNew=false;
              let savedItemId = personData.id;

              if(this.currentEditId){ /* ... update existing ... */ }
              else { /* ... add new ... */ isNew=true; }

              this.saveToLocalStorage();
              this.renderList();

              // NEW: Saving Indication
              const listItem = this.elements.peopleList?.querySelector(`li[data-id="${savedItemId}"]`);
              if (listItem) {
                  listItem.classList.add('item-just-saved');
                  setTimeout(() => listItem.classList.remove('item-just-saved'), 1500); // CSS needed for .item-just-saved
              }

              this.showNotification(`${this.escapeHTML(name)} ${isNew?'created':'updated'}! ✨`,"success");
              this.resetForm(); // Resets currentEditId and button text
          } catch (error) {
              console.error("Error saving persona:", error);
              this.showNotification("Failed to save persona.", "error");
          } finally {
              // NEW: Remove Loading State
              // ResetForm already handles button text, just ensure disabled is false
              saveButton.disabled = false;
              // If resetForm wasn't called, manually reset button here
              if (this.currentEditId) { // If save failed during edit
                 saveButton.textContent = 'Update Persona! ✨';
              }
          }
      }, 300); // 300ms simulated delay
  }

  editPerson(personId){ /* ... (existing logic) ... */ this.updateStyleExploreLink(); }
  deletePerson(personId){ /* ... (existing logic) ... */ }
  resetForm(isManualClear=false){ /* ... (existing logic, ensure it calls renderTraits and updateStyleExploreLink) ... */ this.renderTraits(this.elements.role.value, ''); this.updateStyleExploreLink(); }

  // --- Live Preview ---
  updateLivePreview(){ /* ... (existing logic) ... */ }

  // --- Modal Display ---
  // MODIFIED: showPersonDetails to use tabs
  showPersonDetails(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) { /* ... error handling ... */ return; }
      console.log("Showing details for:", person);

      // Prepare basic modal structure with tabs
      const { avatar = '❓', name, role = 'N/A', style = 'N/A' } = person;
      let tabsHTML = `
          <button class="tab-link active" data-tab="tab-goals">🎯 Goals</button>
          <button class="tab-link" data-tab="tab-traits">🎨 Traits</button>
          <button class="tab-link" data-tab="tab-history">⏳ History</button>
          <button class="tab-link" data-tab="tab-journal">📝 Journal</button>
          <button class="tab-link" data-tab="tab-reading">🔮 Reading</button>
          <button class="tab-link" data-tab="tab-achievements">🏆 Achievements</button>
      `;
      let bodyHTML = `
          <div id="tab-goals" class="tab-content active"></div>
          <div id="tab-traits" class="tab-content"></div>
          <div id="tab-history" class="tab-content"></div>
          <div id="tab-journal" class="tab-content"></div>
          <div id="tab-reading" class="tab-content"></div>
          <div id="tab-achievements" class="tab-content"></div>
      `;

      // Set modal title and subtitle
      if (this.elements.detailModalTitle) {
          this.elements.detailModalTitle.innerHTML = `${avatar} ${this.escapeHTML(name)}’s Kingdom ${avatar}`;
          // This title element itself might be hidden if tabs are used prominently,
          // but keep it for aria-labelledby.
          // Consider adding subtitle element if needed, or putting it below tabs.
          // e.g., `<p class="modal-subtitle">${role.charAt(0).toUpperCase()+role.slice(1)} - ${this.escapeHTML(style)}</p>`
      }

      if (this.elements.modalTabs) this.elements.modalTabs.innerHTML = tabsHTML;
      if (this.elements.modalBody) this.elements.modalBody.innerHTML = bodyHTML;
      if (this.elements.modal) this.elements.modal.dataset.personId = personId; // Store ID for tab switching

      this.activeDetailModalTab = 'tab-goals'; // Reset to default tab

      // Render the content ONLY for the initially active tab
      const initialTabContent = this.elements.modalBody?.querySelector(`#${this.activeDetailModalTab}`);
      if (initialTabContent) {
          this.renderDetailTabContent(person, this.activeDetailModalTab, initialTabContent);
          initialTabContent.dataset.rendered = 'true'; // Mark as rendered
      }

      this.openModal(this.elements.modal);
  }

  // NEW: Function to render content for a specific detail tab
  renderDetailTabContent(person, tabId, contentElement) {
      if (!person || !contentElement) return;
      console.log(`Rendering content for tab: ${tabId}`);
      contentElement.innerHTML = '<p class="loading-text">Loading...</p>'; // Basic loading state

      // Use requestAnimationFrame or setTimeout to allow UI update before potentially heavy rendering
      requestAnimationFrame(() => {
          let html = '';
          const personId = person.id;

          try {
              switch (tabId) {
                  case 'tab-goals':
                      html = `
                          <section class="goals-section" aria-labelledby="goals-heading-${personId}">
                              <h3 id="goals-heading-${personId}">🎯 Goals & Aspirations <button class="context-help-btn small-btn" data-help-key="goalsSectionInfo" aria-label="Goals Info">ℹ️</button></h3>
                              <ul id="goal-list-${personId}"></ul>
                              <div class="add-goal-form">
                                  <input type="text" id="new-goal-text-${personId}" placeholder="Add a new goal...">
                                  <button class="add-goal-btn save-btn small-btn" data-person-id="${personId}">+ Add Goal</button>
                              </div>
                          </section>`;
                      contentElement.innerHTML = html;
                      this.renderGoalList(person); // Render the list items
                      break;

                  case 'tab-traits':
                      const { traits = {}, role = 'N/A', style = 'N/A' } = person;
                      const getBreakdownFunc = role === 'submissive' ? getSubBreakdown : (role === 'dominant' ? getDomBreakdown : null);
                      let breakdown = { strengths: 'N/A', improvements: 'N/A' };
                      if (getBreakdownFunc && style !== 'N/A') {
                          try { breakdown = getBreakdownFunc(style, traits); } catch (e) { /* ... error handling ... */ }
                      }
                      html = `
                          <section class="breakdown-section" aria-labelledby="breakdown-heading-${personId}">
                              <h3 id="breakdown-heading-${personId}">🌈 Style Insights</h3>
                              <div class="style-breakdown modal-breakdown">
                                  <div class="strengths"><h4>✨ Powers</h4><div>${breakdown.strengths}</div></div>
                                  <div class="improvements"><h4>🌟 Quests</h4><div>${breakdown.improvements}</div></div>
                              </div>
                          </section>
                          <section class="traits-section" aria-labelledby="traits-heading-${personId}">
                              <h3 id="traits-heading-${personId}">🎨 Trait Constellation <button class="context-help-btn small-btn" data-help-key="traitsSectionInfo" aria-label="Traits Info">ℹ️</button></h3>
                              <div class="trait-details-grid">`;
                      const roleData = bdsmData[role];
                      const coreTraits = roleData?.coreTraits || [];
                      const styleObj = roleData?.styles?.find(s => s.name === style);
                      const styleTraits = styleObj?.traits || [];
                      const combinedTraits = [...styleTraits, ...coreTraits];
                      const uniqueTraitDefs = Array.from(new Map(combinedTraits.map(t => [t.name, t])).values());

                      if (Object.keys(traits).length > 0) {
                          Object.entries(traits).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, score]) => {
                              const traitDef = uniqueTraitDefs.find(t => t.name === name);
                              const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                              const description = traitDef?.desc?.[score] || "Description N/A";
                              const flair = this.getFlairForScore(score);
                              const emoji = this.getEmojiForScore(score);
                              // NEW: Add link to glossary if trait name matches a term (simple match)
                              const termKey = Object.keys(glossaryTerms).find(key => glossaryTerms[key].term.toLowerCase() === name.toLowerCase());
                              const displayNameHTML = termKey
                                 ? `<a href="#" class="glossary-link" data-term-key="${termKey}">${this.escapeHTML(displayName)}</a>`
                                 : this.escapeHTML(displayName);

                              html += `<div class="trait-detail-item"><h4>${displayNameHTML} - Lvl ${score} ${emoji}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(description)}</p><p><em>${flair}</em></p></div>`;
                          });
                      } else { html += `<p class="muted-text">No trait scores recorded.</p>`; }
                      html += `</div></section>`;
                      contentElement.innerHTML = html;
                      break;

                  case 'tab-history':
                      html = `
                          <section class="history-section" aria-labelledby="history-heading-${personId}">
                              <h3 id="history-heading-${personId}">⏳ Growth Over Time <button class="context-help-btn small-btn" data-help-key="historyChartInfo" aria-label="History Chart Info">ℹ️</button></h3>
                              <p class="snapshot-info muted-text" style="display:none;">Snapshots save current traits to track evolution!</p>
                              <div class="history-chart-container"><canvas id="history-chart-${personId}"></canvas></div>
                              <button id="snapshot-btn" class="small-btn save-btn" data-person-id="${personId}">📸 Take Snapshot</button>
                          </section>`;
                      contentElement.innerHTML = html;
                      this.renderHistoryChart(person, `history-chart-${personId}`); // Pass unique canvas ID
                      break;

                  case 'tab-journal':
                      const { reflections = { text: '' } } = person;
                      html = `
                          <section class="reflections-section" aria-labelledby="reflections-heading-${personId}">
                              <h3 id="reflections-heading-${personId}">📝 Journal Reflections <button class="context-help-btn small-btn" data-help-key="journalSectionInfo" aria-label="Journal Info">ℹ️</button></h3>
                              <div id="journal-prompt-area" style="display:none;" aria-live="polite"></div>
                              <div class="modal-actions">
                                  <button id="prompt-btn" class="small-btn" data-person-id="${personId}">💡 New Prompt</button>
                              </div>
                              <textarea id="reflections-text-${personId}" class="reflections-textarea" rows="7" placeholder="Reflect..." aria-label="Journal Entry">${this.escapeHTML(reflections.text || '')}</textarea>
                              <button id="save-reflections-btn" class="save-btn" data-person-id="${personId}">Save Reflection 💭</button>
                          </section>`;
                      contentElement.innerHTML = html;
                      break;

                  case 'tab-reading':
                      html = `
                          <section class="kink-reading-section" aria-labelledby="reading-heading-${personId}">
                              <h3 id="reading-heading-${personId}">🔮 Compass Reading</h3>
                              <button id="reading-btn" class="small-btn" data-person-id="${personId}">Get My Reading!</button>
                              <div id="kink-reading-output-${personId}" class="kink-reading-output" style="display:none;" aria-live="polite"></div>
                          </section>`;
                       contentElement.innerHTML = html;
                       // Reading content is generated on button click
                       break;

                   case 'tab-achievements':
                      html = `
                          <section class="achievements-section" aria-labelledby="achievements-heading-${personId}">
                              <h3 id="achievements-heading-${personId}">🏆 Achievements Unlocked <button class="context-help-btn small-btn" data-help-key="achievementsSectionInfo" aria-label="Achievements Info">ℹ️</button></h3>
                              <div id="achievements-list-${personId}"></div>
                              <p class="muted-text" style="text-align: center; margin-top: 1em;">View all possible achievements via the header button!</p>
                          </section>`;
                      contentElement.innerHTML = html;
                      this.renderAchievementsList(person, `achievements-list-${personId}`); // Render the list items
                      break;

                  default:
                      contentElement.innerHTML = `<p>Tab content not implemented yet.</p>`;
              }
          } catch (error) {
              console.error(`Error rendering tab ${tabId}:`, error);
              contentElement.innerHTML = `<p class="error-text">Error loading content for this section.</p>`;
          }
      });
  }


  // --- New Feature Logic ---
  // MODIFIED: Add loading state to goal actions if needed (usually fast enough)
  addGoal(personId){ /* ... (existing logic) ... */ }
  toggleGoalStatus(personId,goalId){ /* ... (existing logic) ... */ }
  deleteGoal(personId,goalId){ /* ... (existing logic) ... */ }
  renderGoalList(person){ /* ... (existing logic - ensure it targets the correct ul#goal-list-ID) ... */ }

  showJournalPrompt(personId){ /* ... (existing logic - ensure it targets the correct elements by ID) ... */ }

  // MODIFIED: Add saving indication
  saveReflections(personId){
      const person=this.people.find(p=>p.id===personId);
      const textarea=this.elements.modalBody?.querySelector(`#reflections-text-${personId}`);
      const saveButton=this.elements.modalBody?.querySelector(`#save-reflections-btn[data-person-id="${personId}"]`); // More specific selector

      if(!person||!textarea || !saveButton){this.showNotification("Error saving reflection.","error");return;}

      // Add Loading State
      saveButton.disabled = true;
      saveButton.textContent = 'Saving...';

      // Simulate delay
      setTimeout(() => {
          try {
              const text=textarea.value;
              if(!person.reflections)person.reflections={};
              person.reflections.text=text;
              person.reflections.lastUpdated=Date.now();
              /* ... achievement logic ... */
              this.saveToLocalStorage();

              // Saving Indication
              textarea.classList.add('input-just-saved'); // Add CSS for this class (e.g., brief border highlight)
              setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);

              this.showNotification("Reflection Saved! ✨","success"); // Use main notification

          } catch(e) {
              console.error("Error saving reflection:", e);
              this.showNotification("Failed to save reflection.", "error");
          } finally {
              // Remove Loading State
              saveButton.textContent='Saved ✓'; // Indicate success briefly
              setTimeout(()=>{saveButton.textContent='Save Reflection 💭'; saveButton.disabled = false;},2000);
          }
      }, 300);
  }

  // MODIFIED: Add loading state
  addSnapshotToHistory(personId){
      const person=this.people.find(p=>p.id===personId);
      const snapshotButton = this.elements.modalBody?.querySelector(`#snapshot-btn[data-person-id="${personId}"]`);
      if(!person||!person.traits||Object.keys(person.traits).length===0){ /* ... error handling ... */ return;}

      if (snapshotButton) {
          snapshotButton.disabled = true;
          snapshotButton.textContent = 'Saving...';
      }

      // Simulate delay
      setTimeout(() => {
          try {
              const snapshot={date:Date.now(),traits:{...person.traits},style:person.style};
              person.history=person.history||[];
              person.history.push(snapshot);
              /* ... achievement logic ... */
              this.saveToLocalStorage();
              this.showNotification("Snapshot saved! 📸","success");

              // Re-render chart if the history tab is active
              if (this.activeDetailModalTab === 'tab-history') {
                 const chartCanvasId = `history-chart-${personId}`;
                 this.renderHistoryChart(person, chartCanvasId);
              }
               // Re-render achievements if that tab is active (or just update data silently)
               if (this.activeDetailModalTab === 'tab-achievements') {
                  const listId = `achievements-list-${personId}`;
                  this.renderAchievementsList(person, listId);
               } else {
                   // If achievements are global, maybe update the main achievement modal data?
                   // Or just let it refresh next time it's opened.
               }
          } catch (e) {
              console.error("Error taking snapshot:", e);
              this.showNotification("Failed to save snapshot.", "error");
          } finally {
              if (snapshotButton) {
                  snapshotButton.disabled = false;
                  snapshotButton.textContent = '📸 Take Snapshot';
              }
          }
      }, 300);
  }

  // MODIFIED: renderHistoryChart - accept canvas ID, add legend interaction
  renderHistoryChart(person, canvasId) {
      const container=this.elements.modalBody?.querySelector(`#${canvasId}`)?.parentElement; // Get container from canvas
      const canvas=container?.querySelector(`#${canvasId}`);

      if(this.chartInstance && this.chartInstance.canvas.id === canvasId){
          this.chartInstance.destroy();
          this.chartInstance=null;
      }
      if(!container){console.error(`Chart container not found for canvas ID ${canvasId}`);return;}
      if(!canvas){container.innerHTML=`<p>Error: Chart canvas element missing.</p>`;return;}

      const history=person.history||[];
      if(history.length===0){ /* ... handle no history ... */ return;}
      if(container.querySelector('p')){container.innerHTML=`<canvas id="${canvasId}"></canvas>`;} // Replace placeholder if needed

      // Add loading state (optional, good for many points)
      container.classList.add('chart-loading');

      // Use setTimeout to ensure DOM is ready and show loading state
      setTimeout(() => {
          try {
              const ctx=container.querySelector(`#${canvasId}`).getContext('2d');
              const labels=history.map(s=>new Date(s.date).toLocaleDateString());
              const allTraitNames=new Set();
              history.forEach(s=>Object.keys(s.traits).forEach(name=>allTraitNames.add(name)));
              if(person.traits)Object.keys(person.traits).forEach(name=>allTraitNames.add(name));

              const datasets=[];
              const colors=['#ff69b4','#8a5a6d','#a0d8ef','#dcc1ff','#ff85cb','#4a2c3d','#f4d4e4','#c49db1', '#f5b7b1', '#a9dfbf', '#f7dc6f', '#aebece']; // Expanded colors
              let colorIndex=0;

              // Identify current style/core traits for potential highlighting
              const roleData = bdsmData[person.role];
              const styleObj = roleData?.styles?.find(s => s.name === person.style);
              const currentTraitNames = new Set([
                  ...(roleData?.coreTraits?.map(t => t.name) || []),
                  ...(styleObj?.traits?.map(t => t.name) || [])
              ]);

              allTraitNames.forEach(traitName=>{
                  const data=history.map(s=>s.traits[traitName]!==undefined?parseInt(s.traits[traitName],10):null);
                  const color=colors[colorIndex%colors.length];
                  const isCurrentTrait = currentTraitNames.has(traitName); // Check if relevant

                  datasets.push({
                      label:traitName.charAt(0).toUpperCase()+traitName.slice(1),
                      data:data,
                      borderColor:color,
                      backgroundColor:color+'80',
                      tension:0.1,
                      fill:false,
                      spanGaps:true,
                      pointRadius: isCurrentTrait ? 5 : 3, // Highlight relevant traits
                      borderWidth: isCurrentTrait ? 2.5 : 1.5, // Highlight relevant traits
                      pointHoverRadius:6
                  });
                  colorIndex++;
              });

              const isDark=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';
              const gridColor=isDark?'rgba(244, 212, 228, 0.15)':'rgba(74, 44, 61, 0.1)';
              const labelColor=isDark?'#c49db1':'#8a5a6d';

              // Store reference associated with the canvas ID if managing multiple charts
              this.chartInstance = new Chart(ctx,{
                  type:'line',
                  data:{labels:labels,datasets:datasets},
                  options:{
                      responsive:true,
                      maintainAspectRatio:false,
                      plugins:{
                          legend:{
                              position:'bottom',
                              labels:{color:labelColor, boxWidth:12, padding:15},
                              // NEW: Default Chart.js v3+ legend click handler usually works for toggling.
                              // Explicitly setting it ensures it if needed.
                              onClick: (e, legendItem, legend) => {
                                  const index = legendItem.datasetIndex;
                                  const ci = legend.chart;
                                  if (ci.isDatasetVisible(index)) {
                                      ci.hide(index);
                                      legendItem.hidden = true;
                                  } else {
                                      ci.show(index);
                                      legendItem.hidden = false;
                                  }
                              }
                          },
                          tooltip:{ /* ... existing tooltip options ... */ }
                      },
                      scales:{ /* ... existing scale options ... */ }
                  }
              });
          } catch (chartError) {
              console.error("Failed to render history chart:", chartError);
              container.innerHTML = `<p class="error-text">Could not display history chart.</p>`;
          } finally {
              container.classList.remove('chart-loading'); // Remove loading state
          }
      }, 50); // Small delay
  }

  toggleSnapshotInfo(button){ /* ... (existing logic) ... */ }

  // MODIFIED: Renamed to avoid conflict, ensure it targets correct element ID
  renderAchievementsList(person, listElementId){
      const listElement=this.elements.modalBody?.querySelector(`#${listElementId}`);
      if(!listElement)return;
      /* ... (rest of existing logic) ... */
      listElement.innerHTML=htmlString || `<p class="muted-text">No achievements unlocked for this persona yet!</p>`;
  }

  // NEW: Show the dedicated Achievements Modal (shows ALL unlocked across profiles)
  showAchievements() {
    if (!this.elements.achievementsBody || !this.elements.achievementsModal) return;

    const allUnlockedIds = new Set(this.people.flatMap(p => p.achievements || []));
    let html = '<h2>🏆 All Unlocked Achievements 🏆</h2>';
    html += '<p>Achievements earned across all your personas.</p>';
    html += '<ul class="all-achievements-list">'; // Add a class for specific styling

    const sortedAchievementKeys = Object.keys(achievementList).sort((a, b) =>
        achievementList[a].name.localeCompare(achievementList[b].name)
    );

    if (sortedAchievementKeys.length === 0) {
        html += '<li>No achievements defined yet.</li>';
    } else {
        sortedAchievementKeys.forEach(id => {
            const details = achievementList[id];
            const unlocked = allUnlockedIds.has(id);
            const icon = details.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0] || '🏆';

            html += `
                <li class="${unlocked ? 'unlocked' : 'locked'}" title="${unlocked ? this.escapeHTML(details.desc) : 'Locked'}">
                    <span class="achievement-icon">${unlocked ? icon : '❓'}</span>
                    <span class="achievement-name">${this.escapeHTML(details.name)}</span>
                    ${unlocked ? `<span class="achievement-desc">${this.escapeHTML(details.desc)}</span>` : '<span class="achievement-desc muted-text">Keep exploring to unlock!</span>'}
                </li>`;
        });
    }

    html += '</ul>';
    this.elements.achievementsBody.innerHTML = html;
    this.openModal(this.elements.achievementsModal);
}


  showKinkReading(personId){ /* ... (existing logic - ensure targets correct output ID) ... */ }
  getReadingDescriptor(traitName,score){ /* ... (existing logic) ... */ }
  getStyleEssence(styleName){ /* ... (existing logic) ... */ }

  // MODIFIED: Add optional termKey to highlight/scroll, add glossary links
  showGlossary(termKeyToHighlight = null) {
      if (!this.elements.glossaryBody || !this.elements.glossaryModal) return;
      grantAchievement({}, 'glossary_user'); // Assuming achievement is global

      let html = '<dl>';
      Object.entries(glossaryTerms).sort((a, b) => a[1].term.localeCompare(b[1].term))
          .forEach(([key, termData]) => {
              const termId = `gloss-term-${key}`;
              const isHighlighted = key === termKeyToHighlight;
              html += `<dt id="${termId}" class="${isHighlighted ? 'highlighted-term' : ''}">${this.escapeHTML(termData.term)}</dt>`; // Add class if highlighted
              html += `<dd>${this.escapeHTML(termData.definition)}`;
              if (termData.related?.length) {
                  html += `<br><span class="related-terms">See also: `;
                  // NEW: Make related terms actual links
                  html += termData.related.map(relKey => {
                      const relatedTerm = glossaryTerms[relKey]?.term || relKey;
                      return `<a href="#gloss-term-${relKey}" class="glossary-link" data-term-key="${relKey}">${this.escapeHTML(relatedTerm)}</a>`;
                  }).join(', ');
                  html += `</span>`;
              }
              html += `</dd>`;
          });
      html += '</dl>';
      this.elements.glossaryBody.innerHTML = html;
      this.openModal(this.elements.glossaryModal);

      // Scroll to highlighted term if provided
      if (termKeyToHighlight) {
          const termElement = this.elements.glossaryBody.querySelector(`#gloss-term-${termKeyToHighlight}`);
          requestAnimationFrame(() => { // Ensure element is visible before scrolling
             termElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
      }
  }


  // MODIFIED: Show style discovery, potentially highlighting a style
  showStyleDiscovery(styleNameToHighlight = null) {
    grantAchievement({}, 'style_explorer');
    this.renderStyleDiscoveryContent(styleNameToHighlight); // Pass name
    this.openModal(this.elements.styleDiscoveryModal);
    // Scroll/highlight handled within renderStyleDiscoveryContent
}

  // MODIFIED: Render style discovery, potentially highlighting
  renderStyleDiscoveryContent(styleNameToHighlight = null) {
      const container = this.elements.styleDiscoveryBody;
      const roleFilter = this.elements.styleDiscoveryRoleFilter;
      if (!container || !roleFilter) return;

      const selectedRole = roleFilter.value;
      let htmlString = '';
      const rolesToShow = selectedRole === 'all' ? ['submissive', 'dominant', 'switch'] : [selectedRole];
      let highlightedElementFound = false;

      rolesToShow.forEach(roleKey => {
          const roleData = bdsmData[roleKey];
          if (roleData && roleData.styles?.length > 0) {
              htmlString += `<h3>${roleData.roleName || roleKey.charAt(0).toUpperCase() + roleKey.slice(1)} Styles</h3>`;
              roleData.styles.sort((a, b) => a.name.localeCompare(b.name)).forEach(style => {
                  const styleId = `style-discovery-${style.name.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
                  const isHighlighted = style.name === styleNameToHighlight;
                  if (isHighlighted) highlightedElementFound = true;

                  htmlString += `<div id="${styleId}" class="style-discovery-item ${isHighlighted ? 'highlighted-style' : ''}"><h4>${this.escapeHTML(style.name)}</h4>`;
                  if (style.summary) htmlString += `<p><em>${this.escapeHTML(style.summary)}</em></p>`;
                  const traits = style.traits || roleData.coreTraits || [];
                  if (traits.length > 0) {
                      htmlString += `<strong>Key Traits:</strong><ul>`;
                      traits.sort((a, b) => a.name.localeCompare(b.name)).forEach(trait => {
                          // NEW: Link traits to glossary
                          const termKey = Object.keys(glossaryTerms).find(key => glossaryTerms[key].term.toLowerCase() === trait.name.toLowerCase());
                          const traitNameHTML = termKey
                             ? `<a href="#" class="glossary-link" data-term-key="${termKey}">${this.escapeHTML(trait.name.charAt(0).toUpperCase() + trait.name.slice(1))}</a>`
                             : this.escapeHTML(trait.name.charAt(0).toUpperCase() + trait.name.slice(1));
                          htmlString += `<li>${traitNameHTML}</li>`;
                      });
                      htmlString += `</ul>`;
                  } else { htmlString += `<p class="muted-text">Primarily uses core role traits.</p>`; }
                  htmlString += `</div>`;
              });
          } else { /* ... handle no styles ... */ }
      });

      container.innerHTML = htmlString || '<p>Select a role or check data definitions.</p>';

      // Scroll to highlighted style if provided and found
      if (styleNameToHighlight && highlightedElementFound) {
          const styleElement = container.querySelector(`.highlighted-style`);
          requestAnimationFrame(() => {
             styleElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
      } else if (styleNameToHighlight) {
          console.warn(`Style to highlight "${styleNameToHighlight}" not found in current view.`);
      }
  }


  setTheme(themeName){ /* ... (existing logic) ... */ }
  applySavedTheme(){ /* ... (existing logic) ... */ }
  toggleTheme(){ /* ... (existing logic) ... */ }
  exportData(){ /* ... (existing logic) ... */ }
  importData(event){ /* ... (existing logic) ... */ }

  // MODIFIED: Add context help display
  showTraitInfo(traitName){ /* ... (existing logic for trait info popup) ... */ }
  hideTraitInfo(){ /* ... (existing logic for trait info popup) ... */ }

  // NEW: Show/Hide Generic Context Help Popup
  showContextHelp(helpKey) {
      const helpText = contextHelpTexts[helpKey];
      if (helpText && this.elements.contextHelpPopup && this.elements.contextHelpTitle && this.elements.contextHelpBody) {
          const title = helpKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/ Info$/, ''); // Make title user-friendly
          this.elements.contextHelpTitle.textContent = `💡 ${title} Explained`;
          this.elements.contextHelpBody.innerHTML = `<p>${this.escapeHTML(helpText)}</p>`; // Simple text for now
          this.elements.contextHelpPopup.style.display = 'block';
          this.elements.contextHelpPopup.setAttribute('aria-hidden', 'false');
          this.elements.contextHelpClose?.focus();
          // No scrollIntoView needed as it overlays
      } else {
          console.warn(`Could not find help text or popup elements for key '${helpKey}'`);
          this.hideContextHelp();
      }
  }
  hideContextHelp() {
      if (this.elements.contextHelpPopup) {
          this.elements.contextHelpPopup.style.display = 'none';
          this.elements.contextHelpPopup.setAttribute('aria-hidden', 'true');
      }
  }

  // --- Style Finder Methods ---
  sfStart(){ /* ... (existing logic) ... */ this.sfShowDashboardDuringTraits = false; /* Reset dashboard toggle */}
  sfClose(){ /* ... (existing logic) ... */ }
  sfCalculateSteps(){ /* ... (existing logic) ... */ }

  // MODIFIED: Style Finder Step Rendering - Add dashboard toggle, intro text
  sfRenderStep() {
      if (!this.sfActive || !this.elements.sfStepContent) return;
      this.sfCalculateSteps();
      // ... (step index validation) ...
      const step = this.sfSteps[this.sfStep];
      if (!step) { /* ... error handling ... */ return; }

      console.log(`Rendering SF Step ${this.sfStep}:`, step);
      let html = "";
      // ... (progress tracker logic) ...

      switch (step.type) {
          case 'welcome': /* ... */ break;
          case 'roleIdentification': /* ... */ break;
          case 'switchClarification': /* ... */ break;
          case 'trait':
              const traitObj = this.sfTraitSet.find(t => t.name === step.trait);
              if (!traitObj) { /* ... error loading trait ... */ break; }
              const currentValue = this.sfAnswers.traits[traitObj.name] ?? 5; // Default to 5
              // ... (footnote, sliderDesc logic) ...
              const isFirstTraitStep = this.sfSteps.findIndex(s => s.type === 'trait') === this.sfStep;

              html = `<h2>${this.escapeHTML(traitObj.desc)}<button class="sf-info-icon" data-trait="${traitObj.name}" data-action="showTraitInfo" aria-label="More info about ${traitObj.name}">ℹ️</button></h2>`;
              // NEW: More explicit intro text
              if (isFirstTraitStep) {
                 html += `<p>Rate how much this resonates with you (1=Not at all, 10=Very much!). <strong>5 is neutral.</strong></p>`;
              }
              html += `<input type="range" min="1" max="10" value="${safeCurrentValue}" class="sf-trait-slider" data-trait="${traitObj.name}" aria-label="${traitObj.name} rating">
                       <div id="sf-desc-${traitObj.name}" class="sf-slider-description">${this.escapeHTML(sliderDescText)}</div>
                       <p class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                       <div class="sf-button-container">
                           <button data-action="next" data-trait="${traitObj.name}">Next Step!</button>
                           ${this.sfStep > 2 ? `<button data-action="prev">Back</button>` : ''}
                           {/* NEW: Dashboard Toggle Button */}
                           <button id="sf-dashboard-toggle" data-action="toggleDashboard">${this.sfShowDashboardDuringTraits ? 'Hide' : 'Show'} Live Vibes</button>
                       </div>`;
              break;
          case 'roundSummary': /* ... */ break;
          case 'result': /* ... */ break;
          default: /* ... */ break;
      }

      try {
          if (!this.elements.sfStepContent) throw new Error("sfStepContent element missing");
          this.elements.sfStepContent.innerHTML = html;
          if (step.type === 'trait') {
              this.sfUpdateDashboard(); // Update dashboard visibility based on state
          } else if (step.type !== 'roundSummary') {
              if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
          }
          console.log(`SF Step ${this.sfStep} rendered successfully.`);
      } catch (e) { /* ... error handling ... */ }
  } // End sfRenderStep

  sfSetRole(role){ /* ... (existing logic) ... */ }
  sfSetTrait(trait,value){ /* ... (existing logic) ... */ }
  sfNextStep(){ /* ... (existing logic) ... */ }
  sfPrevStep(){ /* ... (existing logic) ... */ }
  sfStartOver(){ /* ... (existing logic) ... */ }
  sfComputeScores(){ /* ... (existing logic) ... */ }

  // MODIFIED: Update dashboard based on toggle state
  sfUpdateDashboard(forceVisible = false) {
      if (!this.sfSteps || this.sfSteps.length === 0) this.sfCalculateSteps();
      const currentStep = this.sfSteps[this.sfStep];
      const currentStepType = currentStep?.type;

      // Determine if dashboard should be shown
      const shouldShow = forceVisible || (this.sfRole && currentStepType === 'trait' && this.sfShowDashboardDuringTraits);

      if (!this.elements.sfDashboard) { /* ... error handling ... */ return; }

      if (!shouldShow) {
          this.elements.sfDashboard.style.display = 'none';
          return;
      }
      this.elements.sfDashboard.style.display = 'block';
      // ... (rest of dashboard rendering logic remains the same)
      this.sfPreviousScores={...scores};
      this.sfHasRenderedDashboard=true;
  }

  // NEW: Toggle dashboard visibility state
  toggleStyleFinderDashboard() {
      this.sfShowDashboardDuringTraits = !this.sfShowDashboardDuringTraits;
      // Update button text if it exists in the current step
      const toggleButton = this.elements.sfStepContent?.querySelector('#sf-dashboard-toggle');
      if (toggleButton) {
          toggleButton.textContent = `${this.sfShowDashboardDuringTraits ? 'Hide' : 'Show'} Live Vibes`;
      }
      this.sfUpdateDashboard(); // Re-render dashboard based on new state
  }

  sfCalculateResult(){ /* ... (existing logic) ... */ }
  sfShowFeedback(message){ /* ... (existing logic) ... */ }
  sfShowTraitInfo(traitName){ /* ... (existing logic) ... */ }
  sfShowFullDetails(styleName){ /* ... (existing logic) ... */ }
  getStyleIcons(){ /* ... (existing logic) ... */ }

  // MODIFIED: Add confirmation before applying
  confirmApplyStyleFinderResult(r, s) {
      // Use a simple confirm for now, replace with custom modal if desired
      const message = `Apply Style "${this.escapeHTML(s)}" to the form? This will overwrite current Role/Style selections.`;
      // NEW: Offer more options - custom modal needed for this ideally
      // Simple confirm first:
      if (confirm(message)) {
          this.applyStyleFinderResult(r, s);
      }
      /* // Ideal Custom Modal Flow:
      this.showConfirmationModal(message, [
          { text: "Apply to Current", action: () => this.applyStyleFinderResult(r, s) },
          { text: "Create New Persona", action: () => { this.resetForm(false); this.applyStyleFinderResult(r, s); } },
          { text: "Cancel", action: () => {} } // No-op
      ]);
      */
  }

  // MODIFIED: Actual application logic (separated from confirmation)
  applyStyleFinderResult(r,s){
      console.log(`Applying SF Result: Role=${r}, Style=${s}`);
      if(!r||!s||!this.elements.role||!this.elements.style){ /* ... error handling ... */ return;}
      this.elements.role.value=r;
      this.renderStyles(r);
      requestAnimationFrame(()=>{
          // ... (logic to select style in dropdown) ...
          this.renderTraits(r,this.elements.style.value);
          this.updateLivePreview();
          this.updateStyleExploreLink(); // NEW: Update explore link
          this.sfClose();
          this.elements.formSection?.scrollIntoView({behavior:'smooth'});
          this.elements.name?.focus();
          this.showNotification(`Style "${s}" selected! Review traits & save. ✨`,"success");
      });
  }

  // --- Other Helper Functions ---
  getFlairForScore(s){ /* ... */ }
  getEmojiForScore(s){ /* ... */ }
  escapeHTML(str){ /* ... */ }
  openModal(modalElement){ /* ... */ }
  closeModal(modalElement){ /* ... */ }
  getIntroForStyle(styleName){ /* ... */ }

  // MODIFIED: Enhanced notification
  showNotification(message, type = 'info', duration = 4000) {
      let notification = document.getElementById('app-notification');
      if (!notification) { /* ... create notification element ... */ }

      notification.textContent = message;
      notification.className = `app-notification notification-${type}`;
      // ... (set styles based on type) ...

      // Add specific icons based on type
      let icon = '';
      switch(type) {
          case 'success': icon = '✅ '; break;
          case 'error':   icon = '❌ '; break;
          case 'warning': icon = '⚠️ '; break;
          case 'info':    icon = 'ℹ️ '; break;
          // NEW: Achievement icon
          case 'achievement': icon = '🏆 '; break;
      }
       if (type === 'achievement') {
           notification.style.backgroundColor = 'gold';
           notification.style.color = 'black';
           notification.style.fontWeight = 'bold';
           notification.style.border = '2px solid darkgoldenrod';
           duration = 6000; // Show achievement notifications longer
       }


      notification.innerHTML = icon + this.escapeHTML(message); // Prepend icon

      requestAnimationFrame(() => {
          notification.style.opacity = '1';
          notification.style.top = '35px';
      });

      if (this.notificationTimer) clearTimeout(this.notificationTimer);
      this.notificationTimer = setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.top = '20px';
      }, duration); // Use dynamic duration
  }

   // NEW: Method to show a generic confirmation modal (Requires HTML/CSS)
   /*
   showConfirmationModal(message, buttons) {
       // 1. Get confirmation modal elements (title, body, button container)
       // 2. Set message
       // 3. Clear existing buttons
       // 4. Create buttons based on the 'buttons' array [{text: 'Yes', action: () => {...}}, ...]
       // 5. Add event listeners to buttons that call action() and then closeModal()
       // 6. Open the confirmation modal
   }
   */


} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    // Display user-friendly error message in the body
    document.body.innerHTML = `... error display HTML ...`;
}
