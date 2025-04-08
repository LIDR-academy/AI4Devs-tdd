# ANDRES CAMILO BUITRAGO GOMEZ -  Pasos básicos para empezar a hacer Unit Testing con Jest

## Herramienta: Cursor Versión 0.47.8 en modo Agent/Claude-3.7-sonnet

## Prompt_1

# Eres un experto desarrollador de software y tu enfoque principal es la del Testing

### **Contexto**:
Empezar a hacer pruebas a nuestro código puede resultar abrumador al principio. 
¿Qué necesito? ¿Qué debo probar? ¿Cuántas pruebas son muchas pruebas?.

Estas son algunas de las preguntas que me llegan a la mente cuando decido empezar a realizar testing en un proyecto. 
Por eso, en esta oportunidad requiero aprender los pasos básicos para empezar a hacer Unit Testing con Jest.


**Tu misión** principal es ayudarme a resolver problemas complejos de desarrollo de software, proporcionar fragmentos de código, depurar soluciones y ofrecer asesoramiento experto sobre las mejores prácticas de codificación.
Tendras la habilidad de preparar proyectos para poder ejecutar tests unitarios desde consola usando el comando npm test.
	- Ejemplo:
		1. Empecemos con los pasos básicos para empezar a realizar Unit Testing.:
			- Contexto: [Unit-Testing/jestjs](https://medium.com/@angelygranados/c%C3%B3mo-empezar-a-hacer-unit-testing-con-jest-gu%C3%ADa-b%C3%A1sica-ca6d9654672)
		2. Empecemos escribiendo una prueba para una función hipotética que suma dos números. Primero, crea un archivo suma.js:
			- Contexto: [jestjs.io](https://jestjs.io/es-ES/docs/getting-started)
	- Recuerda que el código está escrito en Typescript. La mejor opción es utilizar ts-jest: [ts-jest](https://github.com/kulshekhar/ts-jest)
		|--------------------------------------------------|	
		|	               |         using npm             |
		|------------------|-------------------------------|				   
		|Prerequisites     |`npm i -D jest typescript`     |
		|Installing        |`npm i -D ts-jest @types/jest` |
		|Creating config   |`npx ts-jest config:init`      |      
		|Running tests     |`npm test or npx jest`         |
		|--------------------------------------------------|


### **Consideraciones y reglas** 
- Siempre responder en el idioma Español "LATAM" No importa en que lenguaje te escriba, siempre en español. 
- Siempre debes entregar tus respuestas en formato markdown con toda la sintaxis que se utiliza y con la estructura de tipo "Curso". 
- Lo requiero para publicarlo en un repositorio en GitHub como un "README.md". 
**Debe contener Título, motivación, tabla de contenido, introducción, objetivos, etc. ** 
- Explicar las cosas en **lenguaje sencillo y claro**. 
- Usa **analogías del mundo real** siempre que sea posible. 
- Mantenga las respuestas por debajo de **200 palabras** a menos que se especifique lo contrario. 
- **No** asumas conocimientos previos de conceptos avanzados. 
- Siempre ser especifico con el paso a paso de las instrucciones técnicas de ejeciciones para poderlas realizar.
	Ejemplo: 
	- Hacer Descargas o Actualizaciones: 
		1. Ir al siguiente enlace "(Blender)[https://www.blender.org/download/]", En el Botón azul "Descrgar Blender" dar click y descargar. 
		2. Ejecutar el archivo descargado para iniciar la descarga. 
		3. Una vez completada la descarga, extrae el archivo donde quieras: en el escritorio, en la carpeta de documentos o donde prefieras. 
		La carpeta extraída contiene los archivos de la aplicación: todo lo necesario para ejecutar Blender. 
	
	- Hacer "Fork" del repositorio original Desde la página principal del repositorio que te han compartido, haz clic en el botón Fork (arriba a la derecha). 
	Esto creará una copia (fork) en tu propio perfil de GitHub. 

	- Clonar tu repositorio forkeado En tu repositorio (bajo tu usuario), haz clic en el botón verde Code. 
	Copia la URL (HTTPS o SSH, según tu preferencia). 
	En tu terminal local, ejecuta: `git clone <URL_DEL_REPOSITORIO>` Esto descargará el proyecto en tu máquina local.
- Lo que No entiendas por favor preguntar, recuerda que estamos trabajando desde VsCode en windows 10
- (BONIFICACIÓN) Aunque para esta sesión no es necesario, si alguno de los tests requiere modificar algo en base de datos, recuerda que lo ideal cuando las pruebas unitarias requieren interacción con base de datos, es mockearla para no alterar los datos. Puedes encontrar más información para este caso concreto en la documentación de prisna, [prisma](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client)




- Debemos subir las actualizaciones al repositorio, para evitar confusiones.
	1. creemos una rama nueva en el repositorio clonado de nombre "solved-test-ACBG".
	2. Siempre ayudame en el procesos de subir actualizaciones a los repositorios desde los comandos especificos hasta una breve explicación de su uso.
**Siempre debes comunicar los cambios en los códigos y documenros realizados con sus respectivas especificaciones**


## Prompt_2
Ayudamé a entender los errores y registremos este resultado usando "npm test", y cuales  y porque son las soluciones por favor

## Prompt_3
vamos muy bien. Recuerda que tu eres el experto, pero aún así, te recuerdo: 
**No Olvidar** debemos documentar en "markdown" en formato "Curso", todo el proceso, revisar el summary. **OJO, debe ser en español y respetando la sintaxis y protegiendonos de caer en el error de copy right. Siempre citar las referencias de consulta al final**

## Prompt_4
Muchas gracias!
Dame un reporte de estado por favor de nuestro trabajo.
-En que estado se encuentra.
-Que sigue?
- Que sugieres?

## Prompt_5
Te parece util si guardamos esta información "Estado del Proyecto de Testing con Jest-Estado Actual" que muy profesionalmente me suministras para que lo puedas tomar como contexto para un futuro desarrollo?

## Prompt_6
Actua como si Ya has realizado una versión básica de la funcionalidad de inserción de nuevos candidatos. Se trata de un componente clave de un ATS, ya que los datos de los candidatos son el activo más valioso. En el ejercicio normalmente se usa un formulario web para insertar nuevos candidatos, que puede ser una interfaz muy útil para RRHH y hiring managers, pero se recibirán vía API desde múltiples fuentes, como aplicación directa del candidato, o sistemas de parsing automatizado.

Vamos a ver el potencial que tiene aplicar TDD para garantizar que el sistema se comporta como debe.

1. **Tu misión** ahora será crear una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos. Apóyate en los documentos que hemos creado y utiliza el contexto del proyecto para identificar aquellos tests que puedan ser relevantes en este caso.

	- **Pista 1**: hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos. Queremos ver tests que cubran ambos procesos con al menos un test.



2. Aplica las buenas prácticas de programación y doscumentación siempre que sea posible como lo venimos realizando.

3. No olvides revisar lo que me muestras y retocarlo para adaptarlo a nuestras necesidades, corrigiendo o incluso borrando lo que consideres adecuado. 

4. Debemos entregar como un pull request en el repositorio que solo incluya:

	- Los tests en un fichero tests-iniciales.test.ts en la carpeta backend/src/tests
	- Completar el ejercicio: rellenar el archivo de test
	- Crear una nueva rama para tu entregable con el nombre tests-ACBG
	- Hacer commit
	- Empuje de Git
5. Si tienes dudas sobre el ejercicio, pregunta.

6. No olvidar actualizar toda la "documentación" que venimos generando por favor.

## Prompt_7
Antes de hacer el Pull Request en GitHub, podemos hacer la prueba aca en local?

## Prompt_8
Me puedes ayudar por favor verificando si ya esta actualzado el repositorio o si debemos actualizarlo para hacer un "commit" final antes de hacer el PR?

## Prompt_9
lo voy hacer por ti, y te voy mostrando los resultados

## Prompt_10
Antes de subirlo, necesito por favor que cambiemos la palabra "test-iniciales" por "test-ACBG" ya que la definicion de "iniciales" es en contexto de las iniciales de mi nombre "Andres Camilo Buitrago Gómes "= "ACBG":

Si me entiendes?
Y Debe ser en todo el proyecto, donde aparezca "tests-iniciales.test.js", debes cambiar por favor por "tests-ACBG.test.js

## Prompt_11
Perfecto, antes de hacer el PR. Me puedes ayudar con esto ultimo por favor:
1. Verificar que la documentación que venimos trabajando, este actualizada. Y de ser posible, alojemos estos documentos todos en una misma carpeta que se llame "Reference_documentation" en la raiz del proyecto de la rama creada.
2. Voy anexar manualmente un documento llamado "prompts-ACBG.md", por favor verificala que si la veas y me confirmas en que ubicación quedo alojado.
3. Hagamos una última prueba y anexa el procedimiento y resultado de esta última prueba como parte de una especie de coclusión final en nuestra documentación.
4. Si te queda facil, por favor genera un Diagrama educativo y bien creativo en donde se plasme el contexto de los TDD desarrollados en este proyecto. Pudes usar mermaid que corre bien en GitHub.
5. Siempre recuerda que tu eres el experto, pero aún así, te recuerdo: 
**No Olvidar** debemos documentar en "markdown" en formato "Curso", todo el proceso, revisar el summary. **OJO, debe ser en español y respetando la sintaxis y protegiendonos de caer en el error de copy right. Siempre citar las referencias de consulta al final**

## Prompt_12
si  pudiste generar el Diagrama que te pedí? Y en donde lo puedo ver?

## Prompt_13
Actualicemos la documentación que venimos trabajado y me gustaría que con esto último conformemos un pequeño "README" para anexarlo en la descripción del PR.

Te parece?