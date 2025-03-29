  // --- Event Handlers ---
  handleListClick(e) {
    console.log("[handleListClick] Event Target:", e.target);
    const target = e.target;
    const listItem = target.closest('li[data-id]'); // Target only LIs with data-id

    if (!listItem) {
        console.log("[handleListClick] Click did not originate within a valid list item.");
        return;
    }
    const personIdStr = listItem.dataset.id;
    const personId = parseInt(personIdStr, 10);

    if (isNaN(personId)) {
        console.warn("[handleListClick] Could not parse valid person ID from data-id:", personIdStr);
        return;
    }

    console.log(`[handleListClick] Processing click for personId: ${personId}`);

    // Check for button clicks first
    if (target.closest('.edit-btn')) {
        console.log("[handleListClick] Edit button clicked.");
        this.editPerson(personId);
    } else if (target.closest('.delete-btn')) {
        console.log("[handleListClick] Delete button clicked.");
        const personaName = listItem.querySelector('.person-name')?.textContent || 'this persona';
        if (confirm(`Are you sure you want to delete ${personaName}? This cannot be undone.`)) {
            this.deletePerson(personId);
        }
    }
    // Check for click on the main info area
    else if (target.closest('.person-info')) {
        console.log("[handleListClick] Person info area clicked. Calling showPersonDetails...");
        this.showPersonDetails(personId);
    } else {
        console.log("[handleListClick] Click within LI but not on info or action buttons.");
    }
  } // End handleListClick

  handleListKeydown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return; // Only handle specific keys

      const target = e.target;
      const listItem = target.closest('li[data-id]');
      if (!listItem) return; // Must be focused within an LI

      console.log(`[handleListKeydown] Key: ${e.key} on target within LI:`, target);

      if (target.closest('.person-actions') && (target.classList.contains('edit-btn') || target.classList.contains('delete-btn'))) {
          console.log("[handleListKeydown] Activating action button.");
          e.preventDefault();
          target.click();
      } else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) {
           console.log("[handleListKeydown] Activating details view via Enter.");
           e.preventDefault();
           const personId = parseInt(listItem.dataset.id, 10);
           if (!isNaN(personId)) {
               this.showPersonDetails(personId);
           } else { console.warn("[handleListKeydown] Invalid personId:", listItem.dataset.id); }
      }
  } // End handleListKeydown

  handleWindowClick(e) {
     // Close popups if click is outside
     if (this.elements.traitInfoPopup?.style.display !== 'none') { const content = this.elements.traitInfoPopup.querySelector('.card'); const trigger = document.querySelector('.trait-info-btn[aria-expanded="true"]'); if (content && !content.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) this.hideTraitInfo(); }
     if (this.elements.contextHelpPopup?.style.display !== 'none') { const content = this.elements.contextHelpPopup.querySelector('.card'); const trigger = document.querySelector('.context-help-btn[aria-expanded="true"]'); if (content && !content.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) this.hideContextHelp(); }
     const activeSFPopup = document.querySelector('.sf-style-info-popup'); if (activeSFPopup) { const trigger = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active'); if (!activeSFPopup.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) { activeSFPopup.remove(); trigger?.classList.remove('active'); } }
   } // End handleWindowClick

  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log("Escape pressed - checking...");
          // Priorities: Popups > Modals
          if (this.elements.traitInfoPopup?.style.display !== 'none') { console.log("Closing Trait Info"); this.hideTraitInfo(); return; }
          if (this.elements.contextHelpPopup?.style.display !== 'none') { console.log("Closing Context Help"); this.hideContextHelp(); return; }
          const activeSFPopup = document.querySelector('.sf-style-info-popup'); if (activeSFPopup) { console.log("Closing SF Popup"); activeSFPopup.remove(); document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active'); return; }
          // Close active modal if any
          const openModal = document.querySelector('.modal[aria-hidden="false"]'); // Find visible modal
          if (openModal) {
              console.log(`Closing modal: #${openModal.id}`);
              this.closeModal(openModal);
          } else {
              console.log("Escape pressed, but no active modal/popup found.");
          }
      }
  } // End handleWindowKeydown

  handleTraitSliderInput(e) {
      const slider = e.target;
      const display = slider.closest('.trait')?.querySelector('.trait-value');
      if (display) display.textContent = slider.value;
      this.updateTraitDescription(slider);
  } // End handleTraitSliderInput

  handleTraitInfoClick(e) {
      const button = e.target.closest('.trait-info-btn');
      if (!button) return;
      const traitName = button.dataset.trait;
      if (!traitName) return;
      this.showTraitInfo(traitName);
      document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => { if (btn !== button) btn.setAttribute('aria-expanded', 'false'); });
      button.setAttribute('aria-expanded', 'true');
  } // End handleTraitInfoClick

  handleModalBodyClick(e) { // Consolidated handler
    const personIdStr = this.elements.modal?.dataset.personId;
    if (!personIdStr) return;
    const personId = parseInt(personIdStr, 10);
    if (isNaN(personId)) { console.warn("Invalid personId:", personIdStr); return; }

    const target = e.target;
    const button = target.closest('button');

    if (button) { // Button-specific actions
        if (button.classList.contains('toggle-goal-btn')) { const goalId = parseInt(button.dataset.goalId, 10); if (!isNaN(goalId)) this.toggleGoalStatus(personId, goalId, button.closest('li')); return; }
        if (button.classList.contains('delete-goal-btn')) { const goalId = parseInt(button.dataset.goalId, 10); if (!isNaN(goalId) && confirm("Delete goal?")) this.deleteGoal(personId, goalId); return; }
        switch (button.id) {
            case 'snapshot-btn': this.addSnapshotToHistory(personId); return;
            case 'journal-prompt-btn': this.showJournalPrompt(personId); return;
            case 'save-reflections-btn': this.saveReflections(personId); return;
            case 'oracle-btn': this.showKinkOracle(personId); return;
        }
        if (button.classList.contains('glossary-link')) { e.preventDefault(); const termKey = button.dataset.termKey; if (termKey) { this.closeModal(this.elements.modal); this.showGlossary(termKey); } return; }
    }
  } // End handleModalBodyClick

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) {
          this.setTheme(button.dataset.theme);
          this.closeModal(this.elements.themesModal);
      }
  } // End handleThemeSelection

  handleStyleFinderAction(action, dataset = {}) {
     console.log(`SF Action: ${action}`, dataset);
     switch (action) {
        case 'start': this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference') ?? 1; this.sfRenderStep(); break;
        case 'next': const curStep = this.sfSteps[this.sfStep]; if (curStep?.type === 'trait' && dataset.trait && this.sfAnswers.traits[dataset.trait] === undefined) { this.sfShowFeedback("Please adjust slider!"); return; } this.sfNextStep(dataset.trait); break;
        case 'prev': this.sfPrevStep(); break;
        case 'setRole': if (dataset.value) this.sfSetRole(dataset.value); break;
        case 'startOver': this.sfStartOver(); break;
        case 'showDetails': if (dataset.value) { this.sfShowFullDetails(dataset.value); document.querySelectorAll('.sf-result-buttons button.active').forEach(b => b.classList.remove('active')); e.target?.closest('button')?.classList.add('active'); } break;
        case 'applyStyle': if (dataset.value && this.sfIdentifiedRole) { this.confirmApplyStyleFinderResult(this.sfIdentifiedRole, dataset.value); } break;
        case 'toggleDashboard': this.toggleStyleFinderDashboard(); break;
        default: console.warn("Unknown SF action:", action);
     }
  } // End handleStyleFinderAction

  handleStyleFinderSliderInput(sliderElement){
      if (!sliderElement) return;
      const traitName = sliderElement.dataset.trait; const value = sliderElement.value;
      const descDiv = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`);
      if (!traitName || !descDiv || !this.sfSliderDescriptions[traitName]) return;
      const descs = this.sfSliderDescriptions[traitName];
      if (Array.isArray(descs) && descs.length === 10) { const idx = parseInt(value, 10) - 1; if (idx >= 0 && idx < 10) { descDiv.textContent = descs[idx]; this.sfSetTrait(traitName, value); this.sfUpdateDashboard(); } }
  } // End handleStyleFinderSliderInput

  handleDetailTabClick(e) {
      const link = e.target.closest('.tab-link');
      if (!link || link.classList.contains('active')) return;
      const tabId = link.dataset.tab;
      const personIdStr = this.elements.modal?.dataset.personId;
      if (!personIdStr || !tabId) return;
      const personId = parseInt(personIdStr, 10); if (isNaN(personId)) return;
      const person = this.people.find(p => p.id === personId); if (!person) return;

      console.log(`Switching to tab: ${tabId}`);
      this.activeDetailModalTab = tabId;
      this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => { const isActive = t === link; t.classList.toggle('active', isActive); t.setAttribute('aria-selected', String(isActive)); t.setAttribute('tabindex', isActive ? '0' : '-1'); });
      this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => { const isTarget = c.id === tabId; c.classList.toggle('active', isTarget); c.style.display = isTarget ? 'block' : 'none'; if (isTarget) { this.renderDetailTabContent(person, tabId, c); requestAnimationFrame(() => { c.setAttribute('tabindex', '0'); c.focus({ preventScroll: true }); c.removeAttribute('tabindex'); }); } });
  } // End handleDetailTabClick

  handleGlossaryLinkClick(e) {
      const link = e.target.closest('a.glossary-link, button.glossary-link');
      if (link && link.closest('#glossary-modal')) { // Only act if INSIDE glossary modal
          e.preventDefault();
          const termKey = link.dataset.termKey;
          const termElement = this.elements.glossaryBody?.querySelector(`#gloss-term-${termKey}`);
          if (termElement) {
              console.log(`>>> Glossary internal link clicked: ${termKey}`);
              this.elements.glossaryBody.querySelectorAll('.highlighted-term').forEach(el => el.classList.remove('highlighted-term'));
              termElement.classList.add('highlighted-term');
              termElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              termElement.focus(); // Focus the term heading
          } else { console.warn(`Glossary term element not found for key: ${termKey}`); }
      }
      // Links outside glossary modal are handled elsewhere (e.g., handleModalBodyClick) or default link behavior
  } // End handleGlossaryLinkClick

  handleExploreStyleLinkClick(e) {
      e.preventDefault();
      const styleName = this.elements.style?.value;
      if (styleName) this.showStyleDiscovery(styleName);
      else console.warn("Explore Style link clicked but no style selected.");
  } // End handleExploreStyleLinkClick

  // --- Core Rendering ---
  // renderStyles, renderTraits, createTraitHTML, updateTraitDescription
  // renderList, createPersonListItemHTML, updateStyleExploreLink
  // (Keep these functions as they were in the previous fully verified version)
  // ... (Make sure these functions exist here from previous code) ...
  renderStyles(roleKey) {
    const selectElement = this.elements.style;
    if (!selectElement) { console.error("!!! renderStyles Error: Style select element not found!"); return; }
    selectElement.innerHTML = '<option value="">-- Select a Style --</option>';
    if (!bdsmData || typeof bdsmData !== 'object') { console.error("!!! renderStyles Error: bdsmData is not loaded or invalid."); selectElement.innerHTML = '<option value="">Error: Data Missing</option>'; selectElement.disabled = true; return; }
    const roleData = bdsmData[roleKey]; console.log(`Found roleData for '${roleKey}':`, roleData ? 'Exists' : 'Not Found');
    let styles = []; if (roleData && Array.isArray(roleData.styles)) { styles = roleData.styles; console.log(`Found ${styles.length} styles for '${roleKey}'.`); } else { console.warn(`No valid 'styles' array found for role: '${roleKey}' in bdsmData.`); if (!roleData) console.warn(`Role key '${roleKey}' might be missing in bdsmData.`); }
    if (styles.length > 0) { try { styles.sort((a, b) => (a?.name || '').localeCompare(b?.name || '')).forEach((style, index) => { if (style && style.name) { const escapedName = this.escapeHTML(style.name); selectElement.innerHTML += `<option value="${escapedName}">${escapedName}</option>`; } else { console.warn(`Style object at index ${index} is invalid or missing name:`, style); } }); selectElement.disabled = false; console.log("Finished adding style options."); } catch (loopError) { console.error("!!! renderStyles Error: Failed during style option loop!", loopError); selectElement.innerHTML = '<option value="">Error Loading Styles</option>'; selectElement.disabled = true; } } else { selectElement.innerHTML = `<option value="">-- No Styles for ${this.escapeHTML(roleKey)} --</option>`; selectElement.disabled = true; console.log("No styles found, setting disabled state."); } this.updateStyleExploreLink(); console.log("--- Exiting renderStyles ---");
  }
  renderTraits(roleKey, styleName) {
    const container = this.elements.traitsContainer, msgDiv = this.elements.traitsMessage; if (!container || !msgDiv) return;
    container.innerHTML = ''; container.style.display = 'none'; msgDiv.style.display = 'block'; msgDiv.textContent = 'Select Role & Style.';
    if (!roleKey || !styleName || !bdsmData || !bdsmData[roleKey]) return;
    const roleData = bdsmData[roleKey]; const styleObj = roleData.styles?.find(s => s.name === styleName); if (!styleObj) { msgDiv.textContent = `Details for '${styleName}' not found.`; return; }
    msgDiv.style.display = 'none'; container.style.display = 'block'; let traits = [...(roleData.coreTraits || [])]; styleObj.traits?.forEach(st => { if (st?.name && !traits.some(ct => ct.name === st.name)) traits.push(st); });
    if (traits.length === 0) { container.innerHTML = `<p>No traits for ${this.escapeHTML(styleName)}.</p>`; return; }
    traits.sort((a, b) => (a?.name || '').localeCompare(b?.name || '')); traits.forEach(trait => container.innerHTML += this.createTraitHTML(trait));
    const pTraits = this.currentEditId ? this.people.find(p => p.id === this.currentEditId)?.traits : null;
    container.querySelectorAll('.trait-slider').forEach(s => { s.value = pTraits?.[s.dataset.trait] ?? 3; this.updateTraitDescription(s); const d = s.closest('.slider-container')?.querySelector('.trait-value'); if(d) d.textContent = s.value; });
  }
  createTraitHTML(trait) {
    if (!trait || !trait.name || !trait.desc || typeof trait.desc !== 'object') return '<p class="error">Bad trait def</p>';
    const name = trait.name.charAt(0).toUpperCase() + trait.name.slice(1).replace(/([A-Z])/g, ' $1'); const descId = `desc-${trait.name}`, sliderId = `slider-${trait.name}`, labelId = `label-${trait.name}`; const valDesc = this.escapeHTML(trait.desc['3'] || "N/A");
    return `<div class="trait"><label id="${labelId}" for="${sliderId}" class="trait-label">${this.escapeHTML(name)}<button type="button" class="trait-info-btn small-btn" data-trait="${trait.name}">?</button></label><div class="slider-container"><input type="range" id="${sliderId}" class="trait-slider" min="1" max="5" value="3" data-trait="${trait.name}" aria-labelledby="${labelId}" aria-describedby="${descId}"><span class="trait-value" data-trait="${trait.name}" aria-live="polite">3</span></div><p class="trait-desc muted-text" id="${descId}">${valDesc}</p></div>`;
  }
  updateTraitDescription(slider) {
    if (!slider) return; const traitName = slider.dataset.trait; const value = slider.value; const descElement = slider.closest('.trait')?.querySelector('.trait-desc'); if (!traitName || !value || !descElement) return; const roleKey = this.elements.role?.value; const styleName = this.elements.style?.value; if (!roleKey || !bdsmData || !bdsmData[roleKey]) return; const roleData = bdsmData[roleKey]; let traitDef = roleData.coreTraits?.find(t => t.name === traitName); if (!traitDef && styleName) { const styleObj = roleData.styles?.find(s => s.name === styleName); traitDef = styleObj?.traits?.find(t => t.name === traitName); } descElement.textContent = this.escapeHTML(traitDef?.desc?.[value] || "N/A");
  }
  renderList() {
      const list = this.elements.peopleList; if (!list) return; this.displayDailyChallenge(); list.innerHTML = this.people.length === 0 ? '<li>No personas yet.</li>' : this.people.sort((a, b) => (a.name||'').localeCompare(b.name||'')).map(p => this.createPersonListItemHTML(p)).join(''); if (this.lastSavedId) { const item = list.querySelector(`li[data-id="${this.lastSavedId}"]`); if(item) { item.classList.add('item-just-saved'); setTimeout(()=>item.classList.remove('item-just-saved'), 1500); } this.lastSavedId = null; }
  }
  createPersonListItemHTML(person) {
    const flair = this.getFlairForScore( /* calculate avg score */ 3); const icons = person.achievements?.map(id => achievementList[id]?.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0]).filter(Boolean).slice(0,3).join('') || ''; const name = this.escapeHTML(person.name || 'Unnamed');
    return `<li data-id="${person.id}" tabindex="0"><div class="person-info" role="button" aria-label="View ${name}"><span class="person-avatar">${person.avatar||'❓'}</span><div class="person-name-details"><span class="person-name">${name} <span class="person-flair">${flair}</span></span><span class="person-details muted-text">${this.escapeHTML(person.style||'N/A')} (${this.escapeHTML(person.role||'N/A')}) ${icons ? `<span title="${person.achievements.length} A.">${icons}</span>` : ''}</span></div></div><div class="person-actions"><button type="button" class="small-btn edit-btn">Edit</button><button type="button" class="small-btn delete-btn">Delete</button></div></li>`;
  }
  updateStyleExploreLink() {
     const selectedStyle = this.elements.style?.value; const link = this.elements.styleExploreLink; if (link) { if (selectedStyle) { const cleanStyleName = selectedStyle.replace(/(\p{Emoji})/gu, '').trim(); link.textContent = `(Explore ${this.escapeHTML(cleanStyleName)})`; link.setAttribute('aria-label', `Explore details for the ${this.escapeHTML(selectedStyle)} style`); link.style.display = 'inline'; } else { link.style.display = 'none'; } }
  }

  // --- CRUD ---
  savePerson() { /* ... Keep existing logic ... */ }
  editPerson(personId) { /* ... Keep existing logic ... */ }
  deletePerson(personId) { /* ... Keep existing logic ... */ }
  resetForm(isManualClear = false) { /* ... Keep existing logic ... */ }

  // --- Live Preview ---
  updateLivePreview() { /* ... Keep existing logic ... */ }

  // --- Modal Display ---
  showPersonDetails(personId) { /* ... Keep existing logic ... */ }
  renderDetailTabContent(person, tabId, contentElement) { /* ... Keep existing logic ... */ }

  // --- New Feature Logic ---
  addGoal(personId, formElement) { /* ... Keep existing logic ... */ }
  toggleGoalStatus(personId, goalId, listItemElement = null) { /* ... Keep existing logic ... */ }
  deleteGoal(personId, goalId) { /* ... Keep existing logic ... */ }
  renderGoalList(person) { /* ... Keep existing logic ... */ }
  showJournalPrompt(personId) { /* ... Keep existing logic ... */ }
  saveReflections(personId) { /* ... Keep existing logic ... */ }
  addSnapshotToHistory(personId) { /* ... Keep existing logic ... */ }
  renderHistoryChart(person, canvasId) { /* ... Keep existing logic ... */ }
  toggleSnapshotInfo(button) { /* ... Keep existing logic ... */ }
  renderAchievementsList(person, listElementId) { /* ... Keep existing logic ... */ }
  showAchievements() { /* ... Keep existing logic ... */ }
  showKinkOracle(personId) { /* ... Keep existing logic ... */ }
  displayDailyChallenge() { /* ... Keep existing logic ... */ }

  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) { /* ... Keep existing logic ... */ }
  showStyleDiscovery(styleNameToHighlight = null) { /* ... Keep existing logic ... */ }
  renderStyleDiscoveryContent(styleNameToHighlight = null) { /* ... Keep existing logic ... */ }

  // --- Data Import/Export ---
  exportData() { /* ... Keep existing logic ... */ }
  importData(event) { /* ... Keep existing logic ... */ }

  // --- Popups ---
  showTraitInfo(traitName){ /* ... Keep existing logic ... */ }
  hideTraitInfo(){ /* ... Keep existing logic ... */ }
  showContextHelp(helpKey) { /* ... Keep existing logic ... */ }
  hideContextHelp() { /* ... Keep existing logic ... */ }

  // --- Style Finder Methods ---
  sfStart() { /* ... Keep existing logic ... */ }
  sfClose() { /* ... Keep existing logic ... */ }
  sfCalculateSteps() { /* ... Keep existing logic ... */ }
  sfRenderStep() { /* ... Keep existing logic ... */ }
  sfSetRole(role) { /* ... Keep existing logic ... */ }
  sfSetTrait(trait, value) { /* ... Keep existing logic ... */ }
  sfNextStep(currentTrait = null) { /* ... Keep existing logic ... */ }
  sfPrevStep() { /* ... Keep existing logic ... */ }
  sfStartOver() { /* ... Keep existing logic ... */ }
  sfComputeScores() { /* ... Keep existing logic ... */ }
  sfUpdateDashboard(forceVisible = false) { /* ... Keep existing logic ... */ }
  toggleStyleFinderDashboard() { /* ... Keep existing logic ... */ }
  sfCalculateResult() { /* ... Keep existing logic ... */ }
  sfGenerateSummaryDashboard() { /* ... Keep existing logic ... */ }
  sfShowFeedback(message) { /* ... Keep existing logic ... */ }
  sfShowTraitInfo(traitName) { /* ... Keep existing logic ... */ }
  sfShowFullDetails(styleNameWithEmoji) { /* ... Keep existing logic ... */ }
  getStyleIcons() { /* ... Keep existing logic ... */ }
  confirmApplyStyleFinderResult(role, styleWithEmoji) { /* ... Keep existing logic ... */ }
  applyStyleFinderResult(role, styleWithEmoji) { /* ... Keep existing logic ... */ }

  // --- Other Helper Functions ---
  getFlairForScore(s) { const score = Number(s); return score >= 5 ? '🌟' : score >= 4 ? '✨' : score >= 3 ? '👍' : score >= 2 ? '🌱' : '🤔'; }
  getEmojiForScore(s) { const score = Number(s); return score >= 5 ? '🔥' : score >= 4 ? '💪' : score >= 3 ? '😊' : score >= 2 ? '👀' : '💧'; }
  escapeHTML(str){ const div=document.createElement('div'); div.textContent = str ?? ''; return div.innerHTML; }
  getIntroForStyle(styleName){ if(!styleName) return null; const clean=styleName.replace(/(\p{Emoji})/gu, '').trim(); const data=this.sfStyleDescriptions[clean]; const first=data?.long?.match(/^.*?[.!?](?=\s|$)/)?.[0]; return data?.short ? `"${data.short}"${first ? ` - ${first}`:''}` : null; }
  showNotification(message, type = 'info', duration = 4000) { let n=document.getElementById('app-notification'); if(!n){n=document.createElement('div');n.id='app-notification';n.setAttribute('role','alert');n.setAttribute('aria-live','assertive');document.body.appendChild(n);} if(this.notificationTimer) clearTimeout(this.notificationTimer); n.className = ''; n.classList.add(`notification-${type}`); if(type==='achievement') n.classList.add('notification-achievement'); n.textContent=message; n.style.display='block'; n.style.transition='top 0.5s ease-out, opacity 0.5s ease-out'; requestAnimationFrame(()=>{ n.style.top='20px'; n.style.opacity='1'; }); this.notificationTimer=setTimeout(()=>{ n.style.top='-60px'; n.style.opacity='0'; setTimeout(()=>{if(n)n.style.display='none';this.notificationTimer=null;}, 500);}, duration); }

  // --- Theme Management ---
  applySavedTheme() { const theme = localStorage.getItem('kinkCompassTheme'); if (theme && ['light','dark','pastel','velvet'].includes(theme)) this.setTheme(theme); else this.setTheme(document.documentElement.getAttribute('data-theme') || 'light'); }
  setTheme(themeName){ document.documentElement.setAttribute('data-theme', themeName); document.body.setAttribute('data-theme', themeName); localStorage.setItem('kinkCompassTheme', themeName); this.elements.themeToggle.textContent = (themeName === 'light' || themeName === 'pastel') ? '🌙' : '☀️'; if (this.chartInstance) { /* Update chart colors */ } grantAchievement({}, 'theme_changer'); localStorage.setItem('kinkCompass_theme_changer', 'true'); }
  toggleTheme(){ const current = document.documentElement.getAttribute('data-theme') || 'light'; this.setTheme((current === 'light' || current === 'pastel') ? 'dark' : 'light'); }

   // --- Modal Management ---
   openModal(modalElement) { if (!modalElement) return; console.log(`Opening modal: #${modalElement.id}`); this.elementThatOpenedModal = document.activeElement; modalElement.setAttribute('aria-hidden', 'false'); modalElement.style.display = 'flex'; requestAnimationFrame(() => { const focusable = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'); (focusable || modalElement).focus(); }); }
   closeModal(modalElement) { if (!modalElement) return; console.log(`Closing modal: #${modalElement.id}`); modalElement.setAttribute('aria-hidden', 'true'); modalElement.style.display = 'none'; try { if (this.elementThatOpenedModal && document.body.contains(this.elementThatOpenedModal)) this.elementThatOpenedModal.focus(); else document.body.focus(); } catch (e) { console.warn("Focus restoration failed:", e); } this.elementThatOpenedModal = null; }

   // <<< --- NEW HELPER FUNCTIONS --- >>>
   getSynergyHints(person) { const hints = []; if (!person?.traits || !synergyHints) return hints; const scores = person.traits; const high = Object.entries(scores).filter(([,s])=>parseInt(s)>=4).map(([n])=>n); const low = Object.entries(scores).filter(([,s])=>parseInt(s)<=2).map(([n])=>n); (synergyHints.highPositive||[]).forEach(syn=>{if(syn.traits.every(t=>high.includes(t))) hints.push({type:'positive',text:syn.hint});}); (synergyHints.interestingDynamics||[]).forEach(dyn=>{if(high.includes(dyn.traits.high)&&low.includes(dyn.traits.low)) hints.push({type:'dynamic',text:dyn.hint});}); return hints; }
   getGoalAlignmentHints(person) { const hints = []; if (!person?.goals || !person?.traits || !goalKeywords) return hints; let count = 0; person.goals.filter(g=>!g.done).forEach(goal=>{ if(count>=3) return; const lowerGoal=goal.text.toLowerCase(); let goalHintAdded=false; Object.entries(goalKeywords).forEach(([kw,data])=>{ if(goalHintAdded||count>=3) return; if(lowerGoal.includes(kw)){ const trait=data.relevantTraits.find(t=>person.traits.hasOwnProperty(t)); if(trait){ const s=person.traits[trait]; const tmpl=data.promptTemplates[Math.floor(Math.random()*data.promptTemplates.length)]; const name=trait.charAt(0).toUpperCase()+trait.slice(1).replace(/([A-Z])/g,' $1'); const txt=tmpl.replace('{traitName}',`'${name}'`); hints.push(`Goal "${this.escapeHTML(goal.text)}": ${this.escapeHTML(txt)} (${name} score: ${s})`); count++; goalHintAdded=true; } } }); }); return hints; }
   getDailyChallenge(persona=null) { const today=new Date().toDateString(); const key='kinkCompassDailyChallenge'; let stored=null; try {stored=JSON.parse(localStorage.getItem(key)||'{}');}catch(e){stored={};} if(stored.date===today && stored.challenge) return stored.challenge; let possible=[...(challenges?.communication||[]),...(challenges?.exploration||[])]; const role=persona?.role; if(role==='dominant'&&challenges?.dominant_challenges) possible.push(...challenges.dominant_challenges); else if(role==='submissive'&&challenges?.submissive_challenges) possible.push(...challenges.submissive_challenges); else if(role==='switch'&&challenges?.switch_challenges) possible.push(...challenges.switch_challenges); if(possible.length===0) return null; let challenge, attempts=0; do {challenge=possible[Math.floor(Math.random()*possible.length)]; attempts++;} while(attempts<10&&possible.length>1&&stored.challenge&&challenge.title===stored.challenge.title); localStorage.setItem(key, JSON.stringify({date:today, challenge:challenge})); return challenge; }
   getKinkOracleReading(person) { if (!person || !oracleReadings) return {opening:"?",focus:"?",encouragement:"?",closing:"?"}; const r={}; r.opening=oracleReadings.openings[Math.floor(Math.random()*oracleReadings.openings.length)]; let focus=""; const traits=person.traits?Object.entries(person.traits).filter(([,s])=>!isNaN(parseInt(s))&&s>=1&&s<=5):[]; if(traits.length>0){ const entry=traits[Math.floor(Math.random()*traits.length)]; const name=entry[0]; const disp=name.charAt(0).toUpperCase()+name.slice(1).replace(/([A-Z])/g,' $1'); const tmpl=oracleReadings.focusAreas.traitBased[Math.floor(Math.random()*oracleReadings.focusAreas.traitBased.length)]; focus=tmpl.replace('{traitName}',`'${disp}'`); } else if(person.style){ const tmpl=oracleReadings.focusAreas.styleBased[Math.floor(Math.random()*oracleReadings.focusAreas.styleBased.length)]; focus=tmpl.replace('{styleName}',`'${person.style}'`); } else { focus=oracleReadings.focusAreas.general[Math.floor(Math.random()*oracleReadings.focusAreas.general.length)]; } r.focus=focus; r.encouragement=oracleReadings.encouragements[Math.floor(Math.random()*oracleReadings.encouragements.length)]; r.closing=oracleReadings.closings[Math.floor(Math.random()*oracleReadings.closings.length)]; return r; }
   // --- Achievement Checkers ---
   checkGoalStreak(person) { if (!person?.goals || person.goals.length<3) return false; const ago=Date.now()-7*864e5; const recent=person.goals.filter(g=>g.done&&g.completedAt&&new Date(g.completedAt).getTime()>=ago); return recent.length>=3; }
   checkTraitTransformation(person, snap) { if (!person?.history?.length||!snap?.traits) return false; const prev=person.history[person.history.length-1]; if (!prev?.traits) return false; for(const name in snap.traits){ if(prev.traits.hasOwnProperty(name)){ const cur=parseInt(snap.traits[name]); const pre=parseInt(prev.traits[name]); if(!isNaN(cur)&&!isNaN(pre)&&cur-pre>=2) return true; }} return false; }
   checkConsistentSnapper(person, time) { if (!person?.history?.length || !time) return false; const last=person.history[person.history.length-1].timestamp; if (!last) return false; const diff=(new Date(time).getTime()-new Date(last).getTime())/864e5; return diff>=2.5; }

} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: red; padding: 20px; border: 2px solid red; margin: 20px; background: white; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px;';
    errorDiv.innerHTML = `<strong>Fatal Error: KinkCompass could not start.</strong><br>${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}`;
    document.body.prepend(errorDiv);
}
