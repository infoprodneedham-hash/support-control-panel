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
    // Resume: Accreditations
    const btnAcc = document.getElementById('btnAddAcc');
    if (btnAcc) {
        btnAcc.addEventListener('click', () => {
            const container = document.getElementById('acc-inputs');
            if (container.querySelectorAll('.acc-in').length < 7) {
                container.insertAdjacentHTML('beforeend', `<input type="text" class="acc-in" placeholder="e.g. NDIS Worker Screening Check" oninput="updatePreview()">`);
            } else {
                alert("Maximum of 7 accreditations allowed.");
            }
        });
    }

    // Resume: Qualifications
    const btnQual = document.getElementById('btnAddQual');
    if (btnQual) {
        btnQual.addEventListener('click', () => {
            const container = document.getElementById('qual-inputs');
            if (container.querySelectorAll('.qual-in').length < 3) {
                container.insertAdjacentHTML('beforeend', `<input type="text" class="qual-in" placeholder="New Qualification" oninput="updatePreview()">`);
            } else {
                alert("Maximum of 3 qualifications allowed.");
            }
        });
    }

    // Resume: Experience
    const btnExp = document.getElementById('btnAddExp');
    if (btnExp) {
        btnExp.addEventListener('click', () => {
            const container = document.getElementById('exp-inputs');
            if (container.querySelectorAll('.exp-entry').length < 5) {
                container.insertAdjacentHTML('beforeend', `
                    <div class="exp-entry">
                        <input type="text" class="exp-dates" placeholder="Dates" oninput="updatePreview()">
                        <input type="text" class="exp-employer" placeholder="Employer Name" oninput="updatePreview()">
                        <textarea class="exp-desc" placeholder="Responsibilities..." oninput="updatePreview()"></textarea>
                    </div>`);
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
            container.insertAdjacentHTML('beforeend', `
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
                </div>`);
            saveReminders();
        });
    }

    // Invoice: Add Item Row
    const btnInvItem = document.getElementById('btnAddInvItem');
    if (btnInvItem) {
        btnInvItem.addEventListener('click', () => {
            const container = document.getElementById('inv-items-container');
            container.insertAdjacentHTML('beforeend', `
                <div class="exp-entry inv-item-row">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" class="inv-item-date" placeholder="Date (e.g. 15/05/26)" oninput="updateInvoicePreview()">
                        <input type="text" class="inv-item-code" placeholder="NDIS Item Code" oninput="updateInvoicePreview()">
                    </div>
                    <input type="text" class="inv-item-desc" placeholder="Support Category / Description" oninput="updateInvoicePreview()" style="margin-top: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <input type="number" class="inv-item-qty" placeholder="Hours" step="0.25" oninput="updateInvoicePreview()">
                        <input type="number" class="inv-item-rate" placeholder="Rate ($)" step="0.01" oninput="updateInvoicePreview()">
                    </div>
                </div>
            `);
        });
    }
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

    const accList = document.getElementById('outAccreds');
    accList.innerHTML = "";
    document.querySelectorAll('.acc-in').forEach(i => { 
        if (i.value.trim()) accList.appendChild(Object.assign(document.createElement('li'), {textContent: i.value})); 
    });

    const qualList = document.getElementById('outQuals');
    qualList.innerHTML = "";
    document.querySelectorAll('.qual-in').forEach(i => { 
        if (i.value.trim()) qualList.appendChild(Object.assign(document.createElement('li'), {textContent: i.value})); 
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
                <p style="margin:0; font-size: 0.95rem;">${desc || ''}</p>`;
            expOutput.appendChild(item);
        }
    });
}

function downloadPDF() {
    const element = document.getElementById('resume-content');
    if (!element) return;
    
    const originalTransform = element.style.transform;
    element.style.transform = "scale(1)";
    
    const opt = {
        margin:       0,
        filename:     'Support_Worker_Resume.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.transform = originalTransform;
    });
}

// =========================================
// 4. INVOICE PREVIEW & PDF LOGIC
// =========================================
function updateInvoicePreview() {
    if (!document.getElementById('out-inv-num')) return;

    // Map basic text fields
    document.getElementById('out-inv-num').innerText = document.getElementById('inv-num').value || "INV-0000";
    
    // Format Date
    const rawDate = document.getElementById('inv-date').value;
    document.getElementById('out-inv-date').innerText = rawDate ? new Date(rawDate).toLocaleDateString('en-AU') : "DD/MM/YYYY";
    
    document.getElementById('out-inv-provider-name').innerText = document.getElementById('inv-provider-name').value || "Your Business Name";
    document.getElementById('out-inv-abn').innerText = document.getElementById('inv-abn').value || "00 000 000 000";
    document.getElementById('out-inv-client-name').innerText = document.getElementById('inv-client-name').value || "Client Name";
    document.getElementById('out-inv-client-ndis').innerText = document.getElementById('inv-client-ndis').value || "Not Provided";
    document.getElementById('out-inv-bank').innerText = document.getElementById('inv-bank').value || "Please enter bank details on the left.";

    // Handle Table Rows & Math
    const tbody = document.getElementById('out-inv-items');
    tbody.innerHTML = "";
    let grandTotal = 0;

    document.querySelectorAll('.inv-item-row').forEach(row => {
        const date = row.querySelector('.inv-item-date').value;
        const code = row.querySelector('.inv-item-code').value;
        const desc = row.querySelector('.inv-item-desc').value;
        const qty = parseFloat(row.querySelector('.inv-item-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.inv-item-rate').value) || 0;
        
        const lineTotal = qty * rate;

        if (date || code || desc || qty || rate) {
            grandTotal += lineTotal;
            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td>${date}</td>
                    <td>${code}</td>
                    <td>${desc}</td>
                    <td style="text-align: center;">${qty}</td>
                    <td style="text-align: right;">$${rate.toFixed(2)}</td>
                    <td style="text-align: right; font-weight: bold;">$${lineTotal.toFixed(2)}</td>
                </tr>
            `);
        }
    });

    document.getElementById('out-inv-total').innerText = `$${grandTotal.toFixed(2)}`;
}

function downloadInvoicePDF() {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    const originalTransform = element.style.transform;
    element.style.transform = "scale(1)"; 
    
    const invNum = document.getElementById('inv-num').value || "Invoice";
    const clientName = document.getElementById('inv-client-name').value || "Client";
    
    const opt = {
        margin:       0,
        filename:     `${invNum}_${clientName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.transform = originalTransform; 
    });
}

// =========================================
// 5. COMPLIANCE TRACKER & REMINDERS
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

    if (monthsDiff < 0) {
        statusContainer.innerHTML = `<span class="status-badge expired">⚠️ Expired ${Math.abs(monthsDiff)} months ago</span>`;
    } else if (monthsDiff <= 3) {
        statusContainer.innerHTML = `<span class="status-badge warning">⏳ Expiring Soon (${monthsDiff} months left)</span>`;
    } else {
        statusContainer.innerHTML = `<span class="status-badge good">✅ Valid (${monthsDiff} months left)</span>`;
    }
}

function saveReminders() {
    const container = document.getElementById('reminders-container');
    if (!container) return;
    
    const data = Array.from(container.querySelectorAll('.reminder-card')).map(card => ({
        name: card.querySelector('.rem-name').value, 
        date: card.querySelector('.rem-date').value, 
        validity: card.querySelector('.rem-validity').value
    }));
    localStorage.setItem('supportHubReminders', JSON.stringify(data));
}

function loadReminders() {
    const container = document.getElementById('reminders-container');
    if (!container || !localStorage.getItem('supportHubReminders')) return;
    
    container.innerHTML = '';
    const savedData = JSON.parse(localStorage.getItem('supportHubReminders'));
    
    savedData.forEach(data => {
        container.insertAdjacentHTML('beforeend', `
            <div class="reminder-card card">
                <div class="reminder-inputs">
                    <div class="input-group">
                        <label>Accreditation Name</label>
                        <input type="text" class="rem-name" value="${data.name || ''}" oninput="calculateExpiry(this)">
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
                <div class="reminder-status"><span class="status-badge pending">Awaiting Date...</span></div>
            </div>`);
    });
    
    document.querySelectorAll('.rem-date').forEach(d => { if (d.value) calculateExpiry(d); });
}

// =========================================
// 6. SHIFT BOOKINGS MANAGER
// =========================================
let shifts = JSON.parse(localStorage.getItem('supportHubShifts')) || [];

function setupShiftManager() {
    const form = document.getElementById('form-add-shift');
    if (!form) return;
    
    renderShifts();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const start = document.getElementById('shift-start').value;
        const end = document.getElementById('shift-end').value;
        const startTime = new Date(`1970-01-01T${start}Z`);
        let endTime = new Date(`1970-01-01T${end}Z`);
        
        if(endTime < startTime) endTime.setDate(endTime.getDate() + 1); 

        shifts.push({
            id: Date.now(), 
            client: document.getElementById('shift-client').value, 
            date: document.getElementById('shift-date').value,
            start: start, 
            end: end, 
            hours: ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2),
            code: document.getElementById('shift-code').value || '-', 
            notes: document.getElementById('shift-notes').value || '-'
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
    if (shifts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #636e72;">No shifts logged yet.</td></tr>`;
        return;
    }
    
    shifts.forEach(shift => {
        const dateStr = new Date(shift.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="font-weight: bold; color: var(--accent);">${dateStr}</td>
                <td>${shift.client}</td>
                <td>${shift.start} - ${shift.end}</td>
                <td><strong>${shift.hours} hrs</strong></td>
                <td><span style="background:#eee; padding:3px 6px; border-radius:4px; font-size:0.85rem;">${shift.code}</span></td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${shift.notes}">${shift.notes}</td>
                <td><button onclick="deleteShift(${shift.id})" class="delete-btn">Delete</button></td>
            </tr>`);
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
// 7. CONTACT DEVELOPER FORM (FORMSPREE)
// =========================================
function setupContactForm() {
    const form = document.getElementById('form-contact');
    const successBanner = document.getElementById('contact-success');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const formData = new FormData(form);

        try {
            const response = await fetch('https://formspree.io/f/xjgepyel', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none';
                successBanner.style.display = 'block';
                form.reset();
            } else {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        } catch (error) {
            alert("Network error. Please check your internet connection and try again.");
        }
    });
}

// =========================================
// 8. CLIENT DIRECTORY MANAGER
// =========================================
let clients = JSON.parse(localStorage.getItem('supportHubClients')) || [];

function setupClientManager() {
    const form = document.getElementById('form-add-client');
    if (!form) return;
    
    renderClients();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clients.push({
            id: Date.now(),
            name: document.getElementById('client-name').value,
            ndis: document.getElementById('client-ndis').value || 'N/A',
            phone: document.getElementById('client-phone').value || 'N/A',
            emergency: document.getElementById('client-emergency').value || 'N/A',
            address: document.getElementById('client-address').value || 'N/A',
            notes: document.getElementById('client-notes').value || 'No notes added.'
        });
        localStorage.setItem('supportHubClients', JSON.stringify(clients));
        renderClients();
        form.reset();
    });
}

function renderClients() {
    const container = document.getElementById('client-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    if (clients.length === 0) {
        container.innerHTML = `<p style="color: #636e72; grid-column: 1 / -1;">No clients logged yet.</p>`;
        return;
    }

    clients.forEach(c => {
        container.insertAdjacentHTML('beforeend', `
            <div class="contact-card">
                <button onclick="deleteClient(${c.id})" class="btn-delete-contact" title="Delete Client"><i class="fa-solid fa-trash-can"></i></button>
                <h3>${c.name}</h3>
                <p><strong>NDIS:</strong> ${c.ndis}</p>
                <p><strong>Phone:</strong> ${c.phone}</p>
                <p><strong>Emergency:</strong> ${c.emergency}</p>
                <p><strong>Location:</strong> ${c.address}</p>
                <p class="card-notes">${c.notes}</p>
            </div>
        `);
    });
}

function deleteClient(id) {
    if(confirm("Delete this client profile?")) {
        clients = clients.filter(c => c.id !== id);
        localStorage.setItem('supportHubClients', JSON.stringify(clients));
        renderClients();
    }
}

// =========================================
// 9. AGENCY DIRECTORY MANAGER
// =========================================
let agencies = JSON.parse(localStorage.getItem('supportHubAgencies')) || [];

function setupAgencyManager() {
    const form = document.getElementById('form-add-agency');
    if (!form) return;
    
    renderAgencies();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        agencies.push({
            id: Date.now(),
            name: document.getElementById('agency-name').value,
            contact: document.getElementById('agency-contact').value || 'N/A',
            phone: document.getElementById('agency-phone').value || 'N/A',
            afterhours: document.getElementById('agency-afterhours').value || 'N/A',
            email: document.getElementById('agency-email').value || 'N/A',
            notes: document.getElementById('agency-notes').value || 'No links/notes added.'
        });
        localStorage.setItem('supportHubAgencies', JSON.stringify(agencies));
        renderAgencies();
        form.reset();
    });
}

function renderAgencies() {
    const container = document.getElementById('agency-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    if (agencies.length === 0) {
        container.innerHTML = `<p style="color: #636e72; grid-column: 1 / -1;">No agencies logged yet.</p>`;
        return;
    }

    agencies.forEach(a => {
        container.insertAdjacentHTML('beforeend', `
            <div class="contact-card">
                <button onclick="deleteAgency(${a.id})" class="btn-delete-contact" title="Delete Agency"><i class="fa-solid fa-trash-can"></i></button>
                <h3>${a.name}</h3>
                <p><strong>Contact:</strong> ${a.contact}</p>
                <p><strong>Office:</strong> ${a.phone}</p>
                <p><strong>On-Call/AH:</strong> ${a.afterhours}</p>
                <p><strong>Email:</strong> ${a.email}</p>
                <p class="card-notes">${a.notes}</p>
            </div>
        `);
    });
}

function deleteAgency(id) {
    if(confirm("Delete this agency profile?")) {
        agencies = agencies.filter(a => a.id !== id);
        localStorage.setItem('supportHubAgencies', JSON.stringify(agencies));
        renderAgencies();
    }
}

// =========================================
// 10. INITIALIZATION
// =========================================
window.onload = () => {
    // Nav & Theme
    highlightActivePage();
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) setTheme(savedTheme);
    
    // Global Elements
    setupDynamicButtons(); 
    
    // Page-Specific Triggers (Safely bypassed if not on the page)
    updatePreview();         // Resume Preview
    updateInvoicePreview();  // Invoice Preview
    loadReminders();         // Compliance Tracker
    setupShiftManager();     // Shift Bookings
    setupContactForm();      // Dev Contact (Formspree)
    setupClientManager();    // Client Directory
    setupAgencyManager();    // Agency Directory
};
