Eres un experto software developer en testing y devops.
Analiza la estructura del proyecto en contexto e indicame las dudas que tengas sobre la parte del backend.
---
En esta ocasión nos vamos a centrar en el punto 1, el de testing. 
Por el momento no hay tests implementados.
Los test correrán con ts-jest.
Por el momento no escribas nada de código, sólo comprueba que el entorno ts-jest esta correctamente preparado.
---
Por el momento vamos a centrarnos en la ubicación de los tests. Los test estarán ubicados en la carpeta backend/src/tests.
El fichero de tests se llamará tests-CNV.tests.ts
---
Vamos a centrarnos en el backend para los tests.
La aplicacion se trata de un ATS.
Analiza el código del backend para ubicar las funcionalidad de recepcion de datos del formulario y lista las funciones involucradas.
No escribas nada de código.
---
Genera los tests pertinentes para la validacion de datos.
La estructura de los tests debe seguir el patrón AAA (Arrange-Act-Assert).
Los tests deberán ir debidamente parametrizados para evitar repetir código.
Deberán incluir mensajes de afirmación, es decir, cada prueba incluirá un texto indicando cual debería de ser el resultado correcto de ese test.
Los tests deberán incluir los casos límite para los diferentes tipos de datos que se traten.
---
He hecho un par de correcciones en la parte del email invalido y del teléfono.
En la parte de validacion de CV, revisa que mas casos de formatos de fecha incorrecta podrian añadirse a los tests
---
Ahora vamos a centrarnos en los tests de la parte servicio de candidatos. Concretamente en lo referente a guardar en la base de datos.
Al igual que con los tests anteriores, cíñete al patron AAA
Parametriza las funciones para evitar la duplicidad del código
Incluye mensajes de afirmación
Prueba casos límite
De momento las pruebas referentes a escribir en la base de datos obvialas
---
los tests de la parte de canditatos también tienen que ir en el archivo @tests-CNV.tests.ts
---
Lista los errores de linter pero no corrijas nada todavía
---
cuando te dije en un prompt anterior "De momento las pruebas referentes a escribir en la base de datos obvialas" me referia a que la parte de mocking de base de datos no debia de implementarse.
Indicame los tests implementados referentes a la parte de servicio de candidatos que no incluyen mock de base de datos.
---
No, vamos a lanzar los tests de la parte de servicio de candidatos que no implique mock de base de datos
---
No, analiza que es lo que esta fallando en la parte de mocks y listalo sin realizar modificaciones aún
---
Es decir, el mock para esos campos los tiene definidos como never y no estan haciendo match con el tipo del campo id, code, etc?
---
explora la definicion de tipos pero sin modificar código alguno
---
Si se sabe el tipo de datos que retorna Prima, no se puede castear los mocks para que hagan match con el tipo de datos esperado?
---
No realices modificaciones
---
Con esta solucion, Puede ser que los tests puedan dar falsos positivos o negativos debido al casteo?
---
si, procede a implementar los tests de esa forma en la que tenemos mocks parciales, validacion de datos y tests específicos
---
Si, resuelve el restor de errores relacionados con never
---
Vamos con el punto 4, Revisar la configuración de TypeScript para asegurarnos de que los tipos de Jest están correctamente configurados.
---
Ya se ha instalado prisma/client en el directorio backend
---
No, deshaz los ultimos cambios que has hecho en canditateservice.ts


