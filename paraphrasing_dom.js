// === paraphrasing_dom.js === (FULLY POPULATED - Needs Verification)

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

// *** YOU MUST VERIFY/ADJUST these based on trait descriptions in data.js ***
const domStyleSuggestions = {
  'classic dominant': {
    1: { paraphrase: "🌱 Testing the waters of leadership?", suggestion: "Take charge of one tiny decision today! Feel the spark! 😊" },
    2: { paraphrase: "🧭 Charting your Dominant course?", suggestion: "Practice giving one clear instruction or setting one boundary! Speak up! 💬" },
    3: { paraphrase: "🔥 Igniting your inner Leader?", suggestion: "Confidently lead a short scene or take control more assertively! Feel the power! 🎉" },
    4: { paraphrase: "✨ Shining with confident Authority!", suggestion: "Lead a more complex scene or proactively manage the dynamic's flow! Own it! 🌟" },
    5: { paraphrase: "👑 Master of your Domain!", suggestion: "Reflect on your unique command style. How can you elevate your reign further? 🔥" }
  },
  assertive: {
    1: { paraphrase: "🗣️ Finding your clear voice?", suggestion: "Clearly state one preference or boundary today, even if it feels bold! 😊" },
    2: { paraphrase: "💪 Flexing those communication muscles?", suggestion: "Practice initiating one action or conversation directly! No hinting! 💬" },
    3: { paraphrase: "✨ Standing tall with clarity?", suggestion: "Confidently communicate a complex desire or navigate a boundary discussion! 🎉" },
    4: { paraphrase: "🌟 Shining with direct Confidence!", suggestion: "Lead interactions with clear communication as your default! Impressive! 🌟" },
    5: { paraphrase: "💖 Master of Respectful Assertiveness!", suggestion: "Your clarity creates safety. Reflect on the power of directness! 💖" }
  },
  nurturer: {
    1: { paraphrase: "🧸 Offering gentle guidance?", suggestion: "Give one piece of genuine encouragement or validation today! Warm fuzzies! 😊" },
    2: { paraphrase: "🌸 Cultivating your caring command?", suggestion: "Practice active listening or offer comfort during a vulnerable moment! Be present! 💬" },
    3: { paraphrase: "💖 Becoming a supportive leader?", suggestion: "Combine consistent emotional support with patient guidance! You're a rock! 🎉" },
    4: { paraphrase: "✨ Shining with warmth and patient strength!", suggestion: "Anticipate an emotional need or guide through a challenge with deep empathy! 🌟" },
    5: { paraphrase: "🌟 The Heart of Compassionate Dominance!", suggestion: "Your nurturing presence creates profound safety. Reflect on the depth of your care! 💖" }
  },
  strict: {
    1: { paraphrase: "📏 Just drawing the first lines?", suggestion: "Define one simple rule clearly. Explain the 'why' gently! 😊" },
    2: { paraphrase: "🧐 Practicing consistent structure?", suggestion: "Enforce one rule calmly and consistently today, even if it feels a bit stern! 💬" },
    3: { paraphrase: "⚖️ Balancing order and fairness?", suggestion: "Implement a clear consequence for a minor infraction, focusing on the lesson! 🎉" },
    4: { paraphrase: "✨ Shining with firm, reliable guidance!", suggestion: "Maintain high standards consistently or deliver necessary discipline fairly! Structure! 🌟" },
    5: { paraphrase: "🔥 Master of Order and Discipline!", suggestion: "Your structure creates clarity and respect. Reflect on the balance of strictness and purpose! 🔥" }
  },
  master: {
    1: { paraphrase: "🏛️ Laying the foundation of Mastery?", suggestion: "Set one clear expectation for behavior or service. Convey it with quiet authority. 😊" },
    2: { paraphrase: "🏰 Building your domain of influence?", suggestion: "Practice projecting more presence or require adherence to a small protocol! Consistency! 💬" },
    3: { paraphrase: "⚜️ Establishing your respected rule?", suggestion: "Implement a clear set of standards or command attention non-verbally! Feel your power! 🎉" },
    4: { paraphrase: "✨ Shining with undeniable presence!", suggestion: "Demand excellence according to your high standards or command the room with presence alone! 🌟" },
    5: { paraphrase: "👑 Embodying confident Mastery!", suggestion: "Develop a unique ritual reinforcing your status. Lead with unwavering command! 🔥" }
  },
  mistress: {
    1: { paraphrase: "🌹 Planting the seeds of elegant command?", suggestion: "Define one expectation with graceful clarity. Let your presence be felt. 😊" },
    2: { paraphrase: "💎 Polishing your authoritative style?", suggestion: "Practice commanding attention subtly or require a specific act of devotion! ✨" },
    3: { paraphrase: "👠 Stepping confidently into power?", suggestion: "Implement clear protocols or expect high standards with graceful firmness! Feel divine! 🎉" },
    4: { paraphrase: "✨ Shining with captivating authority!", suggestion: "Demand excellence and adoration or hold attention effortlessly with your regal aura! 🌟" },
    5: { paraphrase: "👑 Embodying the Elegant Ruler!", suggestion: "Develop a signature style of command. Rule with grace and absolute authority! 🔥" }
  },
  daddy: {
    1: { paraphrase: "👨‍🏫 Offering protective advice?", suggestion: "Set one simple, caring rule or offer guidance on a small matter! 😊" },
    2: { paraphrase: "🧸 Balancing cuddles and commands?", suggestion: "Practice balancing affectionate praise with a firm boundary! Find the sweet spot! 💬" },
    3: { paraphrase: "💪 Becoming their strong, loving guide?", suggestion: "Provide strong guidance through a challenge or enforce a safety rule with loving authority! 🎉" },
    4: { paraphrase: "✨ Shining as the perfect firm-but-loving Daddy!", suggestion: "Master the art of affectionate authority or provide unwavering protection! You're their hero! 🌟" },
    5: { paraphrase: "💖 The Ultimate Protector & Guide!", suggestion: "Your blend of care and command is powerful! Reflect on the deep trust you inspire! 💖" }
  },
  mommy: {
    1: { paraphrase: "🤱 Offering comforting care?", suggestion: "Soothe a worry with kind words or set one gentle routine (like hydration reminder!). 😊" },
    2: { paraphrase: "🌸 Nurturing with gentle structure?", suggestion: "Practice 'kissing it better' emotionally or explain a rule with patience and love! 💬" },
    3: { paraphrase: "💖 Creating a warm, safe nest?", suggestion: "Combine consistent nurturing comfort with gentle discipline focused on learning! You're amazing! 🎉" },
    4: { paraphrase: "✨ Shining with maternal warmth and guidance!", suggestion: "Anticipate comfort needs or guide through mistakes with deep empathy and patience! 🌟" },
    5: { paraphrase: "🌟 The Heart of the Loving Home!", suggestion: "Your intuitive care creates profound safety. Reflect on the beauty of your loving guidance! 💖" }
  },
  owner: {
    1: { paraphrase: "🏷️ Gently claiming what's yours?", suggestion: "Express possessiveness in one small, clear way (a 'mine' gesture?) or begin one tiny training task! 😊" },
    2: { paraphrase: "🐾 Practicing clear commands and rewards?", suggestion: "Implement one simple command consistently or reward a desired behavior clearly! Good human! 😉" },
    3: { paraphrase: "🦴 Shaping behavior with care?", suggestion: "Combine clear possessiveness with consistent behavioral training! Feel the connection! 🎉" },
    4: { paraphrase: "✨ Shining as the clear, responsible Owner!", suggestion: "Confidently display ownership or implement a more complex training routine! Impressive control! 🌟" },
    5: { paraphrase: "💖 Master & Commander (of Cuteness/Duty)!", suggestion: "Your guidance shapes perfection! Reflect on the deep bond ownership and training brings! 🔥" }
  },
  rigger: {
    1: { paraphrase: "🧶 Learning the basic knots?", suggestion: "Master one simple, safe knot today! Focus on function over form for now! 😊" },
    2: { paraphrase: "🕸️ Weaving simple, neat patterns?", suggestion: "Practice a basic tie focusing on aesthetics or explore different rope textures! 💬" },
    3: { paraphrase: "✨ Becoming a precise rope artist?", suggestion: "Combine technical skill with aesthetic vision in a more complex tie! Admire your work! 🎉" },
    4: { paraphrase: "🎨 Sculpting elegantly with rope!", suggestion: "Challenge yourself with intricate patterns or beginner suspension (safely!)! Beauty in bondage! 🌟" },
    5: { paraphrase: "💖 Rope Maestro!", suggestion: "Invent a signature tie or flawlessly execute complex suspension! Your skill is breathtaking! 🔥" }
  },
  sadist: {
    1: { paraphrase: "⚡️ Exploring the edge of sensation?", suggestion: "Deliver one type of sensation *very* cautiously, focusing on safety and reaction! Read the room! 😊" },
    2: { paraphrase: "🌡️ Learning to calibrate intensity?", suggestion: "Practice varying intensity smoothly or focus intently on reading subtle cues! Precision! 💬" },
    3: { paraphrase: "🔥 Conducting a symphony of feeling?", suggestion: "Combine different sensations creatively or play with the psychological aspect! Feel the energy! 🎉" },
    4: { paraphrase: "✨ Master of intense artistry!", suggestion: "Orchestrate a scene with rising complexity or derive deep pleasure from their reactions! Control! 🌟" },
    5: { paraphrase: "🖤 The Dark Artist of Sensation!", suggestion: "Design a scene pushing sensory and psychological limits (safely!). Revel in the beautiful darkness! 🔥" }
  },
  hunter: {
    1: { paraphrase: "🌲 Feeling the instinct to pursue?", suggestion: "Initiate a short, fun chase or practice 'stalking' with clear playful intent! Feel the instinct! 😊" },
    2: { paraphrase: "🏹 Honing your tracking skills?", suggestion: "Extend the chase or rely more on instinct than planning in a pursuit scenario! Trust your gut! 💬" },
    3: { paraphrase: "🐺 Embracing the primal thrill?", suggestion: "Combine strategic pursuit with bursts of primal energy! The capture is exhilarating! 🎉" },
    4: { paraphrase: "✨ Shining with predatory grace!", suggestion: "Lead a scene driven by instinct or revel in the adrenaline of a successful 'hunt'! Feel alive! 🌟" },
    5: { paraphrase: "🔥 Apex Predator of the Scene!", suggestion: "Effortlessly blend instinct, strategy, and power! Reflect on the primal energy you command! 🔥" }
  },
  trainer: {
    1: { paraphrase: "🏋️‍♀️ Setting the first training goal?", suggestion: "Define one clear skill to practice and guide your partner through it patiently! Go team! 😊" },
    2: { paraphrase: "📈 Charting progress and giving feedback?", suggestion: "Implement a simple structured exercise or give specific, constructive feedback! Improvement! 💬" },
    3: { paraphrase: "🏆 Building skills methodically?", suggestion: "Combine clear methodology with focused skill development! Celebrate milestones! 🎉" },
    4: { paraphrase: "✨ Shining as an expert coach!", suggestion: "Design a complex training program or expertly diagnose areas for improvement! You rock! 🌟" },
    5: { paraphrase: "🥇 Master Trainer of Potential!", suggestion: "Your methods create excellence! Reflect on the satisfaction of cultivating skills! 🔥" }
  },
  puppeteer: {
    1: { paraphrase: "🧵 Gently pulling the strings?", suggestion: "Give one simple, precise command for movement or speech! Feel the control! 😊" },
    2: { paraphrase: "🎭 Learning to direct the performance?", suggestion: "Practice controlling finer movements or stringing together a short sequence of commands! 💬" },
    3: { paraphrase: "✨ Bringing your vision to life?", suggestion: "Combine precise control with the objectifying gaze! Create your masterpiece! 🎉" },
    4: { paraphrase: "🌟 Master of Manipulation!", suggestion: "Control complex actions or nuances of speech flawlessly! Your puppet dances perfectly! 🌟" },
    5: { paraphrase: "💖 The Ultimate Puppeteer!", suggestion: "Reflect on the unique power and artistry of total control. Your will is their reality! 🔥" }
  },
  protector: {
    1: { paraphrase: "🛡️ Standing guard?", suggestion: "Consciously scan for one potential 'hazard' (even minor) and address it proactively! Safety first! 😊" },
    2: { paraphrase: "👀 Keeping a watchful, caring eye?", suggestion: "Practice heightened awareness in a scene or verbally reassure your partner of their safety! 💬" },
    3: { paraphrase: "💪 Becoming their steadfast shield?", suggestion: "Combine vigilance with a clear readiness to defend boundaries! Stand strong! 🎉" },
    4: { paraphrase: "✨ Shining as the ultimate guardian!", suggestion: "Anticipate potential issues instinctively or neutralize a 'threat' decisively! You've got this! 🌟" },
    5: { paraphrase: "💖 Unbreakable Protector!", suggestion: "Your presence *is* safety. Reflect on the deep trust your protective nature inspires! 🔥" }
  },
  disciplinarian: {
    1: { paraphrase: "👨‍⚖️ Establishing clear expectations?", suggestion: "Deliver one pre-agreed, mild consequence calmly and fairly. Focus on the 'why'. 😊" },
    2: { paraphrase: "⚖️ Balancing justice with firmness?", suggestion: "Practice delivering a consequence with calm detachment, even if it feels difficult! 💬" },
    3: { paraphrase: "🔥 Shaping behavior through clear consequences?", suggestion: "Combine consistent consequence delivery with clear explanations! It's about growth! 🎉" },
    4: { paraphrase: "✨ Master of effective correction!", suggestion: "Deliver discipline precisely and objectively or design consequences that perfectly fit the 'crime'! 🌟" },
    5: { paraphrase: "💯 The Ultimate Fair Disciplinarian!", suggestion: "Your corrections are fair, effective, and purposeful. Reflect on the structure you provide! 🔥" }
  },
  caretaker: {
    1: { paraphrase: "🩹 Offering holistic support?", suggestion: "Check on one practical need today (hydration? temperature?) or offer simple emotional comfort. 😊" },
    2: { paraphrase: "❤️‍🩹 Expanding your supportive toolkit?", suggestion: "Practice implementing one routine for well-being or anticipate a comfort need! Thoughtful! 💬" },
    3: { paraphrase: "🩺 Ensuring complete well-being?", suggestion: "Combine attention to physical needs with emotional check-ins! Total care! 🎉" },
    4: { paraphrase: "✨ Shining as the ultimate provider!", suggestion: "Proactively manage multiple aspects of well-being or implement safety rules seamlessly! You're essential! 🌟" },
    5: { paraphrase: "💖 Guardian of Health and Happiness!", suggestion: "Your intuitive, comprehensive care is amazing! Reflect on the deep well-being you foster! 🔥" }
  },
  sir: {
    1: { paraphrase: "🎩 Adopting a formal bearing?", suggestion: "Practice maintaining a formal, respectful tone during one interaction! Poise! 😊" },
    2: { paraphrase: "🧐 Expecting proper address and service?", suggestion: "Clearly (but politely) state your expectation for being addressed as 'Sir' or receiving a specific service! 💬" },
    3: { paraphrase: "✨ Embodying dignified command?", suggestion: "Combine formal demeanor with clear expectations for service and respect! Authority with class! 🎉" },
    4: { paraphrase: "🌟 Shining with quiet, respected authority!", suggestion: "Command respect through calm formality or maintain high standards for etiquette effortlessly! 🌟" },
    5: { paraphrase: "💖 The Epitome of Respectful Power!", suggestion: "Your demeanor commands respect naturally. Reflect on the unique dynamic this creates! 🔥" }
  },
  goddess: {
    1: { paraphrase: "💫 Feeling a spark of the divine within?", suggestion: "Accept one small act of adoration gracefully! You are worthy! 😊" },
    2: { paraphrase: "✨ Beginning to radiate effortless power?", suggestion: "Practice issuing a command with quiet, unwavering confidence! Let them worship! 💬" },
    3: { paraphrase: "👑 Ascending your throne of command?", suggestion: "Combine seeking adoration with effortless authority! Revel in your divine power! 🎉" },
    4: { paraphrase: "🌟 Shining like a true object of worship!", suggestion: "Inspire worship through your mere presence or command reality with a simple word! Breathtaking! 🌟" },
    5: { paraphrase: "💖 Embodiment of Divinity and Power!", suggestion: "Your power is innate, your command absolute. Reflect on the reverence you inspire! 🔥" }
  },
  commander: {
    1: { paraphrase: "🗺️ Plotting the strategic first move?", suggestion: "Give one clear, simple order for a specific task! Lead the way! 😊" },
    2: { paraphrase: "🎯 Taking aim with decisive action?", suggestion: "Practice making a quick, firm choice in a dynamic situation! Trust your judgment! 💬" },
    3: { paraphrase: "🎖️ Leading the scene effectively?", suggestion: "Combine strategic direction with confident decisiveness! Mission accomplished! 🎉" },
    4: { paraphrase: "✨ Shining as a master tactician!", suggestion: "Direct a complex scene with flawless orders or make critical decisions instantly! Impressive! 🌟" },
    5: { paraphrase: "🔥 The Ultimate Commander!", suggestion: "Your command is absolute, your strategy impeccable! Reflect on the power of your decisive leadership! 🔥" }
  }
};

export function getStyleBreakdown(styleName, traits) {
  if (!styleName || !traits) { console.warn("getStyleBreakdown (dom) called with invalid args:", styleName, traits); return { strengths: "Select a style first!", improvements: "Choose your path to get tips!" }; }
  const styleKey = normalizeStyleKey(styleName);
  const styleData = domStyleSuggestions[styleKey];
  if (!styleData) { console.warn(`No suggestions found for dominant style key: ${styleKey}`); return { strengths: `You're forging your own unique ${styleName} path! Keep exploring, Commander! 💪`, improvements: "Continue defining what this style means to you! 🔍" }; }
  const roleData = bdsmData.dominant;
  if (!roleData || !roleData.styles) { console.error("bdsmData.dominant or its styles are missing!"); return { strengths: "Error loading style data.", improvements: "Please check data.js." }; }
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  let traitScores = [];
  if (styleObj?.traits) { styleObj.traits.forEach(traitDef => { const score = parseInt(traits[traitDef.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  if (roleData.coreTraits) { roleData.coreTraits.forEach(coreTrait => { const score = parseInt(traits[coreTrait.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];
  if(!levelData) { console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`); if (scoreIndex >= 4) { return { strengths: `You powerfully embody ${styleName}! 🔥`, improvements: `Refine your command! 🚀` }; } else if (scoreIndex <= 2) { return { strengths: `Exploring ${styleName} leadership! 🌱`, improvements: `Focus on communication! 🎯` }; } else { return { strengths: `Developing a balanced ${styleName} approach! 👍`, improvements: `Consider focus areas! 🤔` }; } }
  const { paraphrase, suggestion } = levelData;
  const isStrength = scoreIndex >= 4;
  const strengthsText = isStrength ? `✨ **${paraphrase}** ${suggestion}` : `🌱 Cultivating powerful skills in ${styleName}! Keep honing command!`;
  const improvementsText = isStrength ? `🚀 Expand the horizons of your ${styleName} style! Conquer new challenges!` : `🎯 **${paraphrase}** ${suggestion}`;
  return { strengths: strengthsText, improvements: improvementsText };
}
