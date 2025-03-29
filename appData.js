
// === appData.js ===
// Consolidates all static data definitions for KinkCompass v2.8.6+

// --- Core BDSM Data (from data.js) ---
export const bdsmData = {
  submissive: {
    roleName: "Submissive",
    description: "A role focused on yielding control, trusting a partner's guidance, and finding fulfillment in service, obedience, or specific dynamics.",
    coreTraits: [
      { name: "obedience", explanation: "Reflects the desire and willingness to follow instructions, rules, or commands from a Dominant partner. Ranges from enjoying occasional guidance to finding deep fulfillment in total compliance.", desc: { "1": "Resists/ignores instructions", "2": "Follows simple/clear orders, maybe hesitant", "3": "Generally obedient, follows known rules", "4": "Enjoys following commands, aims to please", "5": "Thrives on obedience, finds joy in fulfilling orders" } },
      { name: "trust", explanation: "The foundational element allowing vulnerability and power exchange. It's the level of confidence and faith placed in a partner's intentions, competence, and care.", desc: { "1": "Very hesitant to trust", "2": "Trusts cautiously, needs reassurance", "3":"Generally trusting in safe contexts", "4":"Trusts partner deeply", "5":"Unconditional trust, heart open" } },
      { name: "receptiveness", explanation: "Openness to receiving input, direction, sensation, or emotional connection from a partner. High receptiveness indicates a willingness to absorb and be affected by the partner's actions.", desc: { "1":"Resistant to input/direction", "2":"Hesitant receiver, selective", "3":"Generally open to receiving", "4":"Welcomes direction/sensation", "5":"Fully receptive and absorbing" } },
      { name: "vulnerability", explanation: "The capacity and willingness to show emotional softness, openness, neediness, or perceived weakness within the dynamic. It's crucial for deep connection and often linked to trust.", desc: { "1":"Heavily guarded emotionally", "2":"Cautiously reveals feelings", "3":"Shares feelings when feeling safe", "4":"Comfortable expressing needs/softness", "5":"Embraces and shares vulnerability openly" } }
    ],
    styles: [
      { name: "Classic Submissive 🙇‍♀️", summary: "Focuses on general obedience, service, and presentation within a power dynamic.", traits: [
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Serving? Prefers self-focus", "2": "Helps if asked, not proactive", "3": "Happy to help, finds satisfaction", "4": "Service with a smile, anticipates", "5": "Love language is service!" } },
          { name: "presentation", explanation: "The importance placed on one's appearance, attire, and demeanor as part of fulfilling the submissive role and pleasing the Dominant.", desc: { "1": "Low effort appearance", "2": "Cleans up okay, minimal fuss", "3": "Likes looking presentable", "4": "Enjoys looking their best for role", "5": "Presentation is part of the art" } }
      ]},
      { name: "Brat 😈", summary: "Enjoys playful defiance, testing boundaries, and earning consequences.", traits: [
          { name: "playful defiance", explanation: "A tendency to playfully resist, tease, break rules intentionally, or challenge authority within the agreed dynamic, often to elicit a reaction or 'taming'.", desc: { "1": "Prefers following rules", "2": "Gentle poking/testing", "3": "Enjoys witty banter/rule-bending", "4": "Thrives on loopholes/challenges", "5": "Ruler of Sass, defiance is art" } },
          { name: "mischief", explanation: "A love for causing lighthearted trouble, playing pranks, or generally being playfully disruptive within the dynamic.", desc: { "1": "Prefers calm, avoids trouble", "2": "Tiny prank/tease slips out", "3":"Stirring things up is fun sometimes", "4":"Clever, playful troublemaker", "5":"Chaos Creator!" } }
      ]},
      { name: "Slave 🔗", summary: "Finds deep fulfillment in total devotion, service, and surrender.", traits: [
          { name: "devotion", explanation: "An intense loyalty, commitment, and dedication focused entirely on the Dominant partner, often seen as a core element of identity.", desc: { "1": "Loyal but keeps independence", "2": "Loyal, exploring deeper commitment", "3": "Heart belongs to Dom/Mistress", "4": "World revolves around Owner", "5": "Absolute devotion is core" } },
          { name: "surrender", explanation: "The act of willingly giving up control, autonomy, or decision-making power to the Dominant, ranging from scene-specific to a more constant state.", desc: { "1": "Yields physically, mentally resistant", "2": "Yields sometimes, finds it a challenge", "3": "Mostly freeing, enjoys trusting", "4": "Deep surrender feels right and fulfilling", "5": "Complete surrender = sanctuary" } },
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Avoids tasks when possible", "2": "Service feels like chore, does if must", "3": "Service is part of the role, performs well", "4": "Anticipates needs eagerly, finds joy", "5": "Utter fulfillment in perfect service" } }
      ]},
      { name: "Pet 🐾", summary: "Enjoys embodying an animal persona, seeking affection and guidance.", traits: [
          { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Waits, doesn't initiate asking", "2": "Shy about asking, hints", "3": "Enjoys seeking/receiving actively", "4": "'Good pet!' feels amazing!", "5": "Constantly seeks validation/affection" } },
          { name: "playfulness", explanation: "A strong inclination towards games, lighthearted interactions, silliness, and expressing joy through playful actions.", desc: { "1":"Reserved, not very playful", "2":"Occasionally playful when invited", "3":"Enjoys light games/teasing", "4":"Actively seeks play opportunities", "5":"Boundlessly playful energy" } },
          { name: "non-verbal expression", explanation: "Communicating needs, emotions, or responses primarily through body language, sounds (like purrs, whimpers, barks), or gestures rather than words.", desc: { "1": "Prefers using words always", "2": "Some non-verbal cues slip out", "3": "Nuzzles/wags/purrs come naturally", "4": "Fluent in Pet sounds/body language!", "5": "Body language IS primary language" } }
      ]},
      { name: "Little 🍼", summary: "Embraces a childlike mindset, seeking care, play, and structure.", traits: [
          { name: "age regression comfort", explanation: "The ease and enjoyment found in adopting a younger mental or emotional state ('littlespace'), often involving childlike behaviors, interests, and needs.", desc: { "1": "Feels awkward/embarrassing", "2": "Dips in cautiously, self-conscious", "3": "Comfortable happy place sometimes", "4": "Natural and joyful state!", "5": "Littlespace is home, feels essential!" } },
          { name: "need for guidance", explanation: "A desire for rules, structure, and direction provided by a Caregiver (Daddy/Mommy/etc.), finding comfort and safety in their guidance.", desc: { "1": "Prefers total independence", "2": "Accepts rules reluctantly", "3": "Guidance feels safe and welcome", "4": "Thrives with clear rules/structure", "5": "Complete reliance is comforting bliss!" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Feels mature/worldly, dislikes acting naive", "2":"Retains adult perspective, can play innocent", "3":"Enjoys feeling sweet/carefree/protected", "4":"Naturally embodies innocence and wonder", "5":"Pure childlike spirit shines through" } }
      ]},
      { name: "Puppy 🐶", summary: "Exudes boundless energy, loyalty, and eagerness to please.", traits: [
           { name: "boundless energy", explanation: "Having high levels of enthusiasm, physical energy, and a readiness for play or activity, characteristic of a young dog.", desc: { "1": "Low energy, prefers quiet rest", "2": "Bursts of energy, tires easily", "3": "Good energy, ready to play when asked", "4": "Zoomies! Full of infectious enthusiasm", "5": "Unstoppable puppy power, always ready!" } },
           { name: "trainability", explanation: "The willingness and ability to learn commands, tricks, or desired behaviors through instruction and positive reinforcement from a Handler/Owner.", desc: { "1": "Easily distracted, forgets commands", "2": "Learns with patience/repetition", "3": "Picks up commands well, enjoys learning", "4": "Loves learning, super focused during training", "5": "Learns instantly, eager for next command!" } },
           { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Indifferent to praise/pets", "2": "Likes occasional pats/kind words", "3": "Enjoys praise/cuddles actively", "4": "Actively seeks validation/belly rubs", "5": "Needs constant affection/reassurance" } }
      ]},
      { name: "Kitten 🐱", summary: "Combines curiosity, grace (or playful clumsiness), and affection.", traits: [
           { name: "curiosity", explanation: "An innate desire to investigate new things, explore surroundings, or playfully interact with objects and people, sometimes leading to mischief.", desc: { "1": "Prefers familiar, avoids new things", "2": "Cautiously curious, observes first", "3": "Enjoys exploring, playful bats at new items", "4": "Must investigate everything interesting", "5": "Fearlessly inquisitive, gets into everything" } },
           { name: "gracefulness", explanation: "Moving with a sense of poise, elegance, and agility, characteristic of felines (though sometimes contrasted with playful clumsiness).", desc: { "1": "Very clumsy, trips over air", "2": "Sometimes sleek, sometimes knocks things over", "3": "Reasonable kitten grace, lands most jumps", "4": "Sleek, poised, moves with feline charm", "5": "Poetry in motion, elegant and precise" } },
           { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Aloof, prefers solitude", "2": "Accepts affection on own terms", "3": "Enjoys being petted/nuzzling when mood strikes", "4": "Seeks out laps/cuddles often", "5": "Craves constant attention/pets/purrs loudly" } }
      ]},
      { name: "Princess 👑", summary: "Adores being pampered and centre stage.", traits: [
          { name: "desire for pampering", explanation: "A strong enjoyment of being spoiled, cared for, given gifts, and generally treated as special or royal.", desc: { "1": "Low maintenance, dislikes fuss/attention", "2": "Enjoys occasional treats/comforts", "3": "Being spoiled feels lovely and appreciated", "4": "Thrives on being doted on/center of attention", "5": "Expects luxurious treatment/constant admiration" } },
          { name: "delegation tendency", explanation: "A preference or expectation that others will perform tasks or cater to their needs, rather than doing things themselves.", desc: { "1": "Prefers doing things self, feels capable", "2": "Asks for help occasionally if needed", "3": "Appreciates having things done for them", "4": "Readily delegates tasks, expects assistance", "5": "Naturally expects others to cater/serve" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Worldly and knowing", "2":"Aware but enjoys playful innocence", "3":"Sweet and somewhat naive demeanor", "4":"Cultivated charming innocence", "5":"Genuinely naive, wide-eyed charm" } }
      ]},
      { name: "Rope Bunny 🪢", summary: "Loves the art and sensation of rope.", traits: [
           { name: "rope enthusiasm", explanation: "A specific interest and enjoyment in being tied with ropes, focusing on the aesthetics, sensations, trust, and/or vulnerability involved.", desc: { "1": "Hesitant/dislikes ropes/restraint", "2": "Curious, needs safety/reassurance", "3": "Enjoys simple ties, feels secure", "4": "Loves aesthetics/sensation of rope", "5": "Adores complex ties/suspension deeply" } },
           { name: "patience during tying", explanation: "The ability to remain still and calm for extended periods while being tied, often seen as part of the meditative or submissive process.", desc: { "1": "Very fidgety/impatient, wants it done", "2": "Patient for short periods, gets restless", "3": "Reasonably patient, enjoys the process", "4": "Finds calm zen state during tying", "5": "Stillness is part of the surrender/meditation" } },
           { name: "sensuality", explanation: "Heightened awareness and appreciation of physical sensations, textures, touch, and the body's responses.", desc: { "1":"Focus only on restriction/immobility", "2":"Notices sensation somewhat, focus elsewhere", "3":"Appreciates the feel of rope on skin", "4":"Very aware of rope texture/pressure", "5":"Rope play is a highly sensual experience" } }
      ]},
      { name: "Masochist 💥", summary: "Finds pleasure/release through pain.", traits: [
            { name: "pain interpretation", explanation: "How physical pain or discomfort is perceived and processed, ranging from purely negative to interesting, focusing, or even pleasurable.", desc: { "1": "Pain just hurts, avoid at all costs", "2": "Intensity is interesting, but not pleasure", "3": "Finds release/focus through managing pain", "4": "Pain often translates to pleasure/endorphins", "5": "Pain is a symphony/ecstasy/deeply desired" } },
            { name: "sensation seeking", explanation: "The drive to experience physical sensations, ranging from gentle touches to intense pain or pressure.", desc: { "1": "Gentle touch is best, dislikes pain", "2": "Mild to moderate okay, avoids sharp pain", "3": "Enjoy exploring different types of sensations", "4": "Crave intense/sharp/deep sensations", "5": "Seek extreme sensations, push limits" } },
            { name: "endurance display", explanation: "Finding satisfaction or validation in demonstrating the ability to withstand pain or intense sensation for extended periods.", desc: { "1":"Low tolerance, stops quickly", "2":"Can take some, doesn't make a show", "3":"Showing toughness can be rewarding", "4":"Pride in taking pain well/long", "5":"Loves showing off endurance/resilience" } }
      ]},
      { name: "Prey 🏃‍♀️", summary: "Enjoys the thrill of the chase.", traits: [
          { name: "enjoyment of chase", explanation: "Finding excitement, adrenaline, or pleasure in the dynamic of being pursued, hunted, or stalked within a consensual scene.", desc: { "1": "Terrifying, avoid being pursued", "2": "Playful, short pursuit is okay/fun", "3": "Thrill of being chased is exciting!", "4": "Love the adrenaline rush of the hunt", "5": "The chase IS the ecstasy/main event" } },
          { name: "fear play comfort", explanation: "The level of comfort and enjoyment derived from scenes involving elements of simulated fear, anxiety, or panic, always within a foundation of trust and safety.", desc: { "1": "No fear play, triggers genuine anxiety", "2": "Okay in small doses, needs lots of safety", "3": "Adds spice when safe/consensual", "4": "Thrilling when trust is absolute", "5": "Exhilarating dance with 'pretend' fear" } },
          { name: "rebellion", explanation: "A tendency towards defiance, argumentativeness, or resistance against rules and authority, often playful but sometimes more challenging.", desc: { "1": "Compliant, would not 'escape'", "2": "Might hesitate slightly", "3": "Playfully tries to 'get away'", "4": "Uses wits to evade capture", "5": "Master of escape attempts (part of the fun)" } }
      ]},
       {
        name: "Toy 🎲", summary: "Loves being used and played with.", traits: [
          { name: "objectification comfort", explanation: "The level of comfort or enjoyment derived from being treated as an object for a partner's pleasure or use, within negotiated boundaries.", desc: { "1": "Feels dehumanizing/uncomfortable", "2": "Okay sometimes, need cherishing/personhood", "3": "Fun being played with/used as object", "4": "Love being a prized possession/plaything", "5": "Exist to be used/enjoyed, finds fulfillment" } },
          { name: "responsiveness to control", explanation: "The ability and willingness to react quickly and accurately to a partner's commands or physical direction, like being easily posed or moved.", desc: { "1": "Awkward/inflexible when moved", "2": "Stiff, needs clear physical direction", "3": "Respond well to being positioned/used", "4": "Mold me! Highly responsive to direction", "5": "Like clay, instantly adapts to user's will" } },
          { name: "adaptability", explanation: "Flexibility in shifting roles, moods, expectations, or types of play based on the partner's desires or the scene's needs.", desc: { "1":"Rigid, prefers specific uses", "2":"Adapts slowly to new ways of being used", "3":"Fairly adaptable to different kinds of play", "4":"Easily adapts to different roles/uses", "5":"Instantly adapts to whatever is needed"} }
        ]
      },
      {
        name: "Doll 🎎", summary: "Enjoys being perfectly posed and admired.", traits: [
          { name: "aesthetic focus", explanation: "Placing high importance on appearance, clothing, makeup, and posture to achieve a specific, often perfect or artificial, 'doll-like' look.", desc: { "1": "Looks unimportant, focus on feeling", "2": "Being neat is nice, but effort", "3": "Crafting the doll look is part of the fun", "4": "Becoming the perfect Doll is the goal", "5": "Living Doll perfection is paramount" } },
          { name: "stillness / passivity", explanation: "The ability and enjoyment of remaining motionless, quiet, and unresponsive for extended periods, often while being posed or admired.", desc: { "1": "Need to move, fidgety", "2": "Still briefly, gets restless quickly", "3": "Being posed/still feels nice/relaxing", "4": "Love melting into absolute stillness", "5": "Can remain perfectly still/passive for long time" } },
          { name: "objectification comfort", explanation: "The level of comfort or enjoyment derived from being treated as an object for a partner's pleasure or use, within negotiated boundaries.", desc: { "1":"Dislikes feeling like just an object", "2":"Tolerates briefly, needs interaction", "3":"Enjoys being admired as a beautiful object", "4":"Loves being displayed/posed like art", "5":"Finds deep fulfillment in being aesthetic object"} }
        ]
      },
      {
        name: "Bunny 🐰", summary: "Gentle, shy, and easily startled.", traits: [
          { name: "shyness / skittishness", explanation: "A natural tendency towards being reserved, easily startled, cautious, or needing gentle approaches.", desc: { "1": "Bold, confident, not easily startled", "2": "A little shy initially, warms up", "3": "Soft-spoken, easily startled by loud noises", "4": "Shyness/skittishness is part of the charm", "5": "Definition of skittish, very easily spooked" } },
          { name: "gentle affection need", explanation: "A strong preference or need for soft, non-demanding physical touch, quiet words, and a calm environment to feel safe and connected.", desc: { "1": "Prefers intensity or less touch", "2":"Appreciates gentle touch but doesn't crave it", "3":"Soft pets/words are the best way to connect", "4":"Thrives on gentle touch and soft reassurance", "5":"Needs only the softest, gentlest touch" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Feels worldly/experienced", "2":"Naive at times but generally aware", "3":"Sweet, trusting, and somewhat innocent", "4":"Naturally exudes an innocent, gentle vibe", "5":"Pure, wide-eyed, trusting innocence" } }
        ]
      },
      {
        name: "Servant 🧹", summary: "Finds joy in dutiful service.", traits: [
           { name: "task focus", explanation: "The ability to concentrate on completing assigned duties or tasks meticulously and efficiently, without getting easily distracted.", desc: { "1": "Easily distracted, struggles with tasks", "2": "Does tasks, but focus wanders", "3": "Enjoys task lists, good focus", "4": "Highly focused on completing duties perfectly", "5": "Laser-focused on service, ignores distractions" } },
           { name: "anticipating needs", explanation: "The skill and desire to recognize or predict a partner's needs or wants before they are explicitly stated.", desc: { "1": "Barely notices others' needs", "2": "Spots obvious needs sometimes", "3": "Starting to anticipate simple needs", "4": "Often sees needs before asked", "5": "Finely tuned intuition for partner's needs" } },
           { name: "politeness", explanation: "A natural inclination towards courteous, respectful, and formal manners in speech and behavior, often tied to the service role.", desc: { "1": "Blunt/informal speech", "2": "Casually polite, uses manners sometimes", "3": "Courteous and respectful always", "4": "Formal and respectful address/manner", "5": "Impeccable manners, perfect etiquette" } }
        ]
      },
      {
        name: "Playmate 🎉", summary: "Loves shared fun and adventure.", traits: [
           { name: "enthusiasm for games", explanation: "A strong enjoyment and eagerness to participate in games, playful scenarios, or lighthearted activities.", desc: { "1": "Not playful, dislikes games", "2": "Will play along sometimes if asked", "3": "Game on! Enjoys playing", "4": "Super enthusiastic about games/play", "5": "Always ready and eager for fun!" } },
           { name: "good sport", explanation: "The ability to participate in games or challenges with a positive attitude, regardless of winning or losing, focusing on the shared fun.", desc: { "1": "Hates losing/gets easily frustrated", "2": "Tries, but can get sulky/competitive", "3": "Win/lose, it's all about the fun", "4": "Excellent sport, gracious in defeat/victory", "5": "Perfect playmate, makes it fun for everyone" } },
           { name: "playfulness", explanation: "A strong inclination towards games, lighthearted interactions, silliness, and expressing joy through playful actions.", desc: { "1":"Very serious demeanor", "2":"Occasional silliness/joking", "3":"Generally enjoys fun and laughter", "4":"Very playful and lighthearted", "5":"Embodies playfulness and fun"} }
        ]
      },
      {
        name: "Babygirl 🌸", summary: "Craves nurturing, affection, guidance.", traits: [
          { name: "vulnerability expression", explanation: "The capacity and willingness to show emotional softness, openness, neediness, or perceived weakness within the dynamic. It's crucial for deep connection and often linked to trust.", desc: { "1": "Always puts on brave face", "2": "Shows vulnerability rarely/hesitantly", "3": "Expressing needs/fears is okay when safe", "4": "Comfortable embracing softer side/needs", "5": "Vulnerability is natural and feels connecting" } },
          { name: "coquettishness", explanation: "A playful and charming flirtatiousness, often blending innocence with a hint of allure or teasing.", desc: { "1": "Flirting feels awkward/unnatural", "2": "A little charming/shyly flirtatious?", "3": "Enjoys being playful/flirtatious", "4": "Naturally charming and coquettish", "5": "Master of sweet, alluring charm" } },
          { name: "need for guidance", explanation: "A desire for rules, structure, and direction provided by a Caregiver (Daddy/Mommy/etc.), finding comfort and safety in their guidance.", desc: { "1": "Very independent, dislikes rules", "2": "Accepts some guidance if gentle", "3": "Likes having rules/structure", "4": "Thrives with clear expectations/guidance", "5": "Relies completely on Caregiver for direction" } }
        ]
      },
      {
        name: "Captive ⛓️", summary: "Relishes the thrill of capture/restraint.", traits: [
          { name: "struggle performance", explanation: "The enjoyment or skill in acting out resistance, panic, or defiance during a consensual capture or restraint scene for dramatic effect.", desc: { "1": "Comply immediately, no struggle", "2": "Token wiggle/hesitation", "3": "Playing the part of struggling is fun", "4": "Enjoys putting on a good show of resistance", "5": "Oscar-worthy struggle performance!" } },
          { name: "acceptance of fate", explanation: "The internal feeling experienced when captured or restrained, ranging from genuine distress to thrilling acceptance or enjoyment of the powerlessness.", desc: { "1": "Genuine distress/dislike of situation", "2": "Uneasy acceptance, underlying anxiety", "3": "Alright, you win... (with inner thrill)", "4": "Secretly (or openly) loves being captured", "5": "This is exactly where I want to be" } },
          { name: "fear play comfort", explanation: "The level of comfort and enjoyment derived from scenes involving elements of simulated fear, anxiety, or panic, always within a foundation of trust and safety.", desc: { "1":"No fear play", "2":"Okay in small doses", "3":"Adds spice when safe", "4":"Thrilling with trust", "5":"Exhilarating dance with 'pretend' fear"} }
        ]
      },
      {
        name: "Thrall 🛐", summary: "Bound by deep devotion/mental connection.", traits: [
           { name: "mental focus", explanation: "The ability to concentrate deeply on the Dominant partner's presence, will, or commands, often to the exclusion of other stimuli.", desc: { "1": "Mind wanders easily, hard to connect", "2": "Tries to focus, distractions creep in", "3": "Can tune in well when directed", "4": "Deeply focused on partner's presence/will", "5": "Total mental immersion, blocks out world" } },
           { name: "suggestibility", explanation: "The degree to which one is open to and likely to accept and act upon the suggestions or commands of the Dominant, particularly when in a focused or altered state.", desc: { "1": "Questions everything, resistant", "2": "Considers, but decides self mostly", "3": "Open to Dom's suggestions, likely follows", "4": "Highly suggestible within the dynamic", "5": "Putty in their hands (mentally)" } },
           { name: "devotion", explanation: "An intense loyalty, commitment, and dedication focused entirely on the Dominant partner, often seen as a core element of identity.", desc: { "1":"Loyal but detached", "2":"Strong loyalty", "3":"Deeply committed", "4":"Unwavering devotion", "5":"Absolute, all-encompassing devotion" } }
        ]
      },
      {
        name: "Puppet 🎭", summary: "Loves being precisely directed.", traits: [
          { name: "responsiveness to direction", explanation: "The ability and willingness to react quickly and accurately to a partner's commands or physical direction, like being easily posed or moved.", desc: { "1": "Clumsy/slow to respond", "2": "Follows, but needs repeats/clarification", "3": "Responds well to clear commands", "4": "Instant, fluid response to direction!", "5": "Their will is my immediate action" } },
          { name: "passivity in control", explanation: "The enjoyment or ability to remain physically inactive and without self-initiated movement until directed by the controlling partner.", desc: { "1": "Wants to initiate own movement", "2": "Mostly passive, but fidgets/resists slightly", "3": "Waits patiently for next command", "4": "Deeply passive until explicitly directed", "5": "Perfectly passive, limp like a puppet" } }
        ]
      },
      {
        name: "Maid 🧼", summary: "Delights in order and polite service.", traits: [
          { name: "attention to detail", explanation: "A keen focus on precision, neatness, and perfection in performing tasks, especially cleaning or organizing.", desc: { "1": "Close enough is good enough", "2": "Tries to be neat, misses small things", "3": "Cleanliness and order are important", "4": "Spotless! Has a very keen eye for detail", "5": "Perfection is the minimum standard" } },
          { name: "uniformity", explanation: "Finding comfort, identity, or role-immersion through wearing a specific uniform or prescribed attire.", desc: { "1": "Dislikes uniforms, feels restrictive", "2": "Okay wearing sometimes, not essential", "3": "Helps get into character, feels right", "4": "Loves wearing my uniform!", "5": "The uniform IS the role, essential" } },
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Avoids service", "2": "Serves reluctantly", "3": "Serves willingly as part of role", "4": "Enjoys serving well", "5": "Finds deep fulfillment in service" } }
        ]
      },
       {
        name: "Painslut 🔥", summary: "Craves intense sensation, pushes limits.", traits: [
          { name: "pain seeking", explanation: "Actively desiring and asking for painful or intense sensations, often finding pleasure, release, or validation through them.", desc: { "1": "Avoids pain actively", "2": "Tolerates pain, doesn't ask for it", "3": "Craves the edge sometimes, asks hesitantly", "4": "Yes, please! Asks for pain openly", "5": "Feed me pain! Craves it intensely" } },
          { name: "endurance display", explanation: "Finding satisfaction or validation in demonstrating the ability to withstand pain or intense sensation for extended periods.", desc: { "1": "Gives up quickly, low threshold", "2": "Takes some, doesn't show off", "3": "Likes showing what I can handle!", "4": "Push me harder! Loves testing limits", "5": "Unbreakable (almost)! Pride in endurance" } },
          { name: "craving", explanation: "An intense desire or need for specific types of stimulation, sensations, or experiences, often pushing boundaries.", desc: { "1":"Prefers calm, gentle sensations", "2":"Likes mild intensity, predictable", "3":"Enjoys strong sensations, seeks thrills", "4":"Actively seeks out intense experiences", "5":"Needs extreme intensity/sensations" } }
        ]
      },
      {
        name: "Bottom ⬇️", summary: "Open to receiving sensation/direction.", traits: [
          { name: "power exchange focus", explanation: "Centering the dynamic around the consensual exchange of power, finding fulfillment or excitement in the act of giving or receiving control.", desc: { "1": "Prefers equality, dislikes power imbalance", "2": "Okay with temporary imbalance sometimes", "3": "Enjoys giving power in scenes", "4": "Power exchange is central and exciting!", "5": "Giving power is deeply fulfilling/natural" } },
          { name: "painTolerance", explanation: "The physical and mental capacity to endure pain or discomfort, and the psychological interpretation of that sensation.", desc: { "1":"Very sensitive, avoids pain", "2":"Low tolerance, prefers light sensation", "3":"Average tolerance, handles moderate", "4":"High tolerance, enjoys intensity", "5":"Extremely high tolerance, seeks extremes" } }
        ]
      }
    ]
  },
  dominant: {
    roleName: "Dominant",
    description: "A role focused on taking charge, guiding the dynamic, providing structure, and deriving satisfaction from leading or caring for a partner.",
    coreTraits: [
       { name: "authority", explanation: "The natural inclination and ability to command respect, take charge, and make decisions within the dynamic.", desc: { "1": "Prefer following/suggesting", "2": "Can steer, but feels hesitant/unsure", "3": "Comfortable taking the helm in scenes", "4": "Love calling the shots, confident leader", "5": "Natural presence commands attention/respect" } },
       { name: "care", explanation: "The level of attention paid to the partner's physical and emotional well-being, safety, and comfort, including negotiation and aftercare.", desc: { "1": "Focus on action/task, less on emotion", "2": "Tries to be caring, misses cues sometimes", "3": "Checking in/aftercare is important", "4": "Partner's well-being is top priority", "5": "Guardian Angel mode, deeply protective/attuned" } },
       { name: "control", explanation: "The desire and ability to direct the scene, manage details, restrict the partner's actions, or influence the environment according to one's vision.", desc: { "1":"Hands-off, prefers sub takes initiative", "2":"Suggests direction, very flexible", "3":"Manages scene structure and flow", "4":"Enjoys controlling details/actions", "5":"Orchestrates everything precisely to vision" } },
       { name: "confidence", explanation: "Self-assuredness in one's decisions, actions, and ability to lead the dynamic effectively and safely.", desc: { "1":"Hesitant, self-doubting, asks permission often", "2":"Cautiously sure, seeks validation frequently", "3":"Generally confident in decisions made", "4":"Decisive leader, trusts own judgment", "5":"Unshakeable self-assurance in role" } }
    ],
    styles: [
      { name: "Classic Dominant 👑", summary: "Focuses on general leadership, control, and setting the dynamic's tone.", traits: [ { name: "leadership", explanation: "The ability to guide, direct, motivate, and take responsibility for the partner and the dynamic's direction.", desc: { "1":"Reluctant leader, prefers partner leads", "2":"Guides when necessary, steps back otherwise", "3":"Confident direction, takes initiative", "4":"Inspiring leader, sets clear vision", "5":"Natural born leader, commands effortlessly" } } ] },
      { name: "Assertive 💪", summary: "Leads with clear communication and boundaries.", traits: [ { name: "direct communication", explanation: "Expressing needs, commands, and boundaries clearly, directly, and unambiguously.", desc: { "1":"Hints subtly, avoids direct commands", "2":"States needs carefully, slightly indirect", "3":"Clear and direct communication style", "4":"Says what they mean, leaves no ambiguity", "5":"Crystal clear precision in language" } }, { name: "boundary setting", explanation: "Proactively defining and consistently enforcing limits and expectations for oneself and the partner.", desc: { "1":"Avoids setting limits, uncomfortable", "2":"Sets limits hesitantly when pushed", "3":"Clear, respected boundaries are key", "4":"Rock solid limits, firmly maintained", "5":"Fortress of boundaries, proactively defined" } } ] },
      { name: "Nurturer 🤗", summary: "Focuses on emotional support, patience, and guiding growth.", traits: [ { name: "emotional support", explanation: "Providing comfort, validation, reassurance, and a safe emotional space for the partner, especially during vulnerability.", desc: { "1":"Awkward with emotions, avoids them", "2":"Tries to be supportive, unsure how", "3":"Good listener, offers comfort/validation", "4":"Acts as partner's rock, provides deep security", "5":"Empathy expert, intuitively understands needs" } }, { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient, wants results now!", "2":"Tries to be patient, but easily frustrated", "3":"Practices patience, allows for mistakes", "4":"Calm and patient guide, encourages growth", "5":"Endless patience, serene demeanor" } }, { name: "empathy", explanation: "The ability to understand, share, and respond appropriately to the feelings and emotional state of the partner.", desc: { "1":"Detached observer, focuses on actions", "2":"Notices obvious feelings, less attuned to subtle", "3":"Good sense of partner's emotional state", "4":"Strongly empathizes, feels partner's emotions", "5":"Deeply intuitive connection, almost psychic" } } ] },
      { name: "Strict 📏", summary: "Maintains order through clear rules and discipline.", traits: [ { name: "rule enforcement", explanation: "Consistently upholding pre-negotiated rules and standards, applying consequences fairly when rules are broken.", desc: { "1":"Lets things slide, avoids confrontation", "2":"Inconsistent enforcement, depends on mood", "3":"Enforces rules consistently and fairly", "4":"Maintains high standards, expects adherence", "5":"Absolute adherence expected, zero tolerance" } }, { name: "discipline focus", explanation: "Utilizing corrective measures (punishment, tasks, etc.) as a primary tool for shaping behavior, teaching lessons, or maintaining order.", desc: { "1":"Prefers positive reinforcement only", "2":"Hesitant about punishment, uses rarely", "3":"Views discipline as tool for growth/learning", "4":"Believes clear consequences are essential", "5":"Master of fair and effective discipline" } } ] },
      { name: "Master 🎓", summary: "Commands with high expectations and strong presence/ownership.", traits: [ { name: "expectation setting", explanation: "Defining and communicating high standards for behavior, service, or performance from the partner.", desc: { "1":"Vague standards, hopes sub figures it out", "2":"Some expectations, could clarify more", "3":"Clear standards/protocols communicated", "4":"High standards, demands excellence", "5":"Impeccable standards, anticipates perfection" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Blends in, quiet demeanor", "2":"Tries to project authority, feels forced", "3":"Authoritative presence felt naturally", "4":"Commands attention effortlessly upon entering", "5":"Radiating palpable power and control" } }, { name: "dominanceDepth", explanation: "The desired level of control or influence over the partner's life, ranging from scene-specific to near-total power exchange (TPE).", desc: { "1":"Light influence, prefers partnership", "2":"Prefers clearly defined but limited power", "3":"Enjoys clear authority within scenes/dynamic", "4":"Seeks significant influence/control (e.g., TPE-lite)", "5":"Craves total power/control (e.g., Full TPE)" } } ] },
      { name: "Mistress 👸", summary: "Leads with elegance, high standards, and captivating presence.", traits: [ { name: "expectation setting", explanation: "Defining and communicating high standards for behavior, service, or performance from the partner.", desc: { "1":"Standards fuzzy, relies on charm", "2":"Sets rules sometimes, focuses on fun", "3":"Clear expectations for behavior/service", "4":"High standards expected and rewarded", "5":"Exquisite standards, demands the best" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Quiet influence, relies on words", "2":"Working on projecting a commanding aura", "3":"Authority felt naturally, gracefully asserted", "4":"Effortless command, captivating presence", "5":"Regal presence, instantly recognized" } }, { name: "creativity", explanation: "Enjoyment and skill in devising unique scenarios, tasks, challenges, or forms of play.", desc: { "1":"Prefers known routines, less imaginative", "2":"Tries small variations on existing scenes", "3":"Enjoys crafting unique scenarios/tasks", "4":"Highly imaginative, loves novel ideas", "5":"Master scene creator, visionary" } } ] },
      { name: "Daddy 👨‍🏫", summary: "Combines protective guidance with affectionate authority.", traits: [ { name: "protective guidance", explanation: "A strong instinct to shield, guide, and look out for the well-being and safety of the 'little' or partner.", desc: { "1":"Hands-off approach, believes in independence", "2":"Offers advice sometimes if asked", "3":"Looks out for partner's safety/well-being", "4":"Acts as a safe harbor, actively protects", "5":"Ultimate Daddy Bear, fiercely protective" } }, { name: "affectionate authority", explanation: "Blending firm commands, rules, and discipline with warmth, praise, physical affection, and emotional care.", desc: { "1":"Struggles to balance, often one or the other", "2":"Tries to balance, sometimes awkward", "3":"Firm but fair, with plenty of praise/hugs", "4":"Seamlessly blends warm hugs & stern rules", "5":"Perfect blend of loving and commanding" } }, { name: "possession", explanation: "A feeling of ownership, pride, and responsibility towards the partner, often expressed protectively.", desc: { "1":"Not possessive, encourages freedom", "2":"Slightly protective, 'my little one'", "3":"Comfortable 'mine' feeling, caring ownership", "4":"Clearly states 'mine', feels pride", "5":"Strong sense of ownership/responsibility" } } ] },
      { name: "Mommy 👩‍🏫", summary: "Provides nurturing comfort and gentle, guiding discipline.", traits: [ { name: "nurturing comfort", explanation: "Providing warmth, reassurance, soothing actions, and emotional safety, similar to a maternal figure.", desc: { "1":"Not naturally nurturing, practical", "2":"Can be comforting when needed", "3":"Instinctively offers hugs/soothing words", "4":"Acts as a safe haven, deeply comforting", "5":"Ultimate Mommy, endless warmth/comfort" } }, { name: "gentle discipline", explanation: "Correcting behavior or enforcing rules with kindness, patience, and a focus on teaching rather than harsh punishment.", desc: { "1":"Avoids correction, dislikes being stern", "2":"Prefers talking through issues calmly", "3":"Uses gentle correction/redirection", "4":"Firm but gentle hand, focuses on learning", "5":"Master of gentle, loving guidance" } }, { name: "care", explanation: "The level of attention paid to the partner's physical and emotional well-being, safety, and comfort, including negotiation and aftercare.", desc: { "1":"Low care focus", "2":"Basic care", "3":"Attentive care", "4":"Deeply caring", "5":"Intensely nurturing care" } } ] },
      { name: "Owner 🔑", summary: "Takes pride in possession and care.", traits: [ { name: "possessiveness", explanation: "A feeling of ownership, pride, and responsibility towards the partner, often expressed protectively.", desc: { "1":"Not possessive, values partner's autonomy", "2":"Slightly protective, feels connection", "3":"Comfortable 'mine' feeling, sense of responsibility", "4":"Clearly states 'mine', strong possessive pride", "5":"Absolute possession, deep ownership feeling" } }, { name: "behavioral training", explanation: "Using commands, rewards, and consequences to shape the partner's (often a 'pet') behavior according to desired standards.", desc: { "1":"Lets pet do their thing", "2":"Offers some direction, inconsistent", "3":"Uses rewards/correction to shape behavior", "4":"Skilled trainer, clear methods", "5":"Master behavioralist, shapes precisely" } }, { name: "control", explanation: "The desire and ability to direct the scene, manage details, restrict the partner's actions, or influence the environment according to one's vision.", desc: { "1":"Low control", "2":"Suggestive control", "3":"Situational control", "4":"Detailed control", "5":"Total control" } } ] },
      { name: "Rigger 🧵", summary: "Artist of restraint and sensation.", traits: [ { name: "rope technique", explanation: "Skill and knowledge in applying ropes for bondage, including knots, patterns, safety considerations, and potentially suspension.", desc: { "1":"Rope=spaghetti, struggles with knots", "2":"Learning basics, can do simple ties", "3":"Comfortable with several functional/pretty ties", "4":"Skilled rope artist, complex patterns", "5":"Rope Master! Intricate suspension/kinbaku" } }, { name: "aesthetic vision", explanation: "Focusing on the visual beauty, patterns, and artistic expression created by the ropes on the partner's body.", desc: { "1":"Looks don't matter, only function", "2":"Function first, neatness is bonus", "3":"Presentation matters, aims for beauty", "4":"Creating rope art is a primary goal!", "5":"Sculpting with rope, focus on visual masterpiece" } }, { name: "precision", explanation: "Executing actions, commands, or techniques (like rope placement or impact) with careful accuracy and attention to detail.", desc: { "1":"Approximate ties, loose/uneven", "2":"Tries for neatness, sometimes slips", "3":"Careful placement, good tension", "4":"Very precise knotting and placement", "5":"Flawless execution, every strand perfect" } } ] },
      { name: "Sadist 😏", summary: "Finds joy in giving sensation with care.", traits: [ { name: "sensation control", explanation: "Skillfully administering pain or intense sensations, carefully reading the partner's reactions and adjusting intensity for the desired effect.", desc: { "1":"Hesitant to inflict, fears hurting", "2":"Experimenting cautiously, checks in constantly", "3":"Getting the hang of reading reactions", "4":"Skilled conductor of sensations, plays limits", "5":"Master of senses, orchestrates experience" } }, { name: "psychological focus", explanation: "Deriving enjoyment from observing or influencing the partner's emotional or mental state through actions, words, or the dynamic itself.", desc: { "1":"Focus solely on physical action", "2":"Noticing reactions more, connecting cause/effect", "3":"Partner's reactions are fascinating/guide", "4":"Thrives on influencing partner's mental state", "5":"Partner's reaction is the masterpiece" } }, { name: "sadism", explanation: "Finding pleasure or excitement in consensually inflicting physical or psychological pain, discomfort, or distress on a partner.", desc: { "1":"Avoids causing pain, purely gentle", "2":"Enjoys teasing edge, light sensation play", "3":"Likes controlled infliction, enjoys reactions", "4":"Finds pleasure in partner's reaction to pain", "5":"Deep enjoyment from consensual sadism" } } ] },
      { name: "Hunter 🏹", summary: "Thrives on the chase and capture.", traits: [ { name: "pursuit drive", explanation: "A strong desire or instinct to chase, track down, or capture the partner, enjoying the process of the hunt.", desc: { "1":"Prefers prey comes willingly", "2":"Playful, short pursuit is okay/fun", "3":"Thrill of the chase is exciting!", "4":"Born predator! Loves the hunt", "5":"The hunt is everything! Primal drive" } }, { name: "instinct reliance", explanation: "Trusting and acting upon gut feelings, intuition, or primal urges during a scene, particularly in pursuit or control scenarios.", desc: { "1":"Needs a detailed plan, analytical", "2":"Prefers strategy, some gut feeling", "3":"Trusting instincts feels good/natural", "4":"Instincts are sharp, often leads the way", "5":"Operates on pure instinct during chase" } }, { name: "boldness", explanation: "Willingness to act decisively, take risks, or push boundaries fearlessly within the dynamic.", desc: { "1":"Cautious", "2":"Takes calculated risks", "3":"Fairly bold", "4":"Very bold/fearless", "5":"Extremely daring" } } ] },
      { name: "Trainer 🏋️‍♂️", summary: "Guides with patience and structure.", traits: [
           { name: "skill development focus", explanation: "Prioritizing the teaching, improvement, or perfection of specific skills, behaviors, or knowledge in the partner.", desc: { "1":"Sub should learn on their own", "2":"Offers some guidance if asked", "3":"Rewarding to help partner grow/learn", "4":"Dedicated trainer, loves teaching", "5":"Master coach, passionate about potential" } },
           { name: "structured methodology", explanation: "Using planned exercises, consistent feedback, and clear progression steps to facilitate learning and development.", desc: { "1":"Winging it, inconsistent approach", "2":"Some steps, but not formal/planned", "3":"Uses clear steps, provides feedback", "4":"Develops systematic training plans", "5":"Perfect curriculum, meticulous methods" } },
           { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient, wants results now", "2":"Tries, but gets frustrated with slow progress", "3":"Practices patience, understands learning curve", "4":"Calm and patient guide, very encouraging", "5":"Endless patience, serene teacher" } }
        ] },
      { name: "Puppeteer 🕹️", summary: "Controls with creative precision.", traits: [ { name: "fine motor control", explanation: "Ability to direct the partner's body or actions with high levels of detail and precision, like controlling individual limbs or expressions.", desc: { "1":"Broad strokes, less focus on detail", "2":"Working on precision, sometimes clumsy", "3":"Guiding partner's movements feels good", "4":"Master manipulator! Precise control", "5":"Absolute micro-control, like extensions of self" } }, { name: "objectification gaze", explanation: "Viewing and treating the partner primarily as an object to be controlled, posed, or manipulated according to one's aesthetic or functional desires.", desc: { "1":"Needs human connection, dislikes objectifying", "2":"Can detach sometimes, feels a bit clinical", "3":"Puppeteer mindset is fun roleplay", "4":"Deep enjoyment in controlling an 'object'", "5":"Puppet exists solely for my direction" } }, { name: "creativity", explanation: "Enjoyment and skill in devising unique scenarios, tasks, challenges, or forms of play.", desc: { "1":"Routine actions", "2":"Slight variations", "3":"Enjoys creating sequences", "4":"Very creative direction", "5":"Master choreographer" } } ] },
      { name: "Protector 🛡️", summary: "Leads with vigilance and strength.", traits: [ { name: "vigilance", explanation: "A state of heightened awareness and watchfulness, focused on anticipating potential risks or threats to the partner or the dynamic.", desc: { "1":"Not very watchful, assumes safety", "2":"Tries to be aware, sometimes distracted", "3":"Actively keeping an eye out for risks", "4":"Ever watchful guardian, anticipates issues", "5":"Eagle eyes! Hyper-aware of surroundings" } }, { name: "defensive instinct", explanation: "A strong, often immediate reaction to shield, defend, or safeguard the partner from perceived harm, criticism, or discomfort.", desc: { "1":"Avoids conflict, non-confrontational", "2":"Steps in if situation becomes serious", "3":"Don't mess with mine! Protective instinct", "4":"Fiercely protective, shields partner", "5":"Unbreakable shield! Instantly defends" } } ] },
      { name: "Disciplinarian ✋", summary: "Enforces rules with firm fairness.", traits: [ { name: "consequence delivery", explanation: "Administering pre-agreed consequences for rule-breaking calmly, fairly, and effectively, often focusing on the lesson learned.", desc: { "1":"Avoids punishment, feels guilty", "2":"Hesitant/inconsistent, waffles", "3":"Delivers agreed consequences fairly/firmly", "4":"Decisive and effective correction", "5":"Master of measured, impactful consequences" } }, { name: "detachment during discipline", explanation: "The ability to remain emotionally calm and objective while administering discipline, focusing on the purpose rather than personal feelings.", desc: { "1":"Gets emotional/angry during discipline", "2":"Tries to stay calm, but feels affected", "3":"Remains objective and calm during correction", "4":"Cool under pressure, focused on lesson", "5":"Ice-cold precision, unaffected demeanor" } }, { name: "rule enforcement", explanation: "Consistently upholding pre-negotiated rules and standards, applying consequences fairly when rules are broken.", desc: { "1":"Lax", "2":"Inconsistent", "3":"Consistent", "4":"Strict", "5":"Unyielding" } } ] },
      { name: "Caretaker 🧡", summary: "Nurtures and supports holistically.", traits: [ { name: "holistic well-being focus", explanation: "Attending to the partner's overall needs, including physical comfort, emotional security, health, and general happiness.", desc: { "1":"Focuses elsewhere, assumes self-care", "2":"Checks basic safety/comfort", "3":"Attentive to overall physical/emotional state", "4":"Provides total care package, anticipates needs", "5":"Guardian of partner's complete well-being" } }, { name: "rule implementation for safety", explanation: "Setting and enforcing boundaries or routines primarily aimed at ensuring the partner's health, safety, and well-being.", desc: { "1":"Dislikes setting rules, feels controlling", "2":"Suggests healthy habits gently", "3":"Sets practical rules for safety/health", "4":"Enforces safety rules lovingly but firmly", "5":"Master of preventative care through structure" } }, { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient", "2":"Somewhat patient", "3":"Patient", "4":"Very patient", "5":"Extremely patient" } } ] },
      { name: "Sir 🎩", summary: "Leads with honor and respect.", traits: [ { name: "formal demeanor", explanation: "Maintaining a polite, respectful, and often traditional or dignified manner of speech and behavior.", desc: { "1":"Super casual, dislikes formality", "2":"Can be formal when needed, prefers casual", "3":"Maintains respectful, formal tone naturally", "4":"Calm, dignified, formal presence", "5":"Epitome of formal, respected authority" } }, { name: "service expectation", explanation: "Expecting or requiring specific acts of service, deference, or adherence to protocol from the partner.", desc: { "1":"Not focused on service", "2":"Appreciates good service but doesn't demand", "3":"Expects proper service as part of role", "4":"High standards for service, clearly communicated", "5":"Impeccable service is mandatory/expected" } }, { name: "discipline", explanation: "Utilizing corrective measures (punishment, tasks, etc.) as a primary tool for shaping behavior, teaching lessons, or maintaining order.", desc: { "1":"Avoids discipline", "2":"Rare/light discipline", "3":"Uses moderate discipline", "4":"Firm discipline", "5":"Strict discipline" } } ] },
      { name: "Goddess 🌟", summary: "Inspires worship and adoration.", traits: [ { name: "worship seeking", explanation: "Desiring or requiring acts of adoration, reverence, and devotion from the partner, finding satisfaction in being elevated.", desc: { "1":"Feels embarrassing/uncomfortable", "2":"A little adoration is nice sometimes", "3":"Being adored feels wonderful/natural", "4":"Basks in glory, enjoys being worshipped", "5":"I AM divine! Expects/demands reverence" } }, { name: "effortless command", explanation: "The ability to influence or direct the partner with minimal overt effort, often through presence, subtle cues, or inherent authority.", desc: { "1":"Takes effort to command respect", "2":"Working on projecting inevitable authority", "3":"Commands understood with minimal fuss", "4":"A look/word is enough to command", "5":"My will shapes reality, effortless command" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Subtle", "2":"Noticeable", "3":"Strong", "4":"Commanding", "5":"Overpowering" } } ] },
      { name: "Commander ⚔️", summary: "Leads with strategic control.", traits: [ { name: "strategic direction", explanation: "Planning scenes or interactions with clear goals, steps, and potentially complex maneuvers; thinking ahead.", desc: { "1":"Winging it, reactive approach", "2":"General idea only, adapts on the fly", "3":"Sets clear objectives/orders for scenes", "4":"Master strategist! Plans complex scenarios", "5":"Flawless command/control, detailed plans" } }, { name: "decisiveness", explanation: "Making clear, firm, and timely decisions regarding the dynamic, scene direction, or rules.", desc: { "1":"Struggles with decisions, hesitant", "2":"Takes time, second-guesses often", "3":"Makes clear decisions, sticks to them", "4":"Swift and decisive action!", "5":"Instant, unwavering decisions" } }, { name: "leadership", explanation: "The ability to guide, direct, motivate, and take responsibility for the partner and the dynamic's direction.", desc: { "1":"Follower", "2":"Hesitant leader", "3":"Capable leader", "4":"Strong leader", "5":"Exceptional leader" } } ] }
    ]
  },
  switch: {
    roleName: "Switch",
    description: "Enjoys fluently shifting between Dominant and Submissive roles, adapting to the dynamic and partner's energy.",
    coreTraits: [
      { name: "adaptability", explanation: "Flexibility in shifting roles, moods, expectations, or types of play based on the partner's desires or the scene's needs.", desc: { "1":"Prefers one role strongly, rarely switches", "2":"Switches with conscious effort/negotiation", "3":"Comfortable switching roles as needed", "4":"Enjoys fluid shifts, follows energy", "5":"Seamlessly adaptable, instant role change" } },
      { name: "empathy", explanation: "The ability to understand, share, and respond appropriately to the feelings and emotional state of the partner.", desc: { "1":"Focuses solely on current role's perspective", "2":"Tries to understand other role logically", "3":"Good sense of both sides' feelings/needs", "4":"Strongly empathizes with both Dom/sub perspective", "5":"Deeply connects with/understands both roles" } },
      { name: "communication", explanation: "The ability to clearly express desires, boundaries, limits, and especially the need or desire to switch roles.", desc: { "1": "Hints subtly about shifts, expects partner to guess", "2":"States preference if asked directly", "3":"Clearly negotiates role shifts beforehand", "4":"Proactively discusses desire/need to switch", "5":"Intuitive & clear verbal/non-verbal cues for shifts" } },
       { name: "energy reading", explanation: "Sensitivity to the subtle shifts in mood, desire, and power within the dynamic, allowing for intuitive role adaptation.", desc: { "1":"Unaware of dynamic shifts/partner cues", "2":"Sometimes notices partner cues for shift", "3":"Reads obvious energy shifts in dynamic", "4":"Sensitive to partner's state/desire to switch", "5":"Deeply attuned to dynamic flow, anticipates shifts"} }
    ],
    styles: [
        { name: "Fluid Switch 🌊", summary: "Shifts roles easily and intuitively based on the moment.", traits: [ /* Uses core switch traits */]},
        { name: "Dominant-Leaning Switch 👑↔️", summary: "Primarily enjoys Dominant roles but explores Submission.", traits: [ /* Refers to Dom core + Switch core */ ]},
        { name: "Submissive-Leaning Switch 🙇‍♀️↔️", summary: "Primarily enjoys Submissive roles but explores Dominance.", traits: [ /* Refers to Sub core + Switch core */ ]},
        { name: "Situational Switch 🤔", summary: "Role depends heavily on partner, mood, or context.", traits: [ /* Uses core switch traits */ ]}
    ]
  }
};

// --- Style Finder Specific Data (from styleFinderData.js) ---

// Style categories
export const sfStyles = {
  submissive: [
    'Submissive', 'Brat', 'Slave', 'Switch', 'Pet', 'Little', 'Puppy', 'Kitten', 'Princess', 'Rope Bunny',
    'Masochist', 'Prey', 'Toy', 'Doll', 'Bunny', 'Servant', 'Playmate', 'Babygirl', 'Captive', 'Thrall',
    'Puppet', 'Maid', 'Painslut', 'Bottom'
  ],
  dominant: [
    'Dominant', 'Assertive', 'Nurturer', 'Strict', 'Master', 'Mistress', 'Daddy', 'Mommy', 'Owner', 'Rigger',
    'Sadist', 'Hunter', 'Trainer', 'Puppeteer', 'Protector', 'Disciplinarian', 'Caretaker', 'Sir', 'Goddess', 'Commander'
  ]
};

// Submissive traits (Randomization happens in app.js)
export const sfSubFinderTraits = [
  { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' },
  { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' },
  { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' },
  { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' },
  { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' },
  { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' },
  { name: 'devotion', desc: 'Does being deeply loyal and committed to someone bring you a sense of fulfillment?' },
  { name: 'innocence', desc: 'Do you enjoy feeling carefree, pure, or even a bit childlike in your interactions?' },
  { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' },
  { name: 'affection', desc: 'Do you crave physical closeness, like hugs or cuddles, to feel connected?' },
  { name: 'painTolerance', desc: 'Does a little sting or discomfort excite you, or do you prefer to avoid it?' },
  { name: 'submissionDepth', desc: 'How much do you enjoy letting go completely and giving someone full control?' },
  { name: 'dependence', desc: 'Do you feel comforted and secure when you can rely on someone else to guide you?' },
  { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural and right to you?' },
  { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' },
  { name: 'tidiness', desc: 'Do you take pride in keeping things neat, clean, and perfectly organized for someone?' },
  { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally to you?' },
  { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' },
  { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' }
];

// Submissive trait footnotes
export const sfSubTraitFootnotes = {
  obedience: "1: Rarely follows / 10: Always obeys",
  rebellion: "1: Very compliant / 10: Loves to resist",
  service: "1: Self-focused / 10: Service-driven",
  playfulness: "1: Serious / 10: Super playful",
  sensuality: "1: Not sensory / 10: Highly sensual",
  exploration: "1: Stays safe / 10: Seeks adventure",
  devotion: "1: Independent / 10: Deeply devoted",
  innocence: "1: Mature / 10: Very innocent",
  mischief: "1: Calm / 10: Mischievous",
  affection: "1: Distant / 10: Super affectionate",
  painTolerance: "1: Avoids pain / 10: Loves pain",
  submissionDepth: "1: Light submission / 10: Total surrender",
  dependence: "1: Self-reliant / 10: Loves guidance",
  vulnerability: "1: Guarded / 10: Fully open",
  adaptability: "1: Fixed role / 10: Very versatile",
  tidiness: "1: Messy and carefree / 10: Obsessed with order",
  politeness: "1: Casual and blunt / 10: Always courteous",
  craving: "1: Avoids intensity / 10: Seeks extreme thrills",
  receptiveness: "1: Closed off / 10: Fully open to input"
};

// Dominant traits (Randomization happens in app.js)
export const sfDomFinderTraits = [
  { name: 'authority', desc: 'Do you feel strong when you take charge?' },
  { name: 'confidence', desc: 'Are you sure of your decisions?' },
  { name: 'discipline', desc: 'Do you enjoy setting firm rules?' },
  { name: 'boldness', desc: 'Do you dive into challenges fearlessly?' },
  { name: 'care', desc: 'Do you love supporting and protecting others?' },
  { name: 'empathy', desc: 'Do you tune into others’ feelings easily?' },
  { name: 'control', desc: 'Do you thrive on directing every detail?' },
  { name: 'creativity', desc: 'Do you enjoy crafting unique scenes?' },
  { name: 'precision', desc: 'Are you careful with every step you take?' },
  { name: 'intensity', desc: 'Do you bring fierce energy to what you do?' },
  { name: 'sadism', desc: 'Does giving a little pain excite you?' },
  { name: 'leadership', desc: 'Do you naturally guide others forward?' },
  { name: 'possession', desc: 'Do you feel pride in owning what’s yours?' },
  { name: 'patience', desc: 'Are you calm while teaching or training?' },
  { name: 'dominanceDepth', desc: 'Do you crave total power in a scene?' }
];

// Dominant trait footnotes
export const sfDomTraitFootnotes = {
  authority: "1: Gentle / 10: Very commanding",
  confidence: "1: Hesitant / 10: Rock-solid",
  discipline: "1: Relaxed / 10: Strict",
  boldness: "1: Cautious / 10: Fearless",
  care: "1: Detached / 10: Deeply caring",
  empathy: "1: Distant / 10: Highly intuitive",
  control: "1: Hands-off / 10: Total control",
  creativity: "1: Routine / 10: Very creative",
  precision: "1: Casual / 10: Meticulous",
  intensity: "1: Soft / 10: Intense",
  sadism: "1: Avoids pain / 10: Enjoys giving pain",
  leadership: "1: Follower / 10: Natural leader",
  possession: "1: Shares / 10: Very possessive",
  patience: "1: Impatient / 10: Very patient",
  dominanceDepth: "1: Light control / 10: Full dominance"
};

// Slider descriptions for each trait
export const sfSliderDescriptions = {
  obedience: [ "You dodge orders like a breeze!", "Rules? You’re too free for that!", "You’ll follow if it’s fun!", "A little “yes” slips out sometimes!", "You’re cool with gentle guidance!", "Following feels kinda nice!", "You like pleasing when asked!", "Obeying’s your quiet joy!", "You love a sweet “please”!", "You glow when you say “yes”!" ],
  rebellion: [ "You’re too sweet to say no!", "A tiny “nah” sneaks out!", "You nudge rules with a smile!", "Teasing’s your little game!", "Half yes, half no—cute!", "You push back with charm!", "Defiance is your sparkle!", "You love a playful “no”!", "Rebel vibes all the way!", "You’re a cheeky star!" ],
  service: [ "Helping? You’re too chill!", "A quick favor’s enough!", "You help if they’re sweet!", "You pitch in when it’s easy!", "Serving’s okay sometimes!", "You like making them smile!", "Helping’s your happy place!", "You love a kind task!", "You’re a service sweetie!", "Caring’s your superpower!" ],
  playfulness: [ "Serious is your vibe!", "A giggle slips out!", "You play if it’s light!", "Half serious, half silly!", "You’re warming up to fun!", "Playtime’s your joy!", "You bounce with glee!", "Silly’s your middle name!", "You’re a playful whirlwind!", "Games are your world!" ],
  sensuality: [ "Touch? Not your thing!", "A soft pat’s okay!", "You like a little feel!", "Textures are kinda neat!", "You’re into soft vibes!", "Silk makes you happy!", "You love a sensory tickle!", "Touch is your bliss!", "You’re all about feels!", "Sensory queen!" ],
  exploration: [ "Safe is your spot!", "A tiny step out—shy!", "You peek at new stuff!", "You’ll try if it’s safe!", "Half cozy, half curious!", "New things excite you!", "You chase the unknown!", "Adventure’s your jam!", "You’re a bold explorer!", "Nothing stops you!" ],
  devotion: [ "Free and solo!", "A bit of heart shows!", "You care if they’re near!", "Half free, half true!", "You’re warming up!", "Devotion’s your glow!", "You’re all in soft!", "Loyalty’s your core!", "You’re a devotion gem!", "Total soulmate!" ],
  innocence: [ "Wise beyond your years!", "A bit of wonder peeks out!", "You’re half grown, half kid!", "Silly feels nice sometimes!", "You’re dipping into cute!", "Innocence is your vibe!", "You’re a sweet dreamer!", "Giggles are your song!", "You’re pure sunshine!", "Total kid at heart!" ],
  mischief: [ "Too good for tricks!", "A tiny prank slips!", "You stir if it’s safe!", "Half calm, half cheeky!", "You’re a sneaky spark!", "Mischief’s your game!", "You love a little chaos!", "Trouble’s your friend!", "You’re a mischief pro!", "Chaos queen!" ],
  affection: [ "Hugs? Not really!", "A quick cuddle’s fine!", "You like a soft touch!", "Half aloof, half warm!", "You’re into snuggles!", "Cuddles are your joy!", "You love closeness!", "Affection’s your glow!", "You’re a hug star!", "Total love bug!" ],
  painTolerance: [ "Ouch! Prefer gentle.", "A little sting is okay.", "Can handle moderate spice.", "Intensity feels interesting.", "Bring on the challenge!", "Thriving on the edge.", "Pushing my limits!", "Pain can be pleasure.", "Craving strong sensations!", "Almost limitless tolerance!" ],
  submissionDepth: [ "You’re free as a bird!", "A little give peeks out!", "You bend if it’s chill!", "Half you, half them!", "You’re easing in!", "Surrender’s kinda fun!", "You dive in soft!", "Control’s theirs—yay!", "You’re all theirs!", "Total trust star!" ],
  dependence: [ "Solo’s your jam!", "A lean slips in!", "You lean if they’re nice!", "Half free, half clingy!", "You’re okay with help!", "Relying feels good!", "You love their lead!", "They’re your rock!", "You’re a lean-in pro!", "Total trust buddy!" ],
  vulnerability: [ "Walls up high!", "A peek slips out!", "You share if safe!", "Half guarded, half open!", "You’re softening up!", "Open’s your vibe!", "You bare it soft!", "Heart’s wide open!", "You’re a trust gem!", "Total soul sharer!" ],
  adaptability: [ "One way—you’re set!", "A tiny switch is fine!", "You bend a little!", "Half fixed, half fluid!", "You’re okay with change!", "Switching’s easy!", "You roll with it!", "Flex is your strength!", "You flip like a pro!", "Total chameleon!" ],
  tidiness: [ "Chaos is your friend!", "A little mess is fine!", "You tidy if asked nicely!", "Order’s okay sometimes!", "You like things neat-ish!", "Cleanliness feels good!", "You love a tidy space!", "Order is your joy!", "Spotless is your vibe!", "Perfection in every corner!" ],
  politeness: [ "You’re blunt and bold!", "A bit gruff but sweet!", "Polite if it’s easy!", "You’re nice when needed!", "Courtesy’s your thing!", "You’re a polite gem!", "Manners shine bright!", "Respect is your core!", "You’re super courteous!", "Politeness queen!" ],
  craving: [ "Calm is your zone!", "A tiny thrill is enough!", "You dip into intensity!", "Half chill, half wild!", "You like a strong spark!", "Intensity calls you!", "You chase the edge!", "Thrills are your fuel!", "You crave the extreme!", "Limitless seeker!" ],
  receptiveness: [ "You’re your own guide!", "A bit open if safe!", "You listen if it’s clear!", "Half closed, half open!", "You’re warming up!", "Openness feels right!", "You take it all in!", "Guidance is welcome!", "You’re a receiver pro!", "Totally in tune!" ],
  authority: [ "Soft and shy!", "A little lead peeks!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Authority’s your vibe!", "You lead with ease!", "You’re a strong guide!", "Boss mode on!", "Total commander!" ],
  confidence: [ "Quiet and unsure!", "A bit of bold shows!", "You’re sure if it’s easy!", "Half shy, half steady!", "You’re growing bold!", "Confidence shines!", "You trust your gut!", "You’re rock solid!", "Bold and bright!", "Total powerhouse!" ],
  discipline: [ "Free and wild!", "A rule slips in!", "You set soft lines!", "Half loose, half tight!", "You’re liking order!", "Discipline’s your jam!", "You keep it firm!", "Rules are your strength!", "You’re super strict!", "Total control!" ],
  boldness: [ "Careful and calm!", "A risk peeks out!", "You leap if safe!", "Half shy, half daring!", "You’re getting brave!", "Boldness is you!", "You dive right in!", "Fearless vibes!", "You’re a bold star!", "Total daredevil!" ],
  care: [ "Cool and aloof!", "A care slips out!", "You help if asked!", "Half chill, half warm!", "You’re a soft guide!", "Nurturing’s your glow!", "You protect with love!", "Care is your core!", "You’re a warm star!", "Total nurturer!" ],
  empathy: [ "Distant and chill!", "A feel peeks out!", "You get it if clear!", "Half aloof, half tuned!", "You’re sensing more!", "Empathy’s your gift!", "You feel it all!", "You’re in sync!", "You’re a heart reader!", "Total intuitive!" ],
  control: [ "Hands-off feels right.", "Suggesting is fine.", "Guiding the flow.", "Like directing details.", "Enjoy orchestration.", "Precise scene control.", "Need full command.", "Every detail is mine.", "Total control feels best.", "Absolute micro-manager!" ],
  creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
  precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
  intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
  sadism: [ "Soft and sweet!", "A tease slips in!", "You push a little!", "Half gentle, half wild!", "You’re testing it!", "Pain’s your play!", "You love the sting!", "Thrill’s your game!", "You’re a spicy star!", "Total edge master!" ],
  leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
  possession: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ],
  patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
  dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ]
};

// Trait explanations for info popups
export const sfTraitExplanations = {
  obedience: "This explores how much you enjoy following instructions or rules. Do you feel calm and happy when told what to do, or prefer your own thing?",
  rebellion: "How much do you like to playfully resist or tease when given orders? Do you enjoy back-and-forth?",
  service: "How much joy do you get from helping others? Do tasks like fetching or assisting feel rewarding?",
  playfulness: "How much do you love silly, lighthearted fun? Are you serious, or do games/giggles light you up?",
  sensuality: "How much do physical sensations (soft touches, textures) excite you? Do you crave them?",
  exploration: "Checks your eagerness for new things. Comfy sticking to the known, or jump at experiments?",
  devotion: "How deeply loyal do you feel? Stick by them no matter what, or like independence?",
  innocence: "Enjoying a carefree, childlike vibe. Mature/serious, or love feeling sweet/playful?",
  mischief: "Enjoy stirring things up? Calm/good, or love a cheeky prank?",
  affection: "How much do you crave closeness/cuddles? Hugs your thing, or prefer space?",
  painTolerance: "How do you feel about discomfort/sting? Does it excite you, or do you shy away?",
  submissionDepth: "How much control are you happy giving up? Light guidance, or totally letting go?",
  dependence: "Feel safe relying on someone else? Independent, or love leaning on others?",
  vulnerability: "Comfy opening up emotionally? Guard up, or share your heart easily?",
  adaptability: "How easily do you switch roles/moods? Set one way, or flow with changes?",
  tidiness: "Enjoy keeping things neat for someone? Satisfaction in spotless, or happier a bit wild?",
  politeness: "Naturally lean toward courteous/respectful? Manners important, or prefer casual/direct?",
  craving: "How much do you seek intense/extreme experiences? Pulled to push boundaries, or prefer gentle/calm?",
  receptiveness: "How open are you to direction/sensations? Welcome guidance/input, or steer your own course?",
  authority: "How natural is taking charge? Love leading, or prefer softer approach?",
  confidence: "How sure are you in choices? Bold/steady, or hesitate sometimes?",
  discipline: "Enjoy setting rules? Like structure, or more relaxed?",
  boldness: "How fearless are you? Dive into challenges, or take it slow?",
  care: "Love supporting others? Nurturing type, or more hands-off?",
  empathy: "Tune into others’ feelings? Feel what they feel, or keep distance?",
  control: "Thrive on directing things? Love being in charge, or let things flow?",
  creativity: "Enjoy crafting unique ideas? Imaginative, or stick to basics?",
  precision: "Careful with details? Plan every step, or go with the vibe?",
  intensity: "Fierce energy you bring? Calm, or burn bright?",
  sadism: "Giving a little pain excite you? Fun for you, or not your thing?",
  leadership: "Guiding others naturally? Lead the way, or step back?",
  possession: "Feel pride in ‘owning’? Possessive, or easygoing?",
  patience: "Calm teaching/waiting? Chill, or push fast?",
  dominanceDepth: "How much power do you crave? Light control, or total command?"
};

// Style descriptions with short, long, and tips
export const sfStyleDescriptions = {
  Submissive: { short: "Thrives on guidance, loves letting others lead.", long: "Finds joy in yielding, savoring peace from trust/structure. Embraces vulnerability, finds strength in surrender.", tips: ["Communicate limits.", "Find respectful partner.", "Explore submission levels."] },
  Brat: { short: "Cheeky, loves pushing buttons for fun!", long: "Delights in playful resistance, turning rules into wit/charm games. Thrill of chase, joy of 'taming'.", tips: ["Keep it fun.", "Pair with chaser.", "Set defiance boundaries."] },
  Slave: { short: "Fulfilled by total devotion & service.", long: "Deeply committed, embraces high control/structure. Needs immense trust/communication.", tips: ["Negotiate limits.", "Ensure partner values devotion.", "Prioritize self-care."] },
  Switch: { short: "Flows between leading/following.", long: "Enjoys both worlds, adapts easily. Versatile, playful, thrives on exploration.", tips: ["Communicate mood.", "Experiment both roles.", "Find flexible partners."] },
  Pet: { short: "Loves being cared for like cherished companion.", long: "Revels in affection/play, often animal-like traits. Loyalty & fun.", tips: ["Choose persona.", "Seek caring Owner.", "Enjoy role freedom."] },
  Little: { short: "Embraces carefree, childlike spirit.", long: "Finds joy in innocence/dependence, seeks nurturing/protection.", tips: ["Set boundaries.", "Find caring partner.", "Explore playful side."] },
  Puppy: { short: "Playful, loyal, devoted pup.", long: "Boundless energy/affection, thrives on play/devotion.", tips: ["Embrace enthusiasm.", "Seek Trainer/Owner.", "Keep fun & safe."] },
  Kitten: { short: "Sensual, mischievous, curious cat.", long: "Blends sensuality/mischief, enjoys affection/play, tender/teasing.", tips: ["Play with charm.", "Find patient partner.", "Explore senses."] },
  Princess: { short: "Adores being pampered & adored.", long: "Revels in attention/care, regal yet dependent, innocence/sensuality.", tips: ["Set expectations.", "Seek doting partner.", "Enjoy spotlight."] },
  'Rope Bunny': { short: "Loves the art & feel of being bound.", long: "Excitement in sensations/trust of bondage, enjoys creativity/surrender.", tips: ["Learn safety.", "Pair with skilled Rigger.", "Explore ties."] },
  Masochist: { short: "Finds pleasure in the thrill of pain.", long: "Embraces discomfort as joy, often with submission. Trust/intensity.", tips: ["Set safewords.", "Find caring Sadist.", "Know limits."] },
  Prey: { short: "Enjoys the thrill of being hunted.", long: "Thrives on chase, excitement in vulnerability, tension of pursuit/capture.", tips: ["Clear consent.", "Pair with Hunter.", "Enjoy adrenaline."] },
  Toy: { short: "Loves being used & played with.", long: "Delights as object of pleasure, adaptable/submissive. Control/fun.", tips: ["Communicate prefs.", "Find creative partner.", "Embrace role."] },
  Doll: { short: "Enjoys being shaped & admired.", long: "Fulfilled by molding/display, vulnerability/desire to please/be perfect.", tips: ["Set boundaries.", "Seek Puppeteer.", "Enjoy transformation."] },
  Bunny: { short: "Playful & sweet like a rabbit.", long: "Innocence/energy, thrives on affection/light play.", tips: ["Keep fun.", "Find gentle partner.", "Hop into role."] },
  Servant: { short: "Finds joy in serving & pleasing.", long: "Dedicated to partner’s needs, satisfaction in obedience/tasks.", tips: ["Define duties.", "Seek Master/Mistress.", "Balance service/self-care."] },
  Playmate: { short: "Loves sharing fun & mischief.", long: "Camaraderie/adventure, enjoys games/exploration.", tips: ["Keep light.", "Find playful partner.", "Explore together."] },
  Babygirl: { short: "Craves nurturing & affection.", long: "Blends innocence/dependence, seeks caring dynamic.", tips: ["Set emotional boundaries.", "Find Daddy/Mommy.", "Embrace softness."] },
  Captive: { short: "Relishes thrill of being held.", long: "Enjoys intensity of surrender/restraint, excitement in control/trust.", tips: ["Negotiate scenes.", "Pair with Hunter.", "Enjoy intensity."] },
  Thrall: { short: "Bound by deep devotion.", long: "Complete loyalty/submission, profound trust/surrender.", tips: ["Build trust slowly.", "Seek Master.", "Honor commitment."] },
  Puppet: { short: "Loves being directed precisely.", long: "Thrives on responsiveness, moves to cues. Fluidity/trust.", tips: ["Stay attuned.", "Find flexible Puppeteer.", "Practice responses."] },
  Maid: { short: "Delights in tidy, polite service.", long: "Joy in order/courtesy, pristine environment. Service/refinement.", tips: ["Focus on details.", "Seek polish-appreciator.", "Balance duty/grace."] },
  Painslut: { short: "Craves intense pain, pushes limits.", long: "Seeks strong sensations, exhilaration in discomfort. Bold/boundary-testing.", tips: ["Set pain thresholds.", "Pair with respectful Sadist.", "Embrace aftercare."] },
  Bottom: { short: "Open to receiving sensation/direction.", long: "Excels at taking input, stamina for long scenes. Receptive/resilient.", tips: ["Communicate capacity.", "Find endurance-valuer.", "Pace yourself."] },
  Dominant: { short: "Shines in charge, guides confidently.", long: "Revels in control, leads with strength/care. Responsibility/trust.", tips: ["Listen to partner.", "Balance firm/kind.", "Learn safety."] },
  Assertive: { short: "Leads with bold, decisive energy.", long: "Takes charge confidently/intensely, authority shapes scene.", tips: ["Be direct.", "Pair with Submissive.", "Temper boldness."] },
  Nurturer: { short: "Guides with warmth & care.", long: "Blends control/empathy, guidance feels like warm embrace. Support/growth.", tips: ["Be patient/attentive.", "Pair with Little/Pet.", "Foster trust/safety."] },
  Strict: { short: "Enforces rules precisely.", long: "Maintains order/discipline, satisfaction in structure/obedience. Firm but fair.", tips: ["Set expectations.", "Pair with Slave/Servant.", "Reward compliance."] },
  Master: { short: "Leads with authority & responsibility.", long: "Profound role, guides with control/care/commitment. Structured/trusting.", tips: ["Build trust.", "Understand needs.", "Negotiate terms."] },
  Mistress: { short: "Commands with grace & power.", long: "Leads confidently/creatively, blends sensuality/control. Elegant/intense.", tips: ["Embrace power.", "Pair with Slave/Toy.", "Explore creative control."] },
  Daddy: { short: "Protects & nurtures with firm hand.", long: "Blends care/authority, guidance/structure. Loving/firm.", tips: ["Be consistent.", "Pair with Little/Babygirl.", "Balance discipline/affection."] },
  Mommy: { short: "Nurtures & guides with warmth.", long: "Blend of care/control, safe space to explore/grow.", tips: ["Be patient/loving.", "Pair with Little/Pet.", "Encourage growth."] },
  Owner: { short: "Pride in possessing & caring.", long: "Fulfillment in control/responsibility, pet play/TPE.", tips: ["Set rules.", "Pair with Pet/Slave.", "Provide structure/care."] },
  Rigger: { short: "Artist of restraint & sensation.", long: "Excels in bondage art, intricate ties. Creativity/control/trust.", tips: ["Learn safety.", "Pair with Rope Bunny.", "Explore styles."] },
  Sadist: { short: "Joy in giving pain with care.", long: "Enjoys inflicting discomfort (consensually). Intensity/connection.", tips: ["Negotiate limits.", "Pair with Masochist.", "Prioritize aftercare."] },
  Hunter: { short: "Thrives on chase & capture.", long: "Enjoys dynamic tension of pursuit, thrill of hunt/surrender.", tips: ["Establish consent.", "Pair with Prey.", "Enjoy the game."] },
  Trainer: { short: "Guides with patience & structure.", long: "Focuses on teaching/molding partner, behavior mod/skill dev.", tips: ["Be clear/consistent.", "Pair with Pet/Slave.", "Celebrate progress."] },
  Puppeteer: { short: "Controls with creative precision.", long: "Enjoys directing every move, partner as extension of will.", tips: ["Communicate clearly.", "Pair with Doll/Toy.", "Explore vision."] },
  Protector: { short: "Leads with strength & care.", long: "Blends authority/responsibility, ensures partner feels safe/valued.", tips: ["Be vigilant/kind.", "Pair with Little/Pet.", "Foster trust."] },
  Disciplinarian: { short: "Enforces rules firmly, fairly.", long: "Excels at boundaries/order, enjoys guiding playful/resistant partner.", tips: ["Clear rules.", "Patient/fair.", "Reward compliance."] },
  Caretaker: { short: "Nurtures & supports with love.", long: "Provides safe, loving space for exploration (age/pet play).", tips: ["Attentive/gentle.", "Pair with Little/Pet.", "Encourage exploration."] },
  Sir: { short: "Leads with honor & respect.", long: "Commands with authority/integrity, values tradition/structure.", tips: ["Uphold values.", "Pair with Submissive/Slave.", "Lead by example."] },
  Goddess: { short: "Worshipped & adored.", long: "Embodies power/grace, partner offers devotion/service.", tips: ["Embrace divinity.", "Pair with Thrall/Servant.", "Set high standards."] },
  Commander: { short: "Leads with strategic control.", long: "Takes charge precisely/vision, complex scenes/TPE.", tips: ["Plan carefully.", "Pair with Switch/Submissive.", "Execute confidently."] }
};

// Dynamic matches for each style
export const sfDynamicMatches = {
  Submissive: { dynamic: "Power Exchange", match: "Dominant", desc: "Classic duo.", longDesc: "Mutual respect, clear roles." },
  Brat: { dynamic: "Taming Play", match: "Disciplinarian", desc: "Sparks fly!", longDesc: "Resistance meets control." },
  Slave: { dynamic: "Master/Slave", match: "Master", desc: "Deep trust.", longDesc: "Devotion & structure." },
  Switch: { dynamic: "Versatile Play", match: "Switch", desc: "Fluid power.", longDesc: "Explore both sides." },
  Pet: { dynamic: "Pet Play", match: "Owner", desc: "Playful care.", longDesc: "Affection & playfulness." },
  Little: { dynamic: "Age Play", match: "Caretaker", desc: "Nurturing space.", longDesc: "Care & trust." },
  Puppy: { dynamic: "Pup Play", match: "Trainer", desc: "Lively bond.", longDesc: "Energy & discipline." },
  Kitten: { dynamic: "Kitten Play", match: "Owner", desc: "Sensual connection.", longDesc: "Charm & control." },
  Princess: { dynamic: "Pampering Play", match: "Daddy", desc: "Regal care.", longDesc: "Spoiling & structure." },
  'Rope Bunny': { dynamic: "Bondage Play", match: "Rigger", desc: "Artistic exchange.", longDesc: "Trust & creativity." },
  Masochist: { dynamic: "Sadomasochism", match: "Sadist", desc: "Thrilling exchange.", longDesc: "Pain & pleasure." },
  Prey: { dynamic: "Primal Play", match: "Hunter", desc: "Wild chase.", longDesc: "Pursuit & surrender." },
  Toy: { dynamic: "Objectification Play", match: "Owner", desc: "Playful use.", longDesc: "Control & adaptability." },
  Doll: { dynamic: "Transformation Play", match: "Puppeteer", desc: "Creative shaping.", longDesc: "Molding & trust." },
  Bunny: { dynamic: "Bunny Play", match: "Caretaker", desc: "Sweet bond.", longDesc: "Innocence & care." },
  Servant: { dynamic: "Service Play", match: "Master", desc: "Structured duty.", longDesc: "Guidance & harmony." },
  Playmate: { dynamic: "Adventure Play", match: "Playmate", desc: "Shared journey.", longDesc: "Fun & exploration." },
  Babygirl: { dynamic: "Age Play", match: "Daddy", desc: "Nurturing space.", longDesc: "Love & protection." },
  Captive: { dynamic: "Captivity Play", match: "Hunter", desc: "Intense thrill.", longDesc: "Control & surrender." },
  Thrall: { dynamic: "Devotion Play", match: "Goddess", desc: "Deep worship.", longDesc: "Loyalty & power." },
  Puppet: { dynamic: "Puppet Play", match: "Puppeteer", desc: "Controlled dance.", longDesc: "Adaptability & direction." },
  Maid: { dynamic: "Service Play", match: "Mistress", desc: "Refined duty.", longDesc: "Tidiness & elegance." },
  Painslut: { dynamic: "Sadomasochism", match: "Sadist", desc: "Fiery intensity.", longDesc: "Craving & skill." },
  Bottom: { dynamic: "Sensation Play", match: "Dominant", desc: "Steady flow.", longDesc: "Receptiveness & authority." },
  Dominant: { dynamic: "Power Exchange", match: "Submissive", desc: "Balanced duo.", longDesc: "Guidance & trust." },
  Assertive: { dynamic: "Assertive Control", match: "Submissive", desc: "Bold exchange.", longDesc: "Authority shapes bond." },
  Nurturer: { dynamic: "Nurturing Care", match: "Little", desc: "Warm bond.", longDesc: "Care fosters growth." },
  Strict: { dynamic: "Discipline Play", match: "Slave", desc: "Firm bond.", longDesc: "Order & obedience." },
  Master: { dynamic: "Master/Slave", match: "Slave", desc: "Deep relationship.", longDesc: "Authority & devotion." },
  Mistress: { dynamic: "Mistress/Servant", match: "Servant", desc: "Elegant bond.", longDesc: "Grace & service." },
  Daddy: { dynamic: "Daddy/Little", match: "Little", desc: "Nurturing bond.", longDesc: "Care & play." },
  Mommy: { dynamic: "Mommy/Little", match: "Little", desc: "Loving bond.", longDesc: "Warmth & growth." },
  Owner: { dynamic: "Owner/Pet", match: "Pet", desc: "Playful bond.", longDesc: "Control & care." },
  Rigger: { dynamic: "Bondage Play", match: "Rope Bunny", desc: "Artistic exchange.", longDesc: "Creativity & trust." },
  Sadist: { dynamic: "Sadomasochism", match: "Masochist", desc: "Thrilling exchange.", longDesc: "Pain & pleasure safely." },
  Hunter: { dynamic: "Primal Play", match: "Prey", desc: "Wild chase.", longDesc: "Pursuit fuels bond." },
  Trainer: { dynamic: "Training Play", match: "Puppy", desc: "Structured bond.", longDesc: "Discipline & growth." },
  Puppeteer: { dynamic: "Control Play", match: "Doll", desc: "Creative shaping.", longDesc: "Precision directs." },
  Protector: { dynamic: "Protection Play", match: "Little", desc: "Strong bond.", longDesc: "Care & safety." },
  Disciplinarian: { dynamic: "Discipline Play", match: "Brat", desc: "Lively challenge.", longDesc: "Control & defiance." },
  Caretaker: { dynamic: "Caretaking Play", match: "Little", desc: "Nurturing bond.", longDesc: "Love & exploration." },
  Sir: { dynamic: "Sir/Submissive", match: "Submissive", desc: "Respectful bond.", longDesc: "Honor & obedience." },
  Goddess: { dynamic: "Worship Play", match: "Thrall", desc: "Divine bond.", longDesc: "Adoration & service." },
  Commander: { dynamic: "Command Play", match: "Switch", desc: "Strategic bond.", longDesc: "Control & flexibility." }
};

// Trait weights for scoring
export const sfStyleKeyTraits = {
    'Submissive': ['obedience', 'submissionDepth', 'vulnerability'],
    'Brat': ['rebellion', 'mischief', 'playfulness'],
    'Slave': ['service', 'devotion', 'submissionDepth'],
    'Switch': ['adaptability', 'exploration', 'playfulness'], // Note: Switch scoring might need refinement
    'Pet': ['affection', 'playfulness', 'devotion'],
    'Little': ['innocence', 'dependence', 'affection'],
    'Puppy': ['playfulness', 'devotion', 'affection'],
    'Kitten': ['sensuality', 'mischief', 'affection'],
    'Princess': ['sensuality', 'innocence', 'dependence'],
    'Rope Bunny': ['sensuality', 'exploration', 'submissionDepth'],
    'Masochist': ['painTolerance', 'submissionDepth', 'vulnerability'],
    'Prey': ['exploration', 'vulnerability', 'rebellion'],
    'Toy': ['submissionDepth', 'adaptability', 'service'],
    'Doll': ['vulnerability', 'dependence', 'sensuality'],
    'Bunny': ['playfulness', 'innocence', 'affection'],
    'Servant': ['service', 'obedience', 'devotion'],
    'Playmate': ['playfulness', 'mischief', 'exploration'],
    'Babygirl': ['dependence', 'innocence', 'affection'],
    'Captive': ['submissionDepth', 'vulnerability', 'exploration'],
    'Thrall': ['devotion', 'submissionDepth', 'dependence'],
    'Puppet': ['receptiveness', 'adaptability'],
    'Maid': ['tidiness', 'politeness'],
    'Painslut': ['painTolerance', 'craving'],
    'Bottom': ['receptiveness', 'painTolerance'],
    'Dominant': ['authority', 'confidence', 'leadership'],
    'Assertive': ['boldness', 'intensity', 'authority'],
    'Nurturer': ['care', 'empathy', 'patience'],
    'Strict': ['discipline', 'control', 'precision'],
    'Master': ['authority', 'possession', 'dominanceDepth'],
    'Mistress': ['confidence', 'creativity', 'dominanceDepth'],
    'Daddy': ['care', 'possession', 'empathy'],
    'Mommy': ['care', 'patience', 'empathy'],
    'Owner': ['possession', 'control', 'dominanceDepth'],
    'Rigger': ['creativity', 'precision', 'control'],
    'Sadist': ['sadism', 'intensity', 'control'],
    'Hunter': ['boldness', 'leadership', 'intensity'],
    'Trainer': ['patience', 'discipline', 'leadership'],
    'Puppeteer': ['control', 'creativity', 'precision'],
    'Protector': ['care', 'authority', 'possession'],
    'Disciplinarian': ['discipline', 'authority', 'precision'],
    'Caretaker': ['care', 'empathy', 'patience'],
    'Sir': ['authority', 'confidence', 'leadership'],
    'Goddess': ['confidence', 'intensity', 'dominanceDepth'],
    'Commander': ['authority', 'intensity', 'dominanceDepth']
};

// --- Glossary Data (from glossary.js) ---
export const glossaryTerms = {
    "SSC": { term: "SSC (Safe, Sane, Consensual)", definition: "A foundational consent model emphasizing that activities should be physically safe, engaged in by participants of sound mind, and freely and enthusiastically agreed upon by everyone involved. Often considered a baseline, though limitations are recognized.", related: ["Consent", "RACK", "PRICK"] },
    "RACK": { term: "RACK (Risk-Aware Consensual Kink)", definition: "An alternative consent model acknowledging that not all kink activities are inherently 'safe' (e.g., knife play, breath play). It emphasizes understanding, discussing, and accepting the potential risks involved, alongside explicit consent.", related: ["Consent", "SSC", "PRICK", "Risk Profile", "Negotiation"] },
    "PRICK": { term: "PRICK (Personal Responsibility, Informed Consensual Kink)", definition: "Another consent model emphasizing individual responsibility for one's boundaries and well-being, ensuring consent is fully informed (understanding risks and activities), and that activities are consensual.", related: ["Consent", "SSC", "RACK"] },
    "Consent": { term: "Consent", definition: "Freely given, Reversible, Informed, Enthusiastic, and Specific (FRIES) agreement to participate in an activity. Consent must be ongoing and can be withdrawn at any time. Absence of 'no' does not mean 'yes'.", related: ["SSC", "RACK", "PRICK", "Negotiation", "Safewords", "Boundaries"] },
    "Negotiation": { term: "Negotiation", definition: "The proactive process of discussing desires, boundaries, limits (hard and soft), safewords, potential risks, intentions, and aftercare needs *before* engaging in kink activities. Essential for safe, ethical, and satisfying play.", related: ["Consent", "Limits", "Safewords", "Aftercare", "Boundaries"] },
    "Limits": { term: "Limits (Hard/Soft)", definition: "Boundaries set during negotiation. Hard limits are things one is *never* willing to do or experience (non-negotiable 'no's). Soft limits are things one might be hesitant about, willing to try under specific conditions, or want to approach cautiously.", related: ["Negotiation", "Consent", "Boundaries"] },
    "Boundaries": { term: "Boundaries", definition: "Personal lines defining what one is comfortable or uncomfortable with, physically, emotionally, or mentally. Can encompass limits but also includes communication styles, topics of conversation, etc. Respecting boundaries is crucial.", related: ["Limits", "Negotiation", "Consent"] },
    "Safewords": { term: "Safewords / Signals", definition: "Words, gestures, or signals agreed upon beforehand to communicate distress or the need to slow down, adjust, or stop during a scene, especially when normal speech might be difficult or part of the roleplay is to seem resistant. Common systems include Green/Yellow/Red or specific non-triggering words.", related: ["Consent", "Negotiation"] },
    "Aftercare": { term: "Aftercare", definition: "The process of providing emotional and/or physical support after a kink scene or intense interaction. Needs vary widely and should be negotiated. Can include cuddling, reassurance, hydration, snacks, gentle conversation, quiet time, checking for marks, etc. Applies to all roles.", related: ["Negotiation", "Care", "Sub Drop", "Dom Drop"] },
    "Subspace / Domspace / Topspace / Bottomspace": { term: "Subspace / Domspace / etc.", definition: "Altered states of consciousness sometimes experienced during kink play, often triggered by endorphins, adrenaline, focus, or psychological immersion. Can manifest as feelings of floatiness, euphoria, intense focus, detachment, heightened senses, etc. Varies greatly, not guaranteed, and can be positive or challenging.", related: ["Sub Drop", "Dom Drop", "Pain Interpretation"] },
    "Sub Drop / Dom Drop": { term: "Sub Drop / Dom Drop", definition: "An emotional or physiological crash that can occur after intense kink play or subspace/domspace, often hours or days later. Can involve feelings of sadness, anxiety, irritability, fatigue, or emptiness due to hormone shifts or processing the experience. Good aftercare can help mitigate drops.", related: ["Aftercare", "Subspace / Domspace"] },
    "Top / Bottom / Switch (Roles)": { term: "Top / Bottom / Switch (Roles)", definition: "General terms describing roles within a scene. 'Top' typically refers to the person giving/initiating action (often, but not always, the Dominant). 'Bottom' typically refers to the person receiving action (often, but not always, the Submissive). 'Switch' refers to someone who enjoys engaging in both roles, either within the same scene or at different times.", related: ["Dominant", "Submissive", "Switch (Style)"] },
    "Dominant (Role)": { term: "Dominant (Role)", definition: "A role characterized by taking control, leading the dynamic, setting rules, and often deriving satisfaction from guiding or having power over a partner.", related: ["Submissive", "Switch", "Top", "Power Exchange"] },
    "Submissive (Role)": { term: "Submissive (Role)", definition: "A role characterized by yielding control, following direction, serving, and often deriving satisfaction from pleasing a partner or the structure provided.", related: ["Dominant", "Switch", "Bottom", "Power Exchange"] },
    "Switch (Role/Style)": { term: "Switch (Role/Style)", definition: "An individual who enjoys and practices both Dominant and Submissive roles, potentially shifting between them. Can refer to the overall identity or the style of interaction.", related: ["Dominant", "Submissive", "Top", "Bottom"] },
    "Power Exchange": { term: "Power Exchange (P/E)", definition: "A dynamic where one partner consciously and consensually gives authority or control to another partner in specific, negotiated ways. Can range from temporary scene-based control to more structured long-term dynamics (like M/s).", related: ["Dominant", "Submissive", "Negotiation", "Consent"] },
    "Risk Profile": { term: "Risk Profile", definition: "An individual's personal assessment and tolerance for different types of risks (physical, emotional, social) associated with kink activities. Understanding one's own and one's partner's risk profiles is key for RACK.", related: ["RACK", "Negotiation", "Safety"] },
    "BDSM": { term: "BDSM", definition: "An umbrella term covering Bondage & Discipline, Dominance & submission, Sadism & Masochism.", related: []},
    "Kink": { term: "Kink", definition: "A broad term for non-conventional sexual interests, practices, or fantasies. Often overlaps with BDSM but can include other interests.", related: ["BDSM"]},
    // Added specific trait terms linked from trait details view
    "obedience": glossaryTerms["Submissive (Role)"] ? { ...glossaryTerms["Submissive (Role)"], term:"Obedience (Trait)", definition: bdsmData.submissive.coreTraits.find(t=>t.name==='obedience')?.explanation || "Willingness to follow instructions." } : { term:"Obedience (Trait)", definition: "Willingness to follow instructions."},
    "trust": glossaryTerms["Consent"] ? { ...glossaryTerms["Consent"], term:"Trust (Trait)", definition: bdsmData.submissive.coreTraits.find(t=>t.name==='trust')?.explanation || "Confidence in a partner's intentions and care." } : { term:"Trust (Trait)", definition: "Confidence in a partner's intentions and care."},
    "receptiveness": glossaryTerms["Bottom"] ? { ...glossaryTerms["Bottom"], term:"Receptiveness (Trait)", definition: bdsmData.submissive.coreTraits.find(t=>t.name==='receptiveness')?.explanation || "Openness to receiving input or sensation." } : { term:"Receptiveness (Trait)", definition: "Openness to receiving input or sensation."},
    "vulnerability": glossaryTerms["Submissive (Role)"] ? { ...glossaryTerms["Submissive (Role)"], term:"Vulnerability (Trait)", definition: bdsmData.submissive.coreTraits.find(t=>t.name==='vulnerability')?.explanation || "Willingness to show emotional softness or need." } : { term:"Vulnerability (Trait)", definition: "Willingness to show emotional softness or need."},
    "authority": glossaryTerms["Dominant (Role)"] ? { ...glossaryTerms["Dominant (Role)"], term:"Authority (Trait)", definition: bdsmData.dominant.coreTraits.find(t=>t.name==='authority')?.explanation || "Inclination and ability to command respect and take charge." } : { term:"Authority (Trait)", definition: "Inclination and ability to command respect and take charge."},
    "care": glossaryTerms["Aftercare"] ? { ...glossaryTerms["Aftercare"], term:"Care (Trait)", definition: bdsmData.dominant.coreTraits.find(t=>t.name==='care')?.explanation || "Attention paid to a partner's well-being and safety." } : { term:"Care (Trait)", definition: "Attention paid to a partner's well-being and safety."},
    "control": glossaryTerms["Power Exchange"] ? { ...glossaryTerms["Power Exchange"], term:"Control (Trait)", definition: bdsmData.dominant.coreTraits.find(t=>t.name==='control')?.explanation || "Desire and ability to direct a scene or partner." } : { term:"Control (Trait)", definition: "Desire and ability to direct a scene or partner."},
    "confidence": glossaryTerms["Dominant (Role)"] ? { ...glossaryTerms["Dominant (Role)"], term:"Confidence (Trait)", definition: bdsmData.dominant.coreTraits.find(t=>t.name==='confidence')?.explanation || "Self-assuredness in one's decisions and ability to lead." } : { term:"Confidence (Trait)", definition: "Self-assuredness in one's decisions and ability to lead."},
    // Add other traits here if desired, linking their definitions
};

// --- Achievement List (from achievements.js) ---
export const achievementList = {
    "profile_created": { name: "First Steps! ✨", desc: "Created your very first Kink Persona!" },
    "profile_edited": { name: "Growth Spurt! 🌱", desc: "Updated and refined a persona." },
    "five_profiles": { name: "Crew Assembled! 👯‍♀️", desc: "Created five different Kink Personas." },
    "avatar_chosen": { name: "Face Forward! 🎭", desc: "Selected a unique avatar for a persona." },
    "data_exported": { name: "Safe Keeper! 💾", desc: "Exported your persona data." },
    "data_imported": { name: "Welcome Back! 📁", desc: "Imported persona data." },
    "style_finder_complete": { name: "Quest Complete! 🧭", desc: "Completed the Style Finder." },
    "style_discovery": { name: "Curious Explorer! 🔭", desc: "Opened the Style Discovery feature." },
    "glossary_user": { name: "Knowledge Seeker! 📚", desc: "Opened the Kink Glossary." },
    "resource_reader": { name: "Wise Owl! 🦉", desc: "Viewed the Resources section." },
    "theme_changer": { name: "Style Maven! 🎨", desc: "Changed the application theme." },
    "goal_added": { name: "Setting Sights! 🎯", desc: "Added a goal to a persona." },
    "goal_completed": { name: "Goal Getter! ✔️", desc: "Completed a goal for a persona." },
    "five_goals_completed": { name: "Milestone Achiever! 🏆", desc: "Completed five goals across all personas." },
    "history_snapshot": { name: "Memory Lane! 📸", desc: "Saved your first persona history snapshot." },
    "ten_snapshots": { name: "Chronicler! 📜", desc: "Saved ten history snapshots for one persona." },
    "reflection_saved": { name: "Deep Thoughts! 📝", desc: "Saved your first journal reflection." },
    "five_reflections": { name: "Introspective! 🧐", desc: "Saved five journal reflections for one persona." },
    "prompt_used": { name: "Spark Seeker! 💡", desc: "Used a journal prompt." },
    "kink_reading_oracle": { name: "Oracle Consulted! 🔮", desc: "Received a Kink Compass Oracle reading." },
    "max_trait": { name: "Peak Performer! 🌟", desc: "Maxed out a trait score to 5 in the main form!" },
    "min_trait": { name: "Room to Bloom! 🌱", desc: "Rated a trait score as 1 in the main form (It's okay!)." },
    "trait_info_viewed": { name: "Detail Detective! 🕵️‍♀️", desc: "Viewed detailed info about a trait." },
    "journal_journeyman": { name: "Journal Journeyman! ✍️", desc: "Saved 10 journal entries for one persona." },
    "consistent_snapper": { name: "Consistent Chronicler! 📅", desc: "Took snapshots at least 3 days apart." },
    "trait_transformer": { name: "Trait Transformer! ✨", desc: "Increased a trait score by 2+ points between snapshots." },
    "goal_streak_3": { name: "Goal Streak! 🔥", desc: "Completed 3 goals within 7 days." },
    "challenge_accepted": { name: "Challenge Accepted! 💪", desc: "Engaged with a Daily Challenge (conceptual tracking)." },
    "first_anniversary": { name: "Compass Companion! 🎉", desc: "Used KinkCompass for one year (Conceptual)." },
    "all_styles_discovered": { name: "Style Scholar! 🧐", desc: "Viewed every style in Style Discovery (Conceptual)." },
};

// --- Synergy Hints (from synergyHints.js) ---
export const synergyHints = {
  highPositive: [
    { traits: ["authority", "care"], hint: "✨ The Benevolent Ruler ✨: Wow! High Authority paired with high Care means you lead with strength AND heart. Your guidance likely feels both firm and incredibly safe. Keep nurturing that balance!", },
    { traits: ["confidence", "creativity"], hint: "💡 The Visionary Leader 💡: Confidence meets Creativity! You're not just sure of your path, you're probably paving exciting new ones. Your scenes likely crackle with imaginative energy!", },
    { traits: ["discipline", "patience"], hint: "⏳ The Master Shaper ⏳: Strictness combined with Patience is a powerful combo for teaching and guiding growth. You set clear expectations but give space for learning. Impressive!", },
    { traits: ["control", "precision"], hint: "🔬 The Detail Maestro 🔬: High Control and Precision? You likely orchestrate scenes with incredible finesse. Every detail matters, creating a truly immersive experience for your partner.", },
    { traits: ["obedience", "devotion"], hint: "💖 The Loyal Heart 💖: Obedience fueled by deep Devotion creates a truly profound connection. Your desire to follow comes from a place of deep commitment. Beautiful!", },
    { traits: ["receptiveness", "exploration"], hint: "🌟 The Open Explorer 🌟: High Receptiveness and a love for Exploration? You're ready to receive new experiences with open arms! Your journey is likely full of exciting discoveries.", },
    // { traits: ["vulnerability", "trust"], hint: "🤝 The Foundation of Connection 🤝: Trust and Vulnerability are the bedrock! When both are high, you create incredibly deep emotional intimacy. Cherish that openness.", }, // 'trust' isn't a standard slider trait, needs adjustment if used
    { traits: ["playfulness", "mischief"], hint: "🎉 The Agent of Chaos (the fun kind!) 🎉: Playfulness AND Mischief? You're likely the life of the party, always ready with a witty remark or a playful challenge. Keep sparkling!", },
    // { traits: ["service", "anticipating needs"], hint: "🔮 The Attentive Aide 🔮: Excelling at Service and Anticipating Needs makes you seem almost psychic! You likely provide seamless, intuitive support that feels magical.", }, // 'anticipating needs' isn't a slider
     { traits: ["painTolerance", "craving"], hint: "🔥 The Intensity Seeker 🔥: High Pain Tolerance combined with Craving intense experiences? You're drawn to the edge and find exhilaration there. Ride those waves safely!", }
  ],
  interestingDynamics: [
    { traits: { high: "authority", low: "care" }, hint: "🤔 The Firm Commander 🤔: Strong Authority but lower Care? Your leadership is clear, but remember to check in emotionally. Is your guidance landing gently, even when firm? Softness can amplify strength.", },
    { traits: { high: "control", low: "patience" }, hint: "⚡️ The Impatient Orchestrator ⚡️: High Control but lower Patience? You have a clear vision, but might get frustrated if things don't go exactly to plan *immediately*. Breathe! Sometimes the process is part of the magic.", },
    { traits: { high: "sadism", low: "empathy" }, hint: "🎭 The Intense Edge-Player 🎭: Enjoying Sadism but lower Empathy? You love pushing boundaries, which is thrilling! Double-check you're reading signals accurately. Explicit check-ins are your best friend here.", },
    // { traits: { high: "obedience", low: "trust" }, hint: "🚧 The Cautious Follower 🚧: High Obedience but lower Trust? You *want* to follow, but hesitation holds you back. What small steps could build more trust? Focus on clear communication about your feelings.", }, // 'trust' issue
    { traits: { high: "rebellion", low: "playfulness" }, hint: "😠 The Grumpy Resister? 😠: High Rebellion without much Playfulness might come across as genuinely defiant rather than cheeky. Is that the vibe you want? Injecting a little humor can keep the spark alive!", },
    { traits: { high: "vulnerability", low: "confidence" }, hint: "💧 The Open but Unsure Heart 💧: Showing Vulnerability is brave! If Confidence (in yourself or the dynamic) feels low, that openness might feel scary. Celebrate small acts of bravery. You are worthy.", },
    { traits: { high: "service", low: "obedience"}, hint: "🤷 The Helpful Free Spirit 🤷: Love performing Acts of Service but not keen on strict Obedience? You find joy in helping, but on your own terms. Ensure your partner understands your motivation comes from care, not just compliance." }
  ],
};

// --- Goal Prompts (from goalPrompts.js) ---
export const goalKeywords = {
  "communicate": { relevantTraits: ["confidence", "vulnerability", "direct communication", "politeness", "empathy"], promptTemplates: [ "🌱 To improve communication, how can your '{traitName}' trait support you?", "🗣️ When communicating this goal, is your '{traitName}' score helping or hindering?", "💬 Reflect: How does expressing '{traitName}' relate to achieving clear communication?", ], },
  "boundary": { relevantTraits: ["confidence", "direct communication", "boundary setting", "trust"], promptTemplates: [ "🚧 Setting boundaries relies on '{traitName}'. How can you strengthen this?", "✋ Reflect on a past boundary discussion. How did your '{traitName}' level play a role?", "🛡️ Achieving this goal might involve asserting your '{traitName}'. Feeling ready?", ], },
  "ask for": { relevantTraits: ["confidence", "vulnerability", "direct communication", "affection seeking"], promptTemplates: [ "❓ Asking requires '{traitName}'. Where do you feel strongest/weakest in that?", "🙋‍♀️ Consider your '{traitName}'. Does it make asking feel easier or harder?", "🎁 How can embracing your '{traitName}' help you clearly ask for what you need/want?", ] },
  "explore": { relevantTraits: ["exploration", "curiosity", "boldness", "trust", "safety focus"], promptTemplates: [ "🗺️ Exploration often involves '{traitName}'. Is this trait eager for the journey?", "🧭 How does your '{traitName}' score impact your comfort level with exploring this?", "🔭 To explore safely, consider your '{traitName}'. Does it align with the risks?", ], },
  "learn": { relevantTraits: ["exploration", "patience", "trainability", "discipline focus", "precision"], promptTemplates: [ "🧠 Learning this skill connects to '{traitName}'. How's that synergy feeling?", "📚 Your '{traitName}' level might influence your learning pace. How can you adapt?", "🎓 Reflect: Does your approach to '{traitName}' support mastering this new skill?", ], },
  "rope": { relevantTraits: ["rope enthusiasm", "patience during tying", "sensuality", "trust", "precision"], promptTemplates: [ "🪢 Exploring rope connects deeply with '{traitName}'. How does this feel?", "⏳ Your '{traitName}' score might affect your rope experience. Ready for that?", "🎨 How can focusing on '{traitName}' enhance your journey with rope?", ] },
  "scene": { relevantTraits: ["creativity", "control", "intensity", "communication", "aftercare focus"], promptTemplates: [ "🎬 Planning this scene involves '{traitName}'. Feeling inspired?", "🎭 How does your '{traitName}' level shape the kind of scene you envision?", "✨ Reflect: To make this scene amazing, how can you leverage your '{traitName}'?", ] },
  "serve": { relevantTraits: ["service", "obedience", "devotion", "anticipating needs", "tidiness"], promptTemplates: [ "🧹 Serving well often means leaning into '{traitName}'. How strong is that urge?", "💖 Reflect: Does your current '{traitName}' score align with your service goals?", "🤝 How can enhancing your '{traitName}' make your service feel more fulfilling?", ], },
  "control": { relevantTraits: ["authority", "control", "confidence", "leadership", "care"], promptTemplates: [ "👑 Taking control activates your '{traitName}'. Feeling powerful?", "🕹️ How does your '{traitName}' level influence the *way* you want to take control?", "🧭 Reflect: To achieve satisfying control, how does '{traitName}' need to show up?", ], },
  "submit": { relevantTraits: ["obedience", "trust", "receptiveness", "vulnerability", "submissionDepth"], promptTemplates: [ "🙇‍♀️ Submission often involves embracing '{traitName}'. How does that feel right now?", "🔗 Your '{traitName}' level might shape your submission experience. What are you seeking?", "🕊️ Reflect: How can understanding your '{traitName}' deepen your submission?", ] },
  "pain": { relevantTraits: ["painTolerance", "pain interpretation", "sensation seeking", "trust", "communication"], promptTemplates: [ "💥 Exploring pain touches on your '{traitName}'. How prepared do you feel?", "🎢 Your '{traitName}' score influences how you might experience this. Ready to communicate?", "🔥 Reflect: How does '{traitName}' shape your desire or hesitation around pain?", ] },
  "intense": { relevantTraits: ["intensity", "craving", "sensation seeking", "boldness", "safety focus"], promptTemplates: [ "🚀 Seeking intensity engages your '{traitName}'. Ready for the ride?", "📈 How does your '{traitName}' score relate to the *kind* of intensity you crave?", "⚡ Reflect: To navigate intense experiences safely, how crucial is your '{traitName}'?", ] }
};

// --- Daily Challenges (from challenges.js) ---
export const challenges = {
  communication: [
    { title: "💬 Express One Need Clearly", desc: "Today, identify one small thing you need (a moment of quiet, help with a task, a specific type of touch) and ask for it directly and clearly. No hints!", },
    { title: "👂 Active Listening Practice", desc: "During one conversation today, focus *only* on understanding the other person. Ask clarifying questions. Resist the urge to interrupt or plan your response while they speak.", },
    { title: "🛡️ Revisit a Boundary", desc: "Think of one boundary (hard or soft). Mentally (or verbally, if appropriate) reaffirm it to yourself or your partner. Remind yourself why it's important.", },
    { title: "🗣️ 'I Feel' Statement", desc: "Practice expressing a feeling using an 'I feel...' statement instead of blaming or accusing. E.g., 'I feel unheard when...' instead of 'You never listen...'", }
  ],
  exploration: [
    { title: "🗺️ Tiny New Thing", desc: "Try one *very small* thing outside your usual routine today. A different route home? A food you avoid? A 5-minute research dive into a curious kink topic?", },
    { title: "🤔 Question an Assumption", desc: "Identify one assumption you hold about yourself, your partner, or your dynamic. Ask yourself: Is this *really* true? Where did it come from?", },
    { title: "✨ Appreciate the Unfamiliar", desc: "Find one thing today (a texture, a sound, an idea) that feels unfamiliar or even slightly uncomfortable. Observe it with curiosity instead of judgment for 1 minute.", },
    { title: "🔭 Style Snippet", desc: "Read the description of one BDSM style (in Style Discovery) that you *don't* identify with. What's one aspect you find interesting or could learn from?", }
  ],
  dominant_challenges: [
    { title: "👑 Offer Specific Praise", desc: "Catch your partner doing something well (following an instruction, showing effort, etc.) and offer genuine, *specific* praise. 'Good girl/boy' is nice, but 'I love how precisely you followed that instruction' is better!", },
    { title: "🧘‍♂️ Patience Practice (Dom)", desc: "Find one moment where you feel impatient with your partner's progress or response. Consciously pause, take 3 deep breaths, and offer encouragement instead of pressure.", },
    { title: "❤️ Proactive Care Check", desc: "Beyond basic safety, proactively check on one aspect of your partner's well-being *before* they mention it (Hydrated? Comfortable temperature? Feeling emotionally secure?)." }
  ],
  submissive_challenges: [
    { title: "💖 Express Gratitude (Sub)", desc: "Find one specific thing your Dominant partner did today that you appreciate (guidance, care, a fun command) and express your gratitude clearly.", },
    { title: "✨ Trust Exercise (Small)", desc: "Identify one very small act where you can consciously practice trust today – maybe following a simple, low-stakes instruction without hesitation, or sharing a small, slightly vulnerable feeling.", },
    { title: "🎀 Presentation Polish", desc: "Spend an extra 5 minutes on one aspect of your presentation today, purely as an act of devotion or role embodiment (e.g., shining shoes, neatening hair, focusing posture)." }
  ],
  switch_challenges: [
      { title: "🔄 Energy Check-In", desc: "Pause once today and consciously check in with your own energy. Do you feel more drawn to leading or following *right now*? Acknowledge that feeling without judgment.", },
      { title: "💬 Verbalize the Shift?", desc: "Think about how you *would* communicate a desire to switch roles, even if you don't actually do it today. Practice the words in your head.", }
  ]
};

// --- Oracle Readings (from oracle.js) ---
export const oracleReadings = {
  openings: [ "The Compass whispers... ✨", "Today's energy points towards... 🧭", "Listen closely, the Oracle reveals... 🔮", "Your inner compass is tuned to... 💖", "Let's see where the needle lands today... 🌟", ],
  focusAreas: {
    traitBased: [ "Nurturing your '{traitName}' side. How can you express it gently?", "The challenge and growth potential in your '{traitName}'. What small step beckons?", "The surprising strength found within your '{traitName}'. Own it!", "Balancing your '{traitName}' with its opposite. Where is the harmony?", "Celebrating the power of your '{traitName}'. Let it shine!", ],
    styleBased: [ "Embracing the core essence of your '{styleName}' style.", "Exploring a playful aspect of '{styleName}'.", "Finding comfort and strength within your '{styleName}' expression.", "Communicating your needs clearly *as* a '{styleName}'.", "How can you bring more joy into your '{styleName}' practice today?", ],
    general: [ "The power of clear communication today.", "Deepening trust, one small act at a time.", "Finding joy in the present moment of your dynamic.", "Honoring your boundaries with kindness.", "Exploring a new spark of curiosity.", ]
  },
  encouragements: [ "Your journey is valid and beautiful. Keep exploring!", "Small steps create big shifts. Be patient with yourself.", "Authenticity is your superpower. Shine on!", "Communicate with courage and kindness.", "Trust your intuition; it knows the way.", "Safety and consent are the foundation for magic.", "You are worthy of pleasure and connection.", "Embrace the learning process with gentle curiosity.", ],
  closings: [ "May your path be clear! 🧭", "Navigate wisely today. ✨", "Trust the journey. 💖", "Go forth and explore! 🌟", "The Compass guides you. 🔮", ],
};

// --- Journal Prompts (from prompts.js) ---
export const journalPrompts = [
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
    "What fears or insecurities sometimes hold me back in my kink exploration?",
    "How does my body language communicate my desires or limits, even without words?",
    "What does 'power' mean to me in the context of BDSM?",
    "How do I process challenging emotions (like sub drop, dom drop, or scene processing) afterwards?",
    "What's one way I can show appreciation for my partner(s) in our dynamic?",
    "If I could design a perfect scene right now, what key elements would it include?",
    "How do my past experiences influence my current desires and boundaries?",
];

// --- Context Help Texts (from app.js) ---
export const contextHelpTexts = {
    name: "Give your persona a unique name!",
    role: "Select the primary role (Dominant, Submissive, Switch). This influences available styles and core traits.",
    style: "Choose a specific style within your role. This adds specific traits and helps define the persona's flavor.",
    avatar: "Pick an emoji to represent this persona visually.",
    traits: "Rate how strongly each trait applies to this persona (1=Low, 5=High). These define the persona's tendencies.",
    // Add more help texts for other elements if needed
};

// --- Style Finder Icons (from app.js getStyleIcons method - kept here for SF context) ---
export const sfStyleIcons = {
    'Submissive': '🙇', 'Brat': '😈', 'Slave': '🔗', 'Switch': '🔄', 'Pet': '🐾', 'Little': '🍼', 'Puppy': '🐶', 'Kitten': '🐱', 'Princess': '👑', 'Rope Bunny': '🪢', 'Masochist': '💥', 'Prey': '🏃', 'Toy': '🎲', 'Doll': '🎎', 'Bunny': '🐰', 'Servant': '🧹', 'Playmate': '🎉', 'Babygirl': '🌸', 'Captive': '⛓️', 'Thrall': '🛐', 'Puppet': '🎭', 'Maid': '🧼', 'Painslut': '🔥', 'Bottom': '⬇️',
    'Dominant': '👤', 'Assertive': '💪', 'Nurturer': '🤗', 'Strict': '📏', 'Master': '🎓', 'Mistress': '👸', 'Daddy': '👨‍🏫', 'Mommy': '👩‍🏫', 'Owner': '🔑', 'Rigger': '🧵', 'Sadist': '😏', 'Hunter': '🏹', 'Trainer': '🏋️', 'Puppeteer': '🕹️', 'Protector': '🛡️', 'Disciplinarian': '✋', 'Caretaker': '🧡', 'Sir': '🎩', 'Goddess': '🌟', 'Commander': '⚔️'
};
