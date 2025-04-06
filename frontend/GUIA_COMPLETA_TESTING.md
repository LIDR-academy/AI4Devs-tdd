# Guía Completa de Testing con Jest para React

## Motivación

El testing es un componente esencial en el ciclo de desarrollo de software moderno. Implementar pruebas unitarias nos permite verificar que cada componente de nuestra aplicación funciona correctamente de manera aislada, lo que facilita la detección temprana de errores, mejora la calidad del código y simplifica el mantenimiento a largo plazo.

A través de esta guía, aprenderás a configurar y utilizar Jest para probar aplicaciones React, entendiendo los desafíos comunes y cómo superarlos.

## Tabla de Contenido

1. [Introducción](#introducción)
2. [Fundamentos del Testing](#fundamentos-del-testing)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Estructura de Pruebas](#estructura-de-pruebas)
5. [Tipos de Pruebas Implementadas](#tipos-de-pruebas-implementadas)
   - [Pruebas de Funciones Utilitarias Simples](#pruebas-de-funciones-utilitarias-simples)
   - [Pruebas de Clases Utilitarias](#pruebas-de-clases-utilitarias)
   - [Pruebas de Servicios](#pruebas-de-servicios)
   - [Pruebas de Componentes React](#pruebas-de-componentes-react)
6. [Desarrollo Dirigido por Pruebas (TDD)](#desarrollo-dirigido-por-pruebas-tdd)
7. [Mocking en Pruebas](#mocking-en-pruebas)
8. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
9. [Ejecución de Pruebas](#ejecución-de-pruebas)
10. [Buenas Prácticas](#buenas-prácticas)
11. [Recursos Adicionales](#recursos-adicionales)

## Introducción

Jest es un framework de testing desarrollado por Facebook que se integra perfectamente con aplicaciones React. Su enfoque "zero configuration" (configuración cero) hace que sea fácil comenzar, pero también es altamente configurable para adaptarse a proyectos complejos.

En esta guía, abordaremos cómo implementar pruebas unitarias efectivas para aplicaciones React utilizando Jest, desde la configuración inicial hasta la implementación de pruebas para diferentes tipos de componentes y funcionalidades.

## Fundamentos del Testing

Antes de sumergirnos en los detalles técnicos, es importante entender los conceptos básicos:

- **Prueba Unitaria**: Verifica que una unidad individual de código (como una función o componente) funcione correctamente de forma aislada.
- **Aserciones (Assertions)**: Declaraciones que verifican si un valor cumple con ciertas condiciones.
- **Mocking**: Técnica para simular dependencias externas durante las pruebas.
- **Cobertura de Código**: Métrica que mide qué porcentaje del código está cubierto por pruebas.

### Anatomía de una Prueba Jest

Una prueba básica en Jest tiene la siguiente estructura:

```javascript
describe('Módulo o componente a probar', () => {
  // Configuración que se ejecuta antes de cada prueba
  beforeEach(() => {
    // Código de configuración
  });

  // Una prueba individual
  test('descripción de lo que se está probando', () => {
    // Preparación
    const valorEsperado = 'resultado esperado';
    
    // Ejecución
    const resultadoReal = miFuncion();
    
    // Verificación
    expect(resultadoReal).toBe(valorEsperado);
  });
});
```

## Configuración del Entorno

Para configurar Jest en un proyecto React, hemos seguido estos pasos:

### 1. Instalación de Dependencias

```bash
npm install --save-dev jest jest-environment-jsdom @babel/preset-env @babel/preset-react babel-jest
```

### 2. Configuración de Jest (jest.config.js)

Para pruebas simples de funciones utilitarias, podemos utilizar un entorno de Node:

```javascript
module.exports = {
  testEnvironment: 'node'
};
```

Para pruebas que requieren un entorno DOM (como componentes React), utilizamos:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  }
};
```

### 3. Configuración de Babel (babel.config.js)

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
};
```

### 4. Actualización del package.json

```json
"scripts": {
  "test": "jest"
}
```

## Estructura de Pruebas

Una estructura de carpetas bien organizada facilita la gestión de las pruebas:

```
src/
  ├── utils/
  │   ├── suma.js
  │   ├── suma.test.js
  │   ├── resta.js
  │   ├── resta.test.js
  │   ├── calculadora.js
  │   └── calculadora.test.js
  ├── services/
  │   ├── candidateService.js
  │   └── candidateService.test.js
  └── components/
      ├── RecruiterDashboard.js
      └── RecruiterDashboard.test.js
```

Existen dos enfoques principales para organizar las pruebas:

1. **Archivos de prueba junto al código**: `component.js` y `component.test.js` en la misma carpeta.
2. **Carpeta `__tests__`**: Todos los archivos de prueba dentro de una carpeta `__tests__` dentro de cada módulo.

En nuestro proyecto, hemos optado por el primer enfoque para mantener la simplicidad.

## Tipos de Pruebas Implementadas

### Pruebas de Funciones Utilitarias Simples

Las funciones utilitarias son funciones puras que toman entradas y producen salidas sin efectos secundarios, lo que las hace ideales para comenzar con pruebas unitarias.

#### Ejemplo: Prueba para función suma

```javascript
// suma.js
function suma(a, b) {
  return a + b;
}

module.exports = suma;
```

```javascript
// suma.test.js
const suma = require('./suma');

test('suma 1 + 2 para obtener 3', () => {
  const resultado = suma(1, 2);
  expect(resultado).toBe(3);
});
```

#### Ejemplo: Prueba para función resta

```javascript
// resta.js
function resta(a, b) {
  return a - b;
}

module.exports = resta;
```

```javascript
// resta.test.js
const resta = require('./resta');

test('resta 5 - 3 para obtener 2', () => {
  const resultado = resta(5, 3);
  expect(resultado).toBe(2);
});

test('resta con números negativos', () => {
  expect(resta(2, 5)).toBe(-3);
  expect(resta(-1, -3)).toBe(2);
});
```

### Pruebas de Clases Utilitarias

También es importante probar clases más complejas que pueden tener múltiples métodos y mantener estado.

#### Ejemplo: Pruebas para la clase Calculadora

```javascript
// calculadora.js
class Calculadora {
  constructor() {
    this.memoria = 0;
  }

  sumar(a, b) {
    return a + b;
  }

  restar(a, b) {
    return a - b;
  }

  multiplicar(a, b) {
    return a * b;
  }

  dividir(a, b) {
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return a / b;
  }

  guardarEnMemoria(valor) {
    this.memoria = valor;
    return this.memoria;
  }

  obtenerMemoria() {
    return this.memoria;
  }
}

module.exports = Calculadora;
```

```javascript
// calculadora.test.js
const Calculadora = require('./calculadora');

describe('Clase Calculadora', () => {
  let calc;
  
  beforeEach(() => {
    calc = new Calculadora();
  });

  describe('método sumar', () => {
    test('debe sumar dos números positivos correctamente', () => {
      expect(calc.sumar(2, 3)).toBe(5);
    });

    test('debe funcionar con números negativos', () => {
      expect(calc.sumar(-1, -2)).toBe(-3);
      expect(calc.sumar(-1, 5)).toBe(4);
    });
  });

  describe('método restar', () => {
    test('debe restar dos números correctamente', () => {
      expect(calc.restar(5, 3)).toBe(2);
    });

    test('debe manejar resultados negativos', () => {
      expect(calc.restar(2, 5)).toBe(-3);
    });
  });

  describe('método multiplicar', () => {
    test('debe multiplicar dos números correctamente', () => {
      expect(calc.multiplicar(2, 3)).toBe(6);
    });

    test('debe manejar el cero correctamente', () => {
      expect(calc.multiplicar(5, 0)).toBe(0);
    });
  });

  describe('método dividir', () => {
    test('debe dividir dos números correctamente', () => {
      expect(calc.dividir(6, 2)).toBe(3);
    });

    test('debe lanzar error al dividir por cero', () => {
      expect(() => calc.dividir(5, 0)).toThrow('No se puede dividir por cero');
    });
  });

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
```

### Pruebas de Servicios

Los servicios suelen implicar llamadas a APIs externas, por lo que es importante mockear estas dependencias para aislar nuestras pruebas.

#### Ejemplo: Pruebas para un servicio de candidatos

```javascript
// candidateService.js
const axios = require('axios');

const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3010/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al subir el archivo:', error.response.data);
  }
};

const sendCandidateData = async (candidateData) => {
  try {
    const response = await axios.post('http://localhost:3010/candidates', candidateData);
    return response.data;
  } catch (error) {
    throw new Error('Error al enviar datos del candidato:', error.response.data);
  }
};

module.exports = { uploadCV, sendCandidateData };
```

```javascript
// candidateService.test.js
const axios = require('axios');
const { uploadCV, sendCandidateData } = require('../candidateService');

jest.mock('axios');

describe('Pruebas del servicio de candidatos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadCV', () => {
    test('debería subir un archivo CV correctamente', async () => {
      const mockResponse = { data: { filePath: 'uploads/cv.pdf', fileType: 'application/pdf' } };
      axios.post.mockResolvedValue(mockResponse);

      const mockFile = new File(['contenido del archivo'], 'cv.pdf', { type: 'application/pdf' });
      const result = await uploadCV(mockFile);

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('sendCandidateData', () => {
    test('debería enviar datos del candidato correctamente', async () => {
      const mockResponse = { data: { id: 1, name: 'Juan Pérez' } };
      axios.post.mockResolvedValue(mockResponse);

      const candidateData = { name: 'Juan Pérez', email: 'juan@example.com' };
      const result = await sendCandidateData(candidateData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/candidates',
        candidateData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

### Pruebas de Componentes React

Para probar componentes React, utilizamos React Testing Library, que nos permite probar los componentes desde la perspectiva del usuario.

#### Ejemplo: Pruebas para un formulario simple

```javascript
// SimpleForm.js
const React = require('react');
const { useState } = require('react');

const SimpleForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }
    
    setError('');
    onSubmit({ name, email });
    setName('');
    setEmail('');
  };

  return (
    <div className="simple-form">
      <h2>Formulario de Contacto</h2>
      
      {error && <div className="error-message" data-testid="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="name-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
          />
        </div>
        
        <button type="submit" data-testid="submit-button">
          Enviar
        </button>
      </form>
    </div>
  );
};

module.exports = SimpleForm;
```

```javascript
// SimpleForm.test.js
const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const SimpleForm = require('../SimpleForm');

describe('Pruebas del componente SimpleForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('debería renderizar el formulario correctamente', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Formulario de Contacto')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  test('debería mostrar error cuando los campos están vacíos', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('Todos los campos son obligatorios');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('debería enviar el formulario correctamente con datos válidos', async () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    const testName = 'María García';
    const testEmail = 'maria@ejemplo.com';
    
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: testName } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: testEmail } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: testName, email: testEmail });
    
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
    });
  });
});
```

## Desarrollo Dirigido por Pruebas (TDD)

En nuestro proyecto, hemos seguido el enfoque de Desarrollo Dirigido por Pruebas (TDD) para implementar las funciones y clases utilitarias. TDD sigue un ciclo simple:

1. **Rojo**: Escribir una prueba que falle
2. **Verde**: Escribir el código más simple que haga pasar la prueba
3. **Refactorizar**: Mejorar el código manteniendo las pruebas en verde

### Ejemplo de TDD con la función resta

Primero, escribimos la prueba:

```javascript
// resta.test.js
const resta = require('./resta');

test('resta 5 - 3 para obtener 2', () => {
  const resultado = resta(5, 3);
  expect(resultado).toBe(2);
});
```

Ejecutamos la prueba, que falla porque la función `resta` no existe.

Luego, implementamos la función más simple que haga pasar la prueba:

```javascript
// resta.js
function resta(a, b) {
  return a - b;
}

module.exports = resta;
```

Ejecutamos la prueba nuevamente, y ahora pasa.

Finalmente, añadimos más casos de prueba para cubrir más escenarios:

```javascript
// resta.test.js (ampliado)
const resta = require('./resta');

test('resta 5 - 3 para obtener 2', () => {
  const resultado = resta(5, 3);
  expect(resultado).toBe(2);
});

test('resta con números negativos', () => {
  expect(resta(2, 5)).toBe(-3);
  expect(resta(-1, -3)).toBe(2);
});
```

### Beneficios del TDD

- **Diseño enfocado**: Al escribir primero las pruebas, nos enfocamos en la interfaz de la función antes de su implementación.
- **Cobertura completa**: Cada línea de código existe para hacer pasar una prueba.
- **Confianza en los cambios**: Las pruebas actúan como una red de seguridad para refactorizaciones futuras.
- **Documentación viviente**: Las pruebas documentan cómo se espera que funcione el código.

## Mocking en Pruebas

El mocking es una técnica esencial para aislar el código que estamos probando de sus dependencias externas. Hay varios tipos de mocks que podemos utilizar:

### 1. Mocking de Módulos

Jest permite mockear módulos completos:

```javascript
jest.mock('axios');
```

### 2. Mocking de Funciones Específicas

Podemos crear funciones mock para simular comportamientos específicos:

```javascript
const mockFunction = jest.fn();
mockFunction.mockReturnValue('valor simulado');
// o para funciones asíncronas
mockFunction.mockResolvedValue('valor simulado');
mockFunction.mockRejectedValue(new Error('error simulado'));
```

### 3. Mocking de Recursos Estáticos

Para recursos como imágenes o estilos CSS:

```javascript
jest.mock('../../assets/logo.png', () => 'ruta-mock-logo');
```

### 4. Spy en Funciones Existentes

Para observar si una función fue llamada sin modificar su implementación:

```javascript
jest.spyOn(objeto, 'método');
```

## Solución de Problemas Comunes

Durante la implementación de pruebas en nuestro proyecto, encontramos varios desafíos:

### 1. Entorno de Pruebas para React

Para las pruebas de componentes React, es necesario utilizar el entorno `jsdom` que simula un navegador. Sin embargo, para pruebas de funciones utilitarias, el entorno `node` es más ligero y rápido.

Solución: Configurar `jest.config.js` para usar el entorno apropiado según el tipo de prueba:

```javascript
module.exports = {
  testEnvironment: 'node' // Para pruebas de funciones utilitarias
};
```

### 2. Importación de Módulos

Jest utiliza Node.js, por lo que es importante asegurarse de que el formato de importación/exportación sea compatible.

Solución: Utilizar la sintaxis de CommonJS para pruebas básicas:

```javascript
// Exportar
module.exports = miFuncion;

// Importar
const miFuncion = require('./miFuncion');
```

### 3. Manejo de Errores

Para probar funciones que lanzan errores, es necesario usar una sintaxis especial:

```javascript
test('debe lanzar error al dividir por cero', () => {
  expect(() => calculadora.dividir(5, 0)).toThrow('No se puede dividir por cero');
});
```

## Ejecución de Pruebas

Para ejecutar todas las pruebas del proyecto:

```bash
npm test
```

Para ejecutar una prueba específica:

```bash
npx jest path/to/test.js
```

Por ejemplo:

```bash
npx jest src/utils/resta.test.js
```

### Resultados de las Pruebas

Al ejecutar `npx jest src/utils/resta.test.js`, obtenemos el siguiente resultado:

```
 PASS  src/utils/resta.test.js
  √ resta 5 - 3 para obtener 2 (6 ms)
  √ resta con números negativos (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.095 s
```

Este output nos indica que todas las pruebas han pasado exitosamente.

## Buenas Prácticas

1. **Organización**: Mantener las pruebas junto al código que prueban, en archivos `.test.js`.
2. **Nombres descriptivos**: Usar nombres descriptivos para las pruebas que indiquen claramente qué se está probando.
3. **Pruebas independientes**: Cada prueba debe ser independiente y no depender del estado de otras pruebas.
4. **Estructura clara**: Usar `describe` para agrupar pruebas relacionadas y `test` (o `it`) para casos individuales.
5. **Aserción específica**: Cada prueba debería tener un propósito claro y verificar una sola cosa.
6. **TDD cuando sea posible**: Seguir el ciclo de rojo-verde-refactorizar para desarrollar código con pruebas desde el principio.
7. **Simplicidad**: Comenzar con pruebas simples de funciones utilitarias antes de avanzar a componentes más complejos.

## Recursos Adicionales

- [Documentación oficial de Jest](https://jestjs.io/es-ES/docs/getting-started)
- [Jest CLI Options](https://jestjs.io/docs/cli)
- [Jest Matchers](https://jestjs.io/docs/using-matchers)
- [Ejemplo de Jest con React](https://jestjs.io/docs/tutorial-react)
- [Guía de TDD por Martin Fowler](https://martinfowler.com/articles/is-tdd-dead/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 