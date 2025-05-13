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
            if (adventureId && this.currentAdventure && this.currentAdventure.id === adventureId) {
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
    this.hidePlaygroundWithoutOpeningQuiz();
    if (this.app && this.app.quizCompletedOnce && typeof this.app.showQuizModalAtLastStep === 'function') {
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
    if (activity && typeof activity.renderFunction === 'function') {
      if (activityKey === 'ethicalDilemmas') this.selectedDilemmaArchetype = 'general';
      if (activityKey === 'chooseYourAdventure') { this.currentAdventure = null; this.adventureStep = null; }
      if (activityKey === 'compareContrast') {this.compareArchetype1 = null; this.compareArchetype2 = null;}
      activity.renderFunction.call(this);
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
            if (styleData && styleData.title) {
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
            "Rope Bunny": [
                { id: 'rbD1', scenario: "Your Rigger is tying a complex suspension you've both wanted to try. You feel an unexpected nerve pinch. It's not unbearable yet, but concerning. You:", options:[{text:"Immediately use a 'yellow' or specific signal to indicate discomfort and ask for adjustment.", insight:"Essential for preventing nerve damage. Clear communication is key in rope."}, {text:"Try to subtly shift or relax the muscle, hoping it resolves itself.", insight:"Could work for minor issues, but risky for nerve pain."}, {text:"Endure it, not wanting to interrupt the Rigger's flow or appear 'difficult'.", insight:"Very dangerous. Nerve issues in rope can have long-lasting effects."}, {text:"Wait until the tie is complete and then mention it during checks.", insight:"Too late if damage is occurring. Rope safety demands immediate communication of nerve issues."}], archetypeNotes:"Rope Bunnies must be vigilant about their body and communicate any concerning sensations instantly." },
                { id: 'rbD2', scenario: "After a rope scene, you notice some bruising that's more significant than usual, though the scene felt good at the time. You:", options:[{text:"Mention it to your Rigger during aftercare, discussing what might have caused it for future awareness.", insight:"Good aftercare practice. Helps both of you learn and adjust for next time."}, {text:"Say nothing, assuming bruising is just part of rope play.", insight:"While some marking is common, unusual or excessive bruising should be noted and discussed."}, {text:"Feel embarrassed and try to hide it, worried your Rigger might think you're too fragile.", insight:"Honesty is vital for safety and trust in rope dynamics."}, {text:"Take photos and research online if it's 'normal' before talking to your Rigger.", insight:"While self-education is good, direct communication with your partner is primary."}], archetypeNotes:"Open discussion about physical effects, even after the scene, is part of responsible rope play." }
            ],
            "Sadist": [
                { id: 'sadistD1', scenario: "Your masochist is clearly enjoying the scene and asks for 'more,' but you notice a subtle physical cue (e.g., slight tremor they don't usually exhibit, a change in breathing) that *might* indicate they're nearing a true limit, despite their words. You:", options:[{text:"Acknowledge their request but pause to check in verbally: 'You want more? How are you feeling right now on a scale of 1-10?'", insight:"Excellent. Balances responsiveness with responsible checking."}, {text:"Trust their words implicitly and escalate the intensity as requested.", insight:"Risky if the non-verbal cue was significant. Words can sometimes mask true state in deep play."}, {text:"Slightly decrease intensity while observing them closely for more cues before deciding to re-escalate or stop.", insight:"A cautious approach, prioritizing observation over immediate verbal compliance."}, {text:"Use a pre-agreed 'status check' phrase that requires a specific, coherent response from them.", insight:"A good tool for gauging lucidity and true desire when signals might be mixed."}], archetypeNotes:"Ethical Sadism is about skillful sensation delivery *and* keen observation and care." },
                { id: 'sadistD2', scenario: "During aftercare, your masochist seems more emotionally distant or fragile than usual after an intense scene, even though they said they enjoyed it. You:", options:[{text:"Gently ask if they're okay and if there's anything specific they need, offering comfort without pressure.", insight:"Supportive and allows them space while showing care."}, {text:"Assume they're just tired and give them space, figuring they'll speak up if they need something.", insight:"Might be what they need, but could also leave them feeling isolated if they're struggling to articulate."}, {text:"Try to cheer them up with jokes or distractions, avoiding the potential emotional depth.", insight:"May invalidate their feelings or prevent necessary processing. Subdrop can be serious."}, {text:"Reassure them that the scene was good and they performed well, then ask if they'd like to talk about any part of it.", insight:"Offers positive reinforcement and an opening for debriefing."}], archetypeNotes:"Sadists' responsibility extends deeply into aftercare, especially after intense play." }
            ],
            "Disciplinarian": [
                { id: 'discD1', scenario: "Your submissive, usually compliant, has repeatedly failed to follow a clearly stated rule, offering flimsy excuses. You suspect they are testing your resolve. You:", options: [ {text:"Issue a stern warning and a more significant consequence if it happens again.", insight:"Reinforces authority and clarifies expectations of adherence."}, {text:"Calmly discuss why the rule is important and explore if there's a genuine obstacle for the submissive.", insight:"Emphasizes understanding, but must be balanced with maintaining structure."}, {text:"Implement an immediate, pre-agreed consequence for the rule-breaking without further discussion.", insight:"Shows consistency, but might miss underlying issues."}, {text:"Privately reflect if the rule itself is fair or if your expectations are too rigid.", insight:"Important self-reflection for a Disciplinarian to ensure fairness."}], archetypeNotes: "Disciplinarians balance fairness with firmness." },
                { id: 'discD2', scenario: "You've assigned a punishment that, in retrospect, feels a bit too harsh or disproportionate to the infraction, even if technically within agreed limits. You:", options: [ {text:"Proceed with it as assigned to maintain consistency and authority.", insight:"Consistency is key, but so is fairness. This could damage trust if perceived as unjust."}, {text:"Privately acknowledge your misjudgment to your submissive and adjust or commute part of the punishment.", insight:"Shows humility and prioritizes fairness, strengthening trust even if it means appearing 'softer'."}, {text:"Complete the punishment but make a mental note to recalibrate for future similar infractions.", insight:"Maintains immediate authority but allows for future adjustment."}, {text:"Offer your submissive a chance to 'earn' a reduction in the punishment through an extra task or act of contrition.", insight:"Can be a way to maintain structure while offering a path to mitigation."}], archetypeNotes: "Ethical discipline involves self-correction and prioritizing the dynamic's health." }
            ],
            "Master": [
                { id: 'masterD1', scenario: "Your long-term slave shows signs of burnout from their duties, though they haven't complained. Their usually impeccable service is slightly faltering. You:", options: [ {text:"Address the issue directly but kindly, asking about their well-being and if their workload needs adjustment.", insight:"Shows care and responsibility beyond just task completion. Fosters open communication."}, {text:"Increase discipline for the faltering service, assuming it's a lapse in focus.", insight:"Could exacerbate burnout and damage morale if the root cause isn't addressed."}, {text:"Grant them an unexpected period of rest or a 'treat' day without mentioning the service lapse, hoping to refresh them.", insight:"A gentle approach, but might not address underlying issues if they persist."}, {text:"Review their duties and your expectations to see if the demands have become unintentionally overwhelming over time.", insight:"Proactive and responsible management of the dynamic."}], archetypeNotes: "A Master's responsibility includes the holistic well-being of their slave." },
                { id: 'masterD2', scenario: "An outside party criticizes your M/s dynamic, misunderstanding its consensual nature. Your slave is present and looks to you. You:", options: [ {text:"Calmly and firmly correct the outsider's misconceptions, emphasizing consent and your private choices.", insight:"Asserts your dynamic's validity and protects your slave from external judgment."}, {text:"Ignore the outsider, focusing your attention on your slave to reassure them and demonstrate the criticism is irrelevant to your bond.", insight:"Can be powerful if done with clear intent, showing the outside world doesn't penetrate your dynamic."}, {text:"Ask your slave later, in private, how the criticism made them feel and discuss it together.", insight:"Prioritizes your slave's feelings and reinforces your internal communication."}, {text:"Use it as a teaching moment for your slave on how to handle external misunderstandings, depending on their role and personality.", insight:"Can empower the slave but needs to be handled sensitively."}], archetypeNotes: "Masters often act as a shield for their dynamic and their slave." }
            ],
             "Nurturer": [
                { id: 'nurtD1', scenario: "Your Little is having a tantrum over a denied treat, far beyond their usual playful pouting. They seem genuinely distressed. You:", options: [ {text:"Hold them gently, validate their feelings ('I know you're upset'), and then calmly explain why the treat isn't possible right now.", insight:"Combines comfort with boundary reinforcement."}, {text:"Give in to the tantrum to stop their distress, even if it goes against a previous decision.", insight:"May teach that tantrums work, but sometimes immediate comfort is prioritized by Nurturers."}, {text:"Try to distract them with a different fun activity or offer an alternative, healthier treat.", insight:"Redirects energy while still acknowledging their desire for something special."}, {text:"Firmly tell them tantrums are not acceptable and ignore it until they calm down.", insight:"Less typical for a Nurturer, who usually prioritizes soothing distress."}], archetypeNotes: "Nurturers aim to soothe and guide, balancing immediate comfort with gentle boundaries." },
                { id: 'nurtD2', scenario: "Your partner, who often leans on your nurturing side, seems to be avoiding discussing a serious real-life problem, retreating into a more dependent or Little-like role whenever you try to approach it. You:", options: [ {text:"Create a very safe, non-judgmental space and gently express your concern, letting them know you're there when they're ready to talk, without pressure.", insight:"Respects their pace while keeping the door open for communication."}, {text:"Temporarily indulge their retreat into a dependent role, providing extra comfort, then choose a calm 'adult' moment later to gently re-address the issue.", insight:"Meets immediate emotional needs first, then tackles the problem with care."}, {text:"Insist on discussing the problem now, believing that avoiding it is unhealthy for them, even if it causes temporary discomfort.", insight:"A Nurturer might do this if they genuinely believe gentle insistence is for the partner's ultimate good."}, {text:"Seek advice from a trusted friend or professional on how to best support them without enabling avoidance.", insight:"Shows a Nurturer's commitment to effective care, even if it means seeking external wisdom."}], archetypeNotes: "Nurturers navigate the delicate balance of providing comfort and encouraging healthy coping." }
            ],
            // --- GENERAL DILEMMAS (Can be used if no specific archetype selected or to mix in) ---
            "General": [
                {id: 'genD1', scenario: "You're at a public kink event and witness a scene where one participant seems genuinely distressed (beyond typical scene intensity), but their partner doesn't seem to notice or is ignoring it. You:", options:[{text:"Find a staff member or DM (Dungeon Monitor) immediately and discretely report your concerns.", insight:"Generally the safest and most appropriate first step in an organized event."}, {text:"Attempt to subtly catch the eye of the partner who seems to be ignoring the distress signals.", insight:"Risky, as it could be misinterpreted or escalate the situation. Only if you are very experienced and feel it's safe."}, {text:"Do nothing, assuming they have it under control or it's not your business.", insight:"Community safety often relies on members looking out for each other. Ignoring clear distress is usually not recommended."}, {text:"Loudly intervene in the scene to stop it.", insight:"Highly risky and can be dangerous unless it's an absolute emergency and no staff are available. Can escalate things badly."}], archetypeNotes:"Community responsibility and intervention are complex topics with varying approaches."},
                {id: 'genD2', scenario: "A friend new to kink asks for advice on finding their first Dominant/submissive partner online. You advise them to:", options:[{text:"Prioritize safety: meet in public first, tell a friend where they're going, trust their gut, and don't feel pressured.", insight:"Essential safety advice for anyone meeting online contacts."}, {text:"Focus on clear communication: discuss limits, desires, and expectations extensively *before* meeting or playing.", insight:"Crucial for establishing consent and compatibility."}, {text:"Join reputable online communities or local groups to learn and meet people in a more vetted environment.", insight:"Can offer a safer entry point than random dating apps for kink."}, {text:"Take it slow: get to know someone well before engaging in any intense BDSM activities.", insight:"Building trust is paramount in BDSM relationships."}], archetypeNotes:"Guiding newcomers safely is an important role for experienced community members."}
            ]
            // ... You would continue to add 2 dilemmas for EACH of the ~48 archetypes defined in script.js ...
            // This is a very large task. The examples above show the structure.
        }
      },
      scenarioResolutions: {
        title: "Scenario Sparks",
        renderFunction: () => this.renderScenarioResolutions(),
        data: [
          { id: 'scenario1', prompt: "You are a [UserArchetype]. During a scene, your partner unexpectedly introduces a new kink/activity you haven't discussed and about which you feel hesitant. How do you respond?", considerations: "Think about your archetype's communication style, comfort with spontaneity vs. structure, and how they assert boundaries." },
          { id: 'scenario2', prompt: "You are a Dominant [UserArchetype]. Your submissive completes a difficult task you set perfectly, showing great effort and devotion. How do you acknowledge this achievement?", considerations: "Consider your archetype's approach to praise, reward, and maintaining their persona (e.g., a Strict Dom might praise differently than a Nurturing Daddy)." },
          { id: 'scenario3', prompt: "As a submissive [UserArchetype], you're finding a particular rule or protocol in your dynamic is causing you genuine, unintended stress outside of playtime. How do you bring this up with your Dominant?", considerations: "Focus on respectful communication, timing, and expressing needs versus demands."}
        ]
      },
      chooseYourAdventure: {
        title: "Adventure Paths",
        renderFunction: () => this.renderAdventureHome(),
        stories: [
            { /* Adventure 1: The Mysterious Invitation */
                id: 'adventure1', title: "The Mysterious Invitation", description: "A cryptic invitation arrives, promising unparalleled experiences at an exclusive underground event. Do you dare to uncover its secrets?", startNode: 'adv1_node1',
                nodes: {
                    adv1_node1: { text: "You, a [UserArchetype], receive a cryptic invitation to an exclusive, underground kink event. The details are vague, promising 'unparalleled experiences'. Do you:", options: [ { text: "Investigate thoroughly, seeking reviews or contacts who know of it.",nextNode: 'adv1_node2_cautious' }, { text: "Attend with an open mind but clear boundaries and a safety plan.", nextNode: 'adv1_node2_prepared' }, { text: "Dive in headfirst, embracing the unknown and the thrill of spontaneity.", nextNode: 'adv1_node2_bold' } ] },
                    adv1_node2_cautious: { text: "Your research reveals the event is run by a controversial group known for pushing boundaries, sometimes unsafely. You decide to skip it, prioritizing your well-being. (End of this path - Prudence is a virtue!)", options: [] },
                    adv1_node2_prepared: { text: "You arrive. The atmosphere is intense. A masked figure approaches, offering you a drink and a private 'initiation'. Do you:", options: [ { text: "Politely decline the drink and the private initiation, preferring to observe first.", nextNode: 'adv1_node3_observe' }, { text: "Accept the drink but decline the private initiation for now.", nextNode: 'adv1_node3_drink' } ] },
                    adv1_node2_bold: { text: "You plunge into the heart of the event. Music thumps, scenes unfold. It's overwhelming but exhilarating. A dominant figure singles you out, demanding you kneel. Do you:", options: [ { text: "Comply immediately, eager to see where this leads.", nextNode: 'adv1_node3_comply' }, { text: "Playfully challenge their authority, testing their reaction.", nextNode: 'adv1_node3_challenge_bold' } ] },
                    adv1_node3_observe: { text: "Observing, you identify potential risks and decide to enjoy the event from a safe distance, networking carefully. (End of this path - Wisdom in observation!)", options: [] },
                    adv1_node3_drink: { text: "The drink tastes odd. You feel dizzy. You wisely decide to leave with your pre-arranged buddy. (End of this path - Safety first!)", options: [] },
                    adv1_node3_comply: { text: "Kneeling, you enter a powerful scene that respects your limits. (End of this path - A rewarding encounter!)", options: [] },
                    adv1_node3_challenge_bold: { text: "Your challenge is met with unexpected aggression. You use your safe word and exit. (End of this path - Boundaries asserted!)", options: [] },
            }},
            { /* Adventure 2: The Reluctant Submissive */
                id: 'adventure2', title: "The Emerging Submissive", description: "You encounter someone new to BDSM, curious but hesitant. How does your archetype guide (or respond to) their first steps?", startNode: 'adv2_node1',
                nodes: {
                    adv2_node1: { text: "As a [UserArchetype], you meet someone online expressing curiosity about submission but also deep nervousness. They admire your profile and ask for guidance. You:", options: [ {text: "Offer gentle reassurance, share some basic safety/consent resources, and suggest they explore reputable communities first.", nextNode:"adv2_educate_gentle"}, {text:"Explain the importance of negotiation, limits, and aftercare, offering to answer specific questions they have.", nextNode:"adv2_educate_direct"}, {text:"If your archetype is dominant, you might playfully suggest a very light, controlled online interaction to gauge their comfort, after emphasizing consent.", nextNode:"adv2_test_playful"}, {text:"If your archetype is submissive, share your positive experiences and what helped you feel safe when starting.", nextNode:"adv2_share_experience"} ]},
                    adv2_educate_gentle: {text: "They thank you for the resources and your kind approach, feeling more empowered to explore safely at their own pace. (End - Responsible Guidance!)", options:[]},
                    adv2_educate_direct: {text: "They appreciate your directness and knowledge, asking follow-up questions that lead to a productive educational exchange. (End - Knowledge Shared!)", options:[]},
                    adv2_test_playful: {text: "They either respond well to the playful test, finding it intriguing, or they become more anxious. This path depends heavily on your skill and their actual readiness. (End - A Path of Attunement or Misstep.)", options:[]},
                    adv2_share_experience: {text: "Your personal story helps demystify things for them and provides comfort. They feel less alone in their curiosity. (End - Connection Forged!)", options:[]}
            }},
            { id: 'adventure3', title: "The Broken Protocol", description: "A critical rule in your established dynamic is broken. How does your archetype handle the breach and its aftermath?", startNode: 'adv3_node1', nodes: { adv3_node1: { text: "Placeholder content for Adventure 3. This adventure will explore reactions to a significant breach of trust or rules within an established power exchange dynamic, tailored to how different [UserArchetype]s might react, from immediate confrontation to calculated withdrawal and later discussion, or even re-negotiation of the dynamic itself.", options: [{text:"Path A", nextNode:"adv3_nodeA"},{text:"Path B", nextNode:"adv3_nodeB"}] }, adv3_nodeA:{text:"End of Path A for Adventure 3.", options:[]}, adv3_nodeB:{text:"End of Path B for Adventure 3.", options:[]} } },
            { id: 'adventure4', title: "The Unforeseen Interruption", description: "You're deep in an intense scene when an unexpected real-world interruption occurs (e.g., fire alarm, urgent phone call). How do you, as [UserArchetype], manage the situation?", startNode: 'adv4_node1', nodes: { adv4_node1: { text: "Placeholder content for Adventure 4. This adventure will challenge the [UserArchetype] to balance scene integrity with real-world emergencies, testing their ability to shift focus, ensure safety, and manage the emotional impact of an abrupt halt to intense play.", options: [{text:"Path A", nextNode:"adv4_nodeA"},{text:"Path B", nextNode:"adv4_nodeB"}] }, adv4_nodeA:{text:"End of Path A for Adventure 4.", options:[]}, adv4_nodeB:{text:"End of Path B for Adventure 4.", options:[]} } },
            { id: 'adventure5', title: "The Shifting Desire", description: "Your partner expresses a desire to explore a kink that is a soft limit for you. How does your [UserArchetype] navigate this conversation?", startNode: 'adv5_node1', nodes: { adv5_node1: { text: "Placeholder content for Adventure 5. This scenario focuses on negotiation, boundary assertion, and the potential for dynamic evolution when a partner wishes to explore something that pushes the [UserArchetype]'s comfort zone, highlighting communication and compromise (or lack thereof).", options: [{text:"Path A", nextNode:"adv5_nodeA"},{text:"Path B", nextNode:"adv5_nodeB"}] }, adv5_nodeA:{text:"End of Path A for Adventure 5.", options:[]}, adv5_nodeB:{text:"End of Path B for Adventure 5.", options:[]} } }
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
        "Aftercare": "The period of emotional and physical support provided to participants after a BDSM scene or intense activity. Needs vary greatly.", "BDSM": "An umbrella term for Bondage & Discipline, Dominance & Submission, Sadism & Masochism.", "Bottom": "The receptive partner in a scene or dynamic; the one 'receiving' actions or sensations. Not necessarily submissive.", "Brat": "A submissive who playfully rebels, teases, or breaks rules to provoke a reaction or 'taming' from their Dominant.", "CNC": "Consensual Non-Consent. A type of role-play where a partner consents beforehand to a scenario involving simulated non-consent (e.g., 'rape play'). Requires extreme trust, communication, and negotiation.", "Collar": "A neck adornment often symbolizing ownership, commitment, or a specific role within a BDSM dynamic.", "Consent": "An affirmative, enthusiastic, and ongoing agreement to participate in an activity. Must be Freely Given, Reversible, Informed, Enthusiastic, and Specific (FRIES).", "Daddy/Mommy Dom/Domme (DD/lg, MD/lb)": "A Dominant who takes on a parental, nurturing, and guiding role towards a partner who enjoys an age play 'Little' role.", "Dominant (Dom/Domme)": "The partner who takes the lead, sets rules, or directs activities in a power exchange dynamic.", "Edge Play": "Play that pushes boundaries close to physical or psychological limits, or involves activities with higher inherent risk. Requires extreme caution and expertise.", "Hard Limit": "A non-negotiable boundary; an activity or type of play one is unwilling to engage in under any circumstances.", "Kink": "Unconventional sexual preferences or practices.", "Limits": "Boundaries set by individuals regarding what they are and are not willing to do or experience.", "Little Space": "A mindset or persona adopted by an individual (a 'Little') who enjoys regressing to a younger, more childlike state.", "Masochist": "Someone who derives pleasure (sexual or otherwise) from experiencing pain or intense sensations.", "Master/Mistress": "A Dominant in a highly structured, often long-term dynamic with a 'Slave,' implying deep control and responsibility.", "Negotiation": "The process of discussing desires, limits, expectations, safe words, and aftercare before engaging in BDSM activities.", "Pet Play": "Role-playing where one or more partners take on the persona of an animal (e.g., puppy, kitten).", "Power Exchange": "A dynamic where one partner willingly cedes a degree of power or control to another.", "RACK": "Risk Aware Consensual Kink. An acronym emphasizing that even with consent, some activities carry inherent risks.", "PRICK": "Personal Responsibility, Informed Consent, Kink. Similar to RACK, emphasizing individual accountability.", "Role-play": "Adopting specific characters or scenarios within a BDSM context.", "Safe Word": "A pre-agreed word or signal used to communicate distress or the need to stop/pause a scene (e.g., Red, Yellow, Green).", "Sadist": "Someone who derives pleasure (sexual or otherwise) from consensually inflicting pain or intense sensations on another.", "Sadomasochism (S&M)": "The giving and receiving of pain or humiliation for pleasure.", "Scene": "A specific period of BDSM play or interaction, often with a defined beginning, middle, and end.", "Shibari": "Japanese style of artistic rope bondage.", "Soft Limit": "A boundary one is hesitant about but may be willing to explore under certain conditions or with a trusted partner.", "Submissive (sub)": "The partner who willingly yields control or authority to a Dominant.", "Subspace": "An altered state of consciousness some submissives or bottoms experience during intense scenes, often described as floaty, euphoric, or disconnected.", "Switch": "Someone who enjoys and is capable of taking on both Dominant and submissive roles.", "Top": "The active partner in a scene or dynamic; the one 'giving' or initiating actions/sensations. Not necessarily Dominant.", "Vanilla": "Slang term for conventional sexual activities or lifestyle, not involving BDSM or kink."
    };
  }

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
    const allArchetypesWithDilemmas = Object.keys(this.activities.ethicalDilemmas.data);
    allArchetypesWithDilemmas.sort().forEach(archName => {
        if (this.app.styleDescriptions[archName] || archName === "General") { // Check if archetype is known or is "General"
            const title = (archName === "General") ? "General" : (this.app.styleDescriptions[archName]?.title || archName);
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
        // If 'general' or selected archetype has no specific dilemmas, pool from all for now or use a dedicated "General" pool
        if (allDilemmasByArchetype["General"] && allDilemmasByArchetype["General"].length > 0) {
            availableDilemmas = allDilemmasByArchetype["General"];
        } else { // Fallback to all if no "General" category exists or is empty
            Object.values(allDilemmasByArchetype).forEach(archDilemmasList => {
                if(Array.isArray(archDilemmasList)) {
                     availableDilemmas.push(...archDilemmasList);
                }
            });
        }
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
        while (!isNewArchetypeSelection && this.currentDilemma && newDilemma.id === this.currentDilemma.id && availableDilemmas.length > 1);
    }
    this.currentDilemma = newDilemma;
    if (!this.currentDilemma) { // Safeguard if newDilemma is still undefined
        dilemmaArea.innerHTML = "<p>Could not load a dilemma. Please try another selection.</p>"; return;
    }
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
        button.addEventListener('click', (e) => {
            const adventureId = e.currentTarget.dataset.adventureId;
            this.startSelectedAdventure(adventureId);
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
        if(this.currentAdventure) { // Make sure currentAdventure is defined
             endNavHTML += `<button id="restart-adventure-btn" class="playground-action-btn" data-adventure-id="${this.currentAdventure.id}">Restart This Adventure</button>`;
        }
        endNavHTML += `<button id="choose-another-adventure-btn" class="playground-action-btn">Choose Another Adventure</button>`;
        endNavHTML += `</div>`;
        this.playgroundContentEl.innerHTML = "<p>Adventure ended or error.</p>" + endNavHTML;
        return;
    }
    const userArch = this.getUserArchetype();
    let html = `<h3>${this.currentAdventure.title} <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>`;
    html += `<p class="scenario-text">${node.text.replace(/\[UserArchetype\]/g, userArch.name)}</p>`; // Global replace
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
    if (!node.options || node.options.length === 0) {
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
          <p>${section.content.replace(/\[UserArchetype\]/g, userArch.name)}</p> 
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
        if (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0 && this.app.styleDescriptions[this.app.topArchetypesForCuration[0].name]) {
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
    if(!archData || !archData.title){
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
    
    const archetypesToExploreSource = (this.app.topArchetypesForCuration && this.app.topArchetypesForCuration.length > 0) 
        ? this.app.topArchetypesForCuration.map(a => a.name)
        : [...new Set([...this.app.styles.submissive, ...this.app.styles.dominant])].sort();
    
    const archetypesToExplore = archetypesToExploreSource.filter(name => this.app.styleDescriptions[name] && this.app.styleDescriptions[name].title);


    if (archetypesToExplore.length > 1) {
        html += `<div class="activity-selector" id="explore-another-arch-options" style="margin-top:20px;">
                    <label for="deep-dive-select">Explore another archetype:</label>
                    <select id="deep-dive-select">`;
        archetypesToExplore.forEach(archNameLoop => {
            const title = this.app.styleDescriptions[archNameLoop].title || archNameLoop;
            html += `<option value="${archNameLoop}" ${archetypeName === archNameLoop ? 'selected': ''}>${title}</option>`;
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
