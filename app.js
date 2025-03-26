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
    console.log("CONSTRUCTOR: Starting...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;

    // Find elements
    this.elements = {
      formSection: document.getElementById('form-section'),
      name: document.getElementById('name'),
      avatarDisplay: document.getElementById('avatar-display'),
      avatarInput: document.getElementById('avatar-input'),
      avatarPicker: document.querySelector('.avatar-picker'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      // goals element removed from here
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
    // Check critical elements
    if (!this.elements.name || !this.elements.role || !this.elements.style || !this.elements.save || !this.elements.peopleList || !this.elements.modal) {
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

  // --- Local Storage ---
  loadFromLocalStorage(){try{const d=localStorage.getItem('kinkProfiles');const p=d?JSON.parse(d):[];this.people=p.map(p=>({...p,goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],avatar:p.avatar||'❓',achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'?p.reflections:{}}));console.log(`Loaded ${this.people.length}`);}catch(e){console.error("Load Error:",e);this.people=[];}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length}`);}catch(e){console.error("Save Error:",e);alert("Save failed.");}}

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Attaching event listeners...");
    // Form
    this.elements.role?.addEventListener('change',() => { const r=this.elements.role.value;this.renderStyles(r);this.elements.style.value='';this.renderTraits(r,'');this.updateLivePreview(); });
    this.elements.style?.addEventListener('change',() => { this.renderTraits(this.elements.role.value,this.elements.style.value);this.updateLivePreview(); });
    this.elements.name?.addEventListener('input',() => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click',(e) => { if(e.target.classList.contains('avatar-btn')){const em=e.target.dataset.emoji;if(em){this.elements.avatarInput.value=em;this.elements.avatarDisplay.textContent=em;this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b===e.target));this.updateLivePreview();}} });
    // Buttons
    this.elements.save?.addEventListener('click',() => this.savePerson());
    this.elements.clearForm?.addEventListener('click',() => this.resetForm(true));
    this.elements.themeToggle?.addEventListener('click',() => this.toggleTheme());
    this.elements.exportBtn?.addEventListener('click',() => this.exportData());
    this.elements.importBtn?.addEventListener('click',() => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change',(e) => this.importData(e));
    // People List
    this.elements.peopleList?.addEventListener('click',(e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown',(e) => this.handleListKeydown(e));
    // Modals
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
    // Global
    window.addEventListener('click',(e) => this.handleWindowClick(e));
    window.addEventListener('keydown',(e) => this.handleWindowKeydown(e));
    // Dynamic
    this.elements.traitsContainer?.addEventListener('input',(e) => this.handleTraitSliderInput(e));
    this.elements.traitsContainer?.addEventListener('click',(e) => this.handleTraitInfoClick(e));
    this.elements.traitInfoClose?.addEventListener('click',() => this.hideTraitInfo());
    this.elements.modalBody?.addEventListener('click',(e) => this.handleModalBodyClick(e));
    console.log("Event listeners setup complete.");
  }

  // --- Event Handlers ---
  handleListClick(e){const li=e.target.closest('.person');if(!li)return;const id=parseInt(li.dataset.id);if(isNaN(id))return;console.log("List Click on ID:",id,"Target:",e.target);if(e.target.classList.contains('edit-btn'))this.editPerson(id);else if(e.target.classList.contains('delete-btn'))this.deletePerson(id);else this.showPersonDetails(id);}
  handleListKeydown(e){const li=e.target.closest('.person');if(!li)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=parseInt(li.dataset.id);if(!isNaN(id))this.showPersonDetails(id);}}
  handleWindowClick(e){if(e.target===this.elements.modal)this.closeModal(this.elements.modal);if(e.target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);if(e.target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);if(e.target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);if(e.target===this.elements.themesModal)this.closeModal(this.elements.themesModal);}
  handleWindowKeydown(e){if(e.key==='Escape'){if(this.elements.modal?.style.display==='flex')this.closeModal(this.elements.modal);if(this.elements.resourcesModal?.style.display==='flex')this.closeModal(this.elements.resourcesModal);if(this.elements.glossaryModal?.style.display==='flex')this.closeModal(this.elements.glossaryModal);if(this.elements.styleDiscoveryModal?.style.display==='flex')this.closeModal(this.elements.styleDiscoveryModal);if(this.elements.themesModal?.style.display==='flex')this.closeModal(this.elements.themesModal);}}
  handleTraitSliderInput(e){if(e.target.classList.contains('trait-slider')){this.updateTraitDescription(e.target);this.updateLivePreview();const v=e.target.value;const p=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;if(p){if(v==='5')grantAchievement(p,'max_trait');if(v==='1')grantAchievement(p,'min_trait');}}}
  handleTraitInfoClick(e){if(e.target.classList.contains('trait-info-btn')){const tN=e.target.dataset.trait;if(tN)this.showTraitInfo(tN);}}
  handleModalBodyClick(e){
    console.log("Modal Click:",e.target);const btn=e.target.closest('button');const tgt=e.target;const check=btn||tgt;
    if(!check||(check.tagName!=='BUTTON'&&!check.classList.contains('snapshot-info-btn'))){return;}
    const id=check.id;const cl=check.classList;const pId=parseInt(check.dataset.personId);const gId=parseInt(check.dataset.goalId);
    console.log("Check Elm:",check,"ID:",id,"Class:",cl);
    if(id==='save-reflections-btn'&&!isNaN(pId)){console.log("Match: save-reflections");this.saveReflections(pId);}
    else if(id==='prompt-btn'){console.log("Match: prompt");this.showJournalPrompt();}
    else if(id==='snapshot-btn'&&!isNaN(pId)){console.log("Match: snapshot");this.addSnapshotToHistory(pId);}
    else if(cl.contains('snapshot-info-btn')){console.log("Match: snapshot-info");this.toggleSnapshotInfo(check);}
    else if(id==='reading-btn'&&!isNaN(pId)){console.log("Match: reading");this.showKinkReading(pId);}
    else if(cl.contains('add-goal-btn')&&!isNaN(pId)){console.log("Match: add-goal");this.addGoal(pId);}
    else if(cl.contains('toggle-goal-btn')&&!isNaN(pId)&&!isNaN(gId)){console.log("Match: toggle-goal");this.toggleGoalStatus(pId,gId);}
    else if(cl.contains('delete-goal-btn')&&!isNaN(pId)&&!isNaN(gId)){console.log("Match: delete-goal");this.deleteGoal(pId,gId);}
    else{console.log("No matching modal action.");}
  }
  handleThemeSelection(e){if(e.target.classList.contains('theme-option-btn')){const tN=e.target.dataset.theme;if(tN){this.setTheme(tN);grantAchievement({},'theme_changer');}}}

  // --- Core Rendering ---
  renderStyles(r){this.elements.style.innerHTML='<option value="">Pick flavor!</option>';if(!bdsmData[r]?.styles)return;bdsmData[r].styles.forEach(s=>{this.elements.style.innerHTML+=`<option value="${this.escapeHTML(s.name)}">${this.escapeHTML(s.name)}</option>`;});}
  renderTraits(r,sN){this.elements.traitsContainer.innerHTML='';if(!bdsmData[r])return;const core=bdsmData[r].coreTraits||[];let styleT=[];let styleO=null;if(sN){styleO=bdsmData[r].styles.find(s=>s.name===sN);styleT=styleO?.traits||[];}const toRender=[];const uN=new Set();[...core,...styleT].forEach(t=>{if(t&&t.name&&!uN.has(t.name)){toRender.push(t);uN.add(t.name);}});if(toRender.length===0){this.elements.traitsContainer.innerHTML=`<p class="muted-text">No traits.</p>`;}else{toRender.forEach(t=>{this.elements.traitsContainer.innerHTML+=this.createTraitHTML(t);});this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(s=>this.updateTraitDescription(s));}if(sN&&styleO&&styleT.length===0&&core.length>0){const m=document.createElement('p');m.className='muted-text trait-info-message';m.textContent=`Style '${this.escapeHTML(sN)}' uses core traits.`;this.elements.traitsContainer.prepend(m);}else if(!sN&&core.length===0){this.elements.traitsContainer.innerHTML=`<p>Select style or define traits.</p>`;}this.hideTraitInfo();}
  createTraitHTML(t){const dN=t.name.charAt(0).toUpperCase()+t.name.slice(1);const id=`trait-${t.name.replace(/[^a-zA-Z0-9-_]/g,'-')}`;return`<div class="trait"><label for="${id}">${this.escapeHTML(dN)}</label><button class="trait-info-btn" data-trait="${t.name}" aria-label="Info: ${this.escapeHTML(dN)}">ℹ️</button><input type="range" id="${id}" min="1" max="5" value="3" class="trait-slider" data-trait="${t.name}" aria-label="${this.escapeHTML(dN)}" autocomplete="off"/><span class="trait-value">3</span><div class="trait-desc muted-text"></div></div>`;}
  updateTraitDescription(sl){const tN=sl.getAttribute('data-trait');const v=sl.value;const dD=sl.parentElement?.querySelector('.trait-desc');const vS=sl.parentElement?.querySelector('.trait-value');if(!dD||!vS)return;const r=this.elements.role.value;const sN=this.elements.style.value;let tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN)||bdsmData[r]?.coreTraits?.find(t=>t.name===tN);vS.textContent=v;if(tD?.desc?.[v]){dD.textContent=this.escapeHTML(tD.desc[v]);}else{dD.textContent=tD?'Desc unavailable.':'Trait unavailable.';}}
  renderList(){if(!this.elements.peopleList)return;this.elements.peopleList.innerHTML=this.people.length===0?`<li>No pals yet! ✨</li>`:this.people.map(p=>this.createPersonListItemHTML(p)).join('');}
  createPersonListItemHTML(p){const sD=p.style?this.escapeHTML(p.style):"N/A";const rD=p.role.charAt(0).toUpperCase()+p.role.slice(1);const nE=this.escapeHTML(p.name);const av=p.avatar||'❓';return`<li class="person" data-id="${p.id}" tabindex="0"><span class="person-info"><span class="person-avatar">${av}</span><span class="person-name-details"><strong class="person-name">${nE}</strong><span class="person-details muted-text">(${rD} - ${sD})</span></span></span><span class="person-actions"><button class="edit-btn small-btn" aria-label="Edit ${nE}">✏️</button><button class="delete-btn small-btn" aria-label="Delete ${nE}">🗑️</button></span></li>`;}

  // --- CRUD ---
  savePerson(){const name=this.elements.name.value.trim()||"Unnamed";const av=this.elements.avatarInput.value||'❓';const r=this.elements.role.value;const sN=this.elements.style.value;if(!sN){alert("Select style.");return;}const sliders=this.elements.traitsContainer.querySelectorAll('.trait-slider');const expected=[...(bdsmData[r]?.coreTraits||[]),...(bdsmData[r]?.styles.find(s=>s.name===sN)?.traits||[])];const uniqueE=new Set(expected.map(t=>t.name));if(sliders.length!==uniqueE.size&&uniqueE.size>0){alert("Trait error.");return;}const tr={};let mD=false;sliders.forEach(s=>{const n=s.getAttribute('data-trait');if(n)tr[n]=s.value;else mD=true;});if(mD){alert("Gather trait error.");return;}for(const n of uniqueE){if(!tr.hasOwnProperty(n)){alert(`Missing data: '${n}'.`);return;}}const ex=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;const pD={id:this.currentEditId||Date.now(),name,avatar:av,role:r,style:sN,goals:ex?.goals||[],traits:tr,history:ex?.history||[],achievements:ex?.achievements||[],reflections:ex?.reflections||{}};if(!this.currentEditId)grantAchievement(pD,'profile_created');if(this.people.length===4&&!this.currentEditId)grantAchievement(pD,'five_profiles');if(this.currentEditId)grantAchievement(pD,'profile_edited');if(this.currentEditId){const i=this.people.findIndex(p=>p.id===this.currentEditId);if(i!==-1)this.people[i]=pD;else{console.error("Update ID error");pD.id=Date.now();this.people.push(pD);}}else{this.people.push(pD);}this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`${this.escapeHTML(name)} saved! ✨`);}
  editPerson(pId){const p=this.people.find(p=>p.id===pId);if(!p){alert("Not found.");return;}this.currentEditId=pId;this.elements.name.value=p.name;this.elements.avatarDisplay.textContent=p.avatar||'❓';this.elements.avatarInput.value=p.avatar||'❓';this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b.dataset.emoji===p.avatar));this.elements.role.value=p.role;this.renderStyles(p.role);this.elements.style.value=p.style;this.renderTraits(p.role,p.style);requestAnimationFrame(()=>{if(p.traits){Object.entries(p.traits).forEach(([n,v])=>{const s=this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${n}"]`);if(s){s.value=v;this.updateTraitDescription(s);}}); }this.updateLivePreview();this.elements.save.textContent='Update ✨';this.elements.formSection?.scrollIntoView({behavior:'smooth'});this.elements.name.focus();});}
  deletePerson(pId){const idx=this.people.findIndex(p=>p.id===pId);if(idx===-1)return;const name=this.people[idx].name;if(confirm(`Delete ${this.escapeHTML(name)}?`)){this.people.splice(idx,1);this.saveToLocalStorage();this.renderList();if(this.currentEditId===pId)this.resetForm(true);alert(`${this.escapeHTML(name)} deleted.`);}}
  resetForm(clear=false){this.elements.name.value='';this.elements.avatarDisplay.textContent='❓';this.elements.avatarInput.value='❓';this.elements.avatarPicker?.querySelectorAll('.selected').forEach(b=>b.classList.remove('selected'));this.elements.role.value='submissive';this.renderStyles('submissive');this.elements.style.value='';this.renderTraits('submissive','');this.currentEditId=null;this.elements.save.textContent='Save Sparkle! 💖';if(clear)this.updateLivePreview();this.elements.name.focus();console.log("Form reset.");this.hideTraitInfo();}

  // --- Live Preview ---
  updateLivePreview(){const name=this.elements.name.value.trim()||"Unnamed";const av=this.elements.avatarInput.value||'❓';const r=this.elements.role.value;const s=this.elements.style.value;const tr={};this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(sl=>{const n=sl.getAttribute('data-trait');if(n)tr[n]=sl.value;});let html='';if(!s&&r&&Object.keys(tr).length>0){html=`<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Core Vibe ${av}</h3><p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p><p><i>Core traits active. Pick Style!</i></p><div class="core-trait-preview"><strong>Core Traits:</strong><ul>`;bdsmData[r]?.coreTraits?.forEach(ct=>{const score=tr[ct.name];if(score){const tD=bdsmData[r]?.coreTraits?.find(t=>t.name===ct.name);const d=tD?.desc?.[score]||"N/A";html+=`<li><strong>${this.escapeHTML(ct.name)} (${score}):</strong> ${this.escapeHTML(d)}</li>`;}});html+=`</ul></div>`;}else if(s){const getB=r==='submissive'?getSubBreakdown:getDomBreakdown;const B=getB(s,tr);let topStyleInfo=null;const sO=bdsmData[r]?.styles.find(st=>st.name===s);if(sO?.traits?.length>0){let topSc=-1;let topN='';sO.traits.forEach(tDef=>{const sc=parseInt(tr[tDef.name]||0);if(sc>topSc){topSc=sc;topN=tDef.name;}});if(topN&&topSc>0){const tD=sO.traits.find(t=>t.name===topN);const d=tD?.desc?.[topSc]||"N/A";topStyleInfo=`<strong>Top Style Vibe (${this.escapeHTML(topN)} Lvl ${topSc}):</strong> ${this.escapeHTML(d)}`;}}html=`<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Live Vibe ${av}</h3><p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p><p><strong>Style:</strong> ${this.escapeHTML(s)}</p><div class="style-breakdown preview-breakdown">`;if(B.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;if(B.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;html+=`</div>`;if(topStyleInfo){html+=`<div class="top-trait-preview"><hr><p>${topStyleInfo}</p></div>`;}}else{html=`<p>Pick role & style! 🌈</p>`;}this.elements.livePreview.innerHTML=html;}

  // --- Modal Display ---
  showPersonDetails(personId) {
      const person = this.people.find(p => p.id === personId); if (!person) return;
      console.log("Showing details:", person);
      person.goals=person.goals||[];person.history=person.history||[];person.achievements=person.achievements||[];person.reflections=person.reflections||{};person.avatar=person.avatar||'❓';
      const getB=person.role==='submissive'?getSubBreakdown:getDomBreakdown;const B=getB(person.style,person.traits||{});
      let html=`<h2 class="modal-title">${person.avatar} ${this.escapeHTML(person.name)}’s Kingdom ${person.avatar}</h2>`;
      html+=`<p class="modal-subtitle">${person.role.charAt(0).toUpperCase()+person.role.slice(1)} - ${person.style?this.escapeHTML(person.style):'N/A'}</p>`;
      let intro="Explore unique expression!";try{if(typeof this.getIntroForStyle==='function'){intro=this.getIntroForStyle(person.style);}else{console.error("getIntroForStyle not function!");}}catch(e){console.error("Error calling getIntro:",e);}if(intro)html+=`<p class="modal-intro">${intro}</p>`;
      html+=`<section class="goals-section"><h3>🎯 Goals</h3><ul id="goal-list-${person.id}"></ul><div class="add-goal-form"><input type="text" id="new-goal-text-${person.id}" placeholder="Add goal..."><button class="add-goal-btn save-btn small-btn" data-person-id="${person.id}">+ Add</button></div></section>`;
      html+=`<h3>🌈 Strengths & Growth</h3><div class="style-breakdown modal-breakdown">`;if(B.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;if(B.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;html+=`</div>`;
      html+=`<h3>🎨 Trait Tales</h3>`;const defs=[...(bdsmData[person.role]?.coreTraits||[]),...(bdsmData[person.role]?.styles.find(s=>s.name===person.style)?.traits||[])];const uDefs=Array.from(new Map(defs.map(t=>[t.name,t])).values());
      html+='<div class="trait-details-grid">';if(person.traits&&Object.keys(person.traits).length>0){Object.entries(person.traits).forEach(([n,sc])=>{const tO=uDefs.find(t=>t.name===n);const dN=n.charAt(0).toUpperCase()+n.slice(1);if(!tO){html+=`<div><h4>${this.escapeHTML(dN)} - Lvl ${sc}❓</h4><p><em>Def missing.</em></p></div>`;return;}const dT=tO.desc?.[sc]||"N/A";const fl=this.getFlairForScore(sc);html+=`<div><h4>${this.escapeHTML(dN)} - Lvl ${sc} ${this.getEmojiForScore(sc)}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(dT)}</p><p><em>${fl}</em></p></div>`;});}else{html+=`<p>No scores.</p>`;}html+='</div>';
      html+=`<section class="history-section"><h3>⏳ History<button class="snapshot-info-btn" aria-label="Info">ℹ️</button></h3><p class="snapshot-info muted-text" style="display:none;">Snapshot saves current traits to track growth!</p><div class="history-chart-container"><canvas id="history-chart"></canvas></div><button id="snapshot-btn" class="small-btn" data-person-id="${person.id}">📸 Snapshot</button></section>`;
      html+=`<section class="achievements-section"><h3>🏆 Achievements</h3><div id="achievements-list-${person.id}"></div></section>`;
      html+=`<section class="kink-reading-section"><h3>🔮 Reading</h3><button id="reading-btn" class="small-btn" data-person-id="${person.id}">Get Reading!</button><div id="kink-reading-output" style="display:none;"></div></section>`;
      html+=`<section class="reflections-section"><h3>📝 Reflections</h3><div id="journal-prompt-area" style="display:none;"></div><div class="modal-actions"><button id="prompt-btn" class="small-btn">💡 Prompt</button></div><textarea id="reflections-text" data-person-id="${person.id}" rows="6" placeholder="Thoughts?">${this.escapeHTML(person.reflections?.text||'')}</textarea><button id="save-reflections-btn" data-person-id="${person.id}">Save 💭</button></section>`;
      this.elements.modalBody.innerHTML=html; this.renderGoalList(person); this.renderAchievements(person); this.openModal(this.elements.modal); this.renderHistoryChart(person);
  }


  // --- New Feature Logic ---
  addGoal(pId){const p=this.people.find(p=>p.id===pId);const i=this.elements.modalBody.querySelector(`#new-goal-text-${pId}`);if(!p||!i)return;const t=i.value.trim();if(!t)return;const nG={id:Date.now(),text:t,status:'todo'};p.goals.push(nG);grantAchievement(p,'goal_added');this.saveToLocalStorage();this.renderGoalList(p);i.value='';}
  toggleGoalStatus(pId,gId){const p=this.people.find(p=>p.id===pId);const g=p?.goals.find(g=>g.id===gId);if(!g)return;g.status=(g.status==='done'?'todo':'done');this.saveToLocalStorage();this.renderGoalList(p);}
  deleteGoal(pId,gId){const p=this.people.find(p=>p.id===pId);if(!p)return;if(confirm('Delete goal?')){p.goals=p.goals.filter(g=>g.id!==gId);this.saveToLocalStorage();this.renderGoalList(p);}}
  renderGoalList(p){const l=this.elements.modalBody?.querySelector(`#goal-list-${p.id}`);if(!l)return;let h='';if(p.goals.length>0){p.goals.forEach(g=>{h+=`<li class="${g.status==='done'?'done':''}" data-goal-id="${g.id}"><span>${this.escapeHTML(g.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${p.id}" data-goal-id="${g.id}">${g.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn" data-person-id="${p.id}" data-goal-id="${g.id}">🗑️</button></span></li>`;});}else{h=`<li class="muted-text">No goals!</li>`;}l.innerHTML=h;}
  showJournalPrompt(){const a=this.elements.modalBody?.querySelector('#journal-prompt-area');if(a){a.textContent=getRandomPrompt();a.style.display='block';this.elements.modalBody?.querySelector('#reflections-text')?.focus();}}
  saveReflections(pId){const p=this.people.find(p=>p.id===pId);const el=this.elements.modalBody?.querySelector('#reflections-text');if(!p||!el){alert("Error.");return;}const txt=el.value;if(!p.reflections)p.reflections={};p.reflections.text=txt;p.reflections.lastUpdated=Date.now();let first=false;if(txt.trim().length>0)first=grantAchievement(p,'reflection_saved');const count=Object.values(this.people.reduce((a,p)=>{if(p.reflections?.text?.trim().length>0)a[p.id]=true;return a;},{})).length;if(count>=5)grantAchievement(p,'five_reflections');this.saveToLocalStorage();const btn=this.elements.modalBody.querySelector('#save-reflections-btn');if(btn){btn.textContent='Saved ✓';btn.disabled=true;setTimeout(()=>{btn.textContent='Save 💭';btn.disabled=false;},2000);}else{alert("Saved! ✨");}}
  addSnapshotToHistory(pId){const p=this.people.find(p=>p.id===pId);if(!p||!p.traits){alert("Cannot snapshot.");return;}const snap={date:Date.now(),traits:{...p.traits}};p.history.push(snap);grantAchievement(p,'history_snapshot');this.saveToLocalStorage();alert("Snapshot saved! 📸");this.renderHistoryChart(p);this.renderAchievements(p);}
  renderHistoryChart(p){const cont=this.elements.modalBody?.querySelector('.history-chart-container');let ctx=cont?.querySelector('#history-chart')?.getContext('2d');if(this.chartInstance){this.chartInstance.destroy();this.chartInstance=null;}if(!ctx){if(cont)cont.innerHTML=`<p>Chart canvas missing.</p>`;return;}if(!p?.history?.length){cont.innerHTML=`<p>No history yet!</p>`;return;}if(cont.querySelector('p'))cont.innerHTML=`<canvas id="history-chart"></canvas>`;ctx=cont.querySelector('#history-chart').getContext('2d');const labels=p.history.map(s=>new Date(s.date).toLocaleDateString());const allN=new Set();p.history.forEach(s=>Object.keys(s.traits).forEach(n=>allN.add(n)));if(p.traits)Object.keys(p.traits).forEach(n=>allN.add(n));const dSets=[];const clrs=['#ff69b4','#8a5a6d','#ff85cb','#4a2c3d','#f4d4e4','#c49db1','#a0d8ef','#dcc1ff'];let cI=0;allN.forEach(tN=>{const data=p.history.map(s=>s.traits[tN]!==undefined?parseInt(s.traits[tN]):null);const c=clrs[cI%clrs.length];dSets.push({label:tN.charAt(0).toUpperCase()+tN.slice(1),data:data,borderColor:c,backgroundColor:c+'80',tension:.1,fill:false,spanGaps:true});cI++;});const isD=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';const gC=isD?'rgba(244,212,228,0.15)':'rgba(74,44,61,0.1)';const lC=isD?'#c49db1':'#8a5a6d';this.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:dSets},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{color:lC}},tooltip:{mode:'index',intersect:false,}},scales:{y:{min:1,max:5,ticks:{stepSize:1,color:lC},grid:{color:gC}},x:{ticks:{color:lC},grid:{color:gC}}}}});}
  toggleSnapshotInfo(btn){const inf=btn.closest('.history-section')?.querySelector('.snapshot-info');if(inf){const isH=inf.style.display==='none';inf.style.display=isH?'block':'none';btn.setAttribute('aria-expanded',isH);}}
  renderAchievements(p){const l=this.elements.modalBody?.querySelector(`#achievements-list-${p.id}`);if(!l)return;let h='';if(p.achievements.length>0){h+=`<ul>`;p.achievements.forEach(id=>{const d=achievementList[id];if(d){const e=d.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0]||'🏆';h+=`<li title="${this.escapeHTML(d.desc)}"><span class="achievement-icon">${e}</span><span>${this.escapeHTML(d.name)}</span></li>`;}});h+=`</ul>`;}else{h=`<p>No achievements!</p>`;}l.innerHTML=h;}
  showKinkReading(pId){const p=this.people.find(p=>p.id===pId);const o=this.elements.modalBody?.querySelector('#kink-reading-output');if(!p||!o)return;grantAchievement(p,'kink_reading');this.saveToLocalStorage();this.renderAchievements(p);let r=`🔮 ${this.escapeHTML(p.name)}'s Reading 🔮\nAs a ${this.escapeHTML(p.style)} ${p.role}, path sparkles!\n`;const t=p.traits||{};const s=Object.entries(t).map(([n,sc])=>({name:n,score:parseInt(sc)})).sort((a,b)=>b.score-a.score);if(s.length>0){const h=s[0];const l=s[s.length-1];const c1=bdsmData[p.role]?.coreTraits[0]?.name;const c2=bdsmData[p.role]?.coreTraits[1]?.name;r+=`\n✨ Star: **${h.name}(${h.score})**! ${this.getReadingDescriptor(h.name,h.score)}.\n`;if(c1&&t[c1])r+=`🧭 Core **${c1}(${t[c1]})**: ${this.getReadingDescriptor(c1,t[c1])}.\n`;if(c2&&t[c2])r+=`🧭 Core **${c2}(${t[c2]})**: ${this.getReadingDescriptor(c2,t[c2])}.\n`;if(s.length>1&&h.score!==l.score)r+=`\n🌱 Bloom: **${l.name}(${l.score})**. Explore ${this.getReadingDescriptor(l.name,l.score)}.\n`;}else{r+=`\nTraits uncharted!\n`;}r+=`\n💖 ${this.escapeHTML(p.style)} is about ${this.getStyleEssence(p.style)}!\n`;o.textContent=r;o.style.display='block';}
  getReadingDescriptor(tN,sc){sc=parseInt(sc);if(tN==='obedience')return sc>=4?"joyful compliance":sc<=2?"independent spirit":"developing discipline";if(tN==='trust')return sc>=4?"deep connection":sc<=2?"cautious exploration":"building security"; return"unique expression";}
  getStyleEssence(sN){const e={"brat":"playful challenge","slave":"deep devotion",/*...*/};const k=sN?.toLowerCase().replace(/\(.*?\)/g,'').replace(/ \/ /g,'/').trim()||'';return e[k]||`your magic`;}
  showGlossary(){if(!this.elements.glossaryBody)return;grantAchievement({},'glossary_user');let h='<dl>';for(const k in glossaryTerms){const d=glossaryTerms[k];h+=`<dt id="gloss-term-${k}">${this.escapeHTML(d.term)}</dt><dd>${this.escapeHTML(d.definition)}`;if(d.related?.length){h+=`<br><span>See also: `;h+=d.related.map(rK=>`<a href="#gloss-term-${rK}">${glossaryTerms[rK]?.term||rK}</a>`).join(', ');h+=`</span>`;}h+=`</dd>`;}h+='</dl>';this.elements.glossaryBody.innerHTML=h;this.openModal(this.elements.glossaryModal);}
  showStyleDiscovery(){grantAchievement({},'style_explorer');this.renderStyleDiscoveryContent();this.openModal(this.elements.styleDiscoveryModal);}
  renderStyleDiscoveryContent(){if(!this.elements.styleDiscoveryBody||!this.elements.styleDiscoveryRoleFilter)return;const sel=this.elements.styleDiscoveryRoleFilter.value;let h='';['submissive','dominant'].forEach(r=>{if(sel==='all'||sel===r){h+=`<h3>${r.charAt(0).toUpperCase()+r.slice(1)} Styles</h3>`;if(bdsmData[r]?.styles){bdsmData[r].styles.forEach(st=>{h+=`<div class="style-discovery-item"><h4>${this.escapeHTML(st.name)}</h4>`; if(st.summary)h+=`<p><em>${this.escapeHTML(st.summary)}</em></p>`; if(st.traits?.length){h+=`<strong>Traits:</strong><ul>`;st.traits.forEach(tr=>{h+=`<li>${this.escapeHTML(tr.name.charAt(0).toUpperCase()+tr.name.slice(1))}</li>`;});h+=`</ul>`;}else{h+=`<p>Uses core traits.</p>`;}h+=`</div>`;});}else{h+=`<p>No styles.</p>`;}}});this.elements.styleDiscoveryBody.innerHTML=h||'<p>No styles.</p>';}
  setTheme(tN){document.body.setAttribute('data-theme',tN);const iD=tN==='dark'||tN==='velvet';if(this.elements.themeToggle){this.elements.themeToggle.textContent=iD?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${iD?'light':'dark'} mode`);}try{localStorage.setItem('kinkCompassTheme',tN);}catch(e){console.warn("Save theme failed:",e);}if(this.chartInstance&&this.currentEditId){const p=this.people.find(p=>p.id===this.currentEditId);if(p)this.renderHistoryChart(p);}}
  applySavedTheme(){let saved='light';try{if(typeof localStorage!=='undefined')saved=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Read theme failed:",e);}this.setTheme(saved);console.log(`Applied theme: ${saved}`);}
  toggleTheme(){const cur=document.body.getAttribute('data-theme')||'light';const isD=cur==='dark'||cur==='velvet';this.setTheme(isD?'light':'dark');}
  exportData(){if(this.people.length===0){alert("No profiles!");return;}try{const dS=JSON.stringify(this.people,null,2);const b=new Blob([dS],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`kinkcompass_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);grantAchievement({},'data_exported');console.log("Exported.");a.remove();}catch(e){console.error("Export failed:",e);alert("Export failed.");}}
  importData(ev){const f=ev.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=(e)=>{try{const imp=JSON.parse(e.target.result);if(!Array.isArray(imp))throw new Error("Not array.");const valid=imp.every(i=>typeof i==='object'&&i!==null&&'id'in i&&'name'in i);if(!valid)throw new Error("Invalid format.");if(confirm(`Import ${imp.length}? OVERWRITES current ${this.people.length}.`)){this.people=imp.map(p=>({...p,goals:p.goals||[],history:p.history||[],avatar:p.avatar||'❓',achievements:p.achievements||[]}));this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`Imported ${this.people.length}.`);}}catch(err){console.error("Import failed:",err);alert(`Import failed: ${err.message}`);}finally{ev.target.value=null;}};r.onerror=()=>{alert("Error reading file.");ev.target.value=null;};r.readAsText(f);}
  showTraitInfo(tN){const r=this.elements.role.value;const sN=this.elements.style.value;const tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN)||bdsmData[r]?.coreTraits?.find(t=>t.name===tN);if(tD&&this.elements.traitInfoPopup&&this.elements.traitInfoTitle&&this.elements.traitInfoBody){const title=tN.charAt(0).toUpperCase()+tN.slice(1);this.elements.traitInfoTitle.textContent=`${this.getEmojiForScore(3)} ${title} Levels`;let bodyHtml='';for(let i=1;i<=5;i++){const s=String(i);const d=tD.desc?.[s]||'N/A';const e=this.getEmojiForScore(s);bodyHtml+=`<p><strong>${e} Lvl ${s}:</strong> ${this.escapeHTML(d)}</p>`;}this.elements.traitInfoBody.innerHTML=bodyHtml;this.elements.traitInfoPopup.style.display='block';this.elements.traitInfoPopup.scrollIntoView({behavior:'smooth',block:'nearest'});}else{console.warn("No trait data/popup:",tN);this.hideTraitInfo();}}
  hideTraitInfo(){if(this.elements.traitInfoPopup)this.elements.traitInfoPopup.style.display='none';}

  // --- Helper Functions ---
  getFlairForScore(s){return parseInt(s)<=2?"🌱 Nurturing!":parseInt(s)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(s){return parseInt(s)<=2?"💧":parseInt(s)===3?"🌱":parseInt(s)===4?"✨":"🌟";}
  escapeHTML(s){s=String(s??'');const e=document.createElement('div');e.textContent=s;return e.innerHTML;}
  openModal(mE){if(!mE)return;mE.style.display='flex';const f=mE.querySelector('button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])');if(f)requestAnimationFrame(()=>f.focus());}
  closeModal(mE){if(!mE)return;mE.style.display='none';}

  // *** getIntroForStyle Definition ***
  getIntroForStyle(styleName) {
    const key = styleName?.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim() || '';
    const intros = {"submissive":"Welcome, lovely Submissive! ✨","brat":"Hehe, ready for trouble, Brat? 😉","slave":"Step into devotion, noble Slave. 🙏","switch":"Master of moods, versatile Switch! ↔️","pet":"Time for head pats, adorable Pet! 💖","little":"Land of crayons & cuddles, sweet Little! 🧸","puppy":"Woof woof! Ready for zoomies, playful Puppy? 🦴","kitten":"Curious Kitten, ready to pounce? 🧶","princess":"Your Highness! Ready to be adored? 👑","rope bunny":"Ready for knots of fun, lovely Rope Bunny? 🎀","masochist":"Welcome, sensation seeker! 🔥","prey":"The chase is on, little Prey! 🦊","toy":"Wind up & play, delightful Toy! 🎁","doll":"Poised & perfect Doll, strike a pose! 💖","bunny":"Soft steps, gentle heart, sweet Bunny! 🐇","servant":"Dedicated Servant, at your service! 🧹","playmate":"Game on, enthusiastic Playmate! 🎉","babygirl":"Sweet & sassy Babygirl! 😉","captive":"Caught again, daring Captive? ⛓️","thrall":"Deep focus, devoted Thrall. 🌀","puppet":"Dance to their tune, perfect Puppet? 🎭","maid":"Impeccable Maid, ready to sparkle? ✨","painslut":"Eager & ready, devoted Painslut? 🔥","bottom":"Open heart, yielding power, beautiful Bottom. 💖","dominant":"Step into your power, noble Dominant! 🔥","assertive":"Clear voice, strong boundaries, Assertive! 💪","nurturer":"Warm heart, steady hand, Nurturer! 🌸","strict":"Order & structure, firm Strict! ⚖️","master":"Commanding presence, Master! 🏰","mistress":"Elegant authority, Mistress! 👑","daddy":"Protective arms, loving Daddy! 🧸","mommy":"Nurturing embrace, caring Mommy! 💖","owner":"Claiming your prize, Owner! 🐾","rigger":"Artist with rope, Rigger! 🎨","sadist":"Conductor of sensation, Sadist! 🔥","hunter":"Primal instincts, Hunter! 🐺","trainer":"Patient teacher, Trainer! 🏆","puppeteer":"Pulling strings, Puppeteer! 🎭","protector":"Steadfast shield, Protector! 🛡️","disciplinarian":"Fair judgment, Disciplinarian! 👨‍⚖️","caretaker":"Attentive eye, Caretaker! ❤️‍🩹","sir":"Dignified command, Sir! 🎩","goddess":"Radiant power, Goddess! ✨","commander":"Strategic mind, Commander! 🎖️"};
    return intros[key] || "Explore your unique and wonderful expression!";
  }

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;"> <h1 style="color: red;">Oops! Failed to Start</h1> <p>Error: ${error.message}. Check console (F12).</p> </div>`;
}

// --- END OF FILE app.js ---
