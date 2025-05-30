/**
 * Form validation functions
 */

/**
 * Validate user name input
 * @param {string} userName - The user name to validate
 * @returns {Object} Validation result with isValid and message properties
 */
function validateUserName(userName) {
  if (!userName || userName.trim() === '') {
    return {
      isValid: false,
      message: 'Please enter your name'
    };
  }
  
  if (userName === ADMIN_PASSWORD) {
    return {
      isValid: true,
      isAdmin: true
    };
  }
  
  if (userName.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long'
    };
  }
  
  return {
    isValid: true,
    isAdmin: false
  };
}

/**
 * Validate sipara selection
 * @param {number} roundNumber - The Quran round number
 * @param {number|string} siparaNumber - The selected sipara number
 * @returns {Object} Validation result with isValid and message properties
 */
function validateSiparaSelection(roundNumber, siparaNumber) {
  const sipara = parseInt(siparaNumber, 10);
  
  if (isNaN(sipara) || !siparaNumber) {
    return {
      isValid: false,
      message: 'Please select a Sipara'
    };
  }
  
  if (sipara < 1 || sipara > TOTAL_SIPARAS) {
    return {
      isValid: false,
      message: `Sipara must be between 1 and ${TOTAL_SIPARAS}`
    };
  }
  
  if (isSiparaReserved(roundNumber, sipara)) {
    return {
      isValid: false,
      message: `Sipara ${sipara} is already reserved`
    };
  }
  
  return {
    isValid: true
  };
}