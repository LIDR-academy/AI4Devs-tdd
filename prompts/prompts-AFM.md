# Andres Felipe Marin - TDD

**IDE utilizado:** `Cursor en chat modo Agente con LLM auto`  
**Fecha de la conversación:** 2025-04-06


• Ok.  Te recuerdo el contexto del proyecto.  Es un ATS.  Vamos a generar las primeras pruebas unitarias para la recepción de los datos del formulario que agrega candidatos al sistema, antes de generar el
   código necesario dime si entiendes el contexto, que archivos se utiilizan en la recepción de datos  y en que archivo escribirías los tests.  Puedes preguntarme lo que creas necesario

 • No conozco los detalles de el controlador o servicio que maneja la recepción de datos.  Por ahora podemos validar que simplemente siempre traiga nombre apellido y correo electrónico

 • Por favor crea todos los tests en el archivo test-AFM.test.js

 • Si, implementemos validaciones en las pruebas, utilizando las funciones reales en el código

 • No podemos crear archivos adicionales, todas las pruebas deben escribirse utilizando el código existente

 • Te recuerdo que el sistema envía la data del formulario a la url /candidates del backend.  Puedes agregar las funciones utilizadas en ese back a los tests?

 • No.  Nada del código debe ser modificado

 • 2

 • Ahora agrega validación en los tests para el campo teléfono en la recepción de datos, debería tener un formato adecuado

 • Corrige el siguiente error


 • Ahora vamos a añadir los tests para validar la información recibida de Educación del candidato

 • Corrige este error

 • Corrige el error


 • Perfecto Educación.  Ahora vamos a crear los test para validar Experiencia laboral.  Por lo que veo, se aceptan datos muy similares a los de Educación

 • Corrige el error

 • veo que has hecho cambios en el archivo validator.ts deberías deshacer estos cambios y revisar los tests para que no se vean afectados

 • corrige el error.  Recuerda que únicamente se puede modificar el archivo de tests

 • Ahora vamos a generar tests unitarios para verificar el guardado en base de datos de los candidatos del sistema ATS

 • Corrige los errores, recuerda que no se debe modificar ningún archivo del código salvo los de tests