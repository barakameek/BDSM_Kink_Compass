class PlaygroundApp {
  constructor(styleFinderAppInstance) {
    this.app = styleFinderAppInstance;
    this.playgroundContentEl = null;
    this.currentActivity = null;
    this.activities = this.defineActivities();
    this.glossaryTerms = this.defineGlossary();

    this.currentDilemma = null;
    this.currentScenario = null;
    this.currentAdventure = null;
    this.adventureStep = 0;
    this.currentDeepDiveArchetype = null;
    this.compareArchetype1 = null;
    this.compareArchetype2 = null;
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

    document.getElementById('close-playground-btn').addEventListener('click', () => this.hidePlayground());

    // --- NEW: Event Delegation for dynamically added content ---
    this.playgroundContentEl.addEventListener('click', (event) => {
        const target = event.target;
        // Ethical Dilemmas Options
        if (target.matches('.option-btn') && this.currentActivity === 'ethicalDilemmas' && this.currentDilemma) {
            const selectedIndex = parseInt(target.dataset.index);
            const feedbackEl = this.playgroundContentEl.querySelector('#dilemma-feedback'); // Query within content area
            if (feedbackEl) {
                 feedbackEl.innerHTML = `<strong>Your Choice:</strong> ${this.currentDilemma.options[selectedIndex].text}<br><strong>Insight:</strong> ${this.currentDilemma.options[selectedIndex].insight}`;
            }
            this.playgroundContentEl.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        }
        // Scenario Resolution Submit
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
        // Choose Your Adventure Options
        else if (target.matches('.adventure-options .option-btn') && this.currentActivity === 'chooseYourAdventure') {
            const nextNodeId = target.dataset.nextNode;
            if (nextNodeId) {
                this.progressAdventure(nextNodeId);
            }
        }
        // Restart Adventure
        else if (target.id === 'restart-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
            this.renderChooseYourAdventure();
        }
        // Strengths & Challenges - explore another
        else if (target.matches('#explore-another-arch-options .option-btn') && this.currentActivity === 'strengthsChallenges') {
             const archetypeName = target.dataset.archetype;
             if (archetypeName) {
                this.setDeepDiveArchetype(archetypeName);
             }
        }
    });
     // For select elements in Compare/Contrast, it's easier to attach directly after rendering them
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

  hidePlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null;
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
        this.startActivity(e.target.dataset.activityKey); // Use data-activity-key
        navEl.querySelectorAll('.playground-nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  startActivity(activityKey) {
    this.currentActivity = activityKey; // Set current activity
    const activity = this.activities[activityKey];
    if (activity && activity.renderFunction) {
      activity.renderFunction();
    } else {
      this.playgroundContentEl.innerHTML = `<p>Activity "${activityKey}" not found or has no render function.</p>`;
    }
  }
  
  getUserArchetype() {
    if (this.app.customArchetypeName && this.app.customArchetypeName.trim() !== "") {
        const knownStyle = this.app.styleDescriptions[this.app.customArchetypeName];
        const icon = knownStyle ? knownStyle.icon : '✨';
        return { name: this.app.customArchetypeName, icon: icon, isCurated: true, description: this.app.customArchetypeDescription };
    }
    if (this.app.styleFinderScores && Object.keys(this.app.styleFinderScores).length > 0) {
        const sortedResults = Object.entries(this.app.styleFinderScores).sort((a, b) => b[1] - a[1]);
        if (sortedResults.length > 0 && sortedResults[0][1] > 0) { // Check if top score is positive
            const topStyleName = sortedResults[0][0];
            const styleData = this.app.styleDescriptions[topStyleName];
            if (styleData) {
                return { name: topStyleName, icon: styleData.icon, isCurated: false, description: styleData.essence };
            }
        }
    }
    return { name: "Seeker (Complete the Oracle first!)", icon: '❓', isCurated: false, description: "Your archetype is yet to be revealed or curated. Please complete the Oracle quiz." };
  }


  defineActivities() { // Structure remains, render functions will change
    return {
      ethicalDilemmas: { title: "Ethical Echoes", renderFunction: () => this.renderEthicalDilemmas(), data: [ /* ... dilemmas ... */
          { id: 'dilemma1', scenario: "Your submissive, deeply in subspace, is approaching a previously discussed soft limit for pain. They appear ecstatic and non-verbally signal for more. As their Dominant, you:", options: [ { text: "Cease immediately, respecting the pre-agreed soft limit above all.", insight: "Prioritizes explicit prior consent. Good for building trust, but may miss an opportunity for transcendence if the submissive genuinely desires more and signals are clear." }, { text: "Verbally check in clearly and calmly ('Are you sure you want more? You're near your limit.') before considering proceeding.", insight: "Excellent practice. Combines respect for limits with responsiveness to in-the-moment desires. Requires good communication from the sub." }, { text: "Trust their non-verbal cues and ecstatic state, pushing slightly past the soft limit but remaining vigilant for any change.", insight: "Risky. Relies heavily on accurate interpretation of non-verbal cues during intense states. Only for very experienced, attuned partners with robust non-verbal communication." }, { text: "Remind them of the soft limit and suggest exploring that edge more next time after discussion.", insight: "Safe and respectful of boundaries, allows for future exploration with explicit consent." } ], archetypeNotes: "A Nurturer or Protector might lean towards stopping or clear verbal check-in. A Sadist experienced with their Masochist might be more attuned to non-verbal cues but must always prioritize safety." },
          { id: 'dilemma2', scenario: "As a Brat, you've successfully annoyed your Dominant to the point where they seem genuinely frustrated, not playfully stern. You sense the dynamic is shifting away from fun. You:", options: [ { text: "Immediately drop the bratty persona, apologize sincerely, and ask how you can make amends.", insight: "Shows self-awareness and prioritizes the relationship over the game. Often the best course when genuine frustration is detected." }, { text: "Push one last witty comment, hoping to lighten the mood back to playful, then gauge their reaction.", insight: "High risk. Could escalate frustration or, rarely, might just work if the Dominant has a very specific sense of humor for it. Generally not advised." }, { text: "Quietly withdraw and become very compliant, hoping they'll notice and the mood will shift.", insight: "Passive approach. Might work, but doesn't address the shift directly. The Dominant might not understand the change." }, { text: "Use a pre-agreed 'yellow' or 'code word' to signal you sense things are off and want to check in outside the bratty frame.", insight: "Excellent use of communication tools to navigate tricky moments and recalibrate." } ], archetypeNotes: "An experienced Brat values the dynamic's health. Knowing when to pull back is a skill. A less experienced one might misjudge the line." }
      ]},
      scenarioResolutions: { title: "Scenario Sparks", renderFunction: () => this.renderScenarioResolutions(), data: [ /* ... scenarios ... */
          { id: 'scenario1', prompt: "You are a [UserArchetype]. During a scene, your partner unexpectedly introduces a new kink/activity you haven't discussed and about which you feel hesitant. How do you respond?", considerations: "Think about your archetype's communication style, comfort with spontaneity vs. structure, and how they assert boundaries." },
          { id: 'scenario2', prompt: "You are a Dominant [UserArchetype]. Your submissive completes a difficult task you set perfectly, showing great effort and devotion. How do you acknowledge this achievement?", considerations: "Consider your archetype's approach to praise, reward, and maintaining their persona (e.g., a Strict Dom might praise differently than a Nurturing Daddy)." }
      ]},
      chooseYourAdventure: { title: "Adventure Paths", renderFunction: () => this.renderChooseYourAdventure(), story: { /* ... story data ... */
            id: 'adventure1', title: "The Mysterious Invitation", startNode: 'node1',
            nodes: {
                node1: { text: "You, a [UserArchetype], receive a cryptic invitation to an exclusive, underground kink event. The details are vague, promising 'unparalleled experiences'. Do you:", options: [ { text: "Investigate thoroughly, seeking reviews or contacts who know of it.",nextNode: 'node2_cautious' }, { text: "Attend with an open mind but clear boundaries and a safety plan.", nextNode: 'node2_prepared' }, { text: "Dive in headfirst, embracing the unknown and the thrill of spontaneity.", nextNode: 'node2_bold' } ] },
                node2_cautious: { text: "Your research reveals the event is run by a controversial group known for pushing boundaries, sometimes unsafely. You decide to skip it, prioritizing your well-being. (End of this path - Prudence is a virtue!)", options: [] },
                node2_prepared: { text: "You arrive. The atmosphere is intense. A masked figure approaches, offering you a drink and a private 'initiation'. Do you:", options: [ { text: "Politely decline the drink and the private initiation, preferring to observe first.", nextNode: 'node3_observe' }, { text: "Accept the drink but decline the private initiation for now.", nextNode: 'node3_drink' }, ] },
                node2_bold: { text: "You plunge into the heart of the event. Music thumps, scenes unfold. It's overwhelming but exhilarating. A dominant figure singles you out, demanding you kneel. Do you:", options: [ { text: "Comply immediately, eager to see where this leads.", nextNode: 'node3_comply' }, { text: "Playfully challenge their authority, testing their reaction.", nextNode: 'node3_challenge_bold' }, ] },
                node3_observe: { text: "Observing, you identify potential risks and decide to enjoy the event from a safe distance, networking carefully. (End of this path - Wisdom in observation!)", options: [] },
                node3_drink: { text: "The drink tastes odd. You feel dizzy. You wisely decide to leave with your pre-arranged buddy. (End of this path - Safety first!)", options: [] },
                node3_comply: { text: "Kneeling, you enter a powerful scene that respects your limits. (End of this path - A rewarding encounter!)", options: [] },
                node3_challenge_bold: { text: "Your challenge is met with unexpected aggression. You use your safe word and exit. (End of this path - Boundaries asserted!)", options: [] },
            }
      }},
      consentWorkshop: { title: "Consent & Limits", renderFunction: () => this.renderConsentWorkshop(), sections: [ /* ... sections ... */
            { title: "Understanding Consent (FRIES)", content: "Consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific. It's an ongoing conversation, not a one-time contract. 'Maybe' or silence is NOT consent." },
            { title: "Defining Limits", content: "Hard limits are non-negotiable boundaries. Soft limits are things one might be hesitant about but potentially willing to explore under specific conditions or with a trusted partner. Discuss these BEFORE play." },
            { title: "Negotiation", content: "Talk about desires, limits, expectations, safe words, and aftercare needs. This isn't just for new partners; ongoing check-ins are vital. How might your [UserArchetype] approach negotiation?" },
            { title: "Safe Words", content: "Green (all good/more), Yellow (caution/slow down/check in), Red (STOP immediately, scene ends, no questions). Ensure everyone involved knows and respects them." },
            { title: "Aftercare", content: "The process of emotional and physical care after a scene. Needs vary widely (cuddles, water, snacks, debriefing, quiet time). Discuss what works for you and your partner(s)." }
      ]},
      strengthsChallenges: { title: "Archetype Reflection", renderFunction: () => this.renderStrengthsChallenges() },
      compareContrast: { title: "Compare Styles", renderFunction: () => this.renderCompareContrast() },
      glossary: { title: "Kinktionary", renderFunction: () => this.renderGlossary() }
    };
  }

  defineGlossary() { /* ... Full glossary ... */
    return {
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.", "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.", "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.", "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.", "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).", "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.", "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.", "Kink": "Unconventional sexual preferences or practices.", "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.", "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.", "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).", "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.", "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.", "Role-play": "Adopting specific characters or scenarios within a BDSM context.", "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow).", "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.", "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.", "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.", "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.", "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.", "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.", "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant."
    };
  }

  renderEthicalDilemmas() {
    const userArch = this.getUserArchetype();
    this.playgroundContentEl.innerHTML = `
      <h3>Ethical Echoes <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>
      <div id="dilemma-area"></div>
      <button id="next-dilemma-btn" class="playground-action-btn">Next Dilemma</button>
    `;
    this.loadRandomDilemma();
    // Event listener for next dilemma is now part of the main delegated listener
    // We need a way to identify this specific button if we add more buttons at this level.
    // For now, assuming only one such button. If more, add specific IDs or data-attributes.
    const nextDilemmaBtn = this.playgroundContentEl.querySelector('#next-dilemma-btn');
    if(nextDilemmaBtn) nextDilemmaBtn.addEventListener('click', () => this.loadRandomDilemma());
  }

  loadRandomDilemma() { /* ... (No inline onclicks in generated HTML) ... */
    const dilemmaArea = this.playgroundContentEl.querySelector('#dilemma-area'); // Query within content area
    if (!dilemmaArea) return;
    const dilemmas = this.activities.ethicalDilemmas.data;
    this.currentDilemma = dilemmas[Math.floor(Math.random() * dilemmas.length)];
    
    let html = `<p class="scenario-text">${this.currentDilemma.scenario.replace('[UserArchetype]', this.getUserArchetype().name)}</p>`;
    html += `<div class="options-list">`;
    this.currentDilemma.options.forEach((opt, index) => {
      html += `<button class="option-btn" data-index="${index}">${opt.text}</button>`; // Removed onclick
    });
    html += `</div><div id="dilemma-feedback" class="feedback-text"></div>`;
    if (this.currentDilemma.archetypeNotes) {
        html += `<p class="archetype-note-text"><em>Oracle's Musings: ${this.currentDilemma.archetypeNotes}</em></p>`;
    }
    dilemmaArea.innerHTML = html;
    // Event listeners will be handled by the main delegated listener in initializePlayground
  }

  renderScenarioResolutions() { /* ... (No inline onclicks) ... */
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

  loadRandomScenario() { /* ... (No inline onclicks) ... */
    const scenarioArea = this.playgroundContentEl.querySelector('#scenario-area');
    if (!scenarioArea) return;
    const scenarios = this.activities.scenarioResolutions.data;
    this.currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const userArch = this.getUserArchetype();

    let html = `<p class="scenario-text">${this.currentScenario.prompt.replace('[UserArchetype]', userArch.name)}</p>`;
    html += `<textarea id="scenario-response" rows="5" placeholder="How would you, as a ${userArch.name}, navigate this?"></textarea>`;
    html += `<button id="submit-scenario-response" class="playground-action-btn">Submit Reflection</button>`; // Submit button ID for delegation
    html += `<div id="scenario-feedback" class="feedback-text"></div>`;
    if (this.currentScenario.considerations) {
        html += `<p class="archetype-note-text"><em>Consider: ${this.currentScenario.considerations}</em></p>`;
    }
    scenarioArea.innerHTML = html;
  }
  
  renderChooseYourAdventure() { /* ... (No inline onclicks) ... */
    this.currentAdventure = this.activities.chooseYourAdventure.story;
    this.adventureStep = this.currentAdventure.startNode;
    this.displayAdventureNode();
  }

  displayAdventureNode() { /* ... (No inline onclicks) ... */
    const node = this.currentAdventure.nodes[this.adventureStep];
    if (!node) {
      this.playgroundContentEl.innerHTML = "<p>Adventure ended or error.</p><button id='restart-adventure-btn' class='playground-action-btn'>Restart Adventure</button>";
      return;
    }
    const userArch = this.getUserArchetype();
    let html = `<h3>${this.currentAdventure.title} <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>`;
    html += `<p class="scenario-text">${node.text.replace('[UserArchetype]', userArch.name)}</p>`;
    if (node.options && node.options.length > 0) {
      html += `<div class="options-list adventure-options">`; // Add adventure-options class for delegation
      node.options.forEach(opt => {
        html += `<button class="option-btn" data-next-node="${opt.nextNode}">${opt.text}</button>`; // Use data-attribute
      });
      html += `</div>`;
    } else {
      html += `<button id="restart-adventure-btn" class="playground-action-btn">Restart Adventure</button>`;
    }
    this.playgroundContentEl.innerHTML = html;
  }

  progressAdventure(nextNodeId) { /* Called by delegated listener */
    this.adventureStep = nextNodeId;
    this.displayAdventureNode();
  }

  renderConsentWorkshop() { /* ... (Content only, no event handlers needed here) ... */
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

  renderStrengthsChallenges() { /* ... (No inline onclicks if buttons handled by delegation) ... */
    const userArch = this.getUserArchetype();
    if (userArch.isCurated || !this.app.styleDescriptions[userArch.name]) {
        this.playgroundContentEl.innerHTML = `
            <h3>Archetype Reflection: ${userArch.name} ${userArch.icon}</h3>
            <p>Since this is your unique curated archetype (or not yet defined by the Oracle), reflect on what you perceive as its inherent strengths and potential challenges based on your self-understanding and the elements you've chosen.</p>
            <textarea rows="5" placeholder="My strengths as a ${userArch.name} include..." style="width:100%; margin-bottom:10px;"></textarea>
            <textarea rows="5" placeholder="Potential challenges I might face or create as a ${userArch.name} are..." style="width:100%;"></textarea>
        `;
        return;
    }

    this.currentDeepDiveArchetype = userArch.name;
    const archData = this.app.styleDescriptions[this.currentDeepDiveArchetype];
    let html = `<h3>Strengths & Challenges: ${archData.title} ${archData.icon}</h3>`;
    html += `<div class="reflection-columns">`;
    html += `<div class="reflection-column"><h4>Potential Strengths:</h4><ul>`;
    (archData.strengthsInDynamic || []).forEach(item => { html += `<li>${item}</li>`; });
    html += `</ul></div>`;
    html += `<div class="reflection-column"><h4>Potential Challenges:</h4><ul>`;
    (archData.potentialChallenges || []).forEach(item => { html += `<li>${item}</li>`; });
    html += `</ul></div></div>`;
    html += `<textarea id="strength-reflection" rows="4" placeholder="Which strengths resonate most with you? How do you see them in action?" style="width:100%; margin-top:10px;"></textarea>`;
    html += `<textarea id="challenge-reflection" rows="4" placeholder="Which challenges do you recognize? How might you navigate them?" style="width:100%; margin-top:10px;"></textarea>`;
    
    if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 1) {
        html += `<h4 style="margin-top:20px;">Explore another of your top archetypes:</h4><div class="options-list" id="explore-another-arch-options">`;
        this.app.topArchetypesForCuration.forEach(arch => {
            if (arch.name !== this.currentDeepDiveArchetype && this.app.styleDescriptions[arch.name]) {
                 html += `<button class="option-btn" data-archetype="${arch.name}">${this.app.styleDescriptions[arch.name].title || arch.name}</button>`;
            }
        });
        html += `</div>`;
    }
    this.playgroundContentEl.innerHTML = html;
  }
  
  setDeepDiveArchetype(archetypeName) { // Called by delegated listener
      const styleData = this.app.styleDescriptions[archetypeName];
      if(styleData){
          this.currentDeepDiveArchetype = archetypeName;
           let html = `<h3>Strengths & Challenges: ${styleData.title} ${styleData.icon}</h3>`;
           html += `<div class="reflection-columns">`;
           html += `<div class="reflection-column"><h4>Potential Strengths:</h4><ul>`;
           (styleData.strengthsInDynamic || []).forEach(item => { html += `<li>${item}</li>`; });
           html += `</ul></div>`;
           html += `<div class="reflection-column"><h4>Potential Challenges:</h4><ul>`;
           (styleData.potentialChallenges || []).forEach(item => { html += `<li>${item}</li>`; });
           html += `</ul></div></div>`;
           html += `<textarea id="strength-reflection" rows="4" placeholder="Which strengths resonate most with you? How do you see them in action?" style="width:100%; margin-top:10px;"></textarea>`;
           html += `<textarea id="challenge-reflection" rows="4" placeholder="Which challenges do you recognize? How might you navigate them?" style="width:100%; margin-top:10px;"></textarea>`;
            if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 1) {
                html += `<h4 style="margin-top:20px;">Explore another of your top archetypes:</h4><div class="options-list" id="explore-another-arch-options">`;
                this.app.topArchetypesForCuration.forEach(arch => {
                    if (arch.name !== this.currentDeepDiveArchetype && this.app.styleDescriptions[arch.name]) {
                         html += `<button class="option-btn" data-archetype="${arch.name}">${this.app.styleDescriptions[arch.name].title || arch.name}</button>`;
                    }
                });
                html += `</div>`;
            }
           this.playgroundContentEl.innerHTML = html;
      }
  }

  renderCompareContrast() { /* ... (No inline onchange in generated HTML) ... */
    let html = `<h3>Compare & Contrast Archetypes</h3>`;
    html += `<p>Select two archetypes to see their core aspects side-by-side.</p>`;
    html += `<div class="compare-selects">`;
    const allStyleNames = [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();

    html += `<select id="compare-arch1">`; // Removed onchange
    html += `<option value="">-- Select Archetype 1 --</option>`;
    allStyleNames.forEach(name => {
        const title = this.app.styleDescriptions[name] ? (this.app.styleDescriptions[name].title || name) : name;
        html += `<option value="${name}" ${this.compareArchetype1 === name ? 'selected' : ''}>${title}</option>`;
    });
    html += `</select>`;

    html += `<select id="compare-arch2">`; // Removed onchange
    html += `<option value="">-- Select Archetype 2 --</option>`;
    allStyleNames.forEach(name => {
        const title = this.app.styleDescriptions[name] ? (this.app.styleDescriptions[name].title || name) : name;
        html += `<option value="${name}" ${this.compareArchetype2 === name ? 'selected' : ''}>${title}</option>`;
    });
    html += `</select></div>`;
    html += `<div id="comparison-area" class="comparison-results"></div>`;
    this.playgroundContentEl.innerHTML = html;

    // Add event listeners for select elements
    const select1 = this.playgroundContentEl.querySelector('#compare-arch1');
    const select2 = this.playgroundContentEl.querySelector('#compare-arch2');
    if(select1) select1.addEventListener('change', (e) => { this.compareArchetype1 = e.target.value; this.displayComparison(); });
    if(select2) select2.addEventListener('change', (e) => { this.compareArchetype2 = e.target.value; this.displayComparison(); });
    
    this.displayComparison();
  }

  displayComparison() { /* ... (Logic unchanged, called by new listeners) ... */
    const area = this.playgroundContentEl.querySelector('#comparison-area'); // Query within content area
    if (!area) return;
    if (!this.compareArchetype1 || !this.compareArchetype2) {
      area.innerHTML = "<p>Please select two archetypes to compare.</p>";
      return;
    }
    if (this.compareArchetype1 === this.compareArchetype2) {
      area.innerHTML = "<p>Please select two <em>different</em> archetypes to compare.</p>";
      return;
    }

    const arch1Data = this.app.styleDescriptions[this.compareArchetype1];
    const arch2Data = this.app.styleDescriptions[this.compareArchetype2];

    if (!arch1Data || !arch2Data) {
      area.innerHTML = "<p>Information for one or both selected archetypes is unavailable.</p>";
      return;
    }
    
    let comparisonHTML = `<div class="compare-columns">`;
    comparisonHTML += `<div class="compare-column"><h4>${arch1Data.title || this.compareArchetype1} ${arch1Data.icon || ''}</h4>`;
    comparisonHTML += `<p><strong>Essence:</strong> ${arch1Data.essence || 'N/A'}</p>`;
    comparisonHTML += `<strong>Motivations:</strong><ul>${(arch1Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul>`;
    comparisonHTML += `<strong>Characteristics:</strong><ul>${(arch1Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul>`;
    comparisonHTML += `</div>`;
    
    comparisonHTML += `<div class="compare-column"><h4>${arch2Data.title || this.compareArchetype2} ${arch2Data.icon || ''}</h4>`;
    comparisonHTML += `<p><strong>Essence:</strong> ${arch2Data.essence || 'N/A'}</p>`;
    comparisonHTML += `<strong>Motivations:</strong><ul>${(arch2Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul>`;
    comparisonHTML += `<strong>Characteristics:</strong><ul>${(arch2Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul>`;
    comparisonHTML += `</div>`;
    comparisonHTML += `</div>`;
    area.innerHTML = comparisonHTML;
  }

  renderGlossary() { /* ... (No inline onkeyup) ... */
    let html = `<h3>Kinktionary - A Glossary of Terms</h3>`;
    html += `<input type="text" id="glossary-search" placeholder="Search terms..." style="width:100%; padding:8px; margin-bottom:15px;">`;
    html += `<dl id="glossary-list">`;
    const sortedTerms = Object.keys(this.glossaryTerms).sort();
    sortedTerms.forEach(term => {
      html += `<div class="glossary-entry"><dt>${term}</dt><dd>${this.glossaryTerms[term]}</dd></div>`;
    });
    html += `</dl>`;
    this.playgroundContentEl.innerHTML = html;

    // Add event listener for search
    const searchInput = this.playgroundContentEl.querySelector('#glossary-search');
    if(searchInput) searchInput.addEventListener('keyup', () => this.filterGlossary());
  }

  filterGlossary() { /* ... (Logic unchanged, called by new listener) ... */
    const input = this.playgroundContentEl.querySelector('#glossary-search'); // Query within content area
    const filter = input.value.toUpperCase();
    const dl = this.playgroundContentEl.querySelector('#glossary-list'); // Query within content area
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
