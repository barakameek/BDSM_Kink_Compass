
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
    this.elements = {
      formSection: document.getElementById('form-section'),
      name: document.getElementById('name'),
      avatarDisplay: document.getElementById('avatar-display'),
      avatarInput: document.getElementById('avatar-input'),
      avatarPicker: document.querySelector('.avatar-picker'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      traitsContainer: document.getElementById('traits-container'),
      traitInfoPopup: document.getElementById('trait-info-popup'),
      traitInfoClose: document.getElementById('trait-info-close'),
      traitInfoTitle: document.getElementById('trait-info-title'),
      traitInfoBody: document.getElementById('trait-info-body'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),
      peopleList: document.getElementById('people-list'),
      livePreview: document.getElementById('live-preview'),
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close'),
      resourcesBtn: document.getElementById('resources-btn'),
      resourcesModal: document.getElementById('resources-modal'),
      resourcesClose: document.getElementById('resources-close'),
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
      exportBtn: document.getElementById('export-btn'),
      importBtn: document.getElementById('import-btn'),
      importFileInput: document.getElementById('import-file-input'),
      themeToggle: document.getElementById('theme-toggle'),
      // Style Finder elements
      styleFinderTriggerBtn: document.getElementById('style-finder-trigger-btn'),
      sfModal: document.getElementById('style-finder-modal'),
      sfCloseBtn: document.getElementById('sf-close-style-finder'), // Corrected ID
      sfProgressTracker: document.getElementById('sf-progress-tracker'),
      sfStepContent: document.getElementById('sf-step-content'),
      sfFeedback: document.getElementById('sf-feedback'),
      sfDashboard: document.getElementById('sf-dashboard')
    }; // <-- Correct closing brace for elements object

    // Critical element check
    const criticalElements = ['name', 'role', 'style', 'save', 'peopleList', 'modal', 'sfModal', 'sfStepContent', 'styleFinderTriggerBtn'];
    let missingElement = false;
    for (const key of criticalElements) { if (!this.elements[key]) { console.error(`Missing critical element: ID '${key}'`); missingElement = true; } }
    if (missingElement) { throw new Error("Missing critical HTML elements needed for KinkCompass or Style Finder."); }

    console.log("CONSTRUCTOR: Elements found.");
    this.addEventListeners();
    console.log("CONSTRUCTOR: Listeners added.");
    this.loadFromLocalStorage();
    this.applySavedTheme();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
    console.log("CONSTRUCTOR: Initial render complete.");
  } // --- End of constructor ---

  // --- Local Storage ---
  loadFromLocalStorage(){try{const d=localStorage.getItem('kinkProfiles');const p=d?JSON.parse(d):[];this.people=p.map(p=>({...p,goals:Array.isArray(p.goals)?p.goals:[],history:Array.isArray(p.history)?p.history:[],avatar:p.avatar||'❓',achievements:Array.isArray(p.achievements)?p.achievements:[],reflections:typeof p.reflections==='object'?p.reflections:{}}));console.log(`Loaded ${this.people.length}`);}catch(e){console.error("Load Error:",e);this.people=[];}}
  saveToLocalStorage(){try{localStorage.setItem('kinkProfiles',JSON.stringify(this.people));console.log(`Saved ${this.people.length}`);}catch(e){console.error("Save Error:",e);alert("Save failed.");}}

  // --- Event Listeners Setup (Corrected) ---
  addEventListeners() {
    console.log("Attaching event listeners...");
    // KinkCompass Core Listeners
    this.elements.role?.addEventListener('change',() => { const r=this.elements.role.value;this.renderStyles(r);this.elements.style.value='';this.renderTraits(r,'');this.updateLivePreview(); });
    this.elements.style?.addEventListener('change',() => { this.renderTraits(this.elements.role.value,this.elements.style.value);this.updateLivePreview(); });
    this.elements.name?.addEventListener('input',() => this.updateLivePreview());
    this.elements.avatarPicker?.addEventListener('click',(e) => { if(e.target.classList.contains('avatar-btn')){const em=e.target.dataset.emoji;if(em){this.elements.avatarInput.value=em;this.elements.avatarDisplay.textContent=em;this.elements.avatarPicker.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b===e.target));this.updateLivePreview();}} });
    this.elements.save?.addEventListener('click',() => this.savePerson());
    this.elements.clearForm?.addEventListener('click',() => this.resetForm(true));
    this.elements.themeToggle?.addEventListener('click',() => this.toggleTheme());
    this.elements.exportBtn?.addEventListener('click',() => this.exportData());
    this.elements.importBtn?.addEventListener('click',() => this.elements.importFileInput?.click());
    this.elements.importFileInput?.addEventListener('change',(e) => this.importData(e));
    this.elements.peopleList?.addEventListener('click',(e) => this.handleListClick(e));
    this.elements.peopleList?.addEventListener('keydown',(e) => this.handleListKeydown(e));
    this.elements.modalClose?.addEventListener('click',() => this.closeModal(this.elements.modal));
    this.elements.resourcesBtn?.addEventListener('click',() => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose?.addEventListener('click',() => this.closeModal(this.elements.resourcesModal));
    this.elements.glossaryBtn?.addEventListener('click',() => this.showGlossary());
    this.elements.glossaryClose?.addEventListener('click',() => this.closeModal(this.elements.glossaryModal));
    this.elements.styleDiscoveryBtn?.addEventListener('click',() => this.showStyleDiscovery());
    this.elements.styleDiscoveryClose?.addEventListener('click',() => this.closeModal(this.elements.styleDiscoveryModal));
    this.elements.styleDiscoveryRoleFilter?.addEventListener('change',() => this.renderStyleDiscoveryContent());
    this.elements.themesBtn?.addEventListener('click',() => this.openModal(this.elements.themesModal));
    this.elements.themesClose?.addEventListener('click',() => this.closeModal(this.elements.themesModal));
    this.elements.themesBody?.addEventListener('click',(e) => this.handleThemeSelection(e));
    this.elements.traitsContainer?.addEventListener('input',(e) => this.handleTraitSliderInput(e));
    this.elements.traitsContainer?.addEventListener('click',(e) => this.handleTraitInfoClick(e));
    this.elements.traitInfoClose?.addEventListener('click',() => this.hideTraitInfo());
    this.elements.modalBody?.addEventListener('click',(e) => this.handleModalBodyClick(e));

    // --- Style Finder Event Listeners (Integrated) ---
    this.elements.styleFinderTriggerBtn?.addEventListener('click', () => this.sfStart());
    this.elements.sfCloseBtn?.addEventListener('click', () => this.sfClose());

    // Delegated listener for actions within the SF modal content area
    this.elements.sfStepContent?.addEventListener('click', (e) => {
        // Prioritize buttons with data-action
        const button = e.target.closest('button[data-action]');
        if (button) {
            this.handleStyleFinderAction(button.dataset.action, button.dataset);
            return; // Action handled
        }

        // Check for info icon clicks (which might be buttons or spans)
        const icon = e.target.closest('.sf-info-icon[data-trait]');
        if (icon) {
             // Use 'showTraitInfo' as the action identifier
            this.handleStyleFinderAction('showTraitInfo', icon.dataset);
            return; // Action handled
        }
    }); // End sfStepContent click listener

    // Delegated listener for slider input
    this.elements.sfStepContent?.addEventListener('input', (e) => {
        if (e.target.classList.contains('sf-trait-slider') && e.target.dataset.trait) {
            this.handleStyleFinderSliderInput(e.target);
        }
    }); // End sfStepContent input listener

    // Listener for closing dynamically created popups (SF specific popups)
    document.body.addEventListener('click', (e) => {
      // Close SF popups specifically, avoid interfering with other potential popups
      if (e.target.classList.contains('sf-close-btn')) {
          const popup = e.target.closest('.sf-style-info-popup');
          if (popup) {
              popup.remove();
          }
      }
    });

    // General Window Listeners
    window.addEventListener('click',(e) => this.handleWindowClick(e));
    window.addEventListener('keydown',(e) => this.handleWindowKeydown(e));

    console.log("Event listeners setup complete.");
  } // --- End addEventListeners ---


  // --- Event Handlers (Keep existing handlers, add/modify SF handlers) ---
  handleListClick(e){const li=e.target.closest('.person');if(!li)return;const id=parseInt(li.dataset.id);if(isNaN(id))return;console.log("List Click on ID:",id,"Target:",e.target);const actionTarget = e.target.closest('button'); const action = actionTarget ? actionTarget.dataset.action : null; if(action === 'edit') this.editPerson(id); else if(action === 'delete') this.deletePerson(id); else this.showPersonDetails(id);} // Added data-action check
  handleListKeydown(e){const li=e.target.closest('.person');if(!li)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=parseInt(li.dataset.id);if(!isNaN(id))this.showPersonDetails(id);}}
  handleWindowClick(e){if(e.target===this.elements.modal)this.closeModal(this.elements.modal);if(e.target===this.elements.sfModal)this.sfClose(); // Use sfClose
      if(e.target===this.elements.resourcesModal)this.closeModal(this.elements.resourcesModal);if(e.target===this.elements.glossaryModal)this.closeModal(this.elements.glossaryModal);if(e.target===this.elements.styleDiscoveryModal)this.closeModal(this.elements.styleDiscoveryModal);if(e.target===this.elements.themesModal)this.closeModal(this.elements.themesModal);}
  handleWindowKeydown(e){if(e.key==='Escape'){if(this.elements.modal?.style.display==='flex')this.closeModal(this.elements.modal);if(this.elements.sfModal?.style.display==='flex')this.sfClose(); // Use sfClose
      if(this.elements.resourcesModal?.style.display==='flex')this.closeModal(this.elements.resourcesModal);if(this.elements.glossaryModal?.style.display==='flex')this.closeModal(this.elements.glossaryModal);if(this.elements.styleDiscoveryModal?.style.display==='flex')this.closeModal(this.elements.styleDiscoveryModal);if(this.elements.themesModal?.style.display==='flex')this.closeModal(this.elements.themesModal);}}
  handleTraitSliderInput(e){if(e.target.classList.contains('trait-slider')){this.updateTraitDescription(e.target);this.updateLivePreview();const v=e.target.value;const p=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;if(p){if(v==='5')grantAchievement(p,'max_trait');if(v==='1')grantAchievement(p,'min_trait');}}}
  handleTraitInfoClick(e){if(e.target.classList.contains('trait-info-btn')){const tN=e.target.dataset.trait;if(tN)this.showTraitInfo(tN);}}
  handleModalBodyClick(e){console.log("Modal Click:",e.target);const btn=e.target.closest('button');const tgt=e.target;const check=btn||tgt;if(!check||(check.tagName!=='BUTTON'&&!check.classList.contains('snapshot-info-btn'))){return;}const id=check.id;const cl=check.classList;const pId=parseInt(check.dataset.personId);const gId=parseInt(check.dataset.goalId);console.log("Check Elm:",check,"ID:",id,"Class:",cl);if(id==='save-reflections-btn'&&!isNaN(pId))this.saveReflections(pId);else if(id==='prompt-btn')this.showJournalPrompt();else if(id==='snapshot-btn'&&!isNaN(pId))this.addSnapshotToHistory(pId);else if(cl.contains('snapshot-info-btn'))this.toggleSnapshotInfo(check);else if(id==='reading-btn'&&!isNaN(pId))this.showKinkReading(pId);else if(cl.contains('add-goal-btn')&&!isNaN(pId))this.addGoal(pId);else if(cl.contains('toggle-goal-btn')&&!isNaN(pId)&&!isNaN(gId))this.toggleGoalStatus(pId,gId);else if(cl.contains('delete-goal-btn')&&!isNaN(pId)&&!isNaN(gId))this.deleteGoal(pId,gId);else console.log("No matching modal action.");}
  handleThemeSelection(e){if(e.target.classList.contains('theme-option-btn')){const tN=e.target.dataset.theme;if(tN){this.setTheme(tN);grantAchievement({},'theme_changer');}}}

  // --- Style Finder Action Handler (Corrected & Integrated) ---
  handleStyleFinderAction(action, dataset = {}) {
      console.log("SF Action:", action, dataset);
      switch (action) {
          case 'next':
              const currentTrait = dataset.trait;
              // Check if trait answer exists *before* proceeding (only for trait steps)
              const currentStepType = this.sfSteps[this.sfStep]?.type;
              if (currentStepType === 'trait' && currentTrait && this.sfAnswers.traits[currentTrait] === undefined) {
                   this.sfShowFeedback("Please slide to pick a vibe first!");
                   return;
              }
              this.sfNextStep(); // No need to pass trait here
              break;
          case 'prev':
              this.sfPrevStep();
              break;
          case 'setRole':
              if (dataset.role) {
                  this.sfSetRole(dataset.role);
              } else {
                 console.error("Set role action triggered without role data.");
              }
              break;
          case 'startOver':
              this.sfStartOver();
              break;
          case 'close': // Added for consistency if needed, though close button has direct listener
              this.sfClose();
              break;
           case 'applyStyle':
                const r= dataset.role;
                const s= dataset.style;
                if(r && s){
                    this.applyStyleFinderResult(r, s);
                } else {
                    alert("Error applying style. Role or Style missing.");
                     console.error("Apply Style Error: Missing role or style in dataset", dataset);
                }
                break;
           case 'showFullDetails': // From old finder
               if (dataset.style) {
                   this.sfShowFullDetails(dataset.style);
               } else {
                  console.error("Show Full Details action triggered without style data.");
               }
               break;
          case 'showTraitInfo': // From old finder & merged logic
              if (dataset.trait) {
                   this.sfShowTraitInfo(dataset.trait);
              } else {
                   console.error("Show Trait Info action triggered without trait data.");
              }
              break;
          default:
              console.warn("Unknown Style Finder action:", action);
      }
  }

  // --- Style Finder Slider Input Handler (Corrected) ---
  handleStyleFinderSliderInput(sliderElement) {
      const traitName = sliderElement.dataset.trait;
      const value = parseInt(sliderElement.value, 10);
      if (traitName) {
          this.sfSetTrait(traitName, value); // Use sfSetTrait
          // Update the description dynamically
          const descElement = this.elements.sfStepContent?.querySelector(`#sf-desc-${traitName}`); // Use optional chaining
          // Ensure sfSliderDescriptions and the specific trait array exist
          const descriptions = this.sfSliderDescriptions?.[traitName] ?? [];
          if (descElement) { // Check if element exists
              const safeValue = Number(value); // Ensure value is a number for comparison
              if (descriptions.length > 0 && safeValue >= 1 && safeValue <= descriptions.length) {
                   descElement.textContent = this.escapeHTML(descriptions[safeValue - 1]);
              } else {
                   // Fallback if descriptions are missing or index is out of bounds
                   descElement.textContent = `Level ${safeValue}`;
                   console.warn(`Slider description missing or invalid for trait '${traitName}' at value ${safeValue}`);
              }
          }
          this.sfUpdateDashboard(); // Update the dashboard on slider change
      } else {
          console.error("Slider input event fired without data-trait attribute.");
      }
  }


  // --- Core Rendering (Keep existing methods) ---
  renderStyles(r){this.elements.style.innerHTML='<option value="">Pick flavor!</option>';if(!bdsmData[r]?.styles)return;bdsmData[r].styles.forEach(s=>{this.elements.style.innerHTML+=`<option value="${this.escapeHTML(s.name)}">${this.escapeHTML(s.name)}</option>`;});}
  renderTraits(r,sN){this.elements.traitsContainer.innerHTML='';if(!bdsmData[r])return;const core=bdsmData[r].coreTraits||[];let styleT=[];let styleO=null;if(sN){styleO=bdsmData[r].styles.find(s=>s.name===sN);styleT=styleO?.traits||[];}const toRender=[];const uN=new Set();[...core,...styleT].forEach(t=>{if(t&&t.name&&!uN.has(t.name)){toRender.push(t);uN.add(t.name);}});if(toRender.length===0){this.elements.traitsContainer.innerHTML=`<p class="muted-text">No traits.</p>`;}else{toRender.forEach(t=>{this.elements.traitsContainer.innerHTML+=this.createTraitHTML(t);});this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(s=>this.updateTraitDescription(s));}if(sN&&styleO&&styleT.length===0&&core.length>0){const m=document.createElement('p');m.className='muted-text trait-info-message';m.textContent=`Style '${this.escapeHTML(sN)}' uses core traits.`;this.elements.traitsContainer.prepend(m);}else if(!sN&&core.length===0){this.elements.traitsContainer.innerHTML=`<p>Select style or define traits.</p>`;}this.hideTraitInfo();}
  createTraitHTML(t){const dN=t.name.charAt(0).toUpperCase()+t.name.slice(1);const id=`trait-${t.name.replace(/[^a-zA-Z0-9-_]/g,'-')}`;return`<div class="trait"><label for="${id}">${this.escapeHTML(dN)}</label><button class="trait-info-btn" data-trait="${t.name}" aria-label="Info: ${this.escapeHTML(dN)}">ℹ️</button><input type="range" id="${id}" min="1" max="5" value="3" class="trait-slider" data-trait="${t.name}" aria-label="${this.escapeHTML(dN)}" autocomplete="off"/><span class="trait-value">3</span><div class="trait-desc muted-text"></div></div>`;}
  updateTraitDescription(sl){const tN=sl.getAttribute('data-trait');const v=sl.value;const dD=sl.parentElement?.querySelector('.trait-desc');const vS=sl.parentElement?.querySelector('.trait-value');if(!dD||!vS)return;const r=this.elements.role.value;const sN=this.elements.style.value;let tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN)||bdsmData[r]?.coreTraits?.find(t=>t.name===tN);vS.textContent=v;if(tD?.desc?.[v]){dD.textContent=this.escapeHTML(tD.desc[v]);}else{dD.textContent=tD?'Desc unavailable.':'Trait unavailable.';}}
  renderList(){if(!this.elements.peopleList)return;this.elements.peopleList.innerHTML=this.people.length===0?`<li>No pals yet! ✨</li>`:this.people.map(p=>this.createPersonListItemHTML(p)).join('');}
  createPersonListItemHTML(p){const sD=p.style?this.escapeHTML(p.style):"N/A";const rD=p.role.charAt(0).toUpperCase()+p.role.slice(1);const nE=this.escapeHTML(p.name);const av=p.avatar||'❓';return`<li class="person" data-id="${p.id}" tabindex="0"><span class="person-info"><span class="person-avatar">${av}</span><span class="person-name-details"><strong class="person-name">${nE}</strong><span class="person-details muted-text">(${rD} - ${sD})</span></span></span><span class="person-actions"><button class="edit-btn small-btn" data-action="edit" data-id="${p.id}" aria-label="Edit ${nE}">✏️</button><button class="delete-btn small-btn" data-action="delete" data-id="${p.id}" aria-label="Delete ${nE}">🗑️</button></span></li>`;}

  // --- CRUD (Keep existing methods) ---
  savePerson(){const name=this.elements.name.value.trim()||"Unnamed";const av=this.elements.avatarInput.value||'❓';const r=this.elements.role.value;const sN=this.elements.style.value;if(!sN){alert("Select style.");return;}const sliders=this.elements.traitsContainer.querySelectorAll('.trait-slider');const expected=[...(bdsmData[r]?.coreTraits||[]),...(bdsmData[r]?.styles.find(s=>s.name===sN)?.traits||[])];const uniqueE=new Set(expected.map(t=>t.name));if(sliders.length!==uniqueE.size&&uniqueE.size>0){alert("Trait error.");return;}const tr={};let mD=false;sliders.forEach(s=>{const n=s.getAttribute('data-trait');if(n)tr[n]=s.value;else mD=true;});if(mD){alert("Gather trait error.");return;}for(const n of uniqueE){if(!tr.hasOwnProperty(n)){alert(`Missing data: '${n}'.`);return;}}const ex=this.currentEditId?this.people.find(p=>p.id===this.currentEditId):null;const pD={id:this.currentEditId||Date.now(),name,avatar:av,role:r,style:sN,goals:ex?.goals||[],traits:tr,history:ex?.history||[],achievements:ex?.achievements||[],reflections:ex?.reflections||{}};if(!this.currentEditId)grantAchievement(pD,'profile_created');if(this.people.length===4&&!this.currentEditId)grantAchievement(pD,'five_profiles');if(this.currentEditId)grantAchievement(pD,'profile_edited');if(this.currentEditId){const i=this.people.findIndex(p=>p.id===this.currentEditId);if(i!==-1)this.people[i]=pD;else{console.error("Update ID error");pD.id=Date.now();this.people.push(pD);}}else{this.people.push(pD);}this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`${this.escapeHTML(name)} saved! ✨`);}
  editPerson(pId){const p=this.people.find(p=>p.id===pId);if(!p){alert("Not found.");return;}this.currentEditId=pId;this.elements.name.value=p.name;this.elements.avatarDisplay.textContent=p.avatar||'❓';this.elements.avatarInput.value=p.avatar||'❓';this.elements.avatarPicker?.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('selected',b.dataset.emoji===p.avatar));this.elements.role.value=p.role;this.renderStyles(p.role);this.elements.style.value=p.style;this.renderTraits(p.role,p.style);requestAnimationFrame(()=>{if(p.traits){Object.entries(p.traits).forEach(([n,v])=>{const s=this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${n}"]`);if(s){s.value=v;this.updateTraitDescription(s);}}); }this.updateLivePreview();this.elements.save.textContent='Update ✨';this.elements.formSection?.scrollIntoView({behavior:'smooth'});this.elements.name.focus();});}
  deletePerson(pId){const idx=this.people.findIndex(p=>p.id===pId);if(idx===-1)return;const name=this.people[idx].name;if(confirm(`Delete ${this.escapeHTML(name)}?`)){this.people.splice(idx,1);this.saveToLocalStorage();this.renderList();if(this.currentEditId===pId)this.resetForm(true);alert(`${this.escapeHTML(name)} deleted.`);}}
  resetForm(clear=false){this.elements.name.value='';this.elements.avatarDisplay.textContent='❓';this.elements.avatarInput.value='❓';this.elements.avatarPicker?.querySelectorAll('.selected').forEach(b=>b.classList.remove('selected'));this.elements.role.value='submissive';this.renderStyles('submissive');this.elements.style.value='';this.renderTraits('submissive','');this.currentEditId=null;this.elements.save.textContent='Save Sparkle! 💖';if(clear)this.updateLivePreview();this.elements.name.focus();console.log("Form reset.");this.hideTraitInfo();}

  // --- Live Preview (Keep existing method) ---
  updateLivePreview(){const name=this.elements.name.value.trim()||"Unnamed";const av=this.elements.avatarInput.value||'❓';const r=this.elements.role.value;const s=this.elements.style.value;const tr={};this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(sl=>{const n=sl.getAttribute('data-trait');if(n)tr[n]=sl.value;});let html='';if(!s&&r&&Object.keys(tr).length>0){html=`<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Core Vibe ${av}</h3><p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p><p class="muted-text"><i>Core traits active. Pick Style!</i></p><div class="core-trait-preview"><strong>Core Traits:</strong><ul>`;bdsmData[r]?.coreTraits?.forEach(ct=>{const score=tr[ct.name];if(score){const tD=bdsmData[r]?.coreTraits?.find(t=>t.name===ct.name);const d=tD?.desc?.[score]||"N/A";html+=`<li><strong>${this.escapeHTML(ct.name)} (${score}):</strong> ${this.escapeHTML(d)}</li>`;}});html+=`</ul></div>`;}else if(s){const getB=r==='submissive'?getSubBreakdown:getDomBreakdown;const B=getB(s,tr);let topStyleInfo=null;const sO=bdsmData[r]?.styles.find(st=>st.name===s);if(sO?.traits?.length>0){let topSc=-1;let topN='';sO.traits.forEach(tDef=>{const sc=parseInt(tr[tDef.name]||0);if(sc>topSc){topSc=sc;topN=tDef.name;}});if(topN&&topSc>0){const tD=sO.traits.find(t=>t.name===topN);const d=tD?.desc?.[topSc]||"N/A";topStyleInfo=`<strong>Top Style Vibe (${this.escapeHTML(topN)} Lvl ${topSc}):</strong> ${this.escapeHTML(d)}`;}}html=`<h3 class="preview-title">${av} ${this.escapeHTML(name)}’s Live Vibe ${av}</h3><p><strong>Role:</strong> ${r.charAt(0).toUpperCase()+r.slice(1)}</p><p><strong>Style:</strong> ${this.escapeHTML(s)}</p><div class="style-breakdown preview-breakdown">`;if(B.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;if(B.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;html+=`</div>`;if(topStyleInfo){html+=`<div class="top-trait-preview"><hr><p>${topStyleInfo}</p></div>`;}}else{html=`<p class="muted-text">Pick role & style! 🌈</p>`;}this.elements.livePreview.innerHTML=html;}

  // --- Modal Display (Keep existing method) ---
  showPersonDetails(pId){const p=this.people.find(p=>p.id===pId);if(!p)return;console.log("Showing details:",p);p.goals=p.goals||[];p.history=p.history||[];p.achievements=p.achievements||[];p.reflections=p.reflections||{};p.avatar=p.avatar||'❓';const getB=p.role==='submissive'?getSubBreakdown:getDomBreakdown;const B=getB(p.style,p.traits||{});let html=`<h2 class="modal-title">${p.avatar} ${this.escapeHTML(p.name)}’s Kingdom ${p.avatar}</h2>`;html+=`<p class="modal-subtitle">${p.role.charAt(0).toUpperCase()+p.role.slice(1)} - ${p.style?this.escapeHTML(p.style):'N/A'}</p>`; let intro="Explore!";try{if(typeof this.getIntroForStyle==='function'){intro=this.getIntroForStyle(p.style);}else{console.warn("getIntroForStyle missing!");}}catch(e){console.error("Intro error:",e);}if(intro)html+=`<p class="modal-intro">${intro}</p>`;html+=`<section class="goals-section"><h3>🎯 Goals</h3><ul id="goal-list-${p.id}"></ul><div class="add-goal-form"><input type="text" id="new-goal-text-${p.id}" placeholder="Add goal..."><button class="add-goal-btn save-btn small-btn" data-person-id="${p.id}">+ Add</button></div></section>`;html+=`<section class="breakdown-section"><h3>🌈 Strengths & Growth</h3><div class="style-breakdown modal-breakdown">`;if(B.strengths)html+=`<div class="strengths"><h4>✨ Powers</h4><div>${B.strengths}</div></div>`;if(B.improvements)html+=`<div class="improvements"><h4>🌟 Quests</h4><div>${B.improvements}</div></div>`;html+=`</div></section>`;html+=`<section class="traits-section"><h3>🎨 Trait Tales</h3>`;const defs=[...(bdsmData[p.role]?.coreTraits||[]),...(bdsmData[p.role]?.styles.find(s=>s.name===p.style)?.traits||[])];const uDefs=Array.from(new Map(defs.map(t=>[t.name,t])).values());html+='<div class="trait-details-grid">';if(p.traits&&Object.keys(p.traits).length>0){Object.entries(p.traits).forEach(([n,sc])=>{const tO=uDefs.find(t=>t.name===n);const dN=n.charAt(0).toUpperCase()+n.slice(1);if(!tO){html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${sc}❓</h4><p><em>Def missing.</em></p></div>`;return;} const dT=tO.desc?.[sc]||"N/A";const fl=this.getFlairForScore(sc);html+=`<div class="trait-detail-item"><h4>${this.escapeHTML(dN)} - Lvl ${sc} ${this.getEmojiForScore(sc)}</h4><p><strong>Vibe:</strong> ${this.escapeHTML(dT)}</p><p><em>${fl}</em></p></div>`;});}else{html+=`<p>No scores.</p>`;}html+='</div></section>';html+=`<section class="history-section"><h3>⏳ History<button class="snapshot-info-btn" aria-label="Info">ℹ️</button></h3><p class="snapshot-info muted-text" style="display:none;">Snapshot saves current traits to track growth!</p><div class="history-chart-container"><canvas id="history-chart"></canvas></div><button id="snapshot-btn" class="small-btn" data-person-id="${p.id}">📸 Snapshot</button></section>`;html+=`<section class="achievements-section"><h3>🏆 Achievements</h3><div id="achievements-list-${p.id}"></div></section>`;html+=`<section class="kink-reading-section"><h3>🔮 Reading</h3><button id="reading-btn" class="small-btn" data-person-id="${p.id}">Get Reading!</button><div id="kink-reading-output" class="kink-reading-output" style="display:none;"></div></section>`;html+=`<section class="reflections-section"><h3>📝 Reflections</h3><div id="journal-prompt-area" style="display:none;"></div><div class="modal-actions"><button id="prompt-btn" class="small-btn">💡 Prompt</button></div><textarea id="reflections-text" class="reflections-textarea" data-person-id="${p.id}" rows="6" placeholder="Thoughts?">${this.escapeHTML(p.reflections?.text||'')}</textarea><button id="save-reflections-btn" class="save-btn" data-person-id="${p.id}">Save 💭</button></section>`;this.elements.modalBody.innerHTML=html;this.renderGoalList(p);this.renderAchievements(p);this.openModal(this.elements.modal);this.renderHistoryChart(p);}

  // --- New Feature Logic (Keep existing methods) ---
  addGoal(pId){const p=this.people.find(p=>p.id===pId);const i=this.elements.modalBody?.querySelector(`#new-goal-text-${pId}`);if(!p||!i)return;const t=i.value.trim();if(!t)return;const nG={id:Date.now(),text:t,status:'todo'};p.goals.push(nG);grantAchievement(p,'goal_added');this.saveToLocalStorage();this.renderGoalList(p);i.value='';}
  toggleGoalStatus(pId,gId){const p=this.people.find(p=>p.id===pId);const g=p?.goals.find(g=>g.id===gId);if(!g)return;g.status=(g.status==='done'?'todo':'done');this.saveToLocalStorage();this.renderGoalList(p);}
  deleteGoal(pId,gId){const p=this.people.find(p=>p.id===pId);if(!p)return;if(confirm('Delete goal?')){p.goals=p.goals.filter(g=>g.id!==gId);this.saveToLocalStorage();this.renderGoalList(p);}}
  renderGoalList(p){const l=this.elements.modalBody?.querySelector(`#goal-list-${p.id}`);if(!l)return;let h='';if(p.goals.length>0){p.goals.forEach(g=>{h+=`<li class="${g.status==='done'?'done':''}" data-goal-id="${g.id}"><span>${this.escapeHTML(g.text)}</span><span class="goal-actions"><button class="toggle-goal-btn small-btn" data-person-id="${p.id}" data-goal-id="${g.id}">${g.status==='done'?'🔄':'✅'}</button><button class="delete-goal-btn small-btn delete-btn" data-person-id="${p.id}" data-goal-id="${g.id}">🗑️</button></span></li>`;});}else{h=`<li>No goals!</li>`;}l.innerHTML=h;} // Added delete-btn class
  showJournalPrompt(){const a=this.elements.modalBody?.querySelector('#journal-prompt-area');if(a){a.innerHTML = `<p class="journal-prompt">${getRandomPrompt()}</p>`;a.style.display='block';this.elements.modalBody?.querySelector('#reflections-text')?.focus();}}
  saveReflections(pId){const p=this.people.find(p=>p.id===pId);const el=this.elements.modalBody?.querySelector('#reflections-text');if(!p||!el){alert("Error.");return;}const txt=el.value;if(!p.reflections)p.reflections={};p.reflections.text=txt;p.reflections.lastUpdated=Date.now();let first=false;if(txt.trim().length>0)first=grantAchievement(p,'reflection_saved');const count=Object.values(this.people.reduce((a,p)=>{if(p.reflections?.text?.trim().length>0)a[p.id]=true;return a;},{})).length;if(count>=5)grantAchievement(p,'five_reflections');this.saveToLocalStorage();const btn=this.elements.modalBody.querySelector('#save-reflections-btn');if(btn){btn.textContent='Saved ✓';btn.disabled=true;setTimeout(()=>{btn.textContent='Save 💭';btn.disabled=false;},2000);}else{alert("Saved! ✨");}}
  addSnapshotToHistory(pId){const p=this.people.find(p=>p.id===pId);if(!p||!p.traits){alert("Cannot snapshot.");return;}const snap={date:Date.now(),traits:{...p.traits}};p.history.push(snap);grantAchievement(p,'history_snapshot');this.saveToLocalStorage();alert("Snapshot saved! 📸");this.renderHistoryChart(p);this.renderAchievements(p);}
  renderHistoryChart(p){const cont=this.elements.modalBody?.querySelector('.history-chart-container');let ctx=cont?.querySelector('#history-chart')?.getContext('2d');if(this.chartInstance){this.chartInstance.destroy();this.chartInstance=null;}if(!ctx){if(cont)cont.innerHTML=`<p>Chart canvas missing.</p>`;return;}if(!p?.history?.length){cont.innerHTML=`<p>No history yet!</p>`;return;}if(cont.querySelector('p'))cont.innerHTML=`<canvas id="history-chart"></canvas>`;ctx=cont.querySelector('#history-chart').getContext('2d');const labels=p.history.map(s=>new Date(s.date).toLocaleDateString());const allN=new Set();p.history.forEach(s=>Object.keys(s.traits).forEach(n=>allN.add(n)));if(p.traits)Object.keys(p.traits).forEach(n=>allN.add(n));const dSets=[];const clrs=['#ff69b4','#8a5a6d','#ff85cb','#4a2c3d','#f4d4e4','#c49db1','#a0d8ef','#dcc1ff'];let cI=0;allN.forEach(tN=>{const data=p.history.map(s=>s.traits[tN]!==undefined?parseInt(s.traits[tN]):null);const c=clrs[cI%clrs.length];dSets.push({label:tN.charAt(0).toUpperCase()+tN.slice(1),data:data,borderColor:c,backgroundColor:c+'80',tension:.1,fill:false,spanGaps:true});cI++;});const isD=document.body.getAttribute('data-theme')==='dark'||document.body.getAttribute('data-theme')==='velvet';const gC=isD?'rgba(244,212,228,0.15)':'rgba(74,44,61,0.1)';const lC=isD?'#c49db1':'#8a5a6d';this.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:dSets},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{color:lC}},tooltip:{mode:'index',intersect:false,}},scales:{y:{min:1,max:5,ticks:{stepSize:1,color:lC},grid:{color:gC}},x:{ticks:{color:lC},grid:{color:gC}}}}});}
  toggleSnapshotInfo(btn){const inf=btn.closest('.history-section')?.querySelector('.snapshot-info');if(inf){const isH=inf.style.display==='none';inf.style.display=isH?'block':'none';btn.setAttribute('aria-expanded',isH);}}
  renderAchievements(p){const l=this.elements.modalBody?.querySelector(`#achievements-list-${p.id}`);if(!l)return;let h='';if(p.achievements.length>0){h+=`<ul>`;p.achievements.forEach(id=>{const d=achievementList[id];if(d){const e=d.name.match(/([\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+)/u)?.[0]||'🏆';h+=`<li title="${this.escapeHTML(d.desc)}"><span class="achievement-icon">${e}</span><span class="achievement-name">${this.escapeHTML(d.name)}</span></li>`;}});h+=`</ul>`;}else{h=`<p class="muted-text">No achievements yet!</p>`;}l.innerHTML=h;} // Used muted-text class
  showKinkReading(pId){const p=this.people.find(p=>p.id===pId);const o=this.elements.modalBody?.querySelector('#kink-reading-output');if(!p||!o)return;grantAchievement(p,'kink_reading');this.saveToLocalStorage();this.renderAchievements(p);let r=`🔮 ${this.escapeHTML(p.name)}'s Reading 🔮\nAs a ${this.escapeHTML(p.style)} ${p.role}, path sparkles!\n`;const t=p.traits||{};const s=Object.entries(t).map(([n,sc])=>({name:n,score:parseInt(sc)})).sort((a,b)=>b.score-a.score);if(s.length>0){const h=s[0];const l=s[s.length-1];const c1=bdsmData[p.role]?.coreTraits[0]?.name;const c2=bdsmData[p.role]?.coreTraits[1]?.name;r+=`\n✨ Star: **${h.name}(${h.score})**! ${this.getReadingDescriptor(h.name,h.score)}.\n`;if(c1&&t[c1])r+=`🧭 Core **${c1}(${t[c1]})**: ${this.getReadingDescriptor(c1,t[c1])}.\n`;if(c2&&t[c2])r+=`🧭 Core **${c2}(${t[c2]})**: ${this.getReadingDescriptor(c2,t[c2])}.\n`;if(s.length>1&&h.score!==l.score)r+=`\n🌱 Bloom: **${l.name}(${l.score})**. Explore ${this.getReadingDescriptor(l.name,l.score)}.\n`;}else{r+=`\nTraits uncharted!\n`;}r+=`\n💖 ${this.escapeHTML(p.style)} is about ${this.getStyleEssence(p.style)}!\n`;o.textContent=r;o.style.display='block';}
  getReadingDescriptor(tN,sc){sc=parseInt(sc);if(tN==='obedience')return sc>=4?"joyful compliance":sc<=2?"independent spirit":"developing discipline";if(tN==='trust')return sc>=4?"deep connection":sc<=2?"cautious exploration":"building security"; return"unique expression";}
  getStyleEssence(sN){const e={"brat":"playful challenge","slave":"deep devotion",/*...*/};const k=sN?.toLowerCase().replace(/\(.*?\)/g,'').replace(/ \/ /g,'/').trim()||'';return e[k]||`your magic`;}
  showGlossary(){if(!this.elements.glossaryBody)return;grantAchievement({},'glossary_user');let h='<dl>';for(const k in glossaryTerms){const d=glossaryTerms[k];h+=`<dt id="gloss-term-${k}">${this.escapeHTML(d.term)}</dt><dd>${this.escapeHTML(d.definition)}`;if(d.related?.length){h+=`<br><span class="related-terms">See also: `;h+=d.related.map(rK=>`<a href="#gloss-term-${rK}">${glossaryTerms[rK]?.term||rK}</a>`).join(', ');h+=`</span>`;}h+=`</dd>`;}h+='</dl>';this.elements.glossaryBody.innerHTML=h;this.openModal(this.elements.glossaryModal);}
  showStyleDiscovery(){grantAchievement({},'style_explorer');this.renderStyleDiscoveryContent();this.openModal(this.elements.styleDiscoveryModal);}
  renderStyleDiscoveryContent(){if(!this.elements.styleDiscoveryBody||!this.elements.styleDiscoveryRoleFilter)return;const sel=this.elements.styleDiscoveryRoleFilter.value;let h='';['submissive','dominant'].forEach(r=>{if(sel==='all'||sel===r){h+=`<h3>${r.charAt(0).toUpperCase()+r.slice(1)} Styles</h3>`;if(bdsmData[r]?.styles){bdsmData[r].styles.forEach(st=>{h+=`<div class="style-discovery-item"><h4>${this.escapeHTML(st.name)}</h4>`; if(st.summary)h+=`<p><em>${this.escapeHTML(st.summary)}</em></p>`; if(st.traits?.length){h+=`<strong>Traits:</strong><ul>`;st.traits.forEach(tr=>{h+=`<li>${this.escapeHTML(tr.name.charAt(0).toUpperCase()+tr.name.slice(1))}</li>`;});h+=`</ul>`;}else{h+=`<p>Uses core traits.</p>`;}h+=`</div>`;});}else{h+=`<p>No styles.</p>`;}}});this.elements.styleDiscoveryBody.innerHTML=h||'<p>No styles.</p>';}
  setTheme(tN){document.body.setAttribute('data-theme',tN);const iD=tN==='dark'||tN==='velvet';if(this.elements.themeToggle){this.elements.themeToggle.textContent=iD?'☀️':'🌙';this.elements.themeToggle.setAttribute('title',`Switch to ${iD?'light':'dark'} mode`);}try{localStorage.setItem('kinkCompassTheme',tN);}catch(e){console.warn("Save theme failed:",e);}if(this.chartInstance&&this.currentEditId){const p=this.people.find(p=>p.id===this.currentEditId);if(p)this.renderHistoryChart(p);}}
  applySavedTheme(){let saved='light';try{if(typeof localStorage!=='undefined')saved=localStorage.getItem('kinkCompassTheme')||'light';}catch(e){console.warn("Read theme failed:",e);}this.setTheme(saved);console.log(`Applied theme: ${saved}`);}
  toggleTheme(){const cur=document.body.getAttribute('data-theme')||'light';const isD=cur==='dark'||cur==='velvet';this.setTheme(isD?'light':'dark');}
  exportData(){if(this.people.length===0){alert("No profiles!");return;}try{const dS=JSON.stringify(this.people,null,2);const b=new Blob([dS],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`kinkcompass_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);grantAchievement({},'data_exported');console.log("Exported.");a.remove();}catch(e){console.error("Export failed:",e);alert("Export failed.");}}
  importData(ev){const f=ev.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=(e)=>{try{const imp=JSON.parse(e.target.result);if(!Array.isArray(imp))throw new Error("Not array.");const valid=imp.every(i=>typeof i==='object'&&i!==null&&'id'in i&&'name'in i);if(!valid)throw new Error("Invalid format.");if(confirm(`Import ${imp.length}? OVERWRITES current ${this.people.length}.`)){this.people=imp.map(p=>({...p,goals:p.goals||[],history:p.history||[],avatar:p.avatar||'❓',achievements:p.achievements||[], reflections:p.reflections||{}}));this.saveToLocalStorage();this.renderList();this.resetForm(true);alert(`Imported ${this.people.length}.`);}}catch(err){console.error("Import failed:",err);alert(`Import failed: ${err.message}`);}finally{ev.target.value=null;}};r.onerror=()=>{alert("Error reading file.");ev.target.value=null;};r.readAsText(f);}
  showTraitInfo(tN){const r=this.elements.role.value;const sN=this.elements.style.value;const tD=bdsmData[r]?.styles.find(s=>s.name===sN)?.traits?.find(t=>t.name===tN)||bdsmData[r]?.coreTraits?.find(t=>t.name===tN);if(tD&&this.elements.traitInfoPopup&&this.elements.traitInfoTitle&&this.elements.traitInfoBody){const title=tN.charAt(0).toUpperCase()+tN.slice(1);this.elements.traitInfoTitle.textContent=`${this.getEmojiForScore(3)} ${title} Levels`;let bodyHtml='';for(let i=1;i<=5;i++){const s=String(i);const d=tD.desc?.[s]||'N/A';const e=this.getEmojiForScore(s);bodyHtml+=`<p><strong>${e} Lvl ${s}:</strong> ${this.escapeHTML(d)}</p>`;}this.elements.traitInfoBody.innerHTML=bodyHtml;this.elements.traitInfoPopup.style.display='block';this.elements.traitInfoPopup.scrollIntoView({behavior:'smooth',block:'nearest'});}else{console.warn("No trait data/popup:",tN);this.hideTraitInfo();}}
  hideTraitInfo(){if(this.elements.traitInfoPopup)this.elements.traitInfoPopup.style.display='none';}


  // --- Style Finder Methods (Restored & Integrated - CORRECTED) ---

  sfStart() {
      this.sfActive = true;
      this.sfStep = 0;
      this.sfRole = null;
      this.sfAnswers = { traits: {} };
      this.sfScores = {};
      this.sfHasRenderedDashboard = false;
      this.sfPreviousScores = {};
      this.sfTraitSet = [];
      this.sfSteps = [];
      if(this.elements.sfDashboard) this.elements.sfDashboard.style.display = 'none';
      if(this.elements.sfFeedback) this.elements.sfFeedback.textContent = '';

      if (!this.elements.sfStepContent) {
          console.error("Style Finder step content element not found!");
          alert("Error: Cannot start Style Finder.");
          return;
      }

      this.openModal(this.elements.sfModal);
      this.sfRenderStep();
      this.sfShowFeedback("Let’s begin your journey!");
  }

  sfClose() {
      this.sfActive = false;
      this.closeModal(this.elements.sfModal);
      console.log("Style Finder closed.");
  }

  sfCalculateSteps() {
      this.sfSteps = [];
      this.sfSteps.push({ type: 'welcome' });
      this.sfSteps.push({ type: 'role' });

      if (this.sfRole) {
          const baseTraitSet = (this.sfRole === 'dominant' ? this.sfDomFinderTraits : this.sfSubFinderTraits);
          // Only recalculate/shuffle if sfTraitSet is empty or role changed implicitly
          if(this.sfTraitSet.length === 0) {
            this.sfTraitSet = [...baseTraitSet].sort(() => 0.5 - Math.random());
          }
          this.sfTraitSet.forEach(trait => this.sfSteps.push({ type: 'trait', trait: trait.name }));
          this.sfSteps.push({ type: 'roundSummary', round: 'Traits' });
      }

      this.sfSteps.push({ type: 'result' });
  }

  sfRenderStep() {
      if (!this.sfActive || !this.elements.sfStepContent) return;

      this.sfCalculateSteps();

      if (this.sfStep < 0 || this.sfStep >= this.sfSteps.length) {
          console.error(`Invalid Style Finder step index: ${this.sfStep}. Resetting.`);
          this.sfStep = 0;
           this.sfCalculateSteps();
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
             this.elements.sfProgressTracker.style.display = 'none';
             console.warn(`Could not find trait '${step.trait}' in sfTraitSet for progress.`);
          }
