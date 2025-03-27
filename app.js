: { short: "You lead with bold, decisive energy.", long: "Assertives take charge with confidence and intensity, thriving in dynamics where their authority shapes the scene.", tips: ["Stay clear and direct.", "Pair with a Submissive.", "Temper boldness with care."] },
      Nurturer: { short: "You guide with warmth and care.", long: "Nurturers blend control with empathy, creating a dynamic where guidance feels like a warm embrace. It’s about support and growth.", tips: ["Be patient and attentive.", "Pair with a Little or Pet.", "Foster trust and safety."] },
      Strict: { short: "You enforce rules with unwavering precision.", long: "Stricts maintain order and discipline, finding satisfaction in structure and obedience. This style is firm but fair.", tips: ["Set clear expectations.", "Pair with a Slave or Servant.", "Reward compliance."] },
      Master: { short: "You lead with authority and deep responsibility.", long: "Masters take on a profound role, guiding their partner with a blend of control, care, and commitment. This style often involves a structured, trusting dynamic.", tips: ["Build trust gradually.", "Understand your partner’s needs.", "Negotiate all terms clearly."] },
      Mistress: { short: "You command with grace and power.", long: "Mistresses lead with confidence and creativity, often blending sensuality with control in a dynamic that’s both elegant and intense.", tips: ["Embrace your power.", "Pair with a Slave or Toy.", "Explore creative control."] },
      Daddy: { short: "You protect and nurture with a firm hand.", long: "Daddies blend care with authority, offering guidance and structure in a dynamic that’s both loving and firm.", tips: ["Be consistent.", "Pair with a Little or Babygirl.", "Balance discipline with affection."] },
      Mommy: { short: "You nurture and guide with warmth.", long: "Mommies offer a blend of care and control, creating a safe space for their partner to explore and grow.", tips: ["Be patient and loving.", "Pair with a Little or Pet.", "Encourage growth."] },
      Owner: { short: "You take pride in possessing and caring for your partner.", long: "Owners find fulfillment in control and responsibility, often in dynamics involving pet play or total power exchange.", tips: ["Set clear rules.", "Pair with a Pet or Slave.", "Provide structure and care."] },
      Rigger: { short: "You’re an artist of restraint and sensation.", long: "Riggers excel in the art of bondage, creating intricate ties that blend creativity with control and trust.", tips: ["Learn safety techniques.", "Pair with a Rope Bunny.", "Explore different styles."] },
      Sadist: { short: "You find joy in giving pain with care.", long: "Sadists enjoy the thrill of inflicting discomfort, always within the bounds of consent and trust. It’s about intensity and connection.", tips: ["Negotiate limits.", "Pair with a Masochist.", "Prioritize aftercare."] },
      Hunter: { short: "You thrive on the chase and capture.", long: "Hunters enjoy the dynamic tension of pursuit, finding excitement in the thrill of the hunt and the surrender that follows.", tips: ["Establish consent.", "Pair with Prey.", "Enjoy the game."] },
      Trainer: { short: "You guide with patience and structure.", long: "Trainers focus on teaching and molding their partner, often in dynamics involving behavior modification or skill development.", tips: ["Be clear and consistent.", "Pair with a Pet or Slave.", "Celebrate progress."] },
      Puppeteer: { short: "You control with creativity and precision.", long: "Puppeteers enjoy directing every move, often in dynamics where their partner becomes an extension of their will.", tips: ["Communicate clearly.", "Pair with a Doll or Toy.", "Explore your vision."] },
      Protector: { short: "You lead with strength and care.", long: "Protectors blend authority with a deep sense of responsibility, ensuring their partner feels safe and valued.", tips: ["Be vigilant and kind.", "Pair with a Little or Pet.", "Foster trust."] },
      Disciplinarian: { short: "You enforce rules with a firm, steady hand.", long: "Disciplinarians excel at setting boundaries and maintaining order, often enjoying the challenge of guiding a playful or resistant partner.", tips: ["Be clear about rules.", "Stay patient and fair.", "Reward compliance."] },
      Caretaker: { short: "You nurture and support with love.", long: "Caretakers provide a safe, loving space for their partner to explore their role, often in dynamics involving age play or pet play.", tips: ["Be attentive and gentle.", "Pair with a Little or Pet.", "Encourage exploration."] },
      Sir: { short: "You lead with honor and respect.", long: "Sirs command with a blend of authority and integrity, often in dynamics that value tradition and structure.", tips: ["Uphold your values.", "Pair with a Submissive or Slave.", "Lead by example."] },
      Goddess: { short: "You’re worshipped and adored.", long: "Goddesses embody power and grace, often in dynamics where their partner offers devotion and service.", tips: ["Embrace your divinity.", "Pair with a Thrall or Servant.", "Set high standards."] },
      Commander: { short: "You lead with strategic control.", long: "Commanders take charge with precision and vision, often in dynamics that involve complex scenes or power exchange.", tips: ["Plan carefully.", "Pair with a Switch or Submissive.", "Execute with confidence."] }
    };
    this.sfDynamicMatches = {
      'Classic Submissive': { dynamic: "Power Exchange", match: "Classic Dominant", desc: "A classic duo where trust flows freely.", longDesc: "This dynamic thrives on mutual respect and clear roles." },
      Brat: { dynamic: "Taming Play", match: "Disciplinarian", desc: "A fun push-and-pull full of sparks!", longDesc: "The Brat’s resistance meets the Disciplinarian’s control." },
      Slave: { dynamic: "Master/Slave", match: "Master", desc: "A bond built on deep trust.", longDesc: "High power exchange with devotion and structure." },
      Pet: { dynamic: "Pet Play", match: "Owner", desc: "A playful bond of care.", longDesc: "Affection and playfulness define this dynamic." },
      Little: { dynamic: "Age Play", match: "Caretaker/Daddy/Mommy", desc: "A nurturing space for innocence.", longDesc: "Care and trust create a loving bond." },
      Puppy: { dynamic: "Pup Play", match: "Trainer/Owner", desc: "A lively bond of play.", longDesc: "Energy and discipline in a playful dynamic." },
      Kitten: { dynamic: "Kitten Play", match: "Owner/Nurturer", desc: "A sensual connection.", longDesc: "Charm and control blend beautifully." },
      Princess: { dynamic: "Pampering Play", match: "Daddy/Sir", desc: "A regal bond of care.", longDesc: "Spoiling meets nurturing structure or respectful service." },
      'Rope Bunny': { dynamic: "Bondage Play", match: "Rigger", desc: "An artistic exchange.", longDesc: "Trust and creativity in bondage." },
      Masochist: { dynamic: "Sadomasochism", match: "Sadist", desc: "A thrilling exchange.", longDesc: "Pain and pleasure in a trusting dynamic." },
      Prey: { dynamic: "Primal Play", match: "Hunter", desc: "A wild chase.", longDesc: "Pursuit and surrender fuel this bond." },
      Toy: { dynamic: "Objectification Play", match: "Owner/Puppeteer", desc: "A playful exchange.", longDesc: "Control and adaptability shine here." },
      Doll: { dynamic: "Transformation Play", match: "Puppeteer/Master", desc: "A creative bond.", longDesc: "Shaping and trust define this dynamic." },
      Bunny: { dynamic: "Bunny Play", match: "Caretaker/Protector", desc: "A sweet, gentle bond.", longDesc: "Innocence and care in play." },
      Servant: { dynamic: "Service Play", match: "Master/Mistress/Sir", desc: "A structured bond of duty.", longDesc: "Duty and guidance create harmony." },
      Playmate: { dynamic: "Adventure Play", match: "Playmate/Switch", desc: "A shared journey of fun.", longDesc: "Fun and exploration define this partnership." },
      Babygirl: { dynamic: "Age Play", match: "Daddy/Mommy", desc: "A nurturing, affectionate space.", longDesc: "Love, guidance, and protection in trust." },
      Captive: { dynamic: "Captivity Play", match: "Hunter/Master", desc: "An intense struggle/surrender bond.", longDesc: "Control and surrender thrill here." },
      Thrall: { dynamic: "Devotion/Worship Play", match: "Goddess/Master", desc: "A deep bond of loyalty.", longDesc: "Loyalty and worship meet commanding presence." },
      Puppet: { dynamic: "Puppet Play", match: "Puppeteer", desc: "A dance of control and response.", longDesc: "The Puppet’s adaptability meets the Puppeteer’s precise direction." },
      Maid: { dynamic: "Service Play", match: "Mistress/Sir/Master", desc: "A refined exchange of duty.", longDesc: "Tidiness and politeness shine under elegant or formal command." },
      Painslut: { dynamic: "Sadomasochism", match: "Sadist", desc: "A fiery bond of intensity.", longDesc: "Craving meets skillful delivery in a thrilling exchange." },
      Bottom: { dynamic: "Sensation/Power Play", match: "Classic Dominant/Sadist/Rigger", desc: "A steady flow of give and take.", longDesc: "Receptiveness pairs well with various forms of topping." },
      'Classic Dominant': { dynamic: "Power Exchange", match: "Classic Submissive", desc: "A balanced duo.", longDesc: "Guidance meets trust perfectly." },
      Assertive: { dynamic: "Assertive Control", match: "Classic Submissive/Bottom", desc: "A bold exchange.", longDesc: "Authority shapes this bond, requiring clear reception." },
      Nurturer: { dynamic: "Nurturing Care", match: "Little/Pet/Kitten", desc: "A warm bond.", longDesc: "Care fosters growth and comfort here." },
      Strict: { dynamic: "Discipline Play", match: "Slave/Servant/Brat", desc: "A firm bond.", longDesc: "Order meets obedience or playful challenge." },
      Master: { dynamic: "Master/Slave", match: "Slave/Servant", desc: "A deep relationship.", longDesc: "Authority and devotion blend seamlessly." },
      Mistress: { dynamic: "Mistress/Servant", match: "Servant/Slave/Toy", desc: "An elegant bond.", longDesc: "Grace and service or playful objectification shine." },
      Daddy: { dynamic: "Daddy/Little", match: "Little/Babygirl/Princess", desc: "A nurturing bond.", longDesc: "Care and play meet innocence and need." },
      Mommy: { dynamic: "Mommy/Little", match: "Little/Pet", desc: "A loving bond.", longDesc: "Warmth, guidance, and growth here." },
      Owner: { dynamic: "Owner/Pet", match: "Pet/Puppy/Kitten/Toy", desc: "A playful or possessive bond.", longDesc: "Control and care meet animal personas or objectification." },
      Rigger: { dynamic: "Bondage Play", match: "Rope Bunny", desc: "An artistic exchange.", longDesc: "Creativity and trust are woven into ties." },
      Sadist: { dynamic: "Sadomasochism", match: "Masochist/Painslut", desc: "A thrilling exchange.", longDesc: "Infliction meets reception safely and intensely." },
      Hunter: { dynamic: "Primal Play", match: "Prey/Captive", desc: "A wild chase.", longDesc: "Pursuit fuels this energetic bond." },
      Trainer: { dynamic: "Training Play", match: "Puppy/Slave/Pet", desc: "A structured growth bond.", longDesc: "Discipline and skill development are key." },
      Puppeteer: { dynamic: "Control Play", match: "Doll/Puppet/Toy", desc: "A creative bond of control.", longDesc: "Precision shapes this artistic dynamic." },
      Protector: { dynamic: "Protection Play", match: "Little/Pet/Bunny", desc: "A strong, safe bond.", longDesc: "Vigilant care meets trust and vulnerability." },
      Disciplinarian: { dynamic: "Discipline Play", match: "Brat/Slave/Submissive", desc: "A lively challenge or ordered structure.", longDesc: "Control meets defiance or willing compliance." },
      Caretaker: { dynamic: "Caretaking Play", match: "Little/Pet/Bunny", desc: "A deeply nurturing bond.", longDesc: "Love, support, and exploration define this." },
      Sir: { dynamic: "Sir/Submissive", match: "Classic Submissive/Servant/Maid", desc: "A respectful, formal bond.", longDesc: "Honor meets obedience or refined service." },
      Goddess: { dynamic: "Worship Play", match: "Thrall/Slave/Servant", desc: "A divine, reverent bond.", longDesc: "Adoration meets effortless command." },
      Commander: { dynamic: "Command Play", match: "Classic Submissive/Slave/Switch", desc: "A strategic, decisive bond.", longDesc: "Control meets obedience or adaptable execution." }
    };
    this.sfStyleKeyTraits = { // Mapping for scoring - Ensure keys match sfStyleDescriptions & sfDynamicMatches
      'Classic Submissive': ['obedience', 'service', 'presentation', 'trust'], 'Brat': ['playful defiance', 'mischief', 'trust'], 'Slave': ['devotion', 'surrender', 'obedience', 'service'], 'Pet': ['affection seeking', 'playfulness', 'non-verbal expression', 'trust'], 'Little': ['age regression comfort', 'need for guidance', 'trust'], 'Puppy': ['boundless energy', 'trainability', 'obedience'], 'Kitten': ['curiosity', 'gracefulness', 'affection seeking'], 'Princess': ['desire for pampering', 'delegation tendency', 'innocence'], 'Rope Bunny': ['rope enthusiasm', 'patience during tying', 'sensuality'], 'Masochist': ['pain interpretation', 'sensation seeking', 'trust'], 'Prey': ['enjoyment of chase', 'fear play comfort', 'vulnerability'], 'Toy': ['objectification comfort', 'responsiveness to control', 'adaptability'], 'Doll': ['aesthetic focus', 'stillness / passivity', 'objectification comfort'], 'Bunny': ['shyness / skittishness', 'gentle affection need', 'innocence'], 'Servant': ['task focus', 'anticipating needs', 'obedience', 'politeness'], 'Playmate': ['enthusiasm for games', 'good sport', 'playfulness'], 'Babygirl': ['vulnerability expression', 'coquettishness', 'need for guidance'], 'Captive': ['struggle performance', 'acceptance of fate', 'vulnerability'], 'Thrall': ['mental focus', 'suggestibility', 'devotion'], 'Puppet': ['responsiveness to direction', 'passivity in control', 'adaptability'], 'Maid': ['attention to detail', 'uniformity', 'service'], 'Painslut': ['pain seeking', 'endurance display', 'craving'], 'Bottom': ['receptivity', 'power exchange focus', 'painTolerance'],
      'Classic Dominant': ['leadership', 'control', 'authority', 'care'], 'Assertive': ['direct communication', 'boundary setting', 'authority'], 'Nurturer': ['emotional support', 'patience', 'care', 'empathy'], 'Strict': ['rule enforcement', 'discipline focus', 'authority'], 'Master': ['expectation setting', 'presence', 'authority', 'control'], 'Mistress': ['expectation setting', 'presence', 'authority', 'creativity'], 'Daddy': ['protective guidance', 'affectionate authority', 'care'], 'Mommy': ['nurturing comfort', 'gentle discipline', 'care'], 'Owner': ['possessiveness', 'behavioral training', 'control'], 'Rigger': ['rope technique', 'aesthetic vision', 'precision', 'care'], 'Sadist': ['sensation control', 'psychological focus', 'intensity', 'care'], 'Hunter': ['pursuit drive', 'instinct reliance', 'boldness'], 'Trainer': ['skill development focus', 'structured methodology', 'patience', 'discipline focus'], 'Puppeteer': ['fine motor control', 'objectification gaze', 'control', 'creativity'], 'Protector': ['vigilance', 'defensive instinct', 'care', 'authority'], 'Disciplinarian': ['consequence delivery', 'detachment during discipline', 'rule enforcement'], 'Caretaker': ['holistic well-being focus', 'rule implementation for safety', 'care'], 'Sir': ['formal demeanor', 'service expectation', 'authority'], 'Goddess': ['worship seeking', 'effortless command', 'presence'], 'Commander': ['strategic direction', 'decisiveness', 'leadership', 'authority']
    };

    // --- Element Mapping ---
    this.elements = {
      formSection: document.getElementById('form-section'),
      name: document.getElementById('name'),
      avatarDisplay: document.getElementById('avatar-display'),
      avatarInput: document.getElementById('avatar-input'),
      avatarPicker: document.querySelector('.avatar-picker'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      formStyleFinderLink: document.getElementById('form-style-finder-link'), // Link inside form
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
      resourcesBody: document.getElementById('resources-body'), // Added ID for content
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
      themeToggle: document.getElementById('theme-toggle'),
      // Style Finder elements
      styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'),
      sfModal: document.getElementById('style-finder-modal'),
      sfCloseBtn: document.getElementById('sf-close-style-finder'),
      sfProgressTracker: document.getElementById('sf-progress-tracker'),
      sfStepContent: document.getElementById('sf-step-content'),
      sfFeedback: document.getElementById('sf-feedback'),
      sfDashboard: document.getElementById('sf-dashboard'),
      // Added Title IDs for Modals
      detailModalTitle: document.getElementById('detail-modal-title'),
      resourcesModalTitle: document.getElementById('resources-modal-title'),
      glossaryModalTitle: document.getElementById('glossary-modal-title'),
      styleDiscoveryTitle: document.getElementById('style-discovery-title'),
      themesModalTitle: document.getElementById('themes-modal-title'),
      sfModalTitle: document.getElementById('sf-modal-title'),
      formTitle: document.getElementById('form-title'),
    };

    // Critical element check
    const criticalElements = ['name', 'role', 'style', 'save', 'peopleList', 'modal', 'sfModal', 'sfStepContent', 'styleFinderTriggerBtn', 'glossaryBody', 'resourcesBody', 'styleDiscoveryBody', 'themesBody', 'modalBody', 'livePreview', 'traitsContainer'];
    let missingElement = false;
    for (const key of criticalElements) { if (!this.elements[key]) { console.error(`Missing critical element: ID '${key}'`); missingElement = true; } }
    if (missingElement) { throw new Error("Missing critical HTML elements. Cannot initialize KinkCompass."); }

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value); // Initial render based on default role
    this.renderTraits(this.elements.role.value, this.elements.style.value); // Initial trait render
    this.renderList();
    this.updateLivePreview();
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage(){try{const data=localStorage.getItem('kinkProfiles');const profiles=data?JSON.parse(data):[];this.people=profiles.map(p=>({...p,id:p.id??Date.now(),name:p.name??"Unnamed",role:p.role??"submissive",style:p.style??"",avatar:p.avatar||'❓',goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'&&p.reflections!==null?p.reflections:{text:p.reflections||''},traits:typeof p.traits==='object'&&p.traits!==null?p.traits:{}}));console.log(`Loaded ${this.people.length} profiles.`);}catch(e){console.error("Failed to load profiles:",e);this.people=[];}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length} profiles.`);}catch(e){console.error("Failed to save profiles:",e);this.showNotification("Error saving data. Storage might be full.", "error");}}


  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Attaching event listeners...");
    // Role change
    this.elements.role?.addEventListener('change', (e) => {
        const selectedRole = e.target.value;
        this.renderStyles(selectedRole); // Update style dropdown
        this.elements.style.value = ''; // Reset style selection
        this.renderTraits(selectedRole, ''); // Clear/update traits
        this.updateLivePreview();
    });

    // Style change
    this.elements.style?.addEventListener('change', (e) => {
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
    });

    // Name input
    this.elements.name?.addEventListener('input', () => this.updateLivePreview());

    // Avatar Picker
    this.elements.avatarPicker?.addEventListener('click', (e) => {
        if (e.target.classList.contains('avatar-btn')) {
            const emoji = e.target.dataset.emoji;
            if (emoji) {
                this.elements.avatarInput.value = emoji;
                this.elements.avatarDisplay.textContent = emoji;
                // Update selected state
                this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => {
                    btn.classList.toggle('selected', btn === e.target);
                });
                this.updateLivePreview();
            }
        }
    });

    // Form buttons
    this.elements.save?.addEventListener('click', () => this.savePerson());
    this.elements.clearForm?.addEventListener('click', () => this.resetForm(true)); // Pass true to confirm clear

     // Link within form to open Style Finder
    this.elements.formStyleFinderLink?.addEventListener('click', () => this.sfStart());

    // Trait interaction
    this.elements.traitsContainer?.addEventListener('input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e);
        }
    });
    this.elements.traitsContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('trait-info-btn')) {
            this.handleTraitInfoClick(e);
        }
    });
    this.elements.traitInfoClose?.addEventListener('click', () => this.hideTraitInfo());

    // Profile List interaction
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));

    // Header Buttons & Modals
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => this.sfStart());
    this.elements.sfCloseBtn?.addEventListener('click', () => this.sfClose());

    this.elements.styleDiscoveryBtn?.addEventListener('click', () => this.showStyleDiscovery());
    this.elements.styleDiscoveryClose?.addEventListener('click', () => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => this.renderStyleDiscoveryContent());

    this.elements.glossaryBtn?.addEventListener('click', () => this.showGlossary());
    this.elements.glossaryClose?.addEventListener('click', () => this.closeModal(this.elements.glossaryModal));

    this.elements.resourcesBtn?.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose?.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));

    this.elements.themesBtn?.addEventListener('click', () => this.openModal(this.elements.themesModal));
    this.elements.themesClose?.addEventListener('click', () => this.closeModal(this.elements.themesModal));
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));

    this.elements.exportBtn?.addEventListener('click', () => this.exportData());
    this.elements.importBtn?.addEventListener('click', () => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change', (e) => this.importData(e));

    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Detail Modal Interaction (Delegated)
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));
    this.elements.modalClose?.addEventListener('click', () => this.closeModal(this.elements.modal));


    // Style Finder Modal Interaction (Delegated)
    this.elements.sfStepContent?.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (button) {
            this.handleStyleFinderAction(button.dataset.action, button.dataset);
            return;
        }
        const icon = e.target.closest('.sf-info-icon[data-trait]');
        if (icon) {
            this.handleStyleFinderAction('showTraitInfo', icon.dataset);
            return;
        }
    });
    this.elements.sfStepContent?.addEventListener('input', (e) => {
        if (e.target.classList.contains('sf-trait-slider') && e.target.dataset.trait) {
            this.handleStyleFinderSliderInput(e.target);
        }
    });
    document.body.addEventListener('click', (e) => { // For dynamic SF popups
      if (e.target.classList.contains('sf-close-btn')) {
          e.target.closest('.sf-style-info-popup')?.remove();
      }
    });

    // General Window Listeners (Modal closing)
    window.addEventListener('click', (e) => this.handleWindowClick(e));
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));

    console.log("Event listeners setup complete.");
  } // --- End addEventListeners ---


  // --- Event Handlers ---
  handleListClick(e){const li=e.target.closest('.person');if(!li)return;const id=parseInt(li.dataset.id,10);if(isNaN(id))return;console.log("List Click on ID:",id,"Target:",e.target);const actionTarget=e.target.closest('button');const action=actionTarget?actionTarget.dataset.action:null;if(action==='edit'){this.editPerson(id);}else if(action==='delete'){this.deletePerson(id);}else{this.showPersonDetails(id);}}
  handleListKeydown(e){const li=e.target.closest('.person');if(!li)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=parseInt(li.dataset.id,10);if(!isNaN(id))this.showPersonDetails(id);}}
  handleWindowClick(e){const target=e.target;if(target.classList.contains('modal')){if(target===this.elements.modal)this.closeModal(this.elements.modal);else if(target===this.elements.sfModal)this.sfClose();else if(target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);else if(target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);else if(target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);else if(target===this.elements.themesModal)this.closeModal(this.elements.themesModal);}}
  handleWindowKeydown(e){if(e.key==='Escape'){if(this.elements.modal?.style.display!=='none')this.closeModal(this.elements.modal);if(this.elements.sfModal?.style.display!=='none')this.sfClose();if(this.elements.resourcesModal?.style.display!=='none')this.closeModal(this.elements.resourcesModal);if(this.elements.glossaryModal?.style.display!=='none')this.closeModal(this.elements.glossaryModal);if(this.elements.styleDiscoveryModal?.style.display!=='none')this.closeModal(this.elements.styleDiscoveryModal);if(this.elements.themesModal?.style.display!=='none')this.closeModal(this.elements.themesModal);}}
  handleTraitSliderInput(e){const slider=e.target;this.updateTraitDescription(slider);this.updateLivePreview();const value=slider.value;const person=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;if(person){if(value==='5')grantAchievement(person,'max_trait');if(value==='1')grantAchievement(person,'min_trait');}}
  handleTraitInfoClick(e){const button=e.target;const traitName=button.dataset.trait;if(traitName)this.showTraitInfo(traitName);}
  handleModalBodyClick(e){const target=e.target;const button=target.closest('button');const check=button||target;if(!check)return;const id=check.id;const classList=check.classList;const personId=parseInt(check.dataset.personId,10);const goalId=parseInt(check.dataset.goalId,10);console.log("Detail Modal Click: Elm:",check,"ID:",id,"Class:",classList);if(id==='save-reflections-btn'&&!isNaN(personId)){this.saveReflections(personId);}else if(id==='prompt-btn'){this.showJournalPrompt(personId);}else if(id==='snapshot-btn'&&!isNaN(personId)){this.addSnapshotToHistory(personId);}else if(classList.contains('snapshot-info-btn')){this.toggleSnapshotInfo(check);}else if(id==='reading-btn'&&!isNaN(personId)){this.showKinkReading(personId);}else if(classList.contains('add-goal-btn')&&!isNaN(personId)){this.addGoal(personId);}else if(classList.contains('toggle-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.toggleGoalStatus(personId,goalId);}else if(classList.contains('delete-goal-btn')&&!isNaN(personId)&&!isNaN(goalId)){this.deleteGoal(personId,goalId);}else{console.log("No matching detail modal action.");}}
  handleThemeSelection(e){const button=e.target.closest('.theme-option-btn');if(button){const themeName=button.dataset.theme;if(themeName){this.setTheme(themeName);grantAchievement({},'theme_changer');this.closeModal(this.elements.themesModal);}}} // Close modal on selection

  handleStyleFinderAction(action, dataset = {}) {
      console.log("SF Action:", action, dataset);
      switch (action) {
          case 'next':
              const currentTrait = dataset.trait;
              const currentStepType = this.sfSteps[this.sfStep]?.type;
              if (currentStepType === 'trait' && currentTrait && this.sfAnswers.traits[currentTrait] === undefined) {
                   this.sfShowFeedback("Please slide to pick a vibe first!");
                   return;
              }
              this.sfNextStep();
              break;
          case 'prev':
              this.sfPrevStep();
              break;
          case 'setRole':
              if (dataset.role) {
                  this.sfSetRole(dataset.role);
              } else {
                 console.error("Set role action triggered without role data.");
              }
              break;
          case 'startOver':
              this.sfStartOver();
              break;
          case 'close':
              this.sfClose();
              break;
           case 'applyStyle':
                const r= dataset.role;
                const s= dataset.style;
                if(r && s){
                    this.applyStyleFinderResult(r, s);
                } else {
                    alert("Error applying style. Role or Style missing.");
                     console.error("Apply Style Error: Missing role or style in dataset", dataset);
                }
                break;
           case 'showFullDetails':
               if (dataset.style) {
                   this.sfShowFullDetails(dataset.style);
               } else {
                  console.error("Show Full Details action triggered without style data.");
               }
               break;
          case 'showTraitInfo':
              if (dataset.trait) {
                   this.sfShowTraitInfo(dataset.trait);
              } else {
                   console.error("Show Trait Info action triggered without trait data.");
              }
              break;
          default:
              console.warn("Unknown Style Finder action:", action);
      }
  }

  handleStyleFinderSliderInput(sliderElement) {
      const traitName = sliderElement.dataset.trait;
      const value = parseInt(sliderElement.value, 10);
      if (traitName) {
          this.sfSetTrait(traitName, value);
          const descElement = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`);
          const descriptions = this.sfSliderDescriptions?.[traitName] ?? [];
          if (descElement) {
              const safeValue = Number(value);
              if (descriptions.length > 0 && safeValue >= 1 && safeValue <= descriptions.length) {
                   descElement.textContent = this.escapeHTML(descriptions[safeValue - 1]);
              } else {
                   descElement.textContent = `Level ${safeValue}`;
                   console.warn(`Slider description missing or invalid for trait '${traitName}' at value ${safeValue}`);
              }
          }
          this.sfUpdateDashboard();
      } else {
          console.error("Slider input event fired without data-trait attribute.");
      }
  }


  // --- Core Rendering ---
  renderStyles(roleKey) {
      const roleData = bdsmData[roleKey];
      const selectElement = this.elements.style;
      if (!selectElement) return;

      selectElement.innerHTML = '<option value="">-- Select a Style --</option>'; // Default option

      if (roleData && roleData.styles) {
          roleData.styles.forEach(style => {
              selectElement.innerHTML += `<option value="${this.escapeHTML(style.name)}">${this.escapeHTML(style.name)}</option>`;
          });
      } else if (roleKey === 'switch') {
           // Add default Switch styles if bdsmData doesn't define them explicitly
           bdsmData.switch?.styles?.forEach(style => { // Use optional chaining
               selectElement.innerHTML += `<option value="${this.escapeHTML(style.name)}">${this.escapeHTML(style.name)}</option>`;
           });
       }
       else {
          console.warn(`No styles found for role: ${roleKey}`);
          // Optionally disable the dropdown
          // selectElement.disabled = true;
      }
      // selectElement.disabled = !(roleData && roleData.styles && roleData.styles.length > 0); // Disable if no styles
  }

  renderTraits(roleKey, styleName) {
      const container = this.elements.traitsContainer;
      if (!container) return;

      container.innerHTML = ''; // Clear previous traits

      const roleData = bdsmData[roleKey];
      if (!roleData) {
          container.innerHTML = `<p class="muted-text">Select a valid role.</p>`;
          return;
      }

      const coreTraits = roleData.coreTraits || [];
      let styleTraits = [];
      let styleObj = null;
      let message = '';

      if (styleName) {
          styleObj = roleData.styles?.find(s => s.name === styleName);
          if (styleObj) {
              styleTraits = styleObj.traits || [];
              if (styleTraits.length === 0 && coreTraits.length > 0) {
                  message = `<p class="muted-text trait-info-message">Style '${this.escapeHTML(styleName)}' primarily uses the core traits for this role.</p>`;
              }
          } else {
              console.warn(`Style object not found for: ${roleKey} - ${styleName}`);
               message = `<p class="muted-text trait-info-message">Details for style '${this.escapeHTML(styleName)}' not found. Showing core traits.</p>`;
          }
      } else if (coreTraits.length === 0) {
          container.innerHTML = `<p class="muted-text">Select a style to see relevant traits, or define core traits for this role.</p>`;
          return
      } else {
           // No style selected, but core traits exist
            message = `<p class="muted-text trait-info-message">Select a style, or adjust core traits below.</p>`;
      }

      const traitsToRender = [];
      const uniqueTraitNames = new Set();

      // Combine and deduplicate traits, prioritizing style-specific ones if they exist
      [...styleTraits, ...coreTraits].forEach(trait => {
          if (trait && trait.name && !uniqueTraitNames.has(trait.name)) {
              // Find the full trait definition (prefer style, fallback to core)
              const fullTraitDef = styleTraits.find(st => st.name === trait.name) || coreTraits.find(ct => ct.name === trait.name);
              if (fullTraitDef) {
                  traitsToRender.push(fullTraitDef);
                  uniqueTraitNames.add(trait.name);
              }
          }
      });

      if (traitsToRender.length === 0 && !styleName) {
           container.innerHTML = `<p class="muted-text">No core traits defined for role '${roleKey}'. Select a style.</p>`;
           return;
       }
       if (traitsToRender.length === 0 && styleName) {
           container.innerHTML = `<p class="muted-text">No specific or core traits found for style '${this.escapeHTML(styleName)}'.</p>`;
           return;
       }


      // Render message first if it exists
      if(message) container.innerHTML += message;

      // Render trait sliders
      traitsToRender.forEach(trait => {
          container.innerHTML += this.createTraitHTML(trait);
      });

      // Update descriptions for the newly rendered sliders
      container.querySelectorAll('.trait-slider').forEach(slider => {
          this.updateTraitDescription(slider);
      });

      this.hideTraitInfo(); // Ensure info popup is hidden
  }

  createTraitHTML(trait) {
      const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
      const id = `trait-${trait.name.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
      const initialValue = 3; // Default value

      // Get description for initial value
       let initialDesc = 'Adjust slider...';
       if (trait.desc && trait.desc[initialValue]) {
           initialDesc = trait.desc[initialValue];
       } else if (trait.desc && trait.desc["3"]) { // Fallback check for string key "3"
            initialDesc = trait.desc["3"];
       } else {
           console.warn(`Initial description missing for trait '${trait.name}' at value 3.`);
       }


      return `
          <div class="trait">
              <label for="${id}">${this.escapeHTML(displayName)}</label>
              <button class="trait-info-btn" data-trait="${trait.name}" aria-label="Info about ${this.escapeHTML(displayName)}">ℹ️</button>
              <span class="trait-value">${initialValue}</span>
              <input type="range" id="${id}" min="1" max="5" value="${initialValue}" class="trait-slider" data-trait="${trait.name}" aria-label="${this.escapeHTML(displayName)} rating" autocomplete="off"/>
              <div class="trait-desc muted-text">${this.escapeHTML(initialDesc)}</div>
          </div>
      `;
  }

  updateTraitDescription(slider) {
      const traitName = slider.dataset.trait;
      const value = slider.value;
      const traitDescElement = slider.parentElement?.querySelector('.trait-desc');
      const traitValueElement = slider.parentElement?.querySelector('.trait-value');

      if (!traitDescElement || !traitValueElement || !traitName) return;

      // Update the displayed value number
      traitValueElement.textContent = value;

      // Find the trait definition (check current role/style)
      const roleKey = this.elements.role.value;
      const styleName = this.elements.style.value;
      const roleData = bdsmData[roleKey];
      let traitDef = null;

      if (roleData) {
           // Prioritize style-specific trait definition
           if (styleName) {
               const styleObj = roleData.styles?.find(s => s.name === styleName);
               traitDef = styleObj?.traits?.find(t => t.name === traitName);
           }
           // Fallback to core trait definition
           if (!traitDef) {
               traitDef = roleData.coreTraits?.find(t => t.name === traitName);
           }
            // Special check for Switch core traits if role is Switch
            if (!traitDef && roleKey === 'switch') {
                 traitDef = bdsmData.switch?.coreTraits?.find(t => t.name === traitName);
            }
      }


      // Update the text description
      if (traitDef?.desc && traitDef.desc[value]) {
          traitDescElement.textContent = this.escapeHTML(traitDef.desc[value]);
      } else {
          traitDescElement.textContent = traitDef ? 'Description unavailable for this level.' : 'Trait definition missing.';
          if(!traitDef) console.warn(`Trait definition not found for ${traitName} in role ${roleKey}/${styleName || 'core'}`);
      }
  }

  renderList(){if(!this.elements.peopleList)return;this.elements.peopleList.innerHTML=this.people.length===0?`<li>No personas created yet! Use the form to start. ✨</li>`:this.people.map(p=>this.createPersonListItemHTML(p)).join('');} // Updated empty message
  createPersonListItemHTML(person) {
    const styleDisplay = person.style ? this.escapeHTML(person.style) : "Style N/A";
    const roleDisplay = person.role.charAt(0).toUpperCase() + person.role.slice(1);
    const nameDisplay = this.escapeHTML(person.name);
    const avatar = person.avatar || '❓';
    return `
        <li class="person" data-id="${person.id}" tabindex="0" aria-label="${nameDisplay}, ${roleDisplay} - ${styleDisplay}. Click to view details.">
            <span class="person-info">
                <span class="person-avatar" aria-hidden="true">${avatar}</span>
                <span class="person-name-details">
                    <strong class="person-name">${nameDisplay}</strong>
                    <span class="person-details muted-text">(${roleDisplay} - ${styleDisplay})</span>
                </span>
            </span>
            <span class="person-actions">
                <button class="edit-btn small-btn" data-action="edit" data-id="${person.id}" aria-label="Edit ${nameDisplay}">✏️</button>
                <button class="delete-btn small-btn" data-action="delete" data-id="${person.id}" aria-label="Delete ${nameDisplay}">🗑️</button>
            </span>
        </li>`;
  }

  // --- CRUD ---
  savePerson() {
    const nameInput = this.elements.name;
    const name = nameInput.value.trim();
    const avatar = this.elements.avatarInput.value || '❓';
    const role = this.elements.role.value;
    const style = this.elements.style.value;

    // Basic Validation
    if (!name) {
        this.showNotification("Please enter a name for your persona.", "error");
        nameInput.focus();
        return;
    }
     if (!role) { // Should generally not happen with select, but good practice
        this.showNotification("Please select a role.", "error");
        this.elements.role.focus();
        return;
    }
    if (!style) {
        this.showNotification("Please select a style for your persona.", "error");
        this.elements.style.focus();
        return;
    }

    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    const currentTraits = {};
    let missingTraitData = false;

    // Gather trait values from sliders
    sliders.forEach(slider => {
        const traitName = slider.dataset.trait;
        if (traitName) {
            currentTraits[traitName] = slider.value;
        } else {
            console.error("Slider missing data-trait attribute:", slider);
            missingTraitData = true;
        }
    });

    if (missingTraitData) {
         this.showNotification("Error gathering trait data. Please try again.", "error");
         return;
    }

    // Find expected traits for validation (more robust)
    const roleData = bdsmData[role];
    const coreTraits = roleData?.coreTraits?.map(t => t.name) || [];
    const styleObj = roleData?.styles?.find(s => s.name === style);
    const styleSpecificTraits = styleObj?.traits?.map(t => t.name) || [];
    const expectedTraitNames = new Set([...coreTraits, ...styleSpecificTraits]);

    // Validate all expected traits are present in currentTraits
    for (const expectedName of expectedTraitNames) {
        if (!currentTraits.hasOwnProperty(expectedName)) {
            // This might happen if traits didn't render correctly
            console.error(`Missing trait data for expected trait: '${expectedName}'. Traits rendered:`, Object.keys(currentTraits));
            this.showNotification(`Missing data for required trait: '${expectedName}'. Please ensure all sliders are present and try again.`, "error");
            return;
        }
    }


    const existingPerson = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : null;

    const personData = {
        id: this.currentEditId || Date.now(),
        name: name,
        avatar: avatar,
        role: role,
        style: style,
        traits: currentTraits,
        goals: existingPerson?.goals || [],
        history: existingPerson?.history || [],
        achievements: existingPerson?.achievements || [],
        reflections: existingPerson?.reflections || { text: '' }, // Ensure reflections is object
        lastUpdated: Date.now()
    };

    let isNew = false;
    if (this.currentEditId) {
        // Update existing
        const index = this.people.findIndex(p => p.id === this.currentEditId);
        if (index !== -1) {
            this.people[index] = personData;
            grantAchievement(personData, 'profile_edited'); // Grant edit achievement
        } else {
            // Should not happen, but handle gracefully
            console.error("Error updating persona: ID not found.");
             this.showNotification("Error updating persona.", "error");
            this.people.push(personData); // Add as new if update failed
            isNew = true;
        }
    } else {
        // Add new
        this.people.push(personData);
        isNew = true;
        grantAchievement(personData, 'profile_created'); // Grant create achievement
        if (this.people.length >= 5) { // Check AFTER adding
             grantAchievement(personData, 'five_profiles');
        }
    }

     // Grant avatar achievement if a non-default avatar was chosen
     if (avatar !== '❓') {
         grantAchievement(personData, 'avatar_chosen');
     }


    this.saveToLocalStorage();
    this.renderList();
    this.showNotification(`${this.escapeHTML(name)} ${isNew ? 'created' : 'updated'} successfully! ✨`, "success");
    this.resetForm(); // Reset form after successful save
}

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) {
        this.showNotification("Persona not found.", "error");
        return;
    }

    console.log("Editing person:", person);
    this.currentEditId = personId;

    // Populate form fields
    this.elements.formTitle.textContent = `✨ Edit ${this.escapeHTML(person.name)} ✨`;
    this.elements.name.value = person.name;
    this.elements.avatarInput.value = person.avatar || '❓';
    this.elements.avatarDisplay.textContent = person.avatar || '❓';
    this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.emoji === person.avatar);
    });
    this.elements.role.value = person.role;

    // Render styles for the role, THEN set the style value
    this.renderStyles(person.role);
    this.elements.style.value = person.style; // Set style *after* options are populated

    // Render traits for the role/style, THEN set slider values
    this.renderTraits(person.role, person.style);

    // Use rAF to ensure sliders are in the DOM before setting values
    requestAnimationFrame(() => {
        if (person.traits) {
            Object.entries(person.traits).forEach(([traitName, value]) => {
                const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                if (slider) {
                    slider.value = value;
                    this.updateTraitDescription(slider); // Update text based on loaded value
                } else {
                    console.warn(`Slider for trait '${traitName}' not found during edit.`);
                }
            });
        }
        this.updateLivePreview(); // Update preview after traits are set
        this.elements.save.textContent = 'Update Persona! ✨'; // Change button text
        this.elements.formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.elements.name.focus(); // Focus name field
    });
  }

  deletePerson(personId) {
    const index = this.people.findIndex(p => p.id === personId);
    if (index === -1) return;

    const personName = this.people[index].name;
    // Use a more visually distinct confirmation
    if (confirm(`🚨 Really delete persona "${this.escapeHTML(personName)}"? This cannot be undone.`)) {
        this.people.splice(index, 1);
        this.saveToLocalStorage();
        this.renderList();
        this.showNotification(`"${this.escapeHTML(personName)}" deleted.`, "info");

        // If the deleted profile was being edited, reset the form
        if (this.currentEditId === personId) {
            this.resetForm();
        }
    }
  }

  resetForm(isManualClear = false) { // Added flag
      if (isManualClear && this.currentEditId) {
          // If editing, confirm before clearing manually
          if (!confirm("Discard current edits and clear the form?")) {
              return; // User cancelled
          }
      }
      this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.name.value = '';
      this.elements.avatarInput.value = '❓';
      this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker?.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
      this.elements.role.value = 'submissive'; // Default role
      this.renderStyles('submissive'); // Render default styles
      this.elements.style.value = ''; // Reset style
      this.renderTraits('submissive', ''); // Reset traits
      this.currentEditId = null;
      this.elements.save.textContent = 'Save Persona! 💖';
      this.updateLivePreview();
      if (isManualClear) { // Only focus if manually cleared
           this.elements.name.focus();
      }
      console.log("Form reset.");
      this.hideTraitInfo();
  }

  // --- Live Preview ---
  updateLivePreview(){const name=this.elements.name.value.trim()||"Persona Name";const avatar=this.elements.avatarInput.value||'❓';const role=this.elements.role.value;const style=this.elements.style.value;const traits={};let hasTraits=false;this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider=>{const traitName=slider.dataset.trait;if(traitName){traits[traitName]=slider.value;hasTraits=true;}});let html='';if(!role){html=`<p class="muted-text">Select a role...</p>`;}else if(!style&&!hasTraits){html=`<p class="muted-text">Select a style for ${this.escapeHTML(name)} (${role})...</p>`;}else if(!style&&hasTraits){const roleData=bdsmData[role];html=`<h3 class="preview-title">${avatar} ${this.escapeHTML(name)}’s Core Vibe ${avatar}</h3><p><strong>Role:</strong> ${role.charAt(0).toUpperCase()+role.slice(1)}</p><p class="muted-text"><i>Core traits active. Select a style for more details!</i></p>`;if(roleData?.coreTraits?.length>0){html+=`<div class="core-trait-preview"><strong>Core Traits:</strong><ul>`;roleData.coreTraits.forEach(ct=>{const score=traits[ct.name];if(score){const desc=ct.desc?.[score]||"N/A";html+=`<li><strong>${this.escapeHTML(ct.name)} (${score}):</strong> ${this.escapeHTML(desc)}</li>`;}});html+=`</ul></div>`;}else{html+=`<p class="muted-text">No core traits defined for this role.</p>`;}}else if(style){const getBreakdownFunc=role==='submissive'?getSubBreakdown:(role==='dominant'?getDomBreakdown:null);let breakdown={strengths:'',improvements:''};if(getBreakdownFunc){try{breakdown=getBreakdownFunc(style,traits);}catch(e){console.error("Error getting style breakdown:",e);}}let topStyleTraitInfo=null;const roleData=bdsmData[role];const styleObj=roleData?.styles?.find(st=>st.name===style);if(styleObj?.traits?.length>0){let topScore=-1;let topTraitName='';styleObj.traits.forEach(traitDef=>{const score=parseInt(traits[traitDef.name]||0,10);if(score>topScore){topScore=score;topTraitName=traitDef.name;}});if(topTraitName&&topScore>0){const traitDef=styleObj.traits.find(t=>t.name===topTraitName);const desc=traitDef?.desc?.[topScore]||"N/A";topStyleTraitInfo=`<strong>Top Style Trait (${this.escapeHTML(topTraitName)} Lvl ${topScore}):</strong> ${this.escapeHTML(desc)}`;}}html=`<h3 class="preview-title">${avatar} ${this.escapeHTML(name)}’s Vibe ${avatar}</h3><p><strong>Role:</strong> ${role.charAt(0).toUpperCase()+role.slice(1)}</p><p><strong>Style:</strong> ${this.escapeHTML(style)}</p>`;if(breakdown.strengths||breakdown.improvements){html+=`<div class="style-breakdown preview-breakdown">`;if(breakdown.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${breakdown.strengths}</div></div>`; // Assumes breakdown returns HTML/safe string
if(breakdown.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${breakdown.improvements}</div></div>`;html+=`</div>`;}if(topStyleTraitInfo){html+=`<div class="top-trait-preview"><hr><p>${topStyleTraitInfo}</p></div>`;}}else{html=`<p class="muted-text">Select Role & Style to see the vibe! 🌈</p>`;}this.elements.livePreview.innerHTML=html;}

  // --- Modal Display ---
  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) {
        this.showNotification("Could not find persona details.", "error");
        return;
    }
    console.log("Showing details for:", person);

    // Ensure data consistency
    const goals = person.goals || [];
    const history = person.history || [];
    const achievements = person.achievements || [];
    const reflections = person.reflections || { text: '' };
    const avatar = person.avatar || '❓';
    const style = person.style || 'N/A';
    const traits = person.traits || {};
    const role = person.role || 'N/A';

    const getBreakdownFunc = role === 'submissive' ? getSubBreakdown : (role === 'dominant' ? getDomBreakdown : null);
    let breakdown = { strengths: 'N/A', improvements: 'N/A' };
    if (getBreakdownFunc && style !== 'N/A') {
        try {
             // Pass breakdown function HTML/safe strings directly
             breakdown = getBreakdownFunc(style, traits);
        } catch(e) {
            console.error("Error generating style breakdown for modal:", e);
            breakdown = { strengths: 'Error loading insights.', improvements: 'Please check style definitions.'};
        }
    }

    let html = `<h2 class="modal-title" id="detail-modal-title">${avatar} ${this.escapeHTML(person.name)}’s Kingdom ${avatar}</h2>`;
    html += `<p class="modal-subtitle">${role.charAt(0).toUpperCase() + role.slice(1)} - ${this.escapeHTML(style)}</p>`;

    try {
        const intro = this.getIntroForStyle(style);
        if (intro) html += `<p class="modal-intro">${this.escapeHTML(intro)}</p>`;
    } catch (e) {
        console.error("Error getting intro for style:", e);
    }

    // Goals Section
    html += `<section class="goals-section" aria-labelledby="goals-heading-${personId}">
                <h3 id="goals-heading-${personId}">🎯 Goals & Aspirations</h3>
                <ul id="goal-list-${personId}"></ul>
                <div class="add-goal-form">
                    <input type="text" id="new-goal-text-${personId}" placeholder="Add a new goal...">
                    <button class="add-goal-btn save-btn small-btn" data-person-id="${personId}">+ Add Goal</button>
                </div>
             </section>`;

    // Breakdown Section
    html += `<section class="breakdown-section" aria-labelledby="breakdown-heading-${personId}">
                <h3 id="breakdown-heading-${personId}">🌈 Style Insights</h3>
                <div class="style-breakdown modal-breakdown">
                    <div class="strengths"><h4>✨ Powers</h4><div>${breakdown.strengths}</div></div>
                    <div class="improvements"><h4>🌟 Quests</h4><div>${breakdown.improvements}</div></div>
                </div>
             </section>`;

    // Traits Section
    html += `<section class="traits-section" aria-labelledby="traits-heading-${personId}">
                <h3 id="traits-heading-${personId}">🎨 Trait Constellation</h3>`;
    const roleData = bdsmData[role];
    const coreTraits = roleData?.coreTraits || [];
    const styleObj = roleData?.styles?.find(s => s.name === style);
    const styleTraits = styleObj?.traits || [];
    const combinedTraits = [...styleTraits, ...coreTraits];
    const uniqueTraitDefs = Array.from(new Map(combinedTraits.map(t => [t.name, t])).values());

    html += '<div class="trait-details-grid">';
    if (Object.keys(traits).length > 0) {
        Object.entries(traits).forEach(([name, score]) => {
            const traitDef = uniqueTraitDefs.find(t => t.name === name);
            const displayName = name.charAt(0).toUpperCase() + name.slice(1);
            const description = traitDef?.desc?.[score] || "Description N/A";
            const flair = this.getFlairForScore(score);
            const emoji = this.getEmojiForScore(score);
            html += `<div class="trait-detail-item">
                        <h4>${this.escapeHTML(displayName)} - Lvl ${score} ${emoji}</h4>
                        <p><strong>Vibe:</strong> ${this.escapeHTML(description)}</p>
                        <p><em>${flair}</em></p>
                     </div>`;
        });
    } else {
        html += `<p class="muted-text">No trait scores recorded for this persona yet.</p>`;
    }
    html += '</div></section>';

    // History Section
    html += `<section class="history-section" aria-labelledby="history-heading-${personId}">
                <h3 id="history-heading-${personId}">⏳ Growth Over Time <button class="snapshot-info-btn" aria-label="Snapshot Info" aria-expanded="false">ℹ️</button></h3>
                <p class="snapshot-info muted-text" style="display:none;">Snapshots save the current trait scores to track evolution over time!</p>
                <div class="history-chart-container"><canvas id="history-chart"></canvas></div>
                <button id="snapshot-btn" class="small-btn save-btn" data-person-id="${personId}">📸 Take Snapshot</button>
             </section>`;

    // Achievements Section
    html += `<section class="achievements-section" aria-labelledby="achievements-heading-${personId}">
                <h3 id="achievements-heading-${personId}">🏆 Achievements Unlocked</h3>
                <div id="achievements-list-${personId}"></div>
             </section>`;

    // Kink Reading Section
    html += `<section class="kink-reading-section" aria-labelledby="reading-heading-${personId}">
                 <h3 id="reading-heading-${personId}">🔮 Compass Reading</h3>
                 <button id="reading-btn" class="small-btn" data-person-id="${personId}">Get My Reading!</button>
                 <div id="kink-reading-output" class="kink-reading-output" style="display:none;" aria-live="polite"></div>
             </section>`;

    // Reflections Section
    html += `<section class="reflections-section" aria-labelledby="reflections-heading-${personId}">
                <h3 id="reflections-heading-${personId}">📝 Journal Reflections</h3>
                <div id="journal-prompt-area" style="display:none;" aria-live="polite"></div>
                <div class="modal-actions">
                    <button id="prompt-btn" class="small-btn" data-person-id="${personId}">💡 New Prompt</button>
                </div>
                <textarea id="reflections-text" class="reflections-textarea" data-person-id="${personId}" rows="7" placeholder="Reflect on your experiences, feelings, or goals..." aria-label="Journal Entry">${this.escapeHTML(reflections.text || '')}</textarea>
                <button id="save-reflections-btn" class="save-btn" data-person-id="${personId}">Save Reflection 💭</button>
             </section>`;

    this.elements.modalBody.innerHTML = html; // Set the innerHTML

    // Now render dynamic lists/charts
    this.renderGoalList(person);
    this.renderAchievements(person);
    this.openModal(this.elements.modal); // Open modal *after* content is set
    this.renderHistoryChart(person); // Render chart *after* modal is open and canvas exists
  }


  // --- New Feature Logic ---
  addGoal(personId){const person=this.people.find(p=>p.id===personId);const inputElement=this.elements.modalBody?.querySelector(`#new-goal-text-${personId}`);if(!person||!inputElement)return;const text=inputElement.value.trim();if(!text){this.showNotification("Goal text cannot be empty.", "error");return;}const newGoal={id:Date.now(),text:text,status:'todo',createdAt:Date.now()};person.goals=person.goals||[];person.goals.push(newGoal);grantAchievement(person,'goal_added');this.saveToLocalStorage();this.renderGoalList(person);inputElement.value='';inputElement.focus();}
  toggleGoalStatus(personId,goalId){const person=this.people.find(p=>p.id===personId);const goal=person?.goals?.find(g=>g.id===goalId);if(!goal)return;goal.status=(goal.status==='done'?'todo':'done');if(goal.status==='done'){goal.completedAt=Date.now();grantAchievement(person,'goal_completed');const completedCount=person.goals.filter(g=>g.status==='done').length;if(completedCount>=5)grantAchievement(person,'five_goals_completed');}else{delete goal.completedAt;}this.saveToLocalStorage();this.renderGoalList(person);}
  deleteGoal(personId,goalId){const person=this.people.find(p=>p.id===personId);if(!person)return;if(confirm('🚨 Delete this goal permanently?')){person.goals=person.goals.filter(g=>g.id!==goalId);this.saveToLocalStorage();this.renderGoalList(person);this.showNotification("Goal deleted.", "info");}}
  renderGoalList(person){const listElement=this.elements.modalBody?.querySelector(`#goal-list-${person.id}`);if(!listElement)return;const goals=person.goals||[];let htmlString='';if(goals.length>0){goals.sort((a,b)=>(a.status==='done'?1:-1)||(b.createdAt-a.createdAt));goals.forEach(goal=>{htmlString+=`<li class="${goal.status==='done'?'done':''}" data-goal-id="${goal.id}"><span>${this.escapeHTML(goal.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${person.id}" data-goal-id="${goal.id}" aria-label="${goal.status==='done'?'Mark as to-do':'Mark as done'}">${goal.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn delete-btn" data-person-id="${person.id}" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button></span></li>`;});}else{htmlString=`<li class="muted-text">No goals set yet. Add one below!</li>`;}listElement.innerHTML=htmlString;}
  showJournalPrompt(personId){const promptArea=this.elements.modalBody?.querySelector('#journal-prompt-area');const textarea=this.elements.modalBody?.querySelector('#reflections-text');if(promptArea&&textarea){const promptText=getRandomPrompt();promptArea.innerHTML=`<p class="journal-prompt">${this.escapeHTML(promptText)}</p>`;promptArea.style.display='block';textarea.focus();grantAchievement(this.people.find(p=>p.id===personId),'prompt_used');this.saveToLocalStorage();}} // Grant achievement
  saveReflections(personId){const person=this.people.find(p=>p.id===personId);const textarea=this.elements.modalBody?.querySelector('#reflections-text');if(!person||!textarea){this.showNotification("Error saving reflection.", "error");return;}const text=textarea.value;if(!person.reflections)person.reflections={};person.reflections.text=text;person.reflections.lastUpdated=Date.now();let newlySaved=false;if(text.trim().length>0){newlySaved=grantAchievement(person,'reflection_saved');}const reflectionCount=this.people.reduce((count,p)=>{return count+(p.reflections?.text?.trim().length>0?1:0);},0);if(reflectionCount>=5)grantAchievement(person,'five_reflections');this.saveToLocalStorage();const button=this.elements.modalBody.querySelector('#save-reflections-btn');if(button){button.textContent='Saved ✓';button.disabled=true;setTimeout(()=>{button.textContent='Save Reflection 💭';button.disabled=false;},2000);}else{this.showNotification("Reflection Saved! ✨","success");}}
  addSnapshotToHistory(personId){const person=this.people.find(p=>p.id===personId);if(!person||!person.traits||Object.keys(person.traits).length===0){this.showNotification("Cannot take snapshot: No traits recorded for this persona yet.", "error");return;}const snapshot={date:Date.now(),traits:{...person.traits},style:person.style};person.history=person.history||[];person.history.push(snapshot);grantAchievement(person,'history_snapshot');if(person.history.length>=10)grantAchievement(person,'ten_snapshots');this.saveToLocalStorage();this.showNotification("Snapshot saved! 📸","success");this.renderHistoryChart(person);this.renderAchievements(person);}
  renderHistoryChart(person){const container=this.elements.modalBody?.querySelector('.history-chart-container');const canvas=container?.querySelector('#history-chart');if(this.chartInstance){this.chartInstance.destroy();this.chartInstance=null;}if(!container){console.error("Chart container not found");return;}if(!canvas){container.innerHTML=`<p>Error: Chart canvas element missing.</p>`;return;}const history=person.history||[];if(history.length===0){container.innerHTML=`<p class="muted-text">No history snapshots yet! Take one to see progress.</p>`;return;}if(container.querySelector('p')){container.innerHTML=`<canvas id="history-chart"></canvas>`;}const ctx=container.querySelector('#history-chart').getContext('2d');const labels=history.map(s=>new Date(s.date).toLocaleDateString());const allTraitNames=new Set();history.forEach(s=>Object.keys(s.traits).forEach(name=>allTraitNames.add(name)));if(person.traits)Object.keys(person.traits).forEach(name=>allTraitNames.add(name));const datasets=[];const colors=['#ff69b4','#8a5a6d','#a0d8ef','#dcc1ff','#ff85cb','#4a2c3d','#f4d4e4','#c49db1'];let colorIndex=0;allTraitNames.forEach(traitName=>{const data=history.map(s=>s.traits[traitName]!==undefined?parseInt(s.traits[traitName],10):null);const color=colors[colorIndex%colors.length];datasets.push({label:traitName.charAt(0).toUpperCase()+traitName.slice(1),data:data,borderColor:color,backgroundColor:color+'80',tension:0.1,fill:false,spanGaps:true,pointRadius:4,pointHoverRadius:6});colorIndex++;});const isDark=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';const gridColor=isDark?'rgba(244, 212, 228, 0.15)':'rgba(74, 44, 61, 0.1)';const labelColor=isDark?'#c49db1':'#8a5a6d';this.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:datasets},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:labelColor,boxWidth:12,padding:15}},tooltip:{mode:'index',intersect:false,backgroundColor:isDark?'rgba(255,255,255,0.9)':'rgba(0,0,0,0.8)',titleColor:isDark?'#000':'#fff',bodyColor:isDark?'#000':'#fff',borderColor:isDark?'#ccc':'#333',borderWidth:1}},scales:{y:{min:1,max:5,ticks:{stepSize:1,color:labelColor},grid:{color:gridColor}},x:{ticks:{color:labelColor},grid:{color:gridColor}}}}});}
  toggleSnapshotInfo(button){const infoPanel=button.closest('.history-section')?.querySelector('.snapshot-info');if(infoPanel){const isHidden=infoPanel.style.display==='none';infoPanel.style.display=isHidden?'block':'none';button.setAttribute('aria-expanded',isHidden);}}
  renderAchievements(person){const listElement=this.elements.modalBody?.querySelector(`#achievements-list-${person.id}`);if(!listElement)return;const achievements=person.achievements||[];let htmlString='';if(achievements.length>0){htmlString+=`<ul>`;achievements.forEach(id=>{const details=achievementList[id];if(details){const icon=details.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0]||'🏆';htmlString+=`<li title="${this.escapeHTML(details.desc)}"><span class="achievement-icon">${icon}</span><span class="achievement-name">${this.escapeHTML(details.name)}</span></li>`;}});htmlString+=`</ul>`;}else{htmlString=`<p class="muted-text">No achievements unlocked for this persona yet!</p>`;}listElement.innerHTML=htmlString;}
  showKinkReading(personId){const person=this.people.find(p=>p.id===personId);const outputElement=this.elements.modalBody?.querySelector('#kink-reading-output');if(!person||!outputElement)return;grantAchievement(person,'kink_reading');this.saveToLocalStorage();this.renderAchievements(person);let reading=`🔮 ${this.escapeHTML(person.name)}'s Kink Compass Reading 🔮\n\nEmbracing the path of a **${this.escapeHTML(person.style)} ${person.role}**, your journey unfolds with unique sparkles!\n\n`;const traits=person.traits||{};const sortedTraits=Object.entries(traits).map(([name,score])=>({name,score:parseInt(score,10)})).sort((a,b)=>b.score-a.score);if(sortedTraits.length>0){const highest=sortedTraits[0];const lowest=sortedTraits[sortedTraits.length-1];const coreTrait1=bdsmData[person.role]?.coreTraits?.[0]?.name;const coreTrait2=bdsmData[person.role]?.coreTraits?.[1]?.name;reading+=`✨ Your current North Star appears to be **${highest.name} (Lvl ${highest.score})**: ${this.getReadingDescriptor(highest.name,highest.score)}.\n\n`;if(coreTrait1&&traits[coreTrait1]!==undefined){reading+=`🧭 Core Compass Point - **${coreTrait1} (Lvl ${traits[coreTrait1]})**: Reflects ${this.getReadingDescriptor(coreTrait1,traits[coreTrait1])}.\n`;}if(coreTrait2&&traits[coreTrait2]!==undefined){reading+=`🧭 Core Compass Point - **${coreTrait2} (Lvl ${traits[coreTrait2]})**: Resonates with ${this.getReadingDescriptor(coreTrait2,traits[coreTrait2])}.\n`;}if(sortedTraits.length>1&&highest.score!==lowest.score){reading+=`\n🌱 An area ripe for exploration or growth might be **${lowest.name} (Lvl ${lowest.score})**: Consider exploring aspects of ${this.getReadingDescriptor(lowest.name,lowest.score)}.\n`;}}else{reading+=`Your trait map is currently uncharted! Explore the sliders to define your path.\n`;}reading+=`\n💖 Remember, the essence of being a ${this.escapeHTML(person.style)} is about **${this.getStyleEssence(person.style)}**. Continue exploring authentically!\n`;outputElement.textContent=reading;outputElement.style.display='block';outputElement.focus(); /* Focus for screen readers */}
  getReadingDescriptor(traitName,score){score=parseInt(score,10);const highThreshold=4;const lowThreshold=2;const baseDescriptions={'obedience':'following guidance','trust':'opening up','service':'helping others','presentation':'how you appear','playful defiance':'pushing boundaries','mischief':'causing playful trouble','devotion':'deep loyalty','surrender':'letting go of control','affection seeking':'desiring closeness','playfulness':'engaging in fun','non-verbal expression':'communicating without words','age regression comfort':"embracing a younger mindset",'need for guidance':'relying on structure','boundless energy':'enthusiasm','trainability':'learning quickly','curiosity':'investigating','gracefulness':'poise','desire for pampering':'being spoiled','delegation tendency':'letting others help','rope enthusiasm':'enjoying bonds','patience during tying':'stillness','pain interpretation':'processing sensation','sensation seeking':'craving intensity','enjoyment of chase':'the thrill of pursuit','fear play comfort':'flirting with vulnerability','objectification comfort':'being a focus','responsiveness to control':'adapting to direction','aesthetic focus':'visual appeal','stillness / passivity':'calm inaction','shyness / skittishness':'gentle caution','gentle affection need':'soft interactions','task focus':'completing duties','anticipating needs':'proactive help','enthusiasm for games':'loving play','good sport':'playing fairly','vulnerability expression':'showing softness','coquettishness':'playful charm','struggle performance':'acting resistant','acceptance of fate':'inner yielding','mental focus':'deep concentration','suggestibility':'openness to influence','responsiveness to direction':'following commands','passivity in control':'waiting for direction','attention to detail':'precision','uniformity':'embracing attire','pain seeking':'desiring intensity','endurance display':'showing toughness','receptivity':'openness to receiving','power exchange focus':'enjoying the dynamic','authority':'taking charge','care':'nurturing others','leadership':'guiding','control':'managing details','direct communication':'clarity','boundary setting':'defining limits','emotional support':'comforting others','patience':'calm guidance','rule enforcement':'maintaining order','discipline focus':'using consequences','expectation setting':'defining standards','presence':'commanding aura','protective guidance':'fatherly care','affectionate authority':'warm firmness','nurturing comfort':'motherly care','gentle discipline':'kind correction','possessiveness':'claiming','behavioral training':'shaping actions','rope technique':'skill with knots','aesthetic vision':'visual artistry','sensation control':'precise delivery','psychological focus':"observing reactions",'pursuit drive':'instinct to chase','instinct reliance':'acting on gut feeling','skill development focus':'teaching ability','structured methodology':'using clear steps','fine motor control':'precise direction','objectification gaze':'viewing as object','vigilance':'watchfulness','defensive instinct':'shielding others','consequence delivery':'administering punishment','detachment during discipline':'objectivity','holistic well-being focus':'overall care','rule implementation for safety':'practical structure','formal demeanor':'respectful authority','service expectation':'requiring respect','worship seeking':'desiring adoration','effortless command':'innate authority','strategic direction':'planning actions','decisiveness':'firm choices',};const defaultDesc=traitName;if(score>=highThreshold){return`a strong affinity for ${baseDescriptions[traitName]||defaultDesc}`;}else if(score<=lowThreshold){return`potential hesitation or less focus on ${baseDescriptions[traitName]||defaultDesc}`;}else{return`a balanced approach to ${baseDescriptions[traitName]||defaultDesc}`;}}
  getStyleEssence(styleName){const essences={'Classic Submissive':'trust and willingness','Brat':'playful challenge and connection','Slave':'profound devotion and service','Pet':'affectionate loyalty and play','Little':'innocent joy and secure dependence','Puppy':'boundless enthusiasm and eagerness to please','Kitten':'curious grace and affectionate independence','Princess':'being cherished and adored','Rope Bunny':'aesthetic surrender and sensation','Masochist':'transcending limits through sensation','Prey':'the exhilarating dance of pursuit','Toy':'delighting in being used and responsive','Doll':'embodying curated perfection and passivity','Bunny':'gentle connection and soft vulnerability','Servant':'finding purpose in meticulous duty','Playmate':'shared joy and adventurous fun','Babygirl':'charming vulnerability and needing care','Captive':'the dramatic tension of capture and surrender','Thrall':'deep mental connection and yielding','Puppet':'responsive surrender to direct control','Maid':'order, presentation, and respectful service','Painslut':'boldly embracing and seeking intensity','Bottom':'receptive strength and power exchange','Classic Dominant':'confident guidance and responsibility','Assertive':'clear communication and setting direction','Nurturer':'compassionate support and fostering growth','Strict':'structure, order, and clear expectations','Master':'profound authority and shaping potential','Mistress':'elegant command and creative control','Daddy':'protective guidance and affectionate firmness','Mommy':'warm nurturing and gentle structure','Owner':'possessive care and shaping behavior','Rigger':'the artful application of restraint','Sadist':'the controlled exploration of sensation','Hunter':'the primal thrill of the chase','Trainer':'patiently cultivating skills and discipline','Puppeteer':'precise control and creative direction','Protector':'steadfast vigilance and ensuring safety','Disciplinarian':'fair correction and maintaining standards','Caretaker':'holistic well-being and providing comfort','Sir':'dignified authority and earned respect','Goddess':'inspiring worship through presence','Commander':'strategic leadership and decisive action',};const key=styleName?.replace(/\(.*?\)/g,'').trim()||'';return essences[key]||`your unique expression`;}
  showGlossary(){if(!this.elements.glossaryBody)return;grantAchievement({},'glossary_user');let html='<dl>';Object.entries(glossaryTerms).sort((a,b)=>a[1].term.localeCompare(b[1].term)).forEach(([key,termData])=>{html+=`<dt id="gloss-term-${key}">${this.escapeHTML(termData.term)}</dt><dd>${this.escapeHTML(termData.definition)}`;if(termData.related?.length){html+=`<br><span class="related-terms">See also: `;html+=termData.related.map(relKey=>`<a href="#gloss-term-${relKey}">${glossaryTerms[relKey]?.term||relKey}</a>`).join(', ');html+=`</span>`;}html+=`</dd>`;});html+='</dl>';this.elements.glossaryBody.innerHTML=html;this.openModal(this.elements.glossaryModal);}
  showStyleDiscovery(){grantAchievement({},'style_explorer');this.renderStyleDiscoveryContent();this.openModal(this.elements.styleDiscoveryModal);}
  renderStyleDiscoveryContent(){const container=this.elements.styleDiscoveryBody;const roleFilter=this.elements.styleDiscoveryRoleFilter;if(!container||!roleFilter)return;const selectedRole=roleFilter.value;let htmlString='';const rolesToShow=selectedRole==='all'?['submissive','dominant','switch']: [selectedRole];rolesToShow.forEach(roleKey=>{const roleData=bdsmData[roleKey];if(roleData&&roleData.styles?.length>0){htmlString+=`<h3>${roleData.roleName||roleKey.charAt(0).toUpperCase()+roleKey.slice(1)} Styles</h3>`;roleData.styles.forEach(style=>{htmlString+=`<div class="style-discovery-item"><h4>${this.escapeHTML(style.name)}</h4>`;if(style.summary)htmlString+=`<p><em>${this.escapeHTML(style.summary)}</em></p>`;const traits=style.traits||roleData.coreTraits||[];if(traits.length>0){htmlString+=`<strong>Key Traits:</strong><ul>`;traits.forEach(trait=>{htmlString+=`<li>${this.escapeHTML(trait.name.charAt(0).toUpperCase()+trait.name.slice(1))}</li>`;});htmlString+=`</ul>`;}else{htmlString+=`<p class="muted-text">Trait details not specified.</p>`;}htmlString+=`</div>`;});}else{if(selectedRole!=='all')htmlString+=`<p>No specific styles defined yet for role: ${roleKey}</p>`;}});container.innerHTML=htmlString||'<p>Select a role or check data definitions.</p>';}
  setTheme(themeName){document.body.setAttribute('data-theme',themeName);const isDark=themeName==='dark'||themeName==='velvet';if(this.elements.themeToggle){this.elements.themeToggle.textContent=isDark?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${isDark?'Light':'Dark'} Mode`);}try{localStorage.setItem('kinkCompassTheme',themeName);}catch(e){console.warn("Failed to save theme:",e);}if(this.chartInstance&&this.currentEditId){const person=this.people.find(p=>p.id===this.currentEditId);if(person)this.renderHistoryChart(person);}}
  applySavedTheme(){let savedTheme='light';try{if(typeof localStorage!=='undefined')savedTheme=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Failed to read saved theme:",e);}this.setTheme(savedTheme);console.log(`Applied saved theme: ${savedTheme}`);}
  toggleTheme(){const currentTheme=document.body.getAttribute('data-theme')||'light';const isCurrentlyDark=currentTheme==='dark'||currentTheme==='velvet';this.setTheme(isCurrentlyDark?'light':'dark');} // Toggle between light/dark basic
  exportData(){if(this.people.length===0){this.showNotification("No personas to export!", "info");return;}try{const dataString=JSON.stringify(this.people,null,2);const blob=new Blob([dataString],{type:"application/json"});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`kinkcompass_personas_${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(url);grantAchievement({},'data_exported');this.showNotification("Data exported successfully!", "success");anchor.remove();}catch(e){console.error("Export failed:",e);this.showNotification("Export failed. See console for details.", "error");}}
  importData(event){const file=event.target.files?.[0];if(!file){return;}if(file.type!=="application/json"){this.showNotification("Import failed: File must be a JSON file.", "error");event.target.value=null;return;}const reader=new FileReader();reader.onload=(e)=>{try{const importedData=JSON.parse(e.target.result);if(!Array.isArray(importedData)){throw new Error("Invalid format: Imported data is not an array.");}const validatedData=importedData.map(p=>({...p,id:p.id??Date.now(),name:p.name??"Unnamed",role:p.role??"submissive",style:p.style??"",avatar:p.avatar||'❓',goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'&&p.reflections!==null?p.reflections:{text:p.reflections||''},traits:typeof p.traits==='object'&&p.traits!==null?p.traits:{}}));if(confirm(`Import ${validatedData.length} personas? This will OVERWRITE your current ${this.people.length} personas.`)){this.people=validatedData;this.saveToLocalStorage();this.renderList();this.resetForm();this.showNotification(`Imported ${this.people.length} personas successfully.`, "success");grantAchievement({},'data_imported');}}catch(err){console.error("Import failed:",err);this.showNotification(`Import failed: ${err.message}`, "error");}finally{event.target.value=null;}};reader.onerror=()=>{this.showNotification("Error reading the import file.", "error");event.target.value=null;};reader.readAsText(file);}
  showTraitInfo(traitName) {
      const roleKey = this.elements.role.value;
      const styleName = this.elements.style.value;
      const roleData = bdsmData[roleKey];
      let traitDef = null;

      if (roleData) {
           if (styleName) {
               const styleObj = roleData.styles?.find(s => s.name === styleName);
               traitDef = styleObj?.traits?.find(t => t.name === traitName);
           }
           if (!traitDef) traitDef = roleData.coreTraits?.find(t => t.name === traitName);
           if (!traitDef && roleKey === 'switch') traitDef = bdsmData.switch?.coreTraits?.find(t => t.name === traitName);
      }

      if (traitDef && this.elements.traitInfoPopup && this.elements.traitInfoTitle && this.elements.traitInfoBody) {
          const title = traitName.charAt(0).toUpperCase() + traitName.slice(1);
          this.elements.traitInfoTitle.textContent = `${this.getEmojiForScore(3)} ${title} Levels Explained`; // Use level 3 emoji as default visual
          let bodyHtml = '';
          // Generate descriptions for levels 1 through 5
          for (let i = 1; i <= 5; i++) {
              const score = String(i);
              const description = traitDef.desc?.[score] || `(No description provided for Level ${score})`;
              const emoji = this.getEmojiForScore(score);
              bodyHtml += `<p><strong>${emoji} Level ${score}:</strong> ${this.escapeHTML(description)}</p>`;
          }
          this.elements.traitInfoBody.innerHTML = bodyHtml;
          this.elements.traitInfoPopup.style.display = 'block';
          this.elements.traitInfoPopup.setAttribute('aria-hidden', 'false');
          this.elements.traitInfoClose?.focus(); // Focus close button
          this.elements.traitInfoPopup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
          console.warn(`Could not find trait definition or popup elements for '${traitName}'`);
          this.hideTraitInfo(); // Ensure it's hidden if data is missing
      }
  }
  hideTraitInfo() {
      if (this.elements.traitInfoPopup) {
           this.elements.traitInfoPopup.style.display = 'none';
           this.elements.traitInfoPopup.setAttribute('aria-hidden', 'true');
      }
   }


  // --- Style Finder Methods ---
  sfStart() {
      this.sfActive = true;
      this.sfStep = 0;
      this.sfRole = null;
      this.sfAnswers = { traits: {} };
      this.sfScores = {};
      this.sfHasRenderedDashboard = false;
      this.sfPreviousScores = {};
      this.sfTraitSet = [];
      this.sfSteps = [];
      if(this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
      if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';
      if (!this.elements.sfStepContent) { console.error("Style Finder step content element not found!"); alert("Error: Cannot start Style Finder."); return; }
      this.openModal(this.elements.sfModal);
      this.sfRenderStep();
      this.sfShowFeedback("Let’s begin your journey!");
      grantAchievement({}, 'style_finder_complete'); // Grant achievement on start/completion? Choose one.
  }

  sfClose() { this.sfActive = false; this.closeModal(this.elements.sfModal); console.log("Style Finder closed."); }

  sfCalculateSteps() {
      this.sfSteps = [];
      this.sfSteps.push({ type: 'welcome' });
      this.sfSteps.push({ type: 'role' });
      if (this.sfRole) {
          const baseTraitSet = (this.sfRole === 'dominant' ? this.sfDomFinderTraits : this.sfSubFinderTraits);
          if(this.sfTraitSet.length === 0) { this.sfTraitSet = [...baseTraitSet].sort(() => 0.5 - Math.random()); }
          this.sfTraitSet.forEach(trait => this.sfSteps.push({ type: 'trait', trait: trait.name }));
          this.sfSteps.push({ type: 'roundSummary', round: 'Traits' });
      }
      this.sfSteps.push({ type: 'result' });
  }

  sfRenderStep() {
      if (!this.sfActive || !this.elements.sfStepContent) return;
      this.sfCalculateSteps();
      if (this.sfStep < 0 || this.sfStep >= this.sfSteps.length) { console.error(`Invalid SF step index: ${this.sfStep}. Resetting.`); this.sfStep = 0; this.sfCalculateSteps(); if(this.sfSteps.length === 0){ this.elements.sfStepContent.innerHTML = "<p>Error calculating steps.</p>"; return; }}
      const step = this.sfSteps[this.sfStep];
      if (!step) { console.error(`No step data for index ${this.sfStep}`); this.elements.sfStepContent.innerHTML = "<p>Error loading step.</p>"; return; }
      console.log(`Rendering SF Step ${this.sfStep}:`, step);
      let html = "";
      const progressTracker = this.elements.sfProgressTracker;

      if (step.type === 'trait' && this.sfRole && this.sfTraitSet.length > 0) {
          const currentTraitIndex = this.sfTraitSet.findIndex(t => t.name === step.trait);
          if (currentTraitIndex !== -1 && progressTracker) {
             const questionsLeft = this.sfTraitSet.length - (currentTraitIndex + 1);
             progressTracker.style.display = 'block';
             progressTracker.textContent = `Trait ${currentTraitIndex + 1} / ${this.sfTraitSet.length} (${questionsLeft} more!)`;
          } else { if(progressTracker) progressTracker.style.display = 'none'; console.warn(`Trait '${step.trait}' not found for progress.`); }
      } else { if(progressTracker) progressTracker.style.display = 'none'; }

      switch (step.type) {
          case 'welcome': html = `<h2>Welcome, Brave Explorer!</h2><p>Dive into a quest to find your BDSM style!</p><button data-action="next">Start the Journey! ✨</button>`; break;
          case 'role': html = `<h2>Pick Your Path!</h2><p>Do you feel more drawn to guiding (Dominant) or following (Submissive)?</p><button data-action="setRole" data-role="dominant">Guiding! (Dominant)</button><button data-action="setRole" data-role="submissive">Following! (Submissive)</button>`; break;
          case 'trait':
              const traitObj = this.sfTraitSet.find(t => t.name === step.trait);
               if (!traitObj) { html = `<p>Error loading trait: ${step.trait}.</p> <button data-action="prev">Back</button>`; break; }
              const currentValue = this.sfAnswers.traits[traitObj.name] ?? 5;
              const footnoteSet = (this.sfRole === 'dominant' ? this.sfDomTraitFootnotes : this.sfSubTraitFootnotes);
              const footnote = footnoteSet[traitObj.name] || "1: Least / 10: Most";
              const isFirstTraitStep = this.sfSteps.findIndex(s => s.type === 'trait') === this.sfStep;
              const sliderDescArray = this.sfSliderDescriptions?.[traitObj.name] ?? [];
              const safeCurrentValue = Number(currentValue);
              let sliderDescText = `Level ${safeCurrentValue}`;
              const safeIndex = safeCurrentValue - 1;
              if (safeIndex >= 0 && safeIndex < sliderDescArray.length) { sliderDescText = sliderDescArray[safeIndex]; } else { console.warn(`Slider desc OOB for '${traitObj.name}' at ${safeCurrentValue}`); }
              html = `<h2>${this.escapeHTML(traitObj.desc)}<button class="sf-info-icon" data-trait="${traitObj.name}" data-action="showTraitInfo" aria-label="More info about ${traitObj.name}">ℹ️</button></h2>
                      ${isFirstTraitStep ? '<p>Slide to find your vibe! (1 = Not Me, 10 = Totally Me)</p>' : ''}
                      <input type="range" min="1" max="10" value="${safeCurrentValue}" class="sf-trait-slider" data-trait="${traitObj.name}" aria-label="${traitObj.name} rating">
                      <div id="sf-desc-${traitObj.name}" class="sf-slider-description">${this.escapeHTML(sliderDescText)}</div>
                      <p class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                      <div style="margin-top: 15px;">
                          <button data-action="next" data-trait="${traitObj.name}">Next Step!</button>
                          ${this.sfStep > 1 ? `<button data-action="prev" style="margin-left: 10px;">Back</button>` : ''}
                      </div>`;
              break;
          case 'roundSummary':
               html = `<h2>${step.round} Check-In!</h2><p>Here’s how your choices are shaping up:</p><div id="sf-summary-dashboard-placeholder">Loading Dashboard...</div><button data-action="next">See Top Style!</button><button data-action="prev" style="margin-left: 10px;">Back</button>`;
               requestAnimationFrame(() => this.sfUpdateDashboard(true));
               break;
          case 'result':
              this.sfCalculateResult();
              const sortedScores = Object.entries(this.sfScores).sort((a, b) => b[1] - a[1]);
              if (sortedScores.length === 0 || !sortedScores[0] || sortedScores[0][1] <= 0) { html = `<div class="sf-result-section sf-fade-in"><h2 class="sf-result-heading">Hmm... 🤔</h2><p>Not enough data or unique responses to determine a top style yet. Your vibe is uniquely you!</p><div class="sf-result-buttons"><button data-action="startOver">Try Again?</button><button data-action="close">Close</button></div></div>`; break; }
              const topStyle = sortedScores[0][0];
              const matchData = this.sfDynamicMatches[topStyle] || { dynamic: "Unique", match: "Explorer", desc: "Find your perfect match!", longDesc: "Explore dynamics that resonate!" };
              const descData = this.sfStyleDescriptions[topStyle] || { short: "A unique blend!", long: "Your combination of traits creates a special style.", tips: ["Keep exploring!", "Communicate your desires."] };
              html = `<div class="sf-result-section sf-fade-in"><h2 class="sf-result-heading">🎉 Your Top BDSM Style: ${this.escapeHTML(topStyle)} 🎉</h2><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p><h3>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h3><p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.desc)}</p><p>${this.escapeHTML(matchData.longDesc)}</p><h3>Tips for You:</h3><ul style="text-align: left; margin: 10px auto; max-width: 350px; list-style: '✨ '; padding-left: 1.5em;">${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}</ul><div class="sf-result-buttons"><button data-action="applyStyle" data-role="${this.sfRole}" data-style="${this.escapeHTML(topStyle)}">📝 Track This Style!</button><button data-action="startOver">Try Again?</button><button data-action="showFullDetails" data-style="${this.escapeHTML(topStyle)}">More Details</button><button data-action="close">Close</button></div></div>`;
              if (window.confetti) { setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ff69b4', '#ff85cb', '#f4d4e4', '#fff', '#a0d8ef', '#dcc1ff'] }), 300); }
              break;
          default: html = "<p>Oops! Something went wrong.</p> <button data-action='prev'>Back</button>";
      } // End switch

      try {
           if (!this.elements.sfStepContent) throw new Error("sfStepContent element missing");
           this.elements.sfStepContent.innerHTML = html;
           if (step.type === 'trait') { this.sfUpdateDashboard(); }
           else if (step.type !== 'roundSummary') { if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none'; }
            console.log(`SF Step ${this.sfStep} rendered successfully.`);
       } catch (e) {
           console.error(`Render SF Step ${this.sfStep} Error:`, e);
           if (this.elements.sfStepContent) { this.elements.sfStepContent.innerHTML = `<p>Error rendering step.</p> <button data-action="prev">Back</button>`; }
       }
  } // End sfRenderStep

  sfSetRole(role) {
      this.sfRole = role;
      this.sfAnswers.role = role;
      this.sfAnswers.traits = {};
      this.sfScores = {};
      this.sfPreviousScores = {};
      this.sfHasRenderedDashboard = false;
      this.sfTraitSet = [];
      this.sfSteps = [];
      this.sfNextStep();
  }

  sfSetTrait(trait, value) { this.sfAnswers.traits[trait] = parseInt(value, 10); this.sfShowFeedback(`You vibe with ${trait} at ${value}!`); }
  sfNextStep() { this.sfStep++; this.sfRenderStep(); }
  sfPrevStep() { if (this.sfStep > 0) { const stepWeAreLeaving = this.sfSteps[this.sfStep]; this.sfStep--; if(stepWeAreLeaving?.type === 'result' || stepWeAreLeaving?.type === 'roundSummary'){ console.log("Moving back, resetting scores."); this.sfScores = {}; this.sfPreviousScores = {}; this.sfHasRenderedDashboard = false; } this.sfRenderStep(); } }
  sfStartOver() { this.sfStep = 0; this.sfRole = null; this.sfAnswers = { traits: {} }; this.sfScores = {}; this.sfPreviousScores = {}; this.sfHasRenderedDashboard = false; this.sfTraitSet = []; this.sfSteps = []; if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none'; this.sfRenderStep(); this.sfShowFeedback("Fresh start—here we go!"); }

  sfComputeScores() {
      let scores = {};
      if (!this.sfRole || !this.sfStyles[this.sfRole]) return scores;
      const roleStyles = this.sfStyles[this.sfRole];
      roleStyles.forEach(style => { scores[style] = 0; });
      Object.keys(this.sfAnswers.traits).forEach(trait => {
          const rating = this.sfAnswers.traits[trait] ?? 0;
          roleStyles.forEach(style => {
              const keyTraits = this.sfStyleKeyTraits[style] || [];
              if (keyTraits.includes(trait)) { scores[style] += rating * 1.5; }
          });
      });
      return scores;
  }

   sfUpdateDashboard(forceVisible = false) {
       if (!this.sfSteps || this.sfSteps.length === 0) this.sfCalculateSteps(); // Ensure steps are calculated
       const currentStepType = this.sfSteps[this.sfStep]?.type;
       const shouldShowDashboard = forceVisible || (this.sfRole && currentStepType === 'trait');
       if (!this.elements.sfDashboard) { console.error("Dashboard element missing!"); return; }
       if (!shouldShowDashboard) { this.elements.sfDashboard.style.display = 'none'; return; }
       this.elements.sfDashboard.style.display = 'block';
       const scores = this.sfComputeScores();
       const sortedScores = Object.entries(scores).filter(([_, score]) => score > 0.1).sort((a, b) => b[1] - a[1]).slice(0, 7);
       let dashboardHTML = "<div class='sf-dashboard-header'>✨ Your Live Vibes! ✨</div>";
       if (sortedScores.length === 0) { dashboardHTML += "<p class='muted-text' style='padding: 10px;'>Keep rating traits!</p>"; }
       else {
            const previousPositions = {};
            if (this.sfPreviousScores) { Object.entries(this.sfPreviousScores).filter(([_, score]) => score > 0.1).sort((a, b) => b[1] - a[1]).forEach(([style, _], index) => { previousPositions[style] = index; }); }
            const isFirstRender = !this.sfHasRenderedDashboard;
            const styleIcons = this.getStyleIcons();
            sortedScores.forEach(([style, score], index) => {
                const prevPos = previousPositions[style] ?? index;
                const movement = prevPos - index;
                let moveIndicator = '';
                if (!isFirstRender && movement > 0) moveIndicator = '<span class="sf-move-up">↑</span>'; else if (!isFirstRender && movement < 0) moveIndicator = '<span class="sf-move-down">↓</span>';
                const prevScore = this.sfPreviousScores ? (this.sfPreviousScores[style] || 0) : 0;
                const delta = score - prevScore;
                let deltaDisplay = '';
                if (!isFirstRender && Math.abs(delta) > 0.1) { deltaDisplay = `<span class="sf-score-delta ${delta > 0 ? 'positive' : 'negative'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>`; }
                const animationClass = isFirstRender ? 'sf-fade-in' : '';
                dashboardHTML += `<div class="sf-dashboard-item ${animationClass}"><span class="sf-style-name">${styleIcons[style] || '🌟'} ${this.escapeHTML(style)}</span><span class="sf-dashboard-score">${score.toFixed(1)} ${deltaDisplay} ${moveIndicator}</span></div>`;
            });
       }
       this.elements.sfDashboard.innerHTML = dashboardHTML;
       this.sfPreviousScores = { ...scores };
       this.sfHasRenderedDashboard = true;
   }

  sfCalculateResult() { this.sfScores = this.sfComputeScores(); const totalAnswers = Object.keys(this.sfAnswers.traits).length; if (totalAnswers === 0) return; console.log("Final Scores Calculated:", this.sfScores); }
  sfShowFeedback(message) { if (!this.elements.sfFeedback) return; this.elements.sfFeedback.textContent = this.escapeHTML(message); this.elements.sfFeedback.classList.remove('sf-feedback-animation'); void this.elements.sfFeedback.offsetWidth; this.elements.sfFeedback.classList.add('sf-feedback-animation'); }

  sfShowTraitInfo(traitName) {
      if (!traitName) { console.error("Cannot show trait info: traitName missing."); return; }
      const explanation = this.sfTraitExplanations[traitName] || "No extra info available.";
      const popup = document.createElement('div');
      popup.className = 'sf-style-info-popup';
      popup.innerHTML = `<h3>${this.escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}</h3><p>${this.escapeHTML(explanation)}</p><button class="sf-close-btn" aria-label="Close trait info">×</button>`;
      document.body.appendChild(popup);
      popup.querySelector('.sf-close-btn')?.focus();
  }

  sfShowFullDetails(styleName) {
      if (!styleName) { console.error("Cannot show full details: styleName missing."); return; }
      const descData = this.sfStyleDescriptions[styleName];
      const matchData = this.sfDynamicMatches[styleName];
      if (!descData || !matchData) { alert(`Details for style "${styleName}" not found.`); return; }
      const popup = document.createElement('div');
      popup.className = 'sf-style-info-popup wide-popup';
      popup.innerHTML = `<h3>${this.escapeHTML(styleName)}</h3><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p><h4>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h4><p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.longDesc)}</p><h4>Tips for You:</h4><ul style="list-style: '✨ '; padding-left: 1.5em;">${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}</ul><button class="sf-close-btn" aria-label="Close style details">×</button>`;
      document.body.appendChild(popup);
      popup.querySelector('.sf-close-btn')?.focus();
  }

    getStyleIcons() { return { 'Classic Submissive': '🙇‍♀️', 'Brat': '😈', 'Slave': '🔗', 'Pet': '🐾', 'Little': '🍼', 'Puppy': '🐶', 'Kitten': '🐱', 'Princess': '👑', 'Rope Bunny': '🪢', 'Masochist': '💥', 'Prey': '🏃‍♀️', 'Toy': '🎲', 'Doll': '🎎', 'Bunny': '🐰', 'Servant': '🧹', 'Playmate': '🎉', 'Babygirl': '🌸', 'Captive': '⛓️', 'Thrall': '🛐', 'Puppet': '🎭', 'Maid': '🧼', 'Painslut': '🔥', 'Bottom': '⬇️', 'Classic Dominant': '👑', 'Assertive': '💪', 'Nurturer': '🤗', 'Strict': '📏', 'Master': '🎓', 'Mistress': '👸', 'Daddy': '👨‍🏫', 'Mommy': '👩‍🏫', 'Owner': '🔑', 'Rigger': '🧵', 'Sadist': '😏', 'Hunter': '🏹', 'Trainer': '🏋️‍♂️', 'Puppeteer': '🕹️', 'Protector': '🛡️', 'Disciplinarian': '✋', 'Caretaker': '🧡', 'Sir': '🎩', 'Goddess': '🌟', 'Commander': '⚔️', 'Switch': '🔄' }; }

   applyStyleFinderResult(r, s) {
        console.log(`Applying SF Result: Role=${r}, Style=${s}`);
        if (!r || !s || !this.elements.role || !this.elements.style) { console.error("Cannot apply style - missing elements/args."); alert("Error applying style."); return; }
        this.elements.role.value = r;
        this.renderStyles(r);
        requestAnimationFrame(() => {
            const styleExists = Array.from(this.elements.style.options).some(option => option.value === s);
            if (styleExists) { this.elements.style.value = s; }
            else { console.warn(`Style "${s}" not found in dropdown for role "${r}". Clearing selection.`); this.elements.style.value = ''; }
            this.renderTraits(r, this.elements.style.value);
            this.updateLivePreview();
            this.sfClose();
            this.elements.formSection?.scrollIntoView({ behavior: 'smooth' });
            this.elements.name?.focus();
            this.showNotification(`Style "${s}" selected in form! Review and save your persona. ✨`, "success");
        });
    }

  // --- Other Helper Functions ---
  getFlairForScore(s){return parseInt(s,10)<=2?"🌱 Nurturing!":parseInt(s,10)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(s){return parseInt(s,10)<=2?"💧":parseInt(s,10)===3?"🌱":parseInt(s,10)===4?"✨":"🌟";}
  escapeHTML(str){ const div=document.createElement('div'); div.appendChild(document.createTextNode(str ?? '')); return div.innerHTML; }
  openModal(modalElement){if(!modalElement)return;modalElement.style.display='flex';const focusable=modalElement.querySelector('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');if(focusable)requestAnimationFrame(()=>focusable.focus());}
  closeModal(modalElement){if(!modalElement)return;modalElement.style.display='none';}
  getIntroForStyle(styleName){ const key=styleName?.toLowerCase().replace(/\(.*?\)/g,'').trim()||''; const intros={'classic submissive':'Trusting the lead...', brat:'Ready to play... or push?', slave:'In devoted service...', pet:'Eager for affection...', little:'Time for cuddles and rules!', puppy:'Ready to learn and play!', kitten:'Curious and coy...', princess:'Waiting to be adored...', 'rope bunny':'Anticipating the ties...', masochist:'Seeking the edge...', prey:'The chase begins...', toy:'Ready to be used...', doll:'Poised for perfection...', bunny:'Gentle heart awaits...', servant:'Duty calls...', playmate:'Let the games begin!', babygirl:'Needing care and charm...', captive:'Caught in the moment...', thrall:'Mind focused, will yielded...', puppet:'Waiting for direction...', maid:'Order and grace...', painslut:'Craving intensity...', bottom:'Open and ready...', 'classic dominant':'Taking the reins...', assertive:'Clear and direct...', nurturer:'Supporting the journey...', strict:'Order must prevail...', master:'Guiding with purpose...', mistress:'Commanding with elegance...', daddy:'Protecting and guiding...', mommy:'Nurturing with love...', owner:'Claiming what is mine...', rigger:'The canvas awaits...', sadist:'Exploring sensations...', hunter:'The pursuit is on...', trainer:'Cultivating potential...', puppeteer:'Strings at the ready...', protector:'Shields up...', disciplinarian:'Lessons will be learned...', caretaker:'Ensuring well-being...', sir:'Leading with honor...', goddess:'Accepting devotion...', commander:'Directing the action...', switch:'Ready for either flow...'}; return intros[key]||"Explore your unique expression!";}

    // --- Simple Notification System ---
    showNotification(message, type = 'info') { // types: info, success, error, warning
        let notification = document.getElementById('app-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'app-notification';
            // Basic styling - Enhance in CSS
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '8px';
            notification.style.zIndex = '2000';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease, top 0.5s ease';
            notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.className = `app-notification notification-${type}`; // Use class for styling

        // Apply type-specific styles (adjust colors in CSS)
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50'; // Use CSS var later
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336'; // Use CSS var later
                 notification.style.color = 'white';
                 break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800'; // Use CSS var later
                 notification.style.color = 'black';
                 break;
            default: // info
                 notification.style.backgroundColor = '#2196F3'; // Use CSS var later
                 notification.style.color = 'white';
                 break;
        }

        // Fade in
        requestAnimationFrame(() => {
             notification.style.opacity = '1';
             notification.style.top = '30px';
        });


        // Clear existing timer if any
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Fade out after delay
        this.notificationTimer = setTimeout(() => {
             notification.style.opacity = '0';
             notification.style.top = '20px';
             // Optional: Remove element after transition
             // setTimeout(() => notification.remove(), 500);
        }, 4000); // 4 seconds duration
    }

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;"> <h1 style="color: red;">Oops! Failed to Start</h1> <p>Error: ${error.message}. Check console (F12).</p> <pre>${error.stack}</pre> </div>`;
}
