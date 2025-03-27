
import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';
import { glossaryTerms } from './glossary.js';
import { getRandomPrompt } from './prompts.js';
import { achievementList, hasAchievement, grantAchievement } from './achievements.js';

// Chart.js and Confetti loaded via CDN

class TrackerApp {
  constructor() {
    console.log("CONSTRUCTOR: Starting KinkCompass App...");
    this.people = [];
    this.previewPerson = null;
    this.currentEditId = null;
    this.chartInstance = null;

    // --- Style Finder State (Initialized for the detailed version) ---
    this.sfActive = false;
    this.sfStep = 0;
    this.sfRole = null;
    this.sfAnswers = { traits: {} };
    this.sfScores = {};
    this.sfPreviousScores = {}; // Renamed from previousScores
    this.sfHasRenderedDashboard = false;
    this.sfTraitSet = []; // Populated dynamically based on role in sfCalculateStyleFinderSteps
    this.sfSteps = []; // Populated dynamically

    // --- Style Finder Data Structures (Restored from scriptbdsmfinder.js) ---
    this.sfStyles = { // Renamed from styles
      submissive: [
        'Submissive', 'Brat', 'Slave', 'Switch', 'Pet', 'Little', 'Puppy', 'Kitten', 'Princess', 'Rope Bunny',
        'Masochist', 'Prey', 'Toy', 'Doll', 'Bunny', 'Servant', 'Playmate', 'Babygirl', 'Captive', 'Thrall',
        'Puppet', 'Maid', 'Painslut', 'Bottom'
      ],
      dominant: [
        'Dominant', 'Assertive', 'Nurturer', 'Strict', 'Master', 'Mistress', 'Daddy', 'Mommy', 'Owner', 'Rigger',
        'Sadist', 'Hunter', 'Trainer', 'Puppeteer', 'Protector', 'Disciplinarian', 'Caretaker', 'Sir', 'Goddess', 'Commander'
      ]
    };
    this.sfSubFinderTraits = [ // Renamed from subFinderTraits
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
    ].sort(() => 0.5 - Math.random());
    this.sfSubTraitFootnotes = { // Renamed from subTraitFootnotes
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
    };
    this.sfDomFinderTraits = [ // Renamed from domFinderTraits
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
    ].sort(() => 0.5 - Math.random());
    this.sfDomTraitFootnotes = { // Renamed from domTraitFootnotes
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
    };
    this.sfSliderDescriptions = { // Renamed from sliderDescriptions
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
      painTolerance: [ "You tire out quick!", "A little push is enough!", "You last if it’s fun!", "You’re steady for a bit!", "Halfway there—nice!", "You keep going strong!", "Endurance is your thing!", "You’re tough and ready!", "You never stop—wow!", "Marathon champ!" ],
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
      control: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Control’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], // Note: 'control' was used for dominant possession, reused description
      creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
      precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
      intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
      sadism: [ "Soft and sweet!", "A tease slips in!", "You push a little!", "Half gentle, half wild!", "You’re testing it!", "Pain’s your play!", "You love the sting!", "Thrill’s your game!", "You’re a spicy star!", "Total edge master!" ],
      leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
      possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
      patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
      dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ]
    };
    this.sfTraitExplanations = { // Renamed from traitExplanations
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
    };
    this.sfStyleDescriptions = { // Renamed from styleDescriptions
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
    };
    this.sfDynamicMatches = { // Renamed from dynamicMatches
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
    };
    this.sfStyleKeyTraits = { // Mapping for scoring
      'Submissive': ['obedience', 'submissionDepth', 'vulnerability'],
      'Brat': ['rebellion', 'mischief', 'playfulness'],
      'Slave': ['service', 'devotion', 'submissionDepth'],
      'Switch': ['adaptability', 'exploration', 'playfulness'],
      'Pet': ['affection', 'playfulness', 'devotion'],
      'Little': ['innocence', 'dependence', 'affection'],
      'Puppy': ['playfulness', 'devotion', 'affection'],
      'Kitten': ['sensuality', 'mischief', 'affection'],
      'Princess': ['sensuality', 'innocence', 'dependence'],
      'Rope Bunny': ['sensuality', 'exploration', 'submissionDepth'],
      'Masochist': ['painTolerance', 'submissionDepth', 'vulnerability'],
      'Prey': ['exploration', 'vulnerability', 'rebellion'],
      'Toy': ['submissionDepth', 'adaptability', 'service'],
      'Doll': ['vulnerability', 'dependence', 'sensuality'],
      'Bunny': ['playfulness', 'innocence', 'affection'],
      'Servant': ['service', 'obedience', 'devotion'],
      'Playmate': ['playfulness', 'mischief', 'exploration'],
      'Babygirl': ['dependence', 'innocence', 'affection'],
      'Captive': ['submissionDepth', 'vulnerability', 'exploration'],
      'Thrall': ['devotion', 'submissionDepth', 'dependence'],
      'Puppet': ['receptiveness', 'adaptability'],
      'Maid': ['tidiness', 'politeness'],
      'Painslut': ['painTolerance', 'craving'],
      'Bottom': ['receptiveness', 'painTolerance'],
      'Dominant': ['authority', 'confidence', 'leadership'],
      'Assertive': ['boldness', 'intensity', 'authority'],
      'Nurturer': ['care', 'empathy', 'patience'],
      'Strict': ['discipline', 'control', 'precision'],
      'Master': ['authority', 'possession', 'dominanceDepth'],
      'Mistress': ['confidence', 'creativity', 'dominanceDepth'],
      'Daddy': ['care', 'possession', 'empathy'],
      'Mommy': ['care', 'patience', 'empathy'],
      'Owner': ['possession', 'control', 'dominanceDepth'],
      'Rigger': ['creativity', 'precision', 'control'],
      'Sadist': ['sadism', 'intensity', 'control'],
      'Hunter': ['boldness', 'leadership', 'intensity'],
      'Trainer': ['patience', 'discipline', 'leadership'],
      'Puppeteer': ['control', 'creativity', 'precision'],
      'Protector': ['care', 'authority', 'possession'],
      'Disciplinarian': ['discipline', 'authority', 'precision'],
      'Caretaker': ['care', 'empathy', 'patience'],
      'Sir': ['authority', 'confidence', 'leadership'],
      'Goddess': ['confidence', 'intensity', 'dominanceDepth'],
      'Commander': ['authority', 'intensity', 'dominanceDepth']
    };

    // --- Element Mapping ---
    // (Rest of constructor continues...)


 // --- START CONTINUATION from showGlossary ---
        related?.length) { h += `<br><span class="related-terms">See also: `; h += d.related.map(rK => `<a href="#gloss-term-${rK}">${glossaryTerms[rK]?.term || rK}</a>`).join(', '); h += `</span>`; } h += `</dd>`; } h += '</dl>'; this.elements.glossaryBody.innerHTML = h; this.openModal(this.elements.glossaryModal); }
  showStyleDiscovery(){grantAchievement({},'style_explorer');this.renderStyleDiscoveryContent();this.openModal(this.elements.styleDiscoveryModal);}
  renderStyleDiscoveryContent(){if(!this.elements.styleDiscoveryBody||!this.elements.styleDiscoveryRoleFilter)return;const sel=this.elements.styleDiscoveryRoleFilter.value;let h='';['submissive','dominant'].forEach(r=>{if(sel==='all'||sel===r){h+=`<h3>${r.charAt(0).toUpperCase()+r.slice(1)} Styles</h3>`;if(bdsmData[r]?.styles){bdsmData[r].styles.forEach(st=>{h+=`<div class="style-discovery-item"><h4>${this.escapeHTML(st.name)}</h4>`; if(st.summary)h+=`<p><em>${this.escapeHTML(st.summary)}</em></p>`; if(st.traits?.length){h+=`<strong>Traits:</strong><ul>`;st.traits.forEach(tr=>{h+=`<li>${this.escapeHTML(tr.name.charAt(0).toUpperCase()+tr.name.slice(1))}</li>`;});h+=`</ul>`;}else{h+=`<p>Uses core traits.</p>`;}h+=`</div>`;});}else{h+=`<p>No styles.</p>`;}}});this.elements.styleDiscoveryBody.innerHTML=h||'<p>No styles.</p>';}
  setTheme(tN){document.body.setAttribute('data-theme',tN);const iD=tN==='dark'||tN==='velvet';if(this.elements.themeToggle){this.elements.themeToggle.textContent=iD?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${iD?'light':'dark'} mode`);}try{localStorage.setItem('kinkCompassTheme',tN);}catch(e){console.warn("Save theme failed:",e);}if(this.chartInstance&&this.currentEditId){const p=this.people.find(p=>p.id===this.currentEditId);if(p)this.renderHistoryChart(p);}}
  applySavedTheme(){let saved='light';try{if(typeof localStorage!=='undefined')saved=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Read theme failed:",e);}this.setTheme(saved);console.log(`Applied theme: ${saved}`);}
  toggleTheme(){const cur=document.body.getAttribute('data-theme')||'light';const isD=cur==='dark'||cur==='velvet';this.setTheme(isD?'light':'dark');}
  exportData(){if(this.people.length===0){alert("No profiles!");return;}try{const dS=JSON.stringify(this.people,null,2);const b=new Blob([dS],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`kinkcompass_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);grantAchievement({},'data_exported');console.log("Exported.");a.remove();}catch(e){console.error("Export failed:",e);alert("Export failed.");}}
  importData(ev){const f=ev.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=(e)=>{try{const imp=JSON.parse(e.target.result);if(!Array.isArray(imp))throw new Error("Not array.");const valid=imp.every(i=>typeof i==='object'&&i!==null&&'id'in i&&'name'in i);if(!valid)throw new Error("Invalid format.");if(confirm(`Import ${imp.length}? OVERWRITES current ${this.people.length}.`)){this.people=imp.map(p=>({...p,goals:p.goals||[],history:p.history||[],avatar:p.avatar||'❓',achievements:p.achievements||[], reflections:p.reflections||{}}));this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`Imported ${this.people.length}.`);}}catch(err){console.error("Import failed:",err);alert(`Import failed: ${err.message}`);}finally{ev.target.value=null;}};r.onerror=()=>{alert("Error reading file.");ev.target.value=null;};r.readAsText(f);}
  showTraitInfo(tN){const r=this.elements.role.value;const sN=this.elements.style.value;const tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN)||bdsmData[r]?.coreTraits?.find(t=>t.name===tN);if(tD&&this.elements.traitInfoPopup&&this.elements.traitInfoTitle&&this.elements.traitInfoBody){const title=tN.charAt(0).toUpperCase()+tN.slice(1);this.elements.traitInfoTitle.textContent=`${this.getEmojiForScore(3)} ${title} Levels`;let bodyHtml='';for(let i=1;i<=5;i++){const s=String(i);const d=tD.desc?.[s]||'N/A';const e=this.getEmojiForScore(s);bodyHtml+=`<p><strong>${e} Lvl ${s}:</strong> ${this.escapeHTML(d)}</p>`;}this.elements.traitInfoBody.innerHTML=bodyHtml;this.elements.traitInfoPopup.style.display='block';this.elements.traitInfoPopup.scrollIntoView({behavior:'smooth',block:'nearest'});}else{console.warn("No trait data/popup:",tN);this.hideTraitInfo();}}
  hideTraitInfo(){if(this.elements.traitInfoPopup)this.elements.traitInfoPopup.style.display='none';}


  // --- Style Finder Methods (Restored & Integrated) ---

  sfStart() { // Renamed from styleFinderBtn click handler
      this.sfActive = true;
      this.sfStep = 0;
      this.sfRole = null;
      this.sfAnswers = { traits: {} };
      this.sfScores = {};
      this.sfHasRenderedDashboard = false;
      this.sfPreviousScores = {}; // Reset previous scores
      this.sfTraitSet = []; // Reset trait set
      this.sfSteps = []; // Reset steps
      if(this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none'; // Hide dashboard initially
      if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = ''; // Clear feedback

      // Ensure modal content area exists
      if (!this.elements.sfStepContent) {
          console.error("Style Finder step content element not found!");
          alert("Error: Cannot start Style Finder.");
          return;
      }

      this.openModal(this.elements.sfModal); // Use generic openModal
      this.sfRenderStep(); // Render the first step
      this.sfShowFeedback("Let’s begin your journey!");
  }

  sfClose() { // Renamed from closeStyleFinder click handler
      this.sfActive = false;
      this.closeModal(this.elements.sfModal); // Use generic closeModal
      console.log("Style Finder closed.");
  }

  sfCalculateSteps() { // Determine the sequence of steps dynamically
      this.sfSteps = [];
      this.sfSteps.push({ type: 'welcome' });
      this.sfSteps.push({ type: 'role' });

      if (this.sfRole) {
          // Get the correct trait list and randomize it
          const baseTraitSet = (this.sfRole === 'dominant' ? this.sfDomFinderTraits : this.sfSubFinderTraits);
          // Make a copy and randomize it for this run
          this.sfTraitSet = [...baseTraitSet].sort(() => 0.5 - Math.random());
          this.sfTraitSet.forEach(trait => this.sfSteps.push({ type: 'trait', trait: trait.name }));
          this.sfSteps.push({ type: 'roundSummary', round: 'Traits' }); // Add summary step
      }

      this.sfSteps.push({ type: 'result' });
      //console.log("Calculated steps:", this.sfSteps);
  }

  sfRenderStep() { // Renamed from renderStyleFinder
      if (!this.sfActive || !this.elements.sfStepContent) return;

      this.sfCalculateSteps(); // Recalculate steps each time to handle role selection

      // Validate step index
      if (this.sfStep < 0 || this.sfStep >= this.sfSteps.length) {
          console.error(`Invalid Style Finder step index: ${this.sfStep}. Resetting.`);
          this.sfStep = 0;
           this.sfCalculateSteps(); // Recalculate
           if(this.sfSteps.length === 0){
              this.elements.sfStepContent.innerHTML = "<p>Error calculating steps.</p>";
              return;
           }
      }

      const step = this.sfSteps[this.sfStep];
      if (!step) {
           console.error(`Could not find step data for index ${this.sfStep}`);
           this.elements.sfStepContent.innerHTML = "<p>Error loading step.</p>";
           return;
      }

      console.log(`Rendering SF Step ${this.sfStep}:`, step);
      let html = "";

      // Progress Tracker Logic
      if (step.type === 'trait' && this.sfRole && this.sfTraitSet.length > 0) {
          const currentTraitIndex = this.sfTraitSet.findIndex(t => t.name === step.trait);
          if (currentTraitIndex !== -1) {
             const questionsLeft = this.sfTraitSet.length - (currentTraitIndex + 1);
             this.elements.sfProgressTracker.style.display = 'block';
             this.elements.sfProgressTracker.textContent = `Trait ${currentTraitIndex + 1} / ${this.sfTraitSet.length} (${questionsLeft} more!)`;
          } else {
             this.elements.sfProgressTracker.style.display = 'none'; // Hide if trait index is weird
          }

      } else {
          this.elements.sfProgressTracker.style.display = 'none';
      }

      // Step Content Generation
      switch (step.type) {
          case 'welcome':
              html = `
                  <h2>Welcome, Brave Explorer!</h2>
                  <p>Dive into a quest to find your BDSM style!</p>
                  <button data-action="next">Start the Journey! ✨</button>
              `;
              break;
          case 'role':
              html = `
                  <h2>Pick Your Path!</h2>
                  <p>Do you feel more drawn to guiding (Dominant) or following (Submissive)?</p>
                  <button data-action="setRole" data-role="dominant">Guiding! (Dominant)</button>
                  <button data-action="setRole" data-role="submissive">Following! (Submissive)</button>
              `;
              break;
          case 'trait':
              // Find the trait object from the *current* randomized set for this run
              const traitObj = this.sfTraitSet.find(t => t.name === step.trait);
               if (!traitObj) {
                    console.error(`Trait object not found for name: ${step.trait}`);
                    html = `<p>Error loading trait: ${step.trait}.</p> <button data-action="prev">Back</button>`;
                    break;
                }

              const currentValue = this.sfAnswers.traits[traitObj.name] !== undefined ? this.sfAnswers.traits[traitObj.name] : 5;
              const footnoteSet = (this.sfRole === 'dominant' ? this.sfDomTraitFootnotes : this.sfSubTraitFootnotes);
              const footnote = footnoteSet[traitObj.name] || "1: Least / 10: Most";
              const isFirstTrait = this.sfSteps.findIndex(s => s.type === 'trait') === this.sfStep; // Check if it's the first trait step

              // Get slider description, ensuring fallback
              const sliderDescArray = this.sfSliderDescriptions[traitObj.name] || ["Not much", "", "", "Getting there", "", "Quite a bit", "", "Strongly!", "", "Totally me!"]; // Default array
              const sliderDescText = sliderDescArray[currentValue - 1] || `Level ${currentValue}`;

              html = `
                  <h2>${this.escapeHTML(traitObj.desc)}<button class="sf-info-icon" data-trait="${traitObj.name}" data-action="showTraitInfo" aria-label="More info about ${traitObj.name}">ℹ️</button></h2>
                  ${isFirstTrait ? '<p>Slide to find your vibe! (1 = Not Me, 10 = Totally Me)</p>' : ''}
                  <input type="range" min="1" max="10" value="${currentValue}" class="sf-trait-slider" data-trait="${traitObj.name}" aria-label="${traitObj.name} rating">
                  <div id="sf-desc-${traitObj.name}" class="sf-slider-description">${this.escapeHTML(sliderDescText)}</div>
                  <p class="sf-slider-footnote">${this.escapeHTML(footnote)}</p>
                  <div style="margin-top: 15px;">
                      <button data-action="next" data-trait="${traitObj.name}">Next Step!</button>
                      ${this.sfStep > 1 ? `<button data-action="prev" style="margin-left: 10px;">Back</button>` : ''}
                  </div>
              `;
              break;

          case 'roundSummary':
               // In the old logic, this re-rendered the dashboard. Let's make it clearer.
               html = `
                   <h2>${step.round} Check-In!</h2>
                   <p>Here’s how your choices are shaping up based on the traits:</p>
                   <div id="sf-summary-dashboard-placeholder">Loading Dashboard...</div>
                   <button data-action="next">See Top Style!</button>
                   <button data-action="prev" style="margin-left: 10px;">Back</button>
               `;
               // Update dashboard after rendering this HTML structure
               requestAnimationFrame(() => this.sfUpdateDashboard(true)); // Force update to show final trait scores
               break;

          case 'result':
              this.sfCalculateResult(); // Calculate final scores
              const sortedScores = Object.entries(this.sfScores).sort((a, b) => b[1] - a[1]);

              if (sortedScores.length === 0 || !sortedScores[0]) {
                 html = `
                     <div class="sf-result-section sf-fade-in">
                         <h2 class="sf-result-heading">Hmm... 🤔</h2>
                         <p>Not enough data to determine a top style yet. Maybe try answering more traits?</p>
                         <div class="sf-result-buttons">
                             <button data-action="startOver">Try Again?</button>
                              <button data-action="close">Close</button>
                         </div>
                     </div>`;
                 break;
              }

              const topStyle = sortedScores[0][0];
              const matchData = this.sfDynamicMatches[topStyle] || { dynamic: "Unique", match: "Explorer", desc: "Find your perfect match!", longDesc: "Explore dynamics that resonate!" };
              const descData = this.sfStyleDescriptions[topStyle] || { short: "A unique blend!", long: "Your combination of traits creates a special style.", tips: ["Keep exploring!", "Communicate your desires."] };

              html = `
                  <div class="sf-result-section sf-fade-in">
                      <h2 class="sf-result-heading">🎉 Your Top BDSM Style: ${this.escapeHTML(topStyle)} 🎉</h2>
                      <p><strong>${this.escapeHTML(descData.short)}</strong></p>
                      <p>${this.escapeHTML(descData.long)}</p>
                      <h3>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h3>
                      <p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.desc)}</p>
                      <p>${this.escapeHTML(matchData.longDesc)}</p>
                      <h3>Tips for You:</h3>
                      <ul style="text-align: left; margin: 10px auto; max-width: 350px; list-style: '✨ '; padding-left: 1.5em;">
                          ${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}
                      </ul>
                      <div class="sf-result-buttons">
                           <button data-action="applyStyle" data-role="${this.sfRole}" data-style="${this.escapeHTML(topStyle)}">📝 Track This Style!</button>
                           <button data-action="startOver">Try Again?</button>
                           <button data-action="showFullDetails" data-style="${this.escapeHTML(topStyle)}">More Details</button>
                          <button data-action="close">Close</button>
                      </div>
                  </div>
              `;
              // Trigger confetti celebration
              if (window.confetti) {
                  setTimeout(() => confetti({
                     particleCount: 150, // More confetti!
                     spread: 80,         // Spread it out
                     origin: { y: 0.6 },
                     colors: ['#ff69b4', '#ff85cb', '#f4d4e4', '#fff', '#a0d8ef', '#dcc1ff'] // Use theme colors
                 }), 300);
              }
              break;
          default:
              html = "<p>Oops! Something went wrong.</p> <button data-action='prev'>Back</button>";
      }

      // Render the HTML and update dashboard if needed
      try {
           this.elements.sfStepContent.innerHTML = html;
           // Update dashboard in trait steps, but not on welcome/role/result
           if (step.type === 'trait') {
               this.sfUpdateDashboard();
           } else if (step.type !== 'roundSummary') { // Dashboard handled separately for summary
               if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
           }
            console.log(`SF Step ${this.sfStep} rendered.`);
       } catch (e) {
           console.error(`Render SF Step ${this.sfStep} Error:`, e);
           this.elements.sfStepContent.innerHTML = `<p>Error rendering step.</p> <button data-action="prev">Back</button>`;
       }
  }

  sfSetRole(role) { // Renamed from setStyleFinderRole
      this.sfRole = role;
      this.sfAnswers.role = role;
      this.sfAnswers.traits = {}; // Reset trait answers when role changes
      this.sfScores = {}; // Reset scores
      this.sfPreviousScores = {}; // Reset previous scores
      this.sfHasRenderedDashboard = false; // Reset dashboard flag
      this.sfNextStep(); // Move to the first trait question
  }

  sfSetTrait(trait, value) { // Renamed from setStyleFinderTrait
      this.sfAnswers.traits[trait] = parseInt(value, 10);
      this.sfShowFeedback(`You vibe with ${trait} at ${value}!`);
      // Dashboard updated via slider input handler
  }

  sfNextStep(currentTrait = null) { // Renamed from nextStyleFinderStep
      // Validation moved to handleStyleFinderAction
      this.sfStep++;
      this.sfRenderStep();
  }

  sfPrevStep() { // Renamed from prevStyleFinderStep
      if (this.sfStep > 0) {
          this.sfStep--;
           // If moving back from results/summary, reset scores to allow recalculation
           const steps = this.sfSteps; // Use calculated steps
            if(steps[this.sfStep + 1]?.type === 'result' || steps[this.sfStep + 1]?.type === 'roundSummary'){
                console.log("Moving back from result/summary, resetting scores.")
                this.sfScores = {};
                this.sfPreviousScores = {};
                this.sfHasRenderedDashboard = false;
            }
          this.sfRenderStep();
      }
  }

  sfStartOver() { // Renamed from startOver
      // Reset state and go back to the first step (welcome)
      this.sfStep = 0;
      this.sfRole = null;
      this.sfAnswers = { traits: {} };
      this.sfScores = {};
      this.sfPreviousScores = {};
      this.sfHasRenderedDashboard = false;
      this.sfTraitSet = [];
      this.sfSteps = [];
      if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
      this.sfRenderStep();
      this.sfShowFeedback("Fresh start—here we go!");
  }

  sfComputeScores() { // Renamed from computeCurrentScores, uses scoring map
      let scores = {};
      if (!this.sfRole) return scores;
      const roleStyles = this.sfStyles[this.sfRole];
      roleStyles.forEach(style => { scores[style] = 0; });

      Object.keys(this.sfAnswers.traits).forEach(trait => {
          const rating = this.sfAnswers.traits[trait] || 0; // Default to 0 if undefined
          // Iterate through all styles for the current role
          roleStyles.forEach(style => {
              const keyTraits = this.sfStyleKeyTraits[style] || [];
              // If the current trait is a key trait for this style, add score
              if (keyTraits.includes(trait)) {
                  // Weighting can be adjusted here if desired
                  scores[style] += rating * 1.5; // Simple weighting from old script
              }
          });
      });
      console.log("Computed Scores:", scores);
      return scores;
  }

   sfUpdateDashboard(forceVisible = false) { // Renamed from updateDashboard
        // Determine if dashboard should be shown
       const shouldShowDashboard = forceVisible || (this.sfRole && this.sfStep > 1 && this.sfSteps[this.sfStep]?.type === 'trait');

       if (!shouldShowDashboard) {
           if (this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
           return;
       }

       if (!this.elements.sfDashboard) {
           console.error("Dashboard element not found!");
           return;
       }
       this.elements.sfDashboard.style.display = 'block'; // Ensure visible

       const scores = this.sfComputeScores();
       const sortedScores = Object.entries(scores)
           .filter(([style, score]) => score > 0) // Only show styles with score > 0
           .sort((a, b) => b[1] - a[1])
           .slice(0, 7); // Show top 7

       if (sortedScores.length === 0) {
            this.elements.sfDashboard.innerHTML = "<div class='sf-dashboard-header'>✨ Your Live Vibes! ✨</div><p class='muted-text'>Keep rating traits!</p>";
            return; // Don't proceed if no scores > 0
       }

       // Prepare previous positions for move indicators
       const previousPositions = {};
       if (this.sfPreviousScores) {
            Object.entries(this.sfPreviousScores)
               .sort((a, b) => b[1] - a[1])
               .forEach(([style, score], index) => {
                   previousPositions[style] = index;
               });
       }

       const isFirstRender = !this.sfHasRenderedDashboard;
       let dashboardHTML = "<div class='sf-dashboard-header'>✨ Your Live Vibes! ✨</div>";
       const styleIcons = this.getStyleIcons(); // Use helper method

       sortedScores.forEach(([style, score], index) => {
           const prevPos = previousPositions[style] !== undefined ? previousPositions[style] : index;
           const movement = prevPos - index;
           let moveIndicator = '';
           // Add move indicator only if not the first render and there was movement
           if (!isFirstRender && movement > 0) moveIndicator = '<span class="sf-move-up">↑</span>';
           else if (!isFirstRender && movement < 0) moveIndicator = '<span class="sf-move-down">↓</span>';

           const prevScore = this.sfPreviousScores ? (this.sfPreviousScores[style] || 0) : 0;
           const delta = score - prevScore;
           let deltaDisplay = '';
           // Add delta display only if not the first render and delta is significant
           if (!isFirstRender && Math.abs(delta) > 0.1) {
               deltaDisplay = `<span class="sf-score-delta ${delta > 0 ? 'positive' : 'negative'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>`;
           }

           const animationClass = isFirstRender ? 'sf-fade-in' : ''; // Use class for animation
           dashboardHTML += `
               <div class="sf-dashboard-item ${animationClass}">
                   <span class="sf-style-name">${styleIcons[style] || '🌟'} ${this.escapeHTML(style)}</span>
                   <span class="sf-dashboard-score">${score.toFixed(1)} ${deltaDisplay} ${moveIndicator}</span>
               </div>
           `;
       });

       this.elements.sfDashboard.innerHTML = dashboardHTML;
       this.sfPreviousScores = { ...scores }; // Store current scores for next update
       this.sfHasRenderedDashboard = true;
   }


  sfCalculateResult() { // Renamed from calculateStyleFinderResult
      this.sfScores = this.sfComputeScores(); // Use the consistent scoring method
      const totalAnswers = Object.keys(this.sfAnswers.traits).length;
      if (totalAnswers === 0) return; // Avoid division by zero

      // Optional: Normalize scores to a percentage or other scale if desired
      // Example normalization (0-100):
      // Find max possible score for normalization (e.g., total traits * max rating * weight)
      // const maxPossibleScore = totalAnswers * 10 * 1.5;
      // if (maxPossibleScore > 0) {
      //     Object.keys(this.sfScores).forEach(style => {
      //         this.sfScores[style] = (this.sfScores[style] / maxPossibleScore) * 100;
      //     });
      // }
       console.log("Final Scores Calculated:", this.sfScores);
  }

   // Note: sfGenerateSummaryDashboard removed as sfUpdateDashboard now handles the display logic during steps.

  sfShowFeedback(message) { // Renamed from showFeedback
      if (!this.elements.sfFeedback) return;
      this.elements.sfFeedback.textContent = this.escapeHTML(message); // Use textContent and escape
      this.elements.sfFeedback.classList.remove('sf-feedback-animation');
      void this.elements.sfFeedback.offsetWidth; // Trigger reflow for animation restart
      this.elements.sfFeedback.classList.add('sf-feedback-animation');
  }

  sfShowTraitInfo(traitName) { // Renamed from showTraitInfo
      const explanation = this.sfTraitExplanations[traitName] || "No extra info available for this trait!";
      // Create a popup dynamically
      const popup = document.createElement('div');
      popup.className = 'sf-style-info-popup'; // Use the dedicated class
      popup.innerHTML = `
          <h3>${this.escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))}</h3>
          <p>${this.escapeHTML(explanation)}</p>
          <button class="sf-close-btn" aria-label="Close trait info">×</button>
      `;
      // Append to body to ensure it's on top
      document.body.appendChild(popup);
      // Focus the close button for accessibility
      popup.querySelector('.sf-close-btn')?.focus();
  }

  sfShowFullDetails(styleName) { // Renamed from showFullDetails
      const descData = this.sfStyleDescriptions[styleName];
      const matchData = this.sfDynamicMatches[styleName];

      if (!descData || !matchData) {
          alert(`Details for style "${styleName}" not found.`);
          return;
      }

      const popup = document.createElement('div');
      popup.className = 'sf-style-info-popup wide-popup'; // wide-popup might be needed
      popup.innerHTML = `
          <h3>${this.escapeHTML(styleName)}</h3>
          <p><strong>${this.escapeHTML(descData.short)}</strong></p>
          <p>${this.escapeHTML(descData.long)}</p>
          <h4>Potential Dynamic Match: ${this.escapeHTML(matchData.match)}</h4>
          <p><em>${this.escapeHTML(matchData.dynamic)}</em> - ${this.escapeHTML(matchData.longDesc)}</p>
          <h4>Tips for You:</h4>
          <ul style="list-style: '✨ '; padding-left: 1.5em;">
             ${descData.tips.map(tip => `<li>${this.escapeHTML(tip)}</li>`).join('')}
          </ul>
          <button class="sf-close-btn" aria-label="Close style details">×</button>
      `;
      document.body.appendChild(popup);
      popup.querySelector('.sf-close-btn')?.focus();
  }

   // Method used by SF Dashboard and Results
    getStyleIcons() {
        // Consistent icon mapping
        return {
            'Submissive': '🙇', 'Brat': '😈', 'Slave': '🔗', 'Switch': '🔄', 'Pet': '🐾',
            'Little': '🍼', 'Puppy': '🐶', 'Kitten': '🐱', 'Princess': '👑', 'Rope Bunny': '🪢',
            'Masochist': '💥', 'Prey': '🏃', 'Toy': '🎲', 'Doll': '🎎', 'Bunny': '🐰',
            'Servant': '🧹', 'Playmate': '🎉', 'Babygirl': '🌸', 'Captive': '⛓️', 'Thrall': '🛐',
            'Puppet': '🎭', 'Maid': '🧼', 'Painslut': '🔥', 'Bottom': '⬇️',
            'Dominant': '👤', 'Assertive': '💪', 'Nurturer': '🤗', 'Strict': '📏', 'Master': '🎓',
            'Mistress': '👸', 'Daddy': '👨‍🏫', 'Mommy': '👩‍🏫', 'Owner': '🔑', 'Rigger': '🪢',
            'Sadist': '😏', 'Hunter': '🏹', 'Trainer': '🏋️', 'Puppeteer': '🎭', 'Protector': '🛡️',
            'Disciplinarian': '✋', 'Caretaker': '🧡', 'Sir': '🎩', 'Goddess': '🌟', 'Commander': '⚔️'
        };
    }

   applyStyleFinderResult(r, s) { // Kept from newer code, adjusted slightly
        console.log(`Applying SF Result: Role=${r}, Style=${s}`);
        if (!r || !s || !this.elements.role || !this.elements.style) {
             console.error("Cannot apply style - role/style element missing or invalid arguments.");
             alert("Error applying style.");
             return;
        }
        this.elements.role.value = r;
        this.renderStyles(r); // Re-render styles for the selected role

        // Use requestAnimationFrame to ensure dropdown is populated before setting value
        requestAnimationFrame(() => {
            // Check if the style exists in the dropdown options
            const styleExists = Array.from(this.elements.style.options).some(option => option.value === s);

            if (styleExists) {
                this.elements.style.value = s;
                console.log(`Style dropdown set to: ${this.elements.style.value}`);
            } else {
                console.warn(`Style "${s}" not found in dropdown for role "${r}". Style not set automatically.`);
                // Optionally clear the style dropdown or leave it as is
                 this.elements.style.value = ''; // Clear style if not found
            }

            this.renderTraits(r, this.elements.style.value); // Render traits based on potentially cleared style
            this.updateLivePreview();
            this.sfClose(); // Close the finder modal
            this.elements.formSection?.scrollIntoView({ behavior: 'smooth' });
            this.elements.name?.focus();
            alert(`Style "${s}" selected in form! Review and save your profile. ✨`);
        });
    }


  // --- Other Helper Functions (Keep existing methods) ---
  getFlairForScore(s){return parseInt(s)<=2?"🌱 Nurturing!":parseInt(s)===3?"⚖️ Balanced!":"🌟 Shining!";}
  getEmojiForScore(s){return parseInt(s)<=2?"💧":parseInt(s)===3?"🌱":parseInt(s)===4?"✨":"🌟";}
  escapeHTML(s){s=String(s??'');const e=document.createElement('div');e.textContent=s;return e.innerHTML;}
  openModal(mE){if(!mE)return;mE.style.display='flex';const f=mE.querySelector('button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])');if(f)requestAnimationFrame(()=>f.focus());}
  closeModal(mE){if(!mE)return;mE.style.display='none';}
  getIntroForStyle(sN){const k=sN?.toLowerCase().replace(/\(.*?\)/g,'').replace(/ \/ /g,'/').trim()||'';const i={"submissive":"Welcome! ✨","brat":"Hehe! 😉","slave":"Devotion awaits. 🙏","switch":"Dance between! ↔️","pet":"Head pats! 💖","little":"Playtime! 🧸","puppy":"Woof! 🦴","kitten":"Meow? 🧶","princess":"Adore me! 👑","rope bunny":"Tangled fun! 🎀","masochist":"Sensation seeker! 🔥","prey":"Chase me! 🦊","toy":"Play time! 🎁","doll":"Strike a pose! 💖","bunny":"Gentle heart! 🐇","servant":"At your service! 🧹","playmate":"Adventure time! 🎉","babygirl":"Cherish me! 😉","captive":"Caught again? ⛓️","thrall":"Connect deeply. 🌀","puppet":"Dance! 🎭","maid":"Sparkle & shine! ✨","painslut":"Revel in intensity! 🔥","bottom":"Receive & connect. 💖","dominant":"Lead & inspire! 🔥","assertive":"Speak truth! 💪","nurturer":"Support & uplift! 🌸","strict":"Order & structure! ⚖️","master":"Shape your domain! 🏰","mistress":"Rule with grace! 👑","daddy":"Protect & guide! 🧸","mommy":"Nurture & love! 💖","owner":"Claim & cherish! 🐾","rigger":"Bind beauty! 🎨","sadist":"Explore sensation! 🔥","hunter":"Thrill of pursuit! 🐺","trainer":"Cultivate potential! 🏆","puppeteer":"Direct performance! 🎭","protector":"Defend & ensure safety! 🛡️","disciplinarian":"Maintain order! 👨‍⚖️","caretaker":"Ensure well-being! ❤️‍🩹","sir":"Lead with honor! 🎩","goddess":"Inspire worship! ✨","commander":"Lead the charge! 🎖️"};return i[k]||"Explore expression!";}
   // showTraitInfo already exists for the main form, sfShowTraitInfo is used for style finder

} // --- END OF TrackerApp CLASS ---

// --- Initialization ---
try {
    console.log("SCRIPT END: Initializing KinkCompass App...");
    // Ensure the class is available globally for inline event handlers if needed,
    // though delegated listeners are preferred.
    window.kinkCompassApp = new TrackerApp();
    console.log("SCRIPT END: KinkCompass App Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during App initialization:", error);
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;"> <h1 style="color: red;">Oops! Failed to Start</h1> <p>Error: ${error.message}. Check console (F12).</p> </div>`;
}
