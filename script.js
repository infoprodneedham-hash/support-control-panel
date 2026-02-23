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
// 2. DYNAMIC FORM INJECTION (RESUME & REMINDERS)
// =========================================
function setupDynamicButtons() {
    const btnAcc = document.getElementById('btnAddAcc');
    if (btnAcc) btnAcc.addEventListener('click', () => {
        const c = document.getElementById('acc-inputs');
        if (c.querySelectorAll('.acc-in').length < 7) c.insertAdjacentHTML('beforeend', `<input type="text" class="acc-in" placeholder="e.g. NDIS Worker Screening Check" oninput="updatePreview()">`);
        else alert("Maximum of 7 accreditations allowed.");
    });

    const btnQual = document.getElementById('btnAddQual');
    if (btnQual) btnQual.addEventListener('click', () => {
        const c = document.getElementById('qual-inputs');
        if (c.querySelectorAll('.qual-in').length < 3) c.insertAdjacentHTML('beforeend', `<input type="text" class="qual-in" placeholder="New Qualification" oninput="updatePreview()">`);
        else alert("Maximum of 3 qualifications allowed.");
    });

    const btnExp = document.getElementById('btnAddExp');
    if (btnExp) btnExp.addEventListener('click', () => {
        const c = document.getElementById('exp-inputs');
        if (c.querySelectorAll('.exp-entry').length < 5) c.insertAdjacentHTML('beforeend', `<div class="exp-entry"><input type="text" class="exp-dates" placeholder="Dates" oninput="updatePreview()"><input type="text" class="exp-employer" placeholder="Employer Name" oninput="updatePreview()"><textarea class="exp-desc" placeholder="Responsibilities..." oninput="updatePreview()"></textarea></div>`);
        else alert("Maximum of 5 experience entries allowed.");
    });

    const btnReminder = document.getElementById('btnAddReminder');
    if (btnReminder) btnReminder.addEventListener('click', () => {
        document.getElementById('reminders-container').insertAdjacentHTML('beforeend', `<div class="reminder-card card"><div class="reminder-inputs"><div class="input-group"><label>Accreditation Name</label><input type="text" class="rem-name" placeholder="e.g. NDIS Screening" oninput="calculateExpiry(this)"></div><div class="input-group"><label>Date Obtained</label><input type="date" class="rem-date" onchange="calculateExpiry(this)"></div><div class="input-group"><label>Valid For</label><select class="rem-validity" onchange="calculateExpiry(this)"><option value="12">1 Year</option><option value="36" selected>3 Years</option><option value="60">5 Years</option></select></div></div><div class="reminder-status"><span class="status-badge pending">Awaiting Date...</span></div></div>`);
        saveReminders();
    });
}

// =========================================
// 3. RESUME PREVIEW & PDF
// =========================================
function updatePreview() {
    if (!document.getElementById('outName')) return; 

    document.getElementById('outName').innerText = (document.getElementById('inName').value || "Your Name").toUpperCase();
    document.getElementById('outEmail').innerText = document.getElementById('inEmail').value || "email@example.com";
    document.getElementById('outPhone').innerText = document.getElementById('inPhone').value || "0400 000 000";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Professional summary details will appear here...";

    const accList = document.getElementById('outAccreds'); accList.innerHTML = "";
    document.querySelectorAll('.acc-in').forEach(i => { if (i.value.trim()) accList.appendChild(Object.assign(document.createElement('li'), {textContent: i.value})); });

    const qualList = document.getElementById('outQuals'); qualList.innerHTML = "";
    document.querySelectorAll('.qual-in').forEach(i => { if (i.value.trim()) qualList.appendChild(Object.assign(document.createElement('li'), {textContent: i.value})); });

    const expOutput = document.getElementById('outExp'); expOutput.innerHTML = "";
    document.querySelectorAll('.exp-entry').forEach(block => {
        const dates = block.querySelector('.exp-dates').value, employer = block.querySelector('.exp-employer').value, desc = block.querySelector('.exp-desc').value;
        if (dates || employer || desc) {
            const item = document.createElement('div');
            item.className = "res-exp-item";
            item.innerHTML = `<div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom: 5px;"><span style="color: var(--text-main);">${employer || 'Employer'}</span><span style="color: var(--text-muted); font-size: 0.9rem;">${dates || 'Dates'}</span></div><p style="margin:0; font-size: 0.95rem;">${desc || ''}</p>`;
            expOutput.appendChild(item);
        }
    });
}

function downloadPDF() {
    const element = document.getElementById('resume-content');
    if (!element) return;
    const originalTransform = element.style.transform;
    element.style.transform = "scale(1)";
    
    html2pdf().set({ margin: 0, filename: 'Support_Worker_Resume.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(element).save().then(() => {
        element.style.transform = originalTransform;
    });
}

// =========================================
// 4. COMPLIANCE TRACKER & REMINDERS
// =========================================
function calculateExpiry(element) {
    const card = element.closest('.reminder-card');
    const dateInput = card.querySelector('.rem-date').value;
    const validityMonths = parseInt(card.querySelector('.rem-validity').value);
    const statusContainer = card.querySelector('.reminder-status');
    saveReminders();
    if (!dateInput) return;

    const expiryDate = new Date(new Date(dateInput).setMonth(new Date(dateInput).getMonth() + validityMonths));
    const today = new Date();
    let monthsDiff = (expiryDate.getFullYear() - today.getFullYear()) * 12 + (expiryDate.getMonth() - today.getMonth());

    if (monthsDiff < 0) statusContainer.innerHTML = `<span class="status-badge expired">⚠️ Expired ${Math.abs(monthsDiff)} months ago</span>`;
    else if (monthsDiff <= 3) statusContainer.innerHTML = `<span class="status-badge warning">⏳ Expiring Soon (${monthsDiff} months left)</span>`;
    else statusContainer.innerHTML = `<span class="status-badge good">✅ Valid (${monthsDiff} months left)</span>`;
}

function saveReminders() {
    const container = document.getElementById('reminders-container');
    if (!container) return;
    const data = Array.from(container.querySelectorAll('.reminder-card')).map(card => ({
        name: card.querySelector('.rem-name').value, date: card.querySelector('.rem-date').value, validity: card.querySelector('.rem-validity').value
    }));
    localStorage.setItem('supportHubReminders', JSON.stringify(data));
}

function loadReminders() {
    const container = document.getElementById('reminders-container');
    if (!container || !localStorage.getItem('supportHubReminders')) return;
    container.innerHTML = '';
    JSON.parse(localStorage.getItem('supportHubReminders')).forEach(data => {
        container.insertAdjacentHTML('beforeend', `<div class="reminder-card card"><div class="reminder-inputs"><div class="input-group"><label>Accreditation Name</label><input type="text" class="rem-name" value="${data.name || ''}" oninput="calculateExpiry(this)"></div><div class="input-group"><label>Date Obtained</label><input type="date" class="rem-date" value="${data.date || ''}" onchange="calculateExpiry(this)"></div><div class="input-group"><label>Valid For</label><select class="rem-validity" onchange="calculateExpiry(this)"><option value="12" ${data.validity === '12' ? 'selected' : ''}>1 Year</option><option value="36" ${data.validity === '36' ? 'selected' : ''}>3 Years</option><option value="60" ${data.validity === '60' ? 'selected' : ''}>5 Years</option></select></div></div><div class="reminder-status"><span class="status-badge pending">Awaiting Date...</span></div></div>`);
    });
    document.querySelectorAll('.rem-date').forEach(d => { if (d.value) calculateExpiry(d); });
}

// =========================================
// 5. SHIFT BOOKINGS MANAGER
// =========================================
let shifts = JSON.parse(localStorage.getItem('supportHubShifts')) || [];

function setupShiftManager() {
    const form = document.getElementById('form-add-shift');
    if (!form) return;
    renderShifts();
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const start = document.getElementById('shift-start').value, end = document.getElementById('shift-end').value;
        const startTime = new Date(`1970-01-01T${start}Z`);
        let endTime = new Date(`1970-01-01T${end}Z`);
        if(endTime < startTime) endTime.setDate(endTime.getDate() + 1); 

        shifts.push({
            id: Date.now(), client: document.getElementById('shift-client').value, date: document.getElementById('shift-date').value,
            start: start, end: end, hours: ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2),
            code: document.getElementById('shift-code').value || '-', notes: document.getElementById('shift-notes').value || '-'
        });
        shifts.sort((a, b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem('supportHubShifts', JSON.stringify(shifts));
        renderShifts();
        form.reset();
    });
}

function renderShifts() {
    const tbody = document.getElementById('shift-list-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (shifts.length === 0) return tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #636e72;">No shifts logged yet.</td></tr>`;
    
    shifts.forEach(shift => {
        const dateStr = new Date(shift.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
        tbody.insertAdjacentHTML('beforeend', `<tr><td style="font-weight: bold; color: var(--accent);">${dateStr}</td><td>${shift.client}</td><td>${shift.start} - ${shift.end}</td><td><strong>${shift.hours} hrs</strong></td><td><span style="background:#eee; padding:3px 6px; border-radius:4px; font-size:0.85rem;">${shift.code}</span></td><td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${shift.notes}">${shift.notes}</td><td><button onclick="deleteShift(${shift.id})" class="delete-btn">Delete</button></td></tr>`);
    });
}

function deleteShift(id) {
    if(confirm("Are you sure you want to delete this shift?")) {
        shifts = shifts.filter(s => s.id !== id);
        localStorage.setItem('supportHubShifts', JSON.stringify(shifts));
        renderShifts();
    }
}

// =========================================
// 6. CONTACT DEVELOPER FORM
// =========================================
function setupContactForm() {
    const form = document.getElementById('form-contact');
    const successBanner = document.getElementById('contact-success');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page refresh
        
        // Hide form, show success banner
        form.style.display = 'none';
        successBanner.style.display = 'block';

        // Optional: Reset form in the background
        form.reset();
    });
}

// =========================================
// 7. INITIALIZATION
// =========================================
window.onload = () => {
    highlightActivePage();
    setupDynamicButtons(); 
    
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) setTheme(savedTheme);
    
    // Page Triggers
    updatePreview();       // Resume
    loadReminders();       // Reminders
    setupShiftManager();   // Bookings
    setupContactForm();    // Contact Form
};
