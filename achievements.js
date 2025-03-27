// === achievements.js ===

// Potential Achievement Ideas (Expand and refine!)
export const achievementList = {
    // Profile & Basic Usage
    "profile_created": { name: "First Steps! ✨", desc: "Created your very first Kink Persona!" },
    "profile_edited": { name: "Growth Spurt! 🌱", desc: "Updated and refined a persona." },
    "five_profiles": { name: "Crew Assembled! 👯‍♀️", desc: "Created five different Kink Personas." },
    "avatar_chosen": { name: "Face Forward! 🎭", desc: "Selected a unique avatar for a persona." },
    "data_exported": { name: "Safe Keeper! 💾", desc: "Exported your persona data." },
    "data_imported": { name: "Welcome Back! 📁", desc: "Imported persona data." },
    "theme_changer": { name: "Style Maven! 🎨", desc: "Changed the application theme." },

    // Feature Engagement
    "style_finder_complete": { name: "Quest Complete! 🧭", desc: "Completed the Style Finder." },
    "style_discovery": { name: "Curious Explorer! 🔭", desc: "Opened the Style Discovery feature." },
    "glossary_user": { name: "Knowledge Seeker! 📚", desc: "Opened the Kink Glossary." },
    "resource_reader": { name: "Wise Owl! 🦉", desc: "Viewed the Resources section." },

    // Persona Details & Growth
    "goal_added": { name: "Setting Sights! 🎯", desc: "Added a goal to a persona." },
    "goal_completed": { name: "Goal Getter! ✔️", desc: "Completed a goal for a persona." },
    "five_goals_completed": { name: "Milestone Achiever! 🏆", desc: "Completed five goals across all personas." },
    "history_snapshot": { name: "Memory Lane! 📸", desc: "Saved your first persona history snapshot." },
    "ten_snapshots": { name: "Chronicler! 📜", desc: "Saved ten history snapshots for one persona." },
    "reflection_saved": { name: "Deep Thoughts! 📝", desc: "Saved your first journal reflection." },
    "five_reflections": { name: "Introspective! 🧐", desc: "Saved five journal reflections for one persona." },
    "prompt_used": { name: "Spark Seeker! 💡", desc: "Used a journal prompt." },
    "kink_reading": { name: "Fortune Teller! 🔮", desc: "Got your Kink Compass Reading." },

    // Trait Interaction
    "max_trait": { name: "Peak Performer! 🌟", desc: "Maxed out a trait score to 5 in the main form!" },
    "min_trait": { name: "Room to Bloom! 💧", desc: "Rated a trait score as 1 in the main form (It's okay!)." },
    "trait_info_viewed": { name: "Detail Detective! 🕵️‍♀️", desc: "Viewed detailed info about a trait." },

    // Fun / Meta
    "first_anniversary": { name: "Compass Companion! 🎉", desc: "Used KinkCompass for one year (Conceptual)." },
    // Add more as desired
};

// Function to check if an achievement is unlocked
export function hasAchievement(person, achievementId) {
    // Ensure person and achievements array exist
    return person?.achievements?.includes(achievementId) ?? false;
}

// Function to grant an achievement (mutates person object)
// Returns true if a NEW achievement was granted, false otherwise
export function grantAchievement(person, achievementId) {
    if (!person || !achievementId || !achievementList[achievementId]) return false; // Basic validation

    if (!person.achievements) {
        person.achievements = []; // Initialize if missing
    }

    if (!hasAchievement(person, achievementId)) {
        person.achievements.push(achievementId);
        console.log(`🏆 Achievement Unlocked for ${person.name || 'App'}: ${achievementList[achievementId].name}`);

        // TODO: Implement a visual notification system (optional)
        // showNotification(`Achievement Unlocked: ${achievementList[achievementId].name}`);

        return true; // Indicate new achievement granted
    }
    return false; // Already had it
}

// Optional: Function to get achievement details
export function getAchievementDetails(achievementId) {
    return achievementList[achievementId] || null;
}
