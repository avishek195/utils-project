// ATS Keyword Checker

document.addEventListener('DOMContentLoaded', function() {
    const resumeText = document.getElementById('resume-text');
    const fileInput = document.getElementById('file-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const results = document.getElementById('results');
    const scoreDisplay = document.getElementById('score-display');
    const scoreLabel = document.getElementById('score-label');
    const keywordsFound = document.getElementById('keywords-found');
    const suggestionsList = document.getElementById('suggestions-list');
    const statsContent = document.getElementById('stats-content');

    // Common ATS keywords
    const commonKeywords = {
        technical: ['javascript', 'python', 'java', 'sql', 'html', 'css', 'react', 'node', 'api', 'git', 'github', 'agile', 'scrum', 'devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes'],
        soft: ['leadership', 'communication', 'teamwork', 'collaboration', 'problem solving', 'analytical', 'creative', 'organized', 'detail-oriented', 'time management'],
        action: ['managed', 'developed', 'implemented', 'created', 'designed', 'improved', 'increased', 'reduced', 'led', 'coordinated', 'executed', 'achieved'],
        general: ['experience', 'skills', 'education', 'certification', 'project', 'achievement', 'responsibility', 'professional', 'bachelor', 'master', 'degree']
    };

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

    // Analyze button
    analyzeBtn.addEventListener('click', function() {
        const text = resumeText.value.trim();
        
        if (!text) {
            showAlert('Please paste your resume text or upload a file.', 'error');
            return;
        }

        if (text.length < 100) {
            showAlert('Resume text seems too short. Please provide more content.', 'error');
            return;
        }

        analyzeResume(text);
    });

    function analyzeResume(text) {
        const lowerText = text.toLowerCase();
        
        // Find keywords
        const foundKeywords = {};
        let totalFound = 0;
        
        Object.keys(commonKeywords).forEach(category => {
            foundKeywords[category] = [];
            commonKeywords[category].forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    foundKeywords[category].push({
                        keyword: keyword,
                        count: matches.length
                    });
                    totalFound += matches.length;
                }
            });
        });

        // Calculate score (0-100)
        const wordCount = text.split(/\s+/).length;
        const keywordDensity = (totalFound / wordCount) * 100;
        const uniqueKeywords = Object.values(foundKeywords).flat().length;
        
        let score = 0;
        score += Math.min(keywordDensity * 10, 40); // Keyword density (max 40 points)
        score += Math.min(uniqueKeywords * 2, 30); // Unique keywords (max 30 points)
        score += Math.min(wordCount / 10, 20); // Length (max 20 points)
        score += checkFormatting(text) * 10; // Formatting (max 10 points)
        
        score = Math.round(Math.min(score, 100));

        // Display results
        displayResults(score, foundKeywords, text, wordCount, uniqueKeywords);
    }

    function checkFormatting(text) {
        let score = 0;
        
        // Check for common sections
        const sections = ['experience', 'education', 'skills', 'summary', 'objective', 'contact'];
        sections.forEach(section => {
            if (text.toLowerCase().includes(section)) score += 0.15;
        });
        
        // Check for email
        if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) score += 0.1;
        
        // Check for phone
        if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) score += 0.1;
        
        return Math.min(score, 1);
    }

    function displayResults(score, foundKeywords, text, wordCount, uniqueKeywords) {
        // Score
        scoreDisplay.textContent = score + '%';
        let scoreColor = '#ef4444';
        let scoreText = 'Needs Improvement';
        
        if (score >= 80) {
            scoreColor = '#10b981';
            scoreText = 'Excellent';
        } else if (score >= 70) {
            scoreColor = '#3b82f6';
            scoreText = 'Good';
        } else if (score >= 60) {
            scoreColor = '#f59e0b';
            scoreText = 'Fair';
        }
        
        scoreDisplay.style.color = scoreColor;
        scoreLabel.textContent = scoreText;

        // Keywords found
        let keywordsHTML = '';
        Object.keys(foundKeywords).forEach(category => {
            if (foundKeywords[category].length > 0) {
                keywordsHTML += `<div style="margin-bottom: 1rem;"><strong>${category.charAt(0).toUpperCase() + category.slice(1)} Keywords:</strong> `;
                keywordsHTML += foundKeywords[category].map(k => `${k.keyword} (${k.count})`).join(', ');
                keywordsHTML += '</div>';
            }
        });
        
        if (!keywordsHTML) {
            keywordsHTML = '<p style="color: #6b7280;">No common keywords found. Consider adding relevant industry keywords.</p>';
        }
        
        keywordsFound.innerHTML = keywordsHTML;

        // Suggestions
        const suggestions = generateSuggestions(score, foundKeywords, text, wordCount);
        suggestionsList.innerHTML = suggestions.map(s => 
            `<div class="faq-item" style="margin-bottom: 0.5rem;">${s}</div>`
        ).join('');

        // Stats
        statsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div><strong>Word Count:</strong> ${wordCount.toLocaleString()}</div>
                <div><strong>Unique Keywords:</strong> ${uniqueKeywords}</div>
                <div><strong>Total Keyword Matches:</strong> ${Object.values(foundKeywords).flat().reduce((sum, k) => sum + k.count, 0)}</div>
                <div><strong>Keyword Density:</strong> ${((Object.values(foundKeywords).flat().reduce((sum, k) => sum + k.count, 0) / wordCount) * 100).toFixed(2)}%</div>
            </div>
        `;

        results.classList.remove('hidden');
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function generateSuggestions(score, foundKeywords, text, wordCount) {
        const suggestions = [];
        
        if (score < 70) {
            suggestions.push('Add more relevant keywords from the job description to improve ATS compatibility.');
        }
        
        if (Object.values(foundKeywords).flat().length < 10) {
            suggestions.push('Include more industry-specific keywords and technical terms related to your field.');
        }
        
        if (wordCount < 300) {
            suggestions.push('Your resume seems short. Consider adding more detail about your experience and achievements.');
        }
        
        if (wordCount > 1000) {
            suggestions.push('Your resume is quite long. Consider condensing to 1-2 pages for better ATS parsing.');
        }
        
        if (!foundKeywords.action.length) {
            suggestions.push('Use action verbs (managed, developed, implemented) to describe your achievements.');
        }
        
        if (!foundKeywords.soft.length) {
            suggestions.push('Include soft skills (leadership, communication, teamwork) that are relevant to the position.');
        }
        
        if (!/\b\d+%|\$\d+|\d+\s*(years?|months?)/i.test(text)) {
            suggestions.push('Add quantifiable achievements (percentages, dollar amounts, timeframes) to strengthen your resume.');
        }
        
        if (!text.toLowerCase().includes('experience') && !text.toLowerCase().includes('work')) {
            suggestions.push('Ensure your resume includes clear "Experience" or "Work History" sections.');
        }
        
        if (suggestions.length === 0) {
            suggestions.push('Your resume looks good! Continue to tailor it for each job application by incorporating keywords from the job description.');
        }
        
        return suggestions;
    }
});
