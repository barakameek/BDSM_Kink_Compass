class PlaygroundApp {
  constructor(styleFinderAppInstance) {
    this.app = styleFinderAppInstance;
    this.playgroundContentEl = null;
    this.currentActivity = null;
    
    // Activity-specific state
    this.selectedDilemmaArchetype = 'general'; // Default to general
    this.currentDilemma = null;
    this.currentScenario = null; // For Scenario Sparks
    this.currentAdventure = null; // Holds the currently active adventure story object
    this.adventureStep = null;    // Holds the current node ID within the active adventure
    this.currentDeepDiveArchetype = null;
    this.compareArchetype1 = null;
    this.compareArchetype2 = null;

    this.activities = this.defineActivities(); // Must be after all properties it might use
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

    document.getElementById('close-playground-btn').addEventListener('click', () => this.hidePlayground());

    this.playgroundContentEl.addEventListener('click', (event) => {
        const target = event.target;
        // Ethical Dilemmas Options
        if (target.matches('.option-btn') && this.currentActivity === 'ethicalDilemmas' && this.currentDilemma) {
            const selectedIndex = parseInt(target.dataset.index);
            const feedbackEl = this.playgroundContentEl.querySelector('#dilemma-feedback');
            if (feedbackEl && this.currentDilemma.options[selectedIndex]) {
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
        // Choose Your Own Adventure Options
        else if (target.matches('.adventure-options .option-btn') && this.currentActivity === 'chooseYourAdventure') {
            const nextNodeId = target.dataset.nextNode;
            if (nextNodeId) {
                this.progressAdventure(nextNodeId);
            }
        }
        // Restart Adventure button (if it has this ID)
        else if (target.id === 'restart-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
            this.startSelectedAdventure(this.currentAdventure.id); // Restart current adventure
        }
        // Strengths & Challenges - explore another
        else if (target.matches('#explore-another-arch-options .option-btn') && this.currentActivity === 'strengthsChallenges') {
             const archetypeName = target.dataset.archetype;
             if (archetypeName) {
                this.setDeepDiveArchetype(archetypeName);
             }
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

  hidePlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null;
    if (this.app && typeof this.app.showQuizModalAtLastStep === 'function') {
        this.app.showQuizModalAtLastStep();
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
    if (activity && activity.renderFunction) {
      // Reset specific states for some activities when they are started
      if (activityKey === 'ethicalDilemmas') this.selectedDilemmaArchetype = 'general';
      if (activityKey === 'chooseYourAdventure') { this.currentAdventure = null; this.adventureStep = null; }
      if (activityKey === 'compareContrast') {this.compareArchetype1 = null; this.compareArchetype2 = null;}

      activity.renderFunction();
    } else {
      this.playgroundContentEl.innerHTML = `<p>Activity "${activityKey}" not found or has no render function.</p>`;
    }
  }
  
  getUserArchetype() {
    // Check if a primary quiz result exists and is valid
    if (this.app && this.app.styleFinderScores && Object.keys(this.app.styleFinderScores).length > 0) {
        const sortedResults = Object.entries(this.app.styleFinderScores).sort((a, b) => b[1] - a[1]);
        if (sortedResults.length > 0 && sortedResults[0][1] > 0) {
            const topStyleName = sortedResults[0][0];
            const styleData = this.app.styleDescriptions[topStyleName];
            if (styleData) {
                 // Now check if a curated archetype exists and should override for display
                if (this.app.customArchetypeName && this.app.customArchetypeName.trim() !== "") {
                    const curatedKnownStyle = this.app.styleDescriptions[this.app.customArchetypeName]; // Check if custom name is a known style
                    const icon = curatedKnownStyle ? curatedKnownStyle.icon : (styleData.icon || '✨'); // Use primary's icon if custom isn't known, else default
                    return { name: this.app.customArchetypeName, icon: icon, isCurated: true, description: this.app.customArchetypeDescription };
                }
                // Fallback to primary quiz result if no curated name
                return { name: topStyleName, icon: styleData.icon, isCurated: false, description: styleData.essence };
            }
        }
    }
    // Default if no quiz result or curated result
    return { name: "Seeker", icon: '❓', isCurated: false, description: "Your archetype is yet to be revealed. Please complete the Oracle quiz first for personalized Playground activities." };
  }

  defineActivities() {
    return {
      ethicalDilemmas: {
        title: "Ethical Echoes",
        renderFunction: () => this.renderEthicalDilemmasHome(),
        data: { // Keys are Archetype names (exact match from styleFinderApp.styleDescriptions)
            // --- SUBMISSIVE ARCHETYPE DILEMMAS ---
            "Brat": [
                { id: 'bratD1', scenario: "As a Brat, your Dominant sets a new rule you find particularly silly and easy to flout. Your gut reaction is to:", options: [ {text: "Immediately find a clever loophole and exploit it with a cheeky grin.", insight:"Classic Brat! This tests their Dominant's resolve and invites a playful chase."}, {text: "Complain loudly about the rule but secretly plan to obey it perfectly just to confuse them.", insight:"A more subtle form of bratting, playing with expectations."}, {text: "Pretend to misunderstand the rule repeatedly, feigning innocence.", insight:"Frustrating for some Dominants, amusing for others. Relies on the Dominant's patience."}, {text: "Obey the rule to the letter, but with exaggerated sighs and eye-rolls.", insight:"Passive-aggressive bratting, can be fun or annoying depending on the dynamic."}], archetypeNotes: "Brats thrive on playful power struggles and testing boundaries." },
                { id: 'bratD2', scenario: "You've successfully pushed your Dominant's buttons and they're about to deliver a 'funishment' you secretly don't want right now (e.g., tickling, and you're not in the mood). You:", options: [ {text: "Use your 'yellow' safe word or a pre-agreed signal to pause and communicate your discomfort.", insight:"Safest and most mature option, respecting that even funishments require ongoing consent."}, {text: "Try to brat your way out of it even harder, hoping to change their mind or escalate to a different funishment.", insight:"Risky; could lead to an unwanted experience if the Dominant misinterprets."}, {text: "Sulk and pout, making it clear you're not enjoying this specific outcome.", insight:"Communicates displeasure, but less directly than a safe word."}, {text: "Endure it silently, hoping it will be over quickly.", insight:"Not ideal, as it doesn't communicate your true feelings or limits."}], archetypeNotes: "Even Brats have limits and need clear communication tools." }
            ],
            "Little": [
                { id: 'littleD1', scenario: "As a Little, your Caregiver tells you it's bedtime, but you're in the middle of an exciting game and don't want to stop. You:", options: [ {text: "Whine 'Just five more minutes, pwease?' with big puppy-dog eyes.", insight:"A common Little tactic, appealing to the Caregiver's softer side."}, {text: "Try to hide or pretend you didn't hear them.", insight:"Playful defiance, often leading to a gentle 'search and retrieval'."}, {text: "Negotiate for one more round or a special bedtime story as a compromise.", insight:"Shows developing negotiation skills within the Little persona."}, {text: "Immediately pout and start getting ready for bed, perhaps a little sadly.", insight:"Shows obedience but also disappointment, which a good Caregiver will notice."}], archetypeNotes: "Littles often test boundaries in innocent ways, seeking affection and understanding." },
                { id: 'littleD2', scenario: "Your Caregiver gives you a new stuffie, but it's not the one you secretly hoped for. You:", options: [ {text: "Hug the new stuffie politely but look a bit sad, hoping they'll ask what's wrong.", insight:"Subtle communication of disappointment."}, {text: "Ask if you can also get the other stuffie 'next time, pwease?'", insight:"Direct but still within the Little frame."}, {text: "Hide the new stuffie and play only with your old favorites.", insight:"A more passive form of expressing preference."}, {text: "Enthusiastically thank them for the new stuffie, even if it's not your top choice, to show appreciation.", insight:"Prioritizes the Caregiver's feelings and the act of giving."}], archetypeNotes: "Littles balance their desires with pleasing their Caregiver." }
            ],
            "Masochist": [
                { id: 'masoD1', scenario: "During a scene, your Sadist is using an implement you usually love, but tonight it's hitting a spot that's causing 'bad' pain (nervey, sharp, wrong). You:", options: [ {text: "Immediately use your 'yellow' or 'red' safe word to pause or stop the specific action.", insight:"Crucial for safety. Differentiating 'good' from 'bad' pain is key."}, {text: "Try to shift your body slightly, hoping to change the impact point without stopping the scene.", insight:"Can work, but less reliable than a safe word if the pain is genuinely problematic."}, {text: "Endure it, thinking it might pass or that you don't want to disappoint your Sadist.", insight:"Dangerous. Never endure 'bad' pain; it risks injury and erodes trust."}, {text: "Make a louder pain noise than usual, hoping they'll understand it's different.", insight:"Non-verbal cues can be misinterpreted. Safe words are clearer."}], archetypeNotes: "Masochists must be empowered to communicate unsafe or 'wrong' pain." },
                { id: 'masoD2', scenario: "Your Sadist proposes a scene that pushes your known pain limits significantly further than ever before. You are intrigued but also nervous. You:", options: [ {text: "Discuss your nervousness openly, ask for more details about safety, and negotiate very specific check-ins or a 'tap out' signal for this scene.", insight:"Excellent. Negotiation and enhanced safety for limit-pushing is vital."}, {text: "Agree enthusiastically, eager to please and test your limits without voicing your nervousness.", insight:"Risky. Unvoiced fear can lead to a negative experience or inability to safe word effectively."}, {text: "Suggest a 'trial run' with a much lower intensity or shorter duration first.", insight:"A good way to explore new territory more cautiously."}, {text: "Decline this specific scene for now, but express openness to discussing it again in the future when you feel more prepared.", insight:"Respecting your own readiness is important."}], archetypeNotes: "Exploring limits requires immense trust and clear, cautious negotiation." }
            ],
            // --- DOMINANT ARCHETYPE DILEMMAS ---
            "Disciplinarian": [
                { id: 'discD1', scenario: "Your submissive, usually compliant, has repeatedly failed to follow a clearly stated rule, offering flimsy excuses. You suspect they are testing your resolve. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." },
                { id: 'discD2', scenario: "You've assigned a punishment that, in retrospect, feels a bit too harsh or disproportionate to the infraction, even if technically within agreed limits. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." }
            ],
            "Master": [
                { id: 'masterD1', scenario: "Your slave shows signs of burnout from their duties, though they haven't complained. Their usually impeccable service is slightly faltering. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." },
                { id: 'masterD2', scenario: "An outside party criticizes your M/s dynamic, misunderstanding its consensual nature. Your slave is present and looks to you. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." }
            ],
            "Nurturer": [
                { id: 'nurtD1', scenario: "Your Little is having a tantrum over a denied treat, far beyond their usual playful pouting. They seem genuinely distressed. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." },
                { id: 'nurtD2', scenario: "Your partner, who often leans on your nurturing side, seems to be avoiding discussing a serious real-life problem, retreating into a more dependent role. You:", options: [/*...*/], insight:"...", archetypeNotes:"..." }
            ]
            // ... Continue for all archetypes ...
            // For "General" dilemmas, you can pick a few that apply broadly or create a separate list.
        }
      },
      scenarioResolutions: { /* ... (same data structure as before, to be populated) ... */
        title: "Scenario Sparks",
        renderFunction: () => this.renderScenarioResolutions(),
        data: [
          { id: 'scenario1', prompt: "You are a [UserArchetype]. During a scene, your partner unexpectedly introduces a new kink/activity you haven't discussed and about which you feel hesitant. How do you respond?", considerations: "Think about your archetype's communication style, comfort with spontaneity vs. structure, and how they assert boundaries." },
          { id: 'scenario2', prompt: "You are a Dominant [UserArchetype]. Your submissive completes a difficult task you set perfectly, showing great effort and devotion. How do you acknowledge this achievement?", considerations: "Consider your archetype's approach to praise, reward, and maintaining their persona (e.g., a Strict Dom might praise differently than a Nurturing Daddy)." },
          { id: 'scenario3', prompt: "As a submissive [UserArchetype], you're finding a particular rule or protocol in your dynamic is causing you genuine, unintended stress outside of playtime. How do you bring this up with your Dominant?", considerations: "Focus on respectful communication, timing, and expressing needs versus demands."}
        ]
      },
      chooseYourAdventure: { /* ... (Expand to 5 stories with nodes) ... */
        title: "Adventure Paths",
        renderFunction: () => this.renderAdventureHome(),
        stories: [
            { /* Adventure 1: The Mysterious Invitation (as previously defined) */
                id: 'adventure1', title: "The Mysterious Invitation", description: "A cryptic invitation arrives, promising unparalleled experiences at an exclusive underground event. Do you dare to uncover its secrets?", startNode: 'adv1_node1',
                nodes: {
                    adv1_node1: { text: "You, a [UserArchetype], receive a cryptic invitation to an exclusive, underground kink event. The details are vague, promising 'unparalleled experiences'. Do you:", options: [ { text: "Investigate thoroughly, seeking reviews or contacts who know of it.",nextNode: 'adv1_node2_cautious' }, { text: "Attend with an open mind but clear boundaries and a safety plan.", nextNode: 'adv1_node2_prepared' }, { text: "Dive in headfirst, embracing the unknown and the thrill of spontaneity.", nextNode: 'adv1_node2_bold' } ] },
                    adv1_node2_cautious: { text: "Your research reveals the event is run by a controversial group known for pushing boundaries, sometimes unsafely. You decide to skip it, prioritizing your well-being. (End of this path - Prudence is a virtue!)", options: [] },
                    adv1_node2_prepared: { text: "You arrive. The atmosphere is intense. A masked figure approaches, offering you a drink and a private 'initiation'. Do you:", options: [ { text: "Politely decline the drink and the private initiation, preferring to observe first.", nextNode: 'adv1_node3_observe' }, { text: "Accept the drink but decline the private initiation for now.", nextNode: 'adv1_node3_drink' }, ] },
                    adv1_node2_bold: { text: "You plunge into the heart of the event. Music thumps, scenes unfold. It's overwhelming but exhilarating. A dominant figure singles you out, demanding you kneel. Do you:", options: [ { text: "Comply immediately, eager to see where this leads.", nextNode: 'adv1_node3_comply' }, { text: "Playfully challenge their authority, testing their reaction.", nextNode: 'adv1_node3_challenge_bold' }, ] },
                    adv1_node3_observe: { text: "Observing, you identify potential risks and decide to enjoy the event from a safe distance, networking carefully. (End of this path - Wisdom in observation!)", options: [] },
                    adv1_node3_drink: { text: "The drink tastes odd. You feel dizzy. You wisely decide to leave with your pre-arranged buddy. (End of this path - Safety first!)", options: [] },
                    adv1_node3_comply: { text: "Kneeling, you enter a powerful scene that respects your limits. (End of this path - A rewarding encounter!)", options: [] },
                    adv1_node3_challenge_bold: { text: "Your challenge is met with unexpected aggression. You use your safe word and exit. (End of this path - Boundaries asserted!)", options: [] },
                }
            },
            { /* Adventure 2: The Reluctant Submissive (as previously defined) */
                id: 'adventure2', title: "The Reluctant Submissive", description: "You encounter someone new to BDSM, curious but hesitant. How does your archetype guide (or respond to) their first steps?", startNode: 'adv2_node1',
                nodes: {
                    adv2_node1: { text: "As a [UserArchetype], you meet someone expressing curiosity about submission but also deep nervousness. They look to you for guidance. You:", options: [ {text: "Offer gentle reassurance and suggest starting with very light, non-physical power exchange.", nextNode:"adv2_gentle"}, {text:"Explain the importance of negotiation and limits before any play.", nextNode:"adv2_educate"}, {text:"Challenge them playfully to see if they enjoy a little push (if your archetype leans this way).", nextNode:"adv2_challenge"} ]},
                    adv2_gentle: {text: "They respond well to your gentle approach, and a lovely connection begins to form based on trust. (End - A nurturing start!)", options:[]},
                    adv2_educate: {text: "They appreciate your thoroughness and feel safer exploring with clear boundaries established. (End - Safety first!)", options:[]},
                    adv2_challenge: {text: "Your challenge makes them more anxious, and they withdraw. Perhaps a softer approach was needed. (End - A lesson in attunement.)", options:[]}
                }
            },
            // Placeholder for Adventure 3
            { id: 'adventure3', title: "The Forgotten Safe Word", description: "In the heat of a scene, a safe word is missed or ignored. How does your [UserArchetype] handle this critical breach of trust?", startNode: 'adv3_node1', nodes: { adv3_node1: { text: "Placeholder content for Adventure 3.", options: [] } } },
            // Placeholder for Adventure 4
            { id: 'adventure4', title: "The Shifting Dynamic", description: "Your long-term partner expresses a desire to explore a role or kink that drastically changes your established dynamic. How does your [UserArchetype] react?", startNode: 'adv4_node1', nodes: { adv4_node1: { text: "Placeholder content for Adventure 4.", options: [] } } },
            // Placeholder for Adventure 5
            { id: 'adventure5', title: "The Public Display", description: "You and your partner are at a kink-friendly event. They suggest a public display of your dynamic that pushes your comfort zone. How does your [UserArchetype] navigate this?", startNode: 'adv5_node1', nodes: { adv5_node1: { text: "Placeholder content for Adventure 5.", options: [] } } }
        ]
      },
      consentWorkshop: { title: "Consent & Limits", renderFunction: () => this.renderConsentWorkshop(), sections: [ /* ... same sections ... */
            { title: "Understanding Consent (FRIES)", content: "Consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific. It's an ongoing conversation, not a one-time contract. 'Maybe' or silence is NOT consent." }, { title: "Defining Limits", content: "Hard limits are non-negotiable boundaries. Soft limits are things one might be hesitant about but potentially willing to explore under specific conditions or with a trusted partner. Discuss these BEFORE play." }, { title: "Negotiation", content: "Talk about desires, limits, expectations, safe words, and aftercare needs. This isn't just for new partners; ongoing check-ins are vital. How might your [UserArchetype] approach negotiation?" }, { title: "Safe Words", content: "Green (all good/more), Yellow (caution/slow down/check in), Red (STOP immediately, scene ends, no questions). Ensure everyone involved knows and respects them." }, { title: "Aftercare", content: "The process of emotional and physical care after a scene. Needs vary widely (cuddles, water, snacks, debriefing, quiet time). Discuss what works for you and your partner(s)." }
      ]},
      strengthsChallenges: { title: "Archetype Reflection", renderFunction: () => this.renderStrengthsChallenges() },
      compareContrast: { title: "Compare Styles", renderFunction: () => this.renderCompareContrast() },
      glossary: { title: "Kinktionary", renderFunction: () => this.renderGlossary() }
    };
  }
  defineGlossary() { /* ... (same full glossary) ... */
    return {
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.", "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.", "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.", "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.", "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).", "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.", "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.", "Kink": "Unconventional sexual preferences or practices.", "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.", "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.", "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).", "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.", "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.", "Role-play": "Adopting specific characters or scenarios within a BDSM context.", "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow).", "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.", "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.", "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.", "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.", "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.", "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.", "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant."
    };
  }
  // Render functions now use event delegation setup in initializePlayground or attach specific listeners post-render
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
    // Populate select with archetypes that have dilemmas defined
    for (const archName in this.activities.ethicalDilemmas.data) {
        if (this.app.styleDescriptions[archName]) { // Check if archetype is known in main app
            const title = this.app.styleDescriptions[archName].title || archName;
            html += `<option value="${archName}" ${this.selectedDilemmaArchetype === archName ? 'selected' : ''}>${title}</option>`;
        }
    }
    html += `
        </select>
      </div>
      <div id="dilemma-area" style="margin-top:15px;">
        <p><i>${this.selectedDilemmaArchetype === 'general' ? 'Loading general dilemmas...' : `Loading dilemmas for ${this.selectedDilemmaArchetype}...`}</i></p>
      </div>
      <button id="next-dilemma-btn" class="playground-action-btn">Next Dilemma</button>
    `; // Next button always visible now, logic in loadRandomDilemma handles availability
    this.playgroundContentEl.innerHTML = html;

    const selectEl = this.playgroundContentEl.querySelector('#dilemma-archetype-select');
    if(selectEl) {
        selectEl.addEventListener('change', (e) => {
            this.selectedDilemmaArchetype = e.target.value;
            this.loadRandomDilemma(true); // Pass true for new selection
        });
    }
    const nextDilemmaBtn = this.playgroundContentEl.querySelector('#next-dilemma-btn');
    if(nextDilemmaBtn) nextDilemmaBtn.addEventListener('click', () => this.loadRandomDilemma(false)); // Pass false for "next" of same type

    this.loadRandomDilemma(true); // Initial load based on default or selected
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
        button.addEventListener('click', (e) => {
            const adventureId = e.currentTarget.dataset.adventureId;
            this.startSelectedAdventure(adventureId);
        });
    });
  }
  
  // All other render methods (loadRandomDilemma, renderScenarioResolutions, displayAdventureNode, etc.)
  // are assumed to be complete from the previous full playground.js example,
  // with inline event handlers removed and logic adjusted for delegated listeners or direct attachment.
  // For brevity, only the modified/new home screens for dilemmas and adventures are shown fully above.
  // The core logic for displaying each activity remains similar once it's selected.

  // Placeholder for the rest of the methods if they were not fully shown in previous response.
  // Ensure all methods like loadRandomDilemma, renderScenarioResolutions, displayAdventureNode, etc.
  // are fully implemented as before, just without inline event handlers.
  loadRandomDilemma(isNewArchetypeSelection = false) {
    const dilemmaArea = this.playgroundContentEl.querySelector('#dilemma-area');
    if (!dilemmaArea) return;

    let availableDilemmas = [];
    const allDilemmasByArchetype = this.activities.ethicalDilemmas.data;

    if (this.selectedDilemmaArchetype && this.selectedDilemmaArchetype !== 'general' && allDilemmasByArchetype[this.selectedDilemmaArchetype]) {
        availableDilemmas = allDilemmasByArchetype[this.selectedDilemmaArchetype];
    } else { 
        Object.values(allDilemmasByArchetype).forEach(archDilemmas => {
            availableDilemmas.push(...archDilemmas);
        });
    }

    if (availableDilemmas.length === 0) {
        dilemmaArea.innerHTML = "<p>No dilemmas available for this selection yet. More are being crafted by the Oracle!</p>";
        this.playgroundContentEl.querySelector('#next-dilemma-btn').style.display = 'none';
        return;
    } else {
         this.playgroundContentEl.querySelector('#next-dilemma-btn').style.display = 'block';
    }
    
    let newDilemma;
    if (availableDilemmas.length === 1) {
        newDilemma = availableDilemmas[0];
    } else {
        do {
            newDilemma = availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)];
        } while (!isNewArchetypeSelection && newDilemma.id === this.currentDilemma?.id);
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
        scenarioArea.innerHTML = "<p>No scenarios available yet.</p>";
        return;
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
  
  displayAdventureNode() {
    if (!this.currentAdventure || !this.adventureStep) {
        this.playgroundContentEl.innerHTML = "<p>Please select an adventure to start.</p>";
        return;
    }
    const node = this.currentAdventure.nodes[this.adventureStep];
    if (!node) {
      this.playgroundContentEl.innerHTML = "<p>Adventure ended or error.</p><button id='restart-adventure-btn' class='playground-action-btn' data-adventure-id='${this.currentAdventure.id}'>Restart This Adventure</button> <button class='playground-action-btn' onclick='playgroundApp.renderAdventureHome()'>Choose Another Adventure</button>";
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
    html += `<div class="adventure-nav-buttons" style="margin-top:15px;">`
    if (node.options && node.options.length > 0) { /* No restart if choices available */ }
    else {
         html += `<button id="restart-adventure-btn" class="playground-action-btn" data-adventure-id="${this.currentAdventure.id}">Restart This Adventure</button>`;
    }
    html += `<button class="playground-action-btn" onclick="playgroundApp.renderAdventureHome()">Choose Another Adventure</button>`;
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
        // If curated or primary not found, pick first from top archetypes if available
        if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0) {
            defaultArchForExploration = this.app.topArchetypesForCuration[0].name;
        } else { // Absolute fallback
            this.playgroundContentEl.innerHTML = `
                <h3>Archetype Reflection: ${userArch.name} ${userArch.icon}</h3>
                <p>Please complete the Oracle quiz to identify archetypes for reflection. If you have a curated style, consider its components.</p>
            `;
            return;
        }
    }
    this.currentDeepDiveArchetype = defaultArchForExploration; // Set it
    this.displayStrengthsChallengesContent(this.currentDeepDiveArchetype);
  }

  setDeepDiveArchetype(archetypeName) {
    this.currentDeepDiveArchetype = archetypeName;
    this.displayStrengthsChallengesContent(archetypeName);
  }
  
  displayStrengthsChallengesContent(archetypeName){
    const archData = this.app.styleDescriptions[archetypeName];
    if(!archData){
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
    
    // Dropdown to explore another of their top archetypes, or all if no top archetypes
    const archetypesToExplore = (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0) 
        ? this.app.topArchetypesForCuration.map(a => a.name)
        : [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();

    if (archetypesToExplore.length > 1) {
        html += `<div class="activity-selector" style="margin-top:20px;">
                    <label for="deep-dive-select">Explore another archetype:</label>
                    <select id="deep-dive-select">`;
        archetypesToExplore.forEach(archNameLoop => {
            if (this.app.styleDescriptions[archNameLoop]) { // Ensure it's a valid style
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
        if (this.app.styleDescriptions[name]) {
            const title = this.app.styleDescriptions[name].title || name;
            html += `<option value="${name}" ${this.compareArchetype1 === name ? 'selected' : ''}>${title}</option>`;
        }
    });
    html += `</select>`;

    html += `<select id="compare-arch2">`;
    html += `<option value="">-- Select Archetype 2 --</option>`;
    allStyleNames.forEach(name => {
         if (this.app.styleDescriptions[name]) {
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
      area.innerHTML = "<p>Please select two archetypes to compare.</p>";
      return;
    }
    if (this.compareArchetype1 === this.compareArchetype2) {
      area.innerHTML = "<p>Please select two <em>different</em> archetypes to compare.</p>";
      return;
    }

    const arch1Data = this.app.styleDescriptions[this.compareArchetype1];
    const arch2Data = this.app.styleDescriptions[this.compareArchetype2];

    if (!arch1Data || !arch1Data.title || !arch2Data || !arch2Data.title) { // Check for title as it implies fleshed out
      area.innerHTML = "<p>Full comparison data for one or both selected archetypes is unavailable at this time.</p>";
      return;
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
