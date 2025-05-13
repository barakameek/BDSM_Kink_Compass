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
            { // Adventure 1: The Mysterious Invitation (Fleshed Out Example)
                id: 'adventure1',
                title: "The Mysterious Invitation",
                description: "A cryptic invitation arrives, promising unparalleled experiences at an exclusive underground event. Do you dare to uncover its secrets?",
                startNode: 'adv1_node1',
                nodes: {
                    adv1_node1: {
                        text: "You, a [UserArchetype], receive a sleek, unmarked envelope. Inside, an embossed card invites you to 'Elysian Shadows,' an exclusive, underground kink event spoken of only in whispers. It promises 'experiences beyond your wildest imaginings' but offers few concrete details. The location is revealed only upon RSVP. Do you:",
                        options: [
                            { text: "Decline politely. The mystery is too great, and safety is paramount.", nextNode: 'adv1_end_decline' },
                            { text: "Attempt to research 'Elysian Shadows' online and through trusted contacts before deciding.", nextNode: 'adv1_node2_research' },
                            { text: "RSVP immediately. The allure of the unknown is too strong to resist!", nextNode: 'adv1_node2_rsvp_bold' }
                        ]
                    },
                    adv1_end_decline: { text: "You decide against attending. While the allure was there, your intuition (or caution) told you to prioritize the known and safe. Perhaps another time, another mystery. (End of Path - Prudence Chosen)", options: [] },
                    adv1_node2_research: {
                        text: "Your research yields mixed results. Some forums praise Elysian Shadows for its cutting-edge scenes and discretion. Others whisper of intense experiences, blurred lines, and a 'play at your own risk' atmosphere. No concrete safety violations are reported, but an air of intense secrecy prevails. You:",
                        options: [
                            { text: "Decide it's too risky based on the ambiguous warnings and your personal comfort level.", nextNode: 'adv1_end_decline_researched' },
                            { text: "RSVP, deciding to attend with a trusted friend, a solid safety plan, and very clear personal boundaries.", nextNode: 'adv1_node3_prepared_arrival' },
                            { text: "Contact the organizers with specific questions about safety protocols and consent facilitators before RSVPing.", nextNode: 'adv1_node3_contact_organizers'}
                        ]
                    },
                    adv1_node2_rsvp_bold: {
                        text: "You RSVP and receive the clandestine location details. You arrive alone, heart pounding with a mix of excitement and trepidation. The entrance is discreet, leading to a dimly lit, opulent space thrumming with exotic music and the sight of various scenes already in progress. You are immediately approached by a host with an enigmatic smile. 'Welcome, [UserArchetype],' they purr. 'First drink is on us. Or perhaps... a more personal welcome in our private salon?' They gesture towards a velvet-curtained alcove. You:",
                        options: [
                            { text: "Accept the drink and politely decline the salon for now, wanting to get your bearings.", nextNode: 'adv1_node4_drink_alone' },
                            { text: "Decline both, stating you'd prefer to observe and mingle first.", nextNode: 'adv1_node4_observe_bold' },
                            { text: "Accept the invitation to the private salon, intrigued by the 'personal welcome'.", nextNode: 'adv1_node4_private_salon_bold' }
                        ]
                    },
                    adv1_end_decline_researched: { text: "After careful consideration of the mixed reviews, you decide the potential risks outweigh the allure. You value your safety and well-defined consent above a mysterious thrill. (End of Path - Informed Decision)", options: [] },
                    adv1_node3_prepared_arrival: {
                        text: "You and your friend arrive, having discussed your limits and check-in signals. The ambiance is electric. A host offers you a drink. You:",
                        options: [
                            { text: "Both accept a non-alcoholic drink and begin to explore the main area together.", nextNode: 'adv1_node4_explore_together' },
                            { text: "Politely decline, preferring to stick to your own water bottles, and start observing.", nextNode: 'adv1_node4_observe_prepared' }
                        ]
                    },
                    adv1_node3_contact_organizers: {
                        text: "The organizers respond vaguely, emphasizing 'personal responsibility' and the 'transformative nature' of their events, but offer no specifics on DMs or clear safety structures. You:",
                        options: [
                            { text: "Thank them but decline the invitation. Their lack of transparency is a red flag.", nextNode: 'adv1_end_decline_researched' },
                            { text: "Decide to risk it, hoping for the best, but go with a friend and a safety plan.", nextNode: 'adv1_node3_prepared_arrival' }
                        ]
                    },
                    adv1_node4_drink_alone: { text: "The drink is strong but seems fine. You wander, taking in the sights. The energy is high. A figure detaches from a group and approaches you with intent. (Path continues - branch to specific encounter based on UserArchetype or a general challenge)", options: [{text:"Continue...", nextNode: "adv1_encounter_general"}] },
                    adv1_node4_observe_bold: { text: "You navigate the periphery, observing various scenes. Some are artistic, some intense. You gain a better sense of the event's tone. (Path continues - opportunity to engage or be approached)", options: [{text:"Continue...", nextNode: "adv1_observe_decision"}] },
                    adv1_node4_private_salon_bold: { text: "The salon is plush, with only a few other people and the enigmatic host. They offer you a seat and begin to ask probing, personal questions about your deepest desires... (End of Path - A Risky Intimacy or Interrogation? You decide how it unfolds for your [UserArchetype].)", options: [] },
                    adv1_node4_explore_together: { text: "You and your friend explore, a silent support system for each other. You witness a scene that makes one of you uncomfortable. You use your check-in signal and decide to leave together, valuing your shared comfort. (End of Path - Friendship and Safety First)", options: [] },
                    adv1_node4_observe_prepared: { text: "You and your friend observe, discussing scenes quietly. You identify a few individuals who seem safe and experienced, and consider approaching them for a potential interaction later. (End of Path - Calculated Exploration)", options: [] },
                    adv1_encounter_general: {text: "The figure is a [Dominant/Submissive, depending on UserArchetype's role] with a compelling aura. They propose a scene that aligns with your known interests but feels a bit fast. Do you: a) Agree, trusting the moment, b) Suggest a slower start or more negotiation, c) Politely decline. (End of Path - User reflects on choice)", options:[]},
                    adv1_observe_decision: {text: "After observing, you feel more confident. Do you: a) Approach someone for a scene, b) Wait to be approached, c) Decide the event isn't for you and leave. (End of Path - User reflects on choice)", options:[]}
                }
            },
            { // Adventure 2: The Emerging Submissive (Fleshed Out Example)
                id: 'adventure2',
                title: "The Emerging Submissive",
                description: "You encounter someone new to BDSM, curious but hesitant. How does your archetype guide (or respond to) their first steps into this world?",
                startNode: 'adv2_node1',
                nodes: {
                    adv2_node1: {
                        text: "As a [UserArchetype], you're at a local munch. Someone you vaguely know approaches you, looking nervous. 'I've been reading about BDSM,' they say, 'and it seems... intriguing, but also scary. You seem experienced. Could I ask you some questions?' How do you initially respond?",
                        options: [
                            { text: "Warmly invite them to sit, offering to answer any questions they have and share some basic resources.", nextNode: 'adv2_node2_open' },
                            { text: "Be polite but slightly reserved, suggesting they join a beginner's discussion group first.", nextNode: 'adv2_node2_cautious' },
                            { text: "If you're Dominant-leaning: Offer a very brief, controlled 'taste' of a D/s interaction (like a simple command) right there, after asking if they'd be open to a tiny demonstration of dynamic.", nextNode: 'adv2_node2_dom_demo' },
                            { text: "If you're Submissive-leaning: Share a brief, positive personal anecdote about your own early explorations and what helped you.", nextNode: 'adv2_node2_sub_share' }
                        ]
                    },
                    adv2_node2_open: {
                        text: "They visibly relax and start asking about safe words, finding partners, and what a 'scene' actually is. You answer patiently. They then ask, 'Could... could you maybe show me something simple? Or tell me what to do? Just for a moment?' You:",
                        options: [
                            { text: "Gently explain that even simple scenes require negotiation and consent, and you're not comfortable 'scening' at a munch, but offer to continue talking or meet for coffee to discuss further.", nextNode: 'adv2_end_educate_coffee' },
                            { text: "Suggest a very simple, non-physical power exchange: 'For the next five minutes, only speak when I ask you a question.' Gauge their reaction.", nextNode: 'adv2_node3_simple_exchange' },
                            { text: "Decline to 'show' them anything, reiterating the importance of them finding their own path and trusted partners.", nextNode: 'adv2_end_firm_guidance' }
                        ]
                    },
                    adv2_node2_cautious: {
                        text: "They seem a little disappointed but thank you for the suggestion. Later, you see them looking lost in the crowd. Do you:",
                        options: [
                            { text: "Approach them again, soften your stance, and offer to chat more personally after all.", nextNode: 'adv2_node2_open' }, // Loop back with a change of heart
                            { text: "Let them be, respecting their space and your initial boundary.", nextNode: 'adv2_end_respect_space' }
                        ]
                    },
                    adv2_node2_dom_demo: {
                        text: "You ask, 'Would you be comfortable if I asked you to pass me that napkin, using a specific tone?' They agree, looking intrigued. You give the simple command. They comply, a small smile playing on their lips. What's your next move?",
                        options: [
                            { text: "Praise their responsiveness and then smoothly transition back to a normal conversation, explaining how even small exchanges can feel different in a D/s frame.", nextNode: 'adv2_end_educate_coffee' },
                            { text: "Give another, slightly more involved (but still public-appropriate) command to see their reaction.", nextNode: 'adv2_node3_escalate_gently' },
                            { text: "Stop there, thank them for their participation, and offer to answer more questions.", nextNode: 'adv2_end_brief_demo_talk'}
                        ]
                    },
                    adv2_node2_sub_share: {
                        text: "Your story seems to reassure them. 'So it's not all... scary and extreme?' they ask. 'It can be about trust and connection too?' You reply:",
                        options: [
                            { text: "'Absolutely. For many, it's deeply about that. The intensity comes from the trust, not just the act.'", nextNode: 'adv2_end_reassured' },
                            { text: "'It can be whatever you and your partner(s) negotiate it to be, as long as it's consensual.'", nextNode: 'adv2_end_educate_coffee' }
                        ]
                    },
                    adv2_node3_simple_exchange: { text: "They follow your instruction for five minutes. Afterwards, they seem thoughtful. You've given them a tiny, safe glimpse. (End of Path - A Taste of Dynamic)", options: [] },
                    adv2_node3_escalate_gently: { text: "You give another simple command. They either comply with growing interest or show signs of discomfort. This path tests your ability to read cues and not push too far, too fast in a public, unnegotiated setting. (End of Path - Attunement Tested)", options: [] },
                    adv2_end_educate_coffee: { text: "You arrange to meet for coffee. The extended, focused conversation helps them understand BDSM fundamentals much better, and they feel grateful for your patient mentorship. (End of Path - Mentorship Begins)", options: [] },
                    adv2_end_firm_guidance: { text: "They respect your decision and thank you for your time. You've empowered them to seek their own journey responsibly. (End of Path - Empowered Seeker)", options: [] },
                    adv2_end_respect_space: { text: "You decide to let them navigate the social setting on their own, trusting they will find their way or ask for help if truly needed. (End of Path - Respecting Autonomy)", options: [] },
                    adv2_end_brief_demo_talk: { text: "The brief demonstration sparked their curiosity further, and they now have more specific questions based on that tiny experience. (End of Path - Spark Ignited)", options: [] },
                    adv2_end_reassured: { text: "Your reassurance visibly helps them. They express a desire to learn more about the trust and connection aspects. (End of Path - Comfort Provided)", options: [] }
                }
            },
            { // Adventure 3: The Broken Protocol (More fleshed out)
                id: 'adventure3',
                title: "The Broken Protocol",
                description: "A critical rule in your established dynamic is broken by your partner. How does your [UserArchetype] handle the breach and its aftermath?",
                startNode: 'adv3_node1',
                nodes: {
                    adv3_node1: {
                        text: "You are a [UserArchetype]. In your long-standing dynamic with Pat, a clear protocol (e.g., a specific morning ritual, a hard limit about discussing certain topics during playtime, a task that must always be done) has been consistently upheld. Today, Pat deliberately and obviously breaks this protocol without warning or explanation. Your immediate internal reaction is one of [shock/anger/disappointment/curiosity]. How do you respond externally?",
                        options: [
                            { text: "Immediately and sternly address the breach: 'Pat, you know this is a breach of protocol. Explain yourself.'", nextNode: 'adv3_node2_direct_confront' },
                            { text: "Say nothing immediately, but make your displeasure known through coldness or withdrawal, waiting for Pat to address it.", nextNode: 'adv3_node2_cold_shoulder' },
                            { text: "Calmly state: 'I notice protocol was broken. We need to discuss this later when we both have a clear head.'", nextNode: 'adv3_node2_defer_discuss' },
                            { text: "Playfully ask: 'Oh? Are we trying something new today, or did someone forget the rules?'", nextNode: 'adv3_node2_playful_query' }
                        ]
                    },
                    adv3_node2_direct_confront: {
                        text: "Pat looks flustered/defiant/apologetic [choose one or let user imagine]. They say, 'I just... I couldn't do it today/I wanted to see what you'd do.' You:",
                        options: [
                            { text: "Insist on the importance of protocol and implement an immediate consequence.", nextNode: 'adv3_end_consequence_A' },
                            { text: "Explore their reasoning. 'Why couldn't you? Or why did you want to test me?'", nextNode: 'adv3_node3_explore_why' }
                        ]
                    },
                    adv3_node2_cold_shoulder: {
                        text: "Pat eventually notices your demeanor. 'Is something wrong, [UserArchetype]?' they ask tentatively. You reply:",
                        options: [
                            { text: "'You know perfectly well what's wrong. The protocol regarding X.'", nextNode: 'adv3_node3_explain_coldly' },
                            { text: "'I'm surprised you had to ask. We can discuss your lapse later.' And maintain distance.", nextNode: 'adv3_node2_defer_discuss' }
                        ]
                    },
                    adv3_node2_defer_discuss: {
                        text: "Later, in a neutral setting, you bring up the broken protocol. 'Pat, earlier you broke protocol X. Can you tell me what happened?' Pat explains they've been feeling [stressed/rebellious/that the protocol is stifling]. You:",
                        options: [
                            { text: "Acknowledge their feelings but reiterate the importance of upholding agreements. Discuss if the protocol needs adjustment or if Pat needs support.", nextNode: 'adv3_end_negotiate_support' },
                            { text: "Focus on the breach: 'Your feelings are valid, but breaking protocol without discussion is unacceptable. There will be consequences, and then we can discuss adjustments.'", nextNode: 'adv3_end_consequence_B' }
                        ]
                    },
                    adv3_node2_playful_query: {
                        text: "Pat smirks/looks sheepish. 'Maybe I just wanted to shake things up, [UserArchetype]! Or maybe I just forgot...' Their tone is light, but you sense an underlying current. You:",
                        options: [
                            { text: "Match their playfulness but steer it towards a reminder: 'Well, shaking things up can be fun, but unannounced changes to important rules can have... interesting outcomes. Shall we explore those outcomes now?'", nextNode: 'adv3_end_playful_consequence' },
                            { text: "Drop the playfulness: 'Forgetting isn't an option for this protocol, Pat. What's really going on?'", nextNode: 'adv3_node3_explore_why' }
                        ]
                    },
                    adv3_node3_explore_why: { text: "Pat confesses they've been feeling [a specific emotion, e.g., unheard, constrained, needing more attention] and the protocol break was a cry for attention or a test. This opens a deeper conversation about the dynamic's health. (End of Path - Deeper Understanding Reached)", options: [] },
                    adv3_node3_explain_coldly: { text: "Pat apologizes, explaining their reasons (similar to defer_discuss). The coldness made the conversation harder, but you eventually discuss the underlying issues. (End of Path - Difficult Conversation, Resolution Possible)", options: [] },
                    adv3_end_consequence_A: { text: "The consequence is delivered. Pat accepts it. The immediate order is restored, but the 'why' behind the breach might still linger. (End of Path - Order Restored, Underlying Issue Unclear)", options: [] },
                    adv3_end_negotiate_support: { text: "You both agree to adjust the protocol slightly or find ways for Pat to communicate their needs better. The dynamic strengthens. (End of Path - Growth and Adaptation)", options: [] },
                    adv3_end_consequence_B: { text: "After consequences, the discussion about adjustments is more strained but necessary. Trust may need rebuilding. (End of Path - Strict Adherence, Strained Discussion)", options: [] },
                    adv3_end_playful_consequence: { text: "The situation diffuses into a playful scene around 're-educating' Pat on the rules, but you make a mental note to check in more seriously later. (End of Path - Playful Deflection, Serious Check-in Needed)", options: [] }
                }
            },
            { id: 'adventure4', title: "The Unforeseen Interruption", description: "You're deep in an intense scene when an unexpected real-world interruption occurs. How do you, as [UserArchetype], manage the situation?", startNode: 'adv4_node1', nodes: { adv4_node1: { text: "As a [UserArchetype], you are in the midst of a carefully constructed, intense [impact/sensory/psychological] scene. Your partner is deeply in subspace. Suddenly, your phone, which you thought was silenced, rings loudly – it's a call from a family member known for only calling in emergencies. You:", options: [ {text:"Immediately call 'Red!' or your emergency stop word, bringing the scene to a full halt. You quickly ensure your partner is safe and coming out of subspace before even glancing at the phone.", nextNode: 'adv4_safety_first'}, {text:"Try to ignore the phone, hoping it stops, not wanting to break the profound state your partner is in.", nextNode: 'adv4_ignore_call'}, {text:"Signal a brief 'pause' to your partner (if possible and safe), quickly check the caller ID, then decide whether to answer or immediately return to the scene/full stop.", nextNode: 'adv4_quick_check'} ]}, adv4_safety_first:{text:"It was a true family emergency. You handle it. Later, you provide extensive aftercare to your partner for the abrupt end and discuss how to better manage interruptions in the future. Trust is reinforced. (End - Responsibility Honored)", options:[]}, adv4_ignore_call:{text:"The phone stops, but the jarring sound has already broken the spell. Your partner is disoriented, and you both feel the scene is lost. The missed call turns out to have been important, though not life-threatening. (End - Scene Disrupted, Real Life Intrudes)", options:[]}, adv4_quick_check:{text:"You see it's the family member and answer. It's a minor issue that could have waited. The scene is irrevocably broken, and your partner feels the interruption deeply. You discuss better phone protocols for future scenes. (End - Interruption Protocol Needed)", options:[]} } },
            { id: 'adventure5', title: "The Shifting Desire", description: "Your partner expresses a desire to explore a kink that is a soft limit for you. How does your [UserArchetype] navigate this conversation?", startNode: 'adv5_node1', nodes: { adv5_node1: { text: "Your partner, in a non-scene moment, expresses a genuine interest in exploring [a specific kink, e.g., knife play, public exhibitionism, a particular humiliation] which you have previously stated is a soft limit for you. As a [UserArchetype], you respond by:", options: [ {text:"Gently but firmly reiterating it's a soft limit and explaining *why* it makes you hesitant, and that you're not ready to explore it now, but appreciate them sharing.", nextNode: 'adv5_explain_hesitation'}, {text:"Asking them to elaborate on their interest: what specifically appeals to them about it? What are their expectations? This helps you understand their desire better before restating your boundaries.", nextNode: 'adv5_seek_understanding'}, {text:"Feeling pressured, you tentatively agree to 'maybe think about it' or 'try a very small version,' even though you're still very uncomfortable.", nextNode: 'adv5_tentative_agreement'} ]}, adv5_explain_hesitation:{text:"Your partner understands (or at least accepts) your position. The conversation may lead to discussing alternative ways to meet their underlying desires that don't cross your limit. (End - Boundary Upheld, Dialogue Open)", options:[]}, adv5_seek_understanding:{text:"Their explanation gives you more context. You might find a version of it you *are* comfortable with, or you might still decline, but the conversation is more informed. (End - Informed Decision, Potential Compromise)", options:[]}, adv5_tentative_agreement:{text:"This can lead to an uncomfortable or even boundary-violating experience if you're not truly okay with it. Resentment might build. (End - Discomfort Looms, True Consent Questionable)", options:[]} } }
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
        if (this.app.styleDescriptions[archName] || archName === "General") {
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
        if (allDilemmasByArchetype["General"] && allDilemmasByArchetype["General"].length > 0) {
            availableDilemmas = allDilemmasByArchetype["General"];
        } else { 
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
    if (!this.currentDilemma) { 
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
    let html = `<p class="scenario-text">${this.currentScenario.prompt.replace(/\[UserArchetype\]/g, userArch.name)}</p>`; // Global replace
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
        if(this.currentAdventure) {
             endNavHTML += `<button id="restart-adventure-btn" class="playground-action-btn" data-adventure-id="${this.currentAdventure.id}">Restart This Adventure</button>`;
        }
        endNavHTML += `<button id="choose-another-adventure-btn" class="playground-action-btn">Choose Another Adventure</button>`;
        endNavHTML += `</div>`;
        this.playgroundContentEl.innerHTML = "<p>Adventure ended or an error occurred in the story path.</p>" + endNavHTML;
        return;
    }
    const userArch = this.getUserArchetype();
    let html = `<h3>${this.currentAdventure.title} <span class="arch-context">(as a ${userArch.name} ${userArch.icon})</span></h3>`;
    html += `<p class="scenario-text">${node.text.replace(/\[UserArchetype\]/g, userArch.name)}</p>`;
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
