// === paraphrasing_sub.js === (FULLY POPULATED - Needs Verification)

import { bdsmData } from './data.js';

// === In BOTH paraphrasing_sub.js AND paraphrasing_dom.js ===

function normalizeStyleKey(name) {
    if (!name) return '';
    // 1. Convert to lowercase
    // 2. Remove emojis (using a broader Unicode range)
    // 3. Remove anything in parentheses (like P/E)
    // 4. Trim whitespace
    const cleanedName = name
        .toLowerCase()
        // Remove common emojis and symbols - adjust range if needed
        .replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]+)/gu, '')
        .replace(/\(.*?\)/g, '') // Remove content in parentheses
        .replace(/ \/ /g, '/')   // Keep slashes if intended (like switch styles)
        .trim();
    // console.log(`Normalized "${name}" to "${cleanedName}"`); // Optional: Add log for debugging normalization
    return cleanedName;
}

// ... rest of the file (domStyleSuggestions or subStyleSuggestions, getStyleBreakdown) ...
const subStyleSuggestions = {
  'classic submissive': {
    1: { paraphrase: "🌱 Just beginning your journey of yielding?", suggestion: "Practice one small act of trust or service today. How did it feel? 😊" },
    2: { paraphrase: "🌸 Finding comfort in following?", suggestion: "Focus on clear communication about your comfort levels. Try a slightly more involved task. 💬" },
    3: { paraphrase: "✨ Enjoying the structure and connection?", suggestion: "Anticipate one of your partner's needs or dedicate extra care to your presentation. Feel the glow! 😊" },
    4: { paraphrase: "💖 Thriving in supportive submission!", suggestion: "Offer proactive service or express your trust more openly. You're radiant! 💅" },
    5: { paraphrase: "👑 Gracefully devoted and responsive!", suggestion: "Reflect on the nuances of your submission. How can you deepen the connection? 💖" }
  },
  brat: {
    1: { paraphrase: "😈 Thinking about poking the bear?", suggestion: "Try a tiny, harmless tease or question. See how the dynamic sparks! 😉" },
    2: { paraphrase: "😜 Adding a little spice?", suggestion: "Find a clever loophole or offer some witty backtalk. Remember to gauge reactions! 😏" },
    3: { paraphrase: "🔥 Loving the playful power struggle!", suggestion: "Initiate a fun challenge or push a soft limit playfully. Enjoy the consequences! 🎤" },
    4: { paraphrase: "💥 Master of delightful defiance!", suggestion: "Get creative with your rule-bending! Can you earn a specific 'punishment'? High five! ✋" },
    5: { paraphrase: "👑 Supreme Ruler of Sass!", suggestion: "Orchestrate a scenario where your brattiness shines! Revel in the fun! 🎊" }
  },
  slave: {
    1: { paraphrase: "🕯️ Exploring the path of deep devotion?", suggestion: "Focus on a single moment of intentional surrender or quiet service. 🙏" },
    2: { paraphrase: "🔗 Feeling the pull of commitment?", suggestion: "Practice yielding control in a slightly bigger way. Communicate your feelings. 💬" },
    3: { paraphrase: "🌹 Blooming in dedicated service?", suggestion: "Create or practice a small ritual of devotion. Find peace in stillness. 🎉" },
    4: { paraphrase: "💎 Shining with unwavering loyalty!", suggestion: "Anticipate a need purely as an act of devotion. Let your purpose guide you. ✨" },
    5: { paraphrase: "❤️ Embodying absolute devotion!", suggestion: "Reflect on the profound connection surrender brings. Deepen your unique expression. 🌟" }
   },
   pet: {
    1: { paraphrase: "🐾 Tiny paws exploring petspace?", suggestion: "Try one non-verbal purr or nudge for attention! Feel the cute! 😊" },
    2: { paraphrase: "💖 Learning the ways of a cherished pet?", suggestion: "Practice asking for cuddles more openly or use more happy sounds! ✨" },
    3: { paraphrase: "🧸 Snuggling into your pet persona?", suggestion: "Combine seeking affection with playful wiggles or nuzzles! Enjoy the warmth! 🎶" },
    4: { paraphrase: "🌟 Shining as a loyal companion!", suggestion: "Anticipate your Owner's mood & offer comfort non-verbally. Earn those head pats! 🍪" },
    5: { paraphrase: "👑 A truly expressive and adored Pet!", suggestion: "Develop unique ways to 'talk' without words! Revel in the intuitive bond! 🎀" }
  },
  little: {
    1: { paraphrase: "🧸 Dipping toes into littlespace?", suggestion: "Allow yourself one moment of pure play or accept guidance with a smile. Be kind to you! 😊" },
    2: { paraphrase: "🖍️ Feeling playful and needing care?", suggestion: "Express a 'little' feeling (excitement/shyness) or follow a simple rule happily. ✨" },
    3: { paraphrase: "🍭 Sweetly settling into your little side?", suggestion: "Engage in a favorite childhood game or embrace the comfort of having rules. Find the joy! 🎉" },
    4: { paraphrase: "🎀 Shining bright as a cared-for Little!", suggestion: "Express vulnerability trustingly or delight in pleasing your Caregiver. Feel the safety! 🌟" },
    5: { paraphrase: "💖 Fully embracing your innocent heart!", suggestion: "Co-create a special 'little' ritual (like story time!). Cherish the unique bond! 🦄" }
  },
  puppy: {
    1: { paraphrase: "🐶 New pup, learning the ropes?", suggestion: "Show eager tail wags (real or imagined!) for one command today! Good start! 😊" },
    2: { paraphrase: "🦴 Getting excited about training?", suggestion: "Practice one command with extra enthusiasm! Remember, treats help! 😉" },
    3: { paraphrase: "🐕‍🦺 Full of playful energy?", suggestion: "Initiate a game of fetch or show off a learned trick! Feel the zoomies! 🥎" },
    4: { paraphrase: "🏆 Eager to please and play hard!", suggestion: "Combine boundless energy with focused trainability! Amaze your Owner/Handler! ✨" },
    5: { paraphrase: "🌟 The Ultimate Good Pup!", suggestion: "Anticipate commands with joyful energy! Your enthusiasm is infectious! 💖" }
  },
  kitten: {
    1: { paraphrase: "🐾 Curious kitten peeking out?", suggestion: "Explore one new object with cautious curiosity (a gentle bat-bat!). Purr when praised! 😸" },
    2: { paraphrase: "🧶 Finding your feline grace?", suggestion: "Try a playful pounce or practice moving with a bit more sleekness! ✨" },
    3: { paraphrase: "🐈‍⬛ Sleek, curious, and affectionate?", suggestion: "Combine curiosity with poise in a playful scenario! Land on your feet! 🎉" },
    4: { paraphrase: "✨ Shining with kitten charm!", suggestion: "Use your grace and curiosity to investigate something new! Celebrate with a happy mew! 🌟" },
    5: { paraphrase: "👑 Purrfectly poised and playful!", suggestion: "Embrace your inner cat fully! Move with elegance, play with abandon! 💖" }
  },
  princess: {
    1: { paraphrase: "👑 Awaiting your royal treatment?", suggestion: "Allow yourself to be pampered in one small way today! You deserve it! 😊" },
    2: { paraphrase: "💅 Practicing your graceful demands?", suggestion: "Try delegating one small, appropriate task with a charming smile! 😉" },
    3: { paraphrase: "💎 Enjoying being the center of attention?", suggestion: "Revel in being spoiled a bit more or practice your 'royal decree' voice! 🎉" },
    4: { paraphrase: "✨ Shining like royalty!", suggestion: "Combine enjoying pampering with gracefully expecting help! Own your throne! 🌟" },
    5: { paraphrase: "💖 Truly Regal and adored!", suggestion: "Reflect on how being treated like royalty makes you feel. Deepen this majestic dynamic! 👑" }
  },
  'rope bunny': {
    1: { paraphrase: "🐇 Curious about the ties that bind?", suggestion: "Try one simple, comfy tie (like wrists). Focus on safety & communication! 😊" },
    2: { paraphrase: "🥨 Finding beauty in restriction?", suggestion: "Practice patience during a slightly longer tie or explore a new simple knot! 💬" },
    3: { paraphrase: "🎀 Enjoying the aesthetics of bondage?", suggestion: "Experiment with a slightly more decorative tie! Admire the patterns! 🎉" },
    4: { paraphrase: "✨ Becoming living rope art!", suggestion: "Challenge yourself with a more complex tie or hold a pose patiently! Feel the sensations! 🌟" },
    5: { paraphrase: "💖 Masterpiece in motion (or stillness)!", suggestion: "Collaborate on designing a complex tie or explore beginner suspension safely! Celebrate rope! 🎨" }
  },
  masochist: {
    1: { paraphrase: "⚡️ Cautiously exploring sensation?", suggestion: "Identify one sensation you're curious about. Try it *very* lightly with clear talk! 😊" },
    2: { paraphrase: "🌡️ Finding the intriguing edge?", suggestion: "Experiment with slightly more intensity or duration. Listen to your body's story! 💬" },
    3: { paraphrase: "🔥 Enjoying the release through intensity?", suggestion: "Combine different sensations or work on riding a specific wave of intensity. Feel the focus! 🎉" },
    4: { paraphrase: "💥 Thriving on intense feelings!", suggestion: "Explore more complex scenes or push known limits (safely!). Analyze the 'why'! 🌟" },
    5: { paraphrase: "🚀 Sensation Connoisseur!", suggestion: "Design a scene focused on achieving a specific mental/physical state through sensation. Revel in it! 🔥" }
  },
  prey: {
    1: { paraphrase: "🐿️ Enjoying the anticipation of the chase?", suggestion: "Try a *very* playful 'hide and seek' moment. Feel the excitement build! 😊" },
    2: { paraphrase: "🐇 Finding thrill in playful pursuit?", suggestion: "Engage in a short, fun chase. Discuss comfort with the 'fear' edge! 💬" },
    3: { paraphrase: "🦊 Loving the game of cat and mouse?", suggestion: "Make the chase a little longer or the 'capture' more dramatic! It's exhilarating! 🎉" },
    4: { paraphrase: "✨ Reveling in the pursuit dynamic!", suggestion: "Fully embrace the role! Use your wits to 'escape' (or be caught!). Feel the adrenaline! 🌟" },
    5: { paraphrase: "💖 Master of the Chase!", suggestion: "Collaborate on a scene with high stakes (but ultimate safety!). Live for the thrill! 🎭" }
  },
  toy: {
    1: { paraphrase: "🧸 Exploring being a source of pleasure?", suggestion: "Allow yourself to be gently positioned or 'used' for one simple task. How does it feel? 😊" },
    2: { paraphrase: "🧩 Learning to relax into being controlled?", suggestion: "Practice relaxing while being posed or respond to one simple control command readily. 💬" },
    3: { paraphrase: "🎁 Finding fun in being played with?", suggestion: "Enjoy being the center of attention as a pleasure object or respond readily to being moved! 🎉" },
    4: { paraphrase: "✨ Shining as a prized, responsive possession!", suggestion: "Embrace being objectified (safely!) or show off your delightful responsiveness to control! 🌟" },
    5: { paraphrase: "💖 The Perfect Plaything!", suggestion: "Anticipate how your owner wants to 'play' and respond flawlessly! Revel in being their cherished toy! 💖" }
  },
  doll: {
    1: { paraphrase: "🎀 Curious about curated perfection?", suggestion: "Try holding one pose gracefully for a minute or add one 'doll-like' detail to your look! 😊" },
    2: { paraphrase: "💄 Enjoying the aesthetic transformation?", suggestion: "Practice stillness during posing or spend extra time on a doll-like aesthetic element! ✨" },
    3: { paraphrase: "💖 Becoming a living work of art?", suggestion: "Combine graceful stillness with a perfectly curated look! Feel beautiful and admired! 🎉" },
    4: { paraphrase: "✨ Shining as a perfect, passive Doll!", suggestion: "Hold complex poses passively or fully embrace the detailed aesthetic! You're captivating! 🌟" },
    5: { paraphrase: "💎 Flawless Doll Perfection!", suggestion: "Embody complete stillness and curated beauty. Reflect on the unique surrender this brings! 💖" }
  },
  bunny: {
    1: { paraphrase: "🐇 Peeking out with a gentle heart?", suggestion: "Offer one small, gentle gesture of affection or practice being still when approached softly. 😊" },
    2: { paraphrase: "🥕 Learning to trust gentle hands?", suggestion: "Try expressing shyness non-verbally (like averting eyes) or seek gentle reassurance! ✨" },
    3: { paraphrase: "🌸 Soft, sweet, and easily startled?", suggestion: "Embrace your gentle nature! Practice receiving soft touches or quiet praise calmly. 🎉" },
    4: { paraphrase: "✨ Thriving in a calm, safe environment!", suggestion: "Show your trust through allowing closeness despite shyness! Your quiet presence is lovely! 🌟" },
    5: { paraphrase: "💖 Perfectly precious and cherished Bunny!", suggestion: "Find joy in your gentle, skittish nature. Communicate your need for softness clearly! 💖" }
  },
  servant: {
    1: { paraphrase: "🧹 Learning the satisfaction of duty?", suggestion: "Focus completely on completing one small task perfectly! Feel the accomplishment! 😊" },
    2: { paraphrase: "🧼 Developing an eye for needs?", suggestion: "Try to anticipate one small need today (like refilling a drink!). How did it feel? ✨" },
    3: { paraphrase: "✨ Becoming an indispensable aide?", suggestion: "Combine focused task completion with anticipating needs! You're so helpful! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet competence and foresight!", suggestion: "Proactively manage several tasks or anticipate a non-obvious need! Impressive! 🌟" },
    5: { paraphrase: "💖 The Heart of Dedicated Service!", suggestion: "Reflect on the deep satisfaction of seamless, anticipatory service. Your dedication is amazing! 💖" }
  },
  playmate: {
    1: { paraphrase: "🎲 Dipping a toe into playful dynamics?", suggestion: "Join in one simple game with enthusiasm, even if you feel silly! Fun first! 😊" },
    2: { paraphrase: "🤸‍♀️ Learning to laugh through the game?", suggestion: "Try being a *really* good sport about a rule or a 'loss'! Laughter is key! ✨" },
    3: { paraphrase: "🎉 Bringing the fun and adventure?", suggestion: "Suggest a playful activity or embrace a silly rule with gusto! You're the life of the party! 🎉" },
    4: { paraphrase: "✨ Shining as the perfect partner in play!", suggestion: "Combine boundless enthusiasm with being a great sport! Make every game amazing! 🌟" },
    5: { paraphrase: "💖 Master of Playful Engagement!", suggestion: "Invent a new game or scenario! Your playful spirit makes everything better! 💖" }
  },
  babygirl: {
    1: { paraphrase: "🥺 Exploring charming vulnerability?", suggestion: "Try expressing one small need vulnerably or add a touch of charming coyness! 😊" },
    2: { paraphrase: "💖 Learning the art of sweet allure?", suggestion: "Practice asking for what you want with playful charm or embrace showing your softer side! ✨" },
    3: { paraphrase: "🎀 Sweet, sassy, and needing care?", suggestion: "Combine vulnerability with coquettish teasing! You're irresistible! 🎉" },
    4: { paraphrase: "✨ Shining with enchanting babygirl charm!", suggestion: "Master the art of getting your way with charm or express deep trust through vulnerability! 🌟" },
    5: { paraphrase: "👑 The Ultimate Cherished Babygirl!", suggestion: "Effortlessly blend innocence, charm, and neediness. Reflect on the unique power this dynamic holds! 💖" }
  },
  captive: {
    1: { paraphrase: "⛓️ Testing the waters of 'pretend' struggle?", suggestion: "Try one small, 'token' act of resistance during pretend capture! Feel the drama! 😊" },
    2: { paraphrase: "🎭 Enjoying the roleplay aspect?", suggestion: "Put a little more effort into 'struggling' or express 'defiance' playfully! ✨" },
    3: { paraphrase: "🎬 Getting lost in the narrative?", suggestion: "Combine a convincing struggle performance with underlying acceptance! Enjoy the story! 🎉" },
    4: { paraphrase: "✨ Shining star of the capture scene!", suggestion: "Make the struggle seem *real* (while being safe!) or show subtle hints of enjoying your fate! 🌟" },
    5: { paraphrase: "💖 Master of the Captive Narrative!", suggestion: "Fully embody the role! Find the thrill in the struggle and the bliss in the surrender! 💖" }
  },
  thrall: {
    1: { paraphrase: "🌀 Exploring a deeper mental connection?", suggestion: "Practice focusing solely on your Dom's voice for one minute. Quiet the mind! 😊" },
    2: { paraphrase: "🌬️ Becoming more mentally receptive?", suggestion: "Try accepting one small suggestion without question or deepen your mental focus during connection! ✨" },
    3: { paraphrase: "✨ Deepening the bond of will?", suggestion: "Combine focused attention with openness to suggestion! Feel the flow! 🎉" },
    4: { paraphrase: "💖 Lost in their presence and influence!", suggestion: "Allow yourself to enter a deeper state of focus or act on suggestion readily! Explore the trance! 🌟" },
    5: { paraphrase: "💫 One mind, one will (consensually)!", suggestion: "Reflect on the unique intimacy of deep mental connection and suggestibility. Pure magic! 💖" }
  },
  puppet: {
    1: { paraphrase: "🧵 Learning to follow the strings?", suggestion: "Follow one simple movement command precisely! Feel the external control! 😊" },
    2: { paraphrase: "🧍‍♀️ Practicing responsive passivity?", suggestion: "Try waiting completely still for the next command, resisting the urge to move on your own! ✨" },
    3: { paraphrase: "💃 Dancing beautifully to their tune?", suggestion: "Combine quick responsiveness to commands with deep passivity between them! You're mesmerizing! 🎉" },
    4: { paraphrase: "✨ Shining as the perfectly responsive puppet!", suggestion: "Follow complex sequences of commands flawlessly or embrace complete stillness! 🌟" },
    5: { paraphrase: "💖 Masterpiece of the Puppeteer!", suggestion: "Anticipate the *style* of control desired. Reflect on the surrender of being moved! 💖" }
  },
  maid: {
    1: { paraphrase: "🧹 Just starting your duties?", suggestion: "Perform one cleaning task with extra attention to detail! Sparkle and shine! 😊" },
    2: { paraphrase: "✨ Polishing your service skills?", suggestion: "Wear your designated attire with pride or practice one element of service etiquette! ✨" },
    3: { paraphrase: "🧼 Serving with precision and grace?", suggestion: "Combine meticulous task completion with perfect uniform presentation! Impeccable! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet efficiency and politeness!", suggestion: "Anticipate a cleaning/tidying need or maintain flawless etiquette throughout! 🌟" },
    5: { paraphrase: "💖 The Perfect Domestic Jewel!", suggestion: "Take pride in creating perfect order and serving flawlessly! Your dedication is admirable! 💖" }
  },
  painslut: {
    1: { paraphrase: "🔥 Curious about intense sensations?", suggestion: "Communicate clearly about trying one specific sensation you *want* to explore! Safety first! 😊" },
    2: { paraphrase: "🌶️ Developing a taste for intensity?", suggestion: "Ask for a slightly higher intensity or duration of a sensation you enjoy! Use your words! ✨" },
    3: { paraphrase: "💥 Riding the waves of delightful pain?", suggestion: "Combine actively seeking sensation with showing your endurance (safely)! Feel the power! 🎉" },
    4: { paraphrase: "✨ Thriving on the intense edge!", suggestion: "Clearly ask for challenging sensations or design a scene focused on pushing your limits! 🌟" },
    5: { paraphrase: "💖 Devotee of Exquisite Sensation!", suggestion: "Revel in your desire! Communicate your cravings clearly and celebrate your incredible endurance! 💖" }
   },
   bottom: {
    1: { paraphrase: "⬇️ Exploring the receptive role?", suggestion: "Practice consciously opening yourself to receive one instruction or sensation without resistance. Feel the flow! 😊" },
    2: { paraphrase: "🧘‍♀️ Learning to embrace receiving?", suggestion: "Focus on the *feeling* of the power exchange during one interaction. What does it signify for you? ✨" },
    3: { paraphrase: "✨ Enjoying the dynamic from the bottom?", suggestion: "Combine active receptivity with conscious enjoyment of the power imbalance! It's electric! 🎉" },
    4: { paraphrase: "💖 Shining with receptive strength!", suggestion: "Become highly attuned to your partner's lead or reflect deeply on the fulfillment power exchange brings! 🌟" },
    5: { paraphrase: "🌊 Ocean of Receptivity and Endurance!", suggestion: "Find profound peace and connection in receiving. Your openness is beautiful! 💖" }
   }
};

export function getStyleBreakdown(styleName, traits) {
  if (!styleName || !traits) { console.warn("getStyleBreakdown (sub) called with invalid args:", styleName, traits); return { strengths: "Select a style first!", improvements: "Choose your path to get tips!" }; }
  const styleKey = normalizeStyleKey(styleName);
  const styleData = subStyleSuggestions[styleKey];
  if (!styleData) { console.warn(`No suggestions found for submissive style key: ${styleKey}`); return { strengths: `You're crafting your unique ${styleName} sparkle! Keep exploring. 💕`, improvements: "Continue defining what this style means to you! 😸" }; }
  const roleData = bdsmData.submissive;
  if (!roleData || !roleData.styles) { console.error("bdsmData.submissive or its styles are missing!"); return { strengths: "Error loading style data.", improvements: "Please check data.js." }; }
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  let traitScores = [];
  if (styleObj?.traits) { styleObj.traits.forEach(traitDef => { const score = parseInt(traits[traitDef.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  if (roleData.coreTraits) { roleData.coreTraits.forEach(coreTrait => { const score = parseInt(traits[coreTrait.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];
  if(!levelData) { console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`); if (scoreIndex >= 4) { return { strengths: `You're strongly embodying ${styleName}! ✨ Keep shining!`, improvements: `Explore nuances or teach others your ways! 🚀` }; } else if (scoreIndex <= 2) { return { strengths: `Exploring the foundations of ${styleName}! 🌱`, improvements: `Focus on communication and small steps! 🎯` }; } else { return { strengths: `Developing a balanced ${styleName} approach! 👍`, improvements: `Consider which aspects to lean into! 🤔` }; } }
  const { paraphrase, suggestion } = levelData;
  const isStrength = scoreIndex >= 4;
  const strengthsText = isStrength ? `✨ **${paraphrase}** ${suggestion}` : `🌱 Cultivating skills in ${styleName}! Keep growing!`;
  const improvementsText = isStrength ? `🚀 Explore the depths of ${styleName}! What's next?` : `🎯 **${paraphrase}** ${suggestion}`;
  return { strengths: strengthsText, improvements: improvementsText };
}
