// === app.js === (Version 2.4 - Corrected Brace)

// --- Core Imports ---
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement, getAchievementDetails } from './achievements.js'; // Ensure UPDATED achievements.js

// --- New Feature Imports ---
import { synergyHints } from './synergyHints.js';
import { goalKeywords } from './goalPrompts.js';
import { challenges } from './challenges.js';
import { oracleReadings } from './oracle.js';

// Chart.js and Confetti loaded via CDN

// --- Top Level Data Check ---
console.log("--- bdsmData Check (Top Level) ---");
if (typeof bdsmData !== 'object' || bdsmData === null || !bdsmData.submissive || !bdsmData.dominant) {
    console.error("!!! CRITICAL: bdsmData is invalid or incomplete after import! Check data.js syntax and export.");
}
console.log("--- glossaryTerms Check (Top Level) ---");
if (typeof glossaryTerms !== 'object' || glossaryTerms === null || Object.keys(glossaryTerms).length === 0) {
    console.warn("!!! WARNING: glossaryTerms appears empty or invalid after import! Check glossary.js syntax and export.");
}
console.log("--- New Feature Data Checks ---");
console.log("synergyHints:", (typeof synergyHints === 'object' && synergyHints !== null));
console.log("goalKeywords:", (typeof goalKeywords === 'object' && goalKeywords !== null));
console.log("challenges:", (typeof challenges === 'object' && challenges !== null));
console.log("oracleReadings:", (typeof oracleReadings === 'object' && oracleReadings !== null));
// --- End Top Level Data Check ---


const contextHelpTexts = {
  historyChartInfo: "This chart visualizes how your trait scores have changed over time with each 'Snapshot' you take. Use snapshots to track your growth!",
  goalsSectionInfo: "Set specific, measurable goals for your persona's journey. Mark them as done when achieved! Look for alignment hints based on your traits.",
  traitsSectionInfo: "These are the specific traits relevant to your persona's chosen Role and Style. The scores reflect your self-assessment. Check the Breakdown tab for synergies!",
  achievementsSectionInfo: "Unlock achievements by using features and reaching milestones with your personas!",
  journalSectionInfo: "Use the journal to reflect on experiences, explore feelings, or answer prompts. Your private space for introspection.",
  dailyChallengeInfo: "A small, optional focus for the day to inspire reflection or gentle action related to kink exploration. A new one appears each day!"
};

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: Starting KinkCompass App (v2.4 - Corrected Brace)..."); // Updated version
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals'; // Default tab
    this.elementThatOpenedModal = null;
    this.lastSavedId = null; // For list item animation

    // Style Finder State (Remains the same)
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
    // Style Finder Data Structures (Copied from previous correct version)
    this.sfStyles = {
      submissive: [ 'Classic Submissive 🙇‍♀️', 'Brat 😈', 'Slave 🔗', 'Pet 🐾', 'Little 🍼', 'Puppy 🐶', 'Kitten 🐱', 'Princess 👑', 'Rope Bunny 🪢', 'Masochist 💥', 'Prey 🏃‍♀️', 'Toy 🎲', 'Doll 🎎', 'Bunny 🐰', 'Servant 🧹', 'Playmate 🎉', 'Babygirl 🌸', 'Captive ⛓️', 'Thrall 🛐', 'Puppet 🎭', 'Maid 🧼', 'Painslut 🔥', 'Bottom ⬇️' ],
      dominant: [ 'Classic Dominant 👑', 'Assertive 💪', 'Nurturer 🤗', 'Strict 📏', 'Master 🎓', 'Mistress 👸', 'Daddy 👨‍🏫', 'Mommy 👩‍🏫', 'Owner 🔑', 'Rigger 🧵', 'Sadist 😏', 'Hunter 🏹', 'Trainer 🏋️‍♂️', 'Puppeteer 🕹️', 'Protector 🛡️', 'Disciplinarian ✋', 'Caretaker 🧡', 'Sir 🎩', 'Goddess 🌟', 'Commander ⚔️' ],
      switch: [ 'Fluid Switch 🌊', 'Dominant-Leaning Switch 👑↔️', 'Submissive-Leaning Switch 🙇‍♀️↔️', 'Situational Switch 🤔']
    };
    this.sfSubFinderTraits = [
      { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' }, { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' }, { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' }, { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' }, { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' }, { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' }, { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' }, { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' }, { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' }, { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' }, { name: 'painTolerance', desc: 'How do you feel about physical discomfort or pain during play?' }, { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' }, { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' }, { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' }, { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' }, { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' }, { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' }, { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' }, { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' }
    ];
    this.sfSubTraitFootnotes = { obedience: "1: Rarely follows / 10: Always obeys", rebellion: "1: Very compliant / 10: Loves to resist", service: "1: Self-focused / 10: Service-driven", playfulness: "1: Serious / 10: Super playful", sensuality: "1: Not sensory / 10: Highly sensual", exploration: "1: Stays safe / 10: Seeks adventure", devotion: "1: Independent / 10: Deeply devoted", innocence: "1: Mature / 10: Very innocent", mischief: "1: Calm / 10: Mischievous", affection: "1: Distant / 10: Super affectionate", painTolerance: "1: Avoids pain / 10: Embraces sensation", submissionDepth: "1: Light submission / 10: Total surrender", dependence: "1: Self-reliant / 10: Loves guidance", vulnerability: "1: Guarded / 10: Fully open", adaptability: "1: Fixed role / 10: Very versatile", tidiness: "1: Messy and carefree / 10: Obsessed with order", politeness: "1: Casual and blunt / 10: Always courteous", craving: "1: Avoids intensity / 10: Seeks extreme thrills", receptiveness: "1: Closed off / 10: Fully open to input" };
    this.sfDomFinderTraits = [
      { name: 'authority', desc: 'Do you feel strong when you take charge?' }, { name: 'confidence', desc: 'Are you sure of your decisions?' }, { name: 'discipline', desc: 'Do you enjoy setting firm rules?' }, { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' }, { name: 'care', desc: 'Do you love supporting and protecting others?' }, { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' }, { name: 'control', desc: 'Do you thrive on directing every detail?' }, { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' }, { name: 'precision', desc: 'Are you careful with every step you take?' }, { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' }, { name: 'sadism', desc: 'Does giving a little consensual pain excite you?' }, { name: 'leadership', desc: 'Do you naturally guide others forward?' }, { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' }, { name: 'patience', desc: 'Are you calm while teaching or training?' }, { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' }
    ];
    this.sfDomTraitFootnotes = { authority: "1: Gentle / 10: Very commanding", confidence: "1: Hesitant / 10: Rock-solid", discipline: "1: Relaxed / 10: Strict", boldness: "1: Cautious / 10: Fearless", care: "1: Detached / 10: Deeply caring", empathy: "1: Distant / 10: Highly intuitive", control: "1: Hands-off / 10: Total control", creativity: "1: Routine / 10: Very creative", precision: "1: Casual / 10: Meticulous", intensity: "1: Soft / 10: Intense", sadism: "1: Avoids giving pain / 10: Enjoys giving pain", leadership: "1: Follower / 10: Natural leader", possession: "1: Shares / 10: Very possessive", patience: "1: Impatient / 10: Very patient", dominanceDepth: "1: Light control / 10: Full dominance" };
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
        authority: [ "Soft and shy!", "A little lead peeks!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Authority’s your vibe!", "You lead with ease!", "You’re a strong guide!", "Boss mode on!", "Total commander!" ],
        confidence: [ "Quiet and unsure!", "A bit of bold shows!", "You’re sure if it’s easy!", "Half shy, half steady!", "You’re growing bold!", "Confidence shines!", "You trust your gut!", "You’re rock solid!", "Bold and bright!", "Total powerhouse!" ],
        discipline: [ "Free and wild!", "A rule slips in!", "You set soft lines!", "Half loose, half tight!", "You’re liking order!", "Discipline’s your jam!", "You keep it firm!", "Rules are your strength!", "You’re super strict!", "Total control!" ],
        boldness: [ "Careful and calm!", "A risk peeks out!", "You leap if safe!", "Half shy, half daring!", "You’re getting brave!", "Boldness is you!", "You dive right in!", "Fearless vibes!", "You’re a bold star!", "Total daredevil!" ],
        care: [ "Cool and aloof!", "A care slips out!", "You help if asked!", "Half chill, half warm!", "You’re a soft guide!", "Nurturing’s your glow!", "You protect with love!", "Care is your core!", "You’re a warm star!", "Total nurturer!" ],
        empathy: [ "Distant and chill!", "A feel peeks out!", "You get it if clear!", "Half aloof, half tuned!", "You’re sensing more!", "Empathy’s your gift!", "You feel it all!", "You’re in sync!", "You’re a heart reader!", "Total intuitive!" ],
        control: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Control’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
        creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
        precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
        intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
        sadism: [ "Too gentle for that!", "A teasing edge emerges.", "Finding fun in their reaction.", "Enjoying controlled discomfort.", "The line starts to blur...", "Thriving on their response.", "Intensity feels powerful.", "Pushing limits is thrilling.", "Mastering sensation play.", "Their reaction is everything." ],
        leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
        possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
        patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
        dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ]
    };
    this.sfTraitExplanations = {
        obedience: "How much you enjoy following instructions or rules. High = loves obeying; Low = prefers independence.", rebellion: "How much you like playfully resisting or teasing. High = loves defiance; Low = compliant.", service: "Joy derived from helping or performing tasks for others. High = service-driven; Low = self-focused.", playfulness: "Love for silly games, humor, and lightheartedness. High = very playful; Low = serious.", sensuality: "Appreciation for physical sensations, textures, touch. High = very sensory; Low = less focused on touch.", exploration: "Eagerness to try new experiences or push boundaries. High = adventurous; Low = prefers familiarity.", devotion: "Depth of loyalty and commitment to a partner. High = deeply devoted; Low = more independent.", innocence: "Enjoyment of feeling carefree, childlike, or pure. High = embraces innocence; Low = more mature.", mischief: "Enjoyment of stirring things up, pranks, or playful trouble. High = loves mischief; Low = calm.", affection: "Need for physical closeness, cuddles, and reassurance. High = very affectionate; Low = prefers space.", painTolerance: "How you perceive and react to physical discomfort or pain. High = finds interest/pleasure; Low = avoids pain.", submissionDepth: "Willingness to yield control to a partner. High = enjoys total surrender; Low = prefers light guidance.", dependence: "Comfort level in relying on a partner for guidance or decisions. High = enjoys dependence; Low = self-reliant.", vulnerability: "Ease and willingness to show emotional softness or weakness. High = very open; Low = guarded.", adaptability: "Ability to switch between roles or adjust to changing dynamics. High = very flexible; Low = prefers consistency.", tidiness: "Satisfaction derived from neatness and order. High = very tidy; Low = comfortable with mess.", politeness: "Natural inclination towards courteous and respectful behavior. High = very polite; Low = more direct/casual.", craving: "Desire for intense, extreme, or peak sensations/experiences. High = seeks intensity; Low = prefers calm.", receptiveness: "Openness to receiving direction, input, or sensation. High = very receptive; Low = more closed off.", authority: "Natural inclination and comfort in taking charge or leading. High = commanding; Low = prefers following.", confidence: "Self-assuredness in decisions and actions within a dynamic. High = very confident; Low = hesitant.", discipline: "Enjoyment in setting and enforcing rules or structure. High = strict; Low = relaxed.", boldness: "Willingness to take risks or face challenges head-on. High = fearless; Low = cautious.", care: "Focus on supporting, protecting, and nurturing a partner. High = deeply caring; Low = more detached.", empathy: "Ability to understand and connect with a partner's feelings. High = very empathetic; Low = more analytical.", control: "Desire to manage details, actions, or the environment. High = loves control; Low = prefers flow.", creativity: "Enjoyment in crafting unique scenarios, tasks, or experiences. High = very inventive; Low = prefers routine.", precision: "Focus on executing actions or commands meticulously. High = very precise; Low = more casual.", intensity: "The level of emotional or physical energy brought to the dynamic. High = very intense; Low = gentle.", sadism: "Deriving pleasure from consensually inflicting pain or discomfort. High = enjoys inflicting; Low = avoids inflicting.", leadership: "Natural ability to guide, direct, and inspire others. High = strong leader; Low = follower.", possession: "Feeling of ownership or strong connection ('mine') towards a partner. High = very possessive; Low = less possessive.", patience: "Ability to remain calm while guiding, teaching, or waiting. High = very patient; Low = impatient.", dominanceDepth: "Desire for the level of influence or control over a partner. High = seeks total influence; Low = prefers light control."
    };
    this.sfStyleKeyTraits = { // Using cleaned keys
        'Classic Submissive': ['obedience', 'service', 'receptiveness', 'trust'],
        'Brat': ['rebellion', 'mischief', 'playfulness', 'painTolerance'],
        'Slave': ['devotion', 'obedience', 'service', 'submissionDepth'],
        'Pet': ['affection', 'playfulness', 'dependence', 'obedience'],
        'Little': ['innocence', 'dependence', 'affection', 'playfulness'],
        'Puppy': ['playfulness', 'obedience', 'affection'],
        'Kitten': ['sensuality', 'mischief', 'affection', 'playfulness'],
        'Princess': ['dependence', 'innocence', 'affection', 'sensuality'],
        'Rope Bunny': ['receptiveness', 'sensuality', 'exploration', 'painTolerance'],
        'Masochist': ['painTolerance', 'craving', 'receptiveness', 'submissionDepth'],
        'Prey': ['exploration', 'vulnerability', 'rebellion'],
        'Toy': ['receptiveness', 'adaptability', 'service'],
        'Doll': ['sensuality', 'innocence', 'adaptability'],
        'Bunny': ['innocence', 'affection', 'vulnerability'],
        'Servant': ['service', 'obedience', 'tidiness', 'politeness'],
        'Playmate': ['playfulness', 'exploration', 'adaptability'],
        'Babygirl': ['innocence', 'dependence', 'affection', 'vulnerability'],
        'Captive': ['submissionDepth', 'vulnerability', 'exploration'],
        'Thrall': ['devotion', 'submissionDepth', 'receptiveness'],
        'Puppet': ['obedience', 'receptiveness', 'adaptability'],
        'Maid': ['service', 'tidiness', 'politeness', 'obedience'],
        'Painslut': ['painTolerance', 'craving', 'receptiveness'],
        'Bottom': ['receptiveness', 'submissionDepth', 'painTolerance'],
        'Classic Dominant': ['authority', 'leadership', 'control', 'confidence', 'care'],
        'Assertive': ['authority', 'confidence', 'leadership', 'boldness'],
        'Nurturer': ['care', 'empathy', 'patience'],
        'Strict': ['authority', 'discipline', 'control', 'precision'],
        'Master': ['authority', 'dominanceDepth', 'control', 'possession'],
        'Mistress': ['authority', 'creativity', 'control', 'confidence'],
        'Daddy': ['care', 'authority', 'patience', 'possession'],
        'Mommy': ['care', 'empathy', 'patience'],
        'Owner': ['authority', 'possession', 'control', 'dominanceDepth'],
        'Rigger': ['creativity', 'precision', 'control', 'patience', 'care'],
        'Sadist': ['control', 'intensity', 'sadism', 'precision'],
        'Hunter': ['boldness', 'intensity', 'control', 'leadership'],
        'Trainer': ['discipline', 'patience', 'leadership'],
        'Puppeteer': ['control', 'creativity', 'precision'],
        'Protector': ['care', 'authority', 'boldness'],
        'Disciplinarian': ['authority', 'discipline', 'control'],
        'Caretaker': ['care', 'patience', 'empathy'],
        'Sir': ['authority', 'leadership', 'politeness', 'discipline'],
        'Goddess': ['authority', 'confidence', 'intensity', 'dominanceDepth'],
        'Commander': ['authority', 'leadership', 'control', 'discipline', 'boldness'],
        'Fluid Switch': ['adaptability', 'empathy', 'playfulness'],
        'Dominant-Leaning Switch': ['adaptability', 'authority', 'confidence'],
        'Submissive-Leaning Switch': ['adaptability', 'receptiveness', 'obedience'],
        'Situational Switch': ['adaptability', 'communication', 'empathy']
    };
     this.sfStyleDescriptions = { // Using cleaned keys
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
      'Fluid Switch': { short: "Flows easily between roles.", long: "Adapts intuitively to the dynamic's energy, enjoying both leading and following.", tips: ["Communicate shifts clearly.", "Embrace spontaneity.", "Find adaptable partners."] },
      'Dominant-Leaning Switch': { short: "Prefers leading, enjoys submitting.", long: "Comfortable taking charge, but finds pleasure and variety in yielding control occasionally.", tips: ["Negotiate when you want to Dom/sub.", "Explore your sub side safely.", "Communicate your primary preference."] },
      'Submissive-Leaning Switch': { short: "Prefers following, enjoys leading.", long: "Finds comfort in submission, but feels empowered and enjoys taking the lead sometimes.", tips: ["Discuss triggers for switching to Dom.", "Explore your Dom side confidently.", "Communicate your primary preference."] },
      'Situational Switch': { short: "Role depends on context/partner.", long: "Adapts role based on specific situations, partner dynamics, or current mood.", tips: ["Be clear about what influences your role choice.", "Negotiate roles per scene.", "Check in frequently."] }
    };
     this.sfDynamicMatches = { // Using cleaned keys
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
      'Fluid Switch': { dynamic: "Versatile Play", match: "Fluid Switch/Adaptable Partner", desc: "A dynamic dance.", longDesc: "Requires strong communication and reading energy." },
      'Dominant-Leaning Switch': { dynamic: "Flexible Power Exchange", match: "Submissive-Leaning Switch/Adaptable Sub", desc: "Lead with options.", longDesc: "Enjoys leading mostly, needs partner okay with shifts." },
      'Submissive-Leaning Switch': { dynamic: "Flexible Power Exchange", match: "Dominant-Leaning Switch/Adaptable Dom", desc: "Follow with options.", longDesc: "Enjoys submitting mostly, needs partner okay with shifts." },
      'Situational Switch': { dynamic: "Contextual Dynamics", match: "Situational Switch/Communicative Partner", desc: "Adapting together.", longDesc: "Roles negotiated based on context." }
    };


    // Element Mapping
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
      // <<< NEW Element Mapping >>>
      dailyChallengeArea: document.getElementById('daily-challenge-area'),
      dailyChallengeSection: document.getElementById('daily-challenge-section'),
    };

    console.log("CONSTRUCTOR: Elements mapped.");
    if (!this.elements.role || !this.elements.style) {
        console.error("CRITICAL ERROR: Role or Style dropdown element not found on page load. Form functionality will be broken.");
        // Optional: Display error to user
        return;
    }

    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role?.value || 'submissive'); // Default to submissive if needed
    this.renderTraits(this.elements.role?.value, this.elements.style?.value);
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    this.displayDailyChallenge(); // <<< NEW: Display challenge on load
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() {
      try {
          const data = localStorage.getItem('kinkProfiles');
          const profiles = data ? JSON.parse(data) : [];
          // Ensure default structures and add completedAt if missing
          this.people = profiles.map(p => ({
              id: p.id ?? Date.now() + Math.random(),
              name: p.name ?? "Unnamed",
              role: ['dominant', 'submissive', 'switch'].includes(p.role) ? p.role : 'submissive',
              style: p.style ?? "",
              avatar: p.avatar || '❓',
              traits: typeof p.traits === 'object' && p.traits !== null ? p.traits : {},
              goals: Array.isArray(p.goals) ? p.goals.map(g => ({ ...g, completedAt: g.completedAt || null })) : [], // Add completedAt
              history: Array.isArray(p.history) ? p.history : [],
              achievements: Array.isArray(p.achievements) ? p.achievements : [],
              reflections: typeof p.reflections === 'object' && p.reflections !== null ? p.reflections : { text: p.reflections || '' },
          }));
          console.log(`Loaded ${this.people.length} profiles.`);
      } catch (e) {
          console.error("Failed to load profiles:", e);
          this.people = [];
          this.showNotification("Error loading profiles. Starting fresh.", "error");
      }
  }
  saveToLocalStorage() {
      try {
          localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
          console.log(`Saved ${this.people.length} profiles.`);
      } catch (e) {
          console.error("Failed to save profiles:", e);
          this.showNotification("Error saving data. Storage might be full or corrupted.", "error");
      }
  }

  // --- Onboarding ---
  checkAndShowWelcome() { if (!localStorage.getItem('kinkCompassWelcomed')) { this.showWelcomeMessage(); } }
  showWelcomeMessage() { if (this.elements.welcomeModal) { this.openModal(this.elements.welcomeModal); localStorage.setItem('kinkCompassWelcomed', 'true'); } else { console.warn("Welcome modal element not found."); } }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Adding event listeners...");
    this.elements.role?.addEventListener('change', (e) => { this.renderStyles(e.target.value); this.renderTraits(e.target.value, ''); this.elements.style.value = ''; this.updateLivePreview(); });
    this.elements.style?.addEventListener('change', (e) => { this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); });
    this.elements.name?.addEventListener('input', () => { this.updateLivePreview(); });
    this.elements.save?.addEventListener('click', () => { this.savePerson(); });
    this.elements.clearForm?.addEventListener('click', () => { this.resetForm(true); });
    this.elements.avatarPicker?.addEventListener('click', (e) => { if (e.target.classList.contains('avatar-btn')) { const selectedEmoji = e.target.dataset.emoji; this.elements.avatarInput.value = selectedEmoji; this.elements.avatarDisplay.textContent = selectedEmoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected')); e.target.classList.add('selected'); this.updateLivePreview(); } });
    this.elements.traitsContainer?.addEventListener('input', (e) => { if (e.target.classList.contains('trait-slider')) { this.handleTraitSliderInput(e); this.updateLivePreview(); } });
    this.elements.traitsContainer?.addEventListener('click', (e) => { if (e.target.classList.contains('trait-info-btn')) { this.handleTraitInfoClick(e); } });
    document.body.addEventListener('click', (e) => { if (e.target.classList.contains('context-help-btn')) { const helpKey = e.target.dataset.helpKey; if (helpKey) { this.showContextHelp(helpKey); } } });
    this.elements.traitInfoClose?.addEventListener('click', () => { this.hideTraitInfo(); });
    this.elements.contextHelpClose?.addEventListener('click', () => { this.hideContextHelp(); });
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));
    this.elements.modalClose?.addEventListener('click', () => { this.closeModal(this.elements.modal); });
    this.elements.resourcesClose?.addEventListener('click', () => { this.closeModal(this.elements.resourcesModal); });
    this.elements.glossaryClose?.addEventListener('click', () => { this.closeModal(this.elements.glossaryModal); });
    this.elements.styleDiscoveryClose?.addEventListener('click', () => { this.closeModal(this.elements.styleDiscoveryModal); });
    this.elements.themesClose?.addEventListener('click', () => { this.closeModal(this.elements.themesModal); });
    this.elements.welcomeClose?.addEventListener('click', () => { this.closeModal(this.elements.welcomeModal); });
    this.elements.achievementsClose?.addEventListener('click', () => { this.closeModal(this.elements.achievementsModal); });
    this.elements.sfCloseBtn?.addEventListener('click', () => { this.sfClose(); });
    this.elements.resourcesBtn?.addEventListener('click', () => { grantAchievement({}, 'resource_reader'); localStorage.setItem('kinkCompass_resource_reader', 'true'); this.openModal(this.elements.resourcesModal); });
    this.elements.glossaryBtn?.addEventListener('click', () => { grantAchievement({}, 'glossary_user'); localStorage.setItem('kinkCompass_glossary_used', 'true'); this.showGlossary(); });
    this.elements.styleDiscoveryBtn?.addEventListener('click', () => { grantAchievement({}, 'style_discovery'); this.showStyleDiscovery(); });
    this.elements.themesBtn?.addEventListener('click', () => { this.openModal(this.elements.themesModal); });
    this.elements.achievementsBtn?.addEventListener('click', () => { this.showAchievements(); });
    this.elements.themeToggle?.addEventListener('click', () => { this.toggleTheme(); });
    this.elements.exportBtn?.addEventListener('click', () => { this.exportData(); });
    this.elements.importBtn?.addEventListener('click', () => { this.elements.importFileInput?.click(); });
    this.elements.importFileInput?.addEventListener('change', (e) => { this.importData(e); });
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => { this.sfStart(); });
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => { this.renderStyleDiscoveryContent(); });
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e)); // Consolidated modal clicks
    this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e));
    this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));
    this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e));
    this.elements.formStyleFinderLink?.addEventListener('click', () => { this.sfStart(); });
    this.elements.sfStepContent?.addEventListener('click', (e) => { const button = e.target.closest('button'); const infoIcon = e.target.closest('.sf-info-icon'); if (button && button.classList.contains('sf-info-icon')) { const traitName = button.dataset.trait; if (traitName) this.sfShowTraitInfo(traitName); } else if (button) { const action = button.dataset.action; this.handleStyleFinderAction(action, button.dataset); } });
    this.elements.sfStepContent?.addEventListener('input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { this.handleStyleFinderSliderInput(e.target); } });
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));
    window.addEventListener('click', (e) => this.handleWindowClick(e));
    console.log("Event listeners ADDED.");
  }

  // --- Event Handlers ---
  handleListClick(e) {
    const target = e.target;
    const listItem = target.closest('li');
    if (!listItem) { return; }
    const personIdStr = listItem.dataset.id; // Get ID as string first
    const personId = parseInt(personIdStr, 10);

    if (isNaN(personId)) {
      console.warn("Could not parse valid person ID from list item dataset:", listItem.dataset);
      return;
    }

    if (target.classList.contains('edit-btn')) {
      console.log(`>>> Edit button clicked for ID: ${personId}`);
      this.editPerson(personId);
    } else if (target.classList.contains('delete-btn')) {
      console.log(`>>> Delete button clicked for ID: ${personId}`);
      const personaName = listItem.querySelector('.person-name')?.textContent || 'this persona';
      if (confirm(`Are you sure you want to delete ${personaName}? This cannot be undone.`)) {
        this.deletePerson(personId);
      }
    } else if (target.closest('.person-info')) {
      console.log(`>>> Person info clicked for ID: ${personId}`);
      this.showPersonDetails(personId);
    }
  } // End handleListClick

  handleListKeydown(e) {
      // Only handle Enter or Space keys
      if (e.key !== 'Enter' && e.key !== ' ') {
          return;
      }

      const target = e.target;
      const listItem = target.closest('li'); // Find the parent LI if the target is inside it

      if (!listItem) {
           // If the focused element isn't inside an LI, ignore
           return;
      }

      // Check if the event originated from within the actions div (buttons)
      if (target.closest('.person-actions')) {
          // Handle activation of Edit/Delete buttons
          if (target.classList.contains('edit-btn') || target.classList.contains('delete-btn')) {
              e.preventDefault(); // Prevent default spacebar scroll or enter submission
              target.click(); // Simulate a click on the button
          }
      }
      // Check if the event originated from the main info part of the LI
      else if (target.closest('.person-info')) {
          if (e.key === 'Enter') { // Only Enter should trigger details view
              e.preventDefault();
              const personIdStr = listItem.dataset.id;
              const personId = parseInt(personIdStr, 10);
              if (!isNaN(personId)) {
                  this.showPersonDetails(personId);
              } else {
                   console.warn("Could not parse person ID for keydown details view:", listItem.dataset);
              }
          }
      }
      // Explicitly do nothing if the keypress was on the LI itself but not handled above
  } // End handleListKeydown

  handleWindowClick(e) {
     if (this.elements.traitInfoPopup && this.elements.traitInfoPopup.style.display !== 'none') {
         const popupContent = this.elements.traitInfoPopup.querySelector('.card');
         const infoButton = document.querySelector(`.trait-info-btn[aria-expanded="true"]`);
         if (popupContent && !popupContent.contains(e.target) && e.target !== infoButton && !infoButton?.contains(e.target)) {
             this.hideTraitInfo();
         }
     }
     if (this.elements.contextHelpPopup && this.elements.contextHelpPopup.style.display !== 'none') {
         const popupContent = this.elements.contextHelpPopup.querySelector('.card');
         const helpButton = document.querySelector(`.context-help-btn[aria-expanded="true"]`);
         if (popupContent && !popupContent.contains(e.target) && e.target !== helpButton && !helpButton?.contains(e.target)) {
             this.hideContextHelp();
         }
     }
     const activeSFPopup = document.querySelector('.sf-style-info-popup');
     if (activeSFPopup) {
         const triggerElement = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active');
         if (!activeSFPopup.contains(e.target) && e.target !== triggerElement && !triggerElement?.contains(e.target)) {
             activeSFPopup.remove();
             triggerElement?.classList.remove('active');
         }
     }
   } // End handleWindowClick

  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          if (this.elements.traitInfoPopup?.style.display !== 'none') { this.hideTraitInfo(); return; }
          if (this.elements.contextHelpPopup?.style.display !== 'none') { this.hideContextHelp(); return; }
          const activeSFPopup = document.querySelector('.sf-style-info-popup');
          if (activeSFPopup) {
              activeSFPopup.remove();
              document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active');
              return;
          }
          // Close other modals in order of likely appearance
          if (this.elements.modal?.style.display !== 'none') { this.closeModal(this.elements.modal); }
          else if (this.elements.sfModal?.style.display !== 'none') { this.sfClose(); }
          else if (this.elements.styleDiscoveryModal?.style.display !== 'none') { this.closeModal(this.elements.styleDiscoveryModal); }
          else if (this.elements.glossaryModal?.style.display !== 'none') { this.closeModal(this.elements.glossaryModal); }
          else if (this.elements.achievementsModal?.style.display !== 'none') { this.closeModal(this.elements.achievementsModal); }
          else if (this.elements.resourcesModal?.style.display !== 'none') { this.closeModal(this.elements.resourcesModal); }
          else if (this.elements.themesModal?.style.display !== 'none') { this.closeModal(this.elements.themesModal); }
          else if (this.elements.welcomeModal?.style.display !== 'none') { this.closeModal(this.elements.welcomeModal); }
      }
  } // End handleWindowKeydown

  handleTraitSliderInput(e) {
      const slider = e.target;
      const display = slider.closest('.trait')?.querySelector('.trait-value');
      if (display) {
          display.textContent = slider.value;
      }
      this.updateTraitDescription(slider);
  } // End handleTraitSliderInput

  handleTraitInfoClick(e) {
      const button = e.target.closest('.trait-info-btn');
      if (!button) return;
      const traitName = button.dataset.trait;
      this.showTraitInfo(traitName);
      document.querySelectorAll('.trait-info-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      button.setAttribute('aria-expanded', 'true');
  } // End handleTraitInfoClick

  handleModalBodyClick(e) { // Consolidated handler
    const personIdStr = this.elements.modal?.dataset.personId;
    if (!personIdStr) {
        return;
    }
    const personId = parseInt(personIdStr, 10);
    if (isNaN(personId)) {
        console.warn("handleModalBodyClick: Invalid personId in modal dataset:", personIdStr);
        return;
    }

    const target = e.target;
    const button = target.closest('button'); // Find the closest button ancestor

    // --- Action Handlers based on button ID or class ---
    if (button) {
        if (button.classList.contains('toggle-goal-btn')) {
            const goalIdStr = button.dataset.goalId;
            if (goalIdStr) {
                const goalId = parseInt(goalIdStr, 10);
                if (!isNaN(goalId)) {
                    console.log(`>>> Toggle Goal clicked for person ${personId}, goal ${goalId}`);
                    this.toggleGoalStatus(personId, goalId, button.closest('li'));
                } else { console.warn("Invalid goalId on toggle button:", goalIdStr); }
            }
            return; // Handled
        }

        if (button.classList.contains('delete-goal-btn')) {
            const goalIdStr = button.dataset.goalId;
            if (goalIdStr) {
                const goalId = parseInt(goalIdStr, 10);
                if (!isNaN(goalId)) {
                    console.log(`>>> Delete Goal clicked for person ${personId}, goal ${goalId}`);
                     if (confirm("Delete this goal?")) { this.deleteGoal(personId, goalId); }
                } else { console.warn("Invalid goalId on delete button:", goalIdStr); }
            }
            return; // Handled
        }

         switch (button.id) {
            case 'snapshot-btn':
                console.log(`>>> Snapshot button clicked for person ${personId}`);
                this.addSnapshotToHistory(personId);
                return; // Handled
            case 'journal-prompt-btn':
                console.log(`>>> Journal Prompt button clicked for person ${personId}`);
                this.showJournalPrompt(personId);
                return; // Handled
            case 'save-reflections-btn':
                 console.log(`>>> Save Reflections button clicked for person ${personId}`);
                this.saveReflections(personId);
                return; // Handled
            case 'oracle-btn':
                 console.log(`>>> Oracle button clicked for person ${personId}`);
                this.showKinkOracle(personId);
                return; // Handled
         }
    } // End if(button)

    // Glossary Link Action
    // Must check target directly as it's an <a> or a <button> now
    if (target.classList.contains('glossary-link') && target.closest('#detail-modal')) {
        e.preventDefault();
        const termKey = target.dataset.termKey;
        if (termKey) {
            console.log(`>>> Glossary link clicked inside modal for term: ${termKey}`);
            this.closeModal(this.elements.modal);
            this.showGlossary(termKey);
        }
        return; // Handled
    }
  } // <<< CORRECT CLOSING BRACE FOR handleModalBodyClick

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button) {
          const themeName = button.dataset.theme;
          this.setTheme(themeName);
          this.closeModal(this.elements.themesModal);
      }
  } // End handleThemeSelection

  handleStyleFinderAction(action, dataset = {}) {
     switch (action) {
        case 'start':
             this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference');
             if (this.sfStep === -1) this.sfStep = 1; // Fallback if rolePreference step isn't found somehow
             this.sfRenderStep();
             break;
        case 'next':
             this.sfNextStep(dataset.trait);
             break;
        case 'prev':
             this.sfPrevStep();
             break;
        case 'setRole':
             this.sfSetRole(dataset.value);
             break;
        case 'startOver':
             this.sfStartOver();
             break;
        case 'showDetails':
             this.sfShowFullDetails(dataset.value);
             // Manage active state for the button
             document.querySelectorAll('.sf-result-buttons button').forEach(b => b.classList.remove('active'));
             const detailsBtn = this.elements.sfStepContent?.querySelector(`button[data-action="showDetails"][data-value="${dataset.value}"]`);
             detailsBtn?.classList.add('active');
             break;
        case 'applyStyle':
             this.confirmApplyStyleFinderResult(this.sfIdentifiedRole, dataset.value);
             break;
        case 'toggleDashboard':
             this.toggleStyleFinderDashboard();
             break;
        default:
             console.warn("Unknown Style Finder action:", action);
     }
  } // End handleStyleFinderAction

  handleStyleFinderSliderInput(sliderElement){
      const traitName = sliderElement.dataset.trait;
      const value = sliderElement.value;
      const descriptionDiv = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`); // Use optional chaining

      if (traitName && value !== undefined && descriptionDiv && this.sfSliderDescriptions[traitName]) {
          const descriptions = this.sfSliderDescriptions[traitName];
          if (descriptions && descriptions.length === 10) {
              const index = parseInt(value, 10) - 1;
              if (index >= 0 && index < 10) {
                  descriptionDiv.textContent = descriptions[index];
                  this.sfSetTrait(traitName, value); // Update internal state
                  this.sfUpdateDashboard(); // Update live scores
              } else {
                  console.error(`Invalid slider index ${index} for trait ${traitName}`);
                  descriptionDiv.textContent = "Adjust the slider...";
              }
          } else {
              console.error(`Slider descriptions missing or incomplete for trait: ${traitName}`);
              descriptionDiv.textContent = "How does this feel?";
          }
      } else {
          // Don't warn if sfStepContent isn't ready yet
          if (this.elements.sfStepContent && this.elements.sfStepContent.innerHTML !== '') {
             console.warn("Missing elements for Style Finder slider update:", { traitName, value, descriptionDiv });
          }
      }
  } // End handleStyleFinderSliderInput

  handleDetailTabClick(e) {
      const link = e.target.closest('.tab-link');
      if (link && !link.classList.contains('active')) {
          const tabId = link.dataset.tab;
          const personIdStr = this.elements.modal?.dataset.personId;
          if (!personIdStr) return;
          const personId = parseInt(personIdStr, 10);
          if (isNaN(personId)) return;
          const person = this.people.find(p => p.id === personId);

          if (tabId && person) {
              this.activeDetailModalTab = tabId; // Update active tab state
              // Update button states
              this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => {
                  const isNowActive = t === link;
                  t.classList.toggle('active', isNowActive);
                  t.setAttribute('aria-selected', isNowActive ? 'true' : 'false');
                  t.setAttribute('tabindex', isNowActive ? '0' : '-1');
              });
              // Update content visibility
              this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => {
                   const isTargetContent = c.id === tabId;
                   c.classList.toggle('active', isTargetContent);
                   c.style.display = isTargetContent ? 'block' : 'none';
                   if (isTargetContent) {
                        this.renderDetailTabContent(person, tabId, c); // Render content *before* focusing
                        requestAnimationFrame(() => c.focus({ preventScroll: true })); // Focus the pane
                   }
              });
          } else {
               console.warn("Tab click ignored - missing tabId or person data", {tabId, personId});
          }
      }
  } // End handleDetailTabClick

  handleGlossaryLinkClick(e) {
       // This handler is now primarily for links OUTSIDE the detail modal
       const link = e.target.closest('a.glossary-link, button.glossary-link'); // Handle button links too
       if (link) {
           // Don't run if inside the detail modal (that's handled by handleModalBodyClick)
           if (!link.closest('#detail-modal')) {
               e.preventDefault();
               const termKey = link.dataset.termKey;
               if (termKey) {
                   console.log(`>>> Glossary link clicked outside modal for term: ${termKey}`);
                   // If another modal is open, maybe close it first? Depends on desired UX.
                   // For simplicity, just open the glossary.
                   this.showGlossary(termKey);
               }
           }
       }
  } // End handleGlossaryLinkClick

  handleExploreStyleLinkClick(e) {
      e.preventDefault();
      const styleName = this.elements.style?.value;
      if (styleName) {
          console.log(`>>> Explore Style link clicked for: ${styleName}`);
          this.showStyleDiscovery(styleName);
      } else {
           console.warn("Explore Style link clicked but no style selected.");
      }
  } // End handleExploreStyleLinkClick

  // --- Core Rendering ---
  renderStyles(roleKey) {
    console.log(`--- Entering renderStyles --- Role: ${roleKey}`);
    const selectElement = this.elements.style;
    if (!selectElement) {
        console.error("!!! renderStyles Error: Style select element not found!");
        return;
    }
    selectElement.innerHTML = '<option value="">-- Select a Style --</option>'; // Reset

    // Add a safety check for bdsmData
    if (!bdsmData || typeof bdsmData !== 'object') {
        console.error("!!! renderStyles Error: bdsmData is not loaded or invalid.");
        selectElement.innerHTML = '<option value="">Error: Data Missing</option>';
        selectElement.disabled = true;
        return;
    }

    const roleData = bdsmData[roleKey];
    console.log(`Found roleData for '${roleKey}':`, roleData ? 'Exists' : 'Not Found');

    let styles = [];
    if (roleData && Array.isArray(roleData.styles)) {
        styles = roleData.styles;
        console.log(`Found ${styles.length} styles for '${roleKey}'.`);
    } else {
        console.warn(`No valid 'styles' array found for role: '${roleKey}' in bdsmData.`);
        if (!roleData) console.warn(`Role key '${roleKey}' might be missing in bdsmData.`);
    }

    if (styles.length > 0) {
        try {
            styles
                .sort((a, b) => (a?.name || '').localeCompare(b?.name || '')) // Safer sort
                .forEach((style, index) => {
                    if (style && style.name) {
                        // Use the name directly as the value, including emoji
                        const escapedName = this.escapeHTML(style.name);
                        selectElement.innerHTML += `<option value="${escapedName}">${escapedName}</option>`;
                    } else {
                        console.warn(`Style object at index ${index} is invalid or missing name:`, style);
                    }
                });
            selectElement.disabled = false;
            console.log("Finished adding style options.");
        } catch (loopError) {
            console.error("!!! renderStyles Error: Failed during style option loop!", loopError);
            selectElement.innerHTML = '<option value="">Error Loading Styles</option>';
            selectElement.disabled = true;
        }
    } else {
        selectElement.innerHTML = `<option value="">-- No Styles for ${this.escapeHTML(roleKey)} --</option>`;
        selectElement.disabled = true;
        console.log("No styles found, setting disabled state.");
    }
    this.updateStyleExploreLink(); // Update link after populating
    console.log("--- Exiting renderStyles ---");
 } // End renderStyles

 renderTraits(roleKey, styleName) {
    console.log(`Rendering traits for Role: ${roleKey}, Style: ${styleName}`);
    const container = this.elements.traitsContainer;
    const messageDiv = this.elements.traitsMessage;
    if (!container || !messageDiv) { console.error("Traits container or message div not found."); return; }

    container.innerHTML = ''; // Clear previous traits
    container.style.display = 'none'; // Hide container initially
    messageDiv.style.display = 'block'; // Show message initially
    messageDiv.textContent = 'Select Role & Style above to customize traits.'; // Default message

    if (!roleKey || !styleName) {
        console.log("Role or Style not selected, showing message.");
        return; // Exit if role or style is missing
    }

    // Safety check for bdsmData
    if (!bdsmData || typeof bdsmData !== 'object') {
        console.error("renderTraits Error: bdsmData is missing or invalid.");
        messageDiv.textContent = 'Error: Core data definition missing.';
        return;
    }
    const roleData = bdsmData[roleKey];
    if (!roleData) {
        console.error(`Data for role '${roleKey}' not found in bdsmData.`);
        messageDiv.textContent = `Error: Data definition for role '${roleKey}' missing.`;
        return;
    }

    // Find the style object using the full name (including emoji)
    const styleObj = roleData.styles?.find(s => s.name === styleName);

    if (!styleObj) {
        // If style name is selected but object isn't found (e.g., data inconsistency)
        console.warn(`Style object for '${styleName}' not found within role '${roleKey}'.`);
        messageDiv.textContent = `Details for style '${styleName}' not found. Please select another or check data.js.`;
        return;
    }

    // --- If Role and Style are valid, proceed ---
    messageDiv.style.display = 'none'; // Hide message
    container.style.display = 'block'; // Show container

    let traitsToRender = [];
    // Add core traits safely
    if (roleData.coreTraits && Array.isArray(roleData.coreTraits)) {
        traitsToRender.push(...roleData.coreTraits);
        console.log(`Added ${roleData.coreTraits.length} core traits.`);
    } else {
        console.log("No core traits found for this role.");
    }
    // Add style-specific traits safely, avoiding duplicates
    if (styleObj.traits && Array.isArray(styleObj.traits)) {
        let addedCount = 0;
        styleObj.traits.forEach(styleTrait => {
            // Ensure trait is valid and not already included from core traits
            if (styleTrait && styleTrait.name && !traitsToRender.some(coreTrait => coreTrait.name === styleTrait.name)) {
                traitsToRender.push(styleTrait);
                addedCount++;
            }
        });
        console.log(`Added ${addedCount} style-specific traits (after deduplication).`);
    } else {
        console.log(`No specific traits found for style '${styleName}'.`);
    }

    if (traitsToRender.length === 0) {
        container.innerHTML = `<p class="muted-text">No specific traits defined for ${this.escapeHTML(styleName)}. Focus on your core role traits or check data definitions!</p>`;
        console.log("No traits to render for this combination.");
        return;
    }

    console.log(`Rendering ${traitsToRender.length} traits total.`);
    // Sort traits alphabetically by name for consistent order
    traitsToRender.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));

    // Generate and append HTML for each trait
    traitsToRender.forEach(trait => {
        container.innerHTML += this.createTraitHTML(trait);
    });

    // Apply saved values if editing
    if (this.currentEditId) {
        const person = this.people.find(p => p.id === this.currentEditId);
        if (person && person.traits) {
            Object.entries(person.traits).forEach(([traitName, value]) => {
                const slider = container.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                const display = container.querySelector(`.trait-value[data-trait="${traitName}"]`);
                if (slider) {
                     slider.value = value;
                     this.updateTraitDescription(slider); // Update description based on loaded value
                 }
                if (display) { display.textContent = value; }
            });
        }
    } else {
        // Update descriptions for default values if not editing
        container.querySelectorAll('.trait-slider').forEach(slider => {
            this.updateTraitDescription(slider);
        });
    }
 } // End renderTraits

  createTraitHTML(trait) {
    if (!trait || !trait.name || !trait.desc || typeof trait.desc !== 'object') { // Check if desc is an object
        console.warn("Attempted to create trait HTML with invalid data (missing name or desc object):", trait);
        return '<p class="error-text">Error rendering trait definition.</p>';
    }

    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1).replace(/([A-Z])/g, ' $1');
    const defaultValue = 3; // Default slider position
    const descriptionId = `desc-${trait.name}`;
    const sliderId = `slider-${trait.name}`;
    const labelId = `label-${trait.name}`;

    // Get description for the default value safely
    let valueDescription = "Description unavailable";
    const descriptionKey = String(defaultValue);
    if (trait.desc[descriptionKey]) {
        valueDescription = this.escapeHTML(trait.desc[descriptionKey]);
    } else {
        console.warn(`Missing description for trait ${trait.name} at default level ${descriptionKey}`);
    }

    // Generate HTML using template literals
    return `
      <div class="trait">
        <label id="${labelId}" for="${sliderId}" class="trait-label">
          ${this.escapeHTML(displayName)}
          <button type="button" class="trait-info-btn small-btn" data-trait="${trait.name}" aria-label="More info about ${this.escapeHTML(displayName)}" aria-expanded="false" aria-controls="trait-info-popup">?</button>
        </label>
        <div class="slider-container">
             <input type="range" id="${sliderId}" class="trait-slider" min="1" max="5" value="${defaultValue}" data-trait="${trait.name}" aria-labelledby="${labelId}" aria-describedby="${descriptionId}">
             <span class="trait-value" data-trait="${trait.name}" aria-live="polite">${defaultValue}</span>
        </div>
        <p class="trait-desc muted-text" id="${descriptionId}">${valueDescription}</p>
      </div>
    `;
  } // End createTraitHTML

 updateTraitDescription(slider) {
    if (!slider) { console.warn("updateTraitDescription called with no slider."); return; }

    const traitName = slider.dataset.trait;
    const value = slider.value;
    const descElement = slider.closest('.trait')?.querySelector('.trait-desc'); // Find the description element

    if (!traitName || !value || !descElement) {
        console.warn("Missing data for trait description update:", { traitName, value, descElement });
        if (descElement) descElement.textContent = "Error loading description.";
        return;
    }

    const roleKey = this.elements.role?.value;
    const styleName = this.elements.style?.value;

    if (!roleKey || !bdsmData || !bdsmData[roleKey]) {
         console.warn(`Cannot update description: Role '${roleKey}' or bdsmData missing.`);
         descElement.textContent = "Description unavailable (data error).";
         return;
    }

    const roleData = bdsmData[roleKey];
    let traitDefinition = null;

    // Find the trait definition in core or style traits
    traitDefinition = roleData.coreTraits?.find(t => t.name === traitName);
    if (!traitDefinition && styleName) {
        const cleanStyleName = styleName.replace(/(\p{Emoji})/gu, '').trim();
        const styleObj = roleData.styles?.find(s => s.name.replace(/(\p{Emoji})/gu, '').trim() === cleanStyleName);
        traitDefinition = styleObj?.traits?.find(t => t.name === traitName);
    }

    // Update the description text based on the found definition and current slider value
    if (traitDefinition && traitDefinition.desc && typeof traitDefinition.desc === 'object' && traitDefinition.desc[value]) {
        descElement.textContent = this.escapeHTML(traitDefinition.desc[value]);
    } else {
        console.warn(`Description not found for trait '${traitName}' at level ${value}. TraitDef:`, traitDefinition);
        descElement.textContent = "Description unavailable."; // Fallback if not found
    }
 } // End updateTraitDescription

  renderList() {
      const listElement = this.elements.peopleList;
      if (!listElement) return;

      this.displayDailyChallenge(); // Refresh daily challenge when list renders

      if (this.people.length === 0) {
          listElement.innerHTML = '<li>No personas created yet. Use the form to add one!</li>';
          return;
      }
      listElement.innerHTML = this.people
          .sort((a, b) => (a.name || '').localeCompare(b.name || '')) // Safer sort
          .map(person => this.createPersonListItemHTML(person))
          .join('');

      // Animation for newly saved item
      if (this.lastSavedId) {
          const newItem = listElement.querySelector(`li[data-id="${this.lastSavedId}"]`);
          if (newItem) {
              newItem.classList.add('item-just-saved');
              setTimeout(() => newItem.classList.remove('item-just-saved'), 1500);
          }
          this.lastSavedId = null; // Reset
      }
  } // End renderList

  createPersonListItemHTML(person) {
    const roleData = bdsmData[person.role];
    const cleanStyleName = person.style?.replace(/(\p{Emoji})/gu, '').trim() || '';
    // Safety check: ensure roleData and styles exist before finding
    const styleObj = (roleData && Array.isArray(roleData.styles))
        ? roleData.styles.find(s => s.name.replace(/(\p{Emoji})/gu, '').trim() === cleanStyleName)
        : null;

    let avgScore = 3; // Default average
    if (person.traits && Object.keys(person.traits).length > 0) {
        const scores = Object.values(person.traits).map(Number).filter(n => !isNaN(n));
        if (scores.length > 0) {
            avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
    }
    const flair = this.getFlairForScore(avgScore);
    // Get first 3 achievement icons safely
    const achievementIcons = person.achievements
        ?.map(id => achievementList[id]?.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0]) // Safer access
        .filter(Boolean)
        .slice(0, 3)
        .join('') || '';

    // Escape all parts going into HTML
    const escapedName = this.escapeHTML(person.name || 'Unnamed Persona');
    const escapedAvatar = person.avatar || '❓'; // Emoji don't need escaping usually
    const escapedStyle = this.escapeHTML(person.style || 'No Style');
    const escapedRole = this.escapeHTML(person.role || 'N/A');

    return `
      <li data-id="${person.id}" tabindex="0">
        <div class="person-info" role="button" aria-label="View details for ${escapedName}">
          <span class="person-avatar" aria-hidden="true">${escapedAvatar}</span>
          <div class="person-name-details">
            <span class="person-name">${escapedName} <span class="person-flair">${flair}</span></span>
            <span class="person-details muted-text">
              ${escapedStyle} (${escapedRole})
              ${achievementIcons ? `<span class="person-achievements-preview" title="${person.achievements.length} achievements">${achievementIcons}</span>` : ''}
            </span>
          </div>
        </div>
        <div class="person-actions">
          <button type="button" class="small-btn edit-btn" aria-label="Edit ${escapedName}">Edit</button>
          <button type="button" class="small-btn delete-btn" aria-label="Delete ${escapedName}">Delete</button>
        </div>
      </li>
    `;
  } // End createPersonListItemHTML

  updateStyleExploreLink() {
     const selectedStyle = this.elements.style?.value;
     const link = this.elements.styleExploreLink;
     if (link) {
         if (selectedStyle) {
             const cleanStyleName = selectedStyle.replace(/(\p{Emoji})/gu, '').trim(); // Use cleaned name for text
             link.textContent = `(Explore ${this.escapeHTML(cleanStyleName)})`; // Escape name for display
             link.setAttribute('aria-label', `Explore details for the ${this.escapeHTML(selectedStyle)} style`); // Use full name for aria-label
             link.style.display = 'inline';
         } else {
             link.style.display = 'none';
         }
     }
  } // End updateStyleExploreLink

  // --- CRUD ---
  savePerson() {
    const name = this.elements.name.value.trim();
    const role = this.elements.role.value;
    const style = this.elements.style.value; // Use the full style name with emoji
    const avatar = this.elements.avatarInput.value || '❓';

    if (!name || !role || !style) {
        this.showNotification("Please fill in Name, Role, and Style!", "warning");
        return;
    }

    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
        // Only save traits that were actually displayed for the selected role/style
        if (slider.offsetParent !== null) { // Check if element is visible
            traits[slider.dataset.trait] = parseInt(slider.value, 10);
        }
    });

    const saveButton = this.elements.save;
    saveButton.disabled = true;
    saveButton.innerHTML = 'Saving... <span class="spinner"></span>';

    // Apply flash effect
    const formElementsToFlash = [this.elements.name, this.elements.role, this.elements.style];
    formElementsToFlash.forEach(el => el?.classList.add('input-just-saved')); // Safer access

    setTimeout(() => {
        let personRef; // Reference to the saved/updated person
        let isNew = false;

        if (this.currentEditId) {
            const index = this.people.findIndex(p => p.id === this.currentEditId);
            if (index > -1) {
                const existingPerson = this.people[index];
                this.people[index] = {
                     ...existingPerson,
                     name, avatar, role, style, traits // Overwrite basic fields + traits
                    };
                 personRef = this.people[index];
                 this.showNotification(`${name} updated successfully! ✨`, "success");
                 grantAchievement(personRef, 'profile_edited');
                 if (avatar !== existingPerson.avatar && avatar !== '❓') grantAchievement(personRef, 'avatar_chosen');
            } else {
                 this.showNotification(`Error updating: Persona with ID ${this.currentEditId} not found.`, "error");
                 this.currentEditId = null;
                 saveButton.disabled = false; // Re-enable button on error
                 saveButton.innerHTML = 'Save Persona! <span role="img" aria-label="Sparkles">💖</span>';
                 formElementsToFlash.forEach(el => el?.classList.remove('input-just-saved'));
                 return;
            }
            this.lastSavedId = this.currentEditId;
        } else {
            isNew = true;
            const newPerson = {
                id: Date.now() + Math.random(), // More robust ID
                name, avatar, role, style, traits,
                goals: [], history: [], achievements: [], reflections: { text: '' } // Initialize arrays/objects
            };
            this.people.push(newPerson);
            personRef = newPerson;
            this.showNotification(`${name} created successfully! 🎉`, "success");
            grantAchievement(personRef, 'profile_created');
            if (avatar !== '❓') grantAchievement(personRef, 'avatar_chosen');
            if (this.people.length >= 5) grantAchievement(personRef, 'five_profiles');
            this.lastSavedId = newPerson.id;
        }

        // Grant trait achievements
        if(personRef && personRef.traits) { // Ensure personRef and traits exist
            if(Object.values(personRef.traits).some(s => s === 5)) grantAchievement(personRef, 'max_trait');
            if(Object.values(personRef.traits).some(s => s === 1)) grantAchievement(personRef, 'min_trait');
        }

        this.saveToLocalStorage();
        this.renderList(); // Render list after saving
        this.resetForm(); // Clears form, resets edit state
        this.updateLivePreview();

        // Remove flash effect after a short delay
        setTimeout(() => {
            formElementsToFlash.forEach(el => el?.classList.remove('input-just-saved'));
        }, 300);

        // Button state already handled by resetForm

    }, 300); // End of setTimeout for save simulation
  } // End savePerson

  editPerson(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`Cannot edit: Person with ID ${personId} not found.`);
          return;
      }
      this.currentEditId = personId;

      // Populate basic fields
      this.elements.name.value = person.name || '';
      this.elements.avatarInput.value = person.avatar || '❓';
      this.elements.avatarDisplay.textContent = person.avatar || '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => {
          btn.classList.toggle('selected', btn.dataset.emoji === person.avatar);
      });
      this.elements.role.value = person.role;

      // Render styles *first* based on the role
      this.renderStyles(person.role);

      // Defer setting style and rendering traits to ensure dropdown is populated
      requestAnimationFrame(() => {
          // Set the style dropdown value
          this.elements.style.value = person.style || ''; // Use full name with emoji
          console.log(`Attempting to set style dropdown to: "${person.style}"`);
          // Check if selection worked, log if not
           if (this.elements.style.value !== person.style && person.style) {
               console.warn(`Style dropdown did not select "${person.style}". It might be missing for role "${person.role}". Selected value is now: "${this.elements.style.value}"`);
           }

          // Render traits based on the NOW selected role and style
          this.renderTraits(person.role, this.elements.style.value);

          // Update preview and link
          this.updateLivePreview();
          this.updateStyleExploreLink();

          // Set trait slider values AFTER traits are rendered
          const container = this.elements.traitsContainer;
          if (person.traits) {
              Object.entries(person.traits).forEach(([traitName, value]) => {
                  const slider = container.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                  const display = container.querySelector(`.trait-value[data-trait="${traitName}"]`);
                  if (slider) {
                      slider.value = value;
                      this.updateTraitDescription(slider); // Update description to match
                  }
                  if (display) { display.textContent = value; }
              });
          } else {
              // If person has no traits saved, ensure sliders show default desc
              container.querySelectorAll('.trait-slider').forEach(slider => {
                 this.updateTraitDescription(slider);
              });
          }
      }); // End requestAnimationFrame

      // Update UI elements
      this.elements.formTitle.textContent = `✏️ Editing ${this.escapeHTML(person.name)}`;
      this.elements.save.textContent = 'Update Persona 💾';
      this.elements.save.disabled = false;
      this.elements.save.innerHTML = 'Update Persona 💾'; // Ensure spinner is removed

      // Focus and scroll
      this.elements.formSection.scrollIntoView({ behavior: 'smooth' });
      this.elements.name.focus();
  } // End editPerson

  deletePerson(personId) {
      const initialLength = this.people.length;
      this.people = this.people.filter(p => p.id !== personId);
      if (this.people.length < initialLength) {
          this.saveToLocalStorage();
          this.renderList();
          if (this.currentEditId === personId) {
              this.resetForm(); // Clear form if deleting the currently edited persona
          }
          this.showNotification("Persona deleted successfully. 🗑️", "info");
      } else {
          console.warn(`Attempted to delete person with ID ${personId}, but they were not found.`);
          this.showNotification("Could not delete persona.", "error");
      }
  } // End deletePerson

  resetForm(isManualClear = false) {
      this.currentEditId = null;
      this.elements.name.value = '';
      this.elements.avatarInput.value = '❓';
      this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected'));
      this.elements.role.value = 'submissive'; // Default role
      this.renderStyles('submissive'); // Render default styles
      // No need to explicitly set style.value = '', renderStyles handles the placeholder
      this.renderTraits('submissive', ''); // Clear/reset traits section
      this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.save.disabled = false; // Re-enable save button
      this.elements.save.innerHTML = 'Save Persona! <span role="img" aria-label="Sparkles">💖</span>'; // Reset button text
      this.updateLivePreview();
      this.updateStyleExploreLink();
      if (isManualClear) {
          console.log("Form manually cleared.");
      }
  } // End resetForm

  // --- Live Preview ---
   updateLivePreview() {
     const name = this.elements.name.value.trim();
     const role = this.elements.role.value;
     const style = this.elements.style.value; // Use full style name
     const avatar = this.elements.avatarInput.value || '❓';
     const previewElement = this.elements.livePreview;

     if (!name || !role || !style) { // Require style for preview now
         previewElement.innerHTML = '<p class="muted-text">Fill Name, Role & Style to see vibe! 🌈</p>';
         this.previewPerson = null;
         return;
     }

     const currentTraits = {};
     this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
         // Only include traits that are currently visible
         if (slider.offsetParent !== null) {
            currentTraits[slider.dataset.trait] = parseInt(slider.value, 10);
         }
     });

     this.previewPerson = { name, role, style, avatar, traits: currentTraits };

     let html = `<div class="preview-title">${avatar} <strong>${this.escapeHTML(name)}</strong> (${this.escapeHTML(role)} - ${this.escapeHTML(style)})</div>`;

     // Get breakdown data, handle potential errors
     const getBreakdownFunc = role === 'dominant' ? getDomBreakdown : getSubBreakdown;
     let breakdown = { strengths: "N/A", improvements: "N/A" };
     try {
        // Check if traits object is not empty before calling breakdown
        if (Object.keys(currentTraits).length > 0) {
           breakdown = getBreakdownFunc(style, currentTraits);
        } else {
            breakdown = { strengths: "Rate traits to see analysis.", improvements: "Rate traits to see analysis." };
        }
     } catch(e) {
         console.error("Error calling getStyleBreakdown in preview:", e);
         breakdown = { strengths: "Error calculating vibe.", improvements: "Error calculating vibe." };
     }

     html += `<div class="preview-breakdown">
                 <div class="strengths"><h4>💪 Strengths / Vibes:</h4><p>${breakdown.strengths}</p></div>
                 <div class="improvements"><h4>🎯 Growth / Focus:</h4><p>${breakdown.improvements}</p></div>
              </div>`;
     previewElement.innerHTML = html;
  } // End updateLivePreview


  // --- Modal Display ---
  showPersonDetails(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) { /* ... error handling ... */ return; }
      console.log("Showing details for:", person.name);

      if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs) { /* ... error handling ... */ return; }

      this.elements.modal.dataset.personId = personId;
      if (this.elements.detailModalTitle) {
          this.elements.detailModalTitle.textContent = `${person.avatar || '❓'} ${this.escapeHTML(person.name || 'N/A')} - Details`;
      }

      this.elements.modalBody.innerHTML = ''; // Clear previous content
      this.elements.modalTabs.innerHTML = ''; // Clear previous tabs

      const tabs = [
          { id: 'tab-goals', label: 'Goals', icon: '🎯' },
          { id: 'tab-traits', label: 'Traits', icon: '🎨' },
          { id: 'tab-breakdown', label: 'Breakdown', icon: '📊' },
          { id: 'tab-history', label: 'History', icon: '📈' },
          { id: 'tab-journal', label: 'Journal', icon: '📝' },
          { id: 'tab-achievements', label: 'Achievements', icon: '🏆' },
          { id: 'tab-oracle', label: 'Oracle', icon: '🔮' },
      ];

      tabs.forEach((tab) => {
          const isActive = tab.id === this.activeDetailModalTab;
          const tabButton = document.createElement('button');
          tabButton.className = `tab-link ${isActive ? 'active' : ''}`;
          tabButton.type = 'button'; // Explicit type
          tabButton.setAttribute('role', 'tab');
          tabButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
          tabButton.setAttribute('aria-controls', tab.id);
          tabButton.dataset.tab = tab.id;
          tabButton.innerHTML = `${tab.icon} <span class="tab-label">${tab.label}</span>`;
          tabButton.setAttribute('tabindex', isActive ? '0' : '-1');
          this.elements.modalTabs.appendChild(tabButton);

          const contentPane = document.createElement('div');
          contentPane.id = tab.id;
          contentPane.className = `tab-content ${isActive ? 'active' : ''}`;
          contentPane.setAttribute('role', 'tabpanel');
          contentPane.setAttribute('aria-labelledby', tabButton.id || `tab-btn-${tab.id}`); // Ensure button has ID or use data attr
          tabButton.id = `tab-btn-${tab.id}`; // Assign ID if needed
          contentPane.setAttribute('tabindex', '0'); // Make pane itself focusable
          if (!isActive) contentPane.style.display = 'none';
          contentPane.innerHTML = `<p class="loading-text">Loading ${tab.label}...</p>`;
          this.elements.modalBody.appendChild(contentPane);

          if (isActive) {
              this.renderDetailTabContent(person, tab.id, contentPane);
          }
      });

      this.openModal(this.elements.modal);
  } // End showPersonDetails

  renderDetailTabContent(person, tabId, contentElement) {
      if (!person || !contentElement) return;
      console.log(`Rendering content for tab: ${tabId}`);
      contentElement.innerHTML = ''; // Clear loading message

      try {
          switch (tabId) {

              case 'tab-goals':
                  contentElement.innerHTML = `
                    <section class="goals-section">
                      <h3>Goals <button type="button" class="context-help-btn small-btn" data-help-key="goalsSectionInfo" aria-label="Help with Goals Section">?</button></h3>
                      <ul id="goal-list-${person.id}"></ul>
                      <form class="add-goal-form" id="add-goal-form-${person.id}" onsubmit="event.preventDefault(); kinkCompassApp.addGoal(${person.id}, this);">
                        <label for="new-goal-${person.id}" class="sr-only">New Goal:</label>
                        <input type="text" id="new-goal-${person.id}" placeholder="Add a new goal..." required>
                        <button type="submit" id="add-goal-btn" class="small-btn">Add Goal</button>
                      </form>
                      <div id="goal-alignment-hints-${person.id}" class="alignment-hints"></div>
                    </section>`;
                  const goalListUl = contentElement.querySelector(`#goal-list-${person.id}`);
                  if (goalListUl) goalListUl.innerHTML = this.renderGoalList(person);
                  const alignmentHints = this.getGoalAlignmentHints(person);
                  const hintsContainer = contentElement.querySelector(`#goal-alignment-hints-${person.id}`);
                  if (hintsContainer) {
                      hintsContainer.innerHTML = alignmentHints.length > 0
                          ? `<h4>🎯 Alignment Insights:</h4><ul>${alignmentHints.map(hint => `<li>${this.escapeHTML(hint)}</li>`).join('')}</ul>`
                          : `<p class="muted-text">Add some active goals to see alignment insights!</p>`;
                  }
                  break;


              case 'tab-traits':
                  contentElement.innerHTML = `
                      <section class="trait-details-section">
                        <h3>Trait Details <button type="button" class="context-help-btn small-btn" data-help-key="traitsSectionInfo" aria-label="Help with Traits Section">?</button></h3>
                        <div class="trait-details-grid"></div>
                        <p class="muted-text" style="margin-top:1em;">Check the 'Breakdown' tab for trait synergies and focus ideas!</p>
                      </section>`;
                  const grid = contentElement.querySelector('.trait-details-grid');
                  if (!grid) { console.error("Trait details grid element not found."); break; }

                  const roleData = bdsmData[person.role];
                  if (!roleData) { grid.innerHTML = `<p class="muted-text">Trait definitions not found.</p>`; break; }

                  let traitsToShow = [];
                  if (roleData.coreTraits && Array.isArray(roleData.coreTraits)) {
                      traitsToShow.push(...roleData.coreTraits);
                  }
                  const cleanStyleName = person.style?.replace(/(\p{Emoji})/gu, '').trim() || '';
                  const styleObj = roleData.styles?.find(s => s.name.replace(/(\p{Emoji})/gu, '').trim() === cleanStyleName);
                  if (styleObj?.traits && Array.isArray(styleObj.traits)) {
                      styleObj.traits.forEach(styleTrait => {
                          if (styleTrait && styleTrait.name && !traitsToShow.some(t => t.name === styleTrait.name)) {
                              traitsToShow.push(styleTrait);
                          }
                      });
                  }

                  if (traitsToShow.length === 0) {
                      grid.innerHTML = `<p class="muted-text">No specific traits defined for ${this.escapeHTML(person.style || 'this style')}.</p>`;
                  } else {
                      grid.innerHTML = traitsToShow
                          .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
                          .map(traitDef => {
                              if (!traitDef || !traitDef.name) return '';
                              const score = person.traits[traitDef.name] ?? '-';
                              const description = traitDef.desc && score !== '-' && typeof traitDef.desc === 'object' && traitDef.desc[String(score)]
                                  ? traitDef.desc[String(score)] : 'N/A';
                              const displayName = traitDef.name.charAt(0).toUpperCase() + traitDef.name.slice(1).replace(/([A-Z])/g, ' $1');
                              return `
                                <div class="trait-detail-item">
                                  <h4>
                                     <button type="button" class="link-button glossary-link" data-term-key="${traitDef.name}" title="View '${this.escapeHTML(displayName)}' in Glossary">${this.escapeHTML(displayName)}</button>:
                                     <span class="trait-score-badge">${score}/5 ${this.getEmojiForScore(score)}</span>
                                   </h4>
                                  <p>${this.escapeHTML(description)}</p>
                                </div>`;
                          }).join('');
                  }
                  break;


              case 'tab-breakdown':
                  const getBreakdown = person.role === 'dominant' ? getDomBreakdown : getSubBreakdown;
                  let breakdownData = { strengths: "N/A", improvements: "N/A" };
                  let couldGetBreakdown = false;
                  if (person.style && person.traits && Object.keys(person.traits).length > 0) {
                      couldGetBreakdown = true;
                      try {
                          breakdownData = getBreakdown(person.style, person.traits || {});
                      } catch (e) { console.error("Error getting breakdown:", e); /* Keep default N/A */ }
                  } else {
                      breakdownData = { strengths: "Select style and rate traits.", improvements: "Select style and rate traits." };
                  }

                  const intro = this.getIntroForStyle(person.style);
                  const synergyHintsResult = this.getSynergyHints(person);
                  let synergyHTML = couldGetBreakdown && synergyHintsResult.length > 0
                      ? `<h4>✨ Trait Synergies & Dynamics:</h4><ul>${synergyHintsResult.map(hint => `<li class="${hint.type}-hint">${this.escapeHTML(hint.text || '')}</li>`).join('')}</ul><hr>`
                      : (couldGetBreakdown ? `<p class="muted-text">No specific trait synergies noted.</p><hr>` : '');

                  let suggestionHTML = '';
                   // Only generate suggestions if we have traits and breakdown data is valid
                   if (couldGetBreakdown && breakdownData.improvements && !breakdownData.improvements.startsWith("Error")) {
                       const lowTraits = Object.entries(person.traits || {})
                           .filter(([, score]) => parseInt(score, 10) <= 2)
                           .sort((a, b) => a[1] - b[1])
                           .slice(0, 2);

                       if (lowTraits.length > 0) {
                           suggestionHTML += `<h4>🌱 Focus Ideas for Growth:</h4><ul>`;
                           lowTraits.forEach(([traitName, score]) => {
                                // More robust suggestion extraction (example)
                                let suggestionText = `Explore ways to nurture your ${traitName} (currently ${score}/5).`;
                                const improvementLines = breakdownData.improvements.split(/<br>|\n|(?=🎯)/); // Split by line breaks or the target emoji
                                const relevantLine = improvementLines.find(line => line.toLowerCase().includes(traitName.toLowerCase()) && line.includes('**'));
                                if(relevantLine) {
                                    const match = relevantLine.match(/🎯 \*\*(.*?)\*\* (.*)/);
                                    if(match && match[2]) {
                                        suggestionText = match[2].trim();
                                    }
                                }
                                suggestionHTML += `<li>${this.escapeHTML(suggestionText)}</li>`;
                           });
                           suggestionHTML += `</ul><hr>`;
                       }
                   } else if (Object.keys(person.traits || {}).length > 0) { // If traits exist but breakdown failed/missing
                        const lowTraitsExist = Object.values(person.traits || {}).some(score => parseInt(score, 10) <= 2);
                        if (lowTraitsExist) {
                             suggestionHTML = `<h4>🌱 Focus Ideas for Growth:</h4><p class="muted-text">Consider exploring traits you rated 1 or 2.</p><hr>`;
                        }
                   }

                  contentElement.innerHTML = `
                    <section class="style-breakdown-section">
                      <h3>Style Breakdown & Insights</h3>
                      ${intro ? `<p class="modal-intro">${this.escapeHTML(intro)}</p>` : ''}
                      <div class="style-breakdown">
                        <div class="strengths"><h4>🌟 Strengths / Vibe:</h4><p>${breakdownData.strengths || 'N/A'}</p></div><hr>
                        <div class="improvements"><h4>🧭 Growth / Focus:</h4><p>${breakdownData.improvements || 'N/A'}</p></div><hr>
                        ${suggestionHTML}
                        ${synergyHTML}
                      </div>
                    </section>`;
                  break;


              case 'tab-history':
                  contentElement.innerHTML = `
                    <section class="history-section">
                      <h3>History Snapshots <button type="button" class="context-help-btn small-btn" data-help-key="historyChartInfo">?</button></h3>
                      <div class="history-chart-container" id="history-chart-container-${person.id}">
                        <canvas id="history-chart-${person.id}"></canvas>
                      </div>
                      <div class="modal-actions">
                        <button type="button" id="snapshot-btn" class="small-btn">Take Snapshot 📸</button>
                      </div>
                      <div class="snapshot-info" style="display: none;">
                         <p><strong>Snapshot Taken:</strong> <span id="snapshot-timestamp-${person.id}"></span></p>
                      </div>
                    </section>`;
                  this.renderHistoryChart(person, `history-chart-${person.id}`);
                  break;

               case 'tab-journal':
                  const currentReflection = person.reflections?.text || '';
                  contentElement.innerHTML = `
                    <section class="reflections-section">
                      <h3>Personal Journal <button type="button" class="context-help-btn small-btn" data-help-key="journalSectionInfo">?</button></h3>
                      <div class="modal-actions"><button type="button" id="journal-prompt-btn" class="small-btn">Get Prompt 🤔</button></div>
                      <p id="journal-prompt-${person.id}" class="journal-prompt muted-text" style="display: none;"></p>
                      <label for="reflections-text-${person.id}" class="sr-only">Journal Entry:</label>
                      <textarea id="reflections-text-${person.id}" class="reflections-textarea" placeholder="Reflect...">${this.escapeHTML(currentReflection)}</textarea>
                      <div class="modal-actions"><button type="button" id="save-reflections-btn" class="small-btn save-btn">Save 💾</button></div>
                    </section>`;
                  break;

               case 'tab-achievements':
                  contentElement.innerHTML = `
                    <section class="achievements-section">
                      <h3>Achievements Unlocked <button type="button" class="context-help-btn small-btn" data-help-key="achievementsSectionInfo">?</button></h3>
                      <ul id="achievements-list-${person.id}"></ul>
                      <div class="modal-actions"><button type="button" class="small-btn" onclick="kinkCompassApp.showAchievements()">View All</button></div>
                    </section>`;
                  this.renderAchievementsList(person, `achievements-list-${person.id}`);
                  break;

               case 'tab-oracle':
                    contentElement.innerHTML = `
                        <section class="kink-oracle-section">
                          <h3>Your Kink Compass Oracle <button type="button" class="small-btn" id="oracle-btn" style="margin-left: auto;">Consult</button></h3>
                          <div id="kink-oracle-output-${person.id}" class="kink-oracle-output muted-text">Click 'Consult Oracle'...</div>
                        </section>`;
                    break;

              default:
                  contentElement.innerHTML = `<p>Tab "${tabId}" loading error.</p>`;
                  break;
          } // End switch
      } catch (error) {
          console.error(`Error rendering tab ${tabId}:`, error);
          contentElement.innerHTML = `<p class="error-text">Error loading section.</p>`;
      }
  } // End renderDetailTabContent

  // --- New Feature Logic ---
  addGoal(personId, formElement) {
      const inputElement = formElement?.querySelector('input[type="text"]'); // Safer access
      if (!inputElement) { /* ... error handling ... */ return; }
      const goalText = inputElement.value.trim();
      if (!goalText) { this.showNotification("Enter goal text.", "warning"); return; }
      const person = this.people.find(p => p.id === personId);
      if (!person) { /* ... error handling ... */ return; }

      person.goals = person.goals || []; // Initialize if missing
      const newGoal = { id: Date.now() + Math.random(), text: goalText, done: false, completedAt: null };
      person.goals.push(newGoal);
      this.saveToLocalStorage();

      // Re-render goal list and hints (safer checks)
      const goalListUl = document.getElementById(`goal-list-${person.id}`);
      if (goalListUl) goalListUl.innerHTML = this.renderGoalList(person);
      const alignmentHintsContainer = document.getElementById(`goal-alignment-hints-${person.id}`);
      if(alignmentHintsContainer) {
          const alignmentHints = this.getGoalAlignmentHints(person);
          alignmentHintsContainer.innerHTML = alignmentHints.length > 0
              ? `<h4>🎯 Alignment Insights:</h4><ul>${alignmentHints.map(hint => `<li>${this.escapeHTML(hint)}</li>`).join('')}</ul>`
              : `<p class="muted-text">Add active goals for insights!</p>`;
      }

      inputElement.value = '';
      this.showNotification("Goal added! 🎉", "success", 2500);
      grantAchievement(person, 'goal_added');
  } // End addGoal

  toggleGoalStatus(personId, goalId, listItemElement = null) {
      const person = this.people.find(p => p.id === personId);
      if (!person || !Array.isArray(person.goals)) return; // Check goals array
      const goalIndex = person.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) return;

      person.goals[goalIndex].done = !person.goals[goalIndex].done;
      person.goals[goalIndex].completedAt = person.goals[goalIndex].done ? new Date().toISOString() : null;

      this.saveToLocalStorage();

      // Re-render goal list
      const goalListUl = document.getElementById(`goal-list-${person.id}`);
      if (goalListUl) goalListUl.innerHTML = this.renderGoalList(person);

      if (person.goals[goalIndex].done) {
          grantAchievement(person, 'goal_completed');
          if (this.checkGoalStreak(person)) {
              grantAchievement(person, 'goal_streak_3');
              this.showNotification("Goal Streak! 🔥", "achievement");
          }
          // Count *all* completed goals for five_goals achievement
          const totalCompletedCount = this.people.reduce((count, p) => count + (p.goals?.filter(g => g.done).length || 0), 0);
          if (totalCompletedCount >= 5) {
             // Grant to the current person, though it's an app-wide count
             grantAchievement(person, 'five_goals_completed');
          }

          // Micro-interaction (find the newly rendered li)
          const updatedLi = goalListUl?.querySelector(`li[data-goal-id="${goalId}"]`);
          if (updatedLi) {
              updatedLi.classList.add('goal-completed-animation');
              setTimeout(() => updatedLi.classList.remove('goal-completed-animation'), 600);
          }
          this.showNotification("Goal completed! ✔️", "success", 2000);
      } else {
          this.showNotification("Goal marked as not done.", "info", 2000);
      }

       // Re-render alignment hints
       const alignmentHintsContainer = document.getElementById(`goal-alignment-hints-${person.id}`);
        if (alignmentHintsContainer) {
            const alignmentHints = this.getGoalAlignmentHints(person);
            alignmentHintsContainer.innerHTML = alignmentHints.length > 0
                ? `<h4>🎯 Alignment Insights:</h4><ul>${alignmentHints.map(hint => `<li>${this.escapeHTML(hint)}</li>`).join('')}</ul>`
                : `<p class="muted-text">Add active goals for insights!</p>`;
        }
  } // End toggleGoalStatus

  deleteGoal(personId, goalId) {
    const person = this.people.find(p => p.id === personId);
    if (!person || !Array.isArray(person.goals)) return;
    const initialLength = person.goals.length;
    person.goals = person.goals.filter(g => g.id !== goalId);

    if (person.goals.length < initialLength) {
        this.saveToLocalStorage();
        // Re-render list and hints
        const goalListUl = document.getElementById(`goal-list-${person.id}`);
        if (goalListUl) goalListUl.innerHTML = this.renderGoalList(person);
        const alignmentHintsContainer = document.getElementById(`goal-alignment-hints-${person.id}`);
         if (alignmentHintsContainer) {
             const alignmentHints = this.getGoalAlignmentHints(person);
             alignmentHintsContainer.innerHTML = alignmentHints.length > 0
                 ? `<h4>🎯 Alignment Insights:</h4><ul>${alignmentHints.map(hint => `<li>${this.escapeHTML(hint)}</li>`).join('')}</ul>`
                 : `<p class="muted-text">Add active goals for insights!</p>`;
         }
        this.showNotification("Goal deleted. 🗑️", "info", 2000);
    }
  } // End deleteGoal

  renderGoalList(person) {
      if (!person.goals || person.goals.length === 0) {
          return '<li class="muted-text">No goals added yet.</li>';
      }
      const sortedGoals = [...person.goals].sort((a, b) => {
          if (a.done !== b.done) return a.done ? 1 : -1; // Not done first
          return (a.id || 0) - (b.id || 0); // Then older first (safer ID access)
      });

      return sortedGoals.map(goal => `
        <li class="${goal.done ? 'done' : ''}" data-goal-id="${goal.id}">
          <span>${this.escapeHTML(goal.text || '')}</span>
          <div class="goal-actions">
            <button type="button" class="small-btn toggle-goal-btn" data-goal-id="${goal.id}" aria-label="${goal.done ? 'Undo' : 'Done'}">
              ${goal.done ? 'Undo' : 'Done'}
            </button>
            <button type="button" class="small-btn delete-btn delete-goal-btn" data-goal-id="${goal.id}" aria-label="Delete">
              Delete
            </button>
          </div>
        </li>`).join('');
  } // End renderGoalList

  showJournalPrompt(personId) {
    const promptElement = document.getElementById(`journal-prompt-${personId}`);
    const textarea = document.getElementById(`reflections-text-${personId}`);
    if (promptElement && textarea) {
        const prompt = getRandomPrompt();
        promptElement.textContent = `💡 Prompt: ${prompt}`;
        promptElement.style.display = 'block';
        if (textarea.value.trim() === '') textarea.value = `Prompt: ${prompt}\n\n`;
        textarea.focus();
        const person = this.people.find(p => p.id === personId);
        if (person) grantAchievement(person, 'prompt_used');
    }
  } // End showJournalPrompt

  saveReflections(personId) {
    const textarea = document.getElementById(`reflections-text-${personId}`);
    const saveButton = document.getElementById('save-reflections-btn');
    if (!textarea || !saveButton) return;

    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    person.reflections = person.reflections || {}; // Initialize if needed
    person.reflections.text = textarea.value;
    person.reflections.journalEntries = person.reflections.journalEntries || [];

    if (textarea.value.trim().length > 10) {
         person.reflections.journalEntries.push({ date: new Date().toISOString(), snippet: textarea.value.substring(0, 50) });
         if (person.reflections.journalEntries.length > 50) { // Pruning
             person.reflections.journalEntries = person.reflections.journalEntries.slice(-50);
         }
    }
    this.saveToLocalStorage();

    // Micro-interaction
    textarea.classList.add('input-just-saved');
    saveButton.textContent = 'Saved! ✅';
    saveButton.disabled = true;
    setTimeout(() => {
        textarea.classList.remove('input-just-saved');
        saveButton.textContent = 'Save Reflections 💾';
        saveButton.disabled = false;
    }, 1500);

    this.showNotification("Reflections saved.", "success", 2000);
    grantAchievement(person, 'reflection_saved');
    if (person.reflections.journalEntries.length >= 5) grantAchievement(person, 'five_reflections');
    if (person.reflections.journalEntries.length >= 10) grantAchievement(person, 'journal_journeyman');
  } // End saveReflections

  addSnapshotToHistory(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    person.history = person.history || []; // Initialize if needed
    const timestamp = new Date().toISOString();
    const snapshot = { timestamp: timestamp, traits: { ...(person.traits || {}) } }; // Ensure traits exist

    let grantedConsistent = false;
    let grantedTransform = false;
    if (person.history.length > 0) {
        if (this.checkConsistentSnapper(person, timestamp)) {
             grantedConsistent = grantAchievement(person, 'consistent_snapper');
        }
        if (this.checkTraitTransformation(person, snapshot)) {
             grantedTransform = grantAchievement(person, 'trait_transformer');
        }
    }

    person.history.push(snapshot);
    const MAX_SNAPSHOTS = 20;
    if (person.history.length > MAX_SNAPSHOTS) {
        person.history = person.history.slice(-MAX_SNAPSHOTS);
    }

    this.saveToLocalStorage();
    this.renderHistoryChart(person, `history-chart-${person.id}`);

    // Micro-interaction
    const timestampDisplay = document.getElementById(`snapshot-timestamp-${person.id}`);
    const infoDiv = document.querySelector(`#tab-history .snapshot-info`); // More specific selector
    const snapshotButton = document.getElementById('snapshot-btn');
    if (timestampDisplay && infoDiv && snapshotButton) {
         timestampDisplay.textContent = new Date(timestamp).toLocaleString();
         this.toggleSnapshotInfo(snapshotButton);
    }

    this.showNotification("Snapshot saved! 📸", "success", 2500);
    grantAchievement(person, 'history_snapshot');
    if (person.history.length >= 10) grantAchievement(person, 'ten_snapshots');
    if (grantedConsistent) this.showNotification("Consistent Chronicler! 📅", "achievement");
    if (grantedTransform) this.showNotification("Trait Transformer! ✨", "achievement");
  } // End addSnapshotToHistory

  renderHistoryChart(person, canvasId) {
    const canvasElement = document.getElementById(canvasId);
    const containerElement = canvasElement?.parentElement; // Get container relative to canvas
    if (!canvasElement || !containerElement) { /* ... error handling ... */ return; }

    containerElement.classList.add('chart-loading');
    if (typeof Chart === 'undefined') { /* ... error handling ... */ return; }
    if (this.chartInstance && this.chartInstance.canvas?.id === canvasId) {
        this.chartInstance.destroy();
    }

    if (!Array.isArray(person.history) || person.history.length === 0) { // Safer check
        containerElement.innerHTML = '<p class="muted-text">No snapshots yet!</p>';
        containerElement.classList.remove('chart-loading');
        return;
    }
    // Ensure canvas is back if it was replaced by message
    if (!containerElement.querySelector('canvas')) {
         containerElement.innerHTML = `<canvas id="${canvasId}"></canvas>`;
         canvasElement = document.getElementById(canvasId); // Re-assign canvasElement
         if(!canvasElement) { console.error("Failed to re-create canvas"); return; }
    }


    const labels = person.history.map(snap => new Date(snap.timestamp).toLocaleDateString());
    // Get unique traits across *all* history snapshots for this person
    const allTraitNames = [...new Set(person.history.flatMap(snap => Object.keys(snap.traits || {})))].sort();

    if (allTraitNames.length === 0) { // Handle case where snapshots exist but have no traits
        containerElement.innerHTML = '<p class="muted-text">Snapshots have no trait data.</p>';
        containerElement.classList.remove('chart-loading');
        return;
    }

    // Theme-aware colors (copied from previous version)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'velvet';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim() || (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
    const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label-color').trim() || (isDark ? '#c49db1' : '#8a5a6d');
    const tooltipBgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-bg').trim() || (isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)');
    const tooltipTextColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-text').trim() || (isDark ? '#000' : '#fff');
    const pointColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-point-color').trim();
    const defaultColors = ['#ff69b4', '#1e90ff', '#3cb371', '#ffa500', '#9370db', '#ff7f50', '#f08080', '#20b2aa', '#dda0dd', '#ffcc00'];

    const datasets = allTraitNames.map((traitName, index) => {
        const data = person.history.map(snap => snap.traits[traitName] ?? null); // Use null for missing data
        const color = defaultColors[index % defaultColors.length];
        return {
            label: traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1'),
            data: data,
            borderColor: color,
            backgroundColor: color + '33',
            tension: 0.1,
            fill: false,
            pointBackgroundColor: pointColor || color,
            pointRadius: 3,
            pointHoverRadius: 5,
            spanGaps: true // Connect lines across null points
        };
    });

    try {
        this.chartInstance = new Chart(canvasElement, {
            type: 'line',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 5, ticks: { color: labelColor, stepSize: 1 }, grid: { color: gridColor } },
                    x: { ticks: { color: labelColor }, grid: { color: gridColor } }
                },
                plugins: {
                     legend: { position: 'bottom', labels: { color: labelColor, boxWidth: 12, padding: 15, font: {size: 10} } },
                     tooltip: { backgroundColor: tooltipBgColor, titleColor: tooltipTextColor, bodyColor: tooltipTextColor, boxPadding: 5 }
                },
                interaction: { intersect: false, mode: 'index' },
            }
        });
    } catch (chartError) {
        console.error("Error creating Chart instance:", chartError);
        containerElement.innerHTML = '<p class="error-text">Error rendering chart.</p>';
    } finally {
        containerElement.classList.remove('chart-loading');
    }
 } // End renderHistoryChart

  toggleSnapshotInfo(button) {
      if(!button) return;
      const section = button.closest('.history-section');
      if(!section) return;
      const infoDiv = section.querySelector('.snapshot-info');
      const timestampSpan = section.querySelector('[id^="snapshot-timestamp-"]'); // More specific ID
      if (!infoDiv || !timestampSpan) return;

      // Animate
      infoDiv.style.display = 'block';
      requestAnimationFrame(() => {
          infoDiv.style.transition = 'opacity 0.5s ease-in-out';
          infoDiv.style.opacity = 1;
          setTimeout(() => {
              infoDiv.style.opacity = 0;
              setTimeout(() => { if (infoDiv) infoDiv.style.display = 'none'; }, 500);
          }, 3000);
      });
  } // End toggleSnapshotInfo

  renderAchievementsList(person, listElementId) {
    const listElement = document.getElementById(listElementId);
    if (!listElement) return;
    if (!Array.isArray(person.achievements) || person.achievements.length === 0) { // Safer check
        listElement.innerHTML = '<li class="muted-text">No achievements unlocked yet.</li>';
        return;
    }
    listElement.innerHTML = person.achievements
        .map(id => achievementList[id]) // Get achievement data
        .filter(Boolean) // Remove any invalid IDs
        .sort((a, b) => (a?.name || '').localeCompare(b?.name || '')) // Safer sort
        .map(ach => `
          <li>
            <span class="achievement-icon" title="${this.escapeHTML(ach.desc || '')}">${ach.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0] || '🏆'}</span>
            <span class="achievement-name">${this.escapeHTML(ach.name || 'Unknown')}</span>
          </li>
        `).join('');
  } // End renderAchievementsList

  showAchievements() {
    const body = this.elements.achievementsBody;
    if (!body || !this.elements.achievementsModal) return;

    let unlockedAppLevel = new Set();
    let unlockedPersonaLevel = new Set();
    this.people.forEach(p => { p.achievements?.forEach(id => unlockedPersonaLevel.add(id)); });
    // Check localStorage
    Object.keys(achievementList).forEach(id => {
         if (localStorage.getItem(`kinkCompass_${id}`)) {
             unlockedAppLevel.add(id);
         }
    });

    const allUnlockedIds = new Set([...unlockedAppLevel, ...unlockedPersonaLevel]);
    const totalPossible = Object.keys(achievementList).length;

    let html = `<p>Showing all possible achievements (${allUnlockedIds.size} / ${totalPossible} unlocked). Unlocked achievements are highlighted!</p>`;
    html += '<ul class="all-achievements-list">';

    Object.entries(achievementList)
        .sort((a, b) => (a[1]?.name || '').localeCompare(b[1]?.name || ''))
        .forEach(([id, ach]) => {
            const isUnlocked = allUnlockedIds.has(id);
            const icon = ach.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0] || '🏆';
            html += `
             <li class="${isUnlocked ? 'unlocked' : 'locked'}" title="${this.escapeHTML(isUnlocked ? ach.desc : 'Locked Achievement')}">
               <span class="achievement-icon">${icon}</span>
               <div class="achievement-details">
                 <span class="achievement-name">${this.escapeHTML(ach.name || 'Unnamed Achievement')}</span>
                 <span class="achievement-desc">${this.escapeHTML(isUnlocked ? ach.desc : '???')}</span>
               </div>
             </li>`;
        });
    html += '</ul>';
    body.innerHTML = html;
    this.openModal(this.elements.achievementsModal);
  } // End showAchievements

  showKinkOracle(personId) {
      const outputElement = document.getElementById(`kink-oracle-output-${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!outputElement || !person) { /* ... error handling ... */ return; }

      outputElement.innerHTML = '<p class="loading-text">Consulting the compass...</p>';
      try {
          // Use helper to get structured reading data
          const readingData = this.getKinkOracleReading(person);
          outputElement.innerHTML = `
            <div class="oracle-reading">
                <p class="oracle-opening">${this.escapeHTML(readingData.opening)}</p>
                <p class="oracle-focus"><strong>Focus:</strong> ${this.escapeHTML(readingData.focus)}</p>
                <p class="oracle-encouragement"><em>${this.escapeHTML(readingData.encouragement)}</em></p>
                <p class="oracle-closing">${this.escapeHTML(readingData.closing)}</p>
            </div>`;
          grantAchievement(person, 'kink_reading_oracle');
      } catch (error) {
          console.error("Error generating Oracle reading:", error);
          outputElement.innerHTML = '<p class="error-text">Error generating reading.</p>';
      }
  } // End showKinkOracle

  displayDailyChallenge() {
      if (!this.elements.dailyChallengeArea || !this.elements.dailyChallengeSection) return;

      // Use first persona, or null if no personas exist
      const primaryPersona = this.people.length > 0 ? this.people[0] : null;
      const challenge = this.getDailyChallenge(primaryPersona); // Pass persona to helper

      if (challenge && challenge.title && challenge.desc) { // Check if challenge object is valid
          this.elements.dailyChallengeArea.innerHTML = `
              <h3 title="${this.escapeHTML(challenge.desc)}">${this.escapeHTML(challenge.title)} <button type="button" class="context-help-btn small-btn" data-help-key="dailyChallengeInfo">?</button></h3>
              <p>${this.escapeHTML(challenge.desc)}</p>`;
          this.elements.dailyChallengeSection.style.display = 'block';
      } else {
          this.elements.dailyChallengeArea.innerHTML = '<p class="muted-text">No challenge available.</p>';
          this.elements.dailyChallengeSection.style.display = 'block'; // Show section even if no challenge
      }
  } // End displayDailyChallenge

  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) {
      if (!this.elements.glossaryBody || !this.elements.glossaryModal) return;
      if (typeof glossaryTerms !== 'object' || Object.keys(glossaryTerms).length === 0) {
          this.elements.glossaryBody.innerHTML = "<p class='error-text'>Glossary unavailable.</p>";
          this.openModal(this.elements.glossaryModal);
          return;
      }

      let html = '<dl>';
      try {
          Object.entries(glossaryTerms)
              .sort((a, b) => (a[1]?.term || '').localeCompare(b[1]?.term || ''))
              .forEach(([key, termData]) => {
                  if (!termData || !termData.term) return; // Skip invalid entries
                  const termId = `gloss-term-${key}`;
                  const isHighlighted = key === termKeyToHighlight;
                  html += `<dt id="${termId}" tabindex="-1" class="${isHighlighted ? 'highlighted-term' : ''}">${this.escapeHTML(termData.term)}</dt>`;
                  html += `<dd>${this.escapeHTML(termData.definition || 'No definition.')}`;
                  if (Array.isArray(termData.related) && termData.related.length > 0) {
                      html += `<br><span class="related-terms">See also: `;
                      html += termData.related.map(relKey => {
                          const relatedTerm = glossaryTerms[relKey]?.term || relKey;
                          return `<a href="#gloss-term-${relKey}" class="glossary-link" data-term-key="${relKey}">${this.escapeHTML(relatedTerm)}</a>`;
                      }).join(', ');
                      html += `</span>`;
                  }
                  html += `</dd>`;
              });
          html += '</dl>';
      } catch (htmlError) {
          console.error("Error generating glossary HTML:", htmlError);
          html = "<p class='error-text'>Error loading glossary.</p>";
      }

      this.elements.glossaryBody.innerHTML = html;
      this.openModal(this.elements.glossaryModal);

      if (termKeyToHighlight) {
          const termElement = this.elements.glossaryBody.querySelector(`#gloss-term-${termKeyToHighlight}`);
          requestAnimationFrame(() => {
              termElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              termElement?.focus();
          });
      }
  } // End showGlossary

  showStyleDiscovery(styleNameToHighlight = null) {
     if (!this.elements.styleDiscoveryModal || !this.elements.styleDiscoveryBody) return;
     // Reset filter on open unless highlighting
     if (this.elements.styleDiscoveryRoleFilter && !styleNameToHighlight) {
        this.elements.styleDiscoveryRoleFilter.value = 'all';
     }
     this.renderStyleDiscoveryContent(styleNameToHighlight);
     this.openModal(this.elements.styleDiscoveryModal);

     // Highlight and scroll logic remains the same
     const cleanHighlightName = styleNameToHighlight?.replace(/(\p{Emoji})/gu, '').trim();
     if (cleanHighlightName) {
         requestAnimationFrame(() => {
             const styleElement = this.elements.styleDiscoveryBody.querySelector(`[data-style-name="${this.escapeHTML(cleanHighlightName)}"]`);
             if (styleElement) {
                 styleElement.classList.add('highlighted-style');
                 styleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 styleElement.focus({ preventScroll: true });
                 setTimeout(() => styleElement.classList.remove('highlighted-style'), 2500);
             } else {
                 console.warn(`Style Discovery: Element to highlight not found: ${cleanHighlightName}`);
             }
         });
     }
  } // End showStyleDiscovery

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
    const body = this.elements.styleDiscoveryBody;
    const roleFilter = this.elements.styleDiscoveryRoleFilter?.value || 'all';
    if (!body) return;
    body.innerHTML = '<p class="loading-text">Loading styles...</p>';

    let stylesToDisplay = [];
    ['submissive', 'dominant', 'switch'].forEach(roleKey => {
        if (roleFilter === 'all' || roleFilter === roleKey) {
            stylesToDisplay.push(...(bdsmData[roleKey]?.styles || []));
        }
    });

    if (stylesToDisplay.length === 0) {
        body.innerHTML = '<p class="muted-text">No styles found matching filter.</p>';
        return;
    }

    // Enhance style data with descriptions and matches
    stylesToDisplay = stylesToDisplay.map(style => {
        if (!style || !style.name) return null; // Skip invalid styles
        const cleanName = style.name.replace(/(\p{Emoji})/gu, '').trim();
        const descData = this.sfStyleDescriptions[cleanName] || {};
        const matchData = this.sfDynamicMatches[cleanName] || {};
        const role = Object.keys(bdsmData).find(r => bdsmData[r]?.styles?.some(s => s.name === style.name)); // Find role
        return {
            ...style,
            role: role || 'N/A',
            cleanName: cleanName,
            fullDesc: descData.long || "No detailed description available.",
            tips: descData.tips || [],
            match: matchData.match || "N/A",
            dynamic: matchData.dynamic || "N/A"
        };
    }).filter(Boolean); // Remove nulls from invalid styles

    stylesToDisplay.sort((a, b) => a.name.localeCompare(b.name));

    const cleanHighlightName = styleNameToHighlight?.replace(/(\p{Emoji})/gu, '').trim();
    let html = stylesToDisplay.map(style => {
        const isHighlighted = style.cleanName === cleanHighlightName;
        return `
         <div class="style-discovery-item ${isHighlighted ? 'highlighted-style' : ''}" data-style-name="${this.escapeHTML(style.cleanName)}" tabindex="-1">
           <h4>${this.escapeHTML(style.name)} <small>(${this.escapeHTML(style.role)})</small></h4>
           <p><em>${this.escapeHTML(style.summary || 'No summary.')}</em></p>
           <p>${this.escapeHTML(style.fullDesc)}</p>
           ${style.tips.length > 0 ? `
             <details class="style-tips-details">
                 <summary>Show Tips (${style.tips.length})</summary>
                 <ul>${style.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}</ul>
             </details>` : ''}
           <p><small><strong>Match:</strong> ${this.escapeHTML(style.match)} | <strong>Dynamic:</strong> ${this.escapeHTML(style.dynamic)}</small></p>
         </div>
         <hr>`;
    }).join('');

    body.innerHTML = html || '<p class="muted-text">No styles loaded.</p>';
  } // End renderStyleDiscoveryContent


  // --- Data Import/Export ---
  exportData() { /* ... Keep existing logic ... */ }
  importData(event) { /* ... Keep existing logic ... */ }

  // --- Popups ---
  showTraitInfo(traitName){
      let explanation = "No detailed explanation available.";
      let displayName = traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1');

      // Try finding in bdsmData first (more specific)
      const roleKey = this.elements.role?.value;
      const styleName = this.elements.style?.value;
      let traitDefinition = null;
      if (roleKey && bdsmData[roleKey]) {
         const roleData = bdsmData[roleKey];
         traitDefinition = roleData.coreTraits?.find(t => t.name === traitName);
         if (!traitDefinition && styleName && Array.isArray(roleData.styles)) {
             const cleanStyleName = styleName.replace(/(\p{Emoji})/gu, '').trim();
             const styleObj = roleData.styles.find(s => s.name.replace(/(\p{Emoji})/gu, '').trim() === cleanStyleName);
             traitDefinition = styleObj?.traits?.find(t => t.name === traitName);
         }
      }

      if (traitDefinition?.explanation) {
          explanation = traitDefinition.explanation;
      } else if (this.sfTraitExplanations[traitName]) { // Fallback to Style Finder explanations
          explanation = this.sfTraitExplanations[traitName];
      } else if (glossaryTerms[traitName]) { // Fallback to Glossary
          explanation = glossaryTerms[traitName].definition;
      }

      if (this.elements.traitInfoPopup && this.elements.traitInfoTitle && this.elements.traitInfoBody) {
          this.elements.traitInfoTitle.textContent = displayName;
          this.elements.traitInfoBody.innerHTML = `<p>${this.escapeHTML(explanation)}</p>`;
          this.elements.traitInfoPopup.style.display = 'block';
          this.elements.traitInfoPopup.setAttribute('aria-hidden', 'false');
          requestAnimationFrame(() => this.elements.traitInfoClose?.focus());
          // Grant achievement (can grant multiple times, that's okay)
          const person = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : {};
          grantAchievement(person || {}, 'trait_info_viewed'); // Grant even if not editing
          localStorage.setItem('kinkCompass_trait_info_viewed', 'true');
      } else {
          console.error("Trait info popup elements not found.");
      }
  } // End showTraitInfo
  hideTraitInfo(){ /* ... Keep existing logic ... */ }
  showContextHelp(helpKey) { /* ... Keep existing logic ... */ }
  hideContextHelp() { /* ... Keep existing logic ... */ }

  // --- Style Finder Methods ---
  sfStart() { /* ... Keep existing logic ... */ }
  sfClose() { /* ... Keep existing logic ... */ }
  sfCalculateSteps() { /* ... Keep existing logic ... */ }
  sfRenderStep() { /* ... Keep existing logic ... */ }
  sfSetRole(role) { /* ... Keep existing logic ... */ }
  sfSetTrait(trait, value) { /* ... Keep existing logic ... */ }
  sfNextStep(currentTrait = null) { /* ... Keep existing logic ... */ }
  sfPrevStep() { /* ... Keep existing logic ... */ }
  sfStartOver() { /* ... Keep existing logic ... */ }
  sfComputeScores() { /* ... Keep existing logic ... */ }
  sfUpdateDashboard(forceVisible = false) { /* ... Keep existing logic ... */ }
  toggleStyleFinderDashboard() { /* ... Keep existing logic ... */ }
  sfCalculateResult() { /* ... Keep existing logic ... */ }
  sfGenerateSummaryDashboard() { /* ... Keep existing logic ... */ }
  sfShowFeedback(message) { /* ... Keep existing logic ... */ }
  sfShowTraitInfo(traitName) { /* ... Keep existing logic ... */ }
  sfShowFullDetails(styleNameWithEmoji) { /* ... Keep existing logic ... */ }
  getStyleIcons() { /* ... Keep existing logic ... */ }
  confirmApplyStyleFinderResult(role, styleWithEmoji) { /* ... Keep existing logic ... */ }
  applyStyleFinderResult(role, styleWithEmoji) { /* ... Keep existing logic ... */ }

  // --- Other Helper Functions ---
  getFlairForScore(s) { /* ... Keep existing logic ... */ }
  getEmojiForScore(s) { /* ... Keep existing logic ... */ }
  escapeHTML(str){ const div=document.createElement('div'); div.textContent = str ?? ''; return div.innerHTML; }
  getIntroForStyle(styleName){
       if (!styleName) return null;
       const cleanStyleName = styleName.replace(/(\p{Emoji})/gu, '').trim();
       const descData = this.sfStyleDescriptions[cleanStyleName]; // Use SF descriptions
       // Try to get first sentence of the long description
       if (descData?.long) {
           const firstSentenceMatch = descData.long.match(/^.*?[.!?](?=\s|$)/); // Match up to first period/!/?
           if (firstSentenceMatch) {
                return `"${descData.short}" - ${firstSentenceMatch[0]}`;
           }
       }
       // Fallback to just the short description
       return descData?.short ? `"${descData.short}"` : null;
   } // End getIntroForStyle
  showNotification(message, type = 'info', duration = 4000) { /* ... Keep existing logic ... */ }

  // --- Theme Management ---
  applySavedTheme() { /* ... Keep existing logic ... */ }
  setTheme(themeName){ /* ... Keep existing logic ... */ }
  toggleTheme(){ /* ... Keep existing logic ... */ }

   // --- Modal Management ---
   openModal(modalElement) { /* ... Keep existing logic ... */ }
   closeModal(modalElement) { /* ... Keep existing logic ... */ }

   // <<< --- NEW HELPER FUNCTIONS --- >>>
   getSynergyHints(person) { /* ... Keep existing logic ... */ }
   getGoalAlignmentHints(person) { /* ... Keep existing logic ... */ }
   getDailyChallenge(persona = null) { /* ... Keep existing logic ... */ }
   getKinkOracleReading(person) { /* ... Keep existing logic ... */ }
   // --- Achievement Checkers ---
   checkGoalStreak(person) { /* ... Keep existing logic ... */ }
   checkTraitTransformation(person, currentSnapshot) { /* ... Keep existing logic ... */ }
   checkConsistentSnapper(person, currentTimestamp) { /* ... Keep existing logic ... */ }

} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: red; padding: 20px; border: 2px solid red; margin: 20px; background: white; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px;';
    errorDiv.innerHTML = `<strong>Fatal Error: KinkCompass could not start.</strong><br>${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}`;
    document.body.prepend(errorDiv);
}
