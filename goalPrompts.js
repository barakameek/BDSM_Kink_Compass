// === goalPrompts.js ===

export const goalKeywords = {
  // Communication Goals
  "communicate": {
    relevantTraits: ["confidence", "vulnerability", "direct communication", "politeness", "empathy"],
    promptTemplates: [
      "🌱 To improve communication, how can your '{traitName}' trait support you?",
      "🗣️ When communicating this goal, is your '{traitName}' score helping or hindering?",
      "💬 Reflect: How does expressing '{traitName}' relate to achieving clear communication?",
    ],
  },
  "boundary": {
    relevantTraits: ["confidence", "direct communication", "boundary setting", "trust"],
    promptTemplates: [
      "🚧 Setting boundaries relies on '{traitName}'. How can you strengthen this?",
      "✋ Reflect on a past boundary discussion. How did your '{traitName}' level play a role?",
      "🛡️ Achieving this goal might involve asserting your '{traitName}'. Feeling ready?",
    ],
  },
  "ask for": {
      relevantTraits: ["confidence", "vulnerability", "direct communication", "affection seeking"],
      promptTemplates: [
          "❓ Asking requires '{traitName}'. Where do you feel strongest/weakest in that?",
          "🙋‍♀️ Consider your '{traitName}'. Does it make asking feel easier or harder?",
          "🎁 How can embracing your '{traitName}' help you clearly ask for what you need/want?",
      ]
  },
  // Exploration & Skill Goals
  "explore": {
    relevantTraits: ["exploration", "curiosity", "boldness", "trust", "safety focus"], // Added safety
    promptTemplates: [
      "🗺️ Exploration often involves '{traitName}'. Is this trait eager for the journey?",
      "🧭 How does your '{traitName}' score impact your comfort level with exploring this?",
      "🔭 To explore safely, consider your '{traitName}'. Does it align with the risks?",
    ],
  },
  "learn": {
    relevantTraits: ["exploration", "patience", "trainability", "discipline focus", "precision"],
    promptTemplates: [
      "🧠 Learning this skill connects to '{traitName}'. How's that synergy feeling?",
      "📚 Your '{traitName}' level might influence your learning pace. How can you adapt?",
      "🎓 Reflect: Does your approach to '{traitName}' support mastering this new skill?",
    ],
  },
  "rope": {
      relevantTraits: ["rope enthusiasm", "patience during tying", "sensuality", "trust", "precision"],
      promptTemplates: [
          "🪢 Exploring rope connects deeply with '{traitName}'. How does this feel?",
          "⏳ Your '{traitName}' score might affect your rope experience. Ready for that?",
          "🎨 How can focusing on '{traitName}' enhance your journey with rope?",
      ]
  },
   "scene": {
      relevantTraits: ["creativity", "control", "intensity", "communication", "aftercare focus"], // Added aftercare
      promptTemplates: [
          "🎬 Planning this scene involves '{traitName}'. Feeling inspired?",
          "🎭 How does your '{traitName}' level shape the kind of scene you envision?",
          "✨ Reflect: To make this scene amazing, how can you leverage your '{traitName}'?",
      ]
  },
  // Role & Dynamic Goals
  "serve": {
    relevantTraits: ["service", "obedience", "devotion", "anticipating needs", "tidiness"],
    promptTemplates: [
      "🧹 Serving well often means leaning into '{traitName}'. How strong is that urge?",
      "💖 Reflect: Does your current '{traitName}' score align with your service goals?",
      "🤝 How can enhancing your '{traitName}' make your service feel more fulfilling?",
    ],
  },
  "control": {
    relevantTraits: ["authority", "control", "confidence", "leadership", "care"],
    promptTemplates: [
      "👑 Taking control activates your '{traitName}'. Feeling powerful?",
      "🕹️ How does your '{traitName}' level influence the *way* you want to take control?",
      "🧭 Reflect: To achieve satisfying control, how does '{traitName}' need to show up?",
    ],
  },
   "submit": {
      relevantTraits: ["obedience", "trust", "receptiveness", "vulnerability", "submissionDepth"],
      promptTemplates: [
          "🙇‍♀️ Submission often involves embracing '{traitName}'. How does that feel right now?",
          "🔗 Your '{traitName}' level might shape your submission experience. What are you seeking?",
          "🕊️ Reflect: How can understanding your '{traitName}' deepen your submission?",
      ]
  },
  // Sensation Goals
   "pain": {
      relevantTraits: ["painTolerance", "pain interpretation", "sensation seeking", "trust", "communication"],
      promptTemplates: [
          "💥 Exploring pain touches on your '{traitName}'. How prepared do you feel?",
          "🎢 Your '{traitName}' score influences how you might experience this. Ready to communicate?",
          "🔥 Reflect: How does '{traitName}' shape your desire or hesitation around pain?",
      ]
   },
    "intense": {
        relevantTraits: ["intensity", "craving", "sensation seeking", "boldness", "safety focus"],
        promptTemplates: [
            "🚀 Seeking intensity engages your '{traitName}'. Ready for the ride?",
            "📈 How does your '{traitName}' score relate to the *kind* of intensity you crave?",
            "⚡ Reflect: To navigate intense experiences safely, how crucial is your '{traitName}'?",
        ]
    }
  // Add more keywords and prompts!
};

// Helper function (likely in app.js)
/*
function getGoalAlignmentHints(person) {
  const hints = [];
  if (!person.goals || !person.traits) return hints;

  const activeGoals = person.goals.filter(g => !g.done);

  activeGoals.forEach(goal => {
    const goalTextLower = goal.text.toLowerCase();
    Object.entries(goalKeywords).forEach(([keyword, data]) => {
      if (goalTextLower.includes(keyword)) {
        data.relevantTraits.forEach(traitName => {
          if (person.traits.hasOwnProperty(traitName)) {
            const score = person.traits[traitName];
            const promptTemplate = data.promptTemplates[Math.floor(Math.random() * data.promptTemplates.length)];
            const hintText = promptTemplate.replace('{traitName}', traitName); // Basic replace
            hints.push(`🎯 For goal "${goal.text}": ${hintText} (Your ${traitName} score: ${score})`);
          }
        });
      }
    });
  });
  // Deduplicate or limit hints if needed
  return [...new Set(hints)].slice(0, 3); // Return unique hints, max 3
}
*/
