# Prompts utilizados para los tests BRT

## Solicitud inicial

```
Necesito que escribas tests unitarios de la aplicación de backend @backend. 

Los tests deben comprobar tanto la subida de datos por parte de los candidatos como el guardado en la base de datos.

Recuerda que para el guardado de datos debemos **mockear** los objetos encargados para que no se modifiquen realmente los datos en la base de datos.

Los tests deben crearse en el archivo @tests-BRT.test.ts 

Hazme las preguntas que necesites para llevar a cabo tu tarea.

No escribas código todavía. Dime qué pasos vás a seguir en orden para que yo te confirme con cuál procedemos.
```

## Respuesta y pasos a seguir

```
Para escribir tests unitarios para la aplicación de backend, seguiré estos pasos en orden:

1. Explorar la estructura del proyecto para entender la arquitectura y los componentes principales
2. Examinar los endpoints de la API para identificar las funcionalidades a testear
3. Revisar los modelos y esquemas de la base de datos para entender la estructura de datos
4. Analizar los controladores y servicios que gestionan la subida y guardado de datos
5. Identificar los componentes que necesitan ser mockeados para evitar modificaciones reales en la base de datos
6. Crear los tests unitarios enfocados en la subida de datos y el guardado en la base de datos
7. Configurar los mocks necesarios para simular las operaciones de base de datos
```

## Estructura propuesta para los tests

```
// Sección 1: Importaciones y configuración de mocks
import { PrismaClient } from '@prisma/client';
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { uploadFile } from '../application/services/fileUploadService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mocks para los modelos de dominio
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

// Mock para PrismaClient
jest.mock('@prisma/client');

// Sección 2: Tests de validación de datos
describe('Validación de datos de candidato', () => {
  // Tests para el validador
});

// Sección 3: Tests para el servicio de candidatos
describe('Servicio de candidatos', () => {
  // Tests para addCandidate
});

// Sección 4: Tests para el controlador de candidatos
describe('Controlador de candidatos', () => {
  // Tests para el controlador
});

// Sección 5: Tests para la carga de archivos
describe('Servicio de carga de archivos', () => {
  // Tests para uploadFile
});

// Sección 6: Tests de integración
describe('Flujo completo de registro de candidatos', () => {
  // Tests para el flujo completo
});
```

## Preguntas y correcciones

```
Por qué estás haciendo el mock del @validator.ts ?
```

Respuesta:
```
Estoy haciendo un mock del `validator.ts` principalmente por dos razones:

1. **Aislamiento de pruebas**: Al mockear el validador, podemos probar el comportamiento del servicio `addCandidate` de forma aislada. Esto nos permite verificar que el servicio llama correctamente al validador con los datos correspondientes, sin que el resultado de las pruebas dependa del funcionamiento interno del validador.

2. **Simplificación de pruebas**: Para las pruebas del servicio y del controlador, no necesitamos probar nuevamente la lógica de validación (ya la probamos en la sección de tests del validador). Al mockear el validador, evitamos tener que crear datos perfectamente válidos para cada prueba del servicio y controlador, lo que simplifica nuestros test cases.
```

Corrección solicitada:
```
Si, modifica test para que se use el validador real, ya que ese servicio en concreto no necesita interactuar con la infraestructura directamente.
```

## Estrategia para corrección de errores

```
Me parece correcto el enfoque. Antes de ejecutar los tests, hay un error en el linter de typescript en las líneas.
```

```
Centrémonos en conrregir en el paso 1. Corregimos el candidateService
```

```
Vamos a corregir los tests relacionados con el servicio de carga de archivos.
```

## Comandos utilizados

Para ejecutar los tests:
```
npm test
```
