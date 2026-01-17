// PDF Merge Tool

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const mergeBtn = document.getElementById('merge-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileList = document.getElementById('file-list');
    
    let selectedFiles = [];
    let mergedBlob = null;

    // Setup drag and drop
    setupDragAndDrop(uploadArea, fileInput);

    // File input change
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handleFilesSelect(files);
    });

    function handleFilesSelect(files) {
        // Validate files
        const validFiles = files.filter(file => {
            if (!validateFileType(file, ['application/pdf'])) {
                showAlert(`${file.name} is not a valid PDF file.`, 'error');
                return false;
            }
            if (!validateFileSize(file, 50)) {
                showAlert(`${file.name} exceeds 50MB limit.`, 'error');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Limit to 10 files
        if (selectedFiles.length + validFiles.length > 10) {
            showAlert('Maximum 10 files allowed. Please select fewer files.', 'error');
            validFiles.splice(10 - selectedFiles.length);
        }

        selectedFiles = [...selectedFiles, ...validFiles];
        updateFileList();
        mergeBtn.disabled = selectedFiles.length < 2;
    }

    function updateFileList() {
        fileList.innerHTML = '';
        
        if (selectedFiles.length === 0) return;

        const listDiv = document.createElement('div');
        listDiv.style.padding = '1rem';
        listDiv.style.background = '#f3f4f6';
        listDiv.style.borderRadius = '6px';
        listDiv.style.marginTop = '1rem';

        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.style.display = 'flex';
            fileItem.style.justifyContent = 'space-between';
            fileItem.style.alignItems = 'center';
            fileItem.style.padding = '0.5rem';
            fileItem.style.marginBottom = '0.5rem';
            fileItem.style.background = 'white';
            fileItem.style.borderRadius = '4px';

            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `<strong>${index + 1}.</strong> ${file.name} <span style="color: #6b7280;">(${formatFileSize(file.size)})</span>`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'btn btn-secondary';
            removeBtn.style.padding = '0.25rem 0.75rem';
            removeBtn.style.fontSize = '0.875rem';
            removeBtn.onclick = () => {
                selectedFiles.splice(index, 1);
                updateFileList();
                mergeBtn.disabled = selectedFiles.length < 2;
            };

            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            listDiv.appendChild(fileItem);
        });

        fileList.appendChild(listDiv);
    }

    // Wait for libraries
    function waitForLibraries() {
        return new Promise((resolve) => {
            if (typeof PDFLib !== 'undefined') {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (typeof PDFLib !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    // Merge button
    mergeBtn.addEventListener('click', async function() {
        if (selectedFiles.length < 2) return;

        await waitForLibraries();

        mergeBtn.disabled = true;
        mergeBtn.textContent = 'Merging...';
        
        const loadingSpinner = showLoading(document.getElementById('upload-section'));

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const file of selectedFiles) {
                const fileBytes = await file.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(fileBytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            mergedBlob = new Blob([pdfBytes], { type: 'application/pdf' });

            downloadBtn.classList.remove('hidden');
            showAlert('PDFs merged successfully!', 'success');

        } catch (error) {
            console.error('Merge error:', error);
            showAlert('Error merging PDFs. Please try again.', 'error');
        } finally {
            hideLoading();
            mergeBtn.disabled = false;
            mergeBtn.textContent = 'Merge PDFs';
        }
    });

    // Download button
    downloadBtn.addEventListener('click', function() {
        if (mergedBlob) {
            createDownloadLink(mergedBlob, 'merged.pdf');
        }
    });
});
