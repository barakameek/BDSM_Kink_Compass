// Submissive styles data extracted from your "Detailed Style Guide"
const submissiveStyles = {
  switch: {
    traits: ['adaptability', 'balance'],
    scores: {
      1: {
        paraphrase: "New to the Switch style? Start small and let your journey into adaptability and balance shine with simplicity!",
        suggestion: "Try an easy task like following a simple instruction, then flipping it to offer one of your own. Celebrate with a playful wink! 😘"
      },
      2: {
        paraphrase: "Dipping your toes into the Switch style? Add a bit more spark to express adaptability and balance!",
        suggestion: "Try alternating between leading and following in a fun activity. Chat with your partner about what excites you! 💬"
      },
      3: {
        paraphrase: "Halfway there—refine your Switch style with a touch of flair!",
        suggestion: "Switch roles mid-scene in a creative challenge. Ask for feedback and celebrate with a playful cheer! 🎉"
      },
      4: {
        paraphrase: "Shining in the Switch style—keep glowing by embracing new challenges!",
        suggestion: "Improvise a role switch unexpectedly. Share feelings with your partner and celebrate with a cute treat! 🍬"
      },
      5: {
        paraphrase: "A natural star in the Switch style—deepen it with creativity and trust!",
        suggestion: "Design a game where roles shift unpredictably. Celebrate your versatility with a special date! 🌹"
      }
    }
  },
  playmate: {
    traits: ['fun', 'camaraderie'],
    scores: {
      1: { paraphrase: "New to the Playmate style? Let fun and camaraderie shine simply!", suggestion: "Share a silly moment and giggle to celebrate! 😄" },
      2: { paraphrase: "Dipping into Playmate? Add some spark!", suggestion: "Try a goofy challenge and chat about the fun! 🎈" },
      3: { paraphrase: "Halfway there—add flair to Playmate!", suggestion: "Plan a mini adventure and cheer your progress! 🌟" },
      4: { paraphrase: "Shining as a Playmate—keep it up!", suggestion: "Invent a new game and high-five your success! ✋" },
      5: { paraphrase: "A Playmate star—get creative!", suggestion: "Host a themed playdate and celebrate with joy! 🎂" }
    }
  },
  captive: {
    traits: ['restraint', 'trust'],
    scores: {
      1: { paraphrase: "New to Captive? Start small with restraint and trust!", suggestion: "Allow a gentle hold and sigh in celebration! 😌" },
      2: { paraphrase: "Dipping into Captive? Add a spark!", suggestion: "Try a blind guide moment and share the thrill! 👀" },
      3: { paraphrase: "Halfway there—refine Captive!", suggestion: "Play a ‘capture’ scenario and cheer quietly! 🎶" },
      4: { paraphrase: "Shining in Captive—keep glowing!", suggestion: "Test new restraint and enjoy a treat! 🍫" },
      5: { paraphrase: "A Captive star—deepen it!", suggestion: "Create a binding ritual and celebrate connection! 💞" }
    }
  },
  thrall: {
    traits: ['enslavement', 'devotion'],
    scores: {
      1: { paraphrase: "New to Thrall? Start with enslavement and devotion!", suggestion: "Do a small service and bow to celebrate! 🙇" },
      2: { paraphrase: "Dipping into Thrall? Add spark!", suggestion: "Fulfill a request and discuss your devotion! 💖" },
      3: { paraphrase: "Halfway there—refine Thrall!", suggestion: "Craft a devotion token and cheer solemnly! 🌿" },
      4: { paraphrase: "Shining in Thrall—keep it up!", suggestion: "Commit to a task and share a gesture! 🤝" },
      5: { paraphrase: "A Thrall star—get creative!", suggestion: "Renew a vow with acts and celebrate! 🎁" }
    }
  },
  submissive: {
    traits: ['humility', 'service'],
    scores: {
      1: { paraphrase: "New to Submissive? Start simply!", suggestion: "Help with a duty and smile to celebrate! 😊" },
      2: { paraphrase: "Dipping into Submissive? Add spark!", suggestion: "Practice service and chat about it! 💬" },
      3: { paraphrase: "Halfway there—refine it!", suggestion: "Try a creative challenge and cheer! 🎉" },
      4: { paraphrase: "Shining as Submissive—keep going!", suggestion: "Stretch your zone and share a treat! 🍭" },
      5: { paraphrase: "A Submissive star—deepen it!", suggestion: "Design a ritual and celebrate! 🌸" }
    }
  },
  brat: {
    traits: ['playfulness', 'defiance'],
    scores: {
      1: { paraphrase: "New to Brat? Start small!", suggestion: "Add a playful twist and nod cheekily! 😉" },
      2: { paraphrase: "Dipping into Brat? More spark!", suggestion: "Defy lightly and giggle about it! 😏" },
      3: { paraphrase: "Halfway there—refine Brat!", suggestion: "Mix play and defiance, cheer loudly! 🎤" },
      4: { paraphrase: "Shining as Brat—keep it fun!", suggestion: "Push a bit more and high-five! ✋" },
      5: { paraphrase: "A Brat star—go wild!", suggestion: "Craft a defiance game and celebrate! 🎊" }
    }
  },
  slave: {
    traits: ['devotion', 'surrender'],
    scores: {
      1: { paraphrase: "New to Slave? Start simply!", suggestion: "Offer devotion and smile softly! 😊" },
      2: { paraphrase: "Dipping into Slave? Add spark!", suggestion: "Surrender lightly and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Slave!", suggestion: "Deepen surrender and cheer! 🎉" },
      4: { paraphrase: "Shining as Slave—keep glowing!", suggestion: "Stretch surrender and treat! 🍬" },
      5: { paraphrase: "A Slave star—deepen it!", suggestion: "Create a surrender ritual and celebrate! 🌹" }
    }
  },
  pet: {
    traits: ['loyalty', 'affection'],
    scores: {
      1: { paraphrase: "New to Pet? Start small!", suggestion: "Show loyalty and wag happily! 🐾" },
      2: { paraphrase: "Dipping into Pet? Add spark!", suggestion: "Be affectionate and chat! 💖" },
      3: { paraphrase: "Halfway there—refine Pet!", suggestion: "Mix loyalty and cheer! 🎶" },
      4: { paraphrase: "Shining as Pet—keep it up!", suggestion: "Stretch affection and treat! 🍪" },
      5: { paraphrase: "A Pet star—get cuddly!", suggestion: "Design a loyalty ritual and celebrate! 🧸" }
    }
  },
  little: {
    traits: ['innocence', 'dependence'],
    scores: {
      1: { paraphrase: "New to Little? Start simply!", suggestion: "Be innocent and giggle! 😄" },
      2: { paraphrase: "Dipping into Little? Add spark!", suggestion: "Lean on someone and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Little!", suggestion: "Play innocently and cheer! 🎉" },
      4: { paraphrase: "Shining as Little—keep glowing!", suggestion: "Deepen dependence and treat! 🍭" },
      5: { paraphrase: "A Little star—be creative!", suggestion: "Craft a dependence game and celebrate! 🌟" }
    }
  },
  prey: {
    traits: ['elusiveness', 'vulnerability'],
    scores: {
      1: { paraphrase: "New to Prey? Start small!", suggestion: "Dodge lightly and smile! 😸" },
      2: { paraphrase: "Dipping into Prey? Add spark!", suggestion: "Show vulnerability and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Prey!", suggestion: "Play elusive and cheer! 🎶" },
      4: { paraphrase: "Shining as Prey—keep it up!", suggestion: "Stretch vulnerability and treat! 🍫" },
      5: { paraphrase: "A Prey star—deepen it!", suggestion: "Design an elusive ritual and celebrate! 🦋" }
    }
  },
  puppy: {
    traits: ['eagerness', 'energy'],
    scores: {
      1: { paraphrase: "New to Puppy? Start simply!", suggestion: "Bounce a bit and bark happily! 🐶" },
      2: { paraphrase: "Dipping into Puppy? Add spark!", suggestion: "Show energy and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Puppy!", suggestion: "Play eagerly and cheer! 🎉" },
      4: { paraphrase: "Shining as Puppy—keep bouncing!", suggestion: "Stretch energy and treat! 🍖" },
      5: { paraphrase: "A Puppy star—go wild!", suggestion: "Create an energy game and celebrate! 🎾" }
    }
  },
  kitten: {
    traits: ['curiosity', 'cuddliness'],
    scores: {
      1: { paraphrase: "New to Kitten? Start small!", suggestion: "Poke around and purr! 😻" },
      2: { paraphrase: "Dipping into Kitten? Add spark!", suggestion: "Cuddle up and chat! 💖" },
      3: { paraphrase: "Halfway there—refine Kitten!", suggestion: "Explore curiously and cheer! 🎶" },
      4: { paraphrase: "Shining as Kitten—keep purring!", suggestion: "Deepen cuddles and treat! 🍬" },
      5: { paraphrase: "A Kitten star—get cozy!", suggestion: "Design a cuddle ritual and celebrate! 🧶" }
    }
  },
  bunny: {
    traits: ['timidity', 'agility'],
    scores: {
      1: { paraphrase: "New to Bunny? Start simply!", suggestion: "Hop lightly and smile shyly! 🐰" },
      2: { paraphrase: "Dipping into Bunny? Add spark!", suggestion: "Be agile and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Bunny!", suggestion: "Mix timidity and cheer! 🎉" },
      4: { paraphrase: "Shining as Bunny—keep hopping!", suggestion: "Stretch agility and treat! 🥕" },
      5: { paraphrase: "A Bunny star—be swift!", suggestion: "Create an agility game and celebrate! 🌼" }
    }
  },
  toy: {
    traits: ['availability', 'resilience'],
    scores: {
      1: { paraphrase: "New to Toy? Start small!", suggestion: "Be ready and smile! 😊" },
      2: { paraphrase: "Dipping into Toy? Add spark!", suggestion: "Bounce back and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Toy!", suggestion: "Stay available and cheer! 🎶" },
      4: { paraphrase: "Shining as Toy—keep it up!", suggestion: "Stretch resilience and treat! 🍫" },
      5: { paraphrase: "A Toy star—deepen it!", suggestion: "Design a resilience ritual and celebrate! 🎁" }
    }
  },
  doll: {
    traits: ['posability', 'beauty'],
    scores: {
      1: { paraphrase: "New to Doll? Start simply!", suggestion: "Pose lightly and smile! 💃" },
      2: { paraphrase: "Dipping into Doll? Add spark!", suggestion: "Shine beautifully and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Doll!", suggestion: "Pose creatively and cheer! 🎉" },
      4: { paraphrase: "Shining as Doll—keep glowing!", suggestion: "Enhance beauty and treat! 🌸" },
      5: { paraphrase: "A Doll star—be stunning!", suggestion: "Create a beauty ritual and celebrate! 💄" }
    }
  },
  masochist: {
    traits: ['endurance', 'pleasure in pain'],
    scores: {
      1: { paraphrase: "New to Masochist? Start small!", suggestion: "Test endurance and grin! 😈" },
      2: { paraphrase: "Dipping into Masochist? Add spark!", suggestion: "Enjoy a sting and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Masochist!", suggestion: "Push endurance and cheer! 🎶" },
      4: { paraphrase: "Shining as Masochist—keep it up!", suggestion: "Stretch pain and treat! 🍬" },
      5: { paraphrase: "A Masochist star—go deep!", suggestion: "Design a pain ritual and celebrate! 🔥" }
    }
  },
  'rope bunny': {
    traits: ['flexibility', 'patience'],
    scores: {
      1: { paraphrase: "New to Rope Bunny? Start simply!", suggestion: "Stretch a bit and smile! 🪢" },
      2: { paraphrase: "Dipping into Rope Bunny? Add spark!", suggestion: "Wait patiently and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Rope Bunny!", suggestion: "Bend creatively and cheer! 🎉" },
      4: { paraphrase: "Shining as Rope Bunny—keep it up!", suggestion: "Deepen patience and treat! 🍫" },
      5: { paraphrase: "A Rope Bunny star—tie it up!", suggestion: "Create a tie ritual and celebrate! 🎀" }
    }
  },
  puppet: {
    traits: ['responsiveness', 'adaptability'],
    scores: {
      1: { paraphrase: "New to Puppet? Start small!", suggestion: "React lightly and smile! 🎭" },
      2: { paraphrase: "Dipping into Puppet? Add spark!", suggestion: "Adapt quickly and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Puppet!", suggestion: "Respond creatively and cheer! 🎶" },
      4: { paraphrase: "Shining as Puppet—keep moving!", suggestion: "Stretch adaptability and treat! 🍬" },
      5: { paraphrase: "A Puppet star—dance free!", suggestion: "Design an adapt ritual and celebrate! 🌟" }
    }
  },
  princess: {
    traits: ['grace', 'entitlement'],
    scores: {
      1: { paraphrase: "New to Princess? Start simply!", suggestion: "Move gracefully and smile! 👑" },
      2: { paraphrase: "Dipping into Princess? Add spark!", suggestion: "Claim a bit and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Princess!", suggestion: "Glide elegantly and cheer! 🎉" },
      4: { paraphrase: "Shining as Princess—keep ruling!", suggestion: "Deepen grace and treat! 🌹" },
      5: { paraphrase: "A Princess star—reign supreme!", suggestion: "Create a grace ritual and celebrate! 💎" }
    }
  },
  servant: {
    traits: ['duty', 'efficiency'],
    scores: {
      1: { paraphrase: "New to Servant? Start small!", suggestion: "Do a duty and smile! 😊" },
      2: { paraphrase: "Dipping into Servant? Add spark!", suggestion: "Work efficiently and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Servant!", suggestion: "Serve smartly and cheer! 🎶" },
      4: { paraphrase: "Shining as Servant—keep it up!", suggestion: "Stretch duty and treat! 🍫" },
      5: { paraphrase: "A Servant star—perfect it!", suggestion: "Design a duty ritual and celebrate! 🎁" }
    }
  },
  maid: {
    traits: ['tidiness', 'politeness'],
    scores: {
      1: { paraphrase: "New to Maid? Start simply!", suggestion: "Tidy a bit and curtsy! 🎀" },
      2: { paraphrase: "Dipping into Maid? Add spark!", suggestion: "Be polite and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Maid!", suggestion: "Clean neatly and cheer! 🎉" },
      4: { paraphrase: "Shining as Maid—keep it up!", suggestion: "Deepen tidiness and treat! 🍬" },
      5: { paraphrase: "A Maid star—shine bright!", suggestion: "Create a tidy ritual and celebrate! 🧹" }
    }
  },
  'babygirl': {
    traits: ['neediness', 'playfulness'],
    scores: {
      1: { paraphrase: "New to Babygirl/babyboy? Start small!", suggestion: "Be needy and giggle! 😄" },
      2: { paraphrase: "Dipping into it? Add spark!", suggestion: "Play lightly and chat! 💬" },
      3: { paraphrase: "Halfway there—refine it!", suggestion: "Mix neediness and cheer! 🎶" },
      4: { paraphrase: "Shining bright—keep it cute!", suggestion: "Stretch play and treat! 🍭" },
      5: { paraphrase: "A star—be adorable!", suggestion: "Design a play ritual and celebrate! 🍼" }
    }
  },
  bottom: {
    traits: ['receptiveness', 'endurance'],
    scores: {
      1: { paraphrase: "New to Bottom? Start simply!", suggestion: "Receive lightly and smile! 😊" },
      2: { paraphrase: "Dipping into Bottom? Add spark!", suggestion: "Endure a bit and chat! 💬" },
      3: { paraphrase: "Halfway there—refine Bottom!", suggestion: "Take more and cheer! 🎉" },
      4: { paraphrase: "Shining as Bottom—keep going!", suggestion: "Stretch endurance and treat! 🍫" },
      5: { paraphrase: "A Bottom star—deepen it!", suggestion: "Create an endure ritual and celebrate! 🌟" }
    }
  }
};

// Function to calculate average trait score and get style breakdown
export function getStyleBreakdown(style, traits) {
  const styleData = submissiveStyles[style.toLowerCase()];
  if (!styleData) return { strengths: "Oops! Style not found! 😿", improvements: "Try picking a style cutie! 💕" };
  const traitScores = styleData.traits.map(trait => parseInt(traits[trait]) || 3);
  const averageScore = Math.round(traitScores.reduce((a, b) => a + b, 0) / traitScores.length);
  const { paraphrase, suggestion } = styleData.scores[averageScore];
  const isStrength = averageScore >= 4;
  const strengths = isStrength ? `${paraphrase} ${suggestion}` : "You're growing so fast! Keep shining, sweetie! 🌈";
  const improvements = !isStrength ? `${paraphrase} ${suggestion}` : "You’re a superstar—keep dazzling us! ✨";
  return { strengths, improvements };
}
