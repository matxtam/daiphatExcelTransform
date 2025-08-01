const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const imageGrid = document.getElementById('imageGrid');
const errorMessage = document.getElementById('errorMessage');

let uploadedImages = [];

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFileSelect, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropZone.classList.add('drag-over');
}

function unhighlight(e) {
  dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
  // Reset the file input
  fileInput.value = '';
}

function handleFiles(files) {
  hideError();
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')) {
      showError(`"${file.name}" is not a valid image file.`);
      continue;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError(`"${file.name}" is too large. Maximum size is 10MB.`);
      continue;
    }

    validFiles.push(file);
  }

  if (validFiles.length > 0) {
    validFiles.forEach(file => addImagePreview(file));
  }
}

function addImagePreview(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageId = Date.now() + Math.random();
    const imageData = {
      id: imageId,
      name: file.name,
      size: formatFileSize(file.size),
      url: e.target.result
    };

    uploadedImages.push(imageData);
    renderImageGrid();
    showPreviewContainer();
  };

  reader.readAsDataURL(file);
}

function renderImageGrid() {
  imageGrid.innerHTML = '';

  uploadedImages.forEach(image => {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.innerHTML = `
                    <img src="${image.url}" alt="${image.name}">
                    <button class="remove-btn" onclick="removeImage('${image.id}')" title="Remove image">
                        ×
                    </button>
                    <div class="image-info">
                        <div class="image-name">${image.name}</div>
                        <div class="image-size">${image.size}</div>
                    </div>
                `;
    imageGrid.appendChild(imageItem);
  });
}

function removeImage(imageId) {
  uploadedImages = uploadedImages.filter(img => img.id != imageId);
  renderImageGrid();

  if (uploadedImages.length === 0) {
    hidePreviewContainer();
  }
}

function clearAllImages() {
  uploadedImages = [];
  imageGrid.innerHTML = '';
  hidePreviewContainer();
}

function showPreviewContainer() {
  previewContainer.classList.add('show');
}

function hidePreviewContainer() {
  previewContainer.classList.remove('show');
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(hideError, 5000);
}

function hideError() {
  errorMessage.classList.remove('show');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(wk, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add click handler for the entire drop zone
dropZone.addEventListener('click', function (e) {
  if (e.target === dropZone || e.target.classList.contains('drop-zone-content')) {
    fileInput.click();
  }
});
