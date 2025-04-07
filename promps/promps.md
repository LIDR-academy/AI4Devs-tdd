# Desarrollo Guiado por Pruebas (TDD) - Sistema de Gestión de Candidatos generado con cloud

## Requisitos y Objetivo

El objetivo de este proyecto es desarrollar un sistema para gestionar candidatos a empleos, específicamente implementando la funcionalidad de añadir candidatos (`addCandidate`) utilizando el enfoque TDD (Test-Driven Development).

## Pasos a Seguir

### 1. Definición de Requisitos

Se deben implementar los siguientes requisitos para la función `addCandidate`:

- Validar los datos del candidato antes de guardarlo en la base de datos
- Crear y guardar una instancia del modelo Candidato
- Gestionar información relacionada: educación, experiencia laboral y CV
- Manejar errores apropiadamente durante la validación y persistencia

### 2. Creación de Pruebas Iniciales

Debes diseñar las siguientes categorías de pruebas:

**Validación de datos del formulario:**
- Validación correcta para candidatos con datos completos
- Rechazo de candidatos con email inválido
- Rechazo de candidatos sin nombre o apellido
- Validación de fechas en educación y experiencia laboral

**Persistencia en base de datos:**
- Guardado correcto de un candidato en la base de datos
- Manejo de errores de la base de datos
- Verificación del guardado correcto de relaciones (educación, experiencia y CV)

### 3. Configuración del Entorno de Pruebas

Configura Jest con TypeScript para ejecutar las pruebas:
- Instala las dependencias necesarias
- Configura el archivo `jest.config.js`
- Crea mocks para simular los módulos y componentes necesarios

### 4. Implementación de los Mocks

Implementa mocks para:
- La función de validación `validateCandidateData`
- Los modelos de datos:
  - `Candidate`
  - `Education`
  - `WorkExperience`
  - `Resume`

### 5. Consideraciones para los Desafíos

**Mocks:**
- Implementa los mocks utilizando un enfoque de mockeo de módulo completo con `jest.mock()`
- No uses constantes simples para los mocks, ya que pueden causar problemas

**Tipificación:**
- Utiliza `jest.MockedFunction<typeof funcName>` para tipar correctamente los mocks
- Asegúrate de manejar correctamente la compatibilidad entre TypeScript y Jest

**Importaciones:**
- Configura los mocks antes de importar los módulos para evitar problemas de inicialización

### 6. Implementación de la Funcionalidad

Una vez que las pruebas estén correctamente configuradas, implementa la función `addCandidate` en el archivo `candidateService.ts`:
- Validación de datos usando la función `validateCandidateData`
- Creación y almacenamiento del candidato
- Manejo de relaciones (educación, experiencia laboral y CV)
- Manejo de errores

### 7. Ejecución y Verificación

Las pruebas deben verificar:
- La validación adecuada de los datos
- El guardado correcto de los candidatos
- El manejo adecuado de errores
- El establecimiento correcto de relaciones entre entidades

## Mejores Prácticas a Seguir

1. **Orden de Mockeo:** Configura los mocks antes de importar los módulos
2. **Tipado de Mocks:** En TypeScript usa `jest.MockedFunction<>` para mantener el tipado
3. **Aislamiento de Pruebas:** Limpia los mocks antes de cada prueba usando `beforeEach()`
4. **Estructura Apropiada:** Organiza las pruebas en bloques describe anidados para mejor legibilidad
5. **Mocks Específicos:** Crea mocks que reflejen la estructura real de las clases y módulos 