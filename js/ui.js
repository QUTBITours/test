/**
 * UI manipulation functions
 */

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning)
 */
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  
  notificationText.textContent = message;
  notification.classList.remove('hidden');
  
  switch (type) {
    case 'error':
      notification.style.backgroundColor = 'var(--color-error)';
      break;
    case 'warning':
      notification.style.backgroundColor = 'var(--color-warning)';
      break;
    default:
      notification.style.backgroundColor = 'var(--color-success)';
  }
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, NOTIFICATION_DURATION);
}

/**
 * Show confirmation dialog
 * @param {string} title - The dialog title
 * @param {string} message - The confirmation message
 * @param {Function} onConfirm - Callback function to execute on confirmation
 */
function showConfirmationDialog(title, message, onConfirm) {
  const overlay = document.getElementById('confirmationOverlay');
  const confirmationTitle = document.getElementById('confirmationTitle');
  const confirmationText = document.getElementById('confirmationText');
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  confirmationTitle.textContent = title;
  confirmationText.textContent = message;
  overlay.classList.remove('hidden');
  
  const handleConfirm = () => {
    onConfirm();
    overlay.classList.add('hidden');
    cleanup();
  };
  
  const handleCancel = () => {
    overlay.classList.add('hidden');
    cleanup();
  };
  
  const cleanup = () => {
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
}

/**
 * Update the Quran round selector
 */
function updateQuranRoundSelector() {
  const roundSelector = document.getElementById('quranRoundSelect');
  const availableRounds = getAvailableQuranRounds();
  const currentRound = getCurrentQuran();
  
  roundSelector.innerHTML = '';
  
  availableRounds.forEach(round => {
    const option = document.createElement('option');
    option.value = round;
    option.textContent = `Quran ${round}`;
    if (round === currentRound) {
      option.selected = true;
    }
    roundSelector.appendChild(option);
  });
}

/**
 * Update the Quran round display
 */
function updateQuranRoundDisplay() {
  const currentRound = getCurrentQuran();
  const quranRoundBadge = document.getElementById('quranRoundBadge');
  
  quranRoundBadge.textContent = getOrdinalSuffix(currentRound) + ' Quran';
  quranRoundBadge.classList.add('pulse');
  
  setTimeout(() => {
    quranRoundBadge.classList.remove('pulse');
  }, 2000);
}

/**
 * Get ordinal suffix for a number
 * @param {number} number - The number to get suffix for
 * @returns {string} Number with ordinal suffix
 */
function getOrdinalSuffix(number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = number % 100;
  return number + (suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0]);
}

/**
 * Update the progress display for current Quran round
 */
function updateProgressDisplay() {
  const currentRound = getCurrentQuran();
  const round = getQuranRound(currentRound);
  const reservedCount = Object.keys(round).length;
  const completedCount = Object.values(round).filter(s => s.complete).length;
  
  document.getElementById('reservedCount').textContent = reservedCount;
  document.getElementById('completedCount').textContent = completedCount;
  
  const progressBar = document.getElementById('progressBar');
  const percentComplete = (reservedCount / TOTAL_SIPARAS) * 100;
  progressBar.style.width = percentComplete + '%';
  
  if (isQuranRoundComplete(currentRound)) {
    showCompletionSection();
  } else {
    hideCompletionSection();
  }
}

/**
 * Show the completion section
 */
function showCompletionSection() {
  const selectionSection = document.getElementById('selectionSection');
  const completionSection = document.getElementById('completionSection');
  const completionTitle = document.getElementById('completionTitle');
  const currentRound = getCurrentQuran();
  
  selectionSection.classList.add('hidden');
  completionSection.classList.remove('hidden');
  completionTitle.textContent = `${getOrdinalSuffix(currentRound)} Quran Completed!`;
  completionSection.classList.add('fade-in');
}

/**
 * Hide the completion section
 */
function hideCompletionSection() {
  const selectionSection = document.getElementById('selectionSection');
  const completionSection = document.getElementById('completionSection');
  
  selectionSection.classList.remove('hidden');
  completionSection.classList.add('hidden');
}

/**
 * Populate the Sipara dropdown
 */
function populateSiparaDropdown() {
  const siparaSelect = document.getElementById('siparaSelect');
  const currentRound = getCurrentQuran();
  const round = getQuranRound(currentRound);
  
  siparaSelect.innerHTML = '<option value="" disabled selected>Choose a Sipara</option>';
  
  for (let i = 1; i <= TOTAL_SIPARAS; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Sipara ${i}`;
    
    if (round[i]) {
      option.disabled = true;
      option.textContent += ` (Reserved by ${round[i].name})`;
    }
    
    siparaSelect.appendChild(option);
  }
}

/**
 * Update the Sipara grid display
 * @param {string} currentUserName - Name of current user for showing toggle buttons
 */
function updateSiparaGrid(currentUserName) {
  const siparaGrid = document.getElementById('siparaGrid');
  const selectedRound = parseInt(document.getElementById('quranRoundSelect').value, 10);
  const round = getQuranRound(selectedRound);
  
  siparaGrid.innerHTML = '';
  
  for (let i = 1; i <= TOTAL_SIPARAS; i++) {
    const card = document.createElement('div');
    card.className = 'sipara-card';
    card.id = `sipara-${i}`;
    
    const sipara = round[i];
    if (sipara) {
      card.classList.add('selected');
      if (sipara.complete) {
        card.classList.add('complete');
      }
    }
    
    const numberElement = document.createElement('div');
    numberElement.className = 'sipara-number';
    numberElement.textContent = i;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'sipara-name';
    nameElement.textContent = SIPARA_NAMES[i - 1] || '';
    
    const readerElement = document.createElement('div');
    readerElement.className = 'sipara-reader';
    
    if (sipara) {
      readerElement.textContent = sipara.name;
      
      // Add toggle button if this sipara belongs to current user
      if (sipara.name === currentUserName) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = `btn btn-sm ${sipara.complete ? 'btn-warning' : 'btn-success'}`;
        toggleBtn.textContent = sipara.complete ? 'Mark Incomplete' : 'Mark Complete';
        
        toggleBtn.onclick = () => {
          toggleSiparaComplete(selectedRound, i, currentUserName);
          refreshUI(currentUserName);
        };
        
        readerElement.appendChild(toggleBtn);
      }
    } else {
      readerElement.textContent = 'Available';
      readerElement.classList.add('sipara-empty');
    }
    
    card.appendChild(numberElement);
    card.appendChild(nameElement);
    card.appendChild(readerElement);
    siparaGrid.appendChild(card);
  }
}

/**
 * Toggle admin controls visibility
 * @param {boolean} show - Whether to show or hide controls
 */
function toggleAdminControls(show) {
  const adminControls = document.getElementById('adminControls');
  adminControls.classList.toggle('hidden', !show);
}

/**
 * Refresh all UI elements
 * @param {string} [currentUserName] - Name of current user
 */
function refreshUI(currentUserName = '') {
  updateQuranRoundSelector();
  updateQuranRoundDisplay();
  updateProgressDisplay();
  populateSiparaDropdown();
  updateSiparaGrid(currentUserName);
  
  // Hide admin controls by default
  toggleAdminControls(false);
  
  // Update the current year in the footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Focus on the name input if empty
  if (!currentUserName) {
    document.getElementById('userName').focus();
  }
}