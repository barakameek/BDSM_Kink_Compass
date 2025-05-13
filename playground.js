class PlaygroundApp {
  constructor(styleFinderAppInstance) {
    this.app = styleFinderAppInstance; // Reference to the main app for user's archetype
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

    // Listener for the playground's own close button
    const closeBtn = document.getElementById('close-playground-btn');
    if(closeBtn) closeBtn.addEventListener('click', () => this.hidePlayground());

    // Delegated Event Listener for dynamically added content within the playground
    this.playgroundContentEl.addEventListener('click', (event) => {
        const target = event.target;
        
        // Ethical Dilemmas Options
        if (target.matches('.option-btn') && this.currentActivity === 'ethicalDilemmas' && this.currentDilemma && target.closest('#dilemma-area')) {
            const selectedIndex = parseInt(target.dataset.index);
            const feedbackEl = this.playgroundContentEl.querySelector('#dilemma-feedback');
            if (feedbackEl && this.currentDilemma.options[selectedIndex]) {
                 feedbackEl.innerHTML = `<strong>Your Choice:</strong> ${this.currentDilemma.options[selectedIndex].text}<br><strong>Insight:</strong> ${this.currentDilemma.options[selectedIndex].insight}`;
            }
            this.playgroundContentEl.querySelectorAll('#dilemma-area .option-btn').forEach(b => b.disabled = true);
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
        // Choose Your Own Adventure Options (within .adventure-options)
        else if (target.matches('.adventure-options .option-btn') && this.currentActivity === 'chooseYourAdventure') {
            const nextNodeId = target.dataset.nextNode;
            if (nextNodeId) {
                this.progressAdventure(nextNodeId);
            }
        }
        // Restart Current Adventure button (if present)
        else if (target.id === 'restart-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
            const adventureId = target.dataset.adventureId;
            if (adventureId) {
                this.startSelectedAdventure(adventureId);
            }
        }
        // Choose Another Adventure button (if present)
        else if (target.id === 'choose-another-adventure-btn' && this.currentActivity === 'chooseYourAdventure') {
             this.renderAdventureHome();
        }
        // Strengths & Challenges - explore another
        // Using a more specific selector for these buttons if they are dynamically added
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

  // NEW: To be called when the main app's "Return to Results" hides the playground
  hidePlaygroundWithoutOpeningQuiz() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null; 
    // Does NOT call back to styleFinderApp to show quiz modal
  }

  // Original hidePlayground, for the playground's own close button
  hidePlayground() {
    const mainPlaygroundContainer = document.getElementById('playgroundContainer');
    if (mainPlaygroundContainer) {
        mainPlaygroundContainer.style.display = 'none';
    }
    this.currentActivity = null;
    // Call back to StyleFinderApp to show its modal at the result step
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
      if (activityKey === 'ethicalDilemmas') this.selectedDilemmaArchetype = 'general';
      if (activityKey === 'chooseYourAdventure') { this.currentAdventure = null; this.adventureStep = null; }
      if (activityKey === 'compareContrast') {this.compareArchetype1 = null; this.compareArchetype2 = null;}
      activity.renderFunction();
    } else {
      if(this.playgroundContentEl) this.playgroundContentEl.innerHTML = `<p>Activity "${activityKey}" not found or has no render function.</p>`;
    }
  }
  
  getUserArchetype() {
    if (this.app && this.app.customArchetypeName && this.app.customArchetypeName.trim() !== "") {
        const curatedKnownStyle = this.app.styleDescriptions[this.app.customArchetypeName];
        let primaryIcon = '✨'; // Default for curated
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
            if (styleData) {
                return { name: topStyleName, icon: styleData.icon, isCurated: false, description: styleData.essence };
            }
        }
    }
    return { name: "Seeker", icon: '❓', isCurated: false, description: "Your archetype is yet to be revealed. Please complete the Oracle quiz first for personalized Playground activities." };
  }

  defineActivities() {
    return {
      ethicalDilemmas: {
        title: "Ethical Echoes",
        renderFunction: () => this.renderEthicalDilemmasHome(),
        data: {
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
            "Disciplinarian": [
                { id: 'discD1', scenario: "Your submissive, usually compliant, has repeatedly failed to follow a clearly stated rule, offering flimsy excuses. You suspect they are testing your resolve. You:", options: [ {text:"Issue a stern warning and a more significant consequence if it happens again.", insight:"Reinforces authority and clarifies expectations of adherence."}, {text:"Calmly discuss why the rule is important and explore if there's a genuine obstacle for the submissive.", insight:"Emphasizes understanding, but must be balanced with maintaining structure."}, {text:"Implement an immediate, pre-agreed consequence for the rule-breaking without further discussion.", insight:"Shows consistency, but might miss underlying issues."}, {text:"Privately reflect if the rule itself is fair or if your expectations are too rigid.", insight:"Important self-reflection for a Disciplinarian to ensure fairness."}], archetypeNotes: "Disciplinarians balance fairness with firmness." },
                { id: 'discD2', scenario: "You've assigned a punishment that, in retrospect, feels a bit too harsh or disproportionate to the infraction, even if technically within agreed limits. You:", options: [ {text:"Proceed with it as assigned to maintain consistency and authority.", insight:"Consistency is key, but so is fairness. This could damage trust if perceived as unjust."}, {text:"Privately acknowledge your misjudgment to your submissive and adjust or commute part of the punishment.", insight:"Shows humility and prioritizes fairness, strengthening trust even if it means appearing 'softer'."}, {text:"Complete the punishment but make a mental note to recalibrate for future similar infractions.", insight:"Maintains immediate authority but allows for future adjustment."}, {text:"Offer your submissive a chance to 'earn' a reduction in the punishment through an extra task or act of contrition.", insight:"Can be a way to maintain structure while offering a path to mitigation."}], archetypeNotes: "Ethical discipline involves self-correction and prioritizing the dynamic's health." }
            ],
            "Master": [
                { id: 'masterD1', scenario: "Your long-term slave shows signs of burnout from their duties, though they haven't complained. Their usually impeccable service is slightly faltering. You:", options: [ {text:"Address the issue directly but kindly, asking about their well-being and if their workload needs adjustment.", insight:"Shows care and responsibility beyond just task completion. Fosters open communication."}, {text:"Increase discipline for the faltering service, assuming it's a lapse in focus.", insight:"Could exacerbate burnout and damage morale if the root cause isn't addressed."}, {text:"Grant them an unexpected period of rest or a 'treat' day without mentioning the service lapse, hoping to refresh them.", insight:"A gentle approach, but might not address underlying issues if they persist."}, {text:"Review their duties and your expectations to see if the demands have become unintentionally overwhelming over time.", insight:"Proactive and responsible management of the dynamic."}], archetypeNotes: "A Master's responsibility includes the holistic well-being of their slave." },
                { id: 'masterD2', scenario: "An outside party criticizes your M/s dynamic, misunderstanding its consensual nature. Your slave is present and looks to you. You:", options: [ {text:"Calmly and firmly correct the outsider's misconceptions, emphasizing consent and your private choices.", insight:"Asserts your dynamic's validity and protects your slave from external judgment."}, {text:"Ignore the outsider, focusing your attention on your slave to reassure them and demonstrate the criticism is irrelevant to your bond.", insight:"Can be powerful if done with clear intent, showing the outside world doesn't penetrate your dynamic."}, {text:"Ask your slave later, in private, how the criticism made them feel and discuss it together.", insight:"Prioritizes your slave's feelings and reinforces your internal communication."}, {text:"Use it as a teaching moment for your slave on how to handle external misunderstandings, depending on their role and personality.", insight:"Can empower the slave but needs to be handled sensitively."}], archetypeNotes: "Masters often act as a shield for their dynamic and their slave." }
            ],
            // Add placeholders for many more archetypes...
             "General": [ // Example of how you might structure general dilemmas
                {id: 'genD1', scenario: "You're at a public kink event and witness a scene where one participant seems genuinely distressed, but their partner doesn't seem to notice or is ignoring it. You:", options:[/* ... */], insight:"...", archetypeNotes:"Community responsibility is complex."},
                {id: 'genD2', scenario: "A friend new to kink asks for advice on finding their first Dominant/submissive partner. You advise them to:", options:[/* ... */], insight:"...", archetypeNotes:"Guiding newcomers is an important role."}
            ]
        }
      },
      scenarioResolutions: { title: "Scenario Sparks", renderFunction: () => this.renderScenarioResolutions(), data: [
          { id: 'scenario1', prompt: "You are a [UserArchetype]. During a scene, your partner unexpectedly introduces a new kink/activity you haven't discussed and about which you feel hesitant. How do you respond?", considerations: "Think about your archetype's communication style, comfort with spontaneity vs. structure, and how they assert boundaries." },
          { id: 'scenario2', prompt: "You are a Dominant [UserArchetype]. Your submissive completes a difficult task you set perfectly, showing great effort and devotion. How do you acknowledge this achievement?", considerations: "Consider your archetype's approach to praise, reward, and maintaining their persona (e.g., a Strict Dom might praise differently than a Nurturing Daddy)." },
          { id: 'scenario3', prompt: "As a submissive [UserArchetype], you're finding a particular rule or protocol in your dynamic is causing you genuine, unintended stress outside of playtime. How do you bring this up with your Dominant?", considerations: "Focus on respectful communication, timing, and expressing needs versus demands."}
      ]},
      chooseYourAdventure: {
        title: "Adventure Paths",
        renderFunction: () => this.renderAdventureHome(),
        stories: [
            { id: 'adventure1', title: "The Mysterious Invitation", description: "A cryptic invitation arrives, promising unparalleled experiences at an exclusive underground event. Do you dare to uncover its secrets?", startNode: 'adv1_node1', nodes: {
                    adv1_node1: { text: "You, a [UserArchetype], receive a cryptic invitation to an exclusive, underground kink event. The details are vague, promising 'unparalleled experiences'. Do you:", options: [ { text: "Investigate thoroughly, seeking reviews or contacts who know of it.",nextNode: 'adv1_node2_cautious' }, { text: "Attend with an open mind but clear boundaries and a safety plan.", nextNode: 'adv1_node2_prepared' }, { text: "Dive in headfirst, embracing the unknown and the thrill of spontaneity.", nextNode: 'adv1_node2_bold' } ] },
                    adv1_node2_cautious: { text: "Your research reveals the event is run by a controversial group known for pushing boundaries, sometimes unsafely. You decide to skip it, prioritizing your well-being. (End of this path - Prudence is a virtue!)", options: [] },
                    adv1_node2_prepared: { text: "You arrive. The atmosphere is intense. A masked figure approaches, offering you a drink and a private 'initiation'. Do you:", options: [ { text: "Politely decline the drink and the private initiation, preferring to observe first.", nextNode: 'adv1_node3_observe' }, { text: "Accept the drink but decline the private initiation for now.", nextNode: 'adv1_node3_drink' } ] },
                    adv1_node2_bold: { text: "You plunge into the heart of the event. Music thumps, scenes unfold. It's overwhelming but exhilarating. A dominant figure singles you out, demanding you kneel. Do you:", options: [ { text: "Comply immediately, eager to see where this leads.", nextNode: 'adv1_node3_comply' }, { text: "Playfully challenge their authority, testing their reaction.", nextNode: 'adv1_node3_challenge_bold' } ] },
                    adv1_node3_observe: { text: "Observing, you identify potential risks and decide to enjoy the event from a safe distance, networking carefully. (End of this path - Wisdom in observation!)", options: [] },
                    adv1_node3_drink: { text: "The drink tastes odd. You feel dizzy. You wisely decide to leave with your pre-arranged buddy. (End of this path - Safety first!)", options: [] },
                    adv1_node3_comply: { text: "Kneeling, you enter a powerful scene that respects your limits. (End of this path - A rewarding encounter!)", options: [] },
                    adv1_node3_challenge_bold: { text: "Your challenge is met with unexpected aggression. You use your safe word and exit. (End of this path - Boundaries asserted!)", options: [] },
            }},
            { id: 'adventure2', title: "The Reluctant Submissive", description: "You encounter someone new to BDSM, curious but hesitant. How does your archetype guide (or respond to) their first steps?", startNode: 'adv2_node1', nodes: {
                    adv2_node1: { text: "As a [UserArchetype], you meet someone expressing curiosity about submission but also deep nervousness. They look to you for guidance. You:", options: [ {text: "Offer gentle reassurance and suggest starting with very light, non-physical power exchange.", nextNode:"adv2_gentle"}, {text:"Explain the importance of negotiation and limits before any play.", nextNode:"adv2_educate"}, {text:"Challenge them playfully to see if they enjoy a little push (if your archetype leans this way).", nextNode:"adv2_challenge"} ]},
                    adv2_gentle: {text: "They respond well to your gentle approach, and a lovely connection begins to form based on trust. (End - A nurturing start!)", options:[]},
                    adv2_educate: {text: "They appreciate your thoroughness and feel safer exploring with clear boundaries established. (End - Safety first!)", options:[]},
                    adv2_challenge: {text: "Your challenge makes them more anxious, and they withdraw. Perhaps a softer approach was needed. (End - A lesson in attunement.)", options:[]}
            }},
            { id: 'adventure3', title: "The Broken Protocol", description: "A critical rule in your established dynamic is broken. How does your archetype handle the breach and its aftermath?", startNode: 'adv3_node1', nodes: {
                adv3_node1: { text: "Your partner, with whom you have a well-established [UserArchetype] dynamic, knowingly breaks a significant protocol. You feel a mix of disappointment and anger. Your first step is to:", options: [ {text:"Immediately address the breach, expressing your feelings and demanding an explanation.", nextNode:"adv3_direct"}, {text:"Withdraw to process your emotions before deciding how to address it.", nextNode:"adv3_withdraw"}, {text:"Implement a pre-agreed consequence for protocol breaches without discussion.", nextNode:"adv3_consequence"} ]},
                adv3_direct: {text: "The direct confrontation leads to a difficult but honest conversation, revealing an underlying issue that needed attention. (End - Communication Prevails!)", options:[]},
                adv3_withdraw: {text: "After calming down, you approach your partner for a discussion, allowing for a more measured and understanding exchange. (End - Calm Reflection Wins!)", options:[]},
                adv3_consequence: {text: "The consequence is applied, but the root cause of the breach remains unaddressed, potentially leading to future issues. (End - Order Maintained, Understanding Lost?)", options:[]}
            }},
            { id: 'adventure4', title: "The Unforeseen Interruption", description: "You're deep in an intense scene when an unexpected real-world interruption occurs (e.g., fire alarm, urgent phone call). How do you, as [UserArchetype], manage the situation?", startNode: 'adv4_node1', nodes: {
                adv4_node1: { text: "As a [UserArchetype], you're in the middle of a very intense scene. Suddenly, the fire alarm blares! You:", options: [ {text:"Immediately call 'Red!' or your emergency stop, ensure your partner is safe and coherent, then address the alarm.", nextNode:"adv4_safetyfirst"}, {text:"Try to quickly finish the scene or secure your partner before investigating the alarm.", nextNode:"adv4_scenefirst"}, {text:"Panic slightly, unsure how to balance scene intensity with real-world urgency.", nextNode:"adv4_panic"} ]},
                adv4_safetyfirst: {text: "You both safely evacuate. The scene is broken, but trust is reinforced by your quick, responsible action. (End - Safety Above All!)", options:[]},
                adv4_scenefirst: {text: "By the time you address the alarm, it was a false alarm, but the delay created unnecessary risk and anxiety. (End - A Risky Choice.)", options:[]},
                adv4_panic: {text: "The confusion leads to a fumbled response. Luckily, it was a false alarm, but it highlights the need for emergency protocols. (End - A Wake-Up Call!)", options:[]}
            }},
            { id: 'adventure5', title: "The Shifting Desire", description: "Your partner expresses a desire to explore a kink that is a soft limit for you. How does your [UserArchetype] navigate this conversation?", startNode: 'adv5_node1', nodes: {
                adv5_node1: { text: "Your partner, aware of your soft limit around [a specific kink, e.g., public play], expresses a strong desire to explore it. As a [UserArchetype], you:", options: [ {text:"Reiterate that it's a soft limit, explain your hesitations, and suggest discussing small, controlled ways to approach it, if at all.", nextNode:"adv5_negotiate"}, {text:"Firmly say 'no' as it makes you uncomfortable, even as a soft limit discussion.", nextNode:"adv5_firmno"}, {text:"Agree to try it despite your discomfort, not wanting to disappoint them.", nextNode:"adv5_capitulate"} ]},
                adv5_negotiate: {text: "The discussion leads to a better understanding of each other's desires and fears, and you agree on a very small, safe experiment or decide to wait. (End - Healthy Communication!)", options:[]},
                adv5_firmno: {text: "Your partner respects your boundary, though they may be disappointed. Your comfort and limits are upheld. (End - Boundaries Respected!)", options:[]},
                adv5_capitulate: {text: "You try the kink, but your discomfort overshadows the experience for both of you, leading to a less than ideal outcome. (End - Unvoiced Discomfort Sours Play.)", options:[]}
            }}
        ]
      },
      consentWorkshop: { title: "Consent & Limits", renderFunction: () => this.renderConsentWorkshop(), sections: [
            { title: "Understanding Consent (FRIES)", content: "Consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific. It's an ongoing conversation, not a one-time contract. 'Maybe' or silence is NOT consent." }, { title: "Defining Limits", content: "Hard limits are non-negotiable boundaries. Soft limits are things one might be hesitant about but potentially willing to explore under specific conditions or with a trusted partner. Discuss these BEFORE play." }, { title: "Negotiation", content: "Talk about desires, limits, expectations, safe words, and aftercare needs. This isn't just for new partners; ongoing check-ins are vital. How might your [UserArchetype] approach negotiation?" }, { title: "Safe Words", content: "Green (all good/more), Yellow (caution/slow down/check in), Red (STOP immediately, scene ends, no questions). Ensure everyone involved knows and respects them." }, { title: "Aftercare", content: "The process of emotional and physical care after a scene. Needs vary widely (cuddles, water, snacks, debriefing, quiet time). Discuss what works for you and your partner(s)." }
      ]},
      strengthsChallenges: { title: "Archetype Reflection", renderFunction: () => this.renderStrengthsChallenges() },
      compareContrast: { title: "Compare Styles", renderFunction: () => this.renderCompareContrast() },
      glossary: { title: "Kinktionary", renderFunction: () => this.renderGlossary() }
    };
  }

  defineGlossary() {
    return {
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.", "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.", "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.", "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.", "CNC": "Consensual Non-Consent. A type of role-play where a partner consents beforehand to a scenario involving simulated non-consent (e.g., 'rape play'). Requires extreme trust, communication, and negotiation.", "Collar": "A neck adornment often symbolizing ownership, commitment, or a specific role within a BDSM dynamic.", "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).", "Daddy/Mommy Dom/Domme (DD/lg, MD/lb)": "A Dominant who takes on a parental, nurturing, and guiding role towards a partner who enjoys an age play 'Little' role.", "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.", "Edge Play": "Play that pushes boundaries close to physical or psychological limits, or involves activities with higher inherent risk. Requires extreme caution and expertise.", "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.", "Impact Play": "Activities involving striking the body, such as spanking, flogging, or caning, for sensation or discipline.", "Kink": "Unconventional sexual preferences or practices.", "Limits": "Boundaries set by individuals regarding what they are and are not willing to do or experience.", "Little Space": "A mindset or persona adopted by an individual (a 'Little') who enjoys regressing to a younger, more childlike state.", "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.", "Master/Mistress": "A Dominant in a highly structured, often long-term dynamic with a 'Slave,' implying deep control and responsibility.", "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.", "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).", "Power Exchange": "A dynamic where one partner willingly cedes a degree of power or control to another.", "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.", "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.", "Role-play": "Adopting specific characters or scenarios within a BDSM context.", "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow, Green).", "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.", "Sadomasochism (S&M)": "The giving and receiving of pain or humiliation for pleasure.", "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.", "Shibari": "Japanese style of artistic rope bondage.", "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.", "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.", "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.", "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.", "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant.", "Vanilla": "Slang term for conventional sexual activities or lifestyle, not involving BDSM or kink."
    };
  }
  // ... (The rest of the render methods and helper methods for each activity,
  //      ensuring they use this.playgroundContentEl.querySelector for internal elements
  //      and attach event listeners properly using .addEventListener or the main delegated listener.)
  //      The structure for loadRandomDilemma, renderScenarioResolutions, loadRandomScenario,
  //      displayAdventureNode, progressAdventure, renderConsentWorkshop, renderStrengthsChallenges,
  //      setDeepDiveArchetype, renderCompareContrast, displayComparison, renderGlossary, filterGlossary
  //      are assumed to be complete as per the previous fully correct playground.js response,
  //      with the event handling fixes applied.
} // End of PlaygroundApp class
