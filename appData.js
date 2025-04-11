


// === appData.js === (Revised & Enhanced)
// Consolidates all static data definitions for KinkCompass v2.8.7+

// --- Core BDSM Data ---
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
      // NOTE: Added normalized keys here for easier lookup if needed elsewhere, though utils function does this.
      // Also ensured emojis are consistent with sfStyleIcons where possible.
      { name: "Classic Submissive 🙇‍♀️", normalizedKey: "classic submissive", summary: "Focuses on general obedience, service, and presentation within a power dynamic.", traits: [
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Serving? Prefers self-focus", "2": "Helps if asked, not proactive", "3": "Happy to help, finds satisfaction", "4": "Service with a smile, anticipates", "5": "Love language is service!" } },
          { name: "presentation", explanation: "The importance placed on one's appearance, attire, and demeanor as part of fulfilling the submissive role and pleasing the Dominant.", desc: { "1": "Low effort appearance", "2": "Cleans up okay, minimal fuss", "3": "Likes looking presentable", "4": "Enjoys looking their best for role", "5": "Presentation is part of the art" } }
      ]},
      { name: "Brat 😈", normalizedKey: "brat", summary: "Enjoys playful defiance, testing boundaries, and earning consequences.", traits: [
          { name: "playful defiance", explanation: "A tendency to playfully resist, tease, break rules intentionally, or challenge authority within the agreed dynamic, often to elicit a reaction or 'taming'.", desc: { "1": "Prefers following rules", "2": "Gentle poking/testing", "3": "Enjoys witty banter/rule-bending", "4": "Thrives on loopholes/challenges", "5": "Ruler of Sass, defiance is art" } },
          { name: "mischief", explanation: "A love for causing lighthearted trouble, playing pranks, or generally being playfully disruptive within the dynamic.", desc: { "1": "Prefers calm, avoids trouble", "2": "Tiny prank/tease slips out", "3":"Stirring things up is fun sometimes", "4":"Clever, playful troublemaker", "5":"Chaos Creator!" } }
      ]},
      { name: "Slave 🔗", normalizedKey: "slave", summary: "Finds deep fulfillment in total devotion, service, and surrender.", traits: [
          { name: "devotion", explanation: "An intense loyalty, commitment, and dedication focused entirely on the Dominant partner, often seen as a core element of identity.", desc: { "1": "Loyal but keeps independence", "2": "Loyal, exploring deeper commitment", "3": "Heart belongs to Dom/Mistress", "4": "World revolves around Owner", "5": "Absolute devotion is core" } },
          { name: "surrender", explanation: "The act of willingly giving up control, autonomy, or decision-making power to the Dominant, ranging from scene-specific to a more constant state.", desc: { "1": "Yields physically, mentally resistant", "2": "Yields sometimes, finds it a challenge", "3": "Mostly freeing, enjoys trusting", "4": "Deep surrender feels right and fulfilling", "5": "Complete surrender = sanctuary" } },
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Avoids tasks when possible", "2": "Service feels like chore, does if must", "3": "Service is part of the role, performs well", "4": "Anticipates needs eagerly, finds joy", "5": "Utter fulfillment in perfect service" } }
      ]},
      { name: "Pet 🐾", normalizedKey: "pet", summary: "Enjoys embodying an animal persona, seeking affection and guidance.", traits: [
          { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Waits, doesn't initiate asking", "2": "Shy about asking, hints", "3": "Enjoys seeking/receiving actively", "4": "'Good pet!' feels amazing!", "5": "Constantly seeks validation/affection" } },
          { name: "playfulness", explanation: "A strong inclination towards games, lighthearted interactions, silliness, and expressing joy through playful actions.", desc: { "1":"Reserved, not very playful", "2":"Occasionally playful when invited", "3":"Enjoys light games/teasing", "4":"Actively seeks play opportunities", "5":"Boundlessly playful energy" } },
          { name: "non-verbal expression", explanation: "Communicating needs, emotions, or responses primarily through body language, sounds (like purrs, whimpers, barks), or gestures rather than words.", desc: { "1": "Prefers using words always", "2": "Some non-verbal cues slip out", "3": "Nuzzles/wags/purrs come naturally", "4": "Fluent in Pet sounds/body language!", "5": "Body language IS primary language" } }
      ]},
      { name: "Little 🍼", normalizedKey: "little", summary: "Embraces a childlike mindset, seeking care, play, and structure.", traits: [
          { name: "age regression comfort", explanation: "The ease and enjoyment found in adopting a younger mental or emotional state ('littlespace'), often involving childlike behaviors, interests, and needs.", desc: { "1": "Feels awkward/embarrassing", "2": "Dips in cautiously, self-conscious", "3": "Comfortable happy place sometimes", "4": "Natural and joyful state!", "5": "Littlespace is home, feels essential!" } },
          { name: "need for guidance", explanation: "A desire for rules, structure, and direction provided by a Caregiver (Daddy/Mommy/etc.), finding comfort and safety in their guidance.", desc: { "1": "Prefers total independence", "2": "Accepts rules reluctantly", "3": "Guidance feels safe and welcome", "4": "Thrives with clear rules/structure", "5": "Complete reliance is comforting bliss!" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Feels mature/worldly, dislikes acting naive", "2":"Retains adult perspective, can play innocent", "3":"Enjoys feeling sweet/carefree/protected", "4":"Naturally embodies innocence and wonder", "5":"Pure childlike spirit shines through" } }
      ]},
      { name: "Puppy 🐶", normalizedKey: "puppy", summary: "Exudes boundless energy, loyalty, and eagerness to please.", traits: [
           { name: "boundless energy", explanation: "Having high levels of enthusiasm, physical energy, and a readiness for play or activity, characteristic of a young dog.", desc: { "1": "Low energy, prefers quiet rest", "2": "Bursts of energy, tires easily", "3": "Good energy, ready to play when asked", "4": "Zoomies! Full of infectious enthusiasm", "5": "Unstoppable puppy power, always ready!" } },
           { name: "trainability", explanation: "The willingness and ability to learn commands, tricks, or desired behaviors through instruction and positive reinforcement from a Handler/Owner.", desc: { "1": "Easily distracted, forgets commands", "2": "Learns with patience/repetition", "3": "Picks up commands well, enjoys learning", "4": "Loves learning, super focused during training", "5": "Learns instantly, eager for next command!" } },
           { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Indifferent to praise/pets", "2": "Likes occasional pats/kind words", "3": "Enjoys praise/cuddles actively", "4": "Actively seeks validation/belly rubs", "5": "Needs constant affection/reassurance" } }
      ]},
      { name: "Kitten 🐱", normalizedKey: "kitten", summary: "Combines curiosity, grace (or playful clumsiness), and affection.", traits: [
           { name: "curiosity", explanation: "An innate desire to investigate new things, explore surroundings, or playfully interact with objects and people, sometimes leading to mischief.", desc: { "1": "Prefers familiar, avoids new things", "2": "Cautiously curious, observes first", "3": "Enjoys exploring, playful bats at new items", "4": "Must investigate everything interesting", "5": "Fearlessly inquisitive, gets into everything" } },
           { name: "gracefulness", explanation: "Moving with a sense of poise, elegance, and agility, characteristic of felines (though sometimes contrasted with playful clumsiness).", desc: { "1": "Very clumsy, trips over air", "2": "Sometimes sleek, sometimes knocks things over", "3": "Reasonable kitten grace, lands most jumps", "4": "Sleek, poised, moves with feline charm", "5": "Poetry in motion, elegant and precise" } },
           { name: "affection seeking", explanation: "Actively desiring and soliciting praise, physical affection (like petting or cuddles), and validation from their Owner/Handler.", desc: { "1": "Aloof, prefers solitude", "2": "Accepts affection on own terms", "3": "Enjoys being petted/nuzzling when mood strikes", "4": "Seeks out laps/cuddles often", "5": "Craves constant attention/pets/purrs loudly" } }
      ]},
      { name: "Princess 👑", normalizedKey: "princess", summary: "Adores being pampered and centre stage.", traits: [
          { name: "desire for pampering", explanation: "A strong enjoyment of being spoiled, cared for, given gifts, and generally treated as special or royal.", desc: { "1": "Low maintenance, dislikes fuss/attention", "2": "Enjoys occasional treats/comforts", "3": "Being spoiled feels lovely and appreciated", "4": "Thrives on being doted on/center of attention", "5": "Expects luxurious treatment/constant admiration" } },
          { name: "delegation tendency", explanation: "A preference or expectation that others will perform tasks or cater to their needs, rather than doing things themselves.", desc: { "1": "Prefers doing things self, feels capable", "2": "Asks for help occasionally if needed", "3": "Appreciates having things done for them", "4": "Readily delegates tasks, expects assistance", "5": "Naturally expects others to cater/serve" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Worldly and knowing", "2":"Aware but enjoys playful innocence", "3":"Sweet and somewhat naive demeanor", "4":"Cultivated charming innocence", "5":"Genuinely naive, wide-eyed charm" } }
      ]},
      { name: "Rope Bunny 🪢", normalizedKey: "rope bunny", summary: "Loves the art and sensation of rope.", traits: [
           { name: "rope enthusiasm", explanation: "A specific interest and enjoyment in being tied with ropes, focusing on the aesthetics, sensations, trust, and/or vulnerability involved.", desc: { "1": "Hesitant/dislikes ropes/restraint", "2": "Curious, needs safety/reassurance", "3": "Enjoys simple ties, feels secure", "4": "Loves aesthetics/sensation of rope", "5": "Adores complex ties/suspension deeply" } },
           { name: "patience during tying", explanation: "The ability to remain still and calm for extended periods while being tied, often seen as part of the meditative or submissive process.", desc: { "1": "Very fidgety/impatient, wants it done", "2": "Patient for short periods, gets restless", "3": "Reasonably patient, enjoys the process", "4": "Finds calm zen state during tying", "5": "Stillness is part of the surrender/meditation" } },
           { name: "sensuality", explanation: "Heightened awareness and appreciation of physical sensations, textures, touch, and the body's responses.", desc: { "1":"Focus only on restriction/immobility", "2":"Notices sensation somewhat, focus elsewhere", "3":"Appreciates the feel of rope on skin", "4":"Very aware of rope texture/pressure", "5":"Rope play is a highly sensual experience" } }
      ]},
      { name: "Masochist 💥", normalizedKey: "masochist", summary: "Finds pleasure/release through pain.", traits: [
            { name: "pain interpretation", explanation: "How physical pain or discomfort is perceived and processed, ranging from purely negative to interesting, focusing, or even pleasurable.", desc: { "1": "Pain just hurts, avoid at all costs", "2": "Intensity is interesting, but not pleasure", "3": "Finds release/focus through managing pain", "4": "Pain often translates to pleasure/endorphins", "5": "Pain is a symphony/ecstasy/deeply desired" } },
            { name: "sensation seeking", explanation: "The drive to experience physical sensations, ranging from gentle touches to intense pain or pressure.", desc: { "1": "Gentle touch is best, dislikes pain", "2": "Mild to moderate okay, avoids sharp pain", "3": "Enjoy exploring different types of sensations", "4": "Crave intense/sharp/deep sensations", "5": "Seek extreme sensations, push limits" } },
            { name: "endurance display", explanation: "Finding satisfaction or validation in demonstrating the ability to withstand pain or intense sensation for extended periods.", desc: { "1":"Low tolerance, stops quickly", "2":"Can take some, doesn't make a show", "3":"Showing toughness can be rewarding", "4":"Pride in taking pain well/long", "5":"Loves showing off endurance/resilience" } }
      ]},
      { name: "Prey 🏃‍♀️", normalizedKey: "prey", summary: "Enjoys the thrill of the chase.", traits: [ // Emoji matched
          { name: "enjoyment of chase", explanation: "Finding excitement, adrenaline, or pleasure in the dynamic of being pursued, hunted, or stalked within a consensual scene.", desc: { "1": "Terrifying, avoid being pursued", "2": "Playful, short pursuit is okay/fun", "3": "Thrill of being chased is exciting!", "4": "Love the adrenaline rush of the hunt", "5": "The chase IS the ecstasy/main event" } },
          { name: "fear play comfort", explanation: "The level of comfort and enjoyment derived from scenes involving elements of simulated fear, anxiety, or panic, always within a foundation of trust and safety.", desc: { "1": "No fear play, triggers genuine anxiety", "2": "Okay in small doses, needs lots of safety", "3": "Adds spice when safe/consensual", "4": "Thrilling when trust is absolute", "5": "Exhilarating dance with 'pretend' fear" } },
          { name: "rebellion", explanation: "A tendency towards defiance, argumentativeness, or resistance against rules and authority, often playful but sometimes more challenging.", desc: { "1": "Compliant, would not 'escape'", "2": "Might hesitate slightly", "3": "Playfully tries to 'get away'", "4": "Uses wits to evade capture", "5": "Master of escape attempts (part of the fun)" } }
      ]},
       {
        name: "Toy 🎲", normalizedKey: "toy", summary: "Loves being used and played with.", traits: [
          { name: "objectification comfort", explanation: "The level of comfort or enjoyment derived from being treated as an object for a partner's pleasure or use, within negotiated boundaries.", desc: { "1": "Feels dehumanizing/uncomfortable", "2": "Okay sometimes, need cherishing/personhood", "3": "Fun being played with/used as object", "4": "Love being a prized possession/plaything", "5": "Exist to be used/enjoyed, finds fulfillment" } },
          { name: "responsiveness to control", explanation: "The ability and willingness to react quickly and accurately to a partner's commands or physical direction, like being easily posed or moved.", desc: { "1": "Awkward/inflexible when moved", "2": "Stiff, needs clear physical direction", "3": "Respond well to being positioned/used", "4": "Mold me! Highly responsive to direction", "5": "Like clay, instantly adapts to user's will" } },
          { name: "adaptability", explanation: "Flexibility in shifting roles, moods, expectations, or types of play based on the partner's desires or the scene's needs.", desc: { "1":"Rigid, prefers specific uses", "2":"Adapts slowly to new ways of being used", "3":"Fairly adaptable to different kinds of play", "4":"Easily adapts to different roles/uses", "5":"Instantly adapts to whatever is needed"} }
        ]
      },
      {
        name: "Doll 🎎", normalizedKey: "doll", summary: "Enjoys being perfectly posed and admired.", traits: [
          { name: "aesthetic focus", explanation: "Placing high importance on appearance, clothing, makeup, and posture to achieve a specific, often perfect or artificial, 'doll-like' look.", desc: { "1": "Looks unimportant, focus on feeling", "2": "Being neat is nice, but effort", "3": "Crafting the doll look is part of the fun", "4": "Becoming the perfect Doll is the goal", "5": "Living Doll perfection is paramount" } },
          { name: "stillness / passivity", explanation: "The ability and enjoyment of remaining motionless, quiet, and unresponsive for extended periods, often while being posed or admired.", desc: { "1": "Need to move, fidgety", "2": "Still briefly, gets restless quickly", "3": "Being posed/still feels nice/relaxing", "4": "Love melting into absolute stillness", "5": "Can remain perfectly still/passive for long time" } },
          { name: "objectification comfort", explanation: "The level of comfort or enjoyment derived from being treated as an object for a partner's pleasure or use, within negotiated boundaries.", desc: { "1":"Dislikes feeling like just an object", "2":"Tolerates briefly, needs interaction", "3":"Enjoys being admired as a beautiful object", "4":"Loves being displayed/posed like art", "5":"Finds deep fulfillment in being aesthetic object"} }
        ]
      },
      {
        name: "Bunny 🐰", normalizedKey: "bunny", summary: "Gentle, shy, and easily startled.", traits: [
          { name: "shyness / skittishness", explanation: "A natural tendency towards being reserved, easily startled, cautious, or needing gentle approaches.", desc: { "1": "Bold, confident, not easily startled", "2": "A little shy initially, warms up", "3": "Soft-spoken, easily startled by loud noises", "4": "Shyness/skittishness is part of the charm", "5": "Definition of skittish, very easily spooked" } },
          { name: "gentle affection need", explanation: "A strong preference or need for soft, non-demanding physical touch, quiet words, and a calm environment to feel safe and connected.", desc: { "1": "Prefers intensity or less touch", "2":"Appreciates gentle touch but doesn't crave it", "3":"Soft pets/words are the best way to connect", "4":"Thrives on gentle touch and soft reassurance", "5":"Needs only the softest, gentlest touch" } },
          { name: "innocence", explanation: "Embodying or enjoying a sense of purity, naivety, wonder, and freedom from adult concerns, often central to the 'little' persona.", desc: { "1":"Feels worldly/experienced", "2":"Naive at times but generally aware", "3":"Sweet, trusting, and somewhat innocent", "4":"Naturally exudes an innocent, gentle vibe", "5":"Pure, wide-eyed, trusting innocence" } }
        ]
      },
      {
        name: "Servant 🧹", normalizedKey: "servant", summary: "Finds joy in dutiful service.", traits: [
           { name: "task focus", explanation: "The ability to concentrate on completing assigned duties or tasks meticulously and efficiently, without getting easily distracted.", desc: { "1": "Easily distracted, struggles with tasks", "2": "Does tasks, but focus wanders", "3": "Enjoys task lists, good focus", "4": "Highly focused on completing duties perfectly", "5": "Laser-focused on service, ignores distractions" } },
           { name: "anticipating needs", explanation: "The skill and desire to recognize or predict a partner's needs or wants before they are explicitly stated.", desc: { "1": "Barely notices others' needs", "2": "Spots obvious needs sometimes", "3": "Starting to anticipate simple needs", "4": "Often sees needs before asked", "5": "Finely tuned intuition for partner's needs" } },
           { name: "politeness", explanation: "A natural inclination towards courteous, respectful, and formal manners in speech and behavior, often tied to the service role.", desc: { "1": "Blunt/informal speech", "2": "Casually polite, uses manners sometimes", "3": "Courteous and respectful always", "4": "Formal and respectful address/manner", "5": "Impeccable manners, perfect etiquette" } }
        ]
      },
      {
        name: "Playmate 🎉", normalizedKey: "playmate", summary: "Loves shared fun and adventure.", traits: [
           { name: "enthusiasm for games", explanation: "A strong enjoyment and eagerness to participate in games, playful scenarios, or lighthearted activities.", desc: { "1": "Not playful, dislikes games", "2": "Will play along sometimes if asked", "3": "Game on! Enjoys playing", "4": "Super enthusiastic about games/play", "5": "Always ready and eager for fun!" } },
           { name: "good sport", explanation: "The ability to participate in games or challenges with a positive attitude, regardless of winning or losing, focusing on the shared fun.", desc: { "1": "Hates losing/gets easily frustrated", "2": "Tries, but can get sulky/competitive", "3": "Win/lose, it's all about the fun", "4": "Excellent sport, gracious in defeat/victory", "5": "Perfect playmate, makes it fun for everyone" } },
           { name: "playfulness", explanation: "A strong inclination towards games, lighthearted interactions, silliness, and expressing joy through playful actions.", desc: { "1":"Very serious demeanor", "2":"Occasional silliness/joking", "3":"Generally enjoys fun and laughter", "4":"Very playful and lighthearted", "5":"Embodies playfulness and fun"} }
        ]
      },
      {
        name: "Babygirl 🌸", normalizedKey: "babygirl", summary: "Craves nurturing, affection, guidance.", traits: [
          { name: "vulnerability expression", explanation: "The capacity and willingness to show emotional softness, openness, neediness, or perceived weakness within the dynamic. It's crucial for deep connection and often linked to trust.", desc: { "1": "Always puts on brave face", "2": "Shows vulnerability rarely/hesitantly", "3": "Expressing needs/fears is okay when safe", "4": "Comfortable embracing softer side/needs", "5": "Vulnerability is natural and feels connecting" } },
          { name: "coquettishness", explanation: "A playful and charming flirtatiousness, often blending innocence with a hint of allure or teasing.", desc: { "1": "Flirting feels awkward/unnatural", "2": "A little charming/shyly flirtatious?", "3": "Enjoys being playful/flirtatious", "4": "Naturally charming and coquettish", "5": "Master of sweet, alluring charm" } },
          { name: "need for guidance", explanation: "A desire for rules, structure, and direction provided by a Caregiver (Daddy/Mommy/etc.), finding comfort and safety in their guidance.", desc: { "1": "Very independent, dislikes rules", "2": "Accepts some guidance if gentle", "3": "Likes having rules/structure", "4": "Thrives with clear expectations/guidance", "5": "Relies completely on Caregiver for direction" } }
        ]
      },
      {
        name: "Captive ⛓️", normalizedKey: "captive", summary: "Relishes the thrill of capture/restraint.", traits: [
          { name: "struggle performance", explanation: "The enjoyment or skill in acting out resistance, panic, or defiance during a consensual capture or restraint scene for dramatic effect.", desc: { "1": "Comply immediately, no struggle", "2": "Token wiggle/hesitation", "3": "Playing the part of struggling is fun", "4": "Enjoys putting on a good show of resistance", "5": "Oscar-worthy struggle performance!" } },
          { name: "acceptance of fate", explanation: "The internal feeling experienced when captured or restrained, ranging from genuine distress to thrilling acceptance or enjoyment of the powerlessness.", desc: { "1": "Genuine distress/dislike of situation", "2": "Uneasy acceptance, underlying anxiety", "3": "Alright, you win... (with inner thrill)", "4": "Secretly (or openly) loves being captured", "5": "This is exactly where I want to be" } },
          { name: "fear play comfort", explanation: "The level of comfort and enjoyment derived from scenes involving elements of simulated fear, anxiety, or panic, always within a foundation of trust and safety.", desc: { "1":"No fear play", "2":"Okay in small doses", "3":"Adds spice when safe", "4":"Thrilling with trust", "5":"Exhilarating dance with 'pretend' fear"} }
        ]
      },
      {
        name: "Thrall 🛐", normalizedKey: "thrall", summary: "Bound by deep devotion/mental connection.", traits: [
           { name: "mental focus", explanation: "The ability to concentrate deeply on the Dominant partner's presence, will, or commands, often to the exclusion of other stimuli.", desc: { "1": "Mind wanders easily, hard to connect", "2": "Tries to focus, distractions creep in", "3": "Can tune in well when directed", "4": "Deeply focused on partner's presence/will", "5": "Total mental immersion, blocks out world" } },
           { name: "suggestibility", explanation: "The degree to which one is open to and likely to accept and act upon the suggestions or commands of the Dominant, particularly when in a focused or altered state.", desc: { "1": "Questions everything, resistant", "2": "Considers, but decides self mostly", "3": "Open to Dom's suggestions, likely follows", "4": "Highly suggestible within the dynamic", "5": "Putty in their hands (mentally)" } },
           { name: "devotion", explanation: "An intense loyalty, commitment, and dedication focused entirely on the Dominant partner, often seen as a core element of identity.", desc: { "1":"Loyal but detached", "2":"Strong loyalty", "3":"Deeply committed", "4":"Unwavering devotion", "5":"Absolute, all-encompassing devotion" } }
        ]
      },
      {
        name: "Puppet 🎭", normalizedKey: "puppet", summary: "Loves being precisely directed.", traits: [
          { name: "responsiveness to direction", explanation: "The ability and willingness to react quickly and accurately to a partner's commands or physical direction, like being easily posed or moved.", desc: { "1": "Clumsy/slow to respond", "2": "Follows, but needs repeats/clarification", "3": "Responds well to clear commands", "4": "Instant, fluid response to direction!", "5": "Their will is my immediate action" } },
          { name: "passivity in control", explanation: "The enjoyment or ability to remain physically inactive and without self-initiated movement until directed by the controlling partner.", desc: { "1": "Wants to initiate own movement", "2": "Mostly passive, but fidgets/resists slightly", "3": "Waits patiently for next command", "4": "Deeply passive until explicitly directed", "5": "Perfectly passive, limp like a puppet" } }
        ]
      },
      {
        name: "Maid 🧼", normalizedKey: "maid", summary: "Delights in order and polite service.", traits: [
          { name: "attention to detail", explanation: "A keen focus on precision, neatness, and perfection in performing tasks, especially cleaning or organizing.", desc: { "1": "Close enough is good enough", "2": "Tries to be neat, misses small things", "3": "Cleanliness and order are important", "4": "Spotless! Has a very keen eye for detail", "5": "Perfection is the minimum standard" } },
          { name: "uniformity", explanation: "Finding comfort, identity, or role-immersion through wearing a specific uniform or prescribed attire.", desc: { "1": "Dislikes uniforms, feels restrictive", "2": "Okay wearing sometimes, not essential", "3": "Helps get into character, feels right", "4": "Loves wearing my uniform!", "5": "The uniform IS the role, essential" } },
          { name: "service", explanation: "Finding satisfaction or fulfillment in performing tasks, assisting, or catering to the needs and desires of a Dominant partner.", desc: { "1": "Avoids service", "2": "Serves reluctantly", "3": "Serves willingly as part of role", "4": "Enjoys serving well", "5": "Finds deep fulfillment in service" } }
        ]
      },
       {
        name: "Painslut 🔥", normalizedKey: "painslut", summary: "Craves intense sensation, pushes limits.", traits: [
          { name: "pain seeking", explanation: "Actively desiring and asking for painful or intense sensations, often finding pleasure, release, or validation through them.", desc: { "1": "Avoids pain actively", "2": "Tolerates pain, doesn't ask for it", "3": "Craves the edge sometimes, asks hesitantly", "4": "Yes, please! Asks for pain openly", "5": "Feed me pain! Craves it intensely" } },
          { name: "endurance display", explanation: "Finding satisfaction or validation in demonstrating the ability to withstand pain or intense sensation for extended periods.", desc: { "1": "Gives up quickly, low threshold", "2": "Takes some, doesn't show off", "3": "Likes showing what I can handle!", "4": "Push me harder! Loves testing limits", "5": "Unbreakable (almost)! Pride in endurance" } },
          { name: "craving", explanation: "An intense desire or need for specific types of stimulation, sensations, or experiences, often pushing boundaries.", desc: { "1":"Prefers calm, gentle sensations", "2":"Likes mild intensity, predictable", "3":"Enjoys strong sensations, seeks thrills", "4":"Actively seeks out intense experiences", "5":"Needs extreme intensity/sensations" } }
        ]
      },
      {
        name: "Bottom ⬇️", normalizedKey: "bottom", summary: "Open to receiving sensation/direction.", traits: [
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
      // Emoji consistency check
      { name: "Classic Dominant 👑", normalizedKey: "classic dominant", summary: "Focuses on general leadership, control, and setting the dynamic's tone.", traits: [ { name: "leadership", explanation: "The ability to guide, direct, motivate, and take responsibility for the partner and the dynamic's direction.", desc: { "1":"Reluctant leader, prefers partner leads", "2":"Guides when necessary, steps back otherwise", "3":"Confident direction, takes initiative", "4":"Inspiring leader, sets clear vision", "5":"Natural born leader, commands effortlessly" } } ] },
      { name: "Assertive 💪", normalizedKey: "assertive", summary: "Leads with clear communication and boundaries.", traits: [ { name: "direct communication", explanation: "Expressing needs, commands, and boundaries clearly, directly, and unambiguously.", desc: { "1":"Hints subtly, avoids direct commands", "2":"States needs carefully, slightly indirect", "3":"Clear and direct communication style", "4":"Says what they mean, leaves no ambiguity", "5":"Crystal clear precision in language" } }, { name: "boundary setting", explanation: "Proactively defining and consistently enforcing limits and expectations for oneself and the partner.", desc: { "1":"Avoids setting limits, uncomfortable", "2":"Sets limits hesitantly when pushed", "3":"Clear, respected boundaries are key", "4":"Rock solid limits, firmly maintained", "5":"Fortress of boundaries, proactively defined" } } ] },
      { name: "Nurturer 🤗", normalizedKey: "nurturer", summary: "Focuses on emotional support, patience, and guiding growth.", traits: [ { name: "emotional support", explanation: "Providing comfort, validation, reassurance, and a safe emotional space for the partner, especially during vulnerability.", desc: { "1":"Awkward with emotions, avoids them", "2":"Tries to be supportive, unsure how", "3":"Good listener, offers comfort/validation", "4":"Acts as partner's rock, provides deep security", "5":"Empathy expert, intuitively understands needs" } }, { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient, wants results now!", "2":"Tries to be patient, but easily frustrated", "3":"Practices patience, allows for mistakes", "4":"Calm and patient guide, encourages growth", "5":"Endless patience, serene demeanor" } }, { name: "empathy", explanation: "The ability to understand, share, and respond appropriately to the feelings and emotional state of the partner.", desc: { "1":"Detached observer, focuses on actions", "2":"Notices obvious feelings, less attuned to subtle", "3":"Good sense of partner's emotional state", "4":"Strongly empathizes, feels partner's emotions", "5":"Deeply intuitive connection, almost psychic" } } ] },
      { name: "Strict 📏", normalizedKey: "strict", summary: "Maintains order through clear rules and discipline.", traits: [ { name: "rule enforcement", explanation: "Consistently upholding pre-negotiated rules and standards, applying consequences fairly when rules are broken.", desc: { "1":"Lets things slide, avoids confrontation", "2":"Inconsistent enforcement, depends on mood", "3":"Enforces rules consistently and fairly", "4":"Maintains high standards, expects adherence", "5":"Absolute adherence expected, zero tolerance" } }, { name: "discipline focus", explanation: "Utilizing corrective measures (punishment, tasks, etc.) as a primary tool for shaping behavior, teaching lessons, or maintaining order.", desc: { "1":"Prefers positive reinforcement only", "2":"Hesitant about punishment, uses rarely", "3":"Views discipline as tool for growth/learning", "4":"Believes clear consequences are essential", "5":"Master of fair and effective discipline" } } ] },
      { name: "Master 🎓", normalizedKey: "master", summary: "Commands with high expectations and strong presence/ownership.", traits: [ { name: "expectation setting", explanation: "Defining and communicating high standards for behavior, service, or performance from the partner.", desc: { "1":"Vague standards, hopes sub figures it out", "2":"Some expectations, could clarify more", "3":"Clear standards/protocols communicated", "4":"High standards, demands excellence", "5":"Impeccable standards, anticipates perfection" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Blends in, quiet demeanor", "2":"Tries to project authority, feels forced", "3":"Authoritative presence felt naturally", "4":"Commands attention effortlessly upon entering", "5":"Radiating palpable power and control" } }, { name: "dominanceDepth", explanation: "The desired level of control or influence over the partner's life, ranging from scene-specific to near-total power exchange (TPE).", desc: { "1":"Light influence, prefers partnership", "2":"Prefers clearly defined but limited power", "3":"Enjoys clear authority within scenes/dynamic", "4":"Seeks significant influence/control (e.g., TPE-lite)", "5":"Craves total power/control (e.g., Full TPE)" } } ] },
      { name: "Mistress 👸", normalizedKey: "mistress", summary: "Leads with elegance, high standards, and captivating presence.", traits: [ { name: "expectation setting", explanation: "Defining and communicating high standards for behavior, service, or performance from the partner.", desc: { "1":"Standards fuzzy, relies on charm", "2":"Sets rules sometimes, focuses on fun", "3":"Clear expectations for behavior/service", "4":"High standards expected and rewarded", "5":"Exquisite standards, demands the best" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Quiet influence, relies on words", "2":"Working on projecting a commanding aura", "3":"Authority felt naturally, gracefully asserted", "4":"Effortless command, captivating presence", "5":"Regal presence, instantly recognized" } }, { name: "creativity", explanation: "Enjoyment and skill in devising unique scenarios, tasks, challenges, or forms of play.", desc: { "1":"Prefers known routines, less imaginative", "2":"Tries small variations on existing scenes", "3":"Enjoys crafting unique scenarios/tasks", "4":"Highly imaginative, loves novel ideas", "5":"Master scene creator, visionary" } } ] },
      { name: "Daddy 👨‍🏫", normalizedKey: "daddy", summary: "Combines protective guidance with affectionate authority.", traits: [ { name: "protective guidance", explanation: "A strong instinct to shield, guide, and look out for the well-being and safety of the 'little' or partner.", desc: { "1":"Hands-off approach, believes in independence", "2":"Offers advice sometimes if asked", "3":"Looks out for partner's safety/well-being", "4":"Acts as a safe harbor, actively protects", "5":"Ultimate Daddy Bear, fiercely protective" } }, { name: "affectionate authority", explanation: "Blending firm commands, rules, and discipline with warmth, praise, physical affection, and emotional care.", desc: { "1":"Struggles to balance, often one or the other", "2":"Tries to balance, sometimes awkward", "3":"Firm but fair, with plenty of praise/hugs", "4":"Seamlessly blends warm hugs & stern rules", "5":"Perfect blend of loving and commanding" } }, { name: "possession", explanation: "A feeling of ownership, pride, and responsibility towards the partner, often expressed protectively.", desc: { "1":"Not possessive, encourages freedom", "2":"Slightly protective, 'my little one'", "3":"Comfortable 'mine' feeling, caring ownership", "4":"Clearly states 'mine', feels pride", "5":"Strong sense of ownership/responsibility" } } ] },
      { name: "Mommy 👩‍🏫", normalizedKey: "mommy", summary: "Provides nurturing comfort and gentle, guiding discipline.", traits: [ { name: "nurturing comfort", explanation: "Providing warmth, reassurance, soothing actions, and emotional safety, similar to a maternal figure.", desc: { "1":"Not naturally nurturing, practical", "2":"Can be comforting when needed", "3":"Instinctively offers hugs/soothing words", "4":"Acts as a safe haven, deeply comforting", "5":"Ultimate Mommy, endless warmth/comfort" } }, { name: "gentle discipline", explanation: "Correcting behavior or enforcing rules with kindness, patience, and a focus on teaching rather than harsh punishment.", desc: { "1":"Avoids correction, dislikes being stern", "2":"Prefers talking through issues calmly", "3":"Uses gentle correction/redirection", "4":"Firm but gentle hand, focuses on learning", "5":"Master of gentle, loving guidance" } }, { name: "care", explanation: "The level of attention paid to the partner's physical and emotional well-being, safety, and comfort, including negotiation and aftercare.", desc: { "1":"Low care focus", "2":"Basic care", "3":"Attentive care", "4":"Deeply caring", "5":"Intensely nurturing care" } } ] },
      { name: "Owner 🔑", normalizedKey: "owner", summary: "Takes pride in possession and care.", traits: [ { name: "possessiveness", explanation: "A feeling of ownership, pride, and responsibility towards the partner, often expressed protectively.", desc: { "1":"Not possessive, values partner's autonomy", "2":"Slightly protective, feels connection", "3":"Comfortable 'mine' feeling, sense of responsibility", "4":"Clearly states 'mine', strong possessive pride", "5":"Absolute possession, deep ownership feeling" } }, { name: "behavioral training", explanation: "Using commands, rewards, and consequences to shape the partner's (often a 'pet') behavior according to desired standards.", desc: { "1":"Lets pet do their thing", "2":"Offers some direction, inconsistent", "3":"Uses rewards/correction to shape behavior", "4":"Skilled trainer, clear methods", "5":"Master behavioralist, shapes precisely" } }, { name: "control", explanation: "The desire and ability to direct the scene, manage details, restrict the partner's actions, or influence the environment according to one's vision.", desc: { "1":"Low control", "2":"Suggestive control", "3":"Situational control", "4":"Detailed control", "5":"Total control" } } ] },
      { name: "Rigger 🧵", normalizedKey: "rigger", summary: "Artist of restraint and sensation.", traits: [ { name: "rope technique", explanation: "Skill and knowledge in applying ropes for bondage, including knots, patterns, safety considerations, and potentially suspension.", desc: { "1":"Rope=spaghetti, struggles with knots", "2":"Learning basics, can do simple ties", "3":"Comfortable with several functional/pretty ties", "4":"Skilled rope artist, complex patterns", "5":"Rope Master! Intricate suspension/kinbaku" } }, { name: "aesthetic vision", explanation: "Focusing on the visual beauty, patterns, and artistic expression created by the ropes on the partner's body.", desc: { "1":"Looks don't matter, only function", "2":"Function first, neatness is bonus", "3":"Presentation matters, aims for beauty", "4":"Creating rope art is a primary goal!", "5":"Sculpting with rope, focus on visual masterpiece" } }, { name: "precision", explanation: "Executing actions, commands, or techniques (like rope placement or impact) with careful accuracy and attention to detail.", desc: { "1":"Approximate ties, loose/uneven", "2":"Tries for neatness, sometimes slips", "3":"Careful placement, good tension", "4":"Very precise knotting and placement", "5":"Flawless execution, every strand perfect" } } ] },
      { name: "Sadist 😏", normalizedKey: "sadist", summary: "Finds joy in giving sensation with care.", traits: [ { name: "sensation control", explanation: "Skillfully administering pain or intense sensations, carefully reading the partner's reactions and adjusting intensity for the desired effect.", desc: { "1":"Hesitant to inflict, fears hurting", "2":"Experimenting cautiously, checks in constantly", "3":"Getting the hang of reading reactions", "4":"Skilled conductor of sensations, plays limits", "5":"Master of senses, orchestrates experience" } }, { name: "psychological focus", explanation: "Deriving enjoyment from observing or influencing the partner's emotional or mental state through actions, words, or the dynamic itself.", desc: { "1":"Focus solely on physical action", "2":"Noticing reactions more, connecting cause/effect", "3":"Partner's reactions are fascinating/guide", "4":"Thrives on influencing partner's mental state", "5":"Partner's reaction is the masterpiece" } }, { name: "sadism", explanation: "Finding pleasure or excitement in consensually inflicting physical or psychological pain, discomfort, or distress on a partner.", desc: { "1":"Avoids causing pain, purely gentle", "2":"Enjoys teasing edge, light sensation play", "3":"Likes controlled infliction, enjoys reactions", "4":"Finds pleasure in partner's reaction to pain", "5":"Deep enjoyment from consensual sadism" } } ] },
      { name: "Hunter 🏹", normalizedKey: "hunter", summary: "Thrives on the chase and capture.", traits: [ { name: "pursuit drive", explanation: "A strong desire or instinct to chase, track down, or capture the partner, enjoying the process of the hunt.", desc: { "1":"Prefers prey comes willingly", "2":"Playful, short pursuit is okay/fun", "3":"Thrill of the chase is exciting!", "4":"Born predator! Loves the hunt", "5":"The hunt is everything! Primal drive" } }, { name: "instinct reliance", explanation: "Trusting and acting upon gut feelings, intuition, or primal urges during a scene, particularly in pursuit or control scenarios.", desc: { "1":"Needs a detailed plan, analytical", "2":"Prefers strategy, some gut feeling", "3":"Trusting instincts feels good/natural", "4":"Instincts are sharp, often leads the way", "5":"Operates on pure instinct during chase" } }, { name: "boldness", explanation: "Willingness to act decisively, take risks, or push boundaries fearlessly within the dynamic.", desc: { "1":"Cautious", "2":"Takes calculated risks", "3":"Fairly bold", "4":"Very bold/fearless", "5":"Extremely daring" } } ] },
      { name: "Trainer 🏋️‍♂️", normalizedKey: "trainer", summary: "Guides with patience and structure.", traits: [
           { name: "skill development focus", explanation: "Prioritizing the teaching, improvement, or perfection of specific skills, behaviors, or knowledge in the partner.", desc: { "1":"Sub should learn on their own", "2":"Offers some guidance if asked", "3":"Rewarding to help partner grow/learn", "4":"Dedicated trainer, loves teaching", "5":"Master coach, passionate about potential" } },
           { name: "structured methodology", explanation: "Using planned exercises, consistent feedback, and clear progression steps to facilitate learning and development.", desc: { "1":"Winging it, inconsistent approach", "2":"Some steps, but not formal/planned", "3":"Uses clear steps, provides feedback", "4":"Develops systematic training plans", "5":"Perfect curriculum, meticulous methods" } },
           { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient, wants results now", "2":"Tries, but gets frustrated with slow progress", "3":"Practices patience, understands learning curve", "4":"Calm and patient guide, very encouraging", "5":"Endless patience, serene teacher" } }
        ] },
      { name: "Puppeteer 🕹️", normalizedKey: "puppeteer", summary: "Controls with creative precision.", traits: [ { name: "fine motor control", explanation: "Ability to direct the partner's body or actions with high levels of detail and precision, like controlling individual limbs or expressions.", desc: { "1":"Broad strokes, less focus on detail", "2":"Working on precision, sometimes clumsy", "3":"Guiding partner's movements feels good", "4":"Master manipulator! Precise control", "5":"Absolute micro-control, like extensions of self" } }, { name: "objectification gaze", explanation: "Viewing and treating the partner primarily as an object to be controlled, posed, or manipulated according to one's aesthetic or functional desires.", desc: { "1":"Needs human connection, dislikes objectifying", "2":"Can detach sometimes, feels a bit clinical", "3":"Puppeteer mindset is fun roleplay", "4":"Deep enjoyment in controlling an 'object'", "5":"Puppet exists solely for my direction" } }, { name: "creativity", explanation: "Enjoyment and skill in devising unique scenarios, tasks, challenges, or forms of play.", desc: { "1":"Routine actions", "2":"Slight variations", "3":"Enjoys creating sequences", "4":"Very creative direction", "5":"Master choreographer" } } ] },
      { name: "Protector 🛡️", normalizedKey: "protector", summary: "Leads with vigilance and strength.", traits: [ { name: "vigilance", explanation: "A state of heightened awareness and watchfulness, focused on anticipating potential risks or threats to the partner or the dynamic.", desc: { "1":"Not very watchful, assumes safety", "2":"Tries to be aware, sometimes distracted", "3":"Actively keeping an eye out for risks", "4":"Ever watchful guardian, anticipates issues", "5":"Eagle eyes! Hyper-aware of surroundings" } }, { name: "defensive instinct", explanation: "A strong, often immediate reaction to shield, defend, or safeguard the partner from perceived harm, criticism, or discomfort.", desc: { "1":"Avoids conflict, non-confrontational", "2":"Steps in if situation becomes serious", "3":"Don't mess with mine! Protective instinct", "4":"Fiercely protective, shields partner", "5":"Unbreakable shield! Instantly defends" } } ] },
      { name: "Disciplinarian ✋", normalizedKey: "disciplinarian", summary: "Enforces rules with firm fairness.", traits: [ { name: "consequence delivery", explanation: "Administering pre-agreed consequences for rule-breaking calmly, fairly, and effectively, often focusing on the lesson learned.", desc: { "1":"Avoids punishment, feels guilty", "2":"Hesitant/inconsistent, waffles", "3":"Delivers agreed consequences fairly/firmly", "4":"Decisive and effective correction", "5":"Master of measured, impactful consequences" } }, { name: "detachment during discipline", explanation: "The ability to remain emotionally calm and objective while administering discipline, focusing on the purpose rather than personal feelings.", desc: { "1":"Gets emotional/angry during discipline", "2":"Tries to stay calm, but feels affected", "3":"Remains objective and calm during correction", "4":"Cool under pressure, focused on lesson", "5":"Ice-cold precision, unaffected demeanor" } }, { name: "rule enforcement", explanation: "Consistently upholding pre-negotiated rules and standards, applying consequences fairly when rules are broken.", desc: { "1":"Lax", "2":"Inconsistent", "3":"Consistent", "4":"Strict", "5":"Unyielding" } } ] },
      { name: "Caretaker 🧡", normalizedKey: "caretaker", summary: "Nurtures and supports holistically.", traits: [ { name: "holistic well-being focus", explanation: "Attending to the partner's overall needs, including physical comfort, emotional security, health, and general happiness.", desc: { "1":"Focuses elsewhere, assumes self-care", "2":"Checks basic safety/comfort", "3":"Attentive to overall physical/emotional state", "4":"Provides total care package, anticipates needs", "5":"Guardian of partner's complete well-being" } }, { name: "rule implementation for safety", explanation: "Setting and enforcing boundaries or routines primarily aimed at ensuring the partner's health, safety, and well-being.", desc: { "1":"Dislikes setting rules, feels controlling", "2":"Suggests healthy habits gently", "3":"Sets practical rules for safety/health", "4":"Enforces safety rules lovingly but firmly", "5":"Master of preventative care through structure" } }, { name: "patience", explanation: "The ability to remain calm, understanding, and supportive during teaching, training, challenges, or when a partner is slow to respond.", desc: { "1":"Impatient", "2":"Somewhat patient", "3":"Patient", "4":"Very patient", "5":"Extremely patient" } } ] },
      { name: "Sir 🎩", normalizedKey: "sir", summary: "Leads with honor and respect.", traits: [ { name: "formal demeanor", explanation: "Maintaining a polite, respectful, and often traditional or dignified manner of speech and behavior.", desc: { "1":"Super casual, dislikes formality", "2":"Can be formal when needed, prefers casual", "3":"Maintains respectful, formal tone naturally", "4":"Calm, dignified, formal presence", "5":"Epitome of formal, respected authority" } }, { name: "service expectation", explanation: "Expecting or requiring specific acts of service, deference, or adherence to protocol from the partner.", desc: { "1":"Not focused on service", "2":"Appreciates good service but doesn't demand", "3":"Expects proper service as part of role", "4":"High standards for service, clearly communicated", "5":"Impeccable service is mandatory/expected" } }, { name: "discipline", explanation: "Utilizing corrective measures (punishment, tasks, etc.) as a primary tool for shaping behavior, teaching lessons, or maintaining order.", desc: { "1":"Avoids discipline", "2":"Rare/light discipline", "3":"Uses moderate discipline", "4":"Firm discipline", "5":"Strict discipline" } } ] },
      { name: "Goddess 🌟", normalizedKey: "goddess", summary: "Inspires worship and adoration.", traits: [ { name: "worship seeking", explanation: "Desiring or requiring acts of adoration, reverence, and devotion from the partner, finding satisfaction in being elevated.", desc: { "1":"Feels embarrassing/uncomfortable", "2":"A little adoration is nice sometimes", "3":"Being adored feels wonderful/natural", "4":"Basks in glory, enjoys being worshipped", "5":"I AM divine! Expects/demands reverence" } }, { name: "effortless command", explanation: "The ability to influence or direct the partner with minimal overt effort, often through presence, subtle cues, or inherent authority.", desc: { "1":"Takes effort to command respect", "2":"Working on projecting inevitable authority", "3":"Commands understood with minimal fuss", "4":"A look/word is enough to command", "5":"My will shapes reality, effortless command" } }, { name: "presence", explanation: "An aura of authority, confidence, and control that is palpable and influences the dynamic non-verbally.", desc: { "1":"Subtle", "2":"Noticeable", "3":"Strong", "4":"Commanding", "5":"Overpowering" } } ] },
      { name: "Commander ⚔️", normalizedKey: "commander", summary: "Leads with strategic control.", traits: [ { name: "strategic direction", explanation: "Planning scenes or interactions with clear goals, steps, and potentially complex maneuvers; thinking ahead.", desc: { "1":"Winging it, reactive approach", "2":"General idea only, adapts on the fly", "3":"Sets clear objectives/orders for scenes", "4":"Master strategist! Plans complex scenarios", "5":"Flawless command/control, detailed plans" } }, { name: "decisiveness", explanation: "Making clear, firm, and timely decisions regarding the dynamic, scene direction, or rules.", desc: { "1":"Struggles with decisions, hesitant", "2":"Takes time, second-guesses often", "3":"Makes clear decisions, sticks to them", "4":"Swift and decisive action!", "5":"Instant, unwavering decisions" } }, { name: "leadership", explanation: "The ability to guide, direct, motivate, and take responsibility for the partner and the dynamic's direction.", desc: { "1":"Follower", "2":"Hesitant leader", "3":"Capable leader", "4":"Strong leader", "5":"Exceptional leader" } } ] }
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
        { name: "Fluid Switch 🌊", normalizedKey: "fluid switch", summary: "Shifts roles easily and intuitively based on the moment.", traits: [ /* Uses core switch traits, potentially leans on others based on context */ ]},
        { name: "Dominant-Leaning Switch 👑↔️", normalizedKey: "dominant-leaning switch", summary: "Primarily enjoys Dominant roles but explores Submission.", traits: [ /* Refers to Dom core + Switch core, weighted */ ]},
        { name: "Submissive-Leaning Switch 🙇‍♀️↔️", normalizedKey: "submissive-leaning switch", summary: "Primarily enjoys Submissive roles but explores Dominance.", traits: [ /* Refers to Sub core + Switch core, weighted */ ]},
        { name: "Situational Switch 🤔", normalizedKey: "situational switch", summary: "Role depends heavily on partner, mood, or context.", traits: [ /* Uses core switch traits, high adaptability is key */ ]}
    ]
  }
};

// --- Style Suggestions (for getSub/DomStyleBreakdown in utils.js) ---
// !! PLACEHOLDER DATA !! You need to fill this with meaningful content.
// Structure: { 'normalized-style-key': { 1: { paraphrase: "...", suggestion: "..." }, 2: {...}, ... 5: {...} } }

export const subStyleSuggestions = {
  'classic submissive': {
    1: { paraphrase: "Exploring independence, finds following difficult.", suggestion: "Focus on building trust as a foundation. Start with very small, low-stakes requests." },
    2: { paraphrase: "Follows when clearly guided, may hesitate.", suggestion: "Practice clear communication about comfort levels and needs. Ask clarifying questions." },
    3: { paraphrase: "Comfortable with direction and established rules.", suggestion: "Explore different forms of service or presentation that feel fulfilling." },
    4: { paraphrase: "Eager to please and follow commands.", suggestion: "Deepen your understanding of your Dominant's specific desires and anticipate needs." },
    5: { paraphrase: "Finds deep joy and fulfillment in obedience and presentation.", suggestion: "Discuss the nuances of protocol, explore more complex service, or refine your presentation art." }
  },
  'brat': {
    1: { paraphrase: "Prefers harmony and avoids playful conflict.", suggestion: "If curious, explore gentle teasing or witty banter in safe, low-pressure situations." },
    2: { paraphrase: "Starting to test rules playfully, enjoys light banter.", suggestion: "Communicate clearly about the *intent* behind defiance. Ensure your partner enjoys the dynamic." },
    3: { paraphrase: "Enjoys witty challenges and bending rules creatively.", suggestion: "Find creative ways to test boundaries playfully. Discuss desired reactions with your partner." },
    4: { paraphrase: "Thrives on clever challenges and earning reactions.", suggestion: "Refine your timing and wit. Ensure consequences are negotiated and desired, and aftercare is provided." },
    5: { paraphrase: "Master of creative, engaging defiance that fuels the dynamic.", suggestion: "Balance intense bratting with moments of connection and vulnerability. Consider the energy flow." }
  },
  'slave': {
    1: { paraphrase: "Values autonomy strongly, finds surrender difficult.", suggestion: "Explore scene-specific surrender first. Focus on building immense trust before considering deeper dynamics." },
    2: { paraphrase: "Exploring deeper commitment, trust is building.", suggestion: "Define specific areas of service or surrender that feel comfortable. Communicate boundaries often." },
    3: { paraphrase: "Devoted heart, finds satisfaction in dedicated service.", suggestion: "Refine your service skills and explore different ways to express devotion." },
    4: { paraphrase: "Dedicated focus, world revolves around your Owner.", suggestion: "Communicate desires for structure, protocol, or specific forms of ownership." },
    5: { paraphrase: "Finds profound fulfillment in total surrender and devotion.", suggestion: "Ensure ongoing, honest communication about well-being, limits, and needs within this intense dynamic." }
  },
  'pet': {
    1: { paraphrase: "Prefers human interaction, less drawn to pet personas.", suggestion: "Explore if specific *aspects* (like affection, playfulness) appeal outside a pet context." },
    2: { paraphrase: "Curious about pet play, sometimes embodies simple traits.", suggestion: "Experiment with non-verbal cues or seeking affection in ways that feel safe and fun." },
    3: { paraphrase: "Enjoys embodying a pet persona, seeks affection/guidance.", suggestion: "Develop your chosen pet persona's mannerisms. Communicate needs clearly to your Owner/Handler." },
    4: { paraphrase: "Finds joy and comfort in deep petspace.", suggestion: "Explore more specific training, gear, or scenarios that enhance your pet identity." },
    5: { paraphrase: "Fully embodies pet persona; non-verbal communication is natural.", suggestion: "Deepen the connection with your Owner/Handler. Ensure long-term needs within the dynamic are met." }
  },
  'little': {
    1: { paraphrase: "Feels more comfortable in an adult headspace.", suggestion: "Explore if specific needs (like comfort, guidance) can be met in other ways." },
    2: { paraphrase: "Dips toes into littlespace cautiously.", suggestion: "Create a safe, comforting environment. Start with short periods of age regression." },
    3: { paraphrase: "Comfortable and happy in littlespace sometimes.", suggestion: "Explore specific activities, toys, or routines that bring joy and comfort." },
    4: { paraphrase: "Finds littlespace natural and joyful.", suggestion: "Communicate needs for specific types of care, rules, or play to your Caregiver." },
    5: { paraphrase: "Littlespace feels essential and deeply fulfilling.", suggestion: "Ensure clear communication about boundaries (hard/soft ages), needs, and emotional safety." }
  },
  'puppy': {
    1: { paraphrase: "Prefers calm and quiet, less energetic.", suggestion: "Explore if the *loyalty* aspect resonates more than the energy." },
    2: { paraphrase: "Shows bursts of energy, enjoys simple commands.", suggestion: "Focus on basic training games and positive reinforcement. Ensure enough rest!" },
    3: { paraphrase: "Enjoys playful energy and learning commands.", suggestion: "Develop specific 'tricks' or routines. Communicate your need for play and affection." },
    4: { paraphrase: "Full of infectious enthusiasm and eager to please.", suggestion: "Explore more complex training or longer play sessions. Ensure clear communication with Handler." },
    5: { paraphrase: "Unstoppable puppy power, deeply loyal and trainable.", suggestion: "Maintain balance between high energy and rest. Ensure Handler understands deep devotion." }
  },
  'kitten': {
    1: { paraphrase: "Prefers directness over subtlety or mischief.", suggestion: "Explore if the *affection* or *sensuality* aspects appeal separately." },
    2: { paraphrase: "Shows occasional curiosity and enjoys gentle affection.", suggestion: "Experiment with playful batting, nuzzling, or exploring textures." },
    3: { paraphrase: "Enjoys playful mischief, seeking laps, and purring.", suggestion: "Develop your kitten mannerisms. Communicate preferences for play vs. cuddles." },
    4: { paraphrase: "Naturally embodies feline grace, curiosity, and affection.", suggestion: "Explore different types of kitten play (hunting games, grooming). Communicate boundaries clearly." },
    5: { paraphrase: "Master of charming, unpredictable kitten behavior.", suggestion: "Deepen the bond with your Owner. Ensure needs are understood, even when expressed non-verbally." }
  },
  'princess': {
    1: { paraphrase: "Low maintenance, dislikes fuss or being center stage.", suggestion: "Explore if specific acts of appreciation (not pampering) feel good." },
    2: { paraphrase: "Enjoys occasional treats and comforts, but self-reliant.", suggestion: "Communicate clearly which specific types of 'spoiling' feel good and which feel excessive." },
    3: { paraphrase: "Being spoiled and admired feels lovely.", suggestion: "Explore delegation of small tasks. Define what 'royal' treatment means to you." },
    4: { paraphrase: "Thrives on being doted on and the center of attention.", suggestion: "Communicate expectations clearly. Ensure appreciation is shown for the care received." },
    5: { paraphrase: "Expects luxurious treatment and constant admiration.", suggestion: "Balance receiving with acknowledging effort. Ensure the dynamic remains respectful." }
  },
  'rope bunny': {
    1: { paraphrase: "Finds restraint uncomfortable or anxiety-provoking.", suggestion: "Focus on building trust. Explore non-rope forms of sensation or control first." },
    2: { paraphrase: "Curious about rope, enjoys simple, secure ties.", suggestion: "Learn basic rope safety. Communicate clearly about comfort and sensation during tying." },
    3: { paraphrase: "Enjoys the aesthetics and sensation of functional ties.", suggestion: "Explore different types of rope and simple patterns. Practice patience during tying." },
    4: { paraphrase: "Loves the artistry and deep sensation of complex rope.", suggestion: "Communicate desires for specific ties or sensations. Find a skilled, safety-conscious Rigger." },
    5: { paraphrase: "Finds profound connection/release in intricate ties/suspension.", suggestion: "Prioritize safety discussions (nerves, circulation). Build deep trust and communication with your Rigger." }
  },
  'masochist': {
    1: { paraphrase: "Avoids pain, prefers gentle sensations.", suggestion: "Focus on pleasure from non-painful sources. This style may not be for you." },
    2: { paraphrase: "Finds intense sensation interesting, but not yet pleasure.", suggestion: "Explore the boundary between intensity and pain cautiously. Use clear safewords." },
    3: { paraphrase: "Finds release or focus through managing pain.", suggestion: "Identify which types of pain/sensation are appealing. Communicate limits clearly." },
    4: { paraphrase: "Pain often translates to pleasure/endorphins.", suggestion: "Explore different types of intense sensation. Negotiate aftercare needs specific to pain play." },
    5: { paraphrase: "Deeply desires pain as a core part of experience/ecstasy.", suggestion: "Prioritize finding a skilled, attentive Sadist who understands your limits and needs. Safety first!" }
  },
  'prey': {
    1: { paraphrase: "Feels anxious or dislikes being pursued.", suggestion: "Explore dynamics based on comfort and security instead. This style may not align." },
    2: { paraphrase: "Enjoys short, playful pursuits; finds intense chase stressful.", suggestion: "Keep chase scenes light and clearly defined. Use safewords if needed." },
    3: { paraphrase: "Thrill of being chased is exciting!", suggestion: "Negotiate the 'rules' of the chase. Explore different types of 'escape' attempts." },
    4: { paraphrase: "Loves the adrenaline rush of the hunt and capture.", suggestion: "Communicate boundaries around fear play clearly. Ensure deep trust with your Hunter." },
    5: { paraphrase: "The chase IS the ecstasy; thrives on primal pursuit.", suggestion: "Discuss intensity levels and safewords specific to chase/capture scenes. Prioritize aftercare." }
  },
  'toy': {
    1: { paraphrase: "Feels uncomfortable being treated as an object.", suggestion: "Focus on dynamics that emphasize personhood and connection. This style may not suit." },
    2: { paraphrase: "Okay with objectification sometimes, needs connection.", suggestion: "Define specific scenarios where being a 'toy' feels fun. Ensure clear boundaries." },
    3: { paraphrase: "Enjoys being played with and used for partner's pleasure.", suggestion: "Explore different ways you enjoy being 'used'. Communicate preferences clearly." },
    4: { paraphrase: "Loves being a prized possession or adaptable plaything.", suggestion: "Discuss desired levels of control and responsiveness with your partner." },
    5: { paraphrase: "Finds deep fulfillment in existing to be used and enjoyed.", suggestion: "Ensure ongoing consent and communication about well-being within this intense dynamic." }
  },
  'doll': {
    1: { paraphrase: "Prefers active participation over stillness/passivity.", suggestion: "Focus on dynamics involving movement and interaction. This style may not align." },
    2: { paraphrase: "Can be still briefly, enjoys some aesthetic focus.", suggestion: "Practice short periods of stillness. Explore specific looks or outfits." },
    3: { paraphrase: "Enjoys being posed and admired as a beautiful object.", suggestion: "Work with your partner on crafting the desired 'doll' look and poses." },
    4: { paraphrase: "Loves melting into stillness and embodying perfection.", suggestion: "Explore longer periods of passivity. Communicate needs for comfort during posing." },
    5: { paraphrase: "Finds deep fulfillment in living doll perfection and admiration.", suggestion: "Ensure clear communication about physical limits and comfort during extended stillness." }
  },
  'bunny': {
    1: { paraphrase: "Bold and confident, not easily startled.", suggestion: "Explore dynamics that match your confident energy. This gentle style may not fit." },
    2: { paraphrase: "A little shy initially, needs gentle approach.", suggestion: "Communicate your need for patience and soft interactions. Build trust slowly." },
    3: { paraphrase: "Soft-spoken, appreciates gentle affection and calm.", suggestion: "Create a comforting environment. Express appreciation for gentle handling." },
    4: { paraphrase: "Shyness/skittishness is part of the charm; thrives on gentle care.", suggestion: "Communicate what helps you feel safe and secure. Enjoy the soft dynamic." },
    5: { paraphrase: "Definition of skittish; needs utmost gentleness and reassurance.", suggestion: "Ensure your partner fully understands your need for a calm, predictable environment and very gentle touch." }
  },
  'servant': {
    1: { paraphrase: "Prefers self-focus over performing duties for others.", suggestion: "Explore dynamics based on partnership rather than service. This style may not suit." },
    2: { paraphrase: "Performs tasks if asked, but focus may wander.", suggestion: "Practice focusing on one task at a time. Find satisfaction in a job well done." },
    3: { paraphrase: "Enjoys task lists and fulfilling duties diligently.", suggestion: "Seek clarity on expectations. Explore anticipating simple needs." },
    4: { paraphrase: "Highly focused on duties; anticipates needs proactively.", suggestion: "Refine your skills in specific areas of service. Communicate about protocols." },
    5: { paraphrase: "Laser-focused on service; finds deep joy in perfect execution.", suggestion: "Balance dedication with self-care. Ensure appreciation for your efforts." }
  },
  'playmate': {
    1: { paraphrase: "Prefers serious interactions over games.", suggestion: "Explore dynamics focused on intensity or structure. This style may not align." },
    2: { paraphrase: "Will play along sometimes, but not naturally drawn to games.", suggestion: "Try simple, low-pressure games first. Focus on shared enjoyment." },
    3: { paraphrase: "Enjoys playing games and lighthearted activities.", suggestion: "Explore different types of games or playful scenarios with your partner." },
    4: { paraphrase: "Super enthusiastic about games and shared fun.", suggestion: "Suggest new adventures or activities. Be a good sport, win or lose." },
    5: { paraphrase: "Always ready and eager for fun and adventure!", suggestion: "Keep finding new ways to play together. Ensure communication remains clear even during fun." }
  },
  'babygirl': {
    1: { paraphrase: "Prefers independence and less overt vulnerability.", suggestion: "Explore dynamics that emphasize strength or partnership. This softer style may not fit." },
    2: { paraphrase: "Shows vulnerability cautiously, enjoys some guidance.", suggestion: "Practice expressing needs gently. Build trust with your guiding partner." },
    3: { paraphrase: "Comfortable expressing needs and enjoys playful affection.", suggestion: "Explore your coquettish side. Communicate desires for specific types of care." },
    4: { paraphrase: "Naturally embodies charming vulnerability and seeks guidance.", suggestion: "Deepen the connection with your Caregiver. Enjoy the balance of sweetness and reliance." },
    5: { paraphrase: "Finds deep security in vulnerability and reliant guidance.", suggestion: "Ensure clear communication about emotional states and needs. Cherish the nurturing bond." }
  },
  'captive': {
    1: { paraphrase: "Dislikes feeling trapped or powerless.", suggestion: "Focus on dynamics emphasizing freedom or partnership. This style may not be for you." },
    2: { paraphrase: "Tolerates brief restraint, finds struggle stressful.", suggestion: "Explore very light, short-term restraint first. Ensure safewords are clear." },
    3: { paraphrase: "Finds playing the part of struggling/being captured fun.", suggestion: "Negotiate the 'performance' aspect. Explore different capture scenarios." },
    4: { paraphrase: "Enjoys the thrill of capture and simulated resistance.", suggestion: "Communicate boundaries around fear play clearly. Build deep trust." },
    5: { paraphrase: "Finds deep excitement/release in the captive experience.", suggestion: "Ensure robust safety protocols and aftercare for intense capture scenes." }
  },
  'thrall': {
    1: { paraphrase: "Mind wanders easily, finds deep focus difficult.", suggestion: "Practice mindfulness or focus techniques outside of scenes. Explore lighter connections first." },
    2: { paraphrase: "Tries to focus, open to partner's suggestions.", suggestion: "Build the mental connection gradually. Start with simple commands or suggestions." },
    3: { paraphrase: "Can tune in well, feels strong loyalty.", suggestion: "Explore deepening the mental focus. Communicate the strength of your devotion." },
    4: { paraphrase: "Deeply focused on partner's will, highly suggestible.", suggestion: "Ensure clear communication about boundaries even within deep connection. Trust is paramount." },
    5: { paraphrase: "Total mental immersion; finds fulfillment in devoted connection.", suggestion: "Maintain grounding practices. Ensure partner understands the depth and responsibility." }
  },
  'puppet': {
    1: { paraphrase: "Prefers self-initiated movement and action.", suggestion: "Focus on dynamics where you have more agency. This style may not suit." },
    2: { paraphrase: "Follows directions, but may feel stiff or hesitant.", suggestion: "Practice responsiveness in simple ways. Communicate any discomfort." },
    3: { paraphrase: "Responds well to clear commands and direction.", suggestion: "Explore being directed in more complex ways. Enjoy the feeling of being controlled." },
    4: { paraphrase: "Instant, fluid response to direction; enjoys passivity.", suggestion: "Work with your Puppeteer on intricate sequences. Communicate physical limits." },
    5: { paraphrase: "Perfectly passive and responsive; finds joy in being directed.", suggestion: "Ensure clear communication for safety during complex direction. Maintain body awareness." }
  },
  'maid': {
    1: { paraphrase: "Prefers casualness and less focus on tidiness.", suggestion: "Explore dynamics that value other forms of service or connection. This style may not fit." },
    2: { paraphrase: "Tries to be neat, finds formality effortful.", suggestion: "Focus on one area of tidiness or politeness at a time. Find enjoyment in order." },
    3: { paraphrase: "Values cleanliness and order; enjoys polite service.", suggestion: "Take pride in your attention to detail. Explore different aspects of formal service." },
    4: { paraphrase: "Spotless! Loves wearing the uniform and perfect etiquette.", suggestion: "Refine your service skills. Communicate with your superior about standards." },
    5: { paraphrase: "Perfection is the standard; finds deep fulfillment in flawless service.", suggestion: "Balance dedication with self-care. Ensure your efforts are acknowledged." }
  },
  'painslut': {
    1: { paraphrase: "Actively avoids pain, seeks only comfort.", suggestion: "Focus entirely on pleasure from non-painful sources. This style is likely not for you." },
    2: { paraphrase: "Tolerates pain, but doesn't actively seek it.", suggestion: "Explore the edges of intense sensation very cautiously, if desired at all. Prioritize safety." },
    3: { paraphrase: "Craves the edge sometimes, enjoys testing limits.", suggestion: "Communicate *very* clearly about desires and limits. Start with lower intensity." },
    4: { paraphrase: "Actively asks for and enjoys intense, painful sensations.", suggestion: "Negotiate types of pain, intensity, and safewords meticulously. Ensure skilled partner." },
    5: { paraphrase: "Needs extreme intensity; finds deep release/pleasure in pain.", suggestion: "Requires extreme trust, communication, and safety protocols. Prioritize expert partners and aftercare." }
  },
  'bottom': {
    1: { paraphrase: "Prefers initiating or equal partnership.", suggestion: "Focus on dynamics where you take the lead or share it equally." },
    2: { paraphrase: "Open to receiving sometimes, but prefers balance.", suggestion: "Explore specific types of receiving (sensation, direction) you enjoy." },
    3: { paraphrase: "Comfortable in the receiving role during scenes.", suggestion: "Communicate your preferences for types of input or sensation clearly." },
    4: { paraphrase: "Enjoys receiving direction and sensation deeply.", suggestion: "Explore your endurance and receptiveness levels. Provide clear feedback." },
    5: { paraphrase: "Finds great fulfillment and connection in the bottom role.", suggestion: "Communicate limits and needs proactively. Ensure your Top understands your capacity." }
  },

   // Switch Styles (Reusing the detailed text from subStyleSuggestions for consistency)
   'fluid switch': {
    1: { paraphrase: "Exploring roles", suggestion: "Focus on communication during shifts." },
    2: { paraphrase: "Comfortable shifting", suggestion: "Identify what triggers your desire to switch." },
    3: { paraphrase: "Adapting readily", suggestion: "Refine non-verbal cues for smoother transitions." },
    4: { paraphrase: "Seamlessly versatile", suggestion: "Explore the nuances of both dominance and submission." },
    5: { paraphrase: "Master of flow", suggestion: "Consider how your energy influences the dynamic." }
   },
   'dominant-leaning switch': {
    1: { paraphrase: "Primarily dominant, exploring sub", suggestion: "Identify what aspects of submission appeal to you." },
    2: { paraphrase: "Comfortable leading, trying sub", suggestion: "Practice vulnerability in small, safe steps." },
    3: { paraphrase: "Balances leading with yielding", suggestion: "Explore the interplay between your dominant and submissive sides." },
    4: { paraphrase: "Strong leader, enjoys submissive play", suggestion: "How does yielding enhance your understanding of dominance?" },
    5: { paraphrase: "Fluent in both, prefers leading", suggestion: "Mentor others on the flexibility of switching." }
   },
   'submissive-leaning switch': {
    1: { paraphrase: "Primarily submissive, exploring dom", suggestion: "Identify what aspects of dominance appeal to you." },
    2: { paraphrase: "Comfortable yielding, trying dom", suggestion: "Practice taking initiative in small, low-stakes ways." },
    3: { paraphrase: "Balances yielding with leading", suggestion: "Explore the interplay between your submissive and dominant sides." },
    4: { paraphrase: "Enjoys submission, confident leading", suggestion: "How does leading enhance your understanding of submission?" },
    5: { paraphrase: "Fluent in both, prefers yielding", suggestion: "Share insights on the beauty of adaptability." }
   },
   'situational switch': {
     1: { paraphrase: "Role depends on context", suggestion: "Identify what factors influence your role preference." },
     2: { paraphrase: "Adapting to partner/mood", suggestion: "Practice clear communication about your current desires." },
     3: { paraphrase: "Flexible role player", suggestion: "Explore how different partners bring out different sides." },
     4: { paraphrase: "Highly adaptable to dynamics", suggestion: "Consider what core needs are met regardless of role." },
     5: { paraphrase: "Chameleon of dynamics", suggestion: "Reflect on the freedom and challenges of situational switching." }
   },
};

// === END OF subStyleSuggestions ===

export const domStyleSuggestions = {
  'classic dominant': {
    1: { paraphrase: "Prefers partnership or following.", suggestion: "Explore taking small leadership roles in low-stakes situations if dominance interests you." },
    2: { paraphrase: "Guiding gently when needed, hesitant to take full charge.", suggestion: "Practice making clear decisions for a scene. Build confidence through preparation." },
    3: { paraphrase: "Comfortable leading scenes and setting the tone.", suggestion: "Explore different communication styles. Refine your ability to read your partner." },
    4: { paraphrase: "Confident commander, enjoys guiding the dynamic.", suggestion: "Refine your specific style of leadership (e.g., firm, nurturing, playful). Deepen understanding of partner motivation." },
    5: { paraphrase: "Natural authority, effortlessly commands respect and guides.", suggestion: "Consider the responsibility that comes with strong leadership. Explore mentoring others." }
  },
  'assertive': {
    1: { paraphrase: "Communicates subtly or indirectly.", suggestion: "Practice stating needs or commands simply and directly, even if it feels blunt at first." },
    2: { paraphrase: "Learning directness, sometimes clarifies boundaries reactively.", suggestion: "Proactively define and communicate boundaries before play begins." },
    3: { paraphrase: "Clear communicator, sets and respects boundaries.", suggestion: "Ensure boundaries are consistently maintained, even when tested playfully." },
    4: { paraphrase: "Unambiguous leader, says what they mean clearly.", suggestion: "Temper directness with kindness and respect. Ensure understanding." },
    5: { paraphrase: "Master of clear, precise, and effective communication.", suggestion: "Explore nuances of tone, body language, and non-verbal assertiveness." }
  },
  'nurturer': {
    1: { paraphrase: "Focuses more on tasks/actions than emotions.", suggestion: "Practice active listening and asking open-ended questions about feelings." },
    2: { paraphrase: "Trying to be supportive, sometimes unsure how.", suggestion: "Learn about different comfort techniques and aftercare practices. Ask what your partner needs." },
    3: { paraphrase: "Provides good comfort, validation, and emotional support.", suggestion: "Explore anticipating emotional needs. Deepen your understanding of empathy." },
    4: { paraphrase: "Acts as a reliable emotional rock, providing deep security.", suggestion: "Refine your ability to create a safe space for vulnerability. Offer reassurance proactively." },
    5: { paraphrase: "Intuitively understands and meets emotional needs with grace.", suggestion: "Maintain strong self-care boundaries to avoid emotional burnout. Model healthy emotional expression." }
  },
  'strict': {
    1: { paraphrase: "Prefers flexibility, avoids rigid rules.", suggestion: "Explore if structured guidance (not necessarily strictness) appeals. Focus on clear expectations instead." },
    2: { paraphrase: "Sets some rules, but enforcement may be inconsistent.", suggestion: "Define rules clearly beforehand. Practice consistent, fair follow-through." },
    3: { paraphrase: "Enforces rules consistently and fairly.", suggestion: "Ensure rules serve a purpose (safety, training, dynamic). Balance discipline with positive reinforcement." },
    4: { paraphrase: "Maintains high standards, expects adherence.", suggestion: "Communicate the 'why' behind rules. Ensure consequences are proportionate and understood." },
    5: { paraphrase: "Master of structure; absolute adherence expected.", suggestion: "Ensure the dynamic remains consensual and respectful despite high structure. Check in regularly." }
  },
  'master': {
    1: { paraphrase: "Prefers partnership, less drawn to deep authority.", suggestion: "Explore leadership roles that feel collaborative rather than hierarchical." },
    2: { paraphrase: "Comfortable leading scenes, less focused on ownership.", suggestion: "Define what level of authority feels right. Communicate expectations clearly." },
    3: { paraphrase: "Authoritative presence, sets clear standards.", suggestion: "Explore the responsibilities that come with a Master/slave dynamic. Build profound trust." },
    4: { paraphrase: "Commands with high expectations and strong presence.", suggestion: "Deepen understanding of your slave's needs/limits. Refine communication of complex expectations." },
    5: { paraphrase: "Radiates palpable power; guides with total responsibility.", suggestion: "Ensure ethical considerations and ongoing consent are paramount in deep power exchange." }
  },
  'mistress': {
    1: { paraphrase: "Prefers casual interaction over elegant command.", suggestion: "Focus on authenticity; your style doesn't need to fit a specific mold." },
    2: { paraphrase: "Developing a commanding aura, exploring creative ideas.", suggestion: "Practice projecting confidence. Experiment with small creative twists in scenes." },
    3: { paraphrase: "Leads with natural grace and clear expectations.", suggestion: "Refine your unique blend of sensuality and control. Explore more elaborate scenarios." },
    4: { paraphrase: "Effortless command, captivating presence, high standards.", suggestion: "Challenge yourself with creative scene design. Ensure expectations are demanding but achievable." },
    5: { paraphrase: "Regal presence, inspires devotion with creative command.", suggestion: "Balance power with responsibility. Consider the impact of your captivating presence." }
  },
  'daddy': {
    1: { paraphrase: "Prefers peer interaction over caregiving roles.", suggestion: "Focus on dynamics based on equality or different forms of leadership." },
    2: { paraphrase: "Offers practical advice, less focused on nurturing.", suggestion: "Practice expressing affection and praise more openly. Ask about emotional needs." },
    3: { paraphrase: "Provides protective guidance and affectionate discipline.", suggestion: "Balance firmness with warmth consistently. Communicate rules and expectations clearly." },
    4: { paraphrase: "Acts as a safe harbor, blending stern rules & warm hugs.", suggestion: "Deepen understanding of your little's specific needs and triggers. Refine aftercare." },
    5: { paraphrase: "Perfect blend of loving protector and firm authority figure.", suggestion: "Ensure long-term well-being and growth within the dynamic. Model healthy boundaries." }
  },
  'mommy': {
    1: { paraphrase: "Practical approach, less naturally nurturing.", suggestion: "Focus on expressing care through reliable actions if nurturing feels less natural." },
    2: { paraphrase: "Can be comforting, learning gentle discipline.", suggestion: "Practice active listening and offering reassurance. Explore positive reinforcement techniques." },
    3: { paraphrase: "Instinctively offers comfort and gentle guidance.", suggestion: "Refine your understanding of child development concepts (if applicable to dynamic). Balance care with rules." },
    4: { paraphrase: "Acts as a safe haven, providing deep comfort and gentle structure.", suggestion: "Anticipate needs for soothing and reassurance. Practice patience during learning." },
    5: { paraphrase: "Ultimate nurturing figure, endless warmth and gentle wisdom.", suggestion: "Maintain self-care boundaries. Ensure communication remains open even in a nurturing role." }
  },
  'owner': {
    1: { paraphrase: "Values partner's autonomy, dislikes possessiveness.", suggestion: "Explore dynamics based on partnership or guidance rather than ownership." },
    2: { paraphrase: "Feels connection, enjoys some control but less 'ownership'.", suggestion: "Define the specific aspects of control you enjoy. Use terms other than 'owner' if preferred." },
    3: { paraphrase: "Comfortable sense of responsibility and 'mine'.", suggestion: "Establish clear rules and expectations for your 'property'. Practice consistent training/guidance." },
    4: { paraphrase: "Strong possessive pride, enjoys training and control.", suggestion: "Refine training methods. Ensure care and well-being are prioritized alongside control." },
    5: { paraphrase: "Absolute possession; finds deep fulfillment in ownership/care.", suggestion: "Requires profound trust and communication. Ensure ethical framework and ongoing consent." }
  },
  'rigger': {
    1: { paraphrase: "Struggles with knots, focus is elsewhere.", suggestion: "Practice basic, safe knots if interested. Focus on non-rope forms of play otherwise." },
    2: { paraphrase: "Learning basic ties, focusing on function over form.", suggestion: "Prioritize safety education (nerves, circulation). Practice simple, secure ties." },
    3: { paraphrase: "Comfortable with several functional and pretty ties.", suggestion: "Explore more complex patterns. Pay attention to rope tension and placement." },
    4: { paraphrase: "Skilled rope artist, enjoys creating complex patterns.", suggestion: "Refine aesthetic vision. Learn about different rope materials and styles." },
    5: { paraphrase: "Rope Master! Creates intricate, safe suspension/kinbaku.", suggestion: "Continuously update safety knowledge. Consider teaching or mentoring others." }
  },
  'sadist': {
    1: { paraphrase: "Avoids causing pain, prefers purely gentle interactions.", suggestion: "Focus on pleasure from non-painful sources. This style may not be for you." },
    2: { paraphrase: "Enjoys teasing edge, light sensation play.", suggestion: "Explore tools and techniques for controlled, mild intensity. Practice reading reactions closely." },
    3: { paraphrase: "Likes controlled infliction, enjoys partner's reactions.", suggestion: "Refine your ability to gauge limits. Develop a range of intensity levels." },
    4: { paraphrase: "Finds pleasure in skillfully playing with partner's limits.", suggestion: "Master sensation control and timing. Prioritize explicit negotiation and aftercare." },
    5: { paraphrase: "Deep enjoyment from orchestrating consensual sadism.", suggestion: "Requires exceptional skill, communication, and ethical responsibility. Focus on partner's holistic experience." }
  },
  'hunter': {
    1: { paraphrase: "Prefers partner comes willingly, dislikes chasing.", suggestion: "Explore dynamics based on invitation and clear command rather than pursuit." },
    2: { paraphrase: "Enjoys playful, short pursuits; less focus on instinct.", suggestion: "Keep chase scenes light and clearly defined. Focus on the fun aspect." },
    3: { paraphrase: "Thrill of the chase is exciting; enjoys tracking/capture.", suggestion: "Develop strategies for the 'hunt'. Communicate clearly about the game's rules." },
    4: { paraphrase: "Born predator! Loves the hunt and relying on instinct.", suggestion: "Refine your ability to read the environment and your prey. Balance instinct with safety." },
    5: { paraphrase: "The hunt is everything! Primal drive to pursue and capture.", suggestion: "Ensure robust safety protocols and clear safewords for intense pursuit scenes. Manage adrenaline." }
  },
  'trainer': {
    1: { paraphrase: "Prefers partner learns independently.", suggestion: "Focus on leadership styles that empower autonomy rather than direct training." },
    2: { paraphrase: "Offers some guidance, but lacks structured methodology.", suggestion: "Break down desired skills/behaviors into smaller steps. Practice giving clear feedback." },
    3: { paraphrase: "Enjoys helping partner grow using clear steps/feedback.", suggestion: "Develop systematic training plans. Utilize positive reinforcement effectively." },
    4: { paraphrase: "Dedicated trainer, loves teaching and shaping behavior.", suggestion: "Refine your specific training techniques. Adapt methods to your partner's learning style." },
    5: { paraphrase: "Master coach, passionate about unlocking potential.", suggestion: "Ensure training goals are collaborative and consensual. Celebrate successes consistently." }
  },
  'puppeteer': {
    1: { paraphrase: "Prefers partner moves independently.", suggestion: "Explore dynamics based on verbal commands or shared action rather than direct manipulation." },
    2: { paraphrase: "Working on precision, sometimes clumsy with fine control.", suggestion: "Practice small, precise movements. Communicate clearly about intended actions." },
    3: { paraphrase: "Enjoys guiding partner's movements precisely.", suggestion: "Explore creative sequences of directed movement. Pay attention to flow and aesthetics." },
    4: { paraphrase: "Master manipulator! Controls partner like extension of self.", suggestion: "Refine non-verbal cues. Ensure partner comfort during intricate control." },
    5: { paraphrase: "Finds deep satisfaction in absolute micro-control.", suggestion: "Requires extreme focus and partner responsiveness. Prioritize safety and communication." }
  },
  'protector': {
    1: { paraphrase: "Hands-off, assumes partner manages own safety.", suggestion: "Practice proactive safety checks if engaging in risky play, even if not naturally protective." },
    2: { paraphrase: "Steps in if situation becomes serious, less vigilant.", suggestion: "Develop heightened awareness of potential risks. Communicate protective instincts if they arise." },
    3: { paraphrase: "Actively watchful, feels responsible for partner's safety.", suggestion: "Balance vigilance with allowing partner appropriate autonomy. Build trust through reliability." },
    4: { paraphrase: "Fiercely protective, shields partner instinctively.", suggestion: "Communicate boundaries clearly to potential threats (if applicable). Ensure partner feels safe, not smothered." },
    5: { paraphrase: "Unbreakable shield! Hyper-aware and instantly defensive.", suggestion: "Temper protective instincts with rational assessment. Ensure actions are proportional and necessary." }
  },
  'disciplinarian': {
    1: { paraphrase: "Avoids confrontation and punishment.", suggestion: "Focus on positive reinforcement and clear expectations rather than corrective measures." },
    2: { paraphrase: "Hesitant or inconsistent with consequences.", suggestion: "Ensure consequences are pre-negotiated and fair. Practice calm, objective delivery." },
    3: { paraphrase: "Delivers agreed consequences fairly and firmly.", suggestion: "Focus on the lesson or behavior change desired. Ensure clarity and understanding." },
    4: { paraphrase: "Decisive and effective in administering correction.", suggestion: "Refine your ability to remain detached and objective during discipline. Ensure proportionality." },
    5: { paraphrase: "Master of measured, impactful consequences for growth/order.", suggestion: "Requires strong ethics and communication. Ensure dynamic remains respectful and focused on goals." }
  },
  'caretaker': {
    1: { paraphrase: "Focuses elsewhere, assumes partner handles own needs.", suggestion: "Practice checking in on basic needs (hydration, comfort) during interactions." },
    2: { paraphrase: "Checks basic safety/comfort, less focus on holistic needs.", suggestion: "Expand awareness to include emotional well-being and general happiness." },
    3: { paraphrase: "Attentive to overall physical/emotional state.", suggestion: "Explore anticipating needs. Set gentle rules aimed at well-being (e.g., bedtime, hydration)." },
    4: { paraphrase: "Provides total care package, anticipates needs lovingly.", suggestion: "Refine specific caregiving skills. Balance nurturing with fostering appropriate independence." },
    5: { paraphrase: "Guardian of partner's complete well-being.", suggestion: "Requires deep commitment and understanding. Maintain self-care to sustain caregiving capacity." }
  },
  'sir': {
    1: { paraphrase: "Prefers casual interactions, dislikes formality.", suggestion: "Embrace your authentic interaction style; formality isn't required for dominance." },
    2: { paraphrase: "Can be formal when needed, but prefers relaxed.", suggestion: "Use formality selectively for specific scenes or effects if desired." },
    3: { paraphrase: "Maintains respectful, formal tone naturally.", suggestion: "Explore different protocols or forms of address that enhance the dynamic." },
    4: { paraphrase: "Calm, dignified, formal presence; expects proper service.", suggestion: "Clearly communicate expectations regarding etiquette and service." },
    5: { paraphrase: "Epitome of formal, respected authority.", suggestion: "Lead by example with honor and integrity. Ensure respect flows both ways." }
  },
  'goddess': {
    1: { paraphrase: "Feels uncomfortable being elevated or worshipped.", suggestion: "Focus on partnership dynamics or other forms of authority expression." },
    2: { paraphrase: "A little adoration is nice, but feels awkward demanding it.", suggestion: "Allow appreciation to be offered freely. Explore commanding respect in other ways." },
    3: { paraphrase: "Being adored feels wonderful and natural.", suggestion: "Communicate desires for specific acts of reverence or devotion." },
    4: { paraphrase: "Basks in glory, enjoys being worshipped effortlessly.", suggestion: "Refine your commanding presence. Set high standards worthy of adoration." },
    5: { paraphrase: "Embodies divinity; expects and demands reverence.", suggestion: "Balance receiving worship with acknowledging the devotee's efforts and well-being." }
  },
  'commander': {
    1: { paraphrase: "Prefers spontaneous interaction over planning.", suggestion: "Focus on reactive leadership or styles that embrace improvisation." },
    2: { paraphrase: "Has a general idea, but adapts on the fly.", suggestion: "Practice outlining simple scene structures or goals beforehand." },
    3: { paraphrase: "Sets clear objectives and orders for scenes.", suggestion: "Refine your ability to communicate strategic direction clearly and concisely." },
    4: { paraphrase: "Master strategist! Plans complex scenarios effectively.", suggestion: "Explore multi-stage scenes or long-term strategic dynamics. Ensure flexibility." },
    5: { paraphrase: "Flawless command/control through detailed planning/execution.", suggestion: "Requires meticulous attention to detail and partner communication. Ensure plans remain adaptable." }
  },

   // Switch Styles (Reusing the detailed text from subStyleSuggestions for consistency)
   'fluid switch': {
    1: { paraphrase: "Exploring roles", suggestion: "Focus on communication during shifts." },
    2: { paraphrase: "Comfortable shifting", suggestion: "Identify what triggers your desire to switch." },
    3: { paraphrase: "Adapting readily", suggestion: "Refine non-verbal cues for smoother transitions." },
    4: { paraphrase: "Seamlessly versatile", suggestion: "Explore the nuances of both dominance and submission." },
    5: { paraphrase: "Master of flow", suggestion: "Consider how your energy influences the dynamic." }
   },
   'dominant-leaning switch': {
    1: { paraphrase: "Primarily dominant, exploring sub", suggestion: "Identify what aspects of submission appeal to you." },
    2: { paraphrase: "Comfortable leading, trying sub", suggestion: "Practice vulnerability in small, safe steps." },
    3: { paraphrase: "Balances leading with yielding", suggestion: "Explore the interplay between your dominant and submissive sides." },
    4: { paraphrase: "Strong leader, enjoys submissive play", suggestion: "How does yielding enhance your understanding of dominance?" },
    5: { paraphrase: "Fluent in both, prefers leading", suggestion: "Mentor others on the flexibility of switching." }
   },
   'submissive-leaning switch': {
    1: { paraphrase: "Primarily submissive, exploring dom", suggestion: "Identify what aspects of dominance appeal to you." },
    2: { paraphrase: "Comfortable yielding, trying dom", suggestion: "Practice taking initiative in small, low-stakes ways." },
    3: { paraphrase: "Balances yielding with leading", suggestion: "Explore the interplay between your submissive and dominant sides." },
    4: { paraphrase: "Enjoys submission, confident leading", suggestion: "How does leading enhance your understanding of submission?" },
    5: { paraphrase: "Fluent in both, prefers yielding", suggestion: "Share insights on the beauty of adaptability." }
   },
   'situational switch': {
     1: { paraphrase: "Role depends on context", suggestion: "Identify what factors influence your role preference." },
     2: { paraphrase: "Adapting to partner/mood", suggestion: "Practice clear communication about your current desires." },
     3: { paraphrase: "Flexible role player", suggestion: "Explore how different partners bring out different sides." },
     4: { paraphrase: "Highly adaptable to dynamics", suggestion: "Consider what core needs are met regardless of role." },
     5: { paraphrase: "Chameleon of dynamics", suggestion: "Reflect on the freedom and challenges of situational switching." }
   },
};
// === END OF domStyleSuggestions ===


// --- Style Finder Specific Data ---

// Style categories (Used for populating SF results)
export const sfStyles = {
  submissive: [
    // Intentionally using the names as defined in bdsmData.submissive.styles
    // This list could be generated dynamically, but hardcoding ensures order/inclusion if needed.
    "Classic Submissive 🙇‍♀️", "Brat 😈", "Slave 🔗", "Pet 🐾", "Little 🍼", "Puppy 🐶", "Kitten 🐱", "Princess 👑", "Rope Bunny 🪢",
    "Masochist 💥", "Prey 🏃‍♀️", "Toy 🎲", "Doll 🎎", "Bunny 🐰", "Servant 🧹", "Playmate 🎉", "Babygirl 🌸", "Captive ⛓️", "Thrall 🛐",
    "Puppet 🎭", "Maid 🧼", "Painslut 🔥", "Bottom ⬇️"
    // Note: Switch styles are not typically listed here as primary submissive results from SF
  ],
  dominant: [
    "Classic Dominant 👑", "Assertive 💪", "Nurturer 🤗", "Strict 📏", "Master 🎓", "Mistress 👸", "Daddy 👨‍🏫", "Mommy 👩‍🏫", "Owner 🔑", "Rigger 🧵",
    "Sadist 😏", "Hunter 🏹", "Trainer 🏋️‍♂️", "Puppeteer 🕹️", "Protector 🛡️", "Disciplinarian ✋", "Caretaker 🧡", "Sir 🎩", "Goddess 🌟", "Commander ⚔️"
     // Note: Switch styles are not typically listed here as primary dominant results from SF
  ]
};

// Submissive traits for Style Finder (Descriptions may differ slightly from core traits for simplicity/focus)
export const sfSubFinderTraits = [
  { name: 'obedience', desc: 'How much do you enjoy following instructions or rules given by someone you trust?' },
  { name: 'rebellion', desc: 'Do you find it fun to playfully resist or tease when someone tries to guide you?' },
  { name: 'service', desc: 'Does it feel rewarding to assist or do tasks that make someone else happy?' },
  { name: 'playfulness', desc: 'How much do you love engaging in silly games or lighthearted mischief?' },
  { name: 'sensuality', desc: 'Do soft touches, textures, or physical sensations light up your senses?' },
  { name: 'exploration', desc: 'Are you excited by the idea of trying new experiences or stepping into the unknown?' },
  { name: "devotion", desc: "How deeply committed and focused on a partner do you feel?" },
  { name: "innocence", desc: "Do you enjoy feeling carefree, pure, or even a bit naive in play?" },
  { name: 'mischief', desc: 'How much do you like stirring things up with a cheeky prank or playful trouble?' },
  { name: 'affection seeking', desc: "How much do you crave praise, cuddles, or validation?" }, // Renamed for SF clarity
  { name: 'pain interpretation', desc: 'Does a little sting or discomfort excite you, or do you prefer to avoid it?' }, // Renamed
  { name: 'surrender', desc: 'How much do you enjoy letting go completely and giving someone else control?' }, // Renamed
  { name: 'need for guidance', desc: 'Do you feel comforted and secure when someone else provides structure?' }, // Renamed
  { name: 'vulnerability', desc: 'Does opening up emotionally and being exposed feel natural or appealing?' },
  { name: 'adaptability', desc: 'How easily can you switch between different roles or adjust to new expectations?' },
  { name: 'aesthetic focus', desc: "Is looking a certain way (e.g., perfect, cute, specific attire) important to your role?" }, // Renamed
  { name: 'politeness', desc: 'Does being courteous and respectful in your actions come naturally?' },
  { name: 'craving', desc: 'Do you actively seek out intense sensations or experiences that push your limits?' },
  { name: 'receptiveness', desc: 'How open are you to receiving direction, sensations, or guidance from someone else?' },
  { name: 'patience during tying', desc: "Can you stay still and calm while being tied or restrained?" }, // Specific to Rope Bunny
  { name: 'enjoyment of chase', desc: "Is the thrill of being pursued exciting?" }, // Specific to Prey
  { name: 'objectification comfort', desc: "Do you enjoy being treated like a valued object or plaything?" }, // Specific to Toy/Doll
];

// Submissive trait footnotes for Style Finder
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
  'affection seeking': "1: Indifferent / 10: Craves affection",
  'pain interpretation': "1: Avoids pain / 10: Enjoys intensity",
  surrender: "1: Resists control / 10: Total surrender",
  'need for guidance': "1: Self-reliant / 10: Loves guidance",
  vulnerability: "1: Guarded / 10: Fully open",
  adaptability: "1: Fixed role / 10: Very versatile",
  'aesthetic focus': "1: Looks don't matter / 10: Perfection is key",
  politeness: "1: Casual and blunt / 10: Always courteous",
  craving: "1: Avoids intensity / 10: Seeks extreme thrills",
  receptiveness: "1: Closed off / 10: Fully open to input",
  'patience during tying': "1: Very fidgety / 10: Zen stillness",
  'enjoyment of chase': "1: Dislikes pursuit / 10: Loves the chase",
  'objectification comfort': "1: Feels dehumanizing / 10: Enjoys being an object",
};

// Dominant traits for Style Finder
export const sfDomFinderTraits = [
  { name: 'authority', desc: 'How strongly do you feel the urge to take charge and lead?' },
  { name: 'confidence', desc: 'How sure are you of your decisions and ability to guide?' },
  { name: 'discipline focus', desc: 'Do you enjoy setting firm rules and seeing them followed?' }, // Renamed
  { name: 'boldness', desc: 'Do you dive into challenges or direct actions fearlessly?' },
  { name: 'care', desc: 'How important is actively supporting and protecting your partner?' },
  { name: 'empathy', desc: 'How easily do you tune into and understand your partner’s feelings?' },
  { name: 'control', desc: 'Do you thrive on directing the details and flow of interaction?' },
  { name: 'creativity', desc: 'Do you enjoy crafting unique scenarios or challenges?' },
  { name: 'precision', desc: 'How important is it for your actions and commands to be exact?' },
  { name: 'intensity', desc: 'Do you bring a fierce, focused energy to your role?' },
  { name: 'sadism', desc: 'Does skillfully giving sensation (including pain) excite you?' },
  { name: 'leadership', desc: 'Do you naturally guide others and take responsibility?' },
  { name: 'possessiveness', desc: 'Do you feel a strong sense of pride or ownership towards your partner?' }, // Renamed
  { name: 'patience', desc: 'Are you calm and steady while teaching, training, or waiting?' },
  { name: 'dominanceDepth', desc: 'How much overall power or influence do you desire in a dynamic?' },
  { name: 'aesthetic vision', desc: "Is creating a specific look or visual scene important?" }, // Specific to Rigger
  { name: 'pursuit drive', desc: "Do you enjoy the thrill of chasing or capturing?" }, // Specific to Hunter
];

// Dominant trait footnotes for Style Finder
export const sfDomTraitFootnotes = {
  authority: "1: Gentle suggester / 10: Commanding presence",
  confidence: "1: Hesitant / 10: Unshakeable",
  'discipline focus': "1: Relaxed / 10: Strict enforcer",
  boldness: "1: Cautious / 10: Fearless initiator",
  care: "1: Detached / 10: Deeply caring guardian",
  empathy: "1: Observes actions / 10: Feels emotions deeply",
  control: "1: Hands-off / 10: Total orchestration",
  creativity: "1: Routine-based / 10: Highly imaginative",
  precision: "1: Casual / 10: Meticulously detailed",
  intensity: "1: Soft presence / 10: Intense focus",
  sadism: "1: Avoids causing pain / 10: Enjoys controlled infliction",
  leadership: "1: Follower / 10: Natural leader",
  possessiveness: "1: Encourages autonomy / 10: Strong sense of 'mine'",
  patience: "1: Impatient / 10: Endlessly patient",
  dominanceDepth: "1: Light influence / 10: Craves total power",
  'aesthetic vision': "1: Function over form / 10: Visuals are key",
  'pursuit drive': "1: Prefers waiting / 10: Loves the hunt",
};

// Slider descriptions for each trait (Using modified names where applicable)
export const sfSliderDescriptions = {
  // Submissive
  obedience: [ "You dodge orders like a breeze!", "Rules? You’re too free for that!", "You’ll follow if it’s fun!", "A little “yes” slips out sometimes!", "You’re cool with gentle guidance!", "Following feels kinda nice!", "You like pleasing when asked!", "Obeying’s your quiet joy!", "You love a sweet “please”!", "You glow when you say “yes”!" ],
  rebellion: [ "You’re too sweet to say no!", "A tiny “nah” sneaks out!", "You nudge rules with a smile!", "Teasing’s your little game!", "Half yes, half no—cute!", "You push back with charm!", "Defiance is your sparkle!", "You love a playful “no”!", "Rebel vibes all the way!", "You’re a cheeky star!" ],
  service: [ "Helping? You’re too chill!", "A quick favor’s enough!", "You help if they’re sweet!", "You pitch in when it’s easy!", "Serving’s okay sometimes!", "You like making them smile!", "Helping’s your happy place!", "You love a kind task!", "You’re a service sweetie!", "Caring’s your superpower!" ],
  playfulness: [ "Serious is your vibe!", "A giggle slips out!", "You play if it’s light!", "Half serious, half silly!", "You’re warming up to fun!", "Playtime’s your joy!", "You bounce with glee!", "Silly’s your middle name!", "You’re a playful whirlwind!", "Games are your world!" ],
  sensuality: [ "Touch? Not your thing!", "A soft pat’s okay!", "You like a little feel!", "Textures are kinda neat!", "You’re into soft vibes!", "Silk makes you happy!", "You love a sensory tickle!", "Touch is your bliss!", "You’re all about feels!", "Sensory queen!" ],
  exploration: [ "Safe is your spot!", "A tiny step out—shy!", "You peek at new stuff!", "You’ll try if it’s safe!", "Half cozy, half curious!", "New things excite you!", "You chase the unknown!", "Adventure’s your jam!", "You’re a bold explorer!", "Nothing stops you!" ],
  devotion: [ "Free and solo!", "A bit of heart shows!", "You care if they’re near!", "Half free, half true!", "You’re warming up!", "Devotion’s your glow!", "You’re all in soft!", "Loyalty’s your core!", "You’re a devotion gem!", "Total soulmate!" ],
  innocence: [ "Wise beyond your years!", "A bit of wonder peeks out!", "You’re half grown, half kid!", "Silly feels nice sometimes!", "You’re dipping into cute!", "Innocence is your vibe!", "You’re a sweet dreamer!", "Giggles are your song!", "You’re pure sunshine!", "Total kid at heart!" ],
  mischief: [ "Too good for tricks!", "A tiny prank slips!", "You stir if it’s safe!", "Half calm, half cheeky!", "You’re a sneaky spark!", "Mischief’s your game!", "You love a little chaos!", "Trouble’s your friend!", "You’re a mischief pro!", "Chaos queen!" ],
  'affection seeking': [ "Alone time is fine!", "A little praise is nice.", "Likes gentle attention.", "Warm fuzzies are good!", "Craving some cuddles!", "Loves being adored!", "Needs lots of pets!", "Validation feels amazing!", "Must have affection!", "Total affection magnet!" ],
  'pain interpretation': [ "Ouch! Prefer gentle.", "A little sting is okay.", "Can handle moderate spice.", "Intensity feels interesting.", "Bring on the challenge!", "Thriving on the edge.", "Pushing my limits!", "Pain can be pleasure.", "Craving strong sensations!", "Almost limitless tolerance!" ], // Combined painTolerance + interpretation
  surrender: [ "My control feels best!", "Reluctant to yield.", "Yielding sometimes okay.", "Letting go is tricky.", "Can surrender in scenes.", "Trusting feels freeing.", "Enjoy deep surrender.", "Love giving up control.", "Craving total release.", "Surrender is bliss!" ], // Used surrender instead of submissionDepth
  'need for guidance': [ "I pave my own path!", "Dislike being told what to do.", "Rules feel restricting.", "Guidance okay sometimes.", "Structure feels nice.", "Like clear direction.", "Thrive with rules.", "Guidance is comforting.", "Love being guided.", "Relying feels safe!" ], // Used need for guidance instead of dependence
  vulnerability: [ "Walls up high!", "A peek slips out!", "You share if safe!", "Half guarded, half open!", "You’re softening up!", "Open’s your vibe!", "You bare it soft!", "Heart’s wide open!", "You’re a trust gem!", "Total soul sharer!" ],
  adaptability: [ "One way—you’re set!", "A tiny switch is fine!", "You bend a little!", "Half fixed, half fluid!", "You’re okay with change!", "Switching’s easy!", "You roll with it!", "Flex is your strength!", "You flip like a pro!", "Total chameleon!" ],
  'aesthetic focus': [ "Comfort over style!", "Looks are secondary.", "Neatness is nice.", "Enjoy looking the part.", "Crafting the look is fun.", "Presentation matters.", "Strive for perfection.", "Love the aesthetic role.", "Visuals are crucial.", "Must look perfect!" ], // Used aesthetic focus instead of tidiness for broader scope
  politeness: [ "You’re blunt and bold!", "A bit gruff but sweet!", "Polite if it’s easy!", "You’re nice when needed!", "Courtesy’s your thing!", "You’re a polite gem!", "Manners shine bright!", "Respect is your core!", "You’re super courteous!", "Politeness queen!" ],
  craving: [ "Calm is your zone!", "A tiny thrill is enough!", "You dip into intensity!", "Half chill, half wild!", "You like a strong spark!", "Intensity calls you!", "You chase the edge!", "Thrills are your fuel!", "You crave the extreme!", "Limitless seeker!" ],
  receptiveness: [ "You’re your own guide!", "A bit open if safe!", "You listen if it’s clear!", "Half closed, half open!", "You’re warming up!", "Openness feels right!", "You take it all in!", "Guidance is welcome!", "You’re a receiver pro!", "Totally in tune!" ],
   'patience during tying': ["Fidgety!", "Briefly still.", "Okay patience.", "Getting calmer.", "Enjoying the process.", "Finding zen.", "Very patient.", "Stillness is easy.", "Love the slowness.", "Perfectly still."],
   'enjoyment of chase': ["Dislike pursuit!", "Short chase okay.", "Mildly exciting.", "Getting thrilling.", "Enjoy the adrenaline.", "Love being hunted.", "Thrive on the chase.", "Exhilarating!", "Chase is the best part!", "Pure chase ecstasy!"],
   'objectification comfort': ["Feels bad.", "Tolerate briefly.", "Okay sometimes.", "Fun roleplay.", "Enjoy being a plaything.", "Love being admired.", "Prized possession.", "Find fulfillment in it.", "Deeply enjoy object role.", "My purpose!"],

  // Dominant
  authority: [ "Soft and shy!", "A little lead peeks!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Authority’s your vibe!", "You lead with ease!", "You’re a strong guide!", "Boss mode on!", "Total commander!" ],
  confidence: [ "Quiet and unsure!", "A bit of bold shows!", "You’re sure if it’s easy!", "Half shy, half steady!", "You’re growing bold!", "Confidence shines!", "You trust your gut!", "You’re rock solid!", "Bold and bright!", "Total powerhouse!" ],
  'discipline focus': [ "All carrots, no sticks!", "Rarely correct.", "Gentle guidance.", "Rules feel good.", "Fair correction.", "Discipline teaches.", "Firm but fair.", "Consequences are key.", "Strict enforcement.", "Master disciplinarian!" ], // Used discipline focus
  boldness: [ "Careful and calm!", "A risk peeks out!", "You leap if safe!", "Half shy, half daring!", "You’re getting brave!", "Boldness is you!", "You dive right in!", "Fearless vibes!", "You’re a bold star!", "Total daredevil!" ],
  care: [ "Cool and aloof!", "A care slips out!", "You help if asked!", "Half chill, half warm!", "You’re a soft guide!", "Nurturing’s your glow!", "You protect with love!", "Care is your core!", "You’re a warm star!", "Total nurturer!" ],
  empathy: [ "Distant and chill!", "A feel peeks out!", "You get it if clear!", "Half aloof, half tuned!", "You’re sensing more!", "Empathy’s your gift!", "You feel it all!", "You’re in sync!", "You’re a heart reader!", "Total intuitive!" ],
  control: [ "Hands-off feels right.", "Suggesting is fine.", "Guiding the flow.", "Like directing details.", "Enjoy orchestration.", "Precise scene control.", "Need full command.", "Every detail is mine.", "Total control feels best.", "Absolute micro-manager!" ],
  creativity: [ "Simple’s your way!", "A spark pops up!", "You craft if quick!", "Half plain, half wild!", "You’re sparking up!", "Creativity flows!", "You make magic!", "Ideas are your joy!", "You’re a vision star!", "Total creator!" ],
  precision: [ "Loose and free!", "A bit neat’s fine!", "You care if fast!", "Half sloppy, half sharp!", "You’re getting exact!", "Precision’s your thing!", "You nail it all!", "Every step’s perfect!", "You’re a detail whiz!", "Total master!" ],
  intensity: [ "Soft and mellow!", "A flare sneaks out!", "You heat if safe!", "Half calm, half fierce!", "You’re turning up!", "Intensity’s your spark!", "You bring the blaze!", "Fierce is your vibe!", "You’re a fire star!", "Total storm!" ],
  sadism: [ "Soft and sweet!", "A tease slips in!", "You push a little!", "Half gentle, half wild!", "You’re testing it!", "Sensation's your play!", "You love the reactions!", "Thrill’s your game!", "You’re a spicy star!", "Total edge master!" ], // Adjusted wording slightly
  leadership: [ "Soft and shy!", "A lead peeks out!", "You guide if asked!", "Half gentle, half firm!", "You’re stepping up!", "Leading’s your vibe!", "You steer with ease!", "You’re a bold guide!", "Leader mode on!", "Total captain!" ],
  possessiveness: [ "Free and open!", "A claim slips out!", "You hold if sweet!", "Half share, half mine!", "You’re liking it!", "Possession’s your vibe!", "You claim with pride!", "Yours is yours!", "You’re a keeper!", "Total owner!" ], // Used possessiveness
  patience: [ "Fast and now!", "A wait slips in!", "You chill if quick!", "Half rush, half calm!", "You’re cooling down!", "Patience is you!", "You wait with grace!", "Calm’s your strength!", "You’re a zen star!", "Total peace!" ],
  dominanceDepth: [ "Light and free!", "A hold peeks out!", "You lead if easy!", "Half soft, half firm!", "You’re taking charge!", "Power’s your glow!", "You rule with ease!", "Control’s your core!", "You’re a power gem!", "Total ruler!" ],
  'aesthetic vision': ["Function first!", "Neatness bonus.", "Looks matter.", "Aim for beauty.", "Visuals important.", "Creating art!", "Focus on aesthetics.", "Scene is visual.", "Master artist.", "Perfect vision!"],
  'pursuit drive': ["Prey comes to me.", "Short chase okay.", "Enjoy pursuit.", "Thrill of the hunt!", "Adrenaline rush.", "Love the chase!", "Instinct takes over.", "Born predator!", "Hunt is primal.", "Must capture!"],
};

// Trait explanations for Style Finder info popups (Reflects any renames)
export const sfTraitExplanations = {
  obedience: "This explores how much you enjoy following instructions or rules. Do you feel calm and happy when told what to do, or prefer your own thing?",
  rebellion: "How much do you like to playfully resist or tease when given orders? Do you enjoy back-and-forth banter or testing boundaries?",
  service: "How much joy do you get from helping others or performing tasks for them? Do acts like fetching, cleaning, or assisting feel rewarding?",
  playfulness: "How much do you love silly, lighthearted fun? Are you generally serious, or do games, teasing, and giggles light you up?",
  sensuality: "How tuned in are you to physical sensations like soft touches, different textures, warmth, or gentle pressure? Do you actively seek them out?",
  exploration: "How eager are you to try new things, step into the unknown, or experiment with different roles or sensations?",
  devotion: "This reflects your level of loyalty, commitment, and focus on a partner within a dynamic. Is deep connection and dedication important to you?",
  innocence: "Do you enjoy embodying or feeling a sense of purity, naivety, or childlike wonder? Is being carefree or protected appealing?",
  mischief: "How much do you enjoy stirring things up, playing harmless pranks, or being playfully disruptive?",
  'affection seeking': "How strongly do you desire praise, physical closeness (like hugs or petting), or verbal validation from a partner?",
  'pain interpretation': "How do you mentally process physical discomfort or pain? Is it purely negative, or can it be interesting, focusing, or even pleasurable?",
  surrender: "How comfortable and fulfilled do you feel when willingly giving up control, autonomy, or decision-making power to a trusted partner?",
  'need for guidance': "Do you find comfort, safety, or ease when a partner provides clear rules, structure, and direction?",
  vulnerability: "How willing and comfortable are you with showing emotional softness, openness, neediness, or perceived 'weakness' in a dynamic?",
  adaptability: "How easily can you shift between different roles (like Top/Bottom), moods, or types of play based on the situation or partner's energy?",
  'aesthetic focus': "How important is your appearance, attire, or posture in fulfilling your desired role? Do you enjoy crafting a specific look?",
  politeness: "How naturally inclined are you towards courteous, respectful, or formal manners in your interactions?",
  craving: "How strongly do you desire intense sensations, deep experiences, or activities that push your boundaries?",
  receptiveness: "How open are you to receiving input, direction, commands, sensations, or emotional connection from a partner?",
  'patience during tying': "How well can you remain still, calm, and patient for potentially extended periods while being tied or restrained?",
  'enjoyment of chase': "Do you find excitement, adrenaline, or pleasure in the dynamic of being pursued, hunted, or 'captured' in a scene?",
  'objectification comfort': "How comfortable or enjoyable is it for you to be treated as a valued object, plaything, or aesthetic piece by a partner?",

  // Dominant Explanations
  authority: "How natural does it feel for you to take charge, command respect, and make decisions within a dynamic?",
  confidence: "How self-assured are you in your ability to lead effectively, make good decisions, and handle situations that arise?",
  'discipline focus': "How much do you value using rules, structure, and consequences (positive or negative) to guide behavior or maintain order?",
  boldness: "How willing are you to act decisively, take calculated risks, or push boundaries fearlessly (within consent) to achieve your goals?",
  care: "How much attention do you pay to your partner's physical and emotional well-being, safety, comfort, and aftercare needs?",
  empathy: "How well can you understand, share, and respond appropriately to the feelings and emotional state of your partner?",
  control: "How strong is your desire to direct the scene, manage details, restrict actions, or influence the environment according to your vision?",
  creativity: "How much enjoyment and skill do you have in devising unique scenarios, tasks, challenges, or forms of play?",
  precision: "How important is careful accuracy and attention to detail when executing actions, commands, or techniques (like impact or rope)?",
  intensity: "Do you bring a powerful, focused, or commanding energy to your dominant role? How palpable is your presence?",
  sadism: "Do you find pleasure or excitement in skillfully and consensually inflicting physical or psychological stress, pain, or discomfort?",
  leadership: "How adept are you at guiding, directing, motivating, and taking responsibility for your partner and the dynamic's direction?",
  possessiveness: "How strongly do you feel a sense of ownership, pride, or protective responsibility towards your partner?",
  patience: "How well do you maintain calm, understanding, and support during teaching, training, challenges, or when things don't go as planned?",
  dominanceDepth: "What level of control or influence over your partner's life (from scene-specific to total) feels most satisfying or natural to you?",
  'aesthetic vision': "How much focus do you place on the visual beauty, patterns, or artistic expression created during a scene (e.g., with ropes, posing)?",
  'pursuit drive': "How strong is your desire or instinct to chase, track down, or 'capture' your partner, enjoying the process of the hunt?",
};


// Style descriptions with short, long, and tips (Ensure names match sfStyles lists)
export const sfStyleDescriptions = {
  // Submissive Styles
  "Classic Submissive 🙇‍♀️": { short: "Thrives on guidance, loves letting others lead.", long: "Finds joy in yielding, savoring peace from trust and structure. Embraces vulnerability, finding strength in surrender and pleasing their partner.", tips: ["Communicate limits clearly.", "Find a respectful partner who values your submission.", "Explore different levels and expressions of obedience."] },
  "Brat 😈": { short: "Cheeky, loves pushing buttons for fun!", long: "Delights in playful resistance, turning rules into a game of wit and charm. Finds excitement in testing boundaries and earning 'consequences'.", tips: ["Keep defiance playful, not genuinely disrespectful.", "Ensure your partner enjoys the chase/taming dynamic.", "Negotiate the types of defiance and consequences you both enjoy."] },
  "Slave 🔗": { short: "Fulfilled by total devotion & service.", long: "Finds deep meaning in unwavering loyalty, dedicated service, and profound surrender. Requires immense trust and clear communication.", tips: ["Negotiate boundaries and expectations meticulously.", "Ensure your partner understands and values deep devotion.", "Prioritize self-care alongside service."] },
  "Pet 🐾": { short: "Loves being cared for like a cherished companion.", long: "Revels in affection, play, and often embodies animal-like traits (purring, nuzzling, etc.). Values loyalty, fun, and clear guidance from an Owner/Handler.", tips: ["Choose a pet persona that resonates.", "Seek a caring Owner who enjoys pet dynamics.", "Communicate needs, even non-verbally."] },
  "Little 🍼": { short: "Embraces a carefree, childlike spirit.", long: "Finds joy and comfort in innocence, dependence, play, and structured care. Seeks nurturing, protection, and clear guidance from a Caregiver.", tips: ["Set clear boundaries around age range and activities.", "Find a trustworthy and nurturing Caregiver.", "Allow yourself to fully embrace playful regression."] },
  "Puppy 🐶": { short: "Playful, loyal, devoted pup.", long: "Exudes boundless energy, loves to please, and thrives on affection and training. Enjoys games, learning tricks, and devoted companionship.", tips: ["Embrace your enthusiastic energy.", "Seek a Trainer/Owner who enjoys structure and play.", "Communicate your needs for praise and activity."] },
  "Kitten 🐱": { short: "Curious, graceful (or clumsy!), affectionate cat.", long: "Blends curiosity with sensuality, enjoys playful pouncing, napping in sunbeams, and seeking affection on their own terms. Can be independent yet crave closeness.", tips: ["Play with your natural charm and curiosity.", "Find a patient Owner who appreciates feline antics.", "Explore sensory experiences like textures and warmth."] },
  "Princess 👑": { short: "Adores being pampered & center stage.", long: "Revels in being spoiled, admired, and treated as special. May enjoy delegation and expects high levels of care and attention.", tips: ["Communicate your desire for pampering clearly.", "Seek a doting partner who enjoys providing care.", "Balance receiving with showing appreciation."] },
  "Rope Bunny 🪢": { short: "Loves the art & feel of being bound.", long: "Finds excitement in the aesthetics and sensations of rope, the trust involved, and the vulnerability of restraint. Enjoys the process and the patterns.", tips: ["Prioritize learning about rope safety.", "Partner with a skilled and safety-conscious Rigger.", "Communicate about desired sensations and tie aesthetics."] },
  "Masochist 💥": { short: "Finds pleasure/release through pain.", long: "Experiences pain or intense sensation as pleasurable, focusing, or releasing. Often involves deep trust and clear communication about limits.", tips: ["Use safewords reliably.", "Find a caring Sadist who respects limits.", "Understand your own pain tolerance and types."] },
  "Prey 🏃‍♀️": { short: "Enjoys the thrill of being hunted.", long: "Thrives on the adrenaline and tension of being chased, stalked, or captured within a consensual dynamic. Values the excitement and surrender.", tips: ["Establish clear consent and safewords for chase scenes.", "Partner with a Hunter who enjoys the pursuit.", "Communicate boundaries around fear play."] },
  "Toy 🎲": { short: "Loves being used & played with.", long: "Delights in being an object for a partner's pleasure or use. Often adaptable and responsive to control, finding joy in fulfilling a purpose.", tips: ["Communicate preferences for how you like to be 'used'.", "Find a creative partner who respects your limits.", "Embrace the role while ensuring your well-being."] },
  "Doll 🎎": { short: "Enjoys being perfectly posed and admired.", long: "Finds fulfillment in being molded, dressed, and displayed like a beautiful object. Values aesthetics, stillness, and objectification comfort.", tips: ["Discuss desired aesthetics and poses.", "Seek a Puppeteer or admirer who appreciates the artistry.", "Practice stillness and enjoy the feeling of transformation."] },
  "Bunny 🐰": { short: "Gentle, shy, and easily startled.", long: "Characterized by shyness, skittishness, and a need for gentle affection. Finds comfort in quiet environments and soft approaches.", tips: ["Communicate your need for gentleness.", "Find a patient and calm partner.", "Allow yourself to feel safe and nurtured."] },
  "Servant 🧹": { short: "Finds joy in dutiful service.", long: "Dedicated to fulfilling tasks and anticipating needs with politeness and efficiency. Finds satisfaction in order, helpfulness, and pleasing their superior.", tips: ["Clarify expected duties and protocols.", "Seek a Master/Mistress who values good service.", "Balance service with personal needs and rest."] },
  "Playmate 🎉": { short: "Loves shared fun and adventure.", long: "Focuses on camaraderie, games, and lighthearted exploration with a partner. Enjoys teamwork and shared experiences.", tips: ["Keep interactions light and fun.", "Find a partner who also enjoys playful dynamics.", "Explore new activities and games together."] },
  "Babygirl 🌸": { short: "Craves nurturing, affection, guidance.", long: "Blends innocence with a desire for closeness and structure. Seeks a caring dynamic with a guiding figure who provides safety and affection.", tips: ["Communicate emotional needs and desires for guidance.", "Find a nurturing Daddy/Mommy figure.", "Embrace vulnerability within a trusting relationship."] },
  "Captive ⛓️": { short: "Relishes the thrill of capture/restraint.", long: "Enjoys the intensity of being consensually captured, bound, or held powerless. Finds excitement in the struggle, surrender, and trust involved.", tips: ["Negotiate scene details and limits clearly.", "Partner with a Hunter or Controller who understands your desires.", "Use safewords effectively during intense scenes."] },
  "Thrall 🛐": { short: "Bound by deep devotion/mental connection.", long: "Characterized by intense loyalty, mental focus, and dedication to a Dominant partner. Often involves suggestibility and a deep sense of connection.", tips: ["Build trust gradually and profoundly.", "Seek a Master/Goddess who values deep connection.", "Maintain open communication about mental states."] },
  "Puppet 🎭": { short: "Loves being precisely directed.", long: "Thrives on responsiveness and enjoys being moved and controlled like an extension of the partner's will. Values passivity and clear direction.", tips: ["Practice responsiveness to cues.", "Find a Puppeteer who enjoys precise control.", "Communicate any physical limitations."] },
  "Maid 🧼": { short: "Delights in order and polite service.", long: "Finds joy in cleanliness, organization, and providing attentive, courteous service, often while wearing a uniform.", tips: ["Focus on attention to detail.", "Seek a partner who appreciates neatness and formality.", "Take pride in your presentation and duties."] },
  "Painslut 🔥": { short: "Craves intense sensation, pushes limits.", long: "Actively seeks out and enjoys intense physical sensations, often pushing boundaries of endurance. Finds pleasure or release in pain.", tips: ["Clearly define pain limits and safewords.", "Partner with a skilled Sadist who prioritizes safety.", "Ensure robust aftercare practices."] },
  "Bottom ⬇️": { short: "Open to receiving sensation/direction.", long: "Primarily enjoys the receiving role in scenes, whether it involves sensation, commands, or emotional input. Often values receptiveness and endurance.", tips: ["Communicate your capacity and desires clearly.", "Find a Top/Dominant whose style complements yours.", "Pace yourself and listen to your body."] },

   // Dominant Styles
  "Classic Dominant 👑": { short: "Shines in charge, guides confidently.", long: "Enjoys general leadership, setting the tone, and guiding the dynamic with authority and care. Values structure and responsibility.", tips: ["Listen actively to your partner's needs and limits.", "Balance firmness with kindness and clear communication.", "Continuously learn about safety and consent."] },
  "Assertive 💪": { short: "Leads with bold, decisive energy.", long: "Takes charge confidently and directly, communicating expectations clearly and setting firm boundaries. Authority shapes the scene.", tips: ["Be direct but respectful.", "Ensure your partner understands and consents to your assertive style.", "Temper boldness with awareness of partner's responses."] },
  "Nurturer 🤗": { short: "Guides with warmth & care.", long: "Focuses on emotional support, patience, and fostering growth. Blends control with empathy, creating a safe space.", tips: ["Practice patience and active listening.", "Be attentive to emotional cues and needs.", "Foster trust and safety above all."] },
  "Strict 📏": { short: "Enforces rules precisely.", long: "Maintains order through clear rules, consistent enforcement, and fair discipline. Finds satisfaction in structure and obedience.", tips: ["Set expectations clearly and upfront.", "Ensure rules and consequences are negotiated and fair.", "Reward compliance as much as correcting infractions."] },
  "Master 🎓": { short: "Leads with authority & responsibility.", long: "Embodies a profound role involving high expectations, strong presence, and deep care/ownership. Guides with structure and commitment.", tips: ["Build trust meticulously over time.", "Understand your partner's needs and limits deeply.", "Negotiate terms of the dynamic thoroughly."] },
  "Mistress 👸": { short: "Commands with grace & power.", long: "Leads confidently and often creatively, blending sensuality, elegance, and control. Enjoys high standards and captivating presence.", tips: ["Embrace your unique style of power.", "Communicate expectations with clarity and charm.", "Explore creative ways to exercise control."] },
  "Daddy 👨‍🏫": { short: "Protects & nurtures with firm hand.", long: "Blends protective guidance with affectionate authority. Provides structure, care, and discipline within a loving framework.", tips: ["Be consistent in both care and discipline.", "Understand the needs of your 'little' or partner.", "Balance firmness with warmth and affection."] },
  "Mommy 👩‍🏫": { short: "Nurtures & guides with warmth.", long: "Provides nurturing comfort, gentle discipline, and a safe space for exploration and growth. Blends care with guiding control.", tips: ["Be patient, loving, and understanding.", "Listen attentively to your 'little's' needs.", "Encourage growth and exploration safely."] },
  "Owner 🔑": { short: "Pride in possessing & caring.", long: "Takes fulfillment from the responsibility and control involved in 'owning' a pet or slave. Provides structure, training, and care.", tips: ["Set clear rules and expectations for your 'property'.", "Ensure the dynamic is based on enthusiastic consent.", "Provide consistent care and structure."] },
  "Rigger 🧵": { short: "Artist of restraint & sensation.", long: "Excels in the art and technique of rope bondage, focusing on aesthetics, sensation, and safety. Values creativity, precision, and trust.", tips: ["Master rope safety above all else.", "Communicate constantly with your partner during tying.", "Explore different styles and complexities of ties."] },
  "Sadist 😏": { short: "Joy in giving sensation with care.", long: "Finds pleasure in consensually inflicting physical or psychological pain/discomfort. Requires skill, control, and deep attunement to partner.", tips: ["Negotiate limits and types of sensation meticulously.", "Read your partner's responses carefully and adjust.", "Prioritize thorough and compassionate aftercare."] },
  "Hunter 🏹": { short: "Thrives on chase & capture.", long: "Enjoys the dynamic tension and excitement of pursuit. Values instinct, strategy, and the thrill of the 'hunt' leading to capture.", tips: ["Establish clear consent and rules for chase scenes.", "Use safewords and check-ins during pursuit.", "Enjoy the game while maintaining safety."] },
  "Trainer 🏋️‍♂️": { short: "Guides with patience & structure.", long: "Focuses on teaching skills, shaping behavior, or molding a partner through structured methods, patience, and clear feedback.", tips: ["Be clear, consistent, and patient in your methods.", "Use positive reinforcement effectively.", "Celebrate progress and learning."] },
  "Puppeteer 🕹️": { short: "Controls with creative precision.", long: "Enjoys directing a partner's every move with fine detail, treating them as an extension of their will or an object to be manipulated.", tips: ["Communicate directions clearly (verbally or non-verbally).", "Be mindful of your partner's physical comfort and limits.", "Explore creative and intricate control scenarios."] },
  "Protector 🛡️": { short: "Leads with vigilance and strength.", long: "Feels a strong instinct to shield, defend, and safeguard their partner. Blends authority with responsibility and care.", tips: ["Be vigilant but not stifling.", "Communicate your protective instincts to your partner.", "Foster trust by demonstrating reliability."] },
  "Disciplinarian ✋": { short: "Enforces rules firmly, fairly.", long: "Excels at setting boundaries and administering consequences calmly and effectively. Values order, learning through correction, and fairness.", tips: ["Ensure rules and consequences are pre-negotiated.", "Remain objective and calm during discipline.", "Focus on the lesson or behavior, not anger."] },
  "Caretaker 🧡": { short: "Nurtures & supports holistically.", long: "Attends to a partner's overall well-being (physical, emotional, health). Often sets rules focused on safety and nurturing.", tips: ["Be attentive, gentle, and observant of needs.", "Communicate care actions clearly.", "Encourage exploration within a safe framework."] },
  "Sir 🎩": { short: "Leads with honor & respect.", long: "Commands authority through a formal, dignified, and respectful demeanor. Values protocol, integrity, and often service.", tips: ["Uphold your values consistently.", "Treat your partner with respect, even while commanding.", "Lead by example."] },
  "Goddess 🌟": { short: "Inspires worship and adoration.", long: "Embodies power, grace, and elevation, desiring acts of devotion and reverence. Commands effortlessly through presence.", tips: ["Embrace your divine energy.", "Clearly communicate expectations for worship/service.", "Balance receiving adoration with acknowledging effort."] },
  "Commander ⚔️": { short: "Leads with strategic control.", long: "Takes charge with precision, planning, and decisiveness. Excels in complex scenarios or structured power exchange.", tips: ["Plan scenes or interactions carefully.", "Communicate orders clearly and decisively.", "Execute your vision confidently while monitoring your partner."] },
};

// Dynamic matches for each style (Ensure names match sfStyles lists)
export const sfDynamicMatches = {
  // Submissive Matches
  "Classic Submissive 🙇‍♀️": { dynamic: "Power Exchange", match: "Classic Dominant 👑", desc: "Classic foundation.", longDesc: "Clear roles, mutual respect, focuses on guidance and obedience." },
  "Brat 😈": { dynamic: "Taming Play", match: "Disciplinarian ✋", desc: "Sparks fly!", longDesc: "Playful resistance meets firm, fair control. Exciting push-and-pull." },
  "Slave 🔗": { dynamic: "Master/Slave", match: "Master 🎓", desc: "Deep trust.", longDesc: "Total devotion meets structured authority and responsibility." },
  "Pet 🐾": { dynamic: "Pet Play", match: "Owner 🔑", desc: "Playful care.", longDesc: "Embodied persona receives affection, guidance, and playful training." },
  "Little 🍼": { dynamic: "Age Play", match: "Caretaker 🧡", desc: "Nurturing space.", longDesc: "Childlike spirit is cherished, protected, and gently guided." },
  "Puppy 🐶": { dynamic: "Pup Play", match: "Trainer 🏋️‍♂️", desc: "Lively bond.", longDesc: "Enthusiastic energy is channeled through structured training and play." },
  "Kitten 🐱": { dynamic: "Kitten Play", match: "Owner 🔑", desc: "Sensual connection.", longDesc: "Curiosity and affection meet patient guidance and appreciation." },
  "Princess 👑": { dynamic: "Pampering Play", match: "Daddy 👨‍🏫", desc: "Regal care.", longDesc: "Desire to be spoiled meets affectionate authority and nurturing." },
  "Rope Bunny 🪢": { dynamic: "Bondage Play", match: "Rigger 🧵", desc: "Artistic exchange.", longDesc: "Enthusiasm for rope meets skilled technique and aesthetic vision." },
  "Masochist 💥": { dynamic: "Sadomasochism", match: "Sadist 😏", desc: "Thrilling exchange.", longDesc: "Desire for sensation meets skilled, controlled infliction within trust." },
  "Prey 🏃‍♀️": { dynamic: "Primal Play", match: "Hunter 🏹", desc: "Wild chase.", longDesc: "Thrill of the chase meets the drive to pursue and capture." },
  "Toy 🎲": { dynamic: "Objectification Play", match: "Owner 🔑", desc: "Playful use.", longDesc: "Desire to be used meets controlling guidance and appreciation." },
  "Doll 🎎": { dynamic: "Transformation Play", match: "Puppeteer 🕹️", desc: "Creative shaping.", longDesc: "Enjoyment of being posed meets precise, artistic control." },
  "Bunny 🐰": { dynamic: "Gentle Play", match: "Nurturer 🤗", desc: "Sweet bond.", longDesc: "Shyness and need for gentleness meet warm, patient care." }, // Changed match
  "Servant 🧹": { dynamic: "Service Play", match: "Mistress 👸", desc: "Refined duty.", longDesc: "Dutiful service meets elegant command and high standards." }, // Changed match
  "Playmate 🎉": { dynamic: "Adventure Play", match: "Assertive 💪", desc: "Energetic fun.", longDesc: "Shared enthusiasm meets bold initiation and direction." }, // Changed match
  "Babygirl 🌸": { dynamic: "Age Play", match: "Daddy 👨‍🏫", desc: "Nurturing space.", longDesc: "Need for affection and guidance meets protective authority." },
  "Captive ⛓️": { dynamic: "Captivity Play", match: "Hunter 🏹", desc: "Intense thrill.", longDesc: "Enjoyment of powerlessness meets the drive to capture and control." },
  "Thrall 🛐": { dynamic: "Devotion Play", match: "Goddess 🌟", desc: "Deep worship.", longDesc: "Intense mental connection meets divine presence and command." },
  "Puppet 🎭": { dynamic: "Puppet Play", match: "Puppeteer 🕹️", desc: "Controlled dance.", longDesc: "Responsiveness meets precise, artistic direction." },
  "Maid 🧼": { dynamic: "Service Play", match: "Sir 🎩", desc: "Formal duty.", longDesc: "Orderly service meets respectful, dignified authority." }, // Changed match
  "Painslut 🔥": { dynamic: "Hard Sadomasochism", match: "Sadist 😏", desc: "Fiery intensity.", longDesc: "Craving for intense sensation meets skilled, boundary-pushing infliction." },
  "Bottom ⬇️": { dynamic: "Sensation Play", match: "Classic Dominant 👑", desc: "Steady flow.", longDesc: "Receptiveness and endurance meet confident guidance." },

  // Dominant Matches (some are mirrors of above)
  "Classic Dominant 👑": { dynamic: "Power Exchange", match: "Classic Submissive 🙇‍♀️", desc: "Balanced foundation.", longDesc: "Confident guidance meets trusting obedience and respect." },
  "Assertive 💪": { dynamic: "Assertive Control", match: "Playmate 🎉", desc: "Dynamic energy.", longDesc: "Bold initiation meets enthusiastic participation." }, // Changed match
  "Nurturer 🤗": { dynamic: "Nurturing Care", match: "Bunny 🐰", desc: "Gentle support.", longDesc: "Warm patience meets shy need for gentle affection." }, // Changed match
  "Strict 📏": { dynamic: "Discipline Play", match: "Slave 🔗", desc: "Structured order.", longDesc: "Clear rules and enforcement meet devotion and desire for structure." },
  "Master 🎓": { dynamic: "Master/Slave", match: "Slave 🔗", desc: "Deep relationship.", longDesc: "Responsible authority meets profound devotion and service." },
  "Mistress 👸": { dynamic: "Mistress/Servant", match: "Servant 🧹", desc: "Elegant command.", longDesc: "Graceful authority and high standards meet dutiful service." },
  "Daddy 👨‍🏫": { dynamic: "Daddy/Little", match: "Babygirl 🌸", desc: "Nurturing bond.", longDesc: "Affectionate authority meets need for guidance and care." }, // Can also match Little
  "Mommy 👩‍🏫": { dynamic: "Mommy/Little", match: "Little 🍼", desc: "Loving bond.", longDesc: "Warm guidance and gentle discipline meet childlike spirit." },
  "Owner 🔑": { dynamic: "Owner/Pet", match: "Pet 🐾", desc: "Playful bond.", longDesc: "Caring control and guidance meet embodied persona and affection." },
  "Rigger 🧵": { dynamic: "Bondage Play", match: "Rope Bunny 🪢", desc: "Artistic exchange.", longDesc: "Technical skill and vision meet enthusiasm for rope and sensation." },
  "Sadist 😏": { dynamic: "Sadomasochism", match: "Masochist 💥", desc: "Thrilling exchange.", longDesc: "Controlled infliction meets desire for sensation within trust." }, // Can also match Painslut
  "Hunter 🏹": { dynamic: "Primal Play", match: "Prey 🏃‍♀️", desc: "Wild chase.", longDesc: "Pursuit drive meets enjoyment of the chase and surrender." },
  "Trainer 🏋️‍♂️": { dynamic: "Training Play", match: "Puppy 🐶", desc: "Structured growth.", longDesc: "Patient guidance and structure meet eager energy and trainability." },
  "Puppeteer 🕹️": { dynamic: "Control Play", match: "Doll 🎎", desc: "Creative shaping.", longDesc: "Precise, artistic direction meets enjoyment of being posed/admired." }, // Can also match Puppet
  "Protector 🛡️": { dynamic: "Protection Play", match: "Little 🍼", desc: "Strong bond.", longDesc: "Vigilant strength meets need for safety and security." },
  "Disciplinarian ✋": { dynamic: "Taming Play", match: "Brat 😈", desc: "Lively challenge.", longDesc: "Firm, fair enforcement meets playful resistance." },
  "Caretaker 🧡": { dynamic: "Caretaking Play", match: "Little 🍼", desc: "Holistic support.", longDesc: "Focus on overall well-being meets need for nurturing and structure." },
  "Sir 🎩": { dynamic: "Sir/Submissive", match: "Maid 🧼", desc: "Formal respect.", longDesc: "Dignified authority meets polite, attentive service." }, // Changed match
  "Goddess 🌟": { dynamic: "Worship Play", match: "Thrall 🛐", desc: "Divine connection.", longDesc: "Elevated presence meets deep devotion and reverence." },
  "Commander ⚔️": { dynamic: "Command Play", match: "Submissive 🙇‍♀️", desc: "Strategic control.", longDesc: "Decisive leadership meets willing obedience." } // Can match others too

  // Switch Match (Switches often pair well with other Switches or versatile partners)
  // Adding generic Switch entry - specific leanings might alter this
  // "Fluid Switch 🌊": { dynamic: "Versatile Play", match: "Fluid Switch 🌊", desc: "Dynamic flow.", longDesc: "Mutual understanding of shifting roles creates exciting possibilities." },
};


// Trait weights for Style Finder scoring (Adjust weights for more nuance)
// Higher weight means the trait is more indicative of the style.
// Using the renamed SF traits where applicable.
export const sfStyleKeyTraits = {
    // Submissive Styles
    "Classic Submissive 🙇‍♀️": { obedience: 3, surrender: 2, politeness: 1, service: 1 },
    "Brat 😈": { rebellion: 3, mischief: 2, playfulness: 1 },
    "Slave 🔗": { devotion: 3, surrender: 3, service: 2, obedience: 1 },
    "Pet 🐾": { 'affection seeking': 3, playfulness: 2, devotion: 1, nonVerbalExpression: 1 }, // Assuming nonVerbalExpression trait exists
    "Little 🍼": { innocence: 3, 'need for guidance': 2, 'affection seeking': 1, playfulness: 1 },
    "Puppy 🐶": { playfulness: 3, 'affection seeking': 2, devotion: 1, trainability: 1 }, // Assuming trainability trait exists
    "Kitten 🐱": { 'affection seeking': 2, mischief: 2, sensuality: 1, curiosity: 1 }, // Assuming curiosity trait exists
    "Princess 👑": { 'desire for pampering': 3, 'aesthetic focus': 2, innocence: 1 }, // Assuming desire for pampering trait exists
    "Rope Bunny 🪢": { 'rope enthusiasm': 3, sensuality: 2, 'patience during tying': 1, surrender: 1 }, // Assuming rope enthusiasm trait exists
    "Masochist 💥": { 'pain interpretation': 3, craving: 2, surrender: 1 },
    "Prey 🏃‍♀️": { 'enjoyment of chase': 3, vulnerability: 1, exploration: 1 },
    "Toy 🎲": { 'objectification comfort': 3, adaptability: 2, receptiveness: 1 },
    "Doll 🎎": { 'aesthetic focus': 3, 'objectification comfort': 2, 'stillness / passivity': 1 }, // Assuming stillness / passivity trait exists
    "Bunny 🐰": { innocence: 2, 'affection seeking': 2, shyness: 2 }, // Assuming shyness trait exists
    "Servant 🧹": { service: 3, obedience: 2, politeness: 1, 'anticipating needs': 1 }, // Assuming anticipating needs trait exists
    "Playmate 🎉": { playfulness: 3, exploration: 1, 'good sport': 1 }, // Assuming good sport trait exists
    "Babygirl 🌸": { 'affection seeking': 2, innocence: 2, vulnerability: 1, 'need for guidance': 1 },
    "Captive ⛓️": { surrender: 2, 'enjoyment of chase': 1, 'fear play comfort': 1, vulnerability: 1 }, // Assuming fear play comfort trait exists
    "Thrall 🛐": { devotion: 3, surrender: 2, 'mental focus': 1 }, // Assuming mental focus trait exists
    "Puppet 🎭": { receptiveness: 3, adaptability: 1, 'passivity in control': 1 }, // Assuming passivity in control trait exists
    "Maid 🧼": { service: 2, politeness: 2, 'attention to detail': 2, uniformity: 1 }, // Assuming attention to detail, uniformity traits exist
    "Painslut 🔥": { craving: 3, 'pain interpretation': 2, 'endurance display': 1 }, // Assuming endurance display trait exists
    "Bottom ⬇️": { receptiveness: 3, surrender: 1, 'pain interpretation': 1 }, // Generalized

    // Dominant Styles
    "Classic Dominant 👑": { authority: 3, confidence: 2, leadership: 1 },
    "Assertive 💪": { authority: 2, boldness: 2, confidence: 1, 'direct communication': 1 }, // Assuming direct communication trait exists
    "Nurturer 🤗": { care: 3, empathy: 2, patience: 1 },
    "Strict 📏": { 'discipline focus': 3, authority: 1, precision: 1 },
    "Master 🎓": { authority: 3, dominanceDepth: 2, possessiveness: 1, confidence: 1 },
    "Mistress 👸": { authority: 2, confidence: 2, creativity: 1, 'aesthetic vision': 1 },
    "Daddy 👨‍🏫": { care: 3, authority: 1, patience: 1, possessiveness: 1 },
    "Mommy 👩‍🏫": { care: 3, empathy: 2, patience: 1 },
    "Owner 🔑": { possessiveness: 3, control: 2, dominanceDepth: 1 },
    "Rigger 🧵": { precision: 3, 'aesthetic vision': 2, creativity: 1, patience: 1 },
    "Sadist 😏": { sadism: 3, control: 1, precision: 1, empathy: 1 }, // Empathy is important for safe sadism
    "Hunter 🏹": { 'pursuit drive': 3, boldness: 1, intensity: 1 },
    "Trainer 🏋️‍♂️": { patience: 2, leadership: 2, 'discipline focus': 1, 'skill development focus': 1 }, // Assuming skill dev trait exists
    "Puppeteer 🕹️": { control: 3, precision: 2, creativity: 1, 'objectification gaze': 1 }, // Assuming objectification gaze trait exists
    "Protector 🛡️": { care: 2, authority: 2, boldness: 1, vigilance: 1 }, // Assuming vigilance trait exists
    "Disciplinarian ✋": { 'discipline focus': 3, authority: 1, confidence: 1 },
    "Caretaker 🧡": { care: 3, patience: 1, empathy: 1, 'holistic well-being focus': 1 }, // Assuming holistic trait exists
    "Sir 🎩": { authority: 2, confidence: 1, 'formal demeanor': 2 }, // Assuming formal demeanor trait exists
    "Goddess 🌟": { confidence: 2, authority: 2, dominanceDepth: 1, 'worship seeking': 1 }, // Assuming worship seeking trait exists
    "Commander ⚔️": { authority: 2, leadership: 2, confidence: 1, 'strategic direction': 1 }, // Assuming strategic direction trait exists
};


// --- Style Finder Icons ---
// Centralized here for easier management
export const sfStyleIcons = {
    // Submissive
    "Classic Submissive 🙇‍♀️": '🙇‍♀️', "Brat 😈": '😈', "Slave 🔗": '🔗', "Pet 🐾": '🐾', "Little 🍼": '🍼', "Puppy 🐶": '🐶', "Kitten 🐱": '🐱', "Princess 👑": '👑', "Rope Bunny 🪢": '🪢', "Masochist 💥": '💥', "Prey 🏃‍♀️": '🏃‍♀️', "Toy 🎲": '🎲', "Doll 🎎": '🎎', "Bunny 🐰": '🐰', "Servant 🧹": '🧹', "Playmate 🎉": '🎉', "Babygirl 🌸": '🌸', "Captive ⛓️": '⛓️', "Thrall 🛐": '🛐', "Puppet 🎭": '🎭', "Maid 🧼": '🧼', "Painslut 🔥": '🔥', "Bottom ⬇️": '⬇️',
    // Dominant
    "Classic Dominant 👑": '👑', "Assertive 💪": '💪', "Nurturer 🤗": '🤗', "Strict 📏": '📏', "Master 🎓": '🎓', "Mistress 👸": '👸', "Daddy 👨‍🏫": '👨‍🏫', "Mommy 👩‍🏫": '👩‍🏫', "Owner 🔑": '🔑', "Rigger 🧵": '🧵', "Sadist 😏": '😏', "Hunter 🏹": '🏹', "Trainer 🏋️‍♂️": '🏋️‍♂️', "Puppeteer 🕹️": '🕹️', "Protector 🛡️": '🛡️', "Disciplinarian ✋": '✋', "Caretaker 🧡": '🧡', "Sir 🎩": '🎩', "Goddess 🌟": '🌟', "Commander ⚔️": '⚔️',
    // Switch (If ever needed for display)
    "Fluid Switch 🌊": '🌊', "Dominant-Leaning Switch 👑↔️": '👑↔️', "Submissive-Leaning Switch 🙇‍♀️↔️": '🙇‍♀️↔️', "Situational Switch 🤔": '🤔'
};


// --- Glossary Data ---
// Adding placeholder entries for traits used in SF scoring that might not be core traits
const baseGlossaryTerms = {
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
    // ... other base terms
};

// Helper to find trait explanation, searching all roles and styles
const findTraitExplanation = (traitName) => {
    for (const roleKey in bdsmData) {
        const role = bdsmData[roleKey];
        // Check core traits
        const coreTrait = role.coreTraits?.find(t => t.name === traitName);
        if (coreTrait?.explanation) return coreTrait.explanation;
        // Check style-specific traits
        for (const style of role.styles || []) {
            const styleTrait = style.traits?.find(t => t.name === traitName);
            if (styleTrait?.explanation) return styleTrait.explanation;
        }
    }
    // Fallback for SF-specific traits if not found in core data
    const sfTraitSub = sfSubFinderTraits.find(t => t.name === traitName);
    if (sfTraitSub?.desc) return sfTraitExplanations[traitName] || sfTraitSub.desc; // Use SF explanation or desc
    const sfTraitDom = sfDomFinderTraits.find(t => t.name === traitName);
     if (sfTraitDom?.desc) return sfTraitExplanations[traitName] || sfTraitDom.desc; // Use SF explanation or desc

    return `Definition for '${traitName}' not found.`;
};

// Function to create a glossary entry for a trait
const createTraitGlossaryEntry = (traitName, baseTermKey = null) => {
    const baseEntry = baseTermKey ? baseGlossaryTerms[baseTermKey] : {};
    const explanation = findTraitExplanation(traitName);
    const term = traitName.charAt(0).toUpperCase() + traitName.slice(1).replace(/([A-Z])/g, ' $1'); // Capitalize and add spaces
    return {
        ...baseEntry, // Inherit related terms if base provided
        term: `${term} (Trait)`,
        definition: explanation || `Details for the ${traitName} trait.`,
         // Keep related terms from base, or set empty array
        related: baseEntry?.related || []
    };
};

export const glossaryTerms = {
    ...baseGlossaryTerms,
    // Core Submissive Traits
    "obedience": createTraitGlossaryEntry("obedience", "Submissive (Role)"),
    "trust": createTraitGlossaryEntry("trust", "Consent"),
    "receptiveness": createTraitGlossaryEntry("receptiveness", "Bottom"),
    "vulnerability": createTraitGlossaryEntry("vulnerability", "Submissive (Role)"),
    // Core Dominant Traits
    "authority": createTraitGlossaryEntry("authority", "Dominant (Role)"),
    "care": createTraitGlossaryEntry("care", "Aftercare"),
    "control": createTraitGlossaryEntry("control", "Power Exchange"),
    "confidence": createTraitGlossaryEntry("confidence", "Dominant (Role)"),
    // Core Switch Traits
    "adaptability": createTraitGlossaryEntry("adaptability", "Switch (Role/Style)"),
    "empathy": createTraitGlossaryEntry("empathy", "Care"),
    "communication": createTraitGlossaryEntry("communication", "Negotiation"),
    "energy reading": createTraitGlossaryEntry("energy reading", "Switch (Role/Style)"),
    // Selected Style/SF Traits (Add more as needed)
    "service": createTraitGlossaryEntry("service"),
    "presentation": createTraitGlossaryEntry("presentation"),
    "playful defiance": createTraitGlossaryEntry("playful defiance"),
    "mischief": createTraitGlossaryEntry("mischief"),
    "devotion": createTraitGlossaryEntry("devotion"),
    "surrender": createTraitGlossaryEntry("surrender"),
    "affection seeking": createTraitGlossaryEntry("affection seeking"),
    "playfulness": createTraitGlossaryEntry("playfulness"),
    "non-verbal expression": createTraitGlossaryEntry("non-verbal expression"),
    "age regression comfort": createTraitGlossaryEntry("age regression comfort"),
    "need for guidance": createTraitGlossaryEntry("need for guidance"),
    "innocence": createTraitGlossaryEntry("innocence"),
    "pain interpretation": createTraitGlossaryEntry("pain interpretation"),
    "sensation seeking": createTraitGlossaryEntry("sensation seeking"),
    "aesthetic focus": createTraitGlossaryEntry("aesthetic focus"),
    "objectification comfort": createTraitGlossaryEntry("objectification comfort"),
    "leadership": createTraitGlossaryEntry("leadership"),
    "discipline focus": createTraitGlossaryEntry("discipline focus"),
    "sadism": createTraitGlossaryEntry("sadism"),
    "patience": createTraitGlossaryEntry("patience"),
    "precision": createTraitGlossaryEntry("precision"),
    "possessiveness": createTraitGlossaryEntry("possessiveness"),
    "dominanceDepth": createTraitGlossaryEntry("dominanceDepth"),
    "craving": createTraitGlossaryEntry("craving"),
     // ... add other specific traits referenced in styles or SF here
};


// --- Achievement List ---
export const achievementList = {
    // Core Actions
    "profile_created": { name: "First Steps! ✨", desc: "Created your very first Kink Persona!" },
    "profile_edited": { name: "Growth Spurt! 🌱", desc: "Updated and refined a persona." },
    "avatar_chosen": { name: "Face Forward! 🎭", desc: "Selected a unique avatar for a persona." },
    "five_profiles": { name: "Crew Assembled! 👯‍♀️", desc: "Created five different Kink Personas." },
    "data_exported": { name: "Safe Keeper! 💾", desc: "Exported your persona data." },
    "data_imported": { name: "Welcome Back! 📁", desc: "Imported persona data." },

    // Feature Usage
    "style_finder_complete": { name: "Quest Complete! 🧭", desc: "Completed the Style Finder." },
    "style_discovery": { name: "Curious Explorer! 🔭", desc: "Opened the Style Discovery feature." },
    "glossary_user": { name: "Knowledge Seeker! 📚", desc: "Opened the Kink Glossary." },
    "resource_reader": { name: "Wise Owl! 🦉", desc: "Viewed the Resources section." },
    "theme_changer": { name: "Style Maven! 🎨", desc: "Changed the application theme." },
    "trait_info_viewed": { name: "Detail Detective! 🕵️‍♀️", desc: "Viewed detailed info about a trait." },
    "kink_reading_oracle": { name: "Oracle Consulted! 🔮", desc: "Received a Kink Compass Oracle reading." },
    "challenge_accepted": { name: "Challenge Accepted! 💪", desc: "Engaged with a Daily Challenge." },

    // Goal Tracking
    "goal_added": { name: "Setting Sights! 🎯", desc: "Added a goal to a persona." },
    "goal_completed": { name: "Goal Getter! ✔️", desc: "Completed a goal for a persona." },
    "five_goals_completed": { name: "Milestone Achiever! 🏆", desc: "Completed five goals for one persona." },
    "goal_streak_3": { name: "Goal Streak! 🔥", desc: "Completed 3 goals within 7 days for one persona." },

    // History & Reflection
    "history_snapshot": { name: "Memory Lane! 📸", desc: "Saved your first persona history snapshot." },
    "ten_snapshots": { name: "Chronicler! 📜", desc: "Saved ten history snapshots for one persona." },
    "consistent_snapper": { name: "Consistent Chronicler! 📅", desc: "Took snapshots at least 3 days apart." },
    "reflection_saved": { name: "Deep Thoughts! 📝", desc: "Saved your first journal reflection." },
    "five_reflections": { name: "Introspective! 🧐", desc: "Saved five journal reflections for one persona." },
    "journal_journeyman": { name: "Journal Journeyman! ✍️", desc: "Saved 10 journal entries for one persona." },
    "prompt_used": { name: "Spark Seeker! 💡", desc: "Used a journal prompt to inspire reflection." },

    // Trait Milestones
    "max_trait": { name: "Peak Performer! 🌟", desc: "Maxed out a trait score to 5 in the main form!" },
    "min_trait": { name: "Room to Bloom! 🌱", desc: "Rated a trait score as 1 in the main form (It's okay!)." },
    "trait_transformer": { name: "Trait Transformer! ✨", desc: "Increased a trait score by 2+ points between snapshots." },

    // Conceptual / Future
    "first_anniversary": { name: "Compass Companion! 🎉", desc: "Used KinkCompass for one year (Conceptual)." },
    "all_styles_discovered": { name: "Style Scholar! 🧐", desc: "Viewed every style in Style Discovery (Conceptual)." },
};

// --- Synergy Hints ---
// (Keep structure as provided, assuming it's correct for findHintsForTraits)
export const synergyHints = {
  highPositive: [
    { traits: ["authority", "care"], hint: "✨ The Benevolent Ruler ✨: Wow! High Authority paired with high Care means you lead with strength AND heart. Your guidance likely feels both firm and incredibly safe. Keep nurturing that balance!", },
    { traits: ["confidence", "creativity"], hint: "💡 The Visionary Leader 💡: Confidence meets Creativity! You're not just sure of your path, you're probably paving exciting new ones. Your scenes likely crackle with imaginative energy!", },
    { traits: ["discipline focus", "patience"], hint: "⏳ The Master Shaper ⏳: Strictness combined with Patience is a powerful combo for teaching and guiding growth. You set clear expectations but give space for learning. Impressive!", }, // Used discipline focus
    { traits: ["control", "precision"], hint: "🔬 The Detail Maestro 🔬: High Control and Precision? You likely orchestrate scenes with incredible finesse. Every detail matters, creating a truly immersive experience for your partner.", },
    { traits: ["obedience", "devotion"], hint: "💖 The Loyal Heart 💖: Obedience fueled by deep Devotion creates a truly profound connection. Your desire to follow comes from a place of deep commitment. Beautiful!", },
    { traits: ["receptiveness", "exploration"], hint: "🌟 The Open Explorer 🌟: High Receptiveness and a love for Exploration? You're ready to receive new experiences with open arms! Your journey is likely full of exciting discoveries.", },
    { traits: ["vulnerability", "trust"], hint: "🤝 The Foundation of Connection 🤝: Trust and Vulnerability are the bedrock! When both are high, you create incredibly deep emotional intimacy. Cherish that openness.", }, // Assumes 'trust' trait exists
    { traits: ["playfulness", "mischief"], hint: "🎉 The Agent of Chaos (the fun kind!) 🎉: Playfulness AND Mischief? You're likely the life of the party, always ready with a witty remark or a playful challenge. Keep sparkling!", },
    { traits: ["service", "anticipating needs"], hint: "🔮 The Attentive Aide 🔮: Excelling at Service and Anticipating Needs makes you seem almost psychic! You likely provide seamless, intuitive support that feels magical.", }, // Assumes 'anticipating needs' trait exists
    { traits: ["pain interpretation", "craving"], hint: "🔥 The Intensity Seeker 🔥: High Pain Tolerance combined with Craving intense experiences? You're drawn to the edge and find exhilaration there. Ride those waves safely!", } // Used pain interpretation
  ],
  interestingDynamics: [
    { traits: { high: "authority", low: "care" }, hint: "🤔 The Firm Commander 🤔: Strong Authority but lower Care? Your leadership is clear, but remember to check in emotionally. Is your guidance landing gently, even when firm? Softness can amplify strength.", },
    { traits: { high: "control", low: "patience" }, hint: "⚡️ The Impatient Orchestrator ⚡️: High Control but lower Patience? You have a clear vision, but might get frustrated if things don't go exactly to plan *immediately*. Breathe! Sometimes the process is part of the magic.", },
    { traits: { high: "sadism", low: "empathy" }, hint: "🎭 The Intense Edge-Player 🎭: Enjoying Sadism but lower Empathy? You love pushing boundaries, which is thrilling! Double-check you're reading signals accurately. Explicit check-ins are your best friend here.", },
    { traits: { high: "obedience", low: "trust" }, hint: "🚧 The Cautious Follower 🚧: High Obedience but lower Trust? You *want* to follow, but hesitation holds you back. What small steps could build more trust? Focus on clear communication about your feelings.", }, // Assumes 'trust' trait exists
    { traits: { high: "rebellion", low: "playfulness" }, hint: "😠 The Grumpy Resister? 😠: High Rebellion without much Playfulness might come across as genuinely defiant rather than cheeky. Is that the vibe you want? Injecting a little humor can keep the spark alive!", },
    { traits: { high: "vulnerability", low: "confidence" }, hint: "💧 The Open but Unsure Heart 💧: Showing Vulnerability is brave! If Confidence (in yourself or the dynamic) feels low, that openness might feel scary. Celebrate small acts of bravery. You are worthy.", },
    { traits: { high: "service", low: "obedience"}, hint: "🤷 The Helpful Free Spirit 🤷: Love performing Acts of Service but not keen on strict Obedience? You find joy in helping, but on your own terms. Ensure your partner understands your motivation comes from care, not just compliance." }
  ],
};


// --- Goal Prompts ---
// (Keep structure as provided, ensure traits exist in core data or SF traits)
export const goalKeywords = {
  "communicate": { relevantTraits: ["confidence", "vulnerability", "direct communication", "politeness", "empathy"], promptTemplates: [ "🌱 To improve communication, how can your '{traitName}' trait support you?", "🗣️ When communicating this goal, is your '{traitName}' score helping or hindering?", "💬 Reflect: How does expressing '{traitName}' relate to achieving clear communication?", ], },
  "boundary": { relevantTraits: ["confidence", "direct communication", "boundary setting", "trust"], promptTemplates: [ "🚧 Setting boundaries relies on '{traitName}'. How can you strengthen this?", "✋ Reflect on a past boundary discussion. How did your '{traitName}' level play a role?", "🛡️ Achieving this goal might involve asserting your '{traitName}'. Feeling ready?", ], },
  "ask for": { relevantTraits: ["confidence", "vulnerability", "direct communication", "affection seeking"], promptTemplates: [ "❓ Asking requires '{traitName}'. Where do you feel strongest/weakest in that?", "🙋‍♀️ Consider your '{traitName}'. Does it make asking feel easier or harder?", "🎁 How can embracing your '{traitName}' help you clearly ask for what you need/want?", ] },
  "explore": { relevantTraits: ["exploration", "curiosity", "boldness", "trust", "care"], promptTemplates: [ "🗺️ Exploration often involves '{traitName}'. Is this trait eager for the journey?", "🧭 How does your '{traitName}' score impact your comfort level with exploring this?", "🔭 To explore safely, consider your '{traitName}'. Does it align with the risks?", ], }, // Used care instead of safety focus
  "learn": { relevantTraits: ["exploration", "patience", "trainability", "discipline focus", "precision"], promptTemplates: [ "🧠 Learning this skill connects to '{traitName}'. How's that synergy feeling?", "📚 Your '{traitName}' level might influence your learning pace. How can you adapt?", "🎓 Reflect: Does your approach to '{traitName}' support mastering this new skill?", ], }, // Assumes trainability trait exists
  "rope": { relevantTraits: ["rope enthusiasm", "patience during tying", "sensuality", "trust", "precision"], promptTemplates: [ "🪢 Exploring rope connects deeply with '{traitName}'. How does this feel?", "⏳ Your '{traitName}' score might affect your rope experience. Ready for that?", "🎨 How can focusing on '{traitName}' enhance your journey with rope?", ] }, // Assumes rope enthusiasm exists
  "scene": { relevantTraits: ["creativity", "control", "intensity", "communication", "care"], promptTemplates: [ "🎬 Planning this scene involves '{traitName}'. Feeling inspired?", "🎭 How does your '{traitName}' level shape the kind of scene you envision?", "✨ Reflect: To make this scene amazing, how can you leverage your '{traitName}'?", ] }, // Used care instead of aftercare focus
  "serve": { relevantTraits: ["service", "obedience", "devotion", "anticipating needs", "politeness"], promptTemplates: [ "🧹 Serving well often means leaning into '{traitName}'. How strong is that urge?", "💖 Reflect: Does your current '{traitName}' score align with your service goals?", "🤝 How can enhancing your '{traitName}' make your service feel more fulfilling?", ], }, // Assumes anticipating needs exists
  "control": { relevantTraits: ["authority", "control", "confidence", "leadership", "care"], promptTemplates: [ "👑 Taking control activates your '{traitName}'. Feeling powerful?", "🕹️ How does your '{traitName}' level influence the *way* you want to take control?", "🧭 Reflect: To achieve satisfying control, how does '{traitName}' need to show up?", ], },
  "submit": { relevantTraits: ["obedience", "trust", "receptiveness", "vulnerability", "surrender"], promptTemplates: [ "🙇‍♀️ Submission often involves embracing '{traitName}'. How does that feel right now?", "🔗 Your '{traitName}' level might shape your submission experience. What are you seeking?", "🕊️ Reflect: How can understanding your '{traitName}' deepen your submission?", ] }, // Used surrender
  "pain": { relevantTraits: ["pain interpretation", "sensation seeking", "trust", "communication", "care"], promptTemplates: [ "💥 Exploring pain touches on your '{traitName}'. How prepared do you feel?", "🎢 Your '{traitName}' score influences how you might experience this. Ready to communicate?", "🔥 Reflect: How does '{traitName}' shape your desire or hesitation around pain?", ] }, // Used pain interpretation
  "intense": { relevantTraits: ["intensity", "craving", "sensation seeking", "boldness", "care"], promptTemplates: [ "🚀 Seeking intensity engages your '{traitName}'. Ready for the ride?", "📈 How does your '{traitName}' score relate to the *kind* of intensity you crave?", "⚡ Reflect: To navigate intense experiences safely, how crucial is your '{traitName}'?", ] } // Used care instead of safety focus
};

// --- Daily Challenges ---
export const challenges = {
  communication: [
    { title: "💬 Express One Need Clearly", desc: "Today, identify one small thing you need (a moment of quiet, help with a task, a specific type of touch) and ask for it directly and clearly. No hints!", },
    { title: "👂 Active Listening Practice", desc: "During one conversation today, focus *only* on understanding the other person. Ask clarifying questions. Resist the urge to interrupt or plan your response while they speak.", },
    { title: "🛡️ Revisit a Boundary", desc: "Think of one boundary (hard or soft). Mentally (or verbally, if appropriate) reaffirm it to yourself or your partner. Remind yourself why it's important.", },
    { title: "🗣️ 'I Feel' Statement", desc: "Practice expressing a feeling using an 'I feel...' statement instead of blaming or accusing. E.g., 'I feel unheard when...' instead of 'You never listen...'", },
    { title: "✅ Quick Check-in", desc: "Initiate a brief check-in with your partner today, simply asking 'How are you feeling about our dynamic right now?' or similar. Listen openly.", }
  ],
  exploration: [
    { title: "🗺️ Tiny New Thing", desc: "Try one *very small* thing outside your usual routine today. A different route home? A food you avoid? A 5-minute research dive into a curious kink topic?", },
    { title: "🤔 Question an Assumption", desc: "Identify one assumption you hold about yourself, your partner, or your dynamic. Ask yourself: Is this *really* true? Where did it come from?", },
    { title: "✨ Appreciate the Unfamiliar", desc: "Find one thing today (a texture, a sound, an idea) that feels unfamiliar or even slightly uncomfortable. Observe it with curiosity instead of judgment for 1 minute.", },
    { title: "🔭 Style Snippet", desc: "Read the description of one BDSM style (in Style Discovery) that you *don't* identify with. What's one aspect you find interesting or could learn from?", },
    { title: "💡 'What If?' Fantasy", desc: "Spend 5 minutes daydreaming a 'what if?' scenario related to a kink interest, even if it's outside your comfort zone. No pressure to act, just explore mentally." }
  ],
  dominant_challenges: [
    { title: "👑 Offer Specific Praise", desc: "Catch your partner doing something well (following an instruction, showing effort, etc.) and offer genuine, *specific* praise. 'Good girl/boy' is nice, but 'I love how precisely you followed that instruction' is better!", },
    { title: "🧘‍♂️ Patience Practice (Dom)", desc: "Find one moment where you feel impatient with your partner's progress or response. Consciously pause, take 3 deep breaths, and offer encouragement instead of pressure.", },
    { title: "❤️ Proactive Care Check", desc: "Beyond basic safety, proactively check on one aspect of your partner's well-being *before* they mention it (Hydrated? Comfortable temperature? Feeling emotionally secure?)." },
    { title: "🗺️ Delegate a Small Choice", desc: "Even in control, offer your partner a small, low-stakes choice today (e.g., 'Tea or coffee?', 'Music or quiet?'). Acknowledge their preference." }
  ],
  submissive_challenges: [
    { title: "💖 Express Gratitude (Sub)", desc: "Find one specific thing your Dominant partner did today that you appreciate (guidance, care, a fun command) and express your gratitude clearly.", },
    { title: "✨ Trust Exercise (Small)", desc: "Identify one very small act where you can consciously practice trust today – maybe following a simple, low-stakes instruction without hesitation, or sharing a small, slightly vulnerable feeling.", },
    { title: "🎀 Presentation Polish", desc: "Spend an extra 5 minutes on one aspect of your presentation today, purely as an act of devotion or role embodiment (e.g., shining shoes, neatening hair, focusing posture)." },
    { title: "❓ Ask One Question", desc: "Ask your Dominant partner one clarifying question about a rule, expectation, or desire today. Seeking clarity is a strength." }
  ],
  switch_challenges: [
      { title: "🔄 Energy Check-In", desc: "Pause once today and consciously check in with your own energy. Do you feel more drawn to leading or following *right now*? Acknowledge that feeling without judgment.", },
      { title: "💬 Verbalize the Shift?", desc: "Think about how you *would* communicate a desire to switch roles, even if you don't actually do it today. Practice the words in your head.", },
      { title: "💡 Appreciate Both Sides", desc: "Reflect for a moment on one thing you genuinely appreciate about *both* the Dominant and Submissive roles you enjoy." }
  ]
};

// --- Oracle Readings ---
export const oracleReadings = {
  openings: [ "The Compass whispers... ✨", "Today's energy points towards... 🧭", "Listen closely, the Oracle reveals... 🔮", "Your inner compass is tuned to... 💖", "Let's see where the needle lands today... 🌟", "The currents of desire suggest... 🌊" ],
  focusAreas: {
    traitBased: [ "Nurturing your '{traitName}' side. How can you express it gently today?", "The challenge and growth potential in your '{traitName}'. What small step beckons?", "The surprising strength found within your '{traitName}'. Own it with grace!", "Balancing your '{traitName}' with its opposite. Where is the harmony seeking you?", "Celebrating the unique power of your '{traitName}'. Let it shine brightly!", ],
    styleBased: [ "Embracing the core essence of your '{styleName}' style. What feels most authentic right now?", "Exploring a playful or unexpected aspect of '{styleName}'.", "Finding comfort and strength within your '{styleName}' expression. What does safety feel like today?", "Communicating your needs clearly *as* a '{styleName}'. Your voice matters.", "How can you bring more joy or connection into your '{styleName}' practice today?", ],
    general: [ "The power of clear, kind communication today. Speak your truth gently.", "Deepening trust, one small, consistent act at a time. Show up.", "Finding joy in the present moment of your dynamic. Savor it.", "Honoring your boundaries with kindness and firmness. Protect your space.", "Exploring a new spark of curiosity. Where might it lead?", "The importance of thoughtful aftercare, for all involved.", "Balancing giving and receiving energy within your dynamic." ]
  },
  encouragements: [ "Your journey is valid and beautiful. Keep exploring with an open heart!", "Small steps create big shifts. Be patient and compassionate with yourself.", "Authenticity is your superpower. Shine on, uniquely you!", "Communicate with courage and kindness; understanding follows.", "Trust your intuition; it's your inner compass speaking.", "Safety, consent, and communication are the foundation for all magic.", "You are worthy of pleasure, connection, and respect.", "Embrace the learning process with gentle curiosity and self-love.", "Your desires are valid. Explore them responsibly.", "Remember to practice self-care alongside partner care." ],
  closings: [ "May your path be clear and joyful! 🧭", "Navigate wisely and kindly today. ✨", "Trust the journey and your inner wisdom. 💖", "Go forth and explore with intention! 🌟", "The Compass guides; listen closely. 🔮", "May connection flow freely. 🌊", ]
};

// --- Journal Prompts ---
export const journalPrompts = [
    // Foundational & General
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
    "What fears or insecurities sometimes hold me back in my kink exploration?",
    "How does my body language communicate my desires or limits, even without words?",
    "What does 'power' mean to me in the context of BDSM? How do I relate to it?",
    "How do I process challenging emotions (like sub drop, dom drop, or scene processing) afterwards?",
    "What's one way I can show appreciation for my partner(s) in our dynamic today?",
    "If I could design a perfect scene right now, what key elements would it include and why?",
    "How do my past experiences influence my current desires and boundaries?",
    "What aspect of my kink identity brings me the most joy?",
    "Is there a kink or dynamic I'm curious about but hesitant to explore? Why?",
    "How do I define 'success' or 'fulfillment' within my kink practice?",

    // Role-Specific (Examples)
    "If Submissive: When did I feel the most empowered in my submission recently? What created that feeling?",
    "If Dominant: When did I feel my guidance was most effectively received and appreciated? What made it work?",
    "If Switch: What triggers my desire to shift roles? How do I communicate that shift, or wish I could?",
    "If Brat: How do I ensure my brattiness enhances the dynamic rather than derails it? Where is the line?",
    "If Little: What specific elements create the safest and most joyful littlespace for me?",
    "If Pet: How do I best communicate my needs and feelings when in petspace?",
    "If Master/Mistress: How do I balance high expectations with compassion and care?",
    "If Slave/Servant: What acts of service feel most meaningful and fulfilling to me, and why?",
    "If Sadist/Masochist: How do I communicate about intensity levels during a scene to ensure safety and satisfaction?",
    "If Rigger/Bunny: What does the aesthetic vs. sensation aspect of rope mean to me personally?",
];

// --- Context Help Texts ---
// Added more specific help texts
export const contextHelpTexts = {
    name: "Give your persona a unique name! Make it evocative of the character you're exploring.",
    role: "Select the primary role this persona embodies: Dominant (leading), Submissive (yielding), or Switch (both). This influences available styles and core traits.",
    style: "Choose a specific style within your selected role (e.g., Brat, Nurturer). This adds specific traits and helps define the persona's unique flavor. You can explore styles using the 'Explore Styles' button in the header.",
    avatar: "Pick an emoji to visually represent this persona in the list.",
    traits: "Rate how strongly each trait applies to this persona (1=Low, 5=High). These sliders define the persona's tendencies and personality within their role and style. Click the (?) icon next to a trait name for more details.",
    formSubmit: "Save the current persona details. If editing, this updates the existing persona. If creating new, it adds this persona to your Crew.",
    clearForm: "Reset all fields in the form to their default state, clearing any entered data.",
    personaList: "This is your Persona Crew! Click on any persona's name or avatar to view their full details, edit them, or track their progress.",
    livePreview: "See a quick summary of the persona you're currently creating or editing based on the form inputs.",
    detailModalTabs: "Navigate between different sections of the selected persona's details: Traits, Goals, History, etc.",
    addGoal: "Set a specific, achievable goal for this persona's development or exploration.",
    journalPrompt: "Use this button to get a random prompt to inspire your reflection.",
    saveReflection: "Save your current thoughts and reflections to this persona's journal.",
    takeSnapshot: "Save the current state (Role, Style, Trait Scores) of this persona to their history log. Useful for tracking changes over time.",
    historyChart: "Visualize how this persona's key trait scores have changed over time based on saved snapshots.",
    kinkOracle: "Get a playful, insightful reading based on this persona's current state for inspiration.",
    dailyChallenge: "A small, actionable focus for today related to communication, exploration, or specific roles.",
    exportData: "Download a backup file (.json) containing all your persona data.",
    importData: "Load persona data from a previously exported .json backup file. This will REPLACE your current data.",
    styleFinderTrigger: "Launch the guided Style Finder quiz to help discover kink styles that might resonate with you.",
    // Add more keys for specific traits if needed, e.g.:
    // obedience: "How much does this persona enjoy following rules or commands from a trusted partner?",
    // authority: "How naturally does this persona take charge and command respect?",
};
