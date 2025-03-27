// === data.js === (FULLY POPULATED - Descriptions, Emojis)

export const bdsmData = {
  // === SUBMISSIVE ROLE ===
  submissive: {
    roleName: "Submissive",
    description: "A role focused on yielding control, trusting a partner's guidance, and finding fulfillment in service, obedience, or specific dynamics.",
    coreTraits: [
      { name: "obedience", desc: { "1": "Resists/ignores instructions  independente", "2": "Follows simple/clear orders, maybe hesitant", "3": "Generally obedient, follows known rules", "4": "Enjoys following commands, aims to please", "5": "Thrives on obedience, finds joy in fulfilling orders" } },
      { name: "trust", desc: { "1": "Very hesitant to trust", "2": "Trusts cautiously, needs reassurance", "3":"Generally trusting in safe contexts", "4":"Trusts partner deeply", "5":"Unconditional trust, heart open" } },
      { name: "receptiveness", desc: { "1":"Resistant to input/direction", "2":"Hesitant receiver, selective", "3":"Generally open to receiving", "4":"Welcomes direction/sensation", "5":"Fully receptive and absorbing" } },
      { name: "vulnerability", desc: { "1":"Heavily guarded emotionally", "2":"Cautiously reveals feelings", "3":"Shares feelings when feeling safe", "4":"Comfortable expressing needs/softness", "5":"Embraces and shares vulnerability openly" } }
    ],
    styles: [
      { name: "Classic Submissive 🙇‍♀️", summary: "Focuses on general obedience, service, and presentation within a power dynamic.", traits: [
          { name: "service", desc: { "1": "Serving? Prefers self-focus", "2": "Helps if asked, not proactive", "3": "Happy to help, finds satisfaction", "4": "Service with a smile, anticipates", "5": "Love language is service!" } },
          { name: "presentation", desc: { "1": "Low effort appearance", "2": "Cleans up okay, minimal fuss", "3": "Likes looking presentable", "4": "Enjoys looking their best for role", "5": "Presentation is part of the art" } }
      ]},
      { name: "Brat 😈", summary: "Enjoys playful defiance, testing boundaries, and earning consequences.", traits: [
          { name: "playful defiance", desc: { "1": "Prefers following rules", "2": "Gentle poking/testing", "3": "Enjoys witty banter/rule-bending", "4": "Thrives on loopholes/challenges", "5": "Ruler of Sass, defiance is art" } },
          { name: "mischief", desc: { "1": "Prefers calm, avoids trouble", "2": "Tiny prank/tease slips out", "3":"Stirring things up is fun sometimes", "4":"Clever, playful troublemaker", "5":"Chaos Creator!" } }
      ]},
      { name: "Slave 🔗", summary: "Finds deep fulfillment in total devotion, service, and surrender.", traits: [
          { name: "devotion", desc: { "1": "Intense, holds back", "2": "Loyal, exploring deeper", "3": "Heart belongs to Dom/Mistress", "4": "World revolves around Owner", "5": "Absolute devotion is core" } },
          { name: "surrender", desc: { "1": "Scary, keeps some control", "2": "Yields sometimes, challenge", "3": "Mostly freeing, trusts", "4": "Deep surrender feels right", "5": "Complete surrender = sanctuary" } },
          { name: "service", desc: { "1": "Avoids tasks", "2": "Service feels like chore", "3": "Service is part of the role", "4": "Anticipates needs eagerly", "5": "Utter fulfillment in service" } } // Example linking service
      ]},
      { name: "Pet 🐾", summary: "Enjoys embodying an animal persona, seeking affection and guidance.", traits: [
          { name: "affection seeking", desc: { "1": "Waits, doesn't ask", "2": "Shy about asking", "3": "Enjoys seeking/receiving", "4": "'Good pet!' = music", "5": "Affection is fuel!" } },
          { name: "playfulness", desc: { "1":"Reserved, not very playful", "2":"Occasionally playful", "3":"Enjoys light games/teasing", "4":"Actively seeks play", "5":"Boundlessly playful" } },
          { name: "non-verbal expression", desc: { "1": "Prefers words", "2": "Some non-verbal slips", "3": "Nuzzles/wags come naturally", "4": "Fluent in Pet!", "5": "Body language IS language" } }
      ]},
      { name: "Little 🍼", summary: "Embraces a childlike mindset, seeking care, play, and structure.", traits: [
          { name: "age regression comfort", desc: { "1": "Awkward/embarrassing", "2": "Dips in cautiously", "3": "Comfy happy place", "4": "Natural and joyful!", "5": "Littlespace is home!" } },
          { name: "need for guidance", desc: { "1": "Prefers independence", "2": "Accepts rules sometimes", "3": "Guidance feels safe", "4": "Thrives with rules", "5": "Complete reliance is bliss!" } },
          { name: "innocence", desc: { "1":"Feels mature/worldly", "2":"Retains some adult perspective", "3":"Enjoys feeling sweet/carefree", "4":"Naturally embodies innocence", "5":"Pure childlike wonder" } }
      ]},
      { name: "Puppy 🐶", summary: "Exudes boundless energy, loyalty, and eagerness to please.", traits: [
           { name: "boundless energy", desc: { "1": "Low energy, prefers rest", "2": "Bursts of energy, tires easily", "3": "Good energy, ready to play", "4": "Zoomies! Full of enthusiasm", "5": "Unstoppable puppy power!" } },
           { name: "trainability", desc: { "1": "Easily distracted, slow learner", "2": "Learns with patience/repetition", "3": "Picks up commands well", "4": "Loves learning, super focused", "5": "Learns instantly, top dog!" } },
           { name: "affection seeking", desc: { "1": "Indifferent to praise", "2": "Likes occasional pats", "3": "Enjoys praise/cuddles", "4": "Actively seeks validation", "5": "Needs constant affection" } }
      ]},
      { name: "Kitten 🐱", summary: "Combines curiosity, grace (or playful clumsiness), and affection.", traits: [
           { name: "curiosity", desc: { "1": "Prefers familiar, avoids new", "2": "Cautiously curious", "3": "Enjoys exploring, playful bats", "4": "Must investigate everything", "5": "Fearlessly inquisitive" } },
           { name: "gracefulness", desc: { "1": "Very clumsy", "2": "Sometimes sleek, sometimes trips", "3": "Reasonable kitten grace", "4": "Sleek, poised, feline charm", "5": "Poetry in motion, elegant" } },
           { name: "affection seeking", desc: { "1": "Aloof, independent", "2": "Accepts affection sometimes", "3": "Enjoys being petted/nuzzling", "4": "Seeks out laps/cuddles", "5": "Craves constant attention/pets" } }
      ]},
      { name: "Princess 👑", summary: "Adores being pampered and centre stage.", traits: [
          { name: "desire for pampering", desc: { "1": "Low maintenance, dislikes fuss", "2": "Enjoys occasional treats", "3": "Being spoiled feels lovely", "4": "Thrives on being doted on", "5": "Expects luxurious treatment" } },
          { name: "delegation tendency", desc: { "1": "Prefers doing things self", "2": "Asks for help sometimes", "3": "Appreciates things done for them", "4": "Readily delegates tasks", "5": "Naturally expects others to cater" } },
          { name: "innocence", desc: { /* (Optional link, might clash with delegation) */ "1":"Worldly", "2":"Aware but playful", "3":"Sweet demeanor", "4":"Cultivated innocence", "5":"Genuinely naive charm" } }
      ]},
      { name: "Rope Bunny 🪢", summary: "Loves the art and sensation of rope.", traits: [
           { name: "rope enthusiasm", desc: { "1": "Hesitant/dislikes ropes", "2": "Curious, needs safety", "3": "Enjoys simple ties", "4": "Loves aesthetics/sensation", "5": "Adores complex ties/suspension" } },
           { name: "patience during tying", desc: { "1": "Very fidgety/impatient", "2": "Patient for short periods", "3": "Reasonably patient", "4": "Finds calm zen", "5": "Stillness is surrender" } },
           { name: "sensuality", desc: { "1":"Focus on restriction", "2":"Notices sensation somewhat", "3":"Appreciates feel of rope", "4":"Very aware of rope on skin", "5":"Rope play is highly sensual" } }
      ]},
      { name: "Masochist 💥", summary: "Finds pleasure/release through pain.", traits: [
            { name: "pain interpretation", desc: { "1": "Pain just hurts", "2": "Intensity is interesting?", "3": "Release/focus via pain", "4": "Pain often translates to pleasure", "5": "Pain is symphony/ecstasy" } },
            { name: "sensation seeking", desc: { "1": "Gentle is best", "2": "Mild to moderate okay", "3": "Enjoy exploring sensations", "4": "Crave intense/sharp", "5": "Seek extreme sensations" } },
            { name: "endurance display", desc: { "1":"Low tolerance display", "2":"Can take some, no show", "3":"Showing toughness is fun", "4":"Pride in endurance", "5":"Loves showing toughness" } } // Added endurance display
      ]},
      { name: "Prey 🏃‍♀️", summary: "Enjoys the thrill of the chase.", traits: [
          { name: "enjoyment of chase", desc: { "1": "Terrifying, avoid", "2": "Playful pursuit okay", "3": "Thrill is exciting!", "4": "Love the adrenaline rush", "5": "Chase IS the ecstasy" } },
          { name: "fear play comfort", desc: { "1": "No fear play", "2": "Okay in small doses", "3": "Adds spice when safe", "4": "Thrilling with trust", "5": "Exhilarating dance with 'fear'" } },
          { name: "rebellion", desc: { /* (Optional link, may try to 'escape') */ } }
      ]},
       {
        name: "Toy 🎲", summary: "Loves being used and played with.", traits: [
          { name: "objectification comfort", desc: { "1": "Dehumanizing", "2": "Okay sometimes, need cherishing", "3": "Fun being played with", "4": "Love being prized possession", "5": "Exist to be used/enjoyed" } },
          { name: "responsiveness to control", desc: { "1": "Awkward/inflexible", "2": "Stiff, needs direction", "3": "Respond well", "4": "Mold me! Highly responsive", "5": "Like clay" } },
          { name: "adaptability", desc: { "1":"Rigid", "2":"Adapts slowly", "3":"Fairly adaptable to use", "4":"Easily adapts to role", "5":"Instantly adapts as needed"} }
        ]
      },
      {
        name: "Doll 🎎", summary: "Enjoys being perfectly posed and admired.", traits: [
          { name: "aesthetic focus", desc: { "1": "Looks unimportant", "2": "Nice, but effort", "3": "Crafting look is fun", "4": "Becoming Doll is art", "5": "Living Doll perfection" } },
          { name: "stillness / passivity", desc: { "1": "Need to move", "2": "Still briefly, restless", "3": "Posed/still is nice", "4": "Love melting into stillness", "5": "Perfectly still/passive" } },
          { name: "objectification comfort", desc: { "1":"Dislikes object feeling", "2":"Tolerates briefly", "3":"Enjoys being admired object", "4":"Loves being displayed", "5":"Finds deep fulfillment"} }
        ]
      },
      {
        name: "Bunny 🐰", summary: "Gentle, shy, and easily startled.", traits: [
          { name: "shyness / skittishness", desc: { "1": "Bold, not skittish", "2": "A little shy/needs gentle", "3": "Soft, easily startled", "4": "Shy/skittish is charm", "5": "Definition of skittish" } },
          { name: "gentle affection need", desc: { "1": "Prefers intensity", "2":"Appreciates gentle", "3":"Soft pets/words best", "4":"Thrives on gentle touch", "5":"Only softest touch" } },
          { name: "innocence", desc: { "1":"Feels worldly", "2":"Naive at times", "3":"Sweet and trusting", "4":"Naturally innocent vibe", "5":"Pure, wide-eyed wonder" } }
        ]
      },
      {
        name: "Servant 🧹", summary: "Finds joy in dutiful service.", traits: [
           { name: "task focus", desc: { "1": "Focus wanders", "2": "Do tasks, get sidetracked", "3": "Enjoy task lists", "4": "Highly focused on duty", "5": "Laser-focused" } },
           { name: "anticipating needs", desc: { "1": "Barely notice", "2": "Spot sometimes", "3": "Starting to anticipate", "4": "Often see needs first", "5": "Finely tuned intuition" } },
           { name: "politeness", desc: { "1": "Blunt/informal", "2": "Casually polite", "3": "Courteous always", "4": "Formal and respectful", "5": "Impeccable manners" } }
        ]
      },
      {
        name: "Playmate 🎉", summary: "Loves shared fun and adventure.", traits: [
           { name: "enthusiasm for games", desc: { "1": "Not playful", "2": "Play along sometimes", "3": "Game on!", "4": "Super enthusiastic", "5": "Always ready!" } },
           { name: "good sport", desc: { "1": "Hate losing/frustrated", "2": "Try, but get sulky", "3": "Win/lose, all fun", "4": "Excellent sport", "5": "Perfect playmate" } },
           { name: "playfulness", desc: { "1":"Serious", "2":"Occasional silliness", "3":"Enjoys fun", "4":"Very playful", "5":"Embodies playfulness"} }
        ]
      },
      {
        name: "Babygirl 🌸", summary: "Craves nurturing, affection, guidance.", traits: [
          { name: "vulnerability expression", desc: { "1": "Brave face", "2": "Crack in armor", "3": "Expressing needs okay", "4": "Embrace softer side", "5": "Vulnerability is strength" } },
          { name: "coquettishness", desc: { "1": "Awkward/unnatural", "2": "A little charming?", "3": "Wink and smile", "4": "Expert flirt", "5": "Master of allure" } },
          { name: "need for guidance", desc: { "1": "Very independent", "2": "Accepts some guidance", "3": "Likes having rules", "4": "Thrives with structure", "5": "Relies completely" } }
        ]
      },
      {
        name: "Captive ⛓️", summary: "Relishes the thrill of capture/restraint.", traits: [
          { name: "struggle performance", desc: { "1": "Comply immediately", "2": "Token wiggle", "3": "Playing part is fun", "4": "Enjoy the show", "5": "Oscar-worthy" } },
          { name: "acceptance of fate", desc: { "1": "Genuine distress", "2": "Uneasy acceptance", "3": "Alright, you win...", "4": "Love being captured", "5": "Exactly where I want to be" } },
           { name: "fear play comfort", desc: { "1":"No fear play", "2":"Okay in small doses", "3":"Adds spice when safe", "4":"Thrilling with trust", "5":"Exhilarating dance with 'fear'"} } // Added link
        ]
      },
      {
        name: "Thrall 🛐", summary: "Bound by deep devotion/mental connection.", traits: [
           { name: "mental focus", desc: { "1": "Mind wanders", "2": "Try, distractions creep in", "3": "Can tune in well", "4": "Deeply focused", "5": "Total mental immersion" } },
           { name: "suggestibility", desc: { "1": "Question everything", "2": "Consider, but decide self", "3": "Open to Dom's suggestions", "4": "Highly suggestible in dynamic", "5": "Putty in hands (mentally)" } },
           { name: "devotion", desc: { /* (Link trait) */ "1":"...", "2":"...", "3":"...", "4":"...", "5":"..." } }
        ]
      },
      {
        name: "Puppet 🎭", summary: "Loves being precisely directed.", traits: [
          { name: "responsiveness to direction", desc: { "1": "Clumsy/slow", "2": "Follow, need repeats", "3": "Respond well", "4": "Instant response!", "5": "Their will is my action" } },
          { name: "passivity in control", desc: { "1": "Want to do own thing", "2": "Mostly passive, oops", "3": "Wait patiently", "4": "Deeply passive until directed", "5": "Perfectly passive puppet" } }
          // Uses core obedience, receptiveness
        ]
      },
      {
        name: "Maid 🧼", summary: "Delights in order and polite service.", traits: [
          { name: "attention to detail", desc: { "1": "Close enough", "2": "Try, miss small things", "3": "Cleanliness important", "4": "Spotless! Keen eye", "5": "Perfection is standard" } },
          { name: "uniformity", desc: { "1": "Restrictive/impersonal", "2": "Okay sometimes", "3": "Helps get into character", "4": "Love my uniform!", "5": "Uniform IS me" } },
          { name: "service", desc: { /* (Link trait) */ "1":"...", "2":"...", "3":"...", "4":"...", "5":"..." } }
        ]
      },
       {
        name: "Painslut 🔥", summary: "Craves intense sensation, pushes limits.", traits: [
          { name: "pain seeking", desc: { "1": "Avoidance key", "2": "Tolerate, not ask", "3": "Crave edge sometimes", "4": "Yes, please! Ask for pain", "5": "Feed me pain!" } },
          { name: "endurance display", desc: { "1": "Cry uncle fast", "2": "Take some, no show off", "3": "Look what I handle!", "4": "Push me harder!", "5": "Unbreakable (almost)!" } },
          { name: "craving", desc: { "1":"Prefers calm", "2":"Likes mild intensity", "3":"Enjoys strong sensations", "4":"Seeks out thrills", "5":"Needs extreme intensity" } }
        ]
      },
      {
        name: "Bottom ⬇️", summary: "Open to receiving sensation/direction.", traits: [
          // Uses core receptiveness
          { name: "power exchange focus", desc: { "1": "Prefers equality", "2": "Okay sometimes", "3": "Enjoy giving power", "4": "Central and exciting!", "5": "Giving power fulfilling" } },
          { name: "painTolerance", desc: { "1":"Very sensitive", "2":"Low tolerance", "3":"Average tolerance", "4":"High tolerance", "5":"Extremely high tolerance" } }
        ]
      }
    ]
  },

  // === DOMINANT ROLE ===
  dominant: {
    roleName: "Dominant",
    description: "A role focused on taking charge, guiding the dynamic, providing structure, and deriving satisfaction from leading or caring for a partner.",
    coreTraits: [
       { name: "authority", desc: { "1": "Prefer following", "2": "Can steer, worry", "3": "Comfortable at helm", "4": "Love calling shots", "5": "Presence commands" } },
       { name: "care", desc: { "1": "Focus on action", "2": "Try, miss cues", "3": "Checking in important", "4": "Well-being top target", "5": "Guardian Angel mode" } },
       { name: "control", desc: { "1":"Hands-off, prefers flow", "2":"Suggests direction, flexible", "3":"Manages scene structure", "4":"Enjoys detailed control", "5":"Orchestrates everything precisely" } },
       { name: "confidence", desc: { "1":"Hesitant, self-doubting", "2":"Cautiously sure, seeks validation", "3":"Generally confident in decisions", "4":"Decisive leader, trusts self", "5":"Unshakeable self-assurance" } }
    ],
    styles: [
      { name: "Classic Dominant 👑", summary: "Focuses on general leadership, control, and setting the dynamic's tone.", traits: [ { name: "leadership", desc: { "1":"Reluctant leader", "2":"Guides when needed", "3":"Confident direction", "4":"Inspiring leader", "5":"Natural born leader" } } /* Uses core authority, control, confidence, care */ ] },
      { name: "Assertive 💪", summary: "Leads with clear communication and boundaries.", traits: [ { name: "direct communication", desc: { "1":"Hints subtly", "2":"States needs carefully", "3":"Clear and direct", "4":"Says what they mean", "5":"Crystal clear precision" } }, { name: "boundary setting", desc: { "1":"Avoids setting limits", "2":"Sets limits hesitantly", "3":"Clear, respected boundaries", "4":"Rock solid limits", "5":"Fortress of boundaries" } } ] },
      { name: "Nurturer 🤗", summary: "Focuses on emotional support, patience, and guiding growth.", traits: [ { name: "emotional support", desc: { "1":"Awkward with emotions", "2":"Tries to be supportive", "3":"Good listener, offers comfort", "4":"Your rock, provides validation", "5":"Empathy expert" } }, { name: "patience", desc: { "1":"Impatient, wants results now", "2":"Tries, but rushes", "3":"Practices patience", "4":"Calm and patient guide", "5":"Endless patience" } }, { name: "empathy", desc: { "1":"Detached observer", "2":"Notices obvious feelings", "3":"Good sense of partner's state", "4":"Strongly empathizes", "5":"Deeply intuitive connection" } } ] },
      { name: "Strict 📏", summary: "Maintains order through clear rules and discipline.", traits: [ { name: "rule enforcement", desc: { "1":"Lets things slide", "2":"Inconsistent enforcement", "3":"Enforces consistently", "4":"Maintains high standards", "5":"Absolute adherence expected" } }, { name: "discipline focus", desc: { "1":"Prefers positive reinforcement", "2":"Hesitant about punishment", "3":"Discipline as tool for growth", "4":"Clear consequences essential", "5":"Master of discipline" } } ] },
      { name: "Master 🎓", summary: "Commands with high expectations and strong presence/ownership.", traits: [ { name: "expectation setting", desc: { "1":"Vague standards", "2":"Some expectations, could clarify", "3":"Clear standards/protocols", "4":"High standards, communicated", "5":"Impeccable standards" } }, { name: "presence", desc: { "1":"Blends in", "2":"Tries to project authority", "3":"Presence felt naturally", "4":"Commands attention effortlessly", "5":"Radiating power" } }, { name: "dominanceDepth", desc: { "1":"Light influence", "2":"Prefers shared power", "3":"Enjoys clear authority", "4":"Seeks significant influence", "5":"Craves total power/control" } } ] },
      { name: "Mistress 👸", summary: "Leads with elegance, high standards, and captivating presence.", traits: [ { name: "expectation setting", desc: { "1":"Standards fuzzy", "2":"Practice setting rules", "3":"Clear expectations", "4":"High standards expected/rewarded", "5":"Exquisite standards" } }, { name: "presence", desc: { "1":"Quiet influence", "2":"Working on aura", "3":"Authority felt naturally", "4":"Effortless command", "5":"Regal presence" } }, { name: "creativity", desc: { "1":"Prefers known routines", "2":"Tries small variations", "3":"Enjoys crafting scenes", "4":"Highly imaginative", "5":"Master scene creator" } } ] },
      { name: "Daddy 👨‍🏫", summary: "Combines protective guidance with affectionate authority.", traits: [ { name: "protective guidance", desc: { "1":"Hands-off approach", "2":"Offers advice sometimes", "3":"Looks out for partner", "4":"Your safe harbor", "5":"Ultimate Daddy Bear" } }, { name: "affectionate authority", desc: { "1":"One or the other", "2":"Balancing act", "3":"Firm but fair, with praise", "4":"Warm hugs & stern rules", "5":"Perfect blend" } }, { name: "possession", desc: { "1":"Not possessive", "2":"Slightly protective", "3":"Comfortable 'mine' feeling", "4":"Clearly mine", "5":"Strong sense of ownership" } } ] }, // Added possession
      { name: "Mommy 👩‍🏫", summary: "Provides nurturing comfort and gentle, guiding discipline.", traits: [ { name: "nurturing comfort", desc: { "1":"Not naturally nurturing", "2":"Can be comforting", "3":"Kiss it better!", "4":"Your safe haven", "5":"Ultimate Mommy" } }, { name: "gentle discipline", desc: { "1":"Avoids correction", "2":"Prefers talking through", "3":"Gentle correction", "4":"Firm but gentle hand", "5":"Master of gentle guidance" } }, { name: "care", desc: { /* (Link core trait) */ } } ] },
      { name: "Owner 🔑", summary: "Takes pride in possession and care.", traits: [ { name: "possessiveness", desc: { "1":"Not possessive", "2":"Slightly protective", "3":"Comfortable 'mine' feeling", "4":"Clearly MINE", "5":"Absolute possession" } }, { name: "behavioral training", desc: { "1":"Winging it", "2":"Some direction, hit/miss", "3":"Uses rewards/correction", "4":"Skilled trainer", "5":"Master behavioralist" } }, { name: "control", desc: { /* (Link core trait) */ } } ] },
      { name: "Rigger 🧵", summary: "Artist of restraint and sensation.", traits: [ { name: "rope technique", desc: { "1":"Rope=spaghetti", "2":"Learning basics", "3":"Comfortable with several ties", "4":"Skilled rope artist", "5":"Rope Master!" } }, { name: "aesthetic vision", desc: { "1":"Looks don't matter", "2":"Function first", "3":"Presentation matters", "4":"Creating rope art!", "5":"Sculpting with rope" } }, { name: "precision", desc: { "1":"Approximate ties", "2":"Tries for neatness", "3":"Careful placement", "4":"Very precise knotting", "5":"Flawless execution" } } ] },
      { name: "Sadist 😏", summary: "Finds joy in giving sensation with care.", traits: [ { name: "sensation control", desc: { "1":"Hesitant to inflict", "2":"Experimenting cautiously", "3":"Getting the hang of it", "4":"Skilled conductor", "5":"Master of senses" } }, { name: "psychological focus", desc: { "1":"Focus on action", "2":"Noticing reactions more", "3":"Reactions fascinating", "4":"Thrive on influencing state", "5":"Their reaction is masterpiece" } }, { name: "sadism", desc: { "1":"Avoids causing pain", "2":"Enjoys teasing edge", "3":"Likes controlled infliction", "4":"Finds pleasure in partner's reaction to pain", "5":"Deep enjoyment from consensual sadism" } } ] },
      { name: "Hunter 🏹", summary: "Thrives on the chase and capture.", traits: [ { name: "pursuit drive", desc: { "1":"Prefers prey come", "2":"Playful pursuit okay", "3":"Thrill is exciting!", "4":"Born predator!", "5":"Hunt is everything!" } }, { name: "instinct reliance", desc: { "1":"Needs a plan", "2":"Prefers strategy, some gut feel", "3":"Trusting instincts feels good", "4":"Instincts are sharp", "5":"Pure instinct" } }, { name: "boldness", desc: { /* (Link core trait) */ } } ] },
      { name: "Trainer 🏋️‍♂️", summary: "Guides with patience and structure.", traits: [ { name: "skill development focus", desc: { "1":"Sub should know/learn self", "2":"Offers some guidance", "3":"Rewarding to help grow", "4":"Dedicated trainer", "5":"Master coach" } }, { name: "structured methodology", desc: { "1":"Winging it", "2":"Some steps, not formal", "3":"Clear steps, feedback", "4":"Systematic training!", "5":"Perfect curriculum" } }, { name: "patience", desc: { /* (Link core trait) */ } } ] },
      { name: "Puppeteer 🕹️", summary: "Controls with creative precision.", traits: [ { name: "fine motor control", desc: { "1":"Broad strokes", "2":"Working on precision", "3":"Guiding feels good", "4":"Master manipulator!", "5":"Absolute micro-control" } }, { name: "objectification gaze", desc: { "1":"Need human connection", "2":"Can detach sometimes", "3":"Puppeteer mindset fun", "4":"Deep enjoyment in objectification", "5":"Puppet exists for direction" } }, { name: "creativity", desc: { /* (Link core trait) */ } } ] },
      { name: "Protector 🛡️", summary: "Leads with vigilance and strength.", traits: [ { name: "vigilance", desc: { "1":"Not very watchful", "2":"Tries to be aware", "3":"Keeping an eye out", "4":"Ever watchful guardian", "5":"Eagle eyes!" } }, { name: "defensive instinct", desc: { "1":"Avoids conflict", "2":"Steps in if serious", "3":"Don't mess with mine!", "4":"Fiercely protective", "5":"Unbreakable shield!" } } /* Uses core care, authority */ ] },
      { name: "Disciplinarian ✋", summary: "Enforces rules with firm fairness.", traits: [ { name: "consequence delivery", desc: { "1":"Avoids punishment", "2":"Hesitant/inconsistent", "3":"Fair and firm", "4":"Decisive and effective", "5":"Master of correction" } }, { name: "detachment during discipline", desc: { "1":"Gets emotional", "2":"Tries to stay calm", "3":"Objective and calm", "4":"Cool under pressure", "5":"Ice-cold precision" } }, { name: "rule enforcement", desc: { /* (Link strict trait) */ } } ] },
      { name: "Caretaker 🧡", summary: "Nurtures and supports holistically.", traits: [ { name: "holistic well-being focus", desc: { "1":"Focus elsewhere", "2":"Checks basic safety", "3":"Attentive overall", "4":"Total care package!", "5":"Guardian of well-being" } }, { name: "rule implementation for safety", desc: { "1":"Too much hassle", "2":"Suggests habits gently", "3":"Sets practical rules", "4":"Enforces lovingly but firmly", "5":"Master preventative care" } }, { name: "patience", desc: { /* (Link core trait) */ } } ] },
      { name: "Sir 🎩", summary: "Leads with honor and respect.", traits: [ { name: "formal demeanor", desc: { "1":"Super casual", "2":"Formal when needed", "3":"Respectful, formal tone", "4":"Calm, formal presence", "5":"Epitome of formal authority" } }, { name: "service expectation", desc: { "1":"Not focus", "2":"Appreciates good service", "3":"Expects proper service", "4":"High standards enforced", "5":"Impeccable service mandatory" } }, { name: "discipline", desc: { /* (Optional: Link trait) */ } } ] },
      { name: "Goddess 🌟", summary: "Inspires worship and adoration.", traits: [ { name: "worship seeking", desc: { "1":"Embarrassing", "2":"A little adoration nice", "3":"Being adored wonderful", "4":"Bask in my glory!", "5":"I AM divine!" } }, { name: "effortless command", desc: { "1":"Takes effort", "2":"Working on inevitability", "3":"Understood with minimal fuss", "4":"Look/word is enough", "5":"My will shapes reality" } }, { name: "presence", desc: { /* (Link master/mistress trait) */ } } ] },
      { name: "Commander ⚔️", summary: "Leads with strategic control.", traits: [ { name: "strategic direction", desc: { "1":"Winging it", "2":"General idea only", "3":"Clear objectives/orders", "4":"Master strategist!", "5":"Flawless command/control" } }, { name: "decisiveness", desc: { "1":"Decisions hard", "2":"Takes time, second-guesses", "3":"Clear decisions, sticks to", "4":"Swift and decisive!", "5":"Instant, unwavering" } }, { name: "leadership", desc: { /* (Link trait) */ } } ] }
    ]
  },

  // === SWITCH ROLE ===
  switch: {
    roleName: "Switch",
    description: "Enjoys fluently shifting between Dominant and Submissive roles, adapting to the dynamic and partner's energy.",
    coreTraits: [
      { name: "adaptability", desc: { "1":"Prefers one role", "2":"Switches with effort", "3":"Comfortable switching", "4":"Enjoys fluid shifts", "5":"Seamlessly adaptable" } },
      { name: "empathy", desc: { "1":"Focuses on own role", "2":"Tries to understand other role", "3":"Good sense of both sides", "4":"Strongly empathizes", "5":"Deeply connects with both" } },
      { name: "communication", desc: { "1": "Hints subtly about shifts", "2":"States preference if asked", "3":"Clearly negotiates role shifts", "4":"Proactively discusses desire to switch", "5":"Intuitive & clear verbal/non-verbal cues for shifts" } },
       { name: "energy reading", desc: { "1":"Unaware of dynamic shifts", "2":"Sometimes notices partner cues", "3":"Reads obvious energy shifts", "4":"Sensitive to partner's state/desire", "5":"Deeply attuned to dynamic flow"} }
    ],
    styles: [
        { name: "Fluid Switch 🌊", summary: "Shifts roles easily and intuitively based on the moment.", traits: [ /* Uses core switch traits */]},
        { name: "Dominant-Leaning Switch 👑↔️", summary: "Primarily enjoys Dominant roles but explores Submission.", traits: [ /* Refers to Dom core + Switch core - No specific traits needed beyond core */ ]},
        { name: "Submissive-Leaning Switch 🙇‍♀️↔️", summary: "Primarily enjoys Submissive roles but explores Dominance.", traits: [ /* Refers to Sub core + Switch core - No specific traits needed beyond core */ ]},
        { name: "Situational Switch 🤔", summary: "Role depends heavily on partner, mood, or context.", traits: [ /* Uses core switch traits */ ]}
    ]
  }
};

// *** IMPORTANT: Ensure ALL 'desc' objects above are filled with 5 levels ***
