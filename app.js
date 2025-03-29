
// === app.js === (Version 2.8.2 - Full Integration, SF Data Needed, Fixes, Layout Adjust) ===

// --- Core Imports ---
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement, getAchievementDetails } from './achievements.js';

// --- New Feature Imports ---
import { synergyHints } from './synergyHints.js';
import { goalKeywords } from './goalPrompts.js';
import { challenges } from './challenges.js';
import { oracleReadings } from './oracle.js';

// Chart.js and Confetti loaded via CDN

// --- Top Level Data Check ---
console.log("--- Data Sanity Checks ---");
try {
    console.log("  bdsmData exists:", !!bdsmData);
    console.log("  bdsmData.submissive exists:", !!bdsmData.submissive);
    console.log("  bdsmData.submissive.styles is array:", Array.isArray(bdsmData.submissive?.styles));
    console.log("  glossaryTerms exists:", !!glossaryTerms);
    console.log("  journalPrompts exists:", typeof getRandomPrompt === 'function');
    console.log("  achievementList exists:", !!achievementList);
    console.log("  synergyHints exists:", !!synergyHints);
    console.log("  goalKeywords exists:", !!goalKeywords);
    console.log("  challenges exists:", !!challenges);
    console.log("  oracleReadings exists:", !!oracleReadings);
} catch (e) {
    console.error("  Error during data sanity check:", e);
}
console.log("--- End Data Check ---");


const contextHelpTexts = {
    role: "Your primary role (Dominant, Submissive, Switch) sets the main context for traits and styles.",
    style: "Your primary style adds specific flavor within your role. Select a role first to see relevant styles.",
    traits: "Rate how much each trait applies to this persona (1=Not at all, 5=Very Much). These define the persona's core characteristics.",
    goals: "What does this persona want to achieve or explore? Goals help track progress.",
    history: "Track how this persona's traits change over time by taking snapshots.",
    journal: "Reflect on experiences, feelings, or scene ideas related to this persona.",
    // Add more keys corresponding to data-help-key attributes in HTML
};

class TrackerApp {
  constructor() {
    console.log("[CONSTRUCTOR] STARTING KinkCompass App (v2.8.2 - Full Integration)...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;
    this.notificationTimer = null;
    this.activeDetailModalTab = 'tab-goals';
    this.elementThatOpenedModal = null;
    this.lastSavedId = null;

    // --- Style Finder State (Integrated) ---
    this.styleFinderActive = false;
    this.styleFinderStep = 0;
    this.styleFinderRole = null;
    this.styleFinderAnswers = { traits: {} };
    this.styleFinderScores = {};
    this.hasRenderedDashboard = false;
    this.previousScores = null;
    this.styleFinderTraits = [];
    this.traitFootnotes = {};
    this.sliderDescriptions = {};

    // --- Style Finder Data Structures (Integrated) ---
    // !!! CRITICAL: PASTE YOUR SF DATA BELOW !!!
    this.sfTraitData = {
        styles: {
            submissive: [ 'Submissive', 'Brat', 'Slave', 'Switch', 'Pet', 'Little', 'Puppy', 'Kitten', 'Princess', 'Rope Bunny', 'Masochist', 'Prey', 'Toy', 'Doll', 'Bunny', 'Servant', 'Playmate', 'Babygirl', 'Captive', 'Thrall', 'Puppet', 'Maid', 'Painslut', 'Bottom' ],
            dominant: [ 'Dominant', 'Assertive', 'Nurturer', 'Strict', 'Master', 'Mistress', 'Daddy', 'Mommy', 'Owner', 'Rigger', 'Sadist', 'Hunter', 'Trainer', 'Puppeteer', 'Protector', 'Disciplinarian', 'Caretaker', 'Sir', 'Goddess', 'Commander' ]
        },
        subFinderTraits: [
            // PASTE subFinderTraits array content here from scriptbdsmfinderjs.js
             { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' },
             { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' },
             { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' },
             { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' },
             { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' },
             { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' },
             { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' },
             { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' },
             { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' },
             { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' },
             { name: 'painTolerance', desc: 'Does a little sting or discomfort excite you, or do you prefer to avoid it?' },
             { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' },
             { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' },
             { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' },
             { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' },
             { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' },
             { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' },
             { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' },
             { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' }
        ],
        subTraitFootnotes: {
            // PASTE subTraitFootnotes object content here
             obedience: "1: Rarely follows / 10: Always obeys",
             rebellion: "1: Very compliant / 10: Loves to resist",
             service: "1: Self-focused / 10: Service-driven",
             playfulness: "1: Serious / 10: Super playful",
             sensuality: "1: Not sensory / 10: Highly sensual",
             exploration: "1: Stays safe / 10: Seeks adventure",
             devotion: "1: Independent / 10: Deeply devoted",
             innocence: "1: Mature / 10: Very innocent",
             mischief: "1: Calm / 10: Mischievous",
             affection: "1: Distant / 10: Super affectionate",
             painTolerance: "1: Avoids pain / 10: Loves pain",
             submissionDepth: "1: Light submission / 10: Total surrender",
             dependence: "1: Self-reliant / 10: Loves guidance",
             vulnerability: "1: Guarded / 10: Fully open",
             adaptability: "1: Fixed role / 10: Very versatile",
             tidiness: "1: Messy and carefree / 10: Obsessed with order",
             politeness: "1: Casual and blunt / 10: Always courteous",
             craving: "1: Avoids intensity / 10: Seeks extreme thrills",
             receptiveness: "1: Closed off / 10: Fully open to input"
        },
        domFinderTraits: [
            // PASTE domFinderTraits array content here
             { name: 'authority', desc: 'Do you feel strong when you take charge?' },
             { name: 'confidence', desc: 'Are you sure of your decisions?' },
             { name: 'discipline', desc: 'Do you enjoy setting firm rules?' },
             { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' },
             { name: 'care', desc: 'Do you love supporting and protecting others?' },
             { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' },
             { name: 'control', desc: 'Do you thrive on directing every detail?' },
             { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' },
             { name: 'precision', desc: 'Are you careful with every step you take?' },
             { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' },
             { name: 'sadism', desc: 'Does giving a little pain excite you?' },
             { name: 'leadership', desc: 'Do you naturally guide others forward?' },
             { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' },
             { name: 'patience', desc: 'Are you calm while teaching or training?' },
             { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' }
        ],
        domTraitFootnotes: {
            // PASTE domTraitFootnotes object content here
             authority: "1: Gentle / 10: Very commanding",
             confidence: "1: Hesitant / 10: Rock-solid",
             discipline: "1: Relaxed / 10: Strict",
             boldness: "1: Cautious / 10: Fearless",
             care: "1: Detached / 10: Deeply caring",
             empathy: "1: Distant / 10: Highly intuitive",
             control: "1: Hands-off / 10: Total control",
             creativity: "1: Routine / 10: Very creative",
             precision: "1: Casual / 10: Meticulous",
             intensity: "1: Soft / 10: Intense",
             sadism: "1: Avoids pain / 10: Enjoys giving pain",
             leadership: "1: Follower / 10: Natural leader",
             possession: "1: Shares / 10: Very possessive",
             patience: "1: Impatient / 10: Very patient",
             dominanceDepth: "1: Light control / 10: Full dominance"
        },
        sliderDescriptions: {
            // PASTE sliderDescriptions object content here (the big one)
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
             painTolerance: [ "You tire out quick!", "A little push is enough!", "You last if it’s fun!", "You’re steady for a bit!", "Halfway there—nice!", "You keep going strong!", "Endurance is your thing!", "You’re tough and ready!", "You never stop—wow!", "Marathon champ!" ], // Note: This description seems off for painTolerance, might need correction from source. Assuming it's Endurance?
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
             control: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Control’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], // Note: Seems duplicated with possession below? Check source.
             creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
             precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
             intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
             sadism: [ "Soft and sweet!", "A tease slips in!", "You push a little!", "Half gentle, half wild!", "You’re testing it!", "Pain’s your play!", "You love the sting!", "Thrill’s your game!", "You’re a spicy star!", "Total edge master!" ],
             leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
             possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
             patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
             dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ]
        },
        traitExplanations: {
            // PASTE traitExplanations object content here
             obedience: "This question explores how much you enjoy following instructions or rules given by someone else. Do you feel calm and happy when you’re told what to do, or do you prefer doing your own thing?",
             rebellion: "Here, we’re checking how much you like to playfully resist or tease when given orders. Are you someone who follows easily, or do you enjoy a little back-and-forth?",
             service: "This is about how much joy you get from helping or doing things for others. Do tasks like fetching something or assisting feel rewarding to you?",
             playfulness: "We’re asking how much you love silly, lighthearted fun. Are you serious most of the time, or do games and giggles light you up?",
             sensuality: "This looks at how much physical sensations—like soft touches or textures—excite you. Do you crave sensory experiences, or are they just okay?",
             exploration: "This checks your eagerness to try new things. Are you comfy sticking to what you know, or do you jump at the chance to experiment?",
             devotion: "We’re seeing how deeply loyal you feel toward someone. Do you stick by them no matter what, or do you like your independence?",
             innocence: "This is about enjoying a carefree, childlike vibe. Do you feel mature and serious, or do you love feeling sweet and playful?",
             mischief: "Here, we’re asking if you enjoy stirring things up a bit. Are you calm and good, or do you love a cheeky prank?",
             affection: "This explores how much you crave closeness and cuddles. Are hugs your thing, or do you prefer a bit of space?",
             painTolerance: "We’re checking how you feel about discomfort or a little sting. Does it excite you, or do you shy away from it?",
             submissionDepth: "This digs into how much control you’re happy giving up. Do you like light guidance, or do you enjoy totally letting go?",
             dependence: "This asks if you feel safe relying on someone else. Are you super independent, or do you love leaning on others?",
             vulnerability: "We’re seeing how comfy you are opening up emotionally. Do you keep your guard up, or do you share your heart easily?",
             adaptability: "This checks how easily you switch between roles or moods. Are you set in one way, or do you flow with changes?",
             tidiness: "This question explores how much you enjoy keeping things neat and orderly for someone else. Do you find satisfaction in a spotless space, or are you happier letting things stay a bit wild?",
             politeness: "We’re checking how naturally you lean toward being courteous and respectful. Are manners a big part of how you interact, or do you prefer a more casual, direct approach?",
             craving: "This is about how much you seek out intense or extreme experiences. Do you feel a pull toward pushing your boundaries, or do you prefer keeping things gentle and calm?",
             receptiveness: "Here, we’re asking how open you are to taking in direction or sensations from someone else. Do you welcome guidance and input, or do you like steering your own course?",
             authority: "This is about how natural it feels to take charge. Do you love leading, or do you prefer a softer approach?",
             confidence: "We’re asking how sure you feel in your choices. Are you bold and steady, or do you hesitate sometimes?",
             discipline: "This explores how much you enjoy setting rules. Do you like structure, or are you more relaxed?",
             boldness: "Here, we’re checking how fearless you are. Do you dive into challenges, or take it slow?",
             care: "This looks at how much you love supporting others. Are you a nurturing type, or more hands-off?",
             empathy: "We’re seeing how well you tune into others’ feelings. Do you feel what they feel, or keep a bit of distance?",
             control: "This asks how much you thrive on directing things. Do you love being in charge, or let things flow?",
             creativity: "This checks how much you enjoy crafting unique ideas. Are you imaginative, or do you stick to the basics?",
             precision: "We’re asking how careful you are with details. Do you plan every step, or go with the vibe?",
             intensity: "This explores how much fierce energy you bring. Are you calm, or do you burn bright?",
             sadism: "Here, we’re seeing if giving a little pain excites you. Is it fun for you, or not your thing?",
             leadership: "This is about guiding others naturally. Do you lead the way, or step back a bit?",
             possession: "We’re checking how much you feel pride in ‘owning’ what’s yours. Are you possessive, or easygoing?",
             patience: "This asks how calm you are when teaching or waiting. Are you chill, or do you push fast?",
             dominanceDepth: "This digs into how much power you crave. Do you like light control, or total command?"
        },
        styleDescriptions: {
            // PASTE styleDescriptions object content here
             Submissive: { short: "You thrive on guidance and love letting someone else lead the way.", long: "A Submissive finds joy in yielding to another’s direction, savoring the peace that comes with trust and structure. This role is about embracing vulnerability and finding strength in surrender.", tips: ["Communicate your limits clearly.", "Find a partner who respects your surrender.", "Explore different levels of submission."] },
             Brat: { short: "You’re cheeky and love pushing buttons for fun!", long: "Brats delight in playful resistance, turning every rule into a game of wit and charm. This style is all about the thrill of the chase and the joy of being 'tamed'.", tips: ["Keep it light and fun.", "Pair with someone who enjoys the chase.", "Set clear boundaries for your defiance."] },
             Slave: { short: "You find fulfillment in total devotion and service.", long: "Slaves are deeply committed to serving their partner, often embracing a high level of control and structure. This role requires immense trust and clear communication.", tips: ["Negotiate limits thoroughly.", "Ensure your partner values your devotion.", "Prioritize self-care."] },
             Switch: { short: "You flow effortlessly between leading and following.", long: "Switches enjoy the best of both worlds, adapting to the moment’s needs with ease. This style is versatile, playful, and thrives on exploration.", tips: ["Communicate your mood clearly.", "Experiment with both roles.", "Find partners who enjoy flexibility."] },
             Pet: { short: "You love being cared for like a cherished companion.", long: "Pets revel in affection and play, often adopting animal-like traits in a dynamic of trust and care. It’s about loyalty and fun.", tips: ["Choose a playful persona.", "Seek a caring Owner.", "Enjoy the freedom of your role."] },
             Little: { short: "You embrace a carefree, childlike spirit.", long: "Littles find joy in innocence and dependence, often seeking nurturing and protection in a playful, trusting dynamic.", tips: ["Set clear boundaries.", "Find a caring partner.", "Explore your playful side."] },
             Puppy: { short: "You’re playful and loyal like a devoted pup.", long: "Puppies bring boundless energy and affection to their dynamic, thriving on play and devotion in a lighthearted bond.", tips: ["Embrace your enthusiasm.", "Seek a Trainer or Owner.", "Keep it fun and safe."] },
             Kitten: { short: "You’re sensual and mischievous like a curious cat.", long: "Kittens blend sensuality with a touch of mischief, enjoying affection and play in a dynamic that’s both tender and teasing.", tips: ["Play with your charm.", "Find a patient partner.", "Explore sensory delights."] },
             Princess: { short: "You adore being pampered and adored.", long: "Princesses revel in attention and care, embracing a regal yet dependent role that blends innocence with sensuality.", tips: ["Set expectations early.", "Seek a doting partner.", "Enjoy your spotlight."] },
             'Rope Bunny': { short: "You love the art and feel of being bound.", long: "Rope Bunnies find excitement in the sensations and trust of bondage, enjoying the creativity and surrender of being tied.", tips: ["Learn safety basics.", "Pair with a skilled Rigger.", "Explore different ties."] },
             Masochist: { short: "You find pleasure in the thrill of pain.", long: "Masochists embrace discomfort as a source of joy, often pairing it with submission in a dynamic of trust and intensity.", tips: ["Set safe words.", "Find a caring Sadist.", "Know your limits."] },
             Prey: { short: "You enjoy the thrill of being hunted.", long: "Prey thrive on the chase, finding excitement in vulnerability and the dynamic tension of pursuit and capture.", tips: ["Establish consent clearly.", "Pair with a Hunter.", "Enjoy the adrenaline."] },
             Toy: { short: "You love being used and played with.", long: "Toys delight in being an object of pleasure, offering adaptability and submission in a dynamic of control and fun.", tips: ["Communicate preferences.", "Find a creative partner.", "Embrace your role."] },
             Doll: { short: "You enjoy being shaped and admired.", long: "Dolls find fulfillment in being molded and displayed, blending vulnerability with a desire to please and be perfect.", tips: ["Set clear boundaries.", "Seek a Puppeteer.", "Enjoy your transformation."] },
             Bunny: { short: "You’re playful and sweet like a hopping rabbit.", long: "Bunnies bring innocence and energy to their dynamic, thriving on affection and lighthearted play.", tips: ["Keep it fun.", "Find a gentle partner.", "Hop into your role."] },
             Servant: { short: "You find joy in serving and pleasing.", long: "Servants dedicate themselves to their partner’s needs, finding satisfaction in obedience and structured tasks.", tips: ["Define your duties.", "Seek a Master or Mistress.", "Balance service with self-care."] },
             Playmate: { short: "You love sharing fun and mischief.", long: "Playmates bring a spirit of camaraderie and adventure, enjoying a dynamic filled with games and exploration.", tips: ["Keep it light.", "Find a playful partner.", "Explore together."] },
             Babygirl: { short: "You crave nurturing and affection.", long: "Babygirls blend innocence with dependence, seeking a caring dynamic filled with love and protection.", tips: ["Set emotional boundaries.", "Find a Daddy or Mommy.", "Embrace your softness."] },
             Captive: { short: "You relish the thrill of being held.", long: "Captives enjoy the intensity of surrender and restraint, finding excitement in a dynamic of control and trust.", tips: ["Negotiate scenes carefully.", "Pair with a Hunter.", "Enjoy the intensity."] },
             Thrall: { short: "You’re bound by deep devotion.", long: "Thralls offer complete loyalty and submission, thriving in a dynamic of profound trust and surrender.", tips: ["Build trust slowly.", "Seek a Master.", "Honor your commitment."] },
             Puppet: { short: "You love being directed and shaped like a marionette.", long: "Puppets thrive on responsiveness, moving to their partner’s cues with ease and adaptability. This style is about fluidity and trust in being guided.", tips: ["Stay attuned to your partner’s signals.", "Find a Puppeteer who values your flexibility.", "Practice quick responses."] },
             Maid: { short: "You delight in keeping things tidy and serving politely.", long: "Maids find joy in order and courtesy, creating a pristine environment with a respectful demeanor. This style blends service with refinement.", tips: ["Focus on small, perfect details.", "Seek a Master or Mistress who appreciates polish.", "Balance duty with grace."] },
             Painslut: { short: "You crave intense pain and thrive on pushing limits.", long: "Painsluts seek out strong sensations, finding exhilaration in discomfort and intensity. This style is bold and boundary-testing.", tips: ["Set clear pain thresholds.", "Pair with a Sadist who respects limits.", "Embrace aftercare."] },
             Bottom: { short: "You’re open to receiving and enduring sensations.", long: "Bottoms excel at taking in direction and experiences, with stamina to handle prolonged scenes. This style is receptive and resilient.", tips: ["Communicate your capacity.", "Find a Dominant who values your endurance.", "Pace yourself."] },
             Dominant: { short: "You shine when you’re in charge, guiding with confidence.", long: "Dominants revel in control, leading with strength and care to create harmony. This role is about responsibility, trust, and the art of guiding another’s surrender.", tips: ["Listen to your partner’s needs.", "Balance firmness with kindness.", "Learn safe practices."] },
             Assertive: { short: "You lead with bold, decisive energy.", long: "Assertives take charge with confidence and intensity, thriving in dynamics where their authority shapes the scene.", tips: ["Stay clear and direct.", "Pair with a Submissive.", "Temper boldness with care."] },
             Nurturer: { short: "You guide with warmth and care.", long: "Nurturers blend control with empathy, creating a dynamic where guidance feels like a warm embrace. It’s about support and growth.", tips: ["Be patient and attentive.", "Pair with a Little or Pet.", "Foster trust and safety."] },
             Strict: { short: "You enforce rules with unwavering precision.", long: "Stricts maintain order and discipline, finding satisfaction in structure and obedience. This style is firm but fair.", tips: ["Set clear expectations.", "Pair with a Slave or Servant.", "Reward compliance."] },
             Master: { short: "You lead with authority and deep responsibility.", long: "Masters take on a profound role, guiding their partner with a blend of control, care, and commitment. This style often involves a structured, trusting dynamic.", tips: ["Build trust gradually.", "Understand your partner’s needs.", "Negotiate all terms clearly."] },
             Mistress: { short: "You command with grace and power.", long: "Mistresses lead with confidence and creativity, often blending sensuality with control in a dynamic that’s both elegant and intense.", tips: ["Embrace your power.", "Pair with a Slave or Toy.", "Explore creative control."] },
             Daddy: { short: "You protect and nurture with a firm hand.", long: "Daddies blend care with authority, offering guidance and structure in a dynamic that’s both loving and firm.", tips: ["Be consistent.", "Pair with a Little or Babygirl.", "Balance discipline with affection."] },
             Mommy: { short: "You nurture and guide with warmth.", long: "Mommies offer a blend of care and control, creating a safe space for their partner to explore and grow.", tips: ["Be patient and loving.", "Pair with a Little or Pet.", "Encourage growth."] },
             Owner: { short: "You take pride in possessing and caring for your partner.", long: "Owners find fulfillment in control and responsibility, often in dynamics involving pet play or total power exchange.", tips: ["Set clear rules.", "Pair with a Pet or Slave.", "Provide structure and care."] },
             Rigger: { short: "You’re an artist of restraint and sensation.", long: "Riggers excel in the art of bondage, creating intricate ties that blend creativity with control and trust.", tips: ["Learn safety techniques.", "Pair with a Rope Bunny.", "Explore different styles."] },
             Sadist: { short: "You find joy in giving pain with care.", long: "Sadists enjoy the thrill of inflicting discomfort, always within the bounds of consent and trust. It’s about intensity and connection.", tips: ["Negotiate limits.", "Pair with a Masochist.", "Prioritize aftercare."] },
             Hunter: { short: "You thrive on the chase and capture.", long: "Hunters enjoy the dynamic tension of pursuit, finding excitement in the thrill of the hunt and the surrender that follows.", tips: ["Establish consent.", "Pair with Prey.", "Enjoy the game."] },
             Trainer: { short: "You guide with patience and structure.", long: "Trainers focus on teaching and molding their partner, often in dynamics involving behavior modification or skill development.", tips: ["Be clear and consistent.", "Pair with a Pet or Slave.", "Celebrate progress."] },
             Puppeteer: { short: "You control with creativity and precision.", long: "Puppeteers enjoy directing every move, often in dynamics where their partner becomes an extension of their will.", tips: ["Communicate clearly.", "Pair with a Doll or Toy.", "Explore your vision."] },
             Protector: { short: "You lead with strength and care.", long: "Protectors blend authority with a deep sense of responsibility, ensuring their partner feels safe and valued.", tips: ["Be vigilant and kind.", "Pair with a Little or Pet.", "Foster trust."] },
             Disciplinarian: { short: "You enforce rules with a firm, steady hand.", long: "Disciplinarians excel at setting boundaries and maintaining order, often enjoying the challenge of guiding a playful or resistant partner.", tips: ["Be clear about rules.", "Stay patient and fair.", "Reward compliance."] },
             Caretaker: { short: "You nurture and support with love.", long: "Caretakers provide a safe, loving space for their partner to explore their role, often in dynamics involving age play or pet play.", tips: ["Be attentive and gentle.", "Pair with a Little or Pet.", "Encourage exploration."] },
             Sir: { short: "You lead with honor and respect.", long: "Sirs command with a blend of authority and integrity, often in dynamics that value tradition and structure.", tips: ["Uphold your values.", "Pair with a Submissive or Slave.", "Lead by example."] },
             Goddess: { short: "You’re worshipped and adored.", long: "Goddesses embody power and grace, often in dynamics where their partner offers devotion and service.", tips: ["Embrace your divinity.", "Pair with a Thrall or Servant.", "Set high standards."] },
             Commander: { short: "You lead with strategic control.", long: "Commanders take charge with precision and vision, often in dynamics that involve complex scenes or power exchange.", tips: ["Plan carefully.", "Pair with a Switch or Submissive.", "Execute with confidence."] }
        },
        dynamicMatches: {
            // PASTE dynamicMatches object content here
             Submissive: { dynamic: "Power Exchange", match: "Dominant", desc: "A classic duo where trust flows freely.", longDesc: "This dynamic thrives on mutual respect and clear roles." },
             Brat: { dynamic: "Taming Play", match: "Disciplinarian", desc: "A fun push-and-pull full of sparks!", longDesc: "The Brat’s resistance meets the Disciplinarian’s control." },
             Slave: { dynamic: "Master/Slave", match: "Master", desc: "A bond built on deep trust.", longDesc: "High power exchange with devotion and structure." },
             Switch: { dynamic: "Versatile Play", match: "Switch", desc: "A fluid exchange of power.", longDesc: "Both partners explore leading and following." },
             Pet: { dynamic: "Pet Play", match: "Owner", desc: "A playful bond of care.", longDesc: "Affection and playfulness define this dynamic." },
             Little: { dynamic: "Age Play", match: "Caretaker", desc: "A nurturing space for innocence.", longDesc: "Care and trust create a loving bond." },
             Puppy: { dynamic: "Pup Play", match: "Trainer", desc: "A lively bond of play.", longDesc: "Energy and discipline in a playful dynamic." },
             Kitten: { dynamic: "Kitten Play", match: "Owner", desc: "A sensual connection.", longDesc: "Charm and control blend beautifully." },
             Princess: { dynamic: "Pampering Play", match: "Daddy", desc: "A regal bond of care.", longDesc: "Spoiling meets nurturing structure." },
             'Rope Bunny': { dynamic: "Bondage Play", match: "Rigger", desc: "An artistic exchange.", longDesc: "Trust and creativity in bondage." },
             Masochist: { dynamic: "Sadomasochism", match: "Sadist", desc: "A thrilling exchange.", longDesc: "Pain and pleasure in a trusting dynamic." },
             Prey: { dynamic: "Primal Play", match: "Hunter", desc: "A wild chase.", longDesc: "Pursuit and surrender fuel this bond." },
             Toy: { dynamic: "Objectification Play", match: "Owner", desc: "A playful exchange.", longDesc: "Control and adaptability shine here." },
             Doll: { dynamic: "Transformation Play", match: "Puppeteer", desc: "A creative bond.", longDesc: "Shaping and trust define this dynamic." },
             Bunny: { dynamic: "Bunny Play", match: "Caretaker", desc: "A sweet bond.", longDesc: "Innocence and care in play." },
             Servant: { dynamic: "Service Play", match: "Master", desc: "A structured bond.", longDesc: "Duty and guidance create harmony." },
             Playmate: { dynamic: "Adventure Play", match: "Playmate", desc: "A shared journey.", longDesc: "Fun and exploration together." },
             Babygirl: { dynamic: "Age Play", match: "Daddy", desc: "A nurturing space.", longDesc: "Love and protection in trust." },
             Captive: { dynamic: "Captivity Play", match: "Hunter", desc: "An intense bond.", longDesc: "Control and surrender thrill here." },
             Thrall: { dynamic: "Devotion Play", match: "Goddess", desc: "A deep bond.", longDesc: "Loyalty and worship in power." },
             Puppet: { dynamic: "Puppet Play", match: "Puppeteer", desc: "A dance of control and response.", longDesc: "The Puppet’s adaptability meets the Puppeteer’s precise direction." },
             Maid: { dynamic: "Service Play", match: "Mistress", desc: "A refined exchange of duty.", longDesc: "Tidiness and politeness shine under a Mistress’s elegant command." },
             Painslut: { dynamic: "Sadomasochism", match: "Sadist", desc: "A fiery bond of intensity.", longDesc: "Craving meets skillful delivery in a thrilling exchange." },
             Bottom: { dynamic: "Sensation Play", match: "Dominant", desc: "A steady flow of give and take.", longDesc: "Receptiveness pairs with authority for a balanced dynamic." },
             Dominant: { dynamic: "Power Exchange", match: "Submissive", desc: "A balanced duo.", longDesc: "Guidance meets trust perfectly." },
             Assertive: { dynamic: "Assertive Control", match: "Submissive", desc: "A bold exchange.", longDesc: "Authority shapes this bond." },
             Nurturer: { dynamic: "Nurturing Care", match: "Little", desc: "A warm bond.", longDesc: "Care fosters growth here." },
             Strict: { dynamic: "Discipline Play", match: "Slave", desc: "A firm bond.", longDesc: "Order meets obedience." },
             Master: { dynamic: "Master/Slave", match: "Slave", desc: "A deep relationship.", longDesc: "Authority and devotion blend." },
             Mistress: { dynamic: "Mistress/Servant", match: "Servant", desc: "An elegant bond.", longDesc: "Grace and service shine." },
             Daddy: { dynamic: "Daddy/Little", match: "Little", desc: "A nurturing bond.", longDesc: "Care and play in trust." },
             Mommy: { dynamic: "Mommy/Little", match: "Little", desc: "A loving bond.", longDesc: "Warmth and growth here." },
             Owner: { dynamic: "Owner/Pet", match: "Pet", desc: "A playful bond.", longDesc: "Control and care in play." },
             Rigger: { dynamic: "Bondage Play", match: "Rope Bunny", desc: "An artistic exchange.", longDesc: "Creativity and trust in ties." },
             Sadist: { dynamic: "Sadomasochism", match: "Masochist", desc: "A thrilling exchange.", longDesc: "Pain meets pleasure safely." },
             Hunter: { dynamic: "Primal Play", match: "Prey", desc: "A wild chase.", longDesc: "Pursuit fuels this bond." },
             Trainer: { dynamic: "Training Play", match: "Puppy", desc: "A structured bond.", longDesc: "Discipline and growth." },
             Puppeteer: { dynamic: "Control Play", match: "Doll", desc: "A creative bond.", longDesc: "Precision shapes this." },
             Protector: { dynamic: "Protection Play", match: "Little", desc: "A strong bond.", longDesc: "Care and safety here." },
             Disciplinarian: { dynamic: "Discipline Play", match: "Brat", desc: "A lively challenge.", longDesc: "Control meets defiance." },
             Caretaker: { dynamic: "Caretaking Play", match: "Little", desc: "A nurturing bond.", longDesc: "Love and exploration." },
             Sir: { dynamic: "Sir/Submissive", match: "Submissive", desc: "A respectful bond.", longDesc: "Honor and obedience." },
             Goddess: { dynamic: "Worship Play", match: "Thrall", desc: "A divine bond.", longDesc: "Adoration and service." },
             Commander: { dynamic: "Command Play", match: "Switch", desc: "A strategic bond.", longDesc: "Control and flexibility." }
        }
    };
     // Apply randomization after pasting the array content
     this.sfTraitData.subFinderTraits.sort(() => 0.5 - Math.random());
     this.sfTraitData.domFinderTraits.sort(() => 0.5 - Math.random());

    console.log("[CONSTRUCTOR] Integrated Style Finder data structures.");


    // --- Element Mapping ---
    console.log("[CONSTRUCTOR] Mapping elements...");
    this.elements = {
      formSection: document.getElementById('form-section'), // Keep this, useful for scrollIntoView
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
      livePreview: document.getElementById('live-preview'), // Container for preview + challenge
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
      formTitle: document.getElementById('form-title'),
      dailyChallengeArea: document.getElementById('daily-challenge-area'), // Target this inside preview card
    };
    console.log(`[CONSTRUCTOR] Elements mapped. Basic check: peopleList found = ${!!this.elements.peopleList}, role dropdown found = ${!!this.elements.role}`);

    // CRITICAL CHECK
    if (!this.elements.role || !this.elements.style) {
        console.error("[CONSTRUCTOR] CRITICAL ERROR: Role or Style dropdown element missing!");
        alert("App critical error: Core form elements missing.");
        return;
    }
    if (!this.elements.sfStepContent || !this.elements.sfModal) {
        console.warn("[CONSTRUCTOR] Style Finder UI elements (modal, step content) not found. SF feature might fail.");
    }


    console.log("[CONSTRUCTOR] Calling addEventListeners...");
    this.addEventListeners();
    console.log("[CONSTRUCTOR] Listeners setup completed.");

    console.log("[CONSTRUCTOR] Loading data and initial render...");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, this.elements.style.value);
    this.renderList();
    this.updateLivePreview(); // Initial preview render
    this.checkAndShowWelcome();
    this.displayDailyChallenge(); // Display challenge in its new location
    console.log("[CONSTRUCTOR] Initial load and render finished.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage() {
      console.log("[LOAD_STORAGE] Attempting to load 'kinkCompassPeople'.");
      try {
          const data = localStorage.getItem('kinkCompassPeople');
          if (data) {
              this.people = JSON.parse(data);
              console.log(`[LOAD_STORAGE] Loaded ${this.people.length} personas.`);
              // Basic data validation/migration could happen here
              this.people.forEach(p => {
                  if (!p.id) p.id = Date.now() + Math.random(); // Ensure IDs exist
                  if (!p.achievements) p.achievements = []; // Initialize achievements if missing
                  if (!p.goals) p.goals = []; // Initialize goals if missing
                  if (!p.history) p.history = []; // Initialize history if missing
                  if (p.reflections === undefined) p.reflections = ""; // Initialize reflections if missing
              });
          } else {
              console.log("[LOAD_STORAGE] No data found in localStorage.");
          }
      } catch (error) {
          console.error("[LOAD_STORAGE] Error loading or parsing data:", error);
          this.showNotification("Error loading saved data. Check console.", "error", 5000);
          this.people = []; // Reset to empty state on error
      }
  }

  saveToLocalStorage() {
      console.log("[SAVE_STORAGE] Attempting to save personas.");
      try {
          localStorage.setItem('kinkCompassPeople', JSON.stringify(this.people));
          console.log(`[SAVE_STORAGE] Saved ${this.people.length} personas.`);
      } catch (error) {
          console.error("[SAVE_STORAGE] Error saving data:", error);
          this.showNotification("Error saving data. Changes might be lost.", "error", 5000);
      }
  }

  // --- Onboarding ---
  checkAndShowWelcome() {
      console.log("[WELCOME] Checking if welcome message needed.");
      if (!localStorage.getItem('kinkCompassWelcomed')) {
          console.log("[WELCOME] First visit detected. Showing welcome modal.");
          this.showWelcomeMessage();
      } else {
          console.log("[WELCOME] Not first visit.");
      }
  }

  showWelcomeMessage() {
      console.log("[WELCOME] Opening welcome modal.");
      if (this.elements.welcomeModal) {
          this.openModal(this.elements.welcomeModal);
          localStorage.setItem('kinkCompassWelcomed', 'true');
          console.log("[WELCOME] 'kinkCompassWelcomed' flag set in localStorage.");
      } else {
          console.warn("[WELCOME] Welcome modal element not found.");
      }
  }

  // --- Event Listeners Setup ---
  addEventListeners() {
    console.log("[ADD_LISTENERS] Starting setup...");

    // Helper to safely add listener and log outcome
    const safeAddListener = (element, event, handler, elementName) => {
        if (element) {
            // Use bind to ensure 'this' context within handlers refers to the TrackerApp instance
            element.addEventListener(event, handler.bind(this));
            console.log(`  [LISTENER ADDED] 👍 ${elementName} - ${event}`);
        } else {
            console.warn(`  [LISTENER FAILED] ❓ Element not found for: ${elementName}`);
        }
    };

    // Form Elements
    safeAddListener(this.elements.role, 'change', (e) => { console.log("[EVENT] Role changed"); this.renderStyles(e.target.value); this.renderTraits(e.target.value, ''); if(this.elements.style) this.elements.style.value = ''; this.updateLivePreview(); }, 'role');
    safeAddListener(this.elements.style, 'change', (e) => { console.log("[EVENT] Style changed"); this.renderTraits(this.elements.role.value, e.target.value); this.updateLivePreview(); this.updateStyleExploreLink(); }, 'style');
    safeAddListener(this.elements.name, 'input', () => { /* console.log("[EVENT] Name input"); */ this.updateLivePreview(); }, 'name'); // Reduced noise
    safeAddListener(this.elements.save, 'click', () => { console.log("[EVENT] Save button clicked"); this.savePerson(); }, 'save');
    safeAddListener(this.elements.clearForm, 'click', () => { console.log("[EVENT] Clear Form button clicked"); this.resetForm(true); }, 'clearForm');
    safeAddListener(this.elements.avatarPicker, 'click', (e) => { if (e.target.classList.contains('avatar-btn')) { console.log("[EVENT] Avatar button clicked"); const emoji = e.target.dataset.emoji; this.elements.avatarInput.value = emoji; this.elements.avatarDisplay.textContent = emoji; this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b=>b.classList.remove('selected')); e.target.classList.add('selected'); this.updateLivePreview();} }, 'avatarPicker');
    safeAddListener(this.elements.traitsContainer, 'input', (e) => { if (e.target.classList.contains('trait-slider')) { /* console.log("[EVENT] Trait slider input"); */ this.handleTraitSliderInput(e); this.updateLivePreview(); } }, 'traitsContainer input');
    safeAddListener(this.elements.traitsContainer, 'click', (e) => { if (e.target.classList.contains('trait-info-btn')) { console.log("[EVENT] Trait info button clicked"); this.handleTraitInfoClick(e); } }, 'traitsContainer click');
    safeAddListener(this.elements.formStyleFinderLink, 'click', () => { console.log("[EVENT] Form Style Finder link clicked"); this.sfStart(); }, 'formStyleFinderLink');

    // Popups & Context Help
    safeAddListener(document.body, 'click', (e) => { if (e.target.classList.contains('context-help-btn')) { console.log("[EVENT] Context help button clicked"); const key = e.target.dataset.helpKey; if(key) this.showContextHelp(key); } }, 'body context-help');
    safeAddListener(this.elements.traitInfoClose, 'click', () => { console.log("[EVENT] Trait info popup close clicked"); this.hideTraitInfo(); }, 'traitInfoClose');
    safeAddListener(this.elements.contextHelpClose, 'click', () => { console.log("[EVENT] Context help popup close clicked"); this.hideContextHelp(); }, 'contextHelpClose');

    // Persona List Interaction
    safeAddListener(this.elements.peopleList, 'click', this.handleListClick, 'peopleList click');
    safeAddListener(this.elements.peopleList, 'keydown', this.handleListKeydown, 'peopleList keydown');

    // Modal Close Buttons
    const modalsToClose = [
        { modal: this.elements.modal, button: this.elements.modalClose, name: 'detailModal' },
        { modal: this.elements.resourcesModal, button: this.elements.resourcesClose, name: 'resourcesModal' },
        { modal: this.elements.glossaryModal, button: this.elements.glossaryClose, name: 'glossaryModal' },
        { modal: this.elements.styleDiscoveryModal, button: this.elements.styleDiscoveryClose, name: 'styleDiscoveryModal' },
        { modal: this.elements.themesModal, button: this.elements.themesClose, name: 'themesModal' },
        { modal: this.elements.welcomeModal, button: this.elements.welcomeClose, name: 'welcomeModal' },
        { modal: this.elements.achievementsModal, button: this.elements.achievementsClose, name: 'achievementsModal' },
        { modal: this.elements.sfModal, button: this.elements.sfCloseBtn, name: 'sfModal' }
    ];
    modalsToClose.forEach(item => {
        safeAddListener(item.button, 'click', () => { console.log(`[EVENT] Close button clicked for ${item.name}`); this.closeModal(item.modal); }, `${item.name} Close Button`);
    });

    // Header/Feature Buttons
    safeAddListener(this.elements.resourcesBtn, 'click', () => { console.log("[EVENT] Resources button clicked"); grantAchievement({}, 'resource_reader'); localStorage.setItem('kinkCompass_resource_reader', 'true'); this.openModal(this.elements.resourcesModal); }, 'resourcesBtn');
    safeAddListener(this.elements.glossaryBtn, 'click', () => { console.log("[EVENT] Glossary button clicked"); grantAchievement({}, 'glossary_user'); localStorage.setItem('kinkCompass_glossary_used', 'true'); this.showGlossary(); }, 'glossaryBtn');
    safeAddListener(this.elements.styleDiscoveryBtn, 'click', () => { console.log("[EVENT] Style Discovery button clicked"); grantAchievement({}, 'style_discovery'); localStorage.setItem('kinkCompass_style_discovery_viewed', 'true'); this.showStyleDiscovery(); }, 'styleDiscoveryBtn');
    safeAddListener(this.elements.themesBtn, 'click', () => { console.log("[EVENT] Themes button clicked"); this.openModal(this.elements.themesModal); }, 'themesBtn');
    safeAddListener(this.elements.achievementsBtn, 'click', () => { console.log("[EVENT] Achievements button clicked"); this.showAchievements(); }, 'achievementsBtn');
    safeAddListener(this.elements.themeToggle, 'click', () => { console.log("[EVENT] Theme toggle button clicked"); this.toggleTheme(); }, 'themeToggle');
    safeAddListener(this.elements.exportBtn, 'click', () => { console.log("[EVENT] Export button clicked"); this.exportData(); }, 'exportBtn');
    safeAddListener(this.elements.importBtn, 'click', () => { console.log("[EVENT] Import button clicked"); this.elements.importFileInput?.click(); }, 'importBtn');
    safeAddListener(this.elements.importFileInput, 'change', (e) => { console.log("[EVENT] Import file selected"); this.importData(e); }, 'importFileInput');
    safeAddListener(this.elements.styleFinderTriggerBtn, 'click', () => { console.log("[EVENT] Header Style Finder trigger clicked"); this.sfStart(); }, 'styleFinderTriggerBtn');

    // Other UI Listeners
    safeAddListener(this.elements.styleDiscoveryRoleFilter, 'change', () => { console.log("[EVENT] Style Discovery filter changed"); this.renderStyleDiscoveryContent(); }, 'styleDiscoveryRoleFilter');
    safeAddListener(this.elements.themesBody, 'click', this.handleThemeSelection, 'themesBody');
    safeAddListener(this.elements.modalBody, 'click', this.handleModalBodyClick, 'modalBody');
    safeAddListener(this.elements.modalTabs, 'click', this.handleDetailTabClick, 'modalTabs');
    safeAddListener(this.elements.glossaryBody, 'click', this.handleGlossaryLinkClick, 'glossaryBody');
    safeAddListener(document.body, 'click', this.handleGlossaryLinkClick, 'body glossaryLink');
    safeAddListener(this.elements.styleExploreLink, 'click', this.handleExploreStyleLinkClick, 'styleExploreLink');

    // Style Finder Modal Internal Listeners
    safeAddListener(this.elements.sfStepContent, 'click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const action = button.dataset.action;
            if (action) {
                console.log(`[EVENT] SF button action: ${action}`);
                // Pass the event object's target to check for active class setting later
                this.handleStyleFinderAction(action, button.dataset, e.target);
            } else if (button.classList.contains('sf-info-icon')) {
                console.log("[EVENT] SF trait info icon clicked");
                const traitName = button.dataset.trait;
                if (traitName) this.sfShowTraitInfo(traitName, e.target); // Pass button element
            }
        }
    }, 'sfStepContent click');
    safeAddListener(this.elements.sfStepContent, 'input', (e) => { if (e.target.classList.contains('sf-trait-slider')) { /* console.log("[EVENT] SF slider input"); */ this.handleStyleFinderSliderInput(e.target); } }, 'sfStepContent input');

    // Window Listeners
    safeAddListener(window, 'keydown', this.handleWindowKeydown, 'window keydown');
    safeAddListener(window, 'click', this.handleWindowClick, 'window click');

    console.log("[ADD_LISTENERS] Setup COMPLETE.");
  } // End addEventListeners

  // --- Event Handlers ---
  handleListClick(e) {
      console.log("[HANDLE_LIST_CLICK] START - Click detected.");
      console.log("  Target Element:", e.target);
      const target = e.target;
      const listItem = target.closest('li[data-id]');

      if (!listItem) {
          console.log("[HANDLE_LIST_CLICK] Click outside valid LI. Ignoring.");
          return;
      }

      const personIdStr = listItem.dataset.id;
      const personId = parseInt(personIdStr, 10);

      if (isNaN(personId)) {
          console.warn("[HANDLE_LIST_CLICK] Invalid personId:", personIdStr);
          return;
      }

      console.log(`[HANDLE_LIST_CLICK] Processing click for personId: ${personId}`);

      if (target.closest('.edit-btn')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Edit");
          this.editPerson(personId);
      } else if (target.closest('.delete-btn')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Delete");
          const person = this.people.find(p => p.id === personId);
          const name = person?.name || 'persona';
          if (confirm(`Are you sure you want to delete ${this.escapeHTML(name)}? This cannot be undone.`)) {
              console.log("[HANDLE_LIST_CLICK] Delete confirmed.");
              this.deletePerson(personId);
          } else {
              console.log("[HANDLE_LIST_CLICK] Delete cancelled.");
          }
      } else if (target.closest('.person-info')) {
          console.log("[HANDLE_LIST_CLICK] Branch: Info -> Calling showPersonDetails");
          this.showPersonDetails(personId);
      } else {
          console.log("[HANDLE_LIST_CLICK] Click inside LI but not on known actionable element.");
      }
      console.log("[HANDLE_LIST_CLICK] END");
  } // End handleListClick

  handleListKeydown(e) {
      // console.log(`[HANDLE_LIST_KEYDOWN] Key pressed: ${e.key}`); // Noisy
      if (e.key !== 'Enter' && e.key !== ' ') {
           // console.log("[HANDLE_LIST_KEYDOWN] Irrelevant key. Ignoring."); // Noisy
           return;
      }

      const target = e.target;
      const listItem = target.closest('li[data-id]');
      if (!listItem) {
           // console.log("[HANDLE_LIST_KEYDOWN] Not focused within a list item. Ignoring."); // Noisy
           return;
      }

      // console.log(`[HANDLE_LIST_KEYDOWN] Target element:`, target); // Noisy
      const personIdStr = listItem.dataset.id;
      const personId = parseInt(personIdStr, 10);

      if (isNaN(personId)) {
          console.warn("[HANDLE_LIST_KEYDOWN] Invalid personId:", personIdStr);
          return;
      }

      // If key pressed on an action button (Edit/Delete)
      if (target.closest('.person-actions') && (target.classList.contains('edit-btn') || target.classList.contains('delete-btn'))) {
          console.log("[HANDLE_LIST_KEYDOWN] Activating action button via keypress.");
          e.preventDefault();
          target.click();
      }
      // If Enter key pressed on the main info part or the list item itself
      else if (e.key === 'Enter' && (target === listItem || target.closest('.person-info'))) {
          console.log("[HANDLE_LIST_KEYDOWN] Activating details view via Enter key.");
          e.preventDefault();
          this.showPersonDetails(personId);
      } else {
           // console.log("[HANDLE_LIST_KEYDOWN] Keypress on list item, but not actionable target/key combination."); // Noisy
      }
  } // End handleListKeydown

  handleWindowClick(e) {
      // Close trait info popup if click is outside
      if (this.elements.traitInfoPopup?.getAttribute('aria-hidden') === 'false') {
          const popupContent = this.elements.traitInfoPopup;
          const triggeringButton = document.querySelector('.trait-info-btn[aria-expanded="true"]');
          if (popupContent && !popupContent.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
              console.log("[WINDOW_CLICK] Click outside trait info popup. Closing.");
              this.hideTraitInfo();
          }
      }
      // Close context help popup if click is outside
      if (this.elements.contextHelpPopup?.getAttribute('aria-hidden') === 'false') {
          const popupContent = this.elements.contextHelpPopup;
          const triggeringButton = document.querySelector('.context-help-btn[aria-expanded="true"]');
          if (popupContent && !popupContent.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
              console.log("[WINDOW_CLICK] Click outside context help popup. Closing.");
              this.hideContextHelp();
          }
      }
      // Close Style Finder info popup if click is outside
      const sfInfoPopup = document.querySelector('.sf-style-info-popup'); // Needs to be queried dynamically
      if (sfInfoPopup) {
          const triggeringButton = document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active');
          if (!sfInfoPopup.contains(e.target) && e.target !== triggeringButton && !triggeringButton?.contains(e.target)) {
               console.log("[WINDOW_CLICK] Click outside SF info popup. Removing.");
               sfInfoPopup.remove();
               triggeringButton?.classList.remove('active');
           }
      }
  }

  handleWindowKeydown(e) {
      if (e.key === 'Escape') {
          console.log("[WINDOW_KEYDOWN] Escape key detected.");
          // Priority: Close specific popups first
          if (this.elements.traitInfoPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[WINDOW_KEYDOWN] Closing trait info popup via Escape.");
              this.hideTraitInfo();
              return;
          }
          if (this.elements.contextHelpPopup?.getAttribute('aria-hidden') === 'false') {
              console.log("[WINDOW_KEYDOWN] Closing context help popup via Escape.");
              this.hideContextHelp();
              return;
          }
          const sfInfoPopup = document.querySelector('.sf-style-info-popup');
          if (sfInfoPopup) {
               console.log("[WINDOW_KEYDOWN] Removing SF info popup via Escape.");
               sfInfoPopup.remove();
               document.querySelector('.sf-info-icon.active, button[data-action="showDetails"].active')?.classList.remove('active');
               return;
           }
          // Then, close any active modal
          const openModal = document.querySelector('.modal[aria-hidden="false"]');
          if (openModal) {
              console.log(`[WINDOW_KEYDOWN] Closing active modal #${openModal.id} via Escape.`);
              this.closeModal(openModal);
          } else {
              console.log("[WINDOW_KEYDOWN] Escape pressed, but no active modal or known popup found.");
          }
      }
  }

  handleTraitSliderInput(e) {
      const slider = e.target;
      const traitElement = slider.closest('.trait');
      const valueDisplay = traitElement?.querySelector('.trait-value');
      if (valueDisplay) {
          valueDisplay.textContent = slider.value;
      } else {
           console.warn("[TRAIT_SLIDER] Could not find value display element for slider:", slider);
      }
      this.updateTraitDescription(slider);
  }

  handleTraitInfoClick(e) {
      const button = e.target.closest('.trait-info-btn');
      if (!button) {
           console.warn("[TRAIT_INFO_CLICK] Click registered, but not on a .trait-info-btn.");
           return;
      }
      const traitName = button.dataset.trait;
      if (!traitName) {
          console.warn("[TRAIT_INFO_CLICK] .trait-info-btn clicked, but missing data-trait attribute.");
          return;
      }
      console.log(`[TRAIT_INFO_CLICK] Showing info for trait: ${traitName}`);
      this.showTraitInfo(traitName);

      document.querySelectorAll('.trait-info-btn[aria-expanded="true"]').forEach(btn => {
          if (btn !== button) btn.setAttribute('aria-expanded', 'false');
      });
      button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  }

  handleModalBodyClick(e) {
      // console.log("[MODAL_BODY_CLICK] Click detected inside modal body."); // Noisy
      const detailModal = this.elements.modal; // Assuming this is the detail modal
      const personIdStr = detailModal?.dataset.personId;

      if (!personIdStr) {
          // console.log("[MODAL_BODY_CLICK] No personId found on detail modal. Ignoring click."); // Noisy
          return;
      }

      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) {
          console.warn("[MODAL_BODY_CLICK] Invalid personId on detail modal:", personIdStr);
          return;
      }

      const target = e.target;
      const button = target.closest('button'); // Find nearest button ancestor

      if (button) {
          // console.log(`[MODAL_BODY_CLICK] Button clicked with ID: ${button.id}, Classes: ${button.className}`); // Noisy

          // Goal Actions
          if (button.classList.contains('toggle-goal-btn')) {
              const goalIdStr = button.dataset.goalId;
              const goalId = parseInt(goalIdStr, 10);
              if (!isNaN(goalId)) {
                  console.log(`[MODAL_BODY_CLICK] Toggling goal ${goalId} for person ${personId}`);
                  this.toggleGoalStatus(personId, goalId, button.closest('li'));
              } else { console.warn("[MODAL_BODY_CLICK] Invalid goalId on toggle button:", goalIdStr); }
              return;
          }
          if (button.classList.contains('delete-goal-btn')) {
              const goalIdStr = button.dataset.goalId;
              const goalId = parseInt(goalIdStr, 10);
              if (!isNaN(goalId)) {
                  if (confirm("Are you sure you want to delete this goal?")) {
                       console.log(`[MODAL_BODY_CLICK] Deleting goal ${goalId} for person ${personId}`);
                       this.deleteGoal(personId, goalId);
                  } else { console.log("[MODAL_BODY_CLICK] Goal deletion cancelled."); }
              } else { console.warn("[MODAL_BODY_CLICK] Invalid goalId on delete button:", goalIdStr); }
              return;
          }
          // Add Goal via button click
          if (button.id === 'add-goal-btn') {
              const form = button.closest('form#add-goal-form');
              if (form) {
                   e.preventDefault(); // Prevent potential form submission
                   console.log(`[MODAL_BODY_CLICK] Adding goal for person ${personId} via button.`);
                   this.addGoal(personId, form);
              } else { console.warn("[MODAL_BODY_CLICK] Add goal button clicked, but no parent form#add-goal-form found."); }
              return;
          }

          // Other Modal Actions
          switch (button.id) {
              case 'snapshot-btn':
                  console.log(`[MODAL_BODY_CLICK] Adding snapshot for person ${personId}`);
                  this.addSnapshotToHistory(personId);
                  return;
              case 'journal-prompt-btn':
                  console.log(`[MODAL_BODY_CLICK] Getting journal prompt for person ${personId}`);
                  this.showJournalPrompt(personId);
                  return;
              case 'save-reflections-btn':
                  console.log(`[MODAL_BODY_CLICK] Saving reflections for person ${personId}`);
                  this.saveReflections(personId);
                  return;
              case 'oracle-btn':
                  console.log(`[MODAL_BODY_CLICK] Getting oracle reading for person ${personId}`);
                  this.showKinkOracle(personId);
                  return;
          }

          // Glossary Links within Modal
          if (button.classList.contains('glossary-link')) {
              const termKey = button.dataset.termKey;
              if (termKey) {
                   console.log(`[MODAL_BODY_CLICK] Glossary link clicked for term: ${termKey}`);
                   e.preventDefault();
                   this.closeModal(detailModal);
                   this.showGlossary(termKey);
              } else { console.warn("[MODAL_BODY_CLICK] Glossary link button clicked, but missing data-term-key."); }
              return;
          }
      }

      // Handle Add Goal Form Submission via Enter key or submit event
      if (target.closest('form#add-goal-form') && (e.type === 'submit' || (e.type === 'keydown' && e.key === 'Enter'))) {
            const form = target.closest('form#add-goal-form');
            if (form) {
                e.preventDefault(); // Prevent default form submission
                 // Basic check if input is focused to prevent accidental submits
                 if(document.activeElement === form.querySelector('input[type="text"]') || e.type === 'submit') {
                    console.log(`[MODAL_BODY_CLICK/SUBMIT] Add goal form submitted for person ${personId}`);
                    this.addGoal(personId, form);
                 } else {
                      console.log("[MODAL_BODY_CLICK/SUBMIT] Enter pressed in form, but not on input. Ignoring.");
                 }
                 return;
            }
      }


      // console.log("[MODAL_BODY_CLICK] Click inside modal body did not match known actions."); // Noisy
  }

  handleThemeSelection(e) {
      console.log("[HANDLE_THEME_SELECTION] Click detected in themes body.");
      const button = e.target.closest('.theme-option-btn');
      if (button?.dataset.theme) {
          const themeName = button.dataset.theme;
          console.log(`[HANDLE_THEME_SELECTION] Theme button clicked: ${themeName}`);
          this.setTheme(themeName);
          this.closeModal(this.elements.themesModal);
      } else {
          console.log("[HANDLE_THEME_SELECTION] Click was not on a theme button.");
      }
  }

  handleStyleFinderAction(action, dataset = {}, triggerElement = null) {
       console.log(`[SF_ACTION] Handling action: ${action}`, dataset);
       switch (action) {
           case 'start':
               this.sfNextStep();
               break;
           case 'setRole':
               if (dataset.role) {
                   this.sfSetRole(dataset.role);
               } else { console.warn("[SF_ACTION] setRole action missing role data."); }
               break;
           case 'next':
               this.sfNextStep(dataset.currenttrait || null);
               break;
           case 'prev':
               this.sfPrevStep();
               break;
           case 'startOver':
               this.sfStartOver();
               break;
           case 'showDetails':
                if (dataset.style) {
                    this.sfShowFullDetails(dataset.style, triggerElement); // Pass the style name with emoji and trigger
                } else { console.warn("[SF_ACTION] showDetails action missing style data."); }
               break;
           case 'confirmApply':
                if(dataset.role && dataset.style) {
                    this.confirmApplyStyleFinderResult(dataset.role, dataset.style);
                } else { console.warn("[SF_ACTION] confirmApply action missing role or style data.");}
                break;
           default:
               console.warn(`[SF_ACTION] Unknown action: ${action}`);
       }
   }

   handleStyleFinderSliderInput(sliderElement) {
        const traitName = sliderElement.dataset.trait;
        const value = sliderElement.value;
        const descriptionElement = document.getElementById(`sf-desc-${traitName}`);

        if (!traitName) {
            console.warn("[SF_SLIDER] Slider input missing data-trait attribute.");
            return;
        }

        this.sfSetTrait(traitName, value);

        const roleDescriptions = this.sliderDescriptions;
        if (descriptionElement && roleDescriptions && roleDescriptions[traitName]) {
            const descArray = roleDescriptions[traitName];
            const index = parseInt(value, 10) - 1;
            if (index >= 0 && index < descArray.length) {
                descriptionElement.textContent = descArray[index];
            } else { console.warn(`[SF_SLIDER] Invalid index ${index} for description array of ${traitName}`); }
        }

        this.sfUpdateDashboard();
    }

  handleDetailTabClick(e) {
      const target = e.target.closest('.tab-link');
      if (!target) {
          // console.log("[DETAIL_TAB_CLICK] Click not on a tab link."); // Noisy
          return;
      }

      e.preventDefault();
      const tabId = target.dataset.tabId;
      console.log(`[DETAIL_TAB_CLICK] Clicked tab: ${tabId}`);

      if (!tabId || tabId === this.activeDetailModalTab) {
          console.log(`[DETAIL_TAB_CLICK] Tab is already active or invalid (${tabId}). No action needed.`);
          return; // Don't re-render if clicking the active tab
      }

      const personIdStr = this.elements.modal?.dataset.personId;
      const personId = parseInt(personIdStr, 10);
      if (isNaN(personId)) {
          console.warn("[DETAIL_TAB_CLICK] Could not get valid personId from modal.");
          return;
      }

      const person = this.people.find(p => p.id === personId);
      if (!person) {
          console.error(`[DETAIL_TAB_CLICK] Person not found for ID: ${personId}`);
          return;
      }

      // Deactivate other tabs and content panes
      this.elements.modalTabs.querySelectorAll('.tab-link').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
      });
      this.elements.modalBody.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));

      // Activate clicked tab and corresponding content pane
      target.classList.add('active');
      target.setAttribute('aria-selected', 'true');

      const activePane = this.elements.modalBody.querySelector(`.tab-content[data-tab-id="${tabId}"]`);
      if (activePane) {
          activePane.classList.add('active');
          this.activeDetailModalTab = tabId;
          console.log(`[DETAIL_TAB_CLICK] Activated tab and pane for: ${tabId}`);

          // Render content *only if it hasn't been rendered yet* OR if it's the history tab
          const needsRender = !activePane.innerHTML.trim() || tabId === 'tab-history';

          if (needsRender) {
                console.log(`[DETAIL_TAB_CLICK] Rendering content for active tab: ${tabId}`);
                this.renderDetailTabContent(person, tabId, activePane); // Renders the HTML

                // FIX: Call chart rendering AFTER content is rendered and ONLY for history tab
                if (tabId === 'tab-history' && person.history && person.history.length >= 2) {
                    setTimeout(() => {
                        console.log("[DETAIL_TAB_CLICK] Delayed call to renderHistoryChart for active history tab.");
                        this.renderHistoryChart(person, 'history-chart');
                    }, 150); // Delay needed
                }
           } else {
               console.log(`[DETAIL_TAB_CLICK] Content for ${tabId} already exists, skipping re-render.`);
           }

      } else {
          console.warn(`[DETAIL_TAB_CLICK] Could not find content pane for tabId: ${tabId}`);
      }
  } // End handleDetailTabClick

  handleGlossaryLinkClick(e) {
      const link = e.target.closest('.glossary-link');
      if (link) {
          const termKey = link.dataset.termKey;
          if (termKey) {
                console.log(`[GLOSSARY_LINK_CLICK] Link clicked for term: ${termKey}`);
                e.preventDefault();
                const openModal = document.querySelector('.modal[aria-hidden="false"]:not(#glossary-modal)');
                if(openModal) {
                    console.log(`[GLOSSARY_LINK_CLICK] Closing currently open modal: #${openModal.id}`);
                    this.closeModal(openModal);
                }
                this.showGlossary(termKey);
            } else { console.warn("[GLOSSARY_LINK_CLICK] Glossary link clicked, but missing data-term-key."); }
      }
  }

  handleExploreStyleLinkClick(e) {
        e.preventDefault();
        const styleName = e.target.dataset.styleName;
        if (styleName) {
            console.log(`[EXPLORE_STYLE_LINK] Clicked for style: ${styleName}`);
            this.showStyleDiscovery(styleName);
        } else {
            console.warn("[EXPLORE_STYLE_LINK] Explore link clicked, but missing data-style-name.");
        }
    }


  // --- Core Rendering ---
  renderStyles(roleKey) {
      console.log(`[RENDERSTYLES] START - Rendering styles for roleKey: ${roleKey}`);
      const styleSelect = this.elements.style;

      if (!styleSelect) {
          console.error("[RENDERSTYLES] CRITICAL - Style select element not found!");
          return;
      }

      if (!roleKey) {
          console.warn("[RENDERSTYLES] No role key provided. Clearing options.");
          styleSelect.innerHTML = '<option value="">-- Select Role First --</option>';
          console.log("[RENDERSTYLES] END - No role key.");
          return;
      }

      console.log(`[RENDERSTYLES] Accessing bdsmData[${roleKey}].styles`);
      const stylesData = bdsmData[roleKey]?.styles;
      console.log(`[RENDERSTYLES] Data retrieved:`, stylesData);


      if (!stylesData || !Array.isArray(stylesData)) {
          console.warn(`[RENDERSTYLES] No styles array found for role ${roleKey}.`);
          styleSelect.innerHTML = '<option value="">-- No Styles Available --</option>';
          console.log("[RENDERSTYLES] END - No styles data.");
          return;
      }

      console.log(`[RENDERSTYLES] Found ${stylesData.length} styles for role ${roleKey}. Clearing existing options.`);
      styleSelect.innerHTML = '<option value="">-- Select a Style --</option>';

      console.log("[RENDERSTYLES] Starting loop to add options...");
      stylesData.forEach((style, index) => {
          if (!style || typeof style.name !== 'string') {
              console.warn(`[RENDERSTYLES] Invalid style object at index ${index} for role ${roleKey}:`, style);
              return;
          }
          const option = document.createElement('option');
          option.value = style.name;
          option.textContent = style.name;
          // console.log(`  [RENDERSTYLES LOOP ${index+1}] Creating option - value: ${option.value}, text: ${option.textContent}`); // Noisy
          // console.log(`  [RENDERSTYLES LOOP ${index+1}] styleSelect element:`, styleSelect); // Noisy
          styleSelect.appendChild(option);
      });
      console.log("[RENDERSTYLES] Finished adding options.");

      styleSelect.offsetHeight;
      console.log("[RENDERSTYLES] Forced offsetHeight read.");

      console.log("[RENDERSTYLES] END");
  } // End renderStyles

  renderTraits(roleKey, styleName) {
      console.log(`[RENDERTRAITS] START - Rendering traits for role: ${roleKey}, style: ${styleName}`);
      const container = this.elements.traitsContainer;
      const messageEl = this.elements.traitsMessage;

      if (!container || !messageEl) {
          console.error("[RENDERTRAITS] CRITICAL - Traits container or message element not found!");
          return;
      }

      container.innerHTML = '';
      messageEl.style.display = 'none'; // Hide message initially

      if (!roleKey) {
          console.log("[RENDERTRAITS] No role selected. Displaying message.");
          messageEl.textContent = 'Select a Role above to see core traits.';
          messageEl.style.display = 'block';
          container.style.display = 'none';
          console.log("[RENDERTRAITS] END - No role.");
          return;
      }

      console.log(`[RENDERTRAITS] Accessing data for role: ${roleKey}`);
      const roleData = bdsmData[roleKey];
      if (!roleData) {
          console.warn(`[RENDERTRAITS] No data found for role: ${roleKey}`);
          messageEl.textContent = `Error: Data not found for role '${roleKey}'.`;
          messageEl.style.display = 'block';
          container.style.display = 'none';
          console.log("[RENDERTRAITS] END - Role data not found.");
          return;
      }

      let traitsToRender = [];
      if (roleData.coreTraits && Array.isArray(roleData.coreTraits)) {
          // console.log(`[RENDERTRAITS] Found ${roleData.coreTraits.length} core traits.`); // Noisy
          traitsToRender.push(...roleData.coreTraits);
      } else {
           console.warn(`[RENDERTRAITS] No core traits found or invalid format for role ${roleKey}.`);
      }

      let selectedStyleObj = null;
      if (styleName && roleData.styles && Array.isArray(roleData.styles)) {
          selectedStyleObj = roleData.styles.find(s => s.name === styleName);
          if (selectedStyleObj) {
              // console.log(`[RENDERTRAITS] Found style object for: ${styleName}`); // Noisy
              if (selectedStyleObj.traits && Array.isArray(selectedStyleObj.traits)) {
                  // console.log(`[RENDERTRAITS] Found ${selectedStyleObj.traits.length} style-specific traits.`); // Noisy
                  traitsToRender.push(...selectedStyleObj.traits);
              } else {
                   // console.log(`[RENDERTRAITS] No specific traits listed for style ${styleName}.`); // Noisy
              }
          } else {
              console.warn(`[RENDERTRAITS] Style object not found for selected style: ${styleName}`);
          }
      } else if (styleName) {
           console.warn(`[RENDERTRAITS] Style name '${styleName}' provided, but no styles array found for role ${roleKey}.`);
      }

      const uniqueTraitNames = new Set();
      const finalTraits = traitsToRender.filter(trait => {
          if (!trait || typeof trait.name !== 'string') { return false; }
          if (!uniqueTraitNames.has(trait.name)) { uniqueTraitNames.add(trait.name); return true; }
          return false;
      });

      console.log(`[RENDERTRAITS] Total unique traits to render: ${finalTraits.length}`);

      if (finalTraits.length === 0) {
           if (styleName) messageEl.textContent = `No specific traits defined for '${styleName}'. Explore freely!`;
           else if (roleKey) messageEl.textContent = `No core traits defined for role '${roleKey}'. Explore general concepts!`;
           else messageEl.textContent = 'Select Role & Style to see relevant traits...';
           messageEl.style.display = 'block';
           container.style.display = 'none';
           console.log("[RENDERTRAITS] END - No traits to render.");
           return;
      }

       let currentValues = {};
       if (this.currentEditId !== null) {
            const person = this.people.find(p => p.id === this.currentEditId);
            currentValues = person?.traits || {};
            // console.log(`[RENDERTRAITS] Loading current values for editing ID ${this.currentEditId}.`); // Noisy
       }

      console.log("[RENDERTRAITS] Starting loop to create trait HTML...");
      finalTraits.forEach((trait) => {
          const currentValue = currentValues[trait.name] !== undefined ? currentValues[trait.name] : 3;
          const traitHTML = this.createTraitHTML(trait, currentValue);
          container.insertAdjacentHTML('beforeend', traitHTML);
          const slider = container.querySelector(`input[name="${trait.name}"]`);
          if(slider) this.updateTraitDescription(slider);
          else console.warn(`[RENDERTRAITS] Slider not found immediately after insert for trait: ${trait.name}`);
      });
      console.log("[RENDERTRAITS] Finished creating trait HTML.");

      container.style.display = 'block'; // Ensure container is visible if traits were rendered
      console.log("[RENDERTRAITS] END");
  } // End renderTraits

  createTraitHTML(trait, value = 3) {
       if (!trait || !trait.name || !trait.desc) {
           console.error("[CREATE_TRAIT_HTML] Invalid trait object:", trait);
           return '<p class="error-text">Error rendering trait.</p>';
       }
       const validValue = Math.max(1, Math.min(5, parseInt(value, 10) || 3));
       const safeName = this.escapeHTML(trait.name);
       return `
        <div class="trait" data-trait-name="${safeName}">
            <label class="trait-label" for="trait-${safeName}">
                ${safeName}
                <button type="button" class="trait-info-btn small-btn context-help-btn" data-trait="${safeName}" aria-label="Info about ${safeName}" aria-expanded="false">?</button>
            </label>
            <input type="range" id="trait-${safeName}" name="${safeName}" class="trait-slider" min="1" max="5" value="${validValue}" aria-describedby="desc-${safeName}">
            <span class="trait-value" aria-live="polite">${validValue}</span>
            <div id="desc-${safeName}" class="trait-desc muted-text" aria-live="polite">
                ${this.escapeHTML(trait.desc[validValue] || 'Loading...')}
            </div>
        </div>
    `;
  }

  updateTraitDescription(slider) {
      if (!slider) { console.warn("[UPDATE_TRAIT_DESC] Called with null slider."); return; }
      const traitName = slider.name;
      const value = slider.value;
      const descElement = document.getElementById(`desc-${traitName}`);
      if (!descElement) { return; }

      let traitDefinition = null;
      // Quick lookup based on current form selection first
       const currentRole = this.elements.role.value;
       const currentStyle = this.elements.style.value;
       if(currentRole && bdsmData[currentRole]) {
            traitDefinition = bdsmData[currentRole].coreTraits?.find(t => t.name === traitName) ||
                              bdsmData[currentRole].styles?.find(s => s.name === currentStyle)?.traits?.find(t => t.name === traitName);
       }
       // Fallback: Search all data (less efficient)
       if (!traitDefinition) {
            for (const roleKey in bdsmData) {
                traitDefinition = bdsmData[roleKey].coreTraits?.find(t => t.name === traitName) ||
                                   bdsmData[roleKey].styles?.flatMap(s => s.traits || []).find(t => t.name === traitName);
                if(traitDefinition) break;
            }
       }

      if (traitDefinition && traitDefinition.desc && traitDefinition.desc[value]) {
            descElement.textContent = this.escapeHTML(traitDefinition.desc[value]);
      } else {
            descElement.textContent = '...';
            console.warn(`[UPDATE_TRAIT_DESC] Could not find description for trait '${traitName}' at value ${value}.`);
      }
  }

  renderList() {
    console.log("[RENDERLIST] START - Rendering persona list.");
    const listElement = this.elements.peopleList;
    if (!listElement) { console.error("[RENDERLIST] CRITICAL - People list element not found!"); return; }

    console.log(`[RENDERLIST] Personas count: ${this.people.length}`);
    listElement.innerHTML = '';

    if (this.people.length === 0) {
        listElement.innerHTML = '<li class="muted-text">No personas created yet. Use the form!</li>';
        console.log("[RENDERLIST] List empty.");
    } else {
        console.log("[RENDERLIST] Creating list items...");
        this.people.forEach((person) => {
            const listItemHTML = this.createPersonListItemHTML(person);
            listElement.insertAdjacentHTML('beforeend', listItemHTML);
        });

        if (this.lastSavedId !== null) {
            const newlySavedItem = listElement.querySelector(`li[data-id="${this.lastSavedId}"]`);
            if (newlySavedItem) {
                console.log(`[RENDERLIST] Highlighting saved item ID: ${this.lastSavedId}`);
                newlySavedItem.classList.add('item-just-saved');
                setTimeout(() => newlySavedItem.classList.remove('item-just-saved'), 1500);
            }
            this.lastSavedId = null;
        }
        console.log("[RENDERLIST] Finished creating items.");
    }
    console.log("[RENDERLIST] END");
  } // End renderList

  createPersonListItemHTML(person) {
       if (!person || person.id === undefined) { console.error("[CREATE_PERSON_HTML] Invalid person:", person); return '<li>Error.</li>'; }
        const achievementCount = person.achievements?.length || 0;
        const achievementPreview = achievementCount > 0 ? `<span class="person-achievements-preview">🏆 ${achievementCount}</span>` : '';
        const truncatedName = person.name.length > 30 ? this.escapeHTML(person.name.substring(0, 27)) + "..." : this.escapeHTML(person.name);
        return `
            <li data-id="${person.id}" tabindex="-1">
                <div class="person-info" tabindex="0" role="button" aria-label="View details for ${this.escapeHTML(person.name)}">
                    <span class="person-avatar" aria-hidden="true">${this.escapeHTML(person.avatar || '❓')}</span>
                    <div class="person-name-details">
                        <span class="person-name">${truncatedName}</span>
                        <span class="person-details muted-text">${this.escapeHTML(person.role || '')} / ${this.escapeHTML(person.style || 'N/A')} ${achievementPreview}</span>
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
        const styleSelect = this.elements.style;
        const link = this.elements.styleExploreLink;
        if (!link || !styleSelect) return;
        const selectedStyleName = styleSelect.value;
        if (selectedStyleName) {
            console.log(`[UPDATE_STYLE_LINK] Updating link for style: ${selectedStyleName}`);
            link.dataset.styleName = selectedStyleName;
            link.style.display = 'inline';
            link.setAttribute('aria-label', `Explore details for ${this.escapeHTML(selectedStyleName)}`);
        } else {
            console.log("[UPDATE_STYLE_LINK] Hiding link.");
            link.style.display = 'none';
            link.removeAttribute('data-style-name');
            link.setAttribute('aria-label', `Explore style details`);
        }
    }

  // --- CRUD ---
  savePerson() {
      console.log("[SAVE_PERSON] START");
      const name = this.elements.name.value.trim();
      const role = this.elements.role.value;
      const style = this.elements.style.value;
      const avatar = this.elements.avatarInput.value || '❓';
      console.log(`[SAVE_PERSON] Collected - Name: ${name}, Role: ${role}, Style: ${style}, Avatar: ${avatar}, Edit ID: ${this.currentEditId}`);

      if (!name) { this.showNotification("Please enter a name.", "error"); console.warn("[SAVE_PERSON] Fail: Name missing."); this.elements.name.focus(); return; }
      if (!style && bdsmData[role]?.styles?.length > 0) { this.showNotification("Please select a style.", "error"); console.warn("[SAVE_PERSON] Fail: Style missing."); this.elements.style.focus(); return; }

      const traits = {};
      this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => { traits[slider.name] = parseInt(slider.value, 10); });
      console.log("[SAVE_PERSON] Collected traits:", traits);

      let personData;
      let isNewPerson = false;

      if (this.currentEditId !== null) {
          console.log(`[SAVE_PERSON] Editing ID: ${this.currentEditId}`);
          const personIndex = this.people.findIndex(p => p.id === this.currentEditId);
          if (personIndex === -1) { console.error(`[SAVE_PERSON] Edit Fail: ID ${this.currentEditId} not found!`); this.showNotification("Error: Cannot update persona.", "error"); this.resetForm(); return; }
          personData = this.people[personIndex];
          personData.name = name; personData.role = role; personData.style = style; personData.avatar = avatar; personData.traits = traits; personData.lastUpdated = new Date().toISOString();
          grantAchievement(personData, 'profile_edited');
          console.log(`[SAVE_PERSON] Updated data:`, personData);
      } else {
          console.log("[SAVE_PERSON] Creating new person.");
          isNewPerson = true;
          const newId = Date.now();
          personData = { id: newId, name, role, style, avatar, traits, goals: [], history: [], reflections: "", achievements: [], createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString(), };
          grantAchievement(personData, 'profile_created');
          if (avatar !== '❓') grantAchievement(personData, 'avatar_chosen');
          this.people.push(personData);
          console.log(`[SAVE_PERSON] Created ID ${newId}:`, personData);
      }

      Object.values(traits).forEach(score => { if(score === 5) grantAchievement(personData, 'max_trait'); if(score === 1) grantAchievement(personData, 'min_trait'); });
      if(isNewPerson && this.people.length >= 5) { grantAchievement({}, 'five_profiles'); localStorage.setItem('kinkCompass_five_profiles', 'true'); }

      this.lastSavedId = personData.id;
      this.saveToLocalStorage();
      this.showNotification(`Persona '${this.escapeHTML(name)}' saved!`, 'success');
      this.renderList();
      this.resetForm(); // Reset form AFTER save and render
      console.log("[SAVE_PERSON] END - Success.");
  } // End savePerson

  editPerson(personId) {
      console.log(`[EDIT_PERSON] START - ID: ${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!person) { console.error(`[EDIT_PERSON] Fail: ID ${personId} not found.`); this.showNotification(`Error: Persona not found.`, "error"); return; }
      console.log("[EDIT_PERSON] Found:", person);

      this.elements.name.value = person.name;
      this.elements.role.value = person.role;
      this.elements.avatarInput.value = person.avatar || '❓';
      this.elements.avatarDisplay.textContent = person.avatar || '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b=>b.classList.remove('selected'));
      const avatarBtn = this.elements.avatarPicker.querySelector(`.avatar-btn[data-emoji="${person.avatar}"]`);
      if(avatarBtn) avatarBtn.classList.add('selected');

      console.log("[EDIT_PERSON] Rendering styles for role:", person.role);
      this.renderStyles(person.role);
      // Need slight delay before setting value sometimes if options render slowly? Unlikely but possible.
      // requestAnimationFrame(() => { // Usually not needed
           this.elements.style.value = person.style;
           console.log("[EDIT_PERSON] Set style dropdown value to:", person.style);
      // });


      console.log("[EDIT_PERSON] Rendering traits for role/style:", person.role, person.style);
      this.currentEditId = personId; // Set ID *before* rendering traits
      this.renderTraits(person.role, person.style);

      if (this.elements.formTitle) this.elements.formTitle.textContent = `✨ Editing: ${this.escapeHTML(person.name)} ✨`;
      this.elements.save.textContent = 'Update Persona!💾';
      this.elements.clearForm.textContent = 'Cancel Edit ❌';

      this.updateLivePreview();
      this.updateStyleExploreLink();
      this.elements.formSection.scrollIntoView({ behavior: 'smooth' });
      this.elements.name.focus();
      console.log("[EDIT_PERSON] END - Form populated.");
  } // End editPerson

  deletePerson(personId) {
      console.log(`[DELETE_PERSON] START - ID: ${personId}`);
      const initialLength = this.people.length;
      this.people = this.people.filter(p => p.id !== personId);

      if (this.people.length < initialLength) {
          this.saveToLocalStorage();
          this.renderList();
          this.showNotification("Persona deleted.", "info");
          console.log(`[DELETE_PERSON] END - Success.`);
          if (this.currentEditId === personId) { console.log("[DELETE_PERSON] Resetting form as edited persona was deleted."); this.resetForm(); }
      } else {
          console.error(`[DELETE_PERSON] END - Fail: ID ${personId} not found.`);
          this.showNotification("Error: Could not find persona.", "error");
      }
  } // End deletePerson

  resetForm(isManualClear = false) {
      console.log(`[RESET_FORM] START - Manual: ${isManualClear}, Edit ID: ${this.currentEditId}`);
      if (!isManualClear && this.currentEditId !== null) console.log("[RESET_FORM] Canceling edit mode.");
      else if (isManualClear) console.log("[RESET_FORM] Manual clear initiated.");

      // *** FIX: Manual Reset ***
      this.elements.name.value = '';
      this.elements.role.value = 'submissive'; // Default role
      this.elements.avatarInput.value = '❓';
      this.elements.avatarDisplay.textContent = '❓';
      this.elements.avatarPicker.querySelectorAll('.avatar-btn.selected').forEach(b => b.classList.remove('selected'));
      if (this.elements.traitsContainer) {
          this.elements.traitsContainer.innerHTML = '';
          if(this.elements.traitsMessage) {
              this.elements.traitsMessage.textContent = 'Select Role & Style to see relevant traits...';
              this.elements.traitsMessage.style.display = 'block';
          }
          this.elements.traitsContainer.style.display = 'none';
      }
      console.log("[RESET_FORM] Manually reset form fields.");

      this.renderStyles(this.elements.role.value); // Render default styles
      // Traits container is hidden by default now, renderTraits not strictly needed here unless container shown
      this.elements.style.value = ''; // Clear style select

      this.currentEditId = null;
      if (this.elements.formTitle) this.elements.formTitle.textContent = '✨ Create New Persona ✨';
      this.elements.save.textContent = 'Save Persona! 💖';
      this.elements.clearForm.textContent = 'Clear Form 🧹';

      this.updateLivePreview();
      this.updateStyleExploreLink();
      console.log("[RESET_FORM] END - Complete.");
  } // End resetForm

  // --- Live Preview ---
  updateLivePreview() {
       // console.log("[LIVE_PREVIEW] Updating..."); // Noisy
       const previewElement = this.elements.livePreview;
       if (!previewElement) { console.error("[LIVE_PREVIEW] Live preview element not found!"); return; }

       const name = this.elements.name.value.trim() || "[Persona Name]";
       const role = this.elements.role.value;
       const style = this.elements.style.value;
       const avatar = this.elements.avatarInput.value || '❓';
       // console.log(`[LIVE_PREVIEW] Data - Name: ${name}, Role: ${role}, Style: ${style}, Avatar: ${avatar}`); // Noisy

       const traits = {};
       this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => { traits[slider.name] = parseInt(slider.value, 10); });
       // console.log("[LIVE_PREVIEW] Traits:", traits); // Noisy

       let previewHTML = `
             <h3 class="preview-title">${this.escapeHTML(avatar)} ${this.escapeHTML(name)}</h3>
             <p style="text-align:center;">(${this.escapeHTML(role)} / ${style ? this.escapeHTML(style) : '[Select Style]'})</p>
         `;

       if (role && style && Object.keys(traits).length > 0) {
             // console.log(`[LIVE_PREVIEW] Generating breakdown for role ${role}, style ${style}`); // Noisy
             let breakdown;
             try {
                 if (role === 'submissive') breakdown = getSubBreakdown(style, traits);
                 else if (role === 'dominant') breakdown = getDomBreakdown(style, traits);
                 else breakdown = { strengths: "Traits define flexible approach!", improvements: "Consider current leaning." };

                 if (breakdown && breakdown.strengths && breakdown.improvements) {
                     previewHTML += `<div class="preview-breakdown"><h4>Vibe Check:</h4><p class="strengths">${breakdown.strengths}</p><h4>Growth Edge:</h4><p class="improvements">${breakdown.improvements}</p></div>`;
                 } else { previewHTML += `<p class="muted-text" style="text-align:center;">Could not generate breakdown.</p>`; }
             } catch (error) { console.error(`[LIVE_PREVIEW] Error generating breakdown:`, error); previewHTML += `<p class="error-text" style="text-align:center;">Error generating breakdown.</p>`; }
       } else if (role && Object.keys(traits).length > 0 && !style) {
             previewHTML += `<p class="muted-text" style="text-align:center; margin-top: 1em;">Select a Style for breakdown...</p>`;
       } else if (role && !style) {
             previewHTML += `<p class="muted-text" style="text-align:center; margin-top: 1em;">Select Style & adjust traits...</p>`;
       } else {
             previewHTML += `<p class="muted-text" style="text-align:center; margin-top: 1em;">Fill form for preview...</p>`;
       }

       // --- Daily Challenge Integration ---
       // Create placeholder div. displayDailyChallenge will fill it later.
       previewHTML += `<div id="daily-challenge-area" style="margin-top: 1.5em; padding-top: 1em; border-top: 1px dashed var(--border-color);"><p class="muted-text">Loading focus...</p></div>`;

       previewElement.innerHTML = previewHTML;
       // Call displayDailyChallenge AFTER preview HTML is set
       this.displayDailyChallenge();
       // console.log("[LIVE_PREVIEW] Update complete."); // Noisy
   } // End updateLivePreview

  // --- Modal Display ---
  showPersonDetails(personId) {
      console.log(`[SHOW_PERSON_DETAILS] START - ID: ${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!person) { console.error(`[SHOW_PERSON_DETAILS] Fail: ID ${personId} not found.`); this.showNotification("Cannot load details.", "error"); return; }
      console.log(`[SHOW_PERSON_DETAILS] Found: ${person.name}`);

      const detailModal = this.elements.modal, modalBody = this.elements.modalBody, modalTabsContainer = this.elements.modalTabs, modalTitle = this.elements.detailModalTitle;
      if (!detailModal || !modalBody || !modalTabsContainer || !modalTitle) { console.error("[SHOW_PERSON_DETAILS] Fail: Modal elements missing."); this.showNotification("UI Error.", "error"); return; }
      console.log("[SHOW_PERSON_DETAILS] Modal elements found.");

      detailModal.dataset.personId = personId;
      modalTitle.textContent = `${person.avatar || '❓'} ${this.escapeHTML(person.name)} - Details`;
      modalBody.innerHTML = ''; modalTabsContainer.innerHTML = '';

      const tabs = [
          { id: 'tab-goals', label: 'Goals', icon: '🎯', renderFunc: this.renderGoalList },
          { id: 'tab-traits', label: 'Traits', icon: '🎨', renderFunc: this.renderTraitDetails },
          { id: 'tab-breakdown', label: 'Breakdown', icon: '📊', renderFunc: this.renderStyleBreakdownDetail },
          { id: 'tab-history', label: 'History', icon: '📈', renderFunc: this.renderHistoryTab },
          { id: 'tab-journal', label: 'Journal', icon: '📝', renderFunc: this.renderJournalTab },
          { id: 'tab-achievements', label: 'Achievements', icon: '🏆', renderFunc: this.renderAchievementsList },
          { id: 'tab-oracle', label: 'Oracle', icon: '🔮', renderFunc: this.renderOracleTab }
      ];

      console.log(`[SHOW_PERSON_DETAILS] Rendering ${tabs.length} tabs/panes...`);
      tabs.forEach((tab) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-link'; tabButton.textContent = `${tab.icon} ${tab.label}`;
            tabButton.dataset.tabId = tab.id; tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', `${tab.id}-content`); tabButton.id = `${tab.id}-tab`;
            const isActive = tab.id === this.activeDetailModalTab;
            tabButton.classList.toggle('active', isActive);
            tabButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
            modalTabsContainer.appendChild(tabButton);

            const contentPane = document.createElement('div');
            contentPane.className = 'tab-content'; contentPane.dataset.tabId = tab.id; contentPane.id = `${tab.id}-content`;
            contentPane.setAttribute('role', 'tabpanel'); contentPane.setAttribute('aria-labelledby', `${tab.id}-tab`);
            contentPane.classList.toggle('active', isActive);
             contentPane.innerHTML = ''; // Start empty, render on demand in handler or if active
             modalBody.appendChild(contentPane);

            if (isActive) {
                console.log(`[SHOW_PERSON_DETAILS] Rendering initial active tab: ${tab.id}`);
                this.renderDetailTabContent(person, tab.id, contentPane); // Initial render for active tab
                 // Special handling for chart after initial render
                 if (tab.id === 'tab-history' && person.history && person.history.length >= 2) {
                     setTimeout(() => {
                          console.log("[SHOW_PERSON_DETAILS] Initial render call to renderHistoryChart.");
                          this.renderHistoryChart(person, 'history-chart');
                     }, 150);
                 }
            }
      });

      console.log("[SHOW_PERSON_DETAILS] Calling openModal...");
      this.openModal(detailModal);
      console.log("[SHOW_PERSON_DETAILS] END - Modal should be open.");
  } // End showPersonDetails

  renderDetailTabContent(person, tabId, contentElement) {
        console.log(`[RENDER_DETAIL_TAB] Rendering person ${person.id}, tab ${tabId}`);
        if (!contentElement) { console.error(`[RENDER_DETAIL_TAB] Fail: No content element for ${tabId}.`); return; }
        contentElement.innerHTML = ''; // Clear before render

        try {
            let htmlContent = '';
            switch (tabId) {
                case 'tab-goals': htmlContent = this.renderGoalList(person); break;
                case 'tab-traits': htmlContent = this.renderTraitDetails(person); break;
                case 'tab-breakdown': htmlContent = this.renderStyleBreakdownDetail(person); break;
                case 'tab-history': htmlContent = this.renderHistoryTab(person); break; // Chart rendered separately by handler
                case 'tab-journal': htmlContent = this.renderJournalTab(person); break;
                case 'tab-achievements': htmlContent = this.renderAchievementsList(person); break;
                case 'tab-oracle': htmlContent = this.renderOracleTab(person); break;
                default: console.warn(`[RENDER_DETAIL_TAB] Unknown tabId: ${tabId}`); htmlContent = `<p>No content.</p>`;
            }
             contentElement.innerHTML = htmlContent;
             console.log(`[RENDER_DETAIL_TAB] Success for ${tabId}`);
        } catch (error) {
            console.error(`[RENDER_DETAIL_TAB] Error rendering ${tabId}:`, error);
            contentElement.innerHTML = `<p class="error-text">Error loading content.</p>`;
        }
    } // End renderDetailTabContent

    renderTraitDetails(person) {
        console.log(`[RENDER_TRAIT_DETAILS] Person ${person.id}`);
        let content = '<section><h3>🎨 Traits Profile</h3>';
        const roleData = bdsmData[person.role];
        if (!roleData) return '<p class="error-text">Role data error.</p>';
        const allTraits = [ ...(roleData.coreTraits || []), ...(roleData.styles?.find(s => s.name === person.style)?.traits || []) ];
        const uniqueTraits = [...new Map(allTraits.map(item => [item?.name, item])).values()].filter(Boolean); // Ensure unique & valid

        if (uniqueTraits.length === 0) { content += '<p>No traits defined.</p>'; }
        else {
            content += '<div class="trait-details-grid">';
            uniqueTraits.forEach(trait => {
                const score = person.traits?.[trait.name];
                const validScore = (!isNaN(parseInt(score)) && score >=1 && score <= 5) ? score : 3; // Use score or default to 3
                const description = trait.desc?.[validScore] || trait.explanation || 'No description.';
                const flair = this.getFlairForScore(validScore);
                content += `
                    <div class="trait-detail-item">
                        <h4>
                             <a href="#" class="glossary-link" data-term-key="${this.escapeHTML(trait.name)}">${this.escapeHTML(trait.name)} ${flair}</a>
                             <span class="trait-score-badge">Score: ${score ?? 'N/A'}</span>
                         </h4>
                        <p>${this.escapeHTML(description)}</p>
                    </div>`;
            });
            content += '</div>';
        }
        content += '</section>';
        const hints = this.getSynergyHints(person);
        if (hints.length > 0) {
            content += '<section><h3>✨ Trait Synergies ✨</h3><ul>';
            hints.forEach(hint => { content += `<li>${hint.type === 'positive' ? '➕' : '🤔'} ${this.escapeHTML(hint.text)}</li>`; });
            content += '</ul></section>';
        }
        console.log(`[RENDER_TRAIT_DETAILS] Finished.`);
        return content;
    } // End renderTraitDetails

    renderStyleBreakdownDetail(person) {
         console.log(`[RENDER_STYLE_BREAKDOWN] Person ${person.id}, Style ${person.style}`);
         let content = '<section>';
         if (person.role && person.style && person.traits) {
             let breakdown;
             try {
                 if (person.role === 'submissive') breakdown = getSubBreakdown(person.style, person.traits);
                 else if (person.role === 'dominant') breakdown = getDomBreakdown(person.style, person.traits);
                 else breakdown = { strengths: "Breakdown varies for Switches.", improvements: "Focus on communication." };

                 if (breakdown) {
                     content += `<h3>📊 ${this.escapeHTML(person.style)} Breakdown</h3><div class="style-breakdown"><h4>Strengths / Expressions:</h4><p class="strengths">${breakdown.strengths}</p><h4>Growth / Exploration:</h4><p class="improvements">${breakdown.improvements}</p></div>`;
                 } else { content += '<p>Cannot generate breakdown.</p>'; }
             } catch (error) { console.error(`[RENDER_STYLE_BREAKDOWN] Error:`, error); content += `<p class="error-text">Error generating breakdown.</p>`; }
         } else { content += '<p>Select Role, Style, & Traits for breakdown.</p>'; }
         content += '</section>';
         console.log(`[RENDER_STYLE_BREAKDOWN] Finished.`);
         return content;
    } // End renderStyleBreakdownDetail

    renderHistoryTab(person) {
         console.log(`[RENDER_HISTORY_TAB] Person ${person.id}`);
         const snapshots = person.history || [];
         let content = `<section id="tab-history-content"><h3>📈 Trait History</h3>`; // Ensure outer section has ID if needed
         content += `<div class="modal-actions"><button id="snapshot-btn" class="save-btn small-btn">Take Snapshot Now 📸</button></div>`;
          if (snapshots.length === 0) content += `<p>No snapshots taken yet.</p>`;
          else if (snapshots.length < 2) content += `<p>Need 2+ snapshots for chart.</p>`;
          else content += `<div class="history-chart-container"><canvas id="history-chart"></canvas></div>`; // *** Ensure canvas is created ***
           if(snapshots.length > 0) {
                content += '<h4>Recent Snapshots:</h4><ul class="snapshot-list">';
                snapshots.slice(-5).reverse().forEach((snapshot) => {
                    const date = new Date(snapshot.timestamp).toLocaleString();
                    content += `<li>${date} - <button type="button" class="link-button snapshot-toggle" onclick="window.kinkCompassApp.toggleSnapshotInfo(this)">View Traits</button>`;
                    content += '<div class="snapshot-details" style="display:none;"><ul>';
                    if (snapshot.traits) {
                         for(const trait in snapshot.traits) { content += `<li>${this.escapeHTML(trait)}: ${snapshot.traits[trait]}</li>`; }
                    } else { content += `<li>No trait data recorded.</li>`; }
                    content += '</ul></div></li>';
                });
                content += '</ul>';
                if(snapshots.length > 5) content += '<p>(Showing last 5)</p>';
           }
         content += '</section>';
          console.log(`[RENDER_HISTORY_TAB] Finished HTML structure.`);
         return content;
     } // End renderHistoryTab

     renderJournalTab(person) {
        console.log(`[RENDER_JOURNAL_TAB] Person ${person.id}`);
        let content = `<section><h3>📝 Journal & Reflections</h3><div class="modal-actions"><button id="journal-prompt-btn" class="small-btn">Get Prompt 🤔</button></div><div id="journal-prompt-area" class="journal-prompt" style="display:none;"></div><textarea id="reflections-textarea" class="reflections-textarea" placeholder="Reflect..." aria-label="Journal Entry">${this.escapeHTML(person.reflections || '')}</textarea><div class="modal-actions"><button id="save-reflections-btn" class="save-btn">Save Reflections💾</button></div></section>`;
        const goalHints = this.getGoalAlignmentHints(person);
        if(goalHints.length > 0) {
            content += `<section><h3>🎯 Goal Alignment Insights</h3><ul>`;
            goalHints.forEach(hint => { content += `<li>${this.escapeHTML(hint)}</li>`; });
            content += `</ul></section>`;
        }
         console.log(`[RENDER_JOURNAL_TAB] Finished.`);
        return content;
    } // End renderJournalTab

     renderOracleTab(person) {
         console.log(`[RENDER_ORACLE_TAB] Person ${person.id}`);
         let content = `<section><h3>🔮 Kink Compass Oracle</h3><div id="oracle-reading-output" class="kink-reading-output"><p>Consult Oracle...</p></div><div class="modal-actions" style="margin-top: 1em;"><button id="oracle-btn" class="small-btn accent-btn">Consult Oracle ✨</button></div></section>`;
         console.log(`[RENDER_ORACLE_TAB] Finished.`);
         return content;
     } // End renderOracleTab

  // --- New Feature Logic ---
   addGoal(personId, formElement) {
    console.log(`[ADD_GOAL] START - Person ${personId}`);
    if (!formElement) { console.error("[ADD_GOAL] No form element."); return; }
    const input = formElement.querySelector('input[type="text"]');
    if (!input) { console.error("[ADD_GOAL] No input field."); return; }
    const goalText = input.value.trim();
    if (!goalText) { this.showNotification("Enter goal text.", "warning"); console.warn("[ADD_GOAL] Empty text."); input.focus(); return; }
    const person = this.people.find(p => p.id === personId);
    if (!person) { console.error(`[ADD_GOAL] Person ${personId} not found.`); this.showNotification("Error: Persona not found.", "error"); return; }
    if (!person.goals) person.goals = [];
    const newGoal = { id: Date.now(), text: goalText, done: false, createdAt: new Date().toISOString() };
    person.goals.push(newGoal); this.saveToLocalStorage(); this.showNotification("Goal added!", "success"); grantAchievement(person, 'goal_added');
    console.log("[ADD_GOAL] Success:", newGoal);
    const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container');
    if (goalListContainer && this.activeDetailModalTab === 'tab-goals') { console.log("[ADD_GOAL] Re-rendering list."); goalListContainer.innerHTML = this.renderGoalList(person, true); }
    input.value = '';
    console.log("[ADD_GOAL] END");
   } // End addGoal

      toggleGoalStatus(personId, goalId, listItemElement = null) {
        console.log(`[TOGGLE_GOAL] START - Toggling goal ${goalId} for person ${personId}`);
        const person = this.people.find(p => p.id === personId);
        if (!person?.goals) { console.error(`[TOGGLE_GOAL] Fail: Person/goals not found.`); this.showNotification("Error updating goal.", "error"); return; }
        const goalIndex = person.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) { console.error(`[TOGGLE_GOAL] Fail: Goal ${goalId} not found.`); this.showNotification("Error: Goal not found.", "error"); return; }

        person.goals[goalIndex].done = !person.goals[goalIndex].done;
        const isDone = person.goals[goalIndex].done;
        person.goals[goalIndex].completedAt = isDone ? new Date().toISOString() : null;

        this.saveToLocalStorage();
        this.showNotification(isDone ? "Goal complete! 🎉" : "Goal incomplete.", isDone ? "success" : "info");

        if (isDone) {
            grantAchievement(person, 'goal_completed');
            const completedCount = person.goals.filter(g => g.done).length;
            if (completedCount >= 5) grantAchievement(person, 'five_goals_completed');
            this.checkGoalStreak(person);
        }

        console.log(`[TOGGLE_GOAL] Goal ${goalId} status set to ${isDone}`);

        // Update UI directly if listItemElement is provided
        if (listItemElement) {
            console.log("[TOGGLE_GOAL] Updating list item UI directly.");
            listItemElement.classList.toggle('done', isDone);
            const button = listItemElement.querySelector('.toggle-goal-btn');
            if (button) button.textContent = isDone ? 'Undo' : 'Done';

            if (isDone) {
                 const span = listItemElement.querySelector('span:first-child');
                 if(span) {
                     span.classList.add('goal-completed-animation');
                     setTimeout(() => span.classList.remove('goal-completed-animation'), 600);
                 }
            } // <<< *** ADDED MISSING '}' HERE ***
        } else { // This 'else' correctly corresponds to 'if (listItemElement)'
             console.log("[TOGGLE_GOAL] No list item. Full re-render needed if visible.");
             const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container');
             if (goalListContainer && this.activeDetailModalTab === 'tab-goals') {
                 console.log("[TOGGLE_GOAL] Re-rendering list after toggle.");
                 goalListContainer.innerHTML = this.renderGoalList(person, true); // Render just list part
             }
        }
        console.log("[TOGGLE_GOAL] END");
    } // End toggleGoalStatus
   deleteGoal(personId, goalId) {
        console.log(`[DELETE_GOAL] START - Goal ${goalId}, Person ${personId}`);
        const person = this.people.find(p => p.id === personId);
        if (!person?.goals) { console.error(`[DELETE_GOAL] Fail: Person/goals not found.`); this.showNotification("Error deleting goal.", "error"); return; }
        const initialLength = person.goals.length;
        person.goals = person.goals.filter(g => g.id !== goalId);
        if (person.goals.length < initialLength) {
            this.saveToLocalStorage(); this.showNotification("Goal deleted.", "info"); console.log(`[DELETE_GOAL] Success.`);
            const goalListContainer = document.querySelector('#tab-goals-content #goal-list-container');
             if (goalListContainer && this.activeDetailModalTab === 'tab-goals') { console.log("[DELETE_GOAL] Re-rendering list."); goalListContainer.innerHTML = this.renderGoalList(person, true); }
        } else { console.error(`[DELETE_GOAL] Fail: Goal ${goalId} not found.`); this.showNotification("Error: Goal not found.", "error"); }
        console.log("[DELETE_GOAL] END");
    } // End deleteGoal

    renderGoalList(person, returnListOnly = false) {
        console.log(`[RENDER_GOAL_LIST] Person ${person.id}. List only: ${returnListOnly}`);
        const goals = person.goals || [];
        let listHTML = '<ul id="goal-list">';
        if (goals.length === 0) listHTML += '<li>No goals set.</li>';
        else { goals.forEach(goal => { const isDone = goal.done; listHTML += `<li class="${isDone ? 'done' : ''}" data-goal-id="${goal.id}"><span>${this.escapeHTML(goal.text)}</span><div class="goal-actions"><button class="small-btn toggle-goal-btn" data-goal-id="${goal.id}">${isDone ? 'Undo' : 'Done'}</button><button class="small-btn delete-btn delete-goal-btn" data-goal-id="${goal.id}" aria-label="Delete goal">🗑️</button></div></li>`; }); }
        listHTML += '</ul>';
        if (returnListOnly) { console.log(`[RENDER_GOAL_LIST] Return list HTML only.`); return listHTML; }
        const fullContent = `<section id="tab-goals-content"><h3>🎯 Goals</h3><div id="goal-list-container">${listHTML}</div><hr><h4>Add New:</h4><form id="add-goal-form" class="add-goal-form" action="#"><input type="text" placeholder="Practice communication..." required aria-label="New goal"><button type="submit" id="add-goal-btn" class="small-btn save-btn">Add</button></form></section>`;
        console.log(`[RENDER_GOAL_LIST] Return full tab content.`);
        return fullContent;
    } // End renderGoalList

  showJournalPrompt(personId) {
        console.log(`[JOURNAL_PROMPT] Person ${personId}`);
        const promptArea = document.getElementById('journal-prompt-area');
        if (!promptArea) { console.warn("[JOURNAL_PROMPT] Area not found."); return; }
        try { const prompt = getRandomPrompt(); promptArea.textContent = prompt; promptArea.style.display = 'block'; console.log(`[JOURNAL_PROMPT] Prompt: ${prompt}`); const person = this.people.find(p => p.id === personId); if(person) grantAchievement(person, 'prompt_used'); }
        catch (error) { console.error("[JOURNAL_PROMPT] Error:", error); promptArea.textContent = "Error."; promptArea.style.display = 'block'; }
  }

  saveReflections(personId) {
      console.log(`[SAVE_REFLECTIONS] START - Person ${personId}`);
      const textarea = document.getElementById('reflections-textarea');
      if (!textarea) { console.error("[SAVE_REFLECTIONS] Textarea not found."); this.showNotification("Error: UI missing.", "error"); return; }
      const person = this.people.find(p => p.id === personId);
      if (!person) { console.error(`[SAVE_REFLECTIONS] Person ${personId} not found.`); this.showNotification("Error: Persona missing.", "error"); return; }
      person.reflections = textarea.value; person.lastUpdated = new Date().toISOString();
      this.saveToLocalStorage(); this.showNotification("Reflections saved!", "success");
      grantAchievement(person, 'reflection_saved');
      const entryCount = (person.history?.filter(h => h.type === 'reflection').length || 0) + 1; // Simplistic
      if (entryCount >= 5) grantAchievement(person, 'five_reflections'); if (entryCount >= 10) grantAchievement(person, 'journal_journeyman');
      textarea.classList.add('input-just-saved'); setTimeout(() => textarea.classList.remove('input-just-saved'), 1500);
      console.log("[SAVE_REFLECTIONS] END - Success.");
  } // End saveReflections

  addSnapshotToHistory(personId) {
      console.log(`[ADD_SNAPSHOT] START - Person ${personId}`);
      const person = this.people.find(p => p.id === personId);
      if (!person?.traits) { console.error(`[ADD_SNAPSHOT] Fail: Person/traits not found.`); this.showNotification("Error: Data missing.", "error"); return; }
      if (!person.history) person.history = [];
      const newSnapshot = { timestamp: new Date().toISOString(), traits: { ...person.traits } };
      this.checkTraitTransformation(person, newSnapshot); this.checkConsistentSnapper(person, newSnapshot.timestamp);
      person.history.push(newSnapshot); person.lastUpdated = newSnapshot.timestamp;
      this.saveToLocalStorage(); this.showNotification("Snapshot saved! 📸", "success");
      grantAchievement(person, 'history_snapshot'); if (person.history.length >= 10) grantAchievement(person, 'ten_snapshots');
      console.log("[ADD_SNAPSHOT] Added:", newSnapshot);
      const historyTabContent = document.querySelector('#tab-history-content');
      if (historyTabContent && this.activeDetailModalTab === 'tab-history') {
           console.log("[ADD_SNAPSHOT] Re-rendering history tab.");
           this.renderDetailTabContent(person, 'tab-history', historyTabContent);
            // Re-render chart after tab content is updated
             if (person.history.length >= 2) {
                 setTimeout(() => {
                      console.log("[ADD_SNAPSHOT] Delayed call to renderHistoryChart after snapshot.");
                      this.renderHistoryChart(person, 'history-chart');
                 }, 150);
             }
      }
      console.log("[ADD_SNAPSHOT] END");
  } // End addSnapshotToHistory

  renderHistoryChart(person, canvasId) {
      console.log(`[RENDER_HISTORY_CHART] START - Person ${person.id}, Canvas #${canvasId}`);
      const canvasElement = document.getElementById(canvasId);
      const container = canvasElement?.parentElement;
      if (!canvasElement) { console.warn(`[RENDER_HISTORY_CHART] Canvas #${canvasId} not found.`); if(container) container.innerHTML = '<p>Chart canvas missing.</p>'; return; }
      if (!container) console.warn(`[RENDER_HISTORY_CHART] Chart container not found.`);
      if (!person?.history || person.history.length < 2) { console.log("[RENDER_HISTORY_CHART] <2 data points."); if(container) container.innerHTML = '<p>Need 2+ snapshots for chart.</p>'; else canvasElement.style.display = 'none'; return; }
      if (typeof Chart === 'undefined') { console.error("[RENDER_HISTORY_CHART] Chart.js not loaded!"); if(container) { container.innerHTML = '<p class="error-text">Charting library failed.</p>'; } return; }

      if(container) container.classList.add('chart-loading'); canvasElement.style.visibility = 'hidden';
      console.log(`[RENDER_HISTORY_CHART] Data points: ${person.history.length}`);
      const historyData = person.history; const labels = historyData.map(snap => new Date(snap.timestamp).toLocaleDateString());
      const allTraitNames = [...new Set(historyData.flatMap(snap => Object.keys(snap.traits || {})))];
      console.log("[RENDER_HISTORY_CHART] Traits in history:", allTraitNames);
      const datasets = allTraitNames.map((traitName, index) => { const dataPoints = historyData.map(snap => snap.traits?.[traitName] ?? null); const hue = (index * (360 / Math.max(1, allTraitNames.length))) % 360; const color = `hsl(${hue}, 70%, 60%)`; return { label: traitName, data: dataPoints, borderColor: color, backgroundColor: color + '30', tension: 0.1, spanGaps: true, pointRadius: 3, pointHoverRadius: 6 }; });
      // console.log("[RENDER_HISTORY_CHART] Datasets:", datasets); // Very noisy

      if (this.chartInstance) { console.log("[RENDER_HISTORY_CHART] Destroying previous instance."); this.chartInstance.destroy(); this.chartInstance = null; }

      requestAnimationFrame(() => {
           try {
               const ctx = canvasElement.getContext('2d'); console.log("[RENDER_HISTORY_CHART] Creating Chart instance.");
               this.chartInstance = new Chart(ctx, {
                   type: 'line', data: { labels: labels, datasets: datasets },
                   options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, suggestedMax: 5.5, title: { display: true, text: 'Score' }, grid: { color: getComputedStyle(document.body).getPropertyValue('--chart-grid-color') || 'rgba(0,0,0,0.1)' } }, x: { title: { display: true, text: 'Date' }, grid: { display: false } } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } }, tooltip: { mode: 'index', intersect: false } }, interaction: { mode: 'nearest', axis: 'x', intersect: false } }
               }); console.log("[RENDER_HISTORY_CHART] Chart created.");
           } catch (error) { console.error("[RENDER_HISTORY_CHART] Error creating Chart:", error); if(container) container.innerHTML = '<p class="error-text">Error rendering chart.</p>'; }
           finally { if(container) container.classList.remove('chart-loading'); canvasElement.style.visibility = 'visible'; }
       });
       console.log("[RENDER_HISTORY_CHART] END");
   } // End renderHistoryChart

    toggleSnapshotInfo(button) {
         console.log("[TOGGLE_SNAPSHOT_INFO] Clicked.");
         const detailsDiv = button.nextElementSibling;
         if (detailsDiv?.classList.contains('snapshot-details')) {
             const isVisible = detailsDiv.style.display !== 'none';
             detailsDiv.style.display = isVisible ? 'none' : 'block'; button.textContent = isVisible ? 'View Traits' : 'Hide Traits';
             console.log(`[TOGGLE_SNAPSHOT_INFO] Visibility: ${!isVisible}`);
         } else { console.warn("[TOGGLE_SNAPSHOT_INFO] Details div not found:", button); }
     }

  renderAchievementsList(person = null) {
      const targetId = person ? `achievements-list-${person.id}` : 'all-achievements-list';
      console.log(`[RENDER_ACHIEVEMENTS] For ${person ? `Person ${person.id}` : 'All'}. Target: ${targetId}`);
      let listHTML = ''; const achievementKeys = Object.keys(achievementList);
      if (achievementKeys.length === 0) return '<p>No achievements defined.</p>';
      achievementKeys.forEach(key => {
            const achievement = achievementList[key]; if (!achievement) return;
            const isUnlocked = person ? hasAchievement(person, key) : false;
            const statusClass = person ? (isUnlocked ? 'unlocked' : 'locked') : '';
            const icon = isUnlocked ? '🏆' : (person ? '🔒' : '🏅');
            const name = achievement.name || 'Unnamed';
            const desc = person ? (isUnlocked ? achievement.desc : 'Keep exploring!') : achievement.desc;
            listHTML += `<li class="${statusClass}"><span class="achievement-icon">${icon}</span><div class="achievement-details"><span class="achievement-name">${this.escapeHTML(name)}</span><span class="achievement-desc">${this.escapeHTML(desc)}</span></div></li>`;
      });
      console.log(`[RENDER_ACHIEVEMENTS] Generated HTML.`);
       if(person) return `<section><h3>🏆 Achievements Unlocked</h3><ul class="achievements-section-list">${listHTML}</ul></section>`;
       else return `<ul id="${targetId}" class="all-achievements-list">${listHTML}</ul>`;
  } // End renderAchievementsList

  showAchievements() {
      console.log("[SHOW_ACHIEVEMENTS] Opening modal.");
      const modal = this.elements.achievementsModal, body = this.elements.achievementsBody;
      if (!modal || !body) { console.error("[SHOW_ACHIEVEMENTS] Fail: Modal/body missing."); this.showNotification("UI Error.", "error"); return; }
      body.innerHTML = `<p>Explore all possible milestones!</p>${this.renderAchievementsList(null)}`;
      this.openModal(modal); console.log("[SHOW_ACHIEVEMENTS] Modal opened.");
  }

  showKinkOracle(personId) {
       console.log(`[SHOW_KINK_ORACLE] Person ${personId}`);
       const outputElement = document.getElementById('oracle-reading-output');
       if (!outputElement) { console.error("[SHOW_KINK_ORACLE] Output element missing."); this.showNotification("UI Error.", "error"); return; }
       const person = this.people.find(p => p.id === personId);
       if (!person) { console.error(`[SHOW_KINK_ORACLE] Person ${personId} not found.`); outputElement.innerHTML = `<p class="error-text">Persona error.</p>`; return; }
       outputElement.innerHTML = `<p><i>Spinning...</i> ✨</p>`;
       setTimeout(() => {
            try {
                const readingData = this.getKinkOracleReading(person); if(!readingData) throw new Error("No reading generated.");
                outputElement.innerHTML = `<p>${this.escapeHTML(readingData.opening)}</p><p><strong>Focus:</strong> ${this.escapeHTML(readingData.focus)}</p><p><em>${this.escapeHTML(readingData.encouragement)}</em></p><p>${this.escapeHTML(readingData.closing)}</p>`;
                console.log("[SHOW_KINK_ORACLE] Reading:", readingData);
                grantAchievement(person, 'kink_reading_oracle'); this.saveToLocalStorage();
            } catch (error) { console.error("[SHOW_KINK_ORACLE] Error:", error); outputElement.innerHTML = `<p class="error-text">Oracle silent. Try later.</p>`; }
        }, 500);
  }

   displayDailyChallenge() {
       console.log("[DAILY_CHALLENGE] Displaying.");
       const area = this.elements.livePreview?.querySelector('#daily-challenge-area');
       if (!area) { console.warn("[DAILY_CHALLENGE] Area not found inside live preview. Skipping."); return; }
        try {
            const challenge = this.getDailyChallenge(null);
            if (challenge) {
                 area.innerHTML = `<h4 style="margin-bottom: 0.5em;">🌟 Today's Focus 🌟</h4><h5>${this.escapeHTML(challenge.title)}</h5><p>${this.escapeHTML(challenge.desc)}</p><p class="muted-text"><small>(Category: ${this.escapeHTML(challenge.category)})</small></p>`;
                 area.style.display = 'block'; console.log("[DAILY_CHALLENGE] Displayed:", challenge); localStorage.setItem('kinkCompass_challenge_accepted', 'true');
             } else { console.log("[DAILY_CHALLENGE] No challenge. Hiding."); area.innerHTML = ''; area.style.display = 'none'; }
        } catch (error) { console.error("[DAILY_CHALLENGE] Error:", error); area.innerHTML = `<p>Challenge error.</p>`; area.style.display = 'block'; }
   } // End displayDailyChallenge

  // --- Glossary, Style Discovery ---
  showGlossary(termKeyToHighlight = null) {
      console.log(`[SHOW_GLOSSARY] Open. Highlight: ${termKeyToHighlight}`);
      const modal = this.elements.glossaryModal, body = this.elements.glossaryBody;
      if (!modal || !body) { console.error("[SHOW_GLOSSARY] Fail: Modal/body missing."); this.showNotification("UI Error.", "error"); return; }
      body.innerHTML = ''; const sortedKeys = Object.keys(glossaryTerms).sort((a, b) => glossaryTerms[a].term.localeCompare(glossaryTerms[b].term));
      if (sortedKeys.length === 0) { body.innerHTML = '<p>Glossary empty.</p>'; }
      else { const dl = document.createElement('dl'); sortedKeys.forEach(key => { const termData = glossaryTerms[key]; if (!termData) return; const dt = document.createElement('dt'); dt.id = `glossary-${key}`; dt.textContent = termData.term; const dd = document.createElement('dd'); dd.textContent = termData.definition; if (termData.related?.length > 0) { const relatedP = document.createElement('p'); relatedP.className = 'related-terms'; relatedP.innerHTML = 'Related: '; termData.related.forEach((relatedKey, index) => { if (glossaryTerms[relatedKey]) { const link = document.createElement('a'); link.href = `#glossary-${relatedKey}`; link.textContent = glossaryTerms[relatedKey].term; link.classList.add('glossary-link'); link.dataset.termKey = relatedKey; relatedP.appendChild(link); if (index < termData.related.length - 1) relatedP.appendChild(document.createTextNode(', ')); } }); dd.appendChild(relatedP); } dl.appendChild(dt); dl.appendChild(dd); }); body.appendChild(dl); }
      this.openModal(modal); console.log("[SHOW_GLOSSARY] Modal opened.");
      if (termKeyToHighlight) {
           console.log(`[SHOW_GLOSSARY] Highlight/scroll: ${termKeyToHighlight}`);
           requestAnimationFrame(() => { const element = document.getElementById(`glossary-${termKeyToHighlight}`); if (element) { console.log("[SHOW_GLOSSARY] Found:", element); element.classList.add('highlighted-term'); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); console.log("[SHOW_GLOSSARY] Scrolled."); setTimeout(() => { element.classList.remove('highlighted-term'); console.log(`[SHOW_GLOSSARY] Highlight removed.`); }, 2500); } else { console.warn(`[SHOW_GLOSSARY] Element ID not found: glossary-${termKeyToHighlight}`); } });
      }
  } // End showGlossary

  showStyleDiscovery(styleNameToHighlight = null) {
       console.log(`[STYLE_DISCOVERY] Open. Highlight: ${styleNameToHighlight}`);
       const modal = this.elements.styleDiscoveryModal, body = this.elements.styleDiscoveryBody, roleFilter = this.elements.styleDiscoveryRoleFilter;
       if (!modal || !body || !roleFilter) { console.error("[STYLE_DISCOVERY] Fail: Modal elements missing."); this.showNotification("UI Error.", "error"); return; }
       roleFilter.value = 'all'; console.log("[STYLE_DISCOVERY] Filter reset.");
       this.renderStyleDiscoveryContent(styleNameToHighlight); // Pass highlight name
       this.openModal(modal); console.log("[STYLE_DISCOVERY] Modal opened.");
   } // End showStyleDiscovery

  renderStyleDiscoveryContent(styleNameToHighlight = null) {
      console.log(`[RENDER_STYLE_DISCOVERY] Render. Highlight: ${styleNameToHighlight}`);
      const body = this.elements.styleDiscoveryBody, roleFilter = this.elements.styleDiscoveryRoleFilter.value;
      console.log(`[RENDER_STYLE_DISCOVERY] Filter: ${roleFilter}`);
      if (!body) { console.error("[RENDER_STYLE_DISCOVERY] Fail: Body missing."); return; }
      body.innerHTML = '<p>Loading...</p>';
      let stylesToDisplay = []; const rolesToInclude = roleFilter === 'all' ? ['submissive', 'dominant', 'switch'] : [roleFilter];
      rolesToInclude.forEach(roleKey => { if (bdsmData[roleKey]?.styles) { stylesToDisplay.push(...bdsmData[roleKey].styles.map(style => ({ ...style, role: roleKey }))); } });
      stylesToDisplay.sort((a, b) => a.name.localeCompare(b.name));
      console.log(`[RENDER_STYLE_DISCOVERY] Found ${stylesToDisplay.length} styles.`);
      if (stylesToDisplay.length === 0) { body.innerHTML = '<p>No styles found.</p>'; return; }
      let contentHTML = ''; stylesToDisplay.forEach(style => { const styleKey = `style-discovery-${this.escapeHTML(style.role)}-${this.escapeHTML(style.name.replace(/[^a-zA-Z0-9]/g, '-'))}`; const breakdown = style.summary || "No summary."; const coreTraits = bdsmData[style.role]?.coreTraits?.map(t => t.name) || []; const styleTraits = style.traits?.map(t => t.name) || []; const allTraitNames = [...new Set([...coreTraits, ...styleTraits])]; contentHTML += `<div class="style-discovery-item" id="${styleKey}"><h4>${this.escapeHTML(style.name)} <small>(${this.escapeHTML(style.role)})</small></h4><p>${this.escapeHTML(breakdown)}</p>${allTraitNames.length > 0 ? `<p><small>Traits: ${allTraitNames.map(t => this.escapeHTML(t)).join(', ')}</small></p>` : ''}</div>`; });
      body.innerHTML = contentHTML; console.log("[RENDER_STYLE_DISCOVERY] Rendered items.");
      if (styleNameToHighlight) {
           console.log(`[RENDER_STYLE_DISCOVERY] Highlight/scroll: ${styleNameToHighlight}`);
           requestAnimationFrame(() => { let elementToHighlight = null; const items = body.querySelectorAll('.style-discovery-item'); items.forEach(item => { const h4 = item.querySelector('h4'); if (h4 && h4.textContent.includes(styleNameToHighlight)) { elementToHighlight = item; } }); if (elementToHighlight) { console.log("[RENDER_STYLE_DISCOVERY] Found:", elementToHighlight); elementToHighlight.classList.add('highlighted-style'); elementToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' }); console.log("[RENDER_STYLE_DISCOVERY] Scrolled."); setTimeout(() => { elementToHighlight.classList.remove('highlighted-style'); console.log(`[RENDER_STYLE_DISCOVERY] Highlight removed.`); }, 2500); } else { console.warn(`[RENDER_STYLE_DISCOVERY] Element not found: ${styleNameToHighlight}`); } });
      }
   } // End renderStyleDiscoveryContent

  // --- Data Import/Export ---
  exportData() {
      console.log("[EXPORT_DATA] Start.");
      try { const dataStr = JSON.stringify({ people: this.people, version: "KinkCompass_v2.8" }, null, 2); const blob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'); link.download = `kinkcompass_backup_${timestamp}.json`; console.log(`[EXPORT_DATA] File: ${link.download}`); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); this.showNotification("Data exported!", "success"); grantAchievement({}, 'data_exported'); localStorage.setItem('kinkCompass_data_exported', 'true'); console.log("[EXPORT_DATA] END - Success."); }
      catch (error) { console.error("[EXPORT_DATA] Error:", error); this.showNotification("Export error.", "error"); }
  } // End exportData

  importData(event) {
      console.log("[IMPORT_DATA] Start."); const file = event.target.files[0]; if (!file) { console.log("[IMPORT_DATA] No file."); return; }
      console.log(`[IMPORT_DATA] File: ${file.name}, Type: ${file.type}`);
      if (file.type !== 'application/json') { this.showNotification("File must be .json.", "error"); console.warn("[IMPORT_DATA] Wrong type."); event.target.value = null; return; }
      const reader = new FileReader();
      reader.onload = (e) => { console.log("[IMPORT_DATA] File read."); try { const importedData = JSON.parse(e.target.result); console.log("[IMPORT_DATA] JSON parsed."); if (!importedData?.people || !Array.isArray(importedData.people)) throw new Error("Invalid format: Missing 'people' array."); if (!confirm(`Import ${importedData.people.length} personas? REPLACES current data.`)) { console.log("[IMPORT_DATA] Cancelled."); event.target.value = null; return; } console.log("[IMPORT_DATA] Confirmed."); this.people = importedData.people; console.log(`[IMPORT_DATA] Replaced data.`); this.people.forEach(p => { if (!p.id) p.id = Date.now() + Math.random(); if (!p.achievements) p.achievements = []; if (!p.goals) p.goals = []; if (!p.history) p.history = []; if (p.reflections === undefined) p.reflections = ""; }); this.saveToLocalStorage(); this.renderList(); this.resetForm(); this.showNotification("Data imported!", "success"); grantAchievement({}, 'data_imported'); localStorage.setItem('kinkCompass_data_imported', 'true'); console.log("[IMPORT_DATA] END - Success."); } catch (error) { console.error("[IMPORT_DATA] Error processing:", error); this.showNotification(`Import failed: ${error.message}.`, "error", 6000); } finally { event.target.value = null; console.log("[IMPORT_DATA] Input reset."); } };
      reader.onerror = (e) => { console.error("[IMPORT_DATA] Reader error:", e); this.showNotification("Error reading file.", "error"); event.target.value = null; };
      console.log("[IMPORT_DATA] Reading text..."); reader.readAsText(file);
  } // End importData

  // --- Popups ---
   showTraitInfo(traitName) {
       console.log(`[SHOW_TRAIT_INFO] For: ${traitName}`);
       const popup = this.elements.traitInfoPopup, title = this.elements.traitInfoTitle, body = this.elements.traitInfoBody;
       if (!popup || !title || !body) { console.error("[SHOW_TRAIT_INFO] Fail: Popup elements missing."); return; }
        let explanation = `Details for '${traitName}' not found.`; let found = false;
         for (const roleKey in bdsmData) { const roleData = bdsmData[roleKey]; const coreTrait = roleData.coreTraits?.find(t => t.name === traitName); if (coreTrait?.explanation) { explanation = coreTrait.explanation; found = true; break; } const styleTrait = roleData.styles?.flatMap(s => s.traits || []).find(t => t.name === traitName); if (styleTrait?.explanation) { explanation = styleTrait.explanation; found = true; break; } }
        if (!found) console.warn(`[SHOW_TRAIT_INFO] Explanation missing for: ${traitName}`);
       title.textContent = `About: ${this.escapeHTML(traitName)}`; body.innerHTML = `<p>${this.escapeHTML(explanation)}</p>`;
       popup.style.display = 'block'; popup.setAttribute('aria-hidden', 'false'); this.elements.traitInfoClose?.focus();
       console.log("[SHOW_TRAIT_INFO] Displayed."); grantAchievement({}, 'trait_info_viewed'); localStorage.setItem('kinkCompass_trait_info_viewed', 'true');
   } // End showTraitInfo

   hideTraitInfo() {
        console.log("[HIDE_TRAIT_INFO] Hiding.");
        const popup = this.elements.traitInfoPopup; if (!popup) return;
        popup.style.display = 'none'; popup.setAttribute('aria-hidden', 'true');
        const triggerButton = document.querySelector('.trait-info-btn[aria-expanded="true"]');
        if(triggerButton) { triggerButton.setAttribute('aria-expanded', 'false'); triggerButton.focus(); console.log("[HIDE_TRAIT_INFO] Focus returned."); }
        else { console.log("[HIDE_TRAIT_INFO] Trigger button not found."); }
    } // End hideTraitInfo

   showContextHelp(helpKey) {
        console.log(`[SHOW_CONTEXT_HELP] Key: ${helpKey}`);
        const popup = this.elements.contextHelpPopup, title = this.elements.contextHelpTitle, body = this.elements.contextHelpBody;
        const triggerButton = document.querySelector(`.context-help-btn[data-help-key="${helpKey}"]`);
        if (!popup || !title || !body) { console.error("[SHOW_CONTEXT_HELP] Fail: Popup elements missing."); return; }
        const helpText = contextHelpTexts[helpKey] || "No help available."; console.log(`[SHOW_CONTEXT_HELP] Text: ${helpText}`);
        title.textContent = `Help: ${this.escapeHTML(helpKey)}`; body.innerHTML = `<p>${this.escapeHTML(helpText)}</p>`;
        popup.style.display = 'block'; popup.setAttribute('aria-hidden', 'false'); this.elements.contextHelpClose?.focus();
        document.querySelectorAll('.context-help-btn[aria-expanded="true"]').forEach(btn => { if (btn !== triggerButton) btn.setAttribute('aria-expanded', 'false'); });
        if(triggerButton) triggerButton.setAttribute('aria-expanded', 'true');
        console.log("[SHOW_CONTEXT_HELP] Displayed.");
    } // End showContextHelp

    hideContextHelp() {
        console.log("[HIDE_CONTEXT_HELP] Hiding.");
        const popup = this.elements.contextHelpPopup; if (!popup) return;
        popup.style.display = 'none'; popup.setAttribute('aria-hidden', 'true');
        const triggerButton = document.querySelector('.context-help-btn[aria-expanded="true"]');
        if(triggerButton) { triggerButton.setAttribute('aria-expanded', 'false'); triggerButton.focus(); console.log("[HIDE_CONTEXT_HELP] Focus returned."); }
        else { console.log("[HIDE_CONTEXT_HELP] Trigger button not found."); }
    } // End hideContextHelp


  // --- Style Finder Methods (Full Implementation) ---
    sfStart() {
        console.log("[SF_START] Executing...");
        this.styleFinderActive = true;
        this.styleFinderStep = 0;
        this.styleFinderRole = null;
        this.styleFinderAnswers = { traits: {} };
        this.styleFinderScores = {};
        this.hasRenderedDashboard = false;
        this.previousScores = null;
        this.styleFinderTraits = []; // Reset traits
        this.traitFootnotes = {};
        this.sliderDescriptions = {};

        if (!this.elements.sfModal) {
            console.error("[SF_START] Style Finder modal element not found!");
            this.showNotification("Error: Style Finder UI missing.", "error");
            return;
        }

        // Clear previous content explicitly
        if(this.elements.sfStepContent) this.elements.sfStepContent.innerHTML = '';
        if(this.elements.sfDashboard) this.elements.sfDashboard.innerHTML = '';
        if(this.elements.sfProgressTracker) this.elements.sfProgressTracker.innerHTML = '';

        this.sfRenderStep(); // Render the first step (Welcome)
        this.openModal(this.elements.sfModal);
        this.sfShowFeedback("Let's begin your style quest!");
        console.log("[SF_START] Style Finder initialized and modal opened.");
    } // End sfStart

    sfClose() {
        console.log("[SF_CLOSE] Closing Style Finder.");
        this.styleFinderActive = false; // Mark as inactive
        this.closeModal(this.elements.sfModal);
        console.log("[SF_CLOSE] Closed.");
    } // End sfClose

    sfCalculateSteps() {
        // console.log("[SF_CALC_STEPS] Calculating steps..."); // Noisy
        const steps = [];
        steps.push({ type: 'welcome' });
        steps.push({ type: 'role' });
        if (this.styleFinderRole) {
            this.styleFinderTraits.forEach(trait => steps.push({ type: 'trait', trait: trait.name }));
        }
        steps.push({ type: 'roundSummary', round: 'Traits' });
        steps.push({ type: 'result' });
        // console.log(`[SF_CALC_STEPS] Total steps: ${steps.length}`); // Noisy
        return steps;
    } // End sfCalculateSteps

     sfRenderStep() {
        console.log(`[SF_RENDER_STEP] Rendering step ${this.styleFinderStep}, Role: ${this.styleFinderRole}`);
        if (!this.styleFinderActive || !this.elements.sfStepContent || !this.elements.sfProgressTracker || !this.elements.sfDashboard) {
            console.warn("[SF_RENDER_STEP] Cannot render - SF not active or required elements missing.");
            return;
        }

        // Make sure sfTraitData is populated
         if (!this.sfTraitData || !this.sfTraitData.styles || !this.sfTraitData.subFinderTraits || !this.sfTraitData.domFinderTraits) {
            console.error("[SF_RENDER_STEP] CRITICAL: sfTraitData is not fully populated in the constructor! SF cannot function.");
            this.elements.sfStepContent.innerHTML = '<p class="error-text">Style Finder internal data missing. Check console.</p>';
             return;
         }


        const steps = this.sfCalculateSteps();
        const totalSteps = steps.length;

        if (this.styleFinderStep < 0 || this.styleFinderStep >= totalSteps) {
            console.error(`[SF_RENDER_STEP] Invalid step index: ${this.styleFinderStep}. Resetting.`);
            this.styleFinderStep = 0;
        }

        const step = steps[this.styleFinderStep];
        if (!step) {
            console.error(`[SF_RENDER_STEP] No step data for index ${this.styleFinderStep}.`);
            this.elements.sfStepContent.innerHTML = '<p class="error-text">Error loading step.</p>';
            return;
        }

        console.log(`[SF_RENDER_STEP] Step type: ${step.type}`);
        let html = "";
        let progressText = "";

        // Update Progress Tracker
        if (step.type === 'trait' && this.styleFinderRole) {
            const currentTraitIndex = this.styleFinderTraits.findIndex(t => t.name === step.trait);
            const questionsTotal = this.styleFinderTraits.length;
            progressText = `Trait ${currentTraitIndex + 1} of ${questionsTotal}`;
            this.elements.sfProgressTracker.style.display = 'block';
        } else if (this.styleFinderStep > 1 && this.styleFinderStep < totalSteps - 1) {
             progressText = `Step ${this.styleFinderStep + 1} of ${totalSteps}`;
             this.elements.sfProgressTracker.style.display = 'block';
         } else {
            this.elements.sfProgressTracker.style.display = 'none';
        }
        this.elements.sfProgressTracker.textContent = progressText;

        // Loading state
        this.elements.sfStepContent.classList.add('loading');

        // Generate HTML based on step type
        switch (step.type) {
            case 'welcome':
                 html += `<h2>Welcome!</h2><p>Discover or refine your BDSM style!</p><div class="sf-button-container"><button data-action="start" class="save-btn">Start ✨</button></div>`;
                break;
            case 'role':
                html += `<h2>Choose Path</h2><p>Guide/Lead or Support/Follow?</p><div class="sf-button-container"><button data-action="setRole" data-role="dominant" class="save-btn">Leader 👑</button><button data-action="setRole" data-role="submissive" class="save-btn">Supporter 💖</button></div><p class="muted-text"><small>(Explore other path later!)</small></p>`;
                break;
            case 'trait':
                 const traitObj = this.styleFinderTraits.find(t => t.name === step.trait);
                 if (!traitObj) { html = '<p class="error-text">Trait Error.</p>'; break; }
                 const currentValue = this.styleFinderAnswers.traits[traitObj.name] ?? 5;
                 const footnote = this.traitFootnotes[traitObj.name] || "1: Low / 10: High";
                 const descArray = this.sliderDescriptions[traitObj.name] || ["..."];
                 const currentDesc = descArray[currentValue - 1] || "...";
                 html += `
                     <h2>${this.escapeHTML(traitObj.desc)} <button type="button" class="sf-info-icon" data-trait="${this.escapeHTML(traitObj.name)}" aria-label="Info">ℹ️</button></h2>
                     ${this.styleFinderStep === 2 ? '<p>Slide! (1=No, 10=Yes)</p>' : ''}
                     <input type="range" min="1" max="10" value="${currentValue}" class="sf-trait-slider" data-trait="${this.escapeHTML(traitObj.name)}" aria-labelledby="sf-desc-${this.escapeHTML(traitObj.name)}">
                     <div id="sf-desc-${this.escapeHTML(traitObj.name)}" class="sf-slider-description">${this.escapeHTML(currentDesc)}</div>
                     <p class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                     <div class="sf-button-container"> <button type="button" data-action="prev" class="small-btn clear-btn">Back</button> <button type="button" data-action="next" data-currenttrait="${this.escapeHTML(traitObj.name)}" class="save-btn">Next</button> </div>`;
                break;
            case 'roundSummary':
                 const summaryScores = this.sfComputeScores(true);
                 const sortedSummary = Object.entries(summaryScores).sort((a, b) => b[1] - a[1]).slice(0, 5);
                 html += `<h2>Check-In!</h2><p>Top vibes so far:</p><div id="summary-dashboard" class="sf-dashboard">${this.sfGenerateSummaryDashboard(sortedSummary)}</div><p><small>Snapshot only!</small></p><div class="sf-button-container"> <button data-action="prev" class="small-btn clear-btn">Back</button> <button data-action="next" class="save-btn">Results! 🌟</button> </div>`;
                break;
           case 'result':
                 console.log("[SF_RENDER_STEP] Calculating final result..."); this.sfCalculateResult();
                  if (Object.keys(this.styleFinderScores).length === 0) { html = '<p class="error-text">Cannot calculate. Answer questions?</p><div class="sf-button-container"><button data-action="startOver" class="save-btn">Try Again</button></div>'; break; }
                 const sortedScores = Object.entries(this.styleFinderScores).sort((a, b) => b[1] - a[1]);
                 const topStyleData = sortedScores[0]; const topStyleName = topStyleData[0]; const topScore = topStyleData[1];
                 const styleIcon = this.getStyleIcons()[topStyleName] || '🌟';
                 const descData = this.sfTraitData.styleDescriptions[topStyleName];
                 const matchData = this.sfTraitData.dynamicMatches[topStyleName];
                 if (!descData || !matchData) { console.error(`[SF_RENDER_STEP] Missing data for: ${topStyleName}`); html = `<p class="error-text">Error loading details.</p><div class="sf-button-container"><button data-action="startOver" class="save-btn">Try Again</button></div>`; break; }
                 let topStylesText = sortedScores.slice(0, 3).map(([name, score]) => `${this.getStyleIcons()[name] || ''} ${name} (${score.toFixed(1)}%)`).join(', ');
                 html += `<div class="sf-result-section"><h2 class="sf-result-heading">🎉 Top Vibe: ${styleIcon} ${this.escapeHTML(topStyleName)} 🎉</h2><p>(${topScore.toFixed(1)}% Match)</p><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p>${sortedScores.length > 1 ? `<p><small>Other vibes: ${topStylesText}</small></p>` : ''}<h3>Match: ${this.getStyleIcons()[matchData.match] || ''} ${this.escapeHTML(matchData.match)}</h3><p><em>Dynamic: ${this.escapeHTML(matchData.dynamic)}</em></p><p>${this.escapeHTML(matchData.longDesc)}</p><h3>Tips:</h3><ul style="text-align: left; margin: 10px auto; max-width: 90%; list-style: '✧ '; padding-left: 1.5em;">${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}</ul><div class="sf-result-buttons"><button data-action="startOver" class="clear-btn small-btn">Start Over</button><button data-action="showDetails" data-style="${styleIcon} ${this.escapeHTML(topStyleName)}" class="small-btn">More Details</button><button data-action="confirmApply" data-role="${this.escapeHTML(this.styleFinderRole)}" data-style="${styleIcon} ${this.escapeHTML(topStyleName)}" class="save-btn">Apply to Form?</button></div></div>`;
                 if (typeof confetti === 'function') { console.log("[SF_RENDER_STEP] Confetti!"); setTimeout(() => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }), 300); }
                 break;
            default: html = `<p>Unknown step: ${step.type}</p>`;
        }

        this.elements.sfStepContent.innerHTML = html;
        this.elements.sfStepContent.classList.remove('loading');

        const showDashboard = step.type === 'trait' || step.type === 'roundSummary';
        this.sfUpdateDashboard(showDashboard);

        console.log(`[SF_RENDER_STEP] Finished rendering step ${this.styleFinderStep}.`);
    } // End sfRenderStep

    sfSetRole(role) {
        console.log(`[SF_SET_ROLE] Setting role: ${role}`);
        if (role === 'submissive' || role === 'dominant') {
            this.styleFinderRole = role; this.styleFinderAnswers.role = role;
            // Ensure traits are actually loaded from the data structure
             if (!this.sfTraitData.subFinderTraits || !this.sfTraitData.domFinderTraits) {
                 console.error("[SF_SET_ROLE] CRITICAL: sfTraitData traits arrays are missing!");
                 this.sfShowFeedback("Internal error: Trait data missing.", "error");
                 return;
             }
            this.styleFinderTraits = role === 'submissive' ? [...this.sfTraitData.subFinderTraits] : [...this.sfTraitData.domFinderTraits]; // Use spread to ensure copy if needed
            this.traitFootnotes = role === 'submissive' ? this.sfTraitData.subTraitFootnotes : this.sfTraitData.domTraitFootnotes;
            this.sliderDescriptions = this.sfTraitData.sliderDescriptions;
             if (!this.traitFootnotes || !this.sliderDescriptions) {
                  console.error("[SF_SET_ROLE] CRITICAL: sfTraitData footnotes or descriptions are missing!");
             }

            console.log(`[SF_SET_ROLE] Loaded ${this.styleFinderTraits.length} traits for ${role}.`);
            this.sfNextStep();
        } else { console.error(`[SF_SET_ROLE] Invalid role: ${role}`); this.sfShowFeedback("Invalid role.", "error"); }
    } // End sfSetRole

    sfSetTrait(trait, value) {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue)) { this.styleFinderAnswers.traits[trait] = intValue; }
        else { console.warn(`[SF_SET_TRAIT] Invalid value "${value}" for ${trait}.`); }
    } // End sfSetTrait

         sfNextStep(currentTrait = null) {
        console.log(`[SF_NEXT_STEP] From step ${this.styleFinderStep}. Current trait: ${currentTrait}`);

        // *** FIX: Calculate current step data HERE ***
        const steps = this.sfCalculateSteps();
        const currentStepData = steps[this.styleFinderStep]; // Get data for the *current* step we are leaving

        // Validation: Ensure slider has been interacted with if on a trait step
        // Check the *type* of the step we are currently on
        if (currentStepData && currentStepData.type === 'trait' && currentTrait && this.styleFinderAnswers.traits[currentTrait] === undefined) {
            this.sfShowFeedback("Move the slider first!"); console.warn("[SF_NEXT_STEP] Fail: Slider not interacted with for", currentTrait);
            const slider = this.elements.sfStepContent?.querySelector(`input[data-trait="${currentTrait}"]`);
             if(slider) { slider.classList.add('shake-animation'); setTimeout(() => slider.classList.remove('shake-animation'), 500); }
            return;
        }

        const totalSteps = steps.length; // Use the calculated steps length
        if (this.styleFinderStep < totalSteps - 1) {
            this.styleFinderStep++;
            console.log(`[SF_NEXT_STEP] To step ${this.styleFinderStep}`);
            this.sfRenderStep();
        } else {
             console.log("[SF_NEXT_STEP] Last step.");
        }
   }

    sfPrevStep() {
        console.log(`[SF_PREV_STEP] Back from step ${this.styleFinderStep}`);
        if (this.styleFinderStep > 0) {
            this.styleFinderStep--; this.previousScores = null; this.hasRenderedDashboard = false;
            console.log(`[SF_PREV_STEP] To step ${this.styleFinderStep}`); this.sfRenderStep();
        } else { console.log("[SF_PREV_STEP] First step."); }
    } // End sfPrevStep

    sfStartOver() {
        console.log("[SF_START_OVER] Resetting.");
        this.sfStart(); // Re-initialize
        this.sfShowFeedback("Fresh start!");
    } // End sfStartOver

      sfComputeScores(temporary = false) {
        // if(!temporary) console.log("[SF_COMPUTE_SCORES] Calculating final scores."); // Noisy
        let scores = {}; if (!this.styleFinderRole) { console.warn("[SF_COMPUTE_SCORES] Role not set."); return scores;}
        const relevantStyles = this.sfTraitData.styles[this.styleFinderRole]; if (!relevantStyles) { console.error(`[SF_COMPUTE_SCORES] Style list missing for role ${this.styleFinderRole}.`); return scores; }
        relevantStyles.forEach(style => { scores[style] = 0; });

        // !!! CRITICAL: Ensure this object is correctly populated !!!
        const styleKeyTraits = {
            'Submissive': ['obedience', 'submissionDepth', 'vulnerability'], 'Brat': ['rebellion', 'mischief', 'playfulness'], 'Slave': ['service', 'devotion', 'submissionDepth'], 'Switch': ['adaptability', 'exploration', 'playfulness'], 'Pet': ['affection', 'playfulness', 'devotion'], 'Little': ['innocence', 'dependence', 'affection'], 'Puppy': ['playfulness', 'devotion', 'affection'], 'Kitten': ['sensuality', 'mischief', 'affection'], 'Princess': ['sensuality', 'innocence', 'dependence'], 'Rope Bunny': ['sensuality', 'exploration', 'submissionDepth'], 'Masochist': ['painTolerance', 'submissionDepth', 'vulnerability'], 'Prey': ['exploration', 'vulnerability', 'rebellion'], 'Toy': ['submissionDepth', 'adaptability', 'service'], 'Doll': ['vulnerability', 'dependence', 'sensuality'], 'Bunny': ['playfulness', 'innocence', 'affection'], 'Servant': ['service', 'obedience', 'devotion'], 'Playmate': ['playfulness', 'mischief', 'exploration'], 'Babygirl': ['dependence', 'innocence', 'affection'], 'Captive': ['submissionDepth', 'vulnerability', 'exploration'], 'Thrall': ['devotion', 'submissionDepth', 'dependence'], 'Puppet': ['receptiveness', 'adaptability'], 'Maid': ['tidiness', 'politeness'], 'Painslut': ['painTolerance', 'craving'], 'Bottom': ['receptiveness', 'painTolerance'],
            'Dominant': ['authority', 'confidence', 'leadership'], 'Assertive': ['boldness', 'intensity', 'authority'], 'Nurturer': ['care', 'empathy', 'patience'], 'Strict': ['discipline', 'control', 'precision'], 'Master': ['authority', 'possession', 'dominanceDepth'], 'Mistress': ['confidence', 'creativity', 'dominanceDepth'], 'Daddy': ['care', 'possession', 'empathy'], 'Mommy': ['care', 'patience', 'empathy'], 'Owner': ['possession', 'control', 'dominanceDepth'], 'Rigger': ['creativity', 'precision', 'control'], 'Sadist': ['sadism', 'intensity', 'control'], 'Hunter': ['boldness', 'leadership', 'intensity'], 'Trainer': ['patience', 'discipline', 'leadership'], 'Puppeteer': ['control', 'creativity', 'precision'], 'Protector': ['care', 'authority', 'possession'], 'Disciplinarian': ['discipline', 'authority', 'precision'], 'Caretaker': ['care', 'empathy', 'patience'], 'Sir': ['authority', 'confidence', 'leadership'], 'Goddess': ['confidence', 'intensity', 'dominanceDepth'], 'Commander': ['authority', 'intensity', 'dominanceDepth']
        };

        Object.keys(this.styleFinderAnswers.traits).forEach(trait => {
            const rating = this.styleFinderAnswers.traits[trait] || 0;
             relevantStyles.forEach(style => {
                 const keyTraitsForStyle = styleKeyTraits[style] || [];
                 if (!keyTraitsForStyle) console.warn(`[SF_COMPUTE_SCORES] Missing key traits definition for style: ${style}`);
                 if (keyTraitsForStyle.includes(trait)) { scores[style] += rating; if (rating >= 9) scores[style] += 2; else if (rating <= 2) scores[style] -= 1; }
             });
        });

          let highestScore = 0;
          Object.values(scores).forEach(score => {
              if (score > highestScore) highestScore = score;
          });

         if (highestScore > 0 && !temporary) {
             Object.keys(scores).forEach(style => {
                 scores[style] = Math.max(0, (scores[style] / highestScore) * 100);
             });
         }
        return scores;
    } // End sfComputeScores

     sfUpdateDashboard(forceVisible = false) {
        // console.log(`[SF_UPDATE_DASHBOARD] Update. Force: ${forceVisible}`); // Noisy
        const dashboardElement = this.elements.sfDashboard; if (!dashboardElement) return;
        const showDashboard = forceVisible || (this.styleFinderRole && this.styleFinderStep > 1 && this.styleFinderStep < this.sfCalculateSteps().length - 2);
        if (!showDashboard) { dashboardElement.style.display = 'none'; return; }
        dashboardElement.style.display = 'block';
        const currentScoresRaw = this.sfComputeScores(true); const sortedScores = Object.entries(currentScoresRaw).sort((a, b) => b[1] - a[1]);
        if (!this.previousScores) { this.previousScores = { ...currentScoresRaw }; }
        const previousPositions = {}; Object.entries(this.previousScores).sort((a, b) => b[1] - a[1]).forEach(([style], index) => { previousPositions[style] = index; });
        const isFirstRender = !this.hasRenderedDashboard; let dashboardHTML = "<div class='sf-dashboard-header'>✨ Live Vibes! ✨</div>"; const styleIcons = this.getStyleIcons();
        sortedScores.slice(0, 7).forEach(([style, score], index) => {
             const prevPos = previousPositions[style] ?? index; const movement = prevPos - index;
             let moveIndicator = ''; if (!isFirstRender && movement !== 0) { moveIndicator = movement > 0 ? '<span class="sf-move-up" aria-label="Moved up">↑</span>' : '<span class="sf-move-down" aria-label="Moved down">↓</span>'; }
             const prevScore = this.previousScores[style] || 0; const scoreDiff = score - prevScore;
             let deltaSpan = ''; if (!isFirstRender && Math.abs(scoreDiff) > 0.1) { deltaSpan = `<span class="sf-score-delta ${scoreDiff > 0 ? 'positive' : 'negative'}">${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(1)}</span>`; }
             const animationClass = isFirstRender ? 'fade-in' : '';
             dashboardHTML += `<div class="sf-dashboard-item ${animationClass}"><span class="sf-style-name">${styleIcons[style] || '🌀'} ${this.escapeHTML(style)}</span><span class="sf-dashboard-score">${score.toFixed(1)} ${deltaSpan} ${moveIndicator}</span></div>`;
        });
        dashboardElement.innerHTML = dashboardHTML;
        this.previousScores = { ...currentScoresRaw }; this.hasRenderedDashboard = true;
    } // End sfUpdateDashboard

    toggleStyleFinderDashboard() { const d = this.elements.sfDashboard; if (d) { const v = d.style.display !== 'none'; d.style.display = v ? 'none' : 'block'; console.log(`[SF_TOGGLE_DASHBOARD] Display: ${v ? 'none' : 'block'}`); } }

    sfCalculateResult() { console.log("[SF_CALCULATE_RESULT] Final calc."); this.styleFinderScores = this.sfComputeScores(false); grantAchievement({}, 'style_finder_complete'); localStorage.setItem('kinkCompass_style_finder_complete', 'true'); console.log("[SF_CALCULATE_RESULT] Scores:", this.styleFinderScores); }

    sfGenerateSummaryDashboard(sortedSummaryScores) {
        // console.log("[SF_GENERATE_SUMMARY_DASHBOARD] Gen summary HTML."); // Noisy
        let html = ''; if (!sortedSummaryScores || sortedSummaryScores.length === 0) return '<p>No vibes yet.</p>';
        const styleIcons = this.getStyleIcons(); const maxScore = sortedSummaryScores[0][1] || 1;
        sortedSummaryScores.forEach(([style, score]) => { const percentage = Math.max(0,(score / maxScore) * 100); html += `<div class="sf-dashboard-item"><span class="sf-style-name">${styleIcons[style] || '🌀'} ${this.escapeHTML(style)}</span><span class="sf-dashboard-score">${score.toFixed(1)}</span><div style="width:${percentage}%;height:5px;background:var(--accent-color-light);border-radius:3px;margin-left:10px;"></div></div>`; });
        return html;
    } // End sfGenerateSummaryDashboard

    sfShowFeedback(message, type = 'info') {
        // console.log(`[SF_FEEDBACK] Show: "${message}", Type: ${type}`); // Noisy
        const fb = this.elements.sfFeedback; if (!fb) return;
        fb.textContent = message; fb.className = `sf-feedback ${type}`;
        fb.classList.add('feedback-animation'); setTimeout(() => fb.classList.remove('feedback-animation'), 500);
    } // End sfShowFeedback

    sfShowTraitInfo(traitName, triggerElement = null) {
        console.log(`[SF_SHOW_TRAIT_INFO] SF Trait: ${traitName}`);
        const explanation = this.sfTraitData.traitExplanations[traitName] || "No extra details.";
        const existingPopup = document.querySelector('.sf-style-info-popup'); if(existingPopup) existingPopup.remove();
        const popup = document.createElement('div'); popup.className = 'sf-style-info-popup card';
        const title = traitName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        popup.innerHTML = `<button class="sf-close-btn" onclick="this.parentElement.remove()" aria-label="Close">×</button><h3>Trait: ${this.escapeHTML(title)}</h3><p>${this.escapeHTML(explanation)}</p>`;
        document.body.appendChild(popup); popup.querySelector('.sf-close-btn')?.focus();
        if (triggerElement) triggerElement.classList.add('active');
        console.log("[SF_SHOW_TRAIT_INFO] Popup displayed.");
    } // End sfShowTraitInfo

    sfShowFullDetails(styleNameWithEmoji, triggerElement = null) {
     console.log(`[SF_SHOW_FULL_DETAILS] SF Style: ${styleNameWithEmoji}`);

     // --- FIX: More aggressive cleaning ---
     // 1. Remove known emojis (using broad Unicode ranges)
     let styleName = styleNameWithEmoji.replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{E0000}-\u{E007F}]+)/gu, '');
     // 2. Trim whitespace aggressively
     styleName = styleName.trim();
     // 3. Remove potential leading non-letter characters (like ZWJ) - might need adjustment if style names *start* with symbols intentionally
     // styleName = styleName.replace(/^[^a-zA-Z]+/, ''); // This might be too aggressive if names can start with symbols. Let's rely on trim and emoji removal first.

     console.log(`[SF_SHOW_FULL_DETAILS] Cleaned style name for lookup: "${styleName}"`);
     // --- End FIX ---

     const descData = this.sfTraitData.styleDescriptions[styleName];
     const matchData = this.sfTraitData.dynamicMatches[styleName];

     if (!descData || !matchData) {
          console.error(`[SF_SHOW_FULL_DETAILS] Data missing for cleaned style: "${styleName}"`); // Log cleaned name
          this.sfShowFeedback("Error: Could not load style details.", "error");
          return;
     }
     // ... rest of the function remains the same ...
     const existingPopup = document.querySelector('.sf-style-info-popup'); if(existingPopup) existingPopup.remove();
     const popup = document.createElement('div'); popup.className = 'sf-style-info-popup card wide-popup';
     popup.innerHTML = `<button class="sf-close-btn" onclick="this.parentElement.remove()" aria-label="Close">×</button><h3>${styleNameWithEmoji} Details</h3><h4>Summary</h4><p><strong>${this.escapeHTML(descData.short)}</strong></p><p>${this.escapeHTML(descData.long)}</p><h4>Match: ${this.getStyleIcons()[matchData.match] || ''} ${this.escapeHTML(matchData.match)}</h4><p><em>Dynamic: ${this.escapeHTML(matchData.dynamic)}</em></p><p>${this.escapeHTML(matchData.longDesc)}</p><h4>Tips:</h4><ul>${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}</ul>`;
     document.body.appendChild(popup); popup.querySelector('.sf-close-btn')?.focus();
     if (triggerElement) triggerElement.classList.add('active');
     console.log("[SF_SHOW_FULL_DETAILS] Popup displayed.");
 } // End sfShowFullDetails

    getStyleIcons() { return { 'Submissive': '🙇', 'Brat': '😈', 'Slave': '🔗', 'Switch': '🔄', 'Pet': '🐾', 'Little': '🍼', 'Puppy': '🐶', 'Kitten': '🐱', 'Princess': '👑', 'Rope Bunny': '🪢', 'Masochist': '💥', 'Prey': '🏃', 'Toy': '🎲', 'Doll': '🎎', 'Bunny': '🐰', 'Servant': '🧹', 'Playmate': '🎉', 'Babygirl': '🌸', 'Captive': '⛓️', 'Thrall': '🛐', 'Puppet': '🎭', 'Maid': '🧼', 'Painslut': '🔥', 'Bottom': '⬇️', 'Dominant': '👤', 'Assertive': '💪', 'Nurturer': '🤗', 'Strict': '📏', 'Master': '🎓', 'Mistress': '👸', 'Daddy': '👨‍🏫', 'Mommy': '👩‍🏫', 'Owner': '🔑', 'Rigger': '🧵', 'Sadist': '😏', 'Hunter': '🏹', 'Trainer': '🏋️', 'Puppeteer': '🕹️', 'Protector': '🛡️', 'Disciplinarian': '✋', 'Caretaker': '🧡', 'Sir': '🎩', 'Goddess': '🌟', 'Commander': '⚔️' }; }

     confirmApplyStyleFinderResult(role, styleWithEmoji) {
          console.log(`[SF_CONFIRM_APPLY] Confirm apply Role: ${role}, Style: ${styleWithEmoji}`);
          if (confirm(`Apply Role '${role}' and Style '${styleWithEmoji}' to form? Clears current form.`)) {
               console.log("[SF_CONFIRM_APPLY] Confirmed."); this.applyStyleFinderResult(role, styleWithEmoji);
          } else { console.log("[SF_CONFIRM_APPLY] Cancelled."); }
      } // End confirmApplyStyleFinderResult

     applyStyleFinderResult(role, styleWithEmoji) {
          console.log(`[SF_APPLY_RESULT] Applying Role: ${role}, Style: ${styleWithEmoji}`);
           if (!role || !styleWithEmoji || !this.elements.role || !this.elements.style || !this.elements.formSection) { console.error("[SF_APPLY_RESULT] Fail: Missing data or elements."); this.showNotification("Error applying.", "error"); return; }
           this.elements.role.value = role; this.renderStyles(role); this.elements.style.value = styleWithEmoji;
           this.renderTraits(role, styleWithEmoji); this.updateLivePreview(); this.updateStyleExploreLink();
           this.sfClose(); this.showNotification(`Style '${styleWithEmoji}' applied!`, "success");
           console.log("[SF_APPLY_RESULT] Applied & SF closed.");
           this.elements.formSection.scrollIntoView({ behavior: 'smooth' }); this.elements.name.focus();
      } // End applyStyleFinderResult


  // --- Other Helper Functions ---
  getFlairForScore(s) { const score = parseInt(s); if(isNaN(score)) return ''; if(score === 5) return '🌟'; if(score === 4) return '✨'; if(score === 3) return '👍'; if(score === 2) return '🌱'; if(score === 1) return '💧'; return ''; }
  getEmojiForScore(s) { return this.getFlairForScore(s); } // Alias
  escapeHTML(str) { if (typeof str !== 'string') return ''; return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  getIntroForStyle(styleName){ const intro = bdsmData.submissive?.styles?.find(s => s.name === styleName)?.intro || bdsmData.dominant?.styles?.find(s => s.name === styleName)?.intro || bdsmData.switch?.styles?.find(s => s.name === styleName)?.intro || null; /* console.log(`[GET_INTRO] Style: ${styleName}, Intro: ${intro}`); */ return intro; }
  showNotification(message, type = 'info', duration = 4000) {
        const notificationElement = document.getElementById('app-notification') || this.createNotificationElement(); if (!notificationElement) return;
        // console.log(`[NOTIFICATION] Show: "${message}" Type: ${type}`); // Noisy
        notificationElement.className = `notification-${type}`; notificationElement.textContent = message;
        notificationElement.style.opacity = '1'; notificationElement.style.top = '70px';
        notificationElement.setAttribute('aria-hidden', 'false'); notificationElement.setAttribute('role', 'alert');
        if (this.notificationTimer) clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => { notificationElement.style.opacity = '0'; notificationElement.style.top = '20px'; notificationElement.setAttribute('aria-hidden', 'true'); this.notificationTimer = null; }, duration);
   } // End showNotification

   createNotificationElement() {
        console.log("[CREATE_NOTIFICATION_ELEMENT] Creating div.");
        try { const div = document.createElement('div'); div.id = 'app-notification'; div.setAttribute('aria-live', 'assertive'); div.setAttribute('aria-hidden', 'true'); document.body.appendChild(div); return div; }
        catch (error) { console.error("[CREATE_NOTIFICATION_ELEMENT] Failed:", error); return null; }
    } // End createNotificationElement

  // --- Theme Management ---
  applySavedTheme() { console.log("[APPLY_THEME] Apply saved."); const savedTheme = localStorage.getItem('kinkCompassTheme') || 'light'; console.log(`[APPLY_THEME] Saved: ${savedTheme}`); this.setTheme(savedTheme); }
  setTheme(themeName) { console.log(`[SET_THEME] Setting: ${themeName}`); document.documentElement.setAttribute('data-theme', themeName); localStorage.setItem('kinkCompassTheme', themeName); if (this.elements.themeToggle) { this.elements.themeToggle.textContent = themeName === 'light' ? '🌙' : '☀️'; this.elements.themeToggle.setAttribute('aria-label', themeName === 'light' ? 'To Dark' : 'To Light'); } grantAchievement({}, 'theme_changer'); localStorage.setItem('kinkCompass_theme_changer', 'true'); console.log(`[SET_THEME] Applied: ${themeName}`); }
  toggleTheme() { console.log("[TOGGLE_THEME] Toggle."); const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'; const newTheme = currentTheme === 'light' ? 'dark' : 'light'; console.log(`[TOGGLE_THEME] New: ${newTheme}`); this.setTheme(newTheme); }

   // --- Modal Management ---
   openModal(modalElement) {
       if (!modalElement) { console.error("[OPEN_MODAL] Fail: Null element."); return; }
       const modalId = modalElement.id || 'unknown_modal'; console.log(`[OPEN_MODAL] Open: #${modalId}`);
       const currentlyOpen = document.querySelector('.modal[aria-hidden="false"]');
       if (currentlyOpen && currentlyOpen !== modalElement) { console.log(`[OPEN_MODAL] Closing other modal: #${currentlyOpen.id}`); this.closeModal(currentlyOpen); }
       this.elementThatOpenedModal = document.activeElement; console.log(`[OPEN_MODAL] Stored focus return:`, this.elementThatOpenedModal);
       modalElement.setAttribute('aria-hidden', 'false'); modalElement.style.display = 'flex'; console.log(`[OPEN_MODAL] Displayed #${modalId}`);
       requestAnimationFrame(() => {
           let focusTarget = modalElement.querySelector('.modal-close, input:not([type="hidden"]), select, textarea, button, [href]');
           if (!focusTarget) { modalElement.setAttribute('tabindex', '-1'); focusTarget = modalElement; }
           if (focusTarget) { try { focusTarget.focus(); console.log(`[OPEN_MODAL] Focused in #${modalId}:`, focusTarget); } catch (focusError) { console.error(`[OPEN_MODAL] Error focusing in #${modalId}:`, focusError, focusTarget); try { modalElement.setAttribute('tabindex', '-1'); modalElement.focus(); console.log(`[OPEN_MODAL] Fallback focus #${modalId}`); } catch (fallbackError) { console.error(`[OPEN_MODAL] Fallback focus error #${modalId}:`, fallbackError); } } }
           else { console.warn(`[OPEN_MODAL] No focusable element for #${modalId}`); }
       });
   } // End openModal

   closeModal(modalElement) {
       if (!modalElement) { console.error("[CLOSE_MODAL] Fail: Null element."); return; }
       const modalId = modalElement.id || 'unknown_modal'; console.log(`[CLOSE_MODAL] Close: #${modalId}`);
       modalElement.setAttribute('aria-hidden', 'true'); modalElement.style.display = 'none'; console.log(`[CLOSE_MODAL] Hid #${modalId}`); modalElement.removeAttribute('tabindex');
       const elementToFocus = this.elementThatOpenedModal; this.elementThatOpenedModal = null;
       requestAnimationFrame(() => {
            try { if (elementToFocus && typeof elementToFocus.focus === 'function' && document.body.contains(elementToFocus)) { elementToFocus.focus(); console.log("[CLOSE_MODAL] Focus restored:", elementToFocus); } else { console.warn("[CLOSE_MODAL] Focus element lost/invalid. Focus body."); document.body.focus(); } }
            catch (e) { console.error("[CLOSE_MODAL] Focus restore error:", e); try { document.body.focus(); } catch (e2) { console.error("[CLOSE_MODAL] Body focus fallback failed:", e2); } }
       });
       console.log(`[CLOSE_MODAL] Finished closing #${modalId}.`);
   } // End closeModal

   // <<< --- HELPER FUNCTIONS --- >>>
    getSynergyHints(person) {
        // console.log(`[GET_SYNERGY_HINTS] Person ${person?.id}`); // Noisy
        if (!person?.traits || typeof synergyHints !== 'object') return [];
        const hints = []; const traitScores = person.traits;
        const highTraits = Object.entries(traitScores).filter(([, score]) => score >= 4).map(([name]) => name); const lowTraits = Object.entries(traitScores).filter(([, score]) => score <= 2).map(([name]) => name);
        synergyHints.highPositive?.forEach((synergy) => { if (synergy.traits?.every((trait) => highTraits.includes(trait))) { /* console.log(` -> Positive: ${synergy.traits.join('+')}`); */ hints.push({ type: 'positive', text: synergy.hint }); } });
        synergyHints.interestingDynamics?.forEach((dynamic) => { if (dynamic.traits?.high && dynamic.traits?.low && highTraits.includes(dynamic.traits.high) && lowTraits.includes(dynamic.traits.low)) { /* console.log(` -> Dynamic: ${dynamic.traits.high}(H) + ${dynamic.traits.low}(L)`); */ hints.push({ type: 'dynamic', text: dynamic.hint }); } });
        // console.log(`[GET_SYNERGY_HINTS] Found ${hints.length} hints.`); // Noisy
        return hints;
    } // End getSynergyHints

     getGoalAlignmentHints(person) {
        // console.log(`[GET_GOAL_HINTS] Person ${person?.id}`); // Noisy
        const hints = []; if (!person?.goals || !person?.traits || typeof goalKeywords !== 'object') return hints;
        const activeGoals = person.goals.filter(g => !g.done); // console.log(`[GET_GOAL_HINTS] Active goals: ${activeGoals.length}`); // Noisy
        activeGoals.slice(0, 5).forEach(goal => { const goalTextLower = goal.text.toLowerCase(); Object.entries(goalKeywords).forEach(([keyword, data]) => { if (goalTextLower.includes(keyword)) { /* console.log(` -> Goal matches keyword: ${keyword}`); */ data.relevantTraits?.forEach(traitName => { if (person.traits.hasOwnProperty(traitName)) { const score = person.traits[traitName]; const promptTemplate = data.promptTemplates?.[Math.floor(Math.random() * data.promptTemplates.length)]; if(promptTemplate) { const hintText = promptTemplate.replace('{traitName}', traitName); hints.push(`For goal "${goal.text}": ${hintText} (Your ${traitName} score: ${score})`); /* console.log(`    Hint generated.`); */ } } }); } }); });
        const uniqueHints = [...new Set(hints)]; // console.log(`[GET_GOAL_HINTS] Found ${uniqueHints.length} unique hints.`); // Noisy
        return uniqueHints.slice(0, 3);
    } // End getGoalAlignmentHints

    getDailyChallenge(persona = null) {
        // console.log("[GET_DAILY_CHALLENGE] Generating."); // Noisy
        if (typeof challenges !== 'object') { console.error("[GET_DAILY_CHALLENGE] Fail: Data missing."); return null; }
        let possibleCategories = ['communication', 'exploration'];
        if (persona?.role) { const roleKey = persona.role.toLowerCase(); if (challenges[`${roleKey}_challenges`]) { possibleCategories.push(`${roleKey}_challenges`); /* console.log(` -> Added role category: ${roleKey}_challenges`); */ } }
        // console.log(" -> Possible categories:", possibleCategories); // Noisy
        if (possibleCategories.length === 0) { console.warn("[GET_DAILY_CHALLENGE] No categories."); return null; }
        const randomCategoryKey = possibleCategories[Math.floor(Math.random() * possibleCategories.length)]; const categoryChallenges = challenges[randomCategoryKey];
        if (!categoryChallenges?.length) { console.warn(`[GET_DAILY_CHALLENGE] No challenges in: ${randomCategoryKey}`); const generalChallenges = challenges['communication'] || challenges['exploration']; if(generalChallenges?.length) { const fallback = generalChallenges[Math.floor(Math.random() * generalChallenges.length)]; return { ...fallback, category: 'General Fallback' }; } return null; }
        const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];
        // console.log(`[GET_DAILY_CHALLENGE] Selected from ${randomCategoryKey}:`, randomChallenge); // Noisy
        return { ...randomChallenge, category: randomCategoryKey.replace('_challenges', '') };
    } // End getDailyChallenge

    getKinkOracleReading(person) {
        console.log(`[GET_ORACLE_READING] Person ${person?.id}`);
        if (typeof oracleReadings !== 'object' || !oracleReadings.openings || !oracleReadings.focusAreas || !oracleReadings.encouragements || !oracleReadings.closings) { console.error("[GET_ORACLE_READING] Fail: Data missing."); return null; }
        const reading = {};
        try {
             reading.opening = oracleReadings.openings[Math.floor(Math.random() * oracleReadings.openings.length)];
             let focusText = ""; const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => !isNaN(parseInt(score)) && score >= 1 && score <= 5) : [];
             if (traits.length > 0 && Math.random() > 0.3) { traits.sort((a, b) => Math.abs(a[1] - 3) > Math.abs(b[1] - 3) ? -1 : 1); const focusTrait = traits[Math.floor(Math.random() * Math.min(traits.length, 3))]; if (focusTrait) { const traitName = focusTrait[0]; const template = oracleReadings.focusAreas.traitBased[Math.floor(Math.random() * oracleReadings.focusAreas.traitBased.length)]; focusText = template.replace('{traitName}', traitName); console.log(` -> Focus: Trait ${traitName}`); } }
             if (!focusText && person?.style && Math.random() > 0.5) { const template = oracleReadings.focusAreas.styleBased[Math.floor(Math.random() * oracleReadings.focusAreas.styleBased.length)]; focusText = template.replace('{styleName}', person.style); console.log(` -> Focus: Style ${person.style}`); }
             if (!focusText) { focusText = oracleReadings.focusAreas.general[Math.floor(Math.random() * oracleReadings.focusAreas.general.length)]; console.log(` -> Focus: General`); }
             reading.focus = focusText;
             reading.encouragement = oracleReadings.encouragements[Math.floor(Math.random() * oracleReadings.encouragements.length)];
             reading.closing = oracleReadings.closings[Math.floor(Math.random() * oracleReadings.closings.length)];
             console.log("[GET_ORACLE_READING] Success:", reading); return reading;
        } catch (error) { console.error("[GET_ORACLE_READING] Error:", error); return null; }
   } // End getKinkOracleReading

   // --- Achievement Checkers ---
    checkGoalStreak(person) {
         // console.log(`[ACHIEVEMENT_CHECK] Goal streak for ${person?.id}`); // Noisy
         if (!person?.goals) return;
         const completedGoals = person.goals.filter(g => g.done && g.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
         if (completedGoals.length < 3) return;
         const now = new Date(); const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
         const recentCompletions = completedGoals.slice(0, 3).filter(g => new Date(g.completedAt) >= sevenDaysAgo);
         if (recentCompletions.length >= 3) { console.log(` -> Goal streak met!`); if(grantAchievement(person, 'goal_streak_3')) { this.showNotification("Achieved: Goal Streak! 🔥", "achievement"); this.saveToLocalStorage(); } }
         // else { console.log(` -> Goal streak not met (${recentCompletions.length} recent).`); } // Noisy
     } // End checkGoalStreak

     checkTraitTransformation(person, currentSnapshot) {
         // console.log(`[ACHIEVEMENT_CHECK] Trait transform for ${person?.id}`); // Noisy
         if (!person?.history?.length || !currentSnapshot?.traits) { return; }
         const previousSnapshot = person.history[person.history.length - 1]; if (!previousSnapshot?.traits) { return; }
         let transformed = false;
         for (const traitName in currentSnapshot.traits) { if (previousSnapshot.traits.hasOwnProperty(traitName)) { const currentScore = parseInt(currentSnapshot.traits[traitName], 10); const previousScore = parseInt(previousSnapshot.traits[traitName], 10); if (!isNaN(currentScore) && !isNaN(previousScore) && currentScore - previousScore >= 2) { console.log(` -> Trait '${traitName}' transformed!`); transformed = true; break; } } }
         if (transformed) { if(grantAchievement(person, 'trait_transformer')) { this.showNotification("Achieved: Trait Transformer! ✨", "achievement"); } }
         // else { console.log(` -> No trait transform detected.`); } // Noisy
     } // End checkTraitTransformation

    checkConsistentSnapper(person, currentTimestamp) {
         // console.log(`[ACHIEVEMENT_CHECK] Consistent snapper for ${person?.id}`); // Noisy
         if (!person?.history?.length) { return; }
         const previousSnapshot = person.history[person.history.length - 1]; if (!previousSnapshot?.timestamp) { return; }
         const prevTime = new Date(previousSnapshot.timestamp); const currentTime = new Date(currentTimestamp);
         const daysDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60 * 24);
         // console.log(` -> Days since last snap: ${daysDiff.toFixed(2)}`); // Noisy
         if (daysDiff >= 3) { console.log(` -> Consistent snapper met!`); if(grantAchievement(person, 'consistent_snapper')) { this.showNotification("Achieved: Consistent Chronicler! 📅", "achievement"); } }
         // else { console.log(` -> Consistent snapper not met.`); } // Noisy
    } // End checkConsistentSnapper


} // <<< FINAL, CORRECT CLOSING BRACE FOR THE TrackerApp CLASS

// --- Initialization ---
try {
    console.log("[INIT] SCRIPT END: Initializing KinkCompass App...");
    window.kinkCompassApp = new TrackerApp();
    console.log("[INIT] SCRIPT END: KinkCompass App Initialized Successfully on window.kinkCompassApp");
} catch (error) {
    console.error("[INIT] FATAL error during App initialization:", error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: white; padding: 20px; border: 3px solid darkred; margin: 20px auto; background: red; font-family: monospace; white-space: pre-wrap; z-index: 9999; position: fixed; top: 10px; left: 10px; right: 10px; max-width: 80%; max-height: 50vh; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = `<strong>FATAL ERROR: KinkCompass could not start.</strong><br><br>Message: ${error.message}<br><br>Stack Trace:<br>${error.stack || 'Not available'}`;
    document.body.prepend(errorDiv);
}
