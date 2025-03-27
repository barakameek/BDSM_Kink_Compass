// === paraphrasing_dom.js === (Ensure import path is correct)

import { bdsmData } from './data.js'; // Path might need adjustment

// Helper to normalize style names for lookup
function normalizeStyleKey(name) {
    if (!name) return '';
    return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim();
}

// Suggestions tailored to the NEW style list with a fun tone
const domStyleSuggestions = {
  dominant: {
    1: { paraphrase: "🌱 Testing the Leader's waters?", suggestion: "Take charge of one tiny decision today! Feel the spark! 😊" },
    2: { paraphrase: "🧭 Charting your Dominant course?", suggestion: "Practice giving one clear instruction or setting one boundary! Speak up! 💬" },
    3: { paraphrase: "🔥 Igniting your inner Leader?", suggestion: "Confidently lead a short scene or take control more assertively! Feel the power! 🎉" },
    4: { paraphrase: "✨ Shining with Authority!", suggestion: "Lead a more complex scene or proactively manage the dynamic's flow! Own it! 🌟" },
    5: { paraphrase: "👑 Master of your Domain!", suggestion: "Reflect on your unique command style. How can you elevate your reign further? 🔥" }
  },
  assertive: {
    1: { paraphrase: "🗣️ Finding your voice?", suggestion: "Clearly state one preference or boundary today, even if it feels bold! 😊" },
    2: { paraphrase: "💪 Flexing those Assertive muscles?", suggestion: "Practice initiating one action or conversation directly! No hinting! 💬" },
    3: { paraphrase: "✨ Standing tall and clear?", suggestion: "Confidently communicate a complex desire or navigate a boundary discussion! 🎉" },
    4: { paraphrase: "🌟 Shining with Confidence!", suggestion: "Lead interactions with clear, direct communication as your default! Impressive! 🌟" },
    5: { paraphrase: "💖 Master of Clear Communication!", suggestion: "Your assertiveness creates safety and clarity. Reflect on its power! 💖" }
  },
  nurturer: {
    1: { paraphrase: "🧸 Offering a gentle hug (metaphorically!)?", suggestion: "Give one piece of genuine encouragement or validation today! Warm fuzzies! 😊" },
    2: { paraphrase: "🌸 Cultivating your caring side?", suggestion: "Practice active listening or offer comfort during a vulnerable moment! Be present! 💬" },
    3: { paraphrase: "💖 Becoming a safe harbor?", suggestion: "Combine consistent emotional support with patient guidance! You're a rock! 🎉" },
    4: { paraphrase: "✨ Shining with warmth and patience!", suggestion: "Anticipate an emotional need or guide through a challenge with deep empathy! 🌟" },
    5: { paraphrase: "🌟 The Heart of Compassion!", suggestion: "Your nurturing presence creates profound safety. Reflect on the depth of your care! 💖" }
  },
  strict: {
    1: { paraphrase: "📏 Drawing the first line?", suggestion: "Define one simple rule clearly. Explain the 'why' gently! 😊" },
    2: { paraphrase: "🧐 Practicing consistency?", suggestion: "Enforce one rule calmly and consistently today, even if it feels a bit stern! 💬" },
    3: { paraphrase: "⚖️ Balancing rules and fairness?", suggestion: "Implement a clear consequence for a minor infraction, focusing on the lesson! 🎉" },
    4: { paraphrase: "✨ Shining with firm guidance!", suggestion: "Maintain high standards consistently or deliver necessary discipline fairly! Structure! 🌟" },
    5: { paraphrase: "🔥 Master of Order!", suggestion: "Your structure creates clarity and respect. Reflect on the balance of strictness and purpose! 🔥" }
  },
  master: { // Shared traits, slightly different flavor maybe
    1: { paraphrase: "🏛️ Laying the Master's foundation?", suggestion: "Set one clear expectation for behavior or service. Convey it with quiet authority. 😊" },
    2: { paraphrase: "🏰 Building your domain?", suggestion: "Practice projecting more presence or require adherence to a small protocol! Consistency! 💬" },
    3: { paraphrase: "⚜️ Establishing your rule?", suggestion: "Implement a clear set of standards or command attention non-verbally! Feel your power! 🎉" },
    4: { paraphrase: "✨ Shining with undeniable authority!", suggestion: "Demand excellence according to your high standards or command the room with presence alone! 🌟" },
    5: { paraphrase: "👑 Embodying Mastery!", suggestion: "Develop a unique ritual reinforcing your status. Lead with unwavering command! 🔥" }
  },
  mistress: { // Shared traits, slightly different flavor maybe
    1: { paraphrase: "🌹 Planting the seeds of your reign?", suggestion: "Define one expectation with elegant clarity. Let your presence be felt. 😊" },
    2: { paraphrase: "💎 Polishing your authority?", suggestion: "Practice commanding attention subtly or require a specific act of devotion! ✨" },
    3: { paraphrase: "👠 Stepping into your power?", suggestion: "Implement clear protocols or expect high standards with graceful firmness! Feel divine! 🎉" },
    4: { paraphrase: "✨ Shining with captivating command!", suggestion: "Demand excellence and adoration or hold attention effortlessly with your regal aura! 🌟" },
    5: { paraphrase: "👑 Embodying the Goddess!", suggestion: "Develop a signature style of command. Rule with elegance and absolute authority! 🔥" }
  },
  daddy: {
    1: { paraphrase: "👨‍👧‍👦 Testing the 'Daddy Knows Best' waters?", suggestion: "Offer one piece of protective advice or set one simple, caring rule! 😊" },
    2: { paraphrase: "🧸 Giving warm bear hugs (and rules!)?", suggestion: "Practice balancing affectionate praise with a firm boundary! Find the blend! 💬" },
    3: { paraphrase: "💪 Becoming their rock?", suggestion: "Provide strong guidance through a challenge or enforce a safety rule with loving authority! 🎉" },
    4: { paraphrase: "✨ Shining as the perfect Daddy!", suggestion: "Master the art of affectionate authority or provide unwavering protection! You're their hero! 🌟" },
    5: { paraphrase: "💖 The Ultimate Protector & Guide!", suggestion: "Your blend of care and command is magical! Reflect on the deep trust you inspire! 💖" }
  },
  mommy: {
    1: { paraphrase: "🤱 Offering a comforting presence?", suggestion: "Soothe a worry with kind words or set one gentle routine (like hydration reminder!). 😊" },
    2: { paraphrase: "🌸 Nurturing with gentle guidance?", suggestion: "Practice 'kissing it better' emotionally or explain a rule with patience and love! 💬" },
    3: { paraphrase: "💖 Creating a loving nest?", suggestion: "Combine consistent nurturing comfort with gentle discipline focused on learning! You're amazing! 🎉" },
    4: { paraphrase: "✨ Shining with maternal warmth!", suggestion: "Anticipate comfort needs or guide through mistakes with deep empathy and patience! 🌟" },
    5: { paraphrase: "🌟 The Heart of the Home!", suggestion: "Your intuitive care creates profound safety. Reflect on the beauty of your loving guidance! 💖" }
  },
  owner: {
    1: { paraphrase: "🏷️ Claiming your property (gently!)?", suggestion: "Express possessiveness in one small, clear way (a 'mine' gesture?) or begin one tiny training task! 😊" },
    2: { paraphrase: "🐾 Practicing your 'Owner' voice?", suggestion: "Implement one simple command consistently or reward a desired behavior clearly! Good human! 😉" },
    3: { paraphrase: "🦴 Shaping desired behavior?", suggestion: "Combine clear possessiveness with consistent behavioral training! Feel the connection! 🎉" },
    4: { paraphrase: "✨ Shining as the clear Owner!", suggestion: "Confidently display ownership or implement a more complex training routine! Impressive control! 🌟" },
    5: { paraphrase: "💖 Master & Commander (of Cuteness!)", suggestion: "Your guidance shapes perfection! Reflect on the deep bond ownership and training brings! 🔥" }
  },
  rigger: {
    1: { paraphrase: "🧶 Learning the ropes?", suggestion: "Master one simple, safe knot today! Celebrate the small successes! 😊" },
    2: { paraphrase: "🕸️ Weaving simple patterns?", suggestion: "Practice a basic tie focusing on neatness or explore rope's aesthetic potential! 💬" },
    3: { paraphrase: "✨ Becoming a rope artist?", suggestion: "Combine technical skill with aesthetic vision in a more complex tie! Admire your work! 🎉" },
    4: { paraphrase: "🎨 Sculpting with rope!", suggestion: "Challenge yourself with intricate patterns or beginner suspension (safely!)! Beauty in bondage! 🌟" },
    5: { paraphrase: "💖 Rope Maestro!", suggestion: "Invent a signature tie or flawlessly execute complex suspension! Your skill is breathtaking! 🔥" }
  },
  sadist: {
    1: { paraphrase: "⚡️ Sparking interest in sensation?", suggestion: "Deliver one type of sensation *very* cautiously, focusing on safety and reaction! Read the room! 😊" },
    2: { paraphrase: "🌡️ Calibrating the experience?", suggestion: "Practice varying intensity smoothly or focus intently on reading subtle cues! Precision! 💬" },
    3: { paraphrase: "🔥 Conducting the symphony of senses?", suggestion: "Combine different sensations creatively or play with the psychological aspect! Feel the energy! 🎉" },
    4: { paraphrase: "✨ Master of intense artistry!", suggestion: "Orchestrate a scene with rising complexity or derive deep pleasure from their reactions! Control! 🌟" },
    5: { paraphrase: "🖤 The Dark Artist!", suggestion: "Design a scene pushing sensory and psychological limits (safely!). Revel in the beautiful darkness! 🔥" }
  },
  hunter: {
    1: { paraphrase: "🌲 Tracking your prey (playfully!)?", suggestion: "Initiate a short, fun chase or practice 'stalking' with clear playful intent! Feel the instinct! 😊" },
    2: { paraphrase: "🏹 Honing your hunting skills?", suggestion: "Extend the chase or rely more on instinct than planning in a pursuit scenario! Trust your gut! 💬" },
    3: { paraphrase: "🐺 Embracing the thrill of the hunt?", suggestion: "Combine strategic pursuit with bursts of primal energy! The capture is exhilarating! 🎉" },
    4: { paraphrase: "✨ Shining with primal power!", suggestion: "Lead a scene driven by instinct or revel in the adrenaline of a successful 'hunt'! Feel alive! 🌟" },
    5: { paraphrase: "🔥 Apex Predator!", suggestion: "Effortlessly blend instinct, strategy, and power! Reflect on the primal energy you command! 🔥" }
  },
  trainer: {
    1: { paraphrase: "🏋️‍♀️ Starting basic training?", suggestion: "Define one clear skill to practice and guide your partner through it patiently! Go team! 😊" },
    2: { paraphrase: "📈 Charting progress?", suggestion: "Implement a simple structured exercise or give specific, constructive feedback! Improvement! 💬" },
    3: { paraphrase: "🏆 Building skills together?", suggestion: "Combine clear methodology with focused skill development! Celebrate milestones! 🎉" },
    4: { paraphrase: "✨ Shining as an expert coach!", suggestion: "Design a complex training program or expertly diagnose areas for improvement! You rock! 🌟" },
    5: { paraphrase: "🥇 Master Trainer!", suggestion: "Your methods create excellence! Reflect on the satisfaction of cultivating potential! 🔥" }
  },
  puppeteer: {
    1: { paraphrase: "🧵 Pulling the first string?", suggestion: "Give one simple, precise command for movement or speech! Feel the control! 😊" },
    2: { paraphrase: "🎭 Directing the performance?", suggestion: "Practice controlling finer movements or stringing together a short sequence of commands! 💬" },
    3: { paraphrase: "✨ Bringing the puppet to life?", suggestion: "Combine precise control with the objectifying gaze! Create your masterpiece! 🎉" },
    4: { paraphrase: "🌟 Master of Manipulation!", suggestion: "Control complex actions or nuances of speech flawlessly! Your puppet dances perfectly! 🌟" },
    5: { paraphrase: "💖 The Ultimate Puppeteer!", suggestion: "Reflect on the unique power and artistry of total control. Your will is their reality! 🔥" }
  },
  protector: {
    1: { paraphrase: "🛡️ Shield at the ready?", suggestion: "Consciously scan for one potential 'hazard' (even minor) and address it proactively! Safety first! 😊" },
    2: { paraphrase: " watchful eye?", suggestion: "Practice heightened awareness in a scene or verbally reassure your partner of their safety! 💬" },
    3: { paraphrase: "💪 Becoming their steadfast guardian?", suggestion: "Combine vigilance with a clear readiness to defend boundaries! Stand strong! 🎉" },
    4: { paraphrase: "✨ Shining as the ultimate shield!", suggestion: "Anticipate potential issues instinctively or neutralize a 'threat' decisively! You've got this! 🌟" },
    5: { paraphrase: "💖 Unbreakable Protector!", suggestion: "Your presence *is* safety. Reflect on the deep trust your protective nature inspires! 🔥" }
  },
  disciplinarian: { // Focus is correction
    1: { paraphrase: "👨‍⚖️ Learning the rules of order?", suggestion: "Deliver one pre-agreed, mild consequence calmly and fairly. Focus on the 'why'. 😊" },
    2: { paraphrase: "⚖️ Balancing justice and correction?", suggestion: "Practice delivering a consequence with calm detachment, even if it feels difficult! 💬" },
    3: { paraphrase: "🔥 Forging behavior with firm guidance?", suggestion: "Combine consistent consequence delivery with clear explanations! It's about growth! 🎉" },
    4: { paraphrase: "✨ Master of effective correction!", suggestion: "Deliver discipline precisely and objectively or design consequences that perfectly fit the 'crime'! 🌟" },
    5: { paraphrase: "💯 The Ultimate Disciplinarian!", suggestion: "Your corrections are fair, effective, and purposeful. Reflect on the structure you provide! 🔥" }
  },
  caretaker: {
    1: { paraphrase: "🩹 Applying the first band-aid?", suggestion: "Check on one practical need today (hydration? temperature?) or offer simple emotional comfort. 😊" },
    2: { paraphrase: "❤️‍🩹 Expanding your care toolkit?", suggestion: "Practice implementing one routine for well-being or anticipate a comfort need! Thoughtful! 💬" },
    3: { paraphrase: "🩺 Providing holistic support?", suggestion: "Combine attention to physical needs with emotional check-ins! Total care! 🎉" },
    4: { paraphrase: "✨ Shining as the ultimate caretaker!", suggestion: "Proactively manage multiple aspects of well-being or implement safety rules seamlessly! You're essential! 🌟" },
    5: { paraphrase: "💖 Guardian of Health and Happiness!", suggestion: "Your intuitive, comprehensive care is amazing! Reflect on the deep well-being you foster! 🔥" }
  },
  sir: { // Formal, respectful authority
    1: { paraphrase: "🎩 Donning the mantle of 'Sir'?", suggestion: "Practice maintaining a formal, respectful tone during one interaction! Poise! 😊" },
    2: { paraphrase: "🧐 Expecting proper address?", suggestion: "Clearly (but politely) state your expectation for being addressed as 'Sir' or receiving a specific service! 💬" },
    3: { paraphrase: "✨ Embodying dignified command?", suggestion: "Combine formal demeanor with clear expectations for service and respect! Authority with class! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet authority!", suggestion: "Command respect through calm formality or maintain high standards for etiquette effortlessly! 🌟" },
    5: { paraphrase: "💖 The Epitome of Respectful Power!", suggestion: "Your demeanor commands respect naturally. Reflect on the unique dynamic this creates! 🔥" }
  },
  goddess: {
    1: { paraphrase: "💫 Feeling a spark of the divine?", suggestion: "Accept one small act of adoration gracefully! You are worthy! 😊" },
    2: { paraphrase: "✨ Beginning to radiate power?", suggestion: "Practice issuing a command with quiet, effortless confidence! Let them worship! 💬" },
    3: { paraphrase: "👑 Ascending your throne?", suggestion: "Combine seeking adoration with effortless command! Revel in your divine power! 🎉" },
    4: { paraphrase: "🌟 Shining like a true Goddess!", suggestion: "Inspire worship through your mere presence or command reality with a simple word! Breathtaking! 🌟" },
    5: { paraphrase: "💖 Embodiment of Divinity!", suggestion: "Your power is innate, your command absolute. Reflect on the reverence you inspire! 🔥" }
  },
  commander: {
    1: { paraphrase: "🗺️ Plotting the first move?", suggestion: "Give one clear, simple order for a specific task! Lead the way! 😊" },
    2: { paraphrase: "🎯 Taking aim at the objective?", suggestion: "Practice making a quick, decisive choice in a dynamic situation! Trust your judgment! 💬" },
    3: { paraphrase: "🎖️ Leading the troops effectively?", suggestion: "Combine strategic direction with confident decisiveness! Mission accomplished! 🎉" },
    4: { paraphrase: "✨ Shining as a master strategist!", suggestion: "Direct a complex scene with flawless orders or make critical decisions instantly! Impressive! 🌟" },
    5: { paraphrase: "🔥 The Ultimate Commander!", suggestion: "Your command is absolute, your strategy impeccable! Reflect on the power of your decisive leadership! 🔥" }
  }
};


export function getStyleBreakdown(styleName, traits) {
  const styleKey = normalizeStyleKey(styleName);
  const styleData = domStyleSuggestions[styleKey];

  if (!styleData) {
    return {
      strengths: "You're forging your own unique dominant path! Keep exploring, Commander! 💪",
      improvements: "Select a defined style to see personalized tips for glorious growth! 🔍"
    };
  }

  const roleData = bdsmData.dominant;
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);

  let traitScores = [];
  if (styleObj && styleObj.traits) {
      traitScores = styleObj.traits.map(t => parseInt(traits[t.name]) || 3);
  }
   // Add core traits to the average score calculation
   if(traits.authority) traitScores.push(parseInt(traits.authority) || 3);
   if(traits.care) traitScores.push(parseInt(traits.care) || 3);

  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default if no traits to average

  const scoreIndex = Math.max(1, Math.min(5, avgScore)); // Ensure score is 1-5
  const levelData = styleData[scoreIndex];

   if(!levelData) {
      console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`);
      return {
          strengths: `Leading the way as a ${styleName}! 🔥`,
          improvements: `Continue sharpening your unique ${styleName} command! 💪`
      };
  }

  const { paraphrase, suggestion } = levelData;

  const isStrength = scoreIndex >= 4;

  const strengthsText = isStrength
    ? `✨ **${paraphrase}** ${suggestion}`
    : `🌱 You're cultivating powerful skills in ${styleName}! Keep honing your command, mighty one!`;

  const improvementsText = isStrength
    ? `🚀 Keep expanding the horizons of your ${styleName} style! What new challenges can you conquer? Charge! `
    : `🎯 **${paraphrase}** ${suggestion}`;

  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
}
// --- END OF FILE paraphrasing_dom.js ---
