// Kink Atlas - js/data.js

// --- KINK CATEGORIES ---
const KINK_CATEGORIES = {
    "impact": { id: "impact", name: "Impact Play", description: "Striking for sensation.", icon: "💥" },
    "bondage": { id: "bondage", name: "Bondage & Restraint", description: "Tying, cuffs, immobilization.", icon: "🔗" },
    "power_exchange": { id: "power_exchange", name: "Power Exchange", description: "D/s, TPE, control dynamics.", icon: "👑" },
    "sensation": { id: "sensation", name: "Sensation Play", description: "Temperature, texture, electro, tickling.", icon: "✨" },
    "psychological": { id: "psychological", name: "Psychological & Roleplay", description: "Mind games, scenarios, emotional play.", icon: "🧠" },
    "edge_play": { id: "edge_play", name: "Edge Play / Risk-Aware", description: "Higher risk, requires expertise.", icon: "🔥" },
    "fluid_play": { id: "fluid_play", name: "Fluid Play", description: "Bodily fluids, hygiene critical.", icon: "💧" },
    "medical_play": { id: "medical_play", name: "Medical Play", description: "Clinical scenarios, examinations.", icon: "🩺" },
    "object_insertion": { id: "object_insertion", name: "Object Insertion", description: "Toys, fingers, etc. into orifices.", icon: "🎯" },
    "fetishism_specific": { id: "fetishism_specific", name: "Specific Fetishism", description: "Focused on specific objects, materials, or situations.", icon: "👠" },
    "verbal_play": { id: "verbal_play", name: "Verbal Play", description: "Praise, degradation, commands, dirty talk.", icon: "💬" },
    "sensory_modification": { id: "sensory_modification", name: "Sensory Modification", description: "Deprivation or overload of senses.", icon: "🕶️" },
    "exhibition_voyeurism": { id: "exhibition_voyeurism", name: "Exhibitionism & Voyeurism", description: "Being watched or watching others, public/semi-public play (consent is paramount).", icon: "👀" },
    "animal_play": { id: "animal_play", name: "Animal & Pet Play", description: "Embodying animal personas or treating a partner as a pet.", icon: "🐾" },
    "taboo_conceptual": { id: "taboo_conceptual", name: "Taboo & Conceptual (Opt-In)", description: "Kinks exploring themes often considered socially taboo. Requires explicit user opt-in to view.", icon: "🚫" }
};

// --- KINK DEFINITIONS ---
const KINK_DEFINITIONS = [
    // --- IMPACT PLAY ---
    {
        id: "spanking_01", name: "Spanking", category_id: "impact",
        description: "Striking buttocks with hand or light implement.",
        common_terms: ["OTK", "Paddle"], safety_notes: ["Avoid tailbone/kidneys.", "Communicate intensity."], common_misconceptions: ["Always punishment."], related_kinks_ids: ["paddling_01", "caning_01"]
    },
    {
        id: "flogging_01", name: "Flogging", category_id: "impact",
        description: "Using a multi-tailed whip (flogger) for impact.",
        common_terms: ["Falls", "Thuddy", "Stingy"], safety_notes: ["Avoid kidneys/spine/joints.", "Mind the wrap."], common_misconceptions: ["All floggers are the same."], related_kinks_ids: ["spanking_01", "caning_01"]
    },
    {
        id: "caning_01", name: "Caning", category_id: "impact",
        description: "Using a cane (rattan, delrin) for sharp, localized impact.",
        common_terms: ["Rattan", "Switches"], safety_notes: ["High risk of welts/breaking skin.", "Avoid bones/joints/kidneys.", "Warm up area."], common_misconceptions: ["Easy to control (false, requires skill)."], related_kinks_ids: ["spanking_01", "flogging_01"], isHighRisk: true
    },
    {
        id: "paddling_01", name: "Paddling", category_id: "impact",
        description: "Using a flat, rigid implement (paddle) for impact.",
        common_terms: [], safety_notes: ["Similar to spanking, can be more intense."], common_misconceptions: [], related_kinks_ids: ["spanking_01"]
    },
    {
        id: "whip_single_01", name: "Single Tail Whip", category_id: "impact",
        description: "Using a single-tailed whip (e.g., bullwhip, signal whip) for sharp impact or sound play. Requires significant skill.",
        common_terms: ["Bullwhip", "Signal Whip", "Cracking"], safety_notes: ["EXTREME caution. High risk of injury/laceration.", "Requires extensive training and space.", "Never aim at face/eyes/sensitive areas."], common_misconceptions: ["Easy to use like in movies."], related_kinks_ids: ["sound_play_01"], isHighRisk: true
    },

    // --- BONDAGE & RESTRAINT ---
    {
        id: "rope_bondage_01", name: "Rope Bondage (General)", category_id: "bondage",
        description: "Using rope for tying, restraining, or aesthetic patterns.",
        common_terms: ["Shibari", "Hogtie"], safety_notes: ["Avoid nerves/arteries.", "Safety shears ready.", "Check circulation."], common_misconceptions: ["All rope is Shibari."], related_kinks_ids: ["shibari_01", "suspension_01"]
    },
    {
        id: "shibari_01", name: "Shibari / Kinbaku", category_id: "bondage",
        description: "Japanese artistic and intricate rope bondage.",
        common_terms: ["Nawa", "Nawashi"], safety_notes: ["Anatomy knowledge vital.", "Requires study/practice."], common_misconceptions: ["Only sexual."], related_kinks_ids: ["rope_bondage_01", "suspension_01"]
    },
    {
        id: "cuffs_restraints_01", name: "Cuffs & Restraints (Leather/Metal)", category_id: "bondage",
        description: "Using manufactured restraints like leather cuffs, metal shackles, spreader bars.",
        common_terms: ["Shackles", "Spreader bar"], safety_notes: ["Ensure proper fit to avoid chafing/nerve pressure.", "Check locking mechanisms.", "Key readily available if locked."], common_misconceptions: ["Completely escape-proof (depends on item)."], related_kinks_ids: ["rope_bondage_01"]
    },
    {
        id: "suspension_01", name: "Suspension Bondage", category_id: "bondage",
        description: "Suspending a person using ropes or other restraints. High risk.",
        common_terms: ["Full suspension", "Partial suspension"], safety_notes: ["EXPERT training required.", "Load points critical.", "Constant monitoring."], common_misconceptions: ["Safe for beginners to try from online tutorials."], related_kinks_ids: ["rope_bondage_01", "shibari_01"], isHighRisk: true
    },
    {
        id: "mummification_01", name: "Mummification", category_id: "bondage",
        description: "Wrapping the entire body tightly, often with cling film, vet wrap, or fabric, severely restricting movement.",
        common_terms: ["Body wrap"], safety_notes: ["Risk of overheating/panic.", "Ensure airway is clear.", "Monitor breathing.", "Have quick release method."], common_misconceptions: ["Just about being still."], related_kinks_ids: ["sensory_deprivation_01"]
    },

    // --- POWER EXCHANGE ---
    {
        id: "ddlg_01", name: "DDlg (Daddy Dom / little girl)", category_id: "power_exchange",
        description: "Dynamic with a dominant 'Daddy' and submissive 'little girl' role.",
        common_terms: ["Age Play", "Little Space"], safety_notes: ["Consenting adults only.", "Clear boundaries.", "Emotional safety vital."], common_misconceptions: ["Always sexual.", "Involves actual minors (FALSE)."], related_kinks_ids: ["age_play_general_01", "praise_kink_01"]
    },
    {
        id: "master_slave_01", name: "Master/slave (M/s)", category_id: "power_exchange",
        description: "A total power exchange dynamic, often 24/7, with deep commitment and protocols.",
        common_terms: ["TPE (Total Power Exchange)", "Protocol", "Sir/Ma'am"], safety_notes: ["Intense negotiation required.", "Mental health checks.", "Clear exit strategies if dynamic ends."], common_misconceptions: ["Abusive (if not consensual and negotiated)."], related_kinks_ids: ["ddlg_01", "owner_pet_01"]
    },
    {
        id: "owner_pet_01", name: "Owner/pet", category_id: "power_exchange",
        description: "Dynamic where one partner takes on the role of an owner and the other a pet.",
        common_terms: ["Pet play", "Primal play"], safety_notes: ["Negotiate species/behaviors.", "Humane treatment.", "Physical limitations."], common_misconceptions: ["Always demeaning."], related_kinks_ids: ["animal_play_01", "master_slave_01"]
    },
    {
        id: "financial_dom_01", name: "Financial Domination (Findom)", category_id: "power_exchange",
        description: "A dynamic where a dominant partner (Dom/Domme) receives money or gifts from a submissive (paypig, finsub) as part of the power exchange. Often online.",
        common_terms: ["Paypig", "Cashmaster/mistress", "Tribute", "Findomme"], safety_notes: ["Clear budget limits for submissive.", "Risk of scams (on both sides).", "Verify age and consent.", "Emotional manipulation awareness."], common_misconceptions: ["Easy money (for Domme).", "Submissives are just being tricked (can be a genuine kink)."], isTaboo: true // Due to financial elements & potential for exploitation
    },
    {
        id: "forced_feminization_01", name: "Forced Feminization / Sissification", category_id: "power_exchange",
        description: "A scenario where a (typically male) submissive is made to adopt feminine attire, mannerisms, and sometimes mindset, often under the direction of a dominant partner. ",
        common_terms: ["Sissy", "Crossdressing", "Humiliation"], safety_notes: ["Consent and limits around feminization aspects are key.", "Emotional impact, especially if tied to gender identity or dysphoria, must be considered.", "Respect boundaries."], common_misconceptions: ["Always implies homosexuality or trans identity (it's a kink role)."], related_kinks_ids: ["crossdressing_01", "humiliation_01"], isTaboo: true // Can intersect with gender identity in complex ways
    },


    // --- SENSATION PLAY ---
    {
        id: "temperature_play_01", name: "Temperature Play (Ice/Wax)", category_id: "sensation",
        description: "Using hot (e.g., wax) or cold (e.g., ice) sensations on the skin.",
        common_terms: ["Ice play", "Wax play"], safety_notes: ["Use low-melt point wax (paraffin, soy).", "Test wax temp first.", "Avoid eyes/sensitive areas with ice.", "Risk of burns/frostnip."], common_misconceptions: ["Any candle wax is fine (DANGEROUSLY FALSE)."], related_kinks_ids: ["sensation_play_general_01"]
    },
    {
        id: "electrostim_01", name: "Electrostimulation (E-stim)", category_id: "sensation",
        description: "Using electrical currents for erotic sensation via pads or specific toys.",
        common_terms: ["Violet wand", "TENS unit"], safety_notes: ["Use devices designed for erotic play.", "Avoid heart/head/neck pathways.", "Start low intensity.", "Understand device operation."], common_misconceptions: ["Same as medical TENS (erotic units differ)."], related_kinks_ids: ["sensation_play_general_01"], isHighRisk: true
    },
    {
        id: "tickling_01", name: "Tickling (Erotic)", category_id: "sensation",
        description: "Intentional, often prolonged tickling for arousal or as a form of playful 'torture'.",
        common_terms: [], safety_notes: ["Can be surprisingly intense.", "Respect safewords.", "Risk of hyperventilation/panic."], common_misconceptions: ["Just for kids."], related_kinks_ids: ["sensation_play_general_01"]
    },
    {
        id: "knife_play_01", name: "Knife Play / Edge Play (Blades)", category_id: "edge_play", // Also sensation
        description: "Using knives or blades for sensation (dull edge, point) or fear play, NOT cutting. Extremely high risk.",
        common_terms: ["Fear play", "Blade sensation"], safety_notes: ["Use dull or specifically designed safe props if possible.", "EXTREME caution & control.", "Partner must be still.", "No cutting intended (cutting is a different activity).", "Hygiene if skin is broken (not intended)."], common_misconceptions: ["About actual cutting (usually not)."], related_kinks_ids: ["fear_play_01"], isHighRisk: true, isTaboo: true
    },
    {
        id: "needle_play_01", name: "Needle Play", category_id: "edge_play", // Also sensation
        description: "Using sterile needles for temporary skin piercing for sensation or aesthetic patterns. High risk.",
        common_terms: ["Play piercing"], safety_notes: ["Sterile needles and procedures ONLY.", "Knowledge of anatomy to avoid nerves/vessels.", "Risk of infection/bloodborne pathogens.", "Proper disposal of sharps."], common_misconceptions: ["Same as regular piercing."], related_kinks_ids: [], isHighRisk: true, isTaboo: true
    },

    // --- PSYCHOLOGICAL & ROLEPLAY ---
    {
        id: "humiliation_01", name: "Humiliation (Erotic)", category_id: "psychological",
        description: "Deriving arousal from being or making someone feel embarrassed, shamed, or demeaned within a consensual context.",
        common_terms: ["Degradation"], safety_notes: ["Intense negotiation of limits is VITAL.", "Triggers must be discussed.", "Aftercare crucial.", "Verbal vs. physical humiliation limits."], common_misconceptions: ["Always abusive (not if consensual and negotiated)."], related_kinks_ids: ["verbal_play_01", "ddlg_01"]
    },
    {
        id: "fear_play_01", name: "Fear Play", category_id: "psychological",
        description: "Inducing controlled fear or anxiety for arousal or emotional intensity.",
        common_terms: [], safety_notes: ["Triggers and limits are paramount.", "Safewords must be easily usable.", "Risk of genuine panic/trauma if mismanaged."], common_misconceptions: ["Same as actual threat."], related_kinks_ids: ["knife_play_01", "breath_play_01"]
    },
    {
        id: "age_play_general_01", name: "Age Play (General)", category_id: "psychological",
        description: "Roleplaying as a different age, either older or younger. Can be sexual or non-sexual.",
        common_terms: ["Regression", "Agere"], safety_notes: ["All participants must be adults.", "Emotional safety and boundaries key.", "Discuss specific age ranges/behaviors."], common_misconceptions: ["Only DDlg/CgL (many forms exist)."], related_kinks_ids: ["ddlg_01"]
    },
    {
        id: "interrogation_rp_01", name: "Interrogation Roleplay", category_id: "psychological",
        description: "Scenario involving one person interrogating another, often with elements of power exchange, information extraction, or psychological pressure.",
        common_terms: [], safety_notes: ["Define limits of questioning.", "Psychological pressure boundaries.", "Safewords for topics that become too real."], common_misconceptions: [], related_kinks_ids: ["fear_play_01"]
    },
    {
        id: "mind_control_rp_01", name: "Mind Control / Hypnosis (Erotic)", category_id: "psychological",
        description: "Roleplaying or attempting to induce a state of heightened suggestibility or perceived control over another's thoughts/actions. Actual hypnosis efficacy varies.",
        common_terms: ["Hypno-kink", "Suggestions"], safety_notes: ["Clear consent for type of suggestions.", "Limits on actions under 'control'.", "Post-hypnotic suggestions (if any) agreed upon.", "Professional hypnotists often advise against untrained use for deep states."], common_misconceptions: ["Can make anyone do anything (false)."], related_kinks_ids: [], isTaboo: true // Due to consent complexities
    },


    // --- VERBAL PLAY --- (Some overlap with Psychological)
    {
        id: "praise_kink_01", name: "Praise Kink", category_id: "verbal_play",
        description: "Arousal from receiving verbal praise and affirmation.",
        common_terms: ["Good girl/boy"], safety_notes: ["Discuss preferred praise.", "Ensure genuineness."], common_misconceptions: ["Sign of low self-esteem."], related_kinks_ids: ["ddlg_01"]
    },
    {
        id: "degradation_verbal_01", name: "Verbal Degradation", category_id: "verbal_play",
        description: "Using demeaning or insulting language for arousal, as part of consensual humiliation.",
        common_terms: ["Name-calling"], safety_notes: ["HARD limits on specific words/topics VITAL.", "Aftercare essential.", "Not actual abuse."], common_misconceptions: ["Same as bullying."], related_kinks_ids: ["humiliation_01"]
    },
    {
        id: "dirty_talk_01", name: "Dirty Talk", category_id: "verbal_play",
        description: "Using explicit or suggestive language during sexual activity to enhance arousal.",
        common_terms: [], safety_notes: ["Discuss preferences and off-limit words/scenarios."], common_misconceptions: [], related_kinks_ids: []
    },
    {
        id: "command_following_01", name: "Command Following", category_id: "verbal_play",
        description: "Deriving pleasure from giving or obeying explicit instructions or commands within a power dynamic.",
        common_terms: ["Orders"], safety_notes: ["Limits on types of commands.", "Safewords if commands become too difficult or unwanted."], common_misconceptions: [], related_kinks_ids: ["power_exchange"]
    },


    // --- EDGE PLAY / RISK-AWARE ---
    {
        id: "breath_play_01", name: "Breath Play / Erotic Asphyxiation", category_id: "edge_play",
        description: "Restricting airflow for altered states. HIGH RISK.", isHighRisk: true, isTaboo: true,
        common_terms: ["Choking", "Hypoxyphilia"], safety_notes: ["NEVER ALONE.", "Avoid carotids.", "Knowledgeable partner.", "Non-verbal safeword."], common_misconceptions: ["Safe if careful (inherently risky)."], related_kinks_ids: ["fear_play_01"]
    },
    {
        id: "fire_play_01", name: "Fire Play", category_id: "edge_play",
        description: "Using fire near or on the body for sensation or visual effect. EXTREMELY HIGH RISK.", isHighRisk: true, isTaboo: true,
        common_terms: ["Body burning (superficial)"], safety_notes: ["Requires EXPERT training & safety equipment (fire extinguisher, wet towels).", "Specific fuels only.", "Understand heat transfer.", "Never on genitals/face."], common_misconceptions: ["Easy to do with any lighter."], related_kinks_ids: []
    },
    {
        id: "blood_play_01", name: "Blood Play (Consensual)", category_id: "edge_play",
        description: "Incorporating small amounts of blood (e.g., from shallow cuts, needle pricks) into play. EXTREMELY HIGH RISK for STIs.", isHighRisk: true, isTaboo: true,
        common_terms: ["Cutting (ritualistic)", "Vampirism (fantasy)"], safety_notes: ["STERILITY PARAMOUNT.", "Know STI status of ALL partners.", "Use sterile single-use lancets/blades.", "Proper wound care.", "Risk of infection & bloodborne pathogens is SEVERE."], common_misconceptions: ["Just a little cut is fine."], related_kinks_ids: ["knife_play_01", "needle_play_01"]
    },
    {
        id: "gun_play_rp_01", name: "Gun Play (Roleplay/Props ONLY)", category_id: "edge_play", // Primarily Psychological but high risk due to prop nature
        description: "Using unloaded firearms or realistic props in roleplay scenarios, often involving threat or power dynamics. Real firearms are EXTREMELY DANGEROUS even if believed unloaded.", isHighRisk: true, isTaboo: true,
        common_terms: ["Threat play"], safety_notes: ["ONLY use clearly identifiable, non-functional props or dedicated training weapons (e.g., blue guns).", "NEVER use real firearms, even if 'unloaded' or 'safe'. Accidents kill.", "Verify prop status rigorously.", "Store props and real firearms completely separately.", "Muzzle discipline even with props."], common_misconceptions: ["It's safe if you 'know' it's unloaded (negligence kills)."], related_kinks_ids: ["fear_play_01"]
    },


    // --- FLUID PLAY ---
    {
        id: "watersports_01", name: "Watersports (Urophilia)", category_id: "fluid_play",
        description: "Sexual interest in urine. Can involve urinating on someone, being urinated on, or ingesting urine.", isTaboo: true,
        common_terms: ["Golden shower", "Piss play"], safety_notes: ["Hygiene is key.", "Consent for all aspects (giving, receiving, ingesting).", "Urine is generally sterile from a healthy person but can irritate skin.", "Avoid if UTIs are present."], common_misconceptions: ["Always dirty or unsafe (can be managed with hygiene)."], related_kinks_ids: []
    },
    {
        id: "spit_play_01", name: "Spit Play", category_id: "fluid_play",
        description: "Incorporating saliva into play, e.g., spitting on a partner, sharing spit.",
        common_terms: [], safety_notes: ["Consent.", "Be mindful of general oral hygiene and health (e.g., cold sores)."], common_misconceptions: [], related_kinks_ids: []
    },
    // Add Scat play here if you choose, VERY taboo and high health risk.
    // {
    // id: "scat_01", name: "Scat (Coprophilia)", category_id: "fluid_play", isTaboo: true, isHighRisk: true,
    // description: "Sexual interest in feces. EXTREMELY HIGH HEALTH RISK.",
    // common_terms: [], safety_notes: ["Severe risk of E.coli, parasites, other infections. Professional medical advice often suggests avoiding direct contact/ingestion."], common_misconceptions: [], related_kinks_ids: []
    // },


    // --- SPECIFIC FETISHISM ---
    {
        id: "foot_fetish_01", name: "Foot Fetish (Podophilia)", category_id: "fetishism_specific",
        description: "Sexual interest in feet.",
        common_terms: ["Footjobs", "Toe sucking"], safety_notes: ["Hygiene.", "Consent for specific acts."], common_misconceptions: [], related_kinks_ids: []
    },
    {
        id: "latex_rubber_01", name: "Latex/Rubber Fetish", category_id: "fetishism_specific",
        description: "Sexual arousal from wearing or seeing others wear latex or rubber garments.",
        common_terms: ["Catsuit"], safety_notes: ["Latex allergies.", "Care of garments (powder, shiner).", "Risk of overheating in full enclosure."], common_misconceptions: [], related_kinks_ids: ["clothing_fetish_01"]
    },
    {
        id: "leather_fetish_01", name: "Leather Fetish", category_id: "fetishism_specific",
        description: "Sexual arousal from wearing or seeing others wear leather garments.",
        common_terms: [], safety_notes: ["Care of garments."], common_misconceptions: [], related_kinks_ids: ["clothing_fetish_01"]
    },
    {
        id: "crossdressing_01", name: "Crossdressing (Erotic)", category_id: "fetishism_specific", // Can also be psychological
        description: "Wearing clothing typically associated with a different gender for erotic pleasure or roleplay. Distinct from gender identity.",
        common_terms: ["CD"], safety_notes: ["Comfort and fit of clothing.", "Emotional aspects if it touches on gender feelings."], common_misconceptions: ["Implies specific sexual orientation or gender identity."], related_kinks_ids: ["forced_feminization_01"]
    },

    // --- SENSORY MODIFICATION ---
    {
        id: "sensory_deprivation_01", name: "Sensory Deprivation", category_id: "sensory_modification",
        description: "Limiting one or more senses (sight, sound, touch) using blindfolds, earplugs, hoods, restrictive bondage.",
        common_terms: ["Hoods", "Blindfolds"], safety_notes: ["Can increase anxiety/panic.", "Monitor closely.", "Easy way to signal for stop.", "Ensure airway is clear if hoods are used."], common_misconceptions: [], related_kinks_ids: ["mummification_01", "bondage"]
    },
    {
        id: "sensory_overload_01", name: "Sensory Overload", category_id: "sensory_modification",
        description: "Intentionally bombarding multiple senses simultaneously to create an intense, overwhelming, or altered state.",
        common_terms: [], safety_notes: ["Can be very intense quickly.", "Risk of panic or dissociation.", "Careful negotiation of stimuli.", "Easy safeword/signal."], common_misconceptions: [], related_kinks_ids: ["edge_play"]
    },


    // --- ANIMAL & PET PLAY ---
    {
        id: "pet_play_01", name: "Pet Play", category_id: "animal_play",
        description: "Roleplaying as a pet (e.g., puppy, kitten, pony) with a partner as an owner/handler. Can involve specific gear, behaviors, and power exchange.",
        common_terms: ["Puppy play", "Kitten play", "Pony play", "Headspace"], safety_notes: ["All participants are consenting adults.", "Negotiate species, behaviors, gear (collars, leashes, tails).", "Physical comfort and safety (e.g., not being left on all fours for too long).", "Hydration."], common_misconceptions: ["It's bestiality (Absolutely false, it's human roleplay).", "It's always demeaning."], related_kinks_ids: ["owner_pet_01", "age_play_general_01", "ddlg_01"]
    },
    {
        id: "furry_play_01", name: "Furry Play (Erotic)", category_id: "animal_play",
        description: "Incorporating elements of the furry fandom (anthropomorphic animal characters/fursuits) into erotic play or BDSM dynamics.",
        common_terms: ["Fursuit", "Yiff (slang for furry erotica)"], safety_notes: ["Heatstroke risk in full fursuits.", "Visibility/mobility issues in suit.", "Hygiene of suits.", "Consent within community standards if at events."], common_misconceptions: ["All furries are into this (it's a subset)."], related_kinks_ids: ["pet_play_01"]
    },

    // --- TABOO & CONCEPTUAL (Examples - YOU MUST RESEARCH AND WRITE THESE CAREFULLY) ---
    // These are often highly psychological and based on fantasy. Safety is about emotional well-being, consent, and clear boundaries.
    {
        id: "cnc_rp_01", name: "Consensual Non-Consent (CNC) Roleplay", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true,
        description: "A negotiated BDSM scenario where one partner explicitly consents to a scene involving 'simulated' or 'roleplayed' non-consent (e.g., 'struggle', 'resistance' as part of the play). Real consent to the scene itself is PARAMOUNT and ongoing.",
        common_terms: ["Rape fantasy (within CNC)", "Struggle play"],
        safety_notes: [
            "EXTREME levels of trust, communication, and negotiation are ABSOLUTELY ESSENTIAL.",
            "Clear, unambiguous safewords that override any 'no' within the scene.",
            "Detailed discussion of limits, triggers, and desired intensity of 'resistance'.",
            "Extensive aftercare is critical due to potential emotional intensity/bleed.",
            "Distinguish clearly between in-scene 'no' and real-world 'NO' (safeword).",
            "Not for everyone; can be highly triggering if not handled with extreme care."
        ],
        common_misconceptions: ["It's actual non-consent/rape (FALSE. Real consent to engage in the fantasy is the foundation).", "It's a sign someone wants to be actually assaulted (FALSE. It's about exploring power dynamics/fantasies in a controlled way)."],
        related_kinks_ids: ["fear_play_01", "power_exchange"]
    },
    {
        id: "incest_rp_01", name: "Incest Roleplay (Fictional)", category_id: "taboo_conceptual", isTaboo: true,
        description: "Roleplaying scenarios involving fictional familial relationships with a sexual or power-exchange dynamic. All participants are consenting adults with no actual familial relation of the type being roleplayed.",
        common_terms: [],
        safety_notes: [
            "All participants are unrelated consenting adults.",
            "Clear establishment that it's FANTASY and ROLEPLAY.",
            "Discuss potential triggers and emotional boundaries.",
            "Aftercare important to de-role and process.",
            "This is about exploring a taboo fantasy, not endorsing actual incest."
        ],
        common_misconceptions: ["Participants are actually related (FALSE).", "It promotes actual incest (FALSE, it's a contained fantasy for adults)."],
        related_kinks_ids: ["age_play_general_01", "power_exchange"]
    },
    {
        id: "race_play_rp_01", name: "Race Play Roleplay", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true, // High risk for emotional harm
        description: "Roleplaying scenarios that incorporate racial stereotypes, slurs, or power dynamics related to race. Highly controversial and potentially harmful even when 'consensual'.",
        common_terms: [],
        safety_notes: [
            "EXTREME caution. High potential for causing genuine emotional harm, offense, and perpetuating harmful stereotypes.",
            "Requires immense trust, detailed negotiation of specific language/actions, and understanding of historical/social context.",
            "Many in the BDSM community consider this unethical or too harmful to engage in.",
            "Clear understanding of intent vs. impact.",
            "Extensive aftercare and debriefing are essential.",
            "Consider if the 'play' reinforces real-world bigotry."
        ],
        common_misconceptions: ["It's just words/fantasy (Impact can be very real).", "It's okay if all participants are of certain races (Still complex and potentially harmful)."],
        related_kinks_ids: ["humiliation_01", "verbal_degradation_01", "power_exchange"]
    },
    // ... Add many more kinks, ensuring detail and care for taboo/high-risk items ...
];


// --- ACADEMY MODULES, GLOSSARY, JOURNAL PROMPTS (remain as previously provided) ---
// (These are not repeated here for brevity, but should be in your actual data.js file)
const ACADEMY_MODULES = [
    {
        id: "consent_101", title: "Consent 101: The Cornerstone", icon: "🤝",
        content: [ /* ... content ... */ ] // Full content as provided before
    },
    {
        id: "negotiation_basics", title: "Negotiation: Talking About Kink", icon: "💬",
        content: [ /* ... content ... */ ]
    },
    {
        id: "safewords_signals", title: "Safewords & Signals", icon: "🚦",
        content: [ /* ... content ... */ ]
    }
];
const GLOSSARY_TERMS = {
    "aftercare": { term: "Aftercare", definition: "..." }, // Full definitions as provided before
    "dom": { term: "Dominant (Dom/Domme)", definition: "..." },
    "sub": { term: "submissive (sub)", definition: "..." },
    "switch": { term: "Switch", definition: "..." },
    "ssc": { term: "SSC (Safe, Sane, Consensual)", definition: "..." },
    "rack": { term: "RACK (Risk-Aware Consensual Kink)", definition: "..." },
    "prick": { term: "PRICK (Personal Responsibility, Informed Consent, Kink)", definition: "..." },
    "limit": { term: "Limit (Soft/Hard)", definition: "..." },
    "vanilla": { term: "Vanilla", definition: "..." },
    "scene": { term: "Scene", definition: "..." }
};
const JOURNAL_PROMPTS = [ /* ... all prompts as provided before ... */ ];
