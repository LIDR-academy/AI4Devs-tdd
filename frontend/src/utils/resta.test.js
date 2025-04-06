// Importamos la función resta
const resta = require('./resta');

// Grupo de pruebas para la función resta
test('resta 5 - 3 para obtener 2', () => {
  // Ejecutamos la función con valores de prueba
  const resultado = resta(5, 3);
  // Verificamos que el resultado sea el esperado
  expect(resultado).toBe(2);
});

// Prueba con números negativos
test('resta con números negativos', () => {
  expect(resta(2, 5)).toBe(-3);
  expect(resta(-1, -3)).toBe(2);
}); 