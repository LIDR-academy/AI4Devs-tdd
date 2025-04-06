# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Guía de Testing con Jest para Aplicaciones React

## Motivación

El testing es una parte fundamental del desarrollo de software de calidad. Implementar pruebas unitarias nos permite verificar que cada componente de nuestra aplicación funciona correctamente de manera aislada, lo que facilita la detección temprana de errores, mejora la calidad del código y simplifica el mantenimiento a largo plazo.

## Tabla de Contenido

- [Getting Started with Create React App](#getting-started-with-create-react-app)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
  - [Learn More](#learn-more)
- [Guía de Testing con Jest para Aplicaciones React](#guía-de-testing-con-jest-para-aplicaciones-react)
  - [Motivación](#motivación)
  - [Tabla de Contenido](#tabla-de-contenido)
  - [Introducción](#introducción)
  - [Objetivos](#objetivos)
  - [Configuración del Entorno](#configuración-del-entorno)
  - [Estructura de Pruebas](#estructura-de-pruebas)
  - [Tipos de Pruebas Implementadas](#tipos-de-pruebas-implementadas)
    - [Pruebas de Funciones Utilitarias](#pruebas-de-funciones-utilitarias)
  - [Ejecución de Pruebas](#ejecución-de-pruebas)
  - [Buenas Prácticas](#buenas-prácticas)
  - [Recursos Adicionales](#recursos-adicionales)

## Introducción

En este proyecto, hemos implementado pruebas unitarias utilizando Jest, un framework de testing desarrollado por Facebook que se integra perfectamente con aplicaciones React. Jest proporciona un conjunto completo de herramientas para escribir y ejecutar pruebas, incluyendo funciones de aserción, mocking, cobertura de código y más.

## Objetivos

- Garantizar el correcto funcionamiento de los componentes individuales
- Facilitar la refactorización de código sin introducir errores
- Documentar el comportamiento esperado de cada parte del sistema
- Detectar y corregir errores tempranamente en el ciclo de desarrollo

## Configuración del Entorno

Para configurar Jest en nuestro proyecto React, hemos seguido estos pasos:

1. Instalación de Jest:

```bash
npm install --save-dev jest
```

2. Creación del archivo de configuración de Jest (`jest.config.js`):

```javascript
module.exports = {
  testEnvironment: 'node'
};
```

3. Modificación del `package.json` para incluir el script de test:

```json
"scripts": {
  "test": "jest"
}
```

4. Estructura de módulos usando CommonJS para compatibilidad con Jest:

```javascript
// Exportar módulos
module.exports = { 
  suma, 
  resta 
};

// Importar módulos
const { suma, resta } = require('./archivo');
```

## Estructura de Pruebas

Organizamos nuestras pruebas siguiendo una estructura que refleja la de nuestro código fuente:

```
src/
  └── utils/
      ├── mathUtils.js
      ├── mathUtils.test.js
      ├── suma.js
      └── suma.test.js
```

Para tests sencillos, también podemos colocarlos en la raíz del proyecto:

```
/
  ├── package.json
  ├── jest.config.js
  └── prueba.test.js
```

## Tipos de Pruebas Implementadas

### Pruebas de Funciones Utilitarias

Las funciones utilitarias son ideales para empezar con pruebas unitarias ya que suelen ser funciones puras (sin efectos secundarios). Ejemplo de prueba para funciones matemáticas:

```javascript
// mathUtils.js
function suma(a, b) {
  return a + b;
}

function resta(a, b) {
  return a - b;
}

module.exports = { suma, resta };

// mathUtils.test.js
const { suma, resta } = require('./mathUtils');

describe('Pruebas de funciones matemáticas', () => {
  describe('suma', () => {
    test('debería sumar dos números positivos correctamente', () => {
      expect(suma(2, 3)).toBe(5);
    });

    test('debería manejar números negativos', () => {
      expect(suma(-1, -2)).toBe(-3);
      expect(suma(-1, 5)).toBe(4);
    });
  });

  describe('resta', () => {
    test('debería restar dos números correctamente', () => {
      expect(resta(5, 3)).toBe(2);
    });
  });
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
npx jest src/utils/mathUtils.test.js
```

## Buenas Prácticas

1. **Organización**: Mantener las pruebas junto al código que prueban, en archivos `.test.js`.
2. **Nombres descriptivos**: Usar nombres descriptivos para las pruebas que indiquen claramente qué se está probando.
3. **Pruebas independientes**: Cada prueba debe ser independiente y no depender del estado de otras pruebas.
4. **Estructura clara**: Usar `describe` para agrupar pruebas relacionadas y `test` (o `it`) para casos individuales.
5. **Aserción específica**: Cada prueba debería tener un propósito claro y verificar una sola cosa.

## Recursos Adicionales

- [Documentación oficial de Jest](https://jestjs.io/es-ES/docs/getting-started)
- [Jest CLI Options](https://jestjs.io/docs/cli)
- [Jest Matchers](https://jestjs.io/docs/using-matchers)
- [Ejemplo de Jest con React](https://jestjs.io/docs/tutorial-react)
