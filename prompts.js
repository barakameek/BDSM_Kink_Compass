// === prompts.js ===

export const journalPrompts = [
    // General Reflection
    "What was a moment this week where I felt truly connected to my desires?",
    "Describe a recent boundary negotiation. What went well? What could be improved?",
    "How does safety (physical and emotional) manifest in my ideal dynamic?",
    "Reflect on a recent aftercare experience (giving or receiving). What impact did it have?",
    "What small, achievable step can I take towards a kink-related goal this week?",
    "What surprised me about a recent kink experience or fantasy?",
    "How do I currently balance my kink identity with other parts of my life?",
    "What's a kink-related skill or area of knowledge I'm curious about exploring?",
    "How has my understanding or expression of trust evolved recently?",
    "What societal message about kink have I consciously decided to reject or reframe?",
    "Describe a time I felt fully 'in the moment' during play. What facilitated that?",
    "How do I handle feelings of vulnerability when they arise in a kink context?",

    // Role/Style Specific
    "If Submissive: When did I feel the most empowered in my submission recently?",
    "If Dominant: When did I feel my guidance was most effectively received and appreciated?",
    "If Switch: What triggers my desire to shift roles? How do I communicate that shift?",
    "If Brat: How do I ensure my brattiness enhances the dynamic rather than derails it?",
    "If Little: What specific elements create the safest and most joyful littlespace for me?",
    "If Pet: How do I best communicate my needs and feelings when in petspace?",
    "If Master/Mistress: How do I balance high expectations with compassion and care?",
    "If Slave/Servant: What acts of service feel most meaningful and fulfilling to me?",
    "If Sadist/Masochist: How do I communicate about intensity levels during a scene?",
    "If Rigger/Bunny: What does the aesthetic vs. sensation aspect of rope mean to me?",

    // Deeper Exploration
    "What fears or insecurities sometimes hold me back in my kink exploration?",
    "How does my body language communicate my desires or limits, even without words?",
    "What does 'power' mean to me in the context of BDSM?",
    "How do I process challenging emotions (like sub drop, dom drop, or scene processing) afterwards?",
    "What's one way I can show appreciation for my partner(s) in our dynamic?",
    "If I could design a perfect scene right now, what key elements would it include?",
    "How do my past experiences influence my current desires and boundaries?",
];

export function getRandomPrompt() {
    if (!journalPrompts || journalPrompts.length === 0) {
        return "Reflect on your journey today..."; // Fallback
    }
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    return journalPrompts[randomIndex];
}
