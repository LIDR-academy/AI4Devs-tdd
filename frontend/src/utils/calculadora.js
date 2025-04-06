// Clase Calculadora con múltiples operaciones matemáticas
class Calculadora {
  // Constructor para inicializar la memoria
  constructor() {
    this.memoria = 0;
  }

  // Método para sumar dos números
  sumar(a, b) {
    return a + b;
  }

  // Método para restar dos números
  restar(a, b) {
    return a - b;
  }

  // Método para multiplicar dos números
  multiplicar(a, b) {
    return a * b;
  }

  // Método para dividir dos números (con validación)
  dividir(a, b) {
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return a / b;
  }

  // Método para guardar un valor en memoria
  guardarEnMemoria(valor) {
    this.memoria = valor;
    return this.memoria;
  }

  // Método para obtener el valor en memoria
  obtenerMemoria() {
    return this.memoria;
  }
}

module.exports = Calculadora; // Exportamos la clase 