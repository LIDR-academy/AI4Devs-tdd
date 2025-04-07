# Prompt se utilizo Cursor con Claude 3.5 en modo agent 

## Introducción
La misión será crear una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos. 

## PROMPT 1
Como experto desarrollador de front necesito crear una suite de tests unitarios para la **inserción de candidatos en base de datos**, utilizando:

- **Prisma**
- **Jest** 
- **Simulación del guardado de datos usando Mocks**

Antes de realizar cualquier modificación me deberas preguntar todas las dudas que tengas y obtener mi aprobación.

La funcionalidad de insertar candidatos se enceuntra en el fichero Candidate.ts, simularemos la inserción en base de datos utilizando mocks.
Para los test utiliza el fichero @test-JERC.test.ts y considera todos los posibles casos de uso que puedan aplicar al dar de alta un candidato.

Respuesta:
Antes de proceder con la creación de los tests unitarios, necesito recopilar información importante y hacerte algunas preguntas clave.
Primero, permíteme buscar el archivo Candidate.ts para entender la implementación actual:

Basado en la implementación que he encontrado, tengo algunas preguntas antes de proceder con la creación de los tests:
¿Quieres que nos enfoquemos en probar específicamente el método save() de la clase Candidate, o también deberíamos incluir pruebas para el servicio addCandidate que maneja la lógica de negocio completa?
Observo que hay validaciones en el archivo validator.ts. ¿Deberíamos incluir casos de prueba para estas validaciones también?
Veo que un candidato puede tener relaciones con:
Education (educación)
WorkExperience (experiencia laboral)
Resume (CV)
¿Quieres que incluyamos casos de prueba para estas relaciones o nos enfocamos solo en los datos básicos del candidato?
He notado que hay manejo de errores específicos para:
Errores de conexión a la base de datos
Errores de registro no encontrado
Errores de restricción única (email duplicado)
¿Deberíamos incluir casos de prueba para estos escenarios de error?
¿Hay algún caso de uso específico que quieras que probemos con prioridad?
Una vez que me proporciones esta información, podré crear una suite de pruebas completa y bien estructurada que cubra todos los casos necesarios.

## PROMPT 2
1. enfocate en la persistencia en base de datos del candidate e inncluye pruebas para el servicio addCandidate
2. Si, incluye casos para las validaciones
3. Si, incluye casos de pruebas para estas relaciones
4. Si, incluye casos de pruebas para los escenarios de error

Respuesta:
Bien, veo que ya tenemos las dependencias necesarias para Jest. Ahora, necesito verificar si existe una configuración de Jest:

Antes de proceder con la implementación de los tests, necesito crear la configuración de Jest específica para el backend. Propongo crear un archivo jest.config.ts con la siguiente configuración

He implementado una suite completa de pruebas que cubre los siguientes escenarios:
1. Creación de Candidatos:
	- Creación básica de un candidato
	- Creación con educación
	- Creación con experiencia laboral
	- Creación con CV
2. Validaciones:
	- Validación de nombre inválido
	- Validación de email inválido
	- Validación de teléfono inválido
3. Errores de Base de Datos:
	- Error de conexión a base de datos
	- Error de email duplicado

Para ejecutar los tests, necesitarás ejecutar:
npm test

## PROMPT 3
al ejecutar "npm test" se produce el error:
Error: Jest: Failed to parse the TypeScript config file C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\backend\jest.config.ts   
  Error: Jest: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed
Error: Cannot find package 'ts-node' imported from C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-config\build\readConfigFileAndSetRootDir.js
    at readConfigFileAndSetRootDir (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-config\build\readConfigFileAndSetRootDir.js:116:13)
    at async readInitialOptions (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-config\build\index.js:403:13) 
    at async readConfig (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-config\build\index.js:147:48)
    at async readConfigs (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-config\build\index.js:424:26)        
    at async runCLI (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\@jest\core\build\cli\index.js:151:59)
    at async Object.run (C:\Users\jronc\Documents\MasterIA\AI4Devs-tdd\node_modules\jest-cli\build\run.js:130:37)


Respuesta:
El error indica que falta el paquete ts-node necesario para ejecutar los tests con TypeScript. Vamos a instalar las dependencias necesarias:
cd backend && npm install -D ts-node@9.1.1

También necesitamos instalar @types/jest y ts-jest para que funcionen los tests con TypeScript:
npm install -D @types/jest ts-jest

Ahora vamos a instalar las dependencias de Prisma que faltan:
npm install -D prisma @prisma/client

Parece que hay un conflicto de versiones. Vamos a intentar instalarlo con --legacy-peer-deps:
npm install -D prisma @prisma/client --legacy-peer-deps

Ahora que tenemos todas las dependencias instaladas, vamos a intentar ejecutar los tests:
npm test

Parece que hay un problema con la configuración de TypeScript. Vamos a cambiar el archivo de configuración de Jest a JavaScript:

Ahora vamos a eliminar el archivo de configuración en TypeScript ya que no lo necesitamos:

Vamos a intentar ejecutar los tests nuevamente:
npm test

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        2.032 s
Ran all test suites

## PROMPT 4
puedes corregir el test que ha fallado y ejecutarlo nuevamente.

Respuesta:
npm test

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.953 s