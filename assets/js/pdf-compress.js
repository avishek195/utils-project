// PDF Compression Tool

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const compressBtn = document.getElementById('compress-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');
    const reduction = document.getElementById('reduction');
    
    let selectedFile = null;
    let compressedBlob = null;

    // Setup drag and drop
    setupDragAndDrop(uploadArea, fileInput);

    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    function handleFileSelect(file) {
        // Validate file type
        if (!validateFileType(file, ['application/pdf'])) {
            showAlert('Please select a valid PDF file.', 'error');
            return;
        }

        // Validate file size (50MB)
        if (!validateFileSize(file, 50)) {
            showAlert('File size exceeds 50MB limit. Please select a smaller file.', 'error');
            return;
        }

        selectedFile = file;
        fileName.textContent = file.name;
        originalSize.textContent = formatFileSize(file.size);
        
        fileInfo.classList.remove('hidden');
        compressedSize.classList.add('hidden');
        reduction.classList.add('hidden');
        compressBtn.disabled = false;
        downloadBtn.classList.add('hidden');
    }

    // Wait for libraries to load
    function waitForLibraries() {
        return new Promise((resolve) => {
            if (typeof pdfjsLib !== 'undefined' && typeof PDFLib !== 'undefined') {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (typeof pdfjsLib !== 'undefined' && typeof PDFLib !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    // Compress button
    compressBtn.addEventListener('click', async function() {
        if (!selectedFile) return;

        await waitForLibraries();

        compressBtn.disabled = true;
        compressBtn.textContent = 'Compressing...';
        
        const loadingSpinner = showLoading(document.getElementById('upload-section'));

        try {
            // Read file as array buffer
            const arrayBuffer = await selectedFile.arrayBuffer();
            
            // Load PDF using PDF.js
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            // Create a new PDF document
            const pdfDoc = await PDFLib.PDFDocument.create();
            
            // Copy pages from original PDF with compression
            const numPages = pdf.numPages;
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                
                // Render page to canvas with lower quality for compression
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const scale = 0.9; // Slight scale reduction for compression
                canvas.height = viewport.height * scale;
                canvas.width = viewport.width * scale;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: page.getViewport({ scale: scale })
                };
                
                await page.render(renderContext).promise;
                
                // Convert canvas to JPEG with compression
                const imageData = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', 0.75); // 75% quality
                });
                
                const imageBytes = await imageData.arrayBuffer();
                const image = await pdfDoc.embedJpg(imageBytes);
                const pageObj = pdfDoc.addPage([viewport.width, viewport.height]);
                
                // Scale image to fit page
                const imageDims = image.scale(1);
                pageObj.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height,
                });
            }
            
            // Save compressed PDF
            const pdfBytes = await pdfDoc.save();
            compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            // Update UI
            const originalSizeBytes = selectedFile.size;
            const compressedSizeBytes = compressedBlob.size;
            const reductionPercent = ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes * 100).toFixed(1);
            
            compressedSize.textContent = formatFileSize(compressedSizeBytes);
            reduction.textContent = `${reductionPercent}% reduction`;
            
            compressedSize.classList.remove('hidden');
            reduction.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
            
            showAlert('PDF compressed successfully!', 'success');
            
        } catch (error) {
            console.error('Compression error:', error);
            showAlert('Error compressing PDF. Please try again or use a different file.', 'error');
        } finally {
            hideLoading();
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress PDF';
        }
    });

    // Download button
    downloadBtn.addEventListener('click', function() {
        if (compressedBlob) {
            const newFileName = selectedFile.name.replace('.pdf', '_compressed.pdf');
            createDownloadLink(compressedBlob, newFileName);
        }
    });
});
