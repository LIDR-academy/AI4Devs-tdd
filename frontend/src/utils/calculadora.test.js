// Importamos la clase Calculadora
const Calculadora = require('./calculadora');

// Conjunto de pruebas para la clase Calculadora
describe('Clase Calculadora', () => {
  // Creamos una instancia nueva para cada prueba
  let calc;
  
  // Este bloque se ejecuta antes de cada prueba
  beforeEach(() => {
    calc = new Calculadora();
  });

  // Pruebas para el método sumar
  describe('método sumar', () => {
    test('debe sumar dos números positivos correctamente', () => {
      expect(calc.sumar(2, 3)).toBe(5);
    });

    test('debe funcionar con números negativos', () => {
      expect(calc.sumar(-1, -2)).toBe(-3);
      expect(calc.sumar(-1, 5)).toBe(4);
    });
  });

  // Pruebas para el método restar
  describe('método restar', () => {
    test('debe restar dos números correctamente', () => {
      expect(calc.restar(5, 3)).toBe(2);
    });

    test('debe manejar resultados negativos', () => {
      expect(calc.restar(2, 5)).toBe(-3);
    });
  });

  // Pruebas para el método multiplicar
  describe('método multiplicar', () => {
    test('debe multiplicar dos números correctamente', () => {
      expect(calc.multiplicar(2, 3)).toBe(6);
    });

    test('debe manejar el cero correctamente', () => {
      expect(calc.multiplicar(5, 0)).toBe(0);
    });
  });

  // Pruebas para el método dividir
  describe('método dividir', () => {
    test('debe dividir dos números correctamente', () => {
      expect(calc.dividir(6, 2)).toBe(3);
    });

    test('debe lanzar error al dividir por cero', () => {
      expect(() => calc.dividir(5, 0)).toThrow('No se puede dividir por cero');
    });
  });

  // Pruebas para la memoria
  describe('funciones de memoria', () => {
    test('debe guardar y recuperar un valor de la memoria', () => {
      calc.guardarEnMemoria(10);
      expect(calc.obtenerMemoria()).toBe(10);
    });

    test('la memoria debe ser inicializada en cero', () => {
      expect(calc.obtenerMemoria()).toBe(0);
    });
  });
}); 