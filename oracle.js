// === oracle.js ===

export const oracleReadings = {
  openings: [
    "The Compass whispers... ✨",
    "Today's energy points towards... 🧭",
    "Listen closely, the Oracle reveals... 🔮",
    "Your inner compass is tuned to... 💖",
    "Let's see where the needle lands today... 🌟",
  ],

  focusAreas: {
    // Can be expanded with trait-specific focuses
    traitBased: [
      "Nurturing your '{traitName}' side. How can you express it gently?",
      "The challenge and growth potential in your '{traitName}'. What small step beckons?",
      "The surprising strength found within your '{traitName}'. Own it!",
      "Balancing your '{traitName}' with its opposite. Where is the harmony?",
      "Celebrating the power of your '{traitName}'. Let it shine!",
    ],
    styleBased: [
      "Embracing the core essence of your '{styleName}' style.",
      "Exploring a playful aspect of '{styleName}'.",
      "Finding comfort and strength within your '{styleName}' expression.",
      "Communicating your needs clearly *as* a '{styleName}'.",
      "How can you bring more joy into your '{styleName}' practice today?",
    ],
    general: [
        "The power of clear communication today.",
        "Deepening trust, one small act at a time.",
        "Finding joy in the present moment of your dynamic.",
        "Honoring your boundaries with kindness.",
        "Exploring a new spark of curiosity.",
    ]
  },

  encouragements: [
    "Your journey is valid and beautiful. Keep exploring!",
    "Small steps create big shifts. Be patient with yourself.",
    "Authenticity is your superpower. Shine on!",
    "Communicate with courage and kindness.",
    "Trust your intuition; it knows the way.",
    "Safety and consent are the foundation for magic.",
    "You are worthy of pleasure and connection.",
    "Embrace the learning process with gentle curiosity.",
  ],

  closings: [
    "May your path be clear! 🧭",
    "Navigate wisely today. ✨",
    "Trust the journey. 💖",
    "Go forth and explore! 🌟",
    "The Compass guides you. 🔮",
  ],
};

// Helper function (in app.js)
/*
function getKinkOracleReading(person) {
  const reading = {};

  reading.opening = oracleReadings.openings[Math.floor(Math.random() * oracleReadings.openings.length)];

  // Determine focus (prioritize traits, then style, then general)
  let focusText = "";
  const traits = person?.traits ? Object.entries(person.traits).filter(([, score]) => score >= 1 && score <= 5) : [];
  if (traits.length > 0) {
      traits.sort((a, b) => { // Sort to find highest/lowest reliably
         if (Math.abs(a[1] - 3) > Math.abs(b[1] - 3)) return -1; // Prioritize extremes
         if (Math.abs(a[1] - 3) < Math.abs(b[1] - 3)) return 1;
         return 0; // Keep order if equally extreme
      });
      const focusTrait = traits[Math.floor(Math.random() * Math.min(traits.length, 3))]; // Focus on one of the top/bottom 3 extremes
      const traitName = focusTrait[0];
      const template = oracleReadings.focusAreas.traitBased[Math.floor(Math.random() * oracleReadings.focusAreas.traitBased.length)];
      focusText = template.replace('{traitName}', traitName);

  } else if (person?.style) {
       const template = oracleReadings.focusAreas.styleBased[Math.floor(Math.random() * oracleReadings.focusAreas.styleBased.length)];
       focusText = template.replace('{styleName}', person.style);
  } else {
       focusText = oracleReadings.focusAreas.general[Math.floor(Math.random() * oracleReadings.focusAreas.general.length)];
  }
   reading.focus = focusText;


  reading.encouragement = oracleReadings.encouragements[Math.floor(Math.random() * oracleReadings.encouragements.length)];
  reading.closing = oracleReadings.closings[Math.floor(Math.random() * oracleReadings.closings.length)];

  return reading;
}

// In showKinkOracle(personId) in app.js:
const readingData = getKinkOracleReading(person);
outputElement.innerHTML = `
    <p>${escapeHTML(readingData.opening)}</p>
    <p><strong>Focus:</strong> ${escapeHTML(readingData.focus)}</p>
    <p><em>${escapeHTML(readingData.encouragement)}</em></p>
    <p>${escapeHTML(readingData.closing)}</p>
`;
grantAchievement(person, 'kink_reading_oracle'); // Grant new achievement
*/
