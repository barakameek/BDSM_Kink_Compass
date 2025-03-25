import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    this.people = JSON.parse(localStorage.getItem('kinkProfiles')) || [];
    this.previewPerson = null;
    this.elements = {
      role: document.getElementById('role'),
      name: document.getElementById('name'),
      style: document.getElementById('style'),
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      peopleList: document.getElementById('people-list'),
      themeToggle: document.getElementById('theme-toggle'),
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close')
    };
    this.addEventListeners();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview();
  }

  addEventListeners() {
    this.elements.role.addEventListener('change', () => {
      const role = this.elements.role.value;
      this.renderStyles(role);
      this.elements.style.value = '';
      this.renderTraits(role, '');
      this.updateLivePreview();
    });
    this.elements.style.addEventListener('change', () => {
      this.renderTraits(this.elements.role.value, this.elements.style.value);
      this.updateLivePreview();
    });
    this.elements.save.addEventListener('click', () => this.savePerson());
    this.elements.themeToggle.addEventListener('click', () => {
      document.body.setAttribute('data-theme', document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (!personLi) return;
      const personId = parseInt(personLi.dataset.id);
      if (e.target.classList.contains('edit-btn')) this.editPerson(personId);
      else this.showPersonDetails(personId);
    });
    this.elements.modalClose.addEventListener('click', () => {
      this.elements.modal.style.display = 'none';
    });
    this.elements.name.addEventListener('input', () => this.updateLivePreview());
  }

  renderStyles(role) {
    this.elements.style.innerHTML = '<option value="">Pick your flavor!</option>';
    bdsmData[role].styles.forEach(s => {
      this.elements.style.innerHTML += `<option value="${s.name.toLowerCase()}">${s.name}</option>`;
    });
  }

  renderTraits(role, style) {
  this.elements.traitsContainer.innerHTML = '';
  const coreTraits = bdsmData[role].coreTraits;
  let styleTraits = [];
  if (style) {
    const styleObj = bdsmData[role].styles.find(s => s.name.toLowerCase() === style.toLowerCase());
    styleTraits = styleObj ? styleObj.traits : [];
    console.log("Style traits loaded:", styleTraits);
  }
  const renderTrait = (trait) => {
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
    return `<div class="trait">
      <label>${displayName}</label>
      <input type="range" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" />
      <div class="trait-desc"></div>
    </div>`;
  };
  coreTraits.forEach(trait => this.elements.traitsContainer.innerHTML += renderTrait(trait));
  styleTraits.forEach(trait => this.elements.traitsContainer.innerHTML += renderTrait(trait));
  const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
  console.log("Sliders rendered:", sliders.length);
  sliders.forEach(slider => {
    const traitName = slider.getAttribute('data-trait');
    const descDiv = slider.parentElement.querySelector('.trait-desc');
    const traitData = [...coreTraits, ...styleTraits].find(t => t.name === traitName);
    const updateDesc = () => {
      const val = slider.value;
      if (traitData && traitData.desc[val]) descDiv.textContent = traitData.desc[val];
      this.updateLivePreview();
    };
    slider.addEventListener('input', updateDesc);
    updateDesc();
  });
}

  savePerson() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const styleVal = this.elements.style.value;
    if (!styleVal) {
      alert("Please select a style for the profile.");
      return;
    }
    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    if (sliders.length === 0) {
      alert("No traits available to save. Please ensure a style is selected.");
      return;
    }
    const traits = {};
    sliders.forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });
    const personData = {
      id: Date.now(),
      name,
      role,
      style: styleVal ? bdsmData[role].styles.find(s => s.name.toLowerCase() === styleVal.toLowerCase())?.name : "",
      traits
    };
    if (this.currentEditId) {
      const person = this.people.find(p => p.id === this.currentEditId);
      if (person) {
        Object.assign(person, personData);
        localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
      }
      this.currentEditId = null;
    } else {
      this.previewPerson = personData;
    }
    this.resetForm();
    this.updateLivePreview();
  }

  resetForm() {
    this.elements.name.value = '';
    this.elements.role.value = 'submissive';
    this.renderStyles('submissive');
    this.elements.style.value = '';
    this.renderTraits('submissive', '');
  }

  renderList() {
    this.elements.peopleList.innerHTML = this.people.length === 0 ?
      `<li>No kinky pals yet—add some sparkle! ✨</li>` :
      this.people.map(person => `
        <li class="person" data-id="${person.id}">
          ${person.name} (${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style || "N/A"})
          <button class="edit-btn">Edit</button>
        </li>
      `).join('');
  }

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;
    this.currentEditId = personId;
    this.elements.name.value = person.name;
    this.elements.role.value = person.role;
    this.renderStyles(person.role);
    this.elements.style.value = person.style.toLowerCase();
    this.renderTraits(person.role, person.style);
    Object.entries(person.traits).forEach(([traitName, value]) => {
      const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
      if (slider) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
      }
    });
    this.updateLivePreview();
  }

  updateLivePreview() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const style = this.elements.style.value;
    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });
    const previewData = this.previewPerson || { name, role, style, traits };
    if (!style) {
      document.getElementById('live-preview').innerHTML = `<p>Pick a style to see your kinky magic unfold! 🌈</p>`;
      return;
    }
    const getBreakdown = role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(previewData.style, traits);
    let html = `<h3>🎀 ${name}’s Live Vibe</h3>`;
    html += `<p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)} - ${previewData.style}</p>`;
    html += `<p><strong>Power Move:</strong> ${breakdown.strengths}</p>`;
    html += `<p><strong>Next Quest:</strong> ${breakdown.improvements}</p>`;
    document.getElementById('live-preview').innerHTML = html;
  }

  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;
    const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(person.style, person.traits);
    let html = `<h2>🎉 ${person.name}’s Kinky Kingdom (${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style}) 🎉</h2>`;
    const intros = {
      submissive: "Welcome to the land of sweet surrender, where you bow with a twinkle and a skip!",
      brat: "Step into the bratty battlefield, where you sass your way to glory with a cheeky grin!",
      bunny: "Hop into the bunny burrow, where you bounce and snuggle your way into hearts!",
      fawn: "Tiptoe into the fawn forest, where your shy charm casts a gentle spell!",
      toy: "Spin into the toy box, where you twist and giggle through every adventure!",
      dominant: "Enter the throne room of power, where you rule with a wink and a mighty roar!",
      trainer: "Stride into the training grounds, where you sculpt greatness with a patient paw!",
      knight: "Gallop into the knight’s keep, where honor and shields shine bright!",
      artist: "Dance into the artist’s studio, where your wild dreams paint the sky!",
      beast: "Roar into the beast’s lair, where raw power and instinct reign supreme!"
    };
    html += `<p style="font-style: italic; color: var(--accent-color);">${intros[person.style.toLowerCase()]}</p>`;
    html += `
      <h3>🌈 Your Epic Strengths & Quests</h3>
      <div class="style-breakdown">
        <div class="strengths">
          <h4>✨ Your Legendary Powers</h4>
          <p>${breakdown.strengths}</p>
        </div>
        <div class="improvements">
          <h4>🌟 Your Next Adventure</h4>
          <p>${breakdown.improvements}</p>
        </div>
      </div>
    `;
    html += `<h3>🎨 Your Trait Tales</h3>`;
    const allTraits = [...bdsmData[person.role].coreTraits, ...(bdsmData[person.role].styles.find(s => s.name === person.style)?.traits || [])];
    for (const [traitName, score] of Object.entries(person.traits)) {
      const traitObj = allTraits.find(t => t.name === traitName);
      if (!traitObj) continue;
      const descText = traitObj.desc[score];
      const flair = score <= 2 ? "You’re a budding star—ready to bloom with a little mischief!" :
                   score === 3 ? "You’re rocking the middle ground—poised for a grand leap!" :
                   "You’re a dazzling force—unleashing epic vibes left and right!";
      html += `
        <div class="trait-detail" style="border: 2px dashed var(--accent-color); padding: 10px; margin: 5px 0;">
          <h4>${traitName.charAt(0).toUpperCase() + traitName.slice(1)} - Level ${score} 🌟</h4>
          <p><strong>Your Vibe:</strong> ${descText}</p>
          <p><strong>Quest Note:</strong> ${flair}</p>
        </div>
      `;
    }
    this.elements.modalBody.innerHTML = html;
    this.elements.modal.style.display = 'flex';
  }
}

new TrackerApp();
