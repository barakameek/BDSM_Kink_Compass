// === utils.js === (Revised & Enhanced - v5 - Corrected)
// Contains helper functions for KinkCompass, separated from core app logic and data.

// Import needed DATA structures from appData.js
import {
    bdsmData,
    achievementList,
    synergyHints,
    journalPrompts,
    subStyleSuggestions,
    domStyleSuggestions
} from './appData.js';

// --- Normalization & Paraphrasing ---

function normalizeStyleKey(name) {
    if (typeof name !== 'string' || !name) {
        return '';
    }
    try {
        // Keep cleaning logic as is, appears reasonable
        const cleanedName = name
            .toLowerCase()
            .replace(/([\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}]+)/gu, '')
            .replace(/\(.*?\)/g, '')
            .replace(/ \/ /g, '/')
            .replace(/[^\w\s/-]/g, '')
            .trim();
        return cleanedName;
    } catch (error) {
        console.error(`[normalizeStyleKey] Error processing name "${name}":`, error);
        return '';
    }
}

// IMPROVEMENT: Consolidated getSubStyleBreakdown and getDomStyleBreakdown
export function getStyleBreakdown(styleName, traits, role) {
    if (!styleName || !traits || typeof traits !== 'object' || !role) {
        console.warn("getStyleBreakdown called with invalid args:", styleName, traits, role);
        return { strengths: "ℹ️ Select role & style first!", improvements: "ℹ️ Choose your path to get tips!" };
    }

    const styleKey = normalizeStyleKey(styleName);
    if (!styleKey) {
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
        // IMPROVEMENT: This fallback could be enhanced by checking bdsmData.switch.styles explicitly
        console.warn(`No specific sub/dom suggestions for switch style key: ${styleKey}. Using generic Switch breakdown.`);
        return { strengths: `✨ Embracing **${escapeHTML(styleName)}** versatility! Adaptable and intuitive. ✨`, improvements: `🌱 Focus on clear communication during role shifts.` };
    } else {
        console.error(`Invalid role "${role}" provided to getStyleBreakdown.`);
        return { strengths: "❌ Error: Invalid role.", improvements: "Please check data." };
    }

    if (!suggestionsData || typeof suggestionsData !== 'object') {
        console.error(`${styleType === 'sub' ? 'Submissive' : 'Dominant'} style suggestions data missing.`);
        return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Please check appData.js." };
    }

    const styleData = suggestionsData[styleKey];
    if (!styleData) {
        console.warn(`No suggestions for ${styleType} key: ${styleKey}`);
        const defaultStrength = styleType === 'sub' ? `✨ Exploring **${escapeHTML(styleName)}**! Keep defining it. 💕` : `💪 Forging **${escapeHTML(styleName)}** path! Explore!`;
        const defaultImprovement = styleType === 'sub' ? `🌱 What aspect calls to you next? 😸` : `🔍 Continue defining!`;
        return { strengths: defaultStrength, improvements: defaultImprovement };
    }

    if (!roleData?.styles || !roleData?.coreTraits) {
        console.error(`bdsmData.${roleData?.roleName?.toLowerCase() || role} missing styles or coreTraits!`);
        return { strengths: "❌ Error loading core style data.", improvements: "Please check appData.js." };
    }

    const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
    let traitScores = [];
    styleObj?.traits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });
    roleData.coreTraits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });

    const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
    const scoreIndex = Math.max(1, Math.min(5, avgScore));
    const levelData = styleData[scoreIndex];

    if (!levelData?.paraphrase || !levelData?.suggestion) {
        console.warn(`No paraphrase/suggestion for ${styleKey} at level ${scoreIndex}`);
        // Provide role-specific fallbacks based on score index
        if (scoreIndex >= 4) {
            const strength = styleType === 'sub' ? `🌟 Strong **${escapeHTML(styleName)}**! Shine on!` : `🔥 Powerful **${escapeHTML(styleName)}**! Impressive!`;
            const improvement = styleType === 'sub' ? `🚀 Explore deeper nuances!` : `🚀 Refine your command!`;
            return { strengths: strength, improvements: improvement };
        }
        if (scoreIndex <= 2) {
            const strength = styleType === 'sub' ? `💧 Exploring **${escapeHTML(styleName)}**. Be patient!` : `🌱 Exploring **${escapeHTML(styleName)}** leadership.`;
            const improvement = `🎯 Focus on communication!`; // Same for both
            return { strengths: strength, improvements: improvement };
        }
        // Default fallback for score 3
        const strength = `👍 Balanced **${escapeHTML(styleName)}** approach!`;
        const improvement = `🤔 Consider focus areas!`;
        return { strengths: strength, improvements: improvement };
    }

    const { paraphrase, suggestion } = levelData;
    const isStrength = scoreIndex >= 4;

    // Use role-specific phrasing
    let strengthsText, improvementsText;
    if (styleType === 'sub') {
        strengthsText = isStrength ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}` : `🌱 Cultivating **${escapeHTML(styleName)}**! Keep growing! 💕`;
        improvementsText = isStrength ? `🚀 Explore depths of **${escapeHTML(styleName)}**! New horizons? 😸` : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;
    } else { // dom
        strengthsText = isStrength ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}` : `🌱 Cultivating **${escapeHTML(styleName)}**! Keep honing! 💪`;
        improvementsText = isStrength ? `🚀 Expand horizons of **${escapeHTML(styleName)}**! New challenges! 🔍` : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;
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
    return person && Array.isArray(person.achievements) && person.achievements.includes(achievementId);
}

export function grantAchievement(person, achievementId, showNotificationCallback, saveCallback) {
    if (!achievementId || !achievementList[achievementId]) { console.warn(`Grant: Invalid ID ${achievementId}`); return false; }
    const details = achievementList[achievementId];

    // Handle global achievements (no specific person)
    if (!person || typeof person !== 'object' || Object.keys(person).length === 0 || !person.id) {
        const storageKey = `kinkCompass_global_achievement_${achievementId}`;
        try {
            if (!localStorage.getItem(storageKey)) {
                localStorage.setItem(storageKey, 'true');
                console.log(`🏆 Global Achievement: ${details.name}`);
                // FIX: Ensure showNotificationCallback exists before calling
                if (showNotificationCallback && typeof showNotificationCallback === 'function') {
                    showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details });
                }
                return true;
            }
        } catch (e) { console.error(`Grant Global LS Error ${achievementId}:`, e); }
        return false;
    }

    // Handle persona-specific achievements
    if (!Array.isArray(person.achievements)) { person.achievements = []; }
    if (!person.achievements.includes(achievementId)) {
        person.achievements.push(achievementId);
        // IMPROVEMENT: Sorting removed - only sort if needed for display elsewhere
        // person.achievements.sort();
        console.log(`🏆 Persona Achievement for ${person.name || '?'}: ${details.name}`);
        // FIX: Ensure showNotificationCallback exists before calling
        if (showNotificationCallback && typeof showNotificationCallback === 'function') {
             showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details: details, personaName: person.name });
        }
        // FIX: Ensure saveCallback exists before calling
        if (saveCallback && typeof saveCallback === 'function') {
            try { saveCallback(); } catch (e) { console.error(`Grant Save Error ${person.id}:`, e); }
        } else {
            // Only warn if a save was expected but not provided (difficult to know context here)
             console.warn(`Grant: No saveCallback provided for achievement ${achievementId} on persona ${person.name}. Data might not persist immediately if relying on this grant to save.`);
        }
        return true;
    }
    return false;
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
    const highTraits = Object.entries(traitScores).filter(([, s]) => parseInt(s, 10) >= 4).map(([n]) => n);
    const lowTraits = Object.entries(traitScores).filter(([, s]) => parseInt(s, 10) <= 2).map(([n]) => n);

    synergyHints.highPositive.forEach(syn => {
        // Ensure syn and syn.traits exist before accessing
        if (syn?.traits && Array.isArray(syn.traits) && syn.traits.every(t => highTraits.includes(t)) && syn.hint) {
             hints.push({ type: 'positive', text: syn.hint });
        }
    });
    synergyHints.interestingDynamics.forEach(dyn => {
        // Ensure dyn and necessary properties exist
        if (dyn?.traits?.high && dyn.traits.low && dyn.hint && highTraits.includes(dyn.traits.high) && lowTraits.includes(dyn.traits.low)) {
             hints.push({ type: 'dynamic', text: dyn.hint });
        }
    });
    return hints;
}

export function getRandomPrompt() {
    if (!Array.isArray(journalPrompts) || journalPrompts.length === 0) { console.warn("[getRandomPrompt] No prompts."); return "Reflect on your journey today..."; }
    const i = Math.floor(Math.random() * journalPrompts.length);
    const p = journalPrompts[i];
    if (typeof p !== 'string' || !p.trim()) { console.warn(`[getRandomPrompt] Invalid prompt index ${i}`); return "Consider a recent experience..."; }
    return p;
}

// FIX: Correct HTML character escaping
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  // Ensure replacements use the correct entities
  return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;'); // Use numeric entity for single quote (or &apos;)
}

export function getFlairForScore(score) {
    const s = parseInt(score, 10);
    if(isNaN(s) || s < 1 || s > 5) return '';
    // Ensure flairs object is correctly defined
    const flairs = { 5: '🌟', 4: '✨', 3: '👍', 2: '🌱', 1: '💧' };
    return flairs[s] || '';
}

export function generateSimpleId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        // Using traditional function maintains `this` context from `setTimeout` itself,
        // but `apply` correctly sets `this` to `context` (the TrackerApp instance) when `func` is called.
        timeoutId = setTimeout(function() {
            func.apply(context, args);
        }, delay);
    };
}
