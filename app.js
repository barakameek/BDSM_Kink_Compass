import { bdsmData } from './data.js';

class TrackerApp {
  constructor() {
    this.people = JSON.parse(localStorage.getItem('trackerPeople')) || [];
    this.initElements();
    this.addEventListeners();
    this.renderStyles('submissive');
    this.renderTraits('submissive', '');
    this.renderList();
  }

  initElements() {
    this.elements = {
      role: document.getElementById('role'),
      name: document.getElementById('name'),
      style: document.getElementById('style'),
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      peopleList: document.getElementById('people-list'),
      themeToggle: document.getElementById('theme-toggle'),
      modal: document.createElement('div'),
      modalContent: document.createElement('div'),
      modalClose: document.createElement('button')
    };
    this.elements.modal.className = 'modal';
    this.elements.modalContent.className = 'modal-content';
    this.elements.modalClose.className = 'modal-close';
    this.elements.modalClose.textContent = '✨ Close';
    this.elements.modalContent.appendChild(this.elements.modalClose);
    this.elements.modal.appendChild(this.elements.modalContent);
    document.body.appendChild(this.elements.modal);
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
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (personLi) {
        const personId = parseInt(personLi.dataset.id);
        this.showPersonDetails(personId);
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

    const person = {
      id: Date.now(),
      role,
      name: this.elements.name.value || "Unnamed",
      style,
      traits
    };

    this.people.push(person);
    localStorage.setItem('trackerPeople', JSON.stringify(this.people));
    this.renderList();
    this.elements.name.value = '';
    this.elements.style.value = '';
    this.renderTraits(role, '');
  }

  renderList() {
    this.elements.peopleList.innerHTML = '';
    this.people.forEach(person => {
      const traitSummary = Object.entries(person.traits)
        .map(([trait, value]) => `${trait}: ${value}`)
        .join(', ');
      this.elements.peopleList.innerHTML += `
        <li class="person" data-id="${person.id}">
          ${person.name} (${person.role} - ${person.style})<br><small>${traitSummary}</small>
        </li>
      `;
    });
  }

  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    const roleData = bdsmData[person.role];
    const coreTraits = roleData.coreTraits;
    const styleTraits = roleData.styles.find(s => s.name.toLowerCase() === person.style.toLowerCase())?.traits || [];

    let html = `<h2>🌸 ${person.name}'s KinkCompass Breakdown 🌸</h2>`;
    html += `<p><strong>Role:</strong> ${person.role} | <strong>Style:</strong> ${person.style}</p>`;

    const renderTraitDetails = (trait, value) => {
      const suggestion = value <= 3 ? trait.improvement[value] : trait.support[value];
      return `
        <div class="trait-detail">
          <h3>${trait.name.charAt(0).toUpperCase() + trait.name.slice(1)}: ${value}</h3>
          <p><strong>You said:</strong> ${trait.desc[value]}</p>
          <p><strong>${value <= 3 ? 'Grow with a Giggle' : 'Shine Even Brighter'}:</strong> ${suggestion}</p>
        </div>
      `;
    };

    html += '<h3>Core Traits</h3>';
    coreTraits.forEach(trait => {
      const value = person.traits[trait.name];
      html += renderTraitDetails(trait, value);
    });

    html += '<h3>Style Traits</h3>';
    styleTraits.forEach(trait => {
      const value = person.traits[trait.name];
      html += renderTraitDetails(trait, value);
    });

    this.elements.modalContent.innerHTML = html;
    this.elements.modalContent.appendChild(this.elements.modalClose);
    this.elements.modal.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => new TrackerApp());
