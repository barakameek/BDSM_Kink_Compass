// --- START OF FILE app.js ---

import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js and Confetti loaded via CDN

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: Starting...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;

    // --- Style Finder State ---
    this.sfActive = false;
    this.sfStep = 0;
    this.sfRole = null; // 'submissive' or 'dominant'
    this.sfAnswers = { traits: {} }; // Store slider answers { traitName: score }
    this.sfScores = {}; // Store calculated style scores { StyleName: score }
    this.sfPreviousScores = {}; // For dashboard animation
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = []; // Holds the current set of traits for the quiz
    this.sfSteps = []; // Holds the calculated steps for the current quiz run

    // --- Element Mapping ---
    this.elements = {
      // KinkCompass elements...
      formSection: document.getElementById('form-section'), name: document.getElementById('name'), avatarDisplay: document.getElementById('avatar-display'), avatarInput: document.getElementById('avatar-input'), avatarPicker: document.querySelector('.avatar-picker'), role: document.getElementById('role'), style: document.getElementById('style'), traitsContainer: document.getElementById('traits-container'), traitInfoPopup: document.getElementById('trait-info-popup'), traitInfoClose: document.getElementById('trait-info-close'), traitInfoTitle: document.getElementById('trait-info-title'), traitInfoBody: document.getElementById('trait-info-body'), save: document.getElementById('save'), clearForm: document.getElementById('clear-form'), peopleList: document.getElementById('people-list'), livePreview: document.getElementById('live-preview'), modal: document.getElementById('detail-modal'), modalBody: document.getElementById('modal-body'), modalClose: document.getElementById('modal-close'), resourcesBtn: document.getElementById('resources-btn'), resourcesModal: document.getElementById('resources-modal'), resourcesClose: document.getElementById('resources-close'), glossaryBtn: document.getElementById('glossary-btn'), glossaryModal: document.getElementById('glossary-modal'), glossaryClose: document.getElementById('glossary-close'), glossaryBody: document.getElementById('glossary-body'), styleDiscoveryBtn: document.getElementById('style-discovery-btn'), styleDiscoveryModal: document.getElementById('style-discovery-modal'), styleDiscoveryClose: document.getElementById('style-discovery-close'), styleDiscoveryRoleFilter: document.getElementById('style-discovery-role'), styleDiscoveryBody: document.getElementById('style-discovery-body'), themesBtn: document.getElementById('themes-btn'), themesModal: document.getElementById('themes-modal'), themesClose: document.getElementById('themes-close'), themesBody: document.getElementById('themes-body'), exportBtn: document.getElementById('export-btn'), importBtn: document.getElementById('import-btn'), importFileInput: document.getElementById('import-file-input'), themeToggle: document.getElementById('theme-toggle'),

      // Style Finder elements...
      styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'), // New Trigger
      sfModal: document.getElementById('style-finder-modal'),                   // The modal itself
      sfCloseBtn: document.getElementById('sf-close-style-finder'),           // Close button
      sfProgressTracker: document.getElementById('sf-progress-tracker'),      // Progress text
      sfStepContent: document.getElementById('sf-step-content'),            // Main content area
      sfFeedback: document.getElementById('sf-feedback'),                   // Feedback text
      sfDashboard: document.getElementById('sf-dashboard')                    // Live score dashboard
    };

    // Critical element check...
    if (!this.elements.name || !this.elements.role || !this.elements.style || !this.elements.save || !this.elements.peopleList || !this.elements.modal || !this.elements.sfModal) { // Added sfModal check
         console.error("Missing critical HTML elements."); throw new Error("Missing critical elements");
    }

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    console.log("CONSTRUCTOR: Initial render complete.");
  }

  // --- Local Storage --- (Keep as before)
  loadFromLocalStorage(){try{const d=localStorage.getItem('kinkProfiles');const p=d?JSON.parse(d):[];this.people=p.map(p=>({...p,goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],avatar:p.avatar||'❓',achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'?p.reflections:{}}));console.log(`Loaded ${this.people.length}`);}catch(e){console.error("Load Error:",e);this.people=[];}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length}`);}catch(e){console.error("Save Error:",e);alert("Save failed.");}}

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Attaching event listeners...");
    // KinkCompass Listeners...
    this.elements.role?.addEventListener('change',() => { const r=this.elements.role.value;this.renderStyles(r);this.elements.style.value='';this.renderTraits(r,'');this.updateLivePreview(); });
    this.elements.style?.addEventListener('change',() => { this.renderTraits(this.elements.role.value,this.elements.style.value);this.updateLivePreview(); });
    this.elements.name?.addEventListener('input',() => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click',(e) => this.handleAvatarPick(e));
    this.elements.save?.addEventListener('click',() => this.savePerson());
    this.elements.clearForm?.addEventListener('click',() => this.resetForm(true));
    this.elements.themeToggle?.addEventListener('click',() => this.toggleTheme());
    this.elements.exportBtn?.addEventListener('click',() => this.exportData());
    this.elements.importBtn?.addEventListener('click',() => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change',(e) => this.importData(e));
    this.elements.peopleList?.addEventListener('click',(e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown',(e) => this.handleListKeydown(e));
    this.elements.modalClose?.addEventListener('click',() => this.closeModal(this.elements.modal));
    this.elements.resourcesBtn?.addEventListener('click',() => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose?.addEventListener('click',() => this.closeModal(this.elements.resourcesModal));
    this.elements.glossaryBtn?.addEventListener('click',() => this.showGlossary());
    this.elements.glossaryClose?.addEventListener('click',() => this.closeModal(this.elements.glossaryModal));
    this.elements.styleDiscoveryBtn?.addEventListener('click',() => this.showStyleDiscovery());
    this.elements.styleDiscoveryClose?.addEventListener('click',() => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change',() => this.renderStyleDiscoveryContent());
    this.elements.themesBtn?.addEventListener('click',() => this.openModal(this.elements.themesModal));
    this.elements.themesClose?.addEventListener('click',() => this.closeModal(this.elements.themesModal));
    this.elements.themesBody?.addEventListener('click',(e) => this.handleThemeSelection(e));
    this.elements.traitsContainer?.addEventListener('input',(e) => this.handleTraitSliderInput(e));
    this.elements.traitsContainer?.addEventListener('click',(e) => this.handleTraitInfoClick(e));
    this.elements.traitInfoClose?.addEventListener('click',() => this.hideTraitInfo());
    this.elements.modalBody?.addEventListener('click',(e) => this.handleModalBodyClick(e));

    // Style Finder Listeners...
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => this.startStyleFinder());
    this.elements.sfCloseBtn?.addEventListener('click', () => this.closeStyleFinder());
    // Use event delegation for buttons inside the Style Finder step content
    this.elements.sfStepContent?.addEventListener('click', (e) => this.handleStyleFinderAction(e));
    // Listener for sliders inside the Style Finder modal
    this.elements.sfStepContent?.addEventListener('input', (e) => this.handleStyleFinderSliderInput(e));
    // Listener for info icons inside the Style Finder modal (if reusing trait info popup)
    this.elements.sfStepContent?.addEventListener('click', (e) => {
         if (e.target.classList.contains('sf-info-icon')) {
             const traitName = e.target.dataset.trait;
             this.showStyleFinderTraitInfo(traitName); // Use a dedicated method or reuse showTraitInfo
         }
    });
     // Listener for closing the trait info popup (if separate one is used)
     document.body.addEventListener('click', (e) => {
         if (e.target.classList.contains('sf-close-btn')) {
              e.target.closest('.sf-style-info-popup')?.remove();
         }
     });


    // Global Listeners (Adjusted to include sfModal)
    window.addEventListener('click',(e) => { if(e.target===this.elements.modal)this.closeModal(this.elements.modal); if(e.target===this.elements.sfModal)this.closeStyleFinder(); /* ... other modals ... */});
    window.addEventListener('keydown',(e) => { if(e.key==='Escape'){if(this.elements.modal?.style.display==='flex')this.closeModal(this.elements.modal); if(this.elements.sfModal?.style.display==='flex')this.closeStyleFinder(); /* ... other modals ... */}});

    console.log("Event listeners setup complete.");
  }

  // --- Event Handlers --- (Keep existing KinkCompass handlers)
  handleListClick(e){/* ... */} handleListKeydown(e){/* ... */} handleWindowClick(e){/* ... (adjusted above) ... */} handleWindowKeydown(e){/* ... (adjusted above) ... */} handleTraitSliderInput(e){/* ... */} handleTraitInfoClick(e){/* ... */} handleModalBodyClick(e){/* ... */} handleThemeSelection(e){/* ... */} handleAvatarPick(e){ /* ... */ }

  // --- Core Rendering --- (Keep existing KinkCompass methods)
  renderStyles(r){/* ... */} renderTraits(r,sN){/* ... */} createTraitHTML(t){/* ... */} updateTraitDescription(sl){/* ... */} renderList(){/* ... */} createPersonListItemHTML(p){/* ... */}

  // --- CRUD --- (Keep existing KinkCompass methods)
  savePerson(){/* ... */} editPerson(pId){/* ... */} deletePerson(pId){/* ... */} resetForm(clear=false){/* ... */}

  // --- Live Preview --- (Keep existing KinkCompass method)
  updateLivePreview(){/* ... */}

  // --- Modal Display (KinkCompass Detail Modal) --- (Keep existing method)
  showPersonDetails(personId) {/* ... */}

  // --- New Feature Logic (Goals, Journal, History, Reading, Achievements etc.) --- (Keep existing methods)
  addGoal(pId){/*...*/} toggleGoalStatus(pId,gId){/*...*/} deleteGoal(pId,gId){/*...*/} renderGoalList(p){/*...*/} showJournalPrompt(){/*...*/} saveReflections(pId){/*...*/} addSnapshotToHistory(pId){/*...*/} renderHistoryChart(p){/*...*/} toggleSnapshotInfo(btn){/*...*/} renderAchievements(p){/*...*/} showKinkReading(pId){/*...*/} getReadingDescriptor(tN,sc){/*...*/} getStyleEssence(sN){/*...*/} showGlossary(){/*...*/} showStyleDiscovery(){/*...*/} renderStyleDiscoveryContent(){/*...*/} setTheme(tN){/*...*/} applySavedTheme(){/*...*/} toggleTheme(){/*...*/} exportData(){/*...*/} importData(ev){/*...*/} showTraitInfo(tN){/*...*/} hideTraitInfo(){/*...*/}

  // --- Helper Functions --- (Keep existing KinkCompass methods)
  getFlairForScore(s){/*...*/} getEmojiForScore(s){/*...*/} escapeHTML(s){/*...*/} openModal(mE){/*...*/} closeModal(mE){/*...*/} getIntroForStyle(styleName){/*...*/}


  // ============================================
  // --- STYLE FINDER LOGIC (Ported & Integrated) ---
  // ============================================

  startStyleFinder() {
    console.log("Starting Style Finder...");
    this.sfActive = true;
    this.sfStep = 0;
    this.sfRole = null;
    this.sfAnswers = { traits: {} }; // Reset answers
    this.sfScores = {};
    this.sfPreviousScores = {};
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = [];
    this.sfSteps = [];
    this.elements.sfDashboard.style.display = 'none'; // Ensure dashboard is hidden initially
    this.elements.sfFeedback.textContent = ''; // Clear feedback
    this.renderStyleFinderStep(); // Render the first step (welcome)
    this.openModal(this.elements.sfModal); // Show the modal
  }

  closeStyleFinder() {
    console.log("Closing Style Finder.");
    this.sfActive = false;
    if (this.elements.sfModal) {
        this.elements.sfModal.style.display = 'none';
    }
    // Optionally reset state fully if preferred when closing mid-quiz
    // this.sfStep = 0; this.sfRole = null; // etc.
  }

  // Recalculate steps based on current state (role selection)
  calculateStyleFinderSteps() {
      this.sfSteps = [];
      this.sfSteps.push({ type: 'welcome' });
      this.sfSteps.push({ type: 'role' });
      if (this.sfRole) {
          // Get traits from data.js based on role
          const traitsFromData = bdsmData[this.sfRole]?.coreTraits || []; // Start with core traits? Or specific quiz traits? Let's use quiz traits for now.
          // Decide which traits to include in the quiz. Let's make a curated list for simplicity.
          const quizTraitsConfig = {
              submissive: ['obedience', 'rebellion', 'service', 'playfulness', 'sensuality', 'affection', 'painTolerance', 'submissionDepth', 'dependence', 'vulnerability'],
              dominant: ['authority', 'confidence', 'discipline', 'care', 'control', 'creativity', 'intensity', 'sadism', 'leadership', 'patience']
          };
          const selectedTraitNames = quizTraitsConfig[this.sfRole] || [];
          // Retrieve full trait objects from data.js (core or style specific if needed, requires more complex lookup)
          this.sfTraitSet = selectedTraitNames
              .map(name => bdsmData[this.sfRole]?.coreTraits.find(t => t.name === name) || bdsmData[this.sfRole]?.styles.flatMap(s => s.traits || []).find(t => t.name === name))
              .filter(Boolean); // Filter out any traits not found in data.js

          // Randomize trait order for the quiz run
          this.sfTraitSet.sort(() => 0.5 - Math.random());

          this.sfTraitSet.forEach(trait => this.sfSteps.push({ type: 'trait', trait: trait.name }));
          this.sfSteps.push({ type: 'roundSummary', round: 'Traits' }); // Add summary step
      }
      this.sfSteps.push({ type: 'result' });
  }


  renderStyleFinderStep() {
    if (!this.sfActive || !this.elements.sfStepContent) return;

    this.calculateStyleFinderSteps(); // Ensure steps are up-to-date

    if (this.sfStep >= this.sfSteps.length) this.sfStep = this.sfSteps.length - 1; // Boundary check
    const step = this.sfSteps[this.sfStep];
    if (!step) { console.error("Style Finder step not found!"); return; }

    console.log(`Rendering SF Step ${this.sfStep}:`, step);

    let html = "";
    const totalSteps = this.sfSteps.length;
    const isTraitStep = step.type === 'trait';

    // Update progress tracker (only during trait steps)
    if (isTraitStep && this.sfRole) {
        const currentTraitIndex = this.sfTraitSet.findIndex(t => t.name === step.trait);
        const questionsLeft = this.sfTraitSet.length - (currentTraitIndex + 1);
        this.elements.sfProgressTracker.style.display = 'block';
        this.elements.sfProgressTracker.textContent = `Trait ${currentTraitIndex + 1} of ${this.sfTraitSet.length} (${questionsLeft} left)`;
    } else {
        this.elements.sfProgressTracker.style.display = 'none';
    }

    switch (step.type) {
      case 'welcome':
        html = `
          <h2>Welcome, Brave Explorer!</h2>
          <p>Ready to discover your potential BDSM style? Answer a few questions about your vibes!</p>
          <button data-action="next">Start the Journey! ✨</button>
        `;
        break;
      case 'role':
        html = `
          <h2>Pick Your Path!</h2>
          <p>Do you generally feel more drawn to guiding and leading (Dominant) or supporting and following (Submissive)?</p>
          <button data-action="setRole" data-role="dominant">Lead the Way! (Dominant)</button>
          <button data-action="setRole" data-role="submissive">Follow the Flow! (Submissive)</button>
        `;
        break;
      case 'trait':
        const traitObj = this.sfTraitSet.find(t => t.name === step.trait);
        if (!traitObj) { html = "<p>Error: Trait not found.</p>"; break; } // Handle missing trait

        const currentValue = this.sfAnswers.traits[traitObj.name] !== undefined ? this.sfAnswers.traits[traitObj.name] : 5; // Default to middle
        // Get description from data.js
        const traitDesc = bdsmData[this.sfRole]?.coreTraits.find(t=>t.name===traitObj.name)?.desc
                       || bdsmData[this.sfRole]?.styles.flatMap(s=>s.traits||[]).find(t=>t.name===traitObj.name)?.desc;

        const sliderDescText = traitDesc?.[currentValue] || `Level ${currentValue}`; // Use level description
        const footnote = `1: Least like me | 10: Most like me`; // Simple footnote
        const question = this.getTraitQuestion(traitObj.name); // Get question text

        html = `
          <h2>${this.escapeHTML(question)}<button class="sf-info-icon" data-trait="${traitObj.name}" data-action="showTraitInfo" aria-label="Info about ${this.escapeHTML(traitObj.name)}">ℹ️</button></h2>
          <p class="muted-text">Slide to where you feel you fit on the scale (1-10).</p>
          <input type="range" min="1" max="10" value="${currentValue}" class="sf-trait-slider" data-trait="${traitObj.name}" aria-label="${this.escapeHTML(traitObj.name)} slider">
          <div id="sf-desc-${traitObj.name}" class="sf-slider-description">${this.escapeHTML(sliderDescText)}</div>
          <p class="sf-slider-footnote">${footnote}</p>
          <div style="margin-top: 15px;">
            <button data-action="next" data-trait="${traitObj.name}">Next Step!</button>
            ${this.sfStep > 1 ? '<button data-action="prev">Back</button>' : ''}
          </div>
        `;
        break;
      case 'roundSummary':
        // Dashboard is updated separately, just show summary text
        html = `
          <h2>${step.round} Round Complete!</h2>
          <p>You've rated your traits. Let's see the potential results!</p>
          <div id="sf-summary-dashboard-placeholder">Loading dashboard...</div> <!-- Dashboard updated by updateDashboard -->
          <button data-action="next">See My Top Style! 💖</button>
          <button data-action="prev">Go Back</button>
        `;
        // Trigger dashboard update after rendering this step's basic structure
        requestAnimationFrame(() => this.updateStyleFinderDashboard(true)); // Force update for summary
        break;
      case 'result':
        this.calculateStyleFinderScores();
        const sortedScores = Object.entries(this.sfScores).sort((a, b) => b[1] - a[1]);
        const topStyle = sortedScores.length > 0 ? sortedScores[0][0] : "Explorer"; // Fallback name
        const topScoreValue = sortedScores.length > 0 ? sortedScores[0][1] : 0;

        const descData = bdsmData[this.sfRole]?.styles.find(s => s.name === topStyle); // Get from data.js
        const styleSummary = descData?.summary || "A unique style all your own!";
        const styleDesc = this.getIntroForStyle(topStyle); // Use existing intros

        html = `
          <div class="sf-result-section sf-fade-in">
            <h2 class="sf-result-heading">🎉 Style Found: ${this.escapeHTML(topStyle)} 🎉</h2>
            <p>${styleDesc}</p>
            <p><em>${this.escapeHTML(styleSummary)}</em></p>
            ${/* Optional: Show top 3? */''}
            <h3>Ready to explore further?</h3>
            <div class="sf-result-buttons">
              {/* Button to apply this style to the main KinkCompass form */}
              <button data-action="applyStyle" data-role="${this.sfRole}" data-style="${this.escapeHTML(topStyle)}">Track This Style! 📝</button>
              <button data-action="startOver">Try Again? 🤔</button>
              <button data-action="close">Close Finder</button>
            </div>
          </div>
        `;
        // Trigger confetti!
        if (window.confetti) {
           setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ff69b4', '#ff85cb', '#f4d4e4', '#fff'] }), 300);
        }
        break;
      default:
          html = "<p>Something went wrong!</p>";
    }

    this.elements.sfStepContent.innerHTML = html;
    // Only update dashboard during trait steps or summary
    if (step.type === 'trait' || step.type === 'roundSummary') {
         requestAnimationFrame(() => this.updateStyleFinderDashboard(step.type === 'roundSummary')); // Update dashboard after rendering step
    } else {
        this.elements.sfDashboard.style.display = 'none'; // Hide dashboard otherwise
    }

  }

  // Handles clicks on buttons *inside* sfStepContent
  handleStyleFinderAction(e) {
      const button = e.target.closest('button');
      if (!button) return;

      const action = button.dataset.action;
      console.log("SF Action:", action, button.dataset);

      switch (action) {
          case 'next':
              const currentTrait = button.dataset.trait;
              // Validation: Ensure slider has been moved/has a value if it's a trait step
              if (currentTrait && this.sfAnswers.traits[currentTrait] === undefined) {
                   this.showStyleFinderFeedback("Slide to rate this trait first!");
                   return;
              }
              this.sfStep++;
              this.renderStyleFinderStep();
              break;
          case 'prev':
              if (this.sfStep > 0) {
                  this.sfStep--;
                  // If going back from summary/result, clear scores for re-calc
                  if (this.sfSteps[this.sfStep+1]?.type === 'result' || this.sfSteps[this.sfStep+1]?.type === 'roundSummary') {
                       this.sfScores = {};
                       this.sfPreviousScores = {};
                       this.sfHasRenderedDashboard = false;
                  }
                  this.renderStyleFinderStep();
              }
              break;
          case 'setRole':
              this.sfRole = button.dataset.role;
              this.sfAnswers.role = this.sfRole;
              this.sfAnswers.traits = {}; // Reset traits if role changes
              this.sfStep++;
              this.renderStyleFinderStep();
              break;
          case 'startOver':
              this.startStyleFinder(); // Reset and show welcome
              break;
          case 'close':
              this.closeStyleFinder();
              break;
          case 'applyStyle':
              const role = button.dataset.role;
              const style = button.dataset.style;
              if (role && style) {
                  this.applyStyleFinderResult(role, style);
              } else {
                   console.error("ApplyStyle error: Missing role or style data", button.dataset);
                   alert("Error applying style.");
              }
              break;
           case 'showTraitInfo': // Handle info icon clicks within the finder steps
                const traitName = button.dataset.trait;
                this.showStyleFinderTraitInfo(traitName);
                break;
      }
  }

  // Handles slider input *inside* sfStepContent
  handleStyleFinderSliderInput(e) {
      if (e.target.classList.contains('sf-trait-slider')) {
          const traitName = e.target.dataset.trait;
          const value = parseInt(e.target.value, 10);
          this.sfAnswers.traits[traitName] = value;

          // Update description based on data.js
          const traitData = this.sfTraitSet.find(t => t.name === traitName);
          const descEl = this.elements.sfStepContent.querySelector(`#sf-desc-${traitName}`);
          if (descEl && traitData?.desc?.[value]) {
              descEl.textContent = this.escapeHTML(traitData.desc[value]);
          } else if (descEl) {
              descEl.textContent = `Level ${value}`; // Fallback
          }
          this.showStyleFinderFeedback(`Vibing with ${traitName} at ${value}!`);
          this.updateStyleFinderDashboard(); // Update live dashboard
      }
  }

  // Get Trait Question (customize this!)
  getTraitQuestion(traitName) {
      // Map trait names to user-friendly questions
      const questions = {
          obedience: "How much do you enjoy following rules?",
          rebellion: "Is playful resistance your kind of fun?",
          service: "Does helping others make you happy?",
          playfulness: "How much do you love to giggle and play?",
          sensuality: "Do soft touches and nice textures delight you?",
          exploration: "Are new adventures exciting or scary?",
          devotion: "How important is deep loyalty to you?",
          innocence: "Do you enjoy feeling carefree and sweet?",
          mischief: "Do you have a secret (or not-so-secret) cheeky side?",
          affection: "Are cuddles and closeness super important?",
          painTolerance: "Does a little bit of 'ouch' feel interesting?",
          submissionDepth: "How much do you like letting someone else take charge?",
          dependence: "Is relying on someone comforting?",
          vulnerability: "Is it easy for you to show your soft side?",
          adaptability: "Can you easily switch between moods or roles?",
          tidiness: "Is making things neat and tidy satisfying?",
          politeness: "Are good manners important to you?",
          craving: "Do you seek out intense feelings or experiences?",
          receptiveness: "How open are you to receiving guidance or sensation?",
          authority: "Does taking charge feel natural and good?",
          confidence: "Do you trust your own decisions easily?",
          discipline: "Do you like setting clear rules and structure?",
          boldness: "Do you face challenges head-on?",
          care: "Is looking after someone's well-being important?",
          empathy: "Can you easily sense how others are feeling?",
          control: "Do you enjoy managing the details?",
          creativity: "Do you love coming up with unique ideas?",
          precision: "Is getting things exactly right satisfying?",
          intensity: "Do you bring a strong energy to interactions?",
          sadism: "Does causing a little *consensual* sting feel intriguing?",
          leadership: "Do you naturally guide or direct others?",
          possession: "Does feeling like someone 'belongs' to you feel right?",
          patience: "Are you calm when guiding or waiting?",
          dominanceDepth: "How much do you enjoy having complete influence?"
      };
      return questions[traitName] || `How do you feel about ${traitName}?`; // Fallback
  }


  // Calculate Scores (Using data.js structure might be complex - simplified version)
  calculateStyleFinderScores() {
    this.sfScores = {};
    if (!this.sfRole || !bdsmData[this.sfRole]?.styles) return;

    const styles = bdsmData[this.sfRole].styles;
    const traitsAnswered = this.sfAnswers.traits;

    styles.forEach(style => {
      this.sfScores[style.name] = 0;
      let traitCount = 0;
      // Combine core and style traits for scoring this style
      const relevantTraits = [
          ...(bdsmData[this.sfRole]?.coreTraits || []),
          ...(style.traits || [])
      ];
      const uniqueTraitNames = new Set(relevantTraits.map(t => t.name));

      uniqueTraitNames.forEach(traitName => {
          if (traitsAnswered.hasOwnProperty(traitName)) {
              // Basic scoring: add the score directly. Could add weights later.
              this.sfScores[style.name] += traitsAnswered[traitName];
              traitCount++;
          }
          // Maybe add partial points if a core trait matches broadly? More complex.
      });

      // Normalize score? Divide by number of traits answered relevant to the style?
      // Or just use raw score? Let's use raw score for now.
      // if (traitCount > 0) {
      //    this.sfScores[style.name] = (this.sfScores[style.name] / (traitCount * 10)) * 100; // Example normalization
      // }
    });

    console.log("Calculated SF Scores:", this.sfScores);
  }

  // Update Dashboard (Uses calculated sfScores)
  updateStyleFinderDashboard(forceUpdate = false) {
    if (!this.sfActive || !this.elements.sfDashboard || !this.sfRole) return;

    // Avoid updating on every tiny slider move unless forced (like on summary step)
    // Or maybe update less frequently? For now, update always but debounce could be added.
    // if (!forceUpdate && Date.now() - (this.lastDashboardUpdate || 0) < 500) return; // Example debounce

    this.calculateStyleFinderScores(); // Ensure scores are fresh
    const sortedScores = Object.entries(this.sfScores).sort((a, b) => b[1] - a[1]);

    // Only show if there are scores to show
    if(sortedScores.length === 0 || sortedScores[0][1] === 0) {
        this.elements.sfDashboard.style.display = 'none';
        return;
    }
    this.elements.sfDashboard.style.display = 'block';


    const previousPositions = {};
    Object.entries(this.sfPreviousScores).sort((a,b) => b[1] - a[1]).forEach(([style], index) => {
        previousPositions[style] = index;
    });

    const isFirstRender = !this.sfHasRenderedDashboard;
    let dashboardHTML = "<div class='sf-dashboard-header'>✨ Live Vibes! ✨</div>";
    const styleIcons = this.getStyleIcons(); // Get icons map

    // Show top 5-7 maybe?
    sortedScores.slice(0, 7).forEach(([style, score], index) => {
        const prevPos = previousPositions[style] !== undefined ? previousPositions[style] : index;
        const movement = prevPos - index;
        let moveIndicator = '';
        if (!isFirstRender && movement > 0) moveIndicator = '<span class="sf-move-up">↑</span>';
        else if (!isFirstRender && movement < 0) moveIndicator = '<span class="sf-move-down">↓</span>';

        const prevScore = this.sfPreviousScores[style] || 0;
        const deltaScore = score - prevScore;
        let delta = '';
         // Show delta only if significant change and not first render
        if (!isFirstRender && Math.abs(deltaScore) > 0.1) {
            delta = `<span class="sf-score-delta ${deltaScore > 0 ? 'positive' : 'negative'}">${deltaScore > 0 ? '+' : ''}${deltaScore.toFixed(1)}</span>`;
        }

        // Use different animation for first render vs update?
        const animationClass = isFirstRender ? 'sf-fade-in' : ''; // Simple fade in for first time

        dashboardHTML += `
            <div class="sf-dashboard-item ${animationClass}">
                <span class="sf-style-name">${styleIcons[style] || '🌟'} ${this.escapeHTML(style)}</span>
                <span class="sf-dashboard-score">${score.toFixed(1)} ${delta} ${moveIndicator}</span>
            </div>`;
    });

    this.elements.sfDashboard.innerHTML = dashboardHTML;
    this.sfPreviousScores = { ...this.sfScores }; // Store current scores for next comparison
    this.sfHasRenderedDashboard = true;
    // this.lastDashboardUpdate = Date.now(); // For debounce
  }


  // Apply result to main form
  applyStyleFinderResult(role, style) {
      console.log(`Applying Style Finder Result: Role=${role}, Style=${style}`);
      if (!role || !style) return;

      // Set main form values
      this.elements.role.value = role;
      // We need to trigger the rendering based on the new role first
      this.renderStyles(role);
      // Wait a tick for options to render, then set style
      requestAnimationFrame(() => {
          this.elements.style.value = style;
          // Now render traits based on role and selected style
          this.renderTraits(role, style);
          // Update the live preview section
          this.updateLivePreview();
          // Close the finder modal
          this.closeStyleFinder();
          // Scroll to the form section
          this.elements.formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Maybe focus the name field?
          this.elements.name?.focus();
           alert(`Style "${style}" selected! Fill in the rest of your profile.`);
      });
  }


  // Show feedback message
  showStyleFinderFeedback(message) {
    if (!this.elements.sfFeedback) return;
    this.elements.sfFeedback.textContent = message;
    // Optional: Add animation class
    this.elements.sfFeedback.classList.remove('sf-feedback-animation'); // Remove first
    void this.elements.sfFeedback.offsetWidth; // Trigger reflow
    this.elements.sfFeedback.classList.add('sf-feedback-animation'); // Add animation
    // Optional: Clear after a delay
    // setTimeout(() => { if (this.elements.sfFeedback.textContent === message) this.elements.sfFeedback.textContent = ''; }, 2500);
  }

  // Show trait info (could reuse main one or have separate popup)
  showStyleFinderTraitInfo(traitName) {
      if (!this.sfRole) return;
      // Find definition in data.js based on sfRole
      const traitData = bdsmData[this.sfRole]?.coreTraits.find(t=>t.name===traitName)
                   || bdsmData[this.sfRole]?.styles.flatMap(s=>s.traits||[]).find(t=>t.name===traitName);

      if (!traitData?.desc) { alert("Info not available for this trait."); return; }

      let infoHtml = `<h3>${this.escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}</h3>`;
      infoHtml += `<p>${this.getTraitQuestion(traitName)}</p><hr>`; // Show the question again
       // Show all level descriptions
       for(let i = 1; i <= 10; i++) { // Assuming 1-10 scale for quiz, map to 1-5 for description? Or need 1-10 desc?
           // Let's map 1-10 quiz score to 1-5 description levels
           const descLevel = Math.ceil(i / 2); // 1,2->1; 3,4->2; 5,6->3; 7,8->4; 9,10->5
           const descText = traitData.desc[descLevel] || `Level ${i} description missing.`;
           infoHtml += `<p><strong>Score ${i}:</strong> ${this.escapeHTML(descText)}</p>`;
       }

      // Create and show a simple popup (or reuse traitInfoPopup if styled globally)
      const popup = document.createElement('div');
      popup.className = 'sf-style-info-popup'; // Use specific class
      popup.innerHTML = infoHtml + `<button class="sf-close-btn">×</button>`;
      document.body.appendChild(popup);
      // Add listener to remove popup - already handled by delegation on body in addEventListeners
  }

  // Helper to get style icons map (could move to data.js or keep here)
  getStyleIcons() {
      return { /* Keep the styleIcons map from the original scriptbdsmfinder.js */
          'Submissive': '🙇', 'Brat': '😈', 'Slave': '🔗', 'Switch': '🔄', 'Pet': '🐾', 'Little': '🍼', 'Puppy': '🐶', 'Kitten': '🐱', 'Princess': '👑', 'Rope Bunny': '🪢', 'Masochist': '💥', 'Prey': '🏃', 'Toy': '🎲', 'Doll': '🎎', 'Bunny': '🐰', 'Servant': '🧹', 'Playmate': '🎉', 'Babygirl': '🌸', 'Captive': '⛓️', 'Thrall': '🛐', 'Puppet': '🎭', 'Maid': '🧼', 'Painslut': '🔥', 'Bottom': '⬇️', 'Dominant': '👤', 'Assertive': '💪', 'Nurturer': '🤗', 'Strict': '📏', 'Master': '🎓', 'Mistress': '👸', 'Daddy': '👨‍🏫', 'Mommy': '👩‍🏫', 'Owner': '🔑', 'Rigger': '🪢', 'Sadist': '😏', 'Hunter': '🏹', 'Trainer': '🏋️', 'Puppeteer': '🎭', 'Protector': '🛡️', 'Disciplinarian': '✋', 'Caretaker': '🧡', 'Sir': '🎩', 'Goddess': '🌟', 'Commander': '⚔️'
      };
  }


  // --- Other Helper Functions --- (Keep definitions as before)
  getFlairForScore(s){/*...*/} getEmojiForScore(s){/*...*/} escapeHTML(s){/*...*/} openModal(mE){/*...*/} closeModal(mE){/*...*/} getIntroForStyle(styleName){/*...*/}
  showTraitInfo(tN){/*...*/} hideTraitInfo(){/*...*/} toggleSnapshotInfo(btn){/*...*/} setTheme(tN){/*...*/} applySavedTheme(){/*...*/} toggleTheme(){/*...*/} exportData(){/*...*/} importData(ev){/*...*/} showGlossary(){/*...*/} showStyleDiscovery(){/*...*/} renderStyleDiscoveryContent(){/*...*/}

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp(); // Assign for potential debugging
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding:2em;margin:2em;border:2px solid red;background:#fff0f0;color:#333;"><h1 style="color:red;">Oops! Failed to Start</h1><p>Error: ${error.message}. Check console (F12).</p></div>`;
}

// --- END OF FILE app.js ---
