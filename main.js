// Add this at the top of your main.js file
const startColorPicker = document.getElementById('startColor');
const endColorPicker = document.getElementById('endColor');

function updateGradient() {
  document.body.style.background = `linear-gradient(135deg, ${startColorPicker.value} 0%, ${endColorPicker.value} 100%)`;
}

startColorPicker.addEventListener('input', updateGradient);
endColorPicker.addEventListener('input', updateGradient);

// Initialize gradient
updateGradient();

// Your existing todo list code remains below
// Rest of your JavaScript stays exactly the same
