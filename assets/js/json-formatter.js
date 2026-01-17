// JSON Formatter

document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatBtn = document.getElementById('format-btn');
    const minifyBtn = document.getElementById('minify-btn');
    const validateBtn = document.getElementById('validate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');

    function highlightJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            const formatted = JSON.stringify(obj, null, 2);
            
            // Simple syntax highlighting
            return formatted
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'json-boolean';
                    } else if (/null/.test(match)) {
                        cls = 'json-null';
                    }
                    return `<span class="${cls}">${escapeHTML(match)}</span>`;
                });
        } catch (e) {
            return escapeHTML(jsonString);
        }
    }

    function formatJSON() {
        errorMessage.classList.add('hidden');
        const input = jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to format.', 'error');
            return;
        }

        try {
            const obj = JSON.parse(input);
            const formatted = JSON.stringify(obj, null, 2);
            jsonOutput.innerHTML = highlightJSON(formatted);
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    function minifyJSON() {
        errorMessage.classList.add('hidden');
        const input = jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to minify.', 'error');
            return;
        }

        try {
            const obj = JSON.parse(input);
            const minified = JSON.stringify(obj);
            jsonOutput.textContent = minified;
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    function validateJSON() {
        errorMessage.classList.add('hidden');
        const input = jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON to validate.', 'error');
            return;
        }

        try {
            JSON.parse(input);
            showAlert('✓ Valid JSON!', 'success');
            formatJSON();
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    function showError(message) {
        errorMessage.className = 'alert alert-error';
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        jsonOutput.textContent = '';
    }

    async function copyOutput() {
        const text = jsonOutput.textContent;
        if (!text) {
            showAlert('No output to copy.', 'error');
            return;
        }
        await copyToClipboard(text);
    }

    formatBtn.addEventListener('click', formatJSON);
    minifyBtn.addEventListener('click', minifyJSON);
    validateBtn.addEventListener('click', validateJSON);
    copyBtn.addEventListener('click', copyOutput);

    // Auto-format on paste (debounced)
    let timeout;
    jsonInput.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (jsonInput.value.trim()) {
                try {
                    JSON.parse(jsonInput.value.trim());
                    formatJSON();
                } catch (e) {
                    // Don't auto-format invalid JSON
                }
            }
        }, 1000);
    });
});
