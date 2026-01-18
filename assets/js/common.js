// Common JavaScript functions for Utility Tools Website

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const header = document.querySelector('header');
    
    if (mobileMenuToggle && navLinks) {
        // Function to calculate and set menu position based on header height
        function setMenuPosition() {
            if (window.innerWidth <= 768 && header) {
                const headerHeight = header.offsetHeight;
                navLinks.style.top = headerHeight + 'px';
                navLinks.style.maxHeight = 'calc(100vh - ' + headerHeight + 'px)';
            }
        }

        // Set initial position
        setMenuPosition();
        
        // Update position on resize - use throttle for performance
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setMenuPosition, 150);
        }, { passive: true });

        mobileMenuToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            
            // Update position when toggling (in case header height changed)
            setMenuPosition();
            
            // Prevent body scroll when menu is open
            if (isActive) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });

        // Close menu when clicking outside or on a link - use passive for performance
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }, { passive: true });

        // Close menu when clicking on a nav link
        navLinks.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
});

// File upload drag and drop
function setupDragAndDrop(uploadArea, fileInput) {
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.tool-container') || document.body;
    const firstChild = container.firstElementChild;
    
    if (firstChild) {
        container.insertBefore(alertDiv, firstChild);
    } else {
        container.appendChild(alertDiv);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
    
    return alertDiv;
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        showAlert('Failed to copy to clipboard', 'error');
        return false;
    }
}

// Validate file type
function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

// Validate file size (in MB)
function validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

// Create download link
function createDownloadLink(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Format JSON with syntax highlighting (basic)
function formatJSON(jsonString) {
    try {
        const obj = JSON.parse(jsonString);
        return JSON.stringify(obj, null, 2);
    } catch (e) {
        throw new Error('Invalid JSON: ' + e.message);
    }
}

// Escape HTML
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading spinner
function showLoading(container) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loading-spinner';
    container.appendChild(spinner);
    return spinner;
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}
