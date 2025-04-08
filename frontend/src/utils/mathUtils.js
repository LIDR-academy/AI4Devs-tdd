/**
 * Suma dos números
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} La suma de a y b
 */
function suma(a, b) {
  return a + b;
}

/**
 * Resta dos números
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} La resta de a menos b
 */
function resta(a, b) {
  return a - b;
}

/**
 * Multiplica dos números
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} El producto de a y b
 */
function multiplicacion(a, b) {
  return a * b;
}

/**
 * Divide dos números
 * @param {number} a - Numerador
 * @param {number} b - Denominador
 * @returns {number} El resultado de a dividido por b
 * @throws {Error} Si b es cero
 */
function division(a, b) {
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
}

module.exports = {
  suma,
  resta,
  multiplicacion,
  division
}; 