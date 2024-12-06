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
    touchMoveStopPropagation: false,
    simulateTouch: false
});

function makeTextBoxInteractive(textBox) {
    textBox.addEventListener('dblclick', () => createCustomizationModal(textBox));
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault()
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb; 

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

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
                <input type="color" class="font-color" value="${rgbToHex(getComputedStyle(textBox).color)}">
            </label>
            <label>Font Family:
                <select class="font-family">
                    <option value="Arial" ${getComputedStyle(textBox).fontFamily.includes('Arial') ? 'selected' : ''}>Arial</option>
                    <option value="Helvetica" ${getComputedStyle(textBox).fontFamily.includes('Helvetica') ? 'selected' : ''}>Helvetica</option>
                    <option value="Times New Roman" ${getComputedStyle(textBox).fontFamily.includes('Times New Roman') ? 'selected' : ''}>Times New Roman</option>
                    <option value="Courier" ${getComputedStyle(textBox).fontFamily.includes('Courier') ? 'selected' : ''}>Courier</option>
                    <option value="Verdana" ${getComputedStyle(textBox).fontFamily.includes('Verdana') ? 'selected' : ''}>Verdana</option>
                    <option value="Tahoma" ${getComputedStyle(textBox).fontFamily.includes('Tahoma') ? 'selected' : ''}>Tahoma</option>
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

    applyBtn.addEventListener('click', () => {
        textBox.textContent = textContentInput.value.trim();
        textBox.style.fontSize = `${fontSizeInput.value}px`;
        textBox.style.color = rgbToHex(fontColorInput.value);
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

document.getElementById('add-text-btn').addEventListener('click', () => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const textOverlay = activeSlide.querySelector('.text-overlay');

    if (!textOverlay) return;

    const textBox = document.createElement('div');
    textBox.classList.add('text-box');
    textBox.textContent = 'Double-Click to Edit';

    textBox.style.left = '50%';
    textBox.style.top = '50%';
    textBox.style.transform = 'translate(-50%, -50%)';

    makeTextBoxInteractive(textBox);
    textOverlay.appendChild(textBox);
    dragElement(textBox);
});
