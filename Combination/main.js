//Touch screen lag when dragging slider
const slider = document.getElementById('myRange');
let isDragging = false;

const startDrag = (e) => {
isDragging = true;
updateSlider(e);
};

const endDrag = () => {
isDragging = false;
};

const drag = (e) => {
if (isDragging) {
    updateSlider(e);
}
};

const updateSlider = (e) => {
let clientX;
if (e.touches) {
    clientX = e.touches[0].clientX;
} else {
    clientX = e.clientX;
}
// Update slider position logic here using clientX
};

