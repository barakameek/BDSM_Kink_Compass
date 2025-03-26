// --- START OF FILE app.js ---

import { bdsmData } from './data.js';
import { getStyleBreakdown as getSubBreakdown } from './paraphrasing_sub.js';
import { getStyleBreakdown as getDomBreakdown } from './paraphrasing_dom.js';

class TrackerApp {
  constructor() {
    // ... (Keep the entire constructor as it was) ...
    this.people = JSON.parse(localStorage.getItem('kinkProfiles')) || [];
    this.previewPerson = null;
    this.currentEditId = null;
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
    // Add console log to verify constructor runs
    console.log("TrackerApp Constructor: Finding elements complete. Adding listeners...");
    this.addEventListeners();
    console.log("TrackerApp Constructor: Listeners added. Performing initial render...");
    this.renderStyles(this.elements.role.value);
    this.renderTraits(this.elements.role.value, '');
    this.renderList();
    this.updateLivePreview(); // Initial preview update
    console.log("TrackerApp Constructor: Initial render complete.");
  }

  addEventListeners() {
    // ... (Keep the entire addEventListeners method as it was) ...

    // Add console logs inside a few listeners to test
    this.elements.role.addEventListener('change', () => {
        console.log("Role changed!"); // Test log
        const role = this.elements.role.value;
        this.renderStyles(role);
        this.elements.style.value = ''; // Reset style dropdown
        this.renderTraits(role, ''); // Render only core traits initially
        this.updateLivePreview();
    });

     this.elements.save.addEventListener('click', () => {
        console.log("Save button clicked!"); // Test log
        this.savePerson();
     });

     // ... (Keep all other listeners) ...
     this.elements.clearForm.addEventListener('click', () => this.resetForm(true));
     this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
     this.elements.peopleList.addEventListener('click', (e) => { /* ... */ });
     this.elements.modalClose.addEventListener('click', () => this.closeModal(this.elements.modal));
     this.elements.resourcesBtn.addEventListener('click', () => this.openModal(this.elements.resourcesModal));
     this.elements.resourcesClose.addEventListener('click', () => this.closeModal(this.elements.resourcesModal));
     window.addEventListener('click', (e) => { /* ... */ });
     this.elements.traitsContainer.addEventListener('input', (e) => { /* ... */ });
     this.elements.modalBody.addEventListener('click', (e) => { /* ... */ });
     this.elements.name.addEventListener('input', () => this.updateLivePreview());
     this.elements.goals.addEventListener('input', () => this.updateLivePreview());

  }

  // --- Rendering Functions ---
  // ... (Keep renderStyles, renderTraits, createTraitHTML, updateTraitDescription, renderList, createPersonListItemHTML as they were) ...
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

    // Clearer logic for rendering
    let traitsToRender = [];
    if (styleName) {
        // If a style is selected, render its specific traits AND the core traits
        traitsToRender = [...coreTraits, ...styleTraits];
         // De-duplicate if a style trait accidentally has the same name as a core trait
         const uniqueNames = new Set();
         traitsToRender = traitsToRender.filter(trait => {
             if (uniqueNames.has(trait.name)) return false;
             uniqueNames.add(trait.name);
             return true;
         });
    } else {
        // If no style is selected, render only core traits
        traitsToRender = [...coreTraits];
    }


    if (traitsToRender.length === 0) {
         this.elements.traitsContainer.innerHTML = `<p class="muted-text">No traits defined for this selection yet.</p>`;
    } else {
        traitsToRender.forEach(trait => {
            this.elements.traitsContainer.innerHTML += this.createTraitHTML(trait);
        });
         // Initial description update for all sliders *after* they are added to DOM
        this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
            this.updateTraitDescription(slider);
        });
    }

     // Add message if style selected but has no specific traits
     if (styleName && styleTraits.length === 0 && coreTraits.length > 0) {
        const messageP = document.createElement('p');
        messageP.className = 'muted-text';
        messageP.textContent = `No style-specific traits for ${styleName}; showing core traits only.`;
        this.elements.traitsContainer.prepend(messageP); // Add message at the top
    } else if (!styleName && coreTraits.length === 0) {
         // Message if no style selected AND no core traits (unlikely but possible)
          this.elements.traitsContainer.innerHTML = `<p class="muted-text">Select a style to see traits.</p>`;
    }

  }

  createTraitHTML(trait) {
    const displayName = trait.name.charAt(0).toUpperCase() + trait.name.slice(1);
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

      // Find trait data - prioritize style-specific, fallback to core
      let traitData = null;
       if (styleName) {
          const styleObj = bdsmData[role]?.styles.find(s => s.name === styleName);
          traitData = styleObj?.traits.find(t => t.name === traitName);
      }
      if (!traitData) {
           traitData = bdsmData[role]?.coreTraits.find(t => t.name === traitName);
      }


      if (valueSpan) valueSpan.textContent = value; // Update numeric value display

      if (descDiv && traitData && traitData.desc && traitData.desc[value]) {
          descDiv.textContent = traitData.desc[value];
      } else if (descDiv) {
          // Clear description or show default if data missing
          descDiv.textContent = traitData ? 'Description for this level unavailable.' : 'Trait definition unavailable.';
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
            <strong class="person-name">${this.escapeHTML(person.name)}</strong>
            <span class="person-details muted-text">(${roleDisplay} - ${styleDisplay})</span>
          </span>
          <span class="person-actions">
            <button class="edit-btn small-btn" aria-label="Edit ${this.escapeHTML(person.name)}">✏️ Edit</button>
            <button class="delete-btn small-btn" aria-label="Delete ${this.escapeHTML(person.name)}">🗑️ Delete</button>
          </span>
        </li>
      `;
   }


  // --- Data Handling Functions ---
  // ... (Keep savePerson, editPerson, deletePerson, resetForm, saveToLocalStorage as they were) ...
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
        // Check if traits *should* be present but aren't rendered
        const expectedTraits = [
            ...(bdsmData[role]?.coreTraits || []),
            ...(bdsmData[role]?.styles.find(s => s.name === styleName)?.traits || [])
        ];
        if (sliders.length === 0 && expectedTraits.length > 0) {
            console.error("Save Error: Sliders not found in DOM, but expected traits exist.", {role, styleName, expectedTraits});
            alert("Error: Traits not loaded correctly. Cannot save. Please refresh or select style again.");
            return;
        }


        const traits = {};
        sliders.forEach(slider => {
        traits[slider.getAttribute('data-trait')] = slider.value;
        });

        // Ensure core traits that might *not* be displayed (e.g. if only style traits shown) are still saved with a default or current value if available
         bdsmData[role]?.coreTraits.forEach(coreTrait => {
            if (!traits.hasOwnProperty(coreTrait.name)) {
                 // If editing, try to get value from original person data if available
                 const originalPerson = this.currentEditId ? this.people.find(p => p.id === this.currentEditId) : null;
                 traits[coreTrait.name] = originalPerson?.traits?.[coreTrait.name] || '3'; // Default to 3 if not editing or not found
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
        } else {
            // Should not happen if UI is correct, but handle defensively
            console.error("Error updating person: ID not found", this.currentEditId);
             this.people.push(personData); // Add as new if update failed? Or show error?
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
        if (!person) {
            console.error("Edit Error: Person not found with ID", personId);
            return;
        }

        console.log("Editing person:", person); // Log data being loaded

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

        // Set slider values *after* traits are rendered in the DOM
        // Use requestAnimationFrame or setTimeout to ensure DOM update cycle completes
        requestAnimationFrame(() => {
            console.log("Setting slider values for:", person.traits);
            Object.entries(person.traits).forEach(([traitName, value]) => {
                const slider = this.elements.traitsContainer.querySelector(`.trait-slider[data-trait="${traitName}"]`);
                if (slider) {
                    console.log(`Setting slider ${traitName} to ${value}`);
                    slider.value = value;
                    this.updateTraitDescription(slider); // Update description immediately
                } else {
                     console.warn(`Slider not found for trait: ${traitName}`);
                }
            });
             this.updateLivePreview(); // Update preview after all fields are set
             this.elements.save.textContent = 'Update Sparkle! ✨'; // Change button text
             // Scroll form into view smoothly
             this.elements.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             // Focus the name field for immediate editing
             this.elements.name.focus();
        });
  }

   deletePerson(personId) {
      const person = this.people.find(p => p.id === personId);
      if (!person) return;

      // Use name in confirmation for clarity
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
    // Optionally focus the name field
    this.elements.name.focus();
  }

   saveToLocalStorage() {
        try {
            localStorage.setItem('kinkProfiles', JSON.stringify(this.people));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            // Handle potential storage errors (e.g., quota exceeded)
            alert("Could not save profiles to local storage. Storage might be full or disabled.");
        }
   }


  // --- Live Preview ---
  // ... (Keep updateLivePreview as it was) ...
   updateLivePreview() {
        const name = this.elements.name.value.trim() || "Unnamed";
        const role = this.elements.role.value;
        const style = this.elements.style.value;
        const goals = this.elements.goals.value.trim();

        // Get current trait values from sliders
        const traits = {};
        this.elements.traitsContainer.querySelectorAll('.trait-slider').forEach(slider => {
        traits[slider.getAttribute('data-trait')] = slider.value;
        });


        // Construct preview data directly from form state
        const previewData = { name, role, style, traits, goals };

        // Generate HTML based on previewData
        let html = '';
        if (!style) {
            html = `<p class="muted-text">Pick a style to see your kinky magic unfold! 🌈</p>`;
        } else {
            const getBreakdown = role === 'submissive' ? getSubBreakdown : getDomBreakdown;
             // Ensure breakdown function handles potentially missing traits gracefully
            const breakdown = getBreakdown(previewData.style, traits);

            html = `<h3 class="preview-title">🎀 ${this.escapeHTML(name)}’s Live Vibe 🎀</h3>`;
            html += `<p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>`;
            html += `<p><strong>Style:</strong> ${previewData.style || "N/A"}</p>`;
            if (goals) {
                html += `<p><strong>Goals:</strong> ${this.escapeHTML(goals)}</p>`;
            }
            html += `<div class="style-breakdown preview-breakdown">`;
            if (breakdown.strengths) {
                // Use innerHTML for breakdown text which might contain <strong> etc.
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
  // ... (Keep showPersonDetails, saveReflections as they were) ...
   showPersonDetails(personId) {
        const person = this.people.find(p => p.id === personId);
        if (!person) return;

        const getBreakdown = person.role === 'submissive' ? getSubBreakdown : getDomBreakdown;
        // Ensure traits are passed correctly, handle missing traits if necessary
        const breakdown = getBreakdown(person.style, person.traits || {});

        // --- Header & Intro ---
        let html = `<h2 class="modal-title" id="detail-modal-title">🎉 ${this.escapeHTML(person.name)}’s Kinky Kingdom 🎉</h2>`; // Add id for aria-labelledby
        html += `<p class="modal-subtitle">${person.role.charAt(0).toUpperCase() + person.role.slice(1)} - ${person.style}</p>`;

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
            html += `<div class="strengths"><h4>✨ Your Powers</h4><div>${breakdown.strengths}</div></div>`; // Use div + innerHTML
        }
        if (breakdown.improvements) {
            html += `<div class="improvements"><h4>🌟 Your Next Quest</h4><div>${breakdown.improvements}</div></div>`; // Use div + innerHTML
        }
        html += `</div>`;

        // --- Trait Details ---
        html += `<h3>🎨 Your Trait Tales</h3>`;
        const allTraitsData = [
            ...(bdsmData[person.role]?.coreTraits || []),
            ...(bdsmData[person.role]?.styles.find(s => s.name === person.style)?.traits || [])
        ];
        // Ensure uniqueness in case of overlap
        const uniqueTraitData = Array.from(new Map(allTraitsData.map(t => [t.name, t])).values());


        html += '<div class="trait-details-grid">'; // Use grid for better layout
        if (Object.keys(person.traits || {}).length > 0) {
             for (const [traitName, score] of Object.entries(person.traits)) {
                const traitObj = uniqueTraitData.find(t => t.name === traitName);
                if (!traitObj) {
                     console.warn(`Definition not found for saved trait: ${traitName}`);
                     continue; // Skip if trait definition not found
                 }


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
        } else {
             html += `<p class="muted-text">No trait scores recorded for this profile.</p>`;
        }

        html += '</div>'; // Close grid


        // --- Reflections ---
        html += `<h3>📝 Reflections & Journal</h3>`;
        html += `<p>Use this space to jot down thoughts, experiences, or progress related to this profile.</p>`;
        // Load existing reflection text if available
        const reflectionText = person.reflections?.text || '';
        html += `<textarea id="reflections-text" class="reflections-textarea" data-person-id="${person.id}" rows="6" placeholder="How are things progressing? What have you learned?">${this.escapeHTML(reflectionText)}</textarea>`;
        html += `<button id="save-reflections-btn" class="save-btn" data-person-id="${person.id}">Save Reflections 💭</button>`;


        this.elements.modalBody.innerHTML = html;
        this.openModal(this.elements.modal);
  }

   saveReflections(personId) {
        const person = this.people.find(p => p.id === personId);
        // Get textarea within the currently open modal body
        const reflectionTextEl = this.elements.modalBody.querySelector('#reflections-text');
        const reflectionText = reflectionTextEl?.value;

        if (!person || reflectionText === undefined) {
            alert("Error saving reflections. Could not find person or text area.");
            return;
        }

        if (!person.reflections) {
            person.reflections = {};
        }
        person.reflections.text = reflectionText;
        person.reflections.lastUpdated = Date.now();

        this.saveToLocalStorage();
        alert("Reflections saved! ✨");
        // Optional: Indicate save success visually without closing modal
        const saveBtn = this.elements.modalBody.querySelector('#save-reflections-btn');
         if(saveBtn) {
            saveBtn.textContent = 'Reflections Saved ✓';
            setTimeout(() => { saveBtn.textContent = 'Save Reflections 💭'; }, 2000);
         }
    }

  // --- Helper Functions ---
  // ... (Keep getIntroForStyle, getFlairForScore, getEmojiForScore, escapeHTML, toggleTheme, openModal, closeModal as they were) ...
   getIntroForStyle(styleName) {
        // Simple map for intros - expand as needed
        const intros = {
          "submissive": "Welcome to the path of delightful deference!",
          "brat": "Ready to stir up some playful trouble? Let the games begin!",
          "slave": "Embrace the beauty of deep devotion and surrender.",
          "pet": "Time for head pats and happy wags! Explore your affectionate side.",
          "little": "Enter a world of innocence, play, and caring guidance.",
          "masochist": "Explore the fascinating edge where sensation meets release.",
          "dominant": "Step into your power and guide the dynamic with confidence.",
          "master / mistress": "Command respect and cultivate excellence with clear authority.",
          "sadist": "Delve into the art of sensation and the psychology of reaction.",
          "caregiver / daddy / mommy": "Rule with a nurturing heart, providing structure and warmth.",
          "primal (hunter / beast)": "Unleash your instincts and dominate with raw power."
          // Add more...
        };
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
        if (typeof str !== 'string') return str === null || str === undefined ? '' : str; // Return non-strings safely
        const element = document.createElement('div');
        element.textContent = str;
        return element.innerHTML;
        /* // Manual replacement - less robust for complex cases but avoids DOM creation
        return str.replace(/[&<>"']/g, function(match) {
            const escape = { '&': '&', '<': '<', '>': '>', '"': '"', "'": ''' };
            return escape[match];
        }); */
    }


   toggleTheme() {
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      this.elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙'; // Update icon
      // Optional: Save theme preference to localStorage
      try {
         localStorage.setItem('kinkCompassTheme', newTheme);
      } catch (error) {
          console.warn("Could not save theme preference to localStorage:", error);
      }
  }

  // Apply saved theme on load (call this at the end of the constructor)
  applySavedTheme() {
     let savedTheme = 'light';
     try {
        savedTheme = localStorage.getItem('kinkCompassTheme') || 'light';
     } catch (error) {
         console.warn("Could not read theme preference from localStorage:", error);
     }
      document.body.setAttribute('data-theme', savedTheme);
      this.elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

   openModal(modalElement) {
      if (modalElement) {
          modalElement.style.display = 'flex';
          // Focus first focusable element in modal for accessibility
          const focusable = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable) {
              focusable.focus();
          }
      }
  }

  closeModal(modalElement) {
       if (modalElement) {
          modalElement.style.display = 'none';
           // Return focus to the element that opened the modal if possible (more advanced)
       }
  }

}

// Initialize the app - This runs after the script is parsed because it's a module at the end of body
try {
    console.log("Initializing TrackerApp...");
    new TrackerApp();
    console.log("TrackerApp Initialized Successfully.");
} catch (error) {
    console.error("Fatal error during TrackerApp initialization:", error);
    // Display a user-friendly error message on the page
    document.body.innerHTML = `<div style="padding: 2em; text-align: center; color: red;">
        <h1>Oops! Something went wrong.</h1>
        <p>KinkCompass could not start. Please check the console (F12) for errors or try refreshing the page.</p>
        <p><i>Error: ${error.message}</i></p>
    </div>`;
}
