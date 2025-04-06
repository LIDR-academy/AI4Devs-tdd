# IDE
Cursor

# Prompt 1
## Descripción del objetivo
- Necesitamos completar el proyecto actual (tienes una descripción detallada en @README.md) para poder empezar a implementar su testing haciendo uso de ts-jest.

## Contexto
- Antes de proporcionar cualquier respuesta, asegúrate de haber analizado todo el proyecto (codebase)
- Actuas como software engineer, experto en el desarrollo en node.js, javascript, typescript, persistencia vía Prisma ORM, testing con Jest, etc
- Siempre dime qué cambios planteas, no abordes ninguno directamente. Si tienes dudas, pregunta.
- Todos los test que generemos deberán ir bajo backend/src/tests/tests-cfr-test.ts. No podemos generar ningún otro fichero

## Tareas a realizar

- Para asegurarme que has entendido bien el proyecto, dame la visión que has obtenido de él al analizarlo
- Debemos centrarnos exclusivamente en el **testing unitario**. En este primer bloque, asegúrate de indicarme todo lo necesario para poder incluirlo en el proyecto.
- Si es necesario, podemos incluir algún test dummy para validar

# Prompt 2
Perfecto, ahora que tenemos la estructura base, vamos con el siguiente paso.

## Contexto
- Todos los tests deben cubrir buenas prácticas a nivel de documentación
- Quiero trabajar con AAA
- No quiero modificar datos en base de datos, por lo que será necesario trabajar con mocks cuando sea el caso.
- Recuerda que todos los tests generados deben ir en el fichero backend/src/tests/tests-cfr-test.ts

## Tests a implementar
Debemos cubrir los siguientes escenarios:
- Datos de validación para la recepción de formularios con datos de candidatos
- Guardado de datos de candidatos en base de datos. Es necesario validar el candidato y sus datos relacionados (educación, experiencia y CV)


# Prompt 3
Hay un fallo, me puedes ayudar?


# Prompt 4
He ido por la opción de modificar backend/src/tests/tests-cfr-test.ts porque me parece mucho más adecuada, no quiero tocar nada más. Pero tengo un nuevo error, me puedes ayudar?

# Prompt 5
Sigo teniendo algún error en la inicialización del mock, por favor, revisa y busca otra alternativa

# Prompt 6
Limpia de código innecesario y documenta siguiendo buenas prácticas

# Prompt 7
Necesito generar una PR que describa, en detalle, todos los trabajos relativos al testing unitario que hemos realizado en el fichero @tests-cfr-test.ts . Por favor, genera en sintaxis markdown


