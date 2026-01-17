// PDF to Image Converter

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const optionsDiv = document.getElementById('options');
    const formatSelect = document.getElementById('format-select');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const pagesSelect = document.getElementById('pages-select');
    const downloadLinks = document.getElementById('download-links');
    
    let selectedFile = null;
    let pdfDoc = null;
    let totalPages = 0;

    // Setup drag and drop
    setupDragAndDrop(uploadArea, fileInput);

    // Quality slider
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = Math.round(this.value * 100) + '%';
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    async function handleFileSelect(file) {
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
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;

            // Populate pages select
            pagesSelect.innerHTML = '<option value="all">All Pages</option>';
            for (let i = 1; i <= totalPages; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Page ${i}`;
                pagesSelect.appendChild(option);
            }

            optionsDiv.classList.remove('hidden');
            convertBtn.disabled = false;
            downloadLinks.innerHTML = '';

        } catch (error) {
            console.error('Error loading PDF:', error);
            showAlert('Error loading PDF. Please try again.', 'error');
        }
    }

    // Convert button
    convertBtn.addEventListener('click', async function() {
        if (!pdfDoc) return;

        convertBtn.disabled = true;
        convertBtn.textContent = 'Converting...';
        
        const loadingSpinner = showLoading(document.getElementById('upload-section'));
        downloadLinks.innerHTML = '';

        try {
            const format = formatSelect.value;
            const quality = parseFloat(qualitySlider.value);
            const selectedPage = pagesSelect.value;

            const pagesToConvert = selectedPage === 'all' 
                ? Array.from({ length: totalPages }, (_, i) => i + 1)
                : [parseInt(selectedPage)];

            for (const pageNum of pagesToConvert) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Convert to blob
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, `image/${format}`, quality);
                });

                // Create download link
                const linkDiv = document.createElement('div');
                linkDiv.style.marginTop = '0.5rem';
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${selectedFile.name.replace('.pdf', '')}_page_${pageNum}.${format}`;
                link.className = 'btn btn-success';
                link.textContent = `Download Page ${pageNum} (${format.toUpperCase()})`;
                link.style.display = 'inline-block';
                
                linkDiv.appendChild(link);
                downloadLinks.appendChild(linkDiv);
            }

            showAlert('Conversion completed successfully!', 'success');

        } catch (error) {
            console.error('Conversion error:', error);
            showAlert('Error converting PDF. Please try again.', 'error');
        } finally {
            hideLoading();
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert to Images';
        }
    });
});
