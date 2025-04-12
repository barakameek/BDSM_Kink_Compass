--- START OF FILE utils.js ---

// === utils.js === (Revised & Enhanced - v2.8.8 Corrected)
// Contains helper functions for KinkCompass, separated from core app logic and data.

// Import needed DATA structures from appData.js
import {
    bdsmData,
    achievementList,
    synergyHints,
    journalPrompts,
    subStyleSuggestions,
    domStyleSuggestions,
    glossaryTerms // Added for escapeHTML context (though not strictly needed for function)
} from './appData.js';

// --- Normalization & Paraphrasing ---

export function normalizeStyleKey(name) {
    if (typeof name !== 'string' || !name) {
        // Added basic type check
        console.warn(`[normalizeStyleKey] Received invalid input: ${typeof name}`, name);
        return '';
    }
    try {
        // Keep cleaning logic as is, appears reasonable
        const cleanedName = name
            .toLowerCase()
            // Remove emojis (improved regex range slightly)
            .replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}]+)/gu, '')
            // Remove content within parentheses ()
            .replace(/\(.*?\)/g, '')
             // Normalize space around slash
            .replace(/ \/ /g, '/')
            // Remove non-alphanumeric chars except whitespace, hyphens, slashes
            .replace(/[^\w\s/-]/g, '')
            .trim();
        return cleanedName;
    } catch (error) {
        console.error(`[normalizeStyleKey] Error processing name "${name}":`, error);
        return ''; // Return empty string on error
    }
}

// Consolidated getSubStyleBreakdown and getDomStyleBreakdown
export function getStyleBreakdown(styleName, traits, role) {
    if (!styleName || !traits || typeof traits !== 'object' || !role) {
        console.warn("getStyleBreakdown called with invalid args:", styleName, traits, role);
        return { strengths: "ℹ️ Select role & style first!", improvements: "ℹ️ Choose your path to get tips!" };
    }

    const styleKey = normalizeStyleKey(styleName);
    if (!styleKey) {
        console.warn(`getStyleBreakdown: Could not normalize style name: ${styleName}`);
        return { strengths: `⚠️ Invalid style name provided.`, improvements: `Please check the style name.` };
    }

    let suggestionsData, roleData, styleType;
    // Determine data source based on role (handle switch by checking where style exists)
    if (role === 'submissive' || (role === 'switch' && subStyleSuggestions[styleKey])) {
        suggestionsData = subStyleSuggestions;
        roleData = bdsmData?.submissive;
        styleType = 'sub';
    } else if (role === 'dominant' || (role === 'switch' && domStyleSuggestions[styleKey])) {
        suggestionsData = domStyleSuggestions;
        roleData = bdsmData?.dominant;
        styleType = 'dom';
    } else if (role === 'switch') {
        // Generic Switch breakdown if style not in sub/dom suggestions
        const switchStyleData = bdsmData.switch?.styles?.find(s => normalizeStyleKey(s.name) === styleKey);
        if (switchStyleData) {
             console.log(`Using generic Switch breakdown for style key: ${styleKey}.`);
             return { strengths: `✨ Embracing **${escapeHTML(styleName)}** versatility! Adaptable and intuitive. ✨`, improvements: `🌱 Focus on clear communication during role shifts. Explore both Dom & Sub aspects.` };
        } else {
            console.error(`Style key "${styleKey}" not found for role "switch" in bdsmData.`);
             return { strengths: "❌ Error: Unknown Switch style.", improvements: "Please check data." };
        }
    } else {
        console.error(`Invalid role "${role}" provided to getStyleBreakdown.`);
        return { strengths: "❌ Error: Invalid role.", improvements: "Please check data." };
    }

    // Check data structures are valid
    if (!suggestionsData || typeof suggestionsData !== 'object') {
        console.error(`${styleType === 'sub' ? 'Submissive' : 'Dominant'} style suggestions data missing or invalid.`);
        return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Please check appData.js." };
    }
    if (!roleData?.styles || !roleData?.coreTraits) {
        console.error(`bdsmData.${roleData?.roleName?.toLowerCase() || role} missing styles or coreTraits!`);
        return { strengths: "❌ Error loading core style data.", improvements: "Please check appData.js." };
    }

    const styleData = suggestionsData[styleKey];
    if (!styleData) {
        console.warn(`No suggestions found for ${styleType} key: ${styleKey}. Providing default text.`);
        const defaultStrength = styleType === 'sub' ? `✨ Exploring **${escapeHTML(styleName)}**! Keep defining what this means to you. 💕` : `💪 Forging your **${escapeHTML(styleName)}** path! Keep exploring the nuances!`;
        const defaultImprovement = styleType === 'sub' ? `🌱 Reflect on which core Submissive traits resonate most.` : `🔍 Reflect on which core Dominant traits drive this style.`;
        return { strengths: defaultStrength, improvements: defaultImprovement };
    }

    // Find the specific style object to determine relevant traits
    const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
    let traitScores = [];
    // Only consider traits defined for this style or core traits for the role
    const relevantTraitNames = new Set(roleData.coreTraits.map(t => t.name));
    styleObj?.traits?.forEach(t => relevantTraitNames.add(t.name));

    relevantTraitNames.forEach(traitName => {
        const score = parseInt(traits[traitName], 10);
        if (!isNaN(score)) {
            traitScores.push(score);
        }
    });

    // Calculate average score based only on relevant traits
    const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
    const scoreIndex = Math.max(1, Math.min(5, avgScore)); // Clamp score index between 1 and 5
    const levelData = styleData[scoreIndex];

    if (!levelData?.paraphrase || !levelData?.suggestion) {
        console.warn(`No paraphrase/suggestion for ${styleKey} at calculated level ${scoreIndex}`);
        // Provide role-specific fallbacks based on score index
        if (scoreIndex >= 4) {
            const strength = styleType === 'sub' ? `🌟 Strong resonance with **${escapeHTML(styleName)}**! Shine on!` : `🔥 Powerful expression of **${escapeHTML(styleName)}**! Impressive!`;
            const improvement = styleType === 'sub' ? `🚀 Explore deeper nuances or complementary styles!` : `🚀 Refine your command or explore leadership depth!`;
            return { strengths: strength, improvements: improvement };
        }
        if (scoreIndex <= 2) {
            const strength = styleType === 'sub' ? `💧 Exploring **${escapeHTML(styleName)}**. Be patient with your journey!` : `🌱 Exploring **${escapeHTML(styleName)}** leadership. Focus on foundations.`;
            const improvement = `🎯 Focus on communication and building core ${styleType === 'sub' ? 'submissive' : 'dominant'} traits!`;
            return { strengths: strength, improvements: improvement };
        }
        // Default fallback for score 3
        const strength = `👍 Balanced **${escapeHTML(styleName)}** approach! Good foundation.`;
        const improvement = `🤔 Consider which specific traits of **${escapeHTML(styleName)}** you want to focus on next.`;
        return { strengths: strength, improvements: improvement };
    }

    const { paraphrase, suggestion } = levelData;

    // Escape HTML content here before inserting
    const escapedParaphrase = escapeHTML(paraphrase);
    const escapedSuggestion = escapeHTML(suggestion);
    const escapedStyleNameHTML = `<strong>${escapeHTML(styleName)}</strong>`; // Bold the style name

    // Determine which part is strength/improvement based on score
    let strengthsText, improvementsText;
    if (scoreIndex >= 3) { // Levels 3, 4, 5 emphasize the positive paraphrase
        strengthsText = `✨ ${escapedParaphrase}.`;
        improvementsText = `🌱 ${escapedSuggestion}`;
    } else { // Levels 1, 2 emphasize the suggestion as the area to work on
        strengthsText = `🌱 Working towards ${escapedStyleNameHTML}. Keep exploring!`;
        improvementsText = `🎯 ${escapedParaphrase}. ${escapedSuggestion}`;
    }

    // Add general encouragement based on role
    if (styleType === 'sub') {
        strengthsText += ` Embracing your ${escapedStyleNameHTML} side is a journey! 💕`;
        improvementsText += ` Reflect on how this feels for you. 😸`;
    } else { // dom
        strengthsText += ` Leading as ${escapedStyleNameHTML} takes practice! 💪`;
        improvementsText += ` Consider how this suggestion aligns with your goals. 🔍`;
    }

    return { strengths: strengthsText, improvements: improvementsText };
}


// Deprecated functions - use getStyleBreakdown instead
export function getSubStyleBreakdown(styleName, traits) {
    console.warn("DEPRECATED: Use getStyleBreakdown(styleName, traits, 'submissive') instead of getSubStyleBreakdown.");
    return getStyleBreakdown(styleName, traits, 'submissive');
}
export function getDomStyleBreakdown(styleName, traits) {
    console.warn("DEPRECATED: Use getStyleBreakdown(styleName, traits, 'dominant') instead of getDomStyleBreakdown.");
    return getStyleBreakdown(styleName, traits, 'dominant');
}
// --- End of Consolidation ---

export function hasAchievement(person, achievementId) {
    if (!achievementId || !achievementList[achievementId]) { return false; }
    // Ensure person is valid and has achievements array
    // Check global achievements if person is null/empty
    if (!person || typeof person !== 'object' || Object.keys(person).length === 0) {
        try {
            return localStorage.getItem(`kinkCompass_global_achievement_${achievementId}`) === 'true';
        } catch (e) {
             console.error(`Error checking global achievement ${achievementId}:`, e);
             return false;
        }
    }
    // Check persona achievements
    return person && Array.isArray(person.achievements) && person.achievements.includes(achievementId);
}

export function grantAchievement(person, achievementId, showNotificationCallback, saveCallback = null) {
    if (!achievementId || !achievementList[achievementId]) {
        console.warn(`Grant: Invalid or unknown achievement ID: ${achievementId}`);
        return false;
    }
    const details = achievementList[achievementId];

    // Handle global achievements (no specific person)
    if (!person || typeof person !== 'object' || Object.keys(person).length === 0 || !person.id) {
        const storageKey = `kinkCompass_global_achievement_${achievementId}`;
        try {
            if (!localStorage.getItem(storageKey)) {
                localStorage.setItem(storageKey, 'true');
                console.log(`🏆 Global Achievement Granted: ${details.name}`);
                // FIX: Added check for valid callback function
                if (showNotificationCallback && typeof showNotificationCallback === 'function') {
                    showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details });
                } else {
                    console.warn(`[grantAchievement] showNotificationCallback is not a function for global achievement ${achievementId}`);
                }
                return true; // Indicate achievement was newly granted
            }
        } catch (e) {
            console.error(`Grant Global LS Error for ${achievementId}:`, e);
        }
        return false; // Achievement already existed or error occurred
    }

    // Handle persona-specific achievements
    // Ensure achievements array exists
    if (!Array.isArray(person.achievements)) {
        person.achievements = [];
    }

    if (!person.achievements.includes(achievementId)) {
        person.achievements.push(achievementId);
        // Sorting achievements is usually not necessary unless required for specific display logic.
        // person.achievements.sort(); // Optional: uncomment if sorting is desired.
        console.log(`🏆 Persona Achievement Granted for ${person.name || '?'}: ${details.name}`);

        // FIX: Added check for valid callback function
        if (showNotificationCallback && typeof showNotificationCallback === 'function') {
             showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details: details, personaName: person.name });
        } else {
            console.warn(`[grantAchievement] showNotificationCallback is not a function for achievement ${achievementId} on persona ${person.name}`);
        }

        // FIX: Added check for valid callback function (and only call if needed)
        if (saveCallback && typeof saveCallback === 'function') {
            try {
                saveCallback(); // Call the provided save function
            } catch (e) {
                console.error(`Grant Save Error for persona ${person.id}, achievement ${achievementId}:`, e);
            }
        }
        // Removed warning about missing saveCallback, as it might not always be needed here.
        // Let the calling context decide if a save is necessary after granting.

        return true; // Indicate achievement was newly granted
    }
    return false; // Achievement already existed
}


export function getAchievementDetails(achievementId) {
    // Use optional chaining for safer access
    return achievementList?.[achievementId] || null;
}

export function findHintsForTraits(traitScores) {
    const hints = [];
    // More robust check for synergyHints structure
    if (!traitScores || typeof traitScores !== 'object' || Object.keys(traitScores).length === 0 ||
        !synergyHints || !Array.isArray(synergyHints.highPositive) || !Array.isArray(synergyHints.interestingDynamics)) {
        console.warn("[findHints] Invalid args or synergyHints data structure.");
        return hints;
    }

    // Convert scores to numbers and filter
    const highTraits = Object.entries(traitScores)
        .filter(([, s]) => parseInt(s, 10) >= 4)
        .map(([n]) => n);
    const lowTraits = Object.entries(traitScores)
        .filter(([, s]) => parseInt(s, 10) <= 2)
        .map(([n]) => n);

    // Check highPositive hints
    synergyHints.highPositive.forEach(syn => {
        // Ensure syn and syn.traits exist and traits is an array before accessing
        if (syn?.traits && Array.isArray(syn.traits) && syn.traits.every(t => highTraits.includes(t)) && syn.hint) {
             hints.push({ type: 'positive', text: syn.hint });
        }
    });

    // Check interestingDynamics hints
    synergyHints.interestingDynamics.forEach(dyn => {
        // Ensure dyn and necessary properties exist
        if (dyn?.traits?.high && dyn.traits.low && dyn.hint && highTraits.includes(dyn.traits.high) && lowTraits.includes(dyn.traits.low)) {
             hints.push({ type: 'dynamic', text: dyn.hint });
        }
    });

    return hints;
}

export function getRandomPrompt() {
    if (!Array.isArray(journalPrompts) || journalPrompts.length === 0) {
        console.warn("[getRandomPrompt] No prompts available in appData.");
        return "Reflect on your journey today..."; // Provide a generic fallback
    }
    const i = Math.floor(Math.random() * journalPrompts.length);
    const p = journalPrompts[i];
    if (typeof p !== 'string' || !p.trim()) {
        console.warn(`[getRandomPrompt] Invalid prompt found at index ${i}.`);
        return "Consider a recent experience or feeling..."; // Provide another fallback
    }
    return p;
}

// Secure HTML Escaping function
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  // Standard replacements to prevent XSS
  return str
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '''); // Use numeric entity for single quote; ' is not universally supported in HTML4
}

export function getFlairForScore(score) {
    const s = parseInt(score, 10);
    if(isNaN(s) || s < 1 || s > 5) return '';
    const flairs = { 5: '🌟', 4: '✨', 3: '👍', 2: '🌱', 1: '💧' };
    return flairs[s] || '';
}

export function generateSimpleId() {
    // Simple ID generator (not cryptographically secure, just for unique keys)
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Debounce function to limit rate of function calls
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        const context = this; // Capture the context `this` should run in
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            // Call the original function with the captured context and arguments
            func.apply(context, args);
        }, delay);
    };
}

--- END OF FILE utils.js ---
