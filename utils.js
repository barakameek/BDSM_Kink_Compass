// === utils.js === (Revised & Enhanced)
// Contains helper functions for KinkCompass, separated from core app logic and data.

// Import needed DATA structures from appData.js
import {
    bdsmData,
    achievementList,
    synergyHints,
    journalPrompts,
    // Assuming these are the correct export names from appData.js
    subStyleSuggestions,
    domStyleSuggestions
} from './appData.js';

// --- Normalization & Paraphrasing ---

/**
 * Normalizes a style name for consistent key lookup.
 * Converts to lowercase, removes emojis and content in parentheses, trims whitespace.
 * Handles potential null/undefined input gracefully.
 * @param {string | null | undefined} name - The style name to normalize.
 * @returns {string} The normalized style key, or empty string if input is invalid.
 */
function normalizeStyleKey(name) {
    if (typeof name !== 'string' || !name) {
        // console.warn("[normalizeStyleKey] Received invalid input:", name); // Optional warning
        return '';
    }
    try {
        const cleanedName = name
            .toLowerCase()
            // Remove common emojis and symbols - adjusted range for broader coverage
            .replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}]+)/gu, '')
            .replace(/\(.*?\)/g, '') // Remove content in parentheses
            .replace(/ \/ /g, '/')   // Keep slashes if intended (like switch styles) but remove surrounding spaces
            .replace(/[^\w\s/-]/g, '') // Remove remaining non-word chars except spaces, slashes, hyphens
            .trim();
        return cleanedName;
    } catch (error) {
        console.error(`[normalizeStyleKey] Error processing name "${name}":`, error);
        return ''; // Return empty string on error
    }
}

/**
 * Generates dynamic breakdown text for a SUBMISSIVE style based on trait scores.
 * Includes improved error handling and fallback messages.
 * @param {string} styleName - The name of the submissive style.
 * @param {object} traits - An object mapping trait names to scores (1-5).
 * @returns {{strengths: string, improvements: string}} Object containing markdown-ready text.
 */
export function getSubStyleBreakdown(styleName, traits) {
  if (!styleName || !traits || typeof traits !== 'object') {
    console.warn("getSubStyleBreakdown called with invalid args:", styleName, traits);
    return { strengths: "ℹ️ Select a style first!", improvements: "ℹ️ Choose your path to get tips!" };
  }

  const styleKey = normalizeStyleKey(styleName);
  if (!styleKey) {
      return { strengths: `⚠️ Invalid style name provided.`, improvements: `Please check the style name.` };
  }

  // Ensure suggestions data exists
  if (!subStyleSuggestions || typeof subStyleSuggestions !== 'object') {
      console.error("Submissive style suggestions data (subStyleSuggestions) is missing or invalid.");
      return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Please check appData.js." };
  }

  const styleData = subStyleSuggestions[styleKey];
  if (!styleData) {
    console.warn(`No suggestions found for submissive style key: ${styleKey} (normalized from "${styleName}")`);
    // Provide a more engaging fallback
    return {
        strengths: `✨ You're exploring the unique facets of **${escapeHTML(styleName)}**! Keep defining what this means to you. 💕`,
        improvements: `🌱 Every step on this path is valuable. What aspect calls to you next? 😸`
    };
  }

  // Ensure core BDSM data exists
  const roleData = bdsmData?.submissive;
  if (!roleData || !roleData.styles) {
    console.error("bdsmData.submissive or its styles are missing!");
    return { strengths: "❌ Error loading core style data.", improvements: "Please check appData.js." };
  }

  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  if (!styleObj) {
       console.warn(`Could not find style object for key: ${styleKey} in bdsmData`);
       // Fallback using just the name if object isn't found (less accurate score calc)
  }

  let traitScores = [];
  // Collect scores for traits associated with this specific style (if found)
  if (styleObj?.traits) {
    styleObj.traits.forEach(traitDef => {
      const score = parseInt(traits[traitDef.name], 10);
      if (!isNaN(score)) { traitScores.push(score); }
    });
  }
  // Collect scores for core submissive traits
  if (roleData.coreTraits) {
    roleData.coreTraits.forEach(coreTrait => {
      const score = parseInt(traits[coreTrait.name], 10);
      if (!isNaN(score)) { traitScores.push(score); }
    });
  }

  // Calculate average score, default to 3 if no relevant traits found/scored
  const avgScore = traitScores.length > 0
    ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
    : 3;

  // Clamp score to be within 1-5 range
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];

  if (!levelData || !levelData.paraphrase || !levelData.suggestion) {
    console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`);
    // Provide more descriptive generic fallbacks based on score level
    if (scoreIndex >= 4) {
        return { strengths: `🌟 You strongly embody **${escapeHTML(styleName)}**! Keep shining brightly!`, improvements: `🚀 Explore deeper nuances or consider mentoring others in your way!` };
    } else if (scoreIndex <= 2) {
        return { strengths: `💧 Exploring the foundations of **${escapeHTML(styleName)}**. Be patient and curious!`, improvements: `🌱 Focus on clear communication and taking small, comfortable steps!` };
    } else {
        return { strengths: `👍 Developing a balanced approach to **${escapeHTML(styleName)}**. Well done!`, improvements: `🤔 Consider which specific aspects you'd like to lean into more!` };
    }
  }

  const { paraphrase, suggestion } = levelData;
  const isStrength = scoreIndex >= 4; // Define strength as 4 or 5

  // Format output clearly using Markdown-like syntax
  const strengthsText = isStrength
    ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`
    : `🌱 Cultivating skills in **${escapeHTML(styleName)}**! Keep growing!`;
  const improvementsText = isStrength
    ? `🚀 Explore the depths of **${escapeHTML(styleName)}**! What new horizons await?`
    : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;

  return { strengths: strengthsText, improvements: improvementsText };
}

/**
 * Generates dynamic breakdown text for a DOMINANT style based on trait scores.
 * Includes improved error handling and fallback messages.
 * @param {string} styleName - The name of the dominant style.
 * @param {object} traits - An object mapping trait names to scores (1-5).
 * @returns {{strengths: string, improvements: string}} Object containing markdown-ready text.
 */
export function getDomStyleBreakdown(styleName, traits) {
    if (!styleName || !traits || typeof traits !== 'object') {
        console.warn("getDomStyleBreakdown called with invalid args:", styleName, traits);
        return { strengths: "ℹ️ Select a style first!", improvements: "ℹ️ Choose your path to get tips!" };
    }

    const styleKey = normalizeStyleKey(styleName);
     if (!styleKey) {
        return { strengths: `⚠️ Invalid style name provided.`, improvements: `Please check the style name.` };
    }

    // Ensure suggestions data exists
    if (!domStyleSuggestions || typeof domStyleSuggestions !== 'object') {
        console.error("Dominant style suggestions data (domStyleSuggestions) is missing or invalid.");
        return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Please check appData.js." };
    }

    const styleData = domStyleSuggestions[styleKey];
    if (!styleData) {
        console.warn(`No suggestions found for dominant style key: ${styleKey} (normalized from "${styleName}")`);
        // Provide a more engaging fallback
        return {
            strengths: `💪 You're forging your own unique **${escapeHTML(styleName)}** path! Keep exploring, Commander!`,
            improvements: `🔍 Continue defining what this powerful style means to you!`
        };
    }

    // Ensure core BDSM data exists
    const roleData = bdsmData?.dominant;
    if (!roleData || !roleData.styles) {
        console.error("bdsmData.dominant or its styles are missing!");
        return { strengths: "❌ Error loading core style data.", improvements: "Please check appData.js." };
    }

    const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
     if (!styleObj) {
       console.warn(`Could not find style object for key: ${styleKey} in bdsmData`);
       // Fallback using just the name if object isn't found (less accurate score calc)
    }

    let traitScores = [];
    // Collect scores for traits associated with this specific style (if found)
    if (styleObj?.traits) {
        styleObj.traits.forEach(traitDef => {
            const score = parseInt(traits[traitDef.name], 10);
            if (!isNaN(score)) { traitScores.push(score); }
        });
    }
    // Collect scores for core dominant traits
    if (roleData.coreTraits) {
        roleData.coreTraits.forEach(coreTrait => {
            const score = parseInt(traits[coreTrait.name], 10);
            if (!isNaN(score)) { traitScores.push(score); }
        });
    }

    // Calculate average score, default to 3 if no relevant traits found/scored
    const avgScore = traitScores.length > 0
        ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length)
        : 3;

    // Clamp score to be within 1-5 range
    const scoreIndex = Math.max(1, Math.min(5, avgScore));
    const levelData = styleData[scoreIndex];

    if (!levelData || !levelData.paraphrase || !levelData.suggestion) {
        console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`);
        // Provide more descriptive generic fallbacks based on score level
        if (scoreIndex >= 4) {
            return { strengths: `🔥 You powerfully embody **${escapeHTML(styleName)}**! Your presence is felt!`, improvements: `🚀 Refine your command or explore new ways to express your authority!` };
        } else if (scoreIndex <= 2) {
            return { strengths: `🌱 Exploring the foundations of **${escapeHTML(styleName)}** leadership.`, improvements: `🎯 Focus on clear communication and understanding your partner's needs!` };
        } else {
            return { strengths: `👍 Developing a balanced **${escapeHTML(styleName)}** approach. Strong foundation!`, improvements: `🤔 Consider which areas of command you want to focus on developing next!` };
        }
    }

    const { paraphrase, suggestion } = levelData;
    const isStrength = scoreIndex >= 4; // Define strength as 4 or 5

    // Format output clearly using Markdown-like syntax
    const strengthsText = isStrength
        ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`
        : `🌱 Cultivating powerful skills in **${escapeHTML(styleName)}**! Keep honing your command!`;
    const improvementsText = isStrength
        ? `🚀 Expand the horizons of your **${escapeHTML(styleName)}** style! Conquer new challenges!`
        : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;

    return { strengths: strengthsText, improvements: improvementsText };
}


// --- Achievement Helpers ---

/**
 * Checks if a persona object has a specific achievement.
 * Handles potential null/undefined persona or achievements array.
 * @param {object | null | undefined} person - The persona object (must have an 'achievements' array).
 * @param {string} achievementId - The ID of the achievement to check.
 * @returns {boolean} True if the persona has the achievement, false otherwise.
 */
export function hasAchievement(person, achievementId) {
    // Added check for achievementId validity
    if (!achievementId || !achievementList[achievementId]) {
        // console.warn(`[hasAchievement] Invalid or unknown achievement ID checked: ${achievementId}`); // Can be noisy
        return false;
    }
    // Gracefully handle missing person or achievements array
    return person?.achievements?.includes(achievementId) ?? false;
}

/**
 * Grants an achievement to a persona object or globally.
 * Mutates the person object if provided.
 * Uses localStorage for global achievements.
 * @param {object | null | undefined} person - The persona object to grant the achievement to, or null/undefined/{} for global.
 * @param {string} achievementId - The ID of the achievement to grant.
 * @param {function} [showNotificationCallback] - Optional callback to display a notification (receives message, type).
 * @param {function} [saveCallback] - Optional callback to trigger saving data (e.g., saving the updated person).
 * @returns {boolean} True if a NEW achievement was granted, false otherwise.
 */
export function grantAchievement(person, achievementId, showNotificationCallback, saveCallback) {
    if (!achievementId || !achievementList[achievementId]) {
        console.warn(`[GRANT_ACHIEVEMENT] Invalid or unknown achievement ID attempted: ${achievementId}`);
        return false;
    }

    const details = achievementList[achievementId];

    // --- Handle Global Achievements (Improved check for non-persona targets) ---
    if (!person || typeof person !== 'object' || Object.keys(person).length === 0 || !person.id) { // Check if it's not a valid persona object
        const storageKey = `kinkCompass_global_achievement_${achievementId}`; // Prefix global to avoid conflicts
        try {
            if (!localStorage.getItem(storageKey)) {
                localStorage.setItem(storageKey, 'true');
                console.log(`🏆 Global Achievement Unlocked: ${details.name}`);
                if (showNotificationCallback && typeof showNotificationCallback === 'function') {
                    // Pass the full details object for potentially richer notifications
                    showNotificationCallback(`Achieved: ${details.name}!`, "achievement", { details });
                }
                return true; // New global achievement granted
            }
        } catch (e) {
            console.error(`[GRANT_ACHIEVEMENT] Error accessing localStorage for global achievement ${achievementId}:`, e);
        }
        return false; // Already had global achievement or error occurred
    }

    // --- Handle Persona-Specific Achievements ---
    // Ensure achievements array exists on the valid persona object
    if (!Array.isArray(person.achievements)) {
        person.achievements = [];
    }

    if (!person.achievements.includes(achievementId)) {
        person.achievements.push(achievementId);
        person.achievements.sort(); // Keep achievements sorted for consistency (optional)
        console.log(`🏆 Achievement Unlocked for ${person.name || `Persona ${person.id?.substring(0, 4)}`}: ${details.name}`);

        if (showNotificationCallback && typeof showNotificationCallback === 'function') {
             showNotificationCallback(`Achieved: ${details.name}!`, "achievement", { details, personaName: person.name });
        }
        // Trigger save callback immediately after modification
        if (saveCallback && typeof saveCallback === 'function') {
            try {
                saveCallback(); // Ensure data persistence
            } catch (e) {
                console.error(`[GRANT_ACHIEVEMENT] Error in saveCallback for persona ${person.id}:`, e);
            }
        } else {
             console.warn(`[GRANT_ACHIEVEMENT] Granted achievement "${achievementId}" to ${person.name}, but no saveCallback provided.`);
        }
        return true; // New persona achievement granted
    }
    return false; // Already had persona achievement
}


/**
 * Gets the details (name, description) for a specific achievement ID.
 * @param {string} achievementId - The ID of the achievement.
 * @returns {object | null} The achievement details object or null if not found.
 */
export function getAchievementDetails(achievementId) {
    return achievementList?.[achievementId] || null; // Use optional chaining
}

// --- Synergy Hint Helper ---

/**
 * Finds synergy hints based on provided trait scores.
 * Returns both positive synergies and interesting dynamics.
 * @param {object | null | undefined} traitScores - Object mapping trait names to scores (e.g., { obedience: 4, rebellion: 1 }).
 * @returns {Array<{type: 'positive' | 'dynamic', text: string}>} An array of hint objects. Returns empty array if input is invalid.
 */
export function findHintsForTraits(traitScores) {
  const hints = [];
  // Validate input and required data structure more thoroughly
  if (!traitScores || typeof traitScores !== 'object' || Object.keys(traitScores).length === 0 ||
      !synergyHints || typeof synergyHints !== 'object' ||
      !Array.isArray(synergyHints.highPositive) || !Array.isArray(synergyHints.interestingDynamics)) {
      console.warn("[findHintsForTraits] Invalid traitScores or missing/invalid synergyHints data structure in appData.js.");
      return hints; // Return empty array early
  }

  // Filter traits into high (>= 4) and low (<= 2) categories
  const highTraits = Object.entries(traitScores)
    .filter(([, score]) => parseInt(score, 10) >= 4)
    .map(([name]) => name);
  const lowTraits = Object.entries(traitScores)
    .filter(([, score]) => parseInt(score, 10) <= 2)
    .map(([name]) => name);

  // Check for High Positive Synergies
  synergyHints.highPositive.forEach((synergy) => {
      // Ensure synergy definition is valid before checking
      if (synergy?.traits && Array.isArray(synergy.traits) && synergy.traits.length > 0 && synergy.hint) {
          // Check if *all* required traits for the synergy are present in the highTraits list
          if (synergy.traits.every((trait) => highTraits.includes(trait))) {
              hints.push({ type: 'positive', text: synergy.hint });
          }
      } else {
          console.warn("[findHintsForTraits] Skipping invalid highPositive synergy definition:", synergy);
      }
  });

  // Check for Interesting Dynamics (High/Low combinations)
  synergyHints.interestingDynamics.forEach((dynamic) => {
      // Ensure dynamic definition is valid
      if (dynamic?.traits?.high && dynamic.traits?.low && dynamic.hint) {
          // Check if the required high trait is in highTraits AND the required low trait is in lowTraits
          if (highTraits.includes(dynamic.traits.high) && lowTraits.includes(dynamic.traits.low)) {
              hints.push({ type: 'dynamic', text: dynamic.hint });
          }
      } else {
           console.warn("[findHintsForTraits] Skipping invalid interestingDynamics definition:", dynamic);
      }
  });

  // Consider limiting the number of hints returned? E.g., return hints.slice(0, 3);
  return hints;
}


// --- Prompt Helper ---

/**
 * Gets a random journal prompt from the predefined list.
 * Handles empty or invalid prompt data.
 * @returns {string} A random journal prompt or a fallback message.
 */
export function getRandomPrompt() {
    if (!Array.isArray(journalPrompts) || journalPrompts.length === 0) {
        console.warn("[getRandomPrompt] Journal prompts data is missing or empty in appData.js.");
        return "Reflect on your journey today... What felt significant?"; // Slightly enhanced fallback
    }
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    const prompt = journalPrompts[randomIndex];

    // Basic validation of the selected prompt
    if (typeof prompt !== 'string' || prompt.trim() === '') {
         console.warn(`[getRandomPrompt] Found invalid prompt at index ${randomIndex}:`, prompt);
         return "Consider a recent experience. What did you learn about yourself?"; // Alternative fallback
    }

    return prompt;
}


// --- General Utilities ---

/**
 * Escapes HTML special characters in a string to prevent XSS.
 * Returns empty string if input is not a valid string.
 * CORRECTED IMPLEMENTATION.
 * @param {string | null | undefined} str - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return ''; // Handles null, undefined, non-strings
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '''); // Use ' for wider compatibility than '
}

/**
 * Returns an emoji flair based on a score (1-5).
 * Handles invalid input gracefully.
 * @param {number|string|null|undefined} score - The score.
 * @returns {string} An emoji string or empty string if score is invalid.
 */
export function getFlairForScore(score) {
    const s = parseInt(score, 10); // Use radix 10
    if(isNaN(s) || s < 1 || s > 5) return ''; // Check for NaN and range

    // Using a more direct mapping
    const flairs = {
        5: '🌟', // Top score
        4: '✨', // High score
        3: '👍', // Mid score
        2: '🌱', // Low score
        1: '💧'  // Lowest score
    };
    return flairs[s] || ''; // Return mapped flair or empty string
}

/**
 * Generates a simple unique ID. Not cryptographically secure.
 * Useful for new personas or goals if one isn't provided.
 * @returns {string} A unique-ish string.
 */
export function generateSimpleId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Debounces a function: Ensures the function is only called after
 * a certain period of inactivity.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {function} The debounced function.
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
