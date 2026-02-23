/**
 * SupportHub Global JavaScript
 */

// 1. Theme Management
function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('userTheme', themeName);
}

// 2. Active Nav Highlighting
function highlightActivePage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// 3. Resume Live Preview Logic
function updatePreview() {
    // Basic Details
    document.getElementById('outName').innerText = (document.getElementById('inName').value || "Your Name").toUpperCase();
    document.getElementById('outEmail').innerText = document.getElementById('inEmail').value || "email@example.com";
    document.getElementById('outPhone').innerText = document.getElementById('inPhone').value || "0400 000 000";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Summary details will appear here...";

    // Accreditations (Loop through all 7)
    const accList = document.getElementById('outAccreds');
    accList.innerHTML = "";
    document.querySelectorAll('.acc-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            accList.appendChild(li);
        }
    });

    // Qualifications (Loop through all 3)
    const qualList = document.getElementById('outQuals');
    qualList.innerHTML = "";
    document.querySelectorAll('.qual-in').forEach(input => {
        if (input.value.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = input.value;
            qualList.appendChild(li);
        }
    });

    // Experience (Loop through up to 5 blocks)
    const expOutput = document.getElementById('outExp');
    expOutput.innerHTML = "";
    document.querySelectorAll('.exp-entry').forEach(block => {
        const dates = block.querySelector('.exp-dates').value;
        const employer = block.querySelector('.exp-employer').value;
        const desc = block.querySelector('.exp-desc').value;

        if (dates || employer) {
            const item = document.createElement('div');
            item.className = "res-exp-item";
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-weight:bold;">
                    <span>${employer || 'Employer'}</span>
                    <span>${dates || 'Dates'}</span>
                </div>
                <p>${desc || ''}</p>
            `;
            expOutput.appendChild(item);
        }
    });
}

// 4. PDF Generation
function downloadPDF() {
    const element = document.getElementById('resume-content');
    
    // Temporarily remove transform for a clean capture
    element.style.transform = "scale(1)";
    
    const opt = {
        margin:       0,
        filename:     'Support_Worker_Resume.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Reset scale back to screen-friendly size
        if (window.innerWidth > 1024) {
            element.style.transform = "scale(0.65)";
        } else {
            element.style.transform = "scale(1)";
        }
    });
}

// Initialize on Load
window.onload = () => {
    highlightActivePage();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    // If we are on the resume page, run the preview once to clear placeholders
    if(document.getElementById('inName')) {
        updatePreview();
    }
};
