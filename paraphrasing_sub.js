// --- START OF FILE paraphrasing_sub.js ---

import { bdsmData } from './data.js';

// Helper to normalize style names for lookup
function normalizeStyleKey(name) {
    if (!name) return '';
    // Lowercase, remove content in parentheses, normalize slashes, trim
    return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim();
}

// Suggestions tailored to the NEW style list with a fun tone
const subStyleSuggestions = {
  // ... (Previous styles: Submissive, Brat, Slave, Switch, Pet, Little, Puppy, Kitten, Princess, Rope Bunny, Masochist, Prey, Toy) ...
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

  const roleData = bdsmData.submissive;
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);

  let traitScores = [];
  if (styleObj && styleObj.traits) {
      traitScores = styleObj.traits.map(t => parseInt(traits[t.name]) || 3);
  }
  // Optional: Include core traits in average? Decide if this makes sense.
  // traitScores.push(parseInt(traits.obedience) || 3);
  // traitScores.push(parseInt(traits.trust) || 3);

  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default if no specific style traits

  const scoreIndex = Math.max(1, Math.min(5, avgScore)); // Ensure score is 1-5
  const { paraphrase, suggestion } = styleData[scoreIndex];

  const isStrength = scoreIndex >= 4;

  // Use markdown for emphasis
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
}
// --- END OF FILE paraphrasing_sub.js ---
