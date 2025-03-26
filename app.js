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
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;

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
      traitInfoPopup: document.getElementById('trait-info-popup'),
      traitInfoClose: document.getElementById('trait-info-close'),
      traitInfoTitle: document.getElementById('trait-info-title'),
      traitInfoBody: document.getElementById('trait-info-body'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),
      peopleList: document.getElementById('people-list'),
      livePreview: document.getElementById('live-preview'),
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
         document.body.innerHTML = '<p style="color: red; padding: 1em;">Error: Critical elements missing. Check console (F12).</p>';
         throw new Error("Missing critical elements");
    }

    console.log("TrackerApp Constructor: Elements found.");
    this.addEventListeners();
    console.log("TrackerApp Constructor: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    console.log("TrackerApp Constructor: Initial render complete.");
  }

  // --- Local Storage & Data Handling ---
  loadFromLocalStorage() {
      try {
          const storedPeople = localStorage.getItem('kinkProfiles');
          const parsedPeople = storedPeople ? JSON.parse(storedPeople) : [];
          this.people = parsedPeople.map(p => ({ ...p, goals: Array.isArray(p.goals) ? p.goals : [], history: Array.isArray(p.history) ? p.history : [], avatar: p.avatar || '❓', achievements: Array.isArray(p.achievements) ? p.achievements : [] }));
          console.log(`Loaded ${this.people.length} profiles.`);
      } catch (error) { console.error("Load Error:", error); this.people = []; }
  }
  saveToLocalStorage() {
    try { localStorage.setItem('kinkProfiles', JSON.stringify(this.people)); console.log(`Saved ${this.people.length} profiles.`); }
    catch (error) { console.error("Save Error:", error); alert("Could not save profiles."); }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
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
      this.elements.traitsContainer.addEventListener('click', this.handleTraitInfoClick.bind(this)); // Listener for trait info icons
      this.elements.traitInfoClose?.addEventListener('click', this.hideTraitInfo.bind(this)); // Listener for trait info close
      this.elements.modalBody.addEventListener('click', this.handleModalBodyClick.bind(this));
  }

  // --- Event Handler Functions ---
  handleRoleChange() { const r=this.elements.role.value; this.renderStyles(r); this.elements.style.value=''; this.renderTraits(r,''); this.updateLivePreview(); }
  handleStyleChange() { this.renderTraits(this.elements.role.value, this.elements.style.value); this.updateLivePreview(); }
  handleAvatarPick(e) { if(e.target.classList.contains('avatar-btn')){const em=e.target.dataset.emoji; if(em){this.elements.avatarInput.value=em;this.elements.avatarDisplay.textContent=em;this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b===e.target));this.updateLivePreview();}} }
  handleListClick(e) { const li=e.target.closest('.person');if(!li)return;const id=parseInt(li.dataset.id);if(isNaN(id))return;if(e.target.classList.contains('edit-btn'))this.editPerson(id);else if(e.target.classList.contains('delete-btn'))this.deletePerson(id);else this.showPersonDetails(id); }
  handleListKeydown(e) { const li=e.target.closest('.person');if(!li)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=parseInt(li.dataset.id);if(!isNaN(id))this.showPersonDetails(id);}}
  handleWindowClick(e) { if(e.target===this.elements.modal)this.closeModal(this.elements.modal);if(e.target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);if(e.target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);if(e.target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);if(e.target===this.elements.themesModal)this.closeModal(this.elements.themesModal); }
  handleWindowKeydown(e) { if(e.key==='Escape'){if(this.elements.modal?.style.display==='flex')this.closeModal(this.elements.modal);if(this.elements.resourcesModal?.style.display==='flex')this.closeModal(this.elements.resourcesModal);if(this.elements.glossaryModal?.style.display==='flex')this.closeModal(this.elements.glossaryModal);if(this.elements.styleDiscoveryModal?.style.display==='flex')this.closeModal(this.elements.styleDiscoveryModal);if(this.elements.themesModal?.style.display==='flex')this.closeModal(this.elements.themesModal);}}
  handleTraitSliderInput(e) { if(e.target.classList.contains('trait-slider')){this.updateTraitDescription(e.target);this.updateLivePreview();const v=e.target.value;const p=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;if(p){if(v==='5')grantAchievement(p,'max_trait');if(v==='1')grantAchievement(p,'min_trait');}}}
  handleTraitInfoClick(e) { if (e.target.classList.contains('trait-info-btn')) { const traitName = e.target.dataset.trait; if (traitName) { this.showTraitInfo(traitName); } } }
  handleModalBodyClick(e) {
    const targetId = e.target.id; const targetClass = e.target.classList;
    const personId = parseInt(e.target.dataset.personId); const goalId = parseInt(e.target.dataset.goalId);
    if (targetId === 'save-reflections-btn' && !isNaN(personId)) this.saveReflections(personId);
    else if (targetId === 'prompt-btn') this.showJournalPrompt();
    else if (targetId === 'snapshot-btn' && !isNaN(personId)) this.addSnapshotToHistory(personId);
    else if (targetClass.contains('snapshot-info-btn')) this.toggleSnapshotInfo(e.target);
    else if (targetId === 'reading-btn' && !isNaN(personId)) this.showKinkReading(personId);
    else if (targetClass.contains('add-goal-btn') && !isNaN(personId)) this.addGoal(personId);
    else if (targetClass.contains('toggle-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.toggleGoalStatus(personId, goalId);
    else if (targetClass.contains('delete-goal-btn') && !isNaN(personId) && !isNaN(goalId)) this.deleteGoal(personId, goalId);
  }
  handleThemeSelection(e) { if(e.target.classList.contains('theme-option-btn')){const tN=e.target.dataset.theme;if(tN){this.setTheme(tN);grantAchievement({},'theme_changer');}}}

  // --- Core Rendering Logic ---
  renderStyles(role) { this.elements.style.innerHTML = '<option value="">Pick flavor!</option>'; if(!bdsmData[role]?.styles)return; bdsmData[role].styles.forEach(s=>{this.elements.style.innerHTML += `<option value="${this.escapeHTML(s.name)}">${this.escapeHTML(s.name)}</option>`;}); }
  renderTraits(role, styleName) {
      this.elements.traitsContainer.innerHTML=''; if(!bdsmData[role])return;
      const core=bdsmData[role].coreTraits||[]; let styleT=[]; let styleO=null;
      if(styleName){styleO=bdsmData[role].styles.find(s=>s.name===styleName); styleT=styleO?.traits||[];}
      const toRender=[]; const uniqueNames=new Set();
      [...core,...styleT].forEach(t=>{if(t&&t.name&&!uniqueNames.has(t.name)){toRender.push(t);uniqueNames.add(t.name);}});
      if(toRender.length===0){this.elements.traitsContainer.innerHTML=`<p class="muted-text">No traits.</p>`;}
      else{toRender.forEach(t=>{this.elements.traitsContainer.innerHTML+=this.createTraitHTML(t);}); this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(s=>this.updateTraitDescription(s));}
      if(styleName&&styleO&&styleT.length===0&&core.length>0){const m=document.createElement('p');m.className='muted-text trait-info-message';m.textContent=`Style '${this.escapeHTML(styleName)}' uses core traits.`;this.elements.traitsContainer.prepend(m);}
      else if(!styleName&&core.length===0){this.elements.traitsContainer.innerHTML=`<p class="muted-text">Select style or define traits.</p>`;}
      this.hideTraitInfo(); // Hide info popup when traits re-render
  }
  createTraitHTML(trait) {
    const dName=trait.name.charAt(0).toUpperCase()+trait.name.slice(1);const id=`trait-${trait.name.replace(/[^a-zA-Z0-9-_]/g,'-')}`;
    return `<div class="trait"><label for="${id}">${this.escapeHTML(dName)}</label><button class="trait-info-btn" data-trait="${trait.name}" aria-label="Info about ${this.escapeHTML(dName)} trait">ℹ️</button><input type="range" id="${id}" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" aria-label="${this.escapeHTML(dName)} slider" autocomplete="off"/><span class="trait-value">3</span><div class="trait-desc muted-text"></div></div>`;
  }
  updateTraitDescription(slider) {
      const tN=slider.getAttribute('data-trait'); const v=slider.value; const dD=slider.parentElement?.querySelector('.trait-desc'); const vS=slider.parentElement?.querySelector('.trait-value'); if(!dD||!vS)return;
      const r=this.elements.role.value; const sN=this.elements.style.value;
      let tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN) || bdsmData[r]?.coreTraits?.find(t=>t.name===tN);
      vS.textContent=v; if(tD?.desc?.[v]){dD.textContent=this.escapeHTML(tD.desc[v]);} else{dD.textContent=tD?'Desc unavailable.':'Trait unavailable.';}
  }
  renderList() { if(!this.elements.peopleList)return; this.elements.peopleList.innerHTML = this.people.length===0?`<li>No pals yet! ✨</li>`:this.people.map(p=>this.createPersonListItemHTML(p)).join(''); }
  createPersonListItemHTML(person) {
     const sD=person.style?this.escapeHTML(person.style):"N/A"; const rD=person.role.charAt(0).toUpperCase()+person.role.slice(1); const nE=this.escapeHTML(person.name); const av=person.avatar||'❓';
     return `<li class="person" data-id="${person.id}" tabindex="0" aria-label="View ${nE}"><span class="person-info"><span class="person-avatar" aria-hidden="true">${av}</span><span class="person-name-details"><strong class="person-name">${nE}</strong><span class="person-details muted-text">(${rD} - ${sD})</span></span></span><span class="person-actions"><button class="edit-btn small-btn" aria-label="Edit ${nE}">✏️ Edit</button><button class="delete-btn small-btn" aria-label="Delete ${nE}">🗑️ Delete</button></span></li>`;
   }

  // --- CRUD Operations ---
  savePerson() {
      const name=this.elements.name.value.trim()||"Unnamed"; const avatar=this.elements.avatarInput.value||'❓';
      const role=this.elements.role.value; const styleName=this.elements.style.value;
      if(!styleName){alert("Select style.");this.elements.style.focus();return;}
      const sliders=this.elements.traitsContainer.querySelectorAll('.trait-slider');
      const expected=[...(bdsmData[role]?.coreTraits||[]),...(bdsmData[role]?.styles.find(s=>s.name===styleName)?.traits||[])];
      const uniqueExpected=new Set(expected.map(t=>t.name));
      if(sliders.length!==uniqueExpected.size&&uniqueExpected.size>0){alert("Trait error.");return;}
      const traits={}; let missingData=false; sliders.forEach(s=>{const n=s.getAttribute('data-trait');if(n)traits[n]=s.value;else missingData=true;}); if(missingData){alert("Error gathering traits.");return;}
      for(const n of uniqueExpected){if(!traits.hasOwnProperty(n)){alert(`Missing data: '${n}'.`);return;}}
      const existing=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;
      const personData={id:this.currentEditId||Date.now(),name,avatar,role,style:styleName,goals:existing?.goals||[],traits,history:existing?.history||[],achievements:existing?.achievements||[],reflections:existing?.reflections||{}};
      if(!this.currentEditId)grantAchievement(personData,'profile_created');
      if(this.people.length===4&&!this.currentEditId)grantAchievement(personData,'five_profiles');
      if(this.currentEditId)grantAchievement(personData,'profile_edited');
      if(this.currentEditId){const i=this.people.findIndex(p=>p.id===this.currentEditId); if(i!==-1)this.people[i]=personData; else{console.error("Update error");personData.id=Date.now();this.people.push(personData);}} else{this.people.push(personData);}
      this.saveToLocalStorage();this.renderList();this.resetForm(true); alert(`${this.escapeHTML(name)} saved! ✨`);
  }
  editPerson(personId) {
      const person=this.people.find(p=>p.id===personId); if(!person){alert("Not found.");return;}
      this.currentEditId=personId; this.elements.name.value=person.name;
      this.elements.avatarDisplay.textContent=person.avatar||'❓'; this.elements.avatarInput.value=person.avatar||'❓';
      this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b.dataset.emoji===person.avatar));
      this.elements.role.value=person.role; this.renderStyles(person.role); this.elements.style.value=person.style; this.renderTraits(person.role,person.style);
      requestAnimationFrame(()=>{if(person.traits){Object.entries(person.traits).forEach(([n,v])=>{const s=this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${n}"]`);if(s){s.value=v;this.updateTraitDescription(s);}}); }this.updateLivePreview();this.elements.save.textContent='Update ✨';this.elements.formSection?.scrollIntoView({behavior:'smooth'});this.elements.name.focus();});
  }
  deletePerson(personId) {
      const idx=this.people.findIndex(p=>p.id===personId); if(idx===-1)return; const name=this.people[idx].name; if(confirm(`Delete ${this.escapeHTML(name)}?`)){this.people.splice(idx,1);this.saveToLocalStorage();this.renderList();if(this.currentEditId===personId)this.resetForm(true);alert(`${this.escapeHTML(name)} deleted.`);}
  }
  resetForm(clearPreview = false) {
      this.elements.name.value=''; this.elements.avatarDisplay.textContent='❓'; this.elements.avatarInput.value='❓';
      this.elements.avatarPicker?.querySelectorAll('.selected').forEach(b=>b.classList.remove('selected'));
      this.elements.role.value='submissive'; this.renderStyles('submissive'); this.elements.style.value=''; this.renderTraits('submissive','');
      this.currentEditId=null; this.elements.save.textContent='Save Sparkle! 💖'; if(clearPreview)this.updateLivePreview(); this.elements.name.focus(); console.log("Form reset."); this.hideTraitInfo(); // Hide info popup on reset
  }

  // --- Live Preview ---
  updateLivePreview() {
      const name=this.elements.name.value.trim()||"Unnamed"; const av=this.elements.avatarInput.value||'❓'; const r=this.elements.role.value; const s=this.elements.style.value;
      const tr={}; this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(sl=>{const n=sl.getAttribute('data-trait');if(n)tr[n]=sl.value;});
      let html='';
      if(!s && r && Object.keys(tr).length > 0) { // Handle core traits only case
          html = `<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Core Vibe ${av}</h3>`;
          html += `<p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p>`;
          html += `<p class="muted-text"><i>Core traits active. Pick a Style!</i></p>`;
          html += `<div><strong>Core Traits Now:</strong><ul>`;
          bdsmData[r]?.coreTraits?.forEach(ct => { if(tr[ct.name]) html += `<li>${this.escapeHTML(ct.name)}: ${tr[ct.name]}</li>`; });
          html += `</ul></div>`;
      } else if (s) { // Style selected
          const getB=r==='submissive'?getSubBreakdown:getDomBreakdown; const B=getB(s,tr);
          html = `<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Live Vibe ${av}</h3>`;
          html += `<p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p><p><strong>Style:</strong> ${this.escapeHTML(s)}</p>`;
          html += `<div class="style-breakdown preview-breakdown">`;
          if(B.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;
          if(B.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;
          html+=`</div>`;
      } else { // Nothing selected
          html = `<p class="muted-text">Pick role & style! 🌈</p>`;
      }
      this.elements.livePreview.innerHTML=html;
  }


  // --- Modal Display ---
  showPersonDetails(personId) {
      const person = this.people.find(p => p.id === personId); if (!person) return;
      // Ensure defaults
      person.goals=person.goals||[]; person.history=person.history||[]; person.achievements=person.achievements||[]; person.reflections=person.reflections||{}; person.avatar=person.avatar||'❓';
      const getB = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown; const B = getB(person.style, person.traits || {});
      let html = `<h2 class="modal-title" id="detail-modal-title">${person.avatar} ${this.escapeHTML(person.name)}’s Kingdom ${person.avatar}</h2>`;
      html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase()+person.role.slice(1)} - ${person.style?this.escapeHTML(person.style):'N/A'}</p>`;
      const intro = this.getIntroForStyle(person.style); if (intro) html += `<p class="modal-intro">${intro}</p>`;
      // Goals
      html += `<section class="goals-section"><h3>🎯 Goals</h3><ul id="goal-list-${person.id}"></ul><div class="add-goal-form"><input type="text" id="new-goal-text-${person.id}" placeholder="Add goal..." aria-label="New goal"><button class="add-goal-btn save-btn small-btn" data-person-id="${person.id}">+ Add</button></div></section>`;
      // Breakdown
      html += `<h3>🌈 Strengths & Growth</h3><div class="style-breakdown modal-breakdown">`; if (B.strengths) html += `<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`; if (B.improvements) html += `<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`; html += `</div>`;
      // Traits
      html += `<h3>🎨 Trait Tales</h3>`; const defs=[...(bdsmData[person.role]?.coreTraits||[]), ...(bdsmData[person.role]?.styles.find(s=>s.name===person.style)?.traits||[])]; const uDefs=Array.from(new Map(defs.map(t=>[t.name,t])).values());
      html += '<div class="trait-details-grid">'; if(person.traits&&Object.keys(person.traits).length>0){Object.entries(person.traits).forEach(([name,score])=>{const tO=uDefs.find(t=>t.name===name);const dN=name.charAt(0).toUpperCase()+name.slice(1);if(!tO){html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score}❓</h4><p class="muted-text"><em>Def not found.</em></p></div>`;return;}const dTxt=tO.desc?.[score]||"N/A";const flair=this.getFlairForScore(score);html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${score} ${this.getEmojiForScore(score)}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(dTxt)}</p><p class="muted-text"><em>${flair}</em></p></div>`;});}else{html+=`<p class="muted-text">No scores.</p>`;}html+='</div>';
      // History
      html += `<section class="history-section"><h3>⏳ Trait History<button class="snapshot-info-btn" aria-label="Snapshot Info" aria-expanded="false">ℹ️</button></h3><p class="snapshot-info muted-text" style="display: none;">Click 'Snapshot' to save current scores to the chart. Track growth!</p><div class="history-chart-container"><canvas id="history-chart"></canvas></div><button id="snapshot-btn" class="small-btn" data-person-id="${person.id}">📸 Snapshot</button></section>`;
      // Achievements
      html += `<section class="achievements-section"><h3>🏆 Achievements</h3><div id="achievements-list-${person.id}"></div></section>`;
      // Reading
      html += `<section class="kink-reading-section"><h3>🔮 Reading</h3><button id="reading-btn" class="small-btn" data-person-id="${person.id}">Get Reading!</button><div id="kink-reading-output" class="kink-reading-output" style="display: none;"></div></section>`;
      // Reflections
      html += `<section class="reflections-section"><h3>📝 Reflections</h3><div id="journal-prompt-area" class="journal-prompt" style="display: none;"></div><div class="modal-actions"><button id="prompt-btn" class="small-btn">💡 Get Prompt</button></div><textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="Thoughts?">${this.escapeHTML(person.reflections?.text||'')}</textarea><button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save 💭</button></section>`;
      this.elements.modalBody.innerHTML=html; this.renderGoalList(person); this.renderAchievements(person); this.openModal(this.elements.modal); this.renderHistoryChart(person);
  }

  // --- New Feature Logic ---
  // Goals...
  addGoal(personId){const p=this.people.find(p=>p.id===personId);const i=this.elements.modalBody.querySelector(`#new-goal-text-${personId}`);if(!p||!i)return;const t=i.value.trim();if(!t)return;const nG={id:Date.now(),text:t,status:'todo',};p.goals.push(nG);grantAchievement(p,'goal_added');this.saveToLocalStorage();this.renderGoalList(p);i.value='';}
  toggleGoalStatus(personId,goalId){const p=this.people.find(p=>p.id===personId);const g=p?.goals.find(g=>g.id===goalId);if(!g)return;g.status=(g.status==='done'?'todo':'done');this.saveToLocalStorage();this.renderGoalList(p);}
  deleteGoal(personId,goalId){const p=this.people.find(p=>p.id===personId);if(!p)return;if(confirm('Delete goal?')){p.goals=p.goals.filter(g=>g.id!==goalId);this.saveToLocalStorage();this.renderGoalList(p);}}
  renderGoalList(person){const l=this.elements.modalBody?.querySelector(`#goal-list-${person.id}`);if(!l)return;let h='';if(person.goals.length>0){person.goals.forEach(g=>{h+=`<li class="${g.status==='done'?'done':''}" data-goal-id="${g.id}"><span>${this.escapeHTML(g.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${g.id}">${g.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${g.id}">🗑️</button></span></li>`;});}else{h=`<li class="muted-text">No goals!</li>`;}l.innerHTML=h;}
  // Journal Prompts...
  showJournalPrompt(){const a=this.elements.modalBody?.querySelector('#journal-prompt-area');if(a){a.textContent=getRandomPrompt();a.style.display='block';this.elements.modalBody?.querySelector('#reflections-text')?.focus();}}
  saveReflections(personId){const p=this.people.find(p=>p.id===personId);const el=this.elements.modalBody?.querySelector('#reflections-text');if(!p||!el){alert("Error.");return;}const txt=el.value;if(!p.reflections)p.reflections={};p.reflections.text=txt;p.reflections.lastUpdated=Date.now();let first=false;if(txt.trim().length>0)first=grantAchievement(p,'reflection_saved');const count=Object.values(this.people.reduce((a,p)=>{if(p.reflections?.text?.trim().length>0)a[p.id]=true;return a;},{})).length;if(count>=5)grantAchievement(p,'five_reflections');this.saveToLocalStorage();const btn=this.elements.modalBody.querySelector('#save-reflections-btn');if(btn){btn.textContent='Saved ✓';btn.disabled=true;setTimeout(()=>{btn.textContent='Save 💭';btn.disabled=false;},2000);}else{alert("Saved! ✨");}}
  // Trait History...
  addSnapshotToHistory(personId){const p=this.people.find(p=>p.id===personId);if(!p||!p.traits){alert("Cannot snapshot.");return;}const snap={date:Date.now(),traits:{...p.traits}};p.history.push(snap);grantAchievement(p,'history_snapshot');this.saveToLocalStorage();alert("Snapshot saved! 📸");this.renderHistoryChart(p);this.renderAchievements(p);}
  renderHistoryChart(person){const cont=this.elements.modalBody?.querySelector('.history-chart-container');let ctx=cont?.querySelector('#history-chart')?.getContext('2d');if(this.chartInstance){this.chartInstance.destroy();this.chartInstance=null;}if(!ctx){if(cont)cont.innerHTML=`<p class="muted-text">Chart canvas missing.</p>`;return;}if(!person?.history?.length){cont.innerHTML=`<p class="muted-text">No history yet!</p>`;return;}if(cont.querySelector('p'))cont.innerHTML=`<canvas id="history-chart"></canvas>`;ctx=cont.querySelector('#history-chart').getContext('2d');const labels=person.history.map(s=>new Date(s.date).toLocaleDateString());const allNames=new Set();person.history.forEach(s=>Object.keys(s.traits).forEach(n=>allNames.add(n)));if(person.traits)Object.keys(person.traits).forEach(n=>allNames.add(n));const datasets=[];const colors=['#ff69b4','#8a5a6d','#ff85cb','#4a2c3d','#f4d4e4','#c49db1','#a0d8ef','#dcc1ff'];let cIdx=0;allNames.forEach(tName=>{const data=person.history.map(s=>s.traits[tName]!==undefined?parseInt(s.traits[tName]):null);const c=colors[cIdx%colors.length];datasets.push({label:tName.charAt(0).toUpperCase()+tName.slice(1),data:data,borderColor:c,backgroundColor:c+'80',tension:.1,fill:false,spanGaps:true});cIdx++;});const isD=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';const gridC=isD?'rgba(244,212,228,0.15)':'rgba(74,44,61,0.1)';const labelC=isD?'#c49db1':'#8a5a6d';this.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:datasets},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{color:labelC}},tooltip:{mode:'index',intersect:false,}},scales:{y:{min:1,max:5,ticks:{stepSize:1,color:labelC},grid:{color:gridC}},x:{ticks:{color:labelC},grid:{color:gridC}}}}});}
  toggleSnapshotInfo(buttonElement){const infoP=buttonElement.closest('.history-section')?.querySelector('.snapshot-info');if(infoP){const isH=infoP.style.display==='none';infoP.style.display=isH?'block':'none';buttonElement.setAttribute('aria-expanded',isH);}}
  // Achievements...
  renderAchievements(person){const l=this.elements.modalBody?.querySelector(`#achievements-list-${person.id}`);if(!l)return;let h='';if(person.achievements.length>0){h+=`<ul>`;person.achievements.forEach(id=>{const d=achievementList[id];if(d){const e=d.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0]||'🏆';h+=`<li title="${this.escapeHTML(d.desc)}"><span class="achievement-icon" aria-hidden="true">${e}</span><span class="achievement-name">${this.escapeHTML(d.name)}</span></li>`;}});h+=`</ul>`;}else{h=`<p class="muted-text">No achievements yet!</p>`;}l.innerHTML=h;}
  // Kink Reading...
  showKinkReading(personId){const p=this.people.find(p=>p.id===personId);const o=this.elements.modalBody?.querySelector('#kink-reading-output');if(!p||!o)return;grantAchievement(p,'kink_reading');this.saveToLocalStorage();this.renderAchievements(p);let r=`🔮 ${this.escapeHTML(p.name)}'s Reading 🔮\nAs a ${this.escapeHTML(p.style)} ${p.role}, your path sparkles!\n`;const t=p.traits||{};const s=Object.entries(t).map(([n,sc])=>({name:n,score:parseInt(sc)})).sort((a,b)=>b.score-a.score);if(s.length>0){const h=s[0];const l=s[s.length-1];const c1=bdsmData[p.role]?.coreTraits[0]?.name;const c2=bdsmData[p.role]?.coreTraits[1]?.name;r+=`\n✨ Brightest star: **${h.name} (Lvl ${h.score})**! Suggests ${this.getReadingDescriptor(h.name,h.score)}.\n`;if(c1&&t[c1])r+=`🧭 Core **${c1}** (Lvl ${t[c1]}): Guides towards ${this.getReadingDescriptor(c1,t[c1])}.\n`;if(c2&&t[c2])r+=`🧭 Core **${c2}** (Lvl ${t[c2]}): Reminds of ${this.getReadingDescriptor(c2,t[c2])}.\n`;if(s.length>1&&h.score!==l.score)r+=`\n🌱 To bloom: Consider **${l.name} (Lvl ${l.score})**. Exploring ${this.getReadingDescriptor(l.name,l.score)} awaits.\n`;}else{r+=`\nTraits yet uncharted!\n`;}r+=`\n💖 Being ${this.escapeHTML(p.style)} is about ${this.getStyleEssence(p.style)}!\n`;o.textContent=r;o.style.display='block';}
  getReadingDescriptor(tN,sc){sc=parseInt(sc);if(tN==='obedience')return sc>=4?"joyful compliance":sc<=2?"independent spirit":"developing discipline";if(tN==='trust')return sc>=4?"deep connection":sc<=2?"cautious exploration":"building security";/*...more...*/return"unique expression";}
  getStyleEssence(sN){const e={"brat":"playful challenge","slave":"deep devotion",/*...more...*/};const k=sN?.toLowerCase().replace(/\(.*?\)/g,'').replace(/ \/ /g,'/').trim()||'';return e[k]||`your magic`;}
  // Glossary...
  showGlossary(){if(!this.elements.glossaryBody)return;grantAchievement({},'glossary_user');let h='<dl>';for(const k in glossaryTerms){const d=glossaryTerms[k];h+=`<dt id="gloss-term-${k}">${this.escapeHTML(d.term)}</dt><dd>${this.escapeHTML(d.definition)}`;if(d.related?.length){h+=`<br><span class="related-terms">See also: `;h+=d.related.map(rK=>`<a href="#gloss-term-${rK}">${glossaryTerms[rK]?.term||rK}</a>`).join(', ');h+=`</span>`;}h+=`</dd>`;}h+='</dl>';this.elements.glossaryBody.innerHTML=h;this.openModal(this.elements.glossaryModal);}
  // Style Discovery...
  showStyleDiscovery(){grantAchievement({},'style_explorer');this.renderStyleDiscoveryContent();this.openModal(this.elements.styleDiscoveryModal);}
  renderStyleDiscoveryContent(){if(!this.elements.styleDiscoveryBody||!this.elements.styleDiscoveryRoleFilter)return;const sel=this.elements.styleDiscoveryRoleFilter.value;let h='';['submissive','dominant'].forEach(r=>{if(sel==='all'||sel===r){h+=`<h3>${r.charAt(0).toUpperCase()+r.slice(1)} Styles</h3>`;if(bdsmData[r]?.styles){bdsmData[r].styles.forEach(st=>{h+=`<div class="style-discovery-item"><h4>${this.escapeHTML(st.name)}</h4>`;if(st.traits?.length){h+=`<strong>Traits:</strong><ul>`;st.traits.forEach(tr=>{h+=`<li>${this.escapeHTML(tr.name.charAt(0).toUpperCase()+tr.name.slice(1))}</li>`;});h+=`</ul>`;}else{h+=`<p class="muted-text">Uses core traits.</p>`;}h+=`</div>`;});}else{h+=`<p class="muted-text">No styles.</p>`;}}});this.elements.styleDiscoveryBody.innerHTML=h||'<p>No styles.</p>';}
  // Themes...
  setTheme(tN){document.body.setAttribute('data-theme',tN);const iD=tN==='dark'||tN==='velvet';if(this.elements.themeToggle){this.elements.themeToggle.textContent=iD?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${iD?'light':'dark'} mode`);}try{localStorage.setItem('kinkCompassTheme',tN);}catch(e){console.warn("Save theme failed:",e);}console.log(`Theme set: ${tN}`);if(this.chartInstance&&this.currentEditId){const p=this.people.find(p=>p.id===this.currentEditId);if(p)this.renderHistoryChart(p);}}
  applySavedTheme(){let saved='light';try{if(typeof localStorage!=='undefined')saved=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Read theme failed:",e);}this.setTheme(saved);console.log(`Applied theme: ${saved}`);}
  toggleTheme(){const cur=document.body.getAttribute('data-theme')||'light';const isD=cur==='dark'||cur==='velvet';this.setTheme(isD?'light':'dark');}
  // Data Export/Import...
  exportData(){if(this.people.length===0){alert("No profiles!");return;}try{const dS=JSON.stringify(this.people,null,2);const b=new Blob([dS],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`kinkcompass_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);grantAchievement({},'data_exported');console.log("Exported.");a.remove();}catch(e){console.error("Export failed:",e);alert("Export failed.");}}
  importData(event){const f=event.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=(e)=>{try{const imp=JSON.parse(e.target.result);if(!Array.isArray(imp))throw new Error("Not array.");const valid=imp.every(i=>typeof i==='object'&&i!==null&&'id'in i&&'name'in i);if(!valid)throw new Error("Invalid format.");if(confirm(`Import ${imp.length}? OVERWRITES current ${this.people.length}.`)){this.people=imp.map(p=>({...p,goals:p.goals||[],history:p.history||[],avatar:p.avatar||'❓',achievements:p.achievements||[]}));this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`Imported ${this.people.length}.`);console.log("Imported.");}}catch(err){console.error("Import failed:",err);alert(`Import failed: ${err.message}`);}finally{event.target.value=null;}};r.onerror=()=>{alert("Error reading file.");event.target.value=null;};r.readAsText(f);}
  // Trait Info Popup...
  showTraitInfo(traitName) {
      const role=this.elements.role.value; const styleName=this.elements.style.value;
      const tData=bdsmData[role]?.styles.find(s=>s.name===styleName)?.traits?.find(t=>t.name===traitName) || bdsmData[role]?.coreTraits?.find(t=>t.name===traitName);
      if(tData&&this.elements.traitInfoPopup&&this.elements.traitInfoTitle&&this.elements.traitInfoBody){const title=traitName.charAt(0).toUpperCase()+traitName.slice(1);this.elements.traitInfoTitle.textContent=`${this.getEmojiForScore(3)} ${title} Levels`;let bodyHtml='';for(let i=1;i<=5;i++){const s=String(i);const d=tData.desc?.[s]||'N/A';const e=this.getEmojiForScore(s);bodyHtml+=`<p><strong>${e} Lvl ${s}:</strong> ${this.escapeHTML(d)}</p>`;}this.elements.traitInfoBody.innerHTML=bodyHtml;this.elements.traitInfoPopup.style.display='block';this.elements.traitInfoPopup.scrollIntoView({behavior:'smooth',block:'nearest'});}
      else{console.warn("No trait data/popup elements:",traitName);this.hideTraitInfo();}
  }
  hideTraitInfo() { if(this.elements.traitInfoPopup)this.elements.traitInfoPopup.style.display='none'; }

  // --- Other Helper Functions ---
  getFlairForScore(score){return parseInt(score)<=2?"🌱 Keep nurturing!":parseInt(score)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(score){return parseInt(score)<=2?"💧":parseInt(score)===3?"🌱":parseInt(score)===4?"✨":"🌟";}
  escapeHTML(str){str=String(str??'');const el=document.createElement('div');el.textContent=str;return el.innerHTML;}
  openModal(mE){if(!mE)return;mE.style.display='flex';const f=mE.querySelector('button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])');if(f)requestAnimationFrame(()=>f.focus());console.log(`Opened: #${mE.id}`);}
  closeModal(mE){if(!mE)return;mE.style.display='none';console.log(`Closed: #${mE.id}`);}

  // --- MAKE SURE THIS IS THE LAST METHOD BEFORE THE CLASS CLOSING BRACE ---
  // --- getIntroForStyle must be defined INSIDE the class ---
  getIntroForStyle(styleName) {
    const key = styleName?.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim() || '';
    const intros = {
        "submissive": "Welcome, lovely Submissive! Ready to explore the beauty of yielding? ✨",
        "brat": "Hehe, ready to stir up some delightful trouble, Brat? 😉 Let the games begin!",
        "slave": "Step into the sanctuary of devotion, noble Slave. Surrender awaits. 🙏",
        "switch": "Master of moods! Ready to dance between dynamics, versatile Switch? ↔️",
        "pet": "Time for head pats and happy wags, adorable Pet! Let your loyalty shine! 💖",
        "little": "Welcome to the land of crayons and cuddles, sweet Little! Playtime! 🧸",
        "puppy": "Woof woof! Ready for zoomies and eager learning, playful Puppy? 🦴",
        "kitten": "Curious Kitten, ready to pounce and purr? The world is your yarn ball! 🧶",
        "princess": "Your Highness! Ready to be adored and perhaps a *little* demanding, Princess? 👑",
        "rope bunny": "Ready to be tied up in knots of fun, lovely Rope Bunny? Let's get tangled! 🎀",
        "masochist": "Welcome, sensation seeker! Ready to explore the beautiful edge, Masochist? 🔥",
        "prey": "The chase is on, little Prey! Ready for the thrill of pursuit and capture? 🦊",
        "toy": "Wind up and get ready to play, delightful Toy! Time to shine and be adored! 🎁",
        "doll": "Poised and perfect Doll, ready to be admired and arranged? Strike a pose! 💖",
        "bunny": "Soft steps and gentle heart, sweet Bunny! Ready for quiet affection? 🐇",
        "servant": "Dedicated Servant, ready to bring order and fulfill needs with grace? At your service! 🧹",
        "playmate": "Game on, enthusiastic Playmate! Ready for fun, laughter, and adventure? 🎉",
        "babygirl": "Sweet and sassy Babygirl, ready to charm and be cherished? Flutter those lashes! 😉",
        "captive": "Oh no, caught again, daring Captive? Ready for the dramatic escape... or surrender? ⛓️",
        "thrall": "Deep focus, open mind, devoted Thrall. Ready to connect on a different plane? 🌀",
        "puppet": "Whose strings are pulled today, perfect Puppet? Ready to dance to their tune? 🎭",
        "maid": "Impeccable Maid, ready to bring sparkle and order with dutiful grace? Precision! ✨",
        "painslut": "Eager and ready, devoted Painslut? Time to test those limits and revel in sensation! 🔥",
        "bottom": "Open heart, yielding power, beautiful Bottom. Ready to receive and connect deeply? 💖",
        "dominant": "Step into your power, noble Dominant! Ready to lead and inspire? 🔥",
        "assertive": "Clear voice, strong boundaries, confident Assertive! Ready to communicate your truth? 💪",
        "nurturer": "Warm heart, steady hand, caring Nurturer! Ready to support and uplift? 🌸",
        "strict": "Order and structure, firm Strict! Ready to guide with clear rules and expectations? ⚖️",
        "master": "Commanding presence, high standards, revered Master! Ready to shape your domain? 🏰",
        "mistress": "Elegant authority, captivating grace, adored Mistress! Ready to rule your world? 👑",
        "daddy": "Protective arms, guiding voice, loving Daddy! Ready to provide safety and warmth? 🧸",
        "mommy": "Nurturing embrace, gentle rules, caring Mommy! Ready to kiss it better? 💖",
        "owner": "Claiming your prize, devoted Owner! Ready to train, cherish, and possess? 🐾",
        "rigger": "Artist with rope, skilled Rigger! Ready to bind beauty and test limits? 🎨",
        "sadist": "Conductor of sensation, curious Sadist! Ready to explore the edges of pleasure and pain? 🔥",
        "hunter": "Primal instincts, thrilling chase, focused Hunter! Ready for the pursuit? 🐺",
        "trainer": "Patient teacher, skilled Trainer! Ready to cultivate potential and achieve goals? 🏆",
        "puppeteer": "Pulling the strings, clever Puppeteer! Ready to direct the perfect performance? 🎭",
        "protector": "Steadfast shield, watchful Protector! Ready to defend and ensure safety? 🛡️",
        "disciplinarian": "Fair judgment, firm hand, focused Disciplinarian! Ready to maintain order? 👨‍⚖️",
        "caretaker": "Attentive eye, healing touch, devoted Caretaker! Ready to ensure total well-being? ❤️‍🩹",
        "sir": "Dignified command, respected Sir! Ready to lead with formal grace? 🎩",
        "goddess": "Radiant power, adored Goddess! Ready to inspire worship and command devotion? ✨",
        "commander": "Strategic mind, decisive voice, effective Commander! Ready to lead the charge? 🎖️"
    };
    return intros[key] || "Explore your unique and wonderful expression!";
  } // <<<< MAKE SURE THIS METHOD IS INSIDE THE CLASS

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;"> <h1 style="color: red;">Oops! Failed to Start</h1> <p>Error: ${error.message}. Check console (F12).</p> </div>`;
}

// --- END OF FILE app.js ---
