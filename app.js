// === app.js === (COMPLETE - With Final Fixes & Diagnostics)

// Import necessary modules
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js and Confetti loaded via CDN

// --- Top Level Data Check ---
console.log("--- bdsmData Check (Top Level) ---");
console.log(bdsmData);
if (typeof bdsmData !== 'object' || bdsmData === null || !bdsmData.submissive || !bdsmData.dominant) {
    console.error("!!! CRITICAL: bdsmData is invalid or incomplete after import! Check data.js syntax and export.");
    // Optionally throw an error here if bdsmData is absolutely essential for basic operation
    // throw new Error("Failed to load essential bdsmData.");
}
console.log("--- glossaryTerms Check (Top Level) ---");
console.log(glossaryTerms);
if (typeof glossaryTerms !== 'object' || glossaryTerms === null || Object.keys(glossaryTerms).length === 0) {
    console.warn("!!! WARNING: glossaryTerms appears empty or invalid after import! Check glossary.js syntax and export.");
}
// --- End Top Level Data Check ---


// NEW: Contextual help text definitions
const contextHelpTexts = {
  historyChartInfo: "This chart visualizes how your trait scores have changed over time with each 'Snapshot' you take. Use snapshots to track your growth!",
  goalsSectionInfo: "Set specific, measurable goals for your persona's journey. Mark them as done when achieved!",
  traitsSectionInfo: "These are the specific traits relevant to your persona's chosen Role and Style. The scores reflect your self-assessment.",
  achievementsSectionInfo: "Unlock achievements by using features and reaching milestones with your personas!",
  journalSectionInfo: "Use the journal to reflect on experiences, explore feelings, or answer prompts. Your private space for introspection."
};

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: Starting KinkCompass App...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals';
    this.elementThatOpenedModal = null; // For focus management

    // --- Style Finder State ---
    this.sfActive = false;
    this.sfStep = 0;
    this.sfRole = null;
    this.sfIdentifiedRole = null;
    this.sfAnswers = { rolePreference: null, traits: {} };
    this.sfScores = {};
    this.sfPreviousScores = {};
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = [];
    this.sfSteps = [];
    this.sfShowDashboardDuringTraits = false;


    // --- Style Finder Data Structures ---
    // MAKE SURE THESE ARE POPULATED WITH YOUR ACTUAL DATA
    this.sfStyles = {
      submissive: [ 'Classic Submissive', 'Brat', 'Slave', 'Pet', 'Little', 'Puppy', 'Kitten', 'Princess', 'Rope Bunny', 'Masochist', 'Prey', 'Toy', 'Doll', 'Bunny', 'Servant', 'Playmate', 'Babygirl', 'Captive', 'Thrall', 'Puppet', 'Maid', 'Painslut', 'Bottom' ],
      dominant: [ 'Classic Dominant', 'Assertive', 'Nurturer', 'Strict', 'Master', 'Mistress', 'Daddy', 'Mommy', 'Owner', 'Rigger', 'Sadist', 'Hunter', 'Trainer', 'Puppeteer', 'Protector', 'Disciplinarian', 'Caretaker', 'Sir', 'Goddess', 'Commander' ]
    };
    this.sfSubFinderTraits = [
      { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' }, { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' }, { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' }, { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' }, { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' }, { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' }, { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' }, { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' }, { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' }, { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' }, { name: 'painTolerance', desc: 'How do you feel about physical discomfort or pain during play?' }, { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' }, { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' }, { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' }, { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' }, { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' }, { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' }, { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' }, { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' }
    ];
    this.sfSubTraitFootnotes = { obedience: "1: Rarely follows / 10: Always obeys", rebellion: "1: Very compliant / 10: Loves to resist", service: "1: Self-focused / 10: Service-driven", playfulness: "1: Serious / 10: Super playful", sensuality: "1: Not sensory / 10: Highly sensual", exploration: "1: Stays safe / 10: Seeks adventure", devotion: "1: Independent / 10: Deeply devoted", innocence: "1: Mature / 10: Very innocent", mischief: "1: Calm / 10: Mischievous", affection: "1: Distant / 10: Super affectionate", painTolerance: "1: Avoids pain / 10: Embraces sensation", submissionDepth: "1: Light submission / 10: Total surrender", dependence: "1: Self-reliant / 10: Loves guidance", vulnerability: "1: Guarded / 10: Fully open", adaptability: "1: Fixed role / 10: Very versatile", tidiness: "1: Messy and carefree / 10: Obsessed with order", politeness: "1: Casual and blunt / 10: Always courteous", craving: "1: Avoids intensity / 10: Seeks extreme thrills", receptiveness: "1: Closed off / 10: Fully open to input" };
    this.sfDomFinderTraits = [
      { name: 'authority', desc: 'Do you feel strong when you take charge?' }, { name: 'confidence', desc: 'Are you sure of your decisions?' }, { name: 'discipline', desc: 'Do you enjoy setting firm rules?' }, { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' }, { name: 'care', desc: 'Do you love supporting and protecting others?' }, { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' }, { name: 'control', desc: 'Do you thrive on directing every detail?' }, { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' }, { name: 'precision', desc: 'Are you careful with every step you take?' }, { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' }, { name: 'sadism', desc: 'Does giving a little consensual pain excite you?' }, { name: 'leadership', desc: 'Do you naturally guide others forward?' }, { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' }, { name: 'patience', desc: 'Are you calm while teaching or training?' }, { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' }
    ];
    this.sfDomTraitFootnotes = { authority: "1: Gentle / 10: Very commanding", confidence: "1: Hesitant / 10: Rock-solid", discipline: "1: Relaxed / 10: Strict", boldness: "1: Cautious / 10: Fearless", care: "1: Detached / 10: Deeply caring", empathy: "1: Distant / 10: Highly intuitive", control: "1: Hands-off / 10: Total control", creativity: "1: Routine / 10: Very creative", precision: "1: Casual / 10: Meticulous", intensity: "1: Soft / 10: Intense", sadism: "1: Avoids giving pain / 10: Enjoys giving pain", leadership: "1: Follower / 10: Natural leader", possession: "1: Shares / 10: Very possessive", patience: "1: Impatient / 10: Very patient", dominanceDepth: "1: Light control / 10: Full dominance" };

    // !!! IMPORTANT: Verify this object has keys for ALL traits in sfSubFinderTraits and sfDomFinderTraits !!!
    // !!! AND that each key maps to an ARRAY with EXACTLY 10 string descriptions !!!
    this.sfSliderDescriptions = {
        obedience: [ "You dodge orders like a breeze!", "Rules? You’re too free for that!", "You’ll follow if it’s fun!", "A little “yes” slips out sometimes!", "You’re cool with gentle guidance!", "Following feels kinda nice!", "You like pleasing when asked!", "Obeying’s your quiet joy!", "You love a sweet “please”!", "You glow when you say “yes”!" ],
        rebellion: [ "You’re too sweet to say no!", "A tiny “nah” sneaks out!", "You nudge rules with a smile!", "Teasing’s your little game!", "Half yes, half no—cute!", "You push back with charm!", "Defiance is your sparkle!", "You love a playful “no”!", "Rebel vibes all the way!", "You’re a cheeky star!" ],
        service: [ "Helping? You’re too chill!", "A quick favor’s enough!", "You help if they’re sweet!", "You pitch in when it’s easy!", "Serving’s okay sometimes!", "You like making them smile!", "Helping’s your happy place!", "You love a kind task!", "You’re a service sweetie!", "Caring’s your superpower!" ],
        playfulness: [ "Serious is your vibe!", "A giggle slips out!", "You play if it’s light!", "Half serious, half silly!", "You’re warming up to fun!", "Playtime’s your joy!", "You bounce with glee!", "Silly’s your middle name!", "You’re a playful whirlwind!", "Games are your world!" ],
        sensuality: [ "Touch? Not your thing!", "A soft pat’s okay!", "You like a little feel!", "Textures are kinda neat!", "You’re into soft vibes!", "Silk makes you happy!", "You love a sensory tickle!", "Touch is your bliss!", "You’re all about feels!", "Sensory queen!" ],
        exploration: [ "Safe is your spot!", "A tiny step out—shy!", "You peek at new stuff!", "You’ll try if it’s safe!", "Half cozy, half curious!", "New things excite you!", "You chase the unknown!", "Adventure’s your jam!", "You’re a bold explorer!", "Nothing stops you!" ],
        devotion: [ "Free and solo!", "A bit of heart shows!", "You care if they’re near!", "Half free, half true!", "You’re warming up!", "Devotion’s your glow!", "You’re all in soft!", "Loyalty’s your core!", "You’re a devotion gem!", "Total soulmate!" ],
        innocence: [ "Wise beyond your years!", "A bit of wonder peeks out!", "You’re half grown, half kid!", "Silly feels nice sometimes!", "You’re dipping into cute!", "Innocence is your vibe!", "You’re a sweet dreamer!", "Giggles are your song!", "You’re pure sunshine!", "Total kid at heart!" ],
        mischief: [ "Too good for tricks!", "A tiny prank slips!", "You stir if it’s safe!", "Half calm, half cheeky!", "You’re a sneaky spark!", "Mischief’s your game!", "You love a little chaos!", "Trouble’s your friend!", "You’re a mischief pro!", "Chaos queen!" ],
        affection: [ "Hugs? Not really!", "A quick cuddle’s fine!", "You like a soft touch!", "Half aloof, half warm!", "You’re into snuggles!", "Cuddles are your joy!", "You love closeness!", "Affection’s your glow!", "You’re a hug star!", "Total love bug!" ],
        painTolerance: [ "Ouch! Keep it gentle!", "A tiny sting is maybe okay?", "Discomfort can be interesting...", "You handle sensation well!", "The edge is exciting!", "You thrive on intensity!", "Bring on the challenge!", "Strong sensations feel good!", "You have high endurance!", "Pain can be pleasure!" ],
        submissionDepth: [ "You’re free as a bird!", "A little give peeks out!", "You bend if it’s chill!", "Half you, half them!", "You’re easing in!", "Surrender’s kinda fun!", "You dive in soft!", "Control’s theirs—yay!", "You’re all theirs!", "Total trust star!" ],
        dependence: [ "Solo’s your jam!", "A lean slips in!", "You lean if they’re nice!", "Half free, half clingy!", "You’re okay with help!", "Relying feels good!", "You love their lead!", "They’re your rock!", "You’re a lean-in pro!", "Total trust buddy!" ],
        vulnerability: [ "Walls up high!", "A peek slips out!", "You share if safe!", "Half guarded, half open!", "You’re softening up!", "Open’s your vibe!", "You bare it soft!", "Heart’s wide open!", "You’re a trust gem!", "Total soul sharer!" ],
        adaptability: [ "One way—you’re set!", "A tiny switch is fine!", "You bend a little!", "Half fixed, half fluid!", "You’re okay with change!", "Switching’s easy!", "You roll with it!", "Flex is your strength!", "You flip like a pro!", "Total chameleon!" ],
        tidiness: [ "Chaos is your friend!", "A little mess is fine!", "You tidy if asked nicely!", "Order’s okay sometimes!", "You like things neat-ish!", "Cleanliness feels good!", "You love a tidy space!", "Order is your joy!", "Spotless is your vibe!", "Perfection in every corner!" ],
        politeness: [ "You’re blunt and bold!", "A bit gruff but sweet!", "Polite if it’s easy!", "You’re nice when needed!", "Courtesy’s your thing!", "You’re a polite gem!", "Manners shine bright!", "Respect is your core!", "You’re super courteous!", "Politeness queen!" ],
        craving: [ "Calm is your zone!", "A tiny thrill is enough!", "You dip into intensity!", "Half chill, half wild!", "You like a strong spark!", "Intensity calls you!", "You chase the edge!", "Thrills are your fuel!", "You crave the extreme!", "Limitless seeker!" ],
        receptiveness: [ "You’re your own guide!", "A bit open if safe!", "You listen if it’s clear!", "Half closed, half open!", "You’re warming up!", "Openness feels right!", "You take it all in!", "Guidance is welcome!", "You’re a receiver pro!", "Totally in tune!" ],
        // Dominant traits
        authority: [ "Soft and shy!", "A little lead peeks!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Authority’s your vibe!", "You lead with ease!", "You’re a strong guide!", "Boss mode on!", "Total commander!" ],
        confidence: [ "Quiet and unsure!", "A bit of bold shows!", "You’re sure if it’s easy!", "Half shy, half steady!", "You’re growing bold!", "Confidence shines!", "You trust your gut!", "You’re rock solid!", "Bold and bright!", "Total powerhouse!" ],
        discipline: [ "Free and wild!", "A rule slips in!", "You set soft lines!", "Half loose, half tight!", "You’re liking order!", "Discipline’s your jam!", "You keep it firm!", "Rules are your strength!", "You’re super strict!", "Total control!" ],
        boldness: [ "Careful and calm!", "A risk peeks out!", "You leap if safe!", "Half shy, half daring!", "You’re getting brave!", "Boldness is you!", "You dive right in!", "Fearless vibes!", "You’re a bold star!", "Total daredevil!" ],
        care: [ "Cool and aloof!", "A care slips out!", "You help if asked!", "Half chill, half warm!", "You’re a soft guide!", "Nurturing’s your glow!", "You protect with love!", "Care is your core!", "You’re a warm star!", "Total nurturer!" ],
        empathy: [ "Distant and chill!", "A feel peeks out!", "You get it if clear!", "Half aloof, half tuned!", "You’re sensing more!", "Empathy’s your gift!", "You feel it all!", "You’re in sync!", "You’re a heart reader!", "Total intuitive!" ],
        control: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Control’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], // Note: Reused 'Owner' phrasing from possession
        creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
        precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
        intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
        sadism: [ "Too gentle for that!", "A teasing edge emerges.", "Finding fun in their reaction.", "Enjoying controlled discomfort.", "The line starts to blur...", "Thriving on their response.", "Intensity feels powerful.", "Pushing limits is thrilling.", "Mastering sensation play.", "Their reaction is everything." ],
        leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
        possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
        patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
        dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ]
    };

    // !!! IMPORTANT: Verify this object has keys for ALL traits in sfSubFinderTraits and sfDomFinderTraits !!!
    this.sfTraitExplanations = {
        obedience: "How much you enjoy following instructions or rules. High = loves obeying; Low = prefers independence.", rebellion: "How much you like playfully resisting or teasing. High = loves defiance; Low = compliant.", service: "Joy derived from helping or performing tasks for others. High = service-driven; Low = self-focused.", playfulness: "Love for silly games, humor, and lightheartedness. High = very playful; Low = serious.", sensuality: "Appreciation for physical sensations, textures, touch. High = very sensory; Low = less focused on touch.", exploration: "Eagerness to try new experiences or push boundaries. High = adventurous; Low = prefers familiarity.", devotion: "Depth of loyalty and commitment to a partner. High = deeply devoted; Low = more independent.", innocence: "Enjoyment of feeling carefree, childlike, or pure. High = embraces innocence; Low = more mature.", mischief: "Enjoyment of stirring things up, pranks, or playful trouble. High = loves mischief; Low = calm.", affection: "Need for physical closeness, cuddles, and reassurance. High = very affectionate; Low = prefers space.", painTolerance: "How you perceive and react to physical discomfort or pain. High = finds interest/pleasure; Low = avoids pain.", submissionDepth: "Willingness to yield control to a partner. High = enjoys total surrender; Low = prefers light guidance.", dependence: "Comfort level in relying on a partner for guidance or decisions. High = enjoys dependence; Low = self-reliant.", vulnerability: "Ease and willingness to show emotional softness or weakness. High = very open; Low = guarded.", adaptability: "Ability to switch between roles or adjust to changing dynamics. High = very flexible; Low = prefers consistency.", tidiness: "Satisfaction derived from neatness and order. High = very tidy; Low = comfortable with mess.", politeness: "Natural inclination towards courteous and respectful behavior. High = very polite; Low = more direct/casual.", craving: "Desire for intense, extreme, or peak sensations/experiences. High = seeks intensity; Low = prefers calm.", receptiveness: "Openness to receiving direction, input, or sensation. High = very receptive; Low = more closed off.", authority: "Natural inclination and comfort in taking charge or leading. High = commanding; Low = prefers following.", confidence: "Self-assuredness in decisions and actions within a dynamic. High = very confident; Low = hesitant.", discipline: "Enjoyment in setting and enforcing rules or structure. High = strict; Low = relaxed.", boldness: "Willingness to take risks or face challenges head-on. High = fearless; Low = cautious.", care: "Focus on supporting, protecting, and nurturing a partner. High = deeply caring; Low = more detached.", empathy: "Ability to understand and connect with a partner's feelings. High = very empathetic; Low = more analytical.", control: "Desire to manage details, actions, or the environment. High = loves control; Low = prefers flow.", creativity: "Enjoyment in crafting unique scenarios, tasks, or experiences. High = very inventive; Low = prefers routine.", precision: "Focus on executing actions or commands meticulously. High = very precise; Low = more casual.", intensity: "The level of emotional or physical energy brought to the dynamic. High = very intense; Low = gentle.", sadism: "Deriving pleasure from consensually inflicting pain or discomfort. High = enjoys inflicting; Low = avoids inflicting.", leadership: "Natural ability to guide, direct, and inspire others. High = strong leader; Low = follower.", possession: "Feeling of ownership or strong connection ('mine') towards a partner. High = very possessive; Low = less possessive.", patience: "Ability to remain calm while guiding, teaching, or waiting. High = very patient; Low = impatient.", dominanceDepth: "Desire for the level of influence or control over a partner. High = seeks total influence; Low = prefers light control."
    };

    // !!! IMPORTANT: Verify this object has keys for ALL styles used in sfStyles !!!
    // !!! AND that the traits listed match those in sfSub/DomFinderTraits !!!
    this.sfStyleKeyTraits = {
        // Submissive Styles
        'Classic Submissive': ['obedience', 'service', 'receptiveness', 'trust'], // Simplified, added 'trust'
        'Brat': ['rebellion', 'mischief', 'playfulness', 'painTolerance'],
        'Slave': ['devotion', 'obedience', 'service', 'submissionDepth'], // Removed surrender for simplicity if not a direct question
        'Pet': ['affection', 'playfulness', 'dependence', 'obedience'], // Simplified
        'Little': ['innocence', 'dependence', 'affection', 'playfulness'], // Simplified
        'Puppy': ['playfulness', 'obedience', 'affection'], // Simplified Pet
        'Kitten': ['sensuality', 'mischief', 'affection', 'playfulness'], // Simplified Pet
        'Princess': ['dependence', 'innocence', 'affection', 'sensuality'], // Added sensuality
        'Rope Bunny': ['receptiveness', 'sensuality', 'exploration', 'painTolerance'], // Removed patience
        'Masochist': ['painTolerance', 'craving', 'receptiveness', 'submissionDepth'], // Removed vulnerability
        'Prey': ['exploration', 'vulnerability', 'rebellion'], // Simplified
        'Toy': ['receptiveness', 'adaptability', 'service'], // Simplified
        'Doll': ['sensuality', 'innocence', 'adaptability'], // Simplified
        'Bunny': ['innocence', 'affection', 'vulnerability'], // Simplified
        'Servant': ['service', 'obedience', 'tidiness', 'politeness'], // Simplified
        'Playmate': ['playfulness', 'exploration', 'adaptability'], // Simplified
        'Babygirl': ['innocence', 'dependence', 'affection', 'vulnerability'], // Simplified
        'Captive': ['submissionDepth', 'vulnerability', 'exploration'], // Simplified
        'Thrall': ['devotion', 'submissionDepth', 'receptiveness'], // Simplified
        'Puppet': ['obedience', 'receptiveness', 'adaptability'], // Simplified
        'Maid': ['service', 'tidiness', 'politeness', 'obedience'], // Simplified
        'Painslut': ['painTolerance', 'craving', 'receptiveness'], // Simplified
        'Bottom': ['receptiveness', 'submissionDepth', 'painTolerance'], // Simplified

        // Dominant Styles
        'Classic Dominant': ['authority', 'leadership', 'control', 'confidence', 'care'],
        'Assertive': ['authority', 'confidence', 'leadership', 'boldness'], // Simplified
        'Nurturer': ['care', 'empathy', 'patience'], // Simplified
        'Strict': ['authority', 'discipline', 'control', 'precision'],
        'Master': ['authority', 'dominanceDepth', 'control', 'possession'], // Simplified
        'Mistress': ['authority', 'creativity', 'control', 'confidence'], // Simplified
        'Daddy': ['care', 'authority', 'patience', 'possession'], // Simplified
        'Mommy': ['care', 'empathy', 'patience'], // Simplified
        'Owner': ['authority', 'possession', 'control', 'dominanceDepth'],
        'Rigger': ['creativity', 'precision', 'control', 'patience', 'care'],
        'Sadist': ['control', 'intensity', 'sadism', 'precision'], // Simplified
        'Hunter': ['boldness', 'intensity', 'control', 'leadership'], // Simplified
        'Trainer': ['discipline', 'patience', 'leadership'], // Simplified
        'Puppeteer': ['control', 'creativity', 'precision'], // Simplified
        'Protector': ['care', 'authority', 'boldness'], // Simplified
        'Disciplinarian': ['authority', 'discipline', 'control'], // Simplified
        'Caretaker': ['care', 'patience', 'empathy'], // Simplified
        'Sir': ['authority', 'leadership', 'politeness', 'discipline'], // Simplified
        'Goddess': ['authority', 'confidence', 'intensity', 'dominanceDepth'], // Simplified
        'Commander': ['authority', 'leadership', 'control', 'discipline', 'boldness'] // Simplified
         // Switch styles are identified, not scored by traits in this simple version
    };

    // !!! IMPORTANT: Verify this object has keys for ALL styles used in sfStyles !!!
    this.sfStyleDescriptions = { // (Keep the full list, add Switch styles)
      'Classic Submissive': { short: "Thrives on guidance and trust.", long: "Finds joy in yielding to a partner's direction, embracing vulnerability and structure.", tips: ["Communicate limits clearly.", "Find a respectful partner.", "Explore submission levels."] },
      'Brat': { short: "Cheeky, loves pushing buttons.", long: "Delights in playful resistance, turning rules into games. Enjoys the thrill of being 'tamed'.", tips: ["Keep it fun.", "Pair with someone who enjoys the chase.", "Know boundaries for defiance."] },
      'Slave': { short: "Finds fulfillment in total devotion/service.", long: "Deeply committed to serving, often embracing high control and structure within immense trust.", tips: ["Negotiate limits thoroughly.", "Ensure partner values your devotion.", "Prioritize self-care."] },
      'Pet': { short: "Loves being cared for like a cherished companion.", long: "Revels in affection and play, adopting animal-like traits in a dynamic of trust and care.", tips: ["Choose a playful persona.", "Seek a caring Owner.", "Enjoy the role's freedom."] },
      'Little': { short: "Embraces a carefree, childlike spirit.", long: "Finds joy in innocence and dependence, seeking nurturing and protection in a playful dynamic.", tips: ["Set clear boundaries.", "Find a caring partner (Daddy/Mommy).", "Explore your playful side."] },
      'Puppy': { short: "Playful and loyal like a devoted pup.", long: "Brings boundless energy and affection, thriving on play and devotion.", tips: ["Embrace enthusiasm.", "Seek a Trainer/Owner.", "Keep it fun."] },
      'Kitten': { short: "Sensual and mischievous like a curious cat.", long: "Blends sensuality with mischief, enjoying affection and play in a tender, teasing dynamic.", tips: ["Play with your charm.", "Find a patient partner.", "Explore sensory delights."] },
      'Princess': { short: "Adores being pampered and adored.", long: "Revels in attention and care, embracing a regal yet dependent role.", tips: ["Set expectations.", "Seek a doting partner.", "Enjoy your spotlight."] },
      'Rope Bunny': { short: "Loves the art and feel of being bound.", long: "Finds excitement in bondage sensations and trust, enjoying the creativity and surrender.", tips: ["Learn safety basics.", "Pair with a skilled Rigger.", "Explore different ties."] },
      'Masochist': { short: "Finds pleasure/release through sensation/pain.", long: "Embraces discomfort as a source of joy or focus, often within submission.", tips: ["Set safewords.", "Find a caring Sadist.", "Know limits."] },
      'Prey': { short: "Enjoys the thrill of being hunted.", long: "Thrives on the chase, finding excitement in vulnerability and the tension of pursuit/capture.", tips: ["Establish consent clearly.", "Pair with a Hunter.", "Enjoy the adrenaline."] },
      'Toy': { short: "Loves being used and played with.", long: "Delights in being an object of pleasure, offering adaptability and responsiveness.", tips: ["Communicate preferences.", "Find a creative partner.", "Embrace your role."] },
      'Doll': { short: "Enjoys being perfectly posed and admired.", long: "Finds fulfillment in being molded and displayed, blending passivity with aesthetic focus.", tips: ["Set clear boundaries.", "Seek a Puppeteer.", "Enjoy your transformation."] },
      'Bunny': { short: "Gentle, shy, and easily startled.", long: "Brings innocence and soft energy, thriving on gentle affection and quiet connection.", tips: ["Keep it gentle.", "Find a patient partner.", "Communicate needs softly."] },
      'Servant': { short: "Finds joy in serving and pleasing dutifully.", long: "Dedicated to partner’s needs, finding satisfaction in obedience and structured tasks.", tips: ["Define duties.", "Seek a Master/Mistress.", "Balance service/self-care."] },
      'Playmate': { short: "Loves shared fun and mischief.", long: "Brings camaraderie and adventure, enjoying dynamics filled with games and exploration.", tips: ["Keep it light.", "Find a playful partner.", "Explore together."] },
      'Babygirl': { short: "Craves nurturing, affection, guidance.", long: "Blends innocence with dependence, seeking a caring dynamic filled with love and protection.", tips: ["Set emotional boundaries.", "Find a Daddy/Mommy.", "Embrace your softness."] },
      'Captive': { short: "Relishes the thrill of capture/restraint.", long: "Enjoys the intensity of surrender and restraint, finding excitement in control and trust scenarios.", tips: ["Negotiate scenes.", "Pair with a Hunter/Commander.", "Enjoy the intensity."] },
      'Thrall': { short: "Bound by deep devotion/mental connection.", long: "Offers profound loyalty and submission, thriving in dynamics of deep trust and mental surrender.", tips: ["Build trust slowly.", "Seek a Master/Goddess.", "Honor commitment."] },
      'Puppet': { short: "Loves being precisely directed.", long: "Thrives on responsiveness, moving to partner’s cues with ease and adaptability.", tips: ["Stay attuned.", "Find a Puppeteer.", "Practice responses."] },
      'Maid': { short: "Delights in order and polite service.", long: "Finds joy in order and courtesy, creating a pristine environment with respectful demeanor.", tips: ["Focus on details.", "Seek a Master/Mistress.", "Balance duty/grace."] },
      'Painslut': { short: "Craves intense sensation, pushes limits.", long: "Seeks strong sensations, finding exhilaration in discomfort and intensity. Bold and boundary-testing.", tips: ["Set thresholds.", "Pair with a Sadist.", "Embrace aftercare."] },
      'Bottom': { short: "Open to receiving sensation/direction.", long: "Excels at taking input, often with resilience for longer or intense scenes.", tips: ["Communicate capacity.", "Find attentive Top.", "Pace yourself."] },
      'Classic Dominant': { short: "Leads with confidence and care.", long: "Revels in control and responsibility, guiding partner's surrender with trust.", tips: ["Listen actively.", "Balance firmness/kindness.", "Learn safety."] },
      'Assertive': { short: "Leads with clear communication and boundaries.", long: "Takes charge with directness, setting clear expectations and maintaining firm control.", tips: ["Stay clear/direct.", "Pair with receptive Submissive.", "Temper boldness/care."] },
      'Nurturer': { short: "Guides with warmth and patient support.", long: "Blends control with empathy, creating a dynamic where guidance feels supportive and safe.", tips: ["Be patient/attentive.", "Pair with Little/Pet.", "Foster trust."] },
      'Strict': { short: "Maintains order through clear rules and discipline.", long: "Finds satisfaction in structure and obedience, enforcing rules firmly but fairly.", tips: ["Set clear expectations.", "Pair with Slave/Servant.", "Reward compliance."] },
      'Master': { short: "Commands with high expectations and strong presence.", long: "Takes a profound role, guiding with control, care, and commitment in a structured dynamic.", tips: ["Build trust.", "Understand partner's needs.", "Negotiate terms."] },
      'Mistress': { short: "Leads with elegance, high standards, and power.", long: "Commands with confidence and creativity, blending sensuality with control.", tips: ["Embrace your power.", "Pair with Slave/Toy.", "Explore creative control."] },
      'Daddy': { short: "Combines protective guidance with affectionate authority.", long: "Blends care with authority, offering guidance and structure in a loving yet firm dynamic.", tips: ["Be consistent.", "Pair with Little/Babygirl.", "Balance discipline/affection."] },
      'Mommy': { short: "Provides nurturing comfort and gentle guidance.", long: "Offers a blend of care and control, creating a safe space for partner to explore and grow.", tips: ["Be patient/loving.", "Pair with Little/Pet.", "Encourage growth."] },
      'Owner': { short: "Takes pride in possession, training, and care.", long: "Finds fulfillment in control and responsibility, often in pet play or TPE dynamics.", tips: ["Set clear rules.", "Pair with Pet/Slave.", "Provide structure/care."] },
      'Rigger': { short: "Artist of restraint and sensation.", long: "Excels in the art of bondage, creating intricate ties that blend creativity with control.", tips: ["Learn safety techniques.", "Pair with Rope Bunny.", "Explore styles."] },
      'Sadist': { short: "Finds joy in giving sensation/pain with care.", long: "Enjoys inflicting discomfort within consent and trust, focusing on intensity and connection.", tips: ["Negotiate limits.", "Pair with Masochist.", "Prioritize aftercare."] },
      'Hunter': { short: "Thrives on the chase and capture.", long: "Enjoys the dynamic tension of pursuit, finding excitement in the hunt and surrender.", tips: ["Establish consent.", "Pair with Prey.", "Enjoy the game."] },
      'Trainer': { short: "Guides skill development with patience and structure.", long: "Focuses on teaching and molding, often in dynamics involving behavior modification.", tips: ["Be clear/consistent.", "Pair with Pet/Puppy/Slave.", "Celebrate progress."] },
      'Puppeteer': { short: "Controls with creative precision and direction.", long: "Enjoys directing every move, often where partner becomes an extension of their will.", tips: ["Communicate clearly.", "Pair with Doll/Toy/Puppet.", "Explore your vision."] },
      'Protector': { short: "Leads with vigilance and ensuring safety.", long: "Blends authority with deep responsibility, ensuring partner feels safe and valued.", tips: ["Be vigilant/kind.", "Pair with vulnerable styles.", "Foster trust."] },
      'Disciplinarian': { short: "Enforces rules with firm fairness.", long: "Excels at setting boundaries and maintaining order, guiding through consequences.", tips: ["Be clear about rules.", "Stay patient/fair.", "Reward compliance."] },
      'Caretaker': { short: "Nurtures and supports partner's well-being holistically.", long: "Provides a safe, loving space, focusing on emotional and physical needs.", tips: ["Be attentive/gentle.", "Pair with Little/Pet/Sick.", "Encourage exploration."] },
      'Sir': { short: "Leads with honor, respect, and formal authority.", long: "Commands with dignity and integrity, often in dynamics valuing tradition and service.", tips: ["Uphold values.", "Pair with Submissive/Servant.", "Lead by example."] },
      'Goddess': { short: "Inspires worship and adoration through presence.", long: "Embodies power and grace, often in dynamics where partner offers devotion.", tips: ["Embrace divinity.", "Pair with Thrall/Servant.", "Set high standards."] },
      'Commander': { short: "Leads with strategic control and decisiveness.", long: "Takes charge with precision and vision, often in complex scenes or power exchange.", tips: ["Plan scenarios.", "Pair with Switch/Submissive.", "Execute confidently."] },
       // Switch Styles
      'Fluid Switch': { short: "Flows easily between roles.", long: "Adapts intuitively to the dynamic's energy, enjoying both leading and following.", tips: ["Communicate shifts clearly.", "Embrace spontaneity.", "Find adaptable partners."] },
      'Dominant-Leaning Switch': { short: "Prefers leading, enjoys submitting.", long: "Comfortable taking charge, but finds pleasure and variety in yielding control occasionally.", tips: ["Negotiate when you want to Dom/sub.", "Explore your sub side safely.", "Communicate your primary preference."] },
      'Submissive-Leaning Switch': { short: "Prefers following, enjoys leading.", long: "Finds comfort in submission, but feels empowered and enjoys taking the lead sometimes.", tips: ["Discuss triggers for switching to Dom.", "Explore your Dom side confidently.", "Communicate your primary preference."] },
      'Situational Switch': { short: "Role depends on context/partner.", long: "Adapts role based on specific situations, partner dynamics, or current mood.", tips: ["Be clear about what influences your role choice.", "Negotiate roles per scene.", "Check in frequently."] }
    };

    // !!! IMPORTANT: Verify this object has keys for ALL styles used in sfStyles !!!
    this.sfDynamicMatches = { // (Keep the full list, add Switch matches)
      'Classic Submissive': { dynamic: "Power Exchange", match: "Classic Dominant", desc: "Classic trust/guidance.", longDesc: "Mutual respect, clear roles." },
      'Brat': { dynamic: "Taming Play", match: "Disciplinarian/Strict", desc: "Cheeky push-pull.", longDesc: "Resistance meets firm control." },
      'Slave': { dynamic: "Master/Slave (TPE)", match: "Master/Mistress", desc: "Deep devotion bond.", longDesc: "High power exchange, often 24/7 elements." },
      'Pet': { dynamic: "Pet Play", match: "Owner/Trainer", desc: "Playful care/guidance.", longDesc: "Affection, training, and roleplay." },
      'Little': { dynamic: "Age Play/DDlg/MDlb", match: "Daddy/Mommy/Caretaker", desc: "Nurturing & structure.", longDesc: "Care, rules, and comfort create safety." },
      'Puppy': { dynamic: "Pup Play", match: "Handler/Trainer/Owner", desc: "Energetic training/play.", longDesc: "Enthusiasm meets guidance." },
      'Kitten': { dynamic: "Kitten Play", match: "Owner/Nurturer", desc: "Sensual & playful care.", longDesc: "Mischief meets affection/control." },
      'Princess': { dynamic: "Pampering/Royalty Play", match: "Daddy/Sir/Goddess", desc: "Adoration & spoiling.", longDesc: "Being cherished and catered to." },
      'Rope Bunny': { dynamic: "Bondage/Shibari", match: "Rigger", desc: "Aesthetic & sensation.", longDesc: "Trust in the Rigger's art." },
      'Masochist': { dynamic: "Sadomasochism (S/M)", match: "Sadist", desc: "Intense sensation exchange.", longDesc: "Finding pleasure/release through pain." },
      'Prey': { dynamic: "Primal Play/Hunt Scene", match: "Hunter", desc: "Thrilling chase dynamic.", longDesc: "Adrenaline of pursuit and capture." },
      'Toy': { dynamic: "Objectification Play", match: "Owner/Creative Dominant", desc: "Responsive object play.", longDesc: "Delighting in being used/controlled." },
      'Doll': { dynamic: "Dollification/Statue Play", match: "Puppeteer/Master", desc: "Aesthetic transformation.", longDesc: "Becoming a perfect, admired object." },
      'Bunny': { dynamic: "Gentle Pet Play", match: "Caretaker/Nurturer", desc: "Soft, shy affection.", longDesc: "Requires patience and gentle touch." },
      'Servant': { dynamic: "Service Dynamic", match: "Master/Mistress/Sir", desc: "Dutiful task focus.", longDesc: "Finding purpose in meticulous service." },
      'Playmate': { dynamic: "Playful Dynamics", match: "Playmate/Fun Dominant", desc: "Shared fun/adventure.", longDesc: "Focus on games and mutual enjoyment." },
      'Babygirl': { dynamic: "DDlg/Age Play variation", match: "Daddy/Caretaker", desc: "Charming vulnerability.", longDesc: "Seeking nurturing and guidance." },
      'Captive': { dynamic: "Capture/Interrogation Scene", match: "Hunter/Commander/Strict", desc: "Intense scenario play.", longDesc: "Thrill of restraint and yielding." },
      'Thrall': { dynamic: "Mental Domination/Worship", match: "Goddess/Master", desc: "Deep psychic bond.", longDesc: "Focus on mental connection/influence." },
      'Puppet': { dynamic: "Puppet Play/Direct Control", match: "Puppeteer", desc: "Responsive movement.", longDesc: "Yielding physical autonomy." },
      'Maid': { dynamic: "Formal Service", match: "Sir/Mistress", desc: "Orderly & polite duty.", longDesc: "Presentation and etiquette are key." },
      'Painslut': { dynamic: "Heavy S/M", match: "Sadist", desc: "Intense sensation seeking.", longDesc: "Pushing limits of endurance/desire." },
      'Bottom': { dynamic: "Sensation/Power Play", match: "Classic Dominant/Sadist/Rigger", desc: "Receptive endurance.", longDesc: "Openness meets various topping styles." },
      'Classic Dominant': { dynamic: "Power Exchange", match: "Classic Submissive/Bottom", desc: "Balanced guidance.", longDesc: "Authority meets trust/receptivity." },
      'Assertive': { dynamic: "Direct Control", match: "Obedient Submissive/Bottom", desc: "Clear command/response.", longDesc: "Communication is key." },
      'Nurturer': { dynamic: "Nurturing Dynamics/Age Play", match: "Little/Pet/Vulnerable Sub", desc: "Supportive guidance.", longDesc: "Focus on care and emotional safety." },
      'Strict': { dynamic: "Rule-Based Dynamics", match: "Obedient Submissive/Servant", desc: "Structured order.", longDesc: "Clarity and consistency required." },
      'Master': { dynamic: "Master/Slave (TPE)", match: "Slave", desc: "Deep authority/devotion.", longDesc: "High power exchange, often 24/7 elements." },
      'Mistress': { dynamic: "Mistress/Slave or Servant", match: "Slave/Servant/Toy", desc: "Elegant command.", longDesc: "Authority blended with style/creativity." },
      'Daddy': { dynamic: "DDlg/Age Play", match: "Little/Babygirl", desc: "Affectionate authority.", longDesc: "Protection, guidance, and care." },
      'Mommy': { dynamic: "MDlb/Age Play", match: "Little/Pet", desc: "Nurturing comfort/rules.", longDesc: "Warmth, safety, and gentle structure." },
      'Owner': { dynamic: "Owner/Pet", match: "Pet/Puppy/Kitten", desc: "Possessive training/care.", longDesc: "Shaping behavior through guidance." },
      'Rigger': { dynamic: "Bondage/Shibari", match: "Rope Bunny", desc: "Artistic restraint.", longDesc: "Focus on aesthetics and sensation." },
      'Sadist': { dynamic: "Sadomasochism (S/M)", match: "Masochist/Painslut", desc: "Controlled sensation.", longDesc: "Exploring limits with care." },
      'Hunter': { dynamic: "Primal Play/Hunt Scene", match: "Prey/Captive", desc: "Thrilling pursuit.", longDesc: "Instinct and adrenaline drive the scene." },
      'Trainer': { dynamic: "Training Dynamic", match: "Puppy/Slave/Obedient Sub", desc: "Skill development.", longDesc: "Patience and structure are key." },
      'Puppeteer': { dynamic: "Puppet Play/Dollification", match: "Puppet/Doll/Toy", desc: "Precise creative control.", longDesc: "Directing actions and presentation." },
      'Protector': { dynamic: "Protective Dynamics", match: "Little/Bunny/Vulnerable Sub", desc: "Vigilant safeguarding.", longDesc: "Creating a secure environment." },
      'Disciplinarian': { dynamic: "Discipline Focused", match: "Brat/Rule-breaker Sub", desc: "Fair rule enforcement.", longDesc: "Maintaining order through consequences." },
      'Caretaker': { dynamic: "Caretaking/Nurturing", match: "Little/Pet/Needs Support", desc: "Holistic well-being.", longDesc: "Providing comfort and support." },
      'Sir': { dynamic: "Formal Power Exchange", match: "Servant/Formal Submissive", desc: "Respected authority.", longDesc: "Emphasis on etiquette and duty." },
      'Goddess': { dynamic: "Worship Dynamic", match: "Thrall/Devotee", desc: "Inspired adoration.", longDesc: "Commanding presence seeking worship." },
      'Commander': { dynamic: "Command Play/Scenario Play", match: "Obedient Submissive/Servant/Switch", desc: "Strategic leadership.", longDesc: "Decisiveness meets execution." },
       // Switch Styles Matches
      'Fluid Switch': { dynamic: "Versatile Play", match: "Fluid Switch/Adaptable Partner", desc: "A dynamic dance.", longDesc: "Requires strong communication and reading energy." },
      'Dominant-Leaning Switch': { dynamic: "Flexible Power Exchange", match: "Submissive-Leaning Switch/Adaptable Sub", desc: "Lead with options.", longDesc: "Enjoys leading mostly, needs partner okay with shifts." },
      'Submissive-Leaning Switch': { dynamic: "Flexible Power Exchange", match: "Dominant-Leaning Switch/Adaptable Dom", desc: "Follow with options.", longDesc: "Enjoys submitting mostly, needs partner okay with shifts." },
      'Situational Switch': { dynamic: "Contextual Dynamics", match: "Situational Switch/Communicative Partner", desc: "Adapting together.", longDesc: "Roles negotiated based on context." }
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
      styleExploreLink: document.getElementById('style-explore-link'),
      formStyleFinderLink: document.getElementById('form-style-finder-link'),
      traitsContainer: document.getElementById('traits-container'),
      traitsMessage: document.getElementById('traits-message'),
      traitInfoPopup: document.getElementById('trait-info-popup'),
      traitInfoClose: document.getElementById('trait-info-close'),
      traitInfoTitle: document.getElementById('trait-info-title'),
      traitInfoBody: document.getElementById('trait-info-body'),
      contextHelpPopup: document.getElementById('context-help-popup'),
      contextHelpClose: document.getElementById('context-help-close'),
      contextHelpTitle: document.getElementById('context-help-title'),
      contextHelpBody: document.getElementById('context-help-body'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),
      peopleList: document.getElementById('people-list'),
      livePreview: document.getElementById('live-preview'),
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalTabs: document.getElementById('modal-tabs'),
      modalClose: document.getElementById('modal-close'),
      resourcesBtn: document.getElementById('resources-btn'),
      resourcesModal: document.getElementById('resources-modal'),
      resourcesClose: document.getElementById('resources-close'),
      resourcesBody: document.getElementById('resources-body'),
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
      achievementsBtn: document.getElementById('achievements-btn'),
      achievementsModal: document.getElementById('achievements-modal'),
      achievementsClose: document.getElementById('achievements-close'),
      achievementsBody: document.getElementById('achievements-body'),
      welcomeModal: document.getElementById('welcome-modal'),
      welcomeClose: document.getElementById('welcome-close'),
      exportBtn: document.getElementById('export-btn'),
      importBtn: document.getElementById('import-btn'),
      importFileInput: document.getElementById('import-file-input'),
      themeToggle: document.getElementById('theme-toggle'),
      styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'),
      sfModal: document.getElementById('style-finder-modal'),
      sfCloseBtn: document.getElementById('sf-close-style-finder'),
      sfProgressTracker: document.getElementById('sf-progress-tracker'),
      sfStepContent: document.getElementById('sf-step-content'),
      sfFeedback: document.getElementById('sf-feedback'),
      sfDashboard: document.getElementById('sf-dashboard'),
      detailModalTitle: document.getElementById('detail-modal-title'),
      resourcesModalTitle: document.getElementById('resources-modal-title'),
      glossaryModalTitle: document.getElementById('glossary-modal-title'),
      styleDiscoveryTitle: document.getElementById('style-discovery-title'),
      themesModalTitle: document.getElementById('themes-modal-title'),
      achievementsModalTitle: document.getElementById('achievements-modal-title'),
      welcomeModalTitle: document.getElementById('welcome-modal-title'),
      sfModalTitle: document.getElementById('sf-modal-title'),
      formTitle: document.getElementById('form-title'),
    };

    // --- DIAGNOSTIC LOGS ---
    console.log("--- Element Check ---");
    console.log("role:", !!this.elements.role, this.elements.role);
    console.log("style:", !!this.elements.style, this.elements.style);
    // ... (keep other checks) ...
    console.log("--- End Element Check ---");

    // Critical element check
    // ... (keep check) ...

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role?.value);
    this.renderTraits(this.elements.role?.value, this.elements.style?.value);
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage(){try{const data=localStorage.getItem('kinkProfiles');const profiles=data?JSON.parse(data):[];this.people=profiles.map(p=>({...p,id:p.id??Date.now(),name:p.name??"Unnamed",role:p.role??"submissive",style:p.style??"",avatar:p.avatar||'❓',goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'&&p.reflections!==null?p.reflections:{text:p.reflections||''},traits:typeof p.traits==='object'&&p.traits!==null?p.traits:{}}));console.log(`Loaded ${this.people.length} profiles.`);}catch(e){console.error("Failed to load profiles:",e);this.people=[];this.showNotification("Error loading profiles. Starting fresh.", "error");}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length} profiles.`);}catch(e){console.error("Failed to save profiles:",e);this.showNotification("Error saving data. Storage might be full or corrupted.", "error");}}


  // NEW: Onboarding check
  checkAndShowWelcome() { /* ... keep ... */ }
  showWelcomeMessage() { /* ... keep ... */ }

  // --- Event Listeners Setup ---
  addEventListeners() { /* ... keep ... */ }

  // --- Event Handlers ---
  handleListClick(e){ /* ... keep ... */ }
  handleListKeydown(e){ /* ... keep ... */ }
  handleWindowClick(e){ /* ... keep ... */ }
  handleWindowKeydown(e){ /* ... keep ... */ }
  handleTraitSliderInput(e){ /* ... keep ... */ }
  handleTraitInfoClick(e){ /* ... keep ... */ }
  handleModalBodyClick(e){ /* ... keep ... */ }
  handleThemeSelection(e){ /* ... keep ... */ }
  handleStyleFinderAction(action, dataset = {}) { /* ... keep ... */ }
  handleStyleFinderSliderInput(sliderElement){ /* ... keep ... */ }
  handleDetailTabClick(e) { /* ... keep ... */ }
  handleGlossaryLinkClick(e) { /* ... keep ... */ }
  handleExploreStyleLinkClick(e) { /* ... keep ... */ }


  // --- Core Rendering ---
  // MODIFIED: renderStyles with Logs
  renderStyles(roleKey) {
      console.log(`--- Entering renderStyles --- Role: ${roleKey}`); // <<-- ADD Log
      const selectElement = this.elements.style;
      if (!selectElement) {
          console.error("!!! renderStyles Error: Style select element not found!"); // <<-- ADD Log
          return;
      }
      selectElement.innerHTML = '<option value="">-- Select a Style --</option>'; // Clear existing options

      console.log("Checking bdsmData within renderStyles:", bdsmData); // <<-- ADD Log (Crucial)

      // Use safety checks when accessing potentially undefined data
      const roleData = bdsmData ? bdsmData[roleKey] : null; // <<-- ADD Safety Check
      console.log(`Found roleData for '${roleKey}':`, roleData); // <<-- ADD Log

      let styles = [];
      // Use optional chaining and check array existence
      if (roleData && Array.isArray(roleData.styles)) {
          styles = roleData.styles;
          console.log(`Found ${styles.length} styles for '${roleKey}'.`); // <<-- ADD Log
      } else {
          console.warn(`No valid 'styles' array found for role: '${roleKey}' in bdsmData.`); // <<-- ADD Log
          if (!bdsmData) console.error("bdsmData object itself might be missing or invalid here!"); // <<-- ADD Log
          if (bdsmData && !roleData) console.warn(`Role key '${roleKey}' not found as a top-level key in bdsmData.`); // <<-- ADD Log
          if (roleData && !Array.isArray(roleData.styles)) console.warn(`bdsmData['${roleKey}'].styles exists but is not an array.`); // <<-- ADD Log
      }

      if (styles.length > 0) {
          try { // Add try-catch around the loop
              styles.sort((a, b) => a.name.localeCompare(b.name))
                // Inside renderStyles loop:
.forEach((style, index) => {
    // Ensure style.name exists before using it
    if (style && style.name) {
       const nameToEscape = style.name; // Store it
       const escapedName = this.escapeHTML(nameToEscape); // Call escapeHTML

       // Log values *before* adding to innerHTML
       console.log(`Loop Index ${index}: Raw Name='${nameToEscape}', Escaped Name='${escapedName}'`); // <<-- ADD LOG

       selectElement.innerHTML += `<option value="${escapedName}">${escapedName}</option>`;
    } else {
       console.warn(`Style object at index ${index} is invalid or missing name:`, style);
    }
});
              selectElement.disabled = false;
              console.log("Finished adding style options."); // <<-- ADD Log
          } catch (loopError) {
              console.error("!!! renderStyles Error: Failed during style option loop!", loopError); // <<-- ADD Log
              selectElement.innerHTML = '<option value="">Error Loading Styles</option>';
              selectElement.disabled = true;
          }
      } else {
          selectElement.innerHTML = `<option value="">-- No Styles for ${roleKey} --</option>`;
          selectElement.disabled = true;
          console.log("No styles found, setting disabled state."); // <<-- ADD Log
      }
      this.updateStyleExploreLink(); // Keep this
      console.log("--- Exiting renderStyles ---"); // <<-- ADD Log
  }

  renderTraits(roleKey, styleName) { /* ... keep ... */ }
  createTraitHTML(trait){ /* ... keep ... */ }
  updateTraitDescription(slider){ /* ... keep ... */ }
  renderList(){ /* ... keep ... */ }
  createPersonListItemHTML(person){ /* ... keep ... */ }
  updateStyleExploreLink() { /* ... keep ... */ }


  // --- CRUD ---
  savePerson() { /* ... keep ... */ }
  editPerson(personId){ /* ... keep ... */ }
  deletePerson(personId){ /* ... keep ... */ }
  resetForm(isManualClear=false){ /* ... keep ... */ }

  // --- Live Preview ---
  updateLivePreview(){ /* ... keep ... */ }

  // --- Modal Display ---
  showPersonDetails(personId) { /* ... keep ... */ }
  renderDetailTabContent(person, tabId, contentElement) { /* ... keep ... */ }

  // --- New Feature Logic ---
  addGoal(personId){ /* ... keep ... */ }
  toggleGoalStatus(personId,goalId){ /* ... keep ... */ }
  deleteGoal(personId,goalId){ /* ... keep ... */ }
  renderGoalList(person){ /* ... keep ... */ }
  showJournalPrompt(personId){ /* ... keep ... */ }
  saveReflections(personId){ /* ... keep ... */ }
  addSnapshotToHistory(personId){ /* ... keep ... */ }
  renderHistoryChart(person, canvasId) { /* ... keep ... */ }
  toggleSnapshotInfo(button){ /* ... keep ... */ }
  renderAchievementsList(person, listElementId){ /* ... keep ... */ }
  showAchievements() { /* ... keep ... */ }
  showKinkReading(personId){ /* ... keep ... */ }
  getReadingDescriptor(traitName,score){ /* ... keep ... */ }
  getStyleEssence(styleName){ /* ... keep ... */ }

  // MODIFIED: showGlossary with logic restored + logging
  showGlossary(termKeyToHighlight = null) {
      // Add logs INSIDE this function
      console.log("--- Entering showGlossary ---", termKeyToHighlight); // Log Entry

      console.log("Imported glossaryTerms:", glossaryTerms); // Log Imported Data
      // Check if it's an object and has keys
      if (typeof glossaryTerms !== 'object' || glossaryTerms === null || Object.keys(glossaryTerms).length === 0) {
           console.error("!!! glossaryTerms is empty or invalid!", glossaryTerms);
           if (this.elements.glossaryBody) {
              this.elements.glossaryBody.innerHTML = "<p class='error-text'>Glossary data is currently unavailable.</p>";
           }
           if (this.elements.glossaryModal) this.openModal(this.elements.glossaryModal);
           return; // Exit if data is bad
      }

      // --- >>> LOGIC IS NOW UNCOMMENTED <<< ---

      if (!this.elements.glossaryBody || !this.elements.glossaryModal) {
          console.error("!!! showGlossary Error: Missing glossaryBody or glossaryModal element!");
          return; // Stop if elements are missing
      }
      console.log("Glossary elements found:", this.elements.glossaryBody, this.elements.glossaryModal);

      grantAchievement({}, 'glossary_user');

      let html = '<dl>';
      try { // Add try..catch around HTML generation
          Object.entries(glossaryTerms).sort((a, b) => a[1].term.localeCompare(b[1].term))
              .forEach(([key, termData]) => {
                   // Log inside the loop for the first item only?
                   if (html === '<dl>') { // Log only once
                       console.log("Looping through glossary term:", key, termData);
                   }
                   // --- HTML Generation Logic ---
                   const termId = `gloss-term-${key}`;
                   const isHighlighted = key === termKeyToHighlight;
                   html += `<dt id="${termId}" class="${isHighlighted ? 'highlighted-term' : ''}">${this.escapeHTML(termData.term)}</dt>`;
                   html += `<dd>${this.escapeHTML(termData.definition)}`;
                   if (termData.related?.length) {
                       html += `<br><span class="related-terms">See also: `;
                       html += termData.related.map(relKey => {
                           const relatedTerm = glossaryTerms[relKey]?.term || relKey;
                           return `<a href="#gloss-term-${relKey}" class="glossary-link" data-term-key="${relKey}">${this.escapeHTML(relatedTerm)}</a>`;
                       }).join(', ');
                       html += `</span>`;
                   }
                   html += `</dd>`;
                   // --- End of HTML Generation ---
              });
          html += '</dl>';
          console.log("Generated Glossary HTML (snippet):", html.substring(0, 200)); // Check generated HTML
      } catch (htmlError) {
           console.error("!!! showGlossary Error: Failed to generate HTML!", htmlError);
           this.elements.glossaryBody.innerHTML = "<p class='error-text'>Error loading glossary content.</p>";
           this.openModal(this.elements.glossaryModal); // Still open modal to show error
           return;
      }

      this.elements.glossaryBody.innerHTML = html;
      console.log("Set glossaryBody innerHTML.");

      this.openModal(this.elements.glossaryModal);
      console.log("Called openModal for glossaryModal.");

      // Scroll logic (should happen after modal is open)
      if (termKeyToHighlight) {
           const termElement = this.elements.glossaryBody.querySelector(`#gloss-term-${termKeyToHighlight}`);
           requestAnimationFrame(() => { // Ensure element is visible before scrolling
              termElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
           });
           console.log("Attempted to scroll to:", termKeyToHighlight);
      }

      console.log("--- Exiting showGlossary ---"); // Log Exit
  } // <--- End of showGlossary function

  showStyleDiscovery(styleNameToHighlight = null) { /* ... keep ... */ }
  renderStyleDiscoveryContent(styleNameToHighlight = null) { /* ... keep ... */ }
  setTheme(themeName){ /* ... keep ... */ }
  applySavedTheme(){ /* ... keep ... */ }
  toggleTheme(){ /* ... keep ... */ }
  exportData(){ /* ... keep ... */ }
  importData(event){ /* ... keep ... */ }
  showTraitInfo(traitName){ /* ... keep ... */ }
  hideTraitInfo(){ /* ... keep ... */ }
  showContextHelp(helpKey) { /* ... keep ... */ }
  hideContextHelp() { /* ... keep ... */ }

  // --- Style Finder Methods ---
  sfStart(){ /* ... keep ... */ }
  sfClose(){ /* ... keep ... */ }
  sfCalculateSteps(){ /* ... keep ... */ }
  sfRenderStep() { /* ... keep ... */ }
  sfSetRole(role){ /* ... keep ... */ }
  sfSetTrait(trait,value){ /* ... keep ... */ }
  sfNextStep(){ /* ... keep ... */ }
  sfPrevStep(){ /* ... keep ... */ }
  sfStartOver(){ /* ... keep ... */ }

  // MODIFIED: sfComputeScores with Logging
  sfComputeScores() {
      let scores = {};
      // Check 1: Is sfRole correctly set?
      console.log("sfComputeScores - Role:", this.sfRole);
      if (!this.sfRole || !this.sfStyles[this.sfRole]) {
           console.warn("sfComputeScores - Invalid role or sfStyles missing for role.");
           return scores;
       }

      const roleStyles = this.sfStyles[this.sfRole];
      roleStyles.forEach(style => { scores[style] = 0; });

      const traitAnswers = this.sfAnswers.traits;
      console.log("sfComputeScores - Answers:", traitAnswers); // Check answers

      // Check if sfStyleKeyTraits itself is valid
      if (!this.sfStyleKeyTraits || typeof this.sfStyleKeyTraits !== 'object') {
           console.error("!!! sfComputeScores Error: this.sfStyleKeyTraits is missing or invalid!");
           return scores; // Cannot proceed
      }

      Object.keys(traitAnswers).forEach(trait => {
          const rating = traitAnswers[trait] ?? 0;
          // Check 2: Does this loop run?
          console.log(`sfComputeScores - Processing trait: ${trait}, Rating: ${rating}`);

          roleStyles.forEach(style => {
              // Check 3: Is sfStyleKeyTraits correct for this style?
              const keyTraits = this.sfStyleKeyTraits[style];
               if (!keyTraits) {
                   // This is expected if a style in sfStyles doesn't have an entry in sfStyleKeyTraits
                   // console.warn(`sfComputeScores - No keyTraits found for style: ${style}`);
                   return; // Skip this style if no traits defined for it
               }
               if (!Array.isArray(keyTraits)) {
                   console.error(`!!! sfComputeScores Error: sfStyleKeyTraits[${style}] is not an array!`, keyTraits);
                   return; // Skip invalid entry
               }

              // Check 4: Does the style include the current trait?
              if (keyTraits.includes(trait)) {
                  let weight = 1.5; // You have a weight here
                  scores[style] += rating * weight;
                  // Check 5: Is the score actually increasing?
                  console.log(`sfComputeScores - Matched! Style: ${style}, Trait: ${trait}, Added: ${rating * weight}, New Score: ${scores[style]}`);
              }
          });
      });
      console.log("sfComputeScores - Final Scores:", scores); // Check final object
      return scores;
  }

  sfUpdateDashboard(forceVisible = false) { /* ... keep ... */ }
  toggleStyleFinderDashboard() { /* ... keep ... */ }
  sfCalculateResult(){ /* ... keep ... */ }
  sfShowFeedback(message){ /* ... keep ... */ }
  sfShowTraitInfo(traitName){ /* ... keep ... */ }
  sfShowFullDetails(styleName){ /* ... keep ... */ }
  getStyleIcons(){ /* ... keep ... */ }
  confirmApplyStyleFinderResult(r, s) { /* ... keep ... */ }
  applyStyleFinderResult(r,s){ /* ... keep ... */ }

  // --- Other Helper Functions ---
  getFlairForScore(s){ /* ... keep ... */ }
  getEmojiForScore(s){ /* ... keep ... */ }
escapeHTML(str){
    const div=document.createElement('div');
    // Use textContent for safer assignment, prevents accidental HTML injection if str *was* undefined/null
    div.textContent = str ?? ''; // Use nullish coalescing for safety
    // Check the result *before* returning innerHTML
    console.log(`escapeHTML Input: "${str}", Output (textContent): "${div.textContent}", Output (innerHTML): "${div.innerHTML}"`); // <<-- ADD LOG
    return div.innerHTML;
}
        this.elementThatOpenedModal = document.activeElement;
        console.log("Storing focused element before modal open:", this.elementThatOpenedModal);

        modalElement.style.display='flex';
        modalElement.setAttribute('aria-hidden', 'false');
        console.log(`Set display='flex' for #${modalElement.id}. Current display:`, window.getComputedStyle(modalElement).display);

        const focusable = modalElement.querySelector('button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'); // Improved selector
        if(focusable) {
            console.log(`Found focusable element in #${modalElement.id}:`, focusable);
             setTimeout(() => {
                 try { focusable.focus(); } catch(e){ console.warn("Focus failed:", e)}
             }, 50);
        } else {
            console.warn(`No focusable element found in #${modalElement.id}.`);
             // Focusing the modal itself can help trap focus if it has tabindex="-1"
             // setTimeout(() => modalElement.focus(), 50);
        }
        console.log("--- Exiting openModal ---");
    }

    // MODIFIED: closeModal with focus restoration & logging
    closeModal(modalElement){
        if(!modalElement)return;
        console.log(`--- Closing modal: #${modalElement.id} ---`);

        modalElement.style.display='none';
        modalElement.setAttribute('aria-hidden','true');

        console.log("Attempting to restore focus to:", this.elementThatOpenedModal);
        if (this.elementThatOpenedModal && typeof this.elementThatOpenedModal.focus === 'function') {
            try {
                this.elementThatOpenedModal.focus();
                console.log("Focus restored.");
            } catch (e) {
                console.warn("Could not restore focus to original element:", e);
                try { document.body.focus(); console.log("Fell back to focusing body."); } catch (bodyErr) { console.warn("Could not focus body either.");}
            }
        } else {
            console.warn("No stored element to restore focus to, or it's not focusable.");
             try { document.body.focus(); console.log("Fell back to focusing body."); } catch (bodyErr) { console.warn("Could not focus body either.");}
        }
        this.elementThatOpenedModal = null;
    }

  getIntroForStyle(styleName){ /* ... keep ... */ }
  showNotification(message, type = 'info', duration = 4000) { /* ... keep ... */ }

} // --- END OF TrackerApp CLASS ---


// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style='color: red; padding: 20px; border: 2px solid red; margin: 20px; background: white;'>Fatal Error: ${error.message}<br><pre>${error.stack || ''}</pre></div>`;
}
