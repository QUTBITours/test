/**
 * Storage utility functions for handling localStorage operations
 */

/**
 * Initialize app data in localStorage if not exists
 */
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_QURAN)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_QURAN, '1');
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.QURAN_ROUNDS)) {
    localStorage.setItem(STORAGE_KEYS.QURAN_ROUNDS, JSON.stringify({
      1: {} // Initialize first Quran round
    }));
  }
}

/**
 * Get all Quran rounds data
 * @returns {Object} Object containing all Quran rounds data
 */
function getQuranRounds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_ROUNDS) || '{}');
}

/**
 * Get current Quran round number
 * @returns {number} Current Quran round number
 */
function getCurrentQuran() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_QURAN) || '1', 10);
}

/**
 * Get data for a specific Quran round
 * @param {number} roundNumber - The Quran round number
 * @returns {Object} Quran round data
 */
function getQuranRound(roundNumber) {
  const rounds = getQuranRounds();
  return rounds[roundNumber] || {};
}

/**
 * Check if a Sipara is reserved in a specific Quran round
 * @param {number} roundNumber - The Quran round number
 * @param {number} siparaNumber - The sipara number to check
 * @returns {boolean} True if the sipara is reserved
 */
function isSiparaReserved(roundNumber, siparaNumber) {
  const round = getQuranRound(roundNumber);
  return round.hasOwnProperty(siparaNumber);
}

/**
 * Get Sipara data for a specific Quran round
 * @param {number} roundNumber - The Quran round number
 * @param {number} siparaNumber - The sipara number
 * @returns {Object|null} Sipara data or null if not reserved
 */
function getSiparaData(roundNumber, siparaNumber) {
  const round = getQuranRound(roundNumber);
  return round[siparaNumber] || null;
}

/**
 * Reserve a sipara in a specific Quran round
 * @param {number} roundNumber - The Quran round number
 * @param {number} siparaNumber - The sipara number to reserve
 * @param {string} userName - Name of the user reserving the sipara
 * @returns {boolean} True if reservation was successful
 */
function reserveSipara(roundNumber, siparaNumber, userName) {
  if (!roundNumber || !siparaNumber || !userName || 
      siparaNumber < 1 || siparaNumber > TOTAL_SIPARAS) {
    return false;
  }
  
  if (isSiparaReserved(roundNumber, siparaNumber)) {
    return false;
  }
  
  const rounds = getQuranRounds();
  if (!rounds[roundNumber]) {
    rounds[roundNumber] = {};
  }
  
  rounds[roundNumber][siparaNumber] = {
    name: userName,
    complete: false
  };
  
  localStorage.setItem(STORAGE_KEYS.QURAN_ROUNDS, JSON.stringify(rounds));
  
  // Check if this round is complete and start new round if needed
  if (isQuranRoundComplete(roundNumber)) {
    startNewQuranRound();
  }
  
  return true;
}

/**
 * Toggle completion status of a sipara
 * @param {number} roundNumber - The Quran round number
 * @param {number} siparaNumber - The sipara number
 * @param {string} userName - Name of the user toggling status
 * @returns {boolean} True if status was toggled successfully
 */
function toggleSiparaComplete(roundNumber, siparaNumber, userName) {
  const rounds = getQuranRounds();
  const sipara = rounds[roundNumber]?.[siparaNumber];
  
  if (!sipara || sipara.name !== userName) {
    return false;
  }
  
  rounds[roundNumber][siparaNumber].complete = !rounds[roundNumber][siparaNumber].complete;
  localStorage.setItem(STORAGE_KEYS.QURAN_ROUNDS, JSON.stringify(rounds));
  return true;
}

/**
 * Check if a Quran round is complete (all siparas reserved)
 * @param {number} roundNumber - The Quran round number
 * @returns {boolean} True if all siparas are reserved
 */
function isQuranRoundComplete(roundNumber) {
  const round = getQuranRound(roundNumber);
  return Object.keys(round).length >= TOTAL_SIPARAS;
}

/**
 * Start a new Quran round
 */
function startNewQuranRound() {
  const currentRound = getCurrentQuran();
  const newRound = currentRound + 1;
  
  // Initialize new round
  const rounds = getQuranRounds();
  rounds[newRound] = {};
  
  localStorage.setItem(STORAGE_KEYS.QURAN_ROUNDS, JSON.stringify(rounds));
  localStorage.setItem(STORAGE_KEYS.CURRENT_QURAN, newRound.toString());
}

/**
 * Get all available Quran rounds
 * @returns {number[]} Array of round numbers
 */
function getAvailableQuranRounds() {
  const rounds = getQuranRounds();
  return Object.keys(rounds).map(Number).sort((a, b) => a - b);
}

/**
 * Reset all app data
 */
function resetAllData() {
  localStorage.setItem(STORAGE_KEYS.CURRENT_QURAN, '1');
  localStorage.setItem(STORAGE_KEYS.QURAN_ROUNDS, JSON.stringify({ 1: {} }));
}