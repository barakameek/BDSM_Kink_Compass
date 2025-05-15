// Kink Atlas - js/data.js

// --- KINK CATEGORIES ---
const KINK_CATEGORIES = {
    "impact": { id: "impact", name: "Impact Play", description: "Striking for sensation (floggers, paddles, canes, hands).", icon: "💥" },
    "bondage": { id: "bondage", name: "Bondage & Restraint", description: "Tying, cuffs, immobilization, sensory deprivation.", icon: "🔗" },
    "power_exchange": { id: "power_exchange", name: "Power Exchange", description: "D/s, TPE, Master/slave, owner/pet, protocols.", icon: "👑" },
    "sensation": { id: "sensation", name: "Sensation Play", description: "Temperature, texture, electro, tickling, piercing (play).", icon: "✨" },
    "psychological": { id: "psychological", name: "Psychological & Roleplay", description: "Mind games, scenarios, emotional intensity, age play.", icon: "🧠" },
    "edge_play": { id: "edge_play", name: "Edge Play / Risk-Aware", description: "Higher physical/psychological risk, requires expertise & extreme caution.", icon: "🔥" },
    "fluid_play": { id: "fluid_play", name: "Fluid Play", description: "Involving bodily fluids (sweat, saliva, urine etc.). Hygiene & health status critical.", icon: "💧" },
    "medical_play": { id: "medical_play", name: "Medical Play", description: "Clinical scenarios, examinations, needles (non-piercing), enemas.", icon: "🩺" },
    "object_insertion": { id: "object_insertion", name: "Object & Body Part Insertion", description: "Toys, dildos, fingers, sounding. Hygiene & body-safe materials crucial.", icon: "🎯" },
    "fetishism_specific": { id: "fetishism_specific", name: "Specific Fetishism", description: "Focused on specific objects, materials, body parts, or situations (e.g., feet, latex, uniforms).", icon: "👠" },
    "verbal_play": { id: "verbal_play", name: "Verbal Play", description: "Praise, degradation, commands, dirty talk, gaslighting (consensual).", icon: "💬" },
    "sensory_modification": { id: "sensory_modification", name: "Sensory Modification", description: "Deprivation or overload of senses (hoods, gags, blindfolds, loud music).", icon: "🕶️" },
    "exhibition_voyeurism": { id: "exhibition_voyeurism", name: "Exhibitionism & Voyeurism", description: "Being watched or watching others, public/semi-public play. Consent from ALL parties is paramount.", icon: "👀" },
    "animal_play": { id: "animal_play", name: "Animal & Pet Play", description: "Embodying animal personas or treating/being treated as a pet.", icon: "🐾" },
    "food_play": { id: "food_play", name: "Food Play", description: "Using food items in erotic or sensual ways (e.g., nyotaimori, sploshing).", icon: "🍓"},
    "spiritual_ritual": { id: "spiritual_ritual", name: "Spiritual & Ritualistic Play", description: "Incorporating spiritual, occult, or ritualistic elements into BDSM scenes.", icon: "🕯️"},
    "endurance_ordeals": { id: "endurance_ordeals", name: "Endurance & Ordeals", description: "Testing physical or psychological limits through prolonged activity or discomfort.", icon: "⏳" },
    "taboo_conceptual": { id: "taboo_conceptual", name: "Taboo & Conceptual Play (Opt-In)", description: "Kinks exploring themes often considered socially taboo, primarily psychological or fantasy-based roleplay. Requires explicit user opt-in, extreme caution, and robust negotiation.", icon: "🚫" }
};

// --- KINK DEFINITIONS ---
// YOU WILL NEED TO EXPAND THIS LIST AND FILL IN ALL DETAILS FOR PLACEHOLDERS.
const KINK_DEFINITIONS = [
    // --- IMPACT PLAY (10) ---
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
        description: "Consensual striking with fists, feet, knees, or elbows, often in a martial arts or 'fight play' context. Requires extreme control and training from both giver and receiver.",
        common_terms: ["Fight play", "Body shots", "Rough bodyplay"], safety_notes: ["Requires training in striking AND receiving blows safely for both partners.", "Protect head, neck, spine, organs (kidneys, liver, spleen), joints.", "Communicate intensity and no-go zones rigorously. Start light.", "Risk of internal injury, bruising, concussion if not done with expertise and control.", "Mouthguards can be advisable for some types of play."], common_misconceptions: ["Same as real fighting or abuse (Distinction is consent, control, shared goal, and safety measures)."], related_kinks_ids: ["fear_play_01", "endurance_ordeals"]
    },
    {
        id: "impact_crop_01", name: "Riding Crop / Tawse", category_id: "impact",
        description: "Using a riding crop (short, stiff, often with a leather loop or flapper at the end) or a tawse (a heavier leather strap, sometimes split into multiple tails) for sharp, stinging impact.",
        common_terms: ["Crop", "Tawse", "Strap"], safety_notes: ["Can be very stingy and mark easily (welts, bruises).", "Avoid bones, joints, face, and directly over kidneys/spine.", "Control is key to avoid unintended wrap or hitting sensitive areas with the tip.", "Start lightly and assess receiver's reaction to the specific sensation."], common_misconceptions: ["Only for equestrian use (widely adopted in BDSM)."], related_kinks_ids: ["spanking_01", "caning_01"]
    },
    {
        id: "impact_thud_01", name: "Thuddy Implements (e.g., Heavy Paddles, Bats - Padded)", category_id: "impact", isHighRisk: true,
        description: "Using heavy, often padded, implements to deliver deep, thudding sensations rather than sharp stings. Requires care to avoid injury to bone or internal organs.",
        common_terms: ["Thuddy toys", "Impact bat", "Meat tenderizer (padded, novelty)"], safety_notes: ["Ensure padding is sufficient if implement is hard or has concentrated points.", "Avoid direct impact over spine, kidneys, liver, spleen, major joints, and head.", "Internal bruising can occur without significant visible external marks; check for deep pain or discomfort after.", "Communicate intensity; deep thuds can be felt very differently than surface stings."], common_misconceptions: ["Padded means no harm (can still cause deep tissue injury or organ damage if misused)."], related_kinks_ids: ["paddling_01", "impact_body_01"]
    },
    {
        id: "impact_face_slap_01", name: "Face Slapping (Consensual)", category_id: "impact", isHighRisk: true, isTaboo: true,
        description: "Consensual slapping of the face. Highly psychological and can be very intense. Carries risks to eyes, ears, jaw, and can be emotionally charged.",
        common_terms: ["Humiliation slap"], safety_notes: ["EXTREME caution. Negotiate very clearly, including intensity, frequency, and emotional intent (e.g., humiliation vs. sensation).", "Avoid eyes and ears directly to prevent permanent damage (retinal detachment, burst eardrum).", "Risk of jaw injury, concussion, dental injury.", "Often more about humiliation/power than physical sensation for many; discuss psychological limits.", "Start with the lightest possible touch if any at all. Many prefer simulated or very soft taps.", "Strong emotional reactions are common; ensure robust aftercare."], common_misconceptions: ["A light tap is harmless (can still be risky, triggering, or cross a psychological boundary if not explicitly negotiated)."], related_kinks_ids: ["humiliation_01", "degradation_verbal_01", "fear_play_01"]
    },
    {
        id: "impact_sound_only_01", name: "Impact for Sound (e.g., Slap next to body)", category_id: "impact",
        description: "Creating loud impact sounds (like a hand slap against a surface, or a whip crack away from the body) but not necessarily making significant physical contact, primarily for psychological effect, startle, or auditory stimulation.",
        common_terms: ["Auditory impact", "Sound scene"], safety_notes: ["Ensure implement doesn't accidentally make unintended hard contact if aimed near the body.", "Awareness of startle reflex, especially if person is blindfolded or surprised.", "See also Single Tail Whip for specific safety on cracking whips.", "Can be used to build tension or as part of fear play."], common_misconceptions: ["No physical risk (still risk of accidental contact or startle injuries)."], related_kinks_ids: ["whip_single_01", "sound_play_01", "fear_play_01"]
    },

    // --- BONDAGE & RESTRAINT (12) ---
    {
        id: "rope_bondage_01", name: "Rope Bondage (General)", category_id: "bondage",
        description: "The use of rope (natural or synthetic) for tying, restraining, or creating aesthetic patterns on the body. It can range from simple functional restraints to complex artistic ties.",
        common_terms: ["Shibari (Japanese artistic rope bondage)", "Kinbaku (tight binding)", "Suspension (if applicable)", "Hogtie", "Floor work", "Rope bunny/model", "Rigger"], safety_notes: ["Avoid putting pressure on major nerves or arteries (e.g., inside of elbows, armpits, wrists, neck, behind knees). Learn nerve pathways.", "Always have safety shears (e.g., EMT shears with blunted tip) readily available and know how to use them without harming the person tied.", "Check for circulation frequently (e.g., capillary refill test on fingers/toes, ask about tingling/numbness).", "Never leave someone unattended in complex, restrictive, or suspension bondage.", "Be mindful of joint positions to avoid strain or injury.", "For suspension, seek expert in-person training due to high risks."], common_misconceptions: ["All rope bondage is Japanese Shibari (False: Many styles and traditions exist worldwide).", "It's easy to learn complex ties quickly from online videos (False: Requires dedicated practice, safety knowledge, and ideally in-person guidance)."], related_kinks_ids: ["shibari_01", "suspension_01", "sensory_deprivation_01", "cuffs_restraints_01"]
    },
    {
        id: "shibari_01", name: "Shibari / Kinbaku", category_id: "bondage",
        description: "A Japanese form of artistic and often intricate rope bondage. Kinbaku specifically refers to tight, constrictive rope bondage. It emphasizes aesthetics, connection, emotional intensity, and sometimes suspension.",
        common_terms: ["Nawa (rope)", "Nawashi/Bakushi (rope artist/master)", "Rigger", "Rope Bunny/Model", "Kata (form/pattern)", "Agura (a type of tie)"], safety_notes: ["All general rope bondage safety applies, often with heightened awareness due to complexity and potential for constriction.", "Specific nerve pathways (e.g., ulnar nerve) are crucial to avoid; knowledge of anatomy is vital.", "Understanding rope tension, load distribution, and friction is critical, especially for suspension.", "Requires significant study, mentorship, and practice.", "Communication (verbal and non-verbal) is paramount, especially if the model is non-verbal due to the scene."], common_misconceptions: ["It's only for sexual purposes (False: Can be purely aesthetic, meditative, about trust, or a form of BDSM expression).", "It's always painful (False: While it can be intense, the experience is negotiated and can focus on various sensations including comfort or pressure)."], related_kinks_ids: ["rope_bondage_01", "suspension_01"]
    },
    {
        id: "cuffs_restraints_01", name: "Cuffs & Restraints (Manufactured)", category_id: "bondage",
        description: "Using manufactured restraints like leather cuffs (for wrists, ankles, thighs, collar), metal shackles, spreader bars, or medical-style restraints.",
        common_terms: ["Shackles", "Spreader bar", "Hogtie cuffs", "Medical restraints", "Manacles"], safety_notes: ["Ensure proper fit to avoid chafing, cutting off circulation, or nerve pressure. Should be able to fit one or two fingers underneath.", "Check locking mechanisms if used; ensure keys are readily available and work.", "Be cautious with prolonged restraint, allow for repositioning.", "Metal restraints can get cold; be mindful of temperature."], common_misconceptions: ["Completely escape-proof (depends on item and person).", "One size fits all (false, fit is important)."], related_kinks_ids: ["rope_bondage_01", "bondage_furniture_01"]
    },
    {
        id: "suspension_01", name: "Suspension Bondage", category_id: "bondage", isHighRisk: true,
        description: "Suspending a person using ropes or other restraints so their body weight is partially or fully supported by the suspension points and bondage. Extremely high risk.",
        common_terms: ["Full suspension", "Partial suspension", "Hard points (for rigging)", "Uplines", "Aerial bondage"], safety_notes: ["EXPERT in-person training and mentorship REQUIRED. This is not for self-teaching.", "Structural integrity of suspension points is critical (must support dynamic loads far exceeding body weight).", "Deep understanding of rope mechanics, load angles, and human physiology under load (nerve compression, circulation, joint stress).", "Constant, vigilant monitoring of the suspended person for any signs of distress (nerve issues, breathing, circulation, changes in consciousness).", "Emergency release plan must be in place and practiced (e.g., quick release mechanism, ability to lower safely).", "Risk of suspension trauma (orthostatic intolerance) is serious and can occur quickly."], common_misconceptions: ["Safe for beginners to try from online tutorials (EXTREMELY FALSE).", "Looks easy (it's technically very demanding and requires extensive knowledge)."], related_kinks_ids: ["rope_bondage_01", "shibari_01"]
    },
    {
        id: "mummification_01", name: "Mummification", category_id: "bondage",
        description: "Wrapping the entire body tightly with materials like cling film (Saran wrap), vet wrap, bondage tape, or fabric, severely restricting movement and often senses.",
        common_terms: ["Body wrap", "Saran wrap bondage", "Vet wrap bondage", "Total enclosure"], safety_notes: ["Risk of overheating and dehydration is significant; monitor temperature and provide water if possible before/after. Ensure room is not too warm.", "Ensure airway is always clear and unobstructed. Never cover the face with non-breathable material without a dedicated air channel.", "Monitor breathing closely. Chest constriction can impair breathing.", "Have a quick and easy release method (e.g., safety shears for cling film/tape, easily undone knots for fabric).", "Can induce panic/claustrophobia; provide reassurance and check-ins. Establish non-verbal signals if verbal communication is restricted.", "Limit duration, especially with non-breathable materials or in warm environments."], common_misconceptions: ["Just about being still (also involves sensory modification and trust).", "Can be left alone (dangerous due to breathing/heat risks)."], related_kinks_ids: ["sensory_deprivation_01", "bondage_tape_01"]
    },
    {
        id: "bondage_tape_01", name: "Bondage Tape", category_id: "bondage",
        description: "Using specialized tape that sticks to itself but not to skin or hair, for restraints, creating garments, or sensory play.",
        common_terms: ["Self-adhesive tape", "Vet wrap (similar properties)"], safety_notes: ["Ensure it's actual bondage tape designed for skin contact, not duct tape or other industrial tapes which can severely harm skin.", "Can still constrict if wrapped too tightly, monitor circulation.", "Be careful with removal to avoid pulling body hair if it accidentally adheres to itself through hair.", "Some tapes can leave residue; check for skin sensitivity."], common_misconceptions: ["Same as duct tape (very different properties and safety)."], related_kinks_ids: ["mummification_01"]
    },
    {
        id: "bondage_furniture_01", name: "Bondage Furniture", category_id: "bondage",
        description: "Using specialized furniture like crosses (St. Andrew's, upright), spanking benches, stocks (pillory), or cages designed for BDSM play and restraint.",
        common_terms: ["St. Andrew's Cross", "Spanking bench", "Stocks", "Pillory", "Cage", "Suspension frame (if applicable)"], safety_notes: ["Ensure furniture is sturdy, well-constructed, and can support the intended weight/stress.", "Pad contact points for comfort and to prevent pressure sores or nerve damage during prolonged use.", "Be aware of pressure points and potential for nerve compression, especially with fixed positions.", "Release mechanisms should be easily accessible to the dominant/safety person.", "If using for suspension, all suspension safety rules apply."], common_misconceptions: ["Any sturdy furniture will do (purpose-built is safer)."], related_kinks_ids: ["cuffs_restraints_01", "suspension_01"]
    },
    {
        id: "hogtie_01", name: "Hogtie Position", category_id: "bondage", description: "Restraining wrists and ankles together, often behind the back, causing an arched position and significant immobility.", common_terms: ["Frogtie (similar, face down)"], safety_notes: ["High risk of nerve compression (especially wrists/ankles), positional asphyxia if face down on soft surface, muscle cramps/strain. Limit duration significantly. Constant monitoring. Ensure breathing is unimpeded. Not for individuals with back/joint issues."], common_misconceptions: ["A simple, safe tie (carries many risks)."], related_kinks_ids: ["rope_bondage_01", "cuffs_restraints_01"]},
    {
        id: "strappado_position_01", name: "Strappado Position (Simulated/Safe)", category_id: "bondage", isHighRisk: true, description: "Arms pulled behind the back and upwards, causing extreme shoulder extension. Historically a torture method. Safe simulation is complex and very risky.", common_terms: ["Reverse prayer (similar arm position)"], safety_notes: ["VERY high risk of shoulder dislocation/rotator cuff injury. True strappado is dangerous. Safe simulation requires specific rigging by EXPERTS, understanding of anatomy, and often supporting body weight differently to minimize joint stress. Not for beginners or casual play."], common_misconceptions: ["Easily simulated safely without expertise."], related_kinks_ids: ["suspension_01", "bondage_furniture_01", "pain_endurance_01"]},
    {
        id: "human_knot_01", name: "Human Knot / Complex Contortion Bondage", category_id: "bondage", isHighRisk: true,
        description: "Tying a person into very complex, contorted, and often aesthetically driven positions. Requires significant flexibility from the model and skill from the rigger.",
        common_terms: ["Contortion rope", "Artistic bondage"], safety_notes: ["Model must be very flexible and highly aware of their body's limits and communicate them clearly.", "High risk of muscle strain, joint injury, nerve compression, and circulation issues.", "Monitor constantly for any signs of distress.", "Slow, careful tying and untying are essential. Rushing can cause injury.", "Not suitable for individuals without excellent flexibility and body awareness."], common_misconceptions: ["Anyone can be tied this way with enough rope."], related_kinks_ids: ["rope_bondage_01", "shibari_01", "objectification_01"]
    },
    {
        id: "vacuum_bed_01", name: "Vacuum Bed / Vacbed", category_id: "bondage", isHighRisk: true,
        description: "Device that encases a person (usually nude or in thin latex) between layers of latex or plastic sheeting, with air pumped out to create a tight, immobilizing vacuum seal around the body.",
        common_terms: ["Vacbed", "Latex enclosure"], safety_notes: ["CRITICAL risk of suffocation if airway is not meticulously protected and monitored. A dedicated, unobstructed breathing tube/channel is essential.", "Risk of overheating is very high due to lack of air circulation; monitor body temperature and limit duration.", "Can be extremely claustrophobic and induce panic; constant communication/signals necessary.", "Quick release mechanism for the vacuum is essential in case of emergency.", "Movement is virtually impossible, increasing vulnerability.", "Ensure latex is in good condition (no tears)."], common_misconceptions: ["Completely safe due to latex (breathing/heat are major risks)."], related_kinks_ids: ["mummification_01", "sensory_deprivation_01", "latex_rubber_01"]
    },
    {
        id: "chain_bondage_01", name: "Chain Bondage", category_id: "bondage",
        description: "Using chains (often with locks) for restraint. Can be heavy and cold, providing different sensations to rope or leather. Often used for aesthetic or symbolic weight.",
        common_terms: ["Shackles (can be chain-linked)"], safety_notes: ["Chains can pinch skin or hair; use care in placement.", "Weight of chains can cause strain if used for suspension (not recommended without specialized knowledge) or prolonged unsupported restraint.", "Ensure locks are functional and keys readily available.", "Avoid rust or sharp edges on chains; use body-safe metals if possible.", "Temperature: chains can become very cold or hot depending on environment."], common_misconceptions: ["Just like rope but heavier."], related_kinks_ids: ["cuffs_restraints_01", "bondage_furniture_01", "medieval_play_rp_01"]
    },

    // --- POWER EXCHANGE (12) ---
    // (Keeping 10 existing detailed + 2 new placeholders = 12. DDlg was skipped previously)
    {
        id: "ds_dynamic_01", name: "Dominance & submission (D/s)", category_id: "power_exchange",
        description: "A dynamic where one person (Dominant) takes an authoritative role and another (submissive) takes a yielding role. Can be scene-based or ongoing, light or intense.",
        common_terms: ["Dom/sub", "Leader/follower", "Top/bottom (can overlap, but distinct)"], safety_notes: ["Clear negotiation of roles, limits, expectations, and safewords is crucial.", "Consent must be ongoing and enthusiastic from all parties.", "The Dominant partner holds significant responsibility for the submissive's well-being within the agreed framework.", "Aftercare important for both to process and reconnect.", "Regular check-ins about the dynamic's health."], common_misconceptions: ["Submissives are weak or have no agency (False, submission is a conscious choice and act of trust).", "Dominants are always aggressive or mean (False, dominance can be expressed in many ways, including caring, protective, or strict)."], related_kinks_ids: ["master_slave_01", "command_following_01", "protocol_play_01"]
    },
    {
        id: "master_slave_01", name: "Master/slave (M/s)", category_id: "power_exchange",
        description: "An intense form of D/s, often involving a deep level of commitment and power exchange, potentially 24/7. Includes specific protocols, rituals, and often a symbolic sense of 'ownership'.",
        common_terms: ["M/s", "TPE (Total Power Exchange)", "Sir/Ma'am/Master/Mistress", "Property (symbolic, consensual term)"], safety_notes: ["Requires extreme trust, profound communication, and continuous ongoing negotiation, even within a TPE framework.", "Mental and emotional well-being checks for both parties are paramount.", "Clear exit strategies or methods to pause/renegotiate the dynamic if it becomes unhealthy or unsustainable.", "Protocols should enhance the dynamic and serve the needs of both, not cause undue harm or isolate from external support systems.", "Beware of potential for real-world power imbalances to be exploited if not carefully managed with ethical considerations."], common_misconceptions: ["It's actual slavery or ownership in a legal/non-consensual sense (False, it's a consensual adult roleplay dynamic, however intense).", "Always abusive (Not if truly consensual, meticulously negotiated, and conducted with utmost care and respect for well-being)."], related_kinks_ids: ["ds_dynamic_01", "total_power_exchange_01", "protocol_play_01", "service_sub_01"]
    },
    {
        id: "total_power_exchange_01", name: "Total Power Exchange (TPE)", category_id: "power_exchange",
        description: "A dynamic where the submissive partner consensually cedes significant, broad, or near-total authority over many aspects of their life to the dominant partner, on an ongoing (often 24/7) basis. This is a very high level of commitment and trust.",
        common_terms: ["24/7 D/s", "Lifestyle D/s", "Owned (symbolic term)"], safety_notes: ["Highest level of trust, negotiation, and ongoing, open communication required. More communication is needed, not less.", "Regular, scheduled check-ins about well-being (mental, emotional, physical, financial, social) are essential.", "The submissive partner must always retain the ultimate ability to withdraw consent from the entire dynamic itself, even if in-dynamic safewords or the ability to say 'no' to specific tasks are temporarily suspended by mutual agreement. This 'meta-consent' is non-negotiable.", "Financial controls, major life decision controls (career, housing), and social interaction controls need extremely careful, explicit boundaries and regular review.", "Risk of unhealthy dependency, isolation from external support, or emotional/psychological harm if not managed with extreme care, ethics, and mutual respect.", "Both partners should have external support systems and be encouraged to maintain them."], common_misconceptions: ["The submissive has no say or free will at all (False, the initial and ongoing consent to the framework itself is the ultimate expression of their will and agency).", "It's easy to maintain or enter into lightly (False, requires immense dedication, emotional intelligence, and maturity from all involved)."], related_kinks_ids: ["master_slave_01", "ds_dynamic_01", "protocol_play_01"]
    },
    {
        id: "owner_pet_01", name: "Owner/pet", category_id: "power_exchange",
        description: "A D/s dynamic where one partner takes on the role of an owner or handler, and the other embodies the persona of a pet (e.g., puppy, kitten, pony, fox, etc.).",
        common_terms: ["Pet play", "Primal play (can overlap)", "Handler", "Trainer", "Human pet"], safety_notes: ["Negotiate specific species, expected behaviors, commands, and any associated gear (collars, leashes, tails, ears, muzzles/gags, cages).", "Humane treatment is paramount, even in a fantasy context. Comfort, hydration, and ability to communicate distress are key.", "Physical limitations (e.g., prolonged crawling, uncomfortable positions) and safety with gear (e.g., collars not too tight, safe leash use) must be considered.", "Clear distinction between pet persona and human partner, especially during aftercare.", "Hygiene if eating from bowls or using litterbox props."], common_misconceptions: ["Always demeaning or non-consensual (Can be about care, training, playful regression, or deep connection).", "Is bestiality (Absolutely false, it's human roleplay between consenting adults)."], related_kinks_ids: ["animal_play_01", "master_slave_01", "ds_dynamic_01", "protocol_play_01"]
    },
    {
        id: "protocol_play_01", name: "Protocol Play", category_id: "power_exchange",
        description: "Establishing and following specific, pre-agreed rules, rituals, forms of address, or codes of conduct within a D/s or M/s dynamic. Can be for daily life or specific scenes.",
        common_terms: ["Rules", "Rituals", "Forms of address (Sir, Master, etc.)", "Power exchange structure", "Formal D/s"], safety_notes: ["Protocols should be mutually negotiated and serve to enhance the dynamic and meet the needs/desires of both partners, not be overly burdensome, unsafe, or arbitrarily cruel.", "Flexibility and regular review of protocols are important as needs/circumstances change.", "Consequences or 'punishments' for breaking protocol must also be clearly negotiated and fall within acceptable limits.", "Ensure protocols don't isolate individuals from necessary external life (work, family if applicable, health)."], common_misconceptions: ["Protocols are always rigid and unchangeable (Healthy dynamics allow for evolution).", "Only for very serious or 'hardcore' players (Can be adapted for any level of intensity)."], related_kinks_ids: ["master_slave_01", "ds_dynamic_01", "command_following_01"]
    },
    {
        id: "service_sub_01", name: "Service Submission", category_id: "power_exchange",
        description: "A form of submission focused on performing acts of service for the dominant partner, which can range from daily chores and personal assistance to specific tasks, errands, or elaborate preparations for scenes or events.",
        common_terms: ["Acts of service", "Devotional service"], safety_notes: ["Negotiate types and extent of service clearly.", "Avoid exploitation or situations where service becomes genuinely one-sided and unfulfilling or harmful to the submissive's well-being outside the dynamic (e.g., impacting work, health, finances).", "Ensure tasks are reasonable, safe, and within the submissive's capabilities.", "Appreciation and acknowledgment of service can be important for the submissive.", "Distinguish from non-kink household responsibilities unless explicitly integrated by mutual agreement."], common_misconceptions: ["Just doing chores (Can be a deeply fulfilling and erotic expression of devotion and power exchange).", "The dominant is lazy (The focus is on the power dynamic and the submissive's offering of service)."], related_kinks_ids: ["ds_dynamic_01", "master_slave_01", "protocol_play_01"]
    },
    {
        id: "bratting_01", name: "Bratting / Brat Taming", category_id: "power_exchange",
        description: "A dynamic where a submissive partner (the 'brat') playfully disobeys rules, teases, backtalks, or challenges the dominant partner, with the intention of inviting a 'taming' response, correction, or a specific type of negotiated 'punishment'.",
        common_terms: ["Brat", "Brat tamer", "Pushing buttons", "Cheeky submissive", "Funishment"], safety_notes: ["Clear negotiation of what constitutes acceptable bratting versus genuine disrespect or pushing hard limits. Lines can be blurry if not discussed.", "The dominant partner must understand the brat's intent is playful provocation within the dynamic and not an actual rejection of their authority.", "Safewords are extra important to distinguish play from real issues or if bratting/taming goes too far.", "The 'taming' responses or 'punishments' must be pre-negotiated and fall within acceptable limits for both.", "Not all dominants enjoy brat taming, and not all submissives are brats; it's a specific dynamic preference."], common_misconceptions: ["Brats are genuinely disrespectful or don't actually want to submit (Often, bratting is a form of submission and a way to initiate desired interactions).", "All Doms enjoy or are good at brat taming (Requires a certain temperament and understanding from the Dominant)."], related_kinks_ids: ["ds_dynamic_01", "playful_punishment_01", "verbal_play", "impact_play_general_01"]
    },
    {
        id: "objectification_01", name: "Objectification (Consensual)", category_id: "power_exchange",
        description: "Treating a person consensually as an object for sexual, aesthetic, or functional pleasure within a BDSM scene or dynamic. Can involve being displayed, used as human furniture, having limited agency or communication rights within the scene, or being referred to by a number/object name.",
        common_terms: ["Human furniture", "Dollification", "Petrification (fantasy)", "Depersonalization play"], safety_notes: ["Explicit consent and detailed negotiation of limits are paramount due to the psychological intensity.", "Duration limits, especially for uncomfortable positions or restricted communication, are crucial.", "Dehumanization aspects need to be carefully discussed to avoid genuine emotional harm; what is arousing vs. damaging?", "Aftercare to reaffirm personhood, value, and connection is often critical after objectification scenes.", "Physical safety if used as 'furniture' (e.g., no unsafe weights placed)."], common_misconceptions: ["Always demeaning or non-consensual (The core of BDSM objectification is the consensual agreement to play this role).", "The person actually feels like an object with no thoughts/feelings (It's a psychological state entered for the dynamic)."], related_kinks_ids: ["bondage_furniture_01", "humiliation_01", "robotification_dollification_01", "sensory_modification"]
    },
    {
        id: "chastity_play_01", name: "Chastity (Male/Female)", category_id: "power_exchange",
        description: "Restricting access to one's own or a partner's genitals using a physical device (chastity cage for penises, chastity belt for vulvas), often with control over a locking mechanism (key) given to a dominant partner. Can be for orgasm denial, teasing, control, or symbolic purposes.",
        common_terms: ["Chastity cage", "Chastity belt", "Keyholder (KH)", "Locktober/No Nut November (community events)", "Tease and denial"], safety_notes: ["Proper fit of the device is CRUCIAL to avoid chafing, sores, restricted blood flow, or skin damage. Measure carefully.", "Hygiene is paramount; regular removal (if allowed by keyholder) and cleaning of both the device and the body are necessary to prevent infections or odor.", "Material safety (body-safe plastics like medical grade polycarbonate, stainless steel). Avoid cheap, unverified materials.", "Risk of UTIs or skin infections if hygiene is poor.", "Long-term wear needs careful monitoring for any issues. Nerve damage is a risk with ill-fitting or overly tight devices.", "Psychological aspects of denial, control, and potential frustration must be discussed.", "Emergency key access should be considered/negotiated for health or safety reasons."], common_misconceptions: ["Only for males (Female chastity devices exist and are used).", "Purely a punishment (Can be a desired state for the wearer, an act of devotion, or part of arousal)."], related_kinks_ids: ["denial_orgasm_01", "power_exchange", "protocol_play_01", "tease_denial_01"]
    },
    {
        id: "forced_attire_01", name: "Forced Attire / Clothing Control", category_id: "power_exchange",
        description: "A dynamic where the dominant partner dictates what the submissive partner wears, either in specific scenes, for particular occasions, or as part of daily life within a TPE or high-protocol dynamic. Can range from specific fetish wear to everyday clothing choices.",
        common_terms: ["Dress code", "Uniform protocol", "Wardrobe control"], safety_notes: ["Negotiate the types of clothing, comfort levels, and practicality (e.g., for work, weather).", "Financial aspects if a specific wardrobe needs to be purchased.", "Body image sensitivities and self-esteem can be impacted; communication is key.", "Ensure clothing is safe and doesn't cause physical harm (e.g., overly restrictive corsets, dangerously high heels for extended periods).", "Public appropriateness if clothing control extends outside private play."], common_misconceptions: ["Always about humiliating clothing (Can be about aesthetics, symbolism, control, or making the sub feel a certain way - e.g., elegant, slutty, professional, as negotiated)."], related_kinks_ids: ["uniform_fetish_01", "crossdressing_01", "power_exchange", "protocol_play_01", "latex_rubber_01", "leather_fetish_01"]
    },
    {
        id: "human_pony_training_01", name: "Human Pony Training (Power Exchange)", category_id: "power_exchange",
        description: "A D/s dynamic focused on 'training' a partner to act and respond like a pony, often involving specific commands, gear (bits, bridles, harnesses), and sometimes a symbolic 'breaking' of spirit or instilling obedience.",
        common_terms: ["Breaking a pony", "Pony conditioning", "Tack training"], safety_notes: ["All pony play safety considerations apply (see Animal Play).", "Psychological impact of 'breaking' or intense training needs careful negotiation, clear limits, and robust aftercare.", "Ensure training methods are consensual and not genuinely abusive or overly demeaning beyond negotiated limits.", "Physical safety with gear, especially bits and harnesses. Bits should not cause dental damage or extreme discomfort.", "Duration of 'training' sessions and physical exertion.", "Hydration and rest."], common_misconceptions: ["Always involves harsh methods (Can be based on positive reinforcement and trust, though 'breaking' implies intensity)."], related_kinks_ids: ["pony_play_01", "owner_pet_01", "command_following_01", "protocol_play_01", "animal_play"]
    },
    {
        id: "examination_control_01", name: "Examination & Bodily Control", category_id: "power_exchange",
        description: "A dynamic where the dominant partner exerts control through detailed, often ritualized, examination of the submissive's body. This can extend to dictating hygiene routines, grooming standards, diet, exercise, or posture. Often part of medical play, TPE, or high-protocol M/s dynamics.",
        common_terms: ["Body inspection", "Grooming protocol", "Hygiene control", "Postural training"], safety_notes: ["Negotiate the extent of control and the nature/frequency of examinations.", "Respect body autonomy and actual health limits; control should not lead to unhealthy practices (e.g., unsafe dieting, excessive exercise causing injury).", "Avoid shaming or overly critical approaches unless specifically negotiated as part of humiliation play.", "Can intersect with pre-existing health issues or body image sensitivities; requires responsible and empathetic handling by the dominant.", "Submissive's right to seek external medical advice should not be impeded."], common_misconceptions: ["Purely about finding flaws (Can be about care, attention to detail, control, or ensuring adherence to standards)."], related_kinks_ids: ["medical_exam_rp_01", "total_power_exchange_01", "humiliation_01", "protocol_play_01", "service_sub_01"]
    },
    // ... (Continue with placeholders for Sensation Play, Psychological, Edge Play, etc. to reach ~80 total kink structures.)
    // ... For example, under Sensation Play:
    {
        id: "acupuncture_acupressure_play_01", name: "Acupuncture/Acupressure Play (Non-Medical)", category_id: "sensation", isHighRisk: true,
        description: "Using acupuncture needles (by trained individuals or for superficial play) or acupressure techniques for erotic sensation or energy flow manipulation. Requires caution.",
        common_terms: ["Erotic acupuncture", "Pressure point play"], safety_notes: ["If using needles, all 'Play Piercing' safety applies (sterility, anatomical knowledge). Untrained acupuncture is dangerous.", "Acupressure should avoid contraindicated points (e.g., during pregnancy).", "Research specific points and their effects."], common_misconceptions: ["Same as medical acupuncture without training."], related_kinks_ids: ["play_piercing_01", "sensation_play_general_01"]
    },
    // ... Many more placeholders needed here across all categories ...
    // To save space, I will list IDs for the remaining placeholders up to ~80 count.
    // You will need to add name, category_id, and then fill in description, terms, safety, etc.

    // Placeholder IDs (You need to fill these with full kink objects structure)
    // Impact Play (already at 10)

    // Bondage (already at 12)

    // Power Exchange (already at 12)
    {id: "human_ashtray_consensual_01", name: "Human Ashtray (Consensual)", category_id: "power_exchange", isTaboo: true, description: "Using a partner's body as an ashtray. Involves humiliation and potential minor burns.", common_terms: ["Research terms"], safety_notes: ["CRITICAL: Risk of burns. Hygiene. Consent for specific body parts. Not putting out cigarettes directly on skin without EXTREME specific consent/preparation for that sensation (high risk). Fire safety with lit items."], common_misconceptions: ["Research misconceptions"], related_kinks_ids: ["humiliation_01", "smoking_fetish_01", "objectification_01"]},

    // Sensation Play (target 10, current 10 - examples above)

    // Psychological & Roleplay (target 15, current 12 detailed previously)
    {id: "infantilism_abdl_01", name: "Infantilism (AB/DL)", category_id: "psychological", description: "Roleplaying or identifying as an infant or child, often involving diapers and other baby-like paraphernalia and behaviors.", common_terms: ["Adult Baby", "Diaper Lover"], safety_notes: ["See Age Play (General) and Diaper Fetish safety. Emotional vulnerability. Consent if involving caregiving aspects."], common_misconceptions: ["Always sexual.", "Participants are actually children."], related_kinks_ids: ["age_play_general_01", "diaper_fetish_01"]},
    {id: "abduction_rp_01", name: "Abduction Roleplay", category_id: "psychological", isHighRisk: true, description: "Roleplaying a scenario of being abducted. Focus on fear, powerlessness, and eventual dynamic with 'captor'.", common_terms: ["Kidnapping fantasy"], safety_notes: ["See Capture RP. All elements negotiated. Safewords. Aftercare."], common_misconceptions: ["Glorifies real abduction."], related_kinks_ids: ["fear_play_01", "bondage", "power_exchange", "capture_rp_01"]},
    {id: "petrification_statue_rp_01", name: "Petrification/Statue Roleplay", category_id: "psychological", description: "Roleplay involving being turned into or acting as a statue or inanimate object, often involving objectification and immobility.", common_terms: ["Living statue"], safety_notes: ["Physical strain from holding poses. Objectification safety. Communication if movement is restricted."], common_misconceptions: [], related_kinks_ids: ["objectification_01", "bondage"]},

    // Verbal Play (already at 8)

    // Edge Play (target 8, current 7 detailed previously)
    {id: "russian_roulette_rp_01", name: "Russian Roulette Roleplay (Simulated)", category_id: "edge_play", isHighRisk: true, isTaboo: true, description: "Extremely dangerous psychological play simulating Russian Roulette, using PROPS ONLY. Focus on fear and chance.", common_terms: [], safety_notes: ["CRITICAL: ONLY non-functional props. NEVER real firearms. Extreme psychological intensity. Safewords. Aftercare. Many consider too risky."], common_misconceptions: ["Involves real danger with firearms if done 'carefully' (FALSE)."], related_kinks_ids: ["fear_play_01", "gun_play_rp_01"]},

    // Fluid Play (target 6, current 4 detailed previously)
    {id: "blood_drinking_fantasy_01", name: "Blood Drinking (Consensual, Symbolic/Simulated)", category_id: "fluid_play", isHighRisk: true, isTaboo: true, description: "Consensual ingestion of very small amounts of blood, or simulated blood, in a ritualistic or vampiric context. HIGH STI RISK with real blood.", common_terms: ["Vampire play"], safety_notes: ["CRITICAL: If real blood, all Blood Play safety applies (STI status, sterility). Simulated blood (food coloring in safe liquid) is far safer. Oral hygiene. Consent."], common_misconceptions: ["Safe if it's 'just a little'." ], related_kinks_ids: ["blood_play_01", "spiritual_ritual"]},
    {id: "semen_play_01", name: "Semen Play (Consensual)", category_id: "fluid_play", description: "Incorporating semen into play (e.g., facials, swallowing, body application).", common_terms: ["Cum play", "Facial"], safety_notes: ["STI risks are primary concern; know partner's status and use barriers if status unknown/risk present. Consent for specific acts. Hygiene."], common_misconceptions: [], related_kinks_ids: ["fluid_play"]},


    // Medical Play (target 8, current 5 detailed previously)
    {id: "sounding_play_01", name: "Sounding (Urethral Play with Sounds)", category_id: "medical_play", isHighRisk:true, description: "Inserting smooth, sterile objects (sounds) into the urethra for erotic sensation. High risk of injury and infection.", common_terms: ["Urethral sounding"], safety_notes: ["See Urethral Sounding (Object Insertion). STERILE equipment. SLOWLY. Risk of UTI/trauma."], common_misconceptions: [], related_kinks_ids: ["urethral_sounding_01", "object_insertion"]}, // Link to more general sounding
    {id: "medical_instrument_play_01", name: "Medical Instrument Play (General)", category_id: "medical_play", description: "Using various (often prop or cleaned actual) medical instruments for examination, sensation, or roleplay beyond specific categories like speculums or needles.", common_terms: ["Otoscope play", "Forceps play (gentle)"], safety_notes: ["Ensure props are body-safe and clean. Understand function if using real instruments. Avoid internal use unless designed for it and understood. Consent for each instrument and action."], common_misconceptions: [], related_kinks_ids: ["medical_exam_rp_01"]},
    {id: "psychiatric_rp_01", name: "Psychiatric Patient/Staff Roleplay", category_id: "medical_play", isHighRisk:true, description: "Roleplaying scenarios in a psychiatric setting, potentially involving 'patients' with simulated conditions and 'staff' exerting control or providing 'treatment'.", common_terms: ["Asylum play", "Madhouse RP"], safety_notes: ["High potential for psychological intensity and triggering. Detailed negotiation of 'conditions', 'treatments', restraints, and emotional boundaries. Safewords crucial. Extensive aftercare. Not for those with real psychiatric conditions without extreme care and self-awareness."], common_misconceptions: ["Trivializes mental illness (Can if not handled respectfully and with focus on consensual power dynamics)."], related_kinks_ids: ["medical_exam_rp_01", "power_exchange", "bondage", "humiliation_01"]},

    // Object & Body Part Insertion (target 10, current 7 detailed previously)
    {id: "vibrator_play_01", name: "Vibrator Play (External/Internal)", category_id: "object_insertion", description: "Using electric or battery-operated vibrators for clitoral, vaginal, anal, penile, or general body stimulation.", common_terms: ["Vibes"], safety_notes: ["Use body-safe materials (silicone, ABS plastic). Clean thoroughly, especially if shared or used in multiple orifices. Use appropriate lubricant. Some find intense vibration numbing over time; vary intensity/location. Ensure batteries are charged/replaced."], common_misconceptions: [], related_kinks_ids: ["dildo_play_01", "anal_play_01", "vaginal_penetration_01", "sensation_play_general_01"]},
    {id: "ben_wa_balls_01", name: "Ben Wa Balls / Kegel Balls", category_id: "object_insertion", description: "Small, weighted balls inserted into the vagina, used for Kegel exercises, subtle internal sensation, or as a form of discrete public play/teasing.", common_terms: ["Kegel balls", "Geisha balls"], safety_notes: ["Ensure balls have a retrieval string/loop if not designed to be easily expelled. Body-safe materials. Clean thoroughly. Start with shorter wear times to build tolerance/muscle strength. Can be overstimulating for some if worn too long initially."], common_misconceptions: ["Only for Kegel exercises."], related_kinks_ids: ["vaginal_penetration_01", "denial_orgasm_01", "public_semi_public_play_01"]},
    {id: "anal_beads_01", name: "Anal Beads", category_id: "object_insertion", description: "A sex toy consisting of multiple spheres or shapes connected on a string or flexible rod, designed for anal insertion and removal to create pleasurable sensations.", common_terms: ["Anal balls"], safety_notes: ["MUST have a strong, reliable retrieval string or flared base/handle. Individual beads without a string are extremely dangerous. Use generous amounts of lubricant. Insert slowly. Removal can create intense sensation; communicate speed. Clean thoroughly."], common_misconceptions: ["All beads are the same size/material."], related_kinks_ids: ["anal_play_01", "object_insertion"]},

    // Specific Fetishism (target 15, current 10 detailed previously)
    {id: "navel_fetish_01", name: "Navel Fetish (Alvinolagnia)", category_id: "fetishism_specific", description: "Sexual interest or arousal focused on the navel (belly button).", common_terms: ["Belly button play"], safety_notes: ["Hygiene. Consent for touching, licking, or inserting small (body-safe) objects if part of play."], common_misconceptions: [], related_kinks_ids: ["body_worship_01"]},
    {id: "armpit_fetish_01", name: "Armpit Fetish (Maschalagnia)", category_id: "fetishism_specific", description: "Sexual interest or arousal focused on armpits (axillae), often involving smell, licking, or hair.", common_terms: ["Axilism"], safety_notes: ["Hygiene. Consent for specific interactions. Deodorant/scent preferences."], common_misconceptions: [], related_kinks_ids: ["body_worship_01", "sweat_play_01"]},
    {id: "balloon_fetish_01", name: "Balloon Fetish (Globophilia)", category_id: "fetishism_specific", description: "Sexual arousal associated with balloons, often involving blowing them up, popping them, or rubbing against them.", common_terms: ["Looner"], safety_notes: ["Choking hazard from popped balloon pieces. Risk of startling from popping. Latex allergies if latex balloons used."], common_misconceptions: [], related_kinks_ids: []},
    {id: "smoking_fetish_01", name: "Smoking Fetish (Capnolagnia)", category_id: "fetishism_specific", description: "Sexual arousal from the act of smoking (cigarettes, cigars) or watching others smoke. Can involve elements of D/s or objectification (e.g., human ashtray).", common_terms: [], safety_notes: ["Significant health risks of smoking and secondhand smoke for all involved. Fire safety is paramount with lit tobacco products. Consent if smoke is to be blown on/near partner. If human ashtray aspect, see specific safety for that."], common_misconceptions: [], related_kinks_ids: ["human_ashtray_consensual_01", "objectification_01"]},
    {id: "age_difference_fetish_01", name: "Age Difference Interest (Consenting Adults)", category_id: "fetishism_specific", description: "Sexual or romantic interest specifically in partners with a significant age difference (older or younger). All parties must be consenting adults of legal age.", common_terms: ["May-December romance", "Age gap relationships"], safety_notes: ["Ensure all parties are consenting adults and of legal age in their jurisdiction. Power imbalances can be more pronounced due to life experience/financial differences; open communication and mutual respect are key. Societal judgment can be a factor to navigate.", "This is distinct from age play where ages are roleplayed."], common_misconceptions: ["Always exploitative (Can be genuine, loving relationships between consenting adults)."], related_kinks_ids: ["power_exchange"]}, // Not age play

    // Sensory Modification (already at 5)

    // Exhibitionism & Voyeurism (target 6, current 4 detailed previously)
    {id: "online_camming_01", name: "Online Camming / Streaming (Erotic)", category_id: "exhibition_voyeurism", description: "Performing sexually explicit or suggestive acts live on camera for an online audience, often for payment or attention.", common_terms: ["Camgirl", "Camboy", "OnlyFans (platform)"], safety_notes: ["Privacy and security are paramount (VPNs, avoiding doxing, background checks). Understand platform terms of service. Consent for recording and distribution (if any). Age verification of performer and potentially audience. Emotional labor and dealing with audience demands/harassment. Financial considerations."], common_misconceptions: ["Easy money.", "All performers enjoy all requests."], related_kinks_ids: ["exhibitionism_01", "voyeurism_01", "financial_dom_01"]},
    {id: "public_nudity_streaking_01", name: "Public Nudity / Streaking (Consensual Risk)", category_id: "exhibition_voyeurism", isHighRisk: true, isTaboo: true, description: "Becoming nude in public or semi-public places for thrill or exhibitionism, where non-consenting individuals might see. High legal risk.", common_terms: ["Naturism (non-sexual, distinct)"], safety_notes: ["High legal risk (indecent exposure). Risk of arrest, social stigma. Choose locations and times carefully to minimize unwanted witnesses if that's the goal (though this is hard to control). Consent of any planned observers. Personal safety from hostile reactions."], common_misconceptions: ["Same as naturism (naturism is typically non-sexual and community-based)."], related_kinks_ids: ["exhibitionism_01", "public_semi_public_play_01"]},

    // Animal & Pet Play (already at 4)

    // Food Play (already at 4)

    // Spiritual & Ritualistic Play (already at 5)

    // Endurance & Ordeals (already at 5)

    // Taboo & Conceptual Play (target 5, 3 detailed, 2 new placeholders)
    {
        id: "cnc_rp_01", name: "Consensual Non-Consent (CNC) Roleplay", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true,
        description: "A pre-negotiated BDSM scenario where participants explicitly consent to a scene involving 'simulated' or 'roleplayed' non-consent. Real consent to the scene itself is PARAMOUNT.",
        common_terms: ["Rape_fantasy (within CNC context)", "Struggle play"], safety_notes: ["CRITICAL: EXTREME trust, communication, and negotiation essential. Clear safewords that override in-scene 'no'. Detailed discussion of limits, triggers. Extensive aftercare."], common_misconceptions: ["It's actual non-consent (FALSE).", "Sign someone wants actual assault (FALSE)."], related_kinks_ids: ["fear_play_01", "power_exchange", "capture_rp_01"]
    },
    {
        id: "incest_rp_01", name: "Incest Roleplay (Fictional)", category_id: "taboo_conceptual", isTaboo: true,
        description: "Roleplaying scenarios involving fictional familial relationships with a sexual or power-exchange dynamic. ALL participants are unrelated consenting adults.",
        common_terms: ["Ageplay (can overlap)", "Forbidden love RP"], safety_notes: ["CRITICAL: All participants are unrelated consenting adults. Clear establishment it's FANTASY. Discuss triggers, emotional boundaries. Aftercare to de-role. This is about exploring taboo fantasy, NOT endorsing actual incest."], common_misconceptions: ["Participants are related (FALSE).", "Promotes actual incest (FALSE)."], related_kinks_ids: ["age_play_general_01", "power_exchange", "psychological"]
    },
    {
        id: "race_play_rp_01", name: "Race Play Roleplay (Consensual)", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true,
        description: "Consensual roleplaying scenarios that incorporate racial stereotypes, slurs, or power dynamics related to race. Highly controversial and potentially harmful even when 'consensual' due to real-world implications.",
        common_terms: ["Ethnic play"], safety_notes: ["CRITICAL: EXTREME caution. High potential for genuine emotional harm, offense, perpetuating harmful stereotypes. Immense trust, detailed negotiation of specific language/actions, understanding of historical/social context required. Many in BDSM consider unethical/harmful. Clear understanding of intent vs. impact. Extensive aftercare and debriefing essential. Consider if 'play' reinforces real-world bigotry."], common_misconceptions: ["It's just words/fantasy (Impact can be very real and harmful).", "Okay if participants are of certain races (Still complex and potentially harmful)."], related_kinks_ids: ["humiliation_01", "degradation_verbal_01", "power_exchange", "psychological"]
    },
    {
        id: "torture_rp_01", name: "Torture Roleplay (Simulated)", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true,
        description: "Roleplaying scenarios involving simulated torture, focusing on psychological distress, endurance, and power dynamics. Physical aspects must be carefully controlled and often simulated to avoid actual injury.",
        common_terms: ["Interrogation (extreme)", "Endurance play", "Pain play (extreme)"], safety_notes: ["CRITICAL: All physical 'torture' must be simulated or use sensations that are intense but not actually damaging (e.g., cold, specific impact, psychological). Safewords paramount. Limits on duration and type of psychological pressure. Extensive aftercare. Risk of re-traumatization or severe psychological distress if not handled by experienced individuals with extreme trust."], common_misconceptions: ["Involves actual maiming or severe injury (Should NOT in consensual play)."], related_kinks_ids: ["fear_play_01", "interrogation_rp_01", "pain_endurance_01", "edge_play", "psychological"]}
    },
    {
        id: "death_play_rp_01", name: "Death / Necro Play Roleplay (Simulated/Fantasy)", category_id: "taboo_conceptual", isTaboo: true, isHighRisk: true,
        description: "Roleplaying scenarios involving simulated death, dying, or interaction with a 'dead' or unresponsive partner (consensually feigning). Explores themes of loss, power, grief, or specific necrophilic fantasies in a purely symbolic and safe context.",
        common_terms: ["Necrophilia fantasy play", "Thanatophilia (erotic interest in death)"], safety_notes: ["CRITICAL: All aspects are SIMULATED. No actual harm or risk to life. Explicit consent for all actions. Clear signals for the 'dead' partner to indicate distress or end scene. Psychological intensity can be extreme. Extensive aftercare to de-role and process heavy emotions. Not for individuals with sensitivities to death/grief or unstable mental states. Focus on fantasy exploration.", "Breath play is NOT a safe way to simulate unresponsiveness for this and carries separate EXTREME risks."], common_misconceptions: ["Involves actual dead bodies (ABSOLUTELY NOT).", "Promotes harmful acts (It's a contained fantasy for consenting adults)."], related_kinks_ids: ["objectification_01", "fear_play_01", "psychological", "breath_play_01" /* Only if breath play is a SEPARATE negotiated element with its own safety, not to simulate death itself for long periods */]}
    }
    // Total approximately 80+ kink structures. You need to fill in the placeholders for the newer ones.
];


// --- ACADEMY MODULES ---
const ACADEMY_MODULES = [
    {
        id: "consent_101", title: "Consent 101: The Cornerstone", icon: "🤝",
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
        id: "negotiation_basics", title: "Negotiation: Talking About Kink", icon: "💬",
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
        id: "safewords_signals", title: "Safewords & Signals", icon: "🚦",
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
        id: "aftercare_importance_01", title: "Aftercare: Healing & Connection", icon: "🫂",
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
