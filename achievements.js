// --- START OF FILE achievements.js ---
export const achievementList = {
    "profile_created": { name: "First Steps! ✨", desc: "Created your very first Kink Profile!" },
    "profile_edited": { name: "Growth Spurt! 🌱", desc: "Updated and refined a profile." },
    "five_profiles": { name: "Crew Assembled! 👯‍♀️", desc: "Created five different Kink Profiles." },
    "reflection_saved": { name: "Deep Thoughts! 📝", desc: "Saved your first journal reflection." },
    "five_reflections": { name: "Introspective! 🧐", desc: "Saved five journal reflections." },
    "goal_added": { name: "Setting Sights! 🎯", desc: "Added a goal to a profile." }, // Simple version for now
    "history_snapshot": { name: "Memory Lane! 📸", desc: "Saved your first profile history snapshot." },
    "style_explorer": { name: "Curious Cat! 🧭", desc: "Opened the Style Discovery feature." },
    "glossary_user": { name: "Knowledge Seeker! 📚", desc: "Opened the Kink Glossary." },
    "theme_changer": { name: "Style Maven! 🎨", desc: "Changed the application theme." },
    "data_exported": { name: "Safe Keeper! 💾", desc: "Exported your profile data." },
    "max_trait": { name: "Peak Performer! 🌟", desc: "Maxed out a trait score to 5!" },
    "min_trait": { name: "Room to Bloom! 💧", desc: "Rated a trait score as 1 (It's okay!)." },
    "kink_reading": { name: "Fortune Teller! 🔮", desc: "Got your Kink Compass Reading." },
    // Add more as desired
};

// Function to check if an achievement is unlocked
export function hasAchievement(person, achievementId) {
    return person?.achievements?.includes(achievementId);
}

// Function to grant an achievement (mutates person object)
export function grantAchievement(person, achievementId) {
    if (!person) return false;
    if (!person.achievements) {
        person.achievements = [];
    }
    if (!hasAchievement(person, achievementId)) {
        person.achievements.push(achievementId);
        console.log(`Achievement Unlocked for ${person.name}: ${achievementList[achievementId]?.name || achievementId}`);
        // Optionally show a temporary notification to the user here
        return true; // Indicate new achievement granted
    }
    return false; // Already had it
}
// --- END OF FILE achievements.js ---
