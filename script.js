function setTheme(themeName) {
    document.body.className = themeName;
    // Optional: Save to local storage so it persists
    localStorage.setItem('userTheme', themeName);
}

// Load saved theme on startup
window.onload = () => {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

};

// Live Update Function
function updatePreview() {
    document.getElementById('outName').innerText = document.getElementById('inName').value || "Your Name";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Summary info...";
    document.getElementById('outExp').innerText = document.getElementById('inExp').value || "Experience info...";

    // Handle Skills List
    const skillsInput = document.getElementById('inSkills').value;
    const skillsList = document.getElementById('outSkills');
    skillsList.innerHTML = ""; // Clear current
    
    if(skillsInput) {
        skillsInput.split(',').forEach(skill => {
            let li = document.createElement('li');
            li.innerText = skill.trim();
            skillsList.appendChild(li);
        });
    }
}

// PDF Download Function
function downloadPDF() {
    const element = document.getElementById('resume-content');
    const opt = {
        margin:       0,
        filename:     'Support_Worker_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Run the conversion
    html2pdf().set(opt).from(element).save();
}

// Function to highlight the current page in the Nav Bar
function highlightActivePage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Theme Switcher Logic
function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('userTheme', themeName);
}

// Run on every page load
window.onload = () => {
    highlightActivePage();
    
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
};

function updatePreview() {
    // Basic Details
    document.getElementById('outName').innerText = document.getElementById('inName').value || "Your Name";
    document.getElementById('outEmail').innerText = document.getElementById('inEmail').value || "Email";
    document.getElementById('outPhone').innerText = document.getElementById('inPhone').value || "Phone";
    document.getElementById('outBio').innerText = document.getElementById('inBio').value || "Summary...";

    // Accreditations
    const accInputs = document.querySelectorAll('.acc-in');
    const accList = document.getElementById('outAccreds');
    accList.innerHTML = "";
    accInputs.forEach(input => {
        if(input.value) {
            let li = document.createElement('li');
            li.innerText = input.value;
            accList.appendChild(li);
        }
    });

    // Qualifications
    const qualInputs = document.querySelectorAll('.qual-in');
    const qualList = document.getElementById('outQuals');
    qualList.innerHTML = "";
    qualInputs.forEach(input => {
        if(input.value) {
            let li = document.createElement('li');
            li.innerText = input.value;
            qualList.appendChild(li);
        }
    });

    // Experience Blocks
    const expBlocks = document.querySelectorAll('.exp-entry');
    const expOutput = document.getElementById('outExp');
    expOutput.innerHTML = "";
    expBlocks.forEach(block => {
        const dates = block.querySelector('.exp-dates').value;
        const employer = block.querySelector('.exp-employer').value;
        const desc = block.querySelector('.exp-desc').value;

        if(dates || employer) {
            let div = document.createElement('div');
            div.className = "res-exp-item";
            div.innerHTML = `<strong>${dates}</strong> - <strong>${employer}</strong><p>${desc}</p>`;
            expOutput.appendChild(div);
        }
    });
}
