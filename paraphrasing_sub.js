
import { bdsmData } from './data.js';

// Helper to normalize style names for lookup
function normalizeStyleKey(name) {
    if (!name) return '';
    // Lowercase, remove content in parentheses, normalize slashes, trim
    return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim();
}

// --- Suggestions for Submissive Styles ---
// IMPORTANT: Fill this object completely with entries for *every* submissive style in data.js
const subStyleSuggestions = {
  'classic submissive': { // Key matches normalized name from data.js
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
   // ... ADD ALL OTHER SUBMISSIVE STYLES HERE ...
   // Example:
   painslut: {
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
   // ... etc for ALL styles in data.js's submissive section
};


export function getStyleBreakdown(styleName, traits) {
  if (!styleName || !traits) {
      console.warn("getStyleBreakdown (sub) called with invalid args:", styleName, traits);
      return { strengths: "Select a style first!", improvements: "Choose your path to get tips!" };
  }

  const styleKey = normalizeStyleKey(styleName);
  const styleData = subStyleSuggestions[styleKey];

  // Handle case where the specific style is not found in suggestions
  if (!styleData) {
    console.warn(`No suggestions found for submissive style key: ${styleKey}`);
    return {
      strengths: `You're crafting your unique ${styleName} sparkle! Keep exploring. 💕`,
      improvements: "Continue defining what this style means to you! 😸"
    };
  }

  // Find the style definition in the main data
  const roleData = bdsmData.submissive; // Assuming 'submissive' is the key in bdsmData
  if (!roleData || !roleData.styles) {
      console.error("bdsmData.submissive or its styles are missing!");
       return { strengths: "Error loading style data.", improvements: "Please check data.js." };
  }
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);

  let traitScores = [];

  // Average scores of specific traits for this style
  if (styleObj && styleObj.traits) {
      styleObj.traits.forEach(traitDef => {
          const score = parseInt(traits[traitDef.name], 10); // Base 10
          if (!isNaN(score)) { // Only add valid numbers
              traitScores.push(score);
          }
      });
  }

  // Add core traits to the average calculation (if they exist in the input `traits`)
   if (roleData.coreTraits) {
       roleData.coreTraits.forEach(coreTrait => {
            const score = parseInt(traits[coreTrait.name], 10);
            if (!isNaN(score)) {
                traitScores.push(score);
            }
       });
   }

  // Calculate average score (ensure no division by zero)
  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3; // Default to 3 if no relevant traits have scores

  const scoreIndex = Math.max(1, Math.min(5, avgScore)); // Clamp score between 1 and 5
  const levelData = styleData[scoreIndex];

  // Handle case where suggestions for the calculated level are missing
  if (!levelData) {
      console.warn(`No paraphrase/suggestion found for style ${styleKey} at calculated level ${scoreIndex}`);
      // Provide generic feedback based on the average score
      if (scoreIndex >= 4) {
          return {
             strengths: `You're strongly embodying the ${styleName} style! ✨ Keep shining!`,
             improvements: `Explore nuances or teach others your ways! 🚀`
          };
      } else if (scoreIndex <= 2) {
           return {
             strengths: `You're exploring the foundations of the ${styleName} style! 🌱 Keep growing!`,
             improvements: `Focus on communication and small steps to build confidence! 🎯`
          };
      } else { // scoreIndex is 3
           return {
             strengths: `You have a balanced approach to the ${styleName} style! 👍`,
             improvements: `Consider which aspects you'd like to lean into more! 🤔`
          };
      }
  }

  const { paraphrase, suggestion } = levelData;
  const isStrength = scoreIndex >= 4;

  // Generate the text using markdown-like bolding
  const strengthsText = isStrength
    ? `✨ **${paraphrase}** ${suggestion}`
    : `🌱 You're cultivating wonderful skills in ${styleName}! Keep nurturing your growth, star!`;

  const improvementsText = isStrength
    ? `🚀 Keep exploring the depths of ${styleName}! What new facet can you uncover or polish? Go go go!`
    : `🎯 **${paraphrase}** ${suggestion}`;

  // Return the final object
  return {
    strengths: strengthsText,
    improvements: improvementsText
  };

} // <-- This brace closes the getStyleBreakdown function
// No stray 'OF' here.
