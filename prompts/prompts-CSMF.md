**Copilot for VSCode**

**Prompt 1**

Eres un experto en javascript y en tests unitarios.
Genera una batería de tests para el método addCandidate en el fichero /backend/src/tests/tests-CSMF.test.ts.
Hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos.
Los tests deben cubrir ambas familias de tests. Los tests deben seguir las buenas prácticas más recomendadas: Patrón Arrange-Act-Assert, Parametrización, Pruebas de casos límite.

**Prompt 2 y 3**

Revisa el error en consola (+ provide Terminal selection)

**Prompt 4**

Solo quedan 3 tests fallando, parecen estar relacionados con añadir datos a un array no inicializado.
¿Es posible que se puedan corregir los tests utilizando conditional chaining?

**Copilot ha encontrado un error en el código de candidateService.ts que, al ser corregido, ya pasan los tests unitarios correctamente**
