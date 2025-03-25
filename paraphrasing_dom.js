import { bdsmData } from './data.js';

const domStyleSuggestions = {
  dominant: {
    1: { paraphrase: "New to Dominant? Start small!", suggestion: "Take the lead in a tiny way and give yourself a nod! 😊" },
    2: { paraphrase: "Dipping into Dominant? Add some spark!", suggestion: "Practice leadership in a task and discuss with your partner! 💬" },
    3: { paraphrase: "Halfway there—refine Dominant with flair!", suggestion: "Lead a creative challenge, get feedback, and cheer decisively! 🎉" },
    4: { paraphrase: "Shining in Dominant—keep it up!", suggestion: "Stretch your control in a new scenario and celebrate with a ritual! 🌟" },
    5: { paraphrase: "A Dominant star—deepen it!", suggestion: "Design a leadership ritual and celebrate with a special command! 🔥" }
  },
  assertive: {
    1: { paraphrase: "New to Assertive? Start small!", suggestion: "Voice one opinion boldly and reward yourself! 😊" },
    2: { paraphrase: "Dipping into Assertive? Add spark!", suggestion: "Take initiative in a scenario and talk it over with your partner! 💬" },
    3: { paraphrase: "Halfway there—refine Assertive!", suggestion: "Make a confident request and celebrate when it goes well! 🎉" },
    4: { paraphrase: "Shining in Assertive—keep going!", suggestion: "Challenge yourself with a direct ask and enjoy the boost! 🌟" },
    5: { paraphrase: "An Assertive star—own it!", suggestion: "Keep leading with confidence and perhaps mentor someone newer! 🏅" }
  },
  nurturer: {
    1: { paraphrase: "New to Nurturer? Start small!", suggestion: "Offer a small act of care and smile warmly! 😊" },
    2: { paraphrase: "Dipping into Nurturer? Add some spark!", suggestion: "Practice support in a real scenario and chat with your partner! 💬" },
    3: { paraphrase: "Halfway there—refine Nurturer with flair!", suggestion: "Try a creative caring challenge and cheer heartily! 🎉" },
    4: { paraphrase: "Shining in Nurturer—keep glowing!", suggestion: "Stretch your empathy in a new way and celebrate with a warm gesture! 🌸" },
    5: { paraphrase: "A Nurturer star—deepen it!", suggestion: "Design a special care ritual and celebrate with a heartfelt moment! 💖" }
  },
  rigger: {
    1: { paraphrase: "New to Rigger? Start small!", suggestion: "Try a simple knot and celebrate when it holds! 😊" },
    2: { paraphrase: "Dipping into Rigger? Add spark!", suggestion: "Practice a new tie and discuss how it felt! 💬" },
    3: { paraphrase: "Halfway there—refine Rigger!", suggestion: "Experiment with a creative bind and cheer your skill! 🎉" },
    4: { paraphrase: "Shining as Rigger—keep it up!", suggestion: "Challenge yourself with a tricky tie and celebrate the result! 🌟" },
    5: { paraphrase: "A Rigger star—masterful!", suggestion: "Invent a signature knot and enjoy your rope mastery! 🏅" }
  },
  sadist: {
    1: { paraphrase: "New to Sadist? Start gently!", suggestion: "Try a mild sensation and gauge comfort with a smile. 😊" },
    2: { paraphrase: "Dipping into Sadist? Add spark!", suggestion: "Increase intensity a notch and talk about it after! 💬" },
    3: { paraphrase: "Halfway there—refine Sadist play!", suggestion: "Mix pain and pleasure creatively and cheer your boldness! 🎉" },
    4: { paraphrase: "Shining as Sadist—own it!", suggestion: "Push limits a bit more (safely) and revel in the thrill! 🌟" },
    5: { paraphrase: "A Sadist star—fearsome!", suggestion: "Dive into an intense scene and celebrate your mastery (with aftercare)! 🔥" }
  }
};

export function getStyleBreakdown(styleName, traits) {
  const styleKey = styleName.toLowerCase();
  const styleData = domStyleSuggestions[styleKey];
  if (!styleData) {
    return {
      strengths: "You're forging your own dominant style! Keep at it. 💪",
      improvements: "Select a style to see tailored tips for growth. 🔍"
    };
  }
  const roleData = bdsmData.dominant;
  const styleObj = roleData.styles.find(s => s.name.toLowerCase() === styleKey);
  const traitScores = styleObj ? styleObj.traits.map(t => parseInt(traits[t.name]) || 3) : [];
  const avgScore = traitScores.length ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  const { paraphrase, suggestion } = styleData[avgScore];
  const isStrength = avgScore >= 4;
  const strengthsText = isStrength ? `${paraphrase} ${suggestion}` 
                                   : "You're growing so fast in your dominance! Keep going and you'll command respect in no time. 🌟";
  const improvementsText = isStrength ? "Keep pushing your boundaries and exploring new ways to exert your dominance. 🚀"
                                      : `${paraphrase} ${suggestion}`;
  return {
    strengths: strengthsText,
    improvements: improvementsText
  };
}
