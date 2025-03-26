import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    this.people = JSON.parse(localStorage.getItem('kinkProfiles')) || [];
    this.previewPerson = null; // Used for temporary preview before saving a *new* person
    this.currentEditId = null; // ID of the person being edited
    this.elements = {
      // Form Elements
      name: document.getElementById('name'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      goals: document.getElementById('goals'), // New Goal field
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'), // New Clear button

      // List Elements
      peopleList: document.getElementById('people-list'),

      // Preview Elements
      livePreview: document.getElementById('live-preview'),

      // Detail Modal Elements
      modal: document.getElementById('detail-modal'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close'),

      // Resources Modal Elements
      resourcesBtn: document.getElementById('resources-btn'),
      resourcesModal: document.getElementById('resources-modal'),
      resourcesClose: document.getElementById('resources-close'),

      // Theme Toggle
      themeToggle: document.getElementById('theme-toggle')
    };
    this.addEventListeners();
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview(); // Initial preview update
  }

  addEventListeners() {
    // Form interactions
    this.elements.role.addEventListener('change', () => {
      const role = this.elements.role.value;
      this.renderStyles(role);
      this.elements.style.value = ''; // Reset style dropdown
      this.renderTraits(role, ''); // Render only core traits initially
      this.updateLivePreview();
    });
    this.elements.style.addEventListener('change', () => {
      this.renderTraits(this.elements.role.value, this.elements.style.value);
      this.updateLivePreview();
    });
    this.elements.name.addEventListener('input', () => this.updateLivePreview());
    this.elements.goals.addEventListener('input', () => this.updateLivePreview()); // Update preview if goals change

    // Buttons
    this.elements.save.addEventListener('click', () => this.savePerson());
    this.elements.clearForm.addEventListener('click', () => this.resetForm(true)); // Pass true to clear preview
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

    // People List interactions (using event delegation)
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (!personLi) return;
      const personId = parseInt(personLi.dataset.id);

      if (e.target.classList.contains('edit-btn')) {
        this.editPerson(personId);
      } else if (e.target.classList.contains('delete-btn')) {
        this.deletePerson(personId);
      } else {
        this.showPersonDetails(personId); // Click anywhere else on the item
      }
    });

    // Modal interactions
    this.elements.modalClose.addEventListener('click', () => this.closeModal(this.elements.modal));
    this.elements.resourcesBtn.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
    this.elements.resourcesClose.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));

    // Close modals if clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === this.elements.modal) this.closeModal(this.elements.modal);
        if (e.target === this.elements.resourcesModal) this.closeModal(this.elements.resourcesModal);
    });

    // Dynamic listener for trait sliders (attached in renderTraits)
    this.elements.traitsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.updateTraitDescription(e.target);
            this.updateLivePreview(); // Update preview on slider change
        }
    });

     // Dynamic listener for saving reflections (attached in showPersonDetails)
     this.elements.modalBody.addEventListener('click', (e) => {
        if (e.target.id === 'save-reflections-btn') {
            const personId = parseInt(e.target.dataset.personId);
            this.saveReflections(personId);
        }
    });
  }

  // --- Rendering Functions ---

  renderStyles(role) {
    this.elements.style.innerHTML = '<option value="">Pick your flavor!</option>';
    if (!bdsmData[role] || !bdsmData[role].styles) return; // Safety check

    bdsmData[role].styles.forEach(s => {
      this.elements.style.innerHTML += `<option value="${s.name}">${s.name}</option>`; // Use exact name for value
    });
  }

  renderTraits(role, styleName) {
    this.elements.traitsContainer.innerHTML = '';
    if (!bdsmData[role]) return; // Safety check

    const coreTraits = bdsmData[role].coreTraits || [];
    let styleTraits = [];

    if (styleName) {
      const styleObj = bdsmData[role].styles.find(s => s.name === styleName);
      styleTraits = styleObj ? styleObj.traits : [];
    }

    const allTraits = [...coreTraits, ...styleTraits];

    if (allTraits.length === 0 && styleName) {
         this.elements.traitsContainer.innerHTML = `<p class="muted-text">No specific traits defined for ${styleName} yet, using core traits.</p>`;
         // Still render core traits if style has none defined
         coreTraits.forEach(trait => this.elements.traitsContainer.innerHTML += this.createTraitHTML(trait));
    } else if (allTraits.length === 0 && !styleName) {
         this.elements.traitsContainer.innerHTML = `<p class="muted-text">Select a style to see specific traits.</p>`;
         // Still render core traits
         coreTraits.forEach(trait => this.elements.traitsContainer.innerHTML += this.createTraitHTML(trait));
    } else {
        allTraits.forEach(trait => this.elements.traitsContainer.innerHTML += this.createTraitHTML(trait));
    }


    // Initial description update for all sliders
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      this.updateTraitDescription(slider);
    });
  }

  createTraitHTML(trait) {
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
    // Default value to 3, ensure it's set for initial description
    return `
      <div class="trait">
        <label>${displayName}</label>
        <input type="range" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" aria-label="${displayName} slider"/>
        <span class="trait-value">3</span>
        <div class="trait-desc muted-text"></div>
      </div>`;
  }

  updateTraitDescription(slider) {
      const traitName = slider.getAttribute('data-trait');
      const value = slider.value;
      const descDiv = slider.parentElement.querySelector('.trait-desc');
      const valueSpan = slider.parentElement.querySelector('.trait-value');
      const role = this.elements.role.value;
      const styleName = this.elements.style.value;

      const coreTraitData = bdsmData[role]?.coreTraits.find(t => t.name === traitName);
      let styleTraitData = null;
      if (styleName) {
          const styleObj = bdsmData[role]?.styles.find(s => s.name === styleName);
          styleTraitData = styleObj?.traits.find(t => t.name === traitName);
      }

      const traitData = styleTraitData || coreTraitData; // Prioritize style trait if exists

      if (valueSpan) valueSpan.textContent = value; // Update numeric value display

      if (descDiv && traitData && traitData.desc && traitData.desc[value]) {
          descDiv.textContent = traitData.desc[value];
      } else if (descDiv) {
          descDiv.textContent = 'Description not available.';
      }
  }

  renderList() {
    this.elements.peopleList.innerHTML = this.people.length === 0 ?
      `<li>No kinky pals yet—add some sparkle! ✨</li>` :
      this.people.map(person => this.createPersonListItemHTML(person)).join('');
  }

   createPersonListItemHTML(person) {
       const styleDisplay = person.style || "N/A";
       const roleDisplay = person.role.charAt(0).toUpperCase() + person.role.slice(1);
       return `
        <li class="person" data-id="${person.id}" tabindex="0" aria-label="View details for ${person.name}">
          <span class="person-info">
            <strong class="person-name">${person.name}</strong>
            <span class="person-details muted-text">(${roleDisplay} - ${styleDisplay})</span>
          </span>
          <span class="person-actions">
            <button class="edit-btn small-btn" aria-label="Edit ${person.name}">✏️ Edit</button>
            <button class="delete-btn small-btn" aria-label="Delete ${person.name}">🗑️ Delete</button>
          </span>
        </li>
      `;
   }


  // --- Data Handling Functions ---

  savePerson() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const styleName = this.elements.style.value; // Use the selected style name
    const goals = this.elements.goals.value.trim();

    if (!styleName) {
      alert("Please select a style for the profile.");
      return;
    }

    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    if (sliders.length === 0 && (bdsmData[role]?.coreTraits?.length > 0 || bdsmData[role]?.styles.find(s => s.name === styleName)?.traits?.length > 0)) {
        // This case should ideally not happen if renderTraits works correctly
        alert("Error: Traits not loaded correctly. Cannot save.");
        return;
    }


    const traits = {};
    sliders.forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });

    // Ensure core traits are saved even if not displayed (e.g., if style has no specific traits)
     bdsmData[role]?.coreTraits.forEach(coreTrait => {
        if (!traits.hasOwnProperty(coreTrait.name)) {
            // Find slider if exists, else default to 3 - though it *should* exist if rendered
            const coreSlider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${coreTrait.name}"]`);
            traits[coreTrait.name] = coreSlider ? coreSlider.value : '3';
        }
    });


    const personData = {
      id: this.currentEditId || Date.now(), // Use existing ID if editing
      name,
      role,
      style: styleName, // Store the exact style name
      goals,
      traits,
      reflections: this.currentEditId ? (this.people.find(p => p.id === this.currentEditId)?.reflections || {}) : {} // Preserve reflections on edit
    };

    if (this.currentEditId) {
      // Update existing person
      const index = this.people.findIndex(p => p.id === this.currentEditId);
      if (index !== -1) {
        this.people[index] = personData;
      }
      this.currentEditId = null; // Clear edit state
      this.elements.save.textContent = 'Save Your Sparkle! 💖'; // Reset button text
    } else {
      // Add new person
      this.people.push(personData);
    }

    this.saveToLocalStorage();
    this.renderList();
    this.resetForm(true); // Clear form and preview after saving
    alert(`${name}'s profile saved successfully! ✨`);
  }

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    this.currentEditId = personId; // Set edit state

    // Populate form fields
    this.elements.name.value = person.name;
    this.elements.role.value = person.role;
    this.elements.goals.value = person.goals || '';

    // Render styles first, then set the value, then render traits
    this.renderStyles(person.role);
    this.elements.style.value = person.style; // Set the style dropdown

    // Ensure traits are rendered *after* style is set
    this.renderTraits(person.role, person.style);

    // Set slider values *after* traits are rendered
    setTimeout(() => { // Use setTimeout to ensure DOM is updated
        Object.entries(person.traits).forEach(([traitName, value]) => {
            const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
            if (slider) {
                slider.value = value;
                this.updateTraitDescription(slider); // Update description immediately
            }
        });
         this.updateLivePreview(); // Update preview after all fields are set
         this.elements.save.textContent = 'Update Sparkle! ✨'; // Change button text
         window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }, 0);
  }

  deletePerson(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) return;

      if (confirm(`Are you sure you want to delete ${person.name}'s profile? This cannot be undone.`)) {
          this.people = this.people.filter(p => p.id !== personId);
          this.saveToLocalStorage();
          this.renderList();
          // If the deleted person was being edited, reset the form
          if (this.currentEditId === personId) {
              this.resetForm(true);
          }
          alert(`${person.name}'s profile deleted.`)
      }
  }


  resetForm(clearPreview = false) {
    this.elements.name.value = '';
    this.elements.role.value = 'submissive'; // Default role
    this.elements.goals.value = '';
    this.renderStyles('submissive'); // Render default styles
    this.elements.style.value = ''; // Reset style dropdown
    this.renderTraits('submissive', ''); // Render default traits
    this.currentEditId = null; // Clear edit state
    this.elements.save.textContent = 'Save Your Sparkle! 💖'; // Reset button text

    if (clearPreview) {
      this.previewPerson = null; // Clear specific preview data
      this.updateLivePreview(); // Update to show default state
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
  }

  // --- Live Preview ---

  updateLivePreview() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const style = this.elements.style.value;
    const goals = this.elements.goals.value.trim();

    if (!style) {
      this.elements.livePreview.innerHTML = `<p class="muted-text">Pick a style to see your kinky magic unfold! 🌈</p>`;
      return;
    }

    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });

    // If editing, use the data from the form directly
    const previewData = { name, role, style, traits, goals };

    const getBreakdown = role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(previewData.style, traits); // Pass style name

    let html = `<h3 class="preview-title">🎀 ${name}’s Live Vibe 🎀</h3>`;
    html += `<p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>`;
    html += `<p><strong>Style:</strong> ${previewData.style || "N/A"}</p>`;
    if (goals) {
        html += `<p><strong>Goals:</strong> ${this.escapeHTML(goals)}</p>`;
    }
    html += `<div class="style-breakdown preview-breakdown">`;
     if (breakdown.strengths) {
        html += `<div class="strengths"><h4>✨ Strengths & Powers</h4><p>${breakdown.strengths}</p></div>`;
     }
     if (breakdown.improvements) {
         html += `<div class="improvements"><h4>🌟 Growth Opportunities</h4><p>${breakdown.improvements}</p></div>`;
     }
    html += `</div>`;


    this.elements.livePreview.innerHTML = html;
  }

  // --- Modal Display ---

  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    const breakdown = getBreakdown(person.style, person.traits); // Pass style name

    // --- Header & Intro ---
    let html = `<h2 class="modal-title">🎉 ${this.escapeHTML(person.name)}’s Kinky Kingdom 🎉</h2>`;
    html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style}</p>`;

    // Fetch dynamic intro based on style
    const intro = this.getIntroForStyle(person.style);
    if (intro) {
        html += `<p class="modal-intro">${intro}</p>`;
    }

    // --- Goals ---
     if (person.goals) {
        html += `<h3>🎯 Current Goals</h3>`;
        html += `<p class="well">${this.escapeHTML(person.goals)}</p>`;
    }

    // --- Style Breakdown ---
    html += `<h3>🌈 Strengths & Growth Areas</h3>`;
    html += `<div class="style-breakdown modal-breakdown">`;
     if (breakdown.strengths) {
        html += `<div class="strengths"><h4>✨ Your Powers</h4><p>${breakdown.strengths}</p></div>`;
     }
     if (breakdown.improvements) {
         html += `<div class="improvements"><h4>🌟 Your Next Quest</h4><p>${breakdown.improvements}</p></div>`;
     }
    html += `</div>`;

    // --- Trait Details ---
    html += `<h3>🎨 Your Trait Tales</h3>`;
    const allTraitsData = [
        ...(bdsmData[person.role]?.coreTraits || []),
        ...(bdsmData[person.role]?.styles.find(s => s.name === person.style)?.traits || [])
    ];

    html += '<div class="trait-details-grid">'; // Use grid for better layout
    for (const [traitName, score] of Object.entries(person.traits)) {
        const traitObj = allTraitsData.find(t => t.name === traitName);
        if (!traitObj) continue; // Skip if trait definition not found

        const descText = traitObj.desc?.[score] || "No description for this level.";
        const flair = this.getFlairForScore(score);
        const displayName = traitName.charAt(0).toUpperCase() + traitName.slice(1);

        html += `
        <div class="trait-detail-item">
          <h4>${displayName} - Level ${score} ${this.getEmojiForScore(score)}</h4>
          <p><strong>Your Vibe:</strong> ${this.escapeHTML(descText)}</p>
          <p class="muted-text"><em>${flair}</em></p>
        </div>`;
    }
     html += '</div>'; // Close grid


    // --- Reflections ---
    html += `<h3>📝 Reflections & Journal</h3>`;
    html += `<p>Use this space to jot down thoughts, experiences, or progress related to this profile.</p>`;
    html += `<textarea id="reflections-text" class="reflections-textarea" rows="6" placeholder="How are things progressing? What have you learned?">${this.escapeHTML(person.reflections?.[Date.now()] || '')}</textarea>`; // Simple, new entry each time - could be improved
    // For a more robust journal: person.reflections could be an array of { date: timestamp, text: "..." }
    // Display previous entries here...
    // Let's keep it simple for now: load the *last* reflection, or make it a single field.
    // Reverting to single reflection field for simplicity:
    html = html.replace(/\[Date\.now\(\)\]||\s''/g, ' || \'\''); // Fix textarea load
    html += `<textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="How are things progressing? What have you learned?">${this.escapeHTML(person.reflections?.text || '')}</textarea>`;
    html += `<button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save Reflections 💭</button>`;


    this.elements.modalBody.innerHTML = html;
    this.openModal(this.elements.modal);
  }

   saveReflections(personId) {
        const person = this.people.find(p => p.id === personId);
        const reflectionText = document.getElementById('reflections-text')?.value;

        if (!person || reflectionText === undefined) {
            alert("Error saving reflections.");
            return;
        }

        // Simple approach: store last reflection text
        if (!person.reflections) {
            person.reflections = {};
        }
        person.reflections.text = reflectionText;
        person.reflections.lastUpdated = Date.now();

        this.saveToLocalStorage();
        alert("Reflections saved! ✨");
        // Optionally, update the display in the modal if needed, but closing/reopening will show it.
    }

  // --- Helper Functions ---

   getIntroForStyle(styleName) {
        // Simple map for intros - expand as needed
        const intros = {
          "Submissive": "Welcome to the path of delightful deference!",
          "Brat": "Ready to stir up some playful trouble? Let the games begin!",
          "Slave": "Embrace the beauty of deep devotion and surrender.",
          "Pet": "Time for head pats and happy wags! Explore your affectionate side.",
          "Little": "Enter a world of innocence, play, and caring guidance.",
          "Masochist": "Explore the fascinating edge where sensation meets release.",
          "Dominant": "Step into your power and guide the dynamic with confidence.",
          "Master / Mistress": "Command respect and cultivate excellence with clear authority.",
          "Sadist": "Delve into the art of sensation and the psychology of reaction.",
          "Caregiver / Daddy / Mommy": "Rule with a nurturing heart, providing structure and warmth.",
          "Primal (Hunter / Beast)": "Unleash your instincts and dominate with raw power."
          // Add more...
        };
        const normalizedKey = styleName.toLowerCase().replace(/ \/ /g, '/').replace(/\(.*\)/g, '').trim();
        // Try finding a specific match first, then maybe a more general one
        return intros[styleName] || intros[normalizedKey] || "Explore your unique expression!";
    }

    getFlairForScore(score) {
        score = parseInt(score);
        return score <= 2 ? "🌱 Keep nurturing this trait!" :
               score === 3 ? "⚖️ Solidly balanced, ready to grow further!" :
               "🌟 Wow, this trait shines brightly!";
    }

     getEmojiForScore(score) {
        score = parseInt(score);
        return score <= 2 ? "💧" : score === 3 ? "🌱" : score === 4 ? "✨" : "🌟";
    }

  escapeHTML(str) {
      if (typeof str !== 'string') return str; // Return non-strings as is
      return str.replace(/[&<>"']/g, function(match) {
          const escape = {
              '&': '&',
              '<': '<',
              '>': '>',
              '"': '"',
              "'": '''
          };
          return escape[match];
      });
  }

  toggleTheme() {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      this.elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙'; // Update icon
      // Optional: Save theme preference to localStorage
      // localStorage.setItem('kinkCompassTheme', newTheme);
  }

  // Apply saved theme on load (add this to constructor or call after)
  // applySavedTheme() {
  //    const savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
  //     document.body.setAttribute('data-theme', savedTheme);
  //      this.elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  // }

  openModal(modalElement) {
      if (modalElement) {
          modalElement.style.display = 'flex';
          // Focus management could be added here for accessibility
      }
  }

  closeModal(modalElement) {
       if (modalElement) {
          modalElement.style.display = 'none';
       }
  }

}

// Initialize the app once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TrackerApp();
});
