export const bdsmData = {
  submissive: {
    coreTraits: [
      {
        name: "obedience",
        desc: {
          "1": "Following instructions feels like trying to herd cats—I tend to resist or question. Maybe exploring *why* could unlock new dynamics!",
          "2": "I can follow instructions, but often hesitate or need clarification. I'm dipping my toes in, learning the rhythm.",
          "3": "I'm generally obedient, though might need occasional reminders. Following instructions feels comfortable most of the time.",
          "4": "I enjoy following instructions and feel pride in doing so promptly. It feels natural and fulfilling.",
          "5": "Obedience is deeply fulfilling! I thrive on anticipating and executing commands, feeling connected and purposeful."
        }
      },
      {
        name: "trust",
        desc: {
          "1": "Trusting others feels risky; I tend to hold back and feel guarded. Building trust step-by-step could enrich my connections.",
          "2": "I trust cautiously, needing time and reassurance to feel secure. It's a slow build, but I'm getting there.",
          "3": "I generally trust my partners, though might need occasional reassurance. I feel mostly safe and secure.",
          "4": "Trust comes relatively easily for me. I feel secure and rely on my partners, which strengthens our dynamic.",
          "5": "I trust deeply and wholeheartedly. Handing over control feels natural and safe, forming the bedrock of my submission."
        }
      }
    ],
    styles: [
      { // General Baseline
        name: "Submissive",
        traits: [
          { name: "humility", desc: {
              "1": "Admitting fault or showing deference feels tough; my pride gets in the way. Softening this could open new paths.",
              "2": "I can be humble, but sometimes struggle with ego. Learning to embrace vulnerability is a journey.",
              "3": "I'm generally humble and receptive to guidance. Recognizing my place feels natural.",
              "4": "Humility comes easily; I readily defer and learn from others. It feels right and respectful.",
              "5": "Deep humility defines me. I find joy and purpose in acknowledging my place and serving."
          }},
          { name: "service", desc: {
              "1": "Acts of service feel like chores; I often avoid or resist them. Finding joy in service could be a growth area.",
              "2": "I perform acts of service when asked, but don't often seek them out. I'm learning the fulfillment it can bring.",
              "3": "I willingly perform acts of service and find satisfaction in being helpful. It's a regular part of my expression.",
              "4": "I actively look for ways to serve and take pleasure in anticipating needs. Service feels like a core part of my role.",
              "5": "Serving others is a deep source of joy and identity. I feel most myself when fulfilling needs and desires through service."
          }}
        ]
      },
      {
        name: "Brat",
        traits: [
          { name: "playfulness", desc: {
              "1": "I'm more serious than playful; teasing feels awkward. Learning to embrace lightheartedness could add fun.",
              "2": "I can be playful sometimes, but it doesn't come naturally. I'm exploring my cheeky side.",
              "3": "I enjoy playful banter and light teasing. It's a fun way to interact within the dynamic.",
              "4": "Playfulness is my jam! I love witty remarks and pushing boundaries playfully.",
              "5": "I'm a master of playful defiance and teasing! It's how I connect and challenge, always with a spark."
          }},
          { name: "resilience", desc: { // Ability to handle consequences
              "1": "Consequences sting; I tend to retreat after being put in my place. Building resilience could help me bounce back.",
              "2": "I can handle consequences, but they sometimes dampen my spirit. I'm learning to take them in stride.",
              "3": "I generally handle consequences well, understanding they're part of the game. I bounce back fairly quickly.",
              "4": "I take consequences with a grin (mostly!). It's part of the fun, and I'm ready for the next round.",
              "5": "Bring it on! Consequences fuel my fire. I bounce back easily, often with more sass than before."
          }}
        ]
      },
      {
        name: "Slave", // Depth of devotion/ownership
        traits: [
          { name: "devotion", desc: {
              "1": "Deep devotion feels intense; I'm hesitant to commit so fully. Exploring deeper connection is a potential path.",
              "2": "I feel loyal, but deep devotion is something I'm still exploring. It takes time to build that intensity.",
              "3": "I am devoted to my Dominant and find comfort in that connection. It's a strong pillar of my identity.",
              "4": "My devotion is profound and central to my being. Serving my Dominant is my primary focus.",
              "5": "Absolute devotion defines me. My identity is intertwined with my Dominant; their needs are my purpose."
          }},
          { name: "surrender", desc: {
              "1": "Letting go completely feels scary; I hold onto parts of myself. Practicing deeper surrender could be transformative.",
              "2": "I surrender in specific contexts but find total surrender challenging. I'm learning to let go more.",
              "3": "I comfortably surrender control in most situations within the dynamic. It feels freeing.",
              "4": "Deep surrender is natural and welcome. I readily yield my autonomy within the established boundaries.",
              "5": "Complete surrender is my desired state. I find peace and fulfillment in yielding entirely to my Dominant's will."
          }}
        ]
      },
      {
        name: "Pet",
        traits: [
          { name: "affection seeking", desc: {
              "1": "Seeking praise feels needy; I tend to keep my desires quiet. Learning to ask for affection could be rewarding.",
              "2": "I like affection but am sometimes hesitant to seek it openly. I'm learning to express my need for praise.",
              "3": "I enjoy seeking and receiving affection and praise. It's a happy part of my interaction.",
              "4": "I actively seek affection and thrive on praise! Head pats and 'good girl/boy/pet' are the best.",
              "5": "Constant affection and praise are my fuel! I'm happiest when basking in my Owner's approval."
          }},
          { name: "non-verbal communication", desc: { // Expressing needs/moods like a pet
              "1": "Expressing myself non-verbally feels silly; I rely on words. Exploring body language could add a new layer.",
              "2": "I sometimes use non-verbal cues, but it's not my main mode. I'm experimenting with purrs, whimpers, or postures.",
              "3": "I comfortably use non-verbal cues alongside words to express myself. It feels natural in petspace.",
              "4": "I'm skilled at non-verbal expression, conveying needs and moods effectively without words. It's a key part of my pet persona.",
              "5": "Non-verbal communication is my primary language in petspace! I express everything through action, sound, and posture."
          }}
        ]
      },
       {
        name: "Little", // Focus on age regression/play aspects
        traits: [
          { name: "innocence play", desc: {
              "1": "Acting 'innocent' or child-like feels unnatural; I'm more comfortable as an adult. Exploring this side could be revealing.",
              "2": "I can dip into a 'little' headspace sometimes, but it feels fleeting. I'm curious about exploring it more.",
              "3": "I enjoy expressing a more innocent, child-like side. It feels comforting and playful.",
              "4": "Embracing my 'little' side comes easily and feels authentic. Play, wonder, and vulnerability are key.",
              "5": "My 'little' self is a core part of me. I thrive in that headspace, finding joy in innocence and dependence."
          }},
          { name: "need for guidance", desc: { // Relying on a Caregiver
              "1": "I prefer independence; relying heavily on guidance feels restrictive. Learning to accept care could be beneficial.",
              "2": "I accept guidance sometimes but value my autonomy. Balancing dependence and independence is key.",
              "3": "I comfortably rely on my Caregiver for guidance and structure. It feels safe and reassuring.",
              "4": "I thrive on having a Caregiver's guidance and rules. It provides security and allows me to relax into my role.",
              "5": "Complete reliance on my Caregiver is essential to my 'little' self. Their guidance is my world."
          }}
        ]
      },
      {
        name: "Masochist",
        traits: [
            { name: "pain endurance", desc: {
                "1": "Pain is mostly just... pain. Exploring how sensation play *could* be enjoyable is a big step.",
                "2": "I can take some pain, but mostly grit my teeth through it. I'm learning about the line between discomfort and pleasure.",
                "3": "I find a certain satisfaction in enduring pain within limits. It's an interesting edge to explore.",
                "4": "I often find pleasure or release through pain. Enduring sensation is a key part of my experience.",
                "5": "Pain is a gateway to intense pleasure and transcendence for me. I actively seek and embrace challenging sensations."
            }},
            { name: "sensation seeking", desc: {
                "1": "Intense sensations are intimidating. Starting small and focusing on safety is important for me.",
                "2": "I'm curious about different sensations but hesitant. Exploring textures, temperatures, or light impact could be a start.",
                "3": "I enjoy exploring a variety of sensations, finding pleasure in moderate intensity and novelty.",
                "4": "I actively seek out new and intense sensations. Variety and intensity are exciting and fulfilling.",
                "5": "Pushing my sensory limits is thrilling! I crave intense, unique, and challenging physical experiences."
            }}
        ]
      }
      // Add more sub styles here if desired: e.g., Service Submissive, Impact Sub, etc.
    ]
  },
  dominant: {
    coreTraits: [
      {
        name: "authority",
        desc: {
          "1": "Taking charge feels awkward; I prefer to follow or collaborate. Building confidence in small leadership moments is key.",
          "2": "I can take charge when necessary but often second-guess myself. I'm practicing projecting confidence.",
          "3": "I'm comfortable taking charge in familiar situations. Authority feels natural most of the time.",
          "4": "I enjoy being in charge and confidently direct others. Leading feels empowering and fulfilling.",
          "5": "Authority is my natural element. I command presence and lead decisively, finding deep satisfaction in the role."
        }
      },
      {
        name: "care", // Renamed from responsibility for broader scope
        desc: {
          "1": "Focusing on a partner's needs feels difficult; I'm often caught up in my own experience. Developing attentiveness is a goal.",
          "2": "I try to be caring but sometimes miss cues or forget check-ins. I'm working on being more consistently attentive.",
          "3": "I actively care for my partner's well-being, checking in and providing support. It's an important part of my dominance.",
          "4": "My partner's well-being is a top priority. I'm highly attuned to their needs and proactively offer care and aftercare.",
          "5": "Deep, intuitive care is central to my dominance. Ensuring my partner's safety, comfort, and growth is paramount and fulfilling."
        }
      }
    ],
    styles: [
      { // General Baseline
        name: "Dominant",
        traits: [
          { name: "leadership", desc: {
              "1": "Leading feels daunting; I struggle to set direction. Practicing small-scale guidance could build skills.",
              "2": "I can lead, but sometimes lack clear vision or decisiveness. I'm learning to be more assertive in my direction.",
              "3": "I provide clear leadership and direction in most situations. Guiding my partner feels comfortable.",
              "4": "I am a confident and inspiring leader. Setting goals and guiding my partner towards them is rewarding.",
              "5": "Natural leadership defines my style. I effortlessly guide, inspire, and shape the dynamic with vision and purpose."
          }},
          { name: "control", desc: {
              "1": "Exercising control feels unnatural or overly harsh. Exploring the *positive* aspects of control could be insightful.",
              "2": "I exert control sometimes but worry about being 'too much'. Finding a balance that feels right is key.",
              "3": "I comfortably maintain control within the dynamic. Setting boundaries and expectations feels natural.",
              "4": "I enjoy exercising control and find satisfaction in structuring the dynamic. It feels purposeful and grounding.",
              "5": "Masterful control is integral to my dominance. I thrive on shaping the experience and guiding my partner with precision."
          }}
        ]
      },
      {
        name: "Master / Mistress", // Focus on ownership, training, high protocol
        traits: [
          { name: "expectation setting", desc: {
              "1": "Setting clear expectations is hard; I tend to be vague. Learning to define rules and standards is a growth area.",
              "2": "I set some expectations but could be more consistent or detailed. Refining my standards is ongoing.",
              "3": "I clearly communicate expectations and rules for my submissive/slave. Structure is important to me.",
              "4": "I have high standards and clearly defined expectations. Maintaining protocol and discipline is key.",
              "5": "Setting and enforcing rigorous expectations is fundamental. I cultivate excellence and dedication through clear, high standards."
          }},
          { name: "presence", desc: { // Commanding attention, aura of authority
              "1": "Commanding attention feels forced; I'm naturally more reserved. Building a stronger presence takes practice.",
              "2": "I can project authority but sometimes doubt my impact. Working on posture and vocal tone helps.",
              "3": "I have a noticeable presence and naturally draw attention when I choose. Authority feels inherent.",
              "4": "My presence is strong and commands respect. I easily hold attention and convey authority without effort.",
              "5": "My presence is captivating and undeniable. I command the room effortlessly, embodying power and control."
          }}
        ]
      },
      {
        name: "Sadist",
        traits: [
          { name: "sensation control", desc: { // Delivering pain/sensation precisely
              "1": "Causing pain feels wrong or uncontrolled; I'm hesitant. Learning safe techniques and reading cues is crucial.",
              "2": "I experiment with causing sensation but worry about calibration. Learning to fine-tune intensity is key.",
              "3": "I can deliver a range of sensations effectively, reading my partner's reactions. Control is developing.",
              "4": "I skillfully manipulate sensation, pushing boundaries safely and creatively. Orchestrating experiences is enjoyable.",
              "5": "I am a master of sensation, delivering pain and pleasure with precision and artistry. Reading and controlling reactions is intuitive."
          }},
          { name: "psychological play", desc: { // Enjoyment derived from partner's reaction
              "1": "Focusing on my partner's reaction feels invasive or secondary. Understanding the shared pleasure is a step.",
              "2": "I notice my partner's reactions but don't always focus on them. Learning to enjoy their response is part of the journey.",
              "3": "My partner's reactions (fear, pleasure, struggle) are interesting and add to the experience.",
              "4": "I derive significant pleasure from observing and influencing my partner's psychological and physical reactions.",
              "5": "The intricate dance of my partner's reaction is the core of my satisfaction. Their experience fuels my own profoundly."
          }}
        ]
      },
      {
        name: "Caregiver / Daddy / Mommy", // Focus on nurturing dominance
        traits: [
          { name: "nurturing", desc: {
              "1": "Nurturing feels awkward or smothering; I prefer distance. Learning gentle ways to show care is a possibility.",
              "2": "I can be nurturing but it's not my default. I'm learning to provide comfort and support more readily.",
              "3": "Providing care, comfort, and structure feels natural and rewarding. It's a key part of my dominant style.",
              "4": "I thrive on nurturing my little/partner, providing safety, rules, and affection. Their well-being is paramount.",
              "5": "Deeply intuitive nurturing defines my dominance. I excel at creating a safe, loving, structured environment."
          }},
          { name: "rule setting", desc: { // Providing structure and guidance
              "1": "Setting rules feels overly controlling or childish. Understanding their role in providing security is key.",
              "2": "I set some rules but could be clearer or more consistent. Defining boundaries is a work in progress.",
              "3": "I comfortably set rules and routines that provide structure and guidance. It helps my partner feel secure.",
              "4": "Setting clear, consistent rules is essential to my style. I enjoy providing this framework for my partner.",
              "5": "Masterful rule-setting creates a predictable and safe world. I excel at designing and maintaining beneficial structures."
          }}
        ]
      },
      {
        name: "Primal (Hunter / Beast)", // Focus on instinct, non-verbal, raw power
        traits: [
          { name: "instinct expression", desc: {
              "1": "Acting on instinct feels chaotic or embarrassing. Tapping into a more raw side is a big leap.",
              "2": "I sometimes access a more primal state, but it feels hesitant. Letting go of inhibition is the challenge.",
              "3": "I enjoy expressing more primal instincts like possessiveness or dominance through growls, posture, or chasing.",
              "4": "Tapping into my primal side feels natural and powerful. Instinct guides my actions in this headspace.",
              "5": "My primal self is potent and easily accessed. I embody raw power, instinct, and non-verbal dominance effortlessly."
          }},
          { name: "physical dominance", desc: { // Control through physicality (pinning, chasing, etc.)
              "1": "Using physicality feels aggressive or clumsy. Learning safe and controlled physical expression is important.",
              "2": "I use some physical dominance but worry about strength or control. Practicing safe pinning or chasing helps.",
              "3": "I comfortably use my physicality to express dominance – pinning, holding, or playful chasing feels natural.",
              "4": "Physical dominance is a key part of my primal expression. I skillfully use strength and movement to control.",
              "5": "Masterful physical control defines my primal style. I use my body intuitively and powerfully to dominate."
          }}
        ]
      }
      // Add more dom styles here if desired: e.g., Trainer, Switch (could be role?), Hypnotist, etc.
    ]
  }
};
