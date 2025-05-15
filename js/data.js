const KINK_CATEGORIES = {
    "impact": { id: "impact", name: "Impact Play", description: "Striking for sensation (floggers, paddles, canes, hands).", icon: "💥" },
    "bondage": { id: "bondage", name: "Bondage & Restraint", description: "Tying, cuffs, immobilization, sensory deprivation.", icon: "🔗" },
    "power_exchange": { id: "power_exchange", name: "Power Exchange", description: "D/s, TPE, Master/slave, owner/pet, protocols.", icon: "👑" },
    "sensation": { id: "sensation", name: "Sensation Play", description: "Temperature, texture, electro, tickling, piercing (play).", icon: "✨" },
    "psychological": { id: "psychological", name: "Psychological & Roleplay", description: "Mind games, scenarios, emotional intensity, age play.", icon: "🧠" },
    "edge_play": { id: "edge_play", name: "Edge Play / Risk-Aware", description: "Higher physical/psychological risk, requires expertise & extreme caution.", icon: "🔥" },
    "fluid_play": { id: "fluid_play", name: "Fluid Play", description: "Involving bodily fluids (sweat, saliva etc.). Hygiene & health status critical.", icon: "💧" }, // Modified to avoid problematic terms for the AI
    "medical_play": { id: "medical_play", name: "Medical Play", description: "Clinical scenarios, examinations, needles (non-piercing), enemas.", icon: "🩺" },
    "object_insertion": { id: "object_insertion", name: "Object & Body Part Insertion", description: "Toys, dildos, fingers, sounding. Hygiene & body-safe materials crucial.", icon: "🎯" },
    "fetishism_specific": { id: "fetishism_specific", name: "Specific Fetishism", description: "Focused on specific objects, materials, body parts, or situations (e.g., feet, latex, uniforms).", icon: "👠" },
    "verbal_play": { id: "verbal_play", name: "Verbal Play", description: "Praise, degradation, commands, dirty talk, gaslighting (consensual).", icon: "💬" },
    "sensory_modification": { id: "sensory_modification", name: "Sensory Modification", description: "Deprivation or overload of senses (hoods, gags, blindfolds, loud music).", icon: "🕶️" },
    "exhibition_voyeurism": { id: "exhibition_voyeurism", name: "Exhibitionism & Voyeurism", description: "Being watched or watching others, public/semi-public play. Consent from ALL parties is paramount.", icon: "👀" },
    "animal_play": { id: "animal_play", name: "Animal & Pet Play", description: "Embodying animal personas or treating/being treated as a pet.", icon: "🐾" },
    "food_play": { id: "food_play", name: "Food Play", description: "Using food items in erotic or sensual ways (e.g., nyotaimori, sploshing).", icon: "🍓"},
    "spiritual_ritual": { id: "spiritual_ritual", name: "Spiritual & Ritualistic Play", description: "Incorporating spiritual, occult, or ritualistic elements into BDSM scenes.", icon: "🕯️"}
    // The "Taboo & Conceptual" category is omitted here. You can re-add it manually.
};

// --- KINK DEFINITIONS ---
// YOU WILL NEED TO EXPAND THIS LIST AND FILL IN ALL DETAILS.
const KINK_DEFINITIONS = [
    // --- IMPACT PLAY (7) ---
    {
        id: "spanking_01", name: "Spanking", category_id: "impact",
        description: "Striking buttocks with hand or light implement (e.g., paddle, slipper, small flogger) for pleasure, punishment (within a consensual dynamic), or sensation. Intensity can vary greatly.",
        common_terms: ["OTK (Over The Knee)", "Paddle", "Hand Spanking", "Discipline"], safety_notes: ["Avoid the tailbone (coccyx), kidneys, and spine.", "Communicate clearly about intensity levels and desired sensations before and during.", "Warm up gradually, starting with lighter impacts.", "Ensure the person receiving is in a stable and comfortable position.", "Be aware of bruising and skin sensitivity; stop if pain becomes unintended or unsafe."], common_misconceptions: ["It's always about punishment (False: Can be for affection, sensation, eroticism, or stress relief).", "It always has to be hard and painful (False: Intensity is highly variable and negotiated)."], related_kinks_ids: ["paddling_01", "caning_01", "flogging_01"]
    },
    {
        id: "flogging_01", name: "Flogging", category_id: "impact",
        description: "Using a multi-tailed whip (flogger) made of materials like leather, suede, or rubber to strike the body, typically the back, buttocks, or thighs. Sensations can range from thuddy to stingy depending on the flogger type, material, number of falls, and technique.",
        common_terms: ["Falls (tails of the flogger)", "Thuddy (deep impact)", "Stingy (sharp impact)", "Knots (on flogger handle for grip or impact)"], safety_notes: ["Avoid kidneys, spine, neck, joints, and face.", "Start with lighter impacts and gradually increase intensity as negotiated.", "Be aware of the 'wrap' of the flogger tails, especially around sensitive areas or unintended targets.", "Check skin regularly for signs of excessive marking or breakage if that's not the intent.", "Ensure ample space for swinging the flogger safely."], common_misconceptions: ["All floggers feel the same (False: Material, number of tails, length, and weight vary greatly, affecting sensation).", "Flogging is always about intense pain (False: Can be used for rhythmic sensation, warmth, trance induction, or as a prelude to other activities)."], related_kinks_ids: ["spanking_01", "caning_01"]
    },
    {
        id: "caning_01", name: "Caning", category_id: "impact", isHighRisk: true,
        description: "Using a relatively thin, often flexible rod (cane), typically made of rattan or delrin, to deliver sharp, focused, and often intense impact. Usually targeted at the buttocks or thighs.",
        common_terms: ["Rattan cane", "Delrin cane", "Switches (flexible branches, less common in formal caning)"], safety_notes: ["High risk of welts, bruising, and breaking the skin. Intentional skin breaking requires additional hygiene and aftercare protocols.", "Avoid bones, joints, kidneys, spine, and tailbone directly.", "Warm up the targeted area with lighter impact first.", "Canes can be very intense; precise communication and safewords are critical.", "Canes can break; inspect for splinters if using natural materials."], common_misconceptions: ["Easy to control (False, requires significant skill and control to be accurate and safe).", "Only for severe punishment (Can be used for intense sensation seeking)."], related_kinks_ids: ["spanking_01", "flogging_01"]
    },
    {
        id: "paddling_01", name: "Paddling", category_id: "impact",
        description: "Using a flat, rigid implement (paddle) made of wood, leather, plastic, or other materials for broad, often loud, impact.",
        common_terms: ["Wooden paddle", "Leather paddle", "Frat paddle"], safety_notes: ["Similar to spanking but can be more intense due to rigidity and surface area.", "Avoid tailbone, kidneys, spine.", "Ensure paddle edges are smooth to prevent cuts.", "Be aware of sound levels, can be very loud."], common_misconceptions: ["Only for school-themed roleplay."], related_kinks_ids: ["spanking_01"]
    },
    {
        id: "whip_single_01", name: "Single Tail Whip", category_id: "impact", isHighRisk: true,
        description: "Using a single-tailed whip (e.g., bullwhip, signal whip, snake whip) typically for creating loud cracks (sound play) or for very precise, light, stinging impact. Requires significant skill and space.",
        common_terms: ["Bullwhip", "Signal Whip", "Snake Whip", "Cracking", "Target whip"], safety_notes: ["EXTREME caution and skill required. High risk of injury, deep lacerations, or hitting unintended targets (especially eyes).", "Requires extensive training, ideally in-person, and ample clear space.", "Never aim at face, eyes, genitals, or other highly sensitive areas.", "Primary use is often for sound/threat, not heavy impact on body.", "Inspect whip regularly for damage."], common_misconceptions: ["Easy to use like in movies (Extremely false).", "Always used for hitting people (Often for sound/show)."], related_kinks_ids: ["sound_play_01", "fear_play_01"]
    },
    {
        id: "impact_body_01", name: "Body Impact (Fists/Kicks - Consensual)", category_id: "impact", isHighRisk: true,
        description: "Consensual striking with fists, feet, knees, or elbows, often in a martial arts or 'fight play' context. Requires extreme control and training.",
        common_terms: ["Fight play", "Body shots"], safety_notes: ["Requires training in striking and receiving blows safely.", "Protect head, neck, spine, organs, joints.", "Communicate intensity and no-go zones.", "Risk of internal injury if not done with expertise."], common_misconceptions: ["Same as real fighting."], related_kinks_ids: ["fear_play_01"]
    },
    {
        id: "impact_crop_01", name: "Riding Crop / Tawse", category_id: "impact",
        description: "Using a riding crop or tawse (a leather strap, sometimes split) for stinging impact.",
        common_terms: ["Crop", "Tawse"], safety_notes: ["Can be very stingy and mark easily.", "Avoid bones and joints.", "Control is key to avoid unintended wrap or hitting sensitive areas."], common_misconceptions: [], related_kinks_ids: ["spanking_01"]
    },

    // --- BONDAGE & RESTRAINT (7) ---
    {
        id: "rope_bondage_01", name: "Rope Bondage (General)", category_id: "bondage",
        description: "The use of rope (natural or synthetic) for tying, restraining, or creating aesthetic patterns on the body. It can range from simple functional restraints to complex artistic ties.",
        common_terms: ["Shibari", "Kinbaku", "Suspension", "Hogtie", "Floor work", "Rope bunny/model", "Rigger"], safety_notes: ["Avoid pressure on major nerves/arteries. Learn pathways.", "Safety shears (EMT shears) readily available.", "Check circulation frequently (capillary refill, tingling).", "Never leave unattended in complex/suspension bondage.", "Mind joint positions.", "Suspension requires expert training."], common_misconceptions: ["All rope is Shibari.", "Easy to learn complex ties online."], related_kinks_ids: ["shibari_01", "suspension_01", "cuffs_restraints_01"]
    },
    {
        id: "shibari_01", name: "Shibari / Kinbaku", category_id: "bondage",
        description: "A Japanese form of artistic and often intricate rope bondage. Kinbaku specifically refers to tight, constrictive rope bondage. It emphasizes aesthetics, connection, emotional intensity, and sometimes suspension.",
        common_terms: ["Nawa (rope)", "Nawashi/Bakushi (rope artist/master)", "Rigger", "Rope Bunny/Model", "Kata (form/pattern)", "Agura (a type of tie)"], safety_notes: ["All general rope safety applies, heightened awareness.", "Anatomy knowledge vital (e.g., ulnar nerve).", "Understanding tension, load, friction critical for suspension.", "Requires significant study, mentorship, practice.", "Communication paramount."], common_misconceptions: ["Only for sexual purposes.", "Always painful."], related_kinks_ids: ["rope_bondage_01", "suspension_01"]
    },
    {
        id: "cuffs_restraints_01", name: "Cuffs & Restraints (Manufactured)", category_id: "bondage",
        description: "Using manufactured restraints like leather cuffs (wrists, ankles, thighs, collar), metal shackles, spreader bars, or medical-style restraints.",
        common_terms: ["Shackles", "Spreader bar", "Hogtie cuffs", "Medical restraints", "Manacles"], safety_notes: ["Ensure proper fit (1-2 fingers underneath).", "Check locking mechanisms; keys available.", "Caution with prolonged restraint; allow repositioning.", "Metal can get cold."], common_misconceptions: ["Completely escape-proof.", "One size fits all."], related_kinks_ids: ["rope_bondage_01", "bondage_furniture_01"]
    },
    {
        id: "suspension_01", name: "Suspension Bondage", category_id: "bondage", isHighRisk: true,
        description: "Suspending a person using ropes or other restraints so their body weight is partially or fully supported. Extremely high risk.",
        common_terms: ["Full suspension", "Partial suspension", "Hard points", "Uplines", "Aerial bondage"], safety_notes: ["EXPERT in-person training REQUIRED.", "Structural integrity of suspension points critical.", "Deep understanding of rope mechanics, physiology under load.", "Constant, vigilant monitoring.", "Emergency release plan practiced.", "Risk of suspension trauma."], common_misconceptions: ["Safe for beginners from online tutorials.", "Looks easy."], related_kinks_ids: ["rope_bondage_01", "shibari_01"]
    },
    {
        id: "mummification_01", name: "Mummification", category_id: "bondage",
        description: "Wrapping the entire body tightly with materials like cling film, vet wrap, bondage tape, or fabric, severely restricting movement and often senses.",
        common_terms: ["Body wrap", "Saran wrap bondage", "Vet wrap bondage", "Total enclosure"], safety_notes: ["Risk of overheating/dehydration; monitor temp, provide water.", "Ensure airway always clear. Never cover face with non-breathable material without air channel.", "Monitor breathing; chest constriction.", "Quick release method (shears).", "Can induce panic/claustrophobia; reassurance, check-ins, non-verbal signals.", "Limit duration with non-breathable materials."], common_misconceptions: ["Just about being still.", "Can be left alone."], related_kinks_ids: ["sensory_deprivation_01", "bondage_tape_01"]
    },
    {
        id: "bondage_tape_01", name: "Bondage Tape", category_id: "bondage",
        description: "Using specialized tape that sticks to itself but not to skin or hair, for restraints, creating garments, or sensory play.",
        common_terms: ["Self-adhesive tape", "Vet wrap (similar)"], safety_notes: ["Use actual bondage tape designed for skin contact, not duct tape or other industrial tapes which can severely harm skin.", "Can still constrict if wrapped too tightly, monitor circulation.", "Be careful with removal to avoid pulling body hair if it accidentally adheres to itself through hair.", "Some tapes can leave residue; check for skin sensitivity."], common_misconceptions: ["Same as duct tape (very different properties and safety)."], related_kinks_ids: ["mummification_01"]
    },
    {
        id: "bondage_furniture_01", name: "Bondage Furniture", category_id: "bondage",
        description: "Using specialized furniture like crosses (St. Andrew's, upright), spanking benches, stocks (pillory), or cages designed for BDSM play and restraint.",
        common_terms: ["St. Andrew's Cross", "Spanking bench", "Stocks", "Pillory", "Cage"], safety_notes: ["Ensure furniture is sturdy, well-constructed, and can support the intended weight/stress.", "Pad contact points for comfort and to prevent pressure sores or nerve damage during prolonged use.", "Be aware of pressure points and potential for nerve compression, especially with fixed positions.", "Release mechanisms should be easily accessible to the dominant/safety person.", "If using for suspension, all suspension safety rules apply."], common_misconceptions: ["Any sturdy furniture will do (purpose-built is safer)."], related_kinks_ids: ["cuffs_restraints_01", "suspension_01"]
    },

    // --- POWER EXCHANGE (8) ---
    // DDlg excluded as per request.
    {
        id: "ds_dynamic_01", name: "Dominance & submission (D/s)", category_id: "power_exchange",
        description: "A dynamic where one person (Dominant) takes an authoritative role and another (submissive) takes a yielding role. Can be scene-based or ongoing.",
        common_terms: ["Dom/sub", "Leader/follower", "Top/bottom (can overlap, but distinct)"], safety_notes: ["Clear negotiation of roles, limits, expectations, and safewords is crucial.", "Consent must be ongoing and enthusiastic.", "Power imbalance requires responsibility from the Dominant.", "Aftercare important for both."], common_misconceptions: ["Submissives are weak or have no agency (False, submission is a choice).", "Dominants are always aggressive or mean (False, dominance can be caring and protective)."], related_kinks_ids: ["master_slave_01", "command_following_01"]
    },
    {
        id: "master_slave_01", name: "Master/slave (M/s)", category_id: "power_exchange",
        description: "An intense form of D/s, often involving a deep level of commitment and power exchange, potentially 24/7. Includes protocols and rituals.",
        common_terms: ["M/s", "TPE (Total Power Exchange)", "Sir/Ma'am/Master/Mistress", "Property (symbolic)"], safety_notes: ["Requires extreme trust, communication, and ongoing negotiation.", "Mental and emotional well-being checks for both parties.", "Clear exit strategies if the dynamic needs to change or end.", "Protocols should enhance the dynamic, not cause undue harm."], common_misconceptions: ["It's actual slavery or ownership (False, it's a consensual adult dynamic).", "Always abusive (Not if truly consensual and negotiated with care)."], related_kinks_ids: ["ds_dynamic_01", "total_power_exchange_01", "protocol_play_01"]
    },
    {
        id: "total_power_exchange_01", name: "Total Power Exchange (TPE)", category_id: "power_exchange",
        description: "A dynamic where the submissive partner cedes significant, broad, or near-total authority over many aspects of their life to the dominant partner, on an ongoing (often 24/7) basis. This is a very high level of commitment.",
        common_terms: ["24/7 D/s", "Lifestyle D/s"], safety_notes: ["Highest level of trust, negotiation, and ongoing communication required.", "Regular check-ins about well-being (mental, emotional, physical, financial) are essential.", "Submissive must always retain the ultimate ability to withdraw consent from the entire dynamic, even if in-dynamic safewords are temporarily suspended by agreement.", "Financial and major life decision controls need extremely careful boundaries.", "Risk of unhealthy dependency or isolation if not managed well."], common_misconceptions: ["The submissive has no say at all (False, initial and ongoing consent to the framework is key).", "It's easy to maintain (False, requires immense dedication from both)."], related_kinks_ids: ["master_slave_01", "ds_dynamic_01"]
    },
    {
        id: "owner_pet_01", name: "Owner/pet", category_id: "power_exchange",
        description: "Dynamic where one partner takes on the role of an owner/handler and the other a pet (e.g., puppy, kitten, pony).",
        common_terms: ["Pet play", "Primal play", "Handler"], safety_notes: ["Negotiate species/behaviors.", "Humane treatment paramount.", "Physical limitations, hydration, comfort (e.g., knee pads).", "Collars/leashes used safely."], common_misconceptions: ["Always demeaning or non-consensual.", "Is bestiality (False, it's human roleplay)."], related_kinks_ids: ["animal_play_01", "master_slave_01"]
    },
    {
        id: "protocol_play_01", name: "Protocol Play", category_id: "power_exchange",
        description: "Establishing and following specific rules, rituals, or forms of address within a D/s dynamic.",
        common_terms: ["Rules", "Rituals", "Forms of address (Sir, Master, etc.)"], safety_notes: ["Protocols should be negotiated and serve the dynamic, not be overly burdensome or unsafe.", "Flexibility and review of protocols.", "Punishments for breaking protocol also negotiated."], common_misconceptions: ["Protocols are rigid and unchangeable."], related_kinks_ids: ["master_slave_01", "ds_dynamic_01"]
    },
    {
        id: "service_sub_01", name: "Service Submission", category_id: "power_exchange",
        description: "A form of submission focused on performing acts of service for the dominant partner, which can range from chores to personal assistance or specific tasks.",
        common_terms: ["Acts of service"], safety_notes: ["Negotiate types and extent of service.", "Avoid exploitation.", "Ensure tasks are reasonable and don't compromise the submissive's well-being outside the dynamic (e.g., work, health)."], common_misconceptions: ["Just doing chores (can be deeply fulfilling and part of power exchange)."], related_kinks_ids: ["ds_dynamic_01", "master_slave_01"]
    },
    {
        id: "bratting_01", name: "Bratting / Brat Taming", category_id: "power_exchange",
        description: "A dynamic where a submissive ('brat') playfully disobeys, teases, or challenges the dominant, inviting a 'taming' response or negotiated 'punishment'.",
        common_terms: ["Brat", "Brat tamer", "Pushing buttons"], safety_notes: ["Clear negotiation of what constitutes acceptable bratting vs. genuine disrespect or limit-pushing.", "Dominant must understand the brat's intent is playful provocation within the dynamic.", "Safewords are extra important to distinguish play from real issues.", "Taming/punishments must be pre-negotiated."], common_misconceptions: ["Brats are genuinely disrespectful or don't want to submit.", "All Doms enjoy brat taming."], related_kinks_ids: ["ds_dynamic_01", "playful_punishment_01"]
    },
    {
        id: "objectification_01", name: "Objectification (Consensual)", category_id: "power_exchange",
        description: "Treating a person as an object for sexual or aesthetic pleasure, within a consensual framework. Can involve being displayed, used as furniture, or having limited agency within a scene.",
        common_terms: ["Human furniture", "Dollification"], safety_notes: ["Consent and limits are paramount.", "Duration limits, especially for uncomfortable positions.", "Dehumanization aspects need to be carefully negotiated to avoid genuine emotional harm.", "Aftercare to reaffirm personhood is often crucial."], common_misconceptions: ["Always demeaning or non-consensual."], related_kinks_ids: ["bondage_furniture_01", "humiliation_01"]
    },

    // --- SENSATION PLAY (8) ---
    {
        id: "temperature_play_01", name: "Temperature Play (Ice/Wax)", category_id: "sensation",
        description: "Using hot (e.g., low-melt point wax) or cold (e.g., ice, frozen items) sensations on the skin for erotic effect or contrast.",
        common_terms: ["Ice play", "Wax play", "Fire and Ice"], safety_notes: ["Use ONLY low-melt point wax (paraffin, soy, specifically designed BDSM wax). Test wax temp on yourself first in a less sensitive area.", "Avoid eyes, genitals (directly), or open wounds with wax unless very experienced and negotiated.", "For ice, avoid prolonged contact on one spot to prevent frostnip/frostbite. Don't place ice directly into body cavities without extreme care.", "Risk of burns or cold injury if not careful."], common_misconceptions: ["Any candle wax is fine (DANGEROUSLY FALSE)."], related_kinks_ids: ["sensation_play_general_01"]
    },
    {
        id: "electrostim_01", name: "Electrostimulation (E-stim)", category_id: "sensation", isHighRisk: true,
        description: "Using low-voltage electrical currents for erotic sensation via conductive pads, wands, or specific toys (e.g., violet wand, TENS unit modified/designed for play).",
        common_terms: ["Violet wand", "TENS unit play", "Erotic electroplay"], safety_notes: ["Use devices specifically designed or safely adapted for erotic play. Medical TENS units may need modification or understanding of parameters.", "NEVER run current across the heart (e.g., pad on chest, another on back), through the head, or directly on the front of the neck/carotid sinus.", "Start with very low intensity and increase gradually.", "Understand device operation, types of current (AC/DC), and electrode placement.", "Do not use if pregnant or have a pacemaker/heart condition.", "Risk of burns if pads are too small for current or if there's poor contact."], common_misconceptions: ["Same as medical TENS units (erotic units can have different waveforms/safety features or lack thereof).", "It's like being shocked by mains electricity (False, much lower controlled currents)."], related_kinks_ids: ["sensation_play_general_01"]
    },
    {
        id: "tickling_01", name: "Tickling (Erotic/Intense)", category_id: "sensation",
        description: "Intentional, often prolonged and systematic tickling for arousal, teasing, or as a form of playful 'torture' or endurance test.",
        common_terms: ["Tickle torture"], safety_notes: ["Can be surprisingly intense and lead to involuntary reactions (laughter, thrashing) that make safewording difficult.", "Establish clear non-verbal safewords if speech is impaired.", "Respect actual distress vs. playful protest.", "Risk of hyperventilation or panic attack if pushed too far.", "Be mindful of receiver's physical limits."], common_misconceptions: ["Just for kids or always lighthearted."], related_kinks_ids: ["sensation_play_general_01", "bondage"] // Bondage often used to facilitate
    },
    {
        id: "play_piercing_01", name: "Play Piercing / Needle Play", category_id: "sensation", isHighRisk: true,
        description: "Using sterile hypodermic needles for temporary skin piercing, creating patterns, or for specific sensations. Needles are typically not left in for extended periods like traditional piercings.",
        common_terms: ["Acupressure with needles", "Temporary piercing"], safety_notes: ["STERILE, single-use needles ONLY.", "Thorough knowledge of anatomy to avoid nerves, major blood vessels, and dangerous areas.", "Aseptic technique: clean skin, gloves.", "Significant risk of infection, bruising, bleeding, and transmission of bloodborne pathogens if not done correctly or if needles are shared.", "Proper sharps disposal is essential.", "Not for individuals with bleeding disorders or on blood thinners without medical consultation.", "Seek training from experienced practitioners."], common_misconceptions: ["Same as acupuncture or getting a regular body piercing (different intent and often technique)."], related_kinks_ids: ["edge_play", "blood_play_01"]
    },
    {
        id: "scratching_biting_01", name: "Scratching & Biting (Consensual)", category_id: "sensation",
        description: "Using fingernails to scratch or teeth to bite the skin for erotic sensation. Intensity ranges from light to potentially breaking the skin.",
        common_terms: ["Marking"], safety_notes: ["Negotiate intensity and whether skin breaking is acceptable.", "If skin is broken, immediate cleaning and hygiene are crucial to prevent infection.", "Be aware of health status (e.g., cold sores for biting).", "Avoid areas prone to severe scarring or infection.", "Human bites can be prone to infection."], common_misconceptions: ["Always aggressive or angry."], related_kinks_ids: ["impact_play_general_01", "animal_play_01"]
    },
    {
        id: "cupping_suction_01", name: "Cupping / Suction Play", category_id: "sensation",
        description: "Using cups (e.g., medical cupping sets, specific suction toys) to create suction on the skin, drawing blood to the surface and creating marks or specific sensations.",
        common_terms: ["Love bites (hickeys)", "Vacuum pumps (for genitals/breasts)"], safety_notes: ["Avoid prolonged suction in one area to prevent severe bruising or blisters.", "Do not use over major arteries or very delicate skin without experience.", "Ensure a way to release suction quickly.", "Clean cups thoroughly between uses/partners."], common_misconceptions: [], related_kinks_ids: ["object_insertion"] // e.g. penis/clit pumps
    },
    {
        id: "wartenberg_wheel_01", name: "Wartenberg Wheel / Pinwheel", category_id: "sensation",
        description: "Using a Wartenberg wheel (a medical instrument with radiating sharp pins on a rotating wheel) to create prickling or sharp sensations on the skin.",
        common_terms: ["Pinwheel play"], safety_notes: ["Ensure wheel is clean; sterilize if skin might be broken (not typical intent).", "Roll lightly; excessive pressure can break skin.", "Avoid eyes and very sensitive areas.", "Test sensation on a less sensitive area first."], common_misconceptions: [], related_kinks_ids: ["sensation_play_general_01"]
    },
    {
        id: "sensation_play_general_01", name: "Sensation Play (General/Other)", category_id: "sensation",
        description: "Exploring various tactile sensations not covered by specific categories, e.g., using feathers, fur, textured fabrics, brushes, vibration.",
        common_terms: ["Feather tickling", "Vibrators (external)"], safety_notes: ["Check for allergies to materials.", "Communicate preferences for pressure/texture."], common_misconceptions: [], related_kinks_ids: ["tickling_01"]
    },

    // --- PSYCHOLOGICAL & ROLEPLAY (10) ---
    {
        id: "humiliation_01", name: "Humiliation (Erotic)", category_id: "psychological",
        description: "Deriving arousal from being or making someone feel embarrassed, shamed, or demeaned within a consensual context. Can be verbal or situational.",
        common_terms: ["Degradation", "Embarrassment play"], safety_notes: ["Intense negotiation of limits is VITAL. Specify what types of humiliation are acceptable/off-limits.", "Triggers must be discussed and avoided or handled with extreme care.", "Aftercare is crucial to process emotions and reaffirm self-worth.", "Distinguish clearly between playful humiliation and actual emotional abuse."], common_misconceptions: ["Always abusive (not if fully consensual, negotiated, and with care for well-being).", "The submissive actually believes the humiliating things (often about the power dynamic and vulnerability)."], related_kinks_ids: ["verbal_degradation_01", "objectification_01", "forced_feminization_01"]
    },
    {
        id: "fear_play_01", name: "Fear Play", category_id: "psychological", isHighRisk: true,
        description: "Inducing controlled fear, anxiety, or suspense for arousal or emotional intensity. Can involve implied threats, startling actions, or intimidating presence.",
        common_terms: ["Intimidation play", "Stalking fantasy (consensual)"], safety_notes: ["Triggers and limits are paramount. What is 'fun fear' vs. 'real terror'?", "Safewords must be easily usable and instantly respected, as fear can escalate quickly.", "Risk of genuine panic attack or re-traumatization if mismanaged.", "Dominant needs to be highly attuned to submissive's state.", "Debriefing and aftercare essential."], common_misconceptions: ["Same as actual threat or abuse.", "The goal is to genuinely traumatize (False, it's controlled intensity)."], related_kinks_ids: ["knife_play_01", "breath_play_01", "interrogation_rp_01"]
    },
    {
        id: "age_play_general_01", name: "Age Play (General)", category_id: "psychological",
        description: "Roleplaying as a different age, either older (e.g., 'senior' play) or younger (e.g., 'middle', 'toddler', 'baby' - adult babies). Can be sexual or non-sexual, focused on care, regression, or power dynamics.",
        common_terms: ["Regression", "Agere", "AB (Adult Baby)", "DL (Diaper Lover - can overlap)", "Middle space"], safety_notes: ["All participants must be consenting adults.", "Emotional safety and boundaries are key, especially with regressive states.", "Discuss specific age ranges, behaviors, needs, and associated gear (e.g., pacifiers, diapers, toys).", "Consent can be complex if someone is deep in 'little space'; pre-negotiation and caregiver responsibility are vital.", "Aftercare to help transition out of role if needed."], common_misconceptions: ["Only DDlg/CgL (many forms and age ranges exist).", "Involves actual children (Absolutely false)."], related_kinks_ids: ["diaper_fetish_01", "pet_play_01"] // DDlg excluded
    },
    {
        id: "interrogation_rp_01", name: "Interrogation Roleplay", category_id: "psychological",
        description: "Scenario involving one person interrogating another, often with elements of power exchange, information extraction (real or fictional), psychological pressure, or endurance.",
        common_terms: ["Information play", "Resistance play"], safety_notes: ["Define limits of questioning (topics off-limits).", "Boundaries on psychological pressure (e.g., gaslighting, manipulation levels).", "Safewords for topics that become too real or distressing.", "Physical restraints or discomfort (if used) need their own safety protocols.", "Duration limits."], common_misconceptions: ["Only about pain (can be purely psychological)."], related_kinks_ids: ["fear_play_01", "bondage"]
    },
    {
        id: "mind_control_rp_01", name: "Mind Control / Hypnosis (Erotic)", category_id: "psychological", isHighRisk: true, // Due to consent complexities
        description: "Roleplaying or attempting to induce a state of heightened suggestibility or perceived control over another's thoughts/actions, often using hypnotic language patterns, triggers, or suggestions for erotic purposes.",
        common_terms: ["Hypno-kink", "Suggestions", "Triggers", "Fractionation"], safety_notes: ["Clear, explicit consent for the *type* of suggestions and actions that can be 'controlled'.", "Limits on actions performed while under 'control' must be pre-negotiated (e.g., no self-harm, no illegal acts, no revealing sensitive personal info).", "Any post-hypnotic suggestions must be agreed upon beforehand and have a clear release.", "Effectiveness of actual hypnosis varies greatly; much of 'hypno-kink' is psychological roleplay and power exchange.", "Untrained use for deep trance states is discouraged by professionals; focus on suggestibility and roleplay.", "Safewords must always be effective, even if 'programmed' not to be within the roleplay.", "Risk of emotional manipulation if boundaries are not respected."], common_misconceptions: ["Can make anyone do absolutely anything against their core will (False, especially with non-professional hypnosis).", "It's always real deep trance hypnosis (Often more about suggestion and power dynamics)."], related_kinks_ids: ["power_exchange", "command_following_01"]
    },
    {
        id: "gaslighting_rp_01", name: "Gaslighting (Consensual Roleplay)", category_id: "psychological", isHighRisk: true,
        description: "A roleplay scenario where one partner intentionally makes the other doubt their reality, memory, or perception as part of a psychological power exchange. Must be clearly framed as play and heavily negotiated.",
        common_terms: ["Reality play", "Perception play"], safety_notes: ["EXTREME caution and trust required. High potential for genuine psychological distress if not managed impeccably.", "Detailed negotiation of what aspects of reality can be 'played' with.", "Clear safewords and a method to 'break character' instantly and confirm reality.", "Frequent check-ins on emotional state.", "Extensive aftercare to re-ground in reality.", "Not suitable for individuals with pre-existing conditions related to reality perception or paranoia."], common_misconceptions: ["Same as abusive gaslighting (Distinction is consensual framework, limits, and safewords, but line can be thin if not careful)."], related_kinks_ids: ["mind_control_rp_01", "humiliation_01"]
    },
    {
        id: " Stockholm_syndrome_rp_01", name: "Capture/Stockholm Syndrome Roleplay", category_id: "psychological", isHighRisk: true,
        description: "Roleplaying a scenario of capture and developing a (simulated) emotional bond or dependency on the captor. Explores themes of powerlessness, dependency, and psychological transformation.",
        common_terms: ["Capture bonding fantasy"], safety_notes: ["All elements (capture, confinement, treatment) must be meticulously negotiated.", "High potential for intense emotions and psychological bleed; requires strong emotional stability from participants.", "Clear safewords and de-roling protocols.", "Extensive aftercare and debriefing critical.", "Focus on fantasy exploration, not recreating actual traumatic experiences without extreme care and potentially professional guidance if dealing with past trauma."], common_misconceptions: ["Glorifies actual kidnapping (It's a fantasy exploration for consenting adults)."], related_kinks_ids: ["fear_play_01", "bondage", "power_exchange"]
    },
    {
        id: "teacher_student_rp_01", name: "Teacher/Student Roleplay", category_id: "psychological",
        description: "Roleplaying a dynamic between a teacher (often strict or dominant) and a student (often submissive or bratty). Can involve themes of discipline, learning, or power imbalance.",
        common_terms: ["Schoolgirl/Schoolboy RP", "Detention scene"], safety_notes: ["All participants must be consenting adults, regardless of played ages.", "Negotiate the 'curriculum', rules, and forms of 'discipline'.", "Avoid any elements that could be misconstrued as involving actual minors if played in public/online spaces."], common_misconceptions: ["Always involves age play to childhood (Can be adult student/teacher)."], related_kinks_ids: ["age_play_general_01", "spanking_01", "bratting_01"]
    },
    {
        id: "celebrity_fan_rp_01", name: "Celebrity/Fan Roleplay", category_id: "psychological",
        description: "Roleplaying a dynamic between a celebrity figure and an admirer/fan. Can explore themes of worship, power imbalance, access, or specific fantasies related to the celebrity persona.",
        common_terms: ["Starfucker fantasy (can be part of it)"], safety_notes: ["Negotiate which celebrity (real or fictional type).", "Define the nature of the interaction (e.g., worshipful, stalkerish-but-consensual, dominant celebrity).", "Boundaries on realism vs. pure fantasy."], common_misconceptions: [], related_kinks_ids: ["power_exchange", "praise_kink_01"]
    },
    {
        id: "cult_leader_follower_rp_01", name: "Cult Leader/Follower Roleplay", category_id: "psychological", isHighRisk: true,
        description: "Roleplaying a dynamic involving a charismatic, manipulative cult leader and devoted followers. Explores themes of indoctrination, devotion, psychological control, and group dynamics.",
        common_terms: ["Indoctrination play", "Mindless devotion"], safety_notes: ["High potential for psychological manipulation elements; extreme trust and clear boundaries needed.", "Negotiate limits on 'brainwashing' or loss of agency within the play.", "Safewords and ability to step out of character are crucial.", "Extensive debriefing and aftercare recommended.", "Be mindful of any personal history or sensitivities related to high-control groups."], common_misconceptions: ["Promotes actual cults (It's a fantasy exploration of power and psychology)."], related_kinks_ids: ["mind_control_rp_01", "power_exchange", "gaslighting_rp_01"]
    },

    // --- VERBAL PLAY (6) ---
    {
        id: "praise_kink_01", name: "Praise Kink", category_id: "verbal_play",
        description: "Deriving arousal, pleasure, or validation from receiving verbal praise, compliments, or words of affirmation, often within a BDSM or power exchange dynamic.",
        common_terms: ["Good girl/boy/pet", "Affirmation", "Validation", "Words of Affirmation (WoA)"], safety_notes: ["Discuss preferred types of praise and any words/phrases that are off-limits or triggering.", "Ensure praise is genuine within the context of the dynamic to be effective.", "Be mindful of emotional impact, especially if praise is withheld or used manipulatively (negotiate these aspects)."], common_misconceptions: ["It's only about being called 'good girl/boy' (False: Praise can be very specific and tailored to actions, efforts, or attributes).", "It's a sign of low self-esteem (Not necessarily: Can be a way to experience connection, reward, and deepen a dynamic)."], related_kinks_ids: ["command_following_01", "pet_play_01"] // DDlg excluded
    },
    {
        id: "degradation_verbal_01", name: "Verbal Degradation", category_id: "verbal_play",
        description: "Using demeaning, insulting, or objectifying language for arousal, as part of consensual humiliation or power exchange. Can be highly specific and negotiated.",
        common_terms: ["Name-calling", "Insults", "Objectifying language"], safety_notes: ["HARD limits on specific words, topics, and themes are VITAL. What's arousing for one can be genuinely harmful for another.", "Thorough discussion of triggers and off-limit areas.", "Aftercare is essential to process emotions and reaffirm self-worth outside the scene.", "Must be clearly distinguished from actual emotional abuse; consent and context are key.", "Subspace from degradation can be intense; monitor partner."], common_misconceptions: ["Same as bullying or verbal abuse (Distinction is consent, negotiation, shared context, and intent for arousal).", "The submissive secretly believes the insults (Usually about the power play and vulnerability)."], related_kinks_ids: ["humiliation_01", "objectification_01"]
    },
    {
        id: "dirty_talk_01", name: "Dirty Talk", category_id: "verbal_play",
        description: "Using explicit, suggestive, or vulgar language during sexual activity or BDSM scenes to enhance arousal and intimacy.",
        common_terms: ["Erotic talk", "Cursing (erotic)"], safety_notes: ["Discuss preferences for types of dirty talk (e.g., romantic vs. crude, specific scenarios or words).", "Identify any words or phrases that are off-limits or turn-offs.", "Can be part of roleplay or direct address."], common_misconceptions: ["Everyone likes the same kind of dirty talk."], related_kinks_ids: ["verbal_play"] // General self-reference
    },
    {
        id: "command_following_01", name: "Command Following / Obedience", category_id: "verbal_play",
        description: "Deriving pleasure from giving or obeying explicit instructions, orders, or commands within a power dynamic. Focus is on the act of obedience and the authority conveyed.",
        common_terms: ["Orders", "Instructions", "Obedience training"], safety_notes: ["Negotiate limits on the types of commands (e.g., no unsafe acts, no commands that violate hard limits).", "Safewords are crucial if commands become too difficult, unwanted, or push boundaries unexpectedly.", "Clarity of commands to avoid misunderstanding.", "Can range from simple scene-based commands to ongoing lifestyle protocols."], common_misconceptions: ["Implies total mindlessness (Submissives choose to obey)."], related_kinks_ids: ["ds_dynamic_01", "protocol_play_01", "praise_kink_01"]
    },
    {
        id: "sarcasm_teasing_rp_01", name: "Sarcasm & Teasing (Erotic)", category_id: "verbal_play",
        description: "Using witty sarcasm, playful teasing, or banter as a form of foreplay, power dynamic expression, or to elicit specific reactions (e.g., bratting, frustration).",
        common_terms: ["Banter", "Playful mocking"], safety_notes: ["Ensure both parties enjoy this style of interaction; can be misconstrued if not a shared kink.", "Define line between playful teasing and genuinely hurtful remarks.", "Tone of voice and body language are important cues.", "Safeword if teasing crosses a line."], common_misconceptions: ["Always means disrespect (Can be affectionate and part of a dynamic)."], related_kinks_ids: ["bratting_01", "psychological"]
    },
    {
        id: "foreign_language_rp_01", name: "Foreign Language / Accents (Erotic)", category_id: "verbal_play",
        description: "Using a foreign language (real or fictional) or speaking with a specific accent for erotic effect, roleplay enhancement, or to create a sense of otherness/exoticism.",
        common_terms: [], safety_notes: ["If using a real language, be respectful and avoid cultural appropriation or stereotyping.", "Ensure meaning is understood if specific phrases are important, or if the allure is in the unknown.", "Negotiate if one partner doesn't understand the language – is it for power, mystery, or just sound?"], common_misconceptions: [], related_kinks_ids: ["psychological", "roleplay_specific_01"]
    },

    // --- EDGE PLAY / RISK-AWARE (5) ---
    // Breath play is already detailed. Adding Knife Play, Fire Play, Blood Play, Gun Play (Props)
    {
        id: "breath_play_01", name: "Breath Play / Erotic Asphyxiation", category_id: "edge_play", isHighRisk: true,
        description: "Restricting airflow or applying pressure to the neck to create altered states of consciousness, light-headedness, or intense sensations. This is a high-risk activity.",
        common_terms: ["Choking", "Breath Control", "Hypoxyphilia", "Asphyxiation"], safety_notes: ["EXTREMELY DANGEROUS. Risk of serious injury, brain damage, or death is significant if done incorrectly or without a knowledgeable, attentive, and sober partner.", "NEVER do this alone (auto-erotic asphyxiation is a leading cause of accidental death).", "Avoid direct pressure on the carotid arteries in the neck (sides of the neck), as this can cause rapid unconsciousness, stroke, or death. If pressure is applied to the neck, it should ideally be on the windpipe (trachea) from the front, and even then, with extreme caution and minimal force.", "The person applying restriction MUST be sober, alert, fully understand the risks, and know CPR/emergency procedures. They are solely responsible for the other's safety.", "Have a clear, easily performed, non-verbal stop signal that doesn't require breath (e.g., dropping an object, specific hand signal like snapping fingers if hands are free).", "Limit duration of restriction to very short periods (mere seconds). Release immediately at any sign of distress or the stop signal.", "This app strongly advises seeking expert in-person education from reputable sources before ever attempting. Many consider this too risky to engage in at all."], common_misconceptions: ["It's safe if you're careful (False: It's inherently very risky, though risks can be *reduced* with extreme caution, knowledge, and a trusted partner. It is never truly 'safe').", "Losing consciousness is the goal (False: For many, the goal is altered sensation before unconsciousness. Unconsciousness itself is a high-danger sign)."], related_kinks_ids: ["fear_play_01", "sensory_overload_01"]
    },
    {
        id: "knife_play_01", name: "Knife Play / Blade Sensation", category_id: "edge_play", isHighRisk: true,
        description: "Using knives or blades (often dulled or specific props) against the skin for sensation (cold, pressure, light scratching) or psychological fear play. Typically does NOT involve intentional cutting in this context.",
        common_terms: ["Blade play", "Fear play with blades", "Edge sensation"], safety_notes: ["Use DULLED blades, theatrical props, or the back of a blade if actual sharpness is not the intent.", "EXTREME caution & control. Partner must be still and aware.", "No sudden movements.", "If any cutting is intended (a separate, higher-risk activity often called 'cutting' or 'blood play'), all blood play safety protocols apply (sterility, pathogen risk).", "Hygiene is paramount even with dulled blades to avoid skin irritation or infection if micro-abrasions occur.", "Clearly define if it's sensation, fear, or aesthetic lines – do NOT assume cutting.", "Thorough aftercare for fear/adrenaline."], common_misconceptions: ["Always involves cutting skin (More often about sensation/fear with non-cutting edge or props).", "Any knife can be used safely (False, dulling or props preferred for safety)."], related_kinks_ids: ["fear_play_01", "sensation_play_general_01", "blood_play_01"]
    },
    {
        id: "fire_play_01", name: "Fire Play", category_id: "edge_play", isHighRisk: true,
        description: "Using fire near or briefly on the body for sensation (warmth, fleeting heat), visual effect, or psychological thrill. EXTREMELY HIGH RISK.",
        common_terms: ["Body burning (superficial, quick flashes)", "Fire cupping (advanced)", "Fire eating/fleshing (performance art, not typically BDSM direct play)"], safety_notes: ["Requires EXPERT in-person training & extensive safety precautions.", "Have appropriate fire extinguishers (e.g., CO2, powder for small fires, water for skin if needed AFTER fuel is out), fire blanket, and multiple wet towels IMMEDIATELY at hand.", "Use ONLY specific, known low-flashpoint fuels (e.g., specific alcohols, NOT gasoline or highly volatile substances). Understand fuel properties.", "Never use on genitals, face, hair, or near flammable materials/clothing.", "Excellent ventilation needed.", "Skin must be clean and dry. No oils/lotions.", "Sober participants ONLY.", "Techniques involve quick flashes, not sustained burning.", "Risk of severe burns, setting environment/person on fire."], common_misconceptions: ["Easy to do with any lighter or fuel (EXTREMELY DANGEROUSLY FALSE).", "A little burn is fine (Burns can be severe and life-altering)."], related_kinks_ids: ["edge_play", "sensation_play_general_01"]
    },
    {
        id: "blood_play_01", name: "Blood Play (Consensual)", category_id: "edge_play", isHighRisk: true,
        description: "Incorporating small, controlled amounts of blood (e.g., from shallow, sterile nicks, lancet pricks, or existing wounds if hygienic) into play for visual, ritualistic, or symbolic purposes. EXTREMELY HIGH RISK for STIs and infection.",
        common_terms: ["Cutting (ritualistic/symbolic, NOT self-harm context)", "Vampirism (fantasy element)", "Bloodletting"], safety_notes: ["STERILITY IS PARAMOUNT. Use new, sterile, single-use lancets or blades for each instance and each person.", "Know the STI/bloodborne pathogen status of ALL participants. Regular testing is advised for anyone engaging in this.", "Aseptic technique: clean skin thoroughly before and after, use gloves.", "Proper wound care after to prevent infection.", "Safe sharps disposal (sharps container).", "Understand basic first aid for bleeding.", "Never share implements.", "Not for individuals with bleeding disorders or on blood thinners without medical consultation.", "Consider psychological impact and aftercare."], common_misconceptions: ["Just a little cut is fine (Any break in skin is an infection/STI risk).", "Looks cool in movies, must be easy (Requires medical-level hygiene and risk awareness)."], related_kinks_ids: ["knife_play_01", "play_piercing_01", "medical_play"]
    },
    {
        id: "gun_play_rp_01", name: "Gun Play (Props/Simulated ONLY)", category_id: "edge_play", isHighRisk: true,
        description: "Using UNLOADED firearms (with extreme caution and verification) or, much more safely, clearly identifiable, non-functional PROPS (e.g., blue guns, brightly colored toy guns, airsoft with no ammo/gas) in roleplay scenarios, often involving threat, power dynamics, or specific character play. Real firearms are EXTREMELY DANGEROUS.",
        common_terms: ["Threat play with (prop) firearm", "Hostage RP"], safety_notes: ["SAFEST: ONLY use clearly identifiable, non-functional props or dedicated training weapons. Brightly colored toys are even better to avoid any ambiguity or alarm if seen by others.", "If using a real firearm (STRONGLY DISCOURAGED for play), it must be rigorously verified as unloaded by multiple people, magazine removed, chamber cleared, and safety on. Store ammunition completely separately in a locked container. This practice is still exceptionally risky due to potential for error/complacency.", "NEVER point any firearm (real or prop) at someone unless all parties have explicitly consented to this specific form of play and understand all safety rules.", "Always treat any firearm as if it were loaded, even props, regarding muzzle direction when not actively in a negotiated scene.", "Finger off the trigger until ready to 'fire' (even with props).", "Be aware of legalities regarding props that look like real firearms in your location.", "Psychological impact of threat play needs aftercare."], common_misconceptions: ["It's safe if you 'know' it's unloaded (Negligence and assumptions kill. Props are far safer).", "Toy guns are childish (For safety in this play, obvious toys/props are best)."], related_kinks_ids: ["fear_play_01", "interrogation_rp_01", "power_exchange"]
    },
    { 
        id: "asphyxiation_non_neck_01", name: "Asphyxiation (Non-Neck Constriction)", category_id: "edge_play", isHighRisk: true,
        description: "Restricting breath through means other than direct neck pressure, e.g., chest compression, covering airways with plastic (bag play - EXTREMELY DANGEROUS).",
        common_terms: ["Bag play", "Vacuum bed (can restrict breathing)"],
        safety_notes: ["ALL breath play warnings apply.", "High risk of rapid hypoxia and death.", "Never alone.", "Constant monitoring, immediate release mechanism.", "Plastic bags are exceptionally dangerous.", "Vacuum beds require careful monitoring of air supply and pressure."],
        common_misconceptions: ["Safer than neck constriction (Can be just as, or more, dangerous)."],
        related_kinks_ids: ["breath_play_01", "mummification_01", "sensory_deprivation_01"]
    },
    {
        id: "water_boarding_simulated_01", name: "Water Boarding (Simulated)", category_id: "edge_play", isHighRisk:true,
        description: "Simulating waterboarding by pouring water over the face/cloth covering airways. EXTREMELY DANGEROUS, high risk of actual drowning/lung damage even in simulation. Often considered too risky by most.",
        common_terms: [],
        safety_notes: ["Many consider this UNPLAYABLE SAFELY.", "Requires expert medical knowledge and immediate resuscitation capabilities ON HAND to even attempt a 'simulation'.", "Risk of water aspiration, laryngospasm, panic, death is severe.", "Not recommended for play."],
        common_misconceptions: ["Can be simulated safely by amateurs (Extremely false)."],
        related_kinks_ids: ["fear_play_01", "breath_play_01", "edge_play"]
    },
    // --- FLUID PLAY (4) ---
    // Note: Description of "Watersports" modified to be less explicit for AI generation, but you can adjust.
    {
        id: "watersports_01", name: "Watersports (Urine Play)", category_id: "fluid_play",
        description: "Sexual interest in urine. Can involve various consensual activities related to urine.", // AI-friendly description
        common_terms: ["Golden shower", "Piss play", "Urophilia"], safety_notes: ["Hygiene is key for all participants.", "Explicit consent for all aspects (giving, receiving, proximity, contact, ingestion if applicable).", "Urine from a healthy, hydrated person is generally considered low-risk for direct skin contact but can be an irritant for some.", "Ingestion carries more risks (bacterial, viral if person is unwell).", "Avoid if urinary tract infections (UTIs) are present in the giving partner.", "Clean up thoroughly afterwards."], common_misconceptions: ["Always dirty or inherently unsafe (Risks can be managed with hygiene and health awareness)."], related_kinks_ids: []
    },
    {
        id: "spit_play_01", name: "Spit Play / Saliva Exchange", category_id: "fluid_play",
        description: "Incorporating saliva into play, e.g., spitting on a partner (consensually), sharing spit through kissing, or using it as a lubricant.",
        common_terms: ["Drool play"], safety_notes: ["Consent for all acts involving spit.", "Be mindful of general oral hygiene and health (e.g., cold sores, respiratory illnesses can be transmitted via saliva).", "Some find it arousing, others a hard limit; clear communication needed."], common_misconceptions: [], related_kinks_ids: ["humiliation_01"] // Can be used in humiliating ways
    },
    {
        id: "sweat_play_01", name: "Sweat Play", category_id: "fluid_play",
        description: "Erotic interest in sweat, either one's own or a partner's. Can involve smelling, tasting, or rubbing sweat on the body.",
        common_terms: ["Musk play"], safety_notes: ["General hygiene applies.", "Consent for contact.", "Strong odors can be a limit for some."], common_misconceptions: [], related_kinks_ids: ["fetishism_specific"] // Can overlap with body odor fetishes
    },
    {
        id: "food_smearing_sploshing_01", name: "Food Smearing / Sploshing (Messy Play)", category_id: "food_play", // Also Fluid Play if wet foods
        description: "Using food items (often wet or messy like whipped cream, chocolate sauce, fruit) to smear on bodies, or 'sploshing' where one person is covered in such substances, often in a playful or humiliating context.",
        common_terms: ["Messy play", "WAM (Wet and Messy)"], safety_notes: ["Check for food allergies.", "Use food-safe items, avoid anything that could irritate skin or orifices if contact occurs.", "Clean-up can be extensive; plan for it.", "Some foods can stain fabric/surfaces.", "Avoid getting food into sensitive areas like urethra or vagina if it could cause irritation/infection (e.g., sugary substances)."], common_misconceptions: ["Always about waste (can be sensual or for visual/tactile stimulation)."], related_kinks_ids: ["humiliation_01", "fluid_play"]
    },


    // --- MEDICAL PLAY (5) ---
    {
        id: "medical_exam_rp_01", name: "Medical Examination Roleplay", category_id: "medical_play",
        description: "Roleplaying scenarios involving medical examinations, procedures, or interactions with medical professionals (doctor, nurse, patient). Can range from clinical to highly eroticized.",
        common_terms: ["Doctor/Nurse play", "Patient play", "Clinical kink"], safety_notes: ["Clearly define the scenario, roles, and types of 'examination' or 'procedures'.", "Use safe, body-friendly props (e.g., toy stethoscopes, clean speculums if used).", "Consent for any physical touch or simulated procedures.", "Boundaries around nudity, internal 'exams', or use of actual medical terminology if it's triggering.", "Aftercare if the play brings up real medical anxieties."], common_misconceptions: ["Always accurate to real medical procedures (often highly fantasized)."], related_kinks_ids: ["object_insertion", "needle_play_01"] // If needles (even play) are involved
    },
    {
        id: "enema_play_01", name: "Enema Play (Klismaphilia)", category_id: "medical_play", isHighRisk: true, // Due to internal procedure
        description: "Administering or receiving enemas for erotic pleasure, control, or 'cleaning' fantasies. Involves introducing liquid into the rectum.",
        common_terms: ["Klismaphilia"], safety_notes: ["Use ONLY clean, body-safe equipment (enema bags/bulbs).", "Use ONLY safe liquids (plain warm water, saline solution. Avoid harsh soaps or chemicals).", "Temperature of liquid should be lukewarm/body temp to avoid burns or shock.", "Do not force large volumes or hold for excessively long periods.", "Risk of bowel irritation, electrolyte imbalance if done too frequently or with improper solutions.", "Hygiene is critical to prevent infection.", "Listen to body signals; stop if pain or severe discomfort occurs."], common_misconceptions: ["Completely safe and harmless (carries risks if not done correctly)."], related_kinks_ids: ["object_insertion", "fluid_play"]
    },
    {
        id: "speculum_play_01", name: "Speculum Play", category_id: "medical_play",
        description: "Using a medical speculum (vaginal or anal) for visual access, sensation, or as part of medical roleplay.",
        common_terms: [], safety_notes: ["Use clean, body-safe speculums (plastic disposable or sterilizable metal).", "Use ample lubricant.", "Insert gently and slowly; communicate throughout.", "Do not force if there's resistance or pain.", "Be aware of angles to avoid injury.", "Limit duration of insertion."], common_misconceptions: [], related_kinks_ids: ["medical_exam_rp_01", "object_insertion"]
    },
    {
        id: "catheter_play_rp_01", name: "Catheter Play (Simulated/Props)", category_id: "medical_play", isHighRisk: true,
        description: "Roleplaying or simulating urethral catheterization. Actual insertion of urinary catheters by untrained individuals is EXTREMELY DANGEROUS and can cause severe injury/infection. This refers to external props or fantasy play.",
        common_terms: ["Sounding (related, but distinct - see object_insertion)"], safety_notes: ["For actual urethral play (sounding), see 'Urethral Sounding'. This entry is for props/RP.", "If using props near the urethra, ensure they are body-safe and cannot actually enter unless that's specifically 'Sounding' and its safety is followed.", "Hygiene is paramount for any play near urethra.", "Fantasy/roleplay is safest. DO NOT attempt actual catheter insertion without medical training."], common_misconceptions: ["Safe to try with any tube (Absolutely False for real insertion)."], related_kinks_ids: ["urethral_sounding_01", "medical_exam_rp_01"]
    },
    {
        id: "dental_play_rp_01", name: "Dental Play Roleplay", category_id: "medical_play",
        description: "Roleplaying scenarios involving dental examinations, procedures, or interactions with dental professionals. Can be clinical, involve fear play, or focus on oral sensations/fixations.",
        common_terms: ["Dentist RP"], safety_notes: ["Define scenario and type of 'examination'.", "Use safe props (e.g., dental mirror, pick - carefully).", "Consent for anything placed in mouth.", "Boundaries around real dental anxieties or pain simulation."], common_misconceptions: [], related_kinks_ids: ["medical_exam_rp_01", "fear_play_01"]
    },

    // --- OBJECT & BODY PART INSERTION (7) ---
    {
        id: "dildo_play_01", name: "Dildo Play", category_id: "object_insertion",
        description: "Using dildos (penis-shaped objects) for vaginal, anal, or oral penetration, or external stimulation.",
        common_terms: [], safety_notes: ["Use body-safe materials (silicone, glass, stainless steel - avoid jelly rubber or PVC).", "Use appropriate lubricant.", "Clean thoroughly before/after each use and between partners/orifices.", "Ensure dildos used anally have a flared base to prevent irretrievable loss."], common_misconceptions: [], related_kinks_ids: ["anal_play_01", "vaginal_penetration_01"]
    },
    {
        id: "anal_play_01", name: "Anal Play (General)", category_id: "object_insertion",
        description: "Any form of consensual sexual activity involving the anus, including insertion of fingers, toys, or penis.",
        common_terms: ["Butt stuff", "Anal sex"], safety_notes: ["Generous amounts of quality lubricant are ESSENTIAL.", "Go slowly, communicate constantly.", "Relaxation is key to avoid injury.", "Start with smaller objects/fingers.", "Toys MUST have a flared base to prevent them from being lost inside.", "Hygiene is critical; wash toys and body parts thoroughly. Avoid cross-contamination between anus and vagina/mouth without cleaning.", "Listen to body signals; stop if sharp pain."], common_misconceptions: ["Only for gay men.", "Always painful."], related_kinks_ids: ["dildo_play_01", "butt_plug_01", "fisting_anal_01"]
    },
    {
        id: "butt_plug_01", name: "Butt Plug Play", category_id: "object_insertion",
        description: "Using butt plugs (toys designed for anal insertion, typically with a flared base and a narrower neck) for sensation, fullness, or as part of power exchange (e.g., being made to wear one).",
        common_terms: [], safety_notes: ["MUST have a flared base.", "Use ample lubricant.", "Insert slowly.", "Start with smaller sizes.", "Be mindful of duration; prolonged wear can cause discomfort or issues for some.", "Clean thoroughly."], common_misconceptions: [], related_kinks_ids: ["anal_play_01"]
    },
    {
        id: "vaginal_penetration_01", name: "Vaginal Penetration (Toys/Fingers)", category_id: "object_insertion",
        description: "Insertion of fingers or sex toys (dildos, vibrators, Ben Wa balls) into the vagina for pleasure.",
        common_terms: ["Toy play"], safety_notes: ["Use body-safe materials for toys.", "Use lubricant as needed.", "Clean toys and hands thoroughly.", "Listen to body signals and preferences."], common_misconceptions: [], related_kinks_ids: ["dildo_play_01", "vibrator_play_01"]
    },
    {
        id: "urethral_sounding_01", name: "Urethral Sounding", category_id: "object_insertion", isHighRisk: true,
        description: "Inserting smooth, sterile objects (sounds) into the urethra (penile or vulval) for erotic sensation. High risk of injury and infection.",
        common_terms: ["Sounding rods", "Urethral play"], safety_notes: ["STERILE equipment (stainless steel sounds are common) and aseptic technique absolutely essential.", "Use copious amounts of sterile, water-based lubricant.", "Go EXTREMELY slowly and gently. NEVER force.", "Start with very small diameter sounds and gradually increase only if comfortable.", "Know your anatomy. Urethra is delicate and easily damaged.", "Risk of UTI, urethral trauma, scarring, or introducing infection into bladder/kidneys is very high.", "Urinate after play to help flush urethra.", "Seek medical attention for pain, bleeding, or signs of infection.", "Not for beginners without extensive research and caution."], common_misconceptions: ["Easy or safe to try with household objects (EXTREMELY DANGEROUS)."], related_kinks_ids: ["medical_play", "object_insertion"]
    },
    {
        id: "fisting_01", name: "Fisting (Anal or Vaginal)", category_id: "object_insertion", isHighRisk: true,
        description: "Inserting an entire hand (fist) into the anus or vagina. Requires significant preparation, relaxation, trust, and lubricant.",
        common_terms: ["Handballing (for vaginal fisting, sometimes)"], safety_notes: ["EXTENSIVE preparation: gradual dilation over time (days/weeks/months), extreme amounts of lubricant (oil-based often preferred for longevity but check toy compatibility), complete relaxation of receiver.", "Giver should have short, smooth fingernails and may wear gloves.", "Communicate constantly. Stop immediately if pain.", "Risk of tearing, internal injury, or nerve damage is significant if done improperly or rushed.", "Proper hand/arm positioning is crucial.", "Aftercare may involve rest and monitoring for discomfort.", "Not for everyone; anatomical differences play a role."], common_misconceptions: ["Can be done spontaneously without preparation (Very dangerous)."], related_kinks_ids: ["anal_play_01", "vaginal_penetration_01"]
    },
    {
        id: "pegging_01", name: "Pegging", category_id: "object_insertion",
        description: "Anal penetration of a partner (typically male) by a partner (typically female, but can be any gender) using a strap-on dildo.",
        common_terms: ["Strap-on play"], safety_notes: ["All anal play safety applies (lube, slowness, communication, flared base on dildo if detachable).", "Ensure harness is comfortable and secure for the wearer.", "Communication between both partners about depth, speed, and sensation."], common_misconceptions: ["Only for specific gender pairings."], related_kinks_ids: ["anal_play_01", "dildo_play_01", "power_exchange"] // Can have PE elements
    },

    // --- SPECIFIC FETISHISM (10) ---
    {
        id: "foot_fetish_01", name: "Foot Fetish (Podophilia)", category_id: "fetishism_specific",
        description: "Sexual interest and arousal focused on feet.",
        common_terms: ["Footjobs", "Toe sucking", "Foot worship"], safety_notes: ["Hygiene (clean feet).", "Consent for specific acts (touching, licking, etc.).", "Be mindful of pressure if involving standing/walking on someone."], common_misconceptions: [], related_kinks_ids: ["body_worship_01"]
    },
    {
        id: "latex_rubber_01", name: "Latex/Rubber Fetish", category_id: "fetishism_specific",
        description: "Sexual arousal from wearing, seeing, smelling, or touching latex or rubber garments (e.g., catsuits, dresses, hoods).",
        common_terms: ["Catsuit", "Rubber doll", "Gummi"], safety_notes: ["Check for latex allergies (can be severe).", "Proper care of garments (talc/powder for dressing, shiner for look).", "Risk of overheating in full enclosure suits; monitor temperature and hydration.", "Can be constricting; ensure comfortable fit.", "Cleaning garments after use."], common_misconceptions: ["All shiny black clothing is latex."], related_kinks_ids: ["clothing_fetish_01", "sensory_deprivation_01"] // Hoods can be sensory dep.
    },
    {
        id: "leather_fetish_01", name: "Leather Fetish", category_id: "fetishism_specific",
        description: "Sexual arousal from wearing, seeing, smelling, or touching leather garments or items.",
        common_terms: ["Leatherman/Leatherwoman"], safety_notes: ["Care of leather garments.", "Can be heavy/constricting depending on item.", "Associated with BDSM culture but distinct as a fetish."], common_misconceptions: [], related_kinks_ids: ["clothing_fetish_01"]
    },
    {
        id: "crossdressing_01", name: "Crossdressing (Erotic/Fetishistic)", category_id: "fetishism_specific",
        description: "Wearing clothing, makeup, and accessories typically associated with a different gender for erotic pleasure, comfort, or as part of a fetish. Distinct from gender identity (i.e., not necessarily about being transgender).",
        common_terms: ["CD", "TV (Transvestite - older, sometimes controversial term)"], safety_notes: ["Comfort and fit of clothing/undergarments (e.g., tucking, binding - research safe methods).", "Emotional aspects if it touches on deeper gender feelings; self-reflection can be useful.", "Sharing this fetish with partners requires communication."], common_misconceptions: ["Always implies specific sexual orientation or gender identity (It's about the act of dressing for many).", "Same as drag performance (Drag is performance, crossdressing can be private)."], related_kinks_ids: ["clothing_fetish_01", "forced_feminization_01"] // Forced fem is a PE dynamic, this is fetish
    },
    {
        id: "uniform_fetish_01", name: "Uniform Fetish", category_id: "fetishism_specific",
        description: "Sexual arousal associated with specific uniforms (e.g., military, police, nurse, school, maid). Often tied to authority, roles, or aesthetics.",
        common_terms: ["Costume play (can overlap)"], safety_notes: ["Source/accuracy of uniform if realism is desired.", "Consent if involving impersonation in public (legal issues).", "Often part of roleplay scenarios."], common_misconceptions: [], related_kinks_ids: ["clothing_fetish_01", "psychological", "power_exchange"]
    },
    {
        id: "diaper_fetish_01", name: "Diaper Fetish (Adult)", category_id: "fetishism_specific",
        description: "Sexual arousal or comfort derived from wearing diapers. Can be linked to age play (AB/DL) or exist as a standalone fetish.",
        common_terms: ["ABDL (Adult Baby Diaper Lover - an overlapping community)", "Padding"], safety_notes: ["Skin care to prevent rashes if diapers are worn for extended periods or used.", "Hygiene if diapers are wet/soiled.", "Emotional aspects, especially if linked to regression or shame/comfort feelings.", "Disposal of used diapers."], common_misconceptions: ["Always about being treated like a baby (can be purely about the sensation/garment for some)."], related_kinks_ids: ["age_play_general_01", "fluid_play"] // If used for urine
    },
    {
        id: "shoe_fetish_01", name: "Shoe Fetish (Retifism)", category_id: "fetishism_specific",
        description: "Sexual arousal focused on shoes or other footwear (e.g., boots, heels, sneakers).",
        common_terms: ["Boot worship", "Heel fetish"], safety_notes: ["Hygiene of footwear if licked/smelled.", "Care if shoes are used to step on someone (trampling).", "Comfort of wearer if specific shoes are requested for long periods."], common_misconceptions: [], related_kinks_ids: ["foot_fetish_01", "clothing_fetish_01"]
    },
    {
        id: "hair_fetish_01", name: "Hair Fetish (Trichophilia)", category_id: "fetishism_specific",
        description: "Sexual arousal focused on hair (e.g., long hair, specific colors, body hair, or acts like hair pulling/cutting).",
        common_terms: ["Hair pulling (consensual)", "Haircut fetish"], safety_notes: ["Consent for any touching, pulling, or cutting of hair.", "Hair pulling should be done carefully to avoid scalp injury.", "If cutting, discuss desired outcome clearly."], common_misconceptions: [], related_kinks_ids: ["impact_play_general_01"] // Hair pulling
    },
    {
        id: "body_modification_fetish_01", name: "Body Modification Fetish (Visual/Conceptual)", category_id: "fetishism_specific",
        description: "Sexual arousal derived from the appearance or idea of body modifications (e.g., tattoos, piercings, scarification, implants), either on oneself or others. This fetish is about the *modification itself* as an erotic focus.",
        common_terms: ["Extreme body mod"], safety_notes: ["Admiration of existing mods is low risk.", "If inspiring someone to get mods, they must make informed choices for their own body.", "Play involving *simulating* mods (e.g., temporary tattoos, clip-on piercings) is safer than pressuring for permanent ones.", "Actual body modification procedures carry their own significant risks and should be done by professionals."], common_misconceptions: ["Everyone with body mods has this fetish."], related_kinks_ids: ["play_piercing_01"] // If play piercing is involved.
    },
    {
        id: "plushophilia_01", name: "Plushophilia (Stuffed Animals)", category_id: "fetishism_specific",
        description: "Sexual interest or arousal involving stuffed animals. Can range from using them as props, to comfort items in age play, to direct sexual interaction with them.",
        common_terms: ["Plushies"], safety_notes: ["Hygiene if used for direct sexual contact (clean plushies, use barriers if needed).", "Emotional attachment can be strong; respect this.", "If part of age play, age play safety applies."], common_misconceptions: ["Always childish (can be a complex adult fetish)."], related_kinks_ids: ["age_play_general_01", "object_insertion"] // If plushie used as an insertable
    },

    // --- VERBAL PLAY (already had 6, adding 2 more = 8) ---
    {
        id: "praise_kink_01", name: "Praise Kink", category_id: "verbal_play",
        description: "Deriving arousal, pleasure, or validation from receiving verbal praise, compliments, or words of affirmation, often within a BDSM or power exchange dynamic.",
        common_terms: ["Good girl/boy/pet", "Affirmation", "Validation", "Words of Affirmation (WoA)"], safety_notes: ["Discuss preferred types of praise and any words/phrases that are off-limits or triggering.", "Ensure praise is genuine within the context of the dynamic to be effective.", "Be mindful of emotional impact, especially if praise is withheld or used manipulatively (negotiate these aspects)."], common_misconceptions: ["It's only about being called 'good girl/boy' (False: Praise can be very specific and tailored to actions, efforts, or attributes).", "It's a sign of low self-esteem (Not necessarily: Can be a way to experience connection, reward, and deepen a dynamic)."], related_kinks_ids: ["command_following_01", "pet_play_01"]
    },
    {
        id: "degradation_verbal_01", name: "Verbal Degradation", category_id: "verbal_play",
        description: "Using demeaning, insulting, or objectifying language for arousal, as part of consensual humiliation or power exchange. Can be highly specific and negotiated.",
        common_terms: ["Name-calling", "Insults", "Objectifying language", "Slut-shaming (consensual)"], safety_notes: ["HARD limits on specific words, topics, and themes are VITAL. What's arousing for one can be genuinely harmful for another.", "Thorough discussion of triggers and off-limit areas.", "Aftercare is essential to process emotions and reaffirm self-worth outside the scene.", "Must be clearly distinguished from actual emotional abuse; consent and context are key.", "Subspace from degradation can be intense; monitor partner."], common_misconceptions: ["Same as bullying or verbal abuse (Distinction is consent, negotiation, shared context, and intent for arousal).", "The submissive secretly believes the insults (Usually about the power play and vulnerability)."], related_kinks_ids: ["humiliation_01", "objectification_01"]
    },
    {
        id: "dirty_talk_01", name: "Dirty Talk", category_id: "verbal_play",
        description: "Using explicit, suggestive, or vulgar language during sexual activity or BDSM scenes to enhance arousal and intimacy.",
        common_terms: ["Erotic talk", "Cursing (erotic)", "Sexual affirmations"], safety_notes: ["Discuss preferences for types of dirty talk (e.g., romantic vs. crude, specific scenarios or words).", "Identify any words or phrases that are off-limits or turn-offs.", "Can be part of roleplay or direct address."], common_misconceptions: ["Everyone likes the same kind of dirty talk."], related_kinks_ids: []
    },
    {
        id: "command_following_01", name: "Command Following / Obedience", category_id: "verbal_play",
        description: "Deriving pleasure from giving or obeying explicit instructions, orders, or commands within a power dynamic. Focus is on the act of obedience and the authority conveyed.",
        common_terms: ["Orders", "Instructions", "Obedience training", "Mindless obedience (fantasy)"], safety_notes: ["Negotiate limits on the types of commands (e.g., no unsafe acts, no commands that violate hard limits).", "Safewords are crucial if commands become too difficult, unwanted, or push boundaries unexpectedly.", "Clarity of commands to avoid misunderstanding.", "Can range from simple scene-based commands to ongoing lifestyle protocols."], common_misconceptions: ["Implies total mindlessness (Submissives choose to obey)."], related_kinks_ids: ["ds_dynamic_01", "protocol_play_01", "praise_kink_01"]
    },
    {
        id: "sarcasm_teasing_rp_01", name: "Sarcasm & Teasing (Erotic)", category_id: "verbal_play",
        description: "Using witty sarcasm, playful teasing, or banter as a form of foreplay, power dynamic expression, or to elicit specific reactions (e.g., bratting, frustration).",
        common_terms: ["Banter", "Playful mocking", "Witticism"], safety_notes: ["Ensure both parties enjoy this style of interaction; can be misconstrued if not a shared kink.", "Define line between playful teasing and genuinely hurtful remarks.", "Tone of voice and body language are important cues.", "Safeword if teasing crosses a line."], common_misconceptions: ["Always means disrespect (Can be affectionate and part of a dynamic)."], related_kinks_ids: ["bratting_01", "psychological"]
    },
    {
        id: "foreign_language_rp_01", name: "Foreign Language / Accents (Erotic)", category_id: "verbal_play",
        description: "Using a foreign language (real or fictional) or speaking with a specific accent for erotic effect, roleplay enhancement, or to create a sense of otherness/exoticism.",
        common_terms: ["Erotic accent play"], safety_notes: ["If using a real language, be respectful and avoid cultural appropriation or stereotyping.", "Ensure meaning is understood if specific phrases are important, or if the allure is in the unknown.", "Negotiate if one partner doesn't understand the language – is it for power, mystery, or just sound?"], common_misconceptions: [], related_kinks_ids: ["psychological", "roleplay_specific_01"]
    },
    {
        id: "storytelling_erotic_01", name: "Erotic Storytelling / Narration", category_id: "verbal_play",
        description: "Telling or listening to erotic stories, or having one partner narrate a sexual scene as it unfolds, or as a fantasy.",
        common_terms: ["Phone sex (can involve this)", "Audio erotica (listening)"], safety_notes: ["Discuss themes, limits, and desired tone of stories.", "Consent for recording if applicable.", "Can be a way to explore fantasies indirectly."], common_misconceptions: [], related_kinks_ids: ["dirty_talk_01"]
    },
    {
        id: "sound_play_01", name: "Sound Play (Non-Verbal Vocals/Impacts)", category_id: "verbal_play", // Also Sensation
        description: "Focus on sounds for arousal, e.g., moans, gasps, whimpers, or the sound of impacts (whip cracks, slaps) rather than the impact itself.",
        common_terms: ["Vocalization", "Impact sounds"], safety_notes: ["For impact sounds (like whip cracks), safety of the impact method still applies even if sound is primary.", "Encourage/discourage vocalizations as negotiated.", "Can be part of praise/degradation or sensory play."], common_misconceptions: [], related_kinks_ids: ["whip_single_01", "praise_kink_01", "degradation_verbal_01"]
    },

    // --- SENSORY MODIFICATION (5) ---
    {
        id: "sensory_deprivation_01", name: "Sensory Deprivation", category_id: "sensory_modification",
        description: "Limiting one or more senses (sight, sound, touch, smell, taste) using blindfolds, earplugs/muffs, hoods, restrictive bondage, gags, nose plugs, etc., to heighten other senses or induce altered states.",
        common_terms: ["Sens dep", "Hoods", "Blindfolds", "Earplugs", "Gags"], safety_notes: ["Can increase anxiety, disorientation, or panic, especially if multiple senses are restricted.", "Monitor closely for distress signals (non-verbal cues if gagged).", "Ensure airway is always clear if hoods or gags are used. Gags should allow some airflow or be easily removable in emergency.", "Easy way to signal for stop is essential (e.g., dropping an object, pre-agreed hand signal).", "Start with depriving one sense before multiple.", "Limit duration, especially initially."], common_misconceptions: ["Only about hoods (many methods exist)."], related_kinks_ids: ["mummification_01", "bondage", "gags_01"]
    },
    {
        id: "sensory_overload_01", name: "Sensory Overload", category_id: "sensory_modification", isHighRisk: true, // Can be psychologically intense
        description: "Intentionally bombarding multiple senses simultaneously (e.g., loud music, flashing lights, strong smells, multiple impact types, intense verbal) to create an intense, overwhelming, or altered state of consciousness (subspace, trance).",
        common_terms: ["Sensory bombardment"], safety_notes: ["Can be very intense very quickly; high risk of panic, dissociation, or triggering seizures in susceptible individuals.", "Careful negotiation of ALL stimuli to be used and their intensity.", "Build up slowly.", "Constant monitoring of the receiver's state is critical.", "Easy and reliable safeword/signal absolutely essential.", "Extensive aftercare needed to ground and process.", "Not for individuals prone to anxiety attacks or with sensory processing disorders without extreme caution and professional advice."], common_misconceptions: ["More is always better (Can quickly become too much and unsafe)."], related_kinks_ids: ["edge_play", "impact_play_general_01", "verbal_play"]
    },
    {
        id: "gags_01", name: "Gags (Ball, Tape, Scarf, etc.)", category_id: "sensory_modification", // Also Bondage
        description: "Using an object or material to fill or cover the mouth, restricting speech and sometimes breathing (latter requires extreme caution). Part of bondage, sensory play, or power exchange.",
        common_terms: ["Ball gag", "Tape gag", "Scarf gag", "Peep gag (allows some sound)"], safety_notes: ["AIRWAY IS PARAMOUNT. Ensure the person can always breathe, especially through the nose. If nasal passages are blocked (e.g., cold), gag use is much riskier.", "Tape gags should use skin-safe tape and not cover nostrils. Have scissors for quick removal.", "Ball gags should be correct size; too small can be inhaled, too large can cause jaw pain.", "Saliva build-up can be an issue (drooling, choking risk if lying flat on back); position accordingly.", "Establish clear non-verbal safewords.", "Never leave a gagged person unattended."], common_misconceptions: ["All gags completely silence (Many allow some noise)."], related_kinks_ids: ["bondage", "sensory_deprivation_01"]
    },
    {
        id: "hoods_masks_01", name: "Hoods & Masks (Sensory/Identity Play)", category_id: "sensory_modification", // Also Fetishism
        description: "Wearing hoods or masks that cover part or all of the face/head. Can be for sensory deprivation (sight, sometimes sound/smell), anonymity, objectification, or to assume a different persona.",
        common_terms: ["Bondage hood", "Gas mask (props)", "Anonymity play"], safety_notes: ["Ensure adequate ventilation and clear airways, especially with full enclosure hoods.", "Monitor for overheating.", "Can be disorienting or claustrophobic; check in with wearer.", "If vision is obscured, guide wearer carefully to prevent falls/injury.", "Clean hoods regularly, especially if shared or made of non-breathable material."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01", "objectification_01", "pet_play_01"] // Pet hoods
    },
    {
        id: "blindfolds_01", name: "Blindfolds", category_id: "sensory_modification",
        description: "Covering the eyes to remove the sense of sight, heightening other senses and increasing vulnerability or anticipation.",
        common_terms: [], safety_notes: ["Ensure blindfold is comfortable and not too tight.", "Person is more vulnerable to trips/falls; guide them if moving.", "Can increase anxiety for some; check in.", "Easy to remove or signal removal."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01", "bondage"]
    },

    // --- EXHIBITIONISM & VOYEURISM (4) ---
    {
        id: "exhibitionism_01", name: "Exhibitionism (Consensual)", category_id: "exhibition_voyeurism",
        description: "Deriving arousal from displaying one's body, nudity, or sexual activity to others who have CONSENTED to watch.",
        common_terms: ["Showing off", "Public display (consensual)"], safety_notes: ["Consent from ALL viewers is paramount. Non-consensual exhibitionism is illegal and harmful.", "Negotiate what will be shown, to whom, and where.", "If in public/semi-public spaces, be aware of laws and risk of non-consenting observers.", "Online exhibitionism needs privacy/security considerations (platform rules, recording consent)."], common_misconceptions: ["Same as illegal flashing (Consent is the absolute difference)."], related_kinks_ids: ["voyeurism_01", "stripping_tease_01"]
    },
    {
        id: "voyeurism_01", name: "Voyeurism (Consensual)", category_id: "exhibition_voyeurism",
        description: "Deriving arousal from watching others engage in sexual activity or be nude, with their full KNOWLEDGE AND CONSENT.",
        common_terms: ["Watching", "Peeping (consensual context only)"], safety_notes: ["Consent from ALL parties being watched is essential. Non-consensual voyeurism is illegal and harmful.", "Negotiate what can be watched, from where, and for how long.", "Respect privacy if certain acts are off-limits for viewing.", "If recording, explicit consent for that is also needed."], common_misconceptions: ["Same as illegal peeping (Consent is the absolute difference)."], related_kinks_ids: ["exhibitionism_01", "cuckolding_queaning_01"]
    },
    {
        id: "public_semi_public_play_01", name: "Public/Semi-Public Play (Consensual)", category_id: "exhibition_voyeurism", isHighRisk: true, // Legal and social risks
        description: "Engaging in BDSM or sexual activity in public or semi-public locations where there's a risk of being seen by non-consenting individuals. High legal and social risks.",
        common_terms: ["Risk play"], safety_notes: ["CONSENT from anyone who might unwillingly witness is impossible to guarantee in truly public spaces, making this ethically fraught and often illegal.", "Focus on 'secluded public' or private spaces with controlled access if thrill of public is desired.", "Understand local laws regarding public indecency/lewdness.", "Risk of arrest, social ostracization.", "If part of CNC fantasy, ensure all *participating* parties are fully consenting to the scenario and risks.", "Minimize impact on non-consenting public at all costs."], common_misconceptions: ["A 'victimless' thrill (Non-consenting witnesses are victims of public indecency)."], related_kinks_ids: ["exhibitionism_01"]
    },
    {
        id: "stripping_tease_01", name: "Stripping / Tease & Denial (Performance)", category_id: "exhibition_voyeurism", // Also Power Exchange
        description: "Performing a striptease or engaging in teasing behavior where arousal is built but gratification is delayed or denied, often for an audience (consenting partner or group).",
        common_terms: ["Erotic dance", "Lap dance (private)"], safety_notes: ["Consent from performer and audience.", "Negotiate level of nudity and interaction.", "If part of tease & denial, limits on denial duration and eventual outcome are key.", "Emotional aspects of teasing/denial for both parties."], common_misconceptions: [], related_kinks_ids: ["exhibitionism_01", "voyeurism_01", "tease_denial_01"]
    },

    // --- ANIMAL & PET PLAY (4) ---
    {
        id: "pet_play_01", name: "Pet Play", category_id: "animal_play",
        description: "Roleplaying as a pet (e.g., puppy, kitten, pony, fox) with a partner as an owner/handler/trainer. Can involve specific gear (collars, leashes, tails, ears, muzzles/gags), behaviors (barking, crawling, eating from bowl), and power exchange.",
        common_terms: ["Puppy play", "Kitten play", "Pony play", "Fox play", "Headspace", "Handler", "Trainer"], safety_notes: ["All participants are consenting adults.", "Negotiate species, specific behaviors, commands, and gear.", "Physical comfort and safety: knee/hand protection if crawling, hydration, avoid prolonged uncomfortable positions, ensure collars/harnesses fit correctly and don't restrict breathing.", "Hygiene if eating from bowls or direct mouth contact with 'treats'.", "Emotional aftercare, especially after deep immersion in 'petspace'."], common_misconceptions: ["It's bestiality (Absolutely false, it's human roleplay between consenting adults).", "It's always demeaning (Can be about care, training, primal connection, or power exchange)."], related_kinks_ids: ["owner_pet_01", "age_play_general_01", "bondage", "hoods_masks_01"]
    },
    {
        id: "furry_play_01", name: "Furry Play (Erotic)", category_id: "animal_play",
        description: "Incorporating elements of the furry fandom (anthropomorphic animal characters, often with artistic representations called 'fursonas', and sometimes full-body costumes called 'fursuits') into erotic play or BDSM dynamics.",
        common_terms: ["Fursuit", "Yiff (slang for furry erotica/sex)", "Murrsuit (fursuit designed for sexual activity)"], safety_notes: ["Significant risk of heatstroke in full fursuits, especially during physical activity; ensure good ventilation in suit, frequent breaks, and hydration.", "Visibility and mobility can be severely restricted in many fursuits; be cautious of surroundings.", "Hygiene of fursuits is important, especially if shared or used for fluid play.", "Consent within community standards if at furry events/conventions.", "Boundaries around character interaction vs. personal interaction."], common_misconceptions: ["All furries are into this type of play (Erotic furry play is a subset of the broader furry fandom).", "It's just about the suit (Often involves deep character immersion and identity)."], related_kinks_ids: ["pet_play_01", "costume_fetish_01", "psychological"]
    },
    {
        id: "primal_play_01", name: "Primal Play", category_id: "animal_play", // Can also be Psychological
        description: "Tapping into and expressing raw, instinctual, or 'animalistic' behaviors and urges. Can involve less defined roles than pet play, focusing on growling, biting (consensual), wrestling, hunting/chasing dynamics, or non-verbal communication.",
        common_terms: ["Hunter/Prey dynamic", "Animalistic headspace"], safety_notes: ["Negotiate boundaries for physical intensity (biting, scratching, wrestling).", "Ensure environment is safe for more unrestrained movement.", "Safewords crucial as verbal communication might be part of the 'primal' state.", "Can be cathartic but also emotionally intense; aftercare important."], common_misconceptions: ["Just uncontrolled aggression (Should be channeled and consensual)."], related_kinks_ids: ["pet_play_01", "scratching_biting_01", "fear_play_01"]
    },
    {
        id: "pony_play_01", name: "Pony Play", category_id: "animal_play",
        description: "A specific form of pet play where one partner takes on the role of a pony or horse, often involving elaborate tack (bridles, bits, harnesses, riding crops for the 'rider') and behaviors like pulling a cart or being 'ridden'.",
        common_terms: ["Human pony", "Cart pony", "Riding pony", "Tack"], safety_notes: ["All pet play safety applies.", "Special attention to gear: bits must be safe and not cause dental/jaw injury, harnesses must distribute weight correctly if pulling, avoid actual weight-bearing 'riding' unless person is exceptionally strong and trained for it (more often simulated).", "Risk of strain/injury from pulling or maintaining positions.", "Communication and safewords critical.", "Often involves significant power exchange."], common_misconceptions: ["The 'pony' is actually carrying a full human's weight (Usually simulated or very light guidance)."], related_kinks_ids: ["pet_play_01", "bondage_furniture_01"] // Carts can be furniture
    },

    // --- FOOD PLAY (4) ---
    {
        id: "food_body_01", name: "Food on Body / Nyotaimori (Consensual)", category_id: "food_play",
        description: "Using food items directly on a partner's body, either for sensual eating, visual display, or tactile sensation. Nyotaimori is the (often controversial) Japanese practice of serving sashimi or sushi from the body of a (typically nude female) model.",
        common_terms: ["Body sushi", "Feederism (can overlap if about feeding someone)"], safety_notes: ["Check for food allergies for both parties.", "Use foods that are safe for skin contact (avoid highly acidic or irritating substances unless tested).", "Temperature of food (not too hot/cold).", "Hygiene: clean body, fresh food.", "If food is eaten off the body, ensure cleanliness.", "Consent for specific foods and areas of body used.", "Clean-up planning."], common_misconceptions: ["Nyotaimori is always exploitative (Can be done consensually and respectfully, but origins and common practice raise ethical questions for many)."], related_kinks_ids: ["fetishism_specific", "objectification_01"]
    },
    {
        id: "sploshing_01", name: "Sploshing / WAM (Wet and Messy)", category_id: "food_play",
        description: "Getting messy with wet food substances (e.g., whipped cream, pies, sauces, Jell-O) by having them poured, smeared, or thrown onto a person or oneself. Often for visual, tactile, or humiliating effect.",
        common_terms: ["Pieing", "Gunge (UK term, often non-food slime too)"], safety_notes: ["Check for allergies to food items.", "Protect eyes and airways from direct splattering.", "Use food-safe substances. Avoid things that could cause infection if they enter orifices (e.g., heavily sugared items in vagina).", "Slippery floors are a major hazard; ensure safe footing.", "Plan for extensive clean-up of person and area.", "Temperature of substances."], common_misconceptions: ["Always sexual (can be about fun, silliness, or humiliation)."], related_kinks_ids: ["humiliation_01", "fluid_play"] // If it's very wet
    },
    {
        id: "feederism_gainerism_01", name: "Feederism / Gainerism (Consensual)", category_id: "food_play", isHighRisk: true, // Potential health risks
        description: "A dynamic where one person (feeder) derives pleasure from feeding another (feedee/gainer), often with the goal of the feedee gaining weight. Can involve themes of care, control, indulgence, or specific body size fetishes.",
        common_terms: ["Feeder", "Feedee", "Gainer", "Encouragement to eat"], safety_notes: ["Long-term health implications of significant weight gain are serious (diabetes, heart disease, mobility issues). Both parties must understand and accept these risks.", "Nutritional balance should still be a consideration, even if calorie intake is high.", "Consent must be ongoing; pressure to eat beyond healthy limits can be coercive.", "Body image and self-esteem issues can be complex.", "Regular medical check-ups for the gainer are advisable.", "This is distinct from eating disorders, though boundaries can be complex."], common_misconceptions: ["It's about making someone unhealthy (For some, it's about nurturing, indulgence, or aesthetic preference, but health risks are real)."], related_kinks_ids: ["power_exchange", "body_modification_fetish_01"] // Body size change
    },
    {
        id: "food_temperature_play_01", name: "Food Temperature Play", category_id: "food_play",
        description: "Using food items for temperature sensations (e.g., warm syrup, chilled fruit, ice cream) on the skin or in the mouth.",
        common_terms: [], safety_notes: ["Test temperature of warm foods carefully to avoid burns (e.g., on inner wrist).", "Avoid prolonged contact with very cold items to prevent frostnip.", "Check for allergies.", "Hygiene if food is also consumed."], common_misconceptions: [], related_kinks_ids: ["temperature_play_01", "sensation_play_general_01"]
    },

    // --- SPIRITUAL & RITUALISTIC PLAY (5) ---
    {
        id: "ritualistic_bdsm_01", name: "Ritualistic BDSM", category_id: "spiritual_ritual",
        description: "Incorporating structured rituals, symbolic acts, specific attire, or elements of ceremony into BDSM scenes. Can be for creating atmosphere, deepening connection, marking transitions, or exploring power dynamics in a formal way.",
        common_terms: ["Ceremonial play", "Symbolic acts"], safety_notes: ["Clearly define the ritual steps, roles, and any symbolic meanings.", "Ensure all props used are safe (e.g., candles secured, sharp objects handled carefully if part of ritual).", "Consent for all aspects of the ritual.", "Can be emotionally intense; aftercare important.", "Distinguish from specific religious practices unless explicitly part of a shared spiritual path."], common_misconceptions: ["Always involves actual occult practices (Can be purely aesthetic or psychological)."], related_kinks_ids: ["power_exchange", "psychological", "clothing_fetish_01"] // Robes/costumes
    },
    {
        id: "sacred_sexuality_tantra_01", name: "Sacred Sexuality / Neo-Tantra (Kink Context)", category_id: "spiritual_ritual",
        description: "Integrating principles or practices from sacred sexuality traditions (like Neo-Tantra, though often Westernized interpretations) into BDSM. May focus on energy work, prolonged sensation, spiritual connection through power exchange, or ritualized sexual acts.",
        common_terms: ["Energy play", "Tantric BDSM"], safety_notes: ["Understand the source and interpretation of practices if claiming a specific tradition.", "Consent for all physical and energetic practices.", "Boundaries around spiritual beliefs and expectations.", "Some 'tantric' workshops can be exploitative; vet practitioners carefully if seeking external guidance.", "Focus on mutual respect and genuine connection over performative spirituality."], common_misconceptions: ["Guarantees enlightenment or constant orgasm (Often misrepresented).", "Always gentle (Can be intense within a BDSM framework)."], related_kinks_ids: ["sensation_play_general_01", "power_exchange", "mind_control_rp_01"] // If focused on trance/altered states
    },
    {
        id: "possession_rp_01", name: "Possession Roleplay (Spiritual/Demonic)", category_id: "spiritual_ritual", isHighRisk: true, // Psychological intensity
        description: "Roleplaying one partner being 'possessed' by a spirit, demon, or other entity, often with changes in behavior, voice, and power dynamics. The 'possessing' entity may be controlled by the other partner or act independently within the scene.",
        common_terms: ["Demonic play", "Entity play"], safety_notes: ["High potential for intense psychological experience and emotional bleed.", "Clearly define the nature of the 'entity', its powers, and limits.", "Strong safewords and de-roling protocols are essential.", "Aftercare to re-ground and process is critical.", "Not for those with pre-existing sensitivities to such themes or unstable mental states.", "Ensure it remains firmly in realm of fantasy/roleplay."], common_misconceptions: ["Involves actual spiritual possession (It's roleplay)."], related_kinks_ids: ["psychological", "power_exchange", "fear_play_01"]
    },
    {
        id: "symbolic_sacrifice_rp_01", name: "Symbolic Sacrifice Roleplay", category_id: "spiritual_ritual",
        description: "Roleplaying a ritualistic scenario involving a symbolic 'sacrifice' (of will, pleasure, an object, or simulated life) to a deity, dominant figure, or concept. Focus is on the symbolism, power exchange, and emotional intensity.",
        common_terms: ["Ritual sacrifice play"], safety_notes: ["All 'sacrificial' acts are simulated and consensual.", "Clearly define what is being 'sacrificed' and the ritual steps.", "Ensure all props are safe (e.g., prop knives for 'bloodletting' if used, are DULL and part of blood play safety if actual 'blood' is simulated).", "Emotional intensity can be high; aftercare needed.", "Distinguish from any play that could be misconstrued as promoting actual harm."], common_misconceptions: ["Involves real harm or death (Absolutely not, it's symbolic roleplay)."], related_kinks_ids: ["ritualistic_bdsm_01", "blood_play_01", "knife_play_01", "power_exchange"]
    },
    {
        id: "meditation_trance_bdsm_01", name: "Meditation & Trance in BDSM", category_id: "spiritual_ritual",
        description: "Using meditative techniques, breathwork, rhythmic sensation, or guided imagery to induce altered states of consciousness (trance, subspace, heightened awareness) within a BDSM context. Can be for deepening submission, sensation processing, or spiritual connection.",
        common_terms: ["Subspace induction", "Kink meditation", "Breathwork for trance"], safety_notes: ["Receiver should be comfortable with meditation/trance states.", "Guidance should be gentle and consensual if one person is leading another into trance.", "Ensure physical comfort and safety during altered states.", "Gradual return to normal consciousness; grounding after.", "Be aware of potential for surfacing strong emotions."], common_misconceptions: ["Always about 'emptying the mind' (Can be about focused awareness too)."], related_kinks_ids: ["sensory_modification", "sensation_play_general_01", "power_exchange", "hypno_kink_01"] // Overlaps with hypno if guided
    },

    // --- Adding more placeholders to reach ~80 structured kinks. ---
    // --- You need to research and fill these out! ---
    // Example structure for new placeholders:
    // {
    //     id: "unique_kink_id_01", name: "Kink Name", category_id: "appropriate_category_id",
    //     description: "Detailed description to be researched and added.",
    //     common_terms: ["Term1", "Term2 (to be researched)"],
    //     safety_notes: ["Crucial safety protocols to be researched and added.", "Consider all risks."],
    //     common_misconceptions: ["Misconception to be researched and added."],
    //     related_kinks_ids: ["related_kink_id_01"],
    //     isHighRisk: false, // or true
    //     // isTaboo: false, // or true - OMITTED FOR THIS AI GENERATION ATTEMPT
    // },

    // More Impact Play
    {id: "breast_chest_impact_01", name: "Breast/Chest Impact", category_id: "impact", description: "Detailed description...", common_terms: [], safety_notes: ["Crucial safety (avoiding sternum directly, lung protection for heavy impact)..."], common_misconceptions: [], related_kinks_ids: ["spanking_01"]},
    {id: "genital_impact_01", name: "Genital Impact (Consensual)", category_id: "impact", isHighRisk: true, description: "Detailed description...", common_terms: ["CBT (for male genitals)"], safety_notes: ["Extreme caution, start very light, nerve damage risk..."], common_misconceptions: [], related_kinks_ids: ["impact_play_general_01"]},

    // More Bondage
    {id: "hogtie_01", name: "Hogtie Position", category_id: "bondage", description: "Detailed description...", common_terms: [], safety_notes: ["Risk of positional asphyxia, nerve compression, cramps..."], common_misconceptions: [], related_kinks_ids: ["rope_bondage_01", "cuffs_restraints_01"]},
    {id: "strappado_position_01", name: "Strappado Position (Simulated/Safe)", category_id: "bondage", isHighRisk: true, description: "Detailed description...", common_terms: [], safety_notes: ["High risk of shoulder injury. True strappado is torture. Safe simulation requires specific rigging by experts..."], common_misconceptions: [], related_kinks_ids: ["suspension_01"]},

    // More Power Exchange
    {id: "chastity_play_01", name: "Chastity (Male/Female)", category_id: "power_exchange", description: "Detailed description...", common_terms: ["Chastity cage/belt", "Keyholder"], safety_notes: ["Hygiene, proper fit, material safety, risk of UTIs, skin irritation..."], common_misconceptions: [], related_kinks_ids: ["denial_orgasm_01", "power_exchange"]},
    {id: "denial_orgasm_01", name: "Orgasm Denial / Control", category_id: "power_exchange", description: "Detailed description...", common_terms: ["Edging", "Blue balls (colloquial)"], safety_notes: ["Psychological effects of prolonged denial, physical discomfort, clear communication on limits/release..."], common_misconceptions: [], related_kinks_ids: ["chastity_play_01", "tease_denial_01"]},
    {id: "human_furniture_rp_01", name: "Human Furniture Roleplay", category_id: "power_exchange", description: "Detailed description...", common_terms: ["Pony play (can be furniture)", "Footstool"], safety_notes: ["Physical strain, duration limits, comfort, safe positions..."], common_misconceptions: [], related_kinks_ids: ["objectification_01", "pet_play_01"]},

    // More Sensation
    {id: "figging_01", name: "Figging", category_id: "sensation", isHighRisk: true, description: "Detailed description (inserting peeled ginger root into anus/vagina for burning sensation)...", common_terms: [], safety_notes: ["Intense burning, skin irritation, hygiene, consent for internal use..."], common_misconceptions: [], related_kinks_ids: ["object_insertion", "impact_play_general_01"]}, // Can be seen as punishment
    {id: "uvula_play_01", name: "Uvula Play / Deepthroating (Extreme)", category_id: "sensation", isHighRisk: true, description: "Detailed description (stimulating the uvula, often during deepthroating)...", common_terms: [], safety_notes: ["Gag reflex control, risk of choking/vomiting, jaw strain..."], common_misconceptions: [], related_kinks_ids: ["object_insertion"]}, // Assuming oral insertion

    // More Psychological & Roleplay
    {id: "forced_orgasm_01", name: "Forced Orgasm (Consensual)", category_id: "psychological", description: "Detailed description (Dominant brings submissive to orgasm, possibly against their 'protests' within a scene)...", common_terms: [], safety_notes: ["Clear consent, safewords, potential for emotional overwhelm..."], common_misconceptions: [], related_kinks_ids: ["denial_orgasm_01", "power_exchange"]},
    {id: "infantilism_abdl_01", name: "Infantilism (Adult Baby/Diaper Lover - ABDL)", category_id: "psychological", description: "Detailed description (broader than just diaper fetish, encompasses regression to baby/toddler state)...", common_terms: ["AB/DL", "Nursery play"], safety_notes: ["See Age Play (General) and Diaper Fetish safety. Emotional vulnerability..."], common_misconceptions: [], related_kinks_ids: ["age_play_general_01", "diaper_fetish_01"]},
    {id: "robotification_dollification_01", name: "Robotification / Dollification", category_id: "psychological", description: "Detailed description (treating/being treated as a robot or doll, often with programmed responses or limited movement)...", common_terms: ["Drone play"], safety_notes: ["Objectification safety, psychological impact, physical strain from holding poses..."], common_misconceptions: [], related_kinks_ids: ["objectification_01", "mind_control_rp_01"]},

    // More Medical Play
    {id: "injection_play_rp_01", name: "Injection Play (Roleplay/Props)", category_id: "medical_play", description: "Detailed description (roleplaying injections, using blunt prop needles or empty syringes for visual/sensation)...", common_terms: ["Needle fetish (can overlap)"], safety_notes: ["NEVER inject actual substances unless medically qualified and necessary. Use blunt/retractable props. Hygiene if skin contact..."], common_misconceptions: [], related_kinks_ids: ["medical_exam_rp_01", "play_piercing_01"]}, // Play piercing if real needles are used temporarily

    // More Object Insertion
    {id: "double_penetration_01", name: "Double Penetration (Toys/Body Parts)", category_id: "object_insertion", description: "Detailed description (simultaneous penetration of two orifices, or two objects in one orifice)...", common_terms: [], safety_notes: ["Requires significant stretching/preparation for orifices involved, ample lube, communication. Risk of tearing..."], common_misconceptions: [], related_kinks_ids: ["anal_play_01", "vaginal_penetration_01"]},

    // More Specific Fetishism
    {id: "corsetry_tight_lacing_01", name: "Corsetry / Tight Lacing", category_id: "fetishism_specific", isHighRisk: true, description: "Detailed description (wearing corsets for aesthetic shaping or extreme waist reduction via tight lacing)...", common_terms: ["Waist training"], safety_notes: ["Risk of breathing restriction, organ compression, fainting. Gradual tightening. Listen to body. Not for prolonged extreme wear..."], common_misconceptions: [], related_kinks_ids: ["clothing_fetish_01", "bondage"]},
    {id: "giant_tiny_fetish_01", name: "Giant/Tiny Fetish (Macrophilia/Microphilia)", category_id: "fetishism_specific", description: "Detailed description (arousal from the idea of interacting with giant or tiny people/objects)...", common_terms: ["Size play"], safety_notes: ["Primarily fantasy-based. Physical play might involve perspective props or power dynamics..."], common_misconceptions: [], related_kinks_ids: ["psychological", "power_exchange"]},
    {id: "smoking_fetish_01", name: "Smoking Fetish (Capnolagnia)", category_id: "fetishism_specific", description: "Detailed description (arousal from smoking or watching others smoke)...", common_terms: [], safety_notes: ["Health risks of smoking/secondhand smoke are significant. Fire safety..."], common_misconceptions: [], related_kinks_ids: []},
    {id: "age_difference_fetish_01", name: "Age Difference Fetish (Consenting Adults)", category_id: "fetishism_specific", description: "Detailed description (arousal from significant age differences between consenting adult partners)...", common_terms: ["May-December"], safety_notes: ["Ensure all parties are consenting adults of legal age. Power dynamics can be pronounced; communication is key..."], common_misconceptions: [], related_kinks_ids: ["power_exchange"]},

    // More Exhibitionism/Voyeurism
    {id: "cuckolding_queaning_01", name: "Cuckolding / Cuckqueaning", category_id: "exhibition_voyeurism", description: "Detailed description (Cuckolding: male partner is aroused by his female partner having sex with another. Cuckqueaning: female partner aroused by her male partner having sex with another)...", common_terms: ["Hotwifing (related)"], safety_notes: ["Requires extreme trust, communication, negotiation of boundaries (e.g., level of detail shared, interaction with third). STI risks with multiple partners. Emotional complexity (jealousy, compersion)..."], common_misconceptions: [], related_kinks_ids: ["voyeurism_01", "humiliation_01", "power_exchange"]},
    {id: "online_exhibition_camming_01", name: "Online Exhibitionism / Camming", category_id: "exhibition_voyeurism", description: "Detailed description (displaying oneself or sexual acts online via webcam or other platforms for consensual viewers)...", common_terms: ["Camgirl/Camboy"], safety_notes: ["Privacy, security (doxing risk), platform terms of service, consent for recording/distribution, age verification of viewers if applicable..."], common_misconceptions: [], related_kinks_ids: ["exhibitionism_01", "voyeurism_01"]},

    // More Animal Play
    {id: "human_mount_rp_01", name: "Human Mount Roleplay", category_id: "animal_play", description: "Detailed description (one partner acting as a 'mount' for another to 'ride', often in pony play or similar scenarios)...", common_terms: ["Pony riding"], safety_notes: ["Avoid actual full weight bearing unless person is exceptionally strong and trained. Simulate. Risk of strain/injury..."], common_misconceptions: [], related_kinks_ids: ["pony_play_01", "pet_play_01"]},

    // More Food Play
    {id: "food_play_forced_feeding_rp_01", name: "Forced Feeding Roleplay (Consensual)", category_id: "food_play", description: "Detailed description (one partner feeding another, possibly against their 'protests' within a scene)...", common_terms: [], safety_notes: ["Choking hazard. Type/amount of food. Allergies. Pace. Safewords..."], common_misconceptions: [], related_kinks_ids: ["feederism_gainerism_01", "power_exchange"]},

    // More Spiritual/Ritual
    {id: "body_painting_ritual_01", name: "Ritualistic Body Painting/Marking", category_id: "spiritual_ritual", description: "Detailed description (using paints or temporary markings on the body as part of a ritual or symbolic act)...", common_terms: [], safety_notes: ["Skin-safe paints. Allergies. Consent for designs/symbols..."], common_misconceptions: [], related_kinks_ids: ["ritualistic_bdsm_01", "body_worship_01"]},
 // --- ENDURANCE & ORDEALS (5) ---
    {
        id: "end_pain_01", name: "Pain Endurance Challenges", category_id: "endurance_ordeals", isHighRisk: true,
        description: "Structured scenes focused on withstanding increasing or prolonged levels of pain as a test of will, devotion, or for achieving altered states.",
        common_terms: ["Ordeal play", "Pain slut/masochist (self-identified)"],
        safety_notes: ["Negotiate types and limits of pain VERY clearly.", "Constant monitoring for signs of going beyond safe limits (e.g., shock, dissociation, non-responsive).", "Safewords absolutely critical and must be easily usable.", "Hydration and ability to rest/recover.", "Distinguish between 'good pain' and 'bad pain'.", "Aftercare is vital for physical and emotional recovery."],
        common_misconceptions: ["Masochists feel no pain (They process it differently or find pleasure/meaning in it)."],
        related_kinks_ids: ["impact_play_general_01", "sensation_play_general_01", "edge_play"]
    },
    {
        id: "end_positional_01", name: "Positional Endurance / Stress Positions", category_id: "endurance_ordeals", isHighRisk: true,
        description: "Requiring a partner to hold uncomfortable or physically challenging positions for extended periods.",
        common_terms: ["Stress holds"],
        safety_notes: ["Risk of muscle strain, joint injury, nerve compression, or circulation issues.", "Set clear time limits or signals for breaks/release.", "Avoid positions that put extreme stress on joints or restrict breathing.", "Monitor for signs of distress (numbness, cramping, dizziness).", "Allow for safe release and recovery.", "Not for individuals with pre-existing joint/muscle conditions without care."],
        common_misconceptions: ["Just about willpower (Physical limits are real)."],
        related_kinks_ids: ["bondage", "power_exchange"]
    },
    {
        id: "end_sleep_dep_01", name: "Sleep Deprivation (Consensual, Limited)", category_id: "endurance_ordeals", isHighRisk: true,
        description: "Intentionally depriving a partner of sleep for a negotiated, limited period as part of a power dynamic or endurance play. Can lead to altered states, vulnerability.",
        common_terms: [],
        safety_notes: ["Significant health risks with prolonged sleep deprivation (cognitive impairment, mood swings, hallucinations, weakened immune system).", "Keep durations SHORT (e.g., one night, not multiple days).", "Clear agreement on limits and purpose.", "Constant check-ins on mental and physical state.", "Ensure adequate recovery sleep afterwards.", "Not for individuals with mental health conditions that could be exacerbated.", "Avoid if driving or operating machinery is required soon after."],
        common_misconceptions: ["A little lost sleep is no big deal (Effects can be serious quickly)."],
        related_kinks_ids: ["power_exchange", "psychological", "edge_play"]
    },
    {
        id: "end_exposure_01", name: "Exposure to Elements (Consensual, Controlled)", category_id: "endurance_ordeals", isHighRisk: true,
        description: "Consensual, controlled exposure to uncomfortable environmental conditions like cold, heat (not fire play), or wetness for sensation or endurance.",
        common_terms: ["Cold play", "Heat play"],
        safety_notes: ["Risk of hypothermia (cold) or hyperthermia/heat stroke (heat) is very real.", "Monitor core body temperature and signs of distress (shivering, dizziness, confusion, rapid pulse).", "Strict time limits.", "Have warming/cooling measures readily available.", "Hydration is crucial, especially with heat/sweat.", "Protect sensitive skin.", "Not for individuals with medical conditions affected by temperature extremes."],
        common_misconceptions: ["It's just like being outside (Controlled setting but risks are amplified)."],
        related_kinks_ids: ["sensation_play_general_01", "bondage", "edge_play"]
    },
    {
        id: "end_task_01", name: "Task Endurance / Repetitive Tasks", category_id: "endurance_ordeals",
        description: "Assigning repetitive, mundane, or physically/mentally tiring tasks to be completed as a form of service, discipline, or to induce a specific mental state.",
        common_terms: ["Lines (writing)", "Counting grains of rice"],
        safety_notes: ["Risk of repetitive strain injury; allow for breaks and ergonomic setup if possible.", "Ensure tasks are not genuinely harmful or impossible.", "Negotiate purpose (e.g., focus, meditation, 'punishment').", "Psychological impact of boredom or frustration.", "Define completion criteria clearly."],
        common_misconceptions: ["Pointless (Can have symbolic meaning or psychological effects)."],
        related_kinks_ids: ["power_exchange", "protocol_play_01", "psychological"]
    }
    // Adding a few more placeholders to get closer to 80
    // You'll need to categorize and detail these:
    {id: "asphyxiation_breath_control_01", name: "Breath Control (Non-Neck)", category_id: "edge_play", isHighRisk:true, description: "Controlling breath via means other than direct neck pressure, e.g., gags combined with hoods, plastic bags (EXTREMELY DANGEROUS).", common_terms: [], safety_notes: ["See Breath Play. High risk of hypoxia. Never alone. Constant monitoring."], related_kinks_ids: ["breath_play_01", "sensory_deprivation_01"]},
    {id: "sleep_deprivation_01", name: "Sleep Deprivation (Consensual)", category_id: "edge_play", isHighRisk:true, description: "Intentionally depriving a partner of sleep for extended periods as part of a power dynamic or endurance play.", common_terms: [], safety_notes: ["Significant health risks (cognitive impairment, psychosis). Limits, check-ins, recovery time."], related_kinks_ids: ["power_exchange", "psychological"]},
    {id: "exposure_elements_01", name: "Exposure to Elements (Consensual)", category_id: "edge_play", isHighRisk:true, description: "Consensual exposure to cold, heat, or wet conditions for sensation or endurance.", common_terms: [], safety_notes: ["Risk of hypothermia/hyperthermia. Monitor body temp. Limits. Hydration."], related_kinks_ids: ["sensation_play_general_01", "bondage"]},
    {id: "water_boarding_simulated_01", name: "Water Boarding (Simulated)", category_id: "edge_play", isHighRisk:true, description: "Simulating waterboarding. EXTREMELY DANGEROUS, high risk of actual drowning/lung damage even in simulation.", common_terms: [], safety_notes: ["Often considered too risky by many. Requires expert knowledge to even simulate 'safely'. Instant stop. Medical knowledge."], related_kinks_ids: ["fear_play_01", "breath_play_01"]},
    {id: "interspatial_suspension_01", name: "Interspatial Suspension (e.g., between objects)", category_id: "bondage", isHighRisk:true, description: "A form of suspension not from a single overhead point. Requires advanced rigging.", common_terms: [], safety_notes: ["See Suspension. Load distribution is complex."], related_kinks_ids: ["suspension_01"]},
    {id: "forced_exercise_01", name: "Forced Exercise (Consensual)", category_id: "power_exchange", isHighRisk:true, description: "Requiring a partner to perform physical exercise to exhaustion or as punishment.", common_terms: [], safety_notes: ["Risk of overexertion, injury, rhabdomyolysis. Medical conditions. Hydration."], related_kinks_ids: ["impact_play_general_01"]}, // Punishment aspect
    {id: "human_ashtray_01", name: "Human Ashtray (Consensual)", category_id: "objectification_01", description: "Using a partner's body (e.g., mouth, skin) as an ashtray. Involves humiliation and potential minor burns.", common_terms: [], safety_notes: ["Risk of burns. Hygiene. Consent for specific body parts. Not putting out cigarettes directly on skin without EXTREME specific consent/preparation for that sensation (high risk)."], related_kinks_ids: ["humiliation_01", "smoking_fetish_01"]},
    {id: "pain_endurance_01", name: "Pain Endurance / Ordeals", category_id: "psychological", isHighRisk:true, description: "Focus on enduring prolonged or intense pain/discomfort as a psychological test or offering.", common_terms: [], safety_notes: ["Negotiate type/level of pain. Monitor for shock/dissociation. Safewords critical. Aftercare."], related_kinks_ids: ["impact_play_general_01", "sensation_play_general_01"]},
    {id: "sensory_assault_01", name: "Sensory Assault (Consensual)", category_id: "sensory_modification", isHighRisk:true, description: "Intense, often unpleasant sensory input as a form of play or punishment.", common_terms: [], safety_notes: ["See Sensory Overload. Negotiate specific stimuli. High risk of overwhelm."], related_kinks_ids: ["sensory_overload_01"]},
    {id: "castration_fantasy_rp_01", name: "Castration Fantasy/Roleplay", category_id: "psychological", description: "Roleplaying or fantasizing about castration. Typically symbolic, not actual.", common_terms: ["Eunuch play"], safety_notes: ["Clearly symbolic. Any play near genitals needs care. Emotional impact."], related_kinks_ids: ["medical_play", "power_exchange"]},
    {id: "voreaphilia_rp_01", name: "Voreaphilia Roleplay (Fantasy)", category_id: "psychological", description: "Fantasy or roleplay involving being consumed or consuming another. Purely symbolic.", common_terms: ["Vore"], safety_notes: ["Clearly symbolic. Boundaries on realism. Emotional impact."], related_kinks_ids: ["fear_play_01", "giant_tiny_fetish_01"]},
    {id: "abduction_rp_01", name: "Abduction Roleplay", category_id: "psychological", description: "Roleplaying a scenario of being abducted. Focus on fear, powerlessness, and eventual dynamic with 'captor'.", common_terms: ["Kidnapping fantasy"], safety_notes: ["See Capture/Stockholm Syndrome RP. All elements negotiated. Safewords. Aftercare."], related_kinks_ids: ["fear_play_01", "bondage", "power_exchange"]},
    {id: "age_regression_01", name: "Age Regression (Non-DDlg specific)", category_id: "psychological", description: "Reverting to a younger mental/emotional state, not necessarily linked to a specific power exchange dynamic like DDlg. Can be for comfort, play, or exploration.", common_terms: ["Agere", "Little space (general)"], safety_notes: ["Emotional vulnerability. Need for safety and reassurance. Discuss triggers. Aftercare to reorient."], related_kinks_ids: ["age_play_general_01"]},
    {id: "body_writing_01", name: "Body Writing / Marking (Temporary)", category_id: "psychological", description: "Writing words or drawing symbols on a partner's body with skin-safe markers, paints, or even lipstick. Can be decorative, humiliating, or claiming.", common_terms: ["Skin art"], safety_notes: ["Use skin-safe, non-toxic materials. Check for allergies. Consent for words/symbols used and body placement."], common_misconceptions: [], related_kinks_ids: ["objectification_01", "humiliation_01"]},
    {id: "sound_restriction_01", name: "Sound Restriction (e.g. Noise Cancelling Headphones)", category_id: "sensory_modification", description: "Detailed description of restricting sound input using various means.", common_terms: [], safety_notes: ["Detailed safety notes."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01"]},
    {id: "light_restriction_01", name: "Light Restriction (e.g. Sleep Mask, Dark Room)", category_id: "sensory_modification", description: "Detailed description of restricting light input.", common_terms: [], safety_notes: ["Detailed safety notes."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01", "blindfolds_01"]},
    {id: "smell_restriction_01", name: "Smell Restriction (e.g. Nose Plugs, Scented Masks)", category_id: "sensory_modification", description: "Detailed description of restricting smell input or introducing specific scents.", common_terms: [], safety_notes: ["Detailed safety notes."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01"]},
    {id: "taste_restriction_01", name: "Taste Restriction (e.g. Gags, Specific Foods)", category_id: "sensory_modification", description: "Detailed description of restricting or altering taste sensations.", common_terms: [], safety_notes: ["Detailed safety notes."], common_misconceptions: [], related_kinks_ids: ["sensory_deprivation_01", "gags_01"]},
    {id: "movement_restriction_01", name: "Movement Restriction (General)", category_id: "bondage", description: "General category for restricting movement not covered by specific bondage types, e.g., straitjackets, sleep sacks.", common_terms: ["Straitjacket play"], safety_notes: ["Detailed safety notes, positional asphyxia, panic."], common_misconceptions: [], related_kinks_ids: ["bondage"]},
    {id: "clothing_removal_control_01", name: "Clothing Removal Control", category_id: "power_exchange", description: "Dominant controls when/how submissive removes clothing, or submissive teasingly removes clothing for dominant.", common_terms: [], safety_notes: ["Negotiate comfort levels with nudity, speed of removal."], common_misconceptions: [], related_kinks_ids: ["stripping_tease_01", "exhibitionism_01"]},
    {id: "orgasm_control_female_01", name: "Orgasm Control (Female specific focus)", category_id: "power_exchange", description: "Focus on controlling female orgasm, including denial, forced, ruined, or timed orgasms.", common_terms: ["Female orgasm denial"], safety_notes: ["See Orgasm Denial. Specific attention to female arousal patterns."], common_misconceptions: [], related_kinks_ids: ["denial_orgasm_01", "forced_orgasm_01"]},
    {id: "orgasm_control_male_01", name: "Orgasm Control (Male specific focus)", category_id: "power_exchange", description: "Focus on controlling male orgasm, including denial (blue balls), forced, ruined, or timed orgasms. Often linked with chastity.", common_terms: ["Male orgasm denial", "Edging (male)"], safety_notes: ["See Orgasm Denial. Physical discomfort of 'blue balls'.", "Prostate health if prolonged edging without release is frequent (some debate)."], common_misconceptions: [], related_kinks_ids: ["denial_orgasm_01", "forced_orgasm_01", "chastity_play_01"]},
    {id: "tease_denial_01", name: "Tease & Denial", category_id: "power_exchange", description: "Arousing a partner to the edge of orgasm repeatedly, then denying release, or controlling when/how release occurs. Can be psychological and physical.", common_terms: ["Edging", "T&D"], safety_notes: ["Negotiate duration, number of denials, conditions for release.", "Can be very frustrating/emotional; check-ins and aftercare important.", "Physical discomfort from prolonged arousal."], common_misconceptions: ["Always leads to orgasm (release is negotiated)."], related_kinks_ids: ["denial_orgasm_01", "power_exchange"]},
    {id: "body_worship_01", name: "Body Worship", category_id: "fetishism_specific", description: "Focusing admiration, reverence, and often sensual touch (kissing, licking, massaging) on specific parts of a partner's body or their entire form.", common_terms: ["Foot worship", "Breast worship", "Ass worship"], safety_notes: ["Consent for which body parts and types of touch.", "Hygiene."], common_misconceptions: [], related_kinks_ids: ["foot_fetish_01", "praise_kink_01"]},
    {id: "playful_punishment_01", name: "Playful Punishment / Funishment", category_id: "power_exchange", description: "Administering 'punishments' that are also kinky activities the submissive enjoys, often for minor 'infractions' in a lighthearted dynamic.", common_terms: ["Funishment"], safety_notes: ["Ensure the 'punishment' is genuinely desired or at least a soft limit for the sub.", "Line between funishment and actual undesired punishment should be clear.", "Still requires negotiation and safewords."], common_misconceptions: [], related_kinks_ids: ["bratting_01", "spanking_01"]},
    {id: "roleplay_specific_01", name: "Specific Character/Scenario Roleplay", category_id: "psychological", description: "Engaging in roleplay based on specific characters (from fiction, history) or detailed pre-scripted scenarios not covered by other RP categories.", common_terms: ["Cosplay sex (can overlap)"], safety_notes: ["Negotiate characters, plot points, limits within the scenario.", "De-roling aftercare."], common_misconceptions: [], related_kinks_ids: ["psychological"]},
    {id: "clothing_fetish_01", name: "Clothing Fetish (General)", category_id: "fetishism_specific", description: "General fetishistic interest in types of clothing not covered by specific uniform/material fetishes (e.g., lingerie, stockings, specific styles).", common_terms: ["Lingerie fetish"], safety_notes: ["Consent to wear/interact with specific clothing items."], common_misconceptions: [], related_kinks_ids: ["latex_rubber_01", "leather_fetish_01", "uniform_fetish_01"]},
];


// --- ACADEMY MODULES ---
const ACADEMY_MODULES = [
    {
        id: "consent_101",
        title: "Consent 101: The Cornerstone",
        icon: "🤝",
        content: [
            { type: "heading", level: 3, text: "What is Consent?" },
            { type: "paragraph", text: "Consent is a freely given, reversible, informed, enthusiastic, and specific agreement to participate in an activity. It's not just the absence of a 'no,' but the presence of an enthusiastic 'yes!'" },
            { type: "heading", level: 4, text: "Key Principles (FRIES):" },
            { type: "list", items: [
                "<strong>Freely Given:</strong> Without pressure, manipulation, or coercion. Not given if someone is incapacitated (e.g., by alcohol, drugs, sleep).",
                "<strong>Reversible:</strong> Anyone can change their mind at any time, even if they've said yes before or are in the middle of an activity. Using a safeword is exercising this right.",
                "<strong>Informed:</strong> All parties should have a clear understanding of what they are consenting to. Surprises that go beyond negotiated boundaries are not consensual. Discuss risks.",
                "<strong>Enthusiastic:</strong> Look for genuine, eager participation, not just reluctant agreement or silence. Consent should be active, not passive.",
                "<strong>Specific:</strong> Consenting to one activity (e.g., kissing) does not imply consent for another activity (e.g., impact play). Consent for one scene does not imply consent for future scenes."
            ]},
            { type: "paragraph", text: "Even in solo exploration, understanding consent helps you define your own boundaries clearly and respect them when considering future interactions." }
        ]
    },
    {
        id: "negotiation_basics",
        title: "Negotiation: Talking About Kink",
        icon: "💬",
        content: [
            { type: "heading", level: 3, text: "Why Negotiate?" },
            { type: "paragraph", text: "Negotiation is the process of discussing desires, limits, and expectations before engaging in kink activities. It's vital for safety, comfort, and mutual enjoyment. It builds trust and ensures everyone is on the same page." },
            { type: "paragraph", text: "Even if you're only exploring for yourself right now, practicing how you would articulate these things is a valuable skill for self-understanding and future partnerships." },
            { type: "heading", level: 4, text: "What to Discuss:" },
            { type: "list", items: [
                "<strong>Interests & Desires:</strong> What do all parties want to try or enjoy? What are the fantasies?",
                "<strong>Limits:</strong> Soft limits (things one might do under certain conditions, or is hesitant about) and Hard limits (absolute no-gos, boundaries that must not be crossed).",
                "<strong>Safewords:</strong> Agreed-upon words or signals to slow down, stop, or check in.",
                "<strong>Aftercare:</strong> What kind of emotional and physical support is needed after a scene or intense experience?",
                "<strong>Specifics:</strong> Details about intensity, duration, tools to be used, specific roles, health considerations (allergies, injuries), triggers, and any other relevant factors.",
                "<strong>Contingency Plans:</strong> What happens if something goes wrong or a safeword is used?"
            ]}
        ]
    },
    {
        id: "safewords_signals",
        title: "Safewords & Signals",
        icon: "🚦",
        content: [
            { type: "heading", level: 3, text: "The Traffic Light System" },
            { type: "paragraph", text: "A common safeword system, though variations exist. The key is that everyone understands and respects the agreed-upon system:" },
            { type: "list", items: [
                "<strong>Green (or no safeword / positive affirmation):</strong> 'Everything is good, continue / I like this / More please.'",
                "<strong>Yellow (or 'Caution', 'Hold'):</strong> 'Slow down, lessen intensity, I'm approaching a limit, I need to check in, or I'm unsure.' The activity typically pauses or modifies, and a verbal check-in occurs.",
                "<strong>Red (or 'Stop', 'Mercy', 'Safeword'):</strong> 'Stop everything immediately and safely.' All activity ceases without question or argument. This is a hard stop."
            ]},
            { type: "heading", level: 4, text: "Non-Verbal Signals" },
            { type: "paragraph", text: "Essential if someone is gagged, non-verbal by choice, or otherwise unable to speak clearly. This could be dropping an object held in the hand, a specific number of taps, a pre-agreed hand signal (like a thumbs down or specific gesture), or using a clicker/squeaky toy. Must be clearly agreed upon and easily performable by the restricted person." },
            { type: "heading", level:4, text: "Important Considerations:"},
            { type: "list", items: [
                "Choose safewords that are unlikely to be said during normal scene talk (e.g., don't use 'no' or 'stop' as safewords if those are part of the roleplay dialogue; use something out of context).",
                "Practice using safewords so everyone is comfortable.",
                "The person in control (Dominant) is responsible for listening for and respecting safewords instantly.",
                "If a safeword is unclear or missed, err on the side of caution and check in."
            ]}
        ]
    },
    {
        id: "aftercare_importance_01",
        title: "Aftercare: Healing & Connection",
        icon: "🫂",
        content: [
            { type: "heading", level: 3, text: "What is Aftercare?" },
            { type: "paragraph", text: "Aftercare is the period of emotional and physical support given to participants immediately following a BDSM scene, intense sexual experience, or even deep psychological play. It helps individuals transition out of their scene headspace, process emotions, and feel safe and cared for." },
            { type: "heading", level: 4, text: "Why is Aftercare Important?" },
            { type: "list", items: [
                "<strong>Emotional Regulation:</strong> Scenes can evoke intense emotions (joy, fear, vulnerability, subspace, Domdrop). Aftercare helps stabilize these feelings.",
                "<strong>Physical Comfort:</strong> Addressing any physical needs like hydration, warmth, tending to marks or sore muscles.",
                "<strong>Reassurance & Connection:</strong> Reaffirming consent, care, and the bond between partners outside of the power dynamic.",
                "<strong>Processing the Experience:</strong> Talking about what happened, what was enjoyed, what could be different next time.",
                "<strong>Preventing Drop:</strong> 'Subdrop' (for submissives) and 'Domdrop' (for Dominants) are terms for the negative emotional/physical crash that can occur after intense scenes due to adrenaline and endorphin withdrawal. Aftercare mitigates this."
            ]},
            { type: "heading", level: 4, text: "Types of Aftercare (Negotiate these!):" },
            { type: "list", items: [
                "Cuddling, holding, physical closeness.",
                "Verbal reassurance, praise, checking in.",
                "Providing water, snacks, warm blankets.",
                "Gentle massage or tending to skin.",
                "Quiet time, listening to calming music.",
                "Talking about the scene or completely unrelated topics.",
                "Simply being present with each other.",
                "For solo exploration, self-aftercare is also important: hydrate, rest, journal, engage in a comforting activity."
            ]}
        ]
    }
];

// --- GLOSSARY TERMS ---
const GLOSSARY_TERMS = {
    "aftercare": { term: "Aftercare", definition: "The process of emotional and physical support provided after a BDSM scene or intense experience. Can include cuddling, talking, hydration, snacks, reassurance, etc. Essential for well-being and to help manage 'drop'." },
    "bdsm": { term: "BDSM", definition: "An umbrella term for a variety of erotic practices or roleplaying involving bondage & discipline, dominance & submission, sadism & masochism. It encompasses a wide range of activities and relationship dynamics based on consensual power exchange and sensation play." },
    "dom": { term: "Dominant (Dom/Domme)", definition: "A person who takes a controlling, authoritative, or leading role in a BDSM dynamic or scene. 'Domme' is often used for a female-identifying Dominant." },
    "sub": { term: "submissive (sub)", definition: "A person who consensually relinquishes some form of control or power to a Dominant partner in a BDSM dynamic or scene. Often derives pleasure or fulfillment from this yielding." },
    "switch": { term: "Switch", definition: "A person who enjoys taking on both Dominant and submissive roles, either at different times, with different partners, or even within the same scene." },
    "top": { term: "Top", definition: "Often used to describe the person who is 'doing to' or administering an activity (e.g., impact, bondage). Can overlap with Dominant but is more about the active physical role in a specific act, not necessarily overall power dynamic." },
    "bottom": { term: "Bottom", definition: "Often used to describe the person who is 'being done to' or receiving an activity. Can overlap with submissive but is more about the receptive physical role." },
    "ssc": { term: "SSC (Safe, Sane, Consensual)", definition: "A widely known ethical framework in BDSM emphasizing that activities should be conducted safely (risks understood and mitigated), with all participants of sound mind and able to consent, and with explicit, ongoing consent from everyone involved." },
    "rack": { term: "RACK (Risk-Aware Consensual Kink)", definition: "An alternative ethical framework to SSC, acknowledging that not all kink is inherently 'safe' or 'sane' by conventional standards. It emphasizes awareness of risks, informed consent to those risks, and personal responsibility." },
    "prick": { term: "PRICK (Personal Responsibility, Informed Consent, Kink)", definition: "Another ethical framework, similar to RACK, emphasizing individual accountability, thorough understanding of activities, and knowledgeable consent in kink practices." },
    "limit": { term: "Limit (Soft/Hard)", definition: "A boundary regarding activities or behaviors. A <strong>Soft Limit</strong> is something one might be hesitant about, willing to try under specific conditions, or wants to approach cautiously. A <strong>Hard Limit</strong> is an absolute 'no-go' activity or boundary that should not be crossed under any circumstances." },
    "safeword": { term: "Safeword", definition: "A pre-agreed word or signal used during a scene to communicate distress or a desire to stop or modify the activity. Essential for maintaining consent and safety." },
    "subspace": { term: "Subspace", definition: "An altered state of consciousness some submissives may experience during intense scenes, often described as euphoric, floaty, detached, or intensely focused. Can be a result of endorphin release, adrenaline, or psychological immersion." },
    "domdrop": { term: "Domdrop", definition: "An emotional or physical crash that a Dominant partner may experience after an intense scene, often due to adrenaline withdrawal, responsibility fatigue, or post-scene reflection. Aftercare is important for Doms too." },
    "vanilla": { term: "Vanilla", definition: "A term used to describe conventional sex or relationships, without BDSM or kink elements. Can also refer to a person who is not involved in or interested in kink." },
    "scene": { term: "Scene", definition: "A pre-negotiated period of BDSM activity or roleplay, often with a defined start, end, specific activities, roles, and goals. Can range from short and simple to long and complex." },
    "kink": { term: "Kink", definition: "A broad term for unconventional sexual desires, fantasies, or practices. Often overlaps with BDSM but can also include fetishes or activities not strictly tied to power exchange." },
    "fetish": { term: "Fetish", definition: "A strong sexual interest or arousal focused on a non-genital body part, a non-living object, or a specific situation. When it causes significant distress or impairment, it might be clinically diagnosable, but as a kink, it's a specific focus of arousal." },
    "negotiation": { term: "Negotiation", definition: "The crucial process of communication between partners before engaging in BDSM or kink activities, where desires, limits, safewords, aftercare, and other details are discussed and agreed upon." },
    "afterglow": { term: "Afterglow", definition: "The pleasant, relaxed, and often connected feeling experienced by participants after satisfying sexual activity or an intense BDSM scene, often facilitated by good aftercare." }
};

// --- JOURNAL PROMPTS ---
const JOURNAL_PROMPTS = [
    "What was the first kink you remember being curious about? Describe that feeling or memory.",
    "If you could design a perfect, safe scenario around one of your 'Want to Try' kinks, what would it look like, feel like, sound like?",
    "Think about one of your 'Soft Limits.' What specific conditions, reassurances, or partner qualities might make you feel comfortable exploring it further?",
    "What does 'safety' in kink mean to you personally? What actions or words from a partner make you feel safest?",
    "Describe a time you learned something new or surprising about your own desires or boundaries. What was that experience like?",
    "What role does trust play in your ideal kink explorations? How is that trust built and maintained?",
    "How do your kinks (or curiosities) intersect with your broader identity, values, or self-perception?",
    "If you were to explain a complex or misunderstood kink you're interested in to someone completely new to it, how would you describe its appeal and its risks responsibly?",
    "What are your non-negotiable 'Hard Limits' right now? Why are these specific boundaries so important to you?",
    "What kind of aftercare (even self-aftercare after intense thought or research) do you find most comforting, grounding, or fulfilling?",
    "Is there a kink you once thought was a 'Hard Limit' that has since softened, or vice-versa? What caused that shift?",
    "How do you differentiate between a fantasy you enjoy exploring in your mind versus something you'd want to try in reality?",
    "What fears or anxieties, if any, do you have about exploring your kinks further?",
    "What are you hoping to learn or gain from using this Kink Atlas for self-reflection?",
    "If you were to share a curated list with a potential partner, which kinks would you be most excited to discuss, and which would you be most nervous about?"
];
