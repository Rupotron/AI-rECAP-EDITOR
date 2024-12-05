// Initialize Swiper
const swiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Utility function to make text boxes interactive
function makeTextBoxInteractive(textBox) {
   textBox.addEventListener('mousedown', (e) => startDragging(e, textBox));
   textBox.addEventListener('dblclick', () => createCustomizationModal(textBox));
}

// Dragging functionality
let isDragging = false; 
let startX, startY, initialLeft, initialTop;

// Start dragging function
function startDragging(e, textBox) {
   isDragging = true;

   // Prevent default behavior (like text selection)
   e.preventDefault();

   startX = e.clientX; 
   startY = e.clientY; 
   initialLeft = parseInt(textBox.style.left, 10) || 1; // Default to zero if not set
   initialTop = parseInt(textBox.style.top, 10) || 1; // Default to zero if not set

   document.addEventListener('mousemove', (event) => drag(event, textBox));
   document.addEventListener('mouseup', stopDragging);
}

// Dragging function
function drag(e, textBox) {
   if (!isDragging) return;

   const dx = e.clientX - startX; // Change in X
   const dy = e.clientY - startY; // Change in Y

   // Update position of the text box
   textBox.style.left = `${initialLeft + dx}px`;
   textBox.style.top = `${initialTop + dy}px`;
}

// Stop dragging function
function stopDragging() {
   isDragging = false; 
   document.removeEventListener('mousemove', drag);
   document.removeEventListener('mouseup', stopDragging);
}

// Create customization modal
function createCustomizationModal(textBox) {
   const modal = document.createElement('div');
   modal.classList.add('customize-modal');
   modal.innerHTML = `
       <div class="modal-content">
           <h3>Customize Text Box</h3>
           <label>Text:
               <textarea class="text-content" rows="3">${textBox.textContent.trim()}</textarea>
           </label>
           <label>Font Size:
               <input type="number" class="font-size" min="8" max="72" value="${parseInt(getComputedStyle(textBox).fontSize)}">
           </label>
           <label>Font Color:
               <input type="color" class="font-color" value="${getComputedStyle(textBox).color}">
           </label>
           <label>Font Family:
               <select class="font-family">
                   <option>Arial</option>
                   <option>Helvetica</option>
                   <option>Times New Roman</option>
                   <option>Courier</option>
               </select>
           </label>
           <div class="modal-actions">
               <button class="apply-btn">Apply</button>
               <button class="cancel-btn">Cancel</button>
               <button class="delete-btn">Delete</button>
           </div>
       </div>
   `;

   document.body.appendChild(modal);

   const textContentInput = modal.querySelector('.text-content');
   const fontSizeInput = modal.querySelector('.font-size');
   const fontColorInput = modal.querySelector('.font-color');
   const fontFamilySelect = modal.querySelector('.font-family');
   const applyBtn = modal.querySelector('.apply-btn');
   const cancelBtn = modal.querySelector('.cancel-btn');
   const deleteBtn = modal.querySelector('.delete-btn');

   // Populate current text box values
   applyBtn.addEventListener('click', () => {
       textBox.textContent = textContentInput.value.trim();
       textBox.style.fontSize = `${fontSizeInput.value}px`;
       textBox.style.color = fontColorInput.value;
       textBox.style.fontFamily = fontFamilySelect.value;

       document.body.removeChild(modal);
   });

   cancelBtn.addEventListener('click', () => {
       document.body.removeChild(modal);
   });

   deleteBtn.addEventListener('click', () => {
       textBox.remove();
       document.body.removeChild(modal);
   });
}

// Add text box functionality
document.getElementById('add-text-btn').addEventListener('click', () => {
   const activeSlide = swiper.slides[swiper.activeIndex];
   const textOverlay = activeSlide.querySelector('.text-overlay');

   if (!textOverlay) return;

   // Create a new text box
   const textBox = document.createElement('div');
   textBox.classList.add('text-box');
   textBox.textContent = 'New Text';
   
   // Set initial position and style
   textBox.style.left = '50%';
   textBox.style.top = '50%';
   textBox.style.transform = 'translate(-50%, -50%)'; // Center the box

   makeTextBoxInteractive(textBox); // Make it interactive
   textOverlay.appendChild(textBox); // Append to the overlay
});