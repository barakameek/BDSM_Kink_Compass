/* Kink Atlas - css/style.css */

/* --- VARIABLES & GLOBAL RESETS --- */
:root {
    --primary-color: #9b59b6;
    --secondary-color: #8e44ad;
    --accent-color: #e74c3c;
    --text-color: #ecf0f1;
    --bg-color: #2c3e50;
    --bg-color-light: #34495e; /* Slightly lighter than main bg */
    --bg-color-lighter: #4a627a; /* Even lighter, for cards/pills */
    --border-color: #4a627a;
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --modal-bg: rgba(0, 0, 0, 0.7);
    --success-color: #2ecc71;
    --warning-color: #f39c12;
    --danger-color: #e74c3c;

    --rating-want-to-try: #3498db; /* Blue */
    --rating-favorite: #2ecc71;   /* Green */
    --rating-like-it: #1abc9c;    /* Teal */
    --rating-curious-about: #f1c40f; /* Yellow */
    --rating-soft-limit: #e67e22;  /* Orange */
    --rating-hard-limit: #c0392b;  /* Red */
    --rating-not-for-me: #95a5a6;  /* Grey */

    --header-height: 60px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
}

#app-container {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

/* --- TYPOGRAPHY --- */
h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
    margin-bottom: 0.75em;
    line-height: 1.2;
}
h1 { font-size: 2.5em; }
h2 { font-size: 2em; }
h3 { font-size: 1.75em; }

a { color: var(--accent-color); text-decoration: none; }
a:hover { text-decoration: underline; }
p { margin-bottom: 1em; }

/* --- LAYOUT & MAIN SECTIONS --- */
#main-header {
    background-color: var(--bg-color-light);
    padding: 0 20px;
    height: var(--header-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border-color);
}
#main-header h1 { margin-bottom: 0; font-size: 1.8em; cursor: pointer;}
#main-nav button {
    background: none; border: 1px solid var(--primary-color); color: var(--primary-color);
    padding: 8px 15px; margin-left: 10px; cursor: pointer; border-radius: 4px;
    font-size: 0.9em; transition: background-color 0.3s, color 0.3s;
}
#main-nav button:hover, #main-nav button.active-nav-btn {
    background-color: var(--primary-color); color: var(--text-color);
}
#main-content { padding: 20px; flex-grow: 1; overflow-y: auto; }
#main-footer {
    background-color: var(--bg-color-light); text-align: center; padding: 15px 20px;
    font-size: 0.9em; color: #bdc3c7; border-top: 1px solid var(--border-color);
}

/* --- VIEW MANAGEMENT --- */
.view { display: none; padding: 15px; border-radius: 5px; animation: fadeIn 0.5s ease-in-out; }
.view.active-view { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* --- BUTTONS & FORMS --- */
button, .button-like-label, .back-button {
    background-color: var(--primary-color); color: var(--text-color); border: none;
    padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1em;
    transition: background-color 0.3s ease; margin-top: 10px; margin-right: 10px;
}
button:hover, .button-like-label:hover, .back-button:hover { background-color: var(--secondary-color); }
button:disabled { background-color: #7f8c8d; cursor: not-allowed; }
.button-like-label { display: inline-block; }
.back-button { margin-bottom: 15px; background-color: var(--bg-color-lighter); }


input[type="text"], input[type="email"], input[type="password"], textarea {
    width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid var(--border-color);
    background-color: var(--bg-color); color: var(--text-color); border-radius: 4px;
}
textarea { min-height: 100px; resize: vertical; }

/* --- WELCOME VIEW & DATA MANAGEMENT --- */
#welcome-view .data-management { margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color); }

/* --- KINK GALAXY VIEW (NEW LAYOUT) --- */
#kink-galaxy-visualization {
    /* This container can just be a flow container now */
    padding: 10px 0; /* Remove internal padding if categories have their own */
}

.galaxy-category {
    background-color: var(--bg-color-light); /* Slightly lighter block for category */
    padding: 20px;
    margin-bottom: 25px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.galaxy-category h3 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--secondary-color); /* Use secondary for a bit more pop */
    display: flex;
    align-items: center;
}
.galaxy-category h3 span { /* For icon if you use span for it */
    margin-right: 10px;
    font-size: 1.2em;
}


.kink-list {
    display: flex;
    flex-wrap: wrap; /* Allow kinks to wrap to the next line */
    gap: 12px; /* Spacing between kink pills */
}

.kink-star { /* "Pill" or "Tag" style for kinks */
    background-color: var(--bg-color-lighter); /* Use the lighter bg for pills */
    color: var(--text-color);
    padding: 8px 15px;
    border-radius: 20px; /* Pill shape */
    cursor: pointer;
    border: 1px solid transparent; /* Base border, can be colored by rating */
    transition: background-color 0.2s, transform 0.2s, border-color 0.2s;
    font-size: 0.95em;
    display: inline-flex; /* Allows badge to align nicely */
    align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.kink-star:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
    border-color: var(--accent-color);
    color: white;
}

.kink-star-rating-badge {
    font-size: 0.75em;
    color: white;
    padding: 3px 8px;
    border-radius: 10px;
    margin-left: 10px;
    white-space: nowrap;
    font-weight: bold;
}

/* Rating-specific styles for kink-star pills */
.rating-want-to-try { border-left: 4px solid var(--rating-want-to-try); background-color: var(--bg-color-light); }
.rating-want-to-try .kink-star-rating-badge { background-color: var(--rating-want-to-try); }

.rating-favorite { border-left: 4px solid var(--rating-favorite); background-color: var(--bg-color-light); }
.rating-favorite .kink-star-rating-badge { background-color: var(--rating-favorite); }

.rating-like-it { border-left: 4px solid var(--rating-like-it); background-color: var(--bg-color-light); }
.rating-like-it .kink-star-rating-badge { background-color: var(--rating-like-it); }

.rating-curious-about { border-left: 4px solid var(--rating-curious-about); background-color: var(--bg-color-light); }
.rating-curious-about .kink-star-rating-badge { background-color: var(--rating-curious-about); }

.rating-soft-limit { border-left: 4px solid var(--rating-soft-limit); background-color: var(--bg-color-light); }
.rating-soft-limit .kink-star-rating-badge { background-color: var(--rating-soft-limit); }

.rating-hard-limit { border-left: 4px solid var(--rating-hard-limit); background-color: var(--bg-color-light); }
.rating-hard-limit .kink-star-rating-badge { background-color: var(--rating-hard-limit); }

.rating-not-for-me { border-left: 4px solid var(--rating-not-for-me); background-color: var(--bg-color-light); }
.rating-not-for-me .kink-star-rating-badge { background-color: var(--rating-not-for-me); }


.no-kinks-in-category { font-style: italic; color: #95a5a6; padding: 10px 0; }
#kink-filters { padding: 10px; background-color: var(--bg-color-light); border-radius: 4px; margin-top: 20px;}


/* --- KINK DETAIL MODAL --- */
.modal {
    display: none; position: fixed; z-index: 1000; left: 0; top: 0;
    width: 100%; height: 100%; overflow: auto; background-color: var(--modal-bg);
    animation: fadeInModal 0.3s ease-out;
}
@keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
.modal-content {
    background-color: var(--bg-color-light); margin: 10% auto; padding: 25px;
    border: 1px solid var(--border-color); border-radius: 8px; width: 80%; max-width: 600px;
    position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    animation: slideInModal 0.3s ease-out;
}
@keyframes slideInModal { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.close-modal-btn {
    color: #aaa; float: right; font-size: 28px; font-weight: bold; line-height: 1;
}
.close-modal-btn:hover, .close-modal-btn:focus { color: var(--text-color); text-decoration: none; cursor: pointer; }
#modal-kink-name { margin-top: 0; }
#modal-kink-rating { margin: 15px 0; display: flex; flex-wrap: wrap; gap: 10px; }
#modal-kink-rating button { margin-top: 0; margin-right: 0; /* remove default button margins */}
#modal-kink-rating button.active-rating { background-color: var(--accent-color); color: white; border: 1px solid var(--accent-color); }

/* --- ACADEMY VIEW --- */
#academy-content-area { /* Styles for displaying learning modules, glossary lists */ }
.academy-index-list { list-style: none; padding-left: 0; }
.academy-index-list li a { display: block; padding: 8px 0; border-bottom: 1px dotted var(--border-color); }
.academy-index-list li a:hover { background-color: var(--bg-color-lighter); }
.academy-kink-list { padding-left: 20px; } /* Indent kink lists in category view */
#academy-content-area dl dt { font-weight: bold; color: var(--primary-color); margin-top: 0.8em; }
#academy-content-area dl dd { margin-left: 1.5em; margin-bottom: 0.5em; }


/* --- JOURNAL VIEW --- */
#journal-entries-container { margin-top: 20px; }
.journal-entry-item {
    background-color: var(--bg-color); padding: 15px; border-radius: 4px;
    margin-bottom: 15px; border-left: 4px solid var(--primary-color);
}
.journal-entry-item h5 { margin-top: 0; margin-bottom: 0.5em; color: #bdc3c7; font-size: 0.9em;}
.journal-entry-content { margin-bottom: 10px; }
.journal-prompts-container { margin-bottom: 20px; padding: 15px; background-color: var(--bg-color-light); border-radius: 5px;}
.journal-prompts-container ul { list-style: none; padding-left: 0; }
.journal-prompts-container .prompt-button {
    display: block; width: 100%; text-align: left;
    margin-bottom: 8px; background-color: var(--bg-color-lighter);
}

/* --- SETTINGS VIEW --- */
#settings-view h3 { margin-top: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; }

/* --- UTILITY CLASSES --- */
.hidden { display: none !important; }
.text-center { text-align: center; }

/* --- RESPONSIVE DESIGN --- */
@media (max-width: 768px) {
    #main-header { flex-direction: column; height: auto; padding: 15px; }
    #main-header h1 { margin-bottom: 10px; }
    #main-nav { width: 100%; display: flex; justify-content: space-around; }
    #main-nav button { margin-left: 0; flex-grow: 1; margin: 5px; }
    .modal-content { width: 90%; margin: 20% auto; }
    h1 { font-size: 2em; } h2 { font-size: 1.75em; }
}
@media (max-width: 480px) {
    body { font-size: 15px; }
    #main-content { padding: 10px; }
    button, .button-like-label, .back-button {
        padding: 10px 15px; font-size: 0.95em; width: 100%;
        margin-bottom: 10px; margin-right: 0;
    }
    #welcome-view .data-management button,
    #welcome-view .data-management .button-like-label,
    #modal-kink-rating button, /* Ensure modal rating buttons are not full width */
    .journal-prompts-container .prompt-button, /* Prompts can be full width */
    .journal-entry-item button /* Edit/delete can be smaller */
     {
        width: auto; /* Override full width for specific buttons */
        margin-right: 10px; /* Re-add right margin if needed */
    }
    .journal-entry-item button { margin-bottom: 0; }
}
