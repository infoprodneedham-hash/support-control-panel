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
    // Add Accreditation Logic
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

    // Add Qualification Logic
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

    // Add Experience Logic
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
}

// =========================================
// 3. LIVE PREVIEW LOGIC
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
// 4. PDF GENERATOR LOGIC
// =========================================
function downloadPDF() {
    const element = document.getElementById('resume-content');
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
// 5. INITIALIZATION
// =========================================
window.onload = () => {
    highlightActivePage();
    setupDynamicButtons(); // Boot up the add buttons
    
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) setTheme(savedTheme);
    
    updatePreview(); 
};
