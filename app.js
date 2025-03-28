
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

    // Critical element check - Ensure role and style dropdowns exist
    if (!this.elements.role || !this.elements.style) {
        console.error("CRITICAL ERROR: Role or Style dropdown element not found on page load. Form functionality will be broken.");
        // Optionally display an error to the user
        document.body.insertAdjacentHTML('afterbegin', '<p style="color:red; background:white; padding:10px; border: 2px solid red;">Error: Core form elements missing. App cannot initialize correctly.</p>');
        // You might want to prevent further initialization if these are critical
        return; // Stop constructor if critical elements are missing
    }


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
  checkAndShowWelcome() {
    if (!localStorage.getItem('kinkCompassWelcomed')) {
      this.showWelcomeMessage();
    }
  }

  showWelcomeMessage() {
    if (this.elements.welcomeModal) {
      this.openModal(this.elements.welcomeModal);
      localStorage.setItem('kinkCompassWelcomed', 'true');
    } else {
      console.warn("Welcome modal element not found.");
    }
  }


  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("Adding event listeners...");

    // Form Interaction
    this.elements.role?.addEventListener('change', (e) => {
        console.log(">>> Role changed!"); // Log: Listener Fired
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, ''); // Clear traits when role changes
        this.elements.style.value = ''; // Reset style selection
        this.updateLivePreview();
    });
    this.elements.style?.addEventListener('change', (e) => {
        console.log(">>> Style changed!"); // Log: Listener Fired
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink();
    });
    this.elements.name?.addEventListener('input', () => {
        console.log(">>> Name input!"); // Log: Listener Fired
        this.updateLivePreview();
    });
    this.elements.save?.addEventListener('click', () => {
        console.log(">>> Save clicked!"); // Log: Listener Fired
        this.savePerson();
    });
    this.elements.clearForm?.addEventListener('click', () => {
        console.log(">>> Clear Form clicked!"); // Log: Listener Fired
        this.resetForm(true); // Pass true for manual clear
    });
    this.elements.avatarPicker?.addEventListener('click', (e) => {
        console.log(">>> Avatar Picker clicked!"); // Log: Listener Fired
        if (e.target.classList.contains('avatar-btn')) {
            const selectedEmoji = e.target.dataset.emoji;
            this.elements.avatarInput.value = selectedEmoji;
            this.elements.avatarDisplay.textContent = selectedEmoji;
            // Remove 'selected' class from all buttons, then add to the clicked one
            this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
            this.updateLivePreview();
        }
    });

     // Trait Sliders (Event Delegation on container)
    this.elements.traitsContainer?.addEventListener('input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            // console.log(">>> Trait slider input!"); // Log: Listener Fired (can be noisy)
            this.handleTraitSliderInput(e);
            this.updateLivePreview();
        }
    });

    // Trait Info Buttons (Event Delegation)
    this.elements.traitsContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('trait-info-btn')) {
            console.log(">>> Trait Info button clicked!"); // Log: Listener Fired
            this.handleTraitInfoClick(e);
        }
    });

    // Context Help Buttons (Event Delegation on document)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('context-help-btn')) {
             console.log(">>> Context Help button clicked!");
             const helpKey = e.target.dataset.helpKey;
             if (helpKey) {
                 this.showContextHelp(helpKey);
             } else {
                 console.warn("Context help button missing data-help-key attribute.");
             }
        }
    });


    // Trait Info Popup Close
    this.elements.traitInfoClose?.addEventListener('click', () => {
        console.log(">>> Trait Info Close clicked!"); // Log: Listener Fired
        this.hideTraitInfo();
    });

     // Context Help Popup Close
     this.elements.contextHelpClose?.addEventListener('click', () => {
        console.log(">>> Context Help Close clicked!");
        this.hideContextHelp();
    });

    // List Interaction (Event Delegation)
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));


    // Modal Closures
    this.elements.modalClose?.addEventListener('click', () => {
        console.log(">>> Detail Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.modal);
    });
    this.elements.resourcesClose?.addEventListener('click', () => {
        console.log(">>> Resources Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.resourcesModal);
    });
    this.elements.glossaryClose?.addEventListener('click', () => {
        console.log(">>> Glossary Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.glossaryModal);
    });
    this.elements.styleDiscoveryClose?.addEventListener('click', () => {
        console.log(">>> Style Discovery Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.styleDiscoveryModal);
    });
     this.elements.themesClose?.addEventListener('click', () => {
        console.log(">>> Themes Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.themesModal);
    });
     this.elements.welcomeClose?.addEventListener('click', () => {
        console.log(">>> Welcome Modal Close clicked!"); // Log: Listener Fired
        this.closeModal(this.elements.welcomeModal);
    });
     this.elements.achievementsClose?.addEventListener('click', () => { // NEW
        console.log(">>> Achievements Modal Close clicked!");
        this.closeModal(this.elements.achievementsModal);
    });
     this.elements.sfCloseBtn?.addEventListener('click', () => { // Style Finder close
         console.log(">>> Style Finder Modal Close clicked!");
         this.sfClose();
     });


    // Header Buttons
    this.elements.resourcesBtn?.addEventListener('click', () => {
        console.log(">>> Resources button clicked!"); // Log: Listener Fired
        grantAchievement({}, 'resource_reader'); // Grant app-level achievement
        this.openModal(this.elements.resourcesModal);
    });
    this.elements.glossaryBtn?.addEventListener('click', () => {
        console.log(">>> Glossary button clicked!"); // Log: Listener Fired
        this.showGlossary(); // Calls openModal internally
    });
     this.elements.styleDiscoveryBtn?.addEventListener('click', () => {
        console.log(">>> Style Discovery button clicked!"); // Log: Listener Fired
        this.showStyleDiscovery(); // Calls openModal internally
    });
     this.elements.themesBtn?.addEventListener('click', () => {
        console.log(">>> Themes button clicked!"); // Log: Listener Fired
        this.openModal(this.elements.themesModal);
    });
     this.elements.achievementsBtn?.addEventListener('click', () => { // NEW
        console.log(">>> Achievements button clicked!");
        this.showAchievements(); // Calls openModal internally
    });
    this.elements.themeToggle?.addEventListener('click', () => {
        console.log(">>> Theme Toggle button clicked!"); // Log: Listener Fired
        this.toggleTheme();
    });
     this.elements.exportBtn?.addEventListener('click', () => {
        console.log(">>> Export button clicked!"); // Log: Listener Fired
        this.exportData();
    });
    this.elements.importBtn?.addEventListener('click', () => {
        console.log(">>> Import button clicked!"); // Log: Listener Fired
        this.elements.importFileInput?.click(); // Trigger file input
    });
    this.elements.importFileInput?.addEventListener('change', (e) => {
        console.log(">>> Import file selected!"); // Log: Listener Fired
        this.importData(e);
    });
     this.elements.styleFinderTriggerBtn?.addEventListener('click', () => { // Style Finder trigger
         console.log(">>> Style Finder Trigger button clicked!");
         this.sfStart();
     });


     // Style Discovery Filter
     this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => {
         console.log(">>> Style Discovery Filter changed!"); // Log: Listener Fired
         this.renderStyleDiscoveryContent(); // Re-render content based on filter
     });

    // Theme Selection Buttons (Event Delegation)
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));

     // Detail Modal Body (for dynamic buttons: goal toggle/delete, snapshot, journal, reading)
     this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));

     // Detail Modal Tabs
     this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e));

     // Glossary Link Navigation within Glossary Modal
     this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));

     // Style Explore Link in Form
     this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e));
     this.elements.formStyleFinderLink?.addEventListener('click', () => {
         console.log(">>> Form Style Finder link clicked!");
         this.sfStart(); // Start the style finder
     });

     // Style Finder Modal Content Interaction (Event Delegation)
     this.elements.sfStepContent?.addEventListener('click', (e) => {
         const button = e.target.closest('button');
         const infoIcon = e.target.closest('.sf-info-icon');
         const slider = e.target.closest('.sf-trait-slider');

         if (button) {
             const action = button.dataset.action;
             const value = button.dataset.value;
             console.log(`>>> Style Finder Action Button Clicked: action=${action}, value=${value}`);
             this.handleStyleFinderAction(action, button.dataset); // Pass full dataset
         } else if (infoIcon) {
             const traitName = infoIcon.dataset.trait;
             console.log(`>>> Style Finder Info Icon Clicked: trait=${traitName}`);
             if (traitName) this.sfShowTraitInfo(traitName);
         }
         // Slider input is handled by 'input' event below
     });

      // Style Finder Slider Input (direct listener for efficiency)
      this.elements.sfStepContent?.addEventListener('input', (e) => {
        if (e.target.classList.contains('sf-trait-slider')) {
            // console.log(">>> Style Finder Slider Input!"); // Can be noisy
            this.handleStyleFinderSliderInput(e.target);
        }
     });

    // Close modals on Escape key
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));

    // Close popups on click outside
    window.addEventListener('click', (e) => this.handleWindowClick(e));

    console.log("Event listeners ADDED.");
  }


  // --- Event Handlers ---
  handleListClick(e) {
      const target = e.target;
      const listItem = target.closest('li');
      if (!listItem) return;
      const personId = listItem.dataset.id;

      if (target.classList.contains('edit-btn')) {
          console.log(`>>> Edit button clicked for ID: ${personId}`);
          this.editPerson(personId);
      } else if (target.classList.contains('delete-btn')) {
          console.log(`>>> Delete button clicked for ID: ${personId}`);
          if (confirm(`Are you sure you want to delete ${listItem.querySelector('.person-name')?.textContent || 'this persona'}? This cannot be undone.`)) {
              this.deletePerson(personId);
          }
      } else if (target.closest('.person-info')) { // Click anywhere else on the info part
          console.log(`>>> Person info clicked for ID: ${personId}`);
          this.showPersonDetails(personId);
      }
  }

  handleListKeydown(e) {
      // Allow activating buttons with Enter/Space
      if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn'))) {
          e.preventDefault(); // Prevent default spacebar scroll or enter submit
          e.target.click();
      }
      // Allow opening details with Enter on the main info part
      else if (e.key === 'Enter' && e.target.closest('.person-info')) {
           e.preventDefault();
           const listItem = e.target.closest('li');
           const personId = listItem?.dataset.id;
           if(personId) {
               this.showPersonDetails(personId);
           }
      }
  }

  handleWindowClick(e) {
     // Close Trait Info Popup if click is outside
     if (this.elements.traitInfoPopup && this.elements.traitInfoPopup.style.display !== 'none') {
        const popupContent = this.elements.traitInfoPopup.querySelector('.card'); // Assuming content is in a card
        const infoButton = document.querySelector(`.trait-info-btn[aria-expanded="true"]`); // Find the button that opened it
        if (popupContent && !popupContent.contains(e.target) && e.target !== infoButton && !infoButton?.contains(e.target)) {
             this.hideTraitInfo();
        }
     }
     // Close Context Help Popup if click is outside
      if (this.elements.contextHelpPopup && this.elements.contextHelpPopup.style.display !== 'none') {
        const popupContent = this.elements.contextHelpPopup.querySelector('.card');
        const helpButton = document.querySelector(`.context-help-btn[aria-expanded="true"]`);
        if (popupContent && !popupContent.contains(e.target) && e.target !== helpButton && !helpButton?.contains(e.target)) {
            this.hideContextHelp();
        }
      }
     // Close SF Popups if click is outside
      const activeSFPopup = document.querySelector('.sf-style-info-popup');
      if(activeSFPopup) {
         const triggerElement = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active'); // Find what opened it
         if (!activeSFPopup.contains(e.target) && e.target !== triggerElement && !triggerElement?.contains(e.target)) {
             activeSFPopup.remove();
             triggerElement?.classList.remove('active');
         }
      }
  }


  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log(">>> Escape key pressed!"); // Log: Listener Fired
           // Close visible popups first
           if (this.elements.traitInfoPopup && this.elements.traitInfoPopup.style.display !== 'none') {
             this.hideTraitInfo();
             return; // Prioritize closing popups
           }
            if (this.elements.contextHelpPopup && this.elements.contextHelpPopup.style.display !== 'none') {
                this.hideContextHelp();
                return;
            }
            const activeSFPopup = document.querySelector('.sf-style-info-popup');
            if(activeSFPopup) {
                 const triggerElement = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active');
                 activeSFPopup.remove();
                 triggerElement?.classList.remove('active');
                 return;
            }

          // Then close modals
          if (this.elements.modal && this.elements.modal.style.display !== 'none') this.closeModal(this.elements.modal);
          else if (this.elements.resourcesModal && this.elements.resourcesModal.style.display !== 'none') this.closeModal(this.elements.resourcesModal);
          else if (this.elements.glossaryModal && this.elements.glossaryModal.style.display !== 'none') this.closeModal(this.elements.glossaryModal);
          else if (this.elements.styleDiscoveryModal && this.elements.styleDiscoveryModal.style.display !== 'none') this.closeModal(this.elements.styleDiscoveryModal);
          else if (this.elements.themesModal && this.elements.themesModal.style.display !== 'none') this.closeModal(this.elements.themesModal);
          else if (this.elements.welcomeModal && this.elements.welcomeModal.style.display !== 'none') this.closeModal(this.elements.welcomeModal);
          else if (this.elements.achievementsModal && this.elements.achievementsModal.style.display !== 'none') this.closeModal(this.elements.achievementsModal); // NEW
          else if (this.elements.sfModal && this.elements.sfModal.style.display !== 'none') this.sfClose(); // Style Finder close
      }
  }

  handleTraitSliderInput(e) {
     const slider = e.target;
     const display = slider.closest('.trait')?.querySelector('.trait-value');
     if (display) {
        display.textContent = slider.value;
     }
     this.updateTraitDescription(slider);
  }

  handleTraitInfoClick(e) {
     const button = e.target.closest('.trait-info-btn');
     if (!button) return;
     const traitName = button.dataset.trait;
     this.showTraitInfo(traitName);
     // Mark button as expanded for focus/click-outside logic
     document.querySelectorAll('.trait-info-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
     button.setAttribute('aria-expanded', 'true');
  }

  handleModalBodyClick(e) {
    const personId = this.elements.modal?.dataset.personId; // Get current person ID from modal
    if (!personId) return;

    const target = e.target;

    // Goal Toggle/Delete
    if (target.classList.contains('toggle-goal-btn') || target.closest('.toggle-goal-btn')) {
        const button = target.closest('.toggle-goal-btn');
        const goalId = button?.dataset.goalId;
        if (goalId) {
            console.log(`>>> Toggle Goal clicked for person ${personId}, goal ${goalId}`);
            this.toggleGoalStatus(personId, goalId);
        }
    } else if (target.classList.contains('delete-goal-btn') || target.closest('.delete-goal-btn')) {
        const button = target.closest('.delete-goal-btn');
        const goalId = button?.dataset.goalId;
        if (goalId) {
            console.log(`>>> Delete Goal clicked for person ${personId}, goal ${goalId}`);
            if (confirm("Delete this goal?")) {
                this.deleteGoal(personId, goalId);
            }
        }
    }
    // Add Goal
    else if (target.id === 'add-goal-btn') {
        console.log(`>>> Add Goal clicked for person ${personId}`);
        this.addGoal(personId);
    }
    // Take Snapshot
    else if (target.id === 'snapshot-btn') {
         console.log(`>>> Snapshot button clicked for person ${personId}`);
         this.addSnapshotToHistory(personId);
    }
    // Show Journal Prompt
    else if (target.id === 'journal-prompt-btn') {
         console.log(`>>> Journal Prompt button clicked for person ${personId}`);
         this.showJournalPrompt(personId);
    }
    // Save Reflections
    else if (target.id === 'save-reflections-btn') {
         console.log(`>>> Save Reflections button clicked for person ${personId}`);
         this.saveReflections(personId);
    }
     // Get Kink Reading
     else if (target.id === 'reading-btn') {
         console.log(`>>> Kink Reading button clicked for person ${personId}`);
         this.showKinkReading(personId);
     }
  }

   handleThemeSelection(e) {
        const button = e.target.closest('.theme-option-btn');
        if (button) {
            console.log(">>> Theme Selection button clicked!"); // Log: Listener Fired
            const themeName = button.dataset.theme;
            this.setTheme(themeName);
            // Optional: Close the themes modal after selection
            this.closeModal(this.elements.themesModal);
        }
    }

    handleStyleFinderAction(action, dataset = {}) {
        switch(action) {
            case 'start':
            case 'next':
                const currentTrait = dataset.trait; // Check if we're on a trait step
                this.sfNextStep(currentTrait);
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
             case 'showDetails': // For result screen button
                 this.sfShowFullDetails(dataset.value); // Value is the style name
                 // Mark button as active for click-outside logic
                 document.querySelectorAll('.sf-result-buttons button').forEach(b => b.classList.remove('active'));
                 const btn = this.elements.sfStepContent.querySelector(`button[data-action="showDetails"][data-value="${dataset.value}"]`);
                 btn?.classList.add('active');
                 break;
            case 'applyStyle':
                this.confirmApplyStyleFinderResult(this.sfIdentifiedRole, dataset.value); // value is the style name
                break;
            case 'toggleDashboard':
                 this.toggleStyleFinderDashboard();
                 break;
            default:
                console.warn("Unknown Style Finder action:", action);
        }
    }

     handleStyleFinderSliderInput(sliderElement) {
        const traitName = sliderElement.dataset.trait;
        const value = sliderElement.value;
        const descriptionDiv = this.elements.sfStepContent.querySelector(`#sf-desc-${traitName}`);
        const footnoteP = this.elements.sfStepContent.querySelector(`#sf-footnote-${traitName}`); // Assuming ID for footnote

        if (traitName && value !== undefined && descriptionDiv && this.sfSliderDescriptions[traitName]) {
            const descriptions = this.sfSliderDescriptions[traitName];
            if (descriptions && descriptions.length === 10) {
                 const index = parseInt(value, 10) - 1;
                 if (index >= 0 && index < 10) {
                    descriptionDiv.textContent = descriptions[index];
                    this.sfSetTrait(traitName, value); // Update the answer
                    this.sfUpdateDashboard(); // Update dashboard live
                 } else {
                     console.error(`Invalid slider index ${index} for trait ${traitName}`);
                     descriptionDiv.textContent = "Adjust the slider...";
                 }

            } else {
                 console.error(`Slider descriptions missing or incomplete for trait: ${traitName}`);
                 descriptionDiv.textContent = "How does this feel?";
            }
        } else {
            console.warn("Missing elements for Style Finder slider update:", {traitName, value, descriptionDiv, footnoteP});
        }
    }

  handleDetailTabClick(e) {
    const link = e.target.closest('.tab-link');
    if (link && !link.classList.contains('active')) {
        const tabId = link.dataset.tab;
        const personId = this.elements.modal?.dataset.personId;
        const person = this.people.find(p => p.id == personId);

        if (tabId && person) {
            console.log(`>>> Tab clicked: ${tabId} for person ${personId}`);
            this.activeDetailModalTab = tabId;

            // Update tab appearance
            this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1'); // Make inactive tabs not tabbable
            });
            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');
            link.setAttribute('tabindex', '0'); // Make active tab tabbable

            // Update content visibility
            this.elements.modalBody.querySelectorAll('.tab-content').forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none'; // Ensure it's hidden
            });

            const contentPane = this.elements.modalBody.querySelector(`#${tabId}`);
            if (contentPane) {
                this.renderDetailTabContent(person, tabId, contentPane); // Re-render content
                contentPane.classList.add('active');
                contentPane.style.display = 'block'; // Ensure it's visible
                contentPane.focus(); // Focus the content pane for accessibility
            } else {
                console.error(`Content pane not found for tab ID: ${tabId}`);
            }
        } else {
            console.warn("Tab click ignored - missing tabId or person data", {tabId, personId});
        }
    }
  }

  handleGlossaryLinkClick(e) {
     const link = e.target.closest('a.glossary-link');
     if (link && this.elements.glossaryModal?.style.display !== 'none') {
         e.preventDefault(); // Prevent default anchor jump
         const termKey = link.dataset.termKey;
         const termElement = this.elements.glossaryBody?.querySelector(`#gloss-term-${termKey}`);

         if (termElement) {
             console.log(`>>> Glossary internal link clicked: ${termKey}`);
             // Remove previous highlights
             this.elements.glossaryBody.querySelectorAll('.highlighted-term').forEach(el => el.classList.remove('highlighted-term'));
             // Add highlight to target
             termElement.classList.add('highlighted-term');
             // Scroll smoothly
             termElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
             termElement.focus(); // Focus for accessibility
         } else {
             console.warn(`Glossary term element not found for key: ${termKey}`);
         }
     }
  }

  handleExploreStyleLinkClick(e) {
     e.preventDefault();
     const styleName = this.elements.style?.value;
     if (styleName) {
         console.log(`>>> Explore Style link clicked for: ${styleName}`);
         this.showStyleDiscovery(styleName); // Open discovery modal and highlight
     } else {
         console.warn("Explore Style link clicked but no style selected.");
     }
  }


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

                       // Directly use escapedName which should contain the correct string
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


  renderTraits(roleKey, styleName) {
    console.log(`Rendering traits for Role: ${roleKey}, Style: ${styleName}`);
    const container = this.elements.traitsContainer;
    const messageDiv = this.elements.traitsMessage;
    if (!container || !messageDiv) {
        console.error("Traits container or message div not found.");
        return;
    }

    container.innerHTML = ''; // Clear previous traits
    container.style.display = 'none'; // Hide container initially
    messageDiv.style.display = 'block'; // Show message initially
    messageDiv.textContent = 'Select Role & Style above to customize traits.';

    if (!roleKey || !styleName) {
        console.log("Role or Style not selected, showing message.");
        return; // Don't render if role or style is missing
    }

    // --- Data Validation ---
    if (!bdsmData || typeof bdsmData !== 'object') {
         console.error("bdsmData is missing or invalid.");
         messageDiv.textContent = 'Error: Core data definition missing.';
         return;
    }
    const roleData = bdsmData[roleKey];
     if (!roleData) {
        console.error(`Data for role '${roleKey}' not found in bdsmData.`);
        messageDiv.textContent = `Error: Data definition for role '${roleKey}' missing.`;
        return;
    }
     if (!Array.isArray(roleData.coreTraits)) {
        console.warn(`Core traits for role '${roleKey}' missing or not an array.`);
        // Continue rendering style traits even if core traits are missing
    }
     if (!Array.isArray(roleData.styles)) {
        console.error(`Styles array for role '${roleKey}' missing or invalid.`);
        messageDiv.textContent = `Error: Styles definition for role '${roleKey}' missing.`;
        return;
    }
    // --- End Data Validation ---


    const styleObj = roleData.styles.find(s => s.name === styleName);

    if (!styleObj) {
        console.warn(`Style object for '${styleName}' not found within role '${roleKey}'.`);
        messageDiv.textContent = `Details for style '${styleName}' not found. Please select another.`;
        return; // Don't render if style details are missing
    }

    messageDiv.style.display = 'none'; // Hide message
    container.style.display = 'block'; // Show container

    let traitsToRender = [];

    // Add Core Traits for the Role
    if (roleData.coreTraits) {
        traitsToRender = [...roleData.coreTraits];
        console.log(`Added ${roleData.coreTraits.length} core traits.`);
    } else {
        console.log("No core traits found for this role.");
    }


    // Add Specific Traits for the Style
    if (styleObj.traits && Array.isArray(styleObj.traits)) {
        styleObj.traits.forEach(styleTrait => {
            // Avoid duplicates if a style trait is also a core trait
            if (!traitsToRender.some(coreTrait => coreTrait.name === styleTrait.name)) {
                traitsToRender.push(styleTrait);
            }
        });
         console.log(`Added ${styleObj.traits.length} style-specific traits (after deduplication).`);
    } else {
         console.log(`No specific traits found for style '${styleName}'.`);
    }


    if (traitsToRender.length === 0) {
        container.innerHTML = `<p class="muted-text">No specific traits defined for ${styleName}. Focus on your core role traits!</p>`;
        console.log("No traits to render for this combination.");
        return;
    }

    console.log(`Rendering ${traitsToRender.length} traits total.`);
    traitsToRender.forEach(trait => {
        container.innerHTML += this.createTraitHTML(trait);
    });

    // Set initial values if editing
    if (this.currentEditId) {
        const person = this.people.find(p => p.id === this.currentEditId);
        if (person && person.traits) {
            Object.entries(person.traits).forEach(([traitName, value]) => {
                const slider = container.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                const display = container.querySelector(`.trait-value[data-trait="${traitName}"]`);
                if (slider) slider.value = value;
                if (display) display.textContent = value;
                if(slider) this.updateTraitDescription(slider); // Update desc on load
            });
        }
    } else {
         // Ensure descriptions match default slider value (3) on create
         container.querySelectorAll('.trait-slider').forEach(slider => {
             this.updateTraitDescription(slider);
         });
    }
  }


  createTraitHTML(trait) {
    if (!trait || !trait.name || !trait.desc) {
        console.warn("Attempted to create trait HTML with invalid data:", trait);
        return '<p class="error-text">Error rendering trait.</p>';
    }

    // Capitalize trait name for display
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1).replace(/([A-Z])/g, ' $1'); // Add spaces for camelCase
    const defaultValue = 3; // Default middle value
    const descriptionId = `desc-${trait.name}`;
    const sliderId = `slider-${trait.name}`;
    const labelId = `label-${trait.name}`;

    // Basic description (level 3) or placeholder
    const initialDesc = trait.desc[defaultValue] || "Adjust the slider to see description.";

    // Find the 1-5 description for the current value (initially 3)
    let valueDescription = "Loading..."; // Placeholder
    const descriptionKey = String(defaultValue); // Key is string "1" to "5"
    if (trait.desc && trait.desc[descriptionKey]) {
       valueDescription = this.escapeHTML(trait.desc[descriptionKey]);
    } else {
       console.warn(`Missing description for trait ${trait.name} at level ${descriptionKey}`);
       valueDescription = "Description unavailable";
    }


    return `
      <div class="trait">
        <label id="${labelId}" for="${sliderId}" class="trait-label">
          ${this.escapeHTML(displayName)}
          <button type="button" class="trait-info-btn small-btn" data-trait="${trait.name}" aria-label="More info about ${this.escapeHTML(displayName)}" aria-expanded="false" aria-controls="trait-info-popup">?</button>
        </label>
        <input type="range" id="${sliderId}" class="trait-slider"
               min="1" max="5" value="${defaultValue}"
               data-trait="${trait.name}"
               aria-labelledby="${labelId}"
               aria-describedby="${descriptionId}">
        <span class="trait-value" data-trait="${trait.name}" aria-live="polite">${defaultValue}</span>
        <p class="trait-desc muted-text" id="${descriptionId}">${valueDescription}</p>
      </div>
    `;
  }


  updateTraitDescription(slider) {
        if (!slider) return;
        const traitName = slider.dataset.trait;
        const value = slider.value;
        const descElement = slider.closest('.trait')?.querySelector('.trait-desc');

        if (!traitName || !value || !descElement) {
            console.warn("Missing data for trait description update:", { traitName, value, descElement });
            if(descElement) descElement.textContent = "Error loading description.";
            return;
        }

        // Find the correct trait definition (needs to check core and style)
        const roleKey = this.elements.role?.value;
        const styleName = this.elements.style?.value;
        const roleData = bdsmData[roleKey];
        let traitDefinition = null;

        if (roleData) {
            // Check core traits
            traitDefinition = roleData.coreTraits?.find(t => t.name === traitName);
            // If not core, check style traits
            if (!traitDefinition && styleName) {
                 const styleObj = roleData.styles?.find(s => s.name === styleName);
                 traitDefinition = styleObj?.traits?.find(t => t.name === traitName);
            }
        }

        if (traitDefinition && traitDefinition.desc && traitDefinition.desc[value]) {
            descElement.textContent = this.escapeHTML(traitDefinition.desc[value]);
        } else {
            console.warn(`Description not found for trait '${traitName}' at level ${value}.`);
            descElement.textContent = "Description unavailable."; // Fallback text
        }
    }


  renderList() {
      const listElement = this.elements.peopleList;
      if (!listElement) return;

      if (this.people.length === 0) {
          listElement.innerHTML = '<li>No personas created yet. Use the form to add one!</li>';
          return;
      }

      listElement.innerHTML = this.people
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
          .map(person => this.createPersonListItemHTML(person))
          .join('');

        // Add brief highlight to newly saved/updated item
        if (this.lastSavedId) {
            const newItem = listElement.querySelector(`li[data-id="${this.lastSavedId}"]`);
            if (newItem) {
                newItem.classList.add('item-just-saved');
                // Remove class after animation
                setTimeout(() => newItem.classList.remove('item-just-saved'), 1500);
            }
            this.lastSavedId = null; // Reset tracker
        }

  }

  createPersonListItemHTML(person) {
    const roleData = bdsmData[person.role];
    const styleObj = roleData?.styles?.find(s => s.name === person.style);
    const styleSummary = styleObj?.summary || 'Style details undefined';

    // Calculate overall average score for flair (optional)
    let avgScore = 3; // Default
    if (person.traits && Object.keys(person.traits).length > 0) {
        const scores = Object.values(person.traits).map(Number).filter(n => !isNaN(n));
        if (scores.length > 0) {
            avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
    }
    const flair = this.getFlairForScore(avgScore);

     // Generate achievements preview icons
    const achievementIcons = person.achievements
        ?.map(id => achievementList[id]?.name.match(/(\p{Emoji})/u)?.[0]) // Get first emoji from name
        .filter(Boolean) // Remove nulls/undefined
        .slice(0, 3) // Limit to 3 icons
        .join('') || ''; // Join into a string


    return `
      <li data-id="${person.id}" tabindex="0">
        <div class="person-info" role="button" aria-label="View details for ${this.escapeHTML(person.name)}">
          <span class="person-avatar" aria-hidden="true">${person.avatar || '❓'}</span>
          <div class="person-name-details">
            <span class="person-name">${this.escapeHTML(person.name)} <span class="person-flair">${flair}</span></span>
            <span class="person-details muted-text">
                ${this.escapeHTML(person.style || 'No Style Selected')} (${this.escapeHTML(person.role)})
                ${achievementIcons ? `<span class="person-achievements-preview" title="${person.achievements.length} achievements">${achievementIcons}</span>` : ''}
            </span>
          </div>
        </div>
        <div class="person-actions">
          <button class="small-btn edit-btn" aria-label="Edit ${this.escapeHTML(person.name)}">Edit</button>
          <button class="small-btn delete-btn" aria-label="Delete ${this.escapeHTML(person.name)}">Delete</button>
        </div>
      </li>
    `;
  }

   updateStyleExploreLink() {
        const selectedStyle = this.elements.style?.value;
        const link = this.elements.styleExploreLink;
        if (link) {
            if (selectedStyle) {
                link.textContent = `(Explore ${selectedStyle})`;
                link.setAttribute('aria-label', `Explore details for the ${selectedStyle} style`);
                link.style.display = 'inline'; // Show the link
            } else {
                link.style.display = 'none'; // Hide if no style selected
            }
        }
    }


  // --- CRUD ---
  savePerson() {
      const name = this.elements.name.value.trim();
      const role = this.elements.role.value;
      const style = this.elements.style.value;
      const avatar = this.elements.avatarInput.value || '❓'; // Use hidden input

      if (!name || !role || !style) {
          this.showNotification("Please fill in Name, Role, and Style!", "warning");
          return;
      }

      const traits = {};
      this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
          traits[slider.dataset.trait] = parseInt(slider.value, 10);
      });

      if (this.currentEditId) {
          // Update existing person
          const index = this.people.findIndex(p => p.id === this.currentEditId);
          if (index > -1) {
              // Preserve existing goals, history, achievements, reflections if updating
              const existingPerson = this.people[index];
              this.people[index] = {
                  ...existingPerson, // Keep existing id, goals, history, achievements, reflections
                  name,
                  avatar,
                  role,
                  style,
                  traits
              };
              this.showNotification(`${name} updated successfully! ✨`, "success");
              grantAchievement(this.people[index], 'profile_edited');
              this.lastSavedId = this.currentEditId; // Track for highlight
          }
      } else {
          // Add new person
          const newPerson = {
              id: Date.now(), // Simple unique ID
              name,
              avatar,
              role,
              style,
              traits,
              goals: [],        // Initialize empty arrays/objects for new features
              history: [],
              achievements: [],
              reflections: { text: '' } // Initialize reflections object
          };
          this.people.push(newPerson);
          this.showNotification(`${name} created successfully! 🎉`, "success");
          grantAchievement(newPerson, 'profile_created');
          if (avatar !== '❓') grantAchievement(newPerson, 'avatar_chosen');
          if (this.people.length >= 5) grantAchievement(newPerson, 'five_profiles');
          this.lastSavedId = newPerson.id; // Track for highlight
      }

      this.saveToLocalStorage();
      this.renderList();
      this.resetForm();
      this.updateLivePreview(); // Update preview after save/clear
      this.currentEditId = null; // Ensure edit mode is cleared
      this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.save.textContent = 'Save Persona! 💖';
  }

  editPerson(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) return;

      this.currentEditId = personId;

      this.elements.name.value = person.name;
      this.elements.avatarInput.value = person.avatar || '❓';
      this.elements.avatarDisplay.textContent = person.avatar || '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => {
         btn.classList.toggle('selected', btn.dataset.emoji === person.avatar);
      });

      this.elements.role.value = person.role;
      this.renderStyles(person.role); // Render styles for the role
      this.elements.style.value = person.style; // Set the style AFTER rendering options
      this.renderTraits(person.role, person.style); // Render traits and set values

      this.elements.formTitle.textContent = `✏️ Editing ${person.name}`;
      this.elements.save.textContent = 'Update Persona 💾';

      // Scroll form into view if needed
      this.elements.formSection.scrollIntoView({ behavior: 'smooth' });
      this.elements.name.focus(); // Focus the name field
       this.updateLivePreview(); // Show preview of item being edited
  }

  deletePerson(personId) {
      const initialLength = this.people.length;
      this.people = this.people.filter(p => p.id !== personId);

      if (this.people.length < initialLength) {
        this.saveToLocalStorage();
        this.renderList();
        if (this.currentEditId === personId) {
            this.resetForm(); // Clear form if deleting the person being edited
        }
        this.showNotification("Persona deleted successfully. 🗑️", "info");
      } else {
         console.warn(`Attempted to delete person with ID ${personId}, but they were not found.`);
         this.showNotification("Could not delete persona.", "error");
      }
  }

  resetForm(isManualClear = false) {
      this.currentEditId = null;
      this.elements.name.value = '';
      this.elements.avatarInput.value = '❓'; // Reset hidden input
      this.elements.avatarDisplay.textContent = '❓'; // Reset display
      this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected')); // Clear avatar selection
      this.elements.role.value = 'submissive'; // Default role
      this.renderStyles('submissive'); // Render default styles
      this.elements.style.value = '';
      this.renderTraits('submissive', ''); // Clear traits initially
      this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.save.textContent = 'Save Persona! 💖';
      this.elements.save.disabled = false; // Re-enable save button
      this.elements.save.innerHTML = 'Save Persona! <span role="img" aria-label="Sparkles">💖</span>'; // Reset button text/icon
      this.updateLivePreview(); // Clear preview
      this.updateStyleExploreLink(); // Hide explore link

      if (isManualClear) {
            console.log("Form manually cleared.");
            // Optionally show notification for manual clear
            // this.showNotification("Form cleared.", "info", 2000);
      }
  }


  // --- Live Preview ---
  updateLivePreview() {
    const name = this.elements.name.value.trim();
    const role = this.elements.role.value;
    const style = this.elements.style.value;
    const avatar = this.elements.avatarInput.value || '❓';
    const previewElement = this.elements.livePreview;

    if (!name || !role || !style) {
        previewElement.innerHTML = '<p class="muted-text">Fill the form to see your persona\'s vibe! 🌈</p>';
        this.previewPerson = null; // Clear preview data
        return;
    }

    // Collect current trait values from the form
    const currentTraits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
        currentTraits[slider.dataset.trait] = parseInt(slider.value, 10);
    });

    // Store preview data (useful if needed elsewhere)
    this.previewPerson = { name, role, style, avatar, traits: currentTraits };

    // --- Generate Preview HTML ---
    let html = `<div class="preview-title">${avatar} <strong>${this.escapeHTML(name)}</strong> (${this.escapeHTML(role)} - ${this.escapeHTML(style)})</div>`;

    // Get breakdown (use correct function based on role)
    const getBreakdownFunc = role === 'dominant' ? getDomBreakdown : getSubBreakdown; // Assumes 'switch' uses sub for now
    const breakdown = getBreakdownFunc(style, currentTraits);

    html += `<div class="preview-breakdown">`;
    html += `<div class="strengths"><h4>💪 Strengths / Vibes:</h4><p>${breakdown.strengths}</p></div>`;
    html += `<div class="improvements"><h4>🎯 Growth / Focus:</h4><p>${breakdown.improvements}</p></div>`;
    html += `</div>`;

    previewElement.innerHTML = html;

  }


  // --- Modal Display ---
  showPersonDetails(personId) {
    const person = this.people.find(p => p.id == personId); // Use == for potential string/number mismatch if IDs change format
    if (!person) {
        console.error(`Person with ID ${personId} not found.`);
        this.showNotification("Could not load persona details.", "error");
        return;
    }
    console.log("Showing details for:", person.name, person);

    if (!this.elements.modal || !this.elements.modalBody || !this.elements.modalTabs) {
        console.error("Detail modal elements (modal, body, or tabs) not found.");
        this.showNotification("UI Error: Cannot display details.", "error");
        return;
    }

    this.elements.modal.dataset.personId = personId; // Store ID for actions within modal

    // Set Modal Title
    if(this.elements.detailModalTitle) {
        this.elements.detailModalTitle.textContent = `${person.avatar} ${this.escapeHTML(person.name)} - Details`;
    }

     // Clear previous dynamic content (important!)
     this.elements.modalBody.innerHTML = '';
     this.elements.modalTabs.innerHTML = '';

    // Define Tabs
    const tabs = [
        { id: 'tab-goals', label: '🎯 Goals', icon: '🎯' },
        { id: 'tab-traits', label: '🎨 Traits', icon: '🎨' },
        { id: 'tab-history', label: '📈 History', icon: '📈' },
        { id: 'tab-journal', label: '📝 Journal', icon: '📝' },
        { id: 'tab-achievements', label: '🏆 Achievements', icon: '🏆' },
        { id: 'tab-reading', label: '🔮 Reading', icon: '🔮' },
         { id: 'tab-breakdown', label: '📊 Breakdown', icon: '📊' },
    ];

    // Generate Tabs and Content Panes
    tabs.forEach((tab, index) => {
        const isActive = tab.id === this.activeDetailModalTab; // Use stored active tab

        // Create Tab Button
        const tabButton = document.createElement('button');
        tabButton.className = `tab-link ${isActive ? 'active' : ''}`;
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tabButton.setAttribute('aria-controls', tab.id);
        tabButton.dataset.tab = tab.id;
        tabButton.textContent = `${tab.icon} ${tab.label}`;
         if (!isActive) tabButton.setAttribute('tabindex', '-1'); // Make inactive tabs not directly tabbable

        this.elements.modalTabs.appendChild(tabButton);

        // Create Content Pane
        const contentPane = document.createElement('div');
        contentPane.id = tab.id;
        contentPane.className = `tab-content ${isActive ? 'active' : ''}`;
        contentPane.setAttribute('role', 'tabpanel');
        contentPane.setAttribute('aria-labelledby', tab.id); // Use same ID for label association
         if (!isActive) contentPane.style.display = 'none'; // Ensure inactive panes are hidden

        // Add content (will be filled by renderDetailTabContent)
        contentPane.innerHTML = `<p class="loading-text">Loading ${tab.label}...</p>`; // Placeholder

        this.elements.modalBody.appendChild(contentPane);

         // Render content for the initially active tab
        if (isActive) {
             this.renderDetailTabContent(person, tab.id, contentPane);
        }
    });

    this.openModal(this.elements.modal);
  }


  renderDetailTabContent(person, tabId, contentElement) {
    if (!person || !contentElement) return;
     console.log(`Rendering content for tab: ${tabId}`);
     contentElement.innerHTML = ''; // Clear loading message or previous content

     try { // Add error handling around content generation
        switch(tabId) {
            case 'tab-goals':
                contentElement.innerHTML = `
                    <section class="goals-section">
                         <h3>Goals <button class="context-help-btn small-btn" data-help-key="goalsSectionInfo" aria-label="Help with Goals Section">?</button></h3>
                         <ul id="goal-list-${person.id}"></ul>
                         <form class="add-goal-form" id="add-goal-form-${person.id}" onsubmit="event.preventDefault(); kinkCompassApp.addGoal(${person.id})">
                              <label for="new-goal-${person.id}" class="sr-only">New Goal:</label>
                              <input type="text" id="new-goal-${person.id}" placeholder="Add a new goal..." required>
                              <button type="submit" id="add-goal-btn" class="small-btn">Add Goal</button>
                         </form>
                    </section>
                `;
                 // Now render the actual list items
                 const goalListUl = contentElement.querySelector(`#goal-list-${person.id}`);
                 if (goalListUl) {
                      goalListUl.innerHTML = this.renderGoalList(person);
                 } else {
                      console.error(`Could not find goal list UL element for person ${person.id}`);
                      contentElement.innerHTML += '<p class="error-text">Error displaying goals.</p>';
                 }
                break;

            case 'tab-traits':
                contentElement.innerHTML = `
                    <section class="trait-details-section">
                         <h3>Trait Details <button class="context-help-btn small-btn" data-help-key="traitsSectionInfo" aria-label="Help with Traits Section">?</button></h3>
                         <div class="trait-details-grid"></div>
                    </section>`;
                const grid = contentElement.querySelector('.trait-details-grid');
                 if (!grid) {
                     console.error("Trait details grid element not found.");
                     contentElement.innerHTML += '<p class="error-text">Error displaying traits.</p>';
                     break;
                 }

                const roleData = bdsmData[person.role];
                 if (!roleData) {
                     grid.innerHTML = `<p class="muted-text">Trait definitions not found for role: ${person.role}.</p>`;
                     break;
                 }

                 let traitsToShow = [];
                 // Get core traits definitions
                 if (roleData.coreTraits) traitsToShow.push(...roleData.coreTraits);
                 // Get style-specific traits definitions
                 const styleObj = roleData.styles?.find(s => s.name === person.style);
                 if (styleObj?.traits) {
                     styleObj.traits.forEach(styleTrait => {
                         if (!traitsToShow.some(t => t.name === styleTrait.name)) {
                             traitsToShow.push(styleTrait);
                         }
                     });
                 }

                if (traitsToShow.length === 0) {
                    grid.innerHTML = `<p class="muted-text">No specific traits defined for ${person.style}.</p>`;
                    break;
                }

                traitsToShow.sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(traitDef => {
                        const score = person.traits[traitDef.name] ?? '-';
                         const description = traitDef.desc && score !== '-' ? (traitDef.desc[String(score)] || 'N/A') : 'N/A';
                         const displayName = traitDef.name.charAt(0).toUpperCase() + traitDef.name.slice(1).replace(/([A-Z])/g, ' $1');

                        grid.innerHTML += `
                            <div class="trait-detail-item">
                                <h4>
                                     <a href="#" class="glossary-link" data-term-key="${traitDef.name}" title="View '${displayName}' in Glossary">${this.escapeHTML(displayName)}</a>:
                                     <span class="trait-score-badge">${score}/5 ${this.getEmojiForScore(score)}</span>
                                </h4>
                                <p>${this.escapeHTML(description)}</p>
                           </div>
                        `;
                    });
                break;

             case 'tab-history':
                contentElement.innerHTML = `
                    <section class="history-section">
                         <h3>
                            History Snapshots
                            <button class="context-help-btn small-btn" data-help-key="historyChartInfo" aria-label="Help with History Chart">?</button>
                         </h3>
                         <div class="history-chart-container" id="history-chart-container-${person.id}">
                            <canvas id="history-chart-${person.id}"></canvas>
                         </div>
                         <div class="modal-actions">
                            <button id="snapshot-btn" class="small-btn">Take Snapshot 📸</button>
                         </div>
                         <div class="snapshot-info" style="display: none;">
                            <p><strong>Snapshot Taken:</strong> <span id="snapshot-timestamp"></span></p>
                            <p>Includes current trait scores. View changes on the chart!</p>
                         </div>
                    </section>
                `;
                 this.renderHistoryChart(person, `history-chart-${person.id}`);
                break;

             case 'tab-journal':
                 const currentReflection = person.reflections?.text || '';
                 contentElement.innerHTML = `
                    <section class="reflections-section">
                         <h3>
                            Personal Journal
                            <button class="context-help-btn small-btn" data-help-key="journalSectionInfo" aria-label="Help with Journal Section">?</button>
                        </h3>
                         <div class="modal-actions">
                            <button id="journal-prompt-btn" class="small-btn">Get Prompt 🤔</button>
                         </div>
                         <p id="journal-prompt-${person.id}" class="journal-prompt muted-text" style="display: none;"></p>
                         <label for="reflections-text-${person.id}" class="sr-only">Journal Entry:</label>
                         <textarea id="reflections-text-${person.id}" class="reflections-textarea" placeholder="Reflect on your persona, experiences, goals, or use a prompt...">${this.escapeHTML(currentReflection)}</textarea>
                         <div class="modal-actions">
                            <button id="save-reflections-btn" class="small-btn save-btn">Save Reflections 💾</button>
                         </div>
                    </section>
                `;
                break;

             case 'tab-achievements':
                 contentElement.innerHTML = `
                     <section class="achievements-section">
                         <h3>
                            Achievements Unlocked
                             <button class="context-help-btn small-btn" data-help-key="achievementsSectionInfo" aria-label="Help with Achievements Section">?</button>
                         </h3>
                         <ul id="achievements-list-${person.id}"></ul>
                         <div class="modal-actions" style="margin-top: 1em;">
                             <button class="small-btn" onclick="kinkCompassApp.showAchievements()">View All Achievements</button>
                         </div>
                     </section>
                 `;
                 this.renderAchievementsList(person, `achievements-list-${person.id}`);
                 break;

            case 'tab-reading':
                contentElement.innerHTML = `
                    <section class="kink-reading-section">
                         <h3>Your Kink Compass Reading <button class="small-btn" id="reading-btn" style="margin-left: auto;">Get New Reading</button></h3>
                         <div id="kink-reading-output-${person.id}" class="kink-reading-output muted-text">Click 'Get New Reading' to see your compass interpretation...</div>
                    </section>
                `;
                // Optionally generate initial reading on load? Or wait for button click.
                 // this.showKinkReading(person.id); // Uncomment to load reading immediately
                break;

            case 'tab-breakdown': // Assuming similar structure to preview
                const getBreakdown = person.role === 'dominant' ? getDomBreakdown : getSubBreakdown;
                const breakdownData = getBreakdown(person.style, person.traits);
                 const intro = this.getIntroForStyle(person.style);
                 contentElement.innerHTML = `
                     <section class="style-breakdown-section">
                          <h3>Style Breakdown & Tips</h3>
                           ${intro ? `<p class="modal-intro">${this.escapeHTML(intro)}</p>` : ''}
                           <div class="style-breakdown">
                               <div class="strengths">
                                   <h4>🌟 Strengths / Current Vibe:</h4>
                                   <p>${breakdownData.strengths}</p>
                               </div>
                               <hr>
                               <div class="improvements">
                                   <h4>🧭 Growth / Focus Areas:</h4>
                                   <p>${breakdownData.improvements}</p>
                               </div>
                           </div>
                     </section>`;
                 break;

            default:
                contentElement.innerHTML = `<p>Content for tab "${tabId}" not yet implemented.</p>`;
        }
      } catch (error) {
          console.error(`Error rendering content for tab ${tabId}:`, error);
          contentElement.innerHTML = `<p class="error-text">Sorry, there was an error loading this section.</p>`;
      }
  }

  // --- New Feature Logic ---
  addGoal(personId) {
    const inputElement = document.getElementById(`new-goal-${personId}`);
    if (!inputElement) {
         console.error(`Input element for adding goal not found for person ${personId}`);
         this.showNotification("Error adding goal: UI element missing.", "error");
         return;
    }
    const goalText = inputElement.value.trim();

    if (!goalText) {
        this.showNotification("Please enter goal text.", "warning");
        return;
    }

    const person = this.people.find(p => p.id == personId);
    if (!person) {
        this.showNotification("Persona not found.", "error");
        return;
    }

    if (!person.goals) person.goals = []; // Ensure goals array exists

    const newGoal = {
        id: Date.now(), // Simple unique ID for the goal
        text: goalText,
        done: false
    };

    person.goals.push(newGoal);
    this.saveToLocalStorage(); // Save changes

    // Update UI
    const goalListUl = document.getElementById(`goal-list-${person.id}`);
    if (goalListUl) {
        goalListUl.innerHTML = this.renderGoalList(person); // Re-render the goal list
    } else {
        console.warn(`Goal list UL element not found after adding goal for person ${personId}`);
         this.renderDetailTabContent(person, 'tab-goals', document.getElementById('tab-goals')); // Fallback: re-render whole tab
    }

    inputElement.value = ''; // Clear input field
    this.showNotification("Goal added! 🎉", "success", 2500);
    grantAchievement(person, 'goal_added');
  }

  toggleGoalStatus(personId, goalId) {
    const person = this.people.find(p => p.id == personId);
    if (!person || !person.goals) return;

    const goal = person.goals.find(g => g.id == goalId);
    if (!goal) return;

    goal.done = !goal.done; // Toggle status
    this.saveToLocalStorage();

    // Update UI
     const goalListUl = document.getElementById(`goal-list-${person.id}`);
    if (goalListUl) {
        goalListUl.innerHTML = this.renderGoalList(person); // Re-render the goal list
    } else {
        console.warn(`Goal list UL element not found after toggling goal for person ${personId}`);
         this.renderDetailTabContent(person, 'tab-goals', document.getElementById('tab-goals')); // Fallback: re-render whole tab
    }


    if (goal.done) {
        grantAchievement(person, 'goal_completed');
        // Check for 5 completed goals
        const completedCount = this.people.reduce((count, p) => {
             return count + (p.goals?.filter(g => g.done).length || 0);
        }, 0);
        if (completedCount >= 5) {
             grantAchievement(person, 'five_goals_completed'); // Grant to current person
        }
        this.showNotification("Goal completed! ✔️", "success", 2000);
    } else {
        this.showNotification("Goal marked as not done.", "info", 2000);
    }
  }

  deleteGoal(personId, goalId) {
    const person = this.people.find(p => p.id == personId);
    if (!person || !person.goals) return;

    const initialLength = person.goals.length;
    person.goals = person.goals.filter(g => g.id != goalId);

     if (person.goals.length < initialLength) {
        this.saveToLocalStorage();

        // Update UI
        const goalListUl = document.getElementById(`goal-list-${person.id}`);
        if (goalListUl) {
             goalListUl.innerHTML = this.renderGoalList(person); // Re-render the goal list
         } else {
             console.warn(`Goal list UL element not found after deleting goal for person ${personId}`);
             this.renderDetailTabContent(person, 'tab-goals', document.getElementById('tab-goals')); // Fallback: re-render whole tab
        }
        this.showNotification("Goal deleted. 🗑️", "info", 2000);
    }
  }


  renderGoalList(person) {
     if (!person.goals || person.goals.length === 0) {
        return '<li class="muted-text">No goals added yet.</li>';
    }
    return person.goals.map(goal => `
        <li class="${goal.done ? 'done' : ''}">
            <span>${this.escapeHTML(goal.text)}</span>
            <div class="goal-actions">
                <button class="small-btn toggle-goal-btn" data-goal-id="${goal.id}" aria-label="${goal.done ? 'Mark as not done' : 'Mark as done'}">
                    ${goal.done ? 'Undo' : 'Done'}
                </button>
                <button class="small-btn delete-btn delete-goal-btn" data-goal-id="${goal.id}" aria-label="Delete goal">
                    Delete
                </button>
            </div>
        </li>
    `).join('');
  }

  showJournalPrompt(personId) {
    const promptElement = document.getElementById(`journal-prompt-${personId}`);
    if (promptElement) {
        const prompt = getRandomPrompt();
        promptElement.textContent = `💡 Prompt: ${prompt}`;
        promptElement.style.display = 'block';
        grantAchievement(this.people.find(p => p.id == personId), 'prompt_used');
    }
  }

  saveReflections(personId) {
    const textarea = document.getElementById(`reflections-text-${personId}`);
    const saveButton = document.getElementById('save-reflections-btn');

    if (!textarea || !saveButton) {
         console.error(`Textarea or save button not found for reflections, person ID ${personId}`);
         this.showNotification("Error saving reflections: UI element missing.", "error");
         return;
    }

    const person = this.people.find(p => p.id == personId);
    if (!person) {
        this.showNotification("Persona not found.", "error");
        return;
    }

     // Ensure reflections object exists
    if (typeof person.reflections !== 'object' || person.reflections === null) {
        person.reflections = {};
    }

    person.reflections.text = textarea.value; // Save only the text for now
    this.saveToLocalStorage();

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
    if ((person.reflections?.journalEntries?.length || (person.reflections.text ? 1: 0)) >= 5) { // Simple count check
         grantAchievement(person, 'five_reflections');
    }
  }

  addSnapshotToHistory(personId) {
    const person = this.people.find(p => p.id == personId);
    if (!person) {
        this.showNotification("Persona not found.", "error");
        return;
    }

    if (!person.history) person.history = [];

    const timestamp = new Date().toISOString();
    const snapshot = {
        timestamp: timestamp,
        traits: { ...person.traits } // Create a copy of current traits
    };

    person.history.push(snapshot);

     // Keep only the last ~20 snapshots to prevent data bloat (optional)
     const MAX_SNAPSHOTS = 20;
     if (person.history.length > MAX_SNAPSHOTS) {
         person.history = person.history.slice(-MAX_SNAPSHOTS);
         console.log(`History pruned to last ${MAX_SNAPSHOTS} snapshots for ${person.name}`);
     }

    this.saveToLocalStorage();

    // Update UI
     this.renderHistoryChart(person, `history-chart-${person.id}`); // Re-render chart
     const timestampDisplay = document.getElementById('snapshot-timestamp');
     const infoDiv = document.querySelector('.snapshot-info');
     if(timestampDisplay && infoDiv) {
         timestampDisplay.textContent = new Date(timestamp).toLocaleString();
         this.toggleSnapshotInfo(document.getElementById('snapshot-btn')); // Show brief confirmation
     }

    this.showNotification("Snapshot saved! 📸", "success", 2500);
    grantAchievement(person, 'history_snapshot');
    if (person.history.length >= 10) grantAchievement(person, 'ten_snapshots');
  }

   renderHistoryChart(person, canvasId) {
    const canvasElement = document.getElementById(canvasId);
    const containerElement = document.getElementById(`history-chart-container-${person.id}`);

     if (!canvasElement || !containerElement) {
         console.error(`Canvas or container not found for history chart: ${canvasId}`);
         if (containerElement) containerElement.innerHTML = '<p class="error-text">Error: Chart cannot be displayed.</p>';
         return;
     }

    containerElement.classList.add('chart-loading'); // Show loading state

    // Ensure Chart.js is loaded (basic check)
    if (typeof Chart === 'undefined') {
         console.error("Chart.js library is not loaded.");
         containerElement.innerHTML = '<p class="error-text">Error: Chart library failed to load.</p>';
         containerElement.classList.remove('chart-loading');
         return;
     }

    // Destroy previous chart instance if it exists
    if (this.chartInstance && this.chartInstance.canvas && this.chartInstance.canvas.id === canvasId) {
        this.chartInstance.destroy();
        console.log("Destroyed previous chart instance.");
    }


    if (!person.history || person.history.length === 0) {
        console.log("No history data to display for chart.");
        containerElement.innerHTML = '<p class="muted-text">No snapshots taken yet. Take a snapshot to start tracking history!</p>';
         containerElement.classList.remove('chart-loading');
        return;
    }

     // Prepare chart data
     const labels = person.history.map(snap => new Date(snap.timestamp).toLocaleDateString()); // Simple date labels
     const allTraitNames = [...new Set(person.history.flatMap(snap => Object.keys(snap.traits)))].sort();

     // Check if theme is dark for chart colors
     const isDark = document.body.dataset.theme === 'dark' || document.body.dataset.theme === 'velvet';
     const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim() || (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
     const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label-color').trim() || (isDark ? '#c49db1' : '#8a5a6d');
     const tooltipBgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-bg').trim() || (isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)');
     const tooltipTextColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-tooltip-text').trim() || (isDark ? '#000' : '#fff');
     const pointColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-point-color').trim();
     const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-line-color').trim();


     // Simple color cycling for lines
     const defaultColors = ['#ff69b4', '#1e90ff', '#3cb371', '#ffa500', '#9370db', '#ff7f50']; // Add more if needed
     const datasets = allTraitNames.map((traitName, index) => {
         const data = person.history.map(snap => snap.traits[traitName] ?? null); // Use null for missing data points
         const color = defaultColors[index % defaultColors.length];
         return {
             label: traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1'), // Format name
             data: data,
             borderColor: color,
             backgroundColor: color + '33', // Slightly transparent fill
             tension: 0.1, // Slight curve
             fill: false, // Don't fill under line by default
             pointBackgroundColor: pointColor || color, // Use theme color or line color
             pointRadius: 3,
             pointHoverRadius: 5,
         };
     });


     // Create new chart instance - wrapped in try/catch
     try {
        this.chartInstance = new Chart(canvasElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Important for container sizing
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5, // Assuming trait scores are 1-5
                        ticks: { color: labelColor, stepSize: 1 },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { color: labelColor },
                        grid: { color: gridColor }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: labelColor, boxWidth: 12, padding: 15, font: {size: 10} }
                    },
                    tooltip: {
                        backgroundColor: tooltipBgColor,
                        titleColor: tooltipTextColor,
                        bodyColor: tooltipTextColor,
                        boxPadding: 5,
                        callbacks: {
                             // Optional: Customize tooltip label
                            // label: function(context) {
                            //     let label = context.dataset.label || '';
                            //     if (label) { label += ': '; }
                            //     if (context.parsed.y !== null) { label += context.parsed.y; }
                            //     return label;
                            // }
                        }
                    }
                },
                 interaction: {
                    intersect: false, // Show tooltips even when not directly hovering over point
                    mode: 'index', // Show tooltips for all datasets at the same x-index
                },
            }
        });
         console.log("Chart rendered successfully.");
     } catch (chartError) {
          console.error("Error creating Chart instance:", chartError);
          containerElement.innerHTML = '<p class="error-text">Error rendering chart data.</p>';
     } finally {
         containerElement.classList.remove('chart-loading'); // Remove loading state
     }
  }

   toggleSnapshotInfo(button) {
        if(!button) return;
        const infoDiv = button.closest('.history-section').querySelector('.snapshot-info');
        if (!infoDiv) return;

        infoDiv.style.display = 'block';
        infoDiv.style.opacity = 1;
        infoDiv.style.transition = 'opacity 0.5s ease';

        // Fade out after a few seconds
        setTimeout(() => {
            infoDiv.style.opacity = 0;
            setTimeout(() => { infoDiv.style.display = 'none'; }, 500); // Hide after fade
        }, 3000);
    }

  renderAchievementsList(person, listElementId) {
     const listElement = document.getElementById(listElementId);
     if (!listElement) {
         console.error(`Achievement list element not found: ${listElementId}`);
         return; // Or append error message to modal body?
     }

    if (!person.achievements || person.achievements.length === 0) {
        listElement.innerHTML = '<li class="muted-text">No achievements unlocked for this persona yet.</li>';
        return;
    }

    listElement.innerHTML = person.achievements
         .map(id => achievementList[id]) // Get full achievement data
         .filter(Boolean) // Filter out any invalid IDs
         .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
         .map(ach => `
            <li>
                 <span class="achievement-icon" title="${this.escapeHTML(ach.desc)}">${ach.name.match(/(\p{Emoji})/u)?.[0] || '🏆'}</span>
                 <span class="achievement-name">${this.escapeHTML(ach.name)}</span>
            </li>
        `).join('');
  }

  showAchievements() {
     const body = this.elements.achievementsBody;
     if (!body || !this.elements.achievementsModal) {
          console.error("Achievements modal or body element not found.");
          this.showNotification("UI Error: Cannot display achievements.", "error");
          return;
     }

      // Calculate overall unlocked achievements
      let unlockedAppLevel = new Set(); // For app-wide achievements
      let unlockedPersonaLevel = new Set(); // For achievements tied to any persona
      this.people.forEach(p => {
          p.achievements?.forEach(id => unlockedPersonaLevel.add(id));
      });
      // Add app-level achievements (e.g., glossary user - granted to dummy object {})
      // This requires a way to store app-level achievements, let's simulate for now
       if (localStorage.getItem('kinkCompass_glossary_used')) unlockedAppLevel.add('glossary_user');
       if (localStorage.getItem('kinkCompass_resource_reader')) unlockedAppLevel.add('resource_reader');
       if (localStorage.getItem('kinkCompass_theme_changer')) unlockedAppLevel.add('theme_changer');
       if (localStorage.getItem('kinkCompass_data_exported')) unlockedAppLevel.add('data_exported');
       if (localStorage.getItem('kinkCompass_data_imported')) unlockedAppLevel.add('data_imported');
       // Combine sets
       const allUnlockedIds = new Set([...unlockedAppLevel, ...unlockedPersonaLevel]);


      let html = `<p>Showing all possible achievements. Unlocked achievements are highlighted!</p>`;
      html += '<ul class="all-achievements-list">';

      Object.entries(achievementList)
          .sort((a, b) => a[1].name.localeCompare(b[1].name))
          .forEach(([id, ach]) => {
              const isUnlocked = allUnlockedIds.has(id);
              html += `
                  <li class="${isUnlocked ? 'unlocked' : 'locked'}">
                      <span class="achievement-icon">${ach.name.match(/(\p{Emoji})/u)?.[0] || '🏆'}</span>
                      <div class="achievement-details">
                          <span class="achievement-name">${this.escapeHTML(ach.name)}</span>
                          <span class="achievement-desc">${isUnlocked ? this.escapeHTML(ach.desc) : '???'}</span>
                      </div>
                  </li>
              `;
          });

      html += '</ul>';
      body.innerHTML = html;
      this.openModal(this.elements.achievementsModal);
  }

  showKinkReading(personId) {
     const outputElement = document.getElementById(`kink-reading-output-${personId}`);
     const person = this.people.find(p => p.id == personId);

     if (!outputElement || !person) {
         console.error("Could not find output element or person for kink reading.");
         this.showNotification("Error generating reading.", "error");
         if(outputElement) outputElement.innerHTML = '<p class="error-text">Could not generate reading.</p>';
         return;
     }

     outputElement.innerHTML = '<p class="loading-text">Consulting the compass...</p>'; // Loading state

     // Generate Reading Logic
     try {
         let reading = `<p>✨ <strong>${this.escapeHTML(person.name)}'s Compass Reading</strong> ✨</p>`;
         reading += `<p>Your chosen path is <strong>${this.escapeHTML(person.style)}</strong> within the <strong>${this.escapeHTML(person.role)}</strong> role.</p>`;

         const styleEssence = this.getStyleEssence(person.style);
         if(styleEssence) reading += `<p><em>Essence: ${this.escapeHTML(styleEssence)}</em></p>`;

         // Get top 3 and bottom 2 traits
         const sortedTraits = Object.entries(person.traits)
             .map(([name, score]) => ({ name, score: parseInt(score, 10) }))
             .filter(t => !isNaN(t.score)) // Ensure score is a number
             .sort((a, b) => b.score - a.score);

         if (sortedTraits.length > 0) {
             reading += "<hr><h4>Key Traits:</h4><ul>";
             // Top Traits
             sortedTraits.slice(0, 3).forEach(t => {
                 const descriptor = this.getReadingDescriptor(t.name, t.score);
                 const displayName = t.name.charAt(0).toUpperCase() + t.name.slice(1).replace(/([A-Z])/g, ' $1');
                 reading += `<li><strong>${this.escapeHTML(displayName)} (${t.score}/5):</strong> ${this.escapeHTML(descriptor)}</li>`;
             });
             reading += "</ul>";

             // Growth Traits (Bottom 2, if more than 3 traits exist)
             if (sortedTraits.length > 3) {
                 reading += "<h4>Potential Growth Areas:</h4><ul>";
                 sortedTraits.slice(-2).forEach(t => {
                      const descriptor = this.getReadingDescriptor(t.name, t.score);
                      const displayName = t.name.charAt(0).toUpperCase() + t.name.slice(1).replace(/([A-Z])/g, ' $1');
                      reading += `<li><strong>${this.escapeHTML(displayName)} (${t.score}/5):</strong> ${this.escapeHTML(descriptor)}</li>`;
                 });
                 reading += "</ul>";
             }
         } else {
              reading += "<p>No specific trait scores recorded yet for a detailed reading.</p>";
         }

         // Add a concluding thought
         const possibilities = [
             "Your journey is unique and unfolding beautifully.",
             "Continue exploring with curiosity and open communication.",
             "Trust your intuition as you navigate your desires.",
             "Remember safety, consent, and self-awareness on your path.",
             "The compass points towards exciting possibilities!"
         ];
         reading += `<hr><p><em>${possibilities[Math.floor(Math.random() * possibilities.length)]}</em></p>`;

         outputElement.innerHTML = reading;
         grantAchievement(person, 'kink_reading');
     } catch (error) {
          console.error("Error during kink reading generation:", error);
          outputElement.innerHTML = '<p class="error-text">An error occurred while generating the reading.</p>';
     }
  }

   getReadingDescriptor(traitName, score) {
      // Simple descriptors based on score - EXPAND these!
      const levels = {
          1: ["Minimal expression of", "Low focus on", "Exploring the opposite of"],
          2: ["Developing awareness of", "Cautiously exploring", "Building foundations in"],
          3: ["Balanced approach to", "Comfortable with", "Finding footing in"],
          4: ["Strongly embodies", "Confidently expresses", "Leaning heavily into"],
          5: ["Mastery of", "Deeply integrated", "Exemplifies"]
      };
       const genericDescriptors = {
            1: "a potential growth area.",
            2: "an area of development.",
            3: "a balanced aspect.",
            4: "a defining characteristic.",
            5: "a core strength."
       };

      const levelDesc = levels[score] ? levels[score][Math.floor(Math.random() * levels[score].length)] : "";
       const genericDesc = genericDescriptors[score] || "";

       // You could add specific interpretations per trait here if desired
       // e.g., if (traitName === 'obedience') { ... return specific text ... }

      return `${levelDesc} ${traitName} - ${genericDesc}`;
  }

   getStyleEssence(styleName) {
       // Find the style object in bdsmData across all roles
       let styleData = null;
       for (const roleKey in bdsmData) {
           styleData = bdsmData[roleKey]?.styles?.find(s => s.name === styleName);
           if (styleData) break;
       }
       return styleData?.summary || null; // Return the summary if found
   }


  // --- Style Finder Methods ---
  sfStart() {
    console.log("Starting Style Finder...");
    this.sfActive = true;
    this.sfStep = 0;
    this.sfRole = null; // Will be set in step 1
    this.sfIdentifiedRole = null; // Clear previous result
    this.sfAnswers = { rolePreference: null, traits: {} };
    this.sfScores = {};
    this.sfPreviousScores = {};
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = [];
    this.sfShowDashboardDuringTraits = false; // Reset dashboard visibility preference

    this.sfCalculateSteps(); // Calculate steps based on initial state
    this.openModal(this.elements.sfModal); // Open the modal first
    this.sfRenderStep(); // Then render the first step
    this.sfShowFeedback("Let’s begin your style quest! ✨");
  }

  sfClose() {
    console.log("Closing Style Finder...");
    this.sfActive = false;
    // Don't reset state here, might want to resume later? Or reset explicitly if needed.
    this.closeModal(this.elements.sfModal);
  }

  sfCalculateSteps() {
    this.sfSteps = [];
    this.sfSteps.push({ type: 'welcome' });
    this.sfSteps.push({ type: 'rolePreference' }); // Ask preference first

    if (this.sfAnswers.rolePreference) {
        this.sfRole = this.sfAnswers.rolePreference; // Set the role for trait selection
        // Determine trait set based on chosen role preference
        if (this.sfRole === 'dominant') {
            this.sfTraitSet = [...this.sfDomFinderTraits].sort(() => 0.5 - Math.random());
        } else if (this.sfRole === 'submissive') {
            this.sfTraitSet = [...this.sfSubFinderTraits].sort(() => 0.5 - Math.random());
        } else { // Switch or undecided - maybe offer core traits from both? Simplified: Use submissive for now.
             console.warn("Style Finder: 'Switch' role selected, using Submissive traits for quiz.");
             this.sfTraitSet = [...this.sfSubFinderTraits].sort(() => 0.5 - Math.random());
             this.sfRole = 'submissive'; // Temporarily use sub for scoring traits
        }

        // Add trait steps only if a role preference is set and traits exist
        if (this.sfTraitSet.length > 0) {
            this.sfTraitSet.forEach(trait => this.sfSteps.push({ type: 'trait', trait: trait.name }));
            this.sfSteps.push({ type: 'roundSummary', round: 'Traits' });
        } else {
            console.warn(`No traits found for role preference: ${this.sfAnswers.rolePreference}`);
        }
    }
    // Result step is always last
    this.sfSteps.push({ type: 'result' });

    console.log("Calculated SF Steps:", this.sfSteps.map(s => s.type + (s.trait ? ` (${s.trait})` : '')));
  }

   sfRenderStep() {
    if (!this.sfActive || !this.elements.sfStepContent) return;
     const sfContent = this.elements.sfStepContent;
     sfContent.classList.add('loading'); // Add loading overlay

     // Ensure step index is valid
     if (this.sfStep < 0) this.sfStep = 0;
     if (this.sfStep >= this.sfSteps.length) this.sfStep = this.sfSteps.length - 1;

     const step = this.sfSteps[this.sfStep];
     if (!step) {
         console.error("Invalid Style Finder step:", this.sfStep);
         sfContent.innerHTML = '<p class="error-text">Error: Could not load this step.</p>';
         sfContent.classList.remove('loading');
         return;
     }

     let html = "";
     const totalSteps = this.sfSteps.length;
     const currentStepNum = this.sfStep + 1;
     let questionsLeft = 0;

     // Update progress tracker
     if (step.type === 'trait') {
         const currentTraitIndex = this.sfTraitSet.findIndex(t => t.name === step.trait);
         questionsLeft = this.sfTraitSet.length - currentTraitIndex;
         this.elements.sfProgressTracker.textContent = `Question ${currentTraitIndex + 1} of ${this.sfTraitSet.length} | Step ${currentStepNum} of ${totalSteps}`;
         this.elements.sfProgressTracker.style.display = 'block';
     } else if (step.type === 'result' || step.type === 'welcome') {
         this.elements.sfProgressTracker.style.display = 'none';
     } else {
         this.elements.sfProgressTracker.textContent = `Step ${currentStepNum} of ${totalSteps}`;
         this.elements.sfProgressTracker.style.display = 'block';
     }


    console.log(`Rendering SF Step ${this.sfStep}: Type=${step.type}`, step);

    // Clear previous content immediately before adding new HTML
    sfContent.innerHTML = '';


     // --- Generate HTML based on step type ---
     try { // Add try-catch for HTML generation
        switch (step.type) {
            case 'welcome':
                html += `
                    <h2>Welcome, Style Seeker!</h2>
                    <p>Ready to uncover your unique Kink Compass style? This quick quest will help guide you. ✨</p>
                    <div class="sf-button-container">
                        <button data-action="start">Begin Quest!</button>
                    </div>
                `;
                break;

            case 'rolePreference':
                html += `
                    <h2>Choose Your Vibe!</h2>
                    <p>Do you generally prefer taking the lead, or following your partner's guidance? (You can explore both later!)</p>
                    <div class="sf-button-container">
                        <button data-action="setRole" data-value="dominant">Lead (Dominant)</button>
                        <button data-action="setRole" data-value="submissive">Follow (Submissive)</button>
                        <button data-action="setRole" data-value="switch">Both/Fluid (Switch)</button>
                    </div>
                     <div class="sf-button-container" style="margin-top: 20px;">
                         <button data-action="prev" class="secondary-btn">Back</button>
                     </div>
                `;
                break;

             case 'trait':
                 if (!this.sfRole) { // Should not happen if steps are calculated correctly
                     html = `<p class="error-text">Please go back and select a role preference first.</p>`;
                      this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference'); // Force back
                     break;
                 }
                 const traitObj = this.sfTraitSet.find(t => t.name === step.trait);
                 if (!traitObj) {
                      html = `<p class="error-text">Error: Trait '${step.trait}' definition not found.</p>`;
                      break; // Skip this step if trait data is missing
                 }

                 const currentValue = this.sfAnswers.traits[traitObj.name] ?? 5; // Default to middle value (5)
                 const footnoteSet = (this.sfRole === 'dominant' ? this.sfDomTraitFootnotes : this.sfSubTraitFootnotes);
                 const footnote = footnoteSet[traitObj.name] || "1: Low / 10: High";
                 const sliderDescriptions = this.sfSliderDescriptions[traitObj.name];
                 const currentDesc = (sliderDescriptions && sliderDescriptions[currentValue - 1]) ? sliderDescriptions[currentValue - 1] : "How does this resonate?";
                 const isFirstTrait = this.sfTraitSet.findIndex(t => t.name === step.trait) === 0;

                 html += `
                     <h2>${this.escapeHTML(traitObj.desc)}
                         <span class="sf-info-icon" data-trait="${traitObj.name}" title="More info about this trait" aria-label="More info about ${this.escapeHTML(traitObj.desc)}">ℹ️</span>
                     </h2>
                     ${isFirstTrait ? '<p class="muted-text">Slide to rate how much this resonates (1 = Not Me, 10 = Totally Me).</p>' : ''}
                     <input type="range" min="1" max="10" value="${currentValue}"
                            class="sf-trait-slider" data-trait="${traitObj.name}"
                            aria-label="${this.escapeHTML(traitObj.desc)}"
                            aria-describedby="sf-desc-${traitObj.name} sf-footnote-${traitObj.name}">
                     <div id="sf-desc-${traitObj.name}" class="sf-slider-description" aria-live="polite">${this.escapeHTML(currentDesc)}</div>
                     <p id="sf-footnote-${traitObj.name}" class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                     <div class="sf-button-container" style="margin-top: 15px;">
                        <button data-action="next" data-trait="${traitObj.name}">Next <span aria-hidden="true">&rarr;</span></button>
                        <button data-action="prev" class="secondary-btn"><span aria-hidden="true">&larr;</span> Back</button>
                        ${this.sfTraitSet.length > 3 ? `<button data-action="toggleDashboard" class="tertiary-btn" title="Show/Hide Live Vibe Scores" aria-label="Show or hide live vibe scores">${this.sfShowDashboardDuringTraits ? '📊 Hide' : '📊 Show'} Vibes</button>` : ''}
                     </div>
                 `;
                 break;

            case 'roundSummary': // Optional summary step
                 const topStyles = Object.entries(this.sfScores)
                     .sort((a, b) => b[1] - a[1])
                     .slice(0, 3)
                     .map(([style]) => style);
                 html += `
                     <h2>Quick Check-In!</h2>
                     <p>Based on your answers, here are your top vibes so far:</p>
                     <div id="sf-summary-dashboard"> ${this.sfGenerateSummaryDashboard()} </div>
                     ${topStyles.length ? `<p><em>Strongest Connections: ${topStyles.join(', ')}</em></p>` : ''}
                     <div class="sf-button-container">
                         <button data-action="next">See Your Result! 🎉</button>
                         <button data-action="prev" class="secondary-btn">Back</button>
                     </div>
                 `;
                 break;

            case 'result':
                this.sfCalculateResult(); // Final calculation
                 if (Object.keys(this.sfScores).length === 0) {
                     html = `
                         <h2>Hmm... Inconclusive! 🤔</h2>
                         <p>We couldn't determine a clear style based on your answers. This might happen if your answers were very neutral or if data is missing.</p>
                         <p>Consider exploring the <button class="link-button" onclick="kinkCompassApp.showStyleDiscovery()">Style Discovery</button> section or try the finder again!</p>
                         <div class="sf-button-container">
                             <button data-action="startOver">Try Again?</button>
                             <button data-action="prev" class="secondary-btn">Back</button>
                         </div>
                     `;
                     break; // Exit result case if no scores
                 }

                // Get Top Style and related data
                const sortedScores = Object.entries(this.sfScores).sort((a, b) => b[1] - a[1]);
                 const topStyleName = sortedScores[0][0];
                 this.sfIdentifiedRole = this.sfRole; // Store the role used for scoring

                const descData = this.sfStyleDescriptions[topStyleName];
                 const matchData = this.sfDynamicMatches[topStyleName];

                 if (!descData || !matchData) {
                     console.error(`Missing description or match data for result style: ${topStyleName}`);
                     html = `<p class="error-text">Error: Could not load details for style '${topStyleName}'.</p>`;
                     // Add back/start over buttons here too
                      html += `
                         <div class="sf-button-container">
                             <button data-action="startOver">Start Over</button>
                              <button data-action="prev" class="secondary-btn">Back</button>
                         </div>`;
                     break;
                 }


                 html += `
                     <div class="sf-result-section sfFadeIn">
                         <h2 class="sf-result-heading">🎉 Your Kink Compass Style: ${this.escapeHTML(topStyleName)} 🎉</h2>
                         <p><strong>${this.escapeHTML(descData.short)}</strong></p>
                         <p>${this.escapeHTML(descData.long)}</p>
                         <h3>Likely Dynamic Match: ${this.escapeHTML(matchData.match)}</h3>
                         <p><em>Dynamic Type: ${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.desc)}</p>
                         <p>${this.escapeHTML(matchData.longDesc)}</p>
                         <h3>🧭 Exploration Tips:</h3>
                         <ul style="text-align: left; margin: 10px auto; max-width: 90%; list-style: '✧ '; padding-left: 1.5em;">
                           ${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}
                         </ul>
                         <div class="sf-result-buttons">
                           <button data-action="applyStyle" data-value="${this.escapeHTML(topStyleName)}">Apply to Form?</button>
                           <button data-action="showDetails" data-value="${this.escapeHTML(topStyleName)}">More Details</button>
                           <button data-action="startOver" class="secondary-btn">Start Over</button>
                            <button data-action="prev" class="tertiary-btn">Back</button>
                         </div>
                     </div>
                 `;
                 // Trigger confetti after a short delay
                 setTimeout(() => {
                      if(typeof confetti === 'function') {
                          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                      }
                 }, 300); // Delay confetti slightly
                 grantAchievement({}, 'style_finder_complete'); // Grant app-level achievement
                break;

            default:
                html = `<p>Unknown step type: ${step.type}</p>`;
        }

       } catch (renderError) {
          console.error(`Error generating HTML for SF step type ${step.type}:`, renderError);
          html = `<p class="error-text">Sorry, an error occurred while loading this step.</p><div class="sf-button-container"><button data-action="prev" class="secondary-btn">Back</button></div>`;
       }

     // --- Update DOM ---
     this.elements.sfStepContent.innerHTML = html;

    // Update dashboard visibility *after* rendering content
    this.sfUpdateDashboard(step.type === 'result' || step.type === 'roundSummary'); // Force show on result/summary

     // Remove loading state after rendering
     sfContent.classList.remove('loading');

     // Focus management: Focus the first interactive element in the new step
      requestAnimationFrame(() => { // Allow DOM update first
        const firstFocusable = sfContent.querySelector('button, input[type="range"]');
        firstFocusable?.focus();
      });

  }

  sfSetRole(role) {
    console.log(`SF Role Preference Set: ${role}`);
    this.sfAnswers.rolePreference = role;
    this.sfCalculateSteps(); // Recalculate steps now that role is known
    this.sfNextStep(); // Move to the next step (likely the first trait)
  }


  sfSetTrait(trait, value) {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        console.warn(`Invalid value for trait ${trait}: ${value}`);
        return;
    }
    this.sfAnswers.traits[trait] = intValue;
    // Feedback is now shown via slider description update
    // this.sfShowFeedback(`Vibe for ${trait} set to ${intValue}!`);
  }


  sfNextStep(currentTrait = null) {
    // If on a trait step, check if an answer exists (default is 5, so always exists if rendered)
    const currentStepConfig = this.sfSteps[this.sfStep];
     if (currentStepConfig?.type === 'trait') {
         const traitName = currentStepConfig.trait;
         if (this.sfAnswers.traits[traitName] === undefined) {
             // If somehow no answer is set (shouldn't happen with default), set it now
             console.warn(`No answer found for trait ${traitName} when moving next, defaulting to 5.`);
             this.sfSetTrait(traitName, 5);
             // Optional: Show feedback if needed
             // this.sfShowFeedback("Using default vibe for this trait.");
         }
     }

    if (this.sfStep < this.sfSteps.length - 1) {
        this.sfStep++;
        console.log("Moving to SF Step:", this.sfStep);
        this.sfRenderStep();
    } else {
        console.log("Already at the last SF step.");
        // Optionally re-render result if called again?
        if (currentStepConfig?.type === 'result') {
             this.sfRenderStep();
        }
    }
  }


  sfPrevStep() {
    if (this.sfStep > 0) {
      this.sfStep--;
      console.log("Moving back to SF Step:", this.sfStep);
        // If moving back TO rolePreference step, reset the chosen role and traits
        if(this.sfSteps[this.sfStep]?.type === 'rolePreference') {
             console.log("Resetting role preference and trait answers.");
             this.sfAnswers.rolePreference = null;
             this.sfRole = null;
             this.sfAnswers.traits = {};
             this.sfTraitSet = [];
             this.sfScores = {}; // Clear scores as role is changing
             this.sfPreviousScores = {};
             this.sfCalculateSteps(); // Recalculate steps to remove trait questions
        }
      this.sfRenderStep();
    } else {
        console.log("Already at the first SF step.");
    }
  }


  sfStartOver() {
    console.log("SF Starting Over...");
    // Keep sfActive = true
    this.sfStep = 0; // Go back to welcome step
    this.sfRole = null;
    this.sfIdentifiedRole = null;
    this.sfAnswers = { rolePreference: null, traits: {} }; // Clear all answers
    this.sfScores = {};
    this.sfPreviousScores = {};
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = [];
     this.sfShowDashboardDuringTraits = false; // Reset dashboard pref
    this.sfCalculateSteps(); // Recalculate steps
    this.sfRenderStep(); // Render welcome step
    this.sfShowFeedback("Fresh start! Let's find your style. ✨");
     this.elements.sfDashboard.style.display = 'none'; // Ensure dashboard is hidden
  }


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

      const traitCount = Object.keys(traitAnswers).length;
      if (traitCount === 0) {
          console.warn("sfComputeScores - No trait answers available to compute scores.");
          return scores; // No answers, no scores
      }

      Object.keys(traitAnswers).forEach(trait => {
          const rating = traitAnswers[trait] ?? 0; // Should have a value from slider
          // Check 2: Does this loop run?
          // console.log(`sfComputeScores - Processing trait: ${trait}, Rating: ${rating}`); // Can be noisy

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
                  // --- Scoring Logic ---
                  // Base score is the rating (1-10)
                  // Simple weighting: add more points for higher ratings?
                  // Example: make higher ratings count more exponentially?
                  // let scoreContribution = rating; // Simple
                  // let scoreContribution = Math.pow(rating / 2, 2); // Exponential example (adjust factor)
                  let scoreContribution = rating * 1.5; // Weighted linear

                  scores[style] += scoreContribution;
                  // Check 5: Is the score actually increasing?
                  // console.log(`sfComputeScores - Matched! Style: ${style}, Trait: ${trait}, Added: ${scoreContribution.toFixed(1)}, New Score: ${scores[style].toFixed(1)}`); // Can be noisy
              }
          });
      });

      // --- Normalization ---
      // Find max possible score for normalization (approximate)
       // Max rating = 10. Max weighted contribution per trait match = 10 * 1.5 = 15.
       // A style might match ~3-5 key traits. Max score ~ 45-75 ?
       // Let's normalize based on number of traits answered and max weighted score.
       const maxPossibleTotalScore = traitCount * 10 * 1.5; // Max possible if all traits were key traits for a style

      Object.keys(scores).forEach(style => {
           // Avoid division by zero, ensure score is not negative
           scores[style] = Math.max(0, scores[style]);
           if (maxPossibleTotalScore > 0) {
                // Normalize to a 0-100 scale (or similar)
                 // This normalization is tricky because not all styles use all traits.
                 // A simpler approach might be relative scoring later.
                 // Let's just keep the raw weighted score for now and sort.
                 scores[style] = parseFloat(scores[style].toFixed(1)); // Keep one decimal place
           } else {
                scores[style] = 0;
           }

      });


      console.log("sfComputeScores - Final Scores:", scores); // Check final object
      return scores;
  }


  sfUpdateDashboard(forceVisible = false) {
    const dashboardElement = this.elements.sfDashboard;
    if (!dashboardElement) return;

    const currentStepConfig = this.sfSteps[this.sfStep];
     const isTraitStep = currentStepConfig?.type === 'trait';

     // Determine if dashboard should be shown
     const shouldShow = forceVisible || (isTraitStep && this.sfShowDashboardDuringTraits) || (!isTraitStep && currentStepConfig?.type !== 'welcome' && currentStepConfig?.type !== 'rolePreference');


     if (!this.sfRole || Object.keys(this.sfAnswers.traits).length === 0 || !shouldShow) {
         dashboardElement.style.display = 'none';
         dashboardElement.innerHTML = ''; // Clear content when hidden
         this.sfHasRenderedDashboard = false;
         return;
     }

     dashboardElement.style.display = 'block';

     const currentScores = this.sfComputeScores();
     const sortedScores = Object.entries(currentScores)
         .filter(([, score]) => score > 0) // Only show styles with non-zero score
         .sort((a, b) => b[1] - a[1])
         .slice(0, 7); // Show top ~7 vibes

     if (sortedScores.length === 0 && !this.sfHasRenderedDashboard) {
          // Don't show empty dashboard on first trait render if no scores yet
          dashboardElement.style.display = 'none';
          return;
     }


     let dashboardHTML = `<div class='sf-dashboard-header'>✨ Your Live Vibes ✨</div>`;
     const styleIcons = this.getStyleIcons(); // Get emoji map

     const previousPositions = {};
     Object.entries(this.sfPreviousScores)
         .sort((a, b) => b[1] - a[1])
         .forEach(([style], index) => {
             previousPositions[style] = index;
         });

     const isFirstRender = !this.sfHasRenderedDashboard;

     if (sortedScores.length === 0) {
          dashboardHTML += `<p class="muted-text">Keep rating to see your vibes emerge...</p>`;
     } else {
        sortedScores.forEach(([style, score], index) => {
            const prevPos = previousPositions[style] ?? index; // Default to current position if new
            const movement = prevPos - index;
            let moveIndicator = '';
            if (!isFirstRender && movement > 0) moveIndicator = '<span class="sf-move-up" aria-label="Moved up">↑</span>';
            else if (!isFirstRender && movement < 0) moveIndicator = '<span class="sf-move-down" aria-label="Moved down">↓</span>';

            const prevScore = this.sfPreviousScores[style] ?? 0;
            const delta = score - prevScore;
            let deltaSpan = '';
            // Show delta only if significant and not first render
            if (!isFirstRender && Math.abs(delta) > 0.1) {
                 deltaSpan = `<span class="sf-score-delta ${delta > 0 ? 'positive' : 'negative'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>`;
            }


            const animationStyle = isFirstRender ? 'style="animation: sfSlideIn 0.3s ease forwards;"' : '';
            const icon = styleIcons[style] || '🌟';

            dashboardHTML += `
              <div class="sf-dashboard-item" ${animationStyle}>
                <span class="sf-style-name" title="${style}">${icon} ${style.length > 18 ? style.substring(0, 16) + '...' : style}</span>
                <span class="sf-dashboard-score">
                  ${score.toFixed(1)}
                  ${deltaSpan}
                  ${moveIndicator}
                </span>
              </div>
            `;
        });
     }


     dashboardElement.innerHTML = dashboardHTML;
     this.sfPreviousScores = { ...currentScores };
     this.sfHasRenderedDashboard = true;
}

  toggleStyleFinderDashboard() {
        this.sfShowDashboardDuringTraits = !this.sfShowDashboardDuringTraits;
        console.log("SF Dashboard Visibility Toggled:", this.sfShowDashboardDuringTraits);
        this.sfRenderStep(); // Re-render current step to update button text and show/hide dashboard
    }


  sfCalculateResult() {
    console.log("Calculating SF Final Result...");
    // Compute final raw scores
    const rawScores = this.sfComputeScores();

    // Normalize or process scores if needed (currently using raw weighted scores)
    // Example normalization (0-100):
    // const maxScore = Math.max(...Object.values(rawScores), 1); // Find max score (at least 1)
    // Object.keys(rawScores).forEach(style => {
    //     this.sfScores[style] = Math.max(0, Math.round((rawScores[style] / maxScore) * 100));
    // });

     // Using direct weighted scores, ensure they are numbers
      Object.keys(rawScores).forEach(style => {
          this.sfScores[style] = parseFloat(rawScores[style].toFixed(1)) || 0;
      });

    console.log("SF Final Processed Scores:", this.sfScores);
  }

  sfGenerateSummaryDashboard() {
     // Similar to sfUpdateDashboard but simplified for summary step
     const scores = this.sfComputeScores(); // Use current computed scores
     const sortedScores = Object.entries(scores)
         .filter(([, score]) => score > 0)
         .sort((a, b) => b[1] - a[1])
         .slice(0, 5); // Show top 5

     if (sortedScores.length === 0) {
         return '<p class="muted-text">Rate some traits to see vibes...</p>';
     }

     const styleIcons = this.getStyleIcons();
     let html = '';
     sortedScores.forEach(([style, score]) => {
         const icon = styleIcons[style] || '🌟';
         html += `
             <div class="sf-dashboard-item">
                 <span class="sf-style-name">${icon} ${this.escapeHTML(style)}</span>
                 <span class="sf-dashboard-score">${score.toFixed(1)}</span>
             </div>
         `;
     });
     return html;
  }

  sfShowFeedback(message) {
    if (!this.elements.sfFeedback) return;
    this.elements.sfFeedback.textContent = message;
    this.elements.sfFeedback.classList.remove('sfBounce'); // Remove previous animation class
    void this.elements.sfFeedback.offsetWidth; // Trigger reflow
    this.elements.sfFeedback.classList.add('sfBounce'); // Add animation class
  }

  sfShowTraitInfo(traitName) {
    const explanation = this.sfTraitExplanations[traitName] || "No extra info available for this trait.";
    const displayName = traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1');

    // Remove existing popups first
    document.querySelectorAll('.sf-style-info-popup').forEach(p => p.remove());

    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup sfFadeIn'; // Use general popup class
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-popup-title');

    popup.innerHTML = `
      <h3 id="sf-popup-title">${this.escapeHTML(displayName)}</h3>
      <p>${this.escapeHTML(explanation)}</p>
      <button class="sf-close-btn" aria-label="Close trait info" onclick="this.closest('.sf-style-info-popup').remove()">×</button>
    `;
    document.body.appendChild(popup); // Append to body to ensure it's on top
     // Focus the close button for accessibility
     popup.querySelector('.sf-close-btn')?.focus();
     // Mark icon as active for click-outside logic
     document.querySelectorAll('.sf-info-icon').forEach(i => i.classList.remove('active'));
     this.elements.sfStepContent.querySelector(`.sf-info-icon[data-trait="${traitName}"]`)?.classList.add('active');
  }


  sfShowFullDetails(styleName) {
    const descData = this.sfStyleDescriptions[styleName];
    const matchData = this.sfDynamicMatches[styleName];
    if (!descData || !matchData) {
        this.sfShowFeedback(`Error: Details for ${styleName} unavailable.`);
        return;
    }

     // Remove existing popups first
    document.querySelectorAll('.sf-style-info-popup').forEach(p => p.remove());

    const popup = document.createElement('div');
    popup.className = 'sf-style-info-popup wide-popup sfFadeIn'; // Use general class + wide modifier
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'sf-popup-title');

    popup.innerHTML = `
      <h3 id="sf-popup-title">${this.escapeHTML(styleName)}</h3>
      <p><strong>${this.escapeHTML(descData.short)}</strong></p>
      <p>${this.escapeHTML(descData.long)}</p>
      <h4>Dynamic Match: ${this.escapeHTML(matchData.match)}</h4>
      <p><em>Type: ${this.escapeHTML(matchData.dynamic)}</em></p>
      <p>${this.escapeHTML(matchData.longDesc || matchData.desc)}</p>
      <h4>Tips & Considerations:</h4>
      <ul style="text-align: left; margin-top: 0.5em; padding-left: 1.5em; list-style: '✧ ';">
          ${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}
      </ul>
      <button class="sf-close-btn" aria-label="Close style details" onclick="this.closest('.sf-style-info-popup').remove()">×</button>
    `;
    document.body.appendChild(popup);
    // Focus the close button
     popup.querySelector('.sf-close-btn')?.focus();
     // Deactivate button after popup closes (handled by click outside or close button)
  }

  getStyleIcons() {
        // Generate icons from full style list (less manual maintenance)
        const icons = {};
         Object.values(this.sfStyles).flat().forEach(styleName => {
            const emojiMatch = styleName.match(/(\p{Emoji})/u);
            if (emojiMatch) {
                icons[styleName] = emojiMatch[0];
            } else {
                // Fallback icon based on role maybe?
                if (this.sfStyles.dominant.includes(styleName)) icons[styleName] = '👑';
                else if (this.sfStyles.submissive.includes(styleName)) icons[styleName] = '💖';
                else icons[styleName] = '🌟'; // Default fallback
            }
        });
        return icons;
   }

   confirmApplyStyleFinderResult(role, style) {
       if (!role || !style) {
           this.showNotification("Cannot apply style: Role or Style missing from result.", "error");
           return;
       }

       const msg = `Apply Role '${role}' and Style '${style}' to the main form?\n\nThis will overwrite current form selections.`;
       if (confirm(msg)) {
           this.applyStyleFinderResult(role, style);
           this.sfClose(); // Close finder after applying
       }
   }

   applyStyleFinderResult(role, style) {
        if (!this.elements.role || !this.elements.style) {
            this.showNotification("Cannot apply style: Form elements missing.", "error");
            return;
        }
        console.log(`Applying SF Result: Role=${role}, Style=${style}`);

        // Set Role
        this.elements.role.value = role;
        // Trigger change event for role to update style options
        this.elements.role.dispatchEvent(new Event('change'));

        // Set Style (needs slight delay for options to populate)
         // Use requestAnimationFrame to wait for the next browser repaint after options are added
        requestAnimationFrame(() => {
            this.elements.style.value = style;
            // Trigger change event for style to update traits
            this.elements.style.dispatchEvent(new Event('change'));

             // Apply trait scores (optional - could be confusing)
             // If you want to apply the quiz answers to the main form:
             // requestAnimationFrame(() => { // Another frame just in case traits need rendering
             //    Object.entries(this.sfAnswers.traits).forEach(([traitName, score]) => {
             //       const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
             //       // Convert 1-10 quiz score to 1-5 form score
             //       const formScore = Math.max(1, Math.min(5, Math.round(score / 2)));
             //        if (slider) {
             //           slider.value = formScore;
             //           const display = slider.closest('.trait')?.querySelector('.trait-value');
             //           if (display) display.textContent = formScore;
             //           this.updateTraitDescription(slider); // Update description too
             //       }
             //    });
             //    this.updateLivePreview(); // Update preview with applied traits
             //    this.showNotification(`Style '${style}' and Role '${role}' applied! (Quiz traits NOT applied to form).`, "success");
             // });

             this.updateLivePreview(); // Update preview with new role/style
             this.showNotification(`Style '${style}' and Role '${role}' applied to form!`, "success");

             // Focus the name field in the main form
            this.elements.name?.focus();
        });
   }


  // --- Other Helper Functions ---
  getFlairForScore(s) {
    const score = Number(s); // Ensure it's a number
    if (isNaN(score)) return ''; // Handle non-numeric input
    if (score >= 5) return '🌟';
    if (score >= 4) return '✨';
    if (score >= 3) return '👍';
    if (score >= 2) return '🌱';
    return '🤔';
   }

   getEmojiForScore(s) {
    const score = Number(s);
    if (isNaN(score)) return '❔'; // Question mark for unknown
    if (score >= 5) return '🔥'; // Fire for max
    if (score >= 4) return '💪'; // Muscle for high
    if (score >= 3) return '😊'; // Smile for medium
    if (score >= 2) return '👀'; // Eyes for low-medium
    return '💧'; // Drop for low
  }

  // Corrected: Removed misplaced brace from here
  escapeHTML(str){
      const div=document.createElement('div');
      div.textContent = str ?? ''; // Use nullish coalescing for safety
      return div.innerHTML;
  } // <<< CORRECT end of escapeHTML function


  getIntroForStyle(styleName){
      const descData = this.sfStyleDescriptions[styleName];
      // Return a slightly more engaging intro line if available
      return descData ? `"${descData.short}" - ${descData.long.split('.')[0]}.` : null;
  }


  showNotification(message, type = 'info', duration = 4000) {
    // Find or create notification element
    let notificationElement = document.getElementById('app-notification');
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.id = 'app-notification';
        document.body.appendChild(notificationElement);
    }

    // Clear existing timer if any
    if (this.notificationTimer) {
        clearTimeout(this.notificationTimer);
    }

    // Apply classes and message
    notificationElement.className = `notification-${type}`; // Reset classes first
    notificationElement.textContent = message;

    // Make visible and animate
    notificationElement.style.display = 'block';
    notificationElement.style.top = '-50px'; // Start off-screen
    notificationElement.style.opacity = '0';

    // Force reflow before applying transition styles
    void notificationElement.offsetWidth;

    notificationElement.style.top = '20px'; // Move into view
    notificationElement.style.opacity = '1';

     // Special class for achievement
     if (type === 'achievement') {
         notificationElement.classList.add('notification-achievement');
     } else {
         notificationElement.classList.remove('notification-achievement');
     }

    // Set timer to hide
    this.notificationTimer = setTimeout(() => {
        notificationElement.style.top = '-50px'; // Move out
        notificationElement.style.opacity = '0';
        // Wait for transition to finish before hiding completely
        setTimeout(() => {
            if(notificationElement) notificationElement.style.display = 'none';
             this.notificationTimer = null; // Clear timer ID
        }, 500); // Match transition duration
    }, duration);
  }

   // --- Modal Management ---
   openModal(modalElement) {
        if (!modalElement) return;
        console.log(`Opening modal: #${modalElement.id}`);

        // Store the element that had focus BEFORE opening the modal
        this.elementThatOpenedModal = document.activeElement;
        console.log("Element that opened modal:", this.elementThatOpenedModal);


        modalElement.setAttribute('aria-hidden', 'false');
        modalElement.style.display = 'flex'; // Use flex for centering

        // Focus the modal container or the close button after opening
        requestAnimationFrame(() => { // Allow modal to render first
            const focusableElement = modalElement.querySelector('.modal-close, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElement) {
                focusableElement.focus();
                console.log("Focused element inside modal:", focusableElement);
            } else {
                 modalElement.focus(); // Fallback to modal container
                 console.log("Focused modal container.");
            }
        });
    }

   closeModal(modalElement) {
        if (!modalElement) return;
        console.log(`Closing modal: #${modalElement.id}`);
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.style.display = 'none';

        // Restore focus to the element that opened the modal
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
