// --- START OF FILE app.js ---

import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    this.people = []; // Initialize empty, load later
    this.previewPerson = null; // Used for temporary preview before saving a *new* person
    this.currentEditId = null; // ID of the person being edited

    // Find elements immediately
    this.elements = {
      formSection: document.getElementById('form-section'), // For scrolling into view
      // Form Elements
      name: document.getElementById('name'),
      role: document.getElementById('role'),
      style: document.getElementById('style'),
      goals: document.getElementById('goals'),
      traitsContainer: document.getElementById('traits-container'),
      save: document.getElementById('save'),
      clearForm: document.getElementById('clear-form'),

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

    // Check if essential elements were found
    let essentialElementMissing = false;
    for (const key in this.elements) {
        if (!this.elements[key]) {
            console.error(`Essential element not found in constructor: ID '${key}' might be missing or misspelled in index.html.`);
            essentialElementMissing = true;
            // You could throw an error here to halt execution if an element is crucial
            // throw new Error(`Essential element missing: ${key}`);
        }
    }

    if (essentialElementMissing) {
        // Optionally display an error to the user if critical elements are missing
        document.body.innerHTML = '<p style="color: red; padding: 1em;">Error: Critical HTML element missing. App cannot start. Check console (F12).</p>';
        return; // Prevent further execution
    }


    console.log("TrackerApp Constructor: Elements found. Adding listeners...");
    this.addEventListeners();
    console.log("TrackerApp Constructor: Listeners added. Loading data and performing initial render...");

    // Load data from localStorage
    this.loadFromLocalStorage();

    // Apply theme *before* rendering potentially themed elements
    this.applySavedTheme();

    // Initial render based on default/loaded state
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview(); // Initial preview update
    console.log("TrackerApp Constructor: Initial render complete.");
  }

  loadFromLocalStorage() {
      try {
          const storedPeople = localStorage.getItem('kinkProfiles');
          this.people = storedPeople ? JSON.parse(storedPeople) : [];
          console.log(`Loaded ${this.people.length} profiles from localStorage.`);
      } catch (error) {
          console.error("Error loading profiles from localStorage:", error);
          this.people = []; // Reset to empty array on error
          alert("Could not load saved profiles. Starting fresh.");
      }
  }

  saveToLocalStorage() {
    try {
        localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
        console.log(`Saved ${this.people.length} profiles to localStorage.`);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Could not save profiles to local storage. Storage might be full or disabled.");
    }
  }

  addEventListeners() {
    // Form interactions
    this.elements.role.addEventListener('change', () => {
        console.log("Role changed");
        const role = this.elements.role.value;
        this.renderStyles(role);
        this.elements.style.value = ''; // Reset style dropdown
        this.renderTraits(role, ''); // Render only core traits initially
        this.updateLivePreview();
    });

    this.elements.style.addEventListener('change', () => {
        console.log("Style changed");
        this.renderTraits(this.elements.role.value, this.elements.style.value);
        this.updateLivePreview();
    });

    this.elements.name.addEventListener('input', () => this.updateLivePreview());
    this.elements.goals.addEventListener('input', () => this.updateLivePreview());

    // Buttons
    this.elements.save.addEventListener('click', () => this.savePerson());
    this.elements.clearForm.addEventListener('click', () => this.resetForm(true));
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

    // People List interactions (using event delegation)
    this.elements.peopleList.addEventListener('click', (e) => {
      const personLi = e.target.closest('.person');
      if (!personLi) return;

      const personId = parseInt(personLi.dataset.id);
      if (isNaN(personId)) return; // Ignore if ID is invalid

      if (e.target.classList.contains('edit-btn')) {
        this.editPerson(personId);
      } else if (e.target.classList.contains('delete-btn')) {
        this.deletePerson(personId);
      } else {
        // Click anywhere else on the item that isn't a button
        this.showPersonDetails(personId);
      }
    });

     // Allow keyboard activation for list items
    this.elements.peopleList.addEventListener('keydown', (e) => {
        const personLi = e.target.closest('.person');
        if (!personLi) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Prevent space bar scrolling
            const personId = parseInt(personLi.dataset.id);
            if (!isNaN(personId)) {
                 this.showPersonDetails(personId);
            }
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
     // Close modals with Escape key
     window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (this.elements.modal.style.display === 'flex') {
                 this.closeModal(this.elements.modal);
            }
             if (this.elements.resourcesModal.style.display === 'flex') {
                 this.closeModal(this.elements.resourcesModal);
            }
        }
     });

    // Dynamic listener for trait sliders (attached in renderTraits)
    this.elements.traitsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('trait-slider')) {
            this.updateTraitDescription(e.target);
            this.updateLivePreview(); // Update preview on slider change
        }
    });

     // Dynamic listener for saving reflections (attached in showPersonDetails)
     // Use delegation on the modal body
     this.elements.modalBody.addEventListener('click', (e) => {
        if (e.target.id === 'save-reflections-btn') {
            const personId = parseInt(e.target.dataset.personId);
             if (!isNaN(personId)) {
                this.saveReflections(personId);
            }
        }
    });
  }

  // --- Rendering Functions ---

  renderStyles(role) {
    this.elements.style.innerHTML = '<option value="">Pick your flavor!</option>';
    if (!bdsmData[role] || !bdsmData[role].styles) return; // Safety check

    bdsmData[role].styles.forEach(s => {
      // Use the exact style name for both the value and the displayed text
      this.elements.style.innerHTML += `<option value="${this.escapeHTML(s.name)}">${this.escapeHTML(s.name)}</option>`;
    });
  }

  renderTraits(role, styleName) {
    this.elements.traitsContainer.innerHTML = ''; // Clear previous traits
    if (!bdsmData[role]) return; // Safety check

    const coreTraits = bdsmData[role].coreTraits || [];
    let styleTraits = [];
    let styleObj = null; // Keep track of the style object

    if (styleName) {
      styleObj = bdsmData[role].styles.find(s => s.name === styleName);
      styleTraits = styleObj ? (styleObj.traits || []) : [];
    }

    // Determine which traits to render
    let traitsToRender = [];
    const uniqueTraitNames = new Set();

    // Always include core traits first
    coreTraits.forEach(trait => {
        if (!uniqueTraitNames.has(trait.name)) {
            traitsToRender.push(trait);
            uniqueTraitNames.add(trait.name);
        }
    });

    // Add style traits if a style is selected, avoiding duplicates
    if (styleName) {
        styleTraits.forEach(trait => {
            if (!uniqueTraitNames.has(trait.name)) {
                traitsToRender.push(trait);
                uniqueTraitNames.add(trait.name);
            }
        });
    }

    // Render the combined list
    if (traitsToRender.length === 0) {
         this.elements.traitsContainer.innerHTML = `<p class="muted-text">No traits defined for this selection.</p>`;
    } else {
        traitsToRender.forEach(trait => {
            this.elements.traitsContainer.innerHTML += this.createTraitHTML(trait);
        });
        // Initial description update for all sliders *after* they are added to DOM
        this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
            this.updateTraitDescription(slider);
        });
    }

     // Add informational message if style selected but has no *specific* traits
     if (styleName && styleObj && styleTraits.length === 0 && coreTraits.length > 0) {
        const messageP = document.createElement('p');
        messageP.className = 'muted-text trait-info-message'; // Added class for potential styling
        messageP.textContent = `Style '${this.escapeHTML(styleName)}' uses the core traits.`;
        // Prepend puts it before the traits
        this.elements.traitsContainer.prepend(messageP);
    } else if (!styleName && coreTraits.length === 0) {
        // Message if no style selected AND no core traits defined for the role
        this.elements.traitsContainer.innerHTML = `<p class="muted-text">Select a style or define core traits for this role.</p>`;
    }
  }

  createTraitHTML(trait) {
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
    // Create a unique ID for the input based on the trait name (ensure it's valid)
    const inputId = `trait-${trait.name.replace(/[^a-zA-Z0-9-_]/g, '-')}`; // Sanitize ID
    return `
      <div class="trait">
        <label for="${inputId}">${this.escapeHTML(displayName)}</label>
        {/* Add autocomplete="off" to sliders */}
        <input type="range" id="${inputId}" min="1" max="5" value="3" class="trait-slider" data-trait="${trait.name}" aria-label="${this.escapeHTML(displayName)} slider" autocomplete="off"/>
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

      // Find trait data - prioritize style-specific, fallback to core
      let traitData = null;
       if (styleName) {
          const styleObj = bdsmData[role]?.styles.find(s => s.name === styleName);
          traitData = styleObj?.traits?.find(t => t.name === traitName);
      }
      if (!traitData) {
           traitData = bdsmData[role]?.coreTraits?.find(t => t.name === traitName);
      }

      if (valueSpan) valueSpan.textContent = value; // Update numeric value display

      if (descDiv && traitData && traitData.desc && traitData.desc[value]) {
          descDiv.textContent = this.escapeHTML(traitData.desc[value]);
      } else if (descDiv) {
          // Clear description or show default if data missing
          descDiv.textContent = traitData ? 'Description for this level unavailable.' : 'Trait definition unavailable.';
      }
  }

  renderList() {
    if (!this.elements.peopleList) return; // Safety check
    this.elements.peopleList.innerHTML = this.people.length === 0 ?
      `<li>No kinky pals yet—add some sparkle! ✨</li>` :
      this.people.map(person => this.createPersonListItemHTML(person)).join('');
  }

  createPersonListItemHTML(person) {
       const styleDisplay = person.style ? this.escapeHTML(person.style) : "N/A";
       const roleDisplay = person.role.charAt(0).toUpperCase() + person.role.slice(1);
       const escapedName = this.escapeHTML(person.name);
       return `
        <li class="person" data-id="${person.id}" tabindex="0" aria-label="View details for ${escapedName}">
          <span class="person-info">
            <strong class="person-name">${escapedName}</strong>
            <span class="person-details muted-text">(${roleDisplay} - ${styleDisplay})</span>
          </span>
          <span class="person-actions">
            <button class="edit-btn small-btn" aria-label="Edit ${escapedName}">✏️ Edit</button>
            <button class="delete-btn small-btn" aria-label="Delete ${escapedName}">🗑️ Delete</button>
          </span>
        </li>
      `;
   }

  // --- Data Handling Functions ---

  savePerson() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const styleName = this.elements.style.value;
    const goals = this.elements.goals.value.trim();

    if (!styleName) {
      alert("Please select a style for the profile.");
      this.elements.style.focus(); // Focus the style dropdown
      return;
    }

    const sliders = this.elements.traitsContainer.querySelectorAll('.trait-slider');
    // Check if traits *should* be present based on data.js
    const expectedTraits = [
        ...(bdsmData[role]?.coreTraits || []),
        ...(bdsmData[role]?.styles.find(s => s.name === styleName)?.traits || [])
    ];
    // Use Set to count unique expected traits
    const uniqueExpectedTraitNames = new Set(expectedTraits.map(t => t.name));

    if (sliders.length !== uniqueExpectedTraitNames.size && uniqueExpectedTraitNames.size > 0) {
        // Discrepancy between rendered sliders and expected unique traits
        console.error("Save Error: Mismatch between rendered sliders and expected traits.", {
             renderedCount: sliders.length,
             expectedUniqueCount: uniqueExpectedTraitNames.size,
             role, styleName
        });
        alert("Error: Traits may not have loaded correctly. Cannot save. Please try selecting the style again or refresh the page.");
        return;
    }

    const traits = {};
    sliders.forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });

    // Ensure all *unique* expected traits for the selected role/style combo have a value
    // This acts as a final check, though the slider count check above is usually sufficient
    for (const traitName of uniqueExpectedTraitNames) {
        if (!traits.hasOwnProperty(traitName)) {
             // This case implies a slider was expected but not found, error out
             console.error(`Save Error: Expected trait '${traitName}' value missing from sliders.`);
             alert(`Error: Missing data for trait '${traitName}'. Cannot save.`);
             return;
        }
    }


    const personData = {
      id: this.currentEditId || Date.now(), // Use existing ID if editing, generate new if not
      name,
      role,
      style: styleName,
      goals,
      traits,
      // Preserve reflections only if editing, otherwise initialize empty
      reflections: this.currentEditId ? (this.people.find(p => p.id === this.currentEditId)?.reflections || {}) : {}
    };

    if (this.currentEditId) {
      // Update existing person
      const index = this.people.findIndex(p => p.id === this.currentEditId);
      if (index !== -1) {
        this.people[index] = personData;
        console.log(`Updated profile for ${name} (ID: ${this.currentEditId})`);
      } else {
        console.error("Error updating person: ID not found during save", this.currentEditId);
        alert("Error: Could not find the profile to update. Saving as new instead.");
         personData.id = Date.now(); // Generate a new ID
         this.people.push(personData);
      }
      this.currentEditId = null; // Clear edit state
      this.elements.save.textContent = 'Save Your Sparkle! 💖'; // Reset button text
    } else {
      // Add new person
      this.people.push(personData);
       console.log(`Added new profile for ${name} (ID: ${personData.id})`);
    }

    this.saveToLocalStorage();
    this.renderList();
    this.resetForm(true); // Clear form and preview after saving
    alert(`${this.escapeHTML(name)}'s profile saved successfully! ✨`);
  }

  editPerson(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) {
        console.error("Edit Error: Person not found with ID", personId);
        alert("Error: Could not find the profile to edit.");
        return;
    }

    console.log("Editing person:", person);

    this.currentEditId = personId; // Set edit state

    // Populate form fields
    this.elements.name.value = person.name;
    this.elements.role.value = person.role;
    this.elements.goals.value = person.goals || '';

    // Render styles for the person's role
    this.renderStyles(person.role);
    // Set the style dropdown value *after* options are rendered
    this.elements.style.value = person.style;

    // Render traits based on the person's role and *now selected* style
    this.renderTraits(person.role, person.style);

    // Set slider values after traits are rendered in the DOM
    // Use requestAnimationFrame to wait for the next repaint cycle
    requestAnimationFrame(() => {
        console.log("Setting slider values for:", person.traits);
        if (person.traits) {
             Object.entries(person.traits).forEach(([traitName, value]) => {
                const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                if (slider) {
                    // console.log(`Setting slider ${traitName} to ${value}`);
                    slider.value = value;
                    this.updateTraitDescription(slider); // Update description immediately
                } else {
                    console.warn(`Slider not found during edit for trait: ${traitName}. It might be obsolete or belong to a different style.`);
                    // Do not error out, just note the mismatch. The save function will handle discrepancies.
                }
            });
        } else {
            console.warn("Person object has no 'traits' property during edit.", person);
        }

        this.updateLivePreview(); // Update preview after all fields are set
        this.elements.save.textContent = 'Update Sparkle! ✨'; // Change button text

        // Scroll form into view smoothly and focus name field
        if (this.elements.formSection) {
             this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.elements.name.focus();
    });
  }

  deletePerson(personId) {
      const personIndex = this.people.findIndex(p => p.id === personId);
      if (personIndex === -1) {
           console.error("Delete Error: Person not found with ID", personId);
           return;
      }
      const personName = this.people[personIndex].name;

      if (confirm(`Are you sure you want to delete ${this.escapeHTML(personName)}'s profile? This cannot be undone.`)) {
          this.people.splice(personIndex, 1); // Remove the person from the array
          this.saveToLocalStorage();
          this.renderList();

          // If the deleted person was being edited, reset the form
          if (this.currentEditId === personId) {
              this.resetForm(true);
          }
          alert(`${this.escapeHTML(personName)}'s profile deleted.`);
          console.log(`Deleted profile for ${personName} (ID: ${personId})`);
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
      this.previewPerson = null; // Not strictly needed if preview always reads form, but good practice
      this.updateLivePreview(); // Update to show default state
    }
    // Focus the name field for a new entry
    this.elements.name.focus();
    console.log("Form reset.");
  }


  // --- Live Preview ---

  updateLivePreview() {
    const name = this.elements.name.value.trim() || "Unnamed";
    const role = this.elements.role.value;
    const style = this.elements.style.value;
    const goals = this.elements.goals.value.trim();

    // Get current trait values from sliders displayed in the form
    const traits = {};
    this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
      traits[slider.getAttribute('data-trait')] = slider.value;
    });

    // Construct preview data directly from the current form state
    const previewData = { name, role, style, traits, goals };

    // Generate HTML based on previewData
    let html = '';
    if (!style) {
        html = `<p class="muted-text">Pick a style to see your kinky magic unfold! 🌈</p>`;
    } else {
        const getBreakdown = role === 'submissive' ? getSubBreakdown : getDomBreakdown;
        // Pass the traits currently shown in the form to the breakdown function
        const breakdown = getBreakdown(previewData.style, traits);

        html = `<h3 class="preview-title">🎀 ${this.escapeHTML(name)}’s Live Vibe 🎀</h3>`;
        html += `<p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>`;
        html += `<p><strong>Style:</strong> ${previewData.style ? this.escapeHTML(previewData.style) : "N/A"}</p>`;
        if (goals) {
            html += `<p><strong>Goals:</strong> ${this.escapeHTML(goals)}</p>`;
        }
        html += `<div class="style-breakdown preview-breakdown">`;
        // Use innerHTML for breakdown text which might contain HTML tags like <strong>
        if (breakdown.strengths) {
            html += `<div class="strengths"><h4>✨ Strengths & Powers</h4><div>${breakdown.strengths}</div></div>`;
        }
        if (breakdown.improvements) {
            html += `<div class="improvements"><h4>🌟 Growth Opportunities</h4><div>${breakdown.improvements}</div></div>`;
        }
        html += `</div>`;
    }

    this.elements.livePreview.innerHTML = html;
  }


  // --- Modal Display ---

  showPersonDetails(personId) {
    const person = this.people.find(p => p.id === personId);
    if (!person) {
         console.error("Show Details Error: Person not found with ID", personId);
         return;
    }

    console.log("Showing details for:", person);

    const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
    // Ensure traits object exists, even if empty, for breakdown function
    const breakdown = getBreakdown(person.style, person.traits || {});

    // --- Header & Intro ---
    let html = `<h2 class="modal-title" id="detail-modal-title">🎉 ${this.escapeHTML(person.name)}’s Kinky Kingdom 🎉</h2>`;
    html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style ? this.escapeHTML(person.style) : 'N/A'}</p>`;

    const intro = this.getIntroForStyle(person.style);
    if (intro) {
        html += `<p class="modal-intro">${intro}</p>`; // Intro text assumed safe or pre-escaped if needed
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
        html += `<div class="strengths"><h4>✨ Your Powers</h4><div>${breakdown.strengths}</div></div>`;
    }
    if (breakdown.improvements) {
        html += `<div class="improvements"><h4>🌟 Your Next Quest</h4><div>${breakdown.improvements}</div></div>`;
    }
    html += `</div>`;

    // --- Trait Details ---
    html += `<h3>🎨 Your Trait Tales</h3>`;
    // Combine core and style traits definitions for lookup
    const allTraitDefinitions = [
        ...(bdsmData[person.role]?.coreTraits || []),
        ...(bdsmData[person.role]?.styles.find(s => s.name === person.style)?.traits || [])
    ];
    // Ensure uniqueness in definitions based on trait name
    const uniqueTraitDefinitions = Array.from(new Map(allTraitDefinitions.map(t => [t.name, t])).values());


    html += '<div class="trait-details-grid">';
    if (person.traits && Object.keys(person.traits).length > 0) {
         Object.entries(person.traits).forEach(([traitName, score]) => {
            const traitObj = uniqueTraitDefinitions.find(t => t.name === traitName);
            if (!traitObj) {
                 console.warn(`Definition not found for saved trait: ${traitName} in role ${person.role}. Displaying basic info.`);
                 // Display trait even if definition is missing/obsolete
                  html += `
                    <div class="trait-detail-item">
                      <h4>${this.escapeHTML(traitName.charAt(0).toUpperCase() + traitName.slice(1))} - Level ${score}❓</h4>
                      <p class="muted-text"><em>Trait definition not found.</em></p>
                    </div>`;
                 return; // Skip the rest of the loop for this trait
             }

            const descText = traitObj.desc?.[score] || "No description for this level.";
            const flair = this.getFlairForScore(score);
            const displayName = traitName.charAt(0).toUpperCase() + traitName.slice(1);

            html += `
            <div class="trait-detail-item">
              <h4>${this.escapeHTML(displayName)} - Level ${score} ${this.getEmojiForScore(score)}</h4>
              <p><strong>Your Vibe:</strong> ${this.escapeHTML(descText)}</p>
              <p class="muted-text"><em>${flair}</em></p> {/* Flair text assumed safe */}
            </div>`;
        });
    } else {
         html += `<p class="muted-text">No specific trait scores recorded for this profile.</p>`;
    }
    html += '</div>'; // Close grid


    // --- Reflections ---
    html += `<h3>📝 Reflections & Journal</h3>`;
    html += `<p>Use this space to jot down thoughts, experiences, or progress related to this profile.</p>`;
    const reflectionText = person.reflections?.text || '';
    html += `<textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="How are things progressing? What have you learned?">${this.escapeHTML(reflectionText)}</textarea>`;
    html += `<button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save Reflections 💭</button>`;


    this.elements.modalBody.innerHTML = html;
    this.openModal(this.elements.modal);
  }

  saveReflections(personId) {
        const person = this.people.find(p => p.id === personId);
        // Get textarea within the currently open modal body
        const reflectionTextEl = this.elements.modalBody?.querySelector('#reflections-text');

        if (!person || !reflectionTextEl) {
            alert("Error saving reflections. Could not find person or text area.");
            console.error("Save Reflections Error: Missing person or textarea element.", { personId, personExists: !!person, textareaExists: !!reflectionTextEl });
            return;
        }

        const reflectionText = reflectionTextEl.value;

        // Initialize reflections object if it doesn't exist
        if (!person.reflections) {
            person.reflections = {};
        }
        person.reflections.text = reflectionText;
        person.reflections.lastUpdated = Date.now();

        this.saveToLocalStorage(); // Save the updated people array
        console.log(`Reflections saved for ${person.name} (ID: ${personId})`);

        // Provide visual feedback
        const saveBtn = this.elements.modalBody.querySelector('#save-reflections-btn');
         if(saveBtn) {
            saveBtn.textContent = 'Reflections Saved ✓';
            saveBtn.disabled = true; // Briefly disable to prevent double-clicks
            setTimeout(() => {
                saveBtn.textContent = 'Save Reflections 💭';
                saveBtn.disabled = false;
            }, 2000);
         } else {
              alert("Reflections saved! ✨"); // Fallback alert
         }
    }

  // --- Helper Functions ---

 // Inside the TrackerApp class in app.js

getIntroForStyle(styleName) {
    // Normalize name for consistent lookup
    const key = styleName?.toLowerCase().replace(/\(.*?\)/g, '').replace(/ \/ /g, '/').trim() || '';
    const intros = {
      // Submissive Intros
      "submissive": "Welcome, lovely Submissive! Ready to explore the beauty of yielding? ✨",
      "brat": "Hehe, ready to stir up some delightful trouble, Brat? 😉 Let the games begin!",
      "slave": "Step into the sanctuary of devotion, noble Slave. Surrender awaits. 🙏",
      "switch": "Master of moods! Ready to dance between dynamics, versatile Switch? ↔️",
      "pet": "Time for head pats and happy wags, adorable Pet! Let your loyalty shine! 💖",
      "little": "Welcome to the land of crayons and cuddles, sweet Little! Playtime! 🧸",
      "puppy": "Woof woof! Ready for zoomies and eager learning, playful Puppy? 🦴",
      "kitten": "Curious Kitten, ready to pounce and purr? The world is your yarn ball! 🧶",
      "princess": "Your Highness! Ready to be adored and perhaps a *little* demanding, Princess? 👑",
      "rope bunny": "Ready to be tied up in knots of fun, lovely Rope Bunny? Let's get tangled! 🎀",
      "masochist": "Welcome, sensation seeker! Ready to explore the beautiful edge, Masochist? 🔥",
      "prey": "The chase is on, little Prey! Ready for the thrill of pursuit and capture? 🦊",
      "toy": "Wind up and get ready to play, delightful Toy! Time to shine and be adored! 🎁",
      "doll": "Poised and perfect Doll, ready to be admired and arranged? Strike a pose! 💖",
      "bunny": "Soft steps and gentle heart, sweet Bunny! Ready for quiet affection? 🐇",
      "servant": "Dedicated Servant, ready to bring order and fulfill needs with grace? At your service! 🧹",
      "playmate": "Game on, enthusiastic Playmate! Ready for fun, laughter, and adventure? 🎉",
      "babygirl": "Sweet and sassy Babygirl, ready to charm and be cherished? Flutter those lashes! 😉",
      "captive": "Oh no, caught again, daring Captive? Ready for the dramatic escape... or surrender? ⛓️",
      "thrall": "Deep focus, open mind, devoted Thrall. Ready to connect on a different plane? 🌀",
      "puppet": "Whose strings are pulled today, perfect Puppet? Ready to dance to their tune? 🎭",
      "maid": "Impeccable Maid, ready to bring sparkle and order with dutiful grace? Precision! ✨",
      "painslut": "Eager and ready, devoted Painslut? Time to test those limits and revel in sensation! 🔥",
      "bottom": "Open heart, yielding power, beautiful Bottom. Ready to receive and connect deeply? 💖",

      // Dominant Intros
      "dominant": "Step into your power, noble Dominant! Ready to lead and inspire? 🔥",
      "assertive": "Clear voice, strong boundaries, confident Assertive! Ready to communicate your truth? 💪",
      "nurturer": "Warm heart, steady hand, caring Nurturer! Ready to support and uplift? 🌸",
      "strict": "Order and structure, firm Strict! Ready to guide with clear rules and expectations? ⚖️",
      "master": "Commanding presence, high standards, revered Master! Ready to shape your domain? 🏰",
      "mistress": "Elegant authority, captivating grace, adored Mistress! Ready to rule your world? 👑",
      "daddy": "Protective arms, guiding voice, loving Daddy! Ready to provide safety and warmth? 🧸",
      "mommy": "Nurturing embrace, gentle rules, caring Mommy! Ready to kiss it better? 💖",
      "owner": "Claiming your prize, devoted Owner! Ready to train, cherish, and possess? 🐾",
      "rigger": "Artist with rope, skilled Rigger! Ready to bind beauty and test limits? 🎨",
      "sadist": "Conductor of sensation, curious Sadist! Ready to explore the edges of pleasure and pain? 🔥",
      "hunter": "Primal instincts, thrilling chase, focused Hunter! Ready for the pursuit? 🐺",
      "trainer": "Patient teacher, skilled Trainer! Ready to cultivate potential and achieve goals? 🏆",
      "puppeteer": "Pulling the strings, clever Puppeteer! Ready to direct the perfect performance? 🎭",
      "protector": "Steadfast shield, watchful Protector! Ready to defend and ensure safety? 🛡️",
      "disciplinarian": "Fair judgment, firm hand, focused Disciplinarian! Ready to maintain order? 👨‍⚖️",
      "caretaker": "Attentive eye, healing touch, devoted Caretaker! Ready to ensure total well-being? ❤️‍🩹",
      "sir": "Dignified command, respected Sir! Ready to lead with formal grace? 🎩",
      "goddess": "Radiant power, adored Goddess! Ready to inspire worship and command devotion? ✨",
      "commander": "Strategic mind, decisive voice, effective Commander! Ready to lead the charge? 🎖️"
    };
    return intros[key] || "Explore your unique and wonderful expression!"; // Fallback
}

// ... rest of app.js remains the same ...
    // Normalize key for lookup
    const normalizedKey = styleName?.toLowerCase().replace(/ \/ /g, '/').replace(/\(.*\)/g, '').trim() || '';
    return intros[normalizedKey] || "Explore your unique expression!";
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
    // Handles null, undefined, numbers, etc., converts others to string first
    str = String(str ?? ''); // Convert null/undefined to empty string, others to string
    const element = document.createElement('div');
    element.textContent = str;
    return element.innerHTML; // Use browser's mechanism for robust escaping
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        this.elements.themeToggle.setAttribute('title', `Switch to ${currentTheme} mode`);
    }
    // Save theme preference
    try {
       localStorage.setItem('kinkCompassTheme', newTheme);
    } catch (error) {
        console.warn("Could not save theme preference to localStorage:", error);
    }
    console.log(`Theme switched to ${newTheme}`);
  }

  applySavedTheme() {
     let savedTheme = 'light';
     try {
        // Check if localStorage is available and accessible
         if (typeof localStorage !== 'undefined') {
             savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
         }
     } catch (error) {
         console.warn("Could not read theme preference from localStorage:", error);
     }
      document.body.setAttribute('data-theme', savedTheme);
      if (this.elements.themeToggle) {
          this.elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
          this.elements.themeToggle.setAttribute('title', `Switch to ${savedTheme === 'dark' ? 'light' : 'dark'} mode`);
      }
      console.log(`Applied saved theme: ${savedTheme}`);
  }

  openModal(modalElement) {
      if (modalElement) {
          modalElement.style.display = 'flex';
          // Focus first focusable element in modal for accessibility
          // Include common interactive elements
          const focusable = modalElement.querySelector(
              'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
               // Delay focus slightly to ensure modal is fully visible and ready
              requestAnimationFrame(() => {
                 focusable.focus();
              });
          }
          console.log(`Opened modal: #${modalElement.id}`);
      } else {
          console.error("Attempted to open a non-existent modal element.");
      }
  }

  closeModal(modalElement) {
       if (modalElement) {
          modalElement.style.display = 'none';
           // Optional: Return focus to the element that opened the modal
           // This requires storing the previously focused element, adding complexity.
           console.log(`Closed modal: #${modalElement.id}`);
       }
  }

} // End of TrackerApp class

// --- Initialization ---
// This runs after the HTML is parsed because the script tag is type="module" and at the end of <body>.
try {
    console.log("Initializing TrackerApp...");
    window.kinkCompassApp = new TrackerApp(); // Assign to window for potential debugging access
    console.log("TrackerApp Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during TrackerApp initialization:", error);
    // Display a user-friendly error message ON the page
    document.body.innerHTML = `<div style="padding: 2em; margin: 2em; border: 2px solid red; background: #fff0f0; color: #333;">
        <h1 style="color: red;">Oops! Something went wrong.</h1>
        <p>KinkCompass could not start correctly due to an unexpected error.</p>
        <p>Please check the browser's console (Press F12, then click 'Console') for specific error details.</p>
        <p>You might need to refresh the page or ensure your browser supports modern JavaScript.</p>
        <p><i>Error: ${error.message}</i></p>
    </div>`;
}

// --- END OF FILE app.js ---
