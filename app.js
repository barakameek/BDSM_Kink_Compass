// === app.js === (COMPLETE - Incorporating Diagnostic Logs in showGlossary & openModal)

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
    this.elementThatOpenedModal = null;
    
    // --- Style Finder State ---
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
    this.sfShowDashboardDuringTraits = false;


    // --- Style Finder Data Structures ---
    // (Keep your existing data structures here)
    // NOTE: Keep the actual data structures from your original file
    this.sfStyles = { submissive: [ 'Classic Submissive', 'Brat', 'Slave', /* ... */ 'Bottom' ], dominant: [ 'Classic Dominant', 'Assertive', /* ... */ 'Commander' ] };
    this.sfSubFinderTraits = [ { name: 'obedience', desc: '...' }, /* ... */ ];
    this.sfSubTraitFootnotes = { obedience: '...', /* ... */ };
    this.sfDomFinderTraits = [ { name: 'authority', desc: '...' }, /* ... */ ];
    this.sfDomTraitFootnotes = { authority: '...', /* ... */ };
    this.sfSliderDescriptions = { obedience: [ '...' ], /* ... */ };
    this.sfTraitExplanations = { obedience: '...', /* ... */ };
    this.sfStyleDescriptions = { 'Classic Submissive': { short: '...', long: '...', tips: ['...'] }, /* ... */ };
    this.sfDynamicMatches = { 'Classic Submissive': { dynamic: '...', match: '...', desc: '...', longDesc: '...' }, /* ... */ };
    this.sfStyleKeyTraits = { 'Classic Submissive': ['...'], /* ... */ };


    // --- Element Mapping ---
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
      // sfDashboardToggle is dynamic
      detailModalTitle: document.getElementById('detail-modal-title'),
      resourcesModalTitle: document.getElementById('resources-modal-title'),
      glossaryModalTitle: document.getElementById('glossary-modal-title'),
      styleDiscoveryTitle: document.getElementById('style-discovery-title'),
      themesModalTitle: document.getElementById('themes-modal-title'),
      achievementsModalTitle: document.getElementById('achievements-modal-title'),
      welcomeModalTitle: document.getElementById('welcome-modal-title'),
      sfModalTitle: document.getElementById('sf-modal-title'),
      formTitle: document.getElementById('form-title'),
    };

    // --- DIAGNOSTIC LOGS ---
    console.log("--- Element Check ---");
    console.log("role:", !!this.elements.role, this.elements.role);
    console.log("style:", !!this.elements.style, this.elements.style);
    console.log("achievementsBtn:", !!this.elements.achievementsBtn, this.elements.achievementsBtn);
    console.log("glossaryBtn:", !!this.elements.glossaryBtn, this.elements.glossaryBtn);
    console.log("resourcesBtn:", !!this.elements.resourcesBtn, this.elements.resourcesBtn);
    console.log("themesBtn:", !!this.elements.themesBtn, this.elements.themesBtn);
    console.log("styleFinderTriggerBtn:", !!this.elements.styleFinderTriggerBtn, this.elements.styleFinderTriggerBtn);
    console.log("styleDiscoveryBtn:", !!this.elements.styleDiscoveryBtn, this.elements.styleDiscoveryBtn);
    console.log("exportBtn:", !!this.elements.exportBtn, this.elements.exportBtn);
    console.log("importBtn:", !!this.elements.importBtn, this.elements.importBtn);
    console.log("themeToggle:", !!this.elements.themeToggle, this.elements.themeToggle);
    console.log("modalTabs:", !!this.elements.modalTabs, this.elements.modalTabs);
    console.log("save:", !!this.elements.save, this.elements.save);
    console.log("clearForm:", !!this.elements.clearForm, this.elements.clearForm);
    console.log("formStyleFinderLink:", !!this.elements.formStyleFinderLink, this.elements.formStyleFinderLink);
    console.log("--- End Element Check ---");
    // --- END DIAGNOSTIC LOGS ---


    // Critical element check
    const criticalElements = Object.keys(this.elements);
    const missingKeys = [];
    for (const key of criticalElements) {
        if (key === 'sfDashboardToggle') continue;
        if (!this.elements[key]) {
            missingKeys.push(key);
        }
    }

    if (missingKeys.length > 0) {
        const errorMsg = `Initialization failed: Required HTML element(s) not found (IDs: ${missingKeys.join(', ')}). Check index.html.`;
        console.error(errorMsg);
        document.body.innerHTML = `<div style='color: red; padding: 20px;'>${errorMsg}</div>`;
        throw new Error(errorMsg);
    }

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role?.value);
    this.renderTraits(this.elements.role?.value, this.elements.style?.value);
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage(){try{const data=localStorage.getItem('kinkProfiles');const profiles=data?JSON.parse(data):[];this.people=profiles.map(p=>({...p,id:p.id??Date.now(),name:p.name??"Unnamed",role:p.role??"submissive",style:p.style??"",avatar:p.avatar||'❓',goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'&&p.reflections!==null?p.reflections:{text:p.reflections||''},traits:typeof p.traits==='object'&&p.traits!==null?p.traits:{}}));console.log(`Loaded ${this.people.length} profiles.`);}catch(e){console.error("Failed to load profiles:",e);this.people=[];this.showNotification("Error loading profiles. Starting fresh.", "error");}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length} profiles.`);}catch(e){console.error("Failed to save profiles:",e);this.showNotification("Error saving data. Storage might be full or corrupted.", "error");}}


  // NEW: Onboarding check
  checkAndShowWelcome() {
      try {
          const onboarded = localStorage.getItem('kinkCompassOnboarded');
          if (!onboarded) {
              this.showWelcomeMessage();
          }
      } catch (e) {
          console.warn("Could not check onboarding status:", e);
      }
  }

  // NEW: Show welcome message modal
  showWelcomeMessage() {
      if (this.elements.welcomeModal) {
          this.openModal(this.elements.welcomeModal);
          const closeHandler = () => {
              try {
                  localStorage.setItem('kinkCompassOnboarded', 'true');
                  console.log("Onboarding complete.");
              } catch (e) {
                  console.warn("Could not save onboarding status:", e);
              }
              this.elements.welcomeClose?.removeEventListener('click', closeHandler);
              this.elements.welcomeModal?.removeEventListener('click', modalCloseHandler);
          };
          const modalCloseHandler = (e) => {
             if (e.target === this.elements.welcomeModal) {
                this.closeModal(this.elements.welcomeModal);
                closeHandler();
             }
          }
          this.elements.welcomeClose?.addEventListener('click', closeHandler, { once: true });
          this.elements.welcomeModal?.addEventListener('click', modalCloseHandler);
      } else {
          console.warn("Welcome modal element not found.");
      }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Attaching event listeners...");

    // Form Elements
    this.elements.role?.addEventListener('change', (e) => {
        console.log(">>> Role Dropdown Changed!");
        const selectedRole = e.target.value;
        this.renderStyles(selectedRole);
        if (this.elements.style) this.elements.style.value = '';
        this.renderTraits(selectedRole, '');
        this.updateLivePreview();
        this.updateStyleExploreLink();
    });
    this.elements.style?.addEventListener('change', (e) => {
        console.log(">>> Style Dropdown Changed!");
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink();
    });
    this.elements.name?.addEventListener('input', () => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click', (e) => {
        if (e.target.classList.contains('avatar-btn')) {
            const emoji = e.target.dataset.emoji;
            if (emoji && this.elements.avatarInput && this.elements.avatarDisplay) {
                this.elements.avatarInput.value = emoji;
                this.elements.avatarDisplay.textContent = emoji;
                this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => {
                    btn.classList.toggle('selected', btn === e.target);
                });
                this.updateLivePreview();
            }
        }
     });
    this.elements.save?.addEventListener('click', () => {
        console.log(">>> Save Button Clicked!");
        this.savePerson();
    });
    this.elements.clearForm?.addEventListener('click', () => {
        console.log(">>> Clear Form Button Clicked!");
        this.resetForm(true);
    });
    this.elements.formStyleFinderLink?.addEventListener('click', () => {
        console.log(">>> Form Style Finder Link Clicked!");
        this.sfStart();
    });
    this.elements.styleExploreLink?.addEventListener('click', (e) => {
        console.log(">>> Explore Style Link Clicked!");
        this.handleExploreStyleLinkClick(e);
    });

    // Traits Interaction
    this.elements.traitsContainer?.addEventListener('input', (e) => { if (e.target.classList.contains('trait-slider')) { this.handleTraitSliderInput(e); } });
    this.elements.traitsContainer?.addEventListener('click', (e) => { if (e.target.classList.contains('trait-info-btn')) { this.handleTraitInfoClick(e); } });
    this.elements.traitInfoClose?.addEventListener('click', () => this.hideTraitInfo());
    this.elements.contextHelpClose?.addEventListener('click', () => this.hideContextHelp());

    // Persona List
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));

    // Header Buttons / Main Triggers
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => {
        console.log(">>> Header Style Finder Button Clicked!");
        this.sfStart();
    });
    this.elements.styleDiscoveryBtn?.addEventListener('click', () => {
        console.log(">>> Explore Styles Button Clicked!");
        this.showStyleDiscovery();
    });
    this.elements.achievementsBtn?.addEventListener('click', () => {
        console.log(">>> Achievements Button Clicked!");
        this.showAchievements();
    });
    this.elements.glossaryBtn?.addEventListener('click', () => {
        console.log(">>> Glossary Button Clicked!");
        this.showGlossary();
    });
    this.elements.resourcesBtn?.addEventListener('click', () => {
        console.log(">>> Resources Button Clicked!");
        this.openModal(this.elements.resourcesModal);
    });
    this.elements.themesBtn?.addEventListener('click', () => {
        console.log(">>> Themes Button Clicked!");
        this.openModal(this.elements.themesModal);
    });
    this.elements.exportBtn?.addEventListener('click', () => {
        console.log(">>> Export Button Clicked!");
        this.exportData();
    });
    this.elements.importBtn?.addEventListener('click', () => {
        console.log(">>> Import Button Clicked!");
        this.elements.importFileInput?.click();
    });
    this.elements.themeToggle?.addEventListener('click', () => {
        console.log(">>> Theme Toggle Button Clicked!");
        this.toggleTheme();
    });
    this.elements.importFileInput?.addEventListener('change', (e) => this.importData(e));


    // Modal Closures & Interactions
    this.elements.modalClose?.addEventListener('click', () => this.closeModal(this.elements.modal));
    this.elements.resourcesClose?.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));
    this.elements.glossaryClose?.addEventListener('click', () => this.closeModal(this.elements.glossaryModal));
    this.elements.styleDiscoveryClose?.addEventListener('click', () => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.themesClose?.addEventListener('click', () => this.closeModal(this.elements.themesModal));
    this.elements.achievementsClose?.addEventListener('click', () => this.closeModal(this.elements.achievementsModal));
    this.elements.welcomeClose?.addEventListener('click', () => this.closeModal(this.elements.welcomeModal));
    this.elements.sfCloseBtn?.addEventListener('click', () => this.sfClose());

    // Specific Modal Body Interactions
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));
    this.elements.modalTabs?.addEventListener('click', (e) => {
        console.log(">>> Modal Tab Area Clicked!");
        this.handleDetailTabClick(e);
    });
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => this.renderStyleDiscoveryContent());
    this.elements.styleDiscoveryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));
    this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));

    // Style Finder Specific Interactions
    this.elements.sfStepContent?.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (button) { this.handleStyleFinderAction(button.dataset.action, button.dataset); return; }
        const icon = e.target.closest('.sf-info-icon[data-trait]');
        if (icon) { this.handleStyleFinderAction('showTraitInfo', icon.dataset); return; }
        if (e.target.id === 'sf-dashboard-toggle') {
             console.log(">>> SF Dashboard Toggle Clicked!");
             this.toggleStyleFinderDashboard();
             return;
        }
    });
    this.elements.sfStepContent?.addEventListener('input', (e) => { if (e.target.classList.contains('sf-trait-slider') && e.target.dataset.trait) { this.handleStyleFinderSliderInput(e.target); } });

    // Global Listeners
    document.body.addEventListener('click', (e) => { if (e.target.classList.contains('sf-close-btn')) { e.target.closest('.sf-style-info-popup')?.remove(); } });
    window.addEventListener('click', (e) => this.handleWindowClick(e));
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));

    console.log("Event listeners setup complete.");
  } // --- End addEventListeners ---

  // --- Event Handlers ---
  handleListClick(e){const li=e.target.closest('.person');if(!li)return;const id=parseInt(li.dataset.id,10);if(isNaN(id))return;console.log("List Click on ID:",id,"Target:",e.target);const actionTarget=e.target.closest('button');const action=actionTarget?actionTarget.dataset.action:null;if(action==='edit'){this.editPerson(id);}else if(action==='delete'){this.deletePerson(id);}else{this.showPersonDetails(id);}}
  handleListKeydown(e){const li=e.target.closest('.person');if(!li)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=parseInt(li.dataset.id,10);if(!isNaN(id))this.showPersonDetails(id);}}

  handleWindowClick(e){const target=e.target;if(target.classList.contains('modal')){ // Check if the backdrop was clicked
      if(target===this.elements.modal)this.closeModal(this.elements.modal);
      else if(target===this.elements.sfModal)this.sfClose();
      else if(target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);
      else if(target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);
      else if(target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);
      else if(target===this.elements.themesModal)this.closeModal(this.elements.themesModal);
      else if(target===this.elements.achievementsModal)this.closeModal(this.elements.achievementsModal);
      else if(target===this.elements.welcomeModal){ this.closeModal(this.elements.welcomeModal); try { localStorage.setItem('kinkCompassOnboarded', 'true'); console.log("Onboarding complete via backdrop click.");} catch(e){console.warn("Could not save onboarding status:",e);}}
      else if(target===this.elements.contextHelpPopup)this.hideContextHelp();
    }}
  handleWindowKeydown(e){if(e.key==='Escape'){
      if(this.elements.traitInfoPopup?.style.display!=='none') this.hideTraitInfo();
      else if(this.elements.contextHelpPopup?.style.display!=='none') this.hideContextHelp();
      else if(this.elements.modal?.style.display!=='none')this.closeModal(this.elements.modal);
      else if(this.elements.sfModal?.style.display!=='none')this.sfClose();
      else if(this.elements.resourcesModal?.style.display!=='none')this.closeModal(this.elements.resourcesModal);
      else if(this.elements.glossaryModal?.style.display!=='none')this.closeModal(this.elements.glossaryModal);
      else if(this.elements.styleDiscoveryModal?.style.display!=='none')this.closeModal(this.elements.styleDiscoveryModal);
      else if(this.elements.themesModal?.style.display!=='none')this.closeModal(this.elements.themesModal);
      else if(this.elements.achievementsModal?.style.display!=='none')this.closeModal(this.elements.achievementsModal);
      else if(this.elements.welcomeModal?.style.display!=='none')this.closeModal(this.elements.welcomeModal); // Also closes welcome on Esc
    }}
  handleTraitSliderInput(e){ const slider=e.target;this.updateTraitDescription(slider);this.updateLivePreview();const value=slider.value;const person=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;if(person){if(value==='5')grantAchievement(person,'max_trait');if(value==='1')grantAchievement(person,'min_trait');}}
  handleTraitInfoClick(e){const button=e.target;const traitName=button.dataset.trait;if(traitName)this.showTraitInfo(traitName);}

  // MODIFIED: handleModalBodyClick
  handleModalBodyClick(e){
      const target=e.target;
      const button=target.closest('button');
      const link = target.closest('a');
      const check=button||target; // Prioritize button, fallback to target
      if(!check) return;

      const id=check.id;
      const classList=check.classList;
      const dataset = check.dataset || {}; // Ensure dataset exists
      const personId=parseInt(dataset.personId,10);
      const goalId=parseInt(dataset.goalId,10);
      const helpKey = dataset.helpKey;

      console.log("Detail Modal Click: Elm:",check,"ID:",id,"Class:",classList, "Dataset:", dataset);

      if(id==='save-reflections-btn'&&!isNaN(personId)){this.saveReflections(personId);}
      else if(id==='prompt-btn'){this.showJournalPrompt(personId);}
      else if(id==='snapshot-btn'&&!isNaN(personId)){this.addSnapshotToHistory(personId);}
      else if(classList.contains('snapshot-info-btn')){this.toggleSnapshotInfo(check);}
      else if(id==='reading-btn'&&!isNaN(personId)){this.showKinkReading(personId);}
      else if(classList.contains('add-goal-btn')&&!isNaN(personId)){this.addGoal(personId);}
      else if(classList.contains('toggle-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.toggleGoalStatus(personId,goalId);}
      else if(classList.contains('delete-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.deleteGoal(personId,goalId);}
      else if(classList.contains('context-help-btn') && helpKey) { this.showContextHelp(helpKey); }
      else if (classList.contains('glossary-link') && dataset.termKey) { e.preventDefault(); this.showGlossary(dataset.termKey); }
      else{console.log("No matching detail modal action.");}
  }

  handleThemeSelection(e){const button=e.target.closest('.theme-option-btn');if(button){const themeName=button.dataset.theme;if(themeName){this.setTheme(themeName);grantAchievement({},'theme_changer');this.closeModal(this.elements.themesModal);}}}

  // MODIFIED: Style finder action handler
  handleStyleFinderAction(action, dataset = {}) {
      console.log("SF Action:", action, dataset);
      const stepContent = this.elements.sfStepContent;
      if (stepContent) stepContent.classList.add('loading');

      try {
          switch (action) {
              case 'next':
                  const currentTrait = dataset.trait;
                  const currentStepType = this.sfSteps[this.sfStep]?.type;
                  if (currentStepType === 'trait' && currentTrait && this.sfAnswers.traits[currentTrait] === undefined) {
                      console.log(`Trait ${currentTrait} not answered, setting default value 5.`);
                      this.sfSetTrait(currentTrait, 5);
                      const descElement = this.elements.sfStepContent?.querySelector(`#sf-desc-${currentTrait}`);
                      const descriptions = this.sfSliderDescriptions?.[currentTrait] ?? [];
                      if (descElement && descriptions.length > 0) {
                          descElement.textContent = this.escapeHTML(descriptions[5 - 1] || `Level 5`);
                      }
                      this.sfUpdateDashboard();
                  }
                  this.sfNextStep();
                  break;
              case 'prev':
                  this.sfPrevStep();
                  break;
              case 'identifyRole':
                  if (dataset.identifiedRole && ['submissive', 'dominant', 'switch'].includes(dataset.identifiedRole)) {
                      this.sfAnswers.rolePreference = dataset.identifiedRole;
                      this.sfIdentifiedRole = dataset.identifiedRole;
                      if (this.sfIdentifiedRole === 'switch') {
                          this.sfNextStep();
                      } else {
                          this.sfSetRole(this.sfIdentifiedRole);
                      }
                  } else {
                      console.error("Identify role action with invalid data:", dataset.identifiedRole);
                      this.showNotification("Invalid selection.", "error");
                  }
                  break;
              case 'setRole':
                  if (dataset.role && ['submissive', 'dominant'].includes(dataset.role)) {
                      this.sfSetRole(dataset.role);
                  } else {
                      console.error("Set role action triggered without valid role data:", dataset.role);
                      this.showNotification("Invalid role selected.", "error");
                  }
                  break;
              case 'startOver':
                  this.sfStartOver();
                  break;
              case 'close':
                  this.sfClose();
                  break;
              case 'applyStyle':
                  const r = dataset.role;
                  const s = dataset.style;
                  if (r && s) {
                      this.confirmApplyStyleFinderResult(r, s);
                  } else {
                      this.showNotification("Error applying style. Role or Style missing.", "error");
                      console.error("Apply Style Error: Missing role or style in dataset", dataset);
                  }
                  break;
              case 'showFullDetails':
                  if (dataset.style) {
                      this.sfShowFullDetails(dataset.style);
                  } else {
                      console.error("Show Full Details action triggered without style data.");
                      this.showNotification("Could not show details for style.", "error");
                  }
                  break;
              case 'showTraitInfo':
                  if (dataset.trait) {
                      this.sfShowTraitInfo(dataset.trait);
                  } else {
                      console.error("Show Trait Info action triggered without trait data.");
                      this.showNotification("Could not show info for trait.", "error");
                  }
                  break;
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
           if (stepContent) stepContent.classList.remove('loading');
      }
  } // --- End handleStyleFinderAction ---

  handleStyleFinderSliderInput(sliderElement) { const traitName = sliderElement.dataset.trait; const value = parseInt(sliderElement.value, 10); if (traitName) { this.sfSetTrait(traitName, value); const descElement = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`); const descriptions = this.sfSliderDescriptions?.[traitName] ?? []; if (descElement) { const safeValue = Number(value); if (descriptions.length > 0 && safeValue >= 1 && safeValue <= descriptions.length) { descElement.textContent = this.escapeHTML(descriptions[safeValue - 1]); } else { descElement.textContent = `Level ${safeValue}`; console.warn(`Slider description missing or invalid for trait '${traitName}' at value ${safeValue}`); } } this.sfUpdateDashboard(); } else { console.error("Slider input event fired without data-trait attribute."); } }

  // NEW: Handle clicking on tabs in the detail modal
  handleDetailTabClick(e) {
      const button = e.target.closest('.tab-link');
      if (!button || button.classList.contains('active') || !this.elements.modalBody || !this.elements.modalTabs) {
          return;
      }

      const targetTabId = button.dataset.tab;
      if (!targetTabId) return;

      const personIdStr = this.elements.modal?.dataset.personId;
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
          this.activeDetailModalTab = targetTabId;

          if (!targetContent.dataset.rendered) {
              this.renderDetailTabContent(person, targetTabId, targetContent);
              targetContent.dataset.rendered = 'true';
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
          this.showGlossary(termKey);
      }
  }

  // NEW: Handle clicking the "Explore Style Details" link in the main form
  handleExploreStyleLinkClick(e) {
    e.preventDefault();
    const styleName = e.target.dataset.style;
    if (styleName) {
        this.showStyleDiscovery(styleName);
    }
  }

  // --- Core Rendering ---
  renderStyles(roleKey) { const selectElement=this.elements.style; if(!selectElement)return; selectElement.innerHTML='<option value="">-- Select a Style --</option>'; const roleData=bdsmData[roleKey]; let styles=[]; if(roleData?.styles){styles=roleData.styles;} if(styles.length>0){styles.sort((a,b) => a.name.localeCompare(b.name)).forEach(style=>{selectElement.innerHTML+=`<option value="${this.escapeHTML(style.name)}">${this.escapeHTML(style.name)}</option>`;}); selectElement.disabled=false;}else{selectElement.innerHTML=`<option value="">-- No Styles for ${roleKey} --</option>`; selectElement.disabled=true;} this.updateStyleExploreLink(); }

  // MODIFIED: Handle initial trait visibility state
  renderTraits(roleKey, styleName) {
      const container = this.elements.traitsContainer;
      const messageEl = this.elements.traitsMessage;
      if (!container || !messageEl) return;

      container.innerHTML = '';
      const roleData = bdsmData[roleKey];
      const showTraits = roleKey && (styleName || (roleData?.coreTraits?.length > 0));

      if (!showTraits) {
          container.style.display = 'none';
          messageEl.textContent = roleKey ? "Select a Style to see and customize relevant traits." : "Select a Role first to see options.";
          messageEl.style.display = 'block';
          this.hideTraitInfo();
          return;
      }

      container.style.display = 'block';
      messageEl.style.display = 'none';

      if (!roleData) {container.innerHTML=`<p class="muted-text">Select a valid role.</p>`; return;}

      const coreTraits=roleData.coreTraits||[];
      let styleTraits=[];
      let styleObj=null;
      let infoMessage='';

      if(styleName){
          styleObj=roleData.styles?.find(s=>s.name===styleName);
          if(styleObj){
              styleTraits=styleObj.traits||[];
              if(styleTraits.length===0&&coreTraits.length>0){infoMessage=`<p class="muted-text trait-info-message">Style '${this.escapeHTML(styleName)}' primarily uses the core traits for this role.</p>`;}
          } else {
              console.warn(`Style object not found for: ${roleKey} - ${styleName}`);
              infoMessage=`<p class="muted-text trait-info-message">Details for style '${this.escapeHTML(styleName)}' not found. Showing core traits.</p>`;
          }
      } else if (roleKey === 'switch') {
          infoMessage = `<p class="muted-text trait-info-message">Adjust core Switch traits below, or select a leaning style for more specific traits.</p>`;
      } else if (coreTraits.length > 0){
          infoMessage=`<p class="muted-text trait-info-message">Core traits for ${roleData.roleName}. Select a style for more nuances.</p>`;
      } else {
          container.innerHTML = `<p class="muted-text">Select a style to see relevant traits, or define core traits for this role.</p>`; return;
      }


      const traitsToRender=[];
      const uniqueTraitNames=new Set();
      [...styleTraits,...coreTraits].forEach(trait=>{if(trait&&trait.name&&!uniqueTraitNames.has(trait.name)){const fullTraitDef=styleTraits.find(st=>st.name===trait.name)||coreTraits.find(ct=>ct.name===trait.name); if(fullTraitDef){traitsToRender.push(fullTraitDef); uniqueTraitNames.add(trait.name);}}});

      if(traitsToRender.length===0 && !styleName && roleKey !== 'switch'){container.innerHTML=`<p class="muted-text">No core traits defined for role '${roleKey}'. Select a style.</p>`; return;}
      if(traitsToRender.length===0 && styleName){container.innerHTML=`<p class="muted-text">No specific or core traits found for style '${this.escapeHTML(styleName)}'.</p>`; return;}


      if(infoMessage)container.innerHTML+=infoMessage;
      traitsToRender.sort((a,b) => a.name.localeCompare(b.name)).forEach(trait=>{container.innerHTML+=this.createTraitHTML(trait);});
      container.querySelectorAll('.trait-slider').forEach(slider=>{this.updateTraitDescription(slider);});
      this.hideTraitInfo();
      this.updateStyleExploreLink();
  }

  createTraitHTML(trait){const displayName=trait.name.charAt(0).toUpperCase()+trait.name.slice(1); const id=`trait-${trait.name.replace(/[^a-zA-Z0-9-_]/g,'-')}`; const initialValue=3; let initialDesc='Adjust slider...'; if(trait.desc&&trait.desc[initialValue]){initialDesc=trait.desc[initialValue];}else if(trait.desc&&trait.desc["3"]){initialDesc=trait.desc["3"];}else{console.warn(`Initial description missing for trait '${trait.name}' at value 3.`);} return`<div class="trait"><label for="${id}">${this.escapeHTML(displayName)}</label><button class="trait-info-btn" data-trait="${trait.name}" aria-label="Info about ${this.escapeHTML(displayName)}">ℹ️</button><span class="trait-value">${initialValue}</span><input type="range" id="${id}" min="1" max="5" value="${initialValue}" class="trait-slider" data-trait="${trait.name}" aria-label="${this.escapeHTML(displayName)} rating" autocomplete="off"/><div class="trait-desc muted-text">${this.escapeHTML(initialDesc)}</div></div>`;}
  updateTraitDescription(slider){const traitName=slider.dataset.trait; const value=slider.value; const traitDescElement=slider.parentElement?.querySelector('.trait-desc'); const traitValueElement=slider.parentElement?.querySelector('.trait-value'); if(!traitDescElement||!traitValueElement||!traitName)return; traitValueElement.textContent=value; const roleKey=this.elements.role.value; const styleName=this.elements.style.value; const roleData=bdsmData[roleKey]; let traitDef=null; if(roleData){if(styleName){const styleObj=roleData.styles?.find(s=>s.name===styleName); traitDef=styleObj?.traits?.find(t=>t.name===traitName);} if(!traitDef){traitDef=roleData.coreTraits?.find(t=>t.name===traitName);}} if(traitDef?.desc&&traitDef.desc[value]){traitDescElement.textContent=this.escapeHTML(traitDef.desc[value]);}else{traitDescElement.textContent=traitDef?'Description unavailable for this level.':'Trait definition missing.'; if(!traitDef)console.warn(`Trait definition not found for ${traitName} in role ${roleKey}/${styleName||'core'}`);}}
  renderList(){if(!this.elements.peopleList)return;this.elements.peopleList.innerHTML=this.people.length===0?`<li>No personas created yet! Use the form to start. ✨</li>`:this.people.map(p=>this.createPersonListItemHTML(p)).join('');}
  createPersonListItemHTML(person){const styleDisplay=person.style?this.escapeHTML(person.style):"Style N/A"; const roleDisplay=person.role.charAt(0).toUpperCase()+person.role.slice(1); const nameDisplay=this.escapeHTML(person.name); const avatar=person.avatar||'❓'; return`<li class="person" data-id="${person.id}" tabindex="0" aria-label="${nameDisplay}, ${roleDisplay} - ${styleDisplay}. Click to view details."><span class="person-info"><span class="person-avatar" aria-hidden="true">${avatar}</span><span class="person-name-details"><strong class="person-name">${nameDisplay}</strong><span class="person-details muted-text">(${roleDisplay} - ${styleDisplay})</span></span></span><span class="person-actions"><button class="edit-btn small-btn" data-action="edit" data-id="${person.id}" aria-label="Edit ${nameDisplay}">✏️</button><button class="delete-btn small-btn" data-action="delete" data-id="${person.id}" aria-label="Delete ${nameDisplay}">🗑️</button></span></li>`;}

  // NEW: Update the visibility and link for exploring style details
  updateStyleExploreLink() {
      const link = this.elements.styleExploreLink;
      const styleSelect = this.elements.style;
      if (!link || !styleSelect) return;

      const selectedStyle = styleSelect.value;
      if (selectedStyle) {
          link.style.display = 'inline';
          link.dataset.style = selectedStyle;
          link.textContent = `(Explore ${this.escapeHTML(selectedStyle)} Details)`;
      } else {
          link.style.display = 'none';
      }
  }


  // --- CRUD ---
  // MODIFIED: Add loading state and saving indication
  savePerson() {
      const saveButton = this.elements.save;
      if (!saveButton) return;

      saveButton.disabled = true;
      saveButton.innerHTML = 'Saving... <span class="spinner"></span>';

      const nameInput=this.elements.name; const name=nameInput.value.trim(); const avatar=this.elements.avatarInput.value||'❓'; const role=this.elements.role.value; let style=this.elements.style.value;
      if(!name || (!role) || (!style && role !== 'switch')) {
          this.showNotification("Please fill required fields (Name, Role, Style).","error");
          saveButton.disabled = false;
          saveButton.innerHTML = this.currentEditId ? 'Update Persona! ✨' : 'Save Persona! 💖';
          if (!name) nameInput.focus(); else if (!role) this.elements.role.focus(); else this.elements.style.focus();
          return;
      }
       if(!style && role === 'switch') { style = 'Fluid Switch'; console.log("Defaulting Switch style to 'Fluid Switch'"); }

      const sliders=this.elements.traitsContainer.querySelectorAll('.trait-slider'); const currentTraits={}; let missingTraitData=false; sliders.forEach(slider=>{const traitName=slider.dataset.trait; if(traitName){currentTraits[traitName]=slider.value;}else{console.error("Slider missing data-trait attribute:",slider); missingTraitData=true;}}); if(missingTraitData){this.showNotification("Error gathering trait data.","error"); return;}

      const roleData=bdsmData[role]; const coreTraits=roleData?.coreTraits?.map(t=>t.name)||[]; const styleObj=roleData?.styles?.find(s=>s.name===style); const styleSpecificTraits=styleObj?.traits?.map(t=>t.name)||[]; const expectedTraitNames=new Set([...coreTraits,...styleSpecificTraits]);
      if(role !== 'switch'){ for(const expectedName of expectedTraitNames){if(!currentTraits.hasOwnProperty(expectedName)){console.error(`Missing trait data for expected trait: '${expectedName}'. Rendered:`,Object.keys(currentTraits)); this.showNotification(`Missing data for required trait: '${expectedName}'. Try again.`,"error"); saveButton.disabled = false; saveButton.innerHTML = this.currentEditId ? 'Update Persona! ✨' : 'Save Persona! 💖'; return;}}} // Check required traits

      const existingPerson=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;
      const personData={id:this.currentEditId||Date.now(),name:name,avatar:avatar,role:role,style:style,traits:currentTraits,goals:existingPerson?.goals||[],history:existingPerson?.history||[],achievements:existingPerson?.achievements||[],reflections:existingPerson?.reflections||{text:''},lastUpdated:Date.now()};

      setTimeout(() => { // Simulate save delay
          try {
              let isNew=false;
              let savedItemId = personData.id;

              if(this.currentEditId){
                  const index=this.people.findIndex(p=>p.id===this.currentEditId);
                  if(index!==-1){this.people[index]=personData; grantAchievement(personData,'profile_edited');}
                  else{console.error("Error updating persona: ID not found."); this.showNotification("Error updating persona.","error"); this.people.push(personData); isNew=true;}
              } else {
                  this.people.push(personData);
                  isNew=true;
                  grantAchievement(personData,'profile_created');
                  if(this.people.length>=5){grantAchievement(personData,'five_profiles');}
              }
              if(avatar!=='❓'){grantAchievement(personData,'avatar_chosen');}

              this.saveToLocalStorage();
              this.renderList();

              const listItem = this.elements.peopleList?.querySelector(`li[data-id="${savedItemId}"]`);
              if (listItem) {
                  listItem.classList.add('item-just-saved');
                  setTimeout(() => listItem.classList.remove('item-just-saved'), 1500);
              }

              this.showNotification(`${this.escapeHTML(name)} ${isNew?'created':'updated'}! ✨`,"success");
              this.resetForm();
          } catch (error) {
              console.error("Error saving persona:", error);
              this.showNotification("Failed to save persona.", "error");
              // Ensure button is re-enabled on error AFTER timeout
              saveButton.disabled = false;
              saveButton.innerHTML = this.currentEditId ? 'Update Persona! ✨' : 'Save Persona! 💖';
          }
      }, 300);
  }

  editPerson(personId){const person=this.people.find(p=>p.id===personId); if(!person){this.showNotification("Persona not found.","error"); return;} console.log("Editing person:",person); this.currentEditId=personId; this.elements.formTitle.textContent=`✨ Edit ${this.escapeHTML(person.name)} ✨`; this.elements.name.value=person.name; this.elements.avatarInput.value=person.avatar||'❓'; this.elements.avatarDisplay.textContent=person.avatar||'❓'; this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(btn=>{btn.classList.toggle('selected',btn.dataset.emoji===person.avatar);}); this.elements.role.value=person.role; this.renderStyles(person.role); this.elements.style.value=person.style; this.renderTraits(person.role,person.style); requestAnimationFrame(()=>{if(person.traits){Object.entries(person.traits).forEach(([traitName,value])=>{const slider=this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`); if(slider){slider.value=value; this.updateTraitDescription(slider);}else{console.warn(`Slider for trait '${traitName}' not found during edit.`);}}); } this.updateLivePreview(); this.elements.save.textContent='Update Persona! ✨'; this.elements.formSection?.scrollIntoView({behavior:'smooth',block:'start'}); this.elements.name.focus(); this.updateStyleExploreLink(); });}
  deletePerson(personId){const index=this.people.findIndex(p=>p.id===personId); if(index===-1)return; const personName=this.people[index].name; if(confirm(`🚨 Really delete persona "${this.escapeHTML(personName)}"? This cannot be undone.`)){this.people.splice(index,1); this.saveToLocalStorage(); this.renderList(); this.showNotification(`"${this.escapeHTML(personName)}" deleted.`,"info"); if(this.currentEditId===personId){this.resetForm();}}}
  resetForm(isManualClear=false){if(isManualClear&&this.currentEditId){if(!confirm("Discard current edits and clear the form?")){return;}} this.elements.formTitle.textContent='✨ Create New Persona ✨'; this.elements.name.value=''; this.elements.avatarInput.value='❓'; this.elements.avatarDisplay.textContent='❓'; this.elements.avatarPicker?.querySelectorAll('.selected').forEach(btn=>btn.classList.remove('selected')); this.elements.role.value='submissive'; this.renderStyles('submissive'); this.elements.style.value=''; this.renderTraits('submissive',''); this.currentEditId=null; this.elements.save.textContent='Save Persona! 💖'; this.updateLivePreview(); if(isManualClear){this.elements.name.focus();} console.log("Form reset."); this.hideTraitInfo(); this.updateStyleExploreLink();}

  // --- Live Preview ---
  updateLivePreview(){const name=this.elements.name.value.trim()||"Persona Name";const avatar=this.elements.avatarInput.value||'❓';const role=this.elements.role.value;const style=this.elements.style.value;const traits={};let hasTraits=false;this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider=>{const traitName=slider.dataset.trait;if(traitName){traits[traitName]=slider.value;hasTraits=true;}});let html='';if(!role){html=`<p class="muted-text">Select a role...</p>`;}else if(!style&&!hasTraits){html=`<p class="muted-text">Select a style for ${this.escapeHTML(name)} (${role})...</p>`;}else if(!style&&hasTraits){const roleData=bdsmData[role];html=`<h3 class="preview-title">${avatar} ${this.escapeHTML(name)}’s Core Vibe ${avatar}</h3><p><strong>Role:</strong> ${role.charAt(0).toUpperCase()+role.slice(1)}</p><p class="muted-text"><i>Core traits active. Select a style for more details!</i></p>`;if(roleData?.coreTraits?.length>0){html+=`<div class="core-trait-preview"><strong>Core Traits:</strong><ul>`;roleData.coreTraits.forEach(ct=>{const score=traits[ct.name];if(score){const desc=ct.desc?.[score]||"N/A";html+=`<li><strong>${this.escapeHTML(ct.name)} (${score}):</strong> ${this.escapeHTML(desc)}</li>`;}});html+=`</ul></div>`;}else{html+=`<p class="muted-text">No core traits defined for this role.</p>`;}}else if(style){const getBreakdownFunc=role==='submissive'?getSubBreakdown:(role==='dominant'?getDomBreakdown:null);let breakdown={strengths:'',improvements:''};if(getBreakdownFunc){try{breakdown=getBreakdownFunc(style,traits);}catch(e){console.error("Error getting style breakdown:",e);}}let topStyleTraitInfo=null;const roleData=bdsmData[role];const styleObj=roleData?.styles?.find(st=>st.name===style);if(styleObj?.traits?.length>0){let topScore=-1;let topTraitName='';styleObj.traits.forEach(traitDef=>{const score=parseInt(traits[traitDef.name]||0,10);if(score>topScore){topScore=score;topTraitName=traitDef.name;}});if(topTraitName&&topScore>0){const traitDef=styleObj.traits.find(t=>t.name===topTraitName);const desc=traitDef?.desc?.[topScore]||"N/A";topStyleTraitInfo=`<strong>Top Style Trait (${this.escapeHTML(topTraitName)} Lvl ${topScore}):</strong> ${this.escapeHTML(desc)}`;}}html=`<h3 class="preview-title">${avatar} ${this.escapeHTML(name)}’s Vibe ${avatar}</h3><p><strong>Role:</strong> ${role.charAt(0).toUpperCase()+role.slice(1)}</p><p><strong>Style:</strong> ${this.escapeHTML(style)}</p>`;if(breakdown.strengths||breakdown.improvements){html+=`<div class="style-breakdown preview-breakdown">`;if(breakdown.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${breakdown.strengths}</div></div>`;if(breakdown.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${breakdown.improvements}</div></div>`;html+=`</div>`;}if(topStyleTraitInfo){html+=`<div class="top-trait-preview"><hr><p>${topStyleTraitInfo}</p></div>`;}}else{html=`<p class="muted-text">Select Role & Style to see the vibe! 🌈</p>`;}this.elements.livePreview.innerHTML=html;}


  // --- Modal Display ---
  // MODIFIED: showPersonDetails
  showPersonDetails(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) { this.showNotification("Could not find persona details.","error"); return; }
      console.log("Showing details for:", person);

      const { avatar = '❓', name } = person;

      let tabsHTML = `
          <button class="tab-link active" role="tab" aria-selected="true" aria-controls="tab-goals" data-tab="tab-goals">🎯 Goals</button>
          <button class="tab-link" role="tab" aria-selected="false" aria-controls="tab-traits" data-tab="tab-traits">🎨 Traits</button>
          <button class="tab-link" role="tab" aria-selected="false" aria-controls="tab-history" data-tab="tab-history">⏳ History</button>
          <button class="tab-link" role="tab" aria-selected="false" aria-controls="tab-journal" data-tab="tab-journal">📝 Journal</button>
          <button class="tab-link" role="tab" aria-selected="false" aria-controls="tab-reading" data-tab="tab-reading">🔮 Reading</button>
          <button class="tab-link" role="tab" aria-selected="false" aria-controls="tab-achievements" data-tab="tab-achievements">🏆 Achievements</button>
      `;
      let bodyHTML = `
          <div id="tab-goals" class="tab-content active" role="tabpanel" aria-labelledby="tab-goals"></div>
          <div id="tab-traits" class="tab-content" role="tabpanel" aria-labelledby="tab-traits"></div>
          <div id="tab-history" class="tab-content" role="tabpanel" aria-labelledby="tab-history"></div>
          <div id="tab-journal" class="tab-content" role="tabpanel" aria-labelledby="tab-journal"></div>
          <div id="tab-reading" class="tab-content" role="tabpanel" aria-labelledby="tab-reading"></div>
          <div id="tab-achievements" class="tab-content" role="tabpanel" aria-labelledby="tab-achievements"></div>
      `;

      if (this.elements.detailModalTitle) {
          this.elements.detailModalTitle.innerHTML = `${avatar} ${this.escapeHTML(name)}’s Kingdom ${avatar}`;
      }

      if (this.elements.modalTabs) this.elements.modalTabs.innerHTML = tabsHTML;
      if (this.elements.modalBody) this.elements.modalBody.innerHTML = bodyHTML;
      if (this.elements.modal) this.elements.modal.dataset.personId = personId;

      this.activeDetailModalTab = 'tab-goals';

      const initialTabContent = this.elements.modalBody?.querySelector(`#${this.activeDetailModalTab}`);
      if (initialTabContent) {
          this.renderDetailTabContent(person, this.activeDetailModalTab, initialTabContent);
          initialTabContent.dataset.rendered = 'true';
      }

      this.openModal(this.elements.modal);
  }

  // MODIFIED: renderDetailTabContent
  renderDetailTabContent(person, tabId, contentElement) {
      if (!person || !contentElement) return;
      console.log(`Rendering content for tab: ${tabId}`);
      contentElement.innerHTML = '<p class="loading-text">Loading...</p>';

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
                      this.renderGoalList(person);
                      break;

                  case 'tab-traits':
                      const { traits = {}, role = 'N/A', style = 'N/A' } = person;
                      const getBreakdownFunc = role === 'submissive' ? getSubBreakdown : (role === 'dominant' ? getDomBreakdown : null);
                      let breakdown = { strengths: 'N/A', improvements: 'N/A' };
                      if (getBreakdownFunc && style !== 'N/A') { try { breakdown = getBreakdownFunc(style, traits); } catch (e) {console.error("Error generating breakdown:",e);} }

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
                      this.renderHistoryChart(person, `history-chart-${personId}`);
                      break;

                  case 'tab-journal':
                      const { reflections = { text: '' } } = person;
                      html = `
                          <section class="reflections-section" aria-labelledby="reflections-heading-${personId}">
                              <h3 id="reflections-heading-${personId}">📝 Journal Reflections <button class="context-help-btn small-btn" data-help-key="journalSectionInfo" aria-label="Journal Info">ℹ️</button></h3>
                              <div id="journal-prompt-area-${personId}" style="display:none;" aria-live="polite"></div>
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
                        break;

                   case 'tab-achievements':
                       html = `
                           <section class="achievements-section" aria-labelledby="achievements-heading-${personId}">
                               <h3 id="achievements-heading-${personId}">🏆 Achievements Unlocked <button class="context-help-btn small-btn" data-help-key="achievementsSectionInfo" aria-label="Achievements Info">ℹ️</button></h3>
                               <div id="achievements-list-${personId}"></div>
                               <p class="muted-text" style="text-align: center; margin-top: 1em;">View all possible achievements via the header button!</p>
                           </section>`;
                       contentElement.innerHTML = html;
                       this.renderAchievementsList(person, `achievements-list-${personId}`);
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
  addGoal(personId){const person=this.people.find(p=>p.id===personId);const inputElement=this.elements.modalBody?.querySelector(`#new-goal-text-${personId}`);if(!person||!inputElement)return;const text=inputElement.value.trim();if(!text){this.showNotification("Goal text cannot be empty.","error");return;}const newGoal={id:Date.now(),text:text,status:'todo',createdAt:Date.now()};person.goals=person.goals||[];person.goals.push(newGoal);grantAchievement(person,'goal_added');this.saveToLocalStorage();this.renderGoalList(person);inputElement.value='';inputElement.focus();}
  toggleGoalStatus(personId,goalId){const person=this.people.find(p=>p.id===personId);const goal=person?.goals?.find(g=>g.id===goalId);if(!goal)return;goal.status=(goal.status==='done'?'todo':'done');if(goal.status==='done'){goal.completedAt=Date.now();grantAchievement(person,'goal_completed');const completedCount=person.goals.filter(g=>g.status==='done').length;if(completedCount>=5)grantAchievement(person,'five_goals_completed');}else{delete goal.completedAt;}this.saveToLocalStorage();this.renderGoalList(person);}
  deleteGoal(personId,goalId){const person=this.people.find(p=>p.id===personId);if(!person)return;if(confirm('🚨 Delete this goal permanently?')){person.goals=person.goals.filter(g=>g.id!==goalId);this.saveToLocalStorage();this.renderGoalList(person);this.showNotification("Goal deleted.","info");}}
  renderGoalList(person){const listElement=this.elements.modalBody?.querySelector(`#goal-list-${person.id}`);if(!listElement)return;const goals=person.goals||[];let htmlString='';if(goals.length>0){goals.sort((a,b)=>(a.status==='done'?1:-1)||(b.createdAt-a.createdAt));goals.forEach(goal=>{htmlString+=`<li class="${goal.status==='done'?'done':''}" data-goal-id="${goal.id}"><span>${this.escapeHTML(goal.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${goal.id}" aria-label="${goal.status==='done'?'Mark as to-do':'Mark as done'}">${goal.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn delete-btn" data-person-id="${person.id}" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button></span></li>`;});}else{htmlString=`<li class="muted-text">No goals set yet. Add one below!</li>`;}listElement.innerHTML=htmlString;}

  showJournalPrompt(personId){ const promptArea=this.elements.modalBody?.querySelector(`#journal-prompt-area-${personId}`); const textarea=this.elements.modalBody?.querySelector(`#reflections-text-${personId}`); if(promptArea&&textarea){const promptText=getRandomPrompt();promptArea.innerHTML=`<p class="journal-prompt">${this.escapeHTML(promptText)}</p>`;promptArea.style.display='block';textarea.focus();const person = this.people.find(p => p.id === personId); if(person) grantAchievement(person,'prompt_used'); this.saveToLocalStorage();}}

  // MODIFIED: Add saving indication
  saveReflections(personId){
      const person=this.people.find(p=>p.id===personId);
      const textarea=this.elements.modalBody?.querySelector(`#reflections-text-${personId}`);
      const saveButton=this.elements.modalBody?.querySelector(`#save-reflections-btn[data-person-id="${personId}"]`);

      if(!person||!textarea || !saveButton){this.showNotification("Error saving reflection.","error");return;}

      saveButton.disabled = true;
      saveButton.textContent = 'Saving...';

      setTimeout(() => {
          try {
              const text=textarea.value;
              if(!person.reflections)person.reflections={};
              person.reflections.text=text;
              person.reflections.lastUpdated=Date.now();
              let newlySaved=false; if(text.trim().length>0){newlySaved=grantAchievement(person,'reflection_saved');} const reflectionCount=this.people.reduce((count,p)=>{return count+(p.reflections?.text?.trim().length>0?1:0);},0); if(reflectionCount>=5)grantAchievement(person,'five_reflections');
              this.saveToLocalStorage();

              textarea.classList.add('input-just-saved');
              setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);

              this.showNotification("Reflection Saved! ✨","success");

          } catch(e) {
              console.error("Error saving reflection:", e);
              this.showNotification("Failed to save reflection.", "error");
          } finally {
              saveButton.textContent='Saved ✓';
              setTimeout(()=>{saveButton.textContent='Save Reflection 💭'; saveButton.disabled = false;},2000);
          }
      }, 300);
  }

  // MODIFIED: Add loading state
  addSnapshotToHistory(personId){
      const person=this.people.find(p=>p.id===personId);
      const snapshotButton = this.elements.modalBody?.querySelector(`#snapshot-btn[data-person-id="${personId}"]`);
      if(!person||!person.traits||Object.keys(person.traits).length===0){ this.showNotification("Cannot take snapshot: No traits recorded yet.","error"); return;}

      if (snapshotButton) {
          snapshotButton.disabled = true;
          snapshotButton.textContent = 'Saving...';
      }

      setTimeout(() => {
          try {
              const snapshot={date:Date.now(),traits:{...person.traits},style:person.style};
              person.history=person.history||[];
              person.history.push(snapshot);
              grantAchievement(person,'history_snapshot'); if(person.history.length>=10)grantAchievement(person,'ten_snapshots');
              this.saveToLocalStorage();
              this.showNotification("Snapshot saved! 📸","success");

              if (this.activeDetailModalTab === 'tab-history') {
                 const chartCanvasId = `history-chart-${personId}`;
                 this.renderHistoryChart(person, chartCanvasId);
              }
               if (this.activeDetailModalTab === 'tab-achievements') {
                  const listId = `achievements-list-${personId}`;
                  this.renderAchievementsList(person, listId);
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

  // MODIFIED: renderHistoryChart
  renderHistoryChart(person, canvasId) {
      const container=this.elements.modalBody?.querySelector(`#${canvasId}`)?.parentElement;
      const canvas=container?.querySelector(`#${canvasId}`);

      if(this.chartInstance && this.chartInstance.canvas.id === canvasId){
          this.chartInstance.destroy();
          this.chartInstance=null;
      }
      if(!container){console.error(`Chart container not found for canvas ID ${canvasId}`);return;}
      if(!canvas){container.innerHTML=`<p>Error: Chart canvas element missing.</p>`;return;}

      const history=person.history||[];
      if(history.length===0){ container.innerHTML=`<p class="muted-text">No history snapshots yet!</p>`; return;}
      if(container.querySelector('p')){container.innerHTML=`<canvas id="${canvasId}"></canvas>`;}

      container.classList.add('chart-loading');

      setTimeout(() => {
          try {
              const ctx=container.querySelector(`#${canvasId}`).getContext('2d');
              const labels=history.map(s=>new Date(s.date).toLocaleDateString());
              const allTraitNames=new Set();
              history.forEach(s=>Object.keys(s.traits).forEach(name=>allTraitNames.add(name)));
              if(person.traits)Object.keys(person.traits).forEach(name=>allTraitNames.add(name));

              const datasets=[];
              const colors=['#ff69b4','#8a5a6d','#a0d8ef','#dcc1ff','#ff85cb','#4a2c3d','#f4d4e4','#c49db1', '#f5b7b1', '#a9dfbf', '#f7dc6f', '#aebece'];
              let colorIndex=0;

              const roleData = bdsmData[person.role];
              const styleObj = roleData?.styles?.find(s => s.name === person.style);
              const currentTraitNames = new Set([
                  ...(roleData?.coreTraits?.map(t => t.name) || []),
                  ...(styleObj?.traits?.map(t => t.name) || [])
              ]);

              allTraitNames.forEach(traitName=>{
                  const data=history.map(s=>s.traits[traitName]!==undefined?parseInt(s.traits[traitName],10):null);
                  const color=colors[colorIndex%colors.length];
                  const isCurrentTrait = currentTraitNames.has(traitName);

                  datasets.push({
                      label:traitName.charAt(0).toUpperCase()+traitName.slice(1),
                      data:data, borderColor:color, backgroundColor:color+'80',
                      tension:0.1, fill:false, spanGaps:true,
                      pointRadius: isCurrentTrait ? 5 : 3,
                      borderWidth: isCurrentTrait ? 2.5 : 1.5,
                      pointHoverRadius:6
                  });
                  colorIndex++;
              });

              const isDark=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';
              const gridColor=isDark?'rgba(244, 212, 228, 0.15)':'rgba(74, 44, 61, 0.1)';
              const labelColor=isDark?'#c49db1':'#8a5a6d';

              this.chartInstance = new Chart(ctx,{
                  type:'line', data:{labels:labels,datasets:datasets},
                  options:{
                      responsive:true, maintainAspectRatio:false,
                      plugins:{
                          legend:{
                              position:'bottom', labels:{color:labelColor, boxWidth:12, padding:15},
                              onClick: (e, legendItem, legend) => {
                                  const index = legendItem.datasetIndex; const ci = legend.chart;
                                  if (ci.isDatasetVisible(index)) { ci.hide(index); legendItem.hidden = true; }
                                  else { ci.show(index); legendItem.hidden = false; }
                              }
                          },
                          tooltip:{mode:'index',intersect:false,backgroundColor:isDark?'rgba(255,255,255,0.9)':'rgba(0,0,0,0.8)',titleColor:isDark?'#000':'#fff',bodyColor:isDark?'#000':'#fff',borderColor:isDark?'#ccc':'#333',borderWidth:1}
                      },
                      scales:{y:{min:1,max:5,ticks:{stepSize:1,color:labelColor},grid:{color:gridColor}},x:{ticks:{color:labelColor},grid:{color:gridColor}}}
                  }
              });
          } catch (chartError) {
              console.error("Failed to render history chart:", chartError);
              container.innerHTML = `<p class="error-text">Could not display history chart.</p>`;
          } finally {
              container.classList.remove('chart-loading');
          }
      }, 50);
  }

  toggleSnapshotInfo(button){const infoPanel=button.closest('.history-section')?.querySelector('.snapshot-info');if(infoPanel){const isHidden=infoPanel.style.display==='none';infoPanel.style.display=isHidden?'block':'none';button.setAttribute('aria-expanded',isHidden);}}

  // MODIFIED: Renamed
  renderAchievementsList(person, listElementId){
      const listElement=this.elements.modalBody?.querySelector(`#${listElementId}`);
      if(!listElement)return;
      const achievements=person.achievements||[];
      let htmlString='';
      if(achievements.length>0){
          htmlString+=`<ul>`;
          achievements.forEach(id=>{ const details=achievementList[id]; if(details){ const icon=details.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0]||'🏆'; htmlString+=`<li title="${this.escapeHTML(details.desc)}"><span class="achievement-icon">${icon}</span><span class="achievement-name">${this.escapeHTML(details.name)}</span></li>`;}});
          htmlString+=`</ul>`;
      } else { htmlString=`<p class="muted-text">No achievements unlocked for this persona yet!</p>`;}
      listElement.innerHTML=htmlString;
   }

  // NEW: Show the dedicated Achievements Modal
  showAchievements() {
    if (!this.elements.achievementsBody || !this.elements.achievementsModal) return;

    const allUnlockedIds = new Set(this.people.flatMap(p => p.achievements || []));
    let html = '<h2>🏆 All Unlocked Achievements 🏆</h2>';
    html += '<p>Achievements earned across all your personas.</p>';
    html += '<ul class="all-achievements-list">';

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
                    <div class="achievement-details"> {/* NEW Wrapper */}
                        <span class="achievement-name">${this.escapeHTML(details.name)}</span>
                        ${unlocked ? `<span class="achievement-desc">${this.escapeHTML(details.desc)}</span>` : '<span class="achievement-desc muted-text">Keep exploring to unlock!</span>'}
                    </div>
                </li>`;
        });
    }

    html += '</ul>';
    this.elements.achievementsBody.innerHTML = html;
    this.openModal(this.elements.achievementsModal);
}


  showKinkReading(personId){ const person=this.people.find(p=>p.id===personId); const outputElement=this.elements.modalBody?.querySelector(`#kink-reading-output-${personId}`); if(!person||!outputElement)return; grantAchievement(person,'kink_reading'); this.saveToLocalStorage(); if (this.activeDetailModalTab === 'tab-achievements') {this.renderAchievementsList(person, `achievements-list-${personId}`);} let reading=`🔮 ${this.escapeHTML(person.name)}'s Kink Compass Reading 🔮\n\nEmbracing the path of a **${this.escapeHTML(person.style)} ${person.role}**, your journey unfolds with unique sparkles!\n\n`; const traits=person.traits||{}; const sortedTraits=Object.entries(traits).map(([name,score])=>({name,score:parseInt(score,10)})).sort((a,b)=>b.score-a.score); if(sortedTraits.length>0){const highest=sortedTraits[0];const lowest=sortedTraits[sortedTraits.length-1];const coreTrait1=bdsmData[person.role]?.coreTraits?.[0]?.name;const coreTrait2=bdsmData[person.role]?.coreTraits?.[1]?.name;reading+=`✨ Your current North Star appears to be **${highest.name} (Lvl ${highest.score})**: ${this.getReadingDescriptor(highest.name,highest.score)}.\n\n`;if(coreTrait1&&traits[coreTrait1]!==undefined){reading+=`🧭 Core Compass Point - **${coreTrait1} (Lvl ${traits[coreTrait1]})**: Reflects ${this.getReadingDescriptor(coreTrait1,traits[coreTrait1])}.\n`;}if(coreTrait2&&traits[coreTrait2]!==undefined){reading+=`🧭 Core Compass Point - **${coreTrait2} (Lvl ${traits[coreTrait2]})**: Resonates with ${this.getReadingDescriptor(coreTrait2,traits[coreTrait2])}.\n`;}if(sortedTraits.length>1&&highest.score!==lowest.score){reading+=`\n🌱 An area ripe for exploration or growth might be **${lowest.name} (Lvl ${lowest.score})**: Consider exploring aspects of ${this.getReadingDescriptor(lowest.name,lowest.score)}.\n`;}}else{reading+=`Your trait map is currently uncharted! Explore the sliders to define your path.\n`;}reading+=`\n💖 Remember, the essence of being a ${this.escapeHTML(person.style)} is about **${this.getStyleEssence(person.style)}**. Continue exploring authentically!\n`; outputElement.textContent=reading; outputElement.style.display='block'; outputElement.focus();}
  getReadingDescriptor(traitName,score){score=parseInt(score,10); const highThreshold=4; const lowThreshold=2; const baseDescriptions={'obedience':'following guidance','trust':'opening up','service':'helping others','presentation':'how you appear','playful defiance':'pushing boundaries','mischief':'causing playful trouble','devotion':'deep loyalty','surrender':'letting go of control','affection seeking':'desiring closeness','playfulness':'engaging in fun','non-verbal expression':'communicating without words','age regression comfort':"embracing a younger mindset",'need for guidance':'relying on structure','boundless energy':'enthusiasm','trainability':'learning quickly','curiosity':'investigating','gracefulness':'poise','desire for pampering':'being spoiled','delegation tendency':'letting others help','rope enthusiasm':'enjoying bonds','patience during tying':'stillness','pain interpretation':'processing sensation','sensation seeking':'craving intensity','enjoyment of chase':'the thrill of pursuit','fear play comfort':'flirting with vulnerability','objectification comfort':'being a focus','responsiveness to control':'adapting to direction','aesthetic focus':'visual appeal','stillness / passivity':'calm inaction','shyness / skittishness':'gentle caution','gentle affection need':'soft interactions','task focus':'completing duties','anticipating needs':'proactive help','enthusiasm for games':'loving play','good sport':'playing fairly','vulnerability expression':'showing softness','coquettishness':'playful charm','struggle performance':'acting resistant','acceptance of fate':'inner yielding','mental focus':'deep concentration','suggestibility':'openness to influence','responsiveness to direction':'following commands','passivity in control':'waiting for direction','attention to detail':'precision','uniformity':'embracing attire','pain seeking':'desiring intensity','endurance display':'showing toughness','receptivity':'openness to receiving','power exchange focus':'enjoying the dynamic','authority':'taking charge','care':'nurturing others','leadership':'guiding','control':'managing details','direct communication':'clarity','boundary setting':'defining limits','emotional support':'comforting others','patience':'calm guidance','rule enforcement':'maintaining order','discipline focus':'using consequences','expectation setting':'defining standards','presence':'commanding aura','protective guidance':'fatherly care','affectionate authority':'warm firmness','nurturing comfort':'motherly care','gentle discipline':'kind correction','possessiveness':'claiming','behavioral training':'shaping actions','rope technique':'skill with knots','aesthetic vision':'visual artistry','sensation control':'precise delivery','psychological focus':"observing reactions",'pursuit drive':'instinct to chase','instinct reliance':'acting on gut feeling','skill development focus':'teaching ability','structured methodology':'using clear steps','fine motor control':'precise direction','objectification gaze':'viewing as object','vigilance':'watchfulness','defensive instinct':'shielding others','consequence delivery':'administering punishment','detachment during discipline':'objectivity','holistic well-being focus':'overall care','rule implementation for safety':'practical structure','formal demeanor':'respectful authority','service expectation':'requiring respect','worship seeking':'desiring adoration','effortless command':'innate authority','strategic direction':'planning actions','decisiveness':'firm choices',}; const defaultDesc=traitName; if(score>=highThreshold){return`a strong affinity for ${baseDescriptions[traitName]||defaultDesc}`;}else if(score<=lowThreshold){return`potential hesitation or less focus on ${baseDescriptions[traitName]||defaultDesc}`;}else{return`a balanced approach to ${baseDescriptions[traitName]||defaultDesc}`;}}
  getStyleEssence(styleName){const essences={'Classic Submissive':'trust and willingness','Brat':'playful challenge and connection','Slave':'profound devotion and service','Pet':'affectionate loyalty and play','Little':'innocent joy and secure dependence','Puppy':'boundless enthusiasm and eagerness to please','Kitten':'curious grace and affectionate independence','Princess':'being cherished and adored','Rope Bunny':'aesthetic surrender and sensation','Masochist':'transcending limits through sensation','Prey':'the exhilarating dance of pursuit','Toy':'delighting in being used and responsive','Doll':'embodying curated perfection and passivity','Bunny':'gentle connection and soft vulnerability','Servant':'finding purpose in meticulous duty','Playmate':'shared joy and adventurous fun','Babygirl':'charming vulnerability and needing care','Captive':'the dramatic tension of capture and surrender','Thrall':'deep mental connection and yielding','Puppet':'responsive surrender to direct control','Maid':'order, presentation, and respectful service','Painslut':'boldly embracing and seeking intensity','Bottom':'receptive strength and power exchange','Classic Dominant':'confident guidance and responsibility','Assertive':'clear communication and setting direction','Nurturer':'compassionate support and fostering growth','Strict':'structure, order, and clear expectations','Master':'profound authority and shaping potential','Mistress':'elegant command and creative control','Daddy':'protective guidance and affectionate firmness','Mommy':'warm nurturing and gentle structure','Owner':'possessive care and shaping behavior','Rigger':'the artful application of restraint','Sadist':'the controlled exploration of sensation','Hunter':'the primal thrill of the chase','Trainer':'patiently cultivating skills and discipline','Puppeteer':'precise control and creative direction','Protector':'steadfast vigilance and ensuring safety','Disciplinarian':'fair correction and maintaining standards','Caretaker':'holistic well-being and providing comfort','Sir':'dignified authority and earned respect','Goddess':'inspiring worship through presence','Commander':'strategic leadership and decisive action','Fluid Switch': 'versatility and dynamic flow', 'Dominant-Leaning Switch':'leading with flexibility', 'Submissive-Leaning Switch':'following with flexibility', 'Situational Switch':'adapting to the moment'}; const key=styleName?.replace(/\(.*?\)/g,'').trim()||''; return essences[key]||`your unique expression`;}

  // MODIFIED: showGlossary with logging and test structure
showGlossary(termKeyToHighlight = null) {
    // Add logs INSIDE this function
    console.log("--- Entering showGlossary (Testing Import) ---", termKeyToHighlight); // <<-- Log Entry

    console.log("Imported glossaryTerms:", glossaryTerms); // <<-- FOCUS ON THIS LOG
    // Check if it's an object and has keys
    if (typeof glossaryTerms !== 'object' || glossaryTerms === null || Object.keys(glossaryTerms).length === 0) {
         console.error("!!! glossaryTerms is empty or invalid!", glossaryTerms);
    }

    // --- >>> TEMPORARILY COMMENT OUT FROM HERE... <<< ---
    /*
    if (!this.elements.glossaryBody || !this.elements.glossaryModal) {
        console.error("!!! showGlossary Error: Missing glossaryBody or glossaryModal element!");
        return; // Stop if elements are missing
    }
    console.log("Glossary elements found:", this.elements.glossaryBody, this.elements.glossaryModal);

    grantAchievement({}, 'glossary_user');

    let html = '<dl>';
    try { // Add try..catch around HTML generation
        Object.entries(glossaryTerms).sort((a, b) => a[1].term.localeCompare(b[1].term))
            .forEach(([key, termData]) => {
                 // Log inside the loop for the first item only?
                 if (html === '<dl>') { // Log only once
                     console.log("Looping through glossary term:", key, termData);
                 }
                 // --- Original HTML Generation Logic Would Be Here ---
                 const termId = `gloss-term-${key}`;
                 const isHighlighted = key === termKeyToHighlight;
                 html += `<dt id="${termId}" class="${isHighlighted ? 'highlighted-term' : ''}">${this.escapeHTML(termData.term)}</dt>`;
                 html += `<dd>${this.escapeHTML(termData.definition)}`;
                 if (termData.related?.length) {
                     html += `<br><span class="related-terms">See also: `;
                     html += termData.related.map(relKey => {
                         const relatedTerm = glossaryTerms[relKey]?.term || relKey;
                         return `<a href="#gloss-term-${relKey}" class="glossary-link" data-term-key="${relKey}">${this.escapeHTML(relatedTerm)}</a>`;
                     }).join(', ');
                     html += `</span>`;
                 }
                 html += `</dd>`;
                 // --- End of original HTML Generation ---
            });
        html += '</dl>';
        console.log("Generated Glossary HTML (snippet):", html.substring(0, 200));
    } catch (htmlError) {
         console.error("!!! showGlossary Error: Failed to generate HTML!", htmlError);
         this.elements.glossaryBody.innerHTML = "<p class='error-text'>Error loading glossary content.</p>";
         // this.openModal(this.elements.glossaryModal); // Don't open if HTML failed
         return;
    }

    this.elements.glossaryBody.innerHTML = html;
    console.log("Set glossaryBody innerHTML.");

    this.openModal(this.elements.glossaryModal);
    console.log("Called openModal for glossaryModal.");

    // Scroll logic (should happen after modal is open)
    if (termKeyToHighlight) {
         const termElement = this.elements.glossaryBody.querySelector(`#gloss-term-${termKeyToHighlight}`);
         requestAnimationFrame(() => { // Ensure element is visible before scrolling
            termElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         });
    }
    */
    // --- >>> ...TO HERE <<< ---

    console.log("--- Exiting showGlossary (Testing Import) ---"); // <<-- Log Exit
} // <--- This is the closing brace for the showGlossary function


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


  setTheme(themeName){ document.body.setAttribute('data-theme',themeName); const isDark=themeName==='dark'||themeName==='velvet'; if(this.elements.themeToggle){this.elements.themeToggle.textContent=isDark?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${isDark?'Light':'Dark'} Mode`);} try{localStorage.setItem('kinkCompassTheme',themeName);}catch(e){console.warn("Failed to save theme:",e);} if(this.chartInstance&&this.currentEditId){const person=this.people.find(p=>p.id===this.currentEditId); if(person && this.activeDetailModalTab === 'tab-history'){ const chartCanvasId = `history-chart-${this.currentEditId}`; this.renderHistoryChart(person, chartCanvasId);}} } // Re-render chart on theme change if visible
  applySavedTheme(){let savedTheme='light';try{if(typeof localStorage!=='undefined')savedTheme=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Failed to read saved theme:",e);}this.setTheme(savedTheme);console.log(`Applied saved theme: ${savedTheme}`);}
  toggleTheme(){const currentTheme=document.body.getAttribute('data-theme')||'light';const isCurrentlyDark=currentTheme==='dark'||currentTheme==='velvet';this.setTheme(isCurrentlyDark?'light':'dark');}
  exportData(){if(this.people.length===0){this.showNotification("No personas to export!","info");return;}try{const dataString=JSON.stringify(this.people,null,2);const blob=new Blob([dataString],{type:"application/json"});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`kinkcompass_personas_${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(url);grantAchievement({},'data_exported');this.showNotification("Data exported successfully!","success");anchor.remove();}catch(e){console.error("Export failed:",e);this.showNotification("Export failed.","error");}}
  importData(event){const file=event.target.files?.[0];if(!file){return;}if(file.type!=="application/json"){this.showNotification("Import failed: File must be JSON.","error");event.target.value=null;return;}const reader=new FileReader();reader.onload=(e)=>{try{const importedData=JSON.parse(e.target.result);if(!Array.isArray(importedData)){throw new Error("Invalid format: Not an array.");}const validatedData=importedData.map(p=>({...p,id:p.id??Date.now(),name:p.name??"Unnamed",role:p.role??"submissive",style:p.style??"",avatar:p.avatar||'❓',goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'&&p.reflections!==null?p.reflections:{text:p.reflections||''},traits:typeof p.traits==='object'&&p.traits!==null?p.traits:{}}));if(confirm(`Import ${validatedData.length} personas? This will OVERWRITE your current ${this.people.length} personas.`)){this.people=validatedData;this.saveToLocalStorage();this.renderList();this.resetForm();this.showNotification(`Imported ${this.people.length} personas.`,"success");grantAchievement({},'data_imported');}}catch(err){console.error("Import failed:",err);this.showNotification(`Import failed: ${err.message}`,"error");}finally{event.target.value=null;}};reader.onerror=()=>{this.showNotification("Error reading file.","error");event.target.value=null;};reader.readAsText(file);}

  showTraitInfo(traitName){ const roleKey=this.elements.role.value; const styleName=this.elements.style.value; const roleData=bdsmData[roleKey]; let traitDef=null; if(roleData){if(styleName){const styleObj=roleData.styles?.find(s=>s.name===styleName); traitDef=styleObj?.traits?.find(t=>t.name===traitName);} if(!traitDef)traitDef=roleData.coreTraits?.find(t=>t.name===traitName); if(!traitDef&&roleKey==='switch')traitDef=bdsmData.switch?.coreTraits?.find(t=>t.name===traitName);} if(traitDef&&this.elements.traitInfoPopup&&this.elements.traitInfoTitle&&this.elements.traitInfoBody){const title=traitName.charAt(0).toUpperCase()+traitName.slice(1); this.elements.traitInfoTitle.textContent=`${this.getEmojiForScore(3)} ${title} Levels Explained`; let bodyHtml=''; for(let i=1;i<=5;i++){const score=String(i); const description=traitDef.desc?.[score]||`(No description for Level ${score})`; const emoji=this.getEmojiForScore(score); bodyHtml+=`<p><strong>${emoji} Level ${score}:</strong> ${this.escapeHTML(description)}</p>`;} this.elements.traitInfoBody.innerHTML=bodyHtml; this.elements.traitInfoPopup.style.display='block'; this.elements.traitInfoPopup.setAttribute('aria-hidden','false'); this.elements.traitInfoClose?.focus(); // this.elements.traitInfoPopup.scrollIntoView({behavior:'smooth',block:'nearest'}); // Might not be needed if popup overlays
  } else {console.warn(`Could not find trait definition or popup elements for '${traitName}'`); this.hideTraitInfo();} }
  hideTraitInfo(){if(this.elements.traitInfoPopup){this.elements.traitInfoPopup.style.display='none'; this.elements.traitInfoPopup.setAttribute('aria-hidden','true');}}

  // NEW: Show/Hide Generic Context Help Popup
  showContextHelp(helpKey) {
      const helpText = contextHelpTexts[helpKey];
      if (helpText && this.elements.contextHelpPopup && this.elements.contextHelpTitle && this.elements.contextHelpBody) {
          const title = helpKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/ Info$/, '');
          this.elements.contextHelpTitle.textContent = `💡 ${title} Explained`;
          this.elements.contextHelpBody.innerHTML = `<p>${this.escapeHTML(helpText)}</p>`;
          this.elements.contextHelpPopup.style.display = 'block';
          this.elements.contextHelpPopup.setAttribute('aria-hidden', 'false');
          this.elements.contextHelpClose?.focus();
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
  sfStart(){this.sfActive=true; this.sfStep=0; this.sfRole=null; this.sfIdentifiedRole=null; this.sfAnswers={rolePreference:null, traits:{}}; this.sfScores={}; this.sfHasRenderedDashboard=false; this.sfPreviousScores={}; this.sfTraitSet=[]; this.sfSteps=[]; if(this.elements.sfDashboard)this.elements.sfDashboard.style.display='none'; if(this.elements.sfFeedback)this.elements.sfFeedback.textContent=''; if(!this.elements.sfStepContent){console.error("SF step content element missing!"); alert("Error starting Style Finder."); return;} this.openModal(this.elements.sfModal); this.sfRenderStep(); this.sfShowFeedback("Let’s begin your journey!"); grantAchievement({},'style_finder_complete'); this.sfShowDashboardDuringTraits = false; } // Reset dashboard toggle on start
  sfClose(){this.sfActive=false; this.closeModal(this.elements.sfModal); console.log("Style Finder closed.");}
  sfCalculateSteps(){this.sfSteps=[]; this.sfSteps.push({type:'welcome'}); this.sfSteps.push({type:'roleIdentification'}); if(this.sfIdentifiedRole==='switch'){this.sfSteps.push({type:'switchClarification'});} if(this.sfRole){const baseTraitSet=(this.sfRole==='dominant'?this.sfDomFinderTraits:this.sfSubFinderTraits); if(this.sfTraitSet.length===0){this.sfTraitSet=[...baseTraitSet].sort(()=>0.5-Math.random());} this.sfTraitSet.forEach(trait=>this.sfSteps.push({type:'trait',trait:trait.name})); this.sfSteps.push({type:'roundSummary',round:'Traits'});} this.sfSteps.push({type:'result'});}
  // MODIFIED: Style Finder Step Rendering
  sfRenderStep() {
      if (!this.sfActive || !this.elements.sfStepContent) return;
      this.sfCalculateSteps();
      if (this.sfStep < 0 || this.sfStep >= this.sfSteps.length) { console.error(`Invalid SF step index: ${this.sfStep}. Resetting.`); this.sfStep=0; this.sfCalculateSteps(); if (this.sfSteps.length === 0){this.elements.sfStepContent.innerHTML="<p>Error calculating steps.</p>"; return;}}

      const step=this.sfSteps[this.sfStep];
      if(!step){console.error(`No step data for index ${this.sfStep}`); this.elements.sfStepContent.innerHTML="<p>Error loading step.</p>"; return;}
      console.log(`Rendering SF Step ${this.sfStep}:`,step);

      let html="";
      const progressTracker=this.elements.sfProgressTracker;
      if(step.type==='trait'&&this.sfRole&&this.sfTraitSet.length>0){const currentTraitIndex=this.sfTraitSet.findIndex(t=>t.name===step.trait); if(currentTraitIndex!==-1&&progressTracker){const questionsLeft=this.sfTraitSet.length-(currentTraitIndex+1); progressTracker.style.display='block'; progressTracker.textContent=`Trait ${currentTraitIndex+1} / ${this.sfTraitSet.length} (${questionsLeft} more!)`;}else{if(progressTracker)progressTracker.style.display='none'; console.warn(`Trait '${step.trait}' not found for progress.`);}}else{if(progressTracker)progressTracker.style.display='none';}

      switch(step.type){
          case 'welcome':html=`<h2>Welcome, Brave Explorer!</h2><p>Dive into a quest to find your BDSM style!</p><div class="sf-button-container"><button data-action="next">Start the Journey! ✨</button></div>`; break;
          case 'roleIdentification':html=`<h2>Your Core Inclination?</h2><p>When you think about dynamics, do you naturally gravitate towards:</p><div class="sf-button-container"><button data-action="identifyRole" data-identified-role="dominant">Leading / Guiding?</button><button data-action="identifyRole" data-identified-role="submissive">Following / Supporting?</button><button data-action="identifyRole" data-identified-role="switch">Both / It Depends?</button></div>`; break;
          case 'switchClarification':html=`<h2>Switch Exploration!</h2><p>You indicated you enjoy both roles! For this quiz, which side do you want to explore *right now* to find related styles?</p><div class="sf-button-container"><button data-action="setRole" data-role="dominant">Explore my Dominant side</button><button data-action="setRole" data-role="submissive">Explore my Submissive side</button><button data-action="prev">Back to Role Choice</button></div>`; break;
          case 'trait':
              const traitObj=this.sfTraitSet.find(t=>t.name===step.trait); if(!traitObj){html=`<p>Error loading trait: ${step.trait}.</p> <button data-action="prev">Back</button>`; break;}
              const currentValue=this.sfAnswers.traits[traitObj.name]??5;
              const footnoteSet=(this.sfRole==='dominant'?this.sfDomTraitFootnotes:this.sfSubTraitFootnotes);
              const footnote=footnoteSet[traitObj.name]||"1: Least / 10: Most";
              const isFirstTraitStep=this.sfSteps.findIndex(s=>s.type==='trait')===this.sfStep;
              const sliderDescArray=this.sfSliderDescriptions?.[traitObj.name]??[];
              const safeCurrentValue=Number(currentValue); let sliderDescText=`Level ${safeCurrentValue}`; const safeIndex=safeCurrentValue-1;
              if(safeIndex>=0&&safeIndex<sliderDescArray.length){sliderDescText=sliderDescArray[safeIndex];}else{console.warn(`Slider desc OOB for '${traitObj.name}' at ${safeCurrentValue}`);}

              html=`<h2>${this.escapeHTML(traitObj.desc)}<button class="sf-info-icon" data-trait="${traitObj.name}" data-action="showTraitInfo" aria-label="More info about ${traitObj.name}">ℹ️</button></h2>`;
              if(isFirstTraitStep){html += `<p>Rate how much this resonates with you (1=Not at all, 10=Very much!). <strong>5 is neutral.</strong></p>`;}
              html+=`<input type="range" min="1" max="10" value="${safeCurrentValue}" class="sf-trait-slider" data-trait="${traitObj.name}" aria-label="${traitObj.name} rating">
                     <div id="sf-desc-${traitObj.name}" class="sf-slider-description">${this.escapeHTML(sliderDescText)}</div>
                     <p class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                     <div class="sf-button-container">
                         <button data-action="next" data-trait="${traitObj.name}">Next Step!</button>
                         ${this.sfStep>2?`<button data-action="prev">Back</button>`:''}
                         <button id="sf-dashboard-toggle" data-action="toggleDashboard">${this.sfShowDashboardDuringTraits ? 'Hide' : 'Show'} Live Vibes</button>
                     </div>`;
              break;
          case 'roundSummary':html=`<h2>${step.round} Check-In!</h2><p>Here’s how your choices are shaping up:</p><div id="sf-summary-dashboard-placeholder">Loading Dashboard...</div><div class="sf-button-container"><button data-action="next">See Top Style!</button><button data-action="prev">Back</button></div>`; requestAnimationFrame(()=>this.sfUpdateDashboard(true)); break;
          case 'result':
              this.sfCalculateResult(); const sortedScores=Object.entries(this.sfScores).sort((a,b)=>b[1]-a[1]);
              if(sortedScores.length===0||!sortedScores[0]||sortedScores[0][1]<=0){html=`<div class="sf-result-section sf-fade-in"><h2 class="sf-result-heading">Hmm... 🤔</h2><p>Not enough specific trait data for role '${this.sfRole}' to determine a top style. Your vibe is uniquely you!</p><div class="sf-result-buttons"><button data-action="startOver">Try Again?</button><button data-action="close">Close</button></div></div>`; break;}
              const topStyle=sortedScores[0][0]; const matchData=this.sfDynamicMatches[topStyle]||{dynamic:"Unique",match:"Explorer",desc:"Find your perfect match!",longDesc:"Explore dynamics that resonate!"}; const descData=this.sfStyleDescriptions[topStyle]||{short:"A unique blend!",long:"Your combination of traits creates a special style.",tips:["Keep exploring!","Communicate your desires."]};

              html=`<div class="sf-result-section sf-fade-in"><h2 class="sf-result-heading">🎉 Your Top Style (Exploring ${this.sfRole}): ${this.escapeHTML(topStyle)} 🎉</h2><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p><h3>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h3><p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.desc)}</p><p>${this.escapeHTML(matchData.longDesc)}</p><h3>Tips for You:</h3><ul style="text-align: left; margin: 10px auto; max-width: 350px; list-style: '✨ '; padding-left: 1.5em;">${descData.tips.map(tip=>`<li>${this.escapeHTML(tip)}</li>`).join('')}</ul>`;
              if(this.sfIdentifiedRole==='switch'){html+=`<p><em>As a Switch, you might also resonate with styles from the other role. Feel free to run the finder again exploring your other side!</em></p>`;}
              html+=`<div class="sf-result-buttons"><button data-action="applyStyle" data-role="${this.sfRole}" data-style="${this.escapeHTML(topStyle)}">📝 Track This Style!</button><button data-action="startOver">Try Again?</button><button data-action="showFullDetails" data-style="${this.escapeHTML(topStyle)}">More Details</button><button data-action="close">Close</button></div></div>`;
              if(window.confetti){setTimeout(()=>confetti({particleCount:150,spread:80,origin:{y:0.6},colors:['#ff69b4','#ff85cb','#f4d4e4','#fff','#a0d8ef','#dcc1ff']}),300);}
              break;
          default:html="<p>Oops! Something went wrong.</p> <button data-action='prev'>Back</button>";
      }

      try {
          if(!this.elements.sfStepContent)throw new Error("sfStepContent element missing");
          this.elements.sfStepContent.innerHTML=html;
          if(step.type==='trait'){ this.sfUpdateDashboard(); } // Always call, function decides visibility
          else if(step.type!=='roundSummary'){ if(this.elements.sfDashboard)this.elements.sfDashboard.style.display='none'; }
          console.log(`SF Step ${this.sfStep} rendered successfully.`);
      } catch(e){console.error(`Render SF Step ${this.sfStep} Error:`,e); if(this.elements.sfStepContent){this.elements.sfStepContent.innerHTML=`<p>Error rendering step.</p> <button data-action="prev">Back</button>`;}}}

  sfSetRole(role){if(this.sfRole!==role){this.sfRole=role; this.sfAnswers.traits={}; this.sfScores={}; this.sfPreviousScores={}; this.sfHasRenderedDashboard=false; this.sfTraitSet=[]; this.sfSteps=[];} this.sfNextStep();}
  sfSetTrait(trait,value){this.sfAnswers.traits[trait]=parseInt(value,10); this.sfShowFeedback(`You vibe with ${trait} at ${value}!`);}
  sfNextStep(){this.sfStep++; this.sfRenderStep();}
  sfPrevStep(){if(this.sfStep>0){const stepWeAreLeaving=this.sfSteps[this.sfStep]; this.sfStep--; const stepWeAreGoingTo=this.sfSteps[this.sfStep]; if(stepWeAreLeaving?.type==='result'||stepWeAreLeaving?.type==='roundSummary'){console.log("Moving back, resetting scores."); this.sfScores={}; this.sfPreviousScores={}; this.sfHasRenderedDashboard=false;} if(stepWeAreGoingTo?.type==='roleIdentification'){this.sfIdentifiedRole=null; this.sfRole=null; this.sfTraitSet=[]; this.sfAnswers.traits={};} else if(stepWeAreGoingTo?.type==='switchClarification'){this.sfRole=null; this.sfTraitSet=[]; this.sfAnswers.traits={};} this.sfRenderStep();}}
  sfStartOver(){this.sfStep=0; this.sfRole=null; this.sfIdentifiedRole=null; this.sfAnswers={rolePreference:null, traits:{}}; this.sfScores={}; this.sfPreviousScores={}; this.sfHasRenderedDashboard=false; this.sfTraitSet=[]; this.sfSteps=[]; if(this.elements.sfDashboard)this.elements.sfDashboard.style.display='none'; this.sfShowDashboardDuringTraits = false; this.sfRenderStep(); this.sfShowFeedback("Fresh start—here we go!");}
  sfComputeScores(){let scores={}; if(!this.sfRole||!this.sfStyles[this.sfRole])return scores; const roleStyles=this.sfStyles[this.sfRole]; roleStyles.forEach(style=>{scores[style]=0;}); const traitAnswers=this.sfAnswers.traits; Object.keys(traitAnswers).forEach(trait=>{const rating=traitAnswers[trait]??0; roleStyles.forEach(style=>{const keyTraits=this.sfStyleKeyTraits[style]||[]; if(keyTraits.includes(trait)){let weight=1.5; scores[style]+=rating*weight;}});}); return scores;}

  // MODIFIED: Update dashboard based on toggle state
  sfUpdateDashboard(forceVisible = false) {
      if (!this.sfSteps || this.sfSteps.length === 0) this.sfCalculateSteps();
      const currentStep = this.sfSteps[this.sfStep];
      const currentStepType = currentStep?.type;
      const shouldShow = forceVisible || (this.sfRole && currentStepType === 'trait' && this.sfShowDashboardDuringTraits);

      if (!this.elements.sfDashboard) {console.error("Dashboard element missing!"); return;}

      if (!shouldShow) { this.elements.sfDashboard.style.display = 'none'; return; }

      this.elements.sfDashboard.style.display = 'block';
      const scores=this.sfComputeScores();
      const sortedScores=Object.entries(scores).filter(([_,score])=>score>0.1).sort((a,b)=>b[1]-a[1]).slice(0,7);
      let dashboardHTML="<div class='sf-dashboard-header'>✨ Your Live Vibes! ✨</div>";
      if(sortedScores.length===0){dashboardHTML+="<p class='muted-text' style='padding: 10px;'>Keep rating traits!</p>";}
      else{
          const previousPositions={}; if(this.sfPreviousScores){Object.entries(this.sfPreviousScores).filter(([_,score])=>score>0.1).sort((a,b)=>b[1]-a[1]).forEach(([style,_],index)=>{previousPositions[style]=index;});}
          const isFirstRender=!this.sfHasRenderedDashboard;
          const styleIcons=this.getStyleIcons();
          sortedScores.forEach(([style,score],index)=>{
              const prevPos=previousPositions[style]??index; const movement=prevPos-index;
              let moveIndicator=''; if(!isFirstRender&&movement>0)moveIndicator='<span class="sf-move-up">↑</span>'; else if(!isFirstRender&&movement<0)moveIndicator='<span class="sf-move-down">↓</span>';
              const prevScore=this.sfPreviousScores?(this.sfPreviousScores[style]||0):0; const delta=score-prevScore;
              let deltaDisplay=''; if(!isFirstRender&&Math.abs(delta)>0.1){deltaDisplay=`<span class="sf-score-delta ${delta>0?'positive':'negative'}">${delta>0?'+':''}${delta.toFixed(1)}</span>`;}
              const animationClass=isFirstRender?'sf-fade-in':'';
              dashboardHTML+=`<div class="sf-dashboard-item ${animationClass}"><span class="sf-style-name">${styleIcons[style]||'🌟'} ${this.escapeHTML(style)}</span><span class="sf-dashboard-score">${score.toFixed(1)} ${deltaDisplay} ${moveIndicator}</span></div>`;
          });
      }
      this.elements.sfDashboard.innerHTML=dashboardHTML;
      this.sfPreviousScores={...scores};
      this.sfHasRenderedDashboard=true;
  }

  // NEW: Toggle dashboard visibility state
  toggleStyleFinderDashboard() {
      this.sfShowDashboardDuringTraits = !this.sfShowDashboardDuringTraits;
      const toggleButton = this.elements.sfStepContent?.querySelector('#sf-dashboard-toggle');
      if (toggleButton) {
          toggleButton.textContent = `${this.sfShowDashboardDuringTraits ? 'Hide' : 'Show'} Live Vibes`;
      }
      this.sfUpdateDashboard();
  }

  sfCalculateResult(){this.sfScores=this.sfComputeScores(); const totalAnswers=Object.keys(this.sfAnswers.traits).length; if(totalAnswers===0)return; console.log("Final Scores Calculated:",this.sfScores);}
  sfShowFeedback(message){if(!this.elements.sfFeedback)return; this.elements.sfFeedback.textContent=this.escapeHTML(message); this.elements.sfFeedback.classList.remove('sf-feedback-animation'); void this.elements.sfFeedback.offsetWidth; this.elements.sfFeedback.classList.add('sf-feedback-animation');}
  sfShowTraitInfo(traitName){if(!traitName){console.error("Cannot show trait info: traitName missing."); return;} const explanation=this.sfTraitExplanations[traitName]||"No extra info available."; const popup=document.createElement('div'); popup.className='sf-style-info-popup'; popup.innerHTML=`<h3>${this.escapeHTML(traitName.charAt(0).toUpperCase()+traitName.slice(1))}</h3><p>${this.escapeHTML(explanation)}</p><button class="sf-close-btn" aria-label="Close trait info">×</button>`; document.body.appendChild(popup); popup.querySelector('.sf-close-btn')?.focus();}
  sfShowFullDetails(styleName){if(!styleName){console.error("Cannot show full details: styleName missing."); return;} const descData=this.sfStyleDescriptions[styleName]; const matchData=this.sfDynamicMatches[styleName]; if(!descData||!matchData){alert(`Details for style "${styleName}" not found.`); return;} const popup=document.createElement('div'); popup.className='sf-style-info-popup wide-popup'; popup.innerHTML=`<h3>${this.escapeHTML(styleName)}</h3><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p><h4>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h4><p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.longDesc)}</p><h4>Tips for You:</h4><ul style="list-style: '✨ '; padding-left: 1.5em;">${descData.tips.map(tip=>`<li>${this.escapeHTML(tip)}</li>`).join('')}</ul><button class="sf-close-btn" aria-label="Close style details">×</button>`; document.body.appendChild(popup); popup.querySelector('.sf-close-btn')?.focus();}
  getStyleIcons(){return{'Classic Submissive':'🙇‍♀️','Brat':'😈','Slave':'🔗','Pet':'🐾','Little':'🍼','Puppy':'🐶','Kitten':'🐱','Princess':'👑','Rope Bunny':'🪢','Masochist':'💥','Prey':'🏃‍♀️','Toy':'🎲','Doll':'🎎','Bunny':'🐰','Servant':'🧹','Playmate':'🎉','Babygirl':'🌸','Captive':'⛓️','Thrall':'🛐','Puppet':'🎭','Maid':'🧼','Painslut':'🔥','Bottom':'⬇️','Classic Dominant':'👑','Assertive':'💪','Nurturer':'🤗','Strict':'📏','Master':'🎓','Mistress':'👸','Daddy':'👨‍🏫','Mommy':'👩‍🏫','Owner':'🔑','Rigger':'🧵','Sadist':'😏','Hunter':'🏹','Trainer':'🏋️‍♂️','Puppeteer':'🕹️','Protector':'🛡️','Disciplinarian':'✋','Caretaker':'🧡','Sir':'🎩','Goddess':'🌟','Commander':'⚔️','Switch':'🔄', 'Fluid Switch':'🌊', 'Dominant-Leaning Switch':'👑↔️', 'Submissive-Leaning Switch':'🙇‍♀️↔️', 'Situational Switch':'🤔'};}

  // MODIFIED: Add confirmation before applying
  confirmApplyStyleFinderResult(r, s) {
      const message = `Apply Style "${this.escapeHTML(s)}" to the form? This will overwrite current Role/Style selections.`;
      if (confirm(message)) {
          this.applyStyleFinderResult(r, s);
      }
  }

  // MODIFIED: Actual application logic
  applyStyleFinderResult(r,s){
      console.log(`Applying SF Result: Role=${r}, Style=${s}`);
      if(!r||!s||!this.elements.role||!this.elements.style){console.error("Cannot apply style - missing elements/args."); alert("Error applying style."); return;}
      this.elements.role.value=r;
      this.renderStyles(r);
      requestAnimationFrame(()=>{
          const styleExists=Array.from(this.elements.style.options).some(option=>option.value===s);
          if(styleExists){ this.elements.style.value=s; }
          else { console.warn(`Style "${s}" not found in dropdown for role "${r}". Clearing selection.`); this.elements.style.value='';}
          this.renderTraits(r,this.elements.style.value);
          this.updateLivePreview();
          this.updateStyleExploreLink();
          this.sfClose();
          this.elements.formSection?.scrollIntoView({behavior:'smooth'});
          this.elements.name?.focus();
          this.showNotification(`Style "${s}" selected! Review traits & save. ✨`,"success");
      });
  }

  // --- Other Helper Functions ---
  getFlairForScore(s){return parseInt(s,10)<=2?"🌱 Nurturing!":parseInt(s,10)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(s){return parseInt(s,10)<=2?"💧":parseInt(s,10)===3?"🌱":parseInt(s,10)===4?"✨":"🌟";}
  escapeHTML(str){ const div=document.createElement('div'); div.appendChild(document.createTextNode(str ?? '')); return div.innerHTML; }
  // MODIFIED: openModal with logging
  openModal(modalElement){
        console.log("--- Entering openModal --- Trying to open:", modalElement?.id);
        if(!modalElement){
             console.error("!!! openModal Error: modalElement is null or undefined!");
             return;
        }

        // ---> NEW: Store the currently focused element BEFORE opening
        this.elementThatOpenedModal = document.activeElement;
        console.log("Storing focused element before modal open:", this.elementThatOpenedModal);
        // <--- END NEW

        modalElement.style.display='flex';
        modalElement.setAttribute('aria-hidden', 'false');
        console.log(`Set display='flex' for #${modalElement.id}. Current display:`, window.getComputedStyle(modalElement).display);

        const focusable = modalElement.querySelector('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
        if(focusable) {
            console.log(`Found focusable element in #${modalElement.id}:`, focusable);
             // Use setTimeout to ensure modal is fully rendered before focusing
             setTimeout(() => {
                 try { focusable.focus(); } catch(e){ console.warn("Focus failed:", e)}
             }, 50); // Small delay
        } else {
            console.warn(`No focusable element found in #${modalElement.id}.`);
             // If nothing focusable inside, maybe focus the modal container itself?
             // setTimeout(() => modalElement.focus(), 50); // Requires modalElement to have tabindex="-1"
        }
        console.log("--- Exiting openModal ---");
    }

    closeModal(modalElement){
        if(!modalElement)return;
        console.log(`--- Closing modal: #${modalElement.id} ---`); // <<-- ADD Log

        modalElement.style.display='none';
        modalElement.setAttribute('aria-hidden','true');

        // ---> NEW: Restore focus to the element that opened the modal
        console.log("Attempting to restore focus to:", this.elementThatOpenedModal);
        if (this.elementThatOpenedModal && typeof this.elementThatOpenedModal.focus === 'function') {
            try {
                this.elementThatOpenedModal.focus();
                console.log("Focus restored.");
            } catch (e) {
                console.warn("Could not restore focus:", e);
                // Fallback: focus body or another sensible default if needed
                // document.body.focus();
            }
        } else {
            console.warn("No stored element to restore focus to, or it's not focusable.");
            // Maybe focus the button that would logically follow? E.g., the 'Create Persona' name field?
            // this.elements.name?.focus(); // Example fallback
        }
        this.elementThatOpenedModal = null; // Clear the stored element
        // <--- END NEW
    }

    // Also update sfClose to handle focus restoration
    sfClose(){
        this.sfActive=false;
        // Call closeModal *before* logging, so focus is restored first
        this.closeModal(this.elements.sfModal);
        console.log("Style Finder closed.");
    }
  closeModal(modalElement){if(!modalElement)return; modalElement.style.display='none'; modalElement.setAttribute('aria-hidden','true');}
  getIntroForStyle(styleName){ const key=styleName?.toLowerCase().replace(/\(.*?\)/g,'').trim()||''; const intros={'classic submissive':'Trusting the lead...', brat:'Ready to play... or push?', slave:'In devoted service...', pet:'Eager for affection...', little:'Time for cuddles and rules!', puppy:'Ready to learn and play!', kitten:'Curious and coy...', princess:'Waiting to be adored...', 'rope bunny':'Anticipating the ties...', masochist:'Seeking the edge...', prey:'The chase begins...', toy:'Ready to be used...', doll:'Poised for perfection...', bunny:'Gentle heart awaits...', servant:'Duty calls...', playmate:'Let the games begin!', babygirl:'Needing care and charm...', captive:'Caught in the moment...', thrall:'Mind focused, will yielded...', puppet:'Waiting for direction...', maid:'Order and grace...', painslut:'Craving intensity...', bottom:'Open and ready...', 'classic dominant':'Taking the reins...', assertive:'Clear and direct...', nurturer:'Supporting the journey...', strict:'Order must prevail...', master:'Guiding with purpose...', mistress:'Commanding with elegance...', daddy:'Protecting and guiding...', mommy:'Nurturing with love...', owner:'Claiming what is mine...', rigger:'The canvas awaits...', sadist:'Exploring sensations...', hunter:'The pursuit is on...', trainer:'Cultivating potential...', puppeteer:'Strings at the ready...', protector:'Shields up...', disciplinarian:'Lessons will be learned...', caretaker:'Ensuring well-being...', sir:'Leading with honor...', goddess:'Accepting devotion...', commander:'Directing the action...', 'fluid switch': 'Flowing between roles...', 'dominant-leaning switch':'Leading, with flexibility', 'submissive-leaning switch':'Following, with flexibility', 'situational switch':'Adapting to the moment...'}; return intros[key]||"Explore your unique expression!";}

  // MODIFIED: Enhanced notification
  showNotification(message, type = 'info', duration = 4000) {
      const NOTIFICATION_ID = 'app-notification';
      let notification = document.getElementById(NOTIFICATION_ID);

      if (!notification) {
          console.log(`Notification element #${NOTIFICATION_ID} NOT found, creating...`);
          try {
              notification = document.createElement('div');
              notification.id = NOTIFICATION_ID;
              notification.style.position = 'fixed';
              notification.style.top = '20px';
              notification.style.left = '50%';
              notification.style.transform = 'translateX(-50%)';
              notification.style.padding = '12px 25px';
              notification.style.borderRadius = '8px';
              notification.style.zIndex = '2000';
              notification.style.opacity = '0';
              notification.style.transition = 'opacity 0.5s ease, top 0.5s ease, background-color 0.3s ease, color 0.3s ease';
              notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              notification.style.fontSize = '0.95em';
              notification.style.textAlign = 'center';
              notification.style.pointerEvents = 'none';
              notification.setAttribute('role', 'alert');
              notification.setAttribute('aria-live', 'assertive');

              if (document.body) {
                  document.body.appendChild(notification);
                  console.log(`Notification element #${NOTIFICATION_ID} CREATED and APPENDED.`);
                  if (!document.getElementById(NOTIFICATION_ID)) {
                      console.error(`!!! CRITICAL: Element #${NOTIFICATION_ID} not found immediately after appendChild!`);
                  }
              } else {
                  console.error(`Cannot append notification: document.body is not available!`);
                  alert(`Notification Error: ${message}`); // Fallback alert
                  return;
              }
          } catch (error) {
              console.error("Error creating notification element:", error);
              alert(`Notification Error: ${message}`);
              return;
          }
      } else {
          console.log(`Notification element #${NOTIFICATION_ID} FOUND.`);
      }

      if (!notification || !(notification instanceof HTMLElement)) {
           console.error(`!!! CRITICAL: Notification variable is invalid (current value: ${notification}) before setting content!`);
           notification = document.getElementById(NOTIFICATION_ID);
           if (!notification) {
               console.error(`!!! CRITICAL: Re-fetching element #${NOTIFICATION_ID} also failed! Cannot show notification.`);
                alert(`${type.toUpperCase()}: ${message}`);
                return;
           }
           console.log("Re-fetched notification element:", notification);
      }

      try {
          console.log(`Attempting to set innerHTML for notification element (ID: ${notification.id})`);
          notification.className = `app-notification notification-${type}`;

          switch (type) {
              case 'success':
                  notification.style.backgroundColor = 'var(--notification-success-bg, var(--success-color))';
                  notification.style.color = 'var(--notification-text-light, white)';
                  notification.style.border = 'none'; // Reset border
                  notification.style.fontWeight = 'normal'; // Reset font weight
                  break;
              case 'error':
                  notification.style.backgroundColor = 'var(--notification-error-bg, var(--danger-color))';
                  notification.style.color = 'var(--notification-text-light, white)';
                  notification.style.border = 'none';
                  notification.style.fontWeight = 'normal';
                  break;
              case 'warning':
                  notification.style.backgroundColor = 'var(--notification-warning-bg, #ff9800)';
                  notification.style.color = 'var(--notification-text-dark, black)';
                   notification.style.border = 'none';
                  notification.style.fontWeight = 'normal';
                 break;
              case 'achievement':
                  notification.style.backgroundColor = 'var(--notification-achievement-bg, gold)';
                  notification.style.color = 'var(--notification-text-dark, black)';
                  notification.style.fontWeight = 'bold';
                  notification.style.border = '2px solid darkgoldenrod';
                  duration = 6000;
                  break;
              default: // Info
                  notification.style.backgroundColor = 'var(--notification-info-bg, var(--accent-color))';
                  notification.style.color = 'var(--notification-text-light, white)';
                   notification.style.border = 'none';
                  notification.style.fontWeight = 'normal';
                 break;
          }

          let icon = '';
          switch(type) {
              case 'success': icon = '✅ '; break;
              case 'error':   icon = '❌ '; break;
              case 'warning': icon = '⚠️ '; break;
              case 'achievement': icon = '🏆 '; break;
              default: icon = 'ℹ️ '; break;
          }

          notification.innerHTML = icon + this.escapeHTML(message);
          console.log(`Successfully set innerHTML for #${NOTIFICATION_ID}.`);

          requestAnimationFrame(() => {
              notification.style.opacity = '1';
              notification.style.top = '35px';
          });

          if (this.notificationTimer) clearTimeout(this.notificationTimer);
          this.notificationTimer = setTimeout(() => {
              notification.style.opacity = '0';
              notification.style.top = '20px';
          }, duration);

      } catch (error) {
          console.error(`Error setting content or animating notification #${NOTIFICATION_ID}:`, error);
          alert(`${type.toUpperCase()}: ${message}`);
      }
  }

} // --- END OF TrackerApp CLASS ---


// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style='color: red; padding: 20px; border: 2px solid red; margin: 20px; background: white;'>Fatal Error: ${error.message}<br><pre>${error.stack || ''}</pre></div>`;
}
