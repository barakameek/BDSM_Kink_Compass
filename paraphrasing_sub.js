import { bdsmData } from './data.js'; // Path might need adjustment

// Helper to normalize style names for lookup
function normalizeStyleKey(name) {
    if (!name) return '';
    return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim();
}

// Suggestions tailored to the NEW style list with a fun tone
const subStyleSuggestions = {
  submissive: {
    1: { paraphrase: "🌱 Starting your Submissive sparkle?", suggestion: "Try one tiny act of service today & give yourself a gold star! ⭐" },
    2: { paraphrase: "🌸 Blooming in Submission?", suggestion: "Practice anticipating one need or presenting yourself nicely! Discuss how it felt! 💬" },
    3: { paraphrase: "✨ Shining with helpful grace?", suggestion: "Take initiative on a service task or dedicate extra effort to presentation! Feel the glow! 😊" },
    4: { paraphrase: "💖 Mastering delightful deference!", suggestion: "Combine proactive service AND lovely presentation! You're radiant! 💅" },
    5: { paraphrase: "👑 Submissive Royalty!", suggestion: "Reflect on how service and presentation intertwine for you. Deepen your unique expression! 💖" }
  },
  brat: {
    1: { paraphrase: "😈 Testing the bratty waters?", suggestion: "Try one *tiny* playful poke! See how the push-pull feels! 😉" },
    2: { paraphrase: "😜 Getting sassier?", suggestion: "Push a boundary *slightly* more, but be ready to giggle through consequences! 😏" },
    3: { paraphrase: "🔥 Brat level increasing!", suggestion: "Combine witty defiance with resilience! Take a 'punishment' with a smirk! 🎤" },
    4: { paraphrase: "💥 Unstoppable Brat Energy!", suggestion: "Initiate a creative challenge! Can you outsmart them (just a bit!)? High five! ✋" },
    5: { paraphrase: "👑 Supreme Ruler of Sass!", suggestion: "Invent a new brat game! Revel in the delightful chaos you create! 🎊" }
  },
  slave: {
    1: { paraphrase: "🕯️ Lighting the path of Slavery?", suggestion: "Focus on one moment of quiet devotion or intentional surrender today. Feel the connection. 🙏" },
    2: { paraphrase: "🔗 Forging deeper bonds?", suggestion: "Practice yielding control in a new, small way. Share your feelings! 💬" },
    3: { paraphrase: "🌹 Blooming in Surrender?", suggestion: "Explore a small ritual of devotion or embrace stillness for your Owner. 🎉" },
    4: { paraphrase: "💎 Shining with Devotion!", suggestion: "Anticipate a need as an act of pure devotion. Find joy in fulfilling it. ✨" },
    5: { paraphrase: "❤️ Embodying Dedicated Slavery!", suggestion: "Reflect on the profound peace surrender brings. How can this deepen your connection? 🌟" }
  },
  switch: {
    1: { paraphrase: "↔️ Exploring the Switchy path?", suggestion: "Try consciously noticing the feelings of *one* role today. How does it differ? 🤔" },
    2: { paraphrase: "🔄 Practicing the pivot?", suggestion: "Attempt a small shift in dynamic with clear communication. How did the transition feel? 💬" },
    3: { paraphrase: "🎭 Getting comfy in dual roles?", suggestion: "Initiate a scene where you might switch mid-way (with discussion!). Enjoy the flow! 😊" },
    4: { paraphrase: "✨ Shining as a versatile Switch!", suggestion: "Challenge yourself to switch smoothly based on subtle cues. Feel the energetic dance! 💃" },
    5: { paraphrase: "💖 Master of the Dynamic Dance!", suggestion: "Reflect on the unique empathy switching brings. How does it enrich your connections? 💖" }
  },
  pet: {
    1: { paraphrase: "🐾 Tiny paws exploring Petspace?", suggestion: "Try one non-verbal purr or nudge for attention! Feel the cute! 😊" },
    2: { paraphrase: "💖 Learning the ways of a Pet?", suggestion: "Practice asking for cuddles more openly or use more happy sounds! Talk about it! ✨" },
    3: { paraphrase: "🧸 Snuggling into Petspace?", suggestion: "Combine seeking affection with playful wiggles or nuzzles! Enjoy the warmth! 🎶" },
    4: { paraphrase: "🌟 Shining as a loyal companion!", suggestion: "Anticipate your Owner's mood & offer comfort non-verbally. Earn those head pats! 🍪" },
    5: { paraphrase: "👑 A cherished, expressive Pet!", suggestion: "Develop unique ways to 'talk' without words! Revel in the intuitive bond! 🎀" }
  },
  little: {
    1: { paraphrase: "🧸 Discovering your inner Little?", suggestion: "Allow yourself one moment of pure play or accept one piece of guidance with a smile. Be kind to you! 😊" },
    2: { paraphrase: "🖍️ Coloring your Little world?", suggestion: "Try expressing a 'little' feeling (like excitement or shyness) or follow one simple rule happily. ✨" },
    3: { paraphrase: "🍭 Sweetly settling into Littlespace?", suggestion: "Engage in a favorite childhood game or embrace the comfort of rules. Find the joy! 🎉" },
    4: { paraphrase: "🎀 Shining bright as a Little Star!", suggestion: "Express vulnerability trustingly or delight in pleasing your Caregiver. Feel the safety! 🌟" },
    5: { paraphrase: "💖 Fully embracing your Little heart!", suggestion: "Co-create a special 'little' ritual (like story time!). Cherish the unique bond! 🦄" }
  },
  puppy: {
    1: { paraphrase: "🐶 New puppy on the block?", suggestion: "Show eager tail wags (real or imagined!) for one command today! Good pup! 😊" },
    2: { paraphrase: "🦴 Learning new tricks?", suggestion: "Practice one command with extra enthusiasm! Remember, treats help! 😉" },
    3: { paraphrase: "🐕‍🦺 Eager and ready to play?", suggestion: "Initiate a game of fetch or show off a learned trick! Feel the zoomies! 🥎" },
    4: { paraphrase: "🏆 Top Dog potential!", suggestion: "Combine boundless energy with focused trainability! Amaze your Owner! ✨" },
    5: { paraphrase: "🌟 The Ultimate Good Pup!", suggestion: "Anticipate commands with joyful energy! Your enthusiasm is infectious! 💖" }
  },
  kitten: {
    1: { paraphrase: "🐾 Tiny kitten, soft paws?", suggestion: "Explore one new object with cautious curiosity (a gentle bat-bat!). Purr when praised! 😸" },
    2: { paraphrase: "🧶 Getting tangled in fun?", suggestion: "Try a playful pounce or practice moving with a bit more feline grace! ✨" },
    3: { paraphrase: "🐈‍⬛ Sleek and curious?", suggestion: "Combine curiosity with poise in a playful scenario! Land on your feet! 🎉" },
    4: { paraphrase: "✨ Shining with kitten charm!", suggestion: "Use your grace and curiosity to investigate something new! Celebrate with a happy mew! 🌟" },
    5: { paraphrase: "👑 Purrfectly poised Kitten!", suggestion: "Embrace your inner cat fully! Move with elegance, play with abandon! 💖" }
  },
  princess: {
    1: { paraphrase: "👑 Awaiting your crown?", suggestion: "Allow yourself to be pampered in one small way today! You deserve it! 😊" },
    2: { paraphrase: "💅 Practicing your royal wave?", suggestion: "Try delegating one small, appropriate task with a charming smile! 😉" },
    3: { paraphrase: "💎 Starting to sparkle?", suggestion: "Revel in being spoiled a bit more or practice your 'royal decree' voice! 🎉" },
    4: { paraphrase: "✨ Shining like royalty!", suggestion: "Combine enjoying pampering with gracefully expecting help! Own your throne! 🌟" },
    5: { paraphrase: "💖 Truly Regal!", suggestion: "Reflect on how being treated like royalty makes you feel. How can you enhance this majestic dynamic? 👑" }
  },
  'rope bunny': { // Key matches normalized name
    1: { paraphrase: "🐇 Hopping towards the ropes?", suggestion: "Try one simple, comfy tie (like wrists). Focus on safety & communication! 😊" },
    2: { paraphrase: "🥨 Getting tied up in fun?", suggestion: "Practice patience during a slightly longer tie or explore a new simple knot! 💬" },
    3: { paraphrase: "🎀 Enjoying the decorative binds?", suggestion: "Experiment with a slightly more aesthetic tie! Admire the patterns! 🎉" },
    4: { paraphrase: "✨ Shining in shibari!", suggestion: "Challenge yourself with a more complex tie or hold a pose patiently! You're art! 🌟" },
    5: { paraphrase: "💖 Masterpiece in rope!", suggestion: "Collaborate on designing a complex tie or explore beginner suspension safely! Celebrate rope! 🎨" }
  },
  masochist: {
    1: { paraphrase: "⚡️ Gently testing the waters?", suggestion: "Identify one sensation you're curious about. Try it *very* lightly with clear talk! 😊" },
    2: { paraphrase: "🌡️ Exploring the ouch-to-ooh spectrum?", suggestion: "Experiment with slightly more intensity or duration. Listen to your body's story! 💬" },
    3: { paraphrase: "🔥 Finding the fascinating edge?", suggestion: "Combine different sensations or work on riding a specific wave of intensity. Feel the release! 🎉" },
    4: { paraphrase: "💥 Thriving on intensity!", suggestion: "Explore more complex scenes or push known limits (safely!). Analyze the 'why'! 🌟" },
    5: { paraphrase: "🚀 Sensation Connoisseur!", suggestion: "Design a scene focused on achieving a specific mental/physical state through sensation. Own it! 🔥" }
  },
  prey: {
    1: { paraphrase: "🐿️ Peeking out cautiously?", suggestion: "Try a *very* playful 'hide and seek' moment. Feel the anticipation! 😊" },
    2: { paraphrase: "🐇 Darting from the 'hunter'?", suggestion: "Engage in a short, playful chase. Discuss comfort with the 'fear' edge! 💬" },
    3: { paraphrase: "🦊 Enjoying the thrill of the hunt?", suggestion: "Make the chase a little longer or the 'capture' more dramatic! It's exciting! 🎉" },
    4: { paraphrase: "✨ Reveling in the pursuit!", suggestion: "Fully embrace the role! Use your wits to 'escape' (or be caught!). Feel the adrenaline! 🌟" },
    5: { paraphrase: "💖 Master of the Chase Dynamic!", suggestion: "Collaborate on a scene with high stakes (but ultimate safety!). Live for the thrill! 🎭" }
  },
  toy: {
    1: { paraphrase: "🧸 New toy in the box?", suggestion: "Allow yourself to be gently positioned or 'used' for one simple task. How does it feel? 😊" },
    2: { paraphrase: "🧩 Learning to be played with?", suggestion: "Practice relaxing while being posed or respond to one simple control command. 💬" },
    3: { paraphrase: "🎁 Fun and ready to be used?", suggestion: "Enjoy being the center of attention as a pleasure object or respond readily to being moved! 🎉" },
    4: { paraphrase: "✨ Shining as a prized possession!", suggestion: "Embrace being objectified (safely!) or show off your responsiveness to control! 🌟" },
    5: { paraphrase: "💖 The Perfect Plaything!", suggestion: "Anticipate how your owner wants to 'play' and respond flawlessly! Revel in being their toy! 💖" }
  },
  doll: {
    1: { paraphrase: "🎀 First steps as a Doll?", suggestion: "Try holding one pose gracefully for a minute or add one 'doll-like' detail to your look! 😊" },
    2: { paraphrase: "💄 Perfecting the porcelain look?", suggestion: "Practice stillness during posing or spend extra time on a doll-like aesthetic element! ✨" },
    3: { paraphrase: "💖 Becoming a living Doll?", suggestion: "Combine graceful stillness with a perfectly curated look! Feel beautiful! 🎉" },
    4: { paraphrase: "✨ Shining as a perfect Doll!", suggestion: "Hold complex poses passively or fully embrace the detailed aesthetic! You're art! 🌟" },
    5: { paraphrase: "💎 Flawless Doll Perfection!", suggestion: "Embody complete stillness and curated beauty. Reflect on the unique surrender this brings! 💖" }
  },
  bunny: { // Distinct from Rope Bunny, focus on shy/gentle
    1: { paraphrase: "🐇 Peeking out shyly?", suggestion: "Offer one small, gentle gesture of affection or practice being still when approached softly. 😊" },
    2: { paraphrase: "🥕 Nibbling on the dynamic?", suggestion: "Try expressing shyness non-verbally (like averting eyes) or seek gentle reassurance! ✨" },
    3: { paraphrase: "🌸 Soft and easily startled?", suggestion: "Embrace your gentle nature! Practice receiving soft touches or quiet praise calmly. 🎉" },
    4: { paraphrase: "✨ Thriving in gentleness!", suggestion: "Show your trust through allowing closeness despite shyness! Your quiet presence is lovely! 🌟" },
    5: { paraphrase: "💖 Perfectly precious Bunny!", suggestion: "Find joy in your gentle, skittish nature. Communicate your need for softness clearly! 💖" }
  },
  servant: {
    1: { paraphrase: "🧹 Picking up the basics?", suggestion: "Focus completely on completing one small task perfectly! Feel the satisfaction! 😊" },
    2: { paraphrase: "🧼 Learning attentive service?", suggestion: "Try to anticipate one small need today (like refilling a drink!). How did it feel? ✨" },
    3: { paraphrase: "✨ Becoming an indispensable aide?", suggestion: "Combine focused task completion with anticipating needs! You're so helpful! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet competence!", suggestion: "Proactively manage several tasks or anticipate a non-obvious need! Impressive! 🌟" },
    5: { paraphrase: "💖 The Heart of Service!", suggestion: "Reflect on the deep satisfaction of seamless, anticipatory service. Your dedication is amazing! 💖" }
  },
  playmate: {
    1: { paraphrase: "🎲 Ready to learn the rules?", suggestion: "Join in one simple game with enthusiasm, even if you feel silly! Fun first! 😊" },
    2: { paraphrase: "🤸‍♀️ Getting into the game?", suggestion: "Try being a *really* good sport about a rule or a 'loss'! Laughter is key! ✨" },
    3: { paraphrase: "🎉 Bringing the fun?", suggestion: "Suggest a playful activity or embrace a silly rule with gusto! You're the life of the party! 🎉" },
    4: { paraphrase: "✨ Shining as the perfect playmate!", suggestion: "Combine boundless enthusiasm with being a great sport! Make every game amazing! 🌟" },
    5: { paraphrase: "💖 Master of Play!", suggestion: "Invent a new game or scenario! Your playful spirit makes everything better! 💖" }
  },
  babygirl: {
    1: { paraphrase: "🥺 Testing the waters, Daddy/Mommy?", suggestion: "Try expressing one small need vulnerably or add a touch of charming coyness! 😊" },
    2: { paraphrase: "💖 Learning the art of allure?", suggestion: "Practice asking for what you want with playful charm or embrace showing your softer side! ✨" },
    3: { paraphrase: "🎀 Sweet, sassy, and needing care?", suggestion: "Combine vulnerability with coquettish teasing! You're irresistible! 🎉" },
    4: { paraphrase: "✨ Shining with babygirl charm!", suggestion: "Master the art of getting your way with charm or express deep trust through vulnerability! 🌟" },
    5: { paraphrase: "👑 The Ultimate Babygirl!", suggestion: "Effortlessly blend innocence, charm, and neediness. Reflect on the unique power this dynamic holds! 💖" }
  },
  captive: {
    1: { paraphrase: "⛓️ Rattling the cage (gently)?", suggestion: "Try one small, 'token' act of struggle during pretend capture! Feel the drama! 😊" },
    2: { paraphrase: "🎭 Practicing your 'escape'?", suggestion: "Put a little more effort into 'struggling' or express 'defiance' playfully! ✨" },
    3: { paraphrase: "🎬 Getting into the role?", suggestion: "Combine a convincing struggle performance with underlying acceptance! Enjoy the story! 🎉" },
    4: { paraphrase: "✨ Shining star of the capture scene!", suggestion: "Make the struggle seem *real* (while being safe!) or show subtle hints of enjoying your fate! 🌟" },
    5: { paraphrase: "💖 Master of the Captive Narrative!", suggestion: "Fully embody the role! Find the thrill in the struggle and the bliss in the surrender! 💖" }
  },
  thrall: {
    1: { paraphrase: "🌀 Eyes glazing over (just kidding!)?", suggestion: "Practice focusing solely on your Dom's voice for one minute. Quiet the mind! 😊" },
    2: { paraphrase: "🌬️ Becoming more receptive?", suggestion: "Try accepting one small suggestion without question or deepen your mental focus during connection! ✨" },
    3: { paraphrase: "✨ Deepening the mental connection?", suggestion: "Combine focused attention with openness to suggestion! Feel the flow! 🎉" },
    4: { paraphrase: "💖 Lost in their presence!", suggestion: "Allow yourself to enter a deeper state of focus or act on suggestion readily! Explore the trance! 🌟" },
    5: { paraphrase: "💫 One mind, one will!", suggestion: "Reflect on the unique intimacy of deep mental connection and suggestibility. Pure magic! 💖" }
  },
  puppet: {
    1: { paraphrase: "🧵 Learning the strings?", suggestion: "Follow one simple movement command precisely! Feel the external control! 😊" },
    2: { paraphrase: "🧍‍♀️ Practicing passivity?", suggestion: "Try waiting completely still for the next command, resisting the urge to move on your own! ✨" },
    3: { paraphrase: "💃 Dancing to their tune?", suggestion: "Combine quick responsiveness to commands with deep passivity between them! You're mesmerizing! 🎉" },
    4: { paraphrase: "✨ Shining as the perfect puppet!", suggestion: "Follow complex sequences of commands flawlessly or embrace complete stillness! 🌟" },
    5: { paraphrase: "💖 Masterpiece of the Puppeteer!", suggestion: "Anticipate the *style* of control desired. Reflect on the surrender of being moved! 💖" }
  },
  maid: {
    1: { paraphrase: "🧹 Dusting off your skills?", suggestion: "Perform one cleaning task with extra attention to detail! Sparkle and shine! 😊" },
    2: { paraphrase: "✨ Polishing your presentation?", suggestion: "Wear your designated attire with pride or practice one element of service etiquette! ✨" },
    3: { paraphrase: "🧼 Serving with precision?", suggestion: "Combine meticulous task completion with perfect uniform presentation! Impeccable! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet efficiency!", suggestion: "Anticipate a cleaning/tidying need or maintain flawless etiquette throughout! 🌟" },
    5: { paraphrase: "💖 The Perfect Domestic!", suggestion: "Take pride in creating perfect order and serving flawlessly! Your dedication is admirable! 💖" }
  },
  painslut: { // Ensure language is consensual & enthusiastic
    1: { paraphrase: "🔥 Curious about the sting?", suggestion: "Communicate clearly about trying one specific sensation you *want* to explore! Safety first! 😊" },
    2: { paraphrase: "🌶️ Craving a little more spice?", suggestion: "Ask for a slightly higher intensity or duration of a sensation you enjoy! Use your words! ✨" },
    3: { paraphrase: "💥 Riding the waves of intensity?", suggestion: "Combine actively seeking sensation with showing your endurance (safely)! Feel the power! 🎉" },
    4: { paraphrase: "✨ Thriving on the edge!", suggestion: "Clearly ask for challenging sensations or design a scene focused on pushing your limits! 🌟" },
    5: { paraphrase: "💖 Devotee of Sensation!", suggestion: "Revel in your desire! Communicate your cravings clearly and celebrate your incredible endurance! 💖" }
  },
  bottom: {
    1: { paraphrase: "⬇️ Exploring the receiving end?", suggestion: "Practice consciously opening yourself to receive one instruction or sensation without resistance. Feel the flow! 😊" },
    2: { paraphrase: "🧘‍♀️ Learning to yield power?", suggestion: "Focus on the *feeling* of the power exchange during one interaction. What does it signify for you? ✨" },
    3: { paraphrase: "✨ Embracing the power dynamic?", suggestion: "Combine active receptivity with conscious enjoyment of the power imbalance! It's electric! 🎉" },
    4: { paraphrase: "💖 Shining in your role!", suggestion: "Become highly attuned to your partner's lead or reflect deeply on the fulfillment power exchange brings! 🌟" },
    5: { paraphrase: "🌊 Ocean of Receptivity!", suggestion: "Find profound peace and connection in the power exchange. Your openness is beautiful! 💖" }
  }
};


export function getStyleBreakdown(styleName, traits) {
  const styleKey = normalizeStyleKey(styleName);
  const styleData = subStyleSuggestions[styleKey];

  if (!styleData) {
    return {
      strengths: "You're crafting your unique submissive sparkle! Keep exploring. 💕",
      improvements: "Pick a defined style to see personalized tips for growth, cutie! 😸"
    };
  }

  // Use data directly from bdsmData for trait definitions if needed
  const roleData = bdsmData.submissive;
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);

  let traitScores = [];
  if (styleObj && styleObj.traits) {
      traitScores = styleObj.traits.map(t => parseInt(traits[t.name]) || 3);
  }
  // Add core traits to the average score calculation
  if(traits.obedience) traitScores.push(parseInt(traits.obedience) || 3);
  if(traits.trust) traitScores.push(parseInt(traits.trust) || 3);


  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default if no traits to average

  const scoreIndex = Math.max(1, Math.min(5, avgScore)); // Ensure score is 1-5
  const levelData = styleData[scoreIndex];

  if(!levelData) {
      console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`);
      return {
          strengths: `Exploring the path of a ${styleName}! ✨`,
          improvements: `Continue refining your unique ${styleName} expression! 🌱`
      };
  }

  const { paraphrase, suggestion } = levelData;

  const isStrength = scoreIndex >= 4;

  // Use markdown-like syntax for emphasis (will be handled by UI)
  const strengthsText = isStrength
    ? `✨ **${paraphrase}** ${suggestion}`
    : `🌱 You're cultivating wonderful skills in ${styleName}! Keep nurturing your growth, star!`;

  const improvementsText = isStrength
    ? `🚀 Keep exploring the depths of ${styleName}! What new facet can you uncover or polish? Go go go!`
    : `🎯 **${paraphrase}** ${suggestion}`;

  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
} END OF FILE paraphrasing_sub.js ---
