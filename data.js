// === data.js ===

export const bdsmData = {
  // === SUBMISSIVE ROLE ===
  submissive: {
    roleName: "Submissive",
    description: "A role focused on yielding control, trusting a partner's guidance, and finding fulfillment in service, obedience, or specific dynamics.",
    coreTraits: [
      {
        name: "obedience",
        desc: {
          "1": "Instructions? More like... optional suggestions? 😉 I tend to question or wander off-script. Maybe exploring *why* could be a fun quest!",
          "2": "I can follow the map, but sometimes I take detours! 🗺️ I might need a gentle nudge or clearer directions to stay on track.",
          "3": "Aye aye, Captain! 🫡 I'm pretty good at following orders, especially when I understand the mission. Ready for duty!",
          "4": "Following instructions makes my tail wag! 🐶 I enjoy knowing I'm doing a good job and making my partner happy.",
          "5": "Obedience is my superpower! ✨ I thrive on anticipating and following commands perfectly. It just feels *right*."
        }
      },
      {
        name: "trust",
        desc: {
          "1": "Trust feels like jumping into chilly water – I hesitate! 🥶 Letting my guard down is tough, but maybe starting small could feel warmer?",
          "2": "I'm dipping my toes into trust! 🐢 It takes time and reassurance, like waiting for a shy kitten to approach.",
          "3": "I feel mostly cozy and safe, like being wrapped in a familiar blanket. 🧸 A little reassurance now and then keeps it snug!",
          "4": "I trust my partner like a trusty co-pilot! 🚀 It feels good to let go of the controls and enjoy the ride together.",
          "5": "My heart's an open book! ❤️ I trust completely and unconditionally. It's the foundation of my happy place."
        }
      },
      // Add more CORE submissive traits if desired, e.g., resilience, patience?
    ],
    styles: [
      // --- SUBMISSIVE STYLES ---
      {
        name: "Classic Submissive", // Renamed for clarity
        summary: "Focuses on general obedience, service, and presentation.",
        traits: [
          { name: "service", desc: {
              "1": "Serving? I'd rather be napping! 😴 Tasks feel like chores. Maybe finding the sparkle in helping could change things?",
              "2": "I'll help if asked, but I'm not first in line. 🙋‍♀️ Starting to see how making someone smile with service feels nice though!",
              "3": "Happy to help! 😊 I find satisfaction in completing tasks and being useful. It's part of the fun.",
              "4": "Service with a smile! 😄 I actively look for ways to assist and take pride in anticipating needs. It's rewarding!",
              "5": "My love language is service!💖 I feel most fulfilled when taking care of my partner's needs. It's pure joy!"
          }},
          { name: "presentation", desc: { // How one presents themselves
              "1": "Presentation? I roll out of bed like this! ✨ Effort feels... optional. Maybe a little polish could feel good?",
              "2": "I clean up okay, but fussing isn't my style. 🤷‍♀️ A bit of effort happens sometimes, usually with prompting.",
              "3": "I like looking presentable for my partner. 😊 Taking care in my appearance feels respectful and nice.",
              "4": "I enjoy looking my best as part of my role! 🎀 Choosing outfits or styles requested feels fun and affirming.",
              "5": "Presentation is part of the art! 💅 I adore crafting my look to please my partner and embody my role fully."
          }}
          // Uses core 'obedience' and 'trust'
        ]
      },
      {
        name: "Brat",
        summary: "Enjoys playful defiance, testing boundaries, and earning consequences.",
        traits: [
          { name: "playful defiance", desc: {
              "1": "Defiance? Eek, sounds scary! 😨 I prefer to follow the rules. Maybe a tiny bit of sass could be... interesting?",
              "2": "I might poke the bear... gently. 😉 A little pushback sometimes, but I retreat quickly if things get serious.",
              "3": "Hehe, make me! 😏 I enjoy playful rule-bending and witty banter. It's all part of the game!",
              "4": "Rules are merely suggestions, right? 😈 I thrive on clever loopholes and cheeky challenges. Bring on the consequences!",
              "5": "I'm the Ruler of Sass! 👑 Playful defiance is my art form. The dynamic sparks fly when I push back!"
          }},
          { name: "mischief", desc: { // Added mischief
              "1": "Too good for tricks! I like things calm and predictable. 😇",
              "2": "A tiny prank or tease might slip out, but I prefer peace. 😉",
              "3": "Stirring things up playfully is fun sometimes! A bit of controlled chaos. ✨",
              "4": "I love finding clever ways to cause a little (harmless) trouble! Keeps things interesting!  mischievous", // Corrected emoji name
              "5": "Chaos Creator! 💥 My default mode involves cheeky pranks and playful disruptions!"
          }}
          // Uses core 'trust', maybe less 'obedience' focus
        ]
      },
      {
        name: "Slave",
        summary: "Finds deep fulfillment in total devotion, service, and surrender.",
        traits: [
          { name: "devotion", desc: {
              "1": "Devotion feels... intense. Holding back feels safer. Maybe exploring deeper connection slowly?",
              "2": "I feel loyal, but deep, unwavering devotion is a big step I'm exploring. 🌱",
              "3": "My heart belongs to my Master/Mistress. ❤️ That connection is a strong and comforting part of me.",
              "4": "My world revolves around my Owner. 🌍 Their needs and desires are my guiding stars.",
              "5": "Absolute devotion is my core identity. My purpose *is* my Master/Mistress. There's profound peace in this."
          }},
          { name: "surrender", desc: {
              "1": "Letting go completely? Scary! 🫣 I like keeping *some* control. Maybe surrendering small things first?",
              "2": "I can yield control in specific moments, but total surrender is a challenge I'm working on. 🧘‍♀️",
              "3": "Giving up control feels mostly freeing, like floating on water. ☁️ I trust the current.",
              "4": "Deep surrender feels natural and right. Yielding my autonomy within our bond is welcome. 🙏",
              "5": "Complete surrender is my sanctuary. 🗝️ I find ultimate peace and fulfillment in placing my will entirely in their hands."
          }}
          // Uses core 'obedience' and 'trust' strongly
        ]
      },
      {
        name: "Pet",
        summary: "Enjoys embodying an animal persona, seeking affection and guidance.",
        traits: [
          { name: "affection seeking", desc: {
              "1": "Asking for praise feels... weird. 😬 I prefer to wait and see. Maybe being clearer could get more head pats?",
              "2": "I like cuddles, but I'm shy about asking! 🥺 Sometimes I hint non-verbally.",
              "3": "Head pats, please! 🥰 I enjoy seeking and receiving affection. It makes me feel loved and appreciated.",
              "4": "'Good pet!' is music to my ears! 🎶 I actively seek praise and snuggles. It's the best reward!",
              "5": "Affection is my fuel! ⛽ I thrive on constant validation and physical closeness from my Owner."
          }},
          { name: "playfulness", desc: { // Reusing playfulness
              "1": "Serious is my vibe!",
              "2": "A giggle slips out!",
              "3": "You play if it’s light!",
              "4": "Half serious, half silly!",
              "5": "Games are your world!" // Simplified 5 levels
          }},
          { name: "non-verbal expression", desc: {
              "1": "Using sounds or gestures feels silly. Words are easier! 🗣️ Maybe trying a little purr could be fun?",
              "2": "Sometimes a whimper or tail wag slips out! 😉 Exploring non-verbal cues more.",
              "3": "Nuzzles, tail wags (imaginary or real!), happy sounds – they come naturally in petspace! 🐶",
              "4": "I'm fluent in Pet! I can express needs, moods, and happiness clearly without many words.", // Removed duplicate word
              "5": "My body language *is* my language in petspace! 🦋 Every purr, posture, and nudge tells a story."
          }}
          // Uses core 'trust'
        ]
      },
      {
        name: "Little",
        summary: "Embraces a childlike mindset, seeking care, play, and structure.",
        traits: [
          { name: "age regression comfort", desc: {
              "1": "Feeling 'little' feels awkward or embarrassing.😳 Staying 'adult' feels safer.",
              "2": "I can dip into littlespace sometimes, but it feels fragile or fleeting. Exploring cautiously.🎈",
              "3": "Littlespace is a comfy, happy place! 🧸 I enjoy letting go and embracing my younger side.",
              "4": "Sliding into littlespace feels natural and joyful! ✨ Play, wonder, and cuddles are the best!",
              "5": "Littlespace is home! 🏡 I live and breathe in that innocent, carefree mindset when the dynamic allows."
          }},
          { name: "need for guidance", desc: {
              "1": "I like being independent! Being told what to do feels restrictive. 🤔 Maybe guidance can feel like care?",
              "2": "I accept rules sometimes, but value my freedom. Balancing structure and autonomy. ⚖️",
              "3": "Having rules and a Caregiver's guidance feels safe and reassuring. 😊 Takes the pressure off!",
              "4": "I thrive with clear rules and structure! Knowing my Caregiver is in charge lets me relax and play. 🪁",
              "5": "Complete reliance on my Caregiver is bliss! 💖 Their guidance defines my little world, and I love it."
          }}
          // Uses core 'trust' strongly
        ]
      },
       // ... Include ALL other Submissive styles from data.js ...
       // (Puppy, Kitten, Princess, Rope Bunny, Masochist, Prey, Toy, Doll, Bunny, Servant, Playmate, Babygirl, Captive, Thrall, Puppet, Maid, Painslut, Bottom)
       // Ensure each has a 'summary' and 'traits' array with trait objects (name, desc object)
        {
        name: "Puppy",
        summary: "Exudes boundless energy, loyalty, and eagerness to please.",
        traits: [
           { name: "boundless energy", desc: {
              "1": "Energy? More like nap time is calling. 😴 Enthusiasm takes effort.",
              "2": "I have bursts of energy, but tire easily. Pacing myself! ⚡",
              "3": "Ready to play! 🥎 I have good energy levels and enjoy active engagement.",
              "4": "Zoomies! 😄 I'm full of enthusiasm and eager to please, learn, and play hard!",
              "5": "Unstoppable puppy power! 🚀 My energy and eagerness are infectious and define my pupper self!"
          }},
          { name: "trainability", desc: {
              "1": "Learning new tricks? My brain feels fuzzy. 😵‍💫 Instructions get jumbled.",
              "2": "I can learn, but need patience and repetition. Treats help! 🍖",
              "3": "Good puppy! I pick up commands and routines reasonably well. Eager to get it right! 👍",
              "4": "Ready for training! 🤓 I love learning new commands and pleasing my Owner/Handler. Super focused!",
              "5": "Top dog in training! 🏆 I learn commands instantly and perform with joyful precision. Best student ever!"
          }}
          // Uses core 'trust', 'obedience'
        ]
      },
      {
        name: "Kitten",
        summary: "Combines curiosity, grace (or playful clumsiness), and affection.",
        traits: [
           { name: "curiosity", desc: {
              "1": "New things are scary! 🫣 I prefer sticking to the familiar.",
              "2": "I might peek from a safe distance... 🤔 Curiosity is cautious.",
              "3": "Ooh, what's that? 😮 I enjoy exploring new things, sometimes batting at them playfully.",
              "4": "Must investigate! 🧐 My curiosity leads me everywhere. I love discovering and playing with novelties.",
              "5": "Curiosity didn't kill this kitten! 😼 I'm fearlessly inquisitive, getting into *everything* with playful abandon."
          }},
          { name: "gracefulness", desc: {
              "1": "Graceful? More like a baby giraffe on roller skates! 😵‍💫 Clumsy is my middle name.",
              "2": "Sometimes I'm sleek, sometimes I trip over air. 😅 Working on my feline finesse.",
              "3": "I move with reasonable kitten-like grace. 🐈‍⬛ Usually land on my feet!",
              "4": "Sleek and slinky! I enjoy moving with poise and a certain feline charm. ✨",
              "5": "Poetry in motion! 🩰 I move with inherent grace and agility, embodying the elegance of a cat."
          }}
           // Uses 'affection seeking' from Pet
          // Uses core 'trust'
        ]
      },
       // ... [Continue adding all submissive styles similarly] ...
       { name: "Painslut", summary: "Actively seeks and revels in intense physical sensation and pain.", traits: [/*...*/]},
       { name: "Bottom", summary: "Focuses on receiving sensation, direction, and energy within a power dynamic.", traits: [/*...*/]},
    ]
  },

  // === DOMINANT ROLE ===
  dominant: {
    roleName: "Dominant",
    description: "A role focused on taking charge, guiding the dynamic, providing structure, and deriving satisfaction from leading or caring for a partner.",
    coreTraits: [
       {
        name: "authority",
        desc: {
          "1": "Leading? Eek! Feels like juggling flaming torches. 🔥 I prefer following. Maybe start with one tiny command?",
          "2": "I can steer the ship, but worry about hitting rocks! 🚢 Practicing my 'Captain's voice'.",
          "3": "Comfortable at the helm most times! 🧭 Authority feels natural in familiar waters.",
          "4": "I wear the crown with a grin! 👑 Love calling the shots and guiding the scene.",
          "5": "My presence commands the room! 🏰 Authority flows naturally. Leading feels like breathing."
        }
      },
      {
        name: "care", // Providing support, safety, aftercare
        desc: {
          "1": "Care? I'm focused on the *action*! Remembering needs is hard. 🤔 Maybe a checklist could help?",
          "2": "I try to be attentive, but sometimes miss cues. Like forgetting to water a plant! 🌱 Working on it!",
          "3": "Checking in and providing support feels important. 😊 Making sure my partner is safe and happy.",
          "4": "My partner's well-being is my radar's top target! 📡 Proactive care and aftercare are key.",
          "5": "Guardian Angel mode, activated! 🛡️ My partner's physical and emotional safety is paramount. Intuitive and thorough care."
        }
      },
      // Add more CORE dominant traits if desired, e.g., confidence, control?
    ],
    styles: [
       // --- DOMINANT STYLES ---
      {
        name: "Classic Dominant", // Renamed for clarity
        summary: "Focuses on general leadership, control, and setting the dynamic's tone.",
        traits: [
          { name: "leadership", desc: {
              "1": "Leading feels like herding squirrels! 🐿️ Where do we even start? Needs a map!",
              "2": "I can point the way, but might second-guess the path.🗺️ Gaining confidence!",
              "3": "Setting the course feels good! 👍 Confident in guiding the dynamic.",
              "4": "Follow my lead! ✨ Inspiring and directing my partner comes naturally and is rewarding.",
              "5": "Born leader! 🌟 Guiding others is effortless and deeply fulfilling. Vision and purpose!"
          }},
          { name: "control", desc: {
              "1": "Control feels... controlling! 😬 I prefer things to flow freely. Maybe structured flow?",
              "2": "I take the reins sometimes, but worry about pulling too tight. Finding the balance! 🐎",
              "3": "Holding the reins feels right. Maintaining structure and direction comfortably. 👌",
              "4": "I love being in control! 🎮 Shaping the dynamic and guiding my partner is empowering.",
              "5": "Master conductor! 🎶 Orchestrating every detail brings immense satisfaction. Control is art."
          }}
          // Uses core 'authority' and 'care'
        ]
      },
      {
        name: "Assertive",
        summary: "Leads with clear communication and boundaries, less focused on heavy control.",
        traits: [
          { name: "direct communication", desc: {
              "1": "Speaking directly feels blunt or awkward. I hint instead! 🤔 Maybe clarity is kinder?",
              "2": "I can state my needs, but sometimes sugarcoat too much. Practicing clarity! 💬",
              "3": "Clear and direct! ✅ I communicate my desires and boundaries effectively.",
              "4": "Say what you mean, mean what you say! ✨ Directness is efficient and respectful.",
              "5": "Crystal clear communication! 💎 My words are precise, leaving no room for doubt."
          }},
          { name: "boundary setting", desc: {
              "1": "Setting boundaries feels mean! 😟 I avoid confrontation. Maybe boundaries create safety?",
              "2": "I set boundaries sometimes, but might wobble if pushed. Strengthening my 'No'! ✋",
              "3": "My boundaries are clear and respected. 👍 Healthy limits make for healthy play.",
              "4": "Rock solid boundaries! 💪 I set and maintain limits confidently and consistently.",
              "5": "Fortress of boundaries! 🏰 My limits are absolute and non-negotiable, creating a secure space."
          }}
          // Uses core 'authority', 'care'
        ]
      },
      {
        name: "Nurturer",
        summary: "Focuses on emotional support, patience, and guiding partner's growth.",
        traits: [
          { name: "emotional support", desc: {
              "1": "Emotions? Awkward! 😬 Not sure how to respond. Maybe start with listening?",
              "2": "I try to be supportive, but sometimes say the wrong thing. Learning emotional first aid!🩹",
              "3": "I'm a good listener and offer comfort when needed. 😊 Creating a safe emotional space.",
              "4": "Your rock! 💪 I provide strong emotional support, validation, and encouragement.",
              "5": "Empathy expert!💖 I intuitively understand and nurture my partner's emotional landscape."
          }},
          { name: "patience", desc: {
              "1": "Patience is thin! I want results now! ⏱️ Frustration bubbles easily.",
              "2": "Trying to be patient, but sometimes I rush things. Deep breaths! 🧘",
              "3": "Patience is a virtue I practice! 👍 Understanding that growth takes time.",
              "4": "Calm and patient guide. 🌱 I provide ample space and time for my partner to learn and grow.",
              "5": "Endless patience! ⏳ Like a steady river, I flow calmly, guiding without rush."
          }}
           // Uses core 'care' strongly
        ]
      },
      {
        name: "Strict",
        summary: "Maintains order through clear rules, consistent enforcement, and discipline.",
        traits: [
          { name: "rule enforcement", desc: {
              "1": "Enforcing rules feels harsh. I tend to let things slide. 😟 Maybe structure is helpful?",
              "2": "I have rules, but consistency is tricky. Sometimes I forget or give in. 😅",
              "3": "Rules are rules! ✅ I enforce them consistently and fairly.",
              "4": "No excuses! 💪 I maintain high standards and enforce rules strictly.",
              "5": "Iron fist in a velvet glove (or maybe just iron!). ✊ Absolute adherence to rules is expected and enforced."
          }},
          { name: "discipline focus", desc: {
              "1": "Discipline sounds scary! 😨 I prefer positive reinforcement only.",
              "2": "Might issue a 'punishment' sometimes, but hesitant about it. Exploring its role. 🤔",
              "3": "Discipline is a tool for growth and maintaining order. Used appropriately. 🧐",
              "4": "Clear consequences for rule-breaking. Discipline is essential for training and structure. 🔥",
              "5": "Master of discipline! ⚖️ Consequences are delivered precisely and effectively to shape behavior."
          }}
           // Uses core 'authority'
        ]
      },
       // ... Include ALL other Dominant styles from data.js ...
       // (Master, Mistress, Daddy, Mommy, Owner, Rigger, Sadist, Hunter, Trainer, Puppeteer, Protector, Disciplinarian, Caretaker, Sir, Goddess, Commander)
       // Ensure each has a 'summary' and 'traits' array
       { name: "Master", summary: "Commands with high expectations and a strong sense of presence/ownership.", traits: [/*...*/]},
       { name: "Mistress", summary: "Leads with elegance, high standards, and captivating presence.", traits: [/*...*/]},
       { name: "Daddy", summary: "Combines protective guidance with affectionate authority.", traits: [/*...*/]},
       { name: "Mommy", summary: "Provides nurturing comfort and gentle, guiding discipline.", traits: [/*...*/]},
       // ... [Continue adding all dominant styles similarly] ...
       { name: "Commander", summary: "Directs scenes and tasks with strategic planning and decisive orders.", traits: [/*...*/]},
    ]
  },

  // === SWITCH ROLE === (Optional but Recommended)
  switch: {
    roleName: "Switch",
    description: "Enjoys fluently shifting between Dominant and Submissive roles, adapting to the dynamic and partner's energy.",
    coreTraits: [ // Switches often share traits from both sides
      { name: "adaptability", desc: { /* ... */ }},
      { name: "empathy", desc: { /* ... */ }},
      { name: "communication", desc: { /* Define 5 levels for clear role negotiation */ }},
       // Maybe 'energy reading'?
    ],
    styles: [ // Switch styles might reflect *how* they switch or their preferred balance
        { name: "Fluid Switch", summary: "Shifts roles easily and intuitively based on the moment.", traits: [/* Core switch traits */]},
        { name: "Top-Leaning Switch", summary: "Prefers Dominant roles but enjoys Submitting sometimes.", traits: [/* Mix of Dom core and Switch core */]},
        { name: "Bottom-Leaning Switch", summary: "Prefers Submissive roles but enjoys Topping sometimes.", traits: [/* Mix of Sub core and Switch core */]},
        // Could add styles based on *why* they switch (e.g., 'Partner-Focused Switch')
    ]
  }
};
