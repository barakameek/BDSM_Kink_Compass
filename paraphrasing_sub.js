import { bdsmData } from './data.js';

// Enhanced with more styles and positive framing
const subStyleSuggestions = {
  submissive: { // General Baseline
    1: { paraphrase: "🌱 Beginning your Submissive journey?", suggestion: "Try one small act of service or follow one instruction fully. Celebrate that step! 😊" },
    2: { paraphrase: "💧 Dipping toes into Submission?", suggestion: "Practice consistency in a chosen area (service/humility). Discuss how it feels! 💬" },
    3: { paraphrase: "🌳 Growing steady in Submission?", suggestion: "Explore deepening either service or humility. Seek feedback! 🎉" },
    4: { paraphrase: "✨ Shining as a Submissive!", suggestion: "Anticipate a need before being asked or proactively offer deference. Enjoy the glow! 🌟" },
    5: { paraphrase: "🌸 Mastering the art of Submission!", suggestion: "Reflect on what brings you the deepest fulfillment in this role. How can you integrate it more?💖" }
  },
  brat: {
    1: { paraphrase: "😈 Starting your Bratty adventures?", suggestion: "Try one tiny, playful act of defiance. See how the push-pull feels! 😉" },
    2: { paraphrase: "⚡️ Adding some Bratty spark?", suggestion: "Test a boundary playfully, but be ready for the consequence! Discuss limits. 😏" },
    3: { paraphrase: "🔥 Halfway to Brat mastery?", suggestion: "Combine playfulness and resilience. Take a consequence with a grin! 🎤" },
    4: { paraphrase: "💥 Shining with Brat energy!", suggestion: "Initiate a playful challenge. Can you outsmart your Dom (just a little)? ✋" },
    5: { paraphrase: "👑 A true Brat extraordinaire!", suggestion: "Invent a new, creative way to be playfully defiant. Revel in the dynamic! 🎊" }
  },
  slave: {
    1: { paraphrase: "🕯️ Exploring the path of Slavery?", suggestion: "Focus on one act of deep devotion or a moment of intentional surrender. Feel the connection. 😊" },
    2: { paraphrase: "🔗 Deepening your commitment?", suggestion: "Practice surrendering control in a new, small way. Communicate your experience. 💬" },
    3: { paraphrase: "🌹 Finding strength in Surrender?", suggestion: "Explore rituals of devotion or practice longer periods of yielded control. 🎉" },
    4: { paraphrase: "💎 Shining with Devotion!", suggestion: "Anticipate your Master/Mistress's needs as an act of devotion. Find joy in it. 🍬" },
    5: { paraphrase: "❤️ Embodying dedicated Slavery!", suggestion: "Reflect on the profound connection devotion brings. How can you deepen this bond? 🌟" }
  },
  pet: {
    1: { paraphrase: "🐾 Taking first steps as a Pet?", suggestion: "Try expressing a simple need non-verbally or show clear enthusiasm for praise. Wag away! 😊" },
    2: { paraphrase: "💖 Exploring Pet dynamics?", suggestion: "Practice seeking affection more openly or use more non-verbal cues. Discuss comfort levels! ✨" },
    3: { paraphrase: "🧸 Settling into Petspace?", suggestion: "Combine seeking affection with playful non-verbal communication. Enjoy the cuddles! 🎶" },
    4: { paraphrase: "🌟 Shining as a loyal Pet!", suggestion: "Anticipate your Owner's mood and offer comfort non-verbally. Earn those head pats! 🍪" },
    5: { paraphrase: "👑 A cherished, expressive Pet!", suggestion: "Develop unique non-verbal signals. Revel in the intuitive connection! 🎀" }
  },
  little: {
    1: { paraphrase: "🧸 Discovering your Little side?", suggestion: "Allow yourself a moment of simple play or accept one act of guidance without resistance. Be gentle with yourself. 😊" },
    2: { paraphrase: "🖍️ Coloring your Little world?", suggestion: "Try expressing a 'little' feeling or rely on your Caregiver for a small decision. Explore safely! ✨" },
    3: { paraphrase: "🍭 Sweetly settling into Littlespace?", suggestion: "Engage in a longer period of play or follow a simple rule set by your CG. Find the joy! 🎉" },
    4: { paraphrase: "🎀 Shining bright as a Little!", suggestion: "Express vulnerability openly or delight in following your CG's guidance. Feel the safety! 🌟" },
    5: { paraphrase: "💖 Fully embracing your Little self!", suggestion: "Co-create a special 'little' routine or rule with your CG. Cherish the connection! 🦄" }
  },
  masochist: {
    1: { paraphrase: "⚡️ Gently exploring Masochism?", suggestion: "Identify one type of sensation you're curious about. Try it *very* lightly with clear communication. 😊" },
    2: { paraphrase: "🌡️ Testing the waters of Sensation?", suggestion: "Experiment with slightly increased intensity or duration. Focus on your body's signals. 💬" },
    3: { paraphrase: "🔥 Finding the edge in Masochism?", suggestion: "Combine different types of sensation or work towards enduring a specific level. Celebrate your resilience! 🎉" },
    4: { paraphrase: "💥 Thriving on Intense Sensation!", suggestion: "Explore more complex scenes or push your known limits safely. Analyze the 'why'. 🌟" },
    5: { paraphrase: "🚀 Mastering the art of Masochism!", suggestion: "Design a scene focused on a specific type of release or transcendence you seek. Own your journey! 🔥" }
  }
  // Add entries for any other sub styles added to data.js
};

export function getStyleBreakdown(styleName, traits) {
  const styleKey = styleName.toLowerCase();
  // Handle potential spaces or variations in style names if needed
  const styleData = subStyleSuggestions[styleKey] || subStyleSuggestions[styleKey.replace(/ /g, '')];

  if (!styleData) {
    return {
      strengths: "You're finding your unique submissive path! Keep exploring. 💕",
      improvements: "Pick a defined style to see personalized tips for growth. 😸"
    };
  }

  const roleData = bdsmData.submissive;
  // Find style object, trying variations if needed (e.g., "Master / Mistress" vs "Master/Mistress")
  const styleObj = roleData.styles.find(s => s.name.toLowerCase() === styleKey || s.name.toLowerCase().replace(/ \/ /g, '/') === styleKey);

  // Calculate average score from style-specific traits
  let traitScores = [];
  if (styleObj && styleObj.traits) {
      traitScores = styleObj.traits.map(t => parseInt(traits[t.name]) || 3); // Default to 3 if trait not found
  }
  // Include core traits in average? Optional, but can provide a broader picture.
  // traitScores.push(parseInt(traits.obedience) || 3);
  // traitScores.push(parseInt(traits.trust) || 3);

  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default if no traits defined for style

  // Ensure avgScore is within 1-5 range
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const { paraphrase, suggestion } = styleData[scoreIndex];

  const isStrength = scoreIndex >= 4;

  // Refined text for clarity
  const strengthsText = isStrength
    ? `✨ **${paraphrase}** ${suggestion}`
    : `🌱 You're cultivating wonderful skills in ${styleName}! Keep nurturing your growth.`;

  const improvementsText = isStrength
    ? `🚀 Keep exploring the depths of ${styleName}! What new facet can you uncover or refine?`
    : `🎯 **${paraphrase}** ${suggestion}`;

  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
}
