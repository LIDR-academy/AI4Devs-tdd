Prompt1.

# Contexto

Estás actuando como un ingeniero de software senior con especialización en pruebas unitarias utilizando Jest en un entorno Node.js o JavaScript moderno. utiliza el @Codebase del proyecto que permite insertar candidatos a través de un formulario. La función principal se encarga de recibir los datos desde el formulario y luego almacenarlos en la base de datos usando un servicio o repositorio.

# Objetivo

Genera una suite de pruebas unitarias utilizando Jest para cubrir la funcionalidad de "insertar candidatos".

# Especificaciones funcionales

1. **Recepción de datos del formulario:**

   - Asegúrate de que se reciben todos los campos obligatorios:
   - Verifica que los datos sean validados correctamente (por ejemplo: el correo debe tener formato válido, el teléfono debe tener 10 dígitos).
   - Si faltan campos o los datos son inválidos, debe lanzarse un error.

2. **Guardado en base de datos:**
   - Simula (mock) el repositorio o servicio de persistencia de datos.
   - Verifica que se invoque el método de guardado con los datos correctos.
   - En caso de éxito, debe devolver una confirmación o el objeto insertado.
   - En caso de error en la base de datos, debe manejar la excepción correctamente.

# Requerimientos técnicos

- Utiliza Jest para toda la suite.
- Usa mocks para simular el acceso a la base de datos.
- Las pruebas deben estar separadas por `describe` para cada proceso (recepción y guardado).
- Cubre tanto casos exitosos como casos de error.
- Incluye pruebas para la función principal que orquesta todo (insertarCandidato).

# Formato esperado

Genera las pruebas en Jest en el archivo backend/src/tests/test-AFR.test.ts con:

- Mocks apropiados.
- Pruebas claras y legibles.
- Comentarios donde sea útil.
- Buenas prácticas de test unitario.

Antes de ejecutar dame el plan a seguir

---

Plan de Implementación
Análisis del Contexto
Identificar la estructura del proyecto
Localizar el archivo de pruebas objetivo (backend/src/tests/test-AFR.test.ts)
Verificar la existencia de los archivos relacionados con la funcionalidad de candidatos
Estructura de Pruebas
Crear bloques describe principales:
"Recepción de datos del formulario"
"Guardado en base de datos"
"Función principal insertarCandidato"
Implementación de Pruebas
a) Pruebas de Validación de Datos
Campos obligatorios
Validación de formato de email
Validación de formato de teléfono
Casos de error por datos inválidos
b) Pruebas de Persistencia
Mock del repositorio/servicio de base de datos
Verificación de llamadas al método de guardado
Pruebas de éxito en la inserción
Manejo de errores de base de datos
Organización del Código
Importaciones necesarias
Configuración de mocks
Definición de datos de prueba
Implementación de casos de prueba
Revisión y Optimización
Verificar cobertura de pruebas
Asegurar claridad en los mensajes de prueba
Optimizar la estructura de los tests

---

Prompt 2

1. De acuerdo
2. Unicamente "Recepción de datos del formulario" y
   "Guardado en base de datos"
   Dame el plan solo para estas 2 tareas

Prompt 3

Ejecuta e implementa este plan

Prompt 4

Corrige los errores

Propt 5
Ejecuta las pruebas

---

¡Excelente! Todas las pruebas han pasado correctamente:
✓ 7 pruebas pasadas de 7 totales
Las pruebas implementadas cubren los escenarios solicitados:
Recepción de datos del formulario:
✓ Validación de datos completos
✓ Validación de campos obligatorios
✓ Validación de formato de email
✓ Validación de formato de teléfono
Guardado en base de datos:
✓ Guardado exitoso
✓ Manejo de errores de base de datos
✓ Verificación de que no se guardan datos inválidos
La implementación ha sido exitosa y cumple con todos los requisitos especificados en el prompt original.

---
