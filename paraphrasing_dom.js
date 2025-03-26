import { bdsmData } from './data.js';

// Enhanced with more styles and positive framing
const domStyleSuggestions = {
  dominant: { // General Baseline
    1: { paraphrase: "🌱 Beginning your Dominant journey?", suggestion: "Take charge of one small decision or activity. Feel the authority, even if brief! 😊" },
    2: { paraphrase: "💧 Testing the waters of Dominance?", suggestion: "Practice giving clear instructions or setting one boundary. Observe the effect. 💬" },
    3: { paraphrase: "🌳 Growing steady in Dominance?", suggestion: "Refine your leadership in a specific scene or take control more assertively. Seek feedback! 🎉" },
    4: { paraphrase: "✨ Shining as a Dominant!", suggestion: "Confidently lead a complex scene or proactively manage the dynamic. Own your power! 🌟" },
    5: { paraphrase: "👑 Mastering the art of Dominance!", suggestion: "Reflect on your unique leadership style. How can you elevate it further? 🔥" }
  },
  "master / mistress": { // Handle variations
    1: { paraphrase: "🏛️ Laying the foundation as Master/Mistress?", suggestion: "Define one clear expectation or rule for your submissive. Practice conveying it with presence. 😊" },
    2: { paraphrase: "⚖️ Balancing expectations and presence?", suggestion: "Implement a small protocol or work on projecting more authority. Consistency is key. 💬" },
    3: { paraphrase: "🏰 Building your domain as Master/Mistress?", suggestion: "Refine your set of rules or practice commanding attention non-verbally. 🎉" },
    4: { paraphrase: "⚜️ Shining with authority as Master/Mistress!", suggestion: "Implement a more complex protocol or demand a higher standard of obedience. 🌟" },
    5: { paraphrase: "👑 Embodying Mastery!", suggestion: "Develop a unique ritual that reinforces your status and expectations. Lead with unwavering presence. 🔥" }
  },
  sadist: {
    1: { paraphrase: "⚡️ Cautiously exploring Sadism?", suggestion: "Focus on safe sensation play. Calibrate carefully and prioritize communication/aftercare. 😊" },
    2: { paraphrase: "🌡️ Experimenting with Sensation Control?", suggestion: "Try varying intensity or duration. Pay close attention to your partner's verbal and non-verbal cues. 💬" },
    3: { paraphrase: "🔥 Igniting the flames of Sadism?", suggestion: "Combine different types of sensation or focus on the psychological aspect. Enjoy the interplay! 🎉" },
    4: { paraphrase: "💥 Wielding Sensation with Skill!", suggestion: "Orchestrate a scene with rising intensity. Derive pleasure from their controlled reactions. 🌟" },
    5: { paraphrase: "🖤 Mastering the art of Sadism!", suggestion: "Design a scene that pushes boundaries psychologically and physically (safely!). Revel in the shared intensity. 🔥" }
  },
  "caregiver / daddy / mommy": { // Handle variations
    1: { paraphrase: "🧸 Gently exploring Caregiving?", suggestion: "Offer one act of comfort or set one simple, caring rule. Focus on safety and warmth. 😊" },
    2: { paraphrase: "💖 Nurturing your Caregiver style?", suggestion: "Practice consistent check-ins or establish a small routine. Build trust through reliability. 💬" },
    3: { paraphrase: "🏡 Creating a safe space as Caregiver?", suggestion: "Develop clear rules that provide structure or focus on anticipating needs. Balance care and authority. 🎉" },
    4: { paraphrase: "🌟 Shining as a Nurturing Dominant!", suggestion: "Provide deep emotional support alongside structure. Take pride in their well-being. 🌸" },
    5: { paraphrase: "👑 The ultimate Caregiver!", suggestion: "Create a comprehensive system of rules and care tailored to your partner. Embody loving authority. 💖" }
  },
  "primal (hunter / beast)": { // Handle variations
    1: { paraphrase: "🐾 Exploring Primal stirrings?", suggestion: "Try a non-verbal cue of dominance (e.g., a stare, posture) or a very light, playful chase. Ease into it. 😊" },
    2: { paraphrase: "🐺 Testing your Primal instincts?", suggestion: "Use more physical presence (safe holds) or express possessiveness non-verbally. Let go a little. 💬" },
    3: { paraphrase: "🔥 Unleashing your Primal side?", suggestion: "Engage in a chase scene or use more assertive physical control (pinning). Balance instinct with safety. 🎉" },
    4: { paraphrase: "💥 Embodying Primal Power!", suggestion: "Lead a scene guided primarily by instinct and physicality. Trust your gut (and your safety protocols!). 🌟" },
    5: { paraphrase: "👑 Master of the Primal!", suggestion: "Effortlessly switch into your primal headspace. Command through presence, instinct, and raw physicality. 🔥" }
  }
   // Add entries for any other dom styles added to data.js
};


// Helper to normalize style names for lookup
function normalizeStyleKey(name) {
    if (!name) return '';
    return name.toLowerCase().replace(/ \/ /g, '/').replace(/\(.*\)/g, '').trim();
}

export function getStyleBreakdown(styleName, traits) {
  const styleKey = normalizeStyleKey(styleName);
  const styleData = domStyleSuggestions[styleKey];

  if (!styleData) {
    return {
      strengths: "You're forging your own dominant style! Keep exploring. 💪",
      improvements: "Select a defined style to see personalized tips for growth. 🔍"
    };
  }

  const roleData = bdsmData.dominant;
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);

  // Calculate average score from style-specific traits
  let traitScores = [];
  if (styleObj && styleObj.traits) {
      traitScores = styleObj.traits.map(t => parseInt(traits[t.name]) || 3); // Default to 3
  }
  // Optional: Include core traits in average
  // traitScores.push(parseInt(traits.authority) || 3);
  // traitScores.push(parseInt(traits.care) || 3);

  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default if no traits

  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const { paraphrase, suggestion } = styleData[scoreIndex];

  const isStrength = scoreIndex >= 4;

  const strengthsText = isStrength
    ? `✨ **${paraphrase}** ${suggestion}`
    : `🌱 You're cultivating powerful skills in ${styleName}! Keep honing your command.`;

  const improvementsText = isStrength
    ? `🚀 Keep expanding the horizons of your ${styleName} style! What new challenges can you embrace?`
    : `🎯 **${paraphrase}** ${suggestion}`;

  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
}
