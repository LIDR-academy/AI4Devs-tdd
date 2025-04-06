# LTI - Talent Tracking System | ENG

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is set up with Create React App, and the backend is written in TypeScript.

## Explanation of Directories and Files

- `backend/`: It contains the server-side code written in Node.js.
  - `src/`: It contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: It contains the application logic.
    - `domain/`: It contains the business logic.
    - `presentation/`: It contains code related to the presentation layer (such as controllers).
    - `routes/`: It contains the route definitions for the API.
  - `prisma/`: It contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: It contains the client-side code written in React.
  - `src/`: It contains the source code for the frontend.
  - `public/`: It contains static files such as the HTML file and images.
  - `build/`: It contains the production-ready build of the frontend.
- `.env`: It contains the environment variables.
- `docker-compose.yml`: It contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: frontend and backend.

### Frontend

The frontend is a React application, and its main files are located in the src folder. The public folder contains static assets, and the build directory contains the production build of the application.

### Backend

The backend is an Express application written in TypeScript. The src directory contains the source code, divided into several subdirectories:

- `application`: It contains the application logic.
- `domain`: It contains the domain models.
- `infrastructure`: It contains code related to the infrastructure.
- `presentation`: It contains code related to the presentation layer.
- `routes`: It contains the application routes.
- `tests`: It contains the application tests.

The `prisma` folder contains the Prisma schema.

## First Steps

To get started with this project, follow these steps:

1. Clone the repo.
2. Install the dependencies for front end and back end:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Build the back end server:
```
cd backend
npm run build
```
4. Start the backend server:
```
cd backend
npm start
```
5. In a new terminal window, build the frontend server:
```
cd frontend
npm run build
```
6. Start the frontend server:
```
cd frontend
npm start
```

The backend server will be running at http://localhost:3010, and the frontend will be available at http://localhost:3000.

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

Install Docker on your machine if you haven't done so already. You can download it from here.
Navigate to the root directory of the project in your terminal.
Run the following command to start the Docker container:
```
docker-compose up -d
```
This will start a PostgreSQL database in a Docker container. The -d flag runs the container in detached mode, which means it runs in the background.

To access the PostgreSQL database, you can use any PostgreSQL client with the following connection details:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Please replace User, Password, and Database with the actual username, password, and database name specified in your .env file.

To stop the Docker container, run the following command:
```
docker-compose down
```

To generate the database using Prisma, follow these steps:

1. Make sure that the `.env` file in the root directory of the backend contains the `DATABASE_URL` variable with the correct connection string to your PostgreSQL database. If it doesn't work, try replacing the full URL directly in `schema.prisma`, in the `url` variable.

2. Open a terminal and navigate to the backend directory where the `schema.prisma` file is located.

3. Run the following command to apply the migrations to your database:
```
npx prisma migrate dev
```

Once you have completed all the steps, you should be able to save new candidates, both via the web and via the API, and see them in the database.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```

# Guía de Testing con Jest para Aplicaciones React

## Motivación

El testing es una parte fundamental del desarrollo de software de calidad. Implementar pruebas unitarias nos permite verificar que cada componente de nuestra aplicación funciona correctamente de manera aislada, lo que facilita la detección temprana de errores, mejora la calidad del código y simplifica el mantenimiento a largo plazo.

## Tabla de Contenido

- [LTI - Talent Tracking System | ENG](#lti---talent-tracking-system--eng)
  - [Explanation of Directories and Files](#explanation-of-directories-and-files)
  - [Project Structure](#project-structure)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [First Steps](#first-steps)
  - [Docker y PostgreSQL](#docker-y-postgresql)
- [Guía de Testing con Jest para Aplicaciones React](#guía-de-testing-con-jest-para-aplicaciones-react)
  - [Motivación](#motivación)
  - [Tabla de Contenido](#tabla-de-contenido)
  - [Introducción](#introducción)
  - [Objetivos](#objetivos)
  - [Configuración del Entorno](#configuración-del-entorno)
  - [Estructura de Pruebas](#estructura-de-pruebas)
  - [Tipos de Pruebas Implementadas](#tipos-de-pruebas-implementadas)
    - [Pruebas de Funciones Utilitarias](#pruebas-de-funciones-utilitarias)
    - [Pruebas de Servicios](#pruebas-de-servicios)
    - [Pruebas de Componentes React](#pruebas-de-componentes-react)
  - [Mocking](#mocking)
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

Para configurar Jest en nuestro proyecto React con TypeScript, hemos seguido estos pasos:

1. Instalación de dependencias necesarias:

```bash
npm install --save-dev jest ts-jest @types/jest @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

2. Creación del archivo de configuración de Jest (`jest.config.js`):

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // Para manejar importaciones de archivos CSS/imágenes
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

3. Configuración de Babel (`babel.config.js`):

```javascript
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};
```

4. Creación de archivos mock para archivos estáticos:

```javascript
// src/__mocks__/fileMock.js
module.exports = 'test-file-stub';

// src/__mocks__/styleMock.js
module.exports = {};
```

5. Configuración del archivo `setupTests.js` para extender las capacidades de Jest:

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
```

## Estructura de Pruebas

Organizamos nuestras pruebas siguiendo una estructura que refleja la de nuestro código fuente:

```
src/
  ├── components/
  │   ├── __tests__/
  │   │   ├── RecruiterDashboard.test.js
  │   │   └── SimpleForm.test.js
  │   ├── RecruiterDashboard.js
  │   └── SimpleForm.js
  ├── services/
  │   ├── __tests__/
  │   │   └── candidateService.test.js
  │   └── candidateService.js
  └── utils/
      ├── __tests__/
      │   └── mathUtils.test.js
      └── mathUtils.js
```

Esta estructura facilita la navegación y mantiene una clara asociación entre el código y sus pruebas.

## Tipos de Pruebas Implementadas

### Pruebas de Funciones Utilitarias

Las funciones utilitarias son ideales para empezar con pruebas unitarias ya que suelen ser funciones puras (sin efectos secundarios). Ejemplo de prueba para una función de suma:

```javascript
// mathUtils.js
export const suma = (a, b) => {
  return a + b;
};

// mathUtils.test.js
import { suma } from '../mathUtils';

describe('suma', () => {
  it('debería sumar dos números positivos correctamente', () => {
    expect(suma(2, 3)).toBe(5);
  });

  it('debería manejar números negativos', () => {
    expect(suma(-1, -2)).toBe(-3);
    expect(suma(-1, 5)).toBe(4);
  });

  it('debería manejar ceros', () => {
    expect(suma(0, 0)).toBe(0);
    expect(suma(0, 5)).toBe(5);
  });
});
```

### Pruebas de Servicios

Para las funciones que realizan llamadas a API, utilizamos mocks para simular las respuestas:

```javascript
// candidateService.test.js
import axios from 'axios';
import { sendCandidateData } from '../candidateService';

jest.mock('axios');

describe('sendCandidateData', () => {
  it('debería enviar datos del candidato correctamente', async () => {
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
```

### Pruebas de Componentes React

Para componentes React, utilizamos React Testing Library que nos permite probar el comportamiento del componente desde la perspectiva del usuario:

```javascript
// SimpleForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleForm from '../SimpleForm';

describe('SimpleForm', () => {
  const mockOnSubmit = jest.fn();
  
  it('debería mostrar error cuando el email no es válido', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'correo-invalido' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('Por favor, introduce un email válido');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
```

## Mocking

El mocking es una técnica fundamental en las pruebas unitarias. Nos permite reemplazar dependencias externas (como APIs, bases de datos, etc.) con versiones simuladas para aislar el código que queremos probar.

Ejemplos de mocks utilizados en nuestro proyecto:

1. **Mock de módulos completos**:
```javascript
jest.mock('axios');
```

2. **Mock de archivos estáticos**:
```javascript
jest.mock('../../assets/lti-logo.png', () => 'ruta-mock-logo');
```

3. **Mock de funciones**:
```javascript
const mockOnSubmit = jest.fn();
```

## Ejecución de Pruebas

Para ejecutar todas las pruebas del proyecto, simplemente ejecutamos:

```bash
npm test
```

Para ejecutar pruebas específicas, podemos usar patrones:

```bash
npm test -- mathUtils
```

## Buenas Prácticas

1. **Organización**: Mantener las pruebas junto al código que prueban, en un directorio `__tests__`.
2. **Nombres descriptivos**: Usar nombres descriptivos para las pruebas que indiquen claramente qué se está probando.
3. **Pruebas independientes**: Cada prueba debe ser independiente y no depender del estado de otras pruebas.
4. **Limpieza de mocks**: Limpiar los mocks después de cada prueba usando `afterEach(jest.clearAllMocks)`.
5. **Aserción única**: Cada prueba debería tener un propósito claro y verificar una sola cosa.
6. **Uso de setup y teardown**: Utilizar `beforeEach` y `afterEach` para código repetitivo de configuración.

## Recursos Adicionales

- [Documentación oficial de Jest](https://jestjs.io/es-ES/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Guía de Jest con TypeScript](https://github.com/kulshekhar/ts-jest)
- [Mockear peticiones HTTP con Jest](https://jestjs.io/docs/mock-functions)
