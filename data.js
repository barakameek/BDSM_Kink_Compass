// === data.js === (FULLY POPULATED - Descriptions, Emojis, Patience Fix)

export const bdsmData = {
  // === SUBMISSIVE ROLE ===
  submissive: {
    roleName: "Submissive",
    description: "A role focused on yielding control, trusting a partner's guidance, and finding fulfillment in service, obedience, or specific dynamics.",
    coreTraits: [
      { name: "obedience", desc: { "1": "Resists/ignores instructions", "2": "Follows simple/clear orders, maybe hesitant", "3": "Generally obedient, follows known rules", "4": "Enjoys following commands, aims to please", "5": "Thrives on obedience, finds joy in fulfilling orders" } },
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
          { name: "devotion", desc: { "1": "Loyal but keeps independence", "2": "Loyal, exploring deeper commitment", "3": "Heart belongs to Dom/Mistress", "4": "World revolves around Owner", "5": "Absolute devotion is core" } },
          { name: "surrender", desc: { "1": "Yields physically, mentally resistant", "2": "Yields sometimes, finds it a challenge", "3": "Mostly freeing, enjoys trusting", "4": "Deep surrender feels right and fulfilling", "5": "Complete surrender = sanctuary" } },
          { name: "service", desc: { "1": "Avoids tasks when possible", "2": "Service feels like chore, does if must", "3": "Service is part of the role, performs well", "4": "Anticipates needs eagerly, finds joy", "5": "Utter fulfillment in perfect service" } }
      ]},
      { name: "Pet 🐾", summary: "Enjoys embodying an animal persona, seeking affection and guidance.", traits: [
          { name: "affection seeking", desc: { "1": "Waits, doesn't initiate asking", "2": "Shy about asking, hints", "3": "Enjoys seeking/receiving actively", "4": "'Good pet!' feels amazing!", "5": "Constantly seeks validation/affection" } },
          { name: "playfulness", desc: { "1":"Reserved, not very playful", "2":"Occasionally playful when invited", "3":"Enjoys light games/teasing", "4":"Actively seeks play opportunities", "5":"Boundlessly playful energy" } },
          { name: "non-verbal expression", desc: { "1": "Prefers using words always", "2": "Some non-verbal cues slip out", "3": "Nuzzles/wags/purrs come naturally", "4": "Fluent in Pet sounds/body language!", "5": "Body language IS primary language" } }
      ]},
      { name: "Little 🍼", summary: "Embraces a childlike mindset, seeking care, play, and structure.", traits: [
          { name: "age regression comfort", desc: { "1": "Feels awkward/embarrassing", "2": "Dips in cautiously, self-conscious", "3": "Comfortable happy place sometimes", "4": "Natural and joyful state!", "5": "Littlespace is home, feels essential!" } },
          { name: "need for guidance", desc: { "1": "Prefers total independence", "2": "Accepts rules reluctantly", "3": "Guidance feels safe and welcome", "4": "Thrives with clear rules/structure", "5": "Complete reliance is comforting bliss!" } },
          { name: "innocence", desc: { "1":"Feels mature/worldly, dislikes acting naive", "2":"Retains adult perspective, can play innocent", "3":"Enjoys feeling sweet/carefree/protected", "4":"Naturally embodies innocence and wonder", "5":"Pure childlike spirit shines through" } }
      ]},
      { name: "Puppy 🐶", summary: "Exudes boundless energy, loyalty, and eagerness to please.", traits: [
           { name: "boundless energy", desc: { "1": "Low energy, prefers quiet rest", "2": "Bursts of energy, tires easily", "3": "Good energy, ready to play when asked", "4": "Zoomies! Full of infectious enthusiasm", "5": "Unstoppable puppy power, always ready!" } },
           { name: "trainability", desc: { "1": "Easily distracted, forgets commands", "2": "Learns with patience/repetition", "3": "Picks up commands well, enjoys learning", "4": "Loves learning, super focused during training", "5": "Learns instantly, eager for next command!" } },
           { name: "affection seeking", desc: { "1": "Indifferent to praise/pets", "2": "Likes occasional pats/kind words", "3": "Enjoys praise/cuddles actively", "4": "Actively seeks validation/belly rubs", "5": "Needs constant affection/reassurance" } }
      ]},
      { name: "Kitten 🐱", summary: "Combines curiosity, grace (or playful clumsiness), and affection.", traits: [
           { name: "curiosity", desc: { "1": "Prefers familiar, avoids new things", "2": "Cautiously curious, observes first", "3": "Enjoys exploring, playful bats at new items", "4": "Must investigate everything interesting", "5": "Fearlessly inquisitive, gets into everything" } },
           { name: "gracefulness", desc: { "1": "Very clumsy, trips over air", "2": "Sometimes sleek, sometimes knocks things over", "3": "Reasonable kitten grace, lands most jumps", "4": "Sleek, poised, moves with feline charm", "5": "Poetry in motion, elegant and precise" } },
           { name: "affection seeking", desc: { "1": "Aloof, prefers solitude", "2": "Accepts affection on own terms", "3": "Enjoys being petted/nuzzling when mood strikes", "4": "Seeks out laps/cuddles often", "5": "Craves constant attention/pets/purrs loudly" } }
      ]},
      { name: "Princess 👑", summary: "Adores being pampered and centre stage.", traits: [
          { name: "desire for pampering", desc: { "1": "Low maintenance, dislikes fuss/attention", "2": "Enjoys occasional treats/comforts", "3": "Being spoiled feels lovely and appreciated", "4": "Thrives on being doted on/center of attention", "5": "Expects luxurious treatment/constant admiration" } },
          { name: "delegation tendency", desc: { "1": "Prefers doing things self, feels capable", "2": "Asks for help occasionally if needed", "3": "Appreciates having things done for them", "4": "Readily delegates tasks, expects assistance", "5": "Naturally expects others to cater/serve" } },
          { name: "innocence", desc: { "1":"Worldly and knowing", "2":"Aware but enjoys playful innocence", "3":"Sweet and somewhat naive demeanor", "4":"Cultivated charming innocence", "5":"Genuinely naive, wide-eyed charm" } }
      ]},
      { name: "Rope Bunny 🪢", summary: "Loves the art and sensation of rope.", traits: [
           { name: "rope enthusiasm", desc: { "1": "Hesitant/dislikes ropes/restraint", "2": "Curious, needs safety/reassurance", "3": "Enjoys simple ties, feels secure", "4": "Loves aesthetics/sensation of rope", "5": "Adores complex ties/suspension deeply" } },
           { name: "patience during tying", desc: { "1": "Very fidgety/impatient, wants it done", "2": "Patient for short periods, gets restless", "3": "Reasonably patient, enjoys the process", "4": "Finds calm zen state during tying", "5": "Stillness is part of the surrender/meditation" } },
           { name: "sensuality", desc: { "1":"Focus only on restriction/immobility", "2":"Notices sensation somewhat, focus elsewhere", "3":"Appreciates the feel of rope on skin", "4":"Very aware of rope texture/pressure", "5":"Rope play is a highly sensual experience" } }
      ]},
      { name: "Masochist 💥", summary: "Finds pleasure/release through pain.", traits: [
            { name: "pain interpretation", desc: { "1": "Pain just hurts, avoid at all costs", "2": "Intensity is interesting, but not pleasure", "3": "Finds release/focus through managing pain", "4": "Pain often translates to pleasure/endorphins", "5": "Pain is a symphony/ecstasy/deeply desired" } },
            { name: "sensation seeking", desc: { "1": "Gentle touch is best, dislikes pain", "2": "Mild to moderate okay, avoids sharp pain", "3": "Enjoy exploring different types of sensations", "4": "Crave intense/sharp/deep sensations", "5": "Seek extreme sensations, push limits" } },
            { name: "endurance display", desc: { "1":"Low tolerance, stops quickly", "2":"Can take some, doesn't make a show", "3":"Showing toughness can be rewarding", "4":"Pride in taking pain well/long", "5":"Loves showing off endurance/resilience" } }
      ]},
      { name: "Prey 🏃‍♀️", summary: "Enjoys the thrill of the chase.", traits: [
          { name: "enjoyment of chase", desc: { "1": "Terrifying, avoid being pursued", "2": "Playful, short pursuit is okay/fun", "3": "Thrill of being chased is exciting!", "4": "Love the adrenaline rush of the hunt", "5": "The chase IS the ecstasy/main event" } },
          { name: "fear play comfort", desc: { "1": "No fear play, triggers genuine anxiety", "2": "Okay in small doses, needs lots of safety", "3": "Adds spice when safe/consensual", "4": "Thrilling when trust is absolute", "5": "Exhilarating dance with 'pretend' fear" } },
          { name: "rebellion", desc: { "1": "Compliant, would not 'escape'", "2": "Might hesitate slightly", "3": "Playfully tries to 'get away'", "4": "Uses wits to evade capture", "5": "Master of escape attempts (part of the fun)" } }
      ]},
       {
        name: "Toy 🎲", summary: "Loves being used and played with.", traits: [
          { name: "objectification comfort", desc: { "1": "Feels dehumanizing/uncomfortable", "2": "Okay sometimes, need cherishing/personhood", "3": "Fun being played with/used as object", "4": "Love being a prized possession/plaything", "5": "Exist to be used/enjoyed, finds fulfillment" } },
          { name: "responsiveness to control", desc: { "1": "Awkward/inflexible when moved", "2": "Stiff, needs clear physical direction", "3": "Respond well to being positioned/used", "4": "Mold me! Highly responsive to direction", "5": "Like clay, instantly adapts to user's will" } },
          { name: "adaptability", desc: { "1":"Rigid, prefers specific uses", "2":"Adapts slowly to new ways of being used", "3":"Fairly adaptable to different kinds of play", "4":"Easily adapts to different roles/uses", "5":"Instantly adapts to whatever is needed"} }
        ]
      },
      {
        name: "Doll 🎎", summary: "Enjoys being perfectly posed and admired.", traits: [
          { name: "aesthetic focus", desc: { "1": "Looks unimportant, focus on feeling", "2": "Being neat is nice, but effort", "3": "Crafting the doll look is part of the fun", "4": "Becoming the perfect Doll is the goal", "5": "Living Doll perfection is paramount" } },
          { name: "stillness / passivity", desc: { "1": "Need to move, fidgety", "2": "Still briefly, gets restless quickly", "3": "Being posed/still feels nice/relaxing", "4": "Love melting into absolute stillness", "5": "Can remain perfectly still/passive for long time" } },
          { name: "objectification comfort", desc: { "1":"Dislikes feeling like just an object", "2":"Tolerates briefly, needs interaction", "3":"Enjoys being admired as a beautiful object", "4":"Loves being displayed/posed like art", "5":"Finds deep fulfillment in being aesthetic object"} }
        ]
      },
      {
        name: "Bunny 🐰", summary: "Gentle, shy, and easily startled.", traits: [
          { name: "shyness / skittishness", desc: { "1": "Bold, confident, not easily startled", "2": "A little shy initially, warms up", "3": "Soft-spoken, easily startled by loud noises", "4": "Shyness/skittishness is part of the charm", "5": "Definition of skittish, very easily spooked" } },
          { name: "gentle affection need", desc: { "1": "Prefers intensity or less touch", "2":"Appreciates gentle touch but doesn't crave it", "3":"Soft pets/words are the best way to connect", "4":"Thrives on gentle touch and soft reassurance", "5":"Needs only the softest, gentlest touch" } },
          { name: "innocence", desc: { "1":"Feels worldly/experienced", "2":"Naive at times but generally aware", "3":"Sweet, trusting, and somewhat innocent", "4":"Naturally exudes an innocent, gentle vibe", "5":"Pure, wide-eyed, trusting innocence" } }
        ]
      },
      {
        name: "Servant 🧹", summary: "Finds joy in dutiful service.", traits: [
           { name: "task focus", desc: { "1": "Easily distracted, struggles with tasks", "2": "Does tasks, but focus wanders", "3": "Enjoys task lists, good focus", "4": "Highly focused on completing duties perfectly", "5": "Laser-focused on service, ignores distractions" } },
           { name: "anticipating needs", desc: { "1": "Barely notices others' needs", "2": "Spots obvious needs sometimes", "3": "Starting to anticipate simple needs", "4": "Often sees needs before asked", "5": "Finely tuned intuition for partner's needs" } },
           { name: "politeness", desc: { "1": "Blunt/informal speech", "2": "Casually polite, uses manners sometimes", "3": "Courteous and respectful always", "4": "Formal and respectful address/manner", "5": "Impeccable manners, perfect etiquette" } }
        ]
      },
      {
        name: "Playmate 🎉", summary: "Loves shared fun and adventure.", traits: [
           { name: "enthusiasm for games", desc: { "1": "Not playful, dislikes games", "2": "Will play along sometimes if asked", "3": "Game on! Enjoys playing", "4": "Super enthusiastic about games/play", "5": "Always ready and eager for fun!" } },
           { name: "good sport", desc: { "1": "Hates losing/gets easily frustrated", "2": "Tries, but can get sulky/competitive", "3": "Win/lose, it's all about the fun", "4": "Excellent sport, gracious in defeat/victory", "5": "Perfect playmate, makes it fun for everyone" } },
           { name: "playfulness", desc: { "1":"Very serious demeanor", "2":"Occasional silliness/joking", "3":"Generally enjoys fun and laughter", "4":"Very playful and lighthearted", "5":"Embodies playfulness and fun"} }
        ]
      },
      {
        name: "Babygirl 🌸", summary: "Craves nurturing, affection, guidance.", traits: [
          { name: "vulnerability expression", desc: { "1": "Always puts on brave face", "2": "Shows vulnerability rarely/hesitantly", "3": "Expressing needs/fears is okay when safe", "4": "Comfortable embracing softer side/needs", "5": "Vulnerability is natural and feels connecting" } },
          { name: "coquettishness", desc: { "1": "Flirting feels awkward/unnatural", "2": "A little charming/shyly flirtatious?", "3": "Enjoys being playful/flirtatious", "4": "Naturally charming and coquettish", "5": "Master of sweet, alluring charm" } },
          { name: "need for guidance", desc: { "1": "Very independent, dislikes rules", "2": "Accepts some guidance if gentle", "3": "Likes having rules/structure", "4": "Thrives with clear expectations/guidance", "5": "Relies completely on Caregiver for direction" } }
        ]
      },
      {
        name: "Captive ⛓️", summary: "Relishes the thrill of capture/restraint.", traits: [
          { name: "struggle performance", desc: { "1": "Comply immediately, no struggle", "2": "Token wiggle/hesitation", "3": "Playing the part of struggling is fun", "4": "Enjoys putting on a good show of resistance", "5": "Oscar-worthy struggle performance!" } },
          { name: "acceptance of fate", desc: { "1": "Genuine distress/dislike of situation", "2": "Uneasy acceptance, underlying anxiety", "3": "Alright, you win... (with inner thrill)", "4": "Secretly (or openly) loves being captured", "5": "This is exactly where I want to be" } },
           { name: "fear play comfort", desc: { "1":"No fear play", "2":"Okay in small doses", "3":"Adds spice when safe", "4":"Thrilling with trust", "5":"Exhilarating dance with 'pretend' fear"} }
        ]
      },
      {
        name: "Thrall 🛐", summary: "Bound by deep devotion/mental connection.", traits: [
           { name: "mental focus", desc: { "1": "Mind wanders easily, hard to connect", "2": "Tries to focus, distractions creep in", "3": "Can tune in well when directed", "4": "Deeply focused on partner's presence/will", "5": "Total mental immersion, blocks out world" } },
           { name: "suggestibility", desc: { "1": "Questions everything, resistant", "2": "Considers, but decides self mostly", "3": "Open to Dom's suggestions, likely follows", "4": "Highly suggestible within the dynamic", "5": "Putty in their hands (mentally)" } },
           { name: "devotion", desc: { "1":"Loyal but detached", "2":"Strong loyalty", "3":"Deeply committed", "4":"Unwavering devotion", "5":"Absolute, all-encompassing devotion" } }
        ]
      },
      {
        name: "Puppet 🎭", summary: "Loves being precisely directed.", traits: [
          { name: "responsiveness to direction", desc: { "1": "Clumsy/slow to respond", "2": "Follows, but needs repeats/clarification", "3": "Responds well to clear commands", "4": "Instant, fluid response to direction!", "5": "Their will is my immediate action" } },
          { name: "passivity in control", desc: { "1": "Wants to initiate own movement", "2": "Mostly passive, but fidgets/resists slightly", "3": "Waits patiently for next command", "4": "Deeply passive until explicitly directed", "5": "Perfectly passive, limp like a puppet" } }
        ]
      },
      {
        name: "Maid 🧼", summary: "Delights in order and polite service.", traits: [
          { name: "attention to detail", desc: { "1": "Close enough is good enough", "2": "Tries to be neat, misses small things", "3": "Cleanliness and order are important", "4": "Spotless! Has a very keen eye for detail", "5": "Perfection is the minimum standard" } },
          { name: "uniformity", desc: { "1": "Dislikes uniforms, feels restrictive", "2": "Okay wearing sometimes, not essential", "3": "Helps get into character, feels right", "4": "Loves wearing my uniform!", "5": "The uniform IS the role, essential" } },
          { name: "service", desc: { "1": "Avoids service", "2": "Serves reluctantly", "3": "Serves willingly as part of role", "4": "Enjoys serving well", "5": "Finds deep fulfillment in service" } }
        ]
      },
       {
        name: "Painslut 🔥", summary: "Craves intense sensation, pushes limits.", traits: [
          { name: "pain seeking", desc: { "1": "Avoids pain actively", "2": "Tolerates pain, doesn't ask for it", "3": "Craves the edge sometimes, asks hesitantly", "4": "Yes, please! Asks for pain openly", "5": "Feed me pain! Craves it intensely" } },
          { name: "endurance display", desc: { "1": "Gives up quickly, low threshold", "2": "Takes some, doesn't show off", "3": "Likes showing what I can handle!", "4": "Push me harder! Loves testing limits", "5": "Unbreakable (almost)! Pride in endurance" } },
          { name: "craving", desc: { "1":"Prefers calm, gentle sensations", "2":"Likes mild intensity, predictable", "3":"Enjoys strong sensations, seeks thrills", "4":"Actively seeks out intense experiences", "5":"Needs extreme intensity/sensations" } }
        ]
      },
      {
        name: "Bottom ⬇️", summary: "Open to receiving sensation/direction.", traits: [
          // Uses core receptiveness
          { name: "power exchange focus", desc: { "1": "Prefers equality, dislikes power imbalance", "2": "Okay with temporary imbalance sometimes", "3": "Enjoys giving power in scenes", "4": "Power exchange is central and exciting!", "5": "Giving power is deeply fulfilling/natural" } },
          { name: "painTolerance", desc: { "1":"Very sensitive, avoids pain", "2":"Low tolerance, prefers light sensation", "3":"Average tolerance, handles moderate", "4":"High tolerance, enjoys intensity", "5":"Extremely high tolerance, seeks extremes" } }
        ]
      }
    ]
  },

  // === DOMINANT ROLE ===
  dominant: {
    roleName: "Dominant",
    description: "A role focused on taking charge, guiding the dynamic, providing structure, and deriving satisfaction from leading or caring for a partner.",
    coreTraits: [
       { name: "authority", desc: { "1": "Prefer following/suggesting", "2": "Can steer, but feels hesitant/unsure", "3": "Comfortable taking the helm in scenes", "4": "Love calling the shots, confident leader", "5": "Natural presence commands attention/respect" } },
       { name: "care", desc: { "1": "Focus on action/task, less on emotion", "2": "Tries to be caring, misses cues sometimes", "3": "Checking in/aftercare is important", "4": "Partner's well-being is top priority", "5": "Guardian Angel mode, deeply protective/attuned" } },
       { name: "control", desc: { "1":"Hands-off, prefers sub takes initiative", "2":"Suggests direction, very flexible", "3":"Manages scene structure and flow", "4":"Enjoys controlling details/actions", "5":"Orchestrates everything precisely to vision" } },
       { name: "confidence", desc: { "1":"Hesitant, self-doubting, asks permission often", "2":"Cautiously sure, seeks validation frequently", "3":"Generally confident in decisions made", "4":"Decisive leader, trusts own judgment", "5":"Unshakeable self-assurance in role" } }
    ],
    styles: [
      { name: "Classic Dominant 👑", summary: "Focuses on general leadership, control, and setting the dynamic's tone.", traits: [ { name: "leadership", desc: { "1":"Reluctant leader, prefers partner leads", "2":"Guides when necessary, steps back otherwise", "3":"Confident direction, takes initiative", "4":"Inspiring leader, sets clear vision", "5":"Natural born leader, commands effortlessly" } } ] },
      { name: "Assertive 💪", summary: "Leads with clear communication and boundaries.", traits: [ { name: "direct communication", desc: { "1":"Hints subtly, avoids direct commands", "2":"States needs carefully, slightly indirect", "3":"Clear and direct communication style", "4":"Says what they mean, leaves no ambiguity", "5":"Crystal clear precision in language" } }, { name: "boundary setting", desc: { "1":"Avoids setting limits, uncomfortable", "2":"Sets limits hesitantly when pushed", "3":"Clear, respected boundaries are key", "4":"Rock solid limits, firmly maintained", "5":"Fortress of boundaries, proactively defined" } } ] },
      { name: "Nurturer 🤗", summary: "Focuses on emotional support, patience, and guiding growth.", traits: [ { name: "emotional support", desc: { "1":"Awkward with emotions, avoids them", "2":"Tries to be supportive, unsure how", "3":"Good listener, offers comfort/validation", "4":"Acts as partner's rock, provides deep security", "5":"Empathy expert, intuitively understands needs" } }, { name: "patience", desc: { "1":"Impatient, wants results now!", "2":"Tries to be patient, but easily frustrated", "3":"Practices patience, allows for mistakes", "4":"Calm and patient guide, encourages growth", "5":"Endless patience, serene demeanor" } }, { name: "empathy", desc: { "1":"Detached observer, focuses on actions", "2":"Notices obvious feelings, less attuned to subtle", "3":"Good sense of partner's emotional state", "4":"Strongly empathizes, feels partner's emotions", "5":"Deeply intuitive connection, almost psychic" } } ] },
      { name: "Strict 📏", summary: "Maintains order through clear rules and discipline.", traits: [ { name: "rule enforcement", desc: { "1":"Lets things slide, avoids confrontation", "2":"Inconsistent enforcement, depends on mood", "3":"Enforces rules consistently and fairly", "4":"Maintains high standards, expects adherence", "5":"Absolute adherence expected, zero tolerance" } }, { name: "discipline focus", desc: { "1":"Prefers positive reinforcement only", "2":"Hesitant about punishment, uses rarely", "3":"Views discipline as tool for growth/learning", "4":"Believes clear consequences are essential", "5":"Master of fair and effective discipline" } } ] },
      { name: "Master 🎓", summary: "Commands with high expectations and strong presence/ownership.", traits: [ { name: "expectation setting", desc: { "1":"Vague standards, hopes sub figures it out", "2":"Some expectations, could clarify more", "3":"Clear standards/protocols communicated", "4":"High standards, demands excellence", "5":"Impeccable standards, anticipates perfection" } }, { name: "presence", desc: { "1":"Blends in, quiet demeanor", "2":"Tries to project authority, feels forced", "3":"Authoritative presence felt naturally", "4":"Commands attention effortlessly upon entering", "5":"Radiating palpable power and control" } }, { name: "dominanceDepth", desc: { "1":"Light influence, prefers partnership", "2":"Prefers clearly defined but limited power", "3":"Enjoys clear authority within scenes/dynamic", "4":"Seeks significant influence/control (e.g., TPE-lite)", "5":"Craves total power/control (e.g., Full TPE)" } } ] },
      { name: "Mistress 👸", summary: "Leads with elegance, high standards, and captivating presence.", traits: [ { name: "expectation setting", desc: { "1":"Standards fuzzy, relies on charm", "2":"Sets rules sometimes, focuses on fun", "3":"Clear expectations for behavior/service", "4":"High standards expected and rewarded", "5":"Exquisite standards, demands the best" } }, { name: "presence", desc: { "1":"Quiet influence, relies on words", "2":"Working on projecting a commanding aura", "3":"Authority felt naturally, gracefully asserted", "4":"Effortless command, captivating presence", "5":"Regal presence, instantly recognized" } }, { name: "creativity", desc: { "1":"Prefers known routines, less imaginative", "2":"Tries small variations on existing scenes", "3":"Enjoys crafting unique scenarios/tasks", "4":"Highly imaginative, loves novel ideas", "5":"Master scene creator, visionary" } } ] },
      { name: "Daddy 👨‍🏫", summary: "Combines protective guidance with affectionate authority.", traits: [ { name: "protective guidance", desc: { "1":"Hands-off approach, believes in independence", "2":"Offers advice sometimes if asked", "3":"Looks out for partner's safety/well-being", "4":"Acts as a safe harbor, actively protects", "5":"Ultimate Daddy Bear, fiercely protective" } }, { name: "affectionate authority", desc: { "1":"Struggles to balance, often one or the other", "2":"Tries to balance, sometimes awkward", "3":"Firm but fair, with plenty of praise/hugs", "4":"Seamlessly blends warm hugs & stern rules", "5":"Perfect blend of loving and commanding" } }, { name: "possession", desc: { "1":"Not possessive, encourages freedom", "2":"Slightly protective, 'my little one'", "3":"Comfortable 'mine' feeling, caring ownership", "4":"Clearly states 'mine', feels pride", "5":"Strong sense of ownership/responsibility" } } ] },
      { name: "Mommy 👩‍🏫", summary: "Provides nurturing comfort and gentle, guiding discipline.", traits: [ { name: "nurturing comfort", desc: { "1":"Not naturally nurturing, practical", "2":"Can be comforting when needed", "3":"Instinctively offers hugs/soothing words", "4":"Acts as a safe haven, deeply comforting", "5":"Ultimate Mommy, endless warmth/comfort" } }, { name: "gentle discipline", desc: { "1":"Avoids correction, dislikes being stern", "2":"Prefers talking through issues calmly", "3":"Uses gentle correction/redirection", "4":"Firm but gentle hand, focuses on learning", "5":"Master of gentle, loving guidance" } }, { name: "care", desc: { "1":"Low care focus", "2":"Basic care", "3":"Attentive care", "4":"Deeply caring", "5":"Intensely nurturing care" } } ] },
      { name: "Owner 🔑", summary: "Takes pride in possession and care.", traits: [ { name: "possessiveness", desc: { "1":"Not possessive, values partner's autonomy", "2":"Slightly protective, feels connection", "3":"Comfortable 'mine' feeling, sense of responsibility", "4":"Clearly states 'mine', strong possessive pride", "5":"Absolute possession, deep ownership feeling" } }, { name: "behavioral training", desc: { "1":"Lets pet do their thing", "2":"Offers some direction, inconsistent", "3":"Uses rewards/correction to shape behavior", "4":"Skilled trainer, clear methods", "5":"Master behavioralist, shapes precisely" } }, { name: "control", desc: { "1":"Low control", "2":"Suggestive control", "3":"Situational control", "4":"Detailed control", "5":"Total control" } } ] },
      { name: "Rigger 🧵", summary: "Artist of restraint and sensation.", traits: [ { name: "rope technique", desc: { "1":"Rope=spaghetti, struggles with knots", "2":"Learning basics, can do simple ties", "3":"Comfortable with several functional/pretty ties", "4":"Skilled rope artist, complex patterns", "5":"Rope Master! Intricate suspension/kinbaku" } }, { name: "aesthetic vision", desc: { "1":"Looks don't matter, only function", "2":"Function first, neatness is bonus", "3":"Presentation matters, aims for beauty", "4":"Creating rope art is a primary goal!", "5":"Sculpting with rope, focus on visual masterpiece" } }, { name: "precision", desc: { "1":"Approximate ties, loose/uneven", "2":"Tries for neatness, sometimes slips", "3":"Careful placement, good tension", "4":"Very precise knotting and placement", "5":"Flawless execution, every strand perfect" } } ] },
      { name: "Sadist 😏", summary: "Finds joy in giving sensation with care.", traits: [ { name: "sensation control", desc: { "1":"Hesitant to inflict, fears hurting", "2":"Experimenting cautiously, checks in constantly", "3":"Getting the hang of reading reactions", "4":"Skilled conductor of sensations, plays limits", "5":"Master of senses, orchestrates experience" } }, { name: "psychological focus", desc: { "1":"Focus solely on physical action", "2":"Noticing reactions more, connecting cause/effect", "3":"Partner's reactions are fascinating/guide", "4":"Thrives on influencing partner's mental state", "5":"Partner's reaction is the masterpiece" } }, { name: "sadism", desc: { "1":"Avoids causing pain, purely gentle", "2":"Enjoys teasing edge, light sensation play", "3":"Likes controlled infliction, enjoys reactions", "4":"Finds pleasure in partner's reaction to pain", "5":"Deep enjoyment from consensual sadism" } } ] },
      { name: "Hunter 🏹", summary: "Thrives on the chase and capture.", traits: [ { name: "pursuit drive", desc: { "1":"Prefers prey comes willingly", "2":"Playful, short pursuit is okay/fun", "3":"Thrill of the chase is exciting!", "4":"Born predator! Loves the hunt", "5":"The hunt is everything! Primal drive" } }, { name: "instinct reliance", desc: { "1":"Needs a detailed plan, analytical", "2":"Prefers strategy, some gut feeling", "3":"Trusting instincts feels good/natural", "4":"Instincts are sharp, often leads the way", "5":"Operates on pure instinct during chase" } }, { name: "boldness", desc: { "1":"Cautious", "2":"Takes calculated risks", "3":"Fairly bold", "4":"Very bold/fearless", "5":"Extremely daring" } } ] },
      { name: "Trainer 🏋️‍♂️", summary: "Guides with patience and structure.", traits: [
           { name: "skill development focus", desc: { "1":"Sub should learn on their own", "2":"Offers some guidance if asked", "3":"Rewarding to help partner grow/learn", "4":"Dedicated trainer, loves teaching", "5":"Master coach, passionate about potential" } },
           { name: "structured methodology", desc: { "1":"Winging it, inconsistent approach", "2":"Some steps, but not formal/planned", "3":"Uses clear steps, provides feedback", "4":"Develops systematic training plans", "5":"Perfect curriculum, meticulous methods" } },
           { name: "patience", desc: { "1":"Impatient, wants results now", "2":"Tries, but gets frustrated with slow progress", "3":"Practices patience, understands learning curve", "4":"Calm and patient guide, very encouraging", "5":"Endless patience, serene teacher" } } // Ensuring full descriptions
        ] },
      { name: "Puppeteer 🕹️", summary: "Controls with creative precision.", traits: [ { name: "fine motor control", desc: { "1":"Broad strokes, less focus on detail", "2":"Working on precision, sometimes clumsy", "3":"Guiding partner's movements feels good", "4":"Master manipulator! Precise control", "5":"Absolute micro-control, like extensions of self" } }, { name: "objectification gaze", desc: { "1":"Needs human connection, dislikes objectifying", "2":"Can detach sometimes, feels a bit clinical", "3":"Puppeteer mindset is fun roleplay", "4":"Deep enjoyment in controlling an 'object'", "5":"Puppet exists solely for my direction" } }, { name: "creativity", desc: { "1":"Routine actions", "2":"Slight variations", "3":"Enjoys creating sequences", "4":"Very creative direction", "5":"Master choreographer" } } ] },
      { name: "Protector 🛡️", summary: "Leads with vigilance and strength.", traits: [ { name: "vigilance", desc: { "1":"Not very watchful, assumes safety", "2":"Tries to be aware, sometimes distracted", "3":"Actively keeping an eye out for risks", "4":"Ever watchful guardian, anticipates issues", "5":"Eagle eyes! Hyper-aware of surroundings" } }, { name: "defensive instinct", desc: { "1":"Avoids conflict, non-confrontational", "2":"Steps in if situation becomes serious", "3":"Don't mess with mine! Protective instinct", "4":"Fiercely protective, shields partner", "5":"Unbreakable shield! Instantly defends" } } ] },
      { name: "Disciplinarian ✋", summary: "Enforces rules with firm fairness.", traits: [ { name: "consequence delivery", desc: { "1":"Avoids punishment, feels guilty", "2":"Hesitant/inconsistent, waffles", "3":"Delivers agreed consequences fairly/firmly", "4":"Decisive and effective correction", "5":"Master of measured, impactful consequences" } }, { name: "detachment during discipline", desc: { "1":"Gets emotional/angry during discipline", "2":"Tries to stay calm, but feels affected", "3":"Remains objective and calm during correction", "4":"Cool under pressure, focused on lesson", "5":"Ice-cold precision, unaffected demeanor" } }, { name: "rule enforcement", desc: { "1":"Lax", "2":"Inconsistent", "3":"Consistent", "4":"Strict", "5":"Unyielding" } } ] },
      { name: "Caretaker 🧡", summary: "Nurtures and supports holistically.", traits: [ { name: "holistic well-being focus", desc: { "1":"Focuses elsewhere, assumes self-care", "2":"Checks basic safety/comfort", "3":"Attentive to overall physical/emotional state", "4":"Provides total care package, anticipates needs", "5":"Guardian of partner's complete well-being" } }, { name: "rule implementation for safety", desc: { "1":"Dislikes setting rules, feels controlling", "2":"Suggests healthy habits gently", "3":"Sets practical rules for safety/health", "4":"Enforces safety rules lovingly but firmly", "5":"Master of preventative care through structure" } }, { name: "patience", desc: { "1":"Impatient", "2":"Somewhat patient", "3":"Patient", "4":"Very patient", "5":"Extremely patient" } } ] },
      { name: "Sir 🎩", summary: "Leads with honor and respect.", traits: [ { name: "formal demeanor", desc: { "1":"Super casual, dislikes formality", "2":"Can be formal when needed, prefers casual", "3":"Maintains respectful, formal tone naturally", "4":"Calm, dignified, formal presence", "5":"Epitome of formal, respected authority" } }, { name: "service expectation", desc: { "1":"Not focused on service", "2":"Appreciates good service but doesn't demand", "3":"Expects proper service as part of role", "4":"High standards for service, clearly communicated", "5":"Impeccable service is mandatory/expected" } }, { name: "discipline", desc: { "1":"Avoids discipline", "2":"Rare/light discipline", "3":"Uses moderate discipline", "4":"Firm discipline", "5":"Strict discipline" } } ] },
      { name: "Goddess 🌟", summary: "Inspires worship and adoration.", traits: [ { name: "worship seeking", desc: { "1":"Feels embarrassing/uncomfortable", "2":"A little adoration is nice sometimes", "3":"Being adored feels wonderful/natural", "4":"Basks in glory, enjoys being worshipped", "5":"I AM divine! Expects/demands reverence" } }, { name: "effortless command", desc: { "1":"Takes effort to command respect", "2":"Working on projecting inevitable authority", "3":"Commands understood with minimal fuss", "4":"A look/word is enough to command", "5":"My will shapes reality, effortless command" } }, { name: "presence", desc: { "1":"Subtle", "2":"Noticeable", "3":"Strong", "4":"Commanding", "5":"Overpowering" } } ] },
      { name: "Commander ⚔️", summary: "Leads with strategic control.", traits: [ { name: "strategic direction", desc: { "1":"Winging it, reactive approach", "2":"General idea only, adapts on the fly", "3":"Sets clear objectives/orders for scenes", "4":"Master strategist! Plans complex scenarios", "5":"Flawless command/control, detailed plans" } }, { name: "decisiveness", desc: { "1":"Struggles with decisions, hesitant", "2":"Takes time, second-guesses often", "3":"Makes clear decisions, sticks to them", "4":"Swift and decisive action!", "5":"Instant, unwavering decisions" } }, { name: "leadership", desc: { "1":"Follower", "2":"Hesitant leader", "3":"Capable leader", "4":"Strong leader", "5":"Exceptional leader" } } ] }
    ]
  },

  // === SWITCH ROLE ===
  switch: {
    roleName: "Switch",
    description: "Enjoys fluently shifting between Dominant and Submissive roles, adapting to the dynamic and partner's energy.",
    coreTraits: [
      { name: "adaptability", desc: { "1":"Prefers one role strongly, rarely switches", "2":"Switches with conscious effort/negotiation", "3":"Comfortable switching roles as needed", "4":"Enjoys fluid shifts, follows energy", "5":"Seamlessly adaptable, instant role change" } },
      { name: "empathy", desc: { "1":"Focuses solely on current role's perspective", "2":"Tries to understand other role logically", "3":"Good sense of both sides' feelings/needs", "4":"Strongly empathizes with both Dom/sub perspective", "5":"Deeply connects with/understands both roles" } },
      { name: "communication", desc: { "1": "Hints subtly about shifts, expects partner to guess", "2":"States preference if asked directly", "3":"Clearly negotiates role shifts beforehand", "4":"Proactively discusses desire/need to switch", "5":"Intuitive & clear verbal/non-verbal cues for shifts" } },
       { name: "energy reading", desc: { "1":"Unaware of dynamic shifts/partner cues", "2":"Sometimes notices partner cues for shift", "3":"Reads obvious energy shifts in dynamic", "4":"Sensitive to partner's state/desire to switch", "5":"Deeply attuned to dynamic flow, anticipates shifts"} }
    ],
    styles: [
        { name: "Fluid Switch 🌊", summary: "Shifts roles easily and intuitively based on the moment.", traits: [ /* Uses core switch traits */]},
        { name: "Dominant-Leaning Switch 👑↔️", summary: "Primarily enjoys Dominant roles but explores Submission.", traits: [ /* Refers to Dom core + Switch core */ ]},
        { name: "Submissive-Leaning Switch 🙇‍♀️↔️", summary: "Primarily enjoys Submissive roles but explores Dominance.", traits: [ /* Refers to Sub core + Switch core */ ]},
        { name: "Situational Switch 🤔", summary: "Role depends heavily on partner, mood, or context.", traits: [ /* Uses core switch traits */ ]}
    ]
  }
};
