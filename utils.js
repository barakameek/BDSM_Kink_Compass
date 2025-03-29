// === utils.js === (Corrected)
// Contains helper functions for KinkCompass, separated from core app logic and data.

// Import needed DATA structures from appData.js
import {
    bdsmData,
    achievementList,
    synergyHints,
    journalPrompts,
    // Assuming these are the correct export names from appData.js, matching the paraphrasing files
    subStyleSuggestions,
    domStyleSuggestions
} from './appData.js';

// --- Normalization & Paraphrasing (from paraphrasing_*.js) ---

/**
 * Normalizes a style name for consistent key lookup.
 * Converts to lowercase, removes emojis and content in parentheses, trims whitespace.
 * @param {string} name - The style name to normalize.
 * @returns {string} The normalized style key.
 */
function normalizeStyleKey(name) {
    if (!name) return '';
    // 1. Convert to lowercase
    // 2. Remove emojis (using a broader Unicode range)
    // 3. Remove anything in parentheses (like P/E)
    // 4. Trim whitespace
    const cleanedName = name
        .toLowerCase()
        // Remove common emojis and symbols - adjust range if needed
        .replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]+)/gu, '')
        .replace(/\(.*?\)/g, '') // Remove content in parentheses
        .replace(/ \/ /g, '/')   // Keep slashes if intended (like switch styles)
        .trim();
    // console.log(`Normalized "${name}" to "${cleanedName}"`); // DEBUG
    return cleanedName;
}

/**
 * Generates dynamic breakdown text for a SUBMISSIVE style based on trait scores.
 * @param {string} styleName - The name of the submissive style.
 * @param {object} traits - An object mapping trait names to scores (1-5).
 * @returns {{strengths: string, improvements: string}} Object containing text.
 */
export function getSubStyleBreakdown(styleName, traits) {
  if (!styleName || !traits) { console.warn("getSubStyleBreakdown called with invalid args:", styleName, traits); return { strengths: "Select a style first!", improvements: "Choose your path to get tips!" }; }
  const styleKey = normalizeStyleKey(styleName);
  const styleData = subStyleSuggestions[styleKey]; // Use imported suggestions from appData.js
  if (!styleData) { console.warn(`No suggestions found for submissive style key: ${styleKey}`); return { strengths: `You're crafting your unique ${styleName} sparkle! Keep exploring. 💕`, improvements: "Continue defining what this style means to you! 😸" }; }

  const roleData = bdsmData.submissive; // Use imported bdsmData from appData.js
  if (!roleData || !roleData.styles) { console.error("bdsmData.submissive or its styles are missing!"); return { strengths: "Error loading style data.", improvements: "Please check data source." }; }

  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  let traitScores = [];
  // Add scores from style-specific traits
  if (styleObj?.traits) { styleObj.traits.forEach(traitDef => { const score = parseInt(traits[traitDef.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  // Add scores from core traits
  if (roleData.coreTraits) { roleData.coreTraits.forEach(coreTrait => { const score = parseInt(traits[coreTrait.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }

  // Calculate average score, default to 3 if no scores found
  const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  // Clamp score index between 1 and 5
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];

  // Fallback if specific level data is missing
  if(!levelData) { console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`); if (scoreIndex >= 4) { return { strengths: `You're strongly embodying ${styleName}! ✨ Keep shining!`, improvements: `Explore nuances or teach others your ways! 🚀` }; } else if (scoreIndex <= 2) { return { strengths: `Exploring the foundations of ${styleName}! 🌱`, improvements: `Focus on communication and small steps! 🎯` }; } else { return { strengths: `Developing a balanced ${styleName} approach! 👍`, improvements: `Consider which aspects to lean into! 🤔` }; } }

  const { paraphrase, suggestion } = levelData;
  // Determine if the score represents a strength or an area for growth
  const isStrength = scoreIndex >= 4;
  const strengthsText = isStrength ? `✨ **${paraphrase}** ${suggestion}` : `🌱 Cultivating skills in ${styleName}! Keep growing!`;
  const improvementsText = isStrength ? `🚀 Explore the depths of ${styleName}! What's next?` : `🎯 **${paraphrase}** ${suggestion}`;
  return { strengths: strengthsText, improvements: improvementsText };
}

/**
 * Generates dynamic breakdown text for a DOMINANT style based on trait scores.
 * @param {string} styleName - The name of the dominant style.
 * @param {object} traits - An object mapping trait names to scores (1-5).
 * @returns {{strengths: string, improvements: string}} Object containing text.
 */
export function getDomStyleBreakdown(styleName, traits) {
  if (!styleName || !traits) { console.warn("getDomStyleBreakdown called with invalid args:", styleName, traits); return { strengths: "Select a style first!", improvements: "Choose your path to get tips!" }; }
  const styleKey = normalizeStyleKey(styleName);
  const styleData = domStyleSuggestions[styleKey]; // Use imported suggestions from appData.js
  if (!styleData) { console.warn(`No suggestions found for dominant style key: ${styleKey}`); return { strengths: `You're forging your own unique ${styleName} path! Keep exploring, Commander! 💪`, improvements: "Continue defining what this style means to you! 🔍" }; }

  const roleData = bdsmData.dominant; // Use imported bdsmData from appData.js
  if (!roleData || !roleData.styles) { console.error("bdsmData.dominant or its styles are missing!"); return { strengths: "Error loading style data.", improvements: "Please check data source." }; }

  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  let traitScores = [];
  // Add scores from style-specific traits
  if (styleObj?.traits) { styleObj.traits.forEach(traitDef => { const score = parseInt(traits[traitDef.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }
  // Add scores from core traits
  if (roleData.coreTraits) { roleData.coreTraits.forEach(coreTrait => { const score = parseInt(traits[coreTrait.name], 10); if (!isNaN(score)) { traitScores.push(score); } }); }

  // Calculate average score, default to 3 if no scores found
  const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  // Clamp score index between 1 and 5
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];

  // Fallback if specific level data is missing
   if(!levelData) { console.warn(`No paraphrase/suggestion found for style ${styleKey} at level ${scoreIndex}`); if (scoreIndex >= 4) { return { strengths: `You powerfully embody ${styleName}! 🔥`, improvements: `Refine your command! 🚀` }; } else if (scoreIndex <= 2) { return { strengths: `Exploring ${styleName} leadership! 🌱`, improvements: `Focus on communication! 🎯` }; } else { return { strengths: `Developing a balanced ${styleName} approach! 👍`, improvements: `Consider focus areas! 🤔` }; } }

  const { paraphrase, suggestion } = levelData;
  // Determine if the score represents a strength or an area for growth
  const isStrength = scoreIndex >= 4;
  const strengthsText = isStrength ? `✨ **${paraphrase}** ${suggestion}` : `🌱 Cultivating powerful skills in ${styleName}! Keep honing command!`;
  const improvementsText = isStrength ? `🚀 Expand the horizons of ${styleName} style! Conquer new challenges!` : `🎯 **${paraphrase}** ${suggestion}`;
  return { strengths: strengthsText, improvements: improvementsText };
}

// --- Achievement Helpers (from achievements.js) ---

/**
 * Checks if a persona object has a specific achievement.
 * @param {object} person - The persona object (must have an 'achievements' array).
 * @param {string} achievementId - The ID of the achievement to check.
 * @returns {boolean} True if the persona has the achievement, false otherwise.
 */
export function hasAchievement(person, achievementId) {
    // Ensure person and achievements array exist using optional chaining
    return person?.achievements?.includes(achievementId) ?? false;
}

/**
 * Grants an achievement to a persona object (mutates the object).
 * If the person object is null or empty, it attempts to grant a global achievement (tracked via localStorage).
 * @param {object | null} person - The persona object to grant the achievement to, or null/{} for global.
 * @param {string} achievementId - The ID of the achievement to grant.
 * @param {function} [showNotificationCallback] - Optional callback to display a notification (receives message, type).
 * @param {function} [saveCallback] - Optional callback to trigger saving data (like localStorage for persona update).
 * @returns {boolean} True if a NEW achievement was granted, false otherwise.
 */
export function grantAchievement(person, achievementId, showNotificationCallback, saveCallback) {
    // Validate achievement ID against the imported list
    if (!achievementId || !achievementList[achievementId]) {
        console.warn(`[GRANT_ACHIEVEMENT] Invalid or unknown achievement ID: ${achievementId}`);
        return false;
    }

    const details = achievementList[achievementId];

    // --- Handle Global Achievements (Not tied to a specific persona) ---
    // Check if person object is null, undefined, or empty
    if (!person || Object.keys(person).length === 0) {
        const storageKey = `kinkCompass_achievement_${achievementId}`;
        // Check if the achievement is already granted globally
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, 'true'); // Mark as granted
            console.log(`🏆 Global Achievement Unlocked: ${details.name}`);
            // Show notification if callback provided
            if (showNotificationCallback && typeof showNotificationCallback === 'function') {
                showNotificationCallback(`Achieved: ${details.name}`, "achievement");
            }
            // No persona object to save here, localStorage is the persistence mechanism
            return true; // New global achievement granted
        }
        // Already had the global achievement
        return false;
    }

    // --- Handle Persona-Specific Achievements ---
    // Initialize achievements array if it's missing on the person object
    if (!person.achievements) {
        person.achievements = [];
    }

    // Check if the persona already has this achievement
    if (!hasAchievement(person, achievementId)) {
        // Grant the achievement
        person.achievements.push(achievementId);
        console.log(`🏆 Achievement Unlocked for ${person.name || 'Persona'}: ${details.name}`);

        // Show notification if callback provided
        if (showNotificationCallback && typeof showNotificationCallback === 'function') {
             showNotificationCallback(`Achieved: ${details.name}`, "achievement");
        }
        // Trigger save mechanism if callback provided (e.g., saveToLocalStorage)
        if (saveCallback && typeof saveCallback === 'function') {
            saveCallback();
        }
        return true; // Indicate a new achievement was granted
    }

    // Persona already had this achievement
    return false;
}


/**
 * Gets the details (name, description) for a specific achievement ID.
 * @param {string} achievementId - The ID of the achievement.
 * @returns {object | null} The achievement details object or null if not found.
 */
export function getAchievementDetails(achievementId) {
    // Return the details from the imported list, or null if the ID doesn't exist
    return achievementList[achievementId] || null;
}

// --- Synergy Hint Helper (from synergyHints.js) ---

/**
 * Finds synergy hints based on provided trait scores.
 * @param {object} traitScores - Object mapping trait names to scores (e.g., { obedience: 4, rebellion: 1 }).
 * @returns {Array<{type: string, text: string}>} An array of hint objects.
 */
export function findHintsForTraits(traitScores) {
  const hints = [];
  // Check if necessary data structures exist
  if (!traitScores || typeof synergyHints !== 'object' || !synergyHints.highPositive || !synergyHints.interestingDynamics) {
      console.warn("[findHintsForTraits] Missing traitScores or synergyHints data.");
      return hints; // Return empty array if data is missing
  }

  // Filter traits into high (>= 4) and low (<= 2) categories
  const highTraits = Object.entries(traitScores)
    .filter(([, score]) => score >= 4)
    .map(([name]) => name);
  const lowTraits = Object.entries(traitScores)
    .filter(([, score]) => score <= 2)
    .map(([name]) => name);

  // --- Check Positive Synergies (High + High) ---
  synergyHints.highPositive.forEach((synergy) => {
    // Check if all required traits for this synergy are present in the highTraits list
    if (
      synergy.traits?.every((trait) => highTraits.includes(trait))
    ) {
      hints.push({ type: 'positive', text: synergy.hint });
    }
  });

  // --- Check Interesting Dynamics (High + Low) ---
  synergyHints.interestingDynamics.forEach((dynamic) => {
    // Check if the specific high trait and low trait are present in their respective lists
    if (
      dynamic.traits?.high && dynamic.traits?.low &&
      highTraits.includes(dynamic.traits.high) &&
      lowTraits.includes(dynamic.traits.low)
    ) {
      hints.push({ type: 'dynamic', text: dynamic.hint });
    }
     // Optional: Check for reverse dynamics if needed (e.g., low Authority + high Care)
     // Currently, the logic assumes the defined 'high' and 'low' cover the intended dynamic.
  });

  return hints;
}


// --- Prompt Helper (from prompts.js) ---

/**
 * Gets a random journal prompt from the predefined list.
 * @returns {string} A random journal prompt or a fallback message.
 */
export function getRandomPrompt() {
    // Use the imported journalPrompts array
    if (!journalPrompts || journalPrompts.length === 0) {
        console.warn("[getRandomPrompt] Journal prompts data is missing or empty.");
        return "Reflect on your journey today..."; // Fallback message
    }
    // Select a random index
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    return journalPrompts[randomIndex];
}


// --- General Utilities (can be expanded) ---

/**
 * Escapes HTML special characters in a string to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string. Returns empty string if input is not a string.
 */
export function escapeHTML(str) {
  // Ensure input is a string before attempting to replace
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '''); // Corrected line
}

/**
 * Returns an emoji flair based on a score (1-5).
 * @param {number|string} score - The score.
 * @returns {string} An emoji string or empty string if score is invalid.
 */
export function getFlairForScore(score) {
    const s = parseInt(score); // Ensure score is treated as a number
    // Check if the parsed score is a valid number
    if(isNaN(s)) return '';
    // Return emoji based on the score value
    if(s === 5) return '🌟'; // Max score
    if(s === 4) return '✨'; // High score
    if(s === 3) return '👍'; // Medium score
    if(s === 2) return '🌱'; // Low score
    if(s === 1) return '💧'; // Min score
    return ''; // Return empty string if score is outside the 1-5 range
}
