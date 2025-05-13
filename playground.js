class PlaygroundApp {
  constructor(styleFinderAppInstance) {
    this.app = styleFinderAppInstance;
    this.playgroundContentEl = null;
    this.currentActivity = null;
    
    this.selectedDilemmaArchetype = 'general';
    this.currentDilemma = null;
    this.currentScenario = null;
    this.currentAdventure = null;
    this.adventureStep = null;
    this.currentDeepDiveArchetype = null;
    this.compareArchetype1 = null;
    this.compareArchetype2 = null;

    // Define activities *after* all properties they might use are initialized
    // The methods themselves will be bound correctly because they are class methods
    this.activities = this.defineActivities(); 
    this.glossaryTerms = this.defineGlossary();
  }

  initializePlayground(containerElementId) {
    const mainPlaygroundContainer = document.getElementById(containerElementId);
    if (!mainPlaygroundContainer) {
      console.error("Playground container not found!");
      return;
    }

    mainPlaygroundContainer.style.display = 'none'; 
    mainPlaygroundContainer.innerHTML = `
      <div class="playground-header">
        <h2>Welcome to the Archetype Playground!</h2>
        <p>Explore scenarios, deepen your understanding, and reflect on your style.</p>
        <button id="close-playground-btn" aria-label="Close Playground">×</button>
      </div>
      <nav id="playground-nav"></nav>
      <div id="playground-activity-content" class="playground-activity-content-area">
        <p class="playground-welcome-message">Select an activity from the menu to begin.</p>
      </div>
    `;
    this.playgroundContentEl = document.getElementById('playground-activity-content');
    this.populateNav();

    const closeBtn = document.getElementById('close-playground-btn');
    if(closeBtn) closeBtn.addEventListener('click', () => this.hidePlayground());

    this.playgroundContentEl.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.matches('.option-btn') && this.currentActivity === 'ethicalDilemmas' && this.currentDilemma && target.closest('#dilemma-area')) {
            const selectedIndex = parseInt(target.dataset.index);
            const feedbackEl = this.playgroundContentEl.querySelector('#dilemma-feedback');
            if (feedbackEl && this.currentDilemma.options[selectedIndex]) {
                 feedbackEl.innerHTML = `<strong>Your Choice:</strong> ${this.currentDilemma.options[selectedIndex].text}<br><strong>Insight:</strong> ${this.currentDilemma.options[selectedIndex].insight}`;
            }
            this.playgroundContentEl.querySelectorAll('#dilemma-area .option-btn').forEach(b => b.disabled = true);
        }
        else if (target.id === 'submit-scenario-response' && this.currentActivity === 'scenarioResolutions') {
            const responseEl = this.playgroundContentEl.querySelector('#scenario-response');
            const feedbackEl = this.playgroundContentEl.querySelector('#scenario-feedback');
            if (responseEl && feedbackEl) {
                if (responseEl.value.trim()) {
                    feedbackEl.innerHTML = "Thank you for your reflection! Considering different approaches helps deepen understanding.";
                } else {
                    feedbackEl.innerHTML = "Please write your thoughts before submitting.";
                }
            }
        }
        else if (target.matches('.adventure-options .option-btn') && this.currentActivity === 'chooseYourAdventure') {
            const nextNodeId = target.dataset.nextNode;
            if (nextNodeId) this.progressAdventure(nextNodeId);
        }
        else if (target.id === 'restart-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
            const adventureId = target.dataset.adventureId;
            if (adventureId && this.currentAdventure && this.currentAdventure.id === adventureId) { // Ensure it's the current adventure
                this.startSelectedAdventure(adventureId);
            }
        }
        else if (target.id === 'choose-another-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
             this.renderAdventureHome();
        }
        else if (target.matches('#explore-another-arch-options .option-btn') && this.currentActivity === 'strengthsChallenges') {
             const archetypeName = target.dataset.archetype;
             if (archetypeName) this.setDeepDiveArchetype(archetypeName);
        }
    });
  }
  
  showPlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'block';
        mainPlaygroundContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!this.currentActivity && this.playgroundContentEl) {
             this.playgroundContentEl.innerHTML = `<p class="playground-welcome-message">Select an activity from the menu to begin.</p>`;
        }
    }
  }

  hidePlaygroundWithoutOpeningQuiz() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null; 
  }

  hidePlayground() {
    this.hidePlaygroundWithoutOpeningQuiz(); // Use the simpler hide first
    // Then, if the main app is available and has completed the quiz, show its results
    if (this.app && this.app.quizCompletedOnce && typeof this.app.showQuizModalAtLastStep === 'function') {
        this.app.showQuizModalAtLastStep();
    } else if (this.app && typeof this.app.showQuizModalAtLastStep === 'function') {
        // If quiz not completed, maybe just ensure quiz modal is hidden or main page is clear
        // For now, this implies we don't auto-open the quiz modal if it wasn't finished.
        // The "Return to Quiz Results" button on the main page handles re-entry.
    }
  }

  populateNav() {
    const navEl = document.getElementById('playground-nav');
    if (!navEl) return;
    let navHtml = '<ul>';
    for (const key in this.activities) {
      navHtml += `<li><button class="playground-nav-btn" data-activity-key="${key}">${this.activities[key].title}</button></li>`;
    }
    navHtml += '</ul>';
    navEl.innerHTML = navHtml;

    navEl.querySelectorAll('.playground-nav-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        this.startActivity(e.target.dataset.activityKey);
        navEl.querySelectorAll('.playground-nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  startActivity(activityKey) {
    this.currentActivity = activityKey;
    const activity = this.activities[activityKey];
    if (activity && typeof activity.renderFunction === 'function') {
      if (activityKey === 'ethicalDilemmas') this.selectedDilemmaArchetype = 'general';
      if (activityKey === 'chooseYourAdventure') { this.currentAdventure = null; this.adventureStep = null; }
      if (activityKey === 'compareContrast') {this.compareArchetype1 = null; this.compareArchetype2 = null;}
      
      activity.renderFunction.call(this); // Explicitly call with `this` context
    } else {
      if(this.playgroundContentEl) this.playgroundContentEl.innerHTML = `<p>Activity "${activityKey}" not found or has no render function.</p>`;
    }
  }
  
  getUserArchetype() {
    if (this.app && this.app.customArchetypeName && this.app.customArchetypeName.trim() !== "") {
        const curatedKnownStyle = this.app.styleDescriptions[this.app.customArchetypeName];
        let primaryIcon = '✨'; 
        if(this.app.styleFinderScores && Object.keys(this.app.styleFinderScores).length > 0) {
            const sortedResults = Object.entries(this.app.styleFinderScores).sort((a, b) => b[1] - a[1]);
            if (sortedResults.length > 0 && sortedResults[0][1] > 0) {
                const topStyleName = sortedResults[0][0];
                const styleData = this.app.styleDescriptions[topStyleName];
                if(styleData && styleData.icon) primaryIcon = styleData.icon;
            }
        }
        const icon = curatedKnownStyle ? curatedKnownStyle.icon : primaryIcon;
        return { name: this.app.customArchetypeName, icon: icon, isCurated: true, description: this.app.customArchetypeDescription };
    }
    if (this.app && this.app.styleFinderScores && Object.keys(this.app.styleFinderScores).length > 0) {
        const sortedResults = Object.entries(this.app.styleFinderScores).sort((a, b) => b[1] - a[1]);
        if (sortedResults.length > 0 && sortedResults[0][1] > 0) {
            const topStyleName = sortedResults[0][0];
            const styleData = this.app.styleDescriptions[topStyleName];
            if (styleData && styleData.title) { // Check for title to ensure it's a fleshed-out style
                return { name: topStyleName, icon: styleData.icon, isCurated: false, description: styleData.essence };
            }
        }
    }
    return { name: "Seeker", icon: '❓', isCurated: false, description: "Your archetype is yet to be revealed. Please complete the Oracle quiz first for personalized Playground activities." };
  }

  defineActivities() {
    // IMPORTANT: Ensure `this` refers to the PlaygroundApp instance when these arrow functions are eventually called.
    // The call `activity.renderFunction.call(this)` in `startActivity` ensures this.
    return {
      ethicalDilemmas: { title: "Ethical Echoes", renderFunction: () => this.renderEthicalDilemmasHome(), data: { /* ... dilemmas data ... */ } },
      scenarioResolutions: { title: "Scenario Sparks", renderFunction: () => this.renderScenarioResolutions(), data: [ /* ... scenarios data ... */ ] },
      chooseYourAdventure: { title: "Adventure Paths", renderFunction: () => this.renderAdventureHome(), stories: [ /* ... stories data ... */ ] },
      consentWorkshop: { title: "Consent & Limits", renderFunction: () => this.renderConsentWorkshop(), sections: [ /* ... sections data ... */ ] },
      strengthsChallenges: { title: "Archetype Reflection", renderFunction: () => this.renderStrengthsChallenges() },
      compareContrast: { title: "Compare Styles", renderFunction: () => this.renderCompareContrast() },
      glossary: { title: "Kinktionary", renderFunction: () => this.renderGlossary() }
    };
  }

  defineGlossary() { /* ... Full glossary data ... */ 
    return {
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.", "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.", "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.", "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.", "CNC": "Consensual Non-Consent. A type of role-play where a partner consents beforehand to a scenario involving simulated non-consent (e.g., 'rape play'). Requires extreme trust, communication, and negotiation.", "Collar": "A neck adornment often symbolizing ownership, commitment, or a specific role within a BDSM dynamic.", "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).", "Daddy/Mommy Dom/Domme (DD/lg, MD/lb)": "A Dominant who takes on a parental, nurturing, and guiding role towards a partner who enjoys an age play 'Little' role.", "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.", "Edge Play": "Play that pushes boundaries close to physical or psychological limits, or involves activities with higher inherent risk. Requires extreme caution and expertise.", "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.", "Kink": "Unconventional sexual preferences or practices.", "Limits": "Boundaries set by individuals regarding what they are and are not willing to do or experience.", "Little Space": "A mindset or persona adopted by an individual (a 'Little') who enjoys regressing to a younger, more childlike state.", "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.", "Master/Mistress": "A Dominant in a highly structured, often long-term dynamic with a 'Slave,' implying deep control and responsibility.", "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.", "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).", "Power Exchange": "A dynamic where one partner willingly cedes a degree of power or control to another.", "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.", "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.", "Role-play": "Adopting specific characters or scenarios within a BDSM context.", "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow, Green).", "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.", "Sadomasochism (S&M)": "The giving and receiving of pain or humiliation for pleasure.", "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.", "Shibari": "Japanese style of artistic rope bondage.", "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.", "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.", "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.", "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.", "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant.", "Vanilla": "Slang term for conventional sexual activities or lifestyle, not involving BDSM or kink."
    };
  }

  // --- Render functions for each activity ---
  // (Make sure all these methods are correctly defined as part of the class)

  renderEthicalDilemmasHome() {
    const userArch = this.getUserArchetype();
    let html = `
      <h3>Ethical Echoes <span class="arch-context">(reflecting as a ${userArch.name} ${userArch.icon})</span></h3>
      <p>Select an archetype to view dilemmas tailored to that style, or explore general ethical situations. Your reflections are for your own insight.</p>
      <div class="activity-selector">
        <label for="dilemma-archetype-select">Focus on Dilemmas for:</label>
        <select id="dilemma-archetype-select">
          <option value="general">General Dilemmas</option>
    `;
    const allArchetypes = [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();
    allArchetypes.forEach(archName => {
        if (this.activities.ethicalDilemmas.data[archName] && this.activities.ethicalDilemmas.data[archName].length > 0) {
            const title = this.app.styleDescriptions[archName]?.title || archName;
            html += `<option value="${archName}" ${this.selectedDilemmaArchetype === archName ? 'selected' : ''}>${title}</option>`;
        }
    });
    html += `
        </select>
      </div>
      <div id="dilemma-area" style="margin-top:15px;">
        <p><i>${this.selectedDilemmaArchetype === 'general' ? 'Loading general dilemmas...' : `Loading dilemmas for ${this.selectedDilemmaArchetype}...`}</i></p>
      </div>
      <button id="next-dilemma-btn" class="playground-action-btn">Next Dilemma</button>
    `;
    this.playgroundContentEl.innerHTML = html;

    const selectEl = this.playgroundContentEl.querySelector('#dilemma-archetype-select');
    if(selectEl) {
        selectEl.addEventListener('change', (e) => {
            this.selectedDilemmaArchetype = e.target.value;
            this.loadRandomDilemma(true);
        });
    }
    const nextDilemmaBtn = this.playgroundContentEl.querySelector('#next-dilemma-btn');
    if(nextDilemmaBtn) nextDilemmaBtn.addEventListener('click', () => this.loadRandomDilemma(false));
    this.loadRandomDilemma(true);
  }

  loadRandomDilemma(isNewArchetypeSelection = false) {
    const dilemmaArea = this.playgroundContentEl.querySelector('#dilemma-area');
    if (!dilemmaArea) return;
    let availableDilemmas = [];
    const allDilemmasByArchetype = this.activities.ethicalDilemmas.data;

    if (this.selectedDilemmaArchetype && this.selectedDilemmaArchetype !== 'general' && allDilemmasByArchetype[this.selectedDilemmaArchetype]) {
        availableDilemmas = allDilemmasByArchetype[this.selectedDilemmaArchetype];
    } else { 
        Object.values(allDilemmasByArchetype).forEach(archDilemmasList => {
            if(Array.isArray(archDilemmasList)) { // Ensure it's an array before spreading
                 availableDilemmas.push(...archDilemmasList);
            }
        });
    }
    if (availableDilemmas.length === 0) {
        dilemmaArea.innerHTML = "<p>No dilemmas available for this selection yet. More are being crafted by the Oracle!</p>";
        const nextBtn = this.playgroundContentEl.querySelector('#next-dilemma-btn');
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    } else {
        const nextBtn = this.playgroundContentEl.querySelector('#next-dilemma-btn');
        if (nextBtn) nextBtn.style.display = 'block';
    }
    let newDilemma;
    if (availableDilemmas.length === 1) newDilemma = availableDilemmas[0];
    else {
        do { newDilemma = availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)]; }
        while (!isNewArchetypeSelection && this.currentDilemma && newDilemma.id === this.currentDilemma.id);
    }
    this.currentDilemma = newDilemma;
    let html = `<p class="scenario-text">${this.currentDilemma.scenario.replace('[UserArchetype]', this.getUserArchetype().name)}</p>`;
    html += `<div class="options-list">`;
    this.currentDilemma.options.forEach((opt, index) => {
      html += `<button class="option-btn" data-index="${index}">${opt.text}</button>`;
    });
    html += `</div><div id="dilemma-feedback" class="feedback-text"></div>`;
    if (this.currentDilemma.archetypeNotes) {
        html += `<p class="archetype-note-text"><em>Oracle's Musings: ${this.currentDilemma.archetypeNotes}</em></p>`;
    }
    dilemmaArea.innerHTML = html;
  }

  renderScenarioResolutions() {
    const userArch = this.getUserArchetype();
    this.playgroundContentEl.innerHTML = `
      <h3>Scenario Sparks <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>
      <div id="scenario-area"></div>
      <button id="next-scenario-btn" class="playground-action-btn">Next Scenario</button>
    `;
    this.loadRandomScenario();
    const nextScenarioBtn = this.playgroundContentEl.querySelector('#next-scenario-btn');
    if(nextScenarioBtn) nextScenarioBtn.addEventListener('click', () => this.loadRandomScenario());
  }

  loadRandomScenario() {
    const scenarioArea = this.playgroundContentEl.querySelector('#scenario-area');
    if (!scenarioArea) return;
    const scenarios = this.activities.scenarioResolutions.data;
    if (!scenarios || scenarios.length === 0) {
        scenarioArea.innerHTML = "<p>No scenarios available yet.</p>"; return;
    }
    this.currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const userArch = this.getUserArchetype();
    let html = `<p class="scenario-text">${this.currentScenario.prompt.replace('[UserArchetype]', userArch.name)}</p>`;
    html += `<textarea id="scenario-response" rows="5" placeholder="How would you, as a ${userArch.name}, navigate this?"></textarea>`;
    html += `<button id="submit-scenario-response" class="playground-action-btn">Submit Reflection</button>`;
    html += `<div id="scenario-feedback" class="feedback-text"></div>`;
    if (this.currentScenario.considerations) {
        html += `<p class="archetype-note-text"><em>Consider: ${this.currentScenario.considerations}</em></p>`;
    }
    scenarioArea.innerHTML = html;
  }
  
  renderAdventureHome() {
    const userArch = this.getUserArchetype();
    let html = `
      <h3>Adventure Paths <span class="arch-context">(navigating as a ${userArch.name} ${userArch.icon})</span></h3>
      <p>Choose an adventure to begin. Your choices will shape the story!</p>
      <div class="options-list adventure-selection-list">
    `;
    this.activities.chooseYourAdventure.stories.forEach(story => {
        html += `<button class="option-btn adventure-select-btn" data-adventure-id="${story.id}">
                    <strong>${story.title}</strong><br>
                    <small>${story.description}</small>
                 </button>`;
    });
    html += `</div>`;
    this.playgroundContentEl.innerHTML = html;
    this.playgroundContentEl.querySelectorAll('.adventure-select-btn').forEach(button => {
        button.addEventListener('click', (e) => { // Arrow function here
            const adventureId = e.currentTarget.dataset.adventureId;
            this.startSelectedAdventure(adventureId); // `this` will be PlaygroundApp
        });
    });
  }

  startSelectedAdventure(adventureId) {
    const selectedStory = this.activities.chooseYourAdventure.stories.find(s => s.id === adventureId);
    if (selectedStory) {
        this.currentAdventure = selectedStory;
        this.adventureStep = this.currentAdventure.startNode;
        this.displayAdventureNode();
    }
  }

  displayAdventureNode() {
    if (!this.currentAdventure || !this.adventureStep) {
        let navButtonsHTML = `<div class="navigation-buttons" style="margin-top:15px;"><button class="playground-action-btn" id="back-to-adventure-selection">Choose Another Adventure</button></div>`;
        this.playgroundContentEl.innerHTML = "<p>Please select an adventure to start.</p>" + navButtonsHTML;
        const backBtn = this.playgroundContentEl.querySelector('#back-to-adventure-selection');
        if(backBtn) backBtn.addEventListener('click', () => this.renderAdventureHome());
        return;
    }
    const node = this.currentAdventure.nodes[this.adventureStep];
    if (!node) {
        let endNavHTML = `<div class="adventure-nav-buttons" style="margin-top:15px;">`;
        endNavHTML += `<button id="restart-adventure-btn" class="playground-action-btn" data-adventure-id="${this.currentAdventure.id}">Restart This Adventure</button>`;
        endNavHTML += `<button id="choose-another-adventure-btn" class="playground-action-btn">Choose Another Adventure</button>`;
        endNavHTML += `</div>`;
        this.playgroundContentEl.innerHTML = "<p>Adventure ended or error.</p>" + endNavHTML;
        return;
    }
    const userArch = this.getUserArchetype();
    let html = `<h3>${this.currentAdventure.title} <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>`;
    html += `<p class="scenario-text">${node.text.replace('[UserArchetype]', userArch.name)}</p>`;
    if (node.options && node.options.length > 0) {
      html += `<div class="options-list adventure-options">`;
      node.options.forEach(opt => {
        html += `<button class="option-btn" data-next-node="${opt.nextNode}">${opt.text}</button>`;
      });
      html += `</div>`;
    } else {
      html += `<p><em>This path concludes here.</em></p>`;
    }
    html += `<div class="adventure-nav-buttons" style="margin-top:15px;">`;
    if (!node.options || node.options.length === 0) { // Only show restart if it's an end node
         html += `<button id="restart-adventure-btn" class="playground-action-btn" data-adventure-id="${this.currentAdventure.id}">Restart This Adventure</button>`;
    }
    html += `<button class="playground-action-btn" id="choose-another-adventure-btn">Choose Another Adventure</button>`;
    html += `</div>`;
    this.playgroundContentEl.innerHTML = html;
  }

  progressAdventure(nextNodeId) {
    this.adventureStep = nextNodeId;
    this.displayAdventureNode();
  }

  renderConsentWorkshop() {
    const userArch = this.getUserArchetype();
    let html = `<h3>Consent & Limits Workshop <span class="arch-context">(reflecting as a ${userArch.name} ${userArch.icon})</span></h3>`;
    this.activities.consentWorkshop.sections.forEach(section => {
      html += `
        <details class="workshop-section">
          <summary><h4>${section.title}</h4></summary>
          <p>${section.content.replace('[UserArchetype]', userArch.name)}</p>
        </details>
      `;
    });
    html += `<p style="margin-top:15px;"><em>Use these points for personal reflection or discussion with partners. How does your archetype influence your approach to these topics?</em></p>`;
    this.playgroundContentEl.innerHTML = html;
  }

  renderStrengthsChallenges() {
    const userArch = this.getUserArchetype();
    let defaultArchForExploration = userArch.name;
    if (userArch.isCurated || !this.app.styleDescriptions[userArch.name]) {
        if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0) {
            defaultArchForExploration = this.app.topArchetypesForCuration[0].name;
        } else {
            this.playgroundContentEl.innerHTML = `
                <h3>Archetype Reflection: ${userArch.name} ${userArch.icon}</h3>
                <p>Please complete the Oracle quiz to identify archetypes for reflection. If you have a curated style, consider its components.</p>
            `;
            return;
        }
    }
    this.currentDeepDiveArchetype = defaultArchForExploration;
    this.displayStrengthsChallengesContent(this.currentDeepDiveArchetype);
  }

  setDeepDiveArchetype(archetypeName) {
    this.currentDeepDiveArchetype = archetypeName;
    this.displayStrengthsChallengesContent(archetypeName);
  }
  
  displayStrengthsChallengesContent(archetypeName){
    const archData = this.app.styleDescriptions[archetypeName];
    if(!archData || !archData.title){ // Check for title as well
        this.playgroundContentEl.innerHTML = `<p>Details for ${archetypeName} not found.</p>`;
        return;
    }

    let html = `<h3>Strengths & Challenges: ${archData.title} ${archData.icon}</h3>`;
    html += `<div class="reflection-columns">`;
    html += `<div class="reflection-column"><h4>Potential Strengths:</h4><ul>`;
    (archData.strengthsInDynamic || []).forEach(item => { html += `<li>${item}</li>`; });
    if (!(archData.strengthsInDynamic && archData.strengthsInDynamic.length > 0)) { html += `<li>No specific strengths listed. Reflect on what you perceive!</li>`;}
    html += `</ul></div>`;
    html += `<div class="reflection-column"><h4>Potential Challenges:</h4><ul>`;
    (archData.potentialChallenges || []).forEach(item => { html += `<li>${item}</li>`; });
    if (!(archData.potentialChallenges && archData.potentialChallenges.length > 0)) { html += `<li>No specific challenges listed. Reflect on what you perceive!</li>`;}
    html += `</ul></div></div>`;
    html += `<textarea id="strength-reflection" rows="4" placeholder="Which strengths resonate most with you for ${archData.title}? How do you see them in action?" style="width:100%; margin-top:10px;"></textarea>`;
    html += `<textarea id="challenge-reflection" rows="4" placeholder="Which challenges for ${archData.title} do you recognize? How might you navigate them?" style="width:100%; margin-top:10px;"></textarea>`;
    
    const archetypesToExplore = (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0) 
        ? this.app.topArchetypesForCuration.map(a => a.name)
        : [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();

    if (archetypesToExplore.length > 1) {
        html += `<div class="activity-selector" id="explore-another-arch-options" style="margin-top:20px;">
                    <label for="deep-dive-select">Explore another archetype:</label>
                    <select id="deep-dive-select">`;
        archetypesToExplore.forEach(archNameLoop => {
            if (this.app.styleDescriptions[archNameLoop] && this.app.styleDescriptions[archNameLoop].title) {
                 const title = this.app.styleDescriptions[archNameLoop].title || archNameLoop;
                 html += `<option value="${archNameLoop}" ${archetypeName === archNameLoop ? 'selected': ''}>${title}</option>`;
            }
        });
        html += `</select></div>`;
    }
    this.playgroundContentEl.innerHTML = html;

    const deepDiveSelect = this.playgroundContentEl.querySelector('#deep-dive-select');
    if(deepDiveSelect) {
        deepDiveSelect.addEventListener('change', (e) => {
            this.setDeepDiveArchetype(e.target.value);
        });
    }
  }

  renderCompareContrast() {
    let html = `<h3>Compare & Contrast Archetypes</h3>`;
    html += `<p>Select two archetypes to see their core aspects side-by-side.</p>`;
    html += `<div class="compare-selects">`;
    const allStyleNames = [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();

    html += `<select id="compare-arch1">`;
    html += `<option value="">-- Select Archetype 1 --</option>`;
    allStyleNames.forEach(name => {
        if (this.app.styleDescriptions[name] && this.app.styleDescriptions[name].title) {
            const title = this.app.styleDescriptions[name].title || name;
            html += `<option value="${name}" ${this.compareArchetype1 === name ? 'selected' : ''}>${title}</option>`;
        }
    });
    html += `</select>`;

    html += `<select id="compare-arch2">`;
    html += `<option value="">-- Select Archetype 2 --</option>`;
    allStyleNames.forEach(name => {
         if (this.app.styleDescriptions[name] && this.app.styleDescriptions[name].title) {
            const title = this.app.styleDescriptions[name].title || name;
            html += `<option value="${name}" ${this.compareArchetype2 === name ? 'selected' : ''}>${title}</option>`;
        }
    });
    html += `</select></div>`;
    html += `<div id="comparison-area" class="comparison-results"></div>`;
    this.playgroundContentEl.innerHTML = html;

    const select1 = this.playgroundContentEl.querySelector('#compare-arch1');
    const select2 = this.playgroundContentEl.querySelector('#compare-arch2');
    if(select1) select1.addEventListener('change', (e) => { this.compareArchetype1 = e.target.value; this.displayComparison(); });
    if(select2) select2.addEventListener('change', (e) => { this.compareArchetype2 = e.target.value; this.displayComparison(); });
    
    this.displayComparison();
  }

  displayComparison() {
    const area = this.playgroundContentEl.querySelector('#comparison-area');
    if (!area) return;
    if (!this.compareArchetype1 || !this.compareArchetype2) {
      area.innerHTML = "<p>Please select two archetypes to compare.</p>"; return;
    }
    if (this.compareArchetype1 === this.compareArchetype2) {
      area.innerHTML = "<p>Please select two <em>different</em> archetypes to compare.</p>"; return;
    }
    const arch1Data = this.app.styleDescriptions[this.compareArchetype1];
    const arch2Data = this.app.styleDescriptions[this.compareArchetype2];
    if (!arch1Data || !arch1Data.title || !arch2Data || !arch2Data.title) {
      area.innerHTML = "<p>Full comparison data for one or both selected archetypes is unavailable.</p>"; return;
    }
    let comparisonHTML = `<div class="compare-columns">`;
    comparisonHTML += `<div class="compare-column"><h4>${arch1Data.title || this.compareArchetype1} ${arch1Data.icon || ''}</h4>`;
    comparisonHTML += `<p><strong>Essence:</strong> ${arch1Data.essence || 'N/A'}</p>`;
    comparisonHTML += `<strong>Core Motivations:</strong><ul>${(arch1Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul>`;
    comparisonHTML += `<strong>Key Characteristics:</strong><ul>${(arch1Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul>`;
    comparisonHTML += `</div>`;
    comparisonHTML += `<div class="compare-column"><h4>${arch2Data.title || this.compareArchetype2} ${arch2Data.icon || ''}</h4>`;
    comparisonHTML += `<p><strong>Essence:</strong> ${arch2Data.essence || 'N/A'}</p>`;
    comparisonHTML += `<strong>Core Motivations:</strong><ul>${(arch2Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul>`;
    comparisonHTML += `<strong>Key Characteristics:</strong><ul>${(arch2Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul>`;
    comparisonHTML += `</div>`;
    comparisonHTML += `</div>`;
    area.innerHTML = comparisonHTML;
  }

  renderGlossary() {
    let html = `<h3>Kinktionary - A Glossary of Terms</h3>`;
    html += `<input type="text" id="glossary-search" placeholder="Search terms..." style="width:100%; padding:8px; margin-bottom:15px;">`;
    html += `<dl id="glossary-list">`;
    const sortedTerms = Object.keys(this.glossaryTerms).sort();
    sortedTerms.forEach(term => {
      html += `<div class="glossary-entry"><dt>${term}</dt><dd>${this.glossaryTerms[term]}</dd></div>`;
    });
    html += `</dl>`;
    this.playgroundContentEl.innerHTML = html;
    const searchInput = this.playgroundContentEl.querySelector('#glossary-search');
    if(searchInput) searchInput.addEventListener('keyup', () => this.filterGlossary());
  }

  filterGlossary() {
    const input = this.playgroundContentEl.querySelector('#glossary-search');
    if (!input) return;
    const filter = input.value.toUpperCase();
    const dl = this.playgroundContentEl.querySelector('#glossary-list');
    if(!dl) return;
    const entries = dl.getElementsByClassName('glossary-entry');
    for (let i = 0; i < entries.length; i++) {
      const dt = entries[i].getElementsByTagName("dt")[0];
      const dd = entries[i].getElementsByTagName("dd")[0];
      if (dt || dd) {
        const termText = dt.textContent || dt.innerText;
        const defText = dd.textContent || dd.innerText;
        if (termText.toUpperCase().indexOf(filter) > -1 || defText.toUpperCase().indexOf(filter) > -1) {
          entries[i].style.display = "";
        } else {
          entries[i].style.display = "none";
        }
      }
    }
  }
} // End of PlaygroundApp class
