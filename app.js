import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    this.people = JSON.parse(localStorage.getItem('kinkProfiles')) || [];
    this.currentEditId = null;
    // Grab UI elements
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
    // Initialize form with default role
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
  }

  addEventListeners() {
    // When role changes, update style options and traits
    this.elements.role.addEventListener('change', () => {
      const role = this.elements.role.value;
      this.renderStyles(role);
      // Reset style selection on role change
      this.elements.style.value = '';
      this.renderTraits(role, '');
    });
    // When style changes, update trait sliders
    this.elements.style.addEventListener('change', () => {
      this.renderTraits(this.elements.role.value, this.elements.style.value);
    });
    // Save button
    this.elements.save.addEventListener('click', () => this.savePerson());
    // Theme toggle button
    this.elements.themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });
    // Clicking on a profile in the list
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (!personLi) return;
      const personId = parseInt(personLi.dataset.id);
      if (e.target.classList.contains('edit-btn')) {
        // Edit mode
        this.editPerson(personId);
      } else {
        // Show details modal
        this.showPersonDetails(personId);
      }
    });
    // Modal close button
    this.elements.modalClose.addEventListener('click', () => {
      this.elements.modal.style.display = 'none';
    });
  }

  renderStyles(role) {
    // Populate the style dropdown based on role
    this.elements.style.innerHTML = '<option value="">Select Style</option>';
    bdsmData[role].styles.forEach(s => {
      this.elements.style.innerHTML += `<option value="${s.name.toLowerCase()}">${s.name}</option>`;
    });
  }

  renderTraits(role, style) {
    // Clear previous traits
    this.elements.traitsContainer.innerHTML = '';
    const coreTraits = bdsmData[role].coreTraits;
    let styleTraits = [];
    if (style) {
      // Find selected style's trait definitions
      const styleObj = bdsmData[role].styles.find(s => s.name.toLowerCase() === style.toLowerCase());
      styleTraits = styleObj ? styleObj.traits : [];
    }
    // Helper to render trait slider HTML
    const renderTrait = (trait) => {
      const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
      return `<div class="trait">
        <label>${displayName}</label>
        <input type="range" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" />
        <div class="trait-desc"></div>
      </div>`;
    };
    // Add core traits (always)
    coreTraits.forEach(trait => {
      this.elements.traitsContainer.innerHTML += renderTrait(trait);
    });
    // Add style-specific traits if style selected
    styleTraits.forEach(trait => {
      this.elements.traitsContainer.innerHTML += renderTrait(trait);
    });
    // Attach input listeners to update descriptions dynamically
    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    sliders.forEach(slider => {
      const traitName = slider.getAttribute('data-trait');
      const descDiv = slider.parentElement.querySelector('.trait-desc');
      const traitData = [...coreTraits, ...styleTraits].find(t => t.name === traitName);
      const updateDesc = () => {
        const val = slider.value;
        if (traitData && traitData.desc[val]) {
          descDiv.textContent = traitData.desc[val];
        }
      };
      slider.addEventListener('input', updateDesc);
      // Initialize description text
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
    // Collect trait scores
    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });
    if (this.currentEditId) {
      // Update existing profile
      const person = this.people.find(p => p.id === this.currentEditId);
      if (person) {
        person.name = name;
        person.role = role;
        person.style = styleVal ? bdsmData[role].styles.find(s => s.name.toLowerCase() === styleVal.toLowerCase())?.name : "";
        person.traits = traits;
      }
      this.currentEditId = null;
    } else {
      // Add new profile
      const newPerson = {
        id: Date.now(),
        name: name,
        role: role,
        style: styleVal ? bdsmData[role].styles.find(s => s.name.toLowerCase() === styleVal.toLowerCase())?.name : "",
        traits: traits
      };
      this.people.push(newPerson);
    }
    // Save to localStorage
    localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
    // Reset form for new entry
    this.resetForm();
    // Re-render profile list
    this.renderList();
  }

  renderList() {
    this.elements.peopleList.innerHTML = '';
    if (this.people.length === 0) {
      this.elements.peopleList.innerHTML = `<li>No profiles yet. Add a new profile!</li>`;
      return;
    }
    this.people.forEach(person => {
      const roleDisplay = person.role.charAt(0).toUpperCase() + person.role.slice(1);
      const styleDisplay = person.style ? person.style : "N/A";
      this.elements.peopleList.innerHTML += `
        <li class="person" data-id="${person.id}">
          ${person.name} (${roleDisplay} - ${styleDisplay})
          <button class="edit-btn">Edit</button>
        </li>`;
    });
  }

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;
    // Populate form fields with existing profile data
    this.currentEditId = personId;
    this.elements.name.value = person.name;
    this.elements.role.value = person.role;
    this.renderStyles(person.role);
    this.elements.style.value = person.style.toLowerCase();
    this.renderTraits(person.role, person.style);
    // Set sliders to saved values
    Object.entries(person.traits).forEach(([traitName, value]) => {
      const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
      if (slider) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
      }
    });
  }

  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;
    // Determine breakdown function based on role
    const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(person.style, person.traits);
    // Build the modal content
    let html = `<h2>✨ ${person.name} (${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style}) ✨</h2>`;
    html += `
      <h3>🌟 Your Style Strengths & Growth</h3>
      <div class="style-breakdown">
        <div class="strengths">
          <h4>💪 Your Superpowers</h4>
          <p>${breakdown.strengths}</p>
        </div>
        <div class="improvements">
          <h4>🌱 Areas to Bloom</h4>
          <p>${breakdown.improvements}</p>
        </div>
      </div>
    `;
    html += `<h3>🎀 Traits Overview</h3>`;
    // Combine core and style traits for display
    const allTraits = [
      ...bdsmData[person.role].coreTraits,
      ...(bdsmData[person.role].styles.find(s => s.name === person.style)?.traits || [])
    ];
    for (const [traitName, score] of Object.entries(person.traits)) {
      const traitObj = allTraits.find(t => t.name === traitName);
      if (!traitObj) continue;
      const descText = traitObj.desc[score];
      // Simple suggestion: if score low, encourage improvement, if high, encourage use
      const suggestionText = score <= 3
        ? `Consider working on <em>${traitName}</em> a bit more to boost your comfort and confidence.`
        : `Great job on <em>${traitName}</em>! Keep using it to your advantage.`;
      html += `
        <div class="trait-detail">
          <h4>${traitName.charAt(0).toUpperCase() + traitName.slice(1)} - Score ${score}</h4>
          <p><strong>Description:</strong> ${descText}</p>
          <p><strong>Tip:</strong> ${suggestionText}</p>
        </div>
      `;
    }
    this.elements.modalBody.innerHTML = html;
    this.elements.modal.style.display = 'flex';
  }
}

// Initialize the application
new TrackerApp();
