import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    this.people = JSON.parse(localStorage.getItem('trackerPeople')) || [];
    this.currentEditId = null;
    this.elements = {
      role: document.getElementById('role'),
      name: document.getElementById('name'),
      style: document.getElementById('style'),
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      peopleList: document.getElementById('people-list'),
      themeToggle: document.getElementById('theme-toggle'),
      findStyle: document.getElementById('find-style'),
      modal: document.createElement('div'),
      modalContent: document.createElement('div'),
      modalClose: document.createElement('button')
    };
    this.elements.modal.className = 'modal';
    this.elements.modalContent.className = 'modal-content';
    this.elements.modalClose.className = 'modal-close';
    this.elements.modalClose.textContent = 'Close';
    this.elements.modalContent.appendChild(this.elements.modalClose);
    this.elements.modal.appendChild(this.elements.modalContent);
    document.body.appendChild(this.elements.modal);
    this.addEventListeners();
    this.renderStyles('submissive');
    this.renderTraits('submissive', '');
    this.renderList();
    const urlParams = new URLSearchParams(window.location.search);
    const styleParam = urlParams.get('style');
    if (styleParam) {
      this.elements.style.value = styleParam.toLowerCase();
      if (this.elements.style.value) {
        this.renderTraits(this.elements.role.value, styleParam.toLowerCase());
      }
    }
  }

  addEventListeners() {
    this.elements.role.addEventListener('change', () => {
      const role = this.elements.role.value;
      this.renderStyles(role);
      this.renderTraits(role, this.elements.style.value);
    });
    this.elements.style.addEventListener('change', () => {
      this.renderTraits(this.elements.role.value, this.elements.style.value);
    });
    this.elements.save.addEventListener('click', () => this.savePerson());
    this.elements.themeToggle.addEventListener('click', () => {
      document.body.setAttribute('data-theme', document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    this.elements.findStyle.addEventListener('click', () => {
      window.open('https://username.github.io/style-finder/', '_blank');
    });
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (personLi && !e.target.classList.contains('edit-btn')) {
        const personId = parseInt(personLi.dataset.id);
        this.showPersonDetails(personId);
      } else if (e.target.classList.contains('edit-btn')) {
        const personId = parseInt(e.target.parentElement.dataset.id);
        this.editPerson(personId);
      }
    });
    this.elements.modalClose.addEventListener('click', () => {
      this.elements.modal.style.display = 'none';
    });
  }

  renderStyles(role) {
    this.elements.style.innerHTML = '<option value="">Select Style</option>';
    bdsmData[role].styles.forEach(s => {
      this.elements.style.innerHTML += `<option value="${s.name.toLowerCase()}">${s.name}</option>`;
    });
  }

  renderTraits(role, style) {
    this.elements.traitsContainer.innerHTML = '';
    const roleData = bdsmData[role.toLowerCase()];
    const coreTraits = roleData.coreTraits;
    const styleTraits = style ? roleData.styles.find(s => s.name.toLowerCase() === style.toLowerCase())?.traits || [] : [];
    const renderTrait = (trait, isCore = false) => {
      const label = isCore ? `${trait.name} (Core)` : trait.name;
      return `
        <div class="trait">
          <label>${label.charAt(0).toUpperCase() + label.slice(1)}</label>
          <input type="range" class="trait-slider" min="1" max="5" value="3" data-trait="${trait.name}">
          <div class="slider-description">${trait.desc["3"]}</div>
        </div>
      `;
    };
    coreTraits.forEach(trait => this.elements.traitsContainer.innerHTML += renderTrait(trait, true));
    styleTraits.forEach(trait => this.elements.traitsContainer.innerHTML += renderTrait(trait));
    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    sliders.forEach(slider => {
      const traitName = slider.getAttribute('data-trait');
      const descriptionDiv = slider.nextElementSibling;
      const updateDescription = () => {
        const value = slider.value;
        const traitData = [...coreTraits, ...styleTraits].find(t => t.name === traitName);
        descriptionDiv.textContent = traitData.desc[value];
      };
      slider.addEventListener('input', updateDescription);
      updateDescription();
    });
  }

  savePerson() {
    const role = this.elements.role.value.toLowerCase();
    const style = this.elements.style.value;
    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });
    if (this.currentEditId) {
      const person = this.people.find(p => p.id === this.currentEditId);
      person.history.push({ date: new Date().toISOString(), traits: { ...person.traits } });
      person.name = this.elements.name.value;
      person.role = role;
      person.style = style;
      person.traits = traits;
      this.checkBadges(person);
      this.currentEditId = null;
    } else {
      const person = {
        id: Date.now(),
        role,
        name: this.elements.name.value || "Unnamed",
        style,
        traits,
        history: [{ date: new Date().toISOString(), traits: { ...traits } }],
        badges: [],
        journal: ""
      };
      this.people.push(person);
      this.checkBadges(person);
    }
    localStorage.setItem('trackerPeople', JSON.stringify(this.people));
    this.renderList();
    this.resetForm();
  }

  resetForm() {
    this.elements.name.value = '';
    this.elements.style.value = '';
    this.renderTraits(this.elements.role.value, '');
  }

  renderList() {
    this.elements.peopleList.innerHTML = '';
    this.people.forEach(person => {
      this.elements.peopleList.innerHTML += `
        <li class="person" data-id="${person.id}">${person.name} (${person.role} - ${person.style}) <button class="edit-btn">Edit</button></li>
      `;
    });
  }

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (person) {
      this.elements.name.value = person.name;
      this.elements.role.value = person.role;
      this.renderStyles(person.role);
      this.elements.style.value = person.style;
      this.renderTraits(person.role, person.style);
      Object.entries(person.traits).forEach(([trait, value]) => {
        const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${trait}"]`);
        if (slider) {
          slider.value = value;
          slider.dispatchEvent(new Event('input'));
        }
      });
      this.currentEditId = person.id;
    }
  }

  checkBadges(person) {
    const history = person.history;
    if (history.length === 0) return;
    const currentTraits = person.traits;
    if (Object.values(currentTraits).some(value => value === '5') && !person.badges.includes('Trait Master')) {
      person.badges.push('Trait Master');
    }
    if (history.length >= 2) {
      const prevTraits = history[history.length - 1].traits;
      for (const trait in currentTraits) {
        if (prevTraits[trait] === '1' && currentTraits[trait] >= '3' && !person.badges.includes('Growth Guru')) {
          person.badges.push('Growth Guru');
        }
      }
    }
    if (history.length >= 2) {
      for (const trait in currentTraits) {
        if (history.slice(-2).every(h => h.traits[trait] >= '4') && currentTraits[trait] >= '4' && !person.badges.includes('Consistency Champion')) {
          person.badges.push('Consistency Champion');
        }
      }
    }
  }

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
        const suggestion = score <= 3 ? traitData.improvement[score] : traitData.support[score];
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
}

function getBadgeEmoji(badge) {
  return { 'Trait Master': '🌟', 'Growth Guru': '🚀', 'Consistency Champion': '🏆' }[badge] || '';
}

window.saveJournal = (personId) => {
  const person = trackerApp.people.find(p => p.id === personId);
  const journalText = document.getElementById(`journal-${personId}`).value;
  person.journal = journalText;
  localStorage.setItem('trackerPeople', JSON.stringify(trackerApp.people));
  alert('Journal saved! 📝');
};

const trackerApp = new TrackerApp();
