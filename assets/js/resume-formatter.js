// Resume Formatter

document.addEventListener('DOMContentLoaded', function() {
    const resumeText = document.getElementById('resume-text');
    const fileInput = document.getElementById('file-input');
    const formatBtn = document.getElementById('format-btn');
    const formattedOutput = document.getElementById('formatted-output');
    const formattedText = document.getElementById('formatted-text');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    let formattedContent = '';

    // File input handler
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            try {
                const text = await file.text();
                resumeText.value = text;
            } catch (error) {
                showAlert('Error reading file. Please try again.', 'error');
            }
        }
    });

    // Format button
    formatBtn.addEventListener('click', function() {
        const text = resumeText.value.trim();
        
        if (!text) {
            showAlert('Please paste your resume text or upload a file.', 'error');
            return;
        }

        formattedContent = formatResume(text);
        formattedText.textContent = formattedContent;
        formattedOutput.classList.remove('hidden');
        formattedOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function formatResume(text) {
        let formatted = text;

        // Normalize line breaks
        formatted = formatted.replace(/\r\n/g, '\n');
        formatted = formatted.replace(/\r/g, '\n');

        // Remove excessive whitespace
        formatted = formatted.replace(/[ \t]+/g, ' ');
        formatted = formatted.replace(/\n{3,}/g, '\n\n');

        // Standardize section headers
        const sectionHeaders = {
            'objective': 'OBJECTIVE',
            'summary': 'SUMMARY',
            'professional summary': 'PROFESSIONAL SUMMARY',
            'experience': 'EXPERIENCE',
            'work experience': 'EXPERIENCE',
            'employment': 'EXPERIENCE',
            'work history': 'EXPERIENCE',
            'education': 'EDUCATION',
            'skills': 'SKILLS',
            'technical skills': 'SKILLS',
            'core competencies': 'SKILLS',
            'certifications': 'CERTIFICATIONS',
            'certification': 'CERTIFICATIONS',
            'awards': 'AWARDS',
            'achievements': 'ACHIEVEMENTS',
            'projects': 'PROJECTS',
            'contact': 'CONTACT',
            'contact information': 'CONTACT',
            'references': 'REFERENCES'
        };

        Object.keys(sectionHeaders).forEach(key => {
            const regex = new RegExp(`^\\s*${key}\\s*:?\\s*$`, 'gmi');
            formatted = formatted.replace(regex, `\n${sectionHeaders[key]}\n`);
        });

        // Format dates (normalize various formats)
        formatted = formatted.replace(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/g, (match, m, d, y) => {
            const year = y.length === 2 ? '20' + y : y;
            return `${m}/${year}`;
        });

        // Format months
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
        months.forEach((month, index) => {
            const regex = new RegExp(`\\b${month}\\s+(\\d{4})\\b`, 'gi');
            formatted = formatted.replace(regex, `${month.substring(0, 3).toUpperCase()} $1`);
        });

        // Standardize bullet points
        formatted = formatted.replace(/^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s+/gm, '• ');
        formatted = formatted.replace(/^\d+[\.\)]\s+/gm, '• ');

        // Format email addresses
        formatted = formatted.replace(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g, '$1');

        // Format phone numbers
        formatted = formatted.replace(/\b(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g, '($1) $2-$3');

        // Clean up contact section
        formatted = formatted.replace(/\b(phone|tel|mobile|cell)[\s:]*([^\n]+)/gi, 'Phone: $2');
        formatted = formatted.replace(/\b(email|e-mail)[\s:]*([^\n]+)/gi, 'Email: $2');
        formatted = formatted.replace(/\b(address|location)[\s:]*([^\n]+)/gi, 'Address: $2');

        // Ensure proper spacing around headers
        formatted = formatted.replace(/\n([A-Z][A-Z\s]+)\n/g, '\n\n$1\n\n');
        
        // Remove extra blank lines
        formatted = formatted.replace(/\n{4,}/g, '\n\n\n');

        // Trim and clean
        formatted = formatted.trim();

        return formatted;
    }

    // Copy button
    copyBtn.addEventListener('click', async function() {
        await copyToClipboard(formattedContent);
    });

    // Download button
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([formattedContent], { type: 'text/plain' });
        createDownloadLink(blob, 'formatted_resume.txt');
    });
});
