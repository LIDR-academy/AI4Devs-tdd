// Importamos las funciones matemáticas
const { suma, resta, multiplicacion, division } = require('./mathUtils');

describe('Pruebas de funciones matemáticas', () => {
  describe('suma', () => {
    test('debería sumar dos números positivos correctamente', () => {
      expect(suma(2, 3)).toBe(5);
    });

    test('debería manejar números negativos', () => {
      expect(suma(-1, -2)).toBe(-3);
      expect(suma(-1, 5)).toBe(4);
    });

    test('debería manejar ceros', () => {
      expect(suma(0, 0)).toBe(0);
      expect(suma(0, 5)).toBe(5);
    });
  });

  describe('resta', () => {
    test('debería restar dos números correctamente', () => {
      expect(resta(5, 3)).toBe(2);
    });

    test('debería manejar números negativos', () => {
      expect(resta(-1, -2)).toBe(1);
      expect(resta(-1, 5)).toBe(-6);
    });

    test('debería manejar ceros', () => {
      expect(resta(0, 0)).toBe(0);
      expect(resta(5, 0)).toBe(5);
    });
  });

  describe('multiplicacion', () => {
    test('debería multiplicar dos números correctamente', () => {
      expect(multiplicacion(2, 3)).toBe(6);
    });

    test('debería manejar números negativos', () => {
      expect(multiplicacion(-2, 3)).toBe(-6);
      expect(multiplicacion(-2, -3)).toBe(6);
    });

    test('debería manejar ceros', () => {
      expect(multiplicacion(0, 5)).toBe(0);
      expect(multiplicacion(5, 0)).toBe(0);
    });
  });

  describe('division', () => {
    test('debería dividir dos números correctamente', () => {
      expect(division(6, 3)).toBe(2);
      expect(division(5, 2)).toBe(2.5);
    });

    test('debería manejar números negativos', () => {
      expect(division(-6, 3)).toBe(-2);
      expect(division(-6, -3)).toBe(2);
    });

    test('debería lanzar un error al dividir por cero', () => {
      expect(() => division(5, 0)).toThrow('No se puede dividir por cero');
    });
  });
}); 