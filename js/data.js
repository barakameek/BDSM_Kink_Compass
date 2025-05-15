// Kink Atlas - js/data.js

// --- KINK CATEGORIES ---
// These can be used to group kinks and for filtering.
const KINK_CATEGORIES = {
    "impact": {
        id: "impact",
        name: "Impact Play",
        description: "Activities involving striking the body for sensation, typically with implements like floggers, paddles, canes, or hands.",
        icon: "💥" // Example emoji icon, you could use SVG paths or image URLs
    },
    "bondage": {
        id: "bondage",
        name: "Bondage & Restraint",
        description: "The practice of using ropes, cuffs, chains, or other materials to restrain, immobilize, or limit movement.",
        icon: "🔗"
    },
    "power_exchange": {
        id: "power_exchange",
        name: "Power Exchange",
        description: "Dynamics where one or more participants cede some form of power or control to another, often involving roles like Dominant/submissive.",
        icon: "👑"
    },
    "sensation": {
        id: "sensation",
        name: "Sensation Play",
        description: "Exploring various physical sensations, which can range from temperature play (ice, wax) to texture, tickling, or electrostimulation.",
        icon: "✨"
    },
    "psychological": {
        id: "psychological",
        name: "Psychological & Roleplay",
        description: "Kinks focused on mental states, emotional dynamics, humiliation, praise, specific scenarios, or embodying particular roles.",
        icon: "🧠"
    },
    "edge_play": {
        id: "edge_play",
        name: "Edge Play / Risk-Aware",
        description: "Activities that involve higher inherent risks and require significant knowledge, experience, and explicit, ongoing consent (e.g., breath play, knife play, fire play).",
        icon: "🔥"
    },
    "fluid_play": {
        id: "fluid_play",
        name: "Fluid Play",
        description: "Activities involving bodily fluids. Requires careful attention to hygiene and health status.",
        icon: "💧"
    },
    "medical_play": {
        id: "medical_play",
        name: "Medical Play",
        description: "Roleplaying medical scenarios, often involving examinations, procedures, or specific medical fetishes. Can range from clinical to erotic.",
        icon: "🩺"
    },
    "object_insertion": {
        id: "object_insertion",
        name: "Object Insertion",
        description: "The insertion of objects (toys, fingers, etc.) into bodily orifices for pleasure or sensation. Hygiene and body-safe materials are crucial.",
        icon: "🎯" // Placeholder icon
    }
    // Add more categories as needed (e.g., Fetishism, Exhibitionism/Voyeurism, etc.)
};

// --- KINK DEFINITIONS ---
// THIS IS WHERE YOU WILL ADD YOUR COMPREHENSIVE LIST OF KINKS.
// For each kink, provide:
// - id: A unique string identifier (e.g., "spanking_01")
// - name: The common name of the kink.
// - category_id: The id of the category it belongs to (from KINK_CATEGORIES).
// - description: A clear, neutral explanation of the kink.
// - common_terms: An array of related slang or terminology.
// - safety_notes: An array of CRITICAL safety considerations and risk mitigation.
// - common_misconceptions: An array of common misunderstandings about the kink.
// - related_kinks_ids: An array of ids of other kinks that are often related.
const KINK_DEFINITIONS = [
    {
        id: "spanking_01",
        name: "Spanking",
        category_id: "impact",
        description: "Striking the buttocks with an open hand or a light implement (e.g., paddle, slipper, small flogger) for pleasure, punishment (within a consensual dynamic), or sensation. Intensity can vary greatly.",
        common_terms: ["OTK (Over The Knee)", "Paddle", "Hand Spanking", "Discipline"],
        safety_notes: [
            "Avoid the tailbone (coccyx), kidneys, and spine.",
            "Communicate clearly about intensity levels and desired sensations before and during.",
            "Warm up gradually, starting with lighter impacts.",
            "Ensure the person receiving is in a stable and comfortable position.",
            "Be aware of bruising and skin sensitivity; stop if pain becomes unintended or unsafe."
        ],
        common_misconceptions: [
            "It's always about punishment (False: Can be for affection, sensation, eroticism, or stress relief).",
            "It always has to be hard and painful (False: Intensity is highly variable and negotiated)."
        ],
        related_kinks_ids: ["paddling_01", "caning_01", "flogging_01"]
    },
    {
        id: "rope_bondage_01",
        name: "Rope Bondage (General)",
        category_id: "bondage",
        description: "The use of rope for tying, restraining, or creating aesthetic patterns on the body. It can range from simple restraints to complex artistic ties.",
        common_terms: ["Shibari (Japanese artistic rope bondage)", "Suspension (if applicable)", "Hogtie", "Floor work"],
        safety_notes: [
            "Avoid putting pressure on major nerves or arteries (e.g., inside of elbows, armpits, wrists, neck, behind knees). Learn nerve pathways.",
            "Always have safety shears (e.g., EMT shears) readily available and know how to use them without harming the person tied.",
            "Check for circulation frequently (e.g., capillary refill test on fingers/toes, ask about tingling/numbness).",
            "Never leave someone unattended in complex, restrictive, or suspension bondage.",
            "Be mindful of joint positions to avoid strain or injury.",
            "For suspension, seek expert in-person training due to high risks."
        ],
        common_misconceptions: [
            "All rope bondage is Japanese Shibari (False: Many styles and traditions exist worldwide).",
            "It's easy to learn complex ties quickly from online videos (False: Requires dedicated practice, safety knowledge, and ideally in-person guidance)."
        ],
        related_kinks_ids: ["shibari_01", "suspension_01", "sensory_deprivation_01", "cuffs_restraints_01"]
    },
    {
        id: "shibari_01",
        name: "Shibari / Kinbaku",
        category_id: "bondage",
        description: "A Japanese form of artistic and often intricate rope bondage. Kinbaku specifically refers to tight, constrictive rope bondage. It emphasizes aesthetics, connection, emotional intensity, and sometimes suspension.",
        common_terms: ["Nawa (rope)", "Nawashi/Bakushi (rope artist/master)", "Rigger", "Rope Bunny/Model", "Kata (form/pattern)"],
        safety_notes: [
            "All general rope bondage safety applies, often with heightened awareness due to complexity.",
            "Specific nerve pathways (e.g., ulnar nerve) are crucial to avoid; knowledge of anatomy is vital.",
            "Understanding rope tension, load distribution, and friction is critical, especially for suspension.",
            "Requires significant study, mentorship, and practice.",
            "Communication (verbal and non-verbal) is paramount."
        ],
        common_misconceptions: [
            "It's only for sexual purposes (False: Can be purely aesthetic, meditative, about trust, or a form of BDSM expression).",
            "It's always painful (False: While it can be intense, the experience is negotiated and can focus on various sensations)."
        ],
        related_kinks_ids: ["rope_bondage_01", "suspension_01"]
    },
    {
        id: "ddlg_01",
        name: "DDlg (Daddy Dom / little girl)",
        category_id: "power_exchange",
        description: "A dynamic within BDSM involving a caring, dominant 'Daddy' figure and a submissive, often childlike 'little girl' role. Can extend to other ageplay dynamics like MDlb (Mommy Dom/little boy), Cg/l (Caregiver/little). The 'little' role often involves regression to a younger perceived age.",
        common_terms: ["Age Play", "Little Space", "Caregiver", "Rules", "Rewards", "Punishments (negotiated)", "Headspace"],
        safety_notes: [
            "All participants must be consenting adults. This is roleplay and does not involve actual minors.",
            "Clear communication about age boundaries, expectations, triggers, and limits is crucial.",
            "Ensure the dynamic is consensual, respectful, and not exploitative.",
            "Emotional safety and aftercare are very important, especially when dealing with regression or vulnerable emotional states.",
            "Be aware of potential for emotional bleed and have strategies for managing it."
        ],
        common_misconceptions: [
            "It's always sexual (False: Can be non-sexual and focused on care, comfort, play, and emotional connection).",
            "It involves actual minors (Absolutely false and illegal. All participants are consenting adults).",
            "Littles are actually childish or immature outside of the dynamic (False: This is a chosen role and state of mind)."
        ],
        related_kinks_ids: ["age_play_general_01", "pet_play_01", "praise_kink_01", "bratting_01"]
    },
    {
        id: "breath_play_01",
        name: "Breath Play / Erotic Asphyxiation",
        category_id: "edge_play",
        description: "Restricting airflow or applying pressure to the neck to create altered states of consciousness, light-headedness, or intense sensations. This is a high-risk activity.",
        common_terms: ["Choking", "Breath Control", "Hypoxyphilia", "Asphyxiation"],
        safety_notes: [
            "EXTREMELY DANGEROUS. Risk of serious injury, brain damage, or death is significant if done incorrectly or without a knowledgeable, attentive, and sober partner.",
            "NEVER do this alone (auto-erotic asphyxiation is a leading cause of accidental death).",
            "Avoid direct pressure on the carotid arteries in the neck (sides of the neck), as this can cause rapid unconsciousness, stroke, or death. If pressure is applied to the neck, it should ideally be on the windpipe (trachea) from the front, and even then, with extreme caution and minimal force.",
            "The person applying restriction MUST be sober, alert, fully understand the risks, and know CPR/emergency procedures. They are solely responsible for the other's safety.",
            "Have a clear, easily performed, non-verbal stop signal that doesn't require breath (e.g., dropping an object, specific hand signal like snapping fingers if hands are free).",
            "Limit duration of restriction to very short periods (mere seconds). Release immediately at any sign of distress or the stop signal.",
            "This app strongly advises seeking expert in-person education from reputable sources before ever attempting. Many consider this too risky to engage in at all."
        ],
        common_misconceptions: [
            "It's safe if you're careful (False: It's inherently very risky, though risks can be *reduced* with extreme caution, knowledge, and a trusted partner. It is never truly 'safe').",
            "Losing consciousness is the goal (False: For many, the goal is altered sensation before unconsciousness. Unconsciousness itself is a high-danger sign)."
        ],
        related_kinks_ids: ["edge_play_general_01", "sensory_overload_01"]
    },
    {
        id: "praise_kink_01",
        name: "Praise Kink",
        category_id: "psychological",
        description: "Deriving arousal, pleasure, or validation from receiving verbal praise, compliments, or words of affirmation, often within a BDSM or power exchange dynamic.",
        common_terms: ["Good girl/boy/pet", "Affirmation", "Validation", "Words of Affirmation (WoA)"],
        safety_notes: [
            "Discuss preferred types of praise and any words/phrases that are off-limits or triggering.",
            "Ensure praise is genuine within the context of the dynamic to be effective.",
            "Be mindful of emotional impact, especially if praise is withheld or used manipulatively (negotiate these aspects).",
        ],
        common_misconceptions: [
            "It's only about being called 'good girl/boy' (False: Praise can be very specific and tailored to actions, efforts, or attributes).",
            "It's a sign of low self-esteem (Not necessarily: Can be a way to experience connection, reward, and deepen a dynamic)."
        ],
        related_kinks_ids: ["ddlg_01", "pet_play_01", "degradation_humiliation_01"] // Degradation can be an opposite, or sometimes used in conjunction for contrast
    },
    // START ADDING YOUR EXPANDED LIST HERE!
    // Example:
    // {
    //     id: "flogging_01",
    //     name: "Flogging",
    //     category_id: "impact",
    //     description: "Using a flogger (a whip with multiple soft tails or falls) to strike the body, typically the back, buttocks, or thighs. Sensations can range from thuddy to stingy depending on the flogger type and technique.",
    //     common_terms: ["Thuddy", "Stingy", "Falls", "Knots (on flogger handle)"],
    //     safety_notes: [
    //         "Avoid kidneys, spine, neck, and joints.",
    //         "Start with lighter impacts and gradually increase intensity as negotiated.",
    //         "Be aware of the 'wrap' of the flogger tails, especially around sensitive areas.",
    //         "Check skin regularly for signs of excessive marking or breakage if that's not the intent."
    //     ],
    //     common_misconceptions: [
    //         "All floggers are the same (False: Material, number of tails, length, and weight vary greatly, affecting sensation).",
    //         "Flogging is always about intense pain (False: Can be used for rhythmic sensation, warmth, or a prelude to other activities)."
    //     ],
    //     related_kinks_ids: ["spanking_01", "caning_01", "impact_play_general_01"]
    // },
    // ... continue with many more kinks ...
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
                "<strong>Reversible:</strong> Anyone can change their mind at any time, even if they've said yes before or are in the middle of an activity.",
                "<strong>Informed:</strong> All parties should have a clear understanding of what they are consenting to. Surprises that go beyond negotiated boundaries are not consensual.",
                "<strong>Enthusiastic:</strong> Look for genuine, eager participation, not just reluctant agreement or silence.",
                "<strong>Specific:</strong> Consenting to one activity (e.g., kissing) does not imply consent for another activity (e.g., impact play)."
            ]},
            { type: "paragraph", text: "Even in solo exploration, understanding consent helps you define your own boundaries clearly and respect them." }
        ]
    },
    {
        id: "negotiation_basics",
        title: "Negotiation: Talking About Kink",
        icon: "💬",
        content: [
            { type: "heading", level: 3, text: "Why Negotiate?" },
            { type: "paragraph", text: "Negotiation is the process of discussing desires, limits, and expectations before engaging in kink activities. It's vital for safety, comfort, and mutual enjoyment." },
            { type: "paragraph", text: "Even if you're only exploring for yourself right now, practicing how you would articulate these things is a valuable skill." },
            { type: "heading", level: 4, text: "What to Discuss:" },
            { type: "list", items: [
                "<strong>Interests:</strong> What do all parties want to try or enjoy?",
                "<strong>Limits:</strong> Soft limits (things you might do under certain conditions) and Hard limits (absolute no-gos).",
                "<strong>Safewords:</strong> Agreed-upon words to slow down, stop, or check in. (e.g., 'Yellow' for caution, 'Red' for stop).",
                "<strong>Aftercare:</strong> What support is needed after a scene (e.g., cuddles, water, quiet time, reassurance)?",
                "<strong>Specifics:</strong> Details about intensity, duration, tools, roles, etc."
            ]}
        ]
    },
    {
        id: "safewords_signals",
        title: "Safewords & Signals",
        icon: "🚦",
        content: [
            { type: "heading", level: 3, text: "The Traffic Light System" },
            { type: "paragraph", text: "A common safeword system:" },
            { type: "list", items: [
                "<strong>Green (or no safeword):</strong> 'Everything is good, continue / I like this.'",
                "<strong>Yellow (or 'Caution'):</strong> 'Slow down, lessen intensity, I'm approaching a limit, or I need to check in.' The activity pauses or modifies, and a check-in occurs.",
                "<strong>Red (or 'Stop'):</strong> 'Stop everything immediately and safely.' All activity ceases without question."
            ]},
            { type: "heading", level: 4, text: "Non-Verbal Signals" },
            { type: "paragraph", text: "Essential if someone is gagged or otherwise unable to speak. This could be dropping an object, a specific number of taps, or a hand signal. Must be clearly agreed upon beforehand." }
        ]
    }
    // Add more modules (e.g., Aftercare, Risk Profiles, Finding Community Safely)
];

// --- GLOSSARY TERMS ---
const GLOSSARY_TERMS = {
    "aftercare": {
        term: "Aftercare",
        definition: "The process of emotional and physical support provided after a BDSM scene or intense experience. Can include cuddling, talking, hydration, snacks, reassurance, etc. Essential for well-being."
    },
    "dom": {
        term: "Dominant (Dom/Domme)",
        definition: "A person who takes a controlling or leading role in a BDSM dynamic or scene. 'Domme' is often used for a female-identifying Dominant."
    },
    "sub": {
        term: "submissive (sub)",
        definition: "A person who relinquishes some form of control to a Dominant in a BDSM dynamic or scene."
    },
    "switch": {
        term: "Switch",
        definition: "A person who enjoys taking on both Dominant and submissive roles, either at different times or with different partners."
    },
    "ssc": {
        term: "SSC (Safe, Sane, Consensual)",
        definition: "A common ethical framework in BDSM emphasizing that activities should be conducted safely, with all participants of sound mind and able to consent, and with explicit consent from everyone involved."
    },
    "rack": {
        term: "RACK (Risk-Aware Consensual Kink)",
        definition: "An alternative ethical framework to SSC, acknowledging that not all kink is inherently 'safe' or 'sane' by conventional standards, but emphasizes awareness of risks and informed consent."
    },
    "prick": {
        term: "PRICK (Personal Responsibility, Informed Consent, Kink)",
        definition: "Another ethical framework emphasizing individual accountability and knowledgeable consent in kink practices."
    },
    "limit": {
        term: "Limit (Soft/Hard)",
        definition: "A boundary. A <strong>Soft Limit</strong> is something one might be willing to try under specific conditions or is unsure about. A <strong>Hard Limit</strong> is an absolute 'no-go' activity or boundary that should not be crossed."
    },
    "vanilla": {
        term: "Vanilla",
        definition: "A term used to describe conventional sex or relationships, without BDSM or kink elements. Can also refer to a person who is not involved in kink."
    },
    "scene": {
        term: "Scene",
        definition: "A pre-negotiated period of BDSM activity or roleplay, with a defined start and end, or specific activities."
    }
    // Add many more terms
};

// --- JOURNAL PROMPTS (Optional starter prompts) ---
const JOURNAL_PROMPTS = [
    "What was the first kink you remember being curious about? Describe that feeling.",
    "If you could design a perfect scenario around one of your 'Want to Try' kinks, what would it look like (even if it's pure fantasy)?",
    "Think about a 'Soft Limit.' What are the specific conditions or reassurances that might make you explore it?",
    "What does 'safety' in kink mean to you personally?",
    "Describe a time you learned something new about your desires or boundaries. What was that like?",
    "What role does trust play in your ideal kink explorations?",
    "How do your kinks intersect with your identity or self-perception?",
    "If you were to explain a complex kink you're interested in to someone completely new to it, how would you describe its appeal and its risks?",
    "What are your non-negotiable 'Hard Limits' right now, and why are they important to you?",
    "What kind of aftercare (even self-aftercare after intense thought/research) do you find most comforting or grounding?"
];

// No need to attach to window if app.js loads this script first.
// The variables will be in the global scope for app.js to use.
