// --- START OF FILE app.js ---

import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js loaded via CDN

class TrackerApp {
  constructor() {
    // ... (Keep constructor and element finding exactly as before) ...
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;

    this.elements = { /* ... All element lookups ... */
        formSection: document.getElementById('form-section'), name: document.getElementById('name'), avatarDisplay: document.getElementById('avatar-display'), avatarInput: document.getElementById('avatar-input'), avatarPicker: document.querySelector('.avatar-picker'), role: document.getElementById('role'), style: document.getElementById('style'), traitsContainer: document.getElementById('traits-container'), traitInfoPopup: document.getElementById('trait-info-popup'), traitInfoClose: document.getElementById('trait-info-close'), traitInfoTitle: document.getElementById('trait-info-title'), traitInfoBody: document.getElementById('trait-info-body'), save: document.getElementById('save'), clearForm: document.getElementById('clear-form'), peopleList: document.getElementById('people-list'), livePreview: document.getElementById('live-preview'), modal: document.getElementById('detail-modal'), modalBody: document.getElementById('modal-body'), modalClose: document.getElementById('modal-close'), resourcesBtn: document.getElementById('resources-btn'), resourcesModal: document.getElementById('resources-modal'), resourcesClose: document.getElementById('resources-close'), glossaryBtn: document.getElementById('glossary-btn'), glossaryModal: document.getElementById('glossary-modal'), glossaryClose: document.getElementById('glossary-close'), glossaryBody: document.getElementById('glossary-body'), styleDiscoveryBtn: document.getElementById('style-discovery-btn'), styleDiscoveryModal: document.getElementById('style-discovery-modal'), styleDiscoveryClose: document.getElementById('style-discovery-close'), styleDiscoveryRoleFilter: document.getElementById('style-discovery-role'), styleDiscoveryBody: document.getElementById('style-discovery-body'), themesBtn: document.getElementById('themes-btn'), themesModal: document.getElementById('themes-modal'), themesClose: document.getElementById('themes-close'), themesBody: document.getElementById('themes-body'), exportBtn: document.getElementById('export-btn'), importBtn: document.getElementById('import-btn'), importFileInput: document.getElementById('import-file-input'), themeToggle: document.getElementById('theme-toggle')
    };
    if (!this.elements.name || !this.elements.role || !this.elements.style || !this.elements.save || !this.elements.peopleList || !this.elements.modal) { throw new Error("Missing critical elements"); }

    console.log("TrackerApp Constructor: Elements found.");
    this.addEventListeners(); // Call the updated method
    console.log("TrackerApp Constructor: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    console.log("TrackerApp Constructor: Initial render complete.");
  }

  // --- Local Storage & Data Handling --- (Keep as before)
  loadFromLocalStorage() { /* ... */ try { const d=localStorage.getItem('kinkProfiles'); const p=d?JSON.parse(d):[]; this.people=p.map(p=>({...p,goals:p.goals||[],history:p.history||[],avatar:p.avatar||'❓',achievements:p.achievements||[]})); console.log(`Loaded ${this.people.length}`); } catch(e){console.error("Load Error:",e);this.people=[];}}
  saveToLocalStorage() { /* ... */ try { localStorage.setItem('kinkProfiles', JSON.stringify(this.people)); console.log(`Saved ${this.people.length}`); } catch(e){console.error("Save Error:",e);alert("Save failed.");}}


  // --- Event Listeners Setup (Using Arrow Functions) ---
  addEventListeners() {
    // Form - Using arrow functions for handlers calling class methods
    this.elements.role.addEventListener('change', () => {
        console.log("Role changed");
        const role = this.elements.role.value;
        this.renderStyles(role);
        this.elements.style.value = '';
        this.renderTraits(role, '');
        this.updateLivePreview();
    });
    this.elements.style.addEventListener('change', () => {
        console.log("Style changed");
        this.renderTraits(this.elements.role.value, this.elements.style.value);
        this.updateLivePreview();
    });
    this.elements.name.addEventListener('input', () => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click', (e) => { // Arrow function for avatar pick
         if (e.target.classList.contains('avatar-btn')) {
            const emoji = e.target.dataset.emoji;
            if (emoji) {
                this.elements.avatarInput.value = emoji;
                this.elements.avatarDisplay.textContent = emoji;
                this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => {
                    btn.classList.toggle('selected', btn === e.target);
                });
                this.updateLivePreview();
            }
        }
    });

    // Buttons - Using arrow functions for handlers calling class methods
    this.elements.save.addEventListener('click', () => this.savePerson());
    this.elements.clearForm.addEventListener('click', () => this.resetForm(true));
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.elements.exportBtn?.addEventListener('click', () => this.exportData());
    this.elements.importBtn?.addEventListener('click', () => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change', (e) => this.importData(e)); // Pass event

    // People List - Using arrow functions for handlers calling class methods
    this.elements.peopleList.addEventListener('click', (e) => { // Arrow function for list click
      const personLi = e.target.closest('.person');
      if (!personLi) return;
      const personId = parseInt(personLi.dataset.id);
      if (isNaN(personId)) return;

      if (e.target.classList.contains('edit-btn')) {
        this.editPerson(personId); // `this` is correctly TrackerApp instance
      } else if (e.target.classList.contains('delete-btn')) {
        this.deletePerson(personId); // `this` is correctly TrackerApp instance
      } else {
        this.showPersonDetails(personId); // `this` is correctly TrackerApp instance
      }
    });
    this.elements.peopleList.addEventListener('keydown', (e) => { // Arrow function for list keydown
        const personLi = e.target.closest('.person');
        if (!personLi) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const personId = parseInt(personLi.dataset.id);
            if (!isNaN(personId)) {
                 this.showPersonDetails(personId); // `this` is correctly TrackerApp instance
            }
        }
    });

    // Modals - Using arrow functions for handlers calling class methods
    this.elements.modalClose?.addEventListener('click', () => this.closeModal(this.elements.modal));
    this.elements.resourcesBtn?.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose?.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));
    this.elements.glossaryBtn?.addEventListener('click', () => this.showGlossary());
    this.elements.glossaryClose?.addEventListener('click', () => this.closeModal(this.elements.glossaryModal));
    this.elements.styleDiscoveryBtn?.addEventListener('click', () => this.showStyleDiscovery());
    this.elements.styleDiscoveryClose?.addEventListener('click', () => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => this.renderStyleDiscoveryContent());
    this.elements.themesBtn?.addEventListener('click', () => this.openModal(this.elements.themesModal));
    this.elements.themesClose?.addEventListener('click', () => this.closeModal(this.elements.themesModal));
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e)); // Pass event

    // Global listeners - Can remain standard functions or be arrows
    window.addEventListener('click', (e) => {
        if (e.target === this.elements.modal) this.closeModal(this.elements.modal);
        if (e.target === this.elements.resourcesModal) this.closeModal(this.elements.resourcesModal);
        if (e.target === this.elements.glossaryModal) this.closeModal(this.elements.glossaryModal);
        if (e.target === this.elements.styleDiscoveryModal) this.closeModal(this.elements.styleDiscoveryModal);
        if (e.target === this.elements.themesModal) this.closeModal(this.elements.themesModal);
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (this.elements.modal?.style.display === 'flex') this.closeModal(this.elements.modal);
            if (this.elements.resourcesModal?.style.display === 'flex') this.closeModal(this.elements.resourcesModal);
            if (this.elements.glossaryModal?.style.display === 'flex') this.closeModal(this.elements.glossaryModal);
            if (this.elements.styleDiscoveryModal?.style.display === 'flex') this.closeModal(this.elements.styleDiscoveryModal);
            if (this.elements.themesModal?.style.display === 'flex') this.closeModal(this.elements.themesModal);
        }
    });

    // Dynamic listeners - Using arrow functions
    this.elements.traitsContainer.addEventListener('input', (e) => { // Arrow function for trait input
        if (e.target.classList.contains('trait-slider')) {
            this.updateTraitDescription(e.target);
            this.updateLivePreview();
            const value = e.target.value;
            const person = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : null;
            if (person) {
                if (value === '5') grantAchievement(person, 'max_trait');
                if (value === '1') grantAchievement(person, 'min_trait');
            }
        }
    });
    this.elements.traitsContainer.addEventListener('click', (e) => { // Arrow function for trait info click
        if (e.target.classList.contains('trait-info-btn')) {
            const traitName = e.target.dataset.trait;
            if (traitName) {
                this.showTraitInfo(traitName);
            }
        }
    });
    this.elements.traitInfoClose?.addEventListener('click', () => this.hideTraitInfo());

    // Using arrow function for modal body clicks
    this.elements.modalBody.addEventListener('click', (e) => {
        const targetId = e.target.id;
        const targetClass = e.target.classList;
        const personId = parseInt(e.target.dataset.personId);
        const goalId = parseInt(e.target.dataset.goalId);

        // Check `this` context here if needed: console.log('Modal Body Click THIS:', this);

        if (targetId === 'save-reflections-btn' && !isNaN(personId)) this.saveReflections(personId);
        else if (targetId === 'prompt-btn') this.showJournalPrompt();
        else if (targetId === 'snapshot-btn' && !isNaN(personId)) this.addSnapshotToHistory(personId);
        else if (targetClass.contains('snapshot-info-btn')) this.toggleSnapshotInfo(e.target);
        else if (targetId === 'reading-btn' && !isNaN(personId)) this.showKinkReading(personId);
        else if (targetClass.contains('add-goal-btn') && !isNaN(personId)) this.addGoal(personId);
        else if (targetClass.contains('toggle-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.toggleGoalStatus(personId, goalId);
        else if (targetClass.contains('delete-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.deleteGoal(personId, goalId);
    });
  }

  // --- Event Handler Functions --- (Removed explicit .bind(this) calls where arrow functions are now used)
  // (No *functional* changes needed inside handleRoleChange, handleStyleChange etc.)
  // ... Keep all handle... methods definitions as they were ...

  // --- Core Rendering Logic --- (Keep as before)
  renderStyles(role) { /* ... */ }
  renderTraits(role, styleName) { /* ... */ }
  createTraitHTML(trait) { /* ... */ }
  updateTraitDescription(slider) { /* ... */ }
  renderList() { /* ... */ }
  createPersonListItemHTML(person) { /* ... */ }

  // --- CRUD Operations --- (Keep as before)
  savePerson() { /* ... */ }
  editPerson(personId) { /* ... */ }
  deletePerson(personId) { /* ... */ }
  resetForm(clearPreview = false) { /* ... */ }

  // --- Live Preview --- (Keep as before)
  updateLivePreview() { /* ... */ }

  // --- Modal Display ---
  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) { console.error("Details Error: Person not found", personId); return; }
    console.log("Showing details for:", person);

    // *** DEBUG LOGS ***
    console.log("`this` inside showPersonDetails:", this);
    console.log("Is getIntroForStyle a function on this?", typeof this.getIntroForStyle === 'function');
    // *** END DEBUG LOGS ***

    // Ensure defaults
    person.goals=person.goals||[]; person.history=person.history||[]; person.achievements=person.achievements||[]; person.reflections=person.reflections||{}; person.avatar=person.avatar||'❓';

    const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(person.style, person.traits || {});

    // --- Build HTML ---
    let html = `<h2 class="modal-title" id="detail-modal-title">${person.avatar} ${this.escapeHTML(person.name)}’s Kingdom ${person.avatar}</h2>`;
    html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase()+person.role.slice(1)} - ${person.style?this.escapeHTML(person.style):'N/A'}</p>`;

    // *** The problematic line is likely here or just after ***
    const intro = this.getIntroForStyle(person.style); // Call the method
    if (intro) html += `<p class="modal-intro">${intro}</p>`;

    // Goals Section
    html += `<section class="goals-section"><h3>🎯 Goals</h3><ul id="goal-list-${person.id}"></ul><div class="add-goal-form"><input type="text" id="new-goal-text-${person.id}" placeholder="Add goal..." aria-label="New goal"><button class="add-goal-btn save-btn small-btn" data-person-id="${person.id}">+ Add</button></div></section>`;
    // Breakdown Section
    html += `<h3>🌈 Strengths & Growth</h3><div class="style-breakdown modal-breakdown">`; if (B.strengths) html += `<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`; if (B.improvements) html += `<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`; html += `</div>`;
    // Trait Tales Section
    html += `<h3>🎨 Trait Tales</h3>`; const defs=[...(bdsmData[person.role]?.coreTraits||[]), ...(bdsmData[person.role]?.styles.find(s=>s.name===person.style)?.traits||[])]; const uDefs=Array.from(new Map(defs.map(t=>[t.name,t])).values());
    html += '<div class="trait-details-grid">'; if(person.traits&&Object.keys(person.traits).length>0){Object.entries(person.traits).forEach(([name,score])=>{const tO=uDefs.find(t=>t.name===name);const dN=name.charAt(0).toUpperCase()+name.slice(1);if(!tO){html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score}❓</h4><p class="muted-text"><em>Def not found.</em></p></div>`;return;}const dTxt=tO.desc?.[score]||"N/A";const flair=this.getFlairForScore(score);html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score} ${this.getEmojiForScore(score)}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(dTxt)}</p><p class="muted-text"><em>${flair}</em></p></div>`;});}else{html+=`<p class="muted-text">No scores.</p>`;}html+='</div>';
    // History Section
    html += `<section class="history-section"><h3>⏳ Trait History<button class="snapshot-info-btn" aria-label="Snapshot Info" aria-expanded="false">ℹ️</button></h3><p class="snapshot-info muted-text" style="display: none;">Click 'Snapshot' to save current scores. Track growth!</p><div class="history-chart-container"><canvas id="history-chart"></canvas></div><button id="snapshot-btn" class="small-btn" data-person-id="${person.id}">📸 Snapshot</button></section>`;
    // Achievements Section
    html += `<section class="achievements-section"><h3>🏆 Achievements</h3><div id="achievements-list-${person.id}"></div></section>`;
    // Reading Section
    html += `<section class="kink-reading-section"><h3>🔮 Reading</h3><button id="reading-btn" class="small-btn" data-person-id="${person.id}">Get Reading!</button><div id="kink-reading-output" class="kink-reading-output" style="display: none;"></div></section>`;
    // Reflections Section
    html += `<section class="reflections-section"><h3>📝 Reflections</h3><div id="journal-prompt-area" class="journal-prompt" style="display: none;"></div><div class="modal-actions"><button id="prompt-btn" class="small-btn">💡 Get Prompt</button></div><textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="Thoughts?">${this.escapeHTML(person.reflections?.text||'')}</textarea><button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save 💭</button></section>`;

    this.elements.modalBody.innerHTML=html;
    this.renderGoalList(person);
    this.renderAchievements(person);
    this.openModal(this.elements.modal);
    this.renderHistoryChart(person);
  }

  // --- New Feature Logic --- (Keep all as before)
  addGoal(personId){ /* ... */ }
  toggleGoalStatus(personId, goalId){ /* ... */ }
  deleteGoal(personId, goalId){ /* ... */ }
  renderGoalList(person){ /* ... */ }
  showJournalPrompt(){ /* ... */ }
  saveReflections(personId){ /* ... */ }
  addSnapshotToHistory(personId){ /* ... */ }
  renderHistoryChart(person){ /* ... */ }
  toggleSnapshotInfo(buttonElement){ /* ... */ }
  renderAchievements(person){ /* ... */ }
  showKinkReading(personId){ /* ... */ }
  getReadingDescriptor(tN,sc){ /* ... */ }
  getStyleEssence(sN){ /* ... */ }
  showGlossary(){ /* ... */ }
  showStyleDiscovery(){ /* ... */ }
  renderStyleDiscoveryContent(){ /* ... */ }
  setTheme(tN){ /* ... */ }
  applySavedTheme(){ /* ... */ }
  toggleTheme(){ /* ... */ }
  exportData(){ /* ... */ }
  importData(event){ /* ... */ }
  showTraitInfo(traitName){ /* ... */ }
  hideTraitInfo(){ /* ... */ }

  // --- Helper Functions --- (Keep all as before)
  // *** ENSURE getIntroForStyle IS DEFINED HERE, INSIDE THE CLASS ***
  getIntroForStyle(styleName) {
    const key = styleName?.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim() || '';
    const intros = { /* The full list of intros */
        "submissive":"Welcome, lovely Submissive! ✨","brat":"Hehe, ready for trouble, Brat? 😉","slave":"Step into devotion, noble Slave. 🙏","switch":"Master of moods, versatile Switch! ↔️","pet":"Time for head pats, adorable Pet! 💖","little":"Land of crayons & cuddles, sweet Little! 🧸","puppy":"Woof woof! Ready for zoomies, playful Puppy? 🦴","kitten":"Curious Kitten, ready to pounce? 🧶","princess":"Your Highness! Ready to be adored? 👑","rope bunny":"Ready for knots of fun, lovely Rope Bunny? 🎀","masochist":"Welcome, sensation seeker! 🔥","prey":"The chase is on, little Prey! 🦊","toy":"Wind up & play, delightful Toy! 🎁","doll":"Poised & perfect Doll, strike a pose! 💖","bunny":"Soft steps, gentle heart, sweet Bunny! 🐇","servant":"Dedicated Servant, at your service! 🧹","playmate":"Game on, enthusiastic Playmate! 🎉","babygirl":"Sweet & sassy Babygirl! 😉","captive":"Caught again, daring Captive? ⛓️","thrall":"Deep focus, devoted Thrall. 🌀","puppet":"Dance to their tune, perfect Puppet? 🎭","maid":"Impeccable Maid, ready to sparkle? ✨","painslut":"Eager & ready, devoted Painslut? 🔥","bottom":"Open heart, yielding power, beautiful Bottom. 💖","dominant":"Step into your power, noble Dominant! 🔥","assertive":"Clear voice, strong boundaries, Assertive! 💪","nurturer":"Warm heart, steady hand, Nurturer! 🌸","strict":"Order & structure, firm Strict! ⚖️","master":"Commanding presence, Master! 🏰","mistress":"Elegant authority, Mistress! 👑","daddy":"Protective arms, loving Daddy! 🧸","mommy":"Nurturing embrace, caring Mommy! 💖","owner":"Claiming your prize, Owner! 🐾","rigger":"Artist with rope, Rigger! 🎨","sadist":"Conductor of sensation, Sadist! 🔥","hunter":"Primal instincts, Hunter! 🐺","trainer":"Patient teacher, Trainer! 🏆","puppeteer":"Pulling strings, Puppeteer! 🎭","protector":"Steadfast shield, Protector! 🛡️","disciplinarian":"Fair judgment, Disciplinarian! 👨‍⚖️","caretaker":"Attentive eye, Caretaker! ❤️‍🩹","sir":"Dignified command, Sir! 🎩","goddess":"Radiant power, Goddess! ✨","commander":"Strategic mind, Commander! 🎖️"
    };
    return intros[key] || "Explore your unique and wonderful expression!";
  }
  getFlairForScore(score){return parseInt(score)<=2?"🌱 Keep nurturing!":parseInt(score)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(score){return parseInt(score)<=2?"💧":parseInt(score)===3?"🌱":parseInt(score)===4?"✨":"🌟";}
  escapeHTML(str){str=String(str??'');const el=document.createElement('div');el.textContent=str;return el.innerHTML;}
  openModal(mE){if(!mE)return;mE.style.display='flex';const f=mE.querySelector('button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])');if(f)requestAnimationFrame(()=>f.focus());}
  closeModal(mE){if(!mE)return;mE.style.display='none';}

} // --- END OF TrackerApp CLASS ---

// --- Initialization --- (Keep as before)
try {
    console.log("Initializing KinkCompass App..."); window.kinkCompassApp=new TrackerApp(); console.log("Initialized.");
} catch (e) { console.error("Init Error:", e); document.body.innerHTML=`<div style="..."><h1 style="color:red;">Oops! Failed to Start</h1>...<i>Error: ${e.message}</i></div>`; }

// --- END OF FILE app.js ---
