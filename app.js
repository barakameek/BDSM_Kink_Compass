showPersonDetails(personId) {
  const person = this.people.find(p => p.id === personId);
  if (!person) return;
  const roleData = bdsmData[person.role];
  const allTraits = [...roleData.coreTraits, ...roleData.styles.find(s => s.name.toLowerCase() === person.style.toLowerCase())?.traits || []];
  let html = `<h2>✨ ${person.name} (${person.role} - ${person.style}) ✨</h2>`;

  const getStyleBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
  const styleBreakdown = getStyleBreakdown(person.style, person.traits);
  html += `
    <h3>🌟 Your Style Strengths & Growth 🌟</h3>
    <div class="style-breakdown">
      <div class="strengths">
        <h4>💪 Your Superpowers</h4>
        <p>${styleBreakdown.strengths}</p>
      </div>
      <div class="improvements">
        <h4>🌱 Areas to Bloom</h4>
        <p>${styleBreakdown.improvements}</p>
      </div>
    </div>
  `;

  html += `<h3>🎀 Traits</h3>`;
  for (const [traitName, score] of Object.entries(person.traits)) {
    const traitData = allTraits.find(t => t.name === traitName);
    if (traitData) {
      // Fallback if improvement or support data is missing
      const suggestion = score <= 3
        ? (traitData.improvement && traitData.improvement[score] 
            ? traitData.improvement[score] 
            : { paraphrase: "No improvement suggestion available yet.", text: "Check back later for tips!" })
        : (traitData.support && traitData.support[score] 
            ? traitData.support[score] 
            : { paraphrase: "No support suggestion available yet.", text: "You’re doing great—keep it up!" });
      html += `
        <div class="trait-detail">
          <h4>${traitName.charAt(0).toUpperCase() + traitName.slice(1)}</h4>
          <p><strong>Score:</strong> ${score}</p>
          <p><strong>Description:</strong> ${traitData.desc[score]}</p>
          <p><strong>${score <= 3 ? 'Improvement' : 'Support'} Suggestion:</strong> <em>${suggestion.paraphrase}</em><br>${suggestion.text}</p>
        </div>
      `;
    }
  }

  // Rest of the method remains unchanged
  html += `
    <h3>📖 Kink Journal</h3>
    <textarea id="journal-${person.id}" rows="5" style="width: 100%;">${person.journal || ''}</textarea>
    <button onclick="saveJournal(${person.id})">Save Journal</button>
    <h3>🏅 Badges Earned</h3>
    <div class="badges">${person.badges.map(badge => `<span class="badge">${badge} ${getBadgeEmoji(badge)}</span>`).join('')}</div>
  `;

  this.elements.modalContent.innerHTML = html;
  this.elements.modalContent.appendChild(this.elements.modalClose);
  this.elements.modal.style.display = 'block';
}
