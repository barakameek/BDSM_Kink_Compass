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

    addEventListeners() {
    console.log("Adding event listeners...");

    // --- Form Elements ---
    this.elements.role?.addEventListener('change', (e) => { this.renderStyles(e.target.value); this.renderTraits(e.target.value, ''); this.elements.style.value = ''; this.updateLivePreview(); });
    this.elements.style?.addEventListener('change', (e) => { this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); });
    this.elements.name?.addEventListener('input', () => { this.updateLivePreview(); });
    this.elements.save?.addEventListener('click', () => { this.savePerson(); });
    this.elements.clearForm?.addEventListener('click', () => { this.resetForm(true); });
    this.elements.avatarPicker?.addEventListener('click', (e) => { if (e.target.classList.contains('avatar-btn')) { const selectedEmoji = e.target.dataset.emoji; this.elements.avatarInput.value = selectedEmoji; this.elements.avatarDisplay.textContent = selectedEmoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected')); e.target.classList.add('selected'); this.updateLivePreview(); } });
    this.elements.traitsContainer?.addEventListener('input', (e) => { if (e.target.classList.contains('trait-slider')) { this.handleTraitSliderInput(e); this.updateLivePreview(); } });
    this.elements.traitsContainer?.addEventListener('click', (e) => { if (e.target.classList.contains('trait-info-btn')) { this.handleTraitInfoClick(e); } });
    this.elements.formStyleFinderLink?.addEventListener('click', () => { this.sfStart(); }); // Listener for link within form

    // --- Popups & Context Help ---
    document.body.addEventListener('click', (e) => { if (e.target.classList.contains('context-help-btn')) { const helpKey = e.target.dataset.helpKey; if (helpKey) { this.showContextHelp(helpKey); } } });
    this.elements.traitInfoClose?.addEventListener('click', () => { this.hideTraitInfo(); });
    this.elements.contextHelpClose?.addEventListener('click', () => { this.hideContextHelp(); });

    // --- Persona List Interaction ---
    if (this.elements.peopleList) {
        this.elements.peopleList.addEventListener('click', (e) => this.handleListClick(e));
        this.elements.peopleList.addEventListener('keydown', (e) => this.handleListKeydown(e));
        console.log("LISTENER ADDED: People list click/keydown");
    } else {
        console.error("ELEMENT NOT FOUND: peopleList - List interactions will fail.");
    }

    // --- Modal Close Buttons ---
    this.elements.modalClose?.addEventListener('click', () => { this.closeModal(this.elements.modal); });
    this.elements.resourcesClose?.addEventListener('click', () => { this.closeModal(this.elements.resourcesModal); });
    this.elements.glossaryClose?.addEventListener('click', () => { this.closeModal(this.elements.glossaryModal); });
    this.elements.styleDiscoveryClose?.addEventListener('click', () => { this.closeModal(this.elements.styleDiscoveryModal); });
    this.elements.themesClose?.addEventListener('click', () => { this.closeModal(this.elements.themesModal); });
    this.elements.welcomeClose?.addEventListener('click', () => { this.closeModal(this.elements.welcomeModal); });
    this.elements.achievementsClose?.addEventListener('click', () => { this.closeModal(this.elements.achievementsModal); });
    this.elements.sfCloseBtn?.addEventListener('click', () => { this.sfClose(); }); // Style Finder close

    // --- Header/Feature Buttons ---
    if (this.elements.resourcesBtn) {
         this.elements.resourcesBtn.addEventListener('click', () => {
             grantAchievement({}, 'resource_reader'); // Grant even without person context
             localStorage.setItem('kinkCompass_resource_reader', 'true');
             this.openModal(this.elements.resourcesModal);
             console.log("Resources button clicked & listener active.");
         });
         console.log("LISTENER ADDED: Resources button");
    } else { console.error("ELEMENT NOT FOUND: resourcesBtn"); }

    if (this.elements.glossaryBtn) {
        this.elements.glossaryBtn.addEventListener('click', () => {
            grantAchievement({}, 'glossary_user');
            localStorage.setItem('kinkCompass_glossary_used', 'true');
            this.showGlossary();
            console.log("Glossary button clicked & listener active.");
        });
        console.log("LISTENER ADDED: Glossary button");
    } else { console.error("ELEMENT NOT FOUND: glossaryBtn"); }

    if (this.elements.styleDiscoveryBtn) {
         this.elements.styleDiscoveryBtn.addEventListener('click', () => {
             grantAchievement({}, 'style_discovery');
             this.showStyleDiscovery();
             console.log("Style Discovery button clicked & listener active.");
         });
         console.log("LISTENER ADDED: Style Discovery button");
    } else { console.error("ELEMENT NOT FOUND: styleDiscoveryBtn"); }

    if (this.elements.themesBtn) {
        this.elements.themesBtn.addEventListener('click', () => { this.openModal(this.elements.themesModal); console.log("Themes button clicked & listener active."); });
        console.log("LISTENER ADDED: Themes button");
    } else { console.error("ELEMENT NOT FOUND: themesBtn"); }

    if (this.elements.achievementsBtn) {
         this.elements.achievementsBtn.addEventListener('click', () => { this.showAchievements(); console.log("Achievements button clicked & listener active."); });
         console.log("LISTENER ADDED: Achievements button");
    } else { console.error("ELEMENT NOT FOUND: achievementsBtn"); }

     if (this.elements.themeToggle) {
         this.elements.themeToggle.addEventListener('click', () => { this.toggleTheme(); console.log("Theme toggle clicked & listener active."); });
         console.log("LISTENER ADDED: Theme toggle");
    } else { console.error("ELEMENT NOT FOUND: themeToggle"); }

    if (this.elements.exportBtn) {
         this.elements.exportBtn.addEventListener('click', () => { this.exportData(); console.log("Export button clicked & listener active."); });
         console.log("LISTENER ADDED: Export button");
    } else { console.error("ELEMENT NOT FOUND: exportBtn"); }

    if (this.elements.importBtn) {
         this.elements.importBtn.addEventListener('click', () => { this.elements.importFileInput?.click(); console.log("Import button clicked & listener active."); });
         console.log("LISTENER ADDED: Import button");
    } else { console.error("ELEMENT NOT FOUND: importBtn"); }

    if (this.elements.importFileInput) {
        this.elements.importFileInput.addEventListener('change', (e) => { this.importData(e); });
        console.log("LISTENER ADDED: Import file input");
    } else { console.error("ELEMENT NOT FOUND: importFileInput"); }

    // --- Style Finder Trigger Button ---
    if (this.elements.styleFinderTriggerBtn) {
         this.elements.styleFinderTriggerBtn.addEventListener('click', () => { this.sfStart(); console.log("Style Finder Trigger button clicked & listener active."); });
         console.log("LISTENER ADDED: Style Finder Trigger button");
    } else { console.error("ELEMENT NOT FOUND: styleFinderTriggerBtn"); }

    // --- Other Listeners ---
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => { this.renderStyleDiscoveryContent(); });
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));
    this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e));
    this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e)); // Glossary links within glossary
    document.body.addEventListener('click', (e) => this.handleGlossaryLinkClick(e)); // Handle glossary links elsewhere if needed
    this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e));

    // Style Finder Modal Internal Listeners
    this.elements.sfStepContent?.addEventListener('click', (e) => {
         const button = e.target.closest('button');
         if (button) { // Check if click was on or inside a button
             if (button.classList.contains('sf-info-icon')) { // Specific check for info icon button
                 const traitName = button.dataset.trait;
                 if (traitName) this.sfShowTraitInfo(traitName);
             } else { // Handle other action buttons
                 const action = button.dataset.action;
                 if(action) this.handleStyleFinderAction(action, button.dataset);
             }
         }
    });
    this.elements.sfStepContent?.addEventListener('input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { this.handleStyleFinderSliderInput(e.target); } });

    // Window Listeners (Keep these last)
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));
    window.addEventListener('click', (e) => this.handleWindowClick(e));

    console.log("Event listeners setup COMPLETE.");
  } // End addEventListeners

  // --- Event Handlers ---
  handleListClick(e) {
    console.log(">>> handleListClick triggered by:", e.target); // Log the specific target
    const target = e.target;
    const listItem = target.closest('li[data-id]'); // Ensure the LI has a data-id

    if (!listItem) {
        console.log("handleListClick: Clicked outside a valid LI.");
        return;
    }
    const personIdStr = listItem.dataset.id;
    const personId = parseInt(personIdStr, 10);

    if (isNaN(personId)) {
        console.warn("handleListClick: Could not parse valid person ID from list item dataset:", listItem.dataset);
        return;
    }

    console.log(`handleListClick: Processing click for personId: ${personId} on target:`, target);

    // Check if the click is specifically on the edit button *or within it*
    if (target.closest('.edit-btn')) {
        console.log("handleListClick: Edit button branch");
        this.editPerson(personId);
        return; // Action handled
    }

    // Check if the click is specifically on the delete button *or within it*
    if (target.closest('.delete-btn')) {
        console.log("handleListClick: Delete button branch");
        const personaName = listItem.querySelector('.person-name')?.textContent || 'this persona';
        if (confirm(`Are you sure you want to delete ${personaName}? This cannot be undone.`)) {
            this.deletePerson(personId);
        }
        return; // Action handled
    }

    // Check if the click is on the main info area (but not the buttons)
    if (target.closest('.person-info')) {
        console.log("handleListClick: Person info branch, calling showPersonDetails...");
        this.showPersonDetails(personId);
        return; // Action handled
    }

    // If the click was on the <li> itself but not handled above
    console.log("handleListClick: Click directly on LI or unhandled area within LI.");
    // Optionally, treat click on LI itself as click on person-info:
    // this.showPersonDetails(personId);

  } // End handleListClick

  handleListKeydown(e) {
      console.log(`>>> handleListKeydown triggered with key: ${e.key} on target:`, e.target);
      // Only handle Enter or Space keys
      if (e.key !== 'Enter' && e.key !== ' ') {
          return;
      }

      const target = e.target;
      // We only care if the focused element is an LI or inside one
      const listItem = target.closest('li[data-id]');

      if (!listItem) {
           console.log("handleListKeydown: Keydown not on a relevant list item.");
           return;
      }

      // Check if the focused element is one of the buttons
      if (target.classList.contains('edit-btn') || target.classList.contains('delete-btn')) {
          console.log("handleListKeydown: Activating button via keypress.");
          e.preventDefault(); // Prevent default spacebar scroll or enter action
          target.click(); // Simulate a click on the button
      }
      // Check if the focus is generally on the list item or its info area (and key is Enter)
      else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) {
           console.log("handleListKeydown: Activating details view via Enter.");
           e.preventDefault();
           const personIdStr = listItem.dataset.id;
           const personId = parseInt(personIdStr, 10);
           if (!isNaN(personId)) {
               this.showPersonDetails(personId);
           } else {
                console.warn("Could not parse person ID for keydown details view:", listItem.dataset);
           }
      } else {
          console.log("handleListKeydown: Keypress on LI but not on actionable element or wrong key.");
      }
  } // End handleListKeydown

  handleWindowClick(e) {
     // Close Trait Info Popup if open and click is outside
     if (this.elements.traitInfoPopup && this.elements.traitInfoPopup.style.display !== 'none') {
         const popupContent = this.elements.traitInfoPopup.querySelector('.card'); // Assuming content is inside .card
         const infoButton = document.querySelector(`.trait-info-btn[aria-expanded="true"]`);
         // Check if click target is NOT the popup content AND NOT the button that opened it
         if (popupContent && !popupContent.contains(e.target) && e.target !== infoButton && !infoButton?.contains(e.target)) {
             this.hideTraitInfo();
         }
     }
     // Close Context Help Popup if open and click is outside
     if (this.elements.contextHelpPopup && this.elements.contextHelpPopup.style.display !== 'none') {
         const popupContent = this.elements.contextHelpPopup.querySelector('.card');
         const helpButton = document.querySelector(`.context-help-btn[aria-expanded="true"]`);
         if (popupContent && !popupContent.contains(e.target) && e.target !== helpButton && !helpButton?.contains(e.target)) {
             this.hideContextHelp();
         }
     }
      // Close Style Finder Popups if open and click is outside
      const activeSFPopup = document.querySelector('.sf-style-info-popup'); // Find any active SF popup
      if (activeSFPopup) {
          // Find the element that triggered the popup (might be an icon or a button)
          const triggerElement = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active');
          if (!activeSFPopup.contains(e.target) && e.target !== triggerElement && !triggerElement?.contains(e.target)) {
              activeSFPopup.remove(); // Remove the popup from the DOM
              triggerElement?.classList.remove('active'); // Remove active state from trigger
          }
      }
   } // End handleWindowClick

  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log("Escape key pressed - checking for open popups/modals...");
          // Close transient popups first
          if (this.elements.traitInfoPopup?.style.display !== 'none') { console.log("Closing Trait Info Popup"); this.hideTraitInfo(); return; }
          if (this.elements.contextHelpPopup?.style.display !== 'none') { console.log("Closing Context Help Popup"); this.hideContextHelp(); return; }
          const activeSFPopup = document.querySelector('.sf-style-info-popup');
          if (activeSFPopup) {
              console.log("Closing Style Finder Popup");
              activeSFPopup.remove();
              document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active');
              return;
          }
          // Then close major modals
          if (this.elements.modal?.style.display !== 'none') { console.log("Closing Detail Modal"); this.closeModal(this.elements.modal); return; }
          if (this.elements.sfModal?.style.display !== 'none') { console.log("Closing Style Finder Modal"); this.sfClose(); return; }
          if (this.elements.styleDiscoveryModal?.style.display !== 'none') { console.log("Closing Style Discovery Modal"); this.closeModal(this.elements.styleDiscoveryModal); return; }
          if (this.elements.glossaryModal?.style.display !== 'none') { console.log("Closing Glossary Modal"); this.closeModal(this.elements.glossaryModal); return; }
          if (this.elements.achievementsModal?.style.display !== 'none') { console.log("Closing Achievements Modal"); this.closeModal(this.elements.achievementsModal); return; }
          if (this.elements.resourcesModal?.style.display !== 'none') { console.log("Closing Resources Modal"); this.closeModal(this.elements.resourcesModal); return; }
          if (this.elements.themesModal?.style.display !== 'none') { console.log("Closing Themes Modal"); this.closeModal(this.elements.themesModal); return; }
          if (this.elements.welcomeModal?.style.display !== 'none') { console.log("Closing Welcome Modal"); this.closeModal(this.elements.welcomeModal); return; }
          console.log("Escape pressed, but no active modal/popup found to close.");
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
      if (!traitName) { console.warn("Trait info button clicked without data-trait attribute."); return; }
      this.showTraitInfo(traitName);
      // Manage ARIA states for accessibility
      document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
          if (btn !== button) btn.setAttribute('aria-expanded', 'false');
      });
      button.setAttribute('aria-expanded', 'true');
  } // End handleTraitInfoClick

  handleModalBodyClick(e) { // Consolidated handler for clicks WITHIN the detail modal body
    const personIdStr = this.elements.modal?.dataset.personId;
    if (!personIdStr) {
        // Should not happen if event listener is attached correctly, but good failsafe
        console.warn("handleModalBodyClick fired but no personId found on modal.");
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
                    this.toggleGoalStatus(personId, goalId, button.closest('li')); // Pass li for animation
                } else { console.warn("Invalid goalId on toggle button:", goalIdStr); }
            }
            return; // Action handled
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
            return; // Action handled
        }

         // Specific Button IDs within the modal body
         switch (button.id) {
            case 'snapshot-btn':
                console.log(`>>> Snapshot button clicked for person ${personId}`);
                this.addSnapshotToHistory(personId);
                return;
            case 'journal-prompt-btn':
                console.log(`>>> Journal Prompt button clicked for person ${personId}`);
                this.showJournalPrompt(personId);
                return;
            case 'save-reflections-btn':
                 console.log(`>>> Save Reflections button clicked for person ${personId}`);
                this.saveReflections(personId);
                return;
            case 'oracle-btn':
                 console.log(`>>> Oracle button clicked for person ${personId}`);
                this.showKinkOracle(personId);
                return;
            // Note: add-goal-btn is handled by the form's onsubmit, not here
         }
    } // End if(button)

    // Glossary Link Action (if implemented as buttons within modal body)
    if (target.classList.contains('glossary-link') && target.tagName === 'BUTTON') { // Check if it's a button glossary link
        e.preventDefault(); // Prevent default button action if any
        const termKey = target.dataset.termKey;
        if (termKey) {
            console.log(`>>> Glossary button link clicked inside modal for term: ${termKey}`);
            this.closeModal(this.elements.modal); // Close details modal first
            this.showGlossary(termKey); // Then open glossary scrolled
        }
        return; // Handled
    }

  } // End handleModalBodyClick

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button) {
          const themeName = button.dataset.theme;
          if (themeName) { // Ensure themeName exists
            console.log(`Setting theme to: ${themeName}`);
            this.setTheme(themeName);
            this.closeModal(this.elements.themesModal);
          } else {
            console.warn("Theme button clicked without data-theme attribute.");
          }
      }
  } // End handleThemeSelection

  handleStyleFinderAction(action, dataset = {}) {
     console.log(`SF Action: ${action}`, dataset); // Log action and data
     switch (action) {
        case 'start':
             this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference');
             if (this.sfStep === -1) this.sfStep = 1; // Fallback if step not found
             this.sfRenderStep();
             break;
        case 'next':
             // Ensure trait answer exists if on a trait step
             const currentStepConfig = this.sfSteps[this.sfStep];
             if (currentStepConfig?.type === 'trait' && dataset.trait && this.sfAnswers.traits[dataset.trait] === undefined) {
                 this.sfShowFeedback("Please adjust the slider before continuing!");
                 return; // Prevent moving next without answer
             }
             this.sfNextStep(dataset.trait);
             break;
        case 'prev':
             this.sfPrevStep();
             break;
        case 'setRole':
             if (dataset.value) this.sfSetRole(dataset.value);
             else console.warn("SF setRole action missing value.");
             break;
        case 'startOver':
             this.sfStartOver();
             break;
        case 'showDetails':
             if (dataset.value) {
                this.sfShowFullDetails(dataset.value);
                 // Manage active state for the button
                 document.querySelectorAll('.sf-result-buttons button.active').forEach(b => b.classList.remove('active'));
                 const detailsBtn = this.elements.sfStepContent?.querySelector(`button[data-action="showDetails"][data-value="${dataset.value}"]`);
                 detailsBtn?.classList.add('active');
             } else { console.warn("SF showDetails action missing value."); }
             break;
        case 'applyStyle':
             if (dataset.value && this.sfIdentifiedRole) {
                 this.confirmApplyStyleFinderResult(this.sfIdentifiedRole, dataset.value);
             } else { console.warn("SF applyStyle action missing value or identified role."); }
             break;
        case 'toggleDashboard':
             this.toggleStyleFinderDashboard();
             break;
        default:
             console.warn("Unknown Style Finder action:", action);
     }
  } // End handleStyleFinderAction

  handleStyleFinderSliderInput(sliderElement){
      if (!sliderElement) return;
      const traitName = sliderElement.dataset.trait;
      const value = sliderElement.value;
      const descriptionDiv = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`);

      if (traitName && value !== undefined && descriptionDiv && this.sfSliderDescriptions[traitName]) {
          const descriptions = this.sfSliderDescriptions[traitName];
          if (Array.isArray(descriptions) && descriptions.length === 10) {
              const index = parseInt(value, 10) - 1;
              if (index >= 0 && index < 10) {
                  descriptionDiv.textContent = descriptions[index];
                  this.sfSetTrait(traitName, value); // Update internal state
                  this.sfUpdateDashboard(); // Update live scores
              } else { console.error(`Invalid slider index ${index} for trait ${traitName}`); }
          } else { console.error(`Slider descriptions missing/invalid for trait: ${traitName}`); }
      } else {
          // Avoid warning spam if elements aren't ready yet
          if (this.elements.sfStepContent && this.elements.sfStepContent.innerHTML.length > 0) {
             console.warn("Missing elements/data for SF slider update:", {traitName, value, descriptionDivExists: !!descriptionDiv});
          }
      }
  } // End handleStyleFinderSliderInput

  handleDetailTabClick(e) {
      const link = e.target.closest('.tab-link');
      if (!link || link.classList.contains('active')) return; // Ignore clicks on already active tabs

      const tabId = link.dataset.tab;
      const personIdStr = this.elements.modal?.dataset.personId;
      if (!personIdStr || !tabId) return; // Ensure necessary data exists

      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) return;

      const person = this.people.find(p => p.id === personId);
      if (!person) return; // Ensure person exists

      console.log(`Switching to tab: ${tabId} for person ${personId}`);
      this.activeDetailModalTab = tabId; // Store the active tab ID

      // Update button states efficiently
      this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => {
          const isNowActive = t === link;
          t.classList.toggle('active', isNowActive);
          t.setAttribute('aria-selected', String(isNowActive));
          t.setAttribute('tabindex', isNowActive ? '0' : '-1');
      });

      // Update content pane visibility and render content
      this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => {
           const isTargetContent = c.id === tabId;
           c.classList.toggle('active', isTargetContent);
           c.style.display = isTargetContent ? 'block' : 'none'; // Use block/none
           if (isTargetContent) {
                this.renderDetailTabContent(person, tabId, c); // Render content *before* focusing
                // Focus the content pane itself after rendering
                requestAnimationFrame(() => {
                    c.setAttribute('tabindex', '0'); // Temporarily make focusable
                    c.focus({ preventScroll: true });
                    c.removeAttribute('tabindex'); // Remove after focus if not normally needed
                });
           }
      });
  } // End handleDetailTabClick

   handleGlossaryLinkClick(e) {
       // Check if the click originated from *within* the glossary modal itself
       if (e.target.closest('#glossary-modal')) {
           const link = e.target.closest('a.glossary-link'); // Only handle actual links here
           if (link) {
               e.preventDefault();
               const termKey = link.dataset.termKey;
               const termElement = this.elements.glossaryBody?.querySelector(`#gloss-term-${termKey}`);
               if (termElement) {
                   console.log(`>>> Glossary internal link clicked: ${termKey}`);
                   this.elements.glossaryBody.querySelectorAll('.highlighted-term').forEach(el => el.classList.remove('highlighted-term'));
                   termElement.classList.add('highlighted-term');
                   termElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                   termElement.focus(); // Focus the heading
               } else {
                   console.warn(`Glossary term element not found for key: ${termKey}`);
               }
           }
       }
       // Clicks on glossary buttons outside the modal (like in trait list) are handled by handleModalBodyClick
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
    const selectElement = this.elements.style;
    if (!selectElement) { /* ... error handling ... */ return; }
    selectElement.innerHTML = '<option value="">-- Select a Style --</option>';
    if (!bdsmData || !bdsmData[roleKey]?.styles || !Array.isArray(bdsmData[roleKey].styles)) {
         selectElement.disabled = true;
         console.warn(`No valid styles found for role: ${roleKey}`);
         return;
    }
    const styles = bdsmData[roleKey].styles;
    styles
        .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
        .forEach(style => {
            if (style?.name) {
                const escapedName = this.escapeHTML(style.name);
                selectElement.innerHTML += `<option value="${escapedName}">${escapedName}</option>`;
            }
        });
    selectElement.disabled = false;
    this.updateStyleExploreLink();
  } // End renderStyles

  renderTraits(roleKey, styleName) {
    const container = this.elements.traitsContainer;
    const messageDiv = this.elements.traitsMessage;
    if (!container || !messageDiv) return;

    container.innerHTML = '';
    container.style.display = 'none';
    messageDiv.style.display = 'block';
    messageDiv.textContent = 'Select Role & Style to customize traits.';

    if (!roleKey || !styleName || !bdsmData || !bdsmData[roleKey]) {
         console.log("RenderTraits: Role, Style, or base data missing.");
         return;
    }

    const roleData = bdsmData[roleKey];
    const styleObj = roleData.styles?.find(s => s.name === styleName); // Match full name including emoji

    if (!styleObj) {
         messageDiv.textContent = `Details for '${styleName}' not found.`;
         console.warn(`Style object not found for: ${styleName} in role ${roleKey}`);
         return;
    }

    messageDiv.style.display = 'none';
    container.style.display = 'block';

    let traitsToRender = [];
    if (roleData.coreTraits && Array.isArray(roleData.coreTraits)) {
        traitsToRender.push(...roleData.coreTraits);
    }
    if (styleObj.traits && Array.isArray(styleObj.traits)) {
        styleObj.traits.forEach(styleTrait => {
            if (styleTrait?.name && !traitsToRender.some(core => core.name === styleTrait.name)) {
                traitsToRender.push(styleTrait);
            }
        });
    }

    if (traitsToRender.length === 0) {
        container.innerHTML = `<p class="muted-text">No traits defined for ${this.escapeHTML(styleName)}.</p>`;
        return;
    }

    traitsToRender.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    traitsToRender.forEach(trait => container.innerHTML += this.createTraitHTML(trait));

    // Apply saved/default values
    const personTraits = this.currentEditId ? this.people.find(p => p.id === this.currentEditId)?.traits : null;
    container.querySelectorAll('.trait-slider').forEach(slider => {
        const traitName = slider.dataset.trait;
        const savedValue = personTraits ? personTraits[traitName] : null;
        if (savedValue !== undefined && savedValue !== null) {
            slider.value = savedValue;
            const display = slider.closest('.trait')?.querySelector('.trait-value');
            if (display) display.textContent = savedValue;
        }
        this.updateTraitDescription(slider); // Update description based on current value
    });
 } // End renderTraits

 createTraitHTML(trait) {
    if (!trait || !trait.name || !trait.desc || typeof trait.desc !== 'object') return '<p class="error-text">Bad trait def</p>';
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1).replace(/([A-Z])/g, ' $1');
    const defaultValue = 3;
    const descriptionId = `desc-${trait.name}`;
    const sliderId = `slider-${trait.name}`;
    const labelId = `label-${trait.name}`;
    const valueDescription = this.escapeHTML(trait.desc[String(defaultValue)] || "N/A");

    return `
      <div class="trait">
        <label id="${labelId}" for="${sliderId}" class="trait-label">
          ${this.escapeHTML(displayName)}
          <button type="button" class="trait-info-btn small-btn" data-trait="${trait.name}">?</button>
        </label>
        <div class="slider-container">
             <input type="range" id="${sliderId}" class="trait-slider" min="1" max="5" value="${defaultValue}" data-trait="${trait.name}" aria-labelledby="${labelId}" aria-describedby="${descriptionId}">
             <span class="trait-value" data-trait="${trait.name}" aria-live="polite">${defaultValue}</span>
        </div>
        <p class="trait-desc muted-text" id="${descriptionId}">${valueDescription}</p>
      </div>`;
  } // End createTraitHTML

 updateTraitDescription(slider) {
    if (!slider) return;
    const traitName = slider.dataset.trait;
    const value = slider.value;
    const descElement = slider.closest('.trait')?.querySelector('.trait-desc');
    if (!traitName || !value || !descElement) return;

    const roleKey = this.elements.role?.value;
    const styleName = this.elements.style?.value; // Use full name
    if (!roleKey || !bdsmData || !bdsmData[roleKey]) return;

    const roleData = bdsmData[roleKey];
    let traitDefinition = roleData.coreTraits?.find(t => t.name === traitName);
    if (!traitDefinition && styleName) {
        const styleObj = roleData.styles?.find(s => s.name === styleName); // Match full name
        traitDefinition = styleObj?.traits?.find(t => t.name === traitName);
    }

    if (traitDefinition?.desc?.[value]) { // Check nested properties safely
        descElement.textContent = this.escapeHTML(traitDefinition.desc[value]);
    } else {
        descElement.textContent = "Description unavailable.";
    }
 } // End updateTraitDescription

  renderList() {
      const listElement = this.elements.peopleList;
      if (!listElement) return;
      this.displayDailyChallenge(); // Refresh challenge
      if (this.people.length === 0) {
          listElement.innerHTML = '<li>No personas yet. Create one!</li>';
          return;
      }
      listElement.innerHTML = this.people
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map(person => this.createPersonListItemHTML(person))
          .join('');

      if (this.lastSavedId) {
          const newItem = listElement.querySelector(`li[data-id="${this.lastSavedId}"]`);
          if (newItem) {
              newItem.classList.add('item-just-saved');
              setTimeout(() => newItem.classList.remove('item-just-saved'), 1500);
          }
          this.lastSavedId = null;
      }
  } // End renderList

  createPersonListItemHTML(person) {
    const roleData = bdsmData[person.role];
    const styleObj = roleData?.styles?.find(s => s.name === person.style); // Match full name

    let avgScore = 3;
    if (person.traits && Object.keys(person.traits).length > 0) { /* ... avg calc ... */ }
    const flair = this.getFlairForScore(avgScore);
    const achievementIcons = person.achievements
        ?.map(id => achievementList[id]?.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0])
        .filter(Boolean).slice(0, 3).join('') || '';

    const escapedName = this.escapeHTML(person.name || 'Unnamed');
    const escapedStyle = this.escapeHTML(person.style || 'N/A');
    const escapedRole = this.escapeHTML(person.role || 'N/A');

    return `
      <li data-id="${person.id}" tabindex="0">
        <div class="person-info" role="button" aria-label="View ${escapedName}">
          <span class="person-avatar">${person.avatar || '❓'}</span>
          <div class="person-name-details">
            <span class="person-name">${escapedName} <span class="person-flair">${flair}</span></span>
            <span class="person-details muted-text">${escapedStyle} (${escapedRole}) ${achievementIcons ? `<span class="person-achievements-preview">${achievementIcons}</span>` : ''}</span>
          </div>
        </div>
        <div class="person-actions">
          <button type="button" class="small-btn edit-btn">Edit</button>
          <button type="button" class="small-btn delete-btn">Delete</button>
        </div>
      </li>`;
  } // End createPersonListItemHTML

  updateStyleExploreLink() { /* ... Keep existing logic ... */ }

  // --- CRUD ---
  savePerson() { /* ... Keep existing logic ... */ }
  editPerson(personId) { /* ... Keep existing logic ... */ }
  deletePerson(personId) { /* ... Keep existing logic ... */ }
  resetForm(isManualClear = false) { /* ... Keep existing logic ... */ }

  // --- Live Preview ---
  updateLivePreview() { /* ... Keep existing logic ... */ }

  // --- Modal Display ---
  showPersonDetails(personId) { /* ... Keep existing logic ... */ }
  renderDetailTabContent(person, tabId, contentElement) { /* ... Keep existing logic ... */ }

  // --- New Feature Logic ---
  addGoal(personId, formElement) { /* ... Keep existing logic ... */ }
  toggleGoalStatus(personId, goalId, listItemElement = null) { /* ... Keep existing logic ... */ }
  deleteGoal(personId, goalId) { /* ... Keep existing logic ... */ }
  renderGoalList(person) { /* ... Keep existing logic ... */ }
  showJournalPrompt(personId) { /* ... Keep existing logic ... */ }
  saveReflections(personId) { /* ... Keep existing logic ... */ }
  addSnapshotToHistory(personId) { /* ... Keep existing logic ... */ }
  renderHistoryChart(person, canvasId) { /* ... Keep existing logic ... */ }
  toggleSnapshotInfo(button) { /* ... Keep existing logic ... */ }
  renderAchievementsList(person, listElementId) { /* ... Keep existing logic ... */ }
  showAchievements() { /* ... Keep existing logic ... */ }
  showKinkOracle(personId) { /* ... Keep existing logic ... */ }
  displayDailyChallenge() { /* ... Keep existing logic ... */ }

  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) { /* ... Keep existing logic ... */ }
  showStyleDiscovery(styleNameToHighlight = null) { /* ... Keep existing logic ... */ }
  renderStyleDiscoveryContent(styleNameToHighlight = null) { /* ... Keep existing logic ... */ }

  // --- Data Import/Export ---
  exportData() { /* ... Keep existing logic ... */ }
  importData(event) { /* ... Keep existing logic ... */ }

  // --- Popups ---
  showTraitInfo(traitName){ /* ... Keep existing logic ... */ }
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
  getIntroForStyle(styleName){ /* ... Keep existing logic ... */ }
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
