/**
 * SupportHub Global JavaScript
 */

// =========================================
// 1. THEME & NAVIGATION MANAGEMENT
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
// 2. DYNAMIC FORM ENTRIES (RESUME)
// =========================================
function addEntry(containerId, className, placeholder) {
    const container = document.getElementById(containerId);
    if (!container) return; // Exit if not on the resume page

    const currentInputs = container.querySelectorAll(`.${className}`).length;
    const limit = (containerId === 'acc-inputs') ? 7 : 3;

    if (currentInputs < limit) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = className;
        input.placeholder = placeholder;
        input.oninput = updatePreview; 
        container.appendChild(input);
    } else {
        alert(`Maximum of ${limit} entries allowed for this section.`);
    }
}

function addExperienceEntry() {
    const container = document.getElementById('exp-inputs');
    if (!container) return;

    const currentEntries = container.querySelectorAll('.exp-entry').length;

    if (currentEntries < 5) {
        const div = document.createElement('div');
        div.className = 'exp-entry';
        div.innerHTML = `
            <input type="text" class="exp-dates" placeholder="Dates" oninput="updatePreview()">
            <input type="text" class="exp-employer" placeholder="Employer Name" oninput="updatePreview()">
            <textarea class="exp-desc" placeholder="Responsibilities..." oninput="updatePreview()"></textarea>
        `;
        container.appendChild(div);
    } else {
        alert("Maximum of 5 experience entries allowed.");
    }
}

// =========================================
// 3. RESUME LIVE PREVIEW LOGIC
// =========================================
function updatePreview() {
    // If not on the resume page, skip this function
    if (!document.getElementById('outName')) return; 

    // Basic Details
    document.getElementById('outName').innerText = (document.getElementById('inName').value || "Your Name").toUpperCase();
    document.getElementById('outEmail').innerText = document.getElementById('inEmail').value || "email@example.com";
    document.getElementById('outPhone').innerText = document.getElementById('inPhone').value || "0400 000 000";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Professional summary details will appear here...";

    // Accreditations
    const accList = document.getElementById('outAccreds');
    accList.innerHTML = "";
    document.querySelectorAll('.acc-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            accList.appendChild(li);
        }
    });

    // Qualifications
    const qualList = document.getElementById('outQuals');
    qualList.innerHTML = "";
    document.querySelectorAll('.qual-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            qualList.appendChild(li);
        }
    });

    // Experience
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
// 4. PDF GENERATOR LOGIC
// =========================================
function downloadPDF() {
    const element = document.getElementById('resume-content');
    
    // Temporarily reset scaling for a high-quality capture
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
        // Restore previous scaling based on screen size
        element.style.transform = originalTransform;
    });
}

// =========================================
// 5. INITIALIZATION
// =========================================
window.onload = () => {
