// --- START OF FILE app.js ---

import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js is loaded via CDN in index.html

class TrackerApp {
  constructor() {
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null; // To hold the Chart.js instance

    // Find elements immediately
    this.elements = {
      formSection: document.getElementById('form-section'),
      name: document.getElementById('name'),
      avatarDisplay: document.getElementById('avatar-display'),
      avatarInput: document.getElementById('avatar-input'),
      avatarPicker: document.querySelector('.avatar-picker'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),
      peopleList: document.getElementById('people-list'),
      livePreview: document.getElementById('live-preview'),
      // Modals & Controls
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close'),
      resourcesBtn: document.getElementById('resources-btn'),
      resourcesModal: document.getElementById('resources-modal'),
      resourcesClose: document.getElementById('resources-close'),
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
      exportBtn: document.getElementById('export-btn'),
      importBtn: document.getElementById('import-btn'),
      importFileInput: document.getElementById('import-file-input'),
      themeToggle: document.getElementById('theme-toggle')
    };

    // Initial check for critical elements
    if (!this.elements.name || !this.elements.role || !this.elements.style || !this.elements.save || !this.elements.peopleList || !this.elements.modal) {
         console.error("Missing critical HTML elements.");
         document.body.innerHTML = '<p style="color: red; padding: 1em;">Error: Critical HTML elements missing. Check console (F12).</p>';
         throw new Error("Missing critical elements");
    }

    console.log("TrackerApp Constructor: Elements found.");
    this.addEventListeners();
    console.log("TrackerApp Constructor: Listeners added.");

    this.loadFromLocalStorage();
    this.applySavedTheme();

    // Initial Render
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    console.log("TrackerApp Constructor: Initial render complete.");
  }

  // --- Local Storage & Data Handling ---
  loadFromLocalStorage() { /* ... (keep as before) ... */
      try {
          const storedPeople = localStorage.getItem('kinkProfiles');
          const parsedPeople = storedPeople ? JSON.parse(storedPeople) : [];
          this.people = parsedPeople.map(p => ({ ...p, goals: Array.isArray(p.goals) ? p.goals : [], history: Array.isArray(p.history) ? p.history : [], avatar: p.avatar || '❓', achievements: Array.isArray(p.achievements) ? p.achievements : [] }));
          console.log(`Loaded ${this.people.length} profiles.`);
      } catch (error) { console.error("Error loading profiles:", error); this.people = []; }
  }
  saveToLocalStorage() { /* ... (keep as before) ... */
    try { localStorage.setItem('kinkProfiles', JSON.stringify(this.people)); console.log(`Saved ${this.people.length} profiles.`); }
    catch (error) { console.error("Error saving:", error); alert("Could not save profiles."); }
  }

  // --- Event Listeners Setup ---
  addEventListeners() { /* ... (keep full list as before) ... */
      // Form
      this.elements.role.addEventListener('change', this.handleRoleChange.bind(this));
      this.elements.style.addEventListener('change', this.handleStyleChange.bind(this));
      this.elements.name.addEventListener('input', this.updateLivePreview.bind(this));
      this.elements.avatarPicker?.addEventListener('click', this.handleAvatarPick.bind(this));
      // Buttons
      this.elements.save.addEventListener('click', this.savePerson.bind(this));
      this.elements.clearForm.addEventListener('click', () => this.resetForm(true));
      this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
      this.elements.exportBtn?.addEventListener('click', this.exportData.bind(this));
      this.elements.importBtn?.addEventListener('click', () => this.elements.importFileInput?.click());
      this.elements.importFileInput?.addEventListener('change', this.importData.bind(this));
      // People List
      this.elements.peopleList.addEventListener('click', this.handleListClick.bind(this));
      this.elements.peopleList.addEventListener('keydown', this.handleListKeydown.bind(this));
      // Modals
      this.elements.modalClose?.addEventListener('click', () => this.closeModal(this.elements.modal));
      this.elements.resourcesBtn?.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
      this.elements.resourcesClose?.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));
      this.elements.glossaryBtn?.addEventListener('click', this.showGlossary.bind(this));
      this.elements.glossaryClose?.addEventListener('click', () => this.closeModal(this.elements.glossaryModal));
      this.elements.styleDiscoveryBtn?.addEventListener('click', this.showStyleDiscovery.bind(this));
      this.elements.styleDiscoveryClose?.addEventListener('click', () => this.closeModal(this.elements.styleDiscoveryModal));
      this.elements.styleDiscoveryRoleFilter?.addEventListener('change', this.renderStyleDiscoveryContent.bind(this));
      this.elements.themesBtn?.addEventListener('click', () => this.openModal(this.elements.themesModal));
      this.elements.themesClose?.addEventListener('click', () => this.closeModal(this.elements.themesModal));
      this.elements.themesBody?.addEventListener('click', this.handleThemeSelection.bind(this));
      // Global
      window.addEventListener('click', this.handleWindowClick.bind(this));
      window.addEventListener('keydown', this.handleWindowKeydown.bind(this));
      // Dynamic
      this.elements.traitsContainer.addEventListener('input', this.handleTraitSliderInput.bind(this));
      this.elements.modalBody.addEventListener('click', this.handleModalBodyClick.bind(this));
  }

  // --- Event Handler Functions --- (Keep all handlers as before)
  handleRoleChange() { /* ... */ const role = this.elements.role.value; this.renderStyles(role); this.elements.style.value = ''; this.renderTraits(role, ''); this.updateLivePreview(); }
  handleStyleChange() { /* ... */ this.renderTraits(this.elements.role.value, this.elements.style.value); this.updateLivePreview(); }
  handleAvatarPick(e) { /* ... */ if (e.target.classList.contains('avatar-btn')) { const emoji = e.target.dataset.emoji; if (emoji) { this.elements.avatarInput.value = emoji; this.elements.avatarDisplay.textContent = emoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => { btn.classList.toggle('selected', btn === e.target); }); this.updateLivePreview(); } } }
  handleListClick(e) { /* ... */ const li = e.target.closest('.person'); if (!li) return; const id = parseInt(li.dataset.id); if(isNaN(id)) return; if (e.target.classList.contains('edit-btn')) this.editPerson(id); else if (e.target.classList.contains('delete-btn')) this.deletePerson(id); else this.showPersonDetails(id); }
  handleListKeydown(e) { /* ... */ const li = e.target.closest('.person'); if (!li) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const id = parseInt(li.dataset.id); if (!isNaN(id)) this.showPersonDetails(id); }}
  handleWindowClick(e) { /* ... */ if (e.target === this.elements.modal) this.closeModal(this.elements.modal); if (e.target === this.elements.resourcesModal) this.closeModal(this.elements.resourcesModal); if (e.target === this.elements.glossaryModal) this.closeModal(this.elements.glossaryModal); if (e.target === this.elements.styleDiscoveryModal) this.closeModal(this.elements.styleDiscoveryModal); if (e.target === this.elements.themesModal) this.closeModal(this.elements.themesModal); }
  handleWindowKeydown(e) { /* ... */ if (e.key === 'Escape') { if (this.elements.modal?.style.display === 'flex') this.closeModal(this.elements.modal); if (this.elements.resourcesModal?.style.display === 'flex') this.closeModal(this.elements.resourcesModal); if (this.elements.glossaryModal?.style.display === 'flex') this.closeModal(this.elements.glossaryModal); if (this.elements.styleDiscoveryModal?.style.display === 'flex') this.closeModal(this.elements.styleDiscoveryModal); if (this.elements.themesModal?.style.display === 'flex') this.closeModal(this.elements.themesModal); }}
  handleTraitSliderInput(e) { /* ... */ if (e.target.classList.contains('trait-slider')) { this.updateTraitDescription(e.target); this.updateLivePreview(); const value = e.target.value; const person = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : null; if (person) { if (value === '5') grantAchievement(person, 'max_trait'); if (value === '1') grantAchievement(person, 'min_trait'); }} }
  handleModalBodyClick(e) { /* ... (Keep all checks as before) ... */
    const targetId = e.target.id;
    const targetClass = e.target.classList;
    const personId = parseInt(e.target.dataset.personId);
    const goalId = parseInt(e.target.dataset.goalId);

    if (targetId === 'save-reflections-btn' && !isNaN(personId)) this.saveReflections(personId);
    else if (targetId === 'prompt-btn') this.showJournalPrompt();
    else if (targetId === 'snapshot-btn' && !isNaN(personId)) this.addSnapshotToHistory(personId);
    else if (targetId === 'reading-btn' && !isNaN(personId)) this.showKinkReading(personId);
    else if (targetClass.contains('add-goal-btn') && !isNaN(personId)) this.addGoal(personId);
    else if (targetClass.contains('toggle-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.toggleGoalStatus(personId, goalId);
    else if (targetClass.contains('delete-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.deleteGoal(personId, goalId);
  }
  handleThemeSelection(e) { /* ... */ if (e.target.classList.contains('theme-option-btn')) { const themeName = e.target.dataset.theme; if (themeName) { this.setTheme(themeName); grantAchievement({}, 'theme_changer'); } } }


  // --- Core Rendering Logic ---
  renderStyles(role) { /* ... (keep as before) ... */
    this.elements.style.innerHTML = '<option value="">Pick your flavor!</option>'; if (!bdsmData[role]?.styles) return;
    bdsmData[role].styles.forEach(s => { this.elements.style.innerHTML += `<option value="${this.escapeHTML(s.name)}">${this.escapeHTML(s.name)}</option>`; });
  }
  renderTraits(role, styleName) { /* ... (keep as before) ... */
    this.elements.traitsContainer.innerHTML = ''; if (!bdsmData[role]) return;
    const core = bdsmData[role].coreTraits || []; let styleT = []; let styleO = null;
    if (styleName) { styleO = bdsmData[role].styles.find(s => s.name === styleName); styleT = styleO?.traits || []; }
    const toRender = []; const uniqueNames = new Set();
    [...core, ...styleT].forEach(t => { if (t && t.name && !uniqueNames.has(t.name)) { toRender.push(t); uniqueNames.add(t.name); }});
    if (toRender.length === 0) { this.elements.traitsContainer.innerHTML = `<p class="muted-text">No traits defined.</p>`; }
    else { toRender.forEach(t => { this.elements.traitsContainer.innerHTML += this.createTraitHTML(t); }); this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(s => this.updateTraitDescription(s)); }
    if (styleName && styleO && styleT.length === 0 && core.length > 0) { const msg = document.createElement('p'); msg.className = 'muted-text trait-info-message'; msg.textContent = `Style '${this.escapeHTML(styleName)}' uses core traits.`; this.elements.traitsContainer.prepend(msg); }
    else if (!styleName && core.length === 0) { this.elements.traitsContainer.innerHTML = `<p class="muted-text">Select style or define core traits.</p>`; }
  }
  createTraitHTML(trait) { /* ... (keep as before) ... */
    const dName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1); const id = `trait-${trait.name.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
    return `<div class="trait"><label for="${id}">${this.escapeHTML(dName)}</label><input type="range" id="${id}" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" aria-label="${this.escapeHTML(dName)} slider" autocomplete="off"/><span class="trait-value">3</span><div class="trait-desc muted-text"></div></div>`;
  }
  updateTraitDescription(slider) { /* ... (keep as before) ... */
    const tName = slider.getAttribute('data-trait'); const val = slider.value;
    const descDiv = slider.parentElement?.querySelector('.trait-desc'); const valSpan = slider.parentElement?.querySelector('.trait-value');
    if (!descDiv || !valSpan) return; const role = this.elements.role.value; const styleN = this.elements.style.value;
    let tData = bdsmData[role]?.styles.find(s => s.name === styleN)?.traits?.find(t => t.name === tName) || bdsmData[role]?.coreTraits?.find(t => t.name === tName);
    valSpan.textContent = val;
    if (tData?.desc?.[val]) { descDiv.textContent = this.escapeHTML(tData.desc[val]); } else { descDiv.textContent = tData ? 'Desc unavailable.' : 'Trait unavailable.'; }
  }
  renderList() { /* ... (keep as before) ... */
    if (!this.elements.peopleList) return; this.elements.peopleList.innerHTML = this.people.length === 0 ? `<li>No kinky pals yet! ✨</li>` : this.people.map(p => this.createPersonListItemHTML(p)).join('');
  }
  createPersonListItemHTML(person) { /* ... (keep as before, including avatar) ... */
     const styleD = person.style ? this.escapeHTML(person.style) : "N/A"; const roleD = person.role.charAt(0).toUpperCase() + person.role.slice(1); const nameE = this.escapeHTML(person.name); const avatar = person.avatar || '❓';
     return `<li class="person" data-id="${person.id}" tabindex="0" aria-label="View ${nameE}"><span class="person-info"><span class="person-avatar" aria-hidden="true">${avatar}</span><span class="person-name-details"><strong class="person-name">${nameE}</strong><span class="person-details muted-text">(${roleD} - ${styleD})</span></span></span><span class="person-actions"><button class="edit-btn small-btn" aria-label="Edit ${nameE}">✏️ Edit</button><button class="delete-btn small-btn" aria-label="Delete ${nameE}">🗑️ Delete</button></span></li>`;
   }

  // --- CRUD Operations ---
  savePerson() { /* ... (keep as before, including avatar save and achievement grants) ... */
    const name = this.elements.name.value.trim() || "Unnamed"; const avatar = this.elements.avatarInput.value || '❓';
    const role = this.elements.role.value; const styleName = this.elements.style.value;
    if (!styleName) { alert("Please select a style."); this.elements.style.focus(); return; }
    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    const expected = [...(bdsmData[role]?.coreTraits || []), ...(bdsmData[role]?.styles.find(s => s.name === styleName)?.traits || [])];
    const uniqueExpected = new Set(expected.map(t => t.name));
    if (sliders.length !== uniqueExpected.size && uniqueExpected.size > 0) { alert("Trait loading error."); return; }
    const traits = {}; let missingData = false;
    sliders.forEach(s => { const n = s.getAttribute('data-trait'); if(n) traits[n] = s.value; else missingData = true; });
    if (missingData) { alert("Error gathering trait data."); return; }
    for (const n of uniqueExpected) { if (!traits.hasOwnProperty(n)) { alert(`Missing data for trait '${n}'.`); return; }}
    const existingPerson = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : null;
    const personData = { id: this.currentEditId || Date.now(), name, avatar, role, style: styleName, goals: existingPerson?.goals || [], traits, history: existingPerson?.history || [], achievements: existingPerson?.achievements || [], reflections: existingPerson?.reflections || {} };
    if (!this.currentEditId) grantAchievement(personData, 'profile_created');
    if (this.people.length === 4 && !this.currentEditId) grantAchievement(personData, 'five_profiles');
    if (this.currentEditId) grantAchievement(personData, 'profile_edited');
    if (this.currentEditId) { const i = this.people.findIndex(p => p.id === this.currentEditId); if (i !== -1) this.people[i] = personData; else { console.error("Update error"); personData.id = Date.now(); this.people.push(personData); }}
    else { this.people.push(personData); }
    this.saveToLocalStorage(); this.renderList(); this.resetForm(true);
    alert(`${this.escapeHTML(name)}'s profile saved! ✨`);
  }
  editPerson(personId) { /* ... (keep as before, including avatar set) ... */
    const person = this.people.find(p => p.id === personId); if (!person) { alert("Profile not found."); return; }
    this.currentEditId = personId; this.elements.name.value = person.name;
    this.elements.avatarDisplay.textContent = person.avatar || '❓'; this.elements.avatarInput.value = person.avatar || '❓';
    this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.toggle('selected', btn.dataset.emoji === person.avatar));
    this.elements.role.value = person.role; this.renderStyles(person.role); this.elements.style.value = person.style; this.renderTraits(person.role, person.style);
    requestAnimationFrame(() => { if (person.traits) { Object.entries(person.traits).forEach(([name, value]) => { const s = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${name}"]`); if (s) { s.value = value; this.updateTraitDescription(s); }});} this.updateLivePreview(); this.elements.save.textContent = 'Update Sparkle! ✨'; this.elements.formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' }); this.elements.name.focus(); });
  }
  deletePerson(personId) { /* ... (keep as before) ... */
    const idx = this.people.findIndex(p => p.id === personId); if (idx === -1) return; const name = this.people[idx].name;
    if (confirm(`Delete ${this.escapeHTML(name)}?`)) { this.people.splice(idx, 1); this.saveToLocalStorage(); this.renderList(); if (this.currentEditId === personId) this.resetForm(true); alert(`${this.escapeHTML(name)} deleted.`); console.log(`Deleted ID: ${personId}`); }
  }
  resetForm(clearPreview = false) { /* ... (keep as before, including avatar reset) ... */
    this.elements.name.value = ''; this.elements.avatarDisplay.textContent = '❓'; this.elements.avatarInput.value = '❓';
    this.elements.avatarPicker?.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
    this.elements.role.value = 'submissive'; // goals removed
    this.renderStyles('submissive'); this.elements.style.value = ''; this.renderTraits('submissive', '');
    this.currentEditId = null; this.elements.save.textContent = 'Save Your Sparkle! 💖';
    if (clearPreview) this.updateLivePreview(); this.elements.name.focus(); console.log("Form reset.");
  }

  // --- Live Preview ---
  updateLivePreview() { /* ... (keep as before, including avatar) ... */
    const name = this.elements.name.value.trim()||"Unnamed"; const avatar = this.elements.avatarInput.value||'❓'; const role = this.elements.role.value; const style = this.elements.style.value;
    const traits = {}; this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(s => { const n = s.getAttribute('data-trait'); if (n) traits[n] = s.value; });
    let html = '';
    if (!style) { html = `<p class="muted-text">Pick a style! 🌈</p>`; }
    else { const getB = role === 'submissive' ? getSubBreakdown : getDomBreakdown; const B = getB(style, traits);
        html = `<h3 class="preview-title">${avatar} ${this.escapeHTML(name)}’s Vibe ${avatar}</h3>`;
        html += `<p><strong>Role:</strong> ${role.charAt(0).toUpperCase()+role.slice(1)}</p>`;
        html += `<p><strong>Style:</strong> ${style?this.escapeHTML(style):"N/A"}</p>`;
        html += `<div class="style-breakdown preview-breakdown">`;
        if (B.strengths) html += `<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;
        if (B.improvements) html += `<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;
        html += `</div>`;
    } this.elements.livePreview.innerHTML = html;
  }

  // --- Modal Display ---
  showPersonDetails(personId) { /* ... (keep as before, including all sections) ... */
    const person = this.people.find(p => p.id === personId); if (!person) return; console.log("Showing details for:", person);
    person.goals=person.goals||[]; person.history=person.history||[]; person.achievements=person.achievements||[]; person.reflections=person.reflections||{}; person.avatar=person.avatar||'❓'; // Ensure defaults
    const getB = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown; const B = getB(person.style, person.traits || {});
    let html = `<h2 class="modal-title" id="detail-modal-title">${person.avatar} ${this.escapeHTML(person.name)}’s Kingdom ${person.avatar}</h2>`;
    html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase()+person.role.slice(1)} - ${person.style?this.escapeHTML(person.style):'N/A'}</p>`;
    const intro = this.getIntroForStyle(person.style); if (intro) html += `<p class="modal-intro">${intro}</p>`;
    html += `<section class="goals-section"><h3>🎯 Goals</h3><ul id="goal-list-${person.id}">`; /* Render goals here */ html += `</ul><div class="add-goal-form"><input type="text" id="new-goal-text-${person.id}" placeholder="Add goal..." aria-label="New goal"><button class="add-goal-btn save-btn small-btn" data-person-id="${person.id}">+ Add</button></div></section>`;
    html += `<h3>🌈 Strengths & Growth</h3><div class="style-breakdown modal-breakdown">`; if (B.strengths) html += `<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`; if (B.improvements) html += `<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`; html += `</div>`;
    html += `<h3>🎨 Trait Tales</h3>`; const defs = [...(bdsmData[person.role]?.coreTraits||[]), ...(bdsmData[person.role]?.styles.find(s=>s.name===person.style)?.traits||[])]; const uDefs = Array.from(new Map(defs.map(t=>[t.name,t])).values());
    html += '<div class="trait-details-grid">'; if (person.traits && Object.keys(person.traits).length>0) { Object.entries(person.traits).forEach(([name, score]) => { const tO = uDefs.find(t => t.name === name); const dN = name.charAt(0).toUpperCase()+name.slice(1); if (!tO) { html += `<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score}❓</h4><p class="muted-text"><em>Def not found.</em></p></div>`; return; } const dTxt = tO.desc?.[score]||"N/A"; const flair = this.getFlairForScore(score); html += `<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score} ${this.getEmojiForScore(score)}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(dTxt)}</p><p class="muted-text"><em>${flair}</em></p></div>`; }); } else { html += `<p class="muted-text">No scores.</p>`; } html += '</div>';
    html += `<section class="history-section"><h3>⏳ History</h3><div class="history-chart-container"><canvas id="history-chart"></canvas></div><button id="snapshot-btn" class="small-btn" data-person-id="${person.id}">📸 Snapshot</button></section>`;
    html += `<section class="achievements-section"><h3>🏆 Achievements</h3><div id="achievements-list-${person.id}"></div></section>`; // Placeholder div for achievements
    html += `<section class="kink-reading-section"><h3>🔮 Reading</h3><button id="reading-btn" class="small-btn" data-person-id="${person.id}">Get Reading!</button><div id="kink-reading-output" class="kink-reading-output" style="display: none;"></div></section>`;
    html += `<section class="reflections-section"><h3>📝 Reflections</h3><div id="journal-prompt-area" class="journal-prompt" style="display: none;"></div><div class="modal-actions"><button id="prompt-btn" class="small-btn">💡 Get Prompt</button></div><textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="Thoughts?">${this.escapeHTML(person.reflections?.text||'')}</textarea><button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save 💭</button></section>`;
    this.elements.modalBody.innerHTML = html;
    this.renderGoalList(person); // Render initial goals
    this.renderAchievements(person); // Render initial achievements
    this.openModal(this.elements.modal);
    this.renderHistoryChart(person); // Render chart AFTER modal is open
  }

  // --- New Feature Logic ---

  // Goals
  addGoal(personId) { /* ... (keep as before) ... */
      const person = this.people.find(p => p.id === personId); const inputEl = this.elements.modalBody.querySelector(`#new-goal-text-${personId}`); if (!person || !inputEl) return; const text = inputEl.value.trim(); if (!text) return;
      const newGoal = { id: Date.now(), text: text, status: 'todo', }; person.goals.push(newGoal); grantAchievement(person, 'goal_added'); this.saveToLocalStorage(); this.renderGoalList(person); inputEl.value = '';
  }
  toggleGoalStatus(personId, goalId) { /* ... (keep as before) ... */
      const person = this.people.find(p => p.id === personId); const goal = person?.goals.find(g => g.id === goalId); if (!goal) return; goal.status = (goal.status === 'done' ? 'todo' : 'done'); this.saveToLocalStorage(); this.renderGoalList(person);
  }
  deleteGoal(personId, goalId) { /* ... (keep as before) ... */
      const person = this.people.find(p => p.id === personId); if (!person) return; if (confirm(`Delete goal?`)) { person.goals = person.goals.filter(g => g.id !== goalId); this.saveToLocalStorage(); this.renderGoalList(person); }
  }
  renderGoalList(person) { /* ... (keep as before) ... */
      const listEl = this.elements.modalBody?.querySelector(`#goal-list-${person.id}`); if (!listEl) return; let listHtml = '';
      if (person.goals.length > 0) { person.goals.forEach(g => { listHtml += `<li class="${g.status === 'done' ? 'done' : ''}" data-goal-id="${g.id}"><span>${this.escapeHTML(g.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${g.id}">${g.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${g.id}">🗑️</button></span></li>`; }); }
      else { listHtml = `<li class="muted-text">No goals yet!</li>`; } listEl.innerHTML = listHtml;
  }

  // Journal Prompts
  showJournalPrompt() { /* ... (keep as before) ... */
      const promptArea = this.elements.modalBody?.querySelector('#journal-prompt-area'); if (promptArea) { promptArea.textContent = getRandomPrompt(); promptArea.style.display = 'block'; this.elements.modalBody?.querySelector('#reflections-text')?.focus(); }
  }
  saveReflections(personId) { /* ... (keep as before, including achievements) ... */
    const person = this.people.find(p => p.id === personId); const el = this.elements.modalBody?.querySelector('#reflections-text'); if (!person || !el) { alert("Error."); return; } const txt = el.value; if (!person.reflections) person.reflections = {}; person.reflections.text = txt; person.reflections.lastUpdated = Date.now();
    let firstSave = false; if (txt.trim().length > 0) firstSave = grantAchievement(person, 'reflection_saved');
    // Simple reflection count check for achievement
    const reflectionCount = Object.values(this.people.reduce((acc, p) => { if (p.reflections?.text?.trim().length > 0) acc[p.id] = true; return acc; }, {})).length; // Count profiles with reflections
    if (reflectionCount >= 5) grantAchievement(person, 'five_reflections'); // Grant if 5+ profiles have reflections (simplistic)
    this.saveToLocalStorage(); console.log(`Reflections saved for ${person.name}`); const btn = this.elements.modalBody.querySelector('#save-reflections-btn'); if(btn) { btn.textContent = 'Saved ✓'; btn.disabled = true; setTimeout(() => { btn.textContent = 'Save 💭'; btn.disabled = false; }, 2000); } else { alert("Saved! ✨"); }
  }

  // Trait History
  addSnapshotToHistory(personId) { /* ... (keep as before, including achievement) ... */
      const person = this.people.find(p => p.id === personId); if (!person || !person.traits) { alert("Cannot snapshot."); return; }
      const snapshot = { date: Date.now(), traits: { ...person.traits } }; person.history.push(snapshot); grantAchievement(person, 'history_snapshot'); this.saveToLocalStorage(); alert("Snapshot saved! 📸"); this.renderHistoryChart(person); this.renderAchievements(person); // Update achievements display too
  }

  // RESUMING HERE //
  renderHistoryChart(person) {
      const container = this.elements.modalBody?.querySelector('.history-chart-container');
      const ctx = container?.querySelector('#history-chart')?.getContext('2d');

      // Clear previous chart instance if exists
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }

      if (!ctx) {
          console.error("History chart canvas context not found.");
          if (container) container.innerHTML = `<p class="muted-text">Chart canvas not found.</p>`;
          return;
      }
      if (!person || !person.history || person.history.length === 0) {
           container.innerHTML = `<p class="muted-text">No history snapshots yet. Take a snapshot to see trends!</p>`;
           return; // Don't render chart if no data
      }

      // Ensure canvas is clean if message was shown
      if (container.querySelector('p')) container.innerHTML = `<canvas id="history-chart"></canvas>`;
      // Re-get context if canvas was replaced
      const freshCtx = container.querySelector('#history-chart').getContext('2d');

      // Prepare data for Chart.js
      const labels = person.history.map(snap => new Date(snap.date).toLocaleDateString());

      // Find all unique trait names across history (and current traits for consistency)
      const allTraitNames = new Set();
      person.history.forEach(snap => Object.keys(snap.traits).forEach(name => allTraitNames.add(name)));
      if (person.traits) Object.keys(person.traits).forEach(name => allTraitNames.add(name)); // Include current traits

      const datasets = [];
      const colors = ['#ff69b4', '#8a5a6d', '#ff85cb', '#4a2c3d', '#f4d4e4', '#c49db1', '#a0d8ef', '#dcc1ff', '#79b8d1']; // Example colors

      let colorIndex = 0;
      allTraitNames.forEach(traitName => {
          const data = person.history.map(snap => snap.traits[traitName] !== undefined ? parseInt(snap.traits[traitName]) : null); // Use null for missing data points
          const color = colors[colorIndex % colors.length];
          datasets.push({
              label: traitName.charAt(0).toUpperCase() + traitName.slice(1),
              data: data,
              borderColor: color,
              backgroundColor: color + '80', // Semi-transparent fill
              tension: 0.1, // Slight curve
              fill: false, // Don't fill under line
              spanGaps: true, // Connect lines over nulls
          });
          colorIndex++;
      });

      // Get current theme for chart colors
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const gridColor = isDark ? 'rgba(244, 212, 228, 0.15)' : 'rgba(74, 44, 61, 0.1)';
      const labelColor = isDark ? '#c49db1' : '#8a5a6d';

      // Create the chart
      this.chartInstance = new Chart(freshCtx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: datasets
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'top',
                      labels: { color: labelColor }
                  },
                  tooltip: {
                      mode: 'index',
                      intersect: false,
                  }
              },
              scales: {
                  y: {
                      beginAtZero: false, // Start axis near lowest value
                      min: 1, // Traits range 1-5
                      max: 5,
                      ticks: { stepSize: 1, color: labelColor },
                      grid: { color: gridColor }
                  },
                  x: {
                      ticks: { color: labelColor },
                      grid: { color: gridColor }
                  }
              }
          }
      });
  } // --- END OF renderHistoryChart ---

  // Achievements
  renderAchievements(person) {
      const listEl = this.elements.modalBody?.querySelector(`#achievements-list-${person.id}`);
      if (!listEl) return; // Ensure element exists

      let achievementsHTML = '';
      if (person.achievements.length > 0) {
          achievementsHTML += `<ul>`;
          person.achievements.forEach(achId => {
              const achData = achievementList[achId];
              if (achData) {
                   const emoji = achData.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0] || '🏆';
                   achievementsHTML += `<li title="${this.escapeHTML(achData.desc)}">
                                       <span class="achievement-icon" aria-hidden="true">${emoji}</span>
                                       <span class="achievement-name">${this.escapeHTML(achData.name)}</span>
                                     </li>`;
              }
          });
          achievementsHTML += `</ul>`;
      } else {
          achievementsHTML = `<p class="muted-text">No achievements yet!</p>`;
      }
      listEl.innerHTML = achievementsHTML;
  }

  // Kink Reading
  showKinkReading(personId) {
      const person = this.people.find(p => p.id === personId);
      const outputEl = this.elements.modalBody?.querySelector('#kink-reading-output');
      if (!person || !outputEl) return;

      grantAchievement(person, 'kink_reading'); // Grant achievement
      this.saveToLocalStorage(); // Save achievement grant
      this.renderAchievements(person); // Update display

      let reading = `🔮 ${this.escapeHTML(person.name)}'s Reading 🔮\n`;
      const traits = person.traits || {};
      const scores = Object.entries(traits).map(([name, score]) => ({ name, score: parseInt(score) })).sort((a, b) => b.score - a.score); // Sort high to low

      const styleData = bdsmData[person.role]?.styles.find(s => s.name === person.style);

      reading += `As a ${this.escapeHTML(person.style)} ${person.role}, your path sparkles!\n`;

      if (scores.length > 0) {
          const highestTrait = scores[0];
          const lowestTrait = scores[scores.length - 1];
          const coreTrait1 = bdsmData[person.role]?.coreTraits[0]?.name;
          const coreTrait2 = bdsmData[person.role]?.coreTraits[1]?.name;

          reading += `\n✨ Your brightest star shines in **${highestTrait.name} (Level ${highestTrait.score})**! This suggests a powerful current of ${this.getReadingDescriptor(highestTrait.name, highestTrait.score)}. Lean into this strength!\n`;

          if (coreTrait1 && traits[coreTrait1]) {
               reading += `🧭 Your core **${coreTrait1}** is currently at Level ${traits[coreTrait1]}, guiding you towards ${this.getReadingDescriptor(coreTrait1, traits[coreTrait1])}.\n`;
          }
           if (coreTrait2 && traits[coreTrait2]) {
               reading += `🧭 Your core **${coreTrait2}** is currently at Level ${traits[coreTrait2]}, reminding you of the importance of ${this.getReadingDescriptor(coreTrait2, traits[coreTrait2])}.\n`;
          }

          if (scores.length > 1 && highestTrait.score !== lowestTrait.score) {
              reading += `\n🌱 Where might you bloom next? Consider focusing on **${lowestTrait.name} (Level ${lowestTrait.score})**. Exploring ${this.getReadingDescriptor(lowestTrait.name, lowestTrait.score)} could unlock new dimensions.\n`;
          }
      } else {
           reading += `\nYour traits are yet to be fully charted! Explore the sliders to discover your unique constellations.\n`;
      }

      // Add a style-specific tidbit
      reading += `\n💖 Remember, being a ${this.escapeHTML(person.style)} is all about ${this.getStyleEssence(person.style)}!\n`;

      outputEl.textContent = reading; // Use textContent for safety here
      outputEl.style.display = 'block';
  }

  // Helper for reading descriptors (expand this!)
  getReadingDescriptor(traitName, score) {
      // Simple examples, make these more evocative
      score = parseInt(score);
      if (traitName === 'obedience') return score >= 4 ? "joyful compliance" : score <= 2 ? "independent spirit" : "developing discipline";
      if (traitName === 'trust') return score >= 4 ? "deep connection" : score <= 2 ? "cautious exploration" : "building security";
      if (traitName === 'authority') return score >= 4 ? "confident command" : score <= 2 ? "emerging leadership" : "finding your voice";
      if (traitName === 'care') return score >= 4 ? "attentive guardianship" : score <= 2 ? "learning empathy" : "providing support";
      if (traitName === 'playful defiance') return score >= 4 ? "sparkling mischief" : score <= 2 ? "testing boundaries" : "witty challenges";
      // Add many more...
      return "your unique expression of this trait"; // Fallback
  }
   // Helper for style essence (expand this!)
   getStyleEssence(styleName) {
       const essences = { "Brat": "playful challenge", "Slave": "deep devotion", "Little": "innocent joy", "Daddy": "protective guidance", "Rigger": "binding artistry", "Sadist": "intense connection" };
       const key = styleName?.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim() || '';
       return essences[key] || `your special ${styleName} magic`;
   }


  // Glossary
  showGlossary() {
      if (!this.elements.glossaryBody) return;
      grantAchievement({}, 'glossary_user'); // Grant globally for now

      let html = '<dl>';
      for (const key in glossaryTerms) {
          const termData = glossaryTerms[key];
          html += `<dt id="gloss-term-${key}">${this.escapeHTML(termData.term)}</dt>`;
          html += `<dd>${this.escapeHTML(termData.definition)}`;
          if (termData.related && termData.related.length > 0) {
              html += `<br><span class="related-terms">See also: `;
              html += termData.related.map(relKey => `<a href="#gloss-term-${relKey}">${glossaryTerms[relKey]?.term || relKey}</a>`).join(', ');
              html += `</span>`;
          }
          html += `</dd>`;
      }
      html += '</dl>';
      this.elements.glossaryBody.innerHTML = html;
      this.openModal(this.elements.glossaryModal);
  }

  // Style Discovery
  showStyleDiscovery() {
      grantAchievement({}, 'style_explorer'); // Grant globally for now
      this.renderStyleDiscoveryContent(); // Render content based on initial filter
      this.openModal(this.elements.styleDiscoveryModal);
  }

  renderStyleDiscoveryContent() {
      if (!this.elements.styleDiscoveryBody || !this.elements.styleDiscoveryRoleFilter) return;

      const selectedRole = this.elements.styleDiscoveryRoleFilter.value; // 'all', 'submissive', 'dominant'
      let html = '';

      ['submissive', 'dominant'].forEach(role => {
          if (selectedRole === 'all' || selectedRole === role) {
              html += `<h3>${role.charAt(0).toUpperCase() + role.slice(1)} Styles</h3>`;
              if (bdsmData[role]?.styles) {
                  bdsmData[role].styles.forEach(style => {
                      html += `<div class="style-discovery-item">`;
                      html += `<h4>${this.escapeHTML(style.name)}</h4>`;
                      // Add a brief description or intro if available (could add to data.js)
                      // html += `<p>${this.getIntroForStyle(style.name)}</p>`; // Reuse intros?
                      if (style.traits && style.traits.length > 0) {
                          html += `<strong>Key Traits:</strong><ul>`;
                          style.traits.forEach(trait => {
                              html += `<li>${this.escapeHTML(trait.name.charAt(0).toUpperCase() + trait.name.slice(1))}</li>`;
                          });
                          html += `</ul>`;
                      } else {
                          html += `<p class="muted-text">Uses core ${role} traits.</p>`;
                      }
                      html += `</div>`;
                  });
              } else {
                  html += `<p class="muted-text">No styles defined for ${role}.</p>`;
              }
          }
      });

      this.elements.styleDiscoveryBody.innerHTML = html || '<p>No styles found for this filter.</p>';
  }


  // Themes
  setTheme(themeName) {
      document.body.setAttribute('data-theme', themeName);
      // Update theme toggle button state if needed (or handle via CSS)
      const isDark = themeName === 'dark' || themeName === 'velvet'; // Example dark themes
      if(this.elements.themeToggle) {
          this.elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
          this.elements.themeToggle.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      }
      try {
         localStorage.setItem('kinkCompassTheme', themeName);
      } catch (error) { console.warn("Could not save theme preference:", error); }
      console.log(`Theme set to ${themeName}`);
      // If chart is open, re-render it with new theme colors
      if (this.chartInstance && this.currentEditId) {
           const person = this.people.find(p => p.id === this.currentEditId);
           if (person) this.renderHistoryChart(person);
      }
  }

  applySavedTheme() { /* ... (keep as before, just calls setTheme) ... */
     let savedTheme = 'light';
     try { if (typeof localStorage !== 'undefined') savedTheme = localStorage.getItem('kinkCompassTheme') || 'light'; }
     catch (error) { console.warn("Could not read theme preference:", error); }
     this.setTheme(savedTheme); // Use setTheme to apply and update UI consistently
     console.log(`Applied saved theme: ${savedTheme}`);
  }

   // Theme toggle button functionality (simple light/dark toggle)
  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    // Determine if current is 'dark-like'
    const isCurrentlyDark = currentTheme === 'dark' || currentTheme === 'velvet';
    const newBaseTheme = isCurrentlyDark ? 'light' : 'dark';
    this.setTheme(newBaseTheme); // Set to basic light/dark
  }

  // Data Export/Import
  exportData() {
      if (this.people.length === 0) {
          alert("No profiles to export!");
          return;
      }
      try {
          const dataStr = JSON.stringify(this.people, null, 2); // Pretty print JSON
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `kinkcompass_profiles_${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          grantAchievement({}, 'data_exported'); // Grant globally
          console.log("Data exported successfully.");
      } catch (error) {
          console.error("Error exporting data:", error);
          alert("Failed to export data.");
      }
  }

  importData(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const importedData = JSON.parse(e.target.result);
              if (!Array.isArray(importedData)) {
                  throw new Error("Imported data is not a valid array.");
              }
              // Rudimentary validation: check if objects have 'id' and 'name'
              const isValid = importedData.every(item => typeof item === 'object' && item !== null && 'id' in item && 'name' in item);
              if (!isValid) {
                  throw new Error("Imported data seems invalid (missing id or name in some items).");
              }

              if (confirm(`Import ${importedData.length} profiles? This will OVERWRITE your current ${this.people.length} profiles.`)) {
                  this.people = importedData.map(p => ({ // Ensure imported data has new fields too
                       ...p,
                       goals: Array.isArray(p.goals) ? p.goals : [],
                       history: Array.isArray(p.history) ? p.history : [],
                       avatar: p.avatar || '❓',
                       achievements: Array.isArray(p.achievements) ? p.achievements : []
                  }));
                  this.saveToLocalStorage();
                  this.renderList();
                  this.resetForm(true); // Reset form after import
                  alert(`Successfully imported ${this.people.length} profiles.`);
                  console.log("Data imported successfully.");
              }
          } catch (error) {
              console.error("Error importing data:", error);
              alert(`Failed to import data: ${error.message}`);
          } finally {
               // Reset file input value so the same file can be selected again if needed
               event.target.value = null;
          }
      };
      reader.onerror = () => {
           alert("Error reading file.");
           event.target.value = null;
      };
      reader.readAsText(file);
  }


  // --- Other Helper Functions ---
  getIntroForStyle(styleName) { /* ... (keep as before) ... */
      const key=styleName?.toLowerCase().replace(/\(.*?\)/g,'').replace(/ \/ /g,'/').trim()||'';
      const intros={/* Use the full intros object from previous response */ "submissive":"Welcome, lovely Submissive! ✨","brat":"Hehe, ready for trouble, Brat? 😉","slave":"Step into devotion, noble Slave. 🙏","switch":"Master of moods, versatile Switch! ↔️","pet":"Time for head pats, adorable Pet! 💖","little":"Land of crayons & cuddles, sweet Little! 🧸","puppy":"Woof woof! Ready for zoomies, playful Puppy? 🦴","kitten":"Curious Kitten, ready to pounce? 🧶","princess":"Your Highness! Ready to be adored? 👑","rope bunny":"Ready for knots of fun, lovely Rope Bunny? 🎀","masochist":"Welcome, sensation seeker! 🔥","prey":"The chase is on, little Prey! 🦊","toy":"Wind up & play, delightful Toy! 🎁","doll":"Poised & perfect Doll, strike a pose! 💖","bunny":"Soft steps, gentle heart, sweet Bunny! 🐇","servant":"Dedicated Servant, at your service! 🧹","playmate":"Game on, enthusiastic Playmate! 🎉","babygirl":"Sweet & sassy Babygirl! 😉","captive":"Caught again, daring Captive? ⛓️","thrall":"Deep focus, devoted Thrall. 🌀","puppet":"Dance to their tune, perfect Puppet? 🎭","maid":"Impeccable Maid, ready to sparkle? ✨","painslut":"Eager & ready, devoted Painslut? 🔥","bottom":"Open heart, yielding power, beautiful Bottom. 💖","dominant":"Step into your power, noble Dominant! 🔥","assertive":"Clear voice, strong boundaries, Assertive! 💪","nurturer":"Warm heart, steady hand, Nurturer! 🌸","strict":"Order & structure, firm Strict! ⚖️","master":"Commanding presence, Master! 🏰","mistress":"Elegant authority, Mistress! 👑","daddy":"Protective arms, loving Daddy! 🧸","mommy":"Nurturing embrace, caring Mommy! 💖","owner":"Claiming your prize, Owner! 🐾","rigger":"Artist with rope, Rigger! 🎨","sadist":"Conductor of sensation, Sadist! 🔥","hunter":"Primal instincts, Hunter! 🐺","trainer":"Patient teacher, Trainer! 🏆","puppeteer":"Pulling strings, Puppeteer! 🎭","protector":"Steadfast shield, Protector! 🛡️","disciplinarian":"Fair judgment, Disciplinarian! 👨‍⚖️","caretaker":"Attentive eye, Caretaker! ❤️‍🩹","sir":"Dignified command, Sir! 🎩","goddess":"Radiant power, Goddess! ✨","commander":"Strategic mind, Commander! 🎖️"};
      return intros[key] || "Explore your unique expression!";
  }
  getFlairForScore(score) { /* ... (keep as before) ... */ return parseInt(score) <= 2 ? "🌱 Keep nurturing!" : parseInt(score) === 3 ? "⚖️ Solidly balanced!" : "🌟 Shining brightly!"; }
  getEmojiForScore(score) { /* ... (keep as before) ... */ return parseInt(score) <= 2 ? "💧" : parseInt(score) === 3 ? "🌱" : parseInt(score) === 4 ? "✨" : "🌟"; }
  escapeHTML(str) { /* ... (keep as before) ... */ str = String(str ?? ''); const el = document.createElement('div'); el.textContent = str; return el.innerHTML; }
  openModal(modalElement) { /* ... (keep as before) ... */ if (!modalElement) return; modalElement.style.display = 'flex'; const f = modalElement.querySelector('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'); if (f) requestAnimationFrame(() => f.focus()); console.log(`Opened modal: #${modalElement.id}`); }
  closeModal(modalElement) { /* ... (keep as before) ... */ if (!modalElement) return; modalElement.style.display = 'none'; console.log(`Closed modal: #${modalElement.id}`); }

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp(); // Assign to window for debugging
    console.log("KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;">
        <h1 style="color: red;">Oops! KinkCompass Failed to Start</h1>
        <p>An unexpected error occurred. Please check the browser console (F12) for details.</p>
        <p><i>Error: ${error.message}</i></p>
    </div>`;
}

// --- END OF FILE app.js ---
