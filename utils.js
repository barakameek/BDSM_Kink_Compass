// === utils.js === (Revised & Enhanced - v5 - Cleaned End)
// Contains helper functions for KinkCompass, separated from core app logic and data.

// Import needed DATA structures from appData.js
import {
    bdsmData,
    achievementList,
    synergyHints,
    journalPrompts,
    subStyleSuggestions, // Assuming these are the correct export names
    domStyleSuggestions  // Assuming these are the correct export names
} from './appData.js';

// --- Normalization & Paraphrasing ---

function normalizeStyleKey(name) {
    if (typeof name !== 'string' || !name) {
        return '';
    }
    try {
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

export function getSubStyleBreakdown(styleName, traits) {
  if (!styleName || !traits || typeof traits !== 'object') {
    console.warn("getSubStyleBreakdown called with invalid args:", styleName, traits);
    return { strengths: "ℹ️ Select a style first!", improvements: "ℹ️ Choose your path to get tips!" };
  }
  const styleKey = normalizeStyleKey(styleName);
  if (!styleKey) { return { strengths: `⚠️ Invalid style name provided.`, improvements: `Please check the style name.` }; }
  if (!subStyleSuggestions || typeof subStyleSuggestions !== 'object') { console.error("Submissive style suggestions data missing."); return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Please check appData.js." }; }
  const styleData = subStyleSuggestions[styleKey];
  if (!styleData) { console.warn(`No suggestions for sub key: ${styleKey}`); return { strengths: `✨ Exploring **${escapeHTML(styleName)}**! Keep defining it. 💕`, improvements: `🌱 What aspect calls to you next? 😸` }; }
  const roleData = bdsmData?.submissive;
  if (!roleData?.styles) { console.error("bdsmData.submissive missing!"); return { strengths: "❌ Error loading core style data.", improvements: "Please check appData.js." }; }
  const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
  let traitScores = [];
  styleObj?.traits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });
  roleData.coreTraits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });
  const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
  const scoreIndex = Math.max(1, Math.min(5, avgScore));
  const levelData = styleData[scoreIndex];
  if (!levelData?.paraphrase || !levelData?.suggestion) {
    console.warn(`No paraphrase/suggestion for ${styleKey} at level ${scoreIndex}`);
    if (scoreIndex >= 4) { return { strengths: `🌟 Strong **${escapeHTML(styleName)}**! Shine on!`, improvements: `🚀 Explore deeper nuances!` }; }
    if (scoreIndex <= 2) { return { strengths: `💧 Exploring **${escapeHTML(styleName)}**. Be patient!`, improvements: `🌱 Focus on communication!` }; }
    return { strengths: `👍 Balanced **${escapeHTML(styleName)}** approach!`, improvements: `🤔 Consider focus areas!` };
  }
  const { paraphrase, suggestion } = levelData;
  const isStrength = scoreIndex >= 4;
  const strengthsText = isStrength ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}` : `🌱 Cultivating **${escapeHTML(styleName)}**! Keep growing!`;
  const improvementsText = isStrength ? `🚀 Explore depths of **${escapeHTML(styleName)}**! New horizons?` : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;
  return { strengths: strengthsText, improvements: improvementsText };
}

export function getDomStyleBreakdown(styleName, traits) {
    if (!styleName || !traits || typeof traits !== 'object') { console.warn("getDomStyleBreakdown invalid args:", styleName, traits); return { strengths: "ℹ️ Select style!", improvements: "ℹ️ Choose path!" }; }
    const styleKey = normalizeStyleKey(styleName);
    if (!styleKey) { return { strengths: `⚠️ Invalid style name.`, improvements: `Check name.` }; }
    if (!domStyleSuggestions || typeof domStyleSuggestions !== 'object') { console.error("Dominant suggestions data missing."); return { strengths: "❌ Error: Suggestions data unavailable.", improvements: "Check appData.js." }; }
    const styleData = domStyleSuggestions[styleKey];
    if (!styleData) { console.warn(`No suggestions for dom key: ${styleKey}`); return { strengths: `💪 Forging **${escapeHTML(styleName)}** path! Explore!`, improvements: `🔍 Continue defining!` }; }
    const roleData = bdsmData?.dominant;
    if (!roleData?.styles) { console.error("bdsmData.dominant missing!"); return { strengths: "❌ Error loading core data.", improvements: "Check appData.js." }; }
    const styleObj = roleData.styles.find(s => normalizeStyleKey(s.name) === styleKey);
    let traitScores = [];
    styleObj?.traits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });
    roleData.coreTraits?.forEach(t => { const s = parseInt(traits[t.name], 10); if (!isNaN(s)) traitScores.push(s); });
    const avgScore = traitScores.length > 0 ? Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length) : 3;
    const scoreIndex = Math.max(1, Math.min(5, avgScore));
    const levelData = styleData[scoreIndex];
    if (!levelData?.paraphrase || !levelData?.suggestion) {
      console.warn(`No paraphrase/suggestion for ${styleKey} at level ${scoreIndex}`);
      if (scoreIndex >= 4) { return { strengths: `🔥 Powerful **${escapeHTML(styleName)}**! Impressive!`, improvements: `🚀 Refine your command!` }; }
      if (scoreIndex <= 2) { return { strengths: `🌱 Exploring **${escapeHTML(styleName)}** leadership.`, improvements: `🎯 Focus on communication!` }; }
      return { strengths: `👍 Balanced **${escapeHTML(styleName)}**! Strong foundation!`, improvements: `🤔 Consider focus areas!` };
    }
    const { paraphrase, suggestion } = levelData;
    const isStrength = scoreIndex >= 4;
    const strengthsText = isStrength ? `✨ **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}` : `🌱 Cultivating **${escapeHTML(styleName)}**! Keep honing!`;
    const improvementsText = isStrength ? `🚀 Expand horizons of **${escapeHTML(styleName)}**! New challenges!` : `🎯 **${escapeHTML(paraphrase)}** ${escapeHTML(suggestion)}`;
    return { strengths: strengthsText, improvements: improvementsText };
}

export function hasAchievement(person, achievementId) {
    if (!achievementId || !achievementList[achievementId]) { return false; }
    return person?.achievements?.includes(achievementId) ?? false;
}

export function grantAchievement(person, achievementId, showNotificationCallback, saveCallback) {
    if (!achievementId || !achievementList[achievementId]) { console.warn(`Grant: Invalid ID ${achievementId}`); return false; }
    const details = achievementList[achievementId];
    if (!person || typeof person !== 'object' || Object.keys(person).length === 0 || !person.id) {
        const storageKey = `kinkCompass_global_achievement_${achievementId}`;
        try {
            if (!localStorage.getItem(storageKey)) {
                localStorage.setItem(storageKey, 'true');
                console.log(`🏆 Global Achievement: ${details.name}`);
                if (showNotificationCallback) showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details });
                return true;
            }
        } catch (e) { console.error(`Grant Global LS Error ${achievementId}:`, e); }
        return false;
    }
    if (!Array.isArray(person.achievements)) { person.achievements = []; }
    if (!person.achievements.includes(achievementId)) {
        person.achievements.push(achievementId);
        person.achievements.sort();
        console.log(`🏆 Persona Achievement for ${person.name || '?'}: ${details.name}`);
        if (showNotificationCallback) showNotificationCallback(`Achieved: ${details.name}!`, "achievement", 4000, { details, personaName: person.name });
        if (saveCallback) { try { saveCallback(); } catch (e) { console.error(`Grant Save Error ${person.id}:`, e); } }
        else { console.warn(`Grant: No saveCallback for ${achievementId} on ${person.name}.`); }
        return true;
    }
    return false;
}

export function getAchievementDetails(achievementId) {
    return achievementList?.[achievementId] || null;
}

export function findHintsForTraits(traitScores) {
  const hints = [];
  if (!traitScores || typeof traitScores !== 'object' || Object.keys(traitScores).length === 0 || !synergyHints?.highPositive || !synergyHints?.interestingDynamics) {
      console.warn("[findHints] Invalid args or data."); return hints;
  }
  const highTraits = Object.entries(traitScores).filter(([, s]) => parseInt(s, 10) >= 4).map(([n]) => n);
  const lowTraits = Object.entries(traitScores).filter(([, s]) => parseInt(s, 10) <= 2).map(([n]) => n);
  synergyHints.highPositive.forEach(syn => {
      if (syn?.traits?.every(t => highTraits.includes(t)) && syn.hint) { hints.push({ type: 'positive', text: syn.hint }); }
  });
  synergyHints.interestingDynamics.forEach(dyn => {
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

export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, ''');
}

export function getFlairForScore(score) {
    const s = parseInt(score, 10);
    if(isNaN(s) || s < 1 || s > 5) return '';
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
    timeoutId = setTimeout(function() { // Using traditional function for setTimeout callback
      func.apply(context, args);
    }, delay);
  };
}
