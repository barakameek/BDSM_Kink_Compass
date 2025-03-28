// === app.js === (COMPLETE - With applySavedTheme Fix)

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
    this.sfStyles = {
      submissive: [ 'Classic Submissive', 'Brat', 'Slave', 'Pet', 'Little', 'Puppy', 'Kitten', 'Princess', 'Rope Bunny', 'Masochist', 'Prey', 'Toy', 'Doll', 'Bunny', 'Servant', 'Playmate', 'Babygirl', 'Captive', 'Thrall', 'Puppet', 'Maid', 'Painslut', 'Bottom' ],
      dominant: [ 'Classic Dominant', 'Assertive', 'Nurturer', 'Strict', 'Master', 'Mistress', 'Daddy', 'Mommy', 'Owner', 'Rigger', 'Sadist', 'Hunter', 'Trainer', 'Puppeteer', 'Protector', 'Disciplinarian', 'Caretaker', 'Sir', 'Goddess', 'Commander' ],
      // Add switch styles if they have specific scoring/definitions in the finder
      switch: [ 'Fluid Switch', 'Dominant-Leaning Switch', 'Submissive-Leaning Switch', 'Situational Switch']
    };
    this.sfSubFinderTraits = [
      { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' }, { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' }, { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' }, { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' }, { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' }, { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' }, { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' }, { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' }, { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' }, { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' }, { name: 'painTolerance', desc: 'How do you feel about physical discomfort or pain during play?' }, { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' }, { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' }, { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' }, { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' }, { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' }, { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' }, { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' }, { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' }
    ];
    this.sfSubTraitFootnotes = { obedience: "1: Rarely follows / 10: Always obeys", rebellion: "1: Very compliant / 10: Loves to resist", service: "1: Self-focused / 10: Service-driven", playfulness: "1: Serious / 10: Super playful", sensuality: "1: Not sensory / 10: Highly sensual", exploration: "1: Stays safe / 10: Seeks adventure", devotion: "1: Independent / 10: Deeply devoted", innocence: "1: Mature / 10: Very innocent", mischief: "1: Calm / 10: Mischievous", affection: "1: Distant / 10: Super affectionate", painTolerance: "1: Avoids pain / 10: Embraces sensation", submissionDepth: "1: Light submission / 10: Total surrender", dependence: "1: Self-reliant / 10: Loves guidance", vulnerability: "1: Guarded / 10: Fully open", adaptability: "1: Fixed role / 10: Very versatile", tidiness: "1: Messy and carefree / 10: Obsessed with order", politeness: "1: Casual and blunt / 10: Always courteous", craving: "1: Avoids intensity / 10: Seeks extreme thrills", receptiveness: "1: Closed off / 10: Fully open to input" };
    this.sfDomFinderTraits = [
      { name: 'authority', desc: 'Do you feel strong when you take charge?' }, { name: 'confidence', desc: 'Are you sure of your decisions?' }, { name: 'discipline', desc: 'Do you enjoy setting firm rules?' }, { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' }, { name: 'care', desc: 'Do you love supporting and protecting others?' }, { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' }, { name: 'control', desc: 'Do you thrive on directing every detail?' }, { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' }, { name: 'precision', desc: 'Are you careful with every step you take?' }, { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' }, { name: 'sadism', desc: 'Does giving a little consensual pain excite you?' }, { name: 'leadership', desc: 'Do you naturally guide others forward?' }, { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' }, { name: 'patience', desc: 'Are you calm while teaching or training?' }, { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' }
    ];
    this.sfDomTraitFootnotes = { authority: "1: Gentle / 10: Very commanding", confidence: "1: Hesitant / 10: Rock-solid", discipline: "1: Relaxed / 10: Strict", boldness: "1: Cautious / 10: Fearless", care: "1: Detached / 10: Deeply caring", empathy: "1: Distant / 10: Highly intuitive", control: "1: Hands-off / 10: Total control", creativity: "1: Routine / 10: Very creative", precision: "1: Casual / 10: Meticulous", intensity: "1: Soft / 10: Intense", sadism: "1: Avoids giving pain / 10: Enjoys giving pain", leadership: "1: Follower / 10: Natural leader", possession: "1: Shares / 10: Very possessive", patience: "1: Impatient / 10: Very patient", dominanceDepth: "1: Light control / 10: Full dominance" };

    this.sfSliderDescriptions = { // Copying the full list from previous step
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

    this.sfTraitExplanations = { // Copying from previous step
        obedience: "How much you enjoy following instructions or rules. High = loves obeying; Low = prefers independence.", rebellion: "How much you like playfully resisting or teasing. High = loves defiance; Low = compliant.", service: "Joy derived from helping or performing tasks for others. High = service-driven; Low = self-focused.", playfulness: "Love for silly games, humor, and lightheartedness. High = very playful; Low = serious.", sensuality: "Appreciation for physical sensations, textures, touch. High = very sensory; Low = less focused on touch.", exploration: "Eagerness to try new experiences or push boundaries. High = adventurous; Low = prefers familiarity.", devotion: "Depth of loyalty and commitment to a partner. High = deeply devoted; Low = more independent.", innocence: "Enjoyment of feeling carefree, childlike, or pure. High = embraces innocence; Low = more mature.", mischief: "Enjoyment of stirring things up, pranks, or playful trouble. High = loves mischief; Low = calm.", affection: "Need for physical closeness, cuddles, and reassurance. High = very affectionate; Low = prefers space.", painTolerance: "How you perceive and react to physical discomfort or pain. High = finds interest/pleasure; Low = avoids pain.", submissionDepth: "Willingness to yield control to a partner. High = enjoys total surrender; Low = prefers light guidance.", dependence: "Comfort level in relying on a partner for guidance or decisions. High = enjoys dependence; Low = self-reliant.", vulnerability: "Ease and willingness to show emotional softness or weakness. High = very open; Low = guarded.", adaptability: "Ability to switch between roles or adjust to changing dynamics. High = very flexible; Low = prefers consistency.", tidiness: "Satisfaction derived from neatness and order. High = very tidy; Low = comfortable with mess.", politeness: "Natural inclination towards courteous and respectful behavior. High = very polite; Low = more direct/casual.", craving: "Desire for intense, extreme, or peak sensations/experiences. High = seeks intensity; Low = prefers calm.", receptiveness: "Openness to receiving direction, input, or sensation. High = very receptive; Low = more closed off.", authority: "Natural inclination and comfort in taking charge or leading. High = commanding; Low = prefers following.", confidence: "Self-assuredness in decisions and actions within a dynamic. High = very confident; Low = hesitant.", discipline: "Enjoyment in setting and enforcing rules or structure. High = strict; Low = relaxed.", boldness: "Willingness to take risks or face challenges head-on. High = fearless; Low = cautious.", care: "Focus on supporting, protecting, and nurturing a partner. High = deeply caring; Low = more detached.", empathy: "Ability to understand and connect with a partner's feelings. High = very empathetic; Low = more analytical.", control: "Desire to manage details, actions, or the environment. High = loves control; Low = prefers flow.", creativity: "Enjoyment in crafting unique scenarios, tasks, or experiences. High = very inventive; Low = prefers routine.", precision: "Focus on executing actions or commands meticulously. High = very precise; Low = more casual.", intensity: "The level of emotional or physical energy brought to the dynamic. High = very intense; Low = gentle.", sadism: "Deriving pleasure from consensually inflicting pain or discomfort. High = enjoys inflicting; Low = avoids inflicting.", leadership: "Natural ability to guide, direct, and inspire others. High = strong leader; Low = follower.", possession: "Feeling of ownership or strong connection ('mine') towards a partner. High = very possessive; Low = less possessive.", patience: "Ability to remain calm while guiding, teaching, or waiting. High = very patient; Low = impatient.", dominanceDepth: "Desire for the level of influence or control over a partner. High = seeks total influence; Low = prefers light control."
    };

    this.sfStyleKeyTraits = { // Copying from previous step
        // Submissive Styles
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

        // Dominant Styles
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

        // Switch Styles - Often based on adaptability or core traits of both sides
        // Key traits for scoring *within* the finder might be less defined for Switches
        'Fluid Switch': ['adaptability', 'empathy', 'playfulness'], // Example traits
        'Dominant-Leaning Switch': ['adaptability', 'authority', 'confidence'], // Example
        'Submissive-Leaning Switch': ['adaptability', 'receptiveness', 'obedience'], // Example
        'Situational Switch': ['adaptability', 'communication', 'empathy'] // Example
    };

    this.sfStyleDescriptions = { // Copying from previous step, ensuring Switch styles are present
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

    this.sfDynamicMatches = { // Copying from previous step, ensuring Switch styles are present
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
    console.log("--- End Element Check ---");

    // Critical element check - Ensure role and style dropdowns exist
    if (!this.elements.role || !this.elements.style) {
        console.error("CRITICAL ERROR: Role or Style dropdown element not found on page load. Form functionality will be broken.");
        document.body.insertAdjacentHTML('afterbegin', '<p style="color:red; background:white; padding:10px; border: 2px solid red;">Error: Core form elements missing. App cannot initialize correctly.</p>');
        return; // Stop constructor if critical elements are missing
    }


    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme(); // <<<< THIS IS THE LINE CAUSING THE ERROR
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
        console.log(">>> Role changed!");
        this.renderStyles(e.target.value);
        this.renderTraits(e.target.value, '');
        this.elements.style.value = '';
        this.updateLivePreview();
    });
    this.elements.style?.addEventListener('change', (e) => {
        console.log(">>> Style changed!");
        this.renderTraits(this.elements.role.value, e.target.value);
        this.updateLivePreview();
        this.updateStyleExploreLink();
    });
    this.elements.name?.addEventListener('input', () => {
        console.log(">>> Name input!");
        this.updateLivePreview();
    });
    this.elements.save?.addEventListener('click', () => {
        console.log(">>> Save clicked!");
        this.savePerson();
    });
    this.elements.clearForm?.addEventListener('click', () => {
        console.log(">>> Clear Form clicked!");
        this.resetForm(true);
    });
    this.elements.avatarPicker?.addEventListener('click', (e) => {
        console.log(">>> Avatar Picker clicked!");
        if (e.target.classList.contains('avatar-btn')) {
            const selectedEmoji = e.target.dataset.emoji;
            this.elements.avatarInput.value = selectedEmoji;
            this.elements.avatarDisplay.textContent = selectedEmoji;
            this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
            this.updateLivePreview();
        }
    });

     // Trait Sliders
    this.elements.traitsContainer?.addEventListener('input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.handleTraitSliderInput(e);
            this.updateLivePreview();
        }
    });

    // Trait Info Buttons
    this.elements.traitsContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('trait-info-btn')) {
            console.log(">>> Trait Info button clicked!");
            this.handleTraitInfoClick(e);
        }
    });

    // Context Help Buttons
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
        console.log(">>> Trait Info Close clicked!");
        this.hideTraitInfo();
    });

     // Context Help Popup Close
     this.elements.contextHelpClose?.addEventListener('click', () => {
        console.log(">>> Context Help Close clicked!");
        this.hideContextHelp();
    });

    // List Interaction
    this.elements.peopleList?.addEventListener('click', (e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown', (e) => this.handleListKeydown(e));

    // Modal Closures
    this.elements.modalClose?.addEventListener('click', () => {
        console.log(">>> Detail Modal Close clicked!");
        this.closeModal(this.elements.modal);
    });
    this.elements.resourcesClose?.addEventListener('click', () => {
        console.log(">>> Resources Modal Close clicked!");
        this.closeModal(this.elements.resourcesModal);
    });
    this.elements.glossaryClose?.addEventListener('click', () => {
        console.log(">>> Glossary Modal Close clicked!");
        this.closeModal(this.elements.glossaryModal);
    });
    this.elements.styleDiscoveryClose?.addEventListener('click', () => {
        console.log(">>> Style Discovery Modal Close clicked!");
        this.closeModal(this.elements.styleDiscoveryModal);
    });
     this.elements.themesClose?.addEventListener('click', () => {
        console.log(">>> Themes Modal Close clicked!");
        this.closeModal(this.elements.themesModal);
    });
     this.elements.welcomeClose?.addEventListener('click', () => {
        console.log(">>> Welcome Modal Close clicked!");
        this.closeModal(this.elements.welcomeModal);
    });
     this.elements.achievementsClose?.addEventListener('click', () => {
        console.log(">>> Achievements Modal Close clicked!");
        this.closeModal(this.elements.achievementsModal);
    });
     this.elements.sfCloseBtn?.addEventListener('click', () => {
         console.log(">>> Style Finder Modal Close clicked!");
         this.sfClose();
     });

    // Header Buttons
    this.elements.resourcesBtn?.addEventListener('click', () => {
        console.log(">>> Resources button clicked!");
        grantAchievement({}, 'resource_reader');
        localStorage.setItem('kinkCompass_resource_reader', 'true'); // Persist app achievement
        this.openModal(this.elements.resourcesModal);
    });
    this.elements.glossaryBtn?.addEventListener('click', () => {
        console.log(">>> Glossary button clicked!");
        grantAchievement({}, 'glossary_user');
        localStorage.setItem('kinkCompass_glossary_used', 'true'); // Persist app achievement
        this.showGlossary();
    });
     this.elements.styleDiscoveryBtn?.addEventListener('click', () => {
        console.log(">>> Style Discovery button clicked!");
        grantAchievement({}, 'style_discovery');
        this.showStyleDiscovery();
    });
     this.elements.themesBtn?.addEventListener('click', () => {
        console.log(">>> Themes button clicked!");
        this.openModal(this.elements.themesModal);
    });
     this.elements.achievementsBtn?.addEventListener('click', () => {
        console.log(">>> Achievements button clicked!");
        this.showAchievements();
    });
    this.elements.themeToggle?.addEventListener('click', () => {
        console.log(">>> Theme Toggle button clicked!");
        this.toggleTheme();
    });
     this.elements.exportBtn?.addEventListener('click', () => {
        console.log(">>> Export button clicked!");
        this.exportData();
    });
    this.elements.importBtn?.addEventListener('click', () => {
        console.log(">>> Import button clicked!");
        this.elements.importFileInput?.click();
    });
    this.elements.importFileInput?.addEventListener('change', (e) => {
        console.log(">>> Import file selected!");
        this.importData(e);
    });
     this.elements.styleFinderTriggerBtn?.addEventListener('click', () => {
         console.log(">>> Style Finder Trigger button clicked!");
         this.sfStart();
     });

     // Style Discovery Filter
     this.elements.styleDiscoveryRoleFilter?.addEventListener('change', () => {
         console.log(">>> Style Discovery Filter changed!");
         this.renderStyleDiscoveryContent();
     });

    // Theme Selection Buttons
    this.elements.themesBody?.addEventListener('click', (e) => this.handleThemeSelection(e));

     // Detail Modal Body
     this.elements.modalBody?.addEventListener('click', (e) => this.handleModalBodyClick(e));

     // Detail Modal Tabs
     this.elements.modalTabs?.addEventListener('click', (e) => this.handleDetailTabClick(e));

     // Glossary Link Navigation
     this.elements.glossaryBody?.addEventListener('click', (e) => this.handleGlossaryLinkClick(e));

     // Style Explore Link
     this.elements.styleExploreLink?.addEventListener('click', (e) => this.handleExploreStyleLinkClick(e));
     this.elements.formStyleFinderLink?.addEventListener('click', () => {
         console.log(">>> Form Style Finder link clicked!");
         this.sfStart();
     });

     // Style Finder Modal Content Interaction
     this.elements.sfStepContent?.addEventListener('click', (e) => {
         const button = e.target.closest('button');
         const infoIcon = e.target.closest('.sf-info-icon');

         if (button) {
             const action = button.dataset.action;
             const value = button.dataset.value;
             console.log(`>>> Style Finder Action Button Clicked: action=${action}, value=${value}`);
             this.handleStyleFinderAction(action, button.dataset);
         } else if (infoIcon) {
             const traitName = infoIcon.dataset.trait;
             console.log(`>>> Style Finder Info Icon Clicked: trait=${traitName}`);
             if (traitName) this.sfShowTraitInfo(traitName);
         }
     });

      // Style Finder Slider Input
      this.elements.sfStepContent?.addEventListener('input', (e) => {
        if (e.target.classList.contains('sf-trait-slider')) {
            this.handleStyleFinderSliderInput(e.target);
        }
     });

    // Close modals/popups on Escape/Click outside
    window.addEventListener('keydown', (e) => this.handleWindowKeydown(e));
    window.addEventListener('click', (e) => this.handleWindowClick(e));

    console.log("Event listeners ADDED.");
  }


  // --- Event Handlers ---
  // (Keep all handle... methods as they were in the previous correct version)
  handleListClick(e) { /* ... */ }
  handleListKeydown(e) { /* ... */ }
  handleWindowClick(e) { /* ... */ }
  handleWindowKeydown(e) { /* ... */ }
  handleTraitSliderInput(e) { /* ... */ }
  handleTraitInfoClick(e) { /* ... */ }
  handleModalBodyClick(e) { /* ... */ }
  handleThemeSelection(e) { /* ... */ }
  handleStyleFinderAction(action, dataset = {}) { /* ... */ }
  handleStyleFinderSliderInput(sliderElement){ /* ... */ }
  handleDetailTabClick(e) { /* ... */ }
  handleGlossaryLinkClick(e) { /* ... */ }
  handleExploreStyleLinkClick(e) { /* ... */ }

  // --- Core Rendering ---
  // (Keep renderStyles, renderTraits, createTraitHTML, updateTraitDescription, renderList, createPersonListItemHTML, updateStyleExploreLink as they were)
  renderStyles(roleKey) { /* ... */ }
  renderTraits(roleKey, styleName) { /* ... */ }
  createTraitHTML(trait){ /* ... */ }
  updateTraitDescription(slider){ /* ... */ }
  renderList(){ /* ... */ }
  createPersonListItemHTML(person){ /* ... */ }
  updateStyleExploreLink() { /* ... */ }

  // --- CRUD ---
  // (Keep savePerson, editPerson, deletePerson, resetForm as they were)
  savePerson() { /* ... */ }
  editPerson(personId){ /* ... */ }
  deletePerson(personId){ /* ... */ }
  resetForm(isManualClear=false){ /* ... */ }

  // --- Live Preview ---
  // (Keep updateLivePreview as it was)
  updateLivePreview(){ /* ... */ }

  // --- Modal Display ---
  // (Keep showPersonDetails, renderDetailTabContent as they were)
  showPersonDetails(personId) { /* ... */ }
  renderDetailTabContent(person, tabId, contentElement) { /* ... */ }

  // --- New Feature Logic ---
  // (Keep addGoal, toggleGoalStatus, deleteGoal, renderGoalList, showJournalPrompt, saveReflections, addSnapshotToHistory, renderHistoryChart, toggleSnapshotInfo, renderAchievementsList, showAchievements, showKinkReading, getReadingDescriptor, getStyleEssence as they were)
   addGoal(personId){ /* ... */ }
  toggleGoalStatus(personId,goalId){ /* ... */ }
  deleteGoal(personId,goalId){ /* ... */ }
  renderGoalList(person){ /* ... */ }
  showJournalPrompt(personId){ /* ... */ }
  saveReflections(personId){ /* ... */ }
  addSnapshotToHistory(personId){ /* ... */ }
  renderHistoryChart(person, canvasId) { /* ... */ }
  toggleSnapshotInfo(button){ /* ... */ }
  renderAchievementsList(person, listElementId){ /* ... */ }
  showAchievements() { /* ... */ }
  showKinkReading(personId){ /* ... */ }
  getReadingDescriptor(traitName,score){ /* ... */ }
  getStyleEssence(styleName){ /* ... */ }

  // --- Glossary, Style Discovery ---
  // (Keep showGlossary, showStyleDiscovery, renderStyleDiscoveryContent as they were)
  showGlossary(termKeyToHighlight = null) { /* ... */ }
  showStyleDiscovery(styleNameToHighlight = null) { /* ... */ }
  renderStyleDiscoveryContent(styleNameToHighlight = null) { /* ... */ }

  // --- Data Import/Export ---
  // (Keep exportData, importData as they were)
  exportData(){ /* ... */ }
  importData(event){ /* ... */ }

  // --- Popups ---
  // (Keep showTraitInfo, hideTraitInfo, showContextHelp, hideContextHelp as they were)
   showTraitInfo(traitName){ /* ... */ }
  hideTraitInfo(){ /* ... */ }
  showContextHelp(helpKey) { /* ... */ }
  hideContextHelp() { /* ... */ }

  // --- Style Finder Methods ---
  // (Keep sfStart, sfClose, sfCalculateSteps, sfRenderStep, sfSetRole, sfSetTrait, sfNextStep, sfPrevStep, sfStartOver, sfComputeScores, sfUpdateDashboard, toggleStyleFinderDashboard, sfCalculateResult, sfGenerateSummaryDashboard, sfShowFeedback, sfShowTraitInfo, sfShowFullDetails, getStyleIcons, confirmApplyStyleFinderResult, applyStyleFinderResult as they were)
  sfStart(){ /* ... */ }
  sfClose(){ /* ... */ }
  sfCalculateSteps(){ /* ... */ }
  sfRenderStep() { /* ... */ }
  sfSetRole(role){ /* ... */ }
  sfSetTrait(trait,value){ /* ... */ }
  sfNextStep(currentTrait = null){ /* ... */ }
  sfPrevStep(){ /* ... */ }
  sfStartOver(){ /* ... */ }
  sfComputeScores() { /* ... */ }
  sfUpdateDashboard(forceVisible = false) { /* ... */ }
  toggleStyleFinderDashboard() { /* ... */ }
  sfCalculateResult(){ /* ... */ }
  sfGenerateSummaryDashboard() { /* ... */ }
  sfShowFeedback(message){ /* ... */ }
  sfShowTraitInfo(traitName){ /* ... */ }
  sfShowFullDetails(styleName){ /* ... */ }
  getStyleIcons(){ /* ... */ }
  confirmApplyStyleFinderResult(r, s) { /* ... */ }
  applyStyleFinderResult(r,s){ /* ... */ }

  // --- Other Helper Functions ---
  // (Keep getFlairForScore, getEmojiForScore, escapeHTML, getIntroForStyle, showNotification as they were)
  getFlairForScore(s){ /* ... */ }
  getEmojiForScore(s){ /* ... */ }
  escapeHTML(str){ /* ... */ }
  getIntroForStyle(styleName){ /* ... */ }
  showNotification(message, type = 'info', duration = 4000) { /* ... */ }

  // --- Theme Management --- ADDED applySavedTheme ---
    applySavedTheme() {
        const savedTheme = localStorage.getItem('kinkCompassTheme');
        if (savedTheme && ['light', 'dark', 'pastel', 'velvet'].includes(savedTheme)) { // Validate theme
            console.log(`Applying saved theme: ${savedTheme}`);
            this.setTheme(savedTheme); // Call the existing setTheme method
        } else {
            // Apply the default theme set in the HTML initially
            const defaultTheme = document.documentElement.getAttribute('data-theme') || 'light';
            console.log(`No valid saved theme found, applying default: ${defaultTheme}`);
            // No need to call setTheme if it's already the default,
            // but ensure the toggle button matches the initial state
             this.elements.themeToggle.textContent = (defaultTheme === 'light' || defaultTheme === 'pastel') ? '🌙' : '☀️';
             document.documentElement.setAttribute('data-theme', defaultTheme); // Ensure consistency
             document.body.setAttribute('data-theme', defaultTheme);
        }
    }

    setTheme(themeName){
        console.log(`Setting theme to: ${themeName}`);
        document.documentElement.setAttribute('data-theme', themeName); // Apply to html tag
        document.body.setAttribute('data-theme', themeName); // Apply to body tag too
        localStorage.setItem('kinkCompassTheme', themeName);

        // Update toggle button text based on the new theme
        this.elements.themeToggle.textContent = (themeName === 'light' || themeName === 'pastel') ? '🌙' : '☀️';

        // Update chart if it exists and theme changed significantly (light vs dark base)
        if (this.chartInstance) {
             const isDark = themeName === 'dark' || themeName === 'velvet';
             const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim();
             const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label-color').trim();
             // Update chart options (simplified example)
             this.chartInstance.options.scales.y.ticks.color = labelColor;
             this.chartInstance.options.scales.y.grid.color = gridColor;
             this.chartInstance.options.scales.x.ticks.color = labelColor;
             this.chartInstance.options.scales.x.grid.color = gridColor;
             this.chartInstance.options.plugins.legend.labels.color = labelColor;
             this.chartInstance.update();
        }
         grantAchievement({}, 'theme_changer'); // Grant app-level achievement
         // Store in local storage to remember it's been used
         localStorage.setItem('kinkCompass_theme_changer', 'true');
    }

    toggleTheme(){
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        let newTheme;
        // Simple toggle between light/dark for the button action
        if (currentTheme === 'light' || currentTheme === 'pastel') {
            newTheme = 'dark';
        } else {
            newTheme = 'light';
        }
        this.setTheme(newTheme);
    }

   // --- Modal Management ---
   openModal(modalElement) {
        if (!modalElement) return;
        console.log(`Opening modal: #${modalElement.id}`);
        this.elementThatOpenedModal = document.activeElement;
        console.log("Element that opened modal:", this.elementThatOpenedModal);

        modalElement.setAttribute('aria-hidden', 'false');
        modalElement.style.display = 'flex';

        requestAnimationFrame(() => {
            const focusableElement = modalElement.querySelector('.modal-close, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElement) {
                focusableElement.focus();
                console.log("Focused element inside modal:", focusableElement);
            } else {
                 modalElement.focus();
                 console.log("Focused modal container.");
            }
        });
    }

   closeModal(modalElement) {
        if (!modalElement) return;
        console.log(`Closing modal: #${modalElement.id}`);
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.style.display = 'none';

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


} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS
// --- END OF TrackerApp CLASS ---


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

// --- Re-include all the handle methods ---
TrackerApp.prototype.handleListClick = function(e) {
      const target = e.target;
      const listItem = target.closest('li');
      if (!listItem) return;
      const personId = parseInt(listItem.dataset.id, 10); // Ensure ID is number if needed

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
TrackerApp.prototype.handleListKeydown = function(e) {
      // Allow activating buttons with Enter/Space
      if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn'))) {
          e.preventDefault(); // Prevent default spacebar scroll or enter submit
          e.target.click();
      }
      // Allow opening details with Enter on the main info part
      else if (e.key === 'Enter' && e.target.closest('.person-info')) {
           e.preventDefault();
           const listItem = e.target.closest('li');
           const personId = parseInt(listItem?.dataset.id, 10);
           if(personId) {
               this.showPersonDetails(personId);
           }
      }
}
TrackerApp.prototype.handleWindowClick = function(e) {
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
TrackerApp.prototype.handleWindowKeydown = function(e) {
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
TrackerApp.prototype.handleTraitSliderInput = function(e) {
     const slider = e.target;
     const display = slider.closest('.trait')?.querySelector('.trait-value');
     if (display) {
        display.textContent = slider.value;
     }
     this.updateTraitDescription(slider);
}
TrackerApp.prototype.handleTraitInfoClick = function(e) {
     const button = e.target.closest('.trait-info-btn');
     if (!button) return;
     const traitName = button.dataset.trait;
     this.showTraitInfo(traitName);
     // Mark button as expanded for focus/click-outside logic
     document.querySelectorAll('.trait-info-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
     button.setAttribute('aria-expanded', 'true');
}
TrackerApp.prototype.handleModalBodyClick = function(e) {
    const personIdStr = this.elements.modal?.dataset.personId; // Get current person ID from modal as string
    if (!personIdStr) return;
    const personId = parseInt(personIdStr, 10); // Convert to number
    if (isNaN(personId)) return;

    const target = e.target;

    // Goal Toggle/Delete
    if (target.classList.contains('toggle-goal-btn') || target.closest('.toggle-goal-btn')) {
        const button = target.closest('.toggle-goal-btn');
        const goalIdStr = button?.dataset.goalId;
        if (goalIdStr) {
             const goalId = parseInt(goalIdStr, 10);
             if (!isNaN(goalId)) {
                console.log(`>>> Toggle Goal clicked for person ${personId}, goal ${goalId}`);
                this.toggleGoalStatus(personId, goalId);
             }
        }
    } else if (target.classList.contains('delete-goal-btn') || target.closest('.delete-goal-btn')) {
        const button = target.closest('.delete-goal-btn');
         const goalIdStr = button?.dataset.goalId;
         if (goalIdStr) {
             const goalId = parseInt(goalIdStr, 10);
             if (!isNaN(goalId)) {
                 console.log(`>>> Delete Goal clicked for person ${personId}, goal ${goalId}`);
                 if (confirm("Delete this goal?")) {
                     this.deleteGoal(personId, goalId);
                 }
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
TrackerApp.prototype.handleThemeSelection = function(e) {
        const button = e.target.closest('.theme-option-btn');
        if (button) {
            console.log(">>> Theme Selection button clicked!"); // Log: Listener Fired
            const themeName = button.dataset.theme;
            this.setTheme(themeName);
            // Optional: Close the themes modal after selection
            this.closeModal(this.elements.themesModal);
        }
}
TrackerApp.prototype.handleStyleFinderAction = function(action, dataset = {}) {
        switch(action) {
            case 'start': // Actually step 1 (role preference)
                 this.sfStep = this.sfSteps.findIndex(s => s.type === 'rolePreference');
                 if (this.sfStep === -1) this.sfStep = 1; // Fallback if calc fails
                 this.sfRenderStep();
                 break;
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
TrackerApp.prototype.handleStyleFinderSliderInput = function(sliderElement) {
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
TrackerApp.prototype.handleDetailTabClick = function(e) {
    const link = e.target.closest('.tab-link');
    if (link && !link.classList.contains('active')) {
        const tabId = link.dataset.tab;
        const personIdStr = this.elements.modal?.dataset.personId;
        if (!personIdStr) return;
        const personId = parseInt(personIdStr, 10);
        if (isNaN(personId)) return;

        const person = this.people.find(p => p.id === personId);


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
                // Focus the content pane for accessibility
                requestAnimationFrame(() => contentPane.focus({ preventScroll: true }));
            } else {
                console.error(`Content pane not found for tab ID: ${tabId}`);
            }
        } else {
            console.warn("Tab click ignored - missing tabId or person data", {tabId, personId});
        }
    }
}
TrackerApp.prototype.handleGlossaryLinkClick = function(e) {
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
TrackerApp.prototype.handleExploreStyleLinkClick = function(e) {
     e.preventDefault();
     const styleName = this.elements.style?.value;
     if (styleName) {
         console.log(`>>> Explore Style link clicked for: ${styleName}`);
         this.showStyleDiscovery(styleName); // Open discovery modal and highlight
     } else {
         console.warn("Explore Style link clicked but no style selected.");
     }
}
// --- End of Re-included handle methods ---
