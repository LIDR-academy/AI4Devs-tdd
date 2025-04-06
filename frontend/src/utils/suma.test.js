// Importamos la función suma
const suma = require('./suma');

// Grupo de pruebas para la función suma
test('suma 1 + 2 para obtener 3', () => {
  // Ejecutamos la función con valores de prueba
  const resultado = suma(1, 2);
  // Verificamos que el resultado sea el esperado
  expect(resultado).toBe(3);
}); 