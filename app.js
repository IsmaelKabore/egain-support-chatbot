// PAGE ELEMENTS

const messages = document.getElementById("messages");
const replies = document.getElementById("replies");
const form = document.getElementById("form");
const input = document.getElementById("input");

let currentStep = "start";

const CARDS = {
  package: () => packageCard(PACKAGE),
  photo: () => deliveryPhoto(),
  claim: () => claimCard(claim, PACKAGE),
};


// CONVERSATION

function show(element) {
  messages.appendChild(element);
  messages.scrollTop = messages.scrollHeight;
}

function goTo(stepName, text) {
  const step = FLOW[stepName];
  currentStep = stepName;
  replies.innerHTML = "";

  const isRetry = Boolean(text);
  if (!isRetry && step.onEnter) step.onEnter();

  const typing = typingBubble();
  show(typing);

  setTimeout(() => {
    typing.remove();
    const message = text || (typeof step.text === "function" ? step.text() : step.text);
    show(messageBubble("bot", message));
    if (step.card && !isRetry) show(CARDS[step.card]());

    step.replies.forEach(([label, next]) => {
      replies.appendChild(replyButton(label, () => answer(label, next)));
    });

    if (step.agentJoins && !isRetry) {
      setTimeout(() => {
        if (currentStep === stepName) show(agentBubble("Jordan · TechWorld Support", step.agentJoins));
      }, 3000);
    }
  }, 500);
}

function answer(text, nextStep) {
  show(messageBubble("user", text));
  goTo(nextStep);
}


// UNDERSTANDING THE USER

function mentions(text, words) {
  return words.some(word => new RegExp(`\\b${word}\\b`).test(text));
}

function understand(text) {
  const typed = text.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?]/g, "");
  const step = FLOW[currentStep];

  if (step.asksTracking) {
    const number = typed.match(/\b(?=[a-z]*\d)[a-z0-9]{10,20}\b/);
    if (number) return number[0].toUpperCase() === PACKAGE.tracking ? "found" : "notFound";
  }

  const button = step.replies.find(([label]) => label.toLowerCase() === typed);
  if (button) return button[1];

  if (step.no && mentions(typed, NO_WORDS)) return step.no;
  if (step.yes && mentions(typed, [...YES_WORDS, ...(step.yesWords || [])])) return step.yes;

  const keyword = Object.keys(KEYWORDS).find(next => mentions(typed, KEYWORDS[next]));
  if (keyword) return keyword;

  if (currentStep === "start" && mentions(typed, PACKAGE_WORDS)) return "askTracking";
  return null;
}


// USER INPUT

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  input.value = "";

  if (!text) return goTo(currentStep, "Please type a message so I know how to help.");

  show(messageBubble("user", text));
  const next = understand(text);

  if (next) goTo(next);
  else goTo(currentStep, FLOW[currentStep].retry || NOT_UNDERSTOOD);
});

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => answer(button.dataset.label, button.dataset.step));
});

goTo("start");
