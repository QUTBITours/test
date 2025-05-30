/**
 * Main application code
 */

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage if first visit
  initializeStorage();
  
  // Set up the UI
  refreshUI();
  
  // Set up event listeners
  setupEventListeners();
  
  // Add Bismillah image
  loadBismillahImage();
});

/**
 * Load Bismillah image from public URL
 */
function loadBismillahImage() {
  const bismillahImg = document.querySelector('.bismillah-img');
  bismillahImg.src = 'https://i.pinimg.com/736x/5c/85/3a/5c853aa5aa92b62949ed2a5afffbf6ce.jpg';
  bismillahImg.alt = 'Bismillah ar-Rahman ar-Raheem';
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Reservation form submission
  const reservationForm = document.getElementById('reservationForm');
  reservationForm.addEventListener('submit', handleReservationSubmit);
  
  // Quran round selector
  const roundSelector = document.getElementById('quranRoundSelect');
  roundSelector.addEventListener('change', handleRoundChange);
  
  // Reset button in admin section
  const resetBtn = document.getElementById('resetBtn');
  resetBtn.addEventListener('click', handleReset);
  
  // Name input for admin detection
  const userNameInput = document.getElementById('userName');
  userNameInput.addEventListener('input', handleUserNameInput);
}

/**
 * Handle form submission for reserving a sipara
 * @param {Event} event - The form submission event
 */
function handleReservationSubmit(event) {
  event.preventDefault();
  
  const userName = document.getElementById('userName').value.trim();
  const siparaSelect = document.getElementById('siparaSelect');
  const siparaNumber = parseInt(siparaSelect.value, 10);
  const currentRound = getCurrentQuran();
  
  // Validate the name
  const nameValidation = validateUserName(userName);
  if (!nameValidation.isValid) {
    showNotification(nameValidation.message, 'error');
    return;
  }
  
  // Check if admin mode
  if (nameValidation.isAdmin) {
    toggleAdminControls(true);
    showNotification('Admin mode activated', 'success');
    return;
  }
  
  // Validate the sipara selection
  const siparaValidation = validateSiparaSelection(currentRound, siparaNumber);
  if (!siparaValidation.isValid) {
    showNotification(siparaValidation.message, 'error');
    return;
  }
  
  // Attempt to reserve the sipara
  const reserved = reserveSipara(currentRound, siparaNumber, userName);
  
  if (reserved) {
    showNotification(`Sipara ${siparaNumber} reserved successfully for ${userName}`, 'success');
    siparaSelect.value = '';
    refreshUI(userName);
    highlightReservedSipara(siparaNumber);
  } else {
    showNotification('Failed to reserve sipara. Please try again.', 'error');
  }
}

/**
 * Handle Quran round selection change
 * @param {Event} event - Change event
 */
function handleRoundChange(event) {
  const selectedRound = parseInt(event.target.value, 10);
  const userName = document.getElementById('userName').value.trim();
  refreshUI(userName);
}

/**
 * Handle user name input for admin detection
 * @param {Event} event - Input event
 */
function handleUserNameInput(event) {
  const userName = event.target.value.trim();
  
  if (userName === ADMIN_PASSWORD) {
    toggleAdminControls(true);
  } else {
    toggleAdminControls(false);
  }
  
  // Update UI to show completion toggle buttons for user's siparas
  refreshUI(userName);
}

/**
 * Handle resetting all data (admin function)
 */
function handleReset() {
  showConfirmationDialog(
    'Reset All Data',
    'Are you sure you want to reset all data? This will clear all reservations and reset the Quran counter. This action cannot be undone.',
    () => {
      resetAllData();
      refreshUI();
      showNotification('All data has been reset successfully!', 'success');
    }
  );
}

/**
 * Highlight a newly reserved sipara card
 * @param {number} siparaNumber - The sipara number to highlight
 */
function highlightReservedSipara(siparaNumber) {
  const card = document.getElementById(`sipara-${siparaNumber}`);
  
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('pulse');
    
    setTimeout(() => {
      card.classList.remove('pulse');
    }, 2000);
  }
}