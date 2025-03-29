// === synergyHints.js ===

export const synergyHints = {
  // --- Positive Synergies (High + High) ---
  highPositive: [
    // Dominant Focus
    {
      traits: ["authority", "care"], // Classic Dom + Nurturer elements
      hint: "✨ The Benevolent Ruler ✨: Wow! High Authority paired with high Care means you lead with strength AND heart. Your guidance likely feels both firm and incredibly safe. Keep nurturing that balance!",
    },
    {
      traits: ["confidence", "creativity"], // Assertive + Creative elements
      hint: "💡 The Visionary Leader 💡: Confidence meets Creativity! You're not just sure of your path, you're probably paving exciting new ones. Your scenes likely crackle with imaginative energy!",
    },
    {
      traits: ["discipline", "patience"], // Strict + Nurturer/Trainer elements
      hint: "⏳ The Master Shaper ⏳: Strictness combined with Patience is a powerful combo for teaching and guiding growth. You set clear expectations but give space for learning. Impressive!",
    },
    {
      traits: ["control", "precision"], // Master/Puppeteer elements
      hint: "🔬 The Detail Maestro 🔬: High Control and Precision? You likely orchestrate scenes with incredible finesse. Every detail matters, creating a truly immersive experience for your partner.",
    },
    // Submissive Focus
    {
      traits: ["obedience", "devotion"], // Classic Sub + Slave elements
      hint: "💖 The Loyal Heart 💖: Obedience fueled by deep Devotion creates a truly profound connection. Your desire to follow comes from a place of deep commitment. Beautiful!",
    },
    {
      traits: ["receptiveness", "exploration"], // Bottom + Adventurous elements
      hint: "🌟 The Open Explorer 🌟: High Receptiveness and a love for Exploration? You're ready to receive new experiences with open arms! Your journey is likely full of exciting discoveries.",
    },
    {
      traits: ["vulnerability", "trust"], // Core Submissive elements
      hint: "🤝 The Foundation of Connection 🤝: Trust and Vulnerability are the bedrock! When both are high, you create incredibly deep emotional intimacy. Cherish that openness.",
    },
    {
      traits: ["playfulness", "mischief"], // Brat + Playful elements
      hint: "🎉 The Agent of Chaos (the fun kind!) 🎉: Playfulness AND Mischief? You're likely the life of the party, always ready with a witty remark or a playful challenge. Keep sparkling!",
    },
    {
      traits: ["service", "anticipating needs"], // Servant elements
      hint: "🔮 The Attentive Aide 🔮: Excelling at Service and Anticipating Needs makes you seem almost psychic! You likely provide seamless, intuitive support that feels magical.",
    },
     {
      traits: ["painTolerance", "craving"], // Masochist + Painslut elements
      hint: "🔥 The Intensity Seeker 🔥: High Pain Tolerance combined with Craving intense experiences? You're drawn to the edge and find exhilaration there. Ride those waves safely!",
     }
  ],

  // --- Interesting Dynamics (High + Low / Potential Conflicts) ---
  interestingDynamics: [
    // Dominant Focus
    {
      traits: { high: "authority", low: "care" },
      hint: "🤔 The Firm Commander 🤔: Strong Authority but lower Care? Your leadership is clear, but remember to check in emotionally. Is your guidance landing gently, even when firm? Softness can amplify strength.",
    },
    {
      traits: { high: "control", low: "patience" },
      hint: "⚡️ The Impatient Orchestrator ⚡️: High Control but lower Patience? You have a clear vision, but might get frustrated if things don't go exactly to plan *immediately*. Breathe! Sometimes the process is part of the magic.",
    },
    {
      traits: { high: "sadism", low: "empathy" },
      hint: "🎭 The Intense Edge-Player 🎭: Enjoying Sadism but lower Empathy? You love pushing boundaries, which is thrilling! Double-check you're reading signals accurately. Explicit check-ins are your best friend here.",
    },
    // Submissive Focus
    {
      traits: { high: "obedience", low: "trust" },
      hint: "🚧 The Cautious Follower 🚧: High Obedience but lower Trust? You *want* to follow, but hesitation holds you back. What small steps could build more trust? Focus on clear communication about your feelings.",
    },
    {
      traits: { high: "rebellion", low: "playfulness" },
      hint: "😠 The Grumpy Resister? 😠: High Rebellion without much Playfulness might come across as genuinely defiant rather than cheeky. Is that the vibe you want? Injecting a little humor can keep the spark alive!",
    },
    {
      traits: { high: "vulnerability", low: "confidence" }, // Using a Dom trait here for context
      hint: "💧 The Open but Unsure Heart 💧: Showing Vulnerability is brave! If Confidence (in yourself or the dynamic) feels low, that openness might feel scary. Celebrate small acts of bravery. You are worthy.",
    },
    {
        traits: { high: "service", low: "obedience"},
        hint: "🤷 The Helpful Free Spirit 🤷: Love performing Acts of Service but not keen on strict Obedience? You find joy in helping, but on your own terms. Ensure your partner understands your motivation comes from care, not just compliance."
    }
  ],
  // Add more synergies and dynamics as needed!
};

// Helper function (optional, could live in app.js too)
export function findHintsForTraits(traitScores) {
  const hints = [];
  const highTraits = Object.entries(traitScores)
    .filter(([, score]) => score >= 4)
    .map(([name]) => name);
  const lowTraits = Object.entries(traitScores)
    .filter(([, score]) => score <= 2)
    .map(([name]) => name);

  // Check positive synergies
  synergyHints.highPositive.forEach((synergy) => {
    if (
      synergy.traits.every((trait) => highTraits.includes(trait))
    ) {
      hints.push({ type: 'positive', text: synergy.hint });
    }
  });

  // Check interesting dynamics
  synergyHints.interestingDynamics.forEach((dynamic) => {
    if (
      highTraits.includes(dynamic.traits.high) &&
      lowTraits.includes(dynamic.traits.low)
    ) {
      hints.push({ type: 'dynamic', text: dynamic.hint });
    }
     // Optional: Check reverse (low high, high low) if defined symmetrically
     else if (
       dynamic.traits.low && dynamic.traits.high && // Ensure both are defined
       lowTraits.includes(dynamic.traits.high) &&
       highTraits.includes(dynamic.traits.low)
     ) {
        // You might have specific hints for the reverse, or just note the pairing
        // For now, let's assume the defined one covers the dynamic
     }
  });

  return hints;
}
