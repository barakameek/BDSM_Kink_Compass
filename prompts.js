// --- START OF FILE prompts.js ---
export const journalPrompts = [
    // General
    "What was a moment this week where I felt truly authentic in my dynamic?",
    "What's one boundary I communicated clearly recently? How did it feel?",
    "What does 'safety' mean to me in the context of kink?",
    "How did I practice aftercare (for myself or a partner) recently?",
    "What's one small step I can take towards a current kink goal?",
    "What surprised me about my desires or reactions lately?",
    "Describe a time negotiation went really well. What made it successful?",
    "What's a kink-related skill I'd like to learn or improve?",
    "How do trust and vulnerability show up in my dynamic?",
    "What's one assumption about kink (mine or others') I've challenged recently?",

    // Submissive Focused
    "When did I feel the most surrendered recently? What triggered it?",
    "Describe a time I truly enjoyed serving my partner. What made it special?",
    "How does obedience feel different from simple compliance for me?",
    "What kind of praise or validation makes me feel most cherished?",
    "What does my 'ideal' submissive headspace feel like?",

    // Dominant Focused
    "When did I feel most confident in my authority recently?",
    "Describe a time I provided effective care or aftercare. What was the impact?",
    "How do I balance control with my partner's autonomy and well-being?",
    "What kind of respect or devotion from my partner feels most meaningful?",
    "What responsibilities do I feel come with my dominant role?",

    // Style Specific (Examples - expand!)
    "Brat: What's the line between playful defiance and disrespect for me/my partner?",
    "Little: What activities bring me the most joy when I'm in littlespace?",
    "Rigger: What's the connection between the rope and the person for me?",
    "Sadist: How do I ensure my partner's pleasure/release is centered, even when causing pain?",
    "Daddy/Mommy: How do I foster growth and independence alongside providing care?",
];

export function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    return journalPrompts[randomIndex];
}
// --- END OF FILE prompts.js ---
