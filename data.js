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
    }
    // Add more categories as needed
};

// --- KINK DEFINITIONS ---
// This will be your main database of kinks.
const KINK_DEFINITIONS = [
    {
        id: "spanking_01",
        name: "Spanking",
        category_id: "impact",
        description: "Striking the buttocks with an open hand or a light implement for pleasure, punishment, or sensation.",
        common_terms: ["OTK (Over The Knee)", "Paddle", "Hand Spanking"],
        safety_notes: [
            "Avoid the tailbone (coccyx) and kidneys.",
            "Communicate about intensity levels.",
            "Warm up gradually."
        ],
        common_misconceptions: [
            "It's always about punishment (False, can be for affection, sensation, or eroticism).",
            "It always has to be hard (False, intensity varies greatly)."
        ],
        related_kinks_ids: ["paddling_01", "caning_01"]
    },
    {
        id: "rope_bondage_01",
        name: "Rope Bondage (General)",
        category_id: "bondage",
        description: "The use of rope for tying, restraining, or creating aesthetic patterns on the body.",
        common_terms: ["Shibari (Japanese artistic rope bondage)", "Suspension (if applicable)", "Hogtie"],
        safety_notes: [
            "Avoid putting pressure on nerves or arteries (e.g., inside of elbows, wrists, neck).",
            "Always have safety shears readily available and know how to use them.",
            "Check for circulation frequently (capillary refill test).",
            "Never leave someone unattended in complex or suspension bondage."
        ],
        common_misconceptions: [
            "All rope bondage is Japanese Shibari (False, many styles exist).",
            "It's easy to learn complex ties quickly (False, requires practice and safety knowledge)."
        ],
        related_kinks_ids: ["shibari_01", "suspension_01", "sensory_deprivation_01"]
    },
    {
        id: "shibari_01",
        name: "Shibari / Kinbaku",
        category_id: "bondage",
        description: "A Japanese form of artistic and often intricate rope bondage, emphasizing aesthetics, connection, and sometimes suspension.",
        common_terms: ["Nawa (rope)", "Nawashi/Bakushi (rope artist)", "Rigger", "Rope Bunny"],
        safety_notes: [
            "Specific nerve pathways (e.g., ulnar nerve) are crucial to avoid.",
            "Understanding rope tension and distribution is vital.",
            "Requires significant study and practice, especially for suspension."
        ],
        common_misconceptions: [
            "It's only for sexual purposes (False, can be purely aesthetic, meditative, or about trust)."
        ],
        related_kinks_ids: ["rope_bondage_01", "suspension_01"]
    },
    {
        id: "ddlg_01",
        name: "DDlg (Daddy Dom / little girl)",
        category_id: "power_exchange",
        description: "A dynamic involving a caring, dominant 'Daddy' figure and a submissive, childlike 'little girl' role. Can extend to other ageplay dynamics (e.g., MDlb, Cg/l).",
        common_terms: ["Age Play", "Little Space", "Caregiver", "Rules", "Rewards", "Punishments (negotiated)"],
        safety_notes: [
            "Clear communication about age boundaries and expectations is crucial.",
            "Ensure the dynamic is consensual and not exploitative.",
            "Emotional safety and aftercare are very important."
        ],
        common_misconceptions: [
            "It's always sexual (False, can be non-sexual and focused on care and comfort).",
            "It involves actual minors (Absolutely false, all participants must be consenting adults)."
        ],
        related_kinks_ids: ["age_play_general_01", "pet_play_01"] // Example
    },
    {
        id: "breath_play_01",
        name: "Breath Play / Erotic Asphyxiation",
        category_id: "edge_play",
        description: "Restricting airflow to create altered states of consciousness or intense sensations. This is a high-risk activity.",
        common_terms: ["Choking", "Breath Control", "Hypoxyphilia"],
        safety_notes: [
            "EXTREMELY DANGEROUS. Risk of brain damage or death is significant if done incorrectly or without a knowledgeable, attentive partner.",
            "NEVER do this alone (auto-erotic asphyxiation is a leading cause of accidental death).",
            "Avoid pressure on the carotid arteries in the neck (can cause stroke or rapid unconsciousness). Pressure should be on the windpipe, if at all, and very carefully.",
            "The person applying restriction must be sober, alert, and know CPR.",
            "Have a clear, non-verbal stop signal that doesn't require breath.",
            "Limit duration of restriction to very short periods (seconds).",
            "This app strongly advises seeking expert in-person education before attempting."
        ],
        common_misconceptions: [
            "It's safe if you're careful (False, it's inherently risky but can be risk-reduced with extreme caution and knowledge)."
        ],
        related_kinks_ids: []
    }
    // ... Add MANY more kinks here!
];

// --- ACADEMY MODULES ---
// Content for your educational section.
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
    // Add more modules
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


// To make these available to app.js, you can attach them to the window object
// or, if you set up app.js as an ES6 module, you can export them.
// For simplicity in this single-file approach, we can assign to window if not using modules.
// This is generally not best practice for larger apps, but for a self-contained client-side app, it's a way.
/*
window.APP_DATA = {
    KINK_CATEGORIES,
    KINK_DEFINITIONS,
    ACADEMY_MODULES,
    GLOSSARY_TERMS,
    JOURNAL_PROMPTS
};
*/
// If using ES6 Modules (recommended for cleaner code, even if in one app.js for now):
// You would `import { KINK_CATEGORIES, KINK_DEFINITIONS, ... } from './data.js';` in app.js
// and this file wouldn't need the window.APP_DATA part. For now, we'll assume app.js will
// just know these variables exist if this script is loaded before it.
