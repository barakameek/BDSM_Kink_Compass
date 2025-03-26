// --- START OF FILE data.js ---

export const bdsmData = {
  submissive: {
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
      }
    ],
    styles: [
      // --- NEW SUBMISSIVE STYLES ---
      {
        name: "Submissive", // General/Classic
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
        ]
      },
      {
        name: "Brat",
        traits: [
          { name: "playful defiance", desc: {
              "1": "Defiance? Eek, sounds scary! 😨 I prefer to follow the rules. Maybe a tiny bit of sass could be... interesting?",
              "2": "I might poke the bear... gently. 😉 A little pushback sometimes, but I retreat quickly if things get serious.",
              "3": "Hehe, make me! 😏 I enjoy playful rule-bending and witty banter. It's all part of the game!",
              "4": "Rules are merely suggestions, right? 😈 I thrive on clever loopholes and cheeky challenges. Bring on the consequences!",
              "5": "I'm the Queen/King/Ruler of Sass! 👑 Playful defiance is my art form. The dynamic sparks fly when I push back!"
          }},
          { name: "resilience", desc: { // Bouncing back from consequences
              "1": "Ouch! Consequences make me want to hide. 🙈 Bouncing back takes time and maybe some cuddles.",
              "2": "I can take my medicine, but I might pout a little. 🥺 Learning to roll with the punches!",
              "3": "Okay, okay, you got me! 😉 I understand consequences are part of the fun and recover fairly quickly.",
              "4": "Bring it on! Consequences just add fuel to my fire. 🔥 I bounce back ready for the next round!",
              "5": "Consequences? *Delicious.* 🌶️ They barely faze me! I learn, adapt, and come back even brattier!"
          }}
        ]
      },
      {
        name: "Slave",
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
        ]
      },
      {
        name: "Switch", // Note: Also a Role, but can be a 'style' of submission when in that mode
        traits: [
          { name: "adaptability", desc: { // Shifting between roles/modes
              "1": "Switching gears feels clunky! ⚙️ I prefer sticking to one mode. Shifting takes a lot of mental effort.",
              "2": "I can switch, but need clear signals and maybe a little time to adjust. 🚦 Getting smoother!",
              "3": "I transition between sub/dom modes fairly easily. 🎭 It depends on mood and partner cues.",
              "4": "Fluidity is fun! I enjoy shifting dynamics and can adapt quickly to the energy of the scene. 💃",
              "5": "I'm a dynamic chameleon! 🦎 Switching roles feels natural and exciting, adding layers to the experience."
          }},
          { name: "empathy", desc: { // Understanding the 'other side'
              "1": "It's hard to see from the other perspective. 🤔 Focusing on my own role feels easier.",
              "2": "I try to understand the other role, but it's not intuitive. Learning to see both sides.",
              "3": "I have a good sense of what the other role entails and feels like. 👍 Helps the dynamic flow.",
              "4": "I strongly empathize with both submissive and dominant perspectives. 😊 It enriches my own experience.",
              "5": "I deeply understand and connect with both sides of the coin.🪙 This empathy makes my switching seamless and intuitive."
          }}
        ]
      },
      {
        name: "Pet",
        traits: [
          { name: "affection seeking", desc: {
              "1": "Asking for praise feels... weird. 😬 I prefer to wait and see. Maybe being clearer could get more head pats?",
              "2": "I like cuddles, but I'm shy about asking! 🥺 Sometimes I hint non-verbally.",
              "3": "Head pats, please! 🥰 I enjoy seeking and receiving affection. It makes me feel loved and appreciated.",
              "4": "'Good pet!' is music to my ears! 🎶 I actively seek praise and snuggles. It's the best reward!",
              "5": "Affection is my fuel! ⛽ I thrive on constant validation and physical closeness from my Owner."
          }},
          { name: "non-verbal expression", desc: {
              "1": "Using sounds or gestures feels silly. Words are easier! 🗣️ Maybe trying a little purr could be fun?",
              "2": "Sometimes a whimper or tail wag slips out! 😉 Exploring non-verbal cues more.",
              "3": "Nuzzles, tail wags (imaginary or real!), happy sounds – they come naturally in petspace! 🐶",
              "4": "I'm fluent in Pet!  fluent I can express needs, moods, and happiness clearly without many words.",
              "5": "My body language *is* my language in petspace! 🦋 Every purr, posture, and nudge tells a story."
          }}
        ]
      },
      {
        name: "Little",
        traits: [
          { name: "age regression comfort", desc: { // Comfort level with regressing
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
        ]
      },
      {
        name: "Puppy",
        traits: [
           { name: "boundless energy", desc: { // Eagerness and enthusiasm
              "1": "Energy? More like nap time is calling. 😴 Enthusiasm takes effort.",
              "2": "I have bursts of energy, but tire easily. Pacing myself! ⚡",
              "3": "Ready to play! 🥎 I have good energy levels and enjoy active engagement.",
              "4": "Zoomies! 😄 I'm full of enthusiasm and eager to please, learn, and play hard!",
              "5": "Unstoppable puppy power! 🚀 My energy and eagerness are infectious and define my pupper self!"
          }},
          { name: "trainability", desc: { // Eagerness to learn commands/tricks
              "1": "Learning new tricks? My brain feels fuzzy. 😵‍💫 Instructions get jumbled.",
              "2": "I can learn, but need patience and repetition. Treats help! 🍖",
              "3": "Good puppy! I pick up commands and routines reasonably well. Eager to get it right! 👍",
              "4": "Ready for training! 🤓 I love learning new commands and pleasing my Owner/Handler. Super focused!",
              "5": "Top dog in training! 🏆 I learn commands instantly and perform with joyful precision. Best student ever!"
          }}
        ]
      },
      {
        name: "Kitten",
        traits: [
           { name: "curiosity", desc: { // Exploring, getting into things
              "1": "New things are scary! 🫣 I prefer sticking to the familiar.",
              "2": "I might peek from a safe distance... 🤔 Curiosity is cautious.",
              "3": "Ooh, what's that? 😮 I enjoy exploring new things, sometimes batting at them playfully.",
              "4": "Must investigate! 🧐 My curiosity leads me everywhere. I love discovering and playing with novelties.",
              "5": "Curiosity didn't kill this kitten! 😼 I'm fearlessly inquisitive, getting into *everything* with playful abandon."
          }},
          { name: "gracefulness", desc: { // Movement and poise (or playful clumsiness)
              "1": "Graceful? More like a baby giraffe on roller skates! 😵‍💫 Clumsy is my middle name.",
              "2": "Sometimes I'm sleek, sometimes I trip over air. 😅 Working on my feline finesse.",
              "3": "I move with reasonable kitten-like grace. 🐈‍⬛ Usually land on my feet!",
              "4": "Sleek and slinky! I enjoy moving with poise and a certain feline charm. ✨",
              "5": "Poetry in motion! 🩰 I move with inherent grace and agility, embodying the elegance of a cat."
          }}
        ]
      },
      {
        name: "Princess",
        traits: [
          { name: "desire for pampering", desc: {
              "1": "Pampering? Feels fussy. I'm low maintenance! 👖 Maybe a little spoiling could be nice?",
              "2": "A little treat now and then is nice, but I don't expect constant adoration. 😊",
              "3": "Being spoiled feels lovely! 👑 I enjoy being doted on and treated like royalty.",
              "4": "Adorn me! Spoil me! ✨ I thrive on being pampered, praised, and placed on a pedestal.",
              "5": "Only the best for this Princess! 💎 I expect and adore luxurious treatment and constant adoration. It's my birthright!"
          }},
          { name: "delegation tendency", desc: { // Expecting others to do things
              "1": "I prefer doing things myself! Relying on others feels inefficient. 💪",
              "2": "I'll ask for help sometimes, but usually try to handle things on my own. 🙋‍♀️",
              "3": "It's nice when others handle the mundane tasks! 😉 I appreciate having things done for me.",
              "4": "Why do it myself when someone else can? 💅 I readily delegate tasks and expect them to be done.",
              "5": "My wish is their command! 👸 I naturally expect others to cater to my needs and handle the details."
          }}
        ]
      },
      {
        name: "Rope Bunny",
        traits: [
           { name: "rope enthusiasm", desc: { // Enjoyment of being tied
              "1": "Ropes look... complicated and maybe pinchy? 😬 Feeling hesitant.",
              "2": "Curious about ropes, but need to feel safe and comfortable. Starting simple! 🥨",
              "3": "Rope time is fun time! 😊 I enjoy simple ties and the feeling of restriction.",
              "4": "More rope, please! 😍 I love the aesthetics and sensation of being tied, eager for new patterns.",
              "5": "Rope is art, and I'm the canvas! 🎨 I adore complex ties, suspension, and pushing my boundaries with rope."
          }},
          { name: "patience during tying", desc: {
              "1": "Sitting still is hard! I get fidgety and impatient quickly. ⏳",
              "2": "I can hold still for a bit, but long tying sessions test my patience. 🧘‍♀️",
              "3": "I'm reasonably patient while being tied. Understanding it takes time! 👍",
              "4": "I find a calm zen while being tied.😌 Happy to hold poses and let the Rigger work their magic.",
              "5": "Stillness is part of the surrender. 🧘‍♂️ I can hold poses indefinitely, lost in the moment of being bound."
          }}
        ]
      },
       {
        name: "Masochist",
        traits: [
            { name: "pain interpretation", desc: { // How pain is perceived/processed
                "1": "Pain just hurts! 😖 It's something to avoid. The 'pleasure' part seems confusing.",
                "2": "Okay, sometimes the intensity is... interesting? 🤔 Exploring the edge between ouch and intriguing.",
                "3": "I find release or focus through pain sometimes. 😊 It's a specific tool in the toolbox.",
                "4": "Pain often translates to pleasure or a desirable mental state for me. 🔥 Bring on the sting!",
                "5": "Pain is a symphony! 🎶 It's a direct path to ecstasy, clarity, or deep connection for me."
            }},
            { name: "sensation seeking", desc: { // Desire for intense physical input
                "1": "Intense sensations? No thank you! Gentle is best. 🫣",
                "2": "Curious about different feelings, but I prefer mild to moderate. Cautious explorer! 🧭",
                "3": "Variety is the spice of life!🌶️ I enjoy exploring different types and levels of sensation.",
                "4": "Push the limits! ✨ I crave intense, sharp, or unique sensations. Bring on the challenge!",
                "5": "More! Harder! Deeper! 🚀 I actively seek out extreme sensations to reach my desired state."
            }}
        ]
      },
      {
        name: "Prey",
        traits: [
          { name: "enjoyment of chase", desc: {
              "1": "Being chased sounds terrifying! 😱 I'd rather just hide.",
              "2": "A little playful pursuit can be okay, but real 'chase' energy is intimidating. 🫣",
              "3": "The thrill of the chase is exciting! 🥰 Running, hiding, the anticipation... it's fun!",
              "4": "Hunt me! I love the adrenaline rush of being pursued and eventually 'caught'. 🦊",
              "5": "The chase IS the ecstasy! 🌬️ I live for the dynamic of pursuit and capture, playing my role to the fullest."
          }},
          { name: "fear play comfort", desc: { // Enjoying simulated fear/vulnerability
              "1": "Real fear and play don't mix for me. Safety first! 🚫",
              "2": "Simulated fear is okay in small doses, with lots of reassurance. 🌱 Needs careful handling.",
              "3": "A little dose of 'pretend fear' can add spice! 😉 Knowing I'm safe allows me to enjoy it.",
              "4": "Playing with fear and vulnerability is thrilling! 🔥 I enjoy the intensity when I trust my partner.",
              "5": "Dancing with 'fear' is exhilarating! 🎭 I love tapping into those primal feelings in a safe container."
          }}
        ]
      },
       {
        name: "Toy",
        traits: [
          { name: "objectification comfort", desc: { // Enjoying being used/played with
              "1": "Being treated like an object? Feels dehumanizing. 😬 I need to feel like a person.",
              "2": "Okay with some 'toy-like' play sometimes, but need reminders that I'm cherished.🧸",
              "3": "It's fun being played with! 😊 I enjoy being positioned, used for pleasure, or shown off.",
              "4": "Wind me up and play! 🎁 I love being treated as a prized possession or pleasure object.",
              "5": "I exist to be used and enjoyed! 💖 Deep objectification feels incredibly fulfilling and right."
          }},
          { name: "responsiveness to control", desc: { // How readily they adapt to being manipulated/posed
              "1": "Being moved around feels awkward. I'm not very flexible or responsive.뻣",
              "2": "I can be posed, but might feel stiff or need lots of direction. Learning to relax into it. 🧘",
              "3": "I respond well to being positioned and controlled. 😊 It's part of the game!",
              "4": "Mold me! Shape me! ✨ I'm highly responsive to physical control and enjoy being manipulated.",
              "5": "Like clay in their hands! 🙌 I intuitively adapt to being posed, moved, and controlled."
          }}
        ]
      },
      {
        name: "Doll",
        traits: [
          { name: "aesthetic focus", desc: { // Importance of appearance/look
              "1": "Looks aren't important, right? Comfort first! 👖 Fussing over appearance feels tedious.",
              "2": "I like looking nice, but a specific 'doll' aesthetic takes effort I don't always have. 🎀",
              "3": "Crafting the perfect doll look is fun! 💄 I enjoy the outfits, makeup, and persona.",
              "4": "Becoming the Doll is an art! ✨ The aesthetic details are crucial and joyful to perfect.",
              "5": "Living Doll perfection! 💖 Every detail of my appearance is curated to embody the ideal. It's essential."
          }},
          { name: "stillness / passivity", desc: { // Ability/enjoyment of being still and passive
              "1": "Sitting still is torture! I need to move! 🤸‍♀️ Passivity feels boring.",
              "2": "I can be still for short periods, but get restless. Working on quiet Ccompliance. 🤫",
              "3": "Being posed and still like a doll is quite nice. 😊 A calm and passive state.",
              "4": "I love melting into stillness and passivity. 🧘‍♀️ Letting my owner arrange me is lovely.",
              "5": "Perfectly still, perfectly passive. Porcelain perfection! 🏛️ It's a state of deep surrender and display."
          }}
        ]
      },
      {
        name: "Bunny", // Often overlaps Pet/Prey but with specific shy/gentle/skittish vibe
        traits: [
          { name: "shyness / skittishness", desc: {
              "1": "Shy? I'm bold! 😎 Skittishness isn't really my vibe.",
              "2": "A little shy around new things or sudden moves. Needs gentle approach! 🌱",
              "3": "Soft and gentle... easily startled! 🐇 My bunny heart is easily flustered.",
              "4": "Peak-a-boo! I'm definitely shy and skittish, but it's part of my charm! 🥰 Needs patience.",
              "5": "The definition of skittish! 🌬️ Easily startled, quick to hide, needs the *most* gentle touch and reassurance."
          }},
          { name: "gentle affection need", desc: { // Prefers soft/gentle interaction
              "1": "Gentle? Rough and tumble is more fun! 💪 Too much softness feels bland.",
              "2": "I appreciate gentleness, but can handle some intensity too. Balance! ⚖️",
              "3": "Soft pets and gentle words are the best! 🥰 Prefers a calm and tender approach.",
              "4": "Handle with care! 🌸 I thrive on gentle touches, quiet praise, and a soft atmosphere.",
              "5": "Only the softest, gentlest touch! ☁️ Harshness is distressing. Needs a very nurturing hand."
          }}
        ]
      },
      {
        name: "Servant",
        traits: [
           { name: "task focus", desc: { // Dedication to completing assigned duties
              "1": "Duties? Ugh. My focus wanders easily. 딴짓 Distractions win!",
              "2": "I can do tasks, but might get sidetracked or need reminders. Working on focus! 🎯",
              "3": "Give me a task list! ✅ I enjoy focusing on my duties and getting them done right.",
              "4": "Mission accepted! ✨ I'm highly focused on completing my service tasks efficiently and well.",
              "5": "Laser-focused on my duties! 💡 Completing tasks perfectly is my primary goal and satisfaction."
          }},
          { name: "anticipating needs", desc: { // Proactively seeing what needs doing
              "1": "Anticipate? I barely notice what's needed now! 😵‍💫 Needs clear instructions.",
              "2": "Sometimes I spot something that needs doing... if I'm paying attention! 👀 Learning foresight.",
              "3": "I'm starting to anticipate routine needs. 👍 Feels good to be one step ahead!",
              "4": "I often see what's needed before being asked! 💡 Proactive service feels great.",
              "5": "My intuition is finely tuned! ✨ I almost always know what's needed and take care of it seamlessly."
          }}
        ]
      },
      {
        name: "Playmate",
        traits: [
           { name: "enthusiasm for games", desc: { // Eagerness to engage in playful activities/scenes
              "1": "Games? Sounds tiring. I'm not very playful. 😴",
              "2": "I'll play along sometimes, but not always my first choice. Depends on the game! 🎲",
              "3": "Game on! 😊 I enjoy playful scenes and activities. Ready for fun!",
              "4": "Let's play! 😄 I'm super enthusiastic about games, challenges, and fun scenarios.",
              "5": "Always ready to play! 🎉 My energy and enthusiasm for any game or activity is boundless!"
          }},
          { name: "good sport", desc: { // Handling winning/losing/rules playfully
              "1": "I hate losing! Or rules feel unfair. 😠 Play can get frustrating.",
              "2": "I try to be a good sport, but might get a bit sulky sometimes.😅 Learning to laugh it off.",
              "3": "Win or lose, it's all fun! 👍 I play fair and enjoy the process.",
              "4": "Excellent sport! 😊 I handle wins, losses, and silly rules with grace and laughter.",
              "5": "The perfect playmate! 🎉 I embrace the spirit of the game completely, making it fun for everyone involved."
          }}
        ]
      },
      {
        name: "Babygirl", // Often blends Little and Princess elements with a specific aesthetic
        traits: [
          { name: "vulnerability expression", desc: {
              "1": "Showing vulnerability? No way! Keep a brave face! 💪",
              "2": "I might show a crack in the armor sometimes, but true vulnerability is hard. 🛡️",
              "3": "Expressing needs and softer feelings feels okay, even nice. 🥰 Learning to lean on my partner.",
              "4": "I embrace showing my softer, needier side. 🥺 It feels authentic and strengthens the bond.",
              "5": "My vulnerability is my strength! 💖 I openly express my needs, fears, and desires, finding comfort in dependence."
          }},
          { name: "coquettishness", desc: { // Playful, teasing charm
              "1": "Flirting? Teasing? Feels awkward and unnatural.😳 Plain speaking is easier.",
              "2": "I can be a little bit charming sometimes, maybe? 😉 Still figuring out the flirty vibe.",
              "3": "A wink and a smile! 😊 I enjoy using charm and playful teasing to get my way (sometimes!).",
              "4": "Expert flirt! ✨ I love using coquettish charm and playful manipulation within the dynamic.",
              "5": "Master of allure! 💋 My default mode is charming, teasing, and wrapping my partner around my finger."
          }}
        ]
      },
      {
        name: "Captive",
        traits: [
          { name: "struggle performance", desc: { // Enjoyment/skill in 'acting'掙扎
              "1": "Struggling feels pointless or scary. I'd rather just comply. 🤷‍♀️",
              "2": "I might give a token wiggle, but 'performing' struggle feels fake. 🤔",
              "3": "Playing the part of the struggling captive can be fun! 😉 Adds drama to the scene.",
              "4": "Lights, camera, struggle! 🎬 I enjoy putting on a convincing (or playfully inept) show of resistance.",
              "5": "Oscar-worthy performance! 🏆 I love embodying the captive role, making the struggle feel real and exciting."
          }},
          { name: "acceptance of fate", desc: { // Underlying acceptance despite struggle
              "1": "This feels wrong! I need to escape! (Mentally, if not physically) 🤯 Genuine distress.",
              "2": "Okay, I'm 'caught', but I'm still mentally looking for the exit. Uneasy acceptance. 🚪",
              "3": "Alright, you win... for now. 😉 Underlying acceptance makes the 'struggle' safe and fun.",
              "4": "Deep down, I love being 'captured'. 🥰 The struggle is part of the desired narrative.",
              "5": "This is exactly where I want to be. 💖 The 'captivity' is a blissful state of surrender, despite any outward show."
          }}
        ]
      },
      {
        name: "Thrall", // Similar to Slave, often with a fantasy/hypnotic element
        traits: [
           { name: "mental focus", desc: { // Ability to deeply focus on the Dominant's will/presence
              "1": "My mind wanders constantly! Zoning out is easy. 딴짓 Hard to stay focused.",
              "2": "I try to focus, but distractions creep in. Needs effort to maintain mental connection. 🧠",
              "3": "I can tune in and focus on my Dom's presence and commands fairly well. 👍",
              "4": "Deeply focused. My world narrows down to my Dom's will when instructed. ✨",
              "5": "Total mental immersion! 🌀 I can enter a state of profound focus, utterly receptive to my Dom's influence."
          }},
          { name: "suggestibility", desc: { // Openness to suggestion/influence (can overlap hypnosis interest)
              "1": "Suggestible? I question everything! Highly resistant to influence. 🤔",
              "2": "I consider suggestions, but make my own mind up. Not easily swayed. ⚖️",
              "3": "I'm quite open to my Dom's suggestions and influence. Trust makes it easy. 😊",
              "4": "Highly suggestible within the dynamic. I enjoy letting my Dom's words shape my reality. 🌬️",
              "5": "Like putty in their hands (mentally)! 🙌 Deeply suggestible and eager to follow my Dom's mental guidance."
          }}
        ]
      },
      {
        name: "Puppet",
        traits: [
          { name: "responsiveness to direction", desc: { // How readily they follow commands for movement/action
              "1": "Following movement commands feels like learning to dance backwards! Clumsy! 😵‍💫",
              "2": "I can follow directions, but might be slow or need them repeated. Learning the strings! 🧵",
              "3": "Move here? Say this? Okay! ✅ I respond well to direct commands for action.",
              "4": "Instant response! ✨ I love being directly controlled, mirroring actions or words on command.",
              "5": "Their will is my action! 💃 I respond flawlessly and immediately to commands, like a perfectly tuned marionette."
          }},
          { name: "passivity in control", desc: { // Lack of self-initiation when 'controlled'
              "1": "I keep wanting to do my own thing! Hard to just wait for commands. 🏃‍♀️",
              "2": "Mostly passive, but sometimes I anticipate or initiate accidentally. Oops! 😅",
              "3": "I wait patiently for the next command when in 'puppet' mode. Calmly passive. 🧍‍♀️",
              "4": "Deeply passive until directed. I don't move or speak unless commanded. Still and waiting. 🤫",
              "5": "The perfect puppet! Utterly passive and responsive *only* to the Puppeteer's control."
          }}
        ]
      },
      {
        name: "Maid",
        traits: [
          { name: "attention to detail", desc: { // Focus on cleanliness, order, specific protocols
              "1": "Details? What details? Close enough is good enough! 😎 Messy is comfy.",
              "2": "I try to be neat, but often miss small things. Needs a checklist! ✅",
              "3": "Cleanliness and order are important! ✨ I pay good attention to detail in my duties.",
              "4": "Spotless! ✨ I have a keen eye for detail and take pride in perfect presentation and order.",
              "5": "Perfection is the standard! 🧐 Every detail is noticed and attended to flawlessly. Immaculate!"
          }},
          { name: "uniformity", desc: { // Comfort/enjoyment with wearing a specific uniform/attire
              "1": "Uniforms? Feels restrictive and impersonal. I like my own clothes! 👕",
              "2": "A uniform is okay sometimes, but not my favorite. Depends on the style! 🤔",
              "3": "Wearing my maid uniform helps me get into character! 😊 It feels right.",
              "4": "I love my uniform! 🥰 It defines my role and feels incredibly affirming.",
              "5": "The uniform IS me! 💖 Wearing it is essential to my identity as a maid. Utterly devoted to the look."
          }}
        ]
      },
       {
        name: "Painslut", // More specific focus than Masochist, often implies eagerness/less processing needed
        traits: [
          { name: "pain seeking", desc: { // Actively desiring/asking for pain vs. 'enduring'
              "1": "Seek pain? Why?! 😨 Avoidance is key!",
              "2": "Might tolerate pain if it leads to something else, but wouldn't ask for it. Cautious. 😬",
              "3": "Sometimes I crave that intense edge. Might hint or ask for specific sensations. 🔥",
              "4": "Yes, please! I often actively seek out and ask for pain. Crave the sting! ✨",
              "5": "Feed me pain! 🤤 My primary drive is seeking intense, painful sensations. It's what I live for!"
          }},
          { name: "endurance display", desc: { // Showing off ability to take pain
              "1": "I cry uncle fast! 🏳️ Showing endurance isn't the goal.",
              "2": "I can take some, but don't really 'show off' about it. Just trying to get through! 😅",
              "3": "Look what I can handle! 😉 Showing my toughness can be part of the fun.",
              "4": "Push me harder! 💪 I take pride in my endurance and enjoy demonstrating it.",
              "5": "Unbreakable (almost)! 💎 I love showcasing my incredible pain tolerance. It's a badge of honor!"
          }}
        ]
      },
      {
        name: "Bottom", // Often used broadly, here emphasizing receiving/power exchange aspect
        traits: [
          { name: "receptivity", desc: { // Openness to receiving sensation/instruction/energy
              "1": "Receiving feels passive/vulnerable in a scary way. I tend to block or resist. 🛡️",
              "2": "I can receive, but sometimes feel guarded or distracted. Learning to open up.🌸",
              "3": "Open and receptive! 😊 I enjoy being the receiver in the dynamic.",
              "4": "Highly receptive! ✨ I easily tune into my partner and welcome their lead/input.",
              "5": "A perfect vessel! 💖 Utterly open and receptive, absorbing and responding to my partner's energy completely."
          }},
          { name: "power exchange focus", desc: { // Conscious enjoyment of the power imbalance
              "1": "Power imbalance feels unfair or uncomfortable. Equality is better! 🤝",
              "2": "The power difference is okay sometimes, but not my main focus. 🤔",
              "3": "I enjoy the dynamic of giving power to my partner. 👍 It feels right for me.",
              "4": "The power exchange is central and exciting! 🔥 I love feeling the difference in roles.",
              "5": "Giving up power is profoundly fulfilling! 💖 The imbalance *is* the core of my satisfaction."
          }}
        ]
      }
    ]
  },
  dominant: {
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
      }
    ],
    styles: [
      // --- NEW DOMINANT STYLES ---
      {
        name: "Dominant", // General/Classic
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
        ]
      },
       {
        name: "Assertive", // Focus on clear communication and boundaries, less on heavy control
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
        ]
      },
       {
        name: "Nurturer", // Can overlap Caregiver, but maybe less 'parental'
        traits: [
          { name: "emotional support", desc: { // Providing comfort, validation, encouragement
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
        ]
      },
       {
        name: "Strict",
        traits: [
          { name: "rule enforcement", desc: {
              "1": "Enforcing rules feels harsh. I tend to let things slide. 😟 Maybe structure is helpful?",
              "2": "I have rules, but consistency is tricky. Sometimes I forget or give in. 😅",
              "3": "Rules are rules! ✅ I enforce them consistently and fairly.",
              "4": "No excuses! 💪 I maintain high standards and enforce rules strictly.",
              "5": "Iron fist in a velvet glove (or maybe just iron!). ✊ Absolute adherence to rules is expected and enforced."
          }},
          { name: "discipline focus", desc: { // Emphasis on correction/training through discipline
              "1": "Discipline sounds scary! 😨 I prefer positive reinforcement only.",
              "2": "Might issue a 'punishment' sometimes, but hesitant about it. Exploring its role. 🤔",
              "3": "Discipline is a tool for growth and maintaining order. Used appropriately. 🧐",
              "4": "Clear consequences for rule-breaking. Discipline is essential for training and structure. 🔥",
              "5": "Master of discipline! ⚖️ Consequences are delivered precisely and effectively to shape behavior."
          }}
        ]
      },
       {
        name: "Master", // Often implies ownership, high standards, possibly training focus
        traits: [
          { name: "expectation setting", desc: {
              "1": "Expectations? Uh... just be good? 🤔 Vague goals, unclear standards.",
              "2": "I have some expectations, but could define them better. Work in progress! 📝",
              "3": "Clear standards and protocols are important. My property knows what's expected. 👍",
              "4": "High standards, clearly communicated. Excellence is the goal! 🏆",
              "5": "Impeccable standards! 💎 Every detail of behavior and service is defined and expected."
          }},
          { name: "presence", desc: { // Aura of command and authority
              "1": "I blend into the background... 👤 Commanding presence feels unnatural.",
              "2": "Trying to project authority, but sometimes feel self-conscious. Fake it 'til you make it? 😎",
              "3": "My presence is felt. Authority comes naturally in my domain. 🔥",
              "4": "When I enter, the dynamic shifts. My presence commands attention effortlessly. ✨",
              "5": "Radiating power! 👑 My presence alone conveys authority and demands respect."
          }}
        ]
      },
      {
        name: "Mistress", // Female equivalent of Master, shares many traits
        traits: [
          // Often same traits as Master, descriptions can have slightly different flavor
          { name: "expectation setting", desc: {
              "1": "Expectations? Just... be devoted? 🤔 Standards feel fuzzy.",
              "2": "Setting clear rules takes practice. Working on defining my requirements. 📝",
              "3": "My expectations are clear. My submissive knows their duties and protocols. 👍",
              "4": "High standards for service and devotion. Excellence is expected and rewarded. 🌹",
              "5": "Exquisite standards! 💎 Precision in service and absolute loyalty are paramount."
          }},
          { name: "presence", desc: {
              "1": "Commanding attention feels... loud. I prefer quiet influence. 🤫",
              "2": "Working on projecting that 'Mistress aura'. Confidence is key! ✨",
              "3": "My authority is felt. My presence naturally guides the dynamic. 🔥",
              "4": "Effortless command. My presence captivates and directs attention. 💅",
              "5": "Regal presence! 👑 Radiating elegance and absolute authority. Respect is given, not demanded."
          }}
        ]
      },
       {
        name: "Daddy", // Often overlaps Caregiver, focuses on paternal/guiding role
        traits: [
          // Often same traits as Caretaker/Nurturer, descriptions have paternal flavor
           { name: "protective guidance", desc: { // Providing safety, rules, and fatherly advice/care
              "1": "Guidance feels... preachy. They can figure it out! 🤔",
              "2": "I offer advice sometimes, but worry about being overbearing. Finding the balance. 👨‍👧‍👦",
              "3": "Looking out for my little one/partner is natural. Providing rules and support feels right. 😊",
              "4": "Your safe harbor! ⚓ I provide strong guidance, protection, and clear rules for well-being.",
              "5": "The ultimate Daddy Bear! 🐻 My guidance is unwavering, my protection absolute. Always here."
          }},
          { name: "affectionate authority", desc: { // Blending sternness with warmth/praise
              "1": "Authority OR affection, not both! Mixing them feels confusing. 🤷‍♂️",
              "2": "Trying to balance firm rules with praise. Sometimes one overshadows the other.⚖️",
              "3": "Firm but fair, with plenty of praise! 👍 A good balance of discipline and love.",
              "4": "Warm hugs and stern rules! 🥰 Masterfully blends authority with deep affection.",
              "5": "The perfect blend!💖 Authority *is* affection. Every rule, every praise comes from a place of deep care."
          }}
        ]
      },
      {
        name: "Mommy", // Often overlaps Caregiver, focuses on maternal/guiding role
        traits: [
           // Often same traits as Caretaker/Nurturer, descriptions have maternal flavor
          { name: "nurturing comfort", desc: { // Providing soothing, care, rules like a mother
              "1": "Nurturing feels... smothering? Prefers a less hands-on approach. 🤷‍♀️",
              "2": "I can be comforting, but not always my default mode. Learning to soothe! 🤱",
              "3": "Kiss it better! 😊 Providing comfort, care, and gentle rules comes naturally.",
              "4": "Your safe haven! 🥰 I excel at providing nurturing comfort, warmth, and loving guidance.",
              "5": "The ultimate Mommy! 💖 My embrace is home. Intuitive nurturing and unwavering support."
          }},
          { name: "gentle discipline", desc: { // Discipline focused on teaching/guidance, less harshness
              "1": "Discipline just feels mean! 😥 Avoids correction.",
              "2": "Prefers talking things through. Formal 'discipline' feels awkward.💬",
              "3": "Consequences are learning opportunities. Gentle correction to guide behavior. 🌱",
              "4": "Firm but gentle hand. Discipline is always delivered with love and explanation. ❤️",
              "5": "Master of gentle guidance! 👩‍🏫 Correction is seamless, always focused on growth and understanding."
          }}
        ]
      },
       {
        name: "Owner", // Focus on possession, control, possibly pet dynamics
        traits: [
           { name: "possessiveness", desc: { // Feeling/displaying ownership
              "1": "Possessive? People aren't things! Feels wrong. 😬",
              "2": "A little protective, maybe? True 'ownership' feels intense. 🤔",
              "3": "'Mine.' 👍 A comfortable sense of ownership and protectiveness.",
              "4": "Clearly MINE. ✨ Displaying ownership feels natural and affirming.",
              "5": "Absolute possession! 💖 My property belongs to me, body and soul. This is fundamental."
          }},
          { name: "behavioral training", desc: { // Shaping desired behaviors (esp. for pets/slaves)
              "1": "Training sounds like... work. They should just *know*! 🤷‍♂️",
              "2": "I give some direction, but structured 'training' is hit-or-miss. Needs more consistency! 🦴",
              "3": "Training routines help shape desired behavior. Using rewards and correction effectively. ✅",
              "4": "Skilled trainer! 💪 I effectively use conditioning to cultivate specific behaviors.",
              "5": "Master behavioralist! 🧠 Intuitive understanding of how to shape and perfect my property's behavior."
          }}
        ]
      },
       {
        name: "Rigger",
        traits: [
          { name: "rope technique", desc: { // Skill with knots and patterns
              "1": "Rope looks like spaghetti! 🍝 Knots are confusing and tangle easily.",
              "2": "Learning the basics! Can manage a simple tie or two. Practice makes perfect! 🥨",
              "3": "Comfortable with several ties and basic safety. Enjoying the process! 👍",
              "4": "Skilled rope artist! ✨ Confident with complex patterns, suspensions, and aesthetics.",
              "5": "Rope Master! 🕸️ Intricate, beautiful, and secure ties flow effortlessly. Technique is flawless."
          }},
          { name: "aesthetic vision", desc: { // Focus on the visual appearance of the ropework
              "1": "Just getting it tied is the goal! Looks don't matter much. 🤷‍♀️",
              "2": "Trying to make it look neat, but function comes first. Aesthetics are secondary. 🤔",
              "3": "Presentation matters! 😊 I consider symmetry and visual appeal while tying.",
              "4": "Creating rope art! ✨ The visual impact of the tie is a major focus and source of pleasure.",
              "5": "Sculpting with rope! 🎨 Every knot and line placement is intentional, creating breathtaking aesthetics."
          }}
        ]
      },
      {
        name: "Sadist",
        traits: [
          { name: "sensation control", desc: { // Delivering pain/sensation precisely
              "1": "Causing pain feels uncontrolled/scary. 😨 Hesitant to inflict sensation.",
              "2": "Experimenting cautiously. Finding the right level is tricky! Needs careful calibration.🌡️",
              "3": "Getting the hang of delivering different sensations. Reading reactions better! 🔥",
              "4": "Skilled conductor of sensation! ✨ Enjoy orchestrating experiences with precision and creativity.",
              "5": "Master of the senses! 🖤 Delivering pain and pleasure with artistic precision. Intuitive control."
          }},
          { name: "psychological focus", desc: { // Enjoyment derived from partner's reaction/mental state
              "1": "Partner's reaction? I'm focused on the *action*. What they feel is... secondary? 🤔",
              "2": "Noticing reactions more. Starting to see how their experience adds to mine. 👀",
              "3": "Their reactions (fear, pleasure, struggle) are fascinating! Adds depth to the scene.🎭",
              "4": "I thrive on observing and influencing my partner's psychological state. Their response is key! 🔑",
              "5": "The intricate dance of their mind and body is intoxicating! 🍷 Their reaction *is* the masterpiece."
          }}
        ]
      },
       {
        name: "Hunter", // Focus on the chase, capture, primal energy (overlaps Primal)
        traits: [
          { name: "pursuit drive", desc: { // Enjoyment/instinct to chase/track
              "1": "Chasing? Sounds exhausting! I prefer my prey come to me. 🥱",
              "2": "A little playful pursuit is okay. A real 'hunt' feels too intense. 😅",
              "3": "The thrill of the hunt is exciting! Tracking, cornering, capturing... adrenaline! 🏹",
              "4": "Born predator! 🐺 I love the chase, the strategy, the moment of capture.",
              "5": "The hunt is everything! 🦅 My instincts take over. Pursuit and capture are primal joys."
          }},
          { name: "instinct reliance", desc: { // Acting on gut feeling/primal urges vs. planning
              "1": "Instincts? I need a plan! Acting on impulse feels chaotic. 🗺️",
              "2": "Sometimes I follow a gut feeling, but prefer a clear strategy. Balance! 🧠",
              "3": "Trusting my instincts feels good! Letting primal energy guide some actions. 🔥",
              "4": "My instincts are sharp! 🐾 Acting on primal urges feels natural and powerful.",
              "5": "Pure instinct! ⚡ My actions flow from a deep, primal core. Thought takes a backseat."
          }}
        ]
      },
       {
        name: "Trainer",
        traits: [
          { name: "skill development focus", desc: { // Goal is teaching/improving the sub's abilities
              "1": "Teaching? They should just know! Or learn on their own. 🤷‍♂️",
              "2": "I offer some guidance, but structured training takes planning. 🤔",
              "3": "Helping my submissive learn and grow is rewarding! Setting tasks and goals.📈",
              "4": "Dedicated trainer! 💪 I design specific exercises and methods to improve skills.",
              "5": "Master coach! 🥇 I excel at identifying potential and cultivating skills to perfection."
          }},
          { name: "structured methodology", desc: { // Using clear steps, feedback, progression
              "1": "Method? Just... do it! Winging it is easier. 🕊️",
              "2": "I have some steps in mind, but it's not very formalized. Learning structure! 🧱",
              "3": "Clear steps, regular feedback. A structured approach works best for training. ✅",
              "4": "Systematic training! ✨ Using well-defined methods, progression levels, and evaluations.",
              "5": "The perfect curriculum! 👨‍🏫 My training methodology is precise, effective, and tailored."
          }}
        ]
      },
      {
        name: "Puppeteer",
        traits: [
          { name: "fine motor control", desc: { // Precise control over sub's actions/words
              "1": "Detailed control? Too fiddly! Broad strokes are easier. 🎨",
              "2": "Working on precise commands. Sometimes my 'strings' get tangled! 😅",
              "3": "Guiding movements and responses with specific commands feels good. Nice control! 👍",
              "4": "Master manipulator! ✨ I enjoy exacting control over my puppet's every move and word.",
              "5": "Absolute micro-control! 🕹️ Every nuance of action and speech is directed with precision."
          }},
          { name: "objectification gaze", desc: { // Viewing/treating the sub as an object to be controlled
              "1": "Viewing someone as an object feels wrong. Need that human connection! ❤️",
              "2": "Can detach sometimes, but still see the person behind the 'puppet'. Balance! 🎭",
              "3": "Shifting into that 'Puppeteer mindset' where they are my beautiful marionette. Fun! 😊",
              "4": "Deep enjoyment in the objectification. They are mine to control and display. 💎",
              "5": "Complete immersion in the Puppeteer role. The puppet exists solely for my direction. 💯"
          }}
        ]
      },
      {
        name: "Protector",
        traits: [
          { name: "vigilance", desc: { // Awareness of threats/dangers to the sub
              "1": "Threats? Everything seems fine! 😎 Not very watchful.",
              "2": "I try to be aware, but might miss subtle dangers. Learning to be more observant! 👀",
              "3": "Keeping an eye out! Aware of potential issues and ready to step in. 🛡️",
              "4": "Ever watchful guardian! ✨ Highly attuned to potential threats, always ready to protect.",
              "5": "Eagle eyes! 🦅 Nothing gets past me. My vigilance ensures absolute safety."
          }},
          { name: "defensive instinct", desc: { // Drive to shield/defend the sub
              "1": "Defend? They can handle themselves! Avoids conflict. 🤷‍♀️",
              "2": "I'll step in if things get serious, but hesitant to jump the gun. 🤔",
              "3": "Don't mess with mine! 💪 Strong instinct to shield and defend my partner.",
              "4": "Fiercely protective! 🔥 Will immediately and decisively neutralize any threat.",
              "5": "Unbreakable shield! 💖 My core drive is to protect my charge from all harm, no matter the cost."
          }}
        ]
      },
       {
        name: "Disciplinarian", // Focus specifically on punishment/correction aspect of Strict
        traits: [
          { name: "consequence delivery", desc: { // Comfort and precision in administering punishment
              "1": "Punishment feels awful to give. Avoid it at all costs! 😥",
              "2": "Hesitant and maybe inconsistent when delivering consequences. Feels uncomfortable. 😬",
              "3": "Fair and firm. Delivering consequences is a necessary part of the role. ⚖️",
              "4": "Punishment delivered decisively and effectively. Calm and controlled. 🔥",
              "5": "Master of correction! 👨‍⚖️ Consequences are administered with precision, impact, and clear purpose."
          }},
          { name: "detachment during discipline", desc: { // Ability to remain objective/unemotional
              "1": "Gets emotional (angry/sad/guilty) during punishment. Hard to stay objective. 🥺",
              "2": "Trying to stay calm, but emotions can interfere sometimes. Needs practice! 🧘",
              "3": "Objective and calm during discipline. Focus is on the lesson, not emotion. 👍",
              "4": "Cool under pressure. Delivers discipline with focused detachment. 🧊",
              "5": "Ice-cold precision (when needed)! ❄️ Complete emotional detachment ensures fairness and effectiveness."
          }}
        ]
      },
      {
        name: "Caretaker", // Broader than Nurturer, includes practical needs
        traits: [
          { name: "holistic well-being focus", desc: { // Concern for physical, emotional, practical needs
              "1": "Well-being? As long as they're breathing! 😉 Focus is elsewhere.",
              "2": "Checks on basic safety/comfort, but deeper needs might be missed. Learning holistic care! ❤️‍🩹",
              "3": "Attentive to overall well-being – emotional state, physical comfort, basic needs. 😊",
              "4": "Total care package! ✨ Proactively manages emotional, physical, and even practical needs.",
              "5": "Guardian of well-being! 🌟 Intuitively understands and provides for *all* aspects of partner's needs."
          }},
          { name: "rule implementation for safety", desc: { // Setting rules primarily for health/safety/routine
              "1": "Rules? Too much hassle! They're responsible for themselves. 🤷",
              "2": "Suggests 'healthy habits' but doesn't enforce them strictly. Gentle guidance!  nudge",
              "3": "Sets practical rules (bedtime, hydration, etc.) for partner's benefit. 👍",
              "4": "Clear routines and safety rules are key! Enforces them lovingly but firmly. ✅",
              "5": "Master of preventative care! 👨‍⚕️ My rules create a perfectly safe and healthy environment."
          }}
        ]
      },
       {
        name: "Sir", // Formal, respectful, often service-oriented Dominant
        traits: [
          { name: "formal demeanor", desc: { // Maintaining respectful, perhaps slightly distant, authority
              "1": "Formal? I'm super casual! 😎 Respect is shown in other ways.",
              "2": "Can be formal when needed, but prefers relaxed interaction. Finding the balance!👔",
              "3": "Maintains a respectful, formal tone appropriate to the 'Sir' role. Polite authority. 😊",
              "4": "Calm, formal, and commanding presence. Respect is inherent in the demeanor. ✨",
              "5": "The epitome of formal authority! 🎩 Every word and action conveys dignified command."
          }},
          { name: "service expectation", desc: { // Clear expectation of receiving proper service/respect
              "1": "Service? Not really my focus. As long as they're happy!🤷‍♂️",
              "2": "Appreciates good service, but doesn't have strict protocols for it. Laid back!😌",
              "3": "Expects proper service and respectful address ('Sir'). Clear but fair standards.✅",
              "4": "High standards for service and etiquette are expected and enforced politely.🧐",
              "5": "Impeccable service is mandatory! ✨ Every detail of respectful service is noticed and required."
          }}
        ]
      },
      {
        name: "Goddess",
        traits: [
          { name: "worship seeking", desc: { // Desire/expectation of adoration and reverence
              "1": "Worship? Feels embarrassing! 😳 Just treat me normally!",
              "2": "A little adoration is nice, but full 'worship' feels intense. 🤔",
              "3": "Being adored feels wonderful! 🥰 Enjoys reverence and acts of devotion.",
              "4": "Bask in my glory! ✨ Thrives on worship, adoration, and being treated as divine.",
              "5": "I AM divine! 👑 Worship is my due. Expects and revels in total reverence."
          }},
          { name: "effortless command", desc: { // Authority that seems innate, requires little overt effort
              "1": "Commanding takes effort! Needs clear instructions and maybe some shouting! 📣",
              "2": "Working on making commands feel less forceful, more... inevitable? Needs practice! ✨",
              "3": "My desires are usually understood and followed with minimal fuss. Calm authority. 😊",
              "4": "A simple look or word is enough. Command flows effortlessly. 🌬️",
              "5": "My will shapes reality! 💖 Command is inherent, effortless, and instantly obeyed."
          }}
        ]
      },
      {
        name: "Commander",
        traits: [
          { name: "strategic direction", desc: { // Focus on giving orders, managing tasks/scenes like a leader
              "1": "Strategy? Let's just wing it! Plans are boring. 🤷‍♀️",
              "2": "Has a general idea, but tactical details are fuzzy. Learning to plan! 🗺️",
              "3": "Clear objectives, clear orders! Enjoys directing the action effectively. 👍",
              "4": "Master strategist! ✨ Plans and directs complex scenes or tasks with precision.",
              "5": "Flawless command and control! 🎖️ Every order is strategic, efficient, and perfectly executed."
          }},
          { name: "decisiveness", desc: { // Ability to make quick, firm decisions
              "1": "Decisions are hard! What if I choose wrong? 🤯 Hesitates constantly.",
              "2": "Takes time to decide, might second-guess. Working on confidence! 🤔",
              "3": "Makes clear decisions and sticks to them. Confident leadership! ✅",
              "4": "Swift and decisive! 💪 Makes firm choices quickly and confidently.",
              "5": "Instantaneous, unwavering decisions! ⚡ Absolute decisiveness under any circumstance."
          }}
        ]
      }
    ]
  }
};
