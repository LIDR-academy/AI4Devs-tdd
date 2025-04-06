# Prompts Optimizados para Tests Unitarios en Jest

Este documento contiene varios prompts optimizados para crear tests unitarios en Jest para la funcionalidad de inserción de candidatos en un sistema ATS (Applicant Tracking System). La idea con cada prompt es ir conjugándolos para mejorar el resultado.
## IDE utilizado: CURSOR con Claude Sonnet 3.7.

## Prompt 1: Enfoque estructurado por componentes

```
Actúa como un ingeniero de software experimentado, experto en TDD. Genera tests unitarios en Jest para un sistema ATS que permita insertar candidatos. El código debe seguir TDD y cubrir:

1. Tests para la validación de datos del formulario:
   - Validación de campos obligatorios (nombre, email, teléfono)
   - Formato correcto de email y teléfono
   - Manejo de datos opcionales

2. Tests para el guardado en base de datos con Prisma:
   - Inserción correcta de un candidato válido
   - Manejo de errores de base de datos
   - Verificación de la integridad de los datos guardados

Implementa mocks para Prisma siguiendo las mejores prácticas. Estructura el código con describe/it y comentarios explicativos. El resultado debe ser un archivo tests-iniciales.test.ts completo y funcional.
```

## Prompt 2: Enfoque basado en casos de uso

```
Crea un archivo tests-iniciales.test.ts con tests unitarios en Jest para la funcionalidad de inserción de candidatos en un ATS. Sigue estos casos de uso:

- CUANDO se reciben datos válidos del formulario, ENTONCES se validan correctamente
- CUANDO faltan campos obligatorios, ENTONCES se rechazan los datos
- CUANDO los datos son válidos, ENTONCES se guardan correctamente en la base de datos
- CUANDO hay un error en la base de datos, ENTONCES se maneja adecuadamente

Utiliza mocks para Prisma para evitar modificar la base de datos real. Aplica TDD y buenas prácticas como AAA (Arrange-Act-Assert). Incluye comentarios que expliquen la lógica de cada test.
```

## Prompt 3: Enfoque técnico detallado

```
Desarrolla tests unitarios en Jest para un módulo de inserción de candidatos en un ATS, siguiendo estas especificaciones técnicas:

1. Configuración:
   - Importa jest.mock() para Prisma
   - Configura beforeEach/afterEach para limpiar mocks

2. Tests de validación (mínimo 3):
   - Test para validar estructura completa de datos
   - Test para validar formatos (email, teléfono)
   - Test para validar campos obligatorios vs opcionales

3. Tests de persistencia (mínimo 2):
   - Test para verificar llamada correcta a Prisma.candidate.create
   - Test para manejo de excepciones de base de datos

Implementa mocks que simulen respuestas de Prisma tanto exitosas como fallidas. El código debe seguir principios SOLID y patrones de testing modernos. Guarda el resultado como tests-iniciales.test.ts.
```

## Prompt 4: Enfoque de aprendizaje guiado

```
Como experto en TDD y testing con Jest, crea tests unitarios para un sistema de inserción de candidatos en un ATS. El código debe:

1. Demostrar buenas prácticas de testing:
   - Separación clara entre tests de UI/validación y tests de persistencia
   - Uso de fixtures o factories para datos de prueba
   - Implementación de mocks para Prisma siguiendo la documentación oficial

2. Incluir tests específicos para:
   - Validación de datos del formulario (campos, formatos, reglas de negocio)
   - Operaciones de base de datos (inserción exitosa, manejo de errores)

Añade comentarios didácticos que expliquen cada decisión de diseño y patrón implementado. El resultado debe ser un archivo tests-iniciales.test.ts que sirva como ejemplo de calidad para estudiantes de desarrollo con IA.
```

## Prompt 5: Enfoque general optimizado

```
Necesito crear tests unitarios en Jest para la funcionalidad de inserción de candidatos en un sistema ATS (Applicant Tracking System). El código ya tiene implementada una versión básica que permite insertar candidatos a través de un formulario web y también vía API desde múltiples fuentes.

Requisitos específicos:
1. Crear tests que cubran la recepción de datos del formulario (validación, transformación de datos)
2. Crear tests para el proceso de guardado en base de datos usando Prisma
3. Seguir principios de TDD y buenas prácticas de testing
4. Implementar mocks para Prisma para evitar alterar la base de datos real

Por favor, genera un archivo tests-iniciales.test.ts completo con:
- Tests para validar los datos recibidos del formulario (campos obligatorios, formatos, etc.)
- Tests para verificar el correcto guardado en base de datos
- Implementación de mocks para Prisma
- Estructura clara siguiendo las convenciones de Jest

Incluye comentarios explicativos sobre el propósito de cada test y las buenas prácticas aplicadas.
```
