// ELEMENTS

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

function replyButton(label, onClick) {
  const button = createElement("button", "reply", label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}


// MESSAGES

function messageBubble(sender, text) {
  return createElement("div", `message ${sender}`, text);
}

function agentBubble(name, text) {
  const bubble = createElement("div", "message agent");
  bubble.append(createElement("strong", "agent-name", name), text);
  return bubble;
}

function typingBubble() {
  const bubble = createElement("div", "message bot typing");
  bubble.innerHTML = "<span></span><span></span><span></span>";
  return bubble;
}


// CARDS

function packageCard(pkg) {
  const card = createElement("div", "package-card");
  card.innerHTML = `
    <div class="package-top">
      <span class="package-icon">📦</span>
      <div>
        <strong>${pkg.item}</strong>
        <small>${pkg.store} · ${pkg.tracking}</small>
      </div>
      <span class="badge">Delivered</span>
    </div>
    <dl>
      <dt>Delivered</dt><dd>${pkg.delivered}</dd>
      <dt>Address</dt><dd>${pkg.address}</dd>
      <dt>Carrier</dt><dd>${pkg.carrier}</dd>
      <dt>Note</dt><dd>${pkg.note}</dd>
    </dl>
  `;
  return card;
}

function deliveryPhoto() {
  const photo = createElement("img", "delivery-photo");
  photo.src = "images/delivery-photo.jpg";
  photo.alt = "Package on a doormat in front of a gray door, next to a potted plant";
  photo.addEventListener("load", () => photo.scrollIntoView({ block: "end" }));
  return photo;
}

function claimCard(claim, pkg) {
  const card = createElement("div", "package-card");
  card.innerHTML = `
    <div class="package-top">
      <span class="package-icon">📋</span>
      <div>
        <strong>Missing-package claim</strong>
        <small>${claim.number}</small>
      </div>
      <span class="badge open">Open</span>
    </div>
    <dl>
      <dt>Item</dt><dd>${pkg.item} (${pkg.store})</dd>
      <dt>Tracking</dt><dd>${pkg.tracking}</dd>
      <dt>Checked</dt><dd>Side entrance, front door, mailroom, neighbors, delivery photo</dd>
      <dt>Reply by</dt><dd>${claim.followUpBy}</dd>
    </dl>
  `;
  return card;
}
