/**
 * SupportHub Global JavaScript
 */

// =========================================
// 1. THEME & NAVIGATION
// =========================================
function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('userTheme', themeName);
}

function highlightActivePage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// =========================================
// 2. DYNAMIC FORM INJECTION
// =========================================
function setupDynamicButtons() {
    // Resume: Add Accreditation
    const btnAcc = document.getElementById('btnAddAcc');
    if (btnAcc) {
        btnAcc.addEventListener('click', () => {
            const container = document.getElementById('acc-inputs');
            if (container.querySelectorAll('.acc-in').length < 7) {
                const newHTML = `<input type="text" class="acc-in" placeholder="e.g. NDIS Worker Screening Check" oninput="updatePreview()">`;
                container.insertAdjacentHTML('beforeend', newHTML);
            } else {
                alert("Maximum of 7 accreditations allowed.");
            }
        });
    }

    // Resume: Add Qualification
    const btnQual = document.getElementById('btnAddQual');
    if (btnQual) {
        btnQual.addEventListener('click', () => {
            const container = document.getElementById('qual-inputs');
            if (container.querySelectorAll('.qual-in').length < 3) {
                const newHTML = `<input type="text" class="qual-in" placeholder="New Qualification" oninput="updatePreview()">`;
                container.insertAdjacentHTML('beforeend', newHTML);
            } else {
                alert("Maximum of 3 qualifications allowed.");
            }
        });
    }

    // Resume: Add Experience
    const btnExp = document.getElementById('btnAddExp');
    if (btnExp) {
        btnExp.addEventListener('click', () => {
            const container = document.getElementById('exp-inputs');
            if (container.querySelectorAll('.exp-entry').length < 5) {
                const newHTML = `
                    <div class="exp-entry">
                        <input type="text" class="exp-dates" placeholder="Dates" oninput="updatePreview()">
                        <input type="text" class="exp-employer" placeholder="Employer Name" oninput="updatePreview()">
                        <textarea class="exp-desc" placeholder="Responsibilities..." oninput="updatePreview()"></textarea>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', newHTML);
            } else {
                alert("Maximum of 5 experience entries allowed.");
            }
        });
    }

    // Reminders: Add New Card
    const btnReminder = document.getElementById('btnAddReminder');
    if (btnReminder) {
        btnReminder.addEventListener('click', () => {
            const container = document.getElementById('reminders-container');
            const newHTML = `
                <div class="reminder-card card">
                    <div class="reminder-inputs">
                        <div class="input-group">
                            <label>Accreditation Name</label>
                            <input type="text" class="rem-name" placeholder="e.g. NDIS Screening" oninput="calculateExpiry(this)">
                        </div>
                        <div class="input-group">
                            <label>Date Obtained</label>
                            <input type="date" class="rem-date" onchange="calculateExpiry(this)">
                        </div>
                        <div class="input-group">
                            <label>Valid For</label>
                            <select class="rem-validity" onchange="calculateExpiry(this)">
                                <option value="12">1 Year</option>
                                <option value="36" selected>3 Years</option>
                                <option value="60">5 Years</option>
                            </select>
                        </div>
                    </div>
                    <div class="reminder-status">
                        <span class="status-badge pending">Awaiting Date...</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', newHTML);
            saveReminders(); // Save state when a new blank card is added
        });
    }
}

// =========================================
// 3. RESUME LIVE PREVIEW LOGIC
// =========================================
function updatePreview() {
    if (!document.getElementById('outName')) return; 

    document.getElementById('outName').innerText = (document.getElementById('inName').value || "Your Name").toUpperCase();
    document.getElementById('outEmail').innerText = document.getElementById('inEmail').value || "email@example.com";
    document.getElementById('outPhone').innerText = document.getElementById('inPhone').value || "0400 000 000";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Professional summary details will appear here...";

    const accList = document.getElementById('outAccreds');
    accList.innerHTML = "";
    document.querySelectorAll('.acc-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            accList.appendChild(li);
        }
    });

    const qualList = document.getElementById('outQuals');
    qualList.innerHTML = "";
    document.querySelectorAll('.qual-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            qualList.appendChild(li);
        }
    });

    const expOutput = document.getElementById('outExp');
    expOutput.innerHTML = "";
    document.querySelectorAll('.exp-entry').forEach(block => {
        const dates = block.querySelector('.exp-dates').value;
        const employer = block.querySelector('.exp-employer').value;
        const desc = block.querySelector('.exp-desc').value;

        if (dates || employer || desc) {
            const item = document.createElement('div');
            item.className = "res-exp-item";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom: 5px;">
                    <span style="color: var(--text-main);">${employer || 'Employer'}</span>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">${dates || 'Dates'}</span>
                </div>
                <p style="margin:0; font-size: 0.95rem;">${desc || ''}</p>
            `;
            expOutput.appendChild(item);
        }
    });
}

// =========================================
// 4. PDF GENERATOR LOGIC (RESUME)
// =========================================
function downloadPDF() {
    const element = document.getElementById('resume-content');
    if (!element) return;
    
    const originalTransform = element.style.transform;
    element.style.transform = "scale(1)"; // Reset scale for crisp PDF
    
    const opt = {
        margin:       0,
        filename:     'Support_Worker_Resume.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.transform = originalTransform; // Restore screen size
    });
}

// =========================================
// 5. COMPLIANCE TRACKER MATH & AUTO-SAVE
// =========================================
function calculateExpiry(element) {
    const card = element.closest('.reminder-card');
    const dateInput = card.querySelector('.rem-date').value;
    const validityMonths = parseInt(card.querySelector('.rem-validity').value);
    const statusContainer = card.querySelector('.reminder-status');

    // Trigger auto-save every time an input changes
    saveReminders();

    if (!dateInput) return;

    const obtainedDate = new Date(dateInput);
    const expiryDate = new Date(obtainedDate);
    expiryDate.setMonth(expiryDate.getMonth() + validityMonths);

    const today = new Date();
    
    // Calculate difference in months
    let monthsDiff = (expiryDate.getFullYear() - today.getFullYear()) * 12 + (expiryDate.getMonth() - today.getMonth());

    if (monthsDiff < 0) {
        statusContainer.innerHTML = `<span class="status-badge expired">⚠️ Expired ${Math.abs(monthsDiff)} months ago</span>`;
    } else if (monthsDiff <= 3) {
        statusContainer.innerHTML = `<span class="status-badge warning">⏳ Expiring Soon (${monthsDiff} months left)</span>`;
    } else {
        statusContainer.innerHTML = `<span class="status-badge good">✅ Valid (${monthsDiff} months left)</span>`;
    }
}

// =========================================
// 6. LOCAL STORAGE (SAVE & LOAD REMINDERS)
// =========================================
function saveReminders() {
    const container = document.getElementById('reminders-container');
    if (!container) return; // Exit if not on the reminders page

    const cards = container.querySelectorAll('.reminder-card');
    const remindersData = [];

    cards.forEach(card => {
        remindersData.push({
            name: card.querySelector('.rem-name').value,
            date: card.querySelector('.rem-date').value,
            validity: card.querySelector('.rem-validity').value
        });
    });

    localStorage.setItem('supportHubReminders', JSON.stringify(remindersData));
}

function loadReminders() {
    const container = document.getElementById('reminders-container');
    if (!container) return;

    const savedData = localStorage.getItem('supportHubReminders');
    
    if (savedData) {
        const remindersData = JSON.parse(savedData);
        container.innerHTML = ''; // Clear default hardcoded HTML

        // Rebuild cards from saved data
        remindersData.forEach(data => {
            const newHTML = `
                <div class="reminder-card card">
                    <div class="reminder-inputs">
                        <div class="input-group">
                            <label>Accreditation Name</label>
                            <input type="text" class="rem-name" placeholder="e.g. NDIS Screening" value="${data.name || ''}" oninput="calculateExpiry(this)">
                        </div>
                        <div class="input-group">
                            <label>Date Obtained</label>
                            <input type="date" class="rem-date" value="${data.date || ''}" onchange="calculateExpiry(this)">
                        </div>
                        <div class="input-group">
                            <label>Valid For</label>
                            <select class="rem-validity" onchange="calculateExpiry(this)">
                                <option value="12" ${data.validity === '12' ? 'selected' : ''}>1 Year</option>
                                <option value="36" ${data.validity === '36' ? 'selected' : ''}>3 Years</option>
                                <option value="60" ${data.validity === '60' ? 'selected' : ''}>5 Years</option>
                            </select>
                        </div>
                    </div>
                    <div class="reminder-status">
                        <span class="status-badge pending">Awaiting Date...</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', newHTML);
        });

        // Trigger math calculation on loaded cards to restore status badges
        document.querySelectorAll('.rem-date').forEach(dateInput => {
            if (dateInput.value) calculateExpiry(dateInput);
        });
    }
}

// =========================================
// 7. INITIALIZATION
// =========================================
window.onload = () => {
    highlightActivePage();
    setupDynamicButtons(); 
    
    // Load Theme
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) setTheme(savedTheme);
    
    // Page Specific Loads
    updatePreview();   // For Resume Page
    loadReminders();   // For Reminders Page
};
