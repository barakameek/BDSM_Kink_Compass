// Paraphrasing suggestions for submissive styles
const subStyleSuggestions = {
  submissive: {
    1: { paraphrase: "New to Submissive? Start simply!", suggestion: "Help with a duty and smile to celebrate! 😊" },
    2: { paraphrase: "Dipping into Submissive? Add spark!", suggestion: "Practice service and chat about it! 💬" },
    3: { paraphrase: "Halfway there—refine it!", suggestion: "Try a creative challenge and cheer! 🎉" },
    4: { paraphrase: "Shining as Submissive—keep going!", suggestion: "Stretch your zone and share a treat! 🍭" },
    5: { paraphrase: "A Submissive star—deepen it!", suggestion: "Design a ritual and celebrate! 🌸" }
  },
  brat: {
    1: { paraphrase: "New to Brat? Start small!", suggestion: "Add a playful twist and nod cheekily! 😉" },
    2: { paraphrase: "Dipping into Brat? More spark!", suggestion: "Defy lightly and giggle about it! 😏" },
    3: { paraphrase: "Halfway there—refine Brat!", suggestion: "Mix play and defiance, cheer loudly! 🎤" },
    4: { paraphrase: "Shining as Brat—keep it fun!", suggestion: "Push a bit more and high-five! ✋" },
    5: { paraphrase: "A Brat star—go wild!", suggestion: "Craft a defiance game and celebrate! 🎊" }
  },
  slave: {
    1: { paraphrase: "New to Slave? Start simply!", suggestion: "Offer devotion and smile softly! 😊" },
    2: { paraphrase: "Dipping into Slave? Add spark!", suggestion: "Surrender lightly and chat! 💬" },
    3: { paraphrase: "Halfway there—refine Slave!", suggestion: "Deepen surrender and cheer! 🎉" },
    4: { paraphrase: "Shining as Slave—keep glowing!", suggestion: "Stretch surrender and treat! 🍬" },
    5: { paraphrase: "A Slave star—deepen it!", suggestion: "Create a surrender ritual and celebrate! 🌹" }
  },
  pet: {
    1: { paraphrase: "New to Pet? Start small!", suggestion: "Show loyalty and wag happily! 🐾" },
    2: { paraphrase: "Dipping into Pet? Add spark!", suggestion: "Be affectionate and chat! 💖" },
    3: { paraphrase: "Halfway there—refine Pet!", suggestion: "Mix loyalty and cheer! 🎶" },
    4: { paraphrase: "Shining as Pet—keep it up!", suggestion: "Stretch affection in a new way and give a treat! 🍪" },
    5: { paraphrase: "A Pet star—get cuddly!", suggestion: "Design a loyalty ritual and celebrate! 🧸" }
  },
  kitten: {
    1: { paraphrase: "New to Kitten? Start small!", suggestion: "Try a tiny new experience and reward yourself with a happy purr! 😸" },
    2: { paraphrase: "Dipping into Kitten? Add spark!", suggestion: "Be a bit more curious and share a playful grin! ✨" },
    3: { paraphrase: "Halfway there—refine Kitten!", suggestion: "Mix curiosity and grace in play and cheer! 🎉" },
    4: { paraphrase: "Shining as Kitten—keep glowing!", suggestion: "Stretch your playful side and celebrate with a gentle nuzzle! 🌟" },
    5: { paraphrase: "A Kitten star—purr-fect!", suggestion: "Embrace your kitten vibes fully and celebrate with a special treat! 🎀" }
  }
};

export function getStyleBreakdown(styleName, traits) {
  const styleKey = styleName.toLowerCase();
  const styleData = subStyleSuggestions[styleKey];
  if (!styleData) {
    return {
      strengths: "You're finding your unique path! Keep exploring your style. 💕",
      improvements: "Pick a style to see personalized tips and tricks to grow. 😸"
    };
  }
  // Compute average score of this style's traits
  const roleData = bdsmData.submissive;
  const styleObj = roleData.styles.find(s => s.name.toLowerCase() === styleKey);
  const traitScores = styleObj ? styleObj.traits.map(t => parseInt(traits[t.name]) || 3) : [];
  const avgScore = traitScores.length ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  const { paraphrase, suggestion } = styleData[avgScore];
  const isStrength = avgScore >= 4;
  const strengthsText = isStrength ? `${paraphrase} ${suggestion}` 
                                   : "You're growing so fast! Keep it up and you'll shine in no time. 🌟";
  const improvementsText = isStrength ? "Keep challenging yourself with new ideas to reach even greater heights! 💪"
                                      : `${paraphrase} ${suggestion}`;
  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
}
