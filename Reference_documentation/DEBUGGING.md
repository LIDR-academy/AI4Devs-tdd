# Guía de Solución de Problemas con Jest

Este documento contiene una lista de problemas comunes encontrados durante la configuración y ejecución de pruebas con Jest en nuestro proyecto React, junto con sus soluciones.

## Problemas Comunes

### 1. No se puede usar sintaxis JSX

**Síntoma**: Error `SyntaxError: Support for the experimental syntax 'jsx' isn't currently enabled`

**Solución**: Configurar Babel correctamente para soportar JSX:

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
```

### 2. No se pueden usar importaciones ES Modules

**Síntoma**: Error `SyntaxError: Cannot use import statement outside a module`

**Solución**: Usar sintaxis CommonJS para las pruebas:

```javascript
// Cambiar de:
import { suma } from '../utils/suma';

// A:
const suma = require('../utils/suma');
```

### 3. No se encuentra un módulo

**Síntoma**: Error `Cannot find module './archivo'`

**Solución**: 
- Asegurarse de que el archivo existe y la ruta es correcta.
- Verificar que la estructura de carpetas coincide con las importaciones.
- Si es un módulo npm, asegurarse de que está instalado correctamente con `npm install nombre-del-modulo`.

### 4. Problemas con archivos CSS e imágenes

**Síntoma**: Error al intentar importar archivos no JavaScript como CSS o imágenes.

**Solución**: Configurar moduleNameMapper en jest.config.js:

```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  }
};
```

Y crear los archivos mock correspondientes:

```javascript
// src/__mocks__/styleMock.js
module.exports = {};

// src/__mocks__/fileMock.js
module.exports = 'test-file-stub';
```

### 5. Entorno de prueba incorrecto

**Síntoma**: 
- Errores relacionados con el DOM cuando se prueban componentes React
- Para pruebas de funciones utilitarias, se carga innecesariamente el entorno DOM

**Solución**: 
- Para componentes React, usar el entorno jsdom:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom'
};
```

- Para funciones utilitarias simples, usar el entorno node para mayor velocidad:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node'
};
```

### 6. Dependencias faltantes

**Síntoma**: Error `Cannot find module 'lodash/sortBy'` u otros módulos de terceros.

**Solución**: Instalar la dependencia faltante:

```bash
npm install --save-dev lodash
```

### 7. Problemas con la sintaxis de pruebas para excepciones

**Síntoma**: No se capturan correctamente las excepciones en las pruebas

**Solución**: Usar la sintaxis correcta para probar excepciones:

```javascript
// Incorrecto:
test('debe lanzar error al dividir por cero', () => {
  expect(calculadora.dividir(5, 0)).toThrow();
});

// Correcto:
test('debe lanzar error al dividir por cero', () => {
  expect(() => calculadora.dividir(5, 0)).toThrow('No se puede dividir por cero');
});
```

### 8. Problemas con beforeEach y afterEach

**Síntoma**: Estado inconsistente entre pruebas

**Solución**: Usar correctamente los ganchos de ciclo de vida de Jest:

```javascript
describe('Clase Calculadora', () => {
  let calc;
  
  // Se ejecuta antes de cada prueba
  beforeEach(() => {
    calc = new Calculadora();
  });
  
  // Se ejecuta después de cada prueba
  afterEach(() => {
    // Limpiar cualquier estado o mock
    jest.clearAllMocks();
  });
  
  // Pruebas...
});
```

## Soluciones específicas para nuestro proyecto

### Pruebas de funciones utilitarias simples

Para las pruebas de funciones utilitarias simples (como `suma.js` y `resta.js`), hemos configurado Jest con el entorno de Node para mayor eficiencia:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node'
};
```

Los archivos de prueba utilizan la sintaxis de CommonJS para la importación y exportación:

```javascript
// suma.js
function suma(a, b) {
  return a + b;
}

module.exports = suma;

// suma.test.js
const suma = require('./suma');

test('suma 1 + 2 para obtener 3', () => {
  const resultado = suma(1, 2);
  expect(resultado).toBe(3);
});
```

### Ejecución selectiva de pruebas

Durante el desarrollo, es útil ejecutar solo un conjunto específico de pruebas en lugar de toda la suite. Esto se puede hacer con:

```bash
npx jest src/utils/resta.test.js
```

### Enfoque incremental

Para resolver los problemas de configuración, hemos seguido un enfoque incremental:

1. Comenzar con pruebas muy simples (una función de suma básica)
2. Verificar que las pruebas simples funcionan correctamente
3. Gradualmente añadir pruebas más complejas (clases, componentes)
4. Actualizar la configuración cuando sea necesario

Este enfoque nos ha permitido identificar y resolver problemas de manera aislada, en lugar de enfrentarnos a múltiples problemas al mismo tiempo.

## Recursos para solución de problemas

- [Documentación oficial de Jest sobre solución de problemas](https://jestjs.io/docs/troubleshooting)
- [Guía de configuración de Jest](https://jestjs.io/docs/configuration)
- [Foro de discusión de problemas de Jest](https://github.com/facebook/jest/discussions)

## Soluciones para problemas con tests en TypeScript y Prisma

### 1. Problemas con TypeScript en los tests

**Síntoma**: Errores de tipado como `Cannot find module '@jest/globals'` o problemas con `any` en los mocks.

**Solución**: 
- Convertir los tests a JavaScript si la configuración de TypeScript es compleja:

```javascript
// En lugar de usar TypeScript con tipos que pueden causar conflictos:
import { jest, describe, test, expect } from '@jest/globals';

// Usar JavaScript con require:
const { validateCandidateData } = require('../application/validator');
```

- O configurar correctamente tsconfig.json para Jest:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"],
    "esModuleInterop": true
  }
}
```

### 2. Mocking de Prisma en tests

**Síntoma**: Error `TypeError: candidate.save is not a function` cuando se mockean modelos de dominio.

**Solución**: 
- Mockear Prisma directamente en lugar de usar modelos de dominio intermedios:

```javascript
// Mock de prisma 
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn().mockResolvedValue({ id: 1, firstName: 'Mock', lastName: 'User' }),
      findUnique: jest.fn().mockResolvedValue(null)
    },
    $disconnect: jest.fn()
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Luego en el servicio, usar Prisma directamente:
const savedCandidate = await prisma.candidate.create({
  data: { /* datos del candidato */ }
});
```

### 3. Problemas con fechas en Prisma

**Síntoma**: Error cuando se intenta guardar fechas en la base de datos durante los tests.

**Solución**: 
- Asegurarse de convertir correctamente las cadenas de fecha en objetos Date:

```javascript
// Correcto:
startDate: new Date(educationData.startDate),
endDate: educationData.endDate ? new Date(educationData.endDate) : null,
```

### 4. Errores al mockear comportamientos específicos en algunos tests

**Síntoma**: Los tests anteriores pasan pero un test específico falla con comportamientos inesperados.

**Solución**: 
- Mockear comportamientos específicos para cada test:

```javascript
// Al inicio del test:
const prismaClient = require('@prisma/client').PrismaClient();
// Sobrescribir el comportamiento solo para este test
prismaClient.candidate.findUnique.mockResolvedValueOnce({ id: 1, email: 'duplicado@example.com' });
```

### 5. Problemas con la configuración de Jest para detectar archivos TypeScript

**Síntoma**: Jest no encuentra o no ejecuta los archivos .ts o .tsx.

**Solución**: 
- Asegurarse de tener la configuración correcta en jest.config.js:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
```

- O simplificar usando JavaScript en su lugar:

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ]
};
```

## Enfoque para depurar tests más complejos

1. **Aislar el problema**: 
   - Crear un test simple que funcione correctamente para verificar la configuración básica.
   - Añadir poco a poco complejidad hasta identificar dónde exactamente falla.

2. **Inspeccionar los mocks**:
   - Verificar que los mocks estén devolviendo los valores esperados.
   - Usar `console.log()` para depurar los valores en tiempo de ejecución.

3. **Simplificar la arquitectura**:
   - Si los mocks son demasiado complejos, considerar simplificar la arquitectura.
   - A veces, llamar directamente a un servicio sin pasar por varias capas intermedias simplifica el testing.

4. **Uso de .mockImplementation vs .mockResolvedValue**:
   - `.mockImplementation()` para mockear todo un módulo o clase.
   - `.mockResolvedValue()` o `.mockReturnValue()` para funciones específicas. 