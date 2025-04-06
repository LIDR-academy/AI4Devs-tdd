/**
 * Valida los datos del candidato antes de guardarlos en la base de datos
 * @param {Object} candidateData - Datos del candidato a validar
 * @throws {Error} - Si alguno de los datos no cumple con las validaciones
 */
function validateCandidateData(candidateData) {
  // Validar nombre
  if (!candidateData.firstName || !isValidName(candidateData.firstName)) {
    throw new Error('Invalid name');
  }
  
  // Validar apellido
  if (!candidateData.lastName || !isValidName(candidateData.lastName)) {
    throw new Error('Invalid lastName');
  }
  
  // Validar email
  if (!candidateData.email || !isValidEmail(candidateData.email)) {
    throw new Error('Invalid email');
  }
  
  // Validar teléfono
  if (!candidateData.phone || !isValidPhone(candidateData.phone)) {
    throw new Error('Invalid phone');
  }
  
  // Validar educación (si existe)
  if (candidateData.educations && candidateData.educations.length > 0) {
    candidateData.educations.forEach(education => {
      validateEducation(education);
    });
  }
  
  // Validar experiencia laboral (si existe)
  if (candidateData.workExperiences && candidateData.workExperiences.length > 0) {
    candidateData.workExperiences.forEach(experience => {
      validateWorkExperience(experience);
    });
  }
  
  // Validar CV (si existe)
  if (candidateData.cv) {
    validateCV(candidateData.cv);
  }
}

/**
 * Valida que el nombre contenga solo letras y espacios
 * @param {string} name - Nombre a validar
 * @returns {boolean} - true si el nombre es válido
 */
function isValidName(name) {
  // Permite letras, espacios y caracteres acentuados comunes en español
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return nameRegex.test(name);
}

/**
 * Valida que el email tenga un formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que el teléfono tenga un formato correcto
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si el teléfono es válido
 */
function isValidPhone(phone) {
  // Permite números de teléfono españoles (9 dígitos)
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Valida los datos de educación
 * @param {Object} education - Datos de educación a validar
 * @throws {Error} - Si los datos de educación no son válidos
 */
function validateEducation(education) {
  if (!education.institution || !isValidName(education.institution)) {
    throw new Error('Invalid institution name');
  }
  
  if (!education.title) {
    throw new Error('Invalid title');
  }
  
  if (!education.startDate || !isValidDate(education.startDate)) {
    throw new Error('Invalid date');
  }
  
  if (education.endDate && !isValidDate(education.endDate)) {
    throw new Error('Invalid date');
  }
  
  // Validar que la fecha de inicio sea anterior a la fecha de fin
  if (education.endDate && new Date(education.startDate) > new Date(education.endDate)) {
    throw new Error('Start date cannot be after end date');
  }
}

/**
 * Valida los datos de experiencia laboral
 * @param {Object} experience - Datos de experiencia a validar
 * @throws {Error} - Si los datos de experiencia no son válidos
 */
function validateWorkExperience(experience) {
  if (!experience.company) {
    throw new Error('Invalid company name');
  }
  
  if (!experience.position) {
    throw new Error('Invalid position');
  }
  
  if (!experience.startDate || !isValidDate(experience.startDate)) {
    throw new Error('Invalid date');
  }
  
  if (experience.endDate && !isValidDate(experience.endDate)) {
    throw new Error('Invalid date');
  }
  
  // Validar que la fecha de inicio sea anterior a la fecha de fin
  if (experience.endDate && new Date(experience.startDate) > new Date(experience.endDate)) {
    throw new Error('Start date cannot be after end date');
  }
}

/**
 * Valida los datos del CV
 * @param {Object} cv - Datos del CV a validar
 * @throws {Error} - Si los datos del CV no son válidos
 */
function validateCV(cv) {
  if (!cv.filePath) {
    throw new Error('Invalid CV file path');
  }
  
  if (!cv.fileType) {
    throw new Error('Invalid CV file type');
  }
  
  // Validar que el tipo de archivo sea permitido (PDF, DOCX, etc.)
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(cv.fileType)) {
    throw new Error('Invalid CV file type. Only PDF and Word documents are allowed');
  }
}

/**
 * Valida que la fecha tenga un formato correcto (YYYY-MM-DD)
 * @param {string} dateString - Fecha a validar
 * @returns {boolean} - true si la fecha es válida
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  
  // Verificar que la fecha es válida
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Verificar que el formato es YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  // Verificar que los componentes de la fecha son válidos
  const parts = dateString.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }
  
  return true;
}

module.exports = {
  validateCandidateData
}; 