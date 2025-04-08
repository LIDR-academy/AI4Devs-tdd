# Backend de la Aplicación de Candidatos

Este repositorio contiene el backend para la aplicación de gestión de candidatos, implementando prácticas de TDD (Test-Driven Development).

## Estructura del Proyecto

```
backend/
├── prisma/              # Esquema de Prisma y configuración de BD
├── src/
│   ├── application/     # Lógica de aplicación
│   │   ├── services/    # Servicios para operaciones de negocio
│   │   └── validator.js # Validación de datos
│   ├── domain/          # Modelos de dominio
│   │   └── models/      # Entidades de dominio
│   └── tests/           # Pruebas unitarias
└── jest.config.js       # Configuración de Jest
```

## Tests Implementados

### 1. Tests de Validación de Datos

Ubicados en `/src/tests/tests-ACBG.test.js`, estos tests verifican que la validación de datos de candidatos funcione correctamente:

- Validación de nombres, emails y teléfonos
- Validación de fechas en educación y experiencia laboral
- Manejo de campos obligatorios y opcionales

### 2. Tests de Inserción en Base de Datos

También en `/src/tests/tests-ACBG.test.js`, estos tests verifican la inserción de candidatos en la base de datos:

- Inserción básica de candidatos
- Inserción de educación asociada al candidato
- Inserción de experiencia laboral
- Manejo de CVs
- Manejo de errores (duplicación de emails)

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Prisma** - ORM para interacción con la base de datos
- **Express** - Framework web
- **Jest** - Framework de testing

## Configuración para Desarrollo

### Requisitos Previos

- Node.js (v14+)
- npm

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con la configuración adecuada
```

3. Generar cliente de Prisma:
```bash
npx prisma generate
```

## Ejecutar los Tests

### Ejecutar todos los tests:

```bash
npm test
```

### Ejecutar un archivo de test específico:

```bash
npx jest src/tests/tests-ACBG.test.js
```

### Ejecutar test con cobertura:

```bash
npx jest --coverage
```

## Implementación del TDD

Este proyecto sigue el enfoque de Test-Driven Development (TDD):

1. **Rojo**: Escribir tests que fallan para definir el comportamiento deseado
2. **Verde**: Implementar el código mínimo necesario para pasar los tests
3. **Refactorizar**: Mejorar el código manteniendo el comportamiento

## Mocking 

Los tests utilizan técnicas de mocking para:

- Simular la base de datos Prisma
- Evitar dependencias externas
- Probar casos de error controlados

## Autor

Andrés Camilo Bonilla Guazú

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia MIT. 