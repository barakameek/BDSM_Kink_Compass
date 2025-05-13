class PlaygroundApp {
  constructor(styleFinderAppInstance) {
    this.app = styleFinderAppInstance; // Reference to the main app for user's archetype
    this.playgroundContentEl = null; // Will be set when playground is shown
    this.currentActivity = null; // e.g., 'ethicalDilemmas', 'scenarios'
    this.activities = this.defineActivities();
    this.glossaryTerms = this.defineGlossary();

    // Activity-specific state
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

    // Ensure playground is hidden initially
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
  }
  
  showPlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer'); // Assuming this ID in HTML
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'block';
        // Potentially scroll to it or focus
        mainPlaygroundContainer.scrollIntoView({ behavior: 'smooth' });
        // If it's the first time or no activity selected, show welcome
        if (!this.currentActivity && this.playgroundContentEl) {
             this.playgroundContentEl.innerHTML = `<p class="playground-welcome-message">Select an activity from the menu to begin.</p>`;
        }
    }
    // Call from main app: styleFinderApp.elements.styleFinder.style.display = 'none'; // Hide quiz modal
  }

  hidePlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null; // Reset current activity when hiding
    // Potentially show the main app button again or quiz results if that was the flow
  }


  populateNav() {
    const navEl = document.getElementById('playground-nav');
    if (!navEl) return;
    let navHtml = '<ul>';
    for (const key in this.activities) {
      navHtml += `<li><button class="playground-nav-btn" data-activity="${key}">${this.activities[key].title}</button></li>`;
    }
    navHtml += '</ul>';
    navEl.innerHTML = navHtml;

    navEl.querySelectorAll('.playground-nav-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        this.startActivity(e.target.dataset.activity);
        // Active state for nav button
        navEl.querySelectorAll('.playground-nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  startActivity(activityKey) {
    this.currentActivity = activityKey;
    const activity = this.activities[activityKey];
    if (activity && activity.renderFunction) {
      activity.renderFunction();
    } else {
      this.playgroundContentEl.innerHTML = `<p>Activity "${activityKey}" not found or has no render function.</p>`;
    }
  }
  
  getUserArchetype() {
    // First, check if a curated archetype exists and is named
    if (this.app.customArchetypeName && this.app.customArchetypeName.trim() !== "") {
        // Find if the curated name matches any known style for icon, or use a default
        const knownStyle = this.app.styleDescriptions[this.app.customArchetypeName];
        const icon = knownStyle ? knownStyle.icon : '✨';
        return { name: this.app.customArchetypeName, icon: icon, isCurated: true, description: this.app.customArchetypeDescription };
    }
    // Fallback to primary quiz result
    if (this.app.styleFinderScores && Object.keys(this.app.styleFinderScores).length > 0) {
        const sortedResults = Object.entries(this.app.styleFinderScores).sort((a, b) => b[1] - a[1]);
        if (sortedResults.length > 0) {
            const topStyleName = sortedResults[0][0];
            const styleData = this.app.styleDescriptions[topStyleName];
            if (styleData) {
                return { name: topStyleName, icon: styleData.icon, isCurated: false, description: styleData.essence };
            }
        }
    }
    return { name: "Seeker (Complete the Oracle first!)", icon: '❓', isCurated: false, description: "Your archetype is yet to be revealed or curated." };
  }


  defineActivities() {
    return {
      ethicalDilemmas: {
        title: "Ethical Echoes",
        renderFunction: () => this.renderEthicalDilemmas(),
        data: [
          { 
            id: 'dilemma1', 
            scenario: "Your submissive, deeply in subspace, is approaching a previously discussed soft limit for pain. They appear ecstatic and non-verbally signal for more. As their Dominant, you:",
            options: [
              { text: "Cease immediately, respecting the pre-agreed soft limit above all.", insight: "Prioritizes explicit prior consent. Good for building trust, but may miss an opportunity for transcendence if the submissive genuinely desires more and signals are clear." },
              { text: "Verbally check in clearly and calmly ('Are you sure you want more? You're near your limit.') before considering proceeding.", insight: "Excellent practice. Combines respect for limits with responsiveness to in-the-moment desires. Requires good communication from the sub." },
              { text: "Trust their non-verbal cues and ecstatic state, pushing slightly past the soft limit but remaining vigilant for any change.", insight: "Risky. Relies heavily on accurate interpretation of non-verbal cues during intense states. Only for very experienced, attuned partners with robust non-verbal communication." },
              { text: "Remind them of the soft limit and suggest exploring that edge more next time after discussion.", insight: "Safe and respectful of boundaries, allows for future exploration with explicit consent." }
            ],
            archetypeNotes: "A Nurturer or Protector might lean towards stopping or clear verbal check-in. A Sadist experienced with their Masochist might be more attuned to non-verbal cues but must always prioritize safety."
          },
          {
            id: 'dilemma2',
            scenario: "As a Brat, you've successfully annoyed your Dominant to the point where they seem genuinely frustrated, not playfully stern. You sense the dynamic is shifting away from fun. You:",
            options: [
                { text: "Immediately drop the bratty persona, apologize sincerely, and ask how you can make amends.", insight: "Shows self-awareness and prioritizes the relationship over the game. Often the best course when genuine frustration is detected." },
                { text: "Push one last witty comment, hoping to lighten the mood back to playful, then gauge their reaction.", insight: "High risk. Could escalate frustration or, rarely, might just work if the Dominant has a very specific sense of humor for it. Generally not advised." },
                { text: "Quietly withdraw and become very compliant, hoping they'll notice and the mood will shift.", insight: "Passive approach. Might work, but doesn't address the shift directly. The Dominant might not understand the change." },
                { text: "Use a pre-agreed 'yellow' or 'code word' to signal you sense things are off and want to check in outside the bratty frame.", insight: "Excellent use of communication tools to navigate tricky moments and recalibrate." }
            ],
            archetypeNotes: "An experienced Brat values the dynamic's health. Knowing when to pull back is a skill. A less experienced one might misjudge the line."
          },
          // Add more dilemmas
        ]
      },
      scenarioResolutions: {
        title: "Scenario Sparks",
        renderFunction: () => this.renderScenarioResolutions(),
        data: [
          { 
            id: 'scenario1', 
            prompt: "You are a [UserArchetype]. During a scene, your partner unexpectedly introduces a new kink/activity you haven't discussed and about which you feel hesitant. How do you respond?",
            considerations: "Think about your archetype's communication style, comfort with spontaneity vs. structure, and how they assert boundaries."
          },
          {
            id: 'scenario2',
            prompt: "You are a Dominant [UserArchetype]. Your submissive completes a difficult task you set perfectly, showing great effort and devotion. How do you acknowledge this achievement?",
            considerations: "Consider your archetype's approach to praise, reward, and maintaining their persona (e.g., a Strict Dom might praise differently than a Nurturing Daddy)."
          }
          // Add more scenarios
        ]
      },
      chooseYourAdventure: {
        title: "Adventure Paths",
        renderFunction: () => this.renderChooseYourAdventure(),
        story: { // Example very simple story
            id: 'adventure1',
            title: "The Mysterious Invitation",
            startNode: 'node1',
            nodes: {
                node1: {
                    text: "You, a [UserArchetype], receive a cryptic invitation to an exclusive, underground kink event. The details are vague, promising 'unparalleled experiences'. Do you:",
                    options: [
                        { text: "Investigate thoroughly, seeking reviews or contacts who know of it.",nextNode: 'node2_ cautious' },
                        { text: "Attend with an open mind but clear boundaries and a safety plan.", nextNode: 'node2_prepared' },
                        { text: "Dive in headfirst, embracing the unknown and the thrill of spontaneity.", nextNode: 'node2_bold' }
                    ]
                },
                node2_cautious: {
                    text: "Your research reveals the event is run by a controversial group known for pushing boundaries, sometimes unsafely. You decide to skip it, prioritizing your well-being. (End of this path - Prudence is a virtue!)",
                    options: []
                },
                node2_prepared: {
                    text: "You arrive. The atmosphere is intense. A masked figure approaches, offering you a drink and a private 'initiation'. Do you:",
                    options: [
                        { text: "Politely decline the drink and the private initiation, preferring to observe first.", nextNode: 'node3_observe' },
                        { text: "Accept the drink but decline the private initiation for now.", nextNode: 'node3_drink' },
                    ]
                },
                node2_bold: {
                    text: "You plunge into the heart of the event. Music thumps, scenes unfold. It's overwhelming but exhilarating. A dominant figure singles you out, demanding you kneel. Do you:",
                    options: [
                        { text: "Comply immediately, eager to see where this leads.", nextNode: 'node3_comply' },
                        { text: "Playfully challenge their authority, testing their reaction.", nextNode: 'node3_challenge_bold' },
                    ]
                },
                // ... more nodes to build out a simple branching story
                node3_observe: { text: "Observing, you identify potential risks and decide to enjoy the event from a safe distance, networking carefully. (End of this path - Wisdom in observation!)", options: [] },
                node3_drink: { text: "The drink tastes odd. You feel dizzy. You wisely decide to leave with your pre-arranged buddy. (End of this path - Safety first!)", options: [] },
                node3_comply: { text: "Kneeling, you enter a powerful scene that respects your limits. (End of this path - A rewarding encounter!)", options: [] },
                node3_challenge_bold: { text: "Your challenge is met with unexpected aggression. You use your safe word and exit. (End of this path - Boundaries asserted!)", options: [] },
            }
        }
      },
      consentWorkshop: {
        title: "Consent & Limits",
        renderFunction: () => this.renderConsentWorkshop(),
        sections: [
            { title: "Understanding Consent (FRIES)", content: "Consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific. It's an ongoing conversation, not a one-time contract. 'Maybe' or silence is NOT consent." },
            { title: "Defining Limits", content: "Hard limits are non-negotiable boundaries. Soft limits are things one might be hesitant about but potentially willing to explore under specific conditions or with a trusted partner. Discuss these BEFORE play." },
            { title: "Negotiation", content: "Talk about desires, limits, expectations, safe words, and aftercare needs. This isn't just for new partners; ongoing check-ins are vital. How might your [UserArchetype] approach negotiation?" },
            { title: "Safe Words", content: "Green (all good/more), Yellow (caution/slow down/check in), Red (STOP immediately, scene ends, no questions). Ensure everyone involved knows and respects them." },
            { title: "Aftercare", content: "The process of emotional and physical care after a scene. Needs vary widely (cuddles, water, snacks, debriefing, quiet time). Discuss what works for you and your partner(s)." }
        ]
      },
      strengthsChallenges: {
        title: "Archetype Reflection",
        renderFunction: () => this.renderStrengthsChallenges()
      },
      compareContrast: {
        title: "Compare Styles",
        renderFunction: () => this.renderCompareContrast()
      },
      glossary: {
        title: "Kinktionary",
        renderFunction: () => this.renderGlossary()
      }
    };
  }

  defineGlossary() {
    return {
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.",
        "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.",
        "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.",
        "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.",
        "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).",
        "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.",
        "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.",
        "Kink": "Unconventional sexual preferences or practices.",
        "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.",
        "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.",
        "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).",
        "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.",
        "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.",
        "Role-play": "Adopting specific characters or scenarios within a BDSM context.",
        "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow).",
        "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.",
        "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.",
        "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.",
        "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.",
        "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.",
        "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.",
        "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant.",
        // Add many more terms
    };
  }

  // --- Render functions for each activity ---

  renderEthicalDilemmas() {
    const userArch = this.getUserArchetype();
    this.playgroundContentEl.innerHTML = `
      <h3>Ethical Echoes <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>
      <div id="dilemma-area"></div>
      <button id="next-dilemma-btn" class="playground-action-btn">Next Dilemma</button>
    `;
    this.loadRandomDilemma();
    document.getElementById('next-dilemma-btn').addEventListener('click', () => this.loadRandomDilemma());
  }

  loadRandomDilemma() {
    const dilemmaArea = document.getElementById('dilemma-area');
    if (!dilemmaArea) return;
    const dilemmas = this.activities.ethicalDilemmas.data;
    this.currentDilemma = dilemmas[Math.floor(Math.random() * dilemmas.length)];
    
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

    dilemmaArea.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIndex = parseInt(e.target.dataset.index);
        const feedbackEl = document.getElementById('dilemma-feedback');
        feedbackEl.innerHTML = `<strong>Your Choice:</strong> ${this.currentDilemma.options[selectedIndex].text}<br><strong>Insight:</strong> ${this.currentDilemma.options[selectedIndex].insight}`;
        dilemmaArea.querySelectorAll('.option-btn').forEach(b => b.disabled = true); // Disable after choice
      });
    });
  }

  renderScenarioResolutions() {
    const userArch = this.getUserArchetype();
    this.playgroundContentEl.innerHTML = `
      <h3>Scenario Sparks <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>
      <div id="scenario-area"></div>
      <button id="next-scenario-btn" class="playground-action-btn">Next Scenario</button>
    `;
    this.loadRandomScenario();
    document.getElementById('next-scenario-btn').addEventListener('click', () => this.loadRandomScenario());
  }

  loadRandomScenario() {
    const scenarioArea = document.getElementById('scenario-area');
    if (!scenarioArea) return;
    const scenarios = this.activities.scenarioResolutions.data;
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

    document.getElementById('submit-scenario-response').addEventListener('click', () => {
        const response = document.getElementById('scenario-response').value;
        const feedbackEl = document.getElementById('scenario-feedback');
        if (response.trim()) {
            feedbackEl.innerHTML = "Thank you for your reflection! Considering different approaches helps deepen understanding.";
            // In a more complex app, this response could be saved or analyzed.
        } else {
            feedbackEl.innerHTML = "Please write your thoughts before submitting.";
        }
    });
  }
  
  renderChooseYourAdventure() {
    this.currentAdventure = this.activities.chooseYourAdventure.story;
    this.adventureStep = this.currentAdventure.startNode;
    this.displayAdventureNode();
  }

  displayAdventureNode() {
    const node = this.currentAdventure.nodes[this.adventureStep];
    if (!node) {
      this.playgroundContentEl.innerHTML = "<p>Adventure ended or error.</p>";
      return;
    }
    const userArch = this.getUserArchetype();
    let html = `<h3>${this.currentAdventure.title} <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>`;
    html += `<p class="scenario-text">${node.text.replace('[UserArchetype]', userArch.name)}</p>`;
    if (node.options && node.options.length > 0) {
      html += `<div class="options-list adventure-options">`;
      node.options.forEach(opt => {
        html += `<button class="option-btn" onclick="playgroundApp.progressAdventure('${opt.nextNode}')">${opt.text}</button>`;
      });
      html += `</div>`;
    } else {
      html += `<button class="playground-action-btn" onclick="playgroundApp.renderChooseYourAdventure()">Restart Adventure</button>`;
    }
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
    // If it's a curated archetype, we don't have pre-defined S&C.
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
    
    // Option to explore another of their top archetypes
    if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 1) {
        html += `<h4 style="margin-top:20px;">Explore another of your top archetypes:</h4><div class="options-list">`;
        this.app.topArchetypesForCuration.forEach(arch => {
            if (arch.name !== this.currentDeepDiveArchetype && this.app.styleDescriptions[arch.name]) {
                 html += `<button class="option-btn" onclick="playgroundApp.setDeepDiveArchetype('${arch.name}')">${this.app.styleDescriptions[arch.name].title || arch.name}</button>`;
            }
        });
        html += `</div>`;
    }
    this.playgroundContentEl.innerHTML = html;
  }
  
  setDeepDiveArchetype(archetypeName) {
      // This method is a bit of a hack for now. We'd ideally store the chosen archetype for deep dive
      // and re-render. For simplicity, we'll just reconstruct the userArch object.
      const styleData = this.app.styleDescriptions[archetypeName];
      if(styleData){
          const tempUserArch = { name: archetypeName, icon: styleData.icon, isCurated: false, description: styleData.essence };
          this.currentDeepDiveArchetype = archetypeName; // Update the state
          // Now re-render specifically for this archetype (conceptually)
          // This is a simplified re-render for this example.
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
                html += `<h4 style="margin-top:20px;">Explore another of your top archetypes:</h4><div class="options-list">`;
                this.app.topArchetypesForCuration.forEach(arch => {
                    if (arch.name !== this.currentDeepDiveArchetype && this.app.styleDescriptions[arch.name]) {
                         html += `<button class="option-btn" onclick="playgroundApp.setDeepDiveArchetype('${arch.name}')">${this.app.styleDescriptions[arch.name].title || arch.name}</button>`;
                    }
                });
                html += `</div>`;
            }
           this.playgroundContentEl.innerHTML = html;

      }
  }


  renderCompareContrast() {
    let html = `<h3>Compare & Contrast Archetypes</h3>`;
    html += `<p>Select two archetypes to see their core aspects side-by-side.</p>`;
    html += `<div class="compare-selects">`;
    const allStyleNames = [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();

    html += `<select id="compare-arch1" onchange="playgroundApp.compareArchetype1 = this.value; playgroundApp.displayComparison();">`;
    html += `<option value="">-- Select Archetype 1 --</option>`;
    allStyleNames.forEach(name => {
        const title = this.app.styleDescriptions[name] ? (this.app.styleDescriptions[name].title || name) : name;
        html += `<option value="${name}" ${this.compareArchetype1 === name ? 'selected' : ''}>${title}</option>`;
    });
    html += `</select>`;

    html += `<select id="compare-arch2" onchange="playgroundApp.compareArchetype2 = this.value; playgroundApp.displayComparison();">`;
    html += `<option value="">-- Select Archetype 2 --</option>`;
    allStyleNames.forEach(name => {
        const title = this.app.styleDescriptions[name] ? (this.app.styleDescriptions[name].title || name) : name;
        html += `<option value="${name}" ${this.compareArchetype2 === name ? 'selected' : ''}>${title}</option>`;
    });
    html += `</select></div>`;
    html += `<div id="comparison-area" class="comparison-results"></div>`;
    this.playgroundContentEl.innerHTML = html;
    this.displayComparison(); // Initial display if archetypes are pre-selected
  }

  displayComparison() {
    const area = document.getElementById('comparison-area');
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
    comparisonHTML += `<p><strong>Motivations:</strong><ul>${(arch1Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul></p>`;
    comparisonHTML += `<p><strong>Characteristics:</strong><ul>${(arch1Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul></p>`;
    comparisonHTML += `</div>`;
    
    comparisonHTML += `<div class="compare-column"><h4>${arch2Data.title || this.compareArchetype2} ${arch2Data.icon || ''}</h4>`;
    comparisonHTML += `<p><strong>Essence:</strong> ${arch2Data.essence || 'N/A'}</p>`;
    comparisonHTML += `<p><strong>Motivations:</strong><ul>${(arch2Data.coreMotivations || ['N/A']).map(m=>`<li>${m}</li>`).join('')}</ul></p>`;
    comparisonHTML += `<p><strong>Characteristics:</strong><ul>${(arch2Data.keyCharacteristics || ['N/A']).map(k=>`<li>${k}</li>`).join('')}</ul></p>`;
    comparisonHTML += `</div>`;
    comparisonHTML += `</div>`;
    area.innerHTML = comparisonHTML;
  }

  renderGlossary() {
    let html = `<h3>Kinktionary - A Glossary of Terms</h3>`;
    html += `<input type="text" id="glossary-search" placeholder="Search terms..." onkeyup="playgroundApp.filterGlossary()" style="width:100%; padding:8px; margin-bottom:15px;">`;
    html += `<dl id="glossary-list">`;
    const sortedTerms = Object.keys(this.glossaryTerms).sort();
    sortedTerms.forEach(term => {
      html += `<div class="glossary-entry"><dt>${term}</dt><dd>${this.glossaryTerms[term]}</dd></div>`;
    });
    html += `</dl>`;
    this.playgroundContentEl.innerHTML = html;
  }

  filterGlossary() {
    const input = document.getElementById('glossary-search');
    const filter = input.value.toUpperCase();
    const dl = document.getElementById('glossary-list');
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

// Global instance of PlaygroundApp - might be better to instantiate when needed
// For now, it's created but needs to be shown/hidden by the main app.
// const playgroundApp = new PlaygroundApp(styleFinderApp); // styleFinderApp must be globally accessible here.
// This line needs to be moved into styleFinderApp or called after both are defined.
