# Backend - Validator
## Pregunta inicial sobre la función validateCandidateData:
* "Como experto en testing, tomando en cuenta las buenas practicas de pruebas unitarias, como casos límites o comportamientos no esperados, lista los casos de prueba que se necesitan crear para la función validateCandidateData."

## Solicitud de implementación de casos de prueba en Jest:
* "Implementa la lista de casos de pruebas que sugieres usando Jest. Toma en cuenta que Jest ya se tiene configurado. Antes de comenzar hazme las preguntas que necesites. No generes código aún."

## Aclaraciones sobre las funciones de validación y detalles adicionales:
* "Las funciones están definidas en validator.ts. Cada función lanza su propio mensaje de error. Genera datos de pruebas ficticios para España tomando como referencia la estructura definida en el esquema prisma schema.prisma. La función validateCandidateData se detiene con el primer error encontrado. Se utiliza Jest y Prisma."

## Solicitud de implementación de pruebas sin usar mocks:
* "No uses mocks, llama directamente a cada función con los datos ficticios correspondientes. Genera de nuevo el código de las pruebas."

## Solicitud de agregar casos de prueba para funciones adicionales:
* "Agrega los casos de prueba para las funciones validateEducation, validateExperience, validateCV, de igual forma toma en cuenta los valores limites y comportamientos no esperados. Antes de comenzar hazme las preguntas que necesites. No generes código aún."

## Aclaraciones adicionales para la implementación de pruebas:
* "No hay más campos adicionales a los ya definidos. Recuerda tomar en cuenta schema.prisma. Sí, además de validar que la fecha es válida, la fecha de inicio debe ser inferior a la fecha final, no pueden ser iguales. Sí, validar el dato cuando esté presente. No, solo validar los límites normales. Sí, se deben considerar las entradas no válidas."

## Solicitud de generar una lista de prompts en formato markdown:
* "¿Podrías generar en formato markdown una lista con todos mis prompts de esta conversación? Antes de generar hazme las preguntas que necesites. No generes la lista aún."

## Confirmación de detalles para la lista de prompts:
* "Incluye todas mis preguntas, aclaraciones y detalles adicionales que he generado. ¿alguna otra duda?"

# Backend - addCandidate
## Pregunta inicial sobre la función addCandidate:
* Como experto en testing, tomando en cuenta las buenas practicas de pruebas unitarias, como casos límites o comportamientos no esperados, lista los casos de prueba que se necesitan crear para la función @addCandidate 
Antes de comenzar hazme las preguntas que necesites. No generes los casos de prueba aún.

##· Aclaraciones:
1. Las reglas de validación estan aplicadas en la el archivo @validator.ts función validateCandidateData.
2. Los modelos están definidos en @schema.prisma .
3. No, solo ese código, los demás errores retornan mensajes sin código.
4. Si, se requieren mockear dado que dependen del ORM Prisma con PostgresSQL.
5. Se genera una exception la cual incluye el mensaje del error.
6. Esas claves con opcionales.

## Solicitud de implementación de casos de prueba en Jest:.
* Implementa la lista de casos de pruebas que sugieres usando Jest, TypeScript y  Jest-mock. Toma en cuenta que Jest ya se tiene configurado. En el mock de candidato asegurate de incluir los datos de un candidato constante como resultado de la operación guardar. Los datos que se requieran para las pruebas, genéralos para la comunidad Española.
Antes de comenzar hazme las preguntas que necesites. No generes código aún.

### Aclaraciones:
1. Si, incluyela para todos los modelos.
2. Si, incluyelos tanto con datos válidos como inválidos. Toma encuenta también los casos para los datos opcionales.
3. El único error específico es el código "P2002" para cuando se intenta guardar un email duplicado. Los demás seran los diferentes mensajes de error que se puedan presentar.
4. Si, tómalos en cuenta.
5. Si, usa ts-jest.

## Revisión de configuración
* Actualiza la configuración de los archivos @jest.config.js y @tsconfig.json  para que se puedan ejecutar exitosamente las pruebas definidas en @candidateService.tests.ts . 
Antes de comenzar hazme las preguntas que necesites. No generes código aún.

### Aclaraciones
1. Todas deben usar el mock de la clase Candidate.
2. No, es solo preventiva la revisión.
3. No, es solo preventiva la revisión.
4. Si.
5. Solamente que no se persistan los datos de las pruebas unitarias, que se usen modelos simulados con jest.mock

## Generación de test faltantes
* Genera el código necesario para implementar las dos consideraciones finales que sugieres.
Antes de comenzar hazme las preguntas que necesites. No generes código aún.

### Aclaraciones
1. Si, se deben cubrir el caso de prueba donde los datos son válidos y simular el guardado exitoso, también cubrir el caso donde los datos son inválidos y el guardado no es posible. Adicionalmente cubrir el caso donde se incluyan los datos opcionales.
2. Si, se requieren mockear los modelos Educations, WorkExperiences y Resume. 
3. Utiliza datos ficticios válidos e inválidos aplicados a la comunidad Española.

## Solicitud de listado de prompts
* ¿Podrías generar en formato markdown una lista con todos mis preguntas principales, mis respuestas y detalles adicionales de esta conversación? Antes de generar hazme las preguntas que necesites. No generes la lista aún.

### Aclaraciones
1. En orden cronológico.
2. Cada elemento de la lista destácalo con título que haga referencia al tema. Cada elemento de la lista debe ser literalmente lo que escribí, sin interpretar. No traducir, dejarlo en idioma original.
3. Cada interacción.





