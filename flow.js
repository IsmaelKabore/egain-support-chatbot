// DEMO PACKAGE

const PACKAGE = {
  tracking: "1Z999AA10123456784",
  store: "TechWorld",
  item: "Wireless Headphones",
  delivered: "Mon, Sep 29 at 2:17 PM",
  address: "Sunnyvale, CA 94086",
  carrier: "UPS",
  note: "Left near side entrance.",
};


// CLAIM

let claim = null;

function openClaim() {
  claim = {
    number: `CLM-${Math.floor(100000 + Math.random() * 900000)}`,
    followUpBy: businessDaysFromToday(3),
  };
}

function businessDaysFromToday(days) {
  const date = new Date();
  while (days > 0) {
    date.setDate(date.getDate() + 1);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (!isWeekend) days--;
  }
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}


// SEARCH SPOTS

function checkSpot(text, nextSpot) {
  return {
    text,
    yes: "resolved",
    no: nextSpot,
    replies: [
      ["Yes, I found it", "resolved"],
      ["No, it's not there", nextSpot],
    ],
  };
}


// CONVERSATION STEPS

const FLOW = {
  start: {
    onEnter: () => (claim = null),
    text: "Hi, I'm Ava from eGain. How can I help you today?",
    replies: [
      ["My package is missing", "askTracking"],
      ["Track my package", "askTracking"],
      ["Talk to an agent", "human"],
    ],
  },

  askTracking: {
    text: "Let's find it together. What's your tracking number?",
    asksTracking: true,
    retry: "That doesn't look like a tracking number. It's 10 to 20 letters and numbers, like 1Z999AA10123456784.",
    no: "noTracking",
    replies: [
      [PACKAGE.tracking, "found"],
      ["I don't have it", "noTracking"],
    ],
  },

  notFound: {
    text: "Hmm, I couldn't find a package with that tracking number. A single wrong letter or number is enough to miss it. Could you double-check it in your shipping confirmation email and let me know when you're ready? I'll be right here to help.",
    asksTracking: true,
    retry: "No rush. Let me know once you've checked your tracking number, or tell me if you can't find it.",
    yes: "recheckTracking",
    yesWords: ["checked", "ready", "done", "ok", "okay"],
    no: "noTracking",
    replies: [
      ["I checked it", "recheckTracking"],
      ["I can't find my email", "noTracking"],
      ["Talk to an agent", "human"],
    ],
  },

  recheckTracking: {
    text: "Thanks for checking! Please type the tracking number exactly as it appears in your email.",
    asksTracking: true,
    retry: "That doesn't look like a tracking number. It's 10 to 20 letters and numbers, like 1Z999AA10123456784.",
    no: "noTracking",
    replies: [
      [PACKAGE.tracking, "found"],
      ["I don't have it", "noTracking"],
    ],
  },

  noTracking: {
    text: "No problem. It's usually in your order confirmation or shipping email.",
    yes: "askTracking",
    replies: [
      ["I found it", "askTracking"],
      ["Talk to an agent", "human"],
    ],
  },

  found: {
    ...checkSpot(
      `I found your delivery details. It was delivered ${PACKAGE.delivered}, and the driver wrote: "${PACKAGE.note}" Could you check beside the side entrance first, including behind anything nearby? Did you find it?`,
      "front"
    ),
    card: "package",
  },

  front: checkSpot(
    "Okay, let's try the front door. Please look behind planters, under furniture and around the porch. Did you find it?",
    "mailroom"
  ),

  mailroom: checkSpot(
    "Next, if your building has a mailroom, parcel lockers or a reception desk, could you check there? Did you find it?",
    "neighbor"
  ),

  neighbor: {
    ...checkSpot("Sometimes drivers leave packages with a neighbor. Could you ask your neighbors and let me know?", "photo"),
    replies: [
      ["Yes, they had it", "resolved"],
      ["No, they don't have it", "photo"],
    ],
  },

  photo: {
    ...checkSpot(
      "One last idea. Here's the photo the driver took: the box is on a dark doormat in front of a gray door, with a stone wall on the left and a potted plant on the right. Do you recognize this door? Did you find it?",
      "stillMissing"
    ),
    card: "photo",
    replies: [
      ["Yes, I found it", "resolved"],
      ["No, it's not there", "stillMissing"],
      ["That's not my door", "wrongAddress"],
    ],
  },

  wrongAddress: {
    text: "Thanks, that's really helpful. It looks like the driver may have left it at the wrong address. I can open a missing-package claim right away, or connect you with an agent. What would you prefer?",
    yes: "claim",
    replies: [
      ["Open a claim", "claim"],
      ["Talk to an agent", "human"],
    ],
  },

  stillMissing: {
    text: "I'm sorry, we've checked all the usual places. Was it delivered more than 24 hours ago?",
    yes: "claimOffer",
    no: "wait",
    replies: [
      ["Yes, more than 24 hours", "claimOffer"],
      ["No, less than 24 hours", "wait"],
    ],
  },

  claimOffer: {
    text: "Since it's been more than 24 hours, the next step is a missing-package claim. I can open it for you right now, or connect you with an agent. What would you prefer?",
    yes: "claim",
    replies: [
      ["Open a claim", "claim"],
      ["Talk to an agent", "human"],
    ],
  },

  wait: {
    text: "Packages marked delivered sometimes show up within a day. Please check again tomorrow. If it still isn't there, come back and I'll open a claim for you.",
    replies: [
      ["Open a claim anyway", "claim"],
      ["Talk to an agent", "human"],
      ["Start over", "start"],
    ],
  },

  claim: {
    onEnter: openClaim,
    text: () =>
      `Done. I've opened a missing-package claim for you. Your claim number is ${claim.number}. Our claims team will email you within 3 business days. If you haven't heard from us by ${claim.followUpBy}, contact eGain Support and give them this claim number.`,
    card: "claim",
    replies: [
      ["Talk to an agent now", "human"],
      ["I'm all set", "goodbye"],
    ],
  },

  goodbye: {
    text: () => `You're welcome! Keep your claim number handy: ${claim.number}. I hope your package turns up soon.`,
    replies: [["Start over", "start"]],
  },

  resolved: {
    text: "Great, glad we found it! Anything else?",
    replies: [["Start over", "start"]],
  },

  human: {
    text: () =>
      `I've added you to the queue. The next available agent will join this chat in about 2 minutes, so please stay here. I've shared your tracking number, delivery details and the places you checked${claim ? `, plus your claim number ${claim.number}` : ""}, so you won't have to repeat yourself.`,
    retry: "Jordan from our support team will join this chat shortly. Please stay here.",
    agentJoins: "Hi, I'm Jordan from eGain Support. I've read your conversation with Ava, so I have all the details. Give me a moment while I look into your package.",
    replies: [["Start over", "start"]],
  },
};


// WORDS AVA UNDERSTANDS

const NOT_UNDERSTOOD = "Sorry, I didn't catch that. I can help with tracking and missing packages. Pick an option below or rephrase.";

const NO_WORDS = ["no", "nope", "nah", "not there", "not here", "nothing", "already checked", "can't find", "cant find", "still missing", "don't have", "dont have", "less than"];

const YES_WORDS = ["yes", "yeah", "yep", "yup", "sure", "found it", "got it", "it's here", "its here", "they had it", "more than"];

const KEYWORDS = {
  human: ["agent", "human", "person", "someone"],
  start: ["start over", "restart"],
  wrongAddress: ["not my door", "not my house", "wrong address"],
  askTracking: ["missing", "lost", "track", "can't find", "cant find", "delivered", "package"],
};
