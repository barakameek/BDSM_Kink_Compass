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
// (Keep existing data checks - ensures imports are working)
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
    console.log("CONSTRUCTOR: Starting KinkCompass App (v2.5)...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;

    // Style Finder State
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
    // Style Finder Data Structures
    this.sfStyles = {
      submissive: [ 'Classic Submissive 🙇‍♀️', 'Brat 😈', 'Slave 🔗', 'Pet 🐾', 'Little 🍼', 'Puppy 🐶', 'Kitten 🐱', 'Princess 👑', 'Rope Bunny 🪢', 'Masochist 💥', 'Prey 🏃‍♀️', 'Toy 🎲', 'Doll 🎎', 'Bunny 🐰', 'Servant 🧹', 'Playmate 🎉', 'Babygirl 🌸', 'Captive ⛓️', 'Thrall 🛐', 'Puppet 🎭', 'Maid 🧼', 'Painslut 🔥', 'Bottom ⬇️' ],
      dominant: [ 'Classic Dominant 👑', 'Assertive 💪', 'Nurturer 🤗', 'Strict 📏', 'Master 🎓', 'Mistress 👸', 'Daddy 👨‍🏫', 'Mommy 👩‍🏫', 'Owner 🔑', 'Rigger 🧵', 'Sadist 😏', 'Hunter 🏹', 'Trainer 🏋️‍♂️', 'Puppeteer 🕹️', 'Protector 🛡️', 'Disciplinarian ✋', 'Caretaker 🧡', 'Sir 🎩', 'Goddess 🌟', 'Commander ⚔️' ],
      switch: [ 'Fluid Switch 🌊', 'Dominant-Leaning Switch 👑↔️', 'Submissive-Leaning Switch 🙇‍♀️↔️', 'Situational Switch 🤔']
    };
    this.sfSubFinderTraits = [ { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' }, { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' }, { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' }, { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' }, { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' }, { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' }, { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' }, { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' }, { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' }, { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' }, { name: 'painTolerance', desc: 'How do you feel about physical discomfort or pain during play?' }, { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' }, { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' }, { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' }, { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' }, { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' }, { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' }, { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' }, { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' } ];
    this.sfSubTraitFootnotes = { obedience: "1: Rarely follows / 10: Always obeys", rebellion: "1: Very compliant / 10: Loves to resist", service: "1: Self-focused / 10: Service-driven", playfulness: "1: Serious / 10: Super playful", sensuality: "1: Not sensory / 10: Highly sensual", exploration: "1: Stays safe / 10: Seeks adventure", devotion: "1: Independent / 10: Deeply devoted", innocence: "1: Mature / 10: Very innocent", mischief: "1: Calm / 10: Mischievous", affection: "1: Distant / 10: Super affectionate", painTolerance: "1: Avoids pain / 10: Embraces sensation", submissionDepth: "1: Light submission / 10: Total surrender", dependence: "1: Self-reliant / 10: Loves guidance", vulnerability: "1: Guarded / 10: Fully open", adaptability: "1: Fixed role / 10: Very versatile", tidiness: "1: Messy and carefree / 10: Obsessed with order", politeness: "1: Casual and blunt / 10: Always courteous", craving: "1: Avoids intensity / 10: Seeks extreme thrills", receptiveness: "1: Closed off / 10: Fully open to input" };
    this.sfDomFinderTraits = [ { name: 'authority', desc: 'Do you feel strong when you take charge?' }, { name: 'confidence', desc: 'Are you sure of your decisions?' }, { name: 'discipline', desc: 'Do you enjoy setting firm rules?' }, { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' }, { name: 'care', desc: 'Do you love supporting and protecting others?' }, { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' }, { name: 'control', desc: 'Do you thrive on directing every detail?' }, { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' }, { name: 'precision', desc: 'Are you careful with every step you take?' }, { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' }, { name: 'sadism', desc: 'Does giving a little consensual pain excite you?' }, { name: 'leadership', desc: 'Do you naturally guide others forward?' }, { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' }, { name: 'patience', desc: 'Are you calm while teaching or training?' }, { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' } ];
    this.sfDomTraitFootnotes = { authority: "1: Gentle / 10: Very commanding", confidence: "1: Hesitant / 10: Rock-solid", discipline: "1: Relaxed / 10: Strict", boldness: "1: Cautious / 10: Fearless", care: "1: Detached / 10: Deeply caring", empathy: "1: Distant / 10: Highly intuitive", control: "1: Hands-off / 10: Total control", creativity: "1: Routine / 10: Very creative", precision: "1: Casual / 10: Meticulous", intensity: "1: Soft / 10: Intense", sadism: "1: Avoids giving pain / 10: Enjoys giving pain", leadership: "1: Follower / 10: Natural leader", possession: "1: Shares / 10: Very possessive", patience: "1: Impatient / 10: Very patient", dominanceDepth: "1: Light control / 10: Full dominance" };
    this.sfSliderDescriptions = { obedience: [ "You dodge orders like a breeze!", "Rules? You’re too free for that!", "You’ll follow if it’s fun!", "A little “yes” slips out sometimes!", "You’re cool with gentle guidance!", "Following feels kinda nice!", "You like pleasing when asked!", "Obeying’s your quiet joy!", "You love a sweet “please”!", "You glow when you say “yes”!" ], rebellion: [ "You’re too sweet to say no!", "A tiny “nah” sneaks out!", "You nudge rules with a smile!", "Teasing’s your little game!", "Half yes, half no—cute!", "You push back with charm!", "Defiance is your sparkle!", "You love a playful “no”!", "Rebel vibes all the way!", "You’re a cheeky star!" ], service: [ "Helping? You’re too chill!", "A quick favor’s enough!", "You help if they’re sweet!", "You pitch in when it’s easy!", "Serving’s okay sometimes!", "You like making them smile!", "Helping’s your happy place!", "You love a kind task!", "You’re a service sweetie!", "Caring’s your superpower!" ], playfulness: [ "Serious is your vibe!", "A giggle slips out!", "You play if it’s light!", "Half serious, half silly!", "You’re warming up to fun!", "Playtime’s your joy!", "You bounce with glee!", "Silly’s your middle name!", "You’re a playful whirlwind!", "Games are your world!" ], sensuality: [ "Touch? Not your thing!", "A soft pat’s okay!", "You like a little feel!", "Textures are kinda neat!", "You’re into soft vibes!", "Silk makes you happy!", "You love a sensory tickle!", "Touch is your bliss!", "You’re all about feels!", "Sensory queen!" ], exploration: [ "Safe is your spot!", "A tiny step out—shy!", "You peek at new stuff!", "You’ll try if it’s safe!", "Half cozy, half curious!", "New things excite you!", "You chase the unknown!", "Adventure’s your jam!", "You’re a bold explorer!", "Nothing stops you!" ], devotion: [ "Free and solo!", "A bit of heart shows!", "You care if they’re near!", "Half free, half true!", "You’re warming up!", "Devotion’s your glow!", "You’re all in soft!", "Loyalty’s your core!", "You’re a devotion gem!", "Total soulmate!" ], innocence: [ "Wise beyond your years!", "A bit of wonder peeks out!", "You’re half grown, half kid!", "Silly feels nice sometimes!", "You’re dipping into cute!", "Innocence is your vibe!", "You’re a sweet dreamer!", "Giggles are your song!", "You’re pure sunshine!", "Total kid at heart!" ], mischief: [ "Too good for tricks!", "A tiny prank slips!", "You stir if it’s safe!", "Half calm, half cheeky!", "You’re a sneaky spark!", "Mischief’s your game!", "You love a little chaos!", "Trouble’s your friend!", "You’re a mischief pro!", "Chaos queen!" ], affection: [ "Hugs? Not really!", "A quick cuddle’s fine!", "You like a soft touch!", "Half aloof, half warm!", "You’re into snuggles!", "Cuddles are your joy!", "You love closeness!", "Affection’s your glow!", "You’re a hug star!", "Total love bug!" ], painTolerance: [ "Ouch! Keep it gentle!", "A tiny sting is maybe okay?", "Discomfort can be interesting...", "You handle sensation well!", "The edge is exciting!", "You thrive on intensity!", "Bring on the challenge!", "Strong sensations feel good!", "You have high endurance!", "Pain can be pleasure!" ], submissionDepth: [ "You’re free as a bird!", "A little give peeks out!", "You bend if it’s chill!", "Half you, half them!", "You’re easing in!", "Surrender’s kinda fun!", "You dive in soft!", "Control’s theirs—yay!", "You’re all theirs!", "Total trust star!" ], dependence: [ "Solo’s your jam!", "A lean slips in!", "You lean if they’re nice!", "Half free, half clingy!", "You’re okay with help!", "Relying feels good!", "You love their lead!", "They’re your rock!", "You’re a lean-in pro!", "Total trust buddy!" ], vulnerability: [ "Walls up high!", "A peek slips out!", "You share if safe!", "Half guarded, half open!", "You’re softening up!", "Open’s your vibe!", "You bare it soft!", "Heart’s wide open!", "You’re a trust gem!", "Total soul sharer!" ], adaptability: [ "One way—you’re set!", "A tiny switch is fine!", "You bend a little!", "Half fixed, half fluid!", "You’re okay with change!", "Switching’s easy!", "You roll with it!", "Flex is your strength!", "You flip like a pro!", "Total chameleon!" ], tidiness: [ "Chaos is your friend!", "A little mess is fine!", "You tidy if asked nicely!", "Order’s okay sometimes!", "You like things neat-ish!", "Cleanliness feels good!", "You love a tidy space!", "Order is your joy!", "Spotless is your vibe!", "Perfection in every corner!" ], politeness: [ "You’re blunt and bold!", "A bit gruff but sweet!", "Polite if it’s easy!", "You’re nice when needed!", "Courtesy’s your thing!", "You’re a polite gem!", "Manners shine bright!", "Respect is your core!", "You’re super courteous!", "Politeness queen!" ], craving: [ "Calm is your zone!", "A tiny thrill is enough!", "You dip into intensity!", "Half chill, half wild!", "You like a strong spark!", "Intensity calls you!", "You chase the edge!", "Thrills are your fuel!", "You crave the extreme!", "Limitless seeker!" ], receptiveness: [ "You’re your own guide!", "A bit open if safe!", "You listen if it’s clear!", "Half closed, half open!", "You’re warming up!", "Openness feels right!", "You take it all in!", "Guidance is welcome!", "You’re a receiver pro!", "Totally in tune!" ], authority: [ "Soft and shy!", "A little lead peeks!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Authority’s your vibe!", "You lead with ease!", "You’re a strong guide!", "Boss mode on!", "Total commander!" ], confidence: [ "Quiet and unsure!", "A bit of bold shows!", "You’re sure if it’s easy!", "Half shy, half steady!", "You’re growing bold!", "Confidence shines!", "You trust your gut!", "You’re rock solid!", "Bold and bright!", "Total powerhouse!" ], discipline: [ "Free and wild!", "A rule slips in!", "You set soft lines!", "Half loose, half tight!", "You’re liking order!", "Discipline’s your jam!", "You keep it firm!", "Rules are your strength!", "You’re super strict!", "Total control!" ], boldness: [ "Careful and calm!", "A risk peeks out!", "You leap if safe!", "Half shy, half daring!", "You’re getting brave!", "Boldness is you!", "You dive right in!", "Fearless vibes!", "You’re a bold star!", "Total daredevil!" ], care: [ "Cool and aloof!", "A care slips out!", "You help if asked!", "Half chill, half warm!", "You’re a soft guide!", "Nurturing’s your glow!", "You protect with love!", "Care is your core!", "You’re a warm star!", "Total nurturer!" ], empathy: [ "Distant and chill!", "A feel peeks out!", "You get it if clear!", "Half aloof, half tuned!", "You’re sensing more!", "Empathy’s your gift!", "You feel it all!", "You’re in sync!", "You’re a heart reader!", "Total intuitive!" ], control: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Control’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ], precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ], intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ], sadism: [ "Too gentle for that!", "A teasing edge emerges.", "Finding fun in their reaction.", "Enjoying controlled discomfort.", "The line starts to blur...", "Thriving on their response.", "Intensity feels powerful.", "Pushing limits is thrilling.", "Mastering sensation play.", "Their reaction is everything." ], leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ], possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ], dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ] };
    this.sfTraitExplanations = { obedience: "How much you enjoy following instructions or rules. High = loves obeying; Low = prefers independence.", rebellion: "How much you like playfully resisting or teasing. High = loves defiance; Low = compliant.", service: "Joy derived from helping or performing tasks for others. High = service-driven; Low = self-focused.", playfulness: "Love for silly games, humor, and lightheartedness. High = very playful; Low = serious.", sensuality: "Appreciation for physical sensations, textures, touch. High = very sensory; Low = less focused on touch.", exploration: "Eagerness to try new experiences or push boundaries. High = adventurous; Low = prefers familiarity.", devotion: "Depth of loyalty and commitment to a partner. High = deeply devoted; Low = more independent.", innocence: "Enjoyment of feeling carefree, childlike, or pure. High = embraces innocence; Low = more mature.", mischief: "Enjoyment of stirring things up, pranks, or playful trouble. High = loves mischief; Low = calm.", affection: "Need for physical closeness, cuddles, and reassurance. High = very affectionate; Low = prefers space.", painTolerance: "How you perceive and react to physical discomfort or pain. High = finds interest/pleasure; Low = avoids pain.", submissionDepth: "Willingness to yield control to a partner. High = enjoys total surrender; Low = prefers light guidance.", dependence: "Comfort level in relying on a partner for guidance or decisions. High = enjoys dependence; Low = self-reliant.", vulnerability: "Ease and willingness to show emotional softness or weakness. High = very open; Low = guarded.", adaptability: "Ability to switch between roles or adjust to changing dynamics. High = very flexible; Low = prefers consistency.", tidiness: "Satisfaction derived from neatness and order. High = very tidy; Low = comfortable with mess.", politeness: "Natural inclination towards courteous and respectful behavior. High = very polite; Low = more direct/casual.", craving: "Desire for intense, extreme, or peak sensations/experiences. High = seeks intensity; Low = prefers calm.", receptiveness: "Openness to receiving direction, input, or sensation. High = very receptive; Low = more closed off.", authority: "Natural inclination and comfort in taking charge or leading. High = commanding; Low = prefers following.", confidence: "Self-assuredness in decisions and actions within a dynamic. High = very confident; Low = hesitant.", discipline: "Enjoyment in setting and enforcing rules or structure. High = strict; Low = relaxed.", boldness: "Willingness to take risks or face challenges head-on. High = fearless; Low = cautious.", care: "Focus on supporting, protecting, and nurturing a partner. High = deeply caring; Low = more detached.", empathy: "Ability to understand and connect with a partner's feelings. High = very empathetic; Low = more analytical.", control: "Desire to manage details, actions, or the environment. High = loves control; Low = prefers flow.", creativity: "Enjoyment in crafting unique scenarios, tasks, or experiences. High = very inventive; Low = prefers routine.", precision: "Focus on executing actions or commands meticulously. High = very precise; Low = more casual.", intensity: "The level of emotional or physical energy brought to the dynamic. High = very intense; Low = gentle.", sadism: "Deriving pleasure from consensually inflicting pain or discomfort. High = enjoys inflicting; Low = avoids inflicting.", leadership: "Natural ability to guide, direct, and inspire others. High = strong leader; Low = follower.", possession: "Feeling of ownership or strong connection ('mine') towards a partner. High = very possessive; Low = less possessive.", patience: "Ability to remain calm while guiding, teaching, or waiting. High = very patient; Low = impatient.", dominanceDepth: "Desire for the level of influence or control over a partner. High = seeks total influence; Low = prefers light control." };
    this.sfStyleKeyTraits = { 'Classic Submissive': ['obedience', 'service', 'receptiveness', 'trust'], 'Brat': ['rebellion', 'mischief', 'playfulness', 'painTolerance'], 'Slave': ['devotion', 'obedience', 'service', 'submissionDepth'], 'Pet': ['affection', 'playfulness', 'dependence', 'obedience'], 'Little': ['innocence', 'dependence', 'affection', 'playfulness'], 'Puppy': ['playfulness', 'obedience', 'affection'], 'Kitten': ['sensuality', 'mischief', 'affection', 'playfulness'], 'Princess': ['dependence', 'innocence', 'affection', 'sensuality'], 'Rope Bunny': ['receptiveness', 'sensuality', 'exploration', 'painTolerance'], 'Masochist': ['painTolerance', 'craving', 'receptiveness', 'submissionDepth'], 'Prey': ['exploration', 'vulnerability', 'rebellion'], 'Toy': ['receptiveness', 'adaptability', 'service'], 'Doll': ['sensuality', 'innocence', 'adaptability'], 'Bunny': ['innocence', 'affection', 'vulnerability'], 'Servant': ['service', 'obedience', 'tidiness', 'politeness'], 'Playmate': ['playfulness', 'exploration', 'adaptability'], 'Babygirl': ['innocence', 'dependence', 'affection', 'vulnerability'], 'Captive': ['submissionDepth', 'vulnerability', 'exploration'], 'Thrall': ['devotion', 'submissionDepth', 'receptiveness'], 'Puppet': ['obedience', 'receptiveness', 'adaptability'], 'Maid': ['service', 'tidiness', 'politeness', 'obedience'], 'Painslut': ['painTolerance', 'craving', 'receptiveness'], 'Bottom': ['receptiveness', 'submissionDepth', 'painTolerance'], 'Classic Dominant': ['authority', 'leadership', 'control', 'confidence', 'care'], 'Assertive': ['authority', 'confidence', 'leadership', 'boldness'], 'Nurturer': ['care', 'empathy', 'patience'], 'Strict': ['authority', 'discipline', 'control', 'precision'], 'Master': ['authority', 'dominanceDepth', 'control', 'possession'], 'Mistress': ['authority', 'creativity', 'control', 'confidence'], 'Daddy': ['care', 'authority', 'patience', 'possession'], 'Mommy': ['care', 'empathy', 'patience'], 'Owner': ['authority', 'possession', 'control', 'dominanceDepth'], 'Rigger': ['creativity', 'precision', 'control', 'patience', 'care'], 'Sadist': ['control', 'intensity', 'sadism', 'precision'], 'Hunter': ['boldness', 'intensity', 'control', 'leadership'], 'Trainer': ['discipline', 'patience', 'leadership'], 'Puppeteer': ['control', 'creativity', 'precision'], 'Protector': ['care', 'authority', 'boldness'], 'Disciplinarian': ['authority', 'discipline', 'control'], 'Caretaker': ['care', 'patience', 'empathy'], 'Sir': ['authority', 'leadership', 'politeness', 'discipline'], 'Goddess': ['authority', 'confidence', 'intensity', 'dominanceDepth'], 'Commander': ['authority', 'leadership', 'control', 'discipline', 'boldness'], 'Fluid Switch': ['adaptability', 'empathy', 'playfulness'], 'Dominant-Leaning Switch': ['adaptability', 'authority', 'confidence'], 'Submissive-Leaning Switch': ['adaptability', 'receptiveness', 'obedience'], 'Situational Switch': ['adaptability', 'communication', 'empathy'] };
    this.sfStyleDescriptions = { 'Classic Submissive': { short: "Thrives on guidance and trust.", long: "Finds joy in yielding to a partner's direction, embracing vulnerability and structure.", tips: ["Communicate limits clearly.", "Find a respectful partner.", "Explore submission levels."] }, 'Brat': { short: "Cheeky, loves pushing buttons.", long: "Delights in playful resistance, turning rules into games. Enjoys the thrill of being 'tamed'.", tips: ["Keep it fun.", "Pair with someone who enjoys the chase.", "Know boundaries for defiance."] }, /* ... other styles ... */ 'Situational Switch': { short: "Role depends on context/partner.", long: "Adapts role based on specific situations, partner dynamics, or current mood.", tips: ["Be clear about what influences your role choice.", "Negotiate roles per scene.", "Check in frequently."] } };
    this.sfDynamicMatches = { 'Classic Submissive': { dynamic: "Power Exchange", match: "Classic Dominant", desc: "Classic trust/guidance.", longDesc: "Mutual respect, clear roles." }, 'Brat': { dynamic: "Taming Play", match: "Disciplinarian/Strict", desc: "Cheeky push-pull.", longDesc: "Resistance meets firm control." }, /* ... other styles ... */ 'Situational Switch': { dynamic: "Contextual Dynamics", match: "Situational Switch/Communicative Partner", desc: "Adapting together.", longDesc: "Roles negotiated based on context." } };

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
      dailyChallengeArea: document.getElementById('daily-challenge-area'),
      dailyChallengeSection: document.getElementById('daily-challenge-section'),
    };

    console.log("CONSTRUCTOR: Elements mapped.");
    if (!this.elements.role || !this.elements.style) {
        console.error("CRITICAL ERROR: Role or Style dropdown element not found on page load.");
        return;
    }

    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role?.value || 'submissive');
    this.renderTraits(this.elements.role?.value, this.elements.style?.value);
    this.renderList();
    this.updateLivePreview();
    this.checkAndShowWelcome();
    this.displayDailyChallenge();
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() {
      try {
          const data = localStorage.getItem('kinkProfiles');
          const profiles = data ? JSON.parse(data) : [];
          this.people = profiles.map(p => ({
              id: p.id ?? Date.now() + Math.random(),
              name: p.name ?? "Unnamed",
              role: ['dominant', 'submissive', 'switch'].includes(p.role) ? p.role : 'submissive',
              style: p.style ?? "",
              avatar: p.avatar || '❓',
              traits: typeof p.traits === 'object' && p.traits !== null ? p.traits : {},
              goals: Array.isArray(p.goals) ? p.goals.map(g => ({ ...g, completedAt: g.completedAt || null })) : [],
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
          this.showNotification("Error saving data.", "error");
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
    this.elements.resourcesBtn?.addEventListener('click', () => { grantAchievement({}, 'resource_reader'); localStorage.setItem('kinkCompass_resource_reader', 'true'); this.openModal(this.elements.resourcesModal); console.log("Resources button clicked & listener active."); });
    this.elements.glossaryBtn?.addEventListener('click', () => { grantAchievement({}, 'glossary_user'); localStorage.setItem('kinkCompass_glossary_used', 'true'); this.showGlossary(); console.log("Glossary button clicked & listener active."); });
    this.elements.styleDiscoveryBtn?.addEventListener('click', () => { grantAchievement({}, 'style_discovery'); this.showStyleDiscovery(); console.log("Style Discovery button clicked & listener active."); });
    this.elements.themesBtn?.addEventListener('click', () => { this.openModal(this.elements.themesModal); console.log("Themes button clicked & listener active."); });
    this.elements.achievementsBtn?.addEventListener('click', () => { this.showAchievements(); console.log("Achievements button clicked & listener active."); });
    this.elements.themeToggle?.addEventListener('click', () => { this.toggleTheme(); console.log("Theme toggle clicked & listener active."); });
    this.elements.exportBtn?.addEventListener('click', () => { this.exportData(); console.log("Export button clicked & listener active."); });
    this.elements.importBtn?.addEventListener('click', () => { this.elements.importFileInput?.click(); console.log("Import button clicked & listener active."); });
    this.elements.importFileInput?.addEventListener('change', (e) => { this.importData(e); });
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => { this.sfStart(); console.log("Style Finder Trigger button clicked & listener active."); });
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => { this.renderStyleDiscoveryContent(); });
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));
    this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));
    this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e));
    this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));
    document.body.addEventListener('click', (e) => this.handleGlossaryLinkClick(e)); // For links outside modal
    this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e));
    this.elements.formStyleFinderLink?.addEventListener('click', () => { this.sfStart(); });
    this.elements.sfStepContent?.addEventListener('click', (e) => { const button = e.target.closest('button'); if (button) { if (button.classList.contains('sf-info-icon')) { const traitName = button.dataset.trait; if (traitName) this.sfShowTraitInfo(traitName); } else { const action = button.dataset.action; if(action) this.handleStyleFinderAction(action, button.dataset); } } });
    this.elements.sfStepContent?.addEventListener('input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { this.handleStyleFinderSliderInput(e.target); } });
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));
    window.addEventListener('click', (e) => this.handleWindowClick(e));
    console.log("Event listeners setup COMPLETE.");
  } // End addEventListeners

  // --- Event Handlers ---
  handleListClick(e) {
    console.log(">>> handleListClick triggered by:", e.target);
    const target = e.target;
    const listItem = target.closest('li[data-id]');
    if (!listItem) { console.log("handleListClick: Clicked outside a valid LI."); return; }
    const personIdStr = listItem.dataset.id;
    const personId = parseInt(personIdStr, 10);
    if (isNaN(personId)) { console.warn("handleListClick: Could not parse valid person ID:", personIdStr); return; }
    console.log(`handleListClick: Processing click for personId: ${personId} on target:`, target);
    if (target.closest('.edit-btn')) { console.log("handleListClick: Edit button branch"); this.editPerson(personId); }
    else if (target.closest('.delete-btn')) { console.log("handleListClick: Delete button branch"); const personaName = listItem.querySelector('.person-name')?.textContent || 'this persona'; if (confirm(`Delete ${personaName}?`)) { this.deletePerson(personId); } }
    else if (target.closest('.person-info')) { console.log("handleListClick: Person info branch -> showPersonDetails"); this.showPersonDetails(personId); }
    else { console.log("handleListClick: Click within LI but not on known target."); }
  } // End handleListClick

  handleListKeydown(e) {
      console.log(`>>> handleListKeydown key: ${e.key} on target:`, e.target);
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target;
      const listItem = target.closest('li[data-id]');
      if (!listItem) return;
      if (target.closest('.person-actions') && (target.classList.contains('edit-btn') || target.classList.contains('delete-btn'))) { console.log("handleListKeydown: Activating button"); e.preventDefault(); target.click(); }
      else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) { console.log("handleListKeydown: Activating details view"); e.preventDefault(); const personId = parseInt(listItem.dataset.id, 10); if (!isNaN(personId)) this.showPersonDetails(personId); }
  } // End handleListKeydown

  handleWindowClick(e) {
     if (this.elements.traitInfoPopup?.style.display !== 'none') { const popupContent = this.elements.traitInfoPopup.querySelector('.card'); const trigger = document.querySelector(`.trait-info-btn[aria-expanded="true"]`); if (popupContent && !popupContent.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) this.hideTraitInfo(); }
     if (this.elements.contextHelpPopup?.style.display !== 'none') { const popupContent = this.elements.contextHelpPopup.querySelector('.card'); const trigger = document.querySelector(`.context-help-btn[aria-expanded="true"]`); if (popupContent && !popupContent.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) this.hideContextHelp(); }
     const activeSFPopup = document.querySelector('.sf-style-info-popup'); if (activeSFPopup) { const trigger = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active'); if (!activeSFPopup.contains(e.target) && e.target !== trigger && !trigger?.contains(e.target)) { activeSFPopup.remove(); trigger?.classList.remove('active'); } }
   } // End handleWindowClick

  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log("Escape key pressed - checking...");
          if (this.elements.traitInfoPopup?.style.display !== 'none') { console.log("Closing Trait Info"); this.hideTraitInfo(); return; }
          if (this.elements.contextHelpPopup?.style.display !== 'none') { console.log("Closing Context Help"); this.hideContextHelp(); return; }
          const activeSFPopup = document.querySelector('.sf-style-info-popup'); if (activeSFPopup) { console.log("Closing SF Popup"); activeSFPopup.remove(); document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active'); return; }
          if (this.elements.modal?.style.display !== 'none') { console.log("Closing Detail Modal"); this.closeModal(this.elements.modal); return; }
          if (this.elements.sfModal?.style.display !== 'none') { console.log("Closing Style Finder"); this.sfClose(); return; }
          if (this.elements.styleDiscoveryModal?.style.display !== 'none') { console.log("Closing Style Discovery"); this.closeModal(this.elements.styleDiscoveryModal); return; }
          if (this.elements.glossaryModal?.style.display !== 'none') { console.log("Closing Glossary"); this.closeModal(this.elements.glossaryModal); return; }
          if (this.elements.achievementsModal?.style.display !== 'none') { console.log("Closing Achievements"); this.closeModal(this.elements.achievementsModal); return; }
          if (this.elements.resourcesModal?.style.display !== 'none') { console.log("Closing Resources"); this.closeModal(this.elements.resourcesModal); return; }
          if (this.elements.themesModal?.style.display !== 'none') { console.log("Closing Themes"); this.closeModal(this.elements.themesModal); return; }
          if (this.elements.welcomeModal?.style.display !== 'none') { console.log("Closing Welcome"); this.closeModal(this.elements.welcomeModal); return; }
          console.log("Escape pressed, no active modal/popup found.");
      }
  } // End handleWindowKeydown

  handleTraitSliderInput(e) {
      const slider = e.target;
      const display = slider.closest('.trait')?.querySelector('.trait-value');
      if (display) display.textContent = slider.value;
      this.updateTraitDescription(slider);
  } // End handleTraitSliderInput

  handleTraitInfoClick(e) {
      const button = e.target.closest('.trait-info-btn');
      if (!button) return;
      const traitName = button.dataset.trait;
      if (!traitName) return;
      this.showTraitInfo(traitName);
      document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => { if (btn !== button) btn.setAttribute('aria-expanded', 'false'); });
      button.setAttribute('aria-expanded', 'true');
  } // End handleTraitInfoClick

  handleModalBodyClick(e) { // Consolidated handler
    const personIdStr = this.elements.modal?.dataset.personId;
    if (!personIdStr) return;
    const personId = parseInt(personIdStr, 10);
    if (isNaN(personId)) { console.warn("Invalid personId:", personIdStr); return; }

    const target = e.target;
    const button = target.closest('button');

    if (button) { // Button-specific actions
        if (button.classList.contains('toggle-goal-btn')) {
            const goalId = parseInt(button.dataset.goalId, 10);
            if (!isNaN(goalId)) this.toggleGoalStatus(personId, goalId, button.closest('li'));
            return;
        }
        if (button.classList.contains('delete-goal-btn')) {
            const goalId = parseInt(button.dataset.goalId, 10);
            if (!isNaN(goalId) && confirm("Delete this goal?")) this.deleteGoal(personId, goalId);
            return;
        }
        switch (button.id) {
            case 'snapshot-btn': this.addSnapshotToHistory(personId); return;
            case 'journal-prompt-btn': this.showJournalPrompt(personId); return;
            case 'save-reflections-btn': this.saveReflections(personId); return;
            case 'oracle-btn': this.showKinkOracle(personId); return;
        }
        // Handle glossary button links inside modal body
        if (button.classList.contains('glossary-link')) {
            e.preventDefault();
            const termKey = button.dataset.termKey;
            if (termKey) { this.closeModal(this.elements.modal); this.showGlossary(termKey); }
            return;
        }
    }
    // Note: add-goal-btn action is handled by form onsubmit
  } // End handleModalBodyClick

  handleThemeSelection(e) {
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) { // Check button and theme exist
          this.setTheme(button.dataset.theme);
          this.closeModal(this.elements.themesModal);
      }
  } // End handleThemeSelection

  handleStyleFinderAction(action, dataset = {}) {
     console.log(`SF Action: ${action}`, dataset);
     switch (action) {
        case 'start':
             this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference') ?? 1;
             this.sfRenderStep(); break;
        case 'next':
             const currentStep = this.sfSteps[this.sfStep];
             if (currentStep?.type === 'trait' && dataset.trait && this.sfAnswers.traits[dataset.trait] === undefined) {
                 this.sfShowFeedback("Please adjust slider!"); return;
             }
             this.sfNextStep(dataset.trait); break;
        case 'prev': this.sfPrevStep(); break;
        case 'setRole': if (dataset.value) this.sfSetRole(dataset.value); break;
        case 'startOver': this.sfStartOver(); break;
        case 'showDetails': if (dataset.value) { this.sfShowFullDetails(dataset.value); document.querySelectorAll('.sf-result-buttons button.active').forEach(b => b.classList.remove('active')); e.target?.closest('button')?.classList.add('active'); } break;
        case 'applyStyle': if (dataset.value && this.sfIdentifiedRole) { this.confirmApplyStyleFinderResult(this.sfIdentifiedRole, dataset.value); } break;
        case 'toggleDashboard': this.toggleStyleFinderDashboard(); break;
        default: console.warn("Unknown SF action:", action);
     }
  } // End handleStyleFinderAction

  handleStyleFinderSliderInput(sliderElement){
      if (!sliderElement) return;
      const traitName = sliderElement.dataset.trait;
      const value = sliderElement.value;
      const descriptionDiv = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`);
      if (!traitName || value === undefined || !descriptionDiv || !this.sfSliderDescriptions[traitName]) return;
      const descriptions = this.sfSliderDescriptions[traitName];
      if (Array.isArray(descriptions) && descriptions.length === 10) {
          const index = parseInt(value, 10) - 1;
          if (index >= 0 && index < 10) {
              descriptionDiv.textContent = descriptions[index];
              this.sfSetTrait(traitName, value);
              this.sfUpdateDashboard();
          }
      }
  } // End handleStyleFinderSliderInput

  handleDetailTabClick(e) {
      const link = e.target.closest('.tab-link');
      if (!link || link.classList.contains('active')) return;
      const tabId = link.dataset.tab;
      const personIdStr = this.elements.modal?.dataset.personId;
      if (!personIdStr || !tabId) return;
      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) return;
      const person = this.people.find(p => p.id === personId);
      if (!person) return;

      console.log(`Switching to tab: ${tabId}`);
      this.activeDetailModalTab = tabId;

      this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => { /* Update ARIA/Class */ }); // Simplified for brevity
      link.classList.add('active'); link.setAttribute('aria-selected', 'true'); link.setAttribute('tabindex', '0');

      this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => { /* Update Display/Class */ }); // Simplified
      const contentPane = this.elements.modalBody.querySelector(`#${tabId}`);
      if (contentPane) {
          contentPane.style.display = 'block'; contentPane.classList.add('active');
          this.renderDetailTabContent(person, tabId, contentPane);
          requestAnimationFrame(() => { contentPane.focus({ preventScroll: true }); });
      }
  } // End handleDetailTabClick

   handleGlossaryLinkClick(e) {
       const link = e.target.closest('a.glossary-link, button.glossary-link');
       if (link) {
           // If inside glossary modal, handle scrolling
           if (link.closest('#glossary-modal')) {
               e.preventDefault();
               const termKey = link.dataset.termKey;
               const termElement = this.elements.glossaryBody?.querySelector(`#gloss-term-${termKey}`);
               if (termElement) {
                   this.elements.glossaryBody.querySelectorAll('.highlighted-term').forEach(el => el.classList.remove('highlighted-term'));
                   termElement.classList.add('highlighted-term');
                   termElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                   termElement.focus();
               }
           }
           // If NOT inside glossary modal, it might be handled by handleModalBodyClick if it was inside #detail-modal
           // Otherwise, standard link behavior applies or needs specific handling if desired elsewhere
       }
   } // End handleGlossaryLinkClick

  handleExploreStyleLinkClick(e) {
      e.preventDefault();
      const styleName = this.elements.style?.value;
      if (styleName) {
          this.showStyleDiscovery(styleName);
      }
  } // End handleExploreStyleLinkClick

  // --- Core Rendering ---
  renderStyles(roleKey) {
    const select = this.elements.style;
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Style --</option>';
    if (!bdsmData || !bdsmData[roleKey]?.styles) { select.disabled = true; return; }
    bdsmData[roleKey].styles
        .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
        .forEach(style => { if (style?.name) select.add(new Option(style.name, style.name)); });
    select.disabled = false;
    this.updateStyleExploreLink();
  } // End renderStyles

  renderTraits(roleKey, styleName) {
    const container = this.elements.traitsContainer, msgDiv = this.elements.traitsMessage;
    if (!container || !msgDiv) return;
    container.innerHTML = ''; container.style.display = 'none'; msgDiv.style.display = 'block';
    if (!roleKey || !styleName || !bdsmData || !bdsmData[roleKey]) { msgDiv.textContent = 'Select Role & Style.'; return; }
    const roleData = bdsmData[roleKey];
    const styleObj = roleData.styles?.find(s => s.name === styleName); // Match full name
    if (!styleObj) { msgDiv.textContent = `Details for '${styleName}' not found.`; return; }

    msgDiv.style.display = 'none'; container.style.display = 'block';
    let traits = [...(roleData.coreTraits || [])];
    styleObj.traits?.forEach(st => { if (st?.name && !traits.some(ct => ct.name === st.name)) traits.push(st); });
    if (traits.length === 0) { container.innerHTML = `<p>No traits for ${this.escapeHTML(styleName)}.</p>`; return; }
    traits.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    traits.forEach(trait => container.innerHTML += this.createTraitHTML(trait));
    // Apply values
    const pTraits = this.currentEditId ? this.people.find(p => p.id === this.currentEditId)?.traits : null;
    container.querySelectorAll('.trait-slider').forEach(s => { s.value = pTraits?.[s.dataset.trait] ?? 3; this.updateTraitDescription(s); const d = s.nextElementSibling; if(d) d.textContent = s.value; });
  } // End renderTraits

 createTraitHTML(trait) {
    if (!trait || !trait.name || !trait.desc || typeof trait.desc !== 'object') return '<p class="error">Bad trait</p>';
    const name = trait.name.charAt(0).toUpperCase() + trait.name.slice(1).replace(/([A-Z])/g, ' $1');
    const descId = `desc-${trait.name}`, sliderId = `slider-${trait.name}`, labelId = `label-${trait.name}`;
    const valDesc = this.escapeHTML(trait.desc['3'] || "N/A"); // Default desc for value 3
    return `<div class="trait"><label id="${labelId}" for="${sliderId}" class="trait-label">${this.escapeHTML(name)}<button type="button" class="trait-info-btn small-btn" data-trait="${trait.name}">?</button></label><div class="slider-container"><input type="range" id="${sliderId}" class="trait-slider" min="1" max="5" value="3" data-trait="${trait.name}" aria-labelledby="${labelId}" aria-describedby="${descId}"><span class="trait-value" data-trait="${trait.name}" aria-live="polite">3</span></div><p class="trait-desc muted-text" id="${descId}">${valDesc}</p></div>`;
 } // End createTraitHTML

 updateTraitDescription(slider) {
    if (!slider) return;
    const { trait: traitName, value } = slider.dataset; // Direct access assuming value is updated externally if needed, or use slider.value
    const currentVal = slider.value; // Get current slider value
    const descElement = slider.closest('.trait')?.querySelector('.trait-desc');
    if (!traitName || !currentVal || !descElement) return;

    const roleKey = this.elements.role?.value;
    const styleName = this.elements.style?.value;
    if (!roleKey || !bdsmData || !bdsmData[roleKey]) return;

    const roleData = bdsmData[roleKey];
    let traitDef = roleData.coreTraits?.find(t => t.name === traitName);
    if (!traitDef && styleName) {
        const styleObj = roleData.styles?.find(s => s.name === styleName);
        traitDef = styleObj?.traits?.find(t => t.name === traitName);
    }

    descElement.textContent = this.escapeHTML(traitDef?.desc?.[currentVal] || "N/A");
 } // End updateTraitDescription

  renderList() {
      const list = this.elements.peopleList; if (!list) return;
      this.displayDailyChallenge();
      list.innerHTML = this.people.length === 0 ? '<li>No personas yet.</li>'
          : this.people.sort((a, b) => (a.name||'').localeCompare(b.name||''))
                        .map(p => this.createPersonListItemHTML(p)).join('');
      if (this.lastSavedId) { const item = list.querySelector(`li[data-id="${this.lastSavedId}"]`); if(item) { item.classList.add('item-just-saved'); setTimeout(()=>item.classList.remove('item-just-saved'), 1500); } this.lastSavedId = null; }
  } // End renderList

  createPersonListItemHTML(person) {
    const flair = this.getFlairForScore(/* calculate avg score */ 3); // Simplified
    const icons = person.achievements?.map(id => achievementList[id]?.name?.match(/(\p{Emoji}|\u200d|\uFE0F)+/gu)?.[0]).filter(Boolean).slice(0,3).join('') || '';
    const name = this.escapeHTML(person.name || 'Unnamed');
    return `<li data-id="${person.id}" tabindex="0"><div class="person-info"><span class="person-avatar">${person.avatar||'❓'}</span><div class="person-name-details"><span class="person-name">${name} <span class="person-flair">${flair}</span></span><span class="person-details muted-text">${this.escapeHTML(person.style||'N/A')} (${this.escapeHTML(person.role||'N/A')}) ${icons ? `<span title="${person.achievements.length} A.">${icons}</span>` : ''}</span></div></div><div class="person-actions"><button type="button" class="small-btn edit-btn">Edit</button><button type="button" class="small-btn delete-btn">Delete</button></div></li>`;
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
  getFlairForScore(s) { return s>=5?'🌟':s>=4?'✨':s>=3?'👍':s>=2?'🌱':'🤔'; } // Simplified
  getEmojiForScore(s) { return s>=5?'🔥':s>=4?'💪':s>=3?'😊':s>=2?'👀':'💧'; } // Simplified
  escapeHTML(str){ const div=document.createElement('div'); div.textContent = str ?? ''; return div.innerHTML; }
  getIntroForStyle(styleName){ if(!styleName) return null; const clean=styleName.replace(/(\p{Emoji})/gu, '').trim(); const data=this.sfStyleDescriptions[clean]; const first=data?.long?.match(/^.*?[.!?](?=\s|$)/)?.[0]; return data?.short ? `"${data.short}"${first ? ` - ${first}`:''}` : null; }
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
