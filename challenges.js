// === challenges.js ===

export const challenges = {
  // Communication Challenges
  communication: [
    {
      title: "💬 Express One Need Clearly",
      desc: "Today, identify one small thing you need (a moment of quiet, help with a task, a specific type of touch) and ask for it directly and clearly. No hints!",
    },
    {
      title: "👂 Active Listening Practice",
      desc: "During one conversation today, focus *only* on understanding the other person. Ask clarifying questions. Resist the urge to interrupt or plan your response while they speak.",
    },
    {
      title: " boundaries_reaffirm": "🛡️ Revisit a Boundary",
      desc: "Think of one boundary (hard or soft). Mentally (or verbally, if appropriate) reaffirm it to yourself or your partner. Remind yourself why it's important.",
    },
     {
      title: "🗣️ 'I Feel' Statement",
      desc: "Practice expressing a feeling using an 'I feel...' statement instead of blaming or accusing. E.g., 'I feel unheard when...' instead of 'You never listen...'",
     }
  ],

  // Exploration Challenges
  exploration: [
    {
      title: "🗺️ Tiny New Thing",
      desc: "Try one *very small* thing outside your usual routine today. A different route home? A food you avoid? A 5-minute research dive into a curious kink topic?",
    },
    {
      title: "🤔 Question an Assumption",
      desc: "Identify one assumption you hold about yourself, your partner, or your dynamic. Ask yourself: Is this *really* true? Where did it come from?",
    },
    {
      title: "✨ Appreciate the Unfamiliar",
      desc: "Find one thing today (a texture, a sound, an idea) that feels unfamiliar or even slightly uncomfortable. Observe it with curiosity instead of judgment for 1 minute.",
    },
    {
        title: "🔭 Style Snippet",
        desc: "Read the description of one BDSM style (in Style Discovery) that you *don't* identify with. What's one aspect you find interesting or could learn from?",
    }
  ],

  // Role-Specific Challenges (Examples)
  dominant_challenges: [
    {
      title: "👑 Offer Specific Praise",
      desc: "Catch your partner doing something well (following an instruction, showing effort, etc.) and offer genuine, *specific* praise. 'Good girl/boy' is nice, but 'I love how precisely you followed that instruction' is better!",
    },
    {
      title: "🧘‍♂️ Patience Practice (Dom)",
      desc: "Find one moment where you feel impatient with your partner's progress or response. Consciously pause, take 3 deep breaths, and offer encouragement instead of pressure.",
    },
     {
        title: " caring_check_in": "❤️ Proactive Care Check",
        desc: "Beyond basic safety, proactively check on one aspect of your partner's well-being *before* they mention it (Hydrated? Comfortable temperature? Feeling emotionally secure?)."
     }
  ],
  submissive_challenges: [
    {
      title: "💖 Express Gratitude (Sub)",
      desc: "Find one specific thing your Dominant partner did today that you appreciate (guidance, care, a fun command) and express your gratitude clearly.",
    },
    {
      title: "✨ Trust Exercise (Small)",
      desc: "Identify one very small act where you can consciously practice trust today – maybe following a simple, low-stakes instruction without hesitation, or sharing a small, slightly vulnerable feeling.",
    },
    {
        title: "🎀 Presentation Polish",
        desc: "Spend an extra 5 minutes on one aspect of your presentation today, purely as an act of devotion or role embodiment (e.g., shining shoes, neatening hair, focusing posture)."
    }
  ],
  switch_challenges: [
      {
        title: "🔄 Energy Check-In",
        desc: "Pause once today and consciously check in with your own energy. Do you feel more drawn to leading or following *right now*? Acknowledge that feeling without judgment.",
      },
      {
        title: "💬 Verbalize the Shift?",
        desc: "Think about how you *would* communicate a desire to switch roles, even if you don't actually do it today. Practice the words in your head.",
      }
  ]
  // Add more categories and challenges!
};

// Helper function (in app.js)
/*
function getDailyChallenge(persona) {
  const today = new Date().toDateString();
  const storedChallenge = JSON.parse(localStorage.getItem('kinkCompassDailyChallenge') || '{}');

  if (storedChallenge.date === today && storedChallenge.challenge) {
    return storedChallenge.challenge;
  }

  // Select a new challenge
  let possibleChallenges = [...challenges.communication, ...challenges.exploration];
  if (persona?.role === 'dominant' && challenges.dominant_challenges) {
      possibleChallenges.push(...challenges.dominant_challenges);
  } else if (persona?.role === 'submissive' && challenges.submissive_challenges) {
      possibleChallenges.push(...challenges.submissive_challenges);
  } else if (persona?.role === 'switch' && challenges.switch_challenges) {
      possibleChallenges.push(...challenges.switch_challenges);
  }

  if (possibleChallenges.length === 0) return null; // No challenges available

  const newChallenge = possibleChallenges[Math.floor(Math.random() * possibleChallenges.length)];

  // Store for today
  localStorage.setItem('kinkCompassDailyChallenge', JSON.stringify({ date: today, challenge: newChallenge }));
  return newChallenge;
}
*/
